'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useSectionInView } from '@/hooks/useScrollProgress';
import { githubStats } from '@/lib/data';
import { SectionHeader } from '@/components/ui/GlassCard';
import { staggerContainer, counterVariant } from '@/lib/animations';

interface GitHubContributionDay {
  date: string;
  count: number;
}

interface GitHubLanguage {
  name: string;
  percentage: number;
  color: string;
}

interface GitHubLiveData {
  username: string;
  name: string;
  avatarUrl: string;
  profileUrl: string;
  bio: string;
  location: string;
  stats: {
    totalRepos: number;
    totalStars: number;
    totalForks: number;
    totalPRs: number;
    totalCommits: number;
    totalContributions: number;
    followers: number;
    following: number;
  };
  topLanguages: GitHubLanguage[];
  contributionDays: GitHubContributionDay[];
  lastUpdated: string;
}

function AnimatedCounter({ value, label, color }: { value: number; label: string; color: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, value);
      setCount(Math.round(current));
      if (current >= value) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      className="glass rounded-2xl p-5 border border-surface-border/80 bg-gradient-to-b from-white/[0.03] to-transparent group hover:border-white/20 transition-all duration-300"
      whileHover={{ y: -3 }}
    >
      <div className="text-text-muted font-mono text-[11px] uppercase tracking-[0.12em] mb-2">{label}</div>
      <div className="font-display text-3xl font-bold tabular-nums" style={{ color }}>
        {inView ? count.toLocaleString() : '0'}
      </div>
    </motion.div>
  );
}

