const loader=document.querySelector('.loader');
addEventListener('load',()=>setTimeout(()=>loader.classList.add('hide'),700));

const progress=document.querySelector('.progress');
addEventListener('scroll',()=>{
  const h=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=(h>0?scrollY/h*100:0)+'%';
});

const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(e=>io.observe(e));

if(matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.tilt').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const q=el.getBoundingClientRect(),x=(e.clientX-q.left)/q.width-.5,y=(e.clientY-q.top)/q.height-.5;
      el.style.transform=`perspective(900px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg) translateY(-2px)`;
    });
    el.addEventListener('mouseleave',()=>el.style.transform='');
  });
}

const video=document.querySelector('.hero-video');
const sound=document.querySelector('#sound');
sound.addEventListener('click',()=>{
  video.muted=!video.muted;
  video.play().catch(()=>{});
  sound.querySelector('span').textContent=video.muted?'OFF':'ON';
});
