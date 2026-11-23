import cp from 'child_process'
import { promisify } from 'util'
let exec = promisify(cp.exec).bind(cp)
let handler = async (m) => {
    let o
    try {
        o = await exec('df -h')
    } catch (e) {
        o = e
    } finally {
        let { stdout, stderr } = o
        if (stdout.trim()) replyt(stdout, m.chat, m)
        if (stderr.trim()) replyt(stderr, m.chat, m)
    }
}
handler.help = ['statserver']
handler.tags = ['info']
handler.command = /^(statserver)$/i

export default handler
