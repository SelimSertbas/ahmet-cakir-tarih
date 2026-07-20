import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Mail, MessageCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const COOLDOWN_SECONDS = 180; // 3 dakika

const Ask = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const nameRef = React.useRef<HTMLInputElement>(null);

  // İlk inputa otomatik odak
  React.useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // Cooldown timer
  React.useEffect(() => {
    const lastTime = localStorage.getItem('lastAskTime');
    if (lastTime) {
      const diff = Math.floor((Date.now() - parseInt(lastTime, 10)) / 1000);
      if (diff < COOLDOWN_SECONDS) {
        setCooldown(COOLDOWN_SECONDS - diff);
        const interval = setInterval(() => {
          setCooldown(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) {
      toast.error(`Yeni bir soru göndermek için lütfen ${cooldown} saniye bekleyin.`);
      return;
    }
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('questions')
        .insert([
          {
            name,
            email,
            title: `Soru: ${question.substring(0, 50)}...`,
            question,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      localStorage.setItem('lastAskTime', Date.now().toString());
      setCooldown(COOLDOWN_SECONDS);
      toast.success('Sorunuz başarıyla gönderildi. En kısa sürede yanıtlanacaktır.');
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      navigate('/');
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error('Sorunuz gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="container-content max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-coffee-100 mb-2">
            Soru Sor
          </h1>
          <p className="text-coffee-600 dark:text-coffee-300 mb-8">
            Tarih, kültür ve toplum konularında merak ettiğiniz soruları bana iletebilirsiniz. 
            Sorularınız, içeriklerimi zenginleştirmek ve okuyucuların ilgisini çeken konulara değinmek için kullanılacaktır.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-coffee-900/90 p-8 rounded-2xl shadow-2xl border border-coffee-100 dark:border-coffee-800 transition-all duration-300 hover:shadow-3xl hover:scale-[1.01] active:scale-100">
            <div className="relative">
              <label className="block text-sm font-medium text-coffee-700 dark:text-coffee-200 mb-1" htmlFor="name">
                Adınız Soyadınız *
              </label>
              <span className="absolute left-3 top-9 text-coffee-400">
                <User className="w-5 h-5" />
              </span>
              <Input
                id="name"
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-label="Adınız Soyadınız"
                aria-invalid={!name}
                className="border-coffee-200 dark:border-coffee-700 pl-10 focus:ring-2 focus:ring-coffee-400 focus:border-coffee-400 transition-all duration-200 focus:scale-105"
                placeholder="Adınızı ve soyadınızı girin"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-coffee-700 dark:text-coffee-200 mb-1" htmlFor="email">
                E-posta Adresiniz *
              </label>
              <span className="absolute left-3 top-9 text-coffee-400">
                <Mail className="w-5 h-5" />
              </span>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="E-posta Adresiniz"
                aria-invalid={!email}
                className="border-coffee-200 dark:border-coffee-700 pl-10 focus:ring-2 focus:ring-coffee-400 focus:border-coffee-400 transition-all duration-200 focus:scale-105"
                placeholder="E-posta adresinizi girin"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-coffee-700 dark:text-coffee-200 mb-1" htmlFor="question">
                Sorunuz *
              </label>
              <span className="absolute left-3 top-9 text-coffee-400">
                <MessageCircle className="w-5 h-5" />
              </span>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                aria-label="Sorunuz"
                aria-invalid={!question}
                className="min-h-[200px] border-coffee-200 dark:border-coffee-700 pl-10 focus:ring-2 focus:ring-coffee-400 focus:border-coffee-400 transition-all duration-200 focus:scale-105"
                placeholder="Sorunuzu detaylı bir şekilde yazın..."
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-coffee-700 hover:bg-coffee-800 dark:bg-coffee-600 dark:hover:bg-coffee-700 flex items-center justify-center gap-2 text-lg py-3 transition-all duration-200 hover:scale-105 active:scale-95"
              disabled={isSubmitting || cooldown > 0}
              aria-busy={isSubmitting}
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {isSubmitting ? 'Gönderiliyor...' : cooldown > 0 ? `Tekrar göndermek için ${cooldown} sn bekleyin` : 'Soruyu Gönder'}
            </Button>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Ask; 