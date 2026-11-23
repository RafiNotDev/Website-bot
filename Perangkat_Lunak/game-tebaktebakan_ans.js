import similarity from 'similarity'
const threshold = 0.72
export async function before(m) {
    let id = m.chat
    if (m.isBaileys || m.fromMe) return
    if (!m.quoted || !m.quoted.fromMe || !m.text || !/Ketik.*hkan|ᴋᴇᴛɪᴋ.*ʜᴋᴀɴ/i.test(m.quoted.text) || /.*hkan|.*ʜᴋᴀɴ/i.test(m.text))
        return !0
    this.tebaktebakan = this.tebaktebakan ? this.tebaktebakan : {}
    let setting = global.db.data.settings[conn.user.jid]
    if (setting.composing)
        await this.sendPresenceUpdate('composing', m.chat)
    if (setting.autoread)
        await this.readMessages([m.key])
    if (!(id in this.tebaktebakan))
        return replyt('Soal itu telah berakhir', m.chat, m)
    if (m.quoted.id == this.tebaktebakan[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            clearTimeout(this.tebaktebakan[id][4])
            delete this.tebaktebakan[id]
            return replyt('*Yah Menyerah :( !*', m.chat, m)
        }
        let json = JSON.parse(JSON.stringify(this.tebaktebakan[id][1]))
        // replyt(JSON.stringify(json, null, '\t'), m.chat, m)
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += 5000
            global.db.data.users[m.sender].money += 10000
            global.db.data.users[m.sender].limit += 2
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
            clearTimeout(this.tebaktebakan[id][4])
            delete this.tebaktebakan[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
            replyt(`*Dikit Lagi!*`, m.chat, m)
        } else if (--this.tebaktebakan[id][3] == 0) {
            clearTimeout(this.tebaktebakan[id][4])
            delete this.tebaktebakan[id]
            conn.reply(m.chat, `*Kesempatan habis!*\nJawaban: *${json.jawaban}*`, m)
        } else replyt(`*❌ Jawaban belum tepat!*\nMasih ada ${this.tebaktebakan[id][3]} kesempatan`, m.chat, m)
    }
    return !0
}
export const exp = 0