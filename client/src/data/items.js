export const ITEMS = [
  // Recyclable (รูปที่ 1 - 18 รายการ)
  { name: 'สมุดโน้ต', type: 'recycle', hint: 'กระดาษขาว/สมุดเก่า', icon: '/icons/notebook.webp' },
  { name: 'ยางรถจักรยานยนต์', type: 'recycle', hint: 'ยางสังเคราะห์', icon: '/icons/motorcycle-tires.webp' },
  { name: 'สายไฟเก่า', type: 'recycle', hint: 'โลหะทองแดง', icon: '/icons/wire.webp' },
  { name: 'ขวดน้ำมันพืช', type: 'recycle', hint: 'พลาสติก PET', icon: '/icons/vegetable-oil.webp' },
  { name: 'กะละมังพลาสติก', type: 'recycle', hint: 'พลาสติก PP', icon: '/icons/plastic-basin.webp' },
  { name: 'หนังสือพิมพ์', type: 'recycle', hint: 'กระดาษสิ่งพิมพ์', icon: '/icons/newspaper.webp' },
  { name: 'ฟิล์มยืดพลาสติก', type: 'recycle', hint: 'พลาสติก LDPE', icon: '/icons/transparent-film.webp' },
  { name: 'แกลลอนสะอาด', type: 'recycle', hint: 'พลาสติก HDPE', icon: '/icons/clean-gallon.webp' },
  { name: 'ขวดแก้ว', type: 'recycle', hint: 'แก้วรีไซเคิล', icon: '/icons/glass-bottle.webp' },
  { name: 'กระป๋องอลูมิเนียม', type: 'recycle', hint: 'โลหะอลูมิเนียม', icon: '/icons/can.webp' },
  { name: 'ถาดอลูมิเนียม', type: 'recycle', hint: 'โลหะฟอยล์', icon: '/icons/aluminum-tray.webp' },
  { name: 'แกนกระดาษทิชชู่', type: 'recycle', hint: 'กระดาษรีไซเคิล', icon: '/icons/toilet-paper-roll-core.webp' },
  { name: 'สายยางรดน้ำ', type: 'recycle', hint: 'พลาสติก PVC', icon: '/icons/garden-hose.webp' },
  { name: 'ถุงพลาสติกใส', type: 'recycle', hint: 'พลาสติก PE', icon: '/icons/plastic-bag.webp' },
  { name: 'ตะกร้าผ้าพลาสติก', type: 'recycle', hint: 'พลาสติก PP', icon: '/icons/laundry-basket.webp' },
  { name: 'น็อตและสกรู', type: 'recycle', hint: 'โลหะเหล็ก/ทองเหลือง', icon: '/icons/nut.webp' },
  { name: 'สายรัดพลาสติก', type: 'recycle', hint: 'พลาสติก PP', icon: '/icons/plastic-straps.webp' },
  { name: 'ถังน้ำพลาสติก', type: 'recycle', hint: 'พลาสติก PC', icon: '/icons/plastic-water-tank.webp' },

  // Hazardous (รูปที่ 2 - 13 รายการ)
  { name: 'แบตเตอรี่โน๊ตบุ๊ค', type: 'hazard', hint: 'ลิเธียมไอออน/อันตราย', icon: '/icons/laptop-battery.webp' },
  { name: 'แบตเตอรี่รถยนต์', type: 'hazard', hint: 'ตะกั่ว-กรด/อันตรายร้ายแรง', icon: '/icons/car-battery.webp' },
  { name: 'กระป๋องสีสเปรย์', type: 'hazard', hint: 'แก๊สอัดความดัน/ไวไฟ', icon: '/icons/color-spray.webp' },
  { name: 'กระป๋องสเปรย์ฉีดผม', type: 'hazard', hint: 'แก๊สไวไฟ/สารเคมี', icon: '/icons/hair-spray.webp' },
  { name: 'น้ำยาฟอกขาว (ไฮเตอร์)', type: 'hazard', hint: 'สารเคมีกัดกร่อน', icon: '/icons/hiter.webp' },
  { name: 'เข็มฉีดยาใช้แล้ว', type: 'hazard', hint: 'ขยะติดเชื้อ/อันตราย', icon: '/icons/syringe.webp' },
  { name: 'กระป๋องสีทาเหล็ก', type: 'hazard', hint: 'สารเคมีไวไฟ/สารระเหย', icon: '/icons/metallic-colors.webp' },
  { name: 'ปี๊บน้ำมันก๊าด', type: 'hazard', hint: 'วัตถุไวไฟร้ายแรง', icon: '/icons/kerosene.webp' },
  { name: 'ขวดกาวลาเท็กซ์', type: 'hazard', hint: 'สารเคมี/กาว', icon: '/icons/latex-glue.webp' },
  { name: 'ยากำจัดวัชพืช', type: 'hazard', hint: 'สารเคมีเป็นพิษร้ายแรง', icon: '/icons/herbicide.webp' },
  { name: 'โทรทัศน์จอแก้วเก่า', type: 'hazard', hint: 'ขยะอิเล็กทรอนิกส์/สารพิษ', icon: '/icons/tv.webp' },
  { name: 'น้ำยาล้างห้องน้ำ', type: 'hazard', hint: 'กรดกัดกร่อนรุนแรง', icon: '/icons/clean-up.webp' },
  { name: 'ถ่านไฟฉาย', type: 'hazard', hint: 'โลหะหนัก/ตะกั่ว/ปรอท', icon: '/icons/battery.webp' },
  { name: 'แกลลอนน้ำมันเครื่อง', type: 'hazard', hint: 'ปิโตรเลียม/ไวไฟ', icon: '/icons/engine-oil.webp' },
  { name: 'น้ำยาหล่อเย็นเครื่องยนต์', type: 'hazard', hint: 'สารเคมีเอทิลีนไกลคอล', icon: '/icons/premixed-coolant.webp' },
  { name: 'สเปรย์กำจัดแมลง (ไบกอน)', type: 'hazard', hint: 'แก๊สอัดความดัน/สารพิษ', icon: '/icons/baygon.webp' },
  { name: 'สเปรย์กำจัดปลวก (เชนไดร้ท์)', type: 'hazard', hint: 'แก๊สอัดความดัน/สารพิษ', icon: '/icons/chaindrite.webp' },
];

export const GAME_CONSTANTS = {
  BASE_SCORE: 10,
  WRONG_PENALTY: -100,
  COMBO_THRESHOLDS: [
    { streak: 10, multiplier: 5 },
    { streak: 6, multiplier: 3 },
    { streak: 3, multiplier: 2 },
    { streak: 0, multiplier: 1 },
  ],
};

export function getMultiplier(combo) {
  for (const t of GAME_CONSTANTS.COMBO_THRESHOLDS) {
    if (combo >= t.streak) return t.multiplier;
  }
  return 1;
}

export function getCardTimeLimit(score) {
  if (score < 500) return 2.5;
  if (score < 1500) return 2.0;
  if (score < 3000) return 1.7;
  if (score < 5000) return 1.4;
  if (score < 8000) return 1.2;
  return 1.0;
}

export function preloadAllImages() {
  if (typeof window === 'undefined') return;
  ITEMS.forEach(item => {
    if (item.icon) {
      const img = new Image();
      img.src = item.icon;
    }
  });
}
