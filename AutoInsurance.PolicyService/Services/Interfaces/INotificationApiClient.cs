namespace AutoInsurance.PolicyService.Services.Interfaces
{
    public interface INotificationApiClient
    {
        Task<bool> SendEmailAsync(string to, string subject, string body);
    }
}
