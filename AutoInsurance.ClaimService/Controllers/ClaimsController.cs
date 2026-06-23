using System.Security.Claims;
using AutoInsurance.ClaimService.DTOs;
using AutoInsurance.ClaimService.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoInsurance.ClaimService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClaimsController : ControllerBase
{
    private readonly IClaimService _service;

    public ClaimsController(IClaimService service) => _service = service;

    [HttpGet]
    [Authorize(Roles = "Admin,Agent")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Agent,Customer")]
    public async Task<IActionResult> GetById(int id)
    {
        var claim = await _service.GetByIdAsync(id);
        if (claim is null) return NotFound();

        if (!IsStaff() && claim.OwnerUserId.ToString() != CallerUserId())
            return NotFound();

        return Ok(claim);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Agent,Customer")]
    public async Task<IActionResult> Create([FromBody] ClaimCreateDto dto)
    {
        var created = await _service.CreateAsync(dto);
        if (created is null)
            return BadRequest(new { message = "Policy not found, or policy is not Active." });

        return CreatedAtAction(nameof(GetById), new { id = created.ClaimId }, created);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin,Agent")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] ClaimUpdateStatusDto dto)
    {
        var updated = await _service.UpdateStatusAsync(id, dto);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    private bool IsStaff() => User.IsInRole("Admin") || User.IsInRole("Agent");
    private string? CallerUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);
}