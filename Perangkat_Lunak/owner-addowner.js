import fs from 'fs'
let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    const addnomorowner = JSON.parse(fs.readFileSync("./Storage/Json/rafiowner.json"));
 let nomor = await mention(text)  
switch (command) {
case 'addowner': {
if (m.isBaileys) return
  if (addnomorowner.includes(nomor)) return replyt(`Nomor @${nomor.split("@")[0]} sudah terdaftar sebagai owner!`, m.chat, m)
  if (nomor.split("@")[0] === global.setting.bot) return replyt(`Nomor @${nomor.split("@")[0]} adalah nomor bot!`, m.chat, m)
  if (nomor.split("@")[0] === global.setting.owner) return replyt(`Nomor @${nomor.split("@")[0]} adalah owner utama!`, m.chat, m)
  
  addnomorowner.push(nomor)
  fs.writeFileSync("./Storage/Json/rafiowner.json", JSON.stringify(addnomorowner, null, 2))
  replyt(`Nomor @${nomor.split("@")[0]} Sekarang Dah Berhasil Di Tambahkan Ke Dalam Database Owner Bot`, m.chat, m)

}
break
case 'delowner': {
if (m.isBaileys) return
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
handler.tags = ['owner']
handler.owner = true

export default handler