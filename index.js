require('dotenv').config();
const { Telegraf, session, Scenes, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

// Atrof-muhit o'zgaruvchilari
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const CHANNEL_ID = process.env.CHANNEL_ID; // Kanal ID (ixtiyoriy, masalan: @mening_kanalim)

if (!BOT_TOKEN) {
    console.error("BOT_TOKEN mavjud emas! Iltimos .env faylini tekshiring.");
    process.exit(1);
}

// Botni initsializatsiya qilish
const bot = new Telegraf(BOT_TOKEN);

// Spamdan himoya tizimi (Rate Limiting)
const userLimits = new Map();
bot.use((ctx, next) => {
    if (!ctx.from) return next();
    const userId = ctx.from.id;
    const now = Date.now();
    const user = userLimits.get(userId) || { count: 0, lastMessage: now };

    if (now - user.lastMessage > 2000) {
        user.count = 1;
        user.lastMessage = now;
    } else {
        user.count++;
    }
    userLimits.set(userId, user);

    if (user.count > 4) {
        return;
    }
    return next();
});

// Ma'lumotlar bazasi bilan ishlash (PostgreSQL)
const { Pool } = require('pg');

let pool;
if (process.env.DATABASE_URL) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
}

let memoryData = { users: [], orders: 0, loads: [] };

const dataFile = path.join(__dirname, 'data.json');

async function initDB() {
    if (!pool) {
        if (fs.existsSync(dataFile)) {
            memoryData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
            if (!memoryData.loads) memoryData.loads = [];
        }
        return;
    }

    await pool.query(`
        CREATE TABLE IF NOT EXISTS app_state (
            id SERIAL PRIMARY KEY,
            data JSONB NOT NULL
        );
    `);

    const res = await pool.query('SELECT data FROM app_state WHERE id = 1');
    if (res.rows.length > 0) {
        memoryData = res.rows[0].data;
        if (!memoryData.loads) memoryData.loads = [];
    } else {
        await pool.query('INSERT INTO app_state (id, data) VALUES (1, $1)', [memoryData]);
    }
}

function readData() {
    return memoryData;
}

function writeData(data) {
    memoryData = data;
    if (pool) {
        pool.query('UPDATE app_state SET data = $1 WHERE id = 1', [memoryData]).catch(err => console.error("DB yozishda xato:", err));
    } else {
        const tmpFile = dataFile + '.tmp';
        fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2));
        fs.renameSync(tmpFile, dataFile);
    }
}

function addUser(userId) {
    const data = readData();
    if (!data.users.includes(userId)) {
        data.users.push(userId);
        writeData(data);
    }
}

function addOrder(order) {
    const data = readData();
    data.orders += 1;
    data.loads.push(order);
    writeData(data);
}

// --- Eskirgan yuklarni avtomatik o'chirish (har 24 soatda) ---
async function cleanOldLoads() {
    const data = readData();
    const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000); // 3 kun
    const oldLoads = data.loads.filter(l => parseInt(l.id) < threeDaysAgo);

    for (const load of oldLoads) {
        if (load.broadcasts) {
            for (const b of load.broadcasts) {
                try {
                    await bot.telegram.deleteMessage(b.chat_id, b.message_id);
                } catch (e) {}
            }
        }
    }

    data.loads = data.loads.filter(l => parseInt(l.id) >= threeDaysAgo);
    writeData(data);

    if (oldLoads.length > 0) {
        console.log(`${oldLoads.length} ta eskirgan yuk o'chirildi.`);
    }
}

