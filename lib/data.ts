// ─── Personal Info ──────────────────────────────────────────────────────────
export const personalInfo = {
  name: 'Alex Rivera',
  firstName: 'Alex',
  lastName: 'Rivera',
  title: 'Digital Architect & Full-Stack Engineer',
  tagline: 'Building products, systems, and experiences that merge engineering with creativity.',
  email: 'alex@digitalarchitect.dev',
  location: 'San Francisco, CA',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
  website: 'https://digitalarchitect.dev',
  bio: "I'm a full-stack engineer and product builder with 6+ years of experience turning ambitious ideas into scalable digital products. I specialize in AI-powered systems, cloud architecture, and crafting user experiences that feel magical.",
  bioExtended: 'From founding two startups to shipping products used by 100K+ users, I bridge the gap between deep technical execution and product thinking. I believe great software is as much about the experience as the code.',
};

// ─── Skills ─────────────────────────────────────────────────────────────────
export const skills = [
  // Frontend
  { name: 'React / Next.js', category: 'frontend', level: 95, icon: '⚛' },
  { name: 'TypeScript', category: 'frontend', level: 92, icon: '𝙏𝙎' },
  { name: 'Three.js / WebGL', category: 'frontend', level: 80, icon: '△' },
  { name: 'Tailwind CSS', category: 'frontend', level: 90, icon: '🎨' },
  { name: 'Framer Motion', category: 'frontend', level: 85, icon: '✦' },
  // Backend
  { name: 'Node.js / Bun', category: 'backend', level: 90, icon: '⬡' },
  { name: 'Python / FastAPI', category: 'backend', level: 88, icon: '🐍' },
  { name: 'Go', category: 'backend', level: 72, icon: '◈' },
  { name: 'GraphQL', category: 'backend', level: 82, icon: '◎' },
  { name: 'REST / gRPC', category: 'backend', level: 88, icon: '⇄' },
  // AI/ML
  { name: 'LangChain / LLMs', category: 'ai', level: 85, icon: '🧠' },
  { name: 'PyTorch', category: 'ai', level: 78, icon: '🔥' },
  { name: 'OpenAI API', category: 'ai', level: 92, icon: '◆' },
  { name: 'Vector DBs', category: 'ai', level: 80, icon: '⬟' },
  { name: 'ML Pipelines', category: 'ai', level: 75, icon: '⬧' },
  // Cloud
  { name: 'AWS', category: 'cloud', level: 88, icon: '☁' },
  { name: 'GCP', category: 'cloud', level: 78, icon: '◐' },
  { name: 'Vercel / Edge', category: 'cloud', level: 92, icon: '▲' },
  { name: 'Terraform', category: 'cloud', level: 75, icon: '♦' },
  // Databases
  { name: 'PostgreSQL', category: 'database', level: 88, icon: '🐘' },
  { name: 'Redis', category: 'database', level: 85, icon: '◍' },
  { name: 'MongoDB', category: 'database', level: 80, icon: '◉' },
  { name: 'Supabase', category: 'database', level: 88, icon: '⚡' },
  // DevOps
  { name: 'Docker / K8s', category: 'devops', level: 82, icon: '🐳' },
  { name: 'CI/CD Pipelines', category: 'devops', level: 85, icon: '⇌' },
  { name: 'GitHub Actions', category: 'devops', level: 88, icon: '⚙' },
];

