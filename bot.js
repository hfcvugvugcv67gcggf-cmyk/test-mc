const mineflayer = require('mineflayer');

const botNames = [
    "NomadKazakh", "BozingirBot", "QaraqalpaqBek", "JailauRunner", "TuranGuard"
];

const config = {
    host: "202.181.188.46",
    port: 25993,
    version: "1.21.4",
    password: "qwertyba"
};

console.log("==========================================");
console.log("🚀 ТЕСТ БАСТАЛДЫ 🚀");
console.log("==========================================\n");

botNames.forEach((name, index) => {
    setTimeout(() => createBot(name), index * 10000);
});

function createBot(name) {
    console.log(`[⏳] ${name} қосылуда...`);

    let registered = false;
    let loggedIn = false;

    const bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: name,
        version: config.version,
        auth: "offline",
        keepAlive: true,
        viewDistance: "tiny"
    });

    bot.on("login", () => {
        console.log(`[✅] ${name} серверге кірді.`);
    });

    bot.on("message", (jsonMsg) => {
        const msg = jsonMsg.toString().toLowerCase();
        console.log(`[💬] ${name}: ${jsonMsg.toString()}`);

        if (msg.includes("антибот") || msg.includes("antibot")) {
            console.log(`[🛡️] ${name}: AntiBot іске қосылды! Күту керек.`);
            return;
        }

        // ✅ ТҮЗЕТУ 1: else if — екі команда бір мезгілде іске қосылмасын
        if ((msg.includes("тіркел") || msg.includes("/register")) && !registered) {
            registered = true;
            setTimeout(() => {
                // ✅ ТҮЗЕТУ 4: бот ажыратылған болса crash болмасын
                try {
                    bot.chat(`/register ${config.password} ${config.password}`);
                    console.log(`[📝] ${name} /register жіберді`);
                } catch (e) {
                    console.log(`[⚠️] ${name} /register жіберілмеді: бот ажыратылды`);
                }
            }, 2000);
        } else if ((msg.includes("жүйеге") || msg.includes("/login")) && !loggedIn) {
            loggedIn = true;
            setTimeout(() => {
                // ✅ ТҮЗЕТУ 4: бот ажыратылған болса crash болмасын
                try {
                    bot.chat(`/login ${config.password}`);
                    console.log(`[🔑] ${name} /login жіберді`);
                } catch (e) {
                    console.log(`[⚠️] ${name} /login жіберілмеді: бот ажыратылды`);
                }
            }, 2000);
        }
    });

    bot.on("spawn", () => {
        console.log(`[🌍] ${name} spawn болды!`);
    });

    bot.on("end", (reason) => {
        // ✅ ТҮЗЕТУ 5: reason undefined болуы мүмкін
        console.log(`[-] ${name} ажыратылды: ${reason || "белгісіз себеп"}`);
        // ✅ ТҮЗЕТУ 6: memory leak болмасын
        bot.removeAllListeners();
        setTimeout(() => createBot(name), 30000);
    });

    bot.on("error", (err) => {
        // ✅ ТҮЗЕТУ 2: err.message undefined болуы мүмкін
        const errMsg = (err && err.message) ? err.message : String(err);
        console.log(`[❌] ${name} қате: ${errMsg}`);
    });
}
