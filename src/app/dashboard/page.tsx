// FILE: src/app/dashboard/page.tsx

'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
    >
      <span style={{ background: s.dot }} className="w-1.5 h-1.5 rounded-full inline-block" />
      {value}
    </span>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'My listings — UniSell'
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }) => setProfile(data))
      fetchListings(user.id)
    })
  }, [])

  const fetchListings = async (uid: string) => {
    setLoading(true)
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('seller_id', uid)
      .order('created_at', { ascending: false })
    setListings(data || [])
    setLoading(false)
  }

  const markSold = async (id: string) => {
    setActionLoading(id + '-sold')
    await supabase.from('listings').update({ is_active: false }).eq('id', id)
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, is_active: false } : l)))
    setActionLoading(null)
  }

  const markActive = async (id: string) => {
    setActionLoading(id + '-active')
    await supabase.from('listings').update({ is_active: true }).eq('id', id)
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, is_active: true } : l)))
    setActionLoading(null)
  }

  const deleteListing = async (id: string) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return
    setActionLoading(id + '-delete')
    await supabase.from('listings').delete().eq('id', id)
    setListings((prev) => prev.filter((l) => l.id !== id))
    setActionLoading(null)
  }

  const activeListings = listings.filter((l) => l.is_active)
  const soldListings = listings.filter((l) => !l.is_active)

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
      <section className="bg-[#FAF7F2] border-b border-[#EFE9DD]">
        <div className="max-w-[1180px] mx-auto px-6 pt-12 pb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="m-0 mb-1 text-3xl font-bold tracking-tight text-[#1B4332]">
                My listings
              </h1>
              <p className="m-0 text-[15px] text-[#6B6B6B]">{user?.email}</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 bg-[#1B4332] text-[#FAF7F2] no-underline px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#143027] transition-colors"
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
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Post new item
              </Link>
              {profile && !profile.is_subscribed && (
                <Link
                  href="/subscribe"
                  className="inline-flex items-center gap-2 bg-[#D97706] text-white no-underline px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#B45309] transition-colors"
                >
                  Subscribe — 300 XAF/yr
                </Link>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-8 flex-wrap">
            {[
              { label: 'Active listings', value: activeListings.length },
              { label: 'Sold / inactive', value: soldListings.length },
              { label: 'Subscription', value: profile?.is_subscribed ? 'Active' : 'Free tier' },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white border border-[#EFE9DD] rounded-xl px-5 py-4 min-w-[140px]"
              >
                <p className="m-0 text-xs text-[#6B6B6B] mb-1">{s.label}</p>
                <p className="m-0 text-xl font-bold text-[#1B4332]">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1180px] mx-auto px-6 py-10">
        {loading && <p className="text-center text-[#6B6B6B] py-16">Loading your listings...</p>}

        {!loading && listings.length === 0 && (
          <div className="bg-white border border-[#EFE9DD] rounded-2xl p-16 text-center">
            <p className="m-0 mb-4 text-lg font-bold text-[#1B4332]">No listings yet</p>
            <p className="m-0 mb-6 text-[#6B6B6B]">
              Post your first item — it goes live immediately.
            </p>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 bg-[#1B4332] text-[#FAF7F2] no-underline px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#143027] transition-colors"
            >
              Post an item
            </Link>
          </div>
        )}

        {!loading && activeListings.length > 0 && (
          <div className="mb-10">
            <h2 className="m-0 mb-4 text-lg font-bold text-[#1B4332]">
              Active — visible to buyers
            </h2>
            <div className="flex flex-col gap-3">
              {activeListings.map((l) => (
                <div
                  key={l.id}
                  className="bg-white border border-[#EFE9DD] rounded-2xl p-5 flex gap-4 items-start flex-wrap"
                >
                  {l.image_url ? (
                    <img
                      src={l.image_url}
                      alt={l.title}
                      className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-[#E2D9C5] rounded-xl flex-shrink-0 flex items-center justify-center text-[10px] font-semibold uppercase tracking-widest text-[#888]">
                      No photo
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="m-0 font-bold text-[#1A1A1A] truncate">{l.title}</p>
                    <p className="m-0 text-lg font-bold text-[#D97706] mt-0.5">
                      {l.price.toLocaleString()} XAF
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <ConditionBadge value={l.condition} />
                      <span className="text-xs bg-[#F1EFE8] text-[#5F5E5A] px-2.5 py-1 rounded-full font-medium">
                        {l.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 flex-wrap">
                    <Link
                      href={`/listings/${l.id}`}
                      className="px-4 py-2 rounded-lg text-sm font-semibold border border-[#D3D1C7] text-[#6B6B6B] no-underline hover:bg-[#F1EFE8] transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      href={`/listings/${l.id}/edit`}
                      className="px-4 py-2 rounded-lg text-sm font-semibold border border-[#1B4332] text-[#1B4332] no-underline hover:bg-[#1B4332] hover:text-white transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => markSold(l.id)}
                      disabled={actionLoading === l.id + '-sold'}
                      className="px-4 py-2 rounded-lg text-sm font-semibold border border-[#D97706] text-[#7A4400] bg-[#FDF1DF] hover:bg-[#D97706] hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                      style={{ fontFamily: 'inherit' }}
                    >
                      {actionLoading === l.id + '-sold' ? 'Updating...' : 'Mark as sold'}
                    </button>
                    <button
                      onClick={() => deleteListing(l.id)}
                      disabled={actionLoading === l.id + '-delete'}
                      className="px-4 py-2 rounded-lg text-sm font-semibold border border-[#FBE6E1] text-[#7A1F12] bg-[#FBE6E1] hover:bg-[#B83A2C] hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                      style={{ fontFamily: 'inherit' }}
                    >
                      {actionLoading === l.id + '-delete' ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && soldListings.length > 0 && (
          <div>
            <h2 className="m-0 mb-4 text-lg font-bold text-[#6B6B6B]">
              Sold / inactive — hidden from buyers
            </h2>
            <div className="flex flex-col gap-3">
              {soldListings.map((l) => (
                <div
                  key={l.id}
                  className="bg-white border border-[#EFE9DD] rounded-2xl p-5 flex gap-4 items-start flex-wrap opacity-60"
                >
                  {l.image_url ? (
                    <img
                      src={l.image_url}
                      alt={l.title}
                      className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-[#E2D9C5] rounded-xl flex-shrink-0 flex items-center justify-center text-[10px] font-semibold uppercase tracking-widest text-[#888]">
                      No photo
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="m-0 font-bold text-[#1A1A1A] truncate">{l.title}</p>
                      <span className="text-xs bg-[#E6F3EA] text-[#1B4332] px-2.5 py-1 rounded-full font-semibold flex-shrink-0">
                        Sold
                      </span>
                    </div>
                    <p className="m-0 text-lg font-bold text-[#D97706] mt-0.5">
                      {l.price.toLocaleString()} XAF
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <ConditionBadge value={l.condition} />
                      <span className="text-xs bg-[#F1EFE8] text-[#5F5E5A] px-2.5 py-1 rounded-full font-medium">
                        {l.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 flex-wrap">
                    <button
                      onClick={() => markActive(l.id)}
                      disabled={actionLoading === l.id + '-active'}
                      className="px-4 py-2 rounded-lg text-sm font-semibold border border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332] hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                      style={{ fontFamily: 'inherit' }}
                    >
                      {actionLoading === l.id + '-active' ? 'Updating...' : 'Relist'}
                    </button>
                    <button
                      onClick={() => deleteListing(l.id)}
                      disabled={actionLoading === l.id + '-delete'}
                      className="px-4 py-2 rounded-lg text-sm font-semibold border border-[#FBE6E1] text-[#7A1F12] bg-[#FBE6E1] hover:bg-[#B83A2C] hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                      style={{ fontFamily: 'inherit' }}
                    >
                      {actionLoading === l.id + '-delete' ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
