import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import OfficerLayout from '../../components/layouts/OfficerLayout'
import { getVehicleById } from '../../services/api'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

export default function VehicleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getVehicleById(id)
      .then(res => setVehicle(res))
      .catch(() => setVehicle(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <OfficerLayout><LoadingSpinner /></OfficerLayout>
  if (!vehicle) return <OfficerLayout><div className="p-4 text-center">Vehicle not found</div></OfficerLayout>

  const labelClass = "text-secondary fw-semibold text-uppercase mb-1"
  const labelStyle = { fontSize: 12, letterSpacing: '0.04em' }
  const valueClass = "text-dark fw-medium"
  const valueStyle = { fontSize: 15 }

  return (
    <OfficerLayout>
      <div className="mx-auto px-4 py-4" style={{ maxWidth: 800 }}>
        <button onClick={() => navigate('/officer/vehicles')} className="btn btn-link text-primary fw-semibold text-decoration-none p-0 mb-3">
          ← Back to Vehicles
        </button>
        <div className="bg-white rounded-3 border border-border overflow-hidden shadow-sm">
          <div className="bg-light p-4 border-bottom border-border">
            <h1 className="font-serif text-dark m-0" style={{ fontSize: 24, fontWeight: 400 }}>{vehicle.year} {vehicle.make} {vehicle.model}</h1>
            <p className="mt-1 mb-0 text-secondary" style={{ fontSize: 14 }}>Vehicle ID: {vehicle.vehicleId}</p>
          </div>
          <div className="p-4 row g-4">
            <div className="col-6"><div className={labelClass} style={labelStyle}>VIN</div><div className={valueClass} style={valueStyle}>{vehicle.vehicleIdentificationNumber}</div></div>
            <div className="col-6"><div className={labelClass} style={labelStyle}>Make</div><div className={valueClass} style={valueStyle}>{vehicle.make}</div></div>
            <div className="col-6"><div className={labelClass} style={labelStyle}>Model</div><div className={valueClass} style={valueStyle}>{vehicle.model}</div></div>
            <div className="col-6"><div className={labelClass} style={labelStyle}>Year</div><div className={valueClass} style={valueStyle}>{vehicle.year}</div></div>
            <div className="col-6"><div className={labelClass} style={labelStyle}>Color</div><div className={valueClass} style={valueStyle}>{vehicle.color}</div></div>
            <div className="col-6"><div className={labelClass} style={labelStyle}>Fuel Type</div><div className={valueClass} style={valueStyle}>{vehicle.fuelType}</div></div>
          </div>
        </div>
      </div>
    </OfficerLayout>
  )
}
