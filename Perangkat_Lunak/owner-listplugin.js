import fs from "fs";
import path from "path";

let handler = async (m, { isOwner, __dirname }) => {
    try {
        if (!isOwner) {
            return replyt("❌ Anda tidak memiliki izin untuk menggunakan perintah ini.", m.chat, m);
        }

        let files = fs.readdirSync(__dirname).filter(file => file.endsWith(".js"));

        if (files.length === 0) {
            return replyt("📂 Tidak ada file Tools yang tersedia di folder *Package*.", m.chat, m);
        }

        let listPackage = files.map((file, index) => `${index + 1}. 📌 *${file}*`).join("\n");
        return replyt(`🔍 *Daftar Package yang Tersedia:*\n\n${listPackage}`, m.chat, m);
    } catch (err) {
        console.error("Error saat membaca daftar Package:", err);
        return replyt("❌ Terjadi kesalahan saat membaca daftar Package.", m.chat, m);
    }
};

handler.help = ["listpackage"].map(cmd => `${cmd} *Menampilkan daftar Package yang tersedia*`);
handler.tags = ["developer"];
handler.command = ["listpackage", "listpackage", "listpckg"];
handler.developer = true
export default handler;