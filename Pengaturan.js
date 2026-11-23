import fs from 'node:fs';
import path from 'node:path';
import fetch from 'node-fetch';

// Kredensial Cloudflare AI — ubah nilai ini langsung di server tanpa mengubah kode dashboard.
// Jangan pernah mengirim nilai ini ke browser atau memasukkannya ke repositori publik.
export const META_AI_API_KEY = 'GxCXqOSv2L4eoKHplnB0KQhIAqV6W7NxhZDd-9ua';
export const META_AI_ACCOUNT_ID = 'cfbbfe078c8b87485795f14f47927bd9';
export const WEBSITE_MUSIC_URL = 'https://files.catbox.moe/reqdt0.opus';
// Tautan media sosial developer yang tampil pada footer dashboard.
export const DEVELOPER_LINKS = {
  whatsapp: 'https://wa.me/6288279166081', // contoh: https://wa.me/6281234567890
  tiktok: 'https://www.tiktok.com/@rfrdnap', // contoh: https://www.tiktok.com/@username
  instagram: 'https://www.instagram.com/rfrdnap', // contoh: https://www.instagram.com/username,
  github: 'https://github.com/RafiNotDev'
};


const botId = process.env.BOT_ID || 'primary';
const dbPath = path.resolve('./Cache/Database/dashboard.json');
const defaults = {
  prefix: '.', namabot: 'Nama Bot', namaowner: 'Nama Owner', bot: '', owner: '', daerah: 'Jakarta',
  tampilan: 'https://files.catbox.moe/85kvdh.jpg', sound: 'https://files.catbox.moe/bogzjh.mp3', websiteSound: process.env.WEBSITE_SOUND_URL || 'https://files.catbox.moe/bogzjh.mp3', websiteMusic: WEBSITE_MUSIC_URL, video: '', fotopp: '', idch: '120363421697084045@newsletter', namach: 'Mohon Ikuti Saluran', linkch: '', linkgc: '', tokenvercel: '', instagram: '', tiktok: '', website: '',
  panelDomain: 'https://', ptla: 'ptla_', ptlc: 'ptlc_', linkgroup: 'https://', akhiran: '@RAFIHACKER',
  paymentQris: '', paymentDana: '088279166081', paymentOvo: 'tidak ada', paymentGopay: 'tidak ada',
  pakasirProject: 'payment-by-rafihacker', pakasirApikey: 'yneAJfVaZxR9PHuSxCmwXNsf86PIOdK3'
};

function readBotSettings() {
  try {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return { ...defaults, ...(db.bots?.[botId]?.settings || {}) };
  } catch (error) {
    console.warn('[Rafibot] Pengaturan database belum tersedia, memakai nilai aman.', error.message);
    return { ...defaults };
  }
}
const datadeveloper = await fetch('https://raw.githubusercontent.com/RafiNotDev/DatabaseBot/refs/heads/main/Database.json');
const dev = await datadeveloper.json();

