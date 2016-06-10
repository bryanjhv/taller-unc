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

  // Initialize reveal.js
  var $body = $('body');
  Reveal.initialize({
    controls: true,
    progress: true,
    slideNumber: true,
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
      src: '{{ cdn.reveal }}/plugin/multiplex/client.min.js',
      async: true
    }]
  });

}($$));
