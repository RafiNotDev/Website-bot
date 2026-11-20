import { getRpgConfig, scaledReward } from './rpg-economy-config.js'
let handler = async (m) => {
  const user = global.db.data.users[m.sender], cfg = getRpgConfig().claims.weekly
  const elapsed = Date.now() - Number(user.lastweekly || 0)
  if (elapsed < cfg.cooldown) return replyt(`🎁 Hadiah mingguan sudah diklaim. Coba lagi dalam *${Math.ceil((cfg.cooldown - elapsed) / 86400000)} hari*.`, m.chat, m)
  let text = ''
  for (const [key, raw] of Object.entries(cfg)) {
    if (key === 'cooldown' || !(key in user)) continue
    const amount = ['money', 'exp', 'limit'].includes(key) ? scaledReward(key, raw, 'rpg') : Math.max(0, Number(raw) || 0)
    user[key] = (Number(user[key]) || 0) + amount
    text += `▪ ${global.rpg.emoticon(key)} ${key}: +${amount.toLocaleString('id-ID')}\n`
  }
  user.lastweekly = Date.now()
  return replyt(`🎁 *HADIAH MINGGUAN*\n\n${text.trim()}`, m.chat, m)
}
handler.help = ['weekly']; handler.tags = ['rpg']; handler.command = /^weekly$/i
handler.register = true; handler.group = true; handler.rpg = true
export default handler
