import { generateWAMessageContent, generateWAMessageFromContent } from "@adiwajshing/baileys";
import crypto from "crypto";
import fetch from "node-fetch"
async function groupStatus(sock, jid, content) {
    const inside = await generateWAMessageContent(content, {
        upload: sock.waUploadToServer
    })
    const messageSecret = crypto.randomBytes(32)
    const m = generateWAMessageFromContent(jid, {
        messageContextInfo: {
            messageSecret
        },
        groupStatusMessageV2: {
            message: {
                ...inside,
                messageContextInfo: {
                    messageSecret
                }
            }
        }
    }, {})
    await sock.relayMessage(jid, m.message, {
        messageId: m.key.id
    })
    return m
}


import axios from "axios"

let handler = async (m, { conn, text }) => {
  if (!text || !text.includes("tiktok.com")) return replyt(`*example:*\n${m.cmd} https://vt.tiktok.com/xxx`, m.chat, m)

  try {
  await conn.sendMessage(m.chat, {
            react: {
                text: '🕐',
                key: m.key
            }
        })
    let { data } = await axios.get(`https://api.serverweb.qzz.io/download/tiktok-v2?apikey=skyy&url=${encodeURIComponent(text.trim())}`)
    if (!data || !data.result) return replyt("Gagal mengambil data dari API TikTok.", m.chat, m)
    data = data.result

    const info = data.postinfo
    const caption = `*${info.username} (@${info.unique_id})*\n\n${info.media_title || ""}`

    if (data.video_link) {
      const videoUrl = data.video_link || data.hdDownloadUrl || data.downloadUrl
      await groupStatus(conn, m.chat, { video: { url: videoUrl }, caption: caption, })

      /*if (data.downloadUrl)
        await conn.sendMessage(m.chat, { audio: { url: data.downloadUrl }, mimetype: "audio/mpeg" }, { quoted: m })
      return*/
    } else {

    /*if (Array.isArray(data.items) && data.items.length) {
      const album = data.items.map(img => ({ image: { url: img }, caption }))
      await conn.sendAlbum(m.chat, { albumMessage: album }, m)

      if (data.downloadUrl)
        await conn.sendMessage(m.chat, { audio: { url: data.downloadUrl }, mimetype: "audio/mpeg" }, { quoted: m })
      return
    }*/

    replyt("Maaf Kayaknya url tidak Mengandung video deh, mungkin foto", m.chat, m)
}
  } catch (err) {
    console.error(err)
    replyt("Terjadi error saat memproses video TikTok.", m.chat, m)
  } finally {
  await conn.sendMessage(m.chat, {
            react: {
                text: '✅',
                key: m.key
            }
        })
  }
}

handler.help = handler.command = ["ttswgc"]
handler.tags = ["owner"]
handler.admin = true
export default handler