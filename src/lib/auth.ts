import { toast } from "../components/ui/use-toast";

// Since we're not connecting to a real backend in this version,
// we'll use a simple mock authentication
const MOCK_USERNAME = "ckr";
const MOCK_PASSWORD = "c1k2r3.";

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
}

// Check if user is already logged in from localStorage
const loadAuthState = (): AuthState => {
  const stored = localStorage.getItem("auth");
  if (stored) {
    try {
      return JSON.parse(stored) as AuthState;
    } catch {
      return { isAuthenticated: false, username: null };
    }
  }
  return { isAuthenticated: false, username: null };
};

// Save auth state to localStorage
const saveAuthState = (state: AuthState): void => {
  localStorage.setItem("auth", JSON.stringify(state));
};

// Clear auth state from localStorage
const clearAuthState = (): void => {
  localStorage.removeItem("auth");
};

// Login function
export const login = (username: string, password: string): boolean => {
  if (username === MOCK_USERNAME && password === MOCK_PASSWORD) {
    const authState = { isAuthenticated: true, username };
    saveAuthState(authState);
    toast({
      title: "Başarıyla Giriş Yapıldı",
      description: "Yazar paneline yönlendiriliyorsunuz.",
    });
    return true;
  }
  
  toast({
    title: "Giriş Başarısız",
    description: "Kullanıcı adı veya şifre hatalı.",
    variant: "destructive",
  });
  return false;
};

// Logout function
export const logout = (): void => {
  clearAuthState();
  toast({
    title: "Çıkış Yapıldı",
    description: "Başarıyla çıkış yaptınız.",
  });
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return loadAuthState().isAuthenticated;
};

// Get current user
export const getCurrentUser = (): string | null => {
  return loadAuthState().username;
};
