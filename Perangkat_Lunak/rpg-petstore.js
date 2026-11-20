let handler  = async (m, { conn, command, args, usedPrefix, DevMode }) => {
  let type = (args[0] || '').toLowerCase()
  let _type = (args[0] || '').toLowerCase()
  let user = global.db.data.users[m.sender]

  let hdog = 2
  let hcat = 2
  let hhorse = 4
  let hfox = 6
  let hrobo = 10

  let hlion = 10
  let hrhinoceros = 10
  let hdragon = 10
  let hcentaur = 10
  let hkyubi = 10
  let hgriffin = 10
  let hphonix = 10
  let hwolf = 10

  let logo = `— *P E T   S T O R E* —
▮▧▧▧▧▧▧▧▧▧▧▧▧▮`
  let caption = `
  B A S I C
🐈 *Cat:* ${hcat} 🔖
🐕 *Dog:* ${hdog} 🔖
🐎 *Horse:* ${hhorse} 🔖
🦊 *Fox:* ${hfox} 🔖
🤖 *Robo:* ${hrobo} 🔖

 L E G E N D A R Y
🐉 *Dragon:* ${hdragon} 🔖
🦁 *Lion:* ${hlion} 🔖
🦏 *Rhinoceros:* ${hrhinoceros} 🔖
🦄 *Centaur:* ${hcentaur} 🔖
🦊 *Kyubi:* ${hkyubi} 🔖
🦅 *Griffin:* ${hgriffin} 🔖
🔥 *Phoenix:* ${hphonix} 🔖
🐺 *Wolf:* ${hwolf} 🔖

〉 *ABILITY*
🐈 *Cat:* _Menambah Limit Money Sebanyak 4% Sesuai Dengan Level!_
🐕 *Dog:* _Mengurangi harga item di shop sebanyak 1% Meningkat sesuai level!_

〉 *Example*
${usedPrefix}adopt cat`.trim()

    if (/pet(store|shop)?|adopt/i.test(command)) {
      const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
        switch (type) {
          case 'cat':
          if (user.cat > 0) return replyt('Kamu sudah memilik ini', m.chat, m)
            if(user.pet < hcat) return replyt(`Pet Token anda kurang`, m.chat, m)
            user.pet -= hcat
            user.cat += 1
            replyt("Selamat anda mempunyai pet Baru ! 🎉", m.chat, m)
            break
          case 'dog':
          if (user.dog > 0) return replyt('Kamu sudah memilik ini', m.chat, m)
            if(user.pet < hdog) return replyt(`Pet Token anda kurang`, m.chat, m)
            user.pet -= hdog
            user.dog += 1
            replyt("Selamat anda mempunyai pet Baru ! 🎉", m.chat, m)
            break
          case 'fox':
          if (user.fox > 0) return replyt('Kamu sudah memilik ini', m.chat, m)
            if(user.pet < hfox) return replyt(`Pet Token anda kurang`, m.chat, m)
            user.pet -= hfox
            user.fox += 1
            replyt("Selamat anda mempunyai pet Baru ! 🎉", m.chat, m)
            break
          case 'horse':
          if (user.horse > 0) return replyt('Kamu sudah memilik ini', m.chat, m)
            if(user.pet < hhorse) return replyt(`Pet Token anda kurang`, m.chat, m)
            user.pet -= hhorse
            user.horse += 1
            replyt("Selamat anda mempunyai pet Baru ! 🎉", m.chat, m)
            break
          case 'robo':
          if (user.robo > 0) return replyt('Kamu sudah memilik ini', m.chat, m)
            if(user.pet < hrobo) return replyt(`Pet Token anda kurang`, m.chat, m)
            user.pet -= hrobo
            user.robo += 1
            replyt("Selamat anda mempunyai pet Baru ! 🎉", m.chat, m)
            break
            case 'lion':
          if (user.lion > 0) return replyt('Kamu sudah memilik ini', m.chat, m)
            if(user.pet < hlion) return replyt(`Pet Token anda kurang`, m.chat, m)
            user.pet -= hlion
            user.lion += 1
            replyt("Selamat anda mempunyai pet Baru ! 🎉", m.chat, m)
            break
            case 'rhinoceros':
          if (user.rhinoceros > 0) return replyt('Kamu sudah memilik ini', m.chat, m)
            if(user.pet < hrhinoceros) return replyt(`Pet Token anda kurang`, m.chat, m)
            user.pet -= hrhinoceros
            user.rhinoceros += 1
            replyt("Selamat anda mempunyai pet Baru ! 🎉", m.chat, m)
            break
            case 'dragon':
          if (user.dragon > 0) return replyt('Kamu sudah memilik ini', m.chat, m)
            if(user.pet < hdragon) return replyt(`Pet Token anda kurang`, m.chat, m)
            user.pet -= hdragon
            user.dragon += 1
            replyt("Selamat anda mempunyai pet Baru ! 🎉", m.chat, m)
            break
            case 'centaur':
          if (user.centaur > 0) return replyt('Kamu sudah memilik ini', m.chat, m)
            if(user.pet < hcentaur) return replyt(`Pet Token anda kurang`, m.chat, m)
            user.pet -= hcentaur
            user.centaur += 1
            replyt("Selamat anda mempunyai pet Baru ! 🎉", m.chat, m)
            break
            case 'kyubi':
          if (user.kyubi > 0) return replyt('Kamu sudah memilik ini', m.chat, m)
            if(user.pet < hkyubi) return replyt(`Pet Token anda kurang`, m.chat, m)
            user.pet -= hkyubi
            user.kyubi += 1
            replyt("Selamat anda mempunyai pet Baru ! 🎉", m.chat, m)
            break
            case 'griffin':
          if (user.griffin > 0) return replyt('Kamu sudah memilik ini', m.chat, m)
            if(user.pet < hgriffin) return replyt(`Pet Token anda kurang`, m.chat, m)
            user.pet -= hgriffin
            user.griffin += 1
            replyt("Selamat anda mempunyai pet Baru ! 🎉", m.chat, m)
            break
            case 'phoenix':
          if (user.phonix > 0) return replyt('Kamu sudah memilik ini', m.chat, m)
            if(user.pet < hphonix) return replyt(`Pet Token anda kurang`, m.chat, m)
            user.pet -= hphonix
            user.phonix += 1
            replyt("Selamat anda mempunyai pet Baru ! 🎉", m.chat, m)
            break
            case 'wolf':
          if (user.wolf > 0) return replyt('Kamu sudah memilik ini', m.chat, m)
            if(user.pet < hwolf) return replyt(`Pet Token anda kurang`, m.chat, m)
            user.pet -= hwolf
            user.wolf += 1
            replyt("Selamat anda mempunyai pet Baru ! 🎉", m.chat, m)
            break
            
          default:
              return await replyt(`${logo}\n${caption}`, m.chat, m)
        }
    } 
}

handler.help = ['petshop']
handler.tags = ['rpg']
handler.command = /^(pet(shop|store)?|adopt)/i
handler.register = true
handler.group = true
handler.rpg = true
export default handler