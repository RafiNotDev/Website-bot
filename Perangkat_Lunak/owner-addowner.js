import fs from 'fs'
let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    const addnomorowner = JSON.parse(fs.readFileSync("./Storage/Json/rafiowner.json"));
 let nomor = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
switch (command) {
case 'addowner': {
if (!nomor) return replyt("Tag Atau Reply Chat Yang Akan Di Jadikan Owner", m.chat, m)
  if (addnomorowner.includes(nomor)) return replyt(`Nomor @${nomor.split("@")[0]} sudah terdaftar sebagai owner!`, m.chat, m)
  if (nomor.split("@")[0] === global.setting.bot) return replyt(`Nomor @${nomor.split("@")[0]} adalah nomor bot!`, m.chat, m)
  if (nomor.split("@")[0] === global.setting.owner) return replyt(`Nomor @${nomor.split("@")[0]} adalah owner utama!`, m.chat, m)
  
  addnomorowner.push(nomor)
  fs.writeFileSync("./Storage/Json/rafiowner.json", JSON.stringify(addnomorowner, null, 2))
  replyt(`Nomor @${nomor.split("@")[0]} Sekarang Dah Berhasil Di Tambahkan Ke Dalam Database Owner Bot`, m.chat, m)

}
break
case 'delowner': {
if (!nomor) return replyt("Tag Atau Reply Chat Yang Akan DiHapus Owner nya", m.chat, m)
  if (nomor.split("@")[0] === global.setting.bot) return replyt(`Nomor @${nomor.split("@")[0]} adalah nomor bot!`, m.chat, m)
  if (nomor.split("@")[0] === global.setting.owner) return replyt(`Nomor @${nomor.split("@")[0]} adalah owner utama!`, m.chat, m)
            const unp = addnomorowner.indexOf(nomor);
            if (unp !== -1) {
                addnomorowner.splice(unp, 1);
                fs.writeFileSync('./Storage/Json/rafiowner.json', JSON.stringify(addnomorowner));
                replyt(`Nomor @${nomor.split("@")[0]} Sekarang Dah Berhasil Di Hapus Dari Dalam Database Owner Bot`, m.chat, m)
}
}
break
}
}
handler.help = handler.command = ['addowner','delowner']
handler.tags = ['rowner']
handler.rowner = true

export default handler