let handler = async (m, { conn, command, args, usedPrefix, DevMode }) => {
    let type = (args[0] || '').toLowerCase()
    let _type = (args[0] || '').toLowerCase()
    let user = global.db.data.users[m.sender]
    let { stock } = global.db.data.bots

    let caption = `
█▀▀▀▀█▀▀▀▀█▀▀▀▀█
█────█────█────█
█▄▄▄▄█▄▄▄▄█▄▄▄▄█
█▀▀▀▀█▀▀▀▀█▀▀▀▀█
█────█────█────█
█▄▄▄▄█▄▄▄▄█▄▄▄▄█
█▀▀▀▀█▀▀▀▀█▀▀▀▀█
█────█────█────█
█▄▄▄▄█▄▄▄▄█▄▄▄▄█

*乂 List Yang Bisa Di Craft*
▧ Pickaxe ⛏️
▧ Sword ⚔️
▧ Fishingrod 🎣
▧ Armor 🥼
▧ Atm 💳

*乂 Recipe*
▧ Pickaxe ⛏️
〉 10 Kayu
〉 5 Batu
〉 5 Iron
〉 20 String

▧ Sword ⚔️
〉 10 Kayu
〉 15 Iron

▧ Fishingrod 🎣
〉 10 Kayu
〉 2 Iron
〉 20 String

▧ Armor 🥼
〉 30 Iron
〉 1 Emerald
〉 5 Diamond

▧ Atm 💳
〉3 Emerald
〉6 Diamond
〉10k Money

Contoh:
${usedPrefix + command} pickaxe`
    try {
        if (/craft|Crafting/i.test(command)) {
            const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)): !args[1] || args.length < 3 ? 1: Math.min(1, count)
            switch (type) {
                case 'pickaxe':
                    if (user.pickaxe > 0) return replyt('Kamu sudah memilik ini', m.chat, m)
                    if (user.rock < 5 || user.wood < 10 || user.iron < 5 || user.string < 20) return replyt(`Barang tidak cukup!\nUntuk membuat pickaxe. Kamu memerlukan : ${user.wood < 10 ? `\n${10 - user.wood} kayu🪵`: ''} ${user.iron < 5 ? `\n${5 - user.iron} iron⛓`: ''}${user.string < 20 ? `\n${20 - user.string} String🕸️`: ''}${user.rock < 5 ? `\n${5 - user.rock} Batu 🪨`: ''}`, m.chat, m)
                    user.wood -= 10
                    stock.wood += 10

                    user.iron -= 5
                    stock.iron += 5

                    user.rock -= 5
                    stock.rock += 5

                    user.string -= 20
                    stock.string += 20

                    user.pickaxe += 1
                    user.pickaxedurability = 40
                    replyt("Sukses membuat 1 pickaxe 🔨", m.chat, m)
                    break
                case 'sword':
                    if (user.sword > 0) return replyt('Kamu sudah memilik ini', m.chat, m)
                    if (user.wood < 10 || user.iron < 15) return replyt(`Barang tidak cukup!\nUntuk membuat sword. Kamu memerlukan :${user.wood < 10 ? `\n${10 - user.wood} kayu🪵`: ''}${user.iron < 15 ? `\n${15 - user.iron} iron⛓️`: ''}`, m.chat, m)
                    user.wood -= 10
                    stock.wood += 10

                    user.iron -= 15
                    stock.iron += 15

                    user.sword += 1
                    user.sworddurability = 40
                    replyt("Sukses membuat 1 sword 🗡️", m.chat, m)
                    break
                case 'fishingrod':
                    if (user.fishingrod > 0) return replyt('Kamu sudah memilik ini', m.chat, m)
                    if (user.wood < 20 || user.iron < 5 || user.string < 20) return replyt(`Barang tidak cukup!\nUntuk membuat pancingan. Kamu memerlukan :${user.wood < 20 ? `\n${20 - user.wood} kayu🪵`: ''}${user.iron < 5 ? `\n${5 - user.iron} iron⛓`: ''}${user.string < 20 ? `\n${20 - user.string} String🕸️`: ''}`, m.chat, m)
                    user.wood -= 10
                    stock.wood += 10

                    user.iron -= 2
                    stock.iron += 2

                    user.string -= 20
                    stock.string += 20

                    user.fishingrod += 1
                    user.fishingroddurability = 40
                    replyt("Sukses membuat 1 Pancingan 🎣", m.chat, m)
                    break
                case 'armor':
                    if (user.armor > 0) return replyt('Kamu sudah memilik ini', m.chat, m)
                    if (user.iron < 30 || user.emerald < 1 || user.diamond < 5) return replyt(`Barang tidak cukup!\nUntuk membuat armor. Kamu memerlukan :${user.iron < 30 ? `\n${30 - user.iron} Iron ⛓️`: ''}${user.emerald < 1 ? `\n${1 - user.emerald} Emerald ❇️`: ''}${user.diamond < 5 ? `\n${5 - user.diamond} Diamond 💎`: ''}`, m.chat, m)
                    user.emerald -= 1
                    stock.emerald += 1

                    user.iron -= 30
                    stock.iron += 30

                    user.diamond -= 5
                    stock.diamond += 5

                    user.armor += 1
                    user.armordurability = 50
                    replyt("Sukses membuat 1 Armor 🥼", m.chat, m)
                    break
                case 'atm':
                    if (user.atm > 0) return replyt('Kamu sudah memilik ini', m.chat, m)
                    if (user.emerald < 3 || user.money < 10000 || user.diamond < 6) return replyt(`Barang tidak cukup!\nUntuk membuat atm. Kamu memerlukan :${user.money < 10000 ? `\n${10000 - user.money} Money 💹`: ''}${user.emerald < 3 ? `\n${3 - user.emerald} Emerald ❇️`: ''}${user.diamond < 6 ? `\n${6 - user.diamond} Diamond 💎`: ''}`, m.chat, m)
                    user.emerald -= 3
                    stock.emerald += 3

                    user.diamond -= 6
                    stock.diamond += 6

                    user.money -= 10000
                    user.atm += 1
                    user.fullatm = 1000000000
                    replyt("Sukses membuat 1 Atm 💳", m.chat, m)
                    break
                default:
                    return await replyt(caption, m.chat, m)
            }
        }
    } catch (err) {
        replyt("Error\n\n\n" + err.stack, m.chat, m)
    }
}

handler.help = ['craft']
handler.tags = ['rpg']
handler.command = /^(craft|crafting|chant)/i
handler.register = true
handler.group = true
handler.rpg = true
export default handler