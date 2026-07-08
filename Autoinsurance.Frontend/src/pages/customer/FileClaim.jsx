import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomerLayout from '../../components/layouts/CustomerLayout'
import { useAuth } from '../../context/AuthContext'
import { getMyPolicies, createClaim } from '../../services/api'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

export default function FileClaim() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    policyId: '',
    incidentDescription: '',
    claimAmount: '',
    incidentDate: ''
  })
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    getMyPolicies()
      .then(res => {
        const policiesList = Array.isArray(res) ? res : (res?.data || []);
        // filter policies 
        const myActivePolicies = policiesList.filter(p =>
          (String(p.ownerUserId) === String(auth?.userId) || String(p.customerId) === String(auth?.userId)) &&
          p.policyStatus === 'Active'
        )
        setPolicies(myActivePolicies)
        if (myActivePolicies.length === 1) {
          setForm(f => ({ ...f, policyId: myActivePolicies[0].policyId }))
        }
      })
      .catch(() => setError('Failed to load active policies.'))
      .finally(() => setLoading(false))
  }, [auth])

  const validate = () => {
    const e = {}
    if (!form.policyId) e.policyId = 'Please select a policy.'
    if (!form.incidentDescription.trim() || form.incidentDescription.length < 10) e.incidentDescription = 'Description must be at least 10 characters.'
    if (!form.claimAmount || Number(form.claimAmount) <= 0) e.claimAmount = 'Claim amount must be greater than 0.'
    if (!form.incidentDate) {
      e.incidentDate = 'Incident date is required.'
    } else {
      const selected = new Date(form.incidentDate)
      const now = new Date()
      if (selected > now) e.incidentDate = 'Incident date cannot be in the future.'
    }
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
      await createClaim({
        policyId: parseInt(form.policyId),
        incidentDescription: form.incidentDescription,
        claimAmount: parseFloat(form.claimAmount),
        incidentDate: new Date(form.incidentDate).toISOString()
      })
      navigate('/customer/my-claims')
    } catch (err) {
      setError(err.message || 'Failed to file claim.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <CustomerLayout>
      {/* Header */}
      <div className="position-relative overflow-hidden border-bottom border-border" style={{ background: 'rgba(166,61,47,0.08)' }}>
        <div className="position-relative mx-auto px-4 py-4" style={{ maxWidth: 800 }}>
          <h1 className="font-serif text-dark m-0" style={{ fontSize: 26, fontWeight: 400 }}>File a Claim</h1>
          <p className="text-secondary mt-2 mb-0" style={{ fontSize: 14 }}>Submit a new claim request for an active policy.</p>
        </div>
      </div>

      <div className="mx-auto px-4 py-4" style={{ maxWidth: 800 }}>
        {loading ? (
          <LoadingSpinner message="Loading policies..." />
        ) : policies.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <p style={{ fontSize: 16 }}>No active policies found.</p>
            <p style={{ fontSize: 14 }}>You can only file a claim for active policies.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3 border border-border p-4 shadow-sm">
            {error && <div className="alert alert-danger py-2 mb-4" style={{ fontSize: 14 }}>{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark" style={{ fontSize: 13 }}>Select Policy</label>
                <select
                  className={`form-select ${validationErrors.policyId ? 'is-invalid' : ''}`}
                  value={form.policyId}
                  onChange={e => setForm(f => ({ ...f, policyId: e.target.value }))}
                >
                  <option value="">-- Choose an active policy --</option>
                  {policies.map(p => (
                    <option key={p.policyId} value={p.policyId}>{p.policyNumber} - {p.vehicleDescription}</option>
                  ))}
                </select>
                {validationErrors.policyId && <div className="invalid-feedback">{validationErrors.policyId}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-dark" style={{ fontSize: 13 }}>Incident Description</label>
                <textarea
                  className={`form-control ${validationErrors.incidentDescription ? 'is-invalid' : ''}`}
                  value={form.incidentDescription}
                  onChange={e => setForm(f => ({ ...f, incidentDescription: e.target.value }))}
                  placeholder="Describe what happened..."
                  rows={4}
                />
                {validationErrors.incidentDescription && <div className="invalid-feedback">{validationErrors.incidentDescription}</div>}
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark" style={{ fontSize: 13 }}>Claim Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-control ${validationErrors.claimAmount ? 'is-invalid' : ''}`}
                    value={form.claimAmount}
                    onChange={e => setForm(f => ({ ...f, claimAmount: e.target.value }))}
                    placeholder="0.00"
                  />
                  {validationErrors.claimAmount && <div className="invalid-feedback">{validationErrors.claimAmount}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark" style={{ fontSize: 13 }}>Incident Date</label>
                  <input
                    type="date"
                    className={`form-control ${validationErrors.incidentDate ? 'is-invalid' : ''}`}
                    value={form.incidentDate}
                    onChange={e => setForm(f => ({ ...f, incidentDate: e.target.value }))}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {validationErrors.incidentDate && <div className="invalid-feedback">{validationErrors.incidentDate}</div>}
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3">
                <button type="button" onClick={() => navigate(-1)} disabled={submitting} className="btn btn-outline-secondary fw-semibold px-4">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary fw-semibold px-4">
                  {submitting ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}
