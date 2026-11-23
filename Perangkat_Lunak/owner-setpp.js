import { createRequire } from 'module';
const { S_WHATSAPP_NET } =  (await import('@adiwajshing/baileys')).default
const require = createRequire(import.meta.url);

const jimp_1 = require('jimp')

let handler = async (m, { conn, command, usedPrefix }) => {
   if (m.isBaileys) return
	let q = m.quoted ? m.quoted : m
	let mime = (q.msg || q).mimetype || q.mediaType || ''
	if (/image/g.test(mime) && !/webp/g.test(mime)) {
		try {
			let media = await q.download()
			let botNumber = await conn.user.jid
			let { img } = await pepe(media)
			await conn.query({
				tag: 'iq',
				attrs: {
					target: undefined,
					to: S_WHATSAPP_NET,
					type:'set',
					xmlns: 'w:profile:picture'
				},
				content: [
					{
						tag: 'picture',
						attrs: { type: 'image' },
						content: img
					}
				]
			})
			replyt(`Sukses mengganti PP Bot`, m.chat, m)
		} catch (e) {
			console.log(e)
			replyt(`Terjadi kesalahan, coba lagi nanti.`, m.chat, m)
		}
	} else {
		replyt(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim`, m.chat, m)
	}
}

handler.help = ['setbotpp']
handler.tags = ['owner']
handler.command = /^(set(botpp|ppbot))$/i
handler.owner = true

export default handler

async function pepe(media) {
	const jimp = await jimp_1.read(media)
	const min = jimp.getWidth()
	const max = jimp.getHeight()
	const cropped = jimp.crop(0, 0, min, max)
	return {
		img: await cropped.scaleToFit(720, 720).getBufferAsync(jimp_1.MIME_JPEG),
		preview: await cropped.normalize().getBufferAsync(jimp_1.MIME_JPEG)
	}
}