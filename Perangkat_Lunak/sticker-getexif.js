import { format } from 'util'
const { default: { Image } } = await import('node-webpmux')

let handler = async (m) => {
    if (!m.quoted) return replyt('Tag stikernya!', m.chat, m)
    if (/sticker/.test(m.quoted.mtype)) {
        let img = new Image()
        await img.load(await m.quoted.download())
        replyt(format(JSON.parse(img.exif.slice(22).toString())), m.chat, m)
    }
}
handler.help = ['getexif']
handler.tags = ['sticker', "premium"]
handler.command = ['getexif']
handler.premium = true
handler.daftar = true
export default handler