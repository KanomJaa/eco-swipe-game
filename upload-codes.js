/**
 * Upload codes to the live server (Render)
 * Usage: node upload-codes.js
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SERVER = 'https://eco-swipe-game.onrender.com';

const codesText = readFileSync(join(__dirname, 'codes-list.txt'), 'utf-8');
const allCodes = codesText.trim().split('\n').map(c => c.trim()).filter(Boolean);

console.log(`Uploading ${allCodes.length} codes to ${SERVER}...`);

// Send in batches of 100
const BATCH = 100;
let total = 0;

for (let i = 0; i < allCodes.length; i += BATCH) {
  const batch = allCodes.slice(i, i + BATCH);
  try {
    const res = await fetch(`${SERVER}/api/generate-codes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codes: batch, keysPerRedeem: 3, maxUses: 1 }),
    });
    const result = await res.json();
    total += result.created?.length || 0;
    console.log(`  Batch ${Math.floor(i / BATCH) + 1}: ${result.created?.length || 0} codes uploaded`);
  } catch (err) {
    console.error(`  Batch ${Math.floor(i / BATCH) + 1} failed:`, err.message);
  }
}

console.log(`\n✓ Done! ${total} codes uploaded to server.`);
