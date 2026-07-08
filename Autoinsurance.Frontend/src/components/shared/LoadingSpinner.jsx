export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div
        className="spinner-border text-primary"
        role="status"
        style={{ width: 32, height: 32 }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="mt-3 text-secondary fw-medium" style={{ fontSize: 14 }}>{message}</div>
    </div>
  )
}
