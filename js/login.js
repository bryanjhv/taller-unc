/*jslint sloppy: true, vars: true*/
/*jslint indent: 2, maxerr: 50, maxlen: 80*/
/*global CustomEvent, gapi*/

(function (g) {

  /**
   * My API client ID.
   *
   * @type {string}
   */
  var clientId = '503439907239-vldlhnahhode5glp84dtre2at0hg7mpt' +
    '.apps.googleusercontent.com';

  /**
   * The defined events.
   * @enum {string}
   */
  var events = {
    auth2Loaded: 'gapi-auth2-loaded',
    userChanged: 'gapi-auth2-user-changed'
  };

  /**
   * Create a new custom event for given type.
   *
   * @param {string} type The type of the event.
   * @param {Object} [data] Optional data to pass.
   * @returns {CustomEvent} The event that was created.
   */
  function makeEvent(type, data) {
    return new CustomEvent(type, {
      detail: data
    });
  }

  var auth2;

  /**
   * Called once the base script was loaded.
   */
  function startApp() {
    gapi.load('auth2', initSignin);
  }

  /**
   * Initialize the auth2 object.
   * Then notify the auth2 was created.
   * Finally listen for user changes.
   */
  function initSignin() {
    auth2 = g.auth2 = gapi.auth2.init({
      client_id: clientId
    });

    g.dispatchEvent(makeEvent(events.auth2Loaded));

    auth2.currentUser.listen(userChanged);

    if (auth2.isSignedIn.get()) {
      auth2.signIn();
    }
  }

  /**
   * Notify when the user has changed.
   *
   * @param {gapi.auth2.GoogleUser} user
   */
  function userChanged(user) {
    g.dispatchEvent(makeEvent(events.userChanged, {
      googleUser: user.getId() ? user : null
    }));
  }

  /**
   * Listen when the auth2 is loaded.
   *
   * @param {function} callback
   */
  function onLoad(callback) {
    g.addEventListener(events.auth2Loaded, function onLoadCb() {
      g.removeEventListener(events.auth2Loaded, onLoadCb, false);

      callback();
    }, false);
  }

  /**
   * Listen when the user changes.
   *
   * @param {function(Object)} callback Called with null or parsed user data.
   * @param {boolean} [once] True to only listen for first change.
   */
  function onUser(callback, once) {
    once = once === undefined ? false : once;

    g.addEventListener(events.userChanged, function onUserCb(e) {
      if (once) {
        g.removeEventListener(events.userChanged, onUserCb, false);
      }

      var user = e.detail.googleUser;
      if (!user) {
        return callback(null);
      }

      user = user.getBasicProfile();
      callback({
        id: user.getId(),
        name: user.getName(),
        imageUrl: user.getImageUrl(),
        email: user.getEmail()
      });
    }, false);
  }

  g.startApp = startApp;
  g.Login = {
    onLoad: onLoad,
    onUser: onUser
  };

}(this));
