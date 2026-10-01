import { Swords } from 'lucide-react'

interface BattleButtonProps {
  disabled?: boolean
  loading?: boolean
  onClick: () => void
}

export function BattleButton({
  disabled,
  loading,
  onClick,
}: BattleButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="
        group relative
        flex h-14 w-full
        items-center justify-center gap-3
        overflow-hidden
        border border-[#7cff6b]
        bg-[#7cff6b]
        px-8
        font-mono text-xs font-medium
        uppercase tracking-[0.18em]
        text-[#08090c]
        transition-all duration-300
        hover:shadow-[0_0_40px_rgba(124,255,107,0.2)]
        disabled:cursor-not-allowed
        disabled:border-[#282d38]
        disabled:bg-[#181b21]
        disabled:text-[#454b57]
      "
    >
      <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />

      <Swords
        size={18}
        className={loading ? 'animate-pulse' : ''}
        />

        <span>
        {loading
            ? 'Analyzing Profiles...'
            : disabled
            ? 'ENTER TWO PLAYERS'
            : 'Start Battle'}
        </span>

        {!loading && (
        <span className="font-mono text-[9px] opacity-50">
            ↵
        </span>
    )}
    </button>
  )
}
