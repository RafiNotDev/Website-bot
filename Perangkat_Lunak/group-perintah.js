let handler = async (m, {
    conn,
    text,
    args,
    isAdmin,
    isOwner,
    isBotAdmin,
    israfiowner,
    command,
    usedPrefix
}) => {

    switch (command) {
        case "perintah-tutup":
        case "perintah-close": {
            if (!isBotAdmin) return replyt('Maaf Kalo Gunakan Fitur Ini Bot Harus Jadi Admin Dulu Bhangsat', m.chat, m)

            if (!( isAdmin || isOwner || israfiowner )) return replyt('Maaf Perintah Ini Hanya Untuk Admin, Buat Member Bhangsat kagak Bisa', m.chat, m)

            await conn.groupSettingUpdate(m.chat, 'announcement');
            replyt(`[ ❗ ] _*GROUP TERTUTUP*_\nAlasan: ${text ? `${text}` : 'Tanpa Alasan'}\nPerintah Oleh: ${m.pushName}`, m.chat, m)
        }
        break
        case "perintah-buka":
        case "perintah-open": {
            if (!isBotAdmin) return replyt('Maaf Kalo Gunakan Fitur Ini Bot Harus Jadi Admin Dulu Bhangsat', m.chat, m)

            if (!( isAdmin || isOwner || israfiowner )) return replyt('Maaf Perintah Ini Hanya Untuk Admin, Buat Member Bhangsat kagak Bisa', m.chat, m)

            await conn.groupSettingUpdate(m.chat, 'not_announcement');
            replyt(`[ ❗ ] _*GROUP TERBUKA*_\nPerintah Oleh: ${m.pushName}`, m.chat, m)
        }
    }
}
handler.help = ['perintah-tutup', 'perintah-buka']
handler.tags = ['group']
handler.command = ["perintah-tutup", "perintah-close", "perintah-buka", "perintah-open"]
export default handler