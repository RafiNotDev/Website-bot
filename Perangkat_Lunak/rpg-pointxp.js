let handler = async (m, { conn, args }) => {
  let user = global.db.data.users[m.sender];
  if (!user) throw "Data pengguna tidak ditemukan. Pastikan Anda terdaftar!";

  // Periksa argumen
  if (!args[0]) return replyt("Gunakan format: `.expoint [type]|[jumlah]`\nContoh: `.expoint mana|1`", m.chat, m);
  const [type, jumlahStr] = args[0].split('|');
  if (!type || !jumlahStr) return replyt("Format salah. Gunakan format `.expoint [type]|[jumlah]\n\n*List Typ*\nmana\nhealth\nstamina`.", m.chat, m);

  let jumlah = parseInt(jumlahStr);
  if (isNaN(jumlah) || jumlah <= 0) return replyt("Jumlah harus berupa angka positif.", m.chat, m);

  // Daftar jenis poin yang dapat dibeli
  const validTypes = ['mana', 'health', 'stamina'];
  if (!validTypes.includes(type)) return replyt(`Tipe tidak valid. Pilih salah satu: ${validTypes.join(', ')}`, m.chat, m);

  // Harga per poin (ubah sesuai kebutuhan)
  const pricePerPoint = 100; // Harga per poin
  const totalCost = jumlah * pricePerPoint;

  // Periksa apakah pengguna memiliki cukup uang
  if (user.money < totalCost) {
    return replyt(`Uang kamu tidak cukup! Kamu butuh Rp ${new Intl.NumberFormat('id-ID').format(totalCost)} untuk membeli ${jumlah} ${type}.`, m.chat, m);
  }

  // Proses pembelian
  user.money -= totalCost;
  user[type] = (user[type] || 0) + jumlah;

  // Balasan berhasil
  replyt(`Pembelian berhasil! Kamu membeli ${jumlah} ${type} seharga Rp ${new Intl.NumberFormat('id-ID').format(totalCost)}.\nSaldo tersisa: Rp ${new Intl.NumberFormat('id-ID').format(user.money)}.`, m.chat, m);
};

handler.help = ['expoint'];
handler.tags = ['rpg','daftar'];
handler.command = /^expoint$/i;
handler.rpg = true
handler.group = true
handler.register = true
export default handler;