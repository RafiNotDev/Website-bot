import fs from 'fs'
let handler = async (m, { conn, text }) => {
   if (m.isBaileys) return
    replyt('Tunggu Sebentar, Sedang mengambil file Database', m.chat, m)
    let sesi = await fs.readFileSync('./Cache/DataBot.json')
    return await conn.sendMessage(m.chat, { document: sesi, mimetype: 'application/json', fileName: 'rafibotdata.json' }, { quoted: m })
}
handler.help = ['getdb']
handler.tags = ['owner']
handler.command = /^(getdb)$/i

handler.owner = true

export default handler