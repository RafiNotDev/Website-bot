import moment from "moment-timezone";
let handler = async (m, { conn, usedPrefix, command, text }) => {
    let target = m.mentionedJid ? m.mentionedJid[0] : m.quoted.sender
    if (!target) return m.reply(`Reply atau tag orangnya! \n\nContoh : \n${usedPrefix + command} @${m.sender.split("@")[0]}`, false, { mentions: [m.sender] })
    if (target == m.sender) return replyt("Tidak bisa kick diri sendiri", m.chat, m)
    if (target.split("@")[0] === global.setting.owner) return replyt(`Lu Ngapa mpruy, Ini Owner Gw Ngapain Lu kick`, m.chat, m)
    await replyt(`✨🎩 Selamat Datang Di Pertunjukan Sulap ${hari()} Ini! 🎩✨`, m.chat, m)
    await delay(2000)
    await replyt("🔮 Hari Ini, kita Akan Melakukan Sesuatu Yang Luar Biasa... 🔮", m.chat, m)
    await delay(2000)
    await replyt("🧙‍♂️ Siapkan Diri Kalian... Perhatikan Dengan Seksama... 🧙‍♂️", m.chat, m)
    await delay(2000)
    await replyt("✨ Sim Salabim... Menghilangkan yang tak terduga... ✨", m.chat, m)
    await delay(2000)
    await replyt("🎩 Abracadabra... Lihatlah... Sesuatu yang menakjubkan akan terjadi... 🎩", m.chat, m)
    await delay(2000)
    await replyt("🪄 Hocus Pocus... Siap untuk menghilangkan seseorang... 🪄", m.chat, m)
    await delay(2000)
    await replyt("✨ Siap-siap... Semua akan hilang dalam sekejap... ✨", m.chat, m)
    await delay(2000)
    await replyt("🌟 *Dan...!* 🌟", m.chat, m)
    await delay(1000)
    await replyt("💥 *Poof!* Anggota ini menghilang dari grup... 💥", m.chat, m)
    await delay(2000)
 
    await conn.groupParticipantsUpdate(m.chat, [target], 'remove')
    await m.reply(`Sukses mengeluarkan @${target.split("@")[0]} dari group! 🧙‍♂️✨`, false, { mentions: [target] })
}
 
handler.help = ['sulap']
handler.tags = ['group']
handler.command = /^(sulap|dor|duar)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true
export default handler

function hari() {
  const time = moment.tz("Asia/Jakarta").format("HH");
  let res = "Selamat Menjelang Pagi";
  if (time >= 4) {
    res = "Pagi";
  }
  if (time >= 10) {
    res = "Siang";
  }
  if (time >= 15) {
    res = "Sore";
  }
  if (time >= 18) {
    res = "Malam";
  }
  return res;
}

let delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))