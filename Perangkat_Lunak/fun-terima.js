let handler = async (m, { conn, usedPrefix, command, text }) => {
    let user = global.db.data.users
    let pacar = user[m.sender].tembak
    if (user[m.sender].tembak == "") return replyt("Tidak ada yang nembak kamu kak :)", m.chat, m)
    if (user[m.sender].pacar != "") return replyt("Kamu kan sudah punya pacar kak", m.chat, m)
    if (!user[m.sender].ditembak) return replyt("Tidak ada yang nembak kamu kak :)", m.chat, m)

    user[m.sender].pacar = pacar
    user[pacar].pacar = m.sender
    user[pacar].ditembak = false
    user[m.sender].tembak = ""
    user[pacar].tembak = ""
    user[m.sender].pacaranTime = new Date() * 1
    user[pacar].pacaranTime = new Date() * 1

    await m.reply(`Kamu berhasil menerima @${pacar.split("@")[0]} menjadi pacar kamu, silahkan gunakan command *.pacar* untuk mengecek pacar kamu`, false, { mentions: [pacar] })
}
handler.help = ["terima"]
handler.tags = ["fun"]
handler.command = /^(terima)$/i
handler.daftar = true
export default handler

const delay = time => new Promise(res => setTimeout(res, time))