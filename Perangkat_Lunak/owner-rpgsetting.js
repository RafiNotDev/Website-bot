import { getRpgConfig, saveRpgConfig, RPG_DEFAULTS } from './rpg-economy-config.js'

const allowed = new Set([
  'multipliers.games', 'multipliers.rpg',
  'caps.moneyPerAction', 'caps.xpPerAction', 'caps.limitPerClaim',
  ...Object.keys(RPG_DEFAULTS.claims).flatMap(name => [
    `claims.${name}.cooldown`, ...Object.keys(RPG_DEFAULTS.claims[name]).filter(key => key !== 'cooldown').map(key => `claims.${name}.${key}`)
  ]),
  ...Object.keys(RPG_DEFAULTS.activities).flatMap(name => Object.keys(RPG_DEFAULTS.activities[name]).map(key => `activities.${name}.${key}`))
])

let handler = async (m, { args, usedPrefix }) => {
  const config = getRpgConfig()
  const action = (args[0] || 'help').toLowerCase()
  if (action === 'help' || action === 'menu') return replyt(
`⚙️ *PENGATURAN GAME & RPG*\n\n` +
`• ${usedPrefix}rpgsetting list — lihat konfigurasi\n` +
`• ${usedPrefix}rpgsetting set <kunci> <angka> — ubah nilai\n\n` +
`Contoh:\n${usedPrefix}rpgsetting set multipliers.games 0.8\n${usedPrefix}rpgsetting set claims.daily.money 750\n${usedPrefix}rpgsetting set activities.mining.cooldown 600000\n\n` +
`Kunci: multipliers.games, multipliers.rpg, caps.moneyPerAction, caps.xpPerAction, caps.limitPerClaim, claims.hourly|daily|weekly|monthly.*, activities.mining|hunting|fishing.*\n\n` +
`Pengali dibatasi 0–5. Cooldown menggunakan milidetik.`, m.chat, m)

  if (action === 'list') return replyt(`⚙️ *KONFIGURASI GAME & RPG*\n\n\`\`\`json\n${JSON.stringify(config, null, 2)}\n\`\`\``, m.chat, m)
  if (action !== 'set') return replyt(`Perintah tidak dikenal. Ketik *${usedPrefix}rpgsetting* untuk bantuan.`, m.chat, m)

  const key = String(args[1] || '')
  const value = Number(args[2])
  if (!allowed.has(key)) return replyt('Kunci pengaturan tidak valid. Ketik *.rpgsetting* untuk melihat daftar kunci.', m.chat, m)
  if (!Number.isFinite(value) || value < 0) return replyt('Nilai harus berupa angka nol atau lebih.', m.chat, m)
  if (key.startsWith('multipliers.') && value > 5) return replyt('Pengali maksimal adalah 5x untuk menjaga keseimbangan.', m.chat, m)
  if (key === 'caps.limitPerClaim' && value > 100) return replyt('Batas limit maksimal 100 per klaim.', m.chat, m)
  if (key.endsWith('.cooldown') && value < 1000) return replyt('Cooldown minimal 1.000 milidetik.', m.chat, m)
  if ((key.endsWith('.money') && value > 1000000) || (key.endsWith('.exp') && value > 100000)) return replyt('Nilai reward terlalu besar. Batas: 1.000.000 Money atau 100.000 XP.', m.chat, m)

  const parts = key.split('.')
  let target = config
  for (const part of parts.slice(0, -1)) target = target[part]
  target[parts.at(-1)] = value
  saveRpgConfig(config)
  return replyt(`✅ Pengaturan berhasil diperbarui.\n\n• Kunci: *${key}*\n• Nilai baru: *${value.toLocaleString('id-ID')}*\n\nPerubahan tersimpan dan berlaku pada klaim/aktivitas yang sudah terhubung ke pengaturan pusat.`, m.chat, m)
}
handler.help = ['rpgsetting']
handler.tags = ['owner']
handler.command = /^rpgsetting$/i
handler.owner = true
export default handler
