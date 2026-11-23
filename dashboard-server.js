import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import unzipper from 'unzipper';
import { CloudflareAI, metaAiConfig } from './Perangkat_Lunak/ai-metaai.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.set('trust proxy', 1);
const startedAt = Date.now();
const PORT = Number(process.env.DASHBOARD_PORT || process.env.PORT || 3000);
const DB_DIR = path.join(__dirname, 'Cache', 'Database');
const DB_FILE = path.join(DB_DIR, 'dashboard.json');
const SESSION_DIR = path.join(__dirname, 'Cache', 'SesiBot');
const UPDATE_DIR = path.join(__dirname, 'Cache', 'Pembaruan');
const BACKUP_DIR = path.join(__dirname, 'Cache', 'Backups');
const PUBLIC_DIR = path.join(__dirname, 'public');
const WALLPAPER_DIR = path.join(PUBLIC_DIR, 'uploads', 'wallpapers');
const STORY_DIR = path.join(PUBLIC_DIR, 'uploads', 'stories');
const MUSIC_DIR = path.join(PUBLIC_DIR, 'uploads', 'music');
for (const dir of [DB_DIR, SESSION_DIR, UPDATE_DIR, BACKUP_DIR, WALLPAPER_DIR, STORY_DIR, MUSIC_DIR]) fs.mkdirSync(dir, { recursive: true });

const emptyDB = () => ({ users: {}, sessions: {}, bots: {}, messages: [], gameProfiles: {}, musicTracks: [], notifications: [
  { id: crypto.randomUUID(), title: 'Pemberitahuan:', message: 'Selamat Datang Di Website Rafibot Manajemen, Silahkan Buat Bot Baru Anda, Sebelum Start Mohon Untuk Melihat Bagian Pengaturan. \nPerhatian!! Mohon Isi Nomor Bot Terlebih Dahulu Di Pengaturan', type: 'info', createdAt: new Date().toISOString() }
], updates: [] });
let db = emptyDB();
let lastBackupAt = null;
try { db = { ...emptyDB(), ...JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) }; } catch {}
let writeQueue = Promise.resolve();
let pgPool = null;
let databaseMode = 'json';
async function initDatabase() {
  if (!process.env.DATABASE_URL) return;
  try {
    const { Pool } = await import('pg');
    pgPool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false }, max: 5, idleTimeoutMillis: 30000, connectionTimeoutMillis: 10000 });
    await pgPool.query('CREATE TABLE IF NOT EXISTS rafibot_state (id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1), payload JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');
    const result = await pgPool.query('SELECT payload FROM rafibot_state WHERE id = 1');
    if (result.rows[0]?.payload) db = { ...emptyDB(), ...result.rows[0].payload };
    else await pgPool.query('INSERT INTO rafibot_state (id,payload) VALUES (1,$1::jsonb) ON CONFLICT (id) DO NOTHING', [JSON.stringify(db)]);
    databaseMode = 'postgres';
    console.log('[DB] PostgreSQL aktif');
  } catch (error) {
    pgPool = null; databaseMode = 'json-fallback';
    console.error('[DB] PostgreSQL gagal, fallback ke JSON:', error.message);
  }
}
await initDatabase();
// Upgrade existing installations: retain the original first admin as the developer owner.
if (!Object.values(db.users).some(user => user.role === 'developer')) {
  const firstAdmin = Object.values(db.users).filter(user => user.role === 'admin').sort((a,b) => String(a.createdAt||'').localeCompare(String(b.createdAt||'')))[0];
  if (firstAdmin) firstAdmin.role = 'developer';
}

