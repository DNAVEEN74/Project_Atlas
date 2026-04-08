import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../src/core/models/Question';
import Attempt from '../src/core/models/Attempt';
import { normalizePatternCode, normalizeSubject } from '../src/lib/patternUtils';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

function getAllQuestionJsonFiles(rootDir: string): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(rootDir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(rootDir, entry.name);
        if (entry.isDirectory()) {
            files.push(...getAllQuestionJsonFiles(fullPath));
            continue;
        }

        if (entry.isFile() && entry.name.toLowerCase().endsWith('.json') && !entry.name.toLowerCase().startsWith('tmp_')) {
            files.push(fullPath);
        }
    }

    return files.sort();
}

function normalizeJsonFiles(): {
    filesScanned: number;
    filesUpdated: number;
    rowsUpdated: number;
    unresolvedRows: number;
} {
    const root = path.resolve(__dirname, '../Jsons/questions');
    const files = getAllQuestionJsonFiles(root);

    let filesUpdated = 0;
    let rowsUpdated = 0;
    let unresolvedRows = 0;

    for (const file of files) {
        const raw = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
        let data: any;
        try {
            data = JSON.parse(raw);
        } catch {
            continue;
        }

        if (!Array.isArray(data)) continue;

        let changed = false;

        for (const row of data) {
            const subject = normalizeSubject(String(row?.subject || ''));
            if (subject && row.subject !== subject) {
                row.subject = subject;
                changed = true;
                rowsUpdated++;
            }

            const oldPattern = String(row?.pattern || '');
            const newPattern = normalizePatternCode(oldPattern, subject || String(row?.subject || ''));

            if (!newPattern) {
                unresolvedRows++;
                continue;
            }

            if (oldPattern !== newPattern) {
                row.pattern = newPattern;
                changed = true;
                rowsUpdated++;
            }
        }

        if (changed) {
            fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
            filesUpdated++;
        }
    }

    return {
        filesScanned: files.length,
        filesUpdated,
        rowsUpdated,
        unresolvedRows
    };
}

async function normalizeCollectionPatterns(
    model: mongoose.Model<any>,
    collectionName: string
): Promise<{ pairsScanned: number; pairsUpdated: number; docsUpdated: number; unresolvedPairs: number }> {
    const grouped = await model.aggregate([
        { $group: { _id: { pattern: '$pattern', subject: '$subject' }, count: { $sum: 1 } } }
    ]);

    let pairsUpdated = 0;
    let docsUpdated = 0;
    let unresolvedPairs = 0;

    for (const row of grouped) {
        const oldPattern = String(row?._id?.pattern || '');
        const subject = String(row?._id?.subject || '');
        const normalized = normalizePatternCode(oldPattern, subject);

        if (!normalized) {
            unresolvedPairs++;
            continue;
        }

        if (normalized === oldPattern) continue;

        const res = await model.updateMany(
            { pattern: oldPattern, subject },
            { $set: { pattern: normalized } }
        );
        pairsUpdated++;
        docsUpdated += res.modifiedCount || 0;
    }

    console.log(`${collectionName}: updated ${docsUpdated} documents across ${pairsUpdated} pattern-subject pairs.`);
    return {
        pairsScanned: grouped.length,
        pairsUpdated,
        docsUpdated,
        unresolvedPairs
    };
}

async function main() {
    console.log('Normalizing JSON question files...');
    const jsonSummary = normalizeJsonFiles();
    console.log(
        `JSON summary: scanned=${jsonSummary.filesScanned}, files_updated=${jsonSummary.filesUpdated}, rows_updated=${jsonSummary.rowsUpdated}, unresolved_rows=${jsonSummary.unresolvedRows}`
    );

    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB for pattern normalization.');

    try {
        const questionSummary = await normalizeCollectionPatterns(Question as any, 'questions');
        const attemptSummary = await normalizeCollectionPatterns(Attempt as any, 'attempts');

        console.log('DB summary:');
        console.log(
            `questions: scanned_pairs=${questionSummary.pairsScanned}, updated_pairs=${questionSummary.pairsUpdated}, updated_docs=${questionSummary.docsUpdated}, unresolved_pairs=${questionSummary.unresolvedPairs}`
        );
        console.log(
            `attempts: scanned_pairs=${attemptSummary.pairsScanned}, updated_pairs=${attemptSummary.pairsUpdated}, updated_docs=${attemptSummary.docsUpdated}, unresolved_pairs=${attemptSummary.unresolvedPairs}`
        );
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

main().catch((err) => {
    console.error('Pattern normalization failed:', err);
    process.exit(1);
});

