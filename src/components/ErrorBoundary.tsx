import * as Sentry from "@sentry/react";
import { Button } from "./ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Bir şeyler yanlış gitti!</h2>
      <p className="mb-4">Üzgünüz, bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
      <Button
        onClick={() => window.location.reload()}
        variant="default"
      >
        Sayfayı Yenile
      </Button>
    </div>
  );
};

export const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  return (
    <Sentry.ErrorBoundary fallback={ErrorFallback}>
      {children}
    </Sentry.ErrorBoundary>
  );
}; 