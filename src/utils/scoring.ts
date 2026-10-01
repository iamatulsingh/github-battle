import type { GithubProfile } from '../api/github'

export interface BattleStats {
  stars: number
  repositories: number
  community: number
  impact: number
  activity: number
  longevity: number

  total: number
}

export interface BattleResult {
  player: GithubProfile
  stats: BattleStats
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value))
}

function logarithmicScore(
  value: number,
  reference: number,
): number {
  if (value <= 0) return 0

  return clamp(
    (Math.log10(value + 1) /
      Math.log10(reference + 1)) *
      100,
  )
}

function calculateStars(profile: GithubProfile) {
  const stars = profile.repositories.reduce(
    (total, repo) => total + repo.stargazers_count,
    0,
  )

  return logarithmicScore(stars, 10000)
}

function calculateRepositories(profile: GithubProfile) {
  return logarithmicScore(
    profile.user.public_repos,
    200,
  )
}

function calculateCommunity(profile: GithubProfile) {
  const followers = profile.user.followers

  const following = profile.user.following

  const followerScore = logarithmicScore(
    followers,
    10000,
  )

  const ratio =
    following === 0
      ? followers
      : followers / following

  const ratioScore = clamp(
    Math.log10(ratio + 1) * 35,
  )

  return clamp(
    followerScore * 0.75 +
      ratioScore * 0.25,
  )
}

function calculateImpact(profile: GithubProfile) {
  const stars = profile.repositories.reduce(
    (total, repo) => total + repo.stargazers_count,
    0,
  )

  const forks = profile.repositories.reduce(
    (total, repo) => total + repo.forks_count,
    0,
  )

  const starScore = logarithmicScore(
    stars,
    10000,
  )

  const forkScore = logarithmicScore(
    forks,
    5000,
  )

  return starScore * 0.7 + forkScore * 0.3
}

function calculateActivity(profile: GithubProfile) {
  if (profile.repositories.length === 0) {
    return 0
  }

  const activeRepositories =
    profile.repositories.filter((repo) => !repo.fork)

  return clamp(
    (activeRepositories.length /
      Math.max(profile.user.public_repos, 1)) *
      100,
  )
}

function calculateLongevity(profile: GithubProfile) {
  const created = new Date(
    profile.user.created_at,
  )

  const now = new Date()

  const years =
    (now.getTime() - created.getTime()) /
    (1000 * 60 * 60 * 24 * 365.25)

  return clamp((years / 10) * 100)
}

export function calculateBattleStats(
  profile: GithubProfile,
): BattleStats {
  const stars = calculateStars(profile)

  const repositories =
    calculateRepositories(profile)

  const community =
    calculateCommunity(profile)

  const impact =
    calculateImpact(profile)

  const activity =
    calculateActivity(profile)

  const longevity =
    calculateLongevity(profile)

  const total =
    stars * 0.25 +
    repositories * 0.20 +
    community * 0.15 +
    impact * 0.20 +
    activity * 0.10 +
    longevity * 0.10

  return {
    stars: Math.round(stars),
    repositories: Math.round(repositories),
    community: Math.round(community),
    impact: Math.round(impact),
    activity: Math.round(activity),
    longevity: Math.round(longevity),
    total: Math.round(total),
  }
}

export function createBattleResult(
  profile: GithubProfile,
): BattleResult {
  return {
    player: profile,
    stats: calculateBattleStats(profile),
  }
}
