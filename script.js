(()=>{'use strict';
const root=document.documentElement;
const body=document.body;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
const progress=document.querySelector('.scroll-progress i');
const nav=[...document.querySelectorAll('.main-nav a')];
let scrollQueued=false;
function updateScroll(){
  const max=document.documentElement.scrollHeight-innerHeight;
  if(progress)progress.style.width=(max>0?scrollY/max*100:0)+'%';
  scrollQueued=false;
}
addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll)}},{passive:true});
updateScroll();

/* A short entry cue, never a network-dependent loading gate. */
const loader=document.querySelector('.loader');
const finishEntry=()=>{
  body.classList.remove('is-loading');
  body.classList.add('is-ready');
};
if(reduce)finishEntry();else setTimeout(finishEntry,560);

/* Day / night is a real theme switch, not a decorative button. */
const themeButton=document.querySelector('.theme-switch');
function setTheme(mode){
  const day=mode==='day';
  root.dataset.theme=day?'day':'night';
  if(themeButton){
    themeButton.setAttribute('aria-label',day?'Switch to night mode':'Switch to day mode');
    const icon=themeButton.querySelector('.theme-icon');
    const label=themeButton.querySelector('.theme-label');
    if(icon)icon.textContent=day?'☾':'☼';
    if(label)label.textContent=day?'NIGHT MODE':'DAY MODE';
  }
  try{localStorage.setItem('sectorx83-theme',day?'day':'night')}catch(_){}
  drawWorld(true);
}
let savedTheme='night';
try{savedTheme=localStorage.getItem('sectorx83-theme')||'night'}catch(_){}
themeButton?.addEventListener('click',()=>setTheme(root.dataset.theme==='day'?'night':'day'));

/* Create a distributed reveal sequence across the page. */
const revealTargets=[
  ...document.querySelectorAll('.section-top,.work-heading,.project,.project-art,.project-info,.about-layout,.principles>div,.toolkit-layout,.toolkit-list>div,.contact-main,.footer')
];
revealTargets.forEach((el,i)=>{
  el.classList.add('reveal');
  el.style.setProperty('--reveal-delay',Math.min(i%5,4)*65+'ms');
});
if('IntersectionObserver'in window&&!reduce){
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },{threshold:.08,rootMargin:'0px 0px -35px 0px'});
  revealTargets.forEach(el=>revealObserver.observe(el));
}else revealTargets.forEach(el=>el.classList.add('in-view'));

/* The active navigation follows the section currently occupying the viewport. */
const sections=[document.getElementById('top'),document.getElementById('work'),document.getElementById('about'),document.getElementById('contact')].filter(Boolean);
if('IntersectionObserver'in window){
  const navObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting)nav.forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id));
    });
  },{rootMargin:'-36% 0px -55% 0px',threshold:0});
  sections.forEach(section=>navObserver.observe(section));
}

/* Scroll-linked hero depth, limited to a single animation frame. */
const hero=document.querySelector('.hero');
const heroStamp=document.querySelector('.hero-stamp');
let heroQueued=false;
if(hero&&heroStamp&&!reduce){
  addEventListener('scroll',()=>{
    if(heroQueued)return;
    heroQueued=true;
    requestAnimationFrame(()=>{
      const r=hero.getBoundingClientRect();
      const p=Math.max(-1,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));
      heroStamp.style.translate='0 '+(p*22)+'px';
      heroQueued=false;
    });
  },{passive:true});
}

