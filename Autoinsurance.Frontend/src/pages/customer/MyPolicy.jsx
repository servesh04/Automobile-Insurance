import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CustomerLayout from "../../components/layouts/CustomerLayout";
import StatusBadge from "../../components/shared/StatusBadge";
import { useAuth } from '../../context/AuthContext'
import { getMyPolicies } from "../../services/api";
import { useNotification } from '../../context/NotificationContext';

function getPolicyProgress(policy) {
  if (!policy?.startDate || !policy?.endDate) return { pct: 0, monthsRemaining: 0 }
  const start = new Date(policy.startDate)
  const end = new Date(policy.endDate)
  const now = new Date()
  const total = end - start
  const elapsed = Math.min(Math.max(now - start, 0), total)
  const pct = Math.round((elapsed / total) * 100)
  const msLeft = Math.max(end - now, 0)
  const monthsRemaining = Math.round(msLeft / (1000 * 60 * 60 * 24 * 30))
  return { pct, monthsRemaining }
}

export default function MyPolicy() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(null)
  const [paying, setPaying] = useState(null)
  const [filter, setFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const loadPolicy = () => {
    getMyPolicies().then(res => {
      setPolicies(res || [])
    })
      .catch(() => setPolicies([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadPolicy()
  }, [auth])

  const handleUpload = async (e, policyId) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(policyId)
    try {
      const { uploadPolicyDocument } = await import('../../services/api')
      await uploadPolicyDocument(policyId, file)
      showNotification('Document uploaded successfully. Proposal is back in review.', 'success')
      loadPolicy()
    } catch (err) {
      showNotification(err.message || 'Failed to upload document.', 'error')
    } finally {
      setUploading(null)
    }
  }

  const handlePay = async (policyId) => {
    setPaying(policyId)
    try {
      const { payPremium } = await import('../../services/api')
      await payPremium(policyId)
      showNotification('Payment successful! Your policy is now active.', 'success')
      loadPolicy()
    } catch (err) {
      showNotification(err.message || 'Payment failed.', 'error')
    } finally {
      setPaying(null)
    }
  }

  const FILTERS = ['All', 'Active', 'ProposalSubmitted', 'QuoteGenerated', 'InfoRequested', 'Rejected', 'Expired']
  const filteredPolicies = policies.filter(p => {
    const matchesFilter = filter === 'All' || p.policyStatus === filter;
    const matchesSearch = !searchQuery ||
      p.policyNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vehicleDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.coverageType?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <CustomerLayout>
      {/* Hero header */}
      <div className="position-relative overflow-hidden border-bottom border-border" style={{ background: 'rgba(166,61,47,0.08)' }}>
        <svg width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="#A63D2F" strokeWidth="0.6"
          className="position-absolute top-50 translate-middle-y"
          style={{ right: -30, opacity: 0.08, pointerEvents: 'none' }}>
          <path d="M12 2 4 5v6c0 5.25 3.4 9.74 8 11 4.6-1.26 8-5.75 8-11V5z" />
        </svg>
        <div className="position-relative mx-auto px-4 py-4 d-flex align-items-center justify-content-between gap-3" style={{ maxWidth: 800 }}>
          <h1 className="font-serif text-dark m-0" style={{ fontSize: 26, fontWeight: 400 }}>My Policies</h1>
          <button onClick={() => navigate('/customer/apply')} className="btn btn-outline-primary fw-semibold">
            Apply for New Policy
          </button>
        </div>
      </div>

      <div className="mx-auto px-4 py-4" style={{ maxWidth: 800 }}>
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
              placeholder="Search policies..."
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

        {loading && <p className="text-secondary">Loading your policies...</p>}

        {!loading && policies.length === 0 && (
          <div className="text-center py-5 text-secondary">
            <p className="text-dark fw-semibold mb-1" style={{ fontSize: 16 }}>No policies found.</p>
            <p style={{ fontSize: 14 }}>You can apply for a new policy online.</p>
            <button onClick={() => navigate('/customer/apply')} className="btn btn-primary fw-semibold mt-3 px-4">
              Apply Now
            </button>
          </div>
        )}

        {!loading && policies.length > 0 && filteredPolicies.length === 0 && (
          <div className="text-center py-5 text-secondary">
            <p style={{ fontSize: 16 }}>No policies match your search or filter.</p>
          </div>
        )}

        {!loading && filteredPolicies.map(policy => {
          const progress = getPolicyProgress(policy);
          return (
            <div key={policy.policyId} className="card-fade-up bg-white border border-border rounded-3 overflow-hidden mb-4">
              {/* Dark header zone */}
              <div className="bg-dark text-white p-4 d-flex align-items-flex-start justify-content-between gap-3">
                <div>
                  <div className="text-white text-opacity-50 fw-semibold text-uppercase mb-1" style={{ fontSize: 12, letterSpacing: '0.04em' }}>Policy Number</div>
                  <div className="fw-semibold" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20 }}>{policy.policyNumber}</div>
                  <span className="badge rounded-pill mt-2 text-white fw-semibold" style={{ background: 'rgba(255,255,255,0.15)', fontSize: 12 }}>
                    {policy.coverageType}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                  {policy.policyStatus === 'Active' && (
                    <span className="pulse-dot rounded-circle" style={{ width: 8, height: 8, background: '#34D399', display: 'inline-block' }} />
                  )}
                  <StatusBadge status={policy.policyStatus} />
                </div>
              </div>

              {/* Light cream body zone */}
              <div className="bg-light p-4">

                {policy.policyStatus === 'ProposalSubmitted' && (
                  <div className="alert alert-warning py-3 mb-4" role="alert">
                    <strong>Proposal Submitted!</strong> Your policy is currently under review by our agents. We will generate a quote for you soon.
                  </div>
                )}

                {policy.policyStatus === 'Rejected' && (
                  <div className="alert alert-danger py-3 mb-4" role="alert">
                    <strong>Proposal Rejected.</strong> Your policy proposal has been rejected by our agents.
                  </div>
                )}

                {policy.policyStatus === 'InfoRequested' && (
                  <div className="alert alert-danger py-3 mb-4" role="alert">
                    <strong>Additional Information Required!</strong> Our agents have requested more details. Please upload a supporting document (image).
                  </div>
                )}

                {policy.policyStatus === 'QuoteGenerated' && (
                  <div className="alert alert-success py-3 mb-4 d-flex justify-content-between align-items-center" role="alert">
                    <div>
                      <strong>Quote Generated!</strong> A premium of ₹{policy.premiumAmount} has been calculated for your policy.
                    </div>
                    <button onClick={() => handlePay(policy.policyId)} disabled={paying === policy.policyId} className="btn btn-success fw-semibold px-3 ms-3">
                      {paying === policy.policyId ? 'Paying...' : 'Pay Now'}
                    </button>
                  </div>
                )}

                {/* Premium hero */}
                {policy.premiumAmount > 0 && policy.policyStatus === 'Active' && (
                  <div className="d-inline-flex align-items-baseline gap-2 bg-body border border-border rounded-3 px-3 py-2 mb-4">
                    <span className="font-serif text-primary lh-1" style={{ fontSize: 48 }}>₹{policy.premiumAmount}</span>
                    <span className="text-secondary" style={{ fontSize: 14 }}>/mo premium</span>
                  </div>
                )}

                {/* Field grid */}
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div className="text-secondary fw-semibold text-uppercase mb-1" style={{ fontSize: 12, letterSpacing: '0.04em' }}>Vehicle</div>
                    <div className="text-dark fw-medium" style={{ fontSize: 15 }}>🚗 {policy.vehicleDescription}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-secondary fw-semibold text-uppercase mb-1" style={{ fontSize: 12, letterSpacing: '0.04em' }}>Customer</div>
                    <div className="text-dark fw-medium" style={{ fontSize: 15 }}>{policy.customerName}</div>
                  </div>
                </div>

                {/* Document section */}
                {policy.documentUrl && (
                  <div className="mb-4">
                    <div className="text-secondary fw-semibold text-uppercase mb-1" style={{ fontSize: 12, letterSpacing: '0.04em' }}>Uploaded Document</div>
                    <a href={policy.documentUrl} target="_blank" rel="noreferrer" className="text-primary fw-semibold text-decoration-none" style={{ fontSize: 14 }}>View Document</a>
                  </div>
                )}

                {policy.policyStatus === 'InfoRequested' && (
                  <div className="mb-4">
                    <label className="btn btn-dark fw-semibold" style={{ fontSize: 14, cursor: 'pointer' }}>
                      {uploading === policy.policyId ? 'Uploading...' : 'Upload Document (Image)'}
                      <input type="file" accept="image/*" className="d-none" onChange={(e) => handleUpload(e, policy.policyId)} disabled={uploading === policy.policyId} />
                    </label>
                  </div>
                )}

                {/* Date progress bar */}
                {policy.policyStatus === 'Active' && (
                  <div>
                    <div className="d-flex justify-content-between text-secondary mb-2" style={{ fontSize: 12 }}>
                      <span>Start: {policy.startDate?.split('T')[0]}</span>
                      <span>End: {policy.endDate?.split('T')[0]}</span>
                    </div>
                    <div className="progress" style={{ height: 6 }}>
                      <div className="progress-bar bg-primary" style={{ width: `${progress.pct}%`, transition: 'width 0.6s ease' }} />
                    </div>
                    <div className="text-secondary mt-1" style={{ fontSize: 12 }}>
                      {progress.monthsRemaining} month{progress.monthsRemaining !== 1 ? 's' : ''} remaining
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })
        }
      </div>

    </CustomerLayout>
  )
}
