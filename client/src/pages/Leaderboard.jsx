import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchLeaderboard, checkPlayer } from '../utils/api';

function formatCountdown(ms) {
  if (ms <= 0) return '00:00';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [top3, setTop3] = useState([]);
  const [prevTop, setPrevTop] = useState([]);
  const [countdown, setCountdown] = useState('');
  const lastDataRef = useRef('');
  const resetsAtRef = useRef(null);

  useEffect(() => {
    // Verify player
    checkPlayer().then(data => {
      if (!data.registered || !data.nickname) {
        sessionStorage.clear();
        navigate('/', { replace: true });
      }
    }).catch(() => {});

    // Load cache
    try {
      const cached = localStorage.getItem('eco_lb_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length) {
          setTop3(parsed);
          lastDataRef.current = cached;
        }
      }
    } catch {}

    async function load() {
      try {
        const res = await fetchLeaderboard();
        const list = res.leaderboard || res;
        const t = list.slice(0, 3);
        const str = JSON.stringify(t);
        localStorage.setItem('eco_lb_cache', str);
        if (res.resetsAt) resetsAtRef.current = new Date(res.resetsAt).getTime();
        if (res.previousTop) setPrevTop(res.previousTop);
        if (str !== lastDataRef.current) {
          lastDataRef.current = str;
          setTop3(t);
        }
      } catch {}
    }

    load();
    const dataInterval = setInterval(load, 5000);

    // Countdown timer
    const tickInterval = setInterval(() => {
      if (resetsAtRef.current) {
        const left = resetsAtRef.current - Date.now();
        setCountdown(formatCountdown(left));
        if (left <= 0) load(); // refresh when hour resets
      }
    }, 1000);

    return () => { clearInterval(dataInterval); clearInterval(tickInterval); };
  }, [navigate]);

  const podiumOrder = [];
  if (top3[1]) podiumOrder.push({ ...top3[1], rank: 2 });
  if (top3[0]) podiumOrder.push({ ...top3[0], rank: 1 });
  if (top3[2]) podiumOrder.push({ ...top3[2], rank: 3 });

  const standHeights = { 1: 'h-44', 2: 'h-32', 3: 'h-24' };
  const standColors = {
    1: 'from-amber-500/30 to-amber-500/5 border-amber-400/40',
    2: 'from-gray-300/20 to-gray-300/5 border-gray-300/30',
    3: 'from-orange-700/20 to-orange-700/5 border-orange-600/30',
  };
  const avatarStyles = {
    1: 'w-28 h-28 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]',
    2: 'w-20 h-20 border-gray-300 shadow-[0_0_20px_rgba(209,213,219,0.2)]',
    3: 'w-20 h-20 border-orange-600 shadow-[0_0_20px_rgba(194,65,12,0.2)]',
  };
  const badgeSizes = { 1: 'w-16 h-16 -top-10', 2: 'w-12 h-12 -top-8', 3: 'w-12 h-12 -top-8' };

  function goBack() {
    const hasPlayed = sessionStorage.getItem('lastGameSummary');
    navigate(hasPlayed ? '/game?showResult=1' : '/game');
  }

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center">
      {/* Back button */}
      <button
        onClick={goBack}
        className="fixed top-4 left-4 z-50 w-10 h-10 glass flex items-center justify-center hover:bg-white/10 transition-colors !rounded-full"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </button>

      {/* Live badge */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
        <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
        <span className="text-xs text-white/30">LIVE</span>
      </div>

      {/* Header */}
      <header className="text-center pt-12 pb-6 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-gradient-gold mb-1"
        >
          🏆 อันดับนักวิทย์
        </motion.h1>
        <p className="text-sm text-white/30">ปัดขวาพิทักษ์โลก</p>
        <p className="text-xs text-white/20 mt-1">งานวันวิทยาศาสตร์ มหาวิทยาลัยราชภัฏศรีสะเกษ</p>
        {countdown && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="text-xs text-white/40">รีเซ็ตใน</span>
            <span className="text-sm font-mono font-bold text-amber-400">{countdown}</span>
          </div>
        )}
      </header>

      {/* Podium */}
      <section className="flex items-end justify-center gap-3 px-4 flex-1 pb-8 w-full max-w-2xl">
        {top3.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🧪</span>
            <p className="text-white/30">ยังไม่มีผู้เล่น...</p>
            <p className="text-white/20 text-sm">สแกน QR Code เพื่อเข้าเกม!</p>
          </div>
        ) : (
          podiumOrder.map((player, i) => (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.1, type: 'spring', damping: 15 }}
              className="flex flex-col items-center"
            >
              {/* Avatar */}
              <div className="relative mb-3">
                <div className={`rounded-full border-2 overflow-hidden bg-white/10 ${avatarStyles[player.rank]}`}>
                  <img
                    src={`/${player.avatar || 'icons/male_1.png'}`}
                    alt={player.nickname}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`absolute left-1/2 -translate-x-1/2 ${badgeSizes[player.rank]}`}>
                  <img src={`/icons/No${player.rank}.png`} alt={`#${player.rank}`} className="w-full h-full object-contain drop-shadow-lg" />
                </div>
              </div>

              {/* Name */}
              <p className={`font-bold text-center max-w-[140px] truncate mb-1
                ${player.rank === 1 ? 'text-lg text-amber-300' : 'text-sm text-white/80'}`}>
                {player.nickname}
              </p>

              {/* Score */}
              <p className={`font-nunito font-black mb-3
                ${player.rank === 1 ? 'text-3xl text-gradient-gold' : player.rank === 2 ? 'text-xl text-gray-300' : 'text-xl text-orange-400'}`}>
                {player.score.toLocaleString()}
              </p>

              {/* Stand */}
              <div className={`w-32 sm:w-40 rounded-t-2xl bg-gradient-to-b border-t border-x flex items-start justify-center pt-4 font-nunito text-2xl font-black text-white/10
                ${standHeights[player.rank]} ${standColors[player.rank]}`}>
                #{player.rank}
              </div>
            </motion.div>
          ))
        )}
      </section>

      {/* Previous Hour Top 3 */}
      {prevTop.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm mx-auto px-4 pb-8"
        >
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-white/40 text-center mb-3">🕐 Top รอบก่อนหน้า</p>
            <div className="space-y-2">
              {prevTop.map((p) => (
                <div key={p.rank} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
                  <span className={`text-sm font-black w-5 text-center ${
                    p.rank === 1 ? 'text-amber-400' : p.rank === 2 ? 'text-gray-300' : 'text-orange-400'
                  }`}>
                    {p.rank}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden bg-white/10 shrink-0">
                    <img src={`/${p.avatar || 'icons/male_1.png'}`} alt={p.nickname} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm text-white/70 truncate flex-1">{p.nickname}</span>
                  <span className={`text-sm font-black font-nunito ${
                    p.rank === 1 ? 'text-amber-400' : p.rank === 2 ? 'text-gray-300' : 'text-orange-400'
                  }`}>
                    {p.score.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
