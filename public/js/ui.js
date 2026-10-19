// Shared page helpers. Every page works without this file; it only adds:
//   1. Modal: pop-ups opened by a script (focus trap, Escape, backdrop tap, scroll lock, focus goes back)
//   2. show/hide eye on password fields
//   3. busy buttons ("Logging you in..." with a spinner) on forms that have data-busy-text
//   4. "Confirm password" must match "Password" (Create account)
//   5. "Log out" asks first, everywhere (forms with data-confirm-logout)
// It never changes what a form sends.
(function () {
  var SP = (window.SP = window.SP || {});
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  // ---------- 1. Modal ----------
  var open = null; // { el, backdrop, trigger, onClose }

  function visible(el) { return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0; }

  function onKey(e) {
    if (!open) return;
    if (e.key === 'Escape' && !e.isComposing) { e.preventDefault(); SP.closeModal(); return; }
    if (e.key !== 'Tab') return;
    var items = Array.prototype.filter.call(open.el.querySelectorAll(FOCUSABLE), visible);
    if (!items.length) { e.preventDefault(); return; }
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || !open.el.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  SP.openModal = function (el, options) {
    if (!el) return;
    if (open) SP.closeModal(true);
    options = options || {};
    var backdrop = document.querySelector('[data-modal-backdrop="' + el.id + '"]');
    open = { el: el, backdrop: backdrop, trigger: options.trigger || document.activeElement, onClose: options.onClose };
    if (backdrop) { backdrop.hidden = false; backdrop.addEventListener('click', backdropClose); }
    el.hidden = false;
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onKey);
    var first = el.querySelector('[data-modal-initial]') || el.querySelector(FOCUSABLE);
    if (first) first.focus();
  };

  SP.closeModal = function (silent) {
    if (!open) return;
    var o = open;
    open = null;
    o.el.hidden = true;
    if (o.backdrop) { o.backdrop.hidden = true; o.backdrop.removeEventListener('click', backdropClose); }
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onKey);
    if (!silent && o.onClose) o.onClose();
    if (o.trigger && document.contains(o.trigger) && typeof o.trigger.focus === 'function') o.trigger.focus();
  };

  function backdropClose() { SP.closeModal(); }

  document.addEventListener('click', function (e) {
    var closer = e.target.closest && e.target.closest('[data-modal-close]');
    if (closer && open && open.el.contains(closer)) SP.closeModal();
  });

  // ---------- 2. Show / hide password ----------
  document.querySelectorAll('[data-password-toggle]').forEach(function (btn) {
    var input = document.getElementById(btn.getAttribute('aria-controls'));
    if (!input) return;
    btn.hidden = false;
    btn.addEventListener('click', function () {
      var show = input.type === 'password';
      var start = input.selectionStart, end = input.selectionEnd;
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-pressed', show ? 'true' : 'false');
      btn.setAttribute('aria-label', btn.getAttribute(show ? 'data-label-hide' : 'data-label-show'));
      var icon = btn.querySelector('i');
      if (icon) icon.className = 'fa-solid ' + (show ? 'fa-eye-slash' : 'fa-eye');
      input.focus();
      try { input.setSelectionRange(start, end); } catch (err) { /* some types do not allow it */ }
    });
  });

  // ---------- 3. Busy buttons ----------
  function setBusy(form, busy) {
    var btn = form.querySelector('button:not([type="button"])');
    if (!btn) return;
    if (busy) {
      if (btn.getAttribute('aria-busy') === 'true') return;
      btn.setAttribute('data-idle-html', btn.innerHTML);
      btn.setAttribute('aria-busy', 'true');
      btn.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span><span></span>';
      btn.lastChild.textContent = form.getAttribute('data-busy-text');
      // stops a second tap from sending the form twice; the form is already on its way
      btn.disabled = true;
    } else if (btn.hasAttribute('data-idle-html')) {
      btn.innerHTML = btn.getAttribute('data-idle-html');
      btn.removeAttribute('aria-busy');
      btn.disabled = false;
    }
  }
  SP.setBusy = setBusy;

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.hasAttribute || !form.hasAttribute('data-busy-text')) return;
    // wait until every other check on this form has run: only a form that is really being sent gets the busy state
    setTimeout(function () { if (!e.defaultPrevented) setBusy(form, true); }, 0);
  });

  // coming back with the Back button: buttons are usable again
  window.addEventListener('pageshow', function () {
    document.querySelectorAll('form[data-busy-text]').forEach(function (form) { setBusy(form, false); });
  });

  // ---------- 4. Confirm password ----------
  document.querySelectorAll('[data-confirm-for]').forEach(function (field) {
    var pass = document.getElementById(field.getAttribute('data-confirm-for'));
    var confirm = field.querySelector('input');
    var error = field.querySelector('.error');
    var ok = field.querySelector('.ok');
    var form = confirm && confirm.form;
    if (!pass || !confirm || !error || !ok || !form) return;

    function showError(message) {
      error.textContent = message;
      error.hidden = false;
      ok.hidden = true;
      confirm.setAttribute('aria-invalid', 'true');
    }
    function clearError() {
      error.textContent = '';
      error.hidden = true;
      confirm.setAttribute('aria-invalid', 'false');
    }
    // live: a quiet "The passwords match" as soon as they do; no scolding while someone is still typing
    function live() {
      var match = confirm.value !== '' && confirm.value === pass.value;
      ok.hidden = !match;
      if (match || confirm.value === '') clearError();
    }
    // when they leave the box (and on submit): say clearly if it does not match
    function check(onSubmit) {
      if (confirm.value === '') {
        if (onSubmit) showError(field.getAttribute('data-msg-empty'));
        return !onSubmit;
      }
      if (confirm.value !== pass.value) { showError(field.getAttribute('data-msg-mismatch')); return false; }
      clearError();
      ok.hidden = false;
      return true;
    }
    confirm.addEventListener('input', live);
    pass.addEventListener('input', function () { if (confirm.value) live(); });
    confirm.addEventListener('blur', function () { check(false); });
    form.addEventListener('submit', function (e) {
      if (!check(true)) { e.preventDefault(); confirm.focus(); }
    });
  });

  // ---------- 5. Log out asks first ----------
  var logoutModal = document.getElementById('logout-modal');
  var pendingLogout = null;
  if (logoutModal) {
    document.addEventListener('submit', function (e) {
      var form = e.target;
      if (!form.hasAttribute || !form.hasAttribute('data-confirm-logout')) return;
      if (form.getAttribute('data-confirmed') === 'yes') return; // they said yes: let it go
      e.preventDefault();
      pendingLogout = form;
      SP.openModal(logoutModal, { trigger: e.submitter || form.querySelector('button') });
    }, true);
    logoutModal.querySelector('[data-logout-confirm]').addEventListener('click', function () {
      if (!pendingLogout) return;
      var form = pendingLogout;
      form.setAttribute('data-confirmed', 'yes');
      SP.closeModal(true);
      if (form.requestSubmit) form.requestSubmit(); else form.submit();
    });
  }
})();
