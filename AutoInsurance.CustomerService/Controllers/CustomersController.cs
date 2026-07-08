using System.Security.Claims;
using AutoInsurance.CustomerService.DTOs;
using AutoInsurance.CustomerService.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoInsurance.CustomerService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _service;

    public CustomersController(ICustomerService service) => _service = service;

    [HttpGet]
    [Authorize(Roles = "Admin,Agent")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Agent,Customer")]
    public async Task<IActionResult> GetById(int id)
    {
        var customer = await _service.GetByIdAsync(id);
        if (customer is null) return NotFound();

        var isStaff = User.IsInRole("Admin") || User.IsInRole("Agent");
        if (!isStaff)
        {
            var callerUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (customer.UserId.ToString() != callerUserId)
                return NotFound();  
        }

        return Ok(customer);
    }

    [HttpGet("my-profile")]
    [Authorize]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var all = await _service.GetAllAsync();
        var customer = all.FirstOrDefault(c => c.UserId == userId);
        if (customer is null) return NotFound();
        return Ok(customer);
    }

    [HttpPost]
    [Authorize]   // any authenticated user (Admin, Agent, or a self-registering Customer)
    public async Task<IActionResult> Create([FromBody] CustomerCreateDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var created = await _service.CreateAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = created.CustomerId }, created);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Agent")]
    public async Task<IActionResult> Update(int id, [FromBody] CustomerUpdateDto dto)
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