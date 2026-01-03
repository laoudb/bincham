
/* BINCHAM One-Pager — interactions premium (white + dark green theme) */
const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));

/* Smooth scroll */
function smoothTo(target){
  const el = typeof target === "string" ? $(target) : target;
  if(!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 86;
  window.scrollTo({top, behavior:"smooth"});
}
$$("[data-scroll]").forEach(b=>b.addEventListener("click", ()=>smoothTo(b.dataset.scroll)));

/* Nav anchor smooth */
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener("click", (e)=>{
    const href = a.getAttribute("href");
    if(href && href.length > 1){
      const el = $(href);
      if(el){
        e.preventDefault();
        smoothTo(el);
        closeMobile();
      }
    }
  });
});

/* Mobile menu */
const burger = $("#burger");
const mobileMenu = $("#mobileMenu");
function openMobile(){
  mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
  mobileMenu.classList.add("open");
}
function closeMobile(){
  mobileMenu.style.maxHeight = "0px";
  mobileMenu.classList.remove("open");
}
if(burger && mobileMenu){
  burger.addEventListener("click", ()=>{
    mobileMenu.classList.contains("open") ? closeMobile() : openMobile();
  });
}

/* Reveal on scroll */
(function reveal(){
  const els = $$(".reveal");
  if(!els.length) return;
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  }, {threshold: .14});
  els.forEach(el=>io.observe(el));
})();

/* Top progress bar */
(function progress(){
  const bar = $("#topProgress");
  if(!bar) return;
  const onScroll = ()=>{
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h <= 0 ? 0 : (window.scrollY / h) * 100;
    bar.style.width = Math.min(100, Math.max(0, p)) + "%";
  };
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();
})();

/* Toast */
function toast(msg){
  const t = $("#toast");
  if(!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>t.classList.remove("show"), 3200);
}

/* Counters */
(function counters(){
  const els = $$("[data-count]");
  if(!els.length) return;

  const animate = (el)=>{
    const to = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const dur = 1100;
    const start = performance.now();
    const from = 0;
    const tick = (t)=>{
      const p = Math.min(1, (t-start)/dur);
      const eased = 1 - Math.pow(1-p, 3);
      const v = Math.round(from + (to-from)*eased);
      el.textContent = v + suffix;
      if(p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        animate(e.target);
        io.unobserve(e.target);
      }
    });
  }, {threshold: .6});

  els.forEach(el=>io.observe(el));
})();

/* Ring animation */
(function ring(){
  const ring = $(".ring");
  if(!ring) return;
  const val = Number(ring.dataset.ring || 0); // 0-100
  const fg = $(".ring-fg", ring);
  const circ = 2 * Math.PI * 50; // r=50
  fg.style.strokeDasharray = circ.toFixed(0);
  fg.style.strokeDashoffset = circ.toFixed(0);

  const animate = ()=>{
    const targetOffset = circ * (1 - val/100);
    const start = performance.now();
    const from = circ;
    const to = targetOffset;
    const dur = 1200;
    const tick = (t)=>{
      const p = Math.min(1, (t-start)/dur);
      const eased = 1 - Math.pow(1-p, 3);
      const cur = from + (to-from)*eased;
      fg.style.strokeDashoffset = cur.toFixed(2);
      if(p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        animate();
        io.unobserve(e.target);
      }
    });
  }, {threshold: .5});
  io.observe(ring);
})();

/* FAQ accordion */
(function faq(){
  $$(".acc").forEach(acc=>{
    const h = $(".acc-h", acc);
    if(!h) return;
    h.addEventListener("click", ()=>{
      const open = acc.classList.contains("open");
      $$(".acc.open").forEach(a=>{
        if(a !== acc) a.classList.remove("open");
      });
      acc.classList.toggle("open", !open);
    });
  });
})();

/* Testimonials slider */
(function slider(){
  const root = $("#slider");
  if(!root) return;
  const slides = $(".t-slides", root);
  const dots = $$(".dot", root);
  let i = 0;

  const go = (idx)=>{
    i = (idx + dots.length) % dots.length;
    slides.style.transform = `translateX(${-i*100}%)`;
    dots.forEach((d,di)=>d.classList.toggle("active", di===i));
  };
  dots.forEach((d,di)=>d.addEventListener("click", ()=>go(di)));
  setInterval(()=>go(i+1), 6500);
})();

/* Contact form (mock) */
(function contact(){
  const f = $("#contactForm");
  if(!f) return;
  f.addEventListener("submit", (e)=>{
    e.preventDefault();
    toast("✅ Message prêt à être envoyé. Branche ton backend/email pour l’envoi réel.");
    f.reset();
  });

  const copyBtn = $("#copyEmail");
  if(copyBtn){
    copyBtn.addEventListener("click", async ()=>{
      const email = ($("#emailText")?.textContent || "contact@bincham.fr").trim();
      try{
        await navigator.clipboard.writeText(email);
        toast("📋 Email copié : " + email);
      }catch{
        toast("Copie impossible (navigateur). Email : " + email);
      }
    });
  }
})();

