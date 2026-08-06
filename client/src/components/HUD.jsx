import { motion, AnimatePresence } from 'framer-motion';
import { getMultiplier } from '../data/items';

export default function HUD({ score, combo, lives, cardTimeLeft, cardMaxTime }) {
  const mult = getMultiplier(combo);
  const pct = cardMaxTime > 0 ? cardTimeLeft / cardMaxTime : 1;

  const timerColor = pct <= 0.25 ? 'from-red-500 to-red-400'
    : pct <= 0.5 ? 'from-amber-500 to-yellow-400'
    : 'from-violet-500 to-cyan-400';

  const comboColor = mult >= 5 ? 'text-orange-400'
    : mult >= 3 ? 'text-amber-400'
    : mult >= 2 ? 'text-pink-400'
    : 'text-white/60';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 pt-3 pb-2">
      {/* HUD Row */}
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {/* Score */}
        <div className="glass px-4 py-2 text-center min-w-[90px]">
          <div className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Score</div>
          <motion.div
            key={score}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            className="text-xl font-nunito font-black text-gradient"
          >
            {score}
          </motion.div>
        </div>

        {/* Timer */}
        <div className="glass px-4 py-2 text-center min-w-[80px]">
          <div className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Timer</div>
          <div className={`text-xl font-nunito font-black ${pct <= 0.25 ? 'text-red-400 animate-pulse' : pct <= 0.5 ? 'text-amber-400' : 'text-white'}`}>
            {cardTimeLeft.toFixed(1)}s
          </div>
        </div>

        {/* Combo */}
        <div className="glass px-4 py-2 text-center min-w-[80px]">
          <div className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Combo</div>
          <motion.div
            key={mult}
            initial={{ scale: 1.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className={`text-xl font-nunito font-black ${comboColor}`}
          >
            x{mult}
          </motion.div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="max-w-lg mx-auto mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${timerColor}`}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Lives - top left floating */}
      <div className="fixed top-3 left-3 z-50 flex gap-1">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            animate={i >= lives ? { scale: 0.7, opacity: 0.3 } : { scale: 1, opacity: 1 }}
            className="text-lg"
          >
            {i < lives ? '❤️' : '🖤'}
          </motion.span>
        ))}
      </div>
    </header>
  );
}
