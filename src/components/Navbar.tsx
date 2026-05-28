// FILE: src/components/Navbar.tsx

'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    setOpen(false)
  }

  return (
    <header className="bg-[#1B4332] text-[#FAF7F2] sticky top-0 z-30 border-b border-white/[0.06]">
      <div className="h-14 max-w-[1280px] mx-auto px-6 flex items-center justify-between relative">

        <Link href="/" className="text-[#FAF7F2] no-underline font-bold text-xl tracking-tight">
          UniSell
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-7">
          {[
            { label: 'Browse', href: '/#listings' },
            { label: 'How it works', href: '/#how' },
            { label: 'Subscribe', href: '/subscribe' },
          ].map((l) => (
            <Link key={l.label} href={l.href}
              className="text-[rgba(250,247,242,0.85)] no-underline text-sm font-medium hover:text-[#FAF7F2] transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard"
                className="text-[rgba(250,247,242,0.85)] no-underline text-sm font-medium hover:text-[#FAF7F2] transition-colors">
                My listings
              </Link>
              <Link href="/sell"
                className="inline-flex items-center gap-1.5 bg-[#D97706] text-[#FAF7F2] no-underline text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#B45309] transition-colors">
                Sell item
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" /><path d="m13 5 7 7-7 7" />
                </svg>
              </Link>
              <button onClick={handleLogout}
                className="text-[rgba(250,247,242,0.6)] text-sm font-medium bg-transparent border-0 cursor-pointer hover:text-[#FAF7F2] transition-colors"
                style={{ fontFamily: 'inherit' }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login"
                className="text-[rgba(250,247,242,0.85)] no-underline text-sm font-medium hover:text-[#FAF7F2] transition-colors">
                Login
              </Link>
              <Link href="/sell"
                className="inline-flex items-center gap-1.5 bg-[#D97706] text-[#FAF7F2] no-underline text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#B45309] transition-colors">
                Sell item
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" /><path d="m13 5 7 7-7 7" />
                </svg>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(o => !o)} aria-label="Menu"
          className="md:hidden bg-transparent border-0 text-[#FAF7F2] p-2 cursor-pointer">
          <svg width={22} height={22} viewBox="0 0 22 22" fill="none" aria-hidden="true">
            {open ? (
              <>
                <path d="M5 5L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M17 5L5 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M3 7H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M3 11H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M3 15H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden bg-[#143027] overflow-hidden transition-all duration-200 ${open ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 pb-5 pt-1.5">
          {[
            { label: 'Browse', href: '/#listings' },
            { label: 'How it works', href: '/#how' },
            { label: 'Subscribe', href: '/subscribe' },
          ].map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)}
              className="block py-3.5 text-[#FAF7F2] no-underline text-base font-medium border-b border-white/[0.08]">
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}
                className="block py-3.5 text-[#FAF7F2] no-underline text-base font-medium border-b border-white/[0.08]">
                My listings
              </Link>
              <Link href="/sell" onClick={() => setOpen(false)}
                className="block text-center mt-3.5 py-3 bg-[#D97706] text-[#FAF7F2] rounded-lg text-base font-semibold no-underline mb-3">
                Sell item →
              </Link>
              <button onClick={handleLogout}
                className="block w-full text-center py-3 text-[rgba(250,247,242,0.6)] text-sm bg-transparent border-0 cursor-pointer"
                style={{ fontFamily: 'inherit' }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}
                className="block py-3.5 text-[#FAF7F2] no-underline text-base font-medium border-b border-white/[0.08]">
                Login
              </Link>
              <Link href="/sell" onClick={() => setOpen(false)}
                className="block text-center mt-3.5 py-3 bg-[#D97706] text-[#FAF7F2] rounded-lg text-base font-semibold no-underline">
                Sell item →
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}