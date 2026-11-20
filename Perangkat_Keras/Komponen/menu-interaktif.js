const menuCommands = {
  rafi: 'allmenu', ai: 'aimenu', audio: 'menuaudio', bug: 'menubug', store: 'store',
  xp: 'menuexp', adminowner: 'menuadminowner', cpanel: 'menucpanel',
  downloader: 'menudownloader', game: 'menugame', rpg: 'menurpg',
  group: 'menugroup', fun: 'menuhavefun', info: 'menuinfo', owner: 'menuowner',
  quotes: 'menuquotes', sticker: 'menusticker', tools: 'menutools'
};
const clean = value => String(value ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, 72);

/** Kirim daftar pilihan WhatsApp interaktif. Teks menu tetap disertakan sebagai fallback. */
export async function sendInteractiveMenu({ conn, m, usedPrefix = '.', tag, tags = {}, text = '', title = 'Rafibot Menu', description = 'Pilih menu atau fitur yang ingin dibuka.' }) {
  const keys = Object.keys(tags || {});
  const categoryMode = !tag && keys.length > 1;
  let rows = [];
  if (categoryMode) {
    rows = keys.slice(0, 10).map(key => ({
      title: clean(tags[key] || key).slice(0, 24),
      description: `Buka ${clean(tags[key] || key)}`,
      rowId: `${usedPrefix}${menuCommands[key] || `menu${key}`}`
    }));
  } else {
    const wanted = tag || keys[0];
    const plugins = Object.values(global.Tools || {}).filter(plugin => !plugin.disabled && plugin.help && (Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags]).includes(wanted));
    const seen = new Set();
    for (const plugin of plugins) {
      for (const command of (Array.isArray(plugin.help) ? plugin.help : [plugin.help])) {
        const cmd = clean(command).replace(/^\/+/, '');
        const id = `${usedPrefix}${cmd}`;
        if (!cmd || seen.has(id)) continue;
        seen.add(id);
        rows.push({ title: cmd.slice(0, 24), description: clean(plugin.limit ? 'Menggunakan limit' : plugin.premium ? 'Fitur premium' : 'Jalankan fitur ini'), rowId: id });
        if (rows.length >= 10) break;
      }
      if (rows.length >= 10) break;
    }
  }
  if (!rows.length) rows = [{ title: 'Menu utama', description: 'Kembali ke daftar menu', rowId: `${usedPrefix}allmenu` }];
  const body = clean(description) + (text ? `\n\n${String(text).slice(0, 3500)}` : '');
  const interactive = {
    text: body,
    footer: 'Rafibot • Pilih salah satu untuk melanjutkan',
    title: clean(title).slice(0, 60),
    buttonText: categoryMode ? 'Lihat kategori' : 'Pilih fitur',
    sections: [{ title: categoryMode ? 'Kategori menu' : 'Daftar fitur (maks. 10 pilihan)', rows }]
  };
  try { return await conn.sendMessage(m.chat, interactive, { quoted: m }); }
  catch (error) {
    console.warn('[MENU] List interaktif tidak didukung, memakai teks biasa:', error.message);
    return conn.sendMessage(m.chat, { text: body }, { quoted: m });
  }
}
