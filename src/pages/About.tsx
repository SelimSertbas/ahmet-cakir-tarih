import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Facebook, Instagram, Youtube, Twitter, Music } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FAF6F2] to-[#F3EBE2] dark:from-coffee-900 dark:to-coffee-950">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="container-content">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-coffee-100 mb-10 text-center md:text-left">
            Hakkımda
          </h1>
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Profile Card */}
            <div className="md:w-1/3 w-full flex flex-col items-center bg-white dark:bg-coffee-900 rounded-2xl shadow-lg p-8 mb-8 md:mb-0">
              <div className="w-full flex justify-center">
                <img
                  src="/lovable-uploads/14f96f6a-555f-4f61-a62e-21b4e346c9c7.png"
                  alt="Ahmet Çakır"
                  className="w-40 h-40 rounded-full object-cover border-4 border-coffee-200 dark:border-coffee-700 shadow mb-4"
                />
              </div>
              <h2 className="text-2xl font-bold text-coffee-900 dark:text-coffee-100 mb-1">Ahmet Çakır</h2>
              <p className="text-coffee-600 dark:text-coffee-300 mb-2">Tarihçi, Yazar, İçerik Üreticisi</p>
              <p className="text-coffee-700 dark:text-coffee-200 text-center md:text-left mb-4 text-sm">
                İstanbul Medeniyet Üniversitesi Tarih Bölümü öğrencisi. YouTube ve Instagram'da tarih ve edebiyat içerikleri üretiyor.
              </p>
              <div className="flex gap-4 mt-2">
                <a href="https://www.facebook.com/profile.php?id=61563547570013" target="_blank" rel="noopener noreferrer" title="Facebook" className="text-coffee-400 hover:text-blue-600 transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="https://www.instagram.com/ahmetcakirresmi/" target="_blank" rel="noopener noreferrer" title="Instagram" className="text-coffee-400 hover:text-pink-500 transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="https://x.com/ahmedcakirrr?s=21" target="_blank" rel="noopener noreferrer" title="X (Twitter)" className="text-coffee-400 hover:text-black dark:hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="https://www.tiktok.com/@ahmetcakirresmi?lang=tr-TR" target="_blank" rel="noopener noreferrer" title="TikTok" className="text-coffee-400 hover:text-fuchsia-500 transition-colors">
                  <Music className="h-6 w-6" />
                </a>
                <a href="https://www.youtube.com/@ahmedcakirresmi" target="_blank" rel="noopener noreferrer" title="YouTube" className="text-coffee-400 hover:text-red-600 transition-colors">
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>
            {/* About Section */}
            <div className="md:w-2/3 w-full flex flex-col gap-6">
              <div className="bg-coffee-50 dark:bg-coffee-800/40 rounded-xl p-6 shadow border border-coffee-100 dark:border-coffee-700 mb-2">
                <h2 className="text-2xl font-serif font-semibold text-coffee-800 dark:text-coffee-100 mb-2">Hoşgeldiniz!</h2>
                <p className="text-coffee-700 dark:text-coffee-200 text-lg">
                  Merhaba! Ben Ahmet Çakır. Tarih ve edebiyat tutkunu bir içerik üreticisiyim. Amacım, geçmişin izlerini günümüze taşımak ve gençlere tarih bilincini aşılamak.
                </p>
              </div>
              <blockquote className="border-l-4 border-coffee-700 dark:border-coffee-400 pl-4 italic text-coffee-800 dark:text-coffee-200 bg-coffee-100/60 dark:bg-coffee-900/40 rounded-lg py-3 shadow mb-2">
                "Geçmişi bilmeyen, geleceğe yön veremez."
              </blockquote>
              <div className="prose dark:prose-invert max-w-none">
                <p>
                  2005 yılında İstanbul'un Pendik ilçesinde dünyaya geldim. Aslen Trabzon Sürmeneliyim. Türk Kızılayı Kartal Anadolu Lisesi'nden mezun olduktan sonra eğitimime İstanbul Medeniyet Üniversitesi Tarih Bölümü'nde devam ediyorum.
                </p>
                <p>
                  Genç yaşımda çeşitli gazete ve dergilerde köşe yazarlığı yaptım, şu anda Mergen Haber'de yazarlığa devam ediyorum. Tarih ve edebiyat alanlarında YouTube ve Instagram gibi platformlarda içerik üretmeye devam ediyorum.
                </p>
                <h3>Eğitim</h3>
                <ul>
                  <li>İstanbul Medeniyet Üniversitesi, Tarih Bölümü - (Devam Ediyor)</li>
                  <li>Türk Kızılayı Kartal Anadolu Lisesi - (Mezun)</li>
                </ul>
                <h3>Çalışmalar</h3>
                <p>
                  Akademik ilgilerim arasında Genel Türk Tarihi ve Avrupa Tarihi yer alıyor. Aynı zamanda Orta Çağ üzerine de çalışmalar yapıyorum.
                </p>
                <p>
                  Yazdığım makalelerde ve köşe yazılarımda tarihsel olayları objektif bir bakış açısıyla, metodolojiye uygun şekilde ele alıyorum. Geçmişin anlaşılmasının bugünün sorunlarına çözüm bulmada nasıl yardımcı olabileceğini araştırıyorum.
                </p>
                <h3>İçerik Üretimi</h3>
                <p>
                  Sosyal medya platformlarında hazırladığım içeriklerle tarihi ve edebi konuları geniş kitlelere ulaştırmayı amaçlıyorum. YouTube kanalımda tarihsel olaylar ve kişilikler hakkında belgesel tadında videolar hazırlarken, Instagram hesabımda daha kısa ve özlü bilgiler paylaşıyorum.
                </p>
                <p>
                  Özellikle gençlerin tarih bilincini geliştirmeyi ve kültürel mirasımıza sahip çıkmayı teşvik eden içerikler üretmeyi kendime misyon edindim.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
