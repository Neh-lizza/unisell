// FILE: src/app/sell/page.tsx

'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

const CONDITION_COLORS: Record<string, { active: string; text: string; border: string }> = {
  New: { active: '#E6F3EA', text: '#1B4332', border: '#2D6A4F' },
  Used: { active: '#FDF1DF', text: '#7A4400', border: '#D97706' },
  Worn: { active: '#FBE6E1', text: '#7A1F12', border: '#B83A2C' },
}

export default function SellPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [condition, setCondition] = useState('Used')
  const [whatsapp, setWhatsapp] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [priceSuggestion, setPriceSuggestion] = useState<{ min: number; max: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [whatsappError, setWhatsappError] = useState('')

  useEffect(() => {
    document.title = 'Post an item — UniSell'
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
    })
    fetchSuggestion(CATEGORIES[0], 'Used')
  }, [])

  const fetchSuggestion = async (cat: string, con: string) => {
    const { data } = await supabase
      .from('price_suggestions')
      .select('price_min, price_max')
      .eq('category', cat)
      .eq('condition', con)
      .single()
    if (data) setPriceSuggestion({ min: data.price_min, max: data.price_max })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImage(file)
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

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    let imageUrl = ''
    if (image) {
      const fileName = `${Date.now()}-${image.name}`
      const { error: uploadError } = await supabase.storage.from('listings').upload(fileName, image)
      if (uploadError) {
        setError('Image upload failed: ' + uploadError.message)
        setLoading(false)
        return
      }
      imageUrl = supabase.storage.from('listings').getPublicUrl(fileName).data.publicUrl
    }

    const { error: insertError } = await supabase.from('listings').insert({
      seller_id: user.id,
      title,
      description,
      price: parseInt(price),
      category,
      condition,
      image_url: imageUrl,
      whatsapp_contact: whatsapp,
    })

    if (insertError) {
      setError('Failed to post listing: ' + insertError.message)
      setLoading(false)
      return
    }

    router.push('/')
  }

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
      <div className="max-w-[640px] mx-auto px-6 py-12">
        <h1 className="m-0 mb-2 text-3xl font-bold tracking-tight text-[#1B4332]">Post an item</h1>
        <p className="m-0 mb-8 text-[15px] text-[#6B6B6B]">
          Your listing goes live immediately. Buyers contact you directly on WhatsApp.
        </p>

        {error && (
          <div className="bg-[#FBE6E1] border border-[#B83A2C] text-[#7A1F12] rounded-xl px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Item title</label>
            <input
              placeholder="e.g. Single bed frame, Standing fan, HP laptop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-[#D3D1C7] rounded-xl px-4 py-3 text-[15px] text-[#1A1A1A] bg-white outline-none focus:border-[#1B4332] transition-colors"
              style={{ fontFamily: 'inherit' }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
              Description{' '}
              <span className="text-[#888780] font-normal">({description.length}/300)</span>
            </label>
            <textarea
              placeholder="Describe the item — size, colour, any defects, reason for selling..."
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 300))}
              rows={3}
              className="w-full border border-[#D3D1C7] rounded-xl px-4 py-3 text-[15px] text-[#1A1A1A] bg-white outline-none focus:border-[#1B4332] transition-colors resize-none"
              style={{ fontFamily: 'inherit' }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                fetchSuggestion(e.target.value, condition)
              }}
              className="w-full border border-[#D3D1C7] rounded-xl px-4 py-3 text-[15px] text-[#1A1A1A] bg-white outline-none focus:border-[#1B4332] transition-colors"
              style={{ fontFamily: 'inherit' }}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Condition</label>
            <div className="flex gap-3">
              {CONDITIONS.map((c) => {
                const col = CONDITION_COLORS[c]
                const active = condition === c
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCondition(c)
                      fetchSuggestion(category, c)
                    }}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-100 cursor-pointer"
                    style={{
                      fontFamily: 'inherit',
                      background: active ? col.active : '#fff',
                      color: active ? col.text : '#888780',
                      borderColor: active ? col.border : '#D3D1C7',
                    }}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Price (XAF)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888780] text-sm font-medium">
                XAF
              </span>
              <input
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full border border-[#D3D1C7] rounded-xl pl-14 pr-4 py-3 text-[15px] text-[#1A1A1A] bg-white outline-none focus:border-[#1B4332] transition-colors"
                style={{ fontFamily: 'inherit' }}
              />
            </div>
            {priceSuggestion && (
              <div className="mt-2 flex items-center gap-2 bg-[#E6F1FB] border border-[#85B7EB] rounded-lg px-3 py-2">
                <svg
                  width={14}
                  height={14}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#185FA5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4m0-4h.01" />
                </svg>
                <p className="m-0 text-xs text-[#185FA5] font-medium">
                  AI suggested: {priceSuggestion.min.toLocaleString()} —{' '}
                  {priceSuggestion.max.toLocaleString()} XAF for {condition} {category}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
              WhatsApp number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888780] text-sm font-medium">
                +237
              </span>
              <input
                placeholder="677123456"
                value={whatsapp}
                onChange={(e) => {
                  setWhatsapp(e.target.value)
                  validateWhatsapp(e.target.value)
                }}
                maxLength={9}
                className="w-full border border-[#D3D1C7] rounded-xl pl-14 pr-4 py-3 text-[15px] text-[#1A1A1A] bg-white outline-none focus:border-[#1B4332] transition-colors"
                style={{
                  fontFamily: 'inherit',
                  borderColor: whatsappError ? '#B83A2C' : undefined,
                }}
              />
            </div>
            {whatsappError && <p className="m-0 mt-1.5 text-xs text-[#7A1F12]">{whatsappError}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Photo</label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full rounded-xl object-cover border border-[#D3D1C7]"
                  style={{ maxHeight: 240 }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null)
                    setImagePreview(null)
                  }}
                  className="absolute top-3 right-3 bg-white border border-[#D3D1C7] rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-[#FBE6E1] transition-colors"
                  style={{ fontFamily: 'inherit' }}
                >
                  <svg
                    width={14}
                    height={14}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7A1F12"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-[#D3D1C7] rounded-xl py-10 cursor-pointer hover:border-[#1B4332] transition-colors bg-white">
                <svg
                  width={28}
                  height={28}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#888780"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="mb-3"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
                <p className="m-0 text-sm font-medium text-[#888780]">Click to upload a photo</p>
                <p className="m-0 text-xs text-[#B4B2A9] mt-1">JPG, PNG up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !!whatsappError}
            className="w-full bg-[#1B4332] text-[#FAF7F2] py-4 rounded-xl font-bold text-base hover:bg-[#143027] transition-colors disabled:opacity-50 cursor-pointer mt-2"
            style={{ fontFamily: 'inherit' }}
          >
            {loading ? 'Posting...' : 'Post listing'}
          </button>
        </form>
      </div>
    </div>
  )
}
