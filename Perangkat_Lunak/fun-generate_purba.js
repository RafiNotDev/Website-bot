function handler(m, { text }) {
    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
    replyt(teks.replace(/[aiueo]/gi, '$&ve'), m.chat, m)
}
handler.help = ['purba <teks>']
handler.tags = ['fun']
handler.command =  /^(purba)$/i
handler.daftar = true
handler.limit = 1

export default handler