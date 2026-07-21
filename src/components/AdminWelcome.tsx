import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

const SESSION_FLAG = 'admin-welcomed';

export const AdminWelcome: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_FLAG)) return;
    sessionStorage.setItem(SESSION_FLAG, '1');

    setVisible(true);
    confetti({ particleCount: 100, spread: 75, origin: { y: 0.5 } });

    const timer = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-coffee-950/70 backdrop-blur-sm cursor-pointer animate-in fade-in duration-300"
      onClick={() => setVisible(false)}
    >
      <div className="text-center px-6 animate-in zoom-in-95 fade-in duration-500">
        <p className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">
          Hoş geldin Ahmet 👋
        </p>
        <p className="text-coffee-200 text-lg">Yazar paneline tekrar hoş geldin.</p>
      </div>
    </div>
  );
};
