import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { connectDB, mongoose } from './src/db.js';
import { Player, Code } from './src/models.js';
import { setDataFilePath, loadData, saveData } from './src/helpers.js';
import apiRoutes from './src/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure data file path
setDataFilePath(join(__dirname, 'data.json'));

// Ensure admin code exists in data.json
const data = loadData();
if (!data.codes) data.codes = {};
if (!data.codes['ECO-ADSE']) {
    data.codes['ECO-ADSE'] = {
        code: 'ECO-ADSE',
        keysPerRedeem: 3,
        maxUses: 0,
        isAdmin: true,
        usedBy: [],
        createdAt: new Date().toISOString()
    };
    saveData(data);
}

// Connect to MongoDB and setup
await connectDB();

if (mongoose.connection.readyState === 1) {
    try {
        await Player.collection.dropIndex('ip_1');
        console.log('🧹 Cleaned legacy ip_1 index from Mongo');
    } catch (e) { }

    // Sync all codes from data.json to MongoDB
    try {
        const allCodes = Object.values(data.codes || {});
        if (allCodes.length > 0) {
            const bulkOps = allCodes.map(c => ({
                updateOne: {
                    filter: { code: c.code },
                    update: {
                        code: c.code,
                        keysPerRedeem: c.keysPerRedeem || 3,
                        maxUses: c.maxUses ?? 1,
                        ...(c.isAdmin ? { isAdmin: true } : {}),
                    },
                    upsert: true
                }
            }));
            await Code.bulkWrite(bulkOps);
            console.log(`🔑 Synced ${allCodes.length} codes to MongoDB (including admin)`);
        }
    } catch (e) {
        console.error('Code sync error:', e.message);
    }
}

// Express app
const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Serve React build (production) or old public (fallback)
const clientDist = join(__dirname, 'client', 'dist');
if (existsSync(clientDist)) {
    app.use(express.static(clientDist));
    // SPA fallback: serve index.html for all non-API routes
    app.get('*', (req, res) => {
        res.sendFile(join(clientDist, 'index.html'));
    });
} else {
    // Fallback to old public folder during development
    app.use(express.static(join(__dirname, 'public')));
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🧪 Eco-Swipe Server running!`);
    console.log(`   Local:   http://localhost:${PORT}`);
    console.log(`   Network: http://<your-ip>:${PORT}\n`);
});
