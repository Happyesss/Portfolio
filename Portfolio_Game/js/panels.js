/* ========================================
   Panels — Portfolio Content Display System
   Shows About, Skills, Projects, Experience,
   Contact info when interacting with signboards
   ======================================== */
const PanelSystem = {
    isOpen: false,

    open(type) {
        const panel = document.getElementById('info-panel');
        const content = document.getElementById('panel-content');
        content.innerHTML = this.getContent(type);
        panel.classList.remove('hidden');
        this.isOpen = true;

        // Animate skill bars
        setTimeout(() => {
            document.querySelectorAll('.skill-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.level + '%';
            });
        }, 100);
    },

    close() {
        document.getElementById('info-panel').classList.add('hidden');
        this.isOpen = false;
    },

    getContent(type) {
        const contents = {
            // ============================
            // ABOUT ME
            // ============================
            about: `
                <div class="panel-header">
                    <div class="panel-icon">👨‍💻</div>
                    <div>
                        <h2 class="panel-title">ABOUT ME</h2>
                        <p class="panel-subtitle">The developer behind the code</p>
                    </div>
                </div>
                <div class="panel-body">
                    <p>Hello! I'm a passionate <strong style="color: var(--accent-cyan)">Full Stack Developer</strong> who loves building creative and interactive web experiences.</p>
                    <p>I fell in love with coding when I built my first website and realized I could turn ideas into reality with just a keyboard and imagination.</p>
                    <p>When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or playing video games (which inspired this very portfolio!).</p>
                    <p>I believe in writing <strong style="color: var(--accent-green)">clean, maintainable code</strong> and creating <strong style="color: var(--accent-magenta)">delightful user experiences</strong>.</p>
                    <div style="margin-top: 20px; padding: 15px; background: rgba(0,240,255,0.05); border-radius: 8px; border: 1px solid rgba(0,240,255,0.15);">
                        <p style="font-family: var(--pixel-font); font-size: 8px; color: var(--accent-gold); margin-bottom: 8px;">⚡ QUICK FACTS</p>
                        <p>📍 Location: Earth, Solar System</p>
                        <p>🎓 Education: Self-taught & Continuously Learning</p>
                        <p>💡 Interests: Web Dev, Game Dev, UI/UX, Open Source</p>
                        <p>🎮 Fun Fact: This portfolio IS a game!</p>
                    </div>
                </div>
            `,

            // ============================
            // SKILLS — FRONTEND
            // ============================
            skills_frontend: `
                <div class="panel-header">
                    <div class="panel-icon">🎨</div>
                    <div>
                        <h2 class="panel-title">FRONTEND SKILLS</h2>
                        <p class="panel-subtitle">Crafting beautiful interfaces</p>
                    </div>
                </div>
                <div class="panel-body">
                    <p>These are the tools I use to bring designs to life:</p>
                    <div class="skill-grid">
                        <div class="skill-tag frontend">
                            HTML5
                            <div class="skill-bar"><div class="skill-bar-fill" data-level="95" style="width:0; background: var(--accent-cyan)"></div></div>
                        </div>
                        <div class="skill-tag frontend">
                            CSS3 / SCSS
                            <div class="skill-bar"><div class="skill-bar-fill" data-level="90" style="width:0; background: var(--accent-cyan)"></div></div>
                        </div>
                        <div class="skill-tag frontend">
                            JavaScript
                            <div class="skill-bar"><div class="skill-bar-fill" data-level="90" style="width:0; background: var(--accent-cyan)"></div></div>
                        </div>
                        <div class="skill-tag frontend">
                            React.js
                            <div class="skill-bar"><div class="skill-bar-fill" data-level="85" style="width:0; background: var(--accent-cyan)"></div></div>
                        </div>
                        <div class="skill-tag frontend">
                            TypeScript
                            <div class="skill-bar"><div class="skill-bar-fill" data-level="80" style="width:0; background: var(--accent-cyan)"></div></div>
                        </div>
                        <div class="skill-tag frontend">
                            Tailwind CSS
                            <div class="skill-bar"><div class="skill-bar-fill" data-level="85" style="width:0; background: var(--accent-cyan)"></div></div>
                        </div>
                        <div class="skill-tag frontend">
                            Next.js
                            <div class="skill-bar"><div class="skill-bar-fill" data-level="75" style="width:0; background: var(--accent-cyan)"></div></div>
                        </div>
                        <div class="skill-tag frontend">
                            Canvas / WebGL
                            <div class="skill-bar"><div class="skill-bar-fill" data-level="70" style="width:0; background: var(--accent-cyan)"></div></div>
                        </div>
                    </div>
                </div>
            `,

            // ============================
            // SKILLS — BACKEND
            // ============================
            skills_backend: `
                <div class="panel-header">
                    <div class="panel-icon">⚙️</div>
                    <div>
                        <h2 class="panel-title">BACKEND & TOOLS</h2>
                        <p class="panel-subtitle">The engine room</p>
                    </div>
                </div>
                <div class="panel-body">
                    <p>Server-side technologies and development tools:</p>
                    <div class="skill-grid">
                        <div class="skill-tag backend">
                            Node.js
                            <div class="skill-bar"><div class="skill-bar-fill" data-level="85" style="width:0; background: var(--accent-green)"></div></div>
                        </div>
                        <div class="skill-tag backend">
                            Express.js
                            <div class="skill-bar"><div class="skill-bar-fill" data-level="80" style="width:0; background: var(--accent-green)"></div></div>
                        </div>
                        <div class="skill-tag backend">
                            Python
                            <div class="skill-bar"><div class="skill-bar-fill" data-level="75" style="width:0; background: var(--accent-green)"></div></div>
                        </div>
                        <div class="skill-tag backend">
                            MongoDB
                            <div class="skill-bar"><div class="skill-bar-fill" data-level="75" style="width:0; background: var(--accent-green)"></div></div>
                        </div>
                        <div class="skill-tag backend">
                            PostgreSQL
                            <div class="skill-bar"><div class="skill-bar-fill" data-level="70" style="width:0; background: var(--accent-green)"></div></div>
                        </div>
                        <div class="skill-tag tool">
                            Git / GitHub
                            <div class="skill-bar"><div class="skill-bar-fill" data-level="90" style="width:0; background: var(--accent-gold)"></div></div>
                        </div>
                        <div class="skill-tag tool">
                            Docker
                            <div class="skill-bar"><div class="skill-bar-fill" data-level="65" style="width:0; background: var(--accent-gold)"></div></div>
                        </div>
                        <div class="skill-tag tool">
                            VS Code
                            <div class="skill-bar"><div class="skill-bar-fill" data-level="95" style="width:0; background: var(--accent-gold)"></div></div>
                        </div>
                    </div>
                </div>
            `,

            // ============================
            // PROJECTS
            // ============================
            project_1: `
                <div class="panel-header">
                    <div class="panel-icon">🖥️</div>
                    <div>
                        <h2 class="panel-title">PORTFOLIO HACKER</h2>
                        <p class="panel-subtitle">Terminal-themed portfolio</p>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="project-card">
                        <p class="project-desc">A hacker-themed portfolio website with a boot sequence, terminal interface, interactive commands, and cyberpunk effects. Features real terminal emulation where visitors can type commands to explore sections.</p>
                        <div class="project-tech">
                            <span class="tech-pill">HTML5</span>
                            <span class="tech-pill">CSS3</span>
                            <span class="tech-pill">JavaScript</span>
                            <span class="tech-pill">Audio API</span>
                            <span class="tech-pill">Animations</span>
                        </div>
                    </div>
                    <p>✨ Features: Boot sequence • Terminal UI • Sound effects • Matrix rain • Typed commands • Responsive design</p>
                </div>
            `,

            project_2: `
                <div class="panel-header">
                    <div class="panel-icon">📱</div>
                    <div>
                        <h2 class="panel-title">CODE QUEST GAME</h2>
                        <p class="panel-subtitle">This very portfolio!</p>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="project-card">
                        <p class="project-desc">A 2D platformer game that doubles as a developer portfolio. Features a fully animated stickman character, 5 explorable zones, particle effects, NPC dialogues, and interactive portfolio content.</p>
                        <div class="project-tech">
                            <span class="tech-pill">Canvas API</span>
                            <span class="tech-pill">JavaScript</span>
                            <span class="tech-pill">Game Design</span>
                            <span class="tech-pill">Physics</span>
                            <span class="tech-pill">Animation</span>
                        </div>
                    </div>
                    <p>✨ Features: 2D physics • 5 zones • NPC system • Particle effects • Animated stickman • Portfolio integration</p>
                </div>
            `,

            project_3: `
                <div class="panel-header">
                    <div class="panel-icon">🌲</div>
                    <div>
                        <h2 class="panel-title">FOREST PORTFOLIO</h2>
                        <p class="panel-subtitle">Nature-inspired design</p>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="project-card">
                        <p class="project-desc">A serene, nature-themed portfolio with animated tree growth, parallax scrolling, and organic transitions. Combines calming visuals with professional content presentation.</p>
                        <div class="project-tech">
                            <span class="tech-pill">HTML5</span>
                            <span class="tech-pill">SCSS</span>
                            <span class="tech-pill">JavaScript</span>
                            <span class="tech-pill">CSS Animations</span>
                        </div>
                    </div>
                    <p>✨ Features: Tree animation • Parallax scrolling • Smooth transitions • Responsive • Organic UI</p>
                </div>
            `,

            project_4: `
                <div class="panel-header">
                    <div class="panel-icon">🚀</div>
                    <div>
                        <h2 class="panel-title">MORE PROJECTS</h2>
                        <p class="panel-subtitle">Always building something new</p>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="project-card">
                        <p class="project-name">💼 Fairlx</p>
                        <p class="project-desc">First pay-as-you-go project management tool. Designed LLD/HLD, Redis caching reducing API response times by 40%.</p>
                        <div class="project-tech">
                            <span class="tech-pill">React</span>
                            <span class="tech-pill">Spring Boot</span>
                            <span class="tech-pill">Redis</span>
                        </div>
                    </div>
                    <div class="project-card">
                        <p class="project-name">📝 Resumy</p>
                        <p class="project-desc">AI-driven resume builder with LLM APIs for ATS-optimized resumes. Serving 1000+ users.</p>
                        <div class="project-tech">
                            <span class="tech-pill">React</span>
                            <span class="tech-pill">LLM APIs</span>
                            <span class="tech-pill">Node.js</span>
                        </div>
                    </div>
                    <div class="project-card">
                        <p class="project-name">✍️ Assignme</p>
                        <p class="project-desc">Open-source assignment automation with 3.2M views. Custom handwriting fonts via FontForge.</p>
                        <div class="project-tech">
                            <span class="tech-pill">JavaScript</span>
                            <span class="tech-pill">FontForge</span>
                            <span class="tech-pill">Linux</span>
                        </div>
                    </div>
                    <div class="project-card">
                        <p class="project-name">📚 AKTU Resources</p>
                        <p class="project-desc">Academic platform with 28K+ users, #1 Google ranking, 70% organic traffic increase.</p>
                        <div class="project-tech">
                            <span class="tech-pill">React</span>
                            <span class="tech-pill">Node.js</span>
                            <span class="tech-pill">SEO</span>
                        </div>
                    </div>
                    <p style="margin-top: 16px; text-align: center; color: var(--text-dim); font-size: 12px;">
                        Check my GitHub for more: <span style="color: var(--accent-cyan)">github.com/Happyesss</span>
                    </p>
                </div>
            `,

            // ============================
            // EXPERIENCE
            // ============================
            experience: `
                <div class="panel-header">
                    <div class="panel-icon">📜</div>
                    <div>
                        <h2 class="panel-title">EXPERIENCE</h2>
                        <p class="panel-subtitle">The journey so far</p>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="timeline">
                        <div class="timeline-item">
                            <span class="timeline-date">2024 — Present</span>
                            <span class="timeline-role">Software Development Engineer</span>
                            <p class="timeline-desc">Pioneering Fairlx — first pay-as-you-go project management tool. Designing LLD/HLD, implemented Redis caching layer reducing API response times by 40%.</p>
                        </div>
                        <div class="timeline-item">
                            <span class="timeline-date">2024</span>
                            <span class="timeline-role">Creator @ Resumy</span>
                            <p class="timeline-desc">Built AI-driven resume builder serving 1000+ users with ATS-optimized resumes, cover letters, and cold emails.</p>
                        </div>
                        <div class="timeline-item">
                            <span class="timeline-date">2023 — Present</span>
                            <span class="timeline-role">Creator @ Assignme</span>
                            <p class="timeline-desc">Open-source assignment automation achieving 3.2M views in one month. Processed 3.97M HTTP requests.</p>
                        </div>
                        <div class="timeline-item">
                            <span class="timeline-date">2022 — 2023</span>
                            <span class="timeline-role">Creator @ AKTU Resources</span>
                            <p class="timeline-desc">Built academic platform with 28K+ users and 155K+ page views. #1 Google ranking with 70% organic traffic.</p>
                        </div>
                        <div class="timeline-item">
                            <span class="timeline-date">2022 — 2026</span>
                            <span class="timeline-role">B.Tech CSE (AI & ML)</span>
                            <p class="timeline-desc">JSS Academy of Technical Education, Noida. Building expertise in System Design, Microservices, and Full-Stack Development.</p>
                        </div>
                    </div>
                </div>
            `,

            // ============================
            // CONTACT
            // ============================
            contact: `
                <div class="panel-header">
                    <div class="panel-icon">📡</div>
                    <div>
                        <h2 class="panel-title">CONTACT ME</h2>
                        <p class="panel-subtitle">Let's connect!</p>
                    </div>
                </div>
                <div class="panel-body">
                    <p>Want to work together, have a question, or just say hello? Reach out through any of these channels:</p>
                    <div class="contact-grid">
                        <a class="contact-item" href="https://github.com/Happyesss" target="_blank">
                            <span class="contact-icon">🐙</span>
                            <div>
                                <p class="contact-label">GITHUB</p>
                                <p class="contact-value">github.com/Happyesss</p>
                            </div>
                        </a>
                        <a class="contact-item" href="mailto:22csaiml002@jssaten.ac.in">
                            <span class="contact-icon">📧</span>
                            <div>
                                <p class="contact-label">EMAIL</p>
                                <p class="contact-value">22csaiml002@jssaten.ac.in</p>
                            </div>
                        </a>
                        <a class="contact-item" href="https://www.linkedin.com/in/shashank-kumar-rathour-9a49b32a5/" target="_blank">
                            <span class="contact-icon">💼</span>
                            <div>
                                <p class="contact-label">LINKEDIN</p>
                                <p class="contact-value">linkedin.com/in/shashank</p>
                            </div>
                        </a>
                        <a class="contact-item" href="https://share.resumy.live/r/h0BZoQJh3r" target="_blank">
                            <span class="contact-icon">📄</span>
                            <div>
                                <p class="contact-label">RESUME</p>
                                <p class="contact-value">View My Resume</p>
                            </div>
                        </a>
                        <a class="contact-item" href="tel:+918527875164" target="_blank">
                            <span class="contact-icon">📱</span>
                            <div>
                                <p class="contact-label">PHONE</p>
                                <p class="contact-value">+91 8527875164</p>
                            </div>
                        </a>
                    </div>
                    <div style="margin-top: 24px; text-align: center; padding: 16px; background: rgba(0,240,255,0.05); border-radius: 8px; border: 1px solid rgba(0,240,255,0.15);">
                        <p style="font-family: var(--pixel-font); font-size: 8px; color: var(--accent-gold); margin-bottom: 8px;">🎮 ACHIEVEMENT UNLOCKED</p>
                        <p style="color: var(--accent-cyan);">You explored the entire portfolio game!</p>
                        <p style="color: var(--text-dim); font-size: 12px; margin-top: 8px;">Thanks for playing Code Quest. Let's build something amazing together!</p>
                    </div>
                </div>
            `,

            // ============================
            // ACHIEVEMENTS
            // ============================
            achievements: `
                <div class="panel-header">
                    <div class="panel-icon">🏆</div>
                    <div>
                        <h2 class="panel-title">ACHIEVEMENTS</h2>
                        <p class="panel-subtitle">Milestones & certifications</p>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="project-card">
                        <p class="project-name">🎓 Self-Taught Developer</p>
                        <p class="project-desc">Learned full-stack development through dedication and countless hours of practice.</p>
                    </div>
                    <div class="project-card">
                        <p class="project-name">🌟 Creative Portfolio Trilogy</p>
                        <p class="project-desc">Built 3 unique portfolio websites: Forest theme, Hacker terminal, and this Game world.</p>
                    </div>
                    <div class="project-card">
                        <p class="project-name">🤝 Open Source Contributor</p>
                        <p class="project-desc">Active contributor to open-source projects on GitHub.</p>
                    </div>
                    <div class="project-card">
                        <p class="project-name">🎮 Game Developer</p>
                        <p class="project-desc">Built a full 2D platformer game with physics, animations, and storytelling — all in vanilla JavaScript!</p>
                    </div>
                </div>
            `
        };

        return contents[type] || '<p style="color: var(--text-dim)">Content not found...</p>';
    }
};
