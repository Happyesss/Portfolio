import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = false;

const GITHUB_USERNAME = 'Happyesss';

interface GitHubUserResponse {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubRepoResponse {
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

interface GitHubSearchResponse {
  total_count: number;
}

interface ContributionDay {
  date: string;
  count: number;
}

const COLOR_BY_LANGUAGE: Record<string, string> = {
  TypeScript: '#4facfe',
  JavaScript: '#facc15',
  Python: '#a855f7',
  Java: '#f77f00',
  Go: '#00f5d4',
  Rust: '#f97316',
  HTML: '#fb7185',
  CSS: '#38bdf8',
  Shell: '#4ade80',
};

function createGitHubHeaders(accept: string): HeadersInit {
  const headers: HeadersInit = {
    Accept: accept,
    'User-Agent': 'portfolio-github-stats',
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function fetchGitHubJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: createGitHubHeaders('application/vnd.github+json'),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed (${response.status}): ${url}`);
  }

  return response.json() as Promise<T>;
}

async function fetchAllRepos(username: string): Promise<GitHubRepoResponse[]> {
  const repos: GitHubRepoResponse[] = [];

  for (let page = 1; page <= 10; page += 1) {
    const batch = await fetchGitHubJson<GitHubRepoResponse[]>(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?type=owner&sort=updated&per_page=100&page=${page}`,
    );
    repos.push(...batch);
    if (batch.length < 100) break;
  }

  return repos;
}

function parseTotalContributions(markup: string): number {
  const headingMatch = markup.match(/([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/i);
  if (!headingMatch) return 0;
  return Number.parseInt(headingMatch[1].replace(/,/g, ''), 10);
}

function parseContributionDays(markup: string): ContributionDay[] {
  const dayCells = markup.match(/<td\b[^>]*data-date="[^"]+"[^>]*>/g) ?? [];
  const tooltips = markup.match(/<tool-tip\b[^>]*for="contribution-day-component-[^"]+"[^>]*>[^<]*<\/tool-tip>/g) ?? [];
  const contributionByCellId = new Map<string, number>();

  for (const tooltip of tooltips) {
    const cellId = tooltip.match(/for="([^"]+)"/)?.[1];
    if (!cellId) continue;

    const text = tooltip.match(/>([^<]*)<\/tool-tip>/)?.[1] ?? '';
    if (text.includes('No contributions')) {
      contributionByCellId.set(cellId, 0);
      continue;
    }

    const countText = text.match(/([\d,]+)\s+contributions?/i)?.[1];
    contributionByCellId.set(cellId, countText ? Number.parseInt(countText.replace(/,/g, ''), 10) : 0);
  }

  const days: ContributionDay[] = [];
  for (const cell of dayCells) {
    const date = cell.match(/data-date="([^"]+)"/)?.[1];
    const cellId = cell.match(/id="([^"]+)"/)?.[1];
    const levelText = cell.match(/data-level="(\d+)"/)?.[1] ?? '0';
    if (!date) continue;

    const fallbackCount = Number.parseInt(levelText, 10);
    const count = cellId ? contributionByCellId.get(cellId) ?? fallbackCount : fallbackCount;
    days.push({ date, count });
  }

  return days.sort((a, b) => a.date.localeCompare(b.date));
}

async function fetchContributionData(username: string): Promise<{ total: number; days: ContributionDay[] }> {
  const response = await fetch(`https://github.com/users/${encodeURIComponent(username)}/contributions`, {
    headers: createGitHubHeaders('text/html'),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`GitHub contributions fetch failed (${response.status})`);
  }

  const markup = await response.text();
  return {
    total: parseTotalContributions(markup),
    days: parseContributionDays(markup),
  };
}

export async function GET() {
  const username = GITHUB_USERNAME;

  const [user, repos, contributions, pullRequests, commits] = await Promise.all([
    fetchGitHubJson<GitHubUserResponse>(`https://api.github.com/users/${encodeURIComponent(username)}`),
    fetchAllRepos(username),
    fetchContributionData(username),
    fetchGitHubJson<GitHubSearchResponse>(
      `https://api.github.com/search/issues?q=author:${encodeURIComponent(username)}+type:pr&per_page=1`,
    ),
    fetchGitHubJson<GitHubSearchResponse>(
      `https://api.github.com/search/commits?q=author:${encodeURIComponent(username)}&per_page=1`,
    ),
  ]);

  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

  const languageCounts = new Map<string, number>();
  for (const repo of repos) {
    if (!repo.language) continue;
    languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
  }

  const rankedLanguages = [...languageCounts.entries()].sort((a, b) => b[1] - a[1]);
  const topLanguageEntries = rankedLanguages.slice(0, 5);
  const topLanguageTotal = topLanguageEntries.reduce((sum, [, count]) => sum + count, 0) || 1;

  const topLanguages = topLanguageEntries.map(([name, count], index) => ({
    name,
    percentage: Math.round((count / topLanguageTotal) * 100),
    color: COLOR_BY_LANGUAGE[name] ?? ['#4facfe', '#00f5d4', '#a855f7', '#f77f00', '#8892a4'][index % 5],
  }));

  return NextResponse.json(
    {
      username: user.login,
      name: user.name ?? user.login,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url,
      bio: user.bio ?? '',
      location: user.location ?? '',
      stats: {
        totalRepos: user.public_repos,
        totalStars,
        totalForks,
        totalPRs: pullRequests.total_count,
        totalCommits: commits.total_count,
        totalContributions: contributions.total,
        followers: user.followers,
        following: user.following,
      },
      topLanguages,
      contributionDays: contributions.days,
      lastUpdated: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    },
  );
}