function applySettings(next) {
  const cfg = { ...defaults, ...next };
  global.setting = Object.assign(global.setting || {}, cfg);
  global.daerah = cfg.daerah || 'Jakarta';
  // Pengaturan panel (per bot)
  global.domain = cfg.panelDomain || 'https://';
  global.ptla = cfg.ptla || 'ptla_';
  global.ptlc = cfg.ptlc || 'ptlc_';
  global.linkgroup = cfg.linkgroup || 'https://';
  global.akhiran = cfg.akhiran || '@RAFIHACKER';
  // Pengaturan pembayaran (per bot)
  global.payment = {
    qris: cfg.paymentQris || '',
    dana: cfg.paymentDana || '088279166081',
    ovo: cfg.paymentOvo || 'tidak ada',
    gopay: cfg.paymentGopay || 'tidak ada'
  };
  global.pakasir = {
    project: cfg.pakasirProject || 'payment-by-rafihacker',
    apikey: cfg.pakasirApikey || ''
  };
  global.owner = cfg.owner ? [[String(cfg.owner).replace(/\D/g, ''), cfg.namaowner, true]] : [];
  global.developer = {
  nama: dev.nama,
  nomor: dev.nomor,
  channel: dev.channel,
  instagram: dev.instagram,
  tiktok: dev.tiktok,
  telegram: dev.telegram
}
global.nodev = global.developer.nomor
  global.wm = 'Nama Bot: ' + String(cfg.namabot);
  global.author = 'Developer Bot: ' + global.developer.nomor
  global.stickpack = 'Nama Bot: ' + String(cfg.namabot);
  global.stickauth = 'Developer Bot: ' + global.developer.nomor;
  
  global.rpg = {
	emoticon(string) {
		string = string.toLowerCase()
		let emot = {
			level: '🧬',
			limit: '🌌',
			health: '❤️',
			exp: '✉️',
			money: '💵',
			potion: '🥤',
			diamond: '💎',
			common: '📦',
			uncommon: '🎁',
			mythic: '🗳️',
			legendary: '🗃️',
			pet: '🎁',
			trash: '🗑',
			armor: '🥼',
			sword: '⚔️',
			pickaxe: '⛏️',
			fishingrod: '🎣',
			bow: '🏹',
			wood: '🪵',
			rock: '🪨',
			string: '🕸️',
			horse: '🐎',
			cat: '🐈',
			dog: '🐕',
			fox: '🦊',
			wolf: '🐺',
			centaur: '🐎',
			phoenix: '🦜',
			dragon: '🐉',
			petfood: '🍖',
			iron: '⛓️',
			gold: '👑',
			emerald: '💚',
			bibitmangga: '🌾',
			bibitanggur: '🌾',
			bibitjeruk: '🌾',
			bibitpisang: '🌾',
			bibitapel: '🌾',
			mangga: '🥭',
			anggur: '🍇',
			jeruk: '🍊',
			pisang: '🍌',
			apel: '🍎',
			ayam: '🐔',
			kambing: '🐐',
			sapi: '🐄',
			kerbau: '🐃',
			babi: '🐖',
			harimau: '🐅',
			banteng: '🐂',
			monyet: '🐒',
			babihutan: '🐗',
			panda: '🐼',
			gajah: '🐘',
			buaya: '🐊',
			orca: '🐋',
			paus: '🐳',
			lumba: '🐬',
			hiu: '🦈',
			ikan: '🐟',
			lele: '🐟',
			bawal: '🐡',
			nila: '🐠',
			kepiting: '🦀',
			lobster: '🦞',
			gurita: '🐙',
			cumi: '🦑',
			udang: '🦐',
			steak: '🍝',
			sate: '🍢',
			rendang: '🍜',
			kornet: '🥣',
			nugget: '🍱',
			bluefin: '🍲',
			seafood: '🍛',
			sushi: '🍣',
			moluska: '🥘',
			squidprawm: '🍤',
			rumahsakit: '🏥',
			restoran: '🏭',
			pabrik: '🏯',
			tambang: '⚒️',
			pelabuhan: '🛳️'
		}
		let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
		if (!results.length) return ''
		else return emot[results[0][0]]
	}
}
  if (cfg.prefix) {
    const escaped = String(cfg.prefix).replace(/[|\\{}()[\]^$+*?.\-]/g, '\\$&');
    global.prefix = new RegExp('^[' + escaped + ']');
  }
  console.log(`[Rafibot] Konfigurasi bot ${botId} dimuat/diperbarui.`);
}

applySettings(readBotSettings());
// Pengaturan hanya diterapkan ulang ketika data bot pada database benar-benar berubah.
// Aktivitas website lain (chat, login, notifikasi, dll.) tidak memicu reload konfigurasi.
let lastSettingsSnapshot = JSON.stringify(readBotSettings());
let reloadTimer = null;

function reloadIfChanged() {
  try {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const savedSettings = db.bots?.[botId]?.settings;
    if (!savedSettings) return;

    const snapshot = JSON.stringify({ ...defaults, ...savedSettings });
    if (snapshot === lastSettingsSnapshot) return;

    lastSettingsSnapshot = snapshot;
    applySettings(savedSettings);
    console.log(`[Rafibot] Pengaturan bot ${botId} diperbarui setelah disimpan dari website.`);
  } catch (error) {
    if (error.code !== 'ENOENT') console.warn('[Rafibot] Gagal memuat ulang konfigurasi:', error.message);
  }
}

// Dashboard menyimpan database dengan file sementara lalu rename.
// Pantau folder database (bukan polling berkala), sehingga reload hanya berjalan
// setelah file database berubah. Perubahan non-pengaturan akan diabaikan oleh snapshot.
try {
  const configWatcher = fs.watch(path.dirname(dbPath), (eventType, filename) => {
    if (filename && String(filename) !== path.basename(dbPath)) return;
    if (reloadTimer) clearTimeout(reloadTimer);
    reloadTimer = setTimeout(reloadIfChanged, 180);
  });
  configWatcher.unref?.();
} catch (error) {
  console.warn('[Rafibot] Pemantauan perubahan pengaturan tidak tersedia:', error.message);
}
