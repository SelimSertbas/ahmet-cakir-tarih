import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getSession, onAuthStateChange } from '@/lib/auth';
import { Loading } from '@/components/ui/loading';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<'checking' | 'authed' | 'guest'>('checking');

  useEffect(() => {
    let mounted = true;

    getSession().then((session) => {
      if (mounted) setStatus(session ? 'authed' : 'guest');
    });

    const subscription = onAuthStateChange((session) => {
      if (mounted) setStatus(session ? 'authed' : 'guest');
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (status === 'checking') {
    return <Loading text="Oturum kontrol ediliyor..." />;
  }

  if (status === 'guest') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
