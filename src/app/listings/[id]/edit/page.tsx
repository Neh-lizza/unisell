// FILE: src/app/listings/[id]/edit/page.tsx

'use client'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  'Bed and Mattress','Furniture','Fridge and Freezer','Fan and AC',
  'Kitchen Appliances','Electronics','Books and Handouts','Other',
]
const CONDITIONS = ['New', 'Used', 'Worn']

const CONDITION_COLORS: Record<string, { active: string; text: string; border: string }> = {
  New:  { active: '#E6F3EA', text: '#1B4332', border: '#2D6A4F' },
  Used: { active: '#FDF1DF', text: '#7A4400', border: '#D97706' },
  Worn: { active: '#FBE6E1', text: '#7A1F12', border: '#B83A2C' },
}

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [condition, setCondition] = useState('Used')
  const [whatsapp, setWhatsapp] = useState('')
  const [existingImageUrl, setExistingImageUrl] = useState('')
  const [newImage, setNewImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [priceSuggestion, setPriceSuggestion] = useState<{ min: number; max: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [whatsappError, setWhatsappError] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: listing } = await supabase
        .from('listings').select('*').eq('id', id).single()

      if (!listing) { router.push('/dashboard'); return }
      if (listing.seller_id !== user.id) { router.push('/dashboard'); return }

      setTitle(listing.title || '')
      setDescription(listing.description || '')
      setPrice(String(listing.price || ''))
      setCategory(listing.category || CATEGORIES[0])
      setCondition(listing.condition || 'Used')
      setWhatsapp(listing.whatsapp_contact || '')
      setExistingImageUrl(listing.image_url || '')
      fetchSuggestion(listing.category, listing.condition)
      setFetching(false)
    }
    init()
  }, [id])

  const fetchSuggestion = async (cat: string, con: string) => {
    const { data } = await supabase
      .from('price_suggestions').select('price_min, price_max')
      .eq('category', cat).eq('condition', con).single()
    if (data) setPriceSuggestion({ min: data.price_min, max: data.price_max })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setNewImage(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const validateWhatsapp = (val: string) => {
    if (val && !/^6\d{8}$/.test(val)) {
      setWhatsappError('Enter a valid number starting with 6 (9 digits)')
    } else {
      setWhatsappError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (whatsappError) return
    setLoading(true)
    setError('')

    let imageUrl = existingImageUrl
    if (newImage) {
      const fileName = `${Date.now()}-${newImage.name}`
      const { error: uploadError } = await supabase.storage
        .from('listings').upload(fileName, newImage)
      if (uploadError) {
        setError('Image upload failed: ' + uploadError.message)
        setLoading(false)
        return
      }
      imageUrl = supabase.storage.from('listings').getPublicUrl(fileName).data.publicUrl
    }

    const { error: updateError } = await supabase.from('listings').update({
      title, description,
      price: parseInt(price),
      category, condition,
      image_url: imageUrl,
      whatsapp_contact: whatsapp,
    }).eq('id', id)

    if (updateError) {
      setError('Failed to update listing: ' + updateError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  if (fetching) {
    return (
      <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
        <div className="max-w-[640px] mx-auto px-6 py-16 text-center text-[#6B6B6B]">Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
      <div className="max-w-[640px] mx-auto px-6 py-12">

        <button onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-[#6B6B6B] mb-6 bg-transparent border-0 cursor-pointer hover:text-[#1B4332] transition-colors p-0"
          style={{ fontFamily: 'inherit' }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
          </svg>
          Back to dashboard
        </button>

        <h1 className="m-0 mb-2 text-3xl font-bold tracking-tight text-[#1B4332]">Edit listing</h1>
        <p className="m-0 mb-8 text-[15px] text-[#6B6B6B]">Changes go live immediately.</p>

        {error && (
          <div className="bg-[#FBE6E1] border border-[#B83A2C] text-[#7A1F12] rounded-xl px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Item title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required
              className="w-full border border-[#D3D1C7] rounded-xl px-4 py-3 text-[15px] text-[#1A1A1A] bg-white outline-none focus:border-[#1B4332] transition-colors"
              style={{ fontFamily: 'inherit' }} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
              Description <span className="text-[#888780] font-normal">({description.length}/300)</span>
            </label>
            <textarea value={description} onChange={e => setDescription(e.target.value.slice(0, 300))}
              rows={3}
              className="w-full border border-[#D3D1C7] rounded-xl px-4 py-3 text-[15px] text-[#1A1A1A] bg-white outline-none focus:border-[#1B4332] transition-colors resize-none"
              style={{ fontFamily: 'inherit' }} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Category</label>
            <select value={category}
              onChange={e => { setCategory(e.target.value); fetchSuggestion(e.target.value, condition) }}
              className="w-full border border-[#D3D1C7] rounded-xl px-4 py-3 text-[15px] text-[#1A1A1A] bg-white outline-none focus:border-[#1B4332] transition-colors"
              style={{ fontFamily: 'inherit' }}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Condition</label>
            <div className="flex gap-3">
              {CONDITIONS.map(c => {
                const col = CONDITION_COLORS[c]
                const active = condition === c
                return (
                  <button key={c} type="button"
                    onClick={() => { setCondition(c); fetchSuggestion(category, c) }}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-100 cursor-pointer"
                    style={{ fontFamily: 'inherit', background: active ? col.active : '#fff', color: active ? col.text : '#888780', borderColor: active ? col.border : '#D3D1C7' }}>
                    {c}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Price (XAF)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888780] text-sm font-medium">XAF</span>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} required
                className="w-full border border-[#D3D1C7] rounded-xl pl-14 pr-4 py-3 text-[15px] text-[#1A1A1A] bg-white outline-none focus:border-[#1B4332] transition-colors"
                style={{ fontFamily: 'inherit' }} />
            </div>
            {priceSuggestion && (
              <div className="mt-2 flex items-center gap-2 bg-[#E6F1FB] border border-[#85B7EB] rounded-lg px-3 py-2">
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><path d="M12 16v-4m0-4h.01" />
                </svg>
                <p className="m-0 text-xs text-[#185FA5] font-medium">
                  AI suggested: {priceSuggestion.min.toLocaleString()} — {priceSuggestion.max.toLocaleString()} XAF
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">WhatsApp number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888780] text-sm font-medium">+237</span>
              <input value={whatsapp}
                onChange={e => { setWhatsapp(e.target.value); validateWhatsapp(e.target.value) }}
                maxLength={9}
                className="w-full border border-[#D3D1C7] rounded-xl pl-14 pr-4 py-3 text-[15px] text-[#1A1A1A] bg-white outline-none focus:border-[#1B4332] transition-colors"
                style={{ fontFamily: 'inherit', borderColor: whatsappError ? '#B83A2C' : undefined }} />
            </div>
            {whatsappError && <p className="m-0 mt-1.5 text-xs text-[#7A1F12]">{whatsappError}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Photo</label>
            {(imagePreview || existingImageUrl) && (
              <div className="relative mb-3">
                <img src={imagePreview || existingImageUrl} alt="Current photo"
                  className="w-full rounded-xl object-cover border border-[#D3D1C7]" style={{ maxHeight: 200 }} />
                <span className="absolute top-3 left-3 bg-white border border-[#D3D1C7] rounded-lg px-2 py-1 text-xs font-medium text-[#6B6B6B]">
                  {imagePreview ? 'New photo' : 'Current photo'}
                </span>
              </div>
            )}
            <label className="flex items-center justify-center gap-2 w-full border border-dashed border-[#D3D1C7] rounded-xl py-4 cursor-pointer hover:border-[#1B4332] transition-colors bg-white text-sm text-[#888780] font-medium">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              {existingImageUrl ? 'Replace photo' : 'Upload photo'}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={() => router.back()}
              className="flex-1 py-4 rounded-xl font-bold text-base border border-[#D3D1C7] text-[#6B6B6B] bg-white hover:bg-[#F1EFE8] transition-colors cursor-pointer"
              style={{ fontFamily: 'inherit' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading || !!whatsappError}
              className="flex-1 bg-[#1B4332] text-[#FAF7F2] py-4 rounded-xl font-bold text-base hover:bg-[#143027] transition-colors disabled:opacity-50 cursor-pointer"
              style={{ fontFamily: 'inherit' }}>
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
