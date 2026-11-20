import { scaledReward } from './rpg-economy-config.js'
import similarity from 'similarity'
const threshold = 0.72
export async function before(m) {
    let id = m.chat
    if (m.isBaileys || m.fromMe) return
    if (!m.quoted || !m.quoted.fromMe || !m.text || !/Ketik.*calo|ᴋᴇᴛɪᴋ.*ᴄᴀʟᴏ/i.test(m.quoted.text) || /.*(calo|bantuan)|.*(ᴄᴀʟᴏ|ʙᴀɴᴛᴜᴀɴ)/i.test(m.text))
        return !0
    this.caklontong = this.caklontong ? this.caklontong : {}
    let setting = global.db.data.settings[conn.user.jid]
    if (setting.composing)
        await this.sendPresenceUpdate('composing', m.chat)
    if (setting.autoread)
        await this.readMessages([m.key])
    if (!(id in this.caklontong))
        return replyt('Soal itu telah berakhir', m.chat, m)
    if (m.quoted.id == this.caklontong[id][0].id) {
        let json = JSON.parse(JSON.stringify(this.caklontong[id][1]))
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += scaledReward('exp', this.caklontong[id][2], 'games')
            global.db.data.users[m.sender].money += scaledReward('money', 10000, 'games')
            global.db.data.users[m.sender].limit += scaledReward('limit', 2, 'games')
            await replyt(`
╔═══════════━──⪼
║ *Jawaban Kamu*
╠⪼ ${json.jawaban}
║  Wah Ternyata Benar✅
║  Karena: ${json.deskripsi}
╚═══════════━──⪼
Developer: @${nodev}
╔═══════════━──⪼
║ *Selamat Kak ${m.pushName}*
║ _Hadiah yang kamu dapatkan:_
╠──────────────⪼
║ *Money* 💰 = Rp10.000
╠──────────────⪼
║ *Limit* 💳 = 2
╠──────────────⪼
║ *XP* 🎗️= 5.000
╚═══════════━──⪼`, m.chat, m)
            clearTimeout(this.caklontong[id][4])
            delete this.caklontong[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
            replyt(`*Dikit Lagi!*`, m.chat, m)
        } else if (--this.caklontong[id][3] == 0) {
            clearTimeout(this.caklontong[id][4])
            delete this.caklontong[id]
            conn.reply(m.chat, `*Kesempatan habis!*\nJawaban: *${json.jawaban}*`, m)
        } else replyt(`╔═══════════━──⪼
║ *Jawaban Kamu*
╠⪼ ${m.text}
║  Wah Ternyata Salah❌
╚═══════════━──⪼\nUpss!! Tenang🤫 Masih ada ${this.caklontong[id][3]} kesempatan Lagi`, m.chat, m)
    }
}
export const exp = 0