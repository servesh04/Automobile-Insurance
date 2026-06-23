using AutoInsurance.PolicyService.DTOs;
using AutoInsurance.PolicyService.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AutoInsurance.PolicyService.Controllers;

[ApiController]
[Route("api/[controller]")]   
public class PoliciesController : ControllerBase
{
    private readonly IPolicyService _service;

    public PoliciesController(IPolicyService service) => _service = service;

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Customer")]
    public async Task<IActionResult> GetById(int id)
    {
        var policy = await _service.GetByIdAsync(id);
        if (policy is null) return NotFound();

        var isStaff = User.IsInRole("Admin");
        if (!isStaff)
        {
            var callerUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (policy.OwnerUserId.ToString() != callerUserId)
                return NotFound();
        }

        return Ok(policy);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] PolicyCreateDto dto)
    {
        var created = await _service.CreateAsync(dto);
        if (created is null)
            return BadRequest(new { message = "Invalid CustomerId or VehicleId." });  

        return CreatedAtAction(nameof(GetById), new { id = created.PolicyId }, created); 
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] PolicyUpdateDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}