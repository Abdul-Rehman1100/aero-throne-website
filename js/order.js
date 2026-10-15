let currentQty = 1;
    const pageRoutes = {
      overview: '../index.html',
      'product-features': 'product.html#product-details',
      'specifications-reviews': 'product.html#specifications',
      checkout: 'order.html'
    };
    document.querySelectorAll('[data-path]').forEach(link => {
      link.href = pageRoutes[link.dataset.path] || link.href;
    });
    const checkoutParams = new URLSearchParams(window.location.search);
    const configuredPrice = Number(checkoutParams.get('price'));
    const baseItemPrice = checkoutParams.has('price') && Number.isFinite(configuredPrice) && configuredPrice >= 0
      ? configuredPrice
      : 1149.00;
    const taxRate = 0.08;
    let deliveryCost = 0;
    let promoDiscount = 0;

    const finishLabel = checkoutParams.get('finish') || 'Obsidian Slate';
    const hasCasters = checkoutParams.get('casters') === '1';
    const money = amount => '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    function updateCalculations() {
      const subtotal = baseItemPrice * currentQty;
      const taxableAmount = Math.max(0, subtotal + deliveryCost - promoDiscount);
      const tax = taxableAmount * taxRate;
      const total = taxableAmount + tax;

      document.getElementById('order-qty').innerText = currentQty;
      document.getElementById('item-price').innerText = money(baseItemPrice);
      document.getElementById('summary-subtotal').innerText = money(subtotal);
      document.getElementById('summary-delivery').innerText = deliveryCost ? money(deliveryCost) : 'FREE';
      document.getElementById('summary-tax').innerText = money(tax);
      document.getElementById('summary-total').innerText = money(total);
      document.getElementById('cta-text').innerText = 'Complete Order — ' + money(total);
      const discountRow = document.getElementById('summary-discount-row');
      if (discountRow) {
        discountRow.classList.toggle('hidden', promoDiscount === 0);
        document.getElementById('summary-discount').innerText = '−' + money(promoDiscount);
      }
    }

    function adjustQty(delta) {
      if (currentQty + delta >= 1 && currentQty + delta <= 8) {
        currentQty += delta;
        updateCalculations();
      }
    }

    function selectPaymentTab(type) {
      const ccTab = document.getElementById('tab-cc');
      const payTab = document.getElementById('tab-pay');
      const financeTab = document.getElementById('tab-finance');

      const cardPanel = document.getElementById('payment-card-panel');
      const digitalPanel = document.getElementById('payment-digital-panel');
      const financePanel = document.getElementById('payment-finance-panel');

      // Reset styles
      [ccTab, payTab, financeTab].forEach(t => {
        t.className = 'py-space-sm px-space-sm rounded-lg font-label-lg text-label-lg transition-all flex items-center justify-center gap-2 text-on-surface-variant hover:text-on-surface';
      });

      cardPanel.classList.add('hidden');
      digitalPanel.classList.add('hidden');
      financePanel.classList.add('hidden');

      if (type === 'cc') {
        ccTab.className = 'py-space-sm px-space-sm rounded-lg font-label-lg text-label-lg transition-all flex items-center justify-center gap-2 bg-surface-container-high text-primary shadow-sm';
        cardPanel.classList.remove('hidden');
      } else if (type === 'pay') {
        payTab.className = 'py-space-sm px-space-sm rounded-lg font-label-lg text-label-lg transition-all flex items-center justify-center gap-2 bg-surface-container-high text-primary shadow-sm';
        digitalPanel.classList.remove('hidden');
        digitalPanel.classList.add('flex');
      } else if (type === 'finance') {
        financeTab.className = 'py-space-sm px-space-sm rounded-lg font-label-lg text-label-lg transition-all flex items-center justify-center gap-2 bg-surface-container-high text-primary shadow-sm';
        financePanel.classList.remove('hidden');
        financePanel.classList.add('flex');
      }
    }

    function applyPromo() {
      const input = document.getElementById('voucher-input');
      const code = input.value.trim().toUpperCase();
      if (code === 'ERGOPRO') {
        promoDiscount = 100;
        updateCalculations();
        alert('Pass verified: $100 discount applied.');
      } else if (code) {
        alert('That discount code is not valid.');
      }
    }

    document.querySelectorAll('[name="delivery_method"]').forEach(option => {
      option.addEventListener('change', () => {
        deliveryCost = Number(option.value) || 0;
        updateCalculations();
      });
    });

    document.getElementById('item-config').innerText = 'Finish: ' + finishLabel + (hasCasters ? ' / Hardwood Castors' : '');
    updateCalculations();
