(function ($) {
  "use strict";

  $(function () {
    /* ============================
       HERO SLIDE
       ============================ */
    $('.hero-slide').backstretch(
      [
        "images/slideshow/interior2.png",
        "images/slideshow/interior1.png",
        "images/slideshow/interior3.png"
      ],
      { duration: 2000, fade: 750 }
    );

    /* ============================
       REVIEWS CAROUSEL
       ============================ */
    $('.reviews-carousel').owlCarousel({
      items: 3,
      loop: true,
      dots: false,
      nav: true,
      autoplay: true,
      margin: 30,
      responsive: {
        0:   { items: 1 },
        600: { items: 2 },
        1000:{ items: 3 }
      }
    });

    /* ============================
       TOOLTIPS (Bootstrap 5)
       ============================ */
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) {
      new bootstrap.Tooltip(el);
    });

    /* ============================
       FORMULARIO → MENSAJE BASE
       ============================ */
    var $form = $('.contact-form');

    // Evitar que el submit por Enter recargue la página
    $form.on('submit', function (e) {
      e.preventDefault();
    });

    function buildContactText() {
      var first = $.trim($('#first-name').val());
      var last  = $.trim($('#last-name').val());
      var email = $.trim($('#email').val());
      var msg   = $.trim($('#message').val());

      var text =
        "Hola, Inmobiliaria Consultores Lex Fori, soy " +
        first + " " + last + ".\n" +
        "Mi correo es: " + email + ".\n" +
        (msg ? ("Mensaje:\n" + msg) : "");

      return text;
    }

    function validateForm() {
      var formEl = $form[0];
      if (formEl && formEl.checkValidity && !formEl.checkValidity()) {
        formEl.reportValidity();
        return false;
      }
      return true;
    }

    /* ============================
       FORMULARIO → WHATSAPP
       ============================ */
    var whatsappNumbersRaw = [
      "584241966186",
      "584242908828",
      "584163762466",
      "584126102009",
      "584163762466"
    ];

    var whatsappNumbers = [...new Set(
      whatsappNumbersRaw
        .map(function (n) { return String(n).replace(/\D/g, ''); })
        .filter(Boolean)
    )];

    $('#btn-whatsapp').on('click', function (e) {
      e.preventDefault();

      if (!validateForm()) return;

      var text = buildContactText();

      if (!whatsappNumbers.length) {
        console.error('No hay números de WhatsApp configurados.');
        return;
      }

      var lastIdx = parseInt(localStorage.getItem('wa_last_idx'), 10);
      if (isNaN(lastIdx)) lastIdx = -1;

      var idx = Math.floor(Math.random() * whatsappNumbers.length);
      if (whatsappNumbers.length > 1 && idx === lastIdx) {
        idx = (idx + 1 + Math.floor(Math.random() * (whatsappNumbers.length - 1))) %
              whatsappNumbers.length;
      }
      localStorage.setItem('wa_last_idx', idx);

      var number = whatsappNumbers[idx];
      var url = "https://wa.me/" + number + "?text=" + encodeURIComponent(text);

      var a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();

      console.log('WhatsApp →', number);
    });

    /* ============================
       FORMULARIO → CORREO ELECTRÓNICO
       ============================ */
    $('#btn-email').on('click', function (e) {
      e.preventDefault();

      if (!validateForm()) return;

      var text = buildContactText();

      var subject = "Consulta inmobiliaria desde la web";
      var mailtoUrl =
        "mailto:lexfori.juridicos@gmail.com" +
        "?cc=lexfori.contables@gmail.com" +
        "&subject=" + encodeURIComponent(subject) +
        "&body="    + encodeURIComponent(text);

      // Abre el cliente de correo del usuario
      window.location.href = mailtoUrl;
    });

    /* ============================
       COPYRIGHT DINÁMICO
       ============================ */
    (function () {
      var year = new Date().getFullYear();
      $('.copyright-text').text('Copyright © Consultores Lex fori ' + year);
    })();

    /* ============================
       NAVBAR: SCROLL + ACTIVE + CERRAR EN MÓVIL
       ============================ */
    var navbarCollapseEl = document.getElementById('navbarNav');
    var bsNavbarCollapse = navbarCollapseEl
      ? bootstrap.Collapse.getOrCreateInstance(navbarCollapseEl, { toggle: false })
      : null;

    function scrollToTarget(targetId) {
      var $target = $(targetId);
      if (!$target.length) return;

      var headerHeight = $('.navbar').outerHeight() || 0;
      var offsetTop = $target.offset().top - headerHeight;

      $('html, body').animate(
        { scrollTop: offsetTop },
        300
      );
    }

    // Flecha del héroe
    $(document).on('click', '.smoothscroll', function (e) {
      e.preventDefault();
      var target = $(this).attr('href');
      scrollToTarget(target);
    });

    // Enlaces del menú
    $(document).on('click', '.navbar-nav .nav-link[href^="#"]', function (e) {
      e.preventDefault();
      var target = $(this).attr('href');

      $('.navbar-nav .nav-link').removeClass('active');
      $(this).addClass('active');

      scrollToTarget(target);

      if (bsNavbarCollapse && $('.navbar-toggler').is(':visible')) {
        bsNavbarCollapse.hide();
      }
    });

    // Dejar "Inicio" activo al cargar
    $('.navbar-nav .nav-link[href="#section_1"]').addClass('active');

    /* ============================
       INSTAGRAM: CARRUSEL CON OWL
       ============================ */

    // Array de URLs de publicaciones públicas de Instagram.
    // Puedes seguir usando las que ya tienes; limpio el "?utm_..." en JS.
    var instagramMedia = [
      "https://www.instagram.com/p/DPRS5pHjSWd/",
      "https://www.instagram.com/p/DPRRC2EDS6M/",
      "https://www.instagram.com/p/DPRSH7iDfXN/",
      "https://www.instagram.com/p/DPRTvewDTAN/",
      "https://www.instagram.com/p/DPT11FJDcyU/",
      "https://www.instagram.com/p/DPdssUzjfDS/",
      "https://www.instagram.com/p/DP1NYW0jR3y/",
      "https://www.instagram.com/p/DP1NzmbDd23/",
      "https://www.instagram.com/p/DOzBrHIjzHW/",
      "https://www.instagram.com/p/DPekdV4id17/"
    ];

    function renderInstagramMediaCarousel() {
      var $carousel = $('#instagram-carousel');
      if (!$carousel.length) {
        return;
      }

      // Limpiar por si acaso
      $carousel.empty();

      instagramMedia.forEach(function (rawUrl) {
        // Si pegaste URLs con parámetros (?utm_source=...), las limpio
        var cleanUrl = String(rawUrl).split('?')[0];

        // Contenedor del slide
        var $item = $('<div class="instagram-slide"></div>');

        // Blockquote que requiere Instagram para el embed
        var blockquote = document.createElement("blockquote");
        blockquote.className = "instagram-media";
        blockquote.dataset.instgrmPermalink = cleanUrl;
        blockquote.dataset.instgrmVersion = "14";

        // Opcional: estilo tipo tarjeta
        blockquote.style.background = "#fff";
        blockquote.style.borderRadius = "8px";
        blockquote.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.08)";

        $item.append(blockquote);
        $carousel.append($item);
      });

      // Procesar embeds de Instagram
      if (window.instgrm &&
          window.instgrm.Embeds &&
          typeof window.instgrm.Embeds.process === "function") {
        window.instgrm.Embeds.process();
      }

      // Inicializar Owl Carousel para Instagram
      $carousel.owlCarousel({
        items: 1,
        loop: true,
        dots: false,
        nav: true,
        autoplay: true,
        margin: 20,
        responsive: {
          0:   { items: 1 },
          768: { items: 1 },
          1200:{ items: 2 } // si quieres ver 2 en pantallas grandes, ajustable
        }
      });
    }

    // Pintar carrusel de Instagram al cargar DOM
    renderInstagramMediaCarousel();

    // Refuerzo: al finalizar toda la carga, por si embed.js entró más tarde
    window.addEventListener("load", function () {
      if (window.instgrm &&
          window.instgrm.Embeds &&
          typeof window.instgrm.Embeds.process === "function") {
        window.instgrm.Embeds.process();
      }
    });
  });

})(window.jQuery);
