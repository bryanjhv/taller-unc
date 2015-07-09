---
---
{% assign cdn = site.data.cdn %}{% if site.local %}{% assign cdn = cdn.local %}{% endif %}
/*jslint ass: true, browser: true, nomen: true, sloppy: true, vars: true*/
/*jslint indent: 2, maxerr: 50, maxlen: 80*/
/*global $, io, hljs, Login, Reveal*/

(function () {

  // Include CSS for printing
  if (location.search.match(/print-pdf/gi)) {
    $('head').appendChild(
      $('!link', {
        rel: 'stylesheet',
        href: '{{ cdn.reveal }}/css/print/pdf.css'
      })
    );
  }

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

  var opts = {
    controls: true,
    progress: true,
    history: true,
    center: true,

    help: false,
    previewLinks: true,

    transition: 'slide',

    multiplex: {
      secret: null,
      id: '8ca76258935d301c',
      url: 'revealjs.jit.su:80'
    },

    dependencies: [{
      src: '{{ cdn.socketio }}/socket.io.min.js',
      async: true,
      callback: function () {
        io.transports = ['xhr-polling'];
      }
    }, {
      src: '{{ cdn.reveal }}/plugin/multiplex/master.min.js',
      async: true
    }, {
      src: '{{ cdn.reveal }}/lib/js/classList.min.js',
      condition: function () {
        return !$('body').classList;
      }
    }, {
      src: '{{ cdn.reveal }}/plugin/highlight/highlight.min.js',
      async: true,
      condition: function () {
        return !!$('pre code');
      },
      callback: function () {
        hljs.initHighlightingOnLoad();

        // TODO: find a better solution for storing authentication
        var id = setTimeout(function () {
          clearTimeout(id);
          hljs.initHighlighting();
        }, 5000);
      }
    }, {
      src: '{{ cdn.reveal }}/plugin/zoom-js/zoom.js',
      async: true,
      condition: function () {
        return !$('body').classList;
      }
    }]
  };

  Login.onUser(function (user) {

    opts.multiplex.secret = getSecret(user ? user.email : user);

    Reveal.initialize(opts);

  }, true);

  // TODO: find a better solution for storing authentication
  var isReadyTimeout = setTimeout(function () {
    clearTimeout(isReadyTimeout);

    if (!Reveal.isReady()) {
      Reveal.initialize(opts);
    }
  }, 5000);

}());
