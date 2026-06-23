using AutoInsurance.CustomerService.DTOs;

namespace AutoInsurance.CustomerService.Services.Interfaces
{
    public interface ICustomerService
    {
        Task<List<CustomerResponseDto>> GetAllAsync();
        Task<CustomerResponseDto?> GetByIdAsync(int id);
        Task<CustomerResponseDto> CreateAsync(CustomerCreateDto dto, int userId);
        Task<bool> UpdateAsync(int id, CustomerUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
