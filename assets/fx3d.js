/* MAHDI. Vraie 3D (Three.js si dispo, sinon repli silencieux) + champ de flux du panneau final. */
(function(){
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  // ---------- HERO 3D : vague de particules dorees + anneau ----------
  var gl = document.getElementById("gl3d");
  if (gl && window.THREE){
    try{
      var hero = gl.closest(".hero");
      var renderer = new THREE.WebGLRenderer({canvas:gl, alpha:true, antialias:true});
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      var scene = new THREE.Scene();
      var cam = new THREE.PerspectiveCamera(50, 1, .1, 100);
      cam.position.set(0, 0, 9);
      var GOLD = new THREE.Color(0x9c7a34), SOFT = new THREE.Color(0xc8ad86);

      // vague de points
      var W = 16, H = 9, SX = 110, SY = 60;
      var geo = new THREE.PlaneGeometry(W, H, SX, SY);
      var base = geo.attributes.position.array.slice();
      var mat = new THREE.PointsMaterial({color:GOLD, size:.045, transparent:true, opacity:.75, sizeAttenuation:true});
      var wave = new THREE.Points(geo, mat);
      wave.rotation.x = -.28;
      scene.add(wave);

      // anneau filaire, discret, en arriere-plan
      var ring = new THREE.Mesh(
        new THREE.TorusGeometry(4.6, .012, 8, 140),
        new THREE.MeshBasicMaterial({color:SOFT, transparent:true, opacity:.35})
      );
      ring.position.set(4.6, 1.4, -3.4);
      ring.rotation.x = 1.1;
      scene.add(ring);
      var ring2 = ring.clone(); ring2.position.set(-5.2, -1.8, -4); ring2.scale.setScalar(1.5);
      scene.add(ring2);

      var mx = 0, my = 0, run = true, t = 0;
      document.addEventListener("mousemove", function(e){
        var r = gl.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width - .5) * W;
        my = -((e.clientY - r.top) / r.height - .5) * H;
      }, {passive:true});
      function size(){
        var r = hero.getBoundingClientRect();
        renderer.setSize(r.width, r.height, false);
        cam.aspect = r.width / r.height; cam.updateProjectionMatrix();
      }
      size(); window.addEventListener("resize", size);
      new IntersectionObserver(function(es){ run = es[0].isIntersecting; }, {threshold:0}).observe(hero);

      // cache le repli 2D : la 3D a pris le relais
      var dots = document.getElementById("dots");
      if (dots) dots.style.display = "none";

      (function anim(){
        requestAnimationFrame(anim);
        if (!run) return;
        t += .012;
        var pos = geo.attributes.position;
        for (var i = 0; i < pos.count; i++){
          var bx = base[i * 3], by = base[i * 3 + 1];
          var z = Math.sin(bx * .55 + t * 1.6) * .35 + Math.cos(by * .7 + t * 1.1) * .3;
          var d = Math.hypot(bx - mx, by - my);
          if (d < 3) z += (3 - d) * .55;
          pos.setZ(i, z);
        }
        pos.needsUpdate = true;
        ring.rotation.z += .0016; ring2.rotation.z -= .0011;
        cam.position.x += ((mx * .12) - cam.position.x) * .04;
        cam.position.y += ((my * .12) - cam.position.y) * .04;
        cam.lookAt(0, 0, 0);
        renderer.render(scene, cam);
      })();
    }catch(err){ /* repli 2D deja en place */ }
  }

  // ---------- VIDEO OR : apparition quand la boucle est prete ----------
  var gv = document.getElementById("goldvid");
  if (gv){
    gv.addEventListener("canplay", function(){
      gv.classList.add("on");
      ["dots", "gl3d"].forEach(function(id){
        var c = document.getElementById(id);
        if (c) c.style.display = "none";
      });
    });
  }

  // ---------- PANNEAU FINAL : champ de flux dore sur fond encre ----------
  var fc = document.getElementById("flow");
  if (fc){
    var fx = fc.getContext("2d"), panel = fc.closest(".cta-panel"), parts = [], frun = true;
    function fsize(){
      var r = panel.getBoundingClientRect();
      fc.width = r.width; fc.height = r.height;
      parts = [];
      for (var i = 0; i < 130; i++)
        parts.push({x:Math.random() * r.width, y:Math.random() * r.height, s:.6 + Math.random() * 1.6, l:0});
    }
    fsize(); window.addEventListener("resize", fsize);
    new IntersectionObserver(function(es){ frun = es[0].isIntersecting; }, {threshold:0}).observe(panel);
    var fmx = -9999, fmy = -9999;
    panel.addEventListener("mousemove", function(e){
      var r = fc.getBoundingClientRect(); fmx = e.clientX - r.left; fmy = e.clientY - r.top;
    }, {passive:true});
    panel.addEventListener("mouseleave", function(){ fmx = -9999; fmy = -9999; });
    (function fdraw(){
      requestAnimationFrame(fdraw);
      if (!frun) return;
      fx.fillStyle = "rgba(23,21,16,.08)"; fx.fillRect(0, 0, fc.width, fc.height);
      for (var i = 0; i < parts.length; i++){
        var p = parts[i];
        var a = Math.sin(p.x * .008 + p.y * .006) * 2 + Math.cos(p.y * .01 - p.x * .004) * 2;
        var dx = p.x - fmx, dy = p.y - fmy, d = Math.hypot(dx, dy);
        if (d < 140 && d > 1){ a = Math.atan2(dy, dx); }
        p.x += Math.cos(a) * p.s; p.y += Math.sin(a) * p.s; p.l++;
        if (p.x < 0 || p.x > fc.width || p.y < 0 || p.y > fc.height || p.l > 400){
          p.x = Math.random() * fc.width; p.y = Math.random() * fc.height; p.l = 0;
        }
        fx.beginPath(); fx.arc(p.x, p.y, 1.1, 0, 7);
        fx.fillStyle = "rgba(200,173,134,.5)"; fx.fill();
      }
    })();
  }
})();
