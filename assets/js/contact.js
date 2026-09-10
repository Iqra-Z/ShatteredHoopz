/**
 * contact.js
 * Frontend-only validation for the contact form. There is no backend in
 * this demo, so submission is simulated with a success state.
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const successMessage = document.querySelector("[data-contact-success]");

  const fields = {
    name: { el: form.querySelector("#contact-name"), validate: (v) => v.trim().length > 1 },
    email: { el: form.querySelector("#contact-email"), validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    subject: { el: form.querySelector("#contact-subject"), validate: (v) => v.trim().length > 2 },
    message: { el: form.querySelector("#contact-message"), validate: (v) => v.trim().length > 9 },
  };

  Object.entries(fields).forEach(([key, field]) => {
    if (!field.el) return;
    field.el.addEventListener("blur", () => validateField(key));
  });

  function validateField(key) {
    const field = fields[key];
    const errorEl = form.querySelector(`[data-error-for="${key}"]`);
    const isValid = field.validate(field.el.value);
    field.el.setAttribute("aria-invalid", String(!isValid));
    if (errorEl) errorEl.textContent = isValid ? "" : errorEl.dataset.message || "This field looks incomplete.";
    return isValid;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const allValid = Object.keys(fields).every((key) => validateField(key));
    if (!allValid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // No backend is wired up — this simulates a successful submission
    // for portfolio/demo purposes only.
    form.hidden = true;
    if (successMessage) {
      successMessage.hidden = false;
      successMessage.focus();
    }
    form.reset();
  });
});
