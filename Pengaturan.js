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
  tampilan: 'https://files.catbox.moe/85kvdh.jpg', sound: 'https://files.catbox.moe/bogzjh.mp3', websiteSound: process.env.WEBSITE_SOUND_URL || 'https://files.catbox.moe/bogzjh.mp3', websiteMusic: WEBSITE_MUSIC_URL, video: '', fotopp: '', idch: '120363421697084045@newsletter', namach: 'Mohon Ikuti Saluran', linkch: '', linkgc: '',
  instagram: '', tiktok: '', website: ''
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
// Dashboard saves atomically via rename; polling also catches replacement of the JSON inode.
let lastSignature = '';
function reloadIfChanged() {
  try {
    const stat = fs.statSync(dbPath);
    const signature = `${stat.mtimeMs}:${stat.size}`;
    if (signature === lastSignature) return;
    lastSignature = signature;
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    if (db.bots?.[botId]?.settings) applySettings(db.bots[botId].settings);
  } catch (error) {
    if (error.code !== 'ENOENT') console.warn('[Rafibot] Gagal memuat ulang konfigurasi:', error.message);
  }
}
setInterval(reloadIfChanged, 1200).unref?.();
