import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import OfficerLayout from '../../components/layouts/OfficerLayout'
import { getCustomers } from '../../services/api'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getCustomers()
      .then(res => setCustomers(Array.isArray(res) ? res : (res?.data || [])))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <OfficerLayout>
      <div className="mx-auto px-4 py-4" style={{ maxWidth: 1000 }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="font-serif text-dark m-0" style={{ fontSize: 26, fontWeight: 400 }}>Customers</h1>
        </div>

        {loading ? <LoadingSpinner /> : customers.length === 0 ? <EmptyState title="No customers found" description="Customers will appear here once they register." /> : (
          <div className="bg-white rounded-3 border border-border overflow-hidden">
            <table className="table table-hover mb-0" style={{ fontSize: 14 }}>
              <thead>
                <tr className="text-secondary text-uppercase" style={{ fontSize: 12, letterSpacing: '0.04em', background: '#F5EDE0' }}>
                  <th className="py-3 px-4 fw-semibold border-bottom-0">Name</th>
                  <th className="py-3 px-4 fw-semibold border-bottom-0">Email</th>
                  <th className="py-3 px-4 fw-semibold border-bottom-0">Phone</th>
                  <th className="py-3 px-4 fw-semibold border-bottom-0">License No</th>
                  <th className="py-3 px-4 fw-semibold border-bottom-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.customerId} className="align-middle border-top border-border">
                    <td className="py-3 px-4 text-dark fw-medium">{c.fullName}</td>
                    <td className="py-3 px-4 text-secondary">{c.email}</td>
                    <td className="py-3 px-4 text-secondary">{c.phoneNumber}</td>
                    <td className="py-3 px-4 text-secondary">{c.licenseNumber}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => navigate(`/officer/customers/${c.customerId}`)} className="btn btn-outline-primary btn-sm fw-semibold px-3">
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
