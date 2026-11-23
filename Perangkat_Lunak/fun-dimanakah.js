let handler = async (m, { conn, command, text }) => {
  conn.reply(m.chat, `
*Pertanyaan:* ${command} ${text}
*Jawaban:* ${pickRandom(['di neraka','di surga','di mars','di tengah laut','di dada :v','di hatimu >///<'])}
`.trim(), m, m.mentionedJid ? {
    contextInfo: {
      mentionedJid: m.mentionedJid
    }
  } : {})
}
handler.help = ['dimanakah <pertanyaan>']
handler.tags = ['fun']
handler.command = /^dimanakah$/i
handler.daftar = true
handler.limit = 2
export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
