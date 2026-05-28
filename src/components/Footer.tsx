// FILE: src/components/Footer.tsx

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0F1A14]">
      <div className="max-w-[1180px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-lg font-bold text-[#FAF7F2] tracking-tight">UniSell</span>
        <div className="flex gap-6">
          <Link href="/" className="text-[rgba(250,247,242,0.6)] no-underline text-sm hover:text-[#FAF7F2] transition-colors">Browse</Link>
          <Link href="/sell" className="text-[rgba(250,247,242,0.6)] no-underline text-sm hover:text-[#FAF7F2] transition-colors">Sell</Link>
          <Link href="/subscribe" className="text-[rgba(250,247,242,0.6)] no-underline text-sm hover:text-[#FAF7F2] transition-colors">Subscribe</Link>
          <Link href="/login" className="text-[rgba(250,247,242,0.6)] no-underline text-sm hover:text-[#FAF7F2] transition-colors">Login</Link>
        </div>
        <p className="m-0 text-xs text-[rgba(250,247,242,0.35)]">© 2026 UniSell</p>
      </div>
    </footer>
  )
}