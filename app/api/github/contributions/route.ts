import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = false;

const GITHUB_USERNAME = 'Happyesss';

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
  const headingMatch = markup.match(/([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/i);
  if (!headingMatch) return null;
  return Number.parseInt(headingMatch[1].replace(/,/g, ''), 10);
}

export async function GET() {
  const username = GITHUB_USERNAME;

  const contributionsUrl = `https://github.com/users/${encodeURIComponent(username)}/contributions`;
  const response = await fetch(contributionsUrl, {
    headers: { Accept: 'text/html' },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: `Unable to fetch contributions for ${username}` },
      { status: response.status },
    );
  }

  const markup = await response.text();
  const days = parseContributionDays(markup);
  const totalFromHeading = parseTotalContributions(markup);
  const totalContributions = totalFromHeading ?? days.reduce((sum, day) => sum + day.count, 0);

  return NextResponse.json(
    {
      username,
      totalContributions,
      days,
    },
    {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    },
  );
}
