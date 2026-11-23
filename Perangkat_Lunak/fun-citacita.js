import fetch from 'node-fetch'

let handler = async (m, {
    conn,
    command
}) => {
    let res = await fetch('https://raw.githubusercontent.com/BadXyz/txt/main/citacita/citacita.json')
    let json = await res.json()
    await replymusik(json.getRandom, m.chat, m)
}
handler.help = ['citacita']
handler.tags = ['fun']
handler.daftar = true
handler.limit = 2
handler.command = /^(citacita)$/i

export default handler