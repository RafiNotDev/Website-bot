let handler = async (m, { args, usedPrefix, __dirname }) => {
    let user = global.db.data.users[m.sender]
    if (user.health >= 100) return replyt(`
❤️ *HP-mu sudah penuh!* Tidak perlu menggunakan potion lagi.
`.trim(), m.chat, m)
    const heal = 40 + ((Number(user.cat) || 0) * 4)
    let count = Math.max(1, Math.min(Number.MAX_SAFE_INTEGER, (isNumber(args[0]) && parseInt(args[0]) || Math.ceil((100 - user.health) / heal)))) * 1
    count = Math.min(count, Math.ceil((100 - user.health) / heal))
    if (user.potion < count) return replyt(`🥤 Potion tidak cukup untuk memulihkan HP.\nKamu membutuhkan *${count - user.potion} Potion* lagi.\nStok saat ini: *${user.potion} Potion*.`, m.chat, m)
    user.potion -= count * 1
    const recovered = Math.min(100 - user.health, heal * count)
    user.health = Math.min(100, user.health + recovered)
    replyt(`💚 Pemulihan berhasil!\n\n🥤 Potion digunakan: *${count}*\n❤️ HP pulih: *+${recovered}*\n❤️ Kondisi sekarang: *${user.health}/100*`, m.chat, m)
}

handler.help = ['heal']
handler.tags = ['rpg','daftar']
handler.command = /^(heal)$/i
handler.register = true
handler.group = true
handler.rpg = true
export default handler

function isNumber(number) {
    if (!number) return number
    number = parseInt(number)
    return typeof number == 'number' && !isNaN(number)
}