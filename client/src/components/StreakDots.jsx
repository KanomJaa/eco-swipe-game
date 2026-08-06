export default function StreakDots({ combo }) {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex gap-1.5">
      {Array.from({ length: 10 }, (_, i) => {
        const active = i < combo;
        return (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-150 ${
              active
                ? i >= 9 ? 'bg-orange-400 scale-125 shadow-[0_0_6px_rgba(251,146,60,0.5)]'
                : i >= 5 ? 'bg-amber-400 scale-110 shadow-[0_0_4px_rgba(251,191,36,0.4)]'
                : i >= 2 ? 'bg-pink-400 shadow-[0_0_4px_rgba(244,114,182,0.4)]'
                : 'bg-violet-400'
                : 'bg-white/10'
            }`}
          />
        );
      })}
    </div>
  );
}
