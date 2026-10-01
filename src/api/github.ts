export interface GithubUser {
  login: string
  name: string | null
  avatar_url: string
  html_url: string

  public_repos: number
  followers: number
  following: number

  created_at: string
}

export interface GithubRepository {
  id: number
  name: string
  html_url: string

  stargazers_count: number
  forks_count: number

  language: string | null
  size: number

  fork: boolean
}

export interface GithubProfile {
  user: GithubUser
  repositories: GithubRepository[]
}

async function githubRequest<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (response.status === 404) {
    throw new Error('GitHub user not found.')
  }

  if (response.status === 403) {
    throw new Error(
      'GitHub API rate limit reached. Please try again later.',
    )
  }

  if (!response.ok) {
    throw new Error(
      `GitHub request failed (${response.status}).`,
    )
  }

  return response.json()
}

export async function getGithubProfile(
  username: string,
): Promise<GithubProfile> {
  const cleanUsername = username.trim()

  const user = await githubRequest<GithubUser>(
    `https://api.github.com/users/${encodeURIComponent(cleanUsername)}`,
  )

  const repositories = await githubRequest<GithubRepository[]>(
    `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?per_page=100&sort=updated`,
  )

  return {
    user,
    repositories,
  }
}
