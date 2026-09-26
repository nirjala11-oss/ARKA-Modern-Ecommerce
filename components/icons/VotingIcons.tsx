import React from 'react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number
  className?: string
}

export function CopFlameIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="flameOuter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="flameInner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      {/* Outer Flame */}
      <path
        d="M12 2C11.5 5 9.5 7.5 7.5 9.5C5.5 11.5 4 14 4 16.5C4 20.6 7.6 24 12 24C16.4 24 20 20.6 20 16.5C20 13.5 18 11 16.5 9C15.5 7.7 15 6 15 4C14 5.5 13 6.8 11.5 7.8C11.9 6.5 12.1 4.5 12 2Z"
        fill="url(#flameOuter)"
      />
      {/* Core Hot Spark */}
      <path
        d="M12 13C10.5 14.5 10 16 10 17.5C10 19.4 10.9 21 12 21C13.1 21 14 19.4 14 17.5C14 15.5 13 14 12 13Z"
        fill="url(#flameInner)"
      />
    </svg>
  )
}

export function DropShieldIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="shieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#be123c" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>
      </defs>
      {/* Outer Shield */}
      <path
        d="M12 2L4 5.5V11.5C4 16.8 7.4 21.6 12 23C16.6 21.6 20 16.8 20 11.5V5.5L12 2Z"
        fill="url(#shieldBg)"
        stroke="#fda4af"
        strokeWidth="1.2"
      />
      {/* Centered Demote Minus Bar */}
      <rect x="7" y="11" width="10" height="2.2" rx="1.1" fill="#ffffff" />
    </svg>
  )
}

export function VerifiedBadgeIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="badgeGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
      </defs>
      {/* 12-point Guilloché Rosette */}
      <path
        d="M12 2L14.3 4.4L17.5 3.9L18.7 6.9L21.7 8.2L21.3 11.5L23.4 14L21.4 16.5L21.7 19.8L18.7 21.1L17.5 24.1L14.3 23.6L12 26L9.7 23.6L6.5 24.1L5.3 21.1L2.3 19.8L2.6 16.5L0.6 14L2.7 11.5L2.3 8.2L5.3 6.9L6.5 3.9L9.7 4.4L12 2Z"
        fill="url(#badgeGold)"
        transform="scale(0.85) translate(2, 2)"
      />
      {/* Inner Emerald Disc */}
      <circle cx="12" cy="12" r="7.5" fill="#143e2e" stroke="#fef3c7" strokeWidth="0.8" />
      {/* Verified Checkmark */}
      <path
        d="M8.5 12L10.8 14.5L15.5 9.5"
        stroke="#c5a059"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
