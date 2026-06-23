using AutoInsurance.CustomerService.DTOs;
using AutoInsurance.CustomerService.Models;
using AutoInsurance.CustomerService.Repositories.Interfaces;
using AutoInsurance.CustomerService.Services.Interfaces;

namespace AutoInsurance.CustomerService.Services.Implementations
{
    public class CustomerService1 : ICustomerService
    {
        private readonly ICustomerRepository _repository;

        public CustomerService1(ICustomerRepository customerRepository) 
        {
            _repository = customerRepository;
        }

        public async Task<List<CustomerResponseDto>> GetAllAsync()
        {
            var customers = await _repository.GetAllAsync();
            return customers.Select(MapToDto).ToList();
        }

        public async Task<CustomerResponseDto?> GetByIdAsync(int id)
        {
            var customer = await _repository.GetByIdAsync(id);
            return customer is null ? null : MapToDto(customer);
        }

        public async Task<CustomerResponseDto> CreateAsync(CustomerCreateDto dto, int userId)
        {
            var customer = new Customer
            {
                UserId = userId,
                FullName = dto.FullName,
                Phone = dto.Phone,
                Email = dto.Email,
                DateOfBirth = dto.DateOfBirth,
                LicenseNumber = dto.LicenseNumber,
                Address = dto.Address,
                City = dto.City,
                State = dto.State,
                ZipCode = dto.ZipCode,
                CreatedAt = DateTime.Now
            };

            await _repository.AddAsync(customer);
            await _repository.SaveChangesAsync();
            return MapToDto(customer);
        }

        public async Task<bool> UpdateAsync(int id,CustomerUpdateDto dto)
        {
            var customer = await _repository.GetByIdAsync(id);
            if (customer is null) return false;

            customer.FullName = dto.FullName;
            customer.Email = dto.Email;
            customer.Phone = dto.Phone;
            customer.DateOfBirth = dto.DateOfBirth;
            customer.LicenseNumber = dto.LicenseNumber;
            customer.Address = dto.Address;
            customer.City = dto.City;
            customer.State = dto.State;
            customer.ZipCode = dto.ZipCode;

            _repository.Update(customer);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var customer = await _repository.GetByIdAsync(id);
            if(customer is null) return false;
            _repository.Delete(customer);
            await _repository.SaveChangesAsync();
            return true;
        }

        private static CustomerResponseDto MapToDto(Customer c)
        {
            var response = new CustomerResponseDto()
            {
                UserId = c.UserId,
                CustomerId = c.CustomerId,
                FullName = c.FullName,
                Email = c.Email,
                Phone = c.Phone,
                DateOfBirth = c.DateOfBirth,
                LicenseNumber = c.LicenseNumber,
                Address = c.Address,
                City = c.City,
                State = c.State,
                ZipCode = c.ZipCode,
                CreatedAt = c.CreatedAt
            };

            return response;
        }
        
    }
}
