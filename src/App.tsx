import { useState } from 'react'
import { Loader2, Swords, ExternalLink } from 'lucide-react'

interface GithubUser {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  bio: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

interface GithubRepo {
  id: number
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  fork: boolean
}

interface Player {
  user: GithubUser
  repos: GithubRepo[]
  stars: number
  forks: number
  originalRepos: number
  score: number
}

function App() {
  const [playerOne, setPlayerOne] = useState('')
  const [playerTwo, setPlayerTwo] = useState('')
  const [loading, setLoading] = useState(false)

  const [result, setResult] = useState<{
    one: Player
    two: Player
  } | null>(null)

  const [error, setError] = useState('')

  async function getPlayer(
    username: string,
  ): Promise<Player> {
    const cleanUsername = username.trim()

    const userResponse = await fetch(
      `https://api.github.com/users/${encodeURIComponent(
        cleanUsername,
      )}`,
    )

    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        throw new Error(
          `"${cleanUsername}" was not found on GitHub.`,
        )
      }

      if (userResponse.status === 403) {
        throw new Error(
          'GitHub API rate limit reached. Please try again later.',
        )
      }

      throw new Error(
        `GitHub returned an error (${userResponse.status}).`,
      )
    }

    const user: GithubUser =
      await userResponse.json()

    const repoResponse = await fetch(
      `https://api.github.com/users/${encodeURIComponent(
        cleanUsername,
      )}/repos?per_page=100&sort=stars`,
    )

    if (!repoResponse.ok) {
      throw new Error(
        `Could not load repositories for ${cleanUsername}.`,
      )
    }

    const repos: GithubRepo[] =
      await repoResponse.json()

    const stars = repos.reduce(
      (total, repo) =>
        total + repo.stargazers_count,
      0,
    )

    const forks = repos.reduce(
      (total, repo) =>
        total + repo.forks_count,
      0,
    )

    const originalRepos = repos.filter(
      (repo) => !repo.fork,
    ).length

    /*
     * Battle scoring.
     *
     * Each category contributes a maximum
     * amount to the final 100 point score.
     *
     * Logarithmic scaling prevents someone with
     * 100,000 followers from completely destroying
     * someone with 5,000 followers.
     */

    const starScore = Math.min(
      35,
      Math.log10(stars + 1) * 9,
    )

    const followerScore = Math.min(
      25,
      Math.log10(user.followers + 1) * 6,
    )

    const repoScore = Math.min(
      15,
      Math.log10(user.public_repos + 1) * 6,
    )

    const forkScore = Math.min(
      10,
      Math.log10(forks + 1) * 3,
    )

    const originalRepoScore = Math.min(
      10,
      originalRepos / 10,
    )

    const accountAge = getAccountAge(
      user.created_at,
    )

    const ageScore = Math.min(
      5,
      accountAge / 2,
    )

    const score = Math.min(
      100,
      Math.round(
        starScore +
          followerScore +
          repoScore +
          forkScore +
          originalRepoScore +
          ageScore,
      ),
    )

