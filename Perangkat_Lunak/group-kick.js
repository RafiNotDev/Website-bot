import { areJidsSameUser } from '@adiwajshing/baileys'
let handler = async (m, { conn, text, participants }) => {
let user = m.mentionedJid ? m.mentionedJid[0] : m.quoted.sender
if (!user) return replyt("Mohon Tag Atau Reply Chat Member Yang Bakal Di Kick", m.chat, m)
try {
if (participants.find(a => a.jid == user)) {
await react(m.chat, "🚮")
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
replyt(`Berhasil Kick @${user.split("@")[0]} Di Group Ini`, m.chat, m)
} else {
await replyt("Maaf Member Tidak Ada Di Group Ini", m.chat, m)     
}       
} finally {
react(m.chat, "✅")
}
}
handler.help = ['jordan'].map(v => v + ' @user')
handler.tags = ['owner']
handler.command = /^(dorr|jordan|dor|tendang)$/i
handler.owner = true
handler.group = true
handler.botAdmin = true
export default handler