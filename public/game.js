// ========================================
// Item Dataset
// ========================================
const ITEMS = [
    // ♻️ Recyclable
    { name: 'กระดาษ A4', emoji: '📄', type: 'recycle', hint: 'กระดาษขาว' },
    { name: 'กระป๋องอลูมิเนียม', emoji: '🥫', type: 'recycle', hint: 'โลหะ' },
    { name: 'ขวดแก้ว', emoji: '🍶', type: 'recycle', hint: 'แก้วใส' },
    { name: 'กล่องกระดาษ', emoji: '📦', type: 'recycle', hint: 'กระดาษลูกฟูก' },
    { name: 'หนังสือพิมพ์', emoji: '📰', type: 'recycle', hint: 'กระดาษ' },
    { name: 'ถุงพลาสติก', emoji: '🛍️', type: 'recycle', hint: 'พลาสติก HDPE' },
    { name: 'ขวดน้ำ', emoji: '💧', type: 'recycle', hint: 'พลาสติกใส', icon: 'icons/water_bottle.png' },
    { name: 'ลวดโลหะ', emoji: '🔩', type: 'recycle', hint: 'โลหะ' },
    { name: 'แก้วพลาสติก', emoji: '🥤', type: 'recycle', hint: 'พลาสติก PP' },
    { name: 'กระดาษลัง', emoji: '🗃️', type: 'recycle', hint: 'กระดาษแข็ง' },
    { name: 'ช้อนสแตนเลส', emoji: '🥄', type: 'recycle', hint: 'โลหะ' },
    { name: 'เศษผ้า', emoji: '👕', type: 'recycle', hint: 'สิ่งทอ' },
    { name: 'ถาดอาหารพลาสติก', emoji: '🍱', type: 'recycle', hint: 'พลาสติก' },
    { name: 'กล่องถนอมอาหาร', emoji: '🍱', type: 'recycle', hint: 'พลาสติก PP', icon: 'icons/Plastic Food Tupperware Box.png' },
    { name: 'แผ่น CD / DVD', emoji: '💿', type: 'recycle', hint: 'โพลีคาร์บอเนต', icon: 'icons/CD DVD Disc.png' },
    { name: 'ยางรถยนต์เก่า', emoji: '🛞', type: 'recycle', hint: 'ยางสังเคราะห์', icon: 'icons/Rubber Car Tire.png' },
    // ☢️ Hazardous
    { name: 'แบตเตอรี่', emoji: '🔋', type: 'hazard', hint: 'สารตะกั่ว-กรด', icon: 'icons/battery.png' },
    { name: 'หลอดฟลูออเรสเซนต์', emoji: '💡', type: 'hazard', hint: 'มีปรอท' },
    { name: 'น้ำยาฟอกขาว', emoji: '🧪', type: 'hazard', hint: 'สารเคมีกัดกร่อน', icon: 'icons/bleach.png' },
    { name: 'น้ำยาล้างเล็บ', emoji: '💅', type: 'hazard', hint: 'สารระเหยไวไฟ', icon: 'icons/Nail Polish Remover.png' },
    { name: 'ถังแก๊สหุงต้ม', emoji: '🧺', type: 'hazard', hint: 'แก๊สอัดความดัน', icon: 'icons/LPG Cooking Gas Cylinder.png' },
    { name: 'ไฟแช็กแก๊ส', emoji: '🪔', type: 'hazard', hint: 'วัตถุไวไฟ', icon: 'icons/Gas Lighter.png' },
    { name: 'ยาเบื่อหนู', emoji: '☠️', type: 'hazard', hint: 'สารพิษร้ายแรง', icon: 'icons/Rat Poison Chemicals.png' },
    { name: 'ยาหมดอายุ', emoji: '💊', type: 'hazard', hint: 'สารเคมีตกค้าง' },
    { name: 'สีทาบ้าน', emoji: '🎨', type: 'hazard', hint: 'สารระเหย VOC', icon: 'icons/paint.png' },
    { name: 'น้ำมันเครื่อง', emoji: '🛢️', type: 'hazard', hint: 'ปิโตรเลียม', icon: 'icons/engine_oil.png' },
    { name: 'ยาฆ่าแมลง', emoji: '🐛', type: 'hazard', hint: 'สารพิษ', icon: 'icons/pesticide.png' },
    { name: 'กระป๋องสเปรย์', emoji: '🧯', type: 'hazard', hint: 'แก๊สอัดความดัน' },
    { name: 'ถ่านไฟฉาย', emoji: '🔋', type: 'hazard', hint: 'โลหะหนัก' },
    { name: 'หมึกพิมพ์', emoji: '🖨️', type: 'hazard', hint: 'สารเคมี', icon: 'icons/ink_cartridge.png' },
    { name: 'ทินเนอร์', emoji: '⚗️', type: 'hazard', hint: 'ตัวทำละลาย' },
    { name: 'กรดแบตเตอรี่', emoji: '🧫', type: 'hazard', hint: 'กรดซัลฟิวริก' },
    { name: 'ปรอทจากเทอร์โมมิเตอร์', emoji: '🌡️', type: 'hazard', hint: 'โลหะหนัก' },
    { name: 'ขยะอิเล็กทรอนิกส์', emoji: '📱', type: 'hazard', hint: 'มีตะกั่ว-ปรอท' },
    { name: 'น้ำยาล้างห้องน้ำ', emoji: '🚽', type: 'hazard', hint: 'กรด-ด่าง', icon: 'icons/toilet_cleaner.png' },
    { name: 'กาวเรซิน', emoji: '🧴', type: 'hazard', hint: 'สารเคมีเป็นพิษ', icon: 'icons/resin_glue.png' },
    { name: 'แอลกอฮอล์ทำความสะอาด', emoji: '🧹', type: 'hazard', hint: 'ไวไฟ', icon: 'icons/alcohol.png' },
];

