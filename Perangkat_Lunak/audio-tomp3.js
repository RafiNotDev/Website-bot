import { toAudio } from '../Perangkat_Keras/Komponen/converter.js'

let handler = async (m, { conn, usedPrefix, command }) => {
 try {
    let q = m.quoted ? m.quoted : m
    let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
    if (!/video|audio/.test(mime)) return replyt(`reply video/voice note you want to convert to audio/mp3 with caption *${usedPrefix + command}*`, m.chat, m)
    let media = await q.download?.()
    if (!media) return replyt('Can\'t download media', m.chat, m)
    //replyt(wait, m.chat, m)
    await conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key }})
    let audio = await toAudio(media, 'mp4')
    if (!audio.data) return replyt('Can\'t convert media to audio', m.chat, m)
    conn.sendFile(m.chat, audio.data, 'audio.mp3', '', m, null, { mimetype: 'audio/mp4' })
} finally {
await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }})}
}
handler.help = ['tomp3 (reply)']
handler.tags = ['audio']
handler.command = /^(to(mp3|a(udio)?))$/i
handler.daftar = true
handler.premium = true
export default handler