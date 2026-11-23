import { getContentType, generateWAMessage, generateWAMessageFromContent, generateWAMessageContent,prepareWAMessageMedia, downloadContentFromMessage } from "@adiwajshing/baileys";
let handler = async (m, {conn, args, text, usedPrefix, command}) => {
const audioo = global.db.data.settings[conn.user.jid].musik
const dick = `
┏┃ TYPE AUDIO ┃┓
┃╭───────────────┓
┃│⏣ • Document
┃│⏣ • Pesan Suara
┃│⏣ • Fake Saluran
┗╰───────────────┛`
let msg = await generateWAMessageFromContent(m.chat, {
viewOnceMessage: {
message: {
interactiveMessage: {
body: {
text: dick,            
},
footer: {
text: "type Audio saat ini: " + audioo,
      },
 nativeFlowMessage: {
buttons: [         
             {
      "name": "single_select",
      "buttonParamsJson": `{
      "title": "select type",
             "sections":[{
                  "title":"select one of the menu views",
                   "rows":[
                      {"header":"DOCUMENT","title":"","description":"Musik Berbentuk Documents","id":".set-musik Document"},
                      {"header":"PESAN SUARA","title":"","description":"Musik Berbentuk Pesan Suara","id":".set-musik pesan suara"},
                      {"header":"FAKE SALURAN","title":"","description":"Musik Berbentuk Fake Saluran","id":".set-musik fake saluran"}
             ]}]}`
       },
     ], },},
}, }, },{ quoted : m })

    if (!text) return conn.relayMessage( msg.key.remoteJid,msg.message,{ messageId: msg.key.id }) 
    if (text === 'document', 'fake saluran', 'pesan suara') {
    global.db.data.settings[conn.user.jid].musik = text;
    replyt(`Bentuk audio berhasil di Alihkan Ke ${text}`, m.chat, m);
    } else {
    return;
    }
}
handler.help = handler.command = ['set-audio']
handler.tags = ['owner']
handler.owner = true
export default handler