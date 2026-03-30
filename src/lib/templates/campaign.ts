import type { SiteContent } from '@/lib/site-template';

export function buildCampaignHtml(content: SiteContent): string {
  const firstName = content.targetName.split(' ')[0] || content.targetName;
  const campaignId = `PULL-${Date.now().toString(36).slice(-6).toUpperCase()}`;
  const excuseResponses = JSON.stringify(content.excuseResponses);
  const factsHtml = content.targetFacts.map((fact, index) => `<div class="brief-row"><span>Audience signal ${String(index + 1).padStart(2, '0')}</span><span>${fact}</span></div>`).join('');
  const creatorHtml = content.squad.map((member, index) => `<article class="creator-card"><div class="creator-status live">Live</div><h4>${member.name}</h4><p>${member.role}</p><span class="creator-meta">Lineup slot ${index + 1}</span></article>`).join('');
  const stayHomeHtml = content.timelineStayHome.map((item, index) => `<div class="timeline-row"><span class="dot dot-warn"></span><strong>${['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5', 'Phase 6'][index] || 'Phase'}</strong><p>${item}</p></div>`).join('');
  const showUpHtml = content.timelineShowUp.map((item, index) => `<div class="timeline-row"><span class="dot dot-good"></span><strong>${['Launch', 'Engage', 'Convert', 'Scale', 'Win', 'Retain'][index] || 'Step'}</strong><p>${item}</p></div>`).join('');
  const petitionHtml = content.petitionSignatures.map((signature) => `<div class="signature-row"><span>${signature.name}</span><span>${signature.time}</span></div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${content.heroHeadline}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0f;color:#f5f7ff;font-family:'Inter',sans-serif;overflow-x:hidden;background-image:radial-gradient(circle at top left,rgba(255,45,120,.2),transparent 32%),radial-gradient(circle at top right,rgba(59,130,246,.18),transparent 26%),linear-gradient(180deg,#0a0a0f 0%,#090912 100%)}
::selection{background:#ff2d78;color:#fff}
a{color:inherit}
#splash{position:fixed;inset:0;z-index:9999;background:rgba(8,8,14,.96);display:flex;align-items:center;justify-content:center;padding:24px;transition:opacity .8s}
#splash.gone{opacity:0;pointer-events:none}
.splash-card{max-width:820px;width:100%;padding:34px;border:1px solid rgba(255,255,255,.08);background:linear-gradient(135deg,rgba(255,255,255,.05),rgba(255,255,255,.02));box-shadow:0 24px 90px rgba(0,0,0,.35)}
.brand-chip{display:inline-flex;align-items:center;gap:10px;padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.06);font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase}
.brand-dot{width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,#ff2d78,#8b5cf6,#3b82f6)}
.splash-title{font-size:clamp(2.4rem,7vw,5rem);line-height:.94;margin:22px 0 14px;font-weight:900}
.splash-copy{max-width:640px;line-height:1.8;color:#c4c8e5}
.splash-btn{margin-top:24px;border:none;background:linear-gradient(135deg,#ff2d78,#8b5cf6,#3b82f6);color:#fff;padding:14px 20px;border-radius:999px;font-family:'Space Mono',monospace;letter-spacing:2px;text-transform:uppercase;cursor:pointer}
main{opacity:0;transition:opacity .9s}
main.visible{opacity:1}
.page{max-width:1180px;margin:0 auto;padding:20px 16px 80px}
.nav{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:16px 0 28px}
.nav-brand{font-size:1.2rem;font-weight:800}
.nav-brand span{background:linear-gradient(135deg,#ff2d78,#8b5cf6,#3b82f6);-webkit-background-clip:text;background-clip:text;color:transparent}
.nav-meta{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#95a0d1}
.hero{display:grid;grid-template-columns:1.4fr .9fr;gap:18px;align-items:stretch}
.panel{border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);backdrop-filter:blur(8px);border-radius:24px;padding:24px}
.hero h1{font-size:clamp(2.4rem,6vw,5rem);line-height:.94;font-weight:900}
.hero p{margin-top:16px;line-height:1.8;color:#c4c8e5}
.glow-line{height:1px;background:linear-gradient(90deg,rgba(255,45,120,0),rgba(255,45,120,.8),rgba(59,130,246,0));margin:18px 0}
.brief-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px}
.metric-card{padding:18px;border-radius:18px;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.08)}
.metric-value{font-size:2rem;font-weight:800}
.metric-label{margin-top:6px;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#95a0d1}
.metric-copy{margin-top:8px;color:#c4c8e5;line-height:1.7}
.section{margin-top:20px}
.section-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-end;margin-bottom:14px}
.section-head h2{font-size:1.5rem}
.section-kicker{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#95a0d1}
.brief-card{display:grid;gap:10px}
.brief-row{display:grid;grid-template-columns:170px 1fr;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.08);font-size:.96rem}
.brief-row span:first-child{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#95a0d1}
.score-shell{margin-top:14px}
.score-bar{height:16px;border-radius:999px;background:linear-gradient(90deg,#ff2d78 0%,#8b5cf6 50%,#3b82f6 100%);width:0;transition:width 2.4s ease}
.score-copy{margin-top:10px;color:#c4c8e5;line-height:1.7}
.analyzer{display:grid;gap:12px}
.excuse-display{min-height:56px;border-radius:16px;border:1px solid rgba(255,255,255,.08);padding:16px;background:rgba(0,0,0,.22);display:flex;align-items:center;justify-content:center;text-align:center}
.excuse-input{width:100%;padding:13px 14px;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.05);color:#fff;font-family:'Inter',sans-serif}
.excuse-btn{border:none;background:linear-gradient(135deg,#ff2d78,#8b5cf6);color:#fff;padding:13px 16px;border-radius:16px;font-family:'Space Mono',monospace;letter-spacing:2px;text-transform:uppercase;cursor:pointer}
.excuse-verdict{font-family:'Space Mono',monospace;font-size:12px;line-height:1.7;color:#a5b4fc;opacity:0;transition:opacity .4s}
.excuse-verdict.show{opacity:1}
.table{width:100%;border-collapse:collapse}
.table th,.table td{padding:12px 10px;border-bottom:1px solid rgba(255,255,255,.08);text-align:left}
.table th{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#95a0d1}
.creator-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
.creator-card{padding:18px;border-radius:20px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}
.creator-status{display:inline-block;padding:6px 10px;border-radius:999px;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase}
.creator-status.live{background:rgba(59,130,246,.18);color:#93c5fd}
.creator-card h4{font-size:1.2rem;margin:12px 0 6px}
.creator-card p{color:#c4c8e5;line-height:1.7}
.creator-meta{display:block;margin-top:12px;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#95a0d1}
.timeline-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.timeline-card{padding:18px;border-radius:20px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}
.timeline-row{display:grid;grid-template-columns:14px 88px 1fr;gap:10px;align-items:start;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.07)}
.timeline-row strong{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#dbe2ff}
.timeline-row p{color:#c4c8e5;line-height:1.7}
.dot{width:10px;height:10px;border-radius:50%;margin-top:5px}
.dot-good{background:#3b82f6;box-shadow:0 0 14px rgba(59,130,246,.8)}
.dot-warn{background:#ff2d78;box-shadow:0 0 14px rgba(255,45,120,.8)}
.countdown{display:flex;gap:12px;flex-wrap:wrap;margin-top:16px}
.count-box{min-width:92px;padding:16px;border-radius:18px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);text-align:center}
.count-num{font-size:2rem;font-weight:800}
.count-label{margin-top:6px;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#95a0d1}
.signature-row{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.08);font-size:.95rem}
.action-row{display:flex;gap:12px;flex-wrap:wrap;margin-top:16px}
.action-row button,.action-row a{border:none;padding:13px 18px;border-radius:999px;font-family:'Space Mono',monospace;letter-spacing:2px;text-transform:uppercase;text-decoration:none;cursor:pointer}
.sign-btn{background:rgba(255,255,255,.07);color:#fff}
.route-btn{background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff}
.confirm-btn{background:linear-gradient(135deg,#ff2d78,#8b5cf6,#3b82f6);color:#fff}
.popup{position:fixed;inset:0;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(5,5,10,.86);z-index:10001}
.popup.active{display:flex}
.popup-card{max-width:520px;width:100%;padding:28px;border-radius:24px;background:#111322;border:1px solid rgba(255,255,255,.08);text-align:center}
.popup-card h2{font-size:1.9rem}
.popup-card p{margin-top:12px;line-height:1.8;color:#c4c8e5}
.popup-card button{margin-top:18px;border:none;background:linear-gradient(135deg,#ff2d78,#8b5cf6);color:#fff;padding:12px 16px;border-radius:999px;font-family:'Space Mono',monospace;letter-spacing:2px;text-transform:uppercase;cursor:pointer}
.reveal{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease}
.reveal.visible{opacity:1;transform:translateY(0)}
.shake{animation:shake .45s linear}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
@media (max-width:920px){
  .hero,.timeline-grid{grid-template-columns:1fr}
}
@media (max-width:640px){
  .page{padding:16px 12px 64px}
  .brief-row{grid-template-columns:1fr}
}
</style>
</head>
<body>
<div id="splash" onclick="enterSite()">
  <div class="splash-card">
    <div class="brand-chip"><span class="brand-dot"></span><span>#paid strategy room</span></div>
    <h1 class="splash-title">${content.splashTagline}</h1>
    <p class="splash-copy">Campaign ${campaignId} is now live. The objective is simple: convert ${content.targetName} from passive observer into an on site attendee at ${content.venueName} before the window closes.</p>
    <button class="splash-btn">Open the dashboard</button>
  </div>
</div>

<main id="main">
  <div class="page">
    <nav class="nav reveal">
      <div class="nav-brand"><span>#paid</span> night ops</div>
      <div class="nav-meta">Campaign ${campaignId} | Live brief</div>
    </nav>

    <section class="hero">
      <div class="panel reveal">
        <div class="section-kicker">Performance brief</div>
        <h1>${content.heroHeadline}</h1>
        <p>${content.heroSubtitle}</p>
        <div class="glow-line"></div>
        <div class="brief-card">
          <div class="brief-row"><span>Client</span><span>The friend group</span></div>
          <div class="brief-row"><span>Objective</span><span>Get ${firstName} to ${content.venueName} tonight</span></div>
          <div class="brief-row"><span>Target audience</span><span>${content.targetName}, currently overthinking it</span></div>
          <div class="brief-row"><span>Offer</span><span>Good stories, no regrets, and a night worth talking about</span></div>
          <div class="brief-row"><span>Market context</span><span>${content.context || 'Momentum is already building without them'}</span></div>
        </div>
      </div>
      <aside class="panel reveal">
        <div class="section-kicker">Kpi snapshot</div>
        <div class="brief-grid">
          <div class="metric-card">
            <div class="metric-value metric-num" data-target="${content.squad.length}">0</div>
            <div class="metric-label">Confirmed creators</div>
            <div class="metric-copy">Everyone else already accepted the brief.</div>
          </div>
          <div class="metric-card">
            <div class="metric-value metric-num" data-target="${content.outrageLevel * 10}">0</div>
            <div class="metric-label">Urgency score</div>
            <div class="metric-copy">Escalation rises with every delayed reply.</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${content.closingTime}</div>
            <div class="metric-label">Conversion deadline</div>
            <div class="metric-copy">${content.venueName}, ${content.venueCity}</div>
          </div>
        </div>
      </aside>
    </section>

    <section class="section panel reveal">
      <div class="section-head">
        <h2>Audience intelligence</h2>
        <div class="section-kicker">Behavioral signals</div>
      </div>
      <p style="line-height:1.8;color:#c4c8e5">${content.roastParagraph1}</p>
      <p style="margin-top:12px;line-height:1.8;color:#c4c8e5">${content.roastParagraph2}</p>
      <div class="brief-card" style="margin-top:16px">
        ${content.targetFacts.length ? factsHtml : '<div class="brief-row"><span>Audience signal</span><span>No extra facts were uploaded, yet the need to show up remains obvious.</span></div>'}
      </div>
      <div class="score-shell">
        <div class="section-kicker">Threat and fomo meter</div>
        <div class="score-bar" id="threatBar"></div>
        <p class="score-copy" id="threatResult"></p>
      </div>
    </section>

    <section class="section panel reveal">
      <div class="section-head">
        <h2>Sentiment analyzer</h2>
        <div class="section-kicker">Excuse quality scoring</div>
      </div>
      <div class="analyzer">
        <div class="excuse-display" id="excuseDisplay">Analyzer awaiting input from ${firstName}</div>
        <input id="excuseInput" class="excuse-input" type="text" placeholder='Try "${content.excuse}" if you want a low score'>
        <button class="excuse-btn" onclick="destroyExcuse()">Analyze sentiment</button>
        <div class="excuse-verdict" id="excuseVerdict"></div>
      </div>
    </section>

    <section class="section panel reveal">
      <div class="section-head">
        <h2>ROI comparison</h2>
        <div class="section-kicker">Stay home versus show up</div>
      </div>
      <table class="table">
        <thead>
          <tr><th>Path</th><th>Short term result</th><th>Long term brand impact</th></tr>
        </thead>
        <tbody>
          <tr><td>Stay home</td><td>Temporary comfort, zero story value</td><td>Negative sentiment from the group chat</td></tr>
          <tr><td>Show up</td><td>Immediate lift in fun and social proof</td><td>Strong retention, callbacks, and inside jokes</td></tr>
        </tbody>
      </table>
    </section>

    <section class="section panel reveal">
      <div class="section-head">
        <h2>Creator lineup</h2>
        <div class="section-kicker">Talent ready for launch</div>
      </div>
      <div class="creator-grid">
        ${creatorHtml}
        <article class="creator-card">
          <div class="creator-status" style="background:rgba(255,45,120,.18);color:#fda4cf">Pending</div>
          <h4>${content.targetName}</h4>
          <p>The only creator not yet posting from the venue.</p>
          <span class="creator-meta">Needs immediate activation</span>
        </article>
      </div>
    </section>

    <section class="section timeline-grid">
      <article class="timeline-card reveal">
        <div class="section-head">
          <h2>Campaign risk path</h2>
          <div class="section-kicker">If ${firstName} stays home</div>
        </div>
        ${stayHomeHtml}
      </article>
      <article class="timeline-card reveal">
        <div class="section-head">
          <h2>Campaign timeline</h2>
          <div class="section-kicker">If ${firstName} shows up</div>
        </div>
        ${showUpHtml}
      </article>
    </section>

    <section class="section panel reveal">
      <div class="section-head">
        <h2>Conversion clock</h2>
        <div class="section-kicker">Window closes at ${content.closingTime}</div>
      </div>
      <div class="countdown">
        <div class="count-box"><div class="count-num" id="cdH">--</div><div class="count-label">Hours</div></div>
        <div class="count-box"><div class="count-num" id="cdM">--</div><div class="count-label">Minutes</div></div>
        <div class="count-box"><div class="count-num" id="cdS">--</div><div class="count-label">Seconds</div></div>
      </div>
    </section>

    <section class="section panel reveal">
      <div class="section-head">
        <h2>Community demand</h2>
        <div class="section-kicker">Click to sign</div>
      </div>
      <p style="line-height:1.8;color:#c4c8e5">Stakeholders continue to signal that the optimal move is attendance at ${content.venueName} tonight.</p>
      <div class="action-row">
        <button class="sign-btn" id="signBtn" onclick="signPetition()">Add support</button>
        <a class="route-btn" href="https://maps.google.com/?q=${encodeURIComponent(content.venueAddress + ' ' + content.venueCity)}" target="_blank" rel="noreferrer">Open route</a>
        <button class="confirm-btn" onclick="confirmAttendance()">Confirm attendance</button>
      </div>
      <div class="signature-row" style="margin-top:16px;font-weight:700"><span id="sigCount">${content.petitionSignatures.length} supporters</span><span>Live feed</span></div>
      <div id="sigList">${petitionHtml}</div>
    </section>

    <section class="section panel reveal">
      <div class="section-head">
        <h2>Final pitch</h2>
        <div class="section-kicker">Conversion copy</div>
      </div>
      <p style="font-size:1.3rem;line-height:1.7">${content.finalCta}</p>
    </section>
  </div>
</main>

<div class="popup" id="confirmPopup">
  <div class="popup-card">
    <h2>Conversion secured</h2>
    <p>${content.targetName} has moved from low intent to confirmed arrival at ${content.venueName}.</p>
    <p>The campaign can now redirect spend from guilt to celebration.</p>
    <button onclick="document.getElementById('confirmPopup').classList.remove('active')">Close report</button>
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
    if(bar){bar.style.width='93%'}
    if(result){result.textContent='Predicted fallout: 93 percent regret probability if '+${JSON.stringify(firstName)}+' fails to convert tonight.'}
  },650);
  startCountdown();
  animateMetrics();
}

function animateMetrics(){
  document.querySelectorAll('.metric-num').forEach(function(node){
    var target=parseInt(node.getAttribute('data-target') || '0',10);
    var current=0;
    var step=Math.max(1,Math.ceil(target/22));
    var timer=setInterval(function(){
      current=Math.min(target,current+step);
      node.textContent=String(current);
      if(current>=target){clearInterval(timer)}
    },50);
  });
}

function destroyExcuse(){
  var input=document.getElementById('excuseInput');
  var display=document.getElementById('excuseDisplay');
  var verdict=document.getElementById('excuseVerdict');
  var text=input.value.trim() || "${content.excuse}";
  display.textContent='Input received: "'+text+'"';
  setTimeout(function(){
    display.textContent='Analyzer verdict: low credibility';
    verdict.textContent=excuseResponses[excuseIndex % excuseResponses.length] + ' Validity score: ' + (12 - Math.min(excuseIndex, 8)) + '/100.';
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
  {name:'Performance marketing',time:'Just now'},
  {name:'Lifecycle team',time:'Queued'},
  {name:'The ride share funnel',time:'Ready'},
  {name:'Revenue operations',time:'Aligned'}
];
function signPetition(){
  signatureCount++;
  document.getElementById('sigCount').textContent=signatureCount+' supporters';
  var list=document.getElementById('sigList');
  var entry=extraSignatures[Math.min(signatureCount-${content.petitionSignatures.length}-1,extraSignatures.length-1)] || {name:'Growth lead',time:'Just now'};
  var row=document.createElement('div');
  row.className='signature-row';
  row.innerHTML='<span>'+entry.name+'</span><span>'+entry.time+'</span>';
  list.prepend(row);
  if(signatureCount>=${content.petitionSignatures.length + 3}){
    document.getElementById('signBtn').textContent='Boost this campaign';
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

console.log('Campaign note: ${content.targetName} is the final conversion target for ${content.venueName}.');
</script>
</body>
</html>`;
}
