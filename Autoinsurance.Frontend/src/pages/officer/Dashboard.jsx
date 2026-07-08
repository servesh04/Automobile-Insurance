import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import OfficerLayout from '../../components/layouts/OfficerLayout'
import { getPolicies, getClaims, getCustomers, getVehicles } from '../../services/api'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

export default function Dashboard() {
  const [stats, setStats] = useState({ policies: 0, claims: 0, pendingClaims: 0, customers: 0, vehicles: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getPolicies().catch(() => ({ data: [] })),
      getClaims().catch(() => ({ data: [] })),
      getCustomers().catch(() => ({ data: [] })),
      getVehicles().catch(() => ({ data: [] }))
    ]).then(([polRes, claimRes, custRes, vehRes]) => {
      const claims = Array.isArray(claimRes) ? claimRes : (claimRes?.data || []);
      const policies = Array.isArray(polRes) ? polRes : (polRes?.data || []);
      const customersList = Array.isArray(custRes) ? custRes : (custRes?.data || []);
      const vehiclesList = Array.isArray(vehRes) ? vehRes : (vehRes?.data || []);
      setStats({
        policies: policies.length,
        pendingProposals: policies.filter(p => p.policyStatus === 'ProposalSubmitted' || p.policyStatus === 'InfoRequested').length,
        claims: claims.length,
        pendingClaims: claims.filter(c => c.claimStatus === 'Pending').length,
        customers: customersList.length,
        vehicles: vehiclesList.length,
      })
    }).finally(() => setLoading(false))
  }, [])

  const statCard = (title, count, link) => (
    <div className="bg-white border border-border rounded-3 p-4 d-flex flex-column">
      <span className="text-secondary fw-semibold text-uppercase mb-2" style={{ fontSize: 13, letterSpacing: '0.04em' }}>{title}</span>
      <span className="font-serif text-dark mb-3" style={{ fontSize: 40 }}>{count}</span>
      <Link to={link} className="text-primary fw-semibold text-decoration-none mt-auto" style={{ fontSize: 14 }}>View all →</Link>
    </div>
  )

  return (
    <OfficerLayout>
      <div className="mx-auto px-4 py-4" style={{ maxWidth: 1000 }}>
        <h1 className="font-serif text-dark mb-4" style={{ fontSize: 28, fontWeight: 400 }}>Dashboard Overview</h1>

        {loading ? <LoadingSpinner message="Loading statistics..." /> : (
          <div className="row g-4">
            <div className="col-md-4">{statCard('Customers', stats.customers, '/officer/customers')}</div>
            <div className="col-md-4">{statCard('Vehicles', stats.vehicles, '/officer/vehicles')}</div>
            <div className="col-md-4">{statCard('Total Policies', stats.policies, '/officer/policies')}</div>

            {/* Pending Proposals — warning card */}
            <div className="col-md-4">
              <div className="rounded-3 p-4 d-flex flex-column" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
                <span className="fw-semibold text-uppercase mb-2" style={{ fontSize: 13, letterSpacing: '0.04em', color: '#92400E' }}>Pending Proposals</span>
                <span className="font-serif mb-3" style={{ fontSize: 40, color: '#92400E' }}>{stats.pendingProposals}</span>
                <Link to="/officer/policies" className="fw-semibold text-decoration-none mt-auto" style={{ fontSize: 14, color: '#92400E' }}>Review proposals →</Link>
              </div>
            </div>

            <div className="col-md-4">{statCard('Total Claims', stats.claims, '/officer/claims')}</div>

            {/* Pending Claims — danger card */}
            <div className="col-md-4">
              <div className="rounded-3 p-4 d-flex flex-column" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
                <span className="fw-semibold text-uppercase mb-2" style={{ fontSize: 13, letterSpacing: '0.04em', color: '#991B1B' }}>Pending Claims</span>
                <span className="font-serif mb-3" style={{ fontSize: 40, color: '#991B1B' }}>{stats.pendingClaims}</span>
                <Link to="/officer/claims" className="fw-semibold text-decoration-none mt-auto" style={{ fontSize: 14, color: '#991B1B' }}>Review claims →</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </OfficerLayout>
  )
}
