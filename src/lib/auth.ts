import { supabase } from "@/integrations/supabase/client";
import { toast } from "../components/ui/use-toast";
import type { Session } from "@supabase/supabase-js";

export const login = async (
  email: string,
  password: string
): Promise<boolean> => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    toast({
      title: "Giriş Başarısız",
      description: "E-posta veya şifre hatalı.",
      variant: "destructive",
    });
    return false;
  }

  toast({
    title: "Başarıyla Giriş Yapıldı",
    description: "Yazar paneline yönlendiriliyorsunuz.",
  });
  return true;
};

export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
  toast({
    title: "Çıkış Yapıldı",
    description: "Başarıyla çıkış yaptınız.",
  });
};

export const getSession = async (): Promise<Session | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const onAuthStateChange = (
  callback: (session: Session | null) => void
) => {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return data.subscription;
};
