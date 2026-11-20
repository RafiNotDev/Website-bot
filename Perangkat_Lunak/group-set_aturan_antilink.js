let handler = async (m, {conn, args, usedPrefix, command}) => {
        
        const selected = args[0]?.toLowerCase();
  if (!['kick', 'nokick'].includes(selected)) {
    return replyt(`*Penggunaan :*\n.${command} kick\n.${command} nokick`, m.chat, m);
  }

  db.data.chats[m.chat].kick = selected; // Ubah global, bukan per user
  return replyt(`✅ Semua Aturan Anti Link diubah Ke *${selected.toUpperCase()}* mode.`, m.chat, m);
}
handler.help = handler.command = ['setperintah-antilink']
handler.tags = ['group']
handler.admin = true
export default handler