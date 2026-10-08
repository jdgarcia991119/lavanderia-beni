(function () {
    var $ = function (s, c) { return (c || document).querySelector(s) }, $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)) };
    var root = document.documentElement, nav = $('#nav'), burger = $('#burger'), mm = $('#mm');
    /* menu movil */
    function setMenu(o) { root.classList.toggle('open', o); nav.classList.toggle('open', o); document.body.style.overflow = o ? 'hidden' : ''; burger.setAttribute('aria-expanded', o); mm.setAttribute('aria-hidden', !o) }
    burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')) });
    $$('#mm a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false) }) });
    /* nav: estado al salir del hero y link activo (IntersectionObserver, sin listener de scroll) */
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (e) { nav.classList.toggle('stuck', !e[0].isIntersecting) }, { rootMargin: '-80px 0px 0px 0px' }).observe($('#hero'));
        var links = $$('.nl'), map = {}; links.forEach(function (l) { map[l.getAttribute('href').slice(1)] = l });
        var so = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { links.forEach(function (l) { l.classList.remove('on') }); var l = map[e.target.id]; if (l) l.classList.add('on') } }) }, { rootMargin: '-45% 0px -50% 0px' });
        Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) so.observe(s) });
    }
    /* GSAP: solo si cargo y no hay reduced motion; si no, todo queda visible */
    var OK = window.gsap && window.ScrollTrigger && root.classList.contains('js');
    if (OK) {
        gsap.registerPlugin(ScrollTrigger);
        /* aparicion con stagger por lote: jerarquia de lectura */
        ScrollTrigger.batch('.rv', { start: 'top 92%', once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 1, stagger: .1, ease: 'power3.out', overwrite: true }) } });
        /* parallax suave de imagenes dentro de su marco */
        $$('.gi img,.arch img').forEach(function (img) { gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } }) });
        /* frase del problema: se ilumina palabra por palabra al leer */
        var sc = $('#scrub'); if (sc) {
            var w = sc.textContent.trim().split(/\s+/); sc.innerHTML = w.map(function (x) { return '<span>' + x + '</span>' }).join(' ');
            gsap.fromTo($$('span', sc), { opacity: .15 }, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: sc, start: 'top 82%', end: 'bottom 45%', scrub: true } })
        }
        /* proceso: la linea se dibuja y activa cada paso */
        var mmq = gsap.matchMedia();
        mmq.add('(min-width:1024px)', function () { gsap.fromTo('#pl', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '#steps', start: 'top 75%', end: 'bottom 60%', scrub: true } }) });
        mmq.add('(max-width:1023px)', function () { gsap.fromTo('#pl', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#steps', start: 'top 70%', end: 'bottom 70%', scrub: true } }) });
        $$('.st').forEach(function (s) { ScrollTrigger.create({ trigger: s, start: 'top 72%', onEnter: function () { s.classList.add('on') }, onLeaveBack: function () { s.classList.remove('on') } }) });
        window.addEventListener('load', function () { ScrollTrigger.refresh() });
    } else { $$('.st').forEach(function (s) { s.classList.add('on') }); $('#pl').style.transform = 'none' }
    /* formulario */
    var f = $('#pickupForm'), fe = $('#fecha');
    var t = new Date(); fe.min = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
    function bad(el, b) { el.classList.toggle('bad', b); return b }
    function valid() {
        var ok = true;
        ['nombre', 'direccion', 'servicio'].forEach(function (id) { var el = document.getElementById(id); if (bad(el, !el.value.trim())) ok = false });
        var tel = $('#telefono'); if (bad(tel, tel.value.replace(/\D/g, '').length < 7)) ok = false;
        var em = $('#email'); if (bad(em, em.value && !/^\S+@\S+\.\S+$/.test(em.value))) ok = false;
        var tc = $('#terminos'), te = $('#terr'); te.style.display = tc.checked ? 'none' : 'block'; if (!tc.checked) ok = false;
        return ok
    }
    $$('.fi', f).forEach(function (el) { el.addEventListener('input', function () { el.classList.remove('bad') }) });
    $('#terminos').addEventListener('change', function () { $('#terr').style.display = this.checked ? 'none' : 'block' });
    f.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!valid()) { var b = $('.bad', f); if (b) b.focus(); return }
        var v = function (id, d) { return (document.getElementById(id).value || '').trim() || d };
        var E = function (c) { return String.fromCodePoint(c) };
        var msg = '*Nueva solicitud de recogida - Lavandería Beni*\n\n' +
            E(0x1F464) + ' *Nombre:* ' + v('nombre') + '\n' + E(0x1F4F1) + ' *Teléfono:* ' + v('telefono') + '\n' + E(0x1F4E7) + ' *Email:* ' + v('email', 'No proporcionado') + '\n' +
            E(0x1F4CD) + ' *Dirección:* ' + v('direccion') + '\n' + E(0x1F4CC) + ' *Referencia:* ' + v('referencia', 'Sin referencia') + '\n' + E(0x1F9FA) + ' *Servicio:* ' + v('servicio') + '\n' +
            E(0x1F4C5) + ' *Fecha preferida:* ' + v('fecha', 'Sin preferencia') + '\n' + E(0x1F550) + ' *Horario:* ' + v('horario', 'Sin preferencia') + '\n' + E(0x1F4DD) + ' *Comentarios:* ' + v('comentarios', 'Sin comentarios');
        window.open('https://wa.me/593991455944?text=' + encodeURIComponent(msg), '_blank');
        f.classList.add('sent')
    });
    $('#again').addEventListener('click', function () { f.reset(); f.classList.remove('sent') });
})();