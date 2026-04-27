'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ListingPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<any>(null)
  const [similar, setSimilar] = useState<any[]>([])

  useEffect(() => {
    // Fetch the listing
    supabase.from('listings').select('*').eq('id', params.id)
      .single().then(({ data }) => setListing(data))

    // Fetch similar items from recommendations table
    supabase.from('recommendations')
      .select('recommended_listing_id, similarity_score, listings!recommended_listing_id(*)')
      .eq('listing_id', params.id)
      .order('similarity_score', { ascending: false })
      .limit(4)
      .then(({ data }) => setSimilar(data || []))
  }, [params.id])

  if (!listing) return <p className="p-8 text-center">Loading...</p>

  const waMsg = encodeURIComponent(
    `Hi, I saw your listing for ${listing.title} on UniSell. Is it still available?`
  )

  return (
    <div className="max-w-2xl mx-auto p-4">
      {listing.image_url && (
        <img src={listing.image_url} className="w-full rounded-xl mb-4 max-h-80 object-cover"/>
      )}
      <h1 className="text-2xl font-bold">{listing.title}</h1>
      <p className="text-3xl font-bold text-blue-900 my-2">
        {listing.price.toLocaleString()} XAF
      </p>
      <div className="flex gap-2 mb-4">
        <span className="bg-gray-100 text-sm px-3 py-1 rounded-full">{listing.category}</span>
        <span className="bg-gray-100 text-sm px-3 py-1 rounded-full">{listing.condition}</span>
      </div>
      <p className="text-gray-600 mb-6">{listing.description}</p>
      <a href={`https://wa.me/237${listing.whatsapp_contact}?text=${waMsg}`}
        target="_blank"
        className="block w-full bg-green-500 hover:bg-green-600 text-white
          text-center py-4 rounded-xl font-bold text-lg mb-8">
        Contact Seller on WhatsApp
      </a>

      {similar.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-3">Similar Items You Might Like</h2>
          <div className="grid grid-cols-2 gap-3">
            {similar.map((r: any) => {
              const s = r.listings
              return (
                <Link key={s.id} href={`/listings/${s.id}`}
                  className="border rounded-xl overflow-hidden hover:shadow-md">
                  {s.image_url && <img src={s.image_url} className="w-full h-32 object-cover"/>}
                  <div className="p-2">
                    <p className="text-sm font-semibold truncate">{s.title}</p>
                    <p className="text-blue-900 font-bold text-sm">{s.price.toLocaleString()} XAF</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}