// ─── Projects ───────────────────────────────────────────────────────────────
export const projects = [
  {
    id: 1,
    title: 'NeuralFlow',
    subtitle: 'AI Workflow Automation Platform',
    description:
      'AI-powered workflow automation that connects tools, agents, and APIs with an intuitive visual builder — reducing engineering overhead by 60%.',
    longDescription:
      'NeuralFlow is a no-code/low-code platform enabling teams to build sophisticated AI workflows using drag-and-drop components. It orchestrates LLM calls, data transformations, API integrations, and decision logic in a single visual canvas.',
    tech: ['Next.js', 'Python', 'LangChain', 'PostgreSQL', 'Redis', 'AWS'],
    metrics: { users: '50K+', uptime: '99.9%', reduction: '60%', rating: '4.9★' },
    github: 'https://github.com',
    demo: 'https://demo.com',
    color: '#4facfe',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    category: 'AI/ML',
    featured: true,
    year: 2024,
    architecture: ['React Frontend', 'FastAPI Backend', 'LangGraph Orchestration', 'PostgreSQL + Redis', 'AWS ECS'],
  },
  {
    id: 2,
    title: 'ArchOS',
    subtitle: 'Distributed Cloud OS for Startups',
    description:
      'A cloud-native operating system that gives early-stage startups enterprise-grade infrastructure with zero DevOps expertise required.',
    longDescription:
      'ArchOS abstracts away the complexity of modern cloud infrastructure. It auto-provisions, auto-scales, and auto-heals containerized workloads with a beautiful dashboard and CLI.',
    tech: ['Go', 'Kubernetes', 'Terraform', 'React', 'gRPC', 'GCP'],
    metrics: { deployments: '10K+', costSaving: '40%', uptime: '99.95%', teams: '500+' },
    github: 'https://github.com',
    demo: 'https://demo.com',
    color: '#00f5d4',
    gradient: 'from-teal-500/20 to-emerald-500/20',
    category: 'Cloud',
    featured: true,
    year: 2023,
    architecture: ['Go Microservices', 'Kubernetes Operator', 'Terraform Modules', 'React Dashboard', 'gRPC APIs'],
  },
  {
    id: 3,
    title: 'Prism',
    subtitle: 'Real-time Analytics Engine',
    description:
      'Sub-100ms analytics pipeline processing millions of events per second with real-time dashboards and anomaly detection.',
    longDescription:
      'Prism is a high-throughput event processing system built on a custom streaming architecture. It ingests, transforms, and visualizes data in real-time with ML-based anomaly detection.',
    tech: ['Rust', 'Apache Kafka', 'ClickHouse', 'React', 'WebSockets', 'Docker'],
    metrics: { events: '10M/sec', latency: '<100ms', dashboards: '1000+', queries: '50K/day' },
    github: 'https://github.com',
    demo: 'https://demo.com',
    color: '#a855f7',
    gradient: 'from-purple-500/20 to-pink-500/20',
    category: 'Backend',
    featured: true,
    year: 2023,
    architecture: ['Rust Core', 'Kafka Streams', 'ClickHouse OLAP', 'React + D3 UI', 'WebSocket Gateway'],
  },
  {
    id: 4,
    title: 'Clarity AI',
    subtitle: 'Intelligent Document Intelligence',
    description:
      'Transform unstructured documents into structured knowledge with AI extraction, Q&A, and multi-modal analysis.',
    tech: ['Python', 'OpenAI', 'Pinecone', 'Next.js', 'FastAPI', 'S3'],
    metrics: { documents: '5M+', accuracy: '97.3%', customers: '200+', languages: '12' },
    github: 'https://github.com',
    demo: 'https://demo.com',
    color: '#f77f00',
    gradient: 'from-orange-500/20 to-amber-500/20',
    category: 'AI/ML',
    featured: false,
    year: 2024,
    architecture: ['FastAPI Backend', 'OpenAI GPT-4V', 'Pinecone Vector DB', 'Next.js Frontend', 'S3 Storage'],
  },
  {
    id: 5,
    title: 'Mesh',
    subtitle: 'Developer Social Network',
    description:
      'GitHub-native social platform where developers showcase work, collaborate on ideas, and build in public.',
    tech: ['Next.js', 'Supabase', 'TypeScript', 'Tailwind', 'GitHub API'],
    metrics: { members: '25K+', projects: '8K+', connections: '120K+', stars: '2.4K' },
    github: 'https://github.com',
    demo: 'https://demo.com',
    color: '#4ade80',
    gradient: 'from-green-500/20 to-emerald-500/20',
    category: 'Frontend',
    featured: false,
    year: 2022,
    architecture: ['Next.js', 'Supabase Realtime', 'Edge Functions', 'Vercel Deployment'],
  },
  {
    id: 6,
    title: 'CodeSandscape',
    subtitle: 'AI-Powered Code Review Platform',
    description:
      'Automated code review with AI explanations, security scanning, and team collaboration tools built for modern dev teams.',
    tech: ['TypeScript', 'Python', 'OpenAI', 'GitHub App', 'React', 'PostgreSQL'],
    metrics: { reviews: '500K+', bugs: '90K+', teams: '1.2K', timeSaved: '3hrs/PR' },
    github: 'https://github.com',
    demo: 'https://demo.com',
    color: '#f43f5e',
    gradient: 'from-rose-500/20 to-red-500/20',
    category: 'DevTools',
    featured: false,
    year: 2023,
    architecture: ['GitHub App', 'FastAPI Backend', 'OpenAI Analysis', 'React Dashboard'],
  },
];

