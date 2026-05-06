import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, ChevronRight, User, Languages, Wallet, Bell, Key, FileText, Shield, HelpCircle, Info, LogOut, Truck, Package } from "lucide-react";
import { useApp } from "@/lib/store";
import { useState } from "react";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  const { user, logout, setRole } = useApp();
  const nav = useNavigate();
  const [notif, setNotif] = useState(true);
  const initial = user?.name?.[0]?.toUpperCase() || "U";

  return (
    <div className="px-4 pt-6">
      <h1 className="font-display font-extrabold text-2xl mb-4">Profil</h1>

      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center font-display font-extrabold text-3xl text-primary">{initial}</div>
          <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-orange">
            <Camera size={14} />
          </button>
        </div>
        <div>
          <p className="font-display font-bold text-xl">{user?.name}</p>
          <p className="text-sm text-muted-foreground">{user?.phone}</p>
          <p className="text-sm text-muted-foreground">{user?.username}</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-3 mb-4 shadow-card">
        <p className="text-xs text-muted-foreground mb-2 px-1 font-semibold">ROL</p>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setRole("shipper")} className={`p-3 rounded-xl flex flex-col items-center text-xs font-semibold gap-1 ${user?.role === "shipper" ? "bg-gradient-primary text-white" : "bg-surface"}`}>
            <Package size={20} /> Yuk beruvchi
          </button>
          <button onClick={() => setRole("driver")} className={`p-3 rounded-xl flex flex-col items-center text-xs font-semibold gap-1 ${user?.role === "driver" ? "bg-gradient-primary text-white" : "bg-surface"}`}>
            <Truck size={20} /> Haydovchi
          </button>
        </div>
      </div>

      <Group>
        <Row icon={<User />} label="Profilni tahrirlash" />
        <Row icon={<Languages />} label="Til" right="O'zbek" />
        <Row icon={<Wallet />} label="Valyuta" right="🇺🇿 UZS" />
        <Row icon={<Bell />} label="Bildirishnomalar" right={
          <button onClick={() => setNotif(!notif)} className={`w-11 h-6 rounded-full relative transition-all ${notif ? "bg-primary" : "bg-border"}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${notif ? "left-5" : "left-0.5"}`} />
          </button>
        } noChevron />
      </Group>

      <Group>
        <Row icon={<Key />} label="Parolni o'zgartirish" />
      </Group>

      <Group>
        <Row icon={<FileText />} label="Foydalanuvchi shartlari" />
        <Row icon={<Shield />} label="Maxfiy siyosati" />
        <Row icon={<HelpCircle />} label="Yordam" />
        <Row icon={<Info />} label="Ilova versiyasi" right="2.1.3" noChevron />
      </Group>

      <button onClick={() => { logout(); nav({ to: "/login" }); }} className="w-full mt-6 mb-4 border-2 border-destructive text-destructive font-semibold py-3 rounded-full flex items-center justify-center gap-2">
        <LogOut size={18} /> Chiqish
      </button>
    </div>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return <div className="bg-card rounded-2xl shadow-card mb-3 divide-y divide-border overflow-hidden">{children}</div>;
}

function Row({ icon, label, right, noChevron }: { icon: React.ReactNode; label: string; right?: React.ReactNode; noChevron?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1 font-medium">{label}</span>
      {right && <span className="text-sm text-muted-foreground">{right}</span>}
      {!noChevron && <ChevronRight size={18} className="text-muted-foreground" />}
    </div>
  );
}
