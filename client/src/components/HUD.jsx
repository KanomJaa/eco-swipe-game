import { motion } from 'framer-motion';
import { getMultiplier } from '../data/items';

export default function HUD({ score, combo, lives, cardTimeLeft, cardMaxTime, children }) {
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
    <header
      className="fixed top-0 left-0 right-0 z-40 px-3 pb-2"
      style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
    >
      {/* Row 1: Score | Timer | Combo */}
      <div className="flex items-center gap-2 max-w-lg mx-auto">
        <div className="glass px-2 py-1.5 text-center flex-1 min-w-0 !rounded-xl">
          <div className="text-[8px] uppercase tracking-wider text-white/40">Score</div>
          <motion.div
            key={score}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.12 }}
            className="text-base font-nunito font-black text-gradient leading-tight"
          >
            {score}
          </motion.div>
        </div>

        <div className="glass px-2 py-1.5 text-center flex-1 min-w-0 !rounded-xl">
          <div className="text-[8px] uppercase tracking-wider text-white/40">Timer</div>
          <div className={`text-base font-nunito font-black leading-tight ${pct <= 0.25 ? 'text-red-400' : pct <= 0.5 ? 'text-amber-400' : 'text-white'}`}>
            {cardTimeLeft.toFixed(1)}s
          </div>
        </div>

        <div className="glass px-2 py-1.5 text-center flex-1 min-w-0 !rounded-xl">
          <div className="text-[8px] uppercase tracking-wider text-white/40">Combo</div>
          <motion.div
            key={mult}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.12 }}
            className={`text-base font-nunito font-black leading-tight ${comboColor}`}
          >
            x{mult}
          </motion.div>
        </div>
      </div>

      {/* Row 2: Timer Bar */}
      <div className="max-w-lg mx-auto mt-1.5 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${timerColor} transition-[width] duration-100`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>

      {/* Row 3: Lives (left) + TopWidget slot (right) */}
      <div className="flex items-center justify-between max-w-lg mx-auto mt-2">
        <div className="flex gap-0.5">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className={`text-sm leading-none transition-opacity duration-150 ${i >= lives ? 'opacity-30' : ''}`}
            >
              {i < lives ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
        {children}
      </div>
    </header>
  );
}
