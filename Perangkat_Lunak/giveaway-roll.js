let handler = async (m, { conn, usedPrefix }) => {
    let id = m.chat
    conn.giveway = conn.giveway ? conn.giveway : {}
    if (!(id in conn.giveway)) {
     return conn.sendMessage(id, {
    text: `_Tidak ada *GIVEAWAY* berlangsung digrup ini!_\n_Ketik Tombol Di Bawah Untuk Mulai Giveaway_`,
    footer: global.setting.namabot,
     buttons: [
  {
    buttonId: 'action',
    buttonText: {
      displayText: 'ini pesan interactiveMeta'
    },
    type: 4,
    nativeFlowInfo: {
      name: 'single_select',
      paramsJson: JSON.stringify({
        title: 'STARTUP GIVEAWAY',
        sections: [
          {
            title: `Developer By: @${global.nodev}`,
            highlight_label: '😂',
            rows: [
              {
                header: 'MULAI GIVEAWAY',
                title: 'Mulai Giveaway',
                description: 'Memulaikan Giveaway...',
                id: '.mulaigiveaway',
              },
            ],
          },
        ],
      }),
    },
  },
  ],
  headerType: 1,
  viewOnce: true
}, { quoted: m })
}

    let d = new Date
    let date = d.toLocaleDateString('id', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
    let absen = conn.giveway[id][1]
    let cita = absen[Math.floor(Math.random() * absen.length)]
    let tag = `@${cita.split`@`[0]}`
    let loadd = [
'⋘ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...  𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑑𝑎𝑡𝑎... ⋙',
'▒▒▒▒▒▒▒▒▒▒ 0%',
'█▒▒▒▒▒▒▒▒▒ 10%',
'██▒▒▒▒▒▒▒▒ 20%',
'███▒▒▒▒▒▒▒ 30%',
'████▒▒▒▒▒▒ 40%',
'█████▒▒▒▒▒ 50%',
'██████▒▒▒▒ 60%',
'███████▒▒▒ 70%',
'████████▒▒ 80%',
'█████████▒ 90%',
'██████████ 100%',
'Ｓｕｃｃｅｓｓ!',
'M e n d a p a t k a n  P e m e n a n g'
 ]

let { key } = await conn.sendMessage(m.chat, {text: '*Mencari Pemenangnya*'})

for (let i = 0; i < loadd.length; i++) {
await sleep(1000)
await conn.sendMessage(m.chat, {text: loadd[i], edit: key })} return conn.reply(m.chat, `🎊 *CONGRATULATIONS* 🎉
${tag} Kamu Pemenang Giveawaynya🎉

Tanggal: ${date}
————————————————————————
_*Note:* Hapus giveaway setelah selesai dengan menulis *.hapusgiveaway*_`, m, { contextInfo: { mentionedJid: absen } })
}
handler.help = ['rollgiveaway']
handler.tags = ['group']
handler.command = /^(rolling|rollgiveaway|rollinggiveaway)$/i
handler.admin = true
export default handler

const sleep = (ms) => {
return new Promise(resolve => setTimeout(resolve, ms));
}
