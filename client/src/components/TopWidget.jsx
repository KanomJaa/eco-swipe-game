import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fetchLeaderboard } from '../utils/api';

export default function TopWidget() {
  const [top3, setTop3] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load cache
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
    <div className="fixed top-3 right-3 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="glass px-3 py-2 flex items-center gap-2 text-sm hover:bg-white/10 transition-colors"
      >
        <img src="/icons/TopBoard.png" alt="Top" className="w-5 h-5" />
        <span className="font-bold text-amber-300">TOP 3</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-52 glass p-3"
          >
            {top3.length === 0 ? (
              <p className="text-xs text-white/30 text-center py-2">ยังไม่มีอันดับ</p>
            ) : (
              <div className="space-y-2">
                {top3.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <img src={`/icons/No${i + 1}.png`} alt={`#${i + 1}`} className="w-6 h-6" />
                    <span className="text-sm truncate flex-1">{p.nickname}</span>
                    <span className="text-xs font-nunito font-bold text-amber-300">
                      {p.score.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => navigate('/leaderboard')}
              className="w-full mt-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-violet-300 transition-colors"
            >
              ดูอันดับทั้งหมด
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
