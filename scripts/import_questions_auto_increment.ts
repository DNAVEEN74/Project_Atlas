import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Question from '../src/core/models/Question';

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

async function importQuestions() {
    const args = process.argv.slice(2);
    if (args.length !== 1) {
        console.error('Usage: npx tsx scripts/import_questions_auto_increment.ts <path_to_json>');
        process.exit(1);
    }

    const relativePath = args[0];
    const absolutePath = path.resolve(process.cwd(), relativePath);

    if (!fs.existsSync(absolutePath)) {
        console.error(`File not found: ${absolutePath}`);
        process.exit(1);
    }

    await connectToDatabase();

    try {
        console.log(`Reading questions from: ${absolutePath}`);
        const rawData = fs.readFileSync(absolutePath, 'utf-8');
        const questionsData = JSON.parse(rawData);

        if (!Array.isArray(questionsData)) {
            console.error('Invalid JSON format: Expected an array of questions.');
            process.exit(1);
        }

        console.log(`Found ${questionsData.length} questions to import.`);

        // Find the current maximum question_number
        const lastQuestion = await Question.findOne().sort({ question_number: -1 }).select('question_number');
        let nextQuestionNumber = (lastQuestion?.question_number || 0) + 1;

        console.log(`Starting auto-increment from question_number: ${nextQuestionNumber}`);

        const questionsToInsert = questionsData.map((q: any, index: number) => ({
            ...q,
            question_number: nextQuestionNumber + index,
            // Ensure default fields if missing
            is_live: q.is_live ?? false,
            needs_review: q.needs_review ?? true,
            created_at: new Date()
        }));

        const result = await Question.insertMany(questionsToInsert);
        console.log(`Successfully imported ${result.length} questions.`);
        console.log(`Last assigned question_number: ${nextQuestionNumber + result.length - 1}`);

    } catch (error) {
        console.error('Error importing questions:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

importQuestions();
