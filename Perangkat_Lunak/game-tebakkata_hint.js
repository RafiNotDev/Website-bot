let handler = async (m, { conn }) => {
    conn.tebakkata = conn.tebakkata ? conn.tebakkata : {}
    let id = m.chat
    if (!(id in conn.tebakkata)) return
    let json = conn.tebakkata[id][1]
    replyt('Clue : ' + '```' + json.jawaban.replace(/[AIUEOaiueo]/ig, '_') + '```' + '\n\n_*Jangan Balas Chat Ini Tapi Balas Soalnya*_', m.chat, m)
}
handler.command = /^teka$/i
handler.daftar = true
handler.limit = 1
export default handler