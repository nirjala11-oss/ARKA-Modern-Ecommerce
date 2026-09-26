/**
 * Formats a number into Indian Rupee format (e.g. ₹29,999, ₹1,49,999)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Calculates 3-month or 6-month No-Cost EMI
 */
export function calculateEMI(price: number, months: number = 6): number {
  return Math.round(price / months)
}
