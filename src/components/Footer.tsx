import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-coffee-900 dark:bg-coffee-900 dark:text-coffee-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Logo ve Başlık */}
          <div className="text-center">
            <h2 className="text-2xl font-serif font-bold">Ahmet Çakır</h2>
            <p className="text-coffee-500 dark:text-coffee-300 mt-2">Tarihçi, Yazar</p>
          </div>

          {/* Sosyal Medya İkonları */}
          <div className="flex items-center justify-center space-x-6">
            <a
              href="https://www.facebook.com/profile.php?id=61563547570013"
              target="_blank"
              rel="noopener noreferrer"
              className="text-coffee-500 dark:text-coffee-300 hover:text-coffee-700 dark:hover:text-white transition-colors"
              title="Facebook"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="https://www.instagram.com/ahmetcakirresmi/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-coffee-500 dark:text-coffee-300 hover:text-coffee-700 dark:hover:text-white transition-colors"
              title="Instagram"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="https://x.com/ahmedcakirrr?s=21"
              target="_blank"
              rel="noopener noreferrer"
              className="text-coffee-500 dark:text-coffee-300 hover:text-coffee-700 dark:hover:text-white transition-colors"
              title="X (Twitter)"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="https://www.tiktok.com/@ahmetcakirresmi?lang=tr-TR"
              target="_blank"
              rel="noopener noreferrer"
              className="text-coffee-500 dark:text-coffee-300 hover:text-coffee-700 dark:hover:text-white transition-colors"
              title="TikTok"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@ahmedcakirresmi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-coffee-500 dark:text-coffee-300 hover:text-coffee-700 dark:hover:text-white transition-colors"
              title="YouTube"
            >
              <Youtube className="h-6 w-6" />
            </a>
            <a
              href="mailto:Ahmedcakirresmi@gmail.com"
              className="text-coffee-500 dark:text-coffee-300 hover:text-coffee-700 dark:hover:text-white transition-colors"
              title="E-posta"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>

          {/* İletişim Bilgileri */}
          <div className="text-center">
            <p className="text-coffee-500 dark:text-coffee-300">
              <a
                href="mailto:Ahmedcakirresmi@gmail.com"
                className="hover:text-coffee-700 dark:hover:text-white transition-colors"
              >
                Ahmedcakirresmi@gmail.com
              </a>
            </p>
          </div>

          {/* Telif Hakkı */}
          <div className="text-center text-coffee-400 dark:text-coffee-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Ahmet Çakır. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
