import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster, toast } from "sonner";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin/gallery" });
    });
  }, [navigate]);

  const translateError = (msg: string): string => {
    const m = msg.toLowerCase();
    if (m.includes("invalid login credentials")) return "אימייל או סיסמה שגויים";
    if (m.includes("email not confirmed")) return "האימייל טרם אומת";
    if (m.includes("user already registered")) return "משתמש כבר רשום במערכת";
    if (m.includes("password should be")) return "הסיסמה חייבת להכיל לפחות 6 תווים";
    if (m.includes("rate limit") || m.includes("too many")) return "יותר מדי ניסיונות, נסו שוב בעוד מספר דקות";
    if (m.includes("network") || m.includes("failed to fetch")) return "בעיית רשת – בדקו את החיבור ונסו שוב";
    return "שגיאה בהתחברות – ודאו את הפרטים ונסו שוב";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin/gallery` },
        });
        if (error) throw error;
        toast.success("נרשמת בהצלחה! מתחבר...");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
      }
      navigate({ to: "/admin/gallery" });
    } catch (err) {
      toast.error(translateError(err instanceof Error ? err.message : ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground grid place-items-center px-4">
      <Toaster position="top-center" theme="dark" richColors />
      <div className="w-full max-w-md bg-card border border-white/10 rounded-3xl p-8">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← חזרה לאתר</Link>
        <h1 className="text-3xl font-black mt-4 mb-2">{mode === "login" ? "התחברות מנהל" : "הרשמת מנהל"}</h1>
        <p className="text-sm text-muted-foreground mb-6">לניהול ביקורות תלמידים</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold mb-1 block">אימייל</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm" dir="ltr" />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">סיסמה</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm" dir="ltr" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-gradient-orange text-white font-bold rounded-xl py-3 disabled:opacity-50">
            {loading ? "טוען..." : mode === "login" ? "התחבר" : "הירשם"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="w-full text-xs text-muted-foreground hover:text-foreground mt-4 text-center">
          {mode === "login" ? "אין לך חשבון? הירשם" : "כבר יש לך חשבון? התחבר"}
        </button>
      </div>
    </div>
  );
}