const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const burger=$('.burger'), mobileMenu=$('.mobile-menu'), nav=$('.nav');
if(burger&&mobileMenu){
  burger.addEventListener('click',()=>{
    const open=mobileMenu.classList.toggle('open');
    burger.classList.toggle('is-open',open);
    mobileMenu.setAttribute('aria-hidden',String(!open));
    burger.setAttribute('aria-label',open?'Fermer le menu':'Menu');
  });
  $$('a',mobileMenu).forEach(a=>a.addEventListener('click',()=>{
    mobileMenu.classList.remove('open');
    burger.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden','true');
    burger.setAttribute('aria-label','Menu');
  }));
}
window.addEventListener('scroll',()=>nav?.classList.toggle('scrolled',window.scrollY>10),{passive:true});

const path=location.pathname.split('/').pop()||'index.html';
$$('.menu a, .mobile-menu a').forEach(a=>{const href=(a.getAttribute('href')||'').split('#')[0];if(href===path)a.classList.add('active');});






$$('.card,.stat,.insight-card,.step,.quote-card,.cta-panel,.logo-item')
  .forEach(el=>el.classList.add('reveal'));





const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target);}}),{threshold:.14});
$$('.reveal').forEach(el=>io.observe(el));

$$('.stat-num[data-target]').forEach(el=>{
  const target=Number(el.dataset.target||0), suffix=el.dataset.suffix||''; let started=false;
  const run=()=>{if(started)return;started=true;const start=performance.now(),dur=1200;
    const tick=now=>{const p=Math.min((now-start)/dur,1), eased=1-Math.pow(1-p,3);el.textContent=Math.round(target*eased)+suffix;if(p<1)requestAnimationFrame(tick);};
    requestAnimationFrame(tick);
  };
  const statIO=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){run();statIO.disconnect();}}),{threshold:.45});
  statIO.observe(el);
});



(function(){
  const wrap=document.createElement('div');
  wrap.className='cyber-bg';
  wrap.setAttribute('aria-hidden','true');
  const canvas=document.createElement('canvas');
  wrap.appendChild(canvas);
  document.body.prepend(wrap);
  const ctx=canvas.getContext('2d');
  let w=0,h=0,dpr=Math.min(window.devicePixelRatio||1,2),tick=0;
  const streams=[];
  const sparks=[];
  const symbols=['0','1','{','}','<','>','/','_','=','[',']',';'];
  function makeText(){
    return Array.from({length:10+Math.floor(Math.random()*18)},()=>symbols[Math.floor(Math.random()*symbols.length)]).join(' ');
  }
  function resize(){
    w=window.innerWidth; h=window.innerHeight;
    canvas.width=Math.floor(w*dpr); canvas.height=Math.floor(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    streams.length=0; sparks.length=0;
    const count=Math.max(16,Math.min(28,Math.floor(w/70)));
    for(let i=0;i<count;i++){
      streams.push({
        x:Math.random()*w,
        y:Math.random()*h,
        len:180+Math.random()*280,
        speed:.35+Math.random()*.9,
        alpha:.18+Math.random()*.18,
        drift:(Math.random()-.5)*0.18,
        text:makeText(),
        flip:0
      });
    }
    const sparkCount=Math.max(12,Math.min(22,Math.floor(w/90)));
    for(let i=0;i<sparkCount;i++){
      sparks.push({
        x:Math.random()*w,
        y:Math.random()*h,
        r:1.2+Math.random()*2.1,
        vx:(Math.random()-.5)*.12,
        vy:(Math.random()-.5)*.12,
        a:.08+Math.random()*.12
      });
    }
  }
  function render(){
    tick += 0.008;
    ctx.clearRect(0,0,w,h);

    const g1=ctx.createRadialGradient(w*0.18,h*0.12,0,w*0.18,h*0.12,Math.max(w,h)*0.42);
    g1.addColorStop(0,'rgba(70,150,255,.10)');
    g1.addColorStop(1,'rgba(70,150,255,0)');
    ctx.fillStyle=g1; ctx.fillRect(0,0,w,h);

    const g2=ctx.createRadialGradient(w*0.85,h*0.22,0,w*0.85,h*0.22,Math.max(w,h)*0.32);
    g2.addColorStop(0,'rgba(75,220,255,.08)');
    g2.addColorStop(1,'rgba(75,220,255,0)');
    ctx.fillStyle=g2; ctx.fillRect(0,0,w,h);

    for(const s of sparks){
      s.x += s.vx; s.y += s.vy;
      if(s.x<0) s.x=w; if(s.x>w) s.x=0;
      if(s.y<0) s.y=h; if(s.y>h) s.y=0;
      ctx.beginPath();
      ctx.fillStyle=`rgba(130,225,255,${s.a})`;
      ctx.shadowBlur=10; ctx.shadowColor='rgba(90,210,255,.22)';
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
      ctx.shadowBlur=0;
    }

    const pulse=(Math.sin(tick*2)+1)/2;
    for(const l of streams){
      l.y += l.speed;
      l.x += Math.sin((l.y*0.008)+tick)*l.drift;
      if(l.y-l.len>h+80){
        l.y=-60; l.x=Math.random()*w; l.text=makeText();
      }
      const alpha=l.alpha + pulse*0.06;
      const grad=ctx.createLinearGradient(l.x,l.y,l.x,l.y-l.len);
      grad.addColorStop(0,`rgba(160,240,255,${alpha+0.14})`);
      grad.addColorStop(.35,`rgba(95,210,255,${alpha})`);
      grad.addColorStop(1,'rgba(95,210,255,0)');
      ctx.strokeStyle=grad;
      ctx.lineWidth=1.35;
      ctx.beginPath();
      ctx.moveTo(l.x,l.y);
      ctx.lineTo(l.x,l.y-l.len);
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle=`rgba(185,245,255,${alpha+0.18})`;
      ctx.shadowBlur=14; ctx.shadowColor='rgba(120,225,255,.30)';
      ctx.arc(l.x,l.y,1.9,0,Math.PI*2);
      ctx.fill();
      ctx.shadowBlur=0;

      ctx.fillStyle=`rgba(160,235,255,${alpha*.82})`;
      ctx.font='12px monospace';
      ctx.save();
      ctx.translate(l.x+10,l.y-l.len*0.45);
      ctx.rotate(-Math.PI/2);
      ctx.fillText(l.text,0,0);
      ctx.restore();

      l.flip += 1;
      if(l.flip>140){ l.flip=0; l.text=makeText(); }
    }
    requestAnimationFrame(render);
  }
  resize(); render();
  window.addEventListener('resize',resize,{passive:true});
})();