// lib/db.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

// Check if MONGODB_URI is defined
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable.');
}

// Global is used here to maintain a cached connection across hot reloads in development.
// This prevents connections growing exponentially during API Route usage.
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 30000,
        }).then((mongoose) => {
            return mongoose;
        })
    }

    cached.conn = await cached.promise;
    console.log("MongoDB connected successfully!");
    return cached.conn;
};

export default connectDB;
