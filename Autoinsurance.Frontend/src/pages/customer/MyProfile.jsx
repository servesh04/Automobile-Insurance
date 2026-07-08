import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomerLayout from '../../components/layouts/CustomerLayout'
import { useAuth } from '../../context/AuthContext'
import { getMyProfile } from '../../services/api'

export default function MyProfile() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (auth?.userId)
      getMyProfile()
        .then(res => setProfile(res))
        .catch(() => setProfile(null))
        .finally(() => setLoading(false))
  }, [auth])

  const initials = (auth?.fullName || 'U')
    .trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('')

  const fields = profile ? [
    { label: 'Phone', value: profile.phone },
    { label: 'Date of birth', value: profile.dateOfBirth },
    { label: 'License number', value: profile.licenseNumber, mono: true },
    { label: 'Email', value: profile.email },
    { label: 'Address', value: `${profile.address}, ${profile.city}, ${profile.state} ${profile.zipCode}` },
  ] : []

  // simple completion — count non-empty fields
  const completionPct = profile
    ? Math.min(100, Math.round((Object.values(profile).filter(v => v && v !== '').length / 10) * 100))
    : 0

  return (
    <CustomerLayout>
      {/* Profile header — from design export */}
      <div className="text-center border-bottom border-border py-5 px-4" style={{ background: 'linear-gradient(to bottom, #F5EDE0, #FDFAF6)' }}>
        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3 fw-bold" style={{ width: 64, height: 64, fontSize: 22 }}>
          {initials}
        </div>
        <h2 className="font-serif text-dark m-0 mb-1" style={{ fontSize: 24, fontWeight: 400 }}>{auth?.fullName}</h2>
        <p className="text-secondary mb-3" style={{ fontSize: 14 }}>{auth?.username}</p>
        <span className="badge rounded-pill fw-semibold" style={{ background: '#FEF3C7', color: '#92400E', fontSize: 12, padding: '5px 14px' }}>
          Member since {profile?.createdAt ? new Date(profile.createdAt).getFullYear() : '2026'}
        </span>
      </div>

      <div className="mx-auto px-4 py-4" style={{ maxWidth: 800 }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          {/* Completion bar — from design export */}
          <div className="flex-grow-1 me-4">
            <div className="text-secondary mb-2" style={{ fontSize: 13 }}>Profile {completionPct}% complete</div>
            <div className="progress" style={{ height: 6 }}>
              <div className="progress-bar bg-primary" style={{ width: `${completionPct}%`, transition: 'width 0.6s ease' }} />
            </div>
          </div>
          <button onClick={() => navigate('/customer/profile/edit')} className="btn btn-primary fw-semibold text-nowrap">
            Edit Profile
          </button>
        </div>

        {loading && <p className="text-secondary">Loading profile...</p>}

        {!loading && profile && (
          <div className="card-fade-up bg-white border border-border rounded-3 overflow-hidden">
            {[
              { section: 'Contact information', items: fields.slice(0, 2) },
              { section: 'Identity & license', items: fields.slice(2, 4) },
              { section: 'Address', items: fields.slice(4) },
            ].map(({ section, items }, si) => (
              <div key={section} className={`p-4 ${si < 2 ? 'border-bottom border-border' : ''}`}>
                <div className="text-primary fw-bold text-uppercase mb-3" style={{ fontSize: 11, letterSpacing: '0.05em' }}>{section}</div>
                <div className="row g-3">
                  {items.map(({ label, value, mono }) => (
                    <div key={label} className="col-6">
                      <div className="text-secondary fw-semibold text-uppercase mb-1" style={{ fontSize: 11, letterSpacing: '0.04em' }}>{label}</div>
                      <div className="text-dark" style={{ fontSize: 14, fontFamily: mono ? "'JetBrains Mono', monospace" : undefined }}>{value || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}