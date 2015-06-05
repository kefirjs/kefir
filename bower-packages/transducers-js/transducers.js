// transducers-js 0.4.174
// http://github.com/cognitect-labs/transducers-js
// 
// Copyright 2014-2015 Cognitect. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License..
;(function(){var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.isDef = function(a) {
  return void 0 !== a;
};
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  a[0] in c || !c.execScript || c.execScript("var " + a[0]);
  for (var d;a.length && (d = a.shift());) {
    !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {};
  }
};
goog.define = function(a, b) {
  var c = b;
  COMPILED || (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, a) ? c = goog.global.CLOSURE_UNCOMPILED_DEFINES[a] : goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, a) && (c = goog.global.CLOSURE_DEFINES[a]));
  goog.exportPath_(a, c);
};
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.STRICT_MODE_COMPATIBLE = !1;
goog.DISALLOW_TEST_ONLY_CODE = COMPILED && !goog.DEBUG;
goog.provide = function(a) {
  if (!COMPILED && goog.isProvided_(a)) {
    throw Error('Namespace "' + a + '" already declared.');
  }
  goog.constructNamespace_(a);
};
goog.constructNamespace_ = function(a, b) {
  if (!COMPILED) {
    delete goog.implicitNamespaces_[a];
    for (var c = a;(c = c.substring(0, c.lastIndexOf("."))) && !goog.getObjectByName(c);) {
      goog.implicitNamespaces_[c] = !0;
    }
  }
  goog.exportPath_(a, b);
};
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
goog.module = function(a) {
  if (!goog.isString(a) || !a || -1 == a.search(goog.VALID_MODULE_RE_)) {
    throw Error("Invalid module identifier");
  }
  if (!goog.isInModuleLoader_()) {
    throw Error("Module " + a + " has been loaded incorrectly.");
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  goog.moduleLoaderState_.moduleName = a;
  if (!COMPILED) {
    if (goog.isProvided_(a)) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    delete goog.implicitNamespaces_[a];
  }
};
goog.module.get = function(a) {
  return goog.module.getInternal_(a);
};
goog.module.getInternal_ = function(a) {
  if (!COMPILED) {
    return goog.isProvided_(a) ? a in goog.loadedModules_ ? goog.loadedModules_[a] : goog.getObjectByName(a) : null;
  }
};
goog.moduleLoaderState_ = null;
goog.isInModuleLoader_ = function() {
  return null != goog.moduleLoaderState_;
};
goog.module.declareTestMethods = function() {
  if (!goog.isInModuleLoader_()) {
    throw Error("goog.module.declareTestMethods must be called from within a goog.module");
  }
  goog.moduleLoaderState_.declareTestMethods = !0;
};
goog.module.declareLegacyNamespace = function() {
  if (!COMPILED && !goog.isInModuleLoader_()) {
    throw Error("goog.module.declareLegacyNamespace must be called from within a goog.module");
  }
  if (!COMPILED && !goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module must be called prior to goog.module.declareLegacyNamespace.");
  }
  goog.moduleLoaderState_.declareLegacyNamespace = !0;
};
goog.setTestOnly = function(a) {
  if (goog.DISALLOW_TEST_ONLY_CODE) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + (a ? ": " + a : "."));
  }
};
goog.forwardDeclare = function(a) {
};
COMPILED || (goog.isProvided_ = function(a) {
  return a in goog.loadedModules_ || !goog.implicitNamespaces_[a] && goog.isDefAndNotNull(goog.getObjectByName(a));
}, goog.implicitNamespaces_ = {"goog.module":!0});
goog.getObjectByName = function(a, b) {
  for (var c = a.split("."), d = b || goog.global, e;e = c.shift();) {
    if (goog.isDefAndNotNull(d[e])) {
      d = d[e];
    } else {
      return null;
    }
  }
  return d;
};
goog.globalize = function(a, b) {
  var c = b || goog.global, d;
  for (d in a) {
    c[d] = a[d];
  }
};
goog.addDependency = function(a, b, c, d) {
  if (goog.DEPENDENCIES_ENABLED) {
    var e;
    a = a.replace(/\\/g, "/");
    for (var f = goog.dependencies_, g = 0;e = b[g];g++) {
      f.nameToPath[e] = a, f.pathIsModule[a] = !!d;
    }
    for (d = 0;b = c[d];d++) {
      a in f.requires || (f.requires[a] = {}), f.requires[a][b] = !0;
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.logToConsole_ = function(a) {
  goog.global.console && goog.global.console.error(a);
};
goog.require = function(a) {
  if (!COMPILED) {
    goog.ENABLE_DEBUG_LOADER && goog.IS_OLD_IE_ && goog.maybeProcessDeferredDep_(a);
    if (goog.isProvided_(a)) {
      return goog.isInModuleLoader_() ? goog.module.getInternal_(a) : null;
    }
    if (goog.ENABLE_DEBUG_LOADER) {
      var b = goog.getPathFromDeps_(a);
      if (b) {
        return goog.included_[b] = !0, goog.writeScripts_(), null;
      }
    }
    a = "goog.require could not find: " + a;
    goog.logToConsole_(a);
    throw Error(a);
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a, b) {
  return a;
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    if (a.instance_) {
      return a.instance_;
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
    return a.instance_ = new a;
  };
};
goog.instantiatedSingletons_ = [];
goog.LOAD_MODULE_USING_EVAL = !0;
goog.SEAL_MODULE_EXPORTS = goog.DEBUG;
goog.loadedModules_ = {};
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
goog.DEPENDENCIES_ENABLED && (goog.included_ = {}, goog.dependencies_ = {pathIsModule:{}, nameToPath:{}, requires:{}, visited:{}, written:{}, deferred:{}}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return "undefined" != typeof a && "write" in a;
}, goog.findBasePath_ = function() {
  if (goog.isDef(goog.global.CLOSURE_BASE_PATH)) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH;
  } else {
    if (goog.inHtmlDocument_()) {
      for (var a = goog.global.document.getElementsByTagName("SCRIPT"), b = a.length - 1;0 <= b;--b) {
        var c = a[b].src, d = c.lastIndexOf("?"), d = -1 == d ? c.length : d;
        if ("base.js" == c.substr(d - 7, 7)) {
          goog.basePath = c.substr(0, d - 7);
          break;
        }
      }
    }
  }
}, goog.importScript_ = function(a, b) {
  (goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_)(a, b) && (goog.dependencies_.written[a] = !0);
}, goog.IS_OLD_IE_ = !(goog.global.atob || !goog.global.document || !goog.global.document.all), goog.importModule_ = function(a) {
  goog.importScript_("", 'goog.retrieveAndExecModule_("' + a + '");') && (goog.dependencies_.written[a] = !0);
}, goog.queuedModules_ = [], goog.wrapModule_ = function(a, b) {
  return goog.LOAD_MODULE_USING_EVAL && goog.isDef(goog.global.JSON) ? "goog.loadModule(" + goog.global.JSON.stringify(b + "\n//# sourceURL=" + a + "\n") + ");" : 'goog.loadModule(function(exports) {"use strict";' + b + "\n;return exports});\n//# sourceURL=" + a + "\n";
}, goog.loadQueuedModules_ = function() {
  var a = goog.queuedModules_.length;
  if (0 < a) {
    var b = goog.queuedModules_;
    goog.queuedModules_ = [];
    for (var c = 0;c < a;c++) {
      goog.maybeProcessDeferredPath_(b[c]);
    }
  }
}, goog.maybeProcessDeferredDep_ = function(a) {
  goog.isDeferredModule_(a) && goog.allDepsAreAvailable_(a) && (a = goog.getPathFromDeps_(a), goog.maybeProcessDeferredPath_(goog.basePath + a));
}, goog.isDeferredModule_ = function(a) {
  return (a = goog.getPathFromDeps_(a)) && goog.dependencies_.pathIsModule[a] ? goog.basePath + a in goog.dependencies_.deferred : !1;
}, goog.allDepsAreAvailable_ = function(a) {
  if ((a = goog.getPathFromDeps_(a)) && a in goog.dependencies_.requires) {
    for (var b in goog.dependencies_.requires[a]) {
      if (!goog.isProvided_(b) && !goog.isDeferredModule_(b)) {
        return !1;
      }
    }
  }
  return !0;
}, goog.maybeProcessDeferredPath_ = function(a) {
  if (a in goog.dependencies_.deferred) {
    var b = goog.dependencies_.deferred[a];
    delete goog.dependencies_.deferred[a];
    goog.globalEval(b);
  }
}, goog.loadModule = function(a) {
  var b = goog.moduleLoaderState_;
  try {
    goog.moduleLoaderState_ = {moduleName:void 0, declareTestMethods:!1};
    var c;
    if (goog.isFunction(a)) {
      c = a.call(goog.global, {});
    } else {
      if (goog.isString(a)) {
        c = goog.loadModuleFromSource_.call(goog.global, a);
      } else {
        throw Error("Invalid module definition");
      }
    }
    var d = goog.moduleLoaderState_.moduleName;
    if (!goog.isString(d) || !d) {
      throw Error('Invalid module name "' + d + '"');
    }
    goog.moduleLoaderState_.declareLegacyNamespace ? goog.constructNamespace_(d, c) : goog.SEAL_MODULE_EXPORTS && Object.seal && Object.seal(c);
    goog.loadedModules_[d] = c;
    if (goog.moduleLoaderState_.declareTestMethods) {
      for (var e in c) {
        if (0 === e.indexOf("test", 0) || "tearDown" == e || "setUp" == e || "setUpPage" == e || "tearDownPage" == e) {
          goog.global[e] = c[e];
        }
      }
    }
  } finally {
    goog.moduleLoaderState_ = b;
  }
}, goog.loadModuleFromSource_ = function(a) {
  eval(a);
  return {};
}, goog.writeScriptTag_ = function(a, b) {
  if (goog.inHtmlDocument_()) {
    var c = goog.global.document;
    if ("complete" == c.readyState) {
      if (/\bdeps.js$/.test(a)) {
        return !1;
      }
      throw Error('Cannot write "' + a + '" after document load');
    }
    var d = goog.IS_OLD_IE_;
    void 0 === b ? d ? (d = " onreadystatechange='goog.onScriptLoad_(this, " + ++goog.lastNonModuleScriptIndex_ + ")' ", c.write('<script type="text/javascript" src="' + a + '"' + d + ">\x3c/script>")) : c.write('<script type="text/javascript" src="' + a + '">\x3c/script>') : c.write('<script type="text/javascript">' + b + "\x3c/script>");
    return !0;
  }
  return !1;
}, goog.lastNonModuleScriptIndex_ = 0, goog.onScriptLoad_ = function(a, b) {
  "complete" == a.readyState && goog.lastNonModuleScriptIndex_ == b && goog.loadQueuedModules_();
  return !0;
}, goog.writeScripts_ = function() {
  function a(e) {
    if (!(e in d.written)) {
      if (!(e in d.visited) && (d.visited[e] = !0, e in d.requires)) {
        for (var f in d.requires[e]) {
          if (!goog.isProvided_(f)) {
            if (f in d.nameToPath) {
              a(d.nameToPath[f]);
            } else {
              throw Error("Undefined nameToPath for " + f);
            }
          }
        }
      }
      e in c || (c[e] = !0, b.push(e));
    }
  }
  var b = [], c = {}, d = goog.dependencies_, e;
  for (e in goog.included_) {
    d.written[e] || a(e);
  }
  for (var f = 0;f < b.length;f++) {
    e = b[f], goog.dependencies_.written[e] = !0;
  }
  var g = goog.moduleLoaderState_;
  goog.moduleLoaderState_ = null;
  for (f = 0;f < b.length;f++) {
    if (e = b[f]) {
      d.pathIsModule[e] ? goog.importModule_(goog.basePath + e) : goog.importScript_(goog.basePath + e);
    } else {
      throw goog.moduleLoaderState_ = g, Error("Undefined script input");
    }
  }
  goog.moduleLoaderState_ = g;
}, goog.getPathFromDeps_ = function(a) {
  return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null;
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.normalizePath_ = function(a) {
  a = a.split("/");
  for (var b = 0;b < a.length;) {
    "." == a[b] ? a.splice(b, 1) : b && ".." == a[b] && a[b - 1] && ".." != a[b - 1] ? a.splice(--b, 2) : b++;
  }
  return a.join("/");
};
goog.retrieveAndExecModule_ = function(a) {
  if (!COMPILED) {
    var b = a;
    a = goog.normalizePath_(a);
    var c = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_, d = null, e = new goog.global.XMLHttpRequest;
    e.onload = function() {
      d = this.responseText;
    };
    e.open("get", a, !1);
    e.send();
    d = e.responseText;
    if (null != d) {
      e = goog.wrapModule_(a, d), goog.IS_OLD_IE_ ? (goog.dependencies_.deferred[b] = e, goog.queuedModules_.push(b)) : c(a, e);
    } else {
      throw Error("load of " + a + "failed");
    }
  }
};
goog.typeOf = function(a) {
  var b = typeof a;
  if ("object" == b) {
    if (a) {
      if (a instanceof Array) {
        return "array";
      }
      if (a instanceof Object) {
        return b;
      }
      var c = Object.prototype.toString.call(a);
      if ("[object Window]" == c) {
        return "object";
      }
      if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return "array";
      }
      if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if ("function" == b && "undefined" == typeof a.call) {
      return "object";
    }
  }
  return b;
};
goog.isNull = function(a) {
  return null === a;
};
goog.isDefAndNotNull = function(a) {
  return null != a;
};
goog.isArray = function(a) {
  return "array" == goog.typeOf(a);
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return "array" == b || "object" == b && "number" == typeof a.length;
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && "function" == typeof a.getFullYear;
};
goog.isString = function(a) {
  return "string" == typeof a;
};
goog.isBoolean = function(a) {
  return "boolean" == typeof a;
};
goog.isNumber = function(a) {
  return "number" == typeof a;
};
goog.isFunction = function(a) {
  return "function" == goog.typeOf(a);
};
goog.isObject = function(a) {
  var b = typeof a;
  return "object" == b && null != a || "function" == b;
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(a) {
  return !!a[goog.UID_PROPERTY_];
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_];
  } catch (b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if ("object" == b || "array" == b) {
    if (a.clone) {
      return a.clone();
    }
    var b = "array" == b ? [] : {}, c;
    for (c in a) {
      b[c] = goog.cloneObject(a[c]);
    }
    return b;
  }
  return a;
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments);
};
goog.bindJs_ = function(a, b, c) {
  if (!a) {
    throw Error();
  }
  if (2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c);
    };
  }
  return function() {
    return a.apply(b, arguments);
  };
};
goog.bind = function(a, b, c) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
  return goog.bind.apply(null, arguments);
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = c.slice();
    b.push.apply(b, arguments);
    return a.apply(this, b);
  };
};
goog.mixin = function(a, b) {
  for (var c in b) {
    a[c] = b[c];
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return +new Date;
};
goog.globalEval = function(a) {
  if (goog.global.execScript) {
    goog.global.execScript(a, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) {
        goog.global.eval(a);
      } else {
        var b = goog.global.document, c = b.createElement("SCRIPT");
        c.type = "text/javascript";
        c.defer = !1;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
  var c = function(a) {
    return goog.cssNameMapping_[a] || a;
  }, d = function(a) {
    a = a.split("-");
    for (var b = [], d = 0;d < a.length;d++) {
      b.push(c(a[d]));
    }
    return b.join("-");
  }, d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function(a) {
    return a;
  };
  return b ? a + "-" + d(b) : d(a);
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b;
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
  b && (a = a.replace(/\{\$([^}]+)}/g, function(a, d) {
    return d in b ? b[d] : a;
  }));
  return a;
};
goog.getMsgWithFallback = function(a, b) {
  return a;
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c);
};
goog.exportProperty = function(a, b, c) {
  a[b] = c;
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a;
  a.base = function(a, c, f) {
    for (var g = Array(arguments.length - 2), h = 2;h < arguments.length;h++) {
      g[h - 2] = arguments[h];
    }
    return b.prototype[c].apply(a, g);
  };
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !d) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (d.superClass_) {
    for (var e = Array(arguments.length - 1), f = 1;f < arguments.length;f++) {
      e[f - 1] = arguments[f];
    }
    return d.superClass_.constructor.apply(a, e);
  }
  e = Array(arguments.length - 2);
  for (f = 2;f < arguments.length;f++) {
    e[f - 2] = arguments[f];
  }
  for (var f = !1, g = a.constructor;g;g = g.superClass_ && g.superClass_.constructor) {
    if (g.prototype[b] === d) {
      f = !0;
    } else {
      if (f) {
        return g.prototype[b].apply(a, e);
      }
    }
  }
  if (a[b] === d) {
    return a.constructor.prototype[b].apply(a, e);
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  a.call(goog.global);
};
COMPILED || (goog.global.COMPILED = COMPILED);
goog.defineClass = function(a, b) {
  var c = b.constructor, d = b.statics;
  c && c != Object.prototype.constructor || (c = function() {
    throw Error("cannot instantiate an interface (no constructor defined).");
  });
  c = goog.defineClass.createSealingConstructor_(c, a);
  a && goog.inherits(c, a);
  delete b.constructor;
  delete b.statics;
  goog.defineClass.applyProperties_(c.prototype, b);
  null != d && (d instanceof Function ? d(c) : goog.defineClass.applyProperties_(c, d));
  return c;
};
goog.defineClass.SEAL_CLASS_INSTANCES = goog.DEBUG;
goog.defineClass.createSealingConstructor_ = function(a, b) {
  if (goog.defineClass.SEAL_CLASS_INSTANCES && Object.seal instanceof Function) {
    if (b && b.prototype && b.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]) {
      return a;
    }
    var c = function() {
      var b = a.apply(this, arguments) || this;
      b[goog.UID_PROPERTY_] = b[goog.UID_PROPERTY_];
      this.constructor === c && Object.seal(b);
      return b;
    };
    return c;
  }
  return a;
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.defineClass.applyProperties_ = function(a, b) {
  for (var c in b) {
    Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);
  }
  for (var d = 0;d < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;d++) {
    c = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[d], Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);
  }
};
goog.tagUnsealableClass = function(a) {
  !COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES && (a.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = !0);
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
var com = {cognitect:{}};
com.cognitect.transducers = {};
var TRANSDUCERS_DEV = !0, TRANSDUCERS_NODE_TARGET = !1, TRANSDUCERS_BROWSER_TARGET = !0, TRANSDUCERS_BROWSER_AMD_TARGET = !1;
com.cognitect.transducers.ITER_SYMBOL = "undefined" != typeof Symbol ? Symbol.iterator : "@@iterator";
com.cognitect.transducers.ITransformer = function() {
};
com.cognitect.transducers.ITransformer.prototype["@@transducer/init"] = function() {
};
com.cognitect.transducers.ITransformer.prototype["@@transducer/result"] = function(a) {
};
com.cognitect.transducers.ITransformer.prototype["@@transducer/step"] = function(a, b) {
};
com.cognitect.transducers.IReduced = function() {
};
com.cognitect.transducers.isString = function(a) {
  return "string" == typeof a;
};
com.cognitect.transducers.isArray = "undefined" != typeof Array.isArray ? function(a) {
  return Array.isArray(a);
} : function(a) {
  return "array" == goog.typeOf(a);
};
com.cognitect.transducers.isObject = function(a) {
  return "object" == goog.typeOf(a);
};
com.cognitect.transducers.isIterable = function(a) {
  return a[com.cognitect.transducers.ITER_SYMBOL] || a.next;
};
com.cognitect.transducers.slice = function(a, b, c) {
  return null == c ? Array.prototype.slice.call(a, b) : Array.prototype.slice.call(a, b, c);
};
com.cognitect.transducers.complement = function(a) {
  return function(b) {
    return !a.apply(null, com.cognitect.transducers.slice(arguments, 0));
  };
};
com.cognitect.transducers.Wrap = function(a) {
  this.stepFn = a;
};
com.cognitect.transducers.Wrap.prototype["@@transducer/init"] = function() {
  throw Error("init not implemented");
};
com.cognitect.transducers.Wrap.prototype["@@transducer/result"] = function(a) {
  return a;
};
com.cognitect.transducers.Wrap.prototype["@@transducer/step"] = function(a, b) {
  return this.stepFn(a, b);
};
com.cognitect.transducers.wrap = function(a) {
  return "function" == typeof a ? new com.cognitect.transducers.Wrap(a) : a;
};
com.cognitect.transducers.Reduced = function(a) {
  this["@@transducer/reduced"] = !0;
  this["@@transducer/value"] = a;
};
com.cognitect.transducers.reduced = function(a) {
  return new com.cognitect.transducers.Reduced(a);
};
com.cognitect.transducers.isReduced = function(a) {
  return a instanceof com.cognitect.transducers.Reduced || a && a["@@transducer/reduced"];
};
com.cognitect.transducers.ensureReduced = function(a) {
  return com.cognitect.transducers.isReduced(a) ? a : com.cognitect.transducers.reduced(a);
};
com.cognitect.transducers.deref = function(a) {
  return a["@@transducer/value"];
};
com.cognitect.transducers.unreduced = function(a) {
  return com.cognitect.transducers.isReduced(a) ? com.cognitect.transducers.deref(a) : a;
};
com.cognitect.transducers.identity = function(a) {
  return a;
};
com.cognitect.transducers.comp = function(a) {
  var b = arguments.length;
  if (2 == b) {
    var c = arguments[0], d = arguments[1];
    return function(a) {
      return c(d.apply(null, com.cognitect.transducers.slice(arguments, 0)));
    };
  }
  if (2 < b) {
    return com.cognitect.transducers.reduce(com.cognitect.transducers.comp, arguments[0], com.cognitect.transducers.slice(arguments, 1));
  }
  if (TRANSDUCERS_DEV) {
    throw Error("comp must given at least 2 arguments");
  }
};
com.cognitect.transducers.Map = function(a, b) {
  this.f = a;
  this.xf = b;
};
com.cognitect.transducers.Map.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.Map.prototype["@@transducer/result"] = function(a) {
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.Map.prototype["@@transducer/step"] = function(a, b) {
  return this.xf["@@transducer/step"](a, this.f(b));
};
com.cognitect.transducers.map = function(a) {
  if (TRANSDUCERS_DEV && null == a) {
    throw Error("At least one argument must be supplied to map");
  }
  return function(b) {
    return new com.cognitect.transducers.Map(a, b);
  };
};
com.cognitect.transducers.Filter = function(a, b) {
  this.pred = a;
  this.xf = b;
};
com.cognitect.transducers.Filter.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.Filter.prototype["@@transducer/result"] = function(a) {
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.Filter.prototype["@@transducer/step"] = function(a, b) {
  return this.pred(b) ? this.xf["@@transducer/step"](a, b) : a;
};
com.cognitect.transducers.filter = function(a) {
  if (TRANSDUCERS_DEV && "function" != typeof a) {
    throw Error("filter must be given a function");
  }
  return function(b) {
    return new com.cognitect.transducers.Filter(a, b);
  };
};
com.cognitect.transducers.remove = function(a) {
  if (TRANSDUCERS_DEV && "function" != typeof a) {
    throw Error("remove must be given a function");
  }
  return com.cognitect.transducers.filter(com.cognitect.transducers.complement(a));
};
com.cognitect.transducers.Take = function(a, b) {
  this.n = a;
  this.xf = b;
};
com.cognitect.transducers.Take.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.Take.prototype["@@transducer/result"] = function(a) {
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.Take.prototype["@@transducer/step"] = function(a, b) {
  a = 0 < this.n ? this.xf["@@transducer/step"](a, b) : com.cognitect.transducers.ensureReduced(a);
  this.n--;
  return a;
};
com.cognitect.transducers.take = function(a) {
  if (TRANSDUCERS_DEV && "number" != typeof a) {
    throw Error("take must be given an integer");
  }
  return function(b) {
    return new com.cognitect.transducers.Take(a, b);
  };
};
com.cognitect.transducers.TakeWhile = function(a, b) {
  this.pred = a;
  this.xf = b;
};
com.cognitect.transducers.TakeWhile.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.TakeWhile.prototype["@@transducer/result"] = function(a) {
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.TakeWhile.prototype["@@transducer/step"] = function(a, b) {
  return this.pred(b) ? this.xf["@@transducer/step"](a, b) : com.cognitect.transducers.reduced(a);
};
com.cognitect.transducers.takeWhile = function(a) {
  if (TRANSDUCERS_DEV && "function" != typeof a) {
    throw Error("takeWhile must given a function");
  }
  return function(b) {
    return new com.cognitect.transducers.TakeWhile(a, b);
  };
};
com.cognitect.transducers.TakeNth = function(a, b) {
  this.i = -1;
  this.n = a;
  this.xf = b;
};
com.cognitect.transducers.TakeNth.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.TakeNth.prototype["@@transducer/result"] = function(a) {
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.TakeNth.prototype["@@transducer/step"] = function(a, b) {
  this.i++;
  return 0 == this.i % this.n ? this.xf["@@transducer/step"](a, b) : a;
};
com.cognitect.transducers.takeNth = function(a) {
  if (TRANSDUCERS_DEV && "number" != typeof a) {
    throw Error("takeNth must be given a number");
  }
  return function(b) {
    return new com.cognitect.transducers.TakeNth(a, b);
  };
};
com.cognitect.transducers.Drop = function(a, b) {
  this.n = a;
  this.xf = b;
};
com.cognitect.transducers.Drop.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.Drop.prototype["@@transducer/result"] = function(a) {
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.Drop.prototype["@@transducer/step"] = function(a, b) {
  return 0 < this.n ? (this.n--, a) : this.xf["@@transducer/step"](a, b);
};
com.cognitect.transducers.drop = function(a) {
  if (TRANSDUCERS_DEV && "number" !== typeof a) {
    throw Error("drop must be given an integer");
  }
  return function(b) {
    return new com.cognitect.transducers.Drop(a, b);
  };
};
com.cognitect.transducers.DropWhile = function(a, b) {
  this.drop = !0;
  this.pred = a;
  this.xf = b;
};
com.cognitect.transducers.DropWhile.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.DropWhile.prototype["@@transducer/result"] = function(a) {
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.DropWhile.prototype["@@transducer/step"] = function(a, b) {
  if (this.drop && this.pred(b)) {
    return a;
  }
  this.drop && (this.drop = !1);
  return this.xf["@@transducer/step"](a, b);
};
com.cognitect.transducers.dropWhile = function(a) {
  if (TRANSDUCERS_DEV && "function" != typeof a) {
    throw Error("dropWhile must be given a function");
  }
  return function(b) {
    return new com.cognitect.transducers.DropWhile(a, b);
  };
};
com.cognitect.transducers.NONE = {};
com.cognitect.transducers.PartitionBy = function(a, b) {
  this.f = a;
  this.xf = b;
  this.a = [];
  this.pval = com.cognitect.transducers.NONE;
};
com.cognitect.transducers.PartitionBy.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.PartitionBy.prototype["@@transducer/result"] = function(a) {
  0 < this.a.length && (a = com.cognitect.transducers.unreduced(this.xf["@@transducer/step"](a, this.a)), this.a = []);
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.PartitionBy.prototype["@@transducer/step"] = function(a, b) {
  var c = this.pval, d = this.f(b);
  this.pval = d;
  if (c == com.cognitect.transducers.NONE || c == d) {
    return this.a.push(b), a;
  }
  c = this.xf["@@transducer/step"](a, this.a);
  this.a = [];
  com.cognitect.transducers.isReduced(c) || this.a.push(b);
  return c;
};
com.cognitect.transducers.partitionBy = function(a) {
  if (TRANSDUCERS_DEV && "function" != typeof a) {
    throw Error("partitionBy must be given an function");
  }
  return function(b) {
    return new com.cognitect.transducers.PartitionBy(a, b);
  };
};
com.cognitect.transducers.PartitionAll = function(a, b) {
  this.n = a;
  this.xf = b;
  this.a = [];
};
com.cognitect.transducers.PartitionAll.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.PartitionAll.prototype["@@transducer/result"] = function(a) {
  0 < this.a.length && (a = com.cognitect.transducers.unreduced(this.xf["@@transducer/step"](a, this.a)), this.a = []);
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.PartitionAll.prototype["@@transducer/step"] = function(a, b) {
  this.a.push(b);
  if (this.n == this.a.length) {
    var c = this.a;
    this.a = [];
    return this.xf["@@transducer/step"](a, c);
  }
  return a;
};
com.cognitect.transducers.partitionAll = function(a) {
  if (TRANSDUCERS_DEV && "number" != typeof a) {
    throw Error("partitionAll must be given a number");
  }
  return function(b) {
    return new com.cognitect.transducers.PartitionAll(a, b);
  };
};
com.cognitect.transducers.Keep = function(a, b) {
  this.f = a;
  this.xf = b;
};
com.cognitect.transducers.Keep.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.Keep.prototype["@@transducer/result"] = function(a) {
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.Keep.prototype["@@transducer/step"] = function(a, b) {
  return null == this.f(b) ? a : this.xf["@@transducer/step"](a, b);
};
com.cognitect.transducers.keep = function(a) {
  if (TRANSDUCERS_DEV && "function" != typeof a) {
    throw Error("keep must be given a function");
  }
  return function(b) {
    return new com.cognitect.transducers.Keep(a, b);
  };
};
com.cognitect.transducers.KeepIndexed = function(a, b) {
  this.i = -1;
  this.f = a;
  this.xf = b;
};
com.cognitect.transducers.KeepIndexed.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.KeepIndexed.prototype["@@transducer/result"] = function(a) {
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.KeepIndexed.prototype["@@transducer/step"] = function(a, b) {
  this.i++;
  return null == this.f(this.i, b) ? a : this.xf["@@transducer/step"](a, b);
};
com.cognitect.transducers.keepIndexed = function(a) {
  if (TRANSDUCERS_DEV && "function" != typeof a) {
    throw Error("keepIndexed must be given a function");
  }
  return function(b) {
    return new com.cognitect.transducers.KeepIndexed(a, b);
  };
};
com.cognitect.transducers.preservingReduced = function(a) {
  return {"@@transducer/init":function() {
    return a["@@transducer/init"]();
  }, "@@transducer/result":function(a) {
    return a;
  }, "@@transducer/step":function(b, c) {
    var d = a["@@transducer/step"](b, c);
    return com.cognitect.transducers.isReduced(d) ? com.cognitect.transducers.reduced(d) : d;
  }};
};
com.cognitect.transducers.cat = function(a) {
  var b = com.cognitect.transducers.preservingReduced(a);
  return {"@@transducer/init":function() {
    return a["@@transducer/init"]();
  }, "@@transducer/result":function(b) {
    return a["@@transducer/result"](b);
  }, "@@transducer/step":function(a, d) {
    return com.cognitect.transducers.reduce(b, a, d);
  }};
};
com.cognitect.transducers.mapcat = function(a) {
  return com.cognitect.transducers.comp(com.cognitect.transducers.map(a), com.cognitect.transducers.cat);
};
com.cognitect.transducers.stringReduce = function(a, b, c) {
  for (var d = 0;d < c.length;d++) {
    if (b = a["@@transducer/step"](b, c.charAt(d)), com.cognitect.transducers.isReduced(b)) {
      b = com.cognitect.transducers.deref(b);
      break;
    }
  }
  return a["@@transducer/result"](b);
};
com.cognitect.transducers.arrayReduce = function(a, b, c) {
  for (var d = 0;d < c.length;d++) {
    if (b = a["@@transducer/step"](b, c[d]), com.cognitect.transducers.isReduced(b)) {
      b = com.cognitect.transducers.deref(b);
      break;
    }
  }
  return a["@@transducer/result"](b);
};
com.cognitect.transducers.objectReduce = function(a, b, c) {
  for (var d in c) {
    if (c.hasOwnProperty(d) && (b = a["@@transducer/step"](b, [d, c[d]]), com.cognitect.transducers.isReduced(b))) {
      b = com.cognitect.transducers.deref(b);
      break;
    }
  }
  return a["@@transducer/result"](b);
};
com.cognitect.transducers.iterableReduce = function(a, b, c) {
  c[com.cognitect.transducers.ITER_SYMBOL] && (c = c[com.cognitect.transducers.ITER_SYMBOL]());
  for (var d = c.next();!d.done;) {
    b = a["@@transducer/step"](b, d.value);
    if (com.cognitect.transducers.isReduced(b)) {
      b = com.cognitect.transducers.deref(b);
      break;
    }
    d = c.next();
  }
  return a["@@transducer/result"](b);
};
com.cognitect.transducers.reduce = function(a, b, c) {
  if (c) {
    a = "function" == typeof a ? com.cognitect.transducers.wrap(a) : a;
    if (com.cognitect.transducers.isString(c)) {
      return com.cognitect.transducers.stringReduce(a, b, c);
    }
    if (com.cognitect.transducers.isArray(c)) {
      return com.cognitect.transducers.arrayReduce(a, b, c);
    }
    if (com.cognitect.transducers.isIterable(c)) {
      return com.cognitect.transducers.iterableReduce(a, b, c);
    }
    if (com.cognitect.transducers.isObject(c)) {
      return com.cognitect.transducers.objectReduce(a, b, c);
    }
    throw Error("Cannot reduce instance of " + c.constructor.name);
  }
};
com.cognitect.transducers.transduce = function(a, b, c, d) {
  if (3 == arguments.length) {
    d = c;
    if ("function" == typeof b) {
      throw Error("If given only three arguments f must satisfy the ITransformer interface.");
    }
    c = b["@@transducer/init"]();
  }
  b = "function" == typeof b ? com.cognitect.transducers.wrap(b) : b;
  a = a(b);
  return com.cognitect.transducers.reduce(a, c, d);
};
com.cognitect.transducers.stringAppend = function(a, b) {
  return a + b;
};
com.cognitect.transducers.arrayPush = function(a, b) {
  a.push(b);
  return a;
};
com.cognitect.transducers.addEntry = function(a, b) {
  a[b[0]] = b[1];
  return a;
};
com.cognitect.transducers.into = function(a, b, c) {
  if (com.cognitect.transducers.isString(a)) {
    return com.cognitect.transducers.transduce(b, com.cognitect.transducers.stringAppend, a, c);
  }
  if (com.cognitect.transducers.isArray(a)) {
    return com.cognitect.transducers.transduce(b, com.cognitect.transducers.arrayPush, a, c);
  }
  if (com.cognitect.transducers.isObject(a)) {
    return com.cognitect.transducers.transduce(b, com.cognitect.transducers.addEntry, a, c);
  }
};
com.cognitect.transducers.Completing = function(a, b) {
  this.cf = a;
  this.xf = b;
};
com.cognitect.transducers.Completing.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.Completing.prototype["@@transducer/result"] = function(a) {
  return this.cf(a);
};
com.cognitect.transducers.Completing.prototype["@@transducer/step"] = function(a, b) {
  return this.xf["@@transducer/step"](a, b);
};
com.cognitect.transducers.completing = function(a, b) {
  a = "function" == typeof a ? com.cognitect.transducers.wrap(a) : a;
  b = b || com.cognitect.transducers.identity;
  if (TRANSDUCERS_DEV && null != a && !com.cognitect.transducers.isObject(a)) {
    throw Error("completing must be given a transducer as first argument");
  }
  return new com.cognitect.transducers.Completing(b, a);
};
com.cognitect.transducers.toFn = function(a, b) {
  "function" == typeof b && (b = com.cognitect.transducers.wrap(b));
  var c = a(b);
  return c["@@transducer/step"].bind(c);
};
com.cognitect.transducers.first = com.cognitect.transducers.wrap(function(a, b) {
  return com.cognitect.transducers.reduced(b);
});
TRANSDUCERS_BROWSER_TARGET && (goog.exportSymbol("transducers.reduced", com.cognitect.transducers.reduced), goog.exportSymbol("transducers.isReduced", com.cognitect.transducers.isReduced), goog.exportSymbol("transducers.comp", com.cognitect.transducers.comp), goog.exportSymbol("transducers.complement", com.cognitect.transducers.complement), goog.exportSymbol("transducers.identity", com.cognitect.transducers.identity), goog.exportSymbol("transducers.transduce", com.cognitect.transducers.transduce), 
goog.exportSymbol("transducers.reduce", com.cognitect.transducers.reduce), goog.exportSymbol("transducers.map", com.cognitect.transducers.map), goog.exportSymbol("transducers.Map", com.cognitect.transducers.Map), goog.exportSymbol("transducers.filter", com.cognitect.transducers.filter), goog.exportSymbol("transducers.Filter", com.cognitect.transducers.Filter), goog.exportSymbol("transducers.remove", com.cognitect.transducers.remove), goog.exportSymbol("transducers.Remove", com.cognitect.transducers.Remove), 
goog.exportSymbol("transducers.keep", com.cognitect.transducers.keep), goog.exportSymbol("transducers.Keep", com.cognitect.transducers.Keep), goog.exportSymbol("transducers.keepIndexed", com.cognitect.transducers.keepIndexed), goog.exportSymbol("transducers.KeepIndexed", com.cognitect.transducers.KeepIndexed), goog.exportSymbol("transducers.take", com.cognitect.transducers.take), goog.exportSymbol("transducers.Take", com.cognitect.transducers.Take), goog.exportSymbol("transducers.takeWhile", com.cognitect.transducers.takeWhile), 
goog.exportSymbol("transducers.TakeWhile", com.cognitect.transducers.TakeWhile), goog.exportSymbol("transducers.takeNth", com.cognitect.transducers.takeNth), goog.exportSymbol("transducers.TakeNth", com.cognitect.transducers.TakeNth), goog.exportSymbol("transducers.drop", com.cognitect.transducers.drop), goog.exportSymbol("transducers.Drop", com.cognitect.transducers.Drop), goog.exportSymbol("transducers.dropWhile", com.cognitect.transducers.dropWhile), goog.exportSymbol("transducers.DropWhile", 
com.cognitect.transducers.DropWhile), goog.exportSymbol("transducers.partitionBy", com.cognitect.transducers.partitionBy), goog.exportSymbol("transducers.PartitionBy", com.cognitect.transducers.PartitionBy), goog.exportSymbol("transducers.partitionAll", com.cognitect.transducers.partitionAll), goog.exportSymbol("transducers.PartitionAll", com.cognitect.transducers.PartitionAll), goog.exportSymbol("transducers.completing", com.cognitect.transducers.completing), goog.exportSymbol("transducers.Completing", 
com.cognitect.transducers.Completing), goog.exportSymbol("transducers.wrap", com.cognitect.transducers.wrap), goog.exportSymbol("transducers.Wrap", com.cognitect.transducers.Wrap), goog.exportSymbol("transducers.cat", com.cognitect.transducers.cat), goog.exportSymbol("transducers.mapcat", com.cognitect.transducers.mapcat), goog.exportSymbol("transducers.into", com.cognitect.transducers.into), goog.exportSymbol("transducers.toFn", com.cognitect.transducers.toFn), goog.exportSymbol("transducers.first", 
com.cognitect.transducers.first), goog.exportSymbol("transducers.ensureReduced", com.cognitect.transducers.ensureReduced), goog.exportSymbol("transducers.unreduced", com.cognitect.transducers.unreduced), goog.exportSymbol("transducers.deref", com.cognitect.transducers.deref));
TRANSDUCERS_NODE_TARGET && (module.exports = {reduced:com.cognitect.transducers.reduced, isReduced:com.cognitect.transducers.isReduced, comp:com.cognitect.transducers.comp, complement:com.cognitect.transducers.complement, identity:com.cognitect.transducers.identity, map:com.cognitect.transducers.map, Map:com.cognitect.transducers.Map, filter:com.cognitect.transducers.filter, Filter:com.cognitect.transducers.Filter, remove:com.cognitect.transducers.remove, Remove:com.cognitect.transducers.Remove, 
keep:com.cognitect.transducers.keep, Kemove:com.cognitect.transducers.Keep, keepIndexed:com.cognitect.transducers.keepIndexed, KeepIndexed:com.cognitect.transducers.KeepIndexed, take:com.cognitect.transducers.take, Take:com.cognitect.transducers.Take, takeWhile:com.cognitect.transducers.takeWhile, TakeWhile:com.cognitect.transducers.TakeWhile, takeNth:com.cognitect.transducers.takeNth, TakeNth:com.cognitect.transducers.TakeNth, drop:com.cognitect.transducers.drop, Drop:com.cognitect.transducers.Drop, 
dropWhile:com.cognitect.transducers.dropWhile, DropWhile:com.cognitect.transducers.DropWhile, partitionBy:com.cognitect.transducers.partitionBy, PartitionBy:com.cognitect.transducers.PartitionBy, partitionAll:com.cognitect.transducers.partitionAll, PartitionAll:com.cognitect.transducers.PartitionAll, completing:com.cognitect.transducers.completing, Completing:com.cognitect.transducers.Completing, wrap:com.cognitect.transducers.wrap, Wrap:com.cognitect.transducers.Wrap, cat:com.cognitect.transducers.cat, 
mapcat:com.cognitect.transducers.mapcat, transduce:com.cognitect.transducers.transduce, reduce:com.cognitect.transducers.reduce, into:com.cognitect.transducers.into, toFn:com.cognitect.transducers.toFn, first:com.cognitect.transducers.first, ensureReduced:com.cognitect.transducers.ensureReduced, unreduced:com.cognitect.transducers.unreduced, deref:com.cognitect.transducers.deref});
})();
