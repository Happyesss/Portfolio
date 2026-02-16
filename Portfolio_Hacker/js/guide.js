/* ═══════════════════════════════════════════════════════
   GUIDE.JS — Guide Panel Component (Top Right)
   Collapsible help panel with clickable commands
   ═══════════════════════════════════════════════════════ */

const Guide = (() => {
    let isCollapsed = false;

    function init() {
        const toggle = document.getElementById('guide-toggle');
        const content = document.getElementById('guide-content');
        const header = document.querySelector('.guide-header');

        if (toggle && content) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePanel();
            });
            header.addEventListener('click', togglePanel);
        }

        // Make guide commands clickable — auto-type into terminal
        document.querySelectorAll('.guide-cmd code').forEach(code => {
            code.addEventListener('click', (e) => {
                e.stopPropagation();
                const cmd = code.textContent;
                const input = document.getElementById('terminal-input');
                if (input) {
                    input.value = cmd;
                    input.focus();
                    // Trigger enter
                    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
                    input.dispatchEvent(event);
                }
            });
        });
    }

    function togglePanel() {
        const content = document.getElementById('guide-content');
        const toggle = document.getElementById('guide-toggle');
        if (!content || !toggle) return;

        isCollapsed = !isCollapsed;
        content.classList.toggle('collapsed', isCollapsed);
        toggle.textContent = isCollapsed ? '☐' : '━';
    }

    function show() {
        const panel = document.getElementById('guide-panel');
        if (panel) {
            panel.style.display = 'block';
            panel.classList.add('fade-in');
        }
    }

    function hide() {
        const panel = document.getElementById('guide-panel');
        if (panel) panel.style.display = 'none';
    }

    return { init, show, hide, togglePanel };
})();
