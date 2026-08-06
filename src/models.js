import { mongoose } from './db.js';

const playerSchema = new mongoose.Schema({
    playerId: { type: String, required: true, unique: true },
    nickname: { type: String, required: true },
    avatar: { type: String, default: 'icons/male_1.png' },
    ip: { type: String },
    registeredAt: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now }
});

const scoreSchema = new mongoose.Schema({
    playerId: { type: String, required: true },
    nickname: { type: String, required: true },
    score: { type: Number, required: true },
    maxCombo: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    wrong: { type: Number, default: 0 },
    playedAt: { type: Date, default: Date.now }
});

export const Player = mongoose.model('Player', playerSchema);
export const Score = mongoose.model('Score', scoreSchema);
