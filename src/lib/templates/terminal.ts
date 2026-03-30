import type { SiteContent } from '@/lib/site-template';

export function buildTerminalHtml(content: SiteContent): string {
  const firstName = content.targetName.split(' ')[0] || content.targetName;
  const sessionId = `sess_${Date.now().toString(36)}`;
  const excuseResponses = JSON.stringify(content.excuseResponses);
  const factsHtml = content.targetFacts
    .map((fact) => `<div class="line"><span class="prompt">root@pullup:~$</span><span>cat fact_${fact.length}.txt</span></div><div class="line output">${fact}</div>`)
    .join('');
  const squadHtml = content.squad
    .map(
      (member) => `
        <div class="user-card">
          <div class="line"><span class="prompt">root@pullup:~$</span><span>users --inspect ${member.name.toLowerCase().replace(/\s+/g, '_')}</span></div>
          <div class="line output">name: ${member.name}</div>
          <div class="line output">role: ${member.role}</div>
          <div class="line output">status: confirmed</div>
        </div>`
    )
    .join('');
  const stayHomeHtml = content.timelineStayHome
    .map(
      (item, index) => `
        <div class="git-row">
          <span class="hash">a${index}f${index}9${index}</span>
          <span class="git-msg">${item}</span>
        </div>`
    )
    .join('');
  const showUpHtml = content.timelineShowUp
    .map(
      (item, index) => `
        <div class="git-row good">
          <span class="hash">b${index}c${index}7${index}</span>
          <span class="git-msg">${item}</span>
        </div>`
    )
    .join('');
  const petitionHtml = content.petitionSignatures
    .map((signature) => `<div class="line output"><span>${signature.name}</span><span class="time">${signature.time}</span></div>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${content.heroHeadline}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#39FF14;font-family:'Space Mono',monospace;overflow-x:hidden}
::selection{background:#39FF14;color:#000}
a{color:inherit}
#splash{position:fixed;inset:0;z-index:9999;background:#000;display:flex;align-items:center;justify-content:center;padding:20px;transition:opacity .8s}
#splash.gone{opacity:0;pointer-events:none}
.splash-shell{max-width:900px;width:100%;border:1px solid #39FF14;padding:26px;background:rgba(0,18,0,.65);box-shadow:0 0 40px rgba(57,255,20,.12)}
.ascii{white-space:pre;font-size:clamp(.46rem,1.2vw,.8rem);line-height:1.2;color:#6eff55}
.splash-title{font-size:clamp(1.8rem,6vw,3.6rem);line-height:1.05;margin:18px 0 12px}
.splash-copy{line-height:1.8;color:#9dff8a}
.splash-btn{margin-top:18px;border:1px solid #39FF14;background:#000;color:#39FF14;padding:12px 16px;font-family:'Space Mono',monospace;letter-spacing:2px;text-transform:uppercase;cursor:pointer}
.cursor::after{content:'_';animation:blink 1s steps(1,end) infinite}
@keyframes blink{50%{opacity:0}}
main{opacity:0;transition:opacity .9s}
main.visible{opacity:1}
.page{max-width:1100px;margin:0 auto;padding:18px 14px 72px}
.bar{padding:10px 14px;border:1px solid #39FF14;background:rgba(0,18,0,.5);display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
.bar span{font-size:11px;letter-spacing:2px;text-transform:uppercase}
.panel{margin-top:16px;border:1px solid rgba(57,255,20,.5);background:rgba(0,22,0,.44);padding:18px}
.panel pre{white-space:pre-wrap}
.line{display:flex;gap:10px;align-items:flex-start;line-height:1.8}
.line.output{justify-content:space-between;color:#9dff8a}
.prompt{color:#39FF14;flex-shrink:0}
.muted{color:#6eff55}
.title{font-size:clamp(1.8rem,5vw,3.8rem);line-height:1.02;margin:12px 0 14px}
.grid{display:grid;grid-template-columns:1.15fr .85fr;gap:16px}
.box-title{margin-bottom:14px;font-size:1rem;text-transform:uppercase;color:#9dff8a}
.meter-wrap{margin-top:16px}
.meter-shell{height:18px;border:1px solid #39FF14;padding:2px}
.meter-bar{height:100%;width:0;background:linear-gradient(90deg,#145c07 0%,#39FF14 100%);transition:width 2.3s ease}
.meter-copy{margin-top:10px;line-height:1.7;color:#9dff8a}
.excuse-box{display:grid;gap:12px}
.excuse-display{min-height:54px;border:1px solid rgba(57,255,20,.4);padding:14px;display:flex;align-items:center;justify-content:center;text-align:center;color:#9dff8a}
.excuse-input{width:100%;padding:12px;border:1px solid rgba(57,255,20,.45);background:#000;color:#39FF14;font-family:'Space Mono',monospace}
.excuse-btn{border:1px solid #39FF14;background:transparent;color:#39FF14;padding:12px 16px;font-family:'Space Mono',monospace;letter-spacing:2px;text-transform:uppercase;cursor:pointer}
.excuse-verdict{line-height:1.7;color:#9dff8a;opacity:0;transition:opacity .4s}
.excuse-verdict.show{opacity:1}
.user-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px}
.user-card{border:1px solid rgba(57,255,20,.35);padding:14px}
.git-card{border:1px solid rgba(57,255,20,.35);padding:14px}
.git-row{display:grid;grid-template-columns:90px 1fr;gap:12px;padding:9px 0;border-bottom:1px dashed rgba(57,255,20,.22)}
.git-row.good .git-msg{color:#c0ffb6}
.hash{color:#6eff55}
.table{width:100%;border-collapse:collapse}
.table td,.table th{padding:12px 8px;border-bottom:1px dashed rgba(57,255,20,.22);text-align:left}
.table th{color:#6eff55;font-size:11px;letter-spacing:2px;text-transform:uppercase}
.count-box{display:inline-block;white-space:pre;line-height:1.4;padding:14px;border:1px solid #39FF14;margin-top:12px}
.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:16px}
.actions button,.actions a{border:1px solid #39FF14;background:#000;color:#39FF14;padding:12px 14px;font-family:'Space Mono',monospace;letter-spacing:2px;text-transform:uppercase;text-decoration:none;cursor:pointer}
.popup{position:fixed;inset:0;background:rgba(0,0,0,.92);display:none;align-items:center;justify-content:center;padding:20px;z-index:10001}
.popup.active{display:flex}
.popup-card{max-width:560px;width:100%;border:1px solid #39FF14;padding:24px;background:rgba(0,18,0,.8)}
.popup-card p{margin-top:12px;line-height:1.8;color:#9dff8a}
.reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}
.reveal.visible{opacity:1;transform:translateY(0)}
.shake{animation:shake .45s linear}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
@media (max-width:920px){
  .grid{grid-template-columns:1fr}
}
@media (max-width:640px){
  .page{padding:14px 10px 60px}
  .git-row{grid-template-columns:1fr}
  .line.output{flex-direction:column;gap:2px}
}
</style>
</head>
<body>
<div id="splash" onclick="enterSite()">
  <div class="splash-shell">
    <div class="ascii">+--------------------------------------------------------------+
| pullup terminal                                              |
| session ${sessionId.padEnd(44, ' ')}|
+--------------------------------------------------------------+</div>
    <div class="splash-title cursor">${content.splashTagline}</div>
    <p class="splash-copy">System scan detected one unresolved issue: ${content.targetName} has not yet appeared at ${content.venueName}. Open the session to review logs, warnings, and corrective commands.</p>
    <button class="splash-btn">boot session</button>
  </div>
</div>

<main id="main">
  <div class="page">
    <div class="bar reveal">
      <span>root access granted</span>
      <span>target: ${content.targetName.toLowerCase()}</span>
      <span>deadline: ${content.closingTime.toLowerCase()}</span>
    </div>

    <section class="panel reveal">
      <div class="line"><span class="prompt">root@pullup:~$</span><span>./brief --target "${content.targetName}" --venue "${content.venueName}"</span></div>
      <h1 class="title">${content.heroHeadline}</h1>
      <div class="line output"><span>${content.heroSubtitle}</span></div>
      <div class="line"><span class="prompt">root@pullup:~$</span><span>cat incident_report.log</span></div>
      <div class="line output"><span>${content.roastParagraph1}</span></div>
      <div class="line output"><span>${content.roastParagraph2}</span></div>
    </section>

    <section class="grid">
      <article class="panel reveal">
        <div class="box-title">root@pullup:~$ threat --scan</div>
        ${content.targetFacts.length ? factsHtml : '<div class="line output"><span>No extra facts loaded. Risk remains severe.</span></div>'}
        <div class="meter-wrap">
          <div class="meter-shell"><div class="meter-bar" id="threatBar"></div></div>
          <p class="meter-copy" id="threatResult"></p>
        </div>
      </article>
      <article class="panel reveal">
        <div class="box-title">root@pullup:~$ excuse --validate</div>
        <div class="excuse-box">
          <div class="excuse-display" id="excuseDisplay">waiting for input from ${firstName}</div>
          <input id="excuseInput" class="excuse-input" type="text" placeholder='enter "${content.excuse}" if you want it rejected'>
          <button class="excuse-btn" onclick="destroyExcuse()">execute validator</button>
          <div class="excuse-verdict" id="excuseVerdict"></div>
        </div>
      </article>
    </section>

    <section class="panel reveal">
      <div class="line"><span class="prompt">root@pullup:~$</span><span>users --list --status</span></div>
      <div class="user-grid">
        ${squadHtml}
        <div class="user-card">
          <div class="line"><span class="prompt">root@pullup:~$</span><span>users --inspect ${firstName.toLowerCase()}</span></div>
          <div class="line output">name: ${content.targetName}</div>
          <div class="line output">status: pending</div>
          <div class="line output">required_action: show_up_now</div>
        </div>
      </div>
    </section>

    <section class="grid">
      <article class="panel reveal">
        <div class="box-title">root@pullup:~$ git log --stay-home</div>
        <div class="git-card">
          ${stayHomeHtml}
        </div>
      </article>
      <article class="panel reveal">
        <div class="box-title">root@pullup:~$ git log --show-up</div>
        <div class="git-card">
          ${showUpHtml}
        </div>
      </article>
    </section>

    <section class="panel reveal">
      <div class="line"><span class="prompt">root@pullup:~$</span><span>cat roi_comparison.tbl</span></div>
      <table class="table">
        <thead>
          <tr><th>mode</th><th>output</th><th>side effect</th></tr>
        </thead>
        <tbody>
          <tr><td>stay_home</td><td>nothing happens</td><td>regret reaches critical mass</td></tr>
          <tr><td>show_up</td><td>night improves instantly</td><td>group chat morale stabilizes</td></tr>
        </tbody>
      </table>
    </section>

    <section class="panel reveal">
      <div class="line"><span class="prompt">root@pullup:~$</span><span>countdown --ascii-box</span></div>
      <pre class="count-box">+----------------------+
| hours   <span id="cdH">--</span>         |
| minutes <span id="cdM">--</span>         |
| seconds <span id="cdS">--</span>         |
+----------------------+</pre>
    </section>

    <section class="panel reveal">
      <div class="line"><span class="prompt">root@pullup:~$</span><span>./petition --sign</span></div>
      <div class="line output"><span id="sigCount">${content.petitionSignatures.length} signatures loaded</span><span class="time">active file</span></div>
      <div id="sigList">${petitionHtml}</div>
      <div class="actions">
        <button id="signBtn" onclick="signPetition()">sign petition</button>
        <a href="https://maps.google.com/?q=${encodeURIComponent(content.venueAddress + ' ' + content.venueCity)}" target="_blank" rel="noreferrer">open route</a>
        <button onclick="confirmAttendance()">confirm attendance</button>
      </div>
    </section>

    <section class="panel reveal">
      <div class="line"><span class="prompt">root@pullup:~$</span><span>echo "${content.finalCta}"</span></div>
      <div class="line output"><span>${content.finalCta}</span></div>
      <div class="line output"><span>destination: ${content.venueName} | ${content.venueAddress} | ${content.venueCity}</span></div>
    </section>
  </div>
</main>

<div class="popup" id="confirmPopup">
  <div class="popup-card">
    <div class="line"><span class="prompt">root@pullup:~$</span><span>status --confirm</span></div>
    <p>${content.targetName} marked as arriving. Pending final verification at the door of ${content.venueName}.</p>
    <p>System morale has improved. Roast queue paused until further notice.</p>
    <div class="actions"><button onclick="document.getElementById('confirmPopup').classList.remove('active')">close session</button></div>
  </div>
</div>

<script>
var excuseResponses=${excuseResponses};
var excuseIndex=0;

function enterSite(){
  document.getElementById('splash').classList.add('gone');
  document.getElementById('main').classList.add('visible');
  setTimeout(function(){document.getElementById('splash').style.display='none'},900);
  startEffects();
}

function startEffects(){
  setTimeout(function(){
    var bar=document.getElementById('threatBar');
    var result=document.getElementById('threatResult');
    if(bar){bar.style.width='95%'}
    if(result){result.textContent='warning: 95 percent probability of terminal regret if ${firstName} does not deploy to ${content.venueName}.'}
  },650);
  startCountdown();
}

function destroyExcuse(){
  var input=document.getElementById('excuseInput');
  var display=document.getElementById('excuseDisplay');
  var verdict=document.getElementById('excuseVerdict');
  var text=input.value.trim() || "${content.excuse}";
  display.textContent='parsing input: "'+text+'"';
  setTimeout(function(){
    display.textContent='validator result: rejected';
    verdict.textContent=excuseResponses[excuseIndex % excuseResponses.length];
    verdict.classList.add('show');
    display.classList.add('shake');
    setTimeout(function(){display.classList.remove('shake')},450);
    excuseIndex++;
    input.value='';
  },850);
}

function startCountdown(){
  function update(){
    var now=new Date();
    var target=new Date();
    target.setHours(target.getHours()+6);
    var diff=target-now;
    if(diff<0){diff=0}
    document.getElementById('cdH').textContent=String(Math.floor(diff/3600000)).padStart(2,'0');
    document.getElementById('cdM').textContent=String(Math.floor(diff%3600000/60000)).padStart(2,'0');
    document.getElementById('cdS').textContent=String(Math.floor(diff%60000/1000)).padStart(2,'0');
  }
  update();
  setInterval(update,1000);
}

var signatureCount=${content.petitionSignatures.length};
var extraSignatures=[
  {name:'night_kernel',time:'just_now'},
  {name:'rideshare_daemon',time:'queued'},
  {name:'door_staff_proc',time:'armed'},
  {name:'fomo_monitor',time:'watching'}
];
function signPetition(){
  signatureCount++;
  document.getElementById('sigCount').textContent=signatureCount+' signatures loaded';
  var list=document.getElementById('sigList');
  var entry=extraSignatures[Math.min(signatureCount-${content.petitionSignatures.length}-1,extraSignatures.length-1)] || {name:'backup_process',time:'just_now'};
  var row=document.createElement('div');
  row.className='line output';
  row.innerHTML='<span>'+entry.name+'</span><span class="time">'+entry.time+'</span>';
  list.prepend(row);
  if(signatureCount>=${content.petitionSignatures.length + 3}){
    document.getElementById('signBtn').textContent='launch final prompt';
  }
}

function confirmAttendance(){
  document.getElementById('confirmPopup').classList.add('active');
}

var observer=new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(node){observer.observe(node)});

console.log('terminal hint: run pull_up now for ${content.targetName}.');
</script>
</body>
</html>`;
}