function saveDB() {
  writeQueue = writeQueue.then(async () => {
    const serialized = JSON.stringify(db);
    const tmp = DB_FILE + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(db, null, 2), { mode: 0o600 }); fs.renameSync(tmp, DB_FILE);
    if (pgPool) await pgPool.query('INSERT INTO rafibot_state (id,payload,updated_at) VALUES (1,$1::jsonb,NOW()) ON CONFLICT (id) DO UPDATE SET payload=EXCLUDED.payload, updated_at=NOW()', [serialized]);
  });
  return writeQueue;
}
// Keep the local snapshot in sync with PostgreSQL so live bot workers can poll config changes.\nawait saveDB();\n
const running = new Map();
const logs = new Map();
const frozen = new Set();
const desiredStarts = new Set();
const restartTimers = new Map();
const restartAttempts = new Map();
const MAX_AUTO_RESTARTS = Number(process.env.BOT_MAX_AUTO_RESTARTS || 8);
const defaults = {
  prefix: '.', namabot: 'Nama Bot', namaowner: 'Nama Owner', bot: '', owner: '', daerah: 'Jakarta',
  tampilan: 'https://files.catbox.moe/85kvdh.jpg', sound: 'https://files.catbox.moe/bogzjh.mp3',
  websiteSound: process.env.WEBSITE_SOUND_URL || 'https://files.catbox.moe/bogzjh.mp3',
  websiteMusic: 'https://files.catbox.moe/bogzjh.mp3', video: '', fotopp: '',
  idch: '120363421697084045@newsletter', namach: 'Mohon Ikuti Saluran', linkch: '', linkgc: '',
  tokenvercel: '', instagram: '', tiktok: '', website: '',
  panelDomain: 'https://', ptla: 'ptla_', ptlc: 'ptlc_', linkgroup: 'https://', akhiran: '@RAFIHACKER',
  paymentQris: '', paymentDana: '088279166081', paymentOvo: 'tidak ada', paymentGopay: 'tidak ada',
  pakasirProject: 'payment-by-rafihacker', pakasirApikey: 'yneAJfVaZxR9PHuSxCmwXNsf86PIOdK3'
};
const clean = (v, max=120) => String(v ?? '').trim().slice(0, max);
const hash = (v, salt) => crypto.scryptSync(v, salt, 64).toString('hex');
function safeEqual(a,b) { const aa=Buffer.from(String(a)); const bb=Buffer.from(String(b)); return aa.length===bb.length && crypto.timingSafeEqual(aa,bb); }
function cookieOpts() { return { httpOnly:true, sameSite:'strict', secure:process.env.NODE_ENV==='production', path:'/', maxAge:7*24*60*60*1000 }; }
function getUser(req) {
  const token = req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith('rafibot_session='))?.split('=').slice(1).join('=');
  if (!token) return null;
  const key = crypto.createHash('sha256').update(decodeURIComponent(token)).digest('hex');
  const sess = db.sessions[key];
  if (!sess || sess.expiresAt < Date.now()) { delete db.sessions[key]; return null; }
  return db.users[sess.userId] || null;
}
function auth(req,res,next) { const user=getUser(req); if(!user) return res.status(401).json({error:'Silakan login kembali.'}); req.user=user; next(); }
function isAdmin(user) { return user?.role === 'admin' || user?.role === 'developer'; }
function admin(req,res,next) { if(!isAdmin(req.user)) return res.status(403).json({error:'Akses khusus admin.'}); next(); }
function developer(req,res,next) { if(req.user?.role !== 'developer') return res.status(403).json({error:'Fitur ini hanya tersedia untuk developer.'}); next(); }
function publicUser(u) { return {id:u.id,email:u.email,name:u.name,role:u.role==='developer'?'developer':u.role==='admin'?'admin':'user',avatar:u.avatar||'',bio:u.bio||''}; }
function publicCardUser(u) { return {id:u.id,name:u.name,role:u.role==='developer'?'developer':u.role==='admin'?'admin':'user',avatar:u.avatar||'',bio:u.bio||''}; }
function ownedBot(req,res,next) { const bot=db.bots[req.params.id]; if(!bot || (bot.userId!==req.user.id && req.user.role!=='developer')) return res.status(404).json({error:'Bot tidak ditemukan.'}); req.bot=bot; next(); }
function addLog(id, line) { const arr=logs.get(id)||[]; arr.push({time:new Date().toISOString(),text:String(line).replace(/\u001b\[[0-9;]*m/g,'').slice(0,1200)}); if(arr.length>300) arr.shift(); logs.set(id,arr); }
function statusOf(id) { const p=running.get(id); return frozen.has(id)?'frozen':p?'running':'stopped'; }
function sessionPath(id) { return path.join(SESSION_DIR,id); }
function stopProcess(child) { if (!child) return; try { if (process.platform !== 'win32' && child.pid) process.kill(-child.pid, 'SIGTERM'); else child.kill('SIGTERM'); } catch { try { child.kill('SIGTERM'); } catch {} } }
function scheduleRestart(id, reason='process-exit') {
  if (!desiredStarts.has(id) || frozen.has(id) || restartTimers.has(id)) return;
  const attempt=(restartAttempts.get(id)||0)+1;
  if (attempt > MAX_AUTO_RESTARTS) { addLog(id,`AUTO-RESTART dihentikan setelah ${MAX_AUTO_RESTARTS} percobaan. Periksa log dan sesi WhatsApp.`); desiredStarts.delete(id); return; }
  restartAttempts.set(id,attempt);
  const delay=Math.min(60000,5000*Math.pow(2,attempt-1));
  addLog(id,`AUTO-RESTART dijadwalkan (${reason}) dalam ${Math.round(delay/1000)} detik, percobaan ${attempt}/${MAX_AUTO_RESTARTS}.`);
  const timer=setTimeout(()=>{restartTimers.delete(id);const bot=db.bots[id];if(bot&&desiredStarts.has(id)&&!running.has(id)) startBotProcess(bot);},delay);
  timer.unref?.(); restartTimers.set(id,timer);
}
function startBotProcess(bot) {
  const id=bot.id;
  if(running.has(id)) return running.get(id);
  frozen.delete(id); fs.mkdirSync(sessionPath(id),{recursive:true});
  const child=spawn(process.execPath,['./Perangkat_Keras/Power_suply.js','--pairing'],{cwd:__dirname,env:{...process.env,BOT_ID:id,BOT_HTTP_PORT:'0',MANAGEMENT_MODE:'1'},stdio:['ignore','pipe','pipe'],detached:process.platform!=='win32'});
  running.set(id,child); addLog(id,`Memulai ${bot.name}... PID ${child.pid}`);
  child.on('error',err=>{addLog(id,'ERROR: Gagal menjalankan proses: '+err.message);if(running.get(id)===child)running.delete(id);scheduleRestart(id,'spawn-error');});
  child.stdout.on('data',b=>String(b).split(/\r?\n/).filter(Boolean).forEach(x=>addLog(id,x)));
  child.stderr.on('data',b=>String(b).split(/\r?\n/).filter(Boolean).forEach(x=>addLog(id,'ERROR: '+x)));
  child.on('exit',(code,signal)=>{if(running.get(id)===child)running.delete(id);addLog(id,`Proses berhenti (code ${code}, signal ${signal||'-'}).`);if(desiredStarts.has(id))scheduleRestart(id,'process-exit');});
  return child;
}


app.use(express.json({limit:'8mb'}));

// Compatibility proxies for the imported tools bundle (originally hosted on Netlify).
// Only fixed upstream hosts are allowed; user input cannot choose an arbitrary URL.
app.post('/.netlify/functions/emgegod-ai', async (req,res)=>{
  try {
    const messages=Array.isArray(req.body?.messages)?req.body.messages:[];
    const normalized=messages.map(m=>({role:['system','assistant'].includes(m.role)?m.role:'user',content:String(m.text??m.content??'').slice(0,16000)})).filter(m=>m.content);
    if(!normalized.length) return res.status(400).json({ok:false,error:'Pesan AI kosong.'});
    const ai=new CloudflareAI(metaAiConfig.apiKey,metaAiConfig.accountId);
    const result=await ai.ask({modelId:1,messages:normalized});
    const answer=result?.result?.response||result?.result?.output_text||result?.response;
    if(!answer) return res.status(502).json({ok:false,error:'AI tidak mengembalikan jawaban.'});
    res.json({ok:true,text:String(answer)});
  } catch(e) { res.status(502).json({ok:false,error:e.message||'Layanan AI gagal.'}); }
});
app.get('/.netlify/functions/nexray', async (req,res)=>{
  try {
    const p=String(req.query.path||'');
    if(!p.startsWith('/')||p.includes('..')) return res.status(400).json({error:'Path API tidak valid.'});
    const q={...req.query}; delete q.path;
    const target='https://api.nexray.eu.cc'+p+(Object.keys(q).length?'?'+new URLSearchParams(q):'');
    const upstream=await fetch(target,{headers:{accept:req.headers.accept||'*/*'},signal:AbortSignal.timeout(55000)});
    res.status(upstream.status); res.set('content-type',upstream.headers.get('content-type')||'application/json');
    res.send(Buffer.from(await upstream.arrayBuffer()));
  } catch(e) { res.status(502).json({error:'Proxy Nexray gagal: '+e.message}); }
});
app.post('/.netlify/functions/nexray-upload', async (req,res)=>{
  try {
    const upstream=await fetch('https://api.nexray.eu.cc/upload',{method:'POST',headers:{'content-type':'application/json',accept:'application/json'},body:JSON.stringify(req.body||{}),signal:AbortSignal.timeout(60000)});
    res.status(upstream.status).type('application/json').send(await upstream.text());
  } catch(e) { res.status(502).json({error:'Upload Nexray gagal: '+e.message}); }
});
app.get('/.netlify/functions/eporner', async (req,res)=>{
  try {
    const p=String(req.query.path||''); if(!p.startsWith('/')||p.includes('..')) return res.status(400).json({error:'Path tidak valid.'});
    const q={...req.query};delete q.path;
    const upstream=await fetch('https://www.eporner.com/api/v2'+p+'?'+new URLSearchParams(q),{signal:AbortSignal.timeout(30000)});
    res.status(upstream.status).type('application/json').send(await upstream.text());
  } catch(e) { res.status(502).json({error:'Layanan video tidak tersedia: '+e.message}); }
});
app.get('/.netlify/functions/mangadex', async (req,res)=>{
  try {
    const p=String(req.query.path||'/'); if(!p.startsWith('/')||p.includes('..')) return res.status(400).json({error:'Path tidak valid.'});
    const q={...req.query};delete q.path;
    const upstream=await fetch('https://api.mangadex.org'+p+(Object.keys(q).length?'?'+new URLSearchParams(q):''),{headers:{'user-agent':'RafibotTools/1.0'},signal:AbortSignal.timeout(30000)});
    res.status(upstream.status).type('application/json').send(await upstream.text());
  } catch(e) { res.status(502).json({error:'MangaDex tidak tersedia: '+e.message}); }
});
app.get('/.netlify/functions/mangadex-img', async (req,res)=>{
  try {
    const u=new URL(String(req.query.u||'')); if(u.hostname!=='uploads.mangadex.org'||u.protocol!=='https:') return res.status(400).send('URL gambar tidak valid.');
    const upstream=await fetch(u,{signal:AbortSignal.timeout(30000)});res.status(upstream.status);res.set('content-type',upstream.headers.get('content-type')||'image/jpeg');res.send(Buffer.from(await upstream.arrayBuffer()));
  } catch(e) { res.status(502).send('Gambar MangaDex tidak tersedia.'); }
});
app.use(express.static(PUBLIC_DIR));
function systemSnapshot() {
  const mem = process.memoryUsage();
  const totalMem = requireTotalMemory();
  const cpu = process.cpuUsage();
  return {
    status: 'healthy', app: 'Rafibot Management', version: process.env.npm_package_version || '12.34.5',
    uptimeSeconds: Math.floor(process.uptime()), startedAt: new Date(startedAt).toISOString(),
    timestamp: new Date().toISOString(), platform: process.platform, node: process.version,
    memory: { rss: mem.rss, heapUsed: mem.heapUsed, heapTotal: mem.heapTotal, external: mem.external, systemTotal: totalMem, systemFree: os.freemem() },
    cpu: { userMicros: cpu.user, systemMicros: cpu.system, loadAverage: os.loadavg() },
    bots: { total: Object.keys(db.bots).length, running: [...running.keys()].length, frozen: frozen.size },
    database: db && typeof db === 'object' ? databaseMode : 'unavailable', backup: { enabled: true, lastRun: lastBackupAt, directory: 'Cache/Backups' }
  };
}
function requireTotalMemory(){ return os.totalmem(); }
function getRecommendations(snapshot) {
  const out = [];
  if (snapshot.memory.rss / snapshot.memory.systemTotal > .8) out.push({level:'warning',title:'Penggunaan RAM tinggi',detail:'RSS proses melebihi 80% RAM host. Kurangi jumlah instance atau tingkatkan memori VPS Anda.'});
  if (snapshot.memory.heapUsed / snapshot.memory.heapTotal > .85) out.push({level:'warning',title:'Heap Node.js hampir penuh',detail:'Periksa listener, cache, dan proses yang terus bertambah. Pertimbangkan batas heap dan peningkatan RAM.'});
  if (snapshot.database !== 'postgres') out.push({level:process.env.DATABASE_URL?'warning':'info',title:process.env.DATABASE_URL?'PostgreSQL belum aktif':'Database masih menggunakan JSON',detail:process.env.DATABASE_URL?'Koneksi PostgreSQL belum terkonfirmasi. Periksa DATABASE_URL, kredensial, dan log startup; aplikasi sementara memakai fallback JSON.':'Tambahkan plugin PostgreSQL Railway dan hubungkan DATABASE_URL agar data akun, sesi dashboard, dan konfigurasi tersimpan di PostgreSQL.'});
  if (!process.env.RAILWAY_VOLUME_MOUNT_PATH) out.push({level:'warning',title:'Storage persisten belum terdeteksi',detail:'Pasang Railway Volume ke /app/Cache agar database dan sesi tidak hilang saat redeploy.'});
  if (snapshot.bots.running === 0) out.push({level:'info',title:'Belum ada bot aktif',detail:'Buat instance lalu jalankan bot. Pastikan kredensial WhatsApp dan konektivitas sudah siap.'});
  if (!out.length) out.push({level:'success',title:'Sistem dalam kondisi baik',detail:'Tidak ada rekomendasi kritis dari pemeriksaan dasar.'});
  return out;
}
app.get('/api/health',async(req,res)=> {
  let databaseOk = Boolean(db && typeof db === 'object');
  if (pgPool) { try { await pgPool.query('SELECT 1'); } catch { databaseOk = false; } }
  const healthy=databaseOk;
  res.status(healthy?200:503).json({ok:healthy,app:'Rafibot Management',status:healthy?'healthy':'degraded',database:databaseMode,databaseOk,uptimeSeconds:Math.floor(process.uptime()),timestamp:new Date().toISOString()});
});
app.get('/health',(req,res)=>res.redirect(307,'/api/health'));

app.get('/api/me',(req,res)=>{const u=getUser(req); res.json({user:u?publicUser(u):null,setup:!Object.keys(db.users).length});});
app.post('/api/register', async (req,res)=>{
  const name=clean(req.body.name,60), email=clean(req.body.email,120).toLowerCase(), password=String(req.body.password||'');
  if(name.length<2 || !/^\S+@\S+\.\S+$/.test(email) || password.length<10) return res.status(400).json({error:'Nama, email valid, dan password minimal 10 karakter wajib diisi.'});
  if(Object.values(db.users).some(u=>u.email===email)) return res.status(409).json({error:'Email sudah terdaftar.'});
  const id=crypto.randomUUID(), salt=crypto.randomBytes(16).toString('hex');
  // First account is the installation owner (developer); all later public signups are user-only.
  const role = Object.keys(db.users).length === 0 ? 'developer' : 'user';
  db.users[id]={id,name,email,salt,passwordHash:hash(password,salt),role,createdAt:new Date().toISOString()};
  await saveDB(); issueSession(id,res); res.json({user:publicUser(db.users[id])});
});
const passwordResetAttempts = new Map();
db.passwordResetRequests ||= {};
db.passwordResetHistory ||= [];
// Migrasi permintaan lama agar tetap tercatat di riwayat.
for (const request of Object.values(db.passwordResetRequests)) {
  if (!db.passwordResetHistory.some(entry => entry.id === request.id)) {
    db.passwordResetHistory.push({id:request.id,name:request.name,email:request.email,requestedAt:request.createdAt,status:request.status||'pending',processedAt:null});
  }
}
app.post('/api/forgot-password', async (req,res)=>{
  const email=clean(req.body.email,120).toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({error:'Masukkan alamat email yang valid.'});
  const ip=req.ip||req.socket.remoteAddress||'unknown';
  const now=Date.now(), key=ip+'|'+email, previous=passwordResetAttempts.get(key)||0;
  if(now-previous<60000) return res.status(429).json({error:'Tunggu 1 menit sebelum mencoba lagi.'});
  passwordResetAttempts.set(key,now);
  const user=Object.values(db.users).find(x=>x.email===email);
  // Respons tetap sama untuk mencegah enumerasi email.
  const token=crypto.randomBytes(32).toString('base64url');
  if(user) {
    const id=crypto.randomUUID();
    const createdAt=new Date().toISOString();
    db.passwordResetRequests[id]={id,userId:user.id,email:user.email,name:user.name,tokenHash:crypto.createHash('sha256').update(token).digest('hex'),status:'pending',createdAt,expiresAt:now+10*60*1000};
    db.passwordResetHistory.unshift({id,name:user.name,email:user.email,requestedAt:createdAt,status:'pending',processedAt:null});
    db.passwordResetHistory=db.passwordResetHistory.slice(0,500);
    await saveDB();
  }
  // Untuk email tidak terdaftar, token acak tetap dikembalikan namun tidak memiliki permintaan aktif.
  res.json({ok:true,token,message:'Jika email terdaftar, permintaan reset dikirim ke developer untuk ditinjau.'});
});
app.get('/api/forgot-password/status/:token',async(req,res)=>{
  const token=String(req.params.token||'');
  const tokenHash=crypto.createHash('sha256').update(token).digest('hex');
  const item=Object.values(db.passwordResetRequests||{}).find(x=>safeEqual(x.tokenHash,tokenHash));
  if(!item || item.expiresAt<Date.now()) return res.status(410).json({status:'expired'});
  if(item.status==='approved' && item.password) {
    const password=item.password; delete db.passwordResetRequests[item.id]; await saveDB();
    return res.json({status:'approved',password});
  }
  res.json({status:item.status});
});
app.get('/api/developer/password-resets',auth,developer,async(req,res)=>{
  let changed=false;
  for(const request of Object.values(db.passwordResetRequests||{})){
    if(request.status==='pending'&&request.expiresAt<Date.now()){
      request.status='expired';
      const record=(db.passwordResetHistory||[]).find(x=>x.id===request.id);
      if(record){record.status='expired';record.processedAt=new Date().toISOString();}
      changed=true;
    }
  }
  if(changed) await saveDB();
  const requests=Object.values(db.passwordResetRequests||{}).filter(x=>x.status==='pending'&&x.expiresAt>Date.now()).map(x=>({id:x.id,email:x.email,name:x.name,createdAt:x.createdAt}));
  const history=(db.passwordResetHistory||[]).slice(0,100).map(x=>({id:x.id,email:x.email,name:x.name,requestedAt:x.requestedAt,status:x.status,processedAt:x.processedAt}));
  res.json({requests,history});
});
app.post('/api/developer/password-resets/:id/:action',auth,developer,async(req,res)=>{
  const item=db.passwordResetRequests?.[req.params.id];
  if(!item||item.status!=='pending'||item.expiresAt<Date.now()) return res.status(404).json({error:'Permintaan tidak ditemukan atau sudah kedaluwarsa.'});
  if(req.params.action==='reject') { item.status='rejected'; item.password=null; const record=(db.passwordResetHistory||[]).find(x=>x.id===item.id); if(record){record.status='rejected';record.processedAt=new Date().toISOString();} await saveDB(); return res.json({ok:true}); }
  if(req.params.action!=='approve') return res.status(400).json({error:'Aksi tidak valid.'});
  const user=db.users[item.userId];
  if(!user) { item.status='rejected'; await saveDB(); return res.status(404).json({error:'Akun pengguna sudah tidak tersedia.'}); }
  const password=crypto.randomBytes(12).toString('base64url');
  const salt=crypto.randomBytes(16).toString('hex');
  user.salt=salt; user.passwordHash=hash(password,salt);
  for(const [sessionKey,session] of Object.entries(db.sessions)) if(session.userId===user.id) delete db.sessions[sessionKey];
  item.status='approved'; item.password=password; item.expiresAt=Date.now()+10*60*1000;
  const record=(db.passwordResetHistory||[]).find(x=>x.id===item.id); if(record){record.status='approved';record.processedAt=new Date().toISOString();}
  await saveDB(); res.json({ok:true});
});
app.post('/api/login', async (req,res)=>{
  const email=clean(req.body.email,120).toLowerCase(), password=String(req.body.password||'');
  const u=Object.values(db.users).find(x=>x.email===email);
  if(!u || !safeEqual(hash(password,u.salt),u.passwordHash)) return res.status(401).json({error:'Email atau password salah.'});
  issueSession(u.id,res); await saveDB(); res.json({user:publicUser(u)});
});
app.get('/api/users/:id/profile',auth,(req,res)=>{
  const target=db.users[req.params.id];
  if(!target) return res.status(404).json({error:'Profil pengguna tidak ditemukan.'});
  const seen=presence.get(target.id)||Date.parse(target.lastSeen||'')||0;
  res.json({profile:{...publicCardUser(target),online:Date.now()-seen<65000,lastSeen:seen?new Date(seen).toISOString():null,createdAt:target.createdAt||null}});
});
app.put('/api/profile',auth,async(req,res)=>{
  const user=req.user;
  const name=clean(req.body.name,60);
  const email=clean(req.body.email,120).toLowerCase();
  const password=String(req.body.password||'');
  const avatar=typeof req.body.avatar==='string'?req.body.avatar:'';
  const bio=clean(req.body.bio,240);
  if(name.length<2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({error:'Nama minimal 2 karakter dan email harus valid.'});
  if(Object.values(db.users).some(u=>u.id!==user.id&&u.email===email)) return res.status(409).json({error:'Email sudah digunakan akun lain.'});
  if(password && password.length<10) return res.status(400).json({error:'Password baru minimal 10 karakter.'});
  if(avatar && (!/^data:image\/(png|jpeg|webp|gif);base64,/.test(avatar) || avatar.length>2_000_000)) return res.status(400).json({error:'Foto harus PNG, JPG, WEBP, atau GIF dan maksimal sekitar 1,5 MB.'});
  user.name=name; user.email=email;
  if(password){const salt=crypto.randomBytes(16).toString('hex');user.salt=salt;user.passwordHash=hash(password,salt);}
  if(avatar) user.avatar=avatar;
  user.bio=bio;
  if(req.body.removeAvatar===true) user.avatar='';
  await saveDB();
  res.json({user:publicUser(user)});
});
function issueSession(userId,res) { const token=crypto.randomBytes(32).toString('base64url'); const key=crypto.createHash('sha256').update(token).digest('hex'); db.sessions[key]={userId,expiresAt:Date.now()+7*86400000}; res.cookie('rafibot_session',token,cookieOpts()); }
app.post('/api/logout',auth,async(req,res)=>{ const token=req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith('rafibot_session='))?.split('=').slice(1).join('='); if(token) delete db.sessions[crypto.createHash('sha256').update(decodeURIComponent(token)).digest('hex')]; res.clearCookie('rafibot_session',{path:'/'}); await saveDB(); res.json({ok:true}); });
async function createSessionBackup(reason='scheduled') {
  const stamp = new Date().toISOString().replace(/[:.]/g,'-');
  const target = path.join(BACKUP_DIR, `${stamp}-${reason}`);
  fs.mkdirSync(target, { recursive: true });
  let copied = 0;
  for (const entry of fs.readdirSync(SESSION_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const source = path.join(SESSION_DIR, entry.name);
    const destination = path.join(target, entry.name);
    try { fs.cpSync(source, destination, { recursive: true, errorOnExist: false }); copied++; }
    catch (error) { console.error('[BACKUP] Gagal menyalin sesi', entry.name, error.message); }
  }
  lastBackupAt = new Date().toISOString();
  const dirs = fs.readdirSync(BACKUP_DIR, { withFileTypes: true }).filter(x=>x.isDirectory()).map(x=>({name:x.name,time:fs.statSync(path.join(BACKUP_DIR,x.name)).mtimeMs})).sort((a,b)=>b.time-a.time);
  for (const old of dirs.slice(14)) fs.rmSync(path.join(BACKUP_DIR,old.name),{recursive:true,force:true});
  addLog('system', `Backup sesi ${reason}: ${copied} folder disalin.`);
  return { directory: path.relative(__dirname,target), sessions: copied, createdAt: lastBackupAt };
}
app.get('/api/public-config',async (req,res)=>{
  let sound=process.env.WEBSITE_SOUND_URL || defaults.websiteSound, music=defaults.websiteMusic;
  const links={whatsapp:'',tiktok:'',instagram:'',github:''};
  try {
    const source=fs.readFileSync(path.join(__dirname,'Pengaturan.js'),'utf8');
    const sm=source.match(/websiteSound:\s*process\.env\.WEBSITE_SOUND_URL\s*\|\|\s*['"]([^'"]+)['"]/);
    const mm=source.match(/WEBSITE_MUSIC_URL\s*=\s*['"]([^'"]+)['"]/);
    if(!process.env.WEBSITE_SOUND_URL && sm?.[1]) sound=sm[1]; if(mm?.[1]) music=mm[1];
    const block=source.match(/DEVELOPER_LINKS\s*=\s*\{([\s\S]*?)\}/);
    if(block) for(const key of Object.keys(links)) { const m=block[1].match(new RegExp(key+"\\s*:\\s*['\"]([^'\"]*)['\"]")); if(m) links[key]=m[1]; }
  } catch {}
  // Fallback ke profil developer pada DatabaseBot agar semua tautan sosial tampil
  // walaupun DEVELOPER_LINKS belum diisi satu per satu.
  try {
    const remote = await fetch('https://raw.githubusercontent.com/RafiNotDev/DatabaseBot/refs/heads/main/Database.json', {headers:{'Accept':'application/json'}});
    if (remote.ok) {
      const dev = await remote.json();
      if (!links.whatsapp && dev.nomor) links.whatsapp = 'https://wa.me/' + String(dev.nomor).replace(/\D/g,'');
      if (!links.tiktok && dev.tiktok) links.tiktok = /^https?:\/\//i.test(dev.tiktok) ? dev.tiktok : 'https://www.tiktok.com/@' + String(dev.tiktok).replace(/^@/, '');
      if (!links.instagram && dev.instagram) links.instagram = /^https?:\/\//i.test(dev.instagram) ? dev.instagram : 'https://www.instagram.com/' + String(dev.instagram).replace(/^@|\/$/g, '') + '/';
    }
  } catch (error) { console.warn('[PUBLIC CONFIG] Profil sosial developer tidak dapat dimuat:', error.message); }
  if (db.developerLinks && typeof db.developerLinks === 'object') Object.assign(links, db.developerLinks);
  res.json({sound,music:(db.musicTracks||[])[0]?.url||music,tracks:db.musicTracks||[],links});
});
app.use('/api',auth);

// Owner-managed website music library. Uploads are stored in public/uploads/music.
app.get('/api/music/tracks',(req,res)=>res.json({tracks:db.musicTracks||[]}));
app.post('/api/music/tracks',developer,async(req,res)=>{
  try{
    const type=String(req.headers['content-type']||'');
    if(!type.startsWith('audio/') && !['mp3','ogg','wav','m4a','aac','webm'].includes(String(req.headers['x-track-ext']||'').toLowerCase())) return res.status(415).json({error:'File harus berupa audio.'});
    const mime=type.split(';')[0].toLowerCase();
    const requestedExt=String(req.headers['x-track-ext']||'').toLowerCase().replace(/[^a-z0-9]/g,'');
    const ext=({ 'audio/mpeg':'mp3','audio/mp3':'mp3','audio/ogg':'ogg','audio/wav':'wav','audio/x-wav':'wav','audio/wave':'wav','audio/vnd.wave':'wav','audio/mp4':'m4a','audio/x-m4a':'m4a','audio/aac':'aac','audio/webm':'webm' })[mime]||(['mp3','ogg','wav','m4a','aac','webm'].includes(requestedExt)?requestedExt:'');
    if(!ext)return res.status(415).json({error:'Format audio tidak didukung. Gunakan MP3, OGG, WAV, M4A, AAC, atau WEBM.'});
    const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>20*1024*1024)return res.status(413).json({error:'Ukuran maksimum musik 20 MB.'});chunks.push(chunk)}
    const buffer=Buffer.concat(chunks);if(!buffer.length)return res.status(400).json({error:'File musik kosong.'});
    const id=crypto.randomUUID();const name='track-'+id+'.'+ext;fs.writeFileSync(path.join(MUSIC_DIR,name),buffer,{flag:'wx'});
    const title=clean(decodeURIComponent(String(req.headers['x-track-name']||'Musik Rafibot')),80);
    const track={id,title,url:'/uploads/music/'+name,uploadedAt:new Date().toISOString(),size:buffer.length};
    db.musicTracks||=[];db.musicTracks.unshift(track);await saveDB();res.status(201).json({track});
  }catch(e){res.status(500).json({error:'Upload musik gagal: '+e.message})}
});
app.delete('/api/music/tracks/:id',developer,async(req,res)=>{
  const i=(db.musicTracks||[]).findIndex(x=>x.id===req.params.id);if(i<0)return res.status(404).json({error:'Musik tidak ditemukan.'});
  const [track]=db.musicTracks.splice(i,1);const file=path.basename(track.url);if(file.startsWith('track-'))fs.rmSync(path.join(MUSIC_DIR,file),{force:true});await saveDB();res.json({ok:true});
});

