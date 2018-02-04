(function (hyperHTML) {
  /*! (c) Andrea Giammarchi (ISC) */
  var uid = new Date * Math.random();
  var templates = Object.create(null);
  fix('bind');
  fix('wire');
  function fix(name) {
    var method = hyperHTML[name];
    hyperHTML[name] = function () {
      var fn = method.apply(null, arguments);
      return function () {
        return fn.apply(null, tagArguments.apply(null, arguments));
      };
    };
  }
  function tagArguments() {
    var length = arguments.length;
    var template = [];
    var args = [template];
    if (length) {
      var i = 0;
      var mod = typeof arguments[i] === 'string' ? 0 : 1;
      if (mod) template.push('');
      while (i < length) {
        ((i + mod) % 2 ? args : template).push(arguments[i]);
        i++;
      }
      if (template.length < args.length) template.push('');
      var key = template.join(uid);
      if (key in templates) {
        args[0] = templates[key];
      } else {
        (templates[key] = template).raw = template;
      }
    }
    return args;
  }
}(hyperHTML));
