import { scaledReward } from './rpg-economy-config.js'
import similarity from 'similarity'
const threshold = 0.72
export async function before(m) {
    let id = m.chat
    if (m.isBaileys || m.fromMe) return
    if (!m.quoted || !m.quoted.fromMe || !m.text || !/Ketik.*hlen|ᴋᴇᴛɪᴋ.*ʜʟᴇɴ/i.test(m.quoted.text) || /.*hlen|.*ʜʟᴇɴ/i.test(m.text))
        return !0
    this.lengkapikalimat = this.lengkapikalimat ? this.lengkapikalimat : {}
    let setting = global.db.data.settings[conn.user.jid]
    if (setting.composing)
        await this.sendPresenceUpdate('composing', m.chat)
    if (setting.autoread)
        await this.readMessages([m.key])
    if (!(id in this.lengkapikalimat))
        return replyt('Soal itu telah berakhir', m.chat, m)
    if (m.quoted.id == this.lengkapikalimat[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            clearTimeout(this.lengkapikalimat[id][4])
            delete this.lengkapikalimat[id]
            return replyt('*Yah Menyerah :( !*', m.chat, m)
        }
        let json = JSON.parse(JSON.stringify(this.lengkapikalimat[id][1]))
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += scaledReward('exp', this.lengkapikalimat[id][2], 'games')
            replyt(`*Benar!*\n+${this.lengkapikalimat[id][2]} XP`, m.chat, m)
            clearTimeout(this.lengkapikalimat[id][4])
            delete this.lengkapikalimat[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
            replyt(`*Dikit Lagi!*`, m.chat, m)
        } else if (--this.lengkapikalimat[id][3] == 0) {
            clearTimeout(this.lengkapikalimat[id][4])
            delete this.lengkapikalimat[id]
            conn.reply(m.chat, `*Kesempatan habis!*\nJawaban: *${json.jawaban}*`, m)
        } else replyt(`*❌ Jawaban belum tepat!*\nMasih ada ${this.lengkapikalimat[id][3]} kesempatan`, m.chat, m)
    }
    return !0
}
export const exp = 0