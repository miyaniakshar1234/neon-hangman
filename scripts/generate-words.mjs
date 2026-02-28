import fs from 'fs';
import path from 'path';

const CATEGORIES = [
    'technology', 'animals', 'geography', 'movies', 'science',
    'mythology', 'gaming', 'history', 'anime', 'food',
    'music', 'sports', 'literature', 'space', 'magic', 'art', 'nature', 'business', 'medicine', 'politics'
];

async function fetchWords(topic) {
    const url = `https://api.datamuse.com/words?ml=${topic}&md=d&max=1000`;
    const res = await fetch(url);
    const data = await res.json();

    const validWords = [];
    const minClueLength = 10;

    for (const item of data) {
        if (item.word.includes(' ') || item.word.includes('-') || !/^[a-zA-Z]+$/.test(item.word)) continue;
        if (!item.defs || item.defs.length === 0) continue;

        // Pick first valid definition
        let clue = item.defs[0].split('\t')[1];

        // Clean up clue (remove words in parentheses at the start if it exists, etc)
        clue = clue.replace(/^\(.+?\)\s*/, '');
        clue = clue.replace(/\[.+?\]\s*/g, '');

        // Remove "Short for XYZ" etc
        if (clue.startsWith('Short for')) continue;

        // Clean up weird definitions
        if (clue.length > minClueLength && !clue.includes('A formal spelling of') && !clue.includes('Alternative spelling of')) {
            // Capitalize first letter
            clue = clue.charAt(0).toUpperCase() + clue.slice(1);
            validWords.push({ word: item.word.toUpperCase(), clue });
        }
    }

    // Shuffle words for randomness
    validWords.sort(() => 0.5 - Math.random());

    return validWords;
}

const outDir = path.join(process.cwd(), 'lib/data/words');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

async function main() {
    const exportsData = [];
    let totalWordsGenerated = 0;

    for (const topic of CATEGORIES) {
        console.log(`Fetching ${topic}...`);
        const words = await fetchWords(topic);
        console.log(`Got ${words.length} valid words for ${topic}`);
        totalWordsGenerated += words.length;

        // Categorize by difficulty using word length
        const difficulties = {
            noob: [],
            casual: [],
            pro: [],
            veteran: [],
            godlike: []
        };

        for (const w of words) {
            const len = w.word.length;
            if (len <= 4) difficulties.noob.push(w);
            else if (len <= 6) difficulties.casual.push(w);
            else if (len <= 8) difficulties.pro.push(w);
            else if (len <= 10) difficulties.veteran.push(w);
            else difficulties.godlike.push(w);
        }

        // Some categories might not have enough words in some difficulties, but that's fine.

        const fileContent = `import { WordData } from '../../words';\n\n` +
            `export const ${topic}Words: Record<'noob' | 'casual' | 'pro' | 'veteran' | 'godlike', WordData[]> = {\n` +
            `  noob: ${JSON.stringify(difficulties.noob, null, 2)},\n` +
            `  casual: ${JSON.stringify(difficulties.casual, null, 2)},\n` +
            `  pro: ${JSON.stringify(difficulties.pro, null, 2)},\n` +
            `  veteran: ${JSON.stringify(difficulties.veteran, null, 2)},\n` +
            `  godlike: ${JSON.stringify(difficulties.godlike, null, 2)}\n` +
            `};\n`;

        fs.writeFileSync(path.join(outDir, `${topic}.ts`), fileContent);
        exportsData.push(topic);
    }

    // Create index
    const indexContent = exportsData.map(t => `import { ${t}Words } from './${t}';`).join('\n') +
        `\n\nexport const EXPANDED_WORDS = {\n` +
        exportsData.map(t => `  ${t}: ${t}Words`).join(',\n') +
        `\n};\n`;

    fs.writeFileSync(path.join(outDir, 'index.ts'), indexContent);
    console.log(`Done! Total words generated: ${totalWordsGenerated}`);
}

main().catch(console.error);
