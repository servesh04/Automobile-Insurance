import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import OfficerLayout from '../../components/layouts/OfficerLayout'
import { getPolicies } from '../../services/api'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'
import StatusBadge from '../../components/shared/StatusBadge'
const POLICY_FILTERS = ['All', 'Active', 'ProposalSubmitted', 'QuoteGenerated', 'InfoRequested', 'Rejected', 'Expired']

export default function Policies() {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const navigate = useNavigate()

  useEffect(() => {
    getPolicies()
      .then(res => setPolicies(Array.isArray(res) ? res : (res?.data || [])))
      .catch(() => setPolicies([]))
      .finally(() => setLoading(false))
  }, [])

  const filteredPolicies = policies.filter(p => {
    const matchesFilter = filter === 'All' || p.policyStatus === filter;
    const matchesSearch = !searchQuery || 
      p.policyNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.coverageType?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <OfficerLayout>
      <div className="mx-auto px-4 py-4" style={{ maxWidth: 1000 }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="font-serif text-dark m-0" style={{ fontSize: 26, fontWeight: 400 }}>Policies</h1>
        </div>

        {/* Filter tabs + Search bar */}
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
          <div className="d-flex flex-wrap gap-2">
            {POLICY_FILTERS.map(f => (
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

        {loading ? <LoadingSpinner /> : policies.length === 0 ? <EmptyState title="No policies found" description="There are no policies in the system." /> : (
          <div className="bg-white rounded-3 border border-border overflow-hidden">
            <table className="table table-hover mb-0" style={{ fontSize: 14 }}>
              <thead>
                <tr className="text-secondary text-uppercase" style={{ fontSize: 12, letterSpacing: '0.04em', background: '#F5EDE0' }}>
                  <th className="py-3 px-4 fw-semibold border-bottom-0">Policy No</th>
                  <th className="py-3 px-4 fw-semibold border-bottom-0">Customer</th>
                  <th className="py-3 px-4 fw-semibold border-bottom-0">Type</th>
                  <th className="py-3 px-4 fw-semibold border-bottom-0">Status</th>
                  <th className="py-3 px-4 fw-semibold border-bottom-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPolicies.map((p) => (
                  <tr key={p.policyId} className="align-middle border-top border-border">
                    <td className="py-3 px-4 text-dark fw-medium">{p.policyNumber}</td>
                    <td className="py-3 px-4 text-secondary">{p.customerName || `Customer #${p.customerId}`}</td>
                    <td className="py-3 px-4 text-secondary">{p.coverageType}</td>
                    <td className="py-3 px-4"><StatusBadge status={p.policyStatus} /></td>
                    <td className="py-3 px-4">
                      <button onClick={() => navigate(`/officer/policies/${p.policyId}`)} className="btn btn-outline-primary btn-sm fw-semibold px-3">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </OfficerLayout>
  )
}
