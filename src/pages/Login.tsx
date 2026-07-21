
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getSession } from '../lib/auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If user is already logged in, redirect to writer panel
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        navigate('/writer-panel');
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(email, password);
    if (success) {
      navigate('/writer-panel');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-coffee-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl text-coffee-800">Yazar Girişi</CardTitle>
          <CardDescription>
            Devam etmek için giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                className="border-coffee-200 focus:border-coffee-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="border-coffee-200 focus:border-coffee-400"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-coffee-700 hover:bg-coffee-800"
              disabled={loading}
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/')}
            className="text-coffee-700 border-coffee-200"
          >
            Ana Sayfaya Dön
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
