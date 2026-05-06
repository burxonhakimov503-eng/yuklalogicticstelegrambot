import { Link } from "@tanstack/react-router";
import { Clock, Eye, Truck, Bookmark, Crosshair, Hexagon, Calendar, CreditCard, LayoutPanelTop, ArrowRight } from "lucide-react";
import type { Cargo } from "@/lib/mockData";

export function CargoCard({ cargo }: { cargo: Cargo }) {
  const ready = cargo.loadDate === "Yuklashga tayyor";
  const dateLabel = ready ? "Tayyor" : cargo.loadDate.slice(0, 5);

  return (
    <Link
      to="/cargo/$id"
      params={{ id: cargo.id }}
      className="block rounded-3xl overflow-hidden shadow-card bg-card hover:-translate-y-0.5 transition-transform"
    >
      {/* Dark gradient header */}
      <div className="relative px-4 pt-3 pb-5 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black text-white overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute right-10 bottom-0 w-24 h-24 rounded-full bg-white/5" />
        <div className="relative flex items-start justify-between gap-2">
          {ready ? (
            <span className="inline-flex items-center gap-1.5 bg-success text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white/90" />
              Yuklashga tayyor
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white/90" />
              {cargo.status || "Faol"}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-white/80">
            <Clock size={12} /> {cargo.postedAt}
          </span>
        </div>
        <div className="relative mt-6 flex items-center gap-3 font-display font-extrabold tracking-wide">
          <span className="text-base">{cargo.fromShort}</span>
          <ArrowRight size={18} className="text-primary" />
          <span className="text-base">{cargo.toShort}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center text-muted-foreground">
              <LayoutPanelTop size={16} />
            </div>
            <p className="font-display font-bold text-base">{cargo.cargoType}</p>
          </div>
          {cargo.negotiable ? (
            <span className="bg-primary/10 text-primary text-sm font-semibold px-3 py-1.5 rounded-full">Kelishiladi</span>
          ) : (
            <span className="bg-foreground text-background text-sm font-semibold px-3 py-1.5 rounded-full">{cargo.price}</span>
          )}
        </div>

        {/* Stat grid */}
        <div className="grid grid-cols-4 gap-2">
          <Stat icon={<Crosshair size={14} />} label="OG'IRLIK" value={cargo.weight.replace("t", " t")} />
          <Stat icon={<Hexagon size={14} />} label="HAJM" value={cargo.volume === "—" ? "— m³" : cargo.volume} />
          <Stat icon={<Truck size={14} />} label="MASHINA" value="1 ta" />
          <Stat
            icon={<Calendar size={14} />}
            label="YUKLANISH"
            value={dateLabel}
            valueClassName={ready ? "text-success" : ""}
          />
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1.5 rounded-full">
            <Truck size={13} /> {cargo.truckType}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-success/10 text-success text-xs font-semibold px-2.5 py-1.5 rounded-full">
            <CreditCard size={13} /> {cargo.payment}
          </span>
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground font-mono-num">
            <Eye size={13} /> {cargo.views}
          </span>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); }}
            className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-muted-foreground hover:text-primary"
          >
            <Bookmark size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
}

function Stat({ icon, label, value, valueClassName = "" }: { icon: React.ReactNode; label: string; value: string; valueClassName?: string }) {
  return (
    <div className="bg-surface rounded-xl p-2 flex flex-col items-center text-center">
      <div className="text-muted-foreground/70 mb-1">{icon}</div>
      <p className="text-[9px] font-semibold tracking-wider text-muted-foreground">{label}</p>
      <p className={`text-sm font-display font-bold mt-0.5 ${valueClassName}`}>{value}</p>
    </div>
  );
}