// ─── Experience ──────────────────────────────────────────────────────────────
export const experience = [
  {
    company: 'Stealth AI Startup',
    role: 'Co-Founder & CTO',
    period: 'Jan 2024 – Present',
    location: 'San Francisco, CA',
    type: 'Startup',
    color: '#4facfe',
    description:
      'Building the next generation of AI infrastructure tooling. Leading technical architecture, hiring, and product vision for a team of 8 engineers.',
    highlights: [
      'Architected multi-tenant AI platform processing 50M+ API calls/month',
      'Scaled from 0 to 50K users in 6 months with 99.9% uptime',
      'Raised $2.5M seed round from top-tier VCs',
      'Built and led a team of 6 engineers across frontend, backend, and AI',
    ],
    tech: ['Next.js', 'Python', 'LangChain', 'AWS', 'PostgreSQL', 'Kubernetes'],
  },
  {
    company: 'ArchCloud Systems',
    role: 'Lead Platform Engineer',
    period: 'Mar 2022 – Dec 2023',
    location: 'Remote',
    type: 'Scale-up',
    color: '#00f5d4',
    description:
      'Led the core platform team responsible for developer tooling, infrastructure automation, and internal SDKs serving 300+ engineers.',
    highlights: [
      'Reduced deployment times by 70% by building a custom CI/CD orchestration layer',
      'Designed event-driven microservices architecture handling 1B+ events/month',
      'Mentored 8 engineers and established platform engineering best practices',
      'Open-sourced three internal tools with 5K+ GitHub stars combined',
    ],
    tech: ['Go', 'Kubernetes', 'Terraform', 'Kafka', 'gRPC', 'GCP'],
  },
  {
    company: 'DataSense Analytics',
    role: 'Senior Full-Stack Engineer',
    period: 'Jun 2020 – Feb 2022',
    location: 'New York, NY',
    type: 'Startup',
    color: '#a855f7',
    description:
      'Full-stack engineer on the core product team. Owned the real-time data visualization pipeline and led frontend architecture.',
    highlights: [
      'Built real-time analytics dashboard processing 10M events/second',
      'Reduced page load time by 65% through optimization and edge caching',
      'Led migration from REST to GraphQL, reducing API calls by 40%',
      'Implemented end-to-end testing framework achieving 95% coverage',
    ],
    tech: ['React', 'Node.js', 'GraphQL', 'ClickHouse', 'Redis', 'AWS'],
  },
  {
    company: 'Freelance & Open Source',
    role: 'Independent Engineer',
    period: 'Jan 2019 – May 2020',
    location: 'Global',
    type: 'Independent',
    color: '#f77f00',
    description:
      'Built products for early-stage startups and contributed to open-source tools in the developer ecosystem.',
    highlights: [
      'Shipped 6 production products for clients across fintech, healthtech, and edtech',
      'Contributed to React, Next.js, and Prisma open-source repositories',
      'Published 3 npm packages with 50K+ combined monthly downloads',
    ],
    tech: ['React', 'Python', 'PostgreSQL', 'Stripe', 'Vercel', 'TypeScript'],
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
    text: "Alex's ability to translate complex product requirements into scalable architecture is rare. He shipped our core AI platform in 6 weeks — what we estimated would take 6 months. His technical depth combined with product thinking makes him an exceptional engineer.",
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'VP Engineering at ArchCloud',
    avatar: 'MJ',
    rating: 5,
    color: '#00f5d4',
    text: 'Working with Alex elevated our entire platform team. He brought a systems-thinking approach that transformed how we build infrastructure. The tools he built are still powering our deployments and used daily by 300+ engineers.',
  },
  {
    id: 3,
    name: 'Priya Patel',
    role: 'Founder at ClearMind AI',
    avatar: 'PP',
    rating: 5,
    color: '#a855f7',
    text: "I've worked with many senior engineers, and Alex stands out for his combination of speed and quality. He doesn't just write code — he thinks deeply about the product, the user, and the business. That's a rare combination.",
  },
  {
    id: 4,
    name: 'David Park',
    role: 'Principal Engineer at Meta',
    avatar: 'DP',
    rating: 5,
    color: '#f77f00',
    text: "Alex's contributions to our shared codebase were outstanding — clean, well-tested, and production-ready. His pull requests often solved problems I hadn't even thought of yet. A force multiplier on any engineering team.",
  },
  {
    id: 5,
    name: 'Elena Rodriguez',
    role: 'Partner at Horizon Ventures',
    avatar: 'ER',
    rating: 5,
    color: '#4ade80',
    text: "We backed Alex's startup not just because of the product, but because of him. He has the technical ability to build what he envisions and the communication skills to articulate why it matters. Exactly what we look for in a founding CTO.",
  },
];

// ─── GitHub Stats (placeholder — connect to real GitHub API in production) ──
export const githubStats = {
  username: 'alexrivera',
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
    title: 'The Spark',
    period: '2019',
    color: '#4facfe',
    description:
      'Started building side projects obsessively — shipping 12 products in 12 months. Discovered the intersection of engineering and product thinking.',
    milestone: '12 Products Shipped',
  },
  {
    phase: '02',
    title: 'First Startup',
    period: '2020',
    color: '#a855f7',
    description:
      "Co-founded DevSync — a real-time collaboration tool for engineers. Reached 5K users before pivoting. Learned that speed of learning > speed of building.",
    milestone: '5K Users, $80K ARR',
  },
  {
    phase: '03',
    title: 'Scale & Growth',
    period: '2021–2023',
    color: '#00f5d4',
    description:
      'Joined ArchCloud as early engineer #7. Grew with the company from $2M to $15M ARR. Led platform engineering and open-sourced key infrastructure tools.',
    milestone: '$15M ARR, 300+ Engineers',
  },
  {
    phase: '04',
    title: 'AI Frontier',
    period: '2024',
    color: '#f77f00',
    description:
      "Building in stealth on next-gen AI infrastructure. $2.5M seed round raised. 50K users in 6 months. This is just the beginning.",
    milestone: '$2.5M Raised, 50K Users',
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
