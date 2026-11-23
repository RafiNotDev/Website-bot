import axios from "axios"

let handler = async (m, { conn, usedPrefix }) => {
    let result = await axios.get("https://raw.githubusercontent.com/BochilTeam/database/master/kata-kata/dare.json")
    let dare = result.data.getRandom()
    replyt(dare, m.chat, m)
}
handler.help = ['dare']
handler.tags = ['fun']
handler.command = /^(dare)$/i
handler.daftar = true
handler.limit = 2
export default handler
