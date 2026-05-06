import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Package, Truck } from "lucide-react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState<"shipper" | "driver">("shipper");
  const nav = useNavigate();
  const login = useApp((s) => s.login);
  const valid = name.length > 1 && phone.replace(/\D/g, "").length === 9 && pwd.length >= 4;

  return (
    <div className="min-h-screen px-6 pt-12 pb-8 bg-background">
      <h1 className="font-display font-extrabold text-2xl mb-1">Ro'yxatdan o'tish</h1>
      <p className="text-muted-foreground text-sm mb-6">Yangi hisob yarating</p>

      <label className="text-sm font-semibold">Ismingiz</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="To'liq ism" className="w-full mt-2 mb-4 bg-surface border border-border rounded-xl px-4 py-3 outline-none focus:border-primary" />

      <label className="text-sm font-semibold">Telefon</label>
      <div className="flex items-center gap-2 bg-surface rounded-xl border border-border px-4 py-3 mt-2 mb-4 focus-within:border-primary">
        <span>🇺🇿</span><span className="font-semibold">+998</span>
        <input inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0,9))} placeholder="90 123 45 67" className="flex-1 bg-transparent outline-none font-mono-num" />
      </div>

      <label className="text-sm font-semibold mb-2 block">Rol tanlang</label>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button onClick={() => setRole("shipper")} className={`p-4 rounded-2xl border-2 text-left transition-all ${role === "shipper" ? "border-primary bg-accent shadow-soft" : "border-border bg-surface"}`}>
          <Package size={28} className={role === "shipper" ? "text-primary" : "text-muted-foreground"} />
          <p className="font-display font-bold mt-2 text-sm">Men yuk beraman</p>
          <p className="text-xs text-muted-foreground">📦 Shipper</p>
        </button>
        <button onClick={() => setRole("driver")} className={`p-4 rounded-2xl border-2 text-left transition-all ${role === "driver" ? "border-primary bg-accent shadow-soft" : "border-border bg-surface"}`}>
          <Truck size={28} className={role === "driver" ? "text-primary" : "text-muted-foreground"} />
          <p className="font-display font-bold mt-2 text-sm">Men yuk tashiyman</p>
          <p className="text-xs text-muted-foreground">🚛 Driver</p>
        </button>
      </div>

      <label className="text-sm font-semibold">Parol</label>
      <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="••••••" className="w-full mt-2 bg-surface border border-border rounded-xl px-4 py-3 outline-none focus:border-primary" />

      <button
        disabled={!valid}
        onClick={() => { login(name, "+998 " + phone, role); nav({ to: "/home" }); }}
        className="mt-6 w-full bg-gradient-primary text-white py-4 rounded-full font-semibold shadow-orange disabled:opacity-50"
      >
        Ro'yxatdan o'tish
      </button>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Hisobingiz bormi? <Link to="/login" className="text-primary font-semibold">Kirish</Link>
      </p>
    </div>
  );
}
