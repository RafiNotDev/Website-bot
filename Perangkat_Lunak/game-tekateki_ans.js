import { scaledReward } from './rpg-economy-config.js'
import similarity from 'similarity'
const threshold = 0.72
export async function before(m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text || !/Ketik.*tekki/i.test(m.quoted.text) || /.*tekki/i.test(m.text))
        return !0
    this.tekateki = this.tekateki ? this.tekateki : {}
    if (!(id in this.tekateki))
        return replyt('Soal itu telah berakhir', m.chat, m)
    if (m.quoted.id == this.tekateki[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            clearTimeout(this.tekateki[id][3])
            delete this.tekateki[id]
            return replyt('*Yah Menyerah :( !*', m.chat, m)
        }
        let json = JSON.parse(JSON.stringify(this.tekateki[id][1]))
        // replyt(JSON.stringify(json, null, '\t'), m.chat, m)
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            global.db.data.users[m.sender].money += scaledReward('money', this.tekateki[id][2], 'games')
            global.db.data.users[m.sender].exp += scaledReward('exp', this.tekateki[id][2], 'games')
            global.db.data.users[m.sender].limit += scaledReward('limit', 2, 'games')
            replyt(`
╔═══════════━──⪼
║ *Jawaban Kamu*
╠⪼ ${json.jawaban}
║  Wah Ternyata Benar✅
╚═══════════━──⪼
╔═══════════━──⪼
║ *Selamat Kak*
║ _Hadiah yang kamu dapatkan:_
╠──────────────⪼
║ *Money*💰= +${this.tekateki[id][2]}
╠──────────────⪼
║ *Limit*💳= +2
╠──────────────⪼
║ *XP*🎗️= +${this.tekateki[id][2]}
╚═══════════━──⪼`, m.chat, m)
            clearTimeout(this.tekateki[id][3])
            delete this.tekateki[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold)
            replyt(`*Dikit Lagi Kak*`, m.chat, m)
        else
            replyt(`*Salah Atuh Kak!*`, m.chat, m)
    }
    return !0
}
export const exp = 0