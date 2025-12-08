export function cn(...inputs) {
  // Simple className utility without external dependencies
  return inputs.filter(Boolean).join(' ')
}

export function formatPrice(priceInCents) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(priceInCents / 100)
}
