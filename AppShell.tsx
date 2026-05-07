import { Outlet, useLocation, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/lib/store";
import { BottomNav } from "./BottomNav";
import { Bot } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

const PUBLIC = ["/", "/onboarding", "/login", "/register", "/otp"];

export function AppShell() {
  const loc = useLocation();
  const nav = useNavigate();
  const { isLoggedIn, onboarded } = useApp();

  const isPublic = PUBLIC.includes(loc.pathname);

  useEffect(() => {
    if (loc.pathname === "/") nav({ to: "/home" });
  }, [loc.pathname, nav]);

  const showNav = !isPublic;
  const showAI = showNav && loc.pathname === "/home";

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-md mx-auto bg-surface min-h-screen relative">
        <div key={loc.pathname} className="page-enter pb-24">
          <Outlet />
        </div>
        {showAI && (
          <Link
            to="/ai"
            className="fixed bottom-28 right-4 z-30 flex items-center gap-2 bg-gradient-primary text-white pl-2 pr-4 py-2 rounded-full shadow-orange"
            style={{ maxWidth: "calc(100% - 2rem)" }}
          >
            <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={20} />
            </span>
            <span className="text-sm font-semibold leading-tight">
              Sun'iy
              <br />
              intellekt
            </span>
          </Link>
        )}
        {showNav && <BottomNav />}
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
