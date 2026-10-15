(function initProductPage() {
      const pageRoutes = {
        overview: '../index.html',
        'product-features': 'product.html#product-details',
        'specifications-reviews': 'product.html#specifications',
        checkout: 'order.html'
      };
      document.querySelectorAll('[data-path]').forEach(link => {
        link.href = pageRoutes[link.dataset.path] || link.href;
      });

      // 1. Thumbnail Selector Logic
      const primaryViewerImg = document.getElementById('primaryViewerImg');
      const thumbButtons = document.querySelectorAll('.thumb-trigger');

      thumbButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          thumbButtons.forEach(b => {
            b.classList.remove('active', 'ring-2', 'ring-primary');
            const txt = b.querySelector('span');
            if (txt) txt.classList.replace('text-primary', 'text-on-surface-variant');
          });

          btn.classList.add('active', 'ring-2', 'ring-primary');
          const txt = btn.querySelector('span');
          if (txt) txt.classList.replace('text-on-surface-variant', 'text-primary');

          const newSrc = btn.getAttribute('data-img-src');
          const fallbackSrc = btn.querySelector('img')?.getAttribute('src');
          if (newSrc && primaryViewerImg) {
            primaryViewerImg.style.opacity = '0.3';
            primaryViewerImg.style.transform = 'scale(0.96)';
            setTimeout(() => {
              primaryViewerImg.src = newSrc === 'placeholder' ? fallbackSrc : newSrc;
              primaryViewerImg.style.opacity = '1';
              primaryViewerImg.style.transform = 'scale(1)';
            }, 180);
          }
        });
      });

      // 2. Colorway & Price Modifier Engine
      let basePrice = 1149;
      let finishAddon = 0;
      let castersAddon = 0;

      const finishButtons = document.querySelectorAll('.color-btn');
      const finishLabel = document.getElementById('selectedFinishLabel');
      const finalTotalDisplay = document.getElementById('finalTotalDisplay');
      const basePriceDisplay = document.getElementById('basePriceDisplay');
      const castorsCheckbox = document.getElementById('rollerCastorsAddon');
      const checkoutLinks = document.querySelectorAll('[data-path="checkout"]');

      function updateCalculation() {
        const total = basePrice + finishAddon + castersAddon;
        if (finalTotalDisplay) {
          finalTotalDisplay.textContent = '$' + total.toLocaleString();
        }
        if (basePriceDisplay) {
          basePriceDisplay.textContent = '$' + (basePrice + finishAddon).toLocaleString();
        }
        checkoutLinks.forEach(link => {
          const params = new URLSearchParams({
            price: String(total),
            finish: finishLabel?.textContent || 'Obsidian Slate',
            casters: castorsCheckbox?.checked ? '1' : '0'
          });
          link.href = `order.html?${params.toString()}`;
        });
      }

      finishButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          finishButtons.forEach(b => {
            b.classList.remove('active', 'bg-surface-container-high');
            b.classList.add('bg-surface-container-high/60');
            const ringDiv = b.querySelector('.rounded-full');
            if (ringDiv) ringDiv.classList.remove('ring-2', 'ring-primary');
          });

          btn.classList.add('active', 'bg-surface-container-high');
          btn.classList.remove('bg-surface-container-high/60');
          const activeRing = btn.querySelector('.rounded-full');
          if (activeRing) activeRing.classList.add('ring-2', 'ring-primary');

          const name = btn.getAttribute('data-finish-name');
          const mod = parseInt(btn.getAttribute('data-price-mod') || '0', 10);

          if (finishLabel && name) finishLabel.textContent = name;
          finishAddon = mod;
          updateCalculation();
        });
      });

      if (castorsCheckbox) {
        castorsCheckbox.addEventListener('change', (e) => {
          castersAddon = e.target.checked ? parseInt(e.target.getAttribute('data-cost') || '45', 10) : 0;
          updateCalculation();
        });
      }

      // 3. Mobile Spec Accordion
      const accordionToggles = document.querySelectorAll('.spec-toggle');
      accordionToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
          const content = toggle.nextElementSibling;
          const icon = toggle.querySelector('.toggle-icon');
          const isExpanded = !content.classList.contains('hidden');

          if (isExpanded) {
            content.classList.add('hidden');
            if (icon) icon.style.transform = 'rotate(0deg)';
          } else {
            content.classList.remove('hidden');
            if (icon) icon.style.transform = 'rotate(180deg)';
          }
        });
      });

      // 4. Subtle Zoom Toggle
      const fullscreenToggle = document.getElementById('fullscreenToggle');
      let isZoomed = false;
      if (fullscreenToggle && primaryViewerImg) {
        fullscreenToggle.addEventListener('click', () => {
          isZoomed = !isZoomed;
          if (isZoomed) {
            primaryViewerImg.style.transform = 'scale(1.35)';
            fullscreenToggle.classList.add('text-primary');
          } else {
            primaryViewerImg.style.transform = 'scale(1)';
            fullscreenToggle.classList.remove('text-primary');
          }
        });
      }
    })();