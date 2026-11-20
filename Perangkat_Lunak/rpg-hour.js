import { getRpgConfig, scaledReward } from './rpg-economy-config.js'
let handler = async (m) => {
  const user = global.db.data.users[m.sender]
  const cfg = getRpgConfig().claims.hourly
  const elapsed = Date.now() - Number(user.lasthourclaim || 0)
  if (elapsed < cfg.cooldown) return replyt(`⏳ Hadiah per jam sudah diklaim. Coba lagi dalam *${Math.ceil((cfg.cooldown - elapsed) / 60000)} menit*.`, m.chat, m)
  let text = ''
  for (const [key, raw] of Object.entries(cfg)) {
    if (key === 'cooldown' || !(key in user)) continue
    const amount = ['money', 'exp', 'limit'].includes(key) ? scaledReward(key, raw, 'rpg') : Math.max(0, Number(raw) || 0)
    user[key] = (Number(user[key]) || 0) + amount
    text += `▪ +${amount.toLocaleString('id-ID')} ${global.rpg.emoticon(key)} ${key}\n`
  }
  user.lasthourclaim = Date.now()
  return replyt(`╭━━〔 ⏰ HADIAH PER JAM 〕━━╮\n│ Klaim berhasil!\n├──────────────────\n${text.trim()}\n╰━━━━━━━━━━━━━━━━╯`, m.chat, m)
}
handler.help = ['hourclaim']; handler.tags = ['rpg','daftar']; handler.command = /^(hourclaim|hour)$/i
handler.register = true; handler.group = true; handler.rpg = true
export default handler
