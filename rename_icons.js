const fs = require('fs');
const path = require('path');

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
    'ขวดน้ำ.png': 'water_bottle.png',
    'แบตเตอรี่.png': 'battery.png',
    'น้ำยาฟอกขาว.png': 'bleach.png',
    'สีทาบ้าน.png': 'paint.png',
    'น้ำมันเครื่อง.png': 'engine_oil.png',
    'ยาฆ่าแมลง.png': 'pesticide.png',
    'หมึกพิมพ์.png': 'ink_cartridge.png',
    'น้ำยาล้างห้องน้ำ.png': 'toilet_cleaner.png',
    'กาวเรซิน.png': 'resin_glue.png',
    'แอลกอฮอล์ทำความสะอาด.png': 'alcohol.png'
};

for (const [oldName, newName] of Object.entries(renameMap)) {
    const oldPath = path.join(dir, oldName);
    const newPath = path.join(dir, newName);
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed ${oldName} -> ${newName}`);
    }
}
