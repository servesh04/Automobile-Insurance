using AutoInsurance.NotificationService.DTOs;
using AutoInsurance.NotificationService.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AutoInsurance.NotificationService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public NotificationsController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] NotificationRequestDto request)
        {
            if (string.IsNullOrEmpty(request.To) || string.IsNullOrEmpty(request.Subject) || string.IsNullOrEmpty(request.Body))
            {
                return BadRequest("To, Subject, and Body are required.");
            }

            try
            {
                await _emailService.SendEmailAsync(request.To, request.Subject, request.Body);
                return Ok(new { Success = true, Message = "Email sent successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }
    }
}
