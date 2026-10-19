// Pop-up dialogs (log in / sign up, "you're registered", incoming request): keyboard and screen-reader help.
// The dialog and the page work without this file. It only adds three things:
//   1. focus moves into the dialog, onto its title, so a screen reader reads it first
//   2. the page behind the dialog is switched off (inert), so Tab and screen-reader browsing stay inside it
//   3. Escape follows the dialog's close link, when it has one (data-dialog-close)
(function () {
  var dialog = document.querySelector('[data-dialog]');
  if (!dialog) return;

  // everything except the dialog and the elements it sits inside becomes inert
  var node = dialog;
  while (node && node !== document.body && node.parentElement) {
    var parent = node.parentElement;
    Array.prototype.forEach.call(parent.children, function (sibling) {
      if (sibling !== node && sibling.tagName !== 'SCRIPT') sibling.setAttribute('inert', '');
    });
    node = parent;
  }

  var titleId = dialog.getAttribute('aria-labelledby');
  var title = titleId ? document.getElementById(titleId) : null;
  var target = title || dialog;
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus();

  // Escape closes the dialog, but never throws away something the person has typed, and never while a letter with an
  // accent or tone mark is still being composed (common when typing Yoruba)
  var closeLink = dialog.querySelector('[data-dialog-close]');
  if (closeLink) {
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || e.defaultPrevented || e.isComposing) return;
      var typed = Array.prototype.some.call(dialog.querySelectorAll('input, textarea'), function (field) {
        return field.type !== 'hidden' && field.type !== 'checkbox' && field.type !== 'radio' && field.type !== 'submit' && field.value;
      });
      if (!typed) window.location.href = closeLink.getAttribute('href');
    });
  }
})();