// --- Joylashuv ma'lumotlari ---
const locationsData = {
    "O'zbekiston": [
        "Toshkent shahar", "Toshkent viloyati", "Qoraqalpog'iston",
        "Samarqand", "Andijon", "Buxoro", "Farg'ona", "Jizzax",
        "Xorazm", "Namangan", "Navoiy", "Qashqadaryo", "Surxondaryo", "Sirdaryo"
    ],
    "Rossiya": [
        "Moskva", "Sankt-Peterburg", "Moskva viloyati", "Leningrad viloyati",
        "Tatariston Respublikasi", "Boshqirdiston Respublikasi", "Krasnodar o'lkasi",
        "Rostov viloyati", "Sverdlovsk viloyati", "Novosibirsk viloyati",
        "Samara viloyati", "Chelyabinsk viloyati"
    ],
    "Qozog'iston": [
        "Astana", "Olmaota", "Olmaota viloyati", "Turkiston viloyati",
        "Chimkent shahri", "Qaraganda viloyati", "Aqtobe viloyati",
        "Atyrau viloyati", "Mangistau viloyati", "Sharqiy Qozog'iston viloyati"
    ],
    "Turkmaniston": [
        "Ashxobod", "Ahal viloyati", "Balkan viloyati",
        "Dashoguz viloyati", "Lebap viloyati", "Mary viloyati"
    ],
    "Qirg'iziston": [
        "Bishkek", "O'sh", "Chuy viloyati", "O'sh viloyati",
        "Jalolobod viloyati", "Issiqko'l viloyati", "Norin viloyati", "Talas viloyati"
    ],
    "Tojikiston": [
        "Dushanbe", "Sug'd viloyati", "Xatlon viloyati"
    ],
    "Xitoy": ["Pekin", "Shanxay", "Guanchjou", "Urumchi"]
};

function getCountryKeyboard(prefix) {
    const countries = Object.keys(locationsData);
    const buttons = [];
    for (let i = 0; i < countries.length; i += 2) {
        const row = [];
        row.push(Markup.button.callback(countries[i], `${prefix}_c_${countries[i]}`));
        if (countries[i + 1]) {
            row.push(Markup.button.callback(countries[i + 1], `${prefix}_c_${countries[i + 1]}`));
        }
        buttons.push(row);
    }
    return Markup.inlineKeyboard(buttons);
}

function getRegionKeyboard(prefix, country) {
    const regions = locationsData[country] || [];
    const buttons = [];
    for (let i = 0; i < regions.length; i += 2) {
        const row = [];
        row.push(Markup.button.callback(regions[i], `${prefix}_r_${country}_${regions[i]}`));
        if (regions[i + 1]) {
            row.push(Markup.button.callback(regions[i + 1], `${prefix}_r_${country}_${regions[i + 1]}`));
        }
        buttons.push(row);
    }
    buttons.push([Markup.button.callback("⬅️ Ortga", `${prefix}_back_country`)]);
    return Markup.inlineKeyboard(buttons);
}

