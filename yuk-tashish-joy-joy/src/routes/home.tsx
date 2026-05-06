import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Bookmark, MapPin, ArrowUpDown, Truck, Package, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { CargoCard } from "@/components/CargoCard";

export const Route = createFileRoute("/home")({
  component: Home,
});

function Home() {
  const { user, cargos, notifications } = useApp();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const swap = () => { setFrom(to); setTo(from); };
  const unread = notifications.filter((n) => !n.read).length;
  const isDriver = user?.role === "driver";

  return (
    <div className="px-4 pt-4">
      <header className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Salom 👋</p>
          <h1 className="font-display font-bold text-lg">{user?.name || "Mehmon"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/notifications" className="relative w-10 h-10 rounded-full bg-card shadow-card flex items-center justify-center">
            <Bell size={18} />
            {unread > 0 && <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{unread}</span>}
          </Link>
          <button className="w-10 h-10 rounded-full bg-card shadow-card flex items-center justify-center">
            <Bookmark size={18} />
          </button>
        </div>
      </header>

      {isDriver && (
        <div className="bg-card rounded-2xl p-4 mb-4 shadow-card flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
            <Truck className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Mening mashinam</p>
            <p className="font-display font-bold">Tent · 22t</p>
          </div>
          <Link to="/profile" className="ml-auto text-sm text-primary font-semibold">O'zgartirish</Link>
        </div>
      )}

      <div className="bg-gradient-primary rounded-3xl p-5 shadow-orange mb-5">
        <p className="text-white/90 text-xs font-semibold mb-3">{isDriver ? "YUK QIDIRISH" : "TEZKOR QIDIRUV"}</p>
        <div className="bg-white rounded-xl px-3 py-2.5 flex items-center gap-2 mb-2">
          <MapPin size={16} className="text-primary" />
          <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Qayerdan?" className="flex-1 bg-transparent outline-none text-sm" />
        </div>
        <div className="flex justify-center -my-1 relative z-10">
          <button onClick={swap} className="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center">
            <ArrowUpDown size={14} className="text-primary" />
          </button>
        </div>
        <div className="bg-white rounded-xl px-3 py-2.5 flex items-center gap-2 mb-3">
          <MapPin size={16} className="text-destructive" />
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Qayerga?" className="flex-1 bg-transparent outline-none text-sm" />
        </div>
        <Link to="/search" className="block bg-white text-primary text-center py-3 rounded-full font-semibold">Yuk qidirish</Link>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <Stat icon={<Package size={18} />} value={String(cargos.length)} label="Faol" />
        <Stat icon={<Truck size={18} />} value="34" label="Yetkazildi" />
        <Stat icon={<TrendingUp size={18} />} value="125M" label="UZS" />
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-lg">{isDriver ? "Mavjud yuklar" : "So'nggi yuklar"}</h2>
        <Link to="/search" className="text-sm text-primary font-semibold">Hammasi</Link>
      </div>

      <div className="space-y-3">
        {cargos.map((c) => <CargoCard key={c.id} cargo={c} />)}
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-card rounded-2xl p-3 shadow-card">
      <div className="text-primary mb-1">{icon}</div>
      <p className="font-display font-bold text-lg leading-none">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
