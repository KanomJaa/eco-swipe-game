// ========================================
// Background particles (molecules/atoms)
// ========================================
class ScienceParticles {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init(count = 40) {
        const colors = [
            'rgba(0,255,136,0.4)',
            'rgba(0,212,255,0.35)',
            'rgba(127,90,240,0.3)',
            'rgba(45,212,191,0.3)',
        ];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                color: colors[Math.floor(Math.random() * colors.length)],
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.015 + 0.005,
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.pulse += p.pulseSpeed;
            if (p.x < -10) p.x = this.canvas.width + 10;
            if (p.x > this.canvas.width + 10) p.x = -10;
            if (p.y < -10) p.y = this.canvas.height + 10;
            if (p.y > this.canvas.height + 10) p.y = -10;

            const alpha = 0.3 + 0.3 * Math.sin(p.pulse);
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = p.size * 4;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// Main App
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Init particles
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ps = new ScienceParticles(canvas);
        ps.init(35);
        ps.animate();
    }

    const loadingScreen = document.getElementById('loading-screen');
    const registerScreen = document.getElementById('register-screen');

    const form = document.getElementById('nickname-form');
    const input = document.getElementById('nickname-input');
    const charCount = document.getElementById('char-count');
    const errorMsg = document.getElementById('error-msg');
    const inputWrapper = document.getElementById('input-wrapper');

    const avatarModal = document.getElementById('avatar-modal');
    const rowMale = document.getElementById('avatar-row-male');
    const rowFemale = document.getElementById('avatar-row-female');
    const btnConfirmAvatar = document.getElementById('btn-confirm-avatar');

    let selectedAvatar = 'icons/male_1.png';
    let pendingNickname = '';

    function getPlayerId() {
        let pid = localStorage.getItem('eco_player_id');
        if (!pid) {
            pid = 'p_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
            localStorage.setItem('eco_player_id', pid);
        }
        return pid;
    }

    // Check if already registered via Device Token
    try {
        const res = await fetch(`/api/player?playerId=${getPlayerId()}&t=${Date.now()}`);
        const data = await res.json();

        if (data.registered && data.nickname) {
            sessionStorage.setItem('playerNickname', data.nickname);
            sessionStorage.setItem('playerAvatar', data.avatar || 'icons/male_1.png');
            // Auto redirect registered player to game
            if (!window.location.search.includes('edit=1')) {
                window.location.href = '/game.html';
                return;
            }
            input.value = data.nickname;
            charCount.textContent = `${data.nickname.length}/16`;
            if (data.avatar) selectedAvatar = data.avatar;
        } else {
            sessionStorage.clear();
        }
    } catch (err) {
        console.error('Failed to check player:', err);
    }

    // Show register form
    loadingScreen.style.display = 'none';
    registerScreen.style.display = 'flex';

    // Populate avatars
    let activeAvatarEl = null;

    function initAvatarGrid() {
        rowMale.innerHTML = '';
        rowFemale.innerHTML = '';

        for (let i = 1; i <= 7; i++) {
            const path = `icons/male_${i}.png`;
            const el = createAvatarItem(path);
            if (path === selectedAvatar) {
                el.classList.add('active');
                activeAvatarEl = el;
            }
            rowMale.appendChild(el);
        }

        for (let i = 1; i <= 7; i++) {
            const path = `icons/female_${i}.png`;
            const el = createAvatarItem(path);
            if (path === selectedAvatar) {
                el.classList.add('active');
                activeAvatarEl = el;
            }
            rowFemale.appendChild(el);
        }
    }

    function createAvatarItem(path) {
        const item = document.createElement('div');
        item.className = 'avatar-item';
        item.dataset.path = path;
        item.innerHTML = `<img src="/${path}" alt="Avatar" loading="lazy">`;

        const selectThis = (e) => {
            if (e) e.preventDefault();
            if (activeAvatarEl) activeAvatarEl.classList.remove('active');
            item.classList.add('active');
            activeAvatarEl = item;
            selectedAvatar = path;
        };

        item.addEventListener('click', selectThis);
        return item;
    }

    initAvatarGrid();

    input.addEventListener('input', () => {
        charCount.textContent = `${input.value.length}/16`;
        errorMsg.classList.remove('visible');
        inputWrapper.classList.remove('error');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nickname = input.value.trim();

        if (!nickname || nickname.length < 2) {
            showError('ชื่อต้องมีอย่างน้อย 2 ตัวอักษร 🧪');
            return;
        }

        pendingNickname = nickname;
        avatarModal.style.display = 'flex';
    });

    btnConfirmAvatar.addEventListener('click', async () => {
        if (!pendingNickname) return;
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: getPlayerId(), nickname: pendingNickname, avatar: selectedAvatar }),
            });
            const data = await res.json();

            if (data.success) {
                sessionStorage.removeItem('lastGameSummary');
                sessionStorage.setItem('playerNickname', data.nickname);
                sessionStorage.setItem('playerAvatar', data.avatar);
                if (navigator.vibrate) navigator.vibrate([50, 50, 100]);
                window.location.href = '/game.html';
            } else {
                avatarModal.style.display = 'none';
                showError(data.error || 'เกิดข้อผิดพลาด');
            }
        } catch (err) {
            avatarModal.style.display = 'none';
            showError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
        }
    });

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.classList.add('visible');
        inputWrapper.classList.add('error');
        input.focus();
        if (navigator.vibrate) navigator.vibrate(100);
    }
});
