let handler = async (m, { conn, text }) => {
  if (text) {
    global.db.data.chats[m.chat].sBye = text
    replyt('Bye berhasil diatur\n@user (Mention)', m.chat, m)
  } else throw 'Teksnya mana?'
}
handler.help = ['setbye <teks>']
handler.tags = ['group']
handler.command = /^setbye$/i
handler.group = true
handler.admin = true

export default handler