// Xavfsizlik: HTML belgilarni tozalash
function escapeHTML(text) {
    if (!text) return '';
    return text.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// FIX: sana maydoni qo'shildi
function formatLoadText(order, title) {
    const phone = (order.telefon || '').startsWith('+') ? order.telefon : '+' + order.telefon;
    return `
${title}

📍 Qayerdan: ${escapeHTML(order.qayerdan)}
🏁 Qayerga: ${escapeHTML(order.qayerga)}
📅 Sana: ${escapeHTML(order.sana || 'Ko\'rsatilmagan')}
🚛 Transport turi: ${escapeHTML(order.mashina_turi)}
📦 Yuk turi: ${escapeHTML(order.yuk_turi)}
⚖️ Og'irligi va hajmi: ${escapeHTML(order.hajm_ogirlik)}
💰 Narx: ${escapeHTML(order.narx)}
💳 To'lov turi: ${escapeHTML(order.tolov_turi)}
📞 Aloqa: <a href="tel:${escapeHTML(phone)}">${escapeHTML(phone)}</a>
    `;
}

// Adminga kunlik statistika yuborish
async function sendDailyStats() {
    if (!ADMIN_CHAT_ID) return;
    const data = readData();
    const text = `
📊 <b>Kunlik Statistika</b>

👥 <b>Jami foydalanuvchilar:</b> ${data.users.length} ta
📦 <b>Jami buyurtmalar:</b> ${data.orders} ta
🟢 <b>Faol yuklar:</b> ${data.loads.length} ta
    `;
    try {
        await bot.telegram.sendMessage(ADMIN_CHAT_ID, text, { parse_mode: 'HTML' });
    } catch (e) {
        console.error("Statistika yuborishda xato:", e);
    }
}

// Kanalga post yuborish
async function postToChannel(loadText, inlineKeyboard) {
    if (!CHANNEL_ID) return null;
    try {
        const msg = await bot.telegram.sendMessage(CHANNEL_ID, loadText, {
            parse_mode: 'HTML',
            ...inlineKeyboard
        });
        return { chat_id: CHANNEL_ID, message_id: msg.message_id };
    } catch (e) {
        console.error("Kanalga yuborishda xato:", e);
        return null;
    }
}

// ----- SCENE: YUK JOYLASH -----
const orderWizard = new Scenes.WizardScene(
    'ORDER_WIZARD',

    // Qadam 0: Yuk turini so'rash
    async (ctx) => {
        ctx.wizard.state.order = {};
        await ctx.reply("1️⃣ Iltimos, yukingiz turini yozing (masalan: Qurilish mollari, Mebel):", Markup.removeKeyboard());
        return ctx.wizard.next();
    },

    // Qadam 1: Yuk turini qabul qilish
    async (ctx) => {
        if (!ctx.message || !ctx.message.text) {
            await ctx.reply("Iltimos, yozma ravishda yuk turini kiriting.");
            return;
        }
        ctx.wizard.state.order.yuk_turi = ctx.message.text;
        await ctx.reply("2️⃣ Qayerdan yuklanadi? Davlatni tanlang:", getCountryKeyboard('from'));
        return ctx.wizard.next();
    },

    // Qadam 2: Qayerdan kutish (faqat callback)
    async (ctx) => {
        if (ctx.message) {
            await ctx.reply("⚠️ Iltimos, faqat tugmalardan foydalaning!");
        }
        return;
    },

    // Qadam 3: Qayerga kutish (faqat callback)
    async (ctx) => {
        if (ctx.message) {
            await ctx.reply("⚠️ Iltimos, faqat tugmalardan foydalaning!");
        }
        return;
    },

    // Qadam 4: Hajm va og'irlik
    async (ctx) => {
        if (!ctx.message || !ctx.message.text) {
            await ctx.reply("Iltimos, yozma ravishda og'irlik va hajmni kiriting.");
            return;
        }
        ctx.wizard.state.order.hajm_ogirlik = ctx.message.text;

        const keyboard = Markup.inlineKeyboard([
            [Markup.button.callback("Fura", "car_Fura"), Markup.button.callback("Isuzu 5t", "car_Isuzu 5t")],
            [Markup.button.callback("Isuzu 10t", "car_Isuzu 10t"), Markup.button.callback("Chakman", "car_Chakman")],
            [Markup.button.callback("Fura Tent", "car_Fura Tent"), Markup.button.callback("Fura Ref", "car_Fura Ref")],
            [Markup.button.callback("Boshqa", "car_Boshqa")]
        ]);
        await ctx.reply("5️⃣ Qanday turdagi mashina kerak?", keyboard);
        return ctx.wizard.next();
    },

    // Qadam 5: Mashina turi (faqat callback)
    async (ctx) => {
        if (ctx.message) {
            await ctx.reply("⚠️ Iltimos, faqat tugmalardan foydalaning!");
        }
        return;
    },

    // Qadam 6: Sana (faqat callback)
    async (ctx) => {
        if (ctx.message) {
            await ctx.reply("⚠️ Iltimos, faqat tugmalardan foydalaning!");
        }
        return;
    },

    // Qadam 7: To'lov turi (faqat callback)
    async (ctx) => {
        if (ctx.message) {
            await ctx.reply("⚠️ Iltimos, faqat tugmalardan foydalaning!");
        }
        return;
    },

    // Qadam 8: Narx
    async (ctx) => {
        if (ctx.callbackQuery && ctx.callbackQuery.data.startsWith('price_')) {
            ctx.wizard.state.order.narx = "Kelishiladi";
            await ctx.answerCbQuery();
        } else if (ctx.message && ctx.message.text) {
            ctx.wizard.state.order.narx = ctx.message.text;
        } else {
            await ctx.reply("Iltimos faqat to'g'ri tugmani bosing yoki yozing.");
            return;
        }

        const contactKeyboard = Markup.keyboard([
            [Markup.button.contactRequest("📞 Telefon raqamni jo'natish")]
        ]).resize().oneTime();

        await ctx.reply("✅ Va nihoyat, telefon raqamingizni yuboring (faqat tugma orqali):", contactKeyboard);
        return ctx.wizard.next();
    },

    // Qadam 9: Telefon va yakunlash
    async (ctx) => {
        if (!ctx.message || !ctx.message.contact) {
            await ctx.reply("⚠️ Iltimos, pastdagi '📞 Telefon raqamni jo'natish' tugmasi orqali raqamingizni yuboring!");
            return;
        }

        ctx.wizard.state.order.telefon = ctx.message.contact.phone_number;
        ctx.wizard.state.order.buyurtmachi_id = ctx.from.id;
        ctx.wizard.state.order.id = Date.now().toString();
        ctx.wizard.state.order.broadcasts = [];

        const order = ctx.wizard.state.order;
        addOrder(order);

        const loadText = formatLoadText(order, "🔥 DIQQAT YUK !");
        const inlineKeyboard = Markup.inlineKeyboard([
            [Markup.button.url("💬 Telegram orqali yozish", `tg://user?id=${ctx.from.id}`)]
        ]);

        const data = readData();
        const promises = [];

        // Adminga yuborish
        if (ADMIN_CHAT_ID) {
            promises.push(
                bot.telegram.sendMessage(ADMIN_CHAT_ID, loadText, { parse_mode: 'HTML', ...inlineKeyboard })
                    .then(msg => ({ chat_id: ADMIN_CHAT_ID, message_id: msg.message_id }))
                    .catch(() => null)
            );
        }

        // Kanalga yuborish
        promises.push(postToChannel(loadText, inlineKeyboard));

        // Barcha foydalanuvchilarga yuborish + bildirishnoma
        for (const userId of data.users) {
            if (userId !== ctx.from.id) {
                promises.push(
                    bot.telegram.sendMessage(userId, loadText, { parse_mode: 'HTML', ...inlineKeyboard })
                        .then(msg => ({ chat_id: userId, message_id: msg.message_id }))
                        .catch(() => null)
                );
            }
        }

        Promise.all(promises).then(results => {
            const validBroadcasts = results.filter(r => r !== null);
            if (validBroadcasts.length > 0) {
                const currentData = readData();
                const targetOrder = currentData.loads.find(l => l.id === order.id);
                if (targetOrder) {
                    if (!targetOrder.broadcasts) targetOrder.broadcasts = [];
                    targetOrder.broadcasts.push(...validBroadcasts);
                    writeData(currentData);
                }
            }
        });

        await ctx.reply("✅ Buyurtmangiz qabul qilindi va barcha haydovchilarga yuborildi. Tez orada siz bilan bog'lanishadi!", Markup.removeKeyboard());

        const menuKeyboard = Markup.keyboard([
            ['📦 Yuk joylash', '🔍 Yuk topish'],
['❌ Yukni bekor qilish', '📱 Mini App']
        ]).resize();
        await ctx.reply("Yana yuk joylash uchun pastdagi tugmani bosing.", menuKeyboard);

        return ctx.scene.leave();
    }
);

// FROM joylashuv navigatsiyasi
orderWizard.action(/from_c_(.+)/, async (ctx) => {
    const country = ctx.match[1];
    await ctx.editMessageText(`Siz tanladingiz: ${country}\nEndi viloyatni tanlang:`, getRegionKeyboard('from', country));
});
orderWizard.action(/from_back_country/, async (ctx) => {
    await ctx.editMessageText("Qayerdan yuklanadi? Davlatni tanlang:", getCountryKeyboard('from'));
});
orderWizard.action(/from_r_(.+)_(.+)/, async (ctx) => {
    if (ctx.wizard.cursor !== 2) return;
    const country = ctx.match[1];
    const region = ctx.match[2];
    ctx.wizard.state.order.qayerdan = `${country}, ${region}`;
    await ctx.editMessageText(`✅ Saqlandi: ${ctx.wizard.state.order.qayerdan}`);
    await ctx.reply("3️⃣ Qayerga yetkazilishi kerak? Davlatni tanlang:", getCountryKeyboard('to'));
    ctx.wizard.next();
});

// TO joylashuv navigatsiyasi
orderWizard.action(/to_c_(.+)/, async (ctx) => {
    const country = ctx.match[1];
    await ctx.editMessageText(`Siz tanladingiz: ${country}\nEndi viloyatni tanlang:`, getRegionKeyboard('to', country));
});
orderWizard.action(/to_back_country/, async (ctx) => {
    await ctx.editMessageText("Qayerga yetkazilishi kerak? Davlatni tanlang:", getCountryKeyboard('to'));
});
orderWizard.action(/to_r_(.+)_(.+)/, async (ctx) => {
    if (ctx.wizard.cursor !== 3) return;
    const country = ctx.match[1];
    const region = ctx.match[2];
    ctx.wizard.state.order.qayerga = `${country}, ${region}`;
    await ctx.editMessageText(`✅ Saqlandi: ${ctx.wizard.state.order.qayerga}`);
    await ctx.reply("4️⃣ Yukning taxminiy og'irligi va hajmini yozing (masalan: 20 tonna, 80 kub):");
    ctx.wizard.next();
});

// Mashina turi tanlovi
orderWizard.action(/car_(.+)/, async (ctx) => {
    if (ctx.wizard.cursor !== 5) return;
    ctx.wizard.state.order.mashina_turi = ctx.match[1];
    await ctx.editMessageText(`✅ Mashina turi tanlandi: ${ctx.match[1]}`);

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback("Bugun", "date_Bugun"), Markup.button.callback("Ertaga", "date_Ertaga")],
        [Markup.button.callback("Indinga", "date_Indinga"), Markup.button.callback("Yuklashga tayyor", "date_Tayyor")]
    ]);
    await ctx.reply("6️⃣ Yuklanish sanasini tanlang:", keyboard);
    ctx.wizard.next();
});

