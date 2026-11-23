import axios from "axios"

let handler = async (m, { conn, text, command }) => {
  if (!text || !text.includes("tiktok.com")) return replyt(`*example:*\n.${command} https://vt.tiktok.com/xxx`, m.chat, m)

  try {
  await react("⏰", m.chat, m.key)
    let { data } = await axios.get(`https://api-cloud.my.id/downloader/tiktok?url=${encodeURIComponent(text.trim())} `)
    if (!data.result) return replyt("Gagal mengambil data dari API TikTok.", m.chat, m)
    data = data.result

    const caption = `*Title:* ${data.title || ""}\n*Author:* ${data.username}\n*Tanggal Publish:* ${data.created_at} WIB\n*Negara:* ${data.region === "ID" ? "INDONESIA" : data.region === "SG" ? "SINGAPURA" : data.region === "TH" ? "THAILAND" : "NEGARA LAIN" }`
    if (data.type === "video") {
      const videoUrl = data.hd
      if ( command == "ttptv") {
      try {
      await react("⏰", m.chat, m.key)
     await conn.sendMessage(m.chat, { video: { url: videoUrl }, caption, ptv: true}, { quoted: m })
     } finally {
     await react("✅", m.chat, m.key)
     }
     } else if ( command == "ttswgc") {
     try {
      await react("⏰", m.chat, m.key)
     await swgc(conn, m.chat, { video: { url: videoUrl }, caption: caption })
     } finally {
     await react("✅", m.chat, m.key)
     }
     } else {
      await conn.sendMessage(m.chat, { video: { url: videoUrl }, caption, }, { quoted: m })

      if (data.music)
        await replymusik(videoUrl, m.chat, m)
      return
    }
    } else if (data.type === "photo") {
      const album = data.images.map
      for ( let url of album ) {
      await replygambar(caption, m.chat, m, url)
    }
      if (data.music)
        await replymusik(data.music, m.chat, m)
      return
    } else {
    replyt("Media tidak ditemukan.", m.chat, m)
    }
  } catch (err) {
    console.error(err)
    replyt("Terjadi error saat memproses video TikTok.", m.chat, m)
  } finally {
  await react("✅", m.chat, m.key)
  }
}

handler.tags = ["Download"]
handler.help = ["tiktok"]
handler.command = ["tiktok", "ttdl", "tt", "ttptv", "ttswgc"]
handler.limit = 5
handler.daftar = true
export default handler