// ========================================
// Constants
// ========================================
const GAME_DURATION = 60;
const BASE_SCORE = 10;
const WRONG_PENALTY = -100;
const COMBO_THRESHOLDS = [
    { streak: 10, multiplier: 5 },
    { streak: 6, multiplier: 3 },
    { streak: 3, multiplier: 2 },
    { streak: 0, multiplier: 1 },
];

// ========================================
// State
// ========================================
let state = {
    score: 0, combo: 0, maxCombo: 0, correct: 0, wrong: 0, lives: 3,
    timeLeft: GAME_DURATION, isPlaying: false, currentItem: null,
    usedItems: [], timerInterval: null,
};

// ========================================
// DOM
// ========================================
const $ = (id) => document.getElementById(id);
const hudScore = $('hud-score');
const hudLives = $('hud-lives');
const hudTimer = $('hud-timer');
const hudCombo = $('hud-combo');
const timerFill = $('timer-fill');
const itemCard = $('item-card');
const itemEmoji = $('item-emoji');
const itemName = $('item-name');
const itemHint = $('item-hint');
const binLeft = $('bin-left');
const binRight = $('bin-right');
const feedbackEl = $('feedback');
const comboPopup = $('combo-popup');
const comboText = $('combo-text');
const comboSub = $('combo-sub');
const instruction = $('instruction');
const gameoverOverlay = $('gameover-overlay');
const streakBar = $('streak-bar');

// ========================================
// Background Particles (pastel)
// ========================================
const canvas = $('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initBg() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    const colors = ['rgba(255,142,199,0.4)', 'rgba(197,163,255,0.35)', 'rgba(135,206,235,0.3)', 'rgba(184,240,216,0.3)', 'rgba(255,243,176,0.35)'];
    for (let i = 0; i < 35; i++) {
        particles.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1, speedX: (Math.random() - 0.5) * 0.3, speedY: (Math.random() - 0.5) * 0.3,
            color: colors[Math.floor(Math.random() * colors.length)], pulse: Math.random() * Math.PI * 2,
        });
    }
}

