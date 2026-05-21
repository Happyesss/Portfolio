// ─── Personal Info ──────────────────────────────────────────────────────────
export const personalInfo = {
  name: 'Shashank Kumar Rathour',
  firstName: 'Shashank',
  lastName: 'Rathour',
  title: 'Software Development Engineer',
  tagline: 'Building scalable products and innovative solutions that impact millions of users.',
  email: '22csaiml002@jssaten.ac.in',
  location: 'Noida, India',
  github: 'https://github.com/Happyesss',
  linkedin: 'https://www.linkedin.com/in/shashank-kumar-rathour-9a49b32a5/',
  twitter: 'https://twitter.com',
  website: 'https://github.com/Happyesss',
  bio: "Software Development Engineer with expertise in building scalable, user-centric applications. Passionate about System Design, Microservices, and creating products that impact millions of users.",
  bioExtended: "From pioneering the world's first pay-as-you-go project management tool to building AI-driven apps used by thousands, I bridge deep technical execution with product thinking. I believe great software is as much about the experience as the code.",
};

// ─── Skills ─────────────────────────────────────────────────────────────────
export const skills = [
  // Frontend
  { name: 'React / Next.js', category: 'frontend', level: 92, icon: '⚛' },
  { name: 'TypeScript', category: 'frontend', level: 85, icon: '𝙏𝙎' },
  { name: 'Three.js / WebGL', category: 'frontend', level: 75, icon: '△' },
  { name: 'Tailwind CSS', category: 'frontend', level: 90, icon: '🎨' },
  { name: 'Framer Motion', category: 'frontend', level: 80, icon: '✦' },
  // Backend
  { name: 'Spring Boot / Java', category: 'backend', level: 88, icon: '☕' },
  { name: 'Node.js / Express', category: 'backend', level: 85, icon: '⬡' },
  { name: 'Python / FastAPI', category: 'backend', level: 78, icon: '🐍' },
  { name: 'REST APIs', category: 'backend', level: 92, icon: '⇄' },
  { name: 'System Design', category: 'backend', level: 85, icon: '◈' },
  // AI/ML
  { name: 'LLM APIs / OpenAI', category: 'ai', level: 88, icon: '🧠' },
  { name: 'LangChain', category: 'ai', level: 75, icon: '◆' },
  { name: 'AI Integrations', category: 'ai', level: 82, icon: '◎' },
  { name: 'Prompt Engineering', category: 'ai', level: 85, icon: '⬟' },
  { name: 'ML Pipelines', category: 'ai', level: 70, icon: '⬧' },
  // Cloud
  { name: 'Azure', category: 'cloud', level: 82, icon: '☁' },
  { name: 'AWS', category: 'cloud', level: 75, icon: '◐' },
  { name: 'Vercel / Edge', category: 'cloud', level: 90, icon: '▲' },
  { name: 'Docker / CI-CD', category: 'cloud', level: 78, icon: '🐳' },
  // Databases
  { name: 'PostgreSQL', category: 'database', level: 85, icon: '🐘' },
  { name: 'Redis', category: 'database', level: 90, icon: '◍' },
  { name: 'MongoDB', category: 'database', level: 78, icon: '◉' },
  { name: 'MySQL', category: 'database', level: 82, icon: '⚡' },
  // DevOps
  { name: 'GitHub Actions', category: 'devops', level: 85, icon: '⚙' },
  { name: 'Linux / Shell', category: 'devops', level: 82, icon: '⇌' },
  { name: 'Microservices', category: 'devops', level: 80, icon: '♦' },
];

