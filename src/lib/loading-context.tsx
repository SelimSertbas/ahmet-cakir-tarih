import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Loading } from "@/components/ui/loading";

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  useEffect(() => {
    // Sayfa yüklendiğinde loading'i kapat
    const handleLoad = () => {
      stopLoading();
    };

    // Sayfa yenilendiğinde loading'i aç
    const handleBeforeUnload = () => {
      startLoading();
    };

    window.addEventListener('load', handleLoad);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Component unmount olduğunda event listener'ları temizle
    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
      {isLoading && <Loading />}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}; 