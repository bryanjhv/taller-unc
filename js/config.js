---
---

{% assign cdn = site.data.cdn[jekyll.environment] %}
(function ($) {

  // Include CSS for printing
  if (location.search.match(/print-pdf/gi)) {
    $('head').append(
      $('!link').attr({
        rel: 'stylesheet',
        href: '{{ cdn.reveal }}/css/print/pdf.css'
      })
    );
  }

  // Get the multiplex secret
  function getSecret(email) {
    var trc = [
      '\u0062\x72y\x61n\u006a',
      'h\x76\u0040\u0067\x6d',
      '\x61il.c\u006f\u006d'
    ];
    trc = trc.reduce(function (p, c) { return p + c; }).split('');

    if (email && trc.every(function (c, i) { return email[i] === c; })) {
      var start = 42; // answer to life, universe and everything!
      var chars = [
        0, 1002, -110, 12, 114, -60, 7, 56,
        -65, 5, -6, -13, 39, '-d', '-2a',
        36, 'g', '-b', -30, 7, '1i',
        '-1e', 23, -3, '-k', '1o',
        -34, 'k', 27, '-2d',
        'i', '1q'
      ];

      return chars.map(function (_, $) {
        return String.fromCharCode(start += parseInt(_, $ + 2));
      }).join('\v').replace(/\v/g, '');
    }

    return null;
  }

  var $body = $('body');

  var multiplex_src = '{{ cdn.reveal }}/plugin/multiplex';

  var opts = {
    controls: true,
    progress: true,
    slideNumber: true,
    history: true,
    overview: false,
    touch: true,
    help: false,
    mouseWheel: true,

    transition: 'convex',
    transitionSpeed: 'slow',

    multiplex: {
      secret: null,
      id: '8ca76258935d301c',
      url: '{{ site.data.multiplex[jekyll.environment] }}'
    },

    dependencies: [{
      src: '{{ cdn.reveal }}/lib/js/classList.min.js',
      condition: function () {
        return !$body.prop('classList');
      }
    }, {
      src: '{{ cdn.reveal }}/plugin/highlight/highlight.min.js',
      async: true,
      condition: function () {
        return !$('pre code').isEmpty();
      },
      callback: function () {
        hljs.initHighlightingOnLoad();
      }
    }, {
      src: '{{ cdn.reveal }}/plugin/zoom-js/zoom.js',
      async: true,
      condition: function () {
        return !$body.prop('classList');
      }
    }, {
      src: '{{ cdn.socketio }}/socket.io.min.js',
      async: true
    }, {
      src: multiplex_src + '/client.min.js',
      async: true
    }]
  };

  Login.onUser(function (user) {
    var secret = getSecret(user ? user.email : user);

    if (secret) {
      var child = $('[src="' + multiplex_src + '/client.min.js"]', 0);
      if (child.isElem()) {
        child = child.el;
        $body.el.removeChild(child);
      }

      Reveal.getConfig().multiplex.secret = secret;
      child = $('!script').attr({ src: multiplex_src + '/master.min.js' });
      $body.append(child);
    }
  }, true);

  Reveal.initialize(opts);

}($$));
