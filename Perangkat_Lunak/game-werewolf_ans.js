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
} from '../Perangkat-Keras/Komponen/werewolf.js'

let handler = async (m, { conn, command, usedPrefix, args }) => {
    let { sender, chat } = m
    conn.werewolf = conn.werewolf ? conn.werewolf : {}
    let ww = conn.werewolf
    let value = (args[0] || '').toLowerCase()
    let target = args[1]

    if (playerOnGame(sender, ww) === false)
        return replyt("Kamu tidak dalam sesi game", m.chat, m)
    if (dataPlayer(sender, ww).status === true)
        return replyt("Skill telah digunakan, skill hanya bisa digunakan sekali setiap malam", m.chat, m)
    if (dataPlayer(sender, ww).isdead === true)
        return replyt("Kamu sudah mati", m.chat, m)
    if (!target || target.length < 1 || target.split('').length > 2) 
        return replyt(`Masukan nomor player \nContoh : \n${usedPrefix + command} kill 1`, m.chat, m)
    if (isNaN(target)) 
        return replyt("Gunakan hanya nomor", m.chat, m)
    let byId = getPlayerById2(sender, parseInt(target), ww)
    if (byId.db.isdead === true) 
        return replyt("Player sudah mati", m.chat, m)
    if (byId.db.id === sender)
        return replyt("Tidak bisa menggunakan skill untuk diri sendiri", m.chat, m)
    if (byId === false) 
        return replyt("Player tidak terdaftar", m.chat, m)
    if (/kill/i.test(value)) {
        if (!/werewolf|sorcerer/i.test(dataPlayer(sender, ww).role))
            return replyt("Peran ini bukan untuk kamu", m.chat, m)

            return replyt("Berhasil membunuh player " + parseInt(target), m.chat, m).then(() => {
                dataPlayer(sender, ww).status = true
                killWerewolf(sender, parseInt(target), ww)
            })
    } else if (/dreamy/i.test(value)) {
        if (!/seer/i.test(dataPlayer(sender, ww).role)) 
            return replyt("Peran ini bukan untuk kamu", m.chat, m)

        let dreamy = dreamySeer(sender, parseInt(target), ww)
        return replyt(`Berhasil membuka identitas player ${target} adalah ${dreamy}`, m.chat, m).then(() => {
                dataPlayer(sender, ww).status = true
        })
    } else if (/deff/i.test(value)) {
        if (!/guardian/i.test(dataPlayer(sender, ww).role)) 
            return replyt("Peran ini bukan untuk kamu", m.chat, m)

        return replyt(`Berhasil melindungi player ${target}`, m.chat, m).then(() => {
            protectGuardian(sender, parseInt(target), ww)
            dataPlayer(sender, ww).status = true
        })
    } else if (/sorcerer/i.test(value)) {
        if (!/sorcerer/i.test(dataPlayer(sender, ww).role)) 
            return replyt("Peran ini bukan untuk kamu", m.chat, m)

        let sorker = sorcerer(sender, parseInt(target), ww)
        return replyt(`Berhasil membuka identitas player ${target} adalah ${sorker}`, m.chat, m).then(() => {
            dataPlayer(sender, ww).status = true
        })
    }
}
handler.command = /^((ww|werewolf)pc)$/i
handler.private = true
handler.owner = false
handler.admin = false
export default handler