let handler = async (m) => {
    global.db.data.chats[m.chat].isBanned = false
    replyt('Done!', m.chat, m)
}
handler.help = ['unbanchat']
handler.tags = ['owner']
handler.command = /^(unbanchat|unbc)$/i

handler.owner = true

export default handler