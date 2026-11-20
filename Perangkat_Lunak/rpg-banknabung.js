const xpperlimit = 1
let handler = async (m, { conn, command, args }) => {
    let user = global.db.data.users[m.sender]
    let all = command.replace(/^atm/i, '')
    let count = all ? all : args[0]
    count = count ? /all/i.test(count) ? Math.floor(user.money / xpperlimit): parseInt(count): args[0] ? parseInt(args[0]): 1
    count = Math.max(1, count)
    if (user.atm == 0) return replyt('🏧 Kamu belum memiliki kartu ATM. Beli atau dapatkan kartu ATM terlebih dahulu.', m.chat, m)
    if (user.bank > user.fullatm) return replyt('🏦 Saldo bank sudah melebihi kapasitas ATM-mu.', m.chat, m)
    if (count > user.fullatm - user.bank) return replyt('🏦 Jumlah setoran melebihi kapasitas saldo bank yang tersedia.', m.chat, m)
    if (user.money >= xpperlimit * count) {
        user.money -= xpperlimit * count
        user.bank += count
        conn.reply(m.chat, `✅ Setoran berhasil!\n\n💰 Jumlah: *${toRupiah(count)} Money*\n🏦 Saldo bank: *${toRupiah(user.bank)} Money*`, m)
    } else conn.reply(m.chat, `❌ Uang di dompet tidak cukup untuk menyetor *${toRupiah(count)} Money*.\n💰 Saldo dompet: *${toRupiah(user.money)} Money*`, m)
}
handler.help = ['atm']
handler.tags = ['rpg']
handler.command = /^(atm([0-9]+)|atm|atmall)$/i
handler.rpg = true
handler.group = true
export default handler

const toRupiah = number => parseInt(number).toLocaleString().replace(/,/gi, ".")