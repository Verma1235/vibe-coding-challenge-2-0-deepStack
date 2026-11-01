import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Global isliye use kar rahe hain taaki development (hot-reload) me baar-baar naye connections na banein
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    // Agar connection pehle se hai, toh wahi return kar do
    if (cached.conn) {
        return cached.conn;
    }

    // Agar connection process me nahi hai, toh naya connection start karo
    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Ensures mongoose doesn't buffer commands if connection drops
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log("🔥 MongoDB Connected Successfully");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null; // Agar error aaye toh promise reset kar do
        throw e;
    }

    return cached.conn;
}

export default connectDB;