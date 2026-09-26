import React from 'react'

export function UpiIcon({ className = 'h-5 w-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="48" height="24" rx="4" fill="#097939" />
      <path d="M14 6L20 18H16L13.5 12.5H10.5L9 18H5L11 6H14Z" fill="white" />
      <path d="M22 6H26V14C26 16.2 27.8 18 30 18C32.2 18 34 16.2 34 14V6H38V14C38 18.4 34.4 22 30 22C25.6 22 22 18.4 22 14V6Z" fill="#F47920" />
      <circle cx="42" cy="12" r="2.5" fill="white" />
    </svg>
  )
}

export function RuPayIcon({ className = 'h-5 w-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="48" height="24" rx="4" fill="#092040" />
      <path d="M12 6H19C21.8 6 23.5 7.4 23.5 9.7C23.5 12 21.8 13.4 19 13.4H15.5V18H12V6ZM15.5 11H18.5C20 11 20.8 10.5 20.8 9.7C20.8 8.9 20 8.4 18.5 8.4H15.5V11Z" fill="#F47920" />
      <path d="M26 10H29.5V18H26V10ZM26 6H29.5V8.5H26V6Z" fill="#00A0E3" />
      <path d="M32 6L37 18H33.5L32.2 14.5H29.8L31 12H33.5L34.5 9.5H32V6Z" fill="#097939" />
    </svg>
  )
}

export function ApplePayIcon({ className = 'h-5 w-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="48" height="24" rx="4" fill="#000000" />
      <path d="M13.2 11.2C13.2 9.8 14.1 8.9 14.2 8.8C13.4 7.6 12.1 7.4 11.7 7.4C10.6 7.3 9.6 8 9.1 8C8.5 8 7.7 7.4 6.8 7.4C5.6 7.4 4.5 8.1 3.9 9.1C2.7 11.3 3.6 14.6 4.7 16.3C5.3 17.1 6 18 6.9 18C7.8 18 8.1 17.4 9.2 17.4C10.2 17.4 10.6 18 11.5 18C12.4 18 13 17.2 13.5 16.4C14.2 15.4 14.4 14.5 14.5 14.4C14.4 14.3 13.2 13.8 13.2 11.2Z" fill="white" />
      <path d="M12.1 6.3C12.6 5.7 12.9 4.8 12.8 4C12 4 11.1 4.5 10.6 5.2C10.1 5.7 9.8 6.6 9.9 7.4C10.8 7.5 11.7 6.9 12.1 6.3Z" fill="white" />
      <text x="18" y="16" fill="white" fontSize="11" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600">Pay</text>
    </svg>
  )
}
