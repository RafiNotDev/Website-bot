import "../Pengaturan.js";
import { smsg } from './Komponen/simple.js'
import { sticker } from './Komponen/sticker.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile, readFileSync } from 'fs'
import fs from 'fs'
import chalk from 'chalk'
import moment from "moment-timezone";
import fetch from 'node-fetch'
import axios from 'axios'
import yts from 'yt-search'
global.get_axios = axios
global.ytss = yts
global.get_fetch = fetch
/**
 * @type {import('@adiwajshing/baileys')}
 */
const { proto } = (await import('@adiwajshing/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))

/**
 * Handle messages upsert
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['messages.upsert']} groupsUpdate 
 */

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate)
        return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m)
        return
    if (global.db.data == null)
        await global.loadDatabase()
        
const conn = this;

if (!conn?.user?.jid) {
    console.error('[CHIPSET] Koneksi WhatsApp belum siap.');
    return;
}

if (
    global.conn?.user?.jid &&
    global.conn.user.jid !== conn.user.jid
) return
    try {
// Normalisasi seluruh JID LID sebelum serialisasi pesan
// Simpan pasangan LID ke PN untuk SEMUA mention
const lidToPn = new Map()

async function resolveAllMentions(message) {
    const visited = new WeakSet()

    async function walk(obj) {
        if (!obj || typeof obj !== 'object' || visited.has(obj)) return
        visited.add(obj)

        if (obj.contextInfo?.mentionedJid) {
            const mentions = obj.contextInfo.mentionedJid

            obj.contextInfo.mentionedJid = await Promise.all(
                mentions.map(async (jid) => {
                    if (typeof jid !== 'string' || !jid.endsWith('@lid')) {
                        return jid
                    }

                    try {
                        const pn = await this.getJidAsync(jid)

                        if (pn && pn.endsWith('@s.whatsapp.net')) {
                            lidToPn.set(jid, pn)
                            return pn
                        }
                    } catch (e) {
                        console.error('[MENTION LID]', jid, e)
                    }

                    return jid
                })
            )
        }

        for (const value of Object.values(obj)) {
            await walk.call(this, value)
        }
    }

    await walk.call(this, message)
}

try {
    await resolveAllMentions.call(this, m.message)
} catch (e) {
    console.error('[RESOLVE ALL MENTIONS]', e)
}

m = smsg(this, m) || m

// Sesuaikan teks seluruh mention yang berhasil dikonversi
if (typeof m.text === 'string') {
    let text = m.text

    for (const [lid, pn] of lidToPn) {
        text = text.split('@' + lid.split('@')[0])
                   .join('@' + pn.split('@')[0])
    }

    if (text !== m.text) m.text = text
}
console.log('TEXT:', m.text)
console.log('MENTION:', m.msg?.contextInfo?.mentionedJid)
console.log('MAPPING:', await Promise.all(
    (m.msg?.contextInfo?.mentionedJid || []).map(async jid => ({
        original: jid,
        converted: await this.getJidAsync?.(jid)
    }))
))
        m.exp = 0
        m.limit = false
        if(m.isBaileys) return
        if (global.autotyping && typeof this.sendPresenceUpdate === 'function') {
  this.sendPresenceUpdate('composing', m.chat).catch(console.error)
}
if (global.autorecording && typeof this.sendPresenceUpdate === 'function') {
  this.sendPresenceUpdate('recording', m.chat).catch(console.error)
}
    // Pengambilan Database Pengguna Dan Bot
        try {
            let user = global.db.data.users[m.sender];
      if (typeof user !== "object") {
        global.db.data.users[m.sender] = {};
      }
      if (user) {
        if (!("afkReason" in user)) {
          user.afkReason = "";
        }
        if (!("autolevelup" in user)) {
          user.autolevelup = false;
        }
        if (!("pasangan" in user)) {
          user.pasangan = "";
        }
        if (!("premium" in user)) {
          user.premium = false;
        }
        if (!("registered" in user)) {
          user.registered = false;
        }
        if (!("role" in user)) {
          user.role = "Beginner";
        }
        if (!("skill" in user)) {
          user.skill = "";
        }
        if (!isNumber(user.command)) {
          user.command = 0;
          }
        if (!isNumber(user.commandTotal)) {
          user.commandTotal = 0;
          }
        if (!('pacar' in user)) {
           user.pacar = "";
           }
        if (!('tembak' in user)) {
           user.tembak = "";
           }
        if (!('ditembak' in user)) {
           user.ditembak = false;
           }
        if (!('pacaranTime' in user)) {
           user.pacaranTime = 0;
           }
        if (!('invest' in user)) {
           user.invest = {};
           }
        if (!('saham' in user)) {
           user.saham = {};
           }
        if (!('task' in user)) {
           user.task = {};
           }
        if (!('historyTrx' in user)) {
           user.historyTrx = [];
           }
        if (!('rumah' in user)) {
           user.rumah = {};
           }
          if (!("name" in user)) {
            user.name = m.pushName
          }
          if (!isNumber(user.age)) {
            user.age = 0;
          }
          if (!isNumber(user.regTime)) {
            user.regTime = -1;
          }
        if (!isNumber(user.afk)) {
          user.afk = -1;
        }
        if (!isNumber(user.level)) {
          user.level = 0;
        }
        if (!isNumber(user.limit)) {
          user.limit = 50
        }
        if (!isNumber(user.money)) {
          user.money = 0
        }
        if (!user.job) {
          user.job = "Pengangguran";
        }
        if (!user.premium) {
          user.premium = false;
        }
        if (!user.premium) {
          user.premiumTime = 0;
        }
        if (!user.trofi) {
          user.trofi = "Perunggu";
        }
      } else {
        global.db.data.users[m.sender] = {
          afk: -1,
          afkReason: "",
          age: 0,
          autolevelup: false,
          job: "Pengangguran",
          level: 0,
          limit: 50,
          money: 0,
          name: m.pushName,
          pasangan: "",
          premium: false,
          premiumTime: 0,
          registered: false,
          regTime: -1,
          role: "Beginner",
          trofi: "perunggu",
          skill: "",
          command: 0,
          commandTotal: 0,
          pacar: "",
          tembak: "",
          ditembak: false,
          pacaranTime: 0,
          invest: {},
          saham: {},
          task: {},
          historyTrx: [],
          rumah: {}
        };
      }
            let chat = global.db.data.chats[m.chat];
      if (typeof chat !== "object") {
        global.db.data.chats[m.chat] = {};
      }
      if (chat) {
        if (!("isBanned" in chat)) {
          chat.isBanned = false;
        }
        if (!("welcome" in chat)) {
          chat.welcome = false;
        }
        if (!("detect" in chat)) {
          chat.detect = false;
        }
        if (!("sWelcome" in chat)) {
          chat.sWelcome = "";
        }
        if (!("sBye" in chat)) {
          chat.sBye = "";
        }
        if (!("sPromote" in chat)) {
          chat.sPromote = "";
        }
        if (!("sDemote" in chat)) {
          chat.sDemote = "";
        }
        if (!("openTime" in chat)) {
          chat.openTime = "";
        }
        if (!("closeTime" in chat)) {
          chat.closeTime = "";
        }
        if (!("listStr" in chat)) {
          chat.listStr = {};
        }
        if (!("antiAudio" in chat)) {
          chat.antiAudio = false;
        }
        if (!("antiAcara" in chat)) {
          chat.antiAcara = false;
        }
        if (!("antiDoc" in chat)) {
          chat.antiDoc = false;
        }
        if (!("pembatasan" in chat)) {
          chat.pembatasan = false;
        }
        if (!("antiSticker" in chat)) {
          chat.antiSticker = false;
        }
        if (!("antiFoto" in chat)) {
          chat.antiFoto = false;
        }
        if (!("antiPolling" in chat)) {
          chat.antiPolling = false;
        }
        if (!("antiVideo" in chat)) {
          chat.antiVideo = false;
        }
        if (!("antiPorn" in chat)) {
          chat.antiPorn = false;
        }
        if (!("viewonce" in chat)) {
          chat.viewonce = false;
        }
        if (!("antiVirtex" in chat)) {
          chat.antiVirtex = false;
        }
        if (!("antiToxic" in chat)) {
          chat.antiToxic = false;
        }
        if (!("antiBadword" in chat)) {
          chat.antiBadword = false;
        }
        if (!("rpg" in chat)) {
          chat.rpg = false;
        }
        if (!("game" in chat)) {
          chat.game = false;
        }
        if (!("teks" in chat)) {
          chat.teks = true;
        }
        if (!("antilinkTiktok" in chat)) {
          chat.antilinkTiktok = false;
        }
        if (!("antilinkYt" in chat)) {
          chat.antilinkYt = false;
        }
        if (!("antilinkTele" in chat)) {
          chat.antilinkTele = false;
        }
        if (!("antilinkFb" in chat)) {
          chat.antilinkFb = false;
        }
        if (!("antilinkIg" in chat)) {
          chat.antilinkIg = false;
        }
        if (!("antilinkGroup" in chat)) {
          chat.antilinkGroup = false;
        }
        if (!("antilinkHttp" in chat)) {
          chat.antilinkHttp = false;
        }
        if (!("antilinkWa" in chat)) {
          chat.antilinkWa = false;
        }
        if (!("antilinkCh" in chat)) {
          chat.antilinkCh = false;
        }
        if (!("autolevelup" in chat)) {
          chat.autolevelup = false;
        }
        if (!isNumber(chat.expired)) {
          chat.expired = 0;
        }
        if (!('member' in chat)) {
          chat.member = {};
        }
      } else {
        global.db.data.chats[m.chat] = {
          isBanned: false,
          welcome: false,
          adminonly: "off",
          detect: false,
          sWelcome: "",
          tWelcome: "gambar",
          sBye: "",
          sPromote: "",
          sDemote: "",
          openTime: "",
          closeTime: "",
          listStr: {},
          pembatasan: false,
          antilinkTiktok: false,
          antilinkYt: false,
          antilinkTele: false,
          antilinkFb: false,
          antilinkIg: false,
          antilinkGroup: false,
          antilinkHttp: false,
          antilinkWa: false,
          antilinkCh: false,
          antiFoto: false,
          antiVideo: false,
          antiPolling: false,
          antiAudio: false,
          antiAcara: false,
          antiDoc: false,
          antiPorn: false,
          antiSticker: false,
          viewonce: false,
          antiToxic: false,
          antiVirtex: false,
          antiBadword: false,
          rpg: false,
          game: false,
          teks: true,
          autolevelup: false,
          expired: 0,
          member: {}
        };
      }
            let member = global.db.data.chats[m.chat].member[m.sender]
            if (typeof member !== 'object') global.db.data.chats[m.chat].member[m.sender] = {}
            if (member) {
                if (!isNumber(member.warn)) {
                member.warn = 0;
                }
                if (!('blacklist' in member)) {
                member.blacklist = false;
                }
                if (!('banned' in member)) {
                member.banned = false;
                }
                if (!isNumber(member.bannedTime)) {
                member.bannedTime = 0;
                }
                if (!isNumber(member.chat)) {
                member.chat = 0;
                }
                if (!isNumber(member.chatTotal)) {
                member.chatTotal = 0;
                }
                if (!isNumber(member.command)) {
                member.command = 0;
                }
                if (!isNumber(member.commandTotal)) {
                member.commandTotal = 0;
                }
                if (!isNumber(member.lastseen)) {
                member.lastseen = 0;
                }
            } else {
               global.db.data.chats[m.chat].member[m.sender] = {
                warn: 0,
                blacklist: false,
                banned: false,
                bannedTime: 0,
                chat: 0,
                chatTotal: 0,
                command: 0,
                commandTotal: 0,
                lastseen: 0
            }
            }
            let bots = global.db.data.bots
            if (typeof bots !== 'object') global.db.data.bots = {}
            if (bots) {
                if (!('replyText' in bots)) {
                bots.replyText = {};
                }
                if (!('rating' in bots)) {
                bots.rating = {};
                }
                if (!('users' in bots)) {
                bots.users = {};
                }
                if (!('menfess' in bots)) {
                bots.menfess = {};
                }
                if (!('anonymous' in bots)) {
                bots.anonymous = {};
                }
                if (!('absen' in bots)) {
                bots.absen = {};
                }
                if (!('logs' in bots)) {
                bots.logs = {};
                }
                if (!('ultah' in bots)) {
                bots.ultah = {};
                }
                if (!('gempaDateTime' in bots)) {
                bots.gempaDateTime = "";
                }
                if (!('otakuNow' in bots)) {
                bots.otakuNow = "";
                }
                if (!('komikuNow' in bots)) {
                bots.komikuNow = "";
                }
                if (!('sellRumah' in bots)) {
                bots.sellRumah = {};
                }
                if (!('invest' in bots)) {
                bots.invest = JSON.parse(fs.readFileSync('./Storage/Json/crypto.json', 'utf-8'))
                }
                if (!('stock' in bots)) {
                bots.stock = JSON.parse(fs.readFileSync('./Storage/Json/stock.json', 'utf-8'))
                }
                if (!('rumah' in bots)) {
                bots.rumah = JSON.parse(fs.readFileSync('./Storage/Json/rumah.json', 'utf-8'))
                }
                if (!('saham' in bots)) {
                bots.saham = JSON.parse(fs.readFileSync('./Storage/Json/saham.json', 'utf-8'))
                }
                if (!('jadwalsholat' in bots)) {
                bots.jadwalsholat = JSON.parse(fs.readFileSync('./Storage/Json/jadwalsholat.json', 'utf-8'))
                }
            } else {
                global.db.data.bots = {
                replyText: {},
            	rating: {},
            	users: {},
                menfess: {},
                anonymous: {},
                absen: {},
                logs: {},
                ultah: {},
                gempaDateTime: "",
                otakuNow: "",
                komikuNow: "",
                sellRumah: {},
                invest: JSON.parse(fs.readFileSync('./Storage/Json/crypto.json', 'utf-8')),
                stock: JSON.parse(fs.readFileSync('./Storage/Json/stock.json', 'utf-8')),
                saham: JSON.parse(fs.readFileSync('./Storage/Json/saham.json', 'utf-8')),
                rumah: JSON.parse(fs.readFileSync('./Storage/Json/rumah.json', 'utf-8')),
                jadwalsholat: JSON.parse(fs.readFileSync('./Storage/Json/jadwalsholat.json', 'utf-8'))
            }
          }
            let settings = global.db.data.settings[this.user.jid || setting.bot + "@s.whatsapp.net"];
      if (typeof settings !== "object") {
        global.db.data.settings[this.user.jid] = {};
      }
      if (settings) {
        if (!("self" in settings)) {
          settings.self = false;
        }
        if (!("autoread" in settings)) {
          settings.autoread = false;
        }
        if (!("composing" in settings)) {
          settings.composing = false;
        }
        if (!("recording" in settings)) {
          settings.recording = false;
        }
        if (!("autorestart" in settings)) {
          settings.autorestart = true;
        }
        if (!("backup" in settings)) {
          settings.backup = false;
        }
        if (!("resetlimit" in settings)) {
          settings.resetlimit = true;
        }
        if (!("cleartmp" in settings)) {
          settings.cleartmp = true;
        }
        if (!("anticall" in settings)) {
          settings.anticall = false;
        }
        if (!("antivirus" in settings)) {
          settings.antivirus = true;
        }
        if (!("tampilan" in settings)) {
          settings.tampilan = 'teks';
        }
        if (!("menu" in settings)) {
          settings.menu = 'teks';
        }
        if (!("musik" in settings)) {
          settings.musik = 'fake saluran';
        }
      } else {
        global.db.data.settings[this.user.jid || setting.bot + "@s.whatsapp.net"] = {
          self: false,
          autoread: false,
          composing: false,
          recording: false,
          autorestart: true,
          backup: false,
          resetlimit: false,
          cleartmp: false,
          anticall: false,
          antivirus: true,
          tampilan: 'teks',
          menu: 'teks',
          musik: 'fake saluran'
        }
      }
    } catch (e) {
      console.error(e); // Jika Ada Error Bakal Keluar Di Sini
    }
global.rafiganteng = global.rafi = global.fhi = global.fii = global.sock = conn
    const dbAkses = JSON.parse(fs.readFileSync("./Storage/Json/rafiowner.json"));
    const isBot = [global.conn?.user?.jid || setting.bot + "@s.whatsapp.net"].map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender);
    const isOwner = dbAkses.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender);
    const isOwnerUtama = [global.setting.owner].map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender);
    const isDeveloper = [global.developer.nomor].map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender);
    const isPremium = isBot || isOwner || isOwnerUtama || isDeveloper || db.data.users[m.sender].premiumTime > 0 || db.data.users[m.sender].premium;
        if (m.text && !(isPremium || isOwner || isDeveloper || isOwnerUtama)) {
            let queque = this.msgqueque, time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            let intervalID = setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(intervalID)
                await delay(time)
            }, time)
        }
        m.exp += Math.ceil(Math.random() * 10)

        let usedPrefix
