import { readFileSync, writeFileSync, existsSync } from 'fs';

let dataFilePath = '';

export function setDataFilePath(path) {
    dataFilePath = path;
}

export function loadData() {
    if (!existsSync(dataFilePath)) {
        const initial = { players: {}, scores: [] };
        writeFileSync(dataFilePath, JSON.stringify(initial, null, 2));
        return initial;
    }
    try {
        return JSON.parse(readFileSync(dataFilePath, 'utf-8'));
    } catch {
        return { players: {}, scores: [] };
    }
}

export function saveData(data) {
    try {
        writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Failed to write data.json:', e);
    }
}

export function getClientIP(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return req.ip || req.connection?.remoteAddress || 'unknown';
}

export function getPlayerKey(req) {
    const pid = req.query.playerId || req.body?.playerId;
    if (pid && typeof pid === 'string' && pid.trim()) {
        return pid.trim();
    }
    return getClientIP(req);
}
