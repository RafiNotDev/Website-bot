const handler = async ( m, { conn, text, usedPrefix, command }) => {
    
    let q = m.quoted ? m.quoted : m
	let idch = setting.idch
	if (!q) return replyt('Reply Code Yang Bakal Di Upload Ke Saluran', m.chat, m)
	if(!idch) return replyt('Maaf Terjadi Error\nMungkin Id Saluran Belum Di Setting\nMohon Setting Dulu Id Salurannya😞', m.chat, m)
	if (!text) return replyt(`[❗] *Penggunaan Salah*\nKetik ${usedPrefix + command} Nama Fitur! Sambil Reply Code`, m.chat, m)
    try {
    await conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key }})
    let caption = `
// ##########################

// Fitur: ${text}.js
// Nama Developer: ${global.namadev}
// Info Saluran: ${setting.linkch}
// Code Di Bawah

// ##########################

${q.text}

// ##########################
// Sekian Dari Saya, Salam Hormat ${global.namadev}
`

    conn.sendMessage(idch, { text: caption 
    }, 
    { quoted: m }
    );
    
    } finally {
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }})
    replyt(`✅ Sukses mengirim Code ke channel!\nSilahkan Akses Link Berikut:\n${setting.linkch}`, m.chat, m)
    }
}

handler.tags = ['owner'];
handler.help = ['upcodech']
handler.command = /^(upcodech|upcdch|codech|cdch)$/i;
handler.owner = true;

export default handler