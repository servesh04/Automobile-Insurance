export default function EmptyState({ title = 'No data found', description = 'There is nothing to display here.', icon }) {
  return (
    <div className="text-center py-5 text-secondary">
      {icon && <div className="mb-3 fs-2" style={{ color: '#D6C4A8' }}>{icon}</div>}
      <h3 className="text-dark fw-semibold mb-2" style={{ fontSize: 18 }}>{title}</h3>
      <p className="mb-0" style={{ fontSize: 14 }}>{description}</p>
    </div>
  )
}
