(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const STORE_KEY = 'aldianIntegrityDefenderV1';
  const INITIAL_INTEGRITY = 40;
  const MAX_INTEGRITY = 100;
  const BOSS_MAX_HP = 102;

  const cases = [
    {
      type: 'mission', chapter: 'CHAPTER 01 / 05', category: 'GRATIFIKASI', title: 'THE GIFT', art: '🎁', artLabel: 'A VENDOR GIFT', number: '#001',
      heading: 'A vendor offers an expensive gift.',
      description: 'Setelah sebuah milestone proyek fiktif selesai, seorang vendor mengirimkan hadiah bernilai tinggi ke alamat kerjamu. Vendor mengatakan hadiah itu hanya tanda terima kasih dan berharap hubungan kerja tetap lancar.',
      choices: [
        { text: 'Menerima hadiah dan menyimpannya karena pekerjaan sudah selesai.', correct: false, delta: -18, title: 'RISK ACCEPTED', feedback: 'Hadiah bernilai tinggi dari pihak yang memiliki hubungan bisnis dapat menimbulkan persepsi keberpihakan atau kewajiban balas budi, meskipun pekerjaan sebelumnya telah selesai.', rule: 'Jangan memutuskan sendiri bahwa hadiah boleh diterima. Tolak atau tangani melalui mekanisme deklarasi dan persetujuan yang berlaku di organisasi.' },
        { text: 'Menolak dengan sopan, mendokumentasikan kejadian, dan meminta arahan melalui kanal resmi yang berlaku.', correct: true, delta: 12, title: 'INTEGRITY PROTECTED', feedback: 'Keputusan ini menjaga independensi dan transparansi. Dokumentasi serta konsultasi melalui kanal resmi membuat penanganan dapat ditelusuri.', rule: 'Ikuti kebijakan gratifikasi organisasi, termasuk kewajiban deklarasi atau pelaporan bila berlaku.' },
        { text: 'Menerima atas nama tim agar tidak terlihat sebagai keuntungan pribadi.', correct: false, delta: -18, title: 'HIDDEN RISK', feedback: 'Mengatasnamakan tim tidak otomatis menghilangkan risiko gratifikasi. Penerimaan tetap perlu dinilai berdasarkan kebijakan dan konteksnya.', rule: 'Jangan mengubah penerima atau cara pencatatan untuk menghindari proses deklarasi.' }
      ], achievement: 'gift-guardian'
    },
    {
      type: 'mission', chapter: 'CHAPTER 02 / 05', category: 'SUAP', title: 'THE ENVELOPE', art: '✉️', artLabel: 'SEALED ENVELOPE', number: '#002',
      heading: 'A contractor offers an envelope.',
      description: 'Dalam skenario fiktif, seorang kontraktor menawarkan uang agar dokumen pekerjaannya diprioritaskan sebelum proses pemeriksaan selesai.',
      choices: [
        { text: 'Menolak tawaran, tidak menjanjikan perlakuan khusus, dan melaporkan pendekatan tersebut melalui prosedur resmi.', correct: true, delta: 12, title: 'BRIBERY REJECTED', feedback: 'Kamu menolak pengaruh yang tidak semestinya dan menjaga agar keputusan tetap berdasarkan pemeriksaan yang objektif.', rule: 'Jangan meminta, menerima, menjanjikan, atau memfasilitasi keuntungan untuk memengaruhi keputusan. Gunakan kanal pelaporan resmi.' },
        { text: 'Mengembalikan uang diam-diam dan melanjutkan proses seperti biasa tanpa mencatat kejadian.', correct: false, delta: -18, title: 'NOT TRANSPARENT', feedback: 'Mengembalikan uang saja belum tentu cukup. Pendekatan yang tidak wajar perlu ditangani secara transparan agar pola dan risikonya dapat ditinjau.', rule: 'Catat fakta secara akurat dan minta arahan melalui mekanisme yang berlaku; hindari menghapus jejak kejadian.' },
        { text: 'Menerima uang tetapi berjanji tidak bisa menjamin hasil pemeriksaan.', correct: false, delta: -18, title: 'BRIBE ACCEPTED', feedback: 'Menerima uang tetap merupakan konflik serius, sekalipun kamu tidak menjanjikan hasil tertentu.', rule: 'Keputusan kerja harus bebas dari pembayaran atau keuntungan pribadi yang tidak sah.' }
      ]
    },
    {
      type: 'mission', chapter: 'CHAPTER 03 / 05', category: 'INTEGRITAS DATA', title: 'THE NUMBERS', art: '📊', artLabel: 'COST REPORT', number: '#003',
      heading: 'Someone asks you to adjust a report.',
      description: 'Saat memeriksa laporan biaya fiktif, kamu menemukan selisih antara dokumen pendukung dan angka rekap. Seseorang meminta angka diubah agar laporan terlihat sesuai target.',
      choices: [
        { text: 'Mengubah angka tanpa dasar pendukung agar proses persetujuan lebih cepat.', correct: false, delta: -22, title: 'DATA COMPROMISED', feedback: 'Mengubah angka tanpa bukti merusak keandalan laporan dan dapat memengaruhi keputusan berikutnya.', rule: 'Pertahankan sumber data, jejak perubahan, dasar koreksi, dan persetujuan yang dapat ditelusuri.' },
        { text: 'Menghapus dokumen sumber agar tidak ada perbedaan yang terlihat.', correct: false, delta: -22, title: 'EVIDENCE DESTROYED', feedback: 'Menghilangkan dokumen sumber memperburuk risiko dan menghambat pemeriksaan yang wajar.', rule: 'Simpan dokumen sesuai ketentuan retensi dan jangan memusnahkan atau menyembunyikan bukti.' },
        { text: 'Menahan finalisasi, memverifikasi selisih dengan bukti, mencatat koreksi secara transparan, dan mengeskalasi bila perlu.', correct: true, delta: 12, title: 'DATA INTEGRITY SECURED', feedback: 'Kamu menjaga keakuratan laporan dengan mengutamakan bukti dan jejak audit, bukan sekadar mengejar angka yang terlihat sesuai.', rule: 'Setiap koreksi harus memiliki dasar, otorisasi, dan dokumentasi yang memadai.' }
      ], achievement: 'data-guardian'
    },
    {
      type: 'mission', chapter: 'CHAPTER 04 / 05', category: 'KONFLIK KEPENTINGAN', title: 'THE CONNECTION', art: '🤝', artLabel: 'VENDOR SELECTION', number: '#004',
      heading: 'A close relative joins a vendor bid.',
      description: 'Kamu mengetahui bahwa salah satu peserta pengadaan fiktif dimiliki oleh kerabat dekatmu. Kamu juga diminta ikut menilai dokumen penawaran.',
      choices: [
        { text: 'Tetap ikut menilai karena kamu yakin bisa bersikap objektif.', correct: false, delta: -18, title: 'CONFLICT UNMANAGED', feedback: 'Niat objektif saja tidak cukup untuk menghilangkan konflik kepentingan aktual, potensial, atau yang dipersepsikan.', rule: 'Ungkapkan hubungan yang relevan dan ikuti arahan tentang pembatasan peran atau pengunduran diri dari proses.' },
        { text: 'Mengungkapkan hubungan tersebut kepada pihak berwenang internal dan meminta arahan sebelum terlibat lebih jauh.', correct: true, delta: 12, title: 'CONFLICT DISCLOSED', feedback: 'Pengungkapan dini memberi organisasi kesempatan mengelola risiko secara transparan dan adil.', rule: 'Deklarasikan konflik kepentingan sesuai kebijakan, lalu ikuti keputusan mitigasi yang ditetapkan.' },
        { text: 'Meminta kerabat menggunakan nama perusahaan lain agar hubungan tidak terlihat.', correct: false, delta: -22, title: 'CONFLICT CONCEALED', feedback: 'Menyamarkan hubungan justru memperbesar risiko dan dapat dianggap sebagai upaya menghindari pengawasan.', rule: 'Jangan menyembunyikan kepentingan atau mengatur struktur transaksi untuk menghindari deklarasi.' }
      ]
    },
    {
      type: 'boss', chapter: 'FINAL BOSS / 03 ROUNDS', category: 'ANTI-KORUPSI', title: 'CORRUPTION KING', art: '👑', artLabel: 'FINAL BOSS', number: '#BOSS',
      heading: 'The final deal: a chain of hidden approvals.',
      description: 'Corruption King mencoba memaksamu menyetujui pembayaran dan pekerjaan yang tidak didukung bukti, lalu meminta semua pihak merahasiakan prosesnya. Ini adalah ronde terakhir untuk melindungi integritas.',
      choices: [
        { text: 'Menolak menyetujui transaksi tanpa dasar, menjaga dokumen, dan melaporkan indikasi melalui kanal resmi yang aman.', correct: true, delta: 4, damage: 34, title: 'BOSS DAMAGED', feedback: 'Kamu tidak ikut memfasilitasi transaksi yang tidak wajar. Bukti dipertahankan dan persoalan diarahkan ke proses penanganan yang semestinya.', rule: 'Jangan mengesahkan pekerjaan atau pembayaran tanpa verifikasi. Jaga kerahasiaan proses dan gunakan kanal pelaporan resmi.' },
        { text: 'Menyetujui sementara karena diminta atasan/vendor, lalu berencana memeriksa dokumen belakangan.', correct: false, delta: -22, damage: 0, title: 'BOSS RESISTS', feedback: 'Persetujuan tanpa verifikasi dapat membuat transaksi berjalan dan memperbesar dampak. Tekanan waktu atau pihak lain tidak menggantikan kontrol yang wajib dilakukan.', rule: 'Jangan memberi persetujuan sebelum syarat, bukti, dan otorisasi yang diperlukan terpenuhi.' },
        { text: 'Menghapus komunikasi dan menghindari pembahasan agar tidak ikut terseret.', correct: false, delta: -22, damage: 0, title: 'BOSS STRIKES BACK', feedback: 'Menghapus komunikasi atau menghindari pelaporan tidak menyelesaikan risiko dan dapat merusak bukti.', rule: 'Jangan menghilangkan catatan. Pertahankan informasi relevan dan cari arahan melalui jalur resmi.' }
      ]
    }
  ];
  const bossRounds = [
    { suffix: 'ROUND 1 / 3', title: 'THE PHANTOM WORK', art: '📋', label: 'UNVERIFIED WORK', number: '#B1', desc: 'Vendor meminta kamu menyetujui penyelesaian pekerjaan meskipun bukti verifikasi belum tersedia.', choices: [0,1,2] },
    { suffix: 'ROUND 2 / 3', title: 'THE SPLIT INVOICE', art: '🧾', label: 'SPLIT INVOICE', number: '#B2', desc: 'Sebuah tagihan diminta dipecah menjadi beberapa bagian agar melewati batas otorisasi tertentu.', choices: [0,1,2] },
    { suffix: 'ROUND 3 / 3', title: 'THE QUIET DEAL', art: '🤫', label: 'HIDDEN PAYMENT', number: '#B3', desc: 'Kamu diminta menyembunyikan komunikasi tentang pembayaran tidak wajar dan tidak mencatatnya dalam proses resmi.', choices: [0,1,2] }
  ];
  const bossChoices = [
    [
      {text:'Menahan persetujuan sampai pekerjaan diverifikasi dan dokumen pendukung tersedia.',correct:true,delta:4,damage:34,title:'VERIFICATION COMPLETE',feedback:'Kamu menjaga akuntabilitas dengan memastikan bukti pekerjaan diperiksa sebelum persetujuan diberikan.',rule:'Lakukan verifikasi sesuai prosedur, pisahkan fungsi pemeriksaan dan persetujuan, serta simpan bukti yang relevan.'},
      {text:'Menyetujui sekarang karena vendor berjanji mengirim bukti nanti.',correct:false,delta:-22,damage:0,title:'UNSUPPORTED APPROVAL',feedback:'Janji untuk melengkapi bukti di kemudian hari tidak menggantikan verifikasi sebelum persetujuan.',rule:'Jangan mengesahkan pekerjaan atau pembayaran sebelum persyaratan bukti terpenuhi.'},
      {text:'Meminta rekan lain menyetujui tanpa menjelaskan bahwa bukti belum ada.',correct:false,delta:-22,damage:0,title:'RESPONSIBILITY SHIFTED',feedback:'Memindahkan persetujuan tanpa menyampaikan fakta penting tidak menghilangkan tanggung jawab.',rule:'Sampaikan fakta material secara lengkap kepada pihak yang berwenang.'}
    ],
    [
      {text:'Menolak pemecahan yang bertujuan menghindari otorisasi dan meminta proses mengikuti nilai serta jalur persetujuan yang benar.',correct:true,delta:4,damage:34,title:'CONTROL PROTECTED',feedback:'Kamu mencegah upaya menghindari kontrol persetujuan dan menjaga transparansi nilai transaksi.',rule:'Jangan memecah transaksi untuk menghindari batas kewenangan. Ikuti prosedur pengadaan dan persetujuan yang berlaku.'},
      {text:'Menyetujui pemecahan karena total nilainya sama dan dianggap tidak merugikan.',correct:false,delta:-22,damage:0,title:'APPROVAL BYPASSED',feedback:'Nilai total yang sama tidak membenarkan pengaturan transaksi untuk menghindari kontrol.',rule:'Evaluasi substansi transaksi dan tujuan pemecahan, bukan hanya nilai tiap tagihan.'},
      {text:'Mencatatnya sebagai transaksi berbeda tanpa menelusuri tujuan pemecahan.',correct:false,delta:-22,damage:0,title:'TRANSACTION OBSCURED',feedback:'Pencatatan yang mengaburkan hubungan antartransaksi dapat merusak transparansi dan jejak audit.',rule:'Catat transaksi secara akurat dan eskalasi indikasi penghindaran otorisasi.'}
    ],
    [
      {text:'Menolak menyembunyikan komunikasi, mempertahankan catatan, dan melaporkan indikasi melalui kanal resmi.',correct:true,delta:4,damage:34,title:'CORRUPTION KING DEFEATED',feedback:'Kamu melindungi bukti dan tidak ikut menutupi transaksi. Corruption King kehilangan seluruh kekuatannya.',rule:'Jangan memusnahkan bukti atau merahasiakan indikasi pelanggaran. Gunakan kanal pelaporan resmi dan jaga kerahasiaan sesuai prosedur.'},
      {text:'Menghapus pesan yang diminta, tetapi menyimpan salinan pribadi untuk berjaga-jaga.',correct:false,delta:-22,damage:0,title:'EVIDENCE COMPROMISED',feedback:'Menghapus catatan dari sistem resmi tetap dapat mengganggu penelusuran. Jangan memindahkan atau menyimpan data dengan cara yang melanggar kebijakan.',rule:'Pertahankan catatan melalui mekanisme yang sah dan aman; jangan mengubah atau menghapus bukti.'},
      {text:'Diam saja karena tidak ingin terlibat dalam konflik.',correct:false,delta:-22,damage:0,title:'SILENCE ENABLES RISK',feedback:'Tidak bertindak dapat membuat risiko berlanjut. Kamu tidak harus menyelidiki sendiri, tetapi dapat menyampaikan indikasi melalui kanal yang tepat.',rule:'Gunakan jalur pelaporan atau konsultasi resmi; jangan melakukan investigasi di luar kewenangan.'}
    ]
  ];

  let integrity = INITIAL_INTEGRITY;
  let missionIndex = 0;
  let bossRound = 0;
  let bossHp = BOSS_MAX_HP;
  let answered = false;
  let runCorrect = 0;
  let runChoices = 0;
  let activeCase = null;
  let activeChoices = [];
  let unlocked = new Set();
  let bestIntegrity = 0;
  let completedRuns = 0;

  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    unlocked = new Set(Array.isArray(saved.unlocked) ? saved.unlocked : []);
    bestIntegrity = Number(saved.bestIntegrity || 0);
    completedRuns = Number(saved.completedRuns || 0);
  } catch (e) { /* local storage may be unavailable */ }

  const screens = ['introScreen','howPanel','playScreen','endScreen'];
  function showScreen(id) { screens.forEach(s => $(s).classList.toggle('hidden', s !== id)); }
  function saveProgress() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({unlocked:[...unlocked],bestIntegrity,completedRuns})); } catch(e) { /* private browsing may block storage */ }
    renderAchievements();
  }
  function award(id) { if (!unlocked.has(id)) { unlocked.add(id); saveProgress(); } }
  function renderAchievements() {
    document.querySelectorAll('[data-achievement]').forEach(el => el.classList.toggle('unlocked', unlocked.has(el.dataset.achievement)));
    $('achievementCount').textContent = `${unlocked.size} / 5`;
  }
  function updateMeters() {
    $('integrityValue').textContent = `${integrity} / 100`;
    $('integrityBar').style.width = `${integrity}%`;
    $('sceneXp').textContent = String(Math.max(0, integrity)).padStart(2,'0');
    $('sceneMission').textContent = `${String(Math.min(missionIndex + 1,5)).padStart(2,'0')}/05`;
    $('bossValue').textContent = `${bossHp} / ${BOSS_MAX_HP}`;
    $('bossBar').style.width = `${Math.max(0,bossHp) / BOSS_MAX_HP * 100}%`;
  }
  function startGame() {
    integrity = INITIAL_INTEGRITY; missionIndex = 0; bossRound = 0; bossHp = BOSS_MAX_HP; answered = false; runCorrect = 0; runChoices = 0;
    $('villainSprite').classList.remove('show');
    showScreen('playScreen'); renderCase(); window.scrollTo({top: $('playScreen').getBoundingClientRect().top + window.scrollY - 20, behavior:'smooth'});
  }
  function renderCase() {
    answered = false;
    const isBoss = missionIndex === 4;
    activeCase = cases[missionIndex];
    if (isBoss) {
      const round = bossRounds[bossRound];
      activeChoices = bossChoices[bossRound];
      $('chapterEyebrow').textContent = `FINAL BOSS / ${round.suffix}`;
      $('missionTitle').textContent = activeCase.title;
      $('missionCategory').textContent = 'ANTI-KORUPSI';
      $('caseNumber').textContent = round.number;
      $('caseTitle').textContent = round.title;
      $('caseDescription').textContent = round.desc;
      $('caseObject').textContent = round.art;
      $('caseArtLabel').textContent = round.label;
      $('sceneCaption').textContent = 'FINAL BOSS ENCOUNTER • STAY ACCOUNTABLE';
      $('villainSprite').classList.add('show');
      $('bossMeter').classList.remove('hidden');
    } else {
      activeChoices = activeCase.choices;
      $('chapterEyebrow').textContent = activeCase.chapter;
      $('missionTitle').textContent = activeCase.title;
      $('missionCategory').textContent = activeCase.category;
      $('caseNumber').textContent = activeCase.number;
      $('caseTitle').textContent = activeCase.heading;
      $('caseDescription').textContent = activeCase.description;
      $('caseObject').textContent = activeCase.art;
      $('caseArtLabel').textContent = activeCase.artLabel;
      $('sceneCaption').textContent = 'INTEGRITY OPERATIONS BASE • YOUR DECISIONS MATTER';
      $('villainSprite').classList.remove('show');
      $('bossMeter').classList.add('hidden');
    }
    $('feedbackBox').classList.add('hidden');
    $('choiceList').classList.remove('hidden');
    $('choiceList').innerHTML = '';
    activeChoices.forEach((choice,i) => {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'choice-btn';
      btn.innerHTML = `<span class="choice-key">${i+1}</span><span class="choice-copy"></span>`;
      btn.querySelector('.choice-copy').textContent = choice.text;
      btn.addEventListener('click', () => selectChoice(i));
      $('choiceList').appendChild(btn);
    });
    $('decisionCounter').textContent = isBoss ? `BOSS ROUND ${bossRound+1} OF 3` : `DECISION ${missionIndex+1} OF 7`;
    updateMeters();
  }
  function selectChoice(index) {
    if (answered || !activeChoices[index]) return;
    answered = true;
    const choice = activeChoices[index];
    runChoices++;
    if (choice.correct) { runCorrect++; integrity = Math.min(MAX_INTEGRITY, integrity + choice.delta); }
    else { integrity = Math.max(0, integrity + choice.delta); }
    if (missionIndex === 0 && choice.correct) award('gift-guardian');
    if (missionIndex === 2 && choice.correct) award('data-guardian');
    if (choice.correct) award('first-stand');
    if (missionIndex === 4 && choice.correct) bossHp = Math.max(0, bossHp - (choice.damage || 0));

    [...$('choiceList').children].forEach((btn,i) => {
      btn.disabled = true;
      if (activeChoices[i].correct) btn.classList.add('correct');
      else if (i === index) btn.classList.add('incorrect');
      else btn.classList.add('muted-choice');
    });
    $('feedbackBox').classList.remove('hidden','bad');
    if (!choice.correct) $('feedbackBox').classList.add('bad');
    $('feedbackIcon').textContent = choice.correct ? '✓' : '!';
    $('feedbackTitle').textContent = choice.title;
    $('feedbackDelta').textContent = `${choice.delta > 0 ? '+' : ''}${choice.delta} INTEGRITY`;
    $('feedbackText').textContent = choice.feedback;
    $('feedbackRule').textContent = choice.rule;
    $('continueBtn').textContent = integrity <= 0 ? 'VIEW MISSION REPORT →' : 'CONTINUE MISSION →';
    if (missionIndex === 4 && bossHp <= 0) $('continueBtn').textContent = 'CLAIM VICTORY →';
    updateMeters();
    $('feedbackBox').scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function finishGame() {
    completedRuns++;
    const bossDefeated = bossHp <= 0;
    if (bossDefeated) award('boss-slayer');
    if (bossDefeated && integrity === 100) award('perfect-integrity');
    bestIntegrity = Math.max(bestIntegrity, integrity);
    saveProgress();
    const rank = bossDefeated ? (integrity >= 85 ? 'INTEGRITY GUARDIAN' : integrity >= 60 ? 'INTEGRITY DEFENDER' : 'INTEGRITY SURVIVOR') : (integrity <= 0 ? 'INTEGRITY COMPROMISED' : 'INTEGRITY TRAINEE');
    $('endEmblem').textContent = bossDefeated ? '🏆' : '🛡️';
    $('endTitle').textContent = rank;
    $('endSummary').textContent = bossDefeated ? 'Corruption King telah dikalahkan. Kamu menjaga prinsip transparansi, akuntabilitas, dan keberanian untuk mengambil keputusan yang benar.' : 'Operasi selesai, tetapi Corruption King belum dikalahkan. Pelajari feedback pada setiap keputusan dan coba lagi untuk memperkuat pertahanan integritas.';
    $('finalIntegrity').textContent = `${integrity}/100`;
    $('finalBoss').textContent = bossDefeated ? 'DEFEATED' : 'STANDING';
    $('bestRecord').textContent = `${bestIntegrity}/100`;
    const earned = bossDefeated ? (integrity === 100 ? 'PURE INTEGRITY' : 'BOSS SLAYER') : (integrity > 0 ? 'FIELD LEARNER' : 'RETRY & LEARN');
    $('earnedAchievement').querySelector('b').textContent = earned;
    $('earnedAchievement').querySelector('small').textContent = bossDefeated ? 'MISSION ACHIEVEMENT' : 'KEEP LEARNING';
    $('earnedAchievement').querySelector('span').textContent = bossDefeated ? '★' : '↻';
    showScreen('endScreen');
    window.scrollTo({top:$('endScreen').getBoundingClientRect().top + window.scrollY - 20,behavior:'smooth'});
  }
  function continueGame() {
    if (!answered) return;
    if (integrity <= 0 || (missionIndex === 4 && bossHp <= 0)) { finishGame(); return; }
    if (missionIndex < 3) { missionIndex++; }
    else if (missionIndex === 3) { missionIndex = 4; bossRound = 0; }
    else if (bossRound < 2) { bossRound++; }
    else { finishGame(); return; }
    renderCase();
  }

  $('startBtn').addEventListener('click', startGame);
  $('guideStartBtn').addEventListener('click', startGame);
  $('howBtn').addEventListener('click', () => { showScreen('howPanel'); window.scrollTo({top:$('howPanel').getBoundingClientRect().top + window.scrollY - 20,behavior:'smooth'}); });
  $('continueBtn').addEventListener('click', continueGame);
  $('replayBtn').addEventListener('click', startGame);
  document.addEventListener('keydown', (event) => {
    if ($('playScreen').classList.contains('hidden')) return;
    if (!answered && ['1','2','3'].includes(event.key)) selectChoice(Number(event.key)-1);
    else if (answered && (event.key === 'Enter' || event.key === ' ')) {
      // Let the focused Continue button handle its own native activation; avoid double-advancing.
      if (event.target === $('continueBtn')) return;
      event.preventDefault(); continueGame();
    }
  });
  $('year').textContent = new Date().getFullYear();
  renderAchievements();
})();
