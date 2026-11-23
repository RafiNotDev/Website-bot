let handler = async(m, { conn, text }) => {

  global.prefix = new RegExp('^[' + (opts['prefix'] || text).replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
    await replyt(`Prefix berhasil direset ke ${text}`, m.chat, m)

}
handler.help = ['resetprefix']
handler.tags = ['rowner']
handler.command = /^(resetprefix)$/i
handler.rowner = true

export default handler