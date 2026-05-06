import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Share2, Bookmark, Phone, Send } from "lucide-react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/cargo/$id")({
  component: CargoDetail,
});

function CargoDetail() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const cargo = useApp((s) => s.cargos.find((c) => c.id === id));
  if (!cargo) return <div className="p-6">Topilmadi</div>;
  const initial = cargo.contactName[0];

  return (
    <div className="pb-32">
      <div className="bg-background px-4 py-4 flex items-center gap-3 border-b border-border">
        <button onClick={() => nav({ to: "/home" })}><ArrowLeft /></button>
        <h1 className="flex-1 text-center font-display font-bold">Yuk haqida</h1>
        <button><Share2 size={20} /></button>
        <button><Bookmark size={20} /></button>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full border-2 border-success" />
              <div className="flex-1 w-px bg-border my-1" />
              <div className="text-destructive text-xl">📍</div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground font-semibold tracking-wider">QAYERDAN</p>
                <p className="font-display font-bold text-lg leading-tight">{cargo.from}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold tracking-wider">QAYERGA</p>
                <p className="font-display font-bold text-lg leading-tight">{cargo.to}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-card">
          <h3 className="font-display font-bold text-xl mb-4">{cargo.cargoEmoji} {cargo.cargoType}</h3>
          <Detail label="Og'irligi" value={cargo.weight} />
          <Detail label="Hajmi" value={cargo.volume} />
          <Detail label="Mashinalar soni" value="1" />
          <Detail label="Mashina turi" value={cargo.truckType} />
          <Detail label="Yaratilgan" value={cargo.loadDate} />
          <Detail label="Yuklanish sanasi" value={cargo.loadDate} last />
        </div>

        {cargo.extra && (
          <div className="bg-card rounded-2xl p-5 shadow-card">
            <p className="font-display font-bold mb-2">Qo'shimcha ma'lumot</p>
            <p className="text-muted-foreground text-sm">{cargo.extra}</p>
          </div>
        )}

        <div className="bg-card rounded-2xl p-5 shadow-card">
          <p className="font-display font-bold mb-3">To'lov ma'lumotlari</p>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Narxi:</span>
            <span className={`font-display font-bold ${cargo.negotiable ? "text-primary" : "text-foreground"}`}>{cargo.price}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-muted-foreground">To'lov:</span>
            <span className="font-semibold">{cargo.payment}</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-display font-bold text-lg">{initial}</div>
          <div className="flex-1">
            <p className="font-display font-bold">{cargo.contactName}</p>
            <span className="inline-flex items-center gap-1 bg-success/15 text-success text-xs px-2 py-1 rounded-full mt-1 font-mono-num">
              <Phone size={12} /> {cargo.contactPhone}
            </span>
          </div>
          <button className="border border-primary/40 text-primary px-3 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
            <Send size={14} /> Telegram
          </button>
        </div>
      </div>

      <div className="fixed bottom-20 inset-x-0 max-w-md mx-auto px-4 py-3 bg-background border-t border-border">
        <a href={`tel:${cargo.contactPhone}`} className="block w-full bg-gradient-primary text-white text-center py-3.5 rounded-full font-semibold shadow-orange">
          📞 Bog'lanish
        </a>
      </div>
    </div>
  );
}

function Detail({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex justify-between py-2.5 ${last ? "" : "border-b border-border"}`}>
      <span className="text-muted-foreground text-sm">{label}:</span>
      <span className="font-semibold text-sm">{value}</span>
    </div>
  );
}
