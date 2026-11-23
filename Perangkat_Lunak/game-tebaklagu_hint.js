let handler = async (m, { conn }) => {
    conn.tebaklagu = conn.tebaklagu ? conn.tebaklagu : {}
    let id = m.chat
    if (!(id in conn.tebaklagu)) return
    let json = conn.tebaklagu[id][1]
    replyt('Clue : ' + '```' + json.judul.replace(/[AIUEOaiueo]/ig, '_') + '```' + '\n\n_*Jangan Balas Chat Ini Tapi Balas Soalnya*_', m.chat, m)
}
handler.command = /^hlagu$/i
handler.limit = 1
handler.daftar = true
export default handler