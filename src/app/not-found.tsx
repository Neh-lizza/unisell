// FILE: src/app/not-found.tsx

import Link from 'next/link'

export const metadata = { title: 'Page not found — UniSell' }

export default function NotFound() {
  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }} className="flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="m-0 text-[80px] font-bold text-[#EFE9DD] leading-none mb-4">404</p>
        <h1 className="m-0 mb-3 text-2xl font-bold text-[#1B4332] tracking-tight">
          Page not found
        </h1>
        <p className="m-0 mb-8 text-[15px] text-[#6B6B6B] leading-relaxed">
          This page doesn't exist or the listing was removed. Head back to browse what's available on campus.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/"
            className="inline-flex items-center gap-2 bg-[#1B4332] text-[#FAF7F2] no-underline px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#143027] transition-colors">
            Browse listings
          </Link>
          <Link href="/sell"
            className="inline-flex items-center gap-2 border border-[#1B4332] text-[#1B4332] no-underline px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#1B4332] hover:text-white transition-colors">
            Sell an item
          </Link>
        </div>
      </div>
    </div>
  )
}