using AutoInsurance.PolicyService.ApiClients.Implementations;
using AutoInsurance.PolicyService.ApiClients.Interfaces;
using AutoInsurance.PolicyService.Data;
using AutoInsurance.PolicyService.Middleware;
using AutoInsurance.PolicyService.Repositories.Implementations;
using AutoInsurance.PolicyService.Repositories.Interfaces;
using AutoInsurance.PolicyService.Services.Implementations;
using AutoInsurance.PolicyService.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text;
using System.Text.Json;

namespace AutoInsurance.PolicyService;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddDbContext<PolicyDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddScoped<IPolicyRepository, PolicyRepository>();
        builder.Services.AddScoped<IPolicyService, PolicyService1>();
        builder.Services.AddHttpContextAccessor();

        var serviceUrls = builder.Configuration.GetSection("ServiceUrls");
        builder.Services.AddHttpClient<ICustomerApiClient, CustomerApiClient>(client =>
        {
            client.BaseAddress = new Uri(serviceUrls["CustomerService"]!);
        });
        builder.Services.AddHttpClient<IVehicleApiClient, VehicleApiClient>(client =>
        {
            client.BaseAddress = new Uri(serviceUrls["VehicleService"]!);
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

        builder.Services.Configure<ApiBehaviorOptions>(options =>
        {
            options.InvalidModelStateResponseFactory = context =>
            {
                var errors = context.ModelState
                    .Where(e => e.Value!.Errors.Count > 0)
                    .SelectMany(e => e.Value!.Errors.Select(err => err.ErrorMessage))
                    .ToList();

                return new BadRequestObjectResult(new
                {
                    success = false,
                    message = "Validation failed.",
                    errors
                });
            };
        });

        var app = builder.Build();

        using (var scope = app.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<PolicyDbContext>();
            await context.Database.MigrateAsync();
        }

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseMiddleware<ExceptionHandlingMiddleware>();

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
        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseMiddleware<JwtMiddleware>();
        app.UseAuthorization();
        app.MapControllers();

        await app.RunAsync();
    }
}