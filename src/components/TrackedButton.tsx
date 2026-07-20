import { Button } from "./ui/button";
import { trackClick } from "../lib/analytics";

interface TrackedButtonProps {
  name: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const TrackedButton = ({ name, onClick, children, variant = "default" }: TrackedButtonProps) => {
  const handleClick = () => {
    // Tıklama olayını kaydet
    trackClick(name, {
      timestamp: new Date().toISOString(),
      page: window.location.pathname
    });

    // Orijinal onClick fonksiyonunu çağır
    onClick?.();
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
    >
      {children}
    </Button>
  );
}; 