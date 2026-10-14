/* GLACE. Interactivite : rubans qui suivent la souris, halo curseur, 3D, magnetisme, reveals. */
(function(){
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;

  /* Halo qui suit le curseur */
  var glow = document.getElementById("glow");
  if(glow && fine && !reduce){
    var gx = -600, gy = -600, tx = gx, ty = gy, shown = false;
    document.addEventListener("mousemove", function(e){
      tx = e.clientX; ty = e.clientY;
      if(!shown){ glow.style.opacity = "1"; shown = true; }
    });
    document.addEventListener("mouseleave", function(){ glow.style.opacity = "0"; shown = false; });
    (function follow(){
      gx += (tx - gx) * 0.08; gy += (ty - gy) * 0.08;
      glow.style.transform = "translate(" + (gx - 280) + "px," + (gy - 280) + "px)";
      requestAnimationFrame(follow);
    })();
  }

  /* Rubans : des vers de lumiere qui ondulent et suivent la souris */
  var cv = document.getElementById("ribbons");
  if(cv && fine && !reduce){
    var ctx = cv.getContext("2d"), W, H, t = 0;
    var mx = 0.5, my = 0.4;
    function size(){ W = cv.width = innerWidth; H = cv.height = innerHeight; }
    size(); addEventListener("resize", size);
    document.addEventListener("mousemove", function(e){ mx = e.clientX / W; my = e.clientY / H; });
    function make(seed, color, width, alpha, speed, pull){
      var pts = [], n = 46;
      for(var i = 0; i < n; i++) pts.push({x: Math.random(), y: Math.random()});
      return {pts: pts, seed: seed, color: color, width: width, alpha: alpha, speed: speed, pull: pull};
    }
    var worms = [
      make(1.7, "0,113,227", 1.6, 0.16, 0.9, 0.055),
      make(4.2, "56,182,255", 1.2, 0.13, 0.7, 0.04),
      make(8.9, "249,115,22", 1.4, 0.12, 0.8, 0.065),
      make(2.5, "0,113,227", 1.0, 0.1, 1.1, 0.03),
      make(6.1, "120,190,255", 2.2, 0.08, 0.6, 0.05)
    ];
    var run = true;
    document.addEventListener("visibilitychange", function(){
      run = !document.hidden; if(run) loop();
    });
    function loop(){
      if(!run) return;
      t += 0.016;
      ctx.clearRect(0, 0, W, H);
      for(var w = 0; w < worms.length; w++){
        var m = worms[w], p = m.pts;
        var hx = 0.5 + 0.32 * Math.sin(t * 0.24 * m.speed + m.seed);
        var hy = 0.45 + 0.3 * Math.cos(t * 0.19 * m.speed + m.seed * 1.7);
        hx += (mx - hx) * m.pull * 3; hy += (my - hy) * m.pull * 3;
        p[0].x += (hx - p[0].x) * 0.09; p[0].y += (hy - p[0].y) * 0.09;
        for(var i = 1; i < p.length; i++){
          var wob = Math.sin(t * 1.4 + i * 0.32 + m.seed) * 0.0016;
          p[i].x += (p[i-1].x - p[i].x) * 0.16;
          p[i].y += (p[i-1].y - p[i].y) * 0.16 + wob;
        }
        ctx.beginPath();
        ctx.moveTo(p[0].x * W, p[0].y * H);
        for(var j = 1; j < p.length - 1; j++){
          var xc = (p[j].x + p[j+1].x) / 2 * W, yc = (p[j].y + p[j+1].y) / 2 * H;
          ctx.quadraticCurveTo(p[j].x * W, p[j].y * H, xc, yc);
        }
        ctx.strokeStyle = "rgba(" + m.color + "," + m.alpha + ")";
        ctx.lineWidth = m.width; ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.stroke();
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* Apparition au scroll */
  var els = document.querySelectorAll(".rv");
  if("IntersectionObserver" in window && !reduce){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("on"); io.unobserve(e.target); } });
    }, {threshold: 0.12});
    els.forEach(function(el){ io.observe(el); });
  } else {
    els.forEach(function(el){ el.classList.add("on"); });
  }

  /* 3D subtile sur les cartes */
  if(fine && !reduce){
    document.querySelectorAll("[data-tilt]").forEach(function(card){
      card.addEventListener("mousemove", function(e){
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "translateY(-5px) perspective(950px) rotateX(" + (-y * 4) + "deg) rotateY(" + (x * 4) + "deg)";
      });
      card.addEventListener("mouseleave", function(){ card.style.transform = ""; });
    });
    /* Boutons magnetiques */
    document.querySelectorAll(".btn-solid").forEach(function(b){
      b.addEventListener("mousemove", function(e){
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width;
        var y = (e.clientY - r.top - r.height / 2) / r.height;
        b.style.transform = "translate(" + (x * 6) + "px," + (y * 4 - 2) + "px)";
      });
      b.addEventListener("mouseleave", function(){ b.style.transform = ""; });
    });
  }

  /* Anneau de score anime */
  document.querySelectorAll("[data-dial]").forEach(function(el){
    var target = parseFloat(el.getAttribute("data-dial")) || 0;
    var ring = el.querySelector(".dial-fg"), num = el.querySelector(".dial-num");
    if(!ring) return;
    var C = 2 * Math.PI * 54, shown = false;
    function play(){
      if(shown) return; shown = true;
      var t0 = null;
      function step(ts){
        if(!t0) t0 = ts;
        var k = Math.min(1, (ts - t0) / 1400), e = 1 - Math.pow(1 - k, 3);
        ring.style.strokeDashoffset = C * (1 - target / 100 * e);
        if(num) num.textContent = Math.round(target * e);
        if(k < 1) requestAnimationFrame(step);
      }
      if(reduce){ ring.style.strokeDashoffset = C * (1 - target / 100); if(num) num.textContent = target; }
      else requestAnimationFrame(step);
    }
    if("IntersectionObserver" in window) new IntersectionObserver(function(es, o){ es.forEach(function(x){ if(x.isIntersecting){ play(); o.disconnect(); } }); }).observe(el);
    else play();
  });

  /* Marquee : boucle parfaite */
  document.querySelectorAll(".mq-track").forEach(function(mq){ mq.innerHTML += mq.innerHTML; });
})();
