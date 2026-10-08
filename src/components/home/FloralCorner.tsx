/** Light floral corner art — matches concierge lead form reference. */
export function FloralCorner({ className, flip }: { className?: string; flip?: 'x' | 'y' | 'xy' }) {
  const scale =
    flip === 'xy' ? 'scale(-1,-1)' : flip === 'x' ? 'scale(-1,1)' : flip === 'y' ? 'scale(1,-1)' : undefined

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
      className={className}
      style={scale ? { transform: scale } : undefined}
    >
      <g stroke="#e8a4b8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
        <path d="M18 78 C28 68 38 72 42 82 C46 92 38 98 28 96 C18 94 12 86 18 78 Z" fill="#fce4ec" />
        <path d="M42 82 C52 74 62 78 64 88 C66 98 58 102 48 100" />
        <path d="M8 92 C14 84 22 86 26 94 C30 102 22 106 14 104" />
        <circle cx="32" cy="86" r="3" fill="#f8bbd0" stroke="none" />
        <path d="M24 62 Q32 54 40 60 Q34 68 24 62 Z" fill="#fff0f3" />
        <path d="M12 68 C18 60 26 62 28 70" />
        <path d="M50 96 C58 88 66 90 68 98" />
        <path d="M6 72 L10 64 M14 58 L20 52" />
      </g>
    </svg>
  )
}
