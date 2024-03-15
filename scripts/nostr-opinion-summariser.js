"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod3) => function __require() {
  return mod3 || (0, cb[__getOwnPropNames(cb)[0]])((mod3 = { exports: {} }).exports, mod3), mod3.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod3, isNodeMode, target) => (target = mod3 != null ? __create(__getProtoOf(mod3)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod3 || !mod3.__esModule ? __defProp(target, "default", { value: mod3, enumerable: true }) : target,
  mod3
));
var __toCommonJS = (mod3) => __copyProps(__defProp({}, "__esModule", { value: true }), mod3);

// node_modules/tseep/lib/types.js
var require_types = __commonJS({
  "node_modules/tseep/lib/types.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// node_modules/tseep/lib/task-collection/bake-collection.js
var require_bake_collection = __commonJS({
  "node_modules/tseep/lib/task-collection/bake-collection.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.bakeCollectionVariadic = exports.bakeCollectionAwait = exports.bakeCollection = exports.BAKED_EMPTY_FUNC = void 0;
    exports.BAKED_EMPTY_FUNC = function() {
    };
    var FORLOOP_FALLBACK = 1500;
    function generateArgsDefCode(numArgs) {
      var argsDefCode2 = "";
      if (numArgs === 0)
        return argsDefCode2;
      for (var i2 = 0; i2 < numArgs - 1; ++i2) {
        argsDefCode2 += "arg" + String(i2) + ", ";
      }
      argsDefCode2 += "arg" + String(numArgs - 1);
      return argsDefCode2;
    }
    function generateBodyPartsCode(argsDefCode2, collectionLength) {
      var funcDefCode2 = "", funcCallCode2 = "";
      for (var i2 = 0; i2 < collectionLength; ++i2) {
        funcDefCode2 += "var f".concat(i2, " = collection[").concat(i2, "];\n");
        funcCallCode2 += "f".concat(i2, "(").concat(argsDefCode2, ")\n");
      }
      return { funcDefCode: funcDefCode2, funcCallCode: funcCallCode2 };
    }
    function generateBodyPartsVariadicCode(collectionLength) {
      var funcDefCode2 = "", funcCallCode2 = "";
      for (var i2 = 0; i2 < collectionLength; ++i2) {
        funcDefCode2 += "var f".concat(i2, " = collection[").concat(i2, "];\n");
        funcCallCode2 += "f".concat(i2, ".apply(undefined, arguments)\n");
      }
      return { funcDefCode: funcDefCode2, funcCallCode: funcCallCode2 };
    }
    function bakeCollection(collection, fixedArgsNum) {
      if (collection.length === 0)
        return exports.BAKED_EMPTY_FUNC;
      else if (collection.length === 1)
        return collection[0];
      var funcFactoryCode;
      if (collection.length < FORLOOP_FALLBACK) {
        var argsDefCode = generateArgsDefCode(fixedArgsNum);
        var _a = generateBodyPartsCode(argsDefCode, collection.length), funcDefCode = _a.funcDefCode, funcCallCode = _a.funcCallCode;
        funcFactoryCode = "(function(collection) {\n            ".concat(funcDefCode, "\n            collection = undefined;\n            return (function(").concat(argsDefCode, ") {\n                ").concat(funcCallCode, "\n            });\n        })");
      } else {
        var argsDefCode = generateArgsDefCode(fixedArgsNum);
        if (collection.length % 10 === 0) {
          funcFactoryCode = "(function(collection) {\n                return (function(".concat(argsDefCode, ") {\n                    for (var i = 0; i < collection.length; i += 10) {\n                        collection[i](").concat(argsDefCode, ");\n                        collection[i+1](").concat(argsDefCode, ");\n                        collection[i+2](").concat(argsDefCode, ");\n                        collection[i+3](").concat(argsDefCode, ");\n                        collection[i+4](").concat(argsDefCode, ");\n                        collection[i+5](").concat(argsDefCode, ");\n                        collection[i+6](").concat(argsDefCode, ");\n                        collection[i+7](").concat(argsDefCode, ");\n                        collection[i+8](").concat(argsDefCode, ");\n                        collection[i+9](").concat(argsDefCode, ");\n                    }\n                });\n            })");
        } else if (collection.length % 4 === 0) {
          funcFactoryCode = "(function(collection) {\n                return (function(".concat(argsDefCode, ") {\n                    for (var i = 0; i < collection.length; i += 4) {\n                        collection[i](").concat(argsDefCode, ");\n                        collection[i+1](").concat(argsDefCode, ");\n                        collection[i+2](").concat(argsDefCode, ");\n                        collection[i+3](").concat(argsDefCode, ");\n                    }\n                });\n            })");
        } else if (collection.length % 3 === 0) {
          funcFactoryCode = "(function(collection) {\n                return (function(".concat(argsDefCode, ") {\n                    for (var i = 0; i < collection.length; i += 3) {\n                        collection[i](").concat(argsDefCode, ");\n                        collection[i+1](").concat(argsDefCode, ");\n                        collection[i+2](").concat(argsDefCode, ");\n                    }\n                });\n            })");
        } else {
          funcFactoryCode = "(function(collection) {\n                return (function(".concat(argsDefCode, ") {\n                    for (var i = 0; i < collection.length; ++i) {\n                        collection[i](").concat(argsDefCode, ");\n                    }\n                });\n            })");
        }
      }
      {
        var bakeCollection_1 = void 0;
        var fixedArgsNum_1 = void 0;
        var bakeCollectionVariadic_1 = void 0;
        var bakeCollectionAwait_1 = void 0;
        var funcFactory = eval(funcFactoryCode);
        return funcFactory(collection);
      }
    }
    exports.bakeCollection = bakeCollection;
    function bakeCollectionAwait(collection, fixedArgsNum) {
      if (collection.length === 0)
        return exports.BAKED_EMPTY_FUNC;
      else if (collection.length === 1)
        return collection[0];
      var funcFactoryCode;
      if (collection.length < FORLOOP_FALLBACK) {
        var argsDefCode = generateArgsDefCode(fixedArgsNum);
        var _a = generateBodyPartsCode(argsDefCode, collection.length), funcDefCode = _a.funcDefCode, funcCallCode = _a.funcCallCode;
        funcFactoryCode = "(function(collection) {\n            ".concat(funcDefCode, "\n            collection = undefined;\n            return (function(").concat(argsDefCode, ") {\n                return Promise.all([ ").concat(funcCallCode, " ]);\n            });\n        })");
      } else {
        var argsDefCode = generateArgsDefCode(fixedArgsNum);
        funcFactoryCode = "(function(collection) {\n            return (function(".concat(argsDefCode, ") {\n                var promises = Array(collection.length);\n                for (var i = 0; i < collection.length; ++i) {\n                    promises[i] = collection[i](").concat(argsDefCode, ");\n                }\n                return Promise.all(promises);\n            });\n        })");
      }
      {
        var bakeCollection_2 = void 0;
        var fixedArgsNum_2 = void 0;
        var bakeCollectionVariadic_2 = void 0;
        var bakeCollectionAwait_2 = void 0;
        var funcFactory = eval(funcFactoryCode);
        return funcFactory(collection);
      }
    }
    exports.bakeCollectionAwait = bakeCollectionAwait;
    function bakeCollectionVariadic(collection) {
      if (collection.length === 0)
        return exports.BAKED_EMPTY_FUNC;
      else if (collection.length === 1)
        return collection[0];
      var funcFactoryCode;
      if (collection.length < FORLOOP_FALLBACK) {
        var _a = generateBodyPartsVariadicCode(collection.length), funcDefCode = _a.funcDefCode, funcCallCode = _a.funcCallCode;
        funcFactoryCode = "(function(collection) {\n            ".concat(funcDefCode, "\n            collection = undefined;\n            return (function() {\n                ").concat(funcCallCode, "\n            });\n        })");
      } else {
        funcFactoryCode = "(function(collection) {\n            return (function() {\n                for (var i = 0; i < collection.length; ++i) {\n                    collection[i].apply(undefined, arguments);\n                }\n            });\n        })";
      }
      {
        var bakeCollection_3 = void 0;
        var fixedArgsNum = void 0;
        var bakeCollectionVariadic_3 = void 0;
        var bakeCollectionAwait_3 = void 0;
        var funcFactory = eval(funcFactoryCode);
        return funcFactory(collection);
      }
    }
    exports.bakeCollectionVariadic = bakeCollectionVariadic;
  }
});

// node_modules/tseep/lib/task-collection/task-collection.js
var require_task_collection = __commonJS({
  "node_modules/tseep/lib/task-collection/task-collection.js"(exports2) {
    "use strict";
    var __spreadArray = exports2 && exports2.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i2 = 0, l = from.length, ar; i2 < l; i2++) {
          if (ar || !(i2 in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i2);
            ar[i2] = from[i2];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TaskCollection = exports2._fast_remove_single = void 0;
    var bake_collection_1 = require_bake_collection();
    function push_norebuild(a, b) {
      var len = this.length;
      if (len > 1) {
        if (b) {
          var _a2;
          (_a2 = this._tasks).push.apply(_a2, arguments);
          this.length += arguments.length;
        } else {
          this._tasks.push(a);
          this.length++;
        }
      } else {
        if (b) {
          if (len === 1) {
            var newAr = Array(1 + arguments.length);
            newAr.push(newAr);
            newAr.push.apply(newAr, arguments);
            this._tasks = newAr;
          } else {
            var newAr = Array(arguments.length);
            newAr.push.apply(newAr, arguments);
            this._tasks = newAr;
          }
          this.length += arguments.length;
        } else {
          if (len === 1)
            this._tasks = [this._tasks, a];
          else
            this._tasks = a;
          this.length++;
        }
      }
    }
    function push_rebuild(a, b) {
      var len = this.length;
      if (len > 1) {
        if (b) {
          var _a2;
          (_a2 = this._tasks).push.apply(_a2, arguments);
          this.length += arguments.length;
        } else {
          this._tasks.push(a);
          this.length++;
        }
      } else {
        if (b) {
          if (len === 1) {
            var newAr = Array(1 + arguments.length);
            newAr.push(newAr);
            newAr.push.apply(newAr, arguments);
            this._tasks = newAr;
          } else {
            var newAr = Array(arguments.length);
            newAr.push.apply(newAr, arguments);
            this._tasks = newAr;
          }
          this.length += arguments.length;
        } else {
          if (len === 1)
            this._tasks = [this._tasks, a];
          else
            this._tasks = a;
          this.length++;
        }
      }
      if (this.firstEmitBuildStrategy)
        this.call = rebuild_on_first_call;
      else
        this.rebuild();
    }
    function _fast_remove_single(arr, index) {
      if (index === -1)
        return;
      if (index === 0)
        arr.shift();
      else if (index === arr.length - 1)
        arr.length = arr.length - 1;
      else
        arr.splice(index, 1);
    }
    exports2._fast_remove_single = _fast_remove_single;
    function removeLast_norebuild(a) {
      if (this.length === 0)
        return;
      if (this.length === 1) {
        if (this._tasks === a) {
          this.length = 0;
        }
      } else {
        _fast_remove_single(this._tasks, this._tasks.lastIndexOf(a));
        if (this._tasks.length === 1) {
          this._tasks = this._tasks[0];
          this.length = 1;
        } else
          this.length = this._tasks.length;
      }
    }
    function removeLast_rebuild(a) {
      if (this.length === 0)
        return;
      if (this.length === 1) {
        if (this._tasks === a) {
          this.length = 0;
        }
        if (this.firstEmitBuildStrategy) {
          this.call = bake_collection_1.BAKED_EMPTY_FUNC;
          return;
        } else {
          this.rebuild();
          return;
        }
      } else {
        _fast_remove_single(this._tasks, this._tasks.lastIndexOf(a));
        if (this._tasks.length === 1) {
          this._tasks = this._tasks[0];
          this.length = 1;
        } else
          this.length = this._tasks.length;
      }
      if (this.firstEmitBuildStrategy)
        this.call = rebuild_on_first_call;
      else
        this.rebuild();
    }
    function insert_norebuild(index) {
      var _b;
      var func = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        func[_i - 1] = arguments[_i];
      }
      if (this.length === 0) {
        this._tasks = func;
        this.length = 1;
      } else if (this.length === 1) {
        func.unshift(this._tasks);
        this._tasks = func;
        this.length = this._tasks.length;
      } else {
        (_b = this._tasks).splice.apply(_b, __spreadArray([index, 0], func, false));
        this.length = this._tasks.length;
      }
    }
    function insert_rebuild(index) {
      var _b;
      var func = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        func[_i - 1] = arguments[_i];
      }
      if (this.length === 0) {
        this._tasks = func;
        this.length = 1;
      } else if (this.length === 1) {
        func.unshift(this._tasks);
        this._tasks = func;
        this.length = this._tasks.length;
      } else {
        (_b = this._tasks).splice.apply(_b, __spreadArray([index, 0], func, false));
        this.length = this._tasks.length;
      }
      if (this.firstEmitBuildStrategy)
        this.call = rebuild_on_first_call;
      else
        this.rebuild();
    }
    function rebuild_noawait() {
      if (this.length === 0)
        this.call = bake_collection_1.BAKED_EMPTY_FUNC;
      else if (this.length === 1)
        this.call = this._tasks;
      else
        this.call = (0, bake_collection_1.bakeCollection)(this._tasks, this.argsNum);
    }
    function rebuild_await() {
      if (this.length === 0)
        this.call = bake_collection_1.BAKED_EMPTY_FUNC;
      else if (this.length === 1)
        this.call = this._tasks;
      else
        this.call = (0, bake_collection_1.bakeCollectionAwait)(this._tasks, this.argsNum);
    }
    function rebuild_on_first_call() {
      this.rebuild();
      this.call.apply(void 0, arguments);
    }
    var TaskCollection = (
      /** @class */
      function() {
        function TaskCollection2(argsNum, autoRebuild, initialTasks, awaitTasks) {
          if (autoRebuild === void 0) {
            autoRebuild = true;
          }
          if (initialTasks === void 0) {
            initialTasks = null;
          }
          if (awaitTasks === void 0) {
            awaitTasks = false;
          }
          this.awaitTasks = awaitTasks;
          this.call = bake_collection_1.BAKED_EMPTY_FUNC;
          this.argsNum = argsNum;
          this.firstEmitBuildStrategy = true;
          if (awaitTasks)
            this.rebuild = rebuild_await.bind(this);
          else
            this.rebuild = rebuild_noawait.bind(this);
          this.setAutoRebuild(autoRebuild);
          if (initialTasks) {
            if (typeof initialTasks === "function") {
              this._tasks = initialTasks;
              this.length = 1;
            } else {
              this._tasks = initialTasks;
              this.length = initialTasks.length;
            }
          } else {
            this._tasks = null;
            this.length = 0;
          }
          if (autoRebuild)
            this.rebuild();
        }
        return TaskCollection2;
      }()
    );
    exports2.TaskCollection = TaskCollection;
    function fastClear() {
      this._tasks = null;
      this.length = 0;
      this.call = bake_collection_1.BAKED_EMPTY_FUNC;
    }
    function clear() {
      this._tasks = null;
      this.length = 0;
      this.call = bake_collection_1.BAKED_EMPTY_FUNC;
    }
    function growArgsNum(argsNum) {
      if (this.argsNum < argsNum) {
        this.argsNum = argsNum;
        if (this.firstEmitBuildStrategy)
          this.call = rebuild_on_first_call;
        else
          this.rebuild();
      }
    }
    function setAutoRebuild(newVal) {
      if (newVal) {
        this.push = push_rebuild.bind(this);
        this.insert = insert_rebuild.bind(this);
        this.removeLast = removeLast_rebuild.bind(this);
      } else {
        this.push = push_norebuild.bind(this);
        this.insert = insert_norebuild.bind(this);
        this.removeLast = removeLast_norebuild.bind(this);
      }
    }
    function tasksAsArray() {
      if (this.length === 0)
        return [];
      if (this.length === 1)
        return [this._tasks];
      return this._tasks;
    }
    function setTasks(tasks) {
      if (tasks.length === 0) {
        this.length = 0;
        this.call = bake_collection_1.BAKED_EMPTY_FUNC;
      } else if (tasks.length === 1) {
        this.length = 1;
        this.call = tasks[0];
        this._tasks = tasks[0];
      } else {
        this.length = tasks.length;
        this._tasks = tasks;
        if (this.firstEmitBuildStrategy)
          this.call = rebuild_on_first_call;
        else
          this.rebuild();
      }
    }
    TaskCollection.prototype.fastClear = fastClear;
    TaskCollection.prototype.clear = clear;
    TaskCollection.prototype.growArgsNum = growArgsNum;
    TaskCollection.prototype.setAutoRebuild = setAutoRebuild;
    TaskCollection.prototype.tasksAsArray = tasksAsArray;
    TaskCollection.prototype.setTasks = setTasks;
  }
});

// node_modules/tseep/lib/task-collection/index.js
var require_task_collection2 = __commonJS({
  "node_modules/tseep/lib/task-collection/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_task_collection(), exports2);
  }
});

// node_modules/tseep/lib/utils.js
var require_utils = __commonJS({
  "node_modules/tseep/lib/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.nullObj = void 0;
    function nullObj() {
      var x = {};
      x.__proto__ = null;
      x.prototype = null;
      return x;
    }
    exports2.nullObj = nullObj;
  }
});

// node_modules/tseep/lib/ee.js
var require_ee = __commonJS({
  "node_modules/tseep/lib/ee.js"(exports2) {
    "use strict";
    var __spreadArray = exports2 && exports2.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i2 = 0, l = from.length, ar; i2 < l; i2++) {
          if (ar || !(i2 in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i2);
            ar[i2] = from[i2];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.EventEmitter = void 0;
    var task_collection_1 = require_task_collection2();
    var utils_1 = require_utils();
    function emit(event, a, b, c, d, e) {
      var ev = this.events[event];
      if (ev) {
        if (ev.length === 0)
          return false;
        if (ev.argsNum < 6) {
          ev.call(a, b, c, d, e);
        } else {
          ev.call.apply(void 0, arguments);
        }
        return true;
      }
      return false;
    }
    function emitHasOnce(event, a, b, c, d, e) {
      var ev = this.events[event];
      if (ev) {
        if (ev.length === 0)
          return false;
        if (ev.argsNum < 6) {
          ev.call(a, b, c, d, e);
        } else {
          ev.call.apply(void 0, arguments);
        }
      }
      var oev = this.onceEvents[event];
      if (oev) {
        if (typeof oev === "function") {
          this.onceEvents[event] = void 0;
          if (arguments.length < 6) {
            oev(a, b, c, d, e);
          } else {
            oev.apply(void 0, arguments);
          }
        } else {
          var fncs = oev;
          this.onceEvents[event] = void 0;
          if (arguments.length < 6) {
            for (var i2 = 0; i2 < fncs.length; ++i2)
              fncs[i2](a, b, c, d, e);
          } else {
            for (var i2 = 0; i2 < fncs.length; ++i2)
              fncs[i2].apply(void 0, arguments);
          }
        }
        return true;
      }
      return !!ev;
    }
    var EventEmitter11 = (
      /** @class */
      function() {
        function EventEmitter12() {
          this.events = (0, utils_1.nullObj)();
          this.onceEvents = (0, utils_1.nullObj)();
          this._symbolKeys = /* @__PURE__ */ new Set();
          this.maxListeners = Infinity;
        }
        Object.defineProperty(EventEmitter12.prototype, "_eventsCount", {
          get: function() {
            return this.eventNames().length;
          },
          enumerable: false,
          configurable: true
        });
        return EventEmitter12;
      }()
    );
    exports2.EventEmitter = EventEmitter11;
    function once(event, listener) {
      if (this.emit === emit) {
        this.emit = emitHasOnce;
      }
      switch (typeof this.onceEvents[event]) {
        case "undefined":
          this.onceEvents[event] = listener;
          if (typeof event === "symbol")
            this._symbolKeys.add(event);
          break;
        case "function":
          this.onceEvents[event] = [this.onceEvents[event], listener];
          break;
        case "object":
          this.onceEvents[event].push(listener);
      }
      return this;
    }
    function addListener(event, listener, argsNum) {
      if (argsNum === void 0) {
        argsNum = listener.length;
      }
      if (typeof listener !== "function")
        throw new TypeError("The listener must be a function");
      var evtmap = this.events[event];
      if (!evtmap) {
        this.events[event] = new task_collection_1.TaskCollection(argsNum, true, listener, false);
        if (typeof event === "symbol")
          this._symbolKeys.add(event);
      } else {
        evtmap.push(listener);
        evtmap.growArgsNum(argsNum);
        if (this.maxListeners !== Infinity && this.maxListeners <= evtmap.length)
          console.warn('Maximum event listeners for "'.concat(String(event), '" event!'));
      }
      return this;
    }
    function removeListener(event, listener) {
      var evt = this.events[event];
      if (evt) {
        evt.removeLast(listener);
      }
      var evto = this.onceEvents[event];
      if (evto) {
        if (typeof evto === "function") {
          this.onceEvents[event] = void 0;
        } else if (typeof evto === "object") {
          if (evto.length === 1 && evto[0] === listener) {
            this.onceEvents[event] = void 0;
          } else {
            (0, task_collection_1._fast_remove_single)(evto, evto.lastIndexOf(listener));
          }
        }
      }
      return this;
    }
    function hasListeners(event) {
      return this.events[event] && !!this.events[event].length;
    }
    function prependListener(event, listener, argsNum) {
      if (argsNum === void 0) {
        argsNum = listener.length;
      }
      if (typeof listener !== "function")
        throw new TypeError("The listener must be a function");
      var evtmap = this.events[event];
      if (!evtmap || !(evtmap instanceof task_collection_1.TaskCollection)) {
        evtmap = this.events[event] = new task_collection_1.TaskCollection(argsNum, true, listener, false);
        if (typeof event === "symbol")
          this._symbolKeys.add(event);
      } else {
        evtmap.insert(0, listener);
        evtmap.growArgsNum(argsNum);
        if (this.maxListeners !== Infinity && this.maxListeners <= evtmap.length)
          console.warn('Maximum event listeners for "'.concat(String(event), '" event!'));
      }
      return this;
    }
    function prependOnceListener(event, listener) {
      if (this.emit === emit) {
        this.emit = emitHasOnce;
      }
      var evtmap = this.onceEvents[event];
      if (!evtmap || typeof evtmap !== "object") {
        evtmap = this.onceEvents[event] = [listener];
        if (typeof event === "symbol")
          this._symbolKeys.add(event);
      } else {
        throw new Error("FIXME");
        if (this.maxListeners !== Infinity && this.maxListeners <= evtmap.length)
          console.warn('Maximum event listeners for "'.concat(String(event), '" once event!'));
      }
      return this;
    }
    function removeAllListeners(event) {
      if (event === void 0) {
        this.events = (0, utils_1.nullObj)();
        this.onceEvents = (0, utils_1.nullObj)();
        this._symbolKeys = /* @__PURE__ */ new Set();
      } else {
        this.events[event] = void 0;
        this.onceEvents[event] = void 0;
        if (typeof event === "symbol")
          this._symbolKeys.delete(event);
      }
      return this;
    }
    function setMaxListeners(n) {
      this.maxListeners = n;
      return this;
    }
    function getMaxListeners() {
      return this.maxListeners;
    }
    function listeners(event) {
      if (this.emit === emit)
        return this.events[event] ? this.events[event].tasksAsArray().slice() : [];
      else {
        if (this.events[event] && this.onceEvents[event]) {
          return __spreadArray(__spreadArray([], this.events[event].tasksAsArray(), true), typeof this.onceEvents[event] === "function" ? [this.onceEvents[event]] : this.onceEvents[event], true);
        } else if (this.events[event])
          return this.events[event].tasksAsArray();
        else if (this.onceEvents[event])
          return typeof this.onceEvents[event] === "function" ? [this.onceEvents[event]] : this.onceEvents[event];
        else
          return [];
      }
    }
    function eventNames() {
      var _this = this;
      if (this.emit === emit) {
        var keys2 = Object.keys(this.events);
        return __spreadArray(__spreadArray([], keys2, true), Array.from(this._symbolKeys), true).filter(function(x) {
          return x in _this.events && _this.events[x] && _this.events[x].length;
        });
      } else {
        var keys2 = Object.keys(this.events).filter(function(x) {
          return _this.events[x] && _this.events[x].length;
        });
        var keysO = Object.keys(this.onceEvents).filter(function(x) {
          return _this.onceEvents[x] && _this.onceEvents[x].length;
        });
        return __spreadArray(__spreadArray(__spreadArray([], keys2, true), keysO, true), Array.from(this._symbolKeys).filter(function(x) {
          return x in _this.events && _this.events[x] && _this.events[x].length || x in _this.onceEvents && _this.onceEvents[x] && _this.onceEvents[x].length;
        }), true);
      }
    }
    function listenerCount(type2) {
      if (this.emit === emit)
        return this.events[type2] && this.events[type2].length || 0;
      else
        return (this.events[type2] && this.events[type2].length || 0) + (this.onceEvents[type2] && this.onceEvents[type2].length || 0);
    }
    EventEmitter11.prototype.emit = emit;
    EventEmitter11.prototype.on = addListener;
    EventEmitter11.prototype.once = once;
    EventEmitter11.prototype.addListener = addListener;
    EventEmitter11.prototype.removeListener = removeListener;
    EventEmitter11.prototype.hasListeners = hasListeners;
    EventEmitter11.prototype.prependListener = prependListener;
    EventEmitter11.prototype.prependOnceListener = prependOnceListener;
    EventEmitter11.prototype.off = removeListener;
    EventEmitter11.prototype.removeAllListeners = removeAllListeners;
    EventEmitter11.prototype.setMaxListeners = setMaxListeners;
    EventEmitter11.prototype.getMaxListeners = getMaxListeners;
    EventEmitter11.prototype.listeners = listeners;
    EventEmitter11.prototype.eventNames = eventNames;
    EventEmitter11.prototype.listenerCount = listenerCount;
  }
});

// node_modules/tseep/lib/index.js
var require_lib = __commonJS({
  "node_modules/tseep/lib/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_types(), exports2);
    __exportStar(require_ee(), exports2);
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type2 = typeof val;
      if (type2 === "string" && val.length > 0) {
        return parse5(val);
      } else if (type2 === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse5(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type2 = (match[2] || "ms").toLowerCase();
      switch (type2) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports2, module2) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash8 = 0;
        for (let i2 = 0; i2 < namespace.length; i2++) {
          hash8 = (hash8 << 5) - hash8 + namespace.charCodeAt(i2);
          hash8 |= 0;
        }
        return createDebug.colors[Math.abs(hash8) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug5(...args) {
          if (!debug5.enabled) {
            return;
          }
          const self2 = debug5;
          const curr = Number(new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug5.namespace = namespace;
        debug5.useColors = createDebug.useColors();
        debug5.color = createDebug.selectColor(namespace);
        debug5.extend = extend2;
        debug5.destroy = createDebug.destroy;
        Object.defineProperty(debug5, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug5);
        }
        return debug5;
      }
      function extend2(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i2;
        const split2 = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split2.length;
        for (i2 = 0; i2 < len; i2++) {
          if (!split2[i2]) {
            continue;
          }
          namespaces = split2[i2].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i2;
        let len;
        for (i2 = 0, len = createDebug.skips.length; i2 < len; i2++) {
          if (createDebug.skips[i2].test(name)) {
            return false;
          }
        }
        for (i2 = 0, len = createDebug.names.length; i2 < len; i2++) {
          if (createDebug.names[i2].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports2, module2) {
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports2.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/supports-color/index.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var tty = require("tty");
    var hasFlag = require_has_flag();
    var { env } = process;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      forceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env) {
      if (env.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env) {
        const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream) {
      const level = supportsColor(stream, stream && stream.isTTY);
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel(supportsColor(true, tty.isatty(1))),
      stderr: translateLevel(supportsColor(true, tty.isatty(2)))
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports2, module2) {
    var tty = require("tty");
    var util = require("util");
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.destroy = util.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require_supports_color();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports2.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return new Date().toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.format(...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug5) {
      debug5.inspectOpts = {};
      const keys2 = Object.keys(exports2.inspectOpts);
      for (let i2 = 0; i2 < keys2.length; i2++) {
        debug5.inspectOpts[keys2[i2]] = exports2.inspectOpts[keys2[i2]];
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports2, module2) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/typescript-lru-cache/dist/LRUCacheNode.js
var require_LRUCacheNode = __commonJS({
  "node_modules/typescript-lru-cache/dist/LRUCacheNode.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LRUCacheNode = void 0;
    var LRUCacheNode = class {
      constructor(key, value, options) {
        const { entryExpirationTimeInMS = null, next = null, prev = null, onEntryEvicted, onEntryMarkedAsMostRecentlyUsed, clone, cloneFn } = options !== null && options !== void 0 ? options : {};
        if (typeof entryExpirationTimeInMS === "number" && (entryExpirationTimeInMS <= 0 || Number.isNaN(entryExpirationTimeInMS))) {
          throw new Error("entryExpirationTimeInMS must either be null (no expiry) or greater than 0");
        }
        this.clone = clone !== null && clone !== void 0 ? clone : false;
        this.cloneFn = cloneFn !== null && cloneFn !== void 0 ? cloneFn : this.defaultClone;
        this.key = key;
        this.internalValue = this.clone ? this.cloneFn(value) : value;
        this.created = Date.now();
        this.entryExpirationTimeInMS = entryExpirationTimeInMS;
        this.next = next;
        this.prev = prev;
        this.onEntryEvicted = onEntryEvicted;
        this.onEntryMarkedAsMostRecentlyUsed = onEntryMarkedAsMostRecentlyUsed;
      }
      get value() {
        return this.clone ? this.cloneFn(this.internalValue) : this.internalValue;
      }
      get isExpired() {
        return typeof this.entryExpirationTimeInMS === "number" && Date.now() - this.created > this.entryExpirationTimeInMS;
      }
      invokeOnEvicted() {
        if (this.onEntryEvicted) {
          const { key, value, isExpired } = this;
          this.onEntryEvicted({ key, value, isExpired });
        }
      }
      invokeOnEntryMarkedAsMostRecentlyUsed() {
        if (this.onEntryMarkedAsMostRecentlyUsed) {
          const { key, value } = this;
          this.onEntryMarkedAsMostRecentlyUsed({ key, value });
        }
      }
      defaultClone(value) {
        if (typeof value === "boolean" || typeof value === "string" || typeof value === "number") {
          return value;
        }
        return JSON.parse(JSON.stringify(value));
      }
    };
    exports2.LRUCacheNode = LRUCacheNode;
  }
});

// node_modules/typescript-lru-cache/dist/LRUCache.js
var require_LRUCache = __commonJS({
  "node_modules/typescript-lru-cache/dist/LRUCache.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LRUCache = void 0;
    var LRUCacheNode_1 = require_LRUCacheNode();
    var LRUCache3 = class {
      /**
       * Creates a new instance of the LRUCache.
       *
       * @param options Additional configuration options for the LRUCache.
       *
       * @example
       * ```typescript
       * // No options.
       * const cache = new LRUCache();
       *
       * // With options.
       * const cache = new LRUCache({
       *  entryExpirationTimeInMS: 10000
       * });
       * ```
       */
      constructor(options) {
        this.lookupTable = /* @__PURE__ */ new Map();
        this.head = null;
        this.tail = null;
        const { maxSize = 25, entryExpirationTimeInMS = null, onEntryEvicted, onEntryMarkedAsMostRecentlyUsed, cloneFn, clone } = options !== null && options !== void 0 ? options : {};
        if (Number.isNaN(maxSize) || maxSize <= 0) {
          throw new Error("maxSize must be greater than 0.");
        }
        if (typeof entryExpirationTimeInMS === "number" && (entryExpirationTimeInMS <= 0 || Number.isNaN(entryExpirationTimeInMS))) {
          throw new Error("entryExpirationTimeInMS must either be null (no expiry) or greater than 0");
        }
        this.maxSizeInternal = maxSize;
        this.entryExpirationTimeInMS = entryExpirationTimeInMS;
        this.onEntryEvicted = onEntryEvicted;
        this.onEntryMarkedAsMostRecentlyUsed = onEntryMarkedAsMostRecentlyUsed;
        this.clone = clone;
        this.cloneFn = cloneFn;
      }
      /**
       * Returns the number of entries in the LRUCache object.
       * If the cache has entryExpirationTimeInMS set, expired entries will be removed before the size is returned.
       *
       * @returns The number of entries in the cache.
       *
       * @example
       * ```typescript
       * const cache = new LRUCache();
       *
       * cache.set('testKey', 'testValue');
       *
       * const size = cache.size;
       *
       * // Will log 1
       * console.log(size);
       * ```
       */
      get size() {
        this.cleanCache();
        return this.lookupTable.size;
      }
      /**
       * Returns the number of entries that can still be added to the LRUCache without evicting existing entries.
       *
       * @returns The number of entries that can still be added without evicting existing entries.
       *
       * @example
       * ```typescript
       * const cache = new LRUCache({ maxSize: 10 });
       *
       * cache.set('testKey', 'testValue');
       *
       * const remainingSize = cache.remainingSize;
       *
       * // Will log 9 due to 9 spots remaining before reaching maxSize of 10.
       * console.log(remainingSize);
       * ```
       */
      get remainingSize() {
        return this.maxSizeInternal - this.size;
      }
      /**
       * Returns the most recently used (newest) entry in the cache.
       * This will not mark the entry as recently used.
       * If the newest node is expired, it will be removed.
       *
       * @returns The most recently used (newest) entry in the cache.
       *
       * @example
       * ```typescript
       * const cache = new LRUCache({ maxSize: 10 });
       *
       * cache.set('testKey', 'testValue');
       *
       * const newest = cache.newest;
       *
       * // Will log testValue
       * console.log(newest.value);
       *
       * // Will log testKey
       * console.log(newest.key);
       * ```
       */
      get newest() {
        if (!this.head) {
          return null;
        }
        if (this.head.isExpired) {
          this.removeNodeFromListAndLookupTable(this.head);
          return this.newest;
        }
        return this.mapNodeToEntry(this.head);
      }
      /**
       * Returns the least recently used (oldest) entry in the cache.
       * This will not mark the entry as recently used.
       * If the oldest node is expired, it will be removed.
       *
       * @returns The least recently used (oldest) entry in the cache.
       *
       * @example
       * ```typescript
       * const cache = new LRUCache({ maxSize: 10 });
       *
       * cache.set('testKey', 'testValue');
       *
       * const oldest = cache.oldest;
       *
       * // Will log testValue
       * console.log(oldest.value);
       *
       * // Will log testKey
       * console.log(oldest.key);
       * ```
       */
      get oldest() {
        if (!this.tail) {
          return null;
        }
        if (this.tail.isExpired) {
          this.removeNodeFromListAndLookupTable(this.tail);
          return this.oldest;
        }
        return this.mapNodeToEntry(this.tail);
      }
      /**
       * Gets or sets the maxSize of the cache.
       * This will evict the least recently used entries if needed to reach new maxSize.
       *
       * @param value The new value for maxSize. Must be greater than 0.
       *
       * @example
       * ```typescript
       * const cache = new LRUCache({ maxSize: 10 });
       *
       * cache.set('testKey', 'testValue');
       *
       * // Will be 10
       * const maxSize = cache.maxSize;
       *
       * // Set new maxSize to 5. If there are more than 5 items in the cache, the least recently used entries will be removed until cache size is 5.
       * cache.maxSize = 5;
       * ```
       */
      get maxSize() {
        return this.maxSizeInternal;
      }
      set maxSize(value) {
        if (Number.isNaN(value) || value <= 0) {
          throw new Error("maxSize must be greater than 0.");
        }
        this.maxSizeInternal = value;
        this.enforceSizeLimit();
      }
      /**
       * Sets the value for the key in the LRUCache object. Returns the LRUCache object.
       * This marks the newly added entry as the most recently used entry.
       * If adding the new entry makes the cache size go above maxSize,
       * this will evict the least recently used entries until size is equal to maxSize.
       *
       * @param key The key of the entry.
       * @param value The value to set for the key.
       * @param entryOptions Additional configuration options for the cache entry.
       *
       * @returns The LRUCache instance.
       *
       * @example
       * ```typescript
       * const cache = new LRUCache();
       *
       * // Set the key testKey to value testValue
       * cache.set('testKey', 'testValue');
       *
       * // Set the key key2 to value value2. Pass in optional options.
       * cache.set('key2', 'value2', { entryExpirationTimeInMS: 10 });
       * ```
       */
      set(key, value, entryOptions) {
        const currentNodeForKey = this.lookupTable.get(key);
        if (currentNodeForKey) {
          this.removeNodeFromListAndLookupTable(currentNodeForKey);
        }
        const node = new LRUCacheNode_1.LRUCacheNode(key, value, {
          entryExpirationTimeInMS: this.entryExpirationTimeInMS,
          onEntryEvicted: this.onEntryEvicted,
          onEntryMarkedAsMostRecentlyUsed: this.onEntryMarkedAsMostRecentlyUsed,
          clone: this.clone,
          cloneFn: this.cloneFn,
          ...entryOptions
        });
        this.setNodeAsHead(node);
        this.lookupTable.set(key, node);
        this.enforceSizeLimit();
        return this;
      }
      /**
       * Returns the value associated to the key, or null if there is none or if the entry is expired.
       * If an entry is returned, this marks the returned entry as the most recently used entry.
       *
       * @param key The key of the entry to get.
       *
       * @returns The cached value or null.
       *
       * @example
       * ```typescript
       * const cache = new LRUCache();
       *
       * // Set the key testKey to value testValue
       * cache.set('testKey', 'testValue');
       *
       * // Will be 'testValue'. Entry will now be most recently used.
       * const item1 = cache.get('testKey');
       *
       * // Will be null
       * const item2 = cache.get('keyNotInCache');
       * ```
       */
      get(key) {
        const node = this.lookupTable.get(key);
        if (!node) {
          return null;
        }
        if (node.isExpired) {
          this.removeNodeFromListAndLookupTable(node);
          return null;
        }
        this.setNodeAsHead(node);
        return node.value;
      }
      /**
       * Returns the value associated to the key, or null if there is none or if the entry is expired.
       * If an entry is returned, this will not mark the entry as most recently accessed.
       * Useful if a value is needed but the order of the cache should not be changed.
       *
       * @param key The key of the entry to get.
       *
       * @returns The cached value or null.
       *
       * @example
       * ```typescript
       * const cache = new LRUCache();
       *
       * // Set the key testKey to value testValue
       * cache.set('testKey', 'testValue');
       *
       * // Will be 'testValue'
       * const item1 = cache.peek('testKey');
       *
       * // Will be null
       * const item2 = cache.peek('keyNotInCache');
       * ```
       */
      peek(key) {
        const node = this.lookupTable.get(key);
        if (!node) {
          return null;
        }
        if (node.isExpired) {
          this.removeNodeFromListAndLookupTable(node);
          return null;
        }
        return node.value;
      }
      /**
       * Deletes the entry for the passed in key.
       *
       * @param key The key of the entry to delete
       *
       * @returns True if an element in the LRUCache object existed and has been removed,
       * or false if the element does not exist.
       *
       * @example
       * ```typescript
       * const cache = new LRUCache();
       *
       * // Set the key testKey to value testValue
       * cache.set('testKey', 'testValue');
       *
       * // Will be true
       * const wasDeleted = cache.delete('testKey');
       *
       * // Will be false
       * const wasDeleted2 = cache.delete('keyNotInCache');
       * ```
       */
      delete(key) {
        const node = this.lookupTable.get(key);
        if (!node) {
          return false;
        }
        return this.removeNodeFromListAndLookupTable(node);
      }
      /**
       * Returns a boolean asserting whether a value has been associated to the key in the LRUCache object or not.
       * This does not mark the entry as recently used.
       * If the cache has a key but the entry is expired, it will be removed and false will be returned.
       *
       * @param key The key of the entry to check if exists
       *
       * @returns true if the cache contains the supplied key. False if not.
       *
       * @example
       * ```typescript
       * const cache = new LRUCache();
       *
       * // Set the key testKey to value testValue
       * cache.set('testKey', 'testValue');
       *
       * // Will be true
       * const wasDeleted = cache.has('testKey');
       *
       * // Will be false
       * const wasDeleted2 = cache.has('keyNotInCache');
       * ```
       */
      has(key) {
        const node = this.lookupTable.get(key);
        if (!node) {
          return false;
        }
        if (node.isExpired) {
          this.removeNodeFromListAndLookupTable(node);
          return false;
        }
        return true;
      }
      /**
       * Removes all entries in the cache.
       *
       * @example
       * ```typescript
       * const cache = new LRUCache();
       *
       * // Set the key testKey to value testValue
       * cache.set('testKey', 'testValue');
       *
       * // Clear cache.
       * cache.clear();
       * ```
       */
      clear() {
        this.head = null;
        this.tail = null;
        this.lookupTable.clear();
      }
      /**
       * Searches the cache for an entry matching the passed in condition.
       * Expired entries will be skipped (and removed).
       * If multiply entries in the cache match the condition, the most recently used entry will be returned.
       * If an entry is returned, this marks the returned entry as the most recently used entry.
       *
       * @param condition The condition to apply to each entry in the
       *
       * @returns The first cache entry to match the condition. Null if none match.
       *
       * @example
       * ```typescript
       * const cache = new LRUCache();
       *
       * // Set the key testKey to value testValue
       * cache.set('testKey', 'testValue');
       *
       * // item will be { key: 'testKey', value: 'testValue }
       * const item = cache.find(entry => {
       *   const { key, value } = entry;
       *
       *   if (key === 'testKey' || value === 'something') {
       *     return true;
       *   }
       *
       *   return false;
       * });
       *
       * // item2 will be null
       * const item2 = cache.find(entry => entry.key === 'notInCache');
       * ```
       */
      find(condition) {
        let node = this.head;
        while (node) {
          if (node.isExpired) {
            const next = node.next;
            this.removeNodeFromListAndLookupTable(node);
            node = next;
            continue;
          }
          const entry = this.mapNodeToEntry(node);
          if (condition(entry)) {
            this.setNodeAsHead(node);
            return entry;
          }
          node = node.next;
        }
        return null;
      }
      /**
       * Iterates over and applies the callback function to each entry in the cache.
       * Iterates in order from most recently accessed entry to least recently.
       * Expired entries will be skipped (and removed).
       * No entry will be marked as recently used.
       *
       * @param callback the callback function to apply to the entry
       *
       * @example
       * ```typescript
       * const cache = new LRUCache();
       *
       * // Set the key testKey to value testValue
       * cache.set('testKey', 'testValue');
       *
       * cache.forEach((key, value, index) => {
       *   // do something with key, value, and/or index
       * });
       * ```
       */
      forEach(callback) {
        let node = this.head;
        let index = 0;
        while (node) {
          if (node.isExpired) {
            const next = node.next;
            this.removeNodeFromListAndLookupTable(node);
            node = next;
            continue;
          }
          callback(node.value, node.key, index);
          node = node.next;
          index++;
        }
      }
      /**
       * Creates a Generator which can be used with for ... of ... to iterate over the cache values.
       * Iterates in order from most recently accessed entry to least recently.
       * Expired entries will be skipped (and removed).
       * No entry will be marked as accessed.
       *
       * @returns A Generator for the cache values.
       *
       * @example
       * ```typescript
       * const cache = new LRUCache();
       *
       * // Set the key testKey to value testValue
       * cache.set('testKey', 'testValue');
       *
       * for (const value of cache.values()) {
       *   // do something with the value
       * }
       * ```
       */
      *values() {
        let node = this.head;
        while (node) {
          if (node.isExpired) {
            const next = node.next;
            this.removeNodeFromListAndLookupTable(node);
            node = next;
            continue;
          }
          yield node.value;
          node = node.next;
        }
      }
      /**
       * Creates a Generator which can be used with for ... of ... to iterate over the cache keys.
       * Iterates in order from most recently accessed entry to least recently.
       * Expired entries will be skipped (and removed).
       * No entry will be marked as accessed.
       *
       * @returns A Generator for the cache keys.
       *
       * @example
       * ```typescript
       * const cache = new LRUCache();
       *
       * // Set the key testKey to value testValue
       * cache.set('testKey', 'testValue');
       *
       * for (const key of cache.keys()) {
       *   // do something with the key
       * }
       * ```
       */
      *keys() {
        let node = this.head;
        while (node) {
          if (node.isExpired) {
            const next = node.next;
            this.removeNodeFromListAndLookupTable(node);
            node = next;
            continue;
          }
          yield node.key;
          node = node.next;
        }
      }
      /**
       * Creates a Generator which can be used with for ... of ... to iterate over the cache entries.
       * Iterates in order from most recently accessed entry to least recently.
       * Expired entries will be skipped (and removed).
       * No entry will be marked as accessed.
       *
       * @returns A Generator for the cache entries.
       *
       * @example
       * ```typescript
       * const cache = new LRUCache();
       *
       * // Set the key testKey to value testValue
       * cache.set('testKey', 'testValue');
       *
       * for (const entry of cache.entries()) {
       *   const { key, value } = entry;
       *   // do something with the entry
       * }
       * ```
       */
      *entries() {
        let node = this.head;
        while (node) {
          if (node.isExpired) {
            const next = node.next;
            this.removeNodeFromListAndLookupTable(node);
            node = next;
            continue;
          }
          yield this.mapNodeToEntry(node);
          node = node.next;
        }
      }
      /**
       * Creates a Generator which can be used with for ... of ... to iterate over the cache entries.
       * Iterates in order from most recently accessed entry to least recently.
       * Expired entries will be skipped (and removed).
       * No entry will be marked as accessed.
       *
       * @returns A Generator for the cache entries.
       *
       * @example
       * ```typescript
       * const cache = new LRUCache();
       *
       * // Set the key testKey to value testValue
       * cache.set('testKey', 'testValue');
       *
       * for (const entry of cache) {
       *   const { key, value } = entry;
       *   // do something with the entry
       * }
       * ```
       */
      *[Symbol.iterator]() {
        let node = this.head;
        while (node) {
          if (node.isExpired) {
            const next = node.next;
            this.removeNodeFromListAndLookupTable(node);
            node = next;
            continue;
          }
          yield this.mapNodeToEntry(node);
          node = node.next;
        }
      }
      enforceSizeLimit() {
        let node = this.tail;
        while (node !== null && this.size > this.maxSizeInternal) {
          const prev = node.prev;
          this.removeNodeFromListAndLookupTable(node);
          node = prev;
        }
      }
      mapNodeToEntry({ key, value }) {
        return {
          key,
          value
        };
      }
      setNodeAsHead(node) {
        this.removeNodeFromList(node);
        if (!this.head) {
          this.head = node;
          this.tail = node;
        } else {
          node.next = this.head;
          this.head.prev = node;
          this.head = node;
        }
        node.invokeOnEntryMarkedAsMostRecentlyUsed();
      }
      removeNodeFromList(node) {
        if (node.prev !== null) {
          node.prev.next = node.next;
        }
        if (node.next !== null) {
          node.next.prev = node.prev;
        }
        if (this.head === node) {
          this.head = node.next;
        }
        if (this.tail === node) {
          this.tail = node.prev;
        }
        node.next = null;
        node.prev = null;
      }
      removeNodeFromListAndLookupTable(node) {
        node.invokeOnEvicted();
        this.removeNodeFromList(node);
        return this.lookupTable.delete(node.key);
      }
      cleanCache() {
        if (!this.entryExpirationTimeInMS) {
          return;
        }
        const expiredNodes = [];
        for (const node of this.lookupTable.values()) {
          if (node.isExpired) {
            expiredNodes.push(node);
          }
        }
        expiredNodes.forEach((node) => this.removeNodeFromListAndLookupTable(node));
      }
    };
    exports2.LRUCache = LRUCache3;
  }
});

// node_modules/typescript-lru-cache/dist/index.js
var require_dist = __commonJS({
  "node_modules/typescript-lru-cache/dist/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_LRUCache(), exports2);
  }
});

// node_modules/light-bolt11-decoder/node_modules/@scure/base/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/light-bolt11-decoder/node_modules/@scure/base/lib/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.bytes = exports2.stringToBytes = exports2.str = exports2.bytesToString = exports2.hex = exports2.utf8 = exports2.bech32m = exports2.bech32 = exports2.base58check = exports2.base58xmr = exports2.base58xrp = exports2.base58flickr = exports2.base58 = exports2.base64url = exports2.base64 = exports2.base32crockford = exports2.base32hex = exports2.base32 = exports2.base16 = exports2.utils = exports2.assertNumber = void 0;
    function assertNumber5(n) {
      if (!Number.isSafeInteger(n))
        throw new Error(`Wrong integer: ${n}`);
    }
    exports2.assertNumber = assertNumber5;
    function chain5(...args) {
      const wrap2 = (a, b) => (c) => a(b(c));
      const encode2 = Array.from(args).reverse().reduce((acc, i2) => acc ? wrap2(acc, i2.encode) : i2.encode, void 0);
      const decode5 = args.reduce((acc, i2) => acc ? wrap2(acc, i2.decode) : i2.decode, void 0);
      return { encode: encode2, decode: decode5 };
    }
    function alphabet5(alphabet6) {
      return {
        encode: (digits) => {
          if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
            throw new Error("alphabet.encode input should be an array of numbers");
          return digits.map((i2) => {
            assertNumber5(i2);
            if (i2 < 0 || i2 >= alphabet6.length)
              throw new Error(`Digit index outside alphabet: ${i2} (alphabet: ${alphabet6.length})`);
            return alphabet6[i2];
          });
        },
        decode: (input) => {
          if (!Array.isArray(input) || input.length && typeof input[0] !== "string")
            throw new Error("alphabet.decode input should be array of strings");
          return input.map((letter) => {
            if (typeof letter !== "string")
              throw new Error(`alphabet.decode: not string element=${letter}`);
            const index = alphabet6.indexOf(letter);
            if (index === -1)
              throw new Error(`Unknown letter: "${letter}". Allowed: ${alphabet6}`);
            return index;
          });
        }
      };
    }
    function join5(separator = "") {
      if (typeof separator !== "string")
        throw new Error("join separator should be string");
      return {
        encode: (from) => {
          if (!Array.isArray(from) || from.length && typeof from[0] !== "string")
            throw new Error("join.encode input should be array of strings");
          for (let i2 of from)
            if (typeof i2 !== "string")
              throw new Error(`join.encode: non-string input=${i2}`);
          return from.join(separator);
        },
        decode: (to) => {
          if (typeof to !== "string")
            throw new Error("join.decode input should be string");
          return to.split(separator);
        }
      };
    }
    function padding5(bits, chr = "=") {
      assertNumber5(bits);
      if (typeof chr !== "string")
        throw new Error("padding chr should be string");
      return {
        encode(data) {
          if (!Array.isArray(data) || data.length && typeof data[0] !== "string")
            throw new Error("padding.encode input should be array of strings");
          for (let i2 of data)
            if (typeof i2 !== "string")
              throw new Error(`padding.encode: non-string input=${i2}`);
          while (data.length * bits % 8)
            data.push(chr);
          return data;
        },
        decode(input) {
          if (!Array.isArray(input) || input.length && typeof input[0] !== "string")
            throw new Error("padding.encode input should be array of strings");
          for (let i2 of input)
            if (typeof i2 !== "string")
              throw new Error(`padding.decode: non-string input=${i2}`);
          let end = input.length;
          if (end * bits % 8)
            throw new Error("Invalid padding: string should have whole number of bytes");
          for (; end > 0 && input[end - 1] === chr; end--) {
            if (!((end - 1) * bits % 8))
              throw new Error("Invalid padding: string has too much padding");
          }
          return input.slice(0, end);
        }
      };
    }
    function normalize6(fn) {
      if (typeof fn !== "function")
        throw new Error("normalize fn should be function");
      return { encode: (from) => from, decode: (to) => fn(to) };
    }
    function convertRadix6(data, from, to) {
      if (from < 2)
        throw new Error(`convertRadix: wrong from=${from}, base cannot be less than 2`);
      if (to < 2)
        throw new Error(`convertRadix: wrong to=${to}, base cannot be less than 2`);
      if (!Array.isArray(data))
        throw new Error("convertRadix: data should be array");
      if (!data.length)
        return [];
      let pos = 0;
      const res = [];
      const digits = Array.from(data);
      digits.forEach((d) => {
        assertNumber5(d);
        if (d < 0 || d >= from)
          throw new Error(`Wrong integer: ${d}`);
      });
      while (true) {
        let carry = 0;
        let done = true;
        for (let i2 = pos; i2 < digits.length; i2++) {
          const digit = digits[i2];
          const digitBase = from * carry + digit;
          if (!Number.isSafeInteger(digitBase) || from * carry / from !== carry || digitBase - digit !== from * carry) {
            throw new Error("convertRadix: carry overflow");
          }
          carry = digitBase % to;
          digits[i2] = Math.floor(digitBase / to);
          if (!Number.isSafeInteger(digits[i2]) || digits[i2] * to + carry !== digitBase)
            throw new Error("convertRadix: carry overflow");
          if (!done)
            continue;
          else if (!digits[i2])
            pos = i2;
          else
            done = false;
        }
        res.push(carry);
        if (done)
          break;
      }
      for (let i2 = 0; i2 < data.length - 1 && data[i2] === 0; i2++)
        res.push(0);
      return res.reverse();
    }
    var gcd5 = (a, b) => !b ? a : gcd5(b, a % b);
    var radix2carry5 = (from, to) => from + (to - gcd5(from, to));
    function convertRadix25(data, from, to, padding6) {
      if (!Array.isArray(data))
        throw new Error("convertRadix2: data should be array");
      if (from <= 0 || from > 32)
        throw new Error(`convertRadix2: wrong from=${from}`);
      if (to <= 0 || to > 32)
        throw new Error(`convertRadix2: wrong to=${to}`);
      if (radix2carry5(from, to) > 32) {
        throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${radix2carry5(from, to)}`);
      }
      let carry = 0;
      let pos = 0;
      const mask = 2 ** to - 1;
      const res = [];
      for (const n of data) {
        assertNumber5(n);
        if (n >= 2 ** from)
          throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
        carry = carry << from | n;
        if (pos + from > 32)
          throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
        pos += from;
        for (; pos >= to; pos -= to)
          res.push((carry >> pos - to & mask) >>> 0);
        carry &= 2 ** pos - 1;
      }
      carry = carry << to - pos & mask;
      if (!padding6 && pos >= from)
        throw new Error("Excess padding");
      if (!padding6 && carry)
        throw new Error(`Non-zero padding: ${carry}`);
      if (padding6 && pos > 0)
        res.push(carry >>> 0);
      return res;
    }
    function radix6(num) {
      assertNumber5(num);
      return {
        encode: (bytes8) => {
          if (!(bytes8 instanceof Uint8Array))
            throw new Error("radix.encode input should be Uint8Array");
          return convertRadix6(Array.from(bytes8), 2 ** 8, num);
        },
        decode: (digits) => {
          if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
            throw new Error("radix.decode input should be array of strings");
          return Uint8Array.from(convertRadix6(digits, num, 2 ** 8));
        }
      };
    }
    function radix25(bits, revPadding = false) {
      assertNumber5(bits);
      if (bits <= 0 || bits > 32)
        throw new Error("radix2: bits should be in (0..32]");
      if (radix2carry5(8, bits) > 32 || radix2carry5(bits, 8) > 32)
        throw new Error("radix2: carry overflow");
      return {
        encode: (bytes8) => {
          if (!(bytes8 instanceof Uint8Array))
            throw new Error("radix2.encode input should be Uint8Array");
          return convertRadix25(Array.from(bytes8), 8, bits, !revPadding);
        },
        decode: (digits) => {
          if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
            throw new Error("radix2.decode input should be array of strings");
          return Uint8Array.from(convertRadix25(digits, bits, 8, revPadding));
        }
      };
    }
    function unsafeWrapper4(fn) {
      if (typeof fn !== "function")
        throw new Error("unsafeWrapper fn should be function");
      return function(...args) {
        try {
          return fn.apply(null, args);
        } catch (e) {
        }
      };
    }
    function checksum2(len, fn) {
      assertNumber5(len);
      if (typeof fn !== "function")
        throw new Error("checksum fn should be function");
      return {
        encode(data) {
          if (!(data instanceof Uint8Array))
            throw new Error("checksum.encode: input should be Uint8Array");
          const checksum3 = fn(data).slice(0, len);
          const res = new Uint8Array(data.length + len);
          res.set(data);
          res.set(checksum3, data.length);
          return res;
        },
        decode(data) {
          if (!(data instanceof Uint8Array))
            throw new Error("checksum.decode: input should be Uint8Array");
          const payload = data.slice(0, -len);
          const newChecksum = fn(payload).slice(0, len);
          const oldChecksum = data.slice(-len);
          for (let i2 = 0; i2 < len; i2++)
            if (newChecksum[i2] !== oldChecksum[i2])
              throw new Error("Invalid checksum");
          return payload;
        }
      };
    }
    exports2.utils = { alphabet: alphabet5, chain: chain5, checksum: checksum2, radix: radix6, radix2: radix25, join: join5, padding: padding5 };
    exports2.base16 = chain5(radix25(4), alphabet5("0123456789ABCDEF"), join5(""));
    exports2.base32 = chain5(radix25(5), alphabet5("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), padding5(5), join5(""));
    exports2.base32hex = chain5(radix25(5), alphabet5("0123456789ABCDEFGHIJKLMNOPQRSTUV"), padding5(5), join5(""));
    exports2.base32crockford = chain5(radix25(5), alphabet5("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), join5(""), normalize6((s) => s.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
    exports2.base64 = chain5(radix25(6), alphabet5("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), padding5(6), join5(""));
    exports2.base64url = chain5(radix25(6), alphabet5("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), padding5(6), join5(""));
    var genBase585 = (abc) => chain5(radix6(58), alphabet5(abc), join5(""));
    exports2.base58 = genBase585("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
    exports2.base58flickr = genBase585("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ");
    exports2.base58xrp = genBase585("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
    var XMR_BLOCK_LEN4 = [0, 2, 3, 5, 6, 7, 9, 10, 11];
    exports2.base58xmr = {
      encode(data) {
        let res = "";
        for (let i2 = 0; i2 < data.length; i2 += 8) {
          const block = data.subarray(i2, i2 + 8);
          res += exports2.base58.encode(block).padStart(XMR_BLOCK_LEN4[block.length], "1");
        }
        return res;
      },
      decode(str) {
        let res = [];
        for (let i2 = 0; i2 < str.length; i2 += 11) {
          const slice2 = str.slice(i2, i2 + 11);
          const blockLen = XMR_BLOCK_LEN4.indexOf(slice2.length);
          const block = exports2.base58.decode(slice2);
          for (let j = 0; j < block.length - blockLen; j++) {
            if (block[j] !== 0)
              throw new Error("base58xmr: wrong padding");
          }
          res = res.concat(Array.from(block.slice(block.length - blockLen)));
        }
        return Uint8Array.from(res);
      }
    };
    var base58check3 = (sha2567) => chain5(checksum2(4, (data) => sha2567(sha2567(data))), exports2.base58);
    exports2.base58check = base58check3;
    var BECH_ALPHABET5 = chain5(alphabet5("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), join5(""));
    var POLYMOD_GENERATORS4 = [996825010, 642813549, 513874426, 1027748829, 705979059];
    function bech32Polymod4(pre) {
      const b = pre >> 25;
      let chk = (pre & 33554431) << 5;
      for (let i2 = 0; i2 < POLYMOD_GENERATORS4.length; i2++) {
        if ((b >> i2 & 1) === 1)
          chk ^= POLYMOD_GENERATORS4[i2];
      }
      return chk;
    }
    function bechChecksum4(prefix, words, encodingConst = 1) {
      const len = prefix.length;
      let chk = 1;
      for (let i2 = 0; i2 < len; i2++) {
        const c = prefix.charCodeAt(i2);
        if (c < 33 || c > 126)
          throw new Error(`Invalid prefix (${prefix})`);
        chk = bech32Polymod4(chk) ^ c >> 5;
      }
      chk = bech32Polymod4(chk);
      for (let i2 = 0; i2 < len; i2++)
        chk = bech32Polymod4(chk) ^ prefix.charCodeAt(i2) & 31;
      for (let v of words)
        chk = bech32Polymod4(chk) ^ v;
      for (let i2 = 0; i2 < 6; i2++)
        chk = bech32Polymod4(chk);
      chk ^= encodingConst;
      return BECH_ALPHABET5.encode(convertRadix25([chk % 2 ** 30], 30, 5, false));
    }
    function genBech324(encoding) {
      const ENCODING_CONST = encoding === "bech32" ? 1 : 734539939;
      const _words = radix25(5);
      const fromWords = _words.decode;
      const toWords = _words.encode;
      const fromWordsUnsafe = unsafeWrapper4(fromWords);
      function encode2(prefix, words, limit = 90) {
        if (typeof prefix !== "string")
          throw new Error(`bech32.encode prefix should be string, not ${typeof prefix}`);
        if (!Array.isArray(words) || words.length && typeof words[0] !== "number")
          throw new Error(`bech32.encode words should be array of numbers, not ${typeof words}`);
        const actualLength = prefix.length + 7 + words.length;
        if (limit !== false && actualLength > limit)
          throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
        prefix = prefix.toLowerCase();
        return `${prefix}1${BECH_ALPHABET5.encode(words)}${bechChecksum4(prefix, words, ENCODING_CONST)}`;
      }
      function decode5(str, limit = 90) {
        if (typeof str !== "string")
          throw new Error(`bech32.decode input should be string, not ${typeof str}`);
        if (str.length < 8 || limit !== false && str.length > limit)
          throw new TypeError(`Wrong string length: ${str.length} (${str}). Expected (8..${limit})`);
        const lowered = str.toLowerCase();
        if (str !== lowered && str !== str.toUpperCase())
          throw new Error(`String must be lowercase or uppercase`);
        str = lowered;
        const sepIndex = str.lastIndexOf("1");
        if (sepIndex === 0 || sepIndex === -1)
          throw new Error(`Letter "1" must be present between prefix and data only`);
        const prefix = str.slice(0, sepIndex);
        const _words2 = str.slice(sepIndex + 1);
        if (_words2.length < 6)
          throw new Error("Data must be at least 6 characters long");
        const words = BECH_ALPHABET5.decode(_words2).slice(0, -6);
        const sum = bechChecksum4(prefix, words, ENCODING_CONST);
        if (!_words2.endsWith(sum))
          throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
        return { prefix, words };
      }
      const decodeUnsafe = unsafeWrapper4(decode5);
      function decodeToBytes(str) {
        const { prefix, words } = decode5(str, false);
        return { prefix, words, bytes: fromWords(words) };
      }
      return { encode: encode2, decode: decode5, decodeToBytes, decodeUnsafe, fromWords, fromWordsUnsafe, toWords };
    }
    exports2.bech32 = genBech324("bech32");
    exports2.bech32m = genBech324("bech32m");
    exports2.utf8 = {
      encode: (data) => new TextDecoder().decode(data),
      decode: (str) => new TextEncoder().encode(str)
    };
    exports2.hex = chain5(radix25(4), alphabet5("0123456789abcdef"), join5(""), normalize6((s) => {
      if (typeof s !== "string" || s.length % 2)
        throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
      return s.toLowerCase();
    }));
    var CODERS4 = {
      utf8: exports2.utf8,
      hex: exports2.hex,
      base16: exports2.base16,
      base32: exports2.base32,
      base64: exports2.base64,
      base64url: exports2.base64url,
      base58: exports2.base58,
      base58xmr: exports2.base58xmr
    };
    var coderTypeError4 = `Invalid encoding type. Available types: ${Object.keys(CODERS4).join(", ")}`;
    var bytesToString = (type2, bytes8) => {
      if (typeof type2 !== "string" || !CODERS4.hasOwnProperty(type2))
        throw new TypeError(coderTypeError4);
      if (!(bytes8 instanceof Uint8Array))
        throw new TypeError("bytesToString() expects Uint8Array");
      return CODERS4[type2].encode(bytes8);
    };
    exports2.bytesToString = bytesToString;
    exports2.str = exports2.bytesToString;
    var stringToBytes = (type2, str) => {
      if (!CODERS4.hasOwnProperty(type2))
        throw new TypeError(coderTypeError4);
      if (typeof str !== "string")
        throw new TypeError("stringToBytes() expects string");
      return CODERS4[type2].decode(str);
    };
    exports2.stringToBytes = stringToBytes;
    exports2.bytes = exports2.stringToBytes;
  }
});

// node_modules/light-bolt11-decoder/bolt11.js
var require_bolt11 = __commonJS({
  "node_modules/light-bolt11-decoder/bolt11.js"(exports2, module2) {
    var { bech32: bech324, hex: hex5, utf8: utf84 } = require_lib2();
    var DEFAULTNETWORK = {
      // default network is bitcoin
      bech32: "bc",
      pubKeyHash: 0,
      scriptHash: 5,
      validWitnessVersions: [0]
    };
    var TESTNETWORK = {
      bech32: "tb",
      pubKeyHash: 111,
      scriptHash: 196,
      validWitnessVersions: [0]
    };
    var REGTESTNETWORK = {
      bech32: "bcrt",
      pubKeyHash: 111,
      scriptHash: 196,
      validWitnessVersions: [0]
    };
    var SIMNETWORK = {
      bech32: "sb",
      pubKeyHash: 63,
      scriptHash: 123,
      validWitnessVersions: [0]
    };
    var FEATUREBIT_ORDER = [
      "option_data_loss_protect",
      "initial_routing_sync",
      "option_upfront_shutdown_script",
      "gossip_queries",
      "var_onion_optin",
      "gossip_queries_ex",
      "option_static_remotekey",
      "payment_secret",
      "basic_mpp",
      "option_support_large_channel"
    ];
    var DIVISORS = {
      m: BigInt(1e3),
      u: BigInt(1e6),
      n: BigInt(1e9),
      p: BigInt(1e12)
    };
    var MAX_MILLISATS = BigInt("2100000000000000000");
    var MILLISATS_PER_BTC = BigInt(1e11);
    var TAGCODES = {
      payment_hash: 1,
      payment_secret: 16,
      description: 13,
      payee: 19,
      description_hash: 23,
      // commit to longer descriptions (used by lnurl-pay)
      expiry: 6,
      // default: 3600 (1 hour)
      min_final_cltv_expiry: 24,
      // default: 9
      fallback_address: 9,
      route_hint: 3,
      // for extra routing info (private etc.)
      feature_bits: 5,
      metadata: 27
    };
    var TAGNAMES = {};
    for (let i2 = 0, keys2 = Object.keys(TAGCODES); i2 < keys2.length; i2++) {
      const currentName = keys2[i2];
      const currentCode = TAGCODES[keys2[i2]].toString();
      TAGNAMES[currentCode] = currentName;
    }
    var TAGPARSERS = {
      1: (words) => hex5.encode(bech324.fromWordsUnsafe(words)),
      // 256 bits
      16: (words) => hex5.encode(bech324.fromWordsUnsafe(words)),
      // 256 bits
      13: (words) => utf84.encode(bech324.fromWordsUnsafe(words)),
      // string variable length
      19: (words) => hex5.encode(bech324.fromWordsUnsafe(words)),
      // 264 bits
      23: (words) => hex5.encode(bech324.fromWordsUnsafe(words)),
      // 256 bits
      27: (words) => hex5.encode(bech324.fromWordsUnsafe(words)),
      // variable
      6: wordsToIntBE,
      // default: 3600 (1 hour)
      24: wordsToIntBE,
      // default: 9
      3: routingInfoParser,
      // for extra routing info (private etc.)
      5: featureBitsParser
      // keep feature bits as array of 5 bit words
    };
    function getUnknownParser(tagCode) {
      return (words) => ({
        tagCode: parseInt(tagCode),
        words: bech324.encode("unknown", words, Number.MAX_SAFE_INTEGER)
      });
    }
    function wordsToIntBE(words) {
      return words.reverse().reduce((total, item, index) => {
        return total + item * Math.pow(32, index);
      }, 0);
    }
    function routingInfoParser(words) {
      const routes = [];
      let pubkey, shortChannelId, feeBaseMSats, feeProportionalMillionths, cltvExpiryDelta;
      let routesBuffer = bech324.fromWordsUnsafe(words);
      while (routesBuffer.length > 0) {
        pubkey = hex5.encode(routesBuffer.slice(0, 33));
        shortChannelId = hex5.encode(routesBuffer.slice(33, 41));
        feeBaseMSats = parseInt(hex5.encode(routesBuffer.slice(41, 45)), 16);
        feeProportionalMillionths = parseInt(
          hex5.encode(routesBuffer.slice(45, 49)),
          16
        );
        cltvExpiryDelta = parseInt(hex5.encode(routesBuffer.slice(49, 51)), 16);
        routesBuffer = routesBuffer.slice(51);
        routes.push({
          pubkey,
          short_channel_id: shortChannelId,
          fee_base_msat: feeBaseMSats,
          fee_proportional_millionths: feeProportionalMillionths,
          cltv_expiry_delta: cltvExpiryDelta
        });
      }
      return routes;
    }
    function featureBitsParser(words) {
      const bools = words.slice().reverse().map((word) => [
        !!(word & 1),
        !!(word & 2),
        !!(word & 4),
        !!(word & 8),
        !!(word & 16)
      ]).reduce((finalArr, itemArr) => finalArr.concat(itemArr), []);
      while (bools.length < FEATUREBIT_ORDER.length * 2) {
        bools.push(false);
      }
      const featureBits = {};
      FEATUREBIT_ORDER.forEach((featureName, index) => {
        let status;
        if (bools[index * 2]) {
          status = "required";
        } else if (bools[index * 2 + 1]) {
          status = "supported";
        } else {
          status = "unsupported";
        }
        featureBits[featureName] = status;
      });
      const extraBits = bools.slice(FEATUREBIT_ORDER.length * 2);
      featureBits.extra_bits = {
        start_bit: FEATUREBIT_ORDER.length * 2,
        bits: extraBits,
        has_required: extraBits.reduce(
          (result, bit, index) => index % 2 !== 0 ? result || false : result || bit,
          false
        )
      };
      return featureBits;
    }
    function hrpToMillisat(hrpString, outputString) {
      let divisor, value;
      if (hrpString.slice(-1).match(/^[munp]$/)) {
        divisor = hrpString.slice(-1);
        value = hrpString.slice(0, -1);
      } else if (hrpString.slice(-1).match(/^[^munp0-9]$/)) {
        throw new Error("Not a valid multiplier for the amount");
      } else {
        value = hrpString;
      }
      if (!value.match(/^\d+$/))
        throw new Error("Not a valid human readable amount");
      const valueBN = BigInt(value);
      const millisatoshisBN = divisor ? valueBN * MILLISATS_PER_BTC / DIVISORS[divisor] : valueBN * MILLISATS_PER_BTC;
      if (divisor === "p" && !(valueBN % BigInt(10) === BigInt(0)) || millisatoshisBN > MAX_MILLISATS) {
        throw new Error("Amount is outside of valid range");
      }
      return outputString ? millisatoshisBN.toString() : millisatoshisBN;
    }
    function decode5(paymentRequest, network) {
      if (typeof paymentRequest !== "string")
        throw new Error("Lightning Payment Request must be string");
      if (paymentRequest.slice(0, 2).toLowerCase() !== "ln")
        throw new Error("Not a proper lightning payment request");
      const sections = [];
      const decoded = bech324.decode(paymentRequest, Number.MAX_SAFE_INTEGER);
      paymentRequest = paymentRequest.toLowerCase();
      const prefix = decoded.prefix;
      let words = decoded.words;
      let letters = paymentRequest.slice(prefix.length + 1);
      let sigWords = words.slice(-104);
      words = words.slice(0, -104);
      let prefixMatches = prefix.match(/^ln(\S+?)(\d*)([a-zA-Z]?)$/);
      if (prefixMatches && !prefixMatches[2])
        prefixMatches = prefix.match(/^ln(\S+)$/);
      if (!prefixMatches) {
        throw new Error("Not a proper lightning payment request");
      }
      sections.push({
        name: "lightning_network",
        letters: "ln"
      });
      const bech32Prefix = prefixMatches[1];
      let coinNetwork;
      if (!network) {
        switch (bech32Prefix) {
          case DEFAULTNETWORK.bech32:
            coinNetwork = DEFAULTNETWORK;
            break;
          case TESTNETWORK.bech32:
            coinNetwork = TESTNETWORK;
            break;
          case REGTESTNETWORK.bech32:
            coinNetwork = REGTESTNETWORK;
            break;
          case SIMNETWORK.bech32:
            coinNetwork = SIMNETWORK;
            break;
        }
      } else {
        if (network.bech32 === void 0 || network.pubKeyHash === void 0 || network.scriptHash === void 0 || !Array.isArray(network.validWitnessVersions))
          throw new Error("Invalid network");
        coinNetwork = network;
      }
      if (!coinNetwork || coinNetwork.bech32 !== bech32Prefix) {
        throw new Error("Unknown coin bech32 prefix");
      }
      sections.push({
        name: "coin_network",
        letters: bech32Prefix,
        value: coinNetwork
      });
      const value = prefixMatches[2];
      let millisatoshis;
      if (value) {
        const divisor = prefixMatches[3];
        millisatoshis = hrpToMillisat(value + divisor, true);
        sections.push({
          name: "amount",
          letters: prefixMatches[2] + prefixMatches[3],
          value: millisatoshis
        });
      } else {
        millisatoshis = null;
      }
      sections.push({
        name: "separator",
        letters: "1"
      });
      const timestamp = wordsToIntBE(words.slice(0, 7));
      words = words.slice(7);
      sections.push({
        name: "timestamp",
        letters: letters.slice(0, 7),
        value: timestamp
      });
      letters = letters.slice(7);
      let tagName, parser, tagLength, tagWords;
      while (words.length > 0) {
        const tagCode = words[0].toString();
        tagName = TAGNAMES[tagCode] || "unknown_tag";
        parser = TAGPARSERS[tagCode] || getUnknownParser(tagCode);
        words = words.slice(1);
        tagLength = wordsToIntBE(words.slice(0, 2));
        words = words.slice(2);
        tagWords = words.slice(0, tagLength);
        words = words.slice(tagLength);
        sections.push({
          name: tagName,
          tag: letters[0],
          letters: letters.slice(0, 1 + 2 + tagLength),
          value: parser(tagWords)
          // see: parsers for more comments
        });
        letters = letters.slice(1 + 2 + tagLength);
      }
      sections.push({
        name: "signature",
        letters: letters.slice(0, 104),
        value: hex5.encode(bech324.fromWordsUnsafe(sigWords))
      });
      letters = letters.slice(104);
      sections.push({
        name: "checksum",
        letters
      });
      let result = {
        paymentRequest,
        sections,
        get expiry() {
          let exp = sections.find((s) => s.name === "expiry");
          if (exp)
            return getValue("timestamp") + exp.value;
        },
        get route_hints() {
          return sections.filter((s) => s.name === "route_hint").map((s) => s.value);
        }
      };
      for (let name in TAGCODES) {
        if (name === "route_hint") {
          continue;
        }
        Object.defineProperty(result, name, {
          get() {
            return getValue(name);
          }
        });
      }
      return result;
      function getValue(name) {
        let section = sections.find((s) => s.name === name);
        return section ? section.value : void 0;
      }
    }
    module2.exports = {
      decode: decode5,
      hrpToMillisat
    };
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  expertOpinions: () => expertOpinions
});
var ExpertOpinions, expertOpinions;
var init_main = __esm({
  "src/main.ts"() {
    "use strict";
    ExpertOpinions = class {
      headline = "Community Opinions ($$nTrusted$$/$$nAll$$)";
      description = "These comments are contributed by nostr users using the nostr-opinions-plugin.";
      newOpinionDescription = `<p>
	Thank you for contributing your opinion. Please make sure to follow these
	simple guidelines:
</p>
<ul>
	<li>Be objective</li>
	<li>Be polite</li>
</ul>`;
      trustedAuthors = [];
      trustedBadgeAuthors = [];
      trustedBadges = [];
    };
    expertOpinions = new ExpertOpinions();
  }
});

// src/summariser.ts
var summariser_exports = {};
__export(summariser_exports, {
  default: () => Summariser
});
module.exports = __toCommonJS(summariser_exports);

// node_modules/@noble/curves/node_modules/@noble/hashes/esm/_assert.js
function number(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error(`Wrong positive integer: ${n}`);
}
function bool(b) {
  if (typeof b !== "boolean")
    throw new Error(`Expected boolean, not ${b}`);
}
function bytes(b, ...lengths) {
  if (!(b instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
function hash(hash8) {
  if (typeof hash8 !== "function" || typeof hash8.create !== "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  number(hash8.outputLen);
  number(hash8.blockLen);
}
function exists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function output(out, instance) {
  bytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error(`digestInto() expects output buffer of length at least ${min}`);
  }
}
var assert = {
  number,
  bool,
  bytes,
  hash,
  exists,
  output
};
var assert_default = assert;

// node_modules/@noble/curves/node_modules/@noble/hashes/esm/cryptoNode.js
var nc = __toESM(require("crypto"), 1);
var crypto2 = nc && typeof nc === "object" && "webcrypto" in nc ? nc.webcrypto : void 0;

// node_modules/@noble/curves/node_modules/@noble/hashes/esm/utils.js
var u8a = (a) => a instanceof Uint8Array;
var createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
var rotr = (word, shift) => word << 32 - shift | word >>> shift;
var isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!isLE)
  throw new Error("Non little-endian hardware is not supported");
var hexes = Array.from({ length: 256 }, (v, i2) => i2.toString(16).padStart(2, "0"));
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  if (!u8a(data))
    throw new Error(`expected Uint8Array, got ${typeof data}`);
  return data;
}
function concatBytes(...arrays) {
  const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
  let pad2 = 0;
  arrays.forEach((a) => {
    if (!u8a(a))
      throw new Error("Uint8Array expected");
    r.set(a, pad2);
    pad2 += a.length;
  });
  return r;
}
var Hash = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function wrapConstructor(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function randomBytes(bytesLength = 32) {
  if (crypto2 && typeof crypto2.getRandomValues === "function") {
    return crypto2.getRandomValues(new Uint8Array(bytesLength));
  }
  throw new Error("crypto.getRandomValues must be defined");
}

// node_modules/@noble/curves/node_modules/@noble/hashes/esm/_sha2.js
function setBigUint64(view, byteOffset, value, isLE8) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE8);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE8 ? 4 : 0;
  const l = isLE8 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE8);
  view.setUint32(byteOffset + l, wl, isLE8);
}
var SHA2 = class extends Hash {
  constructor(blockLen, outputLen, padOffset, isLE8) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE8;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    assert_default.exists(this);
    const { view, buffer, blockLen } = this;
    data = toBytes(data);
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    assert_default.exists(this);
    assert_default.output(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE8 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    this.buffer.subarray(pos).fill(0);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i2 = pos; i2 < blockLen; i2++)
      buffer[i2] = 0;
    setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE8);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i2 = 0; i2 < outLen; i2++)
      oview.setUint32(4 * i2, state[i2], isLE8);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.length = length;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
};

// node_modules/@noble/curves/node_modules/@noble/hashes/esm/sha256.js
var Chi = (a, b, c) => a & b ^ ~a & c;
var Maj = (a, b, c) => a & b ^ a & c ^ b & c;
var SHA256_K = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var IV = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA256_W = new Uint32Array(64);
var SHA256 = class extends SHA2 {
  constructor() {
    super(64, 32, 8, false);
    this.A = IV[0] | 0;
    this.B = IV[1] | 0;
    this.C = IV[2] | 0;
    this.D = IV[3] | 0;
    this.E = IV[4] | 0;
    this.F = IV[5] | 0;
    this.G = IV[6] | 0;
    this.H = IV[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4)
      SHA256_W[i2] = view.getUint32(offset, false);
    for (let i2 = 16; i2 < 64; i2++) {
      const W15 = SHA256_W[i2 - 15];
      const W2 = SHA256_W[i2 - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i2] = s1 + SHA256_W[i2 - 7] + s0 + SHA256_W[i2 - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i2 = 0; i2 < 64; i2++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i2] + SHA256_W[i2] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    SHA256_W.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
};
var SHA224 = class extends SHA256 {
  constructor() {
    super();
    this.A = 3238371032 | 0;
    this.B = 914150663 | 0;
    this.C = 812702999 | 0;
    this.D = 4144912697 | 0;
    this.E = 4290775857 | 0;
    this.F = 1750603025 | 0;
    this.G = 1694076839 | 0;
    this.H = 3204075428 | 0;
    this.outputLen = 28;
  }
};
var sha256 = wrapConstructor(() => new SHA256());
var sha224 = wrapConstructor(() => new SHA224());

// node_modules/@noble/curves/esm/abstract/utils.js
var utils_exports = {};
__export(utils_exports, {
  bitGet: () => bitGet,
  bitLen: () => bitLen,
  bitMask: () => bitMask,
  bitSet: () => bitSet,
  bytesToHex: () => bytesToHex,
  bytesToNumberBE: () => bytesToNumberBE,
  bytesToNumberLE: () => bytesToNumberLE,
  concatBytes: () => concatBytes2,
  createHmacDrbg: () => createHmacDrbg,
  ensureBytes: () => ensureBytes,
  equalBytes: () => equalBytes,
  hexToBytes: () => hexToBytes,
  hexToNumber: () => hexToNumber,
  numberToBytesBE: () => numberToBytesBE,
  numberToBytesLE: () => numberToBytesLE,
  numberToHexUnpadded: () => numberToHexUnpadded,
  numberToVarBytesBE: () => numberToVarBytesBE,
  utf8ToBytes: () => utf8ToBytes2,
  validateObject: () => validateObject
});
var _0n = BigInt(0);
var _1n = BigInt(1);
var _2n = BigInt(2);
var u8a2 = (a) => a instanceof Uint8Array;
var hexes2 = Array.from({ length: 256 }, (v, i2) => i2.toString(16).padStart(2, "0"));
function bytesToHex(bytes8) {
  if (!u8a2(bytes8))
    throw new Error("Uint8Array expected");
  let hex5 = "";
  for (let i2 = 0; i2 < bytes8.length; i2++) {
    hex5 += hexes2[bytes8[i2]];
  }
  return hex5;
}
function numberToHexUnpadded(num) {
  const hex5 = num.toString(16);
  return hex5.length & 1 ? `0${hex5}` : hex5;
}
function hexToNumber(hex5) {
  if (typeof hex5 !== "string")
    throw new Error("hex string expected, got " + typeof hex5);
  return BigInt(hex5 === "" ? "0" : `0x${hex5}`);
}
function hexToBytes(hex5) {
  if (typeof hex5 !== "string")
    throw new Error("hex string expected, got " + typeof hex5);
  const len = hex5.length;
  if (len % 2)
    throw new Error("padded hex string expected, got unpadded hex of length " + len);
  const array = new Uint8Array(len / 2);
  for (let i2 = 0; i2 < array.length; i2++) {
    const j = i2 * 2;
    const hexByte = hex5.slice(j, j + 2);
    const byte = Number.parseInt(hexByte, 16);
    if (Number.isNaN(byte) || byte < 0)
      throw new Error("Invalid byte sequence");
    array[i2] = byte;
  }
  return array;
}
function bytesToNumberBE(bytes8) {
  return hexToNumber(bytesToHex(bytes8));
}
function bytesToNumberLE(bytes8) {
  if (!u8a2(bytes8))
    throw new Error("Uint8Array expected");
  return hexToNumber(bytesToHex(Uint8Array.from(bytes8).reverse()));
}
function numberToBytesBE(n, len) {
  return hexToBytes(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function numberToVarBytesBE(n) {
  return hexToBytes(numberToHexUnpadded(n));
}
function ensureBytes(title, hex5, expectedLength) {
  let res;
  if (typeof hex5 === "string") {
    try {
      res = hexToBytes(hex5);
    } catch (e) {
      throw new Error(`${title} must be valid hex string, got "${hex5}". Cause: ${e}`);
    }
  } else if (u8a2(hex5)) {
    res = Uint8Array.from(hex5);
  } else {
    throw new Error(`${title} must be hex string or Uint8Array`);
  }
  const len = res.length;
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(`${title} expected ${expectedLength} bytes, got ${len}`);
  return res;
}
function concatBytes2(...arrays) {
  const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
  let pad2 = 0;
  arrays.forEach((a) => {
    if (!u8a2(a))
      throw new Error("Uint8Array expected");
    r.set(a, pad2);
    pad2 += a.length;
  });
  return r;
}
function equalBytes(b1, b2) {
  if (b1.length !== b2.length)
    return false;
  for (let i2 = 0; i2 < b1.length; i2++)
    if (b1[i2] !== b2[i2])
      return false;
  return true;
}
function utf8ToBytes2(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function bitLen(n) {
  let len;
  for (len = 0; n > _0n; n >>= _1n, len += 1)
    ;
  return len;
}
function bitGet(n, pos) {
  return n >> BigInt(pos) & _1n;
}
var bitSet = (n, pos, value) => {
  return n | (value ? _1n : _0n) << BigInt(pos);
};
var bitMask = (n) => (_2n << BigInt(n - 1)) - _1n;
var u8n = (data) => new Uint8Array(data);
var u8fr = (arr) => Uint8Array.from(arr);
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  if (typeof hashLen !== "number" || hashLen < 2)
    throw new Error("hashLen must be a number");
  if (typeof qByteLen !== "number" || qByteLen < 2)
    throw new Error("qByteLen must be a number");
  if (typeof hmacFn !== "function")
    throw new Error("hmacFn must be a function");
  let v = u8n(hashLen);
  let k = u8n(hashLen);
  let i2 = 0;
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i2 = 0;
  };
  const h = (...b) => hmacFn(k, v, ...b);
  const reseed = (seed = u8n()) => {
    k = h(u8fr([0]), seed);
    v = h();
    if (seed.length === 0)
      return;
    k = h(u8fr([1]), seed);
    v = h();
  };
  const gen = () => {
    if (i2++ >= 1e3)
      throw new Error("drbg: tried 1000 values");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes2(...out);
  };
  const genUntil = (seed, pred) => {
    reset();
    reseed(seed);
    let res = void 0;
    while (!(res = pred(gen())))
      reseed();
    reset();
    return res;
  };
  return genUntil;
}
var validatorFns = {
  bigint: (val) => typeof val === "bigint",
  function: (val) => typeof val === "function",
  boolean: (val) => typeof val === "boolean",
  string: (val) => typeof val === "string",
  isSafeInteger: (val) => Number.isSafeInteger(val),
  array: (val) => Array.isArray(val),
  field: (val, object) => object.Fp.isValid(val),
  hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
};
function validateObject(object, validators, optValidators = {}) {
  const checkField = (fieldName, type2, isOptional) => {
    const checkVal = validatorFns[type2];
    if (typeof checkVal !== "function")
      throw new Error(`Invalid validator "${type2}", expected function`);
    const val = object[fieldName];
    if (isOptional && val === void 0)
      return;
    if (!checkVal(val, object)) {
      throw new Error(`Invalid param ${String(fieldName)}=${val} (${typeof val}), expected ${type2}`);
    }
  };
  for (const [fieldName, type2] of Object.entries(validators))
    checkField(fieldName, type2, false);
  for (const [fieldName, type2] of Object.entries(optValidators))
    checkField(fieldName, type2, true);
  return object;
}

// node_modules/@noble/curves/esm/abstract/modular.js
var _0n2 = BigInt(0);
var _1n2 = BigInt(1);
var _2n2 = BigInt(2);
var _3n = BigInt(3);
var _4n = BigInt(4);
var _5n = BigInt(5);
var _8n = BigInt(8);
var _9n = BigInt(9);
var _16n = BigInt(16);
function mod(a, b) {
  const result = a % b;
  return result >= _0n2 ? result : b + result;
}
function pow(num, power, modulo) {
  if (modulo <= _0n2 || power < _0n2)
    throw new Error("Expected power/modulo > 0");
  if (modulo === _1n2)
    return _0n2;
  let res = _1n2;
  while (power > _0n2) {
    if (power & _1n2)
      res = res * num % modulo;
    num = num * num % modulo;
    power >>= _1n2;
  }
  return res;
}
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number8, modulo) {
  if (number8 === _0n2 || modulo <= _0n2) {
    throw new Error(`invert: expected positive integers, got n=${number8} mod=${modulo}`);
  }
  let a = mod(number8, modulo);
  let b = modulo;
  let x = _0n2, y = _1n2, u2 = _1n2, v = _0n2;
  while (a !== _0n2) {
    const q = b / a;
    const r = b % a;
    const m = x - u2 * q;
    const n = y - v * q;
    b = a, a = r, x = u2, y = v, u2 = m, v = n;
  }
  const gcd5 = b;
  if (gcd5 !== _1n2)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function tonelliShanks(P) {
  const legendreC = (P - _1n2) / _2n2;
  let Q, S, Z;
  for (Q = P - _1n2, S = 0; Q % _2n2 === _0n2; Q /= _2n2, S++)
    ;
  for (Z = _2n2; Z < P && pow(Z, legendreC, P) !== P - _1n2; Z++)
    ;
  if (S === 1) {
    const p1div4 = (P + _1n2) / _4n;
    return function tonelliFast(Fp3, n) {
      const root = Fp3.pow(n, p1div4);
      if (!Fp3.eql(Fp3.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  const Q1div2 = (Q + _1n2) / _2n2;
  return function tonelliSlow(Fp3, n) {
    if (Fp3.pow(n, legendreC) === Fp3.neg(Fp3.ONE))
      throw new Error("Cannot find square root");
    let r = S;
    let g = Fp3.pow(Fp3.mul(Fp3.ONE, Z), Q);
    let x = Fp3.pow(n, Q1div2);
    let b = Fp3.pow(n, Q);
    while (!Fp3.eql(b, Fp3.ONE)) {
      if (Fp3.eql(b, Fp3.ZERO))
        return Fp3.ZERO;
      let m = 1;
      for (let t2 = Fp3.sqr(b); m < r; m++) {
        if (Fp3.eql(t2, Fp3.ONE))
          break;
        t2 = Fp3.sqr(t2);
      }
      const ge3 = Fp3.pow(g, _1n2 << BigInt(r - m - 1));
      g = Fp3.sqr(ge3);
      x = Fp3.mul(x, ge3);
      b = Fp3.mul(b, g);
      r = m;
    }
    return x;
  };
}
function FpSqrt(P) {
  if (P % _4n === _3n) {
    const p1div4 = (P + _1n2) / _4n;
    return function sqrt3mod4(Fp3, n) {
      const root = Fp3.pow(n, p1div4);
      if (!Fp3.eql(Fp3.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  if (P % _8n === _5n) {
    const c1 = (P - _5n) / _8n;
    return function sqrt5mod8(Fp3, n) {
      const n2 = Fp3.mul(n, _2n2);
      const v = Fp3.pow(n2, c1);
      const nv = Fp3.mul(n, v);
      const i2 = Fp3.mul(Fp3.mul(nv, _2n2), v);
      const root = Fp3.mul(nv, Fp3.sub(i2, Fp3.ONE));
      if (!Fp3.eql(Fp3.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  if (P % _16n === _9n) {
  }
  return tonelliShanks(P);
}
var FIELD_FIELDS = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function validateField(field) {
  const initial = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "isSafeInteger",
    BITS: "isSafeInteger"
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  return validateObject(field, opts);
}
function FpPow(f2, num, power) {
  if (power < _0n2)
    throw new Error("Expected power > 0");
  if (power === _0n2)
    return f2.ONE;
  if (power === _1n2)
    return num;
  let p = f2.ONE;
  let d = num;
  while (power > _0n2) {
    if (power & _1n2)
      p = f2.mul(p, d);
    d = f2.sqr(d);
    power >>= _1n2;
  }
  return p;
}
function FpInvertBatch(f2, nums) {
  const tmp = new Array(nums.length);
  const lastMultiplied = nums.reduce((acc, num, i2) => {
    if (f2.is0(num))
      return acc;
    tmp[i2] = acc;
    return f2.mul(acc, num);
  }, f2.ONE);
  const inverted = f2.inv(lastMultiplied);
  nums.reduceRight((acc, num, i2) => {
    if (f2.is0(num))
      return acc;
    tmp[i2] = f2.mul(acc, tmp[i2]);
    return f2.mul(acc, num);
  }, inverted);
  return tmp;
}
function nLength(n, nBitLength) {
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
function Field(ORDER, bitLen3, isLE8 = false, redef = {}) {
  if (ORDER <= _0n2)
    throw new Error(`Expected Fp ORDER > 0, got ${ORDER}`);
  const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen3);
  if (BYTES > 2048)
    throw new Error("Field lengths over 2048 bytes are not supported");
  const sqrtP = FpSqrt(ORDER);
  const f2 = Object.freeze({
    ORDER,
    BITS,
    BYTES,
    MASK: bitMask(BITS),
    ZERO: _0n2,
    ONE: _1n2,
    create: (num) => mod(num, ORDER),
    isValid: (num) => {
      if (typeof num !== "bigint")
        throw new Error(`Invalid field element: expected bigint, got ${typeof num}`);
      return _0n2 <= num && num < ORDER;
    },
    is0: (num) => num === _0n2,
    isOdd: (num) => (num & _1n2) === _1n2,
    neg: (num) => mod(-num, ORDER),
    eql: (lhs, rhs) => lhs === rhs,
    sqr: (num) => mod(num * num, ORDER),
    add: (lhs, rhs) => mod(lhs + rhs, ORDER),
    sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
    mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
    pow: (num, power) => FpPow(f2, num, power),
    div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
    // Same as above, but doesn't normalize
    sqrN: (num) => num * num,
    addN: (lhs, rhs) => lhs + rhs,
    subN: (lhs, rhs) => lhs - rhs,
    mulN: (lhs, rhs) => lhs * rhs,
    inv: (num) => invert(num, ORDER),
    sqrt: redef.sqrt || ((n) => sqrtP(f2, n)),
    invertBatch: (lst) => FpInvertBatch(f2, lst),
    // TODO: do we really need constant cmov?
    // We don't have const-time bigints anyway, so probably will be not very useful
    cmov: (a, b, c) => c ? b : a,
    toBytes: (num) => isLE8 ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
    fromBytes: (bytes8) => {
      if (bytes8.length !== BYTES)
        throw new Error(`Fp.fromBytes: expected ${BYTES}, got ${bytes8.length}`);
      return isLE8 ? bytesToNumberLE(bytes8) : bytesToNumberBE(bytes8);
    }
  });
  return Object.freeze(f2);
}
function hashToPrivateScalar(hash8, groupOrder, isLE8 = false) {
  hash8 = ensureBytes("privateHash", hash8);
  const hashLen = hash8.length;
  const minLen = nLength(groupOrder).nByteLength + 8;
  if (minLen < 24 || hashLen < minLen || hashLen > 1024)
    throw new Error(`hashToPrivateScalar: expected ${minLen}-1024 bytes of input, got ${hashLen}`);
  const num = isLE8 ? bytesToNumberLE(hash8) : bytesToNumberBE(hash8);
  return mod(num, groupOrder - _1n2) + _1n2;
}

// node_modules/@noble/curves/esm/abstract/curve.js
var _0n3 = BigInt(0);
var _1n3 = BigInt(1);
function wNAF(c, bits) {
  const constTimeNegate = (condition, item) => {
    const neg = item.negate();
    return condition ? neg : item;
  };
  const opts = (W) => {
    const windows = Math.ceil(bits / W) + 1;
    const windowSize = 2 ** (W - 1);
    return { windows, windowSize };
  };
  return {
    constTimeNegate,
    // non-const time multiplication ladder
    unsafeLadder(elm, n) {
      let p = c.ZERO;
      let d = elm;
      while (n > _0n3) {
        if (n & _1n3)
          p = p.add(d);
        d = d.double();
        n >>= _1n3;
      }
      return p;
    },
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(elm, W) {
      const { windows, windowSize } = opts(W);
      const points = [];
      let p = elm;
      let base = p;
      for (let window2 = 0; window2 < windows; window2++) {
        base = p;
        points.push(base);
        for (let i2 = 1; i2 < windowSize; i2++) {
          base = base.add(p);
          points.push(base);
        }
        p = base.double();
      }
      return points;
    },
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @returns real and fake (for const-time) points
     */
    wNAF(W, precomputes, n) {
      const { windows, windowSize } = opts(W);
      let p = c.ZERO;
      let f2 = c.BASE;
      const mask = BigInt(2 ** W - 1);
      const maxNumber = 2 ** W;
      const shiftBy = BigInt(W);
      for (let window2 = 0; window2 < windows; window2++) {
        const offset = window2 * windowSize;
        let wbits = Number(n & mask);
        n >>= shiftBy;
        if (wbits > windowSize) {
          wbits -= maxNumber;
          n += _1n3;
        }
        const offset1 = offset;
        const offset2 = offset + Math.abs(wbits) - 1;
        const cond1 = window2 % 2 !== 0;
        const cond2 = wbits < 0;
        if (wbits === 0) {
          f2 = f2.add(constTimeNegate(cond1, precomputes[offset1]));
        } else {
          p = p.add(constTimeNegate(cond2, precomputes[offset2]));
        }
      }
      return { p, f: f2 };
    },
    wNAFCached(P, precomputesMap, n, transform) {
      const W = P._WINDOW_SIZE || 1;
      let comp = precomputesMap.get(P);
      if (!comp) {
        comp = this.precomputeWindow(P, W);
        if (W !== 1) {
          precomputesMap.set(P, transform(comp));
        }
      }
      return this.wNAF(W, comp, n);
    }
  };
}
function validateBasic(curve) {
  validateField(curve.Fp);
  validateObject(curve, {
    n: "bigint",
    h: "bigint",
    Gx: "field",
    Gy: "field"
  }, {
    nBitLength: "isSafeInteger",
    nByteLength: "isSafeInteger"
  });
  return Object.freeze({
    ...nLength(curve.n, curve.nBitLength),
    ...curve,
    ...{ p: curve.Fp.ORDER }
  });
}

// node_modules/@noble/curves/esm/abstract/weierstrass.js
function validatePointOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    a: "field",
    b: "field"
  }, {
    allowedPrivateKeyLengths: "array",
    wrapPrivateKey: "boolean",
    isTorsionFree: "function",
    clearCofactor: "function",
    allowInfinityPoint: "boolean",
    fromBytes: "function",
    toBytes: "function"
  });
  const { endo, Fp: Fp3, a } = opts;
  if (endo) {
    if (!Fp3.eql(a, Fp3.ZERO)) {
      throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");
    }
    if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
      throw new Error("Expected endomorphism with beta: bigint and splitScalar: function");
    }
  }
  return Object.freeze({ ...opts });
}
var { bytesToNumberBE: b2n, hexToBytes: h2b } = utils_exports;
var DER = {
  // asn.1 DER encoding utils
  Err: class DERErr extends Error {
    constructor(m = "") {
      super(m);
    }
  },
  _parseInt(data) {
    const { Err: E } = DER;
    if (data.length < 2 || data[0] !== 2)
      throw new E("Invalid signature integer tag");
    const len = data[1];
    const res = data.subarray(2, len + 2);
    if (!len || res.length !== len)
      throw new E("Invalid signature integer: wrong length");
    if (res[0] & 128)
      throw new E("Invalid signature integer: negative");
    if (res[0] === 0 && !(res[1] & 128))
      throw new E("Invalid signature integer: unnecessary leading zero");
    return { d: b2n(res), l: data.subarray(len + 2) };
  },
  toSig(hex5) {
    const { Err: E } = DER;
    const data = typeof hex5 === "string" ? h2b(hex5) : hex5;
    if (!(data instanceof Uint8Array))
      throw new Error("ui8a expected");
    let l = data.length;
    if (l < 2 || data[0] != 48)
      throw new E("Invalid signature tag");
    if (data[1] !== l - 2)
      throw new E("Invalid signature: incorrect length");
    const { d: r, l: sBytes } = DER._parseInt(data.subarray(2));
    const { d: s, l: rBytesLeft } = DER._parseInt(sBytes);
    if (rBytesLeft.length)
      throw new E("Invalid signature: left bytes after parsing");
    return { r, s };
  },
  hexFromSig(sig) {
    const slice2 = (s2) => Number.parseInt(s2[0], 16) & 8 ? "00" + s2 : s2;
    const h = (num) => {
      const hex5 = num.toString(16);
      return hex5.length & 1 ? `0${hex5}` : hex5;
    };
    const s = slice2(h(sig.s));
    const r = slice2(h(sig.r));
    const shl = s.length / 2;
    const rhl = r.length / 2;
    const sl = h(shl);
    const rl = h(rhl);
    return `30${h(rhl + shl + 4)}02${rl}${r}02${sl}${s}`;
  }
};
var _0n4 = BigInt(0);
var _1n4 = BigInt(1);
var _2n3 = BigInt(2);
var _3n2 = BigInt(3);
var _4n2 = BigInt(4);
function weierstrassPoints(opts) {
  const CURVE = validatePointOpts(opts);
  const { Fp: Fp3 } = CURVE;
  const toBytes8 = CURVE.toBytes || ((c, point, isCompressed) => {
    const a = point.toAffine();
    return concatBytes2(Uint8Array.from([4]), Fp3.toBytes(a.x), Fp3.toBytes(a.y));
  });
  const fromBytes = CURVE.fromBytes || ((bytes8) => {
    const tail = bytes8.subarray(1);
    const x = Fp3.fromBytes(tail.subarray(0, Fp3.BYTES));
    const y = Fp3.fromBytes(tail.subarray(Fp3.BYTES, 2 * Fp3.BYTES));
    return { x, y };
  });
  function weierstrassEquation(x) {
    const { a, b } = CURVE;
    const x2 = Fp3.sqr(x);
    const x3 = Fp3.mul(x2, x);
    return Fp3.add(Fp3.add(x3, Fp3.mul(x, a)), b);
  }
  if (!Fp3.eql(Fp3.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx)))
    throw new Error("bad generator point: equation left != right");
  function isWithinCurveOrder(num) {
    return typeof num === "bigint" && _0n4 < num && num < CURVE.n;
  }
  function assertGE(num) {
    if (!isWithinCurveOrder(num))
      throw new Error("Expected valid bigint: 0 < bigint < curve.n");
  }
  function normPrivateKeyToScalar(key) {
    const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n } = CURVE;
    if (lengths && typeof key !== "bigint") {
      if (key instanceof Uint8Array)
        key = bytesToHex(key);
      if (typeof key !== "string" || !lengths.includes(key.length))
        throw new Error("Invalid key");
      key = key.padStart(nByteLength * 2, "0");
    }
    let num;
    try {
      num = typeof key === "bigint" ? key : bytesToNumberBE(ensureBytes("private key", key, nByteLength));
    } catch (error) {
      throw new Error(`private key must be ${nByteLength} bytes, hex or bigint, not ${typeof key}`);
    }
    if (wrapPrivateKey)
      num = mod(num, n);
    assertGE(num);
    return num;
  }
  const pointPrecomputes = /* @__PURE__ */ new Map();
  function assertPrjPoint(other) {
    if (!(other instanceof Point4))
      throw new Error("ProjectivePoint expected");
  }
  class Point4 {
    constructor(px, py, pz) {
      this.px = px;
      this.py = py;
      this.pz = pz;
      if (px == null || !Fp3.isValid(px))
        throw new Error("x required");
      if (py == null || !Fp3.isValid(py))
        throw new Error("y required");
      if (pz == null || !Fp3.isValid(pz))
        throw new Error("z required");
    }
    // Does not validate if the point is on-curve.
    // Use fromHex instead, or call assertValidity() later.
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp3.isValid(x) || !Fp3.isValid(y))
        throw new Error("invalid affine point");
      if (p instanceof Point4)
        throw new Error("projective point not allowed");
      const is0 = (i2) => Fp3.eql(i2, Fp3.ZERO);
      if (is0(x) && is0(y))
        return Point4.ZERO;
      return new Point4(x, y, Fp3.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     * Takes a bunch of Projective Points but executes only one
     * inversion on all of them. Inversion is very slow operation,
     * so this improves performance massively.
     * Optimization: converts a list of projective points to a list of identical points with Z=1.
     */
    static normalizeZ(points) {
      const toInv = Fp3.invertBatch(points.map((p) => p.pz));
      return points.map((p, i2) => p.toAffine(toInv[i2])).map(Point4.fromAffine);
    }
    /**
     * Converts hash string or Uint8Array to Point.
     * @param hex short/long ECDSA hex
     */
    static fromHex(hex5) {
      const P = Point4.fromAffine(fromBytes(ensureBytes("pointHex", hex5)));
      P.assertValidity();
      return P;
    }
    // Multiplies generator point by privateKey.
    static fromPrivateKey(privateKey) {
      return Point4.BASE.multiply(normPrivateKeyToScalar(privateKey));
    }
    // "Private method", don't use it directly
    _setWindowSize(windowSize) {
      this._WINDOW_SIZE = windowSize;
      pointPrecomputes.delete(this);
    }
    // A point on curve is valid if it conforms to equation.
    assertValidity() {
      if (this.is0()) {
        if (CURVE.allowInfinityPoint)
          return;
        throw new Error("bad point: ZERO");
      }
      const { x, y } = this.toAffine();
      if (!Fp3.isValid(x) || !Fp3.isValid(y))
        throw new Error("bad point: x or y not FE");
      const left = Fp3.sqr(y);
      const right = weierstrassEquation(x);
      if (!Fp3.eql(left, right))
        throw new Error("bad point: equation left != right");
      if (!this.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (Fp3.isOdd)
        return !Fp3.isOdd(y);
      throw new Error("Field doesn't support isOdd");
    }
    /**
     * Compare one point to another.
     */
    equals(other) {
      assertPrjPoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      const U1 = Fp3.eql(Fp3.mul(X1, Z2), Fp3.mul(X2, Z1));
      const U2 = Fp3.eql(Fp3.mul(Y1, Z2), Fp3.mul(Y2, Z1));
      return U1 && U2;
    }
    /**
     * Flips point to one corresponding to (x, -y) in Affine coordinates.
     */
    negate() {
      return new Point4(this.px, Fp3.neg(this.py), this.pz);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a, b } = CURVE;
      const b3 = Fp3.mul(b, _3n2);
      const { px: X1, py: Y1, pz: Z1 } = this;
      let X3 = Fp3.ZERO, Y3 = Fp3.ZERO, Z3 = Fp3.ZERO;
      let t0 = Fp3.mul(X1, X1);
      let t1 = Fp3.mul(Y1, Y1);
      let t2 = Fp3.mul(Z1, Z1);
      let t3 = Fp3.mul(X1, Y1);
      t3 = Fp3.add(t3, t3);
      Z3 = Fp3.mul(X1, Z1);
      Z3 = Fp3.add(Z3, Z3);
      X3 = Fp3.mul(a, Z3);
      Y3 = Fp3.mul(b3, t2);
      Y3 = Fp3.add(X3, Y3);
      X3 = Fp3.sub(t1, Y3);
      Y3 = Fp3.add(t1, Y3);
      Y3 = Fp3.mul(X3, Y3);
      X3 = Fp3.mul(t3, X3);
      Z3 = Fp3.mul(b3, Z3);
      t2 = Fp3.mul(a, t2);
      t3 = Fp3.sub(t0, t2);
      t3 = Fp3.mul(a, t3);
      t3 = Fp3.add(t3, Z3);
      Z3 = Fp3.add(t0, t0);
      t0 = Fp3.add(Z3, t0);
      t0 = Fp3.add(t0, t2);
      t0 = Fp3.mul(t0, t3);
      Y3 = Fp3.add(Y3, t0);
      t2 = Fp3.mul(Y1, Z1);
      t2 = Fp3.add(t2, t2);
      t0 = Fp3.mul(t2, t3);
      X3 = Fp3.sub(X3, t0);
      Z3 = Fp3.mul(t2, t1);
      Z3 = Fp3.add(Z3, Z3);
      Z3 = Fp3.add(Z3, Z3);
      return new Point4(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      assertPrjPoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      let X3 = Fp3.ZERO, Y3 = Fp3.ZERO, Z3 = Fp3.ZERO;
      const a = CURVE.a;
      const b3 = Fp3.mul(CURVE.b, _3n2);
      let t0 = Fp3.mul(X1, X2);
      let t1 = Fp3.mul(Y1, Y2);
      let t2 = Fp3.mul(Z1, Z2);
      let t3 = Fp3.add(X1, Y1);
      let t4 = Fp3.add(X2, Y2);
      t3 = Fp3.mul(t3, t4);
      t4 = Fp3.add(t0, t1);
      t3 = Fp3.sub(t3, t4);
      t4 = Fp3.add(X1, Z1);
      let t5 = Fp3.add(X2, Z2);
      t4 = Fp3.mul(t4, t5);
      t5 = Fp3.add(t0, t2);
      t4 = Fp3.sub(t4, t5);
      t5 = Fp3.add(Y1, Z1);
      X3 = Fp3.add(Y2, Z2);
      t5 = Fp3.mul(t5, X3);
      X3 = Fp3.add(t1, t2);
      t5 = Fp3.sub(t5, X3);
      Z3 = Fp3.mul(a, t4);
      X3 = Fp3.mul(b3, t2);
      Z3 = Fp3.add(X3, Z3);
      X3 = Fp3.sub(t1, Z3);
      Z3 = Fp3.add(t1, Z3);
      Y3 = Fp3.mul(X3, Z3);
      t1 = Fp3.add(t0, t0);
      t1 = Fp3.add(t1, t0);
      t2 = Fp3.mul(a, t2);
      t4 = Fp3.mul(b3, t4);
      t1 = Fp3.add(t1, t2);
      t2 = Fp3.sub(t0, t2);
      t2 = Fp3.mul(a, t2);
      t4 = Fp3.add(t4, t2);
      t0 = Fp3.mul(t1, t4);
      Y3 = Fp3.add(Y3, t0);
      t0 = Fp3.mul(t5, t4);
      X3 = Fp3.mul(t3, X3);
      X3 = Fp3.sub(X3, t0);
      t0 = Fp3.mul(t3, t1);
      Z3 = Fp3.mul(t5, Z3);
      Z3 = Fp3.add(Z3, t0);
      return new Point4(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point4.ZERO);
    }
    wNAF(n) {
      return wnaf.wNAFCached(this, pointPrecomputes, n, (comp) => {
        const toInv = Fp3.invertBatch(comp.map((p) => p.pz));
        return comp.map((p, i2) => p.toAffine(toInv[i2])).map(Point4.fromAffine);
      });
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed private key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(n) {
      const I = Point4.ZERO;
      if (n === _0n4)
        return I;
      assertGE(n);
      if (n === _1n4)
        return this;
      const { endo } = CURVE;
      if (!endo)
        return wnaf.unsafeLadder(this, n);
      let { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
      let k1p = I;
      let k2p = I;
      let d = this;
      while (k1 > _0n4 || k2 > _0n4) {
        if (k1 & _1n4)
          k1p = k1p.add(d);
        if (k2 & _1n4)
          k2p = k2p.add(d);
        d = d.double();
        k1 >>= _1n4;
        k2 >>= _1n4;
      }
      if (k1neg)
        k1p = k1p.negate();
      if (k2neg)
        k2p = k2p.negate();
      k2p = new Point4(Fp3.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
      return k1p.add(k2p);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      assertGE(scalar);
      let n = scalar;
      let point, fake;
      const { endo } = CURVE;
      if (endo) {
        const { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
        let { p: k1p, f: f1p } = this.wNAF(k1);
        let { p: k2p, f: f2p } = this.wNAF(k2);
        k1p = wnaf.constTimeNegate(k1neg, k1p);
        k2p = wnaf.constTimeNegate(k2neg, k2p);
        k2p = new Point4(Fp3.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
        point = k1p.add(k2p);
        fake = f1p.add(f2p);
      } else {
        const { p, f: f2 } = this.wNAF(n);
        point = p;
        fake = f2;
      }
      return Point4.normalizeZ([point, fake])[0];
    }
    /**
     * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
     * Not using Strauss-Shamir trick: precomputation tables are faster.
     * The trick could be useful if both P and Q are not G (not in our case).
     * @returns non-zero affine point
     */
    multiplyAndAddUnsafe(Q, a, b) {
      const G = Point4.BASE;
      const mul = (P, a2) => a2 === _0n4 || a2 === _1n4 || !P.equals(G) ? P.multiplyUnsafe(a2) : P.multiply(a2);
      const sum = mul(this, a).add(mul(Q, b));
      return sum.is0() ? void 0 : sum;
    }
    // Converts Projective point to affine (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    // (x, y, z) ∋ (x=x/z, y=y/z)
    toAffine(iz) {
      const { px: x, py: y, pz: z } = this;
      const is0 = this.is0();
      if (iz == null)
        iz = is0 ? Fp3.ONE : Fp3.inv(z);
      const ax = Fp3.mul(x, iz);
      const ay = Fp3.mul(y, iz);
      const zz = Fp3.mul(z, iz);
      if (is0)
        return { x: Fp3.ZERO, y: Fp3.ZERO };
      if (!Fp3.eql(zz, Fp3.ONE))
        throw new Error("invZ was invalid");
      return { x: ax, y: ay };
    }
    isTorsionFree() {
      const { h: cofactor, isTorsionFree } = CURVE;
      if (cofactor === _1n4)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point4, this);
      throw new Error("isTorsionFree() has not been declared for the elliptic curve");
    }
    clearCofactor() {
      const { h: cofactor, clearCofactor } = CURVE;
      if (cofactor === _1n4)
        return this;
      if (clearCofactor)
        return clearCofactor(Point4, this);
      return this.multiplyUnsafe(CURVE.h);
    }
    toRawBytes(isCompressed = true) {
      this.assertValidity();
      return toBytes8(Point4, this, isCompressed);
    }
    toHex(isCompressed = true) {
      return bytesToHex(this.toRawBytes(isCompressed));
    }
  }
  Point4.BASE = new Point4(CURVE.Gx, CURVE.Gy, Fp3.ONE);
  Point4.ZERO = new Point4(Fp3.ZERO, Fp3.ONE, Fp3.ZERO);
  const _bits = CURVE.nBitLength;
  const wnaf = wNAF(Point4, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
  return {
    CURVE,
    ProjectivePoint: Point4,
    normPrivateKeyToScalar,
    weierstrassEquation,
    isWithinCurveOrder
  };
}
function validateOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    hash: "hash",
    hmac: "function",
    randomBytes: "function"
  }, {
    bits2int: "function",
    bits2int_modN: "function",
    lowS: "boolean"
  });
  return Object.freeze({ lowS: true, ...opts });
}
function weierstrass(curveDef) {
  const CURVE = validateOpts(curveDef);
  const { Fp: Fp3, n: CURVE_ORDER } = CURVE;
  const compressedLen = Fp3.BYTES + 1;
  const uncompressedLen = 2 * Fp3.BYTES + 1;
  function isValidFieldElement(num) {
    return _0n4 < num && num < Fp3.ORDER;
  }
  function modN3(a) {
    return mod(a, CURVE_ORDER);
  }
  function invN(a) {
    return invert(a, CURVE_ORDER);
  }
  const { ProjectivePoint: Point4, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
    ...CURVE,
    toBytes(c, point, isCompressed) {
      const a = point.toAffine();
      const x = Fp3.toBytes(a.x);
      const cat = concatBytes2;
      if (isCompressed) {
        return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
      } else {
        return cat(Uint8Array.from([4]), x, Fp3.toBytes(a.y));
      }
    },
    fromBytes(bytes8) {
      const len = bytes8.length;
      const head = bytes8[0];
      const tail = bytes8.subarray(1);
      if (len === compressedLen && (head === 2 || head === 3)) {
        const x = bytesToNumberBE(tail);
        if (!isValidFieldElement(x))
          throw new Error("Point is not on curve");
        const y2 = weierstrassEquation(x);
        let y = Fp3.sqrt(y2);
        const isYOdd = (y & _1n4) === _1n4;
        const isHeadOdd = (head & 1) === 1;
        if (isHeadOdd !== isYOdd)
          y = Fp3.neg(y);
        return { x, y };
      } else if (len === uncompressedLen && head === 4) {
        const x = Fp3.fromBytes(tail.subarray(0, Fp3.BYTES));
        const y = Fp3.fromBytes(tail.subarray(Fp3.BYTES, 2 * Fp3.BYTES));
        return { x, y };
      } else {
        throw new Error(`Point of length ${len} was invalid. Expected ${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes`);
      }
    }
  });
  const numToNByteStr = (num) => bytesToHex(numberToBytesBE(num, CURVE.nByteLength));
  function isBiggerThanHalfOrder(number8) {
    const HALF = CURVE_ORDER >> _1n4;
    return number8 > HALF;
  }
  function normalizeS(s) {
    return isBiggerThanHalfOrder(s) ? modN3(-s) : s;
  }
  const slcNum = (b, from, to) => bytesToNumberBE(b.slice(from, to));
  class Signature {
    constructor(r, s, recovery) {
      this.r = r;
      this.s = s;
      this.recovery = recovery;
      this.assertValidity();
    }
    // pair (bytes of r, bytes of s)
    static fromCompact(hex5) {
      const l = CURVE.nByteLength;
      hex5 = ensureBytes("compactSignature", hex5, l * 2);
      return new Signature(slcNum(hex5, 0, l), slcNum(hex5, l, 2 * l));
    }
    // DER encoded ECDSA signature
    // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
    static fromDER(hex5) {
      const { r, s } = DER.toSig(ensureBytes("DER", hex5));
      return new Signature(r, s);
    }
    assertValidity() {
      if (!isWithinCurveOrder(this.r))
        throw new Error("r must be 0 < r < CURVE.n");
      if (!isWithinCurveOrder(this.s))
        throw new Error("s must be 0 < s < CURVE.n");
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    recoverPublicKey(msgHash) {
      const { r, s, recovery: rec } = this;
      const h = bits2int_modN(ensureBytes("msgHash", msgHash));
      if (rec == null || ![0, 1, 2, 3].includes(rec))
        throw new Error("recovery id invalid");
      const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
      if (radj >= Fp3.ORDER)
        throw new Error("recovery id 2 or 3 invalid");
      const prefix = (rec & 1) === 0 ? "02" : "03";
      const R = Point4.fromHex(prefix + numToNByteStr(radj));
      const ir = invN(radj);
      const u1 = modN3(-h * ir);
      const u2 = modN3(s * ir);
      const Q = Point4.BASE.multiplyAndAddUnsafe(R, u1, u2);
      if (!Q)
        throw new Error("point at infinify");
      Q.assertValidity();
      return Q;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new Signature(this.r, modN3(-this.s), this.recovery) : this;
    }
    // DER-encoded
    toDERRawBytes() {
      return hexToBytes(this.toDERHex());
    }
    toDERHex() {
      return DER.hexFromSig({ r: this.r, s: this.s });
    }
    // padded bytes of r, then padded bytes of s
    toCompactRawBytes() {
      return hexToBytes(this.toCompactHex());
    }
    toCompactHex() {
      return numToNByteStr(this.r) + numToNByteStr(this.s);
    }
  }
  const utils4 = {
    isValidPrivateKey(privateKey) {
      try {
        normPrivateKeyToScalar(privateKey);
        return true;
      } catch (error) {
        return false;
      }
    },
    normPrivateKeyToScalar,
    /**
     * Produces cryptographically secure private key from random of size (nBitLength+64)
     * as per FIPS 186 B.4.1 with modulo bias being neglible.
     */
    randomPrivateKey: () => {
      const rand = CURVE.randomBytes(Fp3.BYTES + 8);
      const num = hashToPrivateScalar(rand, CURVE_ORDER);
      return numberToBytesBE(num, CURVE.nByteLength);
    },
    /**
     * Creates precompute table for an arbitrary EC point. Makes point "cached".
     * Allows to massively speed-up `point.multiply(scalar)`.
     * @returns cached point
     * @example
     * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
     * fast.multiply(privKey); // much faster ECDH now
     */
    precompute(windowSize = 8, point = Point4.BASE) {
      point._setWindowSize(windowSize);
      point.multiply(BigInt(3));
      return point;
    }
  };
  function getPublicKey4(privateKey, isCompressed = true) {
    return Point4.fromPrivateKey(privateKey).toRawBytes(isCompressed);
  }
  function isProbPub(item) {
    const arr = item instanceof Uint8Array;
    const str = typeof item === "string";
    const len = (arr || str) && item.length;
    if (arr)
      return len === compressedLen || len === uncompressedLen;
    if (str)
      return len === 2 * compressedLen || len === 2 * uncompressedLen;
    if (item instanceof Point4)
      return true;
    return false;
  }
  function getSharedSecret(privateA, publicB, isCompressed = true) {
    if (isProbPub(privateA))
      throw new Error("first arg must be private key");
    if (!isProbPub(publicB))
      throw new Error("second arg must be public key");
    const b = Point4.fromHex(publicB);
    return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
  }
  const bits2int = CURVE.bits2int || function(bytes8) {
    const num = bytesToNumberBE(bytes8);
    const delta = bytes8.length * 8 - CURVE.nBitLength;
    return delta > 0 ? num >> BigInt(delta) : num;
  };
  const bits2int_modN = CURVE.bits2int_modN || function(bytes8) {
    return modN3(bits2int(bytes8));
  };
  const ORDER_MASK = bitMask(CURVE.nBitLength);
  function int2octets(num) {
    if (typeof num !== "bigint")
      throw new Error("bigint expected");
    if (!(_0n4 <= num && num < ORDER_MASK))
      throw new Error(`bigint expected < 2^${CURVE.nBitLength}`);
    return numberToBytesBE(num, CURVE.nByteLength);
  }
  function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
    if (["recovered", "canonical"].some((k) => k in opts))
      throw new Error("sign() legacy options not supported");
    const { hash: hash8, randomBytes: randomBytes7 } = CURVE;
    let { lowS, prehash, extraEntropy: ent } = opts;
    if (lowS == null)
      lowS = true;
    msgHash = ensureBytes("msgHash", msgHash);
    if (prehash)
      msgHash = ensureBytes("prehashed msgHash", hash8(msgHash));
    const h1int = bits2int_modN(msgHash);
    const d = normPrivateKeyToScalar(privateKey);
    const seedArgs = [int2octets(d), int2octets(h1int)];
    if (ent != null) {
      const e = ent === true ? randomBytes7(Fp3.BYTES) : ent;
      seedArgs.push(ensureBytes("extraEntropy", e, Fp3.BYTES));
    }
    const seed = concatBytes2(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!isWithinCurveOrder(k))
        return;
      const ik = invN(k);
      const q = Point4.BASE.multiply(k).toAffine();
      const r = modN3(q.x);
      if (r === _0n4)
        return;
      const s = modN3(ik * modN3(m + r * d));
      if (s === _0n4)
        return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n4);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = normalizeS(s);
        recovery ^= 1;
      }
      return new Signature(r, normS, recovery);
    }
    return { seed, k2sig };
  }
  const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
  const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
  function sign(msgHash, privKey, opts = defaultSigOpts) {
    const { seed, k2sig } = prepSig(msgHash, privKey, opts);
    const C = CURVE;
    const drbg = createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac);
    return drbg(seed, k2sig);
  }
  Point4.BASE._setWindowSize(8);
  function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
    var _a2;
    const sg = signature;
    msgHash = ensureBytes("msgHash", msgHash);
    publicKey = ensureBytes("publicKey", publicKey);
    if ("strict" in opts)
      throw new Error("options.strict was renamed to lowS");
    const { lowS, prehash } = opts;
    let _sig = void 0;
    let P;
    try {
      if (typeof sg === "string" || sg instanceof Uint8Array) {
        try {
          _sig = Signature.fromDER(sg);
        } catch (derError) {
          if (!(derError instanceof DER.Err))
            throw derError;
          _sig = Signature.fromCompact(sg);
        }
      } else if (typeof sg === "object" && typeof sg.r === "bigint" && typeof sg.s === "bigint") {
        const { r: r2, s: s2 } = sg;
        _sig = new Signature(r2, s2);
      } else {
        throw new Error("PARSE");
      }
      P = Point4.fromHex(publicKey);
    } catch (error) {
      if (error.message === "PARSE")
        throw new Error(`signature must be Signature instance, Uint8Array or hex string`);
      return false;
    }
    if (lowS && _sig.hasHighS())
      return false;
    if (prehash)
      msgHash = CURVE.hash(msgHash);
    const { r, s } = _sig;
    const h = bits2int_modN(msgHash);
    const is = invN(s);
    const u1 = modN3(h * is);
    const u2 = modN3(r * is);
    const R = (_a2 = Point4.BASE.multiplyAndAddUnsafe(P, u1, u2)) == null ? void 0 : _a2.toAffine();
    if (!R)
      return false;
    const v = modN3(R.x);
    return v === r;
  }
  return {
    CURVE,
    getPublicKey: getPublicKey4,
    getSharedSecret,
    sign,
    verify,
    ProjectivePoint: Point4,
    Signature,
    utils: utils4
  };
}

// node_modules/@noble/curves/node_modules/@noble/hashes/esm/hmac.js
var HMAC = class extends Hash {
  constructor(hash8, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    assert_default.hash(hash8);
    const key = toBytes(_key);
    this.iHash = hash8.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad2 = new Uint8Array(blockLen);
    pad2.set(key.length > blockLen ? hash8.create().update(key).digest() : key);
    for (let i2 = 0; i2 < pad2.length; i2++)
      pad2[i2] ^= 54;
    this.iHash.update(pad2);
    this.oHash = hash8.create();
    for (let i2 = 0; i2 < pad2.length; i2++)
      pad2[i2] ^= 54 ^ 92;
    this.oHash.update(pad2);
    pad2.fill(0);
  }
  update(buf) {
    assert_default.exists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    assert_default.exists(this);
    assert_default.bytes(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac = (hash8, key, message) => new HMAC(hash8, key).update(message).digest();
hmac.create = (hash8, key) => new HMAC(hash8, key);

// node_modules/@noble/curves/esm/_shortw_utils.js
function getHash(hash8) {
  return {
    hash: hash8,
    hmac: (key, ...msgs) => hmac(hash8, key, concatBytes(...msgs)),
    randomBytes
  };
}
function createCurve(curveDef, defHash) {
  const create = (hash8) => weierstrass({ ...curveDef, ...getHash(hash8) });
  return Object.freeze({ ...create(defHash), create });
}

// node_modules/@noble/curves/esm/secp256k1.js
var secp256k1P = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
var secp256k1N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
var _1n5 = BigInt(1);
var _2n4 = BigInt(2);
var divNearest = (a, b) => (a + b / _2n4) / b;
function sqrtMod(y) {
  const P = secp256k1P;
  const _3n5 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y * y * y % P;
  const b3 = b2 * b2 * y % P;
  const b6 = pow2(b3, _3n5, P) * b3 % P;
  const b9 = pow2(b6, _3n5, P) * b3 % P;
  const b11 = pow2(b9, _2n4, P) * b2 % P;
  const b22 = pow2(b11, _11n, P) * b11 % P;
  const b44 = pow2(b22, _22n, P) * b22 % P;
  const b88 = pow2(b44, _44n, P) * b44 % P;
  const b176 = pow2(b88, _88n, P) * b88 % P;
  const b220 = pow2(b176, _44n, P) * b44 % P;
  const b223 = pow2(b220, _3n5, P) * b3 % P;
  const t1 = pow2(b223, _23n, P) * b22 % P;
  const t2 = pow2(t1, _6n, P) * b2 % P;
  const root = pow2(t2, _2n4, P);
  if (!Fp.eql(Fp.sqr(root), y))
    throw new Error("Cannot find square root");
  return root;
}
var Fp = Field(secp256k1P, void 0, void 0, { sqrt: sqrtMod });
var secp256k1 = createCurve({
  a: BigInt(0),
  b: BigInt(7),
  Fp,
  n: secp256k1N,
  // Base point (x, y) aka generator point
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  h: BigInt(1),
  lowS: true,
  /**
   * secp256k1 belongs to Koblitz curves: it has efficiently computable endomorphism.
   * Endomorphism uses 2x less RAM, speeds up precomputation by 2x and ECDH / key recovery by 20%.
   * For precomputed wNAF it trades off 1/2 init time & 1/3 ram for 20% perf hit.
   * Explanation: https://gist.github.com/paulmillr/eb670806793e84df628a7c434a873066
   */
  endo: {
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
    splitScalar: (k) => {
      const n = secp256k1N;
      const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
      const b1 = -_1n5 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
      const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
      const b2 = a1;
      const POW_2_128 = BigInt("0x100000000000000000000000000000000");
      const c1 = divNearest(b2 * k, n);
      const c2 = divNearest(-b1 * k, n);
      let k1 = mod(k - c1 * a1 - c2 * a2, n);
      let k2 = mod(-c1 * b1 - c2 * b2, n);
      const k1neg = k1 > POW_2_128;
      const k2neg = k2 > POW_2_128;
      if (k1neg)
        k1 = n - k1;
      if (k2neg)
        k2 = n - k2;
      if (k1 > POW_2_128 || k2 > POW_2_128) {
        throw new Error("splitScalar: Endomorphism failed, k=" + k);
      }
      return { k1neg, k1, k2neg, k2 };
    }
  }
}, sha256);
var _0n5 = BigInt(0);
var fe = (x) => typeof x === "bigint" && _0n5 < x && x < secp256k1P;
var ge = (x) => typeof x === "bigint" && _0n5 < x && x < secp256k1N;
var TAGGED_HASH_PREFIXES = {};
function taggedHash(tag, ...messages) {
  let tagP = TAGGED_HASH_PREFIXES[tag];
  if (tagP === void 0) {
    const tagH = sha256(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
    tagP = concatBytes2(tagH, tagH);
    TAGGED_HASH_PREFIXES[tag] = tagP;
  }
  return sha256(concatBytes2(tagP, ...messages));
}
var pointToBytes = (point) => point.toRawBytes(true).slice(1);
var numTo32b = (n) => numberToBytesBE(n, 32);
var modP = (x) => mod(x, secp256k1P);
var modN = (x) => mod(x, secp256k1N);
var Point = secp256k1.ProjectivePoint;
var GmulAdd = (Q, a, b) => Point.BASE.multiplyAndAddUnsafe(Q, a, b);
function schnorrGetExtPubKey(priv) {
  let d_ = secp256k1.utils.normPrivateKeyToScalar(priv);
  let p = Point.fromPrivateKey(d_);
  const scalar = p.hasEvenY() ? d_ : modN(-d_);
  return { scalar, bytes: pointToBytes(p) };
}
function lift_x(x) {
  if (!fe(x))
    throw new Error("bad x: need 0 < x < p");
  const xx = modP(x * x);
  const c = modP(xx * x + BigInt(7));
  let y = sqrtMod(c);
  if (y % _2n4 !== _0n5)
    y = modP(-y);
  const p = new Point(x, y, _1n5);
  p.assertValidity();
  return p;
}
function challenge(...args) {
  return modN(bytesToNumberBE(taggedHash("BIP0340/challenge", ...args)));
}
function schnorrGetPublicKey(privateKey) {
  return schnorrGetExtPubKey(privateKey).bytes;
}
function schnorrSign(message, privateKey, auxRand = randomBytes(32)) {
  const m = ensureBytes("message", message);
  const { bytes: px, scalar: d } = schnorrGetExtPubKey(privateKey);
  const a = ensureBytes("auxRand", auxRand, 32);
  const t = numTo32b(d ^ bytesToNumberBE(taggedHash("BIP0340/aux", a)));
  const rand = taggedHash("BIP0340/nonce", t, px, m);
  const k_ = modN(bytesToNumberBE(rand));
  if (k_ === _0n5)
    throw new Error("sign failed: k is zero");
  const { bytes: rx, scalar: k } = schnorrGetExtPubKey(k_);
  const e = challenge(rx, px, m);
  const sig = new Uint8Array(64);
  sig.set(rx, 0);
  sig.set(numTo32b(modN(k + e * d)), 32);
  if (!schnorrVerify(sig, m, px))
    throw new Error("sign: Invalid signature produced");
  return sig;
}
function schnorrVerify(signature, message, publicKey) {
  const sig = ensureBytes("signature", signature, 64);
  const m = ensureBytes("message", message);
  const pub = ensureBytes("publicKey", publicKey, 32);
  try {
    const P = lift_x(bytesToNumberBE(pub));
    const r = bytesToNumberBE(sig.subarray(0, 32));
    if (!fe(r))
      return false;
    const s = bytesToNumberBE(sig.subarray(32, 64));
    if (!ge(s))
      return false;
    const e = challenge(numTo32b(r), pointToBytes(P), m);
    const R = GmulAdd(P, s, modN(-e));
    if (!R || !R.hasEvenY() || R.toAffine().x !== r)
      return false;
    return true;
  } catch (error) {
    return false;
  }
}
var schnorr = /* @__PURE__ */ (() => ({
  getPublicKey: schnorrGetPublicKey,
  sign: schnorrSign,
  verify: schnorrVerify,
  utils: {
    randomPrivateKey: secp256k1.utils.randomPrivateKey,
    lift_x,
    pointToBytes,
    numberToBytesBE,
    bytesToNumberBE,
    taggedHash,
    mod
  }
}))();

// node_modules/@nostr-dev-kit/ndk/node_modules/@noble/hashes/esm/cryptoNode.js
var nc2 = __toESM(require("crypto"), 1);
var crypto3 = nc2 && typeof nc2 === "object" && "webcrypto" in nc2 ? nc2.webcrypto : void 0;

// node_modules/@nostr-dev-kit/ndk/node_modules/@noble/hashes/esm/utils.js
var u8a3 = (a) => a instanceof Uint8Array;
var createView2 = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
var rotr2 = (word, shift) => word << 32 - shift | word >>> shift;
var isLE2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!isLE2)
  throw new Error("Non little-endian hardware is not supported");
var hexes3 = Array.from({ length: 256 }, (v, i2) => i2.toString(16).padStart(2, "0"));
function bytesToHex2(bytes8) {
  if (!u8a3(bytes8))
    throw new Error("Uint8Array expected");
  let hex5 = "";
  for (let i2 = 0; i2 < bytes8.length; i2++) {
    hex5 += hexes3[bytes8[i2]];
  }
  return hex5;
}
function hexToBytes2(hex5) {
  if (typeof hex5 !== "string")
    throw new Error("hex string expected, got " + typeof hex5);
  const len = hex5.length;
  if (len % 2)
    throw new Error("padded hex string expected, got unpadded hex of length " + len);
  const array = new Uint8Array(len / 2);
  for (let i2 = 0; i2 < array.length; i2++) {
    const j = i2 * 2;
    const hexByte = hex5.slice(j, j + 2);
    const byte = Number.parseInt(hexByte, 16);
    if (Number.isNaN(byte) || byte < 0)
      throw new Error("Invalid byte sequence");
    array[i2] = byte;
  }
  return array;
}
function utf8ToBytes3(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes2(data) {
  if (typeof data === "string")
    data = utf8ToBytes3(data);
  if (!u8a3(data))
    throw new Error(`expected Uint8Array, got ${typeof data}`);
  return data;
}
function concatBytes3(...arrays) {
  const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
  let pad2 = 0;
  arrays.forEach((a) => {
    if (!u8a3(a))
      throw new Error("Uint8Array expected");
    r.set(a, pad2);
    pad2 += a.length;
  });
  return r;
}
var Hash2 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function wrapConstructor2(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes2(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function randomBytes2(bytesLength = 32) {
  if (crypto3 && typeof crypto3.getRandomValues === "function") {
    return crypto3.getRandomValues(new Uint8Array(bytesLength));
  }
  throw new Error("crypto.getRandomValues must be defined");
}

// node_modules/@nostr-dev-kit/ndk/node_modules/@noble/hashes/esm/_assert.js
function number2(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error(`Wrong positive integer: ${n}`);
}
function bool2(b) {
  if (typeof b !== "boolean")
    throw new Error(`Expected boolean, not ${b}`);
}
function bytes2(b, ...lengths) {
  if (!(b instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
function hash2(hash8) {
  if (typeof hash8 !== "function" || typeof hash8.create !== "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  number2(hash8.outputLen);
  number2(hash8.blockLen);
}
function exists2(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function output2(out, instance) {
  bytes2(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error(`digestInto() expects output buffer of length at least ${min}`);
  }
}
var assert2 = {
  number: number2,
  bool: bool2,
  bytes: bytes2,
  hash: hash2,
  exists: exists2,
  output: output2
};
var assert_default2 = assert2;

// node_modules/@nostr-dev-kit/ndk/node_modules/@noble/hashes/esm/_sha2.js
function setBigUint642(view, byteOffset, value, isLE8) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE8);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE8 ? 4 : 0;
  const l = isLE8 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE8);
  view.setUint32(byteOffset + l, wl, isLE8);
}
var SHA22 = class extends Hash2 {
  constructor(blockLen, outputLen, padOffset, isLE8) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE8;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView2(this.buffer);
  }
  update(data) {
    assert_default2.exists(this);
    const { view, buffer, blockLen } = this;
    data = toBytes2(data);
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView2(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    assert_default2.exists(this);
    assert_default2.output(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE8 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    this.buffer.subarray(pos).fill(0);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i2 = pos; i2 < blockLen; i2++)
      buffer[i2] = 0;
    setBigUint642(view, blockLen - 8, BigInt(this.length * 8), isLE8);
    this.process(view, 0);
    const oview = createView2(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i2 = 0; i2 < outLen; i2++)
      oview.setUint32(4 * i2, state[i2], isLE8);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.length = length;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
};

// node_modules/@nostr-dev-kit/ndk/node_modules/@noble/hashes/esm/sha256.js
var Chi2 = (a, b, c) => a & b ^ ~a & c;
var Maj2 = (a, b, c) => a & b ^ a & c ^ b & c;
var SHA256_K2 = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var IV2 = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA256_W2 = new Uint32Array(64);
var SHA2562 = class extends SHA22 {
  constructor() {
    super(64, 32, 8, false);
    this.A = IV2[0] | 0;
    this.B = IV2[1] | 0;
    this.C = IV2[2] | 0;
    this.D = IV2[3] | 0;
    this.E = IV2[4] | 0;
    this.F = IV2[5] | 0;
    this.G = IV2[6] | 0;
    this.H = IV2[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4)
      SHA256_W2[i2] = view.getUint32(offset, false);
    for (let i2 = 16; i2 < 64; i2++) {
      const W15 = SHA256_W2[i2 - 15];
      const W2 = SHA256_W2[i2 - 2];
      const s0 = rotr2(W15, 7) ^ rotr2(W15, 18) ^ W15 >>> 3;
      const s1 = rotr2(W2, 17) ^ rotr2(W2, 19) ^ W2 >>> 10;
      SHA256_W2[i2] = s1 + SHA256_W2[i2 - 7] + s0 + SHA256_W2[i2 - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i2 = 0; i2 < 64; i2++) {
      const sigma1 = rotr2(E, 6) ^ rotr2(E, 11) ^ rotr2(E, 25);
      const T1 = H + sigma1 + Chi2(E, F, G) + SHA256_K2[i2] + SHA256_W2[i2] | 0;
      const sigma0 = rotr2(A, 2) ^ rotr2(A, 13) ^ rotr2(A, 22);
      const T2 = sigma0 + Maj2(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    SHA256_W2.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
};
var SHA2242 = class extends SHA2562 {
  constructor() {
    super();
    this.A = 3238371032 | 0;
    this.B = 914150663 | 0;
    this.C = 812702999 | 0;
    this.D = 4144912697 | 0;
    this.E = 4290775857 | 0;
    this.F = 1750603025 | 0;
    this.G = 1694076839 | 0;
    this.H = 3204075428 | 0;
    this.outputLen = 28;
  }
};
var sha2562 = wrapConstructor2(() => new SHA2562());
var sha2242 = wrapConstructor2(() => new SHA2242());

// node_modules/@nostr-dev-kit/ndk/node_modules/@scure/base/lib/esm/index.js
function assertNumber(n) {
  if (!Number.isSafeInteger(n))
    throw new Error(`Wrong integer: ${n}`);
}
function chain(...args) {
  const wrap2 = (a, b) => (c) => a(b(c));
  const encode2 = Array.from(args).reverse().reduce((acc, i2) => acc ? wrap2(acc, i2.encode) : i2.encode, void 0);
  const decode5 = args.reduce((acc, i2) => acc ? wrap2(acc, i2.decode) : i2.decode, void 0);
  return { encode: encode2, decode: decode5 };
}
function alphabet(alphabet5) {
  return {
    encode: (digits) => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
        throw new Error("alphabet.encode input should be an array of numbers");
      return digits.map((i2) => {
        assertNumber(i2);
        if (i2 < 0 || i2 >= alphabet5.length)
          throw new Error(`Digit index outside alphabet: ${i2} (alphabet: ${alphabet5.length})`);
        return alphabet5[i2];
      });
    },
    decode: (input) => {
      if (!Array.isArray(input) || input.length && typeof input[0] !== "string")
        throw new Error("alphabet.decode input should be array of strings");
      return input.map((letter) => {
        if (typeof letter !== "string")
          throw new Error(`alphabet.decode: not string element=${letter}`);
        const index = alphabet5.indexOf(letter);
        if (index === -1)
          throw new Error(`Unknown letter: "${letter}". Allowed: ${alphabet5}`);
        return index;
      });
    }
  };
}
function join(separator = "") {
  if (typeof separator !== "string")
    throw new Error("join separator should be string");
  return {
    encode: (from) => {
      if (!Array.isArray(from) || from.length && typeof from[0] !== "string")
        throw new Error("join.encode input should be array of strings");
      for (let i2 of from)
        if (typeof i2 !== "string")
          throw new Error(`join.encode: non-string input=${i2}`);
      return from.join(separator);
    },
    decode: (to) => {
      if (typeof to !== "string")
        throw new Error("join.decode input should be string");
      return to.split(separator);
    }
  };
}
function padding(bits, chr = "=") {
  assertNumber(bits);
  if (typeof chr !== "string")
    throw new Error("padding chr should be string");
  return {
    encode(data) {
      if (!Array.isArray(data) || data.length && typeof data[0] !== "string")
        throw new Error("padding.encode input should be array of strings");
      for (let i2 of data)
        if (typeof i2 !== "string")
          throw new Error(`padding.encode: non-string input=${i2}`);
      while (data.length * bits % 8)
        data.push(chr);
      return data;
    },
    decode(input) {
      if (!Array.isArray(input) || input.length && typeof input[0] !== "string")
        throw new Error("padding.encode input should be array of strings");
      for (let i2 of input)
        if (typeof i2 !== "string")
          throw new Error(`padding.decode: non-string input=${i2}`);
      let end = input.length;
      if (end * bits % 8)
        throw new Error("Invalid padding: string should have whole number of bytes");
      for (; end > 0 && input[end - 1] === chr; end--) {
        if (!((end - 1) * bits % 8))
          throw new Error("Invalid padding: string has too much padding");
      }
      return input.slice(0, end);
    }
  };
}
function normalize(fn) {
  if (typeof fn !== "function")
    throw new Error("normalize fn should be function");
  return { encode: (from) => from, decode: (to) => fn(to) };
}
function convertRadix(data, from, to) {
  if (from < 2)
    throw new Error(`convertRadix: wrong from=${from}, base cannot be less than 2`);
  if (to < 2)
    throw new Error(`convertRadix: wrong to=${to}, base cannot be less than 2`);
  if (!Array.isArray(data))
    throw new Error("convertRadix: data should be array");
  if (!data.length)
    return [];
  let pos = 0;
  const res = [];
  const digits = Array.from(data);
  digits.forEach((d) => {
    assertNumber(d);
    if (d < 0 || d >= from)
      throw new Error(`Wrong integer: ${d}`);
  });
  while (true) {
    let carry = 0;
    let done = true;
    for (let i2 = pos; i2 < digits.length; i2++) {
      const digit = digits[i2];
      const digitBase = from * carry + digit;
      if (!Number.isSafeInteger(digitBase) || from * carry / from !== carry || digitBase - digit !== from * carry) {
        throw new Error("convertRadix: carry overflow");
      }
      carry = digitBase % to;
      digits[i2] = Math.floor(digitBase / to);
      if (!Number.isSafeInteger(digits[i2]) || digits[i2] * to + carry !== digitBase)
        throw new Error("convertRadix: carry overflow");
      if (!done)
        continue;
      else if (!digits[i2])
        pos = i2;
      else
        done = false;
    }
    res.push(carry);
    if (done)
      break;
  }
  for (let i2 = 0; i2 < data.length - 1 && data[i2] === 0; i2++)
    res.push(0);
  return res.reverse();
}
var gcd = (a, b) => !b ? a : gcd(b, a % b);
var radix2carry = (from, to) => from + (to - gcd(from, to));
function convertRadix2(data, from, to, padding5) {
  if (!Array.isArray(data))
    throw new Error("convertRadix2: data should be array");
  if (from <= 0 || from > 32)
    throw new Error(`convertRadix2: wrong from=${from}`);
  if (to <= 0 || to > 32)
    throw new Error(`convertRadix2: wrong to=${to}`);
  if (radix2carry(from, to) > 32) {
    throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${radix2carry(from, to)}`);
  }
  let carry = 0;
  let pos = 0;
  const mask = 2 ** to - 1;
  const res = [];
  for (const n of data) {
    assertNumber(n);
    if (n >= 2 ** from)
      throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
    carry = carry << from | n;
    if (pos + from > 32)
      throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
    pos += from;
    for (; pos >= to; pos -= to)
      res.push((carry >> pos - to & mask) >>> 0);
    carry &= 2 ** pos - 1;
  }
  carry = carry << to - pos & mask;
  if (!padding5 && pos >= from)
    throw new Error("Excess padding");
  if (!padding5 && carry)
    throw new Error(`Non-zero padding: ${carry}`);
  if (padding5 && pos > 0)
    res.push(carry >>> 0);
  return res;
}
function radix(num) {
  assertNumber(num);
  return {
    encode: (bytes8) => {
      if (!(bytes8 instanceof Uint8Array))
        throw new Error("radix.encode input should be Uint8Array");
      return convertRadix(Array.from(bytes8), 2 ** 8, num);
    },
    decode: (digits) => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
        throw new Error("radix.decode input should be array of strings");
      return Uint8Array.from(convertRadix(digits, num, 2 ** 8));
    }
  };
}
function radix2(bits, revPadding = false) {
  assertNumber(bits);
  if (bits <= 0 || bits > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (radix2carry(8, bits) > 32 || radix2carry(bits, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (bytes8) => {
      if (!(bytes8 instanceof Uint8Array))
        throw new Error("radix2.encode input should be Uint8Array");
      return convertRadix2(Array.from(bytes8), 8, bits, !revPadding);
    },
    decode: (digits) => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
        throw new Error("radix2.decode input should be array of strings");
      return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
    }
  };
}
function unsafeWrapper(fn) {
  if (typeof fn !== "function")
    throw new Error("unsafeWrapper fn should be function");
  return function(...args) {
    try {
      return fn.apply(null, args);
    } catch (e) {
    }
  };
}
var base16 = chain(radix2(4), alphabet("0123456789ABCDEF"), join(""));
var base32 = chain(radix2(5), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), padding(5), join(""));
var base32hex = chain(radix2(5), alphabet("0123456789ABCDEFGHIJKLMNOPQRSTUV"), padding(5), join(""));
var base32crockford = chain(radix2(5), alphabet("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), join(""), normalize((s) => s.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
var base64 = chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), padding(6), join(""));
var base64url = chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), padding(6), join(""));
var genBase58 = (abc) => chain(radix(58), alphabet(abc), join(""));
var base58 = genBase58("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
var base58flickr = genBase58("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ");
var base58xrp = genBase58("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
var XMR_BLOCK_LEN = [0, 2, 3, 5, 6, 7, 9, 10, 11];
var base58xmr = {
  encode(data) {
    let res = "";
    for (let i2 = 0; i2 < data.length; i2 += 8) {
      const block = data.subarray(i2, i2 + 8);
      res += base58.encode(block).padStart(XMR_BLOCK_LEN[block.length], "1");
    }
    return res;
  },
  decode(str) {
    let res = [];
    for (let i2 = 0; i2 < str.length; i2 += 11) {
      const slice2 = str.slice(i2, i2 + 11);
      const blockLen = XMR_BLOCK_LEN.indexOf(slice2.length);
      const block = base58.decode(slice2);
      for (let j = 0; j < block.length - blockLen; j++) {
        if (block[j] !== 0)
          throw new Error("base58xmr: wrong padding");
      }
      res = res.concat(Array.from(block.slice(block.length - blockLen)));
    }
    return Uint8Array.from(res);
  }
};
var BECH_ALPHABET = chain(alphabet("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), join(""));
var POLYMOD_GENERATORS = [996825010, 642813549, 513874426, 1027748829, 705979059];
function bech32Polymod(pre) {
  const b = pre >> 25;
  let chk = (pre & 33554431) << 5;
  for (let i2 = 0; i2 < POLYMOD_GENERATORS.length; i2++) {
    if ((b >> i2 & 1) === 1)
      chk ^= POLYMOD_GENERATORS[i2];
  }
  return chk;
}
function bechChecksum(prefix, words, encodingConst = 1) {
  const len = prefix.length;
  let chk = 1;
  for (let i2 = 0; i2 < len; i2++) {
    const c = prefix.charCodeAt(i2);
    if (c < 33 || c > 126)
      throw new Error(`Invalid prefix (${prefix})`);
    chk = bech32Polymod(chk) ^ c >> 5;
  }
  chk = bech32Polymod(chk);
  for (let i2 = 0; i2 < len; i2++)
    chk = bech32Polymod(chk) ^ prefix.charCodeAt(i2) & 31;
  for (let v of words)
    chk = bech32Polymod(chk) ^ v;
  for (let i2 = 0; i2 < 6; i2++)
    chk = bech32Polymod(chk);
  chk ^= encodingConst;
  return BECH_ALPHABET.encode(convertRadix2([chk % 2 ** 30], 30, 5, false));
}
function genBech32(encoding) {
  const ENCODING_CONST = encoding === "bech32" ? 1 : 734539939;
  const _words = radix2(5);
  const fromWords = _words.decode;
  const toWords = _words.encode;
  const fromWordsUnsafe = unsafeWrapper(fromWords);
  function encode2(prefix, words, limit = 90) {
    if (typeof prefix !== "string")
      throw new Error(`bech32.encode prefix should be string, not ${typeof prefix}`);
    if (!Array.isArray(words) || words.length && typeof words[0] !== "number")
      throw new Error(`bech32.encode words should be array of numbers, not ${typeof words}`);
    const actualLength = prefix.length + 7 + words.length;
    if (limit !== false && actualLength > limit)
      throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
    prefix = prefix.toLowerCase();
    return `${prefix}1${BECH_ALPHABET.encode(words)}${bechChecksum(prefix, words, ENCODING_CONST)}`;
  }
  function decode5(str, limit = 90) {
    if (typeof str !== "string")
      throw new Error(`bech32.decode input should be string, not ${typeof str}`);
    if (str.length < 8 || limit !== false && str.length > limit)
      throw new TypeError(`Wrong string length: ${str.length} (${str}). Expected (8..${limit})`);
    const lowered = str.toLowerCase();
    if (str !== lowered && str !== str.toUpperCase())
      throw new Error(`String must be lowercase or uppercase`);
    str = lowered;
    const sepIndex = str.lastIndexOf("1");
    if (sepIndex === 0 || sepIndex === -1)
      throw new Error(`Letter "1" must be present between prefix and data only`);
    const prefix = str.slice(0, sepIndex);
    const _words2 = str.slice(sepIndex + 1);
    if (_words2.length < 6)
      throw new Error("Data must be at least 6 characters long");
    const words = BECH_ALPHABET.decode(_words2).slice(0, -6);
    const sum = bechChecksum(prefix, words, ENCODING_CONST);
    if (!_words2.endsWith(sum))
      throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
    return { prefix, words };
  }
  const decodeUnsafe = unsafeWrapper(decode5);
  function decodeToBytes(str) {
    const { prefix, words } = decode5(str, false);
    return { prefix, words, bytes: fromWords(words) };
  }
  return { encode: encode2, decode: decode5, decodeToBytes, decodeUnsafe, fromWords, fromWordsUnsafe, toWords };
}
var bech32 = genBech32("bech32");
var bech32m = genBech32("bech32m");
var utf8 = {
  encode: (data) => new TextDecoder().decode(data),
  decode: (str) => new TextEncoder().encode(str)
};
var hex = chain(radix2(4), alphabet("0123456789abcdef"), join(""), normalize((s) => {
  if (typeof s !== "string" || s.length % 2)
    throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
  return s.toLowerCase();
}));
var CODERS = {
  utf8,
  hex,
  base16,
  base32,
  base64,
  base64url,
  base58,
  base58xmr
};
var coderTypeError = `Invalid encoding type. Available types: ${Object.keys(CODERS).join(", ")}`;

// node_modules/@scure/bip39/esm/wordlists/english.js
var wordlist = `abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split("\n");

// node_modules/@noble/hashes/esm/_assert.js
function number3(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error(`Wrong positive integer: ${n}`);
}
function bool3(b) {
  if (typeof b !== "boolean")
    throw new Error(`Expected boolean, not ${b}`);
}
function bytes3(b, ...lengths) {
  if (!(b instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
function hash3(hash8) {
  if (typeof hash8 !== "function" || typeof hash8.create !== "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  number3(hash8.outputLen);
  number3(hash8.blockLen);
}
function exists3(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function output3(out, instance) {
  bytes3(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error(`digestInto() expects output buffer of length at least ${min}`);
  }
}
var assert3 = { number: number3, bool: bool3, bytes: bytes3, hash: hash3, exists: exists3, output: output3 };
var assert_default3 = assert3;

// node_modules/@noble/hashes/esm/cryptoNode.js
var nc3 = __toESM(require("crypto"), 1);
var crypto4 = nc3 && typeof nc3 === "object" && "webcrypto" in nc3 ? nc3.webcrypto : void 0;

// node_modules/@noble/hashes/esm/utils.js
var u8a4 = (a) => a instanceof Uint8Array;
var createView3 = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
var rotr3 = (word, shift) => word << 32 - shift | word >>> shift;
var isLE3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!isLE3)
  throw new Error("Non little-endian hardware is not supported");
var hexes4 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i2) => i2.toString(16).padStart(2, "0"));
function bytesToHex3(bytes8) {
  if (!u8a4(bytes8))
    throw new Error("Uint8Array expected");
  let hex5 = "";
  for (let i2 = 0; i2 < bytes8.length; i2++) {
    hex5 += hexes4[bytes8[i2]];
  }
  return hex5;
}
function hexToBytes3(hex5) {
  if (typeof hex5 !== "string")
    throw new Error("hex string expected, got " + typeof hex5);
  const len = hex5.length;
  if (len % 2)
    throw new Error("padded hex string expected, got unpadded hex of length " + len);
  const array = new Uint8Array(len / 2);
  for (let i2 = 0; i2 < array.length; i2++) {
    const j = i2 * 2;
    const hexByte = hex5.slice(j, j + 2);
    const byte = Number.parseInt(hexByte, 16);
    if (Number.isNaN(byte) || byte < 0)
      throw new Error("Invalid byte sequence");
    array[i2] = byte;
  }
  return array;
}
function utf8ToBytes4(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes3(data) {
  if (typeof data === "string")
    data = utf8ToBytes4(data);
  if (!u8a4(data))
    throw new Error(`expected Uint8Array, got ${typeof data}`);
  return data;
}
function concatBytes4(...arrays) {
  const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
  let pad2 = 0;
  arrays.forEach((a) => {
    if (!u8a4(a))
      throw new Error("Uint8Array expected");
    r.set(a, pad2);
    pad2 += a.length;
  });
  return r;
}
var Hash3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
var toStr = {}.toString;
function checkOpts(defaults, opts) {
  if (opts !== void 0 && toStr.call(opts) !== "[object Object]")
    throw new Error("Options should be object or undefined");
  const merged = Object.assign(defaults, opts);
  return merged;
}
function wrapConstructor3(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes3(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function randomBytes3(bytesLength = 32) {
  if (crypto4 && typeof crypto4.getRandomValues === "function") {
    return crypto4.getRandomValues(new Uint8Array(bytesLength));
  }
  throw new Error("crypto.getRandomValues must be defined");
}

// node_modules/@noble/hashes/esm/hmac.js
var HMAC2 = class extends Hash3 {
  constructor(hash8, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    hash3(hash8);
    const key = toBytes3(_key);
    this.iHash = hash8.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad2 = new Uint8Array(blockLen);
    pad2.set(key.length > blockLen ? hash8.create().update(key).digest() : key);
    for (let i2 = 0; i2 < pad2.length; i2++)
      pad2[i2] ^= 54;
    this.iHash.update(pad2);
    this.oHash = hash8.create();
    for (let i2 = 0; i2 < pad2.length; i2++)
      pad2[i2] ^= 54 ^ 92;
    this.oHash.update(pad2);
    pad2.fill(0);
  }
  update(buf) {
    exists3(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    exists3(this);
    bytes3(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac2 = (hash8, key, message) => new HMAC2(hash8, key).update(message).digest();
hmac2.create = (hash8, key) => new HMAC2(hash8, key);

// node_modules/@noble/hashes/esm/pbkdf2.js
function pbkdf2Init(hash8, _password, _salt, _opts) {
  hash3(hash8);
  const opts = checkOpts({ dkLen: 32, asyncTick: 10 }, _opts);
  const { c, dkLen, asyncTick } = opts;
  number3(c);
  number3(dkLen);
  number3(asyncTick);
  if (c < 1)
    throw new Error("PBKDF2: iterations (c) should be >= 1");
  const password = toBytes3(_password);
  const salt2 = toBytes3(_salt);
  const DK = new Uint8Array(dkLen);
  const PRF = hmac2.create(hash8, password);
  const PRFSalt = PRF._cloneInto().update(salt2);
  return { c, dkLen, asyncTick, DK, PRF, PRFSalt };
}
function pbkdf2Output(PRF, PRFSalt, DK, prfW, u2) {
  PRF.destroy();
  PRFSalt.destroy();
  if (prfW)
    prfW.destroy();
  u2.fill(0);
  return DK;
}
function pbkdf2(hash8, password, salt2, opts) {
  const { c, dkLen, DK, PRF, PRFSalt } = pbkdf2Init(hash8, password, salt2, opts);
  let prfW;
  const arr = new Uint8Array(4);
  const view = createView3(arr);
  const u2 = new Uint8Array(PRF.outputLen);
  for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
    const Ti = DK.subarray(pos, pos + PRF.outputLen);
    view.setInt32(0, ti, false);
    (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u2);
    Ti.set(u2.subarray(0, Ti.length));
    for (let ui = 1; ui < c; ui++) {
      PRF._cloneInto(prfW).update(u2).digestInto(u2);
      for (let i2 = 0; i2 < Ti.length; i2++)
        Ti[i2] ^= u2[i2];
    }
  }
  return pbkdf2Output(PRF, PRFSalt, DK, prfW, u2);
}

// node_modules/@noble/hashes/esm/_sha2.js
function setBigUint643(view, byteOffset, value, isLE8) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE8);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE8 ? 4 : 0;
  const l = isLE8 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE8);
  view.setUint32(byteOffset + l, wl, isLE8);
}
var SHA23 = class extends Hash3 {
  constructor(blockLen, outputLen, padOffset, isLE8) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE8;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView3(this.buffer);
  }
  update(data) {
    exists3(this);
    const { view, buffer, blockLen } = this;
    data = toBytes3(data);
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView3(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    exists3(this);
    output3(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE8 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    this.buffer.subarray(pos).fill(0);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i2 = pos; i2 < blockLen; i2++)
      buffer[i2] = 0;
    setBigUint643(view, blockLen - 8, BigInt(this.length * 8), isLE8);
    this.process(view, 0);
    const oview = createView3(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i2 = 0; i2 < outLen; i2++)
      oview.setUint32(4 * i2, state[i2], isLE8);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.length = length;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
};

// node_modules/@noble/hashes/esm/sha256.js
var Chi3 = (a, b, c) => a & b ^ ~a & c;
var Maj3 = (a, b, c) => a & b ^ a & c ^ b & c;
var SHA256_K3 = /* @__PURE__ */ new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var IV3 = /* @__PURE__ */ new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA256_W3 = /* @__PURE__ */ new Uint32Array(64);
var SHA2563 = class extends SHA23 {
  constructor() {
    super(64, 32, 8, false);
    this.A = IV3[0] | 0;
    this.B = IV3[1] | 0;
    this.C = IV3[2] | 0;
    this.D = IV3[3] | 0;
    this.E = IV3[4] | 0;
    this.F = IV3[5] | 0;
    this.G = IV3[6] | 0;
    this.H = IV3[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4)
      SHA256_W3[i2] = view.getUint32(offset, false);
    for (let i2 = 16; i2 < 64; i2++) {
      const W15 = SHA256_W3[i2 - 15];
      const W2 = SHA256_W3[i2 - 2];
      const s0 = rotr3(W15, 7) ^ rotr3(W15, 18) ^ W15 >>> 3;
      const s1 = rotr3(W2, 17) ^ rotr3(W2, 19) ^ W2 >>> 10;
      SHA256_W3[i2] = s1 + SHA256_W3[i2 - 7] + s0 + SHA256_W3[i2 - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i2 = 0; i2 < 64; i2++) {
      const sigma1 = rotr3(E, 6) ^ rotr3(E, 11) ^ rotr3(E, 25);
      const T1 = H + sigma1 + Chi3(E, F, G) + SHA256_K3[i2] + SHA256_W3[i2] | 0;
      const sigma0 = rotr3(A, 2) ^ rotr3(A, 13) ^ rotr3(A, 22);
      const T2 = sigma0 + Maj3(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    SHA256_W3.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
};
var sha2563 = /* @__PURE__ */ wrapConstructor3(() => new SHA2563());

// node_modules/@noble/hashes/esm/_u64.js
var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  let Ah = new Uint32Array(lst.length);
  let Al = new Uint32Array(lst.length);
  for (let i2 = 0; i2 < lst.length; i2++) {
    const { h, l } = fromBig(lst[i2], le);
    [Ah[i2], Al[i2]] = [h, l];
  }
  return [Ah, Al];
}
var toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
var shrSH = (h, _l, s) => h >>> s;
var shrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
var rotr32H = (_h, l) => l;
var rotr32L = (h, _l) => h;
var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
var u64 = {
  fromBig,
  split,
  toBig,
  shrSH,
  shrSL,
  rotrSH,
  rotrSL,
  rotrBH,
  rotrBL,
  rotr32H,
  rotr32L,
  rotlSH,
  rotlSL,
  rotlBH,
  rotlBL,
  add,
  add3L,
  add3H,
  add4L,
  add4H,
  add5H,
  add5L
};
var u64_default = u64;

// node_modules/@noble/hashes/esm/sha512.js
var [SHA512_Kh, SHA512_Kl] = /* @__PURE__ */ (() => u64_default.split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n) => BigInt(n))))();
var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
var SHA512 = class extends SHA23 {
  constructor() {
    super(128, 64, 16, false);
    this.Ah = 1779033703 | 0;
    this.Al = 4089235720 | 0;
    this.Bh = 3144134277 | 0;
    this.Bl = 2227873595 | 0;
    this.Ch = 1013904242 | 0;
    this.Cl = 4271175723 | 0;
    this.Dh = 2773480762 | 0;
    this.Dl = 1595750129 | 0;
    this.Eh = 1359893119 | 0;
    this.El = 2917565137 | 0;
    this.Fh = 2600822924 | 0;
    this.Fl = 725511199 | 0;
    this.Gh = 528734635 | 0;
    this.Gl = 4215389547 | 0;
    this.Hh = 1541459225 | 0;
    this.Hl = 327033209 | 0;
  }
  // prettier-ignore
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
  }
  // prettier-ignore
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4) {
      SHA512_W_H[i2] = view.getUint32(offset);
      SHA512_W_L[i2] = view.getUint32(offset += 4);
    }
    for (let i2 = 16; i2 < 80; i2++) {
      const W15h = SHA512_W_H[i2 - 15] | 0;
      const W15l = SHA512_W_L[i2 - 15] | 0;
      const s0h = u64_default.rotrSH(W15h, W15l, 1) ^ u64_default.rotrSH(W15h, W15l, 8) ^ u64_default.shrSH(W15h, W15l, 7);
      const s0l = u64_default.rotrSL(W15h, W15l, 1) ^ u64_default.rotrSL(W15h, W15l, 8) ^ u64_default.shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i2 - 2] | 0;
      const W2l = SHA512_W_L[i2 - 2] | 0;
      const s1h = u64_default.rotrSH(W2h, W2l, 19) ^ u64_default.rotrBH(W2h, W2l, 61) ^ u64_default.shrSH(W2h, W2l, 6);
      const s1l = u64_default.rotrSL(W2h, W2l, 19) ^ u64_default.rotrBL(W2h, W2l, 61) ^ u64_default.shrSL(W2h, W2l, 6);
      const SUMl = u64_default.add4L(s0l, s1l, SHA512_W_L[i2 - 7], SHA512_W_L[i2 - 16]);
      const SUMh = u64_default.add4H(SUMl, s0h, s1h, SHA512_W_H[i2 - 7], SHA512_W_H[i2 - 16]);
      SHA512_W_H[i2] = SUMh | 0;
      SHA512_W_L[i2] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i2 = 0; i2 < 80; i2++) {
      const sigma1h = u64_default.rotrSH(Eh, El, 14) ^ u64_default.rotrSH(Eh, El, 18) ^ u64_default.rotrBH(Eh, El, 41);
      const sigma1l = u64_default.rotrSL(Eh, El, 14) ^ u64_default.rotrSL(Eh, El, 18) ^ u64_default.rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = u64_default.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i2], SHA512_W_L[i2]);
      const T1h = u64_default.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i2], SHA512_W_H[i2]);
      const T1l = T1ll | 0;
      const sigma0h = u64_default.rotrSH(Ah, Al, 28) ^ u64_default.rotrBH(Ah, Al, 34) ^ u64_default.rotrBH(Ah, Al, 39);
      const sigma0l = u64_default.rotrSL(Ah, Al, 28) ^ u64_default.rotrBL(Ah, Al, 34) ^ u64_default.rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = u64_default.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = u64_default.add3L(T1l, sigma0l, MAJl);
      Ah = u64_default.add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = u64_default.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = u64_default.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = u64_default.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = u64_default.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = u64_default.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = u64_default.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = u64_default.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = u64_default.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    SHA512_W_H.fill(0);
    SHA512_W_L.fill(0);
  }
  destroy() {
    this.buffer.fill(0);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var sha512 = /* @__PURE__ */ wrapConstructor3(() => new SHA512());

// node_modules/@scure/base/lib/esm/index.js
function assertNumber2(n) {
  if (!Number.isSafeInteger(n))
    throw new Error(`Wrong integer: ${n}`);
}
function chain2(...args) {
  const wrap2 = (a, b) => (c) => a(b(c));
  const encode2 = Array.from(args).reverse().reduce((acc, i2) => acc ? wrap2(acc, i2.encode) : i2.encode, void 0);
  const decode5 = args.reduce((acc, i2) => acc ? wrap2(acc, i2.decode) : i2.decode, void 0);
  return { encode: encode2, decode: decode5 };
}
function alphabet2(alphabet5) {
  return {
    encode: (digits) => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
        throw new Error("alphabet.encode input should be an array of numbers");
      return digits.map((i2) => {
        assertNumber2(i2);
        if (i2 < 0 || i2 >= alphabet5.length)
          throw new Error(`Digit index outside alphabet: ${i2} (alphabet: ${alphabet5.length})`);
        return alphabet5[i2];
      });
    },
    decode: (input) => {
      if (!Array.isArray(input) || input.length && typeof input[0] !== "string")
        throw new Error("alphabet.decode input should be array of strings");
      return input.map((letter) => {
        if (typeof letter !== "string")
          throw new Error(`alphabet.decode: not string element=${letter}`);
        const index = alphabet5.indexOf(letter);
        if (index === -1)
          throw new Error(`Unknown letter: "${letter}". Allowed: ${alphabet5}`);
        return index;
      });
    }
  };
}
function join2(separator = "") {
  if (typeof separator !== "string")
    throw new Error("join separator should be string");
  return {
    encode: (from) => {
      if (!Array.isArray(from) || from.length && typeof from[0] !== "string")
        throw new Error("join.encode input should be array of strings");
      for (let i2 of from)
        if (typeof i2 !== "string")
          throw new Error(`join.encode: non-string input=${i2}`);
      return from.join(separator);
    },
    decode: (to) => {
      if (typeof to !== "string")
        throw new Error("join.decode input should be string");
      return to.split(separator);
    }
  };
}
function padding2(bits, chr = "=") {
  assertNumber2(bits);
  if (typeof chr !== "string")
    throw new Error("padding chr should be string");
  return {
    encode(data) {
      if (!Array.isArray(data) || data.length && typeof data[0] !== "string")
        throw new Error("padding.encode input should be array of strings");
      for (let i2 of data)
        if (typeof i2 !== "string")
          throw new Error(`padding.encode: non-string input=${i2}`);
      while (data.length * bits % 8)
        data.push(chr);
      return data;
    },
    decode(input) {
      if (!Array.isArray(input) || input.length && typeof input[0] !== "string")
        throw new Error("padding.encode input should be array of strings");
      for (let i2 of input)
        if (typeof i2 !== "string")
          throw new Error(`padding.decode: non-string input=${i2}`);
      let end = input.length;
      if (end * bits % 8)
        throw new Error("Invalid padding: string should have whole number of bytes");
      for (; end > 0 && input[end - 1] === chr; end--) {
        if (!((end - 1) * bits % 8))
          throw new Error("Invalid padding: string has too much padding");
      }
      return input.slice(0, end);
    }
  };
}
function normalize2(fn) {
  if (typeof fn !== "function")
    throw new Error("normalize fn should be function");
  return { encode: (from) => from, decode: (to) => fn(to) };
}
function convertRadix3(data, from, to) {
  if (from < 2)
    throw new Error(`convertRadix: wrong from=${from}, base cannot be less than 2`);
  if (to < 2)
    throw new Error(`convertRadix: wrong to=${to}, base cannot be less than 2`);
  if (!Array.isArray(data))
    throw new Error("convertRadix: data should be array");
  if (!data.length)
    return [];
  let pos = 0;
  const res = [];
  const digits = Array.from(data);
  digits.forEach((d) => {
    assertNumber2(d);
    if (d < 0 || d >= from)
      throw new Error(`Wrong integer: ${d}`);
  });
  while (true) {
    let carry = 0;
    let done = true;
    for (let i2 = pos; i2 < digits.length; i2++) {
      const digit = digits[i2];
      const digitBase = from * carry + digit;
      if (!Number.isSafeInteger(digitBase) || from * carry / from !== carry || digitBase - digit !== from * carry) {
        throw new Error("convertRadix: carry overflow");
      }
      carry = digitBase % to;
      const rounded = Math.floor(digitBase / to);
      digits[i2] = rounded;
      if (!Number.isSafeInteger(rounded) || rounded * to + carry !== digitBase)
        throw new Error("convertRadix: carry overflow");
      if (!done)
        continue;
      else if (!rounded)
        pos = i2;
      else
        done = false;
    }
    res.push(carry);
    if (done)
      break;
  }
  for (let i2 = 0; i2 < data.length - 1 && data[i2] === 0; i2++)
    res.push(0);
  return res.reverse();
}
var gcd2 = (
  /* @__NO_SIDE_EFFECTS__ */
  (a, b) => !b ? a : gcd2(b, a % b)
);
var radix2carry2 = (
  /*@__NO_SIDE_EFFECTS__ */
  (from, to) => from + (to - gcd2(from, to))
);
function convertRadix22(data, from, to, padding5) {
  if (!Array.isArray(data))
    throw new Error("convertRadix2: data should be array");
  if (from <= 0 || from > 32)
    throw new Error(`convertRadix2: wrong from=${from}`);
  if (to <= 0 || to > 32)
    throw new Error(`convertRadix2: wrong to=${to}`);
  if (radix2carry2(from, to) > 32) {
    throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${radix2carry2(from, to)}`);
  }
  let carry = 0;
  let pos = 0;
  const mask = 2 ** to - 1;
  const res = [];
  for (const n of data) {
    assertNumber2(n);
    if (n >= 2 ** from)
      throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
    carry = carry << from | n;
    if (pos + from > 32)
      throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
    pos += from;
    for (; pos >= to; pos -= to)
      res.push((carry >> pos - to & mask) >>> 0);
    carry &= 2 ** pos - 1;
  }
  carry = carry << to - pos & mask;
  if (!padding5 && pos >= from)
    throw new Error("Excess padding");
  if (!padding5 && carry)
    throw new Error(`Non-zero padding: ${carry}`);
  if (padding5 && pos > 0)
    res.push(carry >>> 0);
  return res;
}
function radix3(num) {
  assertNumber2(num);
  return {
    encode: (bytes8) => {
      if (!(bytes8 instanceof Uint8Array))
        throw new Error("radix.encode input should be Uint8Array");
      return convertRadix3(Array.from(bytes8), 2 ** 8, num);
    },
    decode: (digits) => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
        throw new Error("radix.decode input should be array of strings");
      return Uint8Array.from(convertRadix3(digits, num, 2 ** 8));
    }
  };
}
function radix22(bits, revPadding = false) {
  assertNumber2(bits);
  if (bits <= 0 || bits > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (radix2carry2(8, bits) > 32 || radix2carry2(bits, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (bytes8) => {
      if (!(bytes8 instanceof Uint8Array))
        throw new Error("radix2.encode input should be Uint8Array");
      return convertRadix22(Array.from(bytes8), 8, bits, !revPadding);
    },
    decode: (digits) => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
        throw new Error("radix2.decode input should be array of strings");
      return Uint8Array.from(convertRadix22(digits, bits, 8, revPadding));
    }
  };
}
function checksum(len, fn) {
  assertNumber2(len);
  if (typeof fn !== "function")
    throw new Error("checksum fn should be function");
  return {
    encode(data) {
      if (!(data instanceof Uint8Array))
        throw new Error("checksum.encode: input should be Uint8Array");
      const checksum2 = fn(data).slice(0, len);
      const res = new Uint8Array(data.length + len);
      res.set(data);
      res.set(checksum2, data.length);
      return res;
    },
    decode(data) {
      if (!(data instanceof Uint8Array))
        throw new Error("checksum.decode: input should be Uint8Array");
      const payload = data.slice(0, -len);
      const newChecksum = fn(payload).slice(0, len);
      const oldChecksum = data.slice(-len);
      for (let i2 = 0; i2 < len; i2++)
        if (newChecksum[i2] !== oldChecksum[i2])
          throw new Error("Invalid checksum");
      return payload;
    }
  };
}
var utils = { alphabet: alphabet2, chain: chain2, checksum, radix: radix3, radix2: radix22, join: join2, padding: padding2 };
var base162 = /* @__PURE__ */ chain2(radix22(4), alphabet2("0123456789ABCDEF"), join2(""));
var base322 = /* @__PURE__ */ chain2(radix22(5), alphabet2("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), padding2(5), join2(""));
var base32hex2 = /* @__PURE__ */ chain2(radix22(5), alphabet2("0123456789ABCDEFGHIJKLMNOPQRSTUV"), padding2(5), join2(""));
var base32crockford2 = /* @__PURE__ */ chain2(radix22(5), alphabet2("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), join2(""), normalize2((s) => s.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
var base642 = /* @__PURE__ */ chain2(radix22(6), alphabet2("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), padding2(6), join2(""));
var base64url2 = /* @__PURE__ */ chain2(radix22(6), alphabet2("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), padding2(6), join2(""));
var base64urlnopad = /* @__PURE__ */ chain2(radix22(6), alphabet2("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), join2(""));
var genBase582 = (abc) => chain2(radix3(58), alphabet2(abc), join2(""));
var base582 = /* @__PURE__ */ genBase582("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
var base58check = (sha2567) => chain2(checksum(4, (data) => sha2567(sha2567(data))), base582);
var BECH_ALPHABET2 = /* @__PURE__ */ chain2(alphabet2("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), join2(""));
var hex2 = /* @__PURE__ */ chain2(radix22(4), alphabet2("0123456789abcdef"), join2(""), normalize2((s) => {
  if (typeof s !== "string" || s.length % 2)
    throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
  return s.toLowerCase();
}));

// node_modules/@scure/bip39/esm/index.js
var isJapanese = (wordlist2) => wordlist2[0] === "\u3042\u3044\u3053\u304F\u3057\u3093";
function nfkd(str) {
  if (typeof str !== "string")
    throw new TypeError(`Invalid mnemonic type: ${typeof str}`);
  return str.normalize("NFKD");
}
function normalize3(str) {
  const norm = nfkd(str);
  const words = norm.split(" ");
  if (![12, 15, 18, 21, 24].includes(words.length))
    throw new Error("Invalid mnemonic");
  return { nfkd: norm, words };
}
function assertEntropy(entropy) {
  assert_default3.bytes(entropy, 16, 20, 24, 28, 32);
}
function generateMnemonic(wordlist2, strength = 128) {
  assert_default3.number(strength);
  if (strength % 32 !== 0 || strength > 256)
    throw new TypeError("Invalid entropy");
  return entropyToMnemonic(randomBytes3(strength / 8), wordlist2);
}
var calcChecksum = (entropy) => {
  const bitsLeft = 8 - entropy.length / 4;
  return new Uint8Array([sha2563(entropy)[0] >> bitsLeft << bitsLeft]);
};
function getCoder(wordlist2) {
  if (!Array.isArray(wordlist2) || wordlist2.length !== 2048 || typeof wordlist2[0] !== "string")
    throw new Error("Worlist: expected array of 2048 strings");
  wordlist2.forEach((i2) => {
    if (typeof i2 !== "string")
      throw new Error(`Wordlist: non-string element: ${i2}`);
  });
  return utils.chain(utils.checksum(1, calcChecksum), utils.radix2(11, true), utils.alphabet(wordlist2));
}
function mnemonicToEntropy(mnemonic, wordlist2) {
  const { words } = normalize3(mnemonic);
  const entropy = getCoder(wordlist2).decode(words);
  assertEntropy(entropy);
  return entropy;
}
function entropyToMnemonic(entropy, wordlist2) {
  assertEntropy(entropy);
  const words = getCoder(wordlist2).encode(entropy);
  return words.join(isJapanese(wordlist2) ? "\u3000" : " ");
}
function validateMnemonic(mnemonic, wordlist2) {
  try {
    mnemonicToEntropy(mnemonic, wordlist2);
  } catch (e) {
    return false;
  }
  return true;
}
var salt = (passphrase) => nfkd(`mnemonic${passphrase}`);
function mnemonicToSeedSync(mnemonic, passphrase = "") {
  return pbkdf2(sha512, normalize3(mnemonic).nfkd, salt(passphrase), { c: 2048, dkLen: 64 });
}

// node_modules/@noble/hashes/esm/ripemd160.js
var Rho = /* @__PURE__ */ new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]);
var Id = /* @__PURE__ */ Uint8Array.from({ length: 16 }, (_, i2) => i2);
var Pi = /* @__PURE__ */ Id.map((i2) => (9 * i2 + 5) % 16);
var idxL = [Id];
var idxR = [Pi];
for (let i2 = 0; i2 < 4; i2++)
  for (let j of [idxL, idxR])
    j.push(j[i2].map((k) => Rho[k]));
var shifts = /* @__PURE__ */ [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((i2) => new Uint8Array(i2));
var shiftsL = /* @__PURE__ */ idxL.map((idx, i2) => idx.map((j) => shifts[i2][j]));
var shiftsR = /* @__PURE__ */ idxR.map((idx, i2) => idx.map((j) => shifts[i2][j]));
var Kl = /* @__PURE__ */ new Uint32Array([
  0,
  1518500249,
  1859775393,
  2400959708,
  2840853838
]);
var Kr = /* @__PURE__ */ new Uint32Array([
  1352829926,
  1548603684,
  1836072691,
  2053994217,
  0
]);
var rotl = (word, shift) => word << shift | word >>> 32 - shift;
function f(group, x, y, z) {
  if (group === 0)
    return x ^ y ^ z;
  else if (group === 1)
    return x & y | ~x & z;
  else if (group === 2)
    return (x | ~y) ^ z;
  else if (group === 3)
    return x & z | y & ~z;
  else
    return x ^ (y | ~z);
}
var BUF = /* @__PURE__ */ new Uint32Array(16);
var RIPEMD160 = class extends SHA23 {
  constructor() {
    super(64, 20, 8, true);
    this.h0 = 1732584193 | 0;
    this.h1 = 4023233417 | 0;
    this.h2 = 2562383102 | 0;
    this.h3 = 271733878 | 0;
    this.h4 = 3285377520 | 0;
  }
  get() {
    const { h0, h1, h2, h3, h4 } = this;
    return [h0, h1, h2, h3, h4];
  }
  set(h0, h1, h2, h3, h4) {
    this.h0 = h0 | 0;
    this.h1 = h1 | 0;
    this.h2 = h2 | 0;
    this.h3 = h3 | 0;
    this.h4 = h4 | 0;
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4)
      BUF[i2] = view.getUint32(offset, true);
    let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
    for (let group = 0; group < 5; group++) {
      const rGroup = 4 - group;
      const hbl = Kl[group], hbr = Kr[group];
      const rl = idxL[group], rr = idxR[group];
      const sl = shiftsL[group], sr = shiftsR[group];
      for (let i2 = 0; i2 < 16; i2++) {
        const tl = rotl(al + f(group, bl, cl, dl) + BUF[rl[i2]] + hbl, sl[i2]) + el | 0;
        al = el, el = dl, dl = rotl(cl, 10) | 0, cl = bl, bl = tl;
      }
      for (let i2 = 0; i2 < 16; i2++) {
        const tr = rotl(ar + f(rGroup, br, cr, dr) + BUF[rr[i2]] + hbr, sr[i2]) + er | 0;
        ar = er, er = dr, dr = rotl(cr, 10) | 0, cr = br, br = tr;
      }
    }
    this.set(this.h1 + cl + dr | 0, this.h2 + dl + er | 0, this.h3 + el + ar | 0, this.h4 + al + br | 0, this.h0 + bl + cr | 0);
  }
  roundClean() {
    BUF.fill(0);
  }
  destroy() {
    this.destroyed = true;
    this.buffer.fill(0);
    this.set(0, 0, 0, 0, 0);
  }
};
var ripemd160 = /* @__PURE__ */ wrapConstructor3(() => new RIPEMD160());

// node_modules/@scure/bip32/lib/esm/index.js
var Point2 = secp256k1.ProjectivePoint;
var base58check2 = base58check(sha2563);
function bytesToNumber(bytes8) {
  return BigInt(`0x${bytesToHex3(bytes8)}`);
}
function numberToBytes(num) {
  return hexToBytes3(num.toString(16).padStart(64, "0"));
}
var MASTER_SECRET = utf8ToBytes4("Bitcoin seed");
var BITCOIN_VERSIONS = { private: 76066276, public: 76067358 };
var HARDENED_OFFSET = 2147483648;
var hash160 = (data) => ripemd160(sha2563(data));
var fromU32 = (data) => createView3(data).getUint32(0, false);
var toU32 = (n) => {
  if (!Number.isSafeInteger(n) || n < 0 || n > 2 ** 32 - 1) {
    throw new Error(`Invalid number=${n}. Should be from 0 to 2 ** 32 - 1`);
  }
  const buf = new Uint8Array(4);
  createView3(buf).setUint32(0, n, false);
  return buf;
};
var HDKey = class {
  get fingerprint() {
    if (!this.pubHash) {
      throw new Error("No publicKey set!");
    }
    return fromU32(this.pubHash);
  }
  get identifier() {
    return this.pubHash;
  }
  get pubKeyHash() {
    return this.pubHash;
  }
  get privateKey() {
    return this.privKeyBytes || null;
  }
  get publicKey() {
    return this.pubKey || null;
  }
  get privateExtendedKey() {
    const priv = this.privateKey;
    if (!priv) {
      throw new Error("No private key");
    }
    return base58check2.encode(this.serialize(this.versions.private, concatBytes4(new Uint8Array([0]), priv)));
  }
  get publicExtendedKey() {
    if (!this.pubKey) {
      throw new Error("No public key");
    }
    return base58check2.encode(this.serialize(this.versions.public, this.pubKey));
  }
  static fromMasterSeed(seed, versions = BITCOIN_VERSIONS) {
    bytes3(seed);
    if (8 * seed.length < 128 || 8 * seed.length > 512) {
      throw new Error(`HDKey: wrong seed length=${seed.length}. Should be between 128 and 512 bits; 256 bits is advised)`);
    }
    const I = hmac2(sha512, MASTER_SECRET, seed);
    return new HDKey({
      versions,
      chainCode: I.slice(32),
      privateKey: I.slice(0, 32)
    });
  }
  static fromExtendedKey(base58key, versions = BITCOIN_VERSIONS) {
    const keyBuffer = base58check2.decode(base58key);
    const keyView = createView3(keyBuffer);
    const version = keyView.getUint32(0, false);
    const opt = {
      versions,
      depth: keyBuffer[4],
      parentFingerprint: keyView.getUint32(5, false),
      index: keyView.getUint32(9, false),
      chainCode: keyBuffer.slice(13, 45)
    };
    const key = keyBuffer.slice(45);
    const isPriv = key[0] === 0;
    if (version !== versions[isPriv ? "private" : "public"]) {
      throw new Error("Version mismatch");
    }
    if (isPriv) {
      return new HDKey({ ...opt, privateKey: key.slice(1) });
    } else {
      return new HDKey({ ...opt, publicKey: key });
    }
  }
  static fromJSON(json) {
    return HDKey.fromExtendedKey(json.xpriv);
  }
  constructor(opt) {
    this.depth = 0;
    this.index = 0;
    this.chainCode = null;
    this.parentFingerprint = 0;
    if (!opt || typeof opt !== "object") {
      throw new Error("HDKey.constructor must not be called directly");
    }
    this.versions = opt.versions || BITCOIN_VERSIONS;
    this.depth = opt.depth || 0;
    this.chainCode = opt.chainCode;
    this.index = opt.index || 0;
    this.parentFingerprint = opt.parentFingerprint || 0;
    if (!this.depth) {
      if (this.parentFingerprint || this.index) {
        throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");
      }
    }
    if (opt.publicKey && opt.privateKey) {
      throw new Error("HDKey: publicKey and privateKey at same time.");
    }
    if (opt.privateKey) {
      if (!secp256k1.utils.isValidPrivateKey(opt.privateKey)) {
        throw new Error("Invalid private key");
      }
      this.privKey = typeof opt.privateKey === "bigint" ? opt.privateKey : bytesToNumber(opt.privateKey);
      this.privKeyBytes = numberToBytes(this.privKey);
      this.pubKey = secp256k1.getPublicKey(opt.privateKey, true);
    } else if (opt.publicKey) {
      this.pubKey = Point2.fromHex(opt.publicKey).toRawBytes(true);
    } else {
      throw new Error("HDKey: no public or private key provided");
    }
    this.pubHash = hash160(this.pubKey);
  }
  derive(path) {
    if (!/^[mM]'?/.test(path)) {
      throw new Error('Path must start with "m" or "M"');
    }
    if (/^[mM]'?$/.test(path)) {
      return this;
    }
    const parts = path.replace(/^[mM]'?\//, "").split("/");
    let child = this;
    for (const c of parts) {
      const m = /^(\d+)('?)$/.exec(c);
      if (!m || m.length !== 3) {
        throw new Error(`Invalid child index: ${c}`);
      }
      let idx = +m[1];
      if (!Number.isSafeInteger(idx) || idx >= HARDENED_OFFSET) {
        throw new Error("Invalid index");
      }
      if (m[2] === "'") {
        idx += HARDENED_OFFSET;
      }
      child = child.deriveChild(idx);
    }
    return child;
  }
  deriveChild(index) {
    if (!this.pubKey || !this.chainCode) {
      throw new Error("No publicKey or chainCode set");
    }
    let data = toU32(index);
    if (index >= HARDENED_OFFSET) {
      const priv = this.privateKey;
      if (!priv) {
        throw new Error("Could not derive hardened child key");
      }
      data = concatBytes4(new Uint8Array([0]), priv, data);
    } else {
      data = concatBytes4(this.pubKey, data);
    }
    const I = hmac2(sha512, this.chainCode, data);
    const childTweak = bytesToNumber(I.slice(0, 32));
    const chainCode = I.slice(32);
    if (!secp256k1.utils.isValidPrivateKey(childTweak)) {
      throw new Error("Tweak bigger than curve order");
    }
    const opt = {
      versions: this.versions,
      chainCode,
      depth: this.depth + 1,
      parentFingerprint: this.fingerprint,
      index
    };
    try {
      if (this.privateKey) {
        const added = mod(this.privKey + childTweak, secp256k1.CURVE.n);
        if (!secp256k1.utils.isValidPrivateKey(added)) {
          throw new Error("The tweak was out of range or the resulted private key is invalid");
        }
        opt.privateKey = added;
      } else {
        const added = Point2.fromHex(this.pubKey).add(Point2.fromPrivateKey(childTweak));
        if (added.equals(Point2.ZERO)) {
          throw new Error("The tweak was equal to negative P, which made the result key invalid");
        }
        opt.publicKey = added.toRawBytes(true);
      }
      return new HDKey(opt);
    } catch (err) {
      return this.deriveChild(index + 1);
    }
  }
  sign(hash8) {
    if (!this.privateKey) {
      throw new Error("No privateKey set!");
    }
    bytes3(hash8, 32);
    return secp256k1.sign(hash8, this.privKey).toCompactRawBytes();
  }
  verify(hash8, signature) {
    bytes3(hash8, 32);
    bytes3(signature, 64);
    if (!this.publicKey) {
      throw new Error("No publicKey set!");
    }
    let sig;
    try {
      sig = secp256k1.Signature.fromCompact(signature);
    } catch (error) {
      return false;
    }
    return secp256k1.verify(sig, hash8, this.publicKey);
  }
  wipePrivateData() {
    this.privKey = void 0;
    if (this.privKeyBytes) {
      this.privKeyBytes.fill(0);
      this.privKeyBytes = void 0;
    }
    return this;
  }
  toJSON() {
    return {
      xpriv: this.privateExtendedKey,
      xpub: this.publicExtendedKey
    };
  }
  serialize(version, key) {
    if (!this.chainCode) {
      throw new Error("No chainCode set");
    }
    bytes3(key, 33);
    return concatBytes4(toU32(version), new Uint8Array([this.depth]), toU32(this.parentFingerprint), toU32(this.index), this.chainCode, key);
  }
};

// node_modules/@noble/ciphers/esm/utils.js
var u8a5 = (a) => a instanceof Uint8Array;
var u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
var isLE4 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!isLE4)
  throw new Error("Non little-endian hardware is not supported");
function utf8ToBytes5(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes4(data) {
  if (typeof data === "string")
    data = utf8ToBytes5(data);
  if (!u8a5(data))
    throw new Error(`expected Uint8Array, got ${typeof data}`);
  return data;
}
var isPlainObject = (obj) => Object.prototype.toString.call(obj) === "[object Object]" && obj.constructor === Object;
function checkOpts2(defaults, opts) {
  if (opts !== void 0 && (typeof opts !== "object" || !isPlainObject(opts)))
    throw new Error("options must be object or undefined");
  const merged = Object.assign(defaults, opts);
  return merged;
}
function ensureBytes2(b, len) {
  if (!(b instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  if (typeof len === "number") {
    if (b.length !== len)
      throw new Error(`Uint8Array length ${len} expected`);
  }
}
function equalBytes2(a, b) {
  if (a.length !== b.length)
    throw new Error("equalBytes: Different size of Uint8Arrays");
  let isSame = true;
  for (let i2 = 0; i2 < a.length; i2++)
    isSame && (isSame = a[i2] === b[i2]);
  return isSame;
}

// node_modules/@noble/ciphers/esm/_assert.js
function number4(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error(`Wrong positive integer: ${n}`);
}
function bool4(b) {
  if (typeof b !== "boolean")
    throw new Error(`Expected boolean, not ${b}`);
}
function bytes4(b, ...lengths) {
  if (!(b instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
function hash4(hash8) {
  if (typeof hash8 !== "function" || typeof hash8.create !== "function")
    throw new Error("hash must be wrapped by utils.wrapConstructor");
  number4(hash8.outputLen);
  number4(hash8.blockLen);
}
function exists4(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function output4(out, instance) {
  bytes4(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error(`digestInto() expects output buffer of length at least ${min}`);
  }
}
var assert4 = { number: number4, bool: bool4, bytes: bytes4, hash: hash4, exists: exists4, output: output4 };
var assert_default4 = assert4;

// node_modules/@noble/ciphers/esm/_poly1305.js
var u8to16 = (a, i2) => a[i2++] & 255 | (a[i2++] & 255) << 8;
var Poly1305 = class {
  constructor(key) {
    this.blockLen = 16;
    this.outputLen = 16;
    this.buffer = new Uint8Array(16);
    this.r = new Uint16Array(10);
    this.h = new Uint16Array(10);
    this.pad = new Uint16Array(8);
    this.pos = 0;
    this.finished = false;
    key = toBytes4(key);
    ensureBytes2(key, 32);
    const t0 = u8to16(key, 0);
    const t1 = u8to16(key, 2);
    const t2 = u8to16(key, 4);
    const t3 = u8to16(key, 6);
    const t4 = u8to16(key, 8);
    const t5 = u8to16(key, 10);
    const t6 = u8to16(key, 12);
    const t7 = u8to16(key, 14);
    this.r[0] = t0 & 8191;
    this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
    this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
    this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
    this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
    this.r[5] = t4 >>> 1 & 8190;
    this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
    this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
    this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
    this.r[9] = t7 >>> 5 & 127;
    for (let i2 = 0; i2 < 8; i2++)
      this.pad[i2] = u8to16(key, 16 + 2 * i2);
  }
  process(data, offset, isLast = false) {
    const hibit = isLast ? 0 : 1 << 11;
    const { h, r } = this;
    const r0 = r[0];
    const r1 = r[1];
    const r2 = r[2];
    const r3 = r[3];
    const r4 = r[4];
    const r5 = r[5];
    const r6 = r[6];
    const r7 = r[7];
    const r8 = r[8];
    const r9 = r[9];
    const t0 = u8to16(data, offset + 0);
    const t1 = u8to16(data, offset + 2);
    const t2 = u8to16(data, offset + 4);
    const t3 = u8to16(data, offset + 6);
    const t4 = u8to16(data, offset + 8);
    const t5 = u8to16(data, offset + 10);
    const t6 = u8to16(data, offset + 12);
    const t7 = u8to16(data, offset + 14);
    let h0 = h[0] + (t0 & 8191);
    let h1 = h[1] + ((t0 >>> 13 | t1 << 3) & 8191);
    let h2 = h[2] + ((t1 >>> 10 | t2 << 6) & 8191);
    let h3 = h[3] + ((t2 >>> 7 | t3 << 9) & 8191);
    let h4 = h[4] + ((t3 >>> 4 | t4 << 12) & 8191);
    let h5 = h[5] + (t4 >>> 1 & 8191);
    let h6 = h[6] + ((t4 >>> 14 | t5 << 2) & 8191);
    let h7 = h[7] + ((t5 >>> 11 | t6 << 5) & 8191);
    let h8 = h[8] + ((t6 >>> 8 | t7 << 8) & 8191);
    let h9 = h[9] + (t7 >>> 5 | hibit);
    let c = 0;
    let d0 = c + h0 * r0 + h1 * (5 * r9) + h2 * (5 * r8) + h3 * (5 * r7) + h4 * (5 * r6);
    c = d0 >>> 13;
    d0 &= 8191;
    d0 += h5 * (5 * r5) + h6 * (5 * r4) + h7 * (5 * r3) + h8 * (5 * r2) + h9 * (5 * r1);
    c += d0 >>> 13;
    d0 &= 8191;
    let d1 = c + h0 * r1 + h1 * r0 + h2 * (5 * r9) + h3 * (5 * r8) + h4 * (5 * r7);
    c = d1 >>> 13;
    d1 &= 8191;
    d1 += h5 * (5 * r6) + h6 * (5 * r5) + h7 * (5 * r4) + h8 * (5 * r3) + h9 * (5 * r2);
    c += d1 >>> 13;
    d1 &= 8191;
    let d2 = c + h0 * r2 + h1 * r1 + h2 * r0 + h3 * (5 * r9) + h4 * (5 * r8);
    c = d2 >>> 13;
    d2 &= 8191;
    d2 += h5 * (5 * r7) + h6 * (5 * r6) + h7 * (5 * r5) + h8 * (5 * r4) + h9 * (5 * r3);
    c += d2 >>> 13;
    d2 &= 8191;
    let d3 = c + h0 * r3 + h1 * r2 + h2 * r1 + h3 * r0 + h4 * (5 * r9);
    c = d3 >>> 13;
    d3 &= 8191;
    d3 += h5 * (5 * r8) + h6 * (5 * r7) + h7 * (5 * r6) + h8 * (5 * r5) + h9 * (5 * r4);
    c += d3 >>> 13;
    d3 &= 8191;
    let d4 = c + h0 * r4 + h1 * r3 + h2 * r2 + h3 * r1 + h4 * r0;
    c = d4 >>> 13;
    d4 &= 8191;
    d4 += h5 * (5 * r9) + h6 * (5 * r8) + h7 * (5 * r7) + h8 * (5 * r6) + h9 * (5 * r5);
    c += d4 >>> 13;
    d4 &= 8191;
    let d5 = c + h0 * r5 + h1 * r4 + h2 * r3 + h3 * r2 + h4 * r1;
    c = d5 >>> 13;
    d5 &= 8191;
    d5 += h5 * r0 + h6 * (5 * r9) + h7 * (5 * r8) + h8 * (5 * r7) + h9 * (5 * r6);
    c += d5 >>> 13;
    d5 &= 8191;
    let d6 = c + h0 * r6 + h1 * r5 + h2 * r4 + h3 * r3 + h4 * r2;
    c = d6 >>> 13;
    d6 &= 8191;
    d6 += h5 * r1 + h6 * r0 + h7 * (5 * r9) + h8 * (5 * r8) + h9 * (5 * r7);
    c += d6 >>> 13;
    d6 &= 8191;
    let d7 = c + h0 * r7 + h1 * r6 + h2 * r5 + h3 * r4 + h4 * r3;
    c = d7 >>> 13;
    d7 &= 8191;
    d7 += h5 * r2 + h6 * r1 + h7 * r0 + h8 * (5 * r9) + h9 * (5 * r8);
    c += d7 >>> 13;
    d7 &= 8191;
    let d8 = c + h0 * r8 + h1 * r7 + h2 * r6 + h3 * r5 + h4 * r4;
    c = d8 >>> 13;
    d8 &= 8191;
    d8 += h5 * r3 + h6 * r2 + h7 * r1 + h8 * r0 + h9 * (5 * r9);
    c += d8 >>> 13;
    d8 &= 8191;
    let d9 = c + h0 * r9 + h1 * r8 + h2 * r7 + h3 * r6 + h4 * r5;
    c = d9 >>> 13;
    d9 &= 8191;
    d9 += h5 * r4 + h6 * r3 + h7 * r2 + h8 * r1 + h9 * r0;
    c += d9 >>> 13;
    d9 &= 8191;
    c = (c << 2) + c | 0;
    c = c + d0 | 0;
    d0 = c & 8191;
    c = c >>> 13;
    d1 += c;
    h[0] = d0;
    h[1] = d1;
    h[2] = d2;
    h[3] = d3;
    h[4] = d4;
    h[5] = d5;
    h[6] = d6;
    h[7] = d7;
    h[8] = d8;
    h[9] = d9;
  }
  finalize() {
    const { h, pad: pad2 } = this;
    const g = new Uint16Array(10);
    let c = h[1] >>> 13;
    h[1] &= 8191;
    for (let i2 = 2; i2 < 10; i2++) {
      h[i2] += c;
      c = h[i2] >>> 13;
      h[i2] &= 8191;
    }
    h[0] += c * 5;
    c = h[0] >>> 13;
    h[0] &= 8191;
    h[1] += c;
    c = h[1] >>> 13;
    h[1] &= 8191;
    h[2] += c;
    g[0] = h[0] + 5;
    c = g[0] >>> 13;
    g[0] &= 8191;
    for (let i2 = 1; i2 < 10; i2++) {
      g[i2] = h[i2] + c;
      c = g[i2] >>> 13;
      g[i2] &= 8191;
    }
    g[9] -= 1 << 13;
    let mask = (c ^ 1) - 1;
    for (let i2 = 0; i2 < 10; i2++)
      g[i2] &= mask;
    mask = ~mask;
    for (let i2 = 0; i2 < 10; i2++)
      h[i2] = h[i2] & mask | g[i2];
    h[0] = (h[0] | h[1] << 13) & 65535;
    h[1] = (h[1] >>> 3 | h[2] << 10) & 65535;
    h[2] = (h[2] >>> 6 | h[3] << 7) & 65535;
    h[3] = (h[3] >>> 9 | h[4] << 4) & 65535;
    h[4] = (h[4] >>> 12 | h[5] << 1 | h[6] << 14) & 65535;
    h[5] = (h[6] >>> 2 | h[7] << 11) & 65535;
    h[6] = (h[7] >>> 5 | h[8] << 8) & 65535;
    h[7] = (h[8] >>> 8 | h[9] << 5) & 65535;
    let f2 = h[0] + pad2[0];
    h[0] = f2 & 65535;
    for (let i2 = 1; i2 < 8; i2++) {
      f2 = (h[i2] + pad2[i2] | 0) + (f2 >>> 16) | 0;
      h[i2] = f2 & 65535;
    }
  }
  update(data) {
    assert_default4.exists(this);
    const { buffer, blockLen } = this;
    data = toBytes4(data);
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(data, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(buffer, 0, false);
        this.pos = 0;
      }
    }
    return this;
  }
  destroy() {
    this.h.fill(0);
    this.r.fill(0);
    this.buffer.fill(0);
    this.pad.fill(0);
  }
  digestInto(out) {
    assert_default4.exists(this);
    assert_default4.output(out, this);
    this.finished = true;
    const { buffer, h } = this;
    let { pos } = this;
    if (pos) {
      buffer[pos++] = 1;
      for (; pos < 16; pos++)
        buffer[pos] = 0;
      this.process(buffer, 0, true);
    }
    this.finalize();
    let opos = 0;
    for (let i2 = 0; i2 < 8; i2++) {
      out[opos++] = h[i2] >>> 0;
      out[opos++] = h[i2] >>> 8;
    }
    return out;
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
};
function wrapConstructorWithKey(hashCons) {
  const hashC = (msg, key) => hashCons(key).update(toBytes4(msg)).digest();
  const tmp = hashCons(new Uint8Array(32));
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = (key) => hashCons(key);
  return hashC;
}
var poly1305 = wrapConstructorWithKey((key) => new Poly1305(key));

// node_modules/@noble/ciphers/esm/_salsa.js
var sigma16 = utf8ToBytes5("expand 16-byte k");
var sigma32 = utf8ToBytes5("expand 32-byte k");
var sigma16_32 = u32(sigma16);
var sigma32_32 = u32(sigma32);
var isAligned32 = (b) => !(b.byteOffset % 4);
var salsaBasic = (opts) => {
  const { core, rounds, counterRight, counterLen, allow128bitKeys, extendNonceFn, blockLen } = checkOpts2({ rounds: 20, counterRight: false, counterLen: 8, allow128bitKeys: true, blockLen: 64 }, opts);
  assert_default4.number(counterLen);
  assert_default4.number(rounds);
  assert_default4.number(blockLen);
  assert_default4.bool(counterRight);
  assert_default4.bool(allow128bitKeys);
  const blockLen32 = blockLen / 4;
  if (blockLen % 4 !== 0)
    throw new Error("Salsa/ChaCha: blockLen must be aligned to 4 bytes");
  return (key, nonce, data, output8, counter = 0) => {
    assert_default4.bytes(key);
    assert_default4.bytes(nonce);
    assert_default4.bytes(data);
    if (!output8)
      output8 = new Uint8Array(data.length);
    assert_default4.bytes(output8);
    assert_default4.number(counter);
    if (counter < 0 || counter >= 2 ** 32 - 1)
      throw new Error("Salsa/ChaCha: counter overflow");
    if (output8.length < data.length) {
      throw new Error(`Salsa/ChaCha: output (${output8.length}) is shorter than data (${data.length})`);
    }
    const toClean = [];
    let k, sigma;
    if (key.length === 32) {
      k = key;
      sigma = sigma32_32;
    } else if (key.length === 16 && allow128bitKeys) {
      k = new Uint8Array(32);
      k.set(key);
      k.set(key, 16);
      sigma = sigma16_32;
      toClean.push(k);
    } else
      throw new Error(`Salsa/ChaCha: invalid 32-byte key, got length=${key.length}`);
    if (extendNonceFn) {
      if (nonce.length <= 16)
        throw new Error(`Salsa/ChaCha: extended nonce must be bigger than 16 bytes`);
      k = extendNonceFn(sigma, k, nonce.subarray(0, 16), new Uint8Array(32));
      toClean.push(k);
      nonce = nonce.subarray(16);
    }
    const nonceLen = 16 - counterLen;
    if (nonce.length !== nonceLen)
      throw new Error(`Salsa/ChaCha: nonce must be ${nonceLen} or 16 bytes`);
    if (nonceLen !== 12) {
      const nc7 = new Uint8Array(12);
      nc7.set(nonce, counterRight ? 0 : 12 - nonce.length);
      toClean.push(nonce = nc7);
    }
    const block = new Uint8Array(blockLen);
    const b32 = u32(block);
    const k32 = u32(k);
    const n32 = u32(nonce);
    const d32 = isAligned32(data) && u32(data);
    const o32 = isAligned32(output8) && u32(output8);
    toClean.push(b32);
    const len = data.length;
    for (let pos = 0, ctr = counter; pos < len; ctr++) {
      core(sigma, k32, n32, b32, ctr, rounds);
      if (ctr >= 2 ** 32 - 1)
        throw new Error("Salsa/ChaCha: counter overflow");
      const take = Math.min(blockLen, len - pos);
      if (take === blockLen && o32 && d32) {
        const pos32 = pos / 4;
        if (pos % 4 !== 0)
          throw new Error("Salsa/ChaCha: invalid block position");
        for (let j = 0; j < blockLen32; j++)
          o32[pos32 + j] = d32[pos32 + j] ^ b32[j];
        pos += blockLen;
        continue;
      }
      for (let j = 0; j < take; j++)
        output8[pos + j] = data[pos + j] ^ block[j];
      pos += take;
    }
    for (let i2 = 0; i2 < toClean.length; i2++)
      toClean[i2].fill(0);
    return output8;
  };
};

// node_modules/@noble/ciphers/esm/chacha.js
var rotl2 = (a, b) => a << b | a >>> 32 - b;
function chachaCore(c, k, n, out, cnt, rounds = 20) {
  let y00 = c[0], y01 = c[1], y02 = c[2], y03 = c[3];
  let y04 = k[0], y05 = k[1], y06 = k[2], y07 = k[3];
  let y08 = k[4], y09 = k[5], y10 = k[6], y11 = k[7];
  let y12 = cnt, y13 = n[0], y14 = n[1], y15 = n[2];
  let x00 = y00, x01 = y01, x02 = y02, x03 = y03, x04 = y04, x05 = y05, x06 = y06, x07 = y07, x08 = y08, x09 = y09, x10 = y10, x11 = y11, x12 = y12, x13 = y13, x14 = y14, x15 = y15;
  for (let i2 = 0; i2 < rounds; i2 += 2) {
    x00 = x00 + x04 | 0;
    x12 = rotl2(x12 ^ x00, 16);
    x08 = x08 + x12 | 0;
    x04 = rotl2(x04 ^ x08, 12);
    x00 = x00 + x04 | 0;
    x12 = rotl2(x12 ^ x00, 8);
    x08 = x08 + x12 | 0;
    x04 = rotl2(x04 ^ x08, 7);
    x01 = x01 + x05 | 0;
    x13 = rotl2(x13 ^ x01, 16);
    x09 = x09 + x13 | 0;
    x05 = rotl2(x05 ^ x09, 12);
    x01 = x01 + x05 | 0;
    x13 = rotl2(x13 ^ x01, 8);
    x09 = x09 + x13 | 0;
    x05 = rotl2(x05 ^ x09, 7);
    x02 = x02 + x06 | 0;
    x14 = rotl2(x14 ^ x02, 16);
    x10 = x10 + x14 | 0;
    x06 = rotl2(x06 ^ x10, 12);
    x02 = x02 + x06 | 0;
    x14 = rotl2(x14 ^ x02, 8);
    x10 = x10 + x14 | 0;
    x06 = rotl2(x06 ^ x10, 7);
    x03 = x03 + x07 | 0;
    x15 = rotl2(x15 ^ x03, 16);
    x11 = x11 + x15 | 0;
    x07 = rotl2(x07 ^ x11, 12);
    x03 = x03 + x07 | 0;
    x15 = rotl2(x15 ^ x03, 8);
    x11 = x11 + x15 | 0;
    x07 = rotl2(x07 ^ x11, 7);
    x00 = x00 + x05 | 0;
    x15 = rotl2(x15 ^ x00, 16);
    x10 = x10 + x15 | 0;
    x05 = rotl2(x05 ^ x10, 12);
    x00 = x00 + x05 | 0;
    x15 = rotl2(x15 ^ x00, 8);
    x10 = x10 + x15 | 0;
    x05 = rotl2(x05 ^ x10, 7);
    x01 = x01 + x06 | 0;
    x12 = rotl2(x12 ^ x01, 16);
    x11 = x11 + x12 | 0;
    x06 = rotl2(x06 ^ x11, 12);
    x01 = x01 + x06 | 0;
    x12 = rotl2(x12 ^ x01, 8);
    x11 = x11 + x12 | 0;
    x06 = rotl2(x06 ^ x11, 7);
    x02 = x02 + x07 | 0;
    x13 = rotl2(x13 ^ x02, 16);
    x08 = x08 + x13 | 0;
    x07 = rotl2(x07 ^ x08, 12);
    x02 = x02 + x07 | 0;
    x13 = rotl2(x13 ^ x02, 8);
    x08 = x08 + x13 | 0;
    x07 = rotl2(x07 ^ x08, 7);
    x03 = x03 + x04 | 0;
    x14 = rotl2(x14 ^ x03, 16);
    x09 = x09 + x14 | 0;
    x04 = rotl2(x04 ^ x09, 12);
    x03 = x03 + x04 | 0;
    x14 = rotl2(x14 ^ x03, 8);
    x09 = x09 + x14 | 0;
    x04 = rotl2(x04 ^ x09, 7);
  }
  let oi = 0;
  out[oi++] = y00 + x00 | 0;
  out[oi++] = y01 + x01 | 0;
  out[oi++] = y02 + x02 | 0;
  out[oi++] = y03 + x03 | 0;
  out[oi++] = y04 + x04 | 0;
  out[oi++] = y05 + x05 | 0;
  out[oi++] = y06 + x06 | 0;
  out[oi++] = y07 + x07 | 0;
  out[oi++] = y08 + x08 | 0;
  out[oi++] = y09 + x09 | 0;
  out[oi++] = y10 + x10 | 0;
  out[oi++] = y11 + x11 | 0;
  out[oi++] = y12 + x12 | 0;
  out[oi++] = y13 + x13 | 0;
  out[oi++] = y14 + x14 | 0;
  out[oi++] = y15 + x15 | 0;
}
var chacha20 = /* @__PURE__ */ salsaBasic({
  core: chachaCore,
  counterRight: false,
  counterLen: 4,
  allow128bitKeys: false
});

// node_modules/@nostr-dev-kit/ndk/node_modules/@noble/hashes/esm/hmac.js
var HMAC3 = class extends Hash2 {
  constructor(hash8, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    assert_default2.hash(hash8);
    const key = toBytes2(_key);
    this.iHash = hash8.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad2 = new Uint8Array(blockLen);
    pad2.set(key.length > blockLen ? hash8.create().update(key).digest() : key);
    for (let i2 = 0; i2 < pad2.length; i2++)
      pad2[i2] ^= 54;
    this.iHash.update(pad2);
    this.oHash = hash8.create();
    for (let i2 = 0; i2 < pad2.length; i2++)
      pad2[i2] ^= 54 ^ 92;
    this.oHash.update(pad2);
    pad2.fill(0);
  }
  update(buf) {
    assert_default2.exists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    assert_default2.exists(this);
    assert_default2.bytes(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac3 = (hash8, key, message) => new HMAC3(hash8, key).update(message).digest();
hmac3.create = (hash8, key) => new HMAC3(hash8, key);

// node_modules/@nostr-dev-kit/ndk/node_modules/@noble/hashes/esm/hkdf.js
function extract(hash8, ikm, salt2) {
  assert_default2.hash(hash8);
  if (salt2 === void 0)
    salt2 = new Uint8Array(hash8.outputLen);
  return hmac3(hash8, toBytes2(salt2), toBytes2(ikm));
}
var HKDF_COUNTER = new Uint8Array([0]);
var EMPTY_BUFFER = new Uint8Array();
function expand(hash8, prk, info, length = 32) {
  assert_default2.hash(hash8);
  assert_default2.number(length);
  if (length > 255 * hash8.outputLen)
    throw new Error("Length should be <= 255*HashLen");
  const blocks = Math.ceil(length / hash8.outputLen);
  if (info === void 0)
    info = EMPTY_BUFFER;
  const okm = new Uint8Array(blocks * hash8.outputLen);
  const HMAC7 = hmac3.create(hash8, prk);
  const HMACTmp = HMAC7._cloneInto();
  const T = new Uint8Array(HMAC7.outputLen);
  for (let counter = 0; counter < blocks; counter++) {
    HKDF_COUNTER[0] = counter + 1;
    HMACTmp.update(counter === 0 ? EMPTY_BUFFER : T).update(info).update(HKDF_COUNTER).digestInto(T);
    okm.set(T, hash8.outputLen * counter);
    HMAC7._cloneInto(HMACTmp);
  }
  HMAC7.destroy();
  HMACTmp.destroy();
  T.fill(0);
  HKDF_COUNTER.fill(0);
  return okm.slice(0, length);
}
var hkdf = (hash8, ikm, salt2, info, length) => expand(hash8, extract(hash8, ikm, salt2), info, length);

// node_modules/@nostr-dev-kit/ndk/node_modules/nostr-tools/lib/esm/index.js
var __defProp2 = Object.defineProperty;
var __export2 = (target, all) => {
  for (var name in all)
    __defProp2(target, name, { get: all[name], enumerable: true });
};
function getPublicKey(privateKey) {
  return bytesToHex2(schnorr.getPublicKey(privateKey));
}
var utils_exports2 = {};
__export2(utils_exports2, {
  MessageNode: () => MessageNode,
  MessageQueue: () => MessageQueue,
  insertEventIntoAscendingList: () => insertEventIntoAscendingList,
  insertEventIntoDescendingList: () => insertEventIntoDescendingList,
  normalizeURL: () => normalizeURL,
  utf8Decoder: () => utf8Decoder,
  utf8Encoder: () => utf8Encoder
});
var utf8Decoder = new TextDecoder("utf-8");
var utf8Encoder = new TextEncoder();
function normalizeURL(url) {
  let p = new URL(url);
  p.pathname = p.pathname.replace(/\/+/g, "/");
  if (p.pathname.endsWith("/"))
    p.pathname = p.pathname.slice(0, -1);
  if (p.port === "80" && p.protocol === "ws:" || p.port === "443" && p.protocol === "wss:")
    p.port = "";
  p.searchParams.sort();
  p.hash = "";
  return p.toString();
}
function insertEventIntoDescendingList(sortedArray, event) {
  var _a2;
  let start = 0;
  let end = sortedArray.length - 1;
  let midPoint;
  let position = start;
  if (end < 0) {
    position = 0;
  } else if (event.created_at < sortedArray[end].created_at) {
    position = end + 1;
  } else if (event.created_at >= sortedArray[start].created_at) {
    position = start;
  } else
    while (true) {
      if (end <= start + 1) {
        position = end;
        break;
      }
      midPoint = Math.floor(start + (end - start) / 2);
      if (sortedArray[midPoint].created_at > event.created_at) {
        start = midPoint;
      } else if (sortedArray[midPoint].created_at < event.created_at) {
        end = midPoint;
      } else {
        position = midPoint;
        break;
      }
    }
  if (((_a2 = sortedArray[position]) == null ? void 0 : _a2.id) !== event.id) {
    return [...sortedArray.slice(0, position), event, ...sortedArray.slice(position)];
  }
  return sortedArray;
}
function insertEventIntoAscendingList(sortedArray, event) {
  var _a2;
  let start = 0;
  let end = sortedArray.length - 1;
  let midPoint;
  let position = start;
  if (end < 0) {
    position = 0;
  } else if (event.created_at > sortedArray[end].created_at) {
    position = end + 1;
  } else if (event.created_at <= sortedArray[start].created_at) {
    position = start;
  } else
    while (true) {
      if (end <= start + 1) {
        position = end;
        break;
      }
      midPoint = Math.floor(start + (end - start) / 2);
      if (sortedArray[midPoint].created_at < event.created_at) {
        start = midPoint;
      } else if (sortedArray[midPoint].created_at > event.created_at) {
        end = midPoint;
      } else {
        position = midPoint;
        break;
      }
    }
  if (((_a2 = sortedArray[position]) == null ? void 0 : _a2.id) !== event.id) {
    return [...sortedArray.slice(0, position), event, ...sortedArray.slice(position)];
  }
  return sortedArray;
}
var MessageNode = class {
  _value;
  _next;
  get value() {
    return this._value;
  }
  set value(message) {
    this._value = message;
  }
  get next() {
    return this._next;
  }
  set next(node) {
    this._next = node;
  }
  constructor(message) {
    this._value = message;
    this._next = null;
  }
};
var MessageQueue = class {
  _first;
  _last;
  get first() {
    return this._first;
  }
  set first(messageNode) {
    this._first = messageNode;
  }
  get last() {
    return this._last;
  }
  set last(messageNode) {
    this._last = messageNode;
  }
  _size;
  get size() {
    return this._size;
  }
  set size(v) {
    this._size = v;
  }
  constructor() {
    this._first = null;
    this._last = null;
    this._size = 0;
  }
  enqueue(message) {
    const newNode = new MessageNode(message);
    if (this._size === 0 || !this._last) {
      this._first = newNode;
      this._last = newNode;
    } else {
      this._last.next = newNode;
      this._last = newNode;
    }
    this._size++;
    return true;
  }
  dequeue() {
    if (this._size === 0 || !this._first)
      return null;
    let prev = this._first;
    this._first = prev.next;
    prev.next = null;
    this._size--;
    return prev.value;
  }
};
var verifiedSymbol = Symbol("verified");
function getBlankEvent(kind = 255) {
  return {
    kind,
    content: "",
    tags: [],
    created_at: 0
  };
}
function finishEvent(t, privateKey) {
  const event = t;
  event.pubkey = getPublicKey(privateKey);
  event.id = getEventHash(event);
  event.sig = getSignature(event, privateKey);
  event[verifiedSymbol] = true;
  return event;
}
function serializeEvent(evt) {
  if (!validateEvent(evt))
    throw new Error("can't serialize event with wrong or missing properties");
  return JSON.stringify([0, evt.pubkey, evt.created_at, evt.kind, evt.tags, evt.content]);
}
function getEventHash(event) {
  let eventHash = sha2562(utf8Encoder.encode(serializeEvent(event)));
  return bytesToHex2(eventHash);
}
var isRecord = (obj) => obj instanceof Object;
function validateEvent(event) {
  if (!isRecord(event))
    return false;
  if (typeof event.kind !== "number")
    return false;
  if (typeof event.content !== "string")
    return false;
  if (typeof event.created_at !== "number")
    return false;
  if (typeof event.pubkey !== "string")
    return false;
  if (!event.pubkey.match(/^[a-f0-9]{64}$/))
    return false;
  if (!Array.isArray(event.tags))
    return false;
  for (let i2 = 0; i2 < event.tags.length; i2++) {
    let tag = event.tags[i2];
    if (!Array.isArray(tag))
      return false;
    for (let j = 0; j < tag.length; j++) {
      if (typeof tag[j] === "object")
        return false;
    }
  }
  return true;
}
function verifySignature(event) {
  if (typeof event[verifiedSymbol] === "boolean")
    return event[verifiedSymbol];
  const hash8 = getEventHash(event);
  if (hash8 !== event.id) {
    return event[verifiedSymbol] = false;
  }
  try {
    return event[verifiedSymbol] = schnorr.verify(event.sig, hash8, event.pubkey);
  } catch (err) {
    return event[verifiedSymbol] = false;
  }
}
function getSignature(event, key) {
  return bytesToHex2(schnorr.sign(getEventHash(event), key));
}
function matchFilter(filter, event) {
  if (filter.ids && filter.ids.indexOf(event.id) === -1) {
    if (!filter.ids.some((prefix) => event.id.startsWith(prefix))) {
      return false;
    }
  }
  if (filter.kinds && filter.kinds.indexOf(event.kind) === -1)
    return false;
  if (filter.authors && filter.authors.indexOf(event.pubkey) === -1) {
    if (!filter.authors.some((prefix) => event.pubkey.startsWith(prefix))) {
      return false;
    }
  }
  for (let f2 in filter) {
    if (f2[0] === "#") {
      let tagName = f2.slice(1);
      let values = filter[`#${tagName}`];
      if (values && !event.tags.find(([t, v]) => t === f2.slice(1) && values.indexOf(v) !== -1))
        return false;
    }
  }
  if (filter.since && event.created_at < filter.since)
    return false;
  if (filter.until && event.created_at > filter.until)
    return false;
  return true;
}
function matchFilters(filters, event) {
  for (let i2 = 0; i2 < filters.length; i2++) {
    if (matchFilter(filters[i2], event))
      return true;
  }
  return false;
}
var fakejson_exports = {};
__export2(fakejson_exports, {
  getHex64: () => getHex64,
  getInt: () => getInt,
  getSubscriptionId: () => getSubscriptionId,
  matchEventId: () => matchEventId,
  matchEventKind: () => matchEventKind,
  matchEventPubkey: () => matchEventPubkey
});
function getHex64(json, field) {
  let len = field.length + 3;
  let idx = json.indexOf(`"${field}":`) + len;
  let s = json.slice(idx).indexOf(`"`) + idx + 1;
  return json.slice(s, s + 64);
}
function getInt(json, field) {
  let len = field.length;
  let idx = json.indexOf(`"${field}":`) + len + 3;
  let sliced = json.slice(idx);
  let end = Math.min(sliced.indexOf(","), sliced.indexOf("}"));
  return parseInt(sliced.slice(0, end), 10);
}
function getSubscriptionId(json) {
  let idx = json.slice(0, 22).indexOf(`"EVENT"`);
  if (idx === -1)
    return null;
  let pstart = json.slice(idx + 7 + 1).indexOf(`"`);
  if (pstart === -1)
    return null;
  let start = idx + 7 + 1 + pstart;
  let pend = json.slice(start + 1, 80).indexOf(`"`);
  if (pend === -1)
    return null;
  let end = start + 1 + pend;
  return json.slice(start + 1, end);
}
function matchEventId(json, id) {
  return id === getHex64(json, "id");
}
function matchEventPubkey(json, pubkey) {
  return pubkey === getHex64(json, "pubkey");
}
function matchEventKind(json, kind) {
  return kind === getInt(json, "kind");
}
var newListeners = () => ({
  connect: [],
  disconnect: [],
  error: [],
  notice: [],
  auth: []
});
function relayInit(url, options = {}) {
  let { listTimeout = 3e3, getTimeout = 3e3, countTimeout = 3e3 } = options;
  var ws;
  var openSubs = {};
  var listeners = newListeners();
  var subListeners = {};
  var pubListeners = {};
  var connectionPromise;
  async function connectRelay() {
    if (connectionPromise)
      return connectionPromise;
    connectionPromise = new Promise((resolve, reject) => {
      try {
        ws = new WebSocket(url);
      } catch (err) {
        reject(err);
      }
      ws.onopen = () => {
        listeners.connect.forEach((cb) => cb());
        resolve();
      };
      ws.onerror = () => {
        connectionPromise = void 0;
        listeners.error.forEach((cb) => cb());
        reject();
      };
      ws.onclose = async () => {
        connectionPromise = void 0;
        listeners.disconnect.forEach((cb) => cb());
      };
      let incomingMessageQueue = new MessageQueue();
      let handleNextInterval;
      ws.onmessage = (e) => {
        incomingMessageQueue.enqueue(e.data);
        if (!handleNextInterval) {
          handleNextInterval = setInterval(handleNext, 0);
        }
      };
      function handleNext() {
        var _a2, _b, _c;
        if (incomingMessageQueue.size === 0) {
          clearInterval(handleNextInterval);
          handleNextInterval = null;
          return;
        }
        var json = incomingMessageQueue.dequeue();
        if (!json)
          return;
        let subid = getSubscriptionId(json);
        if (subid) {
          let so = openSubs[subid];
          if (so && so.alreadyHaveEvent && so.alreadyHaveEvent(getHex64(json, "id"), url)) {
            return;
          }
        }
        try {
          let data = JSON.parse(json);
          switch (data[0]) {
            case "EVENT": {
              let id2 = data[1];
              let event = data[2];
              if (validateEvent(event) && openSubs[id2] && (openSubs[id2].skipVerification || verifySignature(event)) && matchFilters(openSubs[id2].filters, event)) {
                openSubs[id2];
                (((_a2 = subListeners[id2]) == null ? void 0 : _a2.event) || []).forEach((cb) => cb(event));
              }
              return;
            }
            case "COUNT":
              let id = data[1];
              let payload = data[2];
              if (openSubs[id]) {
                ;
                (((_b = subListeners[id]) == null ? void 0 : _b.count) || []).forEach((cb) => cb(payload));
              }
              return;
            case "EOSE": {
              let id2 = data[1];
              if (id2 in subListeners) {
                subListeners[id2].eose.forEach((cb) => cb());
                subListeners[id2].eose = [];
              }
              return;
            }
            case "OK": {
              let id2 = data[1];
              let ok = data[2];
              let reason = data[3] || "";
              if (id2 in pubListeners) {
                let { resolve: resolve2, reject: reject2 } = pubListeners[id2];
                if (ok)
                  resolve2(null);
                else
                  reject2(new Error(reason));
              }
              return;
            }
            case "NOTICE":
              let notice = data[1];
              listeners.notice.forEach((cb) => cb(notice));
              return;
            case "AUTH": {
              let challenge3 = data[1];
              (_c = listeners.auth) == null ? void 0 : _c.forEach((cb) => cb(challenge3));
              return;
            }
          }
        } catch (err) {
          return;
        }
      }
    });
    return connectionPromise;
  }
  function connected() {
    return (ws == null ? void 0 : ws.readyState) === 1;
  }
  async function connect() {
    if (connected())
      return;
    await connectRelay();
  }
  async function trySend(params) {
    let msg = JSON.stringify(params);
    if (!connected()) {
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      if (!connected()) {
        return;
      }
    }
    try {
      ws.send(msg);
    } catch (err) {
      console.log(err);
    }
  }
  const sub = (filters, {
    verb = "REQ",
    skipVerification = false,
    alreadyHaveEvent = null,
    id = Math.random().toString().slice(2)
  } = {}) => {
    let subid = id;
    openSubs[subid] = {
      id: subid,
      filters,
      skipVerification,
      alreadyHaveEvent
    };
    trySend([verb, subid, ...filters]);
    let subscription = {
      sub: (newFilters, newOpts = {}) => sub(newFilters || filters, {
        skipVerification: newOpts.skipVerification || skipVerification,
        alreadyHaveEvent: newOpts.alreadyHaveEvent || alreadyHaveEvent,
        id: subid
      }),
      unsub: () => {
        delete openSubs[subid];
        delete subListeners[subid];
        trySend(["CLOSE", subid]);
      },
      on: (type2, cb) => {
        subListeners[subid] = subListeners[subid] || {
          event: [],
          count: [],
          eose: []
        };
        subListeners[subid][type2].push(cb);
      },
      off: (type2, cb) => {
        let listeners2 = subListeners[subid];
        let idx = listeners2[type2].indexOf(cb);
        if (idx >= 0)
          listeners2[type2].splice(idx, 1);
      },
      get events() {
        return eventsGenerator(subscription);
      }
    };
    return subscription;
  };
  function _publishEvent(event, type2) {
    return new Promise((resolve, reject) => {
      if (!event.id) {
        reject(new Error(`event ${event} has no id`));
        return;
      }
      let id = event.id;
      trySend([type2, event]);
      pubListeners[id] = { resolve, reject };
    });
  }
  return {
    url,
    sub,
    on: (type2, cb) => {
      listeners[type2].push(cb);
      if (type2 === "connect" && (ws == null ? void 0 : ws.readyState) === 1) {
        ;
        cb();
      }
    },
    off: (type2, cb) => {
      let index = listeners[type2].indexOf(cb);
      if (index !== -1)
        listeners[type2].splice(index, 1);
    },
    list: (filters, opts) => new Promise((resolve) => {
      let s = sub(filters, opts);
      let events = [];
      let timeout = setTimeout(() => {
        s.unsub();
        resolve(events);
      }, listTimeout);
      s.on("eose", () => {
        s.unsub();
        clearTimeout(timeout);
        resolve(events);
      });
      s.on("event", (event) => {
        events.push(event);
      });
    }),
    get: (filter, opts) => new Promise((resolve) => {
      let s = sub([filter], opts);
      let timeout = setTimeout(() => {
        s.unsub();
        resolve(null);
      }, getTimeout);
      s.on("event", (event) => {
        s.unsub();
        clearTimeout(timeout);
        resolve(event);
      });
    }),
    count: (filters) => new Promise((resolve) => {
      let s = sub(filters, { ...sub, verb: "COUNT" });
      let timeout = setTimeout(() => {
        s.unsub();
        resolve(null);
      }, countTimeout);
      s.on("count", (event) => {
        s.unsub();
        clearTimeout(timeout);
        resolve(event);
      });
    }),
    async publish(event) {
      await _publishEvent(event, "EVENT");
    },
    async auth(event) {
      await _publishEvent(event, "AUTH");
    },
    connect,
    close() {
      listeners = newListeners();
      subListeners = {};
      pubListeners = {};
      if ((ws == null ? void 0 : ws.readyState) === WebSocket.OPEN) {
        ws.close();
      }
    },
    get status() {
      var _a2;
      return (_a2 = ws == null ? void 0 : ws.readyState) != null ? _a2 : 3;
    }
  };
}
async function* eventsGenerator(sub) {
  let nextResolve;
  const eventQueue = [];
  const pushToQueue = (event) => {
    if (nextResolve) {
      nextResolve(event);
      nextResolve = void 0;
    } else {
      eventQueue.push(event);
    }
  };
  sub.on("event", pushToQueue);
  try {
    while (true) {
      if (eventQueue.length > 0) {
        yield eventQueue.shift();
      } else {
        const event = await new Promise((resolve) => {
          nextResolve = resolve;
        });
        yield event;
      }
    }
  } finally {
    sub.off("event", pushToQueue);
  }
}
var nip19_exports = {};
__export2(nip19_exports, {
  BECH32_REGEX: () => BECH32_REGEX,
  decode: () => decode,
  naddrEncode: () => naddrEncode,
  neventEncode: () => neventEncode,
  noteEncode: () => noteEncode,
  nprofileEncode: () => nprofileEncode,
  npubEncode: () => npubEncode,
  nrelayEncode: () => nrelayEncode,
  nsecEncode: () => nsecEncode
});
var Bech32MaxSize = 5e3;
var BECH32_REGEX = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function integerToUint8Array(number8) {
  const uint8Array = new Uint8Array(4);
  uint8Array[0] = number8 >> 24 & 255;
  uint8Array[1] = number8 >> 16 & 255;
  uint8Array[2] = number8 >> 8 & 255;
  uint8Array[3] = number8 & 255;
  return uint8Array;
}
function decode(nip19) {
  var _a2, _b, _c, _d, _e, _f, _g, _h;
  let { prefix, words } = bech32.decode(nip19, Bech32MaxSize);
  let data = new Uint8Array(bech32.fromWords(words));
  switch (prefix) {
    case "nprofile": {
      let tlv = parseTLV(data);
      if (!((_a2 = tlv[0]) == null ? void 0 : _a2[0]))
        throw new Error("missing TLV 0 for nprofile");
      if (tlv[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      return {
        type: "nprofile",
        data: {
          pubkey: bytesToHex2(tlv[0][0]),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : []
        }
      };
    }
    case "nevent": {
      let tlv = parseTLV(data);
      if (!((_b = tlv[0]) == null ? void 0 : _b[0]))
        throw new Error("missing TLV 0 for nevent");
      if (tlv[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      if (tlv[2] && tlv[2][0].length !== 32)
        throw new Error("TLV 2 should be 32 bytes");
      if (tlv[3] && tlv[3][0].length !== 4)
        throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "nevent",
        data: {
          id: bytesToHex2(tlv[0][0]),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : [],
          author: ((_c = tlv[2]) == null ? void 0 : _c[0]) ? bytesToHex2(tlv[2][0]) : void 0,
          kind: ((_d = tlv[3]) == null ? void 0 : _d[0]) ? parseInt(bytesToHex2(tlv[3][0]), 16) : void 0
        }
      };
    }
    case "naddr": {
      let tlv = parseTLV(data);
      if (!((_e = tlv[0]) == null ? void 0 : _e[0]))
        throw new Error("missing TLV 0 for naddr");
      if (!((_f = tlv[2]) == null ? void 0 : _f[0]))
        throw new Error("missing TLV 2 for naddr");
      if (tlv[2][0].length !== 32)
        throw new Error("TLV 2 should be 32 bytes");
      if (!((_g = tlv[3]) == null ? void 0 : _g[0]))
        throw new Error("missing TLV 3 for naddr");
      if (tlv[3][0].length !== 4)
        throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "naddr",
        data: {
          identifier: utf8Decoder.decode(tlv[0][0]),
          pubkey: bytesToHex2(tlv[2][0]),
          kind: parseInt(bytesToHex2(tlv[3][0]), 16),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : []
        }
      };
    }
    case "nrelay": {
      let tlv = parseTLV(data);
      if (!((_h = tlv[0]) == null ? void 0 : _h[0]))
        throw new Error("missing TLV 0 for nrelay");
      return {
        type: "nrelay",
        data: utf8Decoder.decode(tlv[0][0])
      };
    }
    case "nsec":
    case "npub":
    case "note":
      return { type: prefix, data: bytesToHex2(data) };
    default:
      throw new Error(`unknown prefix ${prefix}`);
  }
}
function parseTLV(data) {
  let result = {};
  let rest = data;
  while (rest.length > 0) {
    let t = rest[0];
    let l = rest[1];
    if (!l)
      throw new Error(`malformed TLV ${t}`);
    let v = rest.slice(2, 2 + l);
    rest = rest.slice(2 + l);
    if (v.length < l)
      throw new Error(`not enough data to read on TLV ${t}`);
    result[t] = result[t] || [];
    result[t].push(v);
  }
  return result;
}
function nsecEncode(hex5) {
  return encodeBytes("nsec", hex5);
}
function npubEncode(hex5) {
  return encodeBytes("npub", hex5);
}
function noteEncode(hex5) {
  return encodeBytes("note", hex5);
}
function encodeBech32(prefix, data) {
  let words = bech32.toWords(data);
  return bech32.encode(prefix, words, Bech32MaxSize);
}
function encodeBytes(prefix, hex5) {
  let data = hexToBytes2(hex5);
  return encodeBech32(prefix, data);
}
function nprofileEncode(profile) {
  let data = encodeTLV({
    0: [hexToBytes2(profile.pubkey)],
    1: (profile.relays || []).map((url) => utf8Encoder.encode(url))
  });
  return encodeBech32("nprofile", data);
}
function neventEncode(event) {
  let kindArray;
  if (event.kind != void 0) {
    kindArray = integerToUint8Array(event.kind);
  }
  let data = encodeTLV({
    0: [hexToBytes2(event.id)],
    1: (event.relays || []).map((url) => utf8Encoder.encode(url)),
    2: event.author ? [hexToBytes2(event.author)] : [],
    3: kindArray ? [new Uint8Array(kindArray)] : []
  });
  return encodeBech32("nevent", data);
}
function naddrEncode(addr) {
  let kind = new ArrayBuffer(4);
  new DataView(kind).setUint32(0, addr.kind, false);
  let data = encodeTLV({
    0: [utf8Encoder.encode(addr.identifier)],
    1: (addr.relays || []).map((url) => utf8Encoder.encode(url)),
    2: [hexToBytes2(addr.pubkey)],
    3: [new Uint8Array(kind)]
  });
  return encodeBech32("naddr", data);
}
function nrelayEncode(url) {
  let data = encodeTLV({
    0: [utf8Encoder.encode(url)]
  });
  return encodeBech32("nrelay", data);
}
function encodeTLV(tlv) {
  let entries = [];
  Object.entries(tlv).forEach(([t, vs]) => {
    vs.forEach((v) => {
      let entry = new Uint8Array(v.length + 2);
      entry.set([parseInt(t)], 0);
      entry.set([v.length], 1);
      entry.set(v, 2);
      entries.push(entry);
    });
  });
  return concatBytes3(...entries);
}
var nip04_exports = {};
__export2(nip04_exports, {
  decrypt: () => decrypt,
  encrypt: () => encrypt
});
if (typeof crypto !== "undefined" && !crypto.subtle && crypto.webcrypto) {
  crypto.subtle = crypto.webcrypto.subtle;
}
async function encrypt(privkey, pubkey, text) {
  const key = secp256k1.getSharedSecret(privkey, "02" + pubkey);
  const normalizedKey = getNormalizedX(key);
  let iv = Uint8Array.from(randomBytes2(16));
  let plaintext = utf8Encoder.encode(text);
  let cryptoKey = await crypto.subtle.importKey("raw", normalizedKey, { name: "AES-CBC" }, false, ["encrypt"]);
  let ciphertext = await crypto.subtle.encrypt({ name: "AES-CBC", iv }, cryptoKey, plaintext);
  let ctb64 = base64.encode(new Uint8Array(ciphertext));
  let ivb64 = base64.encode(new Uint8Array(iv.buffer));
  return `${ctb64}?iv=${ivb64}`;
}
async function decrypt(privkey, pubkey, data) {
  let [ctb64, ivb64] = data.split("?iv=");
  let key = secp256k1.getSharedSecret(privkey, "02" + pubkey);
  let normalizedKey = getNormalizedX(key);
  let cryptoKey = await crypto.subtle.importKey("raw", normalizedKey, { name: "AES-CBC" }, false, ["decrypt"]);
  let ciphertext = base64.decode(ctb64);
  let iv = base64.decode(ivb64);
  let plaintext = await crypto.subtle.decrypt({ name: "AES-CBC", iv }, cryptoKey, ciphertext);
  let text = utf8Decoder.decode(plaintext);
  return text;
}
function getNormalizedX(key) {
  return key.slice(1, 33);
}
var nip05_exports = {};
__export2(nip05_exports, {
  NIP05_REGEX: () => NIP05_REGEX,
  queryProfile: () => queryProfile,
  searchDomain: () => searchDomain,
  useFetchImplementation: () => useFetchImplementation
});
var NIP05_REGEX = /^(?:([\w.+-]+)@)?([\w.-]+)$/;
var _fetch;
try {
  _fetch = fetch;
} catch {
}
function useFetchImplementation(fetchImplementation) {
  _fetch = fetchImplementation;
}
async function searchDomain(domain, query = "") {
  try {
    let res = await (await _fetch(`https://${domain}/.well-known/nostr.json?name=${query}`)).json();
    return res.names;
  } catch (_) {
    return {};
  }
}
async function queryProfile(fullname) {
  const match = fullname.match(NIP05_REGEX);
  if (!match)
    return null;
  const [_, name = "_", domain] = match;
  try {
    const res = await _fetch(`https://${domain}/.well-known/nostr.json?name=${name}`);
    const { names, relays } = parseNIP05Result(await res.json());
    const pubkey = names[name];
    return pubkey ? { pubkey, relays: relays == null ? void 0 : relays[pubkey] } : null;
  } catch (_e) {
    return null;
  }
}
function parseNIP05Result(json) {
  const result = {
    names: {}
  };
  for (const [name, pubkey] of Object.entries(json.names)) {
    if (typeof name === "string" && typeof pubkey === "string") {
      result.names[name] = pubkey;
    }
  }
  if (json.relays) {
    result.relays = {};
    for (const [pubkey, relays] of Object.entries(json.relays)) {
      if (typeof pubkey === "string" && Array.isArray(relays)) {
        result.relays[pubkey] = relays.filter((relay) => typeof relay === "string");
      }
    }
  }
  return result;
}
var nip06_exports = {};
__export2(nip06_exports, {
  generateSeedWords: () => generateSeedWords,
  privateKeyFromSeedWords: () => privateKeyFromSeedWords,
  validateWords: () => validateWords
});
function privateKeyFromSeedWords(mnemonic, passphrase) {
  let root = HDKey.fromMasterSeed(mnemonicToSeedSync(mnemonic, passphrase));
  let privateKey = root.derive(`m/44'/1237'/0'/0/0`).privateKey;
  if (!privateKey)
    throw new Error("could not derive private key");
  return bytesToHex2(privateKey);
}
function generateSeedWords() {
  return generateMnemonic(wordlist);
}
function validateWords(words) {
  return validateMnemonic(words, wordlist);
}
var nip10_exports = {};
__export2(nip10_exports, {
  parse: () => parse
});
function parse(event) {
  const result = {
    reply: void 0,
    root: void 0,
    mentions: [],
    profiles: []
  };
  const eTags = [];
  for (const tag of event.tags) {
    if (tag[0] === "e" && tag[1]) {
      eTags.push(tag);
    }
    if (tag[0] === "p" && tag[1]) {
      result.profiles.push({
        pubkey: tag[1],
        relays: tag[2] ? [tag[2]] : []
      });
    }
  }
  for (let eTagIndex = 0; eTagIndex < eTags.length; eTagIndex++) {
    const eTag = eTags[eTagIndex];
    const [_, eTagEventId, eTagRelayUrl, eTagMarker] = eTag;
    const eventPointer = {
      id: eTagEventId,
      relays: eTagRelayUrl ? [eTagRelayUrl] : []
    };
    const isFirstETag = eTagIndex === 0;
    const isLastETag = eTagIndex === eTags.length - 1;
    if (eTagMarker === "root") {
      result.root = eventPointer;
      continue;
    }
    if (eTagMarker === "reply") {
      result.reply = eventPointer;
      continue;
    }
    if (eTagMarker === "mention") {
      result.mentions.push(eventPointer);
      continue;
    }
    if (isFirstETag) {
      result.root = eventPointer;
      continue;
    }
    if (isLastETag) {
      result.reply = eventPointer;
      continue;
    }
    result.mentions.push(eventPointer);
  }
  return result;
}
var nip13_exports = {};
__export2(nip13_exports, {
  getPow: () => getPow,
  minePow: () => minePow
});
function getPow(hex5) {
  let count = 0;
  for (let i2 = 0; i2 < hex5.length; i2++) {
    const nibble = parseInt(hex5[i2], 16);
    if (nibble === 0) {
      count += 4;
    } else {
      count += Math.clz32(nibble) - 28;
      break;
    }
  }
  return count;
}
function minePow(unsigned, difficulty) {
  let count = 0;
  const event = unsigned;
  const tag = ["nonce", count.toString(), difficulty.toString()];
  event.tags.push(tag);
  while (true) {
    const now2 = Math.floor(new Date().getTime() / 1e3);
    if (now2 !== event.created_at) {
      count = 0;
      event.created_at = now2;
    }
    tag[1] = (++count).toString();
    event.id = getEventHash(event);
    if (getPow(event.id) >= difficulty) {
      break;
    }
  }
  return event;
}
var nip18_exports = {};
__export2(nip18_exports, {
  finishRepostEvent: () => finishRepostEvent,
  getRepostedEvent: () => getRepostedEvent,
  getRepostedEventPointer: () => getRepostedEventPointer
});
function finishRepostEvent(t, reposted, relayUrl, privateKey) {
  var _a2;
  return finishEvent(
    {
      kind: 6,
      tags: [...(_a2 = t.tags) != null ? _a2 : [], ["e", reposted.id, relayUrl], ["p", reposted.pubkey]],
      content: t.content === "" ? "" : JSON.stringify(reposted),
      created_at: t.created_at
    },
    privateKey
  );
}
function getRepostedEventPointer(event) {
  if (event.kind !== 6) {
    return void 0;
  }
  let lastETag;
  let lastPTag;
  for (let i2 = event.tags.length - 1; i2 >= 0 && (lastETag === void 0 || lastPTag === void 0); i2--) {
    const tag = event.tags[i2];
    if (tag.length >= 2) {
      if (tag[0] === "e" && lastETag === void 0) {
        lastETag = tag;
      } else if (tag[0] === "p" && lastPTag === void 0) {
        lastPTag = tag;
      }
    }
  }
  if (lastETag === void 0) {
    return void 0;
  }
  return {
    id: lastETag[1],
    relays: [lastETag[2], lastPTag == null ? void 0 : lastPTag[2]].filter((x) => typeof x === "string"),
    author: lastPTag == null ? void 0 : lastPTag[1]
  };
}
function getRepostedEvent(event, { skipVerification } = {}) {
  const pointer = getRepostedEventPointer(event);
  if (pointer === void 0 || event.content === "") {
    return void 0;
  }
  let repostedEvent;
  try {
    repostedEvent = JSON.parse(event.content);
  } catch (error) {
    return void 0;
  }
  if (repostedEvent.id !== pointer.id) {
    return void 0;
  }
  if (!skipVerification && !verifySignature(repostedEvent)) {
    return void 0;
  }
  return repostedEvent;
}
var nip21_exports = {};
__export2(nip21_exports, {
  NOSTR_URI_REGEX: () => NOSTR_URI_REGEX,
  parse: () => parse2,
  test: () => test
});
var NOSTR_URI_REGEX = new RegExp(`nostr:(${BECH32_REGEX.source})`);
function test(value) {
  return typeof value === "string" && new RegExp(`^${NOSTR_URI_REGEX.source}$`).test(value);
}
function parse2(uri) {
  const match = uri.match(new RegExp(`^${NOSTR_URI_REGEX.source}$`));
  if (!match)
    throw new Error(`Invalid Nostr URI: ${uri}`);
  return {
    uri: match[0],
    value: match[1],
    decoded: decode(match[1])
  };
}
var nip25_exports = {};
__export2(nip25_exports, {
  finishReactionEvent: () => finishReactionEvent,
  getReactedEventPointer: () => getReactedEventPointer
});
function finishReactionEvent(t, reacted, privateKey) {
  var _a2, _b;
  const inheritedTags = reacted.tags.filter((tag) => tag.length >= 2 && (tag[0] === "e" || tag[0] === "p"));
  return finishEvent(
    {
      ...t,
      kind: 7,
      tags: [...(_a2 = t.tags) != null ? _a2 : [], ...inheritedTags, ["e", reacted.id], ["p", reacted.pubkey]],
      content: (_b = t.content) != null ? _b : "+"
    },
    privateKey
  );
}
function getReactedEventPointer(event) {
  if (event.kind !== 7) {
    return void 0;
  }
  let lastETag;
  let lastPTag;
  for (let i2 = event.tags.length - 1; i2 >= 0 && (lastETag === void 0 || lastPTag === void 0); i2--) {
    const tag = event.tags[i2];
    if (tag.length >= 2) {
      if (tag[0] === "e" && lastETag === void 0) {
        lastETag = tag;
      } else if (tag[0] === "p" && lastPTag === void 0) {
        lastPTag = tag;
      }
    }
  }
  if (lastETag === void 0 || lastPTag === void 0) {
    return void 0;
  }
  return {
    id: lastETag[1],
    relays: [lastETag[2], lastPTag[2]].filter((x) => x !== void 0),
    author: lastPTag[1]
  };
}
var nip26_exports = {};
__export2(nip26_exports, {
  createDelegation: () => createDelegation,
  getDelegator: () => getDelegator
});
function createDelegation(privateKey, parameters) {
  let conditions = [];
  if ((parameters.kind || -1) >= 0)
    conditions.push(`kind=${parameters.kind}`);
  if (parameters.until)
    conditions.push(`created_at<${parameters.until}`);
  if (parameters.since)
    conditions.push(`created_at>${parameters.since}`);
  let cond = conditions.join("&");
  if (cond === "")
    throw new Error("refusing to create a delegation without any conditions");
  let sighash = sha2562(utf8Encoder.encode(`nostr:delegation:${parameters.pubkey}:${cond}`));
  let sig = bytesToHex2(schnorr.sign(sighash, privateKey));
  return {
    from: getPublicKey(privateKey),
    to: parameters.pubkey,
    cond,
    sig
  };
}
function getDelegator(event) {
  let tag = event.tags.find((tag2) => tag2[0] === "delegation" && tag2.length >= 4);
  if (!tag)
    return null;
  let pubkey = tag[1];
  let cond = tag[2];
  let sig = tag[3];
  let conditions = cond.split("&");
  for (let i2 = 0; i2 < conditions.length; i2++) {
    let [key, operator, value] = conditions[i2].split(/\b/);
    if (key === "kind" && operator === "=" && event.kind === parseInt(value))
      continue;
    else if (key === "created_at" && operator === "<" && event.created_at < parseInt(value))
      continue;
    else if (key === "created_at" && operator === ">" && event.created_at > parseInt(value))
      continue;
    else
      return null;
  }
  let sighash = sha2562(utf8Encoder.encode(`nostr:delegation:${event.pubkey}:${cond}`));
  if (!schnorr.verify(sig, sighash, pubkey))
    return null;
  return pubkey;
}
var nip27_exports = {};
__export2(nip27_exports, {
  matchAll: () => matchAll,
  regex: () => regex,
  replaceAll: () => replaceAll
});
var regex = () => new RegExp(`\\b${NOSTR_URI_REGEX.source}\\b`, "g");
function* matchAll(content) {
  const matches = content.matchAll(regex());
  for (const match of matches) {
    try {
      const [uri, value] = match;
      yield {
        uri,
        value,
        decoded: decode(value),
        start: match.index,
        end: match.index + uri.length
      };
    } catch (_e) {
    }
  }
}
function replaceAll(content, replacer) {
  return content.replaceAll(regex(), (uri, value) => {
    return replacer({
      uri,
      value,
      decoded: decode(value)
    });
  });
}
var nip28_exports = {};
__export2(nip28_exports, {
  channelCreateEvent: () => channelCreateEvent,
  channelHideMessageEvent: () => channelHideMessageEvent,
  channelMessageEvent: () => channelMessageEvent,
  channelMetadataEvent: () => channelMetadataEvent,
  channelMuteUserEvent: () => channelMuteUserEvent
});
var channelCreateEvent = (t, privateKey) => {
  var _a2;
  let content;
  if (typeof t.content === "object") {
    content = JSON.stringify(t.content);
  } else if (typeof t.content === "string") {
    content = t.content;
  } else {
    return void 0;
  }
  return finishEvent(
    {
      kind: 40,
      tags: [...(_a2 = t.tags) != null ? _a2 : []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelMetadataEvent = (t, privateKey) => {
  var _a2;
  let content;
  if (typeof t.content === "object") {
    content = JSON.stringify(t.content);
  } else if (typeof t.content === "string") {
    content = t.content;
  } else {
    return void 0;
  }
  return finishEvent(
    {
      kind: 41,
      tags: [["e", t.channel_create_event_id], ...(_a2 = t.tags) != null ? _a2 : []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelMessageEvent = (t, privateKey) => {
  var _a2;
  const tags = [["e", t.channel_create_event_id, t.relay_url, "root"]];
  if (t.reply_to_channel_message_event_id) {
    tags.push(["e", t.reply_to_channel_message_event_id, t.relay_url, "reply"]);
  }
  return finishEvent(
    {
      kind: 42,
      tags: [...tags, ...(_a2 = t.tags) != null ? _a2 : []],
      content: t.content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelHideMessageEvent = (t, privateKey) => {
  var _a2;
  let content;
  if (typeof t.content === "object") {
    content = JSON.stringify(t.content);
  } else if (typeof t.content === "string") {
    content = t.content;
  } else {
    return void 0;
  }
  return finishEvent(
    {
      kind: 43,
      tags: [["e", t.channel_message_event_id], ...(_a2 = t.tags) != null ? _a2 : []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelMuteUserEvent = (t, privateKey) => {
  var _a2;
  let content;
  if (typeof t.content === "object") {
    content = JSON.stringify(t.content);
  } else if (typeof t.content === "string") {
    content = t.content;
  } else {
    return void 0;
  }
  return finishEvent(
    {
      kind: 44,
      tags: [["p", t.pubkey_to_mute], ...(_a2 = t.tags) != null ? _a2 : []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var nip39_exports = {};
__export2(nip39_exports, {
  useFetchImplementation: () => useFetchImplementation2,
  validateGithub: () => validateGithub
});
var _fetch2;
try {
  _fetch2 = fetch;
} catch {
}
function useFetchImplementation2(fetchImplementation) {
  _fetch2 = fetchImplementation;
}
async function validateGithub(pubkey, username, proof) {
  try {
    let res = await (await _fetch2(`https://gist.github.com/${username}/${proof}/raw`)).text();
    return res === `Verifying that I control the following Nostr public key: ${pubkey}`;
  } catch (_) {
    return false;
  }
}
var nip42_exports = {};
__export2(nip42_exports, {
  authenticate: () => authenticate
});
var authenticate = async ({
  challenge: challenge3,
  relay,
  sign
}) => {
  const e = {
    kind: 22242,
    created_at: Math.floor(Date.now() / 1e3),
    tags: [
      ["relay", relay.url],
      ["challenge", challenge3]
    ],
    content: ""
  };
  return relay.auth(await sign(e));
};
var nip44_exports = {};
__export2(nip44_exports, {
  decrypt: () => decrypt2,
  encrypt: () => encrypt2,
  utils: () => utils2
});
var utils2 = {
  v2: {
    maxPlaintextSize: 65536 - 128,
    minCiphertextSize: 100,
    maxCiphertextSize: 102400,
    getConversationKey(privkeyA, pubkeyB) {
      const key = secp256k1.getSharedSecret(privkeyA, "02" + pubkeyB);
      return key.subarray(1, 33);
    },
    getMessageKeys(conversationKey, salt2) {
      const keys2 = hkdf(sha2562, conversationKey, salt2, "nip44-v2", 76);
      return {
        encryption: keys2.subarray(0, 32),
        nonce: keys2.subarray(32, 44),
        auth: keys2.subarray(44, 76)
      };
    },
    calcPadding(len) {
      if (!Number.isSafeInteger(len) || len < 0)
        throw new Error("expected positive integer");
      if (len <= 32)
        return 32;
      const nextpower = 1 << Math.floor(Math.log2(len - 1)) + 1;
      const chunk = nextpower <= 256 ? 32 : nextpower / 8;
      return chunk * (Math.floor((len - 1) / chunk) + 1);
    },
    pad(unpadded) {
      const unpaddedB = utf8Encoder.encode(unpadded);
      const len = unpaddedB.length;
      if (len < 1 || len >= utils2.v2.maxPlaintextSize)
        throw new Error("invalid plaintext length: must be between 1b and 64KB");
      const paddedLen = utils2.v2.calcPadding(len);
      const zeros = new Uint8Array(paddedLen - len);
      const lenBuf = new Uint8Array(2);
      new DataView(lenBuf.buffer).setUint16(0, len);
      return concatBytes3(lenBuf, unpaddedB, zeros);
    },
    unpad(padded) {
      const unpaddedLen = new DataView(padded.buffer).getUint16(0);
      const unpadded = padded.subarray(2, 2 + unpaddedLen);
      if (unpaddedLen === 0 || unpadded.length !== unpaddedLen || padded.length !== 2 + utils2.v2.calcPadding(unpaddedLen))
        throw new Error("invalid padding");
      return utf8Decoder.decode(unpadded);
    }
  }
};
function encrypt2(key, plaintext, options = {}) {
  var _a2, _b;
  const version = (_a2 = options.version) != null ? _a2 : 2;
  if (version !== 2)
    throw new Error("unknown encryption version " + version);
  const salt2 = (_b = options.salt) != null ? _b : randomBytes2(32);
  ensureBytes2(salt2, 32);
  const keys2 = utils2.v2.getMessageKeys(key, salt2);
  const padded = utils2.v2.pad(plaintext);
  const ciphertext = chacha20(keys2.encryption, keys2.nonce, padded);
  const mac = hmac3(sha2562, keys2.auth, ciphertext);
  return base64.encode(concatBytes3(new Uint8Array([version]), salt2, ciphertext, mac));
}
function decrypt2(key, ciphertext) {
  const u2 = utils2.v2;
  ensureBytes2(key, 32);
  const clen = ciphertext.length;
  if (clen < u2.minCiphertextSize || clen >= u2.maxCiphertextSize)
    throw new Error("invalid ciphertext length: " + clen);
  if (ciphertext[0] === "#")
    throw new Error("unknown encryption version");
  let data;
  try {
    data = base64.decode(ciphertext);
  } catch (error) {
    throw new Error("invalid base64: " + error.message);
  }
  const vers = data.subarray(0, 1)[0];
  if (vers !== 2)
    throw new Error("unknown encryption version " + vers);
  const salt2 = data.subarray(1, 33);
  const ciphertext_ = data.subarray(33, -32);
  const mac = data.subarray(-32);
  const keys2 = u2.getMessageKeys(key, salt2);
  const calculatedMac = hmac3(sha2562, keys2.auth, ciphertext_);
  if (!equalBytes2(calculatedMac, mac))
    throw new Error("invalid MAC");
  const padded = chacha20(keys2.encryption, keys2.nonce, ciphertext_);
  return u2.unpad(padded);
}
var nip47_exports = {};
__export2(nip47_exports, {
  makeNwcRequestEvent: () => makeNwcRequestEvent,
  parseConnectionString: () => parseConnectionString
});
function parseConnectionString(connectionString) {
  const { pathname, searchParams } = new URL(connectionString);
  const pubkey = pathname;
  const relay = searchParams.get("relay");
  const secret = searchParams.get("secret");
  if (!pubkey || !relay || !secret) {
    throw new Error("invalid connection string");
  }
  return { pubkey, relay, secret };
}
async function makeNwcRequestEvent({
  pubkey,
  secret,
  invoice
}) {
  const content = {
    method: "pay_invoice",
    params: {
      invoice
    }
  };
  const encryptedContent = await encrypt(secret, pubkey, JSON.stringify(content));
  const eventTemplate = {
    kind: 23194,
    created_at: Math.round(Date.now() / 1e3),
    content: encryptedContent,
    tags: [["p", pubkey]]
  };
  return finishEvent(eventTemplate, secret);
}
var nip57_exports = {};
__export2(nip57_exports, {
  getZapEndpoint: () => getZapEndpoint,
  makeZapReceipt: () => makeZapReceipt,
  makeZapRequest: () => makeZapRequest,
  useFetchImplementation: () => useFetchImplementation3,
  validateZapRequest: () => validateZapRequest
});
var _fetch3;
try {
  _fetch3 = fetch;
} catch {
}
function useFetchImplementation3(fetchImplementation) {
  _fetch3 = fetchImplementation;
}
async function getZapEndpoint(metadata) {
  try {
    let lnurl = "";
    let { lud06, lud16 } = JSON.parse(metadata.content);
    if (lud06) {
      let { words } = bech32.decode(lud06, 1e3);
      let data = bech32.fromWords(words);
      lnurl = utf8Decoder.decode(data);
    } else if (lud16) {
      let [name, domain] = lud16.split("@");
      lnurl = `https://${domain}/.well-known/lnurlp/${name}`;
    } else {
      return null;
    }
    let res = await _fetch3(lnurl);
    let body = await res.json();
    if (body.allowsNostr && body.nostrPubkey) {
      return body.callback;
    }
  } catch (err) {
  }
  return null;
}
function makeZapRequest({
  profile,
  event,
  amount,
  relays,
  comment = ""
}) {
  if (!amount)
    throw new Error("amount not given");
  if (!profile)
    throw new Error("profile not given");
  let zr = {
    kind: 9734,
    created_at: Math.round(Date.now() / 1e3),
    content: comment,
    tags: [
      ["p", profile],
      ["amount", amount.toString()],
      ["relays", ...relays]
    ]
  };
  if (event) {
    zr.tags.push(["e", event]);
  }
  return zr;
}
function validateZapRequest(zapRequestString) {
  let zapRequest;
  try {
    zapRequest = JSON.parse(zapRequestString);
  } catch (err) {
    return "Invalid zap request JSON.";
  }
  if (!validateEvent(zapRequest))
    return "Zap request is not a valid Nostr event.";
  if (!verifySignature(zapRequest))
    return "Invalid signature on zap request.";
  let p = zapRequest.tags.find(([t, v]) => t === "p" && v);
  if (!p)
    return "Zap request doesn't have a 'p' tag.";
  if (!p[1].match(/^[a-f0-9]{64}$/))
    return "Zap request 'p' tag is not valid hex.";
  let e = zapRequest.tags.find(([t, v]) => t === "e" && v);
  if (e && !e[1].match(/^[a-f0-9]{64}$/))
    return "Zap request 'e' tag is not valid hex.";
  let relays = zapRequest.tags.find(([t, v]) => t === "relays" && v);
  if (!relays)
    return "Zap request doesn't have a 'relays' tag.";
  return null;
}
function makeZapReceipt({
  zapRequest,
  preimage,
  bolt11,
  paidAt
}) {
  let zr = JSON.parse(zapRequest);
  let tagsFromZapRequest = zr.tags.filter(([t]) => t === "e" || t === "p" || t === "a");
  let zap = {
    kind: 9735,
    created_at: Math.round(paidAt.getTime() / 1e3),
    content: "",
    tags: [...tagsFromZapRequest, ["bolt11", bolt11], ["description", zapRequest]]
  };
  if (preimage) {
    zap.tags.push(["preimage", preimage]);
  }
  return zap;
}
var nip98_exports = {};
__export2(nip98_exports, {
  getToken: () => getToken,
  unpackEventFromToken: () => unpackEventFromToken,
  validateEvent: () => validateEvent2,
  validateToken: () => validateToken
});
var _authorizationScheme = "Nostr ";
async function getToken(loginUrl, httpMethod, sign, includeAuthorizationScheme = false) {
  if (!loginUrl || !httpMethod)
    throw new Error("Missing loginUrl or httpMethod");
  const event = getBlankEvent(
    27235
    /* HttpAuth */
  );
  event.tags = [
    ["u", loginUrl],
    ["method", httpMethod]
  ];
  event.created_at = Math.round(new Date().getTime() / 1e3);
  const signedEvent = await sign(event);
  const authorizationScheme = includeAuthorizationScheme ? _authorizationScheme : "";
  return authorizationScheme + base64.encode(utf8Encoder.encode(JSON.stringify(signedEvent)));
}
async function validateToken(token, url, method) {
  const event = await unpackEventFromToken(token).catch((error) => {
    throw error;
  });
  const valid = await validateEvent2(event, url, method).catch((error) => {
    throw error;
  });
  return valid;
}
async function unpackEventFromToken(token) {
  if (!token) {
    throw new Error("Missing token");
  }
  token = token.replace(_authorizationScheme, "");
  const eventB64 = utf8Decoder.decode(base64.decode(token));
  if (!eventB64 || eventB64.length === 0 || !eventB64.startsWith("{")) {
    throw new Error("Invalid token");
  }
  const event = JSON.parse(eventB64);
  return event;
}
async function validateEvent2(event, url, method) {
  if (!event) {
    throw new Error("Invalid nostr event");
  }
  if (!verifySignature(event)) {
    throw new Error("Invalid nostr event, signature invalid");
  }
  if (event.kind !== 27235) {
    throw new Error("Invalid nostr event, kind invalid");
  }
  if (!event.created_at) {
    throw new Error("Invalid nostr event, created_at invalid");
  }
  if (Math.round(new Date().getTime() / 1e3) - event.created_at > 60) {
    throw new Error("Invalid nostr event, expired");
  }
  const urlTag = event.tags.find((t) => t[0] === "u");
  if ((urlTag == null ? void 0 : urlTag.length) !== 1 && (urlTag == null ? void 0 : urlTag[1]) !== url) {
    throw new Error("Invalid nostr event, url tag invalid");
  }
  const methodTag = event.tags.find((t) => t[0] === "method");
  if ((methodTag == null ? void 0 : methodTag.length) !== 1 && (methodTag == null ? void 0 : methodTag[1].toLowerCase()) !== method.toLowerCase()) {
    throw new Error("Invalid nostr event, method tag invalid");
  }
  return true;
}

// node_modules/@nostr-dev-kit/ndk/dist/index.mjs
var import_tseep = __toESM(require_lib(), 1);
var import_debug = __toESM(require_src(), 1);
var import_tseep2 = __toESM(require_lib(), 1);
var import_tseep3 = __toESM(require_lib(), 1);
var import_tseep4 = __toESM(require_lib(), 1);
var import_tseep5 = __toESM(require_lib(), 1);
var import_debug2 = __toESM(require_src(), 1);
var import_tseep6 = __toESM(require_lib(), 1);
var import_tseep7 = __toESM(require_lib(), 1);
var import_debug3 = __toESM(require_src(), 1);
var import_tseep8 = __toESM(require_lib(), 1);
var import_tseep9 = __toESM(require_lib(), 1);
var import_typescript_lru_cache = __toESM(require_dist(), 1);
var import_tseep10 = __toESM(require_lib(), 1);
var import_light_bolt11_decoder = __toESM(require_bolt11(), 1);
var NDKRelayConnectivity = class {
  ndkRelay;
  _status;
  relay;
  connectedAt;
  _connectionStats = {
    attempts: 0,
    success: 0,
    durations: []
  };
  debug;
  constructor(ndkRelay) {
    this.ndkRelay = ndkRelay;
    this._status = 3;
    this.relay = relayInit(this.ndkRelay.url);
    this.debug = this.ndkRelay.debug.extend("connectivity");
    this.relay.on("notice", (notice) => this.handleNotice(notice));
  }
  async connect() {
    const connectHandler = () => {
      this.updateConnectionStats.connected();
      this._status = 1;
      this.ndkRelay.emit("connect");
    };
    const disconnectHandler = () => {
      this.updateConnectionStats.disconnected();
      if (this._status === 1) {
        this._status = 3;
        this.handleReconnection();
      }
      this.ndkRelay.emit("disconnect");
    };
    try {
      this.updateConnectionStats.attempt();
      this._status = 0;
      this.relay.off("connect", connectHandler);
      this.relay.off("disconnect", disconnectHandler);
      this.relay.on("connect", connectHandler);
      this.relay.on("disconnect", disconnectHandler);
      await this.relay.connect();
    } catch (e) {
      this.debug("Failed to connect", e);
      this._status = 3;
      throw e;
    }
  }
  disconnect() {
    this._status = 2;
    this.relay.close();
  }
  get status() {
    return this._status;
  }
  isAvailable() {
    return this._status === 1;
  }
  /**
   * Evaluates the connection stats to determine if the relay is flapping.
   */
  isFlapping() {
    const durations = this._connectionStats.durations;
    if (durations.length % 3 !== 0)
      return false;
    const sum = durations.reduce((a, b) => a + b, 0);
    const avg = sum / durations.length;
    const variance = durations.map((x) => Math.pow(x - avg, 2)).reduce((a, b) => a + b, 0) / durations.length;
    const stdDev = Math.sqrt(variance);
    const isFlapping = stdDev < 1e3;
    return isFlapping;
  }
  async handleNotice(notice) {
    if (notice.includes("oo many") || notice.includes("aximum")) {
      this.disconnect();
      setTimeout(() => this.connect(), 2e3);
      this.debug(this.relay.url, "Relay complaining?", notice);
    }
    this.ndkRelay.emit("notice", this, notice);
  }
  /**
   * Called when the relay is unexpectedly disconnected.
   */
  handleReconnection(attempt = 0) {
    if (this.isFlapping()) {
      this.ndkRelay.emit("flapping", this, this._connectionStats);
      this._status = 5;
      return;
    }
    const reconnectDelay = this.connectedAt ? Math.max(0, 6e4 - (Date.now() - this.connectedAt)) : 0;
    setTimeout(() => {
      this._status = 4;
      this.connect().then(() => {
        this.debug("Reconnected");
      }).catch((err) => {
        this.debug("Reconnect failed", err);
        if (attempt < 5) {
          setTimeout(() => {
            this.handleReconnection(attempt + 1);
          }, 6e4);
        } else {
          this.debug("Reconnect failed after 5 attempts");
        }
      });
    }, reconnectDelay);
  }
  /**
   * Utility functions to update the connection stats.
   */
  updateConnectionStats = {
    connected: () => {
      this._connectionStats.success++;
      this._connectionStats.connectedAt = Date.now();
    },
    disconnected: () => {
      if (this._connectionStats.connectedAt) {
        this._connectionStats.durations.push(
          Date.now() - this._connectionStats.connectedAt
        );
        if (this._connectionStats.durations.length > 100) {
          this._connectionStats.durations.shift();
        }
      }
      this._connectionStats.connectedAt = void 0;
    },
    attempt: () => {
      this._connectionStats.attempts++;
    }
  };
  /**
   * Returns the connection stats.
   */
  get connectionStats() {
    return this._connectionStats;
  }
};
var NDKRelayPublisher = class {
  ndkRelay;
  constructor(ndkRelay) {
    this.ndkRelay = ndkRelay;
  }
  /**
   * Published an event to the relay; if the relay is not connected, it will
   * wait for the relay to connect before publishing the event.
   *
   * If the relay does not connect within the timeout, the publish operation
   * will fail.
   * @param event  The event to publish
   * @param timeoutMs  The timeout for the publish operation in milliseconds
   * @returns A promise that resolves when the event has been published or rejects if the operation times out
   */
  async publish(event, timeoutMs = 2500) {
    const publishWhenConnected = () => {
      return new Promise((resolve, reject) => {
        try {
          this.publishEvent(event, timeoutMs).then((result) => resolve(result)).catch((err) => reject(err));
        } catch (err) {
          reject(err);
        }
      });
    };
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Timeout")), timeoutMs);
    });
    const onConnectHandler = () => {
      publishWhenConnected().then((result) => connectResolve(result)).catch((err) => connectReject(err));
    };
    let connectResolve;
    let connectReject;
    if (this.ndkRelay.status === 1) {
      return Promise.race([publishWhenConnected(), timeoutPromise]);
    } else {
      return Promise.race([
        new Promise((resolve, reject) => {
          connectResolve = resolve;
          connectReject = reject;
          this.ndkRelay.once("connect", onConnectHandler);
        }),
        timeoutPromise
      ]).finally(() => {
        this.ndkRelay.removeListener("connect", onConnectHandler);
      });
    }
  }
  async publishEvent(event, timeoutMs) {
    const nostrEvent = await event.toNostrEvent();
    const publish = this.ndkRelay.connectivity.relay.publish(nostrEvent);
    let publishTimeout;
    const publishPromise = new Promise((resolve, reject) => {
      publish.then(() => {
        clearTimeout(publishTimeout);
        this.ndkRelay.emit("published", event);
        resolve(true);
      }).catch((err) => {
        clearTimeout(publishTimeout);
        this.ndkRelay.debug("Publish failed", err, event.id);
        this.ndkRelay.emit("publish:failed", event, err);
        reject(err);
      });
    });
    if (!timeoutMs || event.isEphemeral()) {
      return publishPromise;
    }
    const timeoutPromise = new Promise((_, reject) => {
      publishTimeout = setTimeout(() => {
        this.ndkRelay.debug("Publish timed out", event.rawEvent());
        this.ndkRelay.emit("publish:failed", event, "Timeout");
        reject(new Error("Publish operation timed out"));
      }, timeoutMs);
    });
    return Promise.race([publishPromise, timeoutPromise]);
  }
};
function calculateGroupableId(filters) {
  const elements = [];
  for (const filter of filters) {
    const hasTimeConstraints = filter.since || filter.until;
    if (hasTimeConstraints)
      return null;
    const keys2 = Object.keys(filter || {}).sort().join("-");
    elements.push(keys2);
  }
  return elements.join("|");
}
function mergeFilters(filters) {
  const result = {};
  filters.forEach((filter) => {
    Object.entries(filter).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (result[key] === void 0) {
          result[key] = [...value];
        } else {
          result[key] = Array.from(/* @__PURE__ */ new Set([...result[key], ...value]));
        }
      } else {
        result[key] = value;
      }
    });
  });
  return result;
}
var MAX_SUBID_LENGTH = 20;
function queryFullyFilled(subscription) {
  if (filterIncludesIds(subscription.filter)) {
    if (resultHasAllRequestedIds(subscription)) {
      return true;
    }
  }
  return false;
}
function compareFilter(filter1, filter2) {
  if (Object.keys(filter1).length !== Object.keys(filter2).length)
    return false;
  for (const [key, value] of Object.entries(filter1)) {
    const valuesInFilter2 = filter2[key];
    if (!valuesInFilter2)
      return false;
    if (Array.isArray(value) && Array.isArray(valuesInFilter2)) {
      const v = value;
      for (const valueInFilter2 of valuesInFilter2) {
        const val = valueInFilter2;
        if (!v.includes(val)) {
          return false;
        }
      }
    } else {
      if (valuesInFilter2 !== value)
        return false;
    }
  }
  return true;
}
function filterIncludesIds(filter) {
  return !!filter["ids"];
}
function resultHasAllRequestedIds(subscription) {
  const ids = subscription.filter["ids"];
  return !!ids && ids.length === subscription.eventFirstSeen.size;
}
function generateSubId(subscriptions, filters) {
  var _a2;
  const subIds = subscriptions.map((sub) => sub.subId).filter(Boolean);
  const subIdParts = [];
  const filterNonKindKeys = /* @__PURE__ */ new Set();
  const filterKinds = /* @__PURE__ */ new Set();
  if (subIds.length > 0) {
    subIdParts.push(Array.from(new Set(subIds)).join(","));
  } else {
    for (const filter of filters) {
      for (const key of Object.keys(filter)) {
        if (key === "kinds") {
          (_a2 = filter.kinds) == null ? void 0 : _a2.forEach((k) => filterKinds.add(k));
        } else {
          filterNonKindKeys.add(key);
        }
      }
    }
    if (filterKinds.size > 0) {
      subIdParts.push("kinds:" + Array.from(filterKinds).join(","));
    }
    if (filterNonKindKeys.size > 0) {
      subIdParts.push(Array.from(filterNonKindKeys).join(","));
    }
  }
  let subId = subIdParts.join("-");
  if (subId.length > MAX_SUBID_LENGTH)
    subId = subId.substring(0, MAX_SUBID_LENGTH);
  if (subIds.length !== 1) {
    subId += "-" + Math.floor(Math.random() * 999).toString();
  }
  return subId;
}
function filterFromId(id) {
  let decoded;
  if (id.match(NIP33_A_REGEX)) {
    const [kind, pubkey, identifier] = id.split(":");
    const filter = {
      authors: [pubkey],
      kinds: [parseInt(kind)]
    };
    if (identifier) {
      filter["#d"] = [identifier];
    }
    return filter;
  }
  try {
    decoded = nip19_exports.decode(id);
    switch (decoded.type) {
      case "nevent":
        return { ids: [decoded.data.id] };
      case "note":
        return { ids: [decoded.data] };
      case "naddr":
        return {
          authors: [decoded.data.pubkey],
          "#d": [decoded.data.identifier],
          kinds: [decoded.data.kind]
        };
    }
  } catch (e) {
  }
  return { ids: [id] };
}
function isNip33AValue(value) {
  return value.match(NIP33_A_REGEX) !== null;
}
var NIP33_A_REGEX = /^(\d+):([0-9A-Fa-f]+)(?::(.*))?$/;
function relaysFromBech32(bech3222) {
  try {
    const decoded = nip19_exports.decode(bech3222);
    if (["naddr", "nevent"].includes(decoded == null ? void 0 : decoded.type)) {
      const data = decoded.data;
      if (data == null ? void 0 : data.relays) {
        return data.relays.map((r) => new NDKRelay(r));
      }
    }
  } catch (e) {
  }
  return [];
}
var NDKGroupedSubscriptions = class extends import_tseep3.EventEmitter {
  subscriptions;
  req;
  debug;
  constructor(subscriptions, debug42) {
    super();
    this.subscriptions = subscriptions;
    this.debug = debug42 || this.subscriptions[0].subscription.debug.extend("grouped");
    for (const subscription of subscriptions) {
      this.handleSubscriptionClosure(subscription);
    }
  }
  /**
   * Adds a subscription to this group.
   * @param subscription
   */
  addSubscription(subscription) {
    this.subscriptions.push(subscription);
    this.handleSubscriptionClosure(subscription);
  }
  eventReceived(event) {
    for (const subscription of this.subscriptions) {
      subscription.eventReceived(event);
    }
  }
  eoseReceived(relay) {
    const subscriptionsToInform = Array.from(this.subscriptions);
    subscriptionsToInform.forEach(async (subscription) => {
      subscription.subscription.eoseReceived(relay);
    });
  }
  handleSubscriptionClosure(subscription) {
    subscription.subscription.on("close", () => {
      const index = this.subscriptions.findIndex(
        (i2) => i2.subscription === subscription.subscription
      );
      this.subscriptions.splice(index, 1);
      if (this.subscriptions.length <= 0) {
        this.emit("close");
      }
    });
  }
  /**
   * Maps each subscription through a transformation function.
   * @param fn - The transformation function.
   * @returns A new array with each subscription transformed by fn.
   */
  map(fn) {
    return this.subscriptions.map(fn);
  }
  [Symbol.iterator]() {
    let index = 0;
    const subscriptions = this.subscriptions;
    return {
      next() {
        if (index < subscriptions.length) {
          return { value: subscriptions[index++], done: false };
        } else {
          return { value: null, done: true };
        }
      }
    };
  }
};
var NDKSubscriptionFilters = class {
  subscription;
  filters = [];
  ndkRelay;
  constructor(subscription, filters, ndkRelay) {
    this.subscription = subscription;
    this.filters = filters;
    this.ndkRelay = ndkRelay;
  }
  eventReceived(event) {
    if (!this.eventMatchesLocalFilter(event))
      return;
    this.subscription.eventReceived(event, this.ndkRelay, false);
  }
  eventMatchesLocalFilter(event) {
    const rawEvent = event.rawEvent();
    return this.filters.some((filter) => matchFilter(filter, rawEvent));
  }
};
function findMatchingActiveSubscriptions(activeSubscriptions, filters) {
  if (activeSubscriptions.length !== filters.length)
    return false;
  for (let i2 = 0; i2 < activeSubscriptions.length; i2++) {
    if (!compareFilter(activeSubscriptions[i2], filters[i2])) {
      break;
    }
    return activeSubscriptions[i2];
  }
  return void 0;
}
var NDKRelaySubscriptions = class {
  ndkRelay;
  delayedItems = /* @__PURE__ */ new Map();
  delayedTimers = /* @__PURE__ */ new Map();
  /**
   * Active subscriptions this relay is connected to
   */
  activeSubscriptions = /* @__PURE__ */ new Map();
  activeSubscriptionsByGroupId = /* @__PURE__ */ new Map();
  debug;
  groupingDebug;
  conn;
  constructor(ndkRelay) {
    this.ndkRelay = ndkRelay;
    this.conn = ndkRelay.connectivity;
    this.debug = ndkRelay.debug.extend("subscriptions");
    this.groupingDebug = ndkRelay.debug.extend("grouping");
  }
  /**
   * Creates or queues a subscription to the relay.
   */
  subscribe(subscription, filters) {
    const groupableId = calculateGroupableId(filters);
    const subscriptionFilters = new NDKSubscriptionFilters(
      subscription,
      filters,
      this.ndkRelay
    );
    if (!groupableId || !subscription.isGroupable()) {
      this.groupingDebug("No groupable ID for filters", filters);
      this.executeSubscriptions(
        groupableId,
        // hacky
        new NDKGroupedSubscriptions([subscriptionFilters]),
        filters
      );
      return;
    }
    const activeSubscriptions = this.activeSubscriptionsByGroupId.get(groupableId);
    if (activeSubscriptions) {
      const matchingSubscription = findMatchingActiveSubscriptions(
        activeSubscriptions.filters,
        filters
      );
      if (matchingSubscription) {
        const activeSubscription = this.activeSubscriptions.get(activeSubscriptions.sub);
        activeSubscription == null ? void 0 : activeSubscription.addSubscription(
          new NDKSubscriptionFilters(subscription, filters, this.ndkRelay)
        );
        return;
      }
    }
    let delayedItem = this.delayedItems.get(groupableId);
    if (!delayedItem) {
      delayedItem = new NDKGroupedSubscriptions([subscriptionFilters]);
      this.delayedItems.set(groupableId, delayedItem);
      delayedItem.once("close", () => {
        const delayedItem2 = this.delayedItems.get(groupableId);
        if (!delayedItem2)
          return;
        this.delayedItems.delete(groupableId);
      });
    } else {
      delayedItem.addSubscription(subscriptionFilters);
    }
    const timeout = setTimeout(() => {
      this.executeGroup(groupableId, subscription);
    }, subscription.opts.groupableDelay);
    if (this.delayedTimers.has(groupableId)) {
      this.delayedTimers.get(groupableId).push(timeout);
    } else {
      this.delayedTimers.set(groupableId, [timeout]);
    }
  }
  /**
   * Executes a delayed subscription via its groupable ID.
   * @param groupableId
   */
  executeGroup(groupableId, triggeredBy) {
    const delayedItem = this.delayedItems.get(groupableId);
    this.delayedItems.delete(groupableId);
    const timeouts = this.delayedTimers.get(groupableId);
    this.delayedTimers.delete(groupableId);
    if (timeouts) {
      for (const timeout of timeouts) {
        clearTimeout(timeout);
      }
    }
    if (delayedItem) {
      const filterCount = delayedItem.subscriptions[0].filters.length;
      const mergedFilters = [];
      for (let i2 = 0; i2 < filterCount; i2++) {
        const allFiltersAtIndex = delayedItem.map((di) => di.filters[i2]);
        mergedFilters.push(mergeFilters(allFiltersAtIndex));
      }
      this.executeSubscriptions(groupableId, delayedItem, mergedFilters);
    }
  }
  /**
   * Executes one or more subscriptions.
   *
   * If the relay is not connected, subscriptions will be queued
   * until the relay connects.
   *
   * @param groupableId
   * @param subscriptionFilters
   * @param mergedFilters
   */
  executeSubscriptions(groupableId, groupedSubscriptions, mergedFilters) {
    if (this.conn.isAvailable()) {
      this.executeSubscriptionsConnected(groupableId, groupedSubscriptions, mergedFilters);
    } else {
      const connectedListener = () => {
        this.debug("new relay coming online for active subscription", {
          relay: this.ndkRelay.url,
          mergeFilters
        });
        this.executeSubscriptionsConnected(
          groupableId,
          groupedSubscriptions,
          mergedFilters
        );
      };
      this.ndkRelay.once("connect", connectedListener);
      groupedSubscriptions.once("close", () => {
        this.ndkRelay.removeListener("connect", connectedListener);
      });
    }
  }
  /**
   * Executes one or more subscriptions.
   *
   * When there are more than one subscription, results
   * will be sent to the right subscription
   *
   * @param subscriptions
   * @param filters The filters as they should be sent to the relay
   */
  executeSubscriptionsConnected(groupableId, groupedSubscriptions, mergedFilters) {
    const subscriptions = [];
    for (const { subscription } of groupedSubscriptions) {
      subscriptions.push(subscription);
    }
    const subId = generateSubId(subscriptions, mergedFilters);
    groupedSubscriptions.req = mergedFilters;
    const sub = this.conn.relay.sub(mergedFilters, { id: subId });
    this.activeSubscriptions.set(sub, groupedSubscriptions);
    if (groupableId) {
      this.activeSubscriptionsByGroupId.set(groupableId, { filters: mergedFilters, sub });
    }
    sub.on("event", (event) => {
      const e = new NDKEvent(void 0, event);
      e.relay = this.ndkRelay;
      const subFilters = this.activeSubscriptions.get(sub);
      subFilters == null ? void 0 : subFilters.eventReceived(e);
    });
    sub.on("eose", () => {
      const subFilters = this.activeSubscriptions.get(sub);
      subFilters == null ? void 0 : subFilters.eoseReceived(this.ndkRelay);
    });
    groupedSubscriptions.once("close", () => {
      sub.unsub();
      this.activeSubscriptions.delete(sub);
      if (groupableId) {
        this.activeSubscriptionsByGroupId.delete(groupableId);
      }
    });
    return sub;
  }
  executedFilters() {
    const ret = /* @__PURE__ */ new Map();
    for (const [, groupedSubscriptions] of this.activeSubscriptions) {
      ret.set(
        groupedSubscriptions.req,
        groupedSubscriptions.map((sub) => sub.subscription)
      );
    }
    return ret;
  }
};
var NDKRelay = class extends import_tseep2.EventEmitter {
  url;
  scores;
  connectivity;
  subs;
  publisher;
  complaining = false;
  debug;
  constructor(url) {
    super();
    this.url = url;
    this.scores = /* @__PURE__ */ new Map();
    this.debug = (0, import_debug.default)(`ndk:relay:${url}`);
    this.connectivity = new NDKRelayConnectivity(this);
    this.subs = new NDKRelaySubscriptions(this);
    this.publisher = new NDKRelayPublisher(this);
  }
  get status() {
    return this.connectivity.status;
  }
  get connectionStats() {
    return this.connectivity.connectionStats;
  }
  /**
   * Connects to the relay.
   */
  async connect() {
    return this.connectivity.connect();
  }
  /**
   * Disconnects from the relay.
   */
  disconnect() {
    this.connectivity.disconnect();
  }
  /**
   * Queues or executes the subscription of a specific set of filters
   * within this relay.
   *
   * @param subscription NDKSubscription this filters belong to.
   * @param filters Filters to execute
   */
  subscribe(subscription, filters) {
    this.subs.subscribe(subscription, filters);
  }
  /**
   * Publishes an event to the relay with an optional timeout.
   *
   * If the relay is not connected, the event will be published when the relay connects,
   * unless the timeout is reached before the relay connects.
   *
   * @param event The event to publish
   * @param timeoutMs The timeout for the publish operation in milliseconds
   * @returns A promise that resolves when the event has been published or rejects if the operation times out
   */
  async publish(event, timeoutMs = 2500) {
    return this.publisher.publish(event, timeoutMs);
  }
  /**
   * Called when this relay has responded with an event but
   * wasn't the fastest one.
   * @param timeDiffInMs The time difference in ms between the fastest and this relay in milliseconds
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scoreSlowerEvent(timeDiffInMs) {
  }
  /** @deprecated Use referenceTags instead. */
  tagReference(marker) {
    const tag = ["r", this.url];
    if (marker) {
      tag.push(marker);
    }
    return tag;
  }
  referenceTags() {
    return [["r", this.url]];
  }
  activeSubscriptions() {
    return this.subs.executedFilters();
  }
};
var NDKRelaySet = class {
  relays;
  debug;
  ndk;
  constructor(relays, ndk2) {
    this.relays = relays;
    this.ndk = ndk2;
    this.debug = ndk2.debug.extend("relayset");
  }
  /**
   * Adds a relay to this set.
   */
  addRelay(relay) {
    this.relays.add(relay);
  }
  /**
   * Creates a relay set from a list of relay URLs.
   *
   * If no connection to the relay is found in the pool it will temporarily
   * connect to it.
   *
   * @param relayUrls - list of relay URLs to include in this set
   * @param ndk
   * @returns NDKRelaySet
   */
  static fromRelayUrls(relayUrls, ndk2) {
    const relays = /* @__PURE__ */ new Set();
    for (const url of relayUrls) {
      const relay = ndk2.pool.relays.get(url);
      if (relay) {
        relays.add(relay);
      } else {
        const temporaryRelay = new NDKRelay(url);
        ndk2.pool.useTemporaryRelay(temporaryRelay);
        relays.add(temporaryRelay);
      }
    }
    return new NDKRelaySet(new Set(relays), ndk2);
  }
  /**
   * Publish an event to all relays in this set. Returns the number of relays that have received the event.
   * @param event
   * @param timeoutMs - timeout in milliseconds for each publish operation and connection operation
   * @returns A set where the event was successfully published to
   */
  async publish(event, timeoutMs) {
    const publishedToRelays = /* @__PURE__ */ new Set();
    const isEphemeral2 = event.isEphemeral();
    const promises = Array.from(this.relays).map((relay) => {
      return new Promise((resolve) => {
        relay.publish(event, timeoutMs).then(() => {
          publishedToRelays.add(relay);
          resolve();
        }).catch((err) => {
          if (!isEphemeral2) {
            this.debug("error publishing to relay", {
              relay: relay.url,
              err
            });
          }
          resolve();
        });
      });
    });
    await Promise.all(promises);
    if (publishedToRelays.size === 0) {
      if (!isEphemeral2) {
        throw new Error("No relay was able to receive the event");
      }
    }
    return publishedToRelays;
  }
  size() {
    return this.relays.size;
  }
};
function calculateRelaySetFromEvent(ndk2, event) {
  var _a2;
  const relays = /* @__PURE__ */ new Set();
  (_a2 = ndk2.pool) == null ? void 0 : _a2.relays.forEach((relay) => relays.add(relay));
  return new NDKRelaySet(relays, ndk2);
}
function getWriteRelaysFor(ndk2, author) {
  var _a2;
  if (!ndk2.outboxTracker)
    return void 0;
  return (_a2 = ndk2.outboxTracker.data.get(author)) == null ? void 0 : _a2.writeRelays;
}
function calculateRelaySetsFromFilter(ndk2, filters) {
  var _a2, _b;
  const result = /* @__PURE__ */ new Map();
  const authors = /* @__PURE__ */ new Set();
  filters.forEach((filter) => {
    if (filter.authors) {
      filter.authors.forEach((author) => authors.add(author));
    }
  });
  if (authors.size > 0) {
    const authorToRelaysMap = /* @__PURE__ */ new Map();
    for (const author of authors) {
      const userWriteRelays = getWriteRelaysFor(ndk2, author);
      if (userWriteRelays && userWriteRelays.size > 0) {
        ndk2.debug(`Adding ${userWriteRelays.size} relays for ${author}`);
        userWriteRelays.forEach((relay) => {
          const authorsInRelay = authorToRelaysMap.get(relay) || [];
          authorsInRelay.push(author);
          authorToRelaysMap.set(relay, authorsInRelay);
        });
      } else {
        (_a2 = ndk2.explicitRelayUrls) == null ? void 0 : _a2.forEach((relay) => {
          const authorsInRelay = authorToRelaysMap.get(relay) || [];
          authorsInRelay.push(author);
          authorToRelaysMap.set(relay, authorsInRelay);
        });
      }
    }
    for (const relayUrl of authorToRelaysMap.keys()) {
      result.set(relayUrl, []);
    }
    for (const filter of filters) {
      if (filter.authors) {
        for (const [relayUrl, authors2] of authorToRelaysMap.entries()) {
          result.set(relayUrl, [...result.get(relayUrl), { ...filter, authors: authors2 }]);
        }
      } else {
        for (const relayUrl of authorToRelaysMap.keys()) {
          result.set(relayUrl, [...result.get(relayUrl), filter]);
        }
      }
    }
  } else {
    (_b = ndk2.explicitRelayUrls) == null ? void 0 : _b.forEach((relay) => {
      result.set(relay, filters);
    });
  }
  return result;
}
function calculateRelaySetsFromFilters(ndk2, filters) {
  return calculateRelaySetsFromFilter(ndk2, filters);
}
var DEFAULT_RELAYS = [
  "wss://nos.lol",
  "wss://relay.nostr.band",
  "wss://relay.f7z.io",
  "wss://relay.damus.io",
  "wss://nostr.mom",
  "wss://no.str.cr"
];
var Zap = class extends import_tseep4.EventEmitter {
  ndk;
  zappedEvent;
  zappedUser;
  constructor(args) {
    var _a2;
    super();
    this.ndk = args.ndk;
    this.zappedEvent = args.zappedEvent;
    this.zappedUser = args.zappedUser || this.ndk.getUser({ hexpubkey: (_a2 = this.zappedEvent) == null ? void 0 : _a2.pubkey });
  }
  async getZapEndpoint() {
    let lud06;
    let lud16;
    let zapEndpoint;
    let zapEndpointCallback;
    if (this.zappedUser) {
      if (!this.zappedUser.profile) {
        await this.zappedUser.fetchProfile();
      }
      lud06 = (this.zappedUser.profile || {}).lud06;
      lud16 = (this.zappedUser.profile || {}).lud16;
    }
    if (lud16 && !lud16.startsWith("LNURL")) {
      const [name, domain] = lud16.split("@");
      zapEndpoint = `https://${domain}/.well-known/lnurlp/${name}`;
    } else if (lud06) {
      const { words } = bech32.decode(lud06, 1e3);
      const data = bech32.fromWords(words);
      const utf8Decoder4 = new TextDecoder("utf-8");
      zapEndpoint = utf8Decoder4.decode(data);
    }
    if (!zapEndpoint) {
      throw new Error("No zap endpoint found");
    }
    const response = await fetch(zapEndpoint);
    const body = await response.json();
    if ((body == null ? void 0 : body.allowsNostr) && ((body == null ? void 0 : body.nostrPubkey) || (body == null ? void 0 : body.nostrPubKey))) {
      zapEndpointCallback = body.callback;
    }
    return zapEndpointCallback;
  }
  /**
   * Generates a kind:9734 zap request and returns the payment request
   * @param amount amount to zap in millisatoshis
   * @param comment optional comment to include in the zap request
   * @param extraTags optional extra tags to include in the zap request
   * @param relays optional relays to ask zapper to publish the zap to
   * @returns the payment request
   */
  async createZapRequest(amount, comment, extraTags, relays, signer) {
    const res = await this.generateZapRequest(amount, comment, extraTags, relays);
    if (!res)
      return null;
    const { event, zapEndpoint } = res;
    if (!event) {
      throw new Error("No zap request event found");
    }
    await event.sign(signer);
    return await this.getInvoice(event, amount, zapEndpoint);
  }
  async getInvoice(event, amount, zapEndpoint) {
    const response = await fetch(
      `${zapEndpoint}?` + new URLSearchParams({
        amount: amount.toString(),
        nostr: JSON.stringify(event.rawEvent())
      })
    );
    const body = await response.json();
    return body.pr;
  }
  async generateZapRequest(amount, comment, extraTags, relays, signer) {
    const zapEndpoint = await this.getZapEndpoint();
    if (!zapEndpoint) {
      throw new Error("No zap endpoint found");
    }
    if (!this.zappedEvent && !this.zappedUser)
      throw new Error("No zapped event or user found");
    const zapRequest = nip57_exports.makeZapRequest({
      profile: this.zappedUser.pubkey,
      // set the event to null since nostr-tools doesn't support nip-33 zaps
      event: null,
      amount,
      comment: comment || "",
      relays: relays != null ? relays : this.relays()
    });
    if (this.zappedEvent) {
      const tags = this.zappedEvent.referenceTags();
      zapRequest.tags.push(...tags);
    }
    zapRequest.tags.push(["lnurl", zapEndpoint]);
    const event = new NDKEvent(this.ndk, zapRequest);
    if (extraTags) {
      event.tags = event.tags.concat(extraTags);
    }
    return { event, zapEndpoint };
  }
  /**
   * @returns the relays to use for the zap request
   */
  relays() {
    var _a2, _b;
    let r = [];
    if ((_b = (_a2 = this.ndk) == null ? void 0 : _a2.pool) == null ? void 0 : _b.relays) {
      r = this.ndk.pool.urls();
    }
    if (!r.length) {
      r = DEFAULT_RELAYS;
    }
    return r;
  }
};
function mergeTags(tags1, tags2) {
  const tagMap = /* @__PURE__ */ new Map();
  const generateKey = (tag) => tag.join(",");
  const isContained = (smaller, larger) => {
    return smaller.every((value, index) => value === larger[index]);
  };
  const processTag = (tag) => {
    for (let [key, existingTag] of tagMap) {
      if (isContained(existingTag, tag) || isContained(tag, existingTag)) {
        if (tag.length >= existingTag.length) {
          tagMap.set(key, tag);
        }
        return;
      }
    }
    tagMap.set(generateKey(tag), tag);
  };
  tags1.concat(tags2).forEach(processTag);
  return Array.from(tagMap.values());
}
async function generateContentTags(content, tags = []) {
  const tagRegex = /(@|nostr:)(npub|nprofile|note|nevent|naddr)[a-zA-Z0-9]+/g;
  const hashtagRegex = /#(\w+)/g;
  let promises = [];
  const addTagIfNew = (t) => {
    if (!tags.find((t2) => t2[0] === t[0] && t2[1] === t[1])) {
      tags.push(t);
    }
  };
  content = content.replace(tagRegex, (tag) => {
    try {
      const entity = tag.split(/(@|nostr:)/)[2];
      const { type: type2, data } = nip19_exports.decode(entity);
      let t;
      switch (type2) {
        case "npub":
          t = ["p", data];
          break;
        case "nprofile":
          t = ["p", data.pubkey];
          break;
        case "note":
          promises.push(
            new Promise(async (resolve) => {
              addTagIfNew([
                "e",
                data,
                await maybeGetEventRelayUrl(entity),
                "mention"
              ]);
              resolve();
            })
          );
          break;
        case "nevent":
          promises.push(
            new Promise(async (resolve) => {
              let { id, relays, author } = data;
              if (!relays || relays.length === 0) {
                relays = [await maybeGetEventRelayUrl(entity)];
              }
              addTagIfNew(["e", id, relays[0], "mention"]);
              if (author)
                addTagIfNew(["p", author]);
              resolve();
            })
          );
          break;
        case "naddr":
          promises.push(
            new Promise(async (resolve) => {
              var _a2;
              const id = [data.kind, data.pubkey, data.identifier].join(":");
              let relays = (_a2 = data.relays) != null ? _a2 : [];
              if (relays.length === 0) {
                relays = [await maybeGetEventRelayUrl(entity)];
              }
              addTagIfNew(["a", id, relays[0], "mention"]);
              addTagIfNew(["p", data.pubkey]);
              resolve();
            })
          );
          break;
        default:
          return tag;
      }
      if (t)
        addTagIfNew(t);
      return `nostr:${entity}`;
    } catch (error) {
      return tag;
    }
  });
  await Promise.all(promises);
  content = content.replace(hashtagRegex, (tag, word) => {
    const t = ["t", word];
    if (!tags.find((t2) => t2[0] === t[0] && t2[1] === t[1])) {
      tags.push(t);
    }
    return tag;
  });
  return { content, tags };
}
async function maybeGetEventRelayUrl(nip19Id) {
  return "";
}
function isReplaceable() {
  if (this.kind === void 0)
    throw new Error("Kind not set");
  return this.kind >= 1e4 && this.kind < 2e4;
}
function isEphemeral() {
  if (this.kind === void 0)
    throw new Error("Kind not set");
  return this.kind >= 2e4 && this.kind < 3e4;
}
function isParamReplaceable() {
  if (this.kind === void 0)
    throw new Error("Kind not set");
  return this.kind >= 3e4 && this.kind < 4e4;
}
var NDKKind = /* @__PURE__ */ ((NDKKind2) => {
  NDKKind2[NDKKind2["Metadata"] = 0] = "Metadata";
  NDKKind2[NDKKind2["Text"] = 1] = "Text";
  NDKKind2[NDKKind2["RecommendRelay"] = 2] = "RecommendRelay";
  NDKKind2[NDKKind2["Contacts"] = 3] = "Contacts";
  NDKKind2[NDKKind2["EncryptedDirectMessage"] = 4] = "EncryptedDirectMessage";
  NDKKind2[NDKKind2["EventDeletion"] = 5] = "EventDeletion";
  NDKKind2[NDKKind2["Repost"] = 6] = "Repost";
  NDKKind2[NDKKind2["Reaction"] = 7] = "Reaction";
  NDKKind2[NDKKind2["BadgeAward"] = 8] = "BadgeAward";
  NDKKind2[NDKKind2["GroupChat"] = 9] = "GroupChat";
  NDKKind2[NDKKind2["GroupNote"] = 11] = "GroupNote";
  NDKKind2[NDKKind2["GenericRepost"] = 16] = "GenericRepost";
  NDKKind2[NDKKind2["ChannelCreation"] = 40] = "ChannelCreation";
  NDKKind2[NDKKind2["ChannelMetadata"] = 41] = "ChannelMetadata";
  NDKKind2[NDKKind2["ChannelMessage"] = 42] = "ChannelMessage";
  NDKKind2[NDKKind2["ChannelHideMessage"] = 43] = "ChannelHideMessage";
  NDKKind2[NDKKind2["ChannelMuteUser"] = 44] = "ChannelMuteUser";
  NDKKind2[NDKKind2["Report"] = 1984] = "Report";
  NDKKind2[NDKKind2["Label"] = 1985] = "Label";
  NDKKind2[NDKKind2["DVMReqTextExtraction"] = 5e3] = "DVMReqTextExtraction";
  NDKKind2[NDKKind2["DVMReqTextSummarization"] = 5001] = "DVMReqTextSummarization";
  NDKKind2[NDKKind2["DVMReqTextTranslation"] = 5002] = "DVMReqTextTranslation";
  NDKKind2[NDKKind2["DVMReqTextGeneration"] = 5050] = "DVMReqTextGeneration";
  NDKKind2[NDKKind2["DVMReqImageGeneration"] = 5100] = "DVMReqImageGeneration";
  NDKKind2[NDKKind2["DVMReqDiscoveryNostrContent"] = 5300] = "DVMReqDiscoveryNostrContent";
  NDKKind2[NDKKind2["DVMReqDiscoveryNostrPeople"] = 5301] = "DVMReqDiscoveryNostrPeople";
  NDKKind2[NDKKind2["DVMReqTimestamping"] = 5900] = "DVMReqTimestamping";
  NDKKind2[NDKKind2["DVMJobFeedback"] = 7e3] = "DVMJobFeedback";
  NDKKind2[NDKKind2["MuteList"] = 1e4] = "MuteList";
  NDKKind2[NDKKind2["PinList"] = 10001] = "PinList";
  NDKKind2[NDKKind2["RelayList"] = 10002] = "RelayList";
  NDKKind2[NDKKind2["BookmarkList"] = 10003] = "BookmarkList";
  NDKKind2[NDKKind2["CommunityList"] = 10004] = "CommunityList";
  NDKKind2[NDKKind2["PublicChatList"] = 10005] = "PublicChatList";
  NDKKind2[NDKKind2["BlockRelayList"] = 10006] = "BlockRelayList";
  NDKKind2[NDKKind2["SearchRelayList"] = 10007] = "SearchRelayList";
  NDKKind2[NDKKind2["InterestList"] = 10015] = "InterestList";
  NDKKind2[NDKKind2["EmojiList"] = 10030] = "EmojiList";
  NDKKind2[NDKKind2["FollowSet"] = 3e4] = "FollowSet";
  NDKKind2[
    NDKKind2["CategorizedPeopleList"] = 3e4
    /* FollowSet */
  ] = "CategorizedPeopleList";
  NDKKind2[NDKKind2["CategorizedBookmarkList"] = 30001] = "CategorizedBookmarkList";
  NDKKind2[NDKKind2["RelaySet"] = 30002] = "RelaySet";
  NDKKind2[
    NDKKind2["CategorizedRelayList"] = 30002
    /* RelaySet */
  ] = "CategorizedRelayList";
  NDKKind2[NDKKind2["BookmarkSet"] = 30003] = "BookmarkSet";
  NDKKind2[NDKKind2["CurationSet"] = 30004] = "CurationSet";
  NDKKind2[NDKKind2["InterestSet"] = 30015] = "InterestSet";
  NDKKind2[
    NDKKind2["InterestsList"] = 30015
    /* InterestSet */
  ] = "InterestsList";
  NDKKind2[NDKKind2["EmojiSet"] = 30030] = "EmojiSet";
  NDKKind2[NDKKind2["HighlightSet"] = 39802] = "HighlightSet";
  NDKKind2[
    NDKKind2["CategorizedHighlightList"] = 39802
    /* HighlightSet */
  ] = "CategorizedHighlightList";
  NDKKind2[NDKKind2["ZapRequest"] = 9734] = "ZapRequest";
  NDKKind2[NDKKind2["Zap"] = 9735] = "Zap";
  NDKKind2[NDKKind2["Highlight"] = 9802] = "Highlight";
  NDKKind2[NDKKind2["ClientAuth"] = 22242] = "ClientAuth";
  NDKKind2[NDKKind2["NostrConnect"] = 24133] = "NostrConnect";
  NDKKind2[NDKKind2["ProfileBadge"] = 30008] = "ProfileBadge";
  NDKKind2[NDKKind2["BadgeDefinition"] = 30009] = "BadgeDefinition";
  NDKKind2[NDKKind2["MarketStall"] = 30017] = "MarketStall";
  NDKKind2[NDKKind2["MarketProduct"] = 30018] = "MarketProduct";
  NDKKind2[NDKKind2["Article"] = 30023] = "Article";
  NDKKind2[NDKKind2["AppSpecificData"] = 30078] = "AppSpecificData";
  NDKKind2[NDKKind2["Classified"] = 30402] = "Classified";
  NDKKind2[NDKKind2["AppRecommendation"] = 31989] = "AppRecommendation";
  NDKKind2[NDKKind2["AppHandler"] = 31990] = "AppHandler";
  return NDKKind2;
})(NDKKind || {});
async function encrypt3(recipient, signer) {
  if (!this.ndk)
    throw new Error("No NDK instance found!");
  if (!signer) {
    await this.ndk.assertSigner();
    signer = this.ndk.signer;
  }
  if (!recipient) {
    const pTags = this.getMatchingTags("p");
    if (pTags.length !== 1) {
      throw new Error(
        "No recipient could be determined and no explicit recipient was provided"
      );
    }
    recipient = this.ndk.getUser({ hexpubkey: pTags[0][1] });
  }
  this.content = await (signer == null ? void 0 : signer.encrypt(recipient, this.content));
}
async function decrypt3(sender, signer) {
  if (!this.ndk)
    throw new Error("No NDK instance found!");
  if (!signer) {
    await this.ndk.assertSigner();
    signer = this.ndk.signer;
  }
  if (!sender) {
    sender = this.author;
  }
  this.content = await (signer == null ? void 0 : signer.decrypt(sender, this.content));
}
function encode() {
  if (this.isParamReplaceable()) {
    return nip19_exports.naddrEncode({
      kind: this.kind,
      pubkey: this.pubkey,
      identifier: this.replaceableDTag(),
      relays: this.relay ? [this.relay.url] : []
    });
  } else if (this.relay) {
    return nip19_exports.neventEncode({
      id: this.tagId(),
      relays: [this.relay.url],
      author: this.pubkey
    });
  } else {
    return nip19_exports.noteEncode(this.tagId());
  }
}
async function repost(publish = true, signer) {
  if (!signer && publish) {
    if (!this.ndk)
      throw new Error("No NDK instance found");
    this.ndk.assertSigner();
    signer = this.ndk.signer;
  }
  const e = new NDKEvent(this.ndk, {
    kind: getKind(this),
    content: ""
  });
  e.tag(this);
  if (e.kind === 16) {
    e.tags.push(["k", `${this.kind}`]);
  }
  if (signer)
    await e.sign(signer);
  if (publish)
    await e.publish();
  return e;
}
function getKind(event) {
  if (event.kind === 1) {
    return 6;
  }
  return 16;
}
var NDKEvent = class extends import_tseep.EventEmitter {
  ndk;
  created_at;
  content = "";
  tags = [];
  kind;
  id = "";
  sig;
  pubkey = "";
  _author = void 0;
  /**
   * The relay that this event was first received from.
   */
  relay;
  constructor(ndk2, event) {
    super();
    this.ndk = ndk2;
    this.created_at = event == null ? void 0 : event.created_at;
    this.content = (event == null ? void 0 : event.content) || "";
    this.tags = (event == null ? void 0 : event.tags) || [];
    this.id = (event == null ? void 0 : event.id) || "";
    this.sig = event == null ? void 0 : event.sig;
    this.pubkey = (event == null ? void 0 : event.pubkey) || "";
    this.kind = event == null ? void 0 : event.kind;
  }
  /**
   * Returns the event as is.
   */
  rawEvent() {
    return {
      created_at: this.created_at,
      content: this.content,
      tags: this.tags,
      kind: this.kind,
      pubkey: this.pubkey,
      id: this.id,
      sig: this.sig
    };
  }
  set author(user) {
    this.pubkey = user.hexpubkey;
    this._author = void 0;
  }
  /**
   * Returns an NDKUser for the author of the event.
   */
  get author() {
    if (this._author)
      return this._author;
    if (!this.ndk)
      throw new Error("No NDK instance found");
    const user = this.ndk.getUser({ hexpubkey: this.pubkey });
    this._author = user;
    return user;
  }
  tag(userOrEvent, marker) {
    const skipAuthorTag = (userOrEvent == null ? void 0 : userOrEvent.pubkey) === this.pubkey;
    const tags = userOrEvent.referenceTags(marker, skipAuthorTag);
    this.tags = mergeTags(this.tags, tags);
    if (userOrEvent instanceof NDKEvent) {
      for (const pTag of userOrEvent.getMatchingTags("p")) {
        if (pTag[1] === this.pubkey)
          continue;
        if (this.tags.find((t) => t[0] === "p" && t[1] === pTag[1]))
          continue;
        this.tags.push(["p", pTag[1]]);
      }
    }
  }
  /**
   * Return a NostrEvent object, trying to fill in missing fields
   * when possible, adding tags when necessary.
   * @param pubkey {string} The pubkey of the user who the event belongs to.
   * @returns {Promise<NostrEvent>} A promise that resolves to a NostrEvent.
   */
  async toNostrEvent(pubkey) {
    var _a2, _b;
    if (!pubkey && this.pubkey === "") {
      const user = await ((_b = (_a2 = this.ndk) == null ? void 0 : _a2.signer) == null ? void 0 : _b.user());
      this.pubkey = (user == null ? void 0 : user.hexpubkey) || "";
    }
    if (!this.created_at)
      this.created_at = Math.floor(Date.now() / 1e3);
    const nostrEvent = this.rawEvent();
    const { content, tags } = await this.generateTags();
    nostrEvent.content = content || "";
    nostrEvent.tags = tags;
    try {
      this.id = getEventHash(nostrEvent);
    } catch (e) {
    }
    if (this.id)
      nostrEvent.id = this.id;
    if (this.sig)
      nostrEvent.sig = this.sig;
    return nostrEvent;
  }
  isReplaceable = isReplaceable.bind(this);
  isEphemeral = isEphemeral.bind(this);
  isParamReplaceable = isParamReplaceable.bind(this);
  /**
   * Encodes a bech32 id.
   *
   * @returns {string} - Encoded naddr, note or nevent.
   */
  encode = encode.bind(this);
  encrypt = encrypt3.bind(this);
  decrypt = decrypt3.bind(this);
  /**
   * Get all tags with the given name
   * @param tagName {string} The name of the tag to search for
   * @returns {NDKTag[]} An array of the matching tags
   */
  getMatchingTags(tagName) {
    return this.tags.filter((tag) => tag[0] === tagName);
  }
  /**
   * Get the first tag with the given name
   * @param tagName Tag name to search for
   * @returns The value of the first tag with the given name, or undefined if no such tag exists
   */
  tagValue(tagName) {
    const tags = this.getMatchingTags(tagName);
    if (tags.length === 0)
      return void 0;
    return tags[0][1];
  }
  /**
   * Remove all tags with the given name (e.g. "d", "a", "p")
   * @param tagName Tag name to search for and remove
   * @returns {void}
   */
  removeTag(tagName) {
    this.tags = this.tags.filter((tag) => tag[0] !== tagName);
  }
  /**
   * Sign the event if a signer is present.
   *
   * It will generate tags.
   * Repleacable events will have their created_at field set to the current time.
   * @param signer {NDKSigner} The NDKSigner to use to sign the event
   * @returns {Promise<string>} A Promise that resolves to the signature of the signed event.
   */
  async sign(signer) {
    var _a2;
    if (!signer) {
      (_a2 = this.ndk) == null ? void 0 : _a2.assertSigner();
      signer = this.ndk.signer;
    } else {
      this.author = await signer.user();
    }
    await this.generateTags();
    if (this.isReplaceable()) {
      this.created_at = Math.floor(Date.now() / 1e3);
    }
    const nostrEvent = await this.toNostrEvent();
    this.sig = await signer.sign(nostrEvent);
    return this.sig;
  }
  /**
   * Attempt to sign and then publish an NDKEvent to a given relaySet.
   * If no relaySet is provided, the relaySet will be calculated by NDK.
   * @param relaySet {NDKRelaySet} The relaySet to publish the even to.
   * @returns A promise that resolves to the relays the event was published to.
   */
  async publish(relaySet, timeoutMs) {
    if (!this.sig)
      await this.sign();
    if (!this.ndk)
      throw new Error("NDKEvent must be associated with an NDK instance to publish");
    if (!relaySet) {
      relaySet = this.ndk.devWriteRelaySet || calculateRelaySetFromEvent(this.ndk, this);
    }
    return relaySet.publish(this, timeoutMs);
  }
  /**
   * Generates tags for users, notes, and other events tagged in content.
   * Will also generate random "d" tag for parameterized replaceable events where needed.
   * @returns {ContentTag} The tags and content of the event.
   */
  async generateTags() {
    var _a2, _b, _c;
    let tags = [];
    const g = await generateContentTags(this.content, this.tags);
    const content = g.content;
    tags = g.tags;
    if (this.kind && this.isParamReplaceable()) {
      const dTag = this.getMatchingTags("d")[0];
      if (!dTag) {
        const title = this.tagValue("title");
        const randLength = title ? 6 : 16;
        let str = [...Array(randLength)].map(() => Math.random().toString(36)[2]).join("");
        if (title && title.length > 0) {
          str = title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") + "-" + str;
        }
        tags.push(["d", str]);
      }
    }
    if ((((_a2 = this.ndk) == null ? void 0 : _a2.clientName) || ((_b = this.ndk) == null ? void 0 : _b.clientNip89)) && !this.tagValue("client")) {
      const clientTag = ["client", (_c = this.ndk.clientName) != null ? _c : ""];
      if (this.ndk.clientNip89)
        clientTag.push(this.ndk.clientNip89);
      tags.push(clientTag);
    }
    return { content: content || "", tags };
  }
  muted() {
    var _a2, _b;
    const authorMutedEntry = (_a2 = this.ndk) == null ? void 0 : _a2.mutedIds.get(this.pubkey);
    if (authorMutedEntry && authorMutedEntry === "p")
      return "author";
    const eventTagReference = this.tagReference();
    const eventMutedEntry = (_b = this.ndk) == null ? void 0 : _b.mutedIds.get(eventTagReference[1]);
    if (eventMutedEntry && eventMutedEntry === eventTagReference[0])
      return "event";
    return null;
  }
  /**
   * Returns the "d" tag of a parameterized replaceable event or throws an error if the event isn't
   * a parameterized replaceable event.
   * @returns {string} the "d" tag of the event.
   */
  replaceableDTag() {
    if (this.kind && this.kind >= 3e4 && this.kind <= 4e4) {
      const dTag = this.getMatchingTags("d")[0];
      const dTagId = dTag ? dTag[1] : "";
      return dTagId;
    }
    throw new Error("Event is not a parameterized replaceable event");
  }
  /**
   * Provides a deduplication key for the event.
   *
   * For kinds 0, 3, 10k-20k this will be the event <kind>:<pubkey>
   * For kinds 30k-40k this will be the event <kind>:<pubkey>:<d-tag>
   * For all other kinds this will be the event id
   */
  deduplicationKey() {
    if (this.kind === 0 || this.kind === 3 || this.kind && this.kind >= 1e4 && this.kind < 2e4) {
      return `${this.kind}:${this.pubkey}`;
    } else {
      return this.tagId();
    }
  }
  /**
   * Returns the id of the event or, if it's a parameterized event, the generated id of the event using "d" tag, pubkey, and kind.
   * @returns {string} The id
   */
  tagId() {
    if (this.isParamReplaceable()) {
      return this.tagAddress();
    }
    return this.id;
  }
  /**
   * Returns the "reference" value ("<kind>:<author-pubkey>:<d-tag>") for this replaceable event.
   * @returns {string} The id
   */
  tagAddress() {
    if (!this.isParamReplaceable()) {
      throw new Error("This must only be called on replaceable events");
    }
    const dTagId = this.replaceableDTag();
    return `${this.kind}:${this.pubkey}:${dTagId}`;
  }
  /**
   * Get the tag that can be used to reference this event from another event.
   *
   * Consider using referenceTags() instead (unless you have a good reason to use this)
   *
   * @example
   *     event = new NDKEvent(ndk, { kind: 30000, pubkey: 'pubkey', tags: [ ["d", "d-code"] ] });
   *     event.tagReference(); // ["a", "30000:pubkey:d-code"]
   *
   *     event = new NDKEvent(ndk, { kind: 1, pubkey: 'pubkey', id: "eventid" });
   *     event.tagReference(); // ["e", "eventid"]
   * @returns {NDKTag} The NDKTag object referencing this event
   */
  tagReference(marker) {
    let tag;
    if (this.isParamReplaceable()) {
      tag = ["a", this.tagAddress()];
    } else {
      tag = ["e", this.tagId()];
    }
    if (this.relay) {
      tag.push(this.relay.url);
    } else {
      tag.push("");
    }
    if (marker) {
      tag.push(marker);
    }
    return tag;
  }
  /**
   * Get the tags that can be used to reference this event from another event
   * @param marker The marker to use in the tag
   * @example
   *     event = new NDKEvent(ndk, { kind: 30000, pubkey: 'pubkey', tags: [ ["d", "d-code"] ] });
   *     event.referenceTags(); // [["a", "30000:pubkey:d-code"], ["e", "parent-id"]]
   *
   *     event = new NDKEvent(ndk, { kind: 1, pubkey: 'pubkey', id: "eventid" });
   *     event.referenceTags(); // [["e", "parent-id"]]
   * @returns {NDKTag} The NDKTag object referencing this event
   */
  referenceTags(marker, skipAuthorTag) {
    var _a2;
    let tags = [];
    if (this.isParamReplaceable()) {
      tags = [
        ["a", this.tagAddress()],
        ["e", this.id]
      ];
    } else {
      tags = [["e", this.id]];
    }
    if ((_a2 = this.relay) == null ? void 0 : _a2.url) {
      tags = tags.map((tag) => {
        var _a3;
        tag.push((_a3 = this.relay) == null ? void 0 : _a3.url);
        return tag;
      });
    } else if (marker) {
      tags = tags.map((tag) => {
        tag.push("");
        return tag;
      });
    }
    if (marker) {
      tags.forEach((tag) => tag.push(marker));
    }
    if (!skipAuthorTag)
      tags.push(...this.author.referenceTags());
    return tags;
  }
  /**
   * Provides the filter that will return matching events for this event.
   *
   * @example
   *    event = new NDKEvent(ndk, { kind: 30000, pubkey: 'pubkey', tags: [ ["d", "d-code"] ] });
   *    event.filter(); // { "#a": ["30000:pubkey:d-code"] }
   * @example
   *    event = new NDKEvent(ndk, { kind: 1, pubkey: 'pubkey', id: "eventid" });
   *    event.filter(); // { "#e": ["eventid"] }
   *
   * @returns The filter that will return matching events for this event
   */
  filter() {
    if (this.isParamReplaceable()) {
      return { "#a": [this.tagId()] };
    } else {
      return { "#e": [this.tagId()] };
    }
  }
  /**
   * Create a zap request for an existing event
   *
   * @param amount The amount to zap in millisatoshis
   * @param comment A comment to add to the zap request
   * @param extraTags Extra tags to add to the zap request
   * @param recipient The zap recipient (optional for events)
   * @param signer The signer to use (will default to the NDK instance's signer)
   */
  async zap(amount, comment, extraTags, recipient, signer) {
    if (!this.ndk)
      throw new Error("No NDK instance found");
    if (!signer) {
      this.ndk.assertSigner();
    }
    const zap = new Zap({
      ndk: this.ndk,
      zappedEvent: this,
      zappedUser: recipient
    });
    const relays = Array.from(this.ndk.pool.relays.keys());
    const paymentRequest = await zap.createZapRequest(
      amount,
      comment,
      extraTags,
      relays,
      signer
    );
    return paymentRequest;
  }
  /**
   * Generates a deletion event of the current event
   *
   * @param reason The reason for the deletion
   * @returns The deletion event
   */
  async delete(reason) {
    if (!this.ndk)
      throw new Error("No NDK instance found");
    this.ndk.assertSigner();
    const e = new NDKEvent(this.ndk, {
      kind: 5,
      content: reason || ""
    });
    e.tag(this);
    await e.publish();
    return e;
  }
  /**
   * NIP-18 reposting event.
   *
   * @param publish Whether to publish the reposted event automatically
   * @param signer The signer to use for signing the reposted event
   * @returns The reposted event
   *
   * @function
   */
  repost = repost.bind(this);
  /**
   * React to an existing event
   *
   * @param content The content of the reaction
   */
  async react(content) {
    if (!this.ndk)
      throw new Error("No NDK instance found");
    this.ndk.assertSigner();
    const e = new NDKEvent(this.ndk, {
      kind: 7,
      content
    });
    e.tag(this);
    await e.publish();
    return e;
  }
};
var READ_MARKER = "read";
var WRITE_MARKER = "write";
var NDKRelayList = class extends NDKEvent {
  constructor(ndk2, rawEvent) {
    var _a2;
    super(ndk2, rawEvent);
    (_a2 = this.kind) != null ? _a2 : this.kind = 10002;
  }
  static from(ndkEvent) {
    return new NDKRelayList(ndkEvent.ndk, ndkEvent.rawEvent());
  }
  get readRelayUrls() {
    return this.getMatchingTags("r").filter((tag) => !tag[2] || tag[2] && tag[2] === READ_MARKER).map((tag) => tag[1]);
  }
  set readRelayUrls(relays) {
    for (const relay of relays) {
      this.tags.push(["r", relay, READ_MARKER]);
    }
  }
  get writeRelayUrls() {
    return this.getMatchingTags("r").filter((tag) => !tag[2] || tag[2] && tag[2] === WRITE_MARKER).map((tag) => tag[1]);
  }
  set writeRelayUrls(relays) {
    for (const relay of relays) {
      this.tags.push(["r", relay, WRITE_MARKER]);
    }
  }
  get bothRelayUrls() {
    return this.getMatchingTags("r").filter((tag) => !tag[2]).map((tag) => tag[1]);
  }
  set bothRelayUrls(relays) {
    for (const relay of relays) {
      this.tags.push(["r", relay]);
    }
  }
  get relays() {
    return this.getMatchingTags("r").map((tag) => tag[1]);
  }
};
var defaultOpts = {
  closeOnEose: false,
  cacheUsage: "CACHE_FIRST",
  groupable: true,
  groupableDelay: 100
};
var NDKSubscription = class extends import_tseep5.EventEmitter {
  subId;
  filters;
  opts;
  pool;
  /**
   * Tracks the filters as they are executed on each relay
   */
  relayFilters;
  relaySet;
  ndk;
  debug;
  eoseDebug;
  /**
   * Events that have been seen by the subscription, with the time they were first seen.
   */
  eventFirstSeen = /* @__PURE__ */ new Map();
  /**
   * Relays that have sent an EOSE.
   */
  eosesSeen = /* @__PURE__ */ new Set();
  /**
   * Events that have been seen by the subscription per relay.
   */
  eventsPerRelay = /* @__PURE__ */ new Map();
  /**
   * The time the last event was received by the subscription.
   * This is used to calculate when EOSE should be emitted.
   */
  lastEventReceivedAt;
  internalId;
  constructor(ndk2, filters, opts, relaySet, subId) {
    var _a2;
    super();
    this.ndk = ndk2;
    this.pool = (opts == null ? void 0 : opts.pool) || ndk2.pool;
    this.opts = { ...defaultOpts, ...opts || {} };
    this.filters = filters instanceof Array ? filters : [filters];
    this.subId = subId || (opts == null ? void 0 : opts.subId);
    this.internalId = Math.random().toString(36).substring(7);
    this.relaySet = relaySet;
    this.debug = ndk2.debug.extend(`subscription[${(_a2 = opts == null ? void 0 : opts.subId) != null ? _a2 : this.internalId}]`);
    5;
    this.eoseDebug = this.debug.extend("eose");
    if (!this.opts.closeOnEose) {
      this.debug(
        `Creating a permanent subscription`,
        this.opts,
        JSON.stringify(this.filters)
      );
    }
    if (this.opts.cacheUsage === "ONLY_CACHE" && !this.opts.closeOnEose) {
      throw new Error("Cannot use cache-only options with a persistent subscription");
    }
  }
  /**
   * Provides access to the first filter of the subscription for
   * backwards compatibility.
   */
  get filter() {
    return this.filters[0];
  }
  isGroupable() {
    var _a2;
    return ((_a2 = this.opts) == null ? void 0 : _a2.groupable) || false;
  }
  shouldQueryCache() {
    var _a2;
    return ((_a2 = this.opts) == null ? void 0 : _a2.cacheUsage) !== "ONLY_RELAY";
  }
  shouldQueryRelays() {
    var _a2;
    return ((_a2 = this.opts) == null ? void 0 : _a2.cacheUsage) !== "ONLY_CACHE";
  }
  shouldWaitForCache() {
    var _a2;
    return (
      // Must want to close on EOSE; subscriptions
      // that want to receive further updates must
      // always hit the relay
      this.opts.closeOnEose && // Cache adapter must claim to be fast
      !!((_a2 = this.ndk.cacheAdapter) == null ? void 0 : _a2.locking) && // If explicitly told to run in parallel, then
      // we should not wait for the cache
      this.opts.cacheUsage !== "PARALLEL"
    );
  }
  /**
   * Start the subscription. This is the main method that should be called
   * after creating a subscription.
   */
  async start() {
    let cachePromise;
    if (this.shouldQueryCache()) {
      cachePromise = this.startWithCache();
      if (this.shouldWaitForCache()) {
        await cachePromise;
        if (queryFullyFilled(this)) {
          this.emit("eose", this);
          return;
        }
      }
    }
    if (this.shouldQueryRelays()) {
      this.startWithRelays();
    } else {
      this.emit("eose", this);
    }
    return;
  }
  stop() {
    this.emit("close", this);
    this.removeAllListeners();
  }
  /**
   * @returns Whether the subscription has an authors filter.
   */
  hasAuthorsFilter() {
    return this.filters.some((f2) => {
      var _a2;
      return (_a2 = f2.authors) == null ? void 0 : _a2.length;
    });
  }
  async startWithCache() {
    var _a2;
    if ((_a2 = this.ndk.cacheAdapter) == null ? void 0 : _a2.query) {
      const promise = this.ndk.cacheAdapter.query(this);
      if (this.ndk.cacheAdapter.locking) {
        await promise;
      }
    }
  }
  /**
   * Send REQ to relays
   */
  startWithRelays() {
    if (!this.relaySet) {
      this.relayFilters = calculateRelaySetsFromFilters(this.ndk, this.filters);
    } else {
      this.relayFilters = /* @__PURE__ */ new Map();
      for (const relay of this.relaySet.relays) {
        this.relayFilters.set(relay.url, this.filters);
      }
    }
    for (const [relayUrl, filters] of this.relayFilters) {
      const relay = this.pool.getRelay(relayUrl);
      relay.subscribe(this, filters);
    }
  }
  // EVENT handling
  /**
   * Called when an event is received from a relay or the cache
   * @param event
   * @param relay
   * @param fromCache Whether the event was received from the cache
   */
  eventReceived(event, relay, fromCache = false) {
    if (relay)
      event.relay = relay;
    if (!relay)
      relay = event.relay;
    if (!fromCache && relay) {
      let events = this.eventsPerRelay.get(relay);
      if (!events) {
        events = /* @__PURE__ */ new Set();
        this.eventsPerRelay.set(relay, events);
      }
      events.add(event.id);
      const eventAlreadySeen = this.eventFirstSeen.has(event.id);
      if (eventAlreadySeen) {
        const timeSinceFirstSeen = Date.now() - (this.eventFirstSeen.get(event.id) || 0);
        relay.scoreSlowerEvent(timeSinceFirstSeen);
        this.emit("event:dup", event, relay, timeSinceFirstSeen, this);
        return;
      }
      if (this.ndk.cacheAdapter) {
        this.ndk.cacheAdapter.setEvent(event, this.filters[0], relay);
      }
      this.eventFirstSeen.set(event.id, Date.now());
    } else {
      this.eventFirstSeen.set(event.id, 0);
    }
    if (!event.ndk)
      event.ndk = this.ndk;
    this.emit("event", event, relay, this);
    this.lastEventReceivedAt = Date.now();
  }
  // EOSE handling
  eoseTimeout;
  eoseReceived(relay) {
    var _a2, _b, _c;
    this.eosesSeen.add(relay);
    this.eoseDebug(`received from ${relay.url}`);
    let lastEventSeen = this.lastEventReceivedAt ? Date.now() - this.lastEventReceivedAt : void 0;
    const hasSeenAllEoses = this.eosesSeen.size === ((_a2 = this.relayFilters) == null ? void 0 : _a2.size);
    const queryFilled = queryFullyFilled(this);
    if (queryFilled) {
      this.emit("eose");
      this.eoseDebug(`Query fully filled`);
      if ((_b = this.opts) == null ? void 0 : _b.closeOnEose) {
        this.stop();
      } else {
      }
    } else if (hasSeenAllEoses) {
      this.emit("eose");
      this.eoseDebug(`All EOSEs seen`);
      if ((_c = this.opts) == null ? void 0 : _c.closeOnEose) {
        this.stop();
      } else {
      }
    } else {
      let timeToWaitForNextEose = 1e3;
      const percentageOfRelaysThatHaveSentEose = this.eosesSeen.size / this.relayFilters.size;
      if (this.eosesSeen.size >= 2 && percentageOfRelaysThatHaveSentEose >= 0.5) {
        timeToWaitForNextEose = timeToWaitForNextEose * (1 - percentageOfRelaysThatHaveSentEose);
        if (this.eoseTimeout) {
          clearTimeout(this.eoseTimeout);
        }
        const sendEoseTimeout = () => {
          var _a3;
          lastEventSeen = this.lastEventReceivedAt ? Date.now() - this.lastEventReceivedAt : void 0;
          if (lastEventSeen !== void 0 && lastEventSeen < 20) {
            this.eoseTimeout = setTimeout(sendEoseTimeout, timeToWaitForNextEose);
          } else {
            this.emit("eose");
            if ((_a3 = this.opts) == null ? void 0 : _a3.closeOnEose)
              this.stop();
          }
        };
        this.eoseTimeout = setTimeout(sendEoseTimeout, timeToWaitForNextEose);
      }
    }
  }
};
async function follows(opts, outbox, kind = 3) {
  if (!this.ndk)
    throw new Error("NDK not set");
  const contactListEvent = Array.from(
    await this.ndk.fetchEvents(
      {
        kinds: [kind],
        authors: [this.pubkey]
      },
      opts || { groupable: false }
    )
  )[0];
  if (contactListEvent) {
    const pubkeys = /* @__PURE__ */ new Set();
    contactListEvent.tags.forEach((tag) => {
      var _a2, _b;
      if (tag[0] === "p") {
        try {
          pubkeys.add(tag[1]);
          if (outbox) {
            (_b = (_a2 = this.ndk) == null ? void 0 : _a2.outboxTracker) == null ? void 0 : _b.trackUsers([tag[1]]);
          }
        } catch (e) {
        }
      }
    });
    return [...pubkeys].reduce((acc, pubkey) => {
      const user = new NDKUser({ pubkey });
      user.ndk = this.ndk;
      acc.add(user);
      return acc;
    }, /* @__PURE__ */ new Set());
  }
  return /* @__PURE__ */ new Set();
}
function profileFromEvent(event) {
  const profile = {};
  const payload = JSON.parse(event.content);
  Object.keys(payload).forEach((key) => {
    switch (key) {
      case "name":
        profile.name = payload.name;
        break;
      case "display_name":
        profile.displayName = payload.display_name;
        break;
      case "image":
      case "picture":
        profile.image = payload.image || payload.picture;
        break;
      case "banner":
        profile.banner = payload.banner;
        break;
      case "bio":
        profile.bio = payload.bio;
        break;
      case "nip05":
        profile.nip05 = payload.nip05;
        break;
      case "lud06":
        profile.lud06 = payload.lud06;
        break;
      case "lud16":
        profile.lud16 = payload.lud16;
        break;
      case "about":
        profile.about = payload.about;
        break;
      case "zapService":
        profile.zapService = payload.zapService;
        break;
      case "website":
        profile.website = payload.website;
        break;
      default:
        profile[key] = payload[key];
        break;
    }
  });
  return profile;
}
function serializeProfile(profile) {
  const payload = {};
  for (const [key, val] of Object.entries(profile)) {
    switch (key) {
      case "username":
      case "name":
        payload.name = val;
        break;
      case "displayName":
        payload.display_name = val;
        break;
      case "image":
      case "picture":
        payload.picture = val;
        break;
      case "bio":
      case "about":
        payload.about = val;
        break;
      default:
        payload[key] = val;
        break;
    }
  }
  return JSON.stringify(payload);
}
var NDKList = class extends NDKEvent {
  _encryptedTags;
  /**
   * Stores the number of bytes the content was before decryption
   * to expire the cache when the content changes.
   */
  encryptedTagsLength;
  constructor(ndk2, rawEvent) {
    var _a2;
    super(ndk2, rawEvent);
    (_a2 = this.kind) != null ? _a2 : this.kind = 30001;
  }
  /**
   * Wrap a NDKEvent into a NDKList
   */
  static from(ndkEvent) {
    return new NDKList(ndkEvent.ndk, ndkEvent.rawEvent());
  }
  /**
   * Returns the title of the list. Falls back on fetching the name tag value.
   */
  get title() {
    const titleTag = this.tagValue("title") || this.tagValue("name");
    if (this.kind === 3 && !titleTag) {
      return "Contacts";
    } else if (this.kind === 1e4 && !titleTag) {
      return "Mute";
    } else if (this.kind === 10001 && !titleTag) {
      return "Pinned Notes";
    } else if (this.kind === 10002 && !titleTag) {
      return "Relay Metadata";
    } else if (this.kind === 10003 && !titleTag) {
      return "Bookmarks";
    } else if (this.kind === 10004 && !titleTag) {
      return "Communities";
    } else if (this.kind === 10005 && !titleTag) {
      return "Public Chats";
    } else if (this.kind === 10006 && !titleTag) {
      return "Blocked Relays";
    } else if (this.kind === 10007 && !titleTag) {
      return "Search Relays";
    } else if (this.kind === 10015 && !titleTag) {
      return "Interests";
    } else if (this.kind === 10030 && !titleTag) {
      return "Emojis";
    } else {
      return titleTag != null ? titleTag : this.tagValue("d");
    }
  }
  /**
   * Sets the title of the list.
   */
  set title(title) {
    this.removeTag("title");
    this.removeTag("name");
    if (title) {
      this.tags.push(["title", title]);
    } else {
      throw new Error("Title cannot be empty");
    }
  }
  /**
   * Returns the name of the list.
   * @deprecated Please use "title" instead.
   */
  get name() {
    const nameTag = this.tagValue("name");
    if (this.kind === 3 && !nameTag) {
      return "Contacts";
    } else if (this.kind === 1e4 && !nameTag) {
      return "Mute";
    } else if (this.kind === 10001 && !nameTag) {
      return "Pinned Notes";
    } else if (this.kind === 10002 && !nameTag) {
      return "Relay Metadata";
    } else if (this.kind === 10003 && !nameTag) {
      return "Bookmarks";
    } else if (this.kind === 10004 && !nameTag) {
      return "Communities";
    } else if (this.kind === 10005 && !nameTag) {
      return "Public Chats";
    } else if (this.kind === 10006 && !nameTag) {
      return "Blocked Relays";
    } else if (this.kind === 10007 && !nameTag) {
      return "Search Relays";
    } else if (this.kind === 10015 && !nameTag) {
      return "Interests";
    } else if (this.kind === 10030 && !nameTag) {
      return "Emojis";
    } else {
      return nameTag != null ? nameTag : this.tagValue("d");
    }
  }
  /**
   * Sets the name of the list.
   * @deprecated Please use "title" instead. This method will use the `title` tag instead.
   */
  set name(name) {
    this.removeTag("name");
    if (name) {
      this.tags.push(["title", name]);
    } else {
      throw new Error("Name cannot be empty");
    }
  }
  /**
   * Returns the description of the list.
   */
  get description() {
    return this.tagValue("description");
  }
  /**
   * Sets the description of the list.
   */
  set description(name) {
    if (name) {
      this.tags.push(["description", name]);
    } else {
      this.removeTag("description");
    }
  }
  isEncryptedTagsCacheValid() {
    return !!(this._encryptedTags && this.encryptedTagsLength === this.content.length);
  }
  /**
   * Returns the decrypted content of the list.
   */
  async encryptedTags(useCache = true) {
    if (useCache && this.isEncryptedTagsCacheValid())
      return this._encryptedTags;
    if (!this.ndk)
      throw new Error("NDK instance not set");
    if (!this.ndk.signer)
      throw new Error("NDK signer not set");
    const user = await this.ndk.signer.user();
    try {
      if (this.content.length > 0) {
        try {
          const decryptedContent = await this.ndk.signer.decrypt(user, this.content);
          const a = JSON.parse(decryptedContent);
          if (a && a[0]) {
            this.encryptedTagsLength = this.content.length;
            return this._encryptedTags = a;
          }
          this.encryptedTagsLength = this.content.length;
          return this._encryptedTags = [];
        } catch (e) {
          console.log(`error decrypting ${this.content}`);
        }
      }
    } catch (e) {
    }
    return [];
  }
  /**
   * This method can be overriden to validate that a tag is valid for this list.
   *
   * (i.e. the NDKPersonList can validate that items are NDKUser instances)
   */
  validateTag(tagValue) {
    return true;
  }
  /**
   * Returns the unecrypted items in this list.
   */
  get items() {
    return this.tags.filter((t) => {
      return ![
        "d",
        "L",
        "l",
        "title",
        "name",
        "description",
        "summary",
        "image",
        "thumb",
        "alt",
        "expiration",
        "subject"
      ].includes(t[0]);
    });
  }
  /**
   * Adds a new item to the list.
   * @param relay Relay to add
   * @param mark Optional mark to add to the item
   * @param encrypted Whether to encrypt the item
   */
  async addItem(item, mark = void 0, encrypted = false) {
    if (!this.ndk)
      throw new Error("NDK instance not set");
    if (!this.ndk.signer)
      throw new Error("NDK signer not set");
    let tags;
    if (item instanceof NDKEvent) {
      tags = item.referenceTags();
    } else if (item instanceof NDKUser) {
      tags = item.referenceTags();
    } else if (item instanceof NDKRelay) {
      tags = item.referenceTags();
    } else if (Array.isArray(item)) {
      tags = [item];
    } else {
      throw new Error("Invalid object type");
    }
    if (mark)
      tags[0].push(mark);
    if (encrypted) {
      const user = await this.ndk.signer.user();
      const currentList = await this.encryptedTags();
      currentList.push(...tags);
      this._encryptedTags = currentList;
      this.encryptedTagsLength = this.content.length;
      this.content = JSON.stringify(currentList);
      await this.encrypt(user);
    } else {
      this.tags.push(...tags);
    }
    this.created_at = Math.floor(Date.now() / 1e3);
    this.emit("change");
  }
  /**
   * Removes an item from the list.
   *
   * @param index The index of the item to remove.
   * @param encrypted Whether to remove from the encrypted list or not.
   */
  async removeItem(index, encrypted) {
    if (!this.ndk)
      throw new Error("NDK instance not set");
    if (!this.ndk.signer)
      throw new Error("NDK signer not set");
    if (encrypted) {
      const user = await this.ndk.signer.user();
      const currentList = await this.encryptedTags();
      currentList.splice(index, 1);
      this._encryptedTags = currentList;
      this.encryptedTagsLength = this.content.length;
      this.content = JSON.stringify(currentList);
      await this.encrypt(user);
    } else {
      this.tags.splice(index, 1);
    }
    this.created_at = Math.floor(Date.now() / 1e3);
    this.emit("change");
    return this;
  }
};
var lists_default = NDKList;
async function pin(event, pinEvent, publish) {
  const kind = 10001;
  if (!this.ndk)
    throw new Error("No NDK instance found");
  this.ndk.assertSigner();
  if (!pinEvent) {
    const events = await this.ndk.fetchEvents(
      { kinds: [kind], authors: [this.pubkey] },
      {
        cacheUsage: "ONLY_RELAY"
        /* ONLY_RELAY */
      }
    );
    if (events.size > 0) {
      pinEvent = lists_default.from(Array.from(events)[0]);
    } else {
      pinEvent = new NDKEvent(this.ndk, {
        kind
      });
    }
  }
  pinEvent.tag(event);
  if (publish) {
    await pinEvent.publish();
  }
  return pinEvent;
}
var NDKUser = class {
  ndk;
  profile;
  _npub;
  _pubkey;
  relayUrls = [];
  constructor(opts) {
    if (opts.npub)
      this._npub = opts.npub;
    if (opts.hexpubkey)
      this._pubkey = opts.hexpubkey;
    if (opts.pubkey)
      this._pubkey = opts.pubkey;
    if (opts.relayUrls) {
      this.relayUrls = opts.relayUrls;
    }
  }
  get npub() {
    if (!this._npub) {
      if (!this._pubkey)
        throw new Error("hexpubkey not set");
      this._npub = nip19_exports.npubEncode(this.pubkey);
    }
    return this._npub;
  }
  set npub(npub) {
    this._npub = npub;
  }
  /**
   * Get the user's hexpubkey
   * @returns {Hexpubkey} The user's hexpubkey
   *
   * @deprecated Use `pubkey` instead
   */
  get hexpubkey() {
    return this.pubkey;
  }
  /**
   * Set the user's hexpubkey
   * @param pubkey {Hexpubkey} The user's hexpubkey
   * @deprecated Use `pubkey` instead
   */
  set hexpubkey(pubkey) {
    this._pubkey = pubkey;
  }
  /**
   * Get the user's pubkey
   * @returns {string} The user's pubkey
   */
  get pubkey() {
    if (!this._pubkey) {
      if (!this._npub)
        throw new Error("npub not set");
      this._pubkey = nip19_exports.decode(this.npub).data;
    }
    return this._pubkey;
  }
  /**
   * Set the user's pubkey
   * @param pubkey {string} The user's pubkey
   */
  set pubkey(pubkey) {
    this._pubkey = pubkey;
  }
  /**
   * Instantiate an NDKUser from a NIP-05 string
   * @param nip05Id {string} The user's NIP-05
   * @returns {NDKUser | undefined} An NDKUser if one is found for the given NIP-05, undefined otherwise.
   */
  static async fromNip05(nip05Id) {
    const profile = await nip05_exports.queryProfile(nip05Id);
    if (profile) {
      return new NDKUser({
        pubkey: profile.pubkey,
        relayUrls: profile.relays
      });
    }
  }
  /**
   * Fetch a user's profile
   * @param opts {NDKSubscriptionOptions} A set of NDKSubscriptionOptions
   * @returns User Profile
   */
  async fetchProfile(opts) {
    if (!this.ndk)
      throw new Error("NDK not set");
    if (!this.profile)
      this.profile = {};
    let setMetadataEvents = null;
    if (this.ndk.cacheAdapter && this.ndk.cacheAdapter.fetchProfile && (opts == null ? void 0 : opts.cacheUsage) !== "ONLY_RELAY") {
      const profile = await this.ndk.cacheAdapter.fetchProfile(this.pubkey);
      if (profile) {
        this.profile = profile;
        return profile;
      }
    }
    if (!opts && // if no options have been set
    this.ndk.cacheAdapter && // and we have a cache
    this.ndk.cacheAdapter.locking) {
      setMetadataEvents = await this.ndk.fetchEvents(
        {
          kinds: [0],
          authors: [this.pubkey]
        },
        {
          cacheUsage: "ONLY_CACHE",
          closeOnEose: true,
          groupable: false
        }
      );
      opts = {
        cacheUsage: "ONLY_RELAY",
        closeOnEose: true,
        groupable: true,
        groupableDelay: 250
      };
    }
    if (!setMetadataEvents || setMetadataEvents.size === 0) {
      setMetadataEvents = await this.ndk.fetchEvents(
        {
          kinds: [0],
          authors: [this.pubkey]
        },
        opts
      );
    }
    const sortedSetMetadataEvents = Array.from(setMetadataEvents).sort(
      (a, b) => a.created_at - b.created_at
    );
    if (sortedSetMetadataEvents.length === 0)
      return null;
    this.profile = profileFromEvent(sortedSetMetadataEvents[0]);
    if (this.profile && this.ndk.cacheAdapter && this.ndk.cacheAdapter.saveProfile) {
      this.ndk.cacheAdapter.saveProfile(this.pubkey, this.profile);
    }
    return this.profile;
  }
  /**
   * Returns a set of users that this user follows.
   */
  follows = follows.bind(this);
  /**
   * Pins a user or an event
   */
  pin = pin.bind(this);
  /**
   * Returns a set of relay list events for a user.
   * @returns {Promise<Set<NDKEvent>>} A set of NDKEvents returned for the given user.
   */
  async relayList() {
    if (!this.ndk)
      throw new Error("NDK not set");
    const pool = this.ndk.outboxPool || this.ndk.pool;
    const set = /* @__PURE__ */ new Set();
    for (const relay of pool.relays.values())
      set.add(relay);
    const relaySet = new NDKRelaySet(set, this.ndk);
    const event = await this.ndk.fetchEvent(
      {
        kinds: [10002],
        authors: [this.pubkey]
      },
      {
        closeOnEose: true,
        pool,
        groupable: true,
        subId: `relay-list-${this.pubkey.slice(0, 6)}`
      },
      relaySet
    );
    if (event)
      return NDKRelayList.from(event);
    return await this.relayListFromKind3();
  }
  async relayListFromKind3() {
    if (!this.ndk)
      throw new Error("NDK not set");
    const followList = await this.ndk.fetchEvent({
      kinds: [3],
      authors: [this.pubkey]
    });
    if (followList) {
      try {
        const content = JSON.parse(followList.content);
        const relayList = new NDKRelayList(this.ndk);
        const readRelays = /* @__PURE__ */ new Set();
        const writeRelays = /* @__PURE__ */ new Set();
        for (const [key, config] of Object.entries(content)) {
          if (!config) {
            readRelays.add(key);
            writeRelays.add(key);
          } else {
            const relayConfig = config;
            if (relayConfig.write)
              writeRelays.add(key);
            if (relayConfig.read)
              readRelays.add(key);
          }
        }
        relayList.readRelayUrls = Array.from(readRelays);
        relayList.writeRelayUrls = Array.from(writeRelays);
        return relayList;
      } catch (e) {
      }
    }
    return void 0;
  }
  /** @deprecated Use referenceTags instead. */
  /**
   * Get the tag that can be used to reference this user in an event
   * @returns {NDKTag} an NDKTag
   */
  tagReference() {
    return ["p", this.pubkey];
  }
  /**
   * Get the tags that can be used to reference this user in an event
   * @returns {NDKTag[]} an array of NDKTag
   */
  referenceTags(marker) {
    const tag = [["p", this.pubkey]];
    if (!marker)
      return tag;
    tag[0].push("", marker);
    return tag;
  }
  /**
   * Publishes the current profile.
   */
  async publish() {
    if (!this.ndk)
      throw new Error("No NDK instance found");
    if (!this.profile)
      throw new Error("No profile available");
    this.ndk.assertSigner();
    const event = new NDKEvent(this.ndk, {
      kind: 0,
      content: serializeProfile(this.profile)
    });
    await event.publish();
  }
  /**
   * Add a follow to this user's contact list
   *
   * @param newFollow {NDKUser} The user to follow
   * @param currentFollowList {Set<NDKUser>} The current follow list
   * @param kind {NDKKind} The kind to use for this contact list (defaults to `3`)
   * @returns {Promise<boolean>} True if the follow was added, false if the follow already exists
   */
  async follow(newFollow, currentFollowList, kind = 3) {
    if (!this.ndk)
      throw new Error("No NDK instance found");
    this.ndk.assertSigner();
    if (!currentFollowList) {
      currentFollowList = await this.follows(void 0, void 0, kind);
    }
    if (currentFollowList.has(newFollow)) {
      return false;
    }
    currentFollowList.add(newFollow);
    const event = new NDKEvent(this.ndk, { kind });
    for (const follow of currentFollowList) {
      event.tag(follow);
    }
    await event.publish();
    return true;
  }
  /**
   * Validate a user's NIP-05 identifier (usually fetched from their kind:0 profile data)
   *
   * @param nip05Id The NIP-05 string to validate
   * @returns {Promise<boolean | null>} True if the NIP-05 is found and matches this user's pubkey,
   * False if the NIP-05 is found but doesn't match this user's pubkey,
   * null if the NIP-05 isn't found on the domain or we're unable to verify (because of network issues, etc.)
   */
  async validateNip05(nip05Id) {
    if (!this.ndk)
      throw new Error("No NDK instance found");
    const profilePointer = await nip05_exports.queryProfile(nip05Id);
    if (profilePointer === null)
      return null;
    return profilePointer.pubkey === this.pubkey;
  }
  /**
   * Zap a user
   *
   * @param amount The amount to zap in millisatoshis
   * @param comment A comment to add to the zap request
   * @param extraTags Extra tags to add to the zap request
   * @param signer The signer to use (will default to the NDK instance's signer)
   */
  async zap(amount, comment, extraTags, signer) {
    if (!this.ndk)
      throw new Error("No NDK instance found");
    if (!signer) {
      this.ndk.assertSigner();
    }
    const zap = new Zap({
      ndk: this.ndk,
      zappedUser: this
    });
    const relays = Array.from(this.ndk.pool.relays.keys());
    const paymentRequest = await zap.createZapRequest(
      amount,
      comment,
      extraTags,
      relays,
      signer
    );
    return paymentRequest;
  }
};
var NDKRepost = class extends NDKEvent {
  _repostedEvents;
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
  }
  static from(event) {
    return new NDKRepost(event.ndk, event.rawEvent());
  }
  /**
   * Returns all reposted events by the current event.
   *
   * @param klass Optional class to convert the events to.
   * @returns
   */
  async repostedEvents(klass, opts) {
    const items = [];
    if (!this.ndk)
      throw new Error("NDK instance not set");
    if (this._repostedEvents !== void 0)
      return this._repostedEvents;
    for (const eventId of this.repostedEventIds()) {
      const filter = filterForId(eventId);
      const event = await this.ndk.fetchEvent(filter, opts);
      if (event) {
        items.push(klass ? klass.from(event) : event);
      }
    }
    return items;
  }
  /**
   * Returns the reposted event IDs.
   */
  repostedEventIds() {
    return this.tags.filter((t) => t[0] === "e" || t[0] === "a").map((t) => t[1]);
  }
};
function filterForId(id) {
  if (id.match(/:/)) {
    const [kind, pubkey, identifier] = id.split(":");
    return {
      kinds: [parseInt(kind)],
      authors: [pubkey],
      "#d": [identifier]
    };
  } else {
    return { ids: [id] };
  }
}
function dedup(event1, event2) {
  if (event1.created_at > event2.created_at) {
    return event1;
  }
  return event2;
}
var OutboxItem = class {
  /**
   * Type of item
   */
  type;
  /**
   * The relay URLs that are of interest to this item
   */
  relayUrlScores;
  readRelays;
  writeRelays;
  constructor(type2) {
    this.type = type2;
    this.relayUrlScores = /* @__PURE__ */ new Map();
    this.readRelays = /* @__PURE__ */ new Set();
    this.writeRelays = /* @__PURE__ */ new Set();
  }
};
var OutboxTracker = class extends import_tseep9.EventEmitter {
  data;
  ndk;
  debug;
  constructor(ndk2) {
    super();
    this.ndk = ndk2;
    this.debug = ndk2.debug.extend("outbox-tracker");
    this.data = new import_typescript_lru_cache.LRUCache({
      maxSize: 1e5,
      entryExpirationTimeInMS: 5e3
    });
  }
  trackUsers(items) {
    for (const item of items) {
      const itemKey = getKeyFromItem(item);
      if (this.data.has(itemKey))
        continue;
      const outboxItem = this.track(item, "user");
      const user = item instanceof NDKUser ? item : new NDKUser({ hexpubkey: item });
      user.ndk = this.ndk;
      user.relayList().then((relayList) => {
        if (relayList) {
          outboxItem.readRelays = new Set(relayList.readRelayUrls);
          outboxItem.writeRelays = new Set(relayList.writeRelayUrls);
          for (const relayUrl of outboxItem.readRelays) {
            if (this.ndk.pool.blacklistRelayUrls.has(relayUrl)) {
              this.debug(`removing blacklisted relay ${relayUrl} from read relays`);
              outboxItem.readRelays.delete(relayUrl);
            }
          }
          for (const relayUrl of outboxItem.writeRelays) {
            if (this.ndk.pool.blacklistRelayUrls.has(relayUrl)) {
              this.debug(`removing blacklisted relay ${relayUrl} from write relays`);
              outboxItem.writeRelays.delete(relayUrl);
            }
          }
          this.data.set(itemKey, outboxItem);
          this.debug(
            `Adding ${outboxItem.readRelays.size} read relays and ${outboxItem.writeRelays.size} write relays for ${user.hexpubkey}`
          );
        }
      });
    }
  }
  /**
   *
   * @param key
   * @param score
   */
  track(item, type2) {
    const key = getKeyFromItem(item);
    type2 != null ? type2 : type2 = getTypeFromItem(item);
    let outboxItem = this.data.get(key);
    if (!outboxItem)
      outboxItem = new OutboxItem(type2);
    this.data.set(key, outboxItem);
    return outboxItem;
  }
};
function getKeyFromItem(item) {
  if (item instanceof NDKUser) {
    return item.hexpubkey;
  } else {
    return item;
  }
}
function getTypeFromItem(item) {
  if (item instanceof NDKUser) {
    return "user";
  } else {
    return "kind";
  }
}
var NDKPool = class extends import_tseep10.EventEmitter {
  // TODO: This should probably be an LRU cache
  relays = /* @__PURE__ */ new Map();
  blacklistRelayUrls;
  debug;
  temporaryRelayTimers = /* @__PURE__ */ new Map();
  flappingRelays = /* @__PURE__ */ new Set();
  // A map to store timeouts for each flapping relay.
  backoffTimes = /* @__PURE__ */ new Map();
  constructor(relayUrls = [], blacklistedRelayUrls = [], ndk2, debug42) {
    super();
    this.debug = debug42 != null ? debug42 : ndk2.debug.extend("pool");
    for (const relayUrl of relayUrls) {
      const relay = new NDKRelay(relayUrl);
      this.addRelay(relay, false);
    }
    this.blacklistRelayUrls = new Set(blacklistedRelayUrls);
  }
  /**
   * Adds a relay to the pool, and sets a timer to remove it if it is not used within the specified time.
   * @param relay - The relay to add to the pool.
   * @param removeIfUnusedAfter - The time in milliseconds to wait before removing the relay from the pool after it is no longer used.
   */
  useTemporaryRelay(relay, removeIfUnusedAfter = 6e5) {
    const relayAlreadyInPool = this.relays.has(relay.url);
    if (!relayAlreadyInPool) {
      this.addRelay(relay);
    }
    const existingTimer = this.temporaryRelayTimers.get(relay.url);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    if (!relayAlreadyInPool || existingTimer) {
      const timer = setTimeout(() => {
        this.removeRelay(relay.url);
      }, removeIfUnusedAfter);
      this.temporaryRelayTimers.set(relay.url, timer);
    }
  }
  /**
   * Adds a relay to the pool.
   *
   * @param relay - The relay to add to the pool.
   * @param connect - Whether or not to connect to the relay.
   */
  addRelay(relay, connect = true) {
    var _a2;
    const relayUrl = relay.url;
    if ((_a2 = this.blacklistRelayUrls) == null ? void 0 : _a2.has(relayUrl)) {
      this.debug(`Relay ${relayUrl} is blacklisted`);
      return;
    }
    relay.on("notice", async (relay2, notice) => this.emit("notice", relay2, notice));
    relay.on("connect", () => this.handleRelayConnect(relayUrl));
    relay.on("disconnect", async () => this.emit("relay:disconnect", relay));
    relay.on("flapping", () => this.handleFlapping(relay));
    this.relays.set(relayUrl, relay);
    if (connect) {
      relay.connect().catch((e) => {
        this.debug(`Failed to connect to relay ${relayUrl}`, e);
      });
    }
  }
  /**
   * Removes a relay from the pool.
   * @param relayUrl - The URL of the relay to remove.
   * @returns {boolean} True if the relay was removed, false if it was not found.
   */
  removeRelay(relayUrl) {
    const relay = this.relays.get(relayUrl);
    if (relay) {
      relay.disconnect();
      this.relays.delete(relayUrl);
      this.emit("relay:disconnect", relay);
      return true;
    }
    const existingTimer = this.temporaryRelayTimers.get(relayUrl);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.temporaryRelayTimers.delete(relayUrl);
    }
    return false;
  }
  /**
   * Fetches a relay from the pool, or creates a new one if it does not exist.
   *
   * New relays will be attempted to be connected.
   */
  getRelay(url) {
    let relay = this.relays.get(url);
    if (!relay) {
      relay = new NDKRelay(url);
      this.addRelay(relay);
    }
    return relay;
  }
  handleRelayConnect(relayUrl) {
    this.debug(`Relay ${relayUrl} connected`);
    this.emit("relay:connect", this.relays.get(relayUrl));
    if (this.stats().connected === this.relays.size) {
      this.emit("connect");
    }
  }
  /**
   * Attempts to establish a connection to each relay in the pool.
   *
   * @async
   * @param {number} [timeoutMs] - Optional timeout in milliseconds for each connection attempt.
   * @returns {Promise<void>} A promise that resolves when all connection attempts have completed.
   * @throws {Error} If any of the connection attempts result in an error or timeout.
   */
  async connect(timeoutMs) {
    const promises = [];
    this.debug(
      `Connecting to ${this.relays.size} relays${timeoutMs ? `, timeout ${timeoutMs}...` : ""}`
    );
    for (const relay of this.relays.values()) {
      if (timeoutMs) {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(`Timed out after ${timeoutMs}ms`), timeoutMs);
        });
        promises.push(
          Promise.race([relay.connect(), timeoutPromise]).catch((e) => {
            this.debug(
              `Failed to connect to relay ${relay.url}: ${e != null ? e : "No reason specified"}`
            );
          })
        );
      } else {
        promises.push(relay.connect());
      }
    }
    if (timeoutMs) {
      setTimeout(() => {
        const allConnected = this.stats().connected === this.relays.size;
        const someConnected = this.stats().connected > 0;
        if (!allConnected && someConnected) {
          this.emit("connect");
        }
      }, timeoutMs);
    }
    await Promise.all(promises);
  }
  checkOnFlappingRelays() {
    const flappingRelaysCount = this.flappingRelays.size;
    const totalRelays = this.relays.size;
    if (flappingRelaysCount / totalRelays >= 0.8) {
      for (const relayUrl of this.flappingRelays) {
        this.backoffTimes.set(relayUrl, 0);
      }
    }
  }
  handleFlapping(relay) {
    this.debug(`Relay ${relay.url} is flapping`);
    let currentBackoff = this.backoffTimes.get(relay.url) || 5e3;
    currentBackoff = currentBackoff * 2;
    this.backoffTimes.set(relay.url, currentBackoff);
    this.debug(`Backoff time for ${relay.url} is ${currentBackoff}ms`);
    setTimeout(() => {
      this.debug(`Attempting to reconnect to ${relay.url}`);
      relay.connect();
      this.checkOnFlappingRelays();
    }, currentBackoff);
    relay.disconnect();
    this.emit("flapping", relay);
  }
  size() {
    return this.relays.size;
  }
  /**
   * Returns the status of each relay in the pool.
   * @returns {NDKPoolStats} An object containing the number of relays in each status.
   */
  stats() {
    const stats = {
      total: 0,
      connected: 0,
      disconnected: 0,
      connecting: 0
    };
    for (const relay of this.relays.values()) {
      stats.total++;
      if (relay.status === 1) {
        stats.connected++;
      } else if (relay.status === 3) {
        stats.disconnected++;
      } else if (relay.status === 0) {
        stats.connecting++;
      }
    }
    return stats;
  }
  connectedRelays() {
    return Array.from(this.relays.values()).filter(
      (relay) => relay.status === 1
      /* CONNECTED */
    );
  }
  /**
   * Get a list of all relay urls in the pool.
   */
  urls() {
    return Array.from(this.relays.keys());
  }
};
function correctRelaySet(relaySet, pool) {
  const connectedRelays = pool.connectedRelays();
  const includesConnectedRelay = Array.from(relaySet.relays).some((relay) => {
    return connectedRelays.map((r) => r.url).includes(relay.url);
  });
  if (!includesConnectedRelay) {
    for (const relay of connectedRelays) {
      relaySet.addRelay(relay);
    }
  }
  if (connectedRelays.length === 0) {
    for (const relay of pool.relays.values()) {
      relaySet.addRelay(relay);
    }
  }
  return relaySet;
}
var DEFAULT_OUTBOX_RELAYS = ["wss://purplepag.es", "wss://relay.snort.social"];
var DEFAULT_BLACKLISTED_RELAYS = [
  "wss://brb.io"
  // BRB
];
var NDK = class extends import_tseep8.EventEmitter {
  explicitRelayUrls;
  pool;
  outboxPool;
  _signer;
  _activeUser;
  cacheAdapter;
  debug;
  devWriteRelaySet;
  outboxTracker;
  mutedIds;
  clientName;
  clientNip89;
  autoConnectUserRelays = true;
  autoFetchUserMutelist = true;
  constructor(opts = {}) {
    var _a2, _b;
    super();
    this.debug = opts.debug || (0, import_debug3.default)("ndk");
    this.explicitRelayUrls = opts.explicitRelayUrls;
    this.pool = new NDKPool(opts.explicitRelayUrls || [], opts.blacklistRelayUrls, this);
    this.debug(`Starting with explicit relays: ${JSON.stringify(this.explicitRelayUrls)}`);
    this.autoConnectUserRelays = (_a2 = opts.autoConnectUserRelays) != null ? _a2 : true;
    this.autoFetchUserMutelist = (_b = opts.autoFetchUserMutelist) != null ? _b : true;
    this.clientName = opts.clientName;
    this.clientNip89 = opts.clientNip89;
    if (opts.enableOutboxModel) {
      this.outboxPool = new NDKPool(
        opts.outboxRelayUrls || DEFAULT_OUTBOX_RELAYS,
        opts.blacklistRelayUrls || DEFAULT_BLACKLISTED_RELAYS,
        this,
        this.debug.extend("outbox-pool")
      );
      this.outboxTracker = new OutboxTracker(this);
    }
    this.signer = opts.signer;
    this.cacheAdapter = opts.cacheAdapter;
    this.mutedIds = opts.mutedIds || /* @__PURE__ */ new Map();
    if (opts.devWriteRelayUrls) {
      this.devWriteRelaySet = NDKRelaySet.fromRelayUrls(opts.devWriteRelayUrls, this);
    }
  }
  toJSON() {
    return { relayCount: this.pool.relays.size }.toString();
  }
  get activeUser() {
    return this._activeUser;
  }
  /**
   * Sets the active user for this NDK instance, typically this will be
   * called when assigning a signer to the NDK instance.
   *
   * This function will automatically connect to the user's relays if
   * `autoConnectUserRelays` is set to true.
   *
   * It will also fetch the user's mutelist if `autoFetchUserMutelist` is set to true.
   */
  set activeUser(user) {
    const differentUser = this._activeUser !== user;
    this._activeUser = user;
    if (user && differentUser) {
      const connectToUserRelays = async (user2) => {
        const relayList = await user2.relayList();
        if (!relayList) {
          this.debug("No relay list found for user", { npub: user2.npub });
          return;
        }
        this.debug("Connecting to user relays", {
          npub: user2.npub,
          relays: relayList.relays
        });
        for (const url of relayList.relays) {
          let relay = this.pool.relays.get(url);
          if (!relay) {
            relay = new NDKRelay(url);
            this.pool.addRelay(relay);
          }
        }
      };
      const fetchUserMuteList = async (user2) => {
        const muteLists = await this.fetchEvents([
          { kinds: [
            1e4
            /* MuteList */
          ], authors: [user2.pubkey] },
          {
            kinds: [
              3e4
              /* FollowSet */
            ],
            authors: [user2.pubkey],
            "#d": ["mute"],
            limit: 1
          }
        ]);
        if (!muteLists) {
          this.debug("No mute list found for user", { npub: user2.npub });
          return;
        }
        for (const muteList of muteLists) {
          const list = lists_default.from(muteList);
          for (const item of list.items) {
            this.mutedIds.set(item[1], item[0]);
          }
        }
      };
      const userFunctions = [];
      if (this.autoConnectUserRelays)
        userFunctions.push(connectToUserRelays);
      if (this.autoFetchUserMutelist)
        userFunctions.push(fetchUserMuteList);
      const runUserFunctions = async (user2) => {
        for (const fn of userFunctions) {
          await fn(user2);
        }
      };
      const pool = this.outboxPool || this.pool;
      if (pool.connectedRelays.length > 0) {
        runUserFunctions(user);
      } else {
        this.debug("Waiting for connection to main relays");
        pool.once("relay:connect", (relay) => {
          this.debug("New relay came online", relay);
          runUserFunctions(user);
        });
      }
    } else if (!user) {
      this.mutedIds = /* @__PURE__ */ new Map();
    }
  }
  get signer() {
    return this._signer;
  }
  set signer(newSigner) {
    this._signer = newSigner;
    this.debug(`setting signer`, this.autoConnectUserRelays);
    newSigner == null ? void 0 : newSigner.user().then((user) => {
      user.ndk = this;
      this.activeUser = user;
    });
  }
  /**
   * Connect to relays with optional timeout.
   * If the timeout is reached, the connection will be continued to be established in the background.
   */
  async connect(timeoutMs) {
    if (this._signer && this.autoConnectUserRelays) {
      this.debug("Attempting to connect to user relays specified by signer");
      if (this._signer.relays) {
        const relays = await this._signer.relays();
        relays.forEach((relay) => this.pool.addRelay(relay));
      }
    }
    const connections2 = [this.pool.connect(timeoutMs)];
    if (this.outboxPool) {
      connections2.push(this.outboxPool.connect(timeoutMs));
    }
    this.debug("Connecting to relays", { timeoutMs });
    return Promise.allSettled(connections2).then(() => {
    });
  }
  /**
   * Get a NDKUser object
   *
   * @param opts
   * @returns
   */
  getUser(opts) {
    const user = new NDKUser(opts);
    user.ndk = this;
    return user;
  }
  /**
   * Create a new subscription. Subscriptions automatically start, you can make them automatically close when all relays send back an EOSE by setting `opts.closeOnEose` to `true`)
   *
   * @param filters
   * @param opts
   * @param relaySet explicit relay set to use
   * @param autoStart automatically start the subscription
   * @returns NDKSubscription
   */
  subscribe(filters, opts, relaySet, autoStart = true) {
    var _a2;
    const subscription = new NDKSubscription(this, filters, opts, relaySet);
    if (relaySet) {
      for (const relay of relaySet.relays) {
        this.pool.useTemporaryRelay(relay);
      }
    }
    if (this.outboxPool && subscription.hasAuthorsFilter()) {
      const authors = subscription.filters.filter((filter) => {
        var _a3;
        return filter.authors && ((_a3 = filter.authors) == null ? void 0 : _a3.length) > 0;
      }).map((filter) => filter.authors).flat();
      (_a2 = this.outboxTracker) == null ? void 0 : _a2.trackUsers(authors);
    }
    if (autoStart)
      subscription.start();
    return subscription;
  }
  /**
   * Publish an event to a relay
   * @param event event to publish
   * @param relaySet explicit relay set to use
   * @param timeoutMs timeout in milliseconds to wait for the event to be published
   * @returns The relays the event was published to
   *
   * @deprecated Use `event.publish()` instead
   */
  async publish(event, relaySet, timeoutMs) {
    this.debug("Deprecated: Use `event.publish()` instead");
    return event.publish(relaySet, timeoutMs);
  }
  /**
   * Fetch a single event.
   *
   * @param idOrFilter event id in bech32 format or filter
   * @param opts subscription options
   * @param relaySet explicit relay set to use
   */
  async fetchEvent(idOrFilter, opts, relaySet) {
    let filter;
    if (!relaySet && typeof idOrFilter === "string") {
      if (!isNip33AValue(idOrFilter)) {
        const relays = relaysFromBech32(idOrFilter);
        if (relays.length > 0) {
          relaySet = new NDKRelaySet(new Set(relays), this);
          relaySet = correctRelaySet(relaySet, this.pool);
        }
      }
    }
    if (typeof idOrFilter === "string") {
      filter = filterFromId(idOrFilter);
    } else {
      filter = idOrFilter;
    }
    if (!filter) {
      throw new Error(`Invalid filter: ${JSON.stringify(idOrFilter)}`);
    }
    return new Promise((resolve) => {
      const s = this.subscribe(
        filter,
        { ...opts || {}, closeOnEose: true },
        relaySet,
        false
      );
      s.on("event", (event) => {
        event.ndk = this;
        resolve(event);
      });
      s.on("eose", () => {
        resolve(null);
      });
      s.start();
    });
  }
  /**
   * Fetch events
   */
  async fetchEvents(filters, opts, relaySet) {
    return new Promise((resolve) => {
      const events = /* @__PURE__ */ new Map();
      const relaySetSubscription = this.subscribe(
        filters,
        { ...opts || {}, closeOnEose: true },
        relaySet,
        false
      );
      const onEvent = (event) => {
        const dedupKey = event.deduplicationKey();
        const existingEvent = events.get(dedupKey);
        if (existingEvent) {
          event = dedup(existingEvent, event);
        }
        event.ndk = this;
        events.set(dedupKey, event);
      };
      relaySetSubscription.on("event", onEvent);
      relaySetSubscription.on("event:dup", onEvent);
      relaySetSubscription.on("eose", () => {
        resolve(new Set(events.values()));
      });
      relaySetSubscription.start();
    });
  }
  /**
   * Ensures that a signer is available to sign an event.
   */
  assertSigner() {
    if (!this.signer) {
      this.emit("signerRequired");
      throw new Error("Signer required");
    }
  }
};

// node_modules/nostr-tools/node_modules/@noble/curves/node_modules/@noble/hashes/esm/_assert.js
function number5(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error(`Wrong positive integer: ${n}`);
}
function bytes5(b, ...lengths) {
  if (!(b instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
function hash5(hash8) {
  if (typeof hash8 !== "function" || typeof hash8.create !== "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  number5(hash8.outputLen);
  number5(hash8.blockLen);
}
function exists5(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function output5(out, instance) {
  bytes5(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error(`digestInto() expects output buffer of length at least ${min}`);
  }
}

// node_modules/nostr-tools/node_modules/@noble/curves/node_modules/@noble/hashes/esm/cryptoNode.js
var nc4 = __toESM(require("crypto"), 1);
var crypto5 = nc4 && typeof nc4 === "object" && "webcrypto" in nc4 ? nc4.webcrypto : void 0;

// node_modules/nostr-tools/node_modules/@noble/curves/node_modules/@noble/hashes/esm/utils.js
var u8a6 = (a) => a instanceof Uint8Array;
var createView5 = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
var rotr4 = (word, shift) => word << 32 - shift | word >>> shift;
var isLE5 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!isLE5)
  throw new Error("Non little-endian hardware is not supported");
function utf8ToBytes6(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes5(data) {
  if (typeof data === "string")
    data = utf8ToBytes6(data);
  if (!u8a6(data))
    throw new Error(`expected Uint8Array, got ${typeof data}`);
  return data;
}
function concatBytes5(...arrays) {
  const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
  let pad2 = 0;
  arrays.forEach((a) => {
    if (!u8a6(a))
      throw new Error("Uint8Array expected");
    r.set(a, pad2);
    pad2 += a.length;
  });
  return r;
}
var Hash4 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
var toStr2 = {}.toString;
function wrapConstructor4(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes5(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function randomBytes4(bytesLength = 32) {
  if (crypto5 && typeof crypto5.getRandomValues === "function") {
    return crypto5.getRandomValues(new Uint8Array(bytesLength));
  }
  throw new Error("crypto.getRandomValues must be defined");
}

// node_modules/nostr-tools/node_modules/@noble/curves/node_modules/@noble/hashes/esm/_sha2.js
function setBigUint645(view, byteOffset, value, isLE8) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE8);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE8 ? 4 : 0;
  const l = isLE8 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE8);
  view.setUint32(byteOffset + l, wl, isLE8);
}
var SHA24 = class extends Hash4 {
  constructor(blockLen, outputLen, padOffset, isLE8) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE8;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView5(this.buffer);
  }
  update(data) {
    exists5(this);
    const { view, buffer, blockLen } = this;
    data = toBytes5(data);
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView5(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    exists5(this);
    output5(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE8 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    this.buffer.subarray(pos).fill(0);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i2 = pos; i2 < blockLen; i2++)
      buffer[i2] = 0;
    setBigUint645(view, blockLen - 8, BigInt(this.length * 8), isLE8);
    this.process(view, 0);
    const oview = createView5(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i2 = 0; i2 < outLen; i2++)
      oview.setUint32(4 * i2, state[i2], isLE8);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.length = length;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
};

// node_modules/nostr-tools/node_modules/@noble/curves/node_modules/@noble/hashes/esm/sha256.js
var Chi4 = (a, b, c) => a & b ^ ~a & c;
var Maj4 = (a, b, c) => a & b ^ a & c ^ b & c;
var SHA256_K4 = /* @__PURE__ */ new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var IV4 = /* @__PURE__ */ new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA256_W4 = /* @__PURE__ */ new Uint32Array(64);
var SHA2564 = class extends SHA24 {
  constructor() {
    super(64, 32, 8, false);
    this.A = IV4[0] | 0;
    this.B = IV4[1] | 0;
    this.C = IV4[2] | 0;
    this.D = IV4[3] | 0;
    this.E = IV4[4] | 0;
    this.F = IV4[5] | 0;
    this.G = IV4[6] | 0;
    this.H = IV4[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4)
      SHA256_W4[i2] = view.getUint32(offset, false);
    for (let i2 = 16; i2 < 64; i2++) {
      const W15 = SHA256_W4[i2 - 15];
      const W2 = SHA256_W4[i2 - 2];
      const s0 = rotr4(W15, 7) ^ rotr4(W15, 18) ^ W15 >>> 3;
      const s1 = rotr4(W2, 17) ^ rotr4(W2, 19) ^ W2 >>> 10;
      SHA256_W4[i2] = s1 + SHA256_W4[i2 - 7] + s0 + SHA256_W4[i2 - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i2 = 0; i2 < 64; i2++) {
      const sigma1 = rotr4(E, 6) ^ rotr4(E, 11) ^ rotr4(E, 25);
      const T1 = H + sigma1 + Chi4(E, F, G) + SHA256_K4[i2] + SHA256_W4[i2] | 0;
      const sigma0 = rotr4(A, 2) ^ rotr4(A, 13) ^ rotr4(A, 22);
      const T2 = sigma0 + Maj4(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    SHA256_W4.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
};
var sha2564 = /* @__PURE__ */ wrapConstructor4(() => new SHA2564());

// node_modules/nostr-tools/node_modules/@noble/curves/esm/abstract/utils.js
var utils_exports3 = {};
__export(utils_exports3, {
  bitGet: () => bitGet2,
  bitLen: () => bitLen2,
  bitMask: () => bitMask2,
  bitSet: () => bitSet2,
  bytesToHex: () => bytesToHex4,
  bytesToNumberBE: () => bytesToNumberBE2,
  bytesToNumberLE: () => bytesToNumberLE2,
  concatBytes: () => concatBytes6,
  createHmacDrbg: () => createHmacDrbg2,
  ensureBytes: () => ensureBytes3,
  equalBytes: () => equalBytes3,
  hexToBytes: () => hexToBytes4,
  hexToNumber: () => hexToNumber2,
  numberToBytesBE: () => numberToBytesBE2,
  numberToBytesLE: () => numberToBytesLE2,
  numberToHexUnpadded: () => numberToHexUnpadded2,
  numberToVarBytesBE: () => numberToVarBytesBE2,
  utf8ToBytes: () => utf8ToBytes7,
  validateObject: () => validateObject2
});
var _0n6 = BigInt(0);
var _1n6 = BigInt(1);
var _2n5 = BigInt(2);
var u8a7 = (a) => a instanceof Uint8Array;
var hexes5 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i2) => i2.toString(16).padStart(2, "0"));
function bytesToHex4(bytes8) {
  if (!u8a7(bytes8))
    throw new Error("Uint8Array expected");
  let hex5 = "";
  for (let i2 = 0; i2 < bytes8.length; i2++) {
    hex5 += hexes5[bytes8[i2]];
  }
  return hex5;
}
function numberToHexUnpadded2(num) {
  const hex5 = num.toString(16);
  return hex5.length & 1 ? `0${hex5}` : hex5;
}
function hexToNumber2(hex5) {
  if (typeof hex5 !== "string")
    throw new Error("hex string expected, got " + typeof hex5);
  return BigInt(hex5 === "" ? "0" : `0x${hex5}`);
}
function hexToBytes4(hex5) {
  if (typeof hex5 !== "string")
    throw new Error("hex string expected, got " + typeof hex5);
  const len = hex5.length;
  if (len % 2)
    throw new Error("padded hex string expected, got unpadded hex of length " + len);
  const array = new Uint8Array(len / 2);
  for (let i2 = 0; i2 < array.length; i2++) {
    const j = i2 * 2;
    const hexByte = hex5.slice(j, j + 2);
    const byte = Number.parseInt(hexByte, 16);
    if (Number.isNaN(byte) || byte < 0)
      throw new Error("Invalid byte sequence");
    array[i2] = byte;
  }
  return array;
}
function bytesToNumberBE2(bytes8) {
  return hexToNumber2(bytesToHex4(bytes8));
}
function bytesToNumberLE2(bytes8) {
  if (!u8a7(bytes8))
    throw new Error("Uint8Array expected");
  return hexToNumber2(bytesToHex4(Uint8Array.from(bytes8).reverse()));
}
function numberToBytesBE2(n, len) {
  return hexToBytes4(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE2(n, len) {
  return numberToBytesBE2(n, len).reverse();
}
function numberToVarBytesBE2(n) {
  return hexToBytes4(numberToHexUnpadded2(n));
}
function ensureBytes3(title, hex5, expectedLength) {
  let res;
  if (typeof hex5 === "string") {
    try {
      res = hexToBytes4(hex5);
    } catch (e) {
      throw new Error(`${title} must be valid hex string, got "${hex5}". Cause: ${e}`);
    }
  } else if (u8a7(hex5)) {
    res = Uint8Array.from(hex5);
  } else {
    throw new Error(`${title} must be hex string or Uint8Array`);
  }
  const len = res.length;
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(`${title} expected ${expectedLength} bytes, got ${len}`);
  return res;
}
function concatBytes6(...arrays) {
  const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
  let pad2 = 0;
  arrays.forEach((a) => {
    if (!u8a7(a))
      throw new Error("Uint8Array expected");
    r.set(a, pad2);
    pad2 += a.length;
  });
  return r;
}
function equalBytes3(b1, b2) {
  if (b1.length !== b2.length)
    return false;
  for (let i2 = 0; i2 < b1.length; i2++)
    if (b1[i2] !== b2[i2])
      return false;
  return true;
}
function utf8ToBytes7(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function bitLen2(n) {
  let len;
  for (len = 0; n > _0n6; n >>= _1n6, len += 1)
    ;
  return len;
}
function bitGet2(n, pos) {
  return n >> BigInt(pos) & _1n6;
}
var bitSet2 = (n, pos, value) => {
  return n | (value ? _1n6 : _0n6) << BigInt(pos);
};
var bitMask2 = (n) => (_2n5 << BigInt(n - 1)) - _1n6;
var u8n2 = (data) => new Uint8Array(data);
var u8fr2 = (arr) => Uint8Array.from(arr);
function createHmacDrbg2(hashLen, qByteLen, hmacFn) {
  if (typeof hashLen !== "number" || hashLen < 2)
    throw new Error("hashLen must be a number");
  if (typeof qByteLen !== "number" || qByteLen < 2)
    throw new Error("qByteLen must be a number");
  if (typeof hmacFn !== "function")
    throw new Error("hmacFn must be a function");
  let v = u8n2(hashLen);
  let k = u8n2(hashLen);
  let i2 = 0;
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i2 = 0;
  };
  const h = (...b) => hmacFn(k, v, ...b);
  const reseed = (seed = u8n2()) => {
    k = h(u8fr2([0]), seed);
    v = h();
    if (seed.length === 0)
      return;
    k = h(u8fr2([1]), seed);
    v = h();
  };
  const gen = () => {
    if (i2++ >= 1e3)
      throw new Error("drbg: tried 1000 values");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes6(...out);
  };
  const genUntil = (seed, pred) => {
    reset();
    reseed(seed);
    let res = void 0;
    while (!(res = pred(gen())))
      reseed();
    reset();
    return res;
  };
  return genUntil;
}
var validatorFns2 = {
  bigint: (val) => typeof val === "bigint",
  function: (val) => typeof val === "function",
  boolean: (val) => typeof val === "boolean",
  string: (val) => typeof val === "string",
  stringOrUint8Array: (val) => typeof val === "string" || val instanceof Uint8Array,
  isSafeInteger: (val) => Number.isSafeInteger(val),
  array: (val) => Array.isArray(val),
  field: (val, object) => object.Fp.isValid(val),
  hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
};
function validateObject2(object, validators, optValidators = {}) {
  const checkField = (fieldName, type2, isOptional) => {
    const checkVal = validatorFns2[type2];
    if (typeof checkVal !== "function")
      throw new Error(`Invalid validator "${type2}", expected function`);
    const val = object[fieldName];
    if (isOptional && val === void 0)
      return;
    if (!checkVal(val, object)) {
      throw new Error(`Invalid param ${String(fieldName)}=${val} (${typeof val}), expected ${type2}`);
    }
  };
  for (const [fieldName, type2] of Object.entries(validators))
    checkField(fieldName, type2, false);
  for (const [fieldName, type2] of Object.entries(optValidators))
    checkField(fieldName, type2, true);
  return object;
}

// node_modules/nostr-tools/node_modules/@noble/curves/esm/abstract/modular.js
var _0n7 = BigInt(0);
var _1n7 = BigInt(1);
var _2n6 = BigInt(2);
var _3n3 = BigInt(3);
var _4n3 = BigInt(4);
var _5n2 = BigInt(5);
var _8n2 = BigInt(8);
var _9n2 = BigInt(9);
var _16n2 = BigInt(16);
function mod2(a, b) {
  const result = a % b;
  return result >= _0n7 ? result : b + result;
}
function pow3(num, power, modulo) {
  if (modulo <= _0n7 || power < _0n7)
    throw new Error("Expected power/modulo > 0");
  if (modulo === _1n7)
    return _0n7;
  let res = _1n7;
  while (power > _0n7) {
    if (power & _1n7)
      res = res * num % modulo;
    num = num * num % modulo;
    power >>= _1n7;
  }
  return res;
}
function pow22(x, power, modulo) {
  let res = x;
  while (power-- > _0n7) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert2(number8, modulo) {
  if (number8 === _0n7 || modulo <= _0n7) {
    throw new Error(`invert: expected positive integers, got n=${number8} mod=${modulo}`);
  }
  let a = mod2(number8, modulo);
  let b = modulo;
  let x = _0n7, y = _1n7, u2 = _1n7, v = _0n7;
  while (a !== _0n7) {
    const q = b / a;
    const r = b % a;
    const m = x - u2 * q;
    const n = y - v * q;
    b = a, a = r, x = u2, y = v, u2 = m, v = n;
  }
  const gcd5 = b;
  if (gcd5 !== _1n7)
    throw new Error("invert: does not exist");
  return mod2(x, modulo);
}
function tonelliShanks2(P) {
  const legendreC = (P - _1n7) / _2n6;
  let Q, S, Z;
  for (Q = P - _1n7, S = 0; Q % _2n6 === _0n7; Q /= _2n6, S++)
    ;
  for (Z = _2n6; Z < P && pow3(Z, legendreC, P) !== P - _1n7; Z++)
    ;
  if (S === 1) {
    const p1div4 = (P + _1n7) / _4n3;
    return function tonelliFast(Fp3, n) {
      const root = Fp3.pow(n, p1div4);
      if (!Fp3.eql(Fp3.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  const Q1div2 = (Q + _1n7) / _2n6;
  return function tonelliSlow(Fp3, n) {
    if (Fp3.pow(n, legendreC) === Fp3.neg(Fp3.ONE))
      throw new Error("Cannot find square root");
    let r = S;
    let g = Fp3.pow(Fp3.mul(Fp3.ONE, Z), Q);
    let x = Fp3.pow(n, Q1div2);
    let b = Fp3.pow(n, Q);
    while (!Fp3.eql(b, Fp3.ONE)) {
      if (Fp3.eql(b, Fp3.ZERO))
        return Fp3.ZERO;
      let m = 1;
      for (let t2 = Fp3.sqr(b); m < r; m++) {
        if (Fp3.eql(t2, Fp3.ONE))
          break;
        t2 = Fp3.sqr(t2);
      }
      const ge3 = Fp3.pow(g, _1n7 << BigInt(r - m - 1));
      g = Fp3.sqr(ge3);
      x = Fp3.mul(x, ge3);
      b = Fp3.mul(b, g);
      r = m;
    }
    return x;
  };
}
function FpSqrt2(P) {
  if (P % _4n3 === _3n3) {
    const p1div4 = (P + _1n7) / _4n3;
    return function sqrt3mod4(Fp3, n) {
      const root = Fp3.pow(n, p1div4);
      if (!Fp3.eql(Fp3.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  if (P % _8n2 === _5n2) {
    const c1 = (P - _5n2) / _8n2;
    return function sqrt5mod8(Fp3, n) {
      const n2 = Fp3.mul(n, _2n6);
      const v = Fp3.pow(n2, c1);
      const nv = Fp3.mul(n, v);
      const i2 = Fp3.mul(Fp3.mul(nv, _2n6), v);
      const root = Fp3.mul(nv, Fp3.sub(i2, Fp3.ONE));
      if (!Fp3.eql(Fp3.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  if (P % _16n2 === _9n2) {
  }
  return tonelliShanks2(P);
}
var FIELD_FIELDS2 = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function validateField2(field) {
  const initial = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "isSafeInteger",
    BITS: "isSafeInteger"
  };
  const opts = FIELD_FIELDS2.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  return validateObject2(field, opts);
}
function FpPow2(f2, num, power) {
  if (power < _0n7)
    throw new Error("Expected power > 0");
  if (power === _0n7)
    return f2.ONE;
  if (power === _1n7)
    return num;
  let p = f2.ONE;
  let d = num;
  while (power > _0n7) {
    if (power & _1n7)
      p = f2.mul(p, d);
    d = f2.sqr(d);
    power >>= _1n7;
  }
  return p;
}
function FpInvertBatch2(f2, nums) {
  const tmp = new Array(nums.length);
  const lastMultiplied = nums.reduce((acc, num, i2) => {
    if (f2.is0(num))
      return acc;
    tmp[i2] = acc;
    return f2.mul(acc, num);
  }, f2.ONE);
  const inverted = f2.inv(lastMultiplied);
  nums.reduceRight((acc, num, i2) => {
    if (f2.is0(num))
      return acc;
    tmp[i2] = f2.mul(acc, tmp[i2]);
    return f2.mul(acc, num);
  }, inverted);
  return tmp;
}
function nLength2(n, nBitLength) {
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
function Field2(ORDER, bitLen3, isLE8 = false, redef = {}) {
  if (ORDER <= _0n7)
    throw new Error(`Expected Field ORDER > 0, got ${ORDER}`);
  const { nBitLength: BITS, nByteLength: BYTES } = nLength2(ORDER, bitLen3);
  if (BYTES > 2048)
    throw new Error("Field lengths over 2048 bytes are not supported");
  const sqrtP = FpSqrt2(ORDER);
  const f2 = Object.freeze({
    ORDER,
    BITS,
    BYTES,
    MASK: bitMask2(BITS),
    ZERO: _0n7,
    ONE: _1n7,
    create: (num) => mod2(num, ORDER),
    isValid: (num) => {
      if (typeof num !== "bigint")
        throw new Error(`Invalid field element: expected bigint, got ${typeof num}`);
      return _0n7 <= num && num < ORDER;
    },
    is0: (num) => num === _0n7,
    isOdd: (num) => (num & _1n7) === _1n7,
    neg: (num) => mod2(-num, ORDER),
    eql: (lhs, rhs) => lhs === rhs,
    sqr: (num) => mod2(num * num, ORDER),
    add: (lhs, rhs) => mod2(lhs + rhs, ORDER),
    sub: (lhs, rhs) => mod2(lhs - rhs, ORDER),
    mul: (lhs, rhs) => mod2(lhs * rhs, ORDER),
    pow: (num, power) => FpPow2(f2, num, power),
    div: (lhs, rhs) => mod2(lhs * invert2(rhs, ORDER), ORDER),
    // Same as above, but doesn't normalize
    sqrN: (num) => num * num,
    addN: (lhs, rhs) => lhs + rhs,
    subN: (lhs, rhs) => lhs - rhs,
    mulN: (lhs, rhs) => lhs * rhs,
    inv: (num) => invert2(num, ORDER),
    sqrt: redef.sqrt || ((n) => sqrtP(f2, n)),
    invertBatch: (lst) => FpInvertBatch2(f2, lst),
    // TODO: do we really need constant cmov?
    // We don't have const-time bigints anyway, so probably will be not very useful
    cmov: (a, b, c) => c ? b : a,
    toBytes: (num) => isLE8 ? numberToBytesLE2(num, BYTES) : numberToBytesBE2(num, BYTES),
    fromBytes: (bytes8) => {
      if (bytes8.length !== BYTES)
        throw new Error(`Fp.fromBytes: expected ${BYTES}, got ${bytes8.length}`);
      return isLE8 ? bytesToNumberLE2(bytes8) : bytesToNumberBE2(bytes8);
    }
  });
  return Object.freeze(f2);
}
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint")
    throw new Error("field order must be bigint");
  const bitLength = fieldOrder.toString(2).length;
  return Math.ceil(bitLength / 8);
}
function getMinHashLength(fieldOrder) {
  const length = getFieldBytesLength(fieldOrder);
  return length + Math.ceil(length / 2);
}
function mapHashToField(key, fieldOrder, isLE8 = false) {
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  if (len < 16 || len < minLen || len > 1024)
    throw new Error(`expected ${minLen}-1024 bytes of input, got ${len}`);
  const num = isLE8 ? bytesToNumberBE2(key) : bytesToNumberLE2(key);
  const reduced = mod2(num, fieldOrder - _1n7) + _1n7;
  return isLE8 ? numberToBytesLE2(reduced, fieldLen) : numberToBytesBE2(reduced, fieldLen);
}

// node_modules/nostr-tools/node_modules/@noble/curves/esm/abstract/curve.js
var _0n8 = BigInt(0);
var _1n8 = BigInt(1);
function wNAF2(c, bits) {
  const constTimeNegate = (condition, item) => {
    const neg = item.negate();
    return condition ? neg : item;
  };
  const opts = (W) => {
    const windows = Math.ceil(bits / W) + 1;
    const windowSize = 2 ** (W - 1);
    return { windows, windowSize };
  };
  return {
    constTimeNegate,
    // non-const time multiplication ladder
    unsafeLadder(elm, n) {
      let p = c.ZERO;
      let d = elm;
      while (n > _0n8) {
        if (n & _1n8)
          p = p.add(d);
        d = d.double();
        n >>= _1n8;
      }
      return p;
    },
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(elm, W) {
      const { windows, windowSize } = opts(W);
      const points = [];
      let p = elm;
      let base = p;
      for (let window2 = 0; window2 < windows; window2++) {
        base = p;
        points.push(base);
        for (let i2 = 1; i2 < windowSize; i2++) {
          base = base.add(p);
          points.push(base);
        }
        p = base.double();
      }
      return points;
    },
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @returns real and fake (for const-time) points
     */
    wNAF(W, precomputes, n) {
      const { windows, windowSize } = opts(W);
      let p = c.ZERO;
      let f2 = c.BASE;
      const mask = BigInt(2 ** W - 1);
      const maxNumber = 2 ** W;
      const shiftBy = BigInt(W);
      for (let window2 = 0; window2 < windows; window2++) {
        const offset = window2 * windowSize;
        let wbits = Number(n & mask);
        n >>= shiftBy;
        if (wbits > windowSize) {
          wbits -= maxNumber;
          n += _1n8;
        }
        const offset1 = offset;
        const offset2 = offset + Math.abs(wbits) - 1;
        const cond1 = window2 % 2 !== 0;
        const cond2 = wbits < 0;
        if (wbits === 0) {
          f2 = f2.add(constTimeNegate(cond1, precomputes[offset1]));
        } else {
          p = p.add(constTimeNegate(cond2, precomputes[offset2]));
        }
      }
      return { p, f: f2 };
    },
    wNAFCached(P, precomputesMap, n, transform) {
      const W = P._WINDOW_SIZE || 1;
      let comp = precomputesMap.get(P);
      if (!comp) {
        comp = this.precomputeWindow(P, W);
        if (W !== 1) {
          precomputesMap.set(P, transform(comp));
        }
      }
      return this.wNAF(W, comp, n);
    }
  };
}
function validateBasic2(curve) {
  validateField2(curve.Fp);
  validateObject2(curve, {
    n: "bigint",
    h: "bigint",
    Gx: "field",
    Gy: "field"
  }, {
    nBitLength: "isSafeInteger",
    nByteLength: "isSafeInteger"
  });
  return Object.freeze({
    ...nLength2(curve.n, curve.nBitLength),
    ...curve,
    ...{ p: curve.Fp.ORDER }
  });
}

// node_modules/nostr-tools/node_modules/@noble/curves/esm/abstract/weierstrass.js
function validatePointOpts2(curve) {
  const opts = validateBasic2(curve);
  validateObject2(opts, {
    a: "field",
    b: "field"
  }, {
    allowedPrivateKeyLengths: "array",
    wrapPrivateKey: "boolean",
    isTorsionFree: "function",
    clearCofactor: "function",
    allowInfinityPoint: "boolean",
    fromBytes: "function",
    toBytes: "function"
  });
  const { endo, Fp: Fp3, a } = opts;
  if (endo) {
    if (!Fp3.eql(a, Fp3.ZERO)) {
      throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");
    }
    if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
      throw new Error("Expected endomorphism with beta: bigint and splitScalar: function");
    }
  }
  return Object.freeze({ ...opts });
}
var { bytesToNumberBE: b2n2, hexToBytes: h2b2 } = utils_exports3;
var DER2 = {
  // asn.1 DER encoding utils
  Err: class DERErr2 extends Error {
    constructor(m = "") {
      super(m);
    }
  },
  _parseInt(data) {
    const { Err: E } = DER2;
    if (data.length < 2 || data[0] !== 2)
      throw new E("Invalid signature integer tag");
    const len = data[1];
    const res = data.subarray(2, len + 2);
    if (!len || res.length !== len)
      throw new E("Invalid signature integer: wrong length");
    if (res[0] & 128)
      throw new E("Invalid signature integer: negative");
    if (res[0] === 0 && !(res[1] & 128))
      throw new E("Invalid signature integer: unnecessary leading zero");
    return { d: b2n2(res), l: data.subarray(len + 2) };
  },
  toSig(hex5) {
    const { Err: E } = DER2;
    const data = typeof hex5 === "string" ? h2b2(hex5) : hex5;
    if (!(data instanceof Uint8Array))
      throw new Error("ui8a expected");
    let l = data.length;
    if (l < 2 || data[0] != 48)
      throw new E("Invalid signature tag");
    if (data[1] !== l - 2)
      throw new E("Invalid signature: incorrect length");
    const { d: r, l: sBytes } = DER2._parseInt(data.subarray(2));
    const { d: s, l: rBytesLeft } = DER2._parseInt(sBytes);
    if (rBytesLeft.length)
      throw new E("Invalid signature: left bytes after parsing");
    return { r, s };
  },
  hexFromSig(sig) {
    const slice2 = (s2) => Number.parseInt(s2[0], 16) & 8 ? "00" + s2 : s2;
    const h = (num) => {
      const hex5 = num.toString(16);
      return hex5.length & 1 ? `0${hex5}` : hex5;
    };
    const s = slice2(h(sig.s));
    const r = slice2(h(sig.r));
    const shl = s.length / 2;
    const rhl = r.length / 2;
    const sl = h(shl);
    const rl = h(rhl);
    return `30${h(rhl + shl + 4)}02${rl}${r}02${sl}${s}`;
  }
};
var _0n9 = BigInt(0);
var _1n9 = BigInt(1);
var _2n7 = BigInt(2);
var _3n4 = BigInt(3);
var _4n4 = BigInt(4);
function weierstrassPoints2(opts) {
  const CURVE = validatePointOpts2(opts);
  const { Fp: Fp3 } = CURVE;
  const toBytes8 = CURVE.toBytes || ((_c, point, _isCompressed) => {
    const a = point.toAffine();
    return concatBytes6(Uint8Array.from([4]), Fp3.toBytes(a.x), Fp3.toBytes(a.y));
  });
  const fromBytes = CURVE.fromBytes || ((bytes8) => {
    const tail = bytes8.subarray(1);
    const x = Fp3.fromBytes(tail.subarray(0, Fp3.BYTES));
    const y = Fp3.fromBytes(tail.subarray(Fp3.BYTES, 2 * Fp3.BYTES));
    return { x, y };
  });
  function weierstrassEquation(x) {
    const { a, b } = CURVE;
    const x2 = Fp3.sqr(x);
    const x3 = Fp3.mul(x2, x);
    return Fp3.add(Fp3.add(x3, Fp3.mul(x, a)), b);
  }
  if (!Fp3.eql(Fp3.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx)))
    throw new Error("bad generator point: equation left != right");
  function isWithinCurveOrder(num) {
    return typeof num === "bigint" && _0n9 < num && num < CURVE.n;
  }
  function assertGE(num) {
    if (!isWithinCurveOrder(num))
      throw new Error("Expected valid bigint: 0 < bigint < curve.n");
  }
  function normPrivateKeyToScalar(key) {
    const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n } = CURVE;
    if (lengths && typeof key !== "bigint") {
      if (key instanceof Uint8Array)
        key = bytesToHex4(key);
      if (typeof key !== "string" || !lengths.includes(key.length))
        throw new Error("Invalid key");
      key = key.padStart(nByteLength * 2, "0");
    }
    let num;
    try {
      num = typeof key === "bigint" ? key : bytesToNumberBE2(ensureBytes3("private key", key, nByteLength));
    } catch (error) {
      throw new Error(`private key must be ${nByteLength} bytes, hex or bigint, not ${typeof key}`);
    }
    if (wrapPrivateKey)
      num = mod2(num, n);
    assertGE(num);
    return num;
  }
  const pointPrecomputes = /* @__PURE__ */ new Map();
  function assertPrjPoint(other) {
    if (!(other instanceof Point4))
      throw new Error("ProjectivePoint expected");
  }
  class Point4 {
    constructor(px, py, pz) {
      this.px = px;
      this.py = py;
      this.pz = pz;
      if (px == null || !Fp3.isValid(px))
        throw new Error("x required");
      if (py == null || !Fp3.isValid(py))
        throw new Error("y required");
      if (pz == null || !Fp3.isValid(pz))
        throw new Error("z required");
    }
    // Does not validate if the point is on-curve.
    // Use fromHex instead, or call assertValidity() later.
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp3.isValid(x) || !Fp3.isValid(y))
        throw new Error("invalid affine point");
      if (p instanceof Point4)
        throw new Error("projective point not allowed");
      const is0 = (i2) => Fp3.eql(i2, Fp3.ZERO);
      if (is0(x) && is0(y))
        return Point4.ZERO;
      return new Point4(x, y, Fp3.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     * Takes a bunch of Projective Points but executes only one
     * inversion on all of them. Inversion is very slow operation,
     * so this improves performance massively.
     * Optimization: converts a list of projective points to a list of identical points with Z=1.
     */
    static normalizeZ(points) {
      const toInv = Fp3.invertBatch(points.map((p) => p.pz));
      return points.map((p, i2) => p.toAffine(toInv[i2])).map(Point4.fromAffine);
    }
    /**
     * Converts hash string or Uint8Array to Point.
     * @param hex short/long ECDSA hex
     */
    static fromHex(hex5) {
      const P = Point4.fromAffine(fromBytes(ensureBytes3("pointHex", hex5)));
      P.assertValidity();
      return P;
    }
    // Multiplies generator point by privateKey.
    static fromPrivateKey(privateKey) {
      return Point4.BASE.multiply(normPrivateKeyToScalar(privateKey));
    }
    // "Private method", don't use it directly
    _setWindowSize(windowSize) {
      this._WINDOW_SIZE = windowSize;
      pointPrecomputes.delete(this);
    }
    // A point on curve is valid if it conforms to equation.
    assertValidity() {
      if (this.is0()) {
        if (CURVE.allowInfinityPoint && !Fp3.is0(this.py))
          return;
        throw new Error("bad point: ZERO");
      }
      const { x, y } = this.toAffine();
      if (!Fp3.isValid(x) || !Fp3.isValid(y))
        throw new Error("bad point: x or y not FE");
      const left = Fp3.sqr(y);
      const right = weierstrassEquation(x);
      if (!Fp3.eql(left, right))
        throw new Error("bad point: equation left != right");
      if (!this.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (Fp3.isOdd)
        return !Fp3.isOdd(y);
      throw new Error("Field doesn't support isOdd");
    }
    /**
     * Compare one point to another.
     */
    equals(other) {
      assertPrjPoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      const U1 = Fp3.eql(Fp3.mul(X1, Z2), Fp3.mul(X2, Z1));
      const U2 = Fp3.eql(Fp3.mul(Y1, Z2), Fp3.mul(Y2, Z1));
      return U1 && U2;
    }
    /**
     * Flips point to one corresponding to (x, -y) in Affine coordinates.
     */
    negate() {
      return new Point4(this.px, Fp3.neg(this.py), this.pz);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a, b } = CURVE;
      const b3 = Fp3.mul(b, _3n4);
      const { px: X1, py: Y1, pz: Z1 } = this;
      let X3 = Fp3.ZERO, Y3 = Fp3.ZERO, Z3 = Fp3.ZERO;
      let t0 = Fp3.mul(X1, X1);
      let t1 = Fp3.mul(Y1, Y1);
      let t2 = Fp3.mul(Z1, Z1);
      let t3 = Fp3.mul(X1, Y1);
      t3 = Fp3.add(t3, t3);
      Z3 = Fp3.mul(X1, Z1);
      Z3 = Fp3.add(Z3, Z3);
      X3 = Fp3.mul(a, Z3);
      Y3 = Fp3.mul(b3, t2);
      Y3 = Fp3.add(X3, Y3);
      X3 = Fp3.sub(t1, Y3);
      Y3 = Fp3.add(t1, Y3);
      Y3 = Fp3.mul(X3, Y3);
      X3 = Fp3.mul(t3, X3);
      Z3 = Fp3.mul(b3, Z3);
      t2 = Fp3.mul(a, t2);
      t3 = Fp3.sub(t0, t2);
      t3 = Fp3.mul(a, t3);
      t3 = Fp3.add(t3, Z3);
      Z3 = Fp3.add(t0, t0);
      t0 = Fp3.add(Z3, t0);
      t0 = Fp3.add(t0, t2);
      t0 = Fp3.mul(t0, t3);
      Y3 = Fp3.add(Y3, t0);
      t2 = Fp3.mul(Y1, Z1);
      t2 = Fp3.add(t2, t2);
      t0 = Fp3.mul(t2, t3);
      X3 = Fp3.sub(X3, t0);
      Z3 = Fp3.mul(t2, t1);
      Z3 = Fp3.add(Z3, Z3);
      Z3 = Fp3.add(Z3, Z3);
      return new Point4(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      assertPrjPoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      let X3 = Fp3.ZERO, Y3 = Fp3.ZERO, Z3 = Fp3.ZERO;
      const a = CURVE.a;
      const b3 = Fp3.mul(CURVE.b, _3n4);
      let t0 = Fp3.mul(X1, X2);
      let t1 = Fp3.mul(Y1, Y2);
      let t2 = Fp3.mul(Z1, Z2);
      let t3 = Fp3.add(X1, Y1);
      let t4 = Fp3.add(X2, Y2);
      t3 = Fp3.mul(t3, t4);
      t4 = Fp3.add(t0, t1);
      t3 = Fp3.sub(t3, t4);
      t4 = Fp3.add(X1, Z1);
      let t5 = Fp3.add(X2, Z2);
      t4 = Fp3.mul(t4, t5);
      t5 = Fp3.add(t0, t2);
      t4 = Fp3.sub(t4, t5);
      t5 = Fp3.add(Y1, Z1);
      X3 = Fp3.add(Y2, Z2);
      t5 = Fp3.mul(t5, X3);
      X3 = Fp3.add(t1, t2);
      t5 = Fp3.sub(t5, X3);
      Z3 = Fp3.mul(a, t4);
      X3 = Fp3.mul(b3, t2);
      Z3 = Fp3.add(X3, Z3);
      X3 = Fp3.sub(t1, Z3);
      Z3 = Fp3.add(t1, Z3);
      Y3 = Fp3.mul(X3, Z3);
      t1 = Fp3.add(t0, t0);
      t1 = Fp3.add(t1, t0);
      t2 = Fp3.mul(a, t2);
      t4 = Fp3.mul(b3, t4);
      t1 = Fp3.add(t1, t2);
      t2 = Fp3.sub(t0, t2);
      t2 = Fp3.mul(a, t2);
      t4 = Fp3.add(t4, t2);
      t0 = Fp3.mul(t1, t4);
      Y3 = Fp3.add(Y3, t0);
      t0 = Fp3.mul(t5, t4);
      X3 = Fp3.mul(t3, X3);
      X3 = Fp3.sub(X3, t0);
      t0 = Fp3.mul(t3, t1);
      Z3 = Fp3.mul(t5, Z3);
      Z3 = Fp3.add(Z3, t0);
      return new Point4(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point4.ZERO);
    }
    wNAF(n) {
      return wnaf.wNAFCached(this, pointPrecomputes, n, (comp) => {
        const toInv = Fp3.invertBatch(comp.map((p) => p.pz));
        return comp.map((p, i2) => p.toAffine(toInv[i2])).map(Point4.fromAffine);
      });
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed private key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(n) {
      const I = Point4.ZERO;
      if (n === _0n9)
        return I;
      assertGE(n);
      if (n === _1n9)
        return this;
      const { endo } = CURVE;
      if (!endo)
        return wnaf.unsafeLadder(this, n);
      let { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
      let k1p = I;
      let k2p = I;
      let d = this;
      while (k1 > _0n9 || k2 > _0n9) {
        if (k1 & _1n9)
          k1p = k1p.add(d);
        if (k2 & _1n9)
          k2p = k2p.add(d);
        d = d.double();
        k1 >>= _1n9;
        k2 >>= _1n9;
      }
      if (k1neg)
        k1p = k1p.negate();
      if (k2neg)
        k2p = k2p.negate();
      k2p = new Point4(Fp3.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
      return k1p.add(k2p);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      assertGE(scalar);
      let n = scalar;
      let point, fake;
      const { endo } = CURVE;
      if (endo) {
        const { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
        let { p: k1p, f: f1p } = this.wNAF(k1);
        let { p: k2p, f: f2p } = this.wNAF(k2);
        k1p = wnaf.constTimeNegate(k1neg, k1p);
        k2p = wnaf.constTimeNegate(k2neg, k2p);
        k2p = new Point4(Fp3.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
        point = k1p.add(k2p);
        fake = f1p.add(f2p);
      } else {
        const { p, f: f2 } = this.wNAF(n);
        point = p;
        fake = f2;
      }
      return Point4.normalizeZ([point, fake])[0];
    }
    /**
     * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
     * Not using Strauss-Shamir trick: precomputation tables are faster.
     * The trick could be useful if both P and Q are not G (not in our case).
     * @returns non-zero affine point
     */
    multiplyAndAddUnsafe(Q, a, b) {
      const G = Point4.BASE;
      const mul = (P, a2) => a2 === _0n9 || a2 === _1n9 || !P.equals(G) ? P.multiplyUnsafe(a2) : P.multiply(a2);
      const sum = mul(this, a).add(mul(Q, b));
      return sum.is0() ? void 0 : sum;
    }
    // Converts Projective point to affine (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    // (x, y, z) ∋ (x=x/z, y=y/z)
    toAffine(iz) {
      const { px: x, py: y, pz: z } = this;
      const is0 = this.is0();
      if (iz == null)
        iz = is0 ? Fp3.ONE : Fp3.inv(z);
      const ax = Fp3.mul(x, iz);
      const ay = Fp3.mul(y, iz);
      const zz = Fp3.mul(z, iz);
      if (is0)
        return { x: Fp3.ZERO, y: Fp3.ZERO };
      if (!Fp3.eql(zz, Fp3.ONE))
        throw new Error("invZ was invalid");
      return { x: ax, y: ay };
    }
    isTorsionFree() {
      const { h: cofactor, isTorsionFree } = CURVE;
      if (cofactor === _1n9)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point4, this);
      throw new Error("isTorsionFree() has not been declared for the elliptic curve");
    }
    clearCofactor() {
      const { h: cofactor, clearCofactor } = CURVE;
      if (cofactor === _1n9)
        return this;
      if (clearCofactor)
        return clearCofactor(Point4, this);
      return this.multiplyUnsafe(CURVE.h);
    }
    toRawBytes(isCompressed = true) {
      this.assertValidity();
      return toBytes8(Point4, this, isCompressed);
    }
    toHex(isCompressed = true) {
      return bytesToHex4(this.toRawBytes(isCompressed));
    }
  }
  Point4.BASE = new Point4(CURVE.Gx, CURVE.Gy, Fp3.ONE);
  Point4.ZERO = new Point4(Fp3.ZERO, Fp3.ONE, Fp3.ZERO);
  const _bits = CURVE.nBitLength;
  const wnaf = wNAF2(Point4, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
  return {
    CURVE,
    ProjectivePoint: Point4,
    normPrivateKeyToScalar,
    weierstrassEquation,
    isWithinCurveOrder
  };
}
function validateOpts2(curve) {
  const opts = validateBasic2(curve);
  validateObject2(opts, {
    hash: "hash",
    hmac: "function",
    randomBytes: "function"
  }, {
    bits2int: "function",
    bits2int_modN: "function",
    lowS: "boolean"
  });
  return Object.freeze({ lowS: true, ...opts });
}
function weierstrass2(curveDef) {
  const CURVE = validateOpts2(curveDef);
  const { Fp: Fp3, n: CURVE_ORDER } = CURVE;
  const compressedLen = Fp3.BYTES + 1;
  const uncompressedLen = 2 * Fp3.BYTES + 1;
  function isValidFieldElement(num) {
    return _0n9 < num && num < Fp3.ORDER;
  }
  function modN3(a) {
    return mod2(a, CURVE_ORDER);
  }
  function invN(a) {
    return invert2(a, CURVE_ORDER);
  }
  const { ProjectivePoint: Point4, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints2({
    ...CURVE,
    toBytes(_c, point, isCompressed) {
      const a = point.toAffine();
      const x = Fp3.toBytes(a.x);
      const cat = concatBytes6;
      if (isCompressed) {
        return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
      } else {
        return cat(Uint8Array.from([4]), x, Fp3.toBytes(a.y));
      }
    },
    fromBytes(bytes8) {
      const len = bytes8.length;
      const head = bytes8[0];
      const tail = bytes8.subarray(1);
      if (len === compressedLen && (head === 2 || head === 3)) {
        const x = bytesToNumberBE2(tail);
        if (!isValidFieldElement(x))
          throw new Error("Point is not on curve");
        const y2 = weierstrassEquation(x);
        let y = Fp3.sqrt(y2);
        const isYOdd = (y & _1n9) === _1n9;
        const isHeadOdd = (head & 1) === 1;
        if (isHeadOdd !== isYOdd)
          y = Fp3.neg(y);
        return { x, y };
      } else if (len === uncompressedLen && head === 4) {
        const x = Fp3.fromBytes(tail.subarray(0, Fp3.BYTES));
        const y = Fp3.fromBytes(tail.subarray(Fp3.BYTES, 2 * Fp3.BYTES));
        return { x, y };
      } else {
        throw new Error(`Point of length ${len} was invalid. Expected ${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes`);
      }
    }
  });
  const numToNByteStr = (num) => bytesToHex4(numberToBytesBE2(num, CURVE.nByteLength));
  function isBiggerThanHalfOrder(number8) {
    const HALF = CURVE_ORDER >> _1n9;
    return number8 > HALF;
  }
  function normalizeS(s) {
    return isBiggerThanHalfOrder(s) ? modN3(-s) : s;
  }
  const slcNum = (b, from, to) => bytesToNumberBE2(b.slice(from, to));
  class Signature {
    constructor(r, s, recovery) {
      this.r = r;
      this.s = s;
      this.recovery = recovery;
      this.assertValidity();
    }
    // pair (bytes of r, bytes of s)
    static fromCompact(hex5) {
      const l = CURVE.nByteLength;
      hex5 = ensureBytes3("compactSignature", hex5, l * 2);
      return new Signature(slcNum(hex5, 0, l), slcNum(hex5, l, 2 * l));
    }
    // DER encoded ECDSA signature
    // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
    static fromDER(hex5) {
      const { r, s } = DER2.toSig(ensureBytes3("DER", hex5));
      return new Signature(r, s);
    }
    assertValidity() {
      if (!isWithinCurveOrder(this.r))
        throw new Error("r must be 0 < r < CURVE.n");
      if (!isWithinCurveOrder(this.s))
        throw new Error("s must be 0 < s < CURVE.n");
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    recoverPublicKey(msgHash) {
      const { r, s, recovery: rec } = this;
      const h = bits2int_modN(ensureBytes3("msgHash", msgHash));
      if (rec == null || ![0, 1, 2, 3].includes(rec))
        throw new Error("recovery id invalid");
      const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
      if (radj >= Fp3.ORDER)
        throw new Error("recovery id 2 or 3 invalid");
      const prefix = (rec & 1) === 0 ? "02" : "03";
      const R = Point4.fromHex(prefix + numToNByteStr(radj));
      const ir = invN(radj);
      const u1 = modN3(-h * ir);
      const u2 = modN3(s * ir);
      const Q = Point4.BASE.multiplyAndAddUnsafe(R, u1, u2);
      if (!Q)
        throw new Error("point at infinify");
      Q.assertValidity();
      return Q;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new Signature(this.r, modN3(-this.s), this.recovery) : this;
    }
    // DER-encoded
    toDERRawBytes() {
      return hexToBytes4(this.toDERHex());
    }
    toDERHex() {
      return DER2.hexFromSig({ r: this.r, s: this.s });
    }
    // padded bytes of r, then padded bytes of s
    toCompactRawBytes() {
      return hexToBytes4(this.toCompactHex());
    }
    toCompactHex() {
      return numToNByteStr(this.r) + numToNByteStr(this.s);
    }
  }
  const utils4 = {
    isValidPrivateKey(privateKey) {
      try {
        normPrivateKeyToScalar(privateKey);
        return true;
      } catch (error) {
        return false;
      }
    },
    normPrivateKeyToScalar,
    /**
     * Produces cryptographically secure private key from random of size
     * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
     */
    randomPrivateKey: () => {
      const length = getMinHashLength(CURVE.n);
      return mapHashToField(CURVE.randomBytes(length), CURVE.n);
    },
    /**
     * Creates precompute table for an arbitrary EC point. Makes point "cached".
     * Allows to massively speed-up `point.multiply(scalar)`.
     * @returns cached point
     * @example
     * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
     * fast.multiply(privKey); // much faster ECDH now
     */
    precompute(windowSize = 8, point = Point4.BASE) {
      point._setWindowSize(windowSize);
      point.multiply(BigInt(3));
      return point;
    }
  };
  function getPublicKey4(privateKey, isCompressed = true) {
    return Point4.fromPrivateKey(privateKey).toRawBytes(isCompressed);
  }
  function isProbPub(item) {
    const arr = item instanceof Uint8Array;
    const str = typeof item === "string";
    const len = (arr || str) && item.length;
    if (arr)
      return len === compressedLen || len === uncompressedLen;
    if (str)
      return len === 2 * compressedLen || len === 2 * uncompressedLen;
    if (item instanceof Point4)
      return true;
    return false;
  }
  function getSharedSecret(privateA, publicB, isCompressed = true) {
    if (isProbPub(privateA))
      throw new Error("first arg must be private key");
    if (!isProbPub(publicB))
      throw new Error("second arg must be public key");
    const b = Point4.fromHex(publicB);
    return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
  }
  const bits2int = CURVE.bits2int || function(bytes8) {
    const num = bytesToNumberBE2(bytes8);
    const delta = bytes8.length * 8 - CURVE.nBitLength;
    return delta > 0 ? num >> BigInt(delta) : num;
  };
  const bits2int_modN = CURVE.bits2int_modN || function(bytes8) {
    return modN3(bits2int(bytes8));
  };
  const ORDER_MASK = bitMask2(CURVE.nBitLength);
  function int2octets(num) {
    if (typeof num !== "bigint")
      throw new Error("bigint expected");
    if (!(_0n9 <= num && num < ORDER_MASK))
      throw new Error(`bigint expected < 2^${CURVE.nBitLength}`);
    return numberToBytesBE2(num, CURVE.nByteLength);
  }
  function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
    if (["recovered", "canonical"].some((k) => k in opts))
      throw new Error("sign() legacy options not supported");
    const { hash: hash8, randomBytes: randomBytes7 } = CURVE;
    let { lowS, prehash, extraEntropy: ent } = opts;
    if (lowS == null)
      lowS = true;
    msgHash = ensureBytes3("msgHash", msgHash);
    if (prehash)
      msgHash = ensureBytes3("prehashed msgHash", hash8(msgHash));
    const h1int = bits2int_modN(msgHash);
    const d = normPrivateKeyToScalar(privateKey);
    const seedArgs = [int2octets(d), int2octets(h1int)];
    if (ent != null) {
      const e = ent === true ? randomBytes7(Fp3.BYTES) : ent;
      seedArgs.push(ensureBytes3("extraEntropy", e));
    }
    const seed = concatBytes6(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!isWithinCurveOrder(k))
        return;
      const ik = invN(k);
      const q = Point4.BASE.multiply(k).toAffine();
      const r = modN3(q.x);
      if (r === _0n9)
        return;
      const s = modN3(ik * modN3(m + r * d));
      if (s === _0n9)
        return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n9);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = normalizeS(s);
        recovery ^= 1;
      }
      return new Signature(r, normS, recovery);
    }
    return { seed, k2sig };
  }
  const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
  const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
  function sign(msgHash, privKey, opts = defaultSigOpts) {
    const { seed, k2sig } = prepSig(msgHash, privKey, opts);
    const C = CURVE;
    const drbg = createHmacDrbg2(C.hash.outputLen, C.nByteLength, C.hmac);
    return drbg(seed, k2sig);
  }
  Point4.BASE._setWindowSize(8);
  function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
    var _a2;
    const sg = signature;
    msgHash = ensureBytes3("msgHash", msgHash);
    publicKey = ensureBytes3("publicKey", publicKey);
    if ("strict" in opts)
      throw new Error("options.strict was renamed to lowS");
    const { lowS, prehash } = opts;
    let _sig = void 0;
    let P;
    try {
      if (typeof sg === "string" || sg instanceof Uint8Array) {
        try {
          _sig = Signature.fromDER(sg);
        } catch (derError) {
          if (!(derError instanceof DER2.Err))
            throw derError;
          _sig = Signature.fromCompact(sg);
        }
      } else if (typeof sg === "object" && typeof sg.r === "bigint" && typeof sg.s === "bigint") {
        const { r: r2, s: s2 } = sg;
        _sig = new Signature(r2, s2);
      } else {
        throw new Error("PARSE");
      }
      P = Point4.fromHex(publicKey);
    } catch (error) {
      if (error.message === "PARSE")
        throw new Error(`signature must be Signature instance, Uint8Array or hex string`);
      return false;
    }
    if (lowS && _sig.hasHighS())
      return false;
    if (prehash)
      msgHash = CURVE.hash(msgHash);
    const { r, s } = _sig;
    const h = bits2int_modN(msgHash);
    const is = invN(s);
    const u1 = modN3(h * is);
    const u2 = modN3(r * is);
    const R = (_a2 = Point4.BASE.multiplyAndAddUnsafe(P, u1, u2)) == null ? void 0 : _a2.toAffine();
    if (!R)
      return false;
    const v = modN3(R.x);
    return v === r;
  }
  return {
    CURVE,
    getPublicKey: getPublicKey4,
    getSharedSecret,
    sign,
    verify,
    ProjectivePoint: Point4,
    Signature,
    utils: utils4
  };
}

// node_modules/nostr-tools/node_modules/@noble/curves/node_modules/@noble/hashes/esm/hmac.js
var HMAC4 = class extends Hash4 {
  constructor(hash8, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    hash5(hash8);
    const key = toBytes5(_key);
    this.iHash = hash8.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad2 = new Uint8Array(blockLen);
    pad2.set(key.length > blockLen ? hash8.create().update(key).digest() : key);
    for (let i2 = 0; i2 < pad2.length; i2++)
      pad2[i2] ^= 54;
    this.iHash.update(pad2);
    this.oHash = hash8.create();
    for (let i2 = 0; i2 < pad2.length; i2++)
      pad2[i2] ^= 54 ^ 92;
    this.oHash.update(pad2);
    pad2.fill(0);
  }
  update(buf) {
    exists5(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    exists5(this);
    bytes5(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac4 = (hash8, key, message) => new HMAC4(hash8, key).update(message).digest();
hmac4.create = (hash8, key) => new HMAC4(hash8, key);

// node_modules/nostr-tools/node_modules/@noble/curves/esm/_shortw_utils.js
function getHash2(hash8) {
  return {
    hash: hash8,
    hmac: (key, ...msgs) => hmac4(hash8, key, concatBytes5(...msgs)),
    randomBytes: randomBytes4
  };
}
function createCurve2(curveDef, defHash) {
  const create = (hash8) => weierstrass2({ ...curveDef, ...getHash2(hash8) });
  return Object.freeze({ ...create(defHash), create });
}

// node_modules/nostr-tools/node_modules/@noble/curves/esm/secp256k1.js
var secp256k1P2 = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
var secp256k1N2 = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
var _1n10 = BigInt(1);
var _2n8 = BigInt(2);
var divNearest2 = (a, b) => (a + b / _2n8) / b;
function sqrtMod2(y) {
  const P = secp256k1P2;
  const _3n5 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y * y * y % P;
  const b3 = b2 * b2 * y % P;
  const b6 = pow22(b3, _3n5, P) * b3 % P;
  const b9 = pow22(b6, _3n5, P) * b3 % P;
  const b11 = pow22(b9, _2n8, P) * b2 % P;
  const b22 = pow22(b11, _11n, P) * b11 % P;
  const b44 = pow22(b22, _22n, P) * b22 % P;
  const b88 = pow22(b44, _44n, P) * b44 % P;
  const b176 = pow22(b88, _88n, P) * b88 % P;
  const b220 = pow22(b176, _44n, P) * b44 % P;
  const b223 = pow22(b220, _3n5, P) * b3 % P;
  const t1 = pow22(b223, _23n, P) * b22 % P;
  const t2 = pow22(t1, _6n, P) * b2 % P;
  const root = pow22(t2, _2n8, P);
  if (!Fp2.eql(Fp2.sqr(root), y))
    throw new Error("Cannot find square root");
  return root;
}
var Fp2 = Field2(secp256k1P2, void 0, void 0, { sqrt: sqrtMod2 });
var secp256k12 = createCurve2({
  a: BigInt(0),
  b: BigInt(7),
  Fp: Fp2,
  n: secp256k1N2,
  // Base point (x, y) aka generator point
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  h: BigInt(1),
  lowS: true,
  /**
   * secp256k1 belongs to Koblitz curves: it has efficiently computable endomorphism.
   * Endomorphism uses 2x less RAM, speeds up precomputation by 2x and ECDH / key recovery by 20%.
   * For precomputed wNAF it trades off 1/2 init time & 1/3 ram for 20% perf hit.
   * Explanation: https://gist.github.com/paulmillr/eb670806793e84df628a7c434a873066
   */
  endo: {
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
    splitScalar: (k) => {
      const n = secp256k1N2;
      const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
      const b1 = -_1n10 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
      const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
      const b2 = a1;
      const POW_2_128 = BigInt("0x100000000000000000000000000000000");
      const c1 = divNearest2(b2 * k, n);
      const c2 = divNearest2(-b1 * k, n);
      let k1 = mod2(k - c1 * a1 - c2 * a2, n);
      let k2 = mod2(-c1 * b1 - c2 * b2, n);
      const k1neg = k1 > POW_2_128;
      const k2neg = k2 > POW_2_128;
      if (k1neg)
        k1 = n - k1;
      if (k2neg)
        k2 = n - k2;
      if (k1 > POW_2_128 || k2 > POW_2_128) {
        throw new Error("splitScalar: Endomorphism failed, k=" + k);
      }
      return { k1neg, k1, k2neg, k2 };
    }
  }
}, sha2564);
var _0n10 = BigInt(0);
var fe2 = (x) => typeof x === "bigint" && _0n10 < x && x < secp256k1P2;
var ge2 = (x) => typeof x === "bigint" && _0n10 < x && x < secp256k1N2;
var TAGGED_HASH_PREFIXES2 = {};
function taggedHash2(tag, ...messages) {
  let tagP = TAGGED_HASH_PREFIXES2[tag];
  if (tagP === void 0) {
    const tagH = sha2564(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
    tagP = concatBytes6(tagH, tagH);
    TAGGED_HASH_PREFIXES2[tag] = tagP;
  }
  return sha2564(concatBytes6(tagP, ...messages));
}
var pointToBytes2 = (point) => point.toRawBytes(true).slice(1);
var numTo32b2 = (n) => numberToBytesBE2(n, 32);
var modP2 = (x) => mod2(x, secp256k1P2);
var modN2 = (x) => mod2(x, secp256k1N2);
var Point3 = secp256k12.ProjectivePoint;
var GmulAdd2 = (Q, a, b) => Point3.BASE.multiplyAndAddUnsafe(Q, a, b);
function schnorrGetExtPubKey2(priv) {
  let d_ = secp256k12.utils.normPrivateKeyToScalar(priv);
  let p = Point3.fromPrivateKey(d_);
  const scalar = p.hasEvenY() ? d_ : modN2(-d_);
  return { scalar, bytes: pointToBytes2(p) };
}
function lift_x2(x) {
  if (!fe2(x))
    throw new Error("bad x: need 0 < x < p");
  const xx = modP2(x * x);
  const c = modP2(xx * x + BigInt(7));
  let y = sqrtMod2(c);
  if (y % _2n8 !== _0n10)
    y = modP2(-y);
  const p = new Point3(x, y, _1n10);
  p.assertValidity();
  return p;
}
function challenge2(...args) {
  return modN2(bytesToNumberBE2(taggedHash2("BIP0340/challenge", ...args)));
}
function schnorrGetPublicKey2(privateKey) {
  return schnorrGetExtPubKey2(privateKey).bytes;
}
function schnorrSign2(message, privateKey, auxRand = randomBytes4(32)) {
  const m = ensureBytes3("message", message);
  const { bytes: px, scalar: d } = schnorrGetExtPubKey2(privateKey);
  const a = ensureBytes3("auxRand", auxRand, 32);
  const t = numTo32b2(d ^ bytesToNumberBE2(taggedHash2("BIP0340/aux", a)));
  const rand = taggedHash2("BIP0340/nonce", t, px, m);
  const k_ = modN2(bytesToNumberBE2(rand));
  if (k_ === _0n10)
    throw new Error("sign failed: k is zero");
  const { bytes: rx, scalar: k } = schnorrGetExtPubKey2(k_);
  const e = challenge2(rx, px, m);
  const sig = new Uint8Array(64);
  sig.set(rx, 0);
  sig.set(numTo32b2(modN2(k + e * d)), 32);
  if (!schnorrVerify2(sig, m, px))
    throw new Error("sign: Invalid signature produced");
  return sig;
}
function schnorrVerify2(signature, message, publicKey) {
  const sig = ensureBytes3("signature", signature, 64);
  const m = ensureBytes3("message", message);
  const pub = ensureBytes3("publicKey", publicKey, 32);
  try {
    const P = lift_x2(bytesToNumberBE2(pub));
    const r = bytesToNumberBE2(sig.subarray(0, 32));
    if (!fe2(r))
      return false;
    const s = bytesToNumberBE2(sig.subarray(32, 64));
    if (!ge2(s))
      return false;
    const e = challenge2(numTo32b2(r), pointToBytes2(P), m);
    const R = GmulAdd2(P, s, modN2(-e));
    if (!R || !R.hasEvenY() || R.toAffine().x !== r)
      return false;
    return true;
  } catch (error) {
    return false;
  }
}
var schnorr2 = /* @__PURE__ */ (() => ({
  getPublicKey: schnorrGetPublicKey2,
  sign: schnorrSign2,
  verify: schnorrVerify2,
  utils: {
    randomPrivateKey: secp256k12.utils.randomPrivateKey,
    lift_x: lift_x2,
    pointToBytes: pointToBytes2,
    numberToBytesBE: numberToBytesBE2,
    bytesToNumberBE: bytesToNumberBE2,
    taggedHash: taggedHash2,
    mod: mod2
  }
}))();

// node_modules/nostr-tools/node_modules/@noble/hashes/esm/cryptoNode.js
var nc5 = __toESM(require("crypto"), 1);
var crypto6 = nc5 && typeof nc5 === "object" && "webcrypto" in nc5 ? nc5.webcrypto : void 0;

// node_modules/nostr-tools/node_modules/@noble/hashes/esm/utils.js
var u8a8 = (a) => a instanceof Uint8Array;
var createView6 = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
var rotr5 = (word, shift) => word << 32 - shift | word >>> shift;
var isLE6 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!isLE6)
  throw new Error("Non little-endian hardware is not supported");
var hexes6 = Array.from({ length: 256 }, (v, i2) => i2.toString(16).padStart(2, "0"));
function bytesToHex5(bytes8) {
  if (!u8a8(bytes8))
    throw new Error("Uint8Array expected");
  let hex5 = "";
  for (let i2 = 0; i2 < bytes8.length; i2++) {
    hex5 += hexes6[bytes8[i2]];
  }
  return hex5;
}
function hexToBytes5(hex5) {
  if (typeof hex5 !== "string")
    throw new Error("hex string expected, got " + typeof hex5);
  const len = hex5.length;
  if (len % 2)
    throw new Error("padded hex string expected, got unpadded hex of length " + len);
  const array = new Uint8Array(len / 2);
  for (let i2 = 0; i2 < array.length; i2++) {
    const j = i2 * 2;
    const hexByte = hex5.slice(j, j + 2);
    const byte = Number.parseInt(hexByte, 16);
    if (Number.isNaN(byte) || byte < 0)
      throw new Error("Invalid byte sequence");
    array[i2] = byte;
  }
  return array;
}
function utf8ToBytes8(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes6(data) {
  if (typeof data === "string")
    data = utf8ToBytes8(data);
  if (!u8a8(data))
    throw new Error(`expected Uint8Array, got ${typeof data}`);
  return data;
}
function concatBytes7(...arrays) {
  const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
  let pad2 = 0;
  arrays.forEach((a) => {
    if (!u8a8(a))
      throw new Error("Uint8Array expected");
    r.set(a, pad2);
    pad2 += a.length;
  });
  return r;
}
var Hash5 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function wrapConstructor5(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes6(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function randomBytes5(bytesLength = 32) {
  if (crypto6 && typeof crypto6.getRandomValues === "function") {
    return crypto6.getRandomValues(new Uint8Array(bytesLength));
  }
  throw new Error("crypto.getRandomValues must be defined");
}

// node_modules/nostr-tools/node_modules/@noble/hashes/esm/_assert.js
function number6(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error(`Wrong positive integer: ${n}`);
}
function bool5(b) {
  if (typeof b !== "boolean")
    throw new Error(`Expected boolean, not ${b}`);
}
function bytes6(b, ...lengths) {
  if (!(b instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
function hash6(hash8) {
  if (typeof hash8 !== "function" || typeof hash8.create !== "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  number6(hash8.outputLen);
  number6(hash8.blockLen);
}
function exists6(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function output6(out, instance) {
  bytes6(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error(`digestInto() expects output buffer of length at least ${min}`);
  }
}
var assert5 = {
  number: number6,
  bool: bool5,
  bytes: bytes6,
  hash: hash6,
  exists: exists6,
  output: output6
};
var assert_default5 = assert5;

// node_modules/nostr-tools/node_modules/@noble/hashes/esm/_sha2.js
function setBigUint646(view, byteOffset, value, isLE8) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE8);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE8 ? 4 : 0;
  const l = isLE8 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE8);
  view.setUint32(byteOffset + l, wl, isLE8);
}
var SHA25 = class extends Hash5 {
  constructor(blockLen, outputLen, padOffset, isLE8) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE8;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView6(this.buffer);
  }
  update(data) {
    assert_default5.exists(this);
    const { view, buffer, blockLen } = this;
    data = toBytes6(data);
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView6(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    assert_default5.exists(this);
    assert_default5.output(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE8 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    this.buffer.subarray(pos).fill(0);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i2 = pos; i2 < blockLen; i2++)
      buffer[i2] = 0;
    setBigUint646(view, blockLen - 8, BigInt(this.length * 8), isLE8);
    this.process(view, 0);
    const oview = createView6(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i2 = 0; i2 < outLen; i2++)
      oview.setUint32(4 * i2, state[i2], isLE8);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.length = length;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
};

// node_modules/nostr-tools/node_modules/@noble/hashes/esm/sha256.js
var Chi5 = (a, b, c) => a & b ^ ~a & c;
var Maj5 = (a, b, c) => a & b ^ a & c ^ b & c;
var SHA256_K5 = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var IV5 = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA256_W5 = new Uint32Array(64);
var SHA2565 = class extends SHA25 {
  constructor() {
    super(64, 32, 8, false);
    this.A = IV5[0] | 0;
    this.B = IV5[1] | 0;
    this.C = IV5[2] | 0;
    this.D = IV5[3] | 0;
    this.E = IV5[4] | 0;
    this.F = IV5[5] | 0;
    this.G = IV5[6] | 0;
    this.H = IV5[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4)
      SHA256_W5[i2] = view.getUint32(offset, false);
    for (let i2 = 16; i2 < 64; i2++) {
      const W15 = SHA256_W5[i2 - 15];
      const W2 = SHA256_W5[i2 - 2];
      const s0 = rotr5(W15, 7) ^ rotr5(W15, 18) ^ W15 >>> 3;
      const s1 = rotr5(W2, 17) ^ rotr5(W2, 19) ^ W2 >>> 10;
      SHA256_W5[i2] = s1 + SHA256_W5[i2 - 7] + s0 + SHA256_W5[i2 - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i2 = 0; i2 < 64; i2++) {
      const sigma1 = rotr5(E, 6) ^ rotr5(E, 11) ^ rotr5(E, 25);
      const T1 = H + sigma1 + Chi5(E, F, G) + SHA256_K5[i2] + SHA256_W5[i2] | 0;
      const sigma0 = rotr5(A, 2) ^ rotr5(A, 13) ^ rotr5(A, 22);
      const T2 = sigma0 + Maj5(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    SHA256_W5.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
};
var SHA2243 = class extends SHA2565 {
  constructor() {
    super();
    this.A = 3238371032 | 0;
    this.B = 914150663 | 0;
    this.C = 812702999 | 0;
    this.D = 4144912697 | 0;
    this.E = 4290775857 | 0;
    this.F = 1750603025 | 0;
    this.G = 1694076839 | 0;
    this.H = 3204075428 | 0;
    this.outputLen = 28;
  }
};
var sha2565 = wrapConstructor5(() => new SHA2565());
var sha2243 = wrapConstructor5(() => new SHA2243());

// node_modules/nostr-tools/node_modules/@scure/base/lib/esm/index.js
function assertNumber3(n) {
  if (!Number.isSafeInteger(n))
    throw new Error(`Wrong integer: ${n}`);
}
function chain3(...args) {
  const wrap2 = (a, b) => (c) => a(b(c));
  const encode2 = Array.from(args).reverse().reduce((acc, i2) => acc ? wrap2(acc, i2.encode) : i2.encode, void 0);
  const decode5 = args.reduce((acc, i2) => acc ? wrap2(acc, i2.decode) : i2.decode, void 0);
  return { encode: encode2, decode: decode5 };
}
function alphabet3(alphabet5) {
  return {
    encode: (digits) => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
        throw new Error("alphabet.encode input should be an array of numbers");
      return digits.map((i2) => {
        assertNumber3(i2);
        if (i2 < 0 || i2 >= alphabet5.length)
          throw new Error(`Digit index outside alphabet: ${i2} (alphabet: ${alphabet5.length})`);
        return alphabet5[i2];
      });
    },
    decode: (input) => {
      if (!Array.isArray(input) || input.length && typeof input[0] !== "string")
        throw new Error("alphabet.decode input should be array of strings");
      return input.map((letter) => {
        if (typeof letter !== "string")
          throw new Error(`alphabet.decode: not string element=${letter}`);
        const index = alphabet5.indexOf(letter);
        if (index === -1)
          throw new Error(`Unknown letter: "${letter}". Allowed: ${alphabet5}`);
        return index;
      });
    }
  };
}
function join3(separator = "") {
  if (typeof separator !== "string")
    throw new Error("join separator should be string");
  return {
    encode: (from) => {
      if (!Array.isArray(from) || from.length && typeof from[0] !== "string")
        throw new Error("join.encode input should be array of strings");
      for (let i2 of from)
        if (typeof i2 !== "string")
          throw new Error(`join.encode: non-string input=${i2}`);
      return from.join(separator);
    },
    decode: (to) => {
      if (typeof to !== "string")
        throw new Error("join.decode input should be string");
      return to.split(separator);
    }
  };
}
function padding3(bits, chr = "=") {
  assertNumber3(bits);
  if (typeof chr !== "string")
    throw new Error("padding chr should be string");
  return {
    encode(data) {
      if (!Array.isArray(data) || data.length && typeof data[0] !== "string")
        throw new Error("padding.encode input should be array of strings");
      for (let i2 of data)
        if (typeof i2 !== "string")
          throw new Error(`padding.encode: non-string input=${i2}`);
      while (data.length * bits % 8)
        data.push(chr);
      return data;
    },
    decode(input) {
      if (!Array.isArray(input) || input.length && typeof input[0] !== "string")
        throw new Error("padding.encode input should be array of strings");
      for (let i2 of input)
        if (typeof i2 !== "string")
          throw new Error(`padding.decode: non-string input=${i2}`);
      let end = input.length;
      if (end * bits % 8)
        throw new Error("Invalid padding: string should have whole number of bytes");
      for (; end > 0 && input[end - 1] === chr; end--) {
        if (!((end - 1) * bits % 8))
          throw new Error("Invalid padding: string has too much padding");
      }
      return input.slice(0, end);
    }
  };
}
function normalize4(fn) {
  if (typeof fn !== "function")
    throw new Error("normalize fn should be function");
  return { encode: (from) => from, decode: (to) => fn(to) };
}
function convertRadix4(data, from, to) {
  if (from < 2)
    throw new Error(`convertRadix: wrong from=${from}, base cannot be less than 2`);
  if (to < 2)
    throw new Error(`convertRadix: wrong to=${to}, base cannot be less than 2`);
  if (!Array.isArray(data))
    throw new Error("convertRadix: data should be array");
  if (!data.length)
    return [];
  let pos = 0;
  const res = [];
  const digits = Array.from(data);
  digits.forEach((d) => {
    assertNumber3(d);
    if (d < 0 || d >= from)
      throw new Error(`Wrong integer: ${d}`);
  });
  while (true) {
    let carry = 0;
    let done = true;
    for (let i2 = pos; i2 < digits.length; i2++) {
      const digit = digits[i2];
      const digitBase = from * carry + digit;
      if (!Number.isSafeInteger(digitBase) || from * carry / from !== carry || digitBase - digit !== from * carry) {
        throw new Error("convertRadix: carry overflow");
      }
      carry = digitBase % to;
      digits[i2] = Math.floor(digitBase / to);
      if (!Number.isSafeInteger(digits[i2]) || digits[i2] * to + carry !== digitBase)
        throw new Error("convertRadix: carry overflow");
      if (!done)
        continue;
      else if (!digits[i2])
        pos = i2;
      else
        done = false;
    }
    res.push(carry);
    if (done)
      break;
  }
  for (let i2 = 0; i2 < data.length - 1 && data[i2] === 0; i2++)
    res.push(0);
  return res.reverse();
}
var gcd3 = (a, b) => !b ? a : gcd3(b, a % b);
var radix2carry3 = (from, to) => from + (to - gcd3(from, to));
function convertRadix23(data, from, to, padding5) {
  if (!Array.isArray(data))
    throw new Error("convertRadix2: data should be array");
  if (from <= 0 || from > 32)
    throw new Error(`convertRadix2: wrong from=${from}`);
  if (to <= 0 || to > 32)
    throw new Error(`convertRadix2: wrong to=${to}`);
  if (radix2carry3(from, to) > 32) {
    throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${radix2carry3(from, to)}`);
  }
  let carry = 0;
  let pos = 0;
  const mask = 2 ** to - 1;
  const res = [];
  for (const n of data) {
    assertNumber3(n);
    if (n >= 2 ** from)
      throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
    carry = carry << from | n;
    if (pos + from > 32)
      throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
    pos += from;
    for (; pos >= to; pos -= to)
      res.push((carry >> pos - to & mask) >>> 0);
    carry &= 2 ** pos - 1;
  }
  carry = carry << to - pos & mask;
  if (!padding5 && pos >= from)
    throw new Error("Excess padding");
  if (!padding5 && carry)
    throw new Error(`Non-zero padding: ${carry}`);
  if (padding5 && pos > 0)
    res.push(carry >>> 0);
  return res;
}
function radix4(num) {
  assertNumber3(num);
  return {
    encode: (bytes8) => {
      if (!(bytes8 instanceof Uint8Array))
        throw new Error("radix.encode input should be Uint8Array");
      return convertRadix4(Array.from(bytes8), 2 ** 8, num);
    },
    decode: (digits) => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
        throw new Error("radix.decode input should be array of strings");
      return Uint8Array.from(convertRadix4(digits, num, 2 ** 8));
    }
  };
}
function radix23(bits, revPadding = false) {
  assertNumber3(bits);
  if (bits <= 0 || bits > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (radix2carry3(8, bits) > 32 || radix2carry3(bits, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (bytes8) => {
      if (!(bytes8 instanceof Uint8Array))
        throw new Error("radix2.encode input should be Uint8Array");
      return convertRadix23(Array.from(bytes8), 8, bits, !revPadding);
    },
    decode: (digits) => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
        throw new Error("radix2.decode input should be array of strings");
      return Uint8Array.from(convertRadix23(digits, bits, 8, revPadding));
    }
  };
}
function unsafeWrapper2(fn) {
  if (typeof fn !== "function")
    throw new Error("unsafeWrapper fn should be function");
  return function(...args) {
    try {
      return fn.apply(null, args);
    } catch (e) {
    }
  };
}
var base163 = chain3(radix23(4), alphabet3("0123456789ABCDEF"), join3(""));
var base323 = chain3(radix23(5), alphabet3("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), padding3(5), join3(""));
var base32hex3 = chain3(radix23(5), alphabet3("0123456789ABCDEFGHIJKLMNOPQRSTUV"), padding3(5), join3(""));
var base32crockford3 = chain3(radix23(5), alphabet3("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), join3(""), normalize4((s) => s.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
var base643 = chain3(radix23(6), alphabet3("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), padding3(6), join3(""));
var base64url3 = chain3(radix23(6), alphabet3("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), padding3(6), join3(""));
var genBase583 = (abc) => chain3(radix4(58), alphabet3(abc), join3(""));
var base583 = genBase583("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
var base58flickr2 = genBase583("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ");
var base58xrp2 = genBase583("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
var XMR_BLOCK_LEN2 = [0, 2, 3, 5, 6, 7, 9, 10, 11];
var base58xmr2 = {
  encode(data) {
    let res = "";
    for (let i2 = 0; i2 < data.length; i2 += 8) {
      const block = data.subarray(i2, i2 + 8);
      res += base583.encode(block).padStart(XMR_BLOCK_LEN2[block.length], "1");
    }
    return res;
  },
  decode(str) {
    let res = [];
    for (let i2 = 0; i2 < str.length; i2 += 11) {
      const slice2 = str.slice(i2, i2 + 11);
      const blockLen = XMR_BLOCK_LEN2.indexOf(slice2.length);
      const block = base583.decode(slice2);
      for (let j = 0; j < block.length - blockLen; j++) {
        if (block[j] !== 0)
          throw new Error("base58xmr: wrong padding");
      }
      res = res.concat(Array.from(block.slice(block.length - blockLen)));
    }
    return Uint8Array.from(res);
  }
};
var BECH_ALPHABET3 = chain3(alphabet3("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), join3(""));
var POLYMOD_GENERATORS2 = [996825010, 642813549, 513874426, 1027748829, 705979059];
function bech32Polymod2(pre) {
  const b = pre >> 25;
  let chk = (pre & 33554431) << 5;
  for (let i2 = 0; i2 < POLYMOD_GENERATORS2.length; i2++) {
    if ((b >> i2 & 1) === 1)
      chk ^= POLYMOD_GENERATORS2[i2];
  }
  return chk;
}
function bechChecksum2(prefix, words, encodingConst = 1) {
  const len = prefix.length;
  let chk = 1;
  for (let i2 = 0; i2 < len; i2++) {
    const c = prefix.charCodeAt(i2);
    if (c < 33 || c > 126)
      throw new Error(`Invalid prefix (${prefix})`);
    chk = bech32Polymod2(chk) ^ c >> 5;
  }
  chk = bech32Polymod2(chk);
  for (let i2 = 0; i2 < len; i2++)
    chk = bech32Polymod2(chk) ^ prefix.charCodeAt(i2) & 31;
  for (let v of words)
    chk = bech32Polymod2(chk) ^ v;
  for (let i2 = 0; i2 < 6; i2++)
    chk = bech32Polymod2(chk);
  chk ^= encodingConst;
  return BECH_ALPHABET3.encode(convertRadix23([chk % 2 ** 30], 30, 5, false));
}
function genBech322(encoding) {
  const ENCODING_CONST = encoding === "bech32" ? 1 : 734539939;
  const _words = radix23(5);
  const fromWords = _words.decode;
  const toWords = _words.encode;
  const fromWordsUnsafe = unsafeWrapper2(fromWords);
  function encode2(prefix, words, limit = 90) {
    if (typeof prefix !== "string")
      throw new Error(`bech32.encode prefix should be string, not ${typeof prefix}`);
    if (!Array.isArray(words) || words.length && typeof words[0] !== "number")
      throw new Error(`bech32.encode words should be array of numbers, not ${typeof words}`);
    const actualLength = prefix.length + 7 + words.length;
    if (limit !== false && actualLength > limit)
      throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
    prefix = prefix.toLowerCase();
    return `${prefix}1${BECH_ALPHABET3.encode(words)}${bechChecksum2(prefix, words, ENCODING_CONST)}`;
  }
  function decode5(str, limit = 90) {
    if (typeof str !== "string")
      throw new Error(`bech32.decode input should be string, not ${typeof str}`);
    if (str.length < 8 || limit !== false && str.length > limit)
      throw new TypeError(`Wrong string length: ${str.length} (${str}). Expected (8..${limit})`);
    const lowered = str.toLowerCase();
    if (str !== lowered && str !== str.toUpperCase())
      throw new Error(`String must be lowercase or uppercase`);
    str = lowered;
    const sepIndex = str.lastIndexOf("1");
    if (sepIndex === 0 || sepIndex === -1)
      throw new Error(`Letter "1" must be present between prefix and data only`);
    const prefix = str.slice(0, sepIndex);
    const _words2 = str.slice(sepIndex + 1);
    if (_words2.length < 6)
      throw new Error("Data must be at least 6 characters long");
    const words = BECH_ALPHABET3.decode(_words2).slice(0, -6);
    const sum = bechChecksum2(prefix, words, ENCODING_CONST);
    if (!_words2.endsWith(sum))
      throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
    return { prefix, words };
  }
  const decodeUnsafe = unsafeWrapper2(decode5);
  function decodeToBytes(str) {
    const { prefix, words } = decode5(str, false);
    return { prefix, words, bytes: fromWords(words) };
  }
  return { encode: encode2, decode: decode5, decodeToBytes, decodeUnsafe, fromWords, fromWordsUnsafe, toWords };
}
var bech322 = genBech322("bech32");
var bech32m2 = genBech322("bech32m");
var utf82 = {
  encode: (data) => new TextDecoder().decode(data),
  decode: (str) => new TextEncoder().encode(str)
};
var hex3 = chain3(radix23(4), alphabet3("0123456789abcdef"), join3(""), normalize4((s) => {
  if (typeof s !== "string" || s.length % 2)
    throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
  return s.toLowerCase();
}));
var CODERS2 = {
  utf8: utf82,
  hex: hex3,
  base16: base163,
  base32: base323,
  base64: base643,
  base64url: base64url3,
  base58: base583,
  base58xmr: base58xmr2
};
var coderTypeError2 = `Invalid encoding type. Available types: ${Object.keys(CODERS2).join(", ")}`;

// node_modules/nostr-tools/node_modules/@noble/hashes/esm/hmac.js
var HMAC5 = class extends Hash5 {
  constructor(hash8, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    assert_default5.hash(hash8);
    const key = toBytes6(_key);
    this.iHash = hash8.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad2 = new Uint8Array(blockLen);
    pad2.set(key.length > blockLen ? hash8.create().update(key).digest() : key);
    for (let i2 = 0; i2 < pad2.length; i2++)
      pad2[i2] ^= 54;
    this.iHash.update(pad2);
    this.oHash = hash8.create();
    for (let i2 = 0; i2 < pad2.length; i2++)
      pad2[i2] ^= 54 ^ 92;
    this.oHash.update(pad2);
    pad2.fill(0);
  }
  update(buf) {
    assert_default5.exists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    assert_default5.exists(this);
    assert_default5.bytes(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac5 = (hash8, key, message) => new HMAC5(hash8, key).update(message).digest();
hmac5.create = (hash8, key) => new HMAC5(hash8, key);

// node_modules/nostr-tools/node_modules/@noble/hashes/esm/hkdf.js
function extract2(hash8, ikm, salt2) {
  assert_default5.hash(hash8);
  if (salt2 === void 0)
    salt2 = new Uint8Array(hash8.outputLen);
  return hmac5(hash8, toBytes6(salt2), toBytes6(ikm));
}
var HKDF_COUNTER2 = new Uint8Array([0]);
var EMPTY_BUFFER2 = new Uint8Array();
function expand2(hash8, prk, info, length = 32) {
  assert_default5.hash(hash8);
  assert_default5.number(length);
  if (length > 255 * hash8.outputLen)
    throw new Error("Length should be <= 255*HashLen");
  const blocks = Math.ceil(length / hash8.outputLen);
  if (info === void 0)
    info = EMPTY_BUFFER2;
  const okm = new Uint8Array(blocks * hash8.outputLen);
  const HMAC7 = hmac5.create(hash8, prk);
  const HMACTmp = HMAC7._cloneInto();
  const T = new Uint8Array(HMAC7.outputLen);
  for (let counter = 0; counter < blocks; counter++) {
    HKDF_COUNTER2[0] = counter + 1;
    HMACTmp.update(counter === 0 ? EMPTY_BUFFER2 : T).update(info).update(HKDF_COUNTER2).digestInto(T);
    okm.set(T, hash8.outputLen * counter);
    HMAC7._cloneInto(HMACTmp);
  }
  HMAC7.destroy();
  HMACTmp.destroy();
  T.fill(0);
  HKDF_COUNTER2.fill(0);
  return okm.slice(0, length);
}

// node_modules/nostr-tools/lib/esm/index.js
var __defProp3 = Object.defineProperty;
var __export3 = (target, all) => {
  for (var name in all)
    __defProp3(target, name, { get: all[name], enumerable: true });
};
var verifiedSymbol2 = Symbol("verified");
var isRecord2 = (obj) => obj instanceof Object;
function validateEvent3(event) {
  if (!isRecord2(event))
    return false;
  if (typeof event.kind !== "number")
    return false;
  if (typeof event.content !== "string")
    return false;
  if (typeof event.created_at !== "number")
    return false;
  if (typeof event.pubkey !== "string")
    return false;
  if (!event.pubkey.match(/^[a-f0-9]{64}$/))
    return false;
  if (!Array.isArray(event.tags))
    return false;
  for (let i2 = 0; i2 < event.tags.length; i2++) {
    let tag = event.tags[i2];
    if (!Array.isArray(tag))
      return false;
    for (let j = 0; j < tag.length; j++) {
      if (typeof tag[j] === "object")
        return false;
    }
  }
  return true;
}
var utils_exports4 = {};
__export3(utils_exports4, {
  Queue: () => Queue,
  QueueNode: () => QueueNode,
  binarySearch: () => binarySearch,
  insertEventIntoAscendingList: () => insertEventIntoAscendingList2,
  insertEventIntoDescendingList: () => insertEventIntoDescendingList2,
  normalizeURL: () => normalizeURL2,
  utf8Decoder: () => utf8Decoder2,
  utf8Encoder: () => utf8Encoder2
});
var utf8Decoder2 = new TextDecoder("utf-8");
var utf8Encoder2 = new TextEncoder();
function normalizeURL2(url) {
  if (url.indexOf("://") === -1)
    url = "wss://" + url;
  let p = new URL(url);
  p.pathname = p.pathname.replace(/\/+/g, "/");
  if (p.pathname.endsWith("/"))
    p.pathname = p.pathname.slice(0, -1);
  if (p.port === "80" && p.protocol === "ws:" || p.port === "443" && p.protocol === "wss:")
    p.port = "";
  p.searchParams.sort();
  p.hash = "";
  return p.toString();
}
function insertEventIntoDescendingList2(sortedArray, event) {
  const [idx, found] = binarySearch(sortedArray, (b) => {
    if (event.id === b.id)
      return 0;
    if (event.created_at === b.created_at)
      return -1;
    return b.created_at - event.created_at;
  });
  if (!found) {
    sortedArray.splice(idx, 0, event);
  }
  return sortedArray;
}
function insertEventIntoAscendingList2(sortedArray, event) {
  const [idx, found] = binarySearch(sortedArray, (b) => {
    if (event.id === b.id)
      return 0;
    if (event.created_at === b.created_at)
      return -1;
    return event.created_at - b.created_at;
  });
  if (!found) {
    sortedArray.splice(idx, 0, event);
  }
  return sortedArray;
}
function binarySearch(arr, compare) {
  let start = 0;
  let end = arr.length - 1;
  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    const cmp2 = compare(arr[mid]);
    if (cmp2 === 0) {
      return [mid, true];
    }
    if (cmp2 < 0) {
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }
  return [start, false];
}
var QueueNode = class {
  value;
  next = null;
  prev = null;
  constructor(message) {
    this.value = message;
  }
};
var Queue = class {
  first;
  last;
  constructor() {
    this.first = null;
    this.last = null;
  }
  enqueue(value) {
    const newNode = new QueueNode(value);
    if (!this.last) {
      this.first = newNode;
      this.last = newNode;
    } else if (this.last === this.first) {
      this.last = newNode;
      this.last.prev = this.first;
      this.first.next = newNode;
    } else {
      newNode.prev = this.last;
      this.last.next = newNode;
      this.last = newNode;
    }
    return true;
  }
  dequeue() {
    if (!this.first)
      return null;
    if (this.first === this.last) {
      const target2 = this.first;
      this.first = null;
      this.last = null;
      return target2.value;
    }
    const target = this.first;
    this.first = target.next;
    return target.value;
  }
};
var JS = class {
  generateSecretKey() {
    return schnorr2.utils.randomPrivateKey();
  }
  getPublicKey(secretKey) {
    return bytesToHex5(schnorr2.getPublicKey(secretKey));
  }
  finalizeEvent(t, secretKey) {
    const event = t;
    event.pubkey = bytesToHex5(schnorr2.getPublicKey(secretKey));
    event.id = getEventHash2(event);
    event.sig = bytesToHex5(schnorr2.sign(getEventHash2(event), secretKey));
    event[verifiedSymbol2] = true;
    return event;
  }
  verifyEvent(event) {
    if (typeof event[verifiedSymbol2] === "boolean")
      return event[verifiedSymbol2];
    const hash8 = getEventHash2(event);
    if (hash8 !== event.id) {
      event[verifiedSymbol2] = false;
      return false;
    }
    try {
      const valid = schnorr2.verify(event.sig, hash8, event.pubkey);
      event[verifiedSymbol2] = valid;
      return valid;
    } catch (err) {
      event[verifiedSymbol2] = false;
      return false;
    }
  }
};
function serializeEvent2(evt) {
  if (!validateEvent3(evt))
    throw new Error("can't serialize event with wrong or missing properties");
  return JSON.stringify([0, evt.pubkey, evt.created_at, evt.kind, evt.tags, evt.content]);
}
function getEventHash2(event) {
  let eventHash = sha2565(utf8Encoder2.encode(serializeEvent2(event)));
  return bytesToHex5(eventHash);
}
var i = new JS();
var generateSecretKey = i.generateSecretKey;
var getPublicKey2 = i.getPublicKey;
var finalizeEvent = i.finalizeEvent;
var verifyEvent = i.verifyEvent;
var kinds_exports = {};
__export3(kinds_exports, {
  Application: () => Application,
  BadgeAward: () => BadgeAward,
  BadgeDefinition: () => BadgeDefinition,
  BlockedRelaysList: () => BlockedRelaysList,
  BookmarkList: () => BookmarkList,
  Bookmarksets: () => Bookmarksets,
  Calendar: () => Calendar,
  CalendarEventRSVP: () => CalendarEventRSVP,
  ChannelCreation: () => ChannelCreation,
  ChannelHideMessage: () => ChannelHideMessage,
  ChannelMessage: () => ChannelMessage,
  ChannelMetadata: () => ChannelMetadata,
  ChannelMuteUser: () => ChannelMuteUser,
  ClassifiedListing: () => ClassifiedListing,
  ClientAuth: () => ClientAuth,
  CommunitiesList: () => CommunitiesList,
  CommunityDefinition: () => CommunityDefinition,
  CommunityPostApproval: () => CommunityPostApproval,
  Contacts: () => Contacts,
  CreateOrUpdateProduct: () => CreateOrUpdateProduct,
  CreateOrUpdateStall: () => CreateOrUpdateStall,
  Curationsets: () => Curationsets,
  Date: () => Date2,
  DraftClassifiedListing: () => DraftClassifiedListing,
  DraftLong: () => DraftLong,
  Emojisets: () => Emojisets,
  EncryptedDirectMessage: () => EncryptedDirectMessage,
  EncryptedDirectMessages: () => EncryptedDirectMessages,
  EventDeletion: () => EventDeletion,
  FileMetadata: () => FileMetadata,
  FileServerPreference: () => FileServerPreference,
  Followsets: () => Followsets,
  GenericRepost: () => GenericRepost,
  Genericlists: () => Genericlists,
  HTTPAuth: () => HTTPAuth,
  Handlerinformation: () => Handlerinformation,
  Handlerrecommendation: () => Handlerrecommendation,
  Highlights: () => Highlights,
  InterestsList: () => InterestsList,
  Interestsets: () => Interestsets,
  JobFeedback: () => JobFeedback,
  JobRequest: () => JobRequest,
  JobResult: () => JobResult,
  Label: () => Label,
  LightningPubRPC: () => LightningPubRPC,
  LiveChatMessage: () => LiveChatMessage,
  LiveEvent: () => LiveEvent,
  LongFormArticle: () => LongFormArticle,
  Metadata: () => Metadata,
  Mutelist: () => Mutelist,
  NWCWalletInfo: () => NWCWalletInfo,
  NWCWalletRequest: () => NWCWalletRequest,
  NWCWalletResponse: () => NWCWalletResponse,
  NostrConnect: () => NostrConnect,
  OpenTimestamps: () => OpenTimestamps,
  Pinlist: () => Pinlist,
  ProblemTracker: () => ProblemTracker,
  ProfileBadges: () => ProfileBadges,
  PublicChatsList: () => PublicChatsList,
  Reaction: () => Reaction,
  RecommendRelay: () => RecommendRelay,
  RelayList: () => RelayList,
  Relaysets: () => Relaysets,
  Report: () => Report,
  Reporting: () => Reporting,
  Repost: () => Repost,
  SearchRelaysList: () => SearchRelaysList,
  ShortTextNote: () => ShortTextNote,
  Time: () => Time,
  UserEmojiList: () => UserEmojiList,
  UserStatuses: () => UserStatuses,
  Zap: () => Zap2,
  ZapGoal: () => ZapGoal,
  ZapRequest: () => ZapRequest,
  classifyKind: () => classifyKind,
  isEphemeralKind: () => isEphemeralKind,
  isParameterizedReplaceableKind: () => isParameterizedReplaceableKind,
  isRegularKind: () => isRegularKind,
  isReplaceableKind: () => isReplaceableKind
});
function isRegularKind(kind) {
  return 1e3 <= kind && kind < 1e4 || [1, 2, 4, 5, 6, 7, 8, 16, 40, 41, 42, 43, 44].includes(kind);
}
function isReplaceableKind(kind) {
  return [0, 3].includes(kind) || 1e4 <= kind && kind < 2e4;
}
function isEphemeralKind(kind) {
  return 2e4 <= kind && kind < 3e4;
}
function isParameterizedReplaceableKind(kind) {
  return 3e4 <= kind && kind < 4e4;
}
function classifyKind(kind) {
  if (isRegularKind(kind))
    return "regular";
  if (isReplaceableKind(kind))
    return "replaceable";
  if (isEphemeralKind(kind))
    return "ephemeral";
  if (isParameterizedReplaceableKind(kind))
    return "parameterized";
  return "unknown";
}
var Metadata = 0;
var ShortTextNote = 1;
var RecommendRelay = 2;
var Contacts = 3;
var EncryptedDirectMessage = 4;
var EncryptedDirectMessages = 4;
var EventDeletion = 5;
var Repost = 6;
var Reaction = 7;
var BadgeAward = 8;
var GenericRepost = 16;
var ChannelCreation = 40;
var ChannelMetadata = 41;
var ChannelMessage = 42;
var ChannelHideMessage = 43;
var ChannelMuteUser = 44;
var OpenTimestamps = 1040;
var FileMetadata = 1063;
var LiveChatMessage = 1311;
var ProblemTracker = 1971;
var Report = 1984;
var Reporting = 1984;
var Label = 1985;
var CommunityPostApproval = 4550;
var JobRequest = 5999;
var JobResult = 6999;
var JobFeedback = 7e3;
var ZapGoal = 9041;
var ZapRequest = 9734;
var Zap2 = 9735;
var Highlights = 9802;
var Mutelist = 1e4;
var Pinlist = 10001;
var RelayList = 10002;
var BookmarkList = 10003;
var CommunitiesList = 10004;
var PublicChatsList = 10005;
var BlockedRelaysList = 10006;
var SearchRelaysList = 10007;
var InterestsList = 10015;
var UserEmojiList = 10030;
var FileServerPreference = 10096;
var NWCWalletInfo = 13194;
var LightningPubRPC = 21e3;
var ClientAuth = 22242;
var NWCWalletRequest = 23194;
var NWCWalletResponse = 23195;
var NostrConnect = 24133;
var HTTPAuth = 27235;
var Followsets = 3e4;
var Genericlists = 30001;
var Relaysets = 30002;
var Bookmarksets = 30003;
var Curationsets = 30004;
var ProfileBadges = 30008;
var BadgeDefinition = 30009;
var Interestsets = 30015;
var CreateOrUpdateStall = 30017;
var CreateOrUpdateProduct = 30018;
var LongFormArticle = 30023;
var DraftLong = 30024;
var Emojisets = 30030;
var Application = 30078;
var LiveEvent = 30311;
var UserStatuses = 30315;
var ClassifiedListing = 30402;
var DraftClassifiedListing = 30403;
var Date2 = 31922;
var Time = 31923;
var Calendar = 31924;
var CalendarEventRSVP = 31925;
var Handlerrecommendation = 31989;
var Handlerinformation = 31990;
var CommunityDefinition = 34550;
var fakejson_exports2 = {};
__export3(fakejson_exports2, {
  getHex64: () => getHex642,
  getInt: () => getInt2,
  getSubscriptionId: () => getSubscriptionId2,
  matchEventId: () => matchEventId2,
  matchEventKind: () => matchEventKind2,
  matchEventPubkey: () => matchEventPubkey2
});
function getHex642(json, field) {
  let len = field.length + 3;
  let idx = json.indexOf(`"${field}":`) + len;
  let s = json.slice(idx).indexOf(`"`) + idx + 1;
  return json.slice(s, s + 64);
}
function getInt2(json, field) {
  let len = field.length;
  let idx = json.indexOf(`"${field}":`) + len + 3;
  let sliced = json.slice(idx);
  let end = Math.min(sliced.indexOf(","), sliced.indexOf("}"));
  return parseInt(sliced.slice(0, end), 10);
}
function getSubscriptionId2(json) {
  let idx = json.slice(0, 22).indexOf(`"EVENT"`);
  if (idx === -1)
    return null;
  let pstart = json.slice(idx + 7 + 1).indexOf(`"`);
  if (pstart === -1)
    return null;
  let start = idx + 7 + 1 + pstart;
  let pend = json.slice(start + 1, 80).indexOf(`"`);
  if (pend === -1)
    return null;
  let end = start + 1 + pend;
  return json.slice(start + 1, end);
}
function matchEventId2(json, id) {
  return id === getHex642(json, "id");
}
function matchEventPubkey2(json, pubkey) {
  return pubkey === getHex642(json, "pubkey");
}
function matchEventKind2(json, kind) {
  return kind === getInt2(json, "kind");
}
var nip42_exports2 = {};
__export3(nip42_exports2, {
  makeAuthEvent: () => makeAuthEvent
});
function makeAuthEvent(relayURL, challenge3) {
  return {
    kind: ClientAuth,
    created_at: Math.floor(Date.now() / 1e3),
    tags: [
      ["relay", relayURL],
      ["challenge", challenge3]
    ],
    content: ""
  };
}
var nip19_exports2 = {};
__export3(nip19_exports2, {
  BECH32_REGEX: () => BECH32_REGEX2,
  decode: () => decode3,
  naddrEncode: () => naddrEncode2,
  neventEncode: () => neventEncode2,
  noteEncode: () => noteEncode2,
  nprofileEncode: () => nprofileEncode2,
  npubEncode: () => npubEncode2,
  nrelayEncode: () => nrelayEncode2,
  nsecEncode: () => nsecEncode2
});
var Bech32MaxSize2 = 5e3;
var BECH32_REGEX2 = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function integerToUint8Array2(number8) {
  const uint8Array = new Uint8Array(4);
  uint8Array[0] = number8 >> 24 & 255;
  uint8Array[1] = number8 >> 16 & 255;
  uint8Array[2] = number8 >> 8 & 255;
  uint8Array[3] = number8 & 255;
  return uint8Array;
}
function decode3(nip19) {
  var _a2, _b, _c, _d, _e, _f, _g, _h;
  let { prefix, words } = bech322.decode(nip19, Bech32MaxSize2);
  let data = new Uint8Array(bech322.fromWords(words));
  switch (prefix) {
    case "nprofile": {
      let tlv = parseTLV2(data);
      if (!((_a2 = tlv[0]) == null ? void 0 : _a2[0]))
        throw new Error("missing TLV 0 for nprofile");
      if (tlv[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      return {
        type: "nprofile",
        data: {
          pubkey: bytesToHex5(tlv[0][0]),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder2.decode(d)) : []
        }
      };
    }
    case "nevent": {
      let tlv = parseTLV2(data);
      if (!((_b = tlv[0]) == null ? void 0 : _b[0]))
        throw new Error("missing TLV 0 for nevent");
      if (tlv[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      if (tlv[2] && tlv[2][0].length !== 32)
        throw new Error("TLV 2 should be 32 bytes");
      if (tlv[3] && tlv[3][0].length !== 4)
        throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "nevent",
        data: {
          id: bytesToHex5(tlv[0][0]),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder2.decode(d)) : [],
          author: ((_c = tlv[2]) == null ? void 0 : _c[0]) ? bytesToHex5(tlv[2][0]) : void 0,
          kind: ((_d = tlv[3]) == null ? void 0 : _d[0]) ? parseInt(bytesToHex5(tlv[3][0]), 16) : void 0
        }
      };
    }
    case "naddr": {
      let tlv = parseTLV2(data);
      if (!((_e = tlv[0]) == null ? void 0 : _e[0]))
        throw new Error("missing TLV 0 for naddr");
      if (!((_f = tlv[2]) == null ? void 0 : _f[0]))
        throw new Error("missing TLV 2 for naddr");
      if (tlv[2][0].length !== 32)
        throw new Error("TLV 2 should be 32 bytes");
      if (!((_g = tlv[3]) == null ? void 0 : _g[0]))
        throw new Error("missing TLV 3 for naddr");
      if (tlv[3][0].length !== 4)
        throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "naddr",
        data: {
          identifier: utf8Decoder2.decode(tlv[0][0]),
          pubkey: bytesToHex5(tlv[2][0]),
          kind: parseInt(bytesToHex5(tlv[3][0]), 16),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder2.decode(d)) : []
        }
      };
    }
    case "nrelay": {
      let tlv = parseTLV2(data);
      if (!((_h = tlv[0]) == null ? void 0 : _h[0]))
        throw new Error("missing TLV 0 for nrelay");
      return {
        type: "nrelay",
        data: utf8Decoder2.decode(tlv[0][0])
      };
    }
    case "nsec":
      return { type: prefix, data };
    case "npub":
    case "note":
      return { type: prefix, data: bytesToHex5(data) };
    default:
      throw new Error(`unknown prefix ${prefix}`);
  }
}
function parseTLV2(data) {
  let result = {};
  let rest = data;
  while (rest.length > 0) {
    let t = rest[0];
    let l = rest[1];
    let v = rest.slice(2, 2 + l);
    rest = rest.slice(2 + l);
    if (v.length < l)
      throw new Error(`not enough data to read on TLV ${t}`);
    result[t] = result[t] || [];
    result[t].push(v);
  }
  return result;
}
function nsecEncode2(key) {
  return encodeBytes2("nsec", key);
}
function npubEncode2(hex5) {
  return encodeBytes2("npub", hexToBytes5(hex5));
}
function noteEncode2(hex5) {
  return encodeBytes2("note", hexToBytes5(hex5));
}
function encodeBech322(prefix, data) {
  let words = bech322.toWords(data);
  return bech322.encode(prefix, words, Bech32MaxSize2);
}
function encodeBytes2(prefix, bytes8) {
  return encodeBech322(prefix, bytes8);
}
function nprofileEncode2(profile) {
  let data = encodeTLV2({
    0: [hexToBytes5(profile.pubkey)],
    1: (profile.relays || []).map((url) => utf8Encoder2.encode(url))
  });
  return encodeBech322("nprofile", data);
}
function neventEncode2(event) {
  let kindArray;
  if (event.kind !== void 0) {
    kindArray = integerToUint8Array2(event.kind);
  }
  let data = encodeTLV2({
    0: [hexToBytes5(event.id)],
    1: (event.relays || []).map((url) => utf8Encoder2.encode(url)),
    2: event.author ? [hexToBytes5(event.author)] : [],
    3: kindArray ? [new Uint8Array(kindArray)] : []
  });
  return encodeBech322("nevent", data);
}
function naddrEncode2(addr) {
  let kind = new ArrayBuffer(4);
  new DataView(kind).setUint32(0, addr.kind, false);
  let data = encodeTLV2({
    0: [utf8Encoder2.encode(addr.identifier)],
    1: (addr.relays || []).map((url) => utf8Encoder2.encode(url)),
    2: [hexToBytes5(addr.pubkey)],
    3: [new Uint8Array(kind)]
  });
  return encodeBech322("naddr", data);
}
function nrelayEncode2(url) {
  let data = encodeTLV2({
    0: [utf8Encoder2.encode(url)]
  });
  return encodeBech322("nrelay", data);
}
function encodeTLV2(tlv) {
  let entries = [];
  Object.entries(tlv).reverse().forEach(([t, vs]) => {
    vs.forEach((v) => {
      let entry = new Uint8Array(v.length + 2);
      entry.set([parseInt(t)], 0);
      entry.set([v.length], 1);
      entry.set(v, 2);
      entries.push(entry);
    });
  });
  return concatBytes7(...entries);
}
var nip04_exports2 = {};
__export3(nip04_exports2, {
  decrypt: () => decrypt4,
  encrypt: () => encrypt4
});
if (typeof crypto !== "undefined" && !crypto.subtle && crypto.webcrypto) {
  crypto.subtle = crypto.webcrypto.subtle;
}
async function encrypt4(secretKey, pubkey, text) {
  const privkey = secretKey instanceof Uint8Array ? bytesToHex5(secretKey) : secretKey;
  const key = secp256k12.getSharedSecret(privkey, "02" + pubkey);
  const normalizedKey = getNormalizedX2(key);
  let iv = Uint8Array.from(randomBytes5(16));
  let plaintext = utf8Encoder2.encode(text);
  let cryptoKey = await crypto.subtle.importKey("raw", normalizedKey, { name: "AES-CBC" }, false, ["encrypt"]);
  let ciphertext = await crypto.subtle.encrypt({ name: "AES-CBC", iv }, cryptoKey, plaintext);
  let ctb64 = base643.encode(new Uint8Array(ciphertext));
  let ivb64 = base643.encode(new Uint8Array(iv.buffer));
  return `${ctb64}?iv=${ivb64}`;
}
async function decrypt4(secretKey, pubkey, data) {
  const privkey = secretKey instanceof Uint8Array ? bytesToHex5(secretKey) : secretKey;
  let [ctb64, ivb64] = data.split("?iv=");
  let key = secp256k12.getSharedSecret(privkey, "02" + pubkey);
  let normalizedKey = getNormalizedX2(key);
  let cryptoKey = await crypto.subtle.importKey("raw", normalizedKey, { name: "AES-CBC" }, false, ["decrypt"]);
  let ciphertext = base643.decode(ctb64);
  let iv = base643.decode(ivb64);
  let plaintext = await crypto.subtle.decrypt({ name: "AES-CBC", iv }, cryptoKey, ciphertext);
  let text = utf8Decoder2.decode(plaintext);
  return text;
}
function getNormalizedX2(key) {
  return key.slice(1, 33);
}
var nip05_exports2 = {};
__export3(nip05_exports2, {
  NIP05_REGEX: () => NIP05_REGEX2,
  queryProfile: () => queryProfile2,
  searchDomain: () => searchDomain2,
  useFetchImplementation: () => useFetchImplementation4
});
var NIP05_REGEX2 = /^(?:([\w.+-]+)@)?([\w.-]+)$/;
var _fetch4;
try {
  _fetch4 = fetch;
} catch {
}
function useFetchImplementation4(fetchImplementation) {
  _fetch4 = fetchImplementation;
}
async function searchDomain2(domain, query = "") {
  try {
    let res = await (await _fetch4(`https://${domain}/.well-known/nostr.json?name=${query}`)).json();
    return res.names;
  } catch (_) {
    return {};
  }
}
async function queryProfile2(fullname) {
  const match = fullname.match(NIP05_REGEX2);
  if (!match)
    return null;
  const [_, name = "_", domain] = match;
  try {
    const res = await _fetch4(`https://${domain}/.well-known/nostr.json?name=${name}`);
    const { names, relays } = parseNIP05Result2(await res.json());
    const pubkey = names[name];
    return pubkey ? { pubkey, relays: relays == null ? void 0 : relays[pubkey] } : null;
  } catch (_e) {
    return null;
  }
}
function parseNIP05Result2(json) {
  const result = {
    names: {}
  };
  for (const [name, pubkey] of Object.entries(json.names)) {
    if (typeof name === "string" && typeof pubkey === "string") {
      result.names[name] = pubkey;
    }
  }
  if (json.relays) {
    result.relays = {};
    for (const [pubkey, relays] of Object.entries(json.relays)) {
      if (typeof pubkey === "string" && Array.isArray(relays)) {
        result.relays[pubkey] = relays.filter((relay) => typeof relay === "string");
      }
    }
  }
  return result;
}
var nip10_exports2 = {};
__export3(nip10_exports2, {
  parse: () => parse3
});
function parse3(event) {
  const result = {
    reply: void 0,
    root: void 0,
    mentions: [],
    profiles: []
  };
  const eTags = [];
  for (const tag of event.tags) {
    if (tag[0] === "e" && tag[1]) {
      eTags.push(tag);
    }
    if (tag[0] === "p" && tag[1]) {
      result.profiles.push({
        pubkey: tag[1],
        relays: tag[2] ? [tag[2]] : []
      });
    }
  }
  for (let eTagIndex = 0; eTagIndex < eTags.length; eTagIndex++) {
    const eTag = eTags[eTagIndex];
    const [_, eTagEventId, eTagRelayUrl, eTagMarker] = eTag;
    const eventPointer = {
      id: eTagEventId,
      relays: eTagRelayUrl ? [eTagRelayUrl] : []
    };
    const isFirstETag = eTagIndex === 0;
    const isLastETag = eTagIndex === eTags.length - 1;
    if (eTagMarker === "root") {
      result.root = eventPointer;
      continue;
    }
    if (eTagMarker === "reply") {
      result.reply = eventPointer;
      continue;
    }
    if (eTagMarker === "mention") {
      result.mentions.push(eventPointer);
      continue;
    }
    if (isFirstETag) {
      result.root = eventPointer;
      continue;
    }
    if (isLastETag) {
      result.reply = eventPointer;
      continue;
    }
    result.mentions.push(eventPointer);
  }
  return result;
}
var nip11_exports = {};
__export3(nip11_exports, {
  fetchRelayInformation: () => fetchRelayInformation,
  useFetchImplementation: () => useFetchImplementation22
});
var _fetch22;
try {
  _fetch22 = fetch;
} catch {
}
function useFetchImplementation22(fetchImplementation) {
  _fetch22 = fetchImplementation;
}
async function fetchRelayInformation(url) {
  return await (await fetch(url.replace("ws://", "http://").replace("wss://", "https://"), {
    headers: { Accept: "application/nostr+json" }
  })).json();
}
var nip13_exports2 = {};
__export3(nip13_exports2, {
  getPow: () => getPow2,
  minePow: () => minePow2
});
function getPow2(hex5) {
  let count = 0;
  for (let i2 = 0; i2 < hex5.length; i2++) {
    const nibble = parseInt(hex5[i2], 16);
    if (nibble === 0) {
      count += 4;
    } else {
      count += Math.clz32(nibble) - 28;
      break;
    }
  }
  return count;
}
function minePow2(unsigned, difficulty) {
  let count = 0;
  const event = unsigned;
  const tag = ["nonce", count.toString(), difficulty.toString()];
  event.tags.push(tag);
  while (true) {
    const now2 = Math.floor(new Date().getTime() / 1e3);
    if (now2 !== event.created_at) {
      count = 0;
      event.created_at = now2;
    }
    tag[1] = (++count).toString();
    event.id = getEventHash2(event);
    if (getPow2(event.id) >= difficulty) {
      break;
    }
  }
  return event;
}
var nip18_exports2 = {};
__export3(nip18_exports2, {
  finishRepostEvent: () => finishRepostEvent2,
  getRepostedEvent: () => getRepostedEvent2,
  getRepostedEventPointer: () => getRepostedEventPointer2
});
function finishRepostEvent2(t, reposted, relayUrl, privateKey) {
  var _a2;
  return finalizeEvent(
    {
      kind: Repost,
      tags: [...(_a2 = t.tags) != null ? _a2 : [], ["e", reposted.id, relayUrl], ["p", reposted.pubkey]],
      content: t.content === "" ? "" : JSON.stringify(reposted),
      created_at: t.created_at
    },
    privateKey
  );
}
function getRepostedEventPointer2(event) {
  if (event.kind !== Repost) {
    return void 0;
  }
  let lastETag;
  let lastPTag;
  for (let i2 = event.tags.length - 1; i2 >= 0 && (lastETag === void 0 || lastPTag === void 0); i2--) {
    const tag = event.tags[i2];
    if (tag.length >= 2) {
      if (tag[0] === "e" && lastETag === void 0) {
        lastETag = tag;
      } else if (tag[0] === "p" && lastPTag === void 0) {
        lastPTag = tag;
      }
    }
  }
  if (lastETag === void 0) {
    return void 0;
  }
  return {
    id: lastETag[1],
    relays: [lastETag[2], lastPTag == null ? void 0 : lastPTag[2]].filter((x) => typeof x === "string"),
    author: lastPTag == null ? void 0 : lastPTag[1]
  };
}
function getRepostedEvent2(event, { skipVerification } = {}) {
  const pointer = getRepostedEventPointer2(event);
  if (pointer === void 0 || event.content === "") {
    return void 0;
  }
  let repostedEvent;
  try {
    repostedEvent = JSON.parse(event.content);
  } catch (error) {
    return void 0;
  }
  if (repostedEvent.id !== pointer.id) {
    return void 0;
  }
  if (!skipVerification && !verifyEvent(repostedEvent)) {
    return void 0;
  }
  return repostedEvent;
}
var nip21_exports2 = {};
__export3(nip21_exports2, {
  NOSTR_URI_REGEX: () => NOSTR_URI_REGEX2,
  parse: () => parse22,
  test: () => test2
});
var NOSTR_URI_REGEX2 = new RegExp(`nostr:(${BECH32_REGEX2.source})`);
function test2(value) {
  return typeof value === "string" && new RegExp(`^${NOSTR_URI_REGEX2.source}$`).test(value);
}
function parse22(uri) {
  const match = uri.match(new RegExp(`^${NOSTR_URI_REGEX2.source}$`));
  if (!match)
    throw new Error(`Invalid Nostr URI: ${uri}`);
  return {
    uri: match[0],
    value: match[1],
    decoded: decode3(match[1])
  };
}
var nip25_exports2 = {};
__export3(nip25_exports2, {
  finishReactionEvent: () => finishReactionEvent2,
  getReactedEventPointer: () => getReactedEventPointer2
});
function finishReactionEvent2(t, reacted, privateKey) {
  var _a2, _b;
  const inheritedTags = reacted.tags.filter((tag) => tag.length >= 2 && (tag[0] === "e" || tag[0] === "p"));
  return finalizeEvent(
    {
      ...t,
      kind: Reaction,
      tags: [...(_a2 = t.tags) != null ? _a2 : [], ...inheritedTags, ["e", reacted.id], ["p", reacted.pubkey]],
      content: (_b = t.content) != null ? _b : "+"
    },
    privateKey
  );
}
function getReactedEventPointer2(event) {
  if (event.kind !== Reaction) {
    return void 0;
  }
  let lastETag;
  let lastPTag;
  for (let i2 = event.tags.length - 1; i2 >= 0 && (lastETag === void 0 || lastPTag === void 0); i2--) {
    const tag = event.tags[i2];
    if (tag.length >= 2) {
      if (tag[0] === "e" && lastETag === void 0) {
        lastETag = tag;
      } else if (tag[0] === "p" && lastPTag === void 0) {
        lastPTag = tag;
      }
    }
  }
  if (lastETag === void 0 || lastPTag === void 0) {
    return void 0;
  }
  return {
    id: lastETag[1],
    relays: [lastETag[2], lastPTag[2]].filter((x) => x !== void 0),
    author: lastPTag[1]
  };
}
var nip27_exports2 = {};
__export3(nip27_exports2, {
  matchAll: () => matchAll2,
  regex: () => regex2,
  replaceAll: () => replaceAll2
});
var regex2 = () => new RegExp(`\\b${NOSTR_URI_REGEX2.source}\\b`, "g");
function* matchAll2(content) {
  const matches = content.matchAll(regex2());
  for (const match of matches) {
    try {
      const [uri, value] = match;
      yield {
        uri,
        value,
        decoded: decode3(value),
        start: match.index,
        end: match.index + uri.length
      };
    } catch (_e) {
    }
  }
}
function replaceAll2(content, replacer) {
  return content.replaceAll(regex2(), (uri, value) => {
    return replacer({
      uri,
      value,
      decoded: decode3(value)
    });
  });
}
var nip28_exports2 = {};
__export3(nip28_exports2, {
  channelCreateEvent: () => channelCreateEvent2,
  channelHideMessageEvent: () => channelHideMessageEvent2,
  channelMessageEvent: () => channelMessageEvent2,
  channelMetadataEvent: () => channelMetadataEvent2,
  channelMuteUserEvent: () => channelMuteUserEvent2
});
var channelCreateEvent2 = (t, privateKey) => {
  var _a2;
  let content;
  if (typeof t.content === "object") {
    content = JSON.stringify(t.content);
  } else if (typeof t.content === "string") {
    content = t.content;
  } else {
    return void 0;
  }
  return finalizeEvent(
    {
      kind: ChannelCreation,
      tags: [...(_a2 = t.tags) != null ? _a2 : []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelMetadataEvent2 = (t, privateKey) => {
  var _a2;
  let content;
  if (typeof t.content === "object") {
    content = JSON.stringify(t.content);
  } else if (typeof t.content === "string") {
    content = t.content;
  } else {
    return void 0;
  }
  return finalizeEvent(
    {
      kind: ChannelMetadata,
      tags: [["e", t.channel_create_event_id], ...(_a2 = t.tags) != null ? _a2 : []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelMessageEvent2 = (t, privateKey) => {
  var _a2;
  const tags = [["e", t.channel_create_event_id, t.relay_url, "root"]];
  if (t.reply_to_channel_message_event_id) {
    tags.push(["e", t.reply_to_channel_message_event_id, t.relay_url, "reply"]);
  }
  return finalizeEvent(
    {
      kind: ChannelMessage,
      tags: [...tags, ...(_a2 = t.tags) != null ? _a2 : []],
      content: t.content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelHideMessageEvent2 = (t, privateKey) => {
  var _a2;
  let content;
  if (typeof t.content === "object") {
    content = JSON.stringify(t.content);
  } else if (typeof t.content === "string") {
    content = t.content;
  } else {
    return void 0;
  }
  return finalizeEvent(
    {
      kind: ChannelHideMessage,
      tags: [["e", t.channel_message_event_id], ...(_a2 = t.tags) != null ? _a2 : []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelMuteUserEvent2 = (t, privateKey) => {
  var _a2;
  let content;
  if (typeof t.content === "object") {
    content = JSON.stringify(t.content);
  } else if (typeof t.content === "string") {
    content = t.content;
  } else {
    return void 0;
  }
  return finalizeEvent(
    {
      kind: ChannelMuteUser,
      tags: [["p", t.pubkey_to_mute], ...(_a2 = t.tags) != null ? _a2 : []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var nip30_exports = {};
__export3(nip30_exports, {
  EMOJI_SHORTCODE_REGEX: () => EMOJI_SHORTCODE_REGEX,
  matchAll: () => matchAll22,
  regex: () => regex22,
  replaceAll: () => replaceAll22
});
var EMOJI_SHORTCODE_REGEX = /:(\w+):/;
var regex22 = () => new RegExp(`\\B${EMOJI_SHORTCODE_REGEX.source}\\B`, "g");
function* matchAll22(content) {
  const matches = content.matchAll(regex22());
  for (const match of matches) {
    try {
      const [shortcode, name] = match;
      yield {
        shortcode,
        name,
        start: match.index,
        end: match.index + shortcode.length
      };
    } catch (_e) {
    }
  }
}
function replaceAll22(content, replacer) {
  return content.replaceAll(regex22(), (shortcode, name) => {
    return replacer({
      shortcode,
      name
    });
  });
}
var nip39_exports2 = {};
__export3(nip39_exports2, {
  useFetchImplementation: () => useFetchImplementation32,
  validateGithub: () => validateGithub2
});
var _fetch32;
try {
  _fetch32 = fetch;
} catch {
}
function useFetchImplementation32(fetchImplementation) {
  _fetch32 = fetchImplementation;
}
async function validateGithub2(pubkey, username, proof) {
  try {
    let res = await (await _fetch32(`https://gist.github.com/${username}/${proof}/raw`)).text();
    return res === `Verifying that I control the following Nostr public key: ${pubkey}`;
  } catch (_) {
    return false;
  }
}
var nip44_exports2 = {};
__export3(nip44_exports2, {
  default: () => nip44_default,
  v2: () => v2
});
var decoder = new TextDecoder();
var u = {
  minPlaintextSize: 1,
  maxPlaintextSize: 65535,
  utf8Encode: utf8ToBytes8,
  utf8Decode(bytes8) {
    return decoder.decode(bytes8);
  },
  getConversationKey(privkeyA, pubkeyB) {
    const sharedX = secp256k12.getSharedSecret(privkeyA, "02" + pubkeyB).subarray(1, 33);
    return extract2(sha2565, sharedX, "nip44-v2");
  },
  getMessageKeys(conversationKey, nonce) {
    ensureBytes2(conversationKey, 32);
    ensureBytes2(nonce, 32);
    const keys2 = expand2(sha2565, conversationKey, nonce, 76);
    return {
      chacha_key: keys2.subarray(0, 32),
      chacha_nonce: keys2.subarray(32, 44),
      hmac_key: keys2.subarray(44, 76)
    };
  },
  calcPaddedLen(len) {
    if (!Number.isSafeInteger(len) || len < 1)
      throw new Error("expected positive integer");
    if (len <= 32)
      return 32;
    const nextPower = 1 << Math.floor(Math.log2(len - 1)) + 1;
    const chunk = nextPower <= 256 ? 32 : nextPower / 8;
    return chunk * (Math.floor((len - 1) / chunk) + 1);
  },
  writeU16BE(num) {
    if (!Number.isSafeInteger(num) || num < u.minPlaintextSize || num > u.maxPlaintextSize)
      throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");
    const arr = new Uint8Array(2);
    new DataView(arr.buffer).setUint16(0, num, false);
    return arr;
  },
  pad(plaintext) {
    const unpadded = u.utf8Encode(plaintext);
    const unpaddedLen = unpadded.length;
    const prefix = u.writeU16BE(unpaddedLen);
    const suffix = new Uint8Array(u.calcPaddedLen(unpaddedLen) - unpaddedLen);
    return concatBytes7(prefix, unpadded, suffix);
  },
  unpad(padded) {
    const unpaddedLen = new DataView(padded.buffer).getUint16(0);
    const unpadded = padded.subarray(2, 2 + unpaddedLen);
    if (unpaddedLen < u.minPlaintextSize || unpaddedLen > u.maxPlaintextSize || unpadded.length !== unpaddedLen || padded.length !== 2 + u.calcPaddedLen(unpaddedLen))
      throw new Error("invalid padding");
    return u.utf8Decode(unpadded);
  },
  hmacAad(key, message, aad) {
    if (aad.length !== 32)
      throw new Error("AAD associated data must be 32 bytes");
    const combined = concatBytes7(aad, message);
    return hmac5(sha2565, key, combined);
  },
  decodePayload(payload) {
    if (typeof payload !== "string")
      throw new Error("payload must be a valid string");
    const plen = payload.length;
    if (plen < 132 || plen > 87472)
      throw new Error("invalid payload length: " + plen);
    if (payload[0] === "#")
      throw new Error("unknown encryption version");
    let data;
    try {
      data = base643.decode(payload);
    } catch (error) {
      throw new Error("invalid base64: " + error.message);
    }
    const dlen = data.length;
    if (dlen < 99 || dlen > 65603)
      throw new Error("invalid data length: " + dlen);
    const vers = data[0];
    if (vers !== 2)
      throw new Error("unknown encryption version " + vers);
    return {
      nonce: data.subarray(1, 33),
      ciphertext: data.subarray(33, -32),
      mac: data.subarray(-32)
    };
  }
};
function encrypt22(plaintext, conversationKey, nonce = randomBytes5(32)) {
  const { chacha_key, chacha_nonce, hmac_key } = u.getMessageKeys(conversationKey, nonce);
  const padded = u.pad(plaintext);
  const ciphertext = chacha20(chacha_key, chacha_nonce, padded);
  const mac = u.hmacAad(hmac_key, ciphertext, nonce);
  return base643.encode(concatBytes7(new Uint8Array([2]), nonce, ciphertext, mac));
}
function decrypt22(payload, conversationKey) {
  const { nonce, ciphertext, mac } = u.decodePayload(payload);
  const { chacha_key, chacha_nonce, hmac_key } = u.getMessageKeys(conversationKey, nonce);
  const calculatedMac = u.hmacAad(hmac_key, ciphertext, nonce);
  if (!equalBytes2(calculatedMac, mac))
    throw new Error("invalid MAC");
  const padded = chacha20(chacha_key, chacha_nonce, ciphertext);
  return u.unpad(padded);
}
var v2 = {
  utils: u,
  encrypt: encrypt22,
  decrypt: decrypt22
};
var nip44_default = { v2 };
var nip47_exports2 = {};
__export3(nip47_exports2, {
  makeNwcRequestEvent: () => makeNwcRequestEvent2,
  parseConnectionString: () => parseConnectionString2
});
function parseConnectionString2(connectionString) {
  const { pathname, searchParams } = new URL(connectionString);
  const pubkey = pathname;
  const relay = searchParams.get("relay");
  const secret = searchParams.get("secret");
  if (!pubkey || !relay || !secret) {
    throw new Error("invalid connection string");
  }
  return { pubkey, relay, secret };
}
async function makeNwcRequestEvent2(pubkey, secretKey, invoice) {
  const content = {
    method: "pay_invoice",
    params: {
      invoice
    }
  };
  const encryptedContent = await encrypt4(secretKey, pubkey, JSON.stringify(content));
  const eventTemplate = {
    kind: NWCWalletRequest,
    created_at: Math.round(Date.now() / 1e3),
    content: encryptedContent,
    tags: [["p", pubkey]]
  };
  return finalizeEvent(eventTemplate, secretKey);
}
var nip57_exports2 = {};
__export3(nip57_exports2, {
  getZapEndpoint: () => getZapEndpoint2,
  makeZapReceipt: () => makeZapReceipt2,
  makeZapRequest: () => makeZapRequest2,
  useFetchImplementation: () => useFetchImplementation42,
  validateZapRequest: () => validateZapRequest2
});
var _fetch42;
try {
  _fetch42 = fetch;
} catch {
}
function useFetchImplementation42(fetchImplementation) {
  _fetch42 = fetchImplementation;
}
async function getZapEndpoint2(metadata) {
  try {
    let lnurl = "";
    let { lud06, lud16 } = JSON.parse(metadata.content);
    if (lud06) {
      let { words } = bech322.decode(lud06, 1e3);
      let data = bech322.fromWords(words);
      lnurl = utf8Decoder2.decode(data);
    } else if (lud16) {
      let [name, domain] = lud16.split("@");
      lnurl = new URL(`/.well-known/lnurlp/${name}`, `https://${domain}`).toString();
    } else {
      return null;
    }
    let res = await _fetch42(lnurl);
    let body = await res.json();
    if (body.allowsNostr && body.nostrPubkey) {
      return body.callback;
    }
  } catch (err) {
  }
  return null;
}
function makeZapRequest2({
  profile,
  event,
  amount,
  relays,
  comment = ""
}) {
  if (!amount)
    throw new Error("amount not given");
  if (!profile)
    throw new Error("profile not given");
  let zr = {
    kind: 9734,
    created_at: Math.round(Date.now() / 1e3),
    content: comment,
    tags: [
      ["p", profile],
      ["amount", amount.toString()],
      ["relays", ...relays]
    ]
  };
  if (event) {
    zr.tags.push(["e", event]);
  }
  return zr;
}
function validateZapRequest2(zapRequestString) {
  let zapRequest;
  try {
    zapRequest = JSON.parse(zapRequestString);
  } catch (err) {
    return "Invalid zap request JSON.";
  }
  if (!validateEvent3(zapRequest))
    return "Zap request is not a valid Nostr event.";
  if (!verifyEvent(zapRequest))
    return "Invalid signature on zap request.";
  let p = zapRequest.tags.find(([t, v]) => t === "p" && v);
  if (!p)
    return "Zap request doesn't have a 'p' tag.";
  if (!p[1].match(/^[a-f0-9]{64}$/))
    return "Zap request 'p' tag is not valid hex.";
  let e = zapRequest.tags.find(([t, v]) => t === "e" && v);
  if (e && !e[1].match(/^[a-f0-9]{64}$/))
    return "Zap request 'e' tag is not valid hex.";
  let relays = zapRequest.tags.find(([t, v]) => t === "relays" && v);
  if (!relays)
    return "Zap request doesn't have a 'relays' tag.";
  return null;
}
function makeZapReceipt2({
  zapRequest,
  preimage,
  bolt11,
  paidAt
}) {
  let zr = JSON.parse(zapRequest);
  let tagsFromZapRequest = zr.tags.filter(([t]) => t === "e" || t === "p" || t === "a");
  let zap = {
    kind: 9735,
    created_at: Math.round(paidAt.getTime() / 1e3),
    content: "",
    tags: [...tagsFromZapRequest, ["P", zr.pubkey], ["bolt11", bolt11], ["description", zapRequest]]
  };
  if (preimage) {
    zap.tags.push(["preimage", preimage]);
  }
  return zap;
}
var nip98_exports2 = {};
__export3(nip98_exports2, {
  getToken: () => getToken2,
  hashPayload: () => hashPayload,
  unpackEventFromToken: () => unpackEventFromToken2,
  validateEvent: () => validateEvent22,
  validateEventKind: () => validateEventKind,
  validateEventMethodTag: () => validateEventMethodTag,
  validateEventPayloadTag: () => validateEventPayloadTag,
  validateEventTimestamp: () => validateEventTimestamp,
  validateEventUrlTag: () => validateEventUrlTag,
  validateToken: () => validateToken2
});
var _authorizationScheme2 = "Nostr ";
async function getToken2(loginUrl, httpMethod, sign, includeAuthorizationScheme = false, payload) {
  const event = {
    kind: HTTPAuth,
    tags: [
      ["u", loginUrl],
      ["method", httpMethod]
    ],
    created_at: Math.round(new Date().getTime() / 1e3),
    content: ""
  };
  if (payload) {
    event.tags.push(["payload", hashPayload(payload)]);
  }
  const signedEvent = await sign(event);
  const authorizationScheme = includeAuthorizationScheme ? _authorizationScheme2 : "";
  return authorizationScheme + base643.encode(utf8Encoder2.encode(JSON.stringify(signedEvent)));
}
async function validateToken2(token, url, method) {
  const event = await unpackEventFromToken2(token).catch((error) => {
    throw error;
  });
  const valid = await validateEvent22(event, url, method).catch((error) => {
    throw error;
  });
  return valid;
}
async function unpackEventFromToken2(token) {
  if (!token) {
    throw new Error("Missing token");
  }
  token = token.replace(_authorizationScheme2, "");
  const eventB64 = utf8Decoder2.decode(base643.decode(token));
  if (!eventB64 || eventB64.length === 0 || !eventB64.startsWith("{")) {
    throw new Error("Invalid token");
  }
  const event = JSON.parse(eventB64);
  return event;
}
function validateEventTimestamp(event) {
  if (!event.created_at) {
    return false;
  }
  return Math.round(new Date().getTime() / 1e3) - event.created_at < 60;
}
function validateEventKind(event) {
  return event.kind === HTTPAuth;
}
function validateEventUrlTag(event, url) {
  const urlTag = event.tags.find((t) => t[0] === "u");
  if (!urlTag) {
    return false;
  }
  return urlTag.length > 0 && urlTag[1] === url;
}
function validateEventMethodTag(event, method) {
  const methodTag = event.tags.find((t) => t[0] === "method");
  if (!methodTag) {
    return false;
  }
  return methodTag.length > 0 && methodTag[1].toLowerCase() === method.toLowerCase();
}
function hashPayload(payload) {
  const hash8 = sha2565(utf8Encoder2.encode(JSON.stringify(payload)));
  return bytesToHex5(hash8);
}
function validateEventPayloadTag(event, payload) {
  const payloadTag = event.tags.find((t) => t[0] === "payload");
  if (!payloadTag) {
    return false;
  }
  const payloadHash = hashPayload(payload);
  return payloadTag.length > 0 && payloadTag[1] === payloadHash;
}
async function validateEvent22(event, url, method, body) {
  if (!verifyEvent(event)) {
    throw new Error("Invalid nostr event, signature invalid");
  }
  if (!validateEventKind(event)) {
    throw new Error("Invalid nostr event, kind invalid");
  }
  if (!validateEventTimestamp(event)) {
    throw new Error("Invalid nostr event, created_at timestamp invalid");
  }
  if (!validateEventUrlTag(event, url)) {
    throw new Error("Invalid nostr event, url tag invalid");
  }
  if (!validateEventMethodTag(event, method)) {
    throw new Error("Invalid nostr event, method tag invalid");
  }
  if (Boolean(body) && typeof body === "object" && Object.keys(body).length > 0) {
    if (!validateEventPayloadTag(event, body)) {
      throw new Error("Invalid nostr event, payload tag does not match request body hash");
    }
  }
  return true;
}

// node_modules/svelte/src/runtime/internal/utils.js
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    for (const callback of callbacks) {
      callback(void 0);
    }
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
  let value;
  subscribe(store, (_) => value = _)();
  return value;
}

// node_modules/svelte/src/runtime/internal/globals.js
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : (
  // @ts-ignore Node typings have this
  global
);

// node_modules/svelte/src/runtime/internal/ResizeObserverSingleton.js
var ResizeObserverSingleton = class {
  /**
   * @private
   * @readonly
   * @type {WeakMap<Element, import('./private.js').Listener>}
   */
  _listeners = "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0;
  /**
   * @private
   * @type {ResizeObserver}
   */
  _observer = void 0;
  /** @type {ResizeObserverOptions} */
  options;
  /** @param {ResizeObserverOptions} options */
  constructor(options) {
    this.options = options;
  }
  /**
   * @param {Element} element
   * @param {import('./private.js').Listener} listener
   * @returns {() => void}
   */
  observe(element2, listener) {
    this._listeners.set(element2, listener);
    this._getObserver().observe(element2, this.options);
    return () => {
      this._listeners.delete(element2);
      this._observer.unobserve(element2);
    };
  }
  /**
   * @private
   */
  _getObserver() {
    var _a2;
    return (_a2 = this._observer) != null ? _a2 : this._observer = new ResizeObserver((entries) => {
      var _a3;
      for (const entry of entries) {
        ResizeObserverSingleton.entries.set(entry.target, entry);
        (_a3 = this._listeners.get(entry.target)) == null ? void 0 : _a3(entry);
      }
    });
  }
};
ResizeObserverSingleton.entries = "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0;

// node_modules/svelte/src/runtime/internal/dom.js
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function element(name) {
  return document.createElement(name);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function get_custom_elements_slots(element2) {
  const result = {};
  element2.childNodes.forEach(
    /** @param {Element} node */
    (node) => {
      result[node.slot || "default"] = true;
    }
  );
  return result;
}

// node_modules/svelte/src/shared/boolean_attributes.js
var _boolean_attributes = (
  /** @type {const} */
  [
    "allowfullscreen",
    "allowpaymentrequest",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "hidden",
    "inert",
    "ismap",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected"
  ]
);
var boolean_attributes = /* @__PURE__ */ new Set([..._boolean_attributes]);

// node_modules/svelte/src/runtime/internal/Component.js
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    /** The Svelte component constructor */
    $$ctor;
    /** Slots */
    $$s;
    /** The Svelte component instance */
    $$c;
    /** Whether or not the custom element is connected */
    $$cn = false;
    /** Component props data */
    $$d = {};
    /** `true` if currently in the process of reflecting component props back to attributes */
    $$r = false;
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    $$p_d = {};
    /** @type {Record<string, Function[]>} Event listeners */
    $$l = {};
    /** @type {Map<Function, Function>} Event listener unsubscribe functions */
    $$l_u = /* @__PURE__ */ new Map();
    constructor($$componentCtor, $$slots, use_shadow_dom) {
      super();
      this.$$ctor = $$componentCtor;
      this.$$s = $$slots;
      if (use_shadow_dom) {
        this.attachShadow({ mode: "open" });
      }
    }
    addEventListener(type2, listener, options) {
      this.$$l[type2] = this.$$l[type2] || [];
      this.$$l[type2].push(listener);
      if (this.$$c) {
        const unsub = this.$$c.$on(type2, listener);
        this.$$l_u.set(listener, unsub);
      }
      super.addEventListener(type2, listener, options);
    }
    removeEventListener(type2, listener, options) {
      super.removeEventListener(type2, listener, options);
      if (this.$$c) {
        const unsub = this.$$l_u.get(listener);
        if (unsub) {
          unsub();
          this.$$l_u.delete(listener);
        }
      }
    }
    async connectedCallback() {
      this.$$cn = true;
      if (!this.$$c) {
        let create_slot = function(name) {
          return () => {
            let node;
            const obj = {
              c: function create() {
                node = element("slot");
                if (name !== "default") {
                  attr(node, "name", name);
                }
              },
              /**
               * @param {HTMLElement} target
               * @param {HTMLElement} [anchor]
               */
              m: function mount(target, anchor) {
                insert(target, node, anchor);
              },
              d: function destroy(detaching) {
                if (detaching) {
                  detach(node);
                }
              }
            };
            return obj;
          };
        };
        await Promise.resolve();
        if (!this.$$cn) {
          return;
        }
        const $$slots = {};
        const existing_slots = get_custom_elements_slots(this);
        for (const name of this.$$s) {
          if (name in existing_slots) {
            $$slots[name] = [create_slot(name)];
          }
        }
        for (const attribute of this.attributes) {
          const name = this.$$g_p(attribute.name);
          if (!(name in this.$$d)) {
            this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, "toProp");
          }
        }
        for (const key in this.$$p_d) {
          if (!(key in this.$$d) && this[key] !== void 0) {
            this.$$d[key] = this[key];
            delete this[key];
          }
        }
        this.$$c = new this.$$ctor({
          target: this.shadowRoot || this,
          props: {
            ...this.$$d,
            $$slots,
            $$scope: {
              ctx: []
            }
          }
        });
        const reflect_attributes = () => {
          this.$$r = true;
          for (const key in this.$$p_d) {
            this.$$d[key] = this.$$c.$$.ctx[this.$$c.$$.props[key]];
            if (this.$$p_d[key].reflect) {
              const attribute_value = get_custom_element_value(
                key,
                this.$$d[key],
                this.$$p_d,
                "toAttribute"
              );
              if (attribute_value == null) {
                this.removeAttribute(this.$$p_d[key].attribute || key);
              } else {
                this.setAttribute(this.$$p_d[key].attribute || key, attribute_value);
              }
            }
          }
          this.$$r = false;
        };
        this.$$c.$$.after_update.push(reflect_attributes);
        reflect_attributes();
        for (const type2 in this.$$l) {
          for (const listener of this.$$l[type2]) {
            const unsub = this.$$c.$on(type2, listener);
            this.$$l_u.set(listener, unsub);
          }
        }
        this.$$l = {};
      }
    }
    // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
    // and setting attributes through setAttribute etc, this is helpful
    attributeChangedCallback(attr2, _oldValue, newValue) {
      var _a2;
      if (this.$$r)
        return;
      attr2 = this.$$g_p(attr2);
      this.$$d[attr2] = get_custom_element_value(attr2, newValue, this.$$p_d, "toProp");
      (_a2 = this.$$c) == null ? void 0 : _a2.$set({ [attr2]: this.$$d[attr2] });
    }
    disconnectedCallback() {
      this.$$cn = false;
      Promise.resolve().then(() => {
        if (!this.$$cn) {
          this.$$c.$destroy();
          this.$$c = void 0;
        }
      });
    }
    $$g_p(attribute_name) {
      return Object.keys(this.$$p_d).find(
        (key) => this.$$p_d[key].attribute === attribute_name || !this.$$p_d[key].attribute && key.toLowerCase() === attribute_name
      ) || attribute_name;
    }
  };
}
function get_custom_element_value(prop, value, props_definition, transform) {
  var _a2;
  const type2 = (_a2 = props_definition[prop]) == null ? void 0 : _a2.type;
  value = type2 === "Boolean" && typeof value !== "boolean" ? value != null : value;
  if (!transform || !props_definition[prop]) {
    return value;
  } else if (transform === "toAttribute") {
    switch (type2) {
      case "Object":
      case "Array":
        return value == null ? null : JSON.stringify(value);
      case "Boolean":
        return value ? "" : null;
      case "Number":
        return value == null ? null : value;
      default:
        return value;
    }
  } else {
    switch (type2) {
      case "Object":
      case "Array":
        return value && JSON.parse(value);
      case "Boolean":
        return value;
      case "Number":
        return value != null ? +value : value;
      default:
        return value;
    }
  }
}

// node_modules/svelte/src/runtime/store/index.js
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i2 = 0; i2 < subscriber_queue.length; i2 += 2) {
            subscriber_queue[i2][0](subscriber_queue[i2 + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set, update) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}

// node_modules/@nostr-dev-kit/ndk-svelte/dist/index.mjs
var NDKSvelte = class extends NDK {
  constructor(opts) {
    super(opts);
  }
  createEventStore(filters) {
    const store = writable([]);
    return {
      refCount: 0,
      filters,
      subscription: void 0,
      set: store.set,
      update: store.update,
      subscribe: store.subscribe,
      unsubscribe: () => {
      },
      onEose: (cb) => {
      },
      startSubscription: () => {
        throw new Error("not implemented");
      },
      ref: () => {
        throw new Error("not implemented");
      },
      unref: () => {
        throw new Error("not implemented");
      },
      empty: () => {
        throw new Error("not implemented");
      },
      changeFilters: (filters2) => {
        throw new Error("not implemented");
      }
    };
  }
  eventIsRepost(event) {
    return [NDKKind.Repost, NDKKind.GenericRepost].includes(event.kind);
  }
  eventIsLabel(event) {
    return [NDKKind.Label].includes(event.kind);
  }
  storeSubscribe(filters, opts, klass) {
    var _a2;
    let eventIds = /* @__PURE__ */ new Set();
    let events = [];
    const store = this.createEventStore(
      Array.isArray(filters) ? filters : [filters]
    );
    const autoStart = (_a2 = opts == null ? void 0 : opts.autoStart) != null ? _a2 : true;
    const relaySet = opts == null ? void 0 : opts.relaySet;
    const handleEventLabel = (event) => {
      console.log(`handle event label`, event.rawEvent());
      handleEventReposts(event);
    };
    const handleEventReposts = (event) => {
      const _repostEvent = NDKRepost.from(event);
      _repostEvent.ndk = this;
      const addRepostToExistingEvent = (repostedEvent) => {
        if (repostedEvent.repostedByEvents) {
          repostedEvent.repostedByEvents.push(event);
        } else {
          repostedEvent.repostedByEvents = [event];
        }
        store.set(events);
      };
      for (const repostedEventId of _repostEvent.repostedEventIds()) {
        const repostedEvent = events.find((e) => e.id === repostedEventId);
        if (repostedEvent) {
          addRepostToExistingEvent(repostedEvent);
        } else {
          _repostEvent.repostedEvents(klass).then((fetchedEvents) => {
            for (const e of fetchedEvents) {
              if (e instanceof NDKEvent) {
                handleEvent(e);
              }
            }
          });
        }
      }
    };
    const handleEvent = (event) => {
      if (store.filters && this.eventIsRepost(event)) {
        handleEventReposts(event);
        return;
      }
      if (this.eventIsLabel(event)) {
        handleEventLabel(event);
        return;
      }
      let e = event;
      if (klass) {
        e = klass.from(event);
        e.relay = event.relay;
      }
      e.ndk = this;
      const dedupKey = event.deduplicationKey();
      if (eventIds.has(dedupKey)) {
        const prevEvent = events.find((e2) => e2.deduplicationKey() === dedupKey);
        if (prevEvent && prevEvent.created_at < event.created_at) {
          const index2 = events.findIndex((e2) => e2.deduplicationKey() === dedupKey);
          events.splice(index2, 1);
        } else {
          return;
        }
      }
      eventIds.add(dedupKey);
      const index = events.findIndex((e2) => e2.created_at < event.created_at);
      if (index === -1) {
        events.push(e);
      } else {
        events.splice(index === -1 ? events.length : index, 0, e);
      }
      store.set(events);
    };
    store.ref = () => {
      store.refCount++;
      if (store.refCount === 1) {
        store.startSubscription();
      }
      return store.refCount;
    };
    store.unref = () => {
      if (--store.refCount !== 0)
        return store.refCount;
      if (opts == null ? void 0 : opts.unrefUnsubscribeTimeout) {
        setTimeout(() => {
          if (store.refCount === 0) {
            store.unsubscribe();
          }
        }, opts.unrefUnsubscribeTimeout);
      } else {
        store.unsubscribe();
      }
      return store.refCount;
    };
    store.empty = () => {
      store.set([]);
      events = [];
      eventIds = /* @__PURE__ */ new Set();
      store.unsubscribe();
    };
    store.changeFilters = (filters2) => {
      store.filters = filters2;
      store.empty();
      if (store.refCount > 0)
        store.startSubscription();
    };
    store.startSubscription = () => {
      if (!store.filters) {
        throw new Error("no filters");
      }
      const filters2 = store.filters;
      if (opts == null ? void 0 : opts.repostsFilters) {
        filters2.push(...opts.repostsFilters);
      }
      store.subscription = this.subscribe(filters2, opts, relaySet);
      store.subscription.on("event", (event, relay) => {
        handleEvent(event);
      });
      store.unsubscribe = () => {
        var _a3;
        (_a3 = store.subscription) == null ? void 0 : _a3.stop();
        store.subscription = void 0;
      };
      store.onEose = (cb) => {
        var _a3;
        (_a3 = store.subscription) == null ? void 0 : _a3.on("eose", cb);
      };
    };
    if (autoStart) {
      store.startSubscription();
    }
    return store;
  }
};
var src_default = NDKSvelte;

// node_modules/@nostr-dev-kit/ndk-cache-dexie/dist/index.mjs
var import_debug4 = __toESM(require_src(), 1);

// node_modules/@nostr-dev-kit/ndk-cache-dexie/node_modules/@noble/hashes/esm/cryptoNode.js
var nc6 = __toESM(require("crypto"), 1);
var crypto7 = nc6 && typeof nc6 === "object" && "webcrypto" in nc6 ? nc6.webcrypto : void 0;

// node_modules/@nostr-dev-kit/ndk-cache-dexie/node_modules/@noble/hashes/esm/utils.js
var u8a9 = (a) => a instanceof Uint8Array;
var createView7 = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
var rotr6 = (word, shift) => word << 32 - shift | word >>> shift;
var isLE7 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!isLE7)
  throw new Error("Non little-endian hardware is not supported");
var hexes7 = Array.from({ length: 256 }, (v, i2) => i2.toString(16).padStart(2, "0"));
function bytesToHex6(bytes8) {
  if (!u8a9(bytes8))
    throw new Error("Uint8Array expected");
  let hex5 = "";
  for (let i2 = 0; i2 < bytes8.length; i2++) {
    hex5 += hexes7[bytes8[i2]];
  }
  return hex5;
}
function hexToBytes6(hex5) {
  if (typeof hex5 !== "string")
    throw new Error("hex string expected, got " + typeof hex5);
  const len = hex5.length;
  if (len % 2)
    throw new Error("padded hex string expected, got unpadded hex of length " + len);
  const array = new Uint8Array(len / 2);
  for (let i2 = 0; i2 < array.length; i2++) {
    const j = i2 * 2;
    const hexByte = hex5.slice(j, j + 2);
    const byte = Number.parseInt(hexByte, 16);
    if (Number.isNaN(byte) || byte < 0)
      throw new Error("Invalid byte sequence");
    array[i2] = byte;
  }
  return array;
}
function utf8ToBytes9(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes7(data) {
  if (typeof data === "string")
    data = utf8ToBytes9(data);
  if (!u8a9(data))
    throw new Error(`expected Uint8Array, got ${typeof data}`);
  return data;
}
function concatBytes8(...arrays) {
  const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
  let pad2 = 0;
  arrays.forEach((a) => {
    if (!u8a9(a))
      throw new Error("Uint8Array expected");
    r.set(a, pad2);
    pad2 += a.length;
  });
  return r;
}
var Hash6 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function wrapConstructor6(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes7(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function randomBytes6(bytesLength = 32) {
  if (crypto7 && typeof crypto7.getRandomValues === "function") {
    return crypto7.getRandomValues(new Uint8Array(bytesLength));
  }
  throw new Error("crypto.getRandomValues must be defined");
}

// node_modules/@nostr-dev-kit/ndk-cache-dexie/node_modules/@noble/hashes/esm/_assert.js
function number7(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error(`Wrong positive integer: ${n}`);
}
function bool6(b) {
  if (typeof b !== "boolean")
    throw new Error(`Expected boolean, not ${b}`);
}
function bytes7(b, ...lengths) {
  if (!(b instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
function hash7(hash8) {
  if (typeof hash8 !== "function" || typeof hash8.create !== "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  number7(hash8.outputLen);
  number7(hash8.blockLen);
}
function exists7(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function output7(out, instance) {
  bytes7(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error(`digestInto() expects output buffer of length at least ${min}`);
  }
}
var assert6 = {
  number: number7,
  bool: bool6,
  bytes: bytes7,
  hash: hash7,
  exists: exists7,
  output: output7
};
var assert_default6 = assert6;

// node_modules/@nostr-dev-kit/ndk-cache-dexie/node_modules/@noble/hashes/esm/_sha2.js
function setBigUint647(view, byteOffset, value, isLE8) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE8);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE8 ? 4 : 0;
  const l = isLE8 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE8);
  view.setUint32(byteOffset + l, wl, isLE8);
}
var SHA26 = class extends Hash6 {
  constructor(blockLen, outputLen, padOffset, isLE8) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE8;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView7(this.buffer);
  }
  update(data) {
    assert_default6.exists(this);
    const { view, buffer, blockLen } = this;
    data = toBytes7(data);
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView7(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    assert_default6.exists(this);
    assert_default6.output(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE8 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    this.buffer.subarray(pos).fill(0);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i2 = pos; i2 < blockLen; i2++)
      buffer[i2] = 0;
    setBigUint647(view, blockLen - 8, BigInt(this.length * 8), isLE8);
    this.process(view, 0);
    const oview = createView7(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i2 = 0; i2 < outLen; i2++)
      oview.setUint32(4 * i2, state[i2], isLE8);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.length = length;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
};

// node_modules/@nostr-dev-kit/ndk-cache-dexie/node_modules/@noble/hashes/esm/sha256.js
var Chi6 = (a, b, c) => a & b ^ ~a & c;
var Maj6 = (a, b, c) => a & b ^ a & c ^ b & c;
var SHA256_K6 = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var IV6 = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA256_W6 = new Uint32Array(64);
var SHA2566 = class extends SHA26 {
  constructor() {
    super(64, 32, 8, false);
    this.A = IV6[0] | 0;
    this.B = IV6[1] | 0;
    this.C = IV6[2] | 0;
    this.D = IV6[3] | 0;
    this.E = IV6[4] | 0;
    this.F = IV6[5] | 0;
    this.G = IV6[6] | 0;
    this.H = IV6[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4)
      SHA256_W6[i2] = view.getUint32(offset, false);
    for (let i2 = 16; i2 < 64; i2++) {
      const W15 = SHA256_W6[i2 - 15];
      const W2 = SHA256_W6[i2 - 2];
      const s0 = rotr6(W15, 7) ^ rotr6(W15, 18) ^ W15 >>> 3;
      const s1 = rotr6(W2, 17) ^ rotr6(W2, 19) ^ W2 >>> 10;
      SHA256_W6[i2] = s1 + SHA256_W6[i2 - 7] + s0 + SHA256_W6[i2 - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i2 = 0; i2 < 64; i2++) {
      const sigma1 = rotr6(E, 6) ^ rotr6(E, 11) ^ rotr6(E, 25);
      const T1 = H + sigma1 + Chi6(E, F, G) + SHA256_K6[i2] + SHA256_W6[i2] | 0;
      const sigma0 = rotr6(A, 2) ^ rotr6(A, 13) ^ rotr6(A, 22);
      const T2 = sigma0 + Maj6(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    SHA256_W6.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
};
var SHA2244 = class extends SHA2566 {
  constructor() {
    super();
    this.A = 3238371032 | 0;
    this.B = 914150663 | 0;
    this.C = 812702999 | 0;
    this.D = 4144912697 | 0;
    this.E = 4290775857 | 0;
    this.F = 1750603025 | 0;
    this.G = 1694076839 | 0;
    this.H = 3204075428 | 0;
    this.outputLen = 28;
  }
};
var sha2566 = wrapConstructor6(() => new SHA2566());
var sha2244 = wrapConstructor6(() => new SHA2244());

// node_modules/@nostr-dev-kit/ndk-cache-dexie/node_modules/@scure/base/lib/esm/index.js
function assertNumber4(n) {
  if (!Number.isSafeInteger(n))
    throw new Error(`Wrong integer: ${n}`);
}
function chain4(...args) {
  const wrap2 = (a, b) => (c) => a(b(c));
  const encode2 = Array.from(args).reverse().reduce((acc, i2) => acc ? wrap2(acc, i2.encode) : i2.encode, void 0);
  const decode5 = args.reduce((acc, i2) => acc ? wrap2(acc, i2.decode) : i2.decode, void 0);
  return { encode: encode2, decode: decode5 };
}
function alphabet4(alphabet5) {
  return {
    encode: (digits) => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
        throw new Error("alphabet.encode input should be an array of numbers");
      return digits.map((i2) => {
        assertNumber4(i2);
        if (i2 < 0 || i2 >= alphabet5.length)
          throw new Error(`Digit index outside alphabet: ${i2} (alphabet: ${alphabet5.length})`);
        return alphabet5[i2];
      });
    },
    decode: (input) => {
      if (!Array.isArray(input) || input.length && typeof input[0] !== "string")
        throw new Error("alphabet.decode input should be array of strings");
      return input.map((letter) => {
        if (typeof letter !== "string")
          throw new Error(`alphabet.decode: not string element=${letter}`);
        const index = alphabet5.indexOf(letter);
        if (index === -1)
          throw new Error(`Unknown letter: "${letter}". Allowed: ${alphabet5}`);
        return index;
      });
    }
  };
}
function join4(separator = "") {
  if (typeof separator !== "string")
    throw new Error("join separator should be string");
  return {
    encode: (from) => {
      if (!Array.isArray(from) || from.length && typeof from[0] !== "string")
        throw new Error("join.encode input should be array of strings");
      for (let i2 of from)
        if (typeof i2 !== "string")
          throw new Error(`join.encode: non-string input=${i2}`);
      return from.join(separator);
    },
    decode: (to) => {
      if (typeof to !== "string")
        throw new Error("join.decode input should be string");
      return to.split(separator);
    }
  };
}
function padding4(bits, chr = "=") {
  assertNumber4(bits);
  if (typeof chr !== "string")
    throw new Error("padding chr should be string");
  return {
    encode(data) {
      if (!Array.isArray(data) || data.length && typeof data[0] !== "string")
        throw new Error("padding.encode input should be array of strings");
      for (let i2 of data)
        if (typeof i2 !== "string")
          throw new Error(`padding.encode: non-string input=${i2}`);
      while (data.length * bits % 8)
        data.push(chr);
      return data;
    },
    decode(input) {
      if (!Array.isArray(input) || input.length && typeof input[0] !== "string")
        throw new Error("padding.encode input should be array of strings");
      for (let i2 of input)
        if (typeof i2 !== "string")
          throw new Error(`padding.decode: non-string input=${i2}`);
      let end = input.length;
      if (end * bits % 8)
        throw new Error("Invalid padding: string should have whole number of bytes");
      for (; end > 0 && input[end - 1] === chr; end--) {
        if (!((end - 1) * bits % 8))
          throw new Error("Invalid padding: string has too much padding");
      }
      return input.slice(0, end);
    }
  };
}
function normalize5(fn) {
  if (typeof fn !== "function")
    throw new Error("normalize fn should be function");
  return { encode: (from) => from, decode: (to) => fn(to) };
}
function convertRadix5(data, from, to) {
  if (from < 2)
    throw new Error(`convertRadix: wrong from=${from}, base cannot be less than 2`);
  if (to < 2)
    throw new Error(`convertRadix: wrong to=${to}, base cannot be less than 2`);
  if (!Array.isArray(data))
    throw new Error("convertRadix: data should be array");
  if (!data.length)
    return [];
  let pos = 0;
  const res = [];
  const digits = Array.from(data);
  digits.forEach((d) => {
    assertNumber4(d);
    if (d < 0 || d >= from)
      throw new Error(`Wrong integer: ${d}`);
  });
  while (true) {
    let carry = 0;
    let done = true;
    for (let i2 = pos; i2 < digits.length; i2++) {
      const digit = digits[i2];
      const digitBase = from * carry + digit;
      if (!Number.isSafeInteger(digitBase) || from * carry / from !== carry || digitBase - digit !== from * carry) {
        throw new Error("convertRadix: carry overflow");
      }
      carry = digitBase % to;
      digits[i2] = Math.floor(digitBase / to);
      if (!Number.isSafeInteger(digits[i2]) || digits[i2] * to + carry !== digitBase)
        throw new Error("convertRadix: carry overflow");
      if (!done)
        continue;
      else if (!digits[i2])
        pos = i2;
      else
        done = false;
    }
    res.push(carry);
    if (done)
      break;
  }
  for (let i2 = 0; i2 < data.length - 1 && data[i2] === 0; i2++)
    res.push(0);
  return res.reverse();
}
var gcd4 = (a, b) => !b ? a : gcd4(b, a % b);
var radix2carry4 = (from, to) => from + (to - gcd4(from, to));
function convertRadix24(data, from, to, padding5) {
  if (!Array.isArray(data))
    throw new Error("convertRadix2: data should be array");
  if (from <= 0 || from > 32)
    throw new Error(`convertRadix2: wrong from=${from}`);
  if (to <= 0 || to > 32)
    throw new Error(`convertRadix2: wrong to=${to}`);
  if (radix2carry4(from, to) > 32) {
    throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${radix2carry4(from, to)}`);
  }
  let carry = 0;
  let pos = 0;
  const mask = 2 ** to - 1;
  const res = [];
  for (const n of data) {
    assertNumber4(n);
    if (n >= 2 ** from)
      throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
    carry = carry << from | n;
    if (pos + from > 32)
      throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
    pos += from;
    for (; pos >= to; pos -= to)
      res.push((carry >> pos - to & mask) >>> 0);
    carry &= 2 ** pos - 1;
  }
  carry = carry << to - pos & mask;
  if (!padding5 && pos >= from)
    throw new Error("Excess padding");
  if (!padding5 && carry)
    throw new Error(`Non-zero padding: ${carry}`);
  if (padding5 && pos > 0)
    res.push(carry >>> 0);
  return res;
}
function radix5(num) {
  assertNumber4(num);
  return {
    encode: (bytes8) => {
      if (!(bytes8 instanceof Uint8Array))
        throw new Error("radix.encode input should be Uint8Array");
      return convertRadix5(Array.from(bytes8), 2 ** 8, num);
    },
    decode: (digits) => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
        throw new Error("radix.decode input should be array of strings");
      return Uint8Array.from(convertRadix5(digits, num, 2 ** 8));
    }
  };
}
function radix24(bits, revPadding = false) {
  assertNumber4(bits);
  if (bits <= 0 || bits > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (radix2carry4(8, bits) > 32 || radix2carry4(bits, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (bytes8) => {
      if (!(bytes8 instanceof Uint8Array))
        throw new Error("radix2.encode input should be Uint8Array");
      return convertRadix24(Array.from(bytes8), 8, bits, !revPadding);
    },
    decode: (digits) => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
        throw new Error("radix2.decode input should be array of strings");
      return Uint8Array.from(convertRadix24(digits, bits, 8, revPadding));
    }
  };
}
function unsafeWrapper3(fn) {
  if (typeof fn !== "function")
    throw new Error("unsafeWrapper fn should be function");
  return function(...args) {
    try {
      return fn.apply(null, args);
    } catch (e) {
    }
  };
}
var base164 = chain4(radix24(4), alphabet4("0123456789ABCDEF"), join4(""));
var base324 = chain4(radix24(5), alphabet4("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), padding4(5), join4(""));
var base32hex4 = chain4(radix24(5), alphabet4("0123456789ABCDEFGHIJKLMNOPQRSTUV"), padding4(5), join4(""));
var base32crockford4 = chain4(radix24(5), alphabet4("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), join4(""), normalize5((s) => s.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
var base644 = chain4(radix24(6), alphabet4("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), padding4(6), join4(""));
var base64url4 = chain4(radix24(6), alphabet4("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), padding4(6), join4(""));
var genBase584 = (abc) => chain4(radix5(58), alphabet4(abc), join4(""));
var base584 = genBase584("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
var base58flickr3 = genBase584("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ");
var base58xrp3 = genBase584("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
var XMR_BLOCK_LEN3 = [0, 2, 3, 5, 6, 7, 9, 10, 11];
var base58xmr3 = {
  encode(data) {
    let res = "";
    for (let i2 = 0; i2 < data.length; i2 += 8) {
      const block = data.subarray(i2, i2 + 8);
      res += base584.encode(block).padStart(XMR_BLOCK_LEN3[block.length], "1");
    }
    return res;
  },
  decode(str) {
    let res = [];
    for (let i2 = 0; i2 < str.length; i2 += 11) {
      const slice2 = str.slice(i2, i2 + 11);
      const blockLen = XMR_BLOCK_LEN3.indexOf(slice2.length);
      const block = base584.decode(slice2);
      for (let j = 0; j < block.length - blockLen; j++) {
        if (block[j] !== 0)
          throw new Error("base58xmr: wrong padding");
      }
      res = res.concat(Array.from(block.slice(block.length - blockLen)));
    }
    return Uint8Array.from(res);
  }
};
var BECH_ALPHABET4 = chain4(alphabet4("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), join4(""));
var POLYMOD_GENERATORS3 = [996825010, 642813549, 513874426, 1027748829, 705979059];
function bech32Polymod3(pre) {
  const b = pre >> 25;
  let chk = (pre & 33554431) << 5;
  for (let i2 = 0; i2 < POLYMOD_GENERATORS3.length; i2++) {
    if ((b >> i2 & 1) === 1)
      chk ^= POLYMOD_GENERATORS3[i2];
  }
  return chk;
}
function bechChecksum3(prefix, words, encodingConst = 1) {
  const len = prefix.length;
  let chk = 1;
  for (let i2 = 0; i2 < len; i2++) {
    const c = prefix.charCodeAt(i2);
    if (c < 33 || c > 126)
      throw new Error(`Invalid prefix (${prefix})`);
    chk = bech32Polymod3(chk) ^ c >> 5;
  }
  chk = bech32Polymod3(chk);
  for (let i2 = 0; i2 < len; i2++)
    chk = bech32Polymod3(chk) ^ prefix.charCodeAt(i2) & 31;
  for (let v of words)
    chk = bech32Polymod3(chk) ^ v;
  for (let i2 = 0; i2 < 6; i2++)
    chk = bech32Polymod3(chk);
  chk ^= encodingConst;
  return BECH_ALPHABET4.encode(convertRadix24([chk % 2 ** 30], 30, 5, false));
}
function genBech323(encoding) {
  const ENCODING_CONST = encoding === "bech32" ? 1 : 734539939;
  const _words = radix24(5);
  const fromWords = _words.decode;
  const toWords = _words.encode;
  const fromWordsUnsafe = unsafeWrapper3(fromWords);
  function encode2(prefix, words, limit = 90) {
    if (typeof prefix !== "string")
      throw new Error(`bech32.encode prefix should be string, not ${typeof prefix}`);
    if (!Array.isArray(words) || words.length && typeof words[0] !== "number")
      throw new Error(`bech32.encode words should be array of numbers, not ${typeof words}`);
    const actualLength = prefix.length + 7 + words.length;
    if (limit !== false && actualLength > limit)
      throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
    prefix = prefix.toLowerCase();
    return `${prefix}1${BECH_ALPHABET4.encode(words)}${bechChecksum3(prefix, words, ENCODING_CONST)}`;
  }
  function decode5(str, limit = 90) {
    if (typeof str !== "string")
      throw new Error(`bech32.decode input should be string, not ${typeof str}`);
    if (str.length < 8 || limit !== false && str.length > limit)
      throw new TypeError(`Wrong string length: ${str.length} (${str}). Expected (8..${limit})`);
    const lowered = str.toLowerCase();
    if (str !== lowered && str !== str.toUpperCase())
      throw new Error(`String must be lowercase or uppercase`);
    str = lowered;
    const sepIndex = str.lastIndexOf("1");
    if (sepIndex === 0 || sepIndex === -1)
      throw new Error(`Letter "1" must be present between prefix and data only`);
    const prefix = str.slice(0, sepIndex);
    const _words2 = str.slice(sepIndex + 1);
    if (_words2.length < 6)
      throw new Error("Data must be at least 6 characters long");
    const words = BECH_ALPHABET4.decode(_words2).slice(0, -6);
    const sum = bechChecksum3(prefix, words, ENCODING_CONST);
    if (!_words2.endsWith(sum))
      throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
    return { prefix, words };
  }
  const decodeUnsafe = unsafeWrapper3(decode5);
  function decodeToBytes(str) {
    const { prefix, words } = decode5(str, false);
    return { prefix, words, bytes: fromWords(words) };
  }
  return { encode: encode2, decode: decode5, decodeToBytes, decodeUnsafe, fromWords, fromWordsUnsafe, toWords };
}
var bech323 = genBech323("bech32");
var bech32m3 = genBech323("bech32m");
var utf83 = {
  encode: (data) => new TextDecoder().decode(data),
  decode: (str) => new TextEncoder().encode(str)
};
var hex4 = chain4(radix24(4), alphabet4("0123456789abcdef"), join4(""), normalize5((s) => {
  if (typeof s !== "string" || s.length % 2)
    throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
  return s.toLowerCase();
}));
var CODERS3 = {
  utf8: utf83,
  hex: hex4,
  base16: base164,
  base32: base324,
  base64: base644,
  base64url: base64url4,
  base58: base584,
  base58xmr: base58xmr3
};
var coderTypeError3 = `Invalid encoding type. Available types: ${Object.keys(CODERS3).join(", ")}`;

// node_modules/@nostr-dev-kit/ndk-cache-dexie/node_modules/@noble/hashes/esm/hmac.js
var HMAC6 = class extends Hash6 {
  constructor(hash8, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    assert_default6.hash(hash8);
    const key = toBytes7(_key);
    this.iHash = hash8.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad2 = new Uint8Array(blockLen);
    pad2.set(key.length > blockLen ? hash8.create().update(key).digest() : key);
    for (let i2 = 0; i2 < pad2.length; i2++)
      pad2[i2] ^= 54;
    this.iHash.update(pad2);
    this.oHash = hash8.create();
    for (let i2 = 0; i2 < pad2.length; i2++)
      pad2[i2] ^= 54 ^ 92;
    this.oHash.update(pad2);
    pad2.fill(0);
  }
  update(buf) {
    assert_default6.exists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    assert_default6.exists(this);
    assert_default6.bytes(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac6 = (hash8, key, message) => new HMAC6(hash8, key).update(message).digest();
hmac6.create = (hash8, key) => new HMAC6(hash8, key);

// node_modules/@nostr-dev-kit/ndk-cache-dexie/node_modules/@noble/hashes/esm/hkdf.js
function extract3(hash8, ikm, salt2) {
  assert_default6.hash(hash8);
  if (salt2 === void 0)
    salt2 = new Uint8Array(hash8.outputLen);
  return hmac6(hash8, toBytes7(salt2), toBytes7(ikm));
}
var HKDF_COUNTER3 = new Uint8Array([0]);
var EMPTY_BUFFER3 = new Uint8Array();
function expand3(hash8, prk, info, length = 32) {
  assert_default6.hash(hash8);
  assert_default6.number(length);
  if (length > 255 * hash8.outputLen)
    throw new Error("Length should be <= 255*HashLen");
  const blocks = Math.ceil(length / hash8.outputLen);
  if (info === void 0)
    info = EMPTY_BUFFER3;
  const okm = new Uint8Array(blocks * hash8.outputLen);
  const HMAC7 = hmac6.create(hash8, prk);
  const HMACTmp = HMAC7._cloneInto();
  const T = new Uint8Array(HMAC7.outputLen);
  for (let counter = 0; counter < blocks; counter++) {
    HKDF_COUNTER3[0] = counter + 1;
    HMACTmp.update(counter === 0 ? EMPTY_BUFFER3 : T).update(info).update(HKDF_COUNTER3).digestInto(T);
    okm.set(T, hash8.outputLen * counter);
    HMAC7._cloneInto(HMACTmp);
  }
  HMAC7.destroy();
  HMACTmp.destroy();
  T.fill(0);
  HKDF_COUNTER3.fill(0);
  return okm.slice(0, length);
}
var hkdf2 = (hash8, ikm, salt2, info, length) => expand3(hash8, extract3(hash8, ikm, salt2), info, length);

// node_modules/@nostr-dev-kit/ndk-cache-dexie/node_modules/nostr-tools/lib/esm/index.js
var __defProp4 = Object.defineProperty;
var __export4 = (target, all) => {
  for (var name in all)
    __defProp4(target, name, { get: all[name], enumerable: true });
};
function getPublicKey3(privateKey) {
  return bytesToHex6(schnorr.getPublicKey(privateKey));
}
var utils_exports5 = {};
__export4(utils_exports5, {
  MessageNode: () => MessageNode2,
  MessageQueue: () => MessageQueue2,
  insertEventIntoAscendingList: () => insertEventIntoAscendingList3,
  insertEventIntoDescendingList: () => insertEventIntoDescendingList3,
  normalizeURL: () => normalizeURL3,
  utf8Decoder: () => utf8Decoder3,
  utf8Encoder: () => utf8Encoder3
});
var utf8Decoder3 = new TextDecoder("utf-8");
var utf8Encoder3 = new TextEncoder();
function normalizeURL3(url) {
  let p = new URL(url);
  p.pathname = p.pathname.replace(/\/+/g, "/");
  if (p.pathname.endsWith("/"))
    p.pathname = p.pathname.slice(0, -1);
  if (p.port === "80" && p.protocol === "ws:" || p.port === "443" && p.protocol === "wss:")
    p.port = "";
  p.searchParams.sort();
  p.hash = "";
  return p.toString();
}
function insertEventIntoDescendingList3(sortedArray, event) {
  var _a2;
  let start = 0;
  let end = sortedArray.length - 1;
  let midPoint;
  let position = start;
  if (end < 0) {
    position = 0;
  } else if (event.created_at < sortedArray[end].created_at) {
    position = end + 1;
  } else if (event.created_at >= sortedArray[start].created_at) {
    position = start;
  } else
    while (true) {
      if (end <= start + 1) {
        position = end;
        break;
      }
      midPoint = Math.floor(start + (end - start) / 2);
      if (sortedArray[midPoint].created_at > event.created_at) {
        start = midPoint;
      } else if (sortedArray[midPoint].created_at < event.created_at) {
        end = midPoint;
      } else {
        position = midPoint;
        break;
      }
    }
  if (((_a2 = sortedArray[position]) == null ? void 0 : _a2.id) !== event.id) {
    return [...sortedArray.slice(0, position), event, ...sortedArray.slice(position)];
  }
  return sortedArray;
}
function insertEventIntoAscendingList3(sortedArray, event) {
  var _a2;
  let start = 0;
  let end = sortedArray.length - 1;
  let midPoint;
  let position = start;
  if (end < 0) {
    position = 0;
  } else if (event.created_at > sortedArray[end].created_at) {
    position = end + 1;
  } else if (event.created_at <= sortedArray[start].created_at) {
    position = start;
  } else
    while (true) {
      if (end <= start + 1) {
        position = end;
        break;
      }
      midPoint = Math.floor(start + (end - start) / 2);
      if (sortedArray[midPoint].created_at < event.created_at) {
        start = midPoint;
      } else if (sortedArray[midPoint].created_at > event.created_at) {
        end = midPoint;
      } else {
        position = midPoint;
        break;
      }
    }
  if (((_a2 = sortedArray[position]) == null ? void 0 : _a2.id) !== event.id) {
    return [...sortedArray.slice(0, position), event, ...sortedArray.slice(position)];
  }
  return sortedArray;
}
var MessageNode2 = class {
  _value;
  _next;
  get value() {
    return this._value;
  }
  set value(message) {
    this._value = message;
  }
  get next() {
    return this._next;
  }
  set next(node) {
    this._next = node;
  }
  constructor(message) {
    this._value = message;
    this._next = null;
  }
};
var MessageQueue2 = class {
  _first;
  _last;
  get first() {
    return this._first;
  }
  set first(messageNode) {
    this._first = messageNode;
  }
  get last() {
    return this._last;
  }
  set last(messageNode) {
    this._last = messageNode;
  }
  _size;
  get size() {
    return this._size;
  }
  set size(v) {
    this._size = v;
  }
  constructor() {
    this._first = null;
    this._last = null;
    this._size = 0;
  }
  enqueue(message) {
    const newNode = new MessageNode2(message);
    if (this._size === 0 || !this._last) {
      this._first = newNode;
      this._last = newNode;
    } else {
      this._last.next = newNode;
      this._last = newNode;
    }
    this._size++;
    return true;
  }
  dequeue() {
    if (this._size === 0 || !this._first)
      return null;
    let prev = this._first;
    this._first = prev.next;
    prev.next = null;
    this._size--;
    return prev.value;
  }
};
var verifiedSymbol3 = Symbol("verified");
function getBlankEvent2(kind = 255) {
  return {
    kind,
    content: "",
    tags: [],
    created_at: 0
  };
}
function finishEvent2(t, privateKey) {
  const event = t;
  event.pubkey = getPublicKey3(privateKey);
  event.id = getEventHash3(event);
  event.sig = getSignature2(event, privateKey);
  event[verifiedSymbol3] = true;
  return event;
}
function serializeEvent3(evt) {
  if (!validateEvent4(evt))
    throw new Error("can't serialize event with wrong or missing properties");
  return JSON.stringify([0, evt.pubkey, evt.created_at, evt.kind, evt.tags, evt.content]);
}
function getEventHash3(event) {
  let eventHash = sha2566(utf8Encoder3.encode(serializeEvent3(event)));
  return bytesToHex6(eventHash);
}
var isRecord3 = (obj) => obj instanceof Object;
function validateEvent4(event) {
  if (!isRecord3(event))
    return false;
  if (typeof event.kind !== "number")
    return false;
  if (typeof event.content !== "string")
    return false;
  if (typeof event.created_at !== "number")
    return false;
  if (typeof event.pubkey !== "string")
    return false;
  if (!event.pubkey.match(/^[a-f0-9]{64}$/))
    return false;
  if (!Array.isArray(event.tags))
    return false;
  for (let i2 = 0; i2 < event.tags.length; i2++) {
    let tag = event.tags[i2];
    if (!Array.isArray(tag))
      return false;
    for (let j = 0; j < tag.length; j++) {
      if (typeof tag[j] === "object")
        return false;
    }
  }
  return true;
}
function verifySignature2(event) {
  if (typeof event[verifiedSymbol3] === "boolean")
    return event[verifiedSymbol3];
  const hash8 = getEventHash3(event);
  if (hash8 !== event.id) {
    return event[verifiedSymbol3] = false;
  }
  try {
    return event[verifiedSymbol3] = schnorr.verify(event.sig, hash8, event.pubkey);
  } catch (err) {
    return event[verifiedSymbol3] = false;
  }
}
function getSignature2(event, key) {
  return bytesToHex6(schnorr.sign(getEventHash3(event), key));
}
function matchFilter2(filter, event) {
  if (filter.ids && filter.ids.indexOf(event.id) === -1) {
    if (!filter.ids.some((prefix) => event.id.startsWith(prefix))) {
      return false;
    }
  }
  if (filter.kinds && filter.kinds.indexOf(event.kind) === -1)
    return false;
  if (filter.authors && filter.authors.indexOf(event.pubkey) === -1) {
    if (!filter.authors.some((prefix) => event.pubkey.startsWith(prefix))) {
      return false;
    }
  }
  for (let f2 in filter) {
    if (f2[0] === "#") {
      let tagName = f2.slice(1);
      let values = filter[`#${tagName}`];
      if (values && !event.tags.find(([t, v]) => t === f2.slice(1) && values.indexOf(v) !== -1))
        return false;
    }
  }
  if (filter.since && event.created_at < filter.since)
    return false;
  if (filter.until && event.created_at > filter.until)
    return false;
  return true;
}
var fakejson_exports3 = {};
__export4(fakejson_exports3, {
  getHex64: () => getHex643,
  getInt: () => getInt3,
  getSubscriptionId: () => getSubscriptionId3,
  matchEventId: () => matchEventId3,
  matchEventKind: () => matchEventKind3,
  matchEventPubkey: () => matchEventPubkey3
});
function getHex643(json, field) {
  let len = field.length + 3;
  let idx = json.indexOf(`"${field}":`) + len;
  let s = json.slice(idx).indexOf(`"`) + idx + 1;
  return json.slice(s, s + 64);
}
function getInt3(json, field) {
  let len = field.length;
  let idx = json.indexOf(`"${field}":`) + len + 3;
  let sliced = json.slice(idx);
  let end = Math.min(sliced.indexOf(","), sliced.indexOf("}"));
  return parseInt(sliced.slice(0, end), 10);
}
function getSubscriptionId3(json) {
  let idx = json.slice(0, 22).indexOf(`"EVENT"`);
  if (idx === -1)
    return null;
  let pstart = json.slice(idx + 7 + 1).indexOf(`"`);
  if (pstart === -1)
    return null;
  let start = idx + 7 + 1 + pstart;
  let pend = json.slice(start + 1, 80).indexOf(`"`);
  if (pend === -1)
    return null;
  let end = start + 1 + pend;
  return json.slice(start + 1, end);
}
function matchEventId3(json, id) {
  return id === getHex643(json, "id");
}
function matchEventPubkey3(json, pubkey) {
  return pubkey === getHex643(json, "pubkey");
}
function matchEventKind3(json, kind) {
  return kind === getInt3(json, "kind");
}
var nip19_exports3 = {};
__export4(nip19_exports3, {
  BECH32_REGEX: () => BECH32_REGEX3,
  decode: () => decode4,
  naddrEncode: () => naddrEncode3,
  neventEncode: () => neventEncode3,
  noteEncode: () => noteEncode3,
  nprofileEncode: () => nprofileEncode3,
  npubEncode: () => npubEncode3,
  nrelayEncode: () => nrelayEncode3,
  nsecEncode: () => nsecEncode3
});
var Bech32MaxSize3 = 5e3;
var BECH32_REGEX3 = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function integerToUint8Array3(number8) {
  const uint8Array = new Uint8Array(4);
  uint8Array[0] = number8 >> 24 & 255;
  uint8Array[1] = number8 >> 16 & 255;
  uint8Array[2] = number8 >> 8 & 255;
  uint8Array[3] = number8 & 255;
  return uint8Array;
}
function decode4(nip19) {
  var _a2, _b, _c, _d, _e, _f, _g, _h;
  let { prefix, words } = bech323.decode(nip19, Bech32MaxSize3);
  let data = new Uint8Array(bech323.fromWords(words));
  switch (prefix) {
    case "nprofile": {
      let tlv = parseTLV3(data);
      if (!((_a2 = tlv[0]) == null ? void 0 : _a2[0]))
        throw new Error("missing TLV 0 for nprofile");
      if (tlv[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      return {
        type: "nprofile",
        data: {
          pubkey: bytesToHex6(tlv[0][0]),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder3.decode(d)) : []
        }
      };
    }
    case "nevent": {
      let tlv = parseTLV3(data);
      if (!((_b = tlv[0]) == null ? void 0 : _b[0]))
        throw new Error("missing TLV 0 for nevent");
      if (tlv[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      if (tlv[2] && tlv[2][0].length !== 32)
        throw new Error("TLV 2 should be 32 bytes");
      if (tlv[3] && tlv[3][0].length !== 4)
        throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "nevent",
        data: {
          id: bytesToHex6(tlv[0][0]),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder3.decode(d)) : [],
          author: ((_c = tlv[2]) == null ? void 0 : _c[0]) ? bytesToHex6(tlv[2][0]) : void 0,
          kind: ((_d = tlv[3]) == null ? void 0 : _d[0]) ? parseInt(bytesToHex6(tlv[3][0]), 16) : void 0
        }
      };
    }
    case "naddr": {
      let tlv = parseTLV3(data);
      if (!((_e = tlv[0]) == null ? void 0 : _e[0]))
        throw new Error("missing TLV 0 for naddr");
      if (!((_f = tlv[2]) == null ? void 0 : _f[0]))
        throw new Error("missing TLV 2 for naddr");
      if (tlv[2][0].length !== 32)
        throw new Error("TLV 2 should be 32 bytes");
      if (!((_g = tlv[3]) == null ? void 0 : _g[0]))
        throw new Error("missing TLV 3 for naddr");
      if (tlv[3][0].length !== 4)
        throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "naddr",
        data: {
          identifier: utf8Decoder3.decode(tlv[0][0]),
          pubkey: bytesToHex6(tlv[2][0]),
          kind: parseInt(bytesToHex6(tlv[3][0]), 16),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder3.decode(d)) : []
        }
      };
    }
    case "nrelay": {
      let tlv = parseTLV3(data);
      if (!((_h = tlv[0]) == null ? void 0 : _h[0]))
        throw new Error("missing TLV 0 for nrelay");
      return {
        type: "nrelay",
        data: utf8Decoder3.decode(tlv[0][0])
      };
    }
    case "nsec":
    case "npub":
    case "note":
      return { type: prefix, data: bytesToHex6(data) };
    default:
      throw new Error(`unknown prefix ${prefix}`);
  }
}
function parseTLV3(data) {
  let result = {};
  let rest = data;
  while (rest.length > 0) {
    let t = rest[0];
    let l = rest[1];
    if (!l)
      throw new Error(`malformed TLV ${t}`);
    let v = rest.slice(2, 2 + l);
    rest = rest.slice(2 + l);
    if (v.length < l)
      throw new Error(`not enough data to read on TLV ${t}`);
    result[t] = result[t] || [];
    result[t].push(v);
  }
  return result;
}
function nsecEncode3(hex5) {
  return encodeBytes3("nsec", hex5);
}
function npubEncode3(hex5) {
  return encodeBytes3("npub", hex5);
}
function noteEncode3(hex5) {
  return encodeBytes3("note", hex5);
}
function encodeBech323(prefix, data) {
  let words = bech323.toWords(data);
  return bech323.encode(prefix, words, Bech32MaxSize3);
}
function encodeBytes3(prefix, hex5) {
  let data = hexToBytes6(hex5);
  return encodeBech323(prefix, data);
}
function nprofileEncode3(profile) {
  let data = encodeTLV3({
    0: [hexToBytes6(profile.pubkey)],
    1: (profile.relays || []).map((url) => utf8Encoder3.encode(url))
  });
  return encodeBech323("nprofile", data);
}
function neventEncode3(event) {
  let kindArray;
  if (event.kind != void 0) {
    kindArray = integerToUint8Array3(event.kind);
  }
  let data = encodeTLV3({
    0: [hexToBytes6(event.id)],
    1: (event.relays || []).map((url) => utf8Encoder3.encode(url)),
    2: event.author ? [hexToBytes6(event.author)] : [],
    3: kindArray ? [new Uint8Array(kindArray)] : []
  });
  return encodeBech323("nevent", data);
}
function naddrEncode3(addr) {
  let kind = new ArrayBuffer(4);
  new DataView(kind).setUint32(0, addr.kind, false);
  let data = encodeTLV3({
    0: [utf8Encoder3.encode(addr.identifier)],
    1: (addr.relays || []).map((url) => utf8Encoder3.encode(url)),
    2: [hexToBytes6(addr.pubkey)],
    3: [new Uint8Array(kind)]
  });
  return encodeBech323("naddr", data);
}
function nrelayEncode3(url) {
  let data = encodeTLV3({
    0: [utf8Encoder3.encode(url)]
  });
  return encodeBech323("nrelay", data);
}
function encodeTLV3(tlv) {
  let entries = [];
  Object.entries(tlv).forEach(([t, vs]) => {
    vs.forEach((v) => {
      let entry = new Uint8Array(v.length + 2);
      entry.set([parseInt(t)], 0);
      entry.set([v.length], 1);
      entry.set(v, 2);
      entries.push(entry);
    });
  });
  return concatBytes8(...entries);
}
var nip04_exports3 = {};
__export4(nip04_exports3, {
  decrypt: () => decrypt5,
  encrypt: () => encrypt5
});
if (typeof crypto !== "undefined" && !crypto.subtle && crypto.webcrypto) {
  crypto.subtle = crypto.webcrypto.subtle;
}
async function encrypt5(privkey, pubkey, text) {
  const key = secp256k1.getSharedSecret(privkey, "02" + pubkey);
  const normalizedKey = getNormalizedX3(key);
  let iv = Uint8Array.from(randomBytes6(16));
  let plaintext = utf8Encoder3.encode(text);
  let cryptoKey = await crypto.subtle.importKey("raw", normalizedKey, { name: "AES-CBC" }, false, ["encrypt"]);
  let ciphertext = await crypto.subtle.encrypt({ name: "AES-CBC", iv }, cryptoKey, plaintext);
  let ctb64 = base644.encode(new Uint8Array(ciphertext));
  let ivb64 = base644.encode(new Uint8Array(iv.buffer));
  return `${ctb64}?iv=${ivb64}`;
}
async function decrypt5(privkey, pubkey, data) {
  let [ctb64, ivb64] = data.split("?iv=");
  let key = secp256k1.getSharedSecret(privkey, "02" + pubkey);
  let normalizedKey = getNormalizedX3(key);
  let cryptoKey = await crypto.subtle.importKey("raw", normalizedKey, { name: "AES-CBC" }, false, ["decrypt"]);
  let ciphertext = base644.decode(ctb64);
  let iv = base644.decode(ivb64);
  let plaintext = await crypto.subtle.decrypt({ name: "AES-CBC", iv }, cryptoKey, ciphertext);
  let text = utf8Decoder3.decode(plaintext);
  return text;
}
function getNormalizedX3(key) {
  return key.slice(1, 33);
}
var nip05_exports3 = {};
__export4(nip05_exports3, {
  NIP05_REGEX: () => NIP05_REGEX3,
  queryProfile: () => queryProfile3,
  searchDomain: () => searchDomain3,
  useFetchImplementation: () => useFetchImplementation5
});
var NIP05_REGEX3 = /^(?:([\w.+-]+)@)?([\w.-]+)$/;
var _fetch5;
try {
  _fetch5 = fetch;
} catch {
}
function useFetchImplementation5(fetchImplementation) {
  _fetch5 = fetchImplementation;
}
async function searchDomain3(domain, query = "") {
  try {
    let res = await (await _fetch5(`https://${domain}/.well-known/nostr.json?name=${query}`)).json();
    return res.names;
  } catch (_) {
    return {};
  }
}
async function queryProfile3(fullname) {
  const match = fullname.match(NIP05_REGEX3);
  if (!match)
    return null;
  const [_, name = "_", domain] = match;
  try {
    const res = await _fetch5(`https://${domain}/.well-known/nostr.json?name=${name}`);
    const { names, relays } = parseNIP05Result3(await res.json());
    const pubkey = names[name];
    return pubkey ? { pubkey, relays: relays == null ? void 0 : relays[pubkey] } : null;
  } catch (_e) {
    return null;
  }
}
function parseNIP05Result3(json) {
  const result = {
    names: {}
  };
  for (const [name, pubkey] of Object.entries(json.names)) {
    if (typeof name === "string" && typeof pubkey === "string") {
      result.names[name] = pubkey;
    }
  }
  if (json.relays) {
    result.relays = {};
    for (const [pubkey, relays] of Object.entries(json.relays)) {
      if (typeof pubkey === "string" && Array.isArray(relays)) {
        result.relays[pubkey] = relays.filter((relay) => typeof relay === "string");
      }
    }
  }
  return result;
}
var nip06_exports2 = {};
__export4(nip06_exports2, {
  generateSeedWords: () => generateSeedWords2,
  privateKeyFromSeedWords: () => privateKeyFromSeedWords2,
  validateWords: () => validateWords2
});
function privateKeyFromSeedWords2(mnemonic, passphrase) {
  let root = HDKey.fromMasterSeed(mnemonicToSeedSync(mnemonic, passphrase));
  let privateKey = root.derive(`m/44'/1237'/0'/0/0`).privateKey;
  if (!privateKey)
    throw new Error("could not derive private key");
  return bytesToHex6(privateKey);
}
function generateSeedWords2() {
  return generateMnemonic(wordlist);
}
function validateWords2(words) {
  return validateMnemonic(words, wordlist);
}
var nip10_exports3 = {};
__export4(nip10_exports3, {
  parse: () => parse4
});
function parse4(event) {
  const result = {
    reply: void 0,
    root: void 0,
    mentions: [],
    profiles: []
  };
  const eTags = [];
  for (const tag of event.tags) {
    if (tag[0] === "e" && tag[1]) {
      eTags.push(tag);
    }
    if (tag[0] === "p" && tag[1]) {
      result.profiles.push({
        pubkey: tag[1],
        relays: tag[2] ? [tag[2]] : []
      });
    }
  }
  for (let eTagIndex = 0; eTagIndex < eTags.length; eTagIndex++) {
    const eTag = eTags[eTagIndex];
    const [_, eTagEventId, eTagRelayUrl, eTagMarker] = eTag;
    const eventPointer = {
      id: eTagEventId,
      relays: eTagRelayUrl ? [eTagRelayUrl] : []
    };
    const isFirstETag = eTagIndex === 0;
    const isLastETag = eTagIndex === eTags.length - 1;
    if (eTagMarker === "root") {
      result.root = eventPointer;
      continue;
    }
    if (eTagMarker === "reply") {
      result.reply = eventPointer;
      continue;
    }
    if (eTagMarker === "mention") {
      result.mentions.push(eventPointer);
      continue;
    }
    if (isFirstETag) {
      result.root = eventPointer;
      continue;
    }
    if (isLastETag) {
      result.reply = eventPointer;
      continue;
    }
    result.mentions.push(eventPointer);
  }
  return result;
}
var nip13_exports3 = {};
__export4(nip13_exports3, {
  getPow: () => getPow3,
  minePow: () => minePow3
});
function getPow3(hex5) {
  let count = 0;
  for (let i2 = 0; i2 < hex5.length; i2++) {
    const nibble = parseInt(hex5[i2], 16);
    if (nibble === 0) {
      count += 4;
    } else {
      count += Math.clz32(nibble) - 28;
      break;
    }
  }
  return count;
}
function minePow3(unsigned, difficulty) {
  let count = 0;
  const event = unsigned;
  const tag = ["nonce", count.toString(), difficulty.toString()];
  event.tags.push(tag);
  while (true) {
    const now2 = Math.floor(new Date().getTime() / 1e3);
    if (now2 !== event.created_at) {
      count = 0;
      event.created_at = now2;
    }
    tag[1] = (++count).toString();
    event.id = getEventHash3(event);
    if (getPow3(event.id) >= difficulty) {
      break;
    }
  }
  return event;
}
var nip18_exports3 = {};
__export4(nip18_exports3, {
  finishRepostEvent: () => finishRepostEvent3,
  getRepostedEvent: () => getRepostedEvent3,
  getRepostedEventPointer: () => getRepostedEventPointer3
});
function finishRepostEvent3(t, reposted, relayUrl, privateKey) {
  var _a2;
  return finishEvent2(
    {
      kind: 6,
      tags: [...(_a2 = t.tags) != null ? _a2 : [], ["e", reposted.id, relayUrl], ["p", reposted.pubkey]],
      content: t.content === "" ? "" : JSON.stringify(reposted),
      created_at: t.created_at
    },
    privateKey
  );
}
function getRepostedEventPointer3(event) {
  if (event.kind !== 6) {
    return void 0;
  }
  let lastETag;
  let lastPTag;
  for (let i2 = event.tags.length - 1; i2 >= 0 && (lastETag === void 0 || lastPTag === void 0); i2--) {
    const tag = event.tags[i2];
    if (tag.length >= 2) {
      if (tag[0] === "e" && lastETag === void 0) {
        lastETag = tag;
      } else if (tag[0] === "p" && lastPTag === void 0) {
        lastPTag = tag;
      }
    }
  }
  if (lastETag === void 0) {
    return void 0;
  }
  return {
    id: lastETag[1],
    relays: [lastETag[2], lastPTag == null ? void 0 : lastPTag[2]].filter((x) => typeof x === "string"),
    author: lastPTag == null ? void 0 : lastPTag[1]
  };
}
function getRepostedEvent3(event, { skipVerification } = {}) {
  const pointer = getRepostedEventPointer3(event);
  if (pointer === void 0 || event.content === "") {
    return void 0;
  }
  let repostedEvent;
  try {
    repostedEvent = JSON.parse(event.content);
  } catch (error) {
    return void 0;
  }
  if (repostedEvent.id !== pointer.id) {
    return void 0;
  }
  if (!skipVerification && !verifySignature2(repostedEvent)) {
    return void 0;
  }
  return repostedEvent;
}
var nip21_exports3 = {};
__export4(nip21_exports3, {
  NOSTR_URI_REGEX: () => NOSTR_URI_REGEX3,
  parse: () => parse23,
  test: () => test3
});
var NOSTR_URI_REGEX3 = new RegExp(`nostr:(${BECH32_REGEX3.source})`);
function test3(value) {
  return typeof value === "string" && new RegExp(`^${NOSTR_URI_REGEX3.source}$`).test(value);
}
function parse23(uri) {
  const match = uri.match(new RegExp(`^${NOSTR_URI_REGEX3.source}$`));
  if (!match)
    throw new Error(`Invalid Nostr URI: ${uri}`);
  return {
    uri: match[0],
    value: match[1],
    decoded: decode4(match[1])
  };
}
var nip25_exports3 = {};
__export4(nip25_exports3, {
  finishReactionEvent: () => finishReactionEvent3,
  getReactedEventPointer: () => getReactedEventPointer3
});
function finishReactionEvent3(t, reacted, privateKey) {
  var _a2, _b;
  const inheritedTags = reacted.tags.filter((tag) => tag.length >= 2 && (tag[0] === "e" || tag[0] === "p"));
  return finishEvent2(
    {
      ...t,
      kind: 7,
      tags: [...(_a2 = t.tags) != null ? _a2 : [], ...inheritedTags, ["e", reacted.id], ["p", reacted.pubkey]],
      content: (_b = t.content) != null ? _b : "+"
    },
    privateKey
  );
}
function getReactedEventPointer3(event) {
  if (event.kind !== 7) {
    return void 0;
  }
  let lastETag;
  let lastPTag;
  for (let i2 = event.tags.length - 1; i2 >= 0 && (lastETag === void 0 || lastPTag === void 0); i2--) {
    const tag = event.tags[i2];
    if (tag.length >= 2) {
      if (tag[0] === "e" && lastETag === void 0) {
        lastETag = tag;
      } else if (tag[0] === "p" && lastPTag === void 0) {
        lastPTag = tag;
      }
    }
  }
  if (lastETag === void 0 || lastPTag === void 0) {
    return void 0;
  }
  return {
    id: lastETag[1],
    relays: [lastETag[2], lastPTag[2]].filter((x) => x !== void 0),
    author: lastPTag[1]
  };
}
var nip26_exports2 = {};
__export4(nip26_exports2, {
  createDelegation: () => createDelegation2,
  getDelegator: () => getDelegator2
});
function createDelegation2(privateKey, parameters) {
  let conditions = [];
  if ((parameters.kind || -1) >= 0)
    conditions.push(`kind=${parameters.kind}`);
  if (parameters.until)
    conditions.push(`created_at<${parameters.until}`);
  if (parameters.since)
    conditions.push(`created_at>${parameters.since}`);
  let cond = conditions.join("&");
  if (cond === "")
    throw new Error("refusing to create a delegation without any conditions");
  let sighash = sha2566(utf8Encoder3.encode(`nostr:delegation:${parameters.pubkey}:${cond}`));
  let sig = bytesToHex6(schnorr.sign(sighash, privateKey));
  return {
    from: getPublicKey3(privateKey),
    to: parameters.pubkey,
    cond,
    sig
  };
}
function getDelegator2(event) {
  let tag = event.tags.find((tag2) => tag2[0] === "delegation" && tag2.length >= 4);
  if (!tag)
    return null;
  let pubkey = tag[1];
  let cond = tag[2];
  let sig = tag[3];
  let conditions = cond.split("&");
  for (let i2 = 0; i2 < conditions.length; i2++) {
    let [key, operator, value] = conditions[i2].split(/\b/);
    if (key === "kind" && operator === "=" && event.kind === parseInt(value))
      continue;
    else if (key === "created_at" && operator === "<" && event.created_at < parseInt(value))
      continue;
    else if (key === "created_at" && operator === ">" && event.created_at > parseInt(value))
      continue;
    else
      return null;
  }
  let sighash = sha2566(utf8Encoder3.encode(`nostr:delegation:${event.pubkey}:${cond}`));
  if (!schnorr.verify(sig, sighash, pubkey))
    return null;
  return pubkey;
}
var nip27_exports3 = {};
__export4(nip27_exports3, {
  matchAll: () => matchAll3,
  regex: () => regex3,
  replaceAll: () => replaceAll3
});
var regex3 = () => new RegExp(`\\b${NOSTR_URI_REGEX3.source}\\b`, "g");
function* matchAll3(content) {
  const matches = content.matchAll(regex3());
  for (const match of matches) {
    try {
      const [uri, value] = match;
      yield {
        uri,
        value,
        decoded: decode4(value),
        start: match.index,
        end: match.index + uri.length
      };
    } catch (_e) {
    }
  }
}
function replaceAll3(content, replacer) {
  return content.replaceAll(regex3(), (uri, value) => {
    return replacer({
      uri,
      value,
      decoded: decode4(value)
    });
  });
}
var nip28_exports3 = {};
__export4(nip28_exports3, {
  channelCreateEvent: () => channelCreateEvent3,
  channelHideMessageEvent: () => channelHideMessageEvent3,
  channelMessageEvent: () => channelMessageEvent3,
  channelMetadataEvent: () => channelMetadataEvent3,
  channelMuteUserEvent: () => channelMuteUserEvent3
});
var channelCreateEvent3 = (t, privateKey) => {
  var _a2;
  let content;
  if (typeof t.content === "object") {
    content = JSON.stringify(t.content);
  } else if (typeof t.content === "string") {
    content = t.content;
  } else {
    return void 0;
  }
  return finishEvent2(
    {
      kind: 40,
      tags: [...(_a2 = t.tags) != null ? _a2 : []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelMetadataEvent3 = (t, privateKey) => {
  var _a2;
  let content;
  if (typeof t.content === "object") {
    content = JSON.stringify(t.content);
  } else if (typeof t.content === "string") {
    content = t.content;
  } else {
    return void 0;
  }
  return finishEvent2(
    {
      kind: 41,
      tags: [["e", t.channel_create_event_id], ...(_a2 = t.tags) != null ? _a2 : []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelMessageEvent3 = (t, privateKey) => {
  var _a2;
  const tags = [["e", t.channel_create_event_id, t.relay_url, "root"]];
  if (t.reply_to_channel_message_event_id) {
    tags.push(["e", t.reply_to_channel_message_event_id, t.relay_url, "reply"]);
  }
  return finishEvent2(
    {
      kind: 42,
      tags: [...tags, ...(_a2 = t.tags) != null ? _a2 : []],
      content: t.content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelHideMessageEvent3 = (t, privateKey) => {
  var _a2;
  let content;
  if (typeof t.content === "object") {
    content = JSON.stringify(t.content);
  } else if (typeof t.content === "string") {
    content = t.content;
  } else {
    return void 0;
  }
  return finishEvent2(
    {
      kind: 43,
      tags: [["e", t.channel_message_event_id], ...(_a2 = t.tags) != null ? _a2 : []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelMuteUserEvent3 = (t, privateKey) => {
  var _a2;
  let content;
  if (typeof t.content === "object") {
    content = JSON.stringify(t.content);
  } else if (typeof t.content === "string") {
    content = t.content;
  } else {
    return void 0;
  }
  return finishEvent2(
    {
      kind: 44,
      tags: [["p", t.pubkey_to_mute], ...(_a2 = t.tags) != null ? _a2 : []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var nip39_exports3 = {};
__export4(nip39_exports3, {
  useFetchImplementation: () => useFetchImplementation23,
  validateGithub: () => validateGithub3
});
var _fetch23;
try {
  _fetch23 = fetch;
} catch {
}
function useFetchImplementation23(fetchImplementation) {
  _fetch23 = fetchImplementation;
}
async function validateGithub3(pubkey, username, proof) {
  try {
    let res = await (await _fetch23(`https://gist.github.com/${username}/${proof}/raw`)).text();
    return res === `Verifying that I control the following Nostr public key: ${pubkey}`;
  } catch (_) {
    return false;
  }
}
var nip42_exports3 = {};
__export4(nip42_exports3, {
  authenticate: () => authenticate2
});
var authenticate2 = async ({
  challenge: challenge3,
  relay,
  sign
}) => {
  const e = {
    kind: 22242,
    created_at: Math.floor(Date.now() / 1e3),
    tags: [
      ["relay", relay.url],
      ["challenge", challenge3]
    ],
    content: ""
  };
  return relay.auth(await sign(e));
};
var nip44_exports3 = {};
__export4(nip44_exports3, {
  decrypt: () => decrypt23,
  encrypt: () => encrypt23,
  utils: () => utils3
});
var utils3 = {
  v2: {
    maxPlaintextSize: 65536 - 128,
    minCiphertextSize: 100,
    maxCiphertextSize: 102400,
    getConversationKey(privkeyA, pubkeyB) {
      const key = secp256k1.getSharedSecret(privkeyA, "02" + pubkeyB);
      return key.subarray(1, 33);
    },
    getMessageKeys(conversationKey, salt2) {
      const keys2 = hkdf2(sha2566, conversationKey, salt2, "nip44-v2", 76);
      return {
        encryption: keys2.subarray(0, 32),
        nonce: keys2.subarray(32, 44),
        auth: keys2.subarray(44, 76)
      };
    },
    calcPadding(len) {
      if (!Number.isSafeInteger(len) || len < 0)
        throw new Error("expected positive integer");
      if (len <= 32)
        return 32;
      const nextpower = 1 << Math.floor(Math.log2(len - 1)) + 1;
      const chunk = nextpower <= 256 ? 32 : nextpower / 8;
      return chunk * (Math.floor((len - 1) / chunk) + 1);
    },
    pad(unpadded) {
      const unpaddedB = utf8Encoder3.encode(unpadded);
      const len = unpaddedB.length;
      if (len < 1 || len >= utils3.v2.maxPlaintextSize)
        throw new Error("invalid plaintext length: must be between 1b and 64KB");
      const paddedLen = utils3.v2.calcPadding(len);
      const zeros = new Uint8Array(paddedLen - len);
      const lenBuf = new Uint8Array(2);
      new DataView(lenBuf.buffer).setUint16(0, len);
      return concatBytes8(lenBuf, unpaddedB, zeros);
    },
    unpad(padded) {
      const unpaddedLen = new DataView(padded.buffer).getUint16(0);
      const unpadded = padded.subarray(2, 2 + unpaddedLen);
      if (unpaddedLen === 0 || unpadded.length !== unpaddedLen || padded.length !== 2 + utils3.v2.calcPadding(unpaddedLen))
        throw new Error("invalid padding");
      return utf8Decoder3.decode(unpadded);
    }
  }
};
function encrypt23(key, plaintext, options = {}) {
  var _a2, _b;
  const version = (_a2 = options.version) != null ? _a2 : 2;
  if (version !== 2)
    throw new Error("unknown encryption version " + version);
  const salt2 = (_b = options.salt) != null ? _b : randomBytes6(32);
  ensureBytes2(salt2, 32);
  const keys2 = utils3.v2.getMessageKeys(key, salt2);
  const padded = utils3.v2.pad(plaintext);
  const ciphertext = chacha20(keys2.encryption, keys2.nonce, padded);
  const mac = hmac6(sha2566, keys2.auth, ciphertext);
  return base644.encode(concatBytes8(new Uint8Array([version]), salt2, ciphertext, mac));
}
function decrypt23(key, ciphertext) {
  const u2 = utils3.v2;
  ensureBytes2(key, 32);
  const clen = ciphertext.length;
  if (clen < u2.minCiphertextSize || clen >= u2.maxCiphertextSize)
    throw new Error("invalid ciphertext length: " + clen);
  if (ciphertext[0] === "#")
    throw new Error("unknown encryption version");
  let data;
  try {
    data = base644.decode(ciphertext);
  } catch (error) {
    throw new Error("invalid base64: " + error.message);
  }
  const vers = data.subarray(0, 1)[0];
  if (vers !== 2)
    throw new Error("unknown encryption version " + vers);
  const salt2 = data.subarray(1, 33);
  const ciphertext_ = data.subarray(33, -32);
  const mac = data.subarray(-32);
  const keys2 = u2.getMessageKeys(key, salt2);
  const calculatedMac = hmac6(sha2566, keys2.auth, ciphertext_);
  if (!equalBytes2(calculatedMac, mac))
    throw new Error("invalid MAC");
  const padded = chacha20(keys2.encryption, keys2.nonce, ciphertext_);
  return u2.unpad(padded);
}
var nip47_exports3 = {};
__export4(nip47_exports3, {
  makeNwcRequestEvent: () => makeNwcRequestEvent3,
  parseConnectionString: () => parseConnectionString3
});
function parseConnectionString3(connectionString) {
  const { pathname, searchParams } = new URL(connectionString);
  const pubkey = pathname;
  const relay = searchParams.get("relay");
  const secret = searchParams.get("secret");
  if (!pubkey || !relay || !secret) {
    throw new Error("invalid connection string");
  }
  return { pubkey, relay, secret };
}
async function makeNwcRequestEvent3({
  pubkey,
  secret,
  invoice
}) {
  const content = {
    method: "pay_invoice",
    params: {
      invoice
    }
  };
  const encryptedContent = await encrypt5(secret, pubkey, JSON.stringify(content));
  const eventTemplate = {
    kind: 23194,
    created_at: Math.round(Date.now() / 1e3),
    content: encryptedContent,
    tags: [["p", pubkey]]
  };
  return finishEvent2(eventTemplate, secret);
}
var nip57_exports3 = {};
__export4(nip57_exports3, {
  getZapEndpoint: () => getZapEndpoint3,
  makeZapReceipt: () => makeZapReceipt3,
  makeZapRequest: () => makeZapRequest3,
  useFetchImplementation: () => useFetchImplementation33,
  validateZapRequest: () => validateZapRequest3
});
var _fetch33;
try {
  _fetch33 = fetch;
} catch {
}
function useFetchImplementation33(fetchImplementation) {
  _fetch33 = fetchImplementation;
}
async function getZapEndpoint3(metadata) {
  try {
    let lnurl = "";
    let { lud06, lud16 } = JSON.parse(metadata.content);
    if (lud06) {
      let { words } = bech323.decode(lud06, 1e3);
      let data = bech323.fromWords(words);
      lnurl = utf8Decoder3.decode(data);
    } else if (lud16) {
      let [name, domain] = lud16.split("@");
      lnurl = `https://${domain}/.well-known/lnurlp/${name}`;
    } else {
      return null;
    }
    let res = await _fetch33(lnurl);
    let body = await res.json();
    if (body.allowsNostr && body.nostrPubkey) {
      return body.callback;
    }
  } catch (err) {
  }
  return null;
}
function makeZapRequest3({
  profile,
  event,
  amount,
  relays,
  comment = ""
}) {
  if (!amount)
    throw new Error("amount not given");
  if (!profile)
    throw new Error("profile not given");
  let zr = {
    kind: 9734,
    created_at: Math.round(Date.now() / 1e3),
    content: comment,
    tags: [
      ["p", profile],
      ["amount", amount.toString()],
      ["relays", ...relays]
    ]
  };
  if (event) {
    zr.tags.push(["e", event]);
  }
  return zr;
}
function validateZapRequest3(zapRequestString) {
  let zapRequest;
  try {
    zapRequest = JSON.parse(zapRequestString);
  } catch (err) {
    return "Invalid zap request JSON.";
  }
  if (!validateEvent4(zapRequest))
    return "Zap request is not a valid Nostr event.";
  if (!verifySignature2(zapRequest))
    return "Invalid signature on zap request.";
  let p = zapRequest.tags.find(([t, v]) => t === "p" && v);
  if (!p)
    return "Zap request doesn't have a 'p' tag.";
  if (!p[1].match(/^[a-f0-9]{64}$/))
    return "Zap request 'p' tag is not valid hex.";
  let e = zapRequest.tags.find(([t, v]) => t === "e" && v);
  if (e && !e[1].match(/^[a-f0-9]{64}$/))
    return "Zap request 'e' tag is not valid hex.";
  let relays = zapRequest.tags.find(([t, v]) => t === "relays" && v);
  if (!relays)
    return "Zap request doesn't have a 'relays' tag.";
  return null;
}
function makeZapReceipt3({
  zapRequest,
  preimage,
  bolt11,
  paidAt
}) {
  let zr = JSON.parse(zapRequest);
  let tagsFromZapRequest = zr.tags.filter(([t]) => t === "e" || t === "p" || t === "a");
  let zap = {
    kind: 9735,
    created_at: Math.round(paidAt.getTime() / 1e3),
    content: "",
    tags: [...tagsFromZapRequest, ["bolt11", bolt11], ["description", zapRequest]]
  };
  if (preimage) {
    zap.tags.push(["preimage", preimage]);
  }
  return zap;
}
var nip98_exports3 = {};
__export4(nip98_exports3, {
  getToken: () => getToken3,
  unpackEventFromToken: () => unpackEventFromToken3,
  validateEvent: () => validateEvent23,
  validateToken: () => validateToken3
});
var _authorizationScheme3 = "Nostr ";
async function getToken3(loginUrl, httpMethod, sign, includeAuthorizationScheme = false) {
  if (!loginUrl || !httpMethod)
    throw new Error("Missing loginUrl or httpMethod");
  const event = getBlankEvent2(
    27235
    /* HttpAuth */
  );
  event.tags = [
    ["u", loginUrl],
    ["method", httpMethod]
  ];
  event.created_at = Math.round(new Date().getTime() / 1e3);
  const signedEvent = await sign(event);
  const authorizationScheme = includeAuthorizationScheme ? _authorizationScheme3 : "";
  return authorizationScheme + base644.encode(utf8Encoder3.encode(JSON.stringify(signedEvent)));
}
async function validateToken3(token, url, method) {
  const event = await unpackEventFromToken3(token).catch((error) => {
    throw error;
  });
  const valid = await validateEvent23(event, url, method).catch((error) => {
    throw error;
  });
  return valid;
}
async function unpackEventFromToken3(token) {
  if (!token) {
    throw new Error("Missing token");
  }
  token = token.replace(_authorizationScheme3, "");
  const eventB64 = utf8Decoder3.decode(base644.decode(token));
  if (!eventB64 || eventB64.length === 0 || !eventB64.startsWith("{")) {
    throw new Error("Invalid token");
  }
  const event = JSON.parse(eventB64);
  return event;
}
async function validateEvent23(event, url, method) {
  if (!event) {
    throw new Error("Invalid nostr event");
  }
  if (!verifySignature2(event)) {
    throw new Error("Invalid nostr event, signature invalid");
  }
  if (event.kind !== 27235) {
    throw new Error("Invalid nostr event, kind invalid");
  }
  if (!event.created_at) {
    throw new Error("Invalid nostr event, created_at invalid");
  }
  if (Math.round(new Date().getTime() / 1e3) - event.created_at > 60) {
    throw new Error("Invalid nostr event, expired");
  }
  const urlTag = event.tags.find((t) => t[0] === "u");
  if ((urlTag == null ? void 0 : urlTag.length) !== 1 && (urlTag == null ? void 0 : urlTag[1]) !== url) {
    throw new Error("Invalid nostr event, url tag invalid");
  }
  const methodTag = event.tags.find((t) => t[0] === "method");
  if ((methodTag == null ? void 0 : methodTag.length) !== 1 && (methodTag == null ? void 0 : methodTag[1].toLowerCase()) !== method.toLowerCase()) {
    throw new Error("Invalid nostr event, method tag invalid");
  }
  return true;
}

// node_modules/@nostr-dev-kit/ndk-cache-dexie/dist/index.mjs
var import_typescript_lru_cache2 = __toESM(require_dist(), 1);

// node_modules/dexie/dist/modern/dexie.mjs
var _global = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
var keys = Object.keys;
var isArray = Array.isArray;
if (typeof Promise !== "undefined" && !_global.Promise) {
  _global.Promise = Promise;
}
function extend(obj, extension) {
  if (typeof extension !== "object")
    return obj;
  keys(extension).forEach(function(key) {
    obj[key] = extension[key];
  });
  return obj;
}
var getProto = Object.getPrototypeOf;
var _hasOwn = {}.hasOwnProperty;
function hasOwn(obj, prop) {
  return _hasOwn.call(obj, prop);
}
function props(proto, extension) {
  if (typeof extension === "function")
    extension = extension(getProto(proto));
  (typeof Reflect === "undefined" ? keys : Reflect.ownKeys)(extension).forEach((key) => {
    setProp(proto, key, extension[key]);
  });
}
var defineProperty = Object.defineProperty;
function setProp(obj, prop, functionOrGetSet, options) {
  defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === "function" ? { get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true } : { value: functionOrGetSet, configurable: true, writable: true }, options));
}
function derive(Child) {
  return {
    from: function(Parent) {
      Child.prototype = Object.create(Parent.prototype);
      setProp(Child.prototype, "constructor", Child);
      return {
        extend: props.bind(null, Child.prototype)
      };
    }
  };
}
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
function getPropertyDescriptor(obj, prop) {
  const pd = getOwnPropertyDescriptor(obj, prop);
  let proto;
  return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
}
var _slice = [].slice;
function slice(args, start, end) {
  return _slice.call(args, start, end);
}
function override(origFunc, overridedFactory) {
  return overridedFactory(origFunc);
}
function assert7(b) {
  if (!b)
    throw new Error("Assertion Failed");
}
function asap$1(fn) {
  if (_global.setImmediate)
    setImmediate(fn);
  else
    setTimeout(fn, 0);
}
function arrayToObject(array, extractor) {
  return array.reduce((result, item, i2) => {
    var nameAndValue = extractor(item, i2);
    if (nameAndValue)
      result[nameAndValue[0]] = nameAndValue[1];
    return result;
  }, {});
}
function tryCatch(fn, onerror, args) {
  try {
    fn.apply(null, args);
  } catch (ex) {
    onerror && onerror(ex);
  }
}
function getByKeyPath(obj, keyPath) {
  if (hasOwn(obj, keyPath))
    return obj[keyPath];
  if (!keyPath)
    return obj;
  if (typeof keyPath !== "string") {
    var rv = [];
    for (var i2 = 0, l = keyPath.length; i2 < l; ++i2) {
      var val = getByKeyPath(obj, keyPath[i2]);
      rv.push(val);
    }
    return rv;
  }
  var period = keyPath.indexOf(".");
  if (period !== -1) {
    var innerObj = obj[keyPath.substr(0, period)];
    return innerObj === void 0 ? void 0 : getByKeyPath(innerObj, keyPath.substr(period + 1));
  }
  return void 0;
}
function setByKeyPath(obj, keyPath, value) {
  if (!obj || keyPath === void 0)
    return;
  if ("isFrozen" in Object && Object.isFrozen(obj))
    return;
  if (typeof keyPath !== "string" && "length" in keyPath) {
    assert7(typeof value !== "string" && "length" in value);
    for (var i2 = 0, l = keyPath.length; i2 < l; ++i2) {
      setByKeyPath(obj, keyPath[i2], value[i2]);
    }
  } else {
    var period = keyPath.indexOf(".");
    if (period !== -1) {
      var currentKeyPath = keyPath.substr(0, period);
      var remainingKeyPath = keyPath.substr(period + 1);
      if (remainingKeyPath === "")
        if (value === void 0) {
          if (isArray(obj) && !isNaN(parseInt(currentKeyPath)))
            obj.splice(currentKeyPath, 1);
          else
            delete obj[currentKeyPath];
        } else
          obj[currentKeyPath] = value;
      else {
        var innerObj = obj[currentKeyPath];
        if (!innerObj || !hasOwn(obj, currentKeyPath))
          innerObj = obj[currentKeyPath] = {};
        setByKeyPath(innerObj, remainingKeyPath, value);
      }
    } else {
      if (value === void 0) {
        if (isArray(obj) && !isNaN(parseInt(keyPath)))
          obj.splice(keyPath, 1);
        else
          delete obj[keyPath];
      } else
        obj[keyPath] = value;
    }
  }
}
function delByKeyPath(obj, keyPath) {
  if (typeof keyPath === "string")
    setByKeyPath(obj, keyPath, void 0);
  else if ("length" in keyPath)
    [].map.call(keyPath, function(kp) {
      setByKeyPath(obj, kp, void 0);
    });
}
function shallowClone(obj) {
  var rv = {};
  for (var m in obj) {
    if (hasOwn(obj, m))
      rv[m] = obj[m];
  }
  return rv;
}
var concat = [].concat;
function flatten(a) {
  return concat.apply([], a);
}
var intrinsicTypeNames = "Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(flatten([8, 16, 32, 64].map((num) => ["Int", "Uint", "Float"].map((t) => t + num + "Array")))).filter((t) => _global[t]);
var intrinsicTypes = intrinsicTypeNames.map((t) => _global[t]);
arrayToObject(intrinsicTypeNames, (x) => [x, true]);
var circularRefs = null;
function deepClone(any) {
  circularRefs = typeof WeakMap !== "undefined" && /* @__PURE__ */ new WeakMap();
  const rv = innerDeepClone(any);
  circularRefs = null;
  return rv;
}
function innerDeepClone(any) {
  if (!any || typeof any !== "object")
    return any;
  let rv = circularRefs && circularRefs.get(any);
  if (rv)
    return rv;
  if (isArray(any)) {
    rv = [];
    circularRefs && circularRefs.set(any, rv);
    for (var i2 = 0, l = any.length; i2 < l; ++i2) {
      rv.push(innerDeepClone(any[i2]));
    }
  } else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
    rv = any;
  } else {
    const proto = getProto(any);
    rv = proto === Object.prototype ? {} : Object.create(proto);
    circularRefs && circularRefs.set(any, rv);
    for (var prop in any) {
      if (hasOwn(any, prop)) {
        rv[prop] = innerDeepClone(any[prop]);
      }
    }
  }
  return rv;
}
var { toString } = {};
function toStringTag(o) {
  return toString.call(o).slice(8, -1);
}
var iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
var getIteratorOf = typeof iteratorSymbol === "symbol" ? function(x) {
  var i2;
  return x != null && (i2 = x[iteratorSymbol]) && i2.apply(x);
} : function() {
  return null;
};
var NO_CHAR_ARRAY = {};
function getArrayOf(arrayLike) {
  var i2, a, x, it;
  if (arguments.length === 1) {
    if (isArray(arrayLike))
      return arrayLike.slice();
    if (this === NO_CHAR_ARRAY && typeof arrayLike === "string")
      return [arrayLike];
    if (it = getIteratorOf(arrayLike)) {
      a = [];
      while (x = it.next(), !x.done)
        a.push(x.value);
      return a;
    }
    if (arrayLike == null)
      return [arrayLike];
    i2 = arrayLike.length;
    if (typeof i2 === "number") {
      a = new Array(i2);
      while (i2--)
        a[i2] = arrayLike[i2];
      return a;
    }
    return [arrayLike];
  }
  i2 = arguments.length;
  a = new Array(i2);
  while (i2--)
    a[i2] = arguments[i2];
  return a;
}
var isAsyncFunction = typeof Symbol !== "undefined" ? (fn) => fn[Symbol.toStringTag] === "AsyncFunction" : () => false;
var debug4 = typeof location !== "undefined" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
function setDebug(value, filter) {
  debug4 = value;
  libraryFilter = filter;
}
var libraryFilter = () => true;
var NEEDS_THROW_FOR_STACK = !new Error("").stack;
function getErrorWithStack() {
  if (NEEDS_THROW_FOR_STACK)
    try {
      getErrorWithStack.arguments;
      throw new Error();
    } catch (e) {
      return e;
    }
  return new Error();
}
function prettyStack(exception, numIgnoredFrames) {
  var stack = exception.stack;
  if (!stack)
    return "";
  numIgnoredFrames = numIgnoredFrames || 0;
  if (stack.indexOf(exception.name) === 0)
    numIgnoredFrames += (exception.name + exception.message).split("\n").length;
  return stack.split("\n").slice(numIgnoredFrames).filter(libraryFilter).map((frame) => "\n" + frame).join("");
}
var dexieErrorNames = [
  "Modify",
  "Bulk",
  "OpenFailed",
  "VersionChange",
  "Schema",
  "Upgrade",
  "InvalidTable",
  "MissingAPI",
  "NoSuchDatabase",
  "InvalidArgument",
  "SubTransaction",
  "Unsupported",
  "Internal",
  "DatabaseClosed",
  "PrematureCommit",
  "ForeignAwait"
];
var idbDomErrorNames = [
  "Unknown",
  "Constraint",
  "Data",
  "TransactionInactive",
  "ReadOnly",
  "Version",
  "NotFound",
  "InvalidState",
  "InvalidAccess",
  "Abort",
  "Timeout",
  "QuotaExceeded",
  "Syntax",
  "DataClone"
];
var errorList = dexieErrorNames.concat(idbDomErrorNames);
var defaultTexts = {
  VersionChanged: "Database version changed by other database connection",
  DatabaseClosed: "Database has been closed",
  Abort: "Transaction aborted",
  TransactionInactive: "Transaction has already completed or failed",
  MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
};
function DexieError(name, msg) {
  this._e = getErrorWithStack();
  this.name = name;
  this.message = msg;
}
derive(DexieError).from(Error).extend({
  stack: {
    get: function() {
      return this._stack || (this._stack = this.name + ": " + this.message + prettyStack(this._e, 2));
    }
  },
  toString: function() {
    return this.name + ": " + this.message;
  }
});
function getMultiErrorMessage(msg, failures) {
  return msg + ". Errors: " + Object.keys(failures).map((key) => failures[key].toString()).filter((v, i2, s) => s.indexOf(v) === i2).join("\n");
}
function ModifyError(msg, failures, successCount, failedKeys) {
  this._e = getErrorWithStack();
  this.failures = failures;
  this.failedKeys = failedKeys;
  this.successCount = successCount;
  this.message = getMultiErrorMessage(msg, failures);
}
derive(ModifyError).from(DexieError);
function BulkError(msg, failures) {
  this._e = getErrorWithStack();
  this.name = "BulkError";
  this.failures = Object.keys(failures).map((pos) => failures[pos]);
  this.failuresByPos = failures;
  this.message = getMultiErrorMessage(msg, failures);
}
derive(BulkError).from(DexieError);
var errnames = errorList.reduce((obj, name) => (obj[name] = name + "Error", obj), {});
var BaseException = DexieError;
var exceptions = errorList.reduce((obj, name) => {
  var fullName = name + "Error";
  function DexieError2(msgOrInner, inner) {
    this._e = getErrorWithStack();
    this.name = fullName;
    if (!msgOrInner) {
      this.message = defaultTexts[name] || fullName;
      this.inner = null;
    } else if (typeof msgOrInner === "string") {
      this.message = `${msgOrInner}${!inner ? "" : "\n " + inner}`;
      this.inner = inner || null;
    } else if (typeof msgOrInner === "object") {
      this.message = `${msgOrInner.name} ${msgOrInner.message}`;
      this.inner = msgOrInner;
    }
  }
  derive(DexieError2).from(BaseException);
  obj[name] = DexieError2;
  return obj;
}, {});
exceptions.Syntax = SyntaxError;
exceptions.Type = TypeError;
exceptions.Range = RangeError;
var exceptionMap = idbDomErrorNames.reduce((obj, name) => {
  obj[name + "Error"] = exceptions[name];
  return obj;
}, {});
function mapError(domError, message) {
  if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
    return domError;
  var rv = new exceptionMap[domError.name](message || domError.message, domError);
  if ("stack" in domError) {
    setProp(rv, "stack", { get: function() {
      return this.inner.stack;
    } });
  }
  return rv;
}
var fullNameExceptions = errorList.reduce((obj, name) => {
  if (["Syntax", "Type", "Range"].indexOf(name) === -1)
    obj[name + "Error"] = exceptions[name];
  return obj;
}, {});
fullNameExceptions.ModifyError = ModifyError;
fullNameExceptions.DexieError = DexieError;
fullNameExceptions.BulkError = BulkError;
function nop() {
}
function mirror(val) {
  return val;
}
function pureFunctionChain(f1, f2) {
  if (f1 == null || f1 === mirror)
    return f2;
  return function(val) {
    return f2(f1(val));
  };
}
function callBoth(on1, on2) {
  return function() {
    on1.apply(this, arguments);
    on2.apply(this, arguments);
  };
}
function hookCreatingChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    var res = f1.apply(this, arguments);
    if (res !== void 0)
      arguments[0] = res;
    var onsuccess = this.onsuccess, onerror = this.onerror;
    this.onsuccess = null;
    this.onerror = null;
    var res2 = f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    return res2 !== void 0 ? res2 : res;
  };
}
function hookDeletingChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    f1.apply(this, arguments);
    var onsuccess = this.onsuccess, onerror = this.onerror;
    this.onsuccess = this.onerror = null;
    f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
  };
}
function hookUpdatingChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function(modifications) {
    var res = f1.apply(this, arguments);
    extend(modifications, res);
    var onsuccess = this.onsuccess, onerror = this.onerror;
    this.onsuccess = null;
    this.onerror = null;
    var res2 = f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    return res === void 0 ? res2 === void 0 ? void 0 : res2 : extend(res, res2);
  };
}
function reverseStoppableEventChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    if (f2.apply(this, arguments) === false)
      return false;
    return f1.apply(this, arguments);
  };
}
function promisableChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    var res = f1.apply(this, arguments);
    if (res && typeof res.then === "function") {
      var thiz = this, i2 = arguments.length, args = new Array(i2);
      while (i2--)
        args[i2] = arguments[i2];
      return res.then(function() {
        return f2.apply(thiz, args);
      });
    }
    return f2.apply(this, arguments);
  };
}
var INTERNAL = {};
var LONG_STACKS_CLIP_LIMIT = 100;
var MAX_LONG_STACKS = 20;
var ZONE_ECHO_LIMIT = 100;
var [resolvedNativePromise, nativePromiseProto, resolvedGlobalPromise] = typeof Promise === "undefined" ? [] : (() => {
  let globalP = Promise.resolve();
  if (typeof crypto === "undefined" || !crypto.subtle)
    return [globalP, getProto(globalP), globalP];
  const nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
  return [
    nativeP,
    getProto(nativeP),
    globalP
  ];
})();
var nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
var patchGlobalPromise = !!resolvedGlobalPromise;
var stack_being_generated = false;
var schedulePhysicalTick = resolvedGlobalPromise ? () => {
  resolvedGlobalPromise.then(physicalTick);
} : _global.setImmediate ? setImmediate.bind(null, physicalTick) : _global.MutationObserver ? () => {
  var hiddenDiv = document.createElement("div");
  new MutationObserver(() => {
    physicalTick();
    hiddenDiv = null;
  }).observe(hiddenDiv, { attributes: true });
  hiddenDiv.setAttribute("i", "1");
} : () => {
  setTimeout(physicalTick, 0);
};
var asap = function(callback, args) {
  microtickQueue.push([callback, args]);
  if (needsNewPhysicalTick) {
    schedulePhysicalTick();
    needsNewPhysicalTick = false;
  }
};
var isOutsideMicroTick = true;
var needsNewPhysicalTick = true;
var unhandledErrors = [];
var rejectingErrors = [];
var currentFulfiller = null;
var rejectionMapper = mirror;
var globalPSD = {
  id: "global",
  global: true,
  ref: 0,
  unhandleds: [],
  onunhandled: globalError,
  pgp: false,
  env: {},
  finalize: function() {
    this.unhandleds.forEach((uh) => {
      try {
        globalError(uh[0], uh[1]);
      } catch (e) {
      }
    });
  }
};
var PSD = globalPSD;
var microtickQueue = [];
var numScheduledCalls = 0;
var tickFinalizers = [];
function DexiePromise(fn) {
  if (typeof this !== "object")
    throw new TypeError("Promises must be constructed via new");
  this._listeners = [];
  this.onuncatched = nop;
  this._lib = false;
  var psd = this._PSD = PSD;
  if (debug4) {
    this._stackHolder = getErrorWithStack();
    this._prev = null;
    this._numPrev = 0;
  }
  if (typeof fn !== "function") {
    if (fn !== INTERNAL)
      throw new TypeError("Not a function");
    this._state = arguments[1];
    this._value = arguments[2];
    if (this._state === false)
      handleRejection(this, this._value);
    return;
  }
  this._state = null;
  this._value = null;
  ++psd.ref;
  executePromiseTask(this, fn);
}
var thenProp = {
  get: function() {
    var psd = PSD, microTaskId = totalEchoes;
    function then(onFulfilled, onRejected) {
      var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
      const cleanup = possibleAwait && !decrementExpectedAwaits();
      var rv = new DexiePromise((resolve, reject) => {
        propagateToListener(this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait, cleanup), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait, cleanup), resolve, reject, psd));
      });
      debug4 && linkToPreviousPromise(rv, this);
      return rv;
    }
    then.prototype = INTERNAL;
    return then;
  },
  set: function(value) {
    setProp(this, "then", value && value.prototype === INTERNAL ? thenProp : {
      get: function() {
        return value;
      },
      set: thenProp.set
    });
  }
};
props(DexiePromise.prototype, {
  then: thenProp,
  _then: function(onFulfilled, onRejected) {
    propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
  },
  catch: function(onRejected) {
    if (arguments.length === 1)
      return this.then(null, onRejected);
    var type2 = arguments[0], handler = arguments[1];
    return typeof type2 === "function" ? this.then(null, (err) => err instanceof type2 ? handler(err) : PromiseReject(err)) : this.then(null, (err) => err && err.name === type2 ? handler(err) : PromiseReject(err));
  },
  finally: function(onFinally) {
    return this.then((value) => {
      onFinally();
      return value;
    }, (err) => {
      onFinally();
      return PromiseReject(err);
    });
  },
  stack: {
    get: function() {
      if (this._stack)
        return this._stack;
      try {
        stack_being_generated = true;
        var stacks = getStack(this, [], MAX_LONG_STACKS);
        var stack = stacks.join("\nFrom previous: ");
        if (this._state !== null)
          this._stack = stack;
        return stack;
      } finally {
        stack_being_generated = false;
      }
    }
  },
  timeout: function(ms, msg) {
    return ms < Infinity ? new DexiePromise((resolve, reject) => {
      var handle = setTimeout(() => reject(new exceptions.Timeout(msg)), ms);
      this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
    }) : this;
  }
});
if (typeof Symbol !== "undefined" && Symbol.toStringTag)
  setProp(DexiePromise.prototype, Symbol.toStringTag, "Dexie.Promise");
globalPSD.env = snapShot();
function Listener(onFulfilled, onRejected, resolve, reject, zone) {
  this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
  this.onRejected = typeof onRejected === "function" ? onRejected : null;
  this.resolve = resolve;
  this.reject = reject;
  this.psd = zone;
}
props(DexiePromise, {
  all: function() {
    var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
    return new DexiePromise(function(resolve, reject) {
      if (values.length === 0)
        resolve([]);
      var remaining = values.length;
      values.forEach((a, i2) => DexiePromise.resolve(a).then((x) => {
        values[i2] = x;
        if (!--remaining)
          resolve(values);
      }, reject));
    });
  },
  resolve: (value) => {
    if (value instanceof DexiePromise)
      return value;
    if (value && typeof value.then === "function")
      return new DexiePromise((resolve, reject) => {
        value.then(resolve, reject);
      });
    var rv = new DexiePromise(INTERNAL, true, value);
    linkToPreviousPromise(rv, currentFulfiller);
    return rv;
  },
  reject: PromiseReject,
  race: function() {
    var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
    return new DexiePromise((resolve, reject) => {
      values.map((value) => DexiePromise.resolve(value).then(resolve, reject));
    });
  },
  PSD: {
    get: () => PSD,
    set: (value) => PSD = value
  },
  totalEchoes: { get: () => totalEchoes },
  newPSD: newScope,
  usePSD,
  scheduler: {
    get: () => asap,
    set: (value) => {
      asap = value;
    }
  },
  rejectionMapper: {
    get: () => rejectionMapper,
    set: (value) => {
      rejectionMapper = value;
    }
  },
  follow: (fn, zoneProps) => {
    return new DexiePromise((resolve, reject) => {
      return newScope((resolve2, reject2) => {
        var psd = PSD;
        psd.unhandleds = [];
        psd.onunhandled = reject2;
        psd.finalize = callBoth(function() {
          run_at_end_of_this_or_next_physical_tick(() => {
            this.unhandleds.length === 0 ? resolve2() : reject2(this.unhandleds[0]);
          });
        }, psd.finalize);
        fn();
      }, zoneProps, resolve, reject);
    });
  }
});
if (NativePromise) {
  if (NativePromise.allSettled)
    setProp(DexiePromise, "allSettled", function() {
      const possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
      return new DexiePromise((resolve) => {
        if (possiblePromises.length === 0)
          resolve([]);
        let remaining = possiblePromises.length;
        const results = new Array(remaining);
        possiblePromises.forEach((p, i2) => DexiePromise.resolve(p).then((value) => results[i2] = { status: "fulfilled", value }, (reason) => results[i2] = { status: "rejected", reason }).then(() => --remaining || resolve(results)));
      });
    });
  if (NativePromise.any && typeof AggregateError !== "undefined")
    setProp(DexiePromise, "any", function() {
      const possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
      return new DexiePromise((resolve, reject) => {
        if (possiblePromises.length === 0)
          reject(new AggregateError([]));
        let remaining = possiblePromises.length;
        const failures = new Array(remaining);
        possiblePromises.forEach((p, i2) => DexiePromise.resolve(p).then((value) => resolve(value), (failure) => {
          failures[i2] = failure;
          if (!--remaining)
            reject(new AggregateError(failures));
        }));
      });
    });
}
function executePromiseTask(promise, fn) {
  try {
    fn((value) => {
      if (promise._state !== null)
        return;
      if (value === promise)
        throw new TypeError("A promise cannot be resolved with itself.");
      var shouldExecuteTick = promise._lib && beginMicroTickScope();
      if (value && typeof value.then === "function") {
        executePromiseTask(promise, (resolve, reject) => {
          value instanceof DexiePromise ? value._then(resolve, reject) : value.then(resolve, reject);
        });
      } else {
        promise._state = true;
        promise._value = value;
        propagateAllListeners(promise);
      }
      if (shouldExecuteTick)
        endMicroTickScope();
    }, handleRejection.bind(null, promise));
  } catch (ex) {
    handleRejection(promise, ex);
  }
}
function handleRejection(promise, reason) {
  rejectingErrors.push(reason);
  if (promise._state !== null)
    return;
  var shouldExecuteTick = promise._lib && beginMicroTickScope();
  reason = rejectionMapper(reason);
  promise._state = false;
  promise._value = reason;
  debug4 && reason !== null && typeof reason === "object" && !reason._promise && tryCatch(() => {
    var origProp = getPropertyDescriptor(reason, "stack");
    reason._promise = promise;
    setProp(reason, "stack", {
      get: () => stack_being_generated ? origProp && (origProp.get ? origProp.get.apply(reason) : origProp.value) : promise.stack
    });
  });
  addPossiblyUnhandledError(promise);
  propagateAllListeners(promise);
  if (shouldExecuteTick)
    endMicroTickScope();
}
function propagateAllListeners(promise) {
  var listeners = promise._listeners;
  promise._listeners = [];
  for (var i2 = 0, len = listeners.length; i2 < len; ++i2) {
    propagateToListener(promise, listeners[i2]);
  }
  var psd = promise._PSD;
  --psd.ref || psd.finalize();
  if (numScheduledCalls === 0) {
    ++numScheduledCalls;
    asap(() => {
      if (--numScheduledCalls === 0)
        finalizePhysicalTick();
    }, []);
  }
}
function propagateToListener(promise, listener) {
  if (promise._state === null) {
    promise._listeners.push(listener);
    return;
  }
  var cb = promise._state ? listener.onFulfilled : listener.onRejected;
  if (cb === null) {
    return (promise._state ? listener.resolve : listener.reject)(promise._value);
  }
  ++listener.psd.ref;
  ++numScheduledCalls;
  asap(callListener, [cb, promise, listener]);
}
function callListener(cb, promise, listener) {
  try {
    currentFulfiller = promise;
    var ret, value = promise._value;
    if (promise._state) {
      ret = cb(value);
    } else {
      if (rejectingErrors.length)
        rejectingErrors = [];
      ret = cb(value);
      if (rejectingErrors.indexOf(value) === -1)
        markErrorAsHandled(promise);
    }
    listener.resolve(ret);
  } catch (e) {
    listener.reject(e);
  } finally {
    currentFulfiller = null;
    if (--numScheduledCalls === 0)
      finalizePhysicalTick();
    --listener.psd.ref || listener.psd.finalize();
  }
}
function getStack(promise, stacks, limit) {
  if (stacks.length === limit)
    return stacks;
  var stack = "";
  if (promise._state === false) {
    var failure = promise._value, errorName, message;
    if (failure != null) {
      errorName = failure.name || "Error";
      message = failure.message || failure;
      stack = prettyStack(failure, 0);
    } else {
      errorName = failure;
      message = "";
    }
    stacks.push(errorName + (message ? ": " + message : "") + stack);
  }
  if (debug4) {
    stack = prettyStack(promise._stackHolder, 2);
    if (stack && stacks.indexOf(stack) === -1)
      stacks.push(stack);
    if (promise._prev)
      getStack(promise._prev, stacks, limit);
  }
  return stacks;
}
function linkToPreviousPromise(promise, prev) {
  var numPrev = prev ? prev._numPrev + 1 : 0;
  if (numPrev < LONG_STACKS_CLIP_LIMIT) {
    promise._prev = prev;
    promise._numPrev = numPrev;
  }
}
function physicalTick() {
  beginMicroTickScope() && endMicroTickScope();
}
function beginMicroTickScope() {
  var wasRootExec = isOutsideMicroTick;
  isOutsideMicroTick = false;
  needsNewPhysicalTick = false;
  return wasRootExec;
}
function endMicroTickScope() {
  var callbacks, i2, l;
  do {
    while (microtickQueue.length > 0) {
      callbacks = microtickQueue;
      microtickQueue = [];
      l = callbacks.length;
      for (i2 = 0; i2 < l; ++i2) {
        var item = callbacks[i2];
        item[0].apply(null, item[1]);
      }
    }
  } while (microtickQueue.length > 0);
  isOutsideMicroTick = true;
  needsNewPhysicalTick = true;
}
function finalizePhysicalTick() {
  var unhandledErrs = unhandledErrors;
  unhandledErrors = [];
  unhandledErrs.forEach((p) => {
    p._PSD.onunhandled.call(null, p._value, p);
  });
  var finalizers = tickFinalizers.slice(0);
  var i2 = finalizers.length;
  while (i2)
    finalizers[--i2]();
}
function run_at_end_of_this_or_next_physical_tick(fn) {
  function finalizer() {
    fn();
    tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
  }
  tickFinalizers.push(finalizer);
  ++numScheduledCalls;
  asap(() => {
    if (--numScheduledCalls === 0)
      finalizePhysicalTick();
  }, []);
}
function addPossiblyUnhandledError(promise) {
  if (!unhandledErrors.some((p) => p._value === promise._value))
    unhandledErrors.push(promise);
}
function markErrorAsHandled(promise) {
  var i2 = unhandledErrors.length;
  while (i2)
    if (unhandledErrors[--i2]._value === promise._value) {
      unhandledErrors.splice(i2, 1);
      return;
    }
}
function PromiseReject(reason) {
  return new DexiePromise(INTERNAL, false, reason);
}
function wrap(fn, errorCatcher) {
  var psd = PSD;
  return function() {
    var wasRootExec = beginMicroTickScope(), outerScope = PSD;
    try {
      switchToZone(psd, true);
      return fn.apply(this, arguments);
    } catch (e) {
      errorCatcher && errorCatcher(e);
    } finally {
      switchToZone(outerScope, false);
      if (wasRootExec)
        endMicroTickScope();
    }
  };
}
var task = { awaits: 0, echoes: 0, id: 0 };
var taskCounter = 0;
var zoneStack = [];
var zoneEchoes = 0;
var totalEchoes = 0;
var zone_id_counter = 0;
function newScope(fn, props2, a1, a2) {
  var parent = PSD, psd = Object.create(parent);
  psd.parent = parent;
  psd.ref = 0;
  psd.global = false;
  psd.id = ++zone_id_counter;
  var globalEnv = globalPSD.env;
  psd.env = patchGlobalPromise ? {
    Promise: DexiePromise,
    PromiseProp: { value: DexiePromise, configurable: true, writable: true },
    all: DexiePromise.all,
    race: DexiePromise.race,
    allSettled: DexiePromise.allSettled,
    any: DexiePromise.any,
    resolve: DexiePromise.resolve,
    reject: DexiePromise.reject,
    nthen: getPatchedPromiseThen(globalEnv.nthen, psd),
    gthen: getPatchedPromiseThen(globalEnv.gthen, psd)
  } : {};
  if (props2)
    extend(psd, props2);
  ++parent.ref;
  psd.finalize = function() {
    --this.parent.ref || this.parent.finalize();
  };
  var rv = usePSD(psd, fn, a1, a2);
  if (psd.ref === 0)
    psd.finalize();
  return rv;
}
function incrementExpectedAwaits() {
  if (!task.id)
    task.id = ++taskCounter;
  ++task.awaits;
  task.echoes += ZONE_ECHO_LIMIT;
  return task.id;
}
function decrementExpectedAwaits() {
  if (!task.awaits)
    return false;
  if (--task.awaits === 0)
    task.id = 0;
  task.echoes = task.awaits * ZONE_ECHO_LIMIT;
  return true;
}
if (("" + nativePromiseThen).indexOf("[native code]") === -1) {
  incrementExpectedAwaits = decrementExpectedAwaits = nop;
}
function onPossibleParallellAsync(possiblePromise) {
  if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
    incrementExpectedAwaits();
    return possiblePromise.then((x) => {
      decrementExpectedAwaits();
      return x;
    }, (e) => {
      decrementExpectedAwaits();
      return rejection(e);
    });
  }
  return possiblePromise;
}
function zoneEnterEcho(targetZone) {
  ++totalEchoes;
  if (!task.echoes || --task.echoes === 0) {
    task.echoes = task.id = 0;
  }
  zoneStack.push(PSD);
  switchToZone(targetZone, true);
}
function zoneLeaveEcho() {
  var zone = zoneStack[zoneStack.length - 1];
  zoneStack.pop();
  switchToZone(zone, false);
}
function switchToZone(targetZone, bEnteringZone) {
  var currentZone = PSD;
  if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
    enqueueNativeMicroTask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
  }
  if (targetZone === PSD)
    return;
  PSD = targetZone;
  if (currentZone === globalPSD)
    globalPSD.env = snapShot();
  if (patchGlobalPromise) {
    var GlobalPromise = globalPSD.env.Promise;
    var targetEnv = targetZone.env;
    nativePromiseProto.then = targetEnv.nthen;
    GlobalPromise.prototype.then = targetEnv.gthen;
    if (currentZone.global || targetZone.global) {
      Object.defineProperty(_global, "Promise", targetEnv.PromiseProp);
      GlobalPromise.all = targetEnv.all;
      GlobalPromise.race = targetEnv.race;
      GlobalPromise.resolve = targetEnv.resolve;
      GlobalPromise.reject = targetEnv.reject;
      if (targetEnv.allSettled)
        GlobalPromise.allSettled = targetEnv.allSettled;
      if (targetEnv.any)
        GlobalPromise.any = targetEnv.any;
    }
  }
}
function snapShot() {
  var GlobalPromise = _global.Promise;
  return patchGlobalPromise ? {
    Promise: GlobalPromise,
    PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
    all: GlobalPromise.all,
    race: GlobalPromise.race,
    allSettled: GlobalPromise.allSettled,
    any: GlobalPromise.any,
    resolve: GlobalPromise.resolve,
    reject: GlobalPromise.reject,
    nthen: nativePromiseProto.then,
    gthen: GlobalPromise.prototype.then
  } : {};
}
function usePSD(psd, fn, a1, a2, a3) {
  var outerScope = PSD;
  try {
    switchToZone(psd, true);
    return fn(a1, a2, a3);
  } finally {
    switchToZone(outerScope, false);
  }
}
function enqueueNativeMicroTask(job) {
  nativePromiseThen.call(resolvedNativePromise, job);
}
function nativeAwaitCompatibleWrap(fn, zone, possibleAwait, cleanup) {
  return typeof fn !== "function" ? fn : function() {
    var outerZone = PSD;
    if (possibleAwait)
      incrementExpectedAwaits();
    switchToZone(zone, true);
    try {
      return fn.apply(this, arguments);
    } finally {
      switchToZone(outerZone, false);
      if (cleanup)
        enqueueNativeMicroTask(decrementExpectedAwaits);
    }
  };
}
function getPatchedPromiseThen(origThen, zone) {
  return function(onResolved, onRejected) {
    return origThen.call(this, nativeAwaitCompatibleWrap(onResolved, zone), nativeAwaitCompatibleWrap(onRejected, zone));
  };
}
var UNHANDLEDREJECTION = "unhandledrejection";
function globalError(err, promise) {
  var rv;
  try {
    rv = promise.onuncatched(err);
  } catch (e) {
  }
  if (rv !== false)
    try {
      var event, eventData = { promise, reason: err };
      if (_global.document && document.createEvent) {
        event = document.createEvent("Event");
        event.initEvent(UNHANDLEDREJECTION, true, true);
        extend(event, eventData);
      } else if (_global.CustomEvent) {
        event = new CustomEvent(UNHANDLEDREJECTION, { detail: eventData });
        extend(event, eventData);
      }
      if (event && _global.dispatchEvent) {
        dispatchEvent(event);
        if (!_global.PromiseRejectionEvent && _global.onunhandledrejection)
          try {
            _global.onunhandledrejection(event);
          } catch (_) {
          }
      }
      if (debug4 && event && !event.defaultPrevented) {
        console.warn(`Unhandled rejection: ${err.stack || err}`);
      }
    } catch (e) {
    }
}
var rejection = DexiePromise.reject;
function tempTransaction(db2, mode, storeNames, fn) {
  if (!db2.idbdb || !db2._state.openComplete && (!PSD.letThrough && !db2._vip)) {
    if (db2._state.openComplete) {
      return rejection(new exceptions.DatabaseClosed(db2._state.dbOpenError));
    }
    if (!db2._state.isBeingOpened) {
      if (!db2._options.autoOpen)
        return rejection(new exceptions.DatabaseClosed());
      db2.open().catch(nop);
    }
    return db2._state.dbReadyPromise.then(() => tempTransaction(db2, mode, storeNames, fn));
  } else {
    var trans = db2._createTransaction(mode, storeNames, db2._dbSchema);
    try {
      trans.create();
      db2._state.PR1398_maxLoop = 3;
    } catch (ex) {
      if (ex.name === errnames.InvalidState && db2.isOpen() && --db2._state.PR1398_maxLoop > 0) {
        console.warn("Dexie: Need to reopen db");
        db2._close();
        return db2.open().then(() => tempTransaction(db2, mode, storeNames, fn));
      }
      return rejection(ex);
    }
    return trans._promise(mode, (resolve, reject) => {
      return newScope(() => {
        PSD.trans = trans;
        return fn(resolve, reject, trans);
      });
    }).then((result) => {
      return trans._completion.then(() => result);
    });
  }
}
var DEXIE_VERSION = "3.2.4";
var maxString = String.fromCharCode(65535);
var minKey = -Infinity;
var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
var STRING_EXPECTED = "String expected.";
var connections = [];
var isIEOrEdge = typeof navigator !== "undefined" && /(MSIE|Trident|Edge)/.test(navigator.userAgent);
var hasIEDeleteObjectStoreBug = isIEOrEdge;
var hangsOnDeleteLargeKeyRange = isIEOrEdge;
var dexieStackFrameFilter = (frame) => !/(dexie\.js|dexie\.min\.js)/.test(frame);
var DBNAMES_DB = "__dbnames";
var READONLY = "readonly";
var READWRITE = "readwrite";
function combine(filter1, filter2) {
  return filter1 ? filter2 ? function() {
    return filter1.apply(this, arguments) && filter2.apply(this, arguments);
  } : filter1 : filter2;
}
var AnyRange = {
  type: 3,
  lower: -Infinity,
  lowerOpen: false,
  upper: [[]],
  upperOpen: false
};
function workaroundForUndefinedPrimKey(keyPath) {
  return typeof keyPath === "string" && !/\./.test(keyPath) ? (obj) => {
    if (obj[keyPath] === void 0 && keyPath in obj) {
      obj = deepClone(obj);
      delete obj[keyPath];
    }
    return obj;
  } : (obj) => obj;
}
var Table = class {
  _trans(mode, fn, writeLocked) {
    const trans = this._tx || PSD.trans;
    const tableName = this.name;
    function checkTableInTransaction(resolve, reject, trans2) {
      if (!trans2.schema[tableName])
        throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
      return fn(trans2.idbtrans, trans2);
    }
    const wasRootExec = beginMicroTickScope();
    try {
      return trans && trans.db === this.db ? trans === PSD.trans ? trans._promise(mode, checkTableInTransaction, writeLocked) : newScope(() => trans._promise(mode, checkTableInTransaction, writeLocked), { trans, transless: PSD.transless || PSD }) : tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
    } finally {
      if (wasRootExec)
        endMicroTickScope();
    }
  }
  get(keyOrCrit, cb) {
    if (keyOrCrit && keyOrCrit.constructor === Object)
      return this.where(keyOrCrit).first(cb);
    return this._trans("readonly", (trans) => {
      return this.core.get({ trans, key: keyOrCrit }).then((res) => this.hook.reading.fire(res));
    }).then(cb);
  }
  where(indexOrCrit) {
    if (typeof indexOrCrit === "string")
      return new this.db.WhereClause(this, indexOrCrit);
    if (isArray(indexOrCrit))
      return new this.db.WhereClause(this, `[${indexOrCrit.join("+")}]`);
    const keyPaths = keys(indexOrCrit);
    if (keyPaths.length === 1)
      return this.where(keyPaths[0]).equals(indexOrCrit[keyPaths[0]]);
    const compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter((ix) => ix.compound && keyPaths.every((keyPath) => ix.keyPath.indexOf(keyPath) >= 0) && ix.keyPath.every((keyPath) => keyPaths.indexOf(keyPath) >= 0))[0];
    if (compoundIndex && this.db._maxKey !== maxString)
      return this.where(compoundIndex.name).equals(compoundIndex.keyPath.map((kp) => indexOrCrit[kp]));
    if (!compoundIndex && debug4)
      console.warn(`The query ${JSON.stringify(indexOrCrit)} on ${this.name} would benefit of a compound index [${keyPaths.join("+")}]`);
    const { idxByName } = this.schema;
    const idb = this.db._deps.indexedDB;
    function equals(a, b) {
      try {
        return idb.cmp(a, b) === 0;
      } catch (e) {
        return false;
      }
    }
    const [idx, filterFunction] = keyPaths.reduce(([prevIndex, prevFilterFn], keyPath) => {
      const index = idxByName[keyPath];
      const value = indexOrCrit[keyPath];
      return [
        prevIndex || index,
        prevIndex || !index ? combine(prevFilterFn, index && index.multi ? (x) => {
          const prop = getByKeyPath(x, keyPath);
          return isArray(prop) && prop.some((item) => equals(value, item));
        } : (x) => equals(value, getByKeyPath(x, keyPath))) : prevFilterFn
      ];
    }, [null, null]);
    return idx ? this.where(idx.name).equals(indexOrCrit[idx.keyPath]).filter(filterFunction) : compoundIndex ? this.filter(filterFunction) : this.where(keyPaths).equals("");
  }
  filter(filterFunction) {
    return this.toCollection().and(filterFunction);
  }
  count(thenShortcut) {
    return this.toCollection().count(thenShortcut);
  }
  offset(offset) {
    return this.toCollection().offset(offset);
  }
  limit(numRows) {
    return this.toCollection().limit(numRows);
  }
  each(callback) {
    return this.toCollection().each(callback);
  }
  toArray(thenShortcut) {
    return this.toCollection().toArray(thenShortcut);
  }
  toCollection() {
    return new this.db.Collection(new this.db.WhereClause(this));
  }
  orderBy(index) {
    return new this.db.Collection(new this.db.WhereClause(this, isArray(index) ? `[${index.join("+")}]` : index));
  }
  reverse() {
    return this.toCollection().reverse();
  }
  mapToClass(constructor) {
    this.schema.mappedClass = constructor;
    const readHook = (obj) => {
      if (!obj)
        return obj;
      const res = Object.create(constructor.prototype);
      for (var m in obj)
        if (hasOwn(obj, m))
          try {
            res[m] = obj[m];
          } catch (_) {
          }
      return res;
    };
    if (this.schema.readHook) {
      this.hook.reading.unsubscribe(this.schema.readHook);
    }
    this.schema.readHook = readHook;
    this.hook("reading", readHook);
    return constructor;
  }
  defineClass() {
    function Class(content) {
      extend(this, content);
    }
    return this.mapToClass(Class);
  }
  add(obj, key) {
    const { auto, keyPath } = this.schema.primKey;
    let objToAdd = obj;
    if (keyPath && auto) {
      objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
    }
    return this._trans("readwrite", (trans) => {
      return this.core.mutate({ trans, type: "add", keys: key != null ? [key] : null, values: [objToAdd] });
    }).then((res) => res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult).then((lastResult) => {
      if (keyPath) {
        try {
          setByKeyPath(obj, keyPath, lastResult);
        } catch (_) {
        }
      }
      return lastResult;
    });
  }
  update(keyOrObject, modifications) {
    if (typeof keyOrObject === "object" && !isArray(keyOrObject)) {
      const key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
      if (key === void 0)
        return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
      try {
        if (typeof modifications !== "function") {
          keys(modifications).forEach((keyPath) => {
            setByKeyPath(keyOrObject, keyPath, modifications[keyPath]);
          });
        } else {
          modifications(keyOrObject, { value: keyOrObject, primKey: key });
        }
      } catch (_a2) {
      }
      return this.where(":id").equals(key).modify(modifications);
    } else {
      return this.where(":id").equals(keyOrObject).modify(modifications);
    }
  }
  put(obj, key) {
    const { auto, keyPath } = this.schema.primKey;
    let objToAdd = obj;
    if (keyPath && auto) {
      objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
    }
    return this._trans("readwrite", (trans) => this.core.mutate({ trans, type: "put", values: [objToAdd], keys: key != null ? [key] : null })).then((res) => res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult).then((lastResult) => {
      if (keyPath) {
        try {
          setByKeyPath(obj, keyPath, lastResult);
        } catch (_) {
        }
      }
      return lastResult;
    });
  }
  delete(key) {
    return this._trans("readwrite", (trans) => this.core.mutate({ trans, type: "delete", keys: [key] })).then((res) => res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0);
  }
  clear() {
    return this._trans("readwrite", (trans) => this.core.mutate({ trans, type: "deleteRange", range: AnyRange })).then((res) => res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0);
  }
  bulkGet(keys2) {
    return this._trans("readonly", (trans) => {
      return this.core.getMany({
        keys: keys2,
        trans
      }).then((result) => result.map((res) => this.hook.reading.fire(res)));
    });
  }
  bulkAdd(objects, keysOrOptions, options) {
    const keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
    options = options || (keys2 ? void 0 : keysOrOptions);
    const wantResults = options ? options.allKeys : void 0;
    return this._trans("readwrite", (trans) => {
      const { auto, keyPath } = this.schema.primKey;
      if (keyPath && keys2)
        throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
      if (keys2 && keys2.length !== objects.length)
        throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
      const numObjects = objects.length;
      let objectsToAdd = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
      return this.core.mutate({ trans, type: "add", keys: keys2, values: objectsToAdd, wantResults }).then(({ numFailures, results, lastResult, failures }) => {
        const result = wantResults ? results : lastResult;
        if (numFailures === 0)
          return result;
        throw new BulkError(`${this.name}.bulkAdd(): ${numFailures} of ${numObjects} operations failed`, failures);
      });
    });
  }
  bulkPut(objects, keysOrOptions, options) {
    const keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
    options = options || (keys2 ? void 0 : keysOrOptions);
    const wantResults = options ? options.allKeys : void 0;
    return this._trans("readwrite", (trans) => {
      const { auto, keyPath } = this.schema.primKey;
      if (keyPath && keys2)
        throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
      if (keys2 && keys2.length !== objects.length)
        throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
      const numObjects = objects.length;
      let objectsToPut = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
      return this.core.mutate({ trans, type: "put", keys: keys2, values: objectsToPut, wantResults }).then(({ numFailures, results, lastResult, failures }) => {
        const result = wantResults ? results : lastResult;
        if (numFailures === 0)
          return result;
        throw new BulkError(`${this.name}.bulkPut(): ${numFailures} of ${numObjects} operations failed`, failures);
      });
    });
  }
  bulkDelete(keys2) {
    const numKeys = keys2.length;
    return this._trans("readwrite", (trans) => {
      return this.core.mutate({ trans, type: "delete", keys: keys2 });
    }).then(({ numFailures, lastResult, failures }) => {
      if (numFailures === 0)
        return lastResult;
      throw new BulkError(`${this.name}.bulkDelete(): ${numFailures} of ${numKeys} operations failed`, failures);
    });
  }
};
function Events(ctx) {
  var evs = {};
  var rv = function(eventName, subscriber) {
    if (subscriber) {
      var i3 = arguments.length, args = new Array(i3 - 1);
      while (--i3)
        args[i3 - 1] = arguments[i3];
      evs[eventName].subscribe.apply(null, args);
      return ctx;
    } else if (typeof eventName === "string") {
      return evs[eventName];
    }
  };
  rv.addEventType = add2;
  for (var i2 = 1, l = arguments.length; i2 < l; ++i2) {
    add2(arguments[i2]);
  }
  return rv;
  function add2(eventName, chainFunction, defaultFunction) {
    if (typeof eventName === "object")
      return addConfiguredEvents(eventName);
    if (!chainFunction)
      chainFunction = reverseStoppableEventChain;
    if (!defaultFunction)
      defaultFunction = nop;
    var context = {
      subscribers: [],
      fire: defaultFunction,
      subscribe: function(cb) {
        if (context.subscribers.indexOf(cb) === -1) {
          context.subscribers.push(cb);
          context.fire = chainFunction(context.fire, cb);
        }
      },
      unsubscribe: function(cb) {
        context.subscribers = context.subscribers.filter(function(fn) {
          return fn !== cb;
        });
        context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
      }
    };
    evs[eventName] = rv[eventName] = context;
    return context;
  }
  function addConfiguredEvents(cfg) {
    keys(cfg).forEach(function(eventName) {
      var args = cfg[eventName];
      if (isArray(args)) {
        add2(eventName, cfg[eventName][0], cfg[eventName][1]);
      } else if (args === "asap") {
        var context = add2(eventName, mirror, function fire() {
          var i3 = arguments.length, args2 = new Array(i3);
          while (i3--)
            args2[i3] = arguments[i3];
          context.subscribers.forEach(function(fn) {
            asap$1(function fireEvent() {
              fn.apply(null, args2);
            });
          });
        });
      } else
        throw new exceptions.InvalidArgument("Invalid event config");
    });
  }
}
function makeClassConstructor(prototype, constructor) {
  derive(constructor).from({ prototype });
  return constructor;
}
function createTableConstructor(db2) {
  return makeClassConstructor(Table.prototype, function Table2(name, tableSchema, trans) {
    this.db = db2;
    this._tx = trans;
    this.name = name;
    this.schema = tableSchema;
    this.hook = db2._allTables[name] ? db2._allTables[name].hook : Events(null, {
      "creating": [hookCreatingChain, nop],
      "reading": [pureFunctionChain, mirror],
      "updating": [hookUpdatingChain, nop],
      "deleting": [hookDeletingChain, nop]
    });
  });
}
function isPlainKeyRange(ctx, ignoreLimitFilter) {
  return !(ctx.filter || ctx.algorithm || ctx.or) && (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
}
function addFilter(ctx, fn) {
  ctx.filter = combine(ctx.filter, fn);
}
function addReplayFilter(ctx, factory, isLimitFilter) {
  var curr = ctx.replayFilter;
  ctx.replayFilter = curr ? () => combine(curr(), factory()) : factory;
  ctx.justLimit = isLimitFilter && !curr;
}
function addMatchFilter(ctx, fn) {
  ctx.isMatch = combine(ctx.isMatch, fn);
}
function getIndexOrStore(ctx, coreSchema) {
  if (ctx.isPrimKey)
    return coreSchema.primaryKey;
  const index = coreSchema.getIndexByKeyPath(ctx.index);
  if (!index)
    throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
  return index;
}
function openCursor(ctx, coreTable, trans) {
  const index = getIndexOrStore(ctx, coreTable.schema);
  return coreTable.openCursor({
    trans,
    values: !ctx.keysOnly,
    reverse: ctx.dir === "prev",
    unique: !!ctx.unique,
    query: {
      index,
      range: ctx.range
    }
  });
}
function iter(ctx, fn, coreTrans, coreTable) {
  const filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
  if (!ctx.or) {
    return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
  } else {
    const set = {};
    const union = (item, cursor, advance) => {
      if (!filter || filter(cursor, advance, (result) => cursor.stop(result), (err) => cursor.fail(err))) {
        var primaryKey = cursor.primaryKey;
        var key = "" + primaryKey;
        if (key === "[object ArrayBuffer]")
          key = "" + new Uint8Array(primaryKey);
        if (!hasOwn(set, key)) {
          set[key] = true;
          fn(item, cursor, advance);
        }
      }
    };
    return Promise.all([
      ctx.or._iterate(union, coreTrans),
      iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
    ]);
  }
}
function iterate(cursorPromise, filter, fn, valueMapper) {
  var mappedFn = valueMapper ? (x, c, a) => fn(valueMapper(x), c, a) : fn;
  var wrappedFn = wrap(mappedFn);
  return cursorPromise.then((cursor) => {
    if (cursor) {
      return cursor.start(() => {
        var c = () => cursor.continue();
        if (!filter || filter(cursor, (advancer) => c = advancer, (val) => {
          cursor.stop(val);
          c = nop;
        }, (e) => {
          cursor.fail(e);
          c = nop;
        }))
          wrappedFn(cursor.value, cursor, (advancer) => c = advancer);
        c();
      });
    }
  });
}
function cmp(a, b) {
  try {
    const ta = type(a);
    const tb = type(b);
    if (ta !== tb) {
      if (ta === "Array")
        return 1;
      if (tb === "Array")
        return -1;
      if (ta === "binary")
        return 1;
      if (tb === "binary")
        return -1;
      if (ta === "string")
        return 1;
      if (tb === "string")
        return -1;
      if (ta === "Date")
        return 1;
      if (tb !== "Date")
        return NaN;
      return -1;
    }
    switch (ta) {
      case "number":
      case "Date":
      case "string":
        return a > b ? 1 : a < b ? -1 : 0;
      case "binary": {
        return compareUint8Arrays(getUint8Array(a), getUint8Array(b));
      }
      case "Array":
        return compareArrays(a, b);
    }
  } catch (_a2) {
  }
  return NaN;
}
function compareArrays(a, b) {
  const al = a.length;
  const bl = b.length;
  const l = al < bl ? al : bl;
  for (let i2 = 0; i2 < l; ++i2) {
    const res = cmp(a[i2], b[i2]);
    if (res !== 0)
      return res;
  }
  return al === bl ? 0 : al < bl ? -1 : 1;
}
function compareUint8Arrays(a, b) {
  const al = a.length;
  const bl = b.length;
  const l = al < bl ? al : bl;
  for (let i2 = 0; i2 < l; ++i2) {
    if (a[i2] !== b[i2])
      return a[i2] < b[i2] ? -1 : 1;
  }
  return al === bl ? 0 : al < bl ? -1 : 1;
}
function type(x) {
  const t = typeof x;
  if (t !== "object")
    return t;
  if (ArrayBuffer.isView(x))
    return "binary";
  const tsTag = toStringTag(x);
  return tsTag === "ArrayBuffer" ? "binary" : tsTag;
}
function getUint8Array(a) {
  if (a instanceof Uint8Array)
    return a;
  if (ArrayBuffer.isView(a))
    return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
  return new Uint8Array(a);
}
var Collection = class {
  _read(fn, cb) {
    var ctx = this._ctx;
    return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readonly", fn).then(cb);
  }
  _write(fn) {
    var ctx = this._ctx;
    return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readwrite", fn, "locked");
  }
  _addAlgorithm(fn) {
    var ctx = this._ctx;
    ctx.algorithm = combine(ctx.algorithm, fn);
  }
  _iterate(fn, coreTrans) {
    return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
  }
  clone(props2) {
    var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
    if (props2)
      extend(ctx, props2);
    rv._ctx = ctx;
    return rv;
  }
  raw() {
    this._ctx.valueMapper = null;
    return this;
  }
  each(fn) {
    var ctx = this._ctx;
    return this._read((trans) => iter(ctx, fn, trans, ctx.table.core));
  }
  count(cb) {
    return this._read((trans) => {
      const ctx = this._ctx;
      const coreTable = ctx.table.core;
      if (isPlainKeyRange(ctx, true)) {
        return coreTable.count({
          trans,
          query: {
            index: getIndexOrStore(ctx, coreTable.schema),
            range: ctx.range
          }
        }).then((count2) => Math.min(count2, ctx.limit));
      } else {
        var count = 0;
        return iter(ctx, () => {
          ++count;
          return false;
        }, trans, coreTable).then(() => count);
      }
    }).then(cb);
  }
  sortBy(keyPath, cb) {
    const parts = keyPath.split(".").reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
    function getval(obj, i2) {
      if (i2)
        return getval(obj[parts[i2]], i2 - 1);
      return obj[lastPart];
    }
    var order = this._ctx.dir === "next" ? 1 : -1;
    function sorter(a, b) {
      var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
      return aVal < bVal ? -order : aVal > bVal ? order : 0;
    }
    return this.toArray(function(a) {
      return a.sort(sorter);
    }).then(cb);
  }
  toArray(cb) {
    return this._read((trans) => {
      var ctx = this._ctx;
      if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
        const { valueMapper } = ctx;
        const index = getIndexOrStore(ctx, ctx.table.core.schema);
        return ctx.table.core.query({
          trans,
          limit: ctx.limit,
          values: true,
          query: {
            index,
            range: ctx.range
          }
        }).then(({ result }) => valueMapper ? result.map(valueMapper) : result);
      } else {
        const a = [];
        return iter(ctx, (item) => a.push(item), trans, ctx.table.core).then(() => a);
      }
    }, cb);
  }
  offset(offset) {
    var ctx = this._ctx;
    if (offset <= 0)
      return this;
    ctx.offset += offset;
    if (isPlainKeyRange(ctx)) {
      addReplayFilter(ctx, () => {
        var offsetLeft = offset;
        return (cursor, advance) => {
          if (offsetLeft === 0)
            return true;
          if (offsetLeft === 1) {
            --offsetLeft;
            return false;
          }
          advance(() => {
            cursor.advance(offsetLeft);
            offsetLeft = 0;
          });
          return false;
        };
      });
    } else {
      addReplayFilter(ctx, () => {
        var offsetLeft = offset;
        return () => --offsetLeft < 0;
      });
    }
    return this;
  }
  limit(numRows) {
    this._ctx.limit = Math.min(this._ctx.limit, numRows);
    addReplayFilter(this._ctx, () => {
      var rowsLeft = numRows;
      return function(cursor, advance, resolve) {
        if (--rowsLeft <= 0)
          advance(resolve);
        return rowsLeft >= 0;
      };
    }, true);
    return this;
  }
  until(filterFunction, bIncludeStopEntry) {
    addFilter(this._ctx, function(cursor, advance, resolve) {
      if (filterFunction(cursor.value)) {
        advance(resolve);
        return bIncludeStopEntry;
      } else {
        return true;
      }
    });
    return this;
  }
  first(cb) {
    return this.limit(1).toArray(function(a) {
      return a[0];
    }).then(cb);
  }
  last(cb) {
    return this.reverse().first(cb);
  }
  filter(filterFunction) {
    addFilter(this._ctx, function(cursor) {
      return filterFunction(cursor.value);
    });
    addMatchFilter(this._ctx, filterFunction);
    return this;
  }
  and(filter) {
    return this.filter(filter);
  }
  or(indexName) {
    return new this.db.WhereClause(this._ctx.table, indexName, this);
  }
  reverse() {
    this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev";
    if (this._ondirectionchange)
      this._ondirectionchange(this._ctx.dir);
    return this;
  }
  desc() {
    return this.reverse();
  }
  eachKey(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    return this.each(function(val, cursor) {
      cb(cursor.key, cursor);
    });
  }
  eachUniqueKey(cb) {
    this._ctx.unique = "unique";
    return this.eachKey(cb);
  }
  eachPrimaryKey(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    return this.each(function(val, cursor) {
      cb(cursor.primaryKey, cursor);
    });
  }
  keys(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    var a = [];
    return this.each(function(item, cursor) {
      a.push(cursor.key);
    }).then(function() {
      return a;
    }).then(cb);
  }
  primaryKeys(cb) {
    var ctx = this._ctx;
    if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
      return this._read((trans) => {
        var index = getIndexOrStore(ctx, ctx.table.core.schema);
        return ctx.table.core.query({
          trans,
          values: false,
          limit: ctx.limit,
          query: {
            index,
            range: ctx.range
          }
        });
      }).then(({ result }) => result).then(cb);
    }
    ctx.keysOnly = !ctx.isMatch;
    var a = [];
    return this.each(function(item, cursor) {
      a.push(cursor.primaryKey);
    }).then(function() {
      return a;
    }).then(cb);
  }
  uniqueKeys(cb) {
    this._ctx.unique = "unique";
    return this.keys(cb);
  }
  firstKey(cb) {
    return this.limit(1).keys(function(a) {
      return a[0];
    }).then(cb);
  }
  lastKey(cb) {
    return this.reverse().firstKey(cb);
  }
  distinct() {
    var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
    if (!idx || !idx.multi)
      return this;
    var set = {};
    addFilter(this._ctx, function(cursor) {
      var strKey = cursor.primaryKey.toString();
      var found = hasOwn(set, strKey);
      set[strKey] = true;
      return !found;
    });
    return this;
  }
  modify(changes) {
    var ctx = this._ctx;
    return this._write((trans) => {
      var modifyer;
      if (typeof changes === "function") {
        modifyer = changes;
      } else {
        var keyPaths = keys(changes);
        var numKeys = keyPaths.length;
        modifyer = function(item) {
          var anythingModified = false;
          for (var i2 = 0; i2 < numKeys; ++i2) {
            var keyPath = keyPaths[i2], val = changes[keyPath];
            if (getByKeyPath(item, keyPath) !== val) {
              setByKeyPath(item, keyPath, val);
              anythingModified = true;
            }
          }
          return anythingModified;
        };
      }
      const coreTable = ctx.table.core;
      const { outbound, extractKey } = coreTable.schema.primaryKey;
      const limit = this.db._options.modifyChunkSize || 200;
      const totalFailures = [];
      let successCount = 0;
      const failedKeys = [];
      const applyMutateResult = (expectedCount, res) => {
        const { failures, numFailures } = res;
        successCount += expectedCount - numFailures;
        for (let pos of keys(failures)) {
          totalFailures.push(failures[pos]);
        }
      };
      return this.clone().primaryKeys().then((keys2) => {
        const nextChunk = (offset) => {
          const count = Math.min(limit, keys2.length - offset);
          return coreTable.getMany({
            trans,
            keys: keys2.slice(offset, offset + count),
            cache: "immutable"
          }).then((values) => {
            const addValues = [];
            const putValues = [];
            const putKeys = outbound ? [] : null;
            const deleteKeys = [];
            for (let i2 = 0; i2 < count; ++i2) {
              const origValue = values[i2];
              const ctx2 = {
                value: deepClone(origValue),
                primKey: keys2[offset + i2]
              };
              if (modifyer.call(ctx2, ctx2.value, ctx2) !== false) {
                if (ctx2.value == null) {
                  deleteKeys.push(keys2[offset + i2]);
                } else if (!outbound && cmp(extractKey(origValue), extractKey(ctx2.value)) !== 0) {
                  deleteKeys.push(keys2[offset + i2]);
                  addValues.push(ctx2.value);
                } else {
                  putValues.push(ctx2.value);
                  if (outbound)
                    putKeys.push(keys2[offset + i2]);
                }
              }
            }
            const criteria = isPlainKeyRange(ctx) && ctx.limit === Infinity && (typeof changes !== "function" || changes === deleteCallback) && {
              index: ctx.index,
              range: ctx.range
            };
            return Promise.resolve(addValues.length > 0 && coreTable.mutate({ trans, type: "add", values: addValues }).then((res) => {
              for (let pos in res.failures) {
                deleteKeys.splice(parseInt(pos), 1);
              }
              applyMutateResult(addValues.length, res);
            })).then(() => (putValues.length > 0 || criteria && typeof changes === "object") && coreTable.mutate({
              trans,
              type: "put",
              keys: putKeys,
              values: putValues,
              criteria,
              changeSpec: typeof changes !== "function" && changes
            }).then((res) => applyMutateResult(putValues.length, res))).then(() => (deleteKeys.length > 0 || criteria && changes === deleteCallback) && coreTable.mutate({
              trans,
              type: "delete",
              keys: deleteKeys,
              criteria
            }).then((res) => applyMutateResult(deleteKeys.length, res))).then(() => {
              return keys2.length > offset + count && nextChunk(offset + limit);
            });
          });
        };
        return nextChunk(0).then(() => {
          if (totalFailures.length > 0)
            throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
          return keys2.length;
        });
      });
    });
  }
  delete() {
    var ctx = this._ctx, range = ctx.range;
    if (isPlainKeyRange(ctx) && (ctx.isPrimKey && !hangsOnDeleteLargeKeyRange || range.type === 3)) {
      return this._write((trans) => {
        const { primaryKey } = ctx.table.core.schema;
        const coreRange = range;
        return ctx.table.core.count({ trans, query: { index: primaryKey, range: coreRange } }).then((count) => {
          return ctx.table.core.mutate({ trans, type: "deleteRange", range: coreRange }).then(({ failures, lastResult, results, numFailures }) => {
            if (numFailures)
              throw new ModifyError("Could not delete some values", Object.keys(failures).map((pos) => failures[pos]), count - numFailures);
            return count - numFailures;
          });
        });
      });
    }
    return this.modify(deleteCallback);
  }
};
var deleteCallback = (value, ctx) => ctx.value = null;
function createCollectionConstructor(db2) {
  return makeClassConstructor(Collection.prototype, function Collection2(whereClause, keyRangeGenerator) {
    this.db = db2;
    let keyRange = AnyRange, error = null;
    if (keyRangeGenerator)
      try {
        keyRange = keyRangeGenerator();
      } catch (ex) {
        error = ex;
      }
    const whereCtx = whereClause._ctx;
    const table = whereCtx.table;
    const readingHook = table.hook.reading.fire;
    this._ctx = {
      table,
      index: whereCtx.index,
      isPrimKey: !whereCtx.index || table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name,
      range: keyRange,
      keysOnly: false,
      dir: "next",
      unique: "",
      algorithm: null,
      filter: null,
      replayFilter: null,
      justLimit: true,
      isMatch: null,
      offset: 0,
      limit: Infinity,
      error,
      or: whereCtx.or,
      valueMapper: readingHook !== mirror ? readingHook : null
    };
  });
}
function simpleCompare(a, b) {
  return a < b ? -1 : a === b ? 0 : 1;
}
function simpleCompareReverse(a, b) {
  return a > b ? -1 : a === b ? 0 : 1;
}
function fail(collectionOrWhereClause, err, T) {
  var collection2 = collectionOrWhereClause instanceof WhereClause ? new collectionOrWhereClause.Collection(collectionOrWhereClause) : collectionOrWhereClause;
  collection2._ctx.error = T ? new T(err) : new TypeError(err);
  return collection2;
}
function emptyCollection(whereClause) {
  return new whereClause.Collection(whereClause, () => rangeEqual("")).limit(0);
}
function upperFactory(dir) {
  return dir === "next" ? (s) => s.toUpperCase() : (s) => s.toLowerCase();
}
function lowerFactory(dir) {
  return dir === "next" ? (s) => s.toLowerCase() : (s) => s.toUpperCase();
}
function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp2, dir) {
  var length = Math.min(key.length, lowerNeedle.length);
  var llp = -1;
  for (var i2 = 0; i2 < length; ++i2) {
    var lwrKeyChar = lowerKey[i2];
    if (lwrKeyChar !== lowerNeedle[i2]) {
      if (cmp2(key[i2], upperNeedle[i2]) < 0)
        return key.substr(0, i2) + upperNeedle[i2] + upperNeedle.substr(i2 + 1);
      if (cmp2(key[i2], lowerNeedle[i2]) < 0)
        return key.substr(0, i2) + lowerNeedle[i2] + upperNeedle.substr(i2 + 1);
      if (llp >= 0)
        return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
      return null;
    }
    if (cmp2(key[i2], lwrKeyChar) < 0)
      llp = i2;
  }
  if (length < lowerNeedle.length && dir === "next")
    return key + upperNeedle.substr(key.length);
  if (length < key.length && dir === "prev")
    return key.substr(0, upperNeedle.length);
  return llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1);
}
function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
  var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
  if (!needles.every((s) => typeof s === "string")) {
    return fail(whereClause, STRING_EXPECTED);
  }
  function initDirection(dir) {
    upper = upperFactory(dir);
    lower = lowerFactory(dir);
    compare = dir === "next" ? simpleCompare : simpleCompareReverse;
    var needleBounds = needles.map(function(needle) {
      return { lower: lower(needle), upper: upper(needle) };
    }).sort(function(a, b) {
      return compare(a.lower, b.lower);
    });
    upperNeedles = needleBounds.map(function(nb) {
      return nb.upper;
    });
    lowerNeedles = needleBounds.map(function(nb) {
      return nb.lower;
    });
    direction = dir;
    nextKeySuffix = dir === "next" ? "" : suffix;
  }
  initDirection("next");
  var c = new whereClause.Collection(whereClause, () => createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix));
  c._ondirectionchange = function(direction2) {
    initDirection(direction2);
  };
  var firstPossibleNeedle = 0;
  c._addAlgorithm(function(cursor, advance, resolve) {
    var key = cursor.key;
    if (typeof key !== "string")
      return false;
    var lowerKey = lower(key);
    if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
      return true;
    } else {
      var lowestPossibleCasing = null;
      for (var i2 = firstPossibleNeedle; i2 < needlesLen; ++i2) {
        var casing = nextCasing(key, lowerKey, upperNeedles[i2], lowerNeedles[i2], compare, direction);
        if (casing === null && lowestPossibleCasing === null)
          firstPossibleNeedle = i2 + 1;
        else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
          lowestPossibleCasing = casing;
        }
      }
      if (lowestPossibleCasing !== null) {
        advance(function() {
          cursor.continue(lowestPossibleCasing + nextKeySuffix);
        });
      } else {
        advance(resolve);
      }
      return false;
    }
  });
  return c;
}
function createRange(lower, upper, lowerOpen, upperOpen) {
  return {
    type: 2,
    lower,
    upper,
    lowerOpen,
    upperOpen
  };
}
function rangeEqual(value) {
  return {
    type: 1,
    lower: value,
    upper: value
  };
}
var WhereClause = class {
  get Collection() {
    return this._ctx.table.db.Collection;
  }
  between(lower, upper, includeLower, includeUpper) {
    includeLower = includeLower !== false;
    includeUpper = includeUpper === true;
    try {
      if (this._cmp(lower, upper) > 0 || this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper))
        return emptyCollection(this);
      return new this.Collection(this, () => createRange(lower, upper, !includeLower, !includeUpper));
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
  }
  equals(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => rangeEqual(value));
  }
  above(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => createRange(value, void 0, true));
  }
  aboveOrEqual(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => createRange(value, void 0, false));
  }
  below(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => createRange(void 0, value, false, true));
  }
  belowOrEqual(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => createRange(void 0, value));
  }
  startsWith(str) {
    if (typeof str !== "string")
      return fail(this, STRING_EXPECTED);
    return this.between(str, str + maxString, true, true);
  }
  startsWithIgnoreCase(str) {
    if (str === "")
      return this.startsWith(str);
    return addIgnoreCaseAlgorithm(this, (x, a) => x.indexOf(a[0]) === 0, [str], maxString);
  }
  equalsIgnoreCase(str) {
    return addIgnoreCaseAlgorithm(this, (x, a) => x === a[0], [str], "");
  }
  anyOfIgnoreCase() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0)
      return emptyCollection(this);
    return addIgnoreCaseAlgorithm(this, (x, a) => a.indexOf(x) !== -1, set, "");
  }
  startsWithAnyOfIgnoreCase() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0)
      return emptyCollection(this);
    return addIgnoreCaseAlgorithm(this, (x, a) => a.some((n) => x.indexOf(n) === 0), set, maxString);
  }
  anyOf() {
    const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    let compare = this._cmp;
    try {
      set.sort(compare);
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    if (set.length === 0)
      return emptyCollection(this);
    const c = new this.Collection(this, () => createRange(set[0], set[set.length - 1]));
    c._ondirectionchange = (direction) => {
      compare = direction === "next" ? this._ascending : this._descending;
      set.sort(compare);
    };
    let i2 = 0;
    c._addAlgorithm((cursor, advance, resolve) => {
      const key = cursor.key;
      while (compare(key, set[i2]) > 0) {
        ++i2;
        if (i2 === set.length) {
          advance(resolve);
          return false;
        }
      }
      if (compare(key, set[i2]) === 0) {
        return true;
      } else {
        advance(() => {
          cursor.continue(set[i2]);
        });
        return false;
      }
    });
    return c;
  }
  notEqual(value) {
    return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], { includeLowers: false, includeUppers: false });
  }
  noneOf() {
    const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0)
      return new this.Collection(this);
    try {
      set.sort(this._ascending);
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    const ranges = set.reduce((res, val) => res ? res.concat([[res[res.length - 1][1], val]]) : [[minKey, val]], null);
    ranges.push([set[set.length - 1], this.db._maxKey]);
    return this.inAnyRange(ranges, { includeLowers: false, includeUppers: false });
  }
  inAnyRange(ranges, options) {
    const cmp2 = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
    if (ranges.length === 0)
      return emptyCollection(this);
    if (!ranges.every((range) => range[0] !== void 0 && range[1] !== void 0 && ascending(range[0], range[1]) <= 0)) {
      return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
    }
    const includeLowers = !options || options.includeLowers !== false;
    const includeUppers = options && options.includeUppers === true;
    function addRange2(ranges2, newRange) {
      let i2 = 0, l = ranges2.length;
      for (; i2 < l; ++i2) {
        const range = ranges2[i2];
        if (cmp2(newRange[0], range[1]) < 0 && cmp2(newRange[1], range[0]) > 0) {
          range[0] = min(range[0], newRange[0]);
          range[1] = max(range[1], newRange[1]);
          break;
        }
      }
      if (i2 === l)
        ranges2.push(newRange);
      return ranges2;
    }
    let sortDirection = ascending;
    function rangeSorter(a, b) {
      return sortDirection(a[0], b[0]);
    }
    let set;
    try {
      set = ranges.reduce(addRange2, []);
      set.sort(rangeSorter);
    } catch (ex) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    let rangePos = 0;
    const keyIsBeyondCurrentEntry = includeUppers ? (key) => ascending(key, set[rangePos][1]) > 0 : (key) => ascending(key, set[rangePos][1]) >= 0;
    const keyIsBeforeCurrentEntry = includeLowers ? (key) => descending(key, set[rangePos][0]) > 0 : (key) => descending(key, set[rangePos][0]) >= 0;
    function keyWithinCurrentRange(key) {
      return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
    }
    let checkKey = keyIsBeyondCurrentEntry;
    const c = new this.Collection(this, () => createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers));
    c._ondirectionchange = (direction) => {
      if (direction === "next") {
        checkKey = keyIsBeyondCurrentEntry;
        sortDirection = ascending;
      } else {
        checkKey = keyIsBeforeCurrentEntry;
        sortDirection = descending;
      }
      set.sort(rangeSorter);
    };
    c._addAlgorithm((cursor, advance, resolve) => {
      var key = cursor.key;
      while (checkKey(key)) {
        ++rangePos;
        if (rangePos === set.length) {
          advance(resolve);
          return false;
        }
      }
      if (keyWithinCurrentRange(key)) {
        return true;
      } else if (this._cmp(key, set[rangePos][1]) === 0 || this._cmp(key, set[rangePos][0]) === 0) {
        return false;
      } else {
        advance(() => {
          if (sortDirection === ascending)
            cursor.continue(set[rangePos][0]);
          else
            cursor.continue(set[rangePos][1]);
        });
        return false;
      }
    });
    return c;
  }
  startsWithAnyOf() {
    const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (!set.every((s) => typeof s === "string")) {
      return fail(this, "startsWithAnyOf() only works with strings");
    }
    if (set.length === 0)
      return emptyCollection(this);
    return this.inAnyRange(set.map((str) => [str, str + maxString]));
  }
};
function createWhereClauseConstructor(db2) {
  return makeClassConstructor(WhereClause.prototype, function WhereClause2(table, index, orCollection) {
    this.db = db2;
    this._ctx = {
      table,
      index: index === ":id" ? null : index,
      or: orCollection
    };
    const indexedDB2 = db2._deps.indexedDB;
    if (!indexedDB2)
      throw new exceptions.MissingAPI();
    this._cmp = this._ascending = indexedDB2.cmp.bind(indexedDB2);
    this._descending = (a, b) => indexedDB2.cmp(b, a);
    this._max = (a, b) => indexedDB2.cmp(a, b) > 0 ? a : b;
    this._min = (a, b) => indexedDB2.cmp(a, b) < 0 ? a : b;
    this._IDBKeyRange = db2._deps.IDBKeyRange;
  });
}
function eventRejectHandler(reject) {
  return wrap(function(event) {
    preventDefault(event);
    reject(event.target.error);
    return false;
  });
}
function preventDefault(event) {
  if (event.stopPropagation)
    event.stopPropagation();
  if (event.preventDefault)
    event.preventDefault();
}
var DEXIE_STORAGE_MUTATED_EVENT_NAME = "storagemutated";
var STORAGE_MUTATED_DOM_EVENT_NAME = "x-storagemutated-1";
var globalEvents = Events(null, DEXIE_STORAGE_MUTATED_EVENT_NAME);
var Transaction = class {
  _lock() {
    assert7(!PSD.global);
    ++this._reculock;
    if (this._reculock === 1 && !PSD.global)
      PSD.lockOwnerFor = this;
    return this;
  }
  _unlock() {
    assert7(!PSD.global);
    if (--this._reculock === 0) {
      if (!PSD.global)
        PSD.lockOwnerFor = null;
      while (this._blockedFuncs.length > 0 && !this._locked()) {
        var fnAndPSD = this._blockedFuncs.shift();
        try {
          usePSD(fnAndPSD[1], fnAndPSD[0]);
        } catch (e) {
        }
      }
    }
    return this;
  }
  _locked() {
    return this._reculock && PSD.lockOwnerFor !== this;
  }
  create(idbtrans) {
    if (!this.mode)
      return this;
    const idbdb = this.db.idbdb;
    const dbOpenError = this.db._state.dbOpenError;
    assert7(!this.idbtrans);
    if (!idbtrans && !idbdb) {
      switch (dbOpenError && dbOpenError.name) {
        case "DatabaseClosedError":
          throw new exceptions.DatabaseClosed(dbOpenError);
        case "MissingAPIError":
          throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
        default:
          throw new exceptions.OpenFailed(dbOpenError);
      }
    }
    if (!this.active)
      throw new exceptions.TransactionInactive();
    assert7(this._completion._state === null);
    idbtrans = this.idbtrans = idbtrans || (this.db.core ? this.db.core.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }) : idbdb.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }));
    idbtrans.onerror = wrap((ev) => {
      preventDefault(ev);
      this._reject(idbtrans.error);
    });
    idbtrans.onabort = wrap((ev) => {
      preventDefault(ev);
      this.active && this._reject(new exceptions.Abort(idbtrans.error));
      this.active = false;
      this.on("abort").fire(ev);
    });
    idbtrans.oncomplete = wrap(() => {
      this.active = false;
      this._resolve();
      if ("mutatedParts" in idbtrans) {
        globalEvents.storagemutated.fire(idbtrans["mutatedParts"]);
      }
    });
    return this;
  }
  _promise(mode, fn, bWriteLock) {
    if (mode === "readwrite" && this.mode !== "readwrite")
      return rejection(new exceptions.ReadOnly("Transaction is readonly"));
    if (!this.active)
      return rejection(new exceptions.TransactionInactive());
    if (this._locked()) {
      return new DexiePromise((resolve, reject) => {
        this._blockedFuncs.push([() => {
          this._promise(mode, fn, bWriteLock).then(resolve, reject);
        }, PSD]);
      });
    } else if (bWriteLock) {
      return newScope(() => {
        var p2 = new DexiePromise((resolve, reject) => {
          this._lock();
          const rv = fn(resolve, reject, this);
          if (rv && rv.then)
            rv.then(resolve, reject);
        });
        p2.finally(() => this._unlock());
        p2._lib = true;
        return p2;
      });
    } else {
      var p = new DexiePromise((resolve, reject) => {
        var rv = fn(resolve, reject, this);
        if (rv && rv.then)
          rv.then(resolve, reject);
      });
      p._lib = true;
      return p;
    }
  }
  _root() {
    return this.parent ? this.parent._root() : this;
  }
  waitFor(promiseLike) {
    var root = this._root();
    const promise = DexiePromise.resolve(promiseLike);
    if (root._waitingFor) {
      root._waitingFor = root._waitingFor.then(() => promise);
    } else {
      root._waitingFor = promise;
      root._waitingQueue = [];
      var store = root.idbtrans.objectStore(root.storeNames[0]);
      (function spin() {
        ++root._spinCount;
        while (root._waitingQueue.length)
          root._waitingQueue.shift()();
        if (root._waitingFor)
          store.get(-Infinity).onsuccess = spin;
      })();
    }
    var currentWaitPromise = root._waitingFor;
    return new DexiePromise((resolve, reject) => {
      promise.then((res) => root._waitingQueue.push(wrap(resolve.bind(null, res))), (err) => root._waitingQueue.push(wrap(reject.bind(null, err)))).finally(() => {
        if (root._waitingFor === currentWaitPromise) {
          root._waitingFor = null;
        }
      });
    });
  }
  abort() {
    if (this.active) {
      this.active = false;
      if (this.idbtrans)
        this.idbtrans.abort();
      this._reject(new exceptions.Abort());
    }
  }
  table(tableName) {
    const memoizedTables = this._memoizedTables || (this._memoizedTables = {});
    if (hasOwn(memoizedTables, tableName))
      return memoizedTables[tableName];
    const tableSchema = this.schema[tableName];
    if (!tableSchema) {
      throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
    }
    const transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
    transactionBoundTable.core = this.db.core.table(tableName);
    memoizedTables[tableName] = transactionBoundTable;
    return transactionBoundTable;
  }
};
function createTransactionConstructor(db2) {
  return makeClassConstructor(Transaction.prototype, function Transaction2(mode, storeNames, dbschema, chromeTransactionDurability, parent) {
    this.db = db2;
    this.mode = mode;
    this.storeNames = storeNames;
    this.schema = dbschema;
    this.chromeTransactionDurability = chromeTransactionDurability;
    this.idbtrans = null;
    this.on = Events(this, "complete", "error", "abort");
    this.parent = parent || null;
    this.active = true;
    this._reculock = 0;
    this._blockedFuncs = [];
    this._resolve = null;
    this._reject = null;
    this._waitingFor = null;
    this._waitingQueue = null;
    this._spinCount = 0;
    this._completion = new DexiePromise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
    this._completion.then(() => {
      this.active = false;
      this.on.complete.fire();
    }, (e) => {
      var wasActive = this.active;
      this.active = false;
      this.on.error.fire(e);
      this.parent ? this.parent._reject(e) : wasActive && this.idbtrans && this.idbtrans.abort();
      return rejection(e);
    });
  });
}
function createIndexSpec(name, keyPath, unique, multi, auto, compound, isPrimKey) {
  return {
    name,
    keyPath,
    unique,
    multi,
    auto,
    compound,
    src: (unique && !isPrimKey ? "&" : "") + (multi ? "*" : "") + (auto ? "++" : "") + nameFromKeyPath(keyPath)
  };
}
function nameFromKeyPath(keyPath) {
  return typeof keyPath === "string" ? keyPath : keyPath ? "[" + [].join.call(keyPath, "+") + "]" : "";
}
function createTableSchema(name, primKey, indexes) {
  return {
    name,
    primKey,
    indexes,
    mappedClass: null,
    idxByName: arrayToObject(indexes, (index) => [index.name, index])
  };
}
function safariMultiStoreFix(storeNames) {
  return storeNames.length === 1 ? storeNames[0] : storeNames;
}
var getMaxKey = (IdbKeyRange) => {
  try {
    IdbKeyRange.only([[]]);
    getMaxKey = () => [[]];
    return [[]];
  } catch (e) {
    getMaxKey = () => maxString;
    return maxString;
  }
};
function getKeyExtractor(keyPath) {
  if (keyPath == null) {
    return () => void 0;
  } else if (typeof keyPath === "string") {
    return getSinglePathKeyExtractor(keyPath);
  } else {
    return (obj) => getByKeyPath(obj, keyPath);
  }
}
function getSinglePathKeyExtractor(keyPath) {
  const split2 = keyPath.split(".");
  if (split2.length === 1) {
    return (obj) => obj[keyPath];
  } else {
    return (obj) => getByKeyPath(obj, keyPath);
  }
}
function arrayify(arrayLike) {
  return [].slice.call(arrayLike);
}
var _id_counter = 0;
function getKeyPathAlias(keyPath) {
  return keyPath == null ? ":id" : typeof keyPath === "string" ? keyPath : `[${keyPath.join("+")}]`;
}
function createDBCore(db2, IdbKeyRange, tmpTrans) {
  function extractSchema(db3, trans) {
    const tables2 = arrayify(db3.objectStoreNames);
    return {
      schema: {
        name: db3.name,
        tables: tables2.map((table) => trans.objectStore(table)).map((store) => {
          const { keyPath, autoIncrement } = store;
          const compound = isArray(keyPath);
          const outbound = keyPath == null;
          const indexByKeyPath = {};
          const result = {
            name: store.name,
            primaryKey: {
              name: null,
              isPrimaryKey: true,
              outbound,
              compound,
              keyPath,
              autoIncrement,
              unique: true,
              extractKey: getKeyExtractor(keyPath)
            },
            indexes: arrayify(store.indexNames).map((indexName) => store.index(indexName)).map((index) => {
              const { name, unique, multiEntry, keyPath: keyPath2 } = index;
              const compound2 = isArray(keyPath2);
              const result2 = {
                name,
                compound: compound2,
                keyPath: keyPath2,
                unique,
                multiEntry,
                extractKey: getKeyExtractor(keyPath2)
              };
              indexByKeyPath[getKeyPathAlias(keyPath2)] = result2;
              return result2;
            }),
            getIndexByKeyPath: (keyPath2) => indexByKeyPath[getKeyPathAlias(keyPath2)]
          };
          indexByKeyPath[":id"] = result.primaryKey;
          if (keyPath != null) {
            indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
          }
          return result;
        })
      },
      hasGetAll: tables2.length > 0 && "getAll" in trans.objectStore(tables2[0]) && !(typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
    };
  }
  function makeIDBKeyRange(range) {
    if (range.type === 3)
      return null;
    if (range.type === 4)
      throw new Error("Cannot convert never type to IDBKeyRange");
    const { lower, upper, lowerOpen, upperOpen } = range;
    const idbRange = lower === void 0 ? upper === void 0 ? null : IdbKeyRange.upperBound(upper, !!upperOpen) : upper === void 0 ? IdbKeyRange.lowerBound(lower, !!lowerOpen) : IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
    return idbRange;
  }
  function createDbCoreTable(tableSchema) {
    const tableName = tableSchema.name;
    function mutate({ trans, type: type2, keys: keys2, values, range }) {
      return new Promise((resolve, reject) => {
        resolve = wrap(resolve);
        const store = trans.objectStore(tableName);
        const outbound = store.keyPath == null;
        const isAddOrPut = type2 === "put" || type2 === "add";
        if (!isAddOrPut && type2 !== "delete" && type2 !== "deleteRange")
          throw new Error("Invalid operation type: " + type2);
        const { length } = keys2 || values || { length: 1 };
        if (keys2 && values && keys2.length !== values.length) {
          throw new Error("Given keys array must have same length as given values array.");
        }
        if (length === 0)
          return resolve({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
        let req;
        const reqs = [];
        const failures = [];
        let numFailures = 0;
        const errorHandler = (event) => {
          ++numFailures;
          preventDefault(event);
        };
        if (type2 === "deleteRange") {
          if (range.type === 4)
            return resolve({ numFailures, failures, results: [], lastResult: void 0 });
          if (range.type === 3)
            reqs.push(req = store.clear());
          else
            reqs.push(req = store.delete(makeIDBKeyRange(range)));
        } else {
          const [args1, args2] = isAddOrPut ? outbound ? [values, keys2] : [values, null] : [keys2, null];
          if (isAddOrPut) {
            for (let i2 = 0; i2 < length; ++i2) {
              reqs.push(req = args2 && args2[i2] !== void 0 ? store[type2](args1[i2], args2[i2]) : store[type2](args1[i2]));
              req.onerror = errorHandler;
            }
          } else {
            for (let i2 = 0; i2 < length; ++i2) {
              reqs.push(req = store[type2](args1[i2]));
              req.onerror = errorHandler;
            }
          }
        }
        const done = (event) => {
          const lastResult = event.target.result;
          reqs.forEach((req2, i2) => req2.error != null && (failures[i2] = req2.error));
          resolve({
            numFailures,
            failures,
            results: type2 === "delete" ? keys2 : reqs.map((req2) => req2.result),
            lastResult
          });
        };
        req.onerror = (event) => {
          errorHandler(event);
          done(event);
        };
        req.onsuccess = done;
      });
    }
    function openCursor2({ trans, values, query: query2, reverse, unique }) {
      return new Promise((resolve, reject) => {
        resolve = wrap(resolve);
        const { index, range } = query2;
        const store = trans.objectStore(tableName);
        const source = index.isPrimaryKey ? store : store.index(index.name);
        const direction = reverse ? unique ? "prevunique" : "prev" : unique ? "nextunique" : "next";
        const req = values || !("openKeyCursor" in source) ? source.openCursor(makeIDBKeyRange(range), direction) : source.openKeyCursor(makeIDBKeyRange(range), direction);
        req.onerror = eventRejectHandler(reject);
        req.onsuccess = wrap((ev) => {
          const cursor = req.result;
          if (!cursor) {
            resolve(null);
            return;
          }
          cursor.___id = ++_id_counter;
          cursor.done = false;
          const _cursorContinue = cursor.continue.bind(cursor);
          let _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
          if (_cursorContinuePrimaryKey)
            _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
          const _cursorAdvance = cursor.advance.bind(cursor);
          const doThrowCursorIsNotStarted = () => {
            throw new Error("Cursor not started");
          };
          const doThrowCursorIsStopped = () => {
            throw new Error("Cursor not stopped");
          };
          cursor.trans = trans;
          cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
          cursor.fail = wrap(reject);
          cursor.next = function() {
            let gotOne = 1;
            return this.start(() => gotOne-- ? this.continue() : this.stop()).then(() => this);
          };
          cursor.start = (callback) => {
            const iterationPromise = new Promise((resolveIteration, rejectIteration) => {
              resolveIteration = wrap(resolveIteration);
              req.onerror = eventRejectHandler(rejectIteration);
              cursor.fail = rejectIteration;
              cursor.stop = (value) => {
                cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                resolveIteration(value);
              };
            });
            const guardedCallback = () => {
              if (req.result) {
                try {
                  callback();
                } catch (err) {
                  cursor.fail(err);
                }
              } else {
                cursor.done = true;
                cursor.start = () => {
                  throw new Error("Cursor behind last entry");
                };
                cursor.stop();
              }
            };
            req.onsuccess = wrap((ev2) => {
              req.onsuccess = guardedCallback;
              guardedCallback();
            });
            cursor.continue = _cursorContinue;
            cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
            cursor.advance = _cursorAdvance;
            guardedCallback();
            return iterationPromise;
          };
          resolve(cursor);
        }, reject);
      });
    }
    function query(hasGetAll2) {
      return (request) => {
        return new Promise((resolve, reject) => {
          resolve = wrap(resolve);
          const { trans, values, limit, query: query2 } = request;
          const nonInfinitLimit = limit === Infinity ? void 0 : limit;
          const { index, range } = query2;
          const store = trans.objectStore(tableName);
          const source = index.isPrimaryKey ? store : store.index(index.name);
          const idbKeyRange = makeIDBKeyRange(range);
          if (limit === 0)
            return resolve({ result: [] });
          if (hasGetAll2) {
            const req = values ? source.getAll(idbKeyRange, nonInfinitLimit) : source.getAllKeys(idbKeyRange, nonInfinitLimit);
            req.onsuccess = (event) => resolve({ result: event.target.result });
            req.onerror = eventRejectHandler(reject);
          } else {
            let count = 0;
            const req = values || !("openKeyCursor" in source) ? source.openCursor(idbKeyRange) : source.openKeyCursor(idbKeyRange);
            const result = [];
            req.onsuccess = (event) => {
              const cursor = req.result;
              if (!cursor)
                return resolve({ result });
              result.push(values ? cursor.value : cursor.primaryKey);
              if (++count === limit)
                return resolve({ result });
              cursor.continue();
            };
            req.onerror = eventRejectHandler(reject);
          }
        });
      };
    }
    return {
      name: tableName,
      schema: tableSchema,
      mutate,
      getMany({ trans, keys: keys2 }) {
        return new Promise((resolve, reject) => {
          resolve = wrap(resolve);
          const store = trans.objectStore(tableName);
          const length = keys2.length;
          const result = new Array(length);
          let keyCount = 0;
          let callbackCount = 0;
          let req;
          const successHandler = (event) => {
            const req2 = event.target;
            if ((result[req2._pos] = req2.result) != null)
              ;
            if (++callbackCount === keyCount)
              resolve(result);
          };
          const errorHandler = eventRejectHandler(reject);
          for (let i2 = 0; i2 < length; ++i2) {
            const key = keys2[i2];
            if (key != null) {
              req = store.get(keys2[i2]);
              req._pos = i2;
              req.onsuccess = successHandler;
              req.onerror = errorHandler;
              ++keyCount;
            }
          }
          if (keyCount === 0)
            resolve(result);
        });
      },
      get({ trans, key }) {
        return new Promise((resolve, reject) => {
          resolve = wrap(resolve);
          const store = trans.objectStore(tableName);
          const req = store.get(key);
          req.onsuccess = (event) => resolve(event.target.result);
          req.onerror = eventRejectHandler(reject);
        });
      },
      query: query(hasGetAll),
      openCursor: openCursor2,
      count({ query: query2, trans }) {
        const { index, range } = query2;
        return new Promise((resolve, reject) => {
          const store = trans.objectStore(tableName);
          const source = index.isPrimaryKey ? store : store.index(index.name);
          const idbKeyRange = makeIDBKeyRange(range);
          const req = idbKeyRange ? source.count(idbKeyRange) : source.count();
          req.onsuccess = wrap((ev) => resolve(ev.target.result));
          req.onerror = eventRejectHandler(reject);
        });
      }
    };
  }
  const { schema, hasGetAll } = extractSchema(db2, tmpTrans);
  const tables = schema.tables.map((tableSchema) => createDbCoreTable(tableSchema));
  const tableMap = {};
  tables.forEach((table) => tableMap[table.name] = table);
  return {
    stack: "dbcore",
    transaction: db2.transaction.bind(db2),
    table(name) {
      const result = tableMap[name];
      if (!result)
        throw new Error(`Table '${name}' not found`);
      return tableMap[name];
    },
    MIN_KEY: -Infinity,
    MAX_KEY: getMaxKey(IdbKeyRange),
    schema
  };
}
function createMiddlewareStack(stackImpl, middlewares) {
  return middlewares.reduce((down, { create }) => ({ ...down, ...create(down) }), stackImpl);
}
function createMiddlewareStacks(middlewares, idbdb, { IDBKeyRange, indexedDB: indexedDB2 }, tmpTrans) {
  const dbcore = createMiddlewareStack(createDBCore(idbdb, IDBKeyRange, tmpTrans), middlewares.dbcore);
  return {
    dbcore
  };
}
function generateMiddlewareStacks({ _novip: db2 }, tmpTrans) {
  const idbdb = tmpTrans.db;
  const stacks = createMiddlewareStacks(db2._middlewares, idbdb, db2._deps, tmpTrans);
  db2.core = stacks.dbcore;
  db2.tables.forEach((table) => {
    const tableName = table.name;
    if (db2.core.schema.tables.some((tbl) => tbl.name === tableName)) {
      table.core = db2.core.table(tableName);
      if (db2[tableName] instanceof db2.Table) {
        db2[tableName].core = table.core;
      }
    }
  });
}
function setApiOnPlace({ _novip: db2 }, objs, tableNames, dbschema) {
  tableNames.forEach((tableName) => {
    const schema = dbschema[tableName];
    objs.forEach((obj) => {
      const propDesc = getPropertyDescriptor(obj, tableName);
      if (!propDesc || "value" in propDesc && propDesc.value === void 0) {
        if (obj === db2.Transaction.prototype || obj instanceof db2.Transaction) {
          setProp(obj, tableName, {
            get() {
              return this.table(tableName);
            },
            set(value) {
              defineProperty(this, tableName, { value, writable: true, configurable: true, enumerable: true });
            }
          });
        } else {
          obj[tableName] = new db2.Table(tableName, schema);
        }
      }
    });
  });
}
function removeTablesApi({ _novip: db2 }, objs) {
  objs.forEach((obj) => {
    for (let key in obj) {
      if (obj[key] instanceof db2.Table)
        delete obj[key];
    }
  });
}
function lowerVersionFirst(a, b) {
  return a._cfg.version - b._cfg.version;
}
function runUpgraders(db2, oldVersion, idbUpgradeTrans, reject) {
  const globalSchema = db2._dbSchema;
  const trans = db2._createTransaction("readwrite", db2._storeNames, globalSchema);
  trans.create(idbUpgradeTrans);
  trans._completion.catch(reject);
  const rejectTransaction = trans._reject.bind(trans);
  const transless = PSD.transless || PSD;
  newScope(() => {
    PSD.trans = trans;
    PSD.transless = transless;
    if (oldVersion === 0) {
      keys(globalSchema).forEach((tableName) => {
        createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
      });
      generateMiddlewareStacks(db2, idbUpgradeTrans);
      DexiePromise.follow(() => db2.on.populate.fire(trans)).catch(rejectTransaction);
    } else
      updateTablesAndIndexes(db2, oldVersion, trans, idbUpgradeTrans).catch(rejectTransaction);
  });
}
function updateTablesAndIndexes({ _novip: db2 }, oldVersion, trans, idbUpgradeTrans) {
  const queue = [];
  const versions = db2._versions;
  let globalSchema = db2._dbSchema = buildGlobalSchema(db2, db2.idbdb, idbUpgradeTrans);
  let anyContentUpgraderHasRun = false;
  const versToRun = versions.filter((v) => v._cfg.version >= oldVersion);
  versToRun.forEach((version) => {
    queue.push(() => {
      const oldSchema = globalSchema;
      const newSchema = version._cfg.dbschema;
      adjustToExistingIndexNames(db2, oldSchema, idbUpgradeTrans);
      adjustToExistingIndexNames(db2, newSchema, idbUpgradeTrans);
      globalSchema = db2._dbSchema = newSchema;
      const diff = getSchemaDiff(oldSchema, newSchema);
      diff.add.forEach((tuple) => {
        createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
      });
      diff.change.forEach((change) => {
        if (change.recreate) {
          throw new exceptions.Upgrade("Not yet support for changing primary key");
        } else {
          const store = idbUpgradeTrans.objectStore(change.name);
          change.add.forEach((idx) => addIndex(store, idx));
          change.change.forEach((idx) => {
            store.deleteIndex(idx.name);
            addIndex(store, idx);
          });
          change.del.forEach((idxName) => store.deleteIndex(idxName));
        }
      });
      const contentUpgrade = version._cfg.contentUpgrade;
      if (contentUpgrade && version._cfg.version > oldVersion) {
        generateMiddlewareStacks(db2, idbUpgradeTrans);
        trans._memoizedTables = {};
        anyContentUpgraderHasRun = true;
        let upgradeSchema = shallowClone(newSchema);
        diff.del.forEach((table) => {
          upgradeSchema[table] = oldSchema[table];
        });
        removeTablesApi(db2, [db2.Transaction.prototype]);
        setApiOnPlace(db2, [db2.Transaction.prototype], keys(upgradeSchema), upgradeSchema);
        trans.schema = upgradeSchema;
        const contentUpgradeIsAsync = isAsyncFunction(contentUpgrade);
        if (contentUpgradeIsAsync) {
          incrementExpectedAwaits();
        }
        let returnValue;
        const promiseFollowed = DexiePromise.follow(() => {
          returnValue = contentUpgrade(trans);
          if (returnValue) {
            if (contentUpgradeIsAsync) {
              var decrementor = decrementExpectedAwaits.bind(null, null);
              returnValue.then(decrementor, decrementor);
            }
          }
        });
        return returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue) : promiseFollowed.then(() => returnValue);
      }
    });
    queue.push((idbtrans) => {
      if (!anyContentUpgraderHasRun || !hasIEDeleteObjectStoreBug) {
        const newSchema = version._cfg.dbschema;
        deleteRemovedTables(newSchema, idbtrans);
      }
      removeTablesApi(db2, [db2.Transaction.prototype]);
      setApiOnPlace(db2, [db2.Transaction.prototype], db2._storeNames, db2._dbSchema);
      trans.schema = db2._dbSchema;
    });
  });
  function runQueue() {
    return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) : DexiePromise.resolve();
  }
  return runQueue().then(() => {
    createMissingTables(globalSchema, idbUpgradeTrans);
  });
}
function getSchemaDiff(oldSchema, newSchema) {
  const diff = {
    del: [],
    add: [],
    change: []
  };
  let table;
  for (table in oldSchema) {
    if (!newSchema[table])
      diff.del.push(table);
  }
  for (table in newSchema) {
    const oldDef = oldSchema[table], newDef = newSchema[table];
    if (!oldDef) {
      diff.add.push([table, newDef]);
    } else {
      const change = {
        name: table,
        def: newDef,
        recreate: false,
        del: [],
        add: [],
        change: []
      };
      if ("" + (oldDef.primKey.keyPath || "") !== "" + (newDef.primKey.keyPath || "") || oldDef.primKey.auto !== newDef.primKey.auto && !isIEOrEdge) {
        change.recreate = true;
        diff.change.push(change);
      } else {
        const oldIndexes = oldDef.idxByName;
        const newIndexes = newDef.idxByName;
        let idxName;
        for (idxName in oldIndexes) {
          if (!newIndexes[idxName])
            change.del.push(idxName);
        }
        for (idxName in newIndexes) {
          const oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
          if (!oldIdx)
            change.add.push(newIdx);
          else if (oldIdx.src !== newIdx.src)
            change.change.push(newIdx);
        }
        if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
          diff.change.push(change);
        }
      }
    }
  }
  return diff;
}
function createTable(idbtrans, tableName, primKey, indexes) {
  const store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ? { keyPath: primKey.keyPath, autoIncrement: primKey.auto } : { autoIncrement: primKey.auto });
  indexes.forEach((idx) => addIndex(store, idx));
  return store;
}
function createMissingTables(newSchema, idbtrans) {
  keys(newSchema).forEach((tableName) => {
    if (!idbtrans.db.objectStoreNames.contains(tableName)) {
      createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
    }
  });
}
function deleteRemovedTables(newSchema, idbtrans) {
  [].slice.call(idbtrans.db.objectStoreNames).forEach((storeName) => newSchema[storeName] == null && idbtrans.db.deleteObjectStore(storeName));
}
function addIndex(store, idx) {
  store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multi });
}
function buildGlobalSchema(db2, idbdb, tmpTrans) {
  const globalSchema = {};
  const dbStoreNames = slice(idbdb.objectStoreNames, 0);
  dbStoreNames.forEach((storeName) => {
    const store = tmpTrans.objectStore(storeName);
    let keyPath = store.keyPath;
    const primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", false, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
    const indexes = [];
    for (let j = 0; j < store.indexNames.length; ++j) {
      const idbindex = store.index(store.indexNames[j]);
      keyPath = idbindex.keyPath;
      var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
      indexes.push(index);
    }
    globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
  });
  return globalSchema;
}
function readGlobalSchema({ _novip: db2 }, idbdb, tmpTrans) {
  db2.verno = idbdb.version / 10;
  const globalSchema = db2._dbSchema = buildGlobalSchema(db2, idbdb, tmpTrans);
  db2._storeNames = slice(idbdb.objectStoreNames, 0);
  setApiOnPlace(db2, [db2._allTables], keys(globalSchema), globalSchema);
}
function verifyInstalledSchema(db2, tmpTrans) {
  const installedSchema = buildGlobalSchema(db2, db2.idbdb, tmpTrans);
  const diff = getSchemaDiff(installedSchema, db2._dbSchema);
  return !(diff.add.length || diff.change.some((ch) => ch.add.length || ch.change.length));
}
function adjustToExistingIndexNames({ _novip: db2 }, schema, idbtrans) {
  const storeNames = idbtrans.db.objectStoreNames;
  for (let i2 = 0; i2 < storeNames.length; ++i2) {
    const storeName = storeNames[i2];
    const store = idbtrans.objectStore(storeName);
    db2._hasGetAll = "getAll" in store;
    for (let j = 0; j < store.indexNames.length; ++j) {
      const indexName = store.indexNames[j];
      const keyPath = store.index(indexName).keyPath;
      const dexieName = typeof keyPath === "string" ? keyPath : "[" + slice(keyPath).join("+") + "]";
      if (schema[storeName]) {
        const indexSpec = schema[storeName].idxByName[dexieName];
        if (indexSpec) {
          indexSpec.name = indexName;
          delete schema[storeName].idxByName[dexieName];
          schema[storeName].idxByName[indexName] = indexSpec;
        }
      }
    }
  }
  if (typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
    db2._hasGetAll = false;
  }
}
function parseIndexSyntax(primKeyAndIndexes) {
  return primKeyAndIndexes.split(",").map((index, indexNum) => {
    index = index.trim();
    const name = index.replace(/([&*]|\+\+)/g, "");
    const keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split("+") : name;
    return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), indexNum === 0);
  });
}
var Version = class {
  _parseStoresSpec(stores, outSchema) {
    keys(stores).forEach((tableName) => {
      if (stores[tableName] !== null) {
        var indexes = parseIndexSyntax(stores[tableName]);
        var primKey = indexes.shift();
        if (primKey.multi)
          throw new exceptions.Schema("Primary key cannot be multi-valued");
        indexes.forEach((idx) => {
          if (idx.auto)
            throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
          if (!idx.keyPath)
            throw new exceptions.Schema("Index must have a name and cannot be an empty string");
        });
        outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
      }
    });
  }
  stores(stores) {
    const db2 = this.db;
    this._cfg.storesSource = this._cfg.storesSource ? extend(this._cfg.storesSource, stores) : stores;
    const versions = db2._versions;
    const storesSpec = {};
    let dbschema = {};
    versions.forEach((version) => {
      extend(storesSpec, version._cfg.storesSource);
      dbschema = version._cfg.dbschema = {};
      version._parseStoresSpec(storesSpec, dbschema);
    });
    db2._dbSchema = dbschema;
    removeTablesApi(db2, [db2._allTables, db2, db2.Transaction.prototype]);
    setApiOnPlace(db2, [db2._allTables, db2, db2.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
    db2._storeNames = keys(dbschema);
    return this;
  }
  upgrade(upgradeFunction) {
    this._cfg.contentUpgrade = promisableChain(this._cfg.contentUpgrade || nop, upgradeFunction);
    return this;
  }
};
function createVersionConstructor(db2) {
  return makeClassConstructor(Version.prototype, function Version2(versionNumber) {
    this.db = db2;
    this._cfg = {
      version: versionNumber,
      storesSource: null,
      dbschema: {},
      tables: {},
      contentUpgrade: null
    };
  });
}
function getDbNamesTable(indexedDB2, IDBKeyRange) {
  let dbNamesDB = indexedDB2["_dbNamesDB"];
  if (!dbNamesDB) {
    dbNamesDB = indexedDB2["_dbNamesDB"] = new Dexie$1(DBNAMES_DB, {
      addons: [],
      indexedDB: indexedDB2,
      IDBKeyRange
    });
    dbNamesDB.version(1).stores({ dbnames: "name" });
  }
  return dbNamesDB.table("dbnames");
}
function hasDatabasesNative(indexedDB2) {
  return indexedDB2 && typeof indexedDB2.databases === "function";
}
function getDatabaseNames({ indexedDB: indexedDB2, IDBKeyRange }) {
  return hasDatabasesNative(indexedDB2) ? Promise.resolve(indexedDB2.databases()).then((infos) => infos.map((info) => info.name).filter((name) => name !== DBNAMES_DB)) : getDbNamesTable(indexedDB2, IDBKeyRange).toCollection().primaryKeys();
}
function _onDatabaseCreated({ indexedDB: indexedDB2, IDBKeyRange }, name) {
  !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange).put({ name }).catch(nop);
}
function _onDatabaseDeleted({ indexedDB: indexedDB2, IDBKeyRange }, name) {
  !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange).delete(name).catch(nop);
}
function vip(fn) {
  return newScope(function() {
    PSD.letThrough = true;
    return fn();
  });
}
function idbReady() {
  var isSafari = !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent);
  if (!isSafari || !indexedDB.databases)
    return Promise.resolve();
  var intervalId;
  return new Promise(function(resolve) {
    var tryIdb = function() {
      return indexedDB.databases().finally(resolve);
    };
    intervalId = setInterval(tryIdb, 100);
    tryIdb();
  }).finally(function() {
    return clearInterval(intervalId);
  });
}
function dexieOpen(db2) {
  const state = db2._state;
  const { indexedDB: indexedDB2 } = db2._deps;
  if (state.isBeingOpened || db2.idbdb)
    return state.dbReadyPromise.then(() => state.dbOpenError ? rejection(state.dbOpenError) : db2);
  debug4 && (state.openCanceller._stackHolder = getErrorWithStack());
  state.isBeingOpened = true;
  state.dbOpenError = null;
  state.openComplete = false;
  const openCanceller = state.openCanceller;
  function throwIfCancelled() {
    if (state.openCanceller !== openCanceller)
      throw new exceptions.DatabaseClosed("db.open() was cancelled");
  }
  let resolveDbReady = state.dbReadyResolve, upgradeTransaction = null, wasCreated = false;
  return DexiePromise.race([openCanceller, (typeof navigator === "undefined" ? DexiePromise.resolve() : idbReady()).then(() => new DexiePromise((resolve, reject) => {
    throwIfCancelled();
    if (!indexedDB2)
      throw new exceptions.MissingAPI();
    const dbName = db2.name;
    const req = state.autoSchema ? indexedDB2.open(dbName) : indexedDB2.open(dbName, Math.round(db2.verno * 10));
    if (!req)
      throw new exceptions.MissingAPI();
    req.onerror = eventRejectHandler(reject);
    req.onblocked = wrap(db2._fireOnBlocked);
    req.onupgradeneeded = wrap((e) => {
      upgradeTransaction = req.transaction;
      if (state.autoSchema && !db2._options.allowEmptyDB) {
        req.onerror = preventDefault;
        upgradeTransaction.abort();
        req.result.close();
        const delreq = indexedDB2.deleteDatabase(dbName);
        delreq.onsuccess = delreq.onerror = wrap(() => {
          reject(new exceptions.NoSuchDatabase(`Database ${dbName} doesnt exist`));
        });
      } else {
        upgradeTransaction.onerror = eventRejectHandler(reject);
        var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
        wasCreated = oldVer < 1;
        db2._novip.idbdb = req.result;
        runUpgraders(db2, oldVer / 10, upgradeTransaction, reject);
      }
    }, reject);
    req.onsuccess = wrap(() => {
      upgradeTransaction = null;
      const idbdb = db2._novip.idbdb = req.result;
      const objectStoreNames = slice(idbdb.objectStoreNames);
      if (objectStoreNames.length > 0)
        try {
          const tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), "readonly");
          if (state.autoSchema)
            readGlobalSchema(db2, idbdb, tmpTrans);
          else {
            adjustToExistingIndexNames(db2, db2._dbSchema, tmpTrans);
            if (!verifyInstalledSchema(db2, tmpTrans)) {
              console.warn(`Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.`);
            }
          }
          generateMiddlewareStacks(db2, tmpTrans);
        } catch (e) {
        }
      connections.push(db2);
      idbdb.onversionchange = wrap((ev) => {
        state.vcFired = true;
        db2.on("versionchange").fire(ev);
      });
      idbdb.onclose = wrap((ev) => {
        db2.on("close").fire(ev);
      });
      if (wasCreated)
        _onDatabaseCreated(db2._deps, dbName);
      resolve();
    }, reject);
  }))]).then(() => {
    throwIfCancelled();
    state.onReadyBeingFired = [];
    return DexiePromise.resolve(vip(() => db2.on.ready.fire(db2.vip))).then(function fireRemainders() {
      if (state.onReadyBeingFired.length > 0) {
        let remainders = state.onReadyBeingFired.reduce(promisableChain, nop);
        state.onReadyBeingFired = [];
        return DexiePromise.resolve(vip(() => remainders(db2.vip))).then(fireRemainders);
      }
    });
  }).finally(() => {
    state.onReadyBeingFired = null;
    state.isBeingOpened = false;
  }).then(() => {
    return db2;
  }).catch((err) => {
    state.dbOpenError = err;
    try {
      upgradeTransaction && upgradeTransaction.abort();
    } catch (_a2) {
    }
    if (openCanceller === state.openCanceller) {
      db2._close();
    }
    return rejection(err);
  }).finally(() => {
    state.openComplete = true;
    resolveDbReady();
  });
}
function awaitIterator(iterator) {
  var callNext = (result) => iterator.next(result), doThrow = (error) => iterator.throw(error), onSuccess = step(callNext), onError = step(doThrow);
  function step(getNext) {
    return (val) => {
      var next = getNext(val), value = next.value;
      return next.done ? value : !value || typeof value.then !== "function" ? isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) : value.then(onSuccess, onError);
    };
  }
  return step(callNext)();
}
function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
  var i2 = arguments.length;
  if (i2 < 2)
    throw new exceptions.InvalidArgument("Too few arguments");
  var args = new Array(i2 - 1);
  while (--i2)
    args[i2 - 1] = arguments[i2];
  scopeFunc = args.pop();
  var tables = flatten(args);
  return [mode, tables, scopeFunc];
}
function enterTransactionScope(db2, mode, storeNames, parentTransaction, scopeFunc) {
  return DexiePromise.resolve().then(() => {
    const transless = PSD.transless || PSD;
    const trans = db2._createTransaction(mode, storeNames, db2._dbSchema, parentTransaction);
    const zoneProps = {
      trans,
      transless
    };
    if (parentTransaction) {
      trans.idbtrans = parentTransaction.idbtrans;
    } else {
      try {
        trans.create();
        db2._state.PR1398_maxLoop = 3;
      } catch (ex) {
        if (ex.name === errnames.InvalidState && db2.isOpen() && --db2._state.PR1398_maxLoop > 0) {
          console.warn("Dexie: Need to reopen db");
          db2._close();
          return db2.open().then(() => enterTransactionScope(db2, mode, storeNames, null, scopeFunc));
        }
        return rejection(ex);
      }
    }
    const scopeFuncIsAsync = isAsyncFunction(scopeFunc);
    if (scopeFuncIsAsync) {
      incrementExpectedAwaits();
    }
    let returnValue;
    const promiseFollowed = DexiePromise.follow(() => {
      returnValue = scopeFunc.call(trans, trans);
      if (returnValue) {
        if (scopeFuncIsAsync) {
          var decrementor = decrementExpectedAwaits.bind(null, null);
          returnValue.then(decrementor, decrementor);
        } else if (typeof returnValue.next === "function" && typeof returnValue.throw === "function") {
          returnValue = awaitIterator(returnValue);
        }
      }
    }, zoneProps);
    return (returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue).then((x) => trans.active ? x : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"))) : promiseFollowed.then(() => returnValue)).then((x) => {
      if (parentTransaction)
        trans._resolve();
      return trans._completion.then(() => x);
    }).catch((e) => {
      trans._reject(e);
      return rejection(e);
    });
  });
}
function pad(a, value, count) {
  const result = isArray(a) ? a.slice() : [a];
  for (let i2 = 0; i2 < count; ++i2)
    result.push(value);
  return result;
}
function createVirtualIndexMiddleware(down) {
  return {
    ...down,
    table(tableName) {
      const table = down.table(tableName);
      const { schema } = table;
      const indexLookup = {};
      const allVirtualIndexes = [];
      function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
        const keyPathAlias = getKeyPathAlias(keyPath);
        const indexList = indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || [];
        const keyLength = keyPath == null ? 0 : typeof keyPath === "string" ? 1 : keyPath.length;
        const isVirtual = keyTail > 0;
        const virtualIndex = {
          ...lowLevelIndex,
          isVirtual,
          keyTail,
          keyLength,
          extractKey: getKeyExtractor(keyPath),
          unique: !isVirtual && lowLevelIndex.unique
        };
        indexList.push(virtualIndex);
        if (!virtualIndex.isPrimaryKey) {
          allVirtualIndexes.push(virtualIndex);
        }
        if (keyLength > 1) {
          const virtualKeyPath = keyLength === 2 ? keyPath[0] : keyPath.slice(0, keyLength - 1);
          addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
        }
        indexList.sort((a, b) => a.keyTail - b.keyTail);
        return virtualIndex;
      }
      const primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
      indexLookup[":id"] = [primaryKey];
      for (const index of schema.indexes) {
        addVirtualIndexes(index.keyPath, 0, index);
      }
      function findBestIndex(keyPath) {
        const result2 = indexLookup[getKeyPathAlias(keyPath)];
        return result2 && result2[0];
      }
      function translateRange(range, keyTail) {
        return {
          type: range.type === 1 ? 2 : range.type,
          lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
          lowerOpen: true,
          upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
          upperOpen: true
        };
      }
      function translateRequest(req) {
        const index = req.query.index;
        return index.isVirtual ? {
          ...req,
          query: {
            index,
            range: translateRange(req.query.range, index.keyTail)
          }
        } : req;
      }
      const result = {
        ...table,
        schema: {
          ...schema,
          primaryKey,
          indexes: allVirtualIndexes,
          getIndexByKeyPath: findBestIndex
        },
        count(req) {
          return table.count(translateRequest(req));
        },
        query(req) {
          return table.query(translateRequest(req));
        },
        openCursor(req) {
          const { keyTail, isVirtual, keyLength } = req.query.index;
          if (!isVirtual)
            return table.openCursor(req);
          function createVirtualCursor(cursor) {
            function _continue(key) {
              key != null ? cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) : req.unique ? cursor.continue(cursor.key.slice(0, keyLength).concat(req.reverse ? down.MIN_KEY : down.MAX_KEY, keyTail)) : cursor.continue();
            }
            const virtualCursor = Object.create(cursor, {
              continue: { value: _continue },
              continuePrimaryKey: {
                value(key, primaryKey2) {
                  cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey2);
                }
              },
              primaryKey: {
                get() {
                  return cursor.primaryKey;
                }
              },
              key: {
                get() {
                  const key = cursor.key;
                  return keyLength === 1 ? key[0] : key.slice(0, keyLength);
                }
              },
              value: {
                get() {
                  return cursor.value;
                }
              }
            });
            return virtualCursor;
          }
          return table.openCursor(translateRequest(req)).then((cursor) => cursor && createVirtualCursor(cursor));
        }
      };
      return result;
    }
  };
}
var virtualIndexMiddleware = {
  stack: "dbcore",
  name: "VirtualIndexMiddleware",
  level: 1,
  create: createVirtualIndexMiddleware
};
function getObjectDiff(a, b, rv, prfx) {
  rv = rv || {};
  prfx = prfx || "";
  keys(a).forEach((prop) => {
    if (!hasOwn(b, prop)) {
      rv[prfx + prop] = void 0;
    } else {
      var ap = a[prop], bp = b[prop];
      if (typeof ap === "object" && typeof bp === "object" && ap && bp) {
        const apTypeName = toStringTag(ap);
        const bpTypeName = toStringTag(bp);
        if (apTypeName !== bpTypeName) {
          rv[prfx + prop] = b[prop];
        } else if (apTypeName === "Object") {
          getObjectDiff(ap, bp, rv, prfx + prop + ".");
        } else if (ap !== bp) {
          rv[prfx + prop] = b[prop];
        }
      } else if (ap !== bp)
        rv[prfx + prop] = b[prop];
    }
  });
  keys(b).forEach((prop) => {
    if (!hasOwn(a, prop)) {
      rv[prfx + prop] = b[prop];
    }
  });
  return rv;
}
function getEffectiveKeys(primaryKey, req) {
  if (req.type === "delete")
    return req.keys;
  return req.keys || req.values.map(primaryKey.extractKey);
}
var hooksMiddleware = {
  stack: "dbcore",
  name: "HooksMiddleware",
  level: 2,
  create: (downCore) => ({
    ...downCore,
    table(tableName) {
      const downTable = downCore.table(tableName);
      const { primaryKey } = downTable.schema;
      const tableMiddleware = {
        ...downTable,
        mutate(req) {
          const dxTrans = PSD.trans;
          const { deleting, creating, updating } = dxTrans.table(tableName).hook;
          switch (req.type) {
            case "add":
              if (creating.fire === nop)
                break;
              return dxTrans._promise("readwrite", () => addPutOrDelete(req), true);
            case "put":
              if (creating.fire === nop && updating.fire === nop)
                break;
              return dxTrans._promise("readwrite", () => addPutOrDelete(req), true);
            case "delete":
              if (deleting.fire === nop)
                break;
              return dxTrans._promise("readwrite", () => addPutOrDelete(req), true);
            case "deleteRange":
              if (deleting.fire === nop)
                break;
              return dxTrans._promise("readwrite", () => deleteRange(req), true);
          }
          return downTable.mutate(req);
          function addPutOrDelete(req2) {
            const dxTrans2 = PSD.trans;
            const keys2 = req2.keys || getEffectiveKeys(primaryKey, req2);
            if (!keys2)
              throw new Error("Keys missing");
            req2 = req2.type === "add" || req2.type === "put" ? { ...req2, keys: keys2 } : { ...req2 };
            if (req2.type !== "delete")
              req2.values = [...req2.values];
            if (req2.keys)
              req2.keys = [...req2.keys];
            return getExistingValues(downTable, req2, keys2).then((existingValues) => {
              const contexts = keys2.map((key, i2) => {
                const existingValue = existingValues[i2];
                const ctx = { onerror: null, onsuccess: null };
                if (req2.type === "delete") {
                  deleting.fire.call(ctx, key, existingValue, dxTrans2);
                } else if (req2.type === "add" || existingValue === void 0) {
                  const generatedPrimaryKey = creating.fire.call(ctx, key, req2.values[i2], dxTrans2);
                  if (key == null && generatedPrimaryKey != null) {
                    key = generatedPrimaryKey;
                    req2.keys[i2] = key;
                    if (!primaryKey.outbound) {
                      setByKeyPath(req2.values[i2], primaryKey.keyPath, key);
                    }
                  }
                } else {
                  const objectDiff = getObjectDiff(existingValue, req2.values[i2]);
                  const additionalChanges = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans2);
                  if (additionalChanges) {
                    const requestedValue = req2.values[i2];
                    Object.keys(additionalChanges).forEach((keyPath) => {
                      if (hasOwn(requestedValue, keyPath)) {
                        requestedValue[keyPath] = additionalChanges[keyPath];
                      } else {
                        setByKeyPath(requestedValue, keyPath, additionalChanges[keyPath]);
                      }
                    });
                  }
                }
                return ctx;
              });
              return downTable.mutate(req2).then(({ failures, results, numFailures, lastResult }) => {
                for (let i2 = 0; i2 < keys2.length; ++i2) {
                  const primKey = results ? results[i2] : keys2[i2];
                  const ctx = contexts[i2];
                  if (primKey == null) {
                    ctx.onerror && ctx.onerror(failures[i2]);
                  } else {
                    ctx.onsuccess && ctx.onsuccess(
                      req2.type === "put" && existingValues[i2] ? req2.values[i2] : primKey
                    );
                  }
                }
                return { failures, results, numFailures, lastResult };
              }).catch((error) => {
                contexts.forEach((ctx) => ctx.onerror && ctx.onerror(error));
                return Promise.reject(error);
              });
            });
          }
          function deleteRange(req2) {
            return deleteNextChunk(req2.trans, req2.range, 1e4);
          }
          function deleteNextChunk(trans, range, limit) {
            return downTable.query({ trans, values: false, query: { index: primaryKey, range }, limit }).then(({ result }) => {
              return addPutOrDelete({ type: "delete", keys: result, trans }).then((res) => {
                if (res.numFailures > 0)
                  return Promise.reject(res.failures[0]);
                if (result.length < limit) {
                  return { failures: [], numFailures: 0, lastResult: void 0 };
                } else {
                  return deleteNextChunk(trans, { ...range, lower: result[result.length - 1], lowerOpen: true }, limit);
                }
              });
            });
          }
        }
      };
      return tableMiddleware;
    }
  })
};
function getExistingValues(table, req, effectiveKeys) {
  return req.type === "add" ? Promise.resolve([]) : table.getMany({ trans: req.trans, keys: effectiveKeys, cache: "immutable" });
}
function getFromTransactionCache(keys2, cache, clone) {
  try {
    if (!cache)
      return null;
    if (cache.keys.length < keys2.length)
      return null;
    const result = [];
    for (let i2 = 0, j = 0; i2 < cache.keys.length && j < keys2.length; ++i2) {
      if (cmp(cache.keys[i2], keys2[j]) !== 0)
        continue;
      result.push(clone ? deepClone(cache.values[i2]) : cache.values[i2]);
      ++j;
    }
    return result.length === keys2.length ? result : null;
  } catch (_a2) {
    return null;
  }
}
var cacheExistingValuesMiddleware = {
  stack: "dbcore",
  level: -1,
  create: (core) => {
    return {
      table: (tableName) => {
        const table = core.table(tableName);
        return {
          ...table,
          getMany: (req) => {
            if (!req.cache) {
              return table.getMany(req);
            }
            const cachedResult = getFromTransactionCache(req.keys, req.trans["_cache"], req.cache === "clone");
            if (cachedResult) {
              return DexiePromise.resolve(cachedResult);
            }
            return table.getMany(req).then((res) => {
              req.trans["_cache"] = {
                keys: req.keys,
                values: req.cache === "clone" ? deepClone(res) : res
              };
              return res;
            });
          },
          mutate: (req) => {
            if (req.type !== "add")
              req.trans["_cache"] = null;
            return table.mutate(req);
          }
        };
      }
    };
  }
};
function isEmptyRange(node) {
  return !("from" in node);
}
var RangeSet = function(fromOrTree, to) {
  if (this) {
    extend(this, arguments.length ? { d: 1, from: fromOrTree, to: arguments.length > 1 ? to : fromOrTree } : { d: 0 });
  } else {
    const rv = new RangeSet();
    if (fromOrTree && "d" in fromOrTree) {
      extend(rv, fromOrTree);
    }
    return rv;
  }
};
props(RangeSet.prototype, {
  add(rangeSet) {
    mergeRanges(this, rangeSet);
    return this;
  },
  addKey(key) {
    addRange(this, key, key);
    return this;
  },
  addKeys(keys2) {
    keys2.forEach((key) => addRange(this, key, key));
    return this;
  },
  [iteratorSymbol]() {
    return getRangeSetIterator(this);
  }
});
function addRange(target, from, to) {
  const diff = cmp(from, to);
  if (isNaN(diff))
    return;
  if (diff > 0)
    throw RangeError();
  if (isEmptyRange(target))
    return extend(target, { from, to, d: 1 });
  const left = target.l;
  const right = target.r;
  if (cmp(to, target.from) < 0) {
    left ? addRange(left, from, to) : target.l = { from, to, d: 1, l: null, r: null };
    return rebalance(target);
  }
  if (cmp(from, target.to) > 0) {
    right ? addRange(right, from, to) : target.r = { from, to, d: 1, l: null, r: null };
    return rebalance(target);
  }
  if (cmp(from, target.from) < 0) {
    target.from = from;
    target.l = null;
    target.d = right ? right.d + 1 : 1;
  }
  if (cmp(to, target.to) > 0) {
    target.to = to;
    target.r = null;
    target.d = target.l ? target.l.d + 1 : 1;
  }
  const rightWasCutOff = !target.r;
  if (left && !target.l) {
    mergeRanges(target, left);
  }
  if (right && rightWasCutOff) {
    mergeRanges(target, right);
  }
}
function mergeRanges(target, newSet) {
  function _addRangeSet(target2, { from, to, l, r }) {
    addRange(target2, from, to);
    if (l)
      _addRangeSet(target2, l);
    if (r)
      _addRangeSet(target2, r);
  }
  if (!isEmptyRange(newSet))
    _addRangeSet(target, newSet);
}
function rangesOverlap(rangeSet1, rangeSet2) {
  const i1 = getRangeSetIterator(rangeSet2);
  let nextResult1 = i1.next();
  if (nextResult1.done)
    return false;
  let a = nextResult1.value;
  const i2 = getRangeSetIterator(rangeSet1);
  let nextResult2 = i2.next(a.from);
  let b = nextResult2.value;
  while (!nextResult1.done && !nextResult2.done) {
    if (cmp(b.from, a.to) <= 0 && cmp(b.to, a.from) >= 0)
      return true;
    cmp(a.from, b.from) < 0 ? a = (nextResult1 = i1.next(b.from)).value : b = (nextResult2 = i2.next(a.from)).value;
  }
  return false;
}
function getRangeSetIterator(node) {
  let state = isEmptyRange(node) ? null : { s: 0, n: node };
  return {
    next(key) {
      const keyProvided = arguments.length > 0;
      while (state) {
        switch (state.s) {
          case 0:
            state.s = 1;
            if (keyProvided) {
              while (state.n.l && cmp(key, state.n.from) < 0)
                state = { up: state, n: state.n.l, s: 1 };
            } else {
              while (state.n.l)
                state = { up: state, n: state.n.l, s: 1 };
            }
          case 1:
            state.s = 2;
            if (!keyProvided || cmp(key, state.n.to) <= 0)
              return { value: state.n, done: false };
          case 2:
            if (state.n.r) {
              state.s = 3;
              state = { up: state, n: state.n.r, s: 0 };
              continue;
            }
          case 3:
            state = state.up;
        }
      }
      return { done: true };
    }
  };
}
function rebalance(target) {
  var _a2, _b;
  const diff = (((_a2 = target.r) === null || _a2 === void 0 ? void 0 : _a2.d) || 0) - (((_b = target.l) === null || _b === void 0 ? void 0 : _b.d) || 0);
  const r = diff > 1 ? "r" : diff < -1 ? "l" : "";
  if (r) {
    const l = r === "r" ? "l" : "r";
    const rootClone = { ...target };
    const oldRootRight = target[r];
    target.from = oldRootRight.from;
    target.to = oldRootRight.to;
    target[r] = oldRootRight[r];
    rootClone[r] = oldRootRight[l];
    target[l] = rootClone;
    rootClone.d = computeDepth(rootClone);
  }
  target.d = computeDepth(target);
}
function computeDepth({ r, l }) {
  return (r ? l ? Math.max(r.d, l.d) : r.d : l ? l.d : 0) + 1;
}
var observabilityMiddleware = {
  stack: "dbcore",
  level: 0,
  create: (core) => {
    const dbName = core.schema.name;
    const FULL_RANGE = new RangeSet(core.MIN_KEY, core.MAX_KEY);
    return {
      ...core,
      table: (tableName) => {
        const table = core.table(tableName);
        const { schema } = table;
        const { primaryKey } = schema;
        const { extractKey, outbound } = primaryKey;
        const tableClone = {
          ...table,
          mutate: (req) => {
            const trans = req.trans;
            const mutatedParts = trans.mutatedParts || (trans.mutatedParts = {});
            const getRangeSet = (indexName) => {
              const part = `idb://${dbName}/${tableName}/${indexName}`;
              return mutatedParts[part] || (mutatedParts[part] = new RangeSet());
            };
            const pkRangeSet = getRangeSet("");
            const delsRangeSet = getRangeSet(":dels");
            const { type: type2 } = req;
            let [keys2, newObjs] = req.type === "deleteRange" ? [req.range] : req.type === "delete" ? [req.keys] : req.values.length < 50 ? [[], req.values] : [];
            const oldCache = req.trans["_cache"];
            return table.mutate(req).then((res) => {
              if (isArray(keys2)) {
                if (type2 !== "delete")
                  keys2 = res.results;
                pkRangeSet.addKeys(keys2);
                const oldObjs = getFromTransactionCache(keys2, oldCache);
                if (!oldObjs && type2 !== "add") {
                  delsRangeSet.addKeys(keys2);
                }
                if (oldObjs || newObjs) {
                  trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs);
                }
              } else if (keys2) {
                const range = { from: keys2.lower, to: keys2.upper };
                delsRangeSet.add(range);
                pkRangeSet.add(range);
              } else {
                pkRangeSet.add(FULL_RANGE);
                delsRangeSet.add(FULL_RANGE);
                schema.indexes.forEach((idx) => getRangeSet(idx.name).add(FULL_RANGE));
              }
              return res;
            });
          }
        };
        const getRange = ({ query: { index, range } }) => {
          var _a2, _b;
          return [
            index,
            new RangeSet((_a2 = range.lower) !== null && _a2 !== void 0 ? _a2 : core.MIN_KEY, (_b = range.upper) !== null && _b !== void 0 ? _b : core.MAX_KEY)
          ];
        };
        const readSubscribers = {
          get: (req) => [primaryKey, new RangeSet(req.key)],
          getMany: (req) => [primaryKey, new RangeSet().addKeys(req.keys)],
          count: getRange,
          query: getRange,
          openCursor: getRange
        };
        keys(readSubscribers).forEach((method) => {
          tableClone[method] = function(req) {
            const { subscr } = PSD;
            if (subscr) {
              const getRangeSet = (indexName) => {
                const part = `idb://${dbName}/${tableName}/${indexName}`;
                return subscr[part] || (subscr[part] = new RangeSet());
              };
              const pkRangeSet = getRangeSet("");
              const delsRangeSet = getRangeSet(":dels");
              const [queriedIndex, queriedRanges] = readSubscribers[method](req);
              getRangeSet(queriedIndex.name || "").add(queriedRanges);
              if (!queriedIndex.isPrimaryKey) {
                if (method === "count") {
                  delsRangeSet.add(FULL_RANGE);
                } else {
                  const keysPromise = method === "query" && outbound && req.values && table.query({
                    ...req,
                    values: false
                  });
                  return table[method].apply(this, arguments).then((res) => {
                    if (method === "query") {
                      if (outbound && req.values) {
                        return keysPromise.then(({ result: resultingKeys }) => {
                          pkRangeSet.addKeys(resultingKeys);
                          return res;
                        });
                      }
                      const pKeys = req.values ? res.result.map(extractKey) : res.result;
                      if (req.values) {
                        pkRangeSet.addKeys(pKeys);
                      } else {
                        delsRangeSet.addKeys(pKeys);
                      }
                    } else if (method === "openCursor") {
                      const cursor = res;
                      const wantValues = req.values;
                      return cursor && Object.create(cursor, {
                        key: {
                          get() {
                            delsRangeSet.addKey(cursor.primaryKey);
                            return cursor.key;
                          }
                        },
                        primaryKey: {
                          get() {
                            const pkey = cursor.primaryKey;
                            delsRangeSet.addKey(pkey);
                            return pkey;
                          }
                        },
                        value: {
                          get() {
                            wantValues && pkRangeSet.addKey(cursor.primaryKey);
                            return cursor.value;
                          }
                        }
                      });
                    }
                    return res;
                  });
                }
              }
            }
            return table[method].apply(this, arguments);
          };
        });
        return tableClone;
      }
    };
  }
};
function trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs) {
  function addAffectedIndex(ix) {
    const rangeSet = getRangeSet(ix.name || "");
    function extractKey(obj) {
      return obj != null ? ix.extractKey(obj) : null;
    }
    const addKeyOrKeys = (key) => ix.multiEntry && isArray(key) ? key.forEach((key2) => rangeSet.addKey(key2)) : rangeSet.addKey(key);
    (oldObjs || newObjs).forEach((_, i2) => {
      const oldKey = oldObjs && extractKey(oldObjs[i2]);
      const newKey = newObjs && extractKey(newObjs[i2]);
      if (cmp(oldKey, newKey) !== 0) {
        if (oldKey != null)
          addKeyOrKeys(oldKey);
        if (newKey != null)
          addKeyOrKeys(newKey);
      }
    });
  }
  schema.indexes.forEach(addAffectedIndex);
}
var Dexie$1 = class {
  constructor(name, options) {
    this._middlewares = {};
    this.verno = 0;
    const deps = Dexie$1.dependencies;
    this._options = options = {
      addons: Dexie$1.addons,
      autoOpen: true,
      indexedDB: deps.indexedDB,
      IDBKeyRange: deps.IDBKeyRange,
      ...options
    };
    this._deps = {
      indexedDB: options.indexedDB,
      IDBKeyRange: options.IDBKeyRange
    };
    const { addons } = options;
    this._dbSchema = {};
    this._versions = [];
    this._storeNames = [];
    this._allTables = {};
    this.idbdb = null;
    this._novip = this;
    const state = {
      dbOpenError: null,
      isBeingOpened: false,
      onReadyBeingFired: null,
      openComplete: false,
      dbReadyResolve: nop,
      dbReadyPromise: null,
      cancelOpen: nop,
      openCanceller: null,
      autoSchema: true,
      PR1398_maxLoop: 3
    };
    state.dbReadyPromise = new DexiePromise((resolve) => {
      state.dbReadyResolve = resolve;
    });
    state.openCanceller = new DexiePromise((_, reject) => {
      state.cancelOpen = reject;
    });
    this._state = state;
    this.name = name;
    this.on = Events(this, "populate", "blocked", "versionchange", "close", { ready: [promisableChain, nop] });
    this.on.ready.subscribe = override(this.on.ready.subscribe, (subscribe2) => {
      return (subscriber, bSticky) => {
        Dexie$1.vip(() => {
          const state2 = this._state;
          if (state2.openComplete) {
            if (!state2.dbOpenError)
              DexiePromise.resolve().then(subscriber);
            if (bSticky)
              subscribe2(subscriber);
          } else if (state2.onReadyBeingFired) {
            state2.onReadyBeingFired.push(subscriber);
            if (bSticky)
              subscribe2(subscriber);
          } else {
            subscribe2(subscriber);
            const db2 = this;
            if (!bSticky)
              subscribe2(function unsubscribe() {
                db2.on.ready.unsubscribe(subscriber);
                db2.on.ready.unsubscribe(unsubscribe);
              });
          }
        });
      };
    });
    this.Collection = createCollectionConstructor(this);
    this.Table = createTableConstructor(this);
    this.Transaction = createTransactionConstructor(this);
    this.Version = createVersionConstructor(this);
    this.WhereClause = createWhereClauseConstructor(this);
    this.on("versionchange", (ev) => {
      if (ev.newVersion > 0)
        console.warn(`Another connection wants to upgrade database '${this.name}'. Closing db now to resume the upgrade.`);
      else
        console.warn(`Another connection wants to delete database '${this.name}'. Closing db now to resume the delete request.`);
      this.close();
    });
    this.on("blocked", (ev) => {
      if (!ev.newVersion || ev.newVersion < ev.oldVersion)
        console.warn(`Dexie.delete('${this.name}') was blocked`);
      else
        console.warn(`Upgrade '${this.name}' blocked by other connection holding version ${ev.oldVersion / 10}`);
    });
    this._maxKey = getMaxKey(options.IDBKeyRange);
    this._createTransaction = (mode, storeNames, dbschema, parentTransaction) => new this.Transaction(mode, storeNames, dbschema, this._options.chromeTransactionDurability, parentTransaction);
    this._fireOnBlocked = (ev) => {
      this.on("blocked").fire(ev);
      connections.filter((c) => c.name === this.name && c !== this && !c._state.vcFired).map((c) => c.on("versionchange").fire(ev));
    };
    this.use(virtualIndexMiddleware);
    this.use(hooksMiddleware);
    this.use(observabilityMiddleware);
    this.use(cacheExistingValuesMiddleware);
    this.vip = Object.create(this, { _vip: { value: true } });
    addons.forEach((addon) => addon(this));
  }
  version(versionNumber) {
    if (isNaN(versionNumber) || versionNumber < 0.1)
      throw new exceptions.Type(`Given version is not a positive number`);
    versionNumber = Math.round(versionNumber * 10) / 10;
    if (this.idbdb || this._state.isBeingOpened)
      throw new exceptions.Schema("Cannot add version when database is open");
    this.verno = Math.max(this.verno, versionNumber);
    const versions = this._versions;
    var versionInstance = versions.filter((v) => v._cfg.version === versionNumber)[0];
    if (versionInstance)
      return versionInstance;
    versionInstance = new this.Version(versionNumber);
    versions.push(versionInstance);
    versions.sort(lowerVersionFirst);
    versionInstance.stores({});
    this._state.autoSchema = false;
    return versionInstance;
  }
  _whenReady(fn) {
    return this.idbdb && (this._state.openComplete || PSD.letThrough || this._vip) ? fn() : new DexiePromise((resolve, reject) => {
      if (this._state.openComplete) {
        return reject(new exceptions.DatabaseClosed(this._state.dbOpenError));
      }
      if (!this._state.isBeingOpened) {
        if (!this._options.autoOpen) {
          reject(new exceptions.DatabaseClosed());
          return;
        }
        this.open().catch(nop);
      }
      this._state.dbReadyPromise.then(resolve, reject);
    }).then(fn);
  }
  use({ stack, create, level, name }) {
    if (name)
      this.unuse({ stack, name });
    const middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
    middlewares.push({ stack, create, level: level == null ? 10 : level, name });
    middlewares.sort((a, b) => a.level - b.level);
    return this;
  }
  unuse({ stack, name, create }) {
    if (stack && this._middlewares[stack]) {
      this._middlewares[stack] = this._middlewares[stack].filter((mw) => create ? mw.create !== create : name ? mw.name !== name : false);
    }
    return this;
  }
  open() {
    return dexieOpen(this);
  }
  _close() {
    const state = this._state;
    const idx = connections.indexOf(this);
    if (idx >= 0)
      connections.splice(idx, 1);
    if (this.idbdb) {
      try {
        this.idbdb.close();
      } catch (e) {
      }
      this._novip.idbdb = null;
    }
    state.dbReadyPromise = new DexiePromise((resolve) => {
      state.dbReadyResolve = resolve;
    });
    state.openCanceller = new DexiePromise((_, reject) => {
      state.cancelOpen = reject;
    });
  }
  close() {
    this._close();
    const state = this._state;
    this._options.autoOpen = false;
    state.dbOpenError = new exceptions.DatabaseClosed();
    if (state.isBeingOpened)
      state.cancelOpen(state.dbOpenError);
  }
  delete() {
    const hasArguments = arguments.length > 0;
    const state = this._state;
    return new DexiePromise((resolve, reject) => {
      const doDelete = () => {
        this.close();
        var req = this._deps.indexedDB.deleteDatabase(this.name);
        req.onsuccess = wrap(() => {
          _onDatabaseDeleted(this._deps, this.name);
          resolve();
        });
        req.onerror = eventRejectHandler(reject);
        req.onblocked = this._fireOnBlocked;
      };
      if (hasArguments)
        throw new exceptions.InvalidArgument("Arguments not allowed in db.delete()");
      if (state.isBeingOpened) {
        state.dbReadyPromise.then(doDelete);
      } else {
        doDelete();
      }
    });
  }
  backendDB() {
    return this.idbdb;
  }
  isOpen() {
    return this.idbdb !== null;
  }
  hasBeenClosed() {
    const dbOpenError = this._state.dbOpenError;
    return dbOpenError && dbOpenError.name === "DatabaseClosed";
  }
  hasFailed() {
    return this._state.dbOpenError !== null;
  }
  dynamicallyOpened() {
    return this._state.autoSchema;
  }
  get tables() {
    return keys(this._allTables).map((name) => this._allTables[name]);
  }
  transaction() {
    const args = extractTransactionArgs.apply(this, arguments);
    return this._transaction.apply(this, args);
  }
  _transaction(mode, tables, scopeFunc) {
    let parentTransaction = PSD.trans;
    if (!parentTransaction || parentTransaction.db !== this || mode.indexOf("!") !== -1)
      parentTransaction = null;
    const onlyIfCompatible = mode.indexOf("?") !== -1;
    mode = mode.replace("!", "").replace("?", "");
    let idbMode, storeNames;
    try {
      storeNames = tables.map((table) => {
        var storeName = table instanceof this.Table ? table.name : table;
        if (typeof storeName !== "string")
          throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
        return storeName;
      });
      if (mode == "r" || mode === READONLY)
        idbMode = READONLY;
      else if (mode == "rw" || mode == READWRITE)
        idbMode = READWRITE;
      else
        throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
      if (parentTransaction) {
        if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
          if (onlyIfCompatible) {
            parentTransaction = null;
          } else
            throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
        }
        if (parentTransaction) {
          storeNames.forEach((storeName) => {
            if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
              if (onlyIfCompatible) {
                parentTransaction = null;
              } else
                throw new exceptions.SubTransaction("Table " + storeName + " not included in parent transaction.");
            }
          });
        }
        if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
          parentTransaction = null;
        }
      }
    } catch (e) {
      return parentTransaction ? parentTransaction._promise(null, (_, reject) => {
        reject(e);
      }) : rejection(e);
    }
    const enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
    return parentTransaction ? parentTransaction._promise(idbMode, enterTransaction, "lock") : PSD.trans ? usePSD(PSD.transless, () => this._whenReady(enterTransaction)) : this._whenReady(enterTransaction);
  }
  table(tableName) {
    if (!hasOwn(this._allTables, tableName)) {
      throw new exceptions.InvalidTable(`Table ${tableName} does not exist`);
    }
    return this._allTables[tableName];
  }
};
var symbolObservable = typeof Symbol !== "undefined" && "observable" in Symbol ? Symbol.observable : "@@observable";
var Observable = class {
  constructor(subscribe2) {
    this._subscribe = subscribe2;
  }
  subscribe(x, error, complete) {
    return this._subscribe(!x || typeof x === "function" ? { next: x, error, complete } : x);
  }
  [symbolObservable]() {
    return this;
  }
};
function extendObservabilitySet(target, newSet) {
  keys(newSet).forEach((part) => {
    const rangeSet = target[part] || (target[part] = new RangeSet());
    mergeRanges(rangeSet, newSet[part]);
  });
  return target;
}
function liveQuery(querier) {
  let hasValue = false;
  let currentValue = void 0;
  const observable = new Observable((observer) => {
    const scopeFuncIsAsync = isAsyncFunction(querier);
    function execute(subscr) {
      if (scopeFuncIsAsync) {
        incrementExpectedAwaits();
      }
      const exec = () => newScope(querier, { subscr, trans: null });
      const rv = PSD.trans ? usePSD(PSD.transless, exec) : exec();
      if (scopeFuncIsAsync) {
        rv.then(decrementExpectedAwaits, decrementExpectedAwaits);
      }
      return rv;
    }
    let closed = false;
    let accumMuts = {};
    let currentObs = {};
    const subscription = {
      get closed() {
        return closed;
      },
      unsubscribe: () => {
        closed = true;
        globalEvents.storagemutated.unsubscribe(mutationListener);
      }
    };
    observer.start && observer.start(subscription);
    let querying = false, startedListening = false;
    function shouldNotify() {
      return keys(currentObs).some((key) => accumMuts[key] && rangesOverlap(accumMuts[key], currentObs[key]));
    }
    const mutationListener = (parts) => {
      extendObservabilitySet(accumMuts, parts);
      if (shouldNotify()) {
        doQuery();
      }
    };
    const doQuery = () => {
      if (querying || closed)
        return;
      accumMuts = {};
      const subscr = {};
      const ret = execute(subscr);
      if (!startedListening) {
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, mutationListener);
        startedListening = true;
      }
      querying = true;
      Promise.resolve(ret).then((result) => {
        hasValue = true;
        currentValue = result;
        querying = false;
        if (closed)
          return;
        if (shouldNotify()) {
          doQuery();
        } else {
          accumMuts = {};
          currentObs = subscr;
          observer.next && observer.next(result);
        }
      }, (err) => {
        querying = false;
        hasValue = false;
        observer.error && observer.error(err);
        subscription.unsubscribe();
      });
    };
    doQuery();
    return subscription;
  });
  observable.hasValue = () => hasValue;
  observable.getValue = () => currentValue;
  return observable;
}
var domDeps;
try {
  domDeps = {
    indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
    IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
  };
} catch (e) {
  domDeps = { indexedDB: null, IDBKeyRange: null };
}
var Dexie = Dexie$1;
props(Dexie, {
  ...fullNameExceptions,
  delete(databaseName) {
    const db2 = new Dexie(databaseName, { addons: [] });
    return db2.delete();
  },
  exists(name) {
    return new Dexie(name, { addons: [] }).open().then((db2) => {
      db2.close();
      return true;
    }).catch("NoSuchDatabaseError", () => false);
  },
  getDatabaseNames(cb) {
    try {
      return getDatabaseNames(Dexie.dependencies).then(cb);
    } catch (_a2) {
      return rejection(new exceptions.MissingAPI());
    }
  },
  defineClass() {
    function Class(content) {
      extend(this, content);
    }
    return Class;
  },
  ignoreTransaction(scopeFunc) {
    return PSD.trans ? usePSD(PSD.transless, scopeFunc) : scopeFunc();
  },
  vip,
  async: function(generatorFn) {
    return function() {
      try {
        var rv = awaitIterator(generatorFn.apply(this, arguments));
        if (!rv || typeof rv.then !== "function")
          return DexiePromise.resolve(rv);
        return rv;
      } catch (e) {
        return rejection(e);
      }
    };
  },
  spawn: function(generatorFn, args, thiz) {
    try {
      var rv = awaitIterator(generatorFn.apply(thiz, args || []));
      if (!rv || typeof rv.then !== "function")
        return DexiePromise.resolve(rv);
      return rv;
    } catch (e) {
      return rejection(e);
    }
  },
  currentTransaction: {
    get: () => PSD.trans || null
  },
  waitFor: function(promiseOrFunction, optionalTimeout) {
    const promise = DexiePromise.resolve(typeof promiseOrFunction === "function" ? Dexie.ignoreTransaction(promiseOrFunction) : promiseOrFunction).timeout(optionalTimeout || 6e4);
    return PSD.trans ? PSD.trans.waitFor(promise) : promise;
  },
  Promise: DexiePromise,
  debug: {
    get: () => debug4,
    set: (value) => {
      setDebug(value, value === "dexie" ? () => true : dexieStackFrameFilter);
    }
  },
  derive,
  extend,
  props,
  override,
  Events,
  on: globalEvents,
  liveQuery,
  extendObservabilitySet,
  getByKeyPath,
  setByKeyPath,
  delByKeyPath,
  shallowClone,
  deepClone,
  getObjectDiff,
  cmp,
  asap: asap$1,
  minKey,
  addons: [],
  connections,
  errnames,
  dependencies: domDeps,
  semVer: DEXIE_VERSION,
  version: DEXIE_VERSION.split(".").map((n) => parseInt(n)).reduce((p, c, i2) => p + c / Math.pow(10, i2 * 2))
});
Dexie.maxKey = getMaxKey(Dexie.dependencies.IDBKeyRange);
if (typeof dispatchEvent !== "undefined" && typeof addEventListener !== "undefined") {
  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, (updatedParts) => {
    if (!propagatingLocally) {
      let event;
      if (isIEOrEdge) {
        event = document.createEvent("CustomEvent");
        event.initCustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, true, true, updatedParts);
      } else {
        event = new CustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, {
          detail: updatedParts
        });
      }
      propagatingLocally = true;
      dispatchEvent(event);
      propagatingLocally = false;
    }
  });
  addEventListener(STORAGE_MUTATED_DOM_EVENT_NAME, ({ detail }) => {
    if (!propagatingLocally) {
      propagateLocally(detail);
    }
  });
}
function propagateLocally(updateParts) {
  let wasMe = propagatingLocally;
  try {
    propagatingLocally = true;
    globalEvents.storagemutated.fire(updateParts);
  } finally {
    propagatingLocally = wasMe;
  }
}
var propagatingLocally = false;
if (typeof BroadcastChannel !== "undefined") {
  const bc = new BroadcastChannel(STORAGE_MUTATED_DOM_EVENT_NAME);
  if (typeof bc.unref === "function") {
    bc.unref();
  }
  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, (changedParts) => {
    if (!propagatingLocally) {
      bc.postMessage(changedParts);
    }
  });
  bc.onmessage = (ev) => {
    if (ev.data)
      propagateLocally(ev.data);
  };
} else if (typeof self !== "undefined" && typeof navigator !== "undefined") {
  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, (changedParts) => {
    try {
      if (!propagatingLocally) {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(STORAGE_MUTATED_DOM_EVENT_NAME, JSON.stringify({
            trig: Math.random(),
            changedParts
          }));
        }
        if (typeof self["clients"] === "object") {
          [...self["clients"].matchAll({ includeUncontrolled: true })].forEach((client) => client.postMessage({
            type: STORAGE_MUTATED_DOM_EVENT_NAME,
            changedParts
          }));
        }
      }
    } catch (_a2) {
    }
  });
  if (typeof addEventListener !== "undefined") {
    addEventListener("storage", (ev) => {
      if (ev.key === STORAGE_MUTATED_DOM_EVENT_NAME) {
        const data = JSON.parse(ev.newValue);
        if (data)
          propagateLocally(data.changedParts);
      }
    });
  }
  const swContainer = self.document && navigator.serviceWorker;
  if (swContainer) {
    swContainer.addEventListener("message", propagateMessageLocally);
  }
}
function propagateMessageLocally({ data }) {
  if (data && data.type === STORAGE_MUTATED_DOM_EVENT_NAME) {
    propagateLocally(data.changedParts);
  }
}
DexiePromise.rejectionMapper = mapError;
setDebug(debug4, dexieStackFrameFilter);

// node_modules/@nostr-dev-kit/ndk-cache-dexie/dist/index.mjs
var Database = class extends Dexie$1 {
  users;
  events;
  eventTags;
  constructor(name) {
    super(name);
    this.version(4).stores({
      users: "&pubkey, profile, createdAt",
      events: "&id, pubkey, content, kind, createdAt, relay, [kind+pubkey]",
      eventTags: "id, tagValue, tag, value, eventId"
    });
  }
};
var db;
function createDatabase(name) {
  db = new Database(name);
}
var NDKCacheAdapterDexie = class {
  debug;
  expirationTime;
  locking;
  profiles;
  dirtyProfiles = /* @__PURE__ */ new Set();
  constructor(opts = {}) {
    createDatabase(opts.dbName || "ndk");
    this.debug = opts.debug || (0, import_debug4.default)("ndk:dexie-adapter");
    this.locking = true;
    this.expirationTime = opts.expirationTime || 3600;
    if (opts.profileCacheSize !== "disabled") {
      this.profiles = new import_typescript_lru_cache2.LRUCache({
        maxSize: opts.profileCacheSize || 1e5
      });
      setInterval(() => {
        this.dumpProfiles();
      }, 1e3 * 10);
    }
  }
  async query(subscription) {
    Promise.allSettled(
      subscription.filters.map((filter) => this.processFilter(filter, subscription))
    );
  }
  async fetchProfile(pubkey) {
    if (!this.profiles)
      return null;
    let profile = this.profiles.get(pubkey);
    if (!profile) {
      const user = await db.users.get({ pubkey });
      if (user) {
        profile = user.profile;
        this.profiles.set(pubkey, profile);
      }
    }
    return profile;
  }
  saveProfile(pubkey, profile) {
    if (!this.profiles)
      return;
    this.profiles.set(pubkey, profile);
    this.dirtyProfiles.add(pubkey);
  }
  async processFilter(filter, subscription) {
    const _filter = { ...filter };
    delete _filter.limit;
    const filterKeys = Object.keys(_filter || {}).sort();
    try {
      await this.byKindAndAuthor(filterKeys, filter, subscription) || await this.byAuthors(filterKeys, filter, subscription) || await this.byKinds(filterKeys, filter, subscription) || await this.byIdsQuery(filterKeys, filter, subscription) || await this.byNip33Query(filterKeys, filter, subscription) || await this.byTagsAndOptionallyKinds(filterKeys, filter, subscription);
    } catch (error) {
      console.error(error);
    }
  }
  async setEvent(event, _filter, relay) {
    if (event.kind === 0) {
      if (!this.profiles)
        return;
      const profile = profileFromEvent(event);
      this.profiles.set(event.pubkey, profile);
    } else {
      let addEvent = true;
      if (event.isParamReplaceable()) {
        const replaceableId = `${event.kind}:${event.pubkey}:${event.tagId()}`;
        const existingEvent = await db.events.where({ id: replaceableId }).first();
        if (existingEvent && event.created_at && existingEvent.createdAt > event.created_at) {
          addEvent = false;
        }
      }
      if (addEvent) {
        db.events.put({
          id: event.tagId(),
          pubkey: event.pubkey,
          content: event.content,
          kind: event.kind,
          createdAt: event.created_at,
          relay: relay == null ? void 0 : relay.url,
          event: JSON.stringify(event.rawEvent())
        });
        if (event.kind !== 3) {
          event.tags.forEach((tag) => {
            if (tag[0].length !== 1)
              return;
            db.eventTags.put({
              id: `${event.id}:${tag[0]}:${tag[1]}`,
              eventId: event.id,
              tag: tag[0],
              value: tag[1],
              tagValue: tag[0] + tag[1]
            });
          });
        }
      }
    }
  }
  /**
   * Searches by authors
   */
  async byAuthors(filterKeys, filter, subscription) {
    const f2 = ["authors"];
    const hasAllKeys = filterKeys.length === f2.length && f2.every((k) => filterKeys.includes(k));
    let foundEvents = false;
    if (hasAllKeys && filter.authors) {
      for (const pubkey of filter.authors) {
        const events = await db.events.where({ pubkey }).toArray();
        for (const event of events) {
          let rawEvent;
          try {
            rawEvent = JSON.parse(event.event);
          } catch (e) {
            console.log("failed to parse event", e);
            continue;
          }
          const ndkEvent = new NDKEvent(void 0, rawEvent);
          const relay = event.relay ? new NDKRelay(event.relay) : void 0;
          subscription.eventReceived(ndkEvent, relay, true);
          foundEvents = true;
        }
      }
    }
    return foundEvents;
  }
  /**
   * Searches by kinds
   */
  async byKinds(filterKeys, filter, subscription) {
    const f2 = ["kinds"];
    const hasAllKeys = filterKeys.length === f2.length && f2.every((k) => filterKeys.includes(k));
    let foundEvents = false;
    if (hasAllKeys && filter.kinds) {
      for (const kind of filter.kinds) {
        const events = await db.events.where({ kind }).toArray();
        for (const event of events) {
          let rawEvent;
          try {
            rawEvent = JSON.parse(event.event);
          } catch (e) {
            console.log("failed to parse event", e);
            continue;
          }
          const ndkEvent = new NDKEvent(void 0, rawEvent);
          const relay = event.relay ? new NDKRelay(event.relay) : void 0;
          subscription.eventReceived(ndkEvent, relay, true);
          foundEvents = true;
        }
      }
    }
    return foundEvents;
  }
  /**
   * Searches by ids
   */
  async byIdsQuery(filterKeys, filter, subscription) {
    const f2 = ["ids"];
    const hasAllKeys = filterKeys.length === f2.length && f2.every((k) => filterKeys.includes(k));
    if (hasAllKeys && filter.ids) {
      for (const id of filter.ids) {
        const event = await db.events.where({ id }).first();
        if (!event)
          continue;
        let rawEvent;
        try {
          rawEvent = JSON.parse(event.event);
        } catch (e) {
          console.log("failed to parse event", e);
          continue;
        }
        const ndkEvent = new NDKEvent(void 0, rawEvent);
        const relay = event.relay ? new NDKRelay(event.relay) : void 0;
        subscription.eventReceived(ndkEvent, relay, true);
      }
      return true;
    }
    return false;
  }
  /**
   * Searches by NIP-33
   */
  async byNip33Query(filterKeys, filter, subscription) {
    const f2 = ["#d", "authors", "kinds"];
    const hasAllKeys = filterKeys.length === f2.length && f2.every((k) => filterKeys.includes(k));
    if (hasAllKeys && filter.kinds && filter.authors) {
      for (const kind of filter.kinds) {
        const replaceableKind = kind >= 3e4 && kind < 4e4;
        if (!replaceableKind)
          continue;
        for (const author of filter.authors) {
          for (const dTag of filter["#d"]) {
            const replaceableId = `${kind}:${author}:${dTag}`;
            const event = await db.events.where({ id: replaceableId }).first();
            if (!event)
              continue;
            let rawEvent;
            try {
              rawEvent = JSON.parse(event.event);
            } catch (e) {
              console.log("failed to parse event", e);
              continue;
            }
            const ndkEvent = new NDKEvent(void 0, rawEvent);
            const relay = event.relay ? new NDKRelay(event.relay) : void 0;
            subscription.eventReceived(ndkEvent, relay, true);
          }
        }
      }
      return true;
    }
    return false;
  }
  /**
   * Searches by kind & author
   */
  async byKindAndAuthor(filterKeys, filter, subscription) {
    const f2 = ["authors", "kinds"];
    const hasAllKeys = filterKeys.length === f2.length && f2.every((k) => filterKeys.includes(k));
    let foundEvents = false;
    if (!hasAllKeys)
      return false;
    if (filter.kinds && filter.authors) {
      for (const kind of filter.kinds) {
        for (const author of filter.authors) {
          const events = await db.events.where({ kind, pubkey: author }).toArray();
          for (const event of events) {
            let rawEvent;
            try {
              rawEvent = JSON.parse(event.event);
            } catch (e) {
              console.log("failed to parse event", e);
              continue;
            }
            const ndkEvent = new NDKEvent(void 0, rawEvent);
            const relay = event.relay ? new NDKRelay(event.relay) : void 0;
            subscription.eventReceived(ndkEvent, relay, true);
            foundEvents = true;
          }
        }
      }
    }
    return foundEvents;
  }
  /**
   * Searches by tags and optionally filters by tags
   */
  async byTagsAndOptionallyKinds(filterKeys, filter, subscription) {
    for (const filterKey of filterKeys) {
      const isKind = filterKey === "kinds";
      const isTag = filterKey.startsWith("#") && filterKey.length === 2;
      if (!isKind && !isTag)
        return false;
    }
    const events = await this.filterByTag(filterKeys, filter);
    const kinds = filter.kinds;
    for (const event of events) {
      if (!(kinds == null ? void 0 : kinds.includes(event.kind)))
        continue;
      subscription.eventReceived(event, void 0, true);
    }
    return false;
  }
  async filterByTag(filterKeys, filter) {
    const retEvents = [];
    for (const filterKey of filterKeys) {
      if (filterKey.length !== 2)
        continue;
      const tag = filterKey.slice(1);
      const values = [];
      for (const [key, value] of Object.entries(filter)) {
        if (key === filterKey)
          values.push(value);
      }
      for (const value of values) {
        const eventTags = await db.eventTags.where({ tagValue: tag + value }).toArray();
        if (!eventTags.length)
          continue;
        const eventIds = eventTags.map((t) => t.eventId);
        const events = await db.events.where("id").anyOf(eventIds).toArray();
        for (const event of events) {
          let rawEvent;
          try {
            rawEvent = JSON.parse(event.event);
            if (!matchFilter2(filter, rawEvent))
              continue;
          } catch (e) {
            console.log("failed to parse event", e);
            continue;
          }
          const ndkEvent = new NDKEvent(void 0, rawEvent);
          const relay = event.relay ? new NDKRelay(event.relay) : void 0;
          ndkEvent.relay = relay;
          retEvents.push(ndkEvent);
        }
      }
    }
    return retEvents;
  }
  async dumpProfiles() {
    const profiles = [];
    if (!this.profiles)
      return;
    for (const pubkey of this.dirtyProfiles) {
      const profile = this.profiles.get(pubkey);
      if (!profile)
        continue;
      profiles.push({
        pubkey,
        profile,
        createdAt: Date.now()
      });
    }
    if (profiles.length) {
      await db.users.bulkPut(profiles);
    }
    this.dirtyProfiles.clear();
  }
};

// src/stores/provider.ts
var cacheAdapter;
var defaulRelaysUrls = [
  // 'wss://purplepag.es',
  // 'wss://relay.nostr.band',
  "wss://nos.lol"
  // 'wss://offchain.pub/',
  // 'wss://nostr-pub.wellorder.net',
  // 'wss://nostr.mutinywallet.com '
];
if (window) {
  cacheAdapter = new NDKCacheAdapterDexie({
    dbName: "walletScrutiny",
    expirationTime: 3600 * 24 * 2
  });
}
var ndk = new src_default({
  explicitRelayUrls: defaulRelaysUrls,
  cacheAdapter,
  enableOutboxModel: false
});
var ndkStore = writable(ndk);
var provider_default = ndkStore;

// src/utils/approvedAuthors.ts
async function initializeApprovedAuthors() {
  const expertOpinions2 = (await Promise.resolve().then(() => (init_main(), main_exports))).expertOpinions;
  let trustedAuthors = [];
  trustedAuthors = expertOpinions2.trustedAuthors.map((author) => {
    const decoded = nip19_exports2.decode(author);
    if (decoded.type == "npub") {
      return decoded.data;
    }
    if (decoded.type == "nprofile") {
      return decoded.data.pubkey;
    }
  }).filter((hexKey) => hexKey != void 0);
  const trustedBadgeAuthors = expertOpinions2.trustedBadgeAuthors.map((badgeAuthor) => {
    const decoded = nip19_exports2.decode(badgeAuthor);
    if (decoded.type == "npub") {
      return decoded.data;
    }
    if (decoded.type == "nprofile") {
      return decoded.data.pubkey;
    }
  }).filter((hexKey) => hexKey != void 0);
  const trustedBadges = expertOpinions2.trustedBadges.map((badge) => {
    const decoded = nip19_exports2.decode(badge);
    if (decoded.type == "naddr" && decoded.data.kind == NDKKind.BadgeDefinition) {
      return `${decoded.data.kind}:${decoded.data.pubkey}:${decoded.data.identifier}`;
    }
  }).filter((hexKey) => hexKey != void 0);
  const $ndk = get_store_value(provider_default);
  await $ndk.connect();
  const badgesByTrustedBadgeAuthors = await $ndk.fetchEvents({
    kinds: [NDKKind.BadgeDefinition],
    authors: trustedBadgeAuthors
  });
  badgesByTrustedBadgeAuthors.forEach((value) => {
    const dTag = value.tags.find((tag) => tag[0] == "d");
    if (dTag) {
      trustedBadges.push(`${value.kind}:${value.pubkey}:${dTag[1]}`);
    }
  });
  const badgeAwardees = [];
  (await $ndk.fetchEvents({
    kinds: [NDKKind.BadgeAward],
    "#a": trustedBadges
  })).forEach((award) => {
    const pTags = award.tags.filter((tag) => tag[0] == "p");
    if (pTags.length) {
      pTags.forEach((p) => badgeAwardees.push(p[1]));
    }
  });
  trustedAuthors.push(...badgeAwardees);
  expertOpinions2.trustedAuthors.push(...trustedAuthors.map((author) => nip19_exports2.npubEncode(author)));
  return trustedAuthors;
}

// src/summariser.ts
var Summariser = class {
  opinions;
  ndk;
  trustedAuthors;
  constructor({
    relay,
    trustedAuthors
  }) {
    this.opinions = {};
    this.ndk = new NDK({ explicitRelayUrls: [relay] });
    this.trustedAuthors = trustedAuthors;
  }
  onReady = () => {
    return new Promise((resolve, reject) => {
      this.ndk.connect().then(async () => {
        this.trustedAuthors = await initializeApprovedAuthors();
        const ndkFilter = { kinds: [30234], authors: this.trustedAuthors };
        return this.ndk.fetchEvents(ndkFilter, { closeOnEose: true });
      }).then((fetchEvents) => {
        fetchEvents.forEach((event) => {
          var _a2;
          const d = event.tags.find((tag) => tag[0] === "d")[1];
          this.opinions[d] = [...((_a2 = this.opinions) == null ? void 0 : _a2[d]) || [], event];
        });
        resolve();
      }).catch((err) => reject(err));
    });
  };
  get(key) {
    const ops = this.opinions[key];
    if (!ops)
      return {
        positive: 0,
        neutral: 0,
        negative: 0
      };
    const counts = ops.reduce(
      (acc, curr) => {
        const current = curr.tags.find((tag) => tag[0] === "sentiment")[1];
        const k = current === "1" ? "positive" : current === "0" ? "neutral" : "negative";
        acc[k] = (acc[k] || 0) + 1;
        return acc;
      },
      {
        positive: 0,
        neutral: 0,
        negative: 0
      }
    );
    return counts;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/*! Bundled license information:

@scure/base/lib/index.js:
  (*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/modular.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/curve.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/weierstrass.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/_shortw_utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/base/lib/esm/index.js:
  (*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/base/lib/esm/index.js:
  (*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/ciphers/esm/utils.js:
  (*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) *)

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/modular.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/curve.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/weierstrass.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/_shortw_utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/base/lib/esm/index.js:
  (*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/base/lib/esm/index.js:
  (*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
