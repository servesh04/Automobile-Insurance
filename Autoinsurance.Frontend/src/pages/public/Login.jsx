import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { loginApi } from '../../services/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.username.trim()) e.username = 'Username is required.'
    if (!form.password) e.password = 'Password is required.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setLoading(true)
    try {
      const res = await loginApi({ username: form.username, password: form.password })
      login(res.token)
      const roles = res.roles || []
      if (roles.includes('Admin') || roles.includes('Agent'))
        navigate('/officer/dashboard')
      else
        navigate('/customer/my-policy')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid username or password.'
      setErrors({ password: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-4 bg-body"
      style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(166,61,47,0.05) 0, rgba(166,61,47,0.05) 1px, transparent 1px, transparent 20px)' }}
    >
      <div className="bg-white rounded-3 border border-border shadow-sm w-100 p-5" style={{ maxWidth: 400, borderLeft: '4px solid #A63D2F' }}>
        {/* Logo */}
        <div className="d-flex align-items-center justify-content-center gap-2 text-primary mb-4">
          <div className="position-relative">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 4 5v6c0 5.25 3.4 9.74 8 11 4.6-1.26 8-5.75 8-11V5z" />
            </svg>
            <span className="position-absolute top-0 end-0 rounded-circle bg-warning border border-white" style={{ width: 9, height: 9 }} />
          </div>
          <span className="fw-bold" style={{ fontSize: 18 }}>AutoInsurance</span>
        </div>

        <h1 className="font-serif text-dark text-center m-0 mb-1" style={{ fontSize: 28, fontWeight: 400 }}>Welcome back</h1>
        <p className="text-secondary text-center mb-4" style={{ fontSize: 14 }}>Log in to manage your policy</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold text-dark" style={{ fontSize: 13 }}>Username</label>
            <input
              type="text"
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="Enter your username"
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>

          <div className="mb-2">
            <label className="form-label fw-semibold text-dark" style={{ fontSize: 13 }}>Password</label>
            <div className="input-group has-validation">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Enter your password"
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
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <div className="d-flex justify-content-end mt-1">
              <Link to="/forgot-password" className="text-primary text-decoration-none" style={{ fontSize: 12 }}>Forgot password?</Link>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-100 fw-bold mt-3 py-2">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="d-flex justify-content-center mt-4" style={{ fontSize: 13 }}>
          <Link to="/register" className="text-primary fw-bold text-decoration-none">Create account</Link>
        </div>
      </div>
    </div>
  )
}