    return {
      user,
      repos,
      stars,
      forks,
      originalRepos,
      score,
    }
  }

  async function startBattle() {
    if (!playerOne.trim() || !playerTwo.trim()) {
      setError(
        'Enter both GitHub usernames to start the battle.',
      )
      return
    }

    if (
      playerOne.trim().toLowerCase() ===
      playerTwo.trim().toLowerCase()
    ) {
      setError(
        'A battle needs two different GitHub users.',
      )
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const [one, two] = await Promise.all([
        getPlayer(playerOne),
        getPlayer(playerTwo),
      ])

      setResult({ one, two })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while starting the battle.',
      )
    } finally {
      setLoading(false)
    }
  }

  /*
   * RESULT SCREEN
   */
  if (result) {
    return (
      <BattleResult
        one={result.one}
        two={result.two}
        onBack={() => setResult(null)}
      />
    )
  }

  /*
   * HOME SCREEN
   */
  return (
    <main className="min-h-screen bg-[#08090c] text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center px-6">
        <div className="w-full">

          <div className="mb-14 text-center">
            <div className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-[#7cff6b]">
              Season 01 · Open Source
            </div>

            <h1 className="text-6xl font-bold tracking-[-0.06em] sm:text-8xl">
              GITHUB
              <br />

              <span className="text-[#7cff6b]">
                BATTLE
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-[#858b98]">
              Enter two GitHub usernames and let
              their public profiles enter the arena.
            </p>
          </div>

          <div className="border border-[#282d38] bg-[#0d0f13] p-6 md:p-8">

            <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-end">

              <UsernameInput
                label="PLAYER ONE"
                value={playerOne}
                onChange={setPlayerOne}
                color="#7cff6b"
              />

              <div className="hidden h-14 w-14 items-center justify-center border border-[#282d38] font-mono text-xs text-[#5e6673] md:flex">
                VS
              </div>

              <UsernameInput
                label="PLAYER TWO"
                value={playerTwo}
                onChange={setPlayerTwo}
                color="#a78bfa"
              />

            </div>

            {error && (
              <div className="mt-5 border border-[#ff5c7a]/30 bg-[#ff5c7a]/5 p-4 font-mono text-xs text-[#ff5c7a]">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={startBattle}
              disabled={loading}
              className="
                mt-7 flex h-14 w-full
                items-center justify-center gap-3
                border border-[#7cff6b]
                bg-[#7cff6b]
                font-mono text-xs font-medium
                uppercase tracking-[0.18em]
                text-[#08090c]
                transition
                hover:shadow-[0_0_40px_rgba(124,255,107,0.2)]
                disabled:cursor-wait
                disabled:border-[#282d38]
                disabled:bg-[#181b21]
                disabled:text-[#5e6673]
              "
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  ANALYZING PROFILES...
                </>
              ) : (
                <>
                  <Swords size={18} />
                  START BATTLE
                </>
              )}
            </button>

            <div className="mt-5 text-center font-mono text-[9px] tracking-[0.15em] text-[#454b57]">
              NO LOGIN · NO API KEY · PUBLIC DATA
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

/* =====================================================
   BATTLE RESULT
===================================================== */

function BattleResult({
  one,
  two,
  onBack,
}: {
  one: Player
  two: Player
  onBack: () => void
}) {
  const firstWins = one.score > two.score
  const secondWins = two.score > one.score
  const draw = one.score === two.score

  const oneTopRepo = getTopRepo(one.repos)
  const twoTopRepo = getTopRepo(two.repos)

  return (
    <main className="min-h-screen bg-[#07080b] text-white">

      {/* Subtle background grid */}
      <div
        className="
          pointer-events-none fixed inset-0 opacity-[0.035]
          [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]
          [background-size:32px_32px]
        "
      />

      <div className="relative mx-auto max-w-7xl px-5 py-6 sm:px-8">

        {/* Top bar */}
        <header className="flex items-center justify-between">

          <button
            type="button"
            onClick={onBack}
            className="
              group flex items-center gap-2
              font-mono text-[9px]
              uppercase tracking-[0.2em]
              text-[#5e6673]
              transition hover:text-white
            "
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>

            New Battle
          </button>

          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#454b57]">
            Battle Report · Public Data
          </div>

        </header>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="pb-14 pt-16">

          <div className="mb-5 text-center font-mono text-[9px] uppercase tracking-[0.35em] text-[#7cff6b]">
            Match Complete
          </div>

          <h1 className="text-center text-5xl font-semibold tracking-[-0.06em] sm:text-7xl">
            BATTLE
            <span className="text-[#7cff6b]">
              {' '}REPORT
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-center text-xs leading-6 text-[#5e6673]">
            Every number below comes from publicly
            available GitHub profile and repository
            data.
          </p>

        </section>

        {/* =================================================
            RESULT TAG
        ================================================= */}

        <div className="mb-5 flex justify-center">

          <div
            className={`
              flex items-center gap-3
              border px-5 py-2.5
              font-mono text-[9px]
              uppercase tracking-[0.25em]
              ${
                draw
                  ? 'border-[#ffd166]/30 bg-[#ffd166]/5 text-[#ffd166]'
                  : 'border-[#7cff6b]/30 bg-[#7cff6b]/5 text-[#7cff6b]'
              }
            `}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />

            {draw
              ? 'DRAW · PERFECT TIE'
              : firstWins
                ? `@${one.user.login} WINS`
                : `@${two.user.login} WINS`}
          </div>

        </div>

        {/* =================================================
            FIGHTERS
        ================================================= */}

        <section className="grid gap-5 lg:grid-cols-[1fr_70px_1fr] lg:items-center">

          <FighterCard
            player={one}
            color="#7cff6b"
            winner={firstWins}
          />

          <div className="hidden lg:flex justify-center">

            <div className="relative flex h-14 w-14 items-center justify-center border border-[#282d38] bg-[#0d0f13]">

              <div className="absolute inset-1 border border-[#1d2028]" />

              <span className="relative font-mono text-[10px] text-[#858b98]">
                VS
              </span>

            </div>

          </div>

          <FighterCard
            player={two}
            color="#a78bfa"
            winner={secondWins}
          />

        </section>

        {/* =================================================
            SCORE BREAKDOWN
        ================================================= */}

        <section className="mt-16">

          <SectionTitle
            number="01"
            title="Battle Breakdown"
            description="A category-by-category comparison of both fighters."
          />

          <div className="mt-6 border border-[#282d38] bg-[#0c0e12]">

            <div className="hidden grid-cols-[1fr_180px_1fr] border-b border-[#1d2028] px-6 py-4 md:grid">

              <div className="font-mono text-[9px] text-[#7cff6b]">
                @{one.user.login}
              </div>

              <div className="text-center font-mono text-[8px] uppercase tracking-[0.15em] text-[#454b57]">
                METRIC
              </div>

              <div className="text-right font-mono text-[9px] text-[#a78bfa]">
                @{two.user.login}
              </div>

            </div>

            <ComparisonRow
              label="Stars"
              icon="★"
              one={one.stars}
              two={two.stars}
              colorOne="#7cff6b"
              colorTwo="#a78bfa"
            />

            <ComparisonRow
              label="Followers"
              icon="●"
              one={one.user.followers}
              two={two.user.followers}
              colorOne="#7cff6b"
              colorTwo="#a78bfa"
            />

            <ComparisonRow
              label="Repositories"
              icon="▦"
              one={one.user.public_repos}
              two={two.user.public_repos}
              colorOne="#7cff6b"
              colorTwo="#a78bfa"
            />

            <ComparisonRow
              label="Original Repos"
              icon="◇"
              one={one.originalRepos}
              two={two.originalRepos}
              colorOne="#7cff6b"
              colorTwo="#a78bfa"
            />

            <ComparisonRow
              label="Forks"
              icon="⑂"
              one={one.forks}
              two={two.forks}
              colorOne="#7cff6b"
              colorTwo="#a78bfa"
            />

          </div>

        </section>

        {/* =================================================
            REPOSITORY MVP
        ================================================= */}

        <section className="mt-16">

          <SectionTitle
            number="02"
            title="Repository MVP"
            description="Each fighter's most-starred public repository."
          />

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <RepositoryCard
              repo={oneTopRepo}
              username={one.user.login}
              color="#7cff6b"
            />

            <RepositoryCard
              repo={twoTopRepo}
              username={two.user.login}
              color="#a78bfa"
            />

          </div>

        </section>

        {/* =================================================
            PROFILE INTELLIGENCE
        ================================================= */}

        <section className="mt-16">

          <SectionTitle
            number="03"
            title="Profile Intelligence"
            description="Additional public signals from each GitHub profile."
          />

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <ProfileIntel
              player={one}
              color="#7cff6b"
            />

            <ProfileIntel
              player={two}
              color="#a78bfa"
            />

          </div>

        </section>

        {/* =================================================
            FINAL RESULT
        ================================================= */}

        <section className="mt-16 pb-20">

          <div className="relative overflow-hidden border border-[#282d38] bg-[#0d0f13] p-8 sm:p-12">

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,255,107,0.06),transparent_65%)]" />

            <div className="relative">

              <div className="text-center">

                <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#5e6673]">
                  Final Score
                </div>

                <div className="mt-8 flex items-center justify-center gap-8 sm:gap-16">

                  <FinalScore
                    username={one.user.login}
                    score={one.score}
                    color="#7cff6b"
                  />

                  <div className="font-mono text-sm text-[#454b57]">
                    VS
                  </div>

                  <FinalScore
                    username={two.user.login}
                    score={two.score}
                    color="#a78bfa"
                  />

                </div>

                <div className="mt-10">

                  <div className="inline-flex border border-[#282d38] bg-[#101217] px-6 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[#858b98]">

                    {draw
                      ? 'Perfect Tie'
                      : firstWins
                        ? `@${one.user.login} takes the battle`
                        : `@${two.user.login} takes the battle`}

                  </div>

                </div>

                <button
                  type="button"
                  onClick={onBack}
                  className="
                    mt-8
                    border border-[#7cff6b]
                    bg-[#7cff6b]
                    px-8 py-4
                    font-mono text-[9px]
                    uppercase tracking-[0.2em]
                    text-[#08090c]
                    transition
                    hover:shadow-[0_0_35px_rgba(124,255,107,0.2)]
                  "
                >
                  ⚔ REMATCH
                </button>

              </div>

            </div>

          </div>

        </section>

      </div>
    </main>
  )
}

/* =====================================================
   USERNAME INPUT
===================================================== */

function UsernameInput({
  label,
  value,
  onChange,
  color,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  color: string
}) {
  return (
    <div>

      <div className="mb-3 font-mono text-[9px] tracking-[0.2em] text-[#5e6673]">
        {label}
      </div>

      <div
        className="flex h-14 items-center border border-[#282d38] bg-[#101217] px-4 focus-within:border-white/30"
        style={{
          boxShadow: `inset 3px 0 ${color}`,
        }}
      >

        <span
          className="mr-2 font-mono text-sm"
          style={{ color }}
        >
          @
        </span>

        <input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder="github-username"
          className="w-full bg-transparent font-mono text-sm outline-none placeholder:text-[#454b57]"
        />

      </div>

    </div>
  )
}

/* =====================================================
   FIGHTER CARD
===================================================== */

function FighterCard({
  player,
  color,
  winner,
}: {
  player: Player
  color: string
  winner: boolean
}) {
  return (
    <div
      className="overflow-hidden border border-[#282d38] bg-[#0d0f13]"
      style={{
        boxShadow: winner
          ? `0 0 70px ${color}12`
          : undefined,
      }}
    >

      <div
        className="h-0.5"
        style={{
          backgroundColor: color,
        }}
      />

      <div className="p-6 sm:p-8">

        {/* Profile */}
        <div className="flex items-center gap-5">

          <img
            src={player.user.avatar_url}
            alt={player.user.login}
            className="h-24 w-24 border border-[#282d38] object-cover sm:h-28 sm:w-28"
          />

          <div className="min-w-0">

            <h2 className="truncate text-xl font-semibold sm:text-2xl">
              {player.user.name ||
                player.user.login}
            </h2>

            <div
              className="mt-1 font-mono text-xs"
              style={{ color }}
            >
              @{player.user.login}
            </div>

            {player.user.bio && (
              <p className="mt-3 line-clamp-2 text-[10px] leading-5 text-[#5e6673]">
                {player.user.bio}
              </p>
            )}

          </div>

        </div>

        {/* Score */}
        <div className="mt-8 border-y border-[#1d2028] py-6">

          <div className="flex items-end justify-between">

            <div>

              <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#5e6673]">
                Battle Score
              </div>

              <div
                className="mt-1 font-mono text-6xl tracking-[-0.06em]"
                style={{ color }}
              >
                {player.score}
              </div>

            </div>

            <span className="pb-2 font-mono text-[8px] text-[#454b57]">
              / 100
            </span>

          </div>

          <div className="mt-5 h-1 bg-[#181b21]">

            <div
              className="h-full"
              style={{
                width: `${player.score}%`,
                backgroundColor: color,
              }}
            />

          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-2">

          <CardStat
            label="Stars"
            value={player.stars}
          />

          <CardStat
            label="Repositories"
            value={player.user.public_repos}
            border
          />

          <CardStat
            label="Followers"
            value={player.user.followers}
            borderTop
          />

          <CardStat
            label="Following"
            value={player.user.following}
            border
            borderTop
          />

          <CardStat
            label="Forks"
            value={player.forks}
            borderTop
          />

          <CardStat
            label="Original"
            value={player.originalRepos}
            border
            borderTop
          />

        </div>

      </div>

    </div>
  )
}

/* =====================================================
   CARD STAT
===================================================== */

function CardStat({
  label,
  value,
  border,
  borderTop,
}: {
  label: string
  value: number | string
  border?: boolean
  borderTop?: boolean
}) {
  return (
    <div
      className={`
        px-4 py-4
        ${border ? 'border-l border-[#1d2028]' : ''}
        ${borderTop ? 'border-t border-[#1d2028]' : ''}
      `}
    >

      <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#454b57]">
        {label}
      </div>

      <div className="mt-1 font-mono text-sm text-[#cbd0d8]">
        {typeof value === 'number'
          ? value.toLocaleString()
          : value}
      </div>

    </div>
  )
}

/* =====================================================
   COMPARISON
===================================================== */

function ComparisonRow({
  label,
  icon,
  one,
  two,
  colorOne,
  colorTwo,
}: {
  label: string
  icon: string
  one: number
  two: number
  colorOne: string
  colorTwo: string
}) {
  const total = one + two

  const oneWidth =
    total === 0
      ? 50
      : (one / total) * 100

  const twoWidth =
    total === 0
      ? 50
      : (two / total) * 100

  const oneWins = one > two
  const twoWins = two > one

  return (
    <div className="border-b border-[#1d2028] p-5 last:border-b-0 sm:p-6">

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">

        <div className="text-right">

          <span
            className={`font-mono text-lg ${
              oneWins
                ? 'text-[#7cff6b]'
                : 'text-[#858b98]'
            }`}
          >
            {one.toLocaleString()}
          </span>

        </div>

        <div className="flex min-w-[100px] flex-col items-center">

          <span className="font-mono text-xs text-[#454b57]">
            {icon}
          </span>

          <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-[#5e6673]">
            {label}
          </span>

        </div>

        <div>

          <span
            className={`font-mono text-lg ${
              twoWins
                ? 'text-[#a78bfa]'
                : 'text-[#858b98]'
            }`}
          >
            {two.toLocaleString()}
          </span>

        </div>

      </div>

      <div className="mt-4 grid grid-cols-2 gap-1">

        <div className="h-1 bg-[#181b21]">

          <div
            className="ml-auto h-full"
            style={{
              width: `${oneWidth}%`,
              backgroundColor: colorOne,
              opacity: oneWins ? 1 : 0.3,
            }}
          />

        </div>

        <div className="h-1 bg-[#181b21]">

          <div
            className="h-full"
            style={{
              width: `${twoWidth}%`,
              backgroundColor: colorTwo,
              opacity: twoWins ? 1 : 0.3,
            }}
          />

        </div>

      </div>

    </div>
  )
}

/* =====================================================
   REPOSITORY CARD
===================================================== */

function RepositoryCard({
  repo,
  username,
  color,
}: {
  repo?: GithubRepo
  username: string
  color: string
}) {
  if (!repo) {
    return (
      <div className="border border-[#282d38] bg-[#0d0f13] p-6">

        <div
          className="font-mono text-[9px]"
          style={{ color }}
        >
          @{username}
        </div>

        <div className="mt-5 text-xs text-[#5e6673]">
          No public repositories found.
        </div>

      </div>
    )
  }

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="group block border border-[#282d38] bg-[#0d0f13] p-6 transition hover:border-[#454b57]"
    >

      <div className="flex items-start justify-between">

        <div className="min-w-0">

          <div
            className="font-mono text-[8px] uppercase tracking-[0.15em]"
            style={{ color }}
          >
            @{username} · TOP REPOSITORY
          </div>

          <div className="mt-3 truncate text-lg font-medium">
            {repo.name}
          </div>

        </div>

        <ExternalLink
          size={14}
          className="ml-4 shrink-0 text-[#454b57] transition group-hover:text-white"
        />

      </div>

      {repo.description && (
        <p className="mt-4 line-clamp-2 text-[10px] leading-5 text-[#5e6673]">
          {repo.description}
        </p>
      )}

      <div className="mt-7 grid grid-cols-3 border-t border-[#1d2028] pt-5">

        <RepositoryStat
          label="Stars"
          value={repo.stargazers_count}
        />

        <RepositoryStat
          label="Forks"
          value={repo.forks_count}
        />

        <RepositoryStat
          label="Language"
          value={repo.language || '—'}
        />

      </div>

    </a>
  )
}

function RepositoryStat({
  label,
  value,
}: {
  label: string
  value: number | string
}) {
  return (
    <div>

      <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#454b57]">
        {label}
      </div>

      <div className="mt-2 truncate pr-3 font-mono text-xs text-[#cbd0d8]">
        {typeof value === 'number'
          ? value.toLocaleString()
          : value}
      </div>

    </div>
  )
}

/* =====================================================
   PROFILE INTELLIGENCE
===================================================== */

function ProfileIntel({
  player,
  color,
}: {
  player: Player
  color: string
}) {
  const accountAge = getAccountAge(
    player.user.created_at,
  )

  const languages = getLanguages(
    player.repos,
  )

  return (
    <div className="border border-[#282d38] bg-[#0d0f13] p-6">

      <div className="flex items-center justify-between border-b border-[#1d2028] pb-4">

        <div
          className="font-mono text-[9px] tracking-[0.2em]"
          style={{ color }}
        >
          @{player.user.login}
        </div>

        <div className="font-mono text-[8px] text-[#454b57]">
          PROFILE INTEL
        </div>

      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4">

        <IntelStat
          label="Account Age"
          value={`${accountAge} yr`}
        />

        <IntelStat
          label="Original Repos"
          value={player.originalRepos}
        />

        <IntelStat
          label="Stars"
          value={player.stars}
        />

        <IntelStat
          label="Forks"
          value={player.forks}
        />

      </div>

      <div className="mt-5 border-t border-[#1d2028] pt-5">

        <div className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#454b57]">
          Language Fingerprint
        </div>

        <div className="mt-3 flex flex-wrap gap-2">

          {languages.length > 0 ? (
            languages.map((language) => (
              <span
                key={language}
                className="border border-[#282d38] bg-[#101217] px-3 py-1.5 font-mono text-[9px] text-[#858b98]"
              >
                {language}
              </span>
            ))
          ) : (
            <span className="font-mono text-[9px] text-[#454b57]">
              NO LANGUAGE DATA
            </span>
          )}

        </div>

      </div>

    </div>
  )
}

function IntelStat({
  label,
  value,
}: {
  label: string
  value: number | string
}) {
  return (
    <div className="border-r border-[#1d2028] px-4 py-5 last:border-r-0">

      <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-[#454b57]">
        {label}
      </div>

      <div className="mt-2 font-mono text-sm text-[#cbd0d8]">
        {typeof value === 'number'
          ? value.toLocaleString()
          : value}
      </div>

    </div>
  )
}

/* =====================================================
   FINAL SCORE
===================================================== */

function FinalScore({
  username,
  score,
  color,
}: {
  username: string
  score: number
  color: string
}) {
  return (
    <div>

      <div
        className="font-mono text-[8px] uppercase tracking-[0.15em]"
        style={{ color }}
      >
        @{username}
      </div>

      <div
        className="mt-2 font-mono text-5xl tracking-[-0.06em]"
        style={{ color }}
      >
        {score}
      </div>

    </div>
  )
}

/* =====================================================
   SECTION TITLE
===================================================== */

function SectionTitle({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#1d2028] pb-5 sm:flex-row sm:items-end sm:justify-between">

      <div className="flex items-center gap-4">

        <span className="font-mono text-[9px] text-[#7cff6b]">
          {number}
        </span>

        <h2 className="text-xl font-medium tracking-[-0.03em]">
          {title}
        </h2>

      </div>

      <p className="max-w-md text-[10px] leading-5 text-[#5e6673] sm:text-right">
        {description}
      </p>

    </div>
  )
}

/* =====================================================
   HELPERS
===================================================== */

function getTopRepo(
  repos: GithubRepo[],
) {
  return [...repos].sort(
    (a, b) =>
      b.stargazers_count -
      a.stargazers_count,
  )[0]
}

function getAccountAge(
  createdAt: string,
) {
  const created = new Date(createdAt)

  const years =
    (Date.now() - created.getTime()) /
    (1000 * 60 * 60 * 24 * 365.25)

  return Math.max(0, Math.floor(years))
}

function getLanguages(
  repos: GithubRepo[],
) {
  const counts = new Map<string, number>()

  repos.forEach((repo) => {
    if (repo.language) {
      counts.set(
        repo.language,
        (counts.get(repo.language) || 0) + 1,
      )
    }
  })

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([language]) => language)
}

export default App
