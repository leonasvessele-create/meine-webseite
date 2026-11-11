/* Grünwerk Albers · Beispielseite von Hand & Fuß Webseiten
   Keine Scroll-Handler: alles über IntersectionObserver. */
(function () {
  'use strict';

  // Hero: Tafel einfahren, sobald das Bild bereit ist
  var hero = document.querySelector('.hero');
  if (hero) {
    var img = hero.querySelector('.hero-bild img');
    var los = function () { requestAnimationFrame(function () { hero.classList.add('geladen'); }); };
    if (!img || img.complete) los();
    else { img.addEventListener('load', los, { once: true }); img.addEventListener('error', los, { once: true }); setTimeout(los, 1200); }
  }

  // Einblenden beim Scrollen
  var auf = document.querySelectorAll('.auf');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('da'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    auf.forEach(function (el) { io.observe(el); });
  } else {
    auf.forEach(function (el) { el.classList.add('da'); });
  }

  // Menü am Handy
  var knopf = document.querySelector('.menue-knopf');
  var menue = document.getElementById('menue');
  if (knopf && menue) {
    var zu = function () { knopf.setAttribute('aria-expanded', 'false'); knopf.setAttribute('aria-label', 'Menü öffnen'); menue.hidden = true; };
    knopf.addEventListener('click', function () {
      var offen = knopf.getAttribute('aria-expanded') === 'true';
      knopf.setAttribute('aria-expanded', String(!offen));
      knopf.setAttribute('aria-label', offen ? 'Menü öffnen' : 'Menü schließen');
      menue.hidden = offen;
    });
    menue.addEventListener('click', function (e) { if (e.target.closest('a')) zu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menue.hidden) { zu(); knopf.focus(); } });
  }

  // Handy-Dock: weg, solange Hero, Kontakt oder Fuß sichtbar sind
  var dock = document.getElementById('dock');
  if (dock && 'IntersectionObserver' in window) {
    var sichtbar = new Set();
    var dio = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) { if (e.isIntersecting) sichtbar.add(e.target); else sichtbar.delete(e.target); });
      dock.classList.toggle('weg', sichtbar.size > 0);
    });
    ['.hero', '#kontakt', '.fuss'].forEach(function (s) { var el = document.querySelector(s); if (el) dio.observe(el); });
  }

  // Knöpfe mit Vorauswahl ("Pflegevertrag anfragen")
  document.querySelectorAll('[data-vorhaben]').forEach(function (a) {
    a.addEventListener('click', function () {
      var r = document.querySelector('input[name="vorhaben"][value="' + a.getAttribute('data-vorhaben') + '"]');
      if (r) r.checked = true;
    });
  });

  // Formular: Beispielseite, verschickt nichts
  var form = document.getElementById('anfrage');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var erstes = null;
      form.querySelectorAll('.fehler').forEach(function (f) { f.remove(); });
      form.querySelectorAll('[required]').forEach(function (feld) {
        var leer = feld.type === 'checkbox' ? !feld.checked : !feld.value.trim();
        feld.setAttribute('aria-invalid', leer ? 'true' : 'false');
        if (leer) {
          if (feld.type !== 'checkbox') {
            var m = document.createElement('span');
            m.className = 'fehler';
            m.setAttribute('role', 'alert');
            m.id = feld.id + '-fehler';
            m.textContent = feld.name === 'name' ? 'Bitte geben Sie Ihren Namen an.' : 'Bitte geben Sie eine Telefonnummer an, damit wir Sie zurückrufen können.';
            feld.setAttribute('aria-describedby', m.id);
            feld.parentNode.appendChild(m);
          } else {
            feld.closest('label').style.color = '#a3261b';
          }
          if (!erstes) erstes = feld;
        } else if (feld.type === 'checkbox') {
          feld.closest('label').style.color = '';
        }
      });
      if (erstes) { erstes.focus(); return; }
      form.querySelector('.danke').hidden = false;
      form.querySelector('button[type="submit"]').disabled = true;
    });
  }
})();
