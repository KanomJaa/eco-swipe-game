import { motion, useMotionValue, useTransform } from 'framer-motion';

export default function SwipeCard({ item, onSwipe, disabled }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-300, -100, 0, 100, 300], [0.5, 0.8, 1, 0.8, 0.5]);

  // Bin highlight indicators
  const leftGlow = useTransform(x, [-150, -40, 0], [1, 0.3, 0]);
  const rightGlow = useTransform(x, [0, 40, 150], [0, 0.3, 1]);

  function handleDragEnd(_, info) {
    if (disabled) return;
    const swipeThreshold = 80;
    const velocityThreshold = 300;

    if (Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.velocity.x) > velocityThreshold) {
      onSwipe(info.offset.x < 0 ? 'left' : 'right');
    }
  }

  return (
    <>
      {/* Bin Indicators */}
      <motion.div
        className="fixed left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
        style={{ opacity: leftGlow }}
      >
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl glow-emerald">
          ♻️
        </div>
        <span className="text-xs font-bold text-emerald-400">รีไซเคิล</span>
      </motion.div>

      <motion.div
        className="fixed right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
        style={{ opacity: rightGlow }}
      >
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-3xl glow-pink">
          ☢️
        </div>
        <span className="text-xs font-bold text-red-400">อันตราย</span>
      </motion.div>

      {/* Swipeable Card */}
      <motion.div
        drag={disabled ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        style={{ x, rotate, opacity }}
        initial={{ y: -80, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative z-30 w-72 cursor-grab active:cursor-grabbing select-none touch-none"
      >
        <div className="glass-strong p-8 text-center glow-violet">
          {/* Item visual */}
          <div className="mb-4">
            {item.icon ? (
              <img
                src={item.icon}
                alt={item.name}
                className="w-24 h-24 mx-auto object-contain drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              />
            ) : (
              <span className="text-7xl leading-none drop-shadow-lg">{item.emoji}</span>
            )}
          </div>

          {/* Item name */}
          <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>

          {/* Hint badge */}
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-sm text-white/50">
            {item.hint}
          </span>

          {/* Swipe hints */}
          <div className="flex justify-between mt-6 text-xs text-white/30">
            <span>👈 รีไซเคิล</span>
            <span>อันตราย 👉</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}