// ─── Projects ───────────────────────────────────────────────────────────────
export const projects = [
  {
    id: 1,
    title: 'Fairlx',
    subtitle: 'Pay-as-you-go Project Management',
    description:
      'First-ever project management tool with a pay-as-you-go model. Designed LLD/HLD, engineered a Redis caching layer reducing API response times by 40% and supporting 2x scale.',
    longDescription:
      'Fairlx is a groundbreaking project management platform that disrupts the subscription model — teams only pay for what they use. Built from scratch with scalable microservices, Redis caching, and a modern React frontend. Actively resolving architecture bottlenecks and driving product innovation.',
    tech: ['React', 'Spring Boot', 'Redis', 'Azure', 'PostgreSQL', 'Node.js'],
    metrics: { improvement: '40% faster', scale: '2x supported', model: 'First-ever PAYG', status: 'Live' },
    github: 'https://github.com/Happyesss',
    demo: 'https://fairlx.com',
    color: '#4facfe',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    category: 'SaaS',
    featured: true,
    year: 2024,
    logo: '/fairlx_logo.png',
    architecture: ['React Frontend', 'Spring Boot Backend', 'Redis Cache Layer', 'PostgreSQL DB', 'Azure Cloud'],
  },
  {
    id: 2,
    title: 'Resumy',
    subtitle: 'AI-Powered Resume Builder',
    description:
      'AI-driven resume generation tool utilizing LLM APIs for ATS-optimized resumes, cover letters, and cold emails. Serving 1,000+ users with real-time previews.',
    longDescription:
      'Resumy leverages cutting-edge LLM APIs to generate highly tailored, ATS-optimized resumes, cover letters, and cold emails in seconds. With live preview, one-click generation, and continuous AI improvements, it has saved thousands of hours for job seekers.',
    tech: ['React', 'LLM APIs', 'Node.js', 'OpenAI', 'Tailwind CSS'],
    metrics: { users: '1,000+', output: 'ATS-optimized', extras: 'Cover letters + cold emails', preview: 'Real-time' },
    github: 'https://github.com/Happyesss',
    demo: 'https://resumy.live',
    color: '#00f5d4',
    gradient: 'from-teal-500/20 to-emerald-500/20',
    category: 'AI/ML',
    featured: true,
    year: 2024,
    logo: '/resumy_logo.png',
    architecture: ['React Frontend', 'Node.js API', 'OpenAI LLM Layer', 'Vercel Edge Deployment'],
  },
  {
    id: 3,
    title: 'Assignme',
    subtitle: 'Assignment Automation Tool',
    description:
      'Open-source viral tool achieving 3.2M views in one month. Uses custom handwriting fonts via FontForge and processed 3.97M HTTP requests efficiently.',
    longDescription:
      'Assignme is an open-source assignment automation tool that creates handwritten-style assignments using custom fonts built with FontForge. It went viral reaching 3.2M views in its first month and processing nearly 4M HTTP requests — demonstrating both product-market fit and infrastructure resilience.',
    tech: ['FontForge', 'JavaScript', 'Linux', 'HTML/CSS', 'Cloudflare'],
    metrics: { views: '3.2M in 1 month', requests: '3.97M HTTP requests', type: 'Open-source', fonts: 'Custom handwriting' },
    github: 'https://github.com/Happyesss',
    demo: 'https://assignme.pages.dev',
    color: '#a855f7',
    gradient: 'from-purple-500/20 to-pink-500/20',
    category: 'Tools',
    featured: true,
    year: 2023,
    logo: '/assignme_logo.png',
    architecture: ['FontForge Engine', 'JavaScript Core', 'Cloudflare Pages', 'Open Source'],
  },
  {
    id: 4,
    title: 'AKTU Resources',
    subtitle: 'Academic Resource Platform',
    description:
      'Academic platform with 28K+ users and 155K+ page views in 4 months. Achieved #1 Google ranking with a 70% organic traffic increase.',
    longDescription:
      'AKTU Resources is the premier academic platform for AKTU university students. Through strategic SEO, a clean UX, and comprehensive study materials, it achieved the #1 Google ranking for key terms and became the most-visited AKTU resource site in under four months.',
    tech: ['React', 'Node.js', 'MongoDB', 'Express', 'SEO'],
    metrics: { users: '28K+', pageViews: '155K+ in 4 months', ranking: '#1 Google', growth: '70% organic traffic' },
    github: 'https://github.com/Happyesss',
    demo: 'https://aktu-resources.me',
    color: '#f77f00',
    gradient: 'from-orange-500/20 to-amber-500/20',
    category: 'EdTech',
    featured: false,
    year: 2023,
    logo: '/aktu_logo.png',
    architecture: ['React Frontend', 'Node.js + Express', 'MongoDB', 'SEO Optimized'],
  },
];

// ─── Education ───────────────────────────────────────────────────────────────
export const education = [
  {
    company: 'JSS Academy of Technical Education',
    role: 'B.Tech in Computer Science and Engineering (Artificial Intelligence & Machine Learning)',
    period: '2022 - 2026',
    location: 'Noida, India',
    type: 'Education',
    color: '#4facfe',
    description:
      'B.Tech in CSE with a specialization in Artificial Intelligence and Machine Learning.',
    highlights: [
      'Focused coursework in AI/ML, data structures, and system design',
      'Built multiple production-grade projects during the program',
    ],
    tech: ['AI/ML', 'Data Structures', 'Algorithms', 'Python', 'Java'],
  },
  {
    company: 'Jesus and Mary Convent School',
    role: 'Senior Secondary (XII)',
    period: '2021 - 2022',
    location: 'Greater Noida, India',
    type: 'Education',
    color: '#00f5d4',
    description:
      'Physics, Chemistry, Mathematics (PCM) with Computer Science.',
    highlights: [],
    tech: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'],
  },
  {
    company: 'Jesus and Mary Convent School',
    role: 'Secondary (X)',
    period: '2019 - 2020',
    location: 'Greater Noida, India',
    type: 'Education',
    color: '#a855f7',
    description:
      'Core curriculum with emphasis on science and mathematics.',
    highlights: [],
    tech: ['Science', 'Mathematics', 'English', 'Social Science'],
  },
];

