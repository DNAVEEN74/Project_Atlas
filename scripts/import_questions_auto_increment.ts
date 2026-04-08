import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Question from '../src/core/models/Question';
import { normalizePatternCode } from '../src/lib/patternUtils';

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
        console.error('Usage: npx tsx scripts/import_questions_auto_increment.ts <path_to_json_or_directory>');
        process.exit(1);
    }

    await connectToDatabase();

    try {
        const relativePath = args[0];
        const absolutePath = path.resolve(process.cwd(), relativePath);

        if (!fs.existsSync(absolutePath)) {
            console.error(`Path not found: ${absolutePath}`);
            process.exit(1);
        }

        const stat = fs.statSync(absolutePath);
        const filesToImport: string[] = [];

        if (stat.isDirectory()) {
            const dirFiles = fs
                .readdirSync(absolutePath)
                .filter((f) => f.toLowerCase().endsWith('.json'))
                .sort();

            if (dirFiles.length === 0) {
                console.log(`No JSON files found in directory: ${absolutePath}`);
                return;
            }

            for (const f of dirFiles) {
                filesToImport.push(path.join(absolutePath, f));
            }
        } else {
            filesToImport.push(absolutePath);
        }

        const normalizeText = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();
        const normalizeSubject = (subjectRaw: string) => {
            const s = String(subjectRaw || '').trim().toUpperCase();
            if (s === 'QUANT' || s === 'REASONING') return s;
            if (s === 'QUANTITATIVE APTITUDE') return 'QUANT';
            if (s.includes('REASONING')) return 'REASONING';
            return s;
        };
        const normalizeCorrectOption = (q: any): string => {
            const raw = q?.correct_option ?? q?.correctOption ?? q?.correct_answer ?? q?.correctAnswer;
            if (raw === null || raw === undefined) return '';
            const str = String(raw).trim().toUpperCase();
            if (['A', 'B', 'C', 'D'].includes(str)) return str;
            if (['1', '2', '3', '4'].includes(str)) return ['A', 'B', 'C', 'D'][parseInt(str, 10) - 1];
            return '';
        };
        const normalizeDifficulty = (difficultyRaw: string) => {
            const s = String(difficultyRaw || '').trim().toUpperCase();
            if (s === 'EASY' || s === 'MEDIUM' || s === 'HARD') return s;
            return 'MEDIUM';
        };
        const buildKey = (q: any) => {
            const subject = normalizeSubject(String(q?.subject || ''));
            const shift = String(q?.source?.shift || '').trim();
            const text = normalizeText(String(q?.text || ''));
            return `${subject}||${shift}||${text}`;
        };

        const runSummary: Array<{
            file: string;
            total: number;
            unique_in_file: number;
            duplicates_in_file: number;
            duplicates_in_db: number;
            skipped_invalid: number;
            inserted: number;
            start_question_number: number | null;
            end_question_number: number | null;
        }> = [];

        // Find the current maximum question_number once, then keep incrementing.
        const lastQuestion = await Question.findOne().sort({ question_number: -1 }).select('question_number');
        let nextQuestionNumber = (lastQuestion?.question_number || 0) + 1;

        console.log(`Starting auto-increment from question_number: ${nextQuestionNumber}`);
        console.log(`Processing ${filesToImport.length} file(s)...`);

        for (const filePath of filesToImport) {
            try {
                console.log('\n' + '='.repeat(60));
                console.log(`Reading: ${filePath}`);
                const rawData = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '');
                const questionsData = JSON.parse(rawData);

                if (!Array.isArray(questionsData)) {
                    console.error(`Invalid JSON format in ${filePath}: expected an array.`);
                    continue;
                }

                const total = questionsData.length;
                const seenInFile = new Set<string>();
                const dedupedInFile: any[] = [];
                let duplicatesInFile = 0;

                for (const q of questionsData) {
                    const key = buildKey(q);
                    if (!key || key.endsWith('||')) {
                        continue;
                    }
                    if (seenInFile.has(key)) {
                        duplicatesInFile++;
                        continue;
                    }
                    seenInFile.add(key);
                    dedupedInFile.push(q);
                }

                const shifts = Array.from(
                    new Set(
                        dedupedInFile
                            .map((q) => String(q?.source?.shift || '').trim())
                            .filter((v) => v.length > 0)
                    )
                );

                const subjects = Array.from(
                    new Set(
                        dedupedInFile
                            .map((q) => normalizeSubject(String(q?.subject || '')))
                            .filter((v) => v.length > 0)
                    )
                );

                const existing = await Question.find({
                    'source.shift': { $in: shifts },
                    subject: { $in: subjects }
                }).select('subject source.shift text').lean();

                const existingKeys = new Set<string>(
                    existing.map((q: any) => {
                        const subject = normalizeSubject(String(q?.subject || ''));
                        const shift = String(q?.source?.shift || '').trim();
                        const text = normalizeText(String(q?.text || ''));
                        return `${subject}||${shift}||${text}`;
                    })
                );

                const toInsertRaw: any[] = [];
                let duplicatesInDb = 0;
                let skippedInvalid = 0;
                for (const q of dedupedInFile) {
                    const key = buildKey(q);
                    if (existingKeys.has(key)) {
                        duplicatesInDb++;
                        continue;
                    }

                    const subject = normalizeSubject(String(q?.subject || ''));
                    const correctOption = normalizeCorrectOption(q);
                    const text = String(q?.text || '').trim();
                    const shift = String(q?.source?.shift || '').trim();
                    const year = Number(q?.source?.year || 0);
                    const pattern = normalizePatternCode(String(q?.pattern || ''), subject);

                    if (!text || !shift || !year || !['QUANT', 'REASONING'].includes(subject) || !correctOption || !pattern) {
                        skippedInvalid++;
                        continue;
                    }

                    const options = Array.isArray(q?.options) ? q.options : [];
                    if (options.length !== 4) {
                        skippedInvalid++;
                        continue;
                    }

                    const normalizedOptions = options.map((opt: any, idx: number) => ({
                        id: String(opt?.id || ['A', 'B', 'C', 'D'][idx] || '').toUpperCase(),
                        text: String(opt?.text || '').trim(),
                        image: opt?.image ?? ''
                    }));

                    if (normalizedOptions.some((opt: any) => !opt.id || !opt.text)) {
                        skippedInvalid++;
                        continue;
                    }

                    toInsertRaw.push({
                        ...q,
                        text,
                        subject,
                        pattern,
                        difficulty: normalizeDifficulty(String(q?.difficulty || '')),
                        correct_option: correctOption,
                        source: {
                            exam: String(q?.source?.exam || 'SSC CGL 2024'),
                            year,
                            shift
                        },
                        options: normalizedOptions,
                        stats: {
                            attempt_count: q?.stats?.attempt_count ?? 0,
                            accuracy_rate: q?.stats?.accuracy_rate ?? 0,
                            avg_time_ms: q?.stats?.avg_time_ms ?? 0
                        }
                    });
                }

                const startNumber = toInsertRaw.length > 0 ? nextQuestionNumber : null;
                const questionsToInsert = toInsertRaw.map((q: any, index: number) => ({
                    ...q,
                    question_number: nextQuestionNumber + index,
                    is_live: q.is_live ?? false,
                    needs_review: q.needs_review ?? true,
                    created_at: new Date()
                }));

                if (questionsToInsert.length > 0) {
                    const result = await Question.insertMany(questionsToInsert);
                    console.log(`Inserted ${result.length} question(s).`);
                    nextQuestionNumber += result.length;
                } else {
                    console.log('No new questions to insert (all duplicates in DB or file).');
                }

                const insertedCount = questionsToInsert.length;
                const endNumber = insertedCount > 0 ? (startNumber as number) + insertedCount - 1 : null;

                runSummary.push({
                    file: path.basename(filePath),
                    total,
                    unique_in_file: dedupedInFile.length,
                    duplicates_in_file: duplicatesInFile,
                    duplicates_in_db: duplicatesInDb,
                    skipped_invalid: skippedInvalid,
                    inserted: insertedCount,
                    start_question_number: startNumber,
                    end_question_number: endNumber
                });
            } catch (fileError) {
                console.error(`Failed to process ${filePath}:`, fileError);
                runSummary.push({
                    file: path.basename(filePath),
                    total: 0,
                    unique_in_file: 0,
                    duplicates_in_file: 0,
                    duplicates_in_db: 0,
                    skipped_invalid: 0,
                    inserted: 0,
                    start_question_number: null,
                    end_question_number: null
                });
                continue;
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('IMPORT SUMMARY');
        console.log('='.repeat(60));
        let totalInserted = 0;
        for (const row of runSummary) {
            totalInserted += row.inserted;
            console.log(
                `${row.file} | total=${row.total} unique_in_file=${row.unique_in_file} dup_file=${row.duplicates_in_file} dup_db=${row.duplicates_in_db} invalid=${row.skipped_invalid} inserted=${row.inserted}`
            );
        }
        console.log(`Total inserted: ${totalInserted}`);
        console.log(`Next question_number will start from: ${nextQuestionNumber}`);

    } catch (error) {
        console.error('Error importing questions:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

importQuestions();
