/* ========================================
   HUD — Manages the in-game heads-up display
   ======================================== */
class HUDSystem {
    constructor() {
        this.questTexts = [
            'Explore the village and talk to the Old Compiler...',
            'Climb the Skill Mountains and discover your abilities...',
            'Enter the Project Factory and view your creations...',
            'Cross the Experience Bridge carefully...',
            'Climb the Contact Tower to send a signal!'
        ];
    }

    show() {
        document.getElementById('hud').classList.remove('hidden');
    }

    hide() {
        document.getElementById('hud').classList.add('hidden');
    }

    updateZone(index) {
        const infos = [
            { name: 'Spawn Village', icon: '🏠' },
            { name: 'Skill Mountains', icon: '⛰️' },
            { name: 'Project Factory', icon: '🏭' },
            { name: 'Experience Bridge', icon: '🌉' },
            { name: 'Contact Tower', icon: '🗼' }
        ];

        const info = infos[index] || infos[0];
        document.getElementById('zone-name').textContent = info.name;
        document.querySelector('.zone-icon').textContent = info.icon;
        document.getElementById('quest-text').textContent = this.questTexts[index] || '';

        // Update progress dots
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.remove('active', 'completed');
            if (i < index) dot.classList.add('completed');
            if (i === index) dot.classList.add('active');
        });
    }
}
