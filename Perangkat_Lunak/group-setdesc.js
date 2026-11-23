let handler = async (m, { text }) => {

if(!text) throw 'Isi?'
  
 await conn.groupUpdateDescription(m.chat, text)
  return replyt("Done.", m.chat, m)
}

handler.help = ['setdesc <teks>']
handler.tags = ['group']
handler.command = /^(setdesc|sdesc)$/i

handler.group = true
handler.admin = true

export default handler
