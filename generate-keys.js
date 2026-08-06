/**
 * Generate 500 unique single-use codes and:
 * 1. Save to database via API (if server running) + local JSON
 * 2. Create a printable HTML file for cutting into paper slips
 *
 * Usage: node generate-keys.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOTAL_CODES = 500;
const KEYS_PER_CODE = 3;

// Characters that are easy to read (no 0/O, 1/I/L confusion)
const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function generateCode() {
  let code = 'ECO-';
  for (let i = 0; i < 5; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

function generateUniqueCodes(count) {
  const codes = new Set();
  while (codes.size < count) {
    codes.add(generateCode());
  }
  return [...codes];
}

function createPrintableHTML(codes) {
  const rows = [];
  for (let i = 0; i < codes.length; i += 5) {
    const rowCodes = codes.slice(i, i + 5);
    const cells = rowCodes.map(code => `
      <td>
        <div class="card">
          <div class="title">ปัดขวาพิทักษ์โลก</div>
          <div class="subtitle">งานวันวิทยาศาสตร์ ม.ราชภัฏศรีสะเกษ</div>
          <div class="key-icon">🔑</div>
          <div class="code">${code}</div>
          <div class="info">ใช้โค้ดนี้ในเกมเพื่อรับ ${KEYS_PER_CODE} Key</div>
          <div class="uses">ใช้ได้ 1 ครั้ง</div>
        </div>
      </td>`).join('');
    rows.push(`<tr>${cells}</tr>`);
  }

  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>Key Codes - ปัดขวาพิทักษ์โลก (${codes.length} ใบ)</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #fff; }

  @media print {
    body { margin: 0; }
    .no-print { display: none !important; }
    table { page-break-inside: auto; }
    tr { page-break-inside: avoid; }
  }

  .no-print {
    background: #7c3aed; color: white; padding: 16px 24px;
    text-align: center; font-size: 14px;
  }
  .no-print button {
    background: white; color: #7c3aed; border: none; padding: 8px 24px;
    border-radius: 8px; font-weight: bold; cursor: pointer; margin-left: 12px;
    font-size: 14px;
  }

  table {
    width: 100%; border-collapse: collapse;
    margin: 0 auto;
  }
  td {
    width: 20%; padding: 4px;
    vertical-align: top;
  }
  .card {
    border: 1.5px dashed #999;
    border-radius: 8px;
    padding: 10px 8px;
    text-align: center;
    height: 130px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2px;
  }
  .title {
    font-weight: 900; font-size: 10px; color: #7c3aed;
  }
  .subtitle {
    font-size: 7px; color: #888;
  }
  .key-icon {
    font-size: 18px; margin: 2px 0;
  }
  .code {
    font-family: 'Courier New', monospace;
    font-size: 16px; font-weight: 900;
    letter-spacing: 2px; color: #1a1a2e;
    background: #f3f0ff;
    padding: 3px 12px;
    border-radius: 6px;
  }
  .info {
    font-size: 7px; color: #666; margin-top: 2px;
  }
  .uses {
    font-size: 7px; color: #e11d48; font-weight: bold;
  }
</style>
</head>
<body>
  <div class="no-print">
    ทั้งหมด ${codes.length} โค้ด (${codes.length / 5} แถว × 5 คอลัมน์) — ตัดตามเส้นประ
    <button onclick="window.print()">🖨️ พิมพ์</button>
  </div>
  <table>
    ${rows.join('\n')}
  </table>
</body>
</html>`;
}

// --- Main ---
console.log(`Generating ${TOTAL_CODES} unique codes...`);
const codes = generateUniqueCodes(TOTAL_CODES);
console.log(`✓ Generated ${codes.length} codes (format: ECO-XXXXX)`);

// Save to local JSON data file
const dataPath = join(__dirname, 'data.json');
let data = { players: {}, scores: {} };
if (existsSync(dataPath)) {
  try { data = JSON.parse(readFileSync(dataPath, 'utf-8')); } catch {}
}
if (!data.codes) data.codes = {};

let newCount = 0;
for (const code of codes) {
  if (!data.codes[code]) {
    data.codes[code] = {
      code,
      keysPerRedeem: KEYS_PER_CODE,
      maxUses: 1,
      usedBy: [],
      createdAt: new Date().toISOString()
    };
    newCount++;
  }
}
writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`✓ Saved ${newCount} new codes to data.json`);

// Try to save to server API too
try {
  const res = await fetch('http://localhost:3000/api/generate-codes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codes, keysPerRedeem: KEYS_PER_CODE, maxUses: 1 }),
  });
  const result = await res.json();
  console.log(`✓ Saved ${result.created?.length || 0} codes to server API`);
} catch {
  console.log('⚠ Server not running — codes saved to data.json only. They will sync when server starts.');
}

// Generate printable HTML
const htmlPath = join(__dirname, 'print-keys.html');
writeFileSync(htmlPath, createPrintableHTML(codes));
console.log(`✓ Printable page saved to: print-keys.html`);
console.log(`\nOpen print-keys.html in browser → กด "พิมพ์" → ตัดตามเส้นประ`);

// Also save codes list as plain text
const txtPath = join(__dirname, 'codes-list.txt');
writeFileSync(txtPath, codes.join('\n'));
console.log(`✓ Plain text list saved to: codes-list.txt`);
