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
  fetchCargos: () => Promise<void>;
};

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      onboarded: false,
      user: null,
      cargos: MOCK_CARGOS,
      myCargos: [],
      notifications: [
        { id: "n1", title: "Yangi taklif", body: "Sizning yukingizga taklif keldi", time: "5 daqiqa oldin", read: false }
      ],
      bookmarks: [],
      setOnboarded: (v: boolean) => set({ onboarded: v }),
      login: (name: string, phone: string, role: Role = "shipper") =>
        set({
          isLoggedIn: true,
          user: { name, phone, username: "@" + name.toLowerCase().replace(/\s/g, ""), role },
        }),
      logout: () => set({ isLoggedIn: false, user: null }),
      setRole: (r: Role) => set((s) => ({ user: s.user ? { ...s.user, role: r } : null })),
      
      // API orqali Botga yangi yuk qo'shish
      addCargo: async (c: Cargo) => {
        try {
          const API_URL = "https://web-production-f5c4c.up.railway.app";
          const payload = {
            yuk_turi: c.cargoType,
            qayerdan: c.from,
            qayerga: c.to,
            hajm_ogirlik: c.weight + (c.volume && c.volume !== "—" ? " " + c.volume : ""),
            mashina_turi: c.truckType,
            sana: c.loadDate,
            tolov_turi: c.payment,
            narx: c.price,
            telefon: c.contactPhone,
            buyurtmachi_id: "123456789", // Haqiqiy botda bu foydalanuvchi IDsi bo'ladi
          };

          await fetch(`${API_URL}/api/loads`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          set((s) => ({ cargos: [c, ...s.cargos], myCargos: [c, ...s.myCargos] }));
        } catch (error) {
          console.error("Yuk qo'shishda xatolik:", error);
        }
      },
      toggleBookmark: (id: string) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(id)
            ? s.bookmarks.filter((x) => x !== id)
            : [...s.bookmarks, id],
        })),
        
      // API orqali bazadagi yuklarni o'qish (Yuk topish)
      fetchCargos: async () => {
        try {
          const API_URL = "https://web-production-f5c4c.up.railway.app";
          const response = await fetch(`${API_URL}/api/loads`);
          if (response.ok) {
            const data = await response.json();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mappedCargos: Cargo[] = data.map((d: any) => ({
              id: d.id,
              from: d.qayerdan,
              to: d.qayerga,
              fromShort: (d.qayerdan || "").split(",")[0].toUpperCase(),
              toShort: (d.qayerga || "").split(",")[0].toUpperCase(),
              postedAt: new Date(parseInt(d.id)).toLocaleDateString("uz-UZ"),
              loadDate: d.sana || "Tez kunda",
              cargoType: d.yuk_turi,
              cargoEmoji: "📦",
              price: d.narx,
              negotiable: d.narx === "Kelishiladi",
              truckType: d.mashina_turi,
              truckEmoji: "🚛",
              weight: d.hajm_ogirlik,
              volume: "—",
              payment: d.tolov_turi,
              views: Math.floor(Math.random() * 20) + 1,
              contactName: "Foydalanuvchi",
              contactPhone: d.telefon,
              status: "Faol",
            }));
            set({ cargos: mappedCargos });
          }
        } catch (error) {
          console.error("API dan yuklarni olishda xatolik:", error);
        }
      },
    }),
    { name: "yukbor-app" },
  ),
);
