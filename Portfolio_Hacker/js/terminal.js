/* ═══════════════════════════════════════════════════════
   TERMINAL.JS — Terminal Emulator Component
   Handles input, output, typewriter effect, hack anim
   ═══════════════════════════════════════════════════════ */

const Terminal = (() => {
    let inputEl, outputEl;
    let isProcessing = false;
    const PROMPT_HTML = '<span class="prompt-text">┌──(root㉿shadow_root)-[~]\n└─$ </span>';

    function init() {
        inputEl = document.getElementById('terminal-input');
        outputEl = document.getElementById('terminal-output');
        if (!inputEl || !outputEl) return;

        // Focus input when clicking anywhere in terminal
        document.getElementById('terminal-container').addEventListener('click', () => inputEl.focus());

        // Also: clicking anywhere on the page focuses the terminal
        document.addEventListener('click', () => inputEl.focus());

        // Key events
        inputEl.addEventListener('keydown', handleKeyDown);
        inputEl.addEventListener('input', () => Audio.keyClick());

        showWelcome();
    }

    /* ═══════ WELCOME MESSAGE ═══════ */
    function showWelcome() {
        const welcome = `
<div class="ascii-art" style="color: var(--green-primary);">
███████╗██╗  ██╗ █████╗ ███████╗██╗  ██╗ █████╗ ███╗   ██╗██╗  ██╗
██╔════╝██║  ██║██╔══██╗██╔════╝██║  ██║██╔══██╗████╗  ██║██║ ██╔╝
███████╗███████║███████║███████╗███████║███████║██╔██╗ ██║█████╔╝ 
╚════██║██╔══██║██╔══██║╚════██║██╔══██║██╔══██║██║╚██╗██║██╔═██╗ 
███████║██║  ██║██║  ██║███████║██║  ██║██║  ██║██║ ╚████║██║  ██╗
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
</div>
<br>
<span class="info-line">  ═══════════════════════════════════════════</span>
<span class="output-line">  Welcome to <span class="highlight">SHASHANK's</span> Portfolio v1.0</span>
<span class="output-line">  Type <span class="highlight">help</span> for all commands.</span>
<span class="output-line">  See the <span class="highlight">guide</span> panel (top-right).</span>
<span class="info-line">  ═══════════════════════════════════════════</span>
<br>
<span class="dim-line">  Last login: ${new Date().toUTCString()} from 127.0.0.1</span>
<span class="dim-line">  System ready. Awaiting commands...</span>
<br>`;
        appendOutput(welcome);
    }

    /* ═══════ KEY HANDLER ═══════ */
    function handleKeyDown(e) {
        if (isProcessing) { e.preventDefault(); return; }

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                processInput();
                break;
            case 'ArrowUp':
                e.preventDefault();
                navigateHistory(-1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                navigateHistory(1);
                break;
            case 'Tab':
                e.preventDefault();
                tabComplete();
                break;
            case 'l':
                if (e.ctrlKey) { e.preventDefault(); clearTerminal(); }
                break;
            case 'c':
                if (e.ctrlKey) {
                    e.preventDefault();
                    inputEl.value = '';
                    appendOutput(`${PROMPT_HTML}<span class="cmd-text">^C</span>`);
                }
                break;
        }
    }

    /* ═══════ PROCESS INPUT ═══════ */
    async function processInput() {
        const value = inputEl.value.trim();
        inputEl.value = '';

        appendOutput(`<div class="cmd-line">${PROMPT_HTML}<span class="cmd-text">${escapeHtml(value)}</span></div>`);
        Audio.enterKey();

        if (!value) return;

        const result = Commands.process(value);

        if (result === '__CLEAR__') { clearTerminal(); return; }
        if (result === '__HACK__')  { await hackAnimation(); return; }

        if (result) {
            isProcessing = true;
            await typewriterOutput(result);
            isProcessing = false;
        }

        scrollToBottom();
        inputEl.focus();
    }

    /* ═══════ TYPEWRITER OUTPUT ═══════ */
    function typewriterOutput(html) {
        return new Promise(resolve => {
            const container = document.createElement('div');
            container.className = 'output-line';
            outputEl.appendChild(container);

            const chars = html.split('');
            let i = 0, buffer = '', inTag = false;

            function type() {
                const chunk = 10;
                for (let c = 0; c < chunk && i < chars.length; c++, i++) {
                    buffer += chars[i];
                    if (chars[i] === '<') inTag = true;
                    if (chars[i] === '>') inTag = false;
                    if (!inTag && (i % 4 === 0 || i === chars.length - 1)) {
                        container.innerHTML = buffer;
                        scrollToBottom();
                    }
                }
                if (i < chars.length) requestAnimationFrame(type);
                else { container.innerHTML = buffer; scrollToBottom(); resolve(); }
            }
            requestAnimationFrame(type);
        });
    }

    /* ═══════ HACK ANIMATION ═══════ */
    function hackAnimation() {
        return new Promise(async resolve => {
            isProcessing = true;
            Audio.hackSound();
            Effects.matrixIntensify(8000);
            Scene3D.flashScreen();

            const phases = [
                { text: '<span class="warn-line">⚡ Initializing hack sequence...</span>', delay: 400 },
                { text: '<span class="output-line">[▓░░░░░░░░░░░░░░░░░░░] 5%  — Scanning target...</span>', delay: 300 },
                { text: '<span class="output-line">[▓▓▓░░░░░░░░░░░░░░░░░] 15% — Bypassing firewall...</span>', delay: 300 },
                { text: '<span class="output-line">[▓▓▓▓▓░░░░░░░░░░░░░░░] 25% — Injecting payload...</span>', delay: 250 },
                { text: '<span class="output-line">[▓▓▓▓▓▓▓░░░░░░░░░░░░░] 35% — Cracking encryption...</span>', delay: 300 },
                { text: '<span class="output-line">[▓▓▓▓▓▓▓▓▓░░░░░░░░░░░] 45% — Exploiting vuln...</span>', delay: 250 },
                { text: '<span class="output-line">[▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░] 55% — Escalating privs...</span>', delay: 300 },
                { text: '<span class="output-line">[▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░] 65% — Downloading data...</span>', delay: 250 },
                { text: '<span class="output-line">[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░] 75% — Covering tracks...</span>', delay: 300 },
                { text: '<span class="output-line">[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░] 85% — Backdoor ready...</span>', delay: 250 },
                { text: '<span class="output-line">[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░] 95% — Cleaning logs...</span>', delay: 300 },
                { text: '<span class="output-line">[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100% — Complete!</span>', delay: 200 },
            ];

            for (const phase of phases) {
                appendOutput(phase.text);
                Effects.screenFlicker();
                scrollToBottom();
                await sleep(phase.delay);
            }

            appendOutput('<br><span class="dim-line">═══ INTERCEPTED DATA ═══</span>');
            for (let i = 0; i < 5; i++) {
                let hex = '';
                for (let j = 0; j < 6; j++) {
                    hex += Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0') + ' ';
                }
                appendOutput(`<span class="dim-line">0x${(i*32).toString(16).padStart(8,'0')}: ${hex}</span>`);
                await sleep(50);
            }

            Effects.triggerGlitch(null, 2000);
            appendOutput(`<br>
<span class="success-line">╔════════════════════════════════════╗</span>
<span class="success-line">║  ✅ ACCESS GRANTED — HACK DONE   ║</span>
<span class="success-line">╚════════════════════════════════════╝</span>
<br>
<span class="dim-line">  Just kidding — this is a portfolio! 😄</span>`);

            scrollToBottom();
            isProcessing = false;
            resolve();
        });
    }

    /* ═══════ HISTORY NAVIGATION ═══════ */
    function navigateHistory(dir) {
        const h = Commands.getHistory();
        let idx = Commands.getHistoryIndex() + dir;
        if (idx < 0) idx = 0;
        if (idx >= h.length) { idx = h.length; inputEl.value = ''; Commands.setHistoryIndex(idx); return; }
        inputEl.value = h[idx] || '';
        Commands.setHistoryIndex(idx);
    }

    /* ═══════ TAB COMPLETION ═══════ */
    function tabComplete() {
        const parts = inputEl.value.split(/\s+/);
        const last = parts[parts.length - 1];
        if (!last) return;
        const completions = Commands.getCompletions(last);
        if (completions.length === 1) {
            parts[parts.length - 1] = completions[0];
            inputEl.value = parts.join(' ');
        } else if (completions.length > 1) {
            appendOutput(`<span class="dim-line">${completions.join('  ')}</span>`);
            scrollToBottom();
        }
    }

    /* ═══════ UTILITIES ═══════ */
    function appendOutput(html) {
        const div = document.createElement('div');
        div.className = 'output-line';
        div.innerHTML = html;
        outputEl.appendChild(div);
        scrollToBottom();
    }

    function clearTerminal() { outputEl.innerHTML = ''; }

    function scrollToBottom() { outputEl.scrollTop = outputEl.scrollHeight; }

    function escapeHtml(text) {
        const d = document.createElement('div');
        d.textContent = text;
        return d.innerHTML;
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    return { init, appendOutput, clearTerminal };
})();
