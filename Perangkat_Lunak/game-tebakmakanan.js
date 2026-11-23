import fs from 'fs'
let timeout = 120000
let poin = 5000
let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakmakanan = conn.tebakmakanan ? conn.tebakmakanan: {}
    let id = m.chat
    if (id in conn.tebakmakanan) return conn.reply(m.chat, 'Masih ada tantangan yang belum selesai di chat ini. Selesaikan terlebih dahulu sebelum memulai yang baru.', conn.tebakmakanan[id][0])
    let src = JSON.parse(fs.readFileSync('./Storage/Json/tebakmakanan.json', 'utf-8'))
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
🧠 *TEBAK MAKANAN — TANTANGAN SANTAI*

${json.deskripsi}

━━━━━━━━━━━━━━━━━━
⏳ Waktu: *${timeout / 1000} detik*
🎁 *HADIAH JIKA BENAR*
💰 Money : *Rp10.000*
✨ XP : *${poin.toLocaleString('id-ID')} XP*
🎟️ Limit : *2*
━━━━━━━━━━━━━━━━━━

💡 Butuh petunjuk? Ketik *${usedPrefix}teman*
✍️ Balas pesan soal ini dengan jawabanmu.
⚠️ Kamu punya 4 kesempatan menjawab.
`.trim()
    conn.tebakmakanan[id] = [
        await conn.sendFile(m.chat, json.img, 'tebakmakanan.jpg', caption, m),
        json, poin, 4,
        setTimeout(() => {
            if (conn.tebakmakanan[id]) conn.reply(m.chat, `⌛ Waktu tantangan habis!\nJawaban yang benar: *${json.jawaban}*`, conn.tebakmakanan[id][0])
            delete conn.tebakmakanan[id]
        }, timeout)
    ]
}
handler.help = ['tebakmakanan']
handler.tags = ['game']
handler.command = /^tebakmakanan$/i
handler.group = true
handler.daftar = true
handler.game = true

export default handler