import fs from 'fs'
let timeout = 120000
let poin = 4999
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebaklagu = conn.tebaklagu ? conn.tebaklagu : {}
    let id = m.chat
    if (id in conn.tebaklagu) return conn.reply(m.chat, 'Masih ada tantangan yang belum selesai di chat ini. Selesaikan terlebih dahulu sebelum memulai yang baru.', conn.tebaklagu[id][0])
    let src = JSON.parse(fs.readFileSync('./Storage/Json/tebaklagu.json', 'utf-8'))
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
🧠 *TEBAK LAGU — TANTANGAN AUDIO*

${json.artis}

━━━━━━━━━━━━━━━━━━
⏳ Waktu: *${timeout / 1000} detik*
🎁 *HADIAH JIKA BENAR*
💰 Money : *Rp10.000*
✨ XP : *${poin.toLocaleString('id-ID')} XP*
🎟️ Limit : *2*
━━━━━━━━━━━━━━━━━━

💡 Butuh petunjuk? Ketik *${usedPrefix}hlagu*
✍️ Balas pesan soal ini dengan jawabanmu.
⚠️ Kamu punya 4 kesempatan menjawab.
`.trim()
    conn.tebaklagu[id] = [
        await conn.sendFile(m.chat, json.lagu, 'tebaklagu.mp3', caption, m),
        json, poin, 4,
        setTimeout(() => {
            if (conn.tebaklagu[id]) conn.reply(m.chat, `⌛ Waktu tantangan habis!\nJawaban yang benar: *${json.judul}*`, conn.tebaklagu[id][0])
            delete conn.tebaklagu[id]
        }, timeout)
    ]
    await conn.sendFile(m.chat, json.lagu, 'tebaklagu.mp3', '', conn.tebaklagu[id][0])
}
handler.help = ['tebaklagu']
handler.tags = ['game']
handler.command = /^tebaklagu$/i
handler.group = true
handler.daftar = true
handler.game = true

export default handler