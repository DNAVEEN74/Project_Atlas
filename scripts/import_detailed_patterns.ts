import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Pattern from '../src/core/models/Pattern';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

async function connectToDatabase() {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

async function importPatterns() {
    await connectToDatabase();

    try {
        const dataPath = path.resolve(__dirname, '../Jsons/patterns_seed_data.json');

        if (!fs.existsSync(dataPath)) {
            console.error(`File not found: ${dataPath}`);
            process.exit(1);
        }

        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const patterns = JSON.parse(rawData);

        console.log(`Found ${patterns.length} patterns to process.`);

        // Clear existing patterns first
        const deleteResult = await Pattern.deleteMany({});
        console.log(`Cleared ${deleteResult.deletedCount} existing patterns.`);

        // Drop indexes to avoid conflicts with old schema fields (e.g., p_code)
        await Pattern.collection.dropIndexes();
        console.log('Dropped existing indexes to ensure schema sync.');

        // Insert new patterns
        const insertResult = await Pattern.insertMany(patterns);
        console.log(`Successfully inserted ${insertResult.length} new patterns.`);

    } catch (error) {
        console.error('Error importing patterns:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

importPatterns();
