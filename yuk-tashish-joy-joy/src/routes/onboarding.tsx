import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Truck, Package, Zap, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const slides = [
  { icon: Package, title: "Yuk joylashtiring", desc: "Tezkor va ishonchli yuk joylashtirish platformasi", color: "from-orange-400 to-orange-600" },
  { icon: Truck, title: "Yuk toping, pul ishlang", desc: "Haydovchilar uchun mukammal yo'nalishlar", color: "from-orange-500 to-orange-700" },
  { icon: Zap, title: "Tez, ishonchli, arzon", desc: "Eng yaxshi narxda eng tez yetkazib berish", color: "from-orange-400 to-orange-700" },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const nav = useNavigate();
  const setOnboarded = useApp((s) => s.setOnboarded);
  const S = slides[i].icon;
  const next = () => {
    if (i < slides.length - 1) setI(i + 1);
    else { setOnboarded(true); nav({ to: "/login" }); }
  };
  return (
    <div className="min-h-screen flex flex-col bg-background px-6 pt-12 pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Truck size={20} className="text-white" />
          </div>
          <span className="font-display font-extrabold text-xl">YukBor</span>
        </div>
        <button onClick={() => { setOnboarded(true); nav({ to: "/login" }); }} className="text-sm text-muted-foreground">O'tkazib yuborish</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className={`w-48 h-48 rounded-full bg-gradient-to-br ${slides[i].color} flex items-center justify-center shadow-orange mb-10 transition-all`}>
          <S size={88} className="text-white" strokeWidth={1.8} />
        </div>
        <h1 className="font-display font-bold text-3xl mb-3">{slides[i].title}</h1>
        <p className="text-muted-foreground max-w-xs">{slides[i].desc}</p>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_, idx) => (
          <div key={idx} className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-2 bg-border"}`} />
        ))}
      </div>

      <button onClick={next} className="w-full bg-gradient-primary text-white py-4 rounded-full font-semibold shadow-orange flex items-center justify-center gap-2">
        {i === slides.length - 1 ? "Boshlash" : "Keyingi"} <ArrowRight size={20} />
      </button>
    </div>
  );
}
