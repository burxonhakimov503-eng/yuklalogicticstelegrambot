import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_CARGOS, type Cargo } from "./mockData";

export type Role = "shipper" | "driver";

type AppState = {
  isLoggedIn: boolean;
  onboarded: boolean;
  user: { name: string; phone: string; username: string; role: Role } | null;
  cargos: Cargo[];
  myCargos: Cargo[];
  notifications: { id: string; title: string; body: string; time: string; read: boolean }[];
  bookmarks: string[];
  setOnboarded: (v: boolean) => void;
  login: (name: string, phone: string, role?: Role) => void;
  logout: () => void;
  setRole: (r: Role) => void;
  addCargo: (c: Cargo) => void;
  toggleBookmark: (id: string) => void;
};

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      onboarded: false,
      user: null,
      cargos: MOCK_CARGOS,
      myCargos: [MOCK_CARGOS[0], MOCK_CARGOS[2]],
      notifications: [
        { id: "n1", title: "Yangi taklif", body: "Sizning yukingizga taklif keldi", time: "5 daqiqa oldin", read: false },
        { id: "n2", title: "Narx kelishildi", body: "Toshkent → Moskva yo'nalishi bo'yicha", time: "1 soat oldin", read: false },
        { id: "n3", title: "Haydovchi bog'landi", body: "Karimov A. siz bilan bog'landi", time: "Kecha", read: true },
      ],
      bookmarks: [],
      setOnboarded: (v) => set({ onboarded: v }),
      login: (name, phone, role = "shipper") =>
        set({ isLoggedIn: true, user: { name, phone, username: "@" + name.toLowerCase().replace(/\s/g, ""), role } }),
      logout: () => set({ isLoggedIn: false, user: null }),
      setRole: (r) => set((s) => ({ user: s.user ? { ...s.user, role: r } : null })),
      addCargo: (c) => set((s) => ({ cargos: [c, ...s.cargos], myCargos: [c, ...s.myCargos] })),
      toggleBookmark: (id) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(id) ? s.bookmarks.filter((x) => x !== id) : [...s.bookmarks, id],
        })),
    }),
    { name: "yukbor-app" }
  )
);
