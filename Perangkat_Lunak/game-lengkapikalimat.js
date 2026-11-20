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
${json.soal}

====================
⏳ Batas waktu *${(timeout / 1000).toFixed(2)} detik*
Kalo Menang?
Dapat :
1. Money: Rp. 10.000
2. Exp   : ${poin}
3. Limit  : 2
4. Sayang Dari ${setting.namaowner}
====================
Note:
Bantuan??, Ketik .hlen
Kalau Mau Jawab Replay Soalnya!!
`.trim()
    conn.lengkapikalimat[id] = [
        await replyt(caption, m.chat, m),
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
handler.register = true
handler.game = true

export default handler