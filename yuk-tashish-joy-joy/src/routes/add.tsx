import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowUpDown, Minus, Plus, ChevronDown } from "lucide-react";
import { useApp } from "@/lib/store";
import { TruckModal, CityModal } from "./search";
import { toast } from "sonner";

export const Route = createFileRoute("/add")({
  component: AddCargo,
});

function AddCargo() {
  const nav = useNavigate();
  const addCargo = useApp((s) => s.addCargo);
  const [step, setStep] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [showTrucks, setShowTrucks] = useState(false);

  const [cargoType, setCargoType] = useState("");
  const [weight, setWeight] = useState(1);
  const [volume, setVolume] = useState("");
  const [trucksCount, setTrucksCount] = useState(1);
  const [truckType, setTruckType] = useState<string[]>([]);
  const [date, setDate] = useState("");

  const [negotiable, setNegotiable] = useState(true);
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState<"UZS" | "USD" | "RUB">("UZS");
  const [payment, setPayment] = useState<"Naqd" | "Pul o'tkazma" | "Ikkalasi">("Naqd");
  const [extra, setExtra] = useState("");

  const submit = () => {
    addCargo({
      id: String(Date.now()),
      from, to,
      fromShort: from.split(",")[0].toUpperCase(),
      toShort: to.split(",")[0].toUpperCase(),
      postedAt: "Hozir",
      loadDate: date || "Yuklashga tayyor",
      cargoType: cargoType || "Yuk",
      cargoEmoji: "📦",
      price: negotiable ? "Narx kelishiladi" : `${price} ${currency}`,
      negotiable,
      truckType: truckType[0] || "Tent",
      truckEmoji: "🚛",
      weight: `${weight.toFixed(2)}t`,
      volume: volume || "—",
      payment,
      views: 0,
      contactName: "Siz",
      contactPhone: "+998 90 000 00 00",
      extra,
      status: "Faol",
    });
    toast.success("Yuk qo'shildi!");
    nav({ to: "/my-cargos" });
  };

  return (
    <div className="min-h-screen bg-surface pb-32">
      <div className="bg-background px-4 py-4 flex items-center gap-3 border-b border-border">
        <button onClick={() => step > 1 ? setStep(step - 1) : nav({ to: "/home" })}><ArrowLeft /></button>
        <h1 className="flex-1 text-center font-display font-bold">Yuk qo'shish</h1>
        <span className="w-6" />
      </div>

      <div className="bg-background px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display font-bold text-xl">{["Manzilni tanlang", "Yuk ma'lumotlari", "To'lov va qo'shimcha"][step - 1]}</h2>
          <span className="text-sm text-muted-foreground font-semibold">{step} / 3</span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-gradient-primary transition-all" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      </div>

      <div className="px-4 pt-6 space-y-5">
        {step === 1 && (
          <>
            <div>
              <label className="font-semibold text-sm mb-2 block">Qayerdan</label>
              <button onClick={() => setShowFrom(true)} className="w-full bg-card rounded-xl px-4 py-3.5 flex items-center justify-between shadow-card">
                <span className={from ? "" : "text-muted-foreground"}>{from || "Qayerdan"}</span>
                <ChevronDown size={18} className="text-muted-foreground" />
              </button>
            </div>
            <div className="flex justify-center">
              <button onClick={() => { const t = from; setFrom(to); setTo(t); }} className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <ArrowUpDown size={16} className="text-primary" />
              </button>
            </div>
            <div>
              <label className="font-semibold text-sm mb-2 block">Qayerga</label>
              <button onClick={() => setShowTo(true)} className="w-full bg-card rounded-xl px-4 py-3.5 flex items-center justify-between shadow-card">
                <span className={to ? "" : "text-muted-foreground"}>{to || "Qayerga"}</span>
                <ChevronDown size={18} className="text-muted-foreground" />
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Yuk turi"><input value={cargoType} onChange={(e) => setCargoType(e.target.value)} placeholder="Masalan: тахта" className="w-full bg-card rounded-xl px-4 py-3.5 shadow-card outline-none" /></Field>
            <Field label="Og'irlik (tonna)">
              <div className="flex items-center bg-card rounded-xl shadow-card overflow-hidden">
                <button onClick={() => setWeight(Math.max(0.5, weight - 0.5))} className="px-4 py-3.5 text-primary"><Minus size={18} /></button>
                <input type="number" value={weight} onChange={(e) => setWeight(+e.target.value || 0)} className="flex-1 text-center bg-transparent outline-none font-mono-num font-bold" />
                <button onClick={() => setWeight(weight + 0.5)} className="px-4 py-3.5 text-primary"><Plus size={18} /></button>
              </div>
            </Field>
            <Field label="Hajmi (m³) — ixtiyoriy"><input value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="—" className="w-full bg-card rounded-xl px-4 py-3.5 shadow-card outline-none" /></Field>
            <Field label="Mashinalar soni">
              <div className="flex items-center bg-card rounded-xl shadow-card overflow-hidden">
                <button onClick={() => setTrucksCount(Math.max(1, trucksCount - 1))} className="px-4 py-3.5 text-primary"><Minus size={18} /></button>
                <span className="flex-1 text-center font-mono-num font-bold">{trucksCount}</span>
                <button onClick={() => setTrucksCount(trucksCount + 1)} className="px-4 py-3.5 text-primary"><Plus size={18} /></button>
              </div>
            </Field>
            <Field label="Mashina turi">
              <button onClick={() => setShowTrucks(true)} className="w-full bg-card rounded-xl px-4 py-3.5 shadow-card flex items-center justify-between">
                <span className={truckType.length ? "" : "text-muted-foreground"}>{truckType.join(", ") || "Tanlash"}</span>
                <ChevronDown size={18} />
              </button>
            </Field>
            <Field label="Yuklanish sanasi"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-card rounded-xl px-4 py-3.5 shadow-card outline-none" /></Field>
          </>
        )}

        {step === 3 && (
          <>
            <Field label="Narx">
              <div className="flex gap-2 mb-2">
                <button onClick={() => setNegotiable(true)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${negotiable ? "bg-gradient-primary text-white" : "bg-card shadow-card"}`}>Narx kelishiladi</button>
                <button onClick={() => setNegotiable(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${!negotiable ? "bg-gradient-primary text-white" : "bg-card shadow-card"}`}>Aniq narx</button>
              </div>
              {!negotiable && (
                <div className="flex gap-2">
                  <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Summa" className="flex-1 bg-card rounded-xl px-4 py-3.5 shadow-card outline-none font-mono-num" />
                  <select value={currency} onChange={(e) => setCurrency(e.target.value as any)} className="bg-card rounded-xl px-3 shadow-card outline-none">
                    <option>UZS</option><option>USD</option><option>RUB</option>
                  </select>
                </div>
              )}
            </Field>
            <Field label="To'lov turi">
              <div className="grid grid-cols-3 gap-2">
                {(["Naqd", "Pul o'tkazma", "Ikkalasi"] as const).map((p) => (
                  <button key={p} onClick={() => setPayment(p)} className={`py-2.5 rounded-xl text-xs font-semibold ${payment === p ? "bg-gradient-primary text-white" : "bg-card shadow-card"}`}>{p}</button>
                ))}
              </div>
            </Field>
            <Field label="Qo'shimcha ma'lumot">
              <textarea value={extra} onChange={(e) => setExtra(e.target.value)} rows={4} placeholder="Masalan: Глонас обязательно" className="w-full bg-card rounded-xl px-4 py-3 shadow-card outline-none resize-none" />
            </Field>
          </>
        )}
      </div>

      <div className="fixed bottom-20 inset-x-0 max-w-md mx-auto px-4 py-3 bg-background border-t border-border flex gap-3">
        <button onClick={() => step > 1 ? setStep(step - 1) : nav({ to: "/home" })} className="flex-1 py-3 rounded-full border border-border font-semibold">{step === 1 ? "Bekor qilish" : "Orqaga"}</button>
        {step < 3 ? (
          <button onClick={() => setStep(step + 1)} disabled={step === 1 ? !(from && to) : false} className="flex-1 bg-gradient-primary text-white py-3 rounded-full font-semibold disabled:opacity-40">Keyingi →</button>
        ) : (
          <button onClick={submit} className="flex-1 bg-gradient-primary text-white py-3 rounded-full font-semibold shadow-orange">🚛 Yuklash</button>
        )}
      </div>

      {showFrom && <CityModal title="Qayerdan" onClose={() => setShowFrom(false)} onSelect={(c) => { setFrom(c); setShowFrom(false); }} />}
      {showTo && <CityModal title="Qayerga" onClose={() => setShowTo(false)} onSelect={(c) => { setTo(c); setShowTo(false); }} />}
      {showTrucks && <TruckModal selected={truckType} onClose={() => setShowTrucks(false)} onSave={setTruckType} />}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-semibold text-sm mb-2 block">{label}</label>
      {children}
    </div>
  );
}
