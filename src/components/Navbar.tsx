import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-content flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif font-bold text-2xl text-coffee-800 dark:text-coffee-200">Ahmet Çakır</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={cn(
              "text-base font-medium transition-colors hover:text-coffee-700 dark:hover:text-coffee-300",
              isActive("/") ? "text-coffee-800 dark:text-coffee-300" : "text-muted-foreground"
            )}
          >
            Ana Sayfa
          </Link>
          <Link
            to="/articles"
            className={cn(
              "text-base font-medium transition-colors hover:text-coffee-700 dark:hover:text-coffee-300",
              isActive("/articles") ? "text-coffee-800 dark:text-coffee-300" : "text-muted-foreground"
            )}
          >
            Yazılarım
          </Link>
          <Link
            to="/videos"
            className={cn(
              "text-base font-medium transition-colors hover:text-coffee-700 dark:hover:text-coffee-300",
              isActive("/videos") ? "text-coffee-800 dark:text-coffee-300" : "text-muted-foreground"
            )}
          >
            Videolar
          </Link>
          <Link
            to="/about"
            className={cn(
              "text-base font-medium transition-colors hover:text-coffee-700 dark:hover:text-coffee-300",
              isActive("/about") ? "text-coffee-800 dark:text-coffee-300" : "text-muted-foreground"
            )}
          >
            Hakkımda
          </Link>
          <Link
            to="/ask"
            className={cn(
              "text-base font-medium transition-colors hover:text-coffee-700 dark:hover:text-coffee-300",
              isActive("/ask") ? "text-coffee-800 dark:text-coffee-300" : "text-muted-foreground"
            )}
          >
            Soru Sor
          </Link>
          <Link
            to="/questions"
            className={cn(
              "text-base font-medium transition-colors hover:text-coffee-700 dark:hover:text-coffee-300",
              isActive("/questions") ? "text-coffee-800 dark:text-coffee-300" : "text-muted-foreground"
            )}
          >
            Soru & Cevap
          </Link>

          <ThemeSwitcher />
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background shadow-md md:hidden z-50">
            <div className="p-4 flex flex-col gap-4">
              <Link
                to="/"
                className={cn(
                  "text-base font-medium transition-colors hover:text-coffee-700",
                  isActive("/") ? "text-coffee-800" : "text-muted-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link
                to="/articles"
                className={cn(
                  "text-base font-medium transition-colors hover:text-coffee-700",
                  isActive("/articles") ? "text-coffee-800" : "text-muted-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Yazılarım
              </Link>
              <Link
                to="/videos"
                className={cn(
                  "text-base font-medium transition-colors hover:text-coffee-700",
                  isActive("/videos") ? "text-coffee-800" : "text-muted-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Videolar
              </Link>
              <Link
                to="/about"
                className={cn(
                  "text-base font-medium transition-colors hover:text-coffee-700",
                  isActive("/about") ? "text-coffee-800" : "text-muted-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Hakkımda
              </Link>
              <Link
                to="/ask"
                className={cn(
                  "text-base font-medium transition-colors hover:text-coffee-700",
                  isActive("/ask") ? "text-coffee-800" : "text-muted-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Soru Sor
              </Link>
              <Link
                to="/questions"
                className={cn(
                  "text-base font-medium transition-colors hover:text-coffee-700",
                  isActive("/questions") ? "text-coffee-800" : "text-muted-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Soru & Cevap
              </Link>
              
              <div className="flex justify-end">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
