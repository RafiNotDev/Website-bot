import fetch from 'node-fetch'
let handler = async (m) => {
let arr = Object.entries(db.data.users).filter(user => !user[1].registered && !user[1].unreg).map(user => user[0])
let boy = `Sukses Menghapus ${arr.length} User`
for (let x of arr) delete db.data.users[x]
await replyt(boy, m.chat, m)
}
handler.help = ['resetuser']
handler.tags = ['rowner']
handler.command = /^(resetuser)$/i
handler.rowner = true
export default handler