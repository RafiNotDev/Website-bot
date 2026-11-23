
(() => {
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const games=[
 ['Tebak Angka','logic','🔢'],['Asah Otak','puzzle','🧠'],['Hitung Cepat','logic','➗'],['Tebak Kata','puzzle','🔤'],['Susun Huruf','puzzle','🧩'],
 ['Memory Flip','puzzle','🃏'],['Batu Gunting Kertas','casual','✊'],['Tebak Warna','arcade','🎨'],['Reaksi Kilat','arcade','⚡'],['Kuis Sains','logic','🔬'],
 ['Tebak Emoji','casual','😎'],['Cari Pasangan','puzzle','🧷'],['Tic Tac Toe','logic','⭕'],['Tebak Hewan','casual','🐾'],['Tebak Buah','casual','🍉'],
 ['Matematika Pro','logic','📐'],['Susun Kata','puzzle','🔡'],['Pilih Kotak','arcade','🎁'],['Klik Target','arcade','🎯'],['Urutkan Angka','logic','🔢'],
 ['Simon Memory','puzzle','🌈'],['Tebak Bendera','logic','🚩'],['Tebak Logo','casual','🏷️'],['Tebak Film','casual','🎬'],['Tebak Musik','casual','🎵'],
 ['Labirin Mini','puzzle','🌀'],['Bom Angka','logic','💣'],['Tangkap Bintang','arcade','⭐'],['Lompat Rintangan','arcade','🏃'],['Hindari Bom','arcade','💥'],
 ['Kartu Duel','casual','🂡'],['Dadu Keberuntungan','casual','🎲'],['Roda Hadiah','casual','🎡'],['Tebak Siluet','puzzle','👤'],['Cari Perbedaan','puzzle','🔍'],
 ['Kata Berantai','puzzle','🔗'],['Tantangan Fokus','arcade','👁️'],['Puzzle Geser','puzzle','🧱'],['Tebak Negara','logic','🌍'],['Tebak Profesi','casual','🧑‍🔧'],
 ['Kode Rahasia','logic','🔐'],['Hitung Mundur','arcade','⏱️'],['Bentuk Sama','puzzle','🔺'],['Tebak Nomor','logic','📱'],
 ['Tebak Makanan','casual','🍜'],['Tebak Kendaraan','casual','🚗'],['Keseimbangan','arcade','⚖️'],['Mini Sudoku','puzzle','🔢'],['Survival Quiz','logic','🛡️'],
 ['Tebak Gambar','puzzle','🖼️'],['Tebak Lagu','casual','🎧'],['Tebak ML','casual','🎮'],['Tebak Tebakan','puzzle','😄'],['Siapakah Aku','puzzle','🕵️'],['Cak Lontong','puzzle','🤔'],['Tebak Game','casual','🕹️'],['Lengkapi Kalimat','puzzle','📝'],['Tebak Lirik','casual','🎤'],['Tebak Jenaka','puzzle','😆']
 ];
 let category='all', current=null, target=null, started=0, timer=null;
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 async function request(path,opts={}){const r=await fetch('/api'+path,{credentials:'same-origin',...opts,headers:{'Content-Type':'application/json',...(opts.headers||{})}});const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||'Permintaan gagal');return d}
 function renderGames(){const q=($('#gameSearch')?.value||'').toLowerCase();$('#gameGrid').innerHTML=games.map((g,i)=>({...{g,i}})).filter(({g})=>(category==='all'||g[1]===category)&&g[0].toLowerCase().includes(q)).map(({g,i})=>`<button class="game-tile" data-game="${i}"><span class="game-icon">${g[2]}</span><span class="game-tile-title">${g[0]}</span><small>${g[1].toUpperCase()} · Hadiah koin + EXP</small><b>Mainkan ↗</b></button>`).join('')}
 async function loadProfile(){try{const d=await request('/game/profile');drawProfile(d.profile);drawRpg(d.profile,d.name)}catch(e){console.warn(e)}}
 function drawProfile(p){if(!p)return;$('#gameMoney').textContent=Number(p.money).toLocaleString('id-ID');$('#gameExp').textContent=p.exp;$('#gameLevel').textContent=p.level;window.gameLevel=p.level;$('#rpgLevel').textContent='Lv. '+p.level;$('#rpgMoney').textContent=Number(p.money).toLocaleString('id-ID')}
 function drawRpg(p,name){drawProfile(p);$('#rpgName').textContent=name||'Petualang';$('#rpgXpText').textContent=`${p.exp} / ${p.level*100} EXP` ;$('#rpgXpBar').style.width=Math.min(100,p.exp/(p.level*100)*100)+'%';$('#rpgStats').innerHTML=`<div><b>${p.health}</b><small>HP</small></div><div><b>${p.energy}</b><small>Energi</small></div><div><b>${p.stats?.work||0}</b><small>Bekerja</small></div><div><b>${p.stats?.farm||0}</b><small>Bertani</small></div>`;const inv=Object.entries(p.inventory||{}).filter(x=>x[1]>0);$('#rpgInventory').innerHTML=inv.length?inv.map(([n,c])=>`<div class="inventory-item"><span>🎒</span><b>${escape(n)}</b><small>×${c}</small></div>`).join(''):'<p class="muted">Inventaris masih kosong. Mulai bekerja atau berburu untuk mendapatkan item.</p>';$('#rpgLog').innerHTML=(p.logs||[]).map(x=>`<div class="activity"><div class="activity-icon">📜</div><div><b>${escape(x.text)}</b><small>${new Date(x.at).toLocaleString('id-ID')}</small></div></div>`).join('')||'<p class="muted">Belum ada aktivitas.</p>'}
 const shop=[['Ramuan HP','🧪',90,'Pulihkan 35 HP'],['Ramuan Energi','⚡',65,'Pulihkan 40 energi'],['Perisai Kayu','🛡️',180,'Perlengkapan pertahanan'],['Jimat Keberuntungan','🍀',250,'Item langka']];
 function renderShop(){$('#gameShop').innerHTML=shop.map(([n,ic,price,desc])=>`<div class="shop-item"><span>${ic}</span><b>${n}</b><small>${desc}</small><div><strong>${price} koin</strong><button class="btn primary" data-buy="${n}">Beli</button></div></div>`).join('')}
 const quizSets={
  'Kuis Sains':[
   {q:'Planet terbesar di tata surya adalah...',a:'Jupiter',o:['Mars','Jupiter','Venus','Merkurius'],topic:'Astronomi'},
   {q:'Proses tumbuhan membuat makanan dengan bantuan cahaya disebut...',a:'Fotosintesis',o:['Respirasi','Fotosintesis','Evaporasi','Fermentasi'],topic:'Biologi'},
   {q:'Rumus kimia air adalah...',a:'H₂O',o:['CO₂','O₂','H₂O','NaCl'],topic:'Kimia'},
   {q:'Satuan gaya dalam SI adalah...',a:'Newton',o:['Joule','Watt','Newton','Pascal'],topic:'Fisika'},
   {q:'Organ tubuh yang memompa darah adalah...',a:'Jantung',o:['Paru-paru','Jantung','Ginjal','Hati'],topic:'Biologi'}
  ],
  'Tebak Bendera':[
   {q:'🇯🇵',a:'Jepang',o:['Tiongkok','Jepang','Korea Selatan','Bangladesh']},
   {q:'🇧🇷',a:'Brasil',o:['Portugal','Brasil','Meksiko','Argentina']},
   {q:'🇫🇷',a:'Prancis',o:['Belanda','Italia','Prancis','Irlandia']},
   {q:'🇮🇩',a:'Indonesia',o:['Monako','Polandia','Indonesia','Singapura']},
   {q:'🇨🇦',a:'Kanada',o:['Kanada','Amerika Serikat','Denmark','Austria']}
  ],
  'Tebak Hewan':[
   {q:'Aku mamalia laut terbesar, bernapas dengan paru-paru dan memiliki tubuh sangat besar. Siapakah aku?',a:'Paus biru',o:['Hiu putih','Paus biru','Lumba-lumba','Gajah']},
   {q:'Aku punya belalai panjang dan telinga lebar. Siapakah aku?',a:'Gajah',o:['Badak','Tapir','Gajah','Kuda nil']},
   {q:'Aku aktif pada malam hari dan dapat memutar kepala sangat jauh. Siapakah aku?',a:'Burung hantu',o:['Elang','Burung hantu','Merpati','Kakatua']},
   {q:'Aku dikenal sebagai raja hutan dan memiliki surai pada pejantan. Siapakah aku?',a:'Singa',o:['Harimau','Singa','Macan tutul','Serigala']}
  ],
  'Tebak Film':[
   {q:'Dalam film animasi ini, Elsa memiliki kekuatan es. Judul filmnya?',a:'Frozen',o:['Moana','Frozen','Brave','Tangled']},
   {q:'Seorang penyihir muda bersekolah di Hogwarts. Seri film apakah itu?',a:'Harry Potter',o:['The Hobbit','Harry Potter','Narnia','Percy Jackson']},
   {q:'Keluarga superhero dengan Mr. Incredible dan Elastigirl muncul di film...',a:'The Incredibles',o:['Big Hero 6','The Incredibles','Up','Cars']},
   {q:'Boneka koboi bernama Woody adalah tokoh dari film...',a:'Toy Story',o:['Toy Story','Shrek','Coco','Ratatouille']}
  ],
  'Asah Otak':[
   {q:'Semakin banyak diambil, semakin besar jadinya. Apakah itu?',a:'Lubang',o:['Lubang','Bayangan','Api','Air']},
   {q:'Aku punya kota tetapi tidak punya rumah, punya sungai tetapi tidak punya air. Apakah aku?',a:'Peta',o:['Globe','Peta','Buku','Foto']},
   {q:'Apa yang selalu naik tetapi tidak pernah turun?',a:'Umur',o:['Balon','Asap','Umur','Harga']},
   {q:'Dua ayah dan dua anak pergi memancing. Mereka mendapat tiga ikan dan masing-masing mendapat satu. Bagaimana bisa?',a:'Mereka tiga orang',o:['Satu ikan dibagi','Mereka tiga orang','Ada ikan tambahan','Salah hitung']}
  ]
 };
 const extraQuizSets={
  'Tebak Negara':[{q:'Negara yang terkenal dengan Menara Eiffel?',a:'Prancis',o:['Italia','Prancis','Jerman','Spanyol']},{q:'Negara dengan ibu kota Tokyo?',a:'Jepang',o:['Jepang','Thailand','Vietnam','Korea Selatan']}],
  'Tebak Profesi':[{q:'Orang yang merancang bangunan disebut...',a:'Arsitek',o:['Arsitek','Apoteker','Pilot','Jurnalis']},{q:'Profesi yang memadamkan kebakaran?',a:'Pemadam kebakaran',o:['Dokter','Polisi','Pemadam kebakaran','Masinis']}],
  'Tebak Buah':[{q:'Buah berduri dengan daging kuning dan aroma kuat?',a:'Durian',o:['Nangka','Durian','Mangga','Rambutan']},{q:'Buah berwarna merah dengan biji kecil di bagian luar?',a:'Stroberi',o:['Apel','Stroberi','Jambu','Ceri']}],
  'Tebak Makanan':[{q:'Makanan khas Jepang berupa nasi dengan lauk di atasnya?',a:'Sushi',o:['Rendang','Sushi','Pempek','Gudeg']},{q:'Makanan khas Sumatera Barat berbahan daging dan santan?',a:'Rendang',o:['Rawon','Rendang','Soto','Papeda']}],
  'Tebak Kendaraan':[{q:'Kendaraan rel yang melaju di atas jalur besi?',a:'Kereta',o:['Bus','Kereta','Kapal','Pesawat']},{q:'Kendaraan udara dengan baling-baling dan dapat lepas landas vertikal?',a:'Helikopter',o:['Helikopter','Kapal selam','Truk','Sepeda']}],
  'Tebak Emoji':[{q:'🍕',a:'Pizza',o:['Pizza','Kue','Roti','Burger']},{q:'🦁',a:'Singa',o:['Kucing','Harimau','Singa','Serigala']}],
  'Tebak Logo':[{q:'Logo dengan tiga garis miring yang membentuk huruf seperti gunung?',a:'Adidas',o:['Nike','Adidas','Puma','Reebok']},{q:'Logo apel tergigit identik dengan perusahaan...',a:'Apple',o:['Microsoft','Apple','Google','Samsung']}],
  'Tebak Musik':[{q:'Alat musik berdawai yang dimainkan dengan dipetik dan memiliki enam senar umum?',a:'Gitar',o:['Drum','Gitar','Suling','Terompet']},{q:'Alat musik tradisional angklung berasal dari...',a:'Jawa Barat',o:['Bali','Jawa Barat','Papua','Maluku']}],
  'Tebak Siluet':[{q:'Siluet dengan leher sangat panjang dan kaki tinggi biasanya hewan...',a:'Jerapah',o:['Kuda','Jerapah','Zebra','Unta']},{q:'Siluet hewan berkaki delapan dan membuat jaring?',a:'Laba-laba',o:['Kepiting','Laba-laba','Semut','Kupu-kupu']}],
  'Survival Quiz':[{q:'Saat gempa di dalam ruangan, tindakan awal yang dianjurkan?',a:'Berlindung di bawah meja kokoh',o:['Berlari ke lift','Berlindung di bawah meja kokoh','Berdiri dekat kaca','Menyalakan lilin']},{q:'Jika tersesat saat mendaki, tindakan paling aman?',a:'Berhenti dan hubungi bantuan',o:['Terus berjalan tanpa arah','Berhenti dan hubungi bantuan','Memisahkan diri','Mengikuti aliran sungai sembarang']}]
 };
 const wordBanks={
  'Susun Kata':['KOMPAS','SAMUDRA','MERPATI','JENDELA','KELINCI','ANGKASA'],
  'Tebak Kata':['PAYUNG','GUNTING','SEPEDA','KAMERA','PISANG','KERTAS'],
  'Susun Huruf':['PELangi'.toUpperCase(),'KUMBANG','BINTANG','JAGUNG','PANTAI','LEMARI'],
  'Word Scramble':['KOMET','TEROPONG','KAKTUS','PIRAMIDA','KOMET','MUTIARA']
 };
 function choiceMarkup(q){return `<p class="muted">${q.topic?`Materi: ${q.topic} · `:''}Pilih jawaban yang benar.</p><h2 class="challenge-question">${q.q}</h2><div class="choice-row quiz-options">${q.o.map(x=>`<button class="btn secondary" data-quiz-answer="${escape(x)}">${escape(x)}</button>`).join('')}</div>`}
 const dbGameFiles={
  'Tebak Gambar':'tebakgambar','Tebak Lagu':'tebaklagu','Tebak Kata':'tebakkata','Susun Kata':'susunkata',
  'Tebak Bendera':'tebakbendera','Tebak Logo':'tebaklogo','Tebak ML':'tebakml','Tebak Tebakan':'tebaktebakan',
  'Asah Otak':'asahotak','Siapakah Aku':'siapakahaku','Cak Lontong':'caklontong','Tebak Makanan':'tebakmakanan',
  'Tebak Game':'tebakgame','Lengkapi Kalimat':'lengkapikalimat','Tebak Lirik':'tebaklirik','Tebakan ML':'tebakanml','Tebak Jenaka':'tebakjenaka'
 };
 const dbQuestionCache={};
 function dbAnswer(q,name){return String(q.jawaban||q.name||q.judul||'').trim()}
 function dbPrompt(q,name){
  if(name==='Tebak Lagu')return 'Dengarkan potongan audio berikut, lalu tebak judul lagunya.';
  if(name==='Tebak Gambar'||name==='Tebak Bendera'||name==='Tebak Logo'||name==='Tebak ML'||name==='Tebak Makanan'||name==='Tebak Game')return 'Perhatikan gambar berikut. Apa jawaban yang tepat?';
  if(name==='Susun Kata')return `Susun huruf berikut menjadi kata yang benar. ${q.tipe?`Kategori: ${q.tipe}`:''}`;
  return String(q.soal||q.pertanyaan||q.deskripsi||'Jawab pertanyaan berikut.');
 }
 function dbQuestionMarkup(name,q,index,total){
  const answer=dbAnswer(q,name),hint=String(q.deskripsi||q.artis||q.tipe||'Gunakan petunjuk untuk membuka huruf jawaban.');
  let media='';
  if(q.img)media=`<img class="db-question-image" src="${escape(q.img)}" alt="Gambar pertanyaan" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><small class="db-image-fallback" hidden>Gambar tidak dapat dimuat dari sumber aslinya.</small>`;
  if(q.lagu)media=`<div class="db-audio-card"><span>🎧</span><div><b>Audio Pertanyaan</b><small>${escape(q.artis||'Dengarkan lalu tebak judul')}</small></div><audio controls preload="none" src="${escape(q.lagu)}">Browser tidak mendukung audio.</audio></div>`;
  let clue='';
  if(name==='Tebak Kata')clue=`<div class="db-clue">💡 Petunjuk kata: ${escape(q.soal||'')}</div>`;
  if(name==='Susun Kata')clue=`<div class="db-clue db-scramble">🔤 ${escape(q.soal||'')}</div>`;
  if(name==='Tebak Bendera')clue=`<div class="db-clue">🌍 Tebak nama negara dari benderanya.</div>`;
  return `<div class="db-question-head"><span>SOAL ${index+1} / ${total}</span><b>${Math.round((index+1)/total*100)}%</b></div><div class="db-progress"><i style="width:${(index+1)/total*100}%"></i></div><p class="db-prompt">${escape(dbPrompt(q,name))}</p>${media}${clue}<input id="dbAnswerInput" class="db-answer-input" autocomplete="off" placeholder="Ketik jawabanmu..." ${name==='Tebak Lagu'?'':'autocapitalize="characters"'}><div class="db-action-row"><button class="btn primary" data-db-check>Periksa Jawaban</button><button class="btn secondary" data-db-hint>💡 Petunjuk</button></div><p id="dbHintText" class="db-hint-text" aria-live="polite"></p><div id="dbFeedback" aria-live="polite"></div>`;
 }
 async function startDatabaseGame(name,index=0){
  const file=dbGameFiles[name];if(!file)return;
  try{
   if(!dbQuestionCache[file]){const r=await fetch(`/game-data/${file}.json`,{cache:'no-cache'});if(!r.ok)throw Error('Database soal tidak ditemukan: '+file);dbQuestionCache[file]=await r.json()}
   const rows=dbQuestionCache[file];if(!Array.isArray(rows)||!rows.length)throw Error('Database soal kosong.');
   if(!current||current.name!==name)return;
   current.dbIndex=index;current.dbRows=rows;current.dbHint=0;current.rewarded=false;
   if(index>=rows.length){$('#miniGameBody').innerHTML=`<div class="db-finish"><h2>🏆 Semua soal selesai!</h2><p>Kamu sudah menyelesaikan ${rows.length} soal ${escape(name)}.</p><button class="btn primary" data-db-restart>Main Lagi</button></div>`;return}
   const q=rows[index];current.dbQuestion=q;current.dbCorrect=dbAnswer(q,name);
   $('#miniGameBody').innerHTML=dbQuestionMarkup(name,q,index,rows.length);
   $('#miniGameBody').scrollIntoView({behavior:'smooth',block:'nearest'});
  }catch(err){$('#miniGameBody').innerHTML=`<p class="error-text">Gagal memuat database game: ${escape(err.message)}</p><button class="btn secondary" data-db-restart>Coba lagi</button>`}
 }
 function normalizeDbAnswer(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]/g,'')}
 function challenge(index){
  if(timer){clearTimeout(timer);timer=null}
  const [name,cat,emoji]=games[index];current={index,name,rewarded:false};target=null;
  $('#miniGameTitle').textContent=name;$('#miniGamePanel').classList.remove('hidden');
  let body='';
  if(dbGameFiles[name]){startDatabaseGame(name,0);return}
  if(name==='Batu Gunting Kertas'){
   body=`<p>Pilih gerakan. Batu mengalahkan gunting, gunting mengalahkan kertas, dan kertas mengalahkan batu.</p><div class="choice-row">${['Batu','Gunting','Kertas'].map(x=>`<button class="btn secondary" data-rps="${x}">${x}</button>`).join('')}</div>`;
  } else if(name==='Tantangan Fokus'){
   const symbols=['●','▲','■','◆'];const pattern=Array.from({length:5},()=>symbols[Math.floor(Math.random()*symbols.length)]);current.focusPattern=pattern;
   body=`<p>Ingat urutan lima simbol. Setelah simbol disembunyikan, ulangi urutannya dengan mengetik simbolnya (● ▲ ■ ◆).</p><h2 class="challenge-question" id="focusPattern">${pattern.join('　')}</h2><input id="challengeAnswer" placeholder="Contoh: ● ▲ ■ ◆ ●"><button class="btn primary" id="submitChallenge">Periksa ingatan</button>`;setTimeout(()=>{const p=$('#focusPattern');if(p)p.textContent='Simbol disembunyikan';},1800);
  } else if(name==='Reaksi Kilat'){

   body=`<p>Uji fokus dan kecepatan refleks. Tekan tombol setelah berubah hijau.</p><button id="reactionBtn" class="reaction-btn" disabled>Tunggu sinyal...</button>`;
   const delay=1200+Math.random()*2400;timer=setTimeout(()=>{const b=$('#reactionBtn');if(!b||!current||current.name!==name)return;b.disabled=false;b.classList.add('ready');b.textContent='KLIK SEKARANG!';started=Date.now()},delay);
  } else if(name==='Hitung Mundur'){
   current.countdown=5;body=`<p>Mulai hitung mundur dari 5. Tekan tombol tepat ketika angka mencapai NOL!</p><h2 class="challenge-question" id="countdownValue">5</h2><button class="btn primary" id="startCountdown">Mulai</button><button class="btn secondary" id="stopCountdown" disabled>STOP!</button>`;
  } else if(name==='Tebak Angka'||name==='Tebak Nomor'){
   const max=name==='Tebak Angka'?20:100;target=String(1+Math.floor(Math.random()*max));
   body=`<p>Tebak angka rahasia dari 1 sampai ${max}. Masukkan tebakanmu, lalu gunakan petunjuk lebih besar atau lebih kecil.</p><input id="challengeAnswer" type="number" min="1" max="${max}" placeholder="Angka tebakan"><button class="btn primary" id="submitChallenge">Tebak</button>`;
  } else if(name==='Bom Angka'){
   const bomb=1+Math.floor(Math.random()*6);current.bomb=bomb;
   body=`<p>Pilih satu kotak yang aman. Ada satu bom tersembunyi di antara enam kotak.</p><div class="choice-row">${[1,2,3,4,5,6].map(n=>`<button class="btn secondary" data-bomb="${n}">Kotak ${n}</button>`).join('')}</div>`;
  } else if(name==='Matematika Pro'||name==='Hitung Cepat'){
   let a,b,op,answer;
   if(name==='Matematika Pro'){const level=Math.min(3,Math.max(1,Math.ceil((Number(window.gameLevel)||1)/3)));a=level===1?Math.ceil(Math.random()*20):Math.ceil(Math.random()*100);b=level===1?Math.ceil(Math.random()*10):Math.ceil(Math.random()*30);op=['+','−','×'][Math.floor(Math.random()*(level===1?2:3))];answer=op==='+'?a+b:op==='−'?a-b:a*b;}
   else {a=2+Math.floor(Math.random()*18);b=2+Math.floor(Math.random()*12);op='+';answer=a+b;}
   target=String(answer);body=`<p>${name==='Matematika Pro'?'Latihan matematika bertahap. Selesaikan operasi berikut:':'Tebak hasil operasi berikut:'}</p><h2 class="challenge-question">${a} ${op} ${b} = ?</h2><input id="challengeAnswer" inputmode="numeric" placeholder="Jawaban angka"><button class="btn primary" id="submitChallenge">Periksa jawaban</button>`;
  } else if(name==='Urutkan Angka'){
   const nums=[2,5,1,4,3].sort(()=>Math.random()-.5);target='1,2,3,4,5';
   body=`<p>Urutkan angka dari yang terkecil ke terbesar.</p><h2 class="challenge-question">${nums.join(' · ')}</h2><input id="challengeAnswer" placeholder="Contoh: 1,2,3,4,5"><button class="btn primary" id="submitChallenge">Periksa urutan</button>`;
  } else if(name==='Kode Rahasia'){
   const codes=[{c:'1 - 2 - 3 - 5',a:'ABCE'},{c:'18 - 1 - 6 - 9',a:'RAFI'},{c:'2 - 15 - 20',a:'BOT'}],v=codes[Math.floor(Math.random()*codes.length)];target=v.a;
   body=`<p>Setiap angka mewakili urutan huruf alfabet (1=A, 2=B, dan seterusnya). Pecahkan kode ini.</p><h2 class="challenge-question">${v.c}</h2><input id="challengeAnswer" placeholder="Masukkan kata"><button class="btn primary" id="submitChallenge">Buka kode</button>`;
  } else if(name==='Bentuk Sama'){
   const shapes=[['Lingkaran','●'],['Segitiga','▲'],['Persegi','■'],['Bintang','★']];const v=shapes[Math.floor(Math.random()*shapes.length)];target=v[0];
   body=`<p>Pilih nama bentuk yang ditampilkan.</p><h2 class="challenge-question" style="font-size:64px">${v[1]}</h2><div class="choice-row">${shapes.sort(()=>Math.random()-.5).map(x=>`<button class="btn secondary" data-quiz-answer="${x[0]}">${x[0]}</button>`).join('')}</div>`;
  } else if(quizSets[name]||extraQuizSets[name]){
   const list=quizSets[name]||extraQuizSets[name],q=list[Math.floor(Math.random()*list.length)];target=q.a;
   body=choiceMarkup(q);
  } else if(name==='Susun Kata'||name==='Tebak Kata'||name==='Susun Huruf'||name==='Word Scramble'){
   const bank=wordBanks[name]||wordBanks['Susun Kata'];const word=bank[Math.floor(Math.random()*bank.length)];target=word;
   const scrambled=word.split('').sort(()=>Math.random()-.5).join(' · ');
   body=`<p>Susun kembali huruf-huruf berikut menjadi kata yang benar.</p><h2 class="challenge-question">${scrambled}</h2><input id="challengeAnswer" placeholder="Ketik kata jawaban"><button class="btn primary" id="submitChallenge">Periksa jawaban</button>`;
  } else if(name==='Memory Flip'||name==='Cari Pasangan'||name==='Simon Memory'){
   const icons=['🍎','🚀','🐱','🌈'];const cards=[...icons,...icons].sort(()=>Math.random()-.5);
   current.memory={first:null,matched:[],busy:false};
   body=`<p>Temukan semua pasangan ikon yang sama. Buka dua kartu setiap giliran.</p><div class="memory-grid">${cards.map((x,i)=>`<button class="memory-card" data-memory="${i}" data-value="${x}">?</button>`).join('')}</div>`;
   current.memory.cards=cards;
  } else if(name==='Tic Tac Toe'){
   body=`<p>Mainkan X. Dapatkan tiga tanda sejajar sebelum bot.</p><div class="tic-grid">${Array.from({length:9},(_,i)=>`<button class="memory-card" data-ttt="${i}"> </button>`).join('')}</div>`;current.ttt=Array(9).fill('');
  } else if(name==='Puzzle Geser'){
   const tiles=[1,2,3,0];for(let k=0;k<10;k++){const blank=tiles.indexOf(0),neighbors=[blank-2,blank+2,...(blank%2?[blank-1]:[blank+1])].filter(n=>n>=0&&n<4);const pick=neighbors[Math.floor(Math.random()*neighbors.length)];[tiles[blank],tiles[pick]]=[tiles[pick],tiles[blank]]}current.slideTiles=tiles;
   body=`<p>Geser ubin ke kotak kosong hingga urutannya menjadi 1, 2, 3, 4.</p><div class="memory-grid" id="slideGrid">${tiles.map((v,i)=>`<button class="memory-card" data-slide="${i}">${v||''}</button>`).join('')}</div><p id="slideStatus">Susun angka dari kiri ke kanan.</p>`;
  } else if(name==='Pilih Kotak'){
   const prizes=['💎 Hadiah langka','🪙 Koin bonus','⭐ Bintang emas','🎁 Kotak kejutan'];const safe=Math.floor(Math.random()*6);current.safeBox=safe;
   body=`<p>Pilih satu dari enam kotak. Hanya satu kotak berisi hadiah utama!</p><div class="choice-row">${Array.from({length:6},(_,i)=>`<button class="btn secondary" data-prize-box="${i}">Kotak ${i+1}</button>`).join('')}</div>`;
  } else if(name==='Klik Target'){
   const targetSpot=Math.floor(Math.random()*9);current.targetSpot=targetSpot;
   body=`<p>Temukan dan klik target 🎯 di antara sembilan kotak secepat mungkin.</p><div class="memory-grid">${Array.from({length:9},(_,i)=>`<button class="memory-card" data-target-spot="${i}">${i===targetSpot?'🎯':'·'}</button>`).join('')}</div>`;
  } else if(name==='Labirin Mini'){
   const routes=[['⬆️','➡️','⬇️'],['➡️','➡️','⬆️'],['⬇️','⬅️','⬆️']];const route=routes[Math.floor(Math.random()*routes.length)];current.route=route.join('|');
   body=`<p>Ikuti jalur keluar labirin dengan memilih arah secara berurutan.</p><h2 class="challenge-question">🚪 Mulai → 🏁</h2><div class="choice-row">${['⬆️','⬇️','⬅️','➡️'].map(x=>`<button class="btn secondary" data-maze="${x}">${x}</button>`).join('')}</div><p id="mazeProgress">Langkah 0 dari ${route.length}</p>`;current.mazeSteps=[];
  } else if(name==='Tangkap Bintang'){
   const star=Math.floor(Math.random()*8);current.star=star;
   body=`<p>Tangkap bintang ⭐ yang bergerak di antara awan. Pilih lokasi bintang!</p><div class="memory-grid">${Array.from({length:8},(_,i)=>`<button class="memory-card" data-star="${i}">☁️</button>`).join('')}</div>`;
  } else if(name==='Lompat Rintangan'){
   const sequence=Array.from({length:5},()=>Math.random()>.45?'🪵':'🌿');current.jumps=sequence;current.jumpStep=0;
   body=`<p>Lompati rintangan 🪵 dan lewati semak 🌿. Tekan lompat hanya saat ada kayu.</p><h2 class="challenge-question" id="jumpTrack">${sequence.join('　')}</h2><p id="jumpStatus">Rintangan 1 dari 5</p><button class="btn primary" id="jumpNow">Lompat 🏃</button>`;
  } else if(name==='Hindari Bom'){
   const lanes=Array.from({length:4},()=>Math.floor(Math.random()*3));current.safeLanes=lanes;current.laneStep=0;
   body=`<p>Pilih jalur yang aman untuk menghindari bom. Selesaikan empat putaran.</p><p id="laneStatus">Putaran 1 dari 4</p><div class="choice-row">${['Jalur kiri','Jalur tengah','Jalur kanan'].map((x,i)=>`<button class="btn secondary" data-lane="${i}">${x}</button>`).join('')}</div>`;
  } else if(name==='Kartu Duel'){
   const player=2+Math.floor(Math.random()*9),opponent=2+Math.floor(Math.random()*9);current.duel={player,opponent};
   body=`<p>Pilih kartu dengan kekuatan lebih tinggi dari kartu lawan.</p><div class="choice-row"><button class="btn secondary" data-duel="${player}">🛡️ Kartu kamu: ${player}</button><span>Kartu lawan: ${opponent} ⚔️</span></div>`;
  } else if(name==='Dadu Keberuntungan'){
   const goal=8+Math.floor(Math.random()*5);current.diceGoal=goal;
   body=`<p>Lempar dua dadu. Raih total minimal ${goal} untuk menang.</p><button class="btn primary" id="rollDice">🎲 Lempar dadu</button><p id="diceResult"></p>`;
  } else if(name==='Roda Hadiah'){
   const wheel=['🍀 Keberuntungan','💎 Permata','⭐ Bintang','🎁 Hadiah misteri','🪙 Koin'];
   body=`<p>Putar roda untuk mendapatkan hadiah acak.</p><button class="btn primary" id="spinWheel">🎡 Putar roda</button><h2 class="challenge-question" id="wheelResult">?</h2>`;current.wheel=wheel;
  } else if(name==='Cari Perbedaan'){
   const pairs=[['🍎 🍌 🍇 🍉','🍎 🍌 🍓 🍉','🍓'],['🚗 🚕 🚌 🚙','🚗 🚕 🚲 🚙','🚲'],['🐶 🐱 🐰 🐼','🐶 🐱 🦊 🐼','🦊']];const pair=pairs[Math.floor(Math.random()*pairs.length)];target=pair[2];
   body=`<p>Temukan emoji yang berubah pada baris kedua.</p><h2 class="challenge-question">${pair[0]}<br>${pair[1]}</h2><div class="choice-row">${[...new Set([...pair[0].split(' '),...pair[1].split(' ')])].map(x=>`<button class="btn secondary" data-quiz-answer="${x}">${x}</button>`).join('')}</div>`;
  } else if(name==='Keseimbangan'){
   const left=1+Math.floor(Math.random()*8),right=1+Math.floor(Math.random()*8);target=left===right?'Seimbang':left>right?'Kiri lebih berat':'Kanan lebih berat';
   body=`<p>Tentukan sisi timbangan yang lebih berat.</p><h2 class="challenge-question">⚖️ ${left} kg　|　${right} kg</h2><div class="choice-row">${['Kiri lebih berat','Seimbang','Kanan lebih berat'].map(x=>`<button class="btn secondary" data-quiz-answer="${x}">${x}</button>`).join('')}</div>`;
  } else if(name==='Mini Sudoku'){
   const puzzle='1 _ | _ 4\n_ 4 | 1 _\n---------\n2 _ | _ 3\n_ 3 | 2 _';target='3,2,3,2,4,1,4,1';
   body=`<p>Isi kotak kosong Sudoku 4×4 dengan angka 1–4. Masukkan delapan angka sesuai urutan baris.</p><pre class="challenge-question">${puzzle}</pre><input id="challengeAnswer" placeholder="Contoh: 3,2,3,2,4,1,4,1"><button class="btn primary" id="submitChallenge">Periksa Sudoku</button>`;
  } else {
   const q=quizSets['Asah Otak'][Math.floor(Math.random()*quizSets['Asah Otak'].length)];target=q.a;
   body=choiceMarkup(q);
   body=`<p>Mini tantangan ${escape(name)}: pecahkan teka-teki berikut.</p>${body}`;
  }
  current.retryMarkup=body;current.retryTarget=target;$('#miniGameBody').innerHTML=body;$('#miniGamePanel').scrollIntoView({behavior:'smooth',block:'start'});
 }
 async function reward(){if(!current||current.rewarded)return;current.rewarded=true;try{const d=await request('/game/reward',{method:'POST',body:JSON.stringify({game:current.name})});drawProfile(d.profile);drawRpg(d.profile);if(visualGame&&current.index>=1000){const status=$('#visualGameStatus');if(status)status.textContent='🏆 '+d.message+' · Hadiah masuk ke dompet!'}else{$('#miniGameBody').insertAdjacentHTML('beforeend',`<p class="game-success">🎉 ${escape(d.message)}</p>`)}}catch(e){if(current)current.rewarded=false;if(visualGame&&current.index>=1000){const status=$('#visualGameStatus');if(status)status.textContent='Hadiah gagal diproses: '+e.message}else alert(e.message)}}
 $('#gameGrid')?.addEventListener('click',e=>{const b=e.target.closest('[data-game]');if(b)challenge(Number(b.dataset.game))});
 $('#gameSearch')?.addEventListener('input',renderGames);
 $$('.game-filter').forEach(b=>b.onclick=()=>{$$('.game-filter').forEach(x=>x.classList.toggle('active',x===b));category=b.dataset.gameFilter;renderGames()});
 $('#closeMiniGame')?.addEventListener('click',()=>{$('#miniGamePanel').classList.add('hidden');current=null});
 $('#miniGameBody')?.addEventListener('click',async e=>{
  if(e.target.closest('[data-db-check]')){
   const input=$('#dbAnswerInput'),feedback=$('#dbFeedback');if(!input||!current?.dbCorrect)return;
   if(normalizeDbAnswer(input.value)===normalizeDbAnswer(current.dbCorrect)){
    input.disabled=true;$('#miniGameBody').querySelectorAll('[data-db-check],[data-db-hint]').forEach(b=>b.disabled=true);
    feedback.innerHTML='<p class="game-success">✅ Jawaban benar! Hebat!</p><button class="btn primary" data-db-next>Soal Selanjutnya →</button>';
    await reward();
   }else{feedback.innerHTML='<p class="db-wrong">❌ Jawaban belum tepat. Coba lagi!</p><button class="btn secondary" data-db-retry>Coba Lagi</button>';}
   return;
  }
  if(e.target.closest('[data-db-retry]')){const input=$('#dbAnswerInput');if(input){input.value='';input.focus()}$('#dbFeedback').innerHTML='';return}
  if(e.target.closest('[data-db-hint]')){
   const q=current?.dbQuestion;if(!q)return;const answer=dbAnswer(q,current.name),hint=$('#dbHintText');current.dbHint=(current.dbHint||0)+1;
   const reveal=answer.slice(0,Math.min(current.dbHint,answer.length)).split('').map((c,i)=>c===' '?'　':c).join('');
   const extra=q.deskripsi||q.artis||q.tipe||'';hint.textContent=`Petunjuk huruf: ${reveal}${current.dbHint>=answer.length?'':' · '+(extra||'Huruf berikutnya akan terbuka saat tombol petunjuk ditekan lagi.')}`;
   return;
  }
  if(e.target.closest('[data-db-next]')){if(current)startDatabaseGame(current.name,(current.dbIndex||0)+1);return}
  if(e.target.closest('[data-db-restart]')){if(current)startDatabaseGame(current.name,0);return}
  const r=e.target.closest('[data-rps]');if(r){const choices=['Batu','Gunting','Kertas'],bot=choices[Math.floor(Math.random()*3)],you=r.dataset.rps;const win=you===bot?'seri':(you==='Batu'&&bot==='Gunting'||you==='Gunting'&&bot==='Kertas'||you==='Kertas'&&bot==='Batu')?'menang':'kalah';$('#miniGameBody').insertAdjacentHTML('beforeend',`<p>Bot memilih ${bot}. Kamu ${win}.</p>`);if(win==='menang')reward();return}
  const answer=e.target.closest('[data-quiz-answer]');if(answer){if(answer.dataset.quizAnswer===String(target)){answer.classList.add('selected');$('#miniGameBody').insertAdjacentHTML('beforeend','<p class="game-success">Jawaban benar! 🎉</p><div class="quiz-result-actions"><button class="btn primary" data-quiz-next>Selanjutnya →</button><button class="btn secondary" data-quiz-retry>Ulangi</button></div>');$('#miniGameBody').querySelectorAll('[data-quiz-answer]').forEach(x=>x.disabled=true);reward()}else{answer.disabled=true;answer.textContent+=' · Salah';let box=$('#quizRetryActions');if(!box){$('#miniGameBody').insertAdjacentHTML('beforeend','<div id="quizRetryActions" class="quiz-result-actions"><p>Belum tepat. Coba lagi ya!</p><button class="btn primary" data-quiz-retry>Coba Lagi</button></div>')}}return}
  if(e.target.closest('[data-quiz-next]')){challenge(current.index);return}if(e.target.closest('[data-quiz-retry]')){if(current?.retryMarkup&&current.retryTarget!==null){target=current.retryTarget;current.rewarded=false;$('#miniGameBody').innerHTML=current.retryMarkup;const input=$('#challengeAnswer');if(input)input.focus()}else challenge(current.index);return}
  const card=e.target.closest('[data-memory]');if(card&&current?.memory&&!current.memory.busy){const m=current.memory,i=Number(card.dataset.memory);if(m.matched.includes(i)||m.first===i)return;card.textContent=m.cards[i];card.classList.add('flipped');if(m.first===null){m.first=i;return}const first=m.first;m.first=null;if(m.cards[first]===m.cards[i]){m.matched.push(first,i);if(m.matched.length===m.cards.length){$('#miniGameBody').insertAdjacentHTML('beforeend','<p class="game-success">Semua pasangan ditemukan!</p>');reward()}}else{m.busy=true;setTimeout(()=>{const a=$(`[data-memory="${first}"]`),b=$(`[data-memory="${i}"]`);if(a){a.textContent='?';a.classList.remove('flipped')}if(b){b.textContent='?';b.classList.remove('flipped')}m.busy=false},650)}return}
  const bombChoice=e.target.closest('[data-bomb]');if(bombChoice){const n=Number(bombChoice.dataset.bomb);if(n===current.bomb){bombChoice.textContent='💥 BOOM';$('#miniGameBody').insertAdjacentHTML('beforeend','<p>Terkena bom! Coba lagi di permainan berikutnya.</p>')}else{bombChoice.textContent='⭐ Aman';bombChoice.disabled=true;$('#miniGameBody').insertAdjacentHTML('beforeend','<p class="game-success">Kotak aman ditemukan!</p>');reward()}return}
  const slide=e.target.closest('[data-slide]');if(slide&&current?.slideTiles){const tiles=current.slideTiles,i=Number(slide.dataset.slide),blank=tiles.indexOf(0),adjacent=[blank-2,blank+2,...(blank%2?[blank-1]:[blank+1])];if(!adjacent.includes(i))return;[tiles[i],tiles[blank]]=[tiles[blank],tiles[i]];$('#slideGrid').innerHTML=tiles.map((v,n)=>`<button class="memory-card" data-slide="${n}">${v||''}</button>`).join('');if(tiles.join(',')==='1,2,3,0'){$('#slideStatus').textContent='Puzzle selesai!';$('#miniGameBody').insertAdjacentHTML('beforeend','<p class="game-success">Susunan berhasil diselesaikan!</p>');reward()}return}
  const prize=e.target.closest('[data-prize-box]');if(prize){if(Number(prize.dataset.prizeBox)===current.safeBox){prize.textContent='🎁 Hadiah!';$('#miniGameBody').insertAdjacentHTML('beforeend','<p class="game-success">Kamu menemukan kotak hadiah utama!</p>');reward()}else{prize.textContent='📦 Kosong';prize.disabled=true}return}
  const targetSpot=e.target.closest('[data-target-spot]');if(targetSpot){if(Number(targetSpot.dataset.targetSpot)===current.targetSpot){targetSpot.textContent='🎯';$('#miniGameBody').insertAdjacentHTML('beforeend','<p class="game-success">Target berhasil ditemukan!</p>');reward()}else{targetSpot.textContent='✖';targetSpot.disabled=true}return}
  const maze=e.target.closest('[data-maze]');if(maze&&current?.mazeSteps){current.mazeSteps.push(maze.dataset.maze);const step=current.mazeSteps.length;$('#mazeProgress').textContent=`Langkah ${step} dari 3`;if(current.mazeSteps.join('|')===current.route){$('#miniGameBody').insertAdjacentHTML('beforeend','<p class="game-success">Kamu berhasil keluar dari labirin!</p>');reward()}else if(step>=3){$('#mazeProgress').textContent='Jalur belum tepat. Tutup dan coba lagi.'}return}
  const star=e.target.closest('[data-star]');if(star){if(Number(star.dataset.star)===current.star){star.textContent='⭐';$('#miniGameBody').insertAdjacentHTML('beforeend','<p class="game-success">Bintang berhasil ditangkap!</p>');reward()}else{star.textContent='☁️';star.disabled=true}return}
  if(e.target.id==='jumpNow'){const i=current.jumpStep;if(i>=current.jumps.length)return;const obstacle=current.jumps[i];if(obstacle==='🪵'){current.jumpStep++;$('#jumpStatus').textContent=`Berhasil! Rintangan ${current.jumpStep+1} dari 5`;if(current.jumpStep===5){$('#miniGameBody').insertAdjacentHTML('beforeend','<p class="game-success">Semua rintangan berhasil dilewati!</p>');reward()}}else{e.target.disabled=true;$('#jumpStatus').textContent='Kamu melompat terlalu cepat. Coba game lagi.'}return}
  const lane=e.target.closest('[data-lane]');if(lane){const chosen=Number(lane.dataset.lane),safe=current.safeLanes[current.laneStep];if(chosen===safe){current.laneStep++;$('#laneStatus').textContent=`Aman! Putaran ${current.laneStep+1} dari 4`;if(current.laneStep===4){$('#miniGameBody').insertAdjacentHTML('beforeend','<p class="game-success">Kamu berhasil menghindari semua bom!</p>');reward()}}else{lane.textContent='💥';lane.disabled=true;$('#laneStatus').textContent='Terkena bom! Coba permainan lagi.'}return}
  const duel=e.target.closest('[data-duel]');if(duel){const p=Number(duel.dataset.duel),o=current.duel.opponent;$('#miniGameBody').insertAdjacentHTML('beforeend',`<p>Kekuatanmu ${p} vs lawan ${o}.</p>`);if(p>o)reward();else $('#miniGameBody').insertAdjacentHTML('beforeend','<p>Kartu lawan lebih kuat. Belum menang!</p>');duel.disabled=true;return}
  if(e.target.id==='startCountdown'){e.target.disabled=true;$('#stopCountdown').disabled=false;let value=5;$('#countdownValue').textContent=value;timer=setInterval(()=>{value--;$('#countdownValue').textContent=value;if(value<=0){clearInterval(timer);timer=null;$('#stopCountdown').disabled=false;$('#countdownValue').textContent='0';}},1000);return}
  if(e.target.id==='stopCountdown'){const v=Number($('#countdownValue').textContent);if(v===0){$('#miniGameBody').insertAdjacentHTML('beforeend','<p class="game-success">Tepat waktu! Hitung mundur selesai.</p>');reward()}else{$('#miniGameBody').insertAdjacentHTML('beforeend','<p>Belum sampai nol. Coba lagi.</p>')}e.target.disabled=true;return}
  if(e.target.id==='rollDice'){const d1=1+Math.floor(Math.random()*6),d2=1+Math.floor(Math.random()*6),sum=d1+d2;$('#diceResult').textContent=`Dadu: ${d1} + ${d2} = ${sum}. Target: ${current.diceGoal}`;if(sum>=current.diceGoal)reward();else e.target.textContent='Coba lempar lagi';return}
  if(e.target.id==='spinWheel'){const v=current.wheel[Math.floor(Math.random()*current.wheel.length)];$('#wheelResult').textContent=v;reward();e.target.disabled=true;return}
  if(e.target.id==='reactionBtn'){if(!started)return;const ms=Date.now()-started;$('#miniGameBody').insertAdjacentHTML('beforeend',`<p>Waktu reaksi ${ms} ms.</p>`);if(ms<1500)reward();else{e.target.disabled=true;e.target.textContent='Coba buka game lagi';}return}
  if(e.target.id==='submitChallenge'){const val=($('#challengeAnswer').value||'').trim().toLowerCase();const correct=current.name==='Kata Berantai'?val.startsWith(String(target)):current.name==='Urutkan Angka'?val.replace(/\s/g,'')===String(target):current.name==='Tantangan Fokus'?val.replace(/\s/g,'')===current.focusPattern.join(''):val===String(target).toLowerCase();if(correct){$('#miniGameBody').insertAdjacentHTML('beforeend','<p class="game-success">Jawaban benar! 🎉</p><div class="quiz-result-actions"><button class="btn primary" data-quiz-next>Selanjutnya →</button><button class="btn secondary" data-quiz-retry>Ulangi</button></div>');$('#submitChallenge').disabled=true;reward()}else if(current.name==='Tebak Angka'||current.name==='Tebak Nomor'){const guess=Number(val),secret=Number(target);$('#miniGameBody').insertAdjacentHTML('beforeend',`<p>Angka rahasia ${guess<secret?'lebih besar':'lebih kecil'}. Coba lagi!</p><button class="btn primary" data-quiz-retry>Coba Lagi</button>`)}else{$('#miniGameBody').insertAdjacentHTML('beforeend','<p>Jawaban belum tepat. Coba lagi!</p><button class="btn primary" data-quiz-retry>Coba Lagi</button>')}return}
  const cell=e.target.closest('[data-ttt]');if(cell&&current?.ttt){const board=current.ttt,i=Number(cell.dataset.ttt);if(board[i])return;board[i]='X';cell.textContent='X';const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];if(lines.some(l=>l.every(n=>board[n]==='X'))){$('#miniGameBody').insertAdjacentHTML('beforeend','<p class="game-success">Kamu menang!</p>');reward();return}const free=board.map((v,n)=>v?null:n).filter(v=>v!==null);if(free.length){const j=free[Math.floor(Math.random()*free.length)];board[j]='O';const bot=$(`[data-ttt="${j}"]`);if(bot)bot.textContent='O';if(lines.some(l=>l.every(n=>board[n]==='O')))$('#miniGameBody').insertAdjacentHTML('beforeend','<p>Bot menang. Coba lagi!</p>')}return}
 });
 $('#gameShop')?.addEventListener('click',async e=>{const b=e.target.closest('[data-buy]');if(!b)return;try{const d=await request('/game/shop/buy',{method:'POST',body:JSON.stringify({item:b.dataset.buy})});drawRpg(d.profile);alert(d.message)}catch(x){alert(x.message)}});
 $$('.rpg-action').forEach(b=>b.onclick=async()=>{try{const d=await request('/game/action',{method:'POST',body:JSON.stringify({action:b.dataset.rpgAction})});drawRpg(d.profile);alert(d.message)}catch(e){alert(e.message)}});
 $('#sendTrade')?.addEventListener('click',async()=>{try{const d=await request('/game/transfer',{method:'POST',body:JSON.stringify({recipient:$('#tradeRecipient').value,item:$('#tradeItem').value,qty:$('#tradeQty').value})});drawRpg(d.profile);alert(d.message)}catch(e){alert(e.message)}});
 async function loadPlayers(){try{const d=await request('/game/players');$('#playerList').innerHTML='<small class="muted">Pemain terdaftar</small><div class="peer-list">'+d.players.map(p=>`<button class="peer-chip" data-peer="${escape(p.name)}">● ${escape(p.name)}</button>`).join('')+'</div>'}catch{}}
 $('#playerList')?.addEventListener('click',e=>{const b=e.target.closest('[data-peer]');if(b)$('#tradeRecipient').value=b.dataset.peer});
 window.addEventListener('rafibot:entered',()=>{loadProfile();loadPlayers()});
 document.addEventListener('DOMContentLoaded',()=>{renderGames();renderShop()});

 // 40 visual HTML mini-games. Each world has its own theme, character, obstacle and reward target.
 const visualWorlds=[
  ['Sky Runner','🏃','☁️','🪨','#79c9ed','#254c7d','Lari di atas awan'],['Jungle Dash','🐯','🌴','🪵','#8cce75','#22533d','Terobos hutan'],['Candy Valley','🍬','🍭','🍫','#f6a8d1','#884b91','Kumpulkan permen'],['Space Explorer','👨‍🚀','🪐','☄️','#17234f','#5840a8','Jelajahi luar angkasa'],['Desert Escape','🧑‍🚀','🌵','🦂','#f2bd70','#a85d31','Kabur dari gurun'],
  ['Ocean Surfer','🏄','🌊','🦀','#54c9dc','#17678d','Meluncur di ombak'],['Ninja Shadow','🥷','🏮','🗡️','#25283d','#6b3d70','Lompati jebakan ninja'],['Dino Adventure','🦖','🌋','🌵','#8bcf91','#315d3d','Bertahan di zaman purba'],['Robot Factory','🤖','⚙️','🔩','#9ac5d9','#3c5870','Hindari mesin pabrik'],['Volcano Run','🧑‍🚒','🔥','🪨','#ef825b','#713b39','Lari dari gunung api'],
  ['Snowboard Rush','⛷️','❄️','🧊','#c5e9fa','#537dba','Meluncur di salju'],['Castle Knight','🛡️','🏰','⚔️','#a9a4e8','#4d477d','Petualangan kastil'],['Pirate Treasure','🏴‍☠️','💎','🦀','#e6bd78','#4c7580','Cari harta bajak laut'],['Farm Hop','🐰','🌽','🪵','#a6d68a','#4d8753','Lompat di ladang'],['Neon City','🛹','🌃','🚧','#493b91','#171d4a','Kejar skor di kota'],
  ['Dragon Flight','🐉','✨','🪨','#a58be6','#493b82','Terbang melewati batu'],['Bee Garden','🐝','🌼','🌵','#f2d76f','#65915a','Kumpulkan madu'],['Monster Run','👾','🧪','🕸️','#9a7bd1','#4c3b77','Kabur dari monster'],['Rocket Jump','🚀','🌙','☄️','#5a8be0','#25396f','Melompat di planet'],['Safari Quest','🦓','🌴','🪵','#d6c47c','#667847','Jelajah sabana'],
  ['City Delivery','🚴','📦','🚗','#77b8dd','#385d87','Antar paket'],['Ghost Mansion','👻','🕯️','🦇','#756c9d','#292b4a','Keluar dari rumah hantu'],['Crystal Cave','🧙','💎','🪨','#8ad6d1','#355d76','Cari kristal'],['Racing Track','🏎️','🏁','🛞','#e68b78','#784a4b','Balapan cepat'],['Jelly Jump','🪼','🫧','🪸','#80d6df','#3c7396','Lompat di laut'],
  ['Samurai Trail','👺','🌸','🗡️','#e69ab5','#71435d','Lewati jalur samurai'],['Arctic Fox','🦊','🌨️','🧊','#c6e4ed','#557c9b','Bertahan di kutub'],['Magic Forest','🧚','🍄','🌵','#8bd19b','#386a57','Hutan penuh sihir'],['Galaxy Miner','👨‍🚀','🪙','☄️','#5259a8','#242c65','Tambang koin galaksi'],['Pumpkin Night','🎃','🌙','🦇','#e99b55','#6a3d58','Lari malam Halloween'],
  ['Penguin Slide','🐧','🐟','🧊','#a4d9ed','#4a7297','Meluncur bersama penguin'],['Wild West','🤠','⭐','🌵','#e5b36c','#8a6245','Petualangan koboi'],['Mecha Battle','🦾','🔋','⚙️','#8cb7c9','#3c526c','Hindari robot penjaga'],['Rainbow Road','🦄','🌈','☁️','#e5a8e4','#8065b2','Kejar pelangi'],['Deep Sea Run','🤿','🐚','🪸','#52b8cf','#174d78','Jelajahi laut dalam'],
  ['Temple Escape','🧭','🗿','🪤','#d2a879','#71533e','Kabur dari kuil'],['Butterfly Park','🦋','🌷','🌵','#a9d9b1','#568b70','Terbang di taman'],['Cyber Runner','🕶️','💠','🚧','#48c8c5','#214e70','Lari di dunia digital'],['Moon Rabbit','🐇','🌕','🪨','#b9b9e9','#535783','Petualangan di bulan'],['Treasure Island','🧑‍🌾','🏝️','🦀','#eac17b','#4d8b79','Temukan pulau harta']
 ];
 let visualGame=null,visualFrame=0,visualLast=0,visualKeys={left:false,right:false,run:false};
 const vq=s=>document.querySelector(s);
 function renderVisualGames(){const root=vq('#visualGameGrid');if(!root)return;root.innerHTML=visualWorlds.map((w,i)=>`<button type="button" class="visual-game-card" data-visual-game="${i}"><span class="visual-game-art" style="--art-bg:linear-gradient(135deg,${w[4]},${w[5]})"><i class="art-side one">${w[2]}</i><span class="art-main">${w[1]}</span><i class="art-side two">${w[3]}</i><small class="art-tag">${modeNames[i%16].toUpperCase()}</small></span><span class="visual-game-info"><b>${w[0]}</b><small>${w[6]}</small><strong>▶ MAIN SEKARANG</strong></span></button>`).join('')}
 const modeNames=['Platform Runner','Sky Flyer','Arena Shooter','Lane Racing','Treasure Hunt','Target Master','Meteor Dodge','Rhythm Tap','Snake Hunt','Brick Breaker','Pong Duel','Fishing Catch','Basketball Shot','Penalty Kick','Whack-a-Mole','Helicopter Rescue'];
 function visualStart(index,level=1){const w=visualWorlds[index];if(!w)return;visualStop();const mode=index%16;current={index:1000+index,name:w[0],rewarded:false};visualGame={index,level,mode,world:w,x:110,y:170,vy:0,coins:0,score:0,lives:3,objects:[],spawn:0,elapsed:0,ended:false,won:false,invuln:0,phase:0,targets:[],sequence:[],seqAt:0,levelGoal:Math.min(12,5+level),direction:'right',snake:[{x:8,y:7},{x:7,y:7},{x:6,y:7}],snakeTick:0,foodX:20,foodY:5,ball:{x:450,y:180,vx:170,vy:150},paddle:450,aiPaddle:450,bricks:Array.from({length:3},(_,r)=>Array.from({length:10},(_,c)=>({x:95+c*72,y:65+r*32,alive:true}))).flat(),fishX:450,hoopX:650,goalieX:450,mole:null,heliY:180};visualKeys={left:false,right:false,up:false,down:false,run:false,jump:false};vq('#visualGameTitle').textContent=w[0]+' · '+modeNames[mode]+' · Level '+level;vq('#visualCoins').textContent='0';vq('#visualLives').textContent='3';vq('#visualScore').textContent='0';vq('#visualGameStatus').textContent=['Lompat rintangan dan kumpulkan koin.','Terbang: tahan LOMPAT untuk naik.','Gerakkan pesawat dan tembak dengan LOMPAT.','Pindah jalur untuk menghindari kendaraan.','Jelajahi area dan kumpulkan kristal.','Klik target sebelum menghilang.','Hindari meteor yang jatuh.','Tekan LOMPAT saat pulsa masuk zona hijau.','Ular bergerak otomatis; belokkan untuk makan buah.','Hancurkan semua bata dengan bola.','Gerakkan pemukul dan pantulkan bola.','Geser kail, lalu tekan LOMPAT untuk memancing.','Atur posisi lalu tekan LOMPAT untuk menembak ring.','Bidik sisi gawang lalu tekan LOMPAT untuk menendang.','Klik tikus yang muncul secepat mungkin.','Tahan LOMPAT agar helikopter naik, lepaskan untuk turun.'][mode];vq('#visualGameScreen').classList.remove('hidden');const allowed=mode===5||mode===14?[]:mode===8?['left','right','up','down']:mode===9||mode===10?['left','right','jump']:mode===11||mode===12||mode===13?['left','right','jump']:mode===1||mode===2||mode===7||mode===15?['left','right','jump']:mode===4?['left','right','jump']:mode===0?['left','right','jump','run']:['left','right'];document.querySelectorAll('[data-vcontrol]').forEach(b=>{b.hidden=!allowed.includes(b.dataset.vcontrol)});document.body.classList.add('arcade-playing');vq('#visualGameScreen').scrollIntoView({behavior:'smooth',block:'center'});const next=vq('#visualNextLevel');if(next)next.remove();visualLast=performance.now();visualFrame=requestAnimationFrame(visualLoop)}
 function visualStop(){if(visualFrame)cancelAnimationFrame(visualFrame);visualFrame=0;visualGame=null;visualKeys={left:false,right:false,up:false,down:false,run:false,jump:false};document.body.classList.remove('arcade-playing')}
 function visualEnd(win){if(!visualGame||visualGame.ended)return;visualGame.ended=true;visualGame.won=win;vq('#visualGameStatus').textContent=win?'🏆 LEVEL CLEAR! Hadiah sedang diproses...':'💥 GAME OVER — tekan Ulangi untuk mencoba lagi.';if(win){reward();const controls=document.querySelector('.visual-game-controls');if(controls&&!vq('#visualNextLevel')){const b=document.createElement('button');b.id='visualNextLevel';b.className='btn primary';b.textContent='Level Selanjutnya →';b.onclick=()=>visualStart(visualGame.index,visualGame.level+1);controls.appendChild(b)}}}
 function visualLoop(now){if(!visualGame)return;const dt=Math.min(.035,(now-visualLast)/1000||.016);visualLast=now;const g=visualGame,w=g.world,mode=g.mode,canvas=vq('#visualGameCanvas'),ctx=canvas?.getContext('2d');if(!ctx)return;const W=900,H=360;
 if(!g.ended){g.elapsed+=dt;g.spawn+=dt;g.phase+=dt;const speed=(visualKeys.run?380:245)*(1+g.level*.06);
  if(mode===0){if(visualKeys.left)g.x-=speed*dt;if(visualKeys.right)g.x+=speed*dt;g.x=Math.max(25,Math.min(850,g.x));g.vy+=1050*dt;g.y+=g.vy*dt;if(g.y>170){g.y=170;g.vy=0}if(g.spawn>Math.max(.65,1.35-g.level*.04)){g.spawn=0;g.objects.push({x:930,y:245,type:Math.random()<.45?'coin':'hazard'})}g.objects.forEach(o=>o.x-=speed*dt);g.objects=g.objects.filter(o=>o.x>-30);g.objects.forEach(o=>{if(Math.abs(o.x-g.x)<32){if(o.type==='coin'){o.x=-99;g.coins++;g.score+=100}else if(g.invuln<=0){o.x=-99;g.lives--;g.invuln=1}}})}
  else if(mode===1){if(visualKeys.left)g.x-=speed*.7*dt;if(visualKeys.right)g.x+=speed*.7*dt;g.y+=((visualKeys.jump?-260:210))*dt;g.x=Math.max(25,Math.min(850,g.x));g.y=Math.max(25,Math.min(320,g.y));if(g.spawn>1.05){g.spawn=0;g.objects.push({x:940,y:35+Math.random()*285,type:Math.random()<.55?'coin':'hazard'})}g.objects.forEach(o=>o.x-=speed*dt);g.objects=g.objects.filter(o=>o.x>-30);g.objects.forEach(o=>{if(Math.abs(o.x-g.x)<30&&Math.abs(o.y-g.y)<35){o.x=-99;if(o.type==='coin'){g.coins++;g.score+=100}else if(g.invuln<=0){g.lives--;g.invuln=1}}})}
  else if(mode===2){if(visualKeys.left)g.x-=speed*.8*dt;if(visualKeys.right)g.x+=speed*.8*dt;g.x=Math.max(35,Math.min(865,g.x));if(g.spawn>.85){g.spawn=0;g.objects.push({x:35+Math.random()*830,y:-20,type:'enemy'})}g.objects.forEach(o=>o.y+=170*dt);g.objects=g.objects.filter(o=>o.y<390);if(visualKeys.jump&&g.phase>.18){g.phase=0;g.objects.forEach(o=>{if(Math.abs(o.x-g.x)<65){o.y=500;g.score+=150;g.coins++}})}}
  else if(mode===3){if(visualKeys.left)g.x=Math.max(170,g.x-450*dt);if(visualKeys.right)g.x=Math.min(730,g.x+450*dt);if(g.spawn>.72){g.spawn=0;g.objects.push({x:[220,450,680][Math.floor(Math.random()*3)],y:-35,type:'car'})}g.objects.forEach(o=>o.y+=speed*dt);g.objects=g.objects.filter(o=>o.y<400);g.objects.forEach(o=>{if(Math.abs(o.x-g.x)<55&&Math.abs(o.y-285)<55){o.y=500;if(g.invuln<=0){g.lives--;g.invuln=.8}}});if(g.elapsed>0&&Math.floor(g.elapsed*2)>g.score){g.score=Math.floor(g.elapsed*2);if(g.score%10===0)g.coins++}}
  else if(mode===4){if(visualKeys.left)g.x-=speed*.65*dt;if(visualKeys.right)g.x+=speed*.65*dt;if(visualKeys.jump)g.y-=speed*.6*dt;else g.y+=speed*.45*dt;g.x=Math.max(40,Math.min(860,g.x));g.y=Math.max(45,Math.min(315,g.y));if(g.spawn>1.0){g.spawn=0;g.objects.push({x:40+Math.random()*820,y:45+Math.random()*270,type:'gem'})}g.objects.forEach(o=>{if(Math.hypot(o.x-g.x,o.y-g.y)<35){o.x=-100;g.coins++;g.score+=200}});g.objects=g.objects.filter(o=>o.x>=0)}
  else if(mode===5){if(g.spawn>.8){g.spawn=0;g.targets=[{x:65+Math.random()*770,y:55+Math.random()*245,r:26,life:1.4}]}g.targets.forEach(t=>t.life-=dt);g.targets=g.targets.filter(t=>t.life>0);if(!g.targets.length&&g.score>0&&g.phase>.6){g.lives--;g.phase=0}}
  else if(mode===6){if(visualKeys.left)g.x-=speed*dt;if(visualKeys.right)g.x+=speed*dt;g.x=Math.max(30,Math.min(870,g.x));if(g.spawn>.42){g.spawn=0;g.objects.push({x:30+Math.random()*840,y:-25,type:'meteor'})}g.objects.forEach(o=>o.y+=(210+g.level*22)*dt);g.objects=g.objects.filter(o=>o.y<390);g.objects.forEach(o=>{if(Math.abs(o.x-g.x)<34&&Math.abs(o.y-300)<35){o.y=500;if(g.invuln<=0){g.lives--;g.invuln=.9}}});if(Math.floor(g.elapsed)>g.score){g.score=Math.floor(g.elapsed);if(g.score%4===0)g.coins++}}
  else if(mode===7){if(visualKeys.jump&&g.phase>.18){g.phase=0;const hit=Math.abs((g.elapsed%1)-.55)<.22;if(hit){g.score+=100;g.coins++}else{g.lives--}}}
  else if(mode===8){
   if(visualKeys.left&&g.direction!=='right')g.direction='left';if(visualKeys.right&&g.direction!=='left')g.direction='right';if(visualKeys.up&&g.direction!=='down')g.direction='up';if(visualKeys.down&&g.direction!=='up')g.direction='down';
   g.snakeTick+=dt;if(g.snakeTick>.16){g.snakeTick=0;const h={...g.snake[0]};if(g.direction==='left')h.x--;if(g.direction==='right')h.x++;if(g.direction==='up')h.y--;if(g.direction==='down')h.y++;if(h.x<0||h.x>=30||h.y<0||h.y>=12||g.snake.some(p=>p.x===h.x&&p.y===h.y)){g.lives--;g.snake=[{x:8,y:7},{x:7,y:7},{x:6,y:7}];g.direction='right'}else{g.snake.unshift(h);if(h.x===g.foodX&&h.y===g.foodY){g.coins++;g.score+=100;g.foodX=2+Math.floor(Math.random()*26);g.foodY=1+Math.floor(Math.random()*10)}else g.snake.pop()}}
  }
  else if(mode===9){if(visualKeys.left)g.paddle=Math.max(75,g.paddle-440*dt);if(visualKeys.right)g.paddle=Math.min(825,g.paddle+440*dt);if(visualKeys.jump)g.launched=true;if(g.launched){g.ball.x+=g.ball.vx*dt;g.ball.y+=g.ball.vy*dt;if(g.ball.x<18||g.ball.x>882)g.ball.vx*=-1;if(g.ball.y<20)g.ball.vy=Math.abs(g.ball.vy);if(g.ball.y>315&&Math.abs(g.ball.x-g.paddle)<85)g.ball.vy=-Math.abs(g.ball.vy);for(const brick of g.bricks){if(brick.alive&&Math.abs(g.ball.x-brick.x)<32&&Math.abs(g.ball.y-brick.y)<15){brick.alive=false;g.ball.vy*=-1;g.score+=50;g.coins++}}if(g.ball.y>370){g.lives--;g.ball={x:450,y:280,vx:160,vy:-170};g.launched=false}}if(g.bricks.every(b=>!b.alive))visualEnd(true)}
  else if(mode===10){if(visualKeys.left)g.paddle=Math.max(70,g.paddle-420*dt);if(visualKeys.right)g.paddle=Math.min(830,g.paddle+420*dt);if(visualKeys.jump)g.launched=true;if(g.launched){g.ball.x+=g.ball.vx*dt;g.ball.y+=g.ball.vy*dt;if(g.ball.x<20||g.ball.x>880)g.ball.vx*=-1;g.aiPaddle+=(g.ball.x-g.aiPaddle)*Math.min(1,2.5*dt);if(g.ball.y<48){if(Math.abs(g.ball.x-g.aiPaddle)<78)g.ball.vy=Math.abs(g.ball.vy);else{g.score+=100;g.coins++;g.ball={x:450,y:180,vx:(Math.random()>.5?1:-1)*170,vy:150};g.launched=false}}if(g.ball.y>315&&Math.abs(g.ball.x-g.paddle)<90){g.ball.vy=-Math.abs(g.ball.vy);g.score+=50}if(g.ball.y>370){g.lives--;g.ball={x:450,y:170,vx:170,vy:160};g.launched=false}}}
  else if(mode===11){g.fishX=450+Math.sin(g.elapsed*1.8)*320;if(visualKeys.left)g.x=Math.max(70,g.x-300*dt);if(visualKeys.right)g.x=Math.min(830,g.x+300*dt);if(visualKeys.jump&&!g.cast){g.cast=true;g.castTimer=.8}if(g.cast){g.castTimer-=dt;if(g.castTimer<=0){if(Math.abs(g.x-g.fishX)<85){g.coins++;g.score+=150}else g.lives--;g.cast=false;visualKeys.jump=false}}}
  else if(mode===12){g.hoopX=650+Math.sin(g.elapsed*1.1)*150;if(visualKeys.left)g.x=Math.max(90,g.x-300*dt);if(visualKeys.right)g.x=Math.min(810,g.x+300*dt);if(visualKeys.jump&&!g.shot){g.shot=true;g.shotTimer=.6}if(g.shot){g.shotTimer-=dt;if(g.shotTimer<=0){if(Math.abs(g.x-g.hoopX)<95){g.score+=2;g.coins+=2}else g.lives--;g.shot=false;visualKeys.jump=false}}}
  else if(mode===13){g.goalieX=450+Math.sin(g.elapsed*2.4)*230;if(visualKeys.left)g.x=Math.max(100,g.x-260*dt);if(visualKeys.right)g.x=Math.min(800,g.x+260*dt);if(visualKeys.jump&&!g.kick){g.kick=true;g.kickTimer=.55}if(g.kick){g.kickTimer-=dt;if(g.kickTimer<=0){if(Math.abs(g.x-g.goalieX)>80){g.score+=100;g.coins++}else g.lives--;g.kick=false;visualKeys.jump=false}}}
  else if(mode===14){if(g.spawn>.9){g.spawn=0;g.targets=[{x:80+Math.random()*740,y:90+Math.random()*200,r:30,life:1.1}]}g.targets.forEach(t=>t.life-=dt);if(g.targets.length&&!g.targets[0].life){g.targets=[];g.lives--}}
  else if(mode===15){if(visualKeys.left)g.x-=speed*.65*dt;if(visualKeys.right)g.x+=speed*.65*dt;g.heliY+=((visualKeys.jump?-300:230))*dt;g.heliY=Math.max(35,Math.min(325,g.heliY));if(g.spawn>.8){g.spawn=0;g.objects.push({x:940,y:35+Math.random()*285,type:'barrier'})}g.objects.forEach(o=>o.x-=speed*.9*dt);g.objects=g.objects.filter(o=>o.x>-40);g.objects.forEach(o=>{if(Math.abs(o.x-g.x)<35&&Math.abs(o.y-g.heliY)<45){o.x=-99;if(g.invuln<=0){g.lives--;g.invuln=1}}});if(Math.floor(g.elapsed)>g.score){g.score=Math.floor(g.elapsed);if(g.score%5===0)g.coins++}}
  g.invuln=Math.max(0,g.invuln-dt);if(g.lives<=0)visualEnd(false);if(!g.ended&&(g.coins>=g.levelGoal||g.score>=g.levelGoal*180||((mode===5||mode===7)&&g.score>=g.levelGoal*100)))visualEnd(true);if(!g.ended&&g.elapsed>75)visualEnd(g.score>0||g.coins>0);
 }
 const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,w[4]);grad.addColorStop(1,w[5]);ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);ctx.globalAlpha=.22;for(let i=0;i<12;i++){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc((i*103-(g.elapsed*35)%1000+1000)%1000,35+(i%4)*37,14+(i%3)*7,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
 ctx.fillStyle='#ffffff20';for(let i=0;i<7;i++){let x=(i*170-(g.elapsed*28)%170+1020)%1020;ctx.beginPath();ctx.moveTo(x,H);ctx.lineTo(x+65,130+(i%3)*25);ctx.lineTo(x+140,H);ctx.fill()}
 ctx.textAlign='center';ctx.font='38px sans-serif';
 if(mode===0){ctx.fillStyle='#17283b';ctx.fillRect(0,285,W,75);g.objects.forEach(o=>ctx.fillText(o.type==='coin'?'🪙':w[3],o.x,276));ctx.fillText(w[1],g.x,255-g.y+170)}
 if(mode===1){ctx.fillText('☁️',100,90);g.objects.forEach(o=>ctx.fillText(o.type==='coin'?'🪙':'🪨',o.x,o.y));ctx.fillText(w[1],g.x,g.y+12)}
 if(mode===2){ctx.fillStyle='#101a38';ctx.fillRect(0,0,W,H);ctx.fillText('🚀',g.x,315);g.objects.forEach(o=>ctx.fillText('👾',o.x,o.y));ctx.fillStyle='#fff';ctx.font='16px sans-serif';ctx.fillText('TAP LOMPAT UNTUK MENEMBAK',450,30)}
 if(mode===3){ctx.fillStyle='#263244';ctx.fillRect(130,0,640,H);ctx.strokeStyle='#fff';ctx.setLineDash([22,18]);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(345,0);ctx.lineTo(345,H);ctx.moveTo(555,0);ctx.lineTo(555,H);ctx.stroke();ctx.setLineDash([]);g.objects.forEach(o=>ctx.fillText('🚙',o.x,o.y));ctx.fillText('🏎️',g.x,320)}
 if(mode===4){ctx.fillStyle='#23513d';ctx.fillRect(0,0,W,H);for(let i=0;i<9;i++){ctx.fillStyle='#ffffff18';ctx.fillRect(30+i*100,30+(i%3)*95,75,65)}g.objects.forEach(o=>ctx.fillText('💎',o.x,o.y));ctx.fillText(w[1],g.x,g.y)}
 if(mode===5){ctx.fillStyle='#111d37';ctx.fillRect(0,0,W,H);g.targets.forEach(t=>{ctx.fillStyle='#ffdb65';ctx.beginPath();ctx.arc(t.x,t.y,t.r,0,7);ctx.fill();ctx.fillStyle='#9a4b31';ctx.font='25px sans-serif';ctx.fillText('🎯',t.x,t.y+9)});ctx.fillStyle='#fff';ctx.font='18px sans-serif';ctx.fillText('KLIK TARGET DI LAYAR!',450,30)}
 if(mode===6){ctx.fillStyle='#111a31';ctx.fillRect(0,0,W,H);g.objects.forEach(o=>ctx.fillText('☄️',o.x,o.y));ctx.fillText('🧑‍🚀',g.x,320)}
 if(mode===7){ctx.fillStyle='#15223d';ctx.fillRect(0,0,W,H);ctx.fillStyle='#fff';ctx.font='22px sans-serif';ctx.fillText('TEKAN ⤴ SAAT PULSA DI ZONA HIJAU',450,80);const phase=g.elapsed%1;ctx.fillStyle='#f66';ctx.fillRect(180,165,540,22);ctx.fillStyle='#3d8';ctx.fillRect(410,160,120,32);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(180+phase*540,176,13,0,7);ctx.fill()}
 if(mode===8){ctx.fillStyle='#143d35';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#ffffff18';for(let x=0;x<900;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,360);ctx.stroke()}for(let y=0;y<360;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(900,y);ctx.stroke()}ctx.fillText('🍎',g.foodX*30+15,g.foodY*30+25);g.snake.forEach((p,i)=>{ctx.fillStyle=i?'#82e3a4':'#d5ff78';ctx.fillRect(p.x*30+2,p.y*30+2,26,26)})}
 if(mode===9){ctx.fillStyle='#182442';ctx.fillRect(0,0,W,H);g.bricks.filter(b=>b.alive).forEach((b,i)=>{ctx.fillStyle=['#ed7d68','#eac65c','#62c8a9'][Math.floor(i/10)];ctx.fillRect(b.x-30,b.y-11,60,22)});ctx.fillStyle='#f5f7ff';ctx.fillRect(g.paddle-55,325,110,12);ctx.beginPath();ctx.arc(g.ball.x,g.ball.y,9,0,Math.PI*2);ctx.fill();ctx.font='18px sans-serif';ctx.fillText('TEKAN LOMPAT UNTUK MULAI',450,25)}
 if(mode===10){ctx.fillStyle='#101b34';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#fff';ctx.setLineDash([12,12]);ctx.beginPath();ctx.moveTo(450,0);ctx.lineTo(450,360);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#e77c75';ctx.fillRect(g.aiPaddle-60,25,120,12);ctx.fillStyle='#7ce0c1';ctx.fillRect(g.paddle-60,325,120,12);ctx.fillStyle='#fff';ctx.fillRect(g.ball.x-7,g.ball.y-7,14,14);ctx.fillStyle='#fff';ctx.font='20px sans-serif';ctx.fillText('PONG DUEL',450,30)}
 if(mode===11){ctx.fillStyle='#14506a';ctx.fillRect(0,0,W,H);for(let y=150;y<360;y+=30){ctx.strokeStyle='#ffffff30';ctx.beginPath();ctx.moveTo(0,y+Math.sin(g.elapsed*2+y)*5);ctx.lineTo(900,y);ctx.stroke()}ctx.fillText('🐟',g.fishX,225);ctx.fillText('🎣',g.x,115);if(g.cast){ctx.strokeStyle='#fff';ctx.beginPath();ctx.moveTo(g.x,120);ctx.lineTo(g.x,260);ctx.stroke()}ctx.font='18px sans-serif';ctx.fillText('TEKAN LOMPAT UNTUK MELEMPAR KAIL',450,30)}
 if(mode===12){ctx.fillStyle='#2c633d';ctx.fillRect(0,0,W,H);ctx.fillStyle='#fff';ctx.fillRect(0,290,900,70);ctx.strokeStyle='#fff';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(g.hoopX,90);ctx.lineTo(g.hoopX,160);ctx.stroke();ctx.beginPath();ctx.ellipse(g.hoopX,165,42,10,0,0,Math.PI*2);ctx.stroke();ctx.fillText('🏀',g.x,275);ctx.font='18px sans-serif';ctx.fillText('BIDIK RING YANG BERGERAK',450,30)}
 if(mode===13){ctx.fillStyle='#237044';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#fff';ctx.lineWidth=5;ctx.strokeRect(150,65,600,245);ctx.fillText('🥅',450,90);ctx.fillText('🧤',g.goalieX,220);ctx.fillText('⚽',g.x,285);ctx.font='18px sans-serif';ctx.fillText('ARAHKAN BOLA, LALU LOMPAT UNTUK MENENDANG',450,30)}
 if(mode===14){ctx.fillStyle='#473d2b';ctx.fillRect(0,0,W,H);for(let x=130;x<800;x+=180)for(let y=110;y<300;y+=110){ctx.fillStyle='#171b20';ctx.beginPath();ctx.ellipse(x,y,55,34,0,0,7);ctx.fill()}g.targets.forEach(t=>{ctx.font='52px sans-serif';ctx.fillText('🐹',t.x,t.y)});ctx.fillStyle='#fff';ctx.font='18px sans-serif';ctx.fillText('KLIK TIKUS YANG MUNCUL!',450,30)}
 if(mode===15){ctx.fillStyle='#1a2d4b';ctx.fillRect(0,0,W,H);ctx.fillStyle='#e4c86e';ctx.fillRect(0,20,W,8);ctx.fillRect(0,332,W,8);g.objects.forEach(o=>{ctx.fillStyle='#e16e65';ctx.fillRect(o.x,o.y-34,38,68)});ctx.fillText('🚁',g.x,g.heliY+12);ctx.font='18px sans-serif';ctx.fillStyle='#fff';ctx.fillText('TAHAN LOMPAT UNTUK NAIK',450,30)}
 ctx.fillStyle='#fff';ctx.font='bold 16px sans-serif';ctx.textAlign='left';ctx.fillText('LEVEL '+g.level+'  ·  KOIN '+g.coins+'/'+g.levelGoal,18,26);ctx.textAlign='right';ctx.fillText('SKOR '+g.score+'  ·  '+'♥'.repeat(Math.max(0,g.lives)),882,26);
 if(g.ended){ctx.fillStyle='#071321bb';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 43px sans-serif';ctx.fillText(g.won?'LEVEL CLEAR!':'GAME OVER',450,160);ctx.font='20px sans-serif';ctx.fillText(g.won?'Tekan LEVEL SELANJUTNYA untuk lanjut':'Tekan ULANGI untuk bermain lagi',450,202)}
 if(mode===5&&!g.ended){ctx.canvas.style.cursor='crosshair'}else ctx.canvas.style.cursor='default';vq('#visualCoins').textContent=g.coins;vq('#visualLives').textContent=g.lives;vq('#visualScore').textContent=g.score;visualFrame=requestAnimationFrame(visualLoop)}
 function visualJump(){if(!visualGame||visualGame.ended)return;if(visualGame.mode===0&&visualGame.y===170)visualGame.vy=-390;else if([1,2,4,7,9,10,11,12,13,15].includes(visualGame.mode))visualKeys.jump=true}
 function visualControl(name,on){if(name==='jump'){if(on){if(visualGame?.mode===0)visualJump();else if(visualGame)visualKeys.jump=true}else if(visualGame)visualKeys.jump=false;return}visualKeys[name]=on;const b=document.querySelector(`[data-vcontrol="${name}"]`);if(b)b.classList.toggle('pressed',on)}
 vq('#visualGameCanvas')?.addEventListener('click',e=>{if(!visualGame||visualGame.ended)return;const r=e.target.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*900,y=(e.clientY-r.top)/r.height*360,g=visualGame;if(g.mode===5||g.mode===14){const t=g.targets[0];if(t&&Math.hypot(t.x-x,t.y-y)<t.r+16){g.score+=100;g.coins++;g.targets=[];g.phase=0}else g.lives--}else if(g.mode===11){g.x=x;g.cast=true;g.castTimer=.8}else if(g.mode===12){g.x=x;g.shot=true;g.shotTimer=.6}else if(g.mode===13){g.x=x;g.kick=true;g.kickTimer=.55}});
 vq('#visualGameGrid')?.addEventListener('click',e=>{const b=e.target.closest('[data-visual-game]');if(b)visualStart(Number(b.dataset.visualGame))});
 vq('#visualGameClose')?.addEventListener('click',()=>{visualStop();vq('#visualGameScreen').classList.add('hidden')});
 vq('#visualGameRestart')?.addEventListener('click',()=>{if(visualGame)visualStart(visualGame.index,visualGame.level)});
 document.querySelectorAll('[data-vcontrol]').forEach(b=>{const name=b.dataset.vcontrol;b.addEventListener('pointerdown',e=>{e.preventDefault();visualControl(name,true)});['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,()=>visualControl(name,false)))});
 document.addEventListener('keydown',e=>{if(!visualGame)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' ','Shift'].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft')visualControl('left',true);if(e.key==='ArrowRight')visualControl('right',true);if(e.key==='ArrowUp'){if(visualGame.mode===8)visualControl('up',true);else visualJump()}if(e.key==='ArrowDown'&&visualGame.mode===8)visualControl('down',true);if(e.key===' ')visualJump();if(e.key==='Shift')visualControl('run',true)});
 document.addEventListener('keyup',e=>{if(e.key==='ArrowLeft')visualControl('left',false);if(e.key==='ArrowRight')visualControl('right',false);if(e.key==='ArrowUp')visualControl('up',false);if(e.key==='ArrowDown')visualControl('down',false);if(e.key===' '&&visualGame)visualKeys.jump=false;if(e.key==='Shift')visualControl('run',false)});
 window.addEventListener('blur',()=>{visualKeys={left:false,right:false,up:false,down:false,run:false,jump:false}});

 document.addEventListener('DOMContentLoaded',renderVisualGames);
})();
