import fs from 'fs'
let timeout = 120000
let poin = 5000
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.lengkapikalimat = conn.lengkapikalimat ? conn.lengkapikalimat: {}
    let id = m.chat
    if (id in conn.lengkapikalimat) return conn.reply(m.chat, 'Masih ada tantangan yang belum selesai di chat ini. Selesaikan terlebih dahulu sebelum memulai yang baru.', conn.lengkapikalimat[id][0])
    let src = JSON.parse(fs.readFileSync('./Storage/Json/lengkapikalimat.json', 'utf-8'))
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
🧠 *LENGAKAPI KALIMAT — HAYOO DI TEBAK*

${json.soal}

━━━━━━━━━━━━━━━━━━
⏳ Waktu: *${timeout / 1000} detik*
🎁 *HADIAH JIKA BENAR*
💰 Money : *Rp10.000*
✨ XP : *${poin.toLocaleString('id-ID')} XP*
🎟️ Limit : *2*
━━━━━━━━━━━━━━━━━━

💡 Butuh petunjuk? Ketik *${usedPrefix}hlen*
✍️ Balas pesan soal ini dengan jawabanmu.
⚠️ Kamu punya 4 kesempatan menjawab.
`.trim()
    conn.lengkapikalimat[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin, 4,
        setTimeout(() => {
            if (conn.lengkapikalimat[id]) conn.reply(m.chat, `⌛ Waktu tantangan habis!\nJawaban yang benar: *${json.jawaban}*`, conn.lengkapikalimat[id][0])
            delete conn.lengkapikalimat[id]
        }, timeout)
    ]
}
handler.help = ['lengkapikalimat']
handler.tags = ['game']
handler.command = /^lengkapikalimat$/i
handler.group = true
handler.daftar = true
handler.game = true

export default handler