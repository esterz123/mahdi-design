/* MAHDI. Moteur pro : Lenis + GSAP. Tout est garde-fou, le site vit sans eux. */
(function(){
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  // ancres : defilement natif du navigateur, aucun lissage artificiel
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener("click", function(e){
      var id = a.getAttribute("href");
      var el = id.length > 1 ? document.querySelector(id) : null;
      if (el){ e.preventDefault(); el.scrollIntoView({behavior:"smooth", block:"start"}); }
    });
  });

  // entree hero : mosaique en cascade + nav + contenus
  var tl = gsap.timeline({delay:1.0});
  tl.from(".top", {y:-70, opacity:0, duration:.8, ease:"power3.out"})
    .from(".hero .mosaic i.on", {scale:0, opacity:0, duration:.5, ease:"back.out(2)", stagger:{each:.02, from:"random"}}, "-=.5")
    .from(".hero .sub, .hero .hero-cta, .hero .hero-meta", {y:26, opacity:0, duration:.8, ease:"power3.out", stagger:.1}, "-=.4");

  // video or : lent zoom recule au scroll (aucun conflit, pas de reveal dessus)
  var gv = document.getElementById("goldvid");
  if (gv){
    gsap.to(gv, {scale:1.14, yPercent:6, ease:"none",
      scrollTrigger:{trigger:".hero", scrub:true, start:"top top", end:"bottom top"}});
  }

  // panneau final : la mosaique tourne avec le scroll
  var cm = document.querySelector(".cta-panel .mosaic");
  if (cm){
    gsap.to(cm, {rotate:90, ease:"none",
      scrollTrigger:{trigger:".cta-panel", scrub:1, start:"top bottom", end:"bottom top"}});
  }

  // filigrane : remonte en grand
  var fm = document.querySelector(".footmark");
  if (fm){
    gsap.from(fm, {yPercent:34, ease:"none",
      scrollTrigger:{trigger:"footer.site", scrub:true, start:"top bottom", end:"bottom bottom"}});
  }
})();
