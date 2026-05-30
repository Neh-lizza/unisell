// FILE: src/test/utils.test.ts

import { describe, it, expect } from 'vitest'
import {
  formatPrice,
  buildWhatsAppUrl,
  isValidCamPhone,
  truncate,
  getConditionStyle,
  shouldShowSubscribeBanner,
} from '@/lib/utils'

// ─────────────────────────────────────────────
// formatPrice
// ─────────────────────────────────────────────
describe('formatPrice', () => {
  it('formats a round number correctly', () => {
    expect(formatPrice(25000)).toBe('25,000 XAF')
  })

  it('formats a small price correctly', () => {
    expect(formatPrice(500)).toBe('500 XAF')
  })

  it('formats a large price correctly', () => {
    expect(formatPrice(1500000)).toBe('1,500,000 XAF')
  })

  it('formats zero correctly', () => {
    expect(formatPrice(0)).toBe('0 XAF')
  })
})

// ─────────────────────────────────────────────
// buildWhatsAppUrl
// ─────────────────────────────────────────────
describe('buildWhatsAppUrl', () => {
  it('builds a valid WhatsApp URL', () => {
    const url = buildWhatsAppUrl('677123456', 'Standing fan')
    expect(url).toContain('https://wa.me/237677123456')
  })

  it('includes the item title in the message', () => {
    const url = buildWhatsAppUrl('677123456', 'Standing fan')
    expect(url).toContain('Standing%20fan')
  })

  it('includes the UniSell brand in the message', () => {
    const url = buildWhatsAppUrl('677123456', 'Laptop')
    expect(url).toContain('UniSell')
  })

  it('prepends Cameroon country code 237', () => {
    const url = buildWhatsAppUrl('651354402', 'Fridge')
    expect(url).toContain('237651354402')
  })
})

// ─────────────────────────────────────────────
// isValidCamPhone
// ─────────────────────────────────────────────
describe('isValidCamPhone', () => {
  it('accepts a valid MTN number', () => {
    expect(isValidCamPhone('677123456')).toBe(true)
  })

  it('accepts a valid Orange number', () => {
    expect(isValidCamPhone('695432100')).toBe(true)
  })

  it('rejects a number not starting with 6', () => {
    expect(isValidCamPhone('777123456')).toBe(false)
  })

  it('rejects a number that is too short', () => {
    expect(isValidCamPhone('67712345')).toBe(false)
  })

  it('rejects a number that is too long', () => {
    expect(isValidCamPhone('6771234567')).toBe(false)
  })

  it('rejects an empty string', () => {
    expect(isValidCamPhone('')).toBe(false)
  })

  it('rejects a number with letters', () => {
    expect(isValidCamPhone('67712345a')).toBe(false)
  })
})

// ─────────────────────────────────────────────
// truncate
// ─────────────────────────────────────────────
describe('truncate', () => {
  it('does not truncate a short string', () => {
    expect(truncate('Hello', 10)).toBe('Hello')
  })

  it('truncates a long string and adds ellipsis', () => {
    expect(truncate('Hello world', 5)).toBe('Hello...')
  })

  it('does not truncate a string that is exactly the max length', () => {
    expect(truncate('Hello', 5)).toBe('Hello')
  })

  it('handles an empty string', () => {
    expect(truncate('', 5)).toBe('')
  })
})

// ─────────────────────────────────────────────
// getConditionStyle
// ─────────────────────────────────────────────
describe('getConditionStyle', () => {
  it('returns green style for New condition', () => {
    const style = getConditionStyle('New')
    expect(style.bg).toBe('#E6F3EA')
    expect(style.color).toBe('#1B4332')
  })

  it('returns amber style for Used condition', () => {
    const style = getConditionStyle('Used')
    expect(style.bg).toBe('#FDF1DF')
    expect(style.color).toBe('#7A4400')
  })

  it('returns red style for Worn condition', () => {
    const style = getConditionStyle('Worn')
    expect(style.bg).toBe('#FBE6E1')
    expect(style.color).toBe('#7A1F12')
  })

  it('falls back to Used style for unknown condition', () => {
    const style = getConditionStyle('Unknown')
    expect(style.bg).toBe('#FDF1DF')
  })
})

// ─────────────────────────────────────────────
// shouldShowSubscribeBanner
// ─────────────────────────────────────────────
describe('shouldShowSubscribeBanner', () => {
  it('shows banner when logged in, not subscribed, and has listings', () => {
    expect(shouldShowSubscribeBanner(true, false, 2)).toBe(true)
  })

  it('hides banner when not logged in', () => {
    expect(shouldShowSubscribeBanner(false, false, 2)).toBe(false)
  })

  it('hides banner when already subscribed', () => {
    expect(shouldShowSubscribeBanner(true, true, 2)).toBe(false)
  })

  it('hides banner when logged in but has no listings yet', () => {
    expect(shouldShowSubscribeBanner(true, false, 0)).toBe(false)
  })

  it('hides banner when subscribed and has listings', () => {
    expect(shouldShowSubscribeBanner(true, true, 5)).toBe(false)
  })
})
