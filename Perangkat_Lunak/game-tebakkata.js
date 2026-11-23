import fs from 'fs'
let timeout = 120000
let poin = 5000
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakkata = conn.tebakkata ? conn.tebakkata : {}
    let id = m.chat
    if (id in conn.tebakkata) return conn.reply(m.chat, 'Masih ada tantangan yang belum selesai di chat ini. Selesaikan terlebih dahulu sebelum memulai yang baru.', conn.tebakkata[id][0])
    let src = JSON.parse(fs.readFileSync('./Storage/Json/tebakkata.json', 'utf-8'))
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
🧠 *TEBAK KATA — TANTANGAN SANTAI*

${json.soal}

━━━━━━━━━━━━━━━━━━
⏳ Waktu: *${timeout / 1000} detik*
🎁 *HADIAH JIKA BENAR*
💰 Money : *Rp10.000*
✨ XP : *${poin.toLocaleString('id-ID')} XP*
🎟️ Limit : *2*
━━━━━━━━━━━━━━━━━━

💡 Butuh petunjuk? Ketik *${usedPrefix}teka*
✍️ Balas pesan soal ini dengan jawabanmu.
⚠️ Kamu punya 4 kesempatan menjawab.
`.trim()
    conn.tebakkata[id] = [
        await await conn.reply(m.chat, caption, m),
        json, poin, 4,
        setTimeout(() => {
            if (conn.tebakkata[id]) conn.reply(m.chat, `⌛ Waktu tantangan habis!\nJawaban yang benar: *${json.jawaban}*`, conn.tebakkata[id][0])
            delete conn.tebakkata[id]
        }, timeout)
    ]
}
handler.help = ['tebakkata']
handler.tags = ['game']
handler.command = /^tebakkata$/i
handler.group = true
handler.daftar = true
handler.game = true

export default handler