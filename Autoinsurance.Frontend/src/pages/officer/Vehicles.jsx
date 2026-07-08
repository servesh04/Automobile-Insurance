import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import OfficerLayout from '../../components/layouts/OfficerLayout'
import { getVehicles } from '../../services/api'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getVehicles()
      .then(res => setVehicles(Array.isArray(res) ? res : (res?.data || [])))
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <OfficerLayout>
      <div className="mx-auto px-4 py-4" style={{ maxWidth: 1000 }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="font-serif text-dark m-0" style={{ fontSize: 26, fontWeight: 400 }}>Vehicles</h1>
        </div>

        {loading ? <LoadingSpinner /> : vehicles.length === 0 ? <EmptyState title="No vehicles found" description="There are no vehicles registered in the system." /> : (
          <div className="bg-white rounded-3 border border-border overflow-hidden">
            <table className="table table-hover mb-0" style={{ fontSize: 14 }}>
              <thead>
                <tr className="text-secondary text-uppercase" style={{ fontSize: 12, letterSpacing: '0.04em', background: '#F5EDE0' }}>
                  <th className="py-3 px-4 fw-semibold border-bottom-0">VIN</th>
                  <th className="py-3 px-4 fw-semibold border-bottom-0">Make & Model</th>
                  <th className="py-3 px-4 fw-semibold border-bottom-0">Year</th>
                  <th className="py-3 px-4 fw-semibold border-bottom-0">Fuel Type</th>
                  <th className="py-3 px-4 fw-semibold border-bottom-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.vehicleId} className="align-middle border-top border-border">
                    <td className="py-3 px-4 text-dark fw-medium">{v.vehicleIdentificationNumber}</td>
                    <td className="py-3 px-4 text-secondary">{v.make} {v.model}</td>
                    <td className="py-3 px-4 text-secondary">{v.year}</td>
                    <td className="py-3 px-4 text-secondary">{v.fuelType}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => navigate(`/officer/vehicles/${v.vehicleId}`)} className="btn btn-outline-primary btn-sm fw-semibold px-3">
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
