import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomerLayout from '../../components/layouts/CustomerLayout'
import { useAuth } from '../../context/AuthContext'
import { getMyProfile, createVehicle, createPolicy } from '../../services/api'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

const sectionLabel = (text) => (
  <div className="text-primary fw-bold text-uppercase mb-3" style={{ fontSize: 11, letterSpacing: '0.05em' }}>
    {text}
  </div>
)

export default function ApplyPolicy() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    category: 'Car',
    make: '',
    model: '',
    year: '',
    vin: '',
    registrationNumber: '',
    color: '',
    fuelType: 'Petrol',
    coverageType: 'Comprehensive',
    startDate: '',
    endDate: ''
  })
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (auth?.userId) {
      getMyProfile()
        .then(res => setCustomer(res))
        .catch(() => setCustomer(null))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [auth])

  const validate = () => {
    const e = {}
    if (!form.make.trim() || form.make.length < 2) e.make = 'Make must be at least 2 characters.'
    if (!form.model.trim() || form.model.length < 2) e.model = 'Model must be at least 2 characters.'
    if (!form.year || form.year < 1980 || form.year > 2027) e.year = 'Year must be between 1980 and 2027.'
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(form.vin.toUpperCase())) e.vin = 'VIN must be exactly 17 characters (excluding I, O, Q).'
    if (!form.registrationNumber || form.registrationNumber.length < 4 || form.registrationNumber.length > 20) e.registrationNumber = 'Registration number must be 4-20 characters.'
    if (!/^[a-zA-Z\s]+$/.test(form.color)) e.color = 'Color must contain letters only.'
    if (!form.startDate) {
      e.startDate = 'Start date is required.'
    } else {
      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const dd = String(today.getDate()).padStart(2, '0')
      const todayStr = `${yyyy}-${mm}-${dd}`
      if (form.startDate < todayStr) {
        e.startDate = 'Start date must be today or in the future.'
      }
    }
    if (!form.endDate) e.endDate = 'End date is required.'
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
      e.endDate = 'End date must be after start date.'
    }
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setValidationErrors(e2); return }

    setSubmitting(true)
    setError(null)
    setValidationErrors({})

    try {
      // 1. Create the Vehicle
      const vehicleRes = await createVehicle({
        category: form.category,
        make: form.make,
        model: form.model,
        year: parseInt(form.year),
        vehicleIdentificationNumber: form.vin.toUpperCase(),
        registrationNumber: form.registrationNumber,
        color: form.color,
        fuelType: form.fuelType
      })

      // 2. Create the Policy
      await createPolicy({
        customerId: customer.customerId,
        vehicleId: vehicleRes.vehicleId,
        coverageType: form.coverageType,
        premiumAmount: 0,
        startDate: form.startDate,
        endDate: form.endDate
      })

      navigate('/customer/my-policy')
    } catch (err) {
      setError(err.message || 'Failed to apply for policy.')
    } finally {
      setSubmitting(false)
    }
  }

  const f = (key, label, type = 'text', opts = {}) => (
    <div>
      <label className="form-label fw-semibold text-dark" style={{ fontSize: 13 }}>{label}</label>
      {opts.select ? (
        <select
          className="form-select"
          value={form[key]}
          onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        >
          {opts.options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          className={`form-control ${validationErrors[key] ? 'is-invalid' : ''}`}
          value={form[key]}
          onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        />
      )}
      {validationErrors[key] && <div className="invalid-feedback">{validationErrors[key]}</div>}
    </div>
  )

  return (
    <CustomerLayout>
      {/* Header */}
      <div className="position-relative overflow-hidden border-bottom border-border" style={{ background: 'rgba(166,61,47,0.08)' }}>
        <div className="position-relative mx-auto px-4 py-4" style={{ maxWidth: 800 }}>
          <h1 className="font-serif text-dark m-0" style={{ fontSize: 26, fontWeight: 400 }}>Apply for Policy</h1>
          <p className="text-secondary mt-2 mb-0" style={{ fontSize: 14 }}>Register your vehicle and select your coverage options.</p>
        </div>
      </div>

      <div className="mx-auto px-4 py-4" style={{ maxWidth: 800 }}>
        {loading ? (
          <LoadingSpinner message="Checking eligibility..." />
        ) : !customer ? (
          <div className="text-center py-5 text-secondary">
            <p className="text-dark fw-semibold mb-1" style={{ fontSize: 16 }}>Profile Required</p>
            <p style={{ fontSize: 14 }}>You must complete your profile before applying for a policy.</p>
            <button onClick={() => navigate('/customer/profile/edit')} className="btn btn-primary fw-semibold mt-3 px-4">
              Complete Profile
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3 border border-border p-4 shadow-sm">
            {error && <div className="alert alert-danger py-2 mb-4" style={{ fontSize: 14 }}>{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              {/* Vehicle Details */}
              {sectionLabel('Vehicle Details')}
              <div className="row g-3 mb-3">
                <div className="col-md-3">
                  <label className="form-label fw-semibold text-dark" style={{ fontSize: 13 }}>Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}>
                    <option value="Car">Car</option>
                    <option value="Truck">Truck</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Camper Van">Camper Van</option>
                  </select>
                </div>
                <div className="col-md-3">{f('make', 'Make')}</div>
                <div className="col-md-3">{f('model', 'Model')}</div>
                <div className="col-md-3">{f('year', 'Year', 'number')}</div>
              </div>
              <div className="row g-3 mb-4">
                <div className="col-md-5">{f('vin', 'VIN (17 chars)')}</div>
                <div className="col-md-3">{f('registrationNumber', 'Registration No.')}</div>
                <div className="col-md-2">{f('color', 'Color')}</div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold text-dark" style={{ fontSize: 13 }}>Fuel Type</label>
                  <select className="form-select" value={form.fuelType} onChange={e => setForm(prev => ({ ...prev, fuelType: e.target.value }))}>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
              </div>

              {/* Policy Details */}
              {sectionLabel('Policy Details')}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark" style={{ fontSize: 13 }}>Coverage Type</label>
                <select className="form-select" value={form.coverageType} onChange={e => setForm(prev => ({ ...prev, coverageType: e.target.value }))}>
                  <option value="ThirdParty">Third Party Liability (Basic)</option>
                  <option value="Collision">Collision</option>
                  <option value="Comprehensive">Comprehensive</option>
                </select>
              </div>
              <div className="row g-3 mb-4">
                <div className="col-md-6">{f('startDate', 'Start Date', 'date')}</div>
                <div className="col-md-6">{f('endDate', 'End Date', 'date')}</div>
              </div>

              <div className="d-flex justify-content-end gap-3">
                <button type="button" onClick={() => navigate(-1)} disabled={submitting} className="btn btn-outline-secondary fw-semibold px-4">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary fw-semibold px-4">
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}
