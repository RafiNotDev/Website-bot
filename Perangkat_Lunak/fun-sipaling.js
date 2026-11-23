let handler = async (m, { conn, text, groupMetadata }) => {
if (!text) throw `Contoh:
${usedPrefix + command} Alay`
let em = ['🥶','🤨','🗿','🤔','😫','🤫','🥴','🤣','😊','😍']

    let toM = a => '@' + a.split('@')[0]
    let ps = groupMetadata.participants.map(v => v.id)
    let a = ps.getRandom()
    let am = em.getRandom()
    conn.reply(m.chat, `Sii Paling *${text}* Adalah ${toM(a)} ${am}`, m, { mentions: [a] })
    
}
handler.help = ['sipaling'].map(v => v + ' <teks>')
handler.command = ['sipaling']
handler.tags = ['fun']
handler.group = true
handler.daftar = true
export default handler