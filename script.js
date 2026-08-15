const loader=document.querySelector('.loader');
window.addEventListener('load',()=>setTimeout(()=>loader?.classList.add('hide'),700));

const c=document.querySelector('.cursor'),r=document.querySelector('.cursor-ring');
window.addEventListener('mousemove',e=>{
  if(c&&r){c.style.left=e.clientX+'px';c.style.top=e.clientY+'px';r.style.left=e.clientX+'px';r.style.top=e.clientY+'px'}
});

document.querySelectorAll('a,.tilt,.play').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('hover'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('hover'));
});

const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting)e.target.classList.add('visible');
}),{threshold:.10});
document.querySelectorAll('.reveal').forEach(e=>io.observe(e));

window.addEventListener('scroll',()=>{
  const h=document.documentElement.scrollHeight-innerHeight;
  const bar=document.querySelector('.scrollbar');
  if(bar) bar.style.width=(h>0?(scrollY/h*100):0)+'%';
},{passive:true});

/* 3D tilt only where a real pointer exists */
if(matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.tilt').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const q=el.getBoundingClientRect(),x=(e.clientX-q.left)/q.width-.5,y=(e.clientY-q.top)/q.height-.5;
      el.style.transform=`perspective(900px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg) translateY(-3px)`;
    });
    el.addEventListener('mouseleave',()=>el.style.transform='');
  });
}

/* Portfolio videos: autoplay muted when visible, pause when mostly offscreen.
   This is intentionally mobile-friendly: no hover is required. */
const cards=[...document.querySelectorAll('.media-card')];
const videos=cards.map(card=>({card,v:card.querySelector('video'),b:card.querySelector('.play')})).filter(x=>x.v);

function stopOthers(except){
  videos.forEach(({v,card,b})=>{
    if(v!==except){
      v.pause();
      card.classList.remove('playing');
      if(b)b.textContent='▶';
    }
  });
}

const videoObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    const item=videos.find(x=>x.v===entry.target);
    if(!item)return;
    if(entry.isIntersecting && entry.intersectionRatio>=0.55){
      item.v.muted=true;
      item.v.play().then(()=>{
        item.card.classList.add('playing');
        if(item.b)item.b.textContent='❚❚';
      }).catch(()=>{});
    }else if(entry.intersectionRatio<0.15){
      item.v.pause();
      item.card.classList.remove('playing');
      if(item.b)item.b.textContent='▶';
    }
  });
},{threshold:[0,.15,.55,.8]});

videos.forEach(({v})=>{
  v.muted=true;
  v.setAttribute('muted','');
  v.setAttribute('playsinline','');
  v.setAttribute('webkit-playsinline','');
  v.setAttribute('autoplay','');
  v.setAttribute('loop','');
  videoObserver.observe(v);
});

cards.forEach(card=>{
  const v=card.querySelector('video'),b=card.querySelector('.play');
  card.addEventListener('click',e=>{
    if(e.target.closest('a'))return;
    if(v.paused){
      stopOthers(v);
      v.muted=true;
      v.play().then(()=>{
        card.classList.add('playing');
        if(b)b.textContent='❚❚';
      }).catch(()=>{});
    }else{
      v.pause();
      card.classList.remove('playing');
      if(b)b.textContent='▶';
    }
  });
});

/* Keep desktop hover behavior, but don't depend on it. */
if(matchMedia('(pointer:fine)').matches){
  cards.forEach(card=>{
    const v=card.querySelector('video');
    card.addEventListener('mouseenter',()=>v?.play().catch(()=>{}));
  });
}

document.querySelectorAll('.magnetic').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const q=el.getBoundingClientRect();
    el.style.transform=`translate(${(e.clientX-q.left-q.width/2)*.08}px,${(e.clientY-q.top-q.height/2)*.08}px)`;
  });
  el.addEventListener('mouseleave',()=>el.style.transform='');
});

/* V3: recover gracefully if mobile delays media loading */
document.querySelectorAll('.media-card video, .hero-bg').forEach(v=>{
  v.muted=true;
  v.setAttribute('muted','');
  v.setAttribute('playsinline','');
  v.setAttribute('webkit-playsinline','');
  v.addEventListener('loadedmetadata',()=>{ if(v.classList.contains('hero-bg')) v.play().catch(()=>{}); });
});
