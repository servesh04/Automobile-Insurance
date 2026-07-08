import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPasswordApi } from '../../services/api'
import { useNotification } from '../../context/NotificationContext'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { showNotification } = useNotification()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNotification('Enter a valid email address.', 'error')
      return
    }

    setLoading(true)
    try {
      const res = await forgotPasswordApi(email)
      showNotification(res.message, 'success')
      setEmail('')
    } catch (err) {
      showNotification(err.message, 'error')
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

        <h1 className="font-serif text-dark text-center m-0 mb-1" style={{ fontSize: 28, fontWeight: 400 }}>Forgot Password</h1>
        <p className="text-secondary text-center mb-4" style={{ fontSize: 14 }}>Enter your email to receive a reset link</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="form-label fw-semibold text-dark" style={{ fontSize: 13 }}>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-100 fw-bold mt-2 py-2">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="d-flex justify-content-center mt-4" style={{ fontSize: 13 }}>
          <Link to="/login" className="text-primary fw-bold text-decoration-none">← Back to Login</Link>
        </div>
      </div>
    </div>
  )
}
