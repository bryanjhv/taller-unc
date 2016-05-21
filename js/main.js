---
---

$(function () {

  var subdomain = '{{ site.url }}'.split('//')[1].split('.')[0];
  if (location.pathname.indexOf(subdomain) == 1) {
    var url = '';
    url += location.protocol + '//' + subdomain + '.' + location.host;
    url += location.pathname.slice(subdomain.length + 1);
    location.assign(url);
  }

  // We have JavaScript enabled
  var body = $('body');
  body.className = body.className.replace(/no-js ?/, '');

  // Cancel navigating to #
  each($('a[href="#"]'), function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
    });
  });

  var userDiv = $('#user');

  if (userDiv) {
    Login.onUser(function (user) {

      while (userDiv.firstChild) {
        userDiv.removeChild(userDiv.firstChild);
      }

      var btnCls = 'btn waves-effect waves-light';

      if (!user) {
        var loginBtn = $('!a', {
          className: btnCls,
          id: 'loginBtn',
          innerHTML: 'Iniciar sesión'
        });
        auth2.attachClickHandler(loginBtn);

        userDiv.appendChild(loginBtn);
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

        userDiv.innerHTML = html;

        $('#logoutBtn').addEventListener('click', function onClick(e) {
          e.preventDefault();
          this.removeEventListener('click', onClick, false);
          auth2.signOut();
        }, false);
      }
    });
  }

});
