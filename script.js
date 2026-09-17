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
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const subject = `Wholesale inquiry: ${data.get("interest")}`;
      const body = [
        `Name: ${data.get("name")}`,
        `Company: ${data.get("company") || "Not provided"}`,
        `Email: ${data.get("email")}`,
        `Country / region: ${data.get("country") || "Not provided"}`,
        `Product: ${data.get("interest")}`,
        `Estimated quantity: ${data.get("quantity") || "Not provided"}`,
        `Required delivery date: ${data.get("delivery") || "Not provided"}`,
        `OEM / ODM requirements: ${data.get("customization") || "Not provided"}`,
        "",
        String(data.get("message"))
      ].join("\n");
      status.textContent = "Opening your email app. If it does not open, email us directly at hz18751992559@gmail.com.";
      window.location.href = `mailto:hz18751992559@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
});
