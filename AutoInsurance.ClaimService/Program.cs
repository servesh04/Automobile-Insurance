using System.Text;
using AutoInsurance.ClaimService.ApiClients.Implementations;
using AutoInsurance.ClaimService.ApiClients.Interfaces;
using AutoInsurance.ClaimService.Data;
using AutoInsurance.ClaimService.Middleware;
using AutoInsurance.ClaimService.Repositories.Implementations;
using AutoInsurance.ClaimService.Repositories.Interfaces;
using AutoInsurance.ClaimService.Services.Implementations;
using AutoInsurance.ClaimService.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text.Json;

namespace AutoInsurance.ClaimService;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddDbContext<ClaimDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddScoped<IClaimRepository, ClaimRepository>();
        builder.Services.AddScoped<IClaimService, ClaimService1>();

        builder.Services.AddHttpContextAccessor();

        var serviceUrls = builder.Configuration.GetSection("ServiceUrls");
        builder.Services.AddHttpClient<IPolicyApiClient, PolicyApiClient>(client =>
        {
            client.BaseAddress = new Uri(serviceUrls["PolicyService"]!);
        });

        var jwt = builder.Configuration.GetSection("JwtSettings");
        var secretKey = jwt["SecretKey"]
            ?? throw new InvalidOperationException("JwtSettings:SecretKey is missing from configuration.");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwt["Issuer"],
                    ValidateAudience = true,
                    ValidAudience = jwt["Audience"],
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();

        builder.Services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Paste your JWT here (no 'Bearer ' prefix needed)."
            });
            options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
            {
                [new OpenApiSecuritySchemeReference("Bearer", document)] = new List<string>()
            });
        });

        var app = builder.Build();

        using (var scope = app.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ClaimDbContext>();
            await context.Database.MigrateAsync();
        }

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseMiddleware<ExceptionHandlingMiddleware>();

        app.UseStatusCodePages(async context =>
        {
            var response = context.HttpContext.Response;
            response.ContentType = "application/json";

            var message = response.StatusCode switch
            {
                401 => "You are not authenticated. Please provide a valid token.",
                403 => "You do not have permission to perform this action.",
                404 => "The requested resource was not found.",
                _ => "An error occurred while processing your request."
            };

            await response.WriteAsync(JsonSerializer.Serialize(new { success = false, message }));
        });

        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseMiddleware<JwtMiddleware>();
        app.UseAuthorization();
        app.MapControllers();

        await app.RunAsync();
    }
}