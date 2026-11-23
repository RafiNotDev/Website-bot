let handler = async (m, { conn, args, text }) => {
    if (!text) return replyt("linkchnya", m.chat, m)
if (!text.includes("https://whatsapp.com/channel/")) return replyt("Link tautan tidak valid", m.chat, m)
let result = text.split('https://whatsapp.com/channel/')[1]
let res = await conn.newsletterMetadata("invite", result)
let teks = `
* *ID :* ${res.id}
* *Nama :* ${res.name}
* *Total Pengikut :* ${res.subscribers}
* *Status :* ${res.state}
* *Verified :* ${res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"}`
replyt(teks, m.chat, m)
}

handler.help = ["cekidch"]
handler.tags = ["info","tools"]
handler.command = ["cinfo", "channelinfo", "ci", "cekidch"]

export default handler