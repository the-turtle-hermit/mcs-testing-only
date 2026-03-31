(function () {
  const cfg = window.MCS_CONFIG || {};
  document.querySelectorAll('[data-email]').forEach(el => {
    const email = cfg.contactEmail || 'mancampsouth@gmail.com';
    el.textContent = email;
    if (el.tagName === 'A') el.href = `mailto:${email}`;
  });


  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const timeline = document.getElementById('timeline');
  if (timeline && cfg.event?.schedule) {
    timeline.innerHTML = cfg.event.schedule.map(([title, desc]) => `
      <div class="timeline-item">
        <h3>${title}</h3>
        <p>${desc}</p>
      </div>`).join('');
  }

  const details = document.getElementById('event-details');
  if (details && cfg.event?.details) {
    details.innerHTML = cfg.event.details.map(([k, v]) => `
      <div class="kv-row"><strong>${k}</strong><div>${v}</div></div>`).join('');
  }

  const pricing = document.getElementById('pricing-grid');
  if (pricing && cfg.event?.pricing) {
    pricing.innerHTML = cfg.event.pricing.map(([title, desc], i) => `
      <article class="card flat">
        <div class="icon-badge">${i + 1}</div>
        <h3>${title}</h3>
        <p>${desc}</p>
      </article>`).join('');
  }

  const bring = document.getElementById('bring-list');
  if (bring && cfg.event?.bring) {
    bring.innerHTML = cfg.event.bring.map(item => `
      <div><span class="check">✓</span><span>${item}</span></div>`).join('');
  }

  const faq = document.getElementById('faq-grid');
  if (faq && cfg.event?.faq) {
    faq.innerHTML = cfg.event.faq.map(([q, a]) => `
      <article class="card flat">
        <h3>${q}</h3>
        <p>${a}</p>
      </article>`).join('');
  }

  const mission = document.querySelectorAll('[data-mission]');
  mission.forEach(el => { if (cfg.event?.mission) el.textContent = cfg.event.mission; });

  const products = document.getElementById('products-grid');
  if (products && cfg.products) {
    products.innerHTML = cfg.products.map(item => {
      const disabled = !item.buyUrl || item.buyUrl === '#';
      return `
        <article class="product-card">
          <div class="product-media"><img src="${item.image}" alt="${item.name}"></div>
          <div class="product-body">
            <span class="tag">${item.category}</span>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="product-meta">
              <div class="price">${item.price}</div>
              <div class="small">${item.status || ''}</div>
            </div>
            <a class="btn ${disabled ? 'btn-secondary btn-disabled' : 'btn-primary'}" ${disabled ? 'aria-disabled="true"' : `href="${item.buyUrl}" target="_blank" rel="noreferrer"`}>
              ${disabled ? 'Checkout link coming soon' : 'Buy now'}
            </a>
          </div>
        </article>`;
    }).join('');
  }

  const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const installBtn = document.getElementById('install-app-btn');
  const installHelp = document.getElementById('install-help');
  const installStatus = document.getElementById('install-status');
  const installModal = document.getElementById('install-modal');
  const installSteps = document.getElementById('install-steps');
  const installModalTitle = document.getElementById('install-modal-title');
  const installModalCopy = document.getElementById('install-modal-copy');
  const installCloseBtn = document.getElementById('install-close-btn');
  let deferredPrompt = null;

  function setInstallHelp(message) {
    if (!installHelp) return;
    installHelp.textContent = message;
    installHelp.hidden = !message;
  }

  function openInstallModal(title, copy, steps) {
    if (!installModal || !installSteps || !installModalTitle || !installModalCopy) return;
    installModalTitle.textContent = title;
    installModalCopy.textContent = copy;
    installSteps.innerHTML = steps.map((step, index) => `<div class="install-step"><span>${index + 1}</span><div>${step}</div></div>`).join('');
    installModal.hidden = false;
    document.body.classList.add('body-lock');
  }

  function closeInstallModal() {
    if (!installModal) return;
    installModal.hidden = true;
    document.body.classList.remove('body-lock');
  }

  if (installCloseBtn) installCloseBtn.addEventListener('click', closeInstallModal);
  if (installModal) {
    installModal.addEventListener('click', (event) => {
      if (event.target === installModal) closeInstallModal();
    });
  }

  if (window.location.protocol !== 'file:' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js').catch(() => {});
    });
  }

  if (installBtn) {
    if (isStandalone) {
      installBtn.disabled = true;
      installBtn.classList.add('btn-disabled');
      installStatus.textContent = 'Already installed on this device';
      setInstallHelp('The app is already added to your home screen.');
    } else if (isIos) {
      installStatus.textContent = 'Tap to view iPhone install steps';
      setInstallHelp('On iPhone, Safari uses Share → Add to Home Screen.');
    } else {
      installStatus.textContent = 'Tap to install on Android';
      setInstallHelp('If your browser does not show a prompt, manual install steps will appear.');
    }

    installBtn.addEventListener('click', async () => {
      if (isStandalone) return;

      if (isIos) {
        openInstallModal(
          'Install on iPhone',
          'Open this site in Safari and use the share menu to add it to your home screen.',
          [
            'Tap the Share button in Safari.',
            'Scroll down and tap Add to Home Screen.',
            'Tap Add in the top-right corner.'
          ]
        );
        return;
      }

      if (deferredPrompt) {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice.catch(() => null);
        deferredPrompt = null;
        if (choice && choice.outcome === 'accepted') {
          installStatus.textContent = 'App install started';
          setInstallHelp('Check your home screen if your browser does not open the app immediately.');
        } else {
          openInstallModal(
            'Install on Android',
            'If the browser did not prompt automatically, use the browser menu to install it manually.',
            [
              'Open the browser menu.',
              'Tap Install App or Add to Home Screen.',
              'Confirm the install when prompted.'
            ]
          );
        }
        return;
      }

      openInstallModal(
        'Install on Android',
        'Use your browser menu to install this site like an app.',
        [
          'Open the browser menu in Chrome or Samsung Internet.',
          'Tap Install App or Add to Home Screen.',
          'Confirm the install when prompted.'
        ]
      );
    });
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (installStatus) installStatus.textContent = 'Ready to install on Android';
    setInstallHelp('Tap Download app to trigger the install prompt.');
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (installBtn) {
      installBtn.disabled = true;
      installBtn.classList.add('btn-disabled');
    }
    if (installStatus) installStatus.textContent = 'App installed';
    setInstallHelp('The site has been added to your device.');
  });
})();
