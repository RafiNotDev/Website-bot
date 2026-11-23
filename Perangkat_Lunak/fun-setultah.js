let handler = async (m, { conn, usedPrefix, command, text }) => {
    global.db.data.bots.ultah[m.chat] = global.db.data.bots.ultah[m.chat] || {}
    let ultah = global.db.data.bots.ultah[m.chat]
    switch (command) {
        case 'setultah':
        case 'setulta':
            if (typeof ultah[m.sender] !== "undefined") return conn.textList(m.chat, "Kamu sudah mendaftarkan tanggal lahir kamu, apakah kamu ingin menggantinya?", false, [[`${usedPrefix}deleteultah`, "Iya"], [`${usedPrefix}delete-ultah tidak`, "Tidak"]], m)
            if (!text) return replyt(`Masukan tanggal lahir kamu! \n\nContoh: \n${usedPrefix + command} 02-06-2000`, m.chat, m)
            text = text.split(/-|\//)
            if (text[0].split("").length > 2) return replyt("Tanggal yang kamu masukan tidak valid", m.chat, m)
            if (text[1].split("").length > 2) return replyt("Bulan yang kamu masukan tidak valid", m.chat, m)
            if (text[2].split("").length > 4 || text[2].split("").length < 4) return replyt("Tahun yang kamu masukan tidak valid", m.chat, m)

            if (parseInt(text[0]) > 31) return replyt("Maksimal tanggal hanya 31 Hari", m.chat, m)
            if (parseInt(text[1]) > 12) return replyt("Maksimal bulan hanya 12 Bulan", m.chat, m)
            if (parseInt(text[2]) < 1970) return replyt("Invalid tahun!", m.chat, m)
            if (parseInt(text[2]) >= (new Date().getFullYear())) return replyt("Dari masa depan lu?", m.chat, m)
            if (parseInt(text[2]) > (new Date().getFullYear()) - 8) return replyt("Invalid!", m.chat, m)
            replyt(`Done! \n_Silahkan cek dengan command *${usedPrefix}myultah*_`, m.chat, m)
            ultah[m.sender] = {
                tanggal: parseInt(text[0]),
                bulan: parseInt(text[1]),
                tahun: parseInt(text[2])
            }
            break
        case 'deleteultah':
            if (text === "tidak") return replyt("Oke!", m.chat, m)
            replyt(`Sukses menghapus tanggal lahir, silahkan masukan ulang dengan command *${usedPrefix}setultah*`, m.chat, m)
            delete ultah[m.sender]
            break
        default:
    }
}
handler.help = ["setultah","deleteultah"]
handler.tags = ["fun"]
handler.command = /^(setulta(h)?|deleteultah)$/i
export default handler