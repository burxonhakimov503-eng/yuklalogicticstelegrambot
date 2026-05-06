export type Cargo = {
  id: string;
  from: string;
  to: string;
  fromShort: string;
  toShort: string;
  postedAt: string;
  loadDate: string;
  cargoType: string;
  cargoEmoji: string;
  price: string; // "Narx kelishiladi" or "12,000,000 UZS"
  negotiable: boolean;
  truckType: string;
  truckEmoji: string;
  weight: string;
  volume: string;
  payment: "Naqd" | "Pul o'tkazma" | "Ikkalasi";
  views: number;
  contactName: string;
  contactPhone: string;
  extra?: string;
  status?: "Faol" | "Kutilmoqda" | "Yakunlangan";
};

export const TRUCK_TYPES = [
  { name: "Mega", emoji: "🚛" },
  { name: "Avtovoz", emoji: "🚌" },
  { name: "Tral", emoji: "🏗️" },
  { name: "Tent", emoji: "⛺" },
  { name: "Muzlatgich", emoji: "❄️" },
  { name: "Konteyner", emoji: "📦" },
  { name: "Platforma", emoji: "🏭" },
  { name: "Boshqa", emoji: "🔧" },
  { name: "ISUZU", emoji: "🚐" },
];

export const CITIES = [
  "Toshkent, UZ", "Buxoro, UZ", "Samarqand, UZ", "Namangan, UZ", "Andijon, UZ", "Farg'ona, UZ",
  "Moskva, RU", "Sankt-Peterburg, RU", "Saratov, RU", "Sverdlovsk, RU", "Novosibirsk, RU",
];

