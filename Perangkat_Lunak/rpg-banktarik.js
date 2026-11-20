const xpperlimit = 1
let handler = async (m, { conn, command, args }) => {
    let user = global.db.data.users[m.sender]
    let all = command.replace(/^tarik/i, '')
    let count = all ? all : args[0]
    count = count ? /all/i.test(count) ? Math.floor(user.bank / xpperlimit): parseInt(count): args[0] ? parseInt(args[0]): 1
    count = Math.max(1, count)
    if (user.atm == 0) return replyt('🏧 Kamu belum memiliki kartu ATM. Beli atau dapatkan kartu ATM terlebih dahulu.', m.chat, m)
    if (user.bank >= xpperlimit * count) {
        user.bank -= xpperlimit * count
        user.money += count
        conn.reply(m.chat, `✅ Penarikan berhasil!\n\n💰 Jumlah: *${toRupiah(count)} Money*\n🏦 Sisa saldo bank: *${toRupiah(user.bank)} Money*`, m)
    } else conn.reply(m.chat, `❌ Saldo bank tidak cukup untuk menarik *${toRupiah(count)} Money*.\n🏦 Saldo bank: *${toRupiah(user.bank)} Money*`, m)
}
handler.help = ['tarik']
handler.tags = ['rpg']
handler.command = /^tarik([0-9]+)|tarik|tarikall$/i
handler.group = true
handler.rpg = true
export default handler

const toRupiah = number => parseInt(number).toLocaleString().replace(/,/gi, ".")