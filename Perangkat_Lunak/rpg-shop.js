import fs from "fs"
let items = {
    buy: {
        limit: {
            exp: 10000
        },
        exp: {
            money: 1000
        },
        chip: {
            money: 1000000
        },
        potion: {
            money: 1250
        },
        trash: {
            money: 40
        },
        wood: {
            money: 700
        },
        rock: {
            money: 850
        },
        string: {
            money: 400
        },
        iron: { 
            money: 3000
        },
        diamond: {
            money: 500000
        },
        emerald: {
            money: 100000
        },
        gold: {
            money: 100000
        },
        common: {
            money: 10000
        },
        uncommon: {
            money: 20000
        },
        mythic: {
            money: 75000
        },
        legendary: {
            money: 200000
        },
        petfood: {
            money: 3500
        },
        pet: {
            money: 120000
        },
        anggur: {
            money: 2000
        },
        apel: {
            money: 2000
        },
        jeruk: {
            money: 2000
        },
        mangga: {
            money: 2000
        },
        pisang: {
            money: 2000
        },
        bibitanggur: {
            money: 2000
        },
        bibitapel: {
            money: 2000
        },
        bibitjeruk: {
            money: 2000
        },
        bibitmangga: {
            money: 2000
        },
        bibitpisang: {
            money: 2000
        },
        umpan: {
            money: 5000
        },
        garam: {
        	money: 1000
        },
        minyak: {
        	money: 1000
        },
        gandum: {
        	money: 1500
        },
        steak: {
        	money: 10000
        },
        ayam_goreng: {
        	money: 10000
        },
        ribs: {
        	money: 8000
        },
        roti: {
        	money: 5000
        },
        udang_goreng: {
        	money: 10000
        },
        bacon: {
        	money: 5000
        }
    },
    sell: {
        limit: {
            exp: 1000
        },
        exp: {
            money: 2
        },
        chip: {
            money: 900000
        },
        potion: {
            money: 625
        },
        trash: {
            money: 20
        },
        wood: {
            money: 350
        },
        rock: {
            money: 425
        },
        string: {
            money: 200
        },
        iron: { 
            money: 1500
        },
        diamond: {
            money: 250000
        },
        emerald: {
            money: 50000
        },
        gold: {
            money: 50000
        },
        common: {
            money: 5000
        },
        uncommon: {
            money: 10000
        },
        mythic: {
            money: 37500
        },
        legendary: {
            money: 100000
        },
        petfood: {
            money: 1750
        },
        pet: {
            money: 60000
        },
        anggur: {
            money: 1000
        },
        apel: {
            money: 1000
        },
        jeruk: {
            money: 1000
        },
        mangga: {
            money: 1000
        },
        pisang: {
            money: 1000
        },
        bibitanggur: {
            money: 1000
        },
        bibitapel: {
            money: 1000
        },
        bibitjeruk: {
            money: 1000
        },
        bibitmangga: {
            money: 1000
        },
        bibitpisang: {
            money: 1000
        },
        umpan: {
            money: 2500
        },
        garam: {
        	money: 500
        },
        minyak: {
        	money: 500
        },
        gandum: {
        	money: 750
        },
        steak: {
        	money: 5000
        },
        ayam_goreng: {
        	money: 5000
        },
        ribs: {
        	money: 4000
        },
        roti: {
        	money: 2500
        },
        udang_goreng: {
        	money: 5000
        },
        bacon: {
        	money: 2500
        }
    }
}

