// FILE: src/components/Footer.tsx

import Link from 'next/link'

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="m-0 mb-3.5 text-xs tracking-[0.14em] uppercase text-[#FAF7F2] font-semibold">
        {title}
      </p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-[rgba(250,247,242,0.72)] no-underline text-sm hover:text-[#FAF7F2] transition-colors"
    >
      {children}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#0F1A14] text-[rgba(250,247,242,0.72)]">
      <div className="max-w-[1180px] mx-auto px-6 pt-14 pb-10 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10">
        <div>
          <div className="text-[22px] font-bold text-[#FAF7F2] tracking-tight mb-3">
            UniSell
          </div>
          <p className="m-0 max-w-sm text-sm leading-relaxed">
            The verified secondhand marketplace for University of Buea students. No middlemen. No fees. Built in Buea.
          </p>
        </div>
        <FooterCol title="Marketplace">
          <FooterLink href="/">Browse listings</FooterLink>
          <FooterLink href="/sell">Sell an item</FooterLink>
          <FooterLink href="/#how">How it works</FooterLink>
        </FooterCol>
        <FooterCol title="Account">
          <FooterLink href="/subscribe">Subscribe</FooterLink>
          <FooterLink href="/login">Login</FooterLink>
        </FooterCol>
      </div>
      <div className="border-t border-[rgba(250,247,242,0.08)]">
        <div className="max-w-[1180px] mx-auto px-6 py-[18px] flex justify-between items-center flex-wrap gap-3 text-[13px] text-[rgba(250,247,242,0.5)]">
          <p className="m-0">© 2026 UniSell · Molyko, Buea</p>
          <p className="m-0">Built by a UB student, for UB students.</p>
        </div>
      </div>
    </footer>
  )
}