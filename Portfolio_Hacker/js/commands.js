/* ═══════════════════════════════════════════════════════
   COMMANDS.JS — Command Definitions & Handler
   Linux-style commands that reveal portfolio sections
   ═══════════════════════════════════════════════════════ */

const Commands = (() => {

    const commandHistory = [];
    let historyIndex = -1;

    /* ═══════ COMMAND REGISTRY ═══════ */
    const registry = {

        // ── Navigation Commands ──
        'help': {
            desc: 'Show all available commands',
            handler: () => helpOutput()
        },
        'whoami': {
            desc: 'Display personal info',
            handler: () => Sections.whoami()
        },
        'ls': {
            desc: 'List directory contents',
            handler: (args) => lsCommand(args)
        },
        'cat': {
            desc: 'Display file contents',
            handler: (args) => catCommand(args)
        },
        'cd': {
            desc: 'Change directory',
            handler: (args) => cdCommand(args)
        },
        'pwd': {
            desc: 'Print working directory',
            handler: () => '<span class="output-line">/root/portfolio</span>'
        },

        // ── System Commands ──
        'clear': {
            desc: 'Clear the terminal',
            handler: () => '__CLEAR__'
        },
        'neofetch': {
            desc: 'System information',
            handler: () => Sections.neofetch()
        },
        'history': {
            desc: 'Show command history',
            handler: () => historyOutput()
        },
        'date': {
            desc: 'Show current date',
            handler: () => `<span class="output-line">${new Date().toString()}</span>`
        },
        'uptime': {
            desc: 'Show system uptime',
            handler: () => `<span class="output-line">up ${Sections.getUptime()}, 1 user, load average: 0.42, 0.31, 0.28</span>`
        },
        'uname': {
            desc: 'System name',
            handler: (args) => {
                if (args.includes('-a')) {
                    return '<span class="output-line">ShadowRoot 6.6.6-shadow x86_64 GNU/Linux</span>';
                }
                return '<span class="output-line">ShadowRoot</span>';
            }
        },
        'echo': {
            desc: 'Echo text',
            handler: (args) => `<span class="output-line">${args.join(' ')}</span>`
        },
        'whoami --verbose': {
            desc: 'Detailed about me',
            handler: () => Sections.whoami()
        },

        // ── Portfolio Commands ──
        'open': {
            desc: 'Open a project',
            handler: (args) => openProject(args)
        },
        'resume': {
            desc: 'View my experience',
            handler: () => Sections.experience()
        },
        'experience': {
            desc: 'View work history',
            handler: () => Sections.experience()
        },
        'education': {
            desc: 'View education',
            handler: () => Sections.education()
        },

        // ── Fun Commands ──
        'matrix': {
            desc: 'Toggle matrix rain effect',
            handler: () => {
                Effects.matrixIntensify(5000);
                return '<span class="success-line">☠ Matrix rain intensified for 5 seconds...</span>';
            }
        },
        'hack': {
            desc: 'Run hack animation',
            handler: () => '__HACK__'
        },
        'glitch': {
            desc: 'Trigger glitch effect',
            handler: () => {
                Effects.triggerGlitch(null, 3000);
                Effects.screenFlicker();
                Scene3D.flashScreen();
                return '<span class="warn-line">⚠ VISUAL CORRUPTION DETECTED — glitch.exe running...</span>';
            }
        },
        'sudo': {
            desc: 'Run as superuser',
            handler: (args) => sudoCommand(args)
        },
        'rm': {
            desc: 'Remove files',
            handler: (args) => rmCommand(args)
        },
        'ping': {
            desc: 'Ping a host',
            handler: (args) => pingCommand(args)
        },
        'nmap': {
            desc: 'Network scan',
            handler: (args) => nmapCommand(args)
        },
        'cowsay': {
            desc: 'Cow says...',
            handler: (args) => cowsayCommand(args)
        },
        'fortune': {
            desc: 'Random hacker quote',
            handler: () => fortuneCommand()
        },
        'man': {
            desc: 'Manual page',
            handler: (args) => manCommand(args)
        },
        'sound': {
            desc: 'Toggle sound effects',
            handler: () => {
                const on = Audio.toggle();
                return `<span class="info-line">🔊 Sound effects: ${on ? '<span class="success-line">ON</span>' : '<span class="error-line">OFF</span>'}</span>`;
            }
        },
        'tree': {
            desc: 'Display directory tree',
            handler: () => treeCommand()
        },
        'figlet': {
            desc: 'ASCII text art',
            handler: (args) => figletCommand(args)
        },
        'exit': {
            desc: 'Nice try 😈',
            handler: () => '<span class="error-line">ERROR: There is no escape from the Matrix.</span>'
        },
        'logout': {
            desc: 'Attempt logout',
            handler: () => '<span class="error-line">ERROR: You are in too deep. There is no going back.</span>'
        },
    };

    /* ═══════ PROCESS COMMAND ═══════ */
    function process(input) {
        const trimmed = input.trim();
        if (!trimmed) return '';

        commandHistory.push(trimmed);
        historyIndex = commandHistory.length;

        const parts = trimmed.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Check sudo prefix
        if (cmd === 'sudo' && args.length > 0) {
            return sudoCommand(args);
        }

        // Check registry
        if (registry[cmd]) {
            return registry[cmd].handler(args);
        }

        // Check for full command string match (like "sudo rm -rf /")
        if (registry[trimmed.toLowerCase()]) {
            return registry[trimmed.toLowerCase()].handler([]);
        }

        // Unknown command
        Audio.error();
        return `<span class="error-line">bash: ${cmd}: command not found</span>
<span class="dim-line">Type <span class="highlight">help</span> to see available commands.</span>`;
    }

    /* ═══════ HELP OUTPUT ═══════ */
    function helpOutput() {
        let html = `
<span class="info-line">╔═══════════════════════════════════════════════════════════╗</span>
<span class="info-line">║   <span class="highlight">⚡ AVAILABLE COMMANDS — shadow_root terminal v1.0</span>     ║</span>
<span class="info-line">╚═══════════════════════════════════════════════════════════╝</span>
<br>
<span class="info-line">  ── 📂 NAVIGATION ──────────────────────────────────────</span>
<span class="output-line">  <span class="highlight">whoami</span>          About me — who is shadow_root?</span>
<span class="output-line">  <span class="highlight">cat skills.txt</span>  My technical skills & proficiencies</span>
<span class="output-line">  <span class="highlight">ls projects/</span>    Browse my project portfolio</span>
<span class="output-line">  <span class="highlight">cat contact.txt</span> Contact information & social links</span>
<span class="output-line">  <span class="highlight">resume</span>          View work experience</span>
<span class="output-line">  <span class="highlight">education</span>       View education & certifications</span>
<span class="output-line">  <span class="highlight">open &lt;name&gt;</span>     Open a specific project</span>
<br>
<span class="info-line">  ── 🔧 SYSTEM ──────────────────────────────────────────</span>
<span class="output-line">  <span class="highlight">help</span>            Show this help menu</span>
<span class="output-line">  <span class="highlight">clear</span>           Clear terminal screen</span>
<span class="output-line">  <span class="highlight">neofetch</span>        Display system information</span>
<span class="output-line">  <span class="highlight">history</span>         Show command history</span>
<span class="output-line">  <span class="highlight">pwd</span>             Print working directory</span>
<span class="output-line">  <span class="highlight">date</span>            Show current date & time</span>
<span class="output-line">  <span class="highlight">uptime</span>          Show system uptime</span>
<span class="output-line">  <span class="highlight">tree</span>            Show directory tree</span>
<span class="output-line">  <span class="highlight">sound</span>           Toggle sound effects</span>
<br>
<span class="info-line">  ── 🎮 FUN ─────────────────────────────────────────────</span>
<span class="output-line">  <span class="highlight">matrix</span>          Intensify matrix rain</span>
<span class="output-line">  <span class="highlight">hack</span>            Run hacking animation</span>
<span class="output-line">  <span class="highlight">glitch</span>          Trigger visual glitch</span>
<span class="output-line">  <span class="highlight">cowsay &lt;text&gt;</span>   Make a cow say something</span>
<span class="output-line">  <span class="highlight">fortune</span>         Random hacker quote</span>
<span class="output-line">  <span class="highlight">figlet &lt;text&gt;</span>   Generate ASCII text art</span>
<span class="output-line">  <span class="highlight">ping &lt;host&gt;</span>     Ping a host</span>
<span class="output-line">  <span class="highlight">nmap &lt;target&gt;</span>   Simulated network scan</span>
<span class="output-line">  <span class="highlight">sudo rm -rf /</span>   Try it... if you dare 😈</span>
<br>
<span class="dim-line">  💡 Use ↑/↓ arrows to navigate command history</span>
<span class="dim-line">  💡 Press Tab for auto-completion</span>`;
        return html;
    }

    /* ═══════ LS COMMAND ═══════ */
    function lsCommand(args) {
        const path = args[0] || '';
        if (path.startsWith('projects') || path.startsWith('./projects') || path === '-la') {
            return Sections.projects();
        }
        return `
<span class="info-line">drwxr-xr-x  root  root  4096  Feb 12  <span class="highlight">projects/</span></span>
<span class="output-line">-rw-r--r--  root  root  2048  Feb 12  <span class="highlight">skills.txt</span></span>
<span class="output-line">-rw-r--r--  root  root  1024  Feb 12  <span class="highlight">contact.txt</span></span>
<span class="output-line">-rw-r--r--  root  root  3072  Feb 12  <span class="highlight">experience.log</span></span>
<span class="output-line">-rw-r--r--  root  root   512  Feb 12  <span class="highlight">education.txt</span></span>
<span class="output-line">-rw-r--r--  root  root   256  Feb 12  <span class="highlight">README.md</span></span>
<span class="output-line">-rwx------  root  root   666  Feb 12  <span class="error-line">.secrets</span></span>
<br>
<span class="dim-line">  → Use <span class="highlight">cat &lt;filename&gt;</span> to read a file</span>
<span class="dim-line">  → Use <span class="highlight">ls projects/</span> to browse projects</span>`;
    }

    /* ═══════ CAT COMMAND ═══════ */
    function catCommand(args) {
        if (!args.length) return '<span class="error-line">cat: missing operand</span>';
        const file = args[0].toLowerCase();
        
        if (file.includes('skills')) return Sections.skills();
        if (file.includes('contact')) return Sections.contact();
        if (file.includes('experience')) return Sections.experience();
        if (file.includes('education')) return Sections.education();
        if (file.includes('fairlx')) return openProject(['fairlx']);
        if (file.includes('resumy')) return openProject(['resumy']);
        if (file.includes('assignme')) return openProject(['assignme']);
        if (file.includes('aktu')) return openProject(['aktu-resources']);
        if (file.includes('readme')) return `
<span class="info-line"># SHADOW_ROOT Portfolio</span>
<span class="output-line">Welcome to Shashank's digital fortress.</span>
<span class="output-line">Type <span class="highlight">help</span> to explore.</span>`;
        if (file.includes('.secrets') || file.includes('secret')) {
            Audio.error();
            return '<span class="error-line">cat: .secrets: Permission denied (try sudo)</span>';
        }
        return `<span class="error-line">cat: ${args[0]}: No such file or directory</span>`;
    }

    /* ═══════ CD COMMAND ═══════ */
    function cdCommand(args) {
        if (!args.length || args[0] === '~') return '<span class="output-line">~</span>';
        if (args[0] === 'projects' || args[0] === 'projects/') {
            return Sections.projects();
        }
        return `<span class="error-line">cd: ${args[0]}: Not a directory</span>`;
    }

    /* ═══════ SUDO COMMAND ═══════ */
    function sudoCommand(args) {
        const full = args.join(' ').toLowerCase();
        
        if (full.includes('rm') && full.includes('-rf') && full.includes('/')) {
            Effects.triggerGlitch(null, 5000);
            Effects.matrixIntensify(5000);
            Scene3D.flashScreen();
            Audio.hackSound();
            return `
<span class="error-line">☠☠☠ CRITICAL SYSTEM ERROR ☠☠☠</span>
<span class="error-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="error-line">Attempting to delete root filesystem...</span>
<span class="warn-line">rm: it is dangerous to operate recursively on '/'</span>
<span class="warn-line">rm: use --no-preserve-root to override this failsafe</span>
<br>
<span class="success-line">Just kidding 😈 This is a portfolio, not a real system!</span>
<span class="success-line">But nice try... I see you like to live dangerously.</span>
<br>
<span class="dim-line">Pro tip: Try <span class="highlight">hack</span> for something actually cool.</span>`;
        }

        if (full.includes('cat') && full.includes('.secret')) {
            return `
<span class="warn-line">[sudo] password for root: ********</span>
<span class="success-line">Access granted.</span>
<br>
<span class="info-line">╔══════════════════════════════════════╗</span>
<span class="info-line">║   🔐 CLASSIFIED — .secrets          ║</span>
<span class="info-line">╚══════════════════════════════════════╝</span>
<br>
<span class="output-line">  • Favorite editor: Vim (sorry, VSCode fans)</span>
<span class="output-line">  • Coffee type: Black, no sugar (like my terminal)</span>
<span class="output-line">  • Tabs vs Spaces: Tabs. Fight me.</span>
<span class="output-line">  • Favorite OS: Arch Linux (btw, I use Arch)</span>
<span class="output-line">  • Secret hobby: Competitive CTF hacking</span>
<span class="output-line">  • Fun fact: This entire site is a terminal</span>`;
        }

        // Generic sudo
        return `<span class="warn-line">[sudo] password for root: ********</span>
<span class="output-line">Running: ${args.join(' ')}</span>`;
    }

    /* ═══════ RM COMMAND ═══════ */
    function rmCommand(args) {
        const full = args.join(' ').toLowerCase();
        if (full.includes('-rf') && full.includes('/')) {
            return sudoCommand(['rm', ...args]);
        }
        return `<span class="error-line">rm: cannot remove: Permission denied (try sudo)</span>`;
    }

    /* ═══════ PING COMMAND ═══════ */
    function pingCommand(args) {
        const host = args[0] || 'localhost';
        return `
<span class="output-line">PING ${host} (127.0.0.1) 56(84) bytes of data.</span>
<span class="output-line">64 bytes from ${host}: icmp_seq=1 ttl=64 time=${(Math.random() * 10).toFixed(1)} ms</span>
<span class="output-line">64 bytes from ${host}: icmp_seq=2 ttl=64 time=${(Math.random() * 10).toFixed(1)} ms</span>
<span class="output-line">64 bytes from ${host}: icmp_seq=3 ttl=64 time=${(Math.random() * 10).toFixed(1)} ms</span>
<span class="output-line">64 bytes from ${host}: icmp_seq=4 ttl=64 time=${(Math.random() * 10).toFixed(1)} ms</span>
<br>
<span class="output-line">--- ${host} ping statistics ---</span>
<span class="output-line">4 packets transmitted, 4 received, 0% packet loss</span>
<span class="success-line">rtt min/avg/max = ${(Math.random() * 3).toFixed(1)}/${(Math.random() * 5 + 2).toFixed(1)}/${(Math.random() * 10 + 5).toFixed(1)} ms</span>`;
    }

    /* ═══════ NMAP COMMAND ═══════ */
    function nmapCommand(args) {
        const target = args[0] || 'localhost';
        Audio.hackSound();
        return `
<span class="output-line">Starting Nmap 7.94 ( https://nmap.org )</span>
<span class="output-line">Nmap scan report for ${target}</span>
<span class="output-line">Host is up (0.0013s latency).</span>
<br>
<span class="output-line">PORT      STATE    SERVICE        VERSION</span>
<span class="success-line">22/tcp    open     ssh            OpenSSH 9.1</span>
<span class="success-line">80/tcp    open     http           nginx 1.24</span>
<span class="success-line">443/tcp   open     https          nginx 1.24</span>
<span class="warn-line">3000/tcp  filtered nodejs         Node.js v20</span>
<span class="success-line">8080/tcp  open     http-proxy     Squid 5.7</span>
<span class="error-line">31337/tcp open     Elite          SHADOW_ROOT_OS</span>
<br>
<span class="dim-line">Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds</span>`;
    }

    /* ═══════ COWSAY COMMAND ═══════ */
    function cowsayCommand(args) {
        const text = args.length ? args.join(' ') : 'Moo! Type help for commands';
        const border = '─'.repeat(text.length + 2);
        return `<pre class="ascii-art">
 ┌${border}┐
 │ ${text} │
 └${border}┘
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
</pre>`;
    }

    /* ═══════ FORTUNE COMMAND ═══════ */
    function fortuneCommand() {
        const quotes = [
            '"The only way to do great work is to love what you do." — Steve Jobs',
            '"Talk is cheap. Show me the code." — Linus Torvalds',
            '"First, solve the problem. Then, write the code." — John Johnson',
            '"Any sufficiently advanced technology is indistinguishable from magic." — Arthur C. Clarke',
            '"The best way to predict the future is to invent it." — Alan Kay',
            '"It\'s not a bug, it\'s a feature." — Every developer ever',
            '"There are only two hard things in CS: cache invalidation and naming things." — Phil Karlton',
            '"In a world of locked rooms, the man with the key is king." — Sherlock',
            '"Hack the planet!" — Hackers (1995)',
            '"I\'m in." — Every movie hacker after pressing 3 keys',
            '"sudo make me a sandwich" — xkcd',
            '"There is no cloud, it\'s just someone else\'s computer."',
        ];
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        return `<span class="info-line">🔮 ${quote}</span>`;
    }

    /* ═══════ MAN COMMAND ═══════ */
    function manCommand(args) {
        if (!args.length) return '<span class="error-line">What manual page do you want?</span>';
        const cmd = args[0].toLowerCase();
        if (registry[cmd]) {
            return `
<span class="info-line">NAME</span>
<span class="output-line">    ${cmd} — ${registry[cmd].desc}</span>
<br>
<span class="info-line">SYNOPSIS</span>
<span class="output-line">    ${cmd} [options] [arguments]</span>
<br>
<span class="info-line">DESCRIPTION</span>
<span class="output-line">    Part of the SHADOW_ROOT portfolio terminal.</span>
<span class="output-line">    Type <span class="highlight">help</span> for a full command list.</span>`;
        }
        return `<span class="error-line">No manual entry for ${cmd}</span>`;
    }

    /* ═══════ TREE COMMAND ═══════ */
    function treeCommand() {
        return `
<span class="info-line">/root/portfolio</span>
<span class="output-line">├── projects/</span>
<span class="output-line">│   ├── Fairlx/</span>
<span class="output-line">│   ├── Resumy/</span>
<span class="output-line">│   ├── Assignme/</span>
<span class="output-line">│   └── AKTU-Resources/</span>
<span class="output-line">├── skills.txt</span>
<span class="output-line">├── contact.txt</span>
<span class="output-line">├── experience.log</span>
<span class="output-line">├── education.txt</span>
<span class="output-line">├── README.md</span>
<span class="output-line">└── <span class="error-line">.secrets</span></span>
<br>
<span class="dim-line">4 directories, 5 files, 1 hidden</span>`;
    }

    /* ═══════ OPEN PROJECT ═══════ */
    function openProject(args) {
        if (!args.length) return '<span class="error-line">open: missing project name</span>';
        const name = args.join(' ').toLowerCase();
        
        const projectDetails = {
            'fairlx': `
<span class="info-line">╔══════════════════════════════════════╗</span>
<span class="info-line">║   Fairlx - Project Details           ║</span>
<span class="info-line">╚══════════════════════════════════════╝</span>
<br>
<span class="output-line">  First-ever project management tool with pay-as-you-go</span>
<span class="output-line">  model. Designed LLD/HLD, implemented Redis caching</span>
<span class="output-line">  layer reducing API response times by 40%.</span>
<br>
<span class="info-line">  Stack:</span> React, Spring Boot, Redis, Azure
<span class="info-line">  Status:</span> <span class="success-line">Live</span>
<span class="info-line">  Link:</span> <a class="link" href="https://fairlx.com/" target="_blank">fairlx.com</a>`,

            'resumy': `
<span class="info-line">╔══════════════════════════════════════╗</span>
<span class="info-line">║   Resumy - Project Details           ║</span>
<span class="info-line">╚══════════════════════════════════════╝</span>
<br>
<span class="output-line">  AI-driven resume generation tool using LLM APIs</span>
<span class="output-line">  for ATS-optimized resumes, cover letters, and</span>
<span class="output-line">  cold emails. Serving 1000+ users with real-time previews.</span>
<br>
<span class="info-line">  Stack:</span> React, Node.js, LLM APIs, TailwindCSS
<span class="info-line">  Status:</span> <span class="success-line">Live</span>
<span class="info-line">  Link:</span> <a class="link" href="https://resumy.live/" target="_blank">resumy.live</a>`,

            'assignme': `
<span class="info-line">╔══════════════════════════════════════╗</span>
<span class="info-line">║   Assignme - Project Details         ║</span>
<span class="info-line">╚══════════════════════════════════════╝</span>
<br>
<span class="output-line">  Open-source assignment automation tool with custom</span>
<span class="output-line">  handwriting fonts using FontForge. Achieved 3.2M views</span>
<span class="output-line">  in one month with 3.97M HTTP requests.</span>
<br>
<span class="info-line">  Stack:</span> JavaScript, FontForge, Linux
<span class="info-line">  Status:</span> <span class="success-line">Live</span>
<span class="info-line">  Link:</span> <a class="link" href="https://assignme.pages.dev/" target="_blank">assignme.pages.dev</a>`,

            'aktu-resources': `
<span class="info-line">╔══════════════════════════════════════╗</span>
<span class="info-line">║   AKTU Resources - Project Details   ║</span>
<span class="info-line">╚══════════════════════════════════════╝</span>
<br>
<span class="output-line">  Academic resource platform for AKTU students. Achieved</span>
<span class="output-line">  28K+ users, 155K+ page views in 4 months, #1 Google</span>
<span class="output-line">  ranking with 70% organic traffic increase.</span>
<br>
<span class="info-line">  Stack:</span> React, Node.js, MongoDB, SEO
<span class="info-line">  Status:</span> <span class="success-line">Live</span>
<span class="info-line">  Link:</span> <a class="link" href="https://aktu-resources.me/" target="_blank">aktu-resources.me</a>`,

            'aktu': `
<span class="info-line">╔══════════════════════════════════════╗</span>
<span class="info-line">║   AKTU Resources - Project Details   ║</span>
<span class="info-line">╚══════════════════════════════════════╝</span>
<br>
<span class="output-line">  Academic resource platform for AKTU students. Achieved</span>
<span class="output-line">  28K+ users, 155K+ page views in 4 months, #1 Google</span>
<span class="output-line">  ranking with 70% organic traffic increase.</span>
<br>
<span class="info-line">  Stack:</span> React, Node.js, MongoDB, SEO
<span class="info-line">  Status:</span> <span class="success-line">Live</span>
<span class="info-line">  Link:</span> <a class="link" href="https://aktu-resources.me/" target="_blank">aktu-resources.me</a>`,
        };

        const key = Object.keys(projectDetails).find(k => name.includes(k));
        if (key) return projectDetails[key];
        
        return `<span class="error-line">open: project '${args.join(' ')}' not found</span>
<span class="dim-line">Available: fairlx, resumy, assignme, aktu-resources</span>`;
    }

    /* ═══════ FIGLET COMMAND ═══════ */
    function figletCommand(args) {
        const text = args.join(' ') || 'HELLO';
        // Simple block letter generator
        const letters = {
            'A': ['  █  ', ' █ █ ', '█████', '█   █', '█   █'],
            'B': ['████ ', '█   █', '████ ', '█   █', '████ '],
            'C': [' ████', '█    ', '█    ', '█    ', ' ████'],
            'D': ['████ ', '█   █', '█   █', '█   █', '████ '],
            'E': ['█████', '█    ', '████ ', '█    ', '█████'],
            'F': ['█████', '█    ', '████ ', '█    ', '█    '],
            'G': [' ████', '█    ', '█  ██', '█   █', ' ████'],
            'H': ['█   █', '█   █', '█████', '█   █', '█   █'],
            'I': ['█████', '  █  ', '  █  ', '  █  ', '█████'],
            'K': ['█  █ ', '█ █  ', '██   ', '█ █  ', '█  █ '],
            'L': ['█    ', '█    ', '█    ', '█    ', '█████'],
            'M': ['█   █', '██ ██', '█ █ █', '█   █', '█   █'],
            'N': ['█   █', '██  █', '█ █ █', '█  ██', '█   █'],
            'O': [' ███ ', '█   █', '█   █', '█   █', ' ███ '],
            'R': ['████ ', '█   █', '████ ', '█ █  ', '█  █ '],
            'S': [' ████', '█    ', ' ███ ', '    █', '████ '],
            'T': ['█████', '  █  ', '  █  ', '  █  ', '  █  '],
            'W': ['█   █', '█   █', '█ █ █', '██ ██', '█   █'],
            'X': ['█   █', ' █ █ ', '  █  ', ' █ █ ', '█   █'],
            ' ': ['     ', '     ', '     ', '     ', '     '],
        };

        const lines = ['', '', '', '', ''];
        for (const char of text.toUpperCase()) {
            const l = letters[char] || letters[' '];
            for (let i = 0; i < 5; i++) {
                lines[i] += l[i] + ' ';
            }
        }
        return `<pre class="ascii-art">${lines.join('\n')}</pre>`;
    }

    /* ═══════ HISTORY ═══════ */
    function historyOutput() {
        if (!commandHistory.length) return '<span class="dim-line">No commands in history yet.</span>';
        return commandHistory.map((cmd, i) =>
            `<span class="output-line">  ${String(i + 1).padStart(4)}  ${cmd}</span>`
        ).join('\n');
    }

    function getHistory() { return commandHistory; }
    function getHistoryIndex() { return historyIndex; }
    function setHistoryIndex(i) { historyIndex = i; }

    /* ═══════ TAB COMPLETION ═══════ */
    function getCompletions(partial) {
        const cmds = Object.keys(registry);
        const files = ['skills.txt', 'contact.txt', 'experience.log', 'education.txt', 'README.md', '.secrets', 'projects/'];
        const all = [...cmds, ...files];
        return all.filter(c => c.startsWith(partial.toLowerCase()));
    }

    return {
        process,
        getHistory,
        getHistoryIndex,
        setHistoryIndex,
        getCompletions,
        registry
    };
})();
