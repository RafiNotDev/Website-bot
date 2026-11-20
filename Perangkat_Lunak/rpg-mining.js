import { getRpgConfig, scaledReward } from './rpg-economy-config.js'
const cooldown = getRpgConfig().activities.mining.cooldown
let handler = async (m, { conn, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    let timers = (cooldown - (new Date - user.lastmining))
    if (user.health < 80) return replyt(`❤️ *Stamina belum cukup!*\n\nKesehatanmu ${user.health}/100. Pulihkan hingga minimal 80 HP sebelum menambang lagi.`, m.chat, m)
    if (user.pickaxe == 0) return replyt('⛏️ Kamu belum memiliki Pickaxe. Beli alat tambang terlebih dahulu di toko RPG.', m.chat, m)
    if (new Date - user.lastmining <= cooldown) return replyt(`
Kamu masih dalam masa pemulihan tambang. Tunggu *${Math.ceil(timers / 1000)} detik* lagi.
`.trim(), m.chat, m)
    const rewards = reward(user)
    let text = '⛏️ *HASIL PENAMBANGAN*\n\nBarang yang terkikis / digunakan:'
    for (const lost in rewards.lost) if (user[lost]) {
        const total = rewards.lost[lost].getRandom()
        user[lost] -= total * 1
        if (total) text += `\n*${global.rpg.emoticon(lost)}${lost}:* ${toRupiah(total)}`
    }
    text += '\n\n💎 *Hasil yang berhasil dikumpulkan:*'
    for (const rewardItem in rewards.reward) if (rewardItem in user) {
        const total = rewards.reward[rewardItem].getRandom()
        user[rewardItem] += total * 1
        if (total) text += `\n*${global.rpg.emoticon(rewardItem)}${rewardItem}:* ${toRupiah(total)}`
    }
    replyt(text.trim(), m.chat, m)
    user.lastmining= new Date * 1
}
handler.help = ['mining']
handler.tags = ['rpg']
handler.command = /^(mining)$/i
handler.register = true
handler.group = true
handler.rpg = true
export default handler

function reward(user = {}) {
    let rewards = {
        reward: {
            exp: scaledReward('exp', getRpgConfig().activities.mining.exp, 'rpg'),
            trash: 101,
            string: 25,
            rock: 30,
            iron: 25,
            emerald: [1, 4, 0, 0, 3],
            common: [10, 40, 82, 100, 3],
            uncommon: [34, 5, 23, 81],
            mythic: [12, 4, 0, 1, 0],
            legendary: [0, 0, 5, 1, 6, 2, 0, 0],
            iron: [0, 0, 0, 1, 0, 0],
            gold: [0, 0, 0, 0, 0, 1, 0],
            diamond: [7, 2, 5, 0, 3, 0, 1, 0],
        },
        lost: {
            health: getRpgConfig().activities.mining.healthCost,
            pickaxedurability: 10
        }
    }
    return rewards
}

const toRupiah = number => parseInt(number).toLocaleString().replace(/,/gi, ".")