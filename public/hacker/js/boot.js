/* ═══════════════════════════════════════════════════════
   BOOT.JS — Boot Sequence Animation
   ═══════════════════════════════════════════════════════ */

const Boot = (() => {
    const bootMessages = [
        { text: '[    0.000000] SHADOW_ROOT BIOS v3.37 initializing...', cls: 'info' },
        { text: '[    0.001337] CPU: HackerCore x86_64 @ 4.2GHz (8 cores)', cls: '' },
        { text: '[    0.002000] Memory: 32768MB DDR5 detected', cls: '' },
        { text: '[    0.003000] ACPI: RSDP 0x00000000000E0000', cls: 'dim' },
        { text: '[    0.004500] PCI: Using configuration type 1', cls: 'dim' },
        { text: '[    0.006000] Loading kernel modules...', cls: '' },
        { text: '[    0.008000]   ├── [<span class="ok">  OK  </span>] crypto.ko', cls: '' },
        { text: '[    0.010000]   ├── [<span class="ok">  OK  </span>] network.ko', cls: '' },
        { text: '[    0.012000]   ├── [<span class="ok">  OK  </span>] gpu_driver.ko', cls: '' },
        { text: '[    0.013000]   ├── [<span class="ok">  OK  </span>] three_js_renderer.ko', cls: '' },
        { text: '[    0.014500]   ├── [<span class="ok">  OK  </span>] terminal_emulator.ko', cls: '' },
        { text: '[    0.015000]   └── [<span class="ok">  OK  </span>] portfolio_data.ko', cls: '' },
        { text: '[    0.018000] Mounting encrypted filesystem...', cls: '' },
        { text: '[    0.020000]   /dev/sda1 → /root/portfolio        [<span class="ok">MOUNTED</span>]', cls: '' },
        { text: '[    0.022000]   /dev/sda2 → /root/projects         [<span class="ok">MOUNTED</span>]', cls: '' },
        { text: '[    0.024000]   /dev/sda3 → /root/secrets          [<span class="warn">LOCKED</span>]', cls: '' },
        { text: '[    0.026000] Network: Establishing secure tunnel...', cls: '' },
        { text: '[    0.030000]   ├── TOR node connected              [<span class="ok">  OK  </span>]', cls: '' },
        { text: '[    0.032000]   ├── VPN layer 1 (Switzerland)       [<span class="ok">  OK  </span>]', cls: '' },
        { text: '[    0.034000]   ├── VPN layer 2 (Iceland)           [<span class="ok">  OK  </span>]', cls: '' },
        { text: '[    0.035000]   └── Proxy chain established         [<span class="ok">  OK  </span>]', cls: '' },
        { text: '[    0.038000] Firewall: iptables rules loaded (1337 rules)', cls: '' },
        { text: '[    0.040000] IDS/IPS: Intrusion detection active', cls: 'info' },
        { text: '[    0.042000] GPU: Initializing Three.js renderer...', cls: '' },
        { text: '[    0.045000]   WebGL 2.0 context created           [<span class="ok">  OK  </span>]', cls: '' },
        { text: '[    0.048000]   3D scene compiled                   [<span class="ok">  OK  </span>]', cls: '' },
        { text: '[    0.050000] Starting services...', cls: 'info' },
        { text: '[    0.052000]   systemctl start portfolio.service   [<span class="ok">ACTIVE</span>]', cls: '' },
        { text: '[    0.054000]   systemctl start terminal.service    [<span class="ok">ACTIVE</span>]', cls: '' },
        { text: '[    0.056000]   systemctl start effects.service     [<span class="ok">ACTIVE</span>]', cls: '' },
        { text: '', cls: '' },
        { text: '  ███████╗██╗  ██╗ █████╗ ██████╗  ██████╗ ██╗    ██╗', cls: 'info' },
        { text: '  ██╔════╝██║  ██║██╔══██╗██╔══██╗██╔═══██╗██║    ██║', cls: 'info' },
        { text: '  ███████╗███████║███████║██║  ██║██║   ██║██║ █╗ ██║', cls: 'info' },
        { text: '  ╚════██║██╔══██║██╔══██║██║  ██║██║   ██║██║███╗██║', cls: 'info' },
        { text: '  ███████║██║  ██║██║  ██║██████╔╝╚██████╔╝╚███╔███╔╝', cls: 'info' },
        { text: '  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝  ╚══╝╚══╝ ', cls: 'info' },
        { text: '', cls: '' },
        { text: '  [SYSTEM READY] Welcome to SHADOW_ROOT OS v1.0', cls: 'ok' },
        { text: '  Type "help" to see available commands.', cls: '' },
    ];

    async function run() {
        const bootScreen = document.getElementById('boot-screen');
        const bootLog = document.getElementById('boot-log');
        const progressBar = document.getElementById('boot-progress-bar');
        const bootPrompt = document.getElementById('boot-prompt');

        if (!bootScreen || !bootLog) return;

        // Play boot beep
        setTimeout(() => Audio.bootBeep(), 200);

        for (let i = 0; i < bootMessages.length; i++) {
            const msg = bootMessages[i];
            const line = document.createElement('div');
            line.className = 'log-line';
            if (msg.cls) line.classList.add(msg.cls);
            line.innerHTML = msg.text;
            bootLog.appendChild(line);
            bootLog.scrollTop = bootLog.scrollHeight;

            // Update progress
            const progress = ((i + 1) / bootMessages.length) * 100;
            if (progressBar) progressBar.style.width = progress + '%';

            // Variable delay for drama
            const delay = msg.text === '' ? 100 : (30 + Math.random() * 50);
            await sleep(delay);
        }

        // Show "press any key" prompt
        if (bootPrompt) bootPrompt.style.display = 'block';

        // Wait for keypress or click
        return new Promise(resolve => {
            const handler = () => {
                document.removeEventListener('keydown', handler);
                document.removeEventListener('click', handler);
                
                Audio.enterKey();
                bootScreen.classList.add('boot-exit');
                
                setTimeout(() => {
                    bootScreen.style.display = 'none';
                    document.getElementById('main-scene').style.display = 'block';
                    resolve();
                }, 800);
            };
            document.addEventListener('keydown', handler);
            document.addEventListener('click', handler);
        });
    }

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    return { run };
})();
