(() => {
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const loader=document.querySelector('.loader');
window.addEventListener('load',()=>{setTimeout(()=>loader?.classList.add('done'),reduce?0:700)});
const progress=document.querySelector('.scroll-progress i');
const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.width=(max>0?scrollY/max*100:0)+'%'};
addEventListener('scroll',update,{passive:true});update();
const toggle=document.querySelector('#theme-toggle');
const saved=localStorage.getItem('sx-theme');
if(saved==='day')document.body.classList.add('day');
const setTheme=()=>{const day=document.body.classList.toggle('day');localStorage.setItem('sx-theme',day?'day':'night');toggle.querySelector('.theme-icon').textContent=day?'☼':'◐';toggle.querySelector('.theme-label').textContent=day?'DAY':'NIGHT';toggle.setAttribute('aria-label',day?'Switch to night mode':'Switch to day mode')};
if(document.body.classList.contains('day')){toggle.querySelector('.theme-icon').textContent='☼';toggle.querySelector('.theme-label').textContent='DAY';toggle.setAttribute('aria-label','Switch to night mode')}
toggle?.addEventListener('click',setTheme);
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.querySelector(a.getAttribute('href'));if(!target)return;e.preventDefault();target.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})}));
const reveal=document.querySelectorAll('.reveal');
if('IntersectionObserver'in window&&!reduce){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');io.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -50px 0px'});reveal.forEach(el=>io.observe(el))}else reveal.forEach(el=>el.classList.add('in-view'));
const stage=document.querySelector('.hero-stage');
if(stage&&!reduce&&matchMedia('(pointer:fine)').matches){stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;stage.style.transform='perspective(900px) rotateX('+(-y*3)+'deg) rotateY('+(x*4)+'deg)'});stage.addEventListener('pointerleave',()=>stage.style.transform='')}
const cursor=document.querySelector('.cursor-dot');
if(cursor&&matchMedia('(pointer:fine)').matches&&!reduce){addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.classList.add('visible')});document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('pointerenter',()=>cursor.classList.add('hover'));el.addEventListener('pointerleave',()=>cursor.classList.remove('hover'))})}
document.querySelectorAll('.work-card').forEach(card=>{card.addEventListener('pointermove',e=>{if(reduce||e.pointerType==='touch')return;const r=card.getBoundingClientRect();card.style.setProperty('--px',((e.clientX-r.left)/r.width*100)+'%');card.style.setProperty('--py',((e.clientY-r.top)/r.height*100)+'%')})});
const navLinks=[...document.querySelectorAll('.header nav a')];const targets=['work','about','contact'].map(id=>document.getElementById(id)).filter(Boolean);
if('IntersectionObserver'in window){const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)navLinks.forEach(link=>link.classList.toggle('active',link.hash==='#'+entry.target.id))}),{rootMargin:'-40% 0px -50% 0px'});targets.forEach(target=>navObserver.observe(target))}
})();