function ContributionGraph({
  contributionDays,
  totalContributions,
  profileUrl,
}: {
  contributionDays: GitHubContributionDay[];
  totalContributions: number;
  profileUrl: string;
}) {
  const weeks = 52;
  const weekDays = 7;
  const totalCells = weeks * weekDays;

  const cells = useMemo(() => {
    const sorted = [...contributionDays].sort((a, b) => a.date.localeCompare(b.date));
    const windowed = sorted.slice(-totalCells);
    const padded = [
      ...Array.from({ length: Math.max(0, totalCells - windowed.length) }, () => ({ date: '', count: 0 })),
      ...windowed,
    ];
    const maxCount = Math.max(...padded.map((day) => day.count), 0);

    return padded.map((day) => {
      if (!day.date || day.count === 0 || maxCount === 0) return { ...day, level: 0 };
      const level = Math.max(1, Math.min(4, Math.ceil((day.count / maxCount) * 4)));
      return { ...day, level };
    });
  }, [contributionDays, totalCells]);

  const weekColumns = useMemo(
    () =>
      Array.from({ length: weeks }, (_, index) => cells.slice(index * weekDays, (index + 1) * weekDays)),
    [cells, weeks],
  );

  const monthLabels = useMemo(() => {
    let previous = '';
    return weekColumns.map((week) => {
      const firstWithDate = week.find((day) => day.date);
      if (!firstWithDate) return '';
      const month = new Date(`${firstWithDate.date}T00:00:00Z`).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
      if (month === previous) return '';
      previous = month;
      return month;
    });
  }, [weekColumns]);

  const intensityClass = ['bg-white/[0.04]', 'bg-accent-teal/20', 'bg-accent-teal/45', 'bg-accent-teal/70', 'bg-accent-teal'];
  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  return (
    <div className="glass rounded-3xl p-6 border border-surface-border/80 bg-gradient-to-b from-accent-teal/[0.04] to-transparent">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-text-primary font-semibold">Contribution Activity</h4>
          <p className="text-text-muted text-xs font-mono mt-1">Last 12 months</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-accent-teal font-mono text-sm font-bold">
            {totalContributions.toLocaleString()} contributions
          </span>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent-teal text-xs font-mono transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>

      <div className="flex justify-center overflow-hidden pb-1">
        <div className="scale-75 sm:scale-85 md:scale-90 lg:scale-100 origin-top">
          <div className="flex pl-9 gap-1 mb-2 text-[10px] font-mono text-text-muted">
            {monthLabels.map((label, index) => (
              <div key={`${label}-${index}`} className="w-3.5">
                {label}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col gap-1 text-[10px] font-mono text-text-muted">
              {dayLabels.map((label, index) => (
                <div key={`day-label-${index}`} className="h-3.5 leading-[14px]">
                  {label}
                </div>
              ))}
            </div>

            <div className="flex gap-1">
              {weekColumns.map((week, weekIndex) => (
                <div key={`week-${weekIndex}`} className="flex flex-col gap-1">
                  {week.map((cell, dayIndex) => (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}-${cell.date}`}
                      className={`w-3.5 h-3.5 rounded-[3px] ${intensityClass[cell.level]}`}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: weekIndex * 0.01, duration: 0.2 }}
                      title={
                        cell.date
                          ? `${cell.count} contribution${cell.count === 1 ? '' : 's'} on ${new Date(`${cell.date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}`
                          : 'No contribution data'
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 text-text-muted font-mono text-xs">
        <span>Less</span>
        {intensityClass.map((cls, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

export default function GitHubStats({ setActiveSection }: { setActiveSection: (id: string) => void }) {
  const ref = useSectionInView('github', setActiveSection);
  const [liveData, setLiveData] = useState<GitHubLiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadGitHubStats = async () => {
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
        const response = await fetch(`${basePath}/api/github/stats?username=${encodeURIComponent(githubStats.username)}`);
        if (!response.ok) {
          throw new Error(`GitHub stats fetch failed: ${response.status}`);
        }

        const data = await response.json() as GitHubLiveData;
        if (!isMounted) return;
        setLiveData(data);
      } catch (error) {
        console.error('Unable to load GitHub stats', error);
        if (isMounted) setHasError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadGitHubStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const fallbackData: GitHubLiveData = useMemo(
    () => ({
      username: githubStats.username,
      name: githubStats.username,
      avatarUrl: `https://github.com/${githubStats.username}.png`,
      profileUrl: `https://github.com/${githubStats.username}`,
      bio: 'Open-source contributor building scalable products.',
      location: 'India',
      stats: {
        totalRepos: githubStats.totalRepos,
        totalStars: githubStats.totalStars,
        totalForks: githubStats.totalForks,
        totalPRs: githubStats.totalPRs,
        totalCommits: githubStats.totalCommits,
        totalContributions: githubStats.contributions,
        followers: 0,
        following: 0,
      },
      topLanguages: githubStats.topLanguages,
      contributionDays: [],
      lastUpdated: new Date().toISOString(),
    }),
    [],
  );

  const data = liveData ?? fallbackData;
  const stats = [
    { value: data.stats.totalRepos, label: 'Repositories', color: '#4facfe' },
    { value: data.stats.totalStars, label: 'Stars', color: '#f77f00' },
    { value: data.stats.totalForks, label: 'Forks', color: '#00f5d4' },
    { value: data.stats.totalPRs, label: 'Pull Requests', color: '#4ade80' },
    { value: data.stats.totalCommits, label: 'Commits', color: '#a855f7' },
    { value: data.stats.totalContributions, label: 'Contributions', color: '#f43f5e' },
  ];

  const formattedSyncTime = data.lastUpdated
    ? new Date(data.lastUpdated).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
    : '';

  return (
    <div ref={ref} className="relative section-padding bg-bg-secondary overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-teal/30 to-transparent" aria-hidden="true" />

      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Open Source"
          title="GitHub Activity"
          subtitle="Building in public, contributing to the community, and leaving a trail of commits."
          accentColor="teal"
        />

        <motion.div
          className="glass-bright rounded-3xl p-6 border border-surface-border/80 mb-8 bg-gradient-to-br from-white/[0.04] to-transparent"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={data.avatarUrl}
                alt={`${data.username} avatar`}
                className="w-14 h-14 rounded-2xl border border-surface-border object-cover"
              />
              <div>
                <h3 className="text-text-primary font-semibold text-lg">{data.name}</h3>
                <p className="text-text-secondary text-sm font-mono">@{data.username}</p>
                {data.bio ? <p className="text-text-muted text-xs mt-1">{data.bio}</p> : null}
              </div>
            </div>

            <div className="text-right">
              <a
                href={data.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-border text-text-primary hover:text-accent-teal hover:border-accent-teal/40 transition-colors text-sm"
              >
                Open Profile
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <p className="text-text-muted text-[11px] font-mono mt-2">
                {loading ? 'Syncing live stats...' : hasError ? 'Using cached fallback data' : `Synced ${formattedSyncTime}`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10"
          variants={staggerContainer(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, i) => (
            <motion.div key={stat.label} variants={counterVariant} custom={i}>
              <AnimatedCounter value={stat.value} label={stat.label} color={stat.color} />
            </motion.div>
          ))}
        </motion.div>

        {/* Contribution graph */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <ContributionGraph
            contributionDays={data.contributionDays}
            totalContributions={data.stats.totalContributions}
            profileUrl={data.profileUrl}
          />
        </motion.div>

        {/* Language distribution */}
        <motion.div
          className="glass rounded-2xl p-6 border border-surface-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h4 className="text-text-primary font-semibold text-sm mb-5">Top Languages</h4>

          {/* Combined bar */}
          <div className="h-3 rounded-full overflow-hidden flex mb-4">
            {data.topLanguages.map((lang) => (
              <motion.div
                key={lang.name}
                className="h-full"
                style={{ background: lang.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${lang.percentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>

          <div className="space-y-3">
            {data.topLanguages.map((lang) => (
              <div key={lang.name} className="space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: lang.color }} />
                    <span className="text-text-secondary font-mono text-xs">{lang.name}</span>
                  </div>
                  <span className="text-text-muted font-mono text-xs">{lang.percentage}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${lang.percentage}%`, background: lang.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* GitHub CTA */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href={data.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl glass-bright border border-surface-border text-text-primary hover:border-accent-teal/30 hover:text-accent-teal transition-all duration-300 font-medium group"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View GitHub Profile
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
