// FILE: src/app/page.tsx

'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import HowItWorks from '@/components/HowItWorks'

const CATEGORIES = [
  'All listings',
  'Bed and Mattress',
  'Furniture',
  'Fridge and Freezer',
  'Fan and AC',
  'Kitchen Appliances',
  'Electronics',
  'Books and Handouts',
  'Other',
]

const CONDITION_STYLE: Record<string, { bg: string; color: string; dot: string }> = {
  New:  { bg: '#E6F3EA', color: '#1B4332', dot: '#2D6A4F' },
  Used: { bg: '#FDF1DF', color: '#7A4400', dot: '#D97706' },
  Worn: { bg: '#FBE6E1', color: '#7A1F12', dot: '#B83A2C' },
}

function ConditionBadge({ value }: { value: string }) {
  const s = CONDITION_STYLE[value] || CONDITION_STYLE.Used
  return (
    <span
      style={{ background: s.bg, color: s.color }}
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
    >
      <span style={{ background: s.dot }} className="w-1.5 h-1.5 rounded-full inline-block" />
      {value}
    </span>
  )
}

function ListingCard({ listing }: { listing: any }) {
  const waMsg = encodeURIComponent(
    `Hi, I saw your listing for ${listing.title} on UniSell. Is it still available?`
  )
  return (
    <article className="bg-white border border-[#EFE9DD] rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-200">
      {listing.image_url ? (
        <img src={listing.image_url} alt={listing.title} className="w-full aspect-video object-cover" />
      ) : (
        <div className="w-full aspect-video bg-[#E2D9C5] flex items-center justify-center text-xs font-semibold uppercase tracking-widest text-[#888]">
          {listing.category}
        </div>
      )}
      <div className="p-[18px] flex flex-col gap-2.5 flex-1">
        <h3 className="m-0 text-base font-bold text-[#1A1A1A] leading-snug line-clamp-2">
          {listing.title}
        </h3>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="m-0 text-xl text-[#D97706] font-bold tracking-tight">
            {listing.price.toLocaleString()} XAF
          </p>
          <ConditionBadge value={listing.condition} />
        </div>
        <p className="m-0 text-[13px] text-[#6B6B6B]">{listing.category}</p>
        <div className="flex-1" />
        <div className="flex gap-2 mt-1">
          <Link
            href={`/listings/${listing.id}`}
            className="flex-1 text-center py-2.5 rounded-lg text-sm font-semibold border border-[#1B4332] text-[#1B4332] no-underline hover:bg-[#1B4332] hover:text-white transition-colors"
          >
            View
          </Link>
          <a
            href={`https://wa.me/237${listing.whatsapp_contact}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold bg-[#25D366] text-white no-underline hover:bg-[#1FBB5A] transition-colors"
          >
            <svg width={14} height={14} viewBox="0 0 32 32" aria-hidden="true">
              <path fill="currentColor" d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8C11.7 28.4 13.8 29 16 29c7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23.6c-2 0-3.9-.5-5.6-1.6l-.4-.2-4 1 1.1-3.9-.3-.4C5.6 19.9 5 18 5 16c0-6.1 4.9-11 11-11s11 4.9 11 11-4.9 11-11 11zm6.2-8.3c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.2-.2.2-.3.4-.5.1-.2.1-.4 0-.5 0-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.3 3.1c.2.2 2.2 3.3 5.4 4.7.8.3 1.4.5 1.8.7.8.2 1.5.2 2.1.1.6-.1 2-.8 2.3-1.6.3-.8.3-1.4.2-1.6 0-.2-.3-.3-.6-.4z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}

export default function HomePage() {
  const [listings, setListings] = useState<any[]>([])
  const [category, setCategory] = useState('All listings')
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      let q = supabase
        .from('listings')
        .select('*')
        .eq('is_active', true)
        .eq('is_flagged', false)
        .order('created_at', { ascending: false })

      if (category !== 'All listings') q = q.eq('category', category)
      if (query.trim()) {
        q = q.or(
          `title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`
        )
      }

      const { data } = await q
      setListings(data || [])
      setLoading(false)
    }
    fetchListings()
  }, [category, query])

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>

      {/* Hero */}
      <section className="bg-[#FAF7F2] border-b border-[#EFE9DD]">
        <div className="max-w-[1180px] mx-auto px-6 pt-16 pb-8">
          <p className="m-0 text-xs tracking-[0.16em] uppercase text-[#2D6A4F] font-semibold">
            University of Buea · verified students only
          </p>
          <h1 className="mt-3.5 mb-4 text-[clamp(34px,5.6vw,60px)] leading-[1.05] tracking-tight text-[#1B4332] font-bold max-w-[880px]">
            The campus marketplace. No middlemen, no fees.
          </h1>
          <p className="text-lg leading-relaxed text-[#3D3D3D] max-w-[640px] mb-8">
            Verified UB students buy and sell secondhand items safely. Browse free. Contact sellers directly on WhatsApp.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); setQuery(search) }}
            className="flex items-center bg-white border border-[#EFE9DD] rounded-[14px] p-1.5 gap-1.5 max-w-[720px]"
            style={{ boxShadow: '0 12px 28px -22px rgba(27,67,50,0.35)' }}
          >
            <span className="pl-3 text-[#6B6B6B] flex">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
              </svg>
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); if (e.target.value === '') setQuery('') }}
              placeholder="Search for a bed, a fridge, a textbook..."
              className="flex-1 border-0 outline-none text-base py-3 px-2 bg-transparent text-[#1A1A1A] min-w-0"
              style={{ fontFamily: 'inherit' }}
            />
            <button
              type="submit"
              className="bg-[#1B4332] text-[#FAF7F2] border-0 rounded-[10px] px-5 py-3 text-[15px] font-semibold cursor-pointer whitespace-nowrap hover:bg-[#143027] transition-colors"
              style={{ fontFamily: 'inherit' }}
            >
              Search
            </button>
          </form>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="flex-none border rounded-full px-4 py-2 text-sm font-medium cursor-pointer whitespace-nowrap transition-all duration-100"
                style={{
                  fontFamily: 'inherit',
                  background: category === c ? '#1B4332' : '#fff',
                  color: category === c ? '#FAF7F2' : '#1B4332',
                  borderColor: category === c ? '#1B4332' : '#EFE9DD',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Listing grid */}
      <section id="listings" className="bg-[#FAF7F2] py-10 pb-[72px]">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-6">
            <h2 className="m-0 text-2xl text-[#1B4332] font-bold tracking-tight">
              {category === 'All listings' ? 'Fresh on campus' : category}
            </h2>
            <p className="m-0 text-sm text-[#6B6B6B]">
              {loading ? 'Loading...' : `${listings.length} ${listings.length === 1 ? 'listing' : 'listings'}`}
            </p>
          </div>

          {!loading && listings.length === 0 && (
            <div className="bg-white border border-[#EFE9DD] rounded-2xl p-16 text-center text-[#6B6B6B]">
              {query ? `No listings found for "${query}". Try a different search.` : 'No listings yet — be the first to sell something!'}
            </div>
          )}

          {!loading && listings.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </div>
      </section>

      <HowItWorks />
    </div>
  )
}