let handler = async (m, { conn, command, usedPrefix, args }) => {
    let emot = v => global.rpg.emoticon(v)
    let item = (args[0] || '').toLowerCase()
    let bank = args[2] == "--bank"
    let expLimit = /exp|limit/i.test(item)
    let user = global.db.data.users[m.sender]
    if (bank && user.atm < 10) return replyt("Minimal level atm 10, untuk menggunakan fitur ini", m.chat, m)
    let { stock } = global.db.data.bots
    let listItems = Object.fromEntries(Object.entries(items[command]).filter(([v]) => v))
    let header = command == 'buy' ? '*––––––『 𝙱𝚄𝚈𝙸𝙽𝙶 』––––––*\n\n' : '*––––––『 𝚂𝙴𝙻𝙻𝙸𝙽𝙶 』––––––*\n\n'
    let footer = `

–––––––––––––––––––––––––
💁🏻‍♂ ᴛɪᴩ :
➠ ᴛᴏ ʙᴜʏ ɪᴛᴇᴍs:
${usedPrefix + command} [item] [quantity]
▧ ᴇxᴀᴍᴩʟᴇ:
${usedPrefix + command} potion 10`
    let caption = Object.keys(listItems).map(v => {
        let paymentMethod = bank && !expLimit ? "bank" : Object.keys(listItems[v]).find(v => v)
        let hargaDisc = listItems[v][paymentMethod] - (listItems[v][paymentMethod] * (user.dog / 100))
        let harga = listItems[v][paymentMethod]
        let price = command == "sell" ? harga : hargaDisc.toFixed(0)
        return `
${emot(v)} ${capitalize(v)} ${!/exp|limit/i.test(v) ? 
`\n• Stock : ${toRupiah(stock[v])}` : ''}
• Price : ${toRupiah(price)} ${capitalize(paymentMethod)}
`.trim()
    }).join('\n\n')
    let total = Math.floor(isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
    let diskon = user.dog != 0 && command != "sell" ? `_Kamu mendapakan diskon harga ${user.dog}% karna mempunyai pet dog_\n\n` : ''
    if (expLimit && bank) return replyt(`Tidak bisa membeli ${capitalize(item)} ${emot(item)} dengan menggunakan bank!`, m.chat, m)
    if (!listItems[item]) return conn.adReply(m.chat, header + diskon + caption + footer, 'S H O P', '', flaImg.getRandom() + 'SHOP', global.setting.namabot, m)
    if (command.toLowerCase() == 'buy') {
        let paymentMethod = bank && !expLimit ? "bank" : Object.keys(listItems[item]).find(v => v in user)
        let paymentMethods = Object.keys(listItems[item]).find(v => v in user)
        let hargaDisc = listItems[item][paymentMethods] - (listItems[item][paymentMethods] * (user.dog / 100))
        let harga = listItems[item][paymentMethods]
        let price = command == "sell" ? harga : hargaDisc.toFixed(0)
        if (user[paymentMethod] < price * total) return replyt(`Kamu membutuhkan *${toRupiah((price * total) - user[paymentMethod])}* ${capitalize(paymentMethod)} ${emot(paymentMethod)} lagi, untuk membeli *${toRupiah(total)}* ${capitalize(item)} ${emot(item)}. kamu hanya memiliki *${toRupiah(user[paymentMethod])}* ${capitalize(paymentMethod)} ${emot(paymentMethod)}.`, m.chat, m)
        if (!expLimit && stock[item] === 0) return replyt('Mohon maaf barang ini telah habis!', m.chat, m)
        if (!expLimit && stock[item] < total) return replyt(`Mohon maaf, stock ${capitalize(item)} ${emot(item)} saat ini hanya ${toRupiah(stock[item])}`, m.chat, m)
        user[paymentMethod] -= price * total
        user[item] += total
        stock[item] -= total
        conn.reply(m.chat, `Sukses Membeli *${toRupiah(total)} ${capitalize(item)} ${emot(item)}*, Seharga *${toRupiah(price * total)} ${capitalize(paymentMethod)} ${emot(paymentMethod)}*`, m)
    } else {
        let paymentMethod = bank && !expLimit ? "bank" : Object.keys(listItems[item]).find(v => v in user)
        let paymentMethods = Object.keys(listItems[item]).find(v => v in user)
        let hargaDisc = listItems[item][paymentMethods] - (listItems[item][paymentMethods] * (user.dog / 100))
        let harga = listItems[item][paymentMethods]
        let price = command == "sell" ? harga : hargaDisc.toFixed(0)
        let maxMoney = user.cat ? 99999999 + (user.cat * 4000000) : 99999999
        if (user.money + (price * total) > maxMoney && user.fullatm < user.bank + (price * total)) return replyt(`Kapasitas *Bank ${emot("bank")}* kamu telah full, silahkan upgrade terlebih dahulu!`, m.chat, m)
        if (user[item] < total) return replyt(`Kamu tidak mempunyai *${capitalize(item)} ${emot(item)}* untuk dijual, kamu hanya mempunyai ${toRupiah(user[item])} ${capitalize(item)} ${emot(item)}`, m.chat, m)
        user[paymentMethod] += price * total
        user[item] -= total
        stock[item] += total
        conn.reply(m.chat,`Sukses Menjual *${toRupiah(total)} ${capitalize(item)} ${emot(item)}*, Seharga *${toRupiah(price * total)} ${capitalize(paymentMethod)} ${emot(paymentMethod)}*`, m)
    }
}
handler.help = ['buy', 'sell']
handler.tags = ['rpg']
handler.command = /^(buy|sell)$/i
handler.register = true
handler.group = true
export default handler

function isNumber(number) {
    if (!number) return number
    number = parseInt(number)
    return typeof number == 'number' && !isNaN(number)
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.substr(1)
}

let flaImg = [
    'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=water-logo&script=water-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextColor=%23000&shadowGlowColor=%23000&backgroundColor=%23000&text=',
    'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=crafts-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&text=',
    'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=amped-logo&doScale=true&scaleWidth=800&scaleHeight=500&text=',
    'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&text=',
    'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&fillColor1Color=%23f2aa4c&fillColor2Color=%23f2aa4c&fillColor3Color=%23f2aa4c&fillColor4Color=%23f2aa4c&fillColor5Color=%23f2aa4c&fillColor6Color=%23f2aa4c&fillColor7Color=%23f2aa4c&fillColor8Color=%23f2aa4c&fillColor9Color=%23f2aa4c&fillColor10Color=%23f2aa4c&fillOutlineColor=%23f2aa4c&fillOutline2Color=%23f2aa4c&backgroundColor=%23101820&text='
]

let toRupiah = number => parseInt(number).toLocaleString().replace(/,/g, ".")