// ─── Testimonials ────────────────────────────────────────────────────────────
export const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'CTO at FounderLabs',
    avatar: 'SC',
    rating: 5,
    color: '#4facfe',
    text: "Shashank's ability to translate complex product requirements into scalable architecture is rare. He shipped our core platform in record time with technical depth and product thinking that makes him an exceptional engineer.",
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'VP Engineering at ArchCloud',
    avatar: 'MJ',
    rating: 5,
    color: '#00f5d4',
    text: 'Working with Shashank elevated our entire team. He brought a systems-thinking approach that transformed how we build infrastructure. The tools he built continue to power our product daily.',
  },
  {
    id: 3,
    name: 'Priya Patel',
    role: 'Founder at ClearMind AI',
    avatar: 'PP',
    rating: 5,
    color: '#a855f7',
    text: "I've worked with many engineers, and Shashank stands out for his combination of speed and quality. He doesn't just write code — he thinks deeply about the product, the user, and the business. That's a rare combination.",
  },
  {
    id: 4,
    name: 'David Park',
    role: 'Principal Engineer at Meta',
    avatar: 'DP',
    rating: 5,
    color: '#f77f00',
    text: "Shashank's contributions to our codebase were outstanding — clean, well-tested, and production-ready. His pull requests often solved problems I hadn't even considered yet. A genuine force multiplier on any engineering team.",
  },
  {
    id: 5,
    name: 'Elena Rodriguez',
    role: 'Partner at Horizon Ventures',
    avatar: 'ER',
    rating: 5,
    color: '#4ade80',
    text: "We look for builders who can both ship and articulate why it matters. Shashank has the technical ability to execute his vision and the communication skills to bring others along. Exactly the profile we back.",
  },
];

// ─── GitHub Stats (placeholder — connect to real GitHub API in production) ──
export const githubStats = {
  username: 'Happyesss',
  totalRepos: 47,
  totalStars: 2840,
  totalForks: 412,
  totalCommits: 3200,
  totalPRs: 890,
  totalIssues: 234,
  contributions: 1847,
  topLanguages: [
    { name: 'TypeScript', percentage: 38, color: '#4facfe' },
    { name: 'Python', percentage: 24, color: '#a855f7' },
    { name: 'Go', percentage: 15, color: '#00f5d4' },
    { name: 'Rust', percentage: 12, color: '#f77f00' },
    { name: 'Other', percentage: 11, color: '#8892a4' },
  ],
};

// ─── Startup Journey ────────────────────────────────────────────────────────
export const startupJourney = [
  {
    phase: '01',
    title: 'The Beginning',
    period: '2022',
    color: '#4facfe',
    description:
      'Started B.Tech in CS (AI & ML) at JSS Academy. Discovered a passion for building — wrote first lines of JavaScript and never stopped. First projects were small; the ambition was not.',
    milestone: 'B.Tech Started, JSS Academy',
  },
  {
    phase: '02',
    title: 'First Viral Build',
    period: '2023',
    color: '#a855f7',
    description:
      'Built Assignme — an open-source assignment automation tool with custom handwriting fonts via FontForge. Went viral reaching 3.2M views in one month and processing 3.97M HTTP requests.',
    milestone: '3.2M Views in 1 Month',
  },
  {
    phase: '03',
    title: 'AI & Growth',
    period: '2023–2024',
    color: '#00f5d4',
    description:
      'Launched Resumy — an AI resume builder using LLM APIs, now serving 1,000+ users. Built AKTU Resources which reached 28K+ users and #1 Google ranking with 155K+ page views in 4 months.',
    milestone: '28K+ Users, #1 Google Ranking',
  },
  {
    phase: '04',
    title: 'SDE & Founder',
    period: '2024 – Present',
    color: '#f77f00',
    description:
      "Joined Fairlx as SDE — pioneering the world's first pay-as-you-go project management platform. Designing system architecture (LLD/HLD), implementing Redis caching, and building for scale.",
    milestone: 'Fairlx: First-of-its-Kind PAYG',
  },
];

// ─── Code snippets for background ───────────────────────────────────────────
export const codeSnippets = [
  `const pipeline = new AIOrchestrator({
  model: 'gpt-4-turbo',
  tools: [webSearch, codeExecutor],
  memory: vectorStore,
});`,
  `async function deployEdge(config: Config) {
  const cluster = await k8s.createCluster(config);
  await cluster.scale({ replicas: 'auto' });
  return cluster.endpoint;
}`,
  `@app.post("/inference")
async def run_model(
  prompt: str,
  ctx: Context = Depends(get_ctx)
) -> StreamResponse:
  return await model.stream(prompt, ctx)`,
  `const { data, loading } = useQuery(FEED_QUERY, {
  variables: { cursor, limit: 20 },
  fetchPolicy: 'cache-and-network',
});`,
  `SELECT user_id, COUNT(*) as events,
  percentile_cont(0.95) WITHIN GROUP
  (ORDER BY latency_ms) as p95_latency
FROM analytics
GROUP BY user_id;`,
];
