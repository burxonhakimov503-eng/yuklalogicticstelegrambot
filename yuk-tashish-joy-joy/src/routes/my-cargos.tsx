import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Box, Pencil, Trash2, Plus } from "lucide-react";
import { useApp } from "@/lib/store";
import { CargoCard } from "@/components/CargoCard";

export const Route = createFileRoute("/my-cargos")({
  component: MyCargos,
});

function MyCargos() {
  const [tab, setTab] = useState<"active" | "history">("active");
  const myCargos = useApp((s) => s.myCargos);
  const list = tab === "active" ? myCargos.filter((c) => c.status !== "Yakunlangan") : myCargos.filter((c) => c.status === "Yakunlangan");

  return (
    <div className="px-4 pt-6">
      <h1 className="font-display font-extrabold text-2xl mb-4">Yuklarim</h1>
      <div className="bg-surface border border-border rounded-full p-1 flex mb-5">
        <button onClick={() => setTab("active")} className={`flex-1 py-2.5 rounded-full text-sm font-semibold ${tab === "active" ? "bg-gradient-primary text-white shadow-orange" : "text-muted-foreground"}`}>Faol yuklar</button>
        <button onClick={() => setTab("history")} className={`flex-1 py-2.5 rounded-full text-sm font-semibold ${tab === "history" ? "bg-gradient-primary text-white shadow-orange" : "text-muted-foreground"}`}>Tarix</button>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center text-muted-foreground py-20">
          <Box size={64} strokeWidth={1.3} />
          <p className="mt-4 mb-6">Yuklar topilmadi</p>
          <Link to="/add" className="bg-gradient-primary text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-orange">
            <Plus size={18} /> Yuk qo'shish
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((c) => (
            <div key={c.id} className="relative">
              <CargoCard cargo={c} />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  c.status === "Faol" ? "bg-success/15 text-success" :
                  c.status === "Kutilmoqda" ? "bg-warning/20 text-warning" :
                  "bg-muted text-muted-foreground"
                }`}>{c.status}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="flex-1 bg-card border border-border rounded-xl py-2 text-sm font-semibold flex items-center justify-center gap-1"><Pencil size={14} /> Tahrirlash</button>
                <button className="flex-1 bg-destructive/10 text-destructive rounded-xl py-2 text-sm font-semibold flex items-center justify-center gap-1"><Trash2 size={14} /> O'chirish</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
