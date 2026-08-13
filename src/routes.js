import { Router } from 'express';
import { db } from './db.js';
import { Player, Score, Code } from './models.js';
import { loadData, saveData, getClientIP, getPlayerKey } from './helpers.js';

const router = Router();

// Disable caching for all API endpoints
router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// Check if Player is registered
router.get('/player', async (req, res) => {
    const key = getPlayerKey(req);
    const ip = getClientIP(req);

    if (db.connected) {
        try {
            let player = await Player.findOne({ playerId: key });
            if (!player && key === ip) {
                player = await Player.findOne({ ip });
            }
            if (player) {
                return res.json({ registered: true, nickname: player.nickname, avatar: player.avatar || 'icons/male_1.png', keys: player.keys || 0, key });
            }
            return res.json({ registered: false, key });
        } catch (err) {
            console.error('Mongo Error on /api/player:', err.message);
        }
    }

    const data = loadData();
    const player = data.players[key] || (key === ip ? data.players[ip] : null);
    if (player) {
        res.json({ registered: true, nickname: player.nickname, avatar: player.avatar || 'icons/male_1.png', keys: player.keys || 0, key });
    } else {
        res.json({ registered: false, key });
    }
});

// Register nickname & avatar
router.post('/register', async (req, res) => {
    const key = getPlayerKey(req);
    const ip = getClientIP(req);
    const { nickname, avatar } = req.body;

    if (!nickname || nickname.trim().length < 2 || nickname.trim().length > 16) {
        return res.status(400).json({ error: 'ชื่อต้องมี 2-16 ตัวอักษร' });
    }

    const cleanNickname = nickname.trim();
    const cleanAvatar = avatar || 'icons/male_1.png';

    const data = loadData();

    if (db.connected) {
        try {
            const escapedName = cleanNickname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const existingPlayer = await Player.findOne({
                nickname: { $regex: new RegExp(`^${escapedName}$`, 'i') },
                playerId: { $ne: key }
            });
            if (existingPlayer) {
                return res.status(400).json({ error: 'ชื่อนี้มีผู้ใช้งานแล้ว กรุณาใช้ชื่ออื่น 🧪' });
            }
        } catch (err) {
            console.error('Mongo duplicate check error:', err.message);
        }
    }

    const isDuplicate = Object.values(data.players || {}).some(p =>
        p.playerId !== key && p.nickname && p.nickname.toLowerCase() === cleanNickname.toLowerCase()
    );
    if (isDuplicate) {
        return res.status(400).json({ error: 'ชื่อนี้มีผู้ใช้งานแล้ว กรุณาใช้ชื่ออื่น 🧪' });
    }

    const FREE_KEYS = 3;

    data.players[key] = {
        playerId: key,
        nickname: cleanNickname,
        avatar: cleanAvatar,
        keys: FREE_KEYS,
        ip,
        registeredAt: new Date().toISOString(),
        lastSeen: new Date().toISOString()
    };
    saveData(data);

    if (db.connected) {
        try {
            await Player.findOneAndUpdate(
                { playerId: key },
                { playerId: key, nickname: cleanNickname, avatar: cleanAvatar, keys: FREE_KEYS, ip, lastSeen: new Date() },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        } catch (err) {
            console.error('Mongo Error on /api/register:', err.message);
        }
    }

    res.json({ success: true, nickname: cleanNickname, avatar: cleanAvatar, keys: FREE_KEYS, key });
});

// Submit score
router.post('/score', async (req, res) => {
    const key = getPlayerKey(req);
    const { score, combo, correct, wrong } = req.body;
    const currentScore = Math.max(0, Number(score) || 0);

    const data = loadData();
    const filePlayer = data.players[key];

    if (db.connected) {
        try {
            const player = await Player.findOne({ playerId: key });
            if (player) {
                player.lastSeen = new Date();
                await player.save();

                const playerScores = await Score.find({ playerId: key });
                const prevBestScore = playerScores.length > 0 ? Math.max(...playerScores.map(s => s.score)) : -1;
                const isNewPersonalBest = currentScore >= prevBestScore;

                await Score.create({
                    playerId: key,
                    nickname: player.nickname,
                    score: currentScore,
                    maxCombo: combo || 0,
                    correct: correct || 0,
                    wrong: wrong || 0,
                    playedAt: new Date()
                });

                let newTopRank = null;
                if (currentScore > 0 && isNewPersonalBest) {
                    const allBestScores = await Score.aggregate([
                        { $sort: { score: -1 } },
                        { $group: { _id: '$playerId', bestScore: { $first: '$score' } } },
                        { $sort: { bestScore: -1 } }
                    ]);

                    const rank = allBestScores.findIndex(entry => entry._id === key) + 1;
                    if (rank >= 1 && rank <= 3) {
                        newTopRank = rank;
                    }
                }

                return res.json({ success: true, score: currentScore, newTopRank, isNewPersonalBest });
            }
        } catch (err) {
            console.error('Mongo Error on /api/score:', err.message);
        }
    }

    if (!filePlayer) {
        return res.status(400).json({ error: 'ยังไม่ได้ลงทะเบียน' });
    }

    filePlayer.lastSeen = new Date().toISOString();
    const playerScores = data.scores.filter((s) => (s.playerId || s.ip) === key);
    const prevBestScore = playerScores.length > 0 ? Math.max(...playerScores.map((s) => s.score)) : -1;
    const isNewPersonalBest = currentScore >= prevBestScore;

    data.scores.push({
        playerId: key,
        nickname: filePlayer.nickname,
        score: currentScore,
        maxCombo: combo || 0,
        correct: correct || 0,
        wrong: wrong || 0,
        playedAt: new Date().toISOString(),
    });
    saveData(data);

    let newTopRank = null;
    if (currentScore > 0 && isNewPersonalBest) {
        const bestScores = {};
        data.scores.forEach((entry) => {
            const pKey = entry.playerId || entry.ip;
            if (!bestScores[pKey] || entry.score > bestScores[pKey].score) {
                bestScores[pKey] = entry;
            }
        });
        const leaderboard = Object.values(bestScores).sort((a, b) => b.score - a.score);
        const rank = leaderboard.findIndex((entry) => (entry.playerId || entry.ip) === key) + 1;
        if (rank >= 1 && rank <= 3) {
            newTopRank = rank;
        }
    }

    res.json({ success: true, score: currentScore, newTopRank, isNewPersonalBest });
});

// Helper: build leaderboard from Score aggregation for a time range (Mongo)
async function mongoLeaderboard(start, end, limit = 10) {
    const topScores = await Score.aggregate([
        { $match: { playedAt: { $gte: start, $lt: end } } },
        { $sort: { score: -1 } },
        {
            $group: {
                _id: '$playerId',
                nickname: { $first: '$nickname' },
                score: { $first: '$score' },
                maxCombo: { $first: '$maxCombo' },
                playedAt: { $first: '$playedAt' }
            }
        },
        { $sort: { score: -1 } },
        { $limit: limit }
    ]);

    const pKeys = topScores.map(item => item._id);
    const players = await Player.find({ playerId: { $in: pKeys } });
    const playerMap = {};
    players.forEach(p => { playerMap[p.playerId] = p.avatar; });

    return topScores.map((entry, index) => ({
        rank: index + 1,
        nickname: entry.nickname,
        avatar: playerMap[entry._id] || 'icons/male_1.png',
        score: entry.score,
        maxCombo: entry.maxCombo,
        playedAt: entry.playedAt
    }));
}

// Helper: build leaderboard from JSON data for a time range
function jsonLeaderboard(data, start, end, limit = 10) {
    const bestScores = {};
    data.scores.forEach((entry) => {
        const playedAt = new Date(entry.playedAt);
        if (playedAt < start || playedAt >= end) return;
        const pKey = entry.playerId || entry.ip;
        if (!bestScores[pKey] || entry.score > bestScores[pKey].score) {
            bestScores[pKey] = entry;
        }
    });

    return Object.values(bestScores)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((entry, i) => {
            const pKey = entry.playerId || entry.ip;
            return {
                rank: i + 1,
                nickname: entry.nickname,
                avatar: data.players[pKey]?.avatar || 'icons/male_1.png',
                score: entry.score,
                maxCombo: entry.maxCombo,
                playedAt: entry.playedAt,
            };
        });
}

// Get leaderboard (resets every hour, includes previous hour top 3)
router.get('/leaderboard', async (req, res) => {
    const now = new Date();
    const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0);
    const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);
    const prevHourStart = new Date(hourStart.getTime() - 60 * 60 * 1000);

    if (db.connected) {
        try {
            const [leaderboard, previousTop] = await Promise.all([
                mongoLeaderboard(hourStart, hourEnd, 10),
                mongoLeaderboard(prevHourStart, hourStart, 3),
            ]);
            return res.json({ leaderboard, previousTop, resetsAt: hourEnd.toISOString() });
        } catch (err) {
            console.error('Mongo Error on /api/leaderboard:', err.message);
        }
    }

    const data = loadData();
    const leaderboard = jsonLeaderboard(data, hourStart, hourEnd, 10);
    const previousTop = jsonLeaderboard(data, prevHourStart, hourStart, 3);

    res.json({ leaderboard, previousTop, resetsAt: hourEnd.toISOString() });
});

