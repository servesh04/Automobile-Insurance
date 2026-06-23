using AutoInsurance.CustomerService.Data;
using AutoInsurance.CustomerService.Models;
using AutoInsurance.CustomerService.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AutoInsurance.CustomerService.Repositories.Implementations
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly CustomerDbContext _context;
        public CustomerRepository(CustomerDbContext context)
        {
            _context = context;
        }

        public async Task<List<Customer>> GetAllAsync() => await _context.Customers.ToListAsync();

        public async Task<Customer?> GetByIdAsync(int id) => await _context.Customers.FindAsync(id);

        public async Task AddAsync(Customer customer) => await _context.Customers.AddAsync(customer);

        public void Update(Customer customer) => _context.Customers.Update(customer);

        public void Delete(Customer customer) => _context.Customers.Remove(customer);

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}
