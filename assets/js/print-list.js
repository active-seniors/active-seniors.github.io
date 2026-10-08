/* Print list — "add to basket" for listings, except the basket is a page you
 * print instead of buy. See active-seniors.github.io#153.
 *
 * sessionStorage, not a cookie and not localStorage: a GP or family member
 * builds a shortlist and prints it there and then, in one sitting — nothing
 * needs to survive closing the browser, and the person whose activities these
 * are has no reason to want a list of them sitting around indefinitely. As a
 * bonus, sessionStorage isn't a cookie at all, so "some people block
 * cookies" (the concern raised on the issue) doesn't apply to it, and no
 * cookie-consent banner is needed. No login, no account — just this tab's
 * session, same as the brief asked for.
 *
 * Storage can throw (private browsing in some older browsers, or a user's
 * own privacy settings) — every access is wrapped so the feature just quietly
 * stops persisting rather than breaking the page.
 */
(function () {
  var KEY = 'jig-print-list';

  function readIds() {
    try {
      var raw = sessionStorage.getItem(KEY);
      var ids = raw ? JSON.parse(raw) : [];
      return Array.isArray(ids) ? ids : [];
    } catch (e) {
      return [];
    }
  }

  function writeIds(ids) {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(ids));
    } catch (e) {
      // Storage unavailable — the list just won't persist. Buttons on the
      // current page still toggle visually via the DOM update below, so
      // nothing looks broken, it just won't survive navigation.
    }
  }

  var PrintList = {
    get: readIds,
    has: function (id) {
      return readIds().indexOf(id) !== -1;
    },
    add: function (id) {
      var ids = readIds();
      if (ids.indexOf(id) === -1) {
        ids.push(id);
        writeIds(ids);
      }
      notify();
    },
    remove: function (id) {
      writeIds(readIds().filter(function (existing) { return existing !== id; }));
      notify();
    },
    toggle: function (id) {
      if (PrintList.has(id)) { PrintList.remove(id); } else { PrintList.add(id); }
    },
    count: function () {
      return readIds().length;
    },
    clear: function () {
      writeIds([]);
      notify();
    },
  };

  function notify() {
    document.dispatchEvent(new CustomEvent('printlist:change'));
  }

  function labelFor(button, onList) {
    return onList
      ? (button.getAttribute('data-label-remove') || '✓ On your print list — remove')
      : (button.getAttribute('data-label-add') || 'Add to print list');
  }

  function refreshButton(button) {
    var id = button.getAttribute('data-id');
    var onList = PrintList.has(id);
    button.textContent = labelFor(button, onList);
    button.setAttribute('aria-pressed', onList ? 'true' : 'false');
    button.classList.toggle('on-print-list', onList);
  }

  function refreshAllButtons() {
    var buttons = document.querySelectorAll('.print-list-toggle[data-id]');
    for (var i = 0; i < buttons.length; i++) { refreshButton(buttons[i]); }
  }

  function refreshCountBadges() {
    var count = PrintList.count();
    var badges = document.querySelectorAll('.print-list-count');
    for (var i = 0; i < badges.length; i++) {
      badges[i].textContent = count;
      badges[i].hidden = count === 0;
    }
  }

  // One delegated listener covers every page this script is loaded on —
  // listing cards, listing detail pages, and the print-list page itself all
  // use the same .print-list-toggle button with a data-id.
  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('.print-list-toggle[data-id]');
    if (!button) return;
    PrintList.toggle(button.getAttribute('data-id'));
  });

  document.addEventListener('printlist:change', function () {
    refreshAllButtons();
    refreshCountBadges();
  });

  document.addEventListener('DOMContentLoaded', function () {
    refreshAllButtons();
    refreshCountBadges();
  });

  window.PrintList = PrintList;
})();