let _user = global.db.data?.users?.[m.sender]

            const groupMetadata = (m.isGroup ? (conn.chats[m.chat] || {}).metadata : {}) || {}
            const participants = m.isGroup ? (groupMetadata.participants || []) : []
            const user = participants.find(p => p.jid === m.sender) || {}
            const bot = participants.find(p => p.jid === this.user.jid || setting.bot + "@s.whatsapp.net" ) || {}
            const isRAdmin = user?.admin === "superadmin" || false
            const isAdmin = isRAdmin || user?.admin === "admin" || false
            const isBotAdmin = bot?.admin || false

    if (opts.nyimak) {
      return;
    }
    if (opts.self && !(isBot || isOwner || isOwnerUtama || isDeveloper)) {
      return;
    }
    let rafigokil = global.db.data.chats[m.chat];
    if (rafigokil.adminonly === 'on' && !(isAdmin || isDeveloper || isOwner || isOwnerUtama)) {
      return;
    }
    if (opts.pconly && m.chat.endsWith("g.us")) {
      return;
    }
    if (opts.gconly && !m.chat.endsWith("g.us")) {
      return;
    }
    if (opts.swonly && m.chat !== "status@broadcast") {
      return;
    }
        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), '../Perangkat_Lunak')
        for (let name in global.Tools) {
            let plugin = global.Tools[name]
            if (!plugin)
                continue
            if (plugin.disabled)
                continue
            const __filename = join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    // if (typeof e === 'string') continue
                    console.error(e)
                    for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                        let data = (await conn.onWhatsApp(jid))[0] || {}
                        if (data.exists)
                            m.reply(`*Plugin:* ${name}\n*Sender:* ${m.sender}\n*Chat:* ${m.chat}\n*Command:* ${m.text}\n\n\`\`\`${format(e)}\`\`\``.trim(), data.jid)
                    }
                }
            }

            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? // RegExp Mode?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ? // Array?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? // RegExp in Array?
                            p :
                            new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ? // String?
                        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isOwner,
                    isDeveloper,
                    isOwnerUtama,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPremium,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }))
                    continue
            }
            if (typeof plugin !== 'function')
                continue
            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
                let text = _args.join` `
                command = (command || '').toLowerCase()
                let fail = plugin.fail || global.dfail // When failed
                let isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ? // Array?
                        plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                            cmd.test(command) :
                            cmd === command
                        ) :
                        typeof plugin.command === 'string' ? // String?
                            plugin.command === command :
                            false

                if (!isAccept)
                    continue
                m.plugin = name
                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat]
                    let user = global.db.data.users[m.sender]
                    if (name != 'owner-unbanchat.js' && name != 'owner-exec.js' && name != 'owner-exec2.js' && name != 'tool-delete.js' && chat?.isBanned)
                        return // Except this
                    if (name != 'owner-unbanuser.js' && user?.banned)
                        return
                }
                if (plugin.owner && !(isOwner || isOwnerUtama || isDeveloper || isBot)) {
          fail("Owner", m, this);
          continue;
        }
        if (plugin.developer && !isDeveloper) {
          fail("Developer", m, this);
          continue;
        }
        if (plugin.rowner && !(isOwnerUtama || isDeveloper || isBot)) {
          fail("rowner", m, this);
          continue;
        }
        if (plugin.premium && !(isPremium || isOwnerUtama || isOwner || isDeveloper || isBot)) {
          fail("premium", m, this);
          continue;
        }
        if (plugin.group && !m.isGroup) {
          fail("group", m, this);
          continue;
        }
        if (plugin.botAdmin && !isBotAdmin) {
          fail("botAdmin", m, this);
          continue;
        }
        if (plugin.admin && !(isAdmin || isOwner || isOwnerUtama || isDeveloper || isBot)) {
          fail("admin", m, this);
          continue;
        }
        if (plugin.private && m.isGroup) {
          fail("private", m, this);
          continue;
        }
        if (plugin.daftar && !_user.registered) {
          conn.sendMessage(m.chat, {
     text: `Nomor Kakak Belum Terdaftar Di Dalam Database Bot Ini, Untuk Menggunakan Bot Ini Kakak Harus Daftar Dulu Dengan Menekan Tombol Di Bawah`,
     footer: global.setting.namabot,
     buttons: [
     {
     buttonId: `.daftar`, 
     buttonText: {
     displayText: 'DAFTAR'
     },
     type: 1 
     }
     ],
     headerType: 1,
     viewOnce: true
 },{ quoted: m })
          continue;
        }
        if (plugin.rpg && m.isGroup && !global.db.data.chats[m.chat].rpg) {
          conn.sendMessage(m.chat, {
     text: `Group Ini Belum Di Kasih Akses Buat Fitur Ini.\n\n> Berikan Akses fitur ini dengan Menekan Tombol Di Bawah Ini`,
     footer: global.setting.namabot,
     buttons: [
     {
     buttonId: `.hidupkan rpg`, 
     buttonText: {
     displayText: 'BERIKAN AKSES FITUR RPG KETUAAA'
     },
     type: 1 
     }
     ],
     headerType: 1,
     viewOnce: true
 },{ quoted: m })
          continue;
        }
        if (plugin.game && m.isGroup && !global.db.data.chats[m.chat].game) {
          conn.sendMessage(m.chat, {
     text: `Group Ini Belum Di Kasih Akses Buat Fitur Ini.\n\n> Berikan Akses fitur ini dengan Menekan Tombol Di Bawah Ini`,
     footer: global.setting.namabot,
     buttons: [
     {
     buttonId: `.hidupkan game`, 
     buttonText: {
     displayText: 'BERIKAN AKSES FITUR GAME KETUAAA'
     },
     type: 1 
     }
     ],
     headerType: 1,
     viewOnce: true
 },{ quoted: m })
          continue;
        }
                m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 50 // XP Earning per command
                let using = global.db.data.users[m.sender]
                let useng = global.db.data.chats[m.chat]
                if (xp > 200)
                    // m.reply('Ngecit -_-') // Hehehe
                    console.log("ngecit -_-");
                else
                    m.exp += xp
                if ( m.text && m.sender && m.isGroup) {
                    global.db.data.chats[m.chat].member[m.sender].chatTotal += 1
                    }
                if (!isPremium && plugin.limit && global.db.data.users[m.sender].limit < plugin.limit * 1) {
                    this.reply(m.chat, `[❗] Limit Harian Kamu Telah Habis, Limit Akan Di reset Ulang Dari Jam 2 Pagi`, m)
                    continue // Limit habis
                }
                if (plugin.level > _user.level) {
                    this.reply(m.chat, `[💬] Diperlukan level ${plugin.level} untuk menggunakan perintah ini\n*Level mu:* ${_user.level} 📊`, m)
                    continue // If the level has not been reached
                }
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    isDeveloper,
                    isBot,
                    isOwner,
                    isOwnerUtama,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPremium,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }
                try {
                    await plugin.call(this, m, extra)
                    if (!isPremium)
                        m.limit = m.limit || plugin.limit || false
                } catch (e) {
                    // Error occured
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        
                        if (e.name)
                            for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                                let data = (await conn.onWhatsApp(jid))[0] || {}
                                if (data.exists)
                                    m.reply(`*🗂️ Plugin:* ${m.plugin}\n*👤 Sender:* ${m.sender}\n*💬 Chat:* ${m.chat}\n*💻 Command:* ${usedPrefix}${command} ${args.join(' ')}\n📄 *Error Logs:*\n\n\`\`\`${text}\`\`\``.trim(), data.jid)
                            }
                        m.reply(text)
                    }
                } finally {
                    // m.reply(util.format(_user))
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    let player = db.data.users[m.sender]
                    if (m.limit)
                        m.reply(m.limit + ` Limit kamu terpakai\nLimit Tinggal: ${player.limit - m.limit}`)
                }
                break
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        if (m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
        }
        //console.log(global.db.data.users[m.sender])
        let user, stats = global.db.data.stats
        if (m) {
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp
                user.limit -= m.limit * 1
            }
            let stat
            if (m.plugin) {
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total))
                        stat.total = 1
                    if (!isNumber(stat.success))
                        stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last))
                        stat.last = now
                    if (!isNumber(stat.lastSuccess))
                        stat.lastSuccess = m.error != null ? 0 : now
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }
        try {
            if (!opts['noprint']) await (await import(`./Komponen/print.js`)).default(m, this)
        } catch (e) {
            console.log(m, m.quoted, e)
        }
        if (opts['autoread'])
            await conn.readMessages([m.key]).catch(() => {});
            
    if (global.db.data.settings[global.conn?.user?.jid || setting.bot + "@s.whatsapp.net"].composing) {
      await this.sendPresenceUpdate("composing", m.chat).catch(() => {});
    }
    if (global.db.data.settings[global.conn?.user?.jid || setting.bot + "@s.whatsapp.net"].recording) {
      await this.sendPresenceUpdate("recording", m.chat).catch(() => {});
    }
    }
}
/**
 * Handle groups participants update
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['group-participants.update']} groupsUpdate 
 */

