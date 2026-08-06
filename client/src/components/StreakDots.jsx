import { motion } from 'framer-motion';

export default function StreakDots({ combo }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2">
      {Array.from({ length: 10 }, (_, i) => {
        const active = i < combo;
        const isMilestone = i === 2 || i === 5 || i === 9;

        return (
          <motion.div
            key={i}
            animate={active ? {
              scale: isMilestone ? 1.3 : 1,
              opacity: 1,
            } : {
              scale: 0.7,
              opacity: 0.3,
            }}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              active
                ? i >= 9 ? 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.6)]'
                : i >= 5 ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                : i >= 2 ? 'bg-pink-400 shadow-[0_0_6px_rgba(244,114,182,0.5)]'
                : 'bg-violet-400 shadow-[0_0_4px_rgba(167,139,250,0.4)]'
                : 'bg-white/10'
            }`}
          />
        );
      })}
    </div>
  );
}
