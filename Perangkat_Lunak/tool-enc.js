import JavaScriptObfuscator from 'javascript-obfuscator'

let handler = async (m, { conn, text }) => {
if (!text) throw `[!] Masukan textnya`
let res = JavaScriptObfuscator.obfuscate(text)
conn.reply(m.chat, res.getObfuscatedCode(), m)
}
handler.help = ['encrypt']
handler.tags = ['tools', "premium"]
handler.command = /^enc|encrypt$/i
handler.premium = true
export default handler