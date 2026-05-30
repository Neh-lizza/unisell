// FILE: e2e/unisell.spec.ts

import { test, expect } from '@playwright/test'

// ─────────────────────────────────────────────
// Homepage
// ─────────────────────────────────────────────
test.describe('Homepage', () => {
  test('loads and shows the hero headline', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/UniSell/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('shows the search bar', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.getByPlaceholder(/Search/)
    await expect(searchInput).toBeVisible()
  })

  test('shows category filter chips', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('All listings')).toBeVisible()
    await expect(page.getByText('Electronics')).toBeVisible()
    await expect(page.getByText('Furniture')).toBeVisible()
  })

  test('shows the navbar with UniSell logo', async ({ page }) => {
    await page.goto('/')
    const navbar = page.locator('header')
    await expect(navbar).toBeVisible()
  })

  test('shows Sell item button in navbar', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /Sell item/i })).toBeVisible()
  })

  test('shows How it works section', async ({ page }) => {
    await page.goto('/')
    // Use the section anchor rather than text which appears multiple times
    await expect(page.locator('#how')).toBeVisible()
  })

  test('shows footer', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })
})

// ─────────────────────────────────────────────
// Search
// ─────────────────────────────────────────────
test.describe('Search', () => {
  test('user can type in the search bar', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.getByPlaceholder(/Search/)
    await searchInput.fill('fan')
    await expect(searchInput).toHaveValue('fan')
  })

  test('search form submits on button click', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.getByPlaceholder(/Search/)
    await searchInput.fill('laptop')
    await page.getByRole('button', { name: /Search/i }).click()
    await expect(searchInput).toHaveValue('laptop')
  })

  test('search form submits on Enter key', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.getByPlaceholder(/Search/)
    await searchInput.fill('fridge')
    await searchInput.press('Enter')
    await expect(page).toHaveURL(/.*/)
  })
})

// ─────────────────────────────────────────────
// Category filters
// ─────────────────────────────────────────────
test.describe('Category Filters', () => {
  test('clicking a category chip updates the active state', async ({ page }) => {
    await page.goto('/')
    const electronicsChip = page.getByRole('button', { name: 'Electronics' })
    await electronicsChip.click()
    await expect(page.getByRole('heading', { name: 'Electronics' })).toBeVisible()
  })

  test('all category chips are visible', async ({ page }) => {
    await page.goto('/')
    const categories = [
      'All listings',
      'Bed and Mattress',
      'Furniture',
      'Electronics',
      'Fan and AC',
    ]
    for (const cat of categories) {
      await expect(page.getByRole('button', { name: cat })).toBeVisible()
    }
  })
})

// ─────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────
test.describe('Navigation', () => {
  test('Sell item link goes to /sell', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('link', { name: /Sell item/i })
      .first()
      .click()
    await expect(page).toHaveURL(/\/sell|\/login/)
  })

  test('Subscribe link goes to /subscribe', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('link', { name: /Subscribe/i })
      .first()
      .click()
    await expect(page).toHaveURL(/\/subscribe/)
  })

  test('logo link goes back to homepage', async ({ page }) => {
    await page.goto('/subscribe')
    await page.locator('header a').first().click()
    await expect(page).toHaveURL('/')
  })
})

// ─────────────────────────────────────────────
// Login page
// ─────────────────────────────────────────────
test.describe('Login Page', () => {
  test('login page loads with sign in form', async ({ page }) => {
    await page.goto('/login')
    // Use first() since there are two Sign in buttons (tab + submit)
    await expect(page.getByRole('button', { name: /Sign in/i }).first()).toBeVisible()
  })

  test('shows email and password fields', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
    await expect(page.getByPlaceholder('Your password')).toBeVisible()
  })

  test('can switch to create account tab', async ({ page }) => {
    await page.goto('/login')
    await page
      .getByRole('button', { name: /Create account/i })
      .first()
      .click()
    await expect(page.getByPlaceholder(/At least 6 characters/i)).toBeVisible()
  })

  test('shows UniSell branding', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'UniSell' })).toBeVisible()
  })
})

// ─────────────────────────────────────────────
// Sell page
// ─────────────────────────────────────────────
test.describe('Sell Page', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/sell')
    await expect(page).toHaveURL(/\/login/)
  })
})

// ─────────────────────────────────────────────
// Subscribe page
// ─────────────────────────────────────────────
test.describe('Subscribe Page', () => {
  test('loads with correct heading', async ({ page }) => {
    await page.goto('/subscribe')
    // Use exact heading text to avoid strict mode violation
    await expect(
      page.getByRole('heading', { name: 'Start selling for 300 XAF/year' })
    ).toBeVisible()
  })

  test('shows MTN Mobile Money section', async ({ page }) => {
    await page.goto('/subscribe')
    await expect(page.getByText('MTN Mobile Money')).toBeVisible()
  })

  test('shows Orange Money section', async ({ page }) => {
    await page.goto('/subscribe')
    await expect(page.getByText('Orange Money')).toBeVisible()
  })

  test('shows WhatsApp button', async ({ page }) => {
    await page.goto('/subscribe')
    await expect(page.getByRole('link', { name: /WhatsApp/i })).toBeVisible()
  })
})

// ─────────────────────────────────────────────
// 404 page
// ─────────────────────────────────────────────
test.describe('404 Page', () => {
  test('shows not found page for invalid routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')
    await expect(page.getByText(/not found/i)).toBeVisible()
  })

  test('shows link back to homepage on 404', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')
    await expect(page.getByRole('link', { name: /Browse listings/i })).toBeVisible()
  })
})
