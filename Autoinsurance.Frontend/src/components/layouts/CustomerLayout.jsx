import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function CustomerLayout({ children }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const navLinkClass = (path) =>
    `btn btn-link text-decoration-none fw-semibold p-0 border-0 border-bottom border-2 ${
      pathname === path
        ? 'text-white border-white'
        : 'text-white text-opacity-50 border-transparent'
    }`

  return (
    <div className="min-vh-100 bg-body">
      <nav className="bg-primary d-flex align-items-center justify-content-between px-4" style={{ height: 64 }}>
        {/* Brand */}
        <div className="d-flex align-items-center gap-2 text-white fw-bold" style={{ fontSize: 16 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 4 5v6c0 5.25 3.4 9.74 8 11 4.6-1.26 8-5.75 8-11V5z" />
          </svg>
          <span>AutoInsurance</span>
        </div>

        {/* Nav links */}
        <div className="d-flex align-items-center gap-4">
          <button onClick={() => navigate('/customer/my-policy')} className={navLinkClass('/customer/my-policy')} style={{ fontSize: 14, paddingBottom: 2 }}>My Policy</button>
          <button onClick={() => navigate('/customer/my-claims')} className={navLinkClass('/customer/my-claims')} style={{ fontSize: 14, paddingBottom: 2 }}>My Claims</button>
          <button onClick={() => navigate('/customer/profile')} className={navLinkClass('/customer/profile')} style={{ fontSize: 14, paddingBottom: 2 }}>My Profile</button>

          <button
            onClick={() => { logout(); navigate('/login') }}
            className="btn btn-outline-light d-flex align-items-center gap-2 fw-semibold"
            style={{ fontSize: 13, padding: '6px 14px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </nav>
      {children}
    </div>
  )
}