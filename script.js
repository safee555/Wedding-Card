const preloader=document.getElementById('preloader');
const welcome=document.getElementById('welcome');
const invitation=document.getElementById('invitation');
const openingLoader=document.getElementById('openingLoader');
const enterButton=document.getElementById('enterInvitation');
const rig=document.getElementById('lanternRig');
const hanger=document.getElementById('hanger');
const rope=document.getElementById('rope');
const hit=document.getElementById('lanternHit');
const backgroundMusic=document.getElementById('backgroundMusic');
const musicToggle=document.getElementById('musicToggle');
const scrollHintArrows=document.getElementById('scrollHintArrows');
let musicMuted=false;

// Nikaah: 6 November 2026. Since the exact Asr time can vary by location/date,
// the countdown uses a 4:00 PM Asia/Kolkata reference.
const target=new Date('2026-11-06T16:00:00+05:30').getTime();
const countdownEls={
  d:[document.getElementById('fdays'),document.getElementById('days')],
  h:[document.getElementById('fhours'),document.getElementById('hours')],
  m:[document.getElementById('fminutes'),document.getElementById('minutes')],
  s:[document.getElementById('fseconds'),document.getElementById('seconds')]
};
function updateCountdown(){
  const remaining=Math.max(0,target-Date.now());
  const d=Math.floor(remaining/86400000);
  const h=Math.floor(remaining%86400000/3600000);
  const m=Math.floor(remaining%3600000/60000);
  const s=Math.floor(remaining%60000/1000);
  [[d,'d'],[h,'h'],[m,'m'],[s,'s']].forEach(([value,key])=>countdownEls[key].forEach(el=>{if(el)el.textContent=String(value).padStart(2,'0')}));
}
updateCountdown(); setInterval(updateCountdown,1000);

// Scroll guidance: show the animated corner arrows only at the top of the main invitation.
// As soon as the guest starts scrolling, fade them away and keep them hidden for the session.
if(invitation && scrollHintArrows){
  const invitationScroller=invitation.querySelector('.invitation-scroll');
  let scrollHintDismissed=false;
  const hideScrollHint=()=>{
    if(scrollHintDismissed) return;
    scrollHintDismissed=true;
    scrollHintArrows.classList.add('is-hidden');
  };
  if(invitationScroller){
    invitationScroller.addEventListener('scroll',()=>{
      if(invitationScroller.scrollTop>2) hideScrollHint();
    },{passive:true});
    invitationScroller.addEventListener('touchmove',hideScrollHint,{passive:true});
    invitationScroller.addEventListener('wheel',hideScrollHint,{passive:true});
  }
  scrollHintArrows.classList.remove('is-hidden');
}

window.addEventListener('load',()=>setTimeout(()=>preloader.classList.add('done'),1100));

document.documentElement.classList.add('invitation-locked');
document.body.classList.add('invitation-locked');

/* Physical lantern: fixed pivot, rope lengthens downward, lantern follows rope bottom.
   Horizontal drag maps naturally to pendulum direction: dragging right swings right. */
