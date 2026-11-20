let handler = async (m, { conn }) => {
    if (new Date - global.db.data.users[m.sender].lastnguli > 86400000) {
      global.db.data.users[m.sender].limit += 10
      replyt('_🎉Selamat kamu mendapatkan +10 limit_', m.chat, m)
      global.db.data.users[m.sender].lastnguli = new Date * 1
    } else replyt('[💬] Anda sudah mengklaim upah nguli hari ini', m.chat, m)
  }
handler.help = ['nguli']
handler.tags = ['rpg']
handler.command = /^(nguli)$/i
handler.register = true
handler.group = true
handler.rpg = true
export default handler