// Persistent game/RPG profile and server-validated rewards.
function gameProfile(user){
  db.gameProfiles||={};let p=db.gameProfiles[user.id];
  if(!p)p=db.gameProfiles[user.id]={money:0,exp:0,level:1,health:100,energy:100,inventory:{},stats:{work:0,farm:0,hunt:0,battle:0},logs:[]};
  p.inventory||={};p.stats||={work:0,farm:0,hunt:0,battle:0};p.logs||=[];return p;
}
function addGameLog(p,msg){p.logs.unshift({text:msg,at:new Date().toISOString()});p.logs=p.logs.slice(0,20)}
app.get('/api/game/profile',async(req,res)=>{const p=gameProfile(req.user);await saveDB();res.json({profile:p,name:req.user.name})});
app.post('/api/game/action',async(req,res)=>{
  const action=String(req.body?.action||'');const p=gameProfile(req.user);
  const costs={work:10,farm:15,trade:5,hunt:20,steal:25,fight:30,rest:0};
  if(!(action in costs))return res.status(400).json({error:'Aktivitas tidak dikenal.'});
  if(action==='rest'){p.energy=Math.min(100,p.energy+45);p.health=Math.min(100,p.health+20);const message='Beristirahat: +45 energi dan +20 HP.';addGameLog(p,message);await saveDB();return res.json({profile:p,message});}
  if(p.energy<costs[action])return res.status(400).json({error:'Energi tidak cukup. Istirahat dan coba lagi nanti.'});
  p.energy-=costs[action];let money=0,exp=0,msg='';
  if(action==='work'){money=35+Math.floor(Math.random()*26);exp=12;p.stats.work++;msg=`Bekerja selesai: +${money} koin, +${exp} EXP.`}
  if(action==='farm'){money=25+Math.floor(Math.random()*31);exp=15;p.stats.farm++;p.inventory['Hasil Panen']=(p.inventory['Hasil Panen']||0)+1;msg=`Panen berhasil: +${money} koin, +${exp} EXP, +1 Hasil Panen.`}
  if(action==='trade'){const qty=p.inventory['Hasil Panen']||0;if(!qty){p.energy+=5;return res.status(400).json({error:'Belum ada hasil panen untuk dijual.'})}p.inventory['Hasil Panen']=qty-1;money=65;exp=8;msg='Barang terjual: +65 koin, +8 EXP.'}
  if(action==='hunt'){money=20+Math.floor(Math.random()*36);exp=18;p.stats.hunt++;p.inventory['Daging Buruan']=(p.inventory['Daging Buruan']||0)+1;msg=`Berburu berhasil: +${money} koin, +${exp} EXP, +1 Daging Buruan.`}
  if(action==='steal'){if(Math.random()<.55){money=45;exp=8;msg='Aksi berhasil: +45 koin, +8 EXP.'}else{p.health=Math.max(1,p.health-15);msg='Ketahuan penjaga! HP berkurang 15.'}}
  if(action==='fight'){p.stats.battle++;if(Math.random()<.7){money=55;exp=25;p.inventory['Kristal Monster']=(p.inventory['Kristal Monster']||0)+1;msg='Monster dikalahkan: +55 koin, +25 EXP, +1 Kristal Monster.'}else{p.health=Math.max(1,p.health-20);msg='Kamu kalah dalam pertarungan. HP berkurang 20.'}}
  p.money+=money;p.exp+=exp;
  while(p.exp>=p.level*100){p.exp-=p.level*100;p.level++;p.health=100;p.energy=100;msg+=' Level naik!'}
  addGameLog(p,msg);await saveDB();res.json({profile:p,message:msg});
});

