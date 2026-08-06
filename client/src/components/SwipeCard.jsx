import { motion, useMotionValue, useTransform } from 'framer-motion';

export default function SwipeCard({ item, onSwipe, disabled }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const opacity = useTransform(x, [-250, -80, 0, 80, 250], [0.5, 0.85, 1, 0.85, 0.5]);

  const leftGlow = useTransform(x, [-120, -30, 0], [1, 0.3, 0]);
  const rightGlow = useTransform(x, [0, 30, 120], [0, 0.3, 1]);

  function handleDragEnd(_, info) {
    if (disabled) return;
    const swipeThreshold = 60;
    const velocityThreshold = 250;

    if (Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.velocity.x) > velocityThreshold) {
      onSwipe(info.offset.x < 0 ? 'left' : 'right');
    }
  }

  return (
    <>
      {/* Bin Indicators */}
      <motion.div
        className="fixed left-2 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none"
        style={{ opacity: leftGlow }}
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl">
          ♻️
        </div>
        <span className="text-[10px] font-bold text-emerald-400">รีไซเคิล</span>
      </motion.div>

      <motion.div
        className="fixed right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none"
        style={{ opacity: rightGlow }}
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-2xl">
          ☢️
        </div>
        <span className="text-[10px] font-bold text-red-400">อันตราย</span>
      </motion.div>

      {/* Swipeable Card */}
      <motion.div
        drag={disabled ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={handleDragEnd}
        style={{ x, rotate, opacity }}
        initial={{ y: -60, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative z-30 w-64 sm:w-72 cursor-grab active:cursor-grabbing select-none touch-none"
      >
        <div className="bg-white/[0.08] border border-white/10 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_30px_rgba(139,92,246,0.12)]">
          {/* Item visual */}
          <div className="mb-3">
            {item.icon ? (
              <img
                src={item.icon}
                alt={item.name}
                className="w-20 h-20 sm:w-24 sm:h-24 mx-auto object-contain"
              />
            ) : (
              <span className="text-6xl sm:text-7xl leading-none">{item.emoji}</span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">{item.name}</h3>

          <span className="inline-block px-3 py-0.5 rounded-full bg-white/10 text-xs sm:text-sm text-white/50">
            {item.hint}
          </span>

          <div className="flex justify-between mt-5 text-[10px] sm:text-xs text-white/25">
            <span>👈 รีไซเคิล</span>
            <span>อันตราย 👉</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}
