let handler = async (m, { conn }) => {
    conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {}
    let id = m.chat
    if (!(id in conn.tebakbendera)) return
    let json = conn.tebakbendera[id][1]
    replyt('Clue : ' + '```' + json.name.replace(/[AIUEOaiueo]/ig, '_') + '```' + '\n\n_*Jangan Balas Chat Ini Tapi Balas Soalnya*_', m.chat, m)
}
handler.command = /^(teben)$/i
handler.game = true
handler.group = true
handler.daftar = true
handler.limit = 1
export default handler