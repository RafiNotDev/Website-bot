let handler = async (m, { conn, usedPrefix, text, command }) => {
let user = global.db.data.users[m.sender]
let skill = ["swordmaster", "necromancer", "witch", "Archer", "magicswordmaster", "thief", "shadow"]
let bintang = {
"satu": "⭐",
"dua": "⭐⭐",
"tiga": "⭐⭐⭐",
"empat": "⭐⭐⭐⭐",
"lima": "⭐⭐⭐⭐⭐",
"Enam": "⭐⭐⭐⭐⭐⭐"
}
   let skil = text.trim().toLowerCase() // to filter text
   if (!skill.includes(skil)) return replyt(`Select *skill🃏* what do you want/pilih skill apa yg kamu inginkan:

${skill.map(skil => `› ${skil}`).join('\n')}

How To use/Cara menggunakan:
${usedPrefix + command} <nameskill>
     
Example/Contoh:
${usedPrefix + command} necromancer
`.trim(), m.chat, m)
    if (user.skill == "") {
        user.skill = skil
        replyt(`Anda telah memilih Skill ${skil}`, m.chat, m)
    } else if (user.skill) {
        replyt(`Anda Sudah Punya skill ${user.skill} Tidak bisa diganti`, m.chat, m)
    }
}
handler.help = ['selectskill']
handler.tags = ['rpg']
handler.command = /^(slectskill|selectskill)$/i
handler.register = true
handler.group = true
handler.rpg = true
export default handler