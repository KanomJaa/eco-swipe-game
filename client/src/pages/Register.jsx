import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { checkPlayer, registerPlayer } from '../utils/api';

const MALE_AVATARS = Array.from({ length: 7 }, (_, i) => `icons/male_${i + 1}.png`);
const FEMALE_AVATARS = Array.from({ length: 7 }, (_, i) => `icons/female_${i + 1}.png`);

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('icons/male_1.png');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkPlayer()
      .then(data => {
        if (data.registered && data.nickname) {
          sessionStorage.setItem('playerNickname', data.nickname);
          sessionStorage.setItem('playerAvatar', data.avatar || 'icons/male_1.png');
          navigate('/game', { replace: true });
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed || trimmed.length < 2) {
      setError('ชื่อต้องมีอย่างน้อย 2 ตัวอักษร');
      return;
    }
    setError('');
    setShowAvatarPicker(true);
  }

  async function handleConfirm() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const data = await registerPlayer(nickname.trim(), selectedAvatar);
      if (data.success) {
        sessionStorage.setItem('playerNickname', data.nickname);
        sessionStorage.setItem('playerAvatar', data.avatar);
        navigate('/game');
      } else {
        setShowAvatarPicker(false);
        setError(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch {
      setShowAvatarPicker(false);
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Mascot */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-center mb-6"
        >
          <span className="text-7xl">🧪</span>
        </motion.div>

        {/* Card */}
        <div className="glass-strong p-8 glow-violet">
          <h1 className="text-3xl font-black text-center text-gradient mb-2">
            ปัดขวาพิทักษ์โลก
          </h1>
          <p className="text-center text-white/40 text-sm mb-8">
            คัดแยกขยะให้ถูกประเภท — ลงทะเบียนเข้าร่วม!
          </p>

          <form onSubmit={handleSubmit}>
            <div className={`relative mb-2 transition-all ${error ? 'animate-shake' : ''}`}>
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔬</span>
              <input
                type="text"
                value={nickname}
                onChange={e => { setNickname(e.target.value); setError(''); }}
                placeholder="ชื่อเล่น..."
                maxLength={16}
                autoFocus
                className="w-full pl-12 pr-16 py-4 rounded-2xl bg-white/5 border border-white/10
                           text-white placeholder:text-white/20
                           focus:border-violet-500/50 focus:bg-white/10 focus:outline-none
                           transition-all duration-300"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30">
                {nickname.length}/16
              </span>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-pink-400 text-sm mb-4 px-1"
              >
                {error}
              </motion.p>
            )}

            <button type="submit" className="btn-gradient w-full mt-4 text-lg">
              เริ่มทดลอง! 🚀
            </button>
          </form>

          <p className="text-center text-white/20 text-xs mt-4">
            💡 ชื่อต้องมี 2-16 ตัวอักษร
          </p>
        </div>
      </motion.div>

      {/* Avatar Picker Modal */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              className="glass-strong p-6 w-full max-w-sm glow-violet"
            >
              <h2 className="text-xl font-bold text-center mb-1">👤 เลือกรูปโปรไฟล์</h2>
              <p className="text-center text-white/40 text-xs mb-5">เลือกอวตารของคุณ</p>

              {/* Male */}
              <p className="text-xs text-white/40 mb-2 px-1">♂️ ชาย</p>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {MALE_AVATARS.map(path => (
                  <button
                    key={path}
                    onClick={() => setSelectedAvatar(path)}
                    className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all
                      ${selectedAvatar === path
                        ? 'border-violet-400 scale-110 shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                        : 'border-transparent hover:border-white/20'
                      }`}
                  >
                    <img src={`/${path}`} alt="avatar" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Female */}
              <p className="text-xs text-white/40 mb-2 px-1">♀️ หญิง</p>
              <div className="grid grid-cols-7 gap-2 mb-6">
                {FEMALE_AVATARS.map(path => (
                  <button
                    key={path}
                    onClick={() => setSelectedAvatar(path)}
                    className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all
                      ${selectedAvatar === path
                        ? 'border-pink-400 scale-110 shadow-[0_0_12px_rgba(236,72,153,0.4)]'
                        : 'border-transparent hover:border-white/20'
                      }`}
                  >
                    <img src={`/${path}`} alt="avatar" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="btn-gradient w-full text-base disabled:opacity-50"
              >
                {submitting ? 'กำลังบันทึก...' : 'เริ่มทดลอง! 🚀'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
