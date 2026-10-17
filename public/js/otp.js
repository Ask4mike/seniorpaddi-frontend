// Confirm-your-phone page helpers. Without this file the page uses one code box and a plain "Send a new code" button.
//   1. OTPInput: six big boxes that fill the real code box (typing moves on, paste fills them all, Backspace goes back)
//   2. Resend countdown: "Resend code in 00:60", counted from the time the code was asked for (not from a ticking
//      timer), so it stays right if the phone sleeps. Then "Resend code" sends a new one with the existing form.
//   3. After a resend: a pop-up "A new code has been sent to 0803•••4567", or a friendly note if it was too soon.
(function () {
  var WAIT_MS = 60 * 1000; // the server also refuses a new code within 60 seconds
  var store = window.sessionStorage;
  function get(k) { try { return store.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { store.setItem(k, v); } catch (e) { /* private mode: the countdown just starts from now */ } }
  function del(k) { try { store.removeItem(k); } catch (e) { /* ignore */ } }

  // ---------- 1. six boxes ----------
  document.querySelectorAll('[data-otp-for]').forEach(function (group) {
    var source = document.getElementById(group.getAttribute('data-otp-for'));
    var form = source && source.form;
    if (!source || !form) return;
    var error = document.getElementById(source.id + '-error');
    var label = document.querySelector('label[for="' + source.id + '"]');
    var boxes = [];

    for (var i = 0; i < 6; i++) {
      var box = document.createElement('input');
      box.type = 'text';
      box.inputMode = 'numeric';
      box.autocomplete = i === 0 ? 'one-time-code' : 'off';
      box.maxLength = 6; // lets a phone paste or auto-fill the whole code into one box; it is spread out below
      box.className = 'otp-box';
      box.id = source.id + '-' + (i + 1);
      box.setAttribute('aria-label', group.getAttribute('data-digit-label').replace('{n}', i + 1));
      box.setAttribute('aria-describedby', source.id + '-error');
      group.appendChild(box);
      boxes.push(box);
    }
    // the real box stays in the form (it is what is sent) but is no longer shown or required by the browser
    source.hidden = true;
    source.required = false;
    source.tabIndex = -1;
    group.hidden = false;
    if (label) label.htmlFor = boxes[0].id;
    // a code already in the real box (Back button) goes back into the boxes
    String(source.value || '').replace(/\D/g, '').slice(0, 6).split('').forEach(function (d, n) { boxes[n].value = d; });

    function sync() {
      source.value = boxes.map(function (b) { return b.value; }).join('');
      if (source.value.length === 6) clearError();
    }
    function fill(from, digits) {
      digits = digits.replace(/\D/g, '');
      for (var k = 0; k < digits.length && from + k < 6; k++) boxes[from + k].value = digits[k];
      sync();
      var next = Math.min(from + digits.length, 5);
      boxes[next].focus();
      boxes[next].select();
    }
    function showError() {
      error.textContent = form.getAttribute('data-msg-incomplete');
      error.hidden = false;
      group.setAttribute('aria-invalid', 'true');
    }
    function clearError() {
      if (!error.hidden) { error.hidden = true; error.textContent = ''; }
      group.removeAttribute('aria-invalid');
    }

    boxes.forEach(function (box, n) {
      box.addEventListener('focus', function () { box.select(); });
      box.addEventListener('input', function () {
        var digits = box.value.replace(/\D/g, '');
        box.value = '';
        if (digits.length > 1) { fill(n, digits); return; } // auto-fill or a fast typist
        box.value = digits;
        sync();
        if (digits && n < 5) boxes[n + 1].focus();
      });
      box.addEventListener('paste', function (e) {
        var text = (e.clipboardData || window.clipboardData).getData('text');
        if (!text) return;
        e.preventDefault();
        fill(n, text);
      });
      box.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !box.value && n > 0) { e.preventDefault(); boxes[n - 1].value = ''; boxes[n - 1].focus(); sync(); }
        else if (e.key === 'ArrowLeft' && n > 0) { e.preventDefault(); boxes[n - 1].focus(); }
        else if (e.key === 'ArrowRight' && n < 5) { e.preventDefault(); boxes[n + 1].focus(); }
      });
    });

    form.addEventListener('submit', function (e) {
      sync();
      if (source.value.length !== 6) {
        e.preventDefault();
        showError();
        var empty = boxes.filter(function (b) { return !b.value; })[0] || boxes[0];
        empty.focus();
      }
    });
  });

  // ---------- 2. countdown, and remembering when a code was asked for ----------
  var timers = [];

  document.querySelectorAll('form[data-send-form]').forEach(function (form) {
    var channel = form.getAttribute('data-channel');
    var btn = form.querySelector('[data-resend]');

    form.addEventListener('submit', function (e) {
      setTimeout(function () {
        if (e.defaultPrevented) return;
        set('sp-otp-sent-' + channel, String(Date.now()));
        if (btn) set('sp-otp-resent', channel);
      }, 0);
    });

    if (!btn) return; // no code yet: the big "Text me a code" button is all there is
    var labelEl = btn.querySelector('[data-resend-label]');
    var status = form.querySelector('[data-resend-status]');
    var sentAt = Number(get('sp-otp-sent-' + channel));
    // landed here right after a code was sent but nothing was remembered (new tab, private mode): count from now
    if (!sentAt || Date.now() - sentAt > WAIT_MS * 10) { sentAt = Date.now(); set('sp-otp-sent-' + channel, String(sentAt)); }

    function render() {
      var left = Math.ceil((sentAt + WAIT_MS - Date.now()) / 1000);
      if (left > 0) {
        btn.disabled = true;
        labelEl.textContent = btn.getAttribute('data-label-wait').replace('{time}', '00:' + (left < 10 ? '0' : '') + left);
        return false;
      }
      btn.disabled = false;
      labelEl.textContent = btn.getAttribute('data-label-ready');
      if (status) status.textContent = btn.getAttribute('data-label-ready'); // said once, not every second
      return true;
    }
    if (!render()) {
      var t = setInterval(function () { if (render()) clearInterval(t); }, 250);
      timers.push(t);
      // after the phone wakes up, show the right time straight away
      document.addEventListener('visibilitychange', function () { if (!document.hidden) render(); });
    }
  });

  window.addEventListener('pagehide', function () { timers.forEach(clearInterval); timers = []; });

  // ---------- 3. after a resend: the pop-up, or a friendly note ----------
  var resentChannel = get('sp-otp-resent');
  if (resentChannel) {
    del('sp-otp-resent');
    var btn = document.querySelector('[data-resend][data-channel="' + resentChannel + '"]');
    if (btn) {
      if (btn.hasAttribute('data-asked-too-soon')) {
        var failed = btn.form.querySelector('[data-resend-failed]');
        if (failed) {
          failed.hidden = false;
          // the same news is already at the top of the page; one message, next to the button, is clearer
          var wait = btn.getAttribute('data-wait-text');
          document.querySelectorAll('.alert').forEach(function (a) { if (a !== failed && a.textContent.trim() === wait) a.hidden = true; });
        }
      } else {
        var modal = document.getElementById('resent-modal');
        var text = document.getElementById('resent-text');
        if (modal && text && window.SP && window.SP.openModal) {
          text.textContent = resentChannel === 'email'
            ? modal.getAttribute('data-msg-email').replace('{email}', maskEmail(modal.getAttribute('data-email')))
            : modal.getAttribute('data-msg-phone').replace('{phone}', maskPhone(modal.getAttribute('data-phone')));
          // the resend link is counting down again, so focus comes back to the first code box
          window.SP.openModal(modal, { trigger: document.querySelector('.otp-box') || btn });
        }
      }
    }
  }

  function maskPhone(phone) {
    var d = String(phone || '').replace(/\D/g, '');
    return d.length >= 8 ? d.slice(0, 4) + '•••' + d.slice(-4) : '•••';
  }
  function maskEmail(email) {
    var parts = String(email || '').split('@');
    return parts.length === 2 ? parts[0].slice(0, 2) + '•••@' + parts[1] : '•••';
  }
})();
