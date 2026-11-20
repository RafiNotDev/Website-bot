let handler = async (m, { conn }) => {
    conn.asahotak = conn.asahotak ? conn.asahotak : {}
    let id = m.chat
    if (!(id in conn.asahotak)) throw false
    let json = conn.asahotak[id][1]
    let ans = json.jawaban
    let clue = ans.replace(/[AIUEO]/gi, '_')
    replyt('💡 *PETUNJUK ASAH OTAK*\n\n```' + clue + '```\n\nBalas pesan soal utama dengan jawabanmu, bukan pesan petunjuk ini.', m.chat, m)
}
handler.command = /^hotak$/i
handler.group = true
handler.register = true
handler.game = true
export default handler