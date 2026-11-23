let handler = async (m, { conn, command, text, args }) => {

    if (args.length == 0) return conn.reply(m.chat, `Harap masukan pilihan angkamu`, m)
    if (args[0] == '0' || args[0] == '1' || args[0] == '2' || args[0] == '3' || args[0] == '4' || args[0] == '5' || args[0] == '6' || args[0] == '7' || args[0] == '8' || args[0] == '9') {
    let random = `${pickRandom(['2','9','19','25','36','58','70','92','100','500'])}`
    let user = global.db.data.users[m.sender]
  conn.reply(m.chat, `
*「 TEBAK ANGKA 」*

Angka Kamu : ${text}
Angka AKU : ${pickRandom(['0','1','2','3','4','5','6','7','8','9'])}

Apakah Angkamu Dengan Aku Sama?

Reward
Uang: 2000
Limit: 1
Exp: 1000
`.trim(), m)
        user.limit += 1
        user.money += 2000
        user.exp += 1000
        } else {
      conn.reply(m.chat, `Pilih Angka 0 sampai 9 sayang!`, m)
    }
}
handler.help = ['angka <0-9>']
handler.tags = ['game']
handler.command = /^angka/i
handler.daftar = true
export default handler 

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
