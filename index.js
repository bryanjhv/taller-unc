/*jslint node: true, nomen: true, plusplus: true, regexp: true, sloppy: true*/
/*jslint indent: 2, maxerr: 50, maxlen: 80*/

var fs = require('fs'),
  mkdirp = require('mkdirp'),
  path = require('path'),
  rimraf = require('rimraf');

var baseDir = __dirname;
var destDir = path.resolve(baseDir, '..');

/**
 * 'Walk' a directory and return a list of files it has.
 * @param {string} dir
 * @param {function(Error, string[]?)} [callback]
 */
function walkDir(dir, callback) {
  var files = [],
    pending = 0;

  function end() {
    if (--pending === 0) {
      callback(null, files.map(function (file) {
        return path.relative(dir, file);
      }));
    }
  }

  function readdir(dir) {
    pending++;

    fs.stat(dir, function (err, stats) {
      if (err) {
        callback(err);
        return;
      }

      if (!stats.isDirectory()) {
        files.push(dir);
        return end();
      }

      fs.readdir(dir, function (err, dirs) {
        if (err) {
          callback(err);
          return;
        }

        dirs.forEach(function (idir) {
          return readdir(path.join(dir, idir));
        });

        end();
      });
    });
  }

  readdir(path.resolve(dir));
}

/**
 * Throw the passed error, if any.
 *
 * @param {Error} err
 * @throws {Error} If any error happened.
 */
function die(err) {
  if (err) {
    throw err;
  }
}

var
  /**
   * Array of excluded files for processing.
   *
   * @type {(string|RegExp)[]}
   */
  excludes,

  /**
   * Array of expressions to replace.
   *
   * @type {Object.<string, {from: (string|RegExp), to: string}>}
   */
  replaces,

  /**
   * Array of files which are being 'tested'.
   *
   * @type {string[]}
   */
  tests;

walkDir(baseDir, function (err, files) {
  die(err);

  files = files.filter(function (file) {
    return excludes.every(function (excl) {
      return typeof excl === 'string'
        ? (excl !== file)
        : !excl.test(file);
    });
  });

  files.map(function (file) {
    while (path.dirname(file) !== '.') {
      file = path.dirname(file);
    }
    return path.resolve(destDir, file);
  }).forEach(function (file) {
    rimraf.sync(file);
    rimraf.sync(file + '@');
  });

  var replacesRE = Object.keys(replaces).filter(function (rep) {
    return rep.slice(0, 2) === rep.slice(-2) && rep.slice(-2) === '$$';
  }).map(function (rep) {
    var reg = new RegExp(rep.slice(2, -2));
    return {
      pattern: reg,
      replaces: replaces[rep]
    };
  });

  files.forEach(function (file) {
    var srcPath = path.resolve(baseDir, file),
      dstPath = path.resolve(baseDir, '..', file),
      isTest = tests.indexOf(file) !== -1 || tests[0] === '*';

    fs.readFile(srcPath, function (err, data) {
      die(err);

      var reps = replaces[file] || [];
      replacesRE.forEach(function (repRE) {
        if (repRE.pattern.test(file)) {
          reps = reps.concat(repRE.replaces);
        }
      });

      if (reps.length) {
        console.log('Analyzing ' + file + '...');

        data = data.toString('utf8');
        reps.forEach(function (rep) {
          data = data.replace(rep.from, rep.to);
        });
        data = new Buffer(data, 'utf8');
      }

      if (isTest) {
        dstPath += '@';
      }

      mkdirp(path.dirname(dstPath), function (err) {
        die(err);

        fs.writeFile(dstPath, data, function (err) {
          die(err);

          console.log('Written ' + file + (isTest ? '@' : '') + '...');
        });
      });
    });
  });
});

excludes = [
  path.basename(__filename),
  /^\.git\//
];

replaces = {
  '_includes/foot.html': [{
    from: / {2}</g,
    to: '<'
  }, {
    from: '>\n{% if',
    to: '>{% if'
  }, {
    from: 'if %}\n<',
    to: 'if %}<'
  }],
  '_includes/head.html': [{
    from: / {4}/g,
    to: '  '
  }, {
    from: /(n %\})\n {2}(.*)\n {2}(\{% e)/gm,
    to: '$1$2$3'
  }, {
    from: '1.0\n  ',
    to: '1.0'
  }, {
    from: 'n %}\n  ',
    to: 'n %}'
  }, {
    from: /\n {2}(\{% e)/g,
    to: '$1'
  }, {
    from: 'e %}\n  ',
    to: 'e %}'
  }],
  '_includes/vars.html': [{
    from: / {2}/g,
    to: ''
  }, {
    from: /\n/g,
    to: ''
  }, {
    from: /<!--.*-->/,
    to: ''
  }, {
    from: /\}$/,
    to: '}\n' // newline at EOF
  }],
  '_layouts/default.html': [{
    from: / {2}/g,
    to: ''
  }, {
    from: /\}\n</g,
    to: '}<'
  }, {
    from: '>\n{%',
    to: '>{%' // only string for first
  }, {
    from: '<html>{% i',
    to: '<html>\n{% i'
  }],
  'js/config.js': [{
    from: /^/,
    to: '---\n---\n{% assign cdn = site.data.cdn %}{% if site.local %}' +
      '{% assign cdn = cdn.local %}{% endif %}\n'
  }],
  'js/main.js': [{
    from: /^/,
    to: '---\n---\n'
  }],
  'index.html': [{
    from: />\n {14}\{% f/,
    to: '>{% f'
  }, {
    from: />\n {14}\{% e/,
    to: '>{% e'
  }, {
    from: /(i>)\s+(\{% end)/g,
    to: '$1$2'
  }],
  '$$^_posts/(.*)\\.html$$$': [{
    from: /(<code[^>]*>)([^<]*)\s*(<\/code>)/g, // useless now, useful later
    to: '$1$2$3'
  }, {
    from: '\n<div class="reveal">\n  <div class="slides">',
    to: ''
  }, {
    from: / {2}<\/div>\n<\/div>\n$/,
    to: ''
  }, {
    from: /<\/?yaml>/g,
    to: '---'
  }]
};

tests = [];
