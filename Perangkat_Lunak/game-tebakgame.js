import fs from 'fs'
let timeout = 120000
let poin = 5000
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakgame = conn.tebakgame ? conn.tebakgame : {}
    let id = m.chat
    if (id in conn.tebakgame) return conn.reply(m.chat, 'Masih ada tantangan yang belum selesai di chat ini. Selesaikan terlebih dahulu sebelum memulai yang baru.', conn.tebakgame[id][0])
    let src = JSON.parse(fs.readFileSync('./Storage/Json/tebakgame.json', 'utf-8'))
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
🧠 *TEBAK GAME — TANTANGAN SANTAI*

Logo Game Apakah Yang Di Atas Ini

━━━━━━━━━━━━━━━━━━
⏳ Waktu: *${timeout / 1000} detik*
🎁 *HADIAH JIKA BENAR*
💰 Money : *Rp10.000*
✨ XP : *${poin.toLocaleString('id-ID')} XP*
🎟️ Limit : *2*
━━━━━━━━━━━━━━━━━━

💡 Butuh petunjuk? Ketik *${usedPrefix}hgame*
✍️ Balas pesan soal ini dengan jawabanmu.
⚠️ Kamu punya 4 kesempatan menjawab.
`.trim()
    conn.tebakgame[id] = [
        await conn.sendFile(m.chat, json.img, 'tebakgame.jpg', caption, m),
        json, poin, 4,
        setTimeout(() => {
            if (conn.tebakgame[id]) conn.reply(m.chat, `⌛ Waktu tantangan habis!\nJawaban yang benar: *${json.jawaban}*`, conn.tebakgame[id][0])
            delete conn.tebakgame[id]
        }, timeout)
    ]
}
handler.help = ['tebakgame']
handler.tags = ['game']
handler.command = /^tebakgame$/i
handler.group = true
handler.daftar = true
handler.game = true

export default handler