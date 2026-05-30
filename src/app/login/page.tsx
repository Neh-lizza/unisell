// FILE: src/app/login/page.tsx

'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    document.title = 'Sign in — UniSell'
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push('/')
    })
  }, [])

  useEffect(() => {
    document.title = mode === 'login' ? 'Sign in — UniSell' : 'Create account — UniSell'
  }, [mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
        setLoading(false)
      } else router.push('/')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        setSuccess('Account created! Check your email to confirm, then log in.')
        setLoading(false)
        setMode('login')
      }
    }
  }

  return (
    <div
      style={{ background: '#FAF7F2', minHeight: '100vh' }}
      className="flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <h1 className="m-0 mb-2 text-4xl font-bold tracking-tight text-[#1B4332]">UniSell</h1>
          <p className="m-0 text-[15px] text-[#6B6B6B]">Buy and sell on campus.</p>
        </div>
        <div className="bg-white border border-[#EFE9DD] rounded-2xl p-8">
          <div className="flex bg-[#F1EFE8] rounded-xl p-1 mb-6">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m)
                  setError('')
                  setSuccess('')
                }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer border-0"
                style={{
                  fontFamily: 'inherit',
                  background: mode === m ? '#fff' : 'transparent',
                  color: mode === m ? '#1B4332' : '#888780',
                  boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {m === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-[#FBE6E1] border border-[#B83A2C] text-[#7A1F12] rounded-xl px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-[#E6F3EA] border border-[#2D6A4F] text-[#1B4332] rounded-xl px-4 py-3 mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-[#D3D1C7] rounded-xl px-4 py-3 text-[15px] text-[#1A1A1A] bg-white outline-none focus:border-[#1B4332] transition-colors"
                style={{ fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Password</label>
              <input
                type="password"
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-[#D3D1C7] rounded-xl px-4 py-3 text-[15px] text-[#1A1A1A] bg-white outline-none focus:border-[#1B4332] transition-colors"
                style={{ fontFamily: 'inherit' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B4332] text-[#FAF7F2] py-3.5 rounded-xl font-bold text-[15px] hover:bg-[#143027] transition-colors disabled:opacity-50 cursor-pointer mt-1"
              style={{ fontFamily: 'inherit' }}
            >
              {loading
                ? mode === 'login'
                  ? 'Signing in...'
                  : 'Creating account...'
                : mode === 'login'
                  ? 'Sign in'
                  : 'Create account'}
            </button>
          </form>

          <p className="m-0 mt-5 text-center text-sm text-[#888780]">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login')
                setError('')
                setSuccess('')
              }}
              className="text-[#1B4332] font-semibold bg-transparent border-0 cursor-pointer hover:underline p-0"
              style={{ fontFamily: 'inherit' }}
            >
              {mode === 'login' ? 'Create account' : 'Sign in'}
            </button>
          </p>
        </div>
        <p className="m-0 mt-6 text-center text-xs text-[#B4B2A9]">
          By signing up you agree to use UniSell responsibly.
        </p>
      </div>
    </div>
  )
}
