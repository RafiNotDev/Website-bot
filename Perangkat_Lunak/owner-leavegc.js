let handler = async (m, { conn, args, command, text }) => {
    if (global.conn.user.jid != conn.user.jid) return
	let group = text ? text : m.chat
        await conn.reply(group, 'Byee Bot akan pergi , , ! (≧ω≦)ゞ', null) 
        await  conn.groupLeave(group)
        replyt('S u k s e s', m.chat, m)
        }
handler.help = ['leavegc', 'out']
handler.tags = ['rowner']
handler.command = /^(out|leavegc)$/i

handler.rowner = true

export default handler