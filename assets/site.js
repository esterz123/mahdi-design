/* MAHDI. Moteur jeu : loader, dots, 3D, curseur, magnetisme, scroll choregraphie, confetti. */
(function(){
  "use strict";
  var fine = window.matchMedia("(pointer:fine)").matches;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Preloader compteur
  if (!reduce){
    var ld = document.createElement("div"); ld.id = "loader";
    ld.innerHTML = '<div class="l-word">MAHDI<em>.</em></div><div class="l-num">0</div><div class="l-bar"><i></i></div>';
    document.body.appendChild(ld);
    var n = 0, num = ld.querySelector(".l-num"), bar = ld.querySelector(".l-bar i");
    var tick = setInterval(function(){
      n = Math.min(100, n + Math.ceil(Math.random() * 14));
      num.textContent = n; bar.style.width = n + "%";
      if (n >= 100){ clearInterval(tick); setTimeout(function(){ ld.classList.add("done"); setTimeout(function(){ ld.remove(); }, 800); }, 150); }
    }, 70);
  }

  // Barre de progression
  var prog = document.createElement("div"); prog.id = "progress"; document.body.appendChild(prog);

  // Suivi souris global
  var mx = innerWidth / 2, my = innerHeight / 3;
  document.addEventListener("mousemove", function(e){ mx = e.clientX; my = e.clientY; }, {passive:true});

  // Curseur point + anneau + etiquette
  var cur = null, dot = null, ring = null, tag = null, rx = mx, ry = my;
  if (fine && !reduce){
    document.body.classList.add("has-cursor");
    cur = document.createElement("div"); cur.id = "cursor";
    ring = document.createElement("span"); ring.className = "ring";
    dot = document.createElement("span"); dot.className = "dot";
    tag = document.createElement("span"); tag.className = "tag"; tag.textContent = "VOIR";
    cur.appendChild(ring); cur.appendChild(dot); cur.appendChild(tag); document.body.appendChild(cur);
    document.addEventListener("mousemove", function(e){ dot.style.left = e.clientX + "px"; dot.style.top = e.clientY + "px"; tag.style.left = e.clientX + "px"; tag.style.top = e.clientY + "px"; }, {passive:true});
    (function loop(){ rx += (mx - rx) * .16; ry += (my - ry) * .16; ring.style.left = rx + "px"; ring.style.top = ry + "px"; requestAnimationFrame(loop); })();
    document.addEventListener("mousedown", function(){ cur.classList.add("down"); });
    document.addEventListener("mouseup", function(){ cur.classList.remove("down"); });
    document.querySelectorAll("a, button, summary, input, textarea, select, .card, .step").forEach(function(el){
      el.addEventListener("mouseenter", function(){
        cur.classList.add("hov");
        if (el.closest(".shot, .shot-big, .qui .photo")) cur.classList.add("tagged"); else cur.classList.remove("tagged");
      });
      el.addEventListener("mouseleave", function(){ cur.classList.remove("hov", "tagged"); });
    });
  }

  // Mosaique M 7x9, 3D, ondule + pivote
  var M = ["XX...XX","XXX.XXX","XXXXXXX","XX.X.XX","XX...XX","XX...XX","XX...XX","XX...XX","XX...XX"];
  var tiles = [];
  document.querySelectorAll(".mosaic").forEach(function(el){
    if (!el.parentElement.classList.contains("hero-3d")){
      var w = document.createElement("div"); w.className = "hero-3d";
      el.parentNode.insertBefore(w, el); w.appendChild(el);
    }
    M.join("").split("").forEach(function(c, i){
      var t = document.createElement("i");
      if (c === "X"){ t.className = "on"; tiles.push({el:t, x:i % 7, y:Math.floor(i / 7)}); }
      el.appendChild(t);
    });
  });
  var heroM = document.querySelector(".hero .mosaic");
  if (heroM && fine && !reduce){
    var hero = document.querySelector(".hero");
    hero.addEventListener("mousemove", function(){
      var r = heroM.getBoundingClientRect();
      var dx = (mx - (r.left + r.width / 2)) / innerWidth, dy = (my - (r.top + r.height / 2)) / innerHeight;
      heroM.style.transform = "rotateY(" + (dx * 26) + "deg) rotateX(" + (-dy * 26) + "deg)";
      tiles.forEach(function(t){
        var px = r.left + (t.x + .5) * (r.width / 7), py = r.top + (t.y + .5) * (r.height / 9);
        var z = Math.max(0, 90 - Math.hypot(mx - px, my - py) * .35);
        t.el.style.transform = "translateZ(" + z.toFixed(1) + "px)";
      });
    });
    hero.addEventListener("mouseleave", function(){
      heroM.style.transform = "rotateY(0deg) rotateX(0deg)";
      tiles.forEach(function(t){ t.el.style.transform = "translateZ(0px)"; });
    });
    // touche M : explosion de la mosaique
    document.addEventListener("keydown", function(e){
      if (e.key.toLowerCase() !== "m" || heroM.classList.contains("blast")) return;
      heroM.classList.add("blast");
      tiles.forEach(function(t){
        var a = Math.random() * Math.PI * 2, d = 120 + Math.random() * 160;
        t.el.style.transform = "translate(" + (Math.cos(a) * d).toFixed(0) + "px," + (Math.sin(a) * d).toFixed(0) + "px) translateZ(120px)";
        t.el.style.opacity = "0";
      });
      setTimeout(function(){
        tiles.forEach(function(t){ t.el.style.transform = ""; t.el.style.opacity = ""; });
        setTimeout(function(){ heroM.classList.remove("blast"); }, 550);
      }, 650);
    });
  }

  // Champ de points dore dans le hero (canvas)
  var heroEl = document.querySelector(".hero"), cvs = document.getElementById("dots");
  if (heroEl && cvs && !reduce){
    var ctx = cvs.getContext("2d"), pts = [], run = true, t0 = 0;
    function size(){
      var r = heroEl.getBoundingClientRect();
      cvs.width = r.width; cvs.height = r.height;
      pts = [];
      var gap = 34;
      for (var y = gap / 2; y < r.height; y += gap)
        for (var x = gap / 2; x < r.width; x += gap)
          pts.push({x:x, y:y});
    }
    size(); window.addEventListener("resize", size);
    new IntersectionObserver(function(es){ run = es[0].isIntersecting; }, {threshold:0}).observe(heroEl);
    (function draw(t){
      requestAnimationFrame(draw);
      if (!run) return;
      t0 = (t || 0) / 1000;
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      var r = cvs.getBoundingClientRect();
      for (var i = 0; i < pts.length; i++){
        var p = pts[i];
        var wave = Math.sin(p.x * .012 + t0 * 1.2) * 10 + Math.cos(p.y * .015 + t0 * .9) * 10;
        var dx = p.x - (mx - r.left), dy = (p.y + wave) - (my - r.top);
        var d = Math.hypot(dx, dy), push = d < 130 ? (130 - d) * .35 : 0;
        var px = p.x + (d ? dx / d * push : 0), py = p.y + wave + (d ? dy / d * push : 0);
        var a = .12 + .22 * Math.abs(Math.sin(p.x * .01 + p.y * .01 + t0));
        ctx.beginPath(); ctx.arc(px, py, 1.4, 0, 7);
        ctx.fillStyle = "rgba(156,122,52," + a.toFixed(2) + ")"; ctx.fill();
      }
    })();
  }

  // Titre hero mot a mot, declenche apres le preloader
  var heroH1 = document.querySelector(".hero h1");
  if (heroH1 && !reduce){
    var wi = 0;
    Array.prototype.slice.call(heroH1.childNodes).forEach(function(nd){
      function wrap(word, gold){
        var s = document.createElement("span");
        s.className = "w"; s.style.setProperty("--d", (wi * .07) + "s");
        if (gold) s.classList.add("ch");
        s.textContent = word; wi++;
        return s;
      }
      if (nd.nodeType === 3){
        var frag = document.createDocumentFragment();
        nd.textContent.split(/(\s+)/).forEach(function(part){
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(" "));
          else frag.appendChild(wrap(part, false));
        });
        heroH1.replaceChild(frag, nd);
      } else if (nd.nodeType === 1){
        var s = wrap(nd.textContent, nd.classList.contains("ch"));
        heroH1.replaceChild(s, nd);
      }
    });
    setTimeout(function(){ document.querySelector(".hero").classList.add("loaded"); }, 950);
  } else if (heroH1){
    var h = document.querySelector(".hero"); if (h) h.classList.add("loaded");
  }
  if (fine && !reduce){
    document.querySelectorAll(".card, .qui .photo, .cta-panel").forEach(function(card){
      card.addEventListener("mousemove", function(){
        var r = card.getBoundingClientRect();
        var px = (mx - r.left) / r.width - .5, py = (my - r.top) / r.height - .5;
        card.style.transform = "perspective(900px) rotateY(" + (px * 8) + "deg) rotateX(" + (-py * 8) + "deg) translateY(-3px)";
      });
      card.addEventListener("mouseleave", function(){ card.style.transform = ""; });
    });
    document.querySelectorAll(".btn").forEach(function(b){
      b.addEventListener("mousemove", function(){
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + ((mx - (r.left + r.width / 2)) * .18).toFixed(1) + "px," + ((my - (r.top + r.height / 2)) * .28).toFixed(1) + "px)";
      });
      b.addEventListener("mouseleave", function(){ b.style.transform = ""; });
    });
  }

  // Scroll : progression, parallaxe, vitesse du bandeau
  var pxEls = Array.prototype.slice.call(document.querySelectorAll("[data-speed]"));
  // Bandeau : boucle rAF a vitesse constante (px/seconde), boost doux au scroll
  var band = document.querySelector(".band span"), lastY = scrollY, bandV = 0, bandX = 0, bandHalf = 0, bandT = 0;
  function bandMeasure(){ if (band) bandHalf = band.scrollWidth / 2; }
  if (band && !reduce){
    band.style.animation = "none";
    bandMeasure();
    window.addEventListener("resize", bandMeasure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(bandMeasure);
    setTimeout(bandMeasure, 800); setTimeout(bandMeasure, 2500);
    requestAnimationFrame(function slide(now){
      requestAnimationFrame(slide);
      if (!bandT) bandT = now;
      var dt = Math.min(.05, (now - bandT) / 1000); bandT = now;
      if (!isFinite(dt) || dt < 0) return;
      bandX -= (22 + bandV * 90) * dt;
      if (bandHalf > 0 && -bandX >= bandHalf){ bandX += bandHalf; bandMeasure(); }
      band.style.transform = "translateX(" + bandX.toFixed(1) + "px)";
    });
  }
  var ticking = false;
  function onScroll(){
    ticking = false;
    var y = scrollY, h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    prog.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    var vc = y + innerHeight / 2;
    pxEls.forEach(function(el){
      var r = el.getBoundingClientRect(), c = r.top + y + r.height / 2;
      el.style.transform = "translateY(" + ((c - vc) * parseFloat(el.dataset.speed)).toFixed(1) + "px)";
    });
    bandV = bandV * .9 + Math.min(6, Math.abs(y - lastY) / 10) * .1; lastY = y;
  }
  window.addEventListener("scroll", function(){ if (!ticking){ ticking = true; requestAnimationFrame(onScroll); } }, {passive:true});
  onScroll();

  // Apparition + cascade dans les grilles
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if (!e.isIntersecting) return;
      e.target.classList.add("on");
      if (e.target.classList.contains("grid3") || e.target.classList.contains("steps"))
        Array.prototype.forEach.call(e.target.children, function(c, i){ c.style.transitionDelay = (i * .1) + "s"; c.classList.add("on"); });
      io.unobserve(e.target);
    });
  }, {threshold:.12});
  document.querySelectorAll(".rv").forEach(function(el){
    if (el.classList.contains("grid3") || el.classList.contains("steps"))
      Array.prototype.forEach.call(el.children, function(c){ c.classList.add("rv"); io.observe(c); });
    io.observe(el);
  });

  // Compteurs
  function fmt(n){ return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  var cio = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      var end = +e.target.dataset.count, suf = e.target.dataset.suffix || "", s = null, t1 = Date.now();
      (function step(){
        var p = Math.min(1, (Date.now() - t1) / 1400), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
        e.target.innerHTML = fmt(v) + suf;
        if (p < 1) requestAnimationFrame(step);
      })();
    });
  }, {threshold:.5});
  document.querySelectorAll("[data-count]").forEach(function(el){ cio.observe(el); });

  // Confetti tuiles dorees sur les CTA
  if (fine && !reduce){
    var cols = ["#9c7a34", "#c8ad86", "#171510", "#fff7dd"];
    document.querySelectorAll(".btn-cream").forEach(function(b){
      b.addEventListener("click", function(e){
        for (var i = 0; i < 26; i++){
          var s = document.createElement("div"); s.className = "confetti";
          s.style.background = cols[i % 4];
          s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px";
          document.body.appendChild(s);
          var a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 130;
          s.animate([
            {transform:"translate(0,0) rotate(0deg)", opacity:1},
            {transform:"translate(" + (Math.cos(a) * d).toFixed(0) + "px," + (Math.sin(a) * d + 90).toFixed(0) + "px) rotate(" + (Math.random() * 540 - 270).toFixed(0) + "deg)", opacity:0}
          ], {duration: 700 + Math.random() * 500, easing:"cubic-bezier(.2,.7,.2,1)"}).onfinish = (function(el){ return function(){ el.remove(); }; })(s);
        }
      });
    });
  }

  // Reflets liquides : boutons + cartes suivent la souris + aura du hero
  if (fine && !reduce){
    document.addEventListener("mousemove", function(e){
      var t = e.target.closest ? e.target.closest(".btn, .card") : null;
      if (t){
        var r = t.getBoundingClientRect();
        t.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
        t.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
      }
    }, {passive:true});
    var aura = document.getElementById("aura"), ax = innerWidth / 2, ay = 220, atx = ax, aty = ay;
    if (aura && document.querySelector(".hero")){
      document.querySelector(".hero").addEventListener("mousemove", function(){
        var r = aura.parentElement.getBoundingClientRect();
        atx = mx - r.left; aty = my - r.top;
      }, {passive:true});
      (function aloop(){
        requestAnimationFrame(aloop);
        ax += (atx - ax) * .06; ay += (aty - ay) * .06;
        aura.style.left = ax + "px"; aura.style.top = ay + "px";
      })();
    }
  }

  // Annee
  document.querySelectorAll("[data-year]").forEach(function(el){ el.textContent = new Date().getFullYear(); });

  // Preselection offre sur contact.html
  var sel = document.getElementById("offre");
  if (sel){
    var map = {
      diagnostic:{t:"Diagnostic express, 79 EUR", d:"Vous venez pour le diagnostic. Laissez l'URL de votre site et je reponds en moins de 24h."},
      refonte:{t:"Refonte de marque, 3 900 a 5 900 EUR", d:"Vous visez la refonte complete. Decrivez votre entreprise en deux lignes, je reponds en moins de 24h."},
      rentree:{t:"Offre Rentrée, 2 900 EUR", d:"Vous visez l'offre rentree a 2 900 EUR. Il reste 3 places : laissez l'URL de votre site, je confirme la faisabilite en moins de 24h."},
      pack:{t:"Pack Sérénité, 69 EUR/mois", d:"Vous venez pour le pack. Laissez l'URL de votre site et je prepare la surveillance, reponse en moins de 24h."},
      partenaire:{t:"Partenariat agence", d:"Vous etes une agence. Presentez votre structure en deux lignes, je reponds en moins de 24h."},
      "30jours":{t:"Offre 30 jours, 990 EUR", d:"Vous visez l'offre 30 jours. Laissez l'URL de votre site, je verifie qu'il est eligible et je reponds en moins de 24h."}
    };
    var o = null;
    try { o = new URLSearchParams(window.location.search).get("offre"); } catch(e){}
    var t = document.getElementById("o-title"), d = document.getElementById("o-desc");
    if (o && map[o]){
      if (t) t.textContent = map[o].t;
      if (d) d.textContent = map[o].d;
      for (var k = 0; k < sel.options.length; k++){
        if (sel.options[k].value === o){ sel.selectedIndex = k; break; }
      }
    }
  }
})();
