import { scaledReward } from './rpg-economy-config.js'
import similarity from 'similarity'
const threshold = 0.72
export async function before(m) {
    let id = m.chat
    if (m.isBaileys || m.fromMe) return
    if (!m.quoted || !m.quoted.fromMe || !m.text || !/Ketik.*hotak|ᴋᴇᴛɪᴋ.*hotak/i.test(m.quoted.text) || /.*(hotak|bantuan)|.*(hotak|bantuan)/i.test(m.text))
        return !0
    this.asahotak = this.asahotak ? this.asahotak : {}
    let setting = global.db.data.settings[conn.user.jid]
        await this.sendPresenceUpdate('composing', m.chat)
        await this.readMessages([m.key])
    if (!(id in this.asahotak))
        return replyt('Soal itu telah berakhir', m.chat, m)
    if (m.quoted.id == this.asahotak[id][0].id) {
        let json = JSON.parse(JSON.stringify(this.asahotak[id][1]))
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += scaledReward('exp', this.asahotak[id][2], 'games')
            global.db.data.users[m.sender].money += scaledReward('money', 10000, 'games')
            global.db.data.users[m.sender].limit += scaledReward('limit', 2, 'games')
            await replyt(`
╔═══════════━──⪼
║ *Jawaban Kamu*
╠⪼ ${json.jawaban}
║  Wah Ternyata Benar✅
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
            clearTimeout(this.asahotak[id][4])
            delete this.asahotak[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
            replyt(`🟡 *Hampir benar!* Sedikit lagi, coba pikirkan kembali.`, m.chat, m)
        } else if (--this.asahotak[id][3] <= 0) {
            const answer = json.jawaban
            clearTimeout(this.asahotak[id][4])
            delete this.asahotak[id]
            conn.reply(m.chat, `❌ *Kesempatan menjawab habis!*\n\nJawaban yang benar: *${answer}*\n\nCoba lagi di tantangan berikutnya!`, m)
        } else replyt(`❌ *Jawaban belum tepat.*\n\nJawabanmu: ${m.text}\nKesempatan tersisa: *${this.asahotak[id][3]}*\nAyo coba lagi!`, m.chat, m)
    }
    return !0
}
export const exp = 0