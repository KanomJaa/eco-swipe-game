import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fetchLeaderboard } from '../utils/api';

export default function TopWidget() {
  const [top3, setTop3] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const cached = localStorage.getItem('eco_lb_cache');
      if (cached) setTop3(JSON.parse(cached));
    } catch {}

    async function load() {
      try {
        const data = await fetchLeaderboard();
        const t = data.slice(0, 3);
        setTop3(t);
        localStorage.setItem('eco_lb_cache', JSON.stringify(t));
      } catch {}
    }

    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-2 right-3 z-50 safe-top">
      <button
        onClick={() => setOpen(!open)}
        className="glass px-2.5 py-1.5 flex items-center gap-1.5 text-xs hover:bg-white/10 transition-colors"
      >
        <img src="/icons/TopBoard.png" alt="Top" className="w-4 h-4" />
        <span className="font-bold text-amber-300">TOP 3</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop to close */}
            <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 w-48 glass p-3"
            >
              {top3.length === 0 ? (
                <p className="text-xs text-white/30 text-center py-2">ยังไม่มีอันดับ</p>
              ) : (
                <div className="space-y-2">
                  {top3.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <img src={`/icons/No${i + 1}.png`} alt={`#${i + 1}`} className="w-5 h-5" />
                      <span className="text-xs truncate flex-1">{p.nickname}</span>
                      <span className="text-[10px] font-nunito font-bold text-amber-300">
                        {p.score.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => navigate('/leaderboard')}
                className="w-full mt-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-violet-300 transition-colors"
              >
                ดูอันดับทั้งหมด
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
