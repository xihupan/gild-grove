document.addEventListener('DOMContentLoaded', () => {
  // Reuse an existing analytics installation, if the site owner configures one.
  // Analytics failures must never interrupt a buyer's inquiry.
  const trackInquiryEvent = (name, parameters) => {
    if (typeof window.gtag !== 'function') return;
    try { window.gtag('event', name, parameters); }
    catch (_) { /* The inquiry remains usable without analytics. */ }
  };
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.protocol === 'mailto:') {
      trackInquiryEvent('contact_email_click', {contact_method: 'email'});
    } else if (url.origin === location.origin && url.pathname === '/' && url.hash === '#contact') {
      trackInquiryEvent('wholesale_inquiry_click', {contact_method: 'form'});
    }
  });

  const filter = document.querySelector('[data-collection-filter]');
  if (filter) {
    const cards = Array.from(document.querySelectorAll('[data-product-id]'));
    const count = document.querySelector('[data-catalog-count]');
    const empty = document.querySelector('[data-catalog-empty]');
    const applyFilter = category => {
      cards.forEach(card => {
        card.hidden = category !== 'all' && !card.dataset.categories.split(' ').includes(category);
      });
      filter.querySelectorAll('[data-filter]').forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.filter === category));
      });
      const visible = cards.filter(card => !card.hidden).length;
      count.textContent = `${visible} product series`;
      empty.hidden = visible > 0;
    };
    filter.addEventListener('click', event => {
      const button = event.target.closest('[data-filter]');
      if (button) applyFilter(button.dataset.filter);
    });
    document.querySelector('[data-show-all]').addEventListener('click', () => {
      applyFilter('all');
      filter.querySelector('[data-filter="all"]').focus();
    });
    applyFilter('all');
    filter.hidden = false;
  }

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (menuButton && nav) {
    const mobile = window.matchMedia('(max-width: 680px)');
    const setMenu = (open, restoreFocus = false) => {
      nav.classList.toggle('is-open', open);
      nav.inert = mobile.matches && !open;
      menuButton.setAttribute('aria-expanded', String(open));
      const label = open ? 'Close navigation' : 'Open navigation';
      menuButton.title = label;
      menuButton.querySelector('.sr-only').textContent = label;
      if (restoreFocus) menuButton.focus();
    };
    setMenu(false);
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false, mobile.matches)));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false, true);
    });
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
    });
    nav.addEventListener('focusout', event => {
      if (mobile.matches && !nav.contains(event.relatedTarget) && event.relatedTarget !== menuButton) setMenu(false);
    });
    mobile.addEventListener('change', () => setMenu(false));
  }

  const keychain = window.GildGraduation;
  const keychainProduct = '2027 Graduation Keychain';
  const keychainOptions = keychain?.variants || [];
  const findVariant = value => keychainOptions.find(option => option.id === value) || null;
  const keychainPage = document.querySelector('[data-keychain-page]');
  if (keychainPage && keychainOptions.length) {
    const picker = keychainPage.querySelector('[data-keychain-picker]');
    const image = keychainPage.querySelector('[data-keychain-picture] img');
    const webp = keychainPage.querySelector('[data-keychain-picture] source');
    const summary = keychainPage.querySelector('[data-keychain-summary]');
    const defaultVariant = findVariant('gold-b');
    const renderVariant = (variant, updateUrl = false, invalid = false) => {
      const shown = variant || defaultVariant;
      const base = `../assets/products/graduation-keychain-2027/${shown.image}`;
      picker.value = variant?.id || '';
      webp.srcset = `${base}-400.webp 400w, ${base}-800.webp 800w`;
      image.src = `${base}-800.jpg`;
      image.srcset = `${base}-400.jpg 400w, ${base}-800.jpg 800w`;
      image.alt = shown.alt;
      summary.textContent = variant ? shown.description : 'Preview: Gold-tone · Class of 2027. Choose a color and design, or ask us to confirm an option.';
      keychainPage.querySelector('[data-keychain-color]').textContent = variant?.color || 'Choose an option';
      keychainPage.querySelector('[data-keychain-design]').textContent = variant?.disc || 'Choose an option';
      const notice = keychainPage.querySelector('[data-keychain-notice]');
      notice.hidden = !invalid;
      keychainPage.querySelectorAll('[data-keychain-inquiry]').forEach(link => {
        const url = new URL('../', location.href);
        url.searchParams.set('product', keychainProduct);
        if (variant) url.searchParams.set('variant', variant.id);
        url.hash = 'contact';
        link.href = url.href;
      });
      keychainPage.querySelectorAll('[data-keychain-option]').forEach(link => {
        if (link.dataset.keychainOption === variant?.id) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
      if (updateUrl) {
        const url = new URL(location.href);
        if (variant) url.searchParams.set('variant', variant.id);
        else url.searchParams.delete('variant');
        try { history.replaceState(history.state, '', url.href); } catch (_) { /* Selection still works without history. */ }
      }
    };
    const restoreDetail = () => {
      const requested = new URLSearchParams(location.search).get('variant');
      const variant = requested === null ? defaultVariant : findVariant(requested);
      renderVariant(variant, false, requested !== null && !variant);
    };
    picker.disabled = false;
    picker.addEventListener('change', () => renderVariant(findVariant(picker.value), true));
    keychainPage.querySelectorAll('[data-keychain-option]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      renderVariant(findVariant(link.dataset.keychainOption), true);
      picker.focus({preventScroll: true});
    }));
    window.addEventListener('popstate', restoreDetail);
    window.addEventListener('pageshow', restoreDetail);
    restoreDetail();
  }

  const interest = document.querySelector('#interest');
  const context = document.querySelector('#product-context');
  const inquiryPicker = document.querySelector('#keychain-variant');
  const inquiryOptions = document.querySelector('#keychain-inquiry-options');
  const variantFields = document.querySelectorAll('[data-keychain-field]');
  let selectionNotice = '';
  // Selection belongs to one history entry: reload/back preserves edits,
  // while a new product CTA creates a fresh, precise inquiry context.
  const remember = () => {
    try { history.replaceState({...history.state, gildInquirySelection: interest.value, gildInquiryVariant: inquiryPicker?.value || ''}, ''); }
    catch (_) { /* The form still works when history state is unavailable. */ }
  };
  const contextDefault = 'Choose a product or describe what you are looking for in your message.';
  const blockProducts = new Set(['Coffee Crow Building Block Set', 'Rose Highland Cow Building Block Set', 'Heart-Holding Otter Building Block Set']);
  const updateContext = () => {
    if (!context) return;
    const isKeychain = interest?.value === keychainProduct && keychainOptions.length;
    const variant = isKeychain ? findVariant(inquiryPicker?.value) : null;
    if (inquiryOptions && inquiryPicker) {
      inquiryOptions.hidden = !isKeychain;
      inquiryPicker.disabled = !isKeychain;
      if (!isKeychain) inquiryPicker.value = '';
      variantFields.forEach(field => {
        field.disabled = !isKeychain;
        const values = {variant_color: variant?.color || '', variant_design: variant?.disc || '', variant_year: '2027', product_details: variant ? `${keychainProduct}; ${variant.label}; Disc: ${variant.disc}; Year charm: 2027.` : `${keychainProduct}; Please confirm color & design; Year charm: 2027.`};
        field.value = isKeychain ? values[field.name] || '' : '';
      });
      const inquirySummary = document.querySelector('#keychain-inquiry-summary');
      if (inquirySummary) inquirySummary.textContent = variant ? `${variant.label}. Disc: ${variant.disc}. Year charm: 2027.` : 'Please confirm color & design. You can send an inquiry without choosing an option.';
    }
    if (selectionNotice) { context.textContent = selectionNotice; return; }
    if (isKeychain) { context.textContent = 'Choose a color and design if known. Share your estimated quantity and destination; dimensions and packing details are available on request.'; return; }
    if (interest?.value === 'Miniature Figurine Sets in Tins') context.textContent = 'For tin sets, mention Design 01, 02, or 03 in your message.';
    else if (blockProducts.has(interest?.value)) context.textContent = 'Share your estimated quantity and destination, and ask us to confirm specifications, set contents and packing.';
    else if (interest?.value === 'Multiple products') context.textContent = 'Please identify the products or designs you mean in your message.';
    else if (interest?.value) context.textContent = 'Include your preferred design, estimated quantity and destination in your message.';
    else context.textContent = contextDefault;
  };
  const options = interest ? new Set(Array.from(interest.options, option => option.value)) : new Set();
  if (interest) {
    const aliases = {
      'Both new home and gift decor products': 'Multiple products',
      'Both pumpkin collections': 'Multiple products',
      'Vintage Cat & Lady Figurines': 'Vintage Cat & Lady Resin Figurine'
    };
    const restoreInquiry = () => {
      let saved = null;
      let savedVariant = '';
      try { saved = history.state?.gildInquirySelection ?? null; savedVariant = history.state?.gildInquiryVariant || ''; } catch (_) { /* Fall back to URL context. */ }
      const query = new URLSearchParams(location.search);
      const requested = query.get('product');
      const requestedVariant = query.get('variant');
      const mapped = Object.hasOwn(aliases, requested) ? aliases[requested] : requested;
      const useSaved = saved !== null && options.has(saved);
      interest.value = useSaved ? saved : (options.has(mapped) ? mapped : '');
      selectionNotice = !useSaved && requested && !options.has(mapped) ? 'That product was not recognized. Please choose a product or describe your request.' : '';
      if (inquiryPicker) {
        const candidate = useSaved ? savedVariant : requestedVariant;
        const variant = interest.value === keychainProduct ? findVariant(candidate) : null;
        inquiryPicker.value = variant?.id || '';
        if (interest.value === keychainProduct && candidate && !variant) selectionNotice = 'That color and design was not recognized. Choose an option below or ask us to confirm it.';
      }
      updateContext();
    };
    restoreInquiry();
    window.addEventListener('popstate', restoreInquiry);
    window.addEventListener('pageshow', event => { if (event.persisted) restoreInquiry(); });
    interest.addEventListener('change', () => {
      selectionNotice = '';
      if (inquiryPicker) inquiryPicker.value = '';
      updateContext();
      remember();
    });
    inquiryPicker?.addEventListener('change', () => {
      selectionNotice = '';
      updateContext();
      remember();
    });
    document.querySelectorAll('a[data-product]').forEach(link => link.addEventListener('click', () => {
      interest.value = options.has(link.dataset.product) ? link.dataset.product : '';
      selectionNotice = '';
      if (inquiryPicker) inquiryPicker.value = interest.value === keychainProduct ? findVariant(link.dataset.variant)?.id || '' : '';
      updateContext();
      remember();
    }));
    // A general inquiry starts without an accidental product selection.
    document.querySelectorAll('a[href="#contact"]:not([data-product])').forEach(link => link.addEventListener('click', () => {
      interest.value = '';
      selectionNotice = '';
      updateContext();
      remember();
    }));
  }

  const form = document.querySelector('[data-inquiry-form]');
  const status = document.querySelector('[data-form-status]');
  if (form && status) {
    const submitButton = form.querySelector('[type=submit]');
    const submitLabel = form.querySelector('[data-submit-label]');
    const subjectField = form.querySelector('[name=_subject]');
    const defaultLabel = submitLabel.textContent;
    let sending = false;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (sending) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      sending = true;
      updateContext();
      const chosen = interest.value === keychainProduct ? findVariant(inquiryPicker?.value) : null;
      subjectField.value = `Wholesale inquiry: ${interest.value || 'General product inquiry'}${chosen ? ` — ${chosen.label}` : ''}`;
      submitButton.disabled = true;
      submitLabel.textContent = 'Sending…';
      form.setAttribute('aria-busy', 'true');
      status.dataset.state = 'sending';
      status.textContent = 'Sending your inquiry…';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      try {
        const response = await fetch(form.action, {method:'POST',body:new FormData(form),headers:{Accept:'application/json'},signal:controller.signal});
        if (!response.ok) throw new Error('submission-failed');
        status.dataset.state = 'success';
        status.textContent = 'Thank you. Your inquiry has been submitted. We will reply by email.';
        trackInquiryEvent('generate_lead', {
          method: 'wholesale_inquiry',
          product_name: options.has(interest?.value) && interest.value ? interest.value : 'General product inquiry',
          ...(chosen ? {variant_id: chosen.id} : {})
        });
        form.reset();
        if (interest) { interest.value = ''; selectionNotice = ''; updateContext(); remember(); }
      } catch (_) {
        status.dataset.state = 'error';
        status.textContent = 'Your inquiry could not be sent. Your details are still here. Please try again or use the email link below.';
        const fallback = document.createElement('a');
        fallback.href = 'mailto:sales@gildngrove.com';
        fallback.textContent = 'Email sales@gildngrove.com';
        status.append(document.createElement('br'), fallback);
      } finally {
        clearTimeout(timeout);
        sending = false;
        submitButton.disabled = false;
        submitLabel.textContent = defaultLabel;
        form.removeAttribute('aria-busy');
        status.focus({preventScroll:true});
        status.scrollIntoView({block:'nearest',behavior:'auto'});
      }
    });
  }
});