export async function participantsUpdate({ id, participants, action }) {
    if (global.isInit) return

    const jid = conn.getJid(id)
    const chat = global.db.data.chats[jid] || {}
    const metadata = await this.groupMetadata(jid).catch(() => conn.chats[jid]?.metadata)
    const user = conn.getJid(participants[0])
    const mention = '@' + user.split('@')[0]

    let text = ''

    switch (action) {
        case 'add':
        case 'remove': {
            if (!chat.welcome) return

            text = (
                action === 'add'
                    ? chat.sWelcome || this.welcome || conn.welcome || 'Welcome, @user!'
                    : chat.sBye || this.bye || conn.bye || 'Bye, @user!'
            )
                .replace('@subject', await this.getName(jid))
                .replace('@desc', metadata?.desc || '')
                .replace('@user', mention)

            const pp = await conn.profilePictureUrl(user, 'image')
                .catch(() => setting.tampilan)

            return this.sendMessage(jid, {
                image: { url: pp },
                caption: text,
                contextInfo: {
                    mentionedJid: [user],
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: global.setting.idch,
                        serverMessageId: null,
                        newsletterName: global.setting.namach
                    }
                }
            }, { quoted: null })
        }

        case 'promote':
        case 'demote': {
            if (!chat.detect) return

            text = (
                action === 'promote'
                    ? chat.sPromote || this.spromote || conn.spromote || '@user sekarang admin!'
                    : chat.sDemote || this.sdemote || conn.sdemote || '@user sekarang bukan admin!'
            ).replace('@user', mention)

            return this.sendMessage(jid, {
                text,
                mentions: [user]
            })
        }
    }
}

