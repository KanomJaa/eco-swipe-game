import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDB, mongoose } from './src/db.js';
import { Player } from './src/models.js';
import { setDataFilePath } from './src/helpers.js';
import apiRoutes from './src/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure data file path
setDataFilePath(join(__dirname, 'data.json'));

// Connect to MongoDB
await connectDB();

// Clean up legacy index after connection
mongoose.connection.on('connected', async () => {
    try {
        await Player.collection.dropIndex('ip_1');
        console.log('🧹 Cleaned legacy ip_1 index from Mongo');
    } catch (e) { }
});

// Express app
const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));
app.use('/api', apiRoutes);

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🧪 Eco-Swipe Server running!`);
    console.log(`   Local:   http://localhost:${PORT}`);
    console.log(`   Network: http://<your-ip>:${PORT}`);
    console.log(`\n   📱 Game:        http://localhost:${PORT}/`);
    console.log(`   📺 Leaderboard: http://localhost:${PORT}/leaderboard.html`);
    console.log(`   📷 QR Code:     http://localhost:${PORT}/qr.html\n`);
});
