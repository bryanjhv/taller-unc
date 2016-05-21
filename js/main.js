$(function () {

  // We have JavaScript enabled
  var body = $$('body');
  body.className = body.className.replace(/no-js ?/, '');

  // Cancel navigating to #
  $$('a[href="#"]').each(function (link) {
    link.on('click', function (e) {
      e.preventDefault();
    });
  });

  var userDiv = $$('#user');

  if (userDiv.isElem()) {
    Login.onUser(function (user) {

      while (userDiv.el.firstChild) {
        userDiv.el.removeChild(userDiv.el.firstChild);
      }

      var btnCls = 'btn waves-effect waves-light';

      if (!user) {
        var loginBtn = $$('!a').prop({
          className: btnCls,
          id: 'loginBtn',
          innerHTML: 'Iniciar sesión'
        });
        auth2.attachClickHandler(loginBtn.el);

        userDiv.append(loginBtn);
      } else {
        var html = '\n' +
          '<div class="card-panel teal lighten-1 z-depth-1">' +
          '  <div class="row valign-wrapper">' +
          '    <div class="col s3">' +
          '      <img src="$imageUrl" class="circle responsive-img">' +
          '    </div>' +
          '    <div class="col s9">' +
          '      <span class="white-text">Sesión iniciada como<br>' +
          '      <b>$email</b></span><br>' +
          '      <a href="#" class="' + btnCls + '" id="logoutBtn">' +
          '        Cerrar sesión</a>' +
          '    </div>' +
          '  </div>' +
          '</div>';
        html = html.replace(/\$(\w+)/g, function (m, p1) {
          return user[p1];
        });

        userDiv.html(html);

        $$('#logoutBtn').on('click', function onClick(e) {
          e.preventDefault();
          this.off('click', onClick, false);
          auth2.signOut();
        }, false);
      }
    });
  }

});
