import React from 'react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number
  className?: string
}

export function ArkaCrest({ size = 32, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3e3ba" />
          <stop offset="45%" stopColor="#c5a059" />
          <stop offset="100%" stopColor="#8d6e2e" />
        </linearGradient>
        <linearGradient id="emeraldDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a4d3a" />
          <stop offset="100%" stopColor="#0b241a" />
        </linearGradient>
      </defs>
      {/* Outer shield container */}
      <rect
        x="3"
        y="3"
        width="42"
        height="42"
        rx="12"
        fill="url(#emeraldDark)"
        stroke="url(#goldGradient)"
        strokeWidth="1.5"
      />
      {/* Intricate diamond lattice */}
      <path
        d="M24 7L38 21L24 35L10 21L24 7Z"
        stroke="url(#goldGradient)"
        strokeWidth="1"
        strokeOpacity="0.45"
      />
      {/* Central Royal Lotus Motif */}
      <path
        d="M24 13C25.5 17 28 19 31 20C28 21 26 23.5 24 28C22 23.5 20 21 17 20C20 19 22.5 17 24 13Z"
        fill="url(#goldGradient)"
      />
      {/* Inner Sacred Sun Disc */}
      <circle cx="24" cy="24" r="3.5" fill="#fbfaf8" stroke="url(#goldGradient)" strokeWidth="1" />
      {/* Base Pedestal Arch */}
      <path
        d="M16 38C19 36 21 35 24 35C27 35 29 36 32 38"
        stroke="url(#goldGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="40" r="1" fill="url(#goldGradient)" />
    </svg>
  )
}
