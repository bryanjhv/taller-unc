/*jslint browser: true, sloppy: true, vars: true*/
/*jslint indent: 2, maxerr: 50, maxlen: 80*/

(function (g, u) {

  var d = g.document,
    jq = g.jQuery;

  if (jq && g.$ === jq) {
    jq.noConflict(); // remove jQuery's $ alias if present
  }

  /**
   * Get the real type of an object.
   *
   * @param {*} obj Any variable to get its type.
   * @param {boolean} [toLower=false] True to lowercase type.
   * @returns {string} Type of object.
   * @global
   */
  function type(obj, toLower) {
    var objType = ({}).toString.call(obj).slice(8, -1);
    if (toLower) {
      objType = objType.toLowerCase();
    }
    return objType;
  }

  /**
   * Cast a string to integer.
   *
   * @param {string} str The string to parse and cast.
   * @returns {number} Parsed number.
   * @global
   */
  function int(str) {
    return parseInt(str, 10);
  }

  /**
   * Cast a string to float.
   *
   * @param {string} str The string to parse and cast.
   * @returns {number} Parsed number.
   * @global
   */
  function float(str) {
    return parseFloat(str);
  }

  /**
   * Convert a variable to string.
   *
   * @param {*} obj Object to convert to string.
   * @returns {string} Same object as string.
   * @global
   */
  function str(obj) {
    return obj.toString ? obj.toString() : '';
  }

  /**
   * Round a number to specified precision.
   *
   * @param {string} str
   * @param {number} [precision=2]
   * @returns {number} Rounded number.
   * @global
   */
  function round(str, precision) {
    return float(float(str).toFixed(precision || 2));
  }

  /**
   * Iterate over array, array-like or object in a common and easy way.
   *
   * @param {(T[]|NodeList|HTMLCollection|{})} arr The iterable element.
   * @param {(function(T, number, T[])|function(string, *, {}))} callback
   * @template T
   * @throws TypeError
   * @global
   */
  function each(arr, callback) {
    if (Array.isArray(arr) || (arr.length !== u && arr.item)) {
      [].forEach.call(arr, callback);
    } else if (arr.constructor === Object) {
      each(Object.keys(arr), function (key) {
        callback(key, arr[key], arr);
      });
    } else {
      throw new TypeError('arr must be iterable, ' + type(arr) + ' given');
    }
  }

  /**
   * Enhanced querySelector, a kinf of jQuery but with native DOM and few lines.
   *
   * @param {(string|T|function)} sel Selector to use.
   * @param {(number|{})} [idx] Index, or options object. Implies 'optimize'.
   * @param {boolean} [optimize=true] Optimize 'html', 'head', 'body', IDs.
   * @returns {(T|Element|NodeList|HTMLCollection)} Created or got element.
   * @template T
   * @global
   */
  function $(sel, idx, optimize) {
    if (type(sel) === 'Function') {
      var e = 'DOMContentLoaded';
      return d.addEventListener(e, function ready() {
        d.removeEventListener(e, ready, false);
        sel();
      }, false);
    }

    if (type(sel) !== 'String') {
      return sel;
    }

    optimize = optimize === u ? true : optimize;

    if (optimize) {
      if (idx !== u && int(idx) === idx) {
        return $(sel, -1, false)[idx];
      }

      switch (sel) {
      case 'html':
      case 'head':
      case 'body':
        return $(sel, 0);
      }

      if (sel.indexOf('#') > -1 && sel.indexOf('>') === -1) {
        if (/#[A-Za-z][A-Za-z0-9\-\._:]+/.test(sel)) {
          return $(sel, 0);
        }
      }

      if (sel.charAt(0) === '!') {
        var el = d.createElement(sel.slice(1));
        each(idx || {}, function (prop, val) {
          el[prop] = val;
        });
        return el;
      }
    }

    return d.querySelectorAll(sel);
  }

  /**
   * Store or get data from localStorage.
   *
   * @param {string} key Key to get or set.
   * @param {*} value
   * @returns {*} Value of key, or undefined when setting.
   * @global
   */
  function store(key, value) {
    if (value === u) {
      return localStorage.getItem(key) || '';
    }
    localStorage.setItem(key, value);
  }

  g.type = type;
  g.int = int;
  g.float = float;
  g.str = str;
  g.round = round;
  g.each = each;
  g.$ = $;
  g.store = store;

}(window));