/* Modal */
(function modal(){
  const openBtn = $("#openVideo");
  const modal = $("#modal");
  if(!modal) return;

  const open = ()=>{ modal.classList.add("show"); modal.setAttribute("aria-hidden","false"); };
  const close = ()=>{ modal.classList.remove("show"); modal.setAttribute("aria-hidden","true"); };

  if(openBtn) openBtn.addEventListener("click", open);
  modal.addEventListener("click", (e)=>{
    if(e.target && e.target.hasAttribute("data-close")) close();
  });

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") close();
  });

  // close buttons inside
  $$("[data-close]", modal).forEach(b=>b.addEventListener("click", close));
})();

/* Year 
$("#year").textContent = new Date().getFullYear();*/

/* Particles (subtle, white background friendly) */
(function particles(){
  const c = $("#particles");
  if(!c) return;
  const ctx = c.getContext("2d");

  let w=0,h=0,pts=[];
  const DPR = Math.min(2, window.devicePixelRatio || 1);

  const resize = ()=>{
    w = c.clientWidth;
    h = c.clientHeight;
    c.width = Math.floor(w * DPR);
    c.height = Math.floor(h * DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);
  };

  const rand = (a,b)=>a + Math.random()*(b-a);

  const seed = ()=>{
    const n = Math.max(40, Math.floor((w*h)/22000));
    pts = Array.from({length:n}, ()=>({x:rand(0,w), y:rand(0,h), vx:rand(-.18,.18), vy:rand(-.14,.14), r:rand(1.3,2.8)}));
  };

  const draw = ()=>{
    ctx.clearRect(0,0,w,h);

    // soft green tint in corners
    const g1 = ctx.createRadialGradient(w*0.2,h*0.15,10,w*0.2,h*0.15,Math.max(w,h));
    g1.addColorStop(0,"rgba(22,138,99,.10)");
    g1.addColorStop(1,"rgba(255,255,255,0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0,0,w,h);

    for(const p of pts){
      p.x += p.vx; p.y += p.vy;
      if(p.x < -20) p.x = w+20;
      if(p.x > w+20) p.x = -20;
      if(p.y < -20) p.y = h+20;
      if(p.y > h+20) p.y = -20;

      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = "rgba(10,59,46,.18)";
      ctx.fill();
    }

    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const a=pts[i], b=pts[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const d=Math.hypot(dx,dy);
        if(d<140){
          const alpha = (1 - d/140) * .16;
          ctx.strokeStyle = `rgba(22,138,99,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  };

  window.addEventListener("resize", ()=>{ resize(); seed(); });

  resize();
  seed();
  draw();
})();




/* Extra modals for CTA buttons (keep same site behavior) */
(function extraModals(){
  const modal = $("#modal");
  const body = $("#modalBody");
  const titleEl = $("#modalTitle");
  const openBtns = $$("[data-modal]");

  if(!modal || !body || !titleEl) return;

  const defaultTitle = titleEl.textContent;
  const defaultBodyHTML = body.innerHTML;

  
  const formTemplate = (whoLabel)=>`
    <div class="fake-video">
      <div class="play">✉</div>
      <div class="fake-captions" style="margin-top:12px">
        <div class="cap"><strong>${whoLabel}</strong> — en 30 secondes : infos clés et on te recontacte.</div>
      </div>
    </div>

    <form class="form js-modal-form" style="margin-top:12px">
      <div class="f-row">
        <div class="field">
          <label>Nom</label>
          <input name="name" placeholder="Ton nom" required />
        </div>
        <div class="field">
          <label>Email</label>
          <input type="email" name="email" placeholder="ton@email.fr" required />
        </div>
      </div>

      <div class="f-row">
        <div class="field">
          <label>${whoLabel.includes("freelance") ? "Spécialité" : "Besoin / rôle"}</label>
          <input name="role" placeholder="${whoLabel.includes("freelance") ? "Ex: DevOps / Réseau / Cyber" : "Ex: Ingénieur réseau, DevOps"}" required />
        </div>
        <div class="field">
          <label>Quand ?</label>
          <select name="urgency" required>
            <option value="standard">1–2 semaines</option>
            <option value="rapide">Quelques jours</option>
            <option value="critique">Immédiat</option>
          </select>
        </div>
      </div>

      <div class="field">
        <label>Message (optionnel)</label>
        <textarea name="message" placeholder="Contexte, contraintes, stack/outils, dates…"></textarea>
      </div>

      <div class="consent">
        <input type="checkbox" id="modalConsent" required />
        <label for="modalConsent">J’accepte d’être recontacté (RGPD).</label>
      </div>

      <div class="form-actions">
        <button class="btn primary" type="submit">Envoyer</button>
        <button class="btn" type="button" data-close>Fermer</button>
      </div>

      <p class="fine">Envoi “mock” ici. Branche ton backend/email pour l’envoi réel.</p>
    </form>
  `;
const open = (key)=>{
    if(key === "entreprise"){
      titleEl.textContent = "Je cherche un freelance — contact rapide";
      body.innerHTML = formTemplate("Je cherche un freelance");
    }else if(key === "freelance"){
      titleEl.textContent = "Je suis freelance — candidater";
      body.innerHTML = formTemplate("Je suis freelance");
    }

    // Hook submit for modal form (mock)
    $$(".js-modal-form", body).forEach(f=>{
      f.addEventListener("submit", (e)=>{
        e.preventDefault();
        toast("✅ Message prêt à être envoyé. Branche ton backend/email pour l’envoi réel.");
        f.reset();
      });
    });

    modal.classList.add("show");
    modal.setAttribute("aria-hidden","false");
  };

  // Buttons open their modal (no scroll)
  openBtns.forEach(b=> b.addEventListener("click", ()=>open(b.dataset.modal)));

  // Restore default modal content when opening the method popup
  const methodBtn = $("#openVideo");
  if(methodBtn){
    methodBtn.addEventListener("click", ()=>{
      titleEl.textContent = defaultTitle;
      body.innerHTML = defaultBodyHTML;
      // re-wire close buttons inside restored body (they already have [data-close])
      $$("[data-close]", modal).forEach(btn=>btn.addEventListener("click", ()=>{
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden","true");
      }));
    });
  }
})();



/* Founder popup – final fixed */
(function(){
  const norm = s => (s||"").trim().toLowerCase();
  const trigger = [...document.querySelectorAll("button,a")].find(e => norm(e.textContent)==="présentation du fondateur");
  const modal = document.getElementById("modal");
  const body = document.getElementById("modalBody") || modal.querySelector(".modal-body");

  if(!trigger || !modal || !body) return;

  const original = body.innerHTML;

  trigger.addEventListener("click", e => {
    e.preventDefault();
    e.stopImmediatePropagation();
    modal.classList.add("founder-mode");
    body.innerHTML = `<div class="founder-popup" style="max-height:70vh; overflow-y:auto; padding-right:6px;">
  <div class="founder-photo-wrap">
    <div class="founder-halo"></div>
    <img src="assets/mohamed-belaoud-clean.jpg" alt="Mohamed Belaoud" />
  </div>

 

  <p style="margin:0; color: var(--muted); line-height:1.65; font-size:16px;">

	Diplômé ingénieur en systèmes d’information par l’EPF en 2020, puis spécialisé en réseaux à l’Université Paris Dauphine, 
	j’ai bâti mon parcours en tant qu’indépendant au cœur d’organisations à forts enjeux. J’ai accompagné des groupes 
	internationaux tels que Safran, Crédit Agricole et Airbus, en France comme à Singapour, ainsi qu’une PME industrielle de 
	référence, Socofer.<br>
    BINCHAM est l’aboutissement de cette expérience terrain : une approche sélective et exigeante pour sécuriser vos projets 
	avec les bons experts, au bon moment.
  </p>

  <div class="founder-signature-wrap">
 
  </div>

  <div style="margin-top:6px; text-align:center;">
    <img src="assets/signature.jpg" alt="Signature" style="max-width:140px; width:100%; height:auto; opacity:.9;" />
  </div>

</div>`;
    modal.classList.add("show");
  }, true);

  modal.addEventListener("click", e => {
    if(e.target.closest("[data-close]")){
      modal.classList.remove("founder-mode");
      body.innerHTML = original;
      modal.classList.remove("show");
    }
  });
})();



/* Founder popup — ensure header close works + remove extra close */
(function(){
  const modal = document.getElementById("modal");
  if(!modal) return;

  // Many templates use a button with class "x" in the header
  const headerClose = modal.querySelector(".x, .close, .modal-close, button[aria-label='Fermer'], button[aria-label='Close']");
  const body = document.getElementById("modalBody") || modal.querySelector(".modal-body, .sheet-body");
  if(!body) return;

  function closeFounder(){
    if(!modal.classList.contains("founder-mode")) return;
    // Trigger existing backdrop close by simulating click on backdrop if it has data-close
    const backdrop = modal.querySelector("[data-close]");
    if(backdrop) backdrop.click();
    else modal.classList.remove("show");
  }

  if(headerClose && !headerClose.__binchamBound){
    headerClose.__binchamBound = true;
    headerClose.addEventListener("click", (e)=>{
      if(modal.classList.contains("founder-mode")){
        e.preventDefault();
        e.stopPropagation();
        closeFounder();
      }
    }, true);
  }
})();

