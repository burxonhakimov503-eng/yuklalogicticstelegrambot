import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, Plus, ClipboardList, User } from "lucide-react";

type NavItem = { to: string; icon: typeof Home; label: string; fab?: boolean };
const items: NavItem[] = [
  { to: "/home", icon: Home, label: "Asosiy" },
  { to: "/search", icon: Search, label: "Qidiruv" },
  { to: "/add", icon: Plus, label: "Yuk qo'shish", fab: true },
  { to: "/my-cargos", icon: ClipboardList, label: "Yuklarim" },
  { to: "/profile", icon: User, label: "Profil" },
];

export function BottomNav() {
  const loc = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-background border-t border-border max-w-md mx-auto">
      <div className="flex items-end justify-around px-2 pt-2 pb-3 relative">
        {items.map((it) => {
          const active = loc.pathname === it.to;
          const Icon = it.icon;
          if (it.fab) {
            return (
              <Link key={it.to} to={it.to as any} className="flex flex-col items-center gap-1 -mt-6">
                <span className="w-14 h-14 rounded-full bg-gradient-primary shadow-orange flex items-center justify-center text-white">
                  <Icon size={28} strokeWidth={2.5} />
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">{it.label}</span>
              </Link>
            );
          }
          return (
            <Link key={it.to} to={it.to as any} className="flex flex-col items-center gap-1 px-2 py-1 min-w-14">
              <Icon size={22} className={active ? "text-primary" : "text-muted-foreground"} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[11px] ${active ? "text-primary font-semibold" : "text-muted-foreground"}`}>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
