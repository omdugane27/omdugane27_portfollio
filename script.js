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


  // Portfolio-wide cinematic reveal: use real NodeLists (not the single-element $ helper).
  const cinemaItems=[];
  document.querySelectorAll("section").forEach((section,index)=>{
    section.classList.add("cinema-reveal");
    section.style.setProperty("--cinema-delay",(index%3)*80+"ms");
    cinemaItems.push(section);
    section.querySelectorAll(".section-kicker, .intro-grid > *, .project, .timeline article, .credential, .skill-list li, .contact-links a, .hero-bottom, .hero-actions .btn, .hero-meta span").forEach((child,i)=>{
      child.classList.add("cinema-child");
      child.style.setProperty("--cinema-delay",(i%5)*60+"ms");
      cinemaItems.push(child);
    });
  });
  const cinemaObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("cinema-in");
        cinemaObserver.unobserve(entry.target);
      }
    });
  },{threshold:0.04,rootMargin:"0px 0px -20px 0px"});
  cinemaItems.forEach(item=>cinemaObserver.observe(item));
  // Keep the round profile image visible and retry the alternate repository portrait on failure.
  const roundPhoto=document.querySelector("#profilePhoto");
  if(roundPhoto){
    roundPhoto.style.visibility="visible";
    roundPhoto.style.opacity="1";
    roundPhoto.addEventListener("error",()=>{
      if(!roundPhoto.dataset.roundFallback){
        roundPhoto.dataset.roundFallback="yes";
        roundPhoto.src="https://raw.githubusercontent.com/omdugane27/omdugane27_portfollio/main/omphoto.jpg";
      }
    });
  }

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

  // Dedicated final cinematic entrances for the intro and every portfolio section.
  const omMotionTargets=[];
  const omSections=[...document.querySelectorAll("section:not(#home)")];
  omSections.forEach((section,index)=>{
    section.classList.add("om-section-target");
    section.style.setProperty("--om-delay",(index%3)*90+"ms");
    omMotionTargets.push(section);
    const children=section.querySelectorAll(".section-kicker, .intro-grid > *, .stat, .project, .timeline-item, .timeline article, .credential, .skill-list li, .contact-links a, .section-heading, .contact > *");
    children.forEach((child,i)=>{
      child.classList.add("om-content-target");
      child.style.setProperty("--om-delay",(i%6)*65+"ms");
      omMotionTargets.push(child);
    });
  });
  const omIntroTargets=document.querySelectorAll("#home .hero-copy, #home .hero-photo-wrap, #home .hero-bottom");
  omIntroTargets.forEach((item,index)=>{
    item.classList.add("om-intro-target");
    item.style.setProperty("--om-intro-delay",index*140+"ms");
  });
  if("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    const omRevealObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("om-revealed");
          omRevealObserver.unobserve(entry.target);
        }
      });
    },{threshold:0.05,rootMargin:"0px 0px -24px 0px"});
    omMotionTargets.forEach(item=>omRevealObserver.observe(item));
  }else{
    omMotionTargets.forEach(item=>item.classList.add("om-revealed"));
  }
  // Ensure portrait visibility and use the alternate file only if the main image fails.
  const omPhoto=document.getElementById("profilePhoto");
  if(omPhoto){
    omPhoto.style.visibility="visible";
    omPhoto.style.opacity="1";
    omPhoto.addEventListener("error",()=>{
      if(!omPhoto.dataset.omFallback){
        omPhoto.dataset.omFallback="1";
        omPhoto.src="https://raw.githubusercontent.com/omdugane27/omdugane27_portfollio/main/omphoto.jpg";
      }
    });
  }

})();

  // V19: add coordinated depth motion to every portfolio section and content type.
  const v19Reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const v19Fine=window.matchMedia("(pointer:fine) and (min-width:801px)").matches;
  const v19Cards=[...document.querySelectorAll(".project,.credential,.stats>div,.finance-card,.grocery-card,.contact-links a,.timeline>*,.skill-list li,.intro-grid>*")];
  v19Cards.forEach((card,index)=>{
    card.classList.add("v19-tilt-card","v19-depth-reveal");
    card.style.setProperty("--v19-delay",(index%6)*65+"ms");
  });
  document.querySelectorAll("section:not(#home):not(#resumePrintArea)").forEach((section,index)=>{
    section.querySelectorAll(".section-heading,.section-kicker,.intro-copy,.contact-orb").forEach(el=>{
      el.classList.add("v19-depth-reveal");
      el.style.setProperty("--v19-delay",(index%4)*80+"ms");
    });
  });
  document.querySelectorAll(".section-heading h2,.section-heading p,.intro h2,.contact h2").forEach(el=>el.classList.add("v19-section-title"));
  document.querySelectorAll(".skill-list li").forEach(el=>el.classList.add("v19-skill-3d"));
  const v19RevealTargets=[...document.querySelectorAll(".v19-depth-reveal,.v19-section-title")];
  if(!v19Reduced&&"IntersectionObserver" in window){
    const v19Observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("v19-in");
          v19Observer.unobserve(entry.target);
        }
      });
    },{threshold:.09,rootMargin:"0px 0px -35px 0px"});
    v19RevealTargets.forEach(el=>v19Observer.observe(el));
  }else v19RevealTargets.forEach(el=>el.classList.add("v19-in"));
  if(!v19Reduced&&v19Fine){
    v19Cards.forEach(card=>{
      card.addEventListener("pointerenter",()=>card.classList.add("v19-hover"));
      card.addEventListener("pointerleave",()=>{
        card.classList.remove("v19-hover");
        card.style.setProperty("--v19-rx","0deg");
        card.style.setProperty("--v19-ry","0deg");
      });
      card.addEventListener("pointermove",event=>{
        const rect=card.getBoundingClientRect();
        const px=(event.clientX-rect.left)/rect.width;
        const py=(event.clientY-rect.top)/rect.height;
        card.style.setProperty("--v19-rx",((.5-py)*4.5).toFixed(2)+"deg");
        card.style.setProperty("--v19-ry",((px-.5)*4.5).toFixed(2)+"deg");
      },{passive:true});
    });
    const v19Hero=document.querySelector(".hero-photo-wrap");
    if(v19Hero){
      v19Hero.addEventListener("pointermove",event=>{
        const rect=v19Hero.getBoundingClientRect();
        const rx=((event.clientY-rect.top)/rect.height-.5)*-3;
        const ry=((event.clientX-rect.left)/rect.width-.5)*3;
        v19Hero.style.transform="perspective(1000px) rotateX("+rx.toFixed(2)+"deg) rotateY("+ry.toFixed(2)+"deg) translateZ(5px)";
      },{passive:true});
      v19Hero.addEventListener("pointerleave",()=>v19Hero.style.transform="");
    }
  }
  document.querySelector(".contact-orb")?.classList.add("v19-contact-orb");