// Sana tanlovi
orderWizard.action(/date_(.+)/, async (ctx) => {
    if (ctx.wizard.cursor !== 6) return;
    ctx.wizard.state.order.sana = ctx.match[1];
    await ctx.editMessageText(`✅ Sana tanlandi: ${ctx.match[1]}`);

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback("Naqd", "pay_Naqd"), Markup.button.callback("Kartaga", "pay_Kartaga")]
    ]);
    await ctx.reply("7️⃣ To'lov turini tanlang:", keyboard);
    ctx.wizard.next();
});

// To'lov turi tanlovi
orderWizard.action(/pay_(.+)/, async (ctx) => {
    if (ctx.wizard.cursor !== 7) return;
    ctx.wizard.state.order.tolov_turi = ctx.match[1];
    await ctx.editMessageText(`✅ To'lov turi tanlandi: ${ctx.match[1]}`);

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback("Narx kelishiladi", "price_Kelishiladi")]
    ]);
    await ctx.reply("8️⃣ Necha pul berishini yozing yoki tugmani bosing:", keyboard);
    ctx.wizard.next();
});

// ----- SCENE: YUK QIDIRISH -----
const searchWizard = new Scenes.WizardScene(
    'SEARCH_WIZARD',
    async (ctx) => {
        ctx.wizard.state.search = {};
        await ctx.reply("1️⃣ Qayerdan yuk olib ketmoqchisiz? Davlatni tanlang:", getCountryKeyboard('sfrom'));
        return ctx.wizard.next();
    },
    async (ctx) => {
        if (ctx.message) await ctx.reply("⚠️ Iltimos, faqat tugmalardan foydalaning!");
        return;
    },
    async (ctx) => {
        if (ctx.message) await ctx.reply("⚠️ Iltimos, faqat tugmalardan foydalaning!");
        return;
    }
);

