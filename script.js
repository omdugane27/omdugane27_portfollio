(() => {
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

  // Highlight current section in navigation
  const navLinks=$$("#nav a[href^='#']");
  const sections=navLinks.map(link=>$(link.getAttribute("href"))).filter(Boolean);
  if("IntersectionObserver" in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+entry.target.id));}}),{rootMargin:"-35% 0px -55% 0px"});
    sections.forEach(section=>observer.observe(section));
  }
})();
