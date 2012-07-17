var objectUtil = {
  getValues: function (object) {
    var values = [];
    for (var property in object)
      values.push(object[property]);
    return values;
  },

  isEmptyObject: function(obj) {
    var key;

    for ( key in obj ) {
      return false;
    }

    return true;
  },

  extend: function(target, obj) {
    var objs = Array.prototype.slice.call(arguments, 1);

    objs.forEach(function(obj, i) {
      if (obj && obj instanceof Object) {
        var attr;
        for (attr in obj) {
          if (obj.hasOwnProperty(attr)) {
            target[attr] = obj[attr];
          }
        }
      }
    });

    return target;
  }
};


module.exports = objectUtil;
