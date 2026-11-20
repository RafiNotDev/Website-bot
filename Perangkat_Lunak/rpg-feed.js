let petTypes = ['cat', 'dog', 'horse', 'fox', 'robo']

let handler = async (m, { conn, args, usedPrefix }) => {
    let info = `
- List Pet:
${global.rpg.emoticon('cat')} Cat
${global.rpg.emoticon('dog')} Dog
${global.rpg.emoticon('horse')} Horse
${global.rpg.emoticon('fox')} Fox
${global.rpg.emoticon('robo')} Robo

Contoh : 
${usedPrefix}feed cat
`.trim()

    let pesan = pickRandom(['nyummm~', 'thanks', 'thankyou ^-^', '...', 'thank you~', 'arigatou ^-^'])
    let type = (args[0] || '').toLowerCase()
    let user = global.db.data.users[m.sender]

    if (!petTypes.includes(type)) return replyt(info, m.chat, m)

    let pet = type
    let petName = pet.charAt(0).toUpperCase() + pet.slice(1)
    let petEmoji = global.rpg.emoticon(pet)

    if (user[pet] === 0) return replyt(`🐾 Kamu belum memiliki ${petName}. Dapatkan hewan peliharaan terlebih dahulu.`, m.chat, m)
    if (user[pet] > 10) return replyt(`⭐ ${petName} sudah mencapai level maksimal!`, m.chat, m)

    let timeSinceLastFeed = new Date() - user[`${pet}lastfeed`]
    let timeRemaining = 60000 - timeSinceLastFeed

    if (timeSinceLastFeed > 60000) {
        if (user.petfood > 0) {
            user.petfood -= 1
            user[`${pet}exp`] += 20
            user[`${pet}lastfeed`] = new Date() * 1

            replyt(`🍖 Memberi makan ${petName}...\n${petEmoji} ${petName}: ${pesan}`, m.chat, m)

            if (user[pet] > 0 && user[`${pet}exp`] > (user[pet] * 100) - 1) {
                user[pet] += 1
                user[`${pet}exp`] -= user[pet] * 100
                replyt(`🎉 Hebat! ${petName} naik level!`, m.chat, m)
            }
        } else {
            replyt(`Your pet food is not enough`, m.chat, m)
        }
    } else {
        replyt(`🐾 ${petName} masih kenyang. Coba beri makan lagi dalam\n➞ ${clockString(timeRemaining)}`, m.chat, m)
    }
}

handler.help = ['feed']
handler.tags = ['rpg']
handler.command = /^(feed(ing)?)$/i
handler.register = true
handler.group = true
handler.rpg = true

export default handler

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 310000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, ' H ', m, ' M ', s, ' S'].map(v => v.toString().padStart(2, 0)).join('')
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}