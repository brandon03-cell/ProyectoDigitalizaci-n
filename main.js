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

  function spawnCat(bottomOffset, delay) {
    setTimeout(() => {
      const cat = catRunner.cloneNode(true);
      cat.id = '';
      cat.style.bottom = (bottomOffset || 60) + 'px';
      document.body.appendChild(cat);
      void cat.offsetWidth;
      cat.classList.add('run');
      cat.addEventListener('animationend', () => cat.remove());
    }, delay || 0);
  }

  function launchCat() {
    spawnCat(60, 0);
  }

  function spawnFallingCat(leftPct, delay, widthPx) {
    setTimeout(() => {
      const cat = catRunner.cloneNode(true);
      cat.id = '';
      cat.className = 'cat-faller';
      cat.style.left = Math.max(1, Math.min(88, leftPct)) + '%';
      const isBig = !!widthPx;
      const spins = isBig ? 360 : (720 + Math.floor(Math.random() * 3) * 360);
      const dir = Math.random() > 0.5 ? 1 : -1;
      const dur = isBig ? 2.6 : (1.3 + Math.random() * 0.7);
      cat.style.setProperty('--cat-spin', (dir * spins) + 'deg');
      cat.style.setProperty('--cat-dur', dur + 's');
      if (isBig) {
        cat.style.width  = widthPx + 'px';
        cat.style.height = (widthPx / 2) + 'px';
      }
      document.body.appendChild(cat);
      void cat.offsetWidth;
      cat.classList.add('fall');
      cat.addEventListener('animationend', () => cat.remove());
    }, delay);
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
      const rainCount = 16;
      for (let i = 0; i < rainCount; i++) {
        const leftPct = 4 + (i / (rainCount - 1)) * 84 + (Math.random() - 0.5) * 14;
        spawnFallingCat(leftPct, i * 180);
      }
      spawnFallingCat(44, rainCount * 180 + 500, 260);
      konami = [];
    }
  });

  const coverPaw = document.querySelector('.cover-paw');
  let coverPawCount = 0;
  if (coverPaw) {
    coverPaw.addEventListener('click', () => {
      coverPawCount++;
      meowToast.textContent = coverPawCount === 1 ? 'miau ·' : coverPawCount === 2 ? 'miau miau ·' : '✦ miau, has encontrado al gato ✦';
      meowToast.classList.add('show');
      spawnCat(60, 0);
      setTimeout(() => meowToast.classList.remove('show'), 2000);
    });
  }

  const endPaw = document.getElementById('endPaw');
  let endPawCount = 0;
  if (endPaw) {
    endPaw.addEventListener('click', () => {
      endPawCount++;
      for (let i = 0; i < endPawCount; i++) {
        spawnCat(50 + (i % 4) * 22, i * 280);
      }
      const msgs = ['miau ·', 'miau miau ·', 'miau miau miau ·', '✦ invasión gatuna ✦', '✦ catpocalipsis ✦'];
      meowToast.textContent = msgs[Math.min(endPawCount - 1, msgs.length - 1)];
      meowToast.classList.add('show');
      setTimeout(() => meowToast.classList.remove('show'), 2500);
    });
  }

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