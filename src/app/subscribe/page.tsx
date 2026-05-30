// FILE: src/app/subscribe/page.tsx

import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Subscribe — UniSell' }

export default function SubscribePage() {
  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
      <section className="bg-[#FAF7F2] border-b border-[#EFE9DD]">
        <div className="max-w-[640px] mx-auto px-6 pt-16 pb-12 text-center">
          <p className="m-0 text-xs tracking-[0.16em] uppercase text-[#2D6A4F] font-semibold mb-3">
            Seller subscription
          </p>
          <h1 className="m-0 mb-4 text-4xl font-bold tracking-tight text-[#1B4332]">
            Start selling for 300 XAF/year
          </h1>
          <p className="m-0 text-lg text-[#3D3D3D] leading-relaxed">
            One payment. Unlimited listings for a full year.
          </p>
        </div>
      </section>

      <section className="max-w-[640px] mx-auto px-6 py-12">
        <div className="bg-white border border-[#EFE9DD] rounded-2xl p-8 mb-8">
          <h2 className="m-0 mb-6 text-xl font-bold text-[#1B4332]">What you get</h2>
          <div className="flex flex-col gap-4">
            {[
              'Post unlimited listings for 12 months',
              'Photo uploads for each listing',
              'AI price suggestion on every listing',
              'Direct WhatsApp contact from buyers — no fees',
              'Your listings shown to all students',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#E6F3EA] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    width={12}
                    height={12}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1B4332"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <p className="m-0 text-[15px] text-[#1A1A1A]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="m-0 mb-4 text-xl font-bold text-[#1B4332]">Pay 300 XAF via mobile money</h2>
        <p className="m-0 mb-6 text-[15px] text-[#6B6B6B]">
          Send to either number below, then WhatsApp your screenshot to activate within 24 hours.
        </p>

        <div className="flex flex-col gap-4 mb-8">
          <div className="bg-white border border-[#EFE9DD] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FDF1DF] flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-[#D97706]" />
              </div>
              <div>
                <p className="m-0 font-semibold text-[#1A1A1A]">MTN Mobile Money</p>
                <p className="m-0 text-sm text-[#6B6B6B]">Send to this number</p>
              </div>
            </div>
            <div className="bg-[#FAF7F2] rounded-xl px-5 py-4 flex items-center justify-between">
              <p className="m-0 text-2xl font-bold tracking-widest text-[#1B4332] font-mono">
                6XX XXX XXX
              </p>
              <p className="m-0 text-sm text-[#6B6B6B]">Name: UniSell</p>
            </div>
          </div>

          <div className="bg-white border border-[#EFE9DD] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FBE6E1] flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-[#C2410C]" />
              </div>
              <div>
                <p className="m-0 font-semibold text-[#1A1A1A]">Orange Money</p>
                <p className="m-0 text-sm text-[#6B6B6B]">Send to this number</p>
              </div>
            </div>
            <div className="bg-[#FAF7F2] rounded-xl px-5 py-4 flex items-center justify-between">
              <p className="m-0 text-2xl font-bold tracking-widest text-[#1B4332] font-mono">
                6XX XXX XXX
              </p>
              <p className="m-0 text-sm text-[#6B6B6B]">Name: UniSell</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1B4332] rounded-2xl p-7 text-center">
          <p className="m-0 mb-2 text-lg font-bold text-[#FAF7F2]">After sending payment</p>
          <p className="m-0 mb-5 text-[rgba(250,247,242,0.72)] text-[15px] leading-relaxed">
            WhatsApp your screenshot to activate your seller account within 24 hours.
          </p>
          <a
            href="https://wa.me/237XXXXXXXXX?text=Hi%2C%20I%20just%20paid%20300%20XAF%20for%20my%20UniSell%20subscription.%20Here%20is%20my%20screenshot."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white no-underline px-6 py-3.5 rounded-xl font-semibold text-[15px] hover:bg-[#1FBB5A] transition-colors"
          >
            <svg width={18} height={18} viewBox="0 0 32 32" aria-hidden="true">
              <path
                fill="currentColor"
                d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8C11.7 28.4 13.8 29 16 29c7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23.6c-2 0-3.9-.5-5.6-1.6l-.4-.2-4 1 1.1-3.9-.3-.4C5.6 19.9 5 18 5 16c0-6.1 4.9-11 11-11s11 4.9 11 11-4.9 11-11 11zm6.2-8.3c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.2-.2.2-.3.4-.5.1-.2.1-.4 0-.5 0-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.3 3.1c.2.2 2.2 3.3 5.4 4.7.8.3 1.4.5 1.8.7.8.2 1.5.2 2.1.1.6-.1 2-.8 2.3-1.6.3-.8.3-1.4.2-1.6 0-.2-.3-.3-.6-.4z"
              />
            </svg>
            Send screenshot on WhatsApp
          </a>
          <p className="m-0 mt-4 text-xs text-[rgba(250,247,242,0.5)]">
            237XXXXXXXXX · usually activated same day
          </p>
        </div>
      </section>
    </div>
  )
}
