import fs from 'fs'
import syntaxError from 'syntax-error'
import path from 'path'

const _fs = fs.promises

let handler = async (m, { text, usedPrefix, command, __dirname }) => {
    if (m.isBaileys) return
    if (!text) throw `
Penggunaan: ${usedPrefix}${command} <name file>
Contoh: ${usedPrefix}getfile main.js
        ${usedPrefix}getplugin owner
`.trim()
    if (/p(lugin|gp)?/i.test(command)) {
        const filename = text.replace(/plugin(s)\//i, '') + (/\.js$/i.test(text) ? '' : '.js')
        const pathFile = path.join(__dirname, filename)
        const file = await _fs.readFile(pathFile, 'utf8')
        replyt(file, m.chat, m)
        const error = syntaxError(file, filename, {
            sourceType: 'module',
            allowReturnOutsideFunction: true,
            allowAwaitOutsideFunction: true
        })
        if (error) {
            await replyt(`
Error found in *${filename}*:
\`\`\`
${error}
\`\`\`
`.trim(), m.chat, m)
        }

    } else {
        const isJavascript = /\.js/.test(text)
        if (isJavascript) {
            const file = await _fs.readFile(text, 'utf8')
            replyt(file, m.chat, m)
            const error = syntaxError(file, text, {
                sourceType: 'module',
                allowReturnOutsideFunction: true,
                allowAwaitOutsideFunction: true
            })
            if (error) {
                await replyt(`
Error found in *${text}*:
\`\`\`
${error}
\`\`\`
`.trim(), m.chat, m)
            }
        } else {
            const file = await _fs.readFile(text, 'base64')
            await replyt(Buffer.from(file, 'base64'), m.chat, m)
        }
    }
}
handler.help = ['getfile','getplugin']
handler.tags = ['owner']
handler.command = /^(getfile|getplugin)$/i

handler.rowner = true

export default handler