/* Sopa · Seitenlogik: Kopf, Menüs, Einblendungen, Leuchtkasten, Projekt-Planer */
(function () {
  "use strict";
  var ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var TEL = "+491749597342", MAIL = "sopa-muharem@gmx.de";

  /* Kopf bekommt beim Scrollen eine Linie */
  var kopf = document.querySelector(".kopf");
  function kopfPruefen() { if (kopf) kopf.classList.toggle("gescrollt", scrollY > 8); }
  addEventListener("scroll", kopfPruefen, { passive: true }); kopfPruefen();

  /* Leistungen-Menü */
  document.querySelectorAll(".menue").forEach(function (m) {
    var knopf = m.querySelector(".menue-knopf"), zu;
    function auf() { clearTimeout(zu); m.setAttribute("data-offen", ""); knopf.setAttribute("aria-expanded", "true"); }
    function weg() { zu = setTimeout(function () { m.removeAttribute("data-offen"); knopf.setAttribute("aria-expanded", "false"); }, 120); }
    m.addEventListener("mouseenter", auf); m.addEventListener("mouseleave", weg);
    knopf.addEventListener("click", function () { m.hasAttribute("data-offen") ? weg() : auf(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") weg(); });
  });

  /* Mobiles Menü */
  var mm = document.querySelector(".mobil-menue"), burger = document.querySelector(".burger");
  if (mm && burger) {
    var schliessen = mm.querySelector(".zu");
    burger.addEventListener("click", function () { mm.classList.add("offen"); burger.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; schliessen.focus(); });
    function menueZu() { mm.classList.remove("offen"); burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }
    schliessen.addEventListener("click", menueZu);
    mm.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", menueZu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") menueZu(); });
  }

  /* Kontakt-Dock fährt kurz nach dem Laden ein und bleibt */
  var dock = document.querySelector(".dock");
  if (dock) setTimeout(function () { dock.classList.remove("start"); }, ruhig ? 0 : 700);

  /* Einblenden beim Scrollen */
  var ziele = document.querySelectorAll(".zeig, .zeig-gruppe");
  if ("IntersectionObserver" in window && !ruhig) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("da"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    ziele.forEach(function (z) { io.observe(z); });
  } else ziele.forEach(function (z) { z.classList.add("da"); });

  /* SOPA im Fuß: Glanz läuft drüber, sobald man unten ankommt */
  var wort = document.querySelector(".fuss-wort");
  if (wort && "IntersectionObserver" in window && !ruhig) {
    var wio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { wort.classList.toggle("glaenzt", e.isIntersecting); });
    }, { threshold: 0.3 });
    wio.observe(wort);
  }

  /* Hero: Muharem legt die Rosette, dann das fertige Mosaik */
  var hb = document.querySelector(".hero-bild");
  if (hb) {
    var tabs = hb.querySelectorAll("[data-zeige-knopf]"), takt;
    function zeige(w) { hb.setAttribute("data-zeige", w); tabs.forEach(function (t) { t.setAttribute("aria-pressed", t.dataset.zeigeKnopf === w ? "true" : "false"); }); }
    tabs.forEach(function (t) { t.addEventListener("click", function () { clearInterval(takt); zeige(t.dataset.zeigeKnopf); }); });
    if (!ruhig) takt = setInterval(function () { zeige(hb.getAttribute("data-zeige") === "nachher" ? "vorher" : "nachher"); }, 5200);
  }

  /* Leuchtkasten für Galerien */
  var galBilder = Array.prototype.slice.call(document.querySelectorAll("[data-gross]"));
  if (galBilder.length) {
    var lk = document.createElement("div");
    lk.className = "leuchtkasten"; lk.setAttribute("role", "dialog"); lk.setAttribute("aria-modal", "true"); lk.setAttribute("aria-label", "Bild vergrößert");
    lk.innerHTML = '<figure style="margin:0"><img alt=""><p></p></figure>' +
      '<button class="lk-zu" aria-label="Schließen"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button>' +
      '<button class="lk-zurueck" aria-label="Vorheriges Bild"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<button class="lk-weiter" aria-label="Nächstes Bild"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
    document.body.appendChild(lk);
    var lkImg = lk.querySelector("img"), lkText = lk.querySelector("p"), pos = 0, vorher = null;
    function lkZeige(i) { pos = (i + galBilder.length) % galBilder.length; var b = galBilder[pos]; lkImg.src = b.dataset.gross; lkImg.alt = b.dataset.text || ""; lkText.textContent = b.dataset.text || ""; }
    function lkAuf(i) { vorher = document.activeElement; lkZeige(i); lk.classList.add("offen"); lk.querySelector(".lk-zu").focus(); }
    function lkZu() { lk.classList.remove("offen"); if (vorher) vorher.focus(); }
    galBilder.forEach(function (b, i) { b.addEventListener("click", function () { lkAuf(i); }); });
    lk.querySelector(".lk-zu").addEventListener("click", lkZu);
    lk.querySelector(".lk-zurueck").addEventListener("click", function () { lkZeige(pos - 1); });
    lk.querySelector(".lk-weiter").addEventListener("click", function () { lkZeige(pos + 1); });
    lk.addEventListener("click", function (e) { if (e.target === lk) lkZu(); });
    document.addEventListener("keydown", function (e) {
      if (!lk.classList.contains("offen")) return;
      if (e.key === "Escape") lkZu(); if (e.key === "ArrowRight") lkZeige(pos + 1); if (e.key === "ArrowLeft") lkZeige(pos - 1);
    });
  }

  /* Galerie-Filter (Projekte-Seite) */
  document.querySelectorAll("[data-filter]").forEach(function (f) {
    f.addEventListener("click", function () {
      var w = f.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach(function (x) { x.setAttribute("aria-pressed", x === f ? "true" : "false"); });
      document.querySelectorAll("[data-art]").forEach(function (b) { b.hidden = !(w === "alle" || b.dataset.art.indexOf(w) > -1); });
    });
  });

  /* =====================================================================
     Projekt-Planer: Besucher wählen Projekt, Größe, Stein, Zeitpunkt.
     Rechts wird live gepflastert. Am Ende geht alles als fertige E-Mail raus.
     ===================================================================== */
  var planer = document.querySelector("[data-planer]");
  if (!planer) return;

  var form = planer.querySelector("form");
  var schritte = Array.prototype.slice.call(form.querySelectorAll(".schritt"));
  var balken = planer.querySelectorAll(".fortschritt span");
  var regler = form.querySelector(".regler");
  var ausgabe = form.querySelector(".flaeche-anzeige output");
  var einheit = form.querySelector(".flaeche-anzeige span");
  var skala = form.querySelector(".regler-skala");
  var groesseTitel = form.querySelector("[data-groesse-titel]");
  var schnell = form.querySelector(".schnellwahl");
  var canvas = planer.querySelector("canvas");
  var ctx = canvas.getContext("2d");
  var infoProjekt = planer.querySelector("[data-info=projekt]");
  var infoGroesse = planer.querySelector("[data-info=groesse]");
  var infoStein = planer.querySelector("[data-info=stein]");
  var buehneTitel = planer.querySelector("[data-info=titel]");
  var akt = 0;

  var ARTEN = {
    einfahrt: { name: "Einfahrt oder Hof", modus: "flaeche", min: 10, max: 250, start: 45, schritt: 5, schnell: [[25, "Stellplatz"], [45, "Einfahrt"], [90, "Doppelgarage"], [180, "Hof"]] },
    terrasse: { name: "Terrasse", modus: "flaeche", min: 5, max: 120, start: 25, schritt: 1, schnell: [[12, "klein"], [25, "mittel"], [45, "groß"]] },
    weg: { name: "Gartenweg", modus: "flaeche", min: 3, max: 100, start: 15, schritt: 1, schnell: [[8, "kurz"], [15, "ums Haus"], [35, "lang"]] },
    platz: { name: "Platz oder Wohnanlage", modus: "flaeche", min: 50, max: 600, start: 150, schritt: 10, schnell: [[100, "100 m²"], [250, "250 m²"], [500, "500 m²"]] },
    mauer: { name: "Mauer", modus: "mauer", min: 2, max: 60, start: 12, schritt: 1, schnell: [[6, "Beet"], [12, "Hangkante"], [30, "Grundstücksgrenze"]] },
    treppe: { name: "Treppe", modus: "treppe", min: 2, max: 30, start: 7, schritt: 1, schnell: [[4, "Eingang"], [8, "Garten"], [16, "Hang"]] }
  };
  var STEINE = {
    granit: { name: "Granit-Kleinpflaster", farben: ["#8d9196", "#9da1a5", "#7b8085", "#a9acaf", "#868a8e"], verband: "reihe" },
    bogen: { name: "Bogenpflaster aus Naturstein", farben: ["#8d9196", "#a3a6a9", "#7d8186", "#b0b1b0", "#94897f"], verband: "bogen" },
    porphyr: { name: "Porphyr, bunt", farben: ["#8a6a5e", "#9b7b6b", "#76655d", "#a88f7c", "#857a72", "#6f5b52"], verband: "bogen" },
    polygonal: { name: "Polygonalplatten", farben: ["#cdb98f", "#d8c7a0", "#bfa77a", "#e0d2ae", "#c9b289"], verband: "polygon" },
    platten: { name: "Großformat-Platten", farben: ["#6d7378", "#757b80", "#686e73", "#7b8085"], verband: "platten" },
    beraten: { name: "Lieber beraten lassen", farben: ["#8d9196", "#9da1a5", "#cdb98f", "#8a6a5e", "#7b8085"], verband: "reihe" }
  };

  function wert(name) { var e = form.querySelector('[name="' + name + '"]:checked'); return e ? e.value : ""; }
  function zahl(n) { return String(n).replace(".", ","); }

  /* ---------- Zufall mit Startwert, damit sich das Bild nicht bei jedem Zeichnen ändert ---------- */
  function zufall(s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

  /* ---------- Steine erzeugen ---------- */
  var W = 1000, H = 800, steine = [], letzteArt = null, letzterStein = null;

  function bauen() {
    var art = ARTEN[wert("projekt") || "einfahrt"], st = STEINE[wert("stein") || "granit"];
    var r = zufall(7), liste = [];
    function farbe() { return st.farben[Math.floor(r() * st.farben.length)]; }

    if (art.modus === "mauer") {
      /* Mauer in Ansicht: Läuferverband, Reihe für Reihe von unten */
      var reihen = 6, hoch = 46, lang = 92;
      for (var z = 0; z < reihen; z++) for (var x = -(z % 2) * lang / 2; x < 920; x += lang) {
        liste.push({ typ: "rechteck", x: 40 + x, y: 640 - (z + 1) * hoch, w: lang - 5, h: hoch - 5, f: farbe(), m: (x + 40) / 920 });
      }
    } else if (art.modus === "treppe") {
      /* Treppe von der Seite: jede Stufe ein Blockstein */
      for (var s = 0; s < 30; s++) liste.push({ typ: "stufe", i: s, f: farbe() });
    } else if (st.verband === "bogen") {
      /* Segmentbogen: jede Steinreihe folgt einer Bogenlinie, Steine im Abstand der Steingröße */
      var gr = 21, P = 150, A = 44;
      for (var base = -A - gr; base < H + gr; base += gr) {
        var weg = 0, vx = -40, vy = base + A * Math.pow(((((vx % P) + P) % P) / (P / 2) - 1), 2);
        for (var x = -40; x < W + 40; x += 1.5) {
          var u = (((x % P) + P) % P) / (P / 2) - 1, y = base + A * u * u;
          weg += Math.sqrt((x - vx) * (x - vx) + (y - vy) * (y - vy));
          if (weg >= gr) { weg = 0; liste.push({ typ: "wuerfel", x: x, y: y, s: gr - 3.5 + (r() - .5) * 2, d: Math.atan2(y - vy, x - vx), f: farbe() }); }
          vx = x; vy = y;
        }
      }
    } else if (st.verband === "polygon") {
      /* Polygonalplatten: verschobenes Punktgitter, jede Zelle eine Platte mit schmaler Fuge */
      var schritt = 64, sp = Math.ceil(W / schritt) + 2, ze = Math.ceil(H / schritt) + 2, pk = [];
      for (var a = 0; a < ze; a++) { pk[a] = []; for (var b = 0; b < sp; b++) pk[a][b] = [b * schritt + (r() - .5) * 34 - schritt / 2, a * schritt + (r() - .5) * 34 - schritt / 2]; }
      for (var a2 = 0; a2 < ze - 1; a2++) for (var b2 = 0; b2 < sp - 1; b2++) {
        var ec = [pk[a2][b2], pk[a2][b2 + 1], pk[a2 + 1][b2 + 1], pk[a2 + 1][b2]];
        var mx2 = (ec[0][0] + ec[1][0] + ec[2][0] + ec[3][0]) / 4, my2 = (ec[0][1] + ec[1][1] + ec[2][1] + ec[3][1]) / 4;
        var innen = ec.map(function (p) { var dx = mx2 - p[0], dy = my2 - p[1], l = Math.sqrt(dx * dx + dy * dy) || 1; return [p[0] + dx / l * 3, p[1] + dy / l * 3]; });
        liste.push({ typ: "poly", x: mx2, y: my2, p: innen, f: farbe() });
      }
    } else if (st.verband === "platten") {
      for (var py3 = 0, zz = 0; py3 < H + 80; py3 += 82, zz++) for (var px3 = -(zz % 2) * 80; px3 < W + 160; px3 += 162) {
        liste.push({ typ: "rechteck", x: px3, y: py3, w: 158, h: 78, f: farbe() });
      }
    } else {
      /* Kleinpflaster in Reihen, leicht unregelmäßig */
      for (var py4 = 0, z4 = 0; py4 < H + 30; py4 += 26, z4++) for (var px4 = -(z4 % 2) * 12; px4 < W + 30; px4 += 26) {
        liste.push({ typ: "wuerfel", x: px4 + (r() - .5) * 3, y: py4 + (r() - .5) * 3, s: 22 + (r() - .5) * 4, d: (r() - .5) * .14, f: farbe() });
      }
    }
    return liste;
  }

  /* Welche Steine liegen innerhalb der gewählten Größe? */
  var rahmen = { x: 0, y: 0, w: 0, h: 0 };
  function rahmenRechnen() {
    var art = ARTEN[wert("projekt") || "einfahrt"], v = +regler.value;
    if (art.modus === "flaeche") {
      var anteil = .3 + .7 * Math.sqrt((v - art.min) / (art.max - art.min));
      var w = 880 * anteil, h = 560 * anteil;
      rahmen = { x: (W - w) / 2, y: 200 + (560 - h) / 2, w: w, h: h };
    } else if (art.modus === "mauer") {
      var lang = Math.max(.12, v / art.max) * 920;
      rahmen = { x: 40, y: 0, w: lang, h: H };
    } else rahmen = { anzahl: v };
  }
  function drin(st) {
    var art = ARTEN[wert("projekt") || "einfahrt"];
    if (art.modus === "treppe") return st.i < rahmen.anzahl;
    var x = st.x + (st.w ? st.w / 2 : 0), y = st.y + (st.h ? st.h / 2 : 0);
    return x >= rahmen.x && x <= rahmen.x + rahmen.w && y >= rahmen.y && y <= rahmen.y + rahmen.h;
  }

  function neuBauen() {
    var a = wert("projekt"), s = wert("stein");
    if (a !== letzteArt || s !== letzterStein) {
      steine = bauen(); letzteArt = a; letzterStein = s;
      steine.forEach(function (st) { st.a = 0; });
    }
    rahmenRechnen();
    var mx = rahmen.x + (rahmen.w || 0) / 2, my = rahmen.y + (rahmen.h || 0) / 2;
    /* Verlegereihenfolge: von unten links nach oben rechts, wie ein Pflasterer arbeitet */
    steine.forEach(function (st) { st.in = drin(st); st.o = st.typ === "stufe" ? st.i : (st.y * -1.4 + st.x * .6); });
  }

  /* ---------- Zeichnen ---------- */
  function wuerfel(st) {
    ctx.save(); ctx.translate(st.x, st.y); ctx.rotate(st.d || 0);
    var s = st.s * (0.6 + 0.4 * st.a);
    ctx.fillStyle = st.f; rund(-s / 2, -s / 2, s, s, 3); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.09)"; rund(-s / 2, -s / 2, s, s * .35, 3); ctx.fill();
    ctx.restore();
  }
  function rund(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  function zeichnen() {
    var art = ARTEN[wert("projekt") || "einfahrt"];
    ctx.clearRect(0, 0, W, H);
    /* Untergrund: Splitt */
    ctx.fillStyle = "#2b3034"; ctx.fillRect(0, 0, W, H);

    if (art.modus === "treppe") {
      var n = rahmen.anzahl, stufeB = Math.min(70, 760 / n), stufeH = Math.min(46, 560 / n);
      var x0 = 120, y0 = 700;
      ctx.fillStyle = "#3b4146"; ctx.beginPath(); ctx.moveTo(x0, y0);
      for (var i = 0; i < n; i++) { ctx.lineTo(x0 + i * stufeB, y0 - (i + 1) * stufeH); ctx.lineTo(x0 + (i + 1) * stufeB, y0 - (i + 1) * stufeH); }
      ctx.lineTo(x0 + n * stufeB, y0); ctx.closePath(); ctx.fill();
      steine.forEach(function (st) {
        if (!(st.a > 0.01)) return;
        var x = x0 + st.i * stufeB, y = y0 - (st.i + 1) * stufeH - (1 - st.a) * 30;
        ctx.globalAlpha = st.a; ctx.fillStyle = st.f; rund(x - 4, y, stufeB + 10, Math.max(12, stufeH * .55), 3); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fillRect(x - 2, y + 2, stufeB + 6, 3);
        ctx.globalAlpha = 1;
      });
      masse(x0, y0 + 30, n * stufeB, n + " Stufen", true);
      masse(x0 - 40, y0, n * stufeH, "", false);
      return;
    }

    if (art.modus === "mauer") {
      /* Erdreich hinter der Mauer, Boden davor */
      ctx.fillStyle = "#33393d"; ctx.fillRect(0, 640, W, 160);
      ctx.fillStyle = "#3d3a36"; ctx.fillRect(0, 300, W, 50);
    } else {
      /* Raster, 1 Feld = Orientierung, und das Haus als Bezug */
      ctx.strokeStyle = "rgba(255,255,255,.035)"; ctx.lineWidth = 1;
      for (var gx = 0; gx <= W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
      for (var gy = 0; gy <= H; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }
      var hausB = art.modus === "flaeche" && wert("projekt") !== "platz" ? Math.max(rahmen.w * .7, 300) : 0;
      if (hausB) {
        var hx = W / 2 - hausB / 2, hy = 40, hh = Math.max(60, rahmen.y - 52);
        ctx.fillStyle = "#3a4045"; rund(hx, hy, hausB, hh, 6); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hx, hy + hh / 2); ctx.lineTo(hx + hausB, hy + hh / 2); ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,.45)"; ctx.font = "600 22px 'Schibsted Grotesk', system-ui, sans-serif"; ctx.textBaseline = "middle";
        var ht = wert("projekt") === "einfahrt" ? "Haus / Garage" : "Haus"; ctx.fillText(ht, W / 2 - ctx.measureText(ht).width / 2, hy + hh / 2 - 22);
      }
      /* Fläche abgesteckt: gestrichelte Schnur */
      ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 2;
      ctx.strokeRect(rahmen.x - 6, rahmen.y - 6, rahmen.w + 12, rahmen.h + 12); ctx.restore();
    }

    ctx.save();
    if (art.modus === "flaeche") { ctx.beginPath(); ctx.rect(rahmen.x, rahmen.y, rahmen.w, rahmen.h); ctx.clip(); }
    steine.forEach(function (st) {
      if (!(st.a > 0.01)) return;
      ctx.globalAlpha = Math.min(1, st.a * 1.2);
      if (st.typ === "wuerfel") wuerfel(st);
      else if (st.typ === "rechteck") {
        var hub = (1 - st.a) * -24;
        ctx.fillStyle = st.f; rund(st.x, st.y + hub, st.w, st.h, 4); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.08)"; rund(st.x, st.y + hub, st.w, st.h * .3, 4); ctx.fill();
      } else if (st.typ === "poly") {
        ctx.save(); ctx.translate(st.x, st.y); var sk = .7 + .3 * st.a; ctx.scale(sk, sk); ctx.translate(-st.x, -st.y);
        ctx.fillStyle = st.f; ctx.beginPath(); st.p.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    });
    ctx.globalAlpha = 1; ctx.restore();

    if (art.modus === "mauer") masse(rahmen.x, 690, rahmen.w, zahl(+regler.value) + " m Mauer", true);
    else {
      var seite = Math.sqrt(+regler.value);
      masse(rahmen.x, rahmen.y + rahmen.h + 26, rahmen.w, "ca. " + regler.value + " m²", true);
    }
  }
  function masse(x, y, l, text, waag) {
    ctx.save(); ctx.strokeStyle = "#ff8f94"; ctx.fillStyle = "#ff8f94"; ctx.lineWidth = 2;
    ctx.beginPath();
    if (waag) { ctx.moveTo(x, y); ctx.lineTo(x + l, y); ctx.moveTo(x, y - 8); ctx.lineTo(x, y + 8); ctx.moveTo(x + l, y - 8); ctx.lineTo(x + l, y + 8); }
    else { ctx.moveTo(x, y); ctx.lineTo(x, y - l); ctx.moveTo(x - 8, y); ctx.lineTo(x + 8, y); ctx.moveTo(x - 8, y - l); ctx.lineTo(x + 8, y - l); }
    ctx.stroke();
    if (text) {
      ctx.font = "700 26px 'Schibsted Grotesk', system-ui, sans-serif";
      var tw = ctx.measureText(text).width + 24, tx = waag ? x + l / 2 - tw / 2 : x;
      ctx.fillStyle = "#d0121d"; rund(tx, y - 18, tw, 36, 18); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.textBaseline = "middle"; ctx.fillText(text, tx + 12, y + 1);
    }
    ctx.restore();
  }

  /* Animation: Steine werden nacheinander gesetzt */
  var laeuft = false;
  function schleife() {
    var fertig = true;
    var reihe = steine.filter(function (s) { return s.in && s.a < 1; }).sort(function (a, b) { return a.o - b.o; });
    var proBild = ruhig ? 9999 : Math.max(5, Math.ceil(reihe.length / 26));
    reihe.slice(0, proBild * 3).forEach(function (s, i) { s.a = Math.min(1, s.a + (i < proBild ? 0.22 : 0.06)); });
    steine.forEach(function (s) {
      if (!s.in && s.a > 0) s.a = Math.max(0, s.a - 0.12);
      if ((s.in && s.a < 1) || (!s.in && s.a > 0)) fertig = false;
    });
    zeichnen();
    if (!fertig) requestAnimationFrame(schleife); else laeuft = false;
  }
  function anstossen() { neuBauen(); if (!laeuft) { laeuft = true; requestAnimationFrame(schleife); } }

  /* ---------- Formular-Zustand ---------- */
  function reglerEinrichten(behalten) {
    var art = ARTEN[wert("projekt") || "einfahrt"];
    regler.min = art.min; regler.max = art.max; regler.step = art.schritt;
    if (!behalten) regler.value = art.start;
    var e = art.modus === "flaeche" ? "m²" : art.modus === "mauer" ? "Meter" : "Stufen";
    einheit.textContent = e;
    groesseTitel.textContent = art.modus === "flaeche" ? "Wie groß ist die Fläche ungefähr?" : art.modus === "mauer" ? "Wie lang wird die Mauer ungefähr?" : "Wie viele Stufen ungefähr?";
    regler.setAttribute("aria-label", groesseTitel.textContent);
    skala.innerHTML = "<span>" + art.min + " " + e + "</span><span>" + art.max + " " + e + "</span>";
    schnell.innerHTML = "";
    art.schnell.forEach(function (s) {
      var b = document.createElement("button"); b.type = "button"; b.textContent = s[1] + (art.modus === "flaeche" ? " · " + s[0] + " m²" : " · " + s[0] + " " + (art.modus === "mauer" ? "m" : "Stufen"));
      b.addEventListener("click", function () { regler.value = s[0]; reglerAnzeigen(); });
      schnell.appendChild(b);
    });
    reglerAnzeigen();
  }
  function reglerAnzeigen() {
    var p = (regler.value - regler.min) / (regler.max - regler.min) * 100;
    regler.style.setProperty("--p", p + "%");
    ausgabe.textContent = regler.value;
    infosAktualisieren(); anstossen();
  }
  function groesseText() {
    var art = ARTEN[wert("projekt") || "einfahrt"];
    if (form.querySelector("[name=weiss-nicht]").checked) return "weiß ich noch nicht";
    return "ca. " + regler.value + " " + (art.modus === "flaeche" ? "m²" : art.modus === "mauer" ? "Meter" : "Stufen");
  }
  function infosAktualisieren() {
    var art = ARTEN[wert("projekt") || "einfahrt"], st = STEINE[wert("stein") || "granit"];
    infoProjekt.textContent = art.name;
    infoGroesse.textContent = groesseText();
    infoStein.textContent = wert("stein") ? st.name : "noch offen";
    buehneTitel.textContent = art.name;
  }

  form.querySelectorAll("[name=projekt]").forEach(function (r) { r.addEventListener("change", function () { reglerEinrichten(false); }); });
  form.querySelectorAll("[name=stein]").forEach(function (r) { r.addEventListener("change", function () { infosAktualisieren(); anstossen(); }); });
  regler.addEventListener("input", reglerAnzeigen);
  form.querySelector("[name=weiss-nicht]").addEventListener("change", infosAktualisieren);

  function zeigeSchritt(i) {
    akt = Math.max(0, Math.min(schritte.length - 1, i));
    schritte.forEach(function (s, j) { s.hidden = j !== akt; s.classList.toggle("rein", j === akt); });
    balken.forEach(function (b, j) { b.classList.toggle("fertig", j <= akt); });
    if (akt === schritte.length - 1) zusammenfassen();
  }
  form.addEventListener("click", function (e) {
    var w = e.target.closest("[data-weiter]"), z = e.target.closest("[data-zurueck]");
    if (w) {
      var s = schritte[akt], pflicht = s.querySelectorAll("[required]");
      for (var i = 0; i < pflicht.length; i++) if (!pflicht[i].checkValidity()) { pflicht[i].reportValidity(); return; }
      zeigeSchritt(akt + 1);
      if (innerWidth < 1020) planer.scrollIntoView({ behavior: ruhig ? "auto" : "smooth", block: "start" });
    }
    if (z) zeigeSchritt(akt - 1);
  });
  /* Auswahl in Schritt 1 und 3 springt direkt weiter, das spart einen Klick */
  form.querySelectorAll("[name=projekt], [name=stein]").forEach(function (r) {
    r.addEventListener("click", function () { setTimeout(function () { if (schritte[akt].contains(r)) zeigeSchritt(akt + 1); }, 380); });
  });

  function feld(n) { var e = form.querySelector('[name="' + n + '"]'); return e ? e.value.trim() : ""; }
  function zusammenfassen() {
    var art = ARTEN[wert("projekt") || "einfahrt"], st = STEINE[wert("stein") || "beraten"];
    var zeilen = [["Projekt", art.name], ["Größe", groesseText()], ["Material", st.name], ["Wann", wert("wann") || "offen"], ["Ort", feld("ort") || "nicht angegeben"]];
    var ul = form.querySelector(".zusammenfassung"); ul.innerHTML = "";
    zeilen.forEach(function (z) { var li = document.createElement("li"); li.innerHTML = "<span></span><b></b>"; li.firstChild.textContent = z[0]; li.lastChild.textContent = z[1]; ul.appendChild(li); });
    var text = "Hallo Herr Sopa,\n\nich interessiere mich für eine Beratung vor Ort.\n\n" +
      zeilen.map(function (z) { return z[0] + ": " + z[1]; }).join("\n") +
      (feld("nachricht") ? "\n\nNachricht: " + feld("nachricht") : "") +
      "\n\nName: " + feld("name") + "\nTelefon: " + feld("telefon") + "\n\nViele Grüße\n" + feld("name");
    var betreff = "Anfrage über die Webseite: " + art.name + ", " + groesseText();
    form.querySelector("[data-mail]").href = "mailto:" + MAIL + "?subject=" + encodeURIComponent(betreff) + "&body=" + encodeURIComponent(text);
  }

  /* Vorauswahl über die Adresse, z. B. anfrage.html?projekt=mauer */
  var q = new URLSearchParams(location.search), vor = q.get("projekt"), vorStein = q.get("stein");
  if (vor && ARTEN[vor]) { var rb = form.querySelector('[name=projekt][value="' + vor + '"]'); if (rb) rb.checked = true; }
  if (vorStein && STEINE[vorStein]) { var sb = form.querySelector('[name=stein][value="' + vorStein + '"]'); if (sb) sb.checked = true; }

  /* Leinwand scharf auf Retina */
  var dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr);

  reglerEinrichten(false);
  zeigeSchritt(vor && ARTEN[vor] ? 1 : 0);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(zeichnen);
})();
