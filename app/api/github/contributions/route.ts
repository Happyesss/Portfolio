import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const DEFAULT_USERNAME = 'Happyesss';

interface ContributionDay {
  date: string;
  count: number;
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

    days.push({
      date,
      count,
    });
  }

  return days.sort((a, b) => a.date.localeCompare(b.date));
}

function parseTotalContributions(markup: string): number | null {
  const headingMatch = markup.match(/([\d,]+)\s+contributions/i);
  if (!headingMatch) return null;
  return Number.parseInt(headingMatch[1].replace(/,/g, ''), 10);
}

interface ContributionsCacheEntry {
  data: any;
  timestamp: number;
}
const contributionsCache = new Map<string, ContributionsCacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || DEFAULT_USERNAME;
  const now = Date.now();

  const cached = contributionsCache.get(username);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'X-Cache': 'HIT',
      },
    });
  }

  const contributionsUrl = `https://github.com/users/${encodeURIComponent(username)}/contributions`;

  try {
    const response = await fetch(contributionsUrl, {
      headers: {
        Accept: 'text/html',
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioGitHubContributions/1.0)',
      },
      next: { revalidate: 60 },
    });

    if (response.ok) {
      const markup = await response.text();
      const days = parseContributionDays(markup);
      const totalFromHeading = parseTotalContributions(markup);
      const totalContributions = totalFromHeading ?? days.reduce((sum, day) => sum + day.count, 0);

      if (days.length > 0) {
        const payload = {
          username,
          totalContributions,
          days,
        };
        contributionsCache.set(username, { data: payload, timestamp: now });
        return NextResponse.json(payload, {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            'X-Cache': 'MISS',
          },
        });
      }
    }
  } catch (err) {
    console.warn('Direct contributions fetch error, trying fallback:', err);
  }

  // Fallback API
  try {
    const fallbackRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`, {
      next: { revalidate: 300 },
    });
    if (fallbackRes.ok) {
      const data = await fallbackRes.json() as { total?: Record<string, number>; contributions?: Array<{ date: string; count: number }> };
      const days = (data.contributions ?? []).map((c) => ({ date: c.date, count: c.count }));
      const totalContributions = Object.values(data.total ?? {}).reduce((acc, v) => acc + v, 0) || days.reduce((sum, d) => sum + d.count, 0);

      const payload = {
        username,
        totalContributions,
        days,
      };
      contributionsCache.set(username, { data: payload, timestamp: now });

      return NextResponse.json(payload, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          'X-Cache': 'MISS',
        },
      });
    }
  } catch (fallbackErr) {
    console.warn('Fallback contributions API failed:', fallbackErr);
  }

  return NextResponse.json(
    {
      username,
      totalContributions: 0,
      days: [],
    },
    { status: 200 },
  );
}