/**
 * Handle groups update
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['groups.update']} groupsUpdate
 */
export async function groupsUpdate(groupsUpdate) {
  if (opts.self) {
    return;
  }
  for (const groupUpdate of groupsUpdate) {
    const id = groupUpdate.id;
    if (!id) {
      continue;
    }
    let chats = global.db.data.chats[id];
    let text = "";
    if (!chats?.detect) {
      continue;
    }
    if (groupUpdate.desc) {
      text = (chats.sDesc || this.sDesc || conn.sDesc || "```Deskripsi Udah Di Ubah Menjadi```\n@desc").replace("@desc", groupUpdate.desc);
    }
    if (groupUpdate.subject) {
      text = (chats.sSubject || this.sSubject || conn.sSubject || "```Nama Group Sudah Di Ubah Menjadi```\n@subject").replace("@subject", groupUpdate.subject);
    }
    if (groupUpdate.icon) {
      text = (chats.sIcon || this.sIcon || conn.sIcon || "```Foto PP Group Di Ubah Menjadi```").replace("@icon", groupUpdate.icon);
    }
    if (groupUpdate.revoke) {
      text = (chats.sRevoke || this.sRevoke || conn.sRevoke || "```Link Group Ini Di Ubah Menjadi```\n@revoke").replace("@revoke", groupUpdate.revoke);
    }
    if (!text) {
      continue;
    }
    await this.sendMessage(id, {
      text,
      mentions: this.parseMention(text)
    });
  }
}

