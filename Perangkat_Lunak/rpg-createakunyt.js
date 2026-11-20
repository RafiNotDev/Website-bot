// Handler function
const handler = async (m, { conn, command, args, usedPrefix }) => {
    const user = global.db.data.users[m.sender];

    try {
        if (command === 'createakunyt') {
            if (args.length === 0) {
                return replyt("Silakan masukkan nama akun YouTube Anda.\nContoh: .createakunyt Mahiru", m.chat, m);
            }

            // Menggabungkan semua argumen menjadi satu string (nama akun YouTube)
            const youtubeAccountName = args.join(' ');

            // Set nama akun YouTube untuk pengguna
            user.youtube_account = youtubeAccountName;
            replyt(`Akun YouTube Anda telah berhasil dibuat/diedit\nchannel: ${youtubeAccountName}`, m.chat, m);
        } else if (command === 'deleteakun') {
            // Check if user has a YouTube account
            if (!user.youtube_account) {
                return replyt("Anda belum memiliki akun YouTube.", m.chat, m);
            }

            // Delete user's YouTube account
            delete user.youtube_account;
            replyt("Akun YouTube Anda telah dihapus dari sistem kami.", m.chat, m);
        } else if (/live/i.test(command) && args[0] === 'youtuber') {
            // Periksa apakah pengguna memiliki akun YouTube
            if (!user.youtube_account) {
                return replyt("Buat akun terlebih dahulu\nKetik: .createakunyt", m.chat, m);
            }

            // Kode eksisting untuk perintah 'live youtuber'
            // ...
        } else {
            return await replyt("Perintah tidak dikenali.\n*.akunyt*\n> ᴜɴᴛᴜᴋ ᴍᴇɴɢᴇᴄᴇᴋ ᴀᴋᴜɴ ʏᴏᴜᴛᴜʙᴇ ᴀɴᴅᴀ\n*.live [judul live]*\n> ᴜɴᴛᴜᴋ ᴍᴇᴍᴜʟᴀɪ ᴀᴋᴛɪᴠɪᴛᴀs ʟɪᴠᴇ sᴛʀᴇᴀᴍɪɴɢ.", m.chat, m);
        }
    } catch (err) {
        replyt("Error\n\n\n" + err.stack, m.chat, m);
    }
};

// Metadata
handler.help = ['createakunyt', 'deleteakun']; // Add 'deleteakun' to help commands
handler.tags = ['rpg','daftar'];
handler.command = /^(createakunyt|deleteakun)$/i; // Modify to include deleteakun command
handler.register = true;
handler.rpg = true
handler.group = true; 
export default handler;