const gameRewardCooldown = new Map();

app.get('/api/game/players',auth,(req,res)=>{
 const players=Object.values(db.users).filter(u=>u.id!==req.user.id).slice(0,40).map(u=>({name:u.name,role:u.role}));
 res.json({players});
});
app.post('/api/game/transfer',async(req,res)=>{
 const recipientName=clean(req.body?.recipient,80),item=clean(req.body?.item,80),qty=Math.floor(Number(req.body?.qty)||0);
 if(!recipientName||!item||qty<1||qty>99)return res.status(400).json({error:'Nama pemain, item, dan jumlah harus valid.'});
 const recipient=Object.values(db.users).find(u=>u.id!==req.user.id&&u.name.toLowerCase()===recipientName.toLowerCase());
 if(!recipient)return res.status(404).json({error:'Pemain tidak ditemukan.'});
 const sender=gameProfile(req.user),receiver=gameProfile(recipient);
 if((sender.inventory[item]||0)<qty)return res.status(400).json({error:'Jumlah item di inventaris tidak mencukupi.'});
 sender.inventory[item]-=qty;receiver.inventory[item]=(receiver.inventory[item]||0)+qty;
 addGameLog(sender,`Mengirim ${item} ×${qty} kepada ${recipient.name}.`);addGameLog(receiver,`Menerima ${item} ×${qty} dari ${req.user.name}.`);
 await saveDB();res.json({profile:sender,message:`${item} ×${qty} berhasil dikirim kepada ${recipient.name}.`});
});
app.post('/api/game/reward',async(req,res)=>{
 const now=Date.now(),last=gameRewardCooldown.get(req.user.id)||0;
 if(now-last<10000)return res.status(429).json({error:'Tunggu beberapa detik sebelum klaim hadiah berikutnya.'});
 const game=clean(req.body?.game,80);if(!game)return res.status(400).json({error:'Game tidak valid.'});
 gameRewardCooldown.set(req.user.id,now);const p=gameProfile(req.user);p.money+=10;p.exp+=5;
 let leveled=false;while(p.exp>=p.level*100){p.exp-=p.level*100;p.level++;p.health=100;p.energy=100;leveled=true}
 const message=`${game} selesai! +10 koin dan +5 EXP.${leveled?' Level naik!':''}`;addGameLog(p,message);await saveDB();res.json({profile:p,message});
});
app.post('/api/game/shop/buy',async(req,res)=>{
 const catalog={'Ramuan HP':{price:90,desc:'Pulihkan 35 HP'},'Ramuan Energi':{price:65,desc:'Pulihkan 40 energi'},'Perisai Kayu':{price:180,desc:'Perlengkapan pertahanan'},'Jimat Keberuntungan':{price:250,desc:'Item langka'}};
 const item=String(req.body?.item||'');const product=catalog[item];if(!product)return res.status(400).json({error:'Item tidak tersedia.'});
 const p=gameProfile(req.user);if(p.money<product.price)return res.status(400).json({error:'Koin tidak cukup.'});p.money-=product.price;
 if(item==='Ramuan HP')p.health=Math.min(100,p.health+35);else if(item==='Ramuan Energi')p.energy=Math.min(100,p.energy+40);else p.inventory[item]=(p.inventory[item]||0)+1;
 addGameLog(p,`Membeli ${item} seharga ${product.price} koin.`);await saveDB();res.json({profile:p,message:`Berhasil membeli ${item}.`});
});

const presence = new Map();
app.post('/api/presence/heartbeat', async (req,res)=>{
  const now=Date.now(); presence.set(req.user.id,now); req.user.lastSeen=new Date(now).toISOString();
  await saveDB();
  res.json({ok:true,at:req.user.lastSeen});
});
app.get('/api/chat/users',(req,res)=>{
  const now=Date.now();
  const users=Object.values(db.users).filter(u=>u.id!==req.user.id).map(u=>{
    const seen=presence.get(u.id)||Date.parse(u.lastSeen||'')||0;
    return {...publicCardUser(u),online:now-seen<65000,lastSeen:seen?new Date(seen).toISOString():null,
      unread:(db.messages||[]).filter(m=>m.from===u.id&&m.to===req.user.id&&!m.readAt).length,
      lastMessage:(db.messages||[]).filter(m=>(m.from===u.id&&m.to===req.user.id)||(m.from===req.user.id&&m.to===u.id)).slice(-1)[0]?.createdAt||null};
  });
  res.json({users});
});
app.get('/api/messages/:userId',async(req,res)=>{
  if(!db.users[req.params.userId]) return res.status(404).json({error:'Pengguna tidak ditemukan.'});
  const messages=(db.messages||[]).filter(m=>(m.from===req.user.id&&m.to===req.params.userId)||(m.from===req.params.userId&&m.to===req.user.id)).slice(-250);
  let changed=false; for(const m of messages){if(m.to===req.user.id&&!m.readAt){m.readAt=new Date().toISOString();changed=true;}} if(changed) await saveDB();
  res.json({messages:messages.map(m=>({...m, mine:m.from===req.user.id, sender:publicCardUser(db.users[m.from])}))});
});
app.post('/api/messages/:userId',async(req,res)=>{
  const target=db.users[req.params.userId];
  const type=req.body.type==='audio'?'audio':'text';
  const message=type==='audio'?String(req.body.audio||''):clean(req.body.message,2000);
  if(!target) return res.status(404).json({error:'Pengguna tidak ditemukan.'});
  if(target.id===req.user.id) return res.status(400).json({error:'Tidak dapat mengirim pesan ke akun sendiri.'});
  if(type==='audio'&&!/^data:audio\/(webm|ogg|mp4|mpeg|wav)(;[^;]+)?;base64,[A-Za-z0-9+/=]+$/.test(message)) return res.status(400).json({error:'File suara tidak valid.'});
  if(type==='audio'&&message.length>5_500_000) return res.status(413).json({error:'Pesan suara maksimal sekitar 4 MB.'});
  if(type==='text'&&!message) return res.status(400).json({error:'Pesan tidak boleh kosong.'});
  const item={id:crypto.randomUUID(),from:req.user.id,to:target.id,type,message,createdAt:new Date().toISOString()};
  db.messages ||= []; db.messages.push(item); if(db.messages.length>5000) db.messages=db.messages.slice(-5000);
  await saveDB(); res.status(201).json({message:{...item,mine:true}});
});
app.post('/api/ai/chat',async(req,res)=>{
  try {
    const prompt=clean(req.body.message,4000);
    if(!prompt) return res.status(400).json({error:'Pertanyaan tidak boleh kosong.'});
    let apiKey=metaAiConfig.apiKey, accountId=metaAiConfig.accountId;
    try { const source=fs.readFileSync(path.join(__dirname,'Pengaturan.js'),'utf8'); const km=source.match(/META_AI_API_KEY\s*=\s*['"]([^'"]*)['"]/); const am=source.match(/META_AI_ACCOUNT_ID\s*=\s*['"]([^'"]*)['"]/); if(km?.[1]) apiKey=km[1]; if(am?.[1]) accountId=am[1]; } catch {}
    if(!apiKey || apiKey.startsWith('ISI_') || !accountId || accountId.startsWith('ISI_')) return res.status(503).json({error:'Isi META_AI_API_KEY dan META_AI_ACCOUNT_ID di Pengaturan.js.'});
    const ai=new CloudflareAI(apiKey,accountId);
    const result=await ai.ask({modelId:1,messages:[
      {role:'system',content:`Kamu adalah asisten AI Rafibot. Jawab dalam bahasa yang digunakan pengguna, jelas, ramah, dan membantu. Untuk coding berikan solusi yang aman dan bisa diterapkan.`},
      {role:'user',content:prompt}
    ]});
    const answer=result?.result?.response || result?.response || result?.result?.text;
    if(!answer) throw new Error('AI tidak mengembalikan jawaban.');
    res.json({answer:String(answer)});
  } catch(error) {
    console.error('[AI CHAT]',error.message);
    res.status(502).json({error:'AI sedang tidak dapat menjawab: '+error.message});
  }
});

app.get('/api/wallpapers',auth,(req,res)=>{ try { const files=fs.readdirSync(WALLPAPER_DIR).filter(n=>/\.(png|jpe?g|webp|gif)$/i.test(n)); res.json({wallpapers:files.map(name=>({name,url:'/uploads/wallpapers/'+encodeURIComponent(name)}))}); } catch { res.json({wallpapers:[]}); } });
app.post('/api/developer/wallpapers',auth,developer,async(req,res)=>{ try { const data=String(req.body.data||''); const m=data.match(/^data:image\/(png|jpeg|webp|gif);base64,([A-Za-z0-9+/=]+)$/); if(!m)return res.status(400).json({error:'Pilih gambar PNG, JPG, WEBP, atau GIF.'}); const buffer=Buffer.from(m[2],'base64'); if(buffer.length>5*1024*1024)return res.status(413).json({error:'Ukuran gambar maksimal 5 MB.'}); const ext=m[1]==='jpeg'?'jpg':m[1],name='wallpaper-'+Date.now()+'-'+crypto.randomBytes(3).toString('hex')+'.'+ext; fs.writeFileSync(path.join(WALLPAPER_DIR,name),buffer,{flag:'wx'}); res.status(201).json({wallpaper:{name,url:'/uploads/wallpapers/'+name}}); } catch(e){res.status(500).json({error:'Upload wallpaper gagal: '+e.message});} });
app.delete('/api/developer/wallpapers/:name',auth,developer,async(req,res)=>{ const name=path.basename(req.params.name); if(name!==req.params.name||!/^wallpaper-[\w-]+\.(png|jpg|webp|gif)$/i.test(name))return res.status(400).json({error:'Nama file tidak valid.'}); try{fs.unlinkSync(path.join(WALLPAPER_DIR,name));res.json({ok:true});}catch{res.status(404).json({error:'Wallpaper tidak ditemukan.'});} });
app.get('/api/appearance',auth,(req,res)=>res.json({appearance:db.appearances?.[req.user.id]||{wallpaper:''}}));
app.put('/api/appearance',auth,async(req,res)=>{ const wallpaper=clean(req.body.wallpaper,300); if(wallpaper&&!/^\/uploads\/wallpapers\/[\w.-]+$/.test(wallpaper))return res.status(400).json({error:'Wallpaper tidak valid.'}); db.appearances ||= {}; db.appearances[req.user.id]={wallpaper}; await saveDB(); res.json({appearance:db.appearances[req.user.id]}); });
app.get('/api/stories',auth,async(req,res)=>{ const now=Date.now(); const all=db.stories||[]; const expired=all.filter(x=>Date.parse(x.expiresAt)<=now); db.stories=all.filter(x=>Date.parse(x.expiresAt)>now); for(const item of expired){try{fs.unlinkSync(path.join(PUBLIC_DIR,String(item.url||'').replace(/^\//,'')))}catch{}} if(expired.length) await saveDB(); res.json({stories:db.stories.map(x=>({...x,owner:publicUser(db.users[x.userId])})).filter(x=>x.owner)}); });
app.post('/api/stories',auth,async(req,res)=>{ const data=String(req.body.data||''); const m=data.match(/^data:image\/(png|jpeg|webp|gif);base64,([A-Za-z0-9+/=]+)$/); if(!m)return res.status(400).json({error:'Story harus berupa gambar PNG, JPG, WEBP, atau GIF.'}); const buffer=Buffer.from(m[2],'base64'); if(buffer.length>4*1024*1024)return res.status(413).json({error:'Ukuran story maksimal 4 MB.'}); const ext=m[1]==='jpeg'?'jpg':m[1],name='story-'+Date.now()+'-'+crypto.randomBytes(4).toString('hex')+'.'+ext; fs.writeFileSync(path.join(STORY_DIR,name),buffer,{flag:'wx'}); const item={id:crypto.randomUUID(),userId:req.user.id,url:'/uploads/stories/'+name,caption:clean(req.body.caption,180),createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+24*60*60*1000).toISOString()}; db.stories ||= []; db.stories.unshift(item); await saveDB(); res.status(201).json({story:item}); });
app.delete('/api/stories/:id',auth,async(req,res)=>{ const i=(db.stories||[]).findIndex(x=>x.id===req.params.id&&x.userId===req.user.id); if(i<0)return res.status(404).json({error:'Story tidak ditemukan.'}); const [item]=db.stories.splice(i,1); try{fs.unlinkSync(path.join(PUBLIC_DIR,item.url.replace(/^\//,'')));}catch{} await saveDB(); res.json({ok:true}); });
app.get('/api/backups',developer,(req,res)=>{
  const items=fs.readdirSync(BACKUP_DIR,{withFileTypes:true}).filter(x=>x.isDirectory()).map(x=>({name:x.name,createdAt:fs.statSync(path.join(BACKUP_DIR,x.name)).mtime.toISOString()})).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,30);
  res.json({backups:items,lastRun:lastBackupAt,retention:14});
});
app.post('/api/backups/run',developer,async(req,res)=>{try{res.json(await createSessionBackup('manual'));}catch(e){res.status(500).json({error:'Backup gagal: '+e.message});}});

app.get('/api/monitoring', (req,res) => {
  const snapshot=systemSnapshot();
  res.json({system:snapshot,recommendations:getRecommendations(snapshot),recentErrors:[...logs.entries()].flatMap(([botId,items])=>items.filter(x=>/error|fatal|exception/i.test(x.text)).slice(-5).map(x=>({botId,...x}))).slice(-20)});
});
app.get('/api/recommendations', (req,res) => res.json({recommendations:getRecommendations(systemSnapshot())}));
app.get('/api/dashboard',(req,res)=>{
  const bots=Object.values(db.bots).filter(b=>b.userId===req.user.id || req.user.role==='developer').map(b=>({...b,ownerName:db.users[b.userId]?.name||'Akun dihapus',ownerEmail:db.users[b.userId]?.email||'',status:statusOf(b.id),sessionExists:fs.existsSync(sessionPath(b.id))}));
  res.json({bots,notifications:db.notifications.slice(0,30),updates:db.updates.slice(0,20),stats:{total:bots.length,running:bots.filter(b=>b.status==='running').length,users:req.user.role==='developer'?Object.keys(db.users).length:Object.values(db.users).filter(u=>u.id===req.user.id).length}});
});
app.post('/api/bots',async(req,res)=>{
  const name=clean(req.body.name,60)||'Bot Baru'; const id=crypto.randomUUID();
  db.bots[id]={id,userId:req.user.id,name,createdAt:new Date().toISOString(),settings:{...defaults,namabot:name,namaowner:req.user.name}};
  await saveDB(); res.json({bot:db.bots[id]});
});
app.get('/api/users',admin,(req,res)=>{
  const users=Object.values(db.users).map(u=>({id:u.id,name:u.name,email:u.email,role:u.role==='developer'?'developer':u.role==='admin'?'admin':'user',createdAt:u.createdAt,avatar:u.avatar||''}));
  res.json({users});
});
app.post('/api/users',admin,async(req,res)=>{
  const name=clean(req.body.name,60),email=clean(req.body.email,120).toLowerCase(),password=String(req.body.password||''),requestedRole=['user','admin','developer'].includes(req.body.role)?req.body.role:'user',role=requestedRole==='developer'&&req.user.role!=='developer'?'user':requestedRole;
  if(name.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||password.length<10)return res.status(400).json({error:'Nama, email valid, dan password minimal 10 karakter wajib diisi.'});
  if(Object.values(db.users).some(u=>u.email===email))return res.status(409).json({error:'Email sudah digunakan.'});
  const id=crypto.randomUUID(),salt=crypto.randomBytes(16).toString('hex');
  db.users[id]={id,name,email,salt,passwordHash:hash(password,salt),role,createdAt:new Date().toISOString(),createdBy:req.user.id};
  await saveDB();res.status(201).json({user:{id,name,email,role}});
});
app.delete('/api/users/:id',admin,async(req,res)=>{
  const target=db.users[req.params.id];if(!target)return res.status(404).json({error:'Akun tidak ditemukan.'});
  if(target.role==='developer'&&req.user.role!=='developer')return res.status(403).json({error:'Admin tidak dapat menghapus akun developer.'});
  if(target.id===req.user.id)return res.status(400).json({error:'Admin tidak dapat menghapus akunnya sendiri.'});
  if(isAdmin(target)&&Object.values(db.users).filter(isAdmin).length<=1)return res.status(400).json({error:'Minimal harus ada satu akun admin.'});
  for(const [key,sess] of Object.entries(db.sessions))if(sess.userId===target.id)delete db.sessions[key];
  for(const bot of Object.values(db.bots).filter(b=>b.userId===target.id)){
    desiredStarts.delete(bot.id);const timer=restartTimers.get(bot.id);if(timer)clearTimeout(timer);restartTimers.delete(bot.id);
    const child=running.get(bot.id);if(child)stopProcess(child);running.delete(bot.id);frozen.delete(bot.id);fs.rmSync(sessionPath(bot.id),{recursive:true,force:true});delete db.bots[bot.id];
  }
  delete db.users[target.id];await saveDB();res.json({ok:true});
});
app.delete('/api/bots/:id',auth,async(req,res)=>{
  const bot=db.bots[req.params.id];if(!bot || (bot.userId!==req.user.id && !isAdmin(req.user)))return res.status(404).json({error:'Bot tidak ditemukan.'});
  desiredStarts.delete(bot.id);const timer=restartTimers.get(bot.id);if(timer)clearTimeout(timer);restartTimers.delete(bot.id);
  const child=running.get(bot.id);if(child)stopProcess(child);running.delete(bot.id);frozen.delete(bot.id);restartAttempts.delete(bot.id);
  fs.rmSync(sessionPath(bot.id),{recursive:true,force:true});delete db.bots[bot.id];logs.delete(bot.id);await saveDB();res.json({ok:true});
});
app.get('/api/bots/:id',ownedBot,(req,res)=>res.json({...req.bot,status:statusOf(req.bot.id),logs:logs.get(req.bot.id)||[]}));
app.put('/api/bots/:id/settings',ownedBot,async(req,res)=>{
  const next={...defaults,...req.bot.settings};
  for(const k of Object.keys(defaults)) if(req.body[k]!==undefined) next[k]=clean(req.body[k],['tampilan','sound','video','fotopp','linkch','tokenvercel','panelDomain','ptla','ptlc','linkgroup','akhiran','paymentQris','paymentDana','paymentOvo','paymentGopay','pakasirProject','pakasirApikey'].includes(k)?500:120);
  if(!next.namabot || !next.namaowner) return res.status(400).json({error:'Nama bot dan nama owner wajib diisi.'});
  req.bot.name=next.namabot; req.bot.settings=next; await saveDB(); res.json({settings:next});
});
app.post('/api/bots/:id/start',ownedBot,async(req,res)=>{const id=req.bot.id;desiredStarts.add(id);restartAttempts.set(id,0);const timer=restartTimers.get(id);if(timer){clearTimeout(timer);restartTimers.delete(id);}const child=startBotProcess(req.bot);req.bot.autoStart=true;await saveDB();res.json({status:'running',pid:child.pid,autoRestart:true});});
app.post('/api/bots/:id/stop',ownedBot,(req,res)=>{const id=req.bot.id;desiredStarts.delete(id);const rt=restartTimers.get(id);if(rt){clearTimeout(rt);restartTimers.delete(id);}req.bot.autoStart=false;saveDB().catch(console.error); const child=running.get(id); if(child){stopProcess(child);running.delete(id);} frozen.delete(id); addLog(id,'Bot dihentikan. Sesi tetap disimpan.'); res.json({status:'stopped'});});
app.post('/api/bots/:id/freeze',ownedBot,(req,res)=>{const id=req.bot.id;desiredStarts.delete(id);const rt=restartTimers.get(id);if(rt){clearTimeout(rt);restartTimers.delete(id);}req.bot.autoStart=false;saveDB().catch(console.error); const child=running.get(id); if(child){stopProcess(child);running.delete(id);} frozen.add(id); addLog(id,'Bot dibekukan. Sesi tetap aman.'); res.json({status:'frozen'});});
app.delete('/api/bots/:id/session',ownedBot,(req,res)=>{const id=req.bot.id;desiredStarts.delete(id);req.bot.autoStart=false;const rt=restartTimers.get(id);if(rt){clearTimeout(rt);restartTimers.delete(id);}saveDB().catch(console.error); const child=running.get(id); if(child){stopProcess(child);running.delete(id);} frozen.delete(id); fs.rmSync(sessionPath(id),{recursive:true,force:true}); addLog(id,'Folder sesi WhatsApp dihapus.'); res.json({status:'session_deleted'});});
app.get('/api/bots/:id/logs',ownedBot,(req,res)=>res.json({status:statusOf(req.bot.id),logs:logs.get(req.bot.id)||[]}));
app.get('/api/bots/:id/database',ownedBot,(req,res)=>{
  const file=path.join(DB_DIR,`${req.bot.id}.json`);
  try { const data=JSON.parse(fs.readFileSync(file,'utf8')); const users=Object.entries(data.users||{}).map(([jid,u])=>({jid,name:clean(u.name||u.registeredName||jid.split('@')[0],80),level:Number(u.level)||0,exp:Number(u.exp)||0,money:Number(u.money)||0,bank:Number(u.bank)||0,limit:Number(u.limit)||0,registered:Boolean(u.registered),premiumTime:Number(u.premiumTime)||0}));
    res.json({botId:req.bot.id,totalUsers:users.length,users:users.sort((a,b)=>b.level-a.level).slice(0,1000),updatedAt:fs.statSync(file).mtime.toISOString()});
  } catch(error) { if(error.code==='ENOENT') return res.json({botId:req.bot.id,totalUsers:0,users:[],updatedAt:null,message:'Database bot belum dibuat. Jalankan bot terlebih dahulu.'}); res.status(500).json({error:'Database bot tidak dapat dibaca.'}); }
});
app.get('/api/notifications',(req,res)=>res.json({notifications:db.notifications}));
app.post('/api/notifications',developer,async(req,res)=>{const title=clean(req.body.title,100),message=clean(req.body.message,1000),type=['info','feature','removed','warning'].includes(req.body.type)?req.body.type:'info'; if(!title||!message)return res.status(400).json({error:'Judul dan pesan wajib diisi.'}); const item={id:crypto.randomUUID(),title,message,type,createdAt:new Date().toISOString(),by:req.user.name}; db.notifications.unshift(item); await saveDB(); res.json({notification:item});});
app.post('/api/developer/upload',developer,async(req,res)=>{
  if(!req.headers['content-type']?.includes('application/zip') && !req.headers['content-type']?.includes('application/octet-stream')) return res.status(415).json({error:'Upload harus berupa file ZIP.'});
  const chunks=[]; let size=0; for await(const chunk of req){size+=chunk.length;if(size>25*1024*1024)return res.status(413).json({error:'Maksimum ZIP 25 MB.'});chunks.push(chunk);} const buffer=Buffer.concat(chunks);
  const id=Date.now().toString(); const stage=path.join(UPDATE_DIR,id); fs.mkdirSync(stage,{recursive:true});
  try { const directory=await unzipper.Open.buffer(buffer); const files=[]; for(const entry of directory.files){if(entry.type==='Directory')continue; const rel=entry.path.replace(/\\/g,'/'); if(rel.startsWith('/')||rel.split('/').some(p=>p==='..')||rel.includes('\0')) throw new Error('Path file ZIP tidak aman.'); if(rel.startsWith('Cache/')||rel.startsWith('node_modules/')||rel==='.env'||rel==='dashboard-server.js') continue; const dest=path.join(stage,rel); fs.mkdirSync(path.dirname(dest),{recursive:true}); fs.writeFileSync(dest,await entry.buffer()); files.push(rel);} const update={id,title:clean(req.headers['x-update-title']||'Pembaruan pengembang',100),files,uploadedAt:new Date().toISOString(),status:'staged'}; db.updates.unshift(update); await saveDB(); res.json({update}); }
  catch(e){fs.rmSync(stage,{recursive:true,force:true});res.status(400).json({error:'ZIP gagal diproses: '+e.message});}
});
app.delete('/api/developer/staging/:id',developer,async(req,res)=>{
  const index=db.updates.findIndex(x=>x.id===req.params.id && x.status==='staged');
  if(index<0)return res.status(404).json({error:'Paket staging tidak ditemukan atau sudah diterapkan.'});
  const [update]=db.updates.splice(index,1);
  fs.rmSync(path.join(UPDATE_DIR,update.id),{recursive:true,force:true});
  await saveDB();
  res.json({ok:true,deleted:update.id});
});
app.post('/api/developer/apply/:id',developer,async(req,res)=>{
  const update=db.updates.find(x=>x.id===req.params.id); if(!update)return res.status(404).json({error:'Pembaruan tidak ditemukan.'});
  const stage=path.join(UPDATE_DIR,update.id), backup=path.join(UPDATE_DIR,update.id+'-backup'); fs.mkdirSync(backup,{recursive:true}); const applied=[];
  try { for(const rel of update.files){const src=path.join(stage,rel),dest=path.resolve(__dirname,rel); if(!dest.startsWith(__dirname+path.sep))throw new Error('Path tidak aman.'); fs.mkdirSync(path.dirname(dest),{recursive:true}); if(fs.existsSync(dest)){const b=path.join(backup,rel);fs.mkdirSync(path.dirname(b),{recursive:true});fs.copyFileSync(dest,b);} fs.copyFileSync(src,dest);applied.push(rel);} update.status='applied';update.appliedAt=new Date().toISOString();await saveDB(); res.json({ok:true,applied,backup:`Cache/Pembaruan/${update.id}-backup`}); }
  catch(e){res.status(500).json({error:'Penerapan parsial: '+e.message,applied});}
});
app.get('*',(req,res)=>res.sendFile(path.join(PUBLIC_DIR,'index.html')));
const server=app.listen(PORT,'0.0.0.0',()=>{
  console.log(`Rafibot Management berjalan di http://localhost:${PORT}`);
  for (const bot of Object.values(db.bots)) if (bot.autoStart) { desiredStarts.add(bot.id); setTimeout(()=>{if(desiredStarts.has(bot.id))startBotProcess(bot);},3000).unref?.(); }
  setTimeout(()=>createSessionBackup('startup').catch(e=>console.error('[BACKUP]',e.message)),15000).unref?.();
});
const backupTimer=setInterval(()=>createSessionBackup('scheduled').catch(e=>console.error('[BACKUP]',e.message)),Number(process.env.SESSION_BACKUP_INTERVAL_MS||21600000));
backupTimer.unref?.();

async function shutdown(signal) {
  console.log(`${signal}: menghentikan Rafibot Management...`);
  clearInterval(backupTimer); for (const timer of restartTimers.values()) clearTimeout(timer); for (const child of running.values()) stopProcess(child);
  running.clear();
  try { await createSessionBackup('shutdown').catch(()=>{}); await saveDB(); if(pgPool) await pgPool.end(); } finally { server.close(()=>process.exit(0)); setTimeout(()=>process.exit(1),10000).unref(); }
}
process.on('SIGTERM',()=>shutdown('SIGTERM'));
process.on('SIGINT',()=>shutdown('SIGINT'));
