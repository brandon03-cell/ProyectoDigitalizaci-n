(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  const navList = document.getElementById('navList');
  const currentEl = document.getElementById('currentSlide');
  const totalEl = document.getElementById('totalSlides');
  const progressFill = document.getElementById('progressFill');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const catRunner = document.getElementById('catRunner');
  const meowToast = document.getElementById('meowToast');

  let current = 0;
  let isAnimating = false;
  let countersAnimated = new Set();

  totalEl.textContent = String(total).padStart(2, '0');

  slides.forEach((slide, i) => {
    const title = slide.dataset.title || `Slide ${i + 1}`;
    const li = document.createElement('li');
    li.dataset.idx = i;
    li.innerHTML = `<span class="num">${String(i + 1).padStart(2, '0')}</span><span class="lbl">${title}</span>`;
    li.addEventListener('click', () => goTo(i));
    navList.appendChild(li);
  });

  function goTo(idx) {
    if (isAnimating || idx === current || idx < 0 || idx >= total) return;
    isAnimating = true;

    const prev = current;
    current = idx;

    slides[prev].classList.remove('active');
    if (idx > prev) slides[prev].classList.add('prev');

    setTimeout(() => {
      slides.forEach((s, i) => {
        s.classList.remove('active', 'prev');
        if (i === current) s.classList.add('active');
      });

      updateUI();
      animateSlideCounters(slides[current]);

      setTimeout(() => { isAnimating = false; }, 700);
    }, 50);
  }

  function next() { goTo(Math.min(current + 1, total - 1)); }
  function prev() { goTo(Math.max(current - 1, 0)); }

  function updateUI() {
    navList.querySelectorAll('li').forEach((li, i) => {
      li.classList.toggle('active', i === current);
    });
    currentEl.textContent = String(current + 1).padStart(2, '0');
    const pct = ((current + 1) / total) * 100;
    progressFill.style.width = pct + '%';

    prevBtn.style.opacity = current === 0 ? '0.3' : '1';
    nextBtn.style.opacity = current === total - 1 ? '0.3' : '1';
    prevBtn.style.pointerEvents = current === 0 ? 'none' : 'auto';
    nextBtn.style.pointerEvents = current === total - 1 ? 'none' : 'auto';
  }

  function animateSlideCounters(slide) {
    const counters = slide.querySelectorAll('.num-fluid');
    counters.forEach(el => {
      const id = el.dataset.target + '_' + Array.from(slide.parentNode.children).indexOf(slide);
      if (countersAnimated.has(id)) return;
      countersAnimated.add(id);

      const target = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimal || '0', 10);
      const duration = 1600;
      const start = performance.now();

      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = target * eased;

        if (target >= 1000) {
          el.textContent = Math.round(value).toLocaleString('es-ES');
        } else if (decimals > 0) {
          el.textContent = value.toFixed(decimals);
        } else {
          el.textContent = Math.round(value);
        }

        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      prev();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(total - 1);
    }
  });

  let wheelLock = false;
  window.addEventListener('wheel', (e) => {
    if (wheelLock || isAnimating) return;
    if (Math.abs(e.deltaY) < 30) return;
    wheelLock = true;
    if (e.deltaY > 0) next(); else prev();
    setTimeout(() => { wheelLock = false; }, 900);
  }, { passive: true });

  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(dy) < 50) return;
    if (dy > 0) next(); else prev();
  }, { passive: true });

  slides[0].classList.add('active');
  updateUI();
  animateSlideCounters(slides[0]);

  function launchCat() {
    catRunner.classList.remove('run');
    void catRunner.offsetWidth;
    catRunner.classList.add('run');
  }

  let konami = [];
  const sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight'];

  document.addEventListener('keydown', (e) => {
    konami.push(e.key);
    if (konami.length > sequence.length) konami.shift();
    if (konami.join(',') === sequence.join(',')) {
      meowToast.textContent = '✦ konami unlocked · gato infinito ✦';
      meowToast.classList.add('show');
      setTimeout(() => meowToast.classList.remove('show'), 2500);
      for (let i = 0; i < 5; i++) {
        setTimeout(() => launchCat(), i * 800);
      }
      konami = [];
    }
  });

  const paws = document.querySelectorAll('.cover-paw, .end-paw');
  let pawCount = 0;
  paws.forEach(paw => {
    paw.addEventListener('click', () => {
      pawCount++;
      meowToast.textContent = pawCount < 3 ? 'miau ·' : pawCount < 6 ? 'miau miau ·' : '✦ miau, has encontrado al gato ✦';
      meowToast.classList.add('show');
      launchCat();
      setTimeout(() => meowToast.classList.remove('show'), 2000);
    });
  });

  const scaleNum = document.getElementById('scaleNum');
  if (scaleNum) {
    const values = ['3.2', '2.8', '1.9', '1.5', '1.1', '0.9', '1.4'];
    let idx = 0;
    setInterval(() => {
      if (!slides[current].classList.contains('slide-sustain')) return;
      idx = (idx + 1) % values.length;
      scaleNum.innerHTML = values[idx] + ' <small>kg</small>';
    }, 1800);
  }

  const stackCards = Array.from(document.querySelectorAll('.erp-stack .stack-card'));
  if (stackCards.length) {
    let lockedIdx = 0;

    function applyAccordion(expandedIdx) {
      stackCards.forEach((c, i) => {
        c.classList.toggle('stack-expanded', i === expandedIdx);
        c.classList.toggle('stack-compressed', i !== expandedIdx);
      });
    }

    applyAccordion(lockedIdx);

    stackCards.forEach((card, idx) => {
      card.addEventListener('mouseenter', () => applyAccordion(idx));
      card.addEventListener('click', () => {
        lockedIdx = idx;
        applyAccordion(lockedIdx);
      });
    });

    const erpStack = document.querySelector('.erp-stack');
    erpStack.addEventListener('mouseleave', () => applyAccordion(lockedIdx));
  }

  console.log('%c   /\\_/\\  ', 'color:#FFDB00;font-size:14px');
  console.log('%c  ( o.o ) ', 'color:#FFDB00;font-size:14px');
  console.log('%c   > ^ <  ', 'color:#FFDB00;font-size:14px');
  console.log('%cIKEA · Transformación Digital · Hay un gato escondido. Click en la patita.', 'color:#0058A3;font-style:italic;');
})();