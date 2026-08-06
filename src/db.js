import mongoose from 'mongoose';
import dns from 'dns';

// Fix Windows SRV DNS lookup issues for MongoDB Atlas
try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
    console.log('DNS setServers notice:', e.message);
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://snackjack:0881030240@snack.nzitdfa.mongodb.net/ecoswipe?retryWrites=true&w=majority';

export const db = { connected: false };

export async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000
        });
        db.connected = true;
        console.log('🍃 Connected to MongoDB Atlas Cloud Database!');
    } catch (err) {
        db.connected = false;
        console.error('⚠️ MongoDB Connection Notice:', err.message);
        console.log('📁 Falling back to local data.json storage mode.');
    }

    mongoose.connection.on('disconnected', () => { db.connected = false; });
    mongoose.connection.on('error', () => { db.connected = false; });
}

export { mongoose };
