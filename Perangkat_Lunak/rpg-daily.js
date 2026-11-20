import { getRpgConfig, scaledReward } from './rpg-economy-config.js'
let handler = async (m) => {
  const user = global.db.data.users[m.sender]
  const cfg = getRpgConfig().claims.daily
  const cooldown = cfg.cooldown
  const elapsed = Date.now() - Number(user.lastclaim || 0)
  if (elapsed < cooldown) {
    const left = cooldown - elapsed
    const h = Math.floor(left / 3600000), min = Math.floor(left % 3600000 / 60000), sec = Math.floor(left % 60000 / 1000)
    return replyt(`🎁 *HADIAH HARIAN*\n\nKamu sudah mengambil hadiah hari ini. Coba lagi dalam *${h} jam ${min} menit ${sec} detik*.`, m.chat, m)
  }
  let text = ''
  const labels = { exp: 'Pengalaman (XP)', money: 'Money', potion: 'Potion', limit: 'Limit' }
  for (const [key, raw] of Object.entries(cfg)) {
    if (key === 'cooldown' || !(key in user)) continue
    const amount = ['money', 'exp', 'limit'].includes(key) ? scaledReward(key, raw, 'rpg') : Math.max(0, Number(raw) || 0)
    user[key] = (Number(user[key]) || 0) + amount
    text += `▪ ${global.rpg.emoticon(key)} ${labels[key] || key}: +${amount.toLocaleString('id-ID')}\n`
  }
  user.lastclaim = Date.now()
  return replyt(`╭━━━〔 🎁 HADIAH HARIAN 〕━━━╮\n│ Berhasil diklaim!\n├────────────────────\n${text}╰━━━━━━━━━━━━━━━━━━╯`.trim(), m.chat, m)
}
handler.help = ['claim']; handler.tags = ['xp']; handler.command = /^(daily|claim)$/i
handler.register = true; handler.group = true; handler.rpg = true
export default handler
