using AutoInsurance.AuthService.Data;
using AutoInsurance.AuthService.Middleware;
using AutoInsurance.AuthService.Repositories.Implementations;
using AutoInsurance.AuthService.Repositories.Interfaces;
using AutoInsurance.AuthService.Services.Implementations;
using AutoInsurance.AuthService.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace AutoInsurance.AuthService
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<AuthDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddScoped<IAuthRepository, AuthRepository>();
            builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
            builder.Services.AddScoped<IAuthService, AuthService1>();

            builder.Services.AddHttpClient<INotificationApiClient, NotificationApiClient>(client =>
            {
                client.BaseAddress = new Uri(builder.Configuration["ServiceUrls:NotificationService"] ?? "https://localhost:7006");
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
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

            app.UseCors("AllowAll");
            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();

            await app.RunAsync();
        }
    }
}