function animateBg() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x += p.speedX; p.y += p.speedY; p.pulse += 0.01;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.save();
        ctx.globalAlpha = 0.3 + 0.3 * Math.sin(p.pulse);
        ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = p.size * 4;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    });
    requestAnimationFrame(animateBg);
}

window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
initBg(); animateBg();

// ========================================
// Streak dots
// ========================================
function buildStreakDots() {
    streakBar.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const dot = document.createElement('div');
        dot.className = 'streak-dot';
        streakBar.appendChild(dot);
    }
}
buildStreakDots();

function updateStreakDots() {
    const dots = streakBar.querySelectorAll('.streak-dot');
    dots.forEach((dot, i) => {
        dot.className = 'streak-dot';
        dot.textContent = '';

        if (i < state.combo) {
            dot.textContent = '🔥';
            if (i === 9) {
                // Dot 10 (x5 MAX Multiplier - Giant flame with white border ring)
                dot.className = 'streak-dot active flame-x5';
            } else if (i === 5) {
                // Dot 6 (x3 Multiplier Milestone - Larger flame)
                dot.className = 'streak-dot active flame-x3';
            } else if (i === 2) {
                // Dot 3 (x2 Multiplier Milestone - Medium-large flame)
                dot.className = 'streak-dot active flame-x2';
            } else {
                // Normal active flame dot
                dot.className = 'streak-dot active flame-normal';
            }
        }
    });
}

// ========================================
// Combo & Scoring
// ========================================
function getMultiplier() {
    for (const t of COMBO_THRESHOLDS) {
        if (state.combo >= t.streak) return t.multiplier;
    }
    return 1;
}

function shuffleItems() { return [...ITEMS].sort(() => Math.random() - 0.5); }

function nextItem() {
    if (!state.isPlaying) return;
    if (state.usedItems.length === 0) state.usedItems = shuffleItems();

    state.currentItem = state.usedItems.pop();
    const item = state.currentItem;

    if (item.icon) {
        itemEmoji.innerHTML = `<img src="${item.icon}" alt="${item.name}" class="item-icon-img">`;
    } else {
        itemEmoji.innerHTML = '';
        itemEmoji.textContent = item.emoji;
    }
    itemName.textContent = item.name;
    itemHint.textContent = item.hint;

    itemCard.style.display = 'flex';
    itemCard.style.transform = '';
    itemCard.style.opacity = '1';
    itemCard.className = 'item-card entering'; // Falls from top!

    setTimeout(() => { itemCard.classList.remove('entering'); }, 450);
    startCardTimer();
}

function handleSwipe(direction) {
    if (!state.isPlaying || !state.currentItem) return;

    stopCardTimer();

    const item = state.currentItem;
    const isCorrect =
        (direction === 'left' && item.type === 'recycle') ||
        (direction === 'right' && item.type === 'hazard');

    const prevMult = getMultiplier();

    if (isCorrect) {
        const mult = getMultiplier();
        let points = BASE_SCORE * mult;
        const pctLeft = state.cardMaxTime > 0 ? (state.cardTimeLeft / state.cardMaxTime) : 0;

        // Speed bonus if swiped within top 30% of card time limit!
        if (pctLeft >= 0.7) {
            points += 50;
            showScoreFly(`+${points} ⚡`, false);
        } else {
            showScoreFly(`+${points}`);
        }

        state.score += points;
        state.combo++;
        state.correct++;
        if (state.combo > state.maxCombo) state.maxCombo = state.combo;

        showFeedback('✅');

        // Check for new combo milestone — show dramatic popup!
        const newMult = getMultiplier();
        if (newMult > prevMult) {
            showComboPopup(newMult);
        }
    } else {
        state.score = Math.max(0, state.score + WRONG_PENALTY);
        state.combo = 0;
        state.wrong++;
        state.lives--;
        showFeedback('❌');
        showScoreFly(`${WRONG_PENALTY}`, true);
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }

    itemCard.classList.add(direction === 'left' ? 'exit-left' : 'exit-right');
    state.currentItem = null;
    updateHUD();
    updateStreakDots();

    if (state.lives <= 0) {
        showFeedback('💔');
        showScoreFly('หัวใจหมด!', true);
        setTimeout(() => { endGame(); }, 600);
        return;
    }

    setTimeout(nextItem, 350);
}

