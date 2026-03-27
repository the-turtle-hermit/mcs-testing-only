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
})();

(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }

  let deferredPrompt = null;
  const installBtn = document.getElementById('installBtn');
  const installStatus = document.getElementById('installStatus');

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredPrompt = event;
    if (installBtn) installBtn.hidden = false;
    if (installStatus) installStatus.textContent = 'This browser can install the Man Camp South app.';
  });

  window.addEventListener('appinstalled', function () {
    if (installBtn) installBtn.hidden = true;
    if (installStatus) installStatus.textContent = 'App installed successfully.';
    deferredPrompt = null;
  });

  if (installBtn) {
    installBtn.addEventListener('click', async function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      try {
        await deferredPrompt.userChoice;
      } catch (e) {}
      deferredPrompt = null;
      installBtn.hidden = true;
    });
  }
})();
