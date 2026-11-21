const menuToggle=document.getElementById("menuToggle");
const navMenu=document.getElementById("navMenu");
menuToggle?.addEventListener("click",()=>{const open=navMenu.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open));menuToggle.innerHTML=open?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>';});
navMenu?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{navMenu.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");menuToggle.innerHTML='<i class="fa-solid fa-bars"></i>';}));
const roles=["BCA Student","Aspiring Data Analyst","Web Developer","Lifelong Learner"];
const roleEl=document.getElementById("dynamic-text");let roleIndex=0,charIndex=0,deleting=false;
function typeRole(){if(!roleEl)return;const word=roles[roleIndex];roleEl.textContent=word.slice(0,charIndex);if(!deleting&&charIndex<word.length){charIndex++;setTimeout(typeRole,85);}else if(!deleting){deleting=true;setTimeout(typeRole,1150);}else if(charIndex>0){charIndex--;setTimeout(typeRole,42);}else{deleting=false;roleIndex=(roleIndex+1)%roles.length;setTimeout(typeRole,250);}}
typeRole();
document.getElementById("year").textContent=new Date().getFullYear();
document.getElementById("contactForm")?.addEventListener("submit",event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const data=new FormData(form);const name=String(data.get("name")).trim();const email=String(data.get("email")).trim();const subject=String(data.get("subject")).trim();const message=String(data.get("message")).trim();const body=`Name: ${name}\nEmail: ${email}\n\n${message}`;const mailto="mailto:omdugane25@gmail.com?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);document.getElementById("formNote").textContent="Your email app should open with the message prepared. Review it and press Send.";window.location.href=mailto;});
// Theme preference toggle (stored locally in this browser)
const themeToggle=document.getElementById("themeToggle");
const savedTheme=localStorage.getItem("om-portfolio-theme");
if(savedTheme==="light")document.body.classList.add("light-theme");
function updateThemeIcon(){if(themeToggle)themeToggle.innerHTML=document.body.classList.contains("light-theme")?'<i class="fa-solid fa-moon"></i>':'<i class="fa-solid fa-sun"></i>';}
updateThemeIcon();
themeToggle?.addEventListener("click",()=>{document.body.classList.toggle("light-theme");localStorage.setItem("om-portfolio-theme",document.body.classList.contains("light-theme")?"light":"dark");updateThemeIcon();});
// Project category filtering
const filterButtons=document.querySelectorAll(".filter-button");
const projectCards=document.querySelectorAll(".project-card[data-category]");
filterButtons.forEach(button=>button.addEventListener("click",()=>{const filter=button.dataset.filter;filterButtons.forEach(item=>{const active=item===button;item.classList.toggle("active",active);item.setAttribute("aria-pressed",String(active));});projectCards.forEach(card=>{const show=filter==="all"||card.dataset.category===filter;card.classList.toggle("is-hidden",!show);});}));
// Reading progress and back-to-top control
const progress=document.getElementById("scrollProgress");const toTop=document.getElementById("toTop");
function updateScrollUI(){const max=document.documentElement.scrollHeight-window.innerHeight;const percent=max>0?(window.scrollY/max)*100:0;if(progress)progress.style.width=percent+"%";toTop?.classList.toggle("visible",window.scrollY>450);}
window.addEventListener("scroll",updateScrollUI,{passive:true});updateScrollUI();
toTop?.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

// Print a clean one-page résumé; the browser can save it as PDF.
document.getElementById("printResume")?.addEventListener("click",()=>window.print());
