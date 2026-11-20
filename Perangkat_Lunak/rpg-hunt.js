import { getRpgConfig, scaledReward } from './rpg-economy-config.js'
let handler = async (m, { conn, text }) => {
    let monsters = [
        { area: 1, name: "Goblin" },
        { area: 1, name: "Slime" },
        { area: 1, name: "Wolf" },
        { area: 2, name: "Nymph" },
        { area: 2, name: "Skeleton" },
        { area: 2, name: "Wolf" },
        { area: 3, name: "Baby Demon" },
        { area: 3, name: "Ghost" },
        { area: 3, name: "Zombie" },
        { area: 4, name: "Imp" },
        { area: 4, name: "Witch" },
        { area: 4, name: "Zombie" },
        { area: 5, name: "Ghoul" },
        { area: 5, name: "Giant Scorpion" },
        { area: 5, name: "Unicorn" },
        { area: 6, name: "Baby Robot" },
        { area: 6, name: "Sorcerer" },
        { area: 6, name: "Unicorn" },
        { area: 7, name: "Cecaelia" },
        { area: 7, name: "Giant Piranha" },
        { area: 7, name: "Mermaid" },
        { area: 8, name: "Giant Crocodile" },
        { area: 8, name: "Nereid" },
        { area: 8, name: "Mermaid" },
        { area: 9, name: "Demon" },
        { area: 9, name: "Harpy" },
        { area: 9, name: "Killer Robot" },
        { area: 10, name: "Dullahan" },
        { area: 10, name: "Manticore" },
        { area: 10, name: "Killer Robot" },
        { area: 11, name: "Baby Dragon" },
        { area: 11, name: "Young Dragon" },
        { area: 11, name: "Scaled Baby Dragon" },
        { area: 12, name: "Kid Dragon" },
        { area: 12, name: "Not so young Dragon" },
        { area: 12, name: "Scaled Kid Dragon" },
        { area: 13, name: "Definitely not so young Dragon" },
        { area: 13, name: "Teen Dragon" },
        { area: 13, name: "Scaled Teen Dragon" },
    ]

    let player = global.db.data.users[m.sender]
    let timeSinceLastHunt = Date.now() - Number(player.lasthunt || 0)
    let cdMinutes = Math.floor(timeSinceLastHunt / 60000) % 60
    let cdSeconds = Math.floor(timeSinceLastHunt / 1000) % 60
    let remainingMs = Math.max(0, getRpgConfig().activities.hunting.cooldown - timeSinceLastHunt)

    if (remainingMs <= 0) {
        let areaMonster = monsters[Math.floor(Math.random() * monsters.length)]
        let monster = areaMonster.name
        let monsterName = monster.toUpperCase()
        let coins = scaledReward('money', Math.floor(Math.random() * (getRpgConfig().activities.hunting.maxMoney + 1)), 'rpg')
        let exp = scaledReward('exp', Math.floor(Math.random() * (getRpgConfig().activities.hunting.maxExp + 1)), 'rpg')
        let sum = 82
        let damage = Math.max(0, sum - (Number(player.sword) || 0) * 5 - (Number(player.armor) || 0) * 5)

        player.health -= damage
        player.lasthunt = new Date().getTime() // waktu hunt 2 menit

        if (player.health <= 0) {
            player.health = 100
            player.level = Math.max(0, player.level - 1)
            let deathMessage = `☠️ *@${m.sender.split("@")[0]}* dikalahkan oleh *${monsterName}*. HP dipulihkan, tetapi level berkurang 1.`
            if (player.level > 0) {
                deathMessage += `\nLevel saat ini: *${player.level}*`
            }
            replyt(deathMessage, m.chat, m)
            return
        }

        player.money += coins
        player.exp += exp

        let message = `⚔️ *HASIL BERBURU*\n\n*@${m.sender.split("@")[0]}* berhasil mengalahkan *${monsterName}*!\n\n🎁 Hadiah: *${coins.toLocaleString('id-ID')} Money* dan *${exp.toLocaleString('id-ID')} XP*\n❤️ HP berkurang ${damage}. Sisa HP: *${player.health}/100*`
        await conn.reply(m.chat, message, m, { mentions: [m.sender] })
    } else {
        replyt(`⏳ Kamu masih memulihkan tenaga setelah berburu. Coba lagi dalam *${Math.ceil(remainingMs / 1000)} detik*.`, m.chat, m)
    }
}

handler.help = ['hunt']
handler.tags = ['rpg','daftar']
handler.command = /^(hunt(ing)?)$/i
handler.register = true
handler.group = true
handler.rpg = true
handler.energy = 5
export default handler

function formatMinutes(ms) {
    let m = isNaN(ms) ? '02' : Math.floor(ms / 60000) % 60
    return [m].map(v => v.toString().padStart(2, 0)).join(':')
}

function formatSeconds(ms) {
    let s = isNaN(ms) ? '60' : Math.floor(ms / 1000) % 60
    return [s].map(v => v.toString().padStart(2, 0)).join(':')
}
