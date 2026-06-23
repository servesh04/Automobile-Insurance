using System.ComponentModel.DataAnnotations;

namespace AutoInsurance.CustomerService.Validation;

public class MinimumAgeAttribute : ValidationAttribute
{
    private readonly int _minimumAge;

    public MinimumAgeAttribute(int minimumAge)
    {
        _minimumAge = minimumAge;
    }

    public override bool IsValid(object? value)
    {
        if (value is not DateOnly dob)
            return false;

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (dob > today)
            return false;   // reject future dates of birth

        var age = today.Year - dob.Year;
        if (dob > today.AddYears(-age))
            age--;

        return age >= _minimumAge;
    }
}