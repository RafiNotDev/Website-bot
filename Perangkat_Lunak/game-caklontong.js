import fs from 'fs'
let timeout = 120000
let poin = 5000
let handler = async (m, { conn, usedPrefix }) => {
    conn.caklontong = conn.caklontong ? conn.caklontong : {}
    let id = m.chat
    if (id in conn.caklontong) return conn.reply(m.chat, 'Masih ada tantangan yang belum selesai di chat ini. Selesaikan terlebih dahulu sebelum memulai yang baru.', conn.caklontong[id][0])
    let src = JSON.parse(fs.readFileSync('./Storage/Json/caklontong.json', 'utf-8'))
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
🧠 *CAK LONTONG — TANTANGAN GILA*

${json.soal}

━━━━━━━━━━━━━━━━━━
⏳ Waktu: *${timeout / 1000} detik*
🎁 *HADIAH JIKA BENAR*
💰 Money : *Rp10.000*
✨ XP : *${poin.toLocaleString('id-ID')} XP*
🎟️ Limit : *2*
━━━━━━━━━━━━━━━━━━

💡 Butuh petunjuk? Ketik *${usedPrefix}calo*
✍️ Balas pesan soal ini dengan jawabanmu.
⚠️ Kamu punya 4 kesempatan menjawab.
`.trim()
    conn.caklontong[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin, 4,
        setTimeout(async () => {
            if (conn.caklontong[id]) await conn.reply(m.chat, `⌛ Waktu tantangan habis!\nJawaban yang benar: *${json.jawaban}*\nKarena: ${json.deskripsi}`, conn.caklontong[id][0])
            delete conn.caklontong[id]
        }, timeout)
    ]
}
handler.help = ['caklontong']
handler.tags = ['game']
handler.command = /^caklontong/i
handler.group = true
handler.daftar = true
handler.game = true
export default handler