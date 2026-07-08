import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import OfficerLayout from '../../components/layouts/OfficerLayout'
import { getClaimById, updateClaimStatus } from '../../services/api'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import StatusBadge from '../../components/shared/StatusBadge'
import ConfirmModal from '../../components/shared/ConfirmModal'

export default function ClaimDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [claim, setClaim] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, status: '' })

  useEffect(() => {
    fetchClaim()
  }, [id])

  const fetchClaim = () => {
    setLoading(true)
    getClaimById(id)
      .then(res => setClaim(res))
      .catch(() => setClaim(null))
      .finally(() => setLoading(false))
  }

  const handleStatusChange = async () => {
    const newStatus = confirmModal.status;
    setConfirmModal({ isOpen: false, status: '' })
    setSubmitting(true)
    setError(null)
    try {
      await updateClaimStatus(id, {
        claimStatus: newStatus,
        resolvedAt: new Date().toISOString()
      })
      fetchClaim() // refresh
    } catch (err) {
      setError(err.message || `Failed to ${newStatus.toLowerCase()} claim.`)
      setSubmitting(false)
    }
  }

  if (loading) return <OfficerLayout><LoadingSpinner /></OfficerLayout>
  if (!claim) return <OfficerLayout><div className="p-4 text-center">Claim not found</div></OfficerLayout>

  const labelClass = "text-secondary fw-semibold text-uppercase mb-1"
  const labelStyle = { fontSize: 12, letterSpacing: '0.04em' }
  const valueClass = "text-dark fw-medium"
  const valueStyle = { fontSize: 15 }

  return (
    <OfficerLayout>
      <div className="mx-auto px-4 py-4" style={{ maxWidth: 800 }}>
        <button onClick={() => navigate('/officer/claims')} className="btn btn-link text-primary fw-semibold text-decoration-none p-0 mb-3">
          ← Back to Claims
        </button>

        {error && <div className="alert alert-danger mb-4 py-2" style={{ fontSize: 14 }}>{error}</div>}

        <div className="bg-white rounded-3 border border-border overflow-hidden shadow-sm">
          {/* Dark header */}
          <div className="bg-dark text-white p-4 d-flex align-items-center justify-content-between">
            <div>
              <div className="text-white text-opacity-50 fw-semibold text-uppercase mb-1" style={{ fontSize: 12, letterSpacing: '0.04em' }}>Claim Number</div>
              <h1 className="m-0 fw-semibold" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24 }}>
                {claim.claimNumber}
              </h1>
            </div>
            <StatusBadge status={claim.claimStatus} />
          </div>

          {/* Cream body */}
          <div className="bg-light p-4">
            <div className="d-inline-flex align-items-baseline gap-2 bg-body border border-border rounded-3 px-3 py-2 mb-4">
              <span className="font-serif text-primary lh-1" style={{ fontSize: 40 }}>₹{claim.claimAmount}</span>
              <span className="text-secondary" style={{ fontSize: 14 }}>requested</span>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-6"><div className={labelClass} style={labelStyle}>Policy Number</div><div className={valueClass} style={valueStyle}><Link to={`/officer/policies/${claim.policyId}`} className="text-primary text-decoration-none">{claim.policyNumber || `Policy #${claim.policyId}`}</Link></div></div>
              <div className="col-6"><div className={labelClass} style={labelStyle}>Customer</div><div className={valueClass} style={valueStyle}>{claim.customerName}</div></div>
              <div className="col-6"><div className={labelClass} style={labelStyle}>Incident Date</div><div className={valueClass} style={valueStyle}>{claim.incidentDate ? claim.incidentDate.split('T')[0] : 'N/A'}</div></div>
              <div className="col-6"><div className={labelClass} style={labelStyle}>Resolved Date</div><div className={valueClass} style={valueStyle}>{claim.resolvedAt ? claim.resolvedAt.split('T')[0] : 'Pending'}</div></div>
            </div>

            <div className="bg-white p-3 rounded-3 border border-border mb-4">
              <div className={labelClass} style={labelStyle}>Incident Description</div>
              <div className={`${valueClass}`} style={{ ...valueStyle, lineHeight: 1.5 }}>{claim.incidentDescription}</div>
            </div>

            {claim.claimStatus === 'Pending' && (
              <div className="d-flex gap-3 mt-4">
                <button
                  onClick={() => setConfirmModal({ isOpen: true, status: 'Approved' })}
                  disabled={submitting}
                  className="btn btn-success flex-grow-1 fw-semibold py-2"
                >
                  Approve Claim
                </button>
                <button
                  onClick={() => setConfirmModal({ isOpen: true, status: 'Rejected' })}
                  disabled={submitting}
                  className="btn btn-outline-danger flex-grow-1 fw-semibold py-2"
                >
                  Reject Claim
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={`${confirmModal.status} Claim`}
        message={`Are you sure you want to ${confirmModal.status.toLowerCase()} this claim for ₹${claim.claimAmount}? This action cannot be undone.`}
        confirmText={`Yes, ${confirmModal.status}`}
        confirmColor={confirmModal.status === 'Approved' ? '#34D399' : '#A63D2F'}
        onConfirm={handleStatusChange}
        onCancel={() => setConfirmModal({ isOpen: false, status: '' })}
      />
    </OfficerLayout>
  )
}
