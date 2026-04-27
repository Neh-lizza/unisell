'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const CATEGORIES = ['All','Bed and Mattress','Furniture','Fridge and Freezer',
  'Fan and AC','Kitchen Appliances','Electronics','Books and Handouts','Other']

export default function HomePage() {
  const [listings, setListings] = useState<any[]>([])
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetch = async () => {
      let q = supabase.from('listings').select('*')
        .eq('is_active', true).eq('is_flagged', false)
        .order('created_at', { ascending: false })
      if (category !== 'All') q = q.eq('category', category)
      if (search) q = q.ilike('title', `%${search}%`)
      const { data } = await q
      setListings(data || [])
    }
    fetch()
  }, [category, search])

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex gap-3 mb-6">
        <input placeholder="Search items..." value={search}
          onChange={e=>setSearch(e.target.value)}
          className="flex-1 border rounded-lg p-3" />
        <select value={category} onChange={e=>setCategory(e.target.value)}
          className="border rounded-lg p-3">
          {CATEGORIES.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {listings.map(l => (
          <Link key={l.id} href={`/listings/${l.id}`}
            className="border rounded-xl overflow-hidden hover:shadow-md">
            {l.image_url && <img src={l.image_url} className="w-full h-40 object-cover"/>}
            <div className="p-3">
              <p className="font-semibold text-sm truncate">{l.title}</p>
              <p className="text-blue-900 font-bold">{l.price.toLocaleString()} XAF</p>
              <span className="text-xs bg-gray-100 rounded px-2 py-1">{l.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
