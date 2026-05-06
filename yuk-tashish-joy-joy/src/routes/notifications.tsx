import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bell } from "lucide-react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/notifications")({
  component: Notifications,
});

function Notifications() {
  const nav = useNavigate();
  const items = useApp((s) => s.notifications);
  return (
    <div>
      <div className="bg-background px-4 py-4 flex items-center gap-3 border-b border-border">
        <button onClick={() => nav({ to: "/home" })}><ArrowLeft /></button>
        <h1 className="flex-1 text-center font-display font-bold">Bildirishnomalar</h1>
        <span className="w-6" />
      </div>
      <div className="p-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-muted-foreground">
            <Bell size={48} strokeWidth={1.4} />
            <p className="mt-3">Bildirishnomalar yo'q</p>
          </div>
        ) : items.map((n) => (
          <div key={n.id} className={`bg-card rounded-2xl p-4 shadow-card flex gap-3 ${!n.read && "border-l-4 border-primary"}`}>
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary"><Bell size={18} /></div>
            <div className="flex-1">
              <p className="font-semibold">{n.title}</p>
              <p className="text-sm text-muted-foreground">{n.body}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
