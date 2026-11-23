import jimp from "jimp"
const delay = time => new Promise(res => setTimeout(res, time))

let resize = async (image, width, height) => {
    let read = await jimp.read(image)
    let data = await read.resize(width, height).getBufferAsync(jimp.MIME_JPEG)
    return data
}

import {
    emoji_role,
    sesi,
    playerOnGame,
    playerOnRoom,
    playerExit,
    dataPlayer,
    dataPlayerById,
    getPlayerById,
    getPlayerById2,
    killWerewolf,
    killww,
    dreamySeer,
    sorcerer,
    protectGuardian,
    roleShuffle,
    roleChanger,
    roleAmount,
    roleGenerator,
    addTimer,
    startGame,
    playerHidup,
    playerMati,
    vote,
    voteResult,
    clearAllVote,
    getWinner,
    win,
    pagi,
    malam,
    skill,
    voteStart,
    voteDone,
    voting,
    run,
    run_vote,
    run_malam,
    run_pagi
} from '../Perangkat_Keras/Komponen/werewolf.js'

// [ Thumbnail ]
let thumb =
    "https://raw.githubusercontent.com/RafiNotDev/DatabaseBot/main/uploads/1794849662954-rafibot-1794849662954.jpg"

let handler = async (m, { conn, command, usedPrefix, args }) => {
    let { sender, chat } = m
    conn.werewolf = conn.werewolf ? conn.werewolf : {}
    let ww = conn.werewolf
    let data = ww[chat]
    let value = args[0]
    let target = args[1]

    // [ Membuat Room ]
    if (value === "create") {
        if (chat in ww) return replyt("Group masih dalam sesi permainan", m.chat, m)
        if (playerOnGame(sender, ww) === true)
            return replyt("Kamu masih dalam sesi game", m.chat, m)
        ww[chat] = {
            room: chat,
            owner: sender,
            status: false,
            iswin: null,
            cooldown: null,
            day: 0,
            time: "malem",
            player: [],
            dead: [],
            voting: false,
            seer: false,
            guardian: [],
        }
        await replyt("Room berhasil dibuat, ketik *.ww join* untuk bergabung", m.chat, m)

        // [ Join sesi permainan ]
    } else if (value === "join") {
        if (!ww[chat]) return replyt("Belum ada sesi permainan", m.chat, m)
        if (ww[chat].status === true)
            return replyt("Sesi permainan sudah dimulai", m.chat, m)
        if (ww[chat].player.length > 16)
            return replyt("Maaf jumlah player telah penuh", m.chat, m)
        if (playerOnRoom(sender, chat, ww) === true)
            return replyt("Kamu sudah join dalam room ini", m.chat, m)
        if (playerOnGame(sender, ww) === true)
            return replyt("Kamu masih dalam sesi game", m.chat, m)
        let data = {
            id: sender,
            number: ww[chat].player.length + 1,
            sesi: chat,
            status: false,
            role: false,
            effect: [],
            vote: 0,
            isdead: false,
            isvote: false,
        }
        ww[chat].player.push(data)
        let player = []
        let tulisan = `\n*⌂ W E R E W O L F - P L A Y E R*\n\n`
        for (let i = 0; i < ww[chat].player.length; i++) {
            tulisan += `${ww[chat].player[i].number}) @${ww[chat].player[i].id.replace("@s.whatsapp.net","")}\n`
            player.push(ww[chat].player[i].id)
        }
        tulisan += "\nJumlah player minimal adalah 5 dan maximal 15"
        conn.sendMessage(m.chat, {
  image: {url: thumb},
  caption: tulisan,
  footer: '',
  buttons: [
  {
    buttonId: 'action',
    buttonText: {
      displayText: 'ini pesan interactiveMeta'
    },
    type: 4,
    nativeFlowInfo: {
      name: 'single_select',
      paramsJson: JSON.stringify({
        title: 'WEREWOLF STARTUP',
        sections: [
          {
            title: 'Werewolf Startup',
            highlight_label: '🗿',
            rows: [
              {
                header: 'MULAI GAME',
                title: 'Mulai Game',
                description: 'Starting Game...',
                id: '.ww start',
              },
              {
                header: 'KELUAR DALAM GAME',
                title: 'Keluar Dalam Game',
                description: 'Proses Keluar...',
                id: '.ww.exit',
              },
              {
                header: 'HAPUS SESI GAME',
                title: 'Hapus Sesi Game',
                description: 'Menghapus Sesi Game...',
                id: '.ww delete',
              },
              {
                header: 'DAFTAR PEMAIN',
                title: 'Daftar Pemain',
                description: 'Mengakses Data Pemain...',
                id: '.ww player',
              },
            ],
          },
        ],
      }),
    },
  },
  ],
  headerType: 1,
  viewOnce: true
}, { quoted: m })

        // [ Game Play ]
    } else if (value === "start") {
        if (!ww[chat]) return replyt("Belum ada sesi permainan", m.chat, m)
        if (ww[chat].player.length === 0)
            return replyt("Room belum memiliki player", m.chat, m)
        if (ww[chat].player.length < 5)
            return replyt("Maaf jumlah player belum memenuhi syarat", m.chat, m)
        if (playerOnRoom(sender, chat, ww) === false)
            return replyt("Kamu belum join dalam room ini", m.chat, m)
        if (ww[chat].cooldown > 0) {
            if (ww[chat].time === "voting") {
                clearAllVote(chat, ww)
                addTimer(chat, ww)
                return await run_vote(conn, chat, ww)
            } else if (ww[chat].time === "malem") {
                clearAllVote(chat, ww)
                addTimer(chat, ww)
                return await run_malam(conn, chat, ww)
            } else if (ww[chat].time === "pagi") {
                clearAllVote(chat, ww)
                addTimer(chat, ww)
                return await run_pagi(conn, chat, ww)
            }
        }
        if (ww[chat].status === true)
            return replyt("Sesi permainan telah dimulai", m.chat, m)
        if (ww[chat].owner !== sender)
            return m.reply(`Hanya @${ww[chat].owner.split("@")[0]} yang dapat memulai permainan`, false, { mentions: [ww[chat].owner] })
        let list1 = ""
        let list2 = ""
        let player = []
        roleGenerator(chat, ww)
        addTimer(chat, ww)
        startGame(chat, ww)
        for (let i = 0; i < ww[chat].player.length; i++) {
            list1 += `(${ww[chat].player[i].number}) @${ww[chat].player[i].id.replace("@s.whatsapp.net", "")}\n`
            player.push(ww[chat].player[i].id)
        }
        for (let i = 0; i < ww[chat].player.length; i++) {
            list2 += `(${ww[chat].player[i].number}) @${ww[chat].player[i].id.replace("@s.whatsapp.net", "")} ${ww[chat].player[i].role === "werewolf" || ww[chat].player[i].role === "sorcerer" ? `[${ww[chat].player[i].role}]` : ""}\n`
            player.push(ww[chat].player[i].id)
        }
        await replygambar("*⌂ W E R E W O L F - G A M E*\n\nGame telah dimulai, para player akan memerankan perannya masing masing, silahkan cek chat pribadi untuk melihat role kalian. Berhati-hatilah para warga, mungkin malam ini adalah malah terakhir untukmu", 'W E R E - W O L F', '', m.chat, m, thumb)
        for (let i = 0; i < ww[chat].player.length; i++) {
            // [ Werewolf ]
            if (ww[chat].player[i].role === "werewolf") {
                if (ww[chat].player[i].isdead != true) {
                    var text = `Hai ${conn.getName(ww[chat].player[i].id)}, Kamu telah dipilih untuk memerankan *Werewolf* ${emoji_role("werewolf")} pada permainan kali ini, silahkan pilih salah satu player yang ingin kamu makan pada malam hari ini\n*LIST PLAYER*:\n${list2}\n\nKetik *.wwpc kill nomor* untuk membunuh player`
                    await conn.sendMessage(ww[chat].player[i].id, {
                        text: text,
                        mentions: player,
                    })
                }

                // [ villager ]
            } else if (ww[chat].player[i].role === "warga") {
                if (ww[chat].player[i].isdead != true) {
                    let text = `*⌂ W E R E W O L F - G A M E*\n\nHai ${conn.getName(ww[chat].player[i].id)} Peran kamu adalah *Warga Desa* ${emoji_role("warga")}, tetap waspada, mungkin *Werewolf* akan memakanmu malam ini, silakan masuk kerumah masing masing.\n*LIST PLAYER*:\n${list1}`
                    await conn.sendMessage(ww[chat].player[i].id, {
                        text: text,
                        mentions: player,
                    })
                }

                // [ Penerawangan ]
            } else if (ww[chat].player[i].role === "seer") {
                if (ww[chat].player[i].isdead != true) {
                    let text = `Hai ${conn.getName(ww[chat].player[i].id)} Kamu telah terpilih  untuk menjadi *Penerawang* ${emoji_role("seer")}. Dengan sihir yang kamu punya, kamu bisa mengetahui peran pemain pilihanmu.\n*LIST PLAYER*:\n${list1}\n\nKetik *.wwpc dreamy nomor* untuk melihat role player`
                    await conn.sendMessage(ww[chat].player[i].id, {
                        text: text,
                        mentions: player,
                    })
                }

                // [ Guardian ]
            } else if (ww[chat].player[i].role === "guardian") {
                if (ww[chat].player[i].isdead != true) {
                    let text = `Hai ${conn.getName(ww[chat].player[i].id)} Kamu terpilih untuk memerankan *Malaikat Pelindung* ${emoji_role("guardian")}, dengan kekuatan yang kamu miliki, kamu bisa melindungi para warga, silahkan pilih salah 1 player yang ingin kamu lindungi\n*LIST PLAYER*:\n${list1}\n\nKetik *.wwpc deff nomor* untuk melindungi player`
                    await conn.sendMessage(ww[chat].player[i].id, {
                        text: text,
                        mentions: player,
                    })
                }

                // [ Sorcerer ]
            } else if (ww[chat].player[i].role === "sorcerer") {
                if (ww[chat].player[i].isdead != true) {
                    let text = `Hai ${conn.getName(ww[chat].player[i].id)} Kamu terpilih sebagai Penyihir ${emoji_role("sorcerer")}, dengan kekuasaan yang kamu punya, kamu bisa membuka identitas para player, silakan pilih 1 orang yang ingin kamu buka identitasnya\n*LIST PLAYER*:\n${list2}\n\nKetik *.wwpc sorcerer nomor* untuk melihat role player`
                    await conn.sendMessage(ww[chat].player[i].id, {
                        text: text,
                        mentions: player,
                    })
                }
            }

            await delay(1500)
        }
        await run(conn, chat, ww)
    } else if (value === "vote") {
        if (!ww[chat]) 
            return replyt("Belum ada sesi permainan", m.chat, m)
        if (ww[chat].status === false)
            return replyt("Sesi permainan belum dimulai", m.chat, m)
        if (ww[chat].time !== "voting")
            return replyt("Sesi voting belum dimulai", m.chat, m)
        if (playerOnRoom(sender, chat, ww) === false)
            return replyt("Kamu bukan player", m.chat, m)
        if (dataPlayer(sender, ww).isdead === true)
            return replyt("Kamu sudah mati", m.chat, m)
        if (!target || target.length < 1 || target.split('').length > 2)
            return replyt("Masukan nomor player", m.chat, m)
        if (isNaN(target)) return replyt("Gunakan hanya nomor", m.chat, m)
        if (dataPlayer(sender, ww).isvote === true)
            return replyt("Kamu sudah melakukan voting", m.chat, m)
        let byId = getPlayerById2(sender, parseInt(target), ww)
        if (byId.db.isdead === true) 
            return replyt("Player sudah mati", m.chat, m)
        if (ww[chat].player.length < parseInt(target))
            return replyt("Invalid", m.chat, m)
        if (getPlayerById(chat, sender, parseInt(target), ww) === false)
            return replyt("Player tidak terdaftar!", m.chat, m)
        vote(chat, parseInt(target), sender, ww)
        return replyt("✅ Vote", m.chat, m)
    } else if (value == "exit") {
        if (!ww[chat]) return replyt("Tidak ada sesi permainan", m.chat, m)
        if (playerOnRoom(sender, chat, ww) === false)
            return replyt("Kamu tidak dalam sesi permainan", m.chat, m)
        if (ww[chat].status === true)
            return replyt("Permainan sudah dimulai, kamu tidak bisa keluar", m.chat, m)
        m.reply(`@${sender.split("@")[0]} Keluar dari permainan`, false, { mentions: [sender] })
        playerExit(chat, sender, ww)
    } else if (value === "delete") {
        if (!ww[chat]) return replyt("Tidak ada sesi permainan", m.chat, m)
        if (ww[chat].owner !== sender)
            return replyt(`Hanya @${ww[chat].owner.split("@")[0]} yang dapat menghapus sesi permainan ini`, m.chat, m)
        replyt("Sesi permainan berhasil dihapus", m.chat, m).then(() => {
            delete ww[chat]
        })
    } else if (value === "player") {
        if (!ww[chat]) return replyt("Tidak ada sesi permainan", m.chat, m)
        if (playerOnRoom(sender, chat, ww) === false)
            return replyt("Kamu tidak dalam sesi permainan", m.chat, m)
        if (ww[chat].player.length === 0)
            return replyt("Sesi permainan belum memiliki player", m.chat, m)
        let player = []
        let text = "\n*⌂ W E R E W O L F - G A M E*\n\nLIST PLAYER:\n"
        for (let i = 0; i < ww[chat].player.length; i++) {
            text += `(${ww[chat].player[i].number}) @${ww[chat].player[i].id.replace("@s.whatsapp.net", "")} ${ww[chat].player[i].isdead === true ? `☠️ ${ww[chat].player[i].role}` : "" }\n`
            player.push(ww[chat].player[i].id)
        }
        conn.sendMessage(m.chat, {
  image: {url: thumb},
  caption: text,
  footer: '',
  buttons: [
  {
    buttonId: 'action',
    buttonText: {
      displayText: 'ini pesan interactiveMeta'
    },
    type: 4,
    nativeFlowInfo: {
      name: 'single_select',
      paramsJson: JSON.stringify({
        title: 'WEREWOLF STARTUP',
        sections: [
          {
            title: 'Werewolf Startup',
            highlight_label: '🗿',
            rows: [
              {
                header: 'BUAT SESI GAME',
                title: 'Buat Sesi Game',
                description: 'Membuat Sesi Game...',
                id: '.ww create',
              },
              {
                header: 'BERGABUNG DALAM GAME',
                title: 'Bergabung Dalam Game',
                description: 'Memasukan Kedalam Database',
                id: '.ww join',
              },
              {
                header: 'MULAI GAME',
                title: 'Mulai Game',
                description: 'Starting Game...',
                id: '.ww start',
              },
              {
                header: 'KELUAR DALAM GAME',
                title: 'Keluar Dalam Game',
                description: 'Proses Keluar...',
                id: '.ww.exit',
              },
              {
                header: 'HAPUS SESI GAME',
                title: 'Hapus Sesi Game',
                description: 'Menghapus Sesi Game...',
                id: '.ww delete',
              },
              {
                header: 'DAFTAR PEMAIN',
                title: 'Daftar Pemain',
                description: 'Mengakses Data Pemain...',
                id: '.ww player',
              },
            ],
          },
        ],
      }),
    },
  },
  ],
  headerType: 1,
  viewOnce: true
}, { quoted: m })
    } else {
        let text = `\n*⌂ W E R E W O L F - G A M E*\n\nPermainan Sosial Yang Berlangsung Dalam Beberapa Putaran/ronde. Para Pemain Dituntut Untuk Mencari Seorang Penjahat Yang Ada Dipermainan. Para Pemain Diberi Waktu, Peran, Serta Kemampuannya Masing-masing Untuk Bermain Permainan Ini\n\n*⌂ C O M M A N D*\n`
        text += `\nPermainan ini dapat dimainkan oleh 5 sampai 15 orang.`.trim()
        conn.sendMessage(m.chat, {
  image: {url: thumb },
  caption: text,
  footer: '',
  buttons: [
  {
    buttonId: 'action',
    buttonText: {
      displayText: 'ini pesan interactiveMeta'
    },
    type: 4,
    nativeFlowInfo: {
      name: 'single_select',
      paramsJson: JSON.stringify({
        title: 'WEREWOLF STARTUP',
        sections: [
          {
            title: 'Werewolf Startup',
            highlight_label: '🗿',
            rows: [
              {
                header: 'BUAT SESI GAME',
                title: 'Buat Sesi Game',
                description: 'Membuat Sesi Game...',
                id: '.ww create',
              },
              {
                header: 'BERGABUNG DALAM GAME',
                title: 'Bergabung Dalam Game',
                description: 'Memasukan Kedalam Database',
                id: '.ww join',
              },
              {
                header: 'MULAI GAME',
                title: 'Mulai Game',
                description: 'Starting Game...',
                id: '.ww start',
              },
              {
                header: 'KELUAR DALAM GAME',
                title: 'Keluar Dalam Game',
                description: 'Proses Keluar...',
                id: '.ww.exit',
              },
              {
                header: 'HAPUS SESI GAME',
                title: 'Hapus Sesi Game',
                description: 'Menghapus Sesi Game...',
                id: '.ww delete',
              },
              {
                header: 'DAFTAR PEMAIN',
                title: 'Daftar Pemain',
                description: 'Mengakses Data Pemain...',
                id: '.ww player',
              },
            ],
          },
        ],
      }),
    },
  },
  ],
  headerType: 1,
  viewOnce: true
}, { quoted: m })
    }
}
handler.help = ['werewolf']
handler.tags = ['game']
handler.command = /^(werewolf|ww)$/i
handler.group = true
handler.owner = false
handler.game = true
handler.admin = false
export default handler