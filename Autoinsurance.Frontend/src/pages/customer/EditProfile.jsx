import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomerLayout from '../../components/layouts/CustomerLayout'
import { useAuth } from '../../context/AuthContext'
import { getMyProfile, createCustomer } from '../../services/api'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

const sectionLabel = (text) => (
  <div className="text-primary fw-bold text-uppercase mb-3" style={{ fontSize: 11, letterSpacing: '0.05em' }}>
    {text}
  </div>
)

export default function EditProfile() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [profileExists, setProfileExists] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    fullName: auth?.fullName || '',
    email: '',
    phone: '',
    dateOfBirth: '',
    licenseNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  })
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (auth?.userId) {
      getMyProfile()
        .then(res => {
          if (res && res.data) setProfileExists(true)
        })
        .catch(() => setProfileExists(false))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [auth])

  const validate = () => {
    const e = {}
    if (!form.fullName.trim() || form.fullName.length < 2) {
      e.fullName = 'Full name must be at least 2 characters.'
    } else if (!/^[a-zA-Z\s]+$/.test(form.fullName)) {
      e.fullName = 'Full name can only contain letters and spaces.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Phone number must be exactly 10 digits.'

    if (!form.dateOfBirth) {
      e.dateOfBirth = 'Date of birth is required.'
    } else {
      const dob = new Date(form.dateOfBirth)
      const now = new Date()
      let age = now.getFullYear() - dob.getFullYear()
      const m = now.getMonth() - dob.getMonth()
      if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
        age--
      }
      if (age < 18) e.dateOfBirth = 'You must be at least 18 years old.'
    }

    if (!form.licenseNumber || form.licenseNumber.length < 5 || form.licenseNumber.length > 20) {
      e.licenseNumber = 'License number must be 5-20 characters.'
    }
    if (!form.address.trim()) e.address = 'Address is required.'
    if (!form.city.trim()) e.city = 'City is required.'
    if (!form.state.trim()) e.state = 'State is required.'
    if (!/^\d{6}$/.test(form.zipCode)) e.zipCode = 'Zip code must be exactly 6 digits.'

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
      await createCustomer(form)
      navigate('/customer/profile')
    } catch (err) {
      setError(err.message || 'Failed to create profile.')
    } finally {
      setSubmitting(false)
    }
  }

  const field = (key, label, type = 'text') => (
    <div>
      <label className="form-label fw-semibold text-dark" style={{ fontSize: 13 }}>{label}</label>
      <input
        type={type}
        className={`form-control ${validationErrors[key] ? 'is-invalid' : ''}`}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
      />
      {validationErrors[key] && <div className="invalid-feedback">{validationErrors[key]}</div>}
    </div>
  )

  return (
    <CustomerLayout>
      {/* Header */}
      <div className="position-relative overflow-hidden border-bottom border-border" style={{ background: 'rgba(166,61,47,0.08)' }}>
        <div className="position-relative mx-auto px-4 py-4" style={{ maxWidth: 800 }}>
          <h1 className="font-serif text-dark m-0" style={{ fontSize: 26, fontWeight: 400 }}>
            {profileExists ? 'Profile Complete' : 'Complete Your Profile'}
          </h1>
          <p className="text-secondary mt-2 mb-0" style={{ fontSize: 14 }}>
            {profileExists ? 'Your profile details are set.' : 'Please provide your details below.'}
          </p>
        </div>
      </div>

      <div className="mx-auto px-4 py-4" style={{ maxWidth: 800 }}>
        {loading ? (
          <LoadingSpinner message="Checking profile status..." />
        ) : profileExists ? (
          <div className="text-center py-5 text-secondary">
            <p className="text-dark fw-semibold mb-1" style={{ fontSize: 16 }}>Your profile is already set up.</p>
            <p style={{ fontSize: 14 }}>Due to security policies, you cannot edit your profile yourself.</p>
            <p style={{ fontSize: 14 }}>To update your details, please contact an Agent.</p>
            <button onClick={() => navigate('/customer/profile')} className="btn btn-primary fw-semibold mt-3 px-4">
              Back to Profile
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3 border border-border p-4 shadow-sm">
            {error && <div className="alert alert-danger py-2 mb-4" style={{ fontSize: 14 }}>{error}</div>}

            <form onSubmit={handleSubmit} noValidate>

              {/* Contact Information */}
              {sectionLabel('Contact Information')}
              <div className="row g-3 mb-4">
                <div className="col-md-6">{field('fullName', 'Full Name')}</div>
                <div className="col-md-6">{field('email', 'Email', 'email')}</div>
                <div className="col-md-6">{field('phone', 'Phone (10 digits)')}</div>
              </div>

              {/* Identity & License */}
              {sectionLabel('Identity & License')}
              <div className="row g-3 mb-4">
                <div className="col-md-6">{field('dateOfBirth', 'Date of Birth', 'date')}</div>
                <div className="col-md-6">{field('licenseNumber', 'License Number')}</div>
              </div>

              {/* Address */}
              {sectionLabel('Address')}
              <div className="mb-3">{field('address', 'Street Address')}</div>
              <div className="row g-3 mb-4">
                <div className="col-md-6">{field('city', 'City')}</div>
                <div className="col-md-3">{field('state', 'State')}</div>
                <div className="col-md-3">{field('zipCode', 'Zip Code (6 digits)')}</div>
              </div>

              <div className="d-flex justify-content-end gap-3">
                <button type="button" onClick={() => navigate(-1)} disabled={submitting} className="btn btn-outline-secondary fw-semibold px-4">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary fw-semibold px-4">
                  {submitting ? 'Saving Profile...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}
