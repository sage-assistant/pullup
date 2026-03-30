import type { SiteContent } from '@/lib/site-template';

export function buildClassifiedHtml(content: SiteContent): string {
  const firstName = content.targetName.split(' ')[0] || content.targetName;
  const caseNumber = `CF-${content.targetName.replace(/\W/g, '').slice(0, 4).toUpperCase() || 'TGT'}-${Date.now().toString(36).slice(-5).toUpperCase()}`;
  const excuseResponses = JSON.stringify(content.excuseResponses);
  const factsHtml = content.targetFacts.map((fact, index) => `<div class="redaction-line"><span class="line-no">${String(index + 1).padStart(2, '0')}</span><span>${fact}</span><span class="redacted">REDACTED</span></div>`).join('');
  const operativeHtml = content.squad.map((member, index) => `<div class="operative-card"><div class="mini-head">Field Operative ${String(index + 1).padStart(2, '0')}</div><h4>${member.name}</h4><p>${member.role}</p><strong>Status: Active and on location</strong></div>`).join('');
  const exhibitStayHome = content.timelineStayHome.map((item, index) => `<div class="log-line"><span>${['23:00', '23:21', '23:57', '00:18', '01:03', '01:41'][index] || '??:??'}</span><p>${item}</p></div>`).join('');
  const exhibitShowUp = content.timelineShowUp.map((item, index) => `<div class="log-line"><span>${['22:44', '23:07', '23:39', '00:11', '00:56', '01:46'][index] || '??:??'}</span><p>${item}</p></div>`).join('');
  const consequenceHtml = content.consequences.map((item, index) => `<div class="exhibit-card"><div class="mini-head">Exhibit ${String.fromCharCode(67 + index)}</div><h4>Projected consequence ${String(index + 1).padStart(2, '0')}</h4><p>${item}</p></div>`).join('');
  const petitionHtml = content.petitionSignatures.map((signature) => `<div class="signature-row"><span>${signature.name}</span><span>${signature.time}</span></div>`).join('');

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
body{background:#e8dcc8;color:#1e1a14;font-family:'Space Mono',monospace;overflow-x:hidden}
::selection{background:#8b0000;color:#fff}
a{color:inherit}
#splash{position:fixed;inset:0;z-index:9999;background:linear-gradient(180deg,rgba(255,250,238,.98),rgba(232,220,200,.98));display:flex;align-items:center;justify-content:center;padding:22px;transition:opacity .8s}
#splash.gone{opacity:0;pointer-events:none}
.splash-sheet{position:relative;max-width:800px;width:100%;padding:34px 26px;border:2px solid rgba(30,26,20,.65);background:rgba(255,248,236,.78);box-shadow:0 18px 50px rgba(56,40,23,.18)}
.stamp{position:absolute;padding:10px 18px;border:4px solid #8b0000;color:#8b0000;font-size:14px;letter-spacing:3px;text-transform:uppercase;font-weight:700}
.stamp.top{top:22px;left:22px;transform:rotate(-8deg)}
.stamp.side{right:28px;bottom:28px;transform:rotate(9deg)}
.splash-head{font-size:12px;letter-spacing:4px;text-transform:uppercase;color:#5a4b39}
.splash-title{font-size:clamp(1.8rem,6vw,3.9rem);line-height:1.05;margin:30px 0 18px;text-transform:uppercase}
.splash-copy{max-width:620px;line-height:1.8}
.splash-btn{margin-top:24px;border:none;background:#1e1a14;color:#f6eedf;padding:14px 18px;font-family:'Space Mono',monospace;font-size:12px;letter-spacing:3px;text-transform:uppercase;cursor:pointer}
main{opacity:0;transition:opacity .9s}
main.visible{opacity:1}
.page{max-width:1100px;margin:0 auto;padding:28px 16px 72px}
.file-head{position:relative;padding:22px;border:2px solid rgba(30,26,20,.65);background:rgba(255,250,242,.62);margin-bottom:22px}
.file-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:18px}
.top-secret{position:absolute;top:18px;right:18px;transform:rotate(7deg);border:4px solid #8b0000;color:#8b0000;padding:12px 18px;font-weight:700;letter-spacing:3px;text-transform:uppercase}
.doc-title{font-size:clamp(1.8rem,5vw,3.4rem);line-height:1.02;text-transform:uppercase;margin:12px 0}
.label{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#6b5945}
.field-list{display:grid;gap:10px;margin-top:16px}
.field-row{display:grid;grid-template-columns:170px 1fr;gap:12px;padding:8px 0;border-bottom:1px dashed rgba(30,26,20,.25)}
.field-row span:last-child{font-weight:700}
.reveal{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease}
.reveal.visible{opacity:1;transform:translateY(0)}
.exhibit{position:relative;padding:20px;border:2px solid rgba(30,26,20,.55);background:rgba(255,251,244,.7);margin-top:20px}
.exhibit-header{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;border-bottom:2px solid rgba(30,26,20,.6);padding-bottom:12px;margin-bottom:16px}
.exhibit-header h2{font-size:1.5rem;text-transform:uppercase;line-height:1.05}
.exhibit-mark{font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#8b0000}
.dual-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:18px}
.type-block p,.exhibit-card p,.operative-card p,.transcript p{line-height:1.8}
.redaction-line{display:grid;grid-template-columns:42px 1fr auto;gap:12px;padding:10px 0;border-bottom:1px dashed rgba(30,26,20,.25);align-items:center}
.line-no{color:#8b0000}
.redacted{display:inline-block;padding:6px 12px;background:#111;color:#111;letter-spacing:2px;text-transform:uppercase;user-select:none}
.meter-shell{margin-top:16px;padding:14px;border:1px solid rgba(30,26,20,.28);background:rgba(255,255,255,.3)}
.meter-bar{height:20px;width:0;background:linear-gradient(90deg,#c2ad80 0%,#b85d34 45%,#8b0000 100%);transition:width 2.4s ease}
.meter-copy{margin-top:10px;line-height:1.7}
.transcript{padding:16px;background:rgba(0,0,0,.05);border:1px dashed rgba(30,26,20,.3)}
.transcript-label{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8b0000;margin-bottom:12px}
.excuse-display{min-height:60px;border:1px solid rgba(30,26,20,.3);padding:14px;display:flex;align-items:center;justify-content:center;text-align:center;background:rgba(255,255,255,.5);margin-bottom:12px}
.excuse-input{width:100%;padding:12px;border:1px solid rgba(30,26,20,.35);background:rgba(255,255,255,.8);font-family:'Space Mono',monospace;color:#1e1a14}
.excuse-btn{margin-top:12px;border:none;background:#8b0000;color:#fff;padding:12px 16px;font-family:'Space Mono',monospace;letter-spacing:2px;text-transform:uppercase;cursor:pointer;width:100%}
.excuse-verdict{margin-top:12px;line-height:1.7;color:#8b0000;opacity:0;transition:opacity .4s}
.excuse-verdict.show{opacity:1}
.operative-grid,.consequence-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
.operative-card,.exhibit-card{padding:14px;border:1px solid rgba(30,26,20,.28);background:rgba(255,255,255,.38)}
.operative-card h4,.exhibit-card h4{margin:10px 0;font-size:1.2rem;text-transform:uppercase;line-height:1.2}
.mini-head{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#8b0000}
.log-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.log-card{padding:16px;border:1px solid rgba(30,26,20,.28);background:rgba(255,255,255,.32)}
.log-card h3{font-size:1.2rem;text-transform:uppercase;margin-bottom:12px}
.log-line{display:grid;grid-template-columns:68px 1fr;gap:12px;padding:10px 0;border-bottom:1px dashed rgba(30,26,20,.22)}
.log-line span{color:#8b0000}
.countdown{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:16px}
.count-box{min-width:92px;padding:14px;border:2px solid rgba(30,26,20,.6);background:rgba(255,255,255,.62);text-align:center}
.count-num{font-size:2rem;color:#8b0000}
.count-label{font-size:10px;letter-spacing:2px;text-transform:uppercase}
.signature-row{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px dashed rgba(30,26,20,.25)}
.petition-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:16px}
.petition-actions button,.petition-actions a,.final-actions button,.final-actions a{border:none;padding:12px 16px;font-family:'Space Mono',monospace;letter-spacing:2px;text-transform:uppercase;text-decoration:none;cursor:pointer}
.sign-btn{background:#1e1a14;color:#f5edde}
.map-btn{background:rgba(255,255,255,.7);color:#1e1a14;border:1px solid rgba(30,26,20,.35)}
.confirm-btn{background:#8b0000;color:#fff}
.popup{position:fixed;inset:0;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(16,12,9,.84);z-index:10001}
.popup.active{display:flex}
.popup-card{background:#f8efdf;max-width:520px;width:100%;padding:28px;border:2px solid rgba(30,26,20,.65);text-align:center}
.popup-card h2{font-size:1.8rem;text-transform:uppercase}
.popup-card p{margin-top:12px;line-height:1.7}
.popup-card button{margin-top:18px;border:none;background:#1e1a14;color:#fff;padding:12px 16px;font-family:'Space Mono',monospace;letter-spacing:2px;text-transform:uppercase;cursor:pointer}
.shake{animation:shake .45s linear}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
@media (max-width:900px){
  .file-grid,.dual-grid,.log-grid{grid-template-columns:1fr}
  .top-secret{position:static;display:inline-block;margin-top:10px}
}
@media (max-width:620px){
  .field-row{grid-template-columns:1fr}
  .page{padding:18px 12px 64px}
}
</style>
</head>
<body>
<div id="splash" onclick="enterSite()">
  <div class="splash-sheet">
    <div class="stamp top">Top Secret</div>
    <div class="stamp side">Classified</div>
    <div class="splash-head">Restricted briefing for cleared personnel</div>
    <h1 class="splash-title">${content.splashTagline}</h1>
    <p class="splash-copy">Unauthorized absence from ${content.venueName} is now logged under case ${caseNumber}. Access this file to review evidence, surveillance, and the recommended action plan for ${content.targetName}.</p>
    <button class="splash-btn">Open case file</button>
  </div>
</div>

<main id="main">
  <div class="page">
    <header class="file-head reveal">
      <div class="top-secret">Top Secret</div>
      <div class="file-grid">
        <div>
          <div class="label">Case file summary</div>
          <h1 class="doc-title">${content.heroHeadline}</h1>
          <p style="line-height:1.8">${content.heroSubtitle}</p>
          <div class="field-list">
            <div class="field-row"><span>Case Number</span><span>${caseNumber}</span></div>
            <div class="field-row"><span>Subject</span><span>${content.targetName}</span></div>
            <div class="field-row"><span>Venue</span><span>${content.venueName}</span></div>
            <div class="field-row"><span>Window</span><span>Before ${content.closingTime}</span></div>
          </div>
        </div>
        <div>
          <div class="field-list">
            <div class="field-row"><span>Occupation</span><span>${content.targetTitle || 'Undisclosed'}</span></div>
            <div class="field-row"><span>Affiliation</span><span>${content.targetCompany || content.targetSchool || 'Unknown'}</span></div>
            <div class="field-row"><span>Context</span><span>${content.context || 'No extra notes supplied'}</span></div>
            <div class="field-row"><span>Urgency Index</span><span>${content.outrageLevel}/10</span></div>
          </div>
        </div>
      </div>
    </header>

    <section class="exhibit reveal">
      <div class="exhibit-header">
        <h2>Exhibit A | Behavioral summary</h2>
        <div class="exhibit-mark">Primary findings</div>
      </div>
      <div class="dual-grid">
        <div class="type-block">
          <p>${content.roastParagraph1}</p>
          <p style="margin-top:14px">${content.roastParagraph2}</p>
        </div>
        <div>
          ${content.targetFacts.length ? factsHtml : '<div class="redaction-line"><span class="line-no">01</span><span>No extra target facts provided</span><span class="redacted">FILED</span></div>'}
          <div class="meter-shell">
            <div class="mini-head">Threat and fomo meter</div>
            <div class="meter-bar" id="threatBar"></div>
            <p class="meter-copy" id="threatResult"></p>
          </div>
        </div>
      </div>
    </section>

    <section class="exhibit reveal">
      <div class="exhibit-header">
        <h2>Exhibit B | Interrogation transcript</h2>
        <div class="exhibit-mark">Excuse validation</div>
      </div>
      <div class="transcript">
        <div class="transcript-label">Subject statement intake</div>
        <p>The subject previously submitted the following excuse. Analysts remain unconvinced and are prepared to reject any revised testimony.</p>
        <div class="excuse-display" id="excuseDisplay">Awaiting statement from ${firstName}</div>
        <input id="excuseInput" class="excuse-input" type="text" placeholder='Enter "${content.excuse}" if you must'>
        <button class="excuse-btn" onclick="destroyExcuse()">Run interrogation review</button>
        <div class="excuse-verdict" id="excuseVerdict"></div>
      </div>
    </section>

    <section class="exhibit reveal">
      <div class="exhibit-header">
        <h2>Exhibit C | Field operatives</h2>
        <div class="exhibit-mark">Team status</div>
      </div>
      <div class="operative-grid">
        ${operativeHtml}
        <div class="operative-card">
          <div class="mini-head">Subject of interest</div>
          <h4>${content.targetName}</h4>
          <p>Current status remains unresolved. Deployment to ${content.venueName} is still the recommended action.</p>
          <strong>Status: Pending compliance</strong>
        </div>
      </div>
    </section>

    <section class="exhibit reveal">
      <div class="exhibit-header">
        <h2>Exhibit D | Surveillance log</h2>
        <div class="exhibit-mark">Forked outcomes</div>
      </div>
      <div class="log-grid">
        <div class="log-card">
          <div class="mini-head">Scenario one</div>
          <h3>Subject stays home</h3>
          ${exhibitStayHome}
        </div>
        <div class="log-card">
          <div class="mini-head">Scenario two</div>
          <h3>Subject arrives on site</h3>
          ${exhibitShowUp}
        </div>
      </div>
    </section>

    <section class="exhibit reveal">
      <div class="exhibit-header">
        <h2>Exhibit E | Consequence projections</h2>
        <div class="exhibit-mark">Analyst forecast</div>
      </div>
      <div class="consequence-grid">
        ${consequenceHtml}
      </div>
    </section>

    <section class="exhibit reveal">
      <div class="exhibit-header">
        <h2>Exhibit F | Countdown window</h2>
        <div class="exhibit-mark">Live timing</div>
      </div>
      <p style="line-height:1.8">The operation remains time sensitive. Arrival before last call is strongly advised.</p>
      <div class="countdown">
        <div class="count-box"><div class="count-num" id="cdH">--</div><div class="count-label">Hours</div></div>
        <div class="count-box"><div class="count-num" id="cdM">--</div><div class="count-label">Minutes</div></div>
        <div class="count-box"><div class="count-num" id="cdS">--</div><div class="count-label">Seconds</div></div>
      </div>
    </section>

    <section class="exhibit reveal">
      <div class="exhibit-header">
        <h2>Exhibit G | Signature intake</h2>
        <div class="exhibit-mark">Letters and approvals</div>
      </div>
      <p style="line-height:1.8">The undersigned request immediate compliance from ${content.targetName}. Non attendance is considered operationally embarrassing.</p>
      <div class="petition-actions">
        <button class="sign-btn" id="signBtn" onclick="signPetition()">Record signature</button>
        <a class="map-btn" href="https://maps.google.com/?q=${encodeURIComponent(content.venueAddress + ' ' + content.venueCity)}" target="_blank" rel="noreferrer">Open route map</a>
      </div>
      <div class="signature-row" style="margin-top:16px;font-weight:700"><span id="sigCount">${content.petitionSignatures.length} approvals logged</span><span>Current batch</span></div>
      <div id="sigList">${petitionHtml}</div>
    </section>

    <section class="exhibit reveal">
      <div class="exhibit-header">
        <h2>Final directive</h2>
        <div class="exhibit-mark">Action required</div>
      </div>
      <p style="font-size:1.35rem;line-height:1.6">${content.finalCta}</p>
      <p style="margin-top:12px;line-height:1.8">Proceed to ${content.venueName}, located at ${content.venueAddress}, ${content.venueCity}. Confirm attendance to close this file.</p>
      <div class="final-actions" style="margin-top:16px">
        <button class="confirm-btn" onclick="confirmAttendance()">Acknowledge directive</button>
      </div>
    </section>
  </div>
</main>

<div class="popup" id="confirmPopup">
  <div class="popup-card">
    <h2>Directive accepted</h2>
    <p>${content.targetName} has acknowledged the operation and is now expected at ${content.venueName}.</p>
    <p>Agents are authorized to stop roasting once the subject is physically on site.</p>
    <button onclick="document.getElementById('confirmPopup').classList.remove('active')">Close file</button>
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
    if(bar){bar.style.width='96%'}
    if(result){result.textContent='Threat assessment: 96 percent chance of severe regret if ${firstName} misses the operation.'}
  },650);
  startCountdown();
}

function destroyExcuse(){
  var input=document.getElementById('excuseInput');
  var display=document.getElementById('excuseDisplay');
  var verdict=document.getElementById('excuseVerdict');
  var transcript=document.querySelector('.transcript');
  var text=input.value.trim() || "${content.excuse}";
  display.textContent='Statement logged: "'+text+'"';
  setTimeout(function(){
    display.textContent='Analyst ruling: statement rejected';
    verdict.textContent=excuseResponses[excuseIndex % excuseResponses.length];
    verdict.classList.add('show');
    transcript.classList.add('shake');
    setTimeout(function(){transcript.classList.remove('shake')},450);
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
  {name:'Night operations desk',time:'Just now'},
  {name:'Assigned driver',time:'Ready'},
  {name:'The venue door staff',time:'Approved'},
  {name:'Common sense division',time:'Filed'}
];
function signPetition(){
  signatureCount++;
  document.getElementById('sigCount').textContent=signatureCount+' approvals logged';
  var list=document.getElementById('sigList');
  var entry=extraSignatures[Math.min(signatureCount-${content.petitionSignatures.length}-1,extraSignatures.length-1)] || {name:'Cleared observer',time:'Just now'};
  var row=document.createElement('div');
  row.className='signature-row';
  row.innerHTML='<span>'+entry.name+'</span><span>'+entry.time+'</span>';
  list.prepend(row);
  if(signatureCount>=${content.petitionSignatures.length + 3}){
    document.getElementById('signBtn').textContent='Advance subject to venue';
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

console.log('Classified note: subject ${content.targetName} is expected at ${content.venueName} before ${content.closingTime}.');
</script>
</body>
</html>`;
}
