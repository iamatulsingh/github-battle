import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Trophy } from 'lucide-react'
import type { BattleResult } from '../utils/scoring'

interface BattleProps {
  playerOne: BattleResult
  playerTwo: BattleResult
  onBack: () => void
}

export function Battle({
  playerOne,
  playerTwo,
  onBack,
}: BattleProps) {
  const firstWins =
    playerOne.stats.total > playerTwo.stats.total

  const secondWins =
    playerTwo.stats.total > playerOne.stats.total

  const categories = [
    {
      key: 'stars' as const,
      label: 'STAR POWER',
      icon: '★',
    },
    {
      key: 'repositories' as const,
      label: 'OPEN SOURCE',
      icon: '▦',
    },
    {
      key: 'community' as const,
      label: 'COMMUNITY',
      icon: '◉',
    },
    {
      key: 'impact' as const,
      label: 'IMPACT',
      icon: '◆',
    },
    {
      key: 'activity' as const,
      label: 'ACTIVITY',
      icon: '⚡',
    },
    {
      key: 'longevity' as const,
      label: 'LONGEVITY',
      icon: '◷',
    },
  ]

  return (
    <main className="min-h-screen bg-[#08090c] px-5 py-6 text-[#f4f7fa]">
      <div className="mx-auto max-w-6xl">
        {/* Top */}
        <button
          onClick={onBack}
          className="mb-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#5e6673] transition hover:text-[#f4f7fa]"
        >
          <ArrowLeft size={14} />
          Back to Arena
        </button>

        {/* Header */}
        <div className="mb-14 text-center">
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#7cff6b]">
            Battle Complete
          </div>

          <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            FINAL
            <span className="text-[#7cff6b]">
              {' '}
              RESULTS
            </span>
          </h1>
        </div>

        {/* Fighters */}
        <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <Fighter
            result={playerOne}
            winner={firstWins}
            color="green"
          />

          <div className="hidden font-mono text-sm text-[#454b57] md:block">
            VS
          </div>

          <Fighter
            result={playerTwo}
            winner={secondWins}
            color="purple"
          />
        </div>

        {/* Category comparison */}
        <section className="mt-16">
          <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.25em] text-[#5e6673]">
            Battle Breakdown
          </div>

          <div className="border border-[#282d38] bg-[#0d0f13]">
            {categories.map((category, index) => {
              const first =
                playerOne.stats[category.key]

              const second =
                playerTwo.stats[category.key]

              const firstBetter = first > second
              const secondBetter = second > first

              return (
                <motion.div
                  key={category.key}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  className="grid grid-cols-[1fr_80px_1fr] items-center border-b border-[#1d2028] p-5 last:border-b-0"
                >
                  <div className="text-right">
                    <span
                      className={
                        firstBetter
                          ? 'font-mono text-lg text-[#7cff6b]'
                          : 'font-mono text-lg text-[#858b98]'
                      }
                    >
                      {first}
                    </span>
                  </div>

                  <div className="text-center">
                    <div className="font-mono text-[9px] text-[#454b57]">
                      {category.icon}
                    </div>

                    <div className="mt-1 font-mono text-[7px] uppercase tracking-[0.1em] text-[#5e6673]">
                      {category.label}
                    </div>
                  </div>

                  <div>
                    <span
                      className={
                        secondBetter
                          ? 'font-mono text-lg text-[#a78bfa]'
                          : 'font-mono text-lg text-[#858b98]'
                      }
                    >
                      {second}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Methodology */}
        <section className="mt-10 border border-[#282d38] bg-[#0d0f13] p-6">
          <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[#7cff6b]">
            Score Methodology
          </div>

          <p className="max-w-3xl text-xs leading-6 text-[#5e6673]">
            Scores are calculated from publicly available
            GitHub profile and repository data. Raw values
            are normalized so that extremely large numbers
            do not completely dominate the comparison.
            The result is a game-style comparison, not a
            measurement of developer skill or code quality.
          </p>
        </section>
      </div>
    </main>
  )
}

function Fighter({
  result,
  winner,
  color,
}: {
  result: BattleResult
  winner: boolean
  color: 'green' | 'purple'
}) {
  const accent =
    color === 'green'
      ? '#7cff6b'
      : '#a78bfa'

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      className="relative border border-[#282d38] bg-[#0d0f13] p-6"
      style={{
        boxShadow: winner
          ? `0 0 50px ${accent}12`
          : undefined,
      }}
    >
      {winner && (
        <div
          className="absolute right-4 top-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em]"
          style={{ color: accent }}
        >
          <Trophy size={13} />
          Winner
        </div>
      )}

      <div className="flex items-center gap-5">
        <img
          src={result.player.user.avatar_url}
          alt=""
          className="h-20 w-20 border border-[#282d38] object-cover"
        />

        <div className="min-w-0">
          <div className="truncate text-xl font-semibold">
            {result.player.user.name ||
              result.player.user.login}
          </div>

          <div className="mt-1 font-mono text-xs text-[#5e6673]">
            @{result.player.user.login}
          </div>

          <a
            href={result.player.user.html_url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[#454b57] hover:text-[#f4f7fa]"
          >
            GitHub
            <ExternalLink size={10} />
          </a>
        </div>
      </div>

      <div className="mt-8 border-t border-[#1d2028] pt-6">
        <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#5e6673]">
          Battle Score
        </div>

        <div
          className="mt-1 font-mono text-5xl"
          style={{
            color: accent,
          }}
        >
          {result.stats.total}
        </div>

        <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[#454b57]">
          / 100
        </div>
      </div>
    </motion.div>
  )
}
