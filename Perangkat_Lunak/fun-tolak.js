let handler = async (m, { conn, usedPrefix, command, text }) => {
    let user = global.db.data.users
    let pacar = user[m.sender].tembak
    if (user[m.sender].tembak == "") return replyt("Tidak ada yang nembak kamu kak :)", m.chat, m)
    if (user[m.sender].tembak == m.sender) return replyt(`Hanya @${user[m.sender].tembak} yang bisa menjawab`, m.chat, m)
    if (!user[m.sender].ditembak) return replyt("Permintaan tidak valid", m.chat, m)

    user[m.sender].tembak = ""
    user[m.sender].ditembak = false
    user[pacar].tembak = ""
    user[pacar].ditembak = false

    await m.reply(`Kamu telah menolak @${pacar.split("@")[0]}`, false, { mentions: [pacar] })
}
handler.help = ["tolak"]
handler.tags = ["fun"]
handler.command = /^(tolak)$/i
export default handler

const delay = time => new Promise(res => setTimeout(res, time))