export type SiteContent = {
  targetName: string;
  targetTitle: string;
  targetCompany: string;
  targetSchool: string;
  targetFacts: string[];
  venueName: string;
  venueAddress: string;
  venueCity: string;
  closingTime: string;
  squad: { name: string; role: string }[];
  excuse: string;
  context: string;
  outrageLevel: number;
  // AI-generated personalized content
  splashTagline: string;
  heroHeadline: string;
  heroSubtitle: string;
  roastParagraph1: string;
  roastParagraph2: string;
  excuseResponses: string[];
  timelineStayHome: string[];
  timelineShowUp: string[];
  consequences: string[];
  petitionSignatures: { name: string; time: string }[];
  finalCta: string;
};

export function buildSiteHtml(c: SiteContent): string {
  const squadHtml = c.squad.map(s =>
    `<div class="squad-row"><span class="squad-name">${s.name.toUpperCase()}</span><span class="squad-status confirmed">CONFIRMED</span></div>`
  ).join('');

  const targetRow = `<div class="squad-row target-row"><span class="squad-name">${c.targetName.toUpperCase()}</span><span class="squad-status pending">PENDING</span></div>`;

  const excuseResponsesJs = JSON.stringify(c.excuseResponses);

  const timelineAHtml = c.timelineStayHome.map((t, i) =>
    `<div class="tl-item"><span class="tl-time">${['11:00 PM', '11:30 PM', '12:00 AM', '1:00 AM', '1:30 AM', '2:00 AM'][i] || ''}</span><span class="tl-text">${t}</span></div>`
  ).join('');

  const timelineBHtml = c.timelineShowUp.map((t, i) =>
    `<div class="tl-item"><span class="tl-time">${['11:00 PM', '11:30 PM', '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM'][i] || ''}</span><span class="tl-text">${t}</span></div>`
  ).join('');

  const consequencesHtml = c.consequences.map((con, i) =>
    `<div class="consequence"><span class="con-num">0${i + 1}</span><p>${con}</p></div>`
  ).join('');

  const petitionHtml = c.petitionSignatures.map(s =>
    `<div class="sig-row"><span>${s.name}</span><span class="sig-time">${s.time}</span></div>`
  ).join('');

  const factsHtml = c.targetFacts.map(f => `<li>${f}</li>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${c.heroHeadline}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0a;color:#f0f0f0;font-family:'Inter',sans-serif;overflow-x:hidden}
::selection{background:#39FF14;color:#000}

#splash{position:fixed;inset:0;z-index:9999;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:opacity .8s}
#splash.gone{opacity:0;pointer-events:none}
.splash-badge{background:#e63946;color:#fff;padding:8px 24px;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin-bottom:24px;animation:flash 1s infinite}
@keyframes flash{0%,100%{opacity:1}50%{opacity:.3}}
.splash-title{font-size:clamp(22px,5vw,42px);text-align:center;line-height:1.3;max-width:600px;padding:0 20px;font-weight:300}
.splash-title strong{font-weight:900;color:#e63946}
.splash-sub{font-family:'Space Mono',monospace;font-size:12px;color:#444;margin-top:20px;letter-spacing:2px}
.splash-btn{margin-top:32px;border:2px solid #e63946;background:transparent;color:#e63946;padding:14px 40px;font-family:'Space Mono',monospace;font-size:13px;letter-spacing:3px;cursor:pointer;text-transform:uppercase;transition:all .3s}
.splash-btn:hover{background:#e63946;color:#000}

.ticker{overflow:hidden;background:#e63946;padding:8px 0;white-space:nowrap}
.ticker-inner{display:inline-block;animation:scroll 25s linear infinite;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#fff}
@keyframes scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

main{opacity:0;transition:opacity 1s}main.visible{opacity:1}

section{max-width:900px;margin:0 auto;padding:80px 20px}
.section-label{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:4px;color:#e63946;text-transform:uppercase;margin-bottom:16px}
.section-title{font-size:clamp(28px,5vw,48px);font-weight:900;line-height:1.15;margin-bottom:24px}
.section-text{font-size:16px;line-height:1.8;color:#aaa;margin-bottom:16px}
.highlight{color:#f4a261;font-weight:700}
.red{color:#e63946;font-weight:700}

.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin:32px 0}
.stat-card{background:#111;border:1px solid #222;padding:24px;border-radius:8px;transition:all .3s}
.stat-card:hover{border-color:#e63946;transform:translateY(-3px)}
.stat-card .num{font-family:'Space Mono',monospace;font-size:32px;color:#e63946;margin-bottom:6px}
.stat-card .label{font-size:11px;letter-spacing:2px;color:#555;text-transform:uppercase;margin-bottom:4px}
.stat-card .val{font-size:13px;color:#ccc;line-height:1.5}

.excuse-machine{background:#0d0d0d;border:1px solid #e63946;border-radius:12px;padding:36px;margin:40px 0;text-align:center}
.excuse-machine h3{font-size:24px;font-weight:900;margin-bottom:6px}
.excuse-machine>p{color:#555;margin-bottom:20px;font-size:13px}
.excuse-display{background:#000;border:1px solid #333;padding:20px;border-radius:8px;font-family:'Space Mono',monospace;font-size:15px;color:#f4a261;min-height:56px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;transition:all .3s}
.excuse-input{width:100%;max-width:380px;padding:11px 18px;background:#111;border:1px solid #333;border-radius:6px;color:#fff;font-family:'Inter',sans-serif;font-size:14px;margin-bottom:12px;text-align:center;outline:none}
.excuse-input:focus{border-color:#e63946}
.excuse-btn{background:#e63946;color:#fff;border:none;padding:12px 28px;font-family:'Space Mono',monospace;font-size:12px;letter-spacing:2px;cursor:pointer;border-radius:6px;text-transform:uppercase;transition:all .3s}
.excuse-btn:hover{transform:scale(1.04)}
.excuse-verdict{margin-top:14px;font-family:'Space Mono',monospace;font-size:13px;color:#e63946;opacity:0;transition:opacity .5s;line-height:1.6}
.excuse-verdict.show{opacity:1}

.threat-section{text-align:center;padding:80px 20px}
.threat-bar-outer{max-width:700px;height:36px;background:#111;border-radius:20px;margin:20px auto;overflow:hidden;border:1px solid #222}
.threat-bar-inner{height:100%;width:0;background:linear-gradient(90deg,#39FF14,#f4a261,#e63946,#ff006e);border-radius:20px;transition:width 2.5s ease-out}
.threat-labels{display:flex;justify-content:space-between;max-width:700px;margin:0 auto;font-family:'Space Mono',monospace;font-size:10px;color:#444;text-transform:uppercase}
.threat-result{font-size:clamp(18px,3vw,32px);margin-top:20px;color:#e63946;font-weight:900}

.squad-section{margin:40px 0}
.squad-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #1a1a1a;font-family:'Space Mono',monospace;font-size:13px}
.squad-status.confirmed{color:#39FF14}
.squad-status.pending{color:#e63946;animation:blink 1s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}

.timelines{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:32px 0}
@media(max-width:640px){.timelines{grid-template-columns:1fr}}
.timeline-box{background:#111;border:1px solid #222;padding:24px;border-radius:8px}
.timeline-box.bad{border-color:#e63946}
.timeline-box.good{border-color:#39FF14}
.timeline-box h4{font-family:'Space Mono',monospace;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px}
.timeline-box.bad h4{color:#e63946}
.timeline-box.good h4{color:#39FF14}
.tl-item{padding:6px 0;border-bottom:1px solid #1a1a1a;font-size:13px;display:flex;gap:12px}
.tl-item:last-child{border-bottom:none}
.tl-time{color:#555;font-family:'Space Mono',monospace;font-size:11px;flex-shrink:0;width:70px}

.consequence{display:flex;gap:16px;padding:20px 0;border-bottom:1px solid #151515;align-items:flex-start}
.consequence:last-child{border-bottom:none}
.con-num{font-family:'Space Mono',monospace;font-size:28px;color:#e63946;flex-shrink:0;opacity:.5}
.consequence p{font-size:14px;line-height:1.8;color:#999}
.consequence p strong{color:#fff}

.countdown-section{text-align:center;padding:60px 20px}
.cd-grid{display:flex;justify-content:center;gap:16px;margin:24px 0}
.cd-unit{background:#111;border:1px solid #222;padding:16px 22px;border-radius:10px;min-width:80px}
.cd-num{font-family:'Space Mono',monospace;font-size:36px;color:#00b4d8}
.cd-label{font-size:10px;letter-spacing:2px;color:#444;text-transform:uppercase;margin-top:4px}

.petition{background:#0d0d0d;border:2px solid #e63946;border-radius:12px;padding:36px;margin:40px 0;text-align:center}
.petition h3{font-size:26px;font-weight:900;margin-bottom:8px}
.petition>p{color:#555;margin-bottom:20px;font-size:13px;line-height:1.6;max-width:500px;margin-left:auto;margin-right:auto}
.sign-btn{background:transparent;border:2px solid #39FF14;color:#39FF14;padding:12px 36px;font-family:'Space Mono',monospace;font-size:12px;letter-spacing:3px;cursor:pointer;border-radius:6px;text-transform:uppercase;transition:all .3s}
.sign-btn:hover{background:#39FF14;color:#000}
.sig-count{margin-top:14px;font-family:'Space Mono',monospace;font-size:11px;color:#444}
.sig-list{margin-top:14px;max-width:400px;margin-left:auto;margin-right:auto;text-align:left}
.sig-row{padding:5px 0;border-bottom:1px solid #111;font-size:12px;color:#777;display:flex;justify-content:space-between}
.sig-time{font-family:'Space Mono',monospace;font-size:10px;color:#333}

.facts-list{list-style:none;margin:20px 0}
.facts-list li{padding:8px 0;border-bottom:1px solid #1a1a1a;font-size:14px;color:#999;padding-left:16px;position:relative}
.facts-list li::before{content:'>';position:absolute;left:0;color:#e63946;font-family:'Space Mono',monospace}

.final{text-align:center;padding:100px 20px}
.final h2{font-size:clamp(28px,5vw,52px);font-weight:900;margin-bottom:16px;line-height:1.1}
.final .address{font-family:'Space Mono',monospace;font-size:13px;color:#00b4d8;letter-spacing:2px;margin-bottom:20px}
.final .tagline{font-size:15px;color:#555;max-width:500px;margin:0 auto 28px;line-height:1.7}
.cta-btn{display:inline-block;background:linear-gradient(135deg,#e63946,#ff006e);color:#fff;padding:16px 44px;font-family:'Space Mono',monospace;font-size:14px;letter-spacing:3px;text-decoration:none;border-radius:8px;text-transform:uppercase;transition:all .3s}
.cta-btn:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(230,57,70,.3)}

.confirm-btn{display:inline-block;margin-top:12px;background:transparent;border:2px solid #fff;color:#fff;padding:14px 36px;font-family:'Space Mono',monospace;font-size:12px;letter-spacing:2px;border-radius:8px;text-transform:uppercase;cursor:pointer;transition:all .3s}
.confirm-btn:hover{background:#fff;color:#000}

footer{text-align:center;padding:40px 20px;border-top:1px solid #111}
footer p{font-size:10px;color:#222;font-family:'Space Mono',monospace;letter-spacing:2px}

.reveal{opacity:0;transform:translateY(24px);transition:all .6s ease-out}.reveal.visible{opacity:1;transform:translateY(0)}

.popup{position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:10000;display:none;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:40px}
.popup.active{display:flex}
.popup h2{font-size:32px;font-weight:900;color:#39FF14;margin-bottom:12px}
.popup p{color:#777;font-size:14px;max-width:450px;line-height:1.7;margin-bottom:4px}
.popup-close{margin-top:20px;color:#333;font-size:10px;cursor:pointer;font-family:'Space Mono',monospace;letter-spacing:2px}

@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.shake{animation:shake .5s}
</style>
</head>
<body>

<div id="splash" onclick="enterSite()">
<div class="splash-badge">PRIORITY NOTICE</div>
<div class="splash-title">${c.splashTagline}</div>
<div class="splash-sub">CASE #${c.targetName.replace(/\s/g, '').toUpperCase().slice(0, 2)}-${Date.now().toString(36).slice(-6).toUpperCase()}</div>
<button class="splash-btn">OPEN THE FILE</button>
</div>

<div class="ticker"><div class="ticker-inner" id="ticker"></div></div>

<main id="main">

<section style="min-height:80vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
<div class="reveal">
<div class="section-label">FORMAL INTERVENTION</div>
<h1 class="section-title" style="font-size:clamp(32px,6vw,64px)">${c.heroHeadline}</h1>
<p class="section-text" style="max-width:600px;margin:0 auto">${c.heroSubtitle}</p>
</div>
</section>

<section>
<div class="reveal">
<div class="section-label">THE CASE</div>
<div class="section-title">The Prosecution Presents</div>
<p class="section-text">${c.roastParagraph1}</p>
<p class="section-text">${c.roastParagraph2}</p>
${c.targetFacts.length ? `<ul class="facts-list">${factsHtml}</ul>` : ''}
</div>
<div class="stats-grid reveal">
<div class="stat-card"><div class="num">0</div><div class="label">Valid Excuses Found</div><div class="val">Across all known databases</div></div>
<div class="stat-card"><div class="num">${c.squad.length}</div><div class="label">Friends Confirmed</div><div class="val">Everyone except ${c.targetName.split(' ')[0]}</div></div>
<div class="stat-card"><div class="num">${c.closingTime}</div><div class="label">Last Call</div><div class="val">${c.venueName}, ${c.venueCity}</div></div>
<div class="stat-card"><div class="num">${c.outrageLevel}/10</div><div class="label">Outrage Level</div><div class="val">Calibrated by the Oracle</div></div>
</div>
</section>

<section>
<div class="reveal">
<div class="excuse-machine">
<h3>The Excuse Destroyer</h3>
<p>Go ahead, ${c.targetName.split(' ')[0]}. Type your excuse. Watch it get rejected.</p>
<div class="excuse-display" id="excuseDisplay">Awaiting excuse...</div>
<input type="text" class="excuse-input" id="excuseInput" placeholder='Try "${c.excuse}"' />
<br><button class="excuse-btn" onclick="destroyExcuse()">ANALYZE EXCUSE</button>
<div class="excuse-verdict" id="excuseVerdict"></div>
</div>
</div>
</section>

<section class="threat-section">
<div class="reveal">
<div class="section-label">RISK ASSESSMENT</div>
<div class="section-title">FOMO Threat Level</div>
<div class="threat-bar-outer"><div class="threat-bar-inner" id="threatBar"></div></div>
<div class="threat-labels"><span>Mild regret</span><span>Moderate FOMO</span><span>Devastating</span></div>
<div class="threat-result" id="threatResult"></div>
</div>
</section>

<section>
<div class="reveal">
<div class="section-label">THE SQUAD</div>
<div class="section-title">Attendance Report</div>
<div class="squad-section">
${squadHtml}
${targetRow}
</div>
</div>
</section>

<section>
<div class="reveal">
<div class="section-label">TWO FUTURES</div>
<div class="section-title">Choose Your Timeline</div>
<div class="timelines">
<div class="timeline-box bad">
<h4>${c.targetName.split(' ')[0]} Stays Home</h4>
${timelineAHtml}
</div>
<div class="timeline-box good">
<h4>${c.targetName.split(' ')[0]} Shows Up</h4>
${timelineBHtml}
</div>
</div>
</div>
</section>

<section>
<div class="reveal">
<div class="section-label">CONSEQUENCES</div>
<div class="section-title">What Happens If You Don't Come</div>
${consequencesHtml}
</div>
</section>

<section class="countdown-section">
<div class="reveal">
<div class="section-label">DEADLINE</div>
<div class="section-title">Time Remaining</div>
<div class="cd-grid">
<div class="cd-unit"><div class="cd-num" id="cdH">--</div><div class="cd-label">Hours</div></div>
<div class="cd-unit"><div class="cd-num" id="cdM">--</div><div class="cd-label">Minutes</div></div>
<div class="cd-unit"><div class="cd-num" id="cdS">--</div><div class="cd-label">Seconds</div></div>
</div>
</div>
</section>

<section>
<div class="reveal">
<div class="petition">
<h3>Official Petition</h3>
<p>We, the undersigned, formally request ${c.targetName}'s presence at ${c.venueName} tonight.</p>
<button class="sign-btn" id="signBtn" onclick="signPetition()">SIGN THE PETITION</button>
<div class="sig-count" id="sigCount">${c.petitionSignatures.length} signatures</div>
<div class="sig-list" id="sigList">${petitionHtml}</div>
</div>
</div>
</section>

<section class="final">
<div class="reveal">
<div class="section-label">FINAL NOTICE</div>
<h2>${c.finalCta}</h2>
<div class="address">${c.venueName.toUpperCase()} — ${c.venueAddress}</div>
<p class="tagline">Your friends built you an entire website. The least you can do is show up.</p>
<a href="https://maps.google.com/?q=${encodeURIComponent(c.venueAddress + ' ' + c.venueCity)}" target="_blank" class="cta-btn">GET DIRECTIONS</a>
<br><button class="confirm-btn" onclick="confirmAttendance()">I'LL BE THERE</button>
</div>
</section>

</main>

<footer><p>Bureau of Going Out — Case filed by concerned friends</p></footer>

<div class="popup" id="confirmPopup">
<h2>FINALLY.</h2>
<p>${c.targetName} has confirmed attendance.</p>
<p>All charges suspended pending arrival at ${c.venueName}.</p>
<div class="popup-close" onclick="document.getElementById('confirmPopup').classList.remove('active')">[ CLOSE ]</div>
</div>

<script>
function enterSite(){document.getElementById('splash').classList.add('gone');document.getElementById('main').classList.add('visible');setTimeout(()=>{document.getElementById('splash').style.display='none'},1000);startEffects()}

function startEffects(){setTimeout(()=>{var b=document.getElementById('threatBar');if(b)b.style.width='94%';setTimeout(()=>{var r=document.getElementById('threatResult');if(r)r.textContent='CRITICAL: 94% Regret Probability'},2500)},1500);startCountdown()}

var tickerMsgs=["${c.targetName.toUpperCase()} HAS NOT CONFIRMED ATTENDANCE","FRIENDS CONCERNED — WEBSITE DEPLOYED","${c.venueName.toUpperCase()} — ${c.closingTime} LAST CALL","${c.squad.map(s=>s.name.toUpperCase()).join(', ')} ALL CONFIRMED — ${c.targetName.split(' ')[0].toUpperCase()} STILL MISSING"];
document.getElementById('ticker').textContent=(tickerMsgs.join('  ///  ')+'  ///  ').repeat(4);

var excuseResponses=${excuseResponsesJs};
var excuseIdx=0;
function destroyExcuse(){var i=document.getElementById('excuseInput'),d=document.getElementById('excuseDisplay'),v=document.getElementById('excuseVerdict'),e=i.value.trim()||"${c.excuse}";d.textContent='"'+e+'"';d.style.color='#f4a261';var m=document.querySelector('.excuse-machine');setTimeout(function(){d.style.color='#e63946';d.textContent='EXCUSE REJECTED';v.textContent=excuseResponses[excuseIdx%excuseResponses.length];v.classList.add('show');m.classList.add('shake');setTimeout(function(){m.classList.remove('shake')},500);excuseIdx++;i.value=''},1500)}

function startCountdown(){function u(){var n=new Date,t=new Date;t.setHours(t.getHours()+6);var d=t-n;if(d<=0)return;document.getElementById('cdH').textContent=String(Math.floor(d/36e5)).padStart(2,'0');document.getElementById('cdM').textContent=String(Math.floor(d%36e5/6e4)).padStart(2,'0');document.getElementById('cdS').textContent=String(Math.floor(d%6e4/1e3)).padStart(2,'0')}u();setInterval(u,1000)}

var sigCount=${c.petitionSignatures.length};
var extraSigs=[{n:"${c.targetName.split(' ')[0]} (under duress)",t:"Just now"},{n:"${c.targetName.split(' ')[0]}'s Uber Driver",t:"En route"},{n:"The Bartender at ${c.venueName}",t:"Waiting"},{n:"Saturday Night Itself",t:"Disappointed"}];
function signPetition(){sigCount++;document.getElementById('sigCount').textContent=sigCount+' signatures';var l=document.getElementById('sigList'),s=extraSigs[Math.min(sigCount-${c.petitionSignatures.length}-1,extraSigs.length-1)]||{n:"Concerned Citizen",t:"Just now"};var d=document.createElement('div');d.className='sig-row';d.innerHTML='<span>'+s.n+'</span><span class="sig-time">'+s.t+'</span>';l.prepend(d);if(sigCount>=${c.petitionSignatures.length+3}){var b=document.getElementById('signBtn');b.textContent='GET IN THE UBER';b.style.background='#e63946';b.style.borderColor='#e63946';b.style.color='#fff'}}

function confirmAttendance(){document.getElementById('confirmPopup').classList.add('active')}

var obs=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){x.target.classList.add('visible');obs.unobserve(x.target)}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){obs.observe(el)});

console.log('%c🚨 ${c.targetName.toUpperCase()} IS NEEDED AT ${c.venueName.toUpperCase()} TONIGHT','font-size:18px;color:red;font-weight:bold');
</script>
</body>
</html>`;
}