searchWizard.action(/sfrom_c_(.+)/, async (ctx) => {
    const country = ctx.match[1];
    await ctx.editMessageText(`Siz tanladingiz: ${country}\nEndi viloyatni tanlang:`, getRegionKeyboard('sfrom', country));
});
searchWizard.action(/sfrom_back_country/, async (ctx) => {
    await ctx.editMessageText("Qayerdan yuk olib ketmoqchisiz? Davlatni tanlang:", getCountryKeyboard('sfrom'));
});
searchWizard.action(/sfrom_r_(.+)_(.+)/, async (ctx) => {
    if (ctx.wizard.cursor !== 1) return;
    const country = ctx.match[1];
    const region = ctx.match[2];
    ctx.wizard.state.search.qayerdan = `${country}, ${region}`;
    await ctx.editMessageText(`✅ Saqlandi: ${ctx.wizard.state.search.qayerdan}`);
    await ctx.reply("2️⃣ Qayerga bormoqchisiz? Davlatni tanlang:", getCountryKeyboard('sto'));
    ctx.wizard.next();
});

searchWizard.action(/sto_c_(.+)/, async (ctx) => {
    const country = ctx.match[1];
    await ctx.editMessageText(`Siz tanladingiz: ${country}\nEndi viloyatni tanlang:`, getRegionKeyboard('sto', country));
});
searchWizard.action(/sto_back_country/, async (ctx) => {
    await ctx.editMessageText("Qayerga bormoqchisiz? Davlatni tanlang:", getCountryKeyboard('sto'));
});
searchWizard.action(/sto_r_(.+)_(.+)/, async (ctx) => {
    if (ctx.wizard.cursor !== 2) return;
    const country = ctx.match[1];
    const region = ctx.match[2];
    ctx.wizard.state.search.qayerga = `${country}, ${region}`;
    await ctx.editMessageText(`✅ Saqlandi: ${ctx.wizard.state.search.qayerga}`);

    const { qayerdan, qayerga } = ctx.wizard.state.search;
    const data = readData();
    const loads = data.loads || [];

    const matchingLoads = loads.filter(l => l.qayerdan === qayerdan && l.qayerga === qayerga);
    const resultsToTrack = [];

    if (matchingLoads.length > 0) {
        // FIX: nechta topilganini aniq ko'rsatish
        await ctx.reply(`✅ ${qayerdan} → ${qayerga} yo'nalishida ${matchingLoads.length} ta yuk topildi (oxirgi 5 tasi ko'rsatilmoqda):`);
        for (const l of matchingLoads.slice(-5)) {
            const text = formatLoadText(l, "🟢 FAOL YUK");
            const kb = Markup.inlineKeyboard([[Markup.button.url("💬 Telegram orqali yozish", `tg://user?id=${l.buyurtmachi_id}`)]]);
            const msg = await ctx.reply(text, { parse_mode: 'HTML', ...kb });
            resultsToTrack.push({ loadId: l.id, chatId: ctx.from.id, msgId: msg.message_id });
        }
    } else {
        // FIX: aniq yo'nalish ko'rsatildi
        await ctx.reply(`❌ ${qayerdan} → ${qayerga} yo'nalishida hozircha yuk yo'q.\n\n📋 Boshqa yo'nalishlardagi so'nggi yuklar:`);
        const recentLoads = loads.slice(-5);
        if (recentLoads.length === 0) {
            await ctx.reply("Hozircha tizimda hech qanday yuk yo'q.");
        } else {
            for (const l of recentLoads) {
                const text = formatLoadText(l, "🟢 FAOL YUK");
                const kb = Markup.inlineKeyboard([[Markup.button.url("💬 Telegram orqali yozish", `tg://user?id=${l.buyurtmachi_id}`)]]);
                const msg = await ctx.reply(text, { parse_mode: 'HTML', ...kb });
                resultsToTrack.push({ loadId: l.id, chatId: ctx.from.id, msgId: msg.message_id });
            }
        }
    }

    if (resultsToTrack.length > 0) {
        const currentData = readData();
        for (const res of resultsToTrack) {
            const targetOrder = currentData.loads.find(l => l.id === res.loadId);
            if (targetOrder) {
                if (!targetOrder.broadcasts) targetOrder.broadcasts = [];
                targetOrder.broadcasts.push({ chat_id: res.chatId, message_id: res.msgId });
            }
        }
        writeData(currentData);
    }

    const menuKeyboard = Markup.keyboard([
        ['📦 Yuk joylash', '🔍 Yuk topish'],
        ['❌ Yukni bekor qilish''📱 Mini App']
    ]).resize();
    await ctx.reply("Bosh menyu:", menuKeyboard);
    return ctx.scene.leave();
});
const MINI_APP_URL = process.env.MINI_APP_URL || '';
// FIX: session va stage OLDIN, bot.start KEYIN
const stage = new Scenes.Stage([orderWizard, searchWizard]);
bot.use(session());
bot.use(stage.middleware());

