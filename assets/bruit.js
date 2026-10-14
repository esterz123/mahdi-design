/* BRUIT. Curseur viseur, oeil vivant, glitch a la velocite, dechirures, magnetisme, machine. */
(function(){
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;

  /* Curseur viseur */
  var cur = document.getElementById("cursor");
  if(cur && fine && !reduce){
    document.body.classList.add("cursor-on");
    var cx = -100, cy = -100, px = cx, py = cy;
    document.addEventListener("mousemove", function(e){ cx = e.clientX; cy = e.clientY; });
    (function follow(){
      px += (cx - px) * 0.22; py += (cy - py) * 0.22;
      cur.style.transform = "translate(" + px + "px," + py + "px)";
      requestAnimationFrame(follow);
    })();
    document.querySelectorAll("a, button, summary, input, select, textarea, label").forEach(function(el){
      el.addEventListener("mouseenter", function(){ cur.classList.add("hot"); });
      el.addEventListener("mouseleave", function(){ cur.classList.remove("hot"); });
    });
  }

  /* Oeil : champ d'ondes qui fuit et suit le curseur */
  var eye = document.getElementById("eye");
  if(eye && !reduce){
    var ctx = eye.getContext("2d"), W, H, t = 0;
    var mx = 0.5, my = 0.42, hasMouse = false;
    function size(){
      var r = eye.parentElement.getBoundingClientRect();
      W = eye.width = r.width; H = eye.height = r.height;
    }
    size(); addEventListener("resize", size);
    document.addEventListener("mousemove", function(e){
      var r = eye.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height;
      hasMouse = true;
    });
    var run = true;
    document.addEventListener("visibilitychange", function(){ run = !document.hidden; if(run) loop(); });
    function loop(){
      if(!run) return;
      t += 0.016;
      ctx.clearRect(0, 0, W, H);
      var lines = 7;
      for(var l = 0; l < lines; l++){
        var baseY = H * (0.2 + 0.6 * l / (lines - 1));
        ctx.beginPath();
        for(var x = 0; x <= W; x += 14){
          var nx = x / W;
          var d = hasMouse ? Math.hypot(nx - mx, baseY / H - my) : 1;
          var amp = 26 * Math.exp(-d * 5) + 7;
          var y = baseY + Math.sin(nx * 7 + t * (1.1 + l * 0.13) + l * 1.4) * amp
                + Math.sin(nx * 17 - t * 0.7) * 4;
          if(x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        var warm = (l === 3);
        ctx.strokeStyle = warm ? "rgba(217,72,15,0.4)" : "rgba(20,20,18," + (0.1 + 0.05 * (l % 3)) + ")";
        ctx.lineWidth = warm ? 2 : 1.2;
        ctx.stroke();
      }
      /* pupille qui regarde le curseur */
      var ex = W * (0.5 + (hasMouse ? (mx - 0.5) * 0.1 : Math.sin(t * 0.5) * 0.04));
      var ey = H * (0.5 + (hasMouse ? (my - 0.5) * 0.1 : Math.cos(t * 0.4) * 0.04));
      ctx.beginPath(); ctx.arc(ex, ey, 9 + Math.sin(t * 2) * 1.5, 0, 7);
      ctx.fillStyle = "rgba(217,72,15,0.75)"; ctx.fill();
      ctx.beginPath(); ctx.arc(ex, ey, 22 + Math.sin(t * 2) * 2, 0, 7);
      ctx.strokeStyle = "rgba(20,20,18,0.25)"; ctx.lineWidth = 1.5; ctx.stroke();
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* Glitch declenche par la velocite souris */
  var gz = document.querySelectorAll(".glitch");
  if(gz.length && fine && !reduce){
    var lx = -1, ly = -1, cool = 0;
    document.addEventListener("mousemove", function(e){
      var now = performance.now();
      if(now < cool) return;
      if(lx > 0){
        var v = Math.hypot(e.clientX - lx, e.clientY - ly);
        if(v > 90){
          gz.forEach(function(g){
            g.classList.remove("glitching"); void g.offsetWidth; g.classList.add("glitching");
            setTimeout(function(){ g.classList.remove("glitching"); }, 340);
          });
          cool = now + 500;
        }
      }
      lx = e.clientX; ly = e.clientY;
    });
  }

  /* Dechirures + reveals */
  var obs = document.querySelectorAll(".tear, .rv");
  if("IntersectionObserver" in window && !reduce){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("on"); io.unobserve(e.target); } });
    }, {threshold: 0.12});
    obs.forEach(function(el){ io.observe(el); });
  } else {
    obs.forEach(function(el){ el.classList.add("on"); });
  }

  /* 3D + magnetisme */
  if(fine && !reduce){
    document.querySelectorAll("[data-tilt]").forEach(function(card){
      card.addEventListener("mousemove", function(e){
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "translateY(-6px) perspective(950px) rotateX(" + (-y * 5) + "deg) rotateY(" + (x * 5) + "deg)";
      });
      card.addEventListener("mouseleave", function(){ card.style.transform = ""; });
    });
    document.querySelectorAll(".btn-fire, .btn-solid").forEach(function(b){
      b.addEventListener("mousemove", function(e){
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width;
        var y = (e.clientY - r.top - r.height / 2) / r.height;
        b.style.transform = "translate(" + (x * 7) + "px," + (y * 5 - 2) + "px) rotate(" + (x * 1.5) + "deg)";
      });
      b.addEventListener("mouseleave", function(){ b.style.transform = ""; });
    });
  }

  /* Marquee qui accelere au scroll */
  var mq = document.querySelector(".mq-track");
  if(mq && !reduce){
    mq.innerHTML += mq.innerHTML;
    var pos = 0, vel = 0, lastY = scrollY;
    addEventListener("scroll", function(){
      vel += Math.min(14, Math.abs(scrollY - lastY)) * 0.35;
      lastY = scrollY;
    }, {passive: true});
    (function slide(){
      vel *= 0.94;
      pos -= (1.1 + vel);
      var half = mq.scrollWidth / 2;
      if(-pos >= half) pos += half;
      mq.style.transform = "translateX(" + pos + "px)";
      requestAnimationFrame(slide);
    })();
  } else if(mq){ mq.innerHTML += mq.innerHTML; }

  /* Machine a scanner (theatre qui mene au vrai outil) */
  var form = document.getElementById("scanForm");
  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var input = document.getElementById("scanUrl"), out = document.getElementById("scanOut");
      var u = (input.value || "").trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
      if(!u){ form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake"); return; }
      var seq = [
        ["dim", "> connexion a " + u + " ..."],
        ["ok", "OK, site repondu"],
        ["dim", "> mesure vitesse, mobile, confiance ..."],
        ["ko", "! 3 points bloquants detectes"],
        ["dim", "> redirection vers le vrai laboratoire ..."]
      ];
      out.innerHTML = ""; var i = 0;
      (function next(){
        if(i >= seq.length){
          location.href = "audit.html?site=" + encodeURIComponent(u);
          return;
        }
        var d = document.createElement("div");
        d.className = seq[i][0]; d.textContent = seq[i][1];
        out.appendChild(d); i++;
        setTimeout(next, i === seq.length ? 900 : 620);
      })();
    });
  }
})();
