export default function Toast({ toast }) {
  if (!toast) return null
  const bg    = toast.type === 'success' ? '#D1FAE5' : '#FEE2E2'
  const color = toast.type === 'success' ? '#065F46' : '#991B1B'
  return (
    <div className="toast-in" style={{
      position: 'fixed', top: 24, right: 24, zIndex: 1000,
      minWidth: 260, maxWidth: 360,
      padding: '14px 18px', borderRadius: 8,
      fontSize: 14, fontWeight: 600,
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      background: bg, color,
    }}>
      {toast.message}
    </div>
  )
}