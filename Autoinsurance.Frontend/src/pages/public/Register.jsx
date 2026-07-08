import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { registerApi } from "../../services/api";

function getStrength(password) {
  if (!password) return 0
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(score, 4)
}

function getStrengthLabel(score) {
  return ['', 'Weak', 'Fair', 'Good', 'Strong'][score] || ''
}

function getStrengthColors(score) {
  const filled = score > 0 ? (score >= 3 ? '#2D7D46' : score === 2 ? '#F4A828' : '#D64045') : '#E8D5B0'
  return Array.from({ length: 4 }, (_, i) => i < score ? filled : '#E8D5B0')
}

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '', password: '', confirmPassword: '', fullName: '', email: ""
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.username.trim())
      e.username = "Username is required."
    if (form.password.length < 6)
      e.password = "Password must be at least 6 characters."
    if (form.confirmPassword !== form.password)
      e.confirmPassword = "Passwords do not match."
    if (!form.fullName.trim())
      e.fullName = "Full name is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setLoading(true)
    try {
      const res = await registerApi({
        username: form.username,
        password: form.password,
        fullName: form.fullName,
        email: form.email
      })
      login(res.token)
      navigate("/customer/my-policy")
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setLoading(false)
    }
  }

  const strength = getStrength(form.password)
  const strengthColors = getStrengthColors(strength)
  const confirmMatches = form.confirmPassword && form.confirmPassword === form.password

  const sectionLabel = (text) => (
    <div className="text-primary fw-bold text-uppercase mb-3" style={{ fontSize: 11, letterSpacing: '0.04em' }}>
      {text}
    </div>
  )

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-4 bg-body"
      style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(166,61,47,0.05) 0, rgba(166,61,47,0.05) 1px, transparent 1px, transparent 20px)' }}
    >
      <div className="bg-white rounded-3 border border-border shadow-sm w-100 p-5" style={{ maxWidth: 420 }}>
        {/* Logo */}
        <div className="d-flex align-items-center justify-content-center gap-2 text-primary mb-4">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 4 5v6c0 5.25 3.4 9.74 8 11 4.6-1.26 8-5.75 8-11V5z" />
          </svg>
          <span className="fw-bold" style={{ fontSize: 18 }}>AutoInsurance</span>
        </div>

        <h1 className="font-serif text-dark text-center m-0 mb-1" style={{ fontSize: 26, fontWeight: 400 }}>Create your account</h1>
        <p className="text-secondary text-center mb-4" style={{ fontSize: 14 }}>Sign up to get a quote and manage your policy</p>

        {errors.submit && (
          <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 13 }}>{errors.submit}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Credentials section */}
          {sectionLabel('Account credentials')}

          <div className="mb-3">
            <label className="form-label fw-semibold text-dark" style={{ fontSize: 13 }}>Username</label>
            <input
              type="text"
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              value={form.username}
              onChange={set('username')}
              placeholder="Choose a username"
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-dark" style={{ fontSize: 13 }}>Password</label>
            <div className="input-group has-validation">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={form.password}
                onChange={set('password')}
                placeholder="At least 6 characters"
                style={{ borderRight: 0 }}
              />
              <button 
                className={`btn btn-outline-secondary ${errors.password ? 'border-danger' : 'border-border'}`} 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'transparent' }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
            {/* Password strength bar — from design export */}
            {form.password.length > 0 && (
              <div className="mt-2">
                <div className="d-flex gap-1 mb-1">
                  {strengthColors.map((color, i) => (
                    <div key={i} className="flex-grow-1 rounded-pill" style={{ height: 4, background: color, transition: 'background 0.2s' }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: strength >= 3 ? '#2D7D46' : strength === 2 ? '#B8860B' : '#D64045' }}>
                  {getStrengthLabel(strength)}
                </div>
              </div>
            )}
            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-dark" style={{ fontSize: 13 }}>Confirm password</label>
            <div className="input-group has-validation position-relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                placeholder="Re-enter your password"
                style={{ paddingRight: confirmMatches ? 36 : 12, borderRight: 0 }}
              />
              <button 
                className={`btn btn-outline-secondary ${errors.confirmPassword ? 'border-danger' : 'border-border'}`} 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ background: 'transparent' }}
              >
                {showConfirmPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
              {/* Checkmark animation — from design export */}
              {confirmMatches && (
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="#2D7D46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className="position-absolute top-50 translate-middle-y" style={{ right: 50, zIndex: 10 }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
          </div>

          {/* Divider */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="flex-grow-1 border-top border-border" />
            {sectionLabel('Your details')}
            <div className="flex-grow-1 border-top border-border" />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-dark" style={{ fontSize: 13 }}>Full name</label>
            <input
              type="text"
              className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
              value={form.fullName}
              onChange={set('fullName')}
              placeholder="Jordan Lee"
            />
            {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-dark" style={{ fontSize: 13 }}>Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={form.email}
              onChange={set('email')}
              placeholder="you@example.com"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-100 fw-bold py-2">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-secondary mt-4 mb-0" style={{ fontSize: 13 }}>
          Already have an account?{' '}
          <Link to="/login" className="text-primary fw-bold text-decoration-none">Login</Link>
        </p>
      </div>
    </div>
  )
}