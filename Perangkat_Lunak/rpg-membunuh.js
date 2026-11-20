let handler = async (m, { conn, text, usedPrefix, command }) => {
    let users = global.db.data.users
    let dapat = (Math.floor(Math.random() * 100000))
    let healtu = (Math.floor(Math.random() * 100))
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
    if (!who) return replyt('Tag orang yang mau kamu Bunuh!', m.chat, m)
    if (typeof global.db.data.users[who] == 'undefined') return replyt('Pengguna tidak ada didalam data base', m.chat, m)
    if (users[who].level > users[m.sender].level) return m.reply(`Level kamu harus lebih tinggi dari @${who.split('@')[0]} Untuk bisa Membunuhnya!`, false, { mentions: [who] })
    let __timers = (new Date - global.db.data.users[m.sender].lastsda)
    let _timers = (3600000 - __timers)
    let timers = clockString(_timers)
    if (new Date - global.db.data.users[m.sender].lastsda > 3600000) {
        if (10 > users[who].health) return replyt('target sudah tidak memiliki health💉', m.chat, m)
        if (100 > users[who].money) return replyt('💠target tidak memiliki apapun :(💠', m.chat, m)
        users[who].health -= healtu * 1
        users[who].money -= dapat * 1
        users[m.sender].money += dapat * 1
        global.db.data.users[m.sender].lastsda = new Date * 1
        conn.reply(m.chat, `Target berhasil di bunuh dan kamu mengambil money target sebesar\n💰${toRupiah(dapat)} money\ndarah target berkurang -${healtu} health❤`, m)
    } else conn.reply(m.chat, `Anda Sudah Membunuh Dan Berhasil Sembunyi, tunggu ${timers} untuk membunuh lagi`, m)
}
handler.help = ['membunuh']
handler.tags = ['rpg','daftar']
handler.command = /^(membunuh)$/i
handler.register = true
handler.group = true
handler.rpg = true

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function clockString(ms) {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

const toRupiah = number => parseInt(number).toLocaleString().replace(/,/gi, ".")