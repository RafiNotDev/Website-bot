import fs from 'fs'
let timeout = 120000
let poin = 4999
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebaklogo = conn.tebaklogo ? conn.tebaklogo: {}
    let id = m.chat
    if (id in conn.tebaklogo) return conn.reply(m.chat, 'Masih ada tantangan yang belum selesai di chat ini. Selesaikan terlebih dahulu sebelum memulai yang baru.', conn.tebaklogo[id][0])
    let src = JSON.parse(fs.readFileSync('./Storage/Json/tebaklogo.json', 'utf-8'))
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
${json.deskripsi}

⏳ Batas waktu *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hlogo untuk bantuan
Bonus: ${poin} XP
`.trim()
    conn.tebaklogo[id] = [
        await conn.sendFile(m.chat, json.img, 'tebaklogo.jpg', caption, m),
        json, poin, 4,
        setTimeout(() => {
            if (conn.tebaklogo[id]) conn.reply(m.chat, `⌛ Waktu tantangan habis!\nJawaban yang benar: *${json.jawaban}*`, conn.tebaklogo[id][0])
            delete conn.tebaklogo[id]
        }, timeout)
    ]
}
handler.help = ['tebaklogo']
handler.tags = ['game']
handler.command = /^tebaklogo$/i
handler.group = true
handler.register = true
handler.game = true

export default handler