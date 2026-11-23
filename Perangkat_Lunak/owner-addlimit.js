let handler = async (m, { conn, command, text, args }) => {
    if (!m.isGroup) return
    let sender = m.mentionedJid ? m.mentionedJid[0] : m.quoted.sender
    if (!sender) return replyt('reply pesan member atau tag member yang bakal di tambahin limitnya', m.chat, m)
    let ulimit = isNumber(text)
    if (!ulimit) return replyt("Mau Berapa Limit Ngab dan Harus Berupa Angka", m.chat, m)
    let users = global.db.data.users
    users[sender].limit += ulimit
    replyt(`Sukses Menambah Limit @${sender.split('@')[0]} Sebesar ${ulimit} Limit`, m.chat, m)
}
handler.help = ['addlimit']
handler.tags = ['owner']
handler.command = /^addlimit(user)?$/i
handler.owner = true

export default handler

function isNumber(x = 0) {
  x = parseInt(x)
  return !isNaN(x) && typeof x == 'number'
}