let dragging=false,opened=false,pull=0,swing=0,velocityX=0,velocityY=0,startX=0,startY=0,lastX=0,lastY=0,lastT=0,pid=null,raf=0;
const baseRope=118;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function render(){
  const ropeLength=baseRope+pull;
  rope.style.height=ropeLength+'px';
  hit.style.top=ropeLength+'px';
  hanger.style.transform=`rotate(${swing}deg)`;
  rig.style.setProperty('--pull',pull+'px');
  rig.style.setProperty('--swing',swing+'deg');
}
function animateSpring(){
  cancelAnimationFrame(raf);
  let vy=velocityY*0.42;
  let vx=velocityX*0.42;
  function step(){
    // spring toward rest; pull cannot become negative
    const ay=-0.026*pull;
    vy=(vy+ay)*0.88;
    pull+=vy;
    if(pull<0){pull=0;vy*=-0.28}
    // pendulum swing settles smoothly
    const ax=-0.065*swing;
    vx=(vx+ax)*0.90;
    swing+=vx;
    if(Math.abs(pull)<.25&&Math.abs(vy)<.3&&Math.abs(swing)<.25&&Math.abs(vx)<.25){pull=0;swing=0;render();return}
    render(); raf=requestAnimationFrame(step);
  }
  raf=requestAnimationFrame(step);
}
let musicStarted=false;
let musicUnlockListening=true;
function startBackgroundMusic(){
  if(!backgroundMusic || musicMuted)return;
  // Always attempt autoplay first. Browsers that permit audible autoplay will start here.
  // On iOS/Android browsers that block autoplay, the first real page interaction below
  // retries play() directly from the user-gesture event.
  backgroundMusic.volume=0;
  const playPromise=backgroundMusic.play();
  if(playPromise && playPromise.then){
    playPromise.then(()=>{ musicStarted=true; }).catch(()=>{ /* autoplay blocked; wait for a user gesture */ });
  }
  const started=performance.now();
  function fadeIn(now){
    if(!backgroundMusic || musicMuted)return;
    const t=Math.min(1,(now-started)/1400);
    backgroundMusic.volume=0.28*(1-Math.pow(1-t,3));
    if(t<1)requestAnimationFrame(fadeIn);
  }
  requestAnimationFrame(fadeIn);
}
function unlockMusicFromGesture(){
  if(!backgroundMusic || musicMuted || musicStarted)return;
  // Must be called synchronously from a trusted user gesture for iOS Safari and
  // other browsers that block audible autoplay.
  backgroundMusic.volume=0.28;
  const playPromise=backgroundMusic.play();
  if(playPromise && playPromise.then){
    playPromise.then(()=>{
      musicStarted=true;
      removeMusicUnlockListeners();
    }).catch(()=>{});
  }
}
function removeMusicUnlockListeners(){
  if(!musicUnlockListening)return;
  ['pointerdown','touchstart','keydown'].forEach(type=>document.removeEventListener(type,unlockMusicFromGesture,{capture:true}));
  musicUnlockListening=false;
}
['pointerdown','touchstart','keydown'].forEach(type=>document.addEventListener(type,unlockMusicFromGesture,{capture:true,passive:true}));
// Try audible autoplay immediately. If the browser blocks it, the gesture listeners above
// start the same audio on the user's first tap/click/keypress.
startBackgroundMusic();
function stopBackgroundMusic(){
  if(!backgroundMusic)return;
  const start=backgroundMusic.volume, started=performance.now();
  function fadeOut(now){
    const t=Math.min(1,(now-started)/500);
    backgroundMusic.volume=start*(1-t);
    if(t<1)requestAnimationFrame(fadeOut);
    else backgroundMusic.pause();
  }
  requestAnimationFrame(fadeOut);
}
if(musicToggle){
  musicToggle.addEventListener('click',()=>{
    musicMuted=!musicMuted;
    musicToggle.setAttribute('aria-pressed',String(musicMuted));
    musicToggle.classList.toggle('muted',musicMuted);
    const label=musicToggle.querySelector('.music-label');
    if(label)label.textContent=musicMuted?'MUSIC OFF':'MUSIC ON';
    if(musicMuted)stopBackgroundMusic();
    else if(opened)startBackgroundMusic();
  });
}
function openInvitation(){
  if(opened)return;
  opened=true; dragging=false; welcome.classList.add('opening');
  // Keep the call here as an additional fallback: the lantern release is itself a user gesture.
  startBackgroundMusic();
  cancelAnimationFrame(raf);
  // Lift the lantern and retract its glowing rope before revealing the invitation.
  const startPull=pull,startSwing=swing,start=performance.now();
  function lift(now){
    const t=clamp((now-start)/950,0,1);
    const e=1-Math.pow(1-t,4);
    pull=startPull*(1-e);
    swing=startSwing*(1-e);
    render();
    if(t<1){raf=requestAnimationFrame(lift)}else{
      pull=0;swing=0;render();
      // Give the reveal a deliberate 1.5-second luxury loading beat.
      openingLoader.classList.add('show');
      const percentEl=document.getElementById('openingPercent');
      const loadStart=performance.now();
      const loadDuration=1000;
      function cinematicLoad(now){
        const t=Math.min(1,(now-loadStart)/loadDuration);
        const eased=1-Math.pow(1-t,3);
        if(percentEl) percentEl.textContent=Math.round(eased*100)+'%';
        const bar=openingLoader.querySelector('.opening-progress span');
        if(bar) bar.style.width=(eased*100)+'%';
        if(t<1){ requestAnimationFrame(cinematicLoad); }
        else {
          setTimeout(()=>{
            openingLoader.classList.remove('show');
            welcome.classList.add('opened');
            document.body.classList.add('invitation-open');
            document.body.classList.remove('invitation-locked');
            document.documentElement.classList.remove('invitation-locked');
            invitation.scrollTop=0;
            requestAnimationFrame(()=>{ invitation.classList.add('revealed'); });
          },90);
        }
      }
      requestAnimationFrame(cinematicLoad);
    }
  }
  raf=requestAnimationFrame(lift);
}
function pointerDown(e){
  if(opened||dragging)return;
  dragging=true;pid=e.pointerId;startX=lastX=e.clientX;startY=lastY=e.clientY;lastT=performance.now();velocityX=velocityY=0;
  welcome.classList.add('dragging');
  try{rig.setPointerCapture(pid)}catch(_){ }
  e.preventDefault();
}
function pointerMove(e){
  if(!dragging||e.pointerId!==pid)return;
  const now=performance.now(),dt=Math.max(8,now-lastT);
  const dx=e.clientX-lastX,dy=e.clientY-lastY;
  velocityX=dx/dt*16.67;velocityY=dy/dt*16.67;
  lastX=e.clientX;lastY=e.clientY;lastT=now;
  pull=clamp(e.clientY-startY,0,Math.min(innerHeight*.48,360));
  // Negative rotation makes the bottom of a top-pivoted pendulum move right for positive dx.
  swing=clamp(-((e.clientX-startX)/Math.max(100,innerWidth*.34))*12,-13,13);
  render();e.preventDefault();
}
function pointerUp(e){
  if(!dragging||e.pointerId!==pid)return;
  dragging=false;welcome.classList.remove('dragging');
  try{rig.releasePointerCapture(pid)}catch(_){ }
  const threshold=Math.min(105,innerHeight*.18);
  if(pull>=threshold||velocityY>5){openInvitation();}
  else animateSpring();
}
rig.addEventListener('pointerdown',pointerDown,{passive:false});
rig.addEventListener('pointermove',pointerMove,{passive:false});
rig.addEventListener('pointerup',pointerUp,{passive:false});
rig.addEventListener('pointercancel',pointerUp,{passive:false});

