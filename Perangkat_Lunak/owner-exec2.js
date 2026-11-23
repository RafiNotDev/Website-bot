import cp, {
	exec as _exec
} from 'child_process'
import {
	promisify
} from 'util'
let exec = promisify(_exec).bind(cp)
let handler = async (m, {
	conn,
	isOwner,
	command,
	text
}) => {
		if (m.isBaileys) return
		replyt('Executing...', m.chat, m)
		let o
		try {
			o = await exec(command.trimStart() + ' ' + text.trimEnd())
		} catch (e) {
			o = e
		} finally {
			let {
				stdout,
				stderr
			} = o
			if (stdout.trim()) replyt(stdout, m.chat, m)
			if (stderr.trim()) replyt(stderr, m.chat, m)
		}
}
handler.help = ['$ [Exec]']
handler.tags = ['developer']
handler.customPrefix = /^[$] /
handler.command = new RegExp
handler.developer = true

export default handler