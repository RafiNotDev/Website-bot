import fs from 'fs'
let timeout = 180000
let money = 5000
let limit = 1
let handler = async (m, { conn, usedPrefix }) => {
    conn.susunkata = conn.susunkata ? conn.susunkata: {}
    let id = m.chat
    if (!(id in conn.susunkata)) {
        let src = JSON.parse(fs.readFileSync('./Storage/Json/susunkata.json', 'utf-8'))
        let json = src[Math.floor(Math.random() * src.length)]
        let caption = `
${json.soal}

📮 Tipe : ${json.tipe}
⏳ ⏳ Batas waktu *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik ${usedPrefix}suska untuk bantuan
➕ Bonus: ${money} Money
🎟️ Limit: ${limit} Limit
`.trim()
        conn.susunkata[id] = [
            await conn.reply(m.chat, caption, m),
            json, money, 4,
            setTimeout(() => {
                if (conn.susunkata[id]) conn.reply(m.chat, `⌛ Waktu tantangan habis!\n📑Jawaban yang benar: *${json.jawaban}*`, conn.susunkata[id][0])
                delete conn.susunkata[id]
            }, timeout)
        ]
    } else conn.reply(m.chat, '*ᴍᴀꜱɪʜ ᴀᴅᴀ ꜱᴏᴀʟ ʙᴇʟᴜᴍ ᴛᴇʀᴊᴀᴡᴀʙ ᴅɪ ᴄʜᴀᴛ ɪɴɪ!!* ', conn.susunkata[id][0])

}
handler.help = ['susunkata']
handler.tags = ['game']
handler.command = /^(susunkata|sskata)$/i
handler.group = true
handler.register = true
handler.game = true

export default handler