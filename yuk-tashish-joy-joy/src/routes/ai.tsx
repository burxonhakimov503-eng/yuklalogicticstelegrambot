import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Send, Bot } from "lucide-react";

export const Route = createFileRoute("/ai")({
  component: AI,
});

type Msg = { role: "bot" | "user"; text: string };

const PROMPTS = ["Yuk topishda yordam", "Narx hisoblash", "Qaysi yo'nalish ko'p?"];

function AI() {
  const nav = useNavigate();
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Salom! Men YukBor AI yordamchisiman. Sizga qanday yordam bera olaman? 🚛" },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "bot", text: "Tushundim! Sizning so'rovingiz bo'yicha eng yaxshi variantlarni qidiraman 🔍" }]);
    }, 600);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-background px-4 py-4 flex items-center gap-3 border-b border-border">
        <button onClick={() => nav({ to: "/home" })}><ArrowLeft /></button>
        <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white"><Bot size={18} /></div>
        <div className="flex-1">
          <p className="font-display font-bold leading-tight">Sun'iy intellekt</p>
          <p className="text-xs text-success">● Online</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-3 pb-44">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${m.role === "bot" ? "bg-gradient-primary text-white rounded-bl-sm" : "bg-card shadow-card rounded-br-sm"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-20 inset-x-0 max-w-md mx-auto bg-background border-t border-border px-4 py-3">
        <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
          {PROMPTS.map((p) => (
            <button key={p} onClick={() => send(p)} className="whitespace-nowrap text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full font-semibold">{p}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} placeholder="Xabar yozing..." className="flex-1 bg-surface rounded-full px-4 py-2.5 outline-none text-sm" />
          <button onClick={() => send(input)} className="w-11 h-11 rounded-full bg-gradient-primary text-white flex items-center justify-center shadow-orange"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
}
