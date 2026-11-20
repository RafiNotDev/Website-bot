import fs from 'fs'
let timeout = 120000
let poin = 4999
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebaktebakan = conn.tebaktebakan ? conn.tebaktebakan: {}
    let id = m.chat
    if (id in conn.tebaktebakan) return conn.reply(m.chat, 'Masih ada tantangan yang belum selesai di chat ini. Selesaikan terlebih dahulu sebelum memulai yang baru.', conn.tebaktebakan[id][0])
    let src = JSON.parse(fs.readFileSync('./Storage/Json/tebaktebakan.json', 'utf-8'))
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
${json.soal}

⏳ Batas waktu *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hkan untuk bantuan
Bonus: ${poin} XP
`.trim()
    conn.tebaktebakan[id] = [
        await replyt(caption, m.chat, m),
        json, poin, 4,
        setTimeout(() => {
            if (conn.tebaktebakan[id]) conn.reply(m.chat, `⌛ Waktu tantangan habis!\nJawaban yang benar: *${json.jawaban}*`, conn.tebaktebakan[id][0])
            delete conn.tebaktebakan[id]
        }, timeout)
    ]
}
handler.help = ['tebaktebakan']
handler.tags = ['game']
handler.command = /^tebaktebakan$/i
handler.group = true
handler.register = true
handler.game = true

export default handler