// FILE: src/components/HowItWorks.tsx

export default function HowItWorks() {
  const steps = [
    {
      title: 'Browse listings free',
      body: 'No signup required to browse. Filter by category or search by keyword.',
      icon: (
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
    {
      title: 'Contact seller on WhatsApp',
      body: 'Tap to open a pre-filled WhatsApp chat with the seller. No middlemen.',
      icon: (
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
    {
      title: 'Meet on campus and pay cash',
      body: 'Inspect the item in person. Pay only when you are happy. Done.',
      icon: (
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 17l3 3a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4l-3-3" />
          <path d="M3 13l5 5a1 1 0 0 0 1.4 0l1.6-1.6" />
          <path d="M14 9l-3.5 3.5a1 1 0 0 1-1.4 0L8 11.5a1 1 0 0 1 0-1.4L11 7" />
          <path d="M17 11l3-3-3-3-2.5 2.5a1 1 0 0 1-1.4 0L11 5 7 9" />
        </svg>
      ),
    },
  ]

  return (
    <section id="how" className="bg-[#1B4332] text-[#FAF7F2]">
      <div className="max-w-[1180px] mx-auto px-6 py-16">
        <p className="m-0 text-xs tracking-[0.16em] uppercase font-semibold text-[#D97706] mb-3">
          How it works
        </p>
        <h2 className="m-0 mb-10 text-3xl font-bold tracking-tight text-[#FAF7F2] max-w-[640px]">
          Three steps to your next campus essential.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-9">
          {steps.map((s, i) => (
            <div key={s.title} className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-[rgba(217,119,6,0.14)] text-[#F0A93A] inline-flex items-center justify-center border border-[rgba(217,119,6,0.32)]">
                {s.icon}
              </div>
              <span className="text-xs text-[#D97706] font-semibold tracking-[0.12em]">
                STEP {i + 1}
              </span>
              <h3 className="m-0 text-lg font-bold text-[#FAF7F2] tracking-tight">{s.title}</h3>
              <p className="m-0 text-[rgba(250,247,242,0.65)] text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}