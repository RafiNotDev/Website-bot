import fs from 'fs'
let timeout = 120000
let poin = 5000
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakgambar = conn.tebakgambar ? conn.tebakgambar: {}
    let id = m.chat
    let ephemeral = conn.chats[m.chat]?.metadata?.ephemeralDuration || conn.chats[m.chat]?.ephemeralDuration || false
    let setting = global.db.data.settings[conn.user.jid]
    if (id in conn.tebakgambar) return conn.reply(m.chat, 'Masih ada tantangan yang belum selesai di chat ini. Selesaikan terlebih dahulu sebelum memulai yang baru.', conn.tebakgambar[id][0])
    let src = JSON.parse(fs.readFileSync('./Storage/Json/tebakgambar.json', 'utf-8'))
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
🧠 *TEBAK GAMBAR — TANTANGAN SANTAI*

${json.deskripsi}

━━━━━━━━━━━━━━━━━━
⏳ Waktu: *${timeout / 1000} detik*
🎁 *HADIAH JIKA BENAR*
💰 Money : *Rp10.000*
✨ XP : *${poin.toLocaleString('id-ID')} XP*
🎟️ Limit : *2*
━━━━━━━━━━━━━━━━━━

💡 Butuh petunjuk? Ketik *${usedPrefix}hgamb*
✍️ Balas pesan soal ini dengan jawabanmu.
⚠️ Kamu punya 4 kesempatan menjawab.
`.trim()
    conn.tebakgambar[id] = [
        await conn.sendMessage(m.chat, { image: { url: json.img }, fileName: 'tebakgambar.jpg', mimetype: 'image/jpeg', caption: setting.smlcap ? conn.smlcap(caption) : caption }, { quoted: m, ephemeralExpiration: ephemeral }),
        json, poin, 4,
        setTimeout(() => {
            if (conn.tebakgambar[id]) conn.reply(m.chat, `⌛ Waktu tantangan habis!\nJawaban yang benar: *${json.jawaban}*`, conn.tebakgambar[id][0])
            delete conn.tebakgambar[id]
        }, timeout)
    ]
}
handler.help = ['tebakgambar']
handler.tags = ['game']
handler.command = /^tebakgambar$/i
handler.group = true
handler.daftar = true
handler.game = true

export default handler