// /start komandasi
bot.start((ctx) => {
    ctx.session = {};
    addUser(ctx.from.id);
    const userName = ctx.from.first_name || 'Foydalanuvchi';
    const menuKeyboard = Markup.keyboard([
        ['📦 Yuk joylash', '🔍 Yuk topish'],
        ['❌ Yukni bekor qilish''📱 Mini App']
    ]).resize();
    ctx.reply(`Salom, ${userName}! Logistika botimizga xush kelibsiz.\nQuyidagi menyudan kerakli bo'limni tanlang:`, menuKeyboard);
});

// /statistika komandasi (faqat admin)
bot.command('statistika', (ctx) => {
    if (ctx.from.id.toString() !== ADMIN_CHAT_ID) {
        return ctx.reply("⛔ Kechirasiz, siz admin emassiz.");
    }
    const data = readData();
    const text = `
📊 <b>Bot Statistikasi</b>

👥 <b>Jami foydalanuvchilar:</b> ${data.users.length} ta
📦 <b>Jami buyurtmalar:</b> ${data.orders} ta
🟢 <b>Faol yuklar:</b> ${data.loads.length} ta
    `;
    ctx.reply(text, { parse_mode: 'HTML' });
});

// Yuk joylash
bot.hears('📦 Yuk joylash', (ctx) => {
    ctx.scene.enter('ORDER_WIZARD');
});

