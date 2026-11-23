import fetch from 'node-fetch'
let timeout = 120000
let money = 10000
let poin = 5000
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tekateki = conn.tekateki ? conn.tekateki: {}
    let id = m.chat
    if (id in conn.tekateki) return conn.reply(m.chat, 'Masih ada tantangan yang belum selesai di chat ini. Selesaikan terlebih dahulu sebelum memulai yang baru.', conn.tekateki[id][0])
    let src = await (await fetch('https://raw.githubusercontent.com/qisyana/scrape/main/tekateki.json')).json()
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
🧠 *TEKA TEKI — TANTANGAN SANTAI*

${json.pertanyaan}

━━━━━━━━━━━━━━━━━━
⏳ Waktu: *${timeout / 1000} detik*
🎁 *HADIAH JIKA BENAR*
💰 Money : *Rp10.000*
✨ XP : *${poin.toLocaleString('id-ID')} XP*
🎟️ Limit : *2*
━━━━━━━━━━━━━━━━━━

💡 Butuh petunjuk? Ketik *${usedPrefix}tekki*
✍️ Balas pesan soal ini dengan jawabanmu.
⚠️ Kamu punya 4 kesempatan menjawab.
`.trim()
    conn.tekateki[id] = [
        await replyt(caption, m.chat, m),
        json, money, poin, 
        setTimeout(() => {
            if (conn.tekateki[id]) conn.reply(m.chat, `⌛ Waktu tantangan habis!\nJawaban yang benar: *${json.jawaban}*`, conn.tekateki[id][0])
            delete conn.tekateki[id]
        }, timeout)
    ]
}
handler.help = ['tekateki']
handler.tags = ['game']
handler.command = /^tekateki/i
handler.group = true
handler.daftar = true
handler.game = true
export default handler