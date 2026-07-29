import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'public', 'icons');

const renameMap = {
    'male 1.png': 'male_1.png',
    'male 2.png': 'male_2.png',
    'male 3.png': 'male_3.png',
    'male 4.png': 'male_4.png',
    'male 5.png': 'male_5.png',
    'male 6.png': 'male_6.png',
    'male 7.png': 'male_7.png',
    'female 1.png': 'female_1.png',
    'female 2.png': 'female_2.png',
    'female 3.png': 'female_3.png',
    'female 4.png': 'female_4.png',
    'female 5.png': 'female_5.png',
    'female 6.png': 'female_6.png',
    'female 7.png': 'female_7.png',
    'CD DVD Disc.png': 'cd_disc.png',
    'Gas Lighter.png': 'gas_lighter.png',
    'LPG Cooking Gas Cylinder.png': 'gas_tank.png',
    'Nail Polish Remover.png': 'nail_polish_remover.png',
    'Plastic Food Tupperware Box.png': 'tupperware_box.png',
    'Rat Poison Chemicals.png': 'rat_poison.png',
    'Rubber Car Tire.png': 'car_tire.png',
};

const keywords = [
    { key: 'ขวดน้ำ', name: 'water_bottle.png' },
    { key: 'แบตเตอรี่', name: 'battery.png' },
    { key: 'ฟอกขาว', name: 'bleach.png' },
    { key: 'สีทาบ้าน', name: 'paint.png' },
    { key: 'น้ำมันเครื่อง', name: 'engine_oil.png' },
    { key: 'ยาฆ่าแมลง', name: 'pesticide.png' },
    { key: 'หมึกพิมพ์', name: 'ink_cartridge.png' },
    { key: 'ห้องน้ำ', name: 'toilet_cleaner.png' },
    { key: 'กาว', name: 'resin_glue.png' },
    { key: 'แอลกอฮอล์', name: 'alcohol.png' }
];

if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        let newName = null;
        if (renameMap[file]) {
            newName = renameMap[file];
        } else {
            for (const k of keywords) {
                if (file.includes(k.key)) {
                    newName = k.name;
                    break;
                }
            }
        }
        if (newName && newName !== file) {
            fs.renameSync(path.join(dir, file), path.join(dir, newName));
            console.log(`Renamed: ${file} -> ${newName}`);
        }
    });
}
