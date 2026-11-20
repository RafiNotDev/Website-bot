import yts from 'yt-search'
import fetch from "node-fetch"
import axios from "axios"
let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    return replyt(`Contoh:\n${usedPrefix + command} chase atlantic`, m.chat, m)
    try {  
    await react("⏰", m.chat, m.key)
    let kecuali = null
    if (text.includes('youtube.com/shorts/') || text.includes('youtu.be/')) {
    
        let link = `https://api-faa.my.id/faa/ytmp3?url=${text}`
    let musik = await (await fetch(link)).json()
    let result = musik.result
    if (!result) return await replyt('Rest Api Lagi Error Kak Coba Seberapa Saat Lagi', m.chat, m)
    let buffer = result.mp3
    await replymusik(buffer, m.chat, m)
    
} else if (text.includes('youtube.com')) {          
          let link = `https://api-faa.my.id/faa/ytmp3?url=${text}`
    let musik = await (await fetch(link)).json()
    let result = musik.result
    if (!result) return await replyt('Rest Api Lagi Error Kak Coba Seberapa Saat Lagi', m.chat, m)
    let buffer = result.mp3
    await replymusik(buffer, m.chat, m)
      } else {
    let search = await yts(text)
    if (!search?.videos?.length) throw 'Lagu tidak ditemukan'
    let url = search.videos[0].url
    let link = `https://api-faa.my.id/faa/ytmp3?url=${url}`
    let musik = await (await fetch(link)).json()
    let result = musik.result
    if (!result) return await replyt('Rest Api Lagi Error Kak Coba Seberapa Saat Lagi', m.chat, m)
    let buffer = result.mp3
    await replymusik(buffer, m.chat, m)
  }
  } finally {
  await react("✅", m.chat, m.key)
  }
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^play$/i
handler.limit = 15

export default handler

function extractVideoId(url) {
      if (!url) return null
      let match = null
  
      if (url.includes('youtube.com/shorts/') || url.includes('youtu.be/')) {
          match = /\/([a-zA-Z0-9\-_]{11})/.exec(url)
      } else if (url.includes('youtube.com')) {
          match = /v=([a-zA-Z0-9\-_]{11})/.exec(url)
      } else {
          match = /[a-zA-Z0-9\-_]{11}/.exec(url)
      }
  
      return match ? match[1] : null
  }