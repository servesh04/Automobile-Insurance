export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', confirmColor = '#A63D2F' }) {
  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center"
      style={{ background: 'rgba(61,43,31,0.6)', backdropFilter: 'blur(4px)', zIndex: 1050 }}
    >
      <div className="bg-white rounded-3 border border-border shadow-lg p-4" style={{ width: '100%', maxWidth: 400 }}>
        <h3 className="font-serif text-dark m-0 mb-3" style={{ fontSize: 20, fontWeight: 400 }}>
          {title}
        </h3>
        <p className="text-secondary mb-4" style={{ fontSize: 14, lineHeight: 1.5 }}>
          {message}
        </p>
        <div className="d-flex justify-content-end gap-3">
          <button onClick={onCancel} className="btn btn-outline-secondary fw-semibold px-4">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn fw-semibold text-white px-4" style={{ background: confirmColor }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
