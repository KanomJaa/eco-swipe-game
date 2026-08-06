import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = {
  2: { text: 'x2 COMBO!', sub: 'คะแนน 2 เท่า!', color: 'from-pink-500 to-violet-500' },
  3: { text: 'x3 FIRE!', sub: 'สุดยอด! คะแนน 3 เท่า!', color: 'from-amber-500 to-orange-500' },
  5: { text: 'x5 ULTRA!', sub: 'เทพมาก!! คะแนน 5 เท่า!!', color: 'from-red-500 via-orange-500 to-yellow-400' },
};

export default function ComboPopup({ multiplier, show }) {
  const msg = MESSAGES[multiplier] || { text: `x${multiplier}!`, sub: 'คอมโบ!', color: 'from-violet-500 to-pink-500' };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ type: 'spring', damping: 10, stiffness: 200 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, -3, 3, 0] }}
              transition={{ duration: 0.5, repeat: 1 }}
              className={`text-5xl sm:text-6xl font-black bg-gradient-to-r ${msg.color} bg-clip-text text-transparent drop-shadow-2xl`}
            >
              {msg.text}
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/80 mt-2 font-semibold"
            >
              {msg.sub}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
