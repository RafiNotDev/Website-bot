let handler = async (m, { conn }) => {
    conn.siapakahaku = conn.siapakahaku ? conn.siapakahaku : {}
    let id = m.chat
    if (!(id in conn.siapakahaku)) return
    let json = conn.siapakahaku[id][1]
    let ans = json.jawaban
    let clue = ans.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_')
    replyt('Clue : ' + '```' + clue + '```' + '\n\n_*Jangan Balas Chat Ini Tapi Balas Soalnya*_', m.chat, m)
}
handler.command = /^(who)$/i
handler.game = true
handler.group = true
handler.daftar = true
handler.limit = 1
export default handler