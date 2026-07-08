import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import OfficerLayout from '../../components/layouts/OfficerLayout'
import { getCustomerById } from '../../services/api'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

export default function CustomerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCustomerById(id)
      .then(res => setCustomer(res))
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <OfficerLayout><LoadingSpinner /></OfficerLayout>
  if (!customer) return <OfficerLayout><div className="p-4 text-center">Customer not found</div></OfficerLayout>

  const labelClass = "text-secondary fw-semibold text-uppercase mb-1"
  const labelStyle = { fontSize: 12, letterSpacing: '0.04em' }
  const valueClass = "text-dark fw-medium"
  const valueStyle = { fontSize: 15 }

  return (
    <OfficerLayout>
      <div className="mx-auto px-4 py-4" style={{ maxWidth: 800 }}>
        <button onClick={() => navigate('/officer/customers')} className="btn btn-link text-primary fw-semibold text-decoration-none p-0 mb-3">
          ← Back to Customers
        </button>
        <div className="bg-white rounded-3 border border-border overflow-hidden shadow-sm">
          <div className="bg-light p-4 border-bottom border-border">
            <h1 className="font-serif text-dark m-0" style={{ fontSize: 24, fontWeight: 400 }}>{customer.fullName}</h1>
            <p className="mt-1 mb-0 text-secondary" style={{ fontSize: 14 }}>Customer ID: {customer.customerId} • User ID: {customer.userId}</p>
          </div>
          <div className="p-4 row g-4">
            <div className="col-6"><div className={labelClass} style={labelStyle}>Email</div><div className={valueClass} style={valueStyle}>{customer.email}</div></div>
            <div className="col-6"><div className={labelClass} style={labelStyle}>Phone</div><div className={valueClass} style={valueStyle}>{customer.phoneNumber}</div></div>
            <div className="col-6"><div className={labelClass} style={labelStyle}>Date of Birth</div><div className={valueClass} style={valueStyle}>{customer.dateOfBirth ? customer.dateOfBirth.split('T')[0] : 'N/A'}</div></div>
            <div className="col-6"><div className={labelClass} style={labelStyle}>License Number</div><div className={valueClass} style={valueStyle}>{customer.licenseNumber}</div></div>
            <div className="col-6"><div className={labelClass} style={labelStyle}>Address</div><div className={valueClass} style={valueStyle}>{customer.address || 'N/A'}</div></div>
            <div className="col-6"><div className={labelClass} style={labelStyle}>City</div><div className={valueClass} style={valueStyle}>{customer.city || 'N/A'}</div></div>
            <div className="col-6"><div className={labelClass} style={labelStyle}>State</div><div className={valueClass} style={valueStyle}>{customer.state || 'N/A'}</div></div>
            <div className="col-6"><div className={labelClass} style={labelStyle}>Zip Code</div><div className={valueClass} style={valueStyle}>{customer.zipCode || 'N/A'}</div></div>
          </div>
        </div>
      </div>
    </OfficerLayout>
  )
}
