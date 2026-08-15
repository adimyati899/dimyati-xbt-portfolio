const videos=[...document.querySelectorAll(".project-video")];
const soundButtons=[...document.querySelectorAll(".sound-btn")];

const observer=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    const v=entry.target;
    if(entry.isIntersecting){
      v.play().catch(()=>{});
    }else{
      v.pause();
    }
  });
},{threshold:.25});
videos.forEach(v=>observer.observe(v));

soundButtons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    const card=btn.closest(".video-card");
    const v=card.querySelector("video");
    videos.forEach(other=>{
      if(other!==v){
        other.muted=true;
        const b=other.closest(".video-card")?.querySelector(".sound-btn");
        if(b)b.textContent="🔇";
      }
    });
    v.muted=!v.muted;
    btn.textContent=v.muted?"🔇":"🔊";
    v.play().catch(()=>{});
  });
});

const reveals=document.querySelectorAll(".reveal");
const revealObserver=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");revealObserver.unobserve(e.target)}});
},{threshold:.08});
reveals.forEach(e=>revealObserver.observe(e));

document.querySelectorAll(".tilt").forEach(el=>{
  el.addEventListener("pointermove",e=>{
    if(window.innerWidth<900)return;
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    el.style.transform=`perspective(800px) rotateX(${y*-5}deg) rotateY(${x*7}deg) translateY(-2px)`;
  });
  el.addEventListener("pointerleave",()=>el.style.transform="");
});
