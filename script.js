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

  // Add distinctive motion hooks to the cinematic portfolio elements
  $('.hero')?.classList.add('cinematic-hero');
  $('.photo-frame')?.classList.add('orbit-frame');
  $$('.hero-actions .btn').forEach((button,index)=>button.classList.add(index===0?'button-trail':'button-glint'));
  $$('.project-visual').forEach((visual,index)=>{visual.classList.add('visual-motion');visual.style.setProperty('--visual-delay',(index*110)+'ms');});

  // Scroll reveal for cinematic section and card entrances
  const revealItems=Array.from(document.querySelectorAll('.section, .intro, .stats, .project, .experience-grid, .timeline, .credentials-grid, .skills, .contact, .hero-bottom'));
  const motionTargets=Array.from(document.querySelectorAll('.section-heading, .intro-text, .stat, .project-info, .timeline-item, .credential, .skill-list, .contact-links a'));
  revealItems.forEach((item,index)=>{item.classList.add('reveal');item.style.setProperty('--motion-delay',(index%4)*75+'ms');if(item.classList.contains('project'))item.style.setProperty('--reveal-delay',(index%3)*90+'ms');});
  motionTargets.forEach((item,index)=>{item.classList.add('reveal-child');item.style.setProperty('--motion-delay',(index%5)*55+'ms');});
  if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
    revealItems.concat(motionTargets).forEach(item=>revealObserver.observe(item));
  }else{revealItems.concat(motionTargets).forEach(item=>item.classList.add('is-visible'));}

  // Highlight current section in navigation
  const navLinks=$$("#nav a[href^='#']");
  const sections=navLinks.map(link=>$(link.getAttribute("href"))).filter(Boolean);
  if("IntersectionObserver" in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+entry.target.id));}}),{rootMargin:"-35% 0px -55% 0px"});
    sections.forEach(section=>observer.observe(section));
  }

  // Reliable whole-portfolio motion: visible by default, animate once as each item enters view.
  const allMotionTargets=$$('.hero-bottom, .section, .section-kicker, .intro-grid > *, .stat, .project, .timeline article, .credential, .skill-list li, .contact-links a, .contact > *');
  allMotionTargets.forEach((item,index)=>{item.classList.add('portfolio-motion');item.style.setProperty('--portfolio-motion-delay',(index%4)*65+'ms');});
  if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const portfolioMotionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('portfolio-motion-in');portfolioMotionObserver.unobserve(entry.target);}
    }),{threshold:0.08,rootMargin:'0px 0px -30px 0px'});
    allMotionTargets.forEach(item=>portfolioMotionObserver.observe(item));
  }else{allMotionTargets.forEach(item=>item.classList.add('portfolio-motion-in'));}

  // Final reliable viewport entrance system for every portfolio section.
  const finalSections=[...document.querySelectorAll("section")];
  const finalMotionItems=[];
  finalSections.forEach((section,index)=>{
    section.classList.add("portfolio-enter");
    section.style.setProperty("--enter-delay",(index%3)*70+"ms");
    finalMotionItems.push(section);
    const children=section.querySelectorAll(".section-kicker, .section-heading, .intro-grid > *, .project, .timeline article, .credential, .skill-list li, .contact-links a, .hero-bottom, .hero-actions .btn, .hero-meta span");
    children.forEach((item,i)=>{
      item.classList.add("portfolio-child");
      item.style.setProperty("--enter-delay",(i%5)*55+"ms");
      finalMotionItems.push(item);
    });
  });
  if("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    const finalEntranceObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("motion-entered");
          finalEntranceObserver.unobserve(entry.target);
        }
      });
    },{threshold:0.06,rootMargin:"0px 0px -35px 0px"});
    finalMotionItems.forEach(item=>finalEntranceObserver.observe(item));
  }else{
    finalMotionItems.forEach(item=>item.classList.add("motion-entered"));
  }
  // Make portrait visible if the primary repository image fails; use the known secondary image.
  const finalPortrait=document.querySelector("#profilePhoto");
  if(finalPortrait){
    finalPortrait.addEventListener("error",()=>{
      if(!finalPortrait.dataset.fallbackUsed){
        finalPortrait.dataset.fallbackUsed="true";
        finalPortrait.src="https://raw.githubusercontent.com/omdugane27/omdugane27_portfollio/main/omphoto.jpg";
      }
    });
    finalPortrait.addEventListener("load",()=>{finalPortrait.style.visibility="visible";finalPortrait.style.opacity="1";});
  }
})();
