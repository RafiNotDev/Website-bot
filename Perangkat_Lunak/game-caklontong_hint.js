let handler = async (m, { conn }) => {
    conn.caklontong = conn.caklontong ? conn.caklontong : {}
    let id = m.chat
    if (!(id in conn.caklontong)) throw false
    let json = conn.caklontong[id][1]
    let ans = json.jawaban
    let clue = ans.replace(/[AIUEO]/gi, '_')
    replyt('```' + clue + '```' + '\n\n*Jangan Balas Chat Ini Tapi Balas Soalnya*', m.chat, m)
}
handler.command = /^calo$/i
handler.group = true
handler.daftar = true
handler.game = true
handler.limit = 1
export default handler