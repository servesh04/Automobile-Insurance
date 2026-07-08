import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import OfficerLayout from '../../components/layouts/OfficerLayout'
import { getPolicyById, updatePolicyStatus } from '../../services/api'
import { useNotification } from '../../context/NotificationContext'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import StatusBadge from '../../components/shared/StatusBadge'

export default function PolicyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [premiumInput, setPremiumInput] = useState('')

  useEffect(() => {
    getPolicyById(id)
      .then(res => setPolicy(res.data || res)) // Handle response shape differences
      .catch(() => setPolicy(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusUpdate = async (status) => {
    try {
      await updatePolicyStatus(id, { status });
      setPolicy(p => ({ ...p, policyStatus: status }));
    } catch (err) {
      showNotification(err.message, 'error');
    }
  }

  const handleGenerateQuote = async () => {
    if (!premiumInput || isNaN(premiumInput) || Number(premiumInput) <= 0) {
      showNotification('Please enter a valid premium amount.', 'error')
      return
    }
    try {
      const { generateQuote } = await import('../../services/api')
      await generateQuote(id, Number(premiumInput))
      setPolicy(p => ({ ...p, policyStatus: 'QuoteGenerated', premiumAmount: Number(premiumInput) }))
      showNotification('Quote generated successfully!', 'success')
    } catch (err) {
      showNotification(err.message, 'error')
    }
  }

  const handleRequestInfo = async () => {
    try {
      await updatePolicyStatus(id, { status: 'InfoRequested' })
      setPolicy(p => ({ ...p, policyStatus: 'InfoRequested' }))
      showNotification('Requested additional info from customer.', 'success')
    } catch (err) {
      showNotification(err.message, 'error')
    }
  }

  if (loading) return <OfficerLayout><LoadingSpinner /></OfficerLayout>
  if (!policy) return <OfficerLayout><div className="p-4 text-center">Policy not found</div></OfficerLayout>

  const labelClass = "text-secondary fw-semibold text-uppercase mb-1"
  const labelStyle = { fontSize: 12, letterSpacing: '0.04em' }
  const valueClass = "text-dark fw-medium"
  const valueStyle = { fontSize: 15 }

  return (
    <OfficerLayout>
      <div className="mx-auto px-4 py-4" style={{ maxWidth: 800 }}>
        <button onClick={() => navigate('/officer/policies')} className="btn btn-link text-primary fw-semibold text-decoration-none p-0 mb-3">
          ← Back to Policies
        </button>

        <div className="bg-white rounded-3 border border-border overflow-hidden shadow-sm">
          {/* Dark header */}
          <div className="bg-dark text-white p-4 d-flex align-items-center justify-content-between">
            <div>
              <div className="text-white text-opacity-50 fw-semibold text-uppercase mb-1" style={{ fontSize: 12, letterSpacing: '0.04em' }}>Policy Number</div>
              <h1 className="m-0 fw-semibold" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24 }}>
                {policy.policyNumber}
              </h1>
            </div>
            <StatusBadge status={policy.policyStatus} />
          </div>

          {/* Proposal review action bar */}
          {policy.policyStatus === 'ProposalSubmitted' && (
            <div className="border-bottom border-border p-4" style={{ background: '#FEF3C7' }}>
              <div className="fw-semibold mb-3" style={{ fontSize: 14, color: '#92400E' }}>This policy proposal needs your review.</div>
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Premium Amount (₹)"
                  value={premiumInput}
                  onChange={e => setPremiumInput(e.target.value)}
                  style={{ width: 180 }}
                />
                <button onClick={handleGenerateQuote} className="btn btn-success fw-semibold">Generate Quote</button>
                <div className="vr mx-1" />
                <button onClick={handleRequestInfo} className="btn btn-danger fw-semibold">Request More Info</button>
                <button onClick={() => handleStatusUpdate('Rejected')} className="btn btn-outline-danger fw-semibold">Reject</button>
              </div>
            </div>
          )}

          {/* Info requested banner */}
          {policy.policyStatus === 'InfoRequested' && (
            <div className="alert alert-danger rounded-0 mb-0 px-4 py-3">
              <strong>Waiting on Customer.</strong> Additional information was requested.
            </div>
          )}

          {/* Body */}
          <div className="bg-light p-4">
            <div className="d-inline-flex align-items-baseline gap-2 bg-body border border-border rounded-3 px-3 py-2 mb-4">
              <span className="font-serif text-primary lh-1" style={{ fontSize: 40 }}>₹{policy.premiumAmount}</span>
              <span className="text-secondary" style={{ fontSize: 14 }}>premium</span>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-6"><div className={labelClass} style={labelStyle}>Customer</div><div className={valueClass} style={valueStyle}>{policy.customerName || `Customer #${policy.customerId}`}</div></div>
              <div className="col-6"><div className={labelClass} style={labelStyle}>Vehicle</div><div className={valueClass} style={valueStyle}>{policy.vehicleDescription || `Vehicle #${policy.vehicleId}`}</div></div>
              <div className="col-6"><div className={labelClass} style={labelStyle}>Coverage Type</div><div className={valueClass} style={valueStyle}>{policy.coverageType}</div></div>
              <div className="col-6"><div className={labelClass} style={labelStyle}>Status</div><div className={valueClass} style={valueStyle}>{policy.policyStatus}</div></div>
              <div className="col-6"><div className={labelClass} style={labelStyle}>Start Date</div><div className={valueClass} style={valueStyle}>{policy.startDate ? policy.startDate.split('T')[0] : 'N/A'}</div></div>
              <div className="col-6"><div className={labelClass} style={labelStyle}>End Date</div><div className={valueClass} style={valueStyle}>{policy.endDate ? policy.endDate.split('T')[0] : 'N/A'}</div></div>
            </div>

            {policy.documentUrl && (
              <div className="border-top border-border pt-4">
                <div className={labelClass} style={labelStyle}>Uploaded Document</div>
                <a href={policy.documentUrl} target="_blank" rel="noreferrer" className="btn btn-outline-primary mt-2 fw-semibold">
                  📄 View Document
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </OfficerLayout>
  )
}
