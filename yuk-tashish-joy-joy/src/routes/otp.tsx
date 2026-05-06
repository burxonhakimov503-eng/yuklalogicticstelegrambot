import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useApp } from "@/lib/store";
import { z } from "zod";

export const Route = createFileRoute("/otp")({
  validateSearch: z.object({ phone: z.string().optional() }),
  component: Otp,
});

function Otp() {
  const { phone } = Route.useSearch();
  const nav = useNavigate();
  const login = useApp((s) => s.login);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const c = [...code];
    c[i] = d;
    setCode(c);
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  const filled = code.every((d) => d);

  return (
    <div className="min-h-screen flex flex-col px-6 pt-16 pb-8 bg-background">
      <h1 className="font-display font-extrabold text-2xl">Tasdiqlash kodi</h1>
      <p className="text-muted-foreground text-sm mt-2">+998 {phone || ""} raqamiga yuborildi</p>

      <div className="flex gap-2 mt-8 justify-between">
        {code.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            value={d}
            inputMode="numeric"
            onChange={(e) => setDigit(i, e.target.value)}
            className="w-12 h-14 text-center font-display font-bold text-xl bg-surface border border-border rounded-xl focus:border-primary focus:outline-none"
          />
        ))}
      </div>

      <button
        disabled={!filled}
        onClick={() => { login("Foydalanuvchi", "+998 " + (phone || "90 000 00 00")); nav({ to: "/home" }); }}
        className="mt-8 w-full bg-gradient-primary text-white py-4 rounded-full font-semibold shadow-orange disabled:opacity-50"
      >
        Tasdiqlash
      </button>

      <p className="text-center text-sm text-muted-foreground mt-4">Demo: istalgan 6 raqamni kiriting</p>
    </div>
  );
}
