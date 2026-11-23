let handler = async(m, { conn, command }) => {
  let isPublic = command === "public";
  let self = global.opts["self"]

  if(self === !isPublic) return replyt(`Sudah ${!isPublic ? "Self" : "Publik"} dari tadi Bang :v`, m.chat, m)

  global.opts["self"] = !isPublic

  replyt(`${!isPublic ? "[❗] *Perintah DiTerima*\nBot Sekarang Dalam Mode Self\n Cuman Owner Dan Developer Yang Bisa Pake Bot" : "[❗] *Perintah DiTerima*\nBot Sekarang Dalam Mode Public\nSemua Orang Bisa Pake Bot"}`, m.chat, m)
}

handler.help = ["self", "public"]
handler.tags = ["rowner"]
handler.rowner = true
handler.command = /^(self|public)/i
export default handler 