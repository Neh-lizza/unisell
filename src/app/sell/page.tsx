'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  'Bed and Mattress',
  'Furniture',
  'Fridge and Freezer',
  'Fan and AC',
  'Kitchen Appliances',
  'Electronics',
  'Books and Handouts',
  'Other',
]
const CONDITIONS = ['New', 'Used', 'Worn']

export default function SellPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [condition, setCondition] = useState('Used')
  const [whatsapp, setWhatsapp] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [priceSuggestion, setPriceSuggestion] = useState<{min:number,max:number}|null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch price suggestion when category or condition changes
  const fetchSuggestion = async (cat: string, con: string) => {
    const { data } = await supabase
      .from('price_suggestions')
      .select('price_min, price_max')
      .eq('category', cat)
      .eq('condition', con)
      .single()
    if (data) setPriceSuggestion({ min: data.price_min, max: data.price_max })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let imageUrl = ''
    if (image) {
      const fileName = `${Date.now()}-${image.name}`
      await supabase.storage.from('listings').upload(fileName, image)
      imageUrl = supabase.storage.from('listings').getPublicUrl(fileName).data.publicUrl
    }

    await supabase.from('listings').insert({
      seller_id: user.id,
      title, description, price: parseInt(price),
      category, condition, image_url: imageUrl,
      whatsapp_contact: whatsapp,
    })
    setLoading(false)
    window.location.href = '/'
  }
  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-blue-900">Post an Item</h1>
      <input placeholder="Title (e.g. Single bed frame)" value={title}
        onChange={e=>setTitle(e.target.value)}
        className="w-full border rounded-lg p-3" required />
      <textarea placeholder="Description" value={description}
        onChange={e=>setDescription(e.target.value)}
        className="w-full border rounded-lg p-3 h-24" />
      <select value={category} onChange={e=>{setCategory(e.target.value);fetchSuggestion(e.target.value,condition)}}
        className="w-full border rounded-lg p-3">
        {CATEGORIES.map(c=><option key={c}>{c}</option>)}
      </select>
      <select value={condition} onChange={e=>{setCondition(e.target.value);fetchSuggestion(category,e.target.value)}}
        className="w-full border rounded-lg p-3">
        {CONDITIONS.map(c=><option key={c}>{c}</option>)}
      </select>
      <div>
        <input type="number" placeholder="Your price (XAF)" value={price}
          onChange={e=>setPrice(e.target.value)}
          className="w-full border rounded-lg p-3" required />
        {priceSuggestion && (
          <p className="text-sm text-blue-600 mt-1">
            AI Suggested price range: {priceSuggestion.min.toLocaleString()} XAF
            — {priceSuggestion.max.toLocaleString()} XAF
          </p>
        )}
      </div>
      <input placeholder="WhatsApp number (e.g. 677123456)" value={whatsapp}
        onChange={e=>setWhatsapp(e.target.value)}
        className="w-full border rounded-lg p-3" />
      <input type="file" accept="image/*"
        onChange={e=>setImage(e.target.files?.[0]||null)}
        className="w-full border rounded-lg p-3" />
      <button type="submit" disabled={loading}
        className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold">
        {loading ? 'Posting...' : 'Post Listing'}
      </button>
    </form>
  )
}