// Keyboard accessibility: Enter/Space opens the invitation.
rig.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openInvitation()}});

// Fallback button if a visitor prefers not to drag.
if(enterButton){
  enterButton.addEventListener('click',()=>openInvitation());
  enterButton.addEventListener('pointerdown',e=>e.stopPropagation());
}

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  document.querySelectorAll('[data-tilt]').forEach(card=>{
    card.style.transition='transform .18s ease-out, box-shadow .65s cubic-bezier(.22,1,.36,1), border-color .5s ease';
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(1200px) rotateX(${-y*5}deg) rotateY(${x*7}deg) translateY(-5px) scale(1.012)`;
    });
    card.addEventListener('pointerleave',()=>{card.style.transform='';});
  });
}

document.getElementById('calendar').addEventListener('click',()=>{
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Safee Tuba Wedding//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:safee-tuba-20261106@wedding','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z/,'Z'),'DTSTART;TZID=Asia/Kolkata:20261106T160000','DTEND;TZID=Asia/Kolkata:20261106T190000','SUMMARY:Safee\'s Wedding Ceremony','LOCATION:Jama Masjid, Aurangabad, Maharashtra','DESCRIPTION:Nikaah of Syed Safee & Tuba Tazeen — after Namaz-e-Asar.','END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));a.download='Safee-Wedding-Ceremony.ics';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  const toast=document.getElementById('toast');toast.textContent="Safee's Wedding Ceremony added";toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2400);
});

render();