export async function deleteUpdate(message) {
    try {
        const { fromMe, id, participant } = message
        if (fromMe)
            return
        let msg = this.serializeM(this.loadMessage(id))
        if (!msg)
            return
        let chat = global.db.data.chats[msg.chat] || {}
        if (chat.delete === true)
            return
        /*this.reply(msg.chat, `
Terdeteksi @${participant.split`@`[0]} telah menghapus pesan. 
Untuk mematikan fitur ini, ketik
*.enable delete*

Untuk menghapus pesan yang dikirim oleh Bot, reply pesan dengan perintah
*.delete*`, msg)
        this.copyNForward(msg.chat, msg).catch(e => console.log(e, msg))*/
    } catch (e) {
        console.error(e)
    }
}

global.dfail = (type, m, conn) => {
function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}
	let name = conn.getName(m.sender)
	let fkon = { key: { fromMe: false, participant: `${m.sender.split`@`[0]}@s.whatsapp.net`, ...(m.chat ? { remoteJid: '0@s.whatsapp.net' } : {}) }, message: { contactMessage: { displayName: `${name}`, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}}
	let msg = {
		rowner: `Perintah Ini Hanya Untuk \`OWNER UTAMA\` Ku Kak!!`,
		owner: `Perintah Ini Hanya Untuk \`OWNER\` Ku Kak!!`,
		premium: `Perintah Ini Hanya Untuk \`PEMGGUNA PREMIUM\` Ku Kak!!`,
		group: `Perintah Ini Hanya Untuk Di \`GROUP\` Kak!!`,
		developer: `Perintah Ini Hanya Untuk \`Developer ${developer.nama}\``,
		private: `Perintah Ini Hanya Untuk Di \`PRIVATE\` Kak`,
		admin: `Perintah Ini Hanya Untuk \`ADMIN\` Kak!!`,
		botAdmin: `\`BOT Belum Jadi ADMIN Kak!!\`\n Harus Jadikan Admin Dulu Baru Bisa Gunakan Fitur Ini`
	} [type]

	if (msg) return replyt(msg, m.chat, fkon)
}


let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.redBright("Memperbarui 'Chipset.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
})
function ucapan() {
  const time = moment.tz("Asia/Jakarta").format("HH");
  let res = "Selamat Menjelang Pagi";
  if (time >= 4) {
    res = "Selamat Pagi";
  }
  if (time >= 10) {
    res = "Selamat Siang";
  }
  if (time >= 15) {
    res = "Selamat Sore";
  }
  if (time >= 18) {
    res = "Selamat Malam";
  }
  return res;
}