// FILE: src/app/listings/[id]/page.tsx

'use client'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const CONDITION_STYLE: Record<string, { bg: string; color: string; dot: string }> = {
  New: { bg: '#E6F3EA', color: '#1B4332', dot: '#2D6A4F' },
  Used: { bg: '#FDF1DF', color: '#7A4400', dot: '#D97706' },
  Worn: { bg: '#FBE6E1', color: '#7A1F12', dot: '#B83A2C' },
}

function ConditionBadge({ value }: { value: string }) {
  const s = CONDITION_STYLE[value] || CONDITION_STYLE.Used
  return (
    <span
      style={{ background: s.bg, color: s.color }}
      className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full"
    >
      <span style={{ background: s.dot }} className="w-2 h-2 rounded-full inline-block" />
      {value}
    </span>
  )
}

export default function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [listing, setListing] = useState<any>(null)
  const [similar, setSimilar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setListing(data)
        setLoading(false)
      })

    supabase
      .from('recommendations')
      .select('recommended_listing_id, similarity_score, listings!recommended_listing_id(*)')
      .eq('listing_id', id)
      .order('similarity_score', { ascending: false })
      .limit(4)
      .then(({ data }) => setSimilar(data || []))
  }, [id])

  // Update page title once listing loads
  useEffect(() => {
    if (listing) {
      document.title = `${listing.title} — UniSell`
    }
  }, [listing])

  if (loading) {
    return (
      <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
        <div className="max-w-[760px] mx-auto px-6 py-8">
          <div className="w-20 h-5 bg-[#E2D9C5] rounded-lg mb-6 animate-pulse" />
          <div
            className="w-full rounded-2xl bg-[#E2D9C5] animate-pulse mb-6"
            style={{ height: 360 }}
          />
          <div className="bg-white border border-[#EFE9DD] rounded-2xl p-6 animate-pulse">
            <div className="h-7 bg-[#E2D9C5] rounded-lg w-2/3 mb-4" />
            <div className="h-9 bg-[#E2D9C5] rounded-lg w-1/3 mb-4" />
            <div className="flex gap-2 mb-4">
              <div className="h-7 bg-[#E2D9C5] rounded-full w-16" />
              <div className="h-7 bg-[#E2D9C5] rounded-full w-24" />
            </div>
            <div className="h-4 bg-[#E2D9C5] rounded-lg w-full mb-2" />
            <div className="h-4 bg-[#E2D9C5] rounded-lg w-4/5" />
          </div>
          <div className="h-14 bg-[#E2D9C5] rounded-2xl mt-4 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
        <div className="max-w-[760px] mx-auto px-6 py-16 text-center">
          <div className="w-16 h-16 bg-[#FBE6E1] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              width={28}
              height={28}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#B83A2C"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" />
            </svg>
          </div>
          <p className="text-lg font-bold text-[#1B4332] mb-2">Listing not found</p>
          <p className="text-[#6B6B6B] mb-6">It may have been sold or removed by the seller.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#1B4332] text-[#FAF7F2] no-underline px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#143027] transition-colors"
          >
            Browse other listings
          </Link>
        </div>
      </div>
    )
  }

  const waMsg = encodeURIComponent(
    `Hi, I saw your listing for ${listing.title} on UniSell. Is it still available?`
  )

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
      <div className="max-w-[760px] mx-auto px-6 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-[#6B6B6B] mb-6 bg-transparent border-0 cursor-pointer hover:text-[#1B4332] transition-colors p-0"
          style={{ fontFamily: 'inherit' }}
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Back
        </button>

        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={listing.title}
            className="w-full rounded-2xl mb-6 object-cover"
            style={{ maxHeight: 420 }}
          />
        ) : (
          <div
            className="w-full rounded-2xl mb-6 bg-[#E2D9C5] flex items-center justify-center text-sm font-semibold uppercase tracking-widest text-[#888]"
            style={{ height: 280 }}
          >
            No photo
          </div>
        )}

        <div className="bg-white border border-[#EFE9DD] rounded-2xl p-6 mb-4">
          <h1 className="m-0 mb-3 text-2xl font-bold text-[#1A1A1A] tracking-tight leading-snug">
            {listing.title}
          </h1>
          <p className="m-0 mb-4 text-3xl font-bold text-[#D97706] tracking-tight">
            {listing.price.toLocaleString()} XAF
          </p>
          <div className="flex gap-2 flex-wrap mb-4">
            <ConditionBadge value={listing.condition} />
            <span className="text-sm bg-[#F1EFE8] text-[#5F5E5A] px-3 py-1.5 rounded-full font-medium">
              {listing.category}
            </span>
            {!listing.is_active && (
              <span className="text-sm bg-[#E6F3EA] text-[#1B4332] px-3 py-1.5 rounded-full font-semibold">
                Sold
              </span>
            )}
          </div>
          {listing.description && (
            <p className="m-0 text-[15px] text-[#3D3D3D] leading-relaxed border-t border-[#EFE9DD] pt-4">
              {listing.description}
            </p>
          )}
        </div>

        {listing.is_active ? (
          <a
            href={`https://wa.me/237${listing.whatsapp_contact}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white no-underline py-4 rounded-2xl font-bold text-lg hover:bg-[#1FBB5A] transition-colors mb-4"
          >
            <svg width={22} height={22} viewBox="0 0 32 32" aria-hidden="true">
              <path
                fill="currentColor"
                d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8C11.7 28.4 13.8 29 16 29c7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23.6c-2 0-3.9-.5-5.6-1.6l-.4-.2-4 1 1.1-3.9-.3-.4C5.6 19.9 5 18 5 16c0-6.1 4.9-11 11-11s11 4.9 11 11-4.9 11-11 11zm6.2-8.3c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.2-.2.2-.3.4-.5.1-.2.1-.4 0-.5 0-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.3 3.1c.2.2 2.2 3.3 5.4 4.7.8.3 1.4.5 1.8.7.8.2 1.5.2 2.1.1.6-.1 2-.8 2.3-1.6.3-.8.3-1.4.2-1.6 0-.2-.3-.3-.6-.4z"
              />
            </svg>
            Contact seller on WhatsApp
          </a>
        ) : (
          <div className="w-full bg-[#F1EFE8] border border-[#D3D1C7] text-[#888780] text-center py-4 rounded-2xl font-semibold text-lg mb-4">
            This item has been sold
          </div>
        )}

        <p className="m-0 text-xs text-center text-[#888780] mb-10">
          Meet in person on campus. Pay only when you are happy with the item.
        </p>

        {similar.length > 0 && (
          <div>
            <h2 className="m-0 mb-4 text-lg font-bold text-[#1B4332]">
              Similar items you might like
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {similar.map((r: any) => {
                const s = r.listings
                if (!s) return null
                return (
                  <Link
                    key={s.id}
                    href={`/listings/${s.id}`}
                    className="bg-white border border-[#EFE9DD] rounded-2xl overflow-hidden no-underline hover:-translate-y-1 transition-transform duration-200"
                  >
                    {s.image_url ? (
                      <img src={s.image_url} alt={s.title} className="w-full h-32 object-cover" />
                    ) : (
                      <div className="w-full h-32 bg-[#E2D9C5] flex items-center justify-center text-xs font-semibold uppercase tracking-widest text-[#888]">
                        {s.category}
                      </div>
                    )}
                    <div className="p-3">
                      <p className="m-0 text-sm font-bold text-[#1A1A1A] truncate">{s.title}</p>
                      <p className="m-0 text-base font-bold text-[#D97706] mt-0.5">
                        {s.price.toLocaleString()} XAF
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