// Yuk topish
bot.hears('🔍 Yuk topish', (ctx) => {
    ctx.scene.enter('SEARCH_WIZARD');
});

// Yukni bekor qilish
bot.hears('❌ Yukni bekor qilish', async (ctx) => {
    const data = readData();
    const myLoads = data.loads.filter(l => l.buyurtmachi_id === ctx.from.id);
    if (myLoads.length === 0) {
        return ctx.reply("Sizda hozircha faol yuklar yo'q.");
    }
    await ctx.reply("Sizning faol yuklaringiz. O'chirish uchun '❌ Tugatish' ni bosing:");
    for (const load of myLoads) {
        const text = formatLoadText(load, "🟢 FAOL YUK");
        const keyboard = Markup.inlineKeyboard([
            [Markup.button.callback("❌ Tugatish", `cancel_load_${load.id}`)]
        ]);
        await ctx.reply(text, { parse_mode: 'HTML', ...keyboard });
    }
});

bot.action(/cancel_load_(.+)/, async (ctx) => {
    const loadId = ctx.match[1];
    const data = readData();
    const loadIndex = data.loads.findIndex(l => l.id === loadId);

    if (loadIndex === -1) {
        return ctx.answerCbQuery("Bu yuk allaqachon bekor qilingan yoki topilmadi.", { show_alert: true });
    }

    const load = data.loads[loadIndex];
    if (load.buyurtmachi_id !== ctx.from.id) {
        return ctx.answerCbQuery("Siz bu yukni bekor qila olmaysiz!", { show_alert: true });
    }

    if (load.broadcasts) {
        for (const b of load.broadcasts) {
            try {
                await bot.telegram.deleteMessage(b.chat_id, b.message_id);
            } catch (e) {}
        }
    }

    data.loads.splice(loadIndex, 1);
    writeData(data);

    await ctx.editMessageText("✅ Bu yuk muvaffaqiyatli bekor qilindi va barcha chatlardan o'chirildi.");
    ctx.answerCbQuery("Yuk o'chirildi.");
});

// Global xatoliklarni ushlash
bot.catch((err, ctx) => {
    console.error(`Xatolik yuz berdi ${ctx.updateType}`, err);
});

// Botni ishga tushirish
initDB().then(() => {
    bot.launch().then(async () => {
        console.log("Bot muvaffaqiyatli ishga tushdi!");

        // Har 24 soatda eskirgan yuklarni o'chirish va statistika yuborish
        setInterval(async () => {
            await cleanOldLoads();
            await sendDailyStats();
        }, 24 * 60 * 60 * 1000);

        try {
            await bot.telegram.setMyCommands([
                { command: 'start', description: 'Botni ishga tushirish' }
            ]);

            if (ADMIN_CHAT_ID) {
                await bot.telegram.setMyCommands([
                    { command: 'start', description: 'Botni ishga tushirish' },
                    { command: 'statistika', description: 'Bot statistikasi' }
                ], { scope: { type: 'chat', chat_id: parseInt(ADMIN_CHAT_ID) } });
            }
        } catch (err) {
            console.error("Komandalarni o'rnatishda xatolik:", err);
        }
    });
});

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
// Express server — Mini App uchun
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'miniapp.html'));
});
app.listen(PORT, () => {
    console.log(`Mini App server: http://localhost:${PORT}`);
});
bot.hears('📱 Mini App', (ctx) => {
    if (!MINI_APP_URL) return ctx.reply("Mini App sozlanmagan.");
    ctx.reply('🚛 Yukla.uz:', Markup.inlineKeyboard([
        [Markup.button.webApp('📱 Ochish', MINI_APP_URL)]
    ]));
});