/* Magnetic details and restrained 3D response, desktop pointers only. */
if(finePointer&&!reduce){
  document.querySelectorAll('.project-art').forEach(art=>{
    art.addEventListener('pointermove',event=>{
      const r=art.getBoundingClientRect();
      const x=(event.clientX-r.left)/r.width-.5;
      const y=(event.clientY-r.top)/r.height-.5;
      art.style.setProperty('--pointer-x',(event.clientX-r.left)+'px');
      art.style.setProperty('--pointer-y',(event.clientY-r.top)+'px');
      art.style.transform='perspective(1200px) rotateX('+(-y*2.4)+'deg) rotateY('+(x*3.1)+'deg) translateY(-4px)';
    });
    art.addEventListener('pointerleave',()=>{art.style.transform=''});
  });
  document.querySelectorAll('.round-link,.contact-email').forEach(el=>{
    el.addEventListener('pointermove',event=>{
      const r=el.getBoundingClientRect();
      const x=event.clientX-r.left-r.width/2;
      const y=event.clientY-r.top-r.height/2;
      el.style.translate=(x*.045)+'px '+(y*.075-2)+'px';
    });
    el.addEventListener('pointerleave',()=>{el.style.translate=''});
  });
}

/* Ambient world: 84 moving points and their proximity field create the video-like backdrop.
   It runs locally, pauses off-tab, scales down on phones, and respects reduced motion. */
