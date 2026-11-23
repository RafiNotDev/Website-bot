let rafiganteng = async ( m, { conn, text, args }) => {
let who = m.mentionedJid ? m.mentionedJid[0] : m.quoted.sender
if (!who) return replyt('Reply Pesan Atau Tag Member Yang Akan Di Tambahin Exp Nya', m.chat, m)
if (!text) return replyt('Mau Nambah Berapa Exp', m.chat, m)
if (!nomor(text)) return replyt('Masukan Harus Berupa Angka', m.chat, m)
let users = global.db.data.users
    users[who].exp += nomor(text)
    replyt(`Sukses Menambah Exp @${who.split('@')[0]} Sebesar ${text}`, m.chat, m)
}
rafiganteng.help = rafiganteng.command = ['addexp']
rafiganteng.tags = ['owner']
rafiganteng.owner = true

export default rafiganteng