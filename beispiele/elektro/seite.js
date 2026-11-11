// Elektro Brandt · Beispielseite von Hand & Fuß Webseiten
(function () {
  'use strict';

  // Lichtschalter: Der Startbereich beginnt in der Dämmerung, ein Klick macht Licht
  var start = document.getElementById('start');
  if (start) {
    var wippe = start.querySelector('.schalter-wippe');
    var text = start.querySelector('.schalter-beschriftung');
    var schalten = function (an) {
      start.classList.toggle('dunkel', !an);
      wippe.setAttribute('aria-pressed', String(an));
      text.textContent = an
        ? 'Licht ist an. So schnell geht’s, wenn alles richtig verdrahtet ist.'
        : 'Dunkel? Drücken Sie den Schalter. Bei Ihnen zu Hause machen wir das.';
    };
    schalten(!start.classList.contains('dunkel'));
    wippe.addEventListener('click', function () {
      schalten(wippe.getAttribute('aria-pressed') !== 'true');
    });
  }

  // Einblenden beim Scrollen: IntersectionObserver statt Scroll-Handler
  var zeigen = document.querySelectorAll('.zeigen');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var beobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('da'); beobachter.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    zeigen.forEach(function (el, i) {
      if (el.parentElement && el.parentElement.classList.contains('katalog-liste')) {
        el.style.setProperty('--v', (Array.prototype.indexOf.call(el.parentElement.children, el) * 70) + 'ms');
      }
      // Was beim Laden schon im Bild ist, steht sofort da (kein leerer erster Eindruck)
      if (el.getBoundingClientRect().top < window.innerHeight) { el.classList.add('da'); return; }
      beobachter.observe(el);
    });
  } else {
    zeigen.forEach(function (el) { el.classList.add('da'); });
  }

  // Anruf-Leiste auf dem Handy: weg, solange Startbereich, Kontakt oder Fußzeile sichtbar sind
  var leiste = document.querySelector('.anruf-leiste');
  var zonen = [document.querySelector('.start'), document.getElementById('kontakt'), document.querySelector('.fuss')].filter(Boolean);
  if (leiste && 'IntersectionObserver' in window) {
    var sichtbar = new Set();
    var zonenBeobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) { if (e.isIntersecting) sichtbar.add(e.target); else sichtbar.delete(e.target); });
      leiste.classList.toggle('weg', sichtbar.size > 0);
    }, { threshold: 0 });
    zonen.forEach(function (z) { zonenBeobachter.observe(z); });
  } else if (leiste) {
    leiste.classList.remove('weg');
  }

  // Anfrage: Thema vorwählen, Notfall leitet ans Telefon
  var formular = document.getElementById('anfrage');
  if (!formular) return;
  var rest = document.getElementById('anfrage-rest');
  var notfall = document.getElementById('notfall-hinweis');
  var meldung = formular.querySelector('.formular-meldung');

  function themaGeaendert() {
    var gewaehlt = formular.querySelector('input[name="thema"]:checked');
    var istNotfall = gewaehlt && gewaehlt.value === 'E-05';
    notfall.hidden = !istNotfall;
    rest.hidden = istNotfall;
  }
  formular.addEventListener('change', function (e) {
    if (e.target.name === 'thema') themaGeaendert();
  });

  document.querySelectorAll('[data-thema]').forEach(function (link) {
    link.addEventListener('click', function () {
      var feld = formular.querySelector('input[name="thema"][value="' + link.dataset.thema + '"]');
      if (feld) { feld.checked = true; themaGeaendert(); }
    });
  });

  // Beispielseite: Das Formular verschickt nichts, es prüft nur die Felder und zeigt eine Bestätigung
  formular.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!formular.checkValidity()) {
      var erstes = formular.querySelector('#anfrage-rest :invalid');
      meldung.textContent = erstes && erstes.type === 'checkbox'
        ? 'Bitte setzen Sie noch das Häkchen zur Datenschutz-Einwilligung.'
        : 'Bitte tragen Sie noch Name und Telefonnummer ein, damit wir Sie zurückrufen können.';
      if (erstes) erstes.focus();
      return;
    }
    meldung.textContent = 'Danke! Auf einer echten Seite wäre Ihre Anfrage jetzt angekommen, und wir würden Sie am nächsten Werktag zurückrufen.';
  });
})();
