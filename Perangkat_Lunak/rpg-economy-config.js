import fs from 'node:fs'
import path from 'node:path'

const file = path.resolve('./Cache/Database/rpg-economy.json')
export const RPG_DEFAULTS = {
  enabled: true,
  multipliers: { games: 1, rpg: 1 },
  caps: { moneyPerAction: 25000, xpPerAction: 5000, limitPerClaim: 10 },
  claims: {
    hourly: { cooldown: 3600000, exp: 19, money: 99 },
    daily: { cooldown: 86400000, exp: 500, money: 1000, potion: 1, limit: 1 },
    weekly: { cooldown: 604800000, exp: 5000, money: 10000, potion: 3, limit: 5 },
    monthly: { cooldown: 2592000000, exp: 15000, money: 25000, potion: 5, limit: 10 }
  },
  activities: {
    mining: { cooldown: 300000, exp: 100, healthCost: 10 },
    hunting: { cooldown: 120000, maxMoney: 400, maxExp: 600 },
    fishing: { cooldown: 3600000 }
  }
}

function clone(value) { return JSON.parse(JSON.stringify(value)) }
function merge(base, extra) {
  const out = { ...base }
  for (const [key, value] of Object.entries(extra || {})) {
    out[key] = value && typeof value === 'object' && !Array.isArray(value)
      ? merge(base[key] && typeof base[key] === 'object' ? base[key] : {}, value)
      : value
  }
  return out
}

export function getRpgConfig() {
  try {
    const saved = JSON.parse(fs.readFileSync(file, 'utf8'))
    return merge(clone(RPG_DEFAULTS), saved)
  } catch {
    return clone(RPG_DEFAULTS)
  }
}

export function saveRpgConfig(config) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const temp = `${file}.${process.pid}.tmp`
  fs.writeFileSync(temp, JSON.stringify(config, null, 2))
  fs.renameSync(temp, file)
}

export function getReward(category, key, fallback) {
  const config = getRpgConfig()
  const value = config.claims?.[category]?.[key]
  return Number.isFinite(Number(value)) ? Number(value) : fallback
}

export function scaledReward(type, amount, category = 'rpg') {
  const config = getRpgConfig()
  const multiplier = Math.max(0, Math.min(5, Number(config.multipliers?.[category]) || 1))
  const capKey = type === 'money' ? 'moneyPerAction' : type === 'exp' ? 'xpPerAction' : type === 'limit' ? 'limitPerClaim' : null
  const cap = capKey ? Number(config.caps?.[capKey]) : Infinity
  return Math.max(0, Math.min(cap, Math.floor(Number(amount || 0) * multiplier)))
}