// Redeem a code to get keys
router.post('/redeem-code', async (req, res) => {
    const key = getPlayerKey(req);
    const { code } = req.body;

    if (!code || !code.trim()) {
        return res.status(400).json({ error: 'กรุณาใส่โค้ด' });
    }

    const cleanCode = code.trim().toUpperCase();
    const data = loadData();

    if (db.connected) {
        try {
            const codeDoc = await Code.findOne({ code: cleanCode });
            if (!codeDoc) {
                return res.status(400).json({ error: 'โค้ดไม่ถูกต้อง' });
            }
            if (!codeDoc.isAdmin) {
                if (codeDoc.usedBy.includes(key)) {
                    return res.status(400).json({ error: 'คุณใช้โค้ดนี้ไปแล้ว' });
                }
                if (codeDoc.maxUses > 0 && codeDoc.usedBy.length >= codeDoc.maxUses) {
                    return res.status(400).json({ error: 'โค้ดนี้ถูกใช้ครบจำนวนแล้ว' });
                }
            }

            if (!codeDoc.usedBy.includes(key)) codeDoc.usedBy.push(key);
            await codeDoc.save();

            const player = await Player.findOne({ playerId: key });
            if (player) {
                player.keys = (player.keys || 0) + codeDoc.keysPerRedeem;
                await player.save();

                // Sync to JSON
                if (data.players[key]) {
                    data.players[key].keys = player.keys;
                    saveData(data);
                }

                return res.json({ success: true, keysAdded: codeDoc.keysPerRedeem, totalKeys: player.keys });
            }
            return res.status(400).json({ error: 'ยังไม่ได้ลงทะเบียน' });
        } catch (err) {
            console.error('Mongo Error on /api/redeem-code:', err.message);
        }
    }

    // JSON fallback
    if (!data.codes) data.codes = {};
    const codeData = data.codes[cleanCode];
    if (!codeData) {
        return res.status(400).json({ error: 'โค้ดไม่ถูกต้อง' });
    }
    if (!codeData.usedBy) codeData.usedBy = [];
    if (!codeData.isAdmin) {
        if (codeData.usedBy.includes(key)) {
            return res.status(400).json({ error: 'คุณใช้โค้ดนี้ไปแล้ว' });
        }
        if (codeData.maxUses > 0 && codeData.usedBy.length >= codeData.maxUses) {
            return res.status(400).json({ error: 'โค้ดนี้ถูกใช้ครบจำนวนแล้ว' });
        }
    }

    if (!codeData.usedBy.includes(key)) codeData.usedBy.push(key);
    const player = data.players[key];
    if (!player) {
        return res.status(400).json({ error: 'ยังไม่ได้ลงทะเบียน' });
    }
    player.keys = (player.keys || 0) + (codeData.keysPerRedeem || 3);
    saveData(data);

    res.json({ success: true, keysAdded: codeData.keysPerRedeem || 3, totalKeys: player.keys });
});

// Use 1 key to play
router.post('/use-key', async (req, res) => {
    const key = getPlayerKey(req);
    const data = loadData();

    if (db.connected) {
        try {
            const player = await Player.findOne({ playerId: key });
            if (!player) return res.status(400).json({ error: 'ยังไม่ได้ลงทะเบียน' });
            if ((player.keys || 0) <= 0) return res.status(400).json({ error: 'ไม่มี Key เหลือ' });

            player.keys -= 1;
            await player.save();

            if (data.players[key]) {
                data.players[key].keys = player.keys;
                saveData(data);
            }

            return res.json({ success: true, keysLeft: player.keys });
        } catch (err) {
            console.error('Mongo Error on /api/use-key:', err.message);
        }
    }

    const player = data.players[key];
    if (!player) return res.status(400).json({ error: 'ยังไม่ได้ลงทะเบียน' });
    if ((player.keys || 0) <= 0) return res.status(400).json({ error: 'ไม่มี Key เหลือ' });

    player.keys -= 1;
    saveData(data);
    res.json({ success: true, keysLeft: player.keys });
});

// Admin: Generate codes
router.post('/generate-codes', async (req, res) => {
    const { codes, keysPerRedeem = 3, maxUses = 0 } = req.body;

    if (!codes || !Array.isArray(codes) || codes.length === 0) {
        return res.status(400).json({ error: 'ต้องส่ง codes เป็น array' });
    }

    const created = [];
    const data = loadData();
    if (!data.codes) data.codes = {};

    for (const c of codes) {
        const cleanCode = c.trim().toUpperCase();
        if (!cleanCode) continue;

        if (db.connected) {
            try {
                await Code.findOneAndUpdate(
                    { code: cleanCode },
                    { code: cleanCode, keysPerRedeem, maxUses, usedBy: [] },
                    { upsert: true, new: true }
                );
            } catch (err) {
                console.error('Mongo Error creating code:', err.message);
            }
        }

        data.codes[cleanCode] = { code: cleanCode, keysPerRedeem, maxUses, usedBy: [], createdAt: new Date().toISOString() };
        created.push(cleanCode);
    }

    saveData(data);
    res.json({ success: true, created });
});

// Reset all data
router.get('/reset', async (req, res) => {
    const oldData = loadData();
    // Preserve admin codes across resets
    const adminCodes = {};
    if (oldData.codes) {
        Object.entries(oldData.codes).forEach(([k, v]) => {
            if (v.isAdmin) {
                adminCodes[k] = { ...v, usedBy: [] };
            }
        });
    }
    const data = { players: {}, scores: [], codes: adminCodes };
    saveData(data);

    if (db.connected) {
        try {
            await Player.deleteMany({});
            await Score.deleteMany({});
        } catch (err) {
            console.error('Mongo Reset Error:', err.message);
        }
    }

    res.json({ success: true, message: 'ลบข้อมูลผู้เล่นและคะแนนทั้งหมดสำเร็จแล้ว!' });
});

export default router;
