import { scaledReward } from './rpg-economy-config.js'
import similarity from 'similarity'
const threshold = 0.72
export async function before(m) {
    let id = m.chat
    if (m.isBaileys || m.fromMe) return
    if (!m.quoted || !m.quoted.fromMe || !m.text || !/Ketik.*hlagu|ᴋᴇᴛɪᴋ.*ʜʟᴀɢᴜ/i.test(m.quoted.text) || /.*hlagu|.*ʜʟᴀɢᴜ/i.test(m.text))
        return !0
    this.tebaklagu = this.tebaklagu ? this.tebaklagu : {}
    let setting = global.db.data.settings[conn.user.jid]
    if (setting.composing)
        await this.sendPresenceUpdate('composing', m.chat)
    if (setting.autoread)
        await this.readMessages([m.key])
    if (!(id in this.tebaklagu))
        return replyt('Soal itu telah berakhir', m.chat, m)
    if (m.quoted.id == this.tebaklagu[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            clearTimeout(this.tebaklagu[id][4])
            delete this.tebaklagu[id]
            return replyt('*Yah Menyerah :( !*', m.chat, m)
        }
        let json = JSON.parse(JSON.stringify(this.tebaklagu[id][1]))
        if (m.text.toLowerCase() == json.judul.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += scaledReward('exp', this.tebaklagu[id][2], 'games')
            replyt(`*Benar!*\n+${this.tebaklagu[id][2]} XP`, m.chat, m)
            clearTimeout(this.tebaklagu[id][4])
            delete this.tebaklagu[id]
        } else if (similarity(m.text.toLowerCase(), json.judul.toLowerCase().trim()) >= threshold) {
            replyt(`*Dikit Lagi!*`, m.chat, m)
        } else if (--this.tebaklagu[id][3] == 0) {
            clearTimeout(this.tebaklagu[id][4])
            delete this.tebaklagu[id]
            conn.reply(m.chat, `*Kesempatan habis!*\nJawaban: *${json.jawaban}*`, m)
        } else replyt(`*❌ Jawaban belum tepat!*\nMasih ada ${this.tebaklagu[id][3]} kesempatan`, m.chat, m)
    }
    return !0
}
export const exp = 0