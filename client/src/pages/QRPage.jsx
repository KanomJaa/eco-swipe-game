import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRPage() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const origin = window.location.origin;
    setUrl(origin && origin !== 'null' ? origin : 'http://localhost:3000');
  }, []);

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong p-8 w-full max-w-sm text-center glow-violet"
      >
        <h1 className="text-2xl font-black text-gradient mb-1">📱 สแกนเข้าเกม!</h1>
        <p className="text-sm text-white/40 mb-6">Eco-Swipe — ปัดขวาพิทักษ์โลก</p>

        {/* URL Input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="ใส่ URL ของเกม..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10
                       text-white text-sm placeholder:text-white/20
                       focus:border-violet-500/50 focus:outline-none transition-all"
          />
        </div>

        {/* QR Code */}
        {url && (
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white rounded-2xl">
              <QRCodeCanvas
                value={url}
                size={200}
                fgColor="#1a0f3c"
                bgColor="#ffffff"
                level="M"
              />
            </div>
          </div>
        )}

        {/* URL Display */}
        <div className="px-4 py-2 rounded-xl bg-white/5 text-sm font-nunito font-bold text-violet-300 break-all mb-6">
          {url}
        </div>

        <div className="text-xs text-white/30 space-y-1">
          <p>📸 เปิดกล้องมือถือแล้วสแกน QR Code</p>
          <p>🌐 รองรับ Chrome, Safari และเบราว์เซอร์อื่นๆ</p>
        </div>
      </motion.div>
    </div>
  );
}
