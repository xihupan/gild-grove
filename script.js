document.addEventListener('DOMContentLoaded', () => {
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

  const interest = document.querySelector('#interest');
  const context = document.querySelector('#product-context');
  // Selection belongs to one history entry: reload/back preserves edits,
  // while a new product CTA creates a fresh, precise inquiry context.
  const remember = () => {
    try { history.replaceState({...history.state, gildInquirySelection: interest.value}, ''); }
    catch (_) { /* The form still works when history state is unavailable. */ }
  };
  const contextDefault = 'Choose a product or describe what you are looking for in your message.';
  const blockProducts = new Set(['Coffee Crow Building Block Set', 'Rose Highland Cow Building Block Set', 'Heart-Holding Otter Building Block Set']);
  const updateContext = () => {
    if (!context) return;
    if (interest?.value === 'Miniature Figurine Sets in Tins') context.textContent = 'For tin sets, mention Design 01, 02, or 03 in your message.';
    else if (blockProducts.has(interest?.value)) context.textContent = 'Share your estimated quantity and destination, and ask us to confirm specifications, set contents and packing.';
    else if (interest?.value === 'Multiple products') context.textContent = 'Please identify the products or designs you mean in your message.';
    else if (interest?.value) context.textContent = 'Include your preferred design, estimated quantity and destination in your message.';
    else context.textContent = contextDefault;
  };
  const options = interest ? new Set(Array.from(interest.options, option => option.value)) : new Set();
  if (interest) {
    let saved = null;
    try { saved = history.state?.gildInquirySelection ?? null; } catch (_) { /* Use URL context if history state is unavailable. */ }
    const requested = new URLSearchParams(location.search).get('product');
    const aliases = {
      'Both new home and gift decor products': 'Multiple products',
      'Both pumpkin collections': 'Multiple products',
      'Vintage Cat & Lady Figurines': 'Vintage Cat & Lady Resin Figurine'
    };
    const mapped = aliases[requested] || requested;
    if (saved !== null && options.has(saved)) interest.value = saved;
    else if (mapped && options.has(mapped)) {
      interest.value = mapped;
      if (mapped === 'Multiple products' && context) context.textContent = 'Please identify the products or designs you mean in your message.';
    } else {
      interest.value = '';
      if (requested && context) context.textContent = 'Please choose a product or describe what you are looking for in your message.';
    }
    updateContext();
    interest.addEventListener('change', () => {
      remember();
      updateContext();
    });
    document.querySelectorAll('a[data-product]').forEach(link => link.addEventListener('click', () => {
      interest.value = options.has(link.dataset.product) ? link.dataset.product : '';
      remember();
      updateContext();
    }));
    // A general inquiry starts without an accidental product selection.
    document.querySelectorAll('a[href="#contact"]:not([data-product])').forEach(link => link.addEventListener('click', () => {
      interest.value = '';
      updateContext();
      remember();
      updateContext();
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
      subjectField.value = `Wholesale inquiry: ${interest.value || 'General product inquiry'}`;
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
        form.reset();
        if (interest) { interest.value = ''; remember(); updateContext(); }
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
