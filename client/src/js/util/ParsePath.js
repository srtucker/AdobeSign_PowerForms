import pathToRegexp from 'path-to-regexp';

export default class ParsePath {
  constructor(options) {
    this.options = options || {};
  }

  compile(path) {
    var keys = [];
    var regexp = pathToRegexp(path, keys, this.options);

    return function (pathname, params) {
      var match = regexp.exec(pathname);
      if (!match) return false;

      params = params || {};

      //var key, param;
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var param = match[i + 1];
        if (!param) {
          continue;
        }

        params[key.name] = decode_param(param);

        if (key.repeat) {
          params[key.name] = params[key.name].split(key.delimiter);
        }
      }

      return params;
    }
  }

  test(regexp, pathname, fn) {
    var params = this.compile(regexp)(pathname);

    if(params === false) {
      return false;
    }
    else if(fn && {}.toString.call(fn) === '[object Function]') {
      return fn(params);
    }
    else {
      return params;
    }
  }

}

function decode_param(val) {
  if (typeof val !== 'string' || val.length === 0) {
    return val;
  }

  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = 'Failed to decode param \'' + val + '\'';
      err.status = err.statusCode = 400;
    }

    throw err;
  }
}
