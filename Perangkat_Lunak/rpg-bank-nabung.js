const xpperlimit = 1
let handler = async (m, { conn, command, args }) => {
	let user = global.db.data.users[m.sender]
  let count = command.replace(/^nabung/i, '')
  count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].money / xpperlimit) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
  count = Math.max(1, count)
  if (user.atm == 0) return replyt('Kamu Belum Punya Atm, Bikin Dulu Sana', m.chat, m)
  if (user.bank > user.fullatm) return replyt('Uang Dibankmu Sudah Penuh, Habisin Dulu Sana', m.chat, m)
  if (count > user.fullatm - user.bank) return replyt('Uangnya Ga Muat Lagi Dibank Karna Kebanyakan', m.chat, m)
  if (global.db.data.users[m.sender].money >= xpperlimit * count) {
    global.db.data.users[m.sender].money -= xpperlimit * count
    global.db.data.users[m.sender].bank += count
    conn.reply(m.chat, `Sukses Menabung Sebesar ${count}`, m)
  } else conn.reply(m.chat, `Uang Kamu Tidak Mencukupi Untuk Menabung Sebesar ${count} `, m)
}
handler.help = ['nabung']
handler.tags = ['rpg']
handler.command = /^nabung([0-9]+)|nabung|nabungall$/i
handler.group = true
handler.register = true
handler.rpg = true

export default handler