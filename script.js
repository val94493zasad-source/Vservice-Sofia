(function(){
  'use strict';

  const $ = (id) => document.getElementById(id);
  const offers = $('offersModal');
  const booking = $('bookingModal');
  const contact = $('contactModal');
  const bookingForm = $('bookingForm');
  const bookingStatus = $('bookingStatus');
  const draftKey = 'vserviceBookingDraft';

  function openModal(modal){
    if(!modal) return;
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    const focusable = modal.querySelector('button,input,a');
    if(focusable) setTimeout(() => focusable.focus(), 0);
  }

  function closeModal(modal){
    if(!modal) return;
    modal.setAttribute('aria-hidden','true');
    const anyOpen = document.querySelector('.modal[aria-hidden="false"]');
    if(!anyOpen) document.body.style.overflow = '';
  }

  [$('offersBtn'), $('offersBtn2')].filter(Boolean).forEach(btn => {
    btn.addEventListener('click', () => openModal(offers));
  });
  $('bookingBtn')?.addEventListener('click', () => {
    openModal(booking);
    loadBookingDraft();
  });
  $('contactBtn')?.addEventListener('click', () => openModal(contact));

  $('closeOffers')?.addEventListener('click', () => closeModal(offers));
  $('closeBooking')?.addEventListener('click', () => closeModal(booking));
  $('closeContact')?.addEventListener('click', () => closeModal(contact));

  [offers, booking, contact].filter(Boolean).forEach(modal => {
    modal.addEventListener('click', (event) => {
      if(event.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', (event) => {
    if(event.key === 'Escape') {
      [offers, booking, contact].forEach(closeModal);
    }
  });

  function loadBookingDraft(){
    if(!bookingForm) return;
    try{
      const raw = localStorage.getItem(draftKey);
      if(!raw) return;
      const draft = JSON.parse(raw);
      ['name','email','phone','date','time'].forEach((field) => {
        const input = bookingForm.elements[field];
        if(input && draft[field]) input.value = draft[field];
      });
      if(bookingStatus) bookingStatus.textContent = 'Черновата е заредена от браузъра.';
    } catch(error){
      console.warn('Неуспешно зареждане на черновата:', error);
    }
  }

  function saveBookingDraft(){
    if(!bookingForm) return;
    const draft = {};
    ['name','email','phone','date','time'].forEach((field) => {
      draft[field] = bookingForm.elements[field]?.value || '';
    });
    try{
      localStorage.setItem(draftKey, JSON.stringify(draft));
      if(bookingStatus) bookingStatus.textContent = 'Черновата е запазена локално в този браузър.';
    } catch(error){
      if(bookingStatus) bookingStatus.textContent = 'Браузърът не позволи записването на чернова.';
    }
  }

  $('saveDraftBtn')?.addEventListener('click', saveBookingDraft);

  if(bookingForm){
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if(!bookingForm.reportValidity()) return;

      const data = new FormData(bookingForm);
      const subject = encodeURIComponent('Запазване на проверка от V Service');
      const body = encodeURIComponent(
        `Име: ${data.get('name')}\n` +
        `Имейл: ${data.get('email')}\n` +
        `Телефон: ${data.get('phone')}\n` +
        `Дата: ${data.get('date')}\n` +
        `Час: ${data.get('time')}`
      );

      if(bookingStatus) bookingStatus.textContent = 'Отваряме вашия имейл клиент…';
      window.location.href = `mailto:valkata_2000@abv.bg?subject=${subject}&body=${body}`;
    });
  }

  const bookingDate = $('bookingDate');
  if(bookingDate){
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0,10);
    bookingDate.min = localDate;
  }

  const logoImg = $('logoImg');
  const svg = document.querySelector('.logo-svg');
  if(logoImg && svg){
    const showFallback = () => {
      logoImg.style.display = 'none';
      svg.style.opacity = '1';
      svg.style.filter = 'url(#glow)';
      svg.style.animation = 'svgGlow 2.6s ease-in-out infinite';
    };
    logoImg.addEventListener('error', showFallback);
    if(logoImg.complete && logoImg.naturalWidth === 0) showFallback();
  }

  const sections = document.querySelectorAll('.info');
  if('IntersectionObserver' in window){
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:0.12});
    sections.forEach(section => observer.observe(section));
  } else {
    sections.forEach(section => section.classList.add('visible'));
  }
})();
