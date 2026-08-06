import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ITEMS, GAME_CONSTANTS, getMultiplier, getCardTimeLimit } from '../data/items';
import { checkPlayer, submitScore } from '../utils/api';
import HUD from '../components/HUD';
import SwipeCard from '../components/SwipeCard';
import ComboPopup from '../components/ComboPopup';
import StreakDots from '../components/StreakDots';
import GameOver from '../components/GameOver';
import TopWidget from '../components/TopWidget';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Game() {
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [gameState, setGameState] = useState('idle'); // idle | playing | over
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentItem, setCurrentItem] = useState(null);
  const [cardKey, setCardKey] = useState(0);
  const [toast, setToast] = useState(null);
  const [comboPopup, setComboPopup] = useState({ show: false, mult: 1 });
  const [cardTimeLeft, setCardTimeLeft] = useState(3);
  const [cardMaxTime, setCardMaxTime] = useState(3);
  const [gameOverStats, setGameOverStats] = useState(null);
  const [showSavedResult, setShowSavedResult] = useState(false);
  const [playerNickname, setPlayerNickname] = useState('');
  const [playerAvatar, setPlayerAvatar] = useState('');

  const itemsRef = useRef([]);
  const cardTimerRef = useRef(null);
  const cardStartRef = useRef(0);
  const cardMaxRef = useRef(3);
  const gameStateRef = useRef('idle');
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const livesRef = useRef(3);
  const correctRef = useRef(0);
  const wrongRef = useRef(0);

  // Keep refs in sync
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { comboRef.current = combo; }, [combo]);
  useEffect(() => { livesRef.current = lives; }, [lives]);
  useEffect(() => { correctRef.current = correct; }, [correct]);
  useEffect(() => { wrongRef.current = wrong; }, [wrong]);

  // Verify player
  useEffect(() => {
    checkPlayer()
      .then(data => {
        if (!data.registered || !data.nickname) {
          sessionStorage.clear();
          navigate('/', { replace: true });
        } else {
          setVerified(true);
          setPlayerNickname(data.nickname || sessionStorage.getItem('playerNickname') || '');
          setPlayerAvatar(data.avatar || sessionStorage.getItem('playerAvatar') || 'icons/male_1.png');
          // Check for saved result (returning from leaderboard)
          const params = new URLSearchParams(window.location.search);
          if (params.get('showResult') === '1') {
            const saved = sessionStorage.getItem('lastGameSummary');
            if (saved) {
              try {
                setGameOverStats(JSON.parse(saved));
                setShowSavedResult(true);
                setGameState('over');
              } catch {}
            }
          }
        }
      })
      .catch(() => setVerified(true));
  }, [navigate]);

  const nextItem = useCallback(() => {
    if (gameStateRef.current !== 'playing') return;
    if (itemsRef.current.length === 0) {
      itemsRef.current = shuffle(ITEMS);
    }
    const item = itemsRef.current.pop();
    setCurrentItem(item);
    setCardKey(k => k + 1);

    // Start card timer
    const limit = getCardTimeLimit(scoreRef.current);
    cardMaxRef.current = limit;
    cardStartRef.current = Date.now();
    setCardMaxTime(limit);
    setCardTimeLeft(limit);

    if (cardTimerRef.current) cancelAnimationFrame(cardTimerRef.current);

    function tick() {
      if (gameStateRef.current !== 'playing') return;
      const elapsed = (Date.now() - cardStartRef.current) / 1000;
      const left = Math.max(0, cardMaxRef.current - elapsed);
      setCardTimeLeft(left);

      if (left <= 0) {
        // Timeout
        showToast('timeout', 'หมดเวลา!');
        setTimeout(() => endGame(), 400);
        return;
      }
      cardTimerRef.current = requestAnimationFrame(tick);
    }
    cardTimerRef.current = requestAnimationFrame(tick);
  }, []);

  function startGame() {
    sessionStorage.removeItem('lastGameSummary');
    setScore(0); setCombo(0); setMaxCombo(0); setCorrect(0); setWrong(0); setLives(3);
    scoreRef.current = 0; comboRef.current = 0; livesRef.current = 3; correctRef.current = 0; wrongRef.current = 0;
    itemsRef.current = shuffle(ITEMS);
    setGameState('playing');
    setGameOverStats(null);
    setShowSavedResult(false);
    setTimeout(() => nextItem(), 100);
  }

  function handleSwipe(direction) {
    if (gameStateRef.current !== 'playing' || !currentItem) return;

    if (cardTimerRef.current) {
      cancelAnimationFrame(cardTimerRef.current);
      cardTimerRef.current = null;
    }

    const item = currentItem;
    const isCorrect =
      (direction === 'left' && item.type === 'recycle') ||
      (direction === 'right' && item.type === 'hazard');

    const prevMult = getMultiplier(comboRef.current);

    if (isCorrect) {
      const mult = getMultiplier(comboRef.current);
      const elapsed = (Date.now() - cardStartRef.current) / 1000;
      const pctLeft = cardMaxRef.current > 0 ? (cardMaxRef.current - elapsed) / cardMaxRef.current : 0;
      let points = GAME_CONSTANTS.BASE_SCORE * mult;
      if (pctLeft >= 0.7) points += 50;

      const newScore = scoreRef.current + points;
      const newCombo = comboRef.current + 1;
      const newCorrect = correct + 1;

      setScore(newScore);
      setCombo(newCombo);
      setCorrect(newCorrect);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      scoreRef.current = newScore;
      comboRef.current = newCombo;

      showToast('correct', pctLeft >= 0.7 ? `+${points} ⚡` : `+${points}`);

      const newMult = getMultiplier(newCombo);
      if (newMult > prevMult) {
        setComboPopup({ show: true, mult: newMult });
        setTimeout(() => setComboPopup({ show: false, mult: newMult }), 1300);
      }
    } else {
      const newScore = Math.max(0, scoreRef.current + GAME_CONSTANTS.WRONG_PENALTY);
      const newWrong = wrong + 1;
      const newLives = livesRef.current - 1;

      setScore(newScore);
      setCombo(0);
      setWrong(newWrong);
      setLives(newLives);
      scoreRef.current = newScore;
      comboRef.current = 0;
      livesRef.current = newLives;

      showToast('wrong', `${GAME_CONSTANTS.WRONG_PENALTY}`);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

      if (newLives <= 0) {
        showToast('wrong', '💔 หมดหัวใจ!');
        setTimeout(() => endGame(), 600);
        return;
      }
    }

    setCurrentItem(null);
    setTimeout(() => nextItem(), 350);
  }

  async function endGame() {
    setGameState('over');
    if (cardTimerRef.current) {
      cancelAnimationFrame(cardTimerRef.current);
      cardTimerRef.current = null;
    }
    setCurrentItem(null);

    const stats = {
      score: scoreRef.current,
      combo: maxCombo > comboRef.current ? maxCombo : comboRef.current,
      correct: correctRef.current,
      wrong: wrongRef.current,
    };

    try {
      const result = await submitScore(stats);
      if (result && result.error) {
        sessionStorage.clear();
        navigate('/');
        return;
      }
      const overStats = { ...stats, maxCombo: stats.combo, newTopRank: result?.newTopRank || null };
      setGameOverStats(overStats);
      sessionStorage.setItem('lastGameSummary', JSON.stringify(overStats));
    } catch {
      const overStats = { ...stats, maxCombo: stats.combo, newTopRank: null };
      setGameOverStats(overStats);
    }
  }

  function showToast(type, text) {
    setToast({ type, text, key: Date.now() });
    setTimeout(() => setToast(null), 900);
  }

  if (!verified) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen">
      {/* HUD + TopWidget */}
      {gameState !== 'idle' && (
        <HUD score={score} combo={combo} lives={lives} cardTimeLeft={cardTimeLeft} cardMaxTime={cardMaxTime}>
          <TopWidget />
        </HUD>
      )}

      {/* Main Game Area */}
      <div className="flex items-center justify-center min-h-screen">
        {/* Idle / Start Screen */}
        {gameState === 'idle' && !showSavedResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-6 w-full max-w-sm mx-auto"
          >
            {/* Profile */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex flex-col items-center mb-6"
            >
              <div className="w-20 h-20 rounded-full border-2 border-violet-400/50 shadow-[0_0_20px_rgba(139,92,246,0.3)] overflow-hidden mb-3">
                <img
                  src={`/${playerAvatar}`}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-bold text-white">{playerNickname}</span>
            </motion.div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-gradient mb-2">ปัดขวาพิทักษ์โลก</h1>
            <p className="text-white/30 text-xs mb-6">คัดแยกขยะให้ถูกประเภท!</p>

            {/* Instructions */}
            <div className="glass p-5 mb-6 space-y-3 max-w-xs mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center text-base shrink-0">♻️</div>
                <div className="text-left">
                  <p className="text-xs font-bold text-emerald-400">ปัดซ้าย</p>
                  <p className="text-[10px] text-white/40">ขยะรีไซเคิลได้</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-500/20 border border-red-400/20 flex items-center justify-center text-base shrink-0">☢️</div>
                <div className="text-left">
                  <p className="text-xs font-bold text-red-400">ปัดขวา</p>
                  <p className="text-[10px] text-white/40">ขยะอันตราย</p>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button onClick={startGame} className="btn-gradient text-lg px-12">
              เริ่มเกม! ✨
            </button>
          </motion.div>
        )}

        {/* Playing - Swipe Card */}
        {gameState === 'playing' && currentItem && (
          <SwipeCard key={cardKey} item={currentItem} onSwipe={handleSwipe} />
        )}
      </div>

      {/* Streak Dots */}
      {gameState === 'playing' && <StreakDots combo={combo} />}

      {/* Feedback Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -30 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed top-[30%] left-0 right-0 z-50 pointer-events-none flex justify-center"
          >
            <div className={`px-6 py-3 rounded-2xl border backdrop-blur-sm flex items-center gap-3 shadow-lg ${
              toast.type === 'correct'
                ? 'bg-emerald-500/20 border-emerald-400/30 shadow-emerald-500/20'
                : toast.type === 'wrong'
                ? 'bg-red-500/20 border-red-400/30 shadow-red-500/20'
                : 'bg-amber-500/20 border-amber-400/30 shadow-amber-500/20'
            }`}>
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black ${
                toast.type === 'correct'
                  ? 'bg-emerald-500/30 text-emerald-300'
                  : toast.type === 'wrong'
                  ? 'bg-red-500/30 text-red-300'
                  : 'bg-amber-500/30 text-amber-300'
              }`}>
                {toast.type === 'correct' ? '✓' : toast.type === 'wrong' ? '✗' : '⏰'}
              </div>
              {/* Text */}
              <div className="flex flex-col">
                <span className={`text-xs font-bold ${
                  toast.type === 'correct'
                    ? 'text-emerald-300'
                    : toast.type === 'wrong'
                    ? 'text-red-300'
                    : 'text-amber-300'
                }`}>
                  {toast.type === 'correct' ? 'ถูกต้อง!' : toast.type === 'wrong' ? 'ผิด!' : 'หมดเวลา!'}
                </span>
                <span className={`text-lg font-black ${
                  toast.type === 'correct'
                    ? 'text-emerald-400'
                    : toast.type === 'wrong'
                    ? 'text-red-400'
                    : 'text-amber-400'
                }`}>
                  {toast.text}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Combo Popup */}
      <ComboPopup multiplier={comboPopup.mult} show={comboPopup.show} />

      {/* Game Over */}
      {gameState === 'over' && gameOverStats && (
        <GameOver stats={gameOverStats} onReplay={startGame} />
      )}
    </div>
  );
}
