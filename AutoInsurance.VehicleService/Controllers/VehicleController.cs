using AutoInsurance.VehicleService.DTOs;
using AutoInsurance.VehicleService.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoInsurance.VehicleService.Controllers;

[ApiController]
[Route("api/[controller]")]   // → /api/Vehicles
public class VehiclesController : ControllerBase
{
    private readonly IVehicleService _service;

    public VehiclesController(IVehicleService service) => _service = service;

    [HttpGet]
    [Authorize(Roles = "Admin,Agent")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Agent,Customer")]
    public async Task<IActionResult> GetById(int id)
    {
        var vehicle = await _service.GetByIdAsync(id);
        return vehicle is null ? NotFound() : Ok(vehicle);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Agent,Customer")]
    public async Task<IActionResult> Create([FromBody] VehicleCreateDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.VehicleId }, created);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Agent")]
    public async Task<IActionResult> Update(int id, [FromBody] VehicleUpdateDto dto)
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