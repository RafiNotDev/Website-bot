let handler = async (m, { conn, usedPrefix, command, text }) => {
    let data = Object.keys(resep)
    let emot = v => global.rpg.emoticon(v)
    let listResep = data.map((v, i) => {
        return `${capitalize(v)} ${emot(v)}\nBahan : \n${resep[v].map(v => `• ${capitalize(v)} ${emot(v)}`).join("\n")}`.trim()
    }).join("\n\n")
    let example = `\n\nContoh: \n${usedPrefix + command} steak`
    let user = global.db.data.users[m.sender]
    let type = (text || '').toLowerCase()
    if (!type) return replyt(`Kamu ingin masak apa? \n\n${listResep + example}`, m.chat, m)
    if (!data.includes(type)) return replyt(`Tidak dapat menemukan masakan! \n\n${listResep + example}`, m.chat, m)
    let required = resep[type]
    let bahan = required.filter(v => !user[v] || user[v] < 1)
    if (bahan.length) return replyt(`Kamu membutuhkan bahan \n${bahan.map(v => `• ${capitalize(v)} ${emot(v)}`).join("\n")}`, m.chat, m)
    await replyt("Sedang memasak 👨‍🍳🍳", m.chat, m)
    await delay(5000)
    await replyt(`${capitalize(type)} ${emot(type)} telah jadi!`, m.chat, m)
    required.forEach(v => {
        user[v]--
    })
    user[type]++
}
handler.help = ["cook"]
handler.tags = ["rpg"]
handler.command = /^(masak|cook)$/i
handler.register = true
handler.group = true
handler.rpg = true
export default handler

let delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this)
    resolve()
}, ms))

let resep = {
    "steak": ['sapi', 'garam'],
    "ayam_goreng": ['ayam', 'garam', 'minyak'],
    "ribs": ['babi', 'garam'],
    "roti": ['gandum'],
    "udang_goreng": ['udang', 'minyak', 'garam'],
    "bacon": ['babi'],
}

let toRupiah = number => parseInt(number).toLocaleString().replace(/,/gi, ".")

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substr(1)
}

function isNumber(number) {
    if (!number) return number
    number = parseInt(number)
    return typeof number == 'number' && !isNaN(number)
}