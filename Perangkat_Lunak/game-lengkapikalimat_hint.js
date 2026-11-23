let handler = async (m, { conn }) => {
    conn.lengkapikalimat = conn.lengkapikalimat ? conn.lengkapikalimat : {}
    let id = m.chat
    if (!(id in conn.lengkapikalimat)) throw false
    let json = conn.lengkapikalimat[id][1]
    replyt('Clue : ' + '```' + json.jawaban.replace(/[AIUEOaiueo]/ig, '_') + '```' + '\n\n_*Jangan Balas Chat Ini Tapi Balas Soalnya*_', m.chat, m)
}
handler.command = /^hlen$/i
handler.group = true
handler.daftar = true
handler.game = true
handler.limit = 1
export default handler