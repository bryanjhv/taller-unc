$(function () {

  // We have JavaScript enabled
  $$('body').removeClass('no-js');

  // Cancel navigating to #
  $$('a[href="#"]').each(function (link) {
    link.on('click', function (e) {
      e.preventDefault();
    });
  });

});