function updateHUD() {
    hudScore.textContent = state.score;
    if (hudLives) hudLives.textContent = '❤️'.repeat(Math.max(0, state.lives)) + '🖤'.repeat(Math.max(0, 3 - state.lives));
    const mult = getMultiplier();
    hudCombo.textContent = `x${mult}`;
    hudTimer.textContent = state.timeLeft;

    // Animate score change
    hudScore.style.transform = 'scale(1.3)';
    setTimeout(() => { hudScore.style.transform = 'scale(1)'; }, 200);
    hudScore.style.transition = 'transform 0.2s ease';

    const pct = state.timeLeft / GAME_DURATION;
    timerFill.style.width = `${pct * 100}%`;

    if (pct <= 0.15) { hudTimer.className = 'hud-value danger'; timerFill.className = 'timer-fill danger'; }
    else if (pct <= 0.35) { hudTimer.className = 'hud-value warning'; timerFill.className = 'timer-fill warning'; }
    else { hudTimer.className = 'hud-value'; timerFill.className = 'timer-fill'; }

    // Combo color
    if (mult >= 5) hudCombo.style.color = '#ff4500';
    else if (mult >= 3) hudCombo.style.color = '#ff8c00';
    else if (mult >= 2) hudCombo.style.color = '#ff8ec7';
    else hudCombo.style.color = '#2d1b4e';
}

function showFeedback(emoji) {
    feedbackEl.textContent = emoji;
    feedbackEl.className = 'feedback show';
    setTimeout(() => { feedbackEl.className = 'feedback'; }, 600);
}

function showScoreFly(text, isNeg) {
    const el = document.createElement('div');
    el.className = `score-fly ${isNeg ? 'negative' : 'positive'}`;
    el.textContent = text;
    el.style.top = '35%';
    el.style.left = '45%';
    el.style.transform = 'translateX(-50%)';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

function showComboPopup(mult) {
    const messages = {
        2: { text: '🔥 x2 คอมโบ!', sub: 'เก่งมาก! ได้คะแนน 2 เท่า!' },
        3: { text: '⚡ x3 คอมโบ!', sub: 'สุดยอด! ได้คะแนน 3 เท่า!' },
        5: { text: '🔥💥 x5 ULTRA FIRE! 💥🔥', sub: 'เทพมาก!! คะแนน 5 เท่าสูงสุด!!!' },
    };
    const msg = messages[mult] || { text: `🔥 x${mult}!`, sub: 'คอมโบ!' };

    comboText.textContent = msg.text;
    comboSub.textContent = msg.sub;
    comboPopup.className = `combo-popup show ${mult >= 5 ? 'ultra-fire' : ''}`;

    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 150]);

    setTimeout(() => { comboPopup.className = 'combo-popup'; }, 1200);
}

// ========================================
// Per-Card Speed Countdown Timer
// ========================================
function getCardTimeLimit() {
    if (state.score < 1000) return 3.0;
    if (state.score < 2500) return 2.5;
    if (state.score < 5000) return 2.0;
    if (state.score < 8000) return 1.5;
    return 1.2;
}

let cardAnimFrame = null;

