let handler = async (m, { conn, args, command }) => {
  let type = (args[0] || '').toLowerCase();
  let user = global.db.data.users[m.sender];

  // Pastikan semua properti user terdefinisi
  user.pickaxe = user.pickaxe || 0;
  user.pedang = user.pedang || 0;
  user.fishingrod = user.fishingrod || 0;
  user.pickaxedurability = user.pickaxedurability || 100;
  user.sworddurability = user.sworddurability || 100;
  user.armordurability = user.armordurability || 100;
  user.diamond = user.diamond || 0;
  user.rock = user.rock || 0;
  user.wood = user.wood || 0;
  user.iron = user.iron || 0;

  let repairMenu = `
*「 REPAIR 」*
▧ *Pickaxe* 
〉 5 Kayu, 3 Batu, 3 Iron, 1 Diamond
▧ *Sword* 
〉 5 Kayu, 9 Iron, 1 Diamond
▧ *Armor* 
〉 15 Iron, 3 Diamond
Gunakan: *repair <item>*`;

  try {
    if (/repair/i.test(command)) {
      switch (type) {
        case 'pickaxe':
          if (user.pickaxedurability >= 100) return replyt('Pickaxe kamu tidak memiliki kerusakan.', m.chat, m);
          if (user.pickaxe === 0) return replyt('Kamu belum memiliki Pickaxe.', m.chat, m);
          if (user.diamond < 1 || user.rock < 3 || user.wood < 5 || user.iron < 3) 
            return replyt('Bahan tidak cukup untuk memperbaiki Pickaxe.', m.chat, m);
          user.rock -= 3;
          user.wood -= 5;
          user.iron -= 3;
          user.diamond -= 1;
          user.pickaxedurability = 100;
          replyt('Pickaxe berhasil diperbaiki.', m.chat, m);
          break;

        case 'sword':
          if (user.sworddurability >= 100) return replyt('Sword kamu tidak memiliki kerusakan.', m.chat, m);
          if (user.pedang === 0) return replyt('Kamu belum memiliki Sword.', m.chat, m);
          if (user.diamond < 1 || user.wood < 5 || user.iron < 9) 
            return replyt('Bahan tidak cukup untuk memperbaiki Sword.', m.chat, m);
          user.wood -= 5;
          user.iron -= 9;
          user.diamond -= 1;
          user.sworddurability = 100;
          replyt('Sword berhasil diperbaiki.', m.chat, m);
          break;

        case 'armor':
          if (user.armordurability >= 100) return replyt('Armor kamu tidak memiliki kerusakan.', m.chat, m);
          if (!user.armor) return replyt('Kamu belum memiliki Armor.', m.chat, m);
          if (user.diamond < 3 || user.iron < 15) 
            return replyt('Bahan tidak cukup untuk memperbaiki Armor.', m.chat, m);
          user.iron -= 15;
          user.diamond -= 3;
          user.armordurability = 100;
          replyt('Armor berhasil diperbaiki.', m.chat, m);
          break;

        default:
          replyt(repairMenu, m.chat, m);
      }
    }
  } catch (err) {
    replyt("Terjadi kesalahan: " + err.message, m.chat, m);
  }
};

handler.help = ['repair'];
handler.tags = ['rpg','daftar'];
handler.command = /^(repair)$/i;
handler.group = true
handler.register = true
handler.rpg = true
export default handler;