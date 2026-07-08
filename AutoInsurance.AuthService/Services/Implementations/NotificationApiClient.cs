using System.Text;
using System.Text.Json;
using AutoInsurance.AuthService.Services.Interfaces;

namespace AutoInsurance.AuthService.Services.Implementations
{
    public class NotificationApiClient : INotificationApiClient
    {
        private readonly HttpClient _httpClient;

        public NotificationApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> SendEmailAsync(string to, string subject, string body)
        {
            var payload = new { to, subject, body };
            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("/api/Notifications/send", content);
            return response.IsSuccessStatusCode;
        }
    }
}
