import { createFileRoute, useNavigate, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "sonner";
import { LayoutDashboard, Users, Star, Image as ImageIcon, HelpCircle, Settings, LogOut, Menu, X, Bike } from "lucide-react";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "סקירה", icon: LayoutDashboard, exact: true },
  { to: "/admin/leads", label: "לידים", icon: Users },
  { to: "/admin/reviews", label: "ביקורות", icon: Star },
  { to: "/admin/gallery", label: "גלריה", icon: ImageIcon },
  { to: "/admin/faqs", label: "שאלות נפוצות", icon: HelpCircle },
  { to: "/admin/license-cards", label: "דרגות רישיון", icon: Bike },
  { to: "/admin/settings", label: "תוכן האתר (CMS)", icon: Settings },
];

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    let settled = false;
    let safety: ReturnType<typeof setTimeout> | null = null;
    const clearSafety = () => { if (safety) { clearTimeout(safety); safety = null; } };

    const checkAccess = async (uid: string) => {
      try {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", uid)
          .eq("role", "admin")
          .maybeSingle();
        if (!mounted) return;
        setUserId(uid);
        setIsAdmin(!!roles);
      } catch (e) {
        console.error("admin role check failed", e);
        if (!mounted) return;
        setUserId(uid);
        setIsAdmin(false);
      } finally {
        if (mounted) { settled = true; clearSafety(); setLoading(false); }
      }
    };

    const goToAuth = () => {
      if (!mounted) return;
      settled = true;
      clearSafety();
      setLoading(false);
      navigate({ to: "/auth" });
    };

    // Set up listener first to catch any auth state changes during init
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (!session) goToAuth();
      else void checkAccess(session.user.id);
    });

    // Then read the persisted session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (!session) goToAuth();
      else void checkAccess(session.user.id);
    }).catch((e) => {
      console.error("getSession failed", e);
      goToAuth();
    });

    // Safety timeout — never get stuck on "loading" forever.
    // Uses `settled` flag (not stale `loading` state) so it can't fire
    // after the admin loaded successfully (e.g. when the Android file
    // picker backgrounds the tab for >6s).
    safety = setTimeout(() => {
      if (mounted && !settled) {
        console.warn("admin auth check timed out");
        goToAuth();
      }
    }, 8000);

    return () => { mounted = false; subscription.unsubscribe(); clearSafety(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => { setOpen(false); }, [pathname]);

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); };

  if (loading) return <div className="min-h-screen grid place-items-center bg-background text-foreground">טוען...</div>;

  if (!isAdmin) {
    return (
      <div dir="rtl" className="min-h-screen bg-background text-foreground grid place-items-center px-4">
        <Toaster position="top-center" theme="dark" richColors />
        <div className="max-w-md text-center bg-card border border-white/10 rounded-3xl p-8">
          <h1 className="text-2xl font-black mb-3">אין הרשאת מנהל</h1>
          <p className="text-sm text-muted-foreground mb-2">החשבון שלך מחובר אך אינו מסומן כמנהל.</p>
          <p className="text-xs text-muted-foreground mb-6 break-all">User ID: {userId}</p>
          <button onClick={signOut} className="bg-white/10 px-4 py-2 rounded-xl text-sm">התנתק</button>
        </div>
      </div>
    );
  }

  const isActive = (to: string, exact?: boolean) => exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" theme="dark" richColors />

      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-white/5 px-4 h-14 flex items-center justify-between">
        <button onClick={() => setOpen(true)} className="p-2 -mr-2"><Menu size={20} /></button>
        <span className="font-black">פאנל ניהול</span>
        <button onClick={signOut} className="p-2 -ml-2"><LogOut size={18} /></button>
      </header>

      {/* Sidebar overlay (mobile) */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/70" />
          <aside className="absolute right-0 top-0 bottom-0 w-72 bg-card border-l border-white/10 p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <span className="font-black text-lg">פאנל ניהול</span>
              <button onClick={() => setOpen(false)} className="p-1"><X size={20} /></button>
            </div>
            <NavList isActive={isActive} />
          </aside>
        </div>
      )}

      <div className="md:flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 shrink-0 min-h-screen border-l border-white/5 p-4 sticky top-0">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground block mb-2">← לאתר</Link>
          <h1 className="font-black text-xl mb-6">פאנל ניהול</h1>
          <NavList isActive={isActive} />
          <button onClick={signOut} className="mt-8 w-full text-xs flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-2.5 rounded-xl">
            <LogOut size={14} /> התנתק
          </button>
        </aside>

        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavList({ isActive }: { isActive: (to: string, exact?: boolean) => boolean }) {
  return (
    <nav className="space-y-1">
      {NAV.map((n) => {
        const active = isActive(n.to, n.exact);
        const Icon = n.icon;
        return (
          <Link key={n.to} to={n.to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${active ? "bg-gradient-orange text-white font-bold" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}>
            <Icon size={16} />{n.label}
          </Link>
        );
      })}
    </nav>
  );
}
