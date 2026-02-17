/* ═══════════════════════════════════════════════════════
   SECTIONS.JS — Portfolio Content Sections
   Each function returns HTML to render in terminal
   ═══════════════════════════════════════════════════════ */

const Sections = (() => {

    /* ═══════ WHOAMI — About Me ═══════ */
    function whoami() {
        return `
<div class="ascii-art">
 ██╗    ██╗██╗  ██╗ ██████╗  █████╗ ███╗   ███╗██╗
 ██║    ██║██║  ██║██╔═══██╗██╔══██╗████╗ ████║██║
 ██║ █╗ ██║███████║██║   ██║███████║██╔████╔██║██║
 ██║███╗██║██╔══██║██║   ██║██╔══██║██║╚██╔╝██║██║
 ╚███╔███╔╝██║  ██║╚██████╔╝██║  ██║██║ ╚═╝ ██║██║
  ╚══╝╚══╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝
</div>
<br>
<span class="info-line">┌─────────────────────────────────────────────────────────┐</span>
<span class="info-line">│  <span class="highlight">Name:</span>       Shashank Kumar Rathour                     │</span>
<span class="info-line">│  <span class="highlight">Role:</span>       Full-Stack Developer & Tech Enthusiast      │</span>
<span class="info-line">│  <span class="highlight">Location:</span>   Noida, India                                │</span>
<span class="info-line">│  <span class="highlight">Education:</span>  B.Tech CSE (AI & ML) - JSS Academy          │</span>
<span class="info-line">│  <span class="highlight">Status:</span>     Available for opportunities                  │</span>
<span class="info-line">│  <span class="highlight">Uptime:</span>     ${getUptime()}                              │</span>
<span class="info-line">├─────────────────────────────────────────────────────────┤</span>
<span class="info-line">│  2+ years in software development, specializing in      │</span>
<span class="info-line">│  web applications. Passionate about building scalable   │</span>
<span class="info-line">│  platforms, AI-driven tools, and academic resources.    │</span>
<span class="info-line">│  Planting ideas, growing solutions, coding a greener    │</span>
<span class="info-line">│  tomorrow.                                              │</span>
<span class="info-line">└─────────────────────────────────────────────────────────┘</span>
<br>
<span class="dim-line">  -> Type <span class="highlight">cat skills.txt</span> to see my skills</span>
<span class="dim-line">  -> Type <span class="highlight">ls projects/</span> to see my work</span>`;
    }

    /* ═══════ SKILLS ═══════ */
    function skills() {
        return `
<span class="info-line">╔══════════════════════════════════════════╗</span>
<span class="info-line">║   <span class="highlight">SKILL MATRIX - cat skills.txt</span>         ║</span>
<span class="info-line">╚══════════════════════════════════════════╝</span>
<br>
<span class="info-line">  -- LANGUAGES --</span>
<div class="skill-bar-container"><span class="skill-name">  Java</span><div class="skill-bar"><div class="skill-bar-fill" style="width:88%"></div></div><span class="skill-percent">88%</span></div>
<div class="skill-bar-container"><span class="skill-name">  JavaScript</span><div class="skill-bar"><div class="skill-bar-fill" style="width:90%"></div></div><span class="skill-percent">90%</span></div>
<div class="skill-bar-container"><span class="skill-name">  TypeScript</span><div class="skill-bar"><div class="skill-bar-fill" style="width:82%"></div></div><span class="skill-percent">82%</span></div>
<div class="skill-bar-container"><span class="skill-name">  C</span><div class="skill-bar"><div class="skill-bar-fill" style="width:75%"></div></div><span class="skill-percent">75%</span></div>
<div class="skill-bar-container"><span class="skill-name">  HTML/CSS</span><div class="skill-bar"><div class="skill-bar-fill" style="width:93%"></div></div><span class="skill-percent">93%</span></div>

<span class="info-line">  -- FRAMEWORKS --</span>
<div class="skill-bar-container"><span class="skill-name">  React</span><div class="skill-bar"><div class="skill-bar-fill" style="width:88%"></div></div><span class="skill-percent">88%</span></div>
<div class="skill-bar-container"><span class="skill-name">  TailwindCSS</span><div class="skill-bar"><div class="skill-bar-fill" style="width:90%"></div></div><span class="skill-percent">90%</span></div>
<div class="skill-bar-container"><span class="skill-name">  Redux</span><div class="skill-bar"><div class="skill-bar-fill" style="width:80%"></div></div><span class="skill-percent">80%</span></div>
<div class="skill-bar-container"><span class="skill-name">  Spring Boot</span><div class="skill-bar"><div class="skill-bar-fill" style="width:78%"></div></div><span class="skill-percent">78%</span></div>
<div class="skill-bar-container"><span class="skill-name">  Three.js</span><div class="skill-bar"><div class="skill-bar-fill" style="width:75%"></div></div><span class="skill-percent">75%</span></div>

<span class="info-line">  -- DATABASES --</span>
<div class="skill-bar-container"><span class="skill-name">  MySQL</span><div class="skill-bar"><div class="skill-bar-fill" style="width:82%"></div></div><span class="skill-percent">82%</span></div>
<div class="skill-bar-container"><span class="skill-name">  MongoDB</span><div class="skill-bar"><div class="skill-bar-fill" style="width:85%"></div></div><span class="skill-percent">85%</span></div>

<span class="info-line">  -- TOOLS --</span>
<div class="skill-bar-container"><span class="skill-name">  Git</span><div class="skill-bar"><div class="skill-bar-fill" style="width:90%"></div></div><span class="skill-percent">90%</span></div>
<div class="skill-bar-container"><span class="skill-name">  Linux</span><div class="skill-bar"><div class="skill-bar-fill" style="width:85%"></div></div><span class="skill-percent">85%</span></div>
<div class="skill-bar-container"><span class="skill-name">  Docker</span><div class="skill-bar"><div class="skill-bar-fill" style="width:78%"></div></div><span class="skill-percent">78%</span></div>
<div class="skill-bar-container"><span class="skill-name">  Azure</span><div class="skill-bar"><div class="skill-bar-fill" style="width:72%"></div></div><span class="skill-percent">72%</span></div>`;
    }

    /* ═══════ PROJECTS ═══════ */
    function projects() {
        const projectList = [
            {
                name: 'Fairlx',
                desc: 'First-ever project management tool with pay-as-you-go model. Designed LLD/HLD, implemented Redis caching layer reducing API response times by 40%.',
                tech: ['React', 'Spring Boot', 'Redis', 'Azure'],
                link: 'https://fairlx.com/',
                status: 'Live'
            },
            {
                name: 'Resumy',
                desc: 'AI-driven resume generation tool using LLM APIs for ATS-optimized resumes, cover letters, and cold emails. Serving 1000+ users.',
                tech: ['React', 'Node.js', 'LLM APIs', 'TailwindCSS'],
                link: 'https://resumy.live/',
                status: 'Live'
            },
            {
                name: 'Assignme',
                desc: 'Open-source assignment automation tool with custom handwriting fonts. Achieved 3.2M views in one month with 3.97M HTTP requests.',
                tech: ['JavaScript', 'FontForge', 'Linux'],
                link: 'https://assignme.pages.dev/',
                status: 'Live'
            },
            {
                name: 'AKTU-Resources',
                desc: 'Academic resource platform for AKTU students. Achieved 28K+ users, 155K+ page views in 4 months, #1 Google ranking.',
                tech: ['React', 'Node.js', 'MongoDB', 'SEO'],
                link: 'https://aktu-resources.me/',
                status: 'Live'
            }
        ];

        let html = `
<span class="info-line">╔══════════════════════════════════════════════════════╗</span>
<span class="info-line">║   <span class="highlight">ls projects/ - Project Directory</span>                  ║</span>
<span class="info-line">╚══════════════════════════════════════════════════════╝</span>
<br>
<span class="success-line">total ${projectList.length} projects found</span>
<span class="dim-line">drwxr-xr-x  shashank  dev  4096  Feb 12  ./projects/</span>
<br>`;

        projectList.forEach((p, i) => {
            const statusColor = p.status === 'Live' ? 'success-line' : (p.status === 'Discontinued' ? 'error-line' : 'warn-line');
            html += `
<div class="project-card">
  <div class="project-name">${p.name} <span class="${statusColor}" style="font-size:0.85em">[${p.status}]</span></div>
  <div class="project-desc">${p.desc}</div>
  <div class="project-tech">${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
</div>`;
        });

        html += `<br>
<span class="dim-line">  - Type <span class="highlight">cat projects/fairlx</span> for project details</span>
<span class="dim-line">  - Type <span class="highlight">open &lt;project-name&gt;</span> to visit live site</span>`;
        return html;
    }

    /* ═══════ CONTACT ═══════ */
    function contact() {
        return `
<span class="info-line">╔══════════════════════════════════════════════════════╗</span>
<span class="info-line">║   <span class="highlight">cat contact.txt - Reach Out</span>                      ║</span>
<span class="info-line">╚══════════════════════════════════════════════════════╝</span>
<br>
<span class="output-line">  ┌─────────────────────────────────────────────────┐</span>
<span class="output-line">  │                                                 │</span>
<span class="output-line">  │  Email    -> <a class="link" href="mailto:shashankkumarrathour2004@gmail.com">shashankkumarrathour2004@gmail.com</a></span>
<span class="output-line">  │  Phone    -> +91 8527875164                     │</span>
<span class="output-line">  │  GitHub   -> <a class="link" href="https://github.com/Happyesss" target="_blank">github.com/Happyesss</a>               │</span>
<span class="output-line">  │  LinkedIn -> <a class="link" href="https://www.linkedin.com/in/shashank-kumar-rathour-9a49b32a5" target="_blank">linkedin.com/in/shashank-kumar</a>      │</span>
<span class="output-line">  │  Resume   -> <a class="link" href="https://share.resumy.live/r/h0BZoQJh3r" target="_blank">share.resumy.live/r/h0BZoQJh3r</a>     │</span>
<span class="output-line">  │  Insta    -> <a class="link" href="https://www.instagram.com/" target="_blank">instagram.com</a>                      │</span>
<span class="output-line">  │  Website  -> <a class="link" href="https://my-portfolio-forest.netlify.app/" target="_blank">my-portfolio-forest.netlify.app</a>    │</span>
<span class="output-line">  │                                                 │</span>
<span class="output-line">  └─────────────────────────────────────────────────┘</span>
<br>
<span class="dim-line">  Let's build something awesome together!</span>`;
    }

    /* ═══════ NEOFETCH ═══════ */
    function neofetch() {
        const now = new Date();
        return `
<span class="info-line">                    .---.</span>
<span class="info-line">                   /     \\</span>
<span class="info-line">                  |  o o  |</span>          <span class="highlight">shashank</span>@<span class="highlight">shadow_root</span>
<span class="info-line">                  |  ___  |</span>          ---------------------
<span class="info-line">                   \\_____/</span>           <span class="highlight">OS:</span>       ShadowRoot OS 1.0 x86_64
<span class="info-line">              _____/     \\_____</span>      <span class="highlight">Host:</span>     Noida, India
<span class="info-line">             |  ___________  |</span>      <span class="highlight">Kernel:</span>   6.6.6-shadow
<span class="info-line">             | |           | |</span>      <span class="highlight">Uptime:</span>   ${getUptime()}
<span class="info-line">             | |  SHADOW   | |</span>      <span class="highlight">Shell:</span>    zsh 5.9
<span class="info-line">             | |   ROOT    | |</span>      <span class="highlight">DE:</span>       Hacker Theme
<span class="info-line">             | |___________| |</span>      <span class="highlight">Terminal:</span> shadow-term v1.0
<span class="info-line">             |_______________|</span>      <span class="highlight">CPU:</span>      Full-Stack Dev @ 100%
<span class="info-line">              /    /   \\    \\</span>       <span class="highlight">GPU:</span>      Three.js WebGL Renderer
<span class="info-line">             /    /     \\    \\</span>      <span class="highlight">Memory:</span>   Projects: 15 | Users: 42K+
<span class="info-line">            /____/       \\____\\</span>     <span class="highlight">Stack:</span>    React, Java, Spring Boot
<br>
<span style="color:#ff0040">###</span><span style="color:#ff6600">###</span><span style="color:#ffcc00">###</span><span style="color:#00ff41">###</span><span style="color:#00e5ff">###</span><span style="color:#3366ff">###</span><span style="color:#b388ff">###</span><span style="color:#ffffff">###</span>`;
    }

    /* ═══════ EXPERIENCE / RESUME ═══════ */
    function experience() {
        return `
<span class="info-line">╔══════════════════════════════════════════════════════╗</span>
<span class="info-line">║   <span class="highlight">cat experience.log - Journey So Far</span>              ║</span>
<span class="info-line">╚══════════════════════════════════════════════════════╝</span>
<br>
<span class="success-line">  > Software Development Engineer @ Stemlen</span>
<span class="dim-line">    2024 - Present</span>
<span class="output-line">    Pioneered Fairlx - first pay-as-you-go project management tool.</span>
<span class="output-line">    Designed LLD/HLD, implemented Redis caching (40% faster APIs).</span>
<br>
<span class="success-line">  > Creator @ Resumy</span>
<span class="dim-line">    2024 - Present</span>
<span class="output-line">    AI-driven resume builder serving 1000+ users.</span>
<span class="output-line">    Live at <a class="link" href="https://resumy.live" target="_blank">resumy.live</a></span>
<br>
<span class="success-line">  > Creator @ Assignme</span>
<span class="dim-line">    2023 - Present</span>
<span class="output-line">    Assignment automation tool with 3.2M views in one month.</span>
<span class="output-line">    Live at <a class="link" href="https://assignme.pages.dev" target="_blank">assignme.pages.dev</a></span>
<br>
<span class="success-line">  > Creator @ AKTU Resources</span>
<span class="dim-line">    2022 - 2023</span>
<span class="output-line">    Built academic resource platform for AKTU students.</span>
<span class="output-line">    Gained 28,000+ active users before shutdown.</span>
<br>
<span class="success-line">  > Full-Stack Developer (Independent)</span>
<span class="dim-line">    2022 - Present</span>
<span class="output-line">    2+ years building scalable web apps & AI-driven tools.</span>
<span class="output-line">    15 projects completed. 160,000+ site visits.</span>`;
    }

    /* ═══════ EDUCATION ═══════ */
    function education() {
        return `
<span class="info-line">╔══════════════════════════════════════════════════════╗</span>
<span class="info-line">║   <span class="highlight">cat education.txt</span>                                 ║</span>
<span class="info-line">╚══════════════════════════════════════════════════════╝</span>
<br>
<span class="success-line">  > B.Tech Computer Science (AI & ML)</span>
<span class="dim-line">    JSS Academy of Technical Education, Noida</span>
<span class="output-line">    Focus: Artificial Intelligence & Machine Learning</span>
<br>
<span class="info-line">  -- TECH STACK --</span>
<span class="output-line">  * Java, C, JavaScript, TypeScript</span>
<span class="output-line">  * React, Redux, TailwindCSS, Spring Boot</span>
<span class="output-line">  * MySQL, MongoDB</span>
<span class="output-line">  * Git, Linux, Docker, Azure</span>`;
    }

    /* ═══════ UTILITIES ═══════ */
    function getUptime() {
        const start = new Date('2024-01-01');
        const now = new Date();
        const diff = now - start;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return `${days} days, ${hours} hours`;
    }

    return {
        whoami,
        skills,
        projects,
        contact,
        neofetch,
        experience,
        education,
        getUptime
    };
})();
