using AutoInsurance.NotificationService.Services.Interfaces;
using MailKit.Net.Smtp;
using MimeKit;
using MimeKit.Text;

namespace AutoInsurance.NotificationService.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var email = new MimeMessage();
            var from = _config["SmtpSettings:From"];
            email.From.Add(MailboxAddress.Parse(from));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Plain) { Text = body };

            using var smtp = new SmtpClient();
            
            var host = _config["SmtpSettings:Host"];
            var port = int.Parse(_config["SmtpSettings:Port"] ?? "2525");
            var username = _config["SmtpSettings:Username"];
            var password = _config["SmtpSettings:Password"];

            
            await smtp.ConnectAsync(host, port, MailKit.Security.SecureSocketOptions.Auto);
            
            if (!string.IsNullOrEmpty(username))
            {
                await smtp.AuthenticateAsync(username, password);
            }

            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}
