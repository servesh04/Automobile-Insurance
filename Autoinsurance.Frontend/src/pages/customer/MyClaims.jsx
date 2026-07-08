import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomerLayout from '../../components/layouts/CustomerLayout'
import StatusBadge from '../../components/shared/StatusBadge'
import { getMyClaims } from '../../services/api'

const STATUS_BORDER = {
  Approved: '#2D7D46',
  Rejected: '#D64045',
  Pending: '#B8860B',
}

const FILTERS = ['All', 'Pending', 'Approved', 'Rejected']

export default function MyClaims() {
  const navigate = useNavigate()
  const [claims, setClaims] = useState([])
  const [filter, setFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyClaims()
      .then(res => setClaims(Array.isArray(res) ? res : (res?.data || [])))
      .catch(() => setClaims([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = claims.filter(c => {
    const matchesFilter = filter === 'All' || c.claimStatus === filter;
    const matchesSearch = !searchQuery || 
      c.claimNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.incidentDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  })

  return (
    <CustomerLayout>
      <div className="mx-auto px-4 py-4" style={{ maxWidth: 800 }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="font-serif text-dark m-0" style={{ fontSize: 26, fontWeight: 400 }}>My Claims</h1>
          <button onClick={() => navigate('/customer/file-claim')} className="btn btn-primary fw-semibold">
            File a Claim
          </button>
        </div>

        {/* Filter tabs + Search bar */}
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
          <div className="d-flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`btn btn-sm rounded-pill fw-semibold ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={{ fontSize: 13 }}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="position-relative" style={{ width: '100%', maxWidth: 300 }}>
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Search claims..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C6E5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="position-absolute top-50 translate-middle-y" style={{ left: 14, pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        {loading && <p className="text-secondary">Loading your claims...</p>}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-5 text-secondary">
            <p style={{ fontSize: 16 }}>
              {filter === 'All' ? "You haven't filed any claims yet." : `No ${filter.toLowerCase()} claims.`}
            </p>
          </div>
        )}

        <div className="d-flex flex-column gap-3">
          {filtered.map(claim => (
            <div
              key={claim.claimId}
              className="rounded-3 p-4"
              style={{
                background: '#F5EDE0',
                border: '1px solid #E8D5B0',
                borderLeft: `4px solid ${STATUS_BORDER[claim.claimStatus] || '#B8860B'}`,
                transition: 'transform 0.15s',
                cursor: 'default',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="d-flex justify-content-between align-items-flex-start mb-2">
                <div>
                  <div className="text-secondary fw-semibold text-uppercase" style={{ fontSize: 11, letterSpacing: '0.04em' }}>Claim Number</div>
                  <div className="text-dark fw-semibold mt-1" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15 }}>{claim.claimNumber}</div>
                </div>
                <StatusBadge status={claim.claimStatus} />
              </div>
              <p className="text-dark mb-3" style={{ fontSize: 14, lineHeight: 1.5, color: '#5C3A2D' }}>{claim.incidentDescription}</p>
              <div className="row g-3">
                {[
                  { label: 'Incident Date', value: claim.incidentDate?.slice(0, 10) },
                  { label: 'Amount', value: `₹${claim.claimAmount}`, large: true },
                  { label: 'Submitted', value: claim.submittedAt?.slice(0, 10) },
                ].map(({ label, value, large }) => (
                  <div key={label} className="col-4">
                    <div className="text-secondary fw-semibold text-uppercase" style={{ fontSize: 11, letterSpacing: '0.04em' }}>{label}</div>
                    <div className="text-dark mt-1" style={{ fontSize: large ? 18 : 14, fontWeight: large ? 600 : 400 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CustomerLayout>
  )
}