import { UserRound } from 'lucide-react'

interface BattleInputProps {
  value: string
  onChange: (value: string) => void
  player: string
  color: 'green' | 'purple'
}

export function BattleInput({
  value,
  onChange,
  player,
  color,
}: BattleInputProps) {
  const accent =
    color === 'green'
      ? 'focus-within:border-[#7cff6b]/60 focus-within:shadow-[0_0_30px_rgba(124,255,107,0.08)]'
      : 'focus-within:border-[#a78bfa]/60 focus-within:shadow-[0_0_30px_rgba(167,139,250,0.08)]'

  return (
    <div className="group">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#858b98]">
          {player}
        </span>

        <span className="font-mono text-[10px] text-[#454b57]">
          PLAYER
        </span>
      </div>

      <div
        className={`
          flex h-16 items-center gap-3
          border border-[#282d38]
          bg-[#101217]/80
          px-4
          transition-all duration-300
          ${accent}
        `}
      >
        <UserRound
          size={18}
          strokeWidth={1.5}
          className={
            color === 'green'
              ? 'text-[#7cff6b]'
              : 'text-[#a78bfa]'
          }
        />

        <span className="font-mono text-sm text-[#555c68]">@</span>

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="github-username"
          spellCheck={false}
          autoComplete="off"
          className="
            min-w-0 flex-1
            bg-transparent
            text-sm text-[#f4f7fa]
            outline-none
            placeholder:text-[#454b57]
          "
        />
      </div>
    </div>
  )
}
