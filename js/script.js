(function initErgonomicSimulator() {
  const tensionSlider = document.getElementById('tension-slider');
  const lumbarSlider = document.getElementById('lumbar-slider');
  const tensionVal = document.getElementById('tension-val');
  const lumbarVal = document.getElementById('lumbar-val');

  const metricNeutrality = document.getElementById('metric-neutrality');
  const metricStrain = document.getElementById('metric-strain');
  const metricFatigue = document.getElementById('metric-fatigue');

  const barNeutrality = document.getElementById('bar-neutrality');
  const barStrain = document.getElementById('bar-strain');
  const barFatigue = document.getElementById('bar-fatigue');

  function updateReadouts() {
    if (!tensionSlider || !lumbarSlider) return;
    const t = parseInt(tensionSlider.value, 10);
    const l = parseInt(lumbarSlider.value, 10);

    tensionVal.textContent = t + ' N·m';
    lumbarVal.textContent = '+' + l + ' mm';

    // Calculate simulated scores
    const neutrality = Math.min(99.8, 90 + (l * 0.28)).toFixed(1);
    const strain = Math.max(8.5, (30 - (t * 0.15) - (l * 0.2))).toFixed(1);
    const fatigue = Math.min(10.5, 5 + (t * 0.04) + (l * 0.08)).toFixed(1);

    metricNeutrality.textContent = neutrality + '%';
    metricStrain.textContent = strain + ' kPa';
    metricFatigue.textContent = '+' + fatigue + ' hrs';

    barNeutrality.style.width = neutrality + '%';
    barStrain.style.width = Math.min(100, Math.max(10, strain * 3.5)) + '%';
    barFatigue.style.width = Math.min(100, fatigue * 9.5) + '%';
  }

  if (tensionSlider && lumbarSlider) {
    tensionSlider.addEventListener('input', updateReadouts);
    lumbarSlider.addEventListener('input', updateReadouts);
    updateReadouts();
  }
})();

(function initPageInteractions() {
  const body = document.body;
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNavigation = document.getElementById('mobile-navigation');
  const profileToggles = document.querySelectorAll('[data-profile-toggle]');
  const profileMenus = document.querySelectorAll('.profile-menu');
  const cartOpens = document.querySelectorAll('[data-cart-open]');
  const cartOverlay = document.getElementById('cart-overlay');
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutTriggers = document.querySelectorAll('[data-open-checkout]');
  const newsletterForm = document.getElementById('newsletter');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterMessage = document.getElementById('newsletter-message');
  let lastFocusedElement = null;

  function openOverlay(overlay, trigger) {
    if (!overlay) return;
    lastFocusedElement = trigger || document.activeElement;
    if (trigger instanceof HTMLElement) trigger.setAttribute('aria-expanded', 'true');
    overlay.hidden = false;
    body.classList.add('has-open-overlay');
    overlay.querySelector('[role="dialog"] .icon-button, [role="dialog"] a')?.focus();
  }

  function closeOverlay(overlay, trigger) {
    if (!overlay) return;
    overlay.hidden = true;
    if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.setAttribute('aria-expanded', 'false');
    if (cartOverlay?.hidden && checkoutModal?.hidden) {
      body.classList.remove('has-open-overlay');
    }
    (trigger || lastFocusedElement)?.focus();
  }

  mobileMenuToggle?.addEventListener('click', () => {
    if (!mobileNavigation) return;
    const isOpen = !mobileNavigation.hidden;
    mobileNavigation.hidden = isOpen;
    mobileMenuToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth < 768 || !mobileNavigation || !mobileMenuToggle) return;
    mobileNavigation.hidden = true;
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-label', 'Open navigation menu');
    profileMenus.forEach((menu) => { menu.hidden = true; });
    profileToggles.forEach((toggle) => toggle.setAttribute('aria-expanded', 'false'));
  });

  mobileNavigation?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNavigation.hidden = true;
      mobileMenuToggle?.setAttribute('aria-expanded', 'false');
      mobileMenuToggle?.setAttribute('aria-label', 'Open navigation menu');
    });
  });

  profileToggles.forEach((profileToggle) => {
    profileToggle.addEventListener('click', () => {
      const profileMenu = document.getElementById(profileToggle.getAttribute('aria-controls') || '');
      if (!profileMenu) return;
      profileMenu.hidden = !profileMenu.hidden;
      profileToggle.setAttribute('aria-expanded', String(!profileMenu.hidden));
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    profileMenus.forEach((profileMenu) => {
      if (profileMenu.hidden || profileMenu.contains(target)) return;
      const profileToggle = Array.from(profileToggles).find((toggle) =>
        toggle.getAttribute('aria-controls') === profileMenu.id);
      if (profileToggle?.contains(target)) return;
      profileMenu.hidden = true;
      profileToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  cartOpens.forEach((cartOpen) => {
    cartOpen.addEventListener('click', () => openOverlay(cartOverlay, cartOpen));
  });

  document.querySelectorAll('[data-close-cart]').forEach((button) => {
    button.addEventListener('click', () => {
      closeOverlay(cartOverlay);
    });
  });

  checkoutTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openOverlay(checkoutModal, trigger);
    });
  });

  document.querySelectorAll('[data-close-checkout]').forEach((button) => {
    button.addEventListener('click', () => closeOverlay(checkoutModal));
  });

  [cartOverlay, checkoutModal].forEach((overlay) => {
    overlay?.addEventListener('click', (event) => {
      if (event.target !== overlay) return;
      closeOverlay(overlay);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (checkoutModal && !checkoutModal.hidden) {
      closeOverlay(checkoutModal);
    } else if (cartOverlay && !cartOverlay.hidden) {
      closeOverlay(cartOverlay);
    } else if (Array.from(profileMenus).some((menu) => !menu.hidden)) {
      const openProfileMenu = Array.from(profileMenus).find((menu) => !menu.hidden);
      const openProfileToggle = Array.from(profileToggles).find((toggle) =>
        toggle.getAttribute('aria-controls') === openProfileMenu?.id);
      profileMenus.forEach((menu) => { menu.hidden = true; });
      profileToggles.forEach((toggle) => toggle.setAttribute('aria-expanded', 'false'));
      openProfileToggle?.focus();
    } else if (mobileNavigation && !mobileNavigation.hidden) {
      mobileNavigation.hidden = true;
      mobileMenuToggle?.setAttribute('aria-expanded', 'false');
      mobileMenuToggle?.focus();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const activeOverlay = checkoutModal && !checkoutModal.hidden ? checkoutModal :
      cartOverlay && !cartOverlay.hidden ? cartOverlay : null;
    const dialog = activeOverlay?.querySelector('[role="dialog"]');
    if (!dialog) return;
    const focusable = Array.from(dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  newsletterForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!newsletterEmail?.validity.valid || !newsletterMessage) return;
    newsletterForm.reset();
    newsletterMessage.textContent = 'Telemetry linked. Welcome to the future of posture.';
  });
})();
