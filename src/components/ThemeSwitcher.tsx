
import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

const ThemeSwitcher: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    // Default to dark mode unless explicitly set to light
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full h-9 w-9"
      title={isDark ? "Aydınlık Mod" : "Karanlık Mod"}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};

export default ThemeSwitcher;
