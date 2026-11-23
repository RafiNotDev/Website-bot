let handler = async (m, { conn, text }) => {
  if (!text) throw 'Tidak ada teks'
  let teks = await mention(text)
  let pesan = 
  conn.reply(m.chat, `@${teks.split("@")[0]}`, m, { mentions: [teks] })
}
handler.help = ['mention <teks>']
handler.tags = ['tools', 'premium']

handler.command = /^mention$/i
handler.group = true
handler.daftar = true
handler.premium = true
export default handler 
