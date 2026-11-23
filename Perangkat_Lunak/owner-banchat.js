let handler = async (m, { conn, text, participants }) => {
    // if (participants.map(v=>v.jid).includes(global.conn.user.jid)) {
    if (m.isBaileys) return
    global.db.data.chats[m.chat].isBanned = true
    replyt('[❗] *Perintah Di Terima..*\nGroup Ini Tidak Bisa Lagi pakai Bot', m.chat, m)
    // } else replyt('Ada nomor host disini...', m.chat, m)
}
handler.help = ['banchat']
handler.tags = ['owner']
handler.command = /^(banchat|bnc)$/i
handler.owner = true

export default handler