const canvas=document.getElementById('world');
const ctx=canvas?.getContext('2d',{alpha:true});
let width=innerWidth,height=innerHeight,dpr=1,points=[],raf=0,lastPaint=0,worldVisible=true;
const mobile=matchMedia('(max-width:760px)').matches;
const pointCount=mobile?46:84;
const rand=(min,max)=>Math.random()*(max-min)+min;
function resizeWorld(){
  if(!canvas||!ctx)return;
  width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,1.25);
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
  canvas.style.width=width+'px';canvas.style.height=height+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  points=Array.from({length:pointCount},(_,i)=>({
    x:rand(0,width),y:rand(0,height),vx:rand(-.16,.16),vy:rand(-.15,.15),
    radius:rand(.55,1.75),phase:rand(0,Math.PI*2),speed:rand(.22,.8),
    tint:i%9===0?1:(i%5===0?2:0)
  }));
  drawWorld(true);
}
function palette(){
  return root.dataset.theme==='day'
    ?{bg:'rgba(232,233,223,0)',line:'rgba(38,53,63,',lime:'rgba(115,151,30,',blue:'rgba(93,104,206,',coral:'rgba(208,97,88,'}
    :{bg:'rgba(8,11,18,0)',line:'rgba(178,197,220,',lime:'rgba(214,255,102,',blue:'rgba(150,159,255,',coral:'rgba(255,130,120,'};
}
let worldTime=0;
function drawWorld(staticFrame=false){
  if(!canvas||!ctx)return;
  const colors=palette();
  ctx.clearRect(0,0,width,height);
  const wash=ctx.createRadialGradient(width*.68,height*.34,0,width*.68,height*.34,Math.max(width,height)*.78);
  wash.addColorStop(0,root.dataset.theme==='day'?'rgba(126,151,172,.13)':'rgba(82,100,154,.13)');
  wash.addColorStop(.46,root.dataset.theme==='day'?'rgba(175,193,134,.07)':'rgba(78,99,126,.055)');
  wash.addColorStop(1,'transparent');
  ctx.fillStyle=wash;ctx.fillRect(0,0,width,height);
  const t=worldTime;
  /* Subtle wide orbital paths. */
  for(let ring=0;ring<3;ring++){
    ctx.beginPath();
    ctx.ellipse(width*(.72+ring*.018),height*(.28+ring*.03),Math.min(width,height)*(.22+ring*.075),Math.min(width,height)*(.075+ring*.035),-.34+ring*.18,0,Math.PI*2);
    ctx.strokeStyle=ring===1?colors.blue+'.16)':colors.line+'.10)';
    ctx.lineWidth=1;ctx.stroke();
  }
  /* Soft atmospheric ribbons, each composed of independently moving segments. */
  for(let ribbon=0;ribbon<3;ribbon++){
    ctx.beginPath();
    for(let x=-30;x<=width+30;x+=18){
      const y=height*(.22+ribbon*.115)+Math.sin(x*.003+t*.00042+ribbon*1.7)*24+Math.sin(x*.008-t*.00027+ribbon)*9;
      if(x===-30)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.strokeStyle=ribbon===0?colors.blue+'.13)':(ribbon===1?colors.lime+'.10)':colors.coral+'.07)');
    ctx.lineWidth=ribbon===1?1.2:1;ctx.stroke();
  }
  /* Update and draw the particle system. */
  points.forEach((p,i)=>{
    if(!staticFrame){
      p.x+=p.vx;p.y+=p.vy;
      p.phase+=.007*p.speed;
      p.x+=Math.sin(p.phase+i)*.065;
      p.y+=Math.cos(p.phase*.8+i)*.055;
      if(p.x<-12)p.x=width+12;if(p.x>width+12)p.x=-12;
      if(p.y<-12)p.y=height+12;if(p.y>height+12)p.y=-12;
    }
    const alpha=.25+.4*(.5+.5*Math.sin(p.phase));
    const tint=p.tint===1?colors.lime:(p.tint===2?colors.blue:colors.line);
    ctx.beginPath();ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fillStyle=tint+alpha+')';ctx.fill();
    if(p.tint!==0){
      ctx.beginPath();ctx.arc(p.x,p.y,p.radius*4.5,0,Math.PI*2);
      ctx.fillStyle=tint+'.045)';ctx.fill();
    }
    for(let j=i+1;j<points.length;j++){
      const q=points[j],dx=p.x-q.x,dy=p.y-q.y,dist=Math.hypot(dx,dy);
      if(dist<112){
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
        ctx.strokeStyle=colors.line+(1-dist/112)*.105+')';ctx.lineWidth=.55;ctx.stroke();
      }
    }
  });
  /* A distant luminous body with a slow moving specular highlight. */
  const cx=width*.76,cy=height*.31,r=Math.min(width,height)*.055;
  const globe=ctx.createRadialGradient(cx-r*.35,cy-r*.45,r*.08,cx,cy,r*1.15);
  globe.addColorStop(0,root.dataset.theme==='day'?'rgba(242,244,220,.22)':'rgba(223,232,255,.26)');
  globe.addColorStop(.28,root.dataset.theme==='day'?'rgba(151,171,123,.12)':'rgba(100,119,177,.17)');
  globe.addColorStop(1,'rgba(0,0,0,0)');
  ctx.beginPath();ctx.arc(cx,cy,r*1.18,0,Math.PI*2);ctx.fillStyle=globe;ctx.fill();
}
function animateWorld(now){
  if(!worldVisible||document.hidden||reduce)return;
  raf=requestAnimationFrame(animateWorld);
  if(now-lastPaint<1000/45)return;
  lastPaint=now;worldTime=now;drawWorld(false);
}
function startWorld(){
  if(!canvas||!ctx)return;
  cancelAnimationFrame(raf);
  if(reduce){drawWorld(true);return}
  if(worldVisible&&!document.hidden)raf=requestAnimationFrame(animateWorld);
}
if(canvas&&ctx){
  resizeWorld();
  addEventListener('resize',resizeWorld,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf)}else startWorld()});
  startWorld();
}
setTheme(savedTheme);

/* Project scenes already use individual CSS animation systems; reveal them in sequence. */
document.querySelectorAll('.project').forEach((card,index)=>{
  card.style.setProperty('--project-order',index);
  card.addEventListener('focusin',()=>card.classList.add('is-active'));
  card.addEventListener('focusout',event=>{if(!card.contains(event.relatedTarget))card.classList.remove('is-active')});
});

/* Make in-page links feel deliberate without hijacking external navigation. */
document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click',event=>{
    const target=document.querySelector(link.getAttribute('href'));
    if(!target)return;
    event.preventDefault();
    target.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
    history.replaceState(null,'',link.getAttribute('href'));
  });
});
})();