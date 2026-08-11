// Simple JS for offers modal and interactions
(function(){
  const offers = document.getElementById('offersModal');
  const openBtns = [document.getElementById('offersBtn'), document.getElementById('offersBtn2')].filter(Boolean);
  const closeBtn = document.getElementById('closeOffers');

  function openModal(){
    offers.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    offers.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  openBtns.forEach(b=>b.addEventListener('click', openModal));
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  offers.addEventListener('click', e=>{ if(e.target===offers) closeModal(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

  // If logo image missing, show SVG fallback animation
  const logoImg = document.getElementById('logoImg');
  const svg = document.querySelector('.logo-svg');
  if(logoImg){
    logoImg.onerror = () => {
      logoImg.style.display = 'none';
      svg.style.opacity = 1;
      svg.style.filter = 'url(#glow)';
      svg.style.animation = 'svgGlow 2.6s ease-in-out infinite';
    };
  }

  const sections = document.querySelectorAll('.info');
  const reveal = () => {
    const trigger = window.innerHeight * 0.85;
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if(top < trigger) section.classList.add('visible');
    });
  };
  reveal();
  window.addEventListener('scroll', reveal);
})();

/* small SVG glow keyframe (applied dynamically to fallback) */
const style = document.createElement('style');
style.textContent = `@keyframes svgGlow{0%{transform:scale(1);opacity:0.85}50%{transform:scale(1.02);opacity:1}100%{transform:scale(1);opacity:0.85}}`;
document.head.appendChild(style);
