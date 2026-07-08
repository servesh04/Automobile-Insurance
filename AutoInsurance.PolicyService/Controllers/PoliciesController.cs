using AutoInsurance.PolicyService.DTOs;
using AutoInsurance.PolicyService.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AutoInsurance.PolicyService.Controllers;

public record PolicyStatusUpdateDto(string Status);

[ApiController]
[Route("api/[controller]")]   
public class PoliciesController : ControllerBase
{
    private readonly IPolicyService _service;

    public PoliciesController(IPolicyService service) => _service = service;

    [HttpGet]
    [Authorize(Roles = "Admin,Agent")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("my-policies")]
    [Authorize]
    public async Task<IActionResult> GetMyPolicies()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var all = await _service.GetAllAsync();
        var mine = all.Where(p => p.OwnerUserId == userId).ToList();
        return Ok(mine);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Agent,Customer")]
    public async Task<IActionResult> GetById(int id)
    {
        var policy = await _service.GetByIdAsync(id);
        if (policy is null) return NotFound();

        var isStaff = User.IsInRole("Admin") || User.IsInRole("Agent");
        if (!isStaff)
        {
            var callerUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (policy.OwnerUserId.ToString() != callerUserId)
                return NotFound();
        }

        return Ok(policy);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Agent,Customer")]
    public async Task<IActionResult> Create([FromBody] PolicyCreateDto dto)
    {
        var created = await _service.CreateAsync(dto);
        if (created is null)
            return BadRequest(new { message = "Invalid CustomerId or VehicleId." });  

        return CreatedAtAction(nameof(GetById), new { id = created.PolicyId }, created); 
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin,Agent")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] PolicyStatusUpdateDto statusDto)
    {
        var updated = await _service.UpdateStatusAsync(id, statusDto.Status);
        return updated ? NoContent() : NotFound();
    }

    public record QuoteUpdateDto(decimal PremiumAmount);

    [HttpPut("{id}/quote")]
    [Authorize(Roles = "Admin,Agent")]
    public async Task<IActionResult> GenerateQuote(int id, [FromBody] QuoteUpdateDto dto)
    {
        var updated = await _service.QuoteAsync(id, dto.PremiumAmount);
        return updated ? NoContent() : NotFound();
    }

    [HttpPut("{id}/pay")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> Pay(int id)
    {
        // Add ownership check
        var policy = await _service.GetByIdAsync(id);
        if (policy is null) return NotFound();
        var callerUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (policy.OwnerUserId.ToString() != callerUserId) return NotFound();

        var updated = await _service.PayAsync(id);
        return updated ? NoContent() : NotFound();
    }

    [HttpPost("{id}/upload-document")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> UploadDocument(int id, IFormFile file)
    {
        // Add ownership check
        var policy = await _service.GetByIdAsync(id);
        if (policy is null) return NotFound();
        var callerUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (policy.OwnerUserId.ToString() != callerUserId) return NotFound();

        if (file == null || file.Length == 0) return BadRequest("File is empty");
        
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension)) return BadRequest("Only image files are allowed.");

        // Mock upload URL
        var url = $"/mock-uploads/{Guid.NewGuid()}{extension}";
        
        var updated = await _service.UploadDocumentAsync(id, url);
        return updated ? Ok(new { url }) : NotFound();
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Agent")]
    public async Task<IActionResult> Update(int id, [FromBody] PolicyUpdateDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Agent")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}