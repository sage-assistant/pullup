import type { SiteContent } from '@/lib/site-template';

export function buildNewspaperHtml(content: SiteContent): string {
  const initials = content.targetName.replace(/\s+/g, '').toUpperCase().slice(0, 3) || 'NEWS';
  const caseCode = `${initials}-${Date.now().toString(36).toUpperCase()}`;
  const firstName = content.targetName.split(' ')[0] || content.targetName;
  const excuseResponses = JSON.stringify(content.excuseResponses);
  const factsHtml = content.targetFacts.map((fact) => `<li><span class="fact-bullet">|</span><span>${fact}</span></li>`).join('');
  const squadHtml = content.squad.map((member, index) => `<article class="witness-card"><div class="dateline">Witness ${index + 1} | ${content.venueCity.toUpperCase()} Bureau</div><h4>${member.name}</h4><p>${member.role}</p><strong>Status: Confirmed on scene</strong></article>`).join('');
  const stayHomeHtml = content.timelineStayHome.map((item, index) => `<div class="story-line"><span class="story-time">${['11:00 PM', '11:26 PM', '11:58 PM', '12:34 AM', '1:15 AM', '1:52 AM'][index] || 'Late'}</span><p>${item}</p></div>`).join('');
  const showUpHtml = content.timelineShowUp.map((item, index) => `<div class="story-line"><span class="story-time">${['10:48 PM', '11:12 PM', '11:40 PM', '12:18 AM', '1:04 AM', '2:01 AM'][index] || 'Soon'}</span><p>${item}</p></div>`).join('');
  const consequenceHtml = content.consequences.map((item, index) => `<article class="article-card"><div class="article-kicker">Edition ${index + 1}</div><h4>Consequence File ${String(index + 1).padStart(2, '0')}</h4><p>${item}</p></article>`).join('');
  const petitionHtml = content.petitionSignatures.map((signature) => `<div class="letter-row"><span>${signature.name}</span><span>${signature.time}</span></div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${content.heroHeadline}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#f4eddc;color:#111;font-family:'Playfair Display',serif;overflow-x:hidden}
::selection{background:#b30000;color:#fff}
a{color:inherit}
#splash{position:fixed;inset:0;z-index:9999;background:radial-gradient(circle at top,#fff6e9 0%,#f4eddc 45%,#dfd1b8 100%);display:flex;align-items:center;justify-content:center;padding:24px;transition:opacity .8s}
#splash.gone{opacity:0;pointer-events:none}
.splash-frame{max-width:760px;width:100%;border:6px double #111;padding:32px;text-align:center;background:rgba(255,255,255,.72);box-shadow:0 20px 60px rgba(0,0,0,.15)}
.splash-top{font-family:'Space Mono',monospace;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#b30000}
.splash-title{font-size:clamp(2.3rem,7vw,4.8rem);line-height:.95;text-transform:uppercase;margin:18px 0;font-weight:900}
.splash-sub{font-size:1.05rem;line-height:1.6;max-width:560px;margin:0 auto 22px}
.splash-badges{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:18px}
.stamp{display:inline-block;padding:8px 14px;border:3px solid #b30000;color:#b30000;font-family:'Space Mono',monospace;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;transform:rotate(-4deg)}
.stamp.alt{transform:rotate(3deg);background:#b30000;color:#fff}
.splash-btn{border:none;background:#111;color:#fff;padding:14px 26px;font-family:'Space Mono',monospace;font-size:12px;letter-spacing:3px;text-transform:uppercase;cursor:pointer}
.ticker{position:sticky;top:0;z-index:30;background:#b30000;color:#fff;border-top:1px solid #700;border-bottom:1px solid #700;overflow:hidden}
.ticker-track{display:inline-block;white-space:nowrap;padding:10px 0;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;animation:ticker 30s linear infinite}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
main{opacity:0;transition:opacity 1s}
main.visible{opacity:1}
.page{max-width:1180px;margin:0 auto;padding:24px 18px 80px}
.masthead{border-top:6px solid #111;border-bottom:6px solid #111;padding:20px 0 24px;margin-bottom:20px;text-align:center}
.edition-line{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:18px}
.paper-name{font-size:clamp(2.8rem,8vw,6rem);line-height:.86;font-weight:900;text-transform:uppercase}
.hero-grid{display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:24px}
.lead-story,.side-panel,.news-section,.countdown-block,.letters,.final-edition{background:rgba(255,255,255,.68);border:1px solid rgba(17,17,17,.18);padding:20px}
.lead-story{column-count:2;column-gap:22px}
.lead-story h1{column-span:all;font-size:clamp(2rem,5vw,4rem);line-height:.92;text-transform:uppercase;margin-bottom:12px}
.lead-story .dek{column-span:all;font-size:1.05rem;line-height:1.7;margin-bottom:18px}
.lead-story p,.article-text{font-size:1rem;line-height:1.8;text-align:justify}
.dateline{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#b30000;margin-bottom:10px}
.side-panel{display:flex;flex-direction:column;gap:18px}
.side-card{border-top:3px solid #111;padding-top:14px}
.side-card h3{font-size:1.4rem;text-transform:uppercase;line-height:1}
.side-card p{margin-top:10px;line-height:1.7}
.kpi{font-family:'Space Mono',monospace;font-size:2rem;color:#b30000}
.news-section{margin-top:24px}
.section-header{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;border-bottom:3px solid #111;padding-bottom:12px;margin-bottom:18px}
.section-header h2{font-size:2rem;text-transform:uppercase;line-height:1}
.section-tag{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#b30000}
.columns{display:grid;grid-template-columns:1.2fr .8fr;gap:20px}
.article-stack{display:grid;gap:16px}
.article-card{break-inside:avoid;border-top:2px solid #111;padding-top:12px}
.article-kicker{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#b30000;margin-bottom:6px}
.article-card h4{font-size:1.35rem;text-transform:uppercase;margin-bottom:8px}
.article-card p{line-height:1.8}
.fact-list{list-style:none;display:grid;gap:10px}
.fact-list li{display:flex;gap:10px;border-bottom:1px dotted rgba(0,0,0,.25);padding-bottom:10px;line-height:1.6}
.fact-bullet{font-family:'Space Mono',monospace;color:#b30000}
.editorial{border:3px double #111;padding:18px;background:#fffaf2}
.editorial h3{font-size:1.7rem;text-transform:uppercase;line-height:1}
.editorial p{margin-top:12px;line-height:1.8}
.excuse-lab{margin-top:16px;padding:16px;background:#111;color:#f8f2e6}
.excuse-lab label{display:block;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#f5c57d;margin-bottom:10px}
.excuse-display{min-height:52px;border:1px solid rgba(255,255,255,.18);padding:14px;display:flex;align-items:center;justify-content:center;text-align:center;margin-bottom:12px}
.excuse-input{width:100%;padding:12px;border:1px solid #d7c5ab;background:#fff;color:#111;font-family:'Space Mono',monospace}
.excuse-btn{margin-top:12px;border:none;background:#b30000;color:#fff;padding:12px 18px;width:100%;font-family:'Space Mono',monospace;letter-spacing:2px;text-transform:uppercase;cursor:pointer}
.excuse-verdict{margin-top:12px;font-family:'Space Mono',monospace;font-size:12px;line-height:1.7;color:#f5c57d;opacity:0;transition:opacity .4s}
.excuse-verdict.show{opacity:1}
.meter-shell{padding:18px;border:1px solid rgba(0,0,0,.18);background:#fffdf8}
.meter-bar{height:22px;border:1px solid #111;background:linear-gradient(90deg,#f4d7a2 0%,#f07c2a 45%,#b30000 100%);width:0;transition:width 2.4s ease;border-radius:999px}
.meter-scale{display:flex;justify-content:space-between;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:1px;text-transform:uppercase;margin-top:8px}
.witness-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
.witness-card{border-top:2px solid #111;padding-top:12px}
.witness-card h4{font-size:1.35rem;text-transform:uppercase}
.witness-card p{margin:10px 0;line-height:1.7}
.witness-card strong{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#b30000}
.timeline-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.timeline-card{padding:18px;border:1px solid rgba(0,0,0,.18);background:#fffaf1}
.timeline-card h3{font-size:1.5rem;text-transform:uppercase;margin-bottom:14px}
.story-line{display:grid;grid-template-columns:88px 1fr;gap:12px;padding:10px 0;border-bottom:1px dotted rgba(0,0,0,.22)}
.story-time{font-family:'Space Mono',monospace;font-size:11px;color:#b30000}
.countdown-block{text-align:center;margin-top:24px}
.countdown-grid{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:16px}
.count-unit{min-width:90px;border:2px solid #111;padding:14px 10px;background:#fff}
.count-num{font-family:'Space Mono',monospace;font-size:2rem;color:#b30000}
.count-label{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase}
.letters p{line-height:1.8;max-width:700px}
.letter-row{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px dotted rgba(0,0,0,.22);font-family:'Space Mono',monospace;font-size:12px}
.letters button,.final-edition button,.final-edition a{display:inline-block;margin-top:16px;border:none;padding:13px 18px;font-family:'Space Mono',monospace;letter-spacing:2px;text-transform:uppercase;text-decoration:none;cursor:pointer}
.sign-btn{background:#111;color:#fff}
.confirm-btn{background:#b30000;color:#fff}
.directions-btn{background:#fff;border:1px solid #111;color:#111}
.final-edition{text-align:center}
.final-edition h2{font-size:clamp(2rem,5vw,4rem);text-transform:uppercase;line-height:.95}
.final-edition .final-note{max-width:680px;margin:16px auto 0;line-height:1.8}
.popup{position:fixed;inset:0;background:rgba(17,17,17,.9);z-index:10001;display:none;align-items:center;justify-content:center;padding:24px}
.popup.active{display:flex}
.popup-card{background:#fff9ef;padding:28px;max-width:520px;width:100%;border:5px double #111;text-align:center}
.popup-card h2{font-size:2rem;text-transform:uppercase}
.popup-card p{margin-top:12px;line-height:1.7}
.popup-card button{margin-top:18px;border:none;background:#111;color:#fff;padding:12px 18px;font-family:'Space Mono',monospace;letter-spacing:2px;text-transform:uppercase;cursor:pointer}
.reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}
.reveal.visible{opacity:1;transform:translateY(0)}
.shake{animation:shake .45s linear}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
@media (max-width:900px){
  .hero-grid,.columns,.timeline-grid{grid-template-columns:1fr}
  .lead-story{column-count:1}
}
@media (max-width:640px){
  .page{padding:16px 12px 64px}
  .edition-line{justify-content:center}
  .countdown-grid{gap:8px}
  .count-unit{min-width:78px}
}
</style>
</head>
<body>
<div id="splash" onclick="enterSite()">
  <div class="splash-frame">
    <div class="splash-top">Late Edition Special Bulletin</div>
    <div class="splash-badges">
      <span class="stamp">Breaking</span>
      <span class="stamp alt">Urgent</span>
    </div>
    <h1 class="splash-title">${content.splashTagline}</h1>
    <p class="splash-sub">Special file ${caseCode} covering the unresolved whereabouts of ${content.targetName} before final call at ${content.venueName}.</p>
    <button class="splash-btn">Read the front page</button>
  </div>
</div>

<div class="ticker"><div class="ticker-track" id="ticker"></div></div>

<main id="main">
  <div class="page">
    <header class="masthead reveal">
      <div class="edition-line">
        <span>${content.venueCity} Evening Edition</span>
        <span>${content.closingTime} Final Call Alert</span>
        <span>Case ${caseCode}</span>
      </div>
      <div class="paper-name">The Pull Up Post</div>
    </header>

    <section class="hero-grid">
      <article class="lead-story reveal">
        <div class="dateline">${content.venueCity.toUpperCase()} | Staff Report</div>
        <h1>${content.heroHeadline}</h1>
        <p class="dek">${content.heroSubtitle}</p>
        <p>${content.roastParagraph1}</p>
        <p>${content.roastParagraph2}</p>
      </article>
      <aside class="side-panel reveal">
        <div class="side-card">
          <div class="dateline">News Desk Metrics</div>
          <div class="kpi">${content.outrageLevel}/10</div>
          <p>Editorial outrage index remains elevated after reports that ${firstName} may still attempt to stay home.</p>
        </div>
        <div class="side-card">
          <div class="dateline">Closing Bulletin</div>
          <h3>${content.venueName}</h3>
          <p>${content.venueAddress}<br>${content.venueCity}</p>
          <p>Last call posted for ${content.closingTime}.</p>
        </div>
      </aside>
    </section>

    <section class="news-section reveal">
      <div class="section-header">
        <h2>Front Page Analysis</h2>
        <div class="section-tag">Dateline and Background</div>
      </div>
      <div class="columns">
        <div class="article-stack">
          ${consequenceHtml}
        </div>
        <div>
          ${content.targetFacts.length ? `<ul class="fact-list">${factsHtml}</ul>` : ''}
          <div class="meter-shell" style="margin-top:16px">
            <div class="dateline">Fomo Meter</div>
            <div class="meter-bar" id="threatBar"></div>
            <div class="meter-scale"><span>Curious</span><span>Uneasy</span><span>Catastrophic</span></div>
            <p class="article-text" id="threatResult" style="margin-top:12px"></p>
          </div>
        </div>
      </div>
    </section>

    <section class="news-section reveal">
      <div class="section-header">
        <h2>Editorial Board Opinion</h2>
        <div class="section-tag">Excuse Review</div>
      </div>
      <div class="editorial">
        <h3>The Excuse Destroyer</h3>
        <p>The board has reviewed the statement attributed to ${firstName}. It is unserious, poorly sourced, and likely to age badly by tomorrow morning.</p>
        <div class="excuse-lab">
          <label for="excuseInput">Submit a rebuttal for immediate public rejection</label>
          <div class="excuse-display" id="excuseDisplay">Awaiting statement from ${firstName}</div>
          <input id="excuseInput" class="excuse-input" type="text" placeholder='Type "${content.excuse}" if you insist'>
          <button class="excuse-btn" onclick="destroyExcuse()">Run the editorial review</button>
          <div class="excuse-verdict" id="excuseVerdict"></div>
        </div>
      </div>
    </section>

    <section class="news-section reveal">
      <div class="section-header">
        <h2>Witnesses</h2>
        <div class="section-tag">Accounts from the scene</div>
      </div>
      <div class="witness-grid">
        ${squadHtml}
        <article class="witness-card">
          <div class="dateline">Missing person update</div>
          <h4>${content.targetName}</h4>
          <p>Reported absent despite overwhelming evidence that the correct move is obvious.</p>
          <strong>Status: Still expected at the venue</strong>
        </article>
      </div>
    </section>

    <section class="news-section reveal">
      <div class="section-header">
        <h2>Developing Story</h2>
        <div class="section-tag">Two possible editions</div>
      </div>
      <div class="timeline-grid">
        <article class="timeline-card">
          <div class="dateline">If ${firstName} stays home</div>
          <h3>Night desk projection</h3>
          ${stayHomeHtml}
        </article>
        <article class="timeline-card">
          <div class="dateline">If ${firstName} shows up</div>
          <h3>Live updates from the fun side</h3>
          ${showUpHtml}
        </article>
      </div>
    </section>

    <section class="countdown-block reveal">
      <div class="section-header" style="justify-content:center;border-bottom:none;padding-bottom:0;margin-bottom:0">
        <h2>Deadline Clock</h2>
      </div>
      <div class="countdown-grid">
        <div class="count-unit"><div class="count-num" id="cdH">--</div><div class="count-label">Hours</div></div>
        <div class="count-unit"><div class="count-num" id="cdM">--</div><div class="count-label">Minutes</div></div>
        <div class="count-unit"><div class="count-num" id="cdS">--</div><div class="count-label">Seconds</div></div>
      </div>
    </section>

    <section class="letters reveal">
      <div class="section-header">
        <h2>Letters to the Editor</h2>
        <div class="section-tag">Public support for attendance</div>
      </div>
      <p>Readers from every desk, barstool, and group chat have submitted the following signatures in support of immediate arrival at ${content.venueName}.</p>
      <button class="sign-btn" id="signBtn" onclick="signPetition()">Add your signature</button>
      <div class="letter-row" style="margin-top:16px;font-weight:700"><span id="sigCount">${content.petitionSignatures.length} signatures logged</span><span>Current edition</span></div>
      <div id="sigList">${petitionHtml}</div>
    </section>

    <section class="final-edition reveal">
      <div class="dateline">Final Edition</div>
      <h2>${content.finalCta}</h2>
      <p class="final-note">The editors, witnesses, and late night desk agree. This story ends best when you walk through the door at ${content.venueName} tonight.</p>
      <a class="directions-btn" href="https://maps.google.com/?q=${encodeURIComponent(content.venueAddress + ' ' + content.venueCity)}" target="_blank" rel="noreferrer">Get directions</a>
      <button class="confirm-btn" onclick="confirmAttendance()">Print the retraction</button>
    </section>
  </div>
</main>

<div class="popup" id="confirmPopup">
  <div class="popup-card">
    <h2>Late night correction</h2>
    <p>${content.targetName} has confirmed attendance and avoided becoming tomorrow's cautionary tale.</p>
    <p>The newsroom will now redirect its full attention to getting everyone to ${content.venueName} on time.</p>
    <button onclick="document.getElementById('confirmPopup').classList.remove('active')">Close bulletin</button>
  </div>
</div>

<script>
var excuseResponses=${excuseResponses};
var excuseIndex=0;
var tickerMessages=[
  "breaking: ${content.targetName.toUpperCase()} still unconfirmed for tonight",
  "urgent: ${content.venueName.toUpperCase()} holds last call at ${content.closingTime.toUpperCase()}",
  "city desk: ${content.squad.map((member) => member.name.toUpperCase()).join(' | ')} already committed",
  "editorial board: staying home remains an indefensible position"
];
document.getElementById('ticker').textContent=(tickerMessages.join('   //   ')+'   //   ').repeat(5);

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
    if(bar){bar.style.width='92%'}
    if(result){result.textContent='Front page alert: regret risk projected at 92 percent if ${firstName} misses this story.'}
  },700);
  startCountdown();
}

function destroyExcuse(){
  var input=document.getElementById('excuseInput');
  var display=document.getElementById('excuseDisplay');
  var verdict=document.getElementById('excuseVerdict');
  var text=input.value.trim() || "${content.excuse}";
  display.textContent='"' + text + '"';
  var box=document.querySelector('.excuse-lab');
  setTimeout(function(){
    display.textContent='Editorial ruling: rejected';
    verdict.textContent=excuseResponses[excuseIndex % excuseResponses.length];
    verdict.classList.add('show');
    box.classList.add('shake');
    setTimeout(function(){box.classList.remove('shake')},450);
    excuseIndex++;
    input.value='';
  },900);
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
  {name:"The copy desk",time:"Just now"},
  {name:"The cab waiting outside",time:"Queued"},
  {name:"The whole night shift",time:"Approved"},
  {name:"A reader with common sense",time:"Moments ago"}
];
function signPetition(){
  signatureCount++;
  document.getElementById('sigCount').textContent=signatureCount+' signatures logged';
  var list=document.getElementById('sigList');
  var entry=extraSignatures[Math.min(signatureCount-${content.petitionSignatures.length}-1,extraSignatures.length-1)] || {name:'Late subscriber',time:'Just now'};
  var row=document.createElement('div');
  row.className='letter-row';
  row.innerHTML='<span>'+entry.name+'</span><span>'+entry.time+'</span>';
  list.prepend(row);
  if(signatureCount>=${content.petitionSignatures.length + 3}){
    var btn=document.getElementById('signBtn');
    btn.textContent='Send ${firstName} to the venue';
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
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(function(node){observer.observe(node)});

console.log('Newsroom note: ${content.targetName} is expected at ${content.venueName} before ${content.closingTime}.');
</script>
</body>
</html>`;
}
