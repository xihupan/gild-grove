document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("title", isOpen ? "Close navigation" : "Open navigation");
      const currentIcon = menuButton.querySelector("svg, i");
      if (currentIcon) {
        const nextIcon = document.createElement("i");
        nextIcon.setAttribute("data-lucide", isOpen ? "x" : "menu");
        nextIcon.setAttribute("aria-hidden", "true");
        currentIcon.replaceWith(nextIcon);
      }
      if (window.lucide) window.lucide.createIcons();
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("title", "Open navigation");
    }));
  }

  document.querySelectorAll("[data-product]").forEach((button) => {
    button.addEventListener("click", () => {
      const interest = document.querySelector("#interest");
      if (interest) interest.value = button.dataset.product;
    });
  });

  const form = document.querySelector("[data-inquiry-form]");
  const status = document.querySelector("[data-form-status]");
  if (form && status) {
    const submitButton = form.querySelector("[type=submit]");
    const submitLabel = form.querySelector("[data-submit-label]");
    const subjectField = form.querySelector("[name=_subject]");
    const defaultSubmitLabel = submitLabel ? submitLabel.textContent : "Send wholesale inquiry";

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const interest = data.get("interest");
      if (subjectField) subjectField.value = `Wholesale inquiry: ${interest}`;
      if (submitButton) submitButton.disabled = true;
      if (submitLabel) submitLabel.textContent = "Sending...";
      form.setAttribute("aria-busy", "true");
      status.dataset.state = "sending";
      status.textContent = "Sending your inquiry...";

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) {
          let message = "We could not send your inquiry online.";
          try {
            const result = await response.json();
            if (Array.isArray(result.errors) && result.errors.length) {
              message = result.errors.map((error) => error.message).join(" ");
            }
          } catch (error) {
            // Use the fallback message when Formspree does not return JSON.
          }
          throw new Error(message);
        }

        status.dataset.state = "success";
        status.textContent = "Thanks. Your inquiry has been sent. We will reply by email.";
        form.reset();
      } catch (error) {
        status.dataset.state = "error";
        status.textContent = `${error.message} Please email us directly at hz18751992559@gmail.com.`;
      } finally {
        if (submitButton) submitButton.disabled = false;
        if (submitLabel) submitLabel.textContent = defaultSubmitLabel;
        form.removeAttribute("aria-busy");
      }
    });
  }
});
