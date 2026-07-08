const STATUS_MAP = {
  Active: { bg: '#D1FAE5', color: '#065F46' },
  Approved: { bg: '#D1FAE5', color: '#065F46' },
  Pending: { bg: '#FEF3C7', color: '#92400E' },
  ProposalSubmitted: { bg: '#FEF3C7', color: '#92400E' },
  QuoteGenerated: { bg: '#DBEAFE', color: '#1E40AF' },
  InfoRequested: { bg: '#FEE2E2', color: '#991B1B' },
  Expired: { bg: '#FEF3C7', color: '#92400E' },
  Rejected: { bg: '#FEE2E2', color: '#991B1B' },
  Cancelled: { bg: '#F3F4F6', color: '#374151' },
}

export default function StatusBadge({ status }) {
  const { bg, color } = STATUS_MAP[status] || { bg: '#F3F4F6', color: '#374151' }
  return (
    <span className="badge rounded-pill fw-semibold" style={{ background: bg, color, fontSize: 12, padding: '5px 12px', whiteSpace: 'nowrap' }}>
      {status}
    </span>
  )
}