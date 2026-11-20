import { getRpgConfig, scaledReward } from './rpg-economy-config.js'
let handler = async (m) => {
  const user = global.db.data.users[m.sender], cfg = getRpgConfig().claims.monthly
  const elapsed = Date.now() - Number(user.lastmonthly || 0)
  if (elapsed < cfg.cooldown) {
    const left = cfg.cooldown - elapsed, days = Math.floor(left / 86400000), hours = Math.floor(left % 86400000 / 3600000)
    return replyt(`🎁 *HADIAH BULANAN*\n\nKamu sudah mengklaim hadiah bulan ini. Coba lagi dalam *${days} hari ${hours} jam*.`, m.chat, m)
  }
  let text = ''
  for (const [key, raw] of Object.entries(cfg)) {
    if (key === 'cooldown' || !(key in user)) continue
    const amount = ['money', 'exp', 'limit'].includes(key) ? scaledReward(key, raw, 'rpg') : Math.max(0, Number(raw) || 0)
    user[key] = (Number(user[key]) || 0) + amount
    text += `▪ ${global.rpg.emoticon(key)} ${key}: +${amount.toLocaleString('id-ID')}\n`
  }
  user.lastmonthly = Date.now()
  return replyt(`╭━━〔 🎁 HADIAH BULANAN 〕━━╮\n│ Klaim berhasil!\n├──────────────────\n${text}╰━━━━━━━━━━━━━━━━━━╯`.trim(), m.chat, m)
}
handler.help = ['monthly']; handler.tags = ['rpg']; handler.command = /^monthly$/i
handler.register = true; handler.group = true; handler.rpg = true
export default handler
