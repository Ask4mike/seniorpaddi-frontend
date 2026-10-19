// Thin progress bar at the top while the next page loads. Only shows and hides #top-loader; it never stops,
// delays or changes a click or a form. Pages work the same without this file.
(function () {
  try {
    var bar = document.getElementById('top-loader');
    if (!bar) return;
    var timer;

    function hide() {
      clearTimeout(timer);
      bar.classList.remove('is-loading', 'is-done');
    }
    function start() {
      hide();
      void bar.offsetWidth; // start again from zero
      bar.classList.add('is-loading');
      timer = setTimeout(hide, 15000); // a download or a cancelled page: never stay on screen
    }

    document.addEventListener('click', function (e) {
      try {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var a = e.target.closest && e.target.closest('a[href]');
        if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
        var url = new URL(a.href, location.href);
        if (url.origin !== location.origin) return; // other sites, tel:, mailto:
        if (url.hash && url.pathname === location.pathname && url.search === location.search) return; // same page
        start();
      } catch (err) { /* never get in the way */ }
    }, { passive: true });

    document.addEventListener('submit', function (e) {
      try {
        var form = e.target;
        if (e.defaultPrevented || (form.target && form.target !== '_self')) return; // handled by a script, or a new tab
        start();
      } catch (err) { /* never get in the way */ }
    }, { passive: true });

    // leaving: fill the bar. Coming back (also from the back/forward cache): reset it
    window.addEventListener('pagehide', function () { if (bar.classList.contains('is-loading')) bar.classList.add('is-done'); });
    window.addEventListener('pageshow', hide);
  } catch (err) { /* never get in the way */ }
})();
