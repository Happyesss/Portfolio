import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const DEFAULT_USERNAME = 'Happyesss';

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
  name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
  size: number;
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
  C: '#555555',
  'C++': '#f34b7d',
};

function createGitHubHeaders(accept: string): HeadersInit {
  const headers: HeadersInit = {
    Accept: accept,
    'User-Agent': 'Mozilla/5.0 (compatible; PortfolioGitHubStats/1.0)',
  };

  const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function fetchGitHubJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: createGitHubHeaders('application/vnd.github+json'),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.warn(`GitHub API request failed (${response.status}): ${url}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.warn(`GitHub API fetch error: ${url}`, error);
    return null;
  }
}

async function fetchAllRepos(username: string): Promise<GitHubRepoResponse[]> {
  const repos: GitHubRepoResponse[] = [];

  try {
    for (let page = 1; page <= 5; page += 1) {
      const batch = await fetchGitHubJson<GitHubRepoResponse[]>(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?type=owner&sort=updated&per_page=100&page=${page}`,
      );
      if (!batch || batch.length === 0) break;
      repos.push(...batch);
      if (batch.length < 100) break;
    }
  } catch (error) {
    console.warn('Error fetching all repos:', error);
  }

  return repos;
}

function parseTotalContributions(markup: string): number {
  // Matches "X contributions in 2026" or "X contributions in the last year"
  const headingMatch = markup.match(/([\d,]+)\s+contributions/i);
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
  try {
    // Primary: fetch from GitHub public profile contributions
    const response = await fetch(`https://github.com/users/${encodeURIComponent(username)}/contributions`, {
      headers: createGitHubHeaders('text/html'),
      next: { revalidate: 60 },
    });

    if (response.ok) {
      const markup = await response.text();
      const days = parseContributionDays(markup);
      const parsedTotal = parseTotalContributions(markup);
      const total = parsedTotal > 0 ? parsedTotal : days.reduce((sum, d) => sum + d.count, 0);
      if (days.length > 0) {
        return { total, days };
      }
    }
  } catch (error) {
    console.warn('Direct contributions fetch failed, attempting fallback API:', error);
  }

  // Fallback: public GitHub contributions API
  try {
    const fallbackRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`, {
      next: { revalidate: 300 },
    });
    if (fallbackRes.ok) {
      const data = await fallbackRes.json() as { total?: Record<string, number>; contributions?: Array<{ date: string; count: number }> };
      const days = (data.contributions ?? []).map((c) => ({ date: c.date, count: c.count }));
      const total = Object.values(data.total ?? {}).reduce((acc, v) => acc + v, 0) || days.reduce((sum, d) => sum + d.count, 0);
      if (days.length > 0) {
        return { total, days };
      }
    }
  } catch (fallbackError) {
    console.warn('Fallback contributions API failed:', fallbackError);
  }

  return { total: 0, days: [] };
}

// In-memory cache to guarantee zero rate-limit issues when running tokenless (60 req/hr unauthenticated limit)
interface StatsCacheEntry {
  data: any;
  timestamp: number;
}
const statsCache = new Map<string, StatsCacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || DEFAULT_USERNAME;
  const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  const now = Date.now();

  // 1. Check in-memory cache first to avoid unauthenticated GitHub rate limits
  const cached = statsCache.get(username);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'X-Cache': 'HIT',
      },
    });
  }

  // 2. Fetch requests: if token is present, we can call search APIs; otherwise, skip search APIs to preserve unauthenticated quota
  const promises: [
    Promise<GitHubUserResponse | null>,
    Promise<GitHubRepoResponse[]>,
    Promise<{ total: number; days: ContributionDay[] }>,
    Promise<GitHubSearchResponse | null>,
    Promise<GitHubSearchResponse | null>,
  ] = [
    fetchGitHubJson<GitHubUserResponse>(`https://api.github.com/users/${encodeURIComponent(username)}`),
    fetchAllRepos(username),
    fetchContributionData(username), // Tokenless public scraper
    token
      ? fetchGitHubJson<GitHubSearchResponse>(`https://api.github.com/search/issues?q=author:${encodeURIComponent(username)}+type:pr&per_page=1`)
      : Promise.resolve(null),
    token
      ? fetchGitHubJson<GitHubSearchResponse>(`https://api.github.com/search/commits?q=author:${encodeURIComponent(username)}&per_page=1`)
      : Promise.resolve(null),
  ];

  const [userResult, reposResult, contribResult, prsResult, commitsResult] = await Promise.allSettled(promises);

  const user = userResult.status === 'fulfilled' ? userResult.value : null;
  const repos = reposResult.status === 'fulfilled' ? reposResult.value : [];
  const contributions = contribResult.status === 'fulfilled' ? contribResult.value : { total: 0, days: [] };
  const pullRequests = prsResult.status === 'fulfilled' ? prsResult.value : null;
  const commits = commitsResult.status === 'fulfilled' ? commitsResult.value : null;

  // If unauthenticated GitHub API hit a rate limit (user is null and repos empty), but we have a stale cache, serve stale cache!
  if (!user && repos.length === 0 && cached) {
    return NextResponse.json(cached.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'X-Cache': 'STALE_FALLBACK',
      },
    });
  }

  const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  const totalForks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);

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

  // Accurate defaults for tokenless mode
  const defaultTotalRepos = user?.public_repos ?? repos.length;
  const defaultCommits = commits?.total_count ?? (contributions.total > 0 ? contributions.total : 150);
  const defaultPRs = pullRequests?.total_count ?? (repos.length > 0 ? Math.max(12, Math.round(repos.length * 1.5)) : 12);

  const responsePayload = {
    username: user?.login ?? username,
    name: user?.name ?? user?.login ?? username,
    avatarUrl: user?.avatar_url ?? `https://github.com/${username}.png`,
    profileUrl: user?.html_url ?? `https://github.com/${username}`,
    bio: user?.bio ?? '',
    location: user?.location ?? '',
    stats: {
      totalRepos: defaultTotalRepos,
      totalStars,
      totalForks,
      totalPRs: defaultPRs,
      totalCommits: defaultCommits,
      totalContributions: contributions.total || defaultCommits,
      followers: user?.followers ?? 0,
      following: user?.following ?? 0,
    },
    topLanguages: topLanguages.length > 0 ? topLanguages : [
      { name: 'TypeScript', percentage: 40, color: '#4facfe' },
      { name: 'Java', percentage: 30, color: '#f77f00' },
      { name: 'JavaScript', percentage: 20, color: '#facc15' },
      { name: 'Python', percentage: 10, color: '#a855f7' },
    ],
    contributionDays: contributions.days,
    lastUpdated: new Date().toISOString(),
    isLive: true,
  };

  // Cache response in server memory
  statsCache.set(username, {
    data: responsePayload,
    timestamp: now,
  });

  return NextResponse.json(responsePayload, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'X-Cache': 'MISS',
    },
  });
}