export const MOCK_CARGOS: Cargo[] = [
  { id: "1", from: "Sankt-Peterburg, Rossiya", to: "Toshkent, O'zbekiston", fromShort: "SANKT-PETERBURG", toShort: "TOSHKENT", postedAt: "6 may 23:22", loadDate: "06/05/2026", cargoType: "Yuk taxta", cargoEmoji: "📦", price: "Narx kelishiladi", negotiable: true, truckType: "Tent", truckEmoji: "⛺", weight: "22.00t", volume: "—", payment: "Naqd", views: 12, contactName: "Ahmedova O", contactPhone: "+998973623338", extra: "Глонас обязательно", status: "Faol" },
  { id: "2", from: "Saratov, Rossiya", to: "Toshkent, O'zbekiston", fromShort: "SARATOV, RU", toShort: "TOSHKENT, UZ", postedAt: "6 may 23:19", loadDate: "Yuklashga tayyor", cargoType: "22 тонна", cargoEmoji: "🥬", price: "Narx kelishiladi", negotiable: true, truckType: "Muzlatgich", truckEmoji: "❄️", weight: "22.00t", volume: "—", payment: "Naqd", views: 2, contactName: "Karimov A", contactPhone: "+998901234567", status: "Faol" },
  { id: "3", from: "Toshkent, O'zbekiston", to: "Moskva, Rossiya", fromShort: "TOSHKENT, UZ", toShort: "MOSKVA, RU", postedAt: "6 may 23:11", loadDate: "05/08/2026", cargoType: "капуста", cargoEmoji: "🥬", price: "Narx kelishiladi", negotiable: true, truckType: "Muzlatgich", truckEmoji: "❄️", weight: "22.00t", volume: "—", payment: "Pul o'tkazma", views: 8, contactName: "Rustamov S", contactPhone: "+998935551122", status: "Kutilmoqda" },
  { id: "4", from: "Sverdlovsk, Rossiya", to: "Buxoro, O'zbekiston", fromShort: "SVERDLOVSK, RU", toShort: "BUXORO, UZ", postedAt: "6 may 23:08", loadDate: "06/05/2026", cargoType: "тахта", cargoEmoji: "🪵", price: "Narx kelishiladi", negotiable: true, truckType: "Tent", truckEmoji: "⛺", weight: "1.00t", volume: "—", payment: "Naqd", views: 4, contactName: "Yusupov B", contactPhone: "+998901112233", extra: "Глонас обезательно" },
  { id: "5", from: "Novosibirsk, Rossiya", to: "Samarqand, O'zbekiston", fromShort: "NOVOSIBIRSK, RU", toShort: "SAMARQAND, UZ", postedAt: "6 may 22:55", loadDate: "10/05/2026", cargoType: "электроника", cargoEmoji: "📱", price: "12,000,000 UZS", negotiable: false, truckType: "Konteyner", truckEmoji: "📦", weight: "5.00t", volume: "20 m³", payment: "Pul o'tkazma", views: 23, contactName: "Sobirov D", contactPhone: "+998936667788" },
  { id: "6", from: "Moskva, Rossiya", to: "Namangan, O'zbekiston", fromShort: "MOSKVA, RU", toShort: "NAMANGAN, UZ", postedAt: "6 may 22:40", loadDate: "08/05/2026", cargoType: "textile", cargoEmoji: "🧵", price: "8,500,000 UZS", negotiable: false, truckType: "Mega", truckEmoji: "🚛", weight: "18.00t", volume: "—", payment: "Naqd", views: 7, contactName: "Toshpulatov R", contactPhone: "+998905554433" },
  { id: "7", from: "Toshkent, O'zbekiston", to: "Sankt-Peterburg, Rossiya", fromShort: "TOSHKENT, UZ", toShort: "SANKT-PETERBURG", postedAt: "6 may 22:30", loadDate: "12/05/2026", cargoType: "fruits", cargoEmoji: "🍎", price: "Narx kelishiladi", negotiable: true, truckType: "Muzlatgich", truckEmoji: "❄️", weight: "20.00t", volume: "—", payment: "Naqd", views: 14, contactName: "Ergashev M", contactPhone: "+998937778899" },
  { id: "8", from: "Andijon, O'zbekiston", to: "Saratov, Rossiya", fromShort: "ANDIJON, UZ", toShort: "SARATOV, RU", postedAt: "6 may 22:15", loadDate: "07/05/2026", cargoType: "металл", cargoEmoji: "🔩", price: "15,000,000 UZS", negotiable: false, truckType: "Tral", truckEmoji: "🏗️", weight: "25.00t", volume: "—", payment: "Pul o'tkazma", views: 19, contactName: "Holmatov U", contactPhone: "+998909998877" },
  { id: "9", from: "Farg'ona, O'zbekiston", to: "Moskva, Rossiya", fromShort: "FARG'ONA, UZ", toShort: "MOSKVA, RU", postedAt: "6 may 22:00", loadDate: "09/05/2026", cargoType: "textile", cargoEmoji: "🧵", price: "Narx kelishiladi", negotiable: true, truckType: "Tent", truckEmoji: "⛺", weight: "22.00t", volume: "—", payment: "Ikkalasi", views: 6, contactName: "Nazarov K", contactPhone: "+998901230099" },
  { id: "10", from: "Sankt-Peterburg, Rossiya", to: "Buxoro, O'zbekiston", fromShort: "SANKT-PETERBURG", toShort: "BUXORO, UZ", postedAt: "6 may 21:45", loadDate: "11/05/2026", cargoType: "электроника", cargoEmoji: "📱", price: "Narx kelishiladi", negotiable: true, truckType: "Konteyner", truckEmoji: "📦", weight: "10.00t", volume: "30 m³", payment: "Pul o'tkazma", views: 11, contactName: "Sharipov J", contactPhone: "+998931112244" },
  { id: "11", from: "Saratov, Rossiya", to: "Samarqand, O'zbekiston", fromShort: "SARATOV, RU", toShort: "SAMARQAND, UZ", postedAt: "6 may 21:30", loadDate: "10/05/2026", cargoType: "капуста", cargoEmoji: "🥬", price: "9,200,000 UZS", negotiable: false, truckType: "Muzlatgich", truckEmoji: "❄️", weight: "21.00t", volume: "—", payment: "Naqd", views: 5, contactName: "Murodov F", contactPhone: "+998935557788" },
  { id: "12", from: "Toshkent, O'zbekiston", to: "Novosibirsk, Rossiya", fromShort: "TOSHKENT, UZ", toShort: "NOVOSIBIRSK, RU", postedAt: "6 may 21:15", loadDate: "13/05/2026", cargoType: "fruits", cargoEmoji: "🍎", price: "Narx kelishiladi", negotiable: true, truckType: "Mega", truckEmoji: "🚛", weight: "24.00t", volume: "—", payment: "Naqd", views: 9, contactName: "Komilov H", contactPhone: "+998901114455" },
];
