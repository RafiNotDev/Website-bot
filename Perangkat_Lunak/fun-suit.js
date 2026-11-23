let handler = async (m, { text, usedPrefix }) => {
    let salah = `Pilihan Yang Tersedia\n\nGunting, Kertas, Batu\n\n${usedPrefix}suit gunting\n\nKasih Spasi!`
    if (!text) return replyt(salah, m.chat, m)
    var astro = Math.random()

    if (astro < 0.34) {
        astro = 'batu' 
    } else if (astro > 0.34 && astro < 0.67) {
        astro = 'gunting' 
    } else {
        astro = 'kertas'
    }

    //menentukan rules
    if (text == astro) {
        replyt(`Seri!\nkamu: ${text}\nBot: ${astro}`, m.chat, m)
    } else if (text == 'batu') {
        if (astro == 'gunting') {
            global.db.data.users[m.sender].money += 1000
            replyt(`Kamu Menang!\n+1000 Money\nKamu: ${text}\nBot: ${astro}`, m.chat, m)
        } else {
            replyt(`Kamu Kalah!\nKamu: ${text}\nBot: ${astro}`, m.chat, m)
        }
    } else if (text == 'gunting') {
        if (astro == 'kertas') {
            global.db.data.users[m.sender].money += 1000
            replyt(`Kamu Menang!\n+1000 Money\nKamu: ${text}\nFangz Bot: ${astro}`, m.chat, m)
        } else {
            replyt(`Kamu Kalah!\nKamu: ${text}\nBot: ${astro}`, m.chat, m)
        }
    } else if (text == 'kertas') {
        if (astro == 'batu') {
            global.db.data.users[m.sender].money += 1000
            replyt(`Kamu Menang! \n+1000 Money\nKamu: ${text}\nFangz Bot: ${astro}`, m.chat, m)
        } else {
            replyt(`Kamu Kalah!\nKamu: ${text}\nBot: ${astro}`, m.chat, m)
        }
    } else {
        replyt(salah, m.chat, m)
    }
}
handler.help = ['suit']
handler.tags = ['fun','game']
handler.command = /^(suit)$/i
handler.daftar = true
export default handler 
