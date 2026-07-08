using Ocelot.DependencyInjection;  
using Ocelot.Middleware;

namespace AutoInsurance.ApiGateway;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

        builder.Services.AddCors(options => { options.AddPolicy("AllowAll", policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()); });
        builder.Services.AddOcelot(builder.Configuration);

        var app = builder.Build();

        app.UseCors("AllowAll");
        await app.UseOcelot(); 

        await app.RunAsync();
    }
}