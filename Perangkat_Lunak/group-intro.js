import fetch from 'node-fetch'
let handler = async(m, { conn, text, usedPrefix, command }) => {

let card = db.data.chats[m.chat].sWelcome
if(card === "") return replyt('Maaf Kayaknya Kartu Intronya Belum Di Setting Deh', m.chat, m)
let who = m.mentioned ? m.mentionedJid[0] : m.quoted.sender

  const selectedMessage = card.replace(/@user/g, `@${who.split('@')[0]}`)

  conn.reply(m.chat, selectedMessage, m, { mentions: [who] })
}
handler.help = ['intro']
handler.tags = ['group']
handler.command = /^(intro)$/i
handler.group = true
export default handler