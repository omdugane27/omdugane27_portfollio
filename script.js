(() => {
  document.body.classList.add('motion-ready');
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

  // Mobile navigation
  const menuButton=$("#menuToggle"), nav=$("#nav");
  const closeMenu=()=>{nav?.classList.remove("open");menuButton?.setAttribute("aria-expanded","false");menuButton?.setAttribute("aria-label","Open navigation");if(menuButton)menuButton.innerHTML='<i class="fa-solid fa-bars"></i>';};
  menuButton?.addEventListener("click",()=>{const open=nav?.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(!!open));menuButton.setAttribute("aria-label",open?"Close navigation":"Open navigation");menuButton.innerHTML=open?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>';});
  $$("#nav a").forEach(link=>link.addEventListener("click",closeMenu));
  document.addEventListener("keydown",event=>{if(event.key==="Escape")closeMenu();});

  // Project category filtering
  const filters=$$(".filter"), projects=$$(".project[data-category]");
  filters.forEach(button=>button.addEventListener("click",()=>{const selected=button.dataset.filter;filters.forEach(item=>{const active=item===button;item.classList.toggle("active",active);item.setAttribute("aria-pressed",String(active));});projects.forEach(card=>{card.hidden=selected!=="all"&&card.dataset.category!==selected;});}));

  // Scroll progress bar
  const progress=$("#scrollProgress");
  const updateProgress=()=>{const scrollable=document.documentElement.scrollHeight-window.innerHeight;const ratio=scrollable>0?window.scrollY/scrollable:0;if(progress)progress.style.width=Math.max(0,Math.min(100,ratio*100))+"%";};
  window.addEventListener("scroll",updateProgress,{passive:true});window.addEventListener("resize",updateProgress);updateProgress();

  // Print résumé to PDF
  $("#printResume")?.addEventListener("click",()=>window.print());

  // Dynamic copyright year
  const year=$("#year");if(year)year.textContent=String(new Date().getFullYear());

  // Scroll reveal for cinematic section and card entrances
  const revealItems=$('.section, .project, .contact, .hero-bottom');
  revealItems.forEach((item,index)=>{item.classList.add('reveal');if(item.classList.contains('project'))item.style.setProperty('--reveal-delay',(index%3)*90+'ms');});
  if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
    revealItems.forEach(item=>revealObserver.observe(item));
  }else{revealItems.forEach(item=>item.classList.add('is-visible'));}

  // Highlight current section in navigation
  const navLinks=$$("#nav a[href^='#']");
  const sections=navLinks.map(link=>$(link.getAttribute("href"))).filter(Boolean);
  if("IntersectionObserver" in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+entry.target.id));}}),{rootMargin:"-35% 0px -55% 0px"});
    sections.forEach(section=>observer.observe(section));
  }
})();
