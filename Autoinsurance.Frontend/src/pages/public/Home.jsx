import { useNavigate } from 'react-router-dom'

const PLANS = [
  {
    id: 'ThirdParty',
    label: 'Third Party',
    description: 'The legal minimum. Covers damage and injury you cause to others.',
    price: 42,
    featured: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 4 5v6c0 5.25 3.4 9.74 8 11 4.6-1.26 8-5.75 8-11V5z" />
      </svg>
    ),
  },
  {
    id: 'Comprehensive',
    label: 'Comprehensive',
    description: 'Full protection against theft, fire, weather, and vandalism, plus liability.',
    price: 89,
    featured: true,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 11 6.5 6.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" />
        <path d="M3 16v-2a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
        <path d="M3 16v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3" />
        <circle cx="7.5" cy="16" r="1.5" />
        <circle cx="16.5" cy="16" r="1.5" />
      </svg>
    ),
  },
  {
    id: 'Collision',
    label: 'Collision',
    description: 'Repairs or replaces your vehicle after a collision, regardless of fault.',
    price: 67,
    featured: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
]

const TRUST_ITEMS = [
  {
    label: 'Licensed & Regulated',
    sub: 'IRDAI certified insurer',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#A63D2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 4 5v6c0 5.25 3.4 9.74 8 11 4.6-1.26 8-5.75 8-11V5z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    label: '24/7 Claim Support',
    sub: 'Real agents, not bots',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#A63D2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: 'Instant Policy',
    sub: 'Coverage in minutes',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#A63D2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 3 14h7l-1 8 11-14h-7z" />
      </svg>
    ),
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-vh-100 bg-body">

      {/* ---- Navbar ---- */}
      <nav className="bg-primary d-flex align-items-center justify-content-between px-4" style={{ height: 64, borderBottom: '1px solid #F4A828' }}>
        <div className="d-flex align-items-center gap-3">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 4 5v6c0 5.25 3.4 9.74 8 11 4.6-1.26 8-5.75 8-11V5z" />
          </svg>
          <span className="text-white fw-bold" style={{ fontSize: 19 }}>AutoInsurance</span>
          <span className="font-serif fst-italic text-warning ps-3 border-start border-white border-opacity-25" style={{ fontSize: 14 }}>
            Drive with confidence
          </span>
        </div>
        <div className="d-flex gap-2">
          <button onClick={() => navigate('/login')} className="btn btn-outline-light fw-semibold" style={{ fontSize: 14 }}>Login</button>
          <button onClick={() => navigate('/register')} className="btn btn-light fw-semibold text-primary" style={{ fontSize: 14 }}>Register</button>
        </div>
      </nav>

      {/* ---- Hero ---- */}
      <div className="position-relative overflow-hidden">
        {/* diagonal shield tile pattern */}
        <div className="position-absolute inset-0 w-100 h-100" style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><path d='M40 8 22 15v18c0 15 8 24 18 27 10-3 18-12 18-27V15z' fill='none' stroke='%23A63D2F' stroke-width='2'/></svg>")`,
          backgroundRepeat: 'repeat', opacity: 0.04, pointerEvents: 'none',
        }} />
        {/* large centred shield watermark */}
        <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="#A63D2F" strokeWidth="0.6"
          className="position-absolute top-50 start-50 translate-middle"
          style={{ opacity: 0.04, pointerEvents: 'none' }}
        >
          <path d="M12 2 4 5v6c0 5.25 3.4 9.74 8 11 4.6-1.26 8-5.75 8-11V5z" />
        </svg>

        <div className="position-relative text-center mx-auto px-4" style={{ maxWidth: 1100, paddingTop: 80, paddingBottom: 64 }}>
          <h1 className="font-serif text-dark mb-3" style={{ fontSize: 56, fontWeight: 400, lineHeight: 1.1 }}>
            Coverage that keeps you moving.
          </h1>
          <p className="text-secondary mx-auto mb-3" style={{ fontSize: 18, maxWidth: 560, lineHeight: 1.5 }}>
            Compare plans, get a quote, and manage your auto policy — all in one place.
          </p>

          {/* Star trust line — from design export */}
          <div className="d-flex align-items-center justify-content-center gap-2 text-secondary fw-semibold mb-4" style={{ fontSize: 14 }}>
            <span className="d-inline-flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F4A828" stroke="none">
                  <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 6.9L12 17l-6.3 3.8 1.7-6.9L2 9.2l7.1-.6z" />
                </svg>
              ))}
            </span>
            <span>Trusted by 10,000+ drivers</span>
          </div>

          <div className="d-flex align-items-center justify-content-center gap-3">
            <button
              onClick={() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-primary fw-semibold px-4 py-2"
            >
              View Plans
            </button>
            <button className="btn btn-outline-primary fw-semibold px-4 py-2">
              Learn more
            </button>
          </div>
        </div>
      </div>

      {/* ---- Plan cards — from design export ---- */}
      <div id="plans-section" className="mx-auto px-4 d-flex gap-4 flex-wrap justify-content-center align-items-start" style={{ maxWidth: 1100, paddingTop: 40, paddingBottom: 64 }}>
        {PLANS.map(plan => (
          <div
            key={plan.id}
            className="rounded-3 d-flex flex-column position-relative"
            style={{
              flex: 1, minWidth: 280, maxWidth: 340,
              background: '#F5EDE0',
              border: plan.featured ? '2px solid #A63D2F' : '1px solid #E8D5B0',
              padding: plan.featured ? '44px 32px 32px' : 32,
              gap: 16,
              boxShadow: plan.featured ? '0 8px 24px rgba(166,61,47,0.12)' : 'none',
            }}
          >
            {/* "Most Popular" badge on featured card */}
            {plan.featured && (
              <div className="position-absolute bg-warning fw-bold rounded-pill text-dark text-center"
                style={{ fontSize: 12, padding: '5px 16px', top: -14, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                Most Popular
              </div>
            )}

            {/* Icon */}
            <div className="d-flex align-items-center justify-content-center text-white rounded-3 bg-primary"
              style={{ width: 56, height: 56, boxShadow: '0 6px 16px rgba(166,61,47,0.28)' }}>
              {plan.icon}
            </div>

            <h3 className="font-serif text-dark m-0" style={{ fontSize: 22, fontWeight: 400 }}>{plan.label}</h3>

            <p className="text-secondary m-0 flex-grow-1" style={{ fontSize: 14, lineHeight: 1.5 }}>{plan.description}</p>

            {/* Price hierarchy — from design export */}
            <div className="d-flex align-items-baseline gap-1">
              <span className="fw-bold text-dark" style={{ fontSize: 20 }}>₹</span>
              <span className="font-serif fw-bold text-dark" style={{ fontSize: 40 }}>{plan.price}</span>
              <span className="text-secondary" style={{ fontSize: 14 }}>/mo</span>
            </div>

            <button onClick={() => navigate('/register')} className="btn btn-primary fw-semibold w-100">
              Get a Quote
            </button>
          </div>
        ))}
      </div>

      {/* ---- Stats & About ---- */}
      <div className="bg-dark text-white py-5 px-4">
        <div className="mx-auto d-flex gap-5 flex-wrap" style={{ maxWidth: 1100 }}>
          <div style={{ flex: 2, minWidth: 300 }}>
            <h2 className="font-serif mb-3" style={{ fontSize: 36 }}>About AutoInsurance</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: '#E8D5B0' }}>
              We've been protecting drivers since 2005. Our mission is to provide transparent, reliable, and affordable auto insurance without the hassle. We believe in fast claims, honest pricing, and putting our customers first.
            </p>
          </div>
          <div className="d-flex flex-column gap-4" style={{ flex: 1, minWidth: 200 }}>
            <div>
              <div className="font-serif text-warning lh-1" style={{ fontSize: 48 }}>24k+</div>
              <div className="fw-semibold mt-1" style={{ fontSize: 14, color: '#E8D5B0' }}>Active Policies</div>
            </div>
            <div>
              <div className="font-serif text-warning lh-1" style={{ fontSize: 48 }}>98%</div>
              <div className="fw-semibold mt-1" style={{ fontSize: 14, color: '#E8D5B0' }}>Claims Served Successfully</div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- User reviews ---- */}
      <div className="py-5 px-4 bg-body">
        <div className="mx-auto text-center" style={{ maxWidth: 1100 }}>
          <h2 className="font-serif text-dark mb-5" style={{ fontSize: 36 }}>What Our Drivers Say</h2>
          <div className="d-flex gap-4 flex-wrap justify-content-center">
            {[
              { text: "Best rates I could find, and filing a claim was incredibly smooth. Highly recommend!", author: "Sarah Jenkins" },
              { text: "I love the transparent pricing. No hidden fees, just great coverage.", author: "Marcus T." },
              { text: "Customer service is top-notch. Real humans answered the phone right away.", author: "Elena R." }
            ].map((review, i) => (
              <div key={i} className="bg-white rounded-3 border border-border p-4 text-start" style={{ flex: 1, minWidth: 280, maxWidth: 340, boxShadow: '0 4px 12px rgba(61,43,31,0.05)' }}>
                <div className="text-warning mb-3">★★★★★</div>
                <p className="fst-italic text-secondary mb-3" style={{ lineHeight: 1.5 }}>"{review.text}"</p>
                <div className="fw-semibold text-dark">— {review.author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---- Trust bar — from design export ---- */}
      <div className="mx-auto px-4 pb-5" style={{ maxWidth: 900 }}>
        <div className="row g-4 text-center">
          {TRUST_ITEMS.map(item => (
            <div key={item.label} className="col-md-4 d-flex flex-column align-items-center gap-2">
              {item.icon}
              <span className="fw-semibold text-dark" style={{ fontSize: 14 }}>{item.label}</span>
              <span className="text-secondary" style={{ fontSize: 12 }}>{item.sub}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}