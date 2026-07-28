import express from 'express';
import mongoose from 'mongoose';
import dns from 'dns';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Fix Windows SRV DNS lookup issues for MongoDB Atlas
try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
    console.log('DNS setServers notice:', e.message);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = join(__dirname, 'data.json');
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://snackjack:0881030240@snack.nzitdfa.mongodb.net/ecoswipe?retryWrites=true&w=majority';

let isMongoConnected = false;

// Connect to MongoDB Atlas with timeout & fallback settings
mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000
}).then(() => {
    isMongoConnected = true;
    console.log('🍃 Connected to MongoDB Atlas Cloud Database!');
}).catch((err) => {
    isMongoConnected = false;
    console.error('⚠️ MongoDB Connection Notice:', err.message);
    console.log('📁 Falling back to local data.json storage mode.');
});

mongoose.connection.on('connected', () => { isMongoConnected = true; });
mongoose.connection.on('disconnected', () => { isMongoConnected = false; });
mongoose.connection.on('error', () => { isMongoConnected = false; });

// Define Mongoose Schemas & Models
const playerSchema = new mongoose.Schema({
    ip: { type: String, required: true, unique: true },
    nickname: { type: String, required: true },
    avatar: { type: String, default: 'icons/male_1.png' },
    registeredAt: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now }
});

const scoreSchema = new mongoose.Schema({
    ip: { type: String, required: true },
    nickname: { type: String, required: true },
    score: { type: Number, required: true },
    maxCombo: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    wrong: { type: Number, default: 0 },
    playedAt: { type: Date, default: Date.now }
});

const Player = mongoose.model('Player', playerSchema);
const Score = mongoose.model('Score', scoreSchema);

// ========================================
// Data Helpers (File Fallback)
// ========================================
function loadData() {
    if (!existsSync(DATA_FILE)) {
        const initial = { players: {}, scores: [] };
        writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
        return initial;
    }
    try {
        return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
    } catch {
        return { players: {}, scores: [] };
    }
}

function saveData(data) {
    try {
        writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Failed to write data.json:', e);
    }
}

function getClientIP(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return req.ip || req.connection?.remoteAddress || 'unknown';
}

// Trust proxy
app.set('trust proxy', true);

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// ========================================
// API Routes
// ========================================

// Check if IP is registered
app.get('/api/player', async (req, res) => {
    const ip = getClientIP(req);

    if (isMongoConnected) {
        try {
            const player = await Player.findOne({ ip });
            if (player) {
                return res.json({ registered: true, nickname: player.nickname, avatar: player.avatar || 'icons/male_1.png', ip });
            }
            return res.json({ registered: false, ip });
        } catch (err) {
            console.error('Mongo Error on /api/player:', err.message);
        }
    }

    // Fallback to data.json
    const data = loadData();
    const player = data.players[ip];
    if (player) {
        res.json({ registered: true, nickname: player.nickname, avatar: player.avatar || 'icons/male_1.png', ip });
    } else {
        res.json({ registered: false, ip });
    }
});

// Register nickname & avatar for IP
app.post('/api/register', async (req, res) => {
    const ip = getClientIP(req);
    const { nickname, avatar } = req.body;

    if (!nickname || nickname.trim().length < 2 || nickname.trim().length > 16) {
        return res.status(400).json({ error: 'ชื่อต้องมี 2-16 ตัวอักษร' });
    }

    const cleanNickname = nickname.trim();
    const cleanAvatar = avatar || 'icons/male_1.png';

    // Always update data.json for local backup
    const data = loadData();
    data.players[ip] = {
        nickname: cleanNickname,
        avatar: cleanAvatar,
        registeredAt: new Date().toISOString(),
        lastSeen: new Date().toISOString()
    };
    saveData(data);

    if (isMongoConnected) {
        try {
            await Player.findOneAndUpdate(
                { ip },
                { nickname: cleanNickname, avatar: cleanAvatar, lastSeen: new Date() },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        } catch (err) {
            console.error('Mongo Error on /api/register:', err.message);
        }
    }

    res.json({ success: true, nickname: cleanNickname, avatar: cleanAvatar });
});

// Submit score
app.post('/api/score', async (req, res) => {
    const ip = getClientIP(req);
    const { score, combo, correct, wrong } = req.body;
    const currentScore = Math.max(0, Number(score) || 0);

    const data = loadData();
    const filePlayer = data.players[ip];

    if (isMongoConnected) {
        try {
            const player = await Player.findOne({ ip });
            if (player) {
                player.lastSeen = new Date();
                await player.save();

                const playerScores = await Score.find({ ip });
                const prevBestScore = playerScores.length > 0 ? Math.max(...playerScores.map(s => s.score)) : -1;
                const isNewPersonalBest = currentScore >= prevBestScore;

                await Score.create({
                    ip,
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
                        { $group: { _id: '$ip', bestScore: { $first: '$score' } } },
                        { $sort: { bestScore: -1 } }
                    ]);

                    const rank = allBestScores.findIndex(entry => entry._id === ip) + 1;
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

    // Fallback to data.json
    if (!filePlayer) {
        return res.status(400).json({ error: 'ยังไม่ได้ลงทะเบียน' });
    }

    filePlayer.lastSeen = new Date().toISOString();
    const playerScores = data.scores.filter((s) => s.ip === ip);
    const prevBestScore = playerScores.length > 0 ? Math.max(...playerScores.map((s) => s.score)) : -1;
    const isNewPersonalBest = currentScore >= prevBestScore;

    data.scores.push({
        ip,
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
            if (!bestScores[entry.ip] || entry.score > bestScores[entry.ip].score) {
                bestScores[entry.ip] = entry;
            }
        });
        const leaderboard = Object.values(bestScores).sort((a, b) => b.score - a.score);
        const rank = leaderboard.findIndex((entry) => entry.ip === ip) + 1;
        if (rank >= 1 && rank <= 3) {
            newTopRank = rank;
        }
    }

    res.json({ success: true, score: currentScore, newTopRank, isNewPersonalBest });
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
    if (isMongoConnected) {
        try {
            const topScores = await Score.aggregate([
                { $sort: { score: -1 } },
                {
                    $group: {
                        _id: '$ip',
                        nickname: { $first: '$nickname' },
                        score: { $first: '$score' },
                        maxCombo: { $first: '$maxCombo' },
                        playedAt: { $first: '$playedAt' }
                    }
                },
                { $sort: { score: -1 } },
                { $limit: 10 }
            ]);

            const ips = topScores.map(item => item._id);
            const players = await Player.find({ ip: { $in: ips } });
            const playerMap = {};
            players.forEach(p => { playerMap[p.ip] = p.avatar; });

            const leaderboard = topScores.map((entry, index) => ({
                rank: index + 1,
                nickname: entry.nickname,
                avatar: playerMap[entry._id] || 'icons/male_1.png',
                score: entry.score,
                maxCombo: entry.maxCombo,
                playedAt: entry.playedAt
            }));

            return res.json(leaderboard);
        } catch (err) {
            console.error('Mongo Error on /api/leaderboard:', err.message);
        }
    }

    // Fallback to data.json
    const data = loadData();
    const bestScores = {};
    data.scores.forEach((entry) => {
        if (!bestScores[entry.ip] || entry.score > bestScores[entry.ip].score) {
            bestScores[entry.ip] = entry;
        }
    });

    const leaderboard = Object.values(bestScores)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((entry, i) => ({
            rank: i + 1,
            nickname: entry.nickname,
            avatar: data.players[entry.ip]?.avatar || 'icons/male_1.png',
            score: entry.score,
            maxCombo: entry.maxCombo,
            playedAt: entry.playedAt,
        }));

    res.json(leaderboard);
});

// Reset all data
app.get('/api/reset', async (req, res) => {
    const data = { players: {}, scores: [] };
    saveData(data);

    if (isMongoConnected) {
        try {
            await Player.deleteMany({});
            await Score.deleteMany({});
        } catch (err) {
            console.error('Mongo Reset Error:', err.message);
        }
    }

    res.json({ success: true, message: 'ลบข้อมูลผู้เล่นและคะแนนทั้งหมดสำเร็จแล้ว!' });
});

// ========================================
// Start Server
// ========================================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🧪 Eco-Swipe Server running!`);
    console.log(`   Local:   http://localhost:${PORT}`);
    console.log(`   Network: http://<your-ip>:${PORT}`);
    console.log(`\n   📱 Game:        http://localhost:${PORT}/`);
    console.log(`   📺 Leaderboard: http://localhost:${PORT}/leaderboard.html`);
    console.log(`   📷 QR Code:     http://localhost:${PORT}/qr.html\n`);
});
