// FILE: src/lib/utils.ts

/**
 * Formats a price number into a XAF currency string
 * e.g. 25000 → "25,000 XAF"
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString()} XAF`
}

/**
 * Builds a WhatsApp URL for contacting a seller
 * e.g. ("677123456", "Standing fan") → "https://wa.me/237677123456?text=..."
 */
export function buildWhatsAppUrl(phone: string, itemTitle: string): string {
  const message = encodeURIComponent(
    `Hi, I saw your listing for ${itemTitle} on UniSell. Is it still available?`
  )
  return `https://wa.me/237${phone}?text=${message}`
}

/**
 * Validates a Cameroonian phone number
 * Must start with 6 and be exactly 9 digits
 */
export function isValidCamPhone(phone: string): boolean {
  return /^6\d{8}$/.test(phone)
}

/**
 * Truncates a string to a max length with ellipsis
 * e.g. ("Hello world", 5) → "Hello..."
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

/**
 * Returns a condition color config for badges
 */
export function getConditionStyle(condition: string): {
  bg: string
  color: string
  dot: string
} {
  const styles: Record<string, { bg: string; color: string; dot: string }> = {
    New:  { bg: '#E6F3EA', color: '#1B4332', dot: '#2D6A4F' },
    Used: { bg: '#FDF1DF', color: '#7A4400', dot: '#D97706' },
    Worn: { bg: '#FBE6E1', color: '#7A1F12', dot: '#B83A2C' },
  }
  return styles[condition] || styles.Used
}

/**
 * Returns true if a listing should show the subscribe banner
 */
export function shouldShowSubscribeBanner(
  isLoggedIn: boolean,
  isSubscribed: boolean,
  listingCount: number
): boolean {
  return isLoggedIn && !isSubscribed && listingCount > 0
}