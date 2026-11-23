import fs from 'fs'
let timeout = 180000
let poin = 4999
let handler = async (m, { conn, usedPrefix }) => {
    conn.susunkata = conn.susunkata ? conn.susunkata: {}
    let id = m.chat
    if (!(id in conn.susunkata)) {
        let src = JSON.parse(fs.readFileSync('./Storage/Json/susunkata.json', 'utf-8'))
        let json = src[Math.floor(Math.random() * src.length)]
        let caption = `
🧠 *SUSUN KATA — TANTANGAN SANTAI*

${json.soal}

━━━━━━━━━━━━━━━━━━
⏳ Waktu: *${timeout / 1000} detik*
🎁 *HADIAH JIKA BENAR*
💰 Money : *Rp10.000*
✨ XP : *${poin.toLocaleString('id-ID')} XP*
🎟️ Limit : *2*
━━━━━━━━━━━━━━━━━━

💡 Butuh petunjuk? Ketik *${usedPrefix}suska*
✍️ Balas pesan soal ini dengan jawabanmu.
⚠️ Kamu punya 4 kesempatan menjawab.
`.trim()
        conn.susunkata[id] = [
            await conn.reply(m.chat, caption, m),
            json, poin, 4,
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
handler.daftar = true
handler.game = true

export default handler