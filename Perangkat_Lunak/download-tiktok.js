import axios from "axios"

let handler = async (m, { conn, text, command }) => {
  if (!text || !text.includes("tiktok.com")) return replyt(`*example:*\n${command} https://vt.tiktok.com/xxx`, m.chat, m)

  try {
  await react("⏰")
    let { data } = await axios.get(`https://api.serverweb.qzz.io/download/tiktok-v2?apikey=skyy&url=${encodeURIComponent(text.trim())}`)
    if (!data || !data.result) return replyt("Gagal mengambil data dari API TikTok.", m.chat, m)
    data = data.result

    const info = data.postinfo
    const caption = `*${info.username} (@${info.unique_id})*\n\n${info.media_title || ""}`
    if (data.video_link) {
      const videoUrl = data.video_link || data.hdDownloadUrl || data.downloadUrl
      if ( command == "ttptv") {
      try {
      await react("⏰")
     await conn.sendMessage(m.chat, { video: { url: videoUrl }, caption, ptv: true}, { quoted: m })
     } finally {
     await react("✅")
     }
     } else {
      await conn.sendMessage(m.chat, { video: { url: videoUrl }, caption, }, { quoted: m })

      if (data.downloadUrl)
        await replymusik(data.downloadUrl)
      return
    }
    } else if (Array.isArray(data.items) && data.items.length) {
      const album = data.items.map(img => ({ image: { url: img }, caption }))
      await conn.sendAlbum(m.chat, { albumMessage: album }, m)

      if (data.downloadUrl)
        await replymusik(data.downloadUrl)
      return
    } else {
    replyt("Media tidak ditemukan.", m.chat, m)
    }
  } catch (err) {
    console.error(err)
    replyt("Terjadi error saat memproses video TikTok.", m.chat, m)
  } finally {
  await react("✅")
  }
}

handler.tags = ["Download"]
handler.help = "tiktok"
handler.command = ["tiktok", "ttdl", "tt", "ttptv"]

export default handler