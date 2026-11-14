(() => {
  'use strict';
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const W = 960, H = 540, FLOOR = 454, WORLD = 1980;
  const $ = id => document.getElementById(id);
  const STORE = 'aldianIntegrityActionV2';
  const MAX_HP = 100, MAX_ENERGY = 100;
  const stages = [
    {name:'VENDOR DISTRICT', subtitle:'THE GIFT ECONOMY', sky:'#f8dcb9', hill:'#9bc69d', ground:'#73827b', accent:'#e28b58', enemy:'vendor', title:'VENDOR DISTRICT CLEARED', debriefTitle:'GRATIFICATION RISK CONTAINED', debrief:'Hadiah atau fasilitas dari pihak yang memiliki hubungan bisnis dapat memengaruhi independensi atau menimbulkan persepsi balas budi. Jangan memutuskan sendiri bahwa hadiah boleh diterima.', rule:'Tolak atau deklarasikan melalui mekanisme resmi yang berlaku. Simpan catatan dan minta arahan jika status hadiah tidak jelas.'},
    {name:'DRILLING YARD', subtitle:'NO SHORTCUTS, NO BRIBES', sky:'#b9d7df', hill:'#749d91', ground:'#626e72', accent:'#d66e48', enemy:'briber', title:'DRILLING YARD SECURED', debriefTitle:'BRIBERY ATTEMPT REJECTED', debrief:'Pembayaran atau keuntungan pribadi untuk memengaruhi pemeriksaan, prioritas, atau keputusan merusak proses yang adil dan objektif.', rule:'Tolak tawaran, jangan menjanjikan perlakuan khusus, catat fakta, dan gunakan jalur pelaporan atau konsultasi yang berwenang.'},
    {name:'RECORDS FACILITY', subtitle:'KEEP THE DATA TRUE', sky:'#c6d8e9', hill:'#7886a6', ground:'#68747e', accent:'#7d91ba', enemy:'data', title:'RECORDS FACILITY RESTORED', debriefTitle:'DATA INTEGRITY PROTECTED', debrief:'Mengubah, menghapus, atau menyembunyikan data tanpa dasar dapat merusak keputusan dan jejak audit. Tekanan waktu atau target bukan alasan untuk mengubah fakta.', rule:'Verifikasi sumber, dokumentasikan koreksi, pertahankan audit trail, dan eskalasi perbedaan melalui proses resmi.'},
    {name:'CORRUPTION HQ', subtitle:'FINAL INTEGRITY OPERATION', sky:'#273348', hill:'#333b53', ground:'#343943', accent:'#e15d59', enemy:'boss', title:'CORRUPTION KING DEFEATED', debriefTitle:'THE SYSTEM STANDS', debrief:'Konflik kepentingan, penyalahgunaan kewenangan, dan penutupan transaksi dapat saling terkait. Satu keputusan transparan dapat menghentikan rantai risiko.', rule:'Ungkapkan konflik, jaga bukti, hindari persetujuan tanpa verifikasi, dan gunakan kanal resmi. Jangan melakukan investigasi di luar kewenangan.'}
  ];
  const enemyInfo = {
    vendor:{name:'MR. GRATIFICATION',color:'#d78b4e',hp:3,shot:'gift',label:'GIFT'},
    briber:{name:'BRIBERY MASTER',color:'#b67a42',hp:4,shot:'envelope',label:'CASH'},
    data:{name:'DATA MANIPULATOR',color:'#7889b8',hp:4,shot:'glitch',label:'DATA'}
  };
  let state='menu', stage=0, worldWidth=WORLD, camera=0, player, enemies=[], shots=[], enemyShots=[], pickups=[], particles=[], obstacles=[], boss=null;
  let score=0, evidence=0, areasCleared=0, lastTime=0, stageDebriefShown=false, invuln=0, shieldTime=0, shieldCooldown=0, shotCooldown=0, flash=0, resultWin=false;
  let bestScore=0, achievements=new Set(), muted=false, audioCtx=null, musicTimer=null, musicStep=0;
  let keys={left:false,right:false,shield:false};
  const melody=[523,659,784,659,587,698,880,698,523,659,784,988,880,784,659,587];

  try { const s=JSON.parse(localStorage.getItem(STORE)||'{}'); bestScore=Number(s.bestScore||0); achievements=new Set(Array.isArray(s.achievements)?s.achievements:[]); } catch(e){}
  function save(){try{localStorage.setItem(STORE,JSON.stringify({bestScore,achievements:[...achievements]}));}catch(e){} renderRecords();}
  function unlock(id){if(!achievements.has(id)){achievements.add(id);save();}}
  function renderRecords(){ $('bestScore').textContent=String(bestScore).padStart(4,'0'); $('bossRecord').textContent=achievements.has('king-defeated')?'YES':'NO'; document.querySelectorAll('[data-ach]').forEach(el=>el.classList.toggle('unlocked',achievements.has(el.dataset.ach))); }
  function showOverlay(id){['startOverlay','pauseOverlay','stageOverlay','resultOverlay','debriefOverlay'].forEach(x=>$(x).classList.toggle('show',x===id));}
  function hideOverlays(){['startOverlay','pauseOverlay','stageOverlay','resultOverlay','debriefOverlay'].forEach(x=>$(x).classList.remove('show'));}

  function audio(){ if(muted)return; try{ if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==='suspended')audioCtx.resume(); return audioCtx;}catch(e){return null;} }
  function tone(freq=440,duration=.09,type='square',volume=.035){const a=audio();if(!a)return;const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(volume,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+duration);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+duration);}
  function startMusic(){ if(muted||musicTimer)return; audio(); musicTimer=setInterval(()=>{if(state!=='playing'||muted)return; tone(melody[musicStep%melody.length],.12,'square',.018); if(musicStep%4===0)tone(melody[(musicStep+4)%melody.length]/2,.13,'triangle',.012);musicStep++;},155); }
  function stopMusic(){if(musicTimer){clearInterval(musicTimer);musicTimer=null;}}
  function toggleSound(){muted=!muted;$('soundBtn').textContent=muted?'♫ OFF':'♫ ON';if(muted)stopMusic();else if(state==='playing')startMusic();}

  function resetPlayer(){player={x:80,y:FLOOR-64,w:38,h:62,vx:0,vy:0,face:1,onGround:true,hp:MAX_HP,energy:MAX_ENERGY,anim:0,attackPose:0};invuln=0;shieldTime=0;shieldCooldown=0;shotCooldown=0;}
  function addPickup(x,y=FLOOR-70){pickups.push({x,y,w:23,h:23,phase:Math.random()*6,got:false});}
  function initStage(idx){stage=idx;camera=0;worldWidth=idx===3?1550:WORLD;shots=[];enemyShots=[];particles=[];pickups=[];obstacles=[];stageDebriefShown=false;resetPlayer();boss=null;enemies=[];
    if(idx<3){const type=stages[idx].enemy;const count=idx===0?3:3;const positions=[490,1030,1570];for(let i=0;i<count;i++){const info=enemyInfo[type];enemies.push({type,x:positions[i],y:FLOOR-58,w:42,h:58,hp:info.hp,maxHp:info.hp,dir:-1,cool:1.2+i*.7,phase:i*.8,hit:0,dead:false});}
      [300,770,1280,1790].forEach((x,i)=>addPickup(x,FLOOR-((i%2)?112:72)));
      obstacles=[{x:675,w:48,h:27,type:'pipe',dead:false},{x:1170,w:58,h:34,type:'crate',dead:false},{x:1450,w:50,h:24,type:'pipe',dead:false}];
    } else {boss={x:1110,y:FLOOR-122,w:82,h:122,hp:21,maxHp:21,cool:1.3,phase:0,hit:0,flash:0,dead:false};[330,680,900].forEach((x,i)=>addPickup(x,FLOOR-(i===1?130:78)));obstacles=[{x:510,w:60,h:28,type:'pipe',dead:false},{x:825,w:54,h:32,type:'crate',dead:false}];}
    $('stageName').textContent=stages[idx].name;$('areaText').textContent=`0${idx+1} / 04`;updateHud();
  }
  function startGame(){score=0;evidence=0;areasCleared=0;resultWin=false;initStage(0);state='playing';hideOverlays();$('statusText').textContent='MISSION ACTIVE — SECURE THE EVIDENCE';startMusic();lastTime=performance.now();}
  function updateHud(){ $('hpFill').style.width=`${player.hp}%`; $('hpText').textContent=Math.ceil(player.hp);$('shieldFill').style.width=`${player.energy}%`; $('shieldText').textContent=Math.floor(player.energy);$('evidenceText').textContent=String(evidence).padStart(2,'0');$('scoreText').textContent=`SCORE ${String(score).padStart(4,'0')}`;$('threatText').textContent=String(enemies.filter(e=>!e.dead).length+(boss&&!boss.dead?1:0)); }
  function moveToNext(){areasCleared=Math.max(areasCleared,stage+1);$('areasCleared').textContent=`${areasCleared} / 4`;if(stage<3){initStage(stage+1);state='playing';hideOverlays();$('statusText').textContent='NEW ZONE — STAY ALERT';tone(660,.18,'triangle');startMusic();}else{winGame();}}
  function showDebrief(){const d=stages[stage];$('debriefTitle').textContent=d.debriefTitle;$('debriefCopy').textContent=d.debrief;$('debriefRule').textContent=d.rule;state='debrief';stopMusic();showOverlay('debriefOverlay');tone(660,.13,'triangle');}
  function afterDebrief(){if(stage===3){winGame();return;}state='stageclear';$('stageClearTitle').textContent=stages[stage].title;$('stageClearCopy').textContent=`Evidence secured: ${evidence}. Next zone: ${stages[stage+1].name}.`;showOverlay('stageOverlay');}
  function winGame(){state='victory';resultWin=true;areasCleared=4;score+=500;unlock('king-defeated');if(player.hp>=85)unlock('perfect-run');bestScore=Math.max(bestScore,score);save();stopMusic();showResult(true);}
  function loseGame(){state='defeat';resultWin=false;bestScore=Math.max(bestScore,score);save();stopMusic();showResult(false);}
  function showResult(won){$('resultEyebrow').textContent=won?'OPERATION COMPLETE':'MISSION FAILED';$('resultTitle').textContent=won?'INTEGRITY GUARDIAN':'DEFENDER DOWN';$('resultCopy').textContent=won?'Corruption King telah dikalahkan. Bukti, transparansi, dan akuntabilitas menjaga operasi.':'Aldian harus mundur dari operasi. Pelajari pola serangan dan coba lagi.';$('resultScore').textContent=String(score).padStart(4,'0');$('resultEvidence').textContent=String(evidence).padStart(2,'0');$('resultBest').textContent=String(bestScore).padStart(4,'0');$('resultBadge').textContent=won?'🏆 MAHAKAM INTEGRITY GUARDIAN':'🛡️ FIELD LEARNER';showOverlay('resultOverlay');}

  function firePulse(){if(state!=='playing'||shotCooldown>0||player.energy<9)return;player.energy-=9;shotCooldown=.28;player.attackPose=.12;shots.push({x:player.x+(player.face>0?player.w:-10),y:player.y+30,vx:player.face*650,life:1.45,w:18,h:12});tone(740,.06,'square',.023);updateHud();}
  function useShield(){if(state!=='playing'||shieldCooldown>0||player.energy<22)return;player.energy-=22;shieldTime=.68;shieldCooldown=2.1;tone(330,.15,'sine',.035);updateHud();}
  function jump(){if(state==='playing'&&player.onGround){player.vy=-630;player.onGround=false;tone(440,.07,'square',.018);}}
  function hurt(amount,fromX){if(invuln>0||shieldTime>0)return;player.hp=Math.max(0,player.hp-amount);invuln=.85;player.vx=fromX<player.x?240:-240;player.vy=-210;flash=.18;for(let i=0;i<8;i++)particles.push({x:player.x+20,y:player.y+30,vx:(Math.random()-.5)*180,vy:-Math.random()*170,life:.5,color:'#e75b50'});tone(125,.16,'sawtooth',.04);updateHud();if(player.hp<=0)loseGame();}
  function makeParticles(x,y,color,n=8){for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-.5)*190,vy:-Math.random()*180,life:.45+Math.random()*.25,color});}

  function update(dt){if(state!=='playing')return;dt=Math.min(dt,.035);player.anim+=dt*10;player.attackPose=Math.max(0,player.attackPose-dt);invuln=Math.max(0,invuln-dt);shieldTime=Math.max(0,shieldTime-dt);shieldCooldown=Math.max(0,shieldCooldown-dt);shotCooldown=Math.max(0,shotCooldown-dt);player.energy=Math.min(MAX_ENERGY,player.energy+dt*5.3);
    const speed=310;player.vx=0;if(keys.left){player.vx=-speed;player.face=-1;}if(keys.right){player.vx=speed;player.face=1;}player.x+=player.vx*dt;player.x=Math.max(8,Math.min(worldWidth-player.w-20,player.x));player.vy+=1450*dt;player.y+=player.vy*dt;if(player.y+player.h>=FLOOR){player.y=FLOOR-player.h;player.vy=0;player.onGround=true;}else player.onGround=false;
    obstacles.forEach(o=>{if(o.dead)return;const box={x:o.x,y:FLOOR-o.h,w:o.w,h:o.h};if(hit(player,box)){if(player.y+player.h<=FLOOR-o.h+12&&player.vy>=0){player.y=FLOOR-o.h-player.h;player.vy=0;player.onGround=true;}else{hurt(7,o.x);player.x+=player.x<o.x?-24:24;}}});
    const activeEnemies=enemies.filter(e=>!e.dead);activeEnemies.forEach(e=>{e.phase+=dt*5;e.hit=Math.max(0,e.hit-dt);e.cool-=dt;const dx=player.x-e.x;if(Math.abs(dx)<660&&e.cool<=0){const info=enemyInfo[e.type];const dir=dx<0?-1:1;enemyShots.push({x:e.x+(dir<0?0:e.w),y:e.y+27,vx:dir*(e.type==='data'?320:260),vy:e.type==='data'?(-40+Math.random()*80):0,w:22,h:18,type:info.shot,life:3});e.cool=e.type==='vendor'?2.5:e.type==='briber'?1.9:1.55;}if(Math.abs(dx)<120)e.x+=Math.sign(-dx)*55*dt;});
    if(boss&&!boss.dead){boss.cool-=dt;boss.hit=Math.max(0,boss.hit-dt);boss.flash=Math.max(0,boss.flash-dt);boss.phase=boss.hp<=6?3:boss.hp<=13?2:1;if(boss.cool<=0){const dir=player.x<boss.x?-1:1;const n=boss.phase===1?1:boss.phase===2?2:3;for(let i=0;i<n;i++){enemyShots.push({x:boss.x+(dir<0?0:boss.w),y:boss.y+44+i*18,vx:dir*(boss.phase===1?290:boss.phase===2?360:390),vy:(i-(n-1)/2)*50,w:24,h:18,type:'corrupt',life:3});}boss.cool=boss.phase===1?1.7:boss.phase===2?1.1:.78;if(boss.phase===3&&Math.random()<.45){enemyShots.push({x:boss.x,y:FLOOR-23,vx:dir*240,vy:0,w:45,h:16,type:'wave',life:3});}}boss.x+=Math.sin(performance.now()/500)*18*dt;}
    shots.forEach(s=>{s.x+=s.vx*dt;s.life-=dt;});shots=shots.filter(s=>s.life>0&&s.x>-camera-50&&s.x<camera+W+50);
    shots.forEach(s=>{activeEnemies.forEach(e=>{if(!e.dead&&hit(s,e)){s.life=0;e.hp--;e.hit=.14;makeParticles(s.x,s.y,'#f7d46d',4);if(e.hp<=0){e.dead=true;score+=220;addPickup(e.x+12,FLOOR-65);if(e.type==='vendor')unlock('vendor-neutralized');if(e.type==='briber')unlock('bribery-stopped');if(e.type==='data')unlock('data-protected');tone(210,.13,'triangle');}}});if(boss&&!boss.dead&&hit(s,boss)){s.life=0;boss.hp--;boss.hit=.14;makeParticles(s.x,s.y,'#a8e6c0',5);if(boss.hp<=0){boss.dead=true;score+=1000;makeParticles(boss.x+40,boss.y+55,'#f7d46d',35);tone(880,.2,'triangle');setTimeout(()=>tone(1100,.25,'triangle'),150);}}});shots=shots.filter(s=>s.life>0);
    enemyShots.forEach(s=>{s.x+=s.vx*dt;s.y+=(s.vy||0)*dt;s.life-=dt;if(hit(s,player)){s.life=0;if(shieldTime>0){score+=25;makeParticles(s.x,s.y,'#7ac5ee',5);tone(550,.07,'sine');}else hurt(s.type==='corrupt'?14:10,s.x);}});enemyShots=enemyShots.filter(s=>s.life>0&&s.x>-camera-70&&s.x<camera+W+70);
    pickups.forEach(p=>{p.phase+=dt*4;if(!p.got&&hit(player,{x:p.x,y:p.y+Math.sin(p.phase)*6,w:p.w,h:p.h})){p.got=true;evidence++;score+=100;player.energy=Math.min(MAX_ENERGY,player.energy+25);unlock('first-evidence');makeParticles(p.x,p.y,'#f5d36a',10);tone(920,.08,'square');}});
    particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=380*dt;p.life-=dt;});particles=particles.filter(p=>p.life>0);
    if(stage<3&&enemies.every(e=>e.dead)&&player.x>worldWidth-150){showDebrief();return;}if(stage===3&&boss&&boss.dead){showDebrief();return;}
    camera=Math.max(0,Math.min(worldWidth-W,player.x-W*.42));updateHud();$('areaText').textContent=`0${stage+1} / 04`;if(player.hp<=0)loseGame();
  }
  function hit(a,b){return a.x<(b.x+b.w)&&a.x+a.w>b.x&&a.y<(b.y+b.h)&&a.y+a.h>b.y;}

  function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
  function text(t,x,y,size=12,color='#2b2320',align='left'){ctx.fillStyle=color;ctx.font=`bold ${size}px monospace`;ctx.textAlign=align;ctx.fillText(t,x,y);}
  function drawBackground(){const cfg=stages[stage];const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,cfg.sky);grad.addColorStop(1,stage===3?'#596075':'#e9e8d9');ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
    // sun / night moon
    ctx.fillStyle=stage===3?'#f2c66b':'#fff0c4';ctx.fillRect(760,65,54,54);ctx.fillRect(770,55,34,74);
    for(let i=0;i<5;i++){const x=((i*245-camera*.18)%(W+280)+W+280)%(W+280)-120;rect(x,90+(i%3)*27,76,18,'#ffffff88');rect(x+14,78+(i%3)*27,47,18,'#ffffff88');}
    rect(0,300,W,154,cfg.hill);for(let i=0;i<8;i++){const x=i*300-camera*.32;rect(x,284,150,170,stage===3?'#39425a':'#8aa99a');rect(x+25,260,105,32,stage===3?'#39425a':'#8aa99a');}
    // oil and gas facility silhouettes
    for(let i=0;i<6;i++){const x=i*390-camera*.62+70; if(i%2===0){rect(x,250,92,120,stage===3?'#59647a':'#c5b9a5');rect(x-8,240,108,16,cfg.accent);for(let j=0;j<3;j++)rect(x+12+j*27,270,17,23,'#7197a5');rect(x+14,318,64,42,'#8b9ba0');}else{rect(x+26,235,56,130,stage===3?'#48546c':'#b5b8a9');ctx.strokeStyle='#4a5a62';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x+5,235);ctx.lineTo(x+54,130);ctx.lineTo(x+103,235);ctx.stroke();for(let j=0;j<4;j++)rect(x+20+j*17,215-j*16,8,8,cfg.accent);}}
    // tanks and pipe racks
    for(let i=0;i<6;i++){const x=i*350-camera*.86+130;rect(x,354,78,72,stage===3?'#777e8b':'#d6d0c2');rect(x+4,346,70,10,stage===3?'#9b8991':'#ede8d9');rect(x+10,367,58,4,'#84939a');}
    rect(0,FLOOR,W,H-FLOOR,'#303a42');rect(0,FLOOR-10,W,13,'#d7d0bc');for(let i=0;i<12;i++){const x=((i*130-camera*.96)%(W+130)+W+130)%(W+130)-20;rect(x,FLOOR+32,58,5,'#ddc58b');}
    // zone signage
    rect(22,22,255,35,'#fff8e9');ctx.strokeStyle='#2b2320';ctx.lineWidth=2;ctx.strokeRect(22,22,255,35);text(`ZONE 0${stage+1} // ${cfg.subtitle}`,33,45,10,'#2b2320');
  }
  function drawPlayer(){if(!player)return;const x=player.x-camera,y=player.y,blink=invuln>0&&Math.floor(performance.now()/85)%2===0;if(blink)return;const bob=player.onGround?Math.sin(player.anim)*2:0;ctx.save();ctx.translate(Math.round(x),Math.round(y+bob));
    rect(7,57,29,6,'#17202766');rect(5,50,13,10,'#27303a');rect(24,50,13,10,'#27303a');rect(7,39,12,14,'#f97316');rect(22,39,12,14,'#f97316');rect(7,44,12,4,'#f6d365');rect(22,44,12,4,'#f6d365');
    rect(5,20,30,25,'#f97316');rect(5,27,30,5,'#f6d365');rect(18,20,3,25,'#30343a');rect(26,34,6,7,'#1d63b8');
    rect(0,22,8,22,'#f97316');rect(32,22,8,21,'#f97316');rect(33,39,8,7,'#f2c4a9');
    rect(9,5,22,19,'#f2c4a9');rect(7,3,26,7,'#25272a');rect(10,2,21,4,'#25272a');rect(13,13,3,4,'#20242a');rect(25,13,3,4,'#20242a');rect(17,19,7,2,'#9e554a');
    rect(5,0,30,8,'#fffdf5');rect(8,-5,24,7,'#fffdf5');rect(17,-7,8,3,'#d6d9df');rect(1,6,38,3,'#d8dde3');rect(16,3,8,4,'#1d63b8');rect(20,3,5,4,'#52b788');
    if(shieldTime>0){ctx.strokeStyle='#7ed4ef';ctx.lineWidth=4;ctx.strokeRect(-7,-10,54,76);ctx.fillStyle='#6dbfe822';ctx.fillRect(-7,-10,54,76);}
    if(player.attackPose>0){rect(player.face>0?34:-16,28,16,5,'#f6d365');}
    ctx.restore();
  }
  function drawEnemy(e){const x=e.x-camera,y=e.y;if(x<-100||x>W+100)return;ctx.save();ctx.translate(Math.round(x),Math.round(y+Math.sin(e.phase)*2));if(e.hit>0)ctx.globalAlpha=.55;
    const col=enemyInfo[e.type].color;rect(5,52,34,6,'#10182055');rect(8,35,12,20,'#2a3038');rect(27,35,12,20,'#2a3038');rect(4,17,39,25,col);rect(0,22,8,19,'#30313a');rect(39,22,8,19,'#30313a');rect(9,4,30,23,'#e4bda4');rect(6,1,36,8,'#2c2930');rect(11,12,5,5,'#211f25');rect(29,12,5,5,'#211f25');rect(16,23,16,3,'#702f32');rect(4,0,40,5,'#282d36');rect(4,0,40,4,'#f4d16e');
    if(e.type==='vendor'){rect(15,31,18,5,'#fff1d1');rect(18,32,12,3,'#cb8b50');}if(e.type==='briber'){rect(18,31,14,8,'#d6b04f');rect(21,34,8,2,'#66502f');}if(e.type==='data'){rect(13,31,22,7,'#2d416b');rect(17,33,14,2,'#a9d3ff');}
    ctx.restore();rect(x+2,y-10,42,4,'#3a3434');rect(x+2,y-10,42*(e.hp/e.maxHp),4,'#db6251');
    text(enemyInfo[e.type].label,x+22,y-17,8,'#fff7e9','center');
  }
  function drawBoss(){if(!boss||boss.dead)return;const x=boss.x-camera,y=boss.y;ctx.save();ctx.translate(Math.round(x),Math.round(y));if(boss.hit>0)ctx.globalAlpha=.5;const c=boss.phase===3?'#8d3546':'#34394b';rect(12,100,25,20,'#202633');rect(54,100,25,20,'#202633');rect(4,30,82,76,c);rect(-4,42,18,44,'#7e3647');rect(82,42,18,44,'#7e3647');rect(15,7,52,38,'#b78668');rect(11,0,60,19,'#272b36');rect(23,21,10,9,'#ffdd7b');rect(48,21,10,9,'#ffdd7b');rect(31,36,20,5,'#6d2835');rect(5,-5,80,9,'#e2b84f');rect(23,-19,12,18,'#e2b84f');rect(54,-19,12,18,'#e2b84f');rect(37,-28,16,12,'#f5d26b');rect(24,52,40,8,'#d84f52');rect(31,72,27,11,'#202936');ctx.restore();rect(x-4,y-39,90,8,'#242633');rect(x-4,y-39,90*(boss.hp/boss.maxHp),8,'#e45c57');text(`CORRUPTION KING • PHASE ${boss.phase}`,x+40,y-47,9,'#fff7e9','center');}
  function drawObjects(){obstacles.forEach(o=>{if(o.dead)return;const x=o.x-camera;if(x<-100||x>W+100)return;if(o.type==='pipe'){rect(x,FLOOR-o.h,o.w,o.h,'#73838b');rect(x,FLOOR-o.h,o.w,6,'#cbd4d6');for(let a=0;a<3;a++)rect(x+9+a*14,FLOOR-o.h+9,6,o.h-12,'#566a73');}else{rect(x,FLOOR-o.h,o.w,o.h,'#a87b51');rect(x+5,FLOOR-o.h+7,o.w-10,5,'#d3a36a');rect(x+o.w/2-2,FLOOR-o.h,4,o.h,'#6e4b39');}});
    pickups.forEach(p=>{if(p.got)return;const x=p.x-camera,y=p.y+Math.sin(p.phase)*6;rect(x+6,y-4,12,28,'#4eae88');rect(x+2,y,20,17,'#f6d36d');rect(x+6,y+4,12,3,'#fff8df');rect(x+6,y+10,9,2,'#b57d37');});
    shots.forEach(s=>{const x=s.x-camera;rect(x,s.y,18,12,'#fff8df');rect(x+4,s.y+3,10,3,'#f3c85b');rect(x+13,s.y+3,4,6,'#52b788');});
    enemyShots.forEach(s=>{const x=s.x-camera;const c=s.type==='gift'?'#e4a759':s.type==='envelope'?'#d45e56':s.type==='glitch'?'#8ca4df':s.type==='wave'?'#dc6460':'#b64d62';rect(x,s.y,s.w,s.h,c);rect(x+4,s.y+3,s.w-8,3,'#f8e6bc');if(s.type==='wave')rect(x,s.y+s.h-3,s.w,3,'#f4c16a');});
    particles.forEach(p=>rect(p.x-camera,p.y,4,4,p.color));
  }
  function draw(){ctx.clearRect(0,0,W,H);drawBackground();drawObjects();enemies.forEach(drawEnemy);drawBoss();drawPlayer();if(state==='playing'&&shieldCooldown>0){text('SHIELD RECHARGING',W-20,34,9,'#fff4dc','right');}if(state==='playing'&&stage<3&&enemies.every(e=>e.dead)){text('GATE OPEN →',W-28,88,12,'#fff4dc','right');} }
  function frame(t){const dt=(t-lastTime)/1000||0;lastTime=t;update(dt);draw();requestAnimationFrame(frame);}

  $('startBtn').addEventListener('click',startGame);$('resumeBtn').addEventListener('click',()=>{state='playing';hideOverlays();lastTime=performance.now();startMusic();});$('pauseBtn').addEventListener('click',()=>{if(state==='playing'){state='paused';stopMusic();showOverlay('pauseOverlay');}else if(state==='paused'){$('resumeBtn').click();}});$('soundBtn').addEventListener('click',toggleSound);$('restartBtn').addEventListener('click',startGame);$('nextStageBtn').addEventListener('click',moveToNext);$('debriefContinueBtn').addEventListener('click',afterDebrief);$('playAgainBtn').addEventListener('click',startGame);
  document.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup',' ','a','d','j','k','escape'].includes(k))e.preventDefault();if(k==='escape'){if(state==='playing'){$('pauseBtn').click();}else if(state==='paused')$('resumeBtn').click();return;}if(k==='arrowleft'||k==='a')keys.left=true;if(k==='arrowright'||k==='d')keys.right=true;if(k===' '||k==='arrowup'||k==='w')jump();if(k==='j'||k==='x')firePulse();if(k==='k'||k==='c')useShield();});
  document.addEventListener('keyup',e=>{const k=e.key.toLowerCase();if(k==='arrowleft'||k==='a')keys.left=false;if(k==='arrowright'||k==='d')keys.right=false;});
  document.querySelectorAll('[data-hold]').forEach(btn=>{const key=btn.dataset.hold;const on=e=>{e.preventDefault();keys[key]=true;btn.classList.add('pressed');};const off=e=>{e.preventDefault();keys[key]=false;btn.classList.remove('pressed');};btn.addEventListener('pointerdown',on);['pointerup','pointercancel','pointerleave'].forEach(ev=>btn.addEventListener(ev,off));});
  document.querySelectorAll('[data-action]').forEach(btn=>btn.addEventListener('pointerdown',e=>{e.preventDefault();const a=btn.dataset.action;if(a==='jump')jump();if(a==='attack')firePulse();if(a==='shield')useShield();btn.classList.add('pressed');setTimeout(()=>btn.classList.remove('pressed'),130);}));
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='playing')$('pauseBtn').click();});
  renderRecords();$('areasCleared').textContent='0 / 4';
  requestAnimationFrame(t=>{lastTime=t;frame(t);});
})();
