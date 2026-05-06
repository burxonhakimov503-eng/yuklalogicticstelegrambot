import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Truck, Phone } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function formatPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 9);
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  return parts.join(" ");
}

function Login() {
  const [phone, setPhone] = useState("");
  const nav = useNavigate();
  const valid = phone.replace(/\D/g, "").length === 9;
  return (
    <div className="min-h-screen flex flex-col px-6 pt-16 pb-8 bg-background">
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-orange mb-4">
          <Truck size={32} className="text-white" />
        </div>
        <h1 className="font-display font-extrabold text-2xl">Xush kelibsiz</h1>
        <p className="text-muted-foreground text-sm mt-1">Telefon raqamingizni kiriting</p>
      </div>

      <label className="text-sm font-semibold mb-2">Telefon raqam</label>
      <div className="flex items-center gap-2 bg-surface rounded-2xl border border-border px-4 py-3 focus-within:border-primary">
        <span className="text-xl">🇺🇿</span>
        <span className="font-semibold text-foreground">+998</span>
        <Phone size={16} className="text-muted-foreground" />
        <input
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          placeholder="90 123 45 67"
          className="flex-1 bg-transparent outline-none font-mono-num"
        />
      </div>

      <button
        disabled={!valid}
        onClick={() => nav({ to: "/otp", search: { phone } })}
        className="mt-6 w-full bg-gradient-primary text-white py-4 rounded-full font-semibold shadow-orange disabled:opacity-50 disabled:shadow-none"
      >
        Kirish
      </button>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Hisobingiz yo'qmi? <Link to="/register" className="text-primary font-semibold">Ro'yxatdan o'tish</Link>
      </p>
    </div>
  );
}