function startCardTimer() {
    stopCardTimer();
    const limit = getCardTimeLimit();
    state.cardMaxTime = limit;
    state.cardStartTime = Date.now();
    state.cardTimeLeft = limit;

    function tick() {
        if (!state.isPlaying) return;
        const elapsed = (Date.now() - state.cardStartTime) / 1000;
        state.cardTimeLeft = Math.max(0, state.cardMaxTime - elapsed);

        const pct = state.cardTimeLeft / state.cardMaxTime;
        hudTimer.textContent = `${state.cardTimeLeft.toFixed(1)}s`;
        timerFill.style.width = `${pct * 100}%`;

        if (pct <= 0.25) {
            hudTimer.className = 'hud-value danger';
            timerFill.className = 'timer-fill danger';
        } else if (pct <= 0.5) {
            hudTimer.className = 'hud-value warning';
            timerFill.className = 'timer-fill warning';
        } else {
            hudTimer.className = 'hud-value';
            timerFill.className = 'timer-fill';
        }

        if (state.cardTimeLeft <= 0) {
            handleCardTimeout();
        } else {
            cardAnimFrame = requestAnimationFrame(tick);
        }
    }

    cardAnimFrame = requestAnimationFrame(tick);
}

function stopCardTimer() {
    if (cardAnimFrame) {
        cancelAnimationFrame(cardAnimFrame);
        cardAnimFrame = null;
    }
}

function handleCardTimeout() {
    if (!state.isPlaying) return;
    stopCardTimer();
    state.score = Math.max(0, state.score + WRONG_PENALTY);
    state.combo = 0;
    state.wrong++;
    state.lives--;
    showFeedback('⏰');
    showScoreFly('หมดเวลา! -100', true);
    if (navigator.vibrate) navigator.vibrate([150, 50, 150]);
    updateHUD();
    updateStreakDots();

    if (state.lives <= 0) {
        showFeedback('💔');
        setTimeout(() => { endGame(); }, 600);
    } else {
        setTimeout(nextItem, 450);
    }
}

// ========================================
// Game Start / End
// ========================================
function startGame() {
    sessionStorage.removeItem('lastGameSummary');
    state = {
        score: 0, combo: 0, maxCombo: 0, correct: 0, wrong: 0, lives: 3,
        isPlaying: true, currentItem: null,
        usedItems: shuffleItems(),
    };
    instruction.style.display = 'none';
    gameoverOverlay.style.display = 'none';
    buildStreakDots();
    updateHUD();
    nextItem();
}

async function loadTopWidget() {
    const listEl = $('top-widget-list');
    if (!listEl) return;

    // Render cache immediately if available
    try {
        const cached = localStorage.getItem('eco_lb_cache');
        if (cached) {
            const top3 = JSON.parse(cached);
            if (Array.isArray(top3) && top3.length) {
                renderTopWidgetList(top3, listEl);
            }
        }
    } catch (e) { }

    try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        const top3 = data.slice(0, 3);
        localStorage.setItem('eco_lb_cache', JSON.stringify(top3));
        renderTopWidgetList(top3, listEl);
    } catch (err) {
        console.error('Failed to load top widget:', err);
    }
}

function renderTopWidgetList(top3, listEl) {
    if (!top3 || !top3.length) {
        listEl.innerHTML = '<div class="top-widget-empty">ยังไม่มีอันดับ</div>';
        return;
    }
    listEl.innerHTML = top3.map((player, idx) => {
        const rank = idx + 1;
        return `
            <div class="top-widget-item rank-${rank}">
                <img src="/icons/No${rank}.png" class="top-widget-icon" alt="Top ${rank}">
                <span class="top-widget-name">${escHtml(player.nickname)}</span>
                <span class="top-widget-score">${player.score.toLocaleString()}</span>
            </div>
        `;
    }).join('');
}

function escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

loadTopWidget();
setInterval(loadTopWidget, 10000);

