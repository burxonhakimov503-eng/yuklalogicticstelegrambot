import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search as SearchIcon, ArrowUpDown, ChevronDown, Plus, X } from "lucide-react";
import { TRUCK_TYPES, CITIES } from "@/lib/mockData";
import { useApp } from "@/lib/store";
import { CargoCard } from "@/components/CargoCard";

export const Route = createFileRoute("/search")({
  component: Search,
});

function Search() {
  const [trucks, setTrucks] = useState<string[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showTrucks, setShowTrucks] = useState(false);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [results, setResults] = useState<typeof MOCK | null>(null);
  const cargos = useApp((s) => s.cargos);
  const MOCK = cargos;
  const nav = useNavigate();

  const swap = () => { setFrom(to); setTo(from); };
  const valid = from && to;

  const doSearch = () => {
    setResults(cargos.filter((c) =>
      (!from || c.from.toLowerCase().includes(from.toLowerCase())) &&
      (!to || c.to.toLowerCase().includes(to.toLowerCase()))
    ));
  };

  return (
    <div className="px-4 pt-6">
      <h1 className="font-display font-extrabold text-2xl mb-4">Qidiruv</h1>

      <div className="bg-card rounded-3xl p-4 shadow-card space-y-4">
        <div>
          <p className="font-semibold text-sm mb-2">Mashina turi <span className="text-primary">(tanlang)</span></p>
          <div className="flex flex-wrap gap-2">
            {trucks.map((t) => (
              <span key={t} className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs flex items-center gap-1">
                {t} <button onClick={() => setTrucks(trucks.filter((x) => x !== t))}><X size={12} /></button>
              </span>
            ))}
            <button onClick={() => setShowTrucks(true)} className="w-9 h-9 rounded-xl border border-dashed border-border flex items-center justify-center">
              <Plus size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div>
          <p className="font-semibold text-sm mb-2">Qayerdan</p>
          <button onClick={() => setShowFrom(true)} className="w-full bg-surface rounded-xl px-4 py-3 text-left flex items-center justify-between">
            <span className={from ? "" : "text-muted-foreground"}>{from || "Joy qo'shish"}</span>
            <ChevronDown size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="flex justify-center">
          <button onClick={swap} className="bg-accent text-primary px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1">
            <ArrowUpDown size={14} /> Almashtirish
          </button>
        </div>

        <div>
          <p className="font-semibold text-sm mb-2">Qayerga</p>
          <button onClick={() => setShowTo(true)} className="w-full bg-surface rounded-xl px-4 py-3 text-left flex items-center justify-between">
            <span className={to ? "" : "text-muted-foreground"}>{to || "Joy qo'shish"}</span>
            <ChevronDown size={16} className="text-muted-foreground" />
          </button>
        </div>

        <button
          onClick={doSearch}
          disabled={!valid}
          className="w-full bg-gradient-primary text-white py-3.5 rounded-full font-semibold disabled:opacity-40 disabled:bg-none disabled:bg-muted"
        >
          Yuklar qidirish
        </button>
      </div>

      {results === null ? (
        <>
          <h2 className="font-display font-bold text-xl mt-8 mb-3">Saqlangan qidiruvlar</h2>
          <div className="flex flex-col items-center py-12 text-muted-foreground">
            <SearchIcon size={48} strokeWidth={1.5} />
            <p className="mt-3">Saqlangan qidiruvlar yo'q</p>
          </div>
        </>
      ) : (
        <>
          <h2 className="font-display font-bold text-xl mt-6 mb-3">Natijalar ({results.length})</h2>
          <div className="space-y-3">
            {results.map((c) => <CargoCard key={c.id} cargo={c} />)}
          </div>
        </>
      )}

      {showTrucks && <TruckModal selected={trucks} onClose={() => setShowTrucks(false)} onSave={setTrucks} />}
      {showFrom && <CityModal title="Qayerdan" onClose={() => setShowFrom(false)} onSelect={(c) => { setFrom(c); setShowFrom(false); }} />}
      {showTo && <CityModal title="Qayerga" onClose={() => setShowTo(false)} onSelect={(c) => { setTo(c); setShowTo(false); }} />}
    </div>
  );
}

export function TruckModal({ selected, onClose, onSave }: { selected: string[]; onClose: () => void; onSave: (s: string[]) => void }) {
  const [picked, setPicked] = useState(selected);
  const [q, setQ] = useState("");
  const filtered = TRUCK_TYPES.filter((t) => t.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={onClose}>
      <div className="bg-background w-full max-w-md mx-auto rounded-t-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center px-4 py-4 border-b border-border">
          <button onClick={onClose}><X /></button>
          <h3 className="flex-1 text-center font-display font-bold">Yuk mashina turi</h3>
          <span className="w-6" />
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2.5">
            <SearchIcon size={16} className="text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Qidirish" className="bg-transparent outline-none flex-1 text-sm" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-4">
          {filtered.map((t) => {
            const on = picked.includes(t.name);
            return (
              <button key={t.name} onClick={() => setPicked(on ? picked.filter((x) => x !== t.name) : [...picked, t.name])} className="w-full bg-card rounded-2xl px-4 py-3 flex items-center gap-3 shadow-card">
                <span className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-xl">{t.emoji}</span>
                <span className="flex-1 text-left font-semibold">{t.name}</span>
                <span className={`w-6 h-6 rounded-md flex items-center justify-center ${on ? "bg-success text-white" : "bg-surface border border-border"}`}>
                  {on && "✓"}
                </span>
              </button>
            );
          })}
        </div>
        <div className="p-4 border-t border-border">
          <button onClick={() => { onSave(picked); onClose(); }} className="w-full bg-gradient-primary text-white py-3.5 rounded-full font-semibold">Saqlash</button>
        </div>
      </div>
    </div>
  );
}

export function CityModal({ title, onClose, onSelect }: { title: string; onClose: () => void; onSelect: (c: string) => void }) {
  const [q, setQ] = useState("");
  const filtered = CITIES.filter((c) => c.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={onClose}>
      <div className="bg-background w-full max-w-md mx-auto rounded-t-3xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center px-4 py-4 border-b border-border">
          <button onClick={onClose}><X /></button>
          <h3 className="flex-1 text-center font-display font-bold">{title}</h3>
          <span className="w-6" />
        </div>
        <div className="px-4 py-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Shahar qidirish" className="w-full bg-surface rounded-xl px-4 py-2.5 outline-none text-sm" />
        </div>
        <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-4">
          {filtered.map((c) => (
            <button key={c} onClick={() => onSelect(c)} className="w-full text-left bg-card rounded-xl px-4 py-3 shadow-card font-medium">
              📍 {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
