import fetch from 'node-fetch'
import moment from 'moment-timezone'
let handler = async (m, {
    conn,
    text,
    command,
    usedPrefix
}) => {
    if (!text) return replyt('gunakan : .iqc kamu gila, dan kamu gila whahhahahahah', m.chat, m)
    try {
        await conn.sendMessage(m.chat, {
            react: {
                text: '🕐',
                key: m.key
            }
        })
        let batrai = pickRandom(['10','20','30','40','50','60','70','80','90','100'])
        let waktu = moment.tz('Asia/Jakarta').format('HH:mm')

        let url = `https://brat.siputzx.my.id/iphone-quoted?time=${waktu}&batteryPercentage=${batrai}&carrierName=INDOSAT&messageText=${text}&emojiStyle=apple`

        let res = await fetch(url)
        if (!res.ok) return replyt('gagal fetch url', m.chat, m)

        let buffer = await res.buffer()
        await conn.sendMessage(m.chat, {
            image: buffer
        }, {
            quoted: m
        })
    } finally {
        await conn.sendMessage(m.chat, {
            react: {
                text: '✅',
                key: m.key
            }
        })
    }
}

handler.help = ['iqc *<jam|batre|pesan>* (5 Limit)']
handler.tags = ['maker']
handler.command = ['iqc']
handler.limit = 5
export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}