async function endGame() {
    state.isPlaying = false;
    stopCardTimer();
    itemCard.style.display = 'none';

    let submitResult = null;
    try {
        const res = await fetch('/api/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerId: getPlayerId(), score: state.score, combo: state.maxCombo, correct: state.correct, wrong: state.wrong }),
        });
        submitResult = await res.json();
        if (submitResult && submitResult.error) {
            sessionStorage.clear();
            window.location.href = '/';
            return;
        }
    } catch (err) { console.error('Score submit failed:', err); }

    $('final-score').textContent = state.score;
    $('final-correct').textContent = state.correct;
    $('final-wrong').textContent = state.wrong;
    const maxMult = state.maxCombo >= 10 ? 5 : state.maxCombo >= 6 ? 3 : state.maxCombo >= 3 ? 2 : 1;
    $('final-combo').textContent = `x${maxMult}`;

    const emojiEl = $('gameover-emoji');
    const subEl = $('gameover-rank-sub');
    const topBadgeEl = $('gameover-top-badge');

    if (submitResult && submitResult.newTopRank) {
        const rank = submitResult.newTopRank;
        if (topBadgeEl) {
            topBadgeEl.innerHTML = `<img src="/icons/No${rank}.png" class="rank-badge-floating-img" alt="Top ${rank}">`;
            topBadgeEl.style.display = 'block';
        }
        emojiEl.style.display = 'none';
        subEl.textContent = `🏆 ยินดีด้วย! คุณทำลายสถิติใหม่ ติดอันดับ Top ${rank}!`;
        subEl.style.display = 'block';
    } else {
        if (topBadgeEl) topBadgeEl.style.display = 'none';
        emojiEl.textContent = '🎉';
        emojiEl.style.display = 'block';
        subEl.style.display = 'none';
    }

    // Save summary state for restoring when returning from Leaderboard
    sessionStorage.setItem('lastGameSummary', JSON.stringify({
        score: state.score,
        correct: state.correct,
        wrong: state.wrong,
        maxCombo: state.maxCombo,
        newTopRank: submitResult ? submitResult.newTopRank : null
    }));

    gameoverOverlay.style.display = 'flex';
    launchConfetti();
    loadTopWidget();
}

function checkAutoShowSummary() {
    if (window.location.search.includes('showResult=1') || window.location.search.includes('showResult=true')) {
        const saved = sessionStorage.getItem('lastGameSummary');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                $('final-score').textContent = data.score;
                $('final-correct').textContent = data.correct;
                $('final-wrong').textContent = data.wrong;
                const maxMult = data.maxCombo >= 10 ? 5 : data.maxCombo >= 6 ? 3 : data.maxCombo >= 3 ? 2 : 1;
                $('final-combo').textContent = `x${maxMult}`;

                const emojiEl = $('gameover-emoji');
                const subEl = $('gameover-rank-sub');
                const topBadgeEl = $('gameover-top-badge');

                if (data.newTopRank) {
                    if (topBadgeEl) {
                        topBadgeEl.innerHTML = `<img src="/icons/No${data.newTopRank}.png" class="rank-badge-floating-img" alt="Top ${data.newTopRank}">`;
                        topBadgeEl.style.display = 'block';
                    }
                    emojiEl.style.display = 'none';
                    subEl.textContent = `🏆 ยินดีด้วย! คุณทำลายสถิติใหม่ ติดอันดับ Top ${data.newTopRank}!`;
                    subEl.style.display = 'block';
                } else {
                    if (topBadgeEl) topBadgeEl.style.display = 'none';
                    emojiEl.textContent = '🎉';
                    emojiEl.style.display = 'block';
                    subEl.style.display = 'none';
                }

                gameoverOverlay.style.display = 'flex';
            } catch (e) { console.error('Failed to parse summary:', e); }
        }
    }
}

