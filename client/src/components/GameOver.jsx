import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Confetti from './Confetti';

export default function GameOver({ stats, onReplay, keys = 0 }) {
  const navigate = useNavigate();
  const { score, correct, wrong, maxCombo, newTopRank } = stats;
  const maxMult = maxCombo >= 10 ? 5 : maxCombo >= 6 ? 3 : maxCombo >= 3 ? 2 : 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4"
    >
      <Confetti />

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-[#1a1030]/95 border border-white/10 rounded-3xl p-6 w-full max-w-xs text-center shadow-[0_0_40px_rgba(139,92,246,0.15)]"
      >
        {/* Top Badge or Emoji */}
        {newTopRank ? (
          <div>
            <img
              src={`/icons/No${newTopRank}.png`}
              alt={`Top ${newTopRank}`}
              className="w-16 h-16 mx-auto mb-1"
            />
            <p className="text-xs text-amber-300 font-bold mb-3">
              ยินดีด้วย! ติดอันดับ Top {newTopRank}!
            </p>
          </div>
        ) : (
          <div className="text-4xl mb-3">🎉</div>
        )}

        <h2 className="text-xl font-black text-gradient mb-4">การทดลองเสร็จสิ้น!</h2>

        {/* Stats */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/5">
            <span className="text-xs text-white/60">⭐ คะแนนรวม</span>
            <span className="font-nunito font-black text-xl text-gradient">{score}</span>
          </div>
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/5">
            <span className="text-xs text-white/60">✅ ตอบถูก</span>
            <span className="font-nunito font-black text-emerald-400">{correct}</span>
          </div>
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/5">
            <span className="text-xs text-white/60">❌ ตอบผิด</span>
            <span className="font-nunito font-black text-red-400">{wrong}</span>
          </div>
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/5">
            <span className="text-xs text-white/60">🔥 คอมโบสูงสุด</span>
            <span className="font-nunito font-black text-amber-400">x{maxMult}</span>
          </div>
        </div>

        {/* Key Display */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <span className="text-sm">🔑</span>
          <span className={`text-sm font-black ${keys > 0 ? 'text-amber-400' : 'text-red-400'}`}>{keys}</span>
          <span className="text-[10px] text-white/40">Key เหลือ</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onReplay}
            disabled={keys <= 0}
            className={`w-full text-sm !py-3 ${keys > 0 ? 'btn-gradient' : 'py-3 rounded-2xl bg-white/5 text-white/30 cursor-not-allowed border border-white/10'}`}
          >
            {keys > 0 ? '🔄 เล่นอีกครั้ง' : '🔒 ไม่มี Key'}
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="w-full py-2.5 rounded-2xl bg-white/5 active:bg-white/10 border border-white/10 font-bold text-sm text-violet-300"
          >
            🏆 ดูอันดับ
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 rounded-2xl bg-white/5 active:bg-white/10 border border-white/10 font-bold text-sm text-white/50"
          >
            🏠 หน้าหลัก
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
