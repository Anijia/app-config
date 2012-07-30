(function() {

  if (window.NE) {
    return;
  }

  var NE = window.NE = {};

  var cfg = {};

  NE.addCfg = function(env) {
    for (var key in env) {
      cfg[key] = env[key];  
    }
  };

  NE.getCfg = function(key) {
    return cfg[key] || null;
  };


  window['__DEV__'] = window['__DEV__'] || 0;

  NE.bag = function() {};

/**
 * @provides javelin-behavior
 * @requires javelin-magical-init
 *
 * @javelin-installs NE.behavior
 * @javelin-installs NE.initBehaviors
 *
 * @javelin
 */

/**
 * Define a Javelin behavior, which holds glue code in a structured way. See
 * @{article:Concepts: Behaviors} for a detailed description of Javelin
 * behaviors.
 *
 * To define a behavior, provide a name and a function:
 *
 *   NE.behavior('win-a-hog', function(config, statics) {
 *     alert("YOU WON A HOG NAMED " + config.hogName + "!");
 *   });
 *
 * @param string    Behavior name.
 * @param function  Behavior callback/definition.
 * @return void
 * @group behavior
 */
NE.behavior = function(name, control_function) {
  if (__DEV__) {
    if (NE.behavior._behaviors.hasOwnProperty(name)) {
      NE.$E(
        'NE.behavior("' + name + '", ...): '+
        'behavior is already registered.');
    }
    if (!control_function) {
      NE.$E(
        'NE.behavior("' + name + '", <nothing>): '+
        'initialization function is required.');
    }
    if (typeof control_function != 'function') {
      NE.$E(
        'NE.behavior("' + name + '", <garbage>): ' +
        'initialization function is not a function.');
    }
    // IE does not enumerate over these properties
    var enumerables = {
      toString: true,
      hasOwnProperty: true,
      valueOf: true,
      isPrototypeOf: true,
      propertyIsEnumerable: true,
      toLocaleString: true,
      constructor: true
    };
    if (enumerables[name]) {
      NE.$E(
        'NE.behavior("' + name + '", <garbage>): ' +
        'do not use this property as a behavior.'
      );
    }
  }
  NE.behavior._behaviors[name] = control_function;
  NE.behavior._statics[name] = {};
};


/**
 * Execute previously defined Javelin behaviors, running the glue code they
 * contain to glue stuff together. See @{article:Concepts: Behaviors} for more
 * information on Javelin behaviors.
 *
 * Normally, you do not call this function yourself; instead, your server-side
 * library builds it for you.
 *
 * @param dict  Map of behaviors to invoke: keys are behavior names, and values
 *              are lists of configuration dictionaries. The behavior will be
 *              invoked once for each configuration dictionary.
 * @return void
 * @group behavior
 */
NE.initBehaviors = function(map) {
  var missing_behaviors = [];
  for (var name in map) {
    if (!(name in NE.behavior._behaviors)) {
      missing_behaviors.push(name);
      continue;
    }
    var configs = map[name];
    if (!configs.length) {
      if (NE.behavior._initialized.hasOwnProperty(name)) {
        continue;
      }
      configs = [null];
    }
    for (var ii = 0; ii < configs.length; ii++) {
      NE.behavior._behaviors[name](configs[ii], NE.behavior._statics[name]);
    }
    NE.behavior._initialized[name] = true;
  }
  if (missing_behaviors.length) {
    NE.$E(
      'NE.initBehavior(map): behavior(s) not registered: ' +
      missing_behaviors.join(', ')
    );
  }
};

NE.behavior._behaviors = {};
NE.behavior._statics = {};
NE.behavior._initialized = {};

/**
 * @requires javelin-util
 *           javelin-magical-init
 * @provides javelin-install
 *
 * @javelin-installs NE.install
 * @javelin-installs NE.createClass
 *
 * @javelin
 */

/**
 * Install a class into the Javelin ("NE") namespace. The first argument is the
 * name of the class you want to install, and the second is a map of these
 * attributes (all of which are optional):
 *
 *   - ##construct## //(function)// Class constructor. If you don't provide one,
 *       one will be created for you (but it will be very boring).
 *   - ##extend## //(string)// The name of another NE-namespaced class to extend
 *       via prototypal inheritance.
 *   - ##members## //(map)// A map of instance methods and properties.
 *   - ##statics## //(map)// A map of static methods and properties.
 *   - ##initialize## //(function)// A function which will be run once, after
 *       this class has been installed.
 *   - ##properties## //(map)// A map of properties that should have instance
 *       getters and setters automatically generated for them. The key is the
 *       property name and the value is its default value. For instance, if you
 *       provide the property "size", the installed class will have the methods
 *       "getSize()" and "setSize()". It will **NOT** have a property ".size"
 *       and no guarantees are made about where install is actually chosing to
 *       store the data. The motivation here is to let you cheaply define a
 *       stable interface and refine it later as necessary.
 *   - ##events## //(list)// List of event types this class is capable of
 *       emitting.
 *
 * For example:
 *
 *   NE.install('Dog', {
 *     construct : function(name) {
 *       this.setName(name);
 *     },
 *     members : {
 *       bark : function() {
 *         // ...
 *       }
 *     },
 *     properites : {
 *       name : null,
 *     }
 *   });
 *
 * This creates a new ##Dog## class in the ##NE## namespace:
 *
 *   var d = new NE.Dog();
 *   d.bark();
 *
 * Javelin classes are normal Javascript functions and generally behave in
 * the expected way. Some properties and methods are automatically added to
 * all classes:
 *
 *   - ##instance.__id__## Globally unique identifier attached to each instance.
 *   - ##prototype.__class__## Reference to the class constructor.
 *   - ##constructor.__path__## List of path tokens used emit events. It is
 *       probably never useful to access this directly.
 *   - ##constructor.__readable__## Readable class name. You could use this
 *       for introspection.
 *   - ##constructor.__events__## //DEV ONLY!// List of events supported by
 *       this class.
 *   - ##constructor.listen()## Listen to all instances of this class. See
 *       @{NE.Base}.
 *   - ##instance.listen()## Listen to one instance of this class. See
 *       @{NE.Base}.
 *   - ##instance.invoke()## Invoke an event from an instance. See @{NE.Base}.
 *
 *
 * @param  string  Name of the class to install. It will appear in the NE
 *                 "namespace" (e.g., NE.Pancake).
 * @param  map     Map of properties, see method documentation.
 * @return void
 *
 * @group install
 */
NE.install = function(new_name, new_junk) {

  // If we've already installed this, something is up.
  if (new_name in NE) {
    if (__DEV__) {
      NE.$E(
        'NE.install("' + new_name + '", ...): ' +
        'trying to reinstall something that has already been installed.');
    }
    return;
  }

  if (__DEV__) {
    if ('name' in new_junk) {
      NE.$E(
        'NE.install("' + new_name + '", {"name": ...}): ' +
        'trying to install with "name" property.' +
        'Either remove it or call NE.createClass directly.');
    }
  }

  // Since we may end up loading things out of order (e.g., Dog extends Animal
  // but we load Dog first) we need to keep a list of things that we've been
  // asked to install but haven't yet been able to install around.
  (NE.install._queue || (NE.install._queue = [])).push([new_name, new_junk]);
  var name;
  do {
    var junk;
    var initialize;
    name = null;
    for (var ii = 0; ii < NE.install._queue.length; ++ii) {
      junk = NE.install._queue[ii][1];
      if (junk.extend && !NE[junk.extend]) {
        // We need to extend something that we haven't been able to install
        // yet, so just keep this in queue.
        continue;
      }

      // Install time! First, get this out of the queue.
      name = NE.install._queue.splice(ii, 1)[0][0];
      --ii;

      if (junk.extend) {
        junk.extend = NE[junk.extend];
      }

      initialize = junk.initialize;
      delete junk.initialize;
      junk.name = 'NE.' + name;

      NE[name] = NE.createClass(junk);

      if (initialize) {
        if (NE['Stratcom'] && NE['Stratcom'].ready) {
          initialize.apply(null);
        } else {
          // This is a holding queue, defined in init.js.
          NE['install-init'](initialize);
        }
      }
    }

    // In effect, this exits the loop as soon as we didn't make any progress
    // installing things, which means we've installed everything we have the
    // dependencies for.
  } while (name);
};

/**
 * Creates a class from a map of attributes. Requires ##extend## property to
 * be an actual Class object and not a "String". Supports ##name## property
 * to give the created Class a readable name.
 *
 * @see NE.install for description of supported attributes.
 *
 * @param  junk     Map of properties, see method documentation.
 * @return function Constructor of a class created
 *
 * @group install
 */
NE.createClass = function(junk) {
  var name = junk.name || '';
  var k;
  var ii;

  if (__DEV__) {
    var valid = {
      construct : 1,
      statics : 1,
      members : 1,
      extend : 1,
      properties : 1,
      events : 1,
      name : 1
    };
    for (k in junk) {
      if (!(k in valid)) {
        NE.$E(
          'NE.createClass("' + name + '", {"' + k + '": ...}): ' +
          'trying to create unknown property `' + k + '`.');
      }
    }
    if (junk.constructor !== {}.constructor) {
      NE.$E(
        'NE.createClass("' + name + '", {"constructor": ...}): ' +
        'property `constructor` should be called `construct`.');
    }
  }

  // First, build the constructor. If construct is just a function, this
  // won't change its behavior (unless you have provided a really awesome
  // function, in which case it will correctly punish you for your attempt
  // at creativity).
  var Class = (function(name, junk) {
    var result = function() {
      this.__id__ = '__obj__' + (++NE.install._nextObjectID);
      return (junk.construct || junk.extend || NE.bag).apply(this, arguments);
      // TODO: Allow mixins to initialize here?
      // TODO: Also, build mixins?
    };

    if (__DEV__) {
      var inner = result;
      result = function() {
        if (this == window || this == NE) {
          NE.$E(
            '<' + Class.__readable__ + '>: ' +
            'Tried to construct an instance without the "new" operator.');
        }
        return inner.apply(this, arguments);
      };
    }
    return result;
  })(name, junk);

  Class.__readable__ = name;

  // Copy in all the static methods and properties.
  for (k in junk.statics) {
    // Can't use NE.copy() here yet since it may not have loaded.
    Class[k] = junk.statics[k];
  }

  var proto;
  if (junk.extend) {
    var Inheritance = function() {};
    Inheritance.prototype = junk.extend.prototype;
    proto = Class.prototype = new Inheritance();
  } else {
    proto = Class.prototype = {};
  }

  proto.__class__ = Class;
  var setter = function(prop) {
    return function(v) {
      this[prop] = v;
      return this;
    };
  };
  var getter = function(prop) {
    return function(v) {
      return this[prop];
    };
  };

  // Build getters and setters from the `prop' map.
  for (k in (junk.properties || {})) {
    var base = k.charAt(0).toUpperCase() + k.substr(1);
    var prop = '__auto__' + k;
    proto[prop] = junk.properties[k];
    proto['set' + base] = setter(prop);
    proto['get' + base] = getter(prop);
  }

  if (__DEV__) {

    // Check for aliasing in default values of members. If we don't do this,
    // you can run into a problem like this:
    //
    //  NE.install('List', { members : { stuff : [] }});
    //
    //  var i_love = new NE.List();
    //  var i_hate = new NE.List();
    //
    //  i_love.stuff.push('Psyduck');  // I love psyduck!
    //  NE.log(i_hate.stuff);          // Show stuff I hate.
    //
    // This logs ["Psyduck"] because the push operation modifies
    // NE.List.prototype.stuff, which is what both i_love.stuff and
    // i_hate.stuff resolve to. To avoid this, set the default value to
    // null (or any other scalar) and do "this.stuff = [];" in the
    // constructor.

    for (var member_name in junk.members) {
      if (junk.extend && member_name[0] == '_') {
        NE.$E(
          'NE.createClass("' + name + '", ...): ' +
          'installed member "' + member_name + '" must not be named with ' +
          'a leading underscore because it is in a subclass. Variables ' +
          'are analyzed and crushed one file at a time, and crushed ' +
          'member variables in subclasses alias crushed member variables ' +
          'in superclasses. Remove the underscore, refactor the class so ' +
          'it does not extend anything, or fix the minifier to be ' +
          'capable of safely crushing subclasses.');
      }
      var member_value = junk.members[member_name];
      if (typeof member_value == 'object' && member_value !== null) {
        NE.$E(
          'NE.createClass("' + name + '", ...): ' +
          'installed member "' + member_name + '" is not a scalar or ' +
          'function. Prototypal inheritance in Javascript aliases object ' +
          'references across instances so all instances are initialized ' +
          'to point at the exact same object. This is almost certainly ' +
          'not what you intended. Make this member static to share it ' +
          'across instances, or initialize it in the constructor to ' +
          'prevent reference aliasing and give each instance its own ' +
          'copy of the value.');
      }
    }
  }


  // This execution order intentionally allows you to override methods
  // generated from the "properties" initializer.
  for (k in junk.members) {
    proto[k] = junk.members[k];
  }

  // IE does not enumerate some properties on objects
  var enumerables = NE.install._enumerables;
  if (junk.members && enumerables) {
    ii = enumerables.length;
    while (ii--){
      var property = enumerables[ii];
      if (junk.members[property]) {
        proto[property] = junk.members[property];
      }
    }
  }

  // Build this ridiculous event model thing. Basically, this defines
  // two instance methods, invoke() and listen(), and one static method,
  // listen(). If you listen to an instance you get events for that
  // instance; if you listen to a class you get events for all instances
  // of that class (including instances of classes which extend it).
  //
  // This is rigged up through Stratcom. Each class has a path component
  // like "class:Dog", and each object has a path component like
  // "obj:23". When you invoke on an object, it emits an event with
  // a path that includes its class, all parent classes, and its object
  // ID.
  //
  // Calling listen() on an instance listens for just the object ID.
  // Calling listen() on a class listens for that class's name. This
  // has the effect of working properly, but installing them is pretty
  // messy.

  var parent = junk.extend || {};
  var old_events = parent.__events__;
  var new_events = junk.events || [];
  var has_events = old_events || new_events.length;

  if (has_events) {
    var valid_events = {};

    // If we're in dev, we build up a list of valid events (for this class
    // and our parent class), and then check them on listen and invoke.
    if (__DEV__) {
      for (var key in old_events || {}) {
        valid_events[key] = true;
      }
      for (ii = 0; ii < new_events.length; ++ii) {
        valid_events[junk.events[ii]] = true;
      }
    }

    Class.__events__ = valid_events;

    // Build the class name chain.
    Class.__name__ = 'class:' + name;
    var ancestry = parent.__path__ || [];
    Class.__path__ = ancestry.concat([Class.__name__]);

    proto.invoke = function(type) {
      if (__DEV__) {
        if (!(type in this.__class__.__events__)) {
          NE.$E(
            this.__class__.__readable__ + '.invoke("' + type + '", ...): ' +
            'invalid event type. Valid event types are: ' +
            NE.keys(this.__class__.__events__).join(', ') + '.');
        }
      }
      // Here and below, this nonstandard access notation is used to mask
      // these callsites from the static analyzer. NE.Stratcom is always
      // available by the time we hit these execution points.
      return NE['Stratcom'].invoke(
        'obj:' + type,
        this.__class__.__path__.concat([this.__id__]),
        {args : NE.$A(arguments).slice(1)});
    };

    proto.listen = function(type, callback) {
      if (__DEV__) {
        if (!(type in this.__class__.__events__)) {
          NE.$E(
            this.__class__.__readable__ + '.listen("' + type + '", ...): ' +
            'invalid event type. Valid event types are: ' +
            NE.keys(this.__class__.__events__).join(', ') + '.');
        }
      }
      return NE['Stratcom'].listen(
        'obj:' + type,
        this.__id__,
        NE.bind(this, function(e) {
          return callback.apply(this, e.getData().args);
        }));
    };

    Class.listen = function(type, callback) {
      if (__DEV__) {
        if (!(type in this.__events__)) {
          NE.$E(
            this.__readable__ + '.listen("' + type + '", ...): ' +
            'invalid event type. Valid event types are: ' +
            NE.keys(this.__events__).join(', ') + '.');
        }
      }
      return NE['Stratcom'].listen(
        'obj:' + type,
        this.__name__,
        NE.bind(this, function(e) {
          return callback.apply(this, e.getData().args);
        }));
    };
  } else if (__DEV__) {
    var error_message =
      'class does not define any events. Pass an "events" property to ' +
      'NE.createClass() to define events.';
    Class.listen = Class.listen || function() {
      NE.$E(
        this.__readable__ + '.listen(...): ' +
        error_message);
    };
    Class.invoke = Class.invoke || function() {
      NE.$E(
        this.__readable__ + '.invoke(...): ' +
        error_message);
    };
    proto.listen = proto.listen || function() {
      NE.$E(
        this.__class__.__readable__ + '.listen(...): ' +
        error_message);
    };
    proto.invoke = proto.invoke || function() {
      NE.$E(
        this.__class__.__readable__ + '.invoke(...): ' +
        error_message);
    };
  }

  return Class;
};

NE.install._nextObjectID = 0;

(function() {
  // IE does not enter this loop.
  for (var i in {toString: 1}) {
    return;
  }

  NE.install._enumerables = [
    'toString', 'hasOwnProperty', 'valueOf', 'isPrototypeOf',
    'propertyIsEnumerable', 'toLocaleString', 'constructor'
  ];
})();

})();

