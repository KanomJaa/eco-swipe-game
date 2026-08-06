import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Confetti from './Confetti';

export default function GameOver({ stats, onReplay }) {
  const navigate = useNavigate();
  const { score, correct, wrong, maxCombo, newTopRank } = stats;
  const maxMult = maxCombo >= 10 ? 5 : maxCombo >= 6 ? 3 : maxCombo >= 3 ? 2 : 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <Confetti />

      <motion.div
        initial={{ scale: 0.7, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="glass-strong p-8 w-full max-w-sm text-center glow-violet"
      >
        {/* Top Badge or Emoji */}
        {newTopRank ? (
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <img
              src={`/icons/No${newTopRank}.png`}
              alt={`Top ${newTopRank}`}
              className="w-20 h-20 mx-auto mb-2 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]"
            />
            <p className="text-sm text-amber-300 font-bold mb-4">
              ยินดีด้วย! ติดอันดับ Top {newTopRank}!
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="text-5xl mb-4"
          >
            🎉
          </motion.div>
        )}

        <h2 className="text-2xl font-black text-gradient mb-6">การทดลองเสร็จสิ้น!</h2>

        {/* Stats */}
        <div className="space-y-3 mb-8">
          {[
            { icon: '⭐', label: 'คะแนนรวม', value: score, style: 'text-gradient text-2xl' },
            { icon: '✅', label: 'ตอบถูก', value: correct, style: 'text-emerald-400' },
            { icon: '❌', label: 'ตอบผิด', value: wrong, style: 'text-red-400' },
            { icon: '🔥', label: 'คอมโบสูงสุด', value: `x${maxMult}`, style: 'text-amber-400' },
          ].map(({ icon, label, value, style }) => (
            <div key={label} className="flex items-center justify-between px-4 py-2 rounded-xl bg-white/5">
              <span className="text-sm text-white/60">{icon} {label}</span>
              <span className={`font-nunito font-black ${style}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button onClick={onReplay} className="btn-gradient w-full text-base">
            🔄 เล่นอีกครั้ง
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-violet-300 transition-all"
          >
            🏆 ดูอันดับ
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
