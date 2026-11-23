let handler = async (m, { conn }) => {
    conn.tebaklogo = conn.tebaklogo ? conn.tebaklogo : {}
    let id = m.chat
    if (!(id in conn.tebaklogo)) return
    let json = conn.tebaklogo[id][1]
    replyt('Clue : ' + '```' + json.jawaban.replace(/[AIUEOaiueo]/ig, '_') + '```' + '\n\n_*Jangan Balas Chat Ini Tapi Balas Soalnya*_', m.chat, m)
}
handler.command = /^hlogo$/i
handler.limit = 1
export default handler