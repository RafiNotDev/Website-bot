import { scaledReward } from './rpg-economy-config.js'
import similarity from 'similarity'
const threshold = 0.72
export async function before(m) {
    let id = m.chat
    if (m.isBaileys || m.fromMe) return
    if (!m.quoted || !m.quoted.fromMe || !m.text || !/Ketik.*teben|ᴋᴇᴛɪᴋ.*ᴛᴇʙᴇɴ/i.test(m.quoted.text) || /.*teben|.*ᴛᴇʙᴇɴ/i.test(m.text))
        return !0
    this.tebakbendera = this.tebakbendera ? this.tebakbendera : {}
    let setting = global.db.data.settings[conn.user.jid]
    if (setting.composing)
        await this.sendPresenceUpdate('composing', m.chat)
    if (setting.autoread)
        await this.readMessages([m.key])
    if (!(id in this.tebakbendera))
        return replyt('Soal itu telah berakhir', m.chat, m)
    if (m.quoted.id == this.tebakbendera[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            clearTimeout(this.tebakbendera[id][4])
            delete this.tebakbendera[id]
            return replyt('*Yah Menyerah :( !*', m.chat, m)
        }
        let json = JSON.parse(JSON.stringify(this.tebakbendera[id][1]))
        if (m.text.toLowerCase() == json.name.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += scaledReward('exp', this.tebakbendera[id][2], 'games')
            replyt(`*Benar!*\n+${this.tebakbendera[id][2]} XP`, m.chat, m)
            clearTimeout(this.tebakbendera[id][4])
            delete this.tebakbendera[id]
        } else if (similarity(m.text.toLowerCase(), json.name.toLowerCase().trim()) >= threshold) {
            replyt(`*Dikit Lagi!*`, m.chat, m)
        } else if (--this.tebakbendera[id][3] == 0) {
            clearTimeout(this.tebakbendera[id][4])
            delete this.tebakbendera[id]
            conn.reply(m.chat, `*Kesempatan habis!*\nJawaban: *${json.jawaban}*`, m)
        } else replyt(`*❌ Jawaban belum tepat!*\nMasih ada ${this.tebakbendera[id][3]} kesempatan`, m.chat, m)
    }
    return !0
}
export const exp = 0