import { motion } from 'framer-motion'
import { ShieldCheck, Zap } from 'lucide-react'
import { useState } from 'react'

import { BattleButton } from '../components/BattleButton'
import { BattleInput } from '../components/BattleInput'
import { PixelGrid } from '../components/PixelGrid'

interface HomeProps {
  onBattle: (
    playerOne: string,
    playerTwo: string,
  ) => void

  loading: boolean
  error: string
}

export function Home({
  onBattle,
  loading,
  error,
}: HomeProps) {

  const [playerOne, setPlayerOne] = useState('')
  const [playerTwo, setPlayerTwo] = useState('')

  const canBattle =
    playerOne.trim().length > 0 &&
    playerTwo.trim().length > 0

  const handleBattle = () => {
    if (!canBattle) return

    onBattle(
      playerOne.trim(),
      playerTwo.trim(),
    )
  }

  function GitHubMark({ size = 16 }: { size?: number }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.01c-3.2.7-3.87-1.54-3.87-1.54-.53-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18A10.9 10.9 0 0 1 12 6.08c.97 0 1.94.13 2.85.38 2.18-1.49 3.14-1.18 3.14-1.18.62 1.59.23 2.77.11 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.08.78 2.18v3.24c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>
    )
  }


  return (
    <main className="relative min-h-screen overflow-hidden">
      <PixelGrid />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 md:px-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center border border-[#282d38] bg-[#101217]">
              <GitHubMark size={16} />
            </div>

            <div>
              <div className="font-mono text-[11px] font-medium tracking-[0.2em]">
                GITHUB
              </div>

              <div className="font-mono text-[8px] tracking-[0.3em] text-[#454b57]">
                BATTLE ARENA
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-[#5e6673] sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse bg-[#7cff6b] shadow-[0_0_8px_#7cff6b]" />
            Public Data Only
          </div>
        </header>

        {/* Hero */}
        <section className="flex flex-1 flex-col justify-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto w-full max-w-4xl"
          >
            {/* Eyebrow */}
            <div className="mb-7 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-[#282d38]" />

              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#7cff6b]">
                Season 01 · Open Source
              </span>

              <div className="h-px w-8 bg-[#282d38]" />
            </div>

            {/* Heading */}
            <div className="text-center">
              <h1 className="text-5xl font-semibold tracking-[-0.05em] text-[#f4f7fa] sm:text-7xl md:text-8xl">
                GITHUB
                <br />

                <span className="text-[#7cff6b]">
                  BATTLE
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-[#858b98] md:text-base">
                Two developers enter.
                <br className="sm:hidden" />{' '}
                Public GitHub data decides the battle.
              </p>
            </div>

            {/* Battle panel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-14"
            >
              <div className="border border-[#282d38] bg-[#0d0f13]/90 p-5 shadow-2xl backdrop-blur-xl md:p-7">
                {/* Panel header */}
                <div className="mb-7 flex items-center justify-between border-b border-[#1d2028] pb-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#5e6673]">
                    Initialize Battle
                  </span>

                  <span className="font-mono text-[9px] text-[#454b57]">
                    SYS.001
                  </span>
                </div>

                {/* Inputs */}
                <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-end">
                  <BattleInput
                    player="Player One"
                    value={playerOne}
                    onChange={setPlayerOne}
                    color="green"
                  />

                  <div className="hidden pb-5 md:block">
                    <div className="flex h-10 w-10 items-center justify-center border border-[#282d38] bg-[#101217] font-mono text-xs text-[#5e6673]">
                      VS
                    </div>
                  </div>

                  <BattleInput
                    player="Player Two"
                    value={playerTwo}
                    onChange={setPlayerTwo}
                    color="purple"
                  />
                </div>

                {error && (
                  <div className="mb-5 border border-[#ff5c7a]/30 bg-[#ff5c7a]/5 px-4 py-3">
                    <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#ff5c7a]">
                      Battle Error
                    </div>

                    <div className="mt-1 text-xs text-[#858b98]">
                      {error}
                    </div>
                  </div>
                )}

                {/* Battle button */}
                <div className="mt-7">
                  <BattleButton
                    disabled={!canBattle || loading}
                    loading={loading}
                    onClick={handleBattle}
                  />
                </div>

                {/* Footer */}
                <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2 font-mono text-[9px] text-[#5e6673]">
                    <ShieldCheck size={12} />
                    NO LOGIN
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[9px] text-[#5e6673]">
                    <Zap size={12} />
                    NO API KEY
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[9px] text-[#5e6673]">
                    <GitHubMark size={12} />
                    PUBLIC DATA
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bottom stats */}
            <div className="mt-8 grid grid-cols-3 divide-x divide-[#282d38] border-y border-[#1d2028] py-5">
              <Stat
                value="01"
                label="Battle Mode"
              />

              <Stat
                value="07"
                label="Score Metrics"
              />

              <Stat
                value="∞"
                label="Matchups"
              />
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="flex items-center justify-between border-t border-[#181b21] py-5">
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#454b57]">
            GitHub Battle
          </span>

          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#454b57]">
            Built for Open Source
          </span>
        </footer>
      </div>
    </main>
  )
}

function Stat({
  value,
  label,
}: {
  value: string
  label: string
}) {
  return (
    <div className="text-center">
      <div className="font-mono text-lg text-[#f4f7fa]">
        {value}
      </div>

      <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.15em] text-[#454b57]">
        {label}
      </div>
    </div>
  )
}