function launchConfetti() {
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        canvas.style.position = 'fixed';
        canvas.style.inset = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '150';
        document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    const colors = ['#ff8ec7', '#c5a3ff', '#87ceeb', '#6dd5a0', '#ffe066', '#ff6b6b'];
    const particles = [];
    for (let i = 0; i < 35; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * -height * 0.5,
            w: Math.random() * 8 + 6,
            h: Math.random() * 12 + 8,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 2.5,
            vy: Math.random() * 3.5 + 3,
            rot: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 6
        });
    }

    let startTime = Date.now();
    function render() {
        const elapsed = Date.now() - startTime;
        if (elapsed > 3200) {
            ctx.clearRect(0, 0, width, height);
            canvas.remove();
            return;
        }
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vRot;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

// ========================================
// Touch / Mouse Swipe
// ========================================
let drag = { active: false, startX: 0, curX: 0, startTime: 0 };
const SWIPE_THRESHOLD = 80;
const VELOCITY_THRESHOLD = 0.3;

function onStart(x) {
    if (!state.isPlaying || !state.currentItem) return;
    drag = { active: true, startX: x, curX: x, startTime: Date.now() };
}

function onMove(x) {
    if (!drag.active) return;
    drag.curX = x;
    const dx = x - drag.startX;
    const rot = dx * 0.1;
    const opc = Math.max(0.5, 1 - Math.abs(dx) / 400);
    itemCard.style.transform = `translateX(${dx}px) rotate(${rot}deg)`;
    itemCard.style.opacity = opc;

    if (dx < -40) { binLeft.classList.add('active'); binRight.classList.remove('active'); itemCard.className = 'item-card swipe-left'; }
    else if (dx > 40) { binRight.classList.add('active'); binLeft.classList.remove('active'); itemCard.className = 'item-card swipe-right'; }
    else { binLeft.classList.remove('active'); binRight.classList.remove('active'); itemCard.className = 'item-card'; }
}

function onEnd() {
    if (!drag.active) return;
    drag.active = false;
    const dx = drag.curX - drag.startX;
    const vel = Math.abs(dx) / (Date.now() - drag.startTime);
    binLeft.classList.remove('active');
    binRight.classList.remove('active');

    if (Math.abs(dx) > SWIPE_THRESHOLD || vel > VELOCITY_THRESHOLD) {
        handleSwipe(dx < 0 ? 'left' : 'right');
    } else {
        itemCard.style.transform = '';
        itemCard.style.opacity = '1';
        itemCard.className = 'item-card';
    }
}

document.addEventListener('touchstart', e => onStart(e.touches[0].clientX), { passive: true });
document.addEventListener('touchmove', e => { e.preventDefault(); onMove(e.touches[0].clientX); }, { passive: false });
document.addEventListener('touchend', () => onEnd(), { passive: true });
document.addEventListener('mousedown', e => onStart(e.clientX));
document.addEventListener('mousemove', e => onMove(e.clientX));
document.addEventListener('mouseup', () => onEnd());

// ========================================
// Start triggers
// ========================================
instruction.addEventListener('click', startGame);
instruction.addEventListener('touchend', e => { e.preventDefault(); startGame(); });
$('btn-replay').addEventListener('click', startGame);
$('btn-leaderboard').addEventListener('click', () => { window.location.href = '/leaderboard.html'; });

if ($('top-widget-btn')) {
    $('top-widget-btn').addEventListener('click', () => { window.location.href = '/leaderboard.html'; });
}

// ========================================
// Player Verification & Redirect
// ========================================
function getPlayerId() {
    try {
        let pid = localStorage.getItem('eco_player_id');
        if (!pid) {
            pid = 'p_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
            localStorage.setItem('eco_player_id', pid);
        }
        return pid;
    } catch (e) {
        let pid = sessionStorage.getItem('eco_player_id');
        if (!pid) {
            pid = 'p_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
            try { sessionStorage.setItem('eco_player_id', pid); } catch (e2) { }
        }
        return pid;
    }
}

async function checkPlayerValidation() {
    try {
        const res = await fetch(`/api/player?playerId=${getPlayerId()}&t=${Date.now()}`);
        const data = await res.json();
        if (!data.registered || !data.nickname) {
            sessionStorage.clear();
            window.location.href = '/';
            return false;
        }
        sessionStorage.setItem('playerNickname', data.nickname);
        sessionStorage.setItem('playerAvatar', data.avatar || 'icons/male_1.png');
        return true;
    } catch (err) {
        console.error('Player validation check error:', err);
        return true;
    }
}

// Run player check immediately on load
checkPlayerValidation();

// Auto show summary if returning from leaderboard
checkAutoShowSummary();
