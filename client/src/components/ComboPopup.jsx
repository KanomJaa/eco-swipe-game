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
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.3 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          <div className="text-center">
            <div className={`text-4xl sm:text-5xl font-black bg-gradient-to-r ${msg.color} bg-clip-text text-transparent`}>
              {msg.text}
            </div>
            <p className="text-sm text-white/70 mt-1 font-semibold">
              {msg.sub}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
