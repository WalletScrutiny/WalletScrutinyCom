"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod3) => function __require() {
  try {
    return mod3 || (0, cb[__getOwnPropNames(cb)[0]])((mod3 = { exports: {} }).exports, mod3), mod3.exports;
  } catch (e) {
    throw mod3 = 0, e;
  }
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

// node_modules/tseep/lib/task-collection/utils.js
var require_utils = __commonJS({
  "node_modules/tseep/lib/task-collection/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2._fast_remove_single = void 0;
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
  }
});

// node_modules/tseep/lib/task-collection/bake-collection.js
var require_bake_collection = __commonJS({
  "node_modules/tseep/lib/task-collection/bake-collection.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.bakeCollectionVariadic = exports.bakeCollectionAwait = exports.bakeCollection = exports.BAKED_EMPTY_FUNC = void 0;
    exports.BAKED_EMPTY_FUNC = (function() {
    });
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
      if (pack || arguments.length === 2) for (var i2 = 0, l = from.length, ar; i2 < l; i2++) {
        if (ar || !(i2 in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i2);
          ar[i2] = from[i2];
        }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TaskCollection = void 0;
    var utils_1 = require_utils();
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
    function removeLast_norebuild(a) {
      if (this.length === 0)
        return;
      if (this.length === 1) {
        if (this._tasks === a) {
          this.length = 0;
        }
      } else {
        (0, utils_1._fast_remove_single)(this._tasks, this._tasks.lastIndexOf(a));
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
        (0, utils_1._fast_remove_single)(this._tasks, this._tasks.lastIndexOf(a));
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
      /* @__PURE__ */ (function() {
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
      })()
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
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_task_collection(), exports2);
  }
});

// node_modules/tseep/lib/utils.js
var require_utils2 = __commonJS({
  "node_modules/tseep/lib/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.nullObj = void 0;
    function nullObj() {
      var x = {};
      x.__proto__ = null;
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
      if (pack || arguments.length === 2) for (var i2 = 0, l = from.length, ar; i2 < l; i2++) {
        if (ar || !(i2 in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i2);
          ar[i2] = from[i2];
        }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.EventEmitter = void 0;
    var task_collection_1 = require_task_collection2();
    var utils_1 = require_utils();
    var utils_2 = require_utils2();
    function emit(event, a, b, c, d5, e) {
      var ev = this.events[event];
      if (ev) {
        if (ev.length === 0)
          return false;
        if (ev.argsNum < 6) {
          ev.call(a, b, c, d5, e);
        } else {
          var arr = new Array(ev.argsNum);
          for (var i2 = 0, len = arr.length; i2 < len; ++i2) {
            arr[i2] = arguments[i2 + 1];
          }
          ev.call.apply(void 0, arr);
        }
        return true;
      }
      return false;
    }
    function emitHasOnce(event, a, b, c, d5, e) {
      var ev = this.events[event];
      var argsArr;
      if (ev !== void 0) {
        if (ev.length === 0)
          return false;
        if (ev.argsNum < 6) {
          ev.call(a, b, c, d5, e);
        } else {
          argsArr = new Array(ev.argsNum);
          for (var i2 = 0, len = argsArr.length; i2 < len; ++i2) {
            argsArr[i2] = arguments[i2 + 1];
          }
          ev.call.apply(void 0, argsArr);
        }
      }
      var oev = this.onceEvents[event];
      if (oev) {
        if (typeof oev === "function") {
          this.onceEvents[event] = void 0;
          if (arguments.length < 6) {
            oev(a, b, c, d5, e);
          } else {
            if (argsArr === void 0) {
              argsArr = new Array(arguments.length - 1);
              for (var i2 = 0, len = argsArr.length; i2 < len; ++i2) {
                argsArr[i2] = arguments[i2 + 1];
              }
            }
            oev.apply(void 0, argsArr);
          }
        } else {
          var fncs = oev;
          this.onceEvents[event] = void 0;
          if (arguments.length < 6) {
            for (var i2 = 0; i2 < fncs.length; ++i2) {
              fncs[i2](a, b, c, d5, e);
            }
          } else {
            if (argsArr === void 0) {
              argsArr = new Array(arguments.length - 1);
              for (var i2 = 0, len = argsArr.length; i2 < len; ++i2) {
                argsArr[i2] = arguments[i2 + 1];
              }
            }
            for (var i2 = 0; i2 < fncs.length; ++i2) {
              fncs[i2].apply(void 0, argsArr);
            }
          }
        }
        return true;
      }
      return ev !== void 0;
    }
    var EventEmitter10 = (
      /** @class */
      (function() {
        function EventEmitter11() {
          this.events = (0, utils_2.nullObj)();
          this.onceEvents = (0, utils_2.nullObj)();
          this._symbolKeys = /* @__PURE__ */ new Set();
          this.maxListeners = Infinity;
        }
        Object.defineProperty(EventEmitter11.prototype, "_eventsCount", {
          get: function() {
            return this.eventNames().length;
          },
          enumerable: false,
          configurable: true
        });
        return EventEmitter11;
      })()
    );
    exports2.EventEmitter = EventEmitter10;
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
            (0, utils_1._fast_remove_single)(evto, evto.lastIndexOf(listener));
          }
        }
      }
      return this;
    }
    function addListenerBound(event, listener, bindTo, argsNum) {
      if (bindTo === void 0) {
        bindTo = this;
      }
      if (argsNum === void 0) {
        argsNum = listener.length;
      }
      if (!this.boundFuncs)
        this.boundFuncs = /* @__PURE__ */ new Map();
      var bound = listener.bind(bindTo);
      this.boundFuncs.set(listener, bound);
      return this.addListener(event, bound, argsNum);
    }
    function removeListenerBound(event, listener) {
      var _a2, _b;
      var bound = (_a2 = this.boundFuncs) === null || _a2 === void 0 ? void 0 : _a2.get(listener);
      (_b = this.boundFuncs) === null || _b === void 0 ? void 0 : _b.delete(listener);
      return this.removeListener(event, bound);
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
      if (!evtmap) {
        this.onceEvents[event] = [listener];
        if (typeof event === "symbol")
          this._symbolKeys.add(event);
      } else if (typeof evtmap !== "object") {
        this.onceEvents[event] = [listener, evtmap];
        if (typeof event === "symbol")
          this._symbolKeys.add(event);
      } else {
        evtmap.unshift(listener);
        if (this.maxListeners !== Infinity && this.maxListeners <= evtmap.length) {
          console.warn('Maximum event listeners for "'.concat(String(event), '" once event!'));
        }
      }
      return this;
    }
    function removeAllListeners(event) {
      if (event === void 0) {
        this.events = (0, utils_2.nullObj)();
        this.onceEvents = (0, utils_2.nullObj)();
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
        var keys = Object.keys(this.events);
        return __spreadArray(__spreadArray([], keys, true), Array.from(this._symbolKeys), true).filter(function(x) {
          return x in _this.events && _this.events[x] && _this.events[x].length;
        });
      } else {
        var keys = Object.keys(this.events).filter(function(x) {
          return _this.events[x] && _this.events[x].length;
        });
        var keysO = Object.keys(this.onceEvents).filter(function(x) {
          return _this.onceEvents[x] && _this.onceEvents[x].length;
        });
        return __spreadArray(__spreadArray(__spreadArray([], keys, true), keysO, true), Array.from(this._symbolKeys).filter(function(x) {
          return x in _this.events && _this.events[x] && _this.events[x].length || x in _this.onceEvents && _this.onceEvents[x] && _this.onceEvents[x].length;
        }), true);
      }
    }
    function listenerCount(type) {
      if (this.emit === emit)
        return this.events[type] && this.events[type].length || 0;
      else
        return (this.events[type] && this.events[type].length || 0) + (this.onceEvents[type] && this.onceEvents[type].length || 0);
    }
    EventEmitter10.prototype.emit = emit;
    EventEmitter10.prototype.on = addListener;
    EventEmitter10.prototype.once = once;
    EventEmitter10.prototype.addListener = addListener;
    EventEmitter10.prototype.removeListener = removeListener;
    EventEmitter10.prototype.addListenerBound = addListenerBound;
    EventEmitter10.prototype.removeListenerBound = removeListenerBound;
    EventEmitter10.prototype.hasListeners = hasListeners;
    EventEmitter10.prototype.prependListener = prependListener;
    EventEmitter10.prototype.prependOnceListener = prependOnceListener;
    EventEmitter10.prototype.off = removeListener;
    EventEmitter10.prototype.removeAllListeners = removeAllListeners;
    EventEmitter10.prototype.setMaxListeners = setMaxListeners;
    EventEmitter10.prototype.getMaxListeners = getMaxListeners;
    EventEmitter10.prototype.listeners = listeners;
    EventEmitter10.prototype.eventNames = eventNames;
    EventEmitter10.prototype.listenerCount = listenerCount;
  }
});

// node_modules/tseep/lib/index.js
var require_lib = __commonJS({
  "node_modules/tseep/lib/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
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
    var d5 = h * 24;
    var w = d5 * 7;
    var y = d5 * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse5(val);
      } else if (type === "number" && isFinite(val)) {
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
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
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
          return n * d5;
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
      if (msAbs >= d5) {
        return Math.round(ms / d5) + "d";
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
      if (msAbs >= d5) {
        return plural(ms, msAbs, d5, "day");
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
      createDebug7.debug = createDebug7;
      createDebug7.default = createDebug7;
      createDebug7.coerce = coerce;
      createDebug7.disable = disable;
      createDebug7.enable = enable;
      createDebug7.enabled = enabled;
      createDebug7.humanize = require_ms();
      createDebug7.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug7[key] = env[key];
      });
      createDebug7.names = [];
      createDebug7.skips = [];
      createDebug7.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i2 = 0; i2 < namespace.length; i2++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i2);
          hash |= 0;
        }
        return createDebug7.colors[Math.abs(hash) % createDebug7.colors.length];
      }
      createDebug7.selectColor = selectColor;
      function createDebug7(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug9(...args) {
          if (!debug9.enabled) {
            return;
          }
          const self2 = debug9;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug7.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug7.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug7.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug7.log;
          logFn.apply(self2, args);
        }
        debug9.namespace = namespace;
        debug9.useColors = createDebug7.useColors();
        debug9.color = createDebug7.selectColor(namespace);
        debug9.extend = extend;
        debug9.destroy = createDebug7.destroy;
        Object.defineProperty(debug9, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug7.namespaces) {
              namespacesCache = createDebug7.namespaces;
              enabledCache = createDebug7.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug7.init === "function") {
          createDebug7.init(debug9);
        }
        return debug9;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug7(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug7.save(namespaces);
        createDebug7.namespaces = namespaces;
        createDebug7.names = [];
        createDebug7.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug7.skips.push(ns.slice(1));
          } else {
            createDebug7.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug7.names,
          ...createDebug7.skips.map((namespace) => "-" + namespace)
        ].join(",");
        createDebug7.enable("");
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug7.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug7.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
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
      createDebug7.enable(createDebug7.load());
      return createDebug7;
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
    exports2.destroy = /* @__PURE__ */ (() => {
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
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
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
        r = exports2.storage.getItem("debug") || exports2.storage.getItem("DEBUG");
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
      const supportsColor = require("supports-color");
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
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.formatWithOptions(exports2.inspectOpts, ...args) + "\n");
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
    function init(debug9) {
      debug9.inspectOpts = {};
      const keys = Object.keys(exports2.inspectOpts);
      for (let i2 = 0; i2 < keys.length; i2++) {
        debug9.inspectOpts[keys[i2]] = exports2.inspectOpts[keys[i2]];
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
        const { entryExpirationTimeInMS = null, next: next2 = null, prev = null, onEntryEvicted, onEntryMarkedAsMostRecentlyUsed, clone, cloneFn } = options !== null && options !== void 0 ? options : {};
        if (typeof entryExpirationTimeInMS === "number" && (entryExpirationTimeInMS <= 0 || Number.isNaN(entryExpirationTimeInMS))) {
          throw new Error("entryExpirationTimeInMS must either be null (no expiry) or greater than 0");
        }
        this.clone = clone !== null && clone !== void 0 ? clone : false;
        this.cloneFn = cloneFn !== null && cloneFn !== void 0 ? cloneFn : this.defaultClone;
        this.key = key;
        this.internalValue = this.clone ? this.cloneFn(value) : value;
        this.created = Date.now();
        this.entryExpirationTimeInMS = entryExpirationTimeInMS;
        this.next = next2;
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
    var LRUCache4 = class {
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
            const next2 = node.next;
            this.removeNodeFromListAndLookupTable(node);
            node = next2;
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
            const next2 = node.next;
            this.removeNodeFromListAndLookupTable(node);
            node = next2;
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
            const next2 = node.next;
            this.removeNodeFromListAndLookupTable(node);
            node = next2;
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
            const next2 = node.next;
            this.removeNodeFromListAndLookupTable(node);
            node = next2;
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
            const next2 = node.next;
            this.removeNodeFromListAndLookupTable(node);
            node = next2;
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
            const next2 = node.next;
            this.removeNodeFromListAndLookupTable(node);
            node = next2;
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
    exports2.LRUCache = LRUCache4;
  }
});

// node_modules/typescript-lru-cache/dist/index.js
var require_dist = __commonJS({
  "node_modules/typescript-lru-cache/dist/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
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
    function assertNumber(n) {
      if (!Number.isSafeInteger(n))
        throw new Error(`Wrong integer: ${n}`);
    }
    exports2.assertNumber = assertNumber;
    function chain2(...args) {
      const wrap = (a, b) => (c) => a(b(c));
      const encode2 = Array.from(args).reverse().reduce((acc, i2) => acc ? wrap(acc, i2.encode) : i2.encode, void 0);
      const decode4 = args.reduce((acc, i2) => acc ? wrap(acc, i2.decode) : i2.decode, void 0);
      return { encode: encode2, decode: decode4 };
    }
    function alphabet2(alphabet3) {
      return {
        encode: (digits) => {
          if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
            throw new Error("alphabet.encode input should be an array of numbers");
          return digits.map((i2) => {
            assertNumber(i2);
            if (i2 < 0 || i2 >= alphabet3.length)
              throw new Error(`Digit index outside alphabet: ${i2} (alphabet: ${alphabet3.length})`);
            return alphabet3[i2];
          });
        },
        decode: (input) => {
          if (!Array.isArray(input) || input.length && typeof input[0] !== "string")
            throw new Error("alphabet.decode input should be array of strings");
          return input.map((letter) => {
            if (typeof letter !== "string")
              throw new Error(`alphabet.decode: not string element=${letter}`);
            const index = alphabet3.indexOf(letter);
            if (index === -1)
              throw new Error(`Unknown letter: "${letter}". Allowed: ${alphabet3}`);
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
    function normalize2(fn) {
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
      digits.forEach((d5) => {
        assertNumber(d5);
        if (d5 < 0 || d5 >= from)
          throw new Error(`Wrong integer: ${d5}`);
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
    var gcd2 = (a, b) => !b ? a : gcd2(b, a % b);
    var radix2carry2 = (from, to) => from + (to - gcd2(from, to));
    function convertRadix22(data, from, to, padding3) {
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
      if (!padding3 && pos >= from)
        throw new Error("Excess padding");
      if (!padding3 && carry)
        throw new Error(`Non-zero padding: ${carry}`);
      if (padding3 && pos > 0)
        res.push(carry >>> 0);
      return res;
    }
    function radix(num3) {
      assertNumber(num3);
      return {
        encode: (bytes) => {
          if (!(bytes instanceof Uint8Array))
            throw new Error("radix.encode input should be Uint8Array");
          return convertRadix(Array.from(bytes), 2 ** 8, num3);
        },
        decode: (digits) => {
          if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
            throw new Error("radix.decode input should be array of strings");
          return Uint8Array.from(convertRadix(digits, num3, 2 ** 8));
        }
      };
    }
    function radix22(bits, revPadding = false) {
      assertNumber(bits);
      if (bits <= 0 || bits > 32)
        throw new Error("radix2: bits should be in (0..32]");
      if (radix2carry2(8, bits) > 32 || radix2carry2(bits, 8) > 32)
        throw new Error("radix2: carry overflow");
      return {
        encode: (bytes) => {
          if (!(bytes instanceof Uint8Array))
            throw new Error("radix2.encode input should be Uint8Array");
          return convertRadix22(Array.from(bytes), 8, bits, !revPadding);
        },
        decode: (digits) => {
          if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
            throw new Error("radix2.decode input should be array of strings");
          return Uint8Array.from(convertRadix22(digits, bits, 8, revPadding));
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
    function checksum(len, fn) {
      assertNumber(len);
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
    exports2.utils = { alphabet: alphabet2, chain: chain2, checksum, radix, radix2: radix22, join: join2, padding: padding2 };
    exports2.base16 = chain2(radix22(4), alphabet2("0123456789ABCDEF"), join2(""));
    exports2.base32 = chain2(radix22(5), alphabet2("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), padding2(5), join2(""));
    exports2.base32hex = chain2(radix22(5), alphabet2("0123456789ABCDEFGHIJKLMNOPQRSTUV"), padding2(5), join2(""));
    exports2.base32crockford = chain2(radix22(5), alphabet2("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), join2(""), normalize2((s) => s.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
    exports2.base64 = chain2(radix22(6), alphabet2("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), padding2(6), join2(""));
    exports2.base64url = chain2(radix22(6), alphabet2("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), padding2(6), join2(""));
    var genBase58 = (abc) => chain2(radix(58), alphabet2(abc), join2(""));
    exports2.base58 = genBase58("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
    exports2.base58flickr = genBase58("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ");
    exports2.base58xrp = genBase58("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
    var XMR_BLOCK_LEN = [0, 2, 3, 5, 6, 7, 9, 10, 11];
    exports2.base58xmr = {
      encode(data) {
        let res = "";
        for (let i2 = 0; i2 < data.length; i2 += 8) {
          const block2 = data.subarray(i2, i2 + 8);
          res += exports2.base58.encode(block2).padStart(XMR_BLOCK_LEN[block2.length], "1");
        }
        return res;
      },
      decode(str) {
        let res = [];
        for (let i2 = 0; i2 < str.length; i2 += 11) {
          const slice = str.slice(i2, i2 + 11);
          const blockLen = XMR_BLOCK_LEN.indexOf(slice.length);
          const block2 = exports2.base58.decode(slice);
          for (let j = 0; j < block2.length - blockLen; j++) {
            if (block2[j] !== 0)
              throw new Error("base58xmr: wrong padding");
          }
          res = res.concat(Array.from(block2.slice(block2.length - blockLen)));
        }
        return Uint8Array.from(res);
      }
    };
    var base58check = (sha2565) => chain2(checksum(4, (data) => sha2565(sha2565(data))), exports2.base58);
    exports2.base58check = base58check;
    var BECH_ALPHABET2 = chain2(alphabet2("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), join2(""));
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
      return BECH_ALPHABET2.encode(convertRadix22([chk % 2 ** 30], 30, 5, false));
    }
    function genBech322(encoding) {
      const ENCODING_CONST = encoding === "bech32" ? 1 : 734539939;
      const _words = radix22(5);
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
        return `${prefix}1${BECH_ALPHABET2.encode(words)}${bechChecksum2(prefix, words, ENCODING_CONST)}`;
      }
      function decode4(str, limit = 90) {
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
        const words = BECH_ALPHABET2.decode(_words2).slice(0, -6);
        const sum = bechChecksum2(prefix, words, ENCODING_CONST);
        if (!_words2.endsWith(sum))
          throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
        return { prefix, words };
      }
      const decodeUnsafe = unsafeWrapper2(decode4);
      function decodeToBytes(str) {
        const { prefix, words } = decode4(str, false);
        return { prefix, words, bytes: fromWords(words) };
      }
      return { encode: encode2, decode: decode4, decodeToBytes, decodeUnsafe, fromWords, fromWordsUnsafe, toWords };
    }
    exports2.bech32 = genBech322("bech32");
    exports2.bech32m = genBech322("bech32m");
    exports2.utf8 = {
      encode: (data) => new TextDecoder().decode(data),
      decode: (str) => new TextEncoder().encode(str)
    };
    exports2.hex = chain2(radix22(4), alphabet2("0123456789abcdef"), join2(""), normalize2((s) => {
      if (typeof s !== "string" || s.length % 2)
        throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
      return s.toLowerCase();
    }));
    var CODERS = {
      utf8: exports2.utf8,
      hex: exports2.hex,
      base16: exports2.base16,
      base32: exports2.base32,
      base64: exports2.base64,
      base64url: exports2.base64url,
      base58: exports2.base58,
      base58xmr: exports2.base58xmr
    };
    var coderTypeError = `Invalid encoding type. Available types: ${Object.keys(CODERS).join(", ")}`;
    var bytesToString = (type, bytes) => {
      if (typeof type !== "string" || !CODERS.hasOwnProperty(type))
        throw new TypeError(coderTypeError);
      if (!(bytes instanceof Uint8Array))
        throw new TypeError("bytesToString() expects Uint8Array");
      return CODERS[type].encode(bytes);
    };
    exports2.bytesToString = bytesToString;
    exports2.str = exports2.bytesToString;
    var stringToBytes = (type, str) => {
      if (!CODERS.hasOwnProperty(type))
        throw new TypeError(coderTypeError);
      if (typeof str !== "string")
        throw new TypeError("stringToBytes() expects string");
      return CODERS[type].decode(str);
    };
    exports2.stringToBytes = stringToBytes;
    exports2.bytes = exports2.stringToBytes;
  }
});

// node_modules/light-bolt11-decoder/bolt11.js
var require_bolt11 = __commonJS({
  "node_modules/light-bolt11-decoder/bolt11.js"(exports2, module2) {
    var { bech32: bech322, hex, utf8 } = require_lib2();
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
    var SIGNETNETWORK = {
      bech32: "tbs",
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
    for (let i2 = 0, keys = Object.keys(TAGCODES); i2 < keys.length; i2++) {
      const currentName = keys[i2];
      const currentCode = TAGCODES[keys[i2]].toString();
      TAGNAMES[currentCode] = currentName;
    }
    var TAGPARSERS = {
      1: (words) => hex.encode(bech322.fromWordsUnsafe(words)),
      // 256 bits
      16: (words) => hex.encode(bech322.fromWordsUnsafe(words)),
      // 256 bits
      13: (words) => utf8.encode(bech322.fromWordsUnsafe(words)),
      // string variable length
      19: (words) => hex.encode(bech322.fromWordsUnsafe(words)),
      // 264 bits
      23: (words) => hex.encode(bech322.fromWordsUnsafe(words)),
      // 256 bits
      27: (words) => hex.encode(bech322.fromWordsUnsafe(words)),
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
        words: bech322.encode("unknown", words, Number.MAX_SAFE_INTEGER)
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
      let routesBuffer = bech322.fromWordsUnsafe(words);
      while (routesBuffer.length > 0) {
        pubkey = hex.encode(routesBuffer.slice(0, 33));
        shortChannelId = hex.encode(routesBuffer.slice(33, 41));
        feeBaseMSats = parseInt(hex.encode(routesBuffer.slice(41, 45)), 16);
        feeProportionalMillionths = parseInt(
          hex.encode(routesBuffer.slice(45, 49)),
          16
        );
        cltvExpiryDelta = parseInt(hex.encode(routesBuffer.slice(49, 51)), 16);
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
    function decode4(paymentRequest, network) {
      if (typeof paymentRequest !== "string")
        throw new Error("Lightning Payment Request must be string");
      if (paymentRequest.slice(0, 2).toLowerCase() !== "ln")
        throw new Error("Not a proper lightning payment request");
      const sections = [];
      const decoded = bech322.decode(paymentRequest, Number.MAX_SAFE_INTEGER);
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
          case SIGNETNETWORK.bech32:
            coinNetwork = SIGNETNETWORK;
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
        value: hex.encode(bech322.fromWordsUnsafe(sigWords))
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
          if (exp) return getValue("timestamp") + exp.value;
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
      decode: decode4,
      hrpToMillisat
    };
  }
});

// node_modules/dexie/dist/dexie.js
var require_dexie = __commonJS({
  "node_modules/dexie/dist/dexie.js"(exports2, module2) {
    (function(global2, factory) {
      typeof exports2 === "object" && typeof module2 !== "undefined" ? module2.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, global2.Dexie = factory());
    })(exports2, (function() {
      "use strict";
      var extendStatics = function(d5, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d6, b2) {
          d6.__proto__ = b2;
        } || function(d6, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d6[p] = b2[p];
        };
        return extendStatics(d5, b);
      };
      function __extends(d5, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d5, b);
        function __() {
          this.constructor = d5;
        }
        d5.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      }
      var __assign = function() {
        __assign = Object.assign || function __assign2(t) {
          for (var s, i2 = 1, n = arguments.length; i2 < n; i2++) {
            s = arguments[i2];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
        return __assign.apply(this, arguments);
      };
      function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i2 = 0, l = from.length, ar; i2 < l; i2++) {
          if (ar || !(i2 in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i2);
            ar[i2] = from[i2];
          }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
      }
      typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
      };
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
        (typeof Reflect === "undefined" ? keys : Reflect.ownKeys)(extension).forEach(function(key) {
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
        var pd = getOwnPropertyDescriptor(obj, prop);
        var proto;
        return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
      }
      var _slice = [].slice;
      function slice(args, start, end) {
        return _slice.call(args, start, end);
      }
      function override(origFunc, overridedFactory) {
        return overridedFactory(origFunc);
      }
      function assert(b) {
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
        return array.reduce(function(result, item, i2) {
          var nameAndValue = extractor(item, i2);
          if (nameAndValue)
            result[nameAndValue[0]] = nameAndValue[1];
          return result;
        }, {});
      }
      function getByKeyPath(obj, keyPath) {
        if (typeof keyPath === "string" && hasOwn(obj, keyPath))
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
          return innerObj == null ? void 0 : getByKeyPath(innerObj, keyPath.substr(period + 1));
        }
        return void 0;
      }
      function setByKeyPath(obj, keyPath, value) {
        if (!obj || keyPath === void 0)
          return;
        if ("isFrozen" in Object && Object.isFrozen(obj))
          return;
        if (typeof keyPath !== "string" && "length" in keyPath) {
          assert(typeof value !== "string" && "length" in value);
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
      function flatten2(a) {
        return concat.apply([], a);
      }
      var intrinsicTypeNames = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(flatten2([8, 16, 32, 64].map(function(num3) {
        return ["Int", "Uint", "Float"].map(function(t) {
          return t + num3 + "Array";
        });
      }))).filter(function(t) {
        return _global[t];
      });
      var intrinsicTypes = new Set(intrinsicTypeNames.map(function(t) {
        return _global[t];
      }));
      function cloneSimpleObjectTree(o) {
        var rv = {};
        for (var k in o)
          if (hasOwn(o, k)) {
            var v = o[k];
            rv[k] = !v || typeof v !== "object" || intrinsicTypes.has(v.constructor) ? v : cloneSimpleObjectTree(v);
          }
        return rv;
      }
      function objectIsEmpty(o) {
        for (var k in o)
          if (hasOwn(o, k))
            return false;
        return true;
      }
      var circularRefs = null;
      function deepClone(any) {
        circularRefs = /* @__PURE__ */ new WeakMap();
        var rv = innerDeepClone(any);
        circularRefs = null;
        return rv;
      }
      function innerDeepClone(x) {
        if (!x || typeof x !== "object")
          return x;
        var rv = circularRefs.get(x);
        if (rv)
          return rv;
        if (isArray(x)) {
          rv = [];
          circularRefs.set(x, rv);
          for (var i2 = 0, l = x.length; i2 < l; ++i2) {
            rv.push(innerDeepClone(x[i2]));
          }
        } else if (intrinsicTypes.has(x.constructor)) {
          rv = x;
        } else {
          var proto = getProto(x);
          rv = proto === Object.prototype ? {} : Object.create(proto);
          circularRefs.set(x, rv);
          for (var prop in x) {
            if (hasOwn(x, prop)) {
              rv[prop] = innerDeepClone(x[prop]);
            }
          }
        }
        return rv;
      }
      var toString = {}.toString;
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
      function delArrayItem(a, x) {
        var i2 = a.indexOf(x);
        if (i2 >= 0)
          a.splice(i2, 1);
        return i2 >= 0;
      }
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
      var isAsyncFunction = typeof Symbol !== "undefined" ? function(fn) {
        return fn[Symbol.toStringTag] === "AsyncFunction";
      } : function() {
        return false;
      };
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
        this.name = name;
        this.message = msg;
      }
      derive(DexieError).from(Error).extend({
        toString: function() {
          return this.name + ": " + this.message;
        }
      });
      function getMultiErrorMessage(msg, failures) {
        return msg + ". Errors: " + Object.keys(failures).map(function(key) {
          return failures[key].toString();
        }).filter(function(v, i2, s) {
          return s.indexOf(v) === i2;
        }).join("\n");
      }
      function ModifyError(msg, failures, successCount, failedKeys) {
        this.failures = failures;
        this.failedKeys = failedKeys;
        this.successCount = successCount;
        this.message = getMultiErrorMessage(msg, failures);
      }
      derive(ModifyError).from(DexieError);
      function BulkError(msg, failures) {
        this.name = "BulkError";
        this.failures = Object.keys(failures).map(function(pos) {
          return failures[pos];
        });
        this.failuresByPos = failures;
        this.message = getMultiErrorMessage(msg, this.failures);
      }
      derive(BulkError).from(DexieError);
      var errnames = errorList.reduce(function(obj, name) {
        return obj[name] = name + "Error", obj;
      }, {});
      var BaseException = DexieError;
      var exceptions = errorList.reduce(function(obj, name) {
        var fullName = name + "Error";
        function DexieError2(msgOrInner, inner) {
          this.name = fullName;
          if (!msgOrInner) {
            this.message = defaultTexts[name] || fullName;
            this.inner = null;
          } else if (typeof msgOrInner === "string") {
            this.message = "".concat(msgOrInner).concat(!inner ? "" : "\n " + inner);
            this.inner = inner || null;
          } else if (typeof msgOrInner === "object") {
            this.message = "".concat(msgOrInner.name, " ").concat(msgOrInner.message);
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
      var exceptionMap = idbDomErrorNames.reduce(function(obj, name) {
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
      var fullNameExceptions = errorList.reduce(function(obj, name) {
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
      var debug9 = typeof location !== "undefined" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
      function setDebug(value, filter) {
        debug9 = value;
      }
      var INTERNAL = {};
      var ZONE_ECHO_LIMIT = 100, _a$1 = typeof Promise === "undefined" ? [] : (function() {
        var globalP = Promise.resolve();
        if (typeof crypto === "undefined" || !crypto.subtle)
          return [globalP, getProto(globalP), globalP];
        var nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
        return [
          nativeP,
          getProto(nativeP),
          globalP
        ];
      })(), resolvedNativePromise = _a$1[0], nativePromiseProto = _a$1[1], resolvedGlobalPromise = _a$1[2], nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
      var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
      var patchGlobalPromise = !!resolvedGlobalPromise;
      function schedulePhysicalTick() {
        queueMicrotask(physicalTick);
      }
      var asap = function(callback, args) {
        microtickQueue.push([callback, args]);
        if (needsNewPhysicalTick) {
          schedulePhysicalTick();
          needsNewPhysicalTick = false;
        }
      };
      var isOutsideMicroTick = true, needsNewPhysicalTick = true, unhandledErrors = [], rejectingErrors = [], rejectionMapper = mirror;
      var globalPSD = {
        id: "global",
        global: true,
        ref: 0,
        unhandleds: [],
        onunhandled: nop,
        pgp: false,
        env: {},
        finalize: nop
      };
      var PSD = globalPSD;
      var microtickQueue = [];
      var numScheduledCalls = 0;
      var tickFinalizers = [];
      function DexiePromise(fn) {
        if (typeof this !== "object")
          throw new TypeError("Promises must be constructed via new");
        this._listeners = [];
        this._lib = false;
        var psd = this._PSD = PSD;
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
            var _this = this;
            var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
            var cleanup = possibleAwait && !decrementExpectedAwaits();
            var rv = new DexiePromise(function(resolve, reject) {
              propagateToListener(_this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait, cleanup), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait, cleanup), resolve, reject, psd));
            });
            if (this._consoleTask)
              rv._consoleTask = this._consoleTask;
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
          return typeof type2 === "function" ? this.then(null, function(err) {
            return err instanceof type2 ? handler(err) : PromiseReject(err);
          }) : this.then(null, function(err) {
            return err && err.name === type2 ? handler(err) : PromiseReject(err);
          });
        },
        finally: function(onFinally) {
          return this.then(function(value) {
            return DexiePromise.resolve(onFinally()).then(function() {
              return value;
            });
          }, function(err) {
            return DexiePromise.resolve(onFinally()).then(function() {
              return PromiseReject(err);
            });
          });
        },
        timeout: function(ms, msg) {
          var _this = this;
          return ms < Infinity ? new DexiePromise(function(resolve, reject) {
            var handle = setTimeout(function() {
              return reject(new exceptions.Timeout(msg));
            }, ms);
            _this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
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
            values.forEach(function(a, i2) {
              return DexiePromise.resolve(a).then(function(x) {
                values[i2] = x;
                if (!--remaining)
                  resolve(values);
              }, reject);
            });
          });
        },
        resolve: function(value) {
          if (value instanceof DexiePromise)
            return value;
          if (value && typeof value.then === "function")
            return new DexiePromise(function(resolve, reject) {
              value.then(resolve, reject);
            });
          var rv = new DexiePromise(INTERNAL, true, value);
          return rv;
        },
        reject: PromiseReject,
        race: function() {
          var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
          return new DexiePromise(function(resolve, reject) {
            values.map(function(value) {
              return DexiePromise.resolve(value).then(resolve, reject);
            });
          });
        },
        PSD: {
          get: function() {
            return PSD;
          },
          set: function(value) {
            return PSD = value;
          }
        },
        totalEchoes: { get: function() {
          return totalEchoes;
        } },
        newPSD: newScope,
        usePSD,
        scheduler: {
          get: function() {
            return asap;
          },
          set: function(value) {
            asap = value;
          }
        },
        rejectionMapper: {
          get: function() {
            return rejectionMapper;
          },
          set: function(value) {
            rejectionMapper = value;
          }
        },
        follow: function(fn, zoneProps) {
          return new DexiePromise(function(resolve, reject) {
            return newScope(function(resolve2, reject2) {
              var psd = PSD;
              psd.unhandleds = [];
              psd.onunhandled = reject2;
              psd.finalize = callBoth(function() {
                var _this = this;
                run_at_end_of_this_or_next_physical_tick(function() {
                  _this.unhandleds.length === 0 ? resolve2() : reject2(_this.unhandleds[0]);
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
            var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise(function(resolve) {
              if (possiblePromises.length === 0)
                resolve([]);
              var remaining = possiblePromises.length;
              var results = new Array(remaining);
              possiblePromises.forEach(function(p, i2) {
                return DexiePromise.resolve(p).then(function(value) {
                  return results[i2] = { status: "fulfilled", value };
                }, function(reason) {
                  return results[i2] = { status: "rejected", reason };
                }).then(function() {
                  return --remaining || resolve(results);
                });
              });
            });
          });
        if (NativePromise.any && typeof AggregateError !== "undefined")
          setProp(DexiePromise, "any", function() {
            var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise(function(resolve, reject) {
              if (possiblePromises.length === 0)
                reject(new AggregateError([]));
              var remaining = possiblePromises.length;
              var failures = new Array(remaining);
              possiblePromises.forEach(function(p, i2) {
                return DexiePromise.resolve(p).then(function(value) {
                  return resolve(value);
                }, function(failure) {
                  failures[i2] = failure;
                  if (!--remaining)
                    reject(new AggregateError(failures));
                });
              });
            });
          });
        if (NativePromise.withResolvers)
          DexiePromise.withResolvers = NativePromise.withResolvers;
      }
      function executePromiseTask(promise, fn) {
        try {
          fn(function(value) {
            if (promise._state !== null)
              return;
            if (value === promise)
              throw new TypeError("A promise cannot be resolved with itself.");
            var shouldExecuteTick = promise._lib && beginMicroTickScope();
            if (value && typeof value.then === "function") {
              executePromiseTask(promise, function(resolve, reject) {
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
          asap(function() {
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
          var ret, value = promise._value;
          if (!promise._state && rejectingErrors.length)
            rejectingErrors = [];
          ret = debug9 && promise._consoleTask ? promise._consoleTask.run(function() {
            return cb(value);
          }) : cb(value);
          if (!promise._state && rejectingErrors.indexOf(value) === -1) {
            markErrorAsHandled(promise);
          }
          listener.resolve(ret);
        } catch (e) {
          listener.reject(e);
        } finally {
          if (--numScheduledCalls === 0)
            finalizePhysicalTick();
          --listener.psd.ref || listener.psd.finalize();
        }
      }
      function physicalTick() {
        usePSD(globalPSD, function() {
          beginMicroTickScope() && endMicroTickScope();
        });
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
        unhandledErrs.forEach(function(p) {
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
        asap(function() {
          if (--numScheduledCalls === 0)
            finalizePhysicalTick();
        }, []);
      }
      function addPossiblyUnhandledError(promise) {
        if (!unhandledErrors.some(function(p) {
          return p._value === promise._value;
        }))
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
        globalPSD.env;
        psd.env = patchGlobalPromise ? {
          Promise: DexiePromise,
          PromiseProp: { value: DexiePromise, configurable: true, writable: true },
          all: DexiePromise.all,
          race: DexiePromise.race,
          allSettled: DexiePromise.allSettled,
          any: DexiePromise.any,
          resolve: DexiePromise.resolve,
          reject: DexiePromise.reject
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
          return possiblePromise.then(function(x) {
            decrementExpectedAwaits();
            return x;
          }, function(e) {
            decrementExpectedAwaits();
            return rejection(e);
          });
        }
        return possiblePromise;
      }
      function zoneEnterEcho(targetZone) {
        ++totalEchoes;
        if (!task.echoes || --task.echoes === 0) {
          task.echoes = task.awaits = task.id = 0;
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
          queueMicrotask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
        }
        if (targetZone === PSD)
          return;
        PSD = targetZone;
        if (currentZone === globalPSD)
          globalPSD.env = snapShot();
        if (patchGlobalPromise) {
          var GlobalPromise = globalPSD.env.Promise;
          var targetEnv = targetZone.env;
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
          reject: GlobalPromise.reject
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
              queueMicrotask(decrementExpectedAwaits);
          }
        };
      }
      function execInGlobalContext(cb) {
        if (Promise === NativePromise && task.echoes === 0) {
          if (zoneEchoes === 0) {
            cb();
          } else {
            enqueueNativeMicroTask(cb);
          }
        } else {
          setTimeout(cb, 0);
        }
      }
      var rejection = DexiePromise.reject;
      function tempTransaction(db2, mode, storeNames, fn) {
        if (!db2.idbdb || !db2._state.openComplete && (!PSD.letThrough && !db2._vip)) {
          if (db2._state.openComplete) {
            return rejection(new exceptions.DatabaseClosed(db2._state.dbOpenError));
          }
          if (!db2._state.isBeingOpened) {
            if (!db2._state.autoOpen)
              return rejection(new exceptions.DatabaseClosed());
            db2.open().catch(nop);
          }
          return db2._state.dbReadyPromise.then(function() {
            return tempTransaction(db2, mode, storeNames, fn);
          });
        } else {
          var trans = db2._createTransaction(mode, storeNames, db2._dbSchema);
          try {
            trans.create();
            db2._state.PR1398_maxLoop = 3;
          } catch (ex) {
            if (ex.name === errnames.InvalidState && db2.isOpen() && --db2._state.PR1398_maxLoop > 0) {
              console.warn("Dexie: Need to reopen db");
              db2.close({ disableAutoOpen: false });
              return db2.open().then(function() {
                return tempTransaction(db2, mode, storeNames, fn);
              });
            }
            return rejection(ex);
          }
          return trans._promise(mode, function(resolve, reject) {
            return newScope(function() {
              PSD.trans = trans;
              return fn(resolve, reject, trans);
            });
          }).then(function(result) {
            if (mode === "readwrite")
              try {
                trans.idbtrans.commit();
              } catch (_a3) {
              }
            return mode === "readonly" ? result : trans._completion.then(function() {
              return result;
            });
          });
        }
      }
      var DEXIE_VERSION = "4.3.0";
      var maxString = String.fromCharCode(65535);
      var minKey = -Infinity;
      var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
      var STRING_EXPECTED = "String expected.";
      var connections = [];
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
        return typeof keyPath === "string" && !/\./.test(keyPath) ? function(obj) {
          if (obj[keyPath] === void 0 && keyPath in obj) {
            obj = deepClone(obj);
            delete obj[keyPath];
          }
          return obj;
        } : function(obj) {
          return obj;
        };
      }
      function Entity2() {
        throw exceptions.Type("Entity instances must never be new:ed. Instances are generated by the framework bypassing the constructor.");
      }
      function cmp2(a, b) {
        try {
          var ta = type(a);
          var tb = type(b);
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
        } catch (_a3) {
        }
        return NaN;
      }
      function compareArrays(a, b) {
        var al = a.length;
        var bl = b.length;
        var l = al < bl ? al : bl;
        for (var i2 = 0; i2 < l; ++i2) {
          var res = cmp2(a[i2], b[i2]);
          if (res !== 0)
            return res;
        }
        return al === bl ? 0 : al < bl ? -1 : 1;
      }
      function compareUint8Arrays(a, b) {
        var al = a.length;
        var bl = b.length;
        var l = al < bl ? al : bl;
        for (var i2 = 0; i2 < l; ++i2) {
          if (a[i2] !== b[i2])
            return a[i2] < b[i2] ? -1 : 1;
        }
        return al === bl ? 0 : al < bl ? -1 : 1;
      }
      function type(x) {
        var t = typeof x;
        if (t !== "object")
          return t;
        if (ArrayBuffer.isView(x))
          return "binary";
        var tsTag = toStringTag(x);
        return tsTag === "ArrayBuffer" ? "binary" : tsTag;
      }
      function getUint8Array(a) {
        if (a instanceof Uint8Array)
          return a;
        if (ArrayBuffer.isView(a))
          return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
        return new Uint8Array(a);
      }
      function builtInDeletionTrigger(table, keys2, res) {
        var yProps = table.schema.yProps;
        if (!yProps)
          return res;
        if (keys2 && res.numFailures > 0)
          keys2 = keys2.filter(function(_, i2) {
            return !res.failures[i2];
          });
        return Promise.all(yProps.map(function(_a3) {
          var updatesTable = _a3.updatesTable;
          return keys2 ? table.db.table(updatesTable).where("k").anyOf(keys2).delete() : table.db.table(updatesTable).clear();
        })).then(function() {
          return res;
        });
      }
      var PropModification2 = (function() {
        function PropModification3(spec) {
          this["@@propmod"] = spec;
        }
        PropModification3.prototype.execute = function(value) {
          var _a3;
          var spec = this["@@propmod"];
          if (spec.add !== void 0) {
            var term = spec.add;
            if (isArray(term)) {
              return __spreadArray(__spreadArray([], isArray(value) ? value : [], true), term, true).sort();
            }
            if (typeof term === "number")
              return (Number(value) || 0) + term;
            if (typeof term === "bigint") {
              try {
                return BigInt(value) + term;
              } catch (_b) {
                return BigInt(0) + term;
              }
            }
            throw new TypeError("Invalid term ".concat(term));
          }
          if (spec.remove !== void 0) {
            var subtrahend_1 = spec.remove;
            if (isArray(subtrahend_1)) {
              return isArray(value) ? value.filter(function(item) {
                return !subtrahend_1.includes(item);
              }).sort() : [];
            }
            if (typeof subtrahend_1 === "number")
              return Number(value) - subtrahend_1;
            if (typeof subtrahend_1 === "bigint") {
              try {
                return BigInt(value) - subtrahend_1;
              } catch (_c) {
                return BigInt(0) - subtrahend_1;
              }
            }
            throw new TypeError("Invalid subtrahend ".concat(subtrahend_1));
          }
          var prefixToReplace = (_a3 = spec.replacePrefix) === null || _a3 === void 0 ? void 0 : _a3[0];
          if (prefixToReplace && typeof value === "string" && value.startsWith(prefixToReplace)) {
            return spec.replacePrefix[1] + value.substring(prefixToReplace.length);
          }
          return value;
        };
        return PropModification3;
      })();
      function applyUpdateSpec(obj, changes) {
        var keyPaths = keys(changes);
        var numKeys = keyPaths.length;
        var anythingModified = false;
        for (var i2 = 0; i2 < numKeys; ++i2) {
          var keyPath = keyPaths[i2];
          var value = changes[keyPath];
          var origValue = getByKeyPath(obj, keyPath);
          if (value instanceof PropModification2) {
            setByKeyPath(obj, keyPath, value.execute(origValue));
            anythingModified = true;
          } else if (origValue !== value) {
            setByKeyPath(obj, keyPath, value);
            anythingModified = true;
          }
        }
        return anythingModified;
      }
      var Table = (function() {
        function Table2() {
        }
        Table2.prototype._trans = function(mode, fn, writeLocked) {
          var trans = this._tx || PSD.trans;
          var tableName = this.name;
          var task2 = debug9 && typeof console !== "undefined" && console.createTask && console.createTask("Dexie: ".concat(mode === "readonly" ? "read" : "write", " ").concat(this.name));
          function checkTableInTransaction(resolve, reject, trans2) {
            if (!trans2.schema[tableName])
              throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
            return fn(trans2.idbtrans, trans2);
          }
          var wasRootExec = beginMicroTickScope();
          try {
            var p = trans && trans.db._novip === this.db._novip ? trans === PSD.trans ? trans._promise(mode, checkTableInTransaction, writeLocked) : newScope(function() {
              return trans._promise(mode, checkTableInTransaction, writeLocked);
            }, { trans, transless: PSD.transless || PSD }) : tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
            if (task2) {
              p._consoleTask = task2;
              p = p.catch(function(err) {
                console.trace(err);
                return rejection(err);
              });
            }
            return p;
          } finally {
            if (wasRootExec)
              endMicroTickScope();
          }
        };
        Table2.prototype.get = function(keyOrCrit, cb) {
          var _this = this;
          if (keyOrCrit && keyOrCrit.constructor === Object)
            return this.where(keyOrCrit).first(cb);
          if (keyOrCrit == null)
            return rejection(new exceptions.Type("Invalid argument to Table.get()"));
          return this._trans("readonly", function(trans) {
            return _this.core.get({ trans, key: keyOrCrit }).then(function(res) {
              return _this.hook.reading.fire(res);
            });
          }).then(cb);
        };
        Table2.prototype.where = function(indexOrCrit) {
          if (typeof indexOrCrit === "string")
            return new this.db.WhereClause(this, indexOrCrit);
          if (isArray(indexOrCrit))
            return new this.db.WhereClause(this, "[".concat(indexOrCrit.join("+"), "]"));
          var keyPaths = keys(indexOrCrit);
          if (keyPaths.length === 1)
            return this.where(keyPaths[0]).equals(indexOrCrit[keyPaths[0]]);
          var compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(function(ix) {
            if (ix.compound && keyPaths.every(function(keyPath) {
              return ix.keyPath.indexOf(keyPath) >= 0;
            })) {
              for (var i2 = 0; i2 < keyPaths.length; ++i2) {
                if (keyPaths.indexOf(ix.keyPath[i2]) === -1)
                  return false;
              }
              return true;
            }
            return false;
          }).sort(function(a, b) {
            return a.keyPath.length - b.keyPath.length;
          })[0];
          if (compoundIndex && this.db._maxKey !== maxString) {
            var keyPathsInValidOrder = compoundIndex.keyPath.slice(0, keyPaths.length);
            return this.where(keyPathsInValidOrder).equals(keyPathsInValidOrder.map(function(kp) {
              return indexOrCrit[kp];
            }));
          }
          if (!compoundIndex && debug9)
            console.warn("The query ".concat(JSON.stringify(indexOrCrit), " on ").concat(this.name, " would benefit from a ") + "compound index [".concat(keyPaths.join("+"), "]"));
          var idxByName = this.schema.idxByName;
          function equals2(a, b) {
            return cmp2(a, b) === 0;
          }
          var _a3 = keyPaths.reduce(function(_a4, keyPath) {
            var prevIndex = _a4[0], prevFilterFn = _a4[1];
            var index = idxByName[keyPath];
            var value = indexOrCrit[keyPath];
            return [
              prevIndex || index,
              prevIndex || !index ? combine(prevFilterFn, index && index.multi ? function(x) {
                var prop = getByKeyPath(x, keyPath);
                return isArray(prop) && prop.some(function(item) {
                  return equals2(value, item);
                });
              } : function(x) {
                return equals2(value, getByKeyPath(x, keyPath));
              }) : prevFilterFn
            ];
          }, [null, null]), idx = _a3[0], filterFunction = _a3[1];
          return idx ? this.where(idx.name).equals(indexOrCrit[idx.keyPath]).filter(filterFunction) : compoundIndex ? this.filter(filterFunction) : this.where(keyPaths).equals("");
        };
        Table2.prototype.filter = function(filterFunction) {
          return this.toCollection().and(filterFunction);
        };
        Table2.prototype.count = function(thenShortcut) {
          return this.toCollection().count(thenShortcut);
        };
        Table2.prototype.offset = function(offset) {
          return this.toCollection().offset(offset);
        };
        Table2.prototype.limit = function(numRows) {
          return this.toCollection().limit(numRows);
        };
        Table2.prototype.each = function(callback) {
          return this.toCollection().each(callback);
        };
        Table2.prototype.toArray = function(thenShortcut) {
          return this.toCollection().toArray(thenShortcut);
        };
        Table2.prototype.toCollection = function() {
          return new this.db.Collection(new this.db.WhereClause(this));
        };
        Table2.prototype.orderBy = function(index) {
          return new this.db.Collection(new this.db.WhereClause(this, isArray(index) ? "[".concat(index.join("+"), "]") : index));
        };
        Table2.prototype.reverse = function() {
          return this.toCollection().reverse();
        };
        Table2.prototype.mapToClass = function(constructor) {
          var _a3 = this, db2 = _a3.db, tableName = _a3.name;
          this.schema.mappedClass = constructor;
          if (constructor.prototype instanceof Entity2) {
            constructor = (function(_super) {
              __extends(class_1, _super);
              function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
              }
              Object.defineProperty(class_1.prototype, "db", {
                get: function() {
                  return db2;
                },
                enumerable: false,
                configurable: true
              });
              class_1.prototype.table = function() {
                return tableName;
              };
              return class_1;
            })(constructor);
          }
          var inheritedProps = /* @__PURE__ */ new Set();
          for (var proto = constructor.prototype; proto; proto = getProto(proto)) {
            Object.getOwnPropertyNames(proto).forEach(function(propName) {
              return inheritedProps.add(propName);
            });
          }
          var readHook = function(obj) {
            if (!obj)
              return obj;
            var res = Object.create(constructor.prototype);
            for (var m in obj)
              if (!inheritedProps.has(m))
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
        };
        Table2.prototype.defineClass = function() {
          function Class(content) {
            extend(this, content);
          }
          return this.mapToClass(Class);
        };
        Table2.prototype.add = function(obj, key) {
          var _this = this;
          var _a3 = this.schema.primKey, auto = _a3.auto, keyPath = _a3.keyPath;
          var objToAdd = obj;
          if (keyPath && auto) {
            objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
          }
          return this._trans("readwrite", function(trans) {
            return _this.core.mutate({ trans, type: "add", keys: key != null ? [key] : null, values: [objToAdd] });
          }).then(function(res) {
            return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult;
          }).then(function(lastResult) {
            if (keyPath) {
              try {
                setByKeyPath(obj, keyPath, lastResult);
              } catch (_) {
              }
            }
            return lastResult;
          });
        };
        Table2.prototype.upsert = function(key, modifications) {
          var _this = this;
          var keyPath = this.schema.primKey.keyPath;
          return this._trans("readwrite", function(trans) {
            return _this.core.get({ trans, key }).then(function(existing) {
              var obj = existing !== null && existing !== void 0 ? existing : {};
              applyUpdateSpec(obj, modifications);
              if (keyPath)
                setByKeyPath(obj, keyPath, key);
              return _this.core.mutate({
                trans,
                type: "put",
                values: [obj],
                keys: [key],
                upsert: true,
                updates: { keys: [key], changeSpecs: [modifications] }
              }).then(function(res) {
                return res.numFailures ? DexiePromise.reject(res.failures[0]) : !!existing;
              });
            });
          });
        };
        Table2.prototype.update = function(keyOrObject, modifications) {
          if (typeof keyOrObject === "object" && !isArray(keyOrObject)) {
            var key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
            if (key === void 0)
              return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
            return this.where(":id").equals(key).modify(modifications);
          } else {
            return this.where(":id").equals(keyOrObject).modify(modifications);
          }
        };
        Table2.prototype.put = function(obj, key) {
          var _this = this;
          var _a3 = this.schema.primKey, auto = _a3.auto, keyPath = _a3.keyPath;
          var objToAdd = obj;
          if (keyPath && auto) {
            objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
          }
          return this._trans("readwrite", function(trans) {
            return _this.core.mutate({ trans, type: "put", values: [objToAdd], keys: key != null ? [key] : null });
          }).then(function(res) {
            return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult;
          }).then(function(lastResult) {
            if (keyPath) {
              try {
                setByKeyPath(obj, keyPath, lastResult);
              } catch (_) {
              }
            }
            return lastResult;
          });
        };
        Table2.prototype.delete = function(key) {
          var _this = this;
          return this._trans("readwrite", function(trans) {
            return _this.core.mutate({ trans, type: "delete", keys: [key] }).then(function(res) {
              return builtInDeletionTrigger(_this, [key], res);
            }).then(function(res) {
              return res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0;
            });
          });
        };
        Table2.prototype.clear = function() {
          var _this = this;
          return this._trans("readwrite", function(trans) {
            return _this.core.mutate({ trans, type: "deleteRange", range: AnyRange }).then(function(res) {
              return builtInDeletionTrigger(_this, null, res);
            });
          }).then(function(res) {
            return res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0;
          });
        };
        Table2.prototype.bulkGet = function(keys2) {
          var _this = this;
          return this._trans("readonly", function(trans) {
            return _this.core.getMany({
              keys: keys2,
              trans
            }).then(function(result) {
              return result.map(function(res) {
                return _this.hook.reading.fire(res);
              });
            });
          });
        };
        Table2.prototype.bulkAdd = function(objects, keysOrOptions, options) {
          var _this = this;
          var keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
          options = options || (keys2 ? void 0 : keysOrOptions);
          var wantResults = options ? options.allKeys : void 0;
          return this._trans("readwrite", function(trans) {
            var _a3 = _this.schema.primKey, auto = _a3.auto, keyPath = _a3.keyPath;
            if (keyPath && keys2)
              throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
            if (keys2 && keys2.length !== objects.length)
              throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
            var numObjects = objects.length;
            var objectsToAdd = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
            return _this.core.mutate({ trans, type: "add", keys: keys2, values: objectsToAdd, wantResults }).then(function(_a4) {
              var numFailures = _a4.numFailures, results = _a4.results, lastResult = _a4.lastResult, failures = _a4.failures;
              var result = wantResults ? results : lastResult;
              if (numFailures === 0)
                return result;
              throw new BulkError("".concat(_this.name, ".bulkAdd(): ").concat(numFailures, " of ").concat(numObjects, " operations failed"), failures);
            });
          });
        };
        Table2.prototype.bulkPut = function(objects, keysOrOptions, options) {
          var _this = this;
          var keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
          options = options || (keys2 ? void 0 : keysOrOptions);
          var wantResults = options ? options.allKeys : void 0;
          return this._trans("readwrite", function(trans) {
            var _a3 = _this.schema.primKey, auto = _a3.auto, keyPath = _a3.keyPath;
            if (keyPath && keys2)
              throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
            if (keys2 && keys2.length !== objects.length)
              throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
            var numObjects = objects.length;
            var objectsToPut = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
            return _this.core.mutate({ trans, type: "put", keys: keys2, values: objectsToPut, wantResults }).then(function(_a4) {
              var numFailures = _a4.numFailures, results = _a4.results, lastResult = _a4.lastResult, failures = _a4.failures;
              var result = wantResults ? results : lastResult;
              if (numFailures === 0)
                return result;
              throw new BulkError("".concat(_this.name, ".bulkPut(): ").concat(numFailures, " of ").concat(numObjects, " operations failed"), failures);
            });
          });
        };
        Table2.prototype.bulkUpdate = function(keysAndChanges) {
          var _this = this;
          var coreTable = this.core;
          var keys2 = keysAndChanges.map(function(entry) {
            return entry.key;
          });
          var changeSpecs = keysAndChanges.map(function(entry) {
            return entry.changes;
          });
          var offsetMap = [];
          return this._trans("readwrite", function(trans) {
            return coreTable.getMany({ trans, keys: keys2, cache: "clone" }).then(function(objs) {
              var resultKeys = [];
              var resultObjs = [];
              keysAndChanges.forEach(function(_a3, idx) {
                var key = _a3.key, changes = _a3.changes;
                var obj = objs[idx];
                if (obj) {
                  for (var _i = 0, _b = Object.keys(changes); _i < _b.length; _i++) {
                    var keyPath = _b[_i];
                    var value = changes[keyPath];
                    if (keyPath === _this.schema.primKey.keyPath) {
                      if (cmp2(value, key) !== 0) {
                        throw new exceptions.Constraint("Cannot update primary key in bulkUpdate()");
                      }
                    } else {
                      setByKeyPath(obj, keyPath, value);
                    }
                  }
                  offsetMap.push(idx);
                  resultKeys.push(key);
                  resultObjs.push(obj);
                }
              });
              var numEntries = resultKeys.length;
              return coreTable.mutate({
                trans,
                type: "put",
                keys: resultKeys,
                values: resultObjs,
                updates: {
                  keys: keys2,
                  changeSpecs
                }
              }).then(function(_a3) {
                var numFailures = _a3.numFailures, failures = _a3.failures;
                if (numFailures === 0)
                  return numEntries;
                for (var _i = 0, _b = Object.keys(failures); _i < _b.length; _i++) {
                  var offset = _b[_i];
                  var mappedOffset = offsetMap[Number(offset)];
                  if (mappedOffset != null) {
                    var failure = failures[offset];
                    delete failures[offset];
                    failures[mappedOffset] = failure;
                  }
                }
                throw new BulkError("".concat(_this.name, ".bulkUpdate(): ").concat(numFailures, " of ").concat(numEntries, " operations failed"), failures);
              });
            });
          });
        };
        Table2.prototype.bulkDelete = function(keys2) {
          var _this = this;
          var numKeys = keys2.length;
          return this._trans("readwrite", function(trans) {
            return _this.core.mutate({ trans, type: "delete", keys: keys2 }).then(function(res) {
              return builtInDeletionTrigger(_this, keys2, res);
            });
          }).then(function(_a3) {
            var numFailures = _a3.numFailures, lastResult = _a3.lastResult, failures = _a3.failures;
            if (numFailures === 0)
              return lastResult;
            throw new BulkError("".concat(_this.name, ".bulkDelete(): ").concat(numFailures, " of ").concat(numKeys, " operations failed"), failures);
          });
        };
        return Table2;
      })();
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
        rv.addEventType = add3;
        for (var i2 = 1, l = arguments.length; i2 < l; ++i2) {
          add3(arguments[i2]);
        }
        return rv;
        function add3(eventName, chainFunction, defaultFunction) {
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
              add3(eventName, cfg[eventName][0], cfg[eventName][1]);
            } else if (args === "asap") {
              var context = add3(eventName, mirror, function fire() {
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
        ctx.replayFilter = curr ? function() {
          return combine(curr(), factory());
        } : factory;
        ctx.justLimit = isLimitFilter && !curr;
      }
      function addMatchFilter(ctx, fn) {
        ctx.isMatch = combine(ctx.isMatch, fn);
      }
      function getIndexOrStore(ctx, coreSchema) {
        if (ctx.isPrimKey)
          return coreSchema.primaryKey;
        var index = coreSchema.getIndexByKeyPath(ctx.index);
        if (!index)
          throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
        return index;
      }
      function openCursor(ctx, coreTable, trans) {
        var index = getIndexOrStore(ctx, coreTable.schema);
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
        var filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
        if (!ctx.or) {
          return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
        } else {
          var set_1 = {};
          var union = function(item, cursor, advance) {
            if (!filter || filter(cursor, advance, function(result) {
              return cursor.stop(result);
            }, function(err) {
              return cursor.fail(err);
            })) {
              var primaryKey = cursor.primaryKey;
              var key = "" + primaryKey;
              if (key === "[object ArrayBuffer]")
                key = "" + new Uint8Array(primaryKey);
              if (!hasOwn(set_1, key)) {
                set_1[key] = true;
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
        var mappedFn = valueMapper ? function(x, c, a) {
          return fn(valueMapper(x), c, a);
        } : fn;
        var wrappedFn = wrap(mappedFn);
        return cursorPromise.then(function(cursor) {
          if (cursor) {
            return cursor.start(function() {
              var c = function() {
                return cursor.continue();
              };
              if (!filter || filter(cursor, function(advancer) {
                return c = advancer;
              }, function(val) {
                cursor.stop(val);
                c = nop;
              }, function(e) {
                cursor.fail(e);
                c = nop;
              }))
                wrappedFn(cursor.value, cursor, function(advancer) {
                  return c = advancer;
                });
              c();
            });
          }
        });
      }
      var Collection = (function() {
        function Collection2() {
        }
        Collection2.prototype._read = function(fn, cb) {
          var ctx = this._ctx;
          return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readonly", fn).then(cb);
        };
        Collection2.prototype._write = function(fn) {
          var ctx = this._ctx;
          return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readwrite", fn, "locked");
        };
        Collection2.prototype._addAlgorithm = function(fn) {
          var ctx = this._ctx;
          ctx.algorithm = combine(ctx.algorithm, fn);
        };
        Collection2.prototype._iterate = function(fn, coreTrans) {
          return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
        };
        Collection2.prototype.clone = function(props2) {
          var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
          if (props2)
            extend(ctx, props2);
          rv._ctx = ctx;
          return rv;
        };
        Collection2.prototype.raw = function() {
          this._ctx.valueMapper = null;
          return this;
        };
        Collection2.prototype.each = function(fn) {
          var ctx = this._ctx;
          return this._read(function(trans) {
            return iter(ctx, fn, trans, ctx.table.core);
          });
        };
        Collection2.prototype.count = function(cb) {
          var _this = this;
          return this._read(function(trans) {
            var ctx = _this._ctx;
            var coreTable = ctx.table.core;
            if (isPlainKeyRange(ctx, true)) {
              return coreTable.count({
                trans,
                query: {
                  index: getIndexOrStore(ctx, coreTable.schema),
                  range: ctx.range
                }
              }).then(function(count2) {
                return Math.min(count2, ctx.limit);
              });
            } else {
              var count = 0;
              return iter(ctx, function() {
                ++count;
                return false;
              }, trans, coreTable).then(function() {
                return count;
              });
            }
          }).then(cb);
        };
        Collection2.prototype.sortBy = function(keyPath, cb) {
          var parts = keyPath.split(".").reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
          function getval(obj, i2) {
            if (i2)
              return getval(obj[parts[i2]], i2 - 1);
            return obj[lastPart];
          }
          var order = this._ctx.dir === "next" ? 1 : -1;
          function sorter(a, b) {
            var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
            return cmp2(aVal, bVal) * order;
          }
          return this.toArray(function(a) {
            return a.sort(sorter);
          }).then(cb);
        };
        Collection2.prototype.toArray = function(cb) {
          var _this = this;
          return this._read(function(trans) {
            var ctx = _this._ctx;
            if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
              var valueMapper_1 = ctx.valueMapper;
              var index = getIndexOrStore(ctx, ctx.table.core.schema);
              return ctx.table.core.query({
                trans,
                limit: ctx.limit,
                values: true,
                query: {
                  index,
                  range: ctx.range
                }
              }).then(function(_a3) {
                var result = _a3.result;
                return valueMapper_1 ? result.map(valueMapper_1) : result;
              });
            } else {
              var a_1 = [];
              return iter(ctx, function(item) {
                return a_1.push(item);
              }, trans, ctx.table.core).then(function() {
                return a_1;
              });
            }
          }, cb);
        };
        Collection2.prototype.offset = function(offset) {
          var ctx = this._ctx;
          if (offset <= 0)
            return this;
          ctx.offset += offset;
          if (isPlainKeyRange(ctx)) {
            addReplayFilter(ctx, function() {
              var offsetLeft = offset;
              return function(cursor, advance) {
                if (offsetLeft === 0)
                  return true;
                if (offsetLeft === 1) {
                  --offsetLeft;
                  return false;
                }
                advance(function() {
                  cursor.advance(offsetLeft);
                  offsetLeft = 0;
                });
                return false;
              };
            });
          } else {
            addReplayFilter(ctx, function() {
              var offsetLeft = offset;
              return function() {
                return --offsetLeft < 0;
              };
            });
          }
          return this;
        };
        Collection2.prototype.limit = function(numRows) {
          this._ctx.limit = Math.min(this._ctx.limit, numRows);
          addReplayFilter(this._ctx, function() {
            var rowsLeft = numRows;
            return function(cursor, advance, resolve) {
              if (--rowsLeft <= 0)
                advance(resolve);
              return rowsLeft >= 0;
            };
          }, true);
          return this;
        };
        Collection2.prototype.until = function(filterFunction, bIncludeStopEntry) {
          addFilter(this._ctx, function(cursor, advance, resolve) {
            if (filterFunction(cursor.value)) {
              advance(resolve);
              return bIncludeStopEntry;
            } else {
              return true;
            }
          });
          return this;
        };
        Collection2.prototype.first = function(cb) {
          return this.limit(1).toArray(function(a) {
            return a[0];
          }).then(cb);
        };
        Collection2.prototype.last = function(cb) {
          return this.reverse().first(cb);
        };
        Collection2.prototype.filter = function(filterFunction) {
          addFilter(this._ctx, function(cursor) {
            return filterFunction(cursor.value);
          });
          addMatchFilter(this._ctx, filterFunction);
          return this;
        };
        Collection2.prototype.and = function(filter) {
          return this.filter(filter);
        };
        Collection2.prototype.or = function(indexName) {
          return new this.db.WhereClause(this._ctx.table, indexName, this);
        };
        Collection2.prototype.reverse = function() {
          this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev";
          if (this._ondirectionchange)
            this._ondirectionchange(this._ctx.dir);
          return this;
        };
        Collection2.prototype.desc = function() {
          return this.reverse();
        };
        Collection2.prototype.eachKey = function(cb) {
          var ctx = this._ctx;
          ctx.keysOnly = !ctx.isMatch;
          return this.each(function(val, cursor) {
            cb(cursor.key, cursor);
          });
        };
        Collection2.prototype.eachUniqueKey = function(cb) {
          this._ctx.unique = "unique";
          return this.eachKey(cb);
        };
        Collection2.prototype.eachPrimaryKey = function(cb) {
          var ctx = this._ctx;
          ctx.keysOnly = !ctx.isMatch;
          return this.each(function(val, cursor) {
            cb(cursor.primaryKey, cursor);
          });
        };
        Collection2.prototype.keys = function(cb) {
          var ctx = this._ctx;
          ctx.keysOnly = !ctx.isMatch;
          var a = [];
          return this.each(function(item, cursor) {
            a.push(cursor.key);
          }).then(function() {
            return a;
          }).then(cb);
        };
        Collection2.prototype.primaryKeys = function(cb) {
          var ctx = this._ctx;
          if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
            return this._read(function(trans) {
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
            }).then(function(_a3) {
              var result = _a3.result;
              return result;
            }).then(cb);
          }
          ctx.keysOnly = !ctx.isMatch;
          var a = [];
          return this.each(function(item, cursor) {
            a.push(cursor.primaryKey);
          }).then(function() {
            return a;
          }).then(cb);
        };
        Collection2.prototype.uniqueKeys = function(cb) {
          this._ctx.unique = "unique";
          return this.keys(cb);
        };
        Collection2.prototype.firstKey = function(cb) {
          return this.limit(1).keys(function(a) {
            return a[0];
          }).then(cb);
        };
        Collection2.prototype.lastKey = function(cb) {
          return this.reverse().firstKey(cb);
        };
        Collection2.prototype.distinct = function() {
          var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
          if (!idx || !idx.multi)
            return this;
          var set2 = {};
          addFilter(this._ctx, function(cursor) {
            var strKey = cursor.primaryKey.toString();
            var found = hasOwn(set2, strKey);
            set2[strKey] = true;
            return !found;
          });
          return this;
        };
        Collection2.prototype.modify = function(changes) {
          var _this = this;
          var ctx = this._ctx;
          return this._write(function(trans) {
            var modifyer;
            if (typeof changes === "function") {
              modifyer = changes;
            } else {
              modifyer = function(item) {
                return applyUpdateSpec(item, changes);
              };
            }
            var coreTable = ctx.table.core;
            var _a3 = coreTable.schema.primaryKey, outbound = _a3.outbound, extractKey = _a3.extractKey;
            var limit = 200;
            var modifyChunkSize = _this.db._options.modifyChunkSize;
            if (modifyChunkSize) {
              if (typeof modifyChunkSize == "object") {
                limit = modifyChunkSize[coreTable.name] || modifyChunkSize["*"] || 200;
              } else {
                limit = modifyChunkSize;
              }
            }
            var totalFailures = [];
            var successCount = 0;
            var failedKeys = [];
            var applyMutateResult = function(expectedCount, res) {
              var failures = res.failures, numFailures = res.numFailures;
              successCount += expectedCount - numFailures;
              for (var _i = 0, _a4 = keys(failures); _i < _a4.length; _i++) {
                var pos = _a4[_i];
                totalFailures.push(failures[pos]);
              }
            };
            var isUnconditionalDelete = changes === deleteCallback;
            return _this.clone().primaryKeys().then(function(keys2) {
              var criteria = isPlainKeyRange(ctx) && ctx.limit === Infinity && (typeof changes !== "function" || isUnconditionalDelete) && {
                index: ctx.index,
                range: ctx.range
              };
              var nextChunk = function(offset) {
                var count = Math.min(limit, keys2.length - offset);
                var keysInChunk = keys2.slice(offset, offset + count);
                return (isUnconditionalDelete ? Promise.resolve([]) : coreTable.getMany({
                  trans,
                  keys: keysInChunk,
                  cache: "immutable"
                })).then(function(values) {
                  var addValues = [];
                  var putValues = [];
                  var putKeys = outbound ? [] : null;
                  var deleteKeys = isUnconditionalDelete ? keysInChunk : [];
                  if (!isUnconditionalDelete)
                    for (var i2 = 0; i2 < count; ++i2) {
                      var origValue = values[i2];
                      var ctx_1 = {
                        value: deepClone(origValue),
                        primKey: keys2[offset + i2]
                      };
                      if (modifyer.call(ctx_1, ctx_1.value, ctx_1) !== false) {
                        if (ctx_1.value == null) {
                          deleteKeys.push(keys2[offset + i2]);
                        } else if (!outbound && cmp2(extractKey(origValue), extractKey(ctx_1.value)) !== 0) {
                          deleteKeys.push(keys2[offset + i2]);
                          addValues.push(ctx_1.value);
                        } else {
                          putValues.push(ctx_1.value);
                          if (outbound)
                            putKeys.push(keys2[offset + i2]);
                        }
                      }
                    }
                  return Promise.resolve(addValues.length > 0 && coreTable.mutate({ trans, type: "add", values: addValues }).then(function(res) {
                    for (var pos in res.failures) {
                      deleteKeys.splice(parseInt(pos), 1);
                    }
                    applyMutateResult(addValues.length, res);
                  })).then(function() {
                    return (putValues.length > 0 || criteria && typeof changes === "object") && coreTable.mutate({
                      trans,
                      type: "put",
                      keys: putKeys,
                      values: putValues,
                      criteria,
                      changeSpec: typeof changes !== "function" && changes,
                      isAdditionalChunk: offset > 0
                    }).then(function(res) {
                      return applyMutateResult(putValues.length, res);
                    });
                  }).then(function() {
                    return (deleteKeys.length > 0 || criteria && isUnconditionalDelete) && coreTable.mutate({
                      trans,
                      type: "delete",
                      keys: deleteKeys,
                      criteria,
                      isAdditionalChunk: offset > 0
                    }).then(function(res) {
                      return builtInDeletionTrigger(ctx.table, deleteKeys, res);
                    }).then(function(res) {
                      return applyMutateResult(deleteKeys.length, res);
                    });
                  }).then(function() {
                    return keys2.length > offset + count && nextChunk(offset + limit);
                  });
                });
              };
              return nextChunk(0).then(function() {
                if (totalFailures.length > 0)
                  throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
                return keys2.length;
              });
            });
          });
        };
        Collection2.prototype.delete = function() {
          var ctx = this._ctx, range = ctx.range;
          if (isPlainKeyRange(ctx) && !ctx.table.schema.yProps && (ctx.isPrimKey || range.type === 3)) {
            return this._write(function(trans) {
              var primaryKey = ctx.table.core.schema.primaryKey;
              var coreRange = range;
              return ctx.table.core.count({ trans, query: { index: primaryKey, range: coreRange } }).then(function(count) {
                return ctx.table.core.mutate({ trans, type: "deleteRange", range: coreRange }).then(function(_a3) {
                  var failures = _a3.failures, numFailures = _a3.numFailures;
                  if (numFailures)
                    throw new ModifyError("Could not delete some values", Object.keys(failures).map(function(pos) {
                      return failures[pos];
                    }), count - numFailures);
                  return count - numFailures;
                });
              });
            });
          }
          return this.modify(deleteCallback);
        };
        return Collection2;
      })();
      var deleteCallback = function(value, ctx) {
        return ctx.value = null;
      };
      function createCollectionConstructor(db2) {
        return makeClassConstructor(Collection.prototype, function Collection2(whereClause, keyRangeGenerator) {
          this.db = db2;
          var keyRange = AnyRange, error = null;
          if (keyRangeGenerator)
            try {
              keyRange = keyRangeGenerator();
            } catch (ex) {
              error = ex;
            }
          var whereCtx = whereClause._ctx;
          var table = whereCtx.table;
          var readingHook = table.hook.reading.fire;
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
        return new whereClause.Collection(whereClause, function() {
          return rangeEqual("");
        }).limit(0);
      }
      function upperFactory(dir) {
        return dir === "next" ? function(s) {
          return s.toUpperCase();
        } : function(s) {
          return s.toLowerCase();
        };
      }
      function lowerFactory(dir) {
        return dir === "next" ? function(s) {
          return s.toLowerCase();
        } : function(s) {
          return s.toUpperCase();
        };
      }
      function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp3, dir) {
        var length = Math.min(key.length, lowerNeedle.length);
        var llp = -1;
        for (var i2 = 0; i2 < length; ++i2) {
          var lwrKeyChar = lowerKey[i2];
          if (lwrKeyChar !== lowerNeedle[i2]) {
            if (cmp3(key[i2], upperNeedle[i2]) < 0)
              return key.substr(0, i2) + upperNeedle[i2] + upperNeedle.substr(i2 + 1);
            if (cmp3(key[i2], lowerNeedle[i2]) < 0)
              return key.substr(0, i2) + lowerNeedle[i2] + upperNeedle.substr(i2 + 1);
            if (llp >= 0)
              return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
            return null;
          }
          if (cmp3(key[i2], lwrKeyChar) < 0)
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
        if (!needles.every(function(s) {
          return typeof s === "string";
        })) {
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
        var c = new whereClause.Collection(whereClause, function() {
          return createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix);
        });
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
      var WhereClause = (function() {
        function WhereClause2() {
        }
        Object.defineProperty(WhereClause2.prototype, "Collection", {
          get: function() {
            return this._ctx.table.db.Collection;
          },
          enumerable: false,
          configurable: true
        });
        WhereClause2.prototype.between = function(lower, upper, includeLower, includeUpper) {
          includeLower = includeLower !== false;
          includeUpper = includeUpper === true;
          try {
            if (this._cmp(lower, upper) > 0 || this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper))
              return emptyCollection(this);
            return new this.Collection(this, function() {
              return createRange(lower, upper, !includeLower, !includeUpper);
            });
          } catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
          }
        };
        WhereClause2.prototype.equals = function(value) {
          if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
          return new this.Collection(this, function() {
            return rangeEqual(value);
          });
        };
        WhereClause2.prototype.above = function(value) {
          if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
          return new this.Collection(this, function() {
            return createRange(value, void 0, true);
          });
        };
        WhereClause2.prototype.aboveOrEqual = function(value) {
          if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
          return new this.Collection(this, function() {
            return createRange(value, void 0, false);
          });
        };
        WhereClause2.prototype.below = function(value) {
          if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
          return new this.Collection(this, function() {
            return createRange(void 0, value, false, true);
          });
        };
        WhereClause2.prototype.belowOrEqual = function(value) {
          if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
          return new this.Collection(this, function() {
            return createRange(void 0, value);
          });
        };
        WhereClause2.prototype.startsWith = function(str) {
          if (typeof str !== "string")
            return fail(this, STRING_EXPECTED);
          return this.between(str, str + maxString, true, true);
        };
        WhereClause2.prototype.startsWithIgnoreCase = function(str) {
          if (str === "")
            return this.startsWith(str);
          return addIgnoreCaseAlgorithm(this, function(x, a) {
            return x.indexOf(a[0]) === 0;
          }, [str], maxString);
        };
        WhereClause2.prototype.equalsIgnoreCase = function(str) {
          return addIgnoreCaseAlgorithm(this, function(x, a) {
            return x === a[0];
          }, [str], "");
        };
        WhereClause2.prototype.anyOfIgnoreCase = function() {
          var set2 = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
          if (set2.length === 0)
            return emptyCollection(this);
          return addIgnoreCaseAlgorithm(this, function(x, a) {
            return a.indexOf(x) !== -1;
          }, set2, "");
        };
        WhereClause2.prototype.startsWithAnyOfIgnoreCase = function() {
          var set2 = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
          if (set2.length === 0)
            return emptyCollection(this);
          return addIgnoreCaseAlgorithm(this, function(x, a) {
            return a.some(function(n) {
              return x.indexOf(n) === 0;
            });
          }, set2, maxString);
        };
        WhereClause2.prototype.anyOf = function() {
          var _this = this;
          var set2 = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
          var compare = this._cmp;
          try {
            set2.sort(compare);
          } catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
          }
          if (set2.length === 0)
            return emptyCollection(this);
          var c = new this.Collection(this, function() {
            return createRange(set2[0], set2[set2.length - 1]);
          });
          c._ondirectionchange = function(direction) {
            compare = direction === "next" ? _this._ascending : _this._descending;
            set2.sort(compare);
          };
          var i2 = 0;
          c._addAlgorithm(function(cursor, advance, resolve) {
            var key = cursor.key;
            while (compare(key, set2[i2]) > 0) {
              ++i2;
              if (i2 === set2.length) {
                advance(resolve);
                return false;
              }
            }
            if (compare(key, set2[i2]) === 0) {
              return true;
            } else {
              advance(function() {
                cursor.continue(set2[i2]);
              });
              return false;
            }
          });
          return c;
        };
        WhereClause2.prototype.notEqual = function(value) {
          return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], { includeLowers: false, includeUppers: false });
        };
        WhereClause2.prototype.noneOf = function() {
          var set2 = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
          if (set2.length === 0)
            return new this.Collection(this);
          try {
            set2.sort(this._ascending);
          } catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
          }
          var ranges = set2.reduce(function(res, val) {
            return res ? res.concat([[res[res.length - 1][1], val]]) : [[minKey, val]];
          }, null);
          ranges.push([set2[set2.length - 1], this.db._maxKey]);
          return this.inAnyRange(ranges, { includeLowers: false, includeUppers: false });
        };
        WhereClause2.prototype.inAnyRange = function(ranges, options) {
          var _this = this;
          var cmp3 = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
          if (ranges.length === 0)
            return emptyCollection(this);
          if (!ranges.every(function(range) {
            return range[0] !== void 0 && range[1] !== void 0 && ascending(range[0], range[1]) <= 0;
          })) {
            return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
          }
          var includeLowers = !options || options.includeLowers !== false;
          var includeUppers = options && options.includeUppers === true;
          function addRange2(ranges2, newRange) {
            var i2 = 0, l = ranges2.length;
            for (; i2 < l; ++i2) {
              var range = ranges2[i2];
              if (cmp3(newRange[0], range[1]) < 0 && cmp3(newRange[1], range[0]) > 0) {
                range[0] = min(range[0], newRange[0]);
                range[1] = max(range[1], newRange[1]);
                break;
              }
            }
            if (i2 === l)
              ranges2.push(newRange);
            return ranges2;
          }
          var sortDirection = ascending;
          function rangeSorter(a, b) {
            return sortDirection(a[0], b[0]);
          }
          var set2;
          try {
            set2 = ranges.reduce(addRange2, []);
            set2.sort(rangeSorter);
          } catch (ex) {
            return fail(this, INVALID_KEY_ARGUMENT);
          }
          var rangePos = 0;
          var keyIsBeyondCurrentEntry = includeUppers ? function(key) {
            return ascending(key, set2[rangePos][1]) > 0;
          } : function(key) {
            return ascending(key, set2[rangePos][1]) >= 0;
          };
          var keyIsBeforeCurrentEntry = includeLowers ? function(key) {
            return descending(key, set2[rangePos][0]) > 0;
          } : function(key) {
            return descending(key, set2[rangePos][0]) >= 0;
          };
          function keyWithinCurrentRange(key) {
            return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
          }
          var checkKey = keyIsBeyondCurrentEntry;
          var c = new this.Collection(this, function() {
            return createRange(set2[0][0], set2[set2.length - 1][1], !includeLowers, !includeUppers);
          });
          c._ondirectionchange = function(direction) {
            if (direction === "next") {
              checkKey = keyIsBeyondCurrentEntry;
              sortDirection = ascending;
            } else {
              checkKey = keyIsBeforeCurrentEntry;
              sortDirection = descending;
            }
            set2.sort(rangeSorter);
          };
          c._addAlgorithm(function(cursor, advance, resolve) {
            var key = cursor.key;
            while (checkKey(key)) {
              ++rangePos;
              if (rangePos === set2.length) {
                advance(resolve);
                return false;
              }
            }
            if (keyWithinCurrentRange(key)) {
              return true;
            } else if (_this._cmp(key, set2[rangePos][1]) === 0 || _this._cmp(key, set2[rangePos][0]) === 0) {
              return false;
            } else {
              advance(function() {
                if (sortDirection === ascending)
                  cursor.continue(set2[rangePos][0]);
                else
                  cursor.continue(set2[rangePos][1]);
              });
              return false;
            }
          });
          return c;
        };
        WhereClause2.prototype.startsWithAnyOf = function() {
          var set2 = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
          if (!set2.every(function(s) {
            return typeof s === "string";
          })) {
            return fail(this, "startsWithAnyOf() only works with strings");
          }
          if (set2.length === 0)
            return emptyCollection(this);
          return this.inAnyRange(set2.map(function(str) {
            return [str, str + maxString];
          }));
        };
        return WhereClause2;
      })();
      function createWhereClauseConstructor(db2) {
        return makeClassConstructor(WhereClause.prototype, function WhereClause2(table, index, orCollection) {
          this.db = db2;
          this._ctx = {
            table,
            index: index === ":id" ? null : index,
            or: orCollection
          };
          this._cmp = this._ascending = cmp2;
          this._descending = function(a, b) {
            return cmp2(b, a);
          };
          this._max = function(a, b) {
            return cmp2(a, b) > 0 ? a : b;
          };
          this._min = function(a, b) {
            return cmp2(a, b) < 0 ? a : b;
          };
          this._IDBKeyRange = db2._deps.IDBKeyRange;
          if (!this._IDBKeyRange)
            throw new exceptions.MissingAPI();
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
      var Transaction = (function() {
        function Transaction2() {
        }
        Transaction2.prototype._lock = function() {
          assert(!PSD.global);
          ++this._reculock;
          if (this._reculock === 1 && !PSD.global)
            PSD.lockOwnerFor = this;
          return this;
        };
        Transaction2.prototype._unlock = function() {
          assert(!PSD.global);
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
        };
        Transaction2.prototype._locked = function() {
          return this._reculock && PSD.lockOwnerFor !== this;
        };
        Transaction2.prototype.create = function(idbtrans) {
          var _this = this;
          if (!this.mode)
            return this;
          var idbdb = this.db.idbdb;
          var dbOpenError = this.db._state.dbOpenError;
          assert(!this.idbtrans);
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
          assert(this._completion._state === null);
          idbtrans = this.idbtrans = idbtrans || (this.db.core ? this.db.core.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }) : idbdb.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }));
          idbtrans.onerror = wrap(function(ev) {
            preventDefault(ev);
            _this._reject(idbtrans.error);
          });
          idbtrans.onabort = wrap(function(ev) {
            preventDefault(ev);
            _this.active && _this._reject(new exceptions.Abort(idbtrans.error));
            _this.active = false;
            _this.on("abort").fire(ev);
          });
          idbtrans.oncomplete = wrap(function() {
            _this.active = false;
            _this._resolve();
            if ("mutatedParts" in idbtrans) {
              globalEvents.storagemutated.fire(idbtrans["mutatedParts"]);
            }
          });
          return this;
        };
        Transaction2.prototype._promise = function(mode, fn, bWriteLock) {
          var _this = this;
          if (mode === "readwrite" && this.mode !== "readwrite")
            return rejection(new exceptions.ReadOnly("Transaction is readonly"));
          if (!this.active)
            return rejection(new exceptions.TransactionInactive());
          if (this._locked()) {
            return new DexiePromise(function(resolve, reject) {
              _this._blockedFuncs.push([function() {
                _this._promise(mode, fn, bWriteLock).then(resolve, reject);
              }, PSD]);
            });
          } else if (bWriteLock) {
            return newScope(function() {
              var p2 = new DexiePromise(function(resolve, reject) {
                _this._lock();
                var rv = fn(resolve, reject, _this);
                if (rv && rv.then)
                  rv.then(resolve, reject);
              });
              p2.finally(function() {
                return _this._unlock();
              });
              p2._lib = true;
              return p2;
            });
          } else {
            var p = new DexiePromise(function(resolve, reject) {
              var rv = fn(resolve, reject, _this);
              if (rv && rv.then)
                rv.then(resolve, reject);
            });
            p._lib = true;
            return p;
          }
        };
        Transaction2.prototype._root = function() {
          return this.parent ? this.parent._root() : this;
        };
        Transaction2.prototype.waitFor = function(promiseLike) {
          var root = this._root();
          var promise = DexiePromise.resolve(promiseLike);
          if (root._waitingFor) {
            root._waitingFor = root._waitingFor.then(function() {
              return promise;
            });
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
          return new DexiePromise(function(resolve, reject) {
            promise.then(function(res) {
              return root._waitingQueue.push(wrap(resolve.bind(null, res)));
            }, function(err) {
              return root._waitingQueue.push(wrap(reject.bind(null, err)));
            }).finally(function() {
              if (root._waitingFor === currentWaitPromise) {
                root._waitingFor = null;
              }
            });
          });
        };
        Transaction2.prototype.abort = function() {
          if (this.active) {
            this.active = false;
            if (this.idbtrans)
              this.idbtrans.abort();
            this._reject(new exceptions.Abort());
          }
        };
        Transaction2.prototype.table = function(tableName) {
          var memoizedTables = this._memoizedTables || (this._memoizedTables = {});
          if (hasOwn(memoizedTables, tableName))
            return memoizedTables[tableName];
          var tableSchema = this.schema[tableName];
          if (!tableSchema) {
            throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
          }
          var transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
          transactionBoundTable.core = this.db.core.table(tableName);
          memoizedTables[tableName] = transactionBoundTable;
          return transactionBoundTable;
        };
        return Transaction2;
      })();
      function createTransactionConstructor(db2) {
        return makeClassConstructor(Transaction.prototype, function Transaction2(mode, storeNames, dbschema, chromeTransactionDurability, parent) {
          var _this = this;
          if (mode !== "readonly")
            storeNames.forEach(function(storeName) {
              var _a3;
              var yProps = (_a3 = dbschema[storeName]) === null || _a3 === void 0 ? void 0 : _a3.yProps;
              if (yProps)
                storeNames = storeNames.concat(yProps.map(function(p) {
                  return p.updatesTable;
                }));
            });
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
          this._completion = new DexiePromise(function(resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
          });
          this._completion.then(function() {
            _this.active = false;
            _this.on.complete.fire();
          }, function(e) {
            var wasActive = _this.active;
            _this.active = false;
            _this.on.error.fire(e);
            _this.parent ? _this.parent._reject(e) : wasActive && _this.idbtrans && _this.idbtrans.abort();
            return rejection(e);
          });
        });
      }
      function createIndexSpec(name, keyPath, unique, multi, auto, compound, isPrimKey, type2) {
        return {
          name,
          keyPath,
          unique,
          multi,
          auto,
          compound,
          src: (unique && !isPrimKey ? "&" : "") + (multi ? "*" : "") + (auto ? "++" : "") + nameFromKeyPath(keyPath),
          type: type2
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
          idxByName: arrayToObject(indexes, function(index) {
            return [index.name, index];
          })
        };
      }
      function safariMultiStoreFix(storeNames) {
        return storeNames.length === 1 ? storeNames[0] : storeNames;
      }
      var getMaxKey = function(IdbKeyRange) {
        try {
          IdbKeyRange.only([[]]);
          getMaxKey = function() {
            return [[]];
          };
          return [[]];
        } catch (e) {
          getMaxKey = function() {
            return maxString;
          };
          return maxString;
        }
      };
      function getKeyExtractor(keyPath) {
        if (keyPath == null) {
          return function() {
            return void 0;
          };
        } else if (typeof keyPath === "string") {
          return getSinglePathKeyExtractor(keyPath);
        } else {
          return function(obj) {
            return getByKeyPath(obj, keyPath);
          };
        }
      }
      function getSinglePathKeyExtractor(keyPath) {
        var split = keyPath.split(".");
        if (split.length === 1) {
          return function(obj) {
            return obj[keyPath];
          };
        } else {
          return function(obj) {
            return getByKeyPath(obj, keyPath);
          };
        }
      }
      function arrayify(arrayLike) {
        return [].slice.call(arrayLike);
      }
      var _id_counter = 0;
      function getKeyPathAlias(keyPath) {
        return keyPath == null ? ":id" : typeof keyPath === "string" ? keyPath : "[".concat(keyPath.join("+"), "]");
      }
      function createDBCore(db2, IdbKeyRange, tmpTrans) {
        function extractSchema(db3, trans) {
          var tables2 = arrayify(db3.objectStoreNames);
          return {
            schema: {
              name: db3.name,
              tables: tables2.map(function(table) {
                return trans.objectStore(table);
              }).map(function(store) {
                var keyPath = store.keyPath, autoIncrement = store.autoIncrement;
                var compound = isArray(keyPath);
                var outbound = keyPath == null;
                var indexByKeyPath = {};
                var result = {
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
                  indexes: arrayify(store.indexNames).map(function(indexName) {
                    return store.index(indexName);
                  }).map(function(index) {
                    var name = index.name, unique = index.unique, multiEntry = index.multiEntry, keyPath2 = index.keyPath;
                    var compound2 = isArray(keyPath2);
                    var result2 = {
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
                  getIndexByKeyPath: function(keyPath2) {
                    return indexByKeyPath[getKeyPathAlias(keyPath2)];
                  }
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
          var lower = range.lower, upper = range.upper, lowerOpen = range.lowerOpen, upperOpen = range.upperOpen;
          var idbRange = lower === void 0 ? upper === void 0 ? null : IdbKeyRange.upperBound(upper, !!upperOpen) : upper === void 0 ? IdbKeyRange.lowerBound(lower, !!lowerOpen) : IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
          return idbRange;
        }
        function createDbCoreTable(tableSchema) {
          var tableName = tableSchema.name;
          function mutate(_a4) {
            var trans = _a4.trans, type2 = _a4.type, keys2 = _a4.keys, values = _a4.values, range = _a4.range;
            return new Promise(function(resolve, reject) {
              resolve = wrap(resolve);
              var store = trans.objectStore(tableName);
              var outbound = store.keyPath == null;
              var isAddOrPut = type2 === "put" || type2 === "add";
              if (!isAddOrPut && type2 !== "delete" && type2 !== "deleteRange")
                throw new Error("Invalid operation type: " + type2);
              var length = (keys2 || values || { length: 1 }).length;
              if (keys2 && values && keys2.length !== values.length) {
                throw new Error("Given keys array must have same length as given values array.");
              }
              if (length === 0)
                return resolve({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
              var req;
              var reqs = [];
              var failures = [];
              var numFailures = 0;
              var errorHandler = function(event) {
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
                var _a5 = isAddOrPut ? outbound ? [values, keys2] : [values, null] : [keys2, null], args1 = _a5[0], args2 = _a5[1];
                if (isAddOrPut) {
                  for (var i2 = 0; i2 < length; ++i2) {
                    reqs.push(req = args2 && args2[i2] !== void 0 ? store[type2](args1[i2], args2[i2]) : store[type2](args1[i2]));
                    req.onerror = errorHandler;
                  }
                } else {
                  for (var i2 = 0; i2 < length; ++i2) {
                    reqs.push(req = store[type2](args1[i2]));
                    req.onerror = errorHandler;
                  }
                }
              }
              var done = function(event) {
                var lastResult = event.target.result;
                reqs.forEach(function(req2, i3) {
                  return req2.error != null && (failures[i3] = req2.error);
                });
                resolve({
                  numFailures,
                  failures,
                  results: type2 === "delete" ? keys2 : reqs.map(function(req2) {
                    return req2.result;
                  }),
                  lastResult
                });
              };
              req.onerror = function(event) {
                errorHandler(event);
                done(event);
              };
              req.onsuccess = done;
            });
          }
          function openCursor2(_a4) {
            var trans = _a4.trans, values = _a4.values, query2 = _a4.query, reverse = _a4.reverse, unique = _a4.unique;
            return new Promise(function(resolve, reject) {
              resolve = wrap(resolve);
              var index = query2.index, range = query2.range;
              var store = trans.objectStore(tableName);
              var source2 = index.isPrimaryKey ? store : store.index(index.name);
              var direction = reverse ? unique ? "prevunique" : "prev" : unique ? "nextunique" : "next";
              var req = values || !("openKeyCursor" in source2) ? source2.openCursor(makeIDBKeyRange(range), direction) : source2.openKeyCursor(makeIDBKeyRange(range), direction);
              req.onerror = eventRejectHandler(reject);
              req.onsuccess = wrap(function(ev) {
                var cursor = req.result;
                if (!cursor) {
                  resolve(null);
                  return;
                }
                cursor.___id = ++_id_counter;
                cursor.done = false;
                var _cursorContinue = cursor.continue.bind(cursor);
                var _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
                if (_cursorContinuePrimaryKey)
                  _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
                var _cursorAdvance = cursor.advance.bind(cursor);
                var doThrowCursorIsNotStarted = function() {
                  throw new Error("Cursor not started");
                };
                var doThrowCursorIsStopped = function() {
                  throw new Error("Cursor not stopped");
                };
                cursor.trans = trans;
                cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
                cursor.fail = wrap(reject);
                cursor.next = function() {
                  var _this = this;
                  var gotOne = 1;
                  return this.start(function() {
                    return gotOne-- ? _this.continue() : _this.stop();
                  }).then(function() {
                    return _this;
                  });
                };
                cursor.start = function(callback) {
                  var iterationPromise = new Promise(function(resolveIteration, rejectIteration) {
                    resolveIteration = wrap(resolveIteration);
                    req.onerror = eventRejectHandler(rejectIteration);
                    cursor.fail = rejectIteration;
                    cursor.stop = function(value) {
                      cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                      resolveIteration(value);
                    };
                  });
                  var guardedCallback = function() {
                    if (req.result) {
                      try {
                        callback();
                      } catch (err) {
                        cursor.fail(err);
                      }
                    } else {
                      cursor.done = true;
                      cursor.start = function() {
                        throw new Error("Cursor behind last entry");
                      };
                      cursor.stop();
                    }
                  };
                  req.onsuccess = wrap(function(ev2) {
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
            return function(request) {
              return new Promise(function(resolve, reject) {
                resolve = wrap(resolve);
                var trans = request.trans, values = request.values, limit = request.limit, query2 = request.query;
                var nonInfinitLimit = limit === Infinity ? void 0 : limit;
                var index = query2.index, range = query2.range;
                var store = trans.objectStore(tableName);
                var source2 = index.isPrimaryKey ? store : store.index(index.name);
                var idbKeyRange = makeIDBKeyRange(range);
                if (limit === 0)
                  return resolve({ result: [] });
                if (hasGetAll2) {
                  var req = values ? source2.getAll(idbKeyRange, nonInfinitLimit) : source2.getAllKeys(idbKeyRange, nonInfinitLimit);
                  req.onsuccess = function(event) {
                    return resolve({ result: event.target.result });
                  };
                  req.onerror = eventRejectHandler(reject);
                } else {
                  var count_1 = 0;
                  var req_1 = values || !("openKeyCursor" in source2) ? source2.openCursor(idbKeyRange) : source2.openKeyCursor(idbKeyRange);
                  var result_1 = [];
                  req_1.onsuccess = function(event) {
                    var cursor = req_1.result;
                    if (!cursor)
                      return resolve({ result: result_1 });
                    result_1.push(values ? cursor.value : cursor.primaryKey);
                    if (++count_1 === limit)
                      return resolve({ result: result_1 });
                    cursor.continue();
                  };
                  req_1.onerror = eventRejectHandler(reject);
                }
              });
            };
          }
          return {
            name: tableName,
            schema: tableSchema,
            mutate,
            getMany: function(_a4) {
              var trans = _a4.trans, keys2 = _a4.keys;
              return new Promise(function(resolve, reject) {
                resolve = wrap(resolve);
                var store = trans.objectStore(tableName);
                var length = keys2.length;
                var result = new Array(length);
                var keyCount = 0;
                var callbackCount = 0;
                var req;
                var successHandler = function(event) {
                  var req2 = event.target;
                  if ((result[req2._pos] = req2.result) != null)
                    ;
                  if (++callbackCount === keyCount)
                    resolve(result);
                };
                var errorHandler = eventRejectHandler(reject);
                for (var i2 = 0; i2 < length; ++i2) {
                  var key = keys2[i2];
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
            get: function(_a4) {
              var trans = _a4.trans, key = _a4.key;
              return new Promise(function(resolve, reject) {
                resolve = wrap(resolve);
                var store = trans.objectStore(tableName);
                var req = store.get(key);
                req.onsuccess = function(event) {
                  return resolve(event.target.result);
                };
                req.onerror = eventRejectHandler(reject);
              });
            },
            query: query(hasGetAll),
            openCursor: openCursor2,
            count: function(_a4) {
              var query2 = _a4.query, trans = _a4.trans;
              var index = query2.index, range = query2.range;
              return new Promise(function(resolve, reject) {
                var store = trans.objectStore(tableName);
                var source2 = index.isPrimaryKey ? store : store.index(index.name);
                var idbKeyRange = makeIDBKeyRange(range);
                var req = idbKeyRange ? source2.count(idbKeyRange) : source2.count();
                req.onsuccess = wrap(function(ev) {
                  return resolve(ev.target.result);
                });
                req.onerror = eventRejectHandler(reject);
              });
            }
          };
        }
        var _a3 = extractSchema(db2, tmpTrans), schema = _a3.schema, hasGetAll = _a3.hasGetAll;
        var tables = schema.tables.map(function(tableSchema) {
          return createDbCoreTable(tableSchema);
        });
        var tableMap = {};
        tables.forEach(function(table) {
          return tableMap[table.name] = table;
        });
        return {
          stack: "dbcore",
          transaction: db2.transaction.bind(db2),
          table: function(name) {
            var result = tableMap[name];
            if (!result)
              throw new Error("Table '".concat(name, "' not found"));
            return tableMap[name];
          },
          MIN_KEY: -Infinity,
          MAX_KEY: getMaxKey(IdbKeyRange),
          schema
        };
      }
      function createMiddlewareStack(stackImpl, middlewares) {
        return middlewares.reduce(function(down, _a3) {
          var create = _a3.create;
          return __assign(__assign({}, down), create(down));
        }, stackImpl);
      }
      function createMiddlewareStacks(middlewares, idbdb, _a3, tmpTrans) {
        var IDBKeyRange = _a3.IDBKeyRange;
        _a3.indexedDB;
        var dbcore = createMiddlewareStack(createDBCore(idbdb, IDBKeyRange, tmpTrans), middlewares.dbcore);
        return {
          dbcore
        };
      }
      function generateMiddlewareStacks(db2, tmpTrans) {
        var idbdb = tmpTrans.db;
        var stacks = createMiddlewareStacks(db2._middlewares, idbdb, db2._deps, tmpTrans);
        db2.core = stacks.dbcore;
        db2.tables.forEach(function(table) {
          var tableName = table.name;
          if (db2.core.schema.tables.some(function(tbl) {
            return tbl.name === tableName;
          })) {
            table.core = db2.core.table(tableName);
            if (db2[tableName] instanceof db2.Table) {
              db2[tableName].core = table.core;
            }
          }
        });
      }
      function setApiOnPlace(db2, objs, tableNames, dbschema) {
        tableNames.forEach(function(tableName) {
          var schema = dbschema[tableName];
          objs.forEach(function(obj) {
            var propDesc = getPropertyDescriptor(obj, tableName);
            if (!propDesc || "value" in propDesc && propDesc.value === void 0) {
              if (obj === db2.Transaction.prototype || obj instanceof db2.Transaction) {
                setProp(obj, tableName, {
                  get: function() {
                    return this.table(tableName);
                  },
                  set: function(value) {
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
      function removeTablesApi(db2, objs) {
        objs.forEach(function(obj) {
          for (var key in obj) {
            if (obj[key] instanceof db2.Table)
              delete obj[key];
          }
        });
      }
      function lowerVersionFirst(a, b) {
        return a._cfg.version - b._cfg.version;
      }
      function runUpgraders(db2, oldVersion, idbUpgradeTrans, reject) {
        var globalSchema = db2._dbSchema;
        if (idbUpgradeTrans.objectStoreNames.contains("$meta") && !globalSchema.$meta) {
          globalSchema.$meta = createTableSchema("$meta", parseIndexSyntax("")[0], []);
          db2._storeNames.push("$meta");
        }
        var trans = db2._createTransaction("readwrite", db2._storeNames, globalSchema);
        trans.create(idbUpgradeTrans);
        trans._completion.catch(reject);
        var rejectTransaction = trans._reject.bind(trans);
        var transless = PSD.transless || PSD;
        newScope(function() {
          PSD.trans = trans;
          PSD.transless = transless;
          if (oldVersion === 0) {
            keys(globalSchema).forEach(function(tableName) {
              createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
            });
            generateMiddlewareStacks(db2, idbUpgradeTrans);
            DexiePromise.follow(function() {
              return db2.on.populate.fire(trans);
            }).catch(rejectTransaction);
          } else {
            generateMiddlewareStacks(db2, idbUpgradeTrans);
            return getExistingVersion(db2, trans, oldVersion).then(function(oldVersion2) {
              return updateTablesAndIndexes(db2, oldVersion2, trans, idbUpgradeTrans);
            }).catch(rejectTransaction);
          }
        });
      }
      function patchCurrentVersion(db2, idbUpgradeTrans) {
        createMissingTables(db2._dbSchema, idbUpgradeTrans);
        if (idbUpgradeTrans.db.version % 10 === 0 && !idbUpgradeTrans.objectStoreNames.contains("$meta")) {
          idbUpgradeTrans.db.createObjectStore("$meta").add(Math.ceil(idbUpgradeTrans.db.version / 10 - 1), "version");
        }
        var globalSchema = buildGlobalSchema(db2, db2.idbdb, idbUpgradeTrans);
        adjustToExistingIndexNames(db2, db2._dbSchema, idbUpgradeTrans);
        var diff = getSchemaDiff(globalSchema, db2._dbSchema);
        var _loop_1 = function(tableChange2) {
          if (tableChange2.change.length || tableChange2.recreate) {
            console.warn("Unable to patch indexes of table ".concat(tableChange2.name, " because it has changes on the type of index or primary key."));
            return { value: void 0 };
          }
          var store = idbUpgradeTrans.objectStore(tableChange2.name);
          tableChange2.add.forEach(function(idx) {
            if (debug9)
              console.debug("Dexie upgrade patch: Creating missing index ".concat(tableChange2.name, ".").concat(idx.src));
            addIndex(store, idx);
          });
        };
        for (var _i = 0, _a3 = diff.change; _i < _a3.length; _i++) {
          var tableChange = _a3[_i];
          var state_1 = _loop_1(tableChange);
          if (typeof state_1 === "object")
            return state_1.value;
        }
      }
      function getExistingVersion(db2, trans, oldVersion) {
        if (trans.storeNames.includes("$meta")) {
          return trans.table("$meta").get("version").then(function(metaVersion) {
            return metaVersion != null ? metaVersion : oldVersion;
          });
        } else {
          return DexiePromise.resolve(oldVersion);
        }
      }
      function updateTablesAndIndexes(db2, oldVersion, trans, idbUpgradeTrans) {
        var queue = [];
        var versions = db2._versions;
        var globalSchema = db2._dbSchema = buildGlobalSchema(db2, db2.idbdb, idbUpgradeTrans);
        var versToRun = versions.filter(function(v) {
          return v._cfg.version >= oldVersion;
        });
        if (versToRun.length === 0) {
          return DexiePromise.resolve();
        }
        versToRun.forEach(function(version) {
          queue.push(function() {
            var oldSchema = globalSchema;
            var newSchema = version._cfg.dbschema;
            adjustToExistingIndexNames(db2, oldSchema, idbUpgradeTrans);
            adjustToExistingIndexNames(db2, newSchema, idbUpgradeTrans);
            globalSchema = db2._dbSchema = newSchema;
            var diff = getSchemaDiff(oldSchema, newSchema);
            diff.add.forEach(function(tuple) {
              createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
            });
            diff.change.forEach(function(change) {
              if (change.recreate) {
                throw new exceptions.Upgrade("Not yet support for changing primary key");
              } else {
                var store_1 = idbUpgradeTrans.objectStore(change.name);
                change.add.forEach(function(idx) {
                  return addIndex(store_1, idx);
                });
                change.change.forEach(function(idx) {
                  store_1.deleteIndex(idx.name);
                  addIndex(store_1, idx);
                });
                change.del.forEach(function(idxName) {
                  return store_1.deleteIndex(idxName);
                });
              }
            });
            var contentUpgrade = version._cfg.contentUpgrade;
            if (contentUpgrade && version._cfg.version > oldVersion) {
              generateMiddlewareStacks(db2, idbUpgradeTrans);
              trans._memoizedTables = {};
              var upgradeSchema_1 = shallowClone(newSchema);
              diff.del.forEach(function(table) {
                upgradeSchema_1[table] = oldSchema[table];
              });
              removeTablesApi(db2, [db2.Transaction.prototype]);
              setApiOnPlace(db2, [db2.Transaction.prototype], keys(upgradeSchema_1), upgradeSchema_1);
              trans.schema = upgradeSchema_1;
              var contentUpgradeIsAsync_1 = isAsyncFunction(contentUpgrade);
              if (contentUpgradeIsAsync_1) {
                incrementExpectedAwaits();
              }
              var returnValue_1;
              var promiseFollowed = DexiePromise.follow(function() {
                returnValue_1 = contentUpgrade(trans);
                if (returnValue_1) {
                  if (contentUpgradeIsAsync_1) {
                    var decrementor = decrementExpectedAwaits.bind(null, null);
                    returnValue_1.then(decrementor, decrementor);
                  }
                }
              });
              return returnValue_1 && typeof returnValue_1.then === "function" ? DexiePromise.resolve(returnValue_1) : promiseFollowed.then(function() {
                return returnValue_1;
              });
            }
          });
          queue.push(function(idbtrans) {
            var newSchema = version._cfg.dbschema;
            deleteRemovedTables(newSchema, idbtrans);
            removeTablesApi(db2, [db2.Transaction.prototype]);
            setApiOnPlace(db2, [db2.Transaction.prototype], db2._storeNames, db2._dbSchema);
            trans.schema = db2._dbSchema;
          });
          queue.push(function(idbtrans) {
            if (db2.idbdb.objectStoreNames.contains("$meta")) {
              if (Math.ceil(db2.idbdb.version / 10) === version._cfg.version) {
                db2.idbdb.deleteObjectStore("$meta");
                delete db2._dbSchema.$meta;
                db2._storeNames = db2._storeNames.filter(function(name) {
                  return name !== "$meta";
                });
              } else {
                idbtrans.objectStore("$meta").put(version._cfg.version, "version");
              }
            }
          });
        });
        function runQueue() {
          return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) : DexiePromise.resolve();
        }
        return runQueue().then(function() {
          createMissingTables(globalSchema, idbUpgradeTrans);
        });
      }
      function getSchemaDiff(oldSchema, newSchema) {
        var diff = {
          del: [],
          add: [],
          change: []
        };
        var table;
        for (table in oldSchema) {
          if (!newSchema[table])
            diff.del.push(table);
        }
        for (table in newSchema) {
          var oldDef = oldSchema[table], newDef = newSchema[table];
          if (!oldDef) {
            diff.add.push([table, newDef]);
          } else {
            var change = {
              name: table,
              def: newDef,
              recreate: false,
              del: [],
              add: [],
              change: []
            };
            if ("" + (oldDef.primKey.keyPath || "") !== "" + (newDef.primKey.keyPath || "") || oldDef.primKey.auto !== newDef.primKey.auto) {
              change.recreate = true;
              diff.change.push(change);
            } else {
              var oldIndexes = oldDef.idxByName;
              var newIndexes = newDef.idxByName;
              var idxName = void 0;
              for (idxName in oldIndexes) {
                if (!newIndexes[idxName])
                  change.del.push(idxName);
              }
              for (idxName in newIndexes) {
                var oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
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
        var store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ? { keyPath: primKey.keyPath, autoIncrement: primKey.auto } : { autoIncrement: primKey.auto });
        indexes.forEach(function(idx) {
          return addIndex(store, idx);
        });
        return store;
      }
      function createMissingTables(newSchema, idbtrans) {
        keys(newSchema).forEach(function(tableName) {
          if (!idbtrans.db.objectStoreNames.contains(tableName)) {
            if (debug9)
              console.debug("Dexie: Creating missing table", tableName);
            createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
          }
        });
      }
      function deleteRemovedTables(newSchema, idbtrans) {
        [].slice.call(idbtrans.db.objectStoreNames).forEach(function(storeName) {
          return newSchema[storeName] == null && idbtrans.db.deleteObjectStore(storeName);
        });
      }
      function addIndex(store, idx) {
        store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multi });
      }
      function buildGlobalSchema(db2, idbdb, tmpTrans) {
        var globalSchema = {};
        var dbStoreNames = slice(idbdb.objectStoreNames, 0);
        dbStoreNames.forEach(function(storeName) {
          var store = tmpTrans.objectStore(storeName);
          var keyPath = store.keyPath;
          var primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", true, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
          var indexes = [];
          for (var j = 0; j < store.indexNames.length; ++j) {
            var idbindex = store.index(store.indexNames[j]);
            keyPath = idbindex.keyPath;
            var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
            indexes.push(index);
          }
          globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
        });
        return globalSchema;
      }
      function readGlobalSchema(db2, idbdb, tmpTrans) {
        db2.verno = idbdb.version / 10;
        var globalSchema = db2._dbSchema = buildGlobalSchema(db2, idbdb, tmpTrans);
        db2._storeNames = slice(idbdb.objectStoreNames, 0);
        setApiOnPlace(db2, [db2._allTables], keys(globalSchema), globalSchema);
      }
      function verifyInstalledSchema(db2, tmpTrans) {
        var installedSchema = buildGlobalSchema(db2, db2.idbdb, tmpTrans);
        var diff = getSchemaDiff(installedSchema, db2._dbSchema);
        return !(diff.add.length || diff.change.some(function(ch) {
          return ch.add.length || ch.change.length;
        }));
      }
      function adjustToExistingIndexNames(db2, schema, idbtrans) {
        var storeNames = idbtrans.db.objectStoreNames;
        for (var i2 = 0; i2 < storeNames.length; ++i2) {
          var storeName = storeNames[i2];
          var store = idbtrans.objectStore(storeName);
          db2._hasGetAll = "getAll" in store;
          for (var j = 0; j < store.indexNames.length; ++j) {
            var indexName = store.indexNames[j];
            var keyPath = store.index(indexName).keyPath;
            var dexieName = typeof keyPath === "string" ? keyPath : "[" + slice(keyPath).join("+") + "]";
            if (schema[storeName]) {
              var indexSpec = schema[storeName].idxByName[dexieName];
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
        return primKeyAndIndexes.split(",").map(function(index, indexNum) {
          var _a3;
          var typeSplit = index.split(":");
          var type2 = (_a3 = typeSplit[1]) === null || _a3 === void 0 ? void 0 : _a3.trim();
          index = typeSplit[0].trim();
          var name = index.replace(/([&*]|\+\+)/g, "");
          var keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split("+") : name;
          return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), indexNum === 0, type2);
        });
      }
      var Version = (function() {
        function Version2() {
        }
        Version2.prototype._createTableSchema = function(name, primKey, indexes) {
          return createTableSchema(name, primKey, indexes);
        };
        Version2.prototype._parseIndexSyntax = function(primKeyAndIndexes) {
          return parseIndexSyntax(primKeyAndIndexes);
        };
        Version2.prototype._parseStoresSpec = function(stores, outSchema) {
          var _this = this;
          keys(stores).forEach(function(tableName) {
            if (stores[tableName] !== null) {
              var indexes = _this._parseIndexSyntax(stores[tableName]);
              var primKey = indexes.shift();
              if (!primKey) {
                throw new exceptions.Schema("Invalid schema for table " + tableName + ": " + stores[tableName]);
              }
              primKey.unique = true;
              if (primKey.multi)
                throw new exceptions.Schema("Primary key cannot be multiEntry*");
              indexes.forEach(function(idx) {
                if (idx.auto)
                  throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
                if (!idx.keyPath)
                  throw new exceptions.Schema("Index must have a name and cannot be an empty string");
              });
              var tblSchema = _this._createTableSchema(tableName, primKey, indexes);
              outSchema[tableName] = tblSchema;
            }
          });
        };
        Version2.prototype.stores = function(stores) {
          var db2 = this.db;
          this._cfg.storesSource = this._cfg.storesSource ? extend(this._cfg.storesSource, stores) : stores;
          var versions = db2._versions;
          var storesSpec = {};
          var dbschema = {};
          versions.forEach(function(version) {
            extend(storesSpec, version._cfg.storesSource);
            dbschema = version._cfg.dbschema = {};
            version._parseStoresSpec(storesSpec, dbschema);
          });
          db2._dbSchema = dbschema;
          removeTablesApi(db2, [db2._allTables, db2, db2.Transaction.prototype]);
          setApiOnPlace(db2, [db2._allTables, db2, db2.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
          db2._storeNames = keys(dbschema);
          return this;
        };
        Version2.prototype.upgrade = function(upgradeFunction) {
          this._cfg.contentUpgrade = promisableChain(this._cfg.contentUpgrade || nop, upgradeFunction);
          return this;
        };
        return Version2;
      })();
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
        var dbNamesDB = indexedDB2["_dbNamesDB"];
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
      function getDatabaseNames(_a3) {
        var indexedDB2 = _a3.indexedDB, IDBKeyRange = _a3.IDBKeyRange;
        return hasDatabasesNative(indexedDB2) ? Promise.resolve(indexedDB2.databases()).then(function(infos) {
          return infos.map(function(info) {
            return info.name;
          }).filter(function(name) {
            return name !== DBNAMES_DB;
          });
        }) : getDbNamesTable(indexedDB2, IDBKeyRange).toCollection().primaryKeys();
      }
      function _onDatabaseCreated(_a3, name) {
        var indexedDB2 = _a3.indexedDB, IDBKeyRange = _a3.IDBKeyRange;
        !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange).put({ name }).catch(nop);
      }
      function _onDatabaseDeleted(_a3, name) {
        var indexedDB2 = _a3.indexedDB, IDBKeyRange = _a3.IDBKeyRange;
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
      var _a2;
      function isEmptyRange(node) {
        return !("from" in node);
      }
      var RangeSet2 = function(fromOrTree, to) {
        if (this) {
          extend(this, arguments.length ? { d: 1, from: fromOrTree, to: arguments.length > 1 ? to : fromOrTree } : { d: 0 });
        } else {
          var rv = new RangeSet2();
          if (fromOrTree && "d" in fromOrTree) {
            extend(rv, fromOrTree);
          }
          return rv;
        }
      };
      props(RangeSet2.prototype, (_a2 = {
        add: function(rangeSet) {
          mergeRanges2(this, rangeSet);
          return this;
        },
        addKey: function(key) {
          addRange(this, key, key);
          return this;
        },
        addKeys: function(keys2) {
          var _this = this;
          keys2.forEach(function(key) {
            return addRange(_this, key, key);
          });
          return this;
        },
        hasKey: function(key) {
          var node = getRangeSetIterator(this).next(key).value;
          return node && cmp2(node.from, key) <= 0 && cmp2(node.to, key) >= 0;
        }
      }, _a2[iteratorSymbol] = function() {
        return getRangeSetIterator(this);
      }, _a2));
      function addRange(target, from, to) {
        var diff = cmp2(from, to);
        if (isNaN(diff))
          return;
        if (diff > 0)
          throw RangeError();
        if (isEmptyRange(target))
          return extend(target, { from, to, d: 1 });
        var left = target.l;
        var right = target.r;
        if (cmp2(to, target.from) < 0) {
          left ? addRange(left, from, to) : target.l = { from, to, d: 1, l: null, r: null };
          return rebalance(target);
        }
        if (cmp2(from, target.to) > 0) {
          right ? addRange(right, from, to) : target.r = { from, to, d: 1, l: null, r: null };
          return rebalance(target);
        }
        if (cmp2(from, target.from) < 0) {
          target.from = from;
          target.l = null;
          target.d = right ? right.d + 1 : 1;
        }
        if (cmp2(to, target.to) > 0) {
          target.to = to;
          target.r = null;
          target.d = target.l ? target.l.d + 1 : 1;
        }
        var rightWasCutOff = !target.r;
        if (left && !target.l) {
          mergeRanges2(target, left);
        }
        if (right && rightWasCutOff) {
          mergeRanges2(target, right);
        }
      }
      function mergeRanges2(target, newSet) {
        function _addRangeSet(target2, _a3) {
          var from = _a3.from, to = _a3.to, l = _a3.l, r = _a3.r;
          addRange(target2, from, to);
          if (l)
            _addRangeSet(target2, l);
          if (r)
            _addRangeSet(target2, r);
        }
        if (!isEmptyRange(newSet))
          _addRangeSet(target, newSet);
      }
      function rangesOverlap2(rangeSet1, rangeSet2) {
        var i1 = getRangeSetIterator(rangeSet2);
        var nextResult1 = i1.next();
        if (nextResult1.done)
          return false;
        var a = nextResult1.value;
        var i2 = getRangeSetIterator(rangeSet1);
        var nextResult2 = i2.next(a.from);
        var b = nextResult2.value;
        while (!nextResult1.done && !nextResult2.done) {
          if (cmp2(b.from, a.to) <= 0 && cmp2(b.to, a.from) >= 0)
            return true;
          cmp2(a.from, b.from) < 0 ? a = (nextResult1 = i1.next(b.from)).value : b = (nextResult2 = i2.next(a.from)).value;
        }
        return false;
      }
      function getRangeSetIterator(node) {
        var state2 = isEmptyRange(node) ? null : { s: 0, n: node };
        return {
          next: function(key) {
            var keyProvided = arguments.length > 0;
            while (state2) {
              switch (state2.s) {
                case 0:
                  state2.s = 1;
                  if (keyProvided) {
                    while (state2.n.l && cmp2(key, state2.n.from) < 0)
                      state2 = { up: state2, n: state2.n.l, s: 1 };
                  } else {
                    while (state2.n.l)
                      state2 = { up: state2, n: state2.n.l, s: 1 };
                  }
                case 1:
                  state2.s = 2;
                  if (!keyProvided || cmp2(key, state2.n.to) <= 0)
                    return { value: state2.n, done: false };
                case 2:
                  if (state2.n.r) {
                    state2.s = 3;
                    state2 = { up: state2, n: state2.n.r, s: 0 };
                    continue;
                  }
                case 3:
                  state2 = state2.up;
              }
            }
            return { done: true };
          }
        };
      }
      function rebalance(target) {
        var _a3, _b;
        var diff = (((_a3 = target.r) === null || _a3 === void 0 ? void 0 : _a3.d) || 0) - (((_b = target.l) === null || _b === void 0 ? void 0 : _b.d) || 0);
        var r = diff > 1 ? "r" : diff < -1 ? "l" : "";
        if (r) {
          var l = r === "r" ? "l" : "r";
          var rootClone = __assign({}, target);
          var oldRootRight = target[r];
          target.from = oldRootRight.from;
          target.to = oldRootRight.to;
          target[r] = oldRootRight[r];
          rootClone[r] = oldRootRight[l];
          target[l] = rootClone;
          rootClone.d = computeDepth(rootClone);
        }
        target.d = computeDepth(target);
      }
      function computeDepth(_a3) {
        var r = _a3.r, l = _a3.l;
        return (r ? l ? Math.max(r.d, l.d) : r.d : l ? l.d : 0) + 1;
      }
      function extendObservabilitySet(target, newSet) {
        keys(newSet).forEach(function(part) {
          if (target[part])
            mergeRanges2(target[part], newSet[part]);
          else
            target[part] = cloneSimpleObjectTree(newSet[part]);
        });
        return target;
      }
      function obsSetsOverlap(os1, os2) {
        return os1.all || os2.all || Object.keys(os1).some(function(key) {
          return os2[key] && rangesOverlap2(os2[key], os1[key]);
        });
      }
      var cache = {};
      var unsignaledParts = {};
      var isTaskEnqueued = false;
      function signalSubscribersLazily(part, optimistic) {
        extendObservabilitySet(unsignaledParts, part);
        if (!isTaskEnqueued) {
          isTaskEnqueued = true;
          setTimeout(function() {
            isTaskEnqueued = false;
            var parts = unsignaledParts;
            unsignaledParts = {};
            signalSubscribersNow(parts, false);
          }, 0);
        }
      }
      function signalSubscribersNow(updatedParts, deleteAffectedCacheEntries) {
        if (deleteAffectedCacheEntries === void 0) {
          deleteAffectedCacheEntries = false;
        }
        var queriesToSignal = /* @__PURE__ */ new Set();
        if (updatedParts.all) {
          for (var _i = 0, _a3 = Object.values(cache); _i < _a3.length; _i++) {
            var tblCache = _a3[_i];
            collectTableSubscribers(tblCache, updatedParts, queriesToSignal, deleteAffectedCacheEntries);
          }
        } else {
          for (var key in updatedParts) {
            var parts = /^idb\:\/\/(.*)\/(.*)\//.exec(key);
            if (parts) {
              var dbName = parts[1], tableName = parts[2];
              var tblCache = cache["idb://".concat(dbName, "/").concat(tableName)];
              if (tblCache)
                collectTableSubscribers(tblCache, updatedParts, queriesToSignal, deleteAffectedCacheEntries);
            }
          }
        }
        queriesToSignal.forEach(function(requery) {
          return requery();
        });
      }
      function collectTableSubscribers(tblCache, updatedParts, outQueriesToSignal, deleteAffectedCacheEntries) {
        var updatedEntryLists = [];
        for (var _i = 0, _a3 = Object.entries(tblCache.queries.query); _i < _a3.length; _i++) {
          var _b = _a3[_i], indexName = _b[0], entries = _b[1];
          var filteredEntries = [];
          for (var _c = 0, entries_1 = entries; _c < entries_1.length; _c++) {
            var entry = entries_1[_c];
            if (obsSetsOverlap(updatedParts, entry.obsSet)) {
              entry.subscribers.forEach(function(requery) {
                return outQueriesToSignal.add(requery);
              });
            } else if (deleteAffectedCacheEntries) {
              filteredEntries.push(entry);
            }
          }
          if (deleteAffectedCacheEntries)
            updatedEntryLists.push([indexName, filteredEntries]);
        }
        if (deleteAffectedCacheEntries) {
          for (var _d = 0, updatedEntryLists_1 = updatedEntryLists; _d < updatedEntryLists_1.length; _d++) {
            var _e = updatedEntryLists_1[_d], indexName = _e[0], filteredEntries = _e[1];
            tblCache.queries.query[indexName] = filteredEntries;
          }
        }
      }
      function dexieOpen(db2) {
        var state2 = db2._state;
        var indexedDB2 = db2._deps.indexedDB;
        if (state2.isBeingOpened || db2.idbdb)
          return state2.dbReadyPromise.then(function() {
            return state2.dbOpenError ? rejection(state2.dbOpenError) : db2;
          });
        state2.isBeingOpened = true;
        state2.dbOpenError = null;
        state2.openComplete = false;
        var openCanceller = state2.openCanceller;
        var nativeVerToOpen = Math.round(db2.verno * 10);
        var schemaPatchMode = false;
        function throwIfCancelled() {
          if (state2.openCanceller !== openCanceller)
            throw new exceptions.DatabaseClosed("db.open() was cancelled");
        }
        var resolveDbReady = state2.dbReadyResolve, upgradeTransaction = null, wasCreated = false;
        var tryOpenDB = function() {
          return new DexiePromise(function(resolve, reject) {
            throwIfCancelled();
            if (!indexedDB2)
              throw new exceptions.MissingAPI();
            var dbName = db2.name;
            var req = state2.autoSchema || !nativeVerToOpen ? indexedDB2.open(dbName) : indexedDB2.open(dbName, nativeVerToOpen);
            if (!req)
              throw new exceptions.MissingAPI();
            req.onerror = eventRejectHandler(reject);
            req.onblocked = wrap(db2._fireOnBlocked);
            req.onupgradeneeded = wrap(function(e) {
              upgradeTransaction = req.transaction;
              if (state2.autoSchema && !db2._options.allowEmptyDB) {
                req.onerror = preventDefault;
                upgradeTransaction.abort();
                req.result.close();
                var delreq = indexedDB2.deleteDatabase(dbName);
                delreq.onsuccess = delreq.onerror = wrap(function() {
                  reject(new exceptions.NoSuchDatabase("Database ".concat(dbName, " doesnt exist")));
                });
              } else {
                upgradeTransaction.onerror = eventRejectHandler(reject);
                var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
                wasCreated = oldVer < 1;
                db2.idbdb = req.result;
                if (schemaPatchMode) {
                  patchCurrentVersion(db2, upgradeTransaction);
                }
                runUpgraders(db2, oldVer / 10, upgradeTransaction, reject);
              }
            }, reject);
            req.onsuccess = wrap(function() {
              upgradeTransaction = null;
              var idbdb = db2.idbdb = req.result;
              var objectStoreNames = slice(idbdb.objectStoreNames);
              if (objectStoreNames.length > 0)
                try {
                  var tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), "readonly");
                  if (state2.autoSchema)
                    readGlobalSchema(db2, idbdb, tmpTrans);
                  else {
                    adjustToExistingIndexNames(db2, db2._dbSchema, tmpTrans);
                    if (!verifyInstalledSchema(db2, tmpTrans) && !schemaPatchMode) {
                      console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this.");
                      idbdb.close();
                      nativeVerToOpen = idbdb.version + 1;
                      schemaPatchMode = true;
                      return resolve(tryOpenDB());
                    }
                  }
                  generateMiddlewareStacks(db2, tmpTrans);
                } catch (e) {
                }
              connections.push(db2);
              idbdb.onversionchange = wrap(function(ev) {
                state2.vcFired = true;
                db2.on("versionchange").fire(ev);
              });
              idbdb.onclose = wrap(function() {
                db2.close({ disableAutoOpen: false });
              });
              if (wasCreated)
                _onDatabaseCreated(db2._deps, dbName);
              resolve();
            }, reject);
          }).catch(function(err) {
            switch (err === null || err === void 0 ? void 0 : err.name) {
              case "UnknownError":
                if (state2.PR1398_maxLoop > 0) {
                  state2.PR1398_maxLoop--;
                  console.warn("Dexie: Workaround for Chrome UnknownError on open()");
                  return tryOpenDB();
                }
                break;
              case "VersionError":
                if (nativeVerToOpen > 0) {
                  nativeVerToOpen = 0;
                  return tryOpenDB();
                }
                break;
            }
            return DexiePromise.reject(err);
          });
        };
        return DexiePromise.race([
          openCanceller,
          (typeof navigator === "undefined" ? DexiePromise.resolve() : idbReady()).then(tryOpenDB)
        ]).then(function() {
          throwIfCancelled();
          state2.onReadyBeingFired = [];
          return DexiePromise.resolve(vip(function() {
            return db2.on.ready.fire(db2.vip);
          })).then(function fireRemainders() {
            if (state2.onReadyBeingFired.length > 0) {
              var remainders_1 = state2.onReadyBeingFired.reduce(promisableChain, nop);
              state2.onReadyBeingFired = [];
              return DexiePromise.resolve(vip(function() {
                return remainders_1(db2.vip);
              })).then(fireRemainders);
            }
          });
        }).finally(function() {
          if (state2.openCanceller === openCanceller) {
            state2.onReadyBeingFired = null;
            state2.isBeingOpened = false;
          }
        }).catch(function(err) {
          state2.dbOpenError = err;
          try {
            upgradeTransaction && upgradeTransaction.abort();
          } catch (_a3) {
          }
          if (openCanceller === state2.openCanceller) {
            db2._close();
          }
          return rejection(err);
        }).finally(function() {
          state2.openComplete = true;
          resolveDbReady();
        }).then(function() {
          if (wasCreated) {
            var everything_1 = {};
            db2.tables.forEach(function(table) {
              table.schema.indexes.forEach(function(idx) {
                if (idx.name)
                  everything_1["idb://".concat(db2.name, "/").concat(table.name, "/").concat(idx.name)] = new RangeSet2(-Infinity, [[[]]]);
              });
              everything_1["idb://".concat(db2.name, "/").concat(table.name, "/")] = everything_1["idb://".concat(db2.name, "/").concat(table.name, "/:dels")] = new RangeSet2(-Infinity, [[[]]]);
            });
            globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME).fire(everything_1);
            signalSubscribersNow(everything_1, true);
          }
          return db2;
        });
      }
      function awaitIterator(iterator) {
        var callNext = function(result) {
          return iterator.next(result);
        }, doThrow = function(error) {
          return iterator.throw(error);
        }, onSuccess = step(callNext), onError = step(doThrow);
        function step(getNext) {
          return function(val) {
            var next2 = getNext(val), value = next2.value;
            return next2.done ? value : !value || typeof value.then !== "function" ? isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) : value.then(onSuccess, onError);
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
        var tables = flatten2(args);
        return [mode, tables, scopeFunc];
      }
      function enterTransactionScope(db2, mode, storeNames, parentTransaction, scopeFunc) {
        return DexiePromise.resolve().then(function() {
          var transless = PSD.transless || PSD;
          var trans = db2._createTransaction(mode, storeNames, db2._dbSchema, parentTransaction);
          trans.explicit = true;
          var zoneProps = {
            trans,
            transless
          };
          if (parentTransaction) {
            trans.idbtrans = parentTransaction.idbtrans;
          } else {
            try {
              trans.create();
              trans.idbtrans._explicit = true;
              db2._state.PR1398_maxLoop = 3;
            } catch (ex) {
              if (ex.name === errnames.InvalidState && db2.isOpen() && --db2._state.PR1398_maxLoop > 0) {
                console.warn("Dexie: Need to reopen db");
                db2.close({ disableAutoOpen: false });
                return db2.open().then(function() {
                  return enterTransactionScope(db2, mode, storeNames, null, scopeFunc);
                });
              }
              return rejection(ex);
            }
          }
          var scopeFuncIsAsync = isAsyncFunction(scopeFunc);
          if (scopeFuncIsAsync) {
            incrementExpectedAwaits();
          }
          var returnValue;
          var promiseFollowed = DexiePromise.follow(function() {
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
          return (returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue).then(function(x) {
            return trans.active ? x : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
          }) : promiseFollowed.then(function() {
            return returnValue;
          })).then(function(x) {
            if (parentTransaction)
              trans._resolve();
            return trans._completion.then(function() {
              return x;
            });
          }).catch(function(e) {
            trans._reject(e);
            return rejection(e);
          });
        });
      }
      function pad2(a, value, count) {
        var result = isArray(a) ? a.slice() : [a];
        for (var i2 = 0; i2 < count; ++i2)
          result.push(value);
        return result;
      }
      function createVirtualIndexMiddleware(down) {
        return __assign(__assign({}, down), { table: function(tableName) {
          var table = down.table(tableName);
          var schema = table.schema;
          var indexLookup = {};
          var allVirtualIndexes = [];
          function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
            var keyPathAlias = getKeyPathAlias(keyPath);
            var indexList = indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || [];
            var keyLength = keyPath == null ? 0 : typeof keyPath === "string" ? 1 : keyPath.length;
            var isVirtual = keyTail > 0;
            var virtualIndex = __assign(__assign({}, lowLevelIndex), { name: isVirtual ? "".concat(keyPathAlias, "(virtual-from:").concat(lowLevelIndex.name, ")") : lowLevelIndex.name, lowLevelIndex, isVirtual, keyTail, keyLength, extractKey: getKeyExtractor(keyPath), unique: !isVirtual && lowLevelIndex.unique });
            indexList.push(virtualIndex);
            if (!virtualIndex.isPrimaryKey) {
              allVirtualIndexes.push(virtualIndex);
            }
            if (keyLength > 1) {
              var virtualKeyPath = keyLength === 2 ? keyPath[0] : keyPath.slice(0, keyLength - 1);
              addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
            }
            indexList.sort(function(a, b) {
              return a.keyTail - b.keyTail;
            });
            return virtualIndex;
          }
          var primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
          indexLookup[":id"] = [primaryKey];
          for (var _i = 0, _a3 = schema.indexes; _i < _a3.length; _i++) {
            var index = _a3[_i];
            addVirtualIndexes(index.keyPath, 0, index);
          }
          function findBestIndex(keyPath) {
            var result2 = indexLookup[getKeyPathAlias(keyPath)];
            return result2 && result2[0];
          }
          function translateRange(range, keyTail) {
            return {
              type: range.type === 1 ? 2 : range.type,
              lower: pad2(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
              lowerOpen: true,
              upper: pad2(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
              upperOpen: true
            };
          }
          function translateRequest(req) {
            var index2 = req.query.index;
            return index2.isVirtual ? __assign(__assign({}, req), { query: {
              index: index2.lowLevelIndex,
              range: translateRange(req.query.range, index2.keyTail)
            } }) : req;
          }
          var result = __assign(__assign({}, table), { schema: __assign(__assign({}, schema), { primaryKey, indexes: allVirtualIndexes, getIndexByKeyPath: findBestIndex }), count: function(req) {
            return table.count(translateRequest(req));
          }, query: function(req) {
            return table.query(translateRequest(req));
          }, openCursor: function(req) {
            var _a4 = req.query.index, keyTail = _a4.keyTail, isVirtual = _a4.isVirtual, keyLength = _a4.keyLength;
            if (!isVirtual)
              return table.openCursor(req);
            function createVirtualCursor(cursor) {
              function _continue(key) {
                key != null ? cursor.continue(pad2(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) : req.unique ? cursor.continue(cursor.key.slice(0, keyLength).concat(req.reverse ? down.MIN_KEY : down.MAX_KEY, keyTail)) : cursor.continue();
              }
              var virtualCursor = Object.create(cursor, {
                continue: { value: _continue },
                continuePrimaryKey: {
                  value: function(key, primaryKey2) {
                    cursor.continuePrimaryKey(pad2(key, down.MAX_KEY, keyTail), primaryKey2);
                  }
                },
                primaryKey: {
                  get: function() {
                    return cursor.primaryKey;
                  }
                },
                key: {
                  get: function() {
                    var key = cursor.key;
                    return keyLength === 1 ? key[0] : key.slice(0, keyLength);
                  }
                },
                value: {
                  get: function() {
                    return cursor.value;
                  }
                }
              });
              return virtualCursor;
            }
            return table.openCursor(translateRequest(req)).then(function(cursor) {
              return cursor && createVirtualCursor(cursor);
            });
          } });
          return result;
        } });
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
        keys(a).forEach(function(prop) {
          if (!hasOwn(b, prop)) {
            rv[prfx + prop] = void 0;
          } else {
            var ap = a[prop], bp = b[prop];
            if (typeof ap === "object" && typeof bp === "object" && ap && bp) {
              var apTypeName = toStringTag(ap);
              var bpTypeName = toStringTag(bp);
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
        keys(b).forEach(function(prop) {
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
        create: function(downCore) {
          return __assign(__assign({}, downCore), { table: function(tableName) {
            var downTable = downCore.table(tableName);
            var primaryKey = downTable.schema.primaryKey;
            var tableMiddleware = __assign(__assign({}, downTable), { mutate: function(req) {
              var dxTrans = PSD.trans;
              var _a3 = dxTrans.table(tableName).hook, deleting = _a3.deleting, creating = _a3.creating, updating = _a3.updating;
              switch (req.type) {
                case "add":
                  if (creating.fire === nop)
                    break;
                  return dxTrans._promise("readwrite", function() {
                    return addPutOrDelete(req);
                  }, true);
                case "put":
                  if (creating.fire === nop && updating.fire === nop)
                    break;
                  return dxTrans._promise("readwrite", function() {
                    return addPutOrDelete(req);
                  }, true);
                case "delete":
                  if (deleting.fire === nop)
                    break;
                  return dxTrans._promise("readwrite", function() {
                    return addPutOrDelete(req);
                  }, true);
                case "deleteRange":
                  if (deleting.fire === nop)
                    break;
                  return dxTrans._promise("readwrite", function() {
                    return deleteRange(req);
                  }, true);
              }
              return downTable.mutate(req);
              function addPutOrDelete(req2) {
                var dxTrans2 = PSD.trans;
                var keys2 = req2.keys || getEffectiveKeys(primaryKey, req2);
                if (!keys2)
                  throw new Error("Keys missing");
                req2 = req2.type === "add" || req2.type === "put" ? __assign(__assign({}, req2), { keys: keys2 }) : __assign({}, req2);
                if (req2.type !== "delete")
                  req2.values = __spreadArray([], req2.values, true);
                if (req2.keys)
                  req2.keys = __spreadArray([], req2.keys, true);
                return getExistingValues(downTable, req2, keys2).then(function(existingValues) {
                  var contexts = keys2.map(function(key, i2) {
                    var existingValue = existingValues[i2];
                    var ctx = { onerror: null, onsuccess: null };
                    if (req2.type === "delete") {
                      deleting.fire.call(ctx, key, existingValue, dxTrans2);
                    } else if (req2.type === "add" || existingValue === void 0) {
                      var generatedPrimaryKey = creating.fire.call(ctx, key, req2.values[i2], dxTrans2);
                      if (key == null && generatedPrimaryKey != null) {
                        key = generatedPrimaryKey;
                        req2.keys[i2] = key;
                        if (!primaryKey.outbound) {
                          setByKeyPath(req2.values[i2], primaryKey.keyPath, key);
                        }
                      }
                    } else {
                      var objectDiff = getObjectDiff(existingValue, req2.values[i2]);
                      var additionalChanges_1 = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans2);
                      if (additionalChanges_1) {
                        var requestedValue_1 = req2.values[i2];
                        Object.keys(additionalChanges_1).forEach(function(keyPath) {
                          if (hasOwn(requestedValue_1, keyPath)) {
                            requestedValue_1[keyPath] = additionalChanges_1[keyPath];
                          } else {
                            setByKeyPath(requestedValue_1, keyPath, additionalChanges_1[keyPath]);
                          }
                        });
                      }
                    }
                    return ctx;
                  });
                  return downTable.mutate(req2).then(function(_a4) {
                    var failures = _a4.failures, results = _a4.results, numFailures = _a4.numFailures, lastResult = _a4.lastResult;
                    for (var i2 = 0; i2 < keys2.length; ++i2) {
                      var primKey = results ? results[i2] : keys2[i2];
                      var ctx = contexts[i2];
                      if (primKey == null) {
                        ctx.onerror && ctx.onerror(failures[i2]);
                      } else {
                        ctx.onsuccess && ctx.onsuccess(
                          req2.type === "put" && existingValues[i2] ? req2.values[i2] : primKey
                        );
                      }
                    }
                    return { failures, results, numFailures, lastResult };
                  }).catch(function(error) {
                    contexts.forEach(function(ctx) {
                      return ctx.onerror && ctx.onerror(error);
                    });
                    return Promise.reject(error);
                  });
                });
              }
              function deleteRange(req2) {
                return deleteNextChunk(req2.trans, req2.range, 1e4);
              }
              function deleteNextChunk(trans, range, limit) {
                return downTable.query({ trans, values: false, query: { index: primaryKey, range }, limit }).then(function(_a4) {
                  var result = _a4.result;
                  return addPutOrDelete({ type: "delete", keys: result, trans }).then(function(res) {
                    if (res.numFailures > 0)
                      return Promise.reject(res.failures[0]);
                    if (result.length < limit) {
                      return { failures: [], numFailures: 0, lastResult: void 0 };
                    } else {
                      return deleteNextChunk(trans, __assign(__assign({}, range), { lower: result[result.length - 1], lowerOpen: true }), limit);
                    }
                  });
                });
              }
            } });
            return tableMiddleware;
          } });
        }
      };
      function getExistingValues(table, req, effectiveKeys) {
        return req.type === "add" ? Promise.resolve([]) : table.getMany({ trans: req.trans, keys: effectiveKeys, cache: "immutable" });
      }
      function getFromTransactionCache(keys2, cache2, clone) {
        try {
          if (!cache2)
            return null;
          if (cache2.keys.length < keys2.length)
            return null;
          var result = [];
          for (var i2 = 0, j = 0; i2 < cache2.keys.length && j < keys2.length; ++i2) {
            if (cmp2(cache2.keys[i2], keys2[j]) !== 0)
              continue;
            result.push(clone ? deepClone(cache2.values[i2]) : cache2.values[i2]);
            ++j;
          }
          return result.length === keys2.length ? result : null;
        } catch (_a3) {
          return null;
        }
      }
      var cacheExistingValuesMiddleware = {
        stack: "dbcore",
        level: -1,
        create: function(core) {
          return {
            table: function(tableName) {
              var table = core.table(tableName);
              return __assign(__assign({}, table), { getMany: function(req) {
                if (!req.cache) {
                  return table.getMany(req);
                }
                var cachedResult = getFromTransactionCache(req.keys, req.trans["_cache"], req.cache === "clone");
                if (cachedResult) {
                  return DexiePromise.resolve(cachedResult);
                }
                return table.getMany(req).then(function(res) {
                  req.trans["_cache"] = {
                    keys: req.keys,
                    values: req.cache === "clone" ? deepClone(res) : res
                  };
                  return res;
                });
              }, mutate: function(req) {
                if (req.type !== "add")
                  req.trans["_cache"] = null;
                return table.mutate(req);
              } });
            }
          };
        }
      };
      function isCachableContext(ctx, table) {
        return ctx.trans.mode === "readonly" && !!ctx.subscr && !ctx.trans.explicit && ctx.trans.db._options.cache !== "disabled" && !table.schema.primaryKey.outbound;
      }
      function isCachableRequest(type2, req) {
        switch (type2) {
          case "query":
            return req.values && !req.unique;
          case "get":
            return false;
          case "getMany":
            return false;
          case "count":
            return false;
          case "openCursor":
            return false;
        }
      }
      var observabilityMiddleware = {
        stack: "dbcore",
        level: 0,
        name: "Observability",
        create: function(core) {
          var dbName = core.schema.name;
          var FULL_RANGE = new RangeSet2(core.MIN_KEY, core.MAX_KEY);
          return __assign(__assign({}, core), { transaction: function(stores, mode, options) {
            if (PSD.subscr && mode !== "readonly") {
              throw new exceptions.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(PSD.querier));
            }
            return core.transaction(stores, mode, options);
          }, table: function(tableName) {
            var table = core.table(tableName);
            var schema = table.schema;
            var primaryKey = schema.primaryKey, indexes = schema.indexes;
            var extractKey = primaryKey.extractKey, outbound = primaryKey.outbound;
            var indexesWithAutoIncPK = primaryKey.autoIncrement && indexes.filter(function(index) {
              return index.compound && index.keyPath.includes(primaryKey.keyPath);
            });
            var tableClone = __assign(__assign({}, table), { mutate: function(req) {
              var _a3, _b;
              var trans = req.trans;
              var mutatedParts = req.mutatedParts || (req.mutatedParts = {});
              var getRangeSet = function(indexName) {
                var part = "idb://".concat(dbName, "/").concat(tableName, "/").concat(indexName);
                return mutatedParts[part] || (mutatedParts[part] = new RangeSet2());
              };
              var pkRangeSet = getRangeSet("");
              var delsRangeSet = getRangeSet(":dels");
              var type2 = req.type;
              var _c = req.type === "deleteRange" ? [req.range] : req.type === "delete" ? [req.keys] : req.values.length < 50 ? [getEffectiveKeys(primaryKey, req).filter(function(id) {
                return id;
              }), req.values] : [], keys2 = _c[0], newObjs = _c[1];
              var oldCache = req.trans["_cache"];
              if (isArray(keys2)) {
                pkRangeSet.addKeys(keys2);
                var oldObjs = type2 === "delete" || keys2.length === newObjs.length ? getFromTransactionCache(keys2, oldCache) : null;
                if (!oldObjs) {
                  delsRangeSet.addKeys(keys2);
                }
                if (oldObjs || newObjs) {
                  trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs);
                }
              } else if (keys2) {
                var range = {
                  from: (_a3 = keys2.lower) !== null && _a3 !== void 0 ? _a3 : core.MIN_KEY,
                  to: (_b = keys2.upper) !== null && _b !== void 0 ? _b : core.MAX_KEY
                };
                delsRangeSet.add(range);
                pkRangeSet.add(range);
              } else {
                pkRangeSet.add(FULL_RANGE);
                delsRangeSet.add(FULL_RANGE);
                schema.indexes.forEach(function(idx) {
                  return getRangeSet(idx.name).add(FULL_RANGE);
                });
              }
              return table.mutate(req).then(function(res) {
                if (keys2 && (req.type === "add" || req.type === "put")) {
                  pkRangeSet.addKeys(res.results);
                  if (indexesWithAutoIncPK) {
                    indexesWithAutoIncPK.forEach(function(idx) {
                      var idxVals = req.values.map(function(v) {
                        return idx.extractKey(v);
                      });
                      var pkPos = idx.keyPath.findIndex(function(prop) {
                        return prop === primaryKey.keyPath;
                      });
                      for (var i2 = 0, len = res.results.length; i2 < len; ++i2) {
                        idxVals[i2][pkPos] = res.results[i2];
                      }
                      getRangeSet(idx.name).addKeys(idxVals);
                    });
                  }
                }
                trans.mutatedParts = extendObservabilitySet(trans.mutatedParts || {}, mutatedParts);
                return res;
              });
            } });
            var getRange = function(_a3) {
              var _b, _c;
              var _d = _a3.query, index = _d.index, range = _d.range;
              return [
                index,
                new RangeSet2((_b = range.lower) !== null && _b !== void 0 ? _b : core.MIN_KEY, (_c = range.upper) !== null && _c !== void 0 ? _c : core.MAX_KEY)
              ];
            };
            var readSubscribers = {
              get: function(req) {
                return [primaryKey, new RangeSet2(req.key)];
              },
              getMany: function(req) {
                return [primaryKey, new RangeSet2().addKeys(req.keys)];
              },
              count: getRange,
              query: getRange,
              openCursor: getRange
            };
            keys(readSubscribers).forEach(function(method) {
              tableClone[method] = function(req) {
                var subscr = PSD.subscr;
                var isLiveQuery = !!subscr;
                var cachable = isCachableContext(PSD, table) && isCachableRequest(method, req);
                var obsSet = cachable ? req.obsSet = {} : subscr;
                if (isLiveQuery) {
                  var getRangeSet = function(indexName) {
                    var part = "idb://".concat(dbName, "/").concat(tableName, "/").concat(indexName);
                    return obsSet[part] || (obsSet[part] = new RangeSet2());
                  };
                  var pkRangeSet_1 = getRangeSet("");
                  var delsRangeSet_1 = getRangeSet(":dels");
                  var _a3 = readSubscribers[method](req), queriedIndex = _a3[0], queriedRanges = _a3[1];
                  if (method === "query" && queriedIndex.isPrimaryKey && !req.values) {
                    delsRangeSet_1.add(queriedRanges);
                  } else {
                    getRangeSet(queriedIndex.name || "").add(queriedRanges);
                  }
                  if (!queriedIndex.isPrimaryKey) {
                    if (method === "count") {
                      delsRangeSet_1.add(FULL_RANGE);
                    } else {
                      var keysPromise_1 = method === "query" && outbound && req.values && table.query(__assign(__assign({}, req), { values: false }));
                      return table[method].apply(this, arguments).then(function(res) {
                        if (method === "query") {
                          if (outbound && req.values) {
                            return keysPromise_1.then(function(_a4) {
                              var resultingKeys = _a4.result;
                              pkRangeSet_1.addKeys(resultingKeys);
                              return res;
                            });
                          }
                          var pKeys = req.values ? res.result.map(extractKey) : res.result;
                          if (req.values) {
                            pkRangeSet_1.addKeys(pKeys);
                          } else {
                            delsRangeSet_1.addKeys(pKeys);
                          }
                        } else if (method === "openCursor") {
                          var cursor_1 = res;
                          var wantValues_1 = req.values;
                          return cursor_1 && Object.create(cursor_1, {
                            key: {
                              get: function() {
                                delsRangeSet_1.addKey(cursor_1.primaryKey);
                                return cursor_1.key;
                              }
                            },
                            primaryKey: {
                              get: function() {
                                var pkey = cursor_1.primaryKey;
                                delsRangeSet_1.addKey(pkey);
                                return pkey;
                              }
                            },
                            value: {
                              get: function() {
                                wantValues_1 && pkRangeSet_1.addKey(cursor_1.primaryKey);
                                return cursor_1.value;
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
          } });
        }
      };
      function trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs) {
        function addAffectedIndex(ix) {
          var rangeSet = getRangeSet(ix.name || "");
          function extractKey(obj) {
            return obj != null ? ix.extractKey(obj) : null;
          }
          var addKeyOrKeys = function(key) {
            return ix.multiEntry && isArray(key) ? key.forEach(function(key2) {
              return rangeSet.addKey(key2);
            }) : rangeSet.addKey(key);
          };
          (oldObjs || newObjs).forEach(function(_, i2) {
            var oldKey = oldObjs && extractKey(oldObjs[i2]);
            var newKey = newObjs && extractKey(newObjs[i2]);
            if (cmp2(oldKey, newKey) !== 0) {
              if (oldKey != null)
                addKeyOrKeys(oldKey);
              if (newKey != null)
                addKeyOrKeys(newKey);
            }
          });
        }
        schema.indexes.forEach(addAffectedIndex);
      }
      function adjustOptimisticFromFailures(tblCache, req, res) {
        if (res.numFailures === 0)
          return req;
        if (req.type === "deleteRange") {
          return null;
        }
        var numBulkOps = req.keys ? req.keys.length : "values" in req && req.values ? req.values.length : 1;
        if (res.numFailures === numBulkOps) {
          return null;
        }
        var clone = __assign({}, req);
        if (isArray(clone.keys)) {
          clone.keys = clone.keys.filter(function(_, i2) {
            return !(i2 in res.failures);
          });
        }
        if ("values" in clone && isArray(clone.values)) {
          clone.values = clone.values.filter(function(_, i2) {
            return !(i2 in res.failures);
          });
        }
        return clone;
      }
      function isAboveLower(key, range) {
        return range.lower === void 0 ? true : range.lowerOpen ? cmp2(key, range.lower) > 0 : cmp2(key, range.lower) >= 0;
      }
      function isBelowUpper(key, range) {
        return range.upper === void 0 ? true : range.upperOpen ? cmp2(key, range.upper) < 0 : cmp2(key, range.upper) <= 0;
      }
      function isWithinRange(key, range) {
        return isAboveLower(key, range) && isBelowUpper(key, range);
      }
      function applyOptimisticOps(result, req, ops, table, cacheEntry, immutable) {
        if (!ops || ops.length === 0)
          return result;
        var index = req.query.index;
        var multiEntry = index.multiEntry;
        var queryRange = req.query.range;
        var primaryKey = table.schema.primaryKey;
        var extractPrimKey = primaryKey.extractKey;
        var extractIndex = index.extractKey;
        var extractLowLevelIndex = (index.lowLevelIndex || index).extractKey;
        var finalResult = ops.reduce(function(result2, op) {
          var modifedResult = result2;
          var includedValues = [];
          if (op.type === "add" || op.type === "put") {
            var includedPKs = new RangeSet2();
            for (var i2 = op.values.length - 1; i2 >= 0; --i2) {
              var value = op.values[i2];
              var pk = extractPrimKey(value);
              if (includedPKs.hasKey(pk))
                continue;
              var key = extractIndex(value);
              if (multiEntry && isArray(key) ? key.some(function(k) {
                return isWithinRange(k, queryRange);
              }) : isWithinRange(key, queryRange)) {
                includedPKs.addKey(pk);
                includedValues.push(value);
              }
            }
          }
          switch (op.type) {
            case "add": {
              var existingKeys_1 = new RangeSet2().addKeys(req.values ? result2.map(function(v) {
                return extractPrimKey(v);
              }) : result2);
              modifedResult = result2.concat(req.values ? includedValues.filter(function(v) {
                var key2 = extractPrimKey(v);
                if (existingKeys_1.hasKey(key2))
                  return false;
                existingKeys_1.addKey(key2);
                return true;
              }) : includedValues.map(function(v) {
                return extractPrimKey(v);
              }).filter(function(k) {
                if (existingKeys_1.hasKey(k))
                  return false;
                existingKeys_1.addKey(k);
                return true;
              }));
              break;
            }
            case "put": {
              var keySet_1 = new RangeSet2().addKeys(op.values.map(function(v) {
                return extractPrimKey(v);
              }));
              modifedResult = result2.filter(
                function(item) {
                  return !keySet_1.hasKey(req.values ? extractPrimKey(item) : item);
                }
              ).concat(
                req.values ? includedValues : includedValues.map(function(v) {
                  return extractPrimKey(v);
                })
              );
              break;
            }
            case "delete":
              var keysToDelete_1 = new RangeSet2().addKeys(op.keys);
              modifedResult = result2.filter(function(item) {
                return !keysToDelete_1.hasKey(req.values ? extractPrimKey(item) : item);
              });
              break;
            case "deleteRange":
              var range_1 = op.range;
              modifedResult = result2.filter(function(item) {
                return !isWithinRange(extractPrimKey(item), range_1);
              });
              break;
          }
          return modifedResult;
        }, result);
        if (finalResult === result)
          return result;
        finalResult.sort(function(a, b) {
          return cmp2(extractLowLevelIndex(a), extractLowLevelIndex(b)) || cmp2(extractPrimKey(a), extractPrimKey(b));
        });
        if (req.limit && req.limit < Infinity) {
          if (finalResult.length > req.limit) {
            finalResult.length = req.limit;
          } else if (result.length === req.limit && finalResult.length < req.limit) {
            cacheEntry.dirty = true;
          }
        }
        return immutable ? Object.freeze(finalResult) : finalResult;
      }
      function areRangesEqual(r1, r2) {
        return cmp2(r1.lower, r2.lower) === 0 && cmp2(r1.upper, r2.upper) === 0 && !!r1.lowerOpen === !!r2.lowerOpen && !!r1.upperOpen === !!r2.upperOpen;
      }
      function compareLowers(lower1, lower2, lowerOpen1, lowerOpen2) {
        if (lower1 === void 0)
          return lower2 !== void 0 ? -1 : 0;
        if (lower2 === void 0)
          return 1;
        var c = cmp2(lower1, lower2);
        if (c === 0) {
          if (lowerOpen1 && lowerOpen2)
            return 0;
          if (lowerOpen1)
            return 1;
          if (lowerOpen2)
            return -1;
        }
        return c;
      }
      function compareUppers(upper1, upper2, upperOpen1, upperOpen2) {
        if (upper1 === void 0)
          return upper2 !== void 0 ? 1 : 0;
        if (upper2 === void 0)
          return -1;
        var c = cmp2(upper1, upper2);
        if (c === 0) {
          if (upperOpen1 && upperOpen2)
            return 0;
          if (upperOpen1)
            return -1;
          if (upperOpen2)
            return 1;
        }
        return c;
      }
      function isSuperRange(r1, r2) {
        return compareLowers(r1.lower, r2.lower, r1.lowerOpen, r2.lowerOpen) <= 0 && compareUppers(r1.upper, r2.upper, r1.upperOpen, r2.upperOpen) >= 0;
      }
      function findCompatibleQuery(dbName, tableName, type2, req) {
        var tblCache = cache["idb://".concat(dbName, "/").concat(tableName)];
        if (!tblCache)
          return [];
        var queries = tblCache.queries[type2];
        if (!queries)
          return [null, false, tblCache, null];
        var indexName = req.query ? req.query.index.name : null;
        var entries = queries[indexName || ""];
        if (!entries)
          return [null, false, tblCache, null];
        switch (type2) {
          case "query":
            var equalEntry = entries.find(function(entry) {
              return entry.req.limit === req.limit && entry.req.values === req.values && areRangesEqual(entry.req.query.range, req.query.range);
            });
            if (equalEntry)
              return [
                equalEntry,
                true,
                tblCache,
                entries
              ];
            var superEntry = entries.find(function(entry) {
              var limit = "limit" in entry.req ? entry.req.limit : Infinity;
              return limit >= req.limit && (req.values ? entry.req.values : true) && isSuperRange(entry.req.query.range, req.query.range);
            });
            return [superEntry, false, tblCache, entries];
          case "count":
            var countQuery = entries.find(function(entry) {
              return areRangesEqual(entry.req.query.range, req.query.range);
            });
            return [countQuery, !!countQuery, tblCache, entries];
        }
      }
      function subscribeToCacheEntry(cacheEntry, container, requery, signal) {
        cacheEntry.subscribers.add(requery);
        signal.addEventListener("abort", function() {
          cacheEntry.subscribers.delete(requery);
          if (cacheEntry.subscribers.size === 0) {
            enqueForDeletion(cacheEntry, container);
          }
        });
      }
      function enqueForDeletion(cacheEntry, container) {
        setTimeout(function() {
          if (cacheEntry.subscribers.size === 0) {
            delArrayItem(container, cacheEntry);
          }
        }, 3e3);
      }
      var cacheMiddleware = {
        stack: "dbcore",
        level: 0,
        name: "Cache",
        create: function(core) {
          var dbName = core.schema.name;
          var coreMW = __assign(__assign({}, core), { transaction: function(stores, mode, options) {
            var idbtrans = core.transaction(stores, mode, options);
            if (mode === "readwrite") {
              var ac_1 = new AbortController();
              var signal = ac_1.signal;
              var endTransaction = function(wasCommitted) {
                return function() {
                  ac_1.abort();
                  if (mode === "readwrite") {
                    var affectedSubscribers_1 = /* @__PURE__ */ new Set();
                    for (var _i = 0, stores_1 = stores; _i < stores_1.length; _i++) {
                      var storeName = stores_1[_i];
                      var tblCache = cache["idb://".concat(dbName, "/").concat(storeName)];
                      if (tblCache) {
                        var table = core.table(storeName);
                        var ops = tblCache.optimisticOps.filter(function(op) {
                          return op.trans === idbtrans;
                        });
                        if (idbtrans._explicit && wasCommitted && idbtrans.mutatedParts) {
                          for (var _a3 = 0, _b = Object.values(tblCache.queries.query); _a3 < _b.length; _a3++) {
                            var entries = _b[_a3];
                            for (var _c = 0, _d = entries.slice(); _c < _d.length; _c++) {
                              var entry = _d[_c];
                              if (obsSetsOverlap(entry.obsSet, idbtrans.mutatedParts)) {
                                delArrayItem(entries, entry);
                                entry.subscribers.forEach(function(requery) {
                                  return affectedSubscribers_1.add(requery);
                                });
                              }
                            }
                          }
                        } else if (ops.length > 0) {
                          tblCache.optimisticOps = tblCache.optimisticOps.filter(function(op) {
                            return op.trans !== idbtrans;
                          });
                          for (var _e = 0, _f = Object.values(tblCache.queries.query); _e < _f.length; _e++) {
                            var entries = _f[_e];
                            for (var _g = 0, _h = entries.slice(); _g < _h.length; _g++) {
                              var entry = _h[_g];
                              if (entry.res != null && idbtrans.mutatedParts) {
                                if (wasCommitted && !entry.dirty) {
                                  var freezeResults = Object.isFrozen(entry.res);
                                  var modRes = applyOptimisticOps(entry.res, entry.req, ops, table, entry, freezeResults);
                                  if (entry.dirty) {
                                    delArrayItem(entries, entry);
                                    entry.subscribers.forEach(function(requery) {
                                      return affectedSubscribers_1.add(requery);
                                    });
                                  } else if (modRes !== entry.res) {
                                    entry.res = modRes;
                                    entry.promise = DexiePromise.resolve({ result: modRes });
                                  }
                                } else {
                                  if (entry.dirty) {
                                    delArrayItem(entries, entry);
                                  }
                                  entry.subscribers.forEach(function(requery) {
                                    return affectedSubscribers_1.add(requery);
                                  });
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    affectedSubscribers_1.forEach(function(requery) {
                      return requery();
                    });
                  }
                };
              };
              idbtrans.addEventListener("abort", endTransaction(false), {
                signal
              });
              idbtrans.addEventListener("error", endTransaction(false), {
                signal
              });
              idbtrans.addEventListener("complete", endTransaction(true), {
                signal
              });
            }
            return idbtrans;
          }, table: function(tableName) {
            var downTable = core.table(tableName);
            var primKey = downTable.schema.primaryKey;
            var tableMW = __assign(__assign({}, downTable), { mutate: function(req) {
              var trans = PSD.trans;
              if (primKey.outbound || trans.db._options.cache === "disabled" || trans.explicit || trans.idbtrans.mode !== "readwrite") {
                return downTable.mutate(req);
              }
              var tblCache = cache["idb://".concat(dbName, "/").concat(tableName)];
              if (!tblCache)
                return downTable.mutate(req);
              var promise = downTable.mutate(req);
              if ((req.type === "add" || req.type === "put") && (req.values.length >= 50 || getEffectiveKeys(primKey, req).some(function(key) {
                return key == null;
              }))) {
                promise.then(function(res) {
                  var reqWithResolvedKeys = __assign(__assign({}, req), { values: req.values.map(function(value, i2) {
                    var _a3;
                    if (res.failures[i2])
                      return value;
                    var valueWithKey = ((_a3 = primKey.keyPath) === null || _a3 === void 0 ? void 0 : _a3.includes(".")) ? deepClone(value) : __assign({}, value);
                    setByKeyPath(valueWithKey, primKey.keyPath, res.results[i2]);
                    return valueWithKey;
                  }) });
                  var adjustedReq = adjustOptimisticFromFailures(tblCache, reqWithResolvedKeys, res);
                  tblCache.optimisticOps.push(adjustedReq);
                  queueMicrotask(function() {
                    return req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                  });
                });
              } else {
                tblCache.optimisticOps.push(req);
                req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                promise.then(function(res) {
                  if (res.numFailures > 0) {
                    delArrayItem(tblCache.optimisticOps, req);
                    var adjustedReq = adjustOptimisticFromFailures(tblCache, req, res);
                    if (adjustedReq) {
                      tblCache.optimisticOps.push(adjustedReq);
                    }
                    req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                  }
                });
                promise.catch(function() {
                  delArrayItem(tblCache.optimisticOps, req);
                  req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                });
              }
              return promise;
            }, query: function(req) {
              var _a3;
              if (!isCachableContext(PSD, downTable) || !isCachableRequest("query", req))
                return downTable.query(req);
              var freezeResults = ((_a3 = PSD.trans) === null || _a3 === void 0 ? void 0 : _a3.db._options.cache) === "immutable";
              var _b = PSD, requery = _b.requery, signal = _b.signal;
              var _c = findCompatibleQuery(dbName, tableName, "query", req), cacheEntry = _c[0], exactMatch = _c[1], tblCache = _c[2], container = _c[3];
              if (cacheEntry && exactMatch) {
                cacheEntry.obsSet = req.obsSet;
              } else {
                var promise = downTable.query(req).then(function(res) {
                  var result = res.result;
                  if (cacheEntry)
                    cacheEntry.res = result;
                  if (freezeResults) {
                    for (var i2 = 0, l = result.length; i2 < l; ++i2) {
                      Object.freeze(result[i2]);
                    }
                    Object.freeze(result);
                  } else {
                    res.result = deepClone(result);
                  }
                  return res;
                }).catch(function(error) {
                  if (container && cacheEntry)
                    delArrayItem(container, cacheEntry);
                  return Promise.reject(error);
                });
                cacheEntry = {
                  obsSet: req.obsSet,
                  promise,
                  subscribers: /* @__PURE__ */ new Set(),
                  type: "query",
                  req,
                  dirty: false
                };
                if (container) {
                  container.push(cacheEntry);
                } else {
                  container = [cacheEntry];
                  if (!tblCache) {
                    tblCache = cache["idb://".concat(dbName, "/").concat(tableName)] = {
                      queries: {
                        query: {},
                        count: {}
                      },
                      objs: /* @__PURE__ */ new Map(),
                      optimisticOps: [],
                      unsignaledParts: {}
                    };
                  }
                  tblCache.queries.query[req.query.index.name || ""] = container;
                }
              }
              subscribeToCacheEntry(cacheEntry, container, requery, signal);
              return cacheEntry.promise.then(function(res) {
                return {
                  result: applyOptimisticOps(res.result, req, tblCache === null || tblCache === void 0 ? void 0 : tblCache.optimisticOps, downTable, cacheEntry, freezeResults)
                };
              });
            } });
            return tableMW;
          } });
          return coreMW;
        }
      };
      function vipify(target, vipDb) {
        return new Proxy(target, {
          get: function(target2, prop, receiver) {
            if (prop === "db")
              return vipDb;
            return Reflect.get(target2, prop, receiver);
          }
        });
      }
      var Dexie$1 = (function() {
        function Dexie3(name, options) {
          var _this = this;
          this._middlewares = {};
          this.verno = 0;
          var deps = Dexie3.dependencies;
          this._options = options = __assign({
            addons: Dexie3.addons,
            autoOpen: true,
            indexedDB: deps.indexedDB,
            IDBKeyRange: deps.IDBKeyRange,
            cache: "cloned"
          }, options);
          this._deps = {
            indexedDB: options.indexedDB,
            IDBKeyRange: options.IDBKeyRange
          };
          var addons = options.addons;
          this._dbSchema = {};
          this._versions = [];
          this._storeNames = [];
          this._allTables = {};
          this.idbdb = null;
          this._novip = this;
          var state2 = {
            dbOpenError: null,
            isBeingOpened: false,
            onReadyBeingFired: null,
            openComplete: false,
            dbReadyResolve: nop,
            dbReadyPromise: null,
            cancelOpen: nop,
            openCanceller: null,
            autoSchema: true,
            PR1398_maxLoop: 3,
            autoOpen: options.autoOpen
          };
          state2.dbReadyPromise = new DexiePromise(function(resolve) {
            state2.dbReadyResolve = resolve;
          });
          state2.openCanceller = new DexiePromise(function(_, reject) {
            state2.cancelOpen = reject;
          });
          this._state = state2;
          this.name = name;
          this.on = Events(this, "populate", "blocked", "versionchange", "close", { ready: [promisableChain, nop] });
          this.once = function(event, callback) {
            var fn = function() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
              }
              _this.on(event).unsubscribe(fn);
              callback.apply(_this, args);
            };
            return _this.on(event, fn);
          };
          this.on.ready.subscribe = override(this.on.ready.subscribe, function(subscribe) {
            return function(subscriber, bSticky) {
              Dexie3.vip(function() {
                var state3 = _this._state;
                if (state3.openComplete) {
                  if (!state3.dbOpenError)
                    DexiePromise.resolve().then(subscriber);
                  if (bSticky)
                    subscribe(subscriber);
                } else if (state3.onReadyBeingFired) {
                  state3.onReadyBeingFired.push(subscriber);
                  if (bSticky)
                    subscribe(subscriber);
                } else {
                  subscribe(subscriber);
                  var db_1 = _this;
                  if (!bSticky)
                    subscribe(function unsubscribe() {
                      db_1.on.ready.unsubscribe(subscriber);
                      db_1.on.ready.unsubscribe(unsubscribe);
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
          this.on("versionchange", function(ev) {
            if (ev.newVersion > 0)
              console.warn("Another connection wants to upgrade database '".concat(_this.name, "'. Closing db now to resume the upgrade."));
            else
              console.warn("Another connection wants to delete database '".concat(_this.name, "'. Closing db now to resume the delete request."));
            _this.close({ disableAutoOpen: false });
          });
          this.on("blocked", function(ev) {
            if (!ev.newVersion || ev.newVersion < ev.oldVersion)
              console.warn("Dexie.delete('".concat(_this.name, "') was blocked"));
            else
              console.warn("Upgrade '".concat(_this.name, "' blocked by other connection holding version ").concat(ev.oldVersion / 10));
          });
          this._maxKey = getMaxKey(options.IDBKeyRange);
          this._createTransaction = function(mode, storeNames, dbschema, parentTransaction) {
            return new _this.Transaction(mode, storeNames, dbschema, _this._options.chromeTransactionDurability, parentTransaction);
          };
          this._fireOnBlocked = function(ev) {
            _this.on("blocked").fire(ev);
            connections.filter(function(c) {
              return c.name === _this.name && c !== _this && !c._state.vcFired;
            }).map(function(c) {
              return c.on("versionchange").fire(ev);
            });
          };
          this.use(cacheExistingValuesMiddleware);
          this.use(cacheMiddleware);
          this.use(observabilityMiddleware);
          this.use(virtualIndexMiddleware);
          this.use(hooksMiddleware);
          var vipDB = new Proxy(this, {
            get: function(_, prop, receiver) {
              if (prop === "_vip")
                return true;
              if (prop === "table")
                return function(tableName) {
                  return vipify(_this.table(tableName), vipDB);
                };
              var rv = Reflect.get(_, prop, receiver);
              if (rv instanceof Table)
                return vipify(rv, vipDB);
              if (prop === "tables")
                return rv.map(function(t) {
                  return vipify(t, vipDB);
                });
              if (prop === "_createTransaction")
                return function() {
                  var tx = rv.apply(this, arguments);
                  return vipify(tx, vipDB);
                };
              return rv;
            }
          });
          this.vip = vipDB;
          addons.forEach(function(addon) {
            return addon(_this);
          });
        }
        Dexie3.prototype.version = function(versionNumber) {
          if (isNaN(versionNumber) || versionNumber < 0.1)
            throw new exceptions.Type("Given version is not a positive number");
          versionNumber = Math.round(versionNumber * 10) / 10;
          if (this.idbdb || this._state.isBeingOpened)
            throw new exceptions.Schema("Cannot add version when database is open");
          this.verno = Math.max(this.verno, versionNumber);
          var versions = this._versions;
          var versionInstance = versions.filter(function(v) {
            return v._cfg.version === versionNumber;
          })[0];
          if (versionInstance)
            return versionInstance;
          versionInstance = new this.Version(versionNumber);
          versions.push(versionInstance);
          versions.sort(lowerVersionFirst);
          versionInstance.stores({});
          this._state.autoSchema = false;
          return versionInstance;
        };
        Dexie3.prototype._whenReady = function(fn) {
          var _this = this;
          return this.idbdb && (this._state.openComplete || PSD.letThrough || this._vip) ? fn() : new DexiePromise(function(resolve, reject) {
            if (_this._state.openComplete) {
              return reject(new exceptions.DatabaseClosed(_this._state.dbOpenError));
            }
            if (!_this._state.isBeingOpened) {
              if (!_this._state.autoOpen) {
                reject(new exceptions.DatabaseClosed());
                return;
              }
              _this.open().catch(nop);
            }
            _this._state.dbReadyPromise.then(resolve, reject);
          }).then(fn);
        };
        Dexie3.prototype.use = function(_a3) {
          var stack = _a3.stack, create = _a3.create, level = _a3.level, name = _a3.name;
          if (name)
            this.unuse({ stack, name });
          var middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
          middlewares.push({ stack, create, level: level == null ? 10 : level, name });
          middlewares.sort(function(a, b) {
            return a.level - b.level;
          });
          return this;
        };
        Dexie3.prototype.unuse = function(_a3) {
          var stack = _a3.stack, name = _a3.name, create = _a3.create;
          if (stack && this._middlewares[stack]) {
            this._middlewares[stack] = this._middlewares[stack].filter(function(mw) {
              return create ? mw.create !== create : name ? mw.name !== name : false;
            });
          }
          return this;
        };
        Dexie3.prototype.open = function() {
          var _this = this;
          return usePSD(
            globalPSD,
            function() {
              return dexieOpen(_this);
            }
          );
        };
        Dexie3.prototype._close = function() {
          this.on.close.fire(new CustomEvent("close"));
          var state2 = this._state;
          var idx = connections.indexOf(this);
          if (idx >= 0)
            connections.splice(idx, 1);
          if (this.idbdb) {
            try {
              this.idbdb.close();
            } catch (e) {
            }
            this.idbdb = null;
          }
          if (!state2.isBeingOpened) {
            state2.dbReadyPromise = new DexiePromise(function(resolve) {
              state2.dbReadyResolve = resolve;
            });
            state2.openCanceller = new DexiePromise(function(_, reject) {
              state2.cancelOpen = reject;
            });
          }
        };
        Dexie3.prototype.close = function(_a3) {
          var _b = _a3 === void 0 ? { disableAutoOpen: true } : _a3, disableAutoOpen = _b.disableAutoOpen;
          var state2 = this._state;
          if (disableAutoOpen) {
            if (state2.isBeingOpened) {
              state2.cancelOpen(new exceptions.DatabaseClosed());
            }
            this._close();
            state2.autoOpen = false;
            state2.dbOpenError = new exceptions.DatabaseClosed();
          } else {
            this._close();
            state2.autoOpen = this._options.autoOpen || state2.isBeingOpened;
            state2.openComplete = false;
            state2.dbOpenError = null;
          }
        };
        Dexie3.prototype.delete = function(closeOptions) {
          var _this = this;
          if (closeOptions === void 0) {
            closeOptions = { disableAutoOpen: true };
          }
          var hasInvalidArguments = arguments.length > 0 && typeof arguments[0] !== "object";
          var state2 = this._state;
          return new DexiePromise(function(resolve, reject) {
            var doDelete = function() {
              _this.close(closeOptions);
              var req = _this._deps.indexedDB.deleteDatabase(_this.name);
              req.onsuccess = wrap(function() {
                _onDatabaseDeleted(_this._deps, _this.name);
                resolve();
              });
              req.onerror = eventRejectHandler(reject);
              req.onblocked = _this._fireOnBlocked;
            };
            if (hasInvalidArguments)
              throw new exceptions.InvalidArgument("Invalid closeOptions argument to db.delete()");
            if (state2.isBeingOpened) {
              state2.dbReadyPromise.then(doDelete);
            } else {
              doDelete();
            }
          });
        };
        Dexie3.prototype.backendDB = function() {
          return this.idbdb;
        };
        Dexie3.prototype.isOpen = function() {
          return this.idbdb !== null;
        };
        Dexie3.prototype.hasBeenClosed = function() {
          var dbOpenError = this._state.dbOpenError;
          return dbOpenError && dbOpenError.name === "DatabaseClosed";
        };
        Dexie3.prototype.hasFailed = function() {
          return this._state.dbOpenError !== null;
        };
        Dexie3.prototype.dynamicallyOpened = function() {
          return this._state.autoSchema;
        };
        Object.defineProperty(Dexie3.prototype, "tables", {
          get: function() {
            var _this = this;
            return keys(this._allTables).map(function(name) {
              return _this._allTables[name];
            });
          },
          enumerable: false,
          configurable: true
        });
        Dexie3.prototype.transaction = function() {
          var args = extractTransactionArgs.apply(this, arguments);
          return this._transaction.apply(this, args);
        };
        Dexie3.prototype._transaction = function(mode, tables, scopeFunc) {
          var _this = this;
          var parentTransaction = PSD.trans;
          if (!parentTransaction || parentTransaction.db !== this || mode.indexOf("!") !== -1)
            parentTransaction = null;
          var onlyIfCompatible = mode.indexOf("?") !== -1;
          mode = mode.replace("!", "").replace("?", "");
          var idbMode, storeNames;
          try {
            storeNames = tables.map(function(table) {
              var storeName = table instanceof _this.Table ? table.name : table;
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
                storeNames.forEach(function(storeName) {
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
            return parentTransaction ? parentTransaction._promise(null, function(_, reject) {
              reject(e);
            }) : rejection(e);
          }
          var enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
          return parentTransaction ? parentTransaction._promise(idbMode, enterTransaction, "lock") : PSD.trans ? usePSD(PSD.transless, function() {
            return _this._whenReady(enterTransaction);
          }) : this._whenReady(enterTransaction);
        };
        Dexie3.prototype.table = function(tableName) {
          if (!hasOwn(this._allTables, tableName)) {
            throw new exceptions.InvalidTable("Table ".concat(tableName, " does not exist"));
          }
          return this._allTables[tableName];
        };
        return Dexie3;
      })();
      var symbolObservable = typeof Symbol !== "undefined" && "observable" in Symbol ? Symbol.observable : "@@observable";
      var Observable = (function() {
        function Observable2(subscribe) {
          this._subscribe = subscribe;
        }
        Observable2.prototype.subscribe = function(x, error, complete) {
          return this._subscribe(!x || typeof x === "function" ? { next: x, error, complete } : x);
        };
        Observable2.prototype[symbolObservable] = function() {
          return this;
        };
        return Observable2;
      })();
      var domDeps;
      try {
        domDeps = {
          indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
          IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
        };
      } catch (e) {
        domDeps = { indexedDB: null, IDBKeyRange: null };
      }
      function liveQuery2(querier) {
        var hasValue = false;
        var currentValue;
        var observable = new Observable(function(observer) {
          var scopeFuncIsAsync = isAsyncFunction(querier);
          function execute(ctx) {
            var wasRootExec = beginMicroTickScope();
            try {
              if (scopeFuncIsAsync) {
                incrementExpectedAwaits();
              }
              var rv = newScope(querier, ctx);
              if (scopeFuncIsAsync) {
                rv = rv.finally(decrementExpectedAwaits);
              }
              return rv;
            } finally {
              wasRootExec && endMicroTickScope();
            }
          }
          var closed = false;
          var abortController;
          var accumMuts = {};
          var currentObs = {};
          var subscription = {
            get closed() {
              return closed;
            },
            unsubscribe: function() {
              if (closed)
                return;
              closed = true;
              if (abortController)
                abortController.abort();
              if (startedListening)
                globalEvents.storagemutated.unsubscribe(mutationListener);
            }
          };
          observer.start && observer.start(subscription);
          var startedListening = false;
          var doQuery = function() {
            return execInGlobalContext(_doQuery);
          };
          function shouldNotify() {
            return obsSetsOverlap(currentObs, accumMuts);
          }
          var mutationListener = function(parts) {
            extendObservabilitySet(accumMuts, parts);
            if (shouldNotify()) {
              doQuery();
            }
          };
          var _doQuery = function() {
            if (closed || !domDeps.indexedDB) {
              return;
            }
            accumMuts = {};
            var subscr = {};
            if (abortController)
              abortController.abort();
            abortController = new AbortController();
            var ctx = {
              subscr,
              signal: abortController.signal,
              requery: doQuery,
              querier,
              trans: null
            };
            var ret = execute(ctx);
            Promise.resolve(ret).then(function(result) {
              hasValue = true;
              currentValue = result;
              if (closed || ctx.signal.aborted) {
                return;
              }
              accumMuts = {};
              currentObs = subscr;
              if (!objectIsEmpty(currentObs) && !startedListening) {
                globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, mutationListener);
                startedListening = true;
              }
              execInGlobalContext(function() {
                return !closed && observer.next && observer.next(result);
              });
            }, function(err) {
              hasValue = false;
              if (!["DatabaseClosedError", "AbortError"].includes(err === null || err === void 0 ? void 0 : err.name)) {
                if (!closed)
                  execInGlobalContext(function() {
                    if (closed)
                      return;
                    observer.error && observer.error(err);
                  });
              }
            });
          };
          setTimeout(doQuery, 0);
          return subscription;
        });
        observable.hasValue = function() {
          return hasValue;
        };
        observable.getValue = function() {
          return currentValue;
        };
        return observable;
      }
      var Dexie2 = Dexie$1;
      props(Dexie2, __assign(__assign({}, fullNameExceptions), {
        delete: function(databaseName) {
          var db2 = new Dexie2(databaseName, { addons: [] });
          return db2.delete();
        },
        exists: function(name) {
          return new Dexie2(name, { addons: [] }).open().then(function(db2) {
            db2.close();
            return true;
          }).catch("NoSuchDatabaseError", function() {
            return false;
          });
        },
        getDatabaseNames: function(cb) {
          try {
            return getDatabaseNames(Dexie2.dependencies).then(cb);
          } catch (_a3) {
            return rejection(new exceptions.MissingAPI());
          }
        },
        defineClass: function() {
          function Class(content) {
            extend(this, content);
          }
          return Class;
        },
        ignoreTransaction: function(scopeFunc) {
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
          get: function() {
            return PSD.trans || null;
          }
        },
        waitFor: function(promiseOrFunction, optionalTimeout) {
          var promise = DexiePromise.resolve(typeof promiseOrFunction === "function" ? Dexie2.ignoreTransaction(promiseOrFunction) : promiseOrFunction).timeout(optionalTimeout || 6e4);
          return PSD.trans ? PSD.trans.waitFor(promise) : promise;
        },
        Promise: DexiePromise,
        debug: {
          get: function() {
            return debug9;
          },
          set: function(value) {
            setDebug(value);
          }
        },
        derive,
        extend,
        props,
        override,
        Events,
        on: globalEvents,
        liveQuery: liveQuery2,
        extendObservabilitySet,
        getByKeyPath,
        setByKeyPath,
        delByKeyPath,
        shallowClone,
        deepClone,
        getObjectDiff,
        cmp: cmp2,
        asap: asap$1,
        minKey,
        addons: [],
        connections,
        errnames,
        dependencies: domDeps,
        cache,
        semVer: DEXIE_VERSION,
        version: DEXIE_VERSION.split(".").map(function(n) {
          return parseInt(n);
        }).reduce(function(p, c, i2) {
          return p + c / Math.pow(10, i2 * 2);
        })
      }));
      Dexie2.maxKey = getMaxKey(Dexie2.dependencies.IDBKeyRange);
      if (typeof dispatchEvent !== "undefined" && typeof addEventListener !== "undefined") {
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function(updatedParts) {
          if (!propagatingLocally) {
            var event_1;
            event_1 = new CustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, {
              detail: updatedParts
            });
            propagatingLocally = true;
            dispatchEvent(event_1);
            propagatingLocally = false;
          }
        });
        addEventListener(STORAGE_MUTATED_DOM_EVENT_NAME, function(_a3) {
          var detail = _a3.detail;
          if (!propagatingLocally) {
            propagateLocally(detail);
          }
        });
      }
      function propagateLocally(updateParts) {
        var wasMe = propagatingLocally;
        try {
          propagatingLocally = true;
          globalEvents.storagemutated.fire(updateParts);
          signalSubscribersNow(updateParts, true);
        } finally {
          propagatingLocally = wasMe;
        }
      }
      var propagatingLocally = false;
      var bc;
      var createBC = function() {
      };
      if (typeof BroadcastChannel !== "undefined") {
        createBC = function() {
          bc = new BroadcastChannel(STORAGE_MUTATED_DOM_EVENT_NAME);
          bc.onmessage = function(ev) {
            return ev.data && propagateLocally(ev.data);
          };
        };
        createBC();
        if (typeof bc.unref === "function") {
          bc.unref();
        }
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function(changedParts) {
          if (!propagatingLocally) {
            bc.postMessage(changedParts);
          }
        });
      }
      if (typeof addEventListener !== "undefined") {
        addEventListener("pagehide", function(event) {
          if (!Dexie$1.disableBfCache && event.persisted) {
            if (debug9)
              console.debug("Dexie: handling persisted pagehide");
            bc === null || bc === void 0 ? void 0 : bc.close();
            for (var _i = 0, connections_1 = connections; _i < connections_1.length; _i++) {
              var db2 = connections_1[_i];
              db2.close({ disableAutoOpen: false });
            }
          }
        });
        addEventListener("pageshow", function(event) {
          if (!Dexie$1.disableBfCache && event.persisted) {
            if (debug9)
              console.debug("Dexie: handling persisted pageshow");
            createBC();
            propagateLocally({ all: new RangeSet2(-Infinity, [[]]) });
          }
        });
      }
      function add2(value) {
        return new PropModification2({ add: value });
      }
      function remove2(value) {
        return new PropModification2({ remove: value });
      }
      function replacePrefix2(a, b) {
        return new PropModification2({ replacePrefix: [a, b] });
      }
      DexiePromise.rejectionMapper = mapError;
      setDebug(debug9);
      var namedExports = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        Dexie: Dexie$1,
        Entity: Entity2,
        PropModification: PropModification2,
        RangeSet: RangeSet2,
        add: add2,
        cmp: cmp2,
        default: Dexie$1,
        liveQuery: liveQuery2,
        mergeRanges: mergeRanges2,
        rangesOverlap: rangesOverlap2,
        remove: remove2,
        replacePrefix: replacePrefix2
      });
      __assign(Dexie$1, namedExports, { default: Dexie$1 });
      return Dexie$1;
    }));
  }
});

// src/summariser.ts
var summariser_exports = {};
__export(summariser_exports, {
  default: () => Summariser
});
module.exports = __toCommonJS(summariser_exports);

// node_modules/@nostr-dev-kit/ndk/dist/index.mjs
var import_tseep = __toESM(require_lib(), 1);
var import_debug = __toESM(require_src(), 1);
var import_debug2 = __toESM(require_src(), 1);
var import_tseep2 = __toESM(require_lib(), 1);
var import_debug3 = __toESM(require_src(), 1);

// node_modules/@noble/curves/node_modules/@noble/hashes/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function anumber(n, title = "") {
  if (!Number.isSafeInteger(n) || n < 0) {
    const prefix = title && `"${title}" `;
    throw new Error(`${prefix}expected integer >= 0, got ${n}`);
  }
}
function abytes(value, length, title = "") {
  const bytes = isBytes(value);
  const len = value?.length;
  const needsLen = length !== void 0;
  if (!bytes || needsLen && len !== length) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
  }
  return value;
}
function ahash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new Error("Hash must wrapped by utils.createHasher");
  anumber(h.outputLen);
  anumber(h.blockLen);
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes(out, void 0, "digestInto() output");
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error('"digestInto() output" expected to be of length >=' + min);
  }
}
function clean(...arrays) {
  for (let i2 = 0; i2 < arrays.length; i2++) {
    arrays[i2].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
var hasHexBuiltin = /* @__PURE__ */ (() => (
  // @ts-ignore
  typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
))();
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i2) => i2.toString(16).padStart(2, "0"));
function bytesToHex(bytes) {
  abytes(bytes);
  if (hasHexBuiltin)
    return bytes.toHex();
  let hex = "";
  for (let i2 = 0; i2 < bytes.length; i2++) {
    hex += hexes[bytes[i2]];
  }
  return hex;
}
var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function asciiToBase16(ch) {
  if (ch >= asciis._0 && ch <= asciis._9)
    return ch - asciis._0;
  if (ch >= asciis.A && ch <= asciis.F)
    return ch - (asciis.A - 10);
  if (ch >= asciis.a && ch <= asciis.f)
    return ch - (asciis.a - 10);
  return;
}
function hexToBytes(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  if (hasHexBuiltin)
    return Uint8Array.fromHex(hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i2 = 0; i2 < arrays.length; i2++) {
    const a = arrays[i2];
    abytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i2 = 0, pad2 = 0; i2 < arrays.length; i2++) {
    const a = arrays[i2];
    res.set(a, pad2);
    pad2 += a.length;
  }
  return res;
}
function createHasher(hashCons, info = {}) {
  const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
  const tmp = hashCons(void 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = (opts) => hashCons(opts);
  Object.assign(hashC, info);
  return Object.freeze(hashC);
}
function randomBytes(bytesLength = 32) {
  const cr = typeof globalThis === "object" ? globalThis.crypto : null;
  if (typeof cr?.getRandomValues !== "function")
    throw new Error("crypto.getRandomValues must be defined");
  return cr.getRandomValues(new Uint8Array(bytesLength));
}
var oidNist = (suffix) => ({
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
});

// node_modules/@noble/curves/node_modules/@noble/hashes/_md.js
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD = class {
  blockLen;
  outputLen;
  padOffset;
  isLE;
  // For partial updates less than block size
  buffer;
  view;
  finished = false;
  length = 0;
  pos = 0;
  destroyed = false;
  constructor(blockLen, outputLen, padOffset, isLE2) {
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE2;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    aexists(this);
    abytes(data);
    const { view, buffer, blockLen } = this;
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
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE2 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    clean(this.buffer.subarray(pos));
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i2 = pos; i2 < blockLen; i2++)
      buffer[i2] = 0;
    view.setBigUint64(blockLen - 8, BigInt(this.length * 8), isLE2);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen must be aligned to 32bit");
    const outLen = len / 4;
    const state2 = this.get();
    if (outLen > state2.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i2 = 0; i2 < outLen; i2++)
      oview.setUint32(4 * i2, state2[i2], isLE2);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to ||= new this.constructor();
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
};
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);

// node_modules/@noble/curves/node_modules/@noble/hashes/sha2.js
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
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
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA2_32B = class extends HashMD {
  constructor(outputLen) {
    super(64, outputLen, 8, false);
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
    clean(SHA256_W);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean(this.buffer);
  }
};
var _SHA256 = class extends SHA2_32B {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  A = SHA256_IV[0] | 0;
  B = SHA256_IV[1] | 0;
  C = SHA256_IV[2] | 0;
  D = SHA256_IV[3] | 0;
  E = SHA256_IV[4] | 0;
  F = SHA256_IV[5] | 0;
  G = SHA256_IV[6] | 0;
  H = SHA256_IV[7] | 0;
  constructor() {
    super(32);
  }
};
var sha256 = /* @__PURE__ */ createHasher(
  () => new _SHA256(),
  /* @__PURE__ */ oidNist(1)
);

// node_modules/@noble/curves/utils.js
var _0n = /* @__PURE__ */ BigInt(0);
var _1n = /* @__PURE__ */ BigInt(1);
function abool(value, title = "") {
  if (typeof value !== "boolean") {
    const prefix = title && `"${title}" `;
    throw new Error(prefix + "expected boolean, got type=" + typeof value);
  }
  return value;
}
function abignumber(n) {
  if (typeof n === "bigint") {
    if (!isPosBig(n))
      throw new Error("positive bigint expected, got " + n);
  } else
    anumber(n);
  return n;
}
function numberToHexUnpadded(num3) {
  const hex = abignumber(num3).toString(16);
  return hex.length & 1 ? "0" + hex : hex;
}
function hexToNumber(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  return hex === "" ? _0n : BigInt("0x" + hex);
}
function bytesToNumberBE(bytes) {
  return hexToNumber(bytesToHex(bytes));
}
function bytesToNumberLE(bytes) {
  return hexToNumber(bytesToHex(copyBytes(abytes(bytes)).reverse()));
}
function numberToBytesBE(n, len) {
  anumber(len);
  n = abignumber(n);
  const res = hexToBytes(n.toString(16).padStart(len * 2, "0"));
  if (res.length !== len)
    throw new Error("number too large");
  return res;
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function copyBytes(bytes) {
  return Uint8Array.from(bytes);
}
function asciiToBytes(ascii) {
  return Uint8Array.from(ascii, (c, i2) => {
    const charCode = c.charCodeAt(0);
    if (c.length !== 1 || charCode > 127) {
      throw new Error(`string contains non-ASCII character "${ascii[i2]}" with code ${charCode} at position ${i2}`);
    }
    return charCode;
  });
}
var isPosBig = (n) => typeof n === "bigint" && _0n <= n;
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max))
    throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
function bitLen(n) {
  let len;
  for (len = 0; n > _0n; n >>= _1n, len += 1)
    ;
  return len;
}
var bitMask = (n) => (_1n << BigInt(n)) - _1n;
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  anumber(hashLen, "hashLen");
  anumber(qByteLen, "qByteLen");
  if (typeof hmacFn !== "function")
    throw new Error("hmacFn must be a function");
  const u8n = (len) => new Uint8Array(len);
  const NULL = Uint8Array.of();
  const byte0 = Uint8Array.of(0);
  const byte1 = Uint8Array.of(1);
  const _maxDrbgIters = 1e3;
  let v = u8n(hashLen);
  let k = u8n(hashLen);
  let i2 = 0;
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i2 = 0;
  };
  const h = (...msgs) => hmacFn(k, concatBytes(v, ...msgs));
  const reseed = (seed = NULL) => {
    k = h(byte0, seed);
    v = h();
    if (seed.length === 0)
      return;
    k = h(byte1, seed);
    v = h();
  };
  const gen = () => {
    if (i2++ >= _maxDrbgIters)
      throw new Error("drbg: tried max amount of iterations");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes(...out);
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
function validateObject(object, fields = {}, optFields = {}) {
  if (!object || typeof object !== "object")
    throw new Error("expected valid options object");
  function checkField(fieldName, expectedType, isOpt) {
    const val = object[fieldName];
    if (isOpt && val === void 0)
      return;
    const current = typeof val;
    if (current !== expectedType || val === null)
      throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
  }
  const iter = (f, isOpt) => Object.entries(f).forEach(([k, v]) => checkField(k, v, isOpt));
  iter(fields, false);
  iter(optFields, true);
}
function memoized(fn) {
  const map = /* @__PURE__ */ new WeakMap();
  return (arg, ...args) => {
    const val = map.get(arg);
    if (val !== void 0)
      return val;
    const computed = fn(arg, ...args);
    map.set(arg, computed);
    return computed;
  };
}

// node_modules/@noble/curves/abstract/modular.js
var _0n2 = /* @__PURE__ */ BigInt(0);
var _1n2 = /* @__PURE__ */ BigInt(1);
var _2n = /* @__PURE__ */ BigInt(2);
var _3n = /* @__PURE__ */ BigInt(3);
var _4n = /* @__PURE__ */ BigInt(4);
var _5n = /* @__PURE__ */ BigInt(5);
var _7n = /* @__PURE__ */ BigInt(7);
var _8n = /* @__PURE__ */ BigInt(8);
var _9n = /* @__PURE__ */ BigInt(9);
var _16n = /* @__PURE__ */ BigInt(16);
function mod(a, b) {
  const result = a % b;
  return result >= _0n2 ? result : b + result;
}
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number, modulo) {
  if (number === _0n2)
    throw new Error("invert: expected non-zero number");
  if (modulo <= _0n2)
    throw new Error("invert: expected positive modulus, got " + modulo);
  let a = mod(number, modulo);
  let b = modulo;
  let x = _0n2, y = _1n2, u = _1n2, v = _0n2;
  while (a !== _0n2) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd2 = b;
  if (gcd2 !== _1n2)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function assertIsSquare(Fp, root, n) {
  if (!Fp.eql(Fp.sqr(root), n))
    throw new Error("Cannot find square root");
}
function sqrt3mod4(Fp, n) {
  const p1div4 = (Fp.ORDER + _1n2) / _4n;
  const root = Fp.pow(n, p1div4);
  assertIsSquare(Fp, root, n);
  return root;
}
function sqrt5mod8(Fp, n) {
  const p5div8 = (Fp.ORDER - _5n) / _8n;
  const n2 = Fp.mul(n, _2n);
  const v = Fp.pow(n2, p5div8);
  const nv = Fp.mul(n, v);
  const i2 = Fp.mul(Fp.mul(nv, _2n), v);
  const root = Fp.mul(nv, Fp.sub(i2, Fp.ONE));
  assertIsSquare(Fp, root, n);
  return root;
}
function sqrt9mod16(P) {
  const Fp_ = Field(P);
  const tn = tonelliShanks(P);
  const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
  const c2 = tn(Fp_, c1);
  const c3 = tn(Fp_, Fp_.neg(c1));
  const c4 = (P + _7n) / _16n;
  return (Fp, n) => {
    let tv1 = Fp.pow(n, c4);
    let tv2 = Fp.mul(tv1, c1);
    const tv3 = Fp.mul(tv1, c2);
    const tv4 = Fp.mul(tv1, c3);
    const e1 = Fp.eql(Fp.sqr(tv2), n);
    const e2 = Fp.eql(Fp.sqr(tv3), n);
    tv1 = Fp.cmov(tv1, tv2, e1);
    tv2 = Fp.cmov(tv4, tv3, e2);
    const e3 = Fp.eql(Fp.sqr(tv2), n);
    const root = Fp.cmov(tv1, tv2, e3);
    assertIsSquare(Fp, root, n);
    return root;
  };
}
function tonelliShanks(P) {
  if (P < _3n)
    throw new Error("sqrt is not defined for small field");
  let Q = P - _1n2;
  let S = 0;
  while (Q % _2n === _0n2) {
    Q /= _2n;
    S++;
  }
  let Z = _2n;
  const _Fp = Field(P);
  while (FpLegendre(_Fp, Z) === 1) {
    if (Z++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  }
  if (S === 1)
    return sqrt3mod4;
  let cc = _Fp.pow(Z, Q);
  const Q1div2 = (Q + _1n2) / _2n;
  return function tonelliSlow(Fp, n) {
    if (Fp.is0(n))
      return n;
    if (FpLegendre(Fp, n) !== 1)
      throw new Error("Cannot find square root");
    let M = S;
    let c = Fp.mul(Fp.ONE, cc);
    let t = Fp.pow(n, Q);
    let R = Fp.pow(n, Q1div2);
    while (!Fp.eql(t, Fp.ONE)) {
      if (Fp.is0(t))
        return Fp.ZERO;
      let i2 = 1;
      let t_tmp = Fp.sqr(t);
      while (!Fp.eql(t_tmp, Fp.ONE)) {
        i2++;
        t_tmp = Fp.sqr(t_tmp);
        if (i2 === M)
          throw new Error("Cannot find square root");
      }
      const exponent = _1n2 << BigInt(M - i2 - 1);
      const b = Fp.pow(c, exponent);
      M = i2;
      c = Fp.sqr(b);
      t = Fp.mul(t, c);
      R = Fp.mul(R, b);
    }
    return R;
  };
}
function FpSqrt(P) {
  if (P % _4n === _3n)
    return sqrt3mod4;
  if (P % _8n === _5n)
    return sqrt5mod8;
  if (P % _16n === _9n)
    return sqrt9mod16(P);
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
    BYTES: "number",
    BITS: "number"
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  validateObject(field, opts);
  return field;
}
function FpPow(Fp, num3, power) {
  if (power < _0n2)
    throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n2)
    return Fp.ONE;
  if (power === _1n2)
    return num3;
  let p = Fp.ONE;
  let d5 = num3;
  while (power > _0n2) {
    if (power & _1n2)
      p = Fp.mul(p, d5);
    d5 = Fp.sqr(d5);
    power >>= _1n2;
  }
  return p;
}
function FpInvertBatch(Fp, nums, passZero = false) {
  const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
  const multipliedAcc = nums.reduce((acc, num3, i2) => {
    if (Fp.is0(num3))
      return acc;
    inverted[i2] = acc;
    return Fp.mul(acc, num3);
  }, Fp.ONE);
  const invertedAcc = Fp.inv(multipliedAcc);
  nums.reduceRight((acc, num3, i2) => {
    if (Fp.is0(num3))
      return acc;
    inverted[i2] = Fp.mul(acc, inverted[i2]);
    return Fp.mul(acc, num3);
  }, invertedAcc);
  return inverted;
}
function FpLegendre(Fp, n) {
  const p1mod2 = (Fp.ORDER - _1n2) / _2n;
  const powered = Fp.pow(n, p1mod2);
  const yes = Fp.eql(powered, Fp.ONE);
  const zero = Fp.eql(powered, Fp.ZERO);
  const no = Fp.eql(powered, Fp.neg(Fp.ONE));
  if (!yes && !zero && !no)
    throw new Error("invalid Legendre symbol result");
  return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
  if (nBitLength !== void 0)
    anumber(nBitLength);
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
var _Field = class {
  ORDER;
  BITS;
  BYTES;
  isLE;
  ZERO = _0n2;
  ONE = _1n2;
  _lengths;
  _sqrt;
  // cached sqrt
  _mod;
  constructor(ORDER, opts = {}) {
    if (ORDER <= _0n2)
      throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
    let _nbitLength = void 0;
    this.isLE = false;
    if (opts != null && typeof opts === "object") {
      if (typeof opts.BITS === "number")
        _nbitLength = opts.BITS;
      if (typeof opts.sqrt === "function")
        this.sqrt = opts.sqrt;
      if (typeof opts.isLE === "boolean")
        this.isLE = opts.isLE;
      if (opts.allowedLengths)
        this._lengths = opts.allowedLengths?.slice();
      if (typeof opts.modFromBytes === "boolean")
        this._mod = opts.modFromBytes;
    }
    const { nBitLength, nByteLength } = nLength(ORDER, _nbitLength);
    if (nByteLength > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    this.ORDER = ORDER;
    this.BITS = nBitLength;
    this.BYTES = nByteLength;
    this._sqrt = void 0;
    Object.preventExtensions(this);
  }
  create(num3) {
    return mod(num3, this.ORDER);
  }
  isValid(num3) {
    if (typeof num3 !== "bigint")
      throw new Error("invalid field element: expected bigint, got " + typeof num3);
    return _0n2 <= num3 && num3 < this.ORDER;
  }
  is0(num3) {
    return num3 === _0n2;
  }
  // is valid and invertible
  isValidNot0(num3) {
    return !this.is0(num3) && this.isValid(num3);
  }
  isOdd(num3) {
    return (num3 & _1n2) === _1n2;
  }
  neg(num3) {
    return mod(-num3, this.ORDER);
  }
  eql(lhs, rhs) {
    return lhs === rhs;
  }
  sqr(num3) {
    return mod(num3 * num3, this.ORDER);
  }
  add(lhs, rhs) {
    return mod(lhs + rhs, this.ORDER);
  }
  sub(lhs, rhs) {
    return mod(lhs - rhs, this.ORDER);
  }
  mul(lhs, rhs) {
    return mod(lhs * rhs, this.ORDER);
  }
  pow(num3, power) {
    return FpPow(this, num3, power);
  }
  div(lhs, rhs) {
    return mod(lhs * invert(rhs, this.ORDER), this.ORDER);
  }
  // Same as above, but doesn't normalize
  sqrN(num3) {
    return num3 * num3;
  }
  addN(lhs, rhs) {
    return lhs + rhs;
  }
  subN(lhs, rhs) {
    return lhs - rhs;
  }
  mulN(lhs, rhs) {
    return lhs * rhs;
  }
  inv(num3) {
    return invert(num3, this.ORDER);
  }
  sqrt(num3) {
    if (!this._sqrt)
      this._sqrt = FpSqrt(this.ORDER);
    return this._sqrt(this, num3);
  }
  toBytes(num3) {
    return this.isLE ? numberToBytesLE(num3, this.BYTES) : numberToBytesBE(num3, this.BYTES);
  }
  fromBytes(bytes, skipValidation = false) {
    abytes(bytes);
    const { _lengths: allowedLengths, BYTES, isLE: isLE2, ORDER, _mod: modFromBytes } = this;
    if (allowedLengths) {
      if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
        throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
      }
      const padded = new Uint8Array(BYTES);
      padded.set(bytes, isLE2 ? 0 : padded.length - bytes.length);
      bytes = padded;
    }
    if (bytes.length !== BYTES)
      throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
    let scalar = isLE2 ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
    if (modFromBytes)
      scalar = mod(scalar, ORDER);
    if (!skipValidation) {
      if (!this.isValid(scalar))
        throw new Error("invalid field element: outside of range 0..ORDER");
    }
    return scalar;
  }
  // TODO: we don't need it here, move out to separate fn
  invertBatch(lst) {
    return FpInvertBatch(this, lst);
  }
  // We can't move this out because Fp6, Fp12 implement it
  // and it's unclear what to return in there.
  cmov(a, b, condition) {
    return condition ? b : a;
  }
};
function Field(ORDER, opts = {}) {
  return new _Field(ORDER, opts);
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
function mapHashToField(key, fieldOrder, isLE2 = false) {
  abytes(key);
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  if (len < 16 || len < minLen || len > 1024)
    throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
  const num3 = isLE2 ? bytesToNumberLE(key) : bytesToNumberBE(key);
  const reduced = mod(num3, fieldOrder - _1n2) + _1n2;
  return isLE2 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}

// node_modules/@noble/curves/abstract/curve.js
var _0n3 = /* @__PURE__ */ BigInt(0);
var _1n3 = /* @__PURE__ */ BigInt(1);
function negateCt(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
function normalizeZ(c, points) {
  const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
  return points.map((p, i2) => c.fromAffine(p.toAffine(invertedZs[i2])));
}
function validateW(W, bits) {
  if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
    throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
}
function calcWOpts(W, scalarBits) {
  validateW(W, scalarBits);
  const windows = Math.ceil(scalarBits / W) + 1;
  const windowSize = 2 ** (W - 1);
  const maxNumber = 2 ** W;
  const mask = bitMask(W);
  const shiftBy = BigInt(W);
  return { windows, windowSize, mask, maxNumber, shiftBy };
}
function calcOffsets(n, window2, wOpts) {
  const { windowSize, mask, maxNumber, shiftBy } = wOpts;
  let wbits = Number(n & mask);
  let nextN = n >> shiftBy;
  if (wbits > windowSize) {
    wbits -= maxNumber;
    nextN += _1n3;
  }
  const offsetStart = window2 * windowSize;
  const offset = offsetStart + Math.abs(wbits) - 1;
  const isZero = wbits === 0;
  const isNeg = wbits < 0;
  const isNegF = window2 % 2 !== 0;
  const offsetF = offsetStart;
  return { nextN, offset, isZero, isNeg, isNegF, offsetF };
}
var pointPrecomputes = /* @__PURE__ */ new WeakMap();
var pointWindowSizes = /* @__PURE__ */ new WeakMap();
function getW(P) {
  return pointWindowSizes.get(P) || 1;
}
function assert0(n) {
  if (n !== _0n3)
    throw new Error("invalid wNAF");
}
var wNAF = class {
  BASE;
  ZERO;
  Fn;
  bits;
  // Parametrized with a given Point class (not individual point)
  constructor(Point, bits) {
    this.BASE = Point.BASE;
    this.ZERO = Point.ZERO;
    this.Fn = Point.Fn;
    this.bits = bits;
  }
  // non-const time multiplication ladder
  _unsafeLadder(elm, n, p = this.ZERO) {
    let d5 = elm;
    while (n > _0n3) {
      if (n & _1n3)
        p = p.add(d5);
      d5 = d5.double();
      n >>= _1n3;
    }
    return p;
  }
  /**
   * Creates a wNAF precomputation window. Used for caching.
   * Default window size is set by `utils.precompute()` and is equal to 8.
   * Number of precomputed points depends on the curve size:
   * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
   * - 𝑊 is the window size
   * - 𝑛 is the bitlength of the curve order.
   * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
   * @param point Point instance
   * @param W window size
   * @returns precomputed point tables flattened to a single array
   */
  precomputeWindow(point, W) {
    const { windows, windowSize } = calcWOpts(W, this.bits);
    const points = [];
    let p = point;
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
  }
  /**
   * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
   * More compact implementation:
   * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
   * @returns real and fake (for const-time) points
   */
  wNAF(W, precomputes, n) {
    if (!this.Fn.isValid(n))
      throw new Error("invalid scalar");
    let p = this.ZERO;
    let f = this.BASE;
    const wo = calcWOpts(W, this.bits);
    for (let window2 = 0; window2 < wo.windows; window2++) {
      const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window2, wo);
      n = nextN;
      if (isZero) {
        f = f.add(negateCt(isNegF, precomputes[offsetF]));
      } else {
        p = p.add(negateCt(isNeg, precomputes[offset]));
      }
    }
    assert0(n);
    return { p, f };
  }
  /**
   * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
   * @param acc accumulator point to add result of multiplication
   * @returns point
   */
  wNAFUnsafe(W, precomputes, n, acc = this.ZERO) {
    const wo = calcWOpts(W, this.bits);
    for (let window2 = 0; window2 < wo.windows; window2++) {
      if (n === _0n3)
        break;
      const { nextN, offset, isZero, isNeg } = calcOffsets(n, window2, wo);
      n = nextN;
      if (isZero) {
        continue;
      } else {
        const item = precomputes[offset];
        acc = acc.add(isNeg ? item.negate() : item);
      }
    }
    assert0(n);
    return acc;
  }
  getPrecomputes(W, point, transform) {
    let comp = pointPrecomputes.get(point);
    if (!comp) {
      comp = this.precomputeWindow(point, W);
      if (W !== 1) {
        if (typeof transform === "function")
          comp = transform(comp);
        pointPrecomputes.set(point, comp);
      }
    }
    return comp;
  }
  cached(point, scalar, transform) {
    const W = getW(point);
    return this.wNAF(W, this.getPrecomputes(W, point, transform), scalar);
  }
  unsafe(point, scalar, transform, prev) {
    const W = getW(point);
    if (W === 1)
      return this._unsafeLadder(point, scalar, prev);
    return this.wNAFUnsafe(W, this.getPrecomputes(W, point, transform), scalar, prev);
  }
  // We calculate precomputes for elliptic curve point multiplication
  // using windowed method. This specifies window size and
  // stores precomputed values. Usually only base point would be precomputed.
  createCache(P, W) {
    validateW(W, this.bits);
    pointWindowSizes.set(P, W);
    pointPrecomputes.delete(P);
  }
  hasCache(elm) {
    return getW(elm) !== 1;
  }
};
function mulEndoUnsafe(Point, point, k1, k2) {
  let acc = point;
  let p1 = Point.ZERO;
  let p2 = Point.ZERO;
  while (k1 > _0n3 || k2 > _0n3) {
    if (k1 & _1n3)
      p1 = p1.add(acc);
    if (k2 & _1n3)
      p2 = p2.add(acc);
    acc = acc.double();
    k1 >>= _1n3;
    k2 >>= _1n3;
  }
  return { p1, p2 };
}
function createField(order, field, isLE2) {
  if (field) {
    if (field.ORDER !== order)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    validateField(field);
    return field;
  } else {
    return Field(order, { isLE: isLE2 });
  }
}
function createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
  if (FpFnLE === void 0)
    FpFnLE = type === "edwards";
  if (!CURVE || typeof CURVE !== "object")
    throw new Error(`expected valid ${type} CURVE object`);
  for (const p of ["p", "n", "h"]) {
    const val = CURVE[p];
    if (!(typeof val === "bigint" && val > _0n3))
      throw new Error(`CURVE.${p} must be positive bigint`);
  }
  const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
  const Fn = createField(CURVE.n, curveOpts.Fn, FpFnLE);
  const _b = type === "weierstrass" ? "b" : "d";
  const params = ["Gx", "Gy", "a", _b];
  for (const p of params) {
    if (!Fp.isValid(CURVE[p]))
      throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
  }
  CURVE = Object.freeze(Object.assign({}, CURVE));
  return { CURVE, Fp, Fn };
}
function createKeygen(randomSecretKey, getPublicKey2) {
  return function keygen(seed) {
    const secretKey = randomSecretKey(seed);
    return { secretKey, publicKey: getPublicKey2(secretKey) };
  };
}

// node_modules/@noble/curves/node_modules/@noble/hashes/hmac.js
var _HMAC = class {
  oHash;
  iHash;
  blockLen;
  outputLen;
  finished = false;
  destroyed = false;
  constructor(hash, key) {
    ahash(hash);
    abytes(key, void 0, "key");
    this.iHash = hash.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad2 = new Uint8Array(blockLen);
    pad2.set(key.length > blockLen ? hash.create().update(key).digest() : key);
    for (let i2 = 0; i2 < pad2.length; i2++)
      pad2[i2] ^= 54;
    this.iHash.update(pad2);
    this.oHash = hash.create();
    for (let i2 = 0; i2 < pad2.length; i2++)
      pad2[i2] ^= 54 ^ 92;
    this.oHash.update(pad2);
    clean(pad2);
  }
  update(buf) {
    aexists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    aexists(this);
    abytes(out, this.outputLen, "output");
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
    to ||= Object.create(Object.getPrototypeOf(this), {});
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
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac = (hash, key, message) => new _HMAC(hash, key).update(message).digest();
hmac.create = (hash, key) => new _HMAC(hash, key);

// node_modules/@noble/curves/abstract/weierstrass.js
var divNearest = (num3, den) => (num3 + (num3 >= 0 ? den : -den) / _2n2) / den;
function _splitEndoScalar(k, basis, n) {
  const [[a1, b1], [a2, b2]] = basis;
  const c1 = divNearest(b2 * k, n);
  const c2 = divNearest(-b1 * k, n);
  let k1 = k - c1 * a1 - c2 * a2;
  let k2 = -c1 * b1 - c2 * b2;
  const k1neg = k1 < _0n4;
  const k2neg = k2 < _0n4;
  if (k1neg)
    k1 = -k1;
  if (k2neg)
    k2 = -k2;
  const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n4;
  if (k1 < _0n4 || k1 >= MAX_NUM || k2 < _0n4 || k2 >= MAX_NUM) {
    throw new Error("splitScalar (endomorphism): failed, k=" + k);
  }
  return { k1neg, k1, k2neg, k2 };
}
function validateSigFormat(format) {
  if (!["compact", "recovered", "der"].includes(format))
    throw new Error('Signature format must be "compact", "recovered", or "der"');
  return format;
}
function validateSigOpts(opts, def) {
  const optsn = {};
  for (let optName of Object.keys(def)) {
    optsn[optName] = opts[optName] === void 0 ? def[optName] : opts[optName];
  }
  abool(optsn.lowS, "lowS");
  abool(optsn.prehash, "prehash");
  if (optsn.format !== void 0)
    validateSigFormat(optsn.format);
  return optsn;
}
var DERErr = class extends Error {
  constructor(m = "") {
    super(m);
  }
};
var DER = {
  // asn.1 DER encoding utils
  Err: DERErr,
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (tag2, data) => {
      const { Err: E } = DER;
      if (tag2 < 0 || tag2 > 256)
        throw new E("tlv.encode: wrong tag");
      if (data.length & 1)
        throw new E("tlv.encode: unpadded data");
      const dataLen = data.length / 2;
      const len = numberToHexUnpadded(dataLen);
      if (len.length / 2 & 128)
        throw new E("tlv.encode: long form length too big");
      const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
      const t = numberToHexUnpadded(tag2);
      return t + lenLen + len + data;
    },
    // v - value, l - left bytes (unparsed)
    decode(tag2, data) {
      const { Err: E } = DER;
      let pos = 0;
      if (tag2 < 0 || tag2 > 256)
        throw new E("tlv.encode: wrong tag");
      if (data.length < 2 || data[pos++] !== tag2)
        throw new E("tlv.decode: wrong tlv");
      const first = data[pos++];
      const isLong = !!(first & 128);
      let length = 0;
      if (!isLong)
        length = first;
      else {
        const lenLen = first & 127;
        if (!lenLen)
          throw new E("tlv.decode(long): indefinite length not supported");
        if (lenLen > 4)
          throw new E("tlv.decode(long): byte length is too big");
        const lengthBytes = data.subarray(pos, pos + lenLen);
        if (lengthBytes.length !== lenLen)
          throw new E("tlv.decode: length bytes not complete");
        if (lengthBytes[0] === 0)
          throw new E("tlv.decode(long): zero leftmost byte");
        for (const b of lengthBytes)
          length = length << 8 | b;
        pos += lenLen;
        if (length < 128)
          throw new E("tlv.decode(long): not minimal encoding");
      }
      const v = data.subarray(pos, pos + length);
      if (v.length !== length)
        throw new E("tlv.decode: wrong value length");
      return { v, l: data.subarray(pos + length) };
    }
  },
  // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
  // since we always use positive integers here. It must always be empty:
  // - add zero byte if exists
  // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
  _int: {
    encode(num3) {
      const { Err: E } = DER;
      if (num3 < _0n4)
        throw new E("integer: negative integers are not allowed");
      let hex = numberToHexUnpadded(num3);
      if (Number.parseInt(hex[0], 16) & 8)
        hex = "00" + hex;
      if (hex.length & 1)
        throw new E("unexpected DER parsing assertion: unpadded hex");
      return hex;
    },
    decode(data) {
      const { Err: E } = DER;
      if (data[0] & 128)
        throw new E("invalid signature integer: negative");
      if (data[0] === 0 && !(data[1] & 128))
        throw new E("invalid signature integer: unnecessary leading zero");
      return bytesToNumberBE(data);
    }
  },
  toSig(bytes) {
    const { Err: E, _int: int, _tlv: tlv } = DER;
    const data = abytes(bytes, void 0, "signature");
    const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
    if (seqLeftBytes.length)
      throw new E("invalid signature: left bytes after parsing");
    const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
    const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
    if (sLeftBytes.length)
      throw new E("invalid signature: left bytes after parsing");
    return { r: int.decode(rBytes), s: int.decode(sBytes) };
  },
  hexFromSig(sig) {
    const { _tlv: tlv, _int: int } = DER;
    const rs = tlv.encode(2, int.encode(sig.r));
    const ss = tlv.encode(2, int.encode(sig.s));
    const seq = rs + ss;
    return tlv.encode(48, seq);
  }
};
var _0n4 = BigInt(0);
var _1n4 = BigInt(1);
var _2n2 = BigInt(2);
var _3n2 = BigInt(3);
var _4n2 = BigInt(4);
function weierstrass(params, extraOpts = {}) {
  const validated = createCurveFields("weierstrass", params, extraOpts);
  const { Fp, Fn } = validated;
  let CURVE = validated.CURVE;
  const { h: cofactor, n: CURVE_ORDER } = CURVE;
  validateObject(extraOpts, {}, {
    allowInfinityPoint: "boolean",
    clearCofactor: "function",
    isTorsionFree: "function",
    fromBytes: "function",
    toBytes: "function",
    endo: "object"
  });
  const { endo } = extraOpts;
  if (endo) {
    if (!Fp.is0(CURVE.a) || typeof endo.beta !== "bigint" || !Array.isArray(endo.basises)) {
      throw new Error('invalid endo: expected "beta": bigint and "basises": array');
    }
  }
  const lengths = getWLengths(Fp, Fn);
  function assertCompressionIsSupported() {
    if (!Fp.isOdd)
      throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  function pointToBytes3(_c, point, isCompressed) {
    const { x, y } = point.toAffine();
    const bx = Fp.toBytes(x);
    abool(isCompressed, "isCompressed");
    if (isCompressed) {
      assertCompressionIsSupported();
      const hasEvenY = !Fp.isOdd(y);
      return concatBytes(pprefix(hasEvenY), bx);
    } else {
      return concatBytes(Uint8Array.of(4), bx, Fp.toBytes(y));
    }
  }
  function pointFromBytes(bytes) {
    abytes(bytes, void 0, "Point");
    const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
    const length = bytes.length;
    const head = bytes[0];
    const tail = bytes.subarray(1);
    if (length === comp && (head === 2 || head === 3)) {
      const x = Fp.fromBytes(tail);
      if (!Fp.isValid(x))
        throw new Error("bad point: is not on curve, wrong x");
      const y2 = weierstrassEquation(x);
      let y;
      try {
        y = Fp.sqrt(y2);
      } catch (sqrtError) {
        const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
        throw new Error("bad point: is not on curve, sqrt error" + err);
      }
      assertCompressionIsSupported();
      const evenY = Fp.isOdd(y);
      const evenH = (head & 1) === 1;
      if (evenH !== evenY)
        y = Fp.neg(y);
      return { x, y };
    } else if (length === uncomp && head === 4) {
      const L = Fp.BYTES;
      const x = Fp.fromBytes(tail.subarray(0, L));
      const y = Fp.fromBytes(tail.subarray(L, L * 2));
      if (!isValidXY(x, y))
        throw new Error("bad point: is not on curve");
      return { x, y };
    } else {
      throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
    }
  }
  const encodePoint = extraOpts.toBytes || pointToBytes3;
  const decodePoint = extraOpts.fromBytes || pointFromBytes;
  function weierstrassEquation(x) {
    const x2 = Fp.sqr(x);
    const x3 = Fp.mul(x2, x);
    return Fp.add(Fp.add(x3, Fp.mul(x, CURVE.a)), CURVE.b);
  }
  function isValidXY(x, y) {
    const left = Fp.sqr(y);
    const right = weierstrassEquation(x);
    return Fp.eql(left, right);
  }
  if (!isValidXY(CURVE.Gx, CURVE.Gy))
    throw new Error("bad curve params: generator point");
  const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n2), _4n2);
  const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
  if (Fp.is0(Fp.add(_4a3, _27b2)))
    throw new Error("bad curve params: a or b");
  function acoord(title, n, banZero = false) {
    if (!Fp.isValid(n) || banZero && Fp.is0(n))
      throw new Error(`bad point coordinate ${title}`);
    return n;
  }
  function aprjpoint(other) {
    if (!(other instanceof Point))
      throw new Error("Weierstrass Point expected");
  }
  function splitEndoScalarN(k) {
    if (!endo || !endo.basises)
      throw new Error("no endo");
    return _splitEndoScalar(k, endo.basises, Fn.ORDER);
  }
  const toAffineMemo = memoized((p, iz) => {
    const { X, Y, Z } = p;
    if (Fp.eql(Z, Fp.ONE))
      return { x: X, y: Y };
    const is0 = p.is0();
    if (iz == null)
      iz = is0 ? Fp.ONE : Fp.inv(Z);
    const x = Fp.mul(X, iz);
    const y = Fp.mul(Y, iz);
    const zz = Fp.mul(Z, iz);
    if (is0)
      return { x: Fp.ZERO, y: Fp.ZERO };
    if (!Fp.eql(zz, Fp.ONE))
      throw new Error("invZ was invalid");
    return { x, y };
  });
  const assertValidMemo = memoized((p) => {
    if (p.is0()) {
      if (extraOpts.allowInfinityPoint && !Fp.is0(p.Y))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x, y } = p.toAffine();
    if (!Fp.isValid(x) || !Fp.isValid(y))
      throw new Error("bad point: x or y not field elements");
    if (!isValidXY(x, y))
      throw new Error("bad point: equation left != right");
    if (!p.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return true;
  });
  function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
    k2p = new Point(Fp.mul(k2p.X, endoBeta), k2p.Y, k2p.Z);
    k1p = negateCt(k1neg, k1p);
    k2p = negateCt(k2neg, k2p);
    return k1p.add(k2p);
  }
  class Point {
    // base / generator point
    static BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
    // zero / infinity / identity point
    static ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
    // 0, 1, 0
    // math field
    static Fp = Fp;
    // scalar field
    static Fn = Fn;
    X;
    Y;
    Z;
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    constructor(X, Y, Z) {
      this.X = acoord("x", X);
      this.Y = acoord("y", Y, true);
      this.Z = acoord("z", Z);
      Object.freeze(this);
    }
    static CURVE() {
      return CURVE;
    }
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("invalid affine point");
      if (p instanceof Point)
        throw new Error("projective point not allowed");
      if (Fp.is0(x) && Fp.is0(y))
        return Point.ZERO;
      return new Point(x, y, Fp.ONE);
    }
    static fromBytes(bytes) {
      const P = Point.fromAffine(decodePoint(abytes(bytes, void 0, "point")));
      P.assertValidity();
      return P;
    }
    static fromHex(hex) {
      return Point.fromBytes(hexToBytes(hex));
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     *
     * @param windowSize
     * @param isLazy true will defer table computation until the first multiplication
     * @returns
     */
    precompute(windowSize = 8, isLazy = true) {
      wnaf.createCache(this, windowSize);
      if (!isLazy)
        this.multiply(_3n2);
      return this;
    }
    // TODO: return `this`
    /** A point on curve is valid if it conforms to equation. */
    assertValidity() {
      assertValidMemo(this);
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (!Fp.isOdd)
        throw new Error("Field doesn't support isOdd");
      return !Fp.isOdd(y);
    }
    /** Compare one point to another. */
    equals(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
      const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
      return U1 && U2;
    }
    /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
    negate() {
      return new Point(this.X, Fp.neg(this.Y), this.Z);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a, b } = CURVE;
      const b3 = Fp.mul(b, _3n2);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      let t0 = Fp.mul(X1, X1);
      let t1 = Fp.mul(Y1, Y1);
      let t2 = Fp.mul(Z1, Z1);
      let t3 = Fp.mul(X1, Y1);
      t3 = Fp.add(t3, t3);
      Z3 = Fp.mul(X1, Z1);
      Z3 = Fp.add(Z3, Z3);
      X3 = Fp.mul(a, Z3);
      Y3 = Fp.mul(b3, t2);
      Y3 = Fp.add(X3, Y3);
      X3 = Fp.sub(t1, Y3);
      Y3 = Fp.add(t1, Y3);
      Y3 = Fp.mul(X3, Y3);
      X3 = Fp.mul(t3, X3);
      Z3 = Fp.mul(b3, Z3);
      t2 = Fp.mul(a, t2);
      t3 = Fp.sub(t0, t2);
      t3 = Fp.mul(a, t3);
      t3 = Fp.add(t3, Z3);
      Z3 = Fp.add(t0, t0);
      t0 = Fp.add(Z3, t0);
      t0 = Fp.add(t0, t2);
      t0 = Fp.mul(t0, t3);
      Y3 = Fp.add(Y3, t0);
      t2 = Fp.mul(Y1, Z1);
      t2 = Fp.add(t2, t2);
      t0 = Fp.mul(t2, t3);
      X3 = Fp.sub(X3, t0);
      Z3 = Fp.mul(t2, t1);
      Z3 = Fp.add(Z3, Z3);
      Z3 = Fp.add(Z3, Z3);
      return new Point(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      const a = CURVE.a;
      const b3 = Fp.mul(CURVE.b, _3n2);
      let t0 = Fp.mul(X1, X2);
      let t1 = Fp.mul(Y1, Y2);
      let t2 = Fp.mul(Z1, Z2);
      let t3 = Fp.add(X1, Y1);
      let t4 = Fp.add(X2, Y2);
      t3 = Fp.mul(t3, t4);
      t4 = Fp.add(t0, t1);
      t3 = Fp.sub(t3, t4);
      t4 = Fp.add(X1, Z1);
      let t5 = Fp.add(X2, Z2);
      t4 = Fp.mul(t4, t5);
      t5 = Fp.add(t0, t2);
      t4 = Fp.sub(t4, t5);
      t5 = Fp.add(Y1, Z1);
      X3 = Fp.add(Y2, Z2);
      t5 = Fp.mul(t5, X3);
      X3 = Fp.add(t1, t2);
      t5 = Fp.sub(t5, X3);
      Z3 = Fp.mul(a, t4);
      X3 = Fp.mul(b3, t2);
      Z3 = Fp.add(X3, Z3);
      X3 = Fp.sub(t1, Z3);
      Z3 = Fp.add(t1, Z3);
      Y3 = Fp.mul(X3, Z3);
      t1 = Fp.add(t0, t0);
      t1 = Fp.add(t1, t0);
      t2 = Fp.mul(a, t2);
      t4 = Fp.mul(b3, t4);
      t1 = Fp.add(t1, t2);
      t2 = Fp.sub(t0, t2);
      t2 = Fp.mul(a, t2);
      t4 = Fp.add(t4, t2);
      t0 = Fp.mul(t1, t4);
      Y3 = Fp.add(Y3, t0);
      t0 = Fp.mul(t5, t4);
      X3 = Fp.mul(t3, X3);
      X3 = Fp.sub(X3, t0);
      t0 = Fp.mul(t3, t1);
      Z3 = Fp.mul(t5, Z3);
      Z3 = Fp.add(Z3, t0);
      return new Point(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point.ZERO);
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
      const { endo: endo2 } = extraOpts;
      if (!Fn.isValidNot0(scalar))
        throw new Error("invalid scalar: out of range");
      let point, fake;
      const mul3 = (n) => wnaf.cached(this, n, (p) => normalizeZ(Point, p));
      if (endo2) {
        const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(scalar);
        const { p: k1p, f: k1f } = mul3(k1);
        const { p: k2p, f: k2f } = mul3(k2);
        fake = k1f.add(k2f);
        point = finishEndo(endo2.beta, k1p, k2p, k1neg, k2neg);
      } else {
        const { p, f } = mul3(scalar);
        point = p;
        fake = f;
      }
      return normalizeZ(Point, [point, fake])[0];
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed secret key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(sc) {
      const { endo: endo2 } = extraOpts;
      const p = this;
      if (!Fn.isValid(sc))
        throw new Error("invalid scalar: out of range");
      if (sc === _0n4 || p.is0())
        return Point.ZERO;
      if (sc === _1n4)
        return p;
      if (wnaf.hasCache(this))
        return this.multiply(sc);
      if (endo2) {
        const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(sc);
        const { p1, p2 } = mulEndoUnsafe(Point, p, k1, k2);
        return finishEndo(endo2.beta, p1, p2, k1neg, k2neg);
      } else {
        return wnaf.unsafe(p, sc);
      }
    }
    /**
     * Converts Projective point to affine (x, y) coordinates.
     * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
     */
    toAffine(invertedZ) {
      return toAffineMemo(this, invertedZ);
    }
    /**
     * Checks whether Point is free of torsion elements (is in prime subgroup).
     * Always torsion-free for cofactor=1 curves.
     */
    isTorsionFree() {
      const { isTorsionFree } = extraOpts;
      if (cofactor === _1n4)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point, this);
      return wnaf.unsafe(this, CURVE_ORDER).is0();
    }
    clearCofactor() {
      const { clearCofactor } = extraOpts;
      if (cofactor === _1n4)
        return this;
      if (clearCofactor)
        return clearCofactor(Point, this);
      return this.multiplyUnsafe(cofactor);
    }
    isSmallOrder() {
      return this.multiplyUnsafe(cofactor).is0();
    }
    toBytes(isCompressed = true) {
      abool(isCompressed, "isCompressed");
      this.assertValidity();
      return encodePoint(Point, this, isCompressed);
    }
    toHex(isCompressed = true) {
      return bytesToHex(this.toBytes(isCompressed));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const bits = Fn.BITS;
  const wnaf = new wNAF(Point, extraOpts.endo ? Math.ceil(bits / 2) : bits);
  Point.BASE.precompute(8);
  return Point;
}
function pprefix(hasEvenY) {
  return Uint8Array.of(hasEvenY ? 2 : 3);
}
function getWLengths(Fp, Fn) {
  return {
    secretKey: Fn.BYTES,
    publicKey: 1 + Fp.BYTES,
    publicKeyUncompressed: 1 + 2 * Fp.BYTES,
    publicKeyHasPrefix: true,
    signature: 2 * Fn.BYTES
  };
}
function ecdh(Point, ecdhOpts = {}) {
  const { Fn } = Point;
  const randomBytes_ = ecdhOpts.randomBytes || randomBytes;
  const lengths = Object.assign(getWLengths(Point.Fp, Fn), { seed: getMinHashLength(Fn.ORDER) });
  function isValidSecretKey(secretKey) {
    try {
      const num3 = Fn.fromBytes(secretKey);
      return Fn.isValidNot0(num3);
    } catch (error) {
      return false;
    }
  }
  function isValidPublicKey(publicKey, isCompressed) {
    const { publicKey: comp, publicKeyUncompressed } = lengths;
    try {
      const l = publicKey.length;
      if (isCompressed === true && l !== comp)
        return false;
      if (isCompressed === false && l !== publicKeyUncompressed)
        return false;
      return !!Point.fromBytes(publicKey);
    } catch (error) {
      return false;
    }
  }
  function randomSecretKey(seed = randomBytes_(lengths.seed)) {
    return mapHashToField(abytes(seed, lengths.seed, "seed"), Fn.ORDER);
  }
  function getPublicKey2(secretKey, isCompressed = true) {
    return Point.BASE.multiply(Fn.fromBytes(secretKey)).toBytes(isCompressed);
  }
  function isProbPub(item) {
    const { secretKey, publicKey, publicKeyUncompressed } = lengths;
    if (!isBytes(item))
      return void 0;
    if ("_lengths" in Fn && Fn._lengths || secretKey === publicKey)
      return void 0;
    const l = abytes(item, void 0, "key").length;
    return l === publicKey || l === publicKeyUncompressed;
  }
  function getSharedSecret(secretKeyA, publicKeyB, isCompressed = true) {
    if (isProbPub(secretKeyA) === true)
      throw new Error("first arg must be private key");
    if (isProbPub(publicKeyB) === false)
      throw new Error("second arg must be public key");
    const s = Fn.fromBytes(secretKeyA);
    const b = Point.fromBytes(publicKeyB);
    return b.multiply(s).toBytes(isCompressed);
  }
  const utils = {
    isValidSecretKey,
    isValidPublicKey,
    randomSecretKey
  };
  const keygen = createKeygen(randomSecretKey, getPublicKey2);
  return Object.freeze({ getPublicKey: getPublicKey2, getSharedSecret, keygen, Point, utils, lengths });
}
function ecdsa(Point, hash, ecdsaOpts = {}) {
  ahash(hash);
  validateObject(ecdsaOpts, {}, {
    hmac: "function",
    lowS: "boolean",
    randomBytes: "function",
    bits2int: "function",
    bits2int_modN: "function"
  });
  ecdsaOpts = Object.assign({}, ecdsaOpts);
  const randomBytes5 = ecdsaOpts.randomBytes || randomBytes;
  const hmac4 = ecdsaOpts.hmac || ((key, msg) => hmac(hash, key, msg));
  const { Fp, Fn } = Point;
  const { ORDER: CURVE_ORDER, BITS: fnBits } = Fn;
  const { keygen, getPublicKey: getPublicKey2, getSharedSecret, utils, lengths } = ecdh(Point, ecdsaOpts);
  const defaultSigOpts = {
    prehash: true,
    lowS: typeof ecdsaOpts.lowS === "boolean" ? ecdsaOpts.lowS : true,
    format: "compact",
    extraEntropy: false
  };
  const hasLargeCofactor = CURVE_ORDER * _2n2 < Fp.ORDER;
  function isBiggerThanHalfOrder(number) {
    const HALF = CURVE_ORDER >> _1n4;
    return number > HALF;
  }
  function validateRS(title, num3) {
    if (!Fn.isValidNot0(num3))
      throw new Error(`invalid signature ${title}: out of range 1..Point.Fn.ORDER`);
    return num3;
  }
  function assertSmallCofactor() {
    if (hasLargeCofactor)
      throw new Error('"recovered" sig type is not supported for cofactor >2 curves');
  }
  function validateSigLength(bytes, format) {
    validateSigFormat(format);
    const size = lengths.signature;
    const sizer = format === "compact" ? size : format === "recovered" ? size + 1 : void 0;
    return abytes(bytes, sizer);
  }
  class Signature {
    r;
    s;
    recovery;
    constructor(r, s, recovery) {
      this.r = validateRS("r", r);
      this.s = validateRS("s", s);
      if (recovery != null) {
        assertSmallCofactor();
        if (![0, 1, 2, 3].includes(recovery))
          throw new Error("invalid recovery id");
        this.recovery = recovery;
      }
      Object.freeze(this);
    }
    static fromBytes(bytes, format = defaultSigOpts.format) {
      validateSigLength(bytes, format);
      let recid;
      if (format === "der") {
        const { r: r2, s: s2 } = DER.toSig(abytes(bytes));
        return new Signature(r2, s2);
      }
      if (format === "recovered") {
        recid = bytes[0];
        format = "compact";
        bytes = bytes.subarray(1);
      }
      const L = lengths.signature / 2;
      const r = bytes.subarray(0, L);
      const s = bytes.subarray(L, L * 2);
      return new Signature(Fn.fromBytes(r), Fn.fromBytes(s), recid);
    }
    static fromHex(hex, format) {
      return this.fromBytes(hexToBytes(hex), format);
    }
    assertRecovery() {
      const { recovery } = this;
      if (recovery == null)
        throw new Error("invalid recovery id: must be present");
      return recovery;
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    recoverPublicKey(messageHash) {
      const { r, s } = this;
      const recovery = this.assertRecovery();
      const radj = recovery === 2 || recovery === 3 ? r + CURVE_ORDER : r;
      if (!Fp.isValid(radj))
        throw new Error("invalid recovery id: sig.r+curve.n != R.x");
      const x = Fp.toBytes(radj);
      const R = Point.fromBytes(concatBytes(pprefix((recovery & 1) === 0), x));
      const ir = Fn.inv(radj);
      const h = bits2int_modN(abytes(messageHash, void 0, "msgHash"));
      const u1 = Fn.create(-h * ir);
      const u2 = Fn.create(s * ir);
      const Q = Point.BASE.multiplyUnsafe(u1).add(R.multiplyUnsafe(u2));
      if (Q.is0())
        throw new Error("invalid recovery: point at infinify");
      Q.assertValidity();
      return Q;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    toBytes(format = defaultSigOpts.format) {
      validateSigFormat(format);
      if (format === "der")
        return hexToBytes(DER.hexFromSig(this));
      const { r, s } = this;
      const rb = Fn.toBytes(r);
      const sb = Fn.toBytes(s);
      if (format === "recovered") {
        assertSmallCofactor();
        return concatBytes(Uint8Array.of(this.assertRecovery()), rb, sb);
      }
      return concatBytes(rb, sb);
    }
    toHex(format) {
      return bytesToHex(this.toBytes(format));
    }
  }
  const bits2int = ecdsaOpts.bits2int || function bits2int_def(bytes) {
    if (bytes.length > 8192)
      throw new Error("input is too large");
    const num3 = bytesToNumberBE(bytes);
    const delta = bytes.length * 8 - fnBits;
    return delta > 0 ? num3 >> BigInt(delta) : num3;
  };
  const bits2int_modN = ecdsaOpts.bits2int_modN || function bits2int_modN_def(bytes) {
    return Fn.create(bits2int(bytes));
  };
  const ORDER_MASK = bitMask(fnBits);
  function int2octets(num3) {
    aInRange("num < 2^" + fnBits, num3, _0n4, ORDER_MASK);
    return Fn.toBytes(num3);
  }
  function validateMsgAndHash(message, prehash) {
    abytes(message, void 0, "message");
    return prehash ? abytes(hash(message), void 0, "prehashed message") : message;
  }
  function prepSig(message, secretKey, opts) {
    const { lowS, prehash, extraEntropy } = validateSigOpts(opts, defaultSigOpts);
    message = validateMsgAndHash(message, prehash);
    const h1int = bits2int_modN(message);
    const d5 = Fn.fromBytes(secretKey);
    if (!Fn.isValidNot0(d5))
      throw new Error("invalid private key");
    const seedArgs = [int2octets(d5), int2octets(h1int)];
    if (extraEntropy != null && extraEntropy !== false) {
      const e = extraEntropy === true ? randomBytes5(lengths.secretKey) : extraEntropy;
      seedArgs.push(abytes(e, void 0, "extraEntropy"));
    }
    const seed = concatBytes(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!Fn.isValidNot0(k))
        return;
      const ik = Fn.inv(k);
      const q = Point.BASE.multiply(k).toAffine();
      const r = Fn.create(q.x);
      if (r === _0n4)
        return;
      const s = Fn.create(ik * Fn.create(m + r * d5));
      if (s === _0n4)
        return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n4);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = Fn.neg(s);
        recovery ^= 1;
      }
      return new Signature(r, normS, hasLargeCofactor ? void 0 : recovery);
    }
    return { seed, k2sig };
  }
  function sign(message, secretKey, opts = {}) {
    const { seed, k2sig } = prepSig(message, secretKey, opts);
    const drbg = createHmacDrbg(hash.outputLen, Fn.BYTES, hmac4);
    const sig = drbg(seed, k2sig);
    return sig.toBytes(opts.format);
  }
  function verify(signature, message, publicKey, opts = {}) {
    const { lowS, prehash, format } = validateSigOpts(opts, defaultSigOpts);
    publicKey = abytes(publicKey, void 0, "publicKey");
    message = validateMsgAndHash(message, prehash);
    if (!isBytes(signature)) {
      const end = signature instanceof Signature ? ", use sig.toBytes()" : "";
      throw new Error("verify expects Uint8Array signature" + end);
    }
    validateSigLength(signature, format);
    try {
      const sig = Signature.fromBytes(signature, format);
      const P = Point.fromBytes(publicKey);
      if (lowS && sig.hasHighS())
        return false;
      const { r, s } = sig;
      const h = bits2int_modN(message);
      const is = Fn.inv(s);
      const u1 = Fn.create(h * is);
      const u2 = Fn.create(r * is);
      const R = Point.BASE.multiplyUnsafe(u1).add(P.multiplyUnsafe(u2));
      if (R.is0())
        return false;
      const v = Fn.create(R.x);
      return v === r;
    } catch (e) {
      return false;
    }
  }
  function recoverPublicKey(signature, message, opts = {}) {
    const { prehash } = validateSigOpts(opts, defaultSigOpts);
    message = validateMsgAndHash(message, prehash);
    return Signature.fromBytes(signature, "recovered").recoverPublicKey(message).toBytes();
  }
  return Object.freeze({
    keygen,
    getPublicKey: getPublicKey2,
    getSharedSecret,
    utils,
    lengths,
    Point,
    sign,
    verify,
    recoverPublicKey,
    Signature,
    hash
  });
}

// node_modules/@noble/curves/secp256k1.js
var secp256k1_CURVE = {
  p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: BigInt(1),
  a: BigInt(0),
  b: BigInt(7),
  Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
  Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
};
var secp256k1_ENDO = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  basises: [
    [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
    [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
  ]
};
var _0n5 = /* @__PURE__ */ BigInt(0);
var _2n3 = /* @__PURE__ */ BigInt(2);
function sqrtMod(y) {
  const P = secp256k1_CURVE.p;
  const _3n5 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y * y * y % P;
  const b3 = b2 * b2 * y % P;
  const b6 = pow2(b3, _3n5, P) * b3 % P;
  const b9 = pow2(b6, _3n5, P) * b3 % P;
  const b11 = pow2(b9, _2n3, P) * b2 % P;
  const b22 = pow2(b11, _11n, P) * b11 % P;
  const b44 = pow2(b22, _22n, P) * b22 % P;
  const b88 = pow2(b44, _44n, P) * b44 % P;
  const b176 = pow2(b88, _88n, P) * b88 % P;
  const b220 = pow2(b176, _44n, P) * b44 % P;
  const b223 = pow2(b220, _3n5, P) * b3 % P;
  const t1 = pow2(b223, _23n, P) * b22 % P;
  const t2 = pow2(t1, _6n, P) * b2 % P;
  const root = pow2(t2, _2n3, P);
  if (!Fpk1.eql(Fpk1.sqr(root), y))
    throw new Error("Cannot find square root");
  return root;
}
var Fpk1 = Field(secp256k1_CURVE.p, { sqrt: sqrtMod });
var Pointk1 = /* @__PURE__ */ weierstrass(secp256k1_CURVE, {
  Fp: Fpk1,
  endo: secp256k1_ENDO
});
var secp256k1 = /* @__PURE__ */ ecdsa(Pointk1, sha256);
var TAGGED_HASH_PREFIXES = {};
function taggedHash(tag2, ...messages) {
  let tagP = TAGGED_HASH_PREFIXES[tag2];
  if (tagP === void 0) {
    const tagH = sha256(asciiToBytes(tag2));
    tagP = concatBytes(tagH, tagH);
    TAGGED_HASH_PREFIXES[tag2] = tagP;
  }
  return sha256(concatBytes(tagP, ...messages));
}
var pointToBytes = (point) => point.toBytes(true).slice(1);
var hasEven = (y) => y % _2n3 === _0n5;
function schnorrGetExtPubKey(priv) {
  const { Fn, BASE } = Pointk1;
  const d_ = Fn.fromBytes(priv);
  const p = BASE.multiply(d_);
  const scalar = hasEven(p.y) ? d_ : Fn.neg(d_);
  return { scalar, bytes: pointToBytes(p) };
}
function lift_x(x) {
  const Fp = Fpk1;
  if (!Fp.isValidNot0(x))
    throw new Error("invalid x: Fail if x \u2265 p");
  const xx = Fp.create(x * x);
  const c = Fp.create(xx * x + BigInt(7));
  let y = Fp.sqrt(c);
  if (!hasEven(y))
    y = Fp.neg(y);
  const p = Pointk1.fromAffine({ x, y });
  p.assertValidity();
  return p;
}
var num = bytesToNumberBE;
function challenge(...args) {
  return Pointk1.Fn.create(num(taggedHash("BIP0340/challenge", ...args)));
}
function schnorrGetPublicKey(secretKey) {
  return schnorrGetExtPubKey(secretKey).bytes;
}
function schnorrSign(message, secretKey, auxRand = randomBytes(32)) {
  const { Fn } = Pointk1;
  const m = abytes(message, void 0, "message");
  const { bytes: px, scalar: d5 } = schnorrGetExtPubKey(secretKey);
  const a = abytes(auxRand, 32, "auxRand");
  const t = Fn.toBytes(d5 ^ num(taggedHash("BIP0340/aux", a)));
  const rand = taggedHash("BIP0340/nonce", t, px, m);
  const { bytes: rx, scalar: k } = schnorrGetExtPubKey(rand);
  const e = challenge(rx, px, m);
  const sig = new Uint8Array(64);
  sig.set(rx, 0);
  sig.set(Fn.toBytes(Fn.create(k + e * d5)), 32);
  if (!schnorrVerify(sig, m, px))
    throw new Error("sign: Invalid signature produced");
  return sig;
}
function schnorrVerify(signature, message, publicKey) {
  const { Fp, Fn, BASE } = Pointk1;
  const sig = abytes(signature, 64, "signature");
  const m = abytes(message, void 0, "message");
  const pub = abytes(publicKey, 32, "publicKey");
  try {
    const P = lift_x(num(pub));
    const r = num(sig.subarray(0, 32));
    if (!Fp.isValidNot0(r))
      return false;
    const s = num(sig.subarray(32, 64));
    if (!Fn.isValidNot0(s))
      return false;
    const e = challenge(Fn.toBytes(r), pointToBytes(P), m);
    const R = BASE.multiplyUnsafe(s).add(P.multiplyUnsafe(Fn.neg(e)));
    const { x, y } = R.toAffine();
    if (R.is0() || !hasEven(y) || x !== r)
      return false;
    return true;
  } catch (error) {
    return false;
  }
}
var schnorr = /* @__PURE__ */ (() => {
  const size = 32;
  const seedLength = 48;
  const randomSecretKey = (seed = randomBytes(seedLength)) => {
    return mapHashToField(seed, secp256k1_CURVE.n);
  };
  return {
    keygen: createKeygen(randomSecretKey, schnorrGetPublicKey),
    getPublicKey: schnorrGetPublicKey,
    sign: schnorrSign,
    verify: schnorrVerify,
    Point: Pointk1,
    utils: {
      randomSecretKey,
      taggedHash,
      lift_x,
      pointToBytes
    },
    lengths: {
      secretKey: size,
      publicKey: size,
      publicKeyHasPrefix: false,
      signature: size * 2,
      seed: seedLength
    }
  };
})();

// node_modules/nostr-tools/node_modules/@noble/hashes/utils.js
function isBytes2(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function anumber2(n, title = "") {
  if (!Number.isSafeInteger(n) || n < 0) {
    const prefix = title && `"${title}" `;
    throw new Error(`${prefix}expected integer >= 0, got ${n}`);
  }
}
function abytes2(value, length, title = "") {
  const bytes = isBytes2(value);
  const len = value?.length;
  const needsLen = length !== void 0;
  if (!bytes || needsLen && len !== length) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
  }
  return value;
}
function ahash2(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new Error("Hash must wrapped by utils.createHasher");
  anumber2(h.outputLen);
  anumber2(h.blockLen);
}
function aexists2(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput2(out, instance) {
  abytes2(out, void 0, "digestInto() output");
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error('"digestInto() output" expected to be of length >=' + min);
  }
}
function clean2(...arrays) {
  for (let i2 = 0; i2 < arrays.length; i2++) {
    arrays[i2].fill(0);
  }
}
function createView2(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr2(word, shift) {
  return word << 32 - shift | word >>> shift;
}
var hasHexBuiltin2 = /* @__PURE__ */ (() => (
  // @ts-ignore
  typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
))();
var hexes2 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i2) => i2.toString(16).padStart(2, "0"));
function bytesToHex2(bytes) {
  abytes2(bytes);
  if (hasHexBuiltin2)
    return bytes.toHex();
  let hex = "";
  for (let i2 = 0; i2 < bytes.length; i2++) {
    hex += hexes2[bytes[i2]];
  }
  return hex;
}
var asciis2 = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function asciiToBase162(ch) {
  if (ch >= asciis2._0 && ch <= asciis2._9)
    return ch - asciis2._0;
  if (ch >= asciis2.A && ch <= asciis2.F)
    return ch - (asciis2.A - 10);
  if (ch >= asciis2.a && ch <= asciis2.f)
    return ch - (asciis2.a - 10);
  return;
}
function hexToBytes2(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  if (hasHexBuiltin2)
    return Uint8Array.fromHex(hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase162(hex.charCodeAt(hi));
    const n2 = asciiToBase162(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
function concatBytes2(...arrays) {
  let sum = 0;
  for (let i2 = 0; i2 < arrays.length; i2++) {
    const a = arrays[i2];
    abytes2(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i2 = 0, pad2 = 0; i2 < arrays.length; i2++) {
    const a = arrays[i2];
    res.set(a, pad2);
    pad2 += a.length;
  }
  return res;
}
function createHasher2(hashCons, info = {}) {
  const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
  const tmp = hashCons(void 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = (opts) => hashCons(opts);
  Object.assign(hashC, info);
  return Object.freeze(hashC);
}
function randomBytes2(bytesLength = 32) {
  const cr = typeof globalThis === "object" ? globalThis.crypto : null;
  if (typeof cr?.getRandomValues !== "function")
    throw new Error("crypto.getRandomValues must be defined");
  return cr.getRandomValues(new Uint8Array(bytesLength));
}
var oidNist2 = (suffix) => ({
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
});

// node_modules/nostr-tools/node_modules/@noble/hashes/_md.js
function Chi2(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj2(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD2 = class {
  blockLen;
  outputLen;
  padOffset;
  isLE;
  // For partial updates less than block size
  buffer;
  view;
  finished = false;
  length = 0;
  pos = 0;
  destroyed = false;
  constructor(blockLen, outputLen, padOffset, isLE2) {
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE2;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView2(this.buffer);
  }
  update(data) {
    aexists2(this);
    abytes2(data);
    const { view, buffer, blockLen } = this;
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
    aexists2(this);
    aoutput2(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE2 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    clean2(this.buffer.subarray(pos));
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i2 = pos; i2 < blockLen; i2++)
      buffer[i2] = 0;
    view.setBigUint64(blockLen - 8, BigInt(this.length * 8), isLE2);
    this.process(view, 0);
    const oview = createView2(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen must be aligned to 32bit");
    const outLen = len / 4;
    const state2 = this.get();
    if (outLen > state2.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i2 = 0; i2 < outLen; i2++)
      oview.setUint32(4 * i2, state2[i2], isLE2);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to ||= new this.constructor();
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
};
var SHA256_IV2 = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);

// node_modules/nostr-tools/node_modules/@noble/hashes/sha2.js
var SHA256_K2 = /* @__PURE__ */ Uint32Array.from([
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
var SHA256_W2 = /* @__PURE__ */ new Uint32Array(64);
var SHA2_32B2 = class extends HashMD2 {
  constructor(outputLen) {
    super(64, outputLen, 8, false);
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
    clean2(SHA256_W2);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean2(this.buffer);
  }
};
var _SHA2562 = class extends SHA2_32B2 {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  A = SHA256_IV2[0] | 0;
  B = SHA256_IV2[1] | 0;
  C = SHA256_IV2[2] | 0;
  D = SHA256_IV2[3] | 0;
  E = SHA256_IV2[4] | 0;
  F = SHA256_IV2[5] | 0;
  G = SHA256_IV2[6] | 0;
  H = SHA256_IV2[7] | 0;
  constructor() {
    super(32);
  }
};
var sha2562 = /* @__PURE__ */ createHasher2(
  () => new _SHA2562(),
  /* @__PURE__ */ oidNist2(1)
);

// node_modules/nostr-tools/node_modules/@scure/base/index.js
function isBytes3(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function abytes3(b) {
  if (!isBytes3(b))
    throw new Error("Uint8Array expected");
}
function isArrayOf(isString, arr) {
  if (!Array.isArray(arr))
    return false;
  if (arr.length === 0)
    return true;
  if (isString) {
    return arr.every((item) => typeof item === "string");
  } else {
    return arr.every((item) => Number.isSafeInteger(item));
  }
}
function afn(input) {
  if (typeof input !== "function")
    throw new Error("function expected");
  return true;
}
function astr(label, input) {
  if (typeof input !== "string")
    throw new Error(`${label}: string expected`);
  return true;
}
function anumber3(n) {
  if (!Number.isSafeInteger(n))
    throw new Error(`invalid integer: ${n}`);
}
function aArr(input) {
  if (!Array.isArray(input))
    throw new Error("array expected");
}
function astrArr(label, input) {
  if (!isArrayOf(true, input))
    throw new Error(`${label}: array of strings expected`);
}
function anumArr(label, input) {
  if (!isArrayOf(false, input))
    throw new Error(`${label}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function chain(...args) {
  const id = (a) => a;
  const wrap = (a, b) => (c) => a(b(c));
  const encode2 = args.map((x) => x.encode).reduceRight(wrap, id);
  const decode4 = args.map((x) => x.decode).reduce(wrap, id);
  return { encode: encode2, decode: decode4 };
}
// @__NO_SIDE_EFFECTS__
function alphabet(letters) {
  const lettersA = typeof letters === "string" ? letters.split("") : letters;
  const len = lettersA.length;
  astrArr("alphabet", lettersA);
  const indexes = new Map(lettersA.map((l, i2) => [l, i2]));
  return {
    encode: (digits) => {
      aArr(digits);
      return digits.map((i2) => {
        if (!Number.isSafeInteger(i2) || i2 < 0 || i2 >= len)
          throw new Error(`alphabet.encode: digit index outside alphabet "${i2}". Allowed: ${letters}`);
        return lettersA[i2];
      });
    },
    decode: (input) => {
      aArr(input);
      return input.map((letter) => {
        astr("alphabet.decode", letter);
        const i2 = indexes.get(letter);
        if (i2 === void 0)
          throw new Error(`Unknown letter: "${letter}". Allowed: ${letters}`);
        return i2;
      });
    }
  };
}
// @__NO_SIDE_EFFECTS__
function join(separator = "") {
  astr("join", separator);
  return {
    encode: (from) => {
      astrArr("join.decode", from);
      return from.join(separator);
    },
    decode: (to) => {
      astr("join.decode", to);
      return to.split(separator);
    }
  };
}
// @__NO_SIDE_EFFECTS__
function padding(bits, chr = "=") {
  anumber3(bits);
  astr("padding", chr);
  return {
    encode(data) {
      astrArr("padding.encode", data);
      while (data.length * bits % 8)
        data.push(chr);
      return data;
    },
    decode(input) {
      astrArr("padding.decode", input);
      let end = input.length;
      if (end * bits % 8)
        throw new Error("padding: invalid, string should have whole number of bytes");
      for (; end > 0 && input[end - 1] === chr; end--) {
        const last = end - 1;
        const byte = last * bits;
        if (byte % 8 === 0)
          throw new Error("padding: invalid, string has too much padding");
      }
      return input.slice(0, end);
    }
  };
}
var gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
var radix2carry = /* @__NO_SIDE_EFFECTS__ */ (from, to) => from + (to - gcd(from, to));
var powers = /* @__PURE__ */ (() => {
  let res = [];
  for (let i2 = 0; i2 < 40; i2++)
    res.push(2 ** i2);
  return res;
})();
function convertRadix2(data, from, to, padding2) {
  aArr(data);
  if (from <= 0 || from > 32)
    throw new Error(`convertRadix2: wrong from=${from}`);
  if (to <= 0 || to > 32)
    throw new Error(`convertRadix2: wrong to=${to}`);
  if (/* @__PURE__ */ radix2carry(from, to) > 32) {
    throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${/* @__PURE__ */ radix2carry(from, to)}`);
  }
  let carry = 0;
  let pos = 0;
  const max = powers[from];
  const mask = powers[to] - 1;
  const res = [];
  for (const n of data) {
    anumber3(n);
    if (n >= max)
      throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
    carry = carry << from | n;
    if (pos + from > 32)
      throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
    pos += from;
    for (; pos >= to; pos -= to)
      res.push((carry >> pos - to & mask) >>> 0);
    const pow = powers[pos];
    if (pow === void 0)
      throw new Error("invalid carry");
    carry &= pow - 1;
  }
  carry = carry << to - pos & mask;
  if (!padding2 && pos >= from)
    throw new Error("Excess padding");
  if (!padding2 && carry > 0)
    throw new Error(`Non-zero padding: ${carry}`);
  if (padding2 && pos > 0)
    res.push(carry >>> 0);
  return res;
}
// @__NO_SIDE_EFFECTS__
function radix2(bits, revPadding = false) {
  anumber3(bits);
  if (bits <= 0 || bits > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (/* @__PURE__ */ radix2carry(8, bits) > 32 || /* @__PURE__ */ radix2carry(bits, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (bytes) => {
      if (!isBytes3(bytes))
        throw new Error("radix2.encode input should be Uint8Array");
      return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
    },
    decode: (digits) => {
      anumArr("radix2.decode", digits);
      return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
    }
  };
}
function unsafeWrapper(fn) {
  afn(fn);
  return function(...args) {
    try {
      return fn.apply(null, args);
    } catch (e) {
    }
  };
}
var hasBase64Builtin = /* @__PURE__ */ (() => typeof Uint8Array.from([]).toBase64 === "function" && typeof Uint8Array.fromBase64 === "function")();
var decodeBase64Builtin = (s, isUrl) => {
  astr("base64", s);
  const re = isUrl ? /^[A-Za-z0-9=_-]+$/ : /^[A-Za-z0-9=+/]+$/;
  const alphabet2 = isUrl ? "base64url" : "base64";
  if (s.length > 0 && !re.test(s))
    throw new Error("invalid base64");
  return Uint8Array.fromBase64(s, { alphabet: alphabet2, lastChunkHandling: "strict" });
};
var base64 = hasBase64Builtin ? {
  encode(b) {
    abytes3(b);
    return b.toBase64();
  },
  decode(s) {
    return decodeBase64Builtin(s, false);
  }
} : /* @__PURE__ */ chain(/* @__PURE__ */ radix2(6), /* @__PURE__ */ alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), /* @__PURE__ */ padding(6), /* @__PURE__ */ join(""));
var BECH_ALPHABET = /* @__PURE__ */ chain(/* @__PURE__ */ alphabet("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), /* @__PURE__ */ join(""));
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
  return BECH_ALPHABET.encode(convertRadix2([chk % powers[30]], 30, 5, false));
}
// @__NO_SIDE_EFFECTS__
function genBech32(encoding) {
  const ENCODING_CONST = encoding === "bech32" ? 1 : 734539939;
  const _words = /* @__PURE__ */ radix2(5);
  const fromWords = _words.decode;
  const toWords = _words.encode;
  const fromWordsUnsafe = unsafeWrapper(fromWords);
  function encode2(prefix, words, limit = 90) {
    astr("bech32.encode prefix", prefix);
    if (isBytes3(words))
      words = Array.from(words);
    anumArr("bech32.encode", words);
    const plen = prefix.length;
    if (plen === 0)
      throw new TypeError(`Invalid prefix length ${plen}`);
    const actualLength = plen + 7 + words.length;
    if (limit !== false && actualLength > limit)
      throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
    const lowered = prefix.toLowerCase();
    const sum = bechChecksum(lowered, words, ENCODING_CONST);
    return `${lowered}1${BECH_ALPHABET.encode(words)}${sum}`;
  }
  function decode4(str, limit = 90) {
    astr("bech32.decode input", str);
    const slen = str.length;
    if (slen < 8 || limit !== false && slen > limit)
      throw new TypeError(`invalid string length: ${slen} (${str}). Expected (8..${limit})`);
    const lowered = str.toLowerCase();
    if (str !== lowered && str !== str.toUpperCase())
      throw new Error(`String must be lowercase or uppercase`);
    const sepIndex = lowered.lastIndexOf("1");
    if (sepIndex === 0 || sepIndex === -1)
      throw new Error(`Letter "1" must be present between prefix and data only`);
    const prefix = lowered.slice(0, sepIndex);
    const data = lowered.slice(sepIndex + 1);
    if (data.length < 6)
      throw new Error("Data must be at least 6 characters long");
    const words = BECH_ALPHABET.decode(data).slice(0, -6);
    const sum = bechChecksum(prefix, words, ENCODING_CONST);
    if (!data.endsWith(sum))
      throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
    return { prefix, words };
  }
  const decodeUnsafe = unsafeWrapper(decode4);
  function decodeToBytes(str) {
    const { prefix, words } = decode4(str, false);
    return { prefix, words, bytes: fromWords(words) };
  }
  function encodeFromBytes(prefix, bytes) {
    return encode2(prefix, toWords(bytes));
  }
  return {
    encode: encode2,
    decode: decode4,
    encodeFromBytes,
    decodeToBytes,
    decodeUnsafe,
    fromWords,
    fromWordsUnsafe,
    toWords
  };
}
var bech32 = /* @__PURE__ */ genBech32("bech32");

// node_modules/@noble/ciphers/utils.js
function isBytes4(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function abool2(b) {
  if (typeof b !== "boolean")
    throw new Error(`boolean expected, not ${b}`);
}
function anumber4(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error("positive integer expected, got " + n);
}
function abytes4(value, length, title = "") {
  const bytes = isBytes4(value);
  const len = value?.length;
  const needsLen = length !== void 0;
  if (!bytes || needsLen && len !== length) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
  }
  return value;
}
function aexists3(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput3(out, instance) {
  abytes4(out, void 0, "output");
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function u32(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean3(...arrays) {
  for (let i2 = 0; i2 < arrays.length; i2++) {
    arrays[i2].fill(0);
  }
}
function createView3(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
var isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
function overlapBytes(a, b) {
  return a.buffer === b.buffer && // best we can do, may fail with an obscure Proxy
  a.byteOffset < b.byteOffset + b.byteLength && // a starts before b end
  b.byteOffset < a.byteOffset + a.byteLength;
}
function complexOverlapBytes(input, output) {
  if (overlapBytes(input, output) && input.byteOffset < output.byteOffset)
    throw new Error("complex overlap of input and output is not supported");
}
function checkOpts(defaults, opts) {
  if (opts == null || typeof opts !== "object")
    throw new Error("options must be defined");
  const merged = Object.assign(defaults, opts);
  return merged;
}
function equalBytes(a, b) {
  if (a.length !== b.length)
    return false;
  let diff = 0;
  for (let i2 = 0; i2 < a.length; i2++)
    diff |= a[i2] ^ b[i2];
  return diff === 0;
}
var wrapCipher = /* @__NO_SIDE_EFFECTS__ */ (params, constructor) => {
  function wrappedCipher(key, ...args) {
    abytes4(key, void 0, "key");
    if (!isLE)
      throw new Error("Non little-endian hardware is not yet supported");
    if (params.nonceLength !== void 0) {
      const nonce = args[0];
      abytes4(nonce, params.varSizeNonce ? void 0 : params.nonceLength, "nonce");
    }
    const tagl = params.tagLength;
    if (tagl && args[1] !== void 0)
      abytes4(args[1], void 0, "AAD");
    const cipher = constructor(key, ...args);
    const checkOutput = (fnLength, output) => {
      if (output !== void 0) {
        if (fnLength !== 2)
          throw new Error("cipher output not supported");
        abytes4(output, void 0, "output");
      }
    };
    let called = false;
    const wrCipher = {
      encrypt(data, output) {
        if (called)
          throw new Error("cannot encrypt() twice with same key + nonce");
        called = true;
        abytes4(data);
        checkOutput(cipher.encrypt.length, output);
        return cipher.encrypt(data, output);
      },
      decrypt(data, output) {
        abytes4(data);
        if (tagl && data.length < tagl)
          throw new Error('"ciphertext" expected length bigger than tagLength=' + tagl);
        checkOutput(cipher.decrypt.length, output);
        return cipher.decrypt(data, output);
      }
    };
    return wrCipher;
  }
  Object.assign(wrappedCipher, params);
  return wrappedCipher;
};
function getOutput(expectedLength, out, onlyAligned = true) {
  if (out === void 0)
    return new Uint8Array(expectedLength);
  if (out.length !== expectedLength)
    throw new Error('"output" expected Uint8Array of length ' + expectedLength + ", got: " + out.length);
  if (onlyAligned && !isAligned32(out))
    throw new Error("invalid output, must be aligned");
  return out;
}
function u64Lengths(dataLength, aadLength, isLE2) {
  abool2(isLE2);
  const num3 = new Uint8Array(16);
  const view = createView3(num3);
  view.setBigUint64(0, BigInt(aadLength), isLE2);
  view.setBigUint64(8, BigInt(dataLength), isLE2);
  return num3;
}
function isAligned32(bytes) {
  return bytes.byteOffset % 4 === 0;
}
function copyBytes2(bytes) {
  return Uint8Array.from(bytes);
}

// node_modules/@noble/ciphers/aes.js
var BLOCK_SIZE = 16;
var POLY = 283;
function validateKeyLength(key) {
  if (![16, 24, 32].includes(key.length))
    throw new Error('"aes key" expected Uint8Array of length 16/24/32, got length=' + key.length);
}
function mul2(n) {
  return n << 1 ^ POLY & -(n >> 7);
}
function mul(a, b) {
  let res = 0;
  for (; b > 0; b >>= 1) {
    res ^= a & -(b & 1);
    a = mul2(a);
  }
  return res;
}
var sbox = /* @__PURE__ */ (() => {
  const t = new Uint8Array(256);
  for (let i2 = 0, x = 1; i2 < 256; i2++, x ^= mul2(x))
    t[i2] = x;
  const box = new Uint8Array(256);
  box[0] = 99;
  for (let i2 = 0; i2 < 255; i2++) {
    let x = t[255 - i2];
    x |= x << 8;
    box[t[i2]] = (x ^ x >> 4 ^ x >> 5 ^ x >> 6 ^ x >> 7 ^ 99) & 255;
  }
  clean3(t);
  return box;
})();
var invSbox = /* @__PURE__ */ sbox.map((_, j) => sbox.indexOf(j));
var rotr32_8 = (n) => n << 24 | n >>> 8;
var rotl32_8 = (n) => n << 8 | n >>> 24;
function genTtable(sbox2, fn) {
  if (sbox2.length !== 256)
    throw new Error("Wrong sbox length");
  const T0 = new Uint32Array(256).map((_, j) => fn(sbox2[j]));
  const T1 = T0.map(rotl32_8);
  const T2 = T1.map(rotl32_8);
  const T3 = T2.map(rotl32_8);
  const T01 = new Uint32Array(256 * 256);
  const T23 = new Uint32Array(256 * 256);
  const sbox22 = new Uint16Array(256 * 256);
  for (let i2 = 0; i2 < 256; i2++) {
    for (let j = 0; j < 256; j++) {
      const idx = i2 * 256 + j;
      T01[idx] = T0[i2] ^ T1[j];
      T23[idx] = T2[i2] ^ T3[j];
      sbox22[idx] = sbox2[i2] << 8 | sbox2[j];
    }
  }
  return { sbox: sbox2, sbox2: sbox22, T0, T1, T2, T3, T01, T23 };
}
var tableEncoding = /* @__PURE__ */ genTtable(sbox, (s) => mul(s, 3) << 24 | s << 16 | s << 8 | mul(s, 2));
var tableDecoding = /* @__PURE__ */ genTtable(invSbox, (s) => mul(s, 11) << 24 | mul(s, 13) << 16 | mul(s, 9) << 8 | mul(s, 14));
var xPowers = /* @__PURE__ */ (() => {
  const p = new Uint8Array(16);
  for (let i2 = 0, x = 1; i2 < 16; i2++, x = mul2(x))
    p[i2] = x;
  return p;
})();
function expandKeyLE(key) {
  abytes4(key);
  const len = key.length;
  validateKeyLength(key);
  const { sbox2 } = tableEncoding;
  const toClean = [];
  if (!isAligned32(key))
    toClean.push(key = copyBytes2(key));
  const k32 = u32(key);
  const Nk = k32.length;
  const subByte = (n) => applySbox(sbox2, n, n, n, n);
  const xk = new Uint32Array(len + 28);
  xk.set(k32);
  for (let i2 = Nk; i2 < xk.length; i2++) {
    let t = xk[i2 - 1];
    if (i2 % Nk === 0)
      t = subByte(rotr32_8(t)) ^ xPowers[i2 / Nk - 1];
    else if (Nk > 6 && i2 % Nk === 4)
      t = subByte(t);
    xk[i2] = xk[i2 - Nk] ^ t;
  }
  clean3(...toClean);
  return xk;
}
function expandKeyDecLE(key) {
  const encKey = expandKeyLE(key);
  const xk = encKey.slice();
  const Nk = encKey.length;
  const { sbox2 } = tableEncoding;
  const { T0, T1, T2, T3 } = tableDecoding;
  for (let i2 = 0; i2 < Nk; i2 += 4) {
    for (let j = 0; j < 4; j++)
      xk[i2 + j] = encKey[Nk - i2 - 4 + j];
  }
  clean3(encKey);
  for (let i2 = 4; i2 < Nk - 4; i2++) {
    const x = xk[i2];
    const w = applySbox(sbox2, x, x, x, x);
    xk[i2] = T0[w & 255] ^ T1[w >>> 8 & 255] ^ T2[w >>> 16 & 255] ^ T3[w >>> 24];
  }
  return xk;
}
function apply0123(T01, T23, s0, s1, s2, s3) {
  return T01[s0 << 8 & 65280 | s1 >>> 8 & 255] ^ T23[s2 >>> 8 & 65280 | s3 >>> 24 & 255];
}
function applySbox(sbox2, s0, s1, s2, s3) {
  return sbox2[s0 & 255 | s1 & 65280] | sbox2[s2 >>> 16 & 255 | s3 >>> 16 & 65280] << 16;
}
function encrypt(xk, s0, s1, s2, s3) {
  const { sbox2, T01, T23 } = tableEncoding;
  let k = 0;
  s0 ^= xk[k++], s1 ^= xk[k++], s2 ^= xk[k++], s3 ^= xk[k++];
  const rounds = xk.length / 4 - 2;
  for (let i2 = 0; i2 < rounds; i2++) {
    const t02 = xk[k++] ^ apply0123(T01, T23, s0, s1, s2, s3);
    const t12 = xk[k++] ^ apply0123(T01, T23, s1, s2, s3, s0);
    const t22 = xk[k++] ^ apply0123(T01, T23, s2, s3, s0, s1);
    const t32 = xk[k++] ^ apply0123(T01, T23, s3, s0, s1, s2);
    s0 = t02, s1 = t12, s2 = t22, s3 = t32;
  }
  const t0 = xk[k++] ^ applySbox(sbox2, s0, s1, s2, s3);
  const t1 = xk[k++] ^ applySbox(sbox2, s1, s2, s3, s0);
  const t2 = xk[k++] ^ applySbox(sbox2, s2, s3, s0, s1);
  const t3 = xk[k++] ^ applySbox(sbox2, s3, s0, s1, s2);
  return { s0: t0, s1: t1, s2: t2, s3: t3 };
}
function decrypt(xk, s0, s1, s2, s3) {
  const { sbox2, T01, T23 } = tableDecoding;
  let k = 0;
  s0 ^= xk[k++], s1 ^= xk[k++], s2 ^= xk[k++], s3 ^= xk[k++];
  const rounds = xk.length / 4 - 2;
  for (let i2 = 0; i2 < rounds; i2++) {
    const t02 = xk[k++] ^ apply0123(T01, T23, s0, s3, s2, s1);
    const t12 = xk[k++] ^ apply0123(T01, T23, s1, s0, s3, s2);
    const t22 = xk[k++] ^ apply0123(T01, T23, s2, s1, s0, s3);
    const t32 = xk[k++] ^ apply0123(T01, T23, s3, s2, s1, s0);
    s0 = t02, s1 = t12, s2 = t22, s3 = t32;
  }
  const t0 = xk[k++] ^ applySbox(sbox2, s0, s3, s2, s1);
  const t1 = xk[k++] ^ applySbox(sbox2, s1, s0, s3, s2);
  const t2 = xk[k++] ^ applySbox(sbox2, s2, s1, s0, s3);
  const t3 = xk[k++] ^ applySbox(sbox2, s3, s2, s1, s0);
  return { s0: t0, s1: t1, s2: t2, s3: t3 };
}
function validateBlockDecrypt(data) {
  abytes4(data);
  if (data.length % BLOCK_SIZE !== 0) {
    throw new Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size " + BLOCK_SIZE);
  }
}
function validateBlockEncrypt(plaintext, pcks5, dst) {
  abytes4(plaintext);
  let outLen = plaintext.length;
  const remaining = outLen % BLOCK_SIZE;
  if (!pcks5 && remaining !== 0)
    throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
  if (!isAligned32(plaintext))
    plaintext = copyBytes2(plaintext);
  const b = u32(plaintext);
  if (pcks5) {
    let left = BLOCK_SIZE - remaining;
    if (!left)
      left = BLOCK_SIZE;
    outLen = outLen + left;
  }
  dst = getOutput(outLen, dst);
  complexOverlapBytes(plaintext, dst);
  const o = u32(dst);
  return { b, o, out: dst };
}
function validatePCKS(data, pcks5) {
  if (!pcks5)
    return data;
  const len = data.length;
  if (!len)
    throw new Error("aes/pcks5: empty ciphertext not allowed");
  const lastByte = data[len - 1];
  if (lastByte <= 0 || lastByte > 16)
    throw new Error("aes/pcks5: wrong padding");
  const out = data.subarray(0, -lastByte);
  for (let i2 = 0; i2 < lastByte; i2++)
    if (data[len - i2 - 1] !== lastByte)
      throw new Error("aes/pcks5: wrong padding");
  return out;
}
function padPCKS(left) {
  const tmp = new Uint8Array(16);
  const tmp32 = u32(tmp);
  tmp.set(left);
  const paddingByte = BLOCK_SIZE - left.length;
  for (let i2 = BLOCK_SIZE - paddingByte; i2 < BLOCK_SIZE; i2++)
    tmp[i2] = paddingByte;
  return tmp32;
}
var cbc = /* @__PURE__ */ wrapCipher({ blockSize: 16, nonceLength: 16 }, function aescbc(key, iv, opts = {}) {
  const pcks5 = !opts.disablePadding;
  return {
    encrypt(plaintext, dst) {
      const xk = expandKeyLE(key);
      const { b, o, out: _out } = validateBlockEncrypt(plaintext, pcks5, dst);
      let _iv = iv;
      const toClean = [xk];
      if (!isAligned32(_iv))
        toClean.push(_iv = copyBytes2(_iv));
      const n32 = u32(_iv);
      let s0 = n32[0], s1 = n32[1], s2 = n32[2], s3 = n32[3];
      let i2 = 0;
      for (; i2 + 4 <= b.length; ) {
        s0 ^= b[i2 + 0], s1 ^= b[i2 + 1], s2 ^= b[i2 + 2], s3 ^= b[i2 + 3];
        ({ s0, s1, s2, s3 } = encrypt(xk, s0, s1, s2, s3));
        o[i2++] = s0, o[i2++] = s1, o[i2++] = s2, o[i2++] = s3;
      }
      if (pcks5) {
        const tmp32 = padPCKS(plaintext.subarray(i2 * 4));
        s0 ^= tmp32[0], s1 ^= tmp32[1], s2 ^= tmp32[2], s3 ^= tmp32[3];
        ({ s0, s1, s2, s3 } = encrypt(xk, s0, s1, s2, s3));
        o[i2++] = s0, o[i2++] = s1, o[i2++] = s2, o[i2++] = s3;
      }
      clean3(...toClean);
      return _out;
    },
    decrypt(ciphertext, dst) {
      validateBlockDecrypt(ciphertext);
      const xk = expandKeyDecLE(key);
      let _iv = iv;
      const toClean = [xk];
      if (!isAligned32(_iv))
        toClean.push(_iv = copyBytes2(_iv));
      const n32 = u32(_iv);
      dst = getOutput(ciphertext.length, dst);
      if (!isAligned32(ciphertext))
        toClean.push(ciphertext = copyBytes2(ciphertext));
      complexOverlapBytes(ciphertext, dst);
      const b = u32(ciphertext);
      const o = u32(dst);
      let s0 = n32[0], s1 = n32[1], s2 = n32[2], s3 = n32[3];
      for (let i2 = 0; i2 + 4 <= b.length; ) {
        const ps0 = s0, ps1 = s1, ps2 = s2, ps3 = s3;
        s0 = b[i2 + 0], s1 = b[i2 + 1], s2 = b[i2 + 2], s3 = b[i2 + 3];
        const { s0: o0, s1: o1, s2: o2, s3: o3 } = decrypt(xk, s0, s1, s2, s3);
        o[i2++] = o0 ^ ps0, o[i2++] = o1 ^ ps1, o[i2++] = o2 ^ ps2, o[i2++] = o3 ^ ps3;
      }
      clean3(...toClean);
      return validatePCKS(dst, pcks5);
    }
  };
});
function isBytes32(a) {
  return a instanceof Uint32Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint32Array";
}
function encryptBlock(xk, block2) {
  abytes4(block2, 16, "block");
  if (!isBytes32(xk))
    throw new Error("_encryptBlock accepts result of expandKeyLE");
  const b32 = u32(block2);
  let { s0, s1, s2, s3 } = encrypt(xk, b32[0], b32[1], b32[2], b32[3]);
  b32[0] = s0, b32[1] = s1, b32[2] = s2, b32[3] = s3;
  return block2;
}
function dbl(block2) {
  let carry = 0;
  for (let i2 = BLOCK_SIZE - 1; i2 >= 0; i2--) {
    const newCarry = (block2[i2] & 128) >>> 7;
    block2[i2] = block2[i2] << 1 | carry;
    carry = newCarry;
  }
  if (carry) {
    block2[BLOCK_SIZE - 1] ^= 135;
  }
  return block2;
}
function xorBlock(a, b) {
  if (a.length !== b.length)
    throw new Error("xorBlock: blocks must have same length");
  for (let i2 = 0; i2 < a.length; i2++) {
    a[i2] = a[i2] ^ b[i2];
  }
  return a;
}
var _CMAC = class {
  buffer;
  destroyed;
  k1;
  k2;
  xk;
  constructor(key) {
    abytes4(key);
    validateKeyLength(key);
    this.xk = expandKeyLE(key);
    this.buffer = new Uint8Array(0);
    this.destroyed = false;
    const L = new Uint8Array(BLOCK_SIZE);
    encryptBlock(this.xk, L);
    this.k1 = dbl(L);
    this.k2 = dbl(new Uint8Array(this.k1));
  }
  update(data) {
    const { destroyed, buffer } = this;
    if (destroyed)
      throw new Error("CMAC instance was destroyed");
    abytes4(data);
    const newBuffer = new Uint8Array(buffer.length + data.length);
    newBuffer.set(buffer);
    newBuffer.set(data, buffer.length);
    this.buffer = newBuffer;
    return this;
  }
  // see https://www.rfc-editor.org/rfc/rfc4493.html#section-2.4
  digest() {
    if (this.destroyed)
      throw new Error("CMAC instance was destroyed");
    const { buffer } = this;
    const msgLen = buffer.length;
    let n = Math.ceil(msgLen / BLOCK_SIZE);
    let flag;
    if (n === 0) {
      n = 1;
      flag = false;
    } else {
      flag = msgLen % BLOCK_SIZE === 0;
    }
    const lastBlockStart = (n - 1) * BLOCK_SIZE;
    const lastBlockData = buffer.subarray(lastBlockStart);
    let m_last;
    if (flag) {
      m_last = xorBlock(new Uint8Array(lastBlockData), this.k1);
    } else {
      const padded = new Uint8Array(BLOCK_SIZE);
      padded.set(lastBlockData);
      padded[lastBlockData.length] = 128;
      m_last = xorBlock(padded, this.k2);
    }
    let x = new Uint8Array(BLOCK_SIZE);
    for (let i2 = 0; i2 < n - 1; i2++) {
      const m_i = buffer.subarray(i2 * BLOCK_SIZE, (i2 + 1) * BLOCK_SIZE);
      xorBlock(x, m_i);
      encryptBlock(this.xk, x);
    }
    xorBlock(x, m_last);
    encryptBlock(this.xk, x);
    clean3(m_last);
    return x;
  }
  destroy() {
    const { buffer, destroyed, xk, k1, k2 } = this;
    if (destroyed)
      return;
    this.destroyed = true;
    clean3(buffer, xk, k1, k2);
  }
};
var cmac = (key, message) => new _CMAC(key).update(message).digest();
cmac.create = (key) => new _CMAC(key);

// node_modules/@noble/ciphers/_arx.js
var encodeStr = (str) => Uint8Array.from(str.split(""), (c) => c.charCodeAt(0));
var sigma16 = encodeStr("expand 16-byte k");
var sigma32 = encodeStr("expand 32-byte k");
var sigma16_32 = u32(sigma16);
var sigma32_32 = u32(sigma32);
function rotl(a, b) {
  return a << b | a >>> 32 - b;
}
function isAligned322(b) {
  return b.byteOffset % 4 === 0;
}
var BLOCK_LEN = 64;
var BLOCK_LEN32 = 16;
var MAX_COUNTER = 2 ** 32 - 1;
var U32_EMPTY = Uint32Array.of();
function runCipher(core, sigma, key, nonce, data, output, counter, rounds) {
  const len = data.length;
  const block2 = new Uint8Array(BLOCK_LEN);
  const b32 = u32(block2);
  const isAligned = isAligned322(data) && isAligned322(output);
  const d32 = isAligned ? u32(data) : U32_EMPTY;
  const o32 = isAligned ? u32(output) : U32_EMPTY;
  for (let pos = 0; pos < len; counter++) {
    core(sigma, key, nonce, b32, counter, rounds);
    if (counter >= MAX_COUNTER)
      throw new Error("arx: counter overflow");
    const take = Math.min(BLOCK_LEN, len - pos);
    if (isAligned && take === BLOCK_LEN) {
      const pos32 = pos / 4;
      if (pos % 4 !== 0)
        throw new Error("arx: invalid block position");
      for (let j = 0, posj; j < BLOCK_LEN32; j++) {
        posj = pos32 + j;
        o32[posj] = d32[posj] ^ b32[j];
      }
      pos += BLOCK_LEN;
      continue;
    }
    for (let j = 0, posj; j < take; j++) {
      posj = pos + j;
      output[posj] = data[posj] ^ block2[j];
    }
    pos += take;
  }
}
function createCipher(core, opts) {
  const { allowShortKeys, extendNonceFn, counterLength, counterRight, rounds } = checkOpts({ allowShortKeys: false, counterLength: 8, counterRight: false, rounds: 20 }, opts);
  if (typeof core !== "function")
    throw new Error("core must be a function");
  anumber4(counterLength);
  anumber4(rounds);
  abool2(counterRight);
  abool2(allowShortKeys);
  return (key, nonce, data, output, counter = 0) => {
    abytes4(key, void 0, "key");
    abytes4(nonce, void 0, "nonce");
    abytes4(data, void 0, "data");
    const len = data.length;
    if (output === void 0)
      output = new Uint8Array(len);
    abytes4(output, void 0, "output");
    anumber4(counter);
    if (counter < 0 || counter >= MAX_COUNTER)
      throw new Error("arx: counter overflow");
    if (output.length < len)
      throw new Error(`arx: output (${output.length}) is shorter than data (${len})`);
    const toClean = [];
    let l = key.length;
    let k;
    let sigma;
    if (l === 32) {
      toClean.push(k = copyBytes2(key));
      sigma = sigma32_32;
    } else if (l === 16 && allowShortKeys) {
      k = new Uint8Array(32);
      k.set(key);
      k.set(key, 16);
      sigma = sigma16_32;
      toClean.push(k);
    } else {
      abytes4(key, 32, "arx key");
      throw new Error("invalid key size");
    }
    if (!isAligned322(nonce))
      toClean.push(nonce = copyBytes2(nonce));
    const k32 = u32(k);
    if (extendNonceFn) {
      if (nonce.length !== 24)
        throw new Error(`arx: extended nonce must be 24 bytes`);
      extendNonceFn(sigma, k32, u32(nonce.subarray(0, 16)), k32);
      nonce = nonce.subarray(16);
    }
    const nonceNcLen = 16 - counterLength;
    if (nonceNcLen !== nonce.length)
      throw new Error(`arx: nonce must be ${nonceNcLen} or 16 bytes`);
    if (nonceNcLen !== 12) {
      const nc2 = new Uint8Array(12);
      nc2.set(nonce, counterRight ? 0 : 12 - nonce.length);
      nonce = nc2;
      toClean.push(nonce);
    }
    const n32 = u32(nonce);
    runCipher(core, sigma, k32, n32, data, output, counter, rounds);
    clean3(...toClean);
    return output;
  };
}

// node_modules/@noble/ciphers/_poly1305.js
function u8to16(a, i2) {
  return a[i2++] & 255 | (a[i2++] & 255) << 8;
}
var Poly1305 = class {
  blockLen = 16;
  outputLen = 16;
  buffer = new Uint8Array(16);
  r = new Uint16Array(10);
  // Allocating 1 array with .subarray() here is slower than 3
  h = new Uint16Array(10);
  pad = new Uint16Array(8);
  pos = 0;
  finished = false;
  // Can be speed-up using BigUint64Array, at the cost of complexity
  constructor(key) {
    key = copyBytes2(abytes4(key, 32, "key"));
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
    let d22 = c + h0 * r2 + h1 * r1 + h2 * r0 + h3 * (5 * r9) + h4 * (5 * r8);
    c = d22 >>> 13;
    d22 &= 8191;
    d22 += h5 * (5 * r7) + h6 * (5 * r6) + h7 * (5 * r5) + h8 * (5 * r4) + h9 * (5 * r3);
    c += d22 >>> 13;
    d22 &= 8191;
    let d32 = c + h0 * r3 + h1 * r2 + h2 * r1 + h3 * r0 + h4 * (5 * r9);
    c = d32 >>> 13;
    d32 &= 8191;
    d32 += h5 * (5 * r8) + h6 * (5 * r7) + h7 * (5 * r6) + h8 * (5 * r5) + h9 * (5 * r4);
    c += d32 >>> 13;
    d32 &= 8191;
    let d42 = c + h0 * r4 + h1 * r3 + h2 * r2 + h3 * r1 + h4 * r0;
    c = d42 >>> 13;
    d42 &= 8191;
    d42 += h5 * (5 * r9) + h6 * (5 * r8) + h7 * (5 * r7) + h8 * (5 * r6) + h9 * (5 * r5);
    c += d42 >>> 13;
    d42 &= 8191;
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
    h[2] = d22;
    h[3] = d32;
    h[4] = d42;
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
    let f = h[0] + pad2[0];
    h[0] = f & 65535;
    for (let i2 = 1; i2 < 8; i2++) {
      f = (h[i2] + pad2[i2] | 0) + (f >>> 16) | 0;
      h[i2] = f & 65535;
    }
    clean3(g);
  }
  update(data) {
    aexists3(this);
    abytes4(data);
    data = copyBytes2(data);
    const { buffer, blockLen } = this;
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
    clean3(this.h, this.r, this.buffer, this.pad);
  }
  digestInto(out) {
    aexists3(this);
    aoutput3(out, this);
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
  const hashC = (msg, key) => hashCons(key).update(msg).digest();
  const tmp = hashCons(new Uint8Array(32));
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = (key) => hashCons(key);
  return hashC;
}
var poly1305 = /* @__PURE__ */ (() => wrapConstructorWithKey((key) => new Poly1305(key)))();

// node_modules/@noble/ciphers/chacha.js
function chachaCore(s, k, n, out, cnt, rounds = 20) {
  let y00 = s[0], y01 = s[1], y02 = s[2], y03 = s[3], y04 = k[0], y05 = k[1], y06 = k[2], y07 = k[3], y08 = k[4], y09 = k[5], y10 = k[6], y11 = k[7], y12 = cnt, y13 = n[0], y14 = n[1], y15 = n[2];
  let x00 = y00, x01 = y01, x02 = y02, x03 = y03, x04 = y04, x05 = y05, x06 = y06, x07 = y07, x08 = y08, x09 = y09, x10 = y10, x11 = y11, x12 = y12, x13 = y13, x14 = y14, x15 = y15;
  for (let r = 0; r < rounds; r += 2) {
    x00 = x00 + x04 | 0;
    x12 = rotl(x12 ^ x00, 16);
    x08 = x08 + x12 | 0;
    x04 = rotl(x04 ^ x08, 12);
    x00 = x00 + x04 | 0;
    x12 = rotl(x12 ^ x00, 8);
    x08 = x08 + x12 | 0;
    x04 = rotl(x04 ^ x08, 7);
    x01 = x01 + x05 | 0;
    x13 = rotl(x13 ^ x01, 16);
    x09 = x09 + x13 | 0;
    x05 = rotl(x05 ^ x09, 12);
    x01 = x01 + x05 | 0;
    x13 = rotl(x13 ^ x01, 8);
    x09 = x09 + x13 | 0;
    x05 = rotl(x05 ^ x09, 7);
    x02 = x02 + x06 | 0;
    x14 = rotl(x14 ^ x02, 16);
    x10 = x10 + x14 | 0;
    x06 = rotl(x06 ^ x10, 12);
    x02 = x02 + x06 | 0;
    x14 = rotl(x14 ^ x02, 8);
    x10 = x10 + x14 | 0;
    x06 = rotl(x06 ^ x10, 7);
    x03 = x03 + x07 | 0;
    x15 = rotl(x15 ^ x03, 16);
    x11 = x11 + x15 | 0;
    x07 = rotl(x07 ^ x11, 12);
    x03 = x03 + x07 | 0;
    x15 = rotl(x15 ^ x03, 8);
    x11 = x11 + x15 | 0;
    x07 = rotl(x07 ^ x11, 7);
    x00 = x00 + x05 | 0;
    x15 = rotl(x15 ^ x00, 16);
    x10 = x10 + x15 | 0;
    x05 = rotl(x05 ^ x10, 12);
    x00 = x00 + x05 | 0;
    x15 = rotl(x15 ^ x00, 8);
    x10 = x10 + x15 | 0;
    x05 = rotl(x05 ^ x10, 7);
    x01 = x01 + x06 | 0;
    x12 = rotl(x12 ^ x01, 16);
    x11 = x11 + x12 | 0;
    x06 = rotl(x06 ^ x11, 12);
    x01 = x01 + x06 | 0;
    x12 = rotl(x12 ^ x01, 8);
    x11 = x11 + x12 | 0;
    x06 = rotl(x06 ^ x11, 7);
    x02 = x02 + x07 | 0;
    x13 = rotl(x13 ^ x02, 16);
    x08 = x08 + x13 | 0;
    x07 = rotl(x07 ^ x08, 12);
    x02 = x02 + x07 | 0;
    x13 = rotl(x13 ^ x02, 8);
    x08 = x08 + x13 | 0;
    x07 = rotl(x07 ^ x08, 7);
    x03 = x03 + x04 | 0;
    x14 = rotl(x14 ^ x03, 16);
    x09 = x09 + x14 | 0;
    x04 = rotl(x04 ^ x09, 12);
    x03 = x03 + x04 | 0;
    x14 = rotl(x14 ^ x03, 8);
    x09 = x09 + x14 | 0;
    x04 = rotl(x04 ^ x09, 7);
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
function hchacha(s, k, i2, out) {
  let x00 = s[0], x01 = s[1], x02 = s[2], x03 = s[3], x04 = k[0], x05 = k[1], x06 = k[2], x07 = k[3], x08 = k[4], x09 = k[5], x10 = k[6], x11 = k[7], x12 = i2[0], x13 = i2[1], x14 = i2[2], x15 = i2[3];
  for (let r = 0; r < 20; r += 2) {
    x00 = x00 + x04 | 0;
    x12 = rotl(x12 ^ x00, 16);
    x08 = x08 + x12 | 0;
    x04 = rotl(x04 ^ x08, 12);
    x00 = x00 + x04 | 0;
    x12 = rotl(x12 ^ x00, 8);
    x08 = x08 + x12 | 0;
    x04 = rotl(x04 ^ x08, 7);
    x01 = x01 + x05 | 0;
    x13 = rotl(x13 ^ x01, 16);
    x09 = x09 + x13 | 0;
    x05 = rotl(x05 ^ x09, 12);
    x01 = x01 + x05 | 0;
    x13 = rotl(x13 ^ x01, 8);
    x09 = x09 + x13 | 0;
    x05 = rotl(x05 ^ x09, 7);
    x02 = x02 + x06 | 0;
    x14 = rotl(x14 ^ x02, 16);
    x10 = x10 + x14 | 0;
    x06 = rotl(x06 ^ x10, 12);
    x02 = x02 + x06 | 0;
    x14 = rotl(x14 ^ x02, 8);
    x10 = x10 + x14 | 0;
    x06 = rotl(x06 ^ x10, 7);
    x03 = x03 + x07 | 0;
    x15 = rotl(x15 ^ x03, 16);
    x11 = x11 + x15 | 0;
    x07 = rotl(x07 ^ x11, 12);
    x03 = x03 + x07 | 0;
    x15 = rotl(x15 ^ x03, 8);
    x11 = x11 + x15 | 0;
    x07 = rotl(x07 ^ x11, 7);
    x00 = x00 + x05 | 0;
    x15 = rotl(x15 ^ x00, 16);
    x10 = x10 + x15 | 0;
    x05 = rotl(x05 ^ x10, 12);
    x00 = x00 + x05 | 0;
    x15 = rotl(x15 ^ x00, 8);
    x10 = x10 + x15 | 0;
    x05 = rotl(x05 ^ x10, 7);
    x01 = x01 + x06 | 0;
    x12 = rotl(x12 ^ x01, 16);
    x11 = x11 + x12 | 0;
    x06 = rotl(x06 ^ x11, 12);
    x01 = x01 + x06 | 0;
    x12 = rotl(x12 ^ x01, 8);
    x11 = x11 + x12 | 0;
    x06 = rotl(x06 ^ x11, 7);
    x02 = x02 + x07 | 0;
    x13 = rotl(x13 ^ x02, 16);
    x08 = x08 + x13 | 0;
    x07 = rotl(x07 ^ x08, 12);
    x02 = x02 + x07 | 0;
    x13 = rotl(x13 ^ x02, 8);
    x08 = x08 + x13 | 0;
    x07 = rotl(x07 ^ x08, 7);
    x03 = x03 + x04 | 0;
    x14 = rotl(x14 ^ x03, 16);
    x09 = x09 + x14 | 0;
    x04 = rotl(x04 ^ x09, 12);
    x03 = x03 + x04 | 0;
    x14 = rotl(x14 ^ x03, 8);
    x09 = x09 + x14 | 0;
    x04 = rotl(x04 ^ x09, 7);
  }
  let oi = 0;
  out[oi++] = x00;
  out[oi++] = x01;
  out[oi++] = x02;
  out[oi++] = x03;
  out[oi++] = x12;
  out[oi++] = x13;
  out[oi++] = x14;
  out[oi++] = x15;
}
var chacha20 = /* @__PURE__ */ createCipher(chachaCore, {
  counterRight: false,
  counterLength: 4,
  allowShortKeys: false
});
var xchacha20 = /* @__PURE__ */ createCipher(chachaCore, {
  counterRight: false,
  counterLength: 8,
  extendNonceFn: hchacha,
  allowShortKeys: false
});
var ZEROS16 = /* @__PURE__ */ new Uint8Array(16);
var updatePadded = (h, msg) => {
  h.update(msg);
  const leftover = msg.length % 16;
  if (leftover)
    h.update(ZEROS16.subarray(leftover));
};
var ZEROS32 = /* @__PURE__ */ new Uint8Array(32);
function computeTag(fn, key, nonce, ciphertext, AAD) {
  if (AAD !== void 0)
    abytes4(AAD, void 0, "AAD");
  const authKey = fn(key, nonce, ZEROS32);
  const lengths = u64Lengths(ciphertext.length, AAD ? AAD.length : 0, true);
  const h = poly1305.create(authKey);
  if (AAD)
    updatePadded(h, AAD);
  updatePadded(h, ciphertext);
  h.update(lengths);
  const res = h.digest();
  clean3(authKey, lengths);
  return res;
}
var _poly1305_aead = (xorStream) => (key, nonce, AAD) => {
  const tagLength = 16;
  return {
    encrypt(plaintext, output) {
      const plength = plaintext.length;
      output = getOutput(plength + tagLength, output, false);
      output.set(plaintext);
      const oPlain = output.subarray(0, -tagLength);
      xorStream(key, nonce, oPlain, oPlain, 1);
      const tag2 = computeTag(xorStream, key, nonce, oPlain, AAD);
      output.set(tag2, plength);
      clean3(tag2);
      return output;
    },
    decrypt(ciphertext, output) {
      output = getOutput(ciphertext.length - tagLength, output, false);
      const data = ciphertext.subarray(0, -tagLength);
      const passedTag = ciphertext.subarray(-tagLength);
      const tag2 = computeTag(xorStream, key, nonce, data, AAD);
      if (!equalBytes(passedTag, tag2))
        throw new Error("invalid tag");
      output.set(ciphertext.subarray(0, -tagLength));
      xorStream(key, nonce, output, output, 1);
      clean3(tag2);
      return output;
    }
  };
};
var chacha20poly1305 = /* @__PURE__ */ wrapCipher({ blockSize: 64, nonceLength: 12, tagLength: 16 }, _poly1305_aead(chacha20));
var xchacha20poly1305 = /* @__PURE__ */ wrapCipher({ blockSize: 64, nonceLength: 24, tagLength: 16 }, _poly1305_aead(xchacha20));

// node_modules/nostr-tools/node_modules/@noble/hashes/hmac.js
var _HMAC2 = class {
  oHash;
  iHash;
  blockLen;
  outputLen;
  finished = false;
  destroyed = false;
  constructor(hash, key) {
    ahash2(hash);
    abytes2(key, void 0, "key");
    this.iHash = hash.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad2 = new Uint8Array(blockLen);
    pad2.set(key.length > blockLen ? hash.create().update(key).digest() : key);
    for (let i2 = 0; i2 < pad2.length; i2++)
      pad2[i2] ^= 54;
    this.iHash.update(pad2);
    this.oHash = hash.create();
    for (let i2 = 0; i2 < pad2.length; i2++)
      pad2[i2] ^= 54 ^ 92;
    this.oHash.update(pad2);
    clean2(pad2);
  }
  update(buf) {
    aexists2(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    aexists2(this);
    abytes2(out, this.outputLen, "output");
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
    to ||= Object.create(Object.getPrototypeOf(this), {});
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
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac2 = (hash, key, message) => new _HMAC2(hash, key).update(message).digest();
hmac2.create = (hash, key) => new _HMAC2(hash, key);

// node_modules/nostr-tools/node_modules/@noble/hashes/hkdf.js
function extract(hash, ikm, salt) {
  ahash2(hash);
  if (salt === void 0)
    salt = new Uint8Array(hash.outputLen);
  return hmac2(hash, salt, ikm);
}
var HKDF_COUNTER = /* @__PURE__ */ Uint8Array.of(0);
var EMPTY_BUFFER = /* @__PURE__ */ Uint8Array.of();
function expand(hash, prk, info, length = 32) {
  ahash2(hash);
  anumber2(length, "length");
  const olen = hash.outputLen;
  if (length > 255 * olen)
    throw new Error("Length must be <= 255*HashLen");
  const blocks = Math.ceil(length / olen);
  if (info === void 0)
    info = EMPTY_BUFFER;
  else
    abytes2(info, void 0, "info");
  const okm = new Uint8Array(blocks * olen);
  const HMAC2 = hmac2.create(hash, prk);
  const HMACTmp = HMAC2._cloneInto();
  const T = new Uint8Array(HMAC2.outputLen);
  for (let counter = 0; counter < blocks; counter++) {
    HKDF_COUNTER[0] = counter + 1;
    HMACTmp.update(counter === 0 ? EMPTY_BUFFER : T).update(info).update(HKDF_COUNTER).digestInto(T);
    okm.set(T, olen * counter);
    HMAC2._cloneInto(HMACTmp);
  }
  HMAC2.destroy();
  HMACTmp.destroy();
  clean2(T, HKDF_COUNTER);
  return okm.slice(0, length);
}

// node_modules/nostr-tools/lib/esm/index.js
var __defProp2 = Object.defineProperty;
var __export2 = (target, all) => {
  for (var name in all)
    __defProp2(target, name, { get: all[name], enumerable: true });
};
var verifiedSymbol = /* @__PURE__ */ Symbol("verified");
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
    let tag2 = event.tags[i2];
    if (!Array.isArray(tag2))
      return false;
    for (let j = 0; j < tag2.length; j++) {
      if (typeof tag2[j] !== "string")
        return false;
    }
  }
  return true;
}
var utils_exports = {};
__export2(utils_exports, {
  binarySearch: () => binarySearch,
  bytesToHex: () => bytesToHex2,
  hexToBytes: () => hexToBytes2,
  insertEventIntoAscendingList: () => insertEventIntoAscendingList,
  insertEventIntoDescendingList: () => insertEventIntoDescendingList,
  mergeReverseSortedLists: () => mergeReverseSortedLists,
  normalizeURL: () => normalizeURL,
  utf8Decoder: () => utf8Decoder,
  utf8Encoder: () => utf8Encoder
});
var utf8Decoder = new TextDecoder("utf-8");
var utf8Encoder = new TextEncoder();
function normalizeURL(url) {
  try {
    if (url.indexOf("://") === -1)
      url = "wss://" + url;
    let p = new URL(url);
    if (p.protocol === "http:")
      p.protocol = "ws:";
    else if (p.protocol === "https:")
      p.protocol = "wss:";
    p.pathname = p.pathname.replace(/\/+/g, "/");
    if (p.pathname.endsWith("/"))
      p.pathname = p.pathname.slice(0, -1);
    if (p.port === "80" && p.protocol === "ws:" || p.port === "443" && p.protocol === "wss:")
      p.port = "";
    p.searchParams.sort();
    p.hash = "";
    return p.toString();
  } catch (e) {
    throw new Error(`Invalid URL: ${url}`);
  }
}
function insertEventIntoDescendingList(sortedArray, event) {
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
function insertEventIntoAscendingList(sortedArray, event) {
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
function mergeReverseSortedLists(list1, list2) {
  const result = new Array(list1.length + list2.length);
  result.length = 0;
  let i1 = 0;
  let i2 = 0;
  let sameTimestampIds = [];
  while (i1 < list1.length && i2 < list2.length) {
    let next2;
    if (list1[i1]?.created_at > list2[i2]?.created_at) {
      next2 = list1[i1];
      i1++;
    } else {
      next2 = list2[i2];
      i2++;
    }
    if (result.length > 0 && result[result.length - 1].created_at === next2.created_at) {
      if (sameTimestampIds.includes(next2.id))
        continue;
    } else {
      sameTimestampIds.length = 0;
    }
    result.push(next2);
    sameTimestampIds.push(next2.id);
  }
  while (i1 < list1.length) {
    const next2 = list1[i1];
    i1++;
    if (result.length > 0 && result[result.length - 1].created_at === next2.created_at) {
      if (sameTimestampIds.includes(next2.id))
        continue;
    } else {
      sameTimestampIds.length = 0;
    }
    result.push(next2);
    sameTimestampIds.push(next2.id);
  }
  while (i2 < list2.length) {
    const next2 = list2[i2];
    i2++;
    if (result.length > 0 && result[result.length - 1].created_at === next2.created_at) {
      if (sameTimestampIds.includes(next2.id))
        continue;
    } else {
      sameTimestampIds.length = 0;
    }
    result.push(next2);
    sameTimestampIds.push(next2.id);
  }
  return result;
}
var JS = class {
  generateSecretKey() {
    return schnorr.utils.randomSecretKey();
  }
  getPublicKey(secretKey) {
    return bytesToHex2(schnorr.getPublicKey(secretKey));
  }
  finalizeEvent(t, secretKey) {
    const event = t;
    event.pubkey = bytesToHex2(schnorr.getPublicKey(secretKey));
    event.id = getEventHash(event);
    event.sig = bytesToHex2(schnorr.sign(hexToBytes2(getEventHash(event)), secretKey));
    event[verifiedSymbol] = true;
    return event;
  }
  verifyEvent(event) {
    if (typeof event[verifiedSymbol] === "boolean")
      return event[verifiedSymbol];
    try {
      const hash = getEventHash(event);
      if (hash !== event.id) {
        event[verifiedSymbol] = false;
        return false;
      }
      const valid = schnorr.verify(hexToBytes2(event.sig), hexToBytes2(hash), hexToBytes2(event.pubkey));
      event[verifiedSymbol] = valid;
      return valid;
    } catch (err) {
      event[verifiedSymbol] = false;
      return false;
    }
  }
};
function serializeEvent(evt) {
  if (!validateEvent(evt))
    throw new Error("can't serialize event with wrong or missing properties");
  return JSON.stringify([0, evt.pubkey, evt.created_at, evt.kind, evt.tags, evt.content]);
}
function getEventHash(event) {
  let eventHash = sha2562(utf8Encoder.encode(serializeEvent(event)));
  return bytesToHex2(eventHash);
}
var i = new JS();
var generateSecretKey = i.generateSecretKey;
var getPublicKey = i.getPublicKey;
var finalizeEvent = i.finalizeEvent;
var verifyEvent = i.verifyEvent;
var kinds_exports = {};
__export2(kinds_exports, {
  Application: () => Application,
  BadgeAward: () => BadgeAward,
  BadgeDefinition: () => BadgeDefinition,
  BlockedRelaysList: () => BlockedRelaysList,
  BlossomServerList: () => BlossomServerList,
  BookmarkList: () => BookmarkList,
  Bookmarksets: () => Bookmarksets,
  Calendar: () => Calendar,
  CalendarEventRSVP: () => CalendarEventRSVP,
  ChannelCreation: () => ChannelCreation,
  ChannelHideMessage: () => ChannelHideMessage,
  ChannelMessage: () => ChannelMessage,
  ChannelMetadata: () => ChannelMetadata,
  ChannelMuteUser: () => ChannelMuteUser,
  ChatMessage: () => ChatMessage,
  ClassifiedListing: () => ClassifiedListing,
  ClientAuth: () => ClientAuth,
  Comment: () => Comment2,
  CommunitiesList: () => CommunitiesList,
  CommunityDefinition: () => CommunityDefinition,
  CommunityPostApproval: () => CommunityPostApproval,
  Contacts: () => Contacts,
  CreateOrUpdateProduct: () => CreateOrUpdateProduct,
  CreateOrUpdateStall: () => CreateOrUpdateStall,
  Curationsets: () => Curationsets,
  Date: () => Date2,
  DirectMessageRelaysList: () => DirectMessageRelaysList,
  DraftClassifiedListing: () => DraftClassifiedListing,
  DraftLong: () => DraftLong,
  Emojisets: () => Emojisets,
  EncryptedDirectMessage: () => EncryptedDirectMessage,
  EventDeletion: () => EventDeletion,
  FavoriteRelays: () => FavoriteRelays,
  FileMessage: () => FileMessage,
  FileMetadata: () => FileMetadata,
  FileServerPreference: () => FileServerPreference,
  Followsets: () => Followsets,
  ForumThread: () => ForumThread,
  GenericRepost: () => GenericRepost,
  Genericlists: () => Genericlists,
  GiftWrap: () => GiftWrap,
  GroupMetadata: () => GroupMetadata,
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
  NormalVideo: () => NormalVideo,
  NostrConnect: () => NostrConnect,
  OpenTimestamps: () => OpenTimestamps,
  Photo: () => Photo,
  Pinlist: () => Pinlist,
  Poll: () => Poll,
  PollResponse: () => PollResponse,
  PrivateDirectMessage: () => PrivateDirectMessage,
  ProblemTracker: () => ProblemTracker,
  ProfileBadges: () => ProfileBadges,
  PublicChatsList: () => PublicChatsList,
  Reaction: () => Reaction,
  RecommendRelay: () => RecommendRelay,
  RelayList: () => RelayList,
  RelayReview: () => RelayReview,
  Relaysets: () => Relaysets,
  Report: () => Report,
  Reporting: () => Reporting,
  Repost: () => Repost,
  Seal: () => Seal,
  SearchRelaysList: () => SearchRelaysList,
  ShortTextNote: () => ShortTextNote,
  ShortVideo: () => ShortVideo,
  Time: () => Time,
  UserEmojiList: () => UserEmojiList,
  UserStatuses: () => UserStatuses,
  Voice: () => Voice,
  VoiceComment: () => VoiceComment,
  Zap: () => Zap,
  ZapGoal: () => ZapGoal,
  ZapRequest: () => ZapRequest,
  classifyKind: () => classifyKind,
  isAddressableKind: () => isAddressableKind,
  isEphemeralKind: () => isEphemeralKind,
  isKind: () => isKind,
  isRegularKind: () => isRegularKind,
  isReplaceableKind: () => isReplaceableKind
});
function isRegularKind(kind) {
  return kind < 1e4 && kind !== 0 && kind !== 3;
}
function isReplaceableKind(kind) {
  return kind === 0 || kind === 3 || 1e4 <= kind && kind < 2e4;
}
function isEphemeralKind(kind) {
  return 2e4 <= kind && kind < 3e4;
}
function isAddressableKind(kind) {
  return 3e4 <= kind && kind < 4e4;
}
function classifyKind(kind) {
  if (isRegularKind(kind))
    return "regular";
  if (isReplaceableKind(kind))
    return "replaceable";
  if (isEphemeralKind(kind))
    return "ephemeral";
  if (isAddressableKind(kind))
    return "parameterized";
  return "unknown";
}
function isKind(event, kind) {
  const kindAsArray = kind instanceof Array ? kind : [kind];
  return validateEvent(event) && kindAsArray.includes(event.kind) || false;
}
var Metadata = 0;
var ShortTextNote = 1;
var RecommendRelay = 2;
var Contacts = 3;
var EncryptedDirectMessage = 4;
var EventDeletion = 5;
var Repost = 6;
var Reaction = 7;
var BadgeAward = 8;
var ChatMessage = 9;
var ForumThread = 11;
var Seal = 13;
var PrivateDirectMessage = 14;
var FileMessage = 15;
var GenericRepost = 16;
var Photo = 20;
var NormalVideo = 21;
var ShortVideo = 22;
var ChannelCreation = 40;
var ChannelMetadata = 41;
var ChannelMessage = 42;
var ChannelHideMessage = 43;
var ChannelMuteUser = 44;
var OpenTimestamps = 1040;
var GiftWrap = 1059;
var Poll = 1068;
var FileMetadata = 1063;
var Comment2 = 1111;
var LiveChatMessage = 1311;
var Voice = 1222;
var VoiceComment = 1244;
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
var Zap = 9735;
var Highlights = 9802;
var PollResponse = 1018;
var Mutelist = 1e4;
var Pinlist = 10001;
var RelayList = 10002;
var BookmarkList = 10003;
var CommunitiesList = 10004;
var PublicChatsList = 10005;
var BlockedRelaysList = 10006;
var SearchRelaysList = 10007;
var FavoriteRelays = 10012;
var InterestsList = 10015;
var UserEmojiList = 10030;
var DirectMessageRelaysList = 10050;
var FileServerPreference = 10096;
var BlossomServerList = 10063;
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
var RelayReview = 31987;
var Handlerrecommendation = 31989;
var Handlerinformation = 31990;
var CommunityDefinition = 34550;
var GroupMetadata = 39e3;
function matchFilter(filter, event) {
  if (filter.ids && filter.ids.indexOf(event.id) === -1) {
    return false;
  }
  if (filter.kinds && filter.kinds.indexOf(event.kind) === -1) {
    return false;
  }
  if (filter.authors && filter.authors.indexOf(event.pubkey) === -1) {
    return false;
  }
  for (let f in filter) {
    if (f[0] === "#") {
      let tagName = f.slice(1);
      let values = filter[`#${tagName}`];
      if (values && !event.tags.find(([t, v]) => t === f.slice(1) && values.indexOf(v) !== -1))
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
    if (matchFilter(filters[i2], event)) {
      return true;
    }
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
var nip42_exports = {};
__export2(nip42_exports, {
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
var _WebSocket;
try {
  _WebSocket = WebSocket;
} catch {
}
var _WebSocket2;
try {
  _WebSocket2 = WebSocket;
} catch {
}
var nip19_exports = {};
__export2(nip19_exports, {
  BECH32_REGEX: () => BECH32_REGEX,
  Bech32MaxSize: () => Bech32MaxSize,
  NostrTypeGuard: () => NostrTypeGuard,
  decode: () => decode,
  decodeNostrURI: () => decodeNostrURI,
  encodeBytes: () => encodeBytes,
  naddrEncode: () => naddrEncode,
  neventEncode: () => neventEncode,
  noteEncode: () => noteEncode,
  nprofileEncode: () => nprofileEncode,
  npubEncode: () => npubEncode,
  nsecEncode: () => nsecEncode
});
var NostrTypeGuard = {
  isNProfile: (value) => /^nprofile1[a-z\d]+$/.test(value || ""),
  isNEvent: (value) => /^nevent1[a-z\d]+$/.test(value || ""),
  isNAddr: (value) => /^naddr1[a-z\d]+$/.test(value || ""),
  isNSec: (value) => /^nsec1[a-z\d]{58}$/.test(value || ""),
  isNPub: (value) => /^npub1[a-z\d]{58}$/.test(value || ""),
  isNote: (value) => /^note1[a-z\d]+$/.test(value || ""),
  isNcryptsec: (value) => /^ncryptsec1[a-z\d]+$/.test(value || "")
};
var Bech32MaxSize = 5e3;
var BECH32_REGEX = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function integerToUint8Array(number) {
  const uint8Array = new Uint8Array(4);
  uint8Array[0] = number >> 24 & 255;
  uint8Array[1] = number >> 16 & 255;
  uint8Array[2] = number >> 8 & 255;
  uint8Array[3] = number & 255;
  return uint8Array;
}
function decodeNostrURI(nip19code) {
  try {
    if (nip19code.startsWith("nostr:"))
      nip19code = nip19code.substring(6);
    return decode(nip19code);
  } catch (_err) {
    return { type: "invalid", data: null };
  }
}
function decode(code) {
  let { prefix, words } = bech32.decode(code, Bech32MaxSize);
  let data = new Uint8Array(bech32.fromWords(words));
  switch (prefix) {
    case "nprofile": {
      let tlv = parseTLV(data);
      if (!tlv[0]?.[0])
        throw new Error("missing TLV 0 for nprofile");
      if (tlv[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      return {
        type: "nprofile",
        data: {
          pubkey: bytesToHex2(tlv[0][0]),
          relays: tlv[1] ? tlv[1].map((d5) => utf8Decoder.decode(d5)) : []
        }
      };
    }
    case "nevent": {
      let tlv = parseTLV(data);
      if (!tlv[0]?.[0])
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
          relays: tlv[1] ? tlv[1].map((d5) => utf8Decoder.decode(d5)) : [],
          author: tlv[2]?.[0] ? bytesToHex2(tlv[2][0]) : void 0,
          kind: tlv[3]?.[0] ? parseInt(bytesToHex2(tlv[3][0]), 16) : void 0
        }
      };
    }
    case "naddr": {
      let tlv = parseTLV(data);
      if (!tlv[0]?.[0])
        throw new Error("missing TLV 0 for naddr");
      if (!tlv[2]?.[0])
        throw new Error("missing TLV 2 for naddr");
      if (tlv[2][0].length !== 32)
        throw new Error("TLV 2 should be 32 bytes");
      if (!tlv[3]?.[0])
        throw new Error("missing TLV 3 for naddr");
      if (tlv[3][0].length !== 4)
        throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "naddr",
        data: {
          identifier: utf8Decoder.decode(tlv[0][0]),
          pubkey: bytesToHex2(tlv[2][0]),
          kind: parseInt(bytesToHex2(tlv[3][0]), 16),
          relays: tlv[1] ? tlv[1].map((d5) => utf8Decoder.decode(d5)) : []
        }
      };
    }
    case "nsec":
      return { type: prefix, data };
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
    if (rest.length < 2)
      throw new Error("not enough data to read TLV");
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
function nsecEncode(key) {
  return encodeBytes("nsec", key);
}
function npubEncode(hex) {
  return encodeBytes("npub", hexToBytes2(hex));
}
function noteEncode(hex) {
  return encodeBytes("note", hexToBytes2(hex));
}
function encodeBech32(prefix, data) {
  let words = bech32.toWords(data);
  return bech32.encode(prefix, words, Bech32MaxSize);
}
function encodeBytes(prefix, bytes) {
  return encodeBech32(prefix, bytes);
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
  if (event.kind !== void 0) {
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
function encodeTLV(tlv) {
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
  return concatBytes2(...entries);
}
var nip04_exports = {};
__export2(nip04_exports, {
  decrypt: () => decrypt2,
  encrypt: () => encrypt2
});
function encrypt2(secretKey, pubkey, text) {
  const privkey = secretKey instanceof Uint8Array ? secretKey : hexToBytes2(secretKey);
  const key = secp256k1.getSharedSecret(privkey, hexToBytes2("02" + pubkey));
  const normalizedKey = getNormalizedX(key);
  let iv = Uint8Array.from(randomBytes2(16));
  let plaintext = utf8Encoder.encode(text);
  let ciphertext = cbc(normalizedKey, iv).encrypt(plaintext);
  let ctb64 = base64.encode(new Uint8Array(ciphertext));
  let ivb64 = base64.encode(new Uint8Array(iv.buffer));
  return `${ctb64}?iv=${ivb64}`;
}
function decrypt2(secretKey, pubkey, data) {
  const privkey = secretKey instanceof Uint8Array ? secretKey : hexToBytes2(secretKey);
  let [ctb64, ivb64] = data.split("?iv=");
  let key = secp256k1.getSharedSecret(privkey, hexToBytes2("02" + pubkey));
  let normalizedKey = getNormalizedX(key);
  let iv = base64.decode(ivb64);
  let ciphertext = base64.decode(ctb64);
  let plaintext = cbc(normalizedKey, iv).decrypt(ciphertext);
  return utf8Decoder.decode(plaintext);
}
function getNormalizedX(key) {
  return key.slice(1, 33);
}
var nip05_exports = {};
__export2(nip05_exports, {
  NIP05_REGEX: () => NIP05_REGEX,
  isNip05: () => isNip05,
  isValid: () => isValid,
  queryProfile: () => queryProfile,
  searchDomain: () => searchDomain,
  useFetchImplementation: () => useFetchImplementation
});
var NIP05_REGEX = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/;
var isNip05 = (value) => NIP05_REGEX.test(value || "");
var _fetch;
try {
  _fetch = fetch;
} catch (_) {
  null;
}
function useFetchImplementation(fetchImplementation) {
  _fetch = fetchImplementation;
}
async function searchDomain(domain, query = "") {
  try {
    const url = `https://${domain}/.well-known/nostr.json?name=${query}`;
    const res = await _fetch(url, { redirect: "manual" });
    if (res.status !== 200) {
      throw Error("Wrong response code");
    }
    const json = await res.json();
    return json.names;
  } catch (_) {
    return {};
  }
}
async function queryProfile(fullname) {
  const match = fullname.match(NIP05_REGEX);
  if (!match)
    return null;
  const [, name = "_", domain] = match;
  try {
    const url = `https://${domain}/.well-known/nostr.json?name=${name}`;
    const res = await _fetch(url, { redirect: "manual" });
    if (res.status !== 200) {
      throw Error("Wrong response code");
    }
    const json = await res.json();
    const pubkey = json.names[name];
    return pubkey ? { pubkey, relays: json.relays?.[pubkey] } : null;
  } catch (_e) {
    return null;
  }
}
async function isValid(pubkey, nip05) {
  const res = await queryProfile(nip05);
  return res ? res.pubkey === pubkey : false;
}
var nip10_exports = {};
__export2(nip10_exports, {
  parse: () => parse
});
var HEX64 = /^[0-9a-fA-F]{64}$/;
function parse(event) {
  const result = {
    reply: void 0,
    root: void 0,
    mentions: [],
    profiles: [],
    quotes: []
  };
  let maybeParent;
  let maybeRoot;
  for (let i2 = event.tags.length - 1; i2 >= 0; i2--) {
    const tag2 = event.tags[i2];
    if (tag2[0] === "e" && tag2[1] && HEX64.test(tag2[1])) {
      const [_, eTagEventId, eTagRelayUrl, eTagMarker, eTagAuthor] = tag2;
      const eventPointer = {
        id: eTagEventId,
        relays: eTagRelayUrl ? [eTagRelayUrl] : [],
        author: eTagAuthor && HEX64.test(eTagAuthor) ? eTagAuthor : void 0
      };
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
      if (!maybeParent) {
        maybeParent = eventPointer;
      } else {
        maybeRoot = eventPointer;
      }
      result.mentions.push(eventPointer);
      continue;
    }
    if (tag2[0] === "q" && tag2[1] && HEX64.test(tag2[1])) {
      const [_, eTagEventId, eTagRelayUrl] = tag2;
      result.quotes.push({
        id: eTagEventId,
        relays: eTagRelayUrl ? [eTagRelayUrl] : []
      });
    }
    if (tag2[0] === "p" && tag2[1] && HEX64.test(tag2[1])) {
      result.profiles.push({
        pubkey: tag2[1],
        relays: tag2[2] ? [tag2[2]] : []
      });
      continue;
    }
  }
  if (!result.root) {
    result.root = maybeRoot || maybeParent || result.reply;
  }
  if (!result.reply) {
    result.reply = maybeParent || result.root;
  }
  ;
  [result.reply, result.root].forEach((ref) => {
    if (!ref)
      return;
    let idx = result.mentions.indexOf(ref);
    if (idx !== -1) {
      result.mentions.splice(idx, 1);
    }
    if (ref.author) {
      let author = result.profiles.find((p) => p.pubkey === ref.author);
      if (author && author.relays) {
        if (!ref.relays) {
          ref.relays = [];
        }
        author.relays.forEach((url) => {
          if (ref.relays?.indexOf(url) === -1)
            ref.relays.push(url);
        });
        author.relays = ref.relays;
      }
    }
  });
  result.mentions.forEach((ref) => {
    if (ref.author) {
      let author = result.profiles.find((p) => p.pubkey === ref.author);
      if (author && author.relays) {
        if (!ref.relays) {
          ref.relays = [];
        }
        author.relays.forEach((url) => {
          if (ref.relays.indexOf(url) === -1)
            ref.relays.push(url);
        });
        author.relays = ref.relays;
      }
    }
  });
  return result;
}
var nip11_exports = {};
__export2(nip11_exports, {
  fetchRelayInformation: () => fetchRelayInformation,
  useFetchImplementation: () => useFetchImplementation2
});
var _fetch2;
try {
  _fetch2 = fetch;
} catch {
}
function useFetchImplementation2(fetchImplementation) {
  _fetch2 = fetchImplementation;
}
async function fetchRelayInformation(url) {
  return await (await fetch(url.replace("ws://", "http://").replace("wss://", "https://"), {
    headers: { Accept: "application/nostr+json" }
  })).json();
}
var nip13_exports = {};
__export2(nip13_exports, {
  getPow: () => getPow,
  minePow: () => minePow
});
function getPow(hex) {
  let count = 0;
  for (let i2 = 0; i2 < 64; i2 += 8) {
    const nibble = parseInt(hex.substring(i2, i2 + 8), 16);
    if (nibble === 0) {
      count += 32;
    } else {
      count += Math.clz32(nibble);
      break;
    }
  }
  return count;
}
function getPowFromBytes(hash) {
  let count = 0;
  for (let i2 = 0; i2 < hash.length; i2++) {
    const byte = hash[i2];
    if (byte === 0) {
      count += 8;
    } else {
      count += Math.clz32(byte) - 24;
      break;
    }
  }
  return count;
}
function minePow(unsigned, difficulty) {
  let count = 0;
  const event = unsigned;
  const tag2 = ["nonce", count.toString(), difficulty.toString()];
  event.tags.push(tag2);
  while (true) {
    const now2 = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
    if (now2 !== event.created_at) {
      count = 0;
      event.created_at = now2;
    }
    tag2[1] = (++count).toString();
    const hash = sha2562(
      utf8Encoder.encode(JSON.stringify([0, event.pubkey, event.created_at, event.kind, event.tags, event.content]))
    );
    if (getPowFromBytes(hash) >= difficulty) {
      event.id = bytesToHex2(hash);
      break;
    }
  }
  return event;
}
var nip17_exports = {};
__export2(nip17_exports, {
  unwrapEvent: () => unwrapEvent2,
  unwrapManyEvents: () => unwrapManyEvents2,
  wrapEvent: () => wrapEvent2,
  wrapManyEvents: () => wrapManyEvents2
});
var nip59_exports = {};
__export2(nip59_exports, {
  createRumor: () => createRumor,
  createSeal: () => createSeal,
  createWrap: () => createWrap,
  unwrapEvent: () => unwrapEvent,
  unwrapManyEvents: () => unwrapManyEvents,
  wrapEvent: () => wrapEvent,
  wrapManyEvents: () => wrapManyEvents
});
var nip44_exports = {};
__export2(nip44_exports, {
  decrypt: () => decrypt22,
  encrypt: () => encrypt22,
  getConversationKey: () => getConversationKey,
  v2: () => v2
});
var minPlaintextSize = 1;
var maxPlaintextSize = 4294967295;
var extendedPrefixThreshold = 65536;
function getConversationKey(privkeyA, pubkeyB) {
  const sharedX = secp256k1.getSharedSecret(privkeyA, hexToBytes2("02" + pubkeyB)).subarray(1, 33);
  return extract(sha2562, sharedX, utf8Encoder.encode("nip44-v2"));
}
function getMessageKeys(conversationKey, nonce) {
  const keys = expand(sha2562, conversationKey, nonce, 76);
  return {
    chacha_key: keys.subarray(0, 32),
    chacha_nonce: keys.subarray(32, 44),
    hmac_key: keys.subarray(44, 76)
  };
}
function calcPaddedLen(len) {
  if (!Number.isSafeInteger(len) || len < 1)
    throw new Error("expected positive integer");
  if (len <= 32)
    return 32;
  const nextPower = 2 ** (Math.floor(Math.log2(len - 1)) + 1);
  const chunk = nextPower <= 256 ? 32 : nextPower / 8;
  return chunk * (Math.floor((len - 1) / chunk) + 1);
}
function writeU16BE(num3) {
  if (!Number.isSafeInteger(num3) || num3 < minPlaintextSize || num3 > 65535)
    throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");
  const arr = new Uint8Array(2);
  new DataView(arr.buffer).setUint16(0, num3, false);
  return arr;
}
function writeU32BE(num3) {
  if (!Number.isSafeInteger(num3) || num3 < extendedPrefixThreshold || num3 > maxPlaintextSize)
    throw new Error("invalid plaintext size: must be between 65536 and 4294967295 bytes");
  const arr = new Uint8Array(4);
  new DataView(arr.buffer).setUint32(0, num3, false);
  return arr;
}
function pad(plaintext) {
  const unpadded = utf8Encoder.encode(plaintext);
  const unpaddedLen = unpadded.length;
  if (unpaddedLen < minPlaintextSize || unpaddedLen > maxPlaintextSize)
    throw new Error("invalid plaintext size: must be between 1 and 4294967295 bytes");
  const prefix = unpaddedLen >= extendedPrefixThreshold ? concatBytes2(new Uint8Array([0, 0]), writeU32BE(unpaddedLen)) : writeU16BE(unpaddedLen);
  const suffix = new Uint8Array(calcPaddedLen(unpaddedLen) - unpaddedLen);
  return concatBytes2(prefix, unpadded, suffix);
}
function unpad(padded) {
  const dv = new DataView(padded.buffer, padded.byteOffset, padded.byteLength);
  const firstTwo = dv.getUint16(0);
  let unpaddedLen;
  let prefixLen;
  if (firstTwo === 0) {
    unpaddedLen = dv.getUint32(2);
    if (unpaddedLen < extendedPrefixThreshold)
      throw new Error("invalid padding");
    prefixLen = 6;
  } else {
    unpaddedLen = firstTwo;
    prefixLen = 2;
  }
  const unpadded = padded.subarray(prefixLen, prefixLen + unpaddedLen);
  if (unpaddedLen < minPlaintextSize || unpaddedLen > maxPlaintextSize || unpadded.length !== unpaddedLen || padded.length !== prefixLen + calcPaddedLen(unpaddedLen))
    throw new Error("invalid padding");
  return utf8Decoder.decode(unpadded);
}
function hmacAad(key, message, aad) {
  if (aad.length !== 32)
    throw new Error("AAD associated data must be 32 bytes");
  const combined = concatBytes2(aad, message);
  return hmac2(sha2562, key, combined);
}
function decodePayload(payload) {
  if (typeof payload !== "string")
    throw new Error("payload must be a valid string");
  const plen = payload.length;
  if (plen < 132)
    throw new Error("invalid payload length: " + plen);
  if (payload[0] === "#")
    throw new Error("unknown encryption version");
  let data;
  try {
    data = base64.decode(payload);
  } catch (error) {
    throw new Error("invalid base64: " + error.message);
  }
  const dlen = data.length;
  if (dlen < 99)
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
function encrypt22(plaintext, conversationKey, nonce = randomBytes2(32)) {
  const { chacha_key, chacha_nonce, hmac_key } = getMessageKeys(conversationKey, nonce);
  const padded = pad(plaintext);
  const ciphertext = chacha20(chacha_key, chacha_nonce, padded);
  const mac = hmacAad(hmac_key, ciphertext, nonce);
  return base64.encode(concatBytes2(new Uint8Array([2]), nonce, ciphertext, mac));
}
function decrypt22(payload, conversationKey) {
  const { nonce, ciphertext, mac } = decodePayload(payload);
  const { chacha_key, chacha_nonce, hmac_key } = getMessageKeys(conversationKey, nonce);
  const calculatedMac = hmacAad(hmac_key, ciphertext, nonce);
  if (!equalBytes(calculatedMac, mac))
    throw new Error("invalid MAC");
  const padded = chacha20(chacha_key, chacha_nonce, ciphertext);
  return unpad(padded);
}
var v2 = {
  utils: {
    getConversationKey,
    calcPaddedLen,
    pad,
    unpad
  },
  encrypt: encrypt22,
  decrypt: decrypt22
};
var TWO_DAYS = 2 * 24 * 60 * 60;
var now = () => Math.round(Date.now() / 1e3);
var randomNow = () => Math.round(now() - Math.random() * TWO_DAYS);
var nip44ConversationKey = (privateKey, publicKey) => getConversationKey(privateKey, publicKey);
var nip44Encrypt = (data, privateKey, publicKey) => encrypt22(JSON.stringify(data), nip44ConversationKey(privateKey, publicKey));
var nip44Decrypt = (data, privateKey) => JSON.parse(decrypt22(data.content, nip44ConversationKey(privateKey, data.pubkey)));
function createRumor(event, privateKey) {
  const rumor = {
    created_at: now(),
    content: "",
    tags: [],
    ...event,
    pubkey: getPublicKey(privateKey)
  };
  rumor.id = getEventHash(rumor);
  return rumor;
}
function createSeal(rumor, privateKey, recipientPublicKey) {
  return finalizeEvent(
    {
      kind: Seal,
      content: nip44Encrypt(rumor, privateKey, recipientPublicKey),
      created_at: randomNow(),
      tags: []
    },
    privateKey
  );
}
function createWrap(seal, recipientPublicKey) {
  const randomKey = generateSecretKey();
  return finalizeEvent(
    {
      kind: GiftWrap,
      content: nip44Encrypt(seal, randomKey, recipientPublicKey),
      created_at: randomNow(),
      tags: [["p", recipientPublicKey]]
    },
    randomKey
  );
}
function wrapEvent(event, senderPrivateKey, recipientPublicKey) {
  const rumor = createRumor(event, senderPrivateKey);
  const seal = createSeal(rumor, senderPrivateKey, recipientPublicKey);
  return createWrap(seal, recipientPublicKey);
}
function wrapManyEvents(event, senderPrivateKey, recipientsPublicKeys) {
  if (!recipientsPublicKeys || recipientsPublicKeys.length === 0) {
    throw new Error("At least one recipient is required.");
  }
  const senderPublicKey = getPublicKey(senderPrivateKey);
  const wrappeds = [wrapEvent(event, senderPrivateKey, senderPublicKey)];
  recipientsPublicKeys.forEach((recipientPublicKey) => {
    wrappeds.push(wrapEvent(event, senderPrivateKey, recipientPublicKey));
  });
  return wrappeds;
}
function unwrapEvent(wrap, recipientPrivateKey) {
  const unwrappedSeal = nip44Decrypt(wrap, recipientPrivateKey);
  return nip44Decrypt(unwrappedSeal, recipientPrivateKey);
}
function unwrapManyEvents(wrappedEvents, recipientPrivateKey) {
  let unwrappedEvents = [];
  wrappedEvents.forEach((e) => {
    unwrappedEvents.push(unwrapEvent(e, recipientPrivateKey));
  });
  unwrappedEvents.sort((a, b) => a.created_at - b.created_at);
  return unwrappedEvents;
}
function createEvent(recipients, message, conversationTitle, replyTo) {
  const baseEvent = {
    created_at: Math.ceil(Date.now() / 1e3),
    kind: PrivateDirectMessage,
    tags: [],
    content: message
  };
  const recipientsArray = Array.isArray(recipients) ? recipients : [recipients];
  recipientsArray.forEach(({ publicKey, relayUrl }) => {
    baseEvent.tags.push(relayUrl ? ["p", publicKey, relayUrl] : ["p", publicKey]);
  });
  if (replyTo) {
    baseEvent.tags.push(["e", replyTo.eventId, replyTo.relayUrl || "", "reply"]);
  }
  if (conversationTitle) {
    baseEvent.tags.push(["subject", conversationTitle]);
  }
  return baseEvent;
}
function wrapEvent2(senderPrivateKey, recipient, message, conversationTitle, replyTo) {
  const event = createEvent(recipient, message, conversationTitle, replyTo);
  return wrapEvent(event, senderPrivateKey, recipient.publicKey);
}
function wrapManyEvents2(senderPrivateKey, recipients, message, conversationTitle, replyTo) {
  if (!recipients || recipients.length === 0) {
    throw new Error("At least one recipient is required.");
  }
  const senderPublicKey = getPublicKey(senderPrivateKey);
  return [{ publicKey: senderPublicKey }, ...recipients].map(
    (recipient) => wrapEvent2(senderPrivateKey, recipient, message, conversationTitle, replyTo)
  );
}
var unwrapEvent2 = unwrapEvent;
var unwrapManyEvents2 = unwrapManyEvents;
var nip18_exports = {};
__export2(nip18_exports, {
  finishRepostEvent: () => finishRepostEvent,
  getRepostedEvent: () => getRepostedEvent,
  getRepostedEventPointer: () => getRepostedEventPointer
});
function finishRepostEvent(t, reposted, relayUrl, privateKey) {
  let kind;
  const tags = [...t.tags ?? [], ["e", reposted.id, relayUrl], ["p", reposted.pubkey]];
  if (reposted.kind === ShortTextNote) {
    kind = Repost;
  } else {
    kind = GenericRepost;
    tags.push(["k", String(reposted.kind)]);
  }
  return finalizeEvent(
    {
      kind,
      tags,
      content: t.content === "" || reposted.tags?.find((tag2) => tag2[0] === "-") ? "" : JSON.stringify(reposted),
      created_at: t.created_at
    },
    privateKey
  );
}
function getRepostedEventPointer(event) {
  if (![Repost, GenericRepost].includes(event.kind)) {
    return void 0;
  }
  let lastETag;
  let lastPTag;
  for (let i2 = event.tags.length - 1; i2 >= 0 && (lastETag === void 0 || lastPTag === void 0); i2--) {
    const tag2 = event.tags[i2];
    if (tag2.length >= 2) {
      if (tag2[0] === "e" && lastETag === void 0) {
        lastETag = tag2;
      } else if (tag2[0] === "p" && lastPTag === void 0) {
        lastPTag = tag2;
      }
    }
  }
  if (lastETag === void 0) {
    return void 0;
  }
  return {
    id: lastETag[1],
    relays: [lastETag[2], lastPTag?.[2]].filter((x) => typeof x === "string"),
    author: lastPTag?.[1]
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
  if (!skipVerification && !verifyEvent(repostedEvent)) {
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
var nip22_exports = {};
__export2(nip22_exports, {
  parse: () => parse3
});
var HEX642 = /^[0-9a-fA-F]{64}$/;
function parseKind(kind) {
  if (!kind)
    return void 0;
  return /^\d+$/.test(kind) ? parseInt(kind, 10) : kind;
}
function parseAddressPointer(value, relayUrl) {
  const idx = value.indexOf(":");
  const idx2 = value.indexOf(":", idx + 1);
  if (idx === -1 || idx2 === -1)
    return void 0;
  const kind = parseInt(value.slice(0, idx), 10);
  if (Number.isNaN(kind))
    return void 0;
  const pubkey = value.slice(idx + 1, idx2);
  if (!HEX642.test(pubkey))
    return void 0;
  return {
    kind,
    pubkey,
    identifier: value.slice(idx2 + 1),
    relays: relayUrl ? [relayUrl] : []
  };
}
function parsePointer(tag2) {
  switch (tag2[0]) {
    case "E":
    case "e":
      if (!tag2[1] || !HEX642.test(tag2[1]))
        return void 0;
      return {
        id: tag2[1],
        relays: tag2[2] ? [tag2[2]] : [],
        author: tag2[3] && HEX642.test(tag2[3]) ? tag2[3] : void 0
      };
    case "A":
    case "a":
      if (!tag2[1])
        return void 0;
      return parseAddressPointer(tag2[1], tag2[2]);
    case "I":
    case "i":
      if (!tag2[1])
        return void 0;
      return {
        value: tag2[1],
        hint: tag2[2]
      };
  }
}
function parseQuote(tag2) {
  if (!tag2[1])
    return void 0;
  if (tag2[1].includes(":")) {
    return parseAddressPointer(tag2[1], tag2[2]);
  }
  if (!HEX642.test(tag2[1]))
    return void 0;
  return {
    id: tag2[1],
    relays: tag2[2] ? [tag2[2]] : [],
    author: tag2[3] && HEX642.test(tag2[3]) ? tag2[3] : void 0
  };
}
function choosePointer(candidates) {
  return candidates.findLast((candidate) => candidate.tagName === "A" || candidate.tagName === "a")?.pointer || candidates.findLast((candidate) => candidate.tagName === "I" || candidate.tagName === "i")?.pointer || candidates.findLast((candidate) => candidate.tagName === "E" || candidate.tagName === "e")?.pointer;
}
function inheritRelayHints(pointer, profiles) {
  if (!pointer || !("id" in pointer) || !pointer.author)
    return;
  const author = profiles.find((profile) => profile.pubkey === pointer.author);
  if (!author || !author.relays)
    return;
  if (!pointer.relays) {
    pointer.relays = [];
  }
  author.relays.forEach((url) => {
    if (pointer.relays.indexOf(url) === -1)
      pointer.relays.push(url);
  });
  author.relays = pointer.relays;
}
function parse3(event) {
  const result = {
    root: void 0,
    rootKind: void 0,
    reply: void 0,
    replyKind: void 0,
    mentions: [],
    quotes: [],
    profiles: []
  };
  const rootCandidates = [];
  const replyCandidates = [];
  for (const tag2 of event.tags) {
    if ((tag2[0] === "E" || tag2[0] === "A" || tag2[0] === "I") && tag2[1]) {
      const pointer = parsePointer(tag2);
      if (pointer)
        rootCandidates.push({ tagName: tag2[0], pointer });
      continue;
    }
    if ((tag2[0] === "e" || tag2[0] === "a" || tag2[0] === "i") && tag2[1]) {
      const pointer = parsePointer(tag2);
      if (pointer)
        replyCandidates.push({ tagName: tag2[0], pointer });
      continue;
    }
    if (tag2[0] === "K") {
      result.rootKind = parseKind(tag2[1]);
      continue;
    }
    if (tag2[0] === "k") {
      result.replyKind = parseKind(tag2[1]);
      continue;
    }
    if (tag2[0] === "q") {
      const pointer = parseQuote(tag2);
      if (pointer)
        result.quotes.push(pointer);
      continue;
    }
    if ((tag2[0] === "P" || tag2[0] === "p") && tag2[1] && HEX642.test(tag2[1])) {
      result.profiles.push({
        pubkey: tag2[1],
        relays: tag2[2] ? [tag2[2]] : []
      });
    }
  }
  result.root = choosePointer(rootCandidates);
  result.reply = choosePointer(replyCandidates);
  inheritRelayHints(result.root, result.profiles);
  inheritRelayHints(result.reply, result.profiles);
  result.quotes.forEach((pointer) => inheritRelayHints(pointer, result.profiles));
  return result;
}
var nip25_exports = {};
__export2(nip25_exports, {
  finishReactionEvent: () => finishReactionEvent,
  getReactedEventPointer: () => getReactedEventPointer
});
function finishReactionEvent(t, reacted, privateKey) {
  const inheritedTags = reacted.tags.filter((tag2) => tag2.length >= 2 && (tag2[0] === "e" || tag2[0] === "p"));
  return finalizeEvent(
    {
      ...t,
      kind: Reaction,
      tags: [...t.tags ?? [], ...inheritedTags, ["e", reacted.id], ["p", reacted.pubkey]],
      content: t.content ?? "+"
    },
    privateKey
  );
}
function getReactedEventPointer(event) {
  if (event.kind !== Reaction) {
    return void 0;
  }
  let lastETag;
  let lastPTag;
  for (let i2 = event.tags.length - 1; i2 >= 0 && (lastETag === void 0 || lastPTag === void 0); i2--) {
    const tag2 = event.tags[i2];
    if (tag2.length >= 2) {
      if (tag2[0] === "e" && lastETag === void 0) {
        lastETag = tag2;
      } else if (tag2[0] === "p" && lastPTag === void 0) {
        lastPTag = tag2;
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
var nip27_exports = {};
__export2(nip27_exports, {
  parse: () => parse4
});
var noCharacter = /\W/m;
var noURLCharacter = /[^\w\/] |[^\w\/]$|$|,| /m;
var MAX_HASHTAG_LENGTH = 42;
function* parse4(content) {
  let emojis = [];
  if (typeof content !== "string") {
    for (let i2 = 0; i2 < content.tags.length; i2++) {
      const tag2 = content.tags[i2];
      if (tag2[0] === "emoji" && tag2.length >= 3) {
        emojis.push({ type: "emoji", shortcode: tag2[1], url: tag2[2] });
      }
    }
    content = content.content;
  }
  const max = content.length;
  let prevIndex = 0;
  let index = 0;
  mainloop:
    while (index < max) {
      const u = content.indexOf(":", index);
      const h = content.indexOf("#", index);
      if (u === -1 && h === -1) {
        break mainloop;
      }
      if (u === -1 || h >= 0 && h < u) {
        if (h === 0 || content[h - 1].match(noCharacter)) {
          const m = content.slice(h + 1, h + MAX_HASHTAG_LENGTH).match(noCharacter);
          const end = m ? h + 1 + m.index : max;
          yield { type: "text", text: content.slice(prevIndex, h) };
          yield { type: "hashtag", value: content.slice(h + 1, end) };
          index = end;
          prevIndex = index;
          continue mainloop;
        }
        index = h + 1;
        continue mainloop;
      }
      if (content.slice(u - 5, u) === "nostr") {
        const m = content.slice(u + 60).match(noCharacter);
        const end = m ? u + 60 + m.index : max;
        try {
          let pointer;
          let { data, type } = decode(content.slice(u + 1, end));
          switch (type) {
            case "npub":
              pointer = { pubkey: data };
              break;
            case "note":
              pointer = { id: data };
              break;
            case "nsec":
              index = end + 1;
              continue;
            default:
              pointer = data;
          }
          if (prevIndex !== u - 5) {
            yield { type: "text", text: content.slice(prevIndex, u - 5) };
          }
          yield { type: "reference", pointer };
          index = end;
          prevIndex = index;
          continue mainloop;
        } catch (_err) {
          index = u + 1;
          continue mainloop;
        }
      } else if (content.slice(u - 5, u) === "https" || content.slice(u - 4, u) === "http") {
        const m = content.slice(u + 4).match(noURLCharacter);
        const end = m ? u + 4 + m.index : max;
        const prefixLen = content[u - 1] === "s" ? 5 : 4;
        try {
          let url = new URL(content.slice(u - prefixLen, end));
          if (url.hostname.indexOf(".") === -1) {
            throw new Error("invalid url");
          }
          if (prevIndex !== u - prefixLen) {
            yield { type: "text", text: content.slice(prevIndex, u - prefixLen) };
          }
          if (/\.(png|jpe?g|gif|webp|heic|svg)$/i.test(url.pathname)) {
            yield { type: "image", url: url.toString() };
            index = end;
            prevIndex = index;
            continue mainloop;
          }
          if (/\.(mp4|avi|webm|mkv|mov)$/i.test(url.pathname)) {
            yield { type: "video", url: url.toString() };
            index = end;
            prevIndex = index;
            continue mainloop;
          }
          if (/\.(mp3|aac|ogg|opus|wav|flac)$/i.test(url.pathname)) {
            yield { type: "audio", url: url.toString() };
            index = end;
            prevIndex = index;
            continue mainloop;
          }
          yield { type: "url", url: url.toString() };
          index = end;
          prevIndex = index;
          continue mainloop;
        } catch (_err) {
          index = end + 1;
          continue mainloop;
        }
      } else if (content.slice(u - 3, u) === "wss" || content.slice(u - 2, u) === "ws") {
        const m = content.slice(u + 4).match(noURLCharacter);
        const end = m ? u + 4 + m.index : max;
        const prefixLen = content[u - 1] === "s" ? 3 : 2;
        try {
          let url = new URL(content.slice(u - prefixLen, end));
          if (url.hostname.indexOf(".") === -1) {
            throw new Error("invalid ws url");
          }
          if (prevIndex !== u - prefixLen) {
            yield { type: "text", text: content.slice(prevIndex, u - prefixLen) };
          }
          yield { type: "relay", url: url.toString() };
          index = end;
          prevIndex = index;
          continue mainloop;
        } catch (_err) {
          index = end + 1;
          continue mainloop;
        }
      } else {
        for (let e = 0; e < emojis.length; e++) {
          const emoji = emojis[e];
          if (content[u + emoji.shortcode.length + 1] === ":" && content.slice(u + 1, u + emoji.shortcode.length + 1) === emoji.shortcode) {
            if (prevIndex !== u) {
              yield { type: "text", text: content.slice(prevIndex, u) };
            }
            yield emoji;
            index = u + emoji.shortcode.length + 2;
            prevIndex = index;
            continue mainloop;
          }
        }
        index = u + 1;
        continue mainloop;
      }
    }
  if (prevIndex !== max) {
    yield { type: "text", text: content.slice(prevIndex) };
  }
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
      tags: [...t.tags ?? []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelMetadataEvent = (t, privateKey) => {
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
      tags: [["e", t.channel_create_event_id], ...t.tags ?? []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelMessageEvent = (t, privateKey) => {
  const tags = [["e", t.channel_create_event_id, t.relay_url, "root"]];
  if (t.reply_to_channel_message_event_id) {
    tags.push(["e", t.reply_to_channel_message_event_id, t.relay_url, "reply"]);
  }
  return finalizeEvent(
    {
      kind: ChannelMessage,
      tags: [...tags, ...t.tags ?? []],
      content: t.content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelHideMessageEvent = (t, privateKey) => {
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
      tags: [["e", t.channel_message_event_id], ...t.tags ?? []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelMuteUserEvent = (t, privateKey) => {
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
      tags: [["p", t.pubkey_to_mute], ...t.tags ?? []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var nip30_exports = {};
__export2(nip30_exports, {
  EMOJI_SHORTCODE_REGEX: () => EMOJI_SHORTCODE_REGEX,
  matchAll: () => matchAll,
  regex: () => regex,
  replaceAll: () => replaceAll
});
var EMOJI_SHORTCODE_REGEX = /:(\w+):/;
var regex = () => new RegExp(`\\B${EMOJI_SHORTCODE_REGEX.source}\\B`, "g");
function* matchAll(content) {
  const matches = content.matchAll(regex());
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
function replaceAll(content, replacer) {
  return content.replaceAll(regex(), (shortcode, name) => {
    return replacer({
      shortcode,
      name
    });
  });
}
var nip39_exports = {};
__export2(nip39_exports, {
  useFetchImplementation: () => useFetchImplementation3,
  validateGithub: () => validateGithub
});
var _fetch3;
try {
  _fetch3 = fetch;
} catch {
}
function useFetchImplementation3(fetchImplementation) {
  _fetch3 = fetchImplementation;
}
async function validateGithub(pubkey, username, proof) {
  try {
    let res = await (await _fetch3(`https://gist.github.com/${username}/${proof}/raw`)).text();
    return res === `Verifying that I control the following Nostr public key: ${pubkey}`;
  } catch (_) {
    return false;
  }
}
var nip47_exports = {};
__export2(nip47_exports, {
  makeNwcRequestEvent: () => makeNwcRequestEvent,
  parseConnectionString: () => parseConnectionString
});
function parseConnectionString(connectionString) {
  const { host, pathname, searchParams } = new URL(connectionString);
  const pubkey = pathname || host;
  const relays = searchParams.getAll("relay");
  const secret = searchParams.get("secret");
  if (!pubkey || relays.length === 0 || !secret) {
    throw new Error("invalid connection string");
  }
  return { pubkey, relay: relays[0], relays, secret };
}
async function makeNwcRequestEvent(pubkey, secretKey, invoice) {
  const content = {
    method: "pay_invoice",
    params: {
      invoice
    }
  };
  const encryptedContent = encrypt2(secretKey, pubkey, JSON.stringify(content));
  const eventTemplate = {
    kind: NWCWalletRequest,
    created_at: Math.round(Date.now() / 1e3),
    content: encryptedContent,
    tags: [["p", pubkey]]
  };
  return finalizeEvent(eventTemplate, secretKey);
}
var nip54_exports = {};
__export2(nip54_exports, {
  normalizeIdentifier: () => normalizeIdentifier
});
function normalizeIdentifier(name) {
  name = name.trim().toLowerCase();
  name = name.normalize("NFKC");
  return Array.from(name).map((char) => {
    if (new RegExp("\\p{Letter}", "u").test(char) || new RegExp("\\p{Number}", "u").test(char)) {
      return char;
    }
    return "-";
  }).join("");
}
var nip57_exports = {};
__export2(nip57_exports, {
  getSatoshisAmountFromBolt11: () => getSatoshisAmountFromBolt11,
  getZapEndpoint: () => getZapEndpoint,
  makeZapReceipt: () => makeZapReceipt,
  makeZapRequest: () => makeZapRequest,
  useFetchImplementation: () => useFetchImplementation4,
  validateZapRequest: () => validateZapRequest
});
var _fetch4;
try {
  _fetch4 = fetch;
} catch {
}
function useFetchImplementation4(fetchImplementation) {
  _fetch4 = fetchImplementation;
}
async function getZapEndpoint(metadata) {
  try {
    let lnurl = "";
    let { lud06, lud16 } = JSON.parse(metadata.content);
    if (lud16) {
      let [name, domain] = lud16.split("@");
      lnurl = new URL(`/.well-known/lnurlp/${name}`, `https://${domain}`).toString();
    } else if (lud06) {
      let { words } = bech32.decode(lud06, 1e3);
      let data = bech32.fromWords(words);
      lnurl = utf8Decoder.decode(data);
    } else {
      return null;
    }
    let res = await _fetch4(lnurl);
    let body = await res.json();
    if (body.allowsNostr && body.nostrPubkey) {
      return body.callback;
    }
  } catch (err) {
  }
  return null;
}
function makeZapRequest(params) {
  let zr = {
    kind: 9734,
    created_at: Math.round(Date.now() / 1e3),
    content: params.comment || "",
    tags: [
      ["p", "pubkey" in params ? params.pubkey : params.event.pubkey],
      ["amount", params.amount.toString()],
      ["relays", ...params.relays]
    ]
  };
  if ("event" in params) {
    zr.tags.push(["e", params.event.id]);
    if (isReplaceableKind(params.event.kind)) {
      const a = ["a", `${params.event.kind}:${params.event.pubkey}:`];
      zr.tags.push(a);
    } else if (isAddressableKind(params.event.kind)) {
      let d5 = params.event.tags.find(([t, v]) => t === "d" && v);
      if (!d5)
        throw new Error("d tag not found or is empty");
      const a = ["a", `${params.event.kind}:${params.event.pubkey}:${d5[1]}`];
      zr.tags.push(a);
    }
    zr.tags.push(["k", params.event.kind.toString()]);
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
    tags: [...tagsFromZapRequest, ["P", zr.pubkey], ["bolt11", bolt11], ["description", zapRequest]]
  };
  if (preimage) {
    zap.tags.push(["preimage", preimage]);
  }
  return zap;
}
function getSatoshisAmountFromBolt11(bolt11) {
  if (bolt11.length < 50) {
    return 0;
  }
  bolt11 = bolt11.substring(0, 50);
  const idx = bolt11.lastIndexOf("1");
  if (idx === -1) {
    return 0;
  }
  const hrp = bolt11.substring(0, idx);
  if (!hrp.startsWith("lnbc")) {
    return 0;
  }
  const amount = hrp.substring(4);
  if (amount.length < 1) {
    return 0;
  }
  const char = amount[amount.length - 1];
  const digit = char.charCodeAt(0) - "0".charCodeAt(0);
  const isDigit = digit >= 0 && digit <= 9;
  let cutPoint = amount.length - 1;
  if (isDigit) {
    cutPoint++;
  }
  if (cutPoint < 1) {
    return 0;
  }
  const num3 = parseInt(amount.substring(0, cutPoint));
  switch (char) {
    case "m":
      return num3 * 1e5;
    case "u":
      return num3 * 100;
    case "n":
      return num3 / 10;
    case "p":
      return num3 / 1e4;
    default:
      return num3 * 1e8;
  }
}
var nip77_exports = {};
__export2(nip77_exports, {
  Negentropy: () => Negentropy,
  NegentropyStorageVector: () => NegentropyStorageVector,
  NegentropySync: () => NegentropySync
});
var PROTOCOL_VERSION = 97;
var ID_SIZE = 32;
var FINGERPRINT_SIZE = 16;
var Mode = {
  Skip: 0,
  Fingerprint: 1,
  IdList: 2
};
var WrappedBuffer = class {
  _raw;
  length;
  constructor(buffer) {
    if (typeof buffer === "number") {
      this._raw = new Uint8Array(buffer);
      this.length = 0;
    } else if (buffer instanceof Uint8Array) {
      this._raw = new Uint8Array(buffer);
      this.length = buffer.length;
    } else {
      this._raw = new Uint8Array(512);
      this.length = 0;
    }
  }
  unwrap() {
    return this._raw.subarray(0, this.length);
  }
  get capacity() {
    return this._raw.byteLength;
  }
  extend(buf) {
    if (buf instanceof WrappedBuffer)
      buf = buf.unwrap();
    if (typeof buf.length !== "number")
      throw Error("bad length");
    const targetSize = buf.length + this.length;
    if (this.capacity < targetSize) {
      const oldRaw = this._raw;
      const newCapacity = Math.max(this.capacity * 2, targetSize);
      this._raw = new Uint8Array(newCapacity);
      this._raw.set(oldRaw);
    }
    this._raw.set(buf, this.length);
    this.length += buf.length;
  }
  shift() {
    const first = this._raw[0];
    this._raw = this._raw.subarray(1);
    this.length--;
    return first;
  }
  shiftN(n = 1) {
    const firstSubarray = this._raw.subarray(0, n);
    this._raw = this._raw.subarray(n);
    this.length -= n;
    return firstSubarray;
  }
};
function decodeVarInt(buf) {
  let res = 0;
  while (1) {
    if (buf.length === 0)
      throw Error("parse ends prematurely");
    let byte = buf.shift();
    res = res << 7 | byte & 127;
    if ((byte & 128) === 0)
      break;
  }
  return res;
}
function encodeVarInt(n) {
  if (n === 0)
    return new WrappedBuffer(new Uint8Array([0]));
  let o = [];
  while (n !== 0) {
    o.push(n & 127);
    n >>>= 7;
  }
  o.reverse();
  for (let i2 = 0; i2 < o.length - 1; i2++)
    o[i2] |= 128;
  return new WrappedBuffer(new Uint8Array(o));
}
function getByte(buf) {
  return getBytes(buf, 1)[0];
}
function getBytes(buf, n) {
  if (buf.length < n)
    throw Error("parse ends prematurely");
  return buf.shiftN(n);
}
var Accumulator = class {
  buf;
  constructor() {
    this.setToZero();
  }
  setToZero() {
    this.buf = new Uint8Array(ID_SIZE);
  }
  add(otherBuf) {
    let currCarry = 0, nextCarry = 0;
    let p = new DataView(this.buf.buffer);
    let po = new DataView(otherBuf.buffer);
    for (let i2 = 0; i2 < 8; i2++) {
      let offset = i2 * 4;
      let orig = p.getUint32(offset, true);
      let otherV = po.getUint32(offset, true);
      let next2 = orig;
      next2 += currCarry;
      next2 += otherV;
      if (next2 > 4294967295)
        nextCarry = 1;
      p.setUint32(offset, next2 & 4294967295, true);
      currCarry = nextCarry;
      nextCarry = 0;
    }
  }
  negate() {
    let p = new DataView(this.buf.buffer);
    for (let i2 = 0; i2 < 8; i2++) {
      let offset = i2 * 4;
      p.setUint32(offset, ~p.getUint32(offset, true));
    }
    let one = new Uint8Array(ID_SIZE);
    one[0] = 1;
    this.add(one);
  }
  getFingerprint(n) {
    let input = new WrappedBuffer();
    input.extend(this.buf);
    input.extend(encodeVarInt(n));
    let hash = sha2562(input.unwrap());
    return hash.subarray(0, FINGERPRINT_SIZE);
  }
};
var NegentropyStorageVector = class {
  items;
  sealed;
  constructor() {
    this.items = [];
    this.sealed = false;
  }
  insert(timestamp, id) {
    if (this.sealed)
      throw Error("already sealed");
    const idb = hexToBytes2(id);
    if (idb.byteLength !== ID_SIZE)
      throw Error("bad id size for added item");
    this.items.push({ timestamp, id: idb });
  }
  seal() {
    if (this.sealed)
      throw Error("already sealed");
    this.sealed = true;
    this.items.sort(itemCompare);
    for (let i2 = 1; i2 < this.items.length; i2++) {
      if (itemCompare(this.items[i2 - 1], this.items[i2]) === 0)
        throw Error("duplicate item inserted");
    }
  }
  unseal() {
    this.sealed = false;
  }
  size() {
    this._checkSealed();
    return this.items.length;
  }
  getItem(i2) {
    this._checkSealed();
    if (i2 >= this.items.length)
      throw Error("out of range");
    return this.items[i2];
  }
  iterate(begin, end, cb) {
    this._checkSealed();
    this._checkBounds(begin, end);
    for (let i2 = begin; i2 < end; ++i2) {
      if (!cb(this.items[i2], i2))
        break;
    }
  }
  findLowerBound(begin, end, bound) {
    this._checkSealed();
    this._checkBounds(begin, end);
    return this._binarySearch(this.items, begin, end, (a) => itemCompare(a, bound) < 0);
  }
  fingerprint(begin, end) {
    let out = new Accumulator();
    out.setToZero();
    this.iterate(begin, end, (item) => {
      out.add(item.id);
      return true;
    });
    return out.getFingerprint(end - begin);
  }
  _checkSealed() {
    if (!this.sealed)
      throw Error("not sealed");
  }
  _checkBounds(begin, end) {
    if (begin > end || end > this.items.length)
      throw Error("bad range");
  }
  _binarySearch(arr, first, last, cmp2) {
    let count = last - first;
    while (count > 0) {
      let it = first;
      let step = Math.floor(count / 2);
      it += step;
      if (cmp2(arr[it])) {
        first = ++it;
        count -= step + 1;
      } else {
        count = step;
      }
    }
    return first;
  }
};
var Negentropy = class {
  storage;
  frameSizeLimit;
  lastTimestampIn;
  lastTimestampOut;
  constructor(storage, frameSizeLimit = 6e4) {
    if (frameSizeLimit < 4096)
      throw Error("frameSizeLimit too small");
    this.storage = storage;
    this.frameSizeLimit = frameSizeLimit;
    this.lastTimestampIn = 0;
    this.lastTimestampOut = 0;
  }
  _bound(timestamp, id) {
    return { timestamp, id: id || new Uint8Array(0) };
  }
  initiate() {
    let output = new WrappedBuffer();
    output.extend(new Uint8Array([PROTOCOL_VERSION]));
    this.splitRange(0, this.storage.size(), this._bound(Number.MAX_VALUE), output);
    return bytesToHex2(output.unwrap());
  }
  reconcile(queryMsg, onhave, onneed) {
    const query = new WrappedBuffer(hexToBytes2(queryMsg));
    this.lastTimestampIn = this.lastTimestampOut = 0;
    let fullOutput = new WrappedBuffer();
    fullOutput.extend(new Uint8Array([PROTOCOL_VERSION]));
    let protocolVersion = getByte(query);
    if (protocolVersion < 96 || protocolVersion > 111)
      throw Error("invalid negentropy protocol version byte");
    if (protocolVersion !== PROTOCOL_VERSION) {
      throw Error("unsupported negentropy protocol version requested: " + (protocolVersion - 96));
    }
    let storageSize = this.storage.size();
    let prevBound = this._bound(0);
    let prevIndex = 0;
    let skip = false;
    while (query.length !== 0) {
      let o = new WrappedBuffer();
      let doSkip = () => {
        if (skip) {
          skip = false;
          o.extend(this.encodeBound(prevBound));
          o.extend(encodeVarInt(Mode.Skip));
        }
      };
      let currBound = this.decodeBound(query);
      let mode = decodeVarInt(query);
      let lower = prevIndex;
      let upper = this.storage.findLowerBound(prevIndex, storageSize, currBound);
      if (mode === Mode.Skip) {
        skip = true;
      } else if (mode === Mode.Fingerprint) {
        let theirFingerprint = getBytes(query, FINGERPRINT_SIZE);
        let ourFingerprint = this.storage.fingerprint(lower, upper);
        if (compareUint8Array(theirFingerprint, ourFingerprint) !== 0) {
          doSkip();
          this.splitRange(lower, upper, currBound, o);
        } else {
          skip = true;
        }
      } else if (mode === Mode.IdList) {
        let numIds = decodeVarInt(query);
        let theirElems = {};
        for (let i2 = 0; i2 < numIds; i2++) {
          let e = getBytes(query, ID_SIZE);
          theirElems[bytesToHex2(e)] = e;
        }
        skip = true;
        this.storage.iterate(lower, upper, (item) => {
          let k = item.id;
          const id = bytesToHex2(k);
          if (!theirElems[id]) {
            onhave?.(id);
          } else {
            delete theirElems[bytesToHex2(k)];
          }
          return true;
        });
        if (onneed) {
          for (let v of Object.values(theirElems)) {
            onneed(bytesToHex2(v));
          }
        }
      } else {
        throw Error("unexpected mode");
      }
      if (this.exceededFrameSizeLimit(fullOutput.length + o.length)) {
        let remainingFingerprint = this.storage.fingerprint(upper, storageSize);
        fullOutput.extend(this.encodeBound(this._bound(Number.MAX_VALUE)));
        fullOutput.extend(encodeVarInt(Mode.Fingerprint));
        fullOutput.extend(remainingFingerprint);
        break;
      } else {
        fullOutput.extend(o);
      }
      prevIndex = upper;
      prevBound = currBound;
    }
    return fullOutput.length === 1 ? null : bytesToHex2(fullOutput.unwrap());
  }
  splitRange(lower, upper, upperBound, o) {
    let numElems = upper - lower;
    let buckets = 16;
    if (numElems < buckets * 2) {
      o.extend(this.encodeBound(upperBound));
      o.extend(encodeVarInt(Mode.IdList));
      o.extend(encodeVarInt(numElems));
      this.storage.iterate(lower, upper, (item) => {
        o.extend(item.id);
        return true;
      });
    } else {
      let itemsPerBucket = Math.floor(numElems / buckets);
      let bucketsWithExtra = numElems % buckets;
      let curr = lower;
      for (let i2 = 0; i2 < buckets; i2++) {
        let bucketSize = itemsPerBucket + (i2 < bucketsWithExtra ? 1 : 0);
        let ourFingerprint = this.storage.fingerprint(curr, curr + bucketSize);
        curr += bucketSize;
        let nextBound;
        if (curr === upper) {
          nextBound = upperBound;
        } else {
          let prevItem;
          let currItem;
          this.storage.iterate(curr - 1, curr + 1, (item, index) => {
            if (index === curr - 1)
              prevItem = item;
            else
              currItem = item;
            return true;
          });
          nextBound = this.getMinimalBound(prevItem, currItem);
        }
        o.extend(this.encodeBound(nextBound));
        o.extend(encodeVarInt(Mode.Fingerprint));
        o.extend(ourFingerprint);
      }
    }
  }
  exceededFrameSizeLimit(n) {
    return n > this.frameSizeLimit - 200;
  }
  decodeTimestampIn(encoded) {
    let timestamp = decodeVarInt(encoded);
    timestamp = timestamp === 0 ? Number.MAX_VALUE : timestamp - 1;
    if (this.lastTimestampIn === Number.MAX_VALUE || timestamp === Number.MAX_VALUE) {
      this.lastTimestampIn = Number.MAX_VALUE;
      return Number.MAX_VALUE;
    }
    timestamp += this.lastTimestampIn;
    this.lastTimestampIn = timestamp;
    return timestamp;
  }
  decodeBound(encoded) {
    let timestamp = this.decodeTimestampIn(encoded);
    let len = decodeVarInt(encoded);
    if (len > ID_SIZE)
      throw Error("bound key too long");
    let id = getBytes(encoded, len);
    return { timestamp, id };
  }
  encodeTimestampOut(timestamp) {
    if (timestamp === Number.MAX_VALUE) {
      this.lastTimestampOut = Number.MAX_VALUE;
      return encodeVarInt(0);
    }
    let temp = timestamp;
    timestamp -= this.lastTimestampOut;
    this.lastTimestampOut = temp;
    return encodeVarInt(timestamp + 1);
  }
  encodeBound(key) {
    let output = new WrappedBuffer();
    output.extend(this.encodeTimestampOut(key.timestamp));
    output.extend(encodeVarInt(key.id.length));
    output.extend(key.id);
    return output;
  }
  getMinimalBound(prev, curr) {
    if (curr.timestamp !== prev.timestamp) {
      return this._bound(curr.timestamp);
    } else {
      let sharedPrefixBytes = 0;
      let currKey = curr.id;
      let prevKey = prev.id;
      for (let i2 = 0; i2 < ID_SIZE; i2++) {
        if (currKey[i2] !== prevKey[i2])
          break;
        sharedPrefixBytes++;
      }
      return this._bound(curr.timestamp, curr.id.subarray(0, sharedPrefixBytes + 1));
    }
  }
};
function compareUint8Array(a, b) {
  for (let i2 = 0; i2 < a.byteLength; i2++) {
    if (a[i2] < b[i2])
      return -1;
    if (a[i2] > b[i2])
      return 1;
  }
  if (a.byteLength > b.byteLength)
    return 1;
  if (a.byteLength < b.byteLength)
    return -1;
  return 0;
}
function itemCompare(a, b) {
  if (a.timestamp === b.timestamp) {
    return compareUint8Array(a.id, b.id);
  }
  return a.timestamp - b.timestamp;
}
var NegentropySync = class {
  relay;
  storage;
  neg;
  filter;
  subscription;
  onhave;
  onneed;
  constructor(relay, storage, filter, params = {}) {
    this.relay = relay;
    this.storage = storage;
    this.neg = new Negentropy(storage);
    this.onhave = params.onhave;
    this.onneed = params.onneed;
    this.filter = filter;
    this.subscription = this.relay.prepareSubscription([{}], { label: params.label || "negentropy" });
    this.subscription.oncustom = (data) => {
      switch (data[0]) {
        case "NEG-MSG": {
          if (data.length < 3) {
            console.warn(`got invalid NEG-MSG from ${this.relay.url}: ${data}`);
          }
          try {
            const response = this.neg.reconcile(data[2], this.onhave, this.onneed);
            if (response) {
              this.relay.send(`["NEG-MSG", "${this.subscription.id}", "${response}"]`);
            } else {
              this.close();
              params.onclose?.();
            }
          } catch (error) {
            console.error("negentropy reconcile error:", error);
            params?.onclose?.(`reconcile error: ${error}`);
          }
          break;
        }
        case "NEG-CLOSE": {
          const reason = data[2];
          console.warn("negentropy error:", reason);
          params.onclose?.(reason);
          break;
        }
        case "NEG-ERR": {
          params.onclose?.();
        }
      }
    };
  }
  async start() {
    const initMsg = this.neg.initiate();
    this.relay.send(`["NEG-OPEN","${this.subscription.id}",${JSON.stringify(this.filter)},"${initMsg}"]`);
  }
  close() {
    this.relay.send(`["NEG-CLOSE","${this.subscription.id}"]`);
    this.subscription.close();
  }
};
var nip98_exports = {};
__export2(nip98_exports, {
  getToken: () => getToken,
  hashPayload: () => hashPayload,
  unpackEventFromToken: () => unpackEventFromToken,
  validateEvent: () => validateEvent2,
  validateEventKind: () => validateEventKind,
  validateEventMethodTag: () => validateEventMethodTag,
  validateEventPayloadTag: () => validateEventPayloadTag,
  validateEventTimestamp: () => validateEventTimestamp,
  validateEventUrlTag: () => validateEventUrlTag,
  validateToken: () => validateToken
});
var _authorizationScheme = "Nostr ";
async function getToken(loginUrl, httpMethod, sign, includeAuthorizationScheme = false, payload) {
  const event = {
    kind: HTTPAuth,
    tags: [
      ["u", loginUrl],
      ["method", httpMethod]
    ],
    created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3),
    content: ""
  };
  if (payload) {
    event.tags.push(["payload", hashPayload(payload)]);
  }
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
function validateEventTimestamp(event) {
  if (!event.created_at) {
    return false;
  }
  return Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) - event.created_at < 60;
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
  const hash = sha2562(utf8Encoder.encode(JSON.stringify(payload)));
  return bytesToHex2(hash);
}
function validateEventPayloadTag(event, payload) {
  const payloadTag = event.tags.find((t) => t[0] === "payload");
  if (!payloadTag) {
    return false;
  }
  const payloadHash = hashPayload(payload);
  return payloadTag.length > 0 && payloadTag[1] === payloadHash;
}
async function validateEvent2(event, url, method, body) {
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

// node_modules/@noble/hashes/esm/cryptoNode.js
var nc = __toESM(require("node:crypto"), 1);
var crypto2 = nc && typeof nc === "object" && "webcrypto" in nc ? nc.webcrypto : nc && typeof nc === "object" && "randomBytes" in nc ? nc : void 0;

// node_modules/@noble/hashes/esm/utils.js
function isBytes5(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function anumber5(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error("positive integer expected, got " + n);
}
function abytes5(b, ...lengths) {
  if (!isBytes5(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
function ahash3(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  anumber5(h.outputLen);
  anumber5(h.blockLen);
}
function aexists4(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput4(out, instance) {
  abytes5(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function clean4(...arrays) {
  for (let i2 = 0; i2 < arrays.length; i2++) {
    arrays[i2].fill(0);
  }
}
function createView4(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr3(word, shift) {
  return word << 32 - shift | word >>> shift;
}
var hasHexBuiltin3 = /* @__PURE__ */ (() => (
  // @ts-ignore
  typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
))();
var hexes3 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i2) => i2.toString(16).padStart(2, "0"));
function bytesToHex4(bytes) {
  abytes5(bytes);
  if (hasHexBuiltin3)
    return bytes.toHex();
  let hex = "";
  for (let i2 = 0; i2 < bytes.length; i2++) {
    hex += hexes3[bytes[i2]];
  }
  return hex;
}
var asciis3 = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function asciiToBase163(ch) {
  if (ch >= asciis3._0 && ch <= asciis3._9)
    return ch - asciis3._0;
  if (ch >= asciis3.A && ch <= asciis3.F)
    return ch - (asciis3.A - 10);
  if (ch >= asciis3.a && ch <= asciis3.f)
    return ch - (asciis3.a - 10);
  return;
}
function hexToBytes3(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  if (hasHexBuiltin3)
    return Uint8Array.fromHex(hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase163(hex.charCodeAt(hi));
    const n2 = asciiToBase163(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  abytes5(data);
  return data;
}
function concatBytes4(...arrays) {
  let sum = 0;
  for (let i2 = 0; i2 < arrays.length; i2++) {
    const a = arrays[i2];
    abytes5(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i2 = 0, pad2 = 0; i2 < arrays.length; i2++) {
    const a = arrays[i2];
    res.set(a, pad2);
    pad2 += a.length;
  }
  return res;
}
var Hash = class {
};
function createHasher3(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function randomBytes4(bytesLength = 32) {
  if (crypto2 && typeof crypto2.getRandomValues === "function") {
    return crypto2.getRandomValues(new Uint8Array(bytesLength));
  }
  if (crypto2 && typeof crypto2.randomBytes === "function") {
    return Uint8Array.from(crypto2.randomBytes(bytesLength));
  }
  throw new Error("crypto.getRandomValues must be defined");
}

// node_modules/@noble/hashes/esm/_md.js
function setBigUint64(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE2);
  view.setUint32(byteOffset + l, wl, isLE2);
}
function Chi3(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj3(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD3 = class extends Hash {
  constructor(blockLen, outputLen, padOffset, isLE2) {
    super();
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE2;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView4(this.buffer);
  }
  update(data) {
    aexists4(this);
    data = toBytes(data);
    abytes5(data);
    const { view, buffer, blockLen } = this;
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView4(data);
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
    aexists4(this);
    aoutput4(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE2 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    clean4(this.buffer.subarray(pos));
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i2 = pos; i2 < blockLen; i2++)
      buffer[i2] = 0;
    setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
    this.process(view, 0);
    const oview = createView4(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state2 = this.get();
    if (outLen > state2.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i2 = 0; i2 < outLen; i2++)
      oview.setUint32(4 * i2, state2[i2], isLE2);
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
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
};
var SHA256_IV3 = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);

// node_modules/@noble/hashes/esm/sha2.js
var SHA256_K3 = /* @__PURE__ */ Uint32Array.from([
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
var SHA256_W3 = /* @__PURE__ */ new Uint32Array(64);
var SHA256 = class extends HashMD3 {
  constructor(outputLen = 32) {
    super(64, outputLen, 8, false);
    this.A = SHA256_IV3[0] | 0;
    this.B = SHA256_IV3[1] | 0;
    this.C = SHA256_IV3[2] | 0;
    this.D = SHA256_IV3[3] | 0;
    this.E = SHA256_IV3[4] | 0;
    this.F = SHA256_IV3[5] | 0;
    this.G = SHA256_IV3[6] | 0;
    this.H = SHA256_IV3[7] | 0;
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
    clean4(SHA256_W3);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean4(this.buffer);
  }
};
var sha2563 = /* @__PURE__ */ createHasher3(() => new SHA256());

// node_modules/@noble/hashes/esm/hmac.js
var HMAC = class extends Hash {
  constructor(hash, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    ahash3(hash);
    const key = toBytes(_key);
    this.iHash = hash.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad2 = new Uint8Array(blockLen);
    pad2.set(key.length > blockLen ? hash.create().update(key).digest() : key);
    for (let i2 = 0; i2 < pad2.length; i2++)
      pad2[i2] ^= 54;
    this.iHash.update(pad2);
    this.oHash = hash.create();
    for (let i2 = 0; i2 < pad2.length; i2++)
      pad2[i2] ^= 54 ^ 92;
    this.oHash.update(pad2);
    clean4(pad2);
  }
  update(buf) {
    aexists4(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    aexists4(this);
    abytes5(out, this.outputLen);
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
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac3 = (hash, key, message) => new HMAC(hash, key).update(message).digest();
hmac3.create = (hash, key) => new HMAC(hash, key);

// node_modules/@nostr-dev-kit/ndk/node_modules/@noble/curves/esm/utils.js
var _0n6 = /* @__PURE__ */ BigInt(0);
var _1n5 = /* @__PURE__ */ BigInt(1);
function _abool2(value, title = "") {
  if (typeof value !== "boolean") {
    const prefix = title && `"${title}"`;
    throw new Error(prefix + "expected boolean, got type=" + typeof value);
  }
  return value;
}
function _abytes2(value, length, title = "") {
  const bytes = isBytes5(value);
  const len = value?.length;
  const needsLen = length !== void 0;
  if (!bytes || needsLen && len !== length) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
  }
  return value;
}
function numberToHexUnpadded2(num3) {
  const hex = num3.toString(16);
  return hex.length & 1 ? "0" + hex : hex;
}
function hexToNumber3(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  return hex === "" ? _0n6 : BigInt("0x" + hex);
}
function bytesToNumberBE2(bytes) {
  return hexToNumber3(bytesToHex4(bytes));
}
function bytesToNumberLE2(bytes) {
  abytes5(bytes);
  return hexToNumber3(bytesToHex4(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE3(n, len) {
  return hexToBytes3(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE2(n, len) {
  return numberToBytesBE3(n, len).reverse();
}
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === "string") {
    try {
      res = hexToBytes3(hex);
    } catch (e) {
      throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
    }
  } else if (isBytes5(hex)) {
    res = Uint8Array.from(hex);
  } else {
    throw new Error(title + " must be hex string or Uint8Array");
  }
  const len = res.length;
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(title + " of length " + expectedLength + " expected, got " + len);
  return res;
}
var isPosBig2 = (n) => typeof n === "bigint" && _0n6 <= n;
function inRange2(n, min, max) {
  return isPosBig2(n) && isPosBig2(min) && isPosBig2(max) && min <= n && n < max;
}
function aInRange2(title, n, min, max) {
  if (!inRange2(n, min, max))
    throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
function bitLen2(n) {
  let len;
  for (len = 0; n > _0n6; n >>= _1n5, len += 1)
    ;
  return len;
}
var bitMask2 = (n) => (_1n5 << BigInt(n)) - _1n5;
function createHmacDrbg2(hashLen, qByteLen, hmacFn) {
  if (typeof hashLen !== "number" || hashLen < 2)
    throw new Error("hashLen must be a number");
  if (typeof qByteLen !== "number" || qByteLen < 2)
    throw new Error("qByteLen must be a number");
  if (typeof hmacFn !== "function")
    throw new Error("hmacFn must be a function");
  const u8n = (len) => new Uint8Array(len);
  const u8of = (byte) => Uint8Array.of(byte);
  let v = u8n(hashLen);
  let k = u8n(hashLen);
  let i2 = 0;
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i2 = 0;
  };
  const h = (...b) => hmacFn(k, v, ...b);
  const reseed = (seed = u8n(0)) => {
    k = h(u8of(0), seed);
    v = h();
    if (seed.length === 0)
      return;
    k = h(u8of(1), seed);
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
    return concatBytes4(...out);
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
function _validateObject(object, fields, optFields = {}) {
  if (!object || typeof object !== "object")
    throw new Error("expected valid options object");
  function checkField(fieldName, expectedType, isOpt) {
    const val = object[fieldName];
    if (isOpt && val === void 0)
      return;
    const current = typeof val;
    if (current !== expectedType || val === null)
      throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
  }
  Object.entries(fields).forEach(([k, v]) => checkField(k, v, false));
  Object.entries(optFields).forEach(([k, v]) => checkField(k, v, true));
}
function memoized2(fn) {
  const map = /* @__PURE__ */ new WeakMap();
  return (arg, ...args) => {
    const val = map.get(arg);
    if (val !== void 0)
      return val;
    const computed = fn(arg, ...args);
    map.set(arg, computed);
    return computed;
  };
}

// node_modules/@nostr-dev-kit/ndk/node_modules/@noble/curves/esm/abstract/modular.js
var _0n7 = BigInt(0);
var _1n6 = BigInt(1);
var _2n4 = /* @__PURE__ */ BigInt(2);
var _3n3 = /* @__PURE__ */ BigInt(3);
var _4n3 = /* @__PURE__ */ BigInt(4);
var _5n2 = /* @__PURE__ */ BigInt(5);
var _7n2 = /* @__PURE__ */ BigInt(7);
var _8n2 = /* @__PURE__ */ BigInt(8);
var _9n2 = /* @__PURE__ */ BigInt(9);
var _16n2 = /* @__PURE__ */ BigInt(16);
function mod2(a, b) {
  const result = a % b;
  return result >= _0n7 ? result : b + result;
}
function pow22(x, power, modulo) {
  let res = x;
  while (power-- > _0n7) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert2(number, modulo) {
  if (number === _0n7)
    throw new Error("invert: expected non-zero number");
  if (modulo <= _0n7)
    throw new Error("invert: expected positive modulus, got " + modulo);
  let a = mod2(number, modulo);
  let b = modulo;
  let x = _0n7, y = _1n6, u = _1n6, v = _0n7;
  while (a !== _0n7) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd2 = b;
  if (gcd2 !== _1n6)
    throw new Error("invert: does not exist");
  return mod2(x, modulo);
}
function assertIsSquare2(Fp, root, n) {
  if (!Fp.eql(Fp.sqr(root), n))
    throw new Error("Cannot find square root");
}
function sqrt3mod42(Fp, n) {
  const p1div4 = (Fp.ORDER + _1n6) / _4n3;
  const root = Fp.pow(n, p1div4);
  assertIsSquare2(Fp, root, n);
  return root;
}
function sqrt5mod82(Fp, n) {
  const p5div8 = (Fp.ORDER - _5n2) / _8n2;
  const n2 = Fp.mul(n, _2n4);
  const v = Fp.pow(n2, p5div8);
  const nv = Fp.mul(n, v);
  const i2 = Fp.mul(Fp.mul(nv, _2n4), v);
  const root = Fp.mul(nv, Fp.sub(i2, Fp.ONE));
  assertIsSquare2(Fp, root, n);
  return root;
}
function sqrt9mod162(P) {
  const Fp_ = Field2(P);
  const tn = tonelliShanks2(P);
  const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
  const c2 = tn(Fp_, c1);
  const c3 = tn(Fp_, Fp_.neg(c1));
  const c4 = (P + _7n2) / _16n2;
  return (Fp, n) => {
    let tv1 = Fp.pow(n, c4);
    let tv2 = Fp.mul(tv1, c1);
    const tv3 = Fp.mul(tv1, c2);
    const tv4 = Fp.mul(tv1, c3);
    const e1 = Fp.eql(Fp.sqr(tv2), n);
    const e2 = Fp.eql(Fp.sqr(tv3), n);
    tv1 = Fp.cmov(tv1, tv2, e1);
    tv2 = Fp.cmov(tv4, tv3, e2);
    const e3 = Fp.eql(Fp.sqr(tv2), n);
    const root = Fp.cmov(tv1, tv2, e3);
    assertIsSquare2(Fp, root, n);
    return root;
  };
}
function tonelliShanks2(P) {
  if (P < _3n3)
    throw new Error("sqrt is not defined for small field");
  let Q = P - _1n6;
  let S = 0;
  while (Q % _2n4 === _0n7) {
    Q /= _2n4;
    S++;
  }
  let Z = _2n4;
  const _Fp = Field2(P);
  while (FpLegendre2(_Fp, Z) === 1) {
    if (Z++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  }
  if (S === 1)
    return sqrt3mod42;
  let cc = _Fp.pow(Z, Q);
  const Q1div2 = (Q + _1n6) / _2n4;
  return function tonelliSlow(Fp, n) {
    if (Fp.is0(n))
      return n;
    if (FpLegendre2(Fp, n) !== 1)
      throw new Error("Cannot find square root");
    let M = S;
    let c = Fp.mul(Fp.ONE, cc);
    let t = Fp.pow(n, Q);
    let R = Fp.pow(n, Q1div2);
    while (!Fp.eql(t, Fp.ONE)) {
      if (Fp.is0(t))
        return Fp.ZERO;
      let i2 = 1;
      let t_tmp = Fp.sqr(t);
      while (!Fp.eql(t_tmp, Fp.ONE)) {
        i2++;
        t_tmp = Fp.sqr(t_tmp);
        if (i2 === M)
          throw new Error("Cannot find square root");
      }
      const exponent = _1n6 << BigInt(M - i2 - 1);
      const b = Fp.pow(c, exponent);
      M = i2;
      c = Fp.sqr(b);
      t = Fp.mul(t, c);
      R = Fp.mul(R, b);
    }
    return R;
  };
}
function FpSqrt2(P) {
  if (P % _4n3 === _3n3)
    return sqrt3mod42;
  if (P % _8n2 === _5n2)
    return sqrt5mod82;
  if (P % _16n2 === _9n2)
    return sqrt9mod162(P);
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
    BYTES: "number",
    BITS: "number"
  };
  const opts = FIELD_FIELDS2.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  _validateObject(field, opts);
  return field;
}
function FpPow2(Fp, num3, power) {
  if (power < _0n7)
    throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n7)
    return Fp.ONE;
  if (power === _1n6)
    return num3;
  let p = Fp.ONE;
  let d5 = num3;
  while (power > _0n7) {
    if (power & _1n6)
      p = Fp.mul(p, d5);
    d5 = Fp.sqr(d5);
    power >>= _1n6;
  }
  return p;
}
function FpInvertBatch2(Fp, nums, passZero = false) {
  const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
  const multipliedAcc = nums.reduce((acc, num3, i2) => {
    if (Fp.is0(num3))
      return acc;
    inverted[i2] = acc;
    return Fp.mul(acc, num3);
  }, Fp.ONE);
  const invertedAcc = Fp.inv(multipliedAcc);
  nums.reduceRight((acc, num3, i2) => {
    if (Fp.is0(num3))
      return acc;
    inverted[i2] = Fp.mul(acc, inverted[i2]);
    return Fp.mul(acc, num3);
  }, invertedAcc);
  return inverted;
}
function FpLegendre2(Fp, n) {
  const p1mod2 = (Fp.ORDER - _1n6) / _2n4;
  const powered = Fp.pow(n, p1mod2);
  const yes = Fp.eql(powered, Fp.ONE);
  const zero = Fp.eql(powered, Fp.ZERO);
  const no = Fp.eql(powered, Fp.neg(Fp.ONE));
  if (!yes && !zero && !no)
    throw new Error("invalid Legendre symbol result");
  return yes ? 1 : zero ? 0 : -1;
}
function nLength2(n, nBitLength) {
  if (nBitLength !== void 0)
    anumber5(nBitLength);
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
function Field2(ORDER, bitLenOrOpts, isLE2 = false, opts = {}) {
  if (ORDER <= _0n7)
    throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
  let _nbitLength = void 0;
  let _sqrt = void 0;
  let modFromBytes = false;
  let allowedLengths = void 0;
  if (typeof bitLenOrOpts === "object" && bitLenOrOpts != null) {
    if (opts.sqrt || isLE2)
      throw new Error("cannot specify opts in two arguments");
    const _opts = bitLenOrOpts;
    if (_opts.BITS)
      _nbitLength = _opts.BITS;
    if (_opts.sqrt)
      _sqrt = _opts.sqrt;
    if (typeof _opts.isLE === "boolean")
      isLE2 = _opts.isLE;
    if (typeof _opts.modFromBytes === "boolean")
      modFromBytes = _opts.modFromBytes;
    allowedLengths = _opts.allowedLengths;
  } else {
    if (typeof bitLenOrOpts === "number")
      _nbitLength = bitLenOrOpts;
    if (opts.sqrt)
      _sqrt = opts.sqrt;
  }
  const { nBitLength: BITS, nByteLength: BYTES } = nLength2(ORDER, _nbitLength);
  if (BYTES > 2048)
    throw new Error("invalid field: expected ORDER of <= 2048 bytes");
  let sqrtP;
  const f = Object.freeze({
    ORDER,
    isLE: isLE2,
    BITS,
    BYTES,
    MASK: bitMask2(BITS),
    ZERO: _0n7,
    ONE: _1n6,
    allowedLengths,
    create: (num3) => mod2(num3, ORDER),
    isValid: (num3) => {
      if (typeof num3 !== "bigint")
        throw new Error("invalid field element: expected bigint, got " + typeof num3);
      return _0n7 <= num3 && num3 < ORDER;
    },
    is0: (num3) => num3 === _0n7,
    // is valid and invertible
    isValidNot0: (num3) => !f.is0(num3) && f.isValid(num3),
    isOdd: (num3) => (num3 & _1n6) === _1n6,
    neg: (num3) => mod2(-num3, ORDER),
    eql: (lhs, rhs) => lhs === rhs,
    sqr: (num3) => mod2(num3 * num3, ORDER),
    add: (lhs, rhs) => mod2(lhs + rhs, ORDER),
    sub: (lhs, rhs) => mod2(lhs - rhs, ORDER),
    mul: (lhs, rhs) => mod2(lhs * rhs, ORDER),
    pow: (num3, power) => FpPow2(f, num3, power),
    div: (lhs, rhs) => mod2(lhs * invert2(rhs, ORDER), ORDER),
    // Same as above, but doesn't normalize
    sqrN: (num3) => num3 * num3,
    addN: (lhs, rhs) => lhs + rhs,
    subN: (lhs, rhs) => lhs - rhs,
    mulN: (lhs, rhs) => lhs * rhs,
    inv: (num3) => invert2(num3, ORDER),
    sqrt: _sqrt || ((n) => {
      if (!sqrtP)
        sqrtP = FpSqrt2(ORDER);
      return sqrtP(f, n);
    }),
    toBytes: (num3) => isLE2 ? numberToBytesLE2(num3, BYTES) : numberToBytesBE3(num3, BYTES),
    fromBytes: (bytes, skipValidation = true) => {
      if (allowedLengths) {
        if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
          throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
        }
        const padded = new Uint8Array(BYTES);
        padded.set(bytes, isLE2 ? 0 : padded.length - bytes.length);
        bytes = padded;
      }
      if (bytes.length !== BYTES)
        throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
      let scalar = isLE2 ? bytesToNumberLE2(bytes) : bytesToNumberBE2(bytes);
      if (modFromBytes)
        scalar = mod2(scalar, ORDER);
      if (!skipValidation) {
        if (!f.isValid(scalar))
          throw new Error("invalid field element: outside of range 0..ORDER");
      }
      return scalar;
    },
    // TODO: we don't need it here, move out to separate fn
    invertBatch: (lst) => FpInvertBatch2(f, lst),
    // We can't move this out because Fp6, Fp12 implement it
    // and it's unclear what to return in there.
    cmov: (a, b, c) => c ? b : a
  });
  return Object.freeze(f);
}
function getFieldBytesLength2(fieldOrder) {
  if (typeof fieldOrder !== "bigint")
    throw new Error("field order must be bigint");
  const bitLength = fieldOrder.toString(2).length;
  return Math.ceil(bitLength / 8);
}
function getMinHashLength2(fieldOrder) {
  const length = getFieldBytesLength2(fieldOrder);
  return length + Math.ceil(length / 2);
}
function mapHashToField2(key, fieldOrder, isLE2 = false) {
  const len = key.length;
  const fieldLen = getFieldBytesLength2(fieldOrder);
  const minLen = getMinHashLength2(fieldOrder);
  if (len < 16 || len < minLen || len > 1024)
    throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
  const num3 = isLE2 ? bytesToNumberLE2(key) : bytesToNumberBE2(key);
  const reduced = mod2(num3, fieldOrder - _1n6) + _1n6;
  return isLE2 ? numberToBytesLE2(reduced, fieldLen) : numberToBytesBE3(reduced, fieldLen);
}

// node_modules/@nostr-dev-kit/ndk/node_modules/@noble/curves/esm/abstract/curve.js
var _0n8 = BigInt(0);
var _1n7 = BigInt(1);
function negateCt2(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
function normalizeZ2(c, points) {
  const invertedZs = FpInvertBatch2(c.Fp, points.map((p) => p.Z));
  return points.map((p, i2) => c.fromAffine(p.toAffine(invertedZs[i2])));
}
function validateW2(W, bits) {
  if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
    throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
}
function calcWOpts2(W, scalarBits) {
  validateW2(W, scalarBits);
  const windows = Math.ceil(scalarBits / W) + 1;
  const windowSize = 2 ** (W - 1);
  const maxNumber = 2 ** W;
  const mask = bitMask2(W);
  const shiftBy = BigInt(W);
  return { windows, windowSize, mask, maxNumber, shiftBy };
}
function calcOffsets2(n, window2, wOpts) {
  const { windowSize, mask, maxNumber, shiftBy } = wOpts;
  let wbits = Number(n & mask);
  let nextN = n >> shiftBy;
  if (wbits > windowSize) {
    wbits -= maxNumber;
    nextN += _1n7;
  }
  const offsetStart = window2 * windowSize;
  const offset = offsetStart + Math.abs(wbits) - 1;
  const isZero = wbits === 0;
  const isNeg = wbits < 0;
  const isNegF = window2 % 2 !== 0;
  const offsetF = offsetStart;
  return { nextN, offset, isZero, isNeg, isNegF, offsetF };
}
function validateMSMPoints(points, c) {
  if (!Array.isArray(points))
    throw new Error("array expected");
  points.forEach((p, i2) => {
    if (!(p instanceof c))
      throw new Error("invalid point at index " + i2);
  });
}
function validateMSMScalars(scalars, field) {
  if (!Array.isArray(scalars))
    throw new Error("array of scalars expected");
  scalars.forEach((s, i2) => {
    if (!field.isValid(s))
      throw new Error("invalid scalar at index " + i2);
  });
}
var pointPrecomputes2 = /* @__PURE__ */ new WeakMap();
var pointWindowSizes2 = /* @__PURE__ */ new WeakMap();
function getW2(P) {
  return pointWindowSizes2.get(P) || 1;
}
function assert02(n) {
  if (n !== _0n8)
    throw new Error("invalid wNAF");
}
var wNAF2 = class {
  // Parametrized with a given Point class (not individual point)
  constructor(Point, bits) {
    this.BASE = Point.BASE;
    this.ZERO = Point.ZERO;
    this.Fn = Point.Fn;
    this.bits = bits;
  }
  // non-const time multiplication ladder
  _unsafeLadder(elm, n, p = this.ZERO) {
    let d5 = elm;
    while (n > _0n8) {
      if (n & _1n7)
        p = p.add(d5);
      d5 = d5.double();
      n >>= _1n7;
    }
    return p;
  }
  /**
   * Creates a wNAF precomputation window. Used for caching.
   * Default window size is set by `utils.precompute()` and is equal to 8.
   * Number of precomputed points depends on the curve size:
   * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
   * - 𝑊 is the window size
   * - 𝑛 is the bitlength of the curve order.
   * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
   * @param point Point instance
   * @param W window size
   * @returns precomputed point tables flattened to a single array
   */
  precomputeWindow(point, W) {
    const { windows, windowSize } = calcWOpts2(W, this.bits);
    const points = [];
    let p = point;
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
  }
  /**
   * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
   * More compact implementation:
   * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
   * @returns real and fake (for const-time) points
   */
  wNAF(W, precomputes, n) {
    if (!this.Fn.isValid(n))
      throw new Error("invalid scalar");
    let p = this.ZERO;
    let f = this.BASE;
    const wo = calcWOpts2(W, this.bits);
    for (let window2 = 0; window2 < wo.windows; window2++) {
      const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets2(n, window2, wo);
      n = nextN;
      if (isZero) {
        f = f.add(negateCt2(isNegF, precomputes[offsetF]));
      } else {
        p = p.add(negateCt2(isNeg, precomputes[offset]));
      }
    }
    assert02(n);
    return { p, f };
  }
  /**
   * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
   * @param acc accumulator point to add result of multiplication
   * @returns point
   */
  wNAFUnsafe(W, precomputes, n, acc = this.ZERO) {
    const wo = calcWOpts2(W, this.bits);
    for (let window2 = 0; window2 < wo.windows; window2++) {
      if (n === _0n8)
        break;
      const { nextN, offset, isZero, isNeg } = calcOffsets2(n, window2, wo);
      n = nextN;
      if (isZero) {
        continue;
      } else {
        const item = precomputes[offset];
        acc = acc.add(isNeg ? item.negate() : item);
      }
    }
    assert02(n);
    return acc;
  }
  getPrecomputes(W, point, transform) {
    let comp = pointPrecomputes2.get(point);
    if (!comp) {
      comp = this.precomputeWindow(point, W);
      if (W !== 1) {
        if (typeof transform === "function")
          comp = transform(comp);
        pointPrecomputes2.set(point, comp);
      }
    }
    return comp;
  }
  cached(point, scalar, transform) {
    const W = getW2(point);
    return this.wNAF(W, this.getPrecomputes(W, point, transform), scalar);
  }
  unsafe(point, scalar, transform, prev) {
    const W = getW2(point);
    if (W === 1)
      return this._unsafeLadder(point, scalar, prev);
    return this.wNAFUnsafe(W, this.getPrecomputes(W, point, transform), scalar, prev);
  }
  // We calculate precomputes for elliptic curve point multiplication
  // using windowed method. This specifies window size and
  // stores precomputed values. Usually only base point would be precomputed.
  createCache(P, W) {
    validateW2(W, this.bits);
    pointWindowSizes2.set(P, W);
    pointPrecomputes2.delete(P);
  }
  hasCache(elm) {
    return getW2(elm) !== 1;
  }
};
function mulEndoUnsafe2(Point, point, k1, k2) {
  let acc = point;
  let p1 = Point.ZERO;
  let p2 = Point.ZERO;
  while (k1 > _0n8 || k2 > _0n8) {
    if (k1 & _1n7)
      p1 = p1.add(acc);
    if (k2 & _1n7)
      p2 = p2.add(acc);
    acc = acc.double();
    k1 >>= _1n7;
    k2 >>= _1n7;
  }
  return { p1, p2 };
}
function pippenger(c, fieldN, points, scalars) {
  validateMSMPoints(points, c);
  validateMSMScalars(scalars, fieldN);
  const plength = points.length;
  const slength = scalars.length;
  if (plength !== slength)
    throw new Error("arrays of points and scalars must have equal length");
  const zero = c.ZERO;
  const wbits = bitLen2(BigInt(plength));
  let windowSize = 1;
  if (wbits > 12)
    windowSize = wbits - 3;
  else if (wbits > 4)
    windowSize = wbits - 2;
  else if (wbits > 0)
    windowSize = 2;
  const MASK = bitMask2(windowSize);
  const buckets = new Array(Number(MASK) + 1).fill(zero);
  const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
  let sum = zero;
  for (let i2 = lastBits; i2 >= 0; i2 -= windowSize) {
    buckets.fill(zero);
    for (let j = 0; j < slength; j++) {
      const scalar = scalars[j];
      const wbits2 = Number(scalar >> BigInt(i2) & MASK);
      buckets[wbits2] = buckets[wbits2].add(points[j]);
    }
    let resI = zero;
    for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
      sumI = sumI.add(buckets[j]);
      resI = resI.add(sumI);
    }
    sum = sum.add(resI);
    if (i2 !== 0)
      for (let j = 0; j < windowSize; j++)
        sum = sum.double();
  }
  return sum;
}
function createField2(order, field, isLE2) {
  if (field) {
    if (field.ORDER !== order)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    validateField2(field);
    return field;
  } else {
    return Field2(order, { isLE: isLE2 });
  }
}
function _createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
  if (FpFnLE === void 0)
    FpFnLE = type === "edwards";
  if (!CURVE || typeof CURVE !== "object")
    throw new Error(`expected valid ${type} CURVE object`);
  for (const p of ["p", "n", "h"]) {
    const val = CURVE[p];
    if (!(typeof val === "bigint" && val > _0n8))
      throw new Error(`CURVE.${p} must be positive bigint`);
  }
  const Fp = createField2(CURVE.p, curveOpts.Fp, FpFnLE);
  const Fn = createField2(CURVE.n, curveOpts.Fn, FpFnLE);
  const _b = type === "weierstrass" ? "b" : "d";
  const params = ["Gx", "Gy", "a", _b];
  for (const p of params) {
    if (!Fp.isValid(CURVE[p]))
      throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
  }
  CURVE = Object.freeze(Object.assign({}, CURVE));
  return { CURVE, Fp, Fn };
}

// node_modules/@nostr-dev-kit/ndk/node_modules/@noble/curves/esm/abstract/weierstrass.js
var divNearest2 = (num3, den) => (num3 + (num3 >= 0 ? den : -den) / _2n5) / den;
function _splitEndoScalar2(k, basis, n) {
  const [[a1, b1], [a2, b2]] = basis;
  const c1 = divNearest2(b2 * k, n);
  const c2 = divNearest2(-b1 * k, n);
  let k1 = k - c1 * a1 - c2 * a2;
  let k2 = -c1 * b1 - c2 * b2;
  const k1neg = k1 < _0n9;
  const k2neg = k2 < _0n9;
  if (k1neg)
    k1 = -k1;
  if (k2neg)
    k2 = -k2;
  const MAX_NUM = bitMask2(Math.ceil(bitLen2(n) / 2)) + _1n8;
  if (k1 < _0n9 || k1 >= MAX_NUM || k2 < _0n9 || k2 >= MAX_NUM) {
    throw new Error("splitScalar (endomorphism): failed, k=" + k);
  }
  return { k1neg, k1, k2neg, k2 };
}
function validateSigFormat2(format) {
  if (!["compact", "recovered", "der"].includes(format))
    throw new Error('Signature format must be "compact", "recovered", or "der"');
  return format;
}
function validateSigOpts2(opts, def) {
  const optsn = {};
  for (let optName of Object.keys(def)) {
    optsn[optName] = opts[optName] === void 0 ? def[optName] : opts[optName];
  }
  _abool2(optsn.lowS, "lowS");
  _abool2(optsn.prehash, "prehash");
  if (optsn.format !== void 0)
    validateSigFormat2(optsn.format);
  return optsn;
}
var DERErr2 = class extends Error {
  constructor(m = "") {
    super(m);
  }
};
var DER2 = {
  // asn.1 DER encoding utils
  Err: DERErr2,
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (tag2, data) => {
      const { Err: E } = DER2;
      if (tag2 < 0 || tag2 > 256)
        throw new E("tlv.encode: wrong tag");
      if (data.length & 1)
        throw new E("tlv.encode: unpadded data");
      const dataLen = data.length / 2;
      const len = numberToHexUnpadded2(dataLen);
      if (len.length / 2 & 128)
        throw new E("tlv.encode: long form length too big");
      const lenLen = dataLen > 127 ? numberToHexUnpadded2(len.length / 2 | 128) : "";
      const t = numberToHexUnpadded2(tag2);
      return t + lenLen + len + data;
    },
    // v - value, l - left bytes (unparsed)
    decode(tag2, data) {
      const { Err: E } = DER2;
      let pos = 0;
      if (tag2 < 0 || tag2 > 256)
        throw new E("tlv.encode: wrong tag");
      if (data.length < 2 || data[pos++] !== tag2)
        throw new E("tlv.decode: wrong tlv");
      const first = data[pos++];
      const isLong = !!(first & 128);
      let length = 0;
      if (!isLong)
        length = first;
      else {
        const lenLen = first & 127;
        if (!lenLen)
          throw new E("tlv.decode(long): indefinite length not supported");
        if (lenLen > 4)
          throw new E("tlv.decode(long): byte length is too big");
        const lengthBytes = data.subarray(pos, pos + lenLen);
        if (lengthBytes.length !== lenLen)
          throw new E("tlv.decode: length bytes not complete");
        if (lengthBytes[0] === 0)
          throw new E("tlv.decode(long): zero leftmost byte");
        for (const b of lengthBytes)
          length = length << 8 | b;
        pos += lenLen;
        if (length < 128)
          throw new E("tlv.decode(long): not minimal encoding");
      }
      const v = data.subarray(pos, pos + length);
      if (v.length !== length)
        throw new E("tlv.decode: wrong value length");
      return { v, l: data.subarray(pos + length) };
    }
  },
  // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
  // since we always use positive integers here. It must always be empty:
  // - add zero byte if exists
  // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
  _int: {
    encode(num3) {
      const { Err: E } = DER2;
      if (num3 < _0n9)
        throw new E("integer: negative integers are not allowed");
      let hex = numberToHexUnpadded2(num3);
      if (Number.parseInt(hex[0], 16) & 8)
        hex = "00" + hex;
      if (hex.length & 1)
        throw new E("unexpected DER parsing assertion: unpadded hex");
      return hex;
    },
    decode(data) {
      const { Err: E } = DER2;
      if (data[0] & 128)
        throw new E("invalid signature integer: negative");
      if (data[0] === 0 && !(data[1] & 128))
        throw new E("invalid signature integer: unnecessary leading zero");
      return bytesToNumberBE2(data);
    }
  },
  toSig(hex) {
    const { Err: E, _int: int, _tlv: tlv } = DER2;
    const data = ensureBytes("signature", hex);
    const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
    if (seqLeftBytes.length)
      throw new E("invalid signature: left bytes after parsing");
    const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
    const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
    if (sLeftBytes.length)
      throw new E("invalid signature: left bytes after parsing");
    return { r: int.decode(rBytes), s: int.decode(sBytes) };
  },
  hexFromSig(sig) {
    const { _tlv: tlv, _int: int } = DER2;
    const rs = tlv.encode(2, int.encode(sig.r));
    const ss = tlv.encode(2, int.encode(sig.s));
    const seq = rs + ss;
    return tlv.encode(48, seq);
  }
};
var _0n9 = BigInt(0);
var _1n8 = BigInt(1);
var _2n5 = BigInt(2);
var _3n4 = BigInt(3);
var _4n4 = BigInt(4);
function _normFnElement(Fn, key) {
  const { BYTES: expected } = Fn;
  let num3;
  if (typeof key === "bigint") {
    num3 = key;
  } else {
    let bytes = ensureBytes("private key", key);
    try {
      num3 = Fn.fromBytes(bytes);
    } catch (error) {
      throw new Error(`invalid private key: expected ui8a of size ${expected}, got ${typeof key}`);
    }
  }
  if (!Fn.isValidNot0(num3))
    throw new Error("invalid private key: out of range [1..N-1]");
  return num3;
}
function weierstrassN(params, extraOpts = {}) {
  const validated = _createCurveFields("weierstrass", params, extraOpts);
  const { Fp, Fn } = validated;
  let CURVE = validated.CURVE;
  const { h: cofactor, n: CURVE_ORDER } = CURVE;
  _validateObject(extraOpts, {}, {
    allowInfinityPoint: "boolean",
    clearCofactor: "function",
    isTorsionFree: "function",
    fromBytes: "function",
    toBytes: "function",
    endo: "object",
    wrapPrivateKey: "boolean"
  });
  const { endo } = extraOpts;
  if (endo) {
    if (!Fp.is0(CURVE.a) || typeof endo.beta !== "bigint" || !Array.isArray(endo.basises)) {
      throw new Error('invalid endo: expected "beta": bigint and "basises": array');
    }
  }
  const lengths = getWLengths2(Fp, Fn);
  function assertCompressionIsSupported() {
    if (!Fp.isOdd)
      throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  function pointToBytes3(_c, point, isCompressed) {
    const { x, y } = point.toAffine();
    const bx = Fp.toBytes(x);
    _abool2(isCompressed, "isCompressed");
    if (isCompressed) {
      assertCompressionIsSupported();
      const hasEvenY = !Fp.isOdd(y);
      return concatBytes4(pprefix2(hasEvenY), bx);
    } else {
      return concatBytes4(Uint8Array.of(4), bx, Fp.toBytes(y));
    }
  }
  function pointFromBytes(bytes) {
    _abytes2(bytes, void 0, "Point");
    const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
    const length = bytes.length;
    const head = bytes[0];
    const tail = bytes.subarray(1);
    if (length === comp && (head === 2 || head === 3)) {
      const x = Fp.fromBytes(tail);
      if (!Fp.isValid(x))
        throw new Error("bad point: is not on curve, wrong x");
      const y2 = weierstrassEquation(x);
      let y;
      try {
        y = Fp.sqrt(y2);
      } catch (sqrtError) {
        const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
        throw new Error("bad point: is not on curve, sqrt error" + err);
      }
      assertCompressionIsSupported();
      const isYOdd = Fp.isOdd(y);
      const isHeadOdd = (head & 1) === 1;
      if (isHeadOdd !== isYOdd)
        y = Fp.neg(y);
      return { x, y };
    } else if (length === uncomp && head === 4) {
      const L = Fp.BYTES;
      const x = Fp.fromBytes(tail.subarray(0, L));
      const y = Fp.fromBytes(tail.subarray(L, L * 2));
      if (!isValidXY(x, y))
        throw new Error("bad point: is not on curve");
      return { x, y };
    } else {
      throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
    }
  }
  const encodePoint = extraOpts.toBytes || pointToBytes3;
  const decodePoint = extraOpts.fromBytes || pointFromBytes;
  function weierstrassEquation(x) {
    const x2 = Fp.sqr(x);
    const x3 = Fp.mul(x2, x);
    return Fp.add(Fp.add(x3, Fp.mul(x, CURVE.a)), CURVE.b);
  }
  function isValidXY(x, y) {
    const left = Fp.sqr(y);
    const right = weierstrassEquation(x);
    return Fp.eql(left, right);
  }
  if (!isValidXY(CURVE.Gx, CURVE.Gy))
    throw new Error("bad curve params: generator point");
  const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n4), _4n4);
  const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
  if (Fp.is0(Fp.add(_4a3, _27b2)))
    throw new Error("bad curve params: a or b");
  function acoord(title, n, banZero = false) {
    if (!Fp.isValid(n) || banZero && Fp.is0(n))
      throw new Error(`bad point coordinate ${title}`);
    return n;
  }
  function aprjpoint(other) {
    if (!(other instanceof Point))
      throw new Error("ProjectivePoint expected");
  }
  function splitEndoScalarN(k) {
    if (!endo || !endo.basises)
      throw new Error("no endo");
    return _splitEndoScalar2(k, endo.basises, Fn.ORDER);
  }
  const toAffineMemo = memoized2((p, iz) => {
    const { X, Y, Z } = p;
    if (Fp.eql(Z, Fp.ONE))
      return { x: X, y: Y };
    const is0 = p.is0();
    if (iz == null)
      iz = is0 ? Fp.ONE : Fp.inv(Z);
    const x = Fp.mul(X, iz);
    const y = Fp.mul(Y, iz);
    const zz = Fp.mul(Z, iz);
    if (is0)
      return { x: Fp.ZERO, y: Fp.ZERO };
    if (!Fp.eql(zz, Fp.ONE))
      throw new Error("invZ was invalid");
    return { x, y };
  });
  const assertValidMemo = memoized2((p) => {
    if (p.is0()) {
      if (extraOpts.allowInfinityPoint && !Fp.is0(p.Y))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x, y } = p.toAffine();
    if (!Fp.isValid(x) || !Fp.isValid(y))
      throw new Error("bad point: x or y not field elements");
    if (!isValidXY(x, y))
      throw new Error("bad point: equation left != right");
    if (!p.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return true;
  });
  function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
    k2p = new Point(Fp.mul(k2p.X, endoBeta), k2p.Y, k2p.Z);
    k1p = negateCt2(k1neg, k1p);
    k2p = negateCt2(k2neg, k2p);
    return k1p.add(k2p);
  }
  class Point {
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    constructor(X, Y, Z) {
      this.X = acoord("x", X);
      this.Y = acoord("y", Y, true);
      this.Z = acoord("z", Z);
      Object.freeze(this);
    }
    static CURVE() {
      return CURVE;
    }
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("invalid affine point");
      if (p instanceof Point)
        throw new Error("projective point not allowed");
      if (Fp.is0(x) && Fp.is0(y))
        return Point.ZERO;
      return new Point(x, y, Fp.ONE);
    }
    static fromBytes(bytes) {
      const P = Point.fromAffine(decodePoint(_abytes2(bytes, void 0, "point")));
      P.assertValidity();
      return P;
    }
    static fromHex(hex) {
      return Point.fromBytes(ensureBytes("pointHex", hex));
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     *
     * @param windowSize
     * @param isLazy true will defer table computation until the first multiplication
     * @returns
     */
    precompute(windowSize = 8, isLazy = true) {
      wnaf.createCache(this, windowSize);
      if (!isLazy)
        this.multiply(_3n4);
      return this;
    }
    // TODO: return `this`
    /** A point on curve is valid if it conforms to equation. */
    assertValidity() {
      assertValidMemo(this);
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (!Fp.isOdd)
        throw new Error("Field doesn't support isOdd");
      return !Fp.isOdd(y);
    }
    /** Compare one point to another. */
    equals(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
      const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
      return U1 && U2;
    }
    /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
    negate() {
      return new Point(this.X, Fp.neg(this.Y), this.Z);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a, b } = CURVE;
      const b3 = Fp.mul(b, _3n4);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      let t0 = Fp.mul(X1, X1);
      let t1 = Fp.mul(Y1, Y1);
      let t2 = Fp.mul(Z1, Z1);
      let t3 = Fp.mul(X1, Y1);
      t3 = Fp.add(t3, t3);
      Z3 = Fp.mul(X1, Z1);
      Z3 = Fp.add(Z3, Z3);
      X3 = Fp.mul(a, Z3);
      Y3 = Fp.mul(b3, t2);
      Y3 = Fp.add(X3, Y3);
      X3 = Fp.sub(t1, Y3);
      Y3 = Fp.add(t1, Y3);
      Y3 = Fp.mul(X3, Y3);
      X3 = Fp.mul(t3, X3);
      Z3 = Fp.mul(b3, Z3);
      t2 = Fp.mul(a, t2);
      t3 = Fp.sub(t0, t2);
      t3 = Fp.mul(a, t3);
      t3 = Fp.add(t3, Z3);
      Z3 = Fp.add(t0, t0);
      t0 = Fp.add(Z3, t0);
      t0 = Fp.add(t0, t2);
      t0 = Fp.mul(t0, t3);
      Y3 = Fp.add(Y3, t0);
      t2 = Fp.mul(Y1, Z1);
      t2 = Fp.add(t2, t2);
      t0 = Fp.mul(t2, t3);
      X3 = Fp.sub(X3, t0);
      Z3 = Fp.mul(t2, t1);
      Z3 = Fp.add(Z3, Z3);
      Z3 = Fp.add(Z3, Z3);
      return new Point(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      const a = CURVE.a;
      const b3 = Fp.mul(CURVE.b, _3n4);
      let t0 = Fp.mul(X1, X2);
      let t1 = Fp.mul(Y1, Y2);
      let t2 = Fp.mul(Z1, Z2);
      let t3 = Fp.add(X1, Y1);
      let t4 = Fp.add(X2, Y2);
      t3 = Fp.mul(t3, t4);
      t4 = Fp.add(t0, t1);
      t3 = Fp.sub(t3, t4);
      t4 = Fp.add(X1, Z1);
      let t5 = Fp.add(X2, Z2);
      t4 = Fp.mul(t4, t5);
      t5 = Fp.add(t0, t2);
      t4 = Fp.sub(t4, t5);
      t5 = Fp.add(Y1, Z1);
      X3 = Fp.add(Y2, Z2);
      t5 = Fp.mul(t5, X3);
      X3 = Fp.add(t1, t2);
      t5 = Fp.sub(t5, X3);
      Z3 = Fp.mul(a, t4);
      X3 = Fp.mul(b3, t2);
      Z3 = Fp.add(X3, Z3);
      X3 = Fp.sub(t1, Z3);
      Z3 = Fp.add(t1, Z3);
      Y3 = Fp.mul(X3, Z3);
      t1 = Fp.add(t0, t0);
      t1 = Fp.add(t1, t0);
      t2 = Fp.mul(a, t2);
      t4 = Fp.mul(b3, t4);
      t1 = Fp.add(t1, t2);
      t2 = Fp.sub(t0, t2);
      t2 = Fp.mul(a, t2);
      t4 = Fp.add(t4, t2);
      t0 = Fp.mul(t1, t4);
      Y3 = Fp.add(Y3, t0);
      t0 = Fp.mul(t5, t4);
      X3 = Fp.mul(t3, X3);
      X3 = Fp.sub(X3, t0);
      t0 = Fp.mul(t3, t1);
      Z3 = Fp.mul(t5, Z3);
      Z3 = Fp.add(Z3, t0);
      return new Point(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point.ZERO);
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
      const { endo: endo2 } = extraOpts;
      if (!Fn.isValidNot0(scalar))
        throw new Error("invalid scalar: out of range");
      let point, fake;
      const mul3 = (n) => wnaf.cached(this, n, (p) => normalizeZ2(Point, p));
      if (endo2) {
        const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(scalar);
        const { p: k1p, f: k1f } = mul3(k1);
        const { p: k2p, f: k2f } = mul3(k2);
        fake = k1f.add(k2f);
        point = finishEndo(endo2.beta, k1p, k2p, k1neg, k2neg);
      } else {
        const { p, f } = mul3(scalar);
        point = p;
        fake = f;
      }
      return normalizeZ2(Point, [point, fake])[0];
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed secret key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(sc) {
      const { endo: endo2 } = extraOpts;
      const p = this;
      if (!Fn.isValid(sc))
        throw new Error("invalid scalar: out of range");
      if (sc === _0n9 || p.is0())
        return Point.ZERO;
      if (sc === _1n8)
        return p;
      if (wnaf.hasCache(this))
        return this.multiply(sc);
      if (endo2) {
        const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(sc);
        const { p1, p2 } = mulEndoUnsafe2(Point, p, k1, k2);
        return finishEndo(endo2.beta, p1, p2, k1neg, k2neg);
      } else {
        return wnaf.unsafe(p, sc);
      }
    }
    multiplyAndAddUnsafe(Q, a, b) {
      const sum = this.multiplyUnsafe(a).add(Q.multiplyUnsafe(b));
      return sum.is0() ? void 0 : sum;
    }
    /**
     * Converts Projective point to affine (x, y) coordinates.
     * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
     */
    toAffine(invertedZ) {
      return toAffineMemo(this, invertedZ);
    }
    /**
     * Checks whether Point is free of torsion elements (is in prime subgroup).
     * Always torsion-free for cofactor=1 curves.
     */
    isTorsionFree() {
      const { isTorsionFree } = extraOpts;
      if (cofactor === _1n8)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point, this);
      return wnaf.unsafe(this, CURVE_ORDER).is0();
    }
    clearCofactor() {
      const { clearCofactor } = extraOpts;
      if (cofactor === _1n8)
        return this;
      if (clearCofactor)
        return clearCofactor(Point, this);
      return this.multiplyUnsafe(cofactor);
    }
    isSmallOrder() {
      return this.multiplyUnsafe(cofactor).is0();
    }
    toBytes(isCompressed = true) {
      _abool2(isCompressed, "isCompressed");
      this.assertValidity();
      return encodePoint(Point, this, isCompressed);
    }
    toHex(isCompressed = true) {
      return bytesToHex4(this.toBytes(isCompressed));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
    // TODO: remove
    get px() {
      return this.X;
    }
    get py() {
      return this.X;
    }
    get pz() {
      return this.Z;
    }
    toRawBytes(isCompressed = true) {
      return this.toBytes(isCompressed);
    }
    _setWindowSize(windowSize) {
      this.precompute(windowSize);
    }
    static normalizeZ(points) {
      return normalizeZ2(Point, points);
    }
    static msm(points, scalars) {
      return pippenger(Point, Fn, points, scalars);
    }
    static fromPrivateKey(privateKey) {
      return Point.BASE.multiply(_normFnElement(Fn, privateKey));
    }
  }
  Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
  Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
  Point.Fp = Fp;
  Point.Fn = Fn;
  const bits = Fn.BITS;
  const wnaf = new wNAF2(Point, extraOpts.endo ? Math.ceil(bits / 2) : bits);
  Point.BASE.precompute(8);
  return Point;
}
function pprefix2(hasEvenY) {
  return Uint8Array.of(hasEvenY ? 2 : 3);
}
function getWLengths2(Fp, Fn) {
  return {
    secretKey: Fn.BYTES,
    publicKey: 1 + Fp.BYTES,
    publicKeyUncompressed: 1 + 2 * Fp.BYTES,
    publicKeyHasPrefix: true,
    signature: 2 * Fn.BYTES
  };
}
function ecdh2(Point, ecdhOpts = {}) {
  const { Fn } = Point;
  const randomBytes_ = ecdhOpts.randomBytes || randomBytes4;
  const lengths = Object.assign(getWLengths2(Point.Fp, Fn), { seed: getMinHashLength2(Fn.ORDER) });
  function isValidSecretKey(secretKey) {
    try {
      return !!_normFnElement(Fn, secretKey);
    } catch (error) {
      return false;
    }
  }
  function isValidPublicKey(publicKey, isCompressed) {
    const { publicKey: comp, publicKeyUncompressed } = lengths;
    try {
      const l = publicKey.length;
      if (isCompressed === true && l !== comp)
        return false;
      if (isCompressed === false && l !== publicKeyUncompressed)
        return false;
      return !!Point.fromBytes(publicKey);
    } catch (error) {
      return false;
    }
  }
  function randomSecretKey(seed = randomBytes_(lengths.seed)) {
    return mapHashToField2(_abytes2(seed, lengths.seed, "seed"), Fn.ORDER);
  }
  function getPublicKey2(secretKey, isCompressed = true) {
    return Point.BASE.multiply(_normFnElement(Fn, secretKey)).toBytes(isCompressed);
  }
  function keygen(seed) {
    const secretKey = randomSecretKey(seed);
    return { secretKey, publicKey: getPublicKey2(secretKey) };
  }
  function isProbPub(item) {
    if (typeof item === "bigint")
      return false;
    if (item instanceof Point)
      return true;
    const { secretKey, publicKey, publicKeyUncompressed } = lengths;
    if (Fn.allowedLengths || secretKey === publicKey)
      return void 0;
    const l = ensureBytes("key", item).length;
    return l === publicKey || l === publicKeyUncompressed;
  }
  function getSharedSecret(secretKeyA, publicKeyB, isCompressed = true) {
    if (isProbPub(secretKeyA) === true)
      throw new Error("first arg must be private key");
    if (isProbPub(publicKeyB) === false)
      throw new Error("second arg must be public key");
    const s = _normFnElement(Fn, secretKeyA);
    const b = Point.fromHex(publicKeyB);
    return b.multiply(s).toBytes(isCompressed);
  }
  const utils = {
    isValidSecretKey,
    isValidPublicKey,
    randomSecretKey,
    // TODO: remove
    isValidPrivateKey: isValidSecretKey,
    randomPrivateKey: randomSecretKey,
    normPrivateKeyToScalar: (key) => _normFnElement(Fn, key),
    precompute(windowSize = 8, point = Point.BASE) {
      return point.precompute(windowSize, false);
    }
  };
  return Object.freeze({ getPublicKey: getPublicKey2, getSharedSecret, keygen, Point, utils, lengths });
}
function ecdsa2(Point, hash, ecdsaOpts = {}) {
  ahash3(hash);
  _validateObject(ecdsaOpts, {}, {
    hmac: "function",
    lowS: "boolean",
    randomBytes: "function",
    bits2int: "function",
    bits2int_modN: "function"
  });
  const randomBytes5 = ecdsaOpts.randomBytes || randomBytes4;
  const hmac4 = ecdsaOpts.hmac || ((key, ...msgs) => hmac3(hash, key, concatBytes4(...msgs)));
  const { Fp, Fn } = Point;
  const { ORDER: CURVE_ORDER, BITS: fnBits } = Fn;
  const { keygen, getPublicKey: getPublicKey2, getSharedSecret, utils, lengths } = ecdh2(Point, ecdsaOpts);
  const defaultSigOpts = {
    prehash: false,
    lowS: typeof ecdsaOpts.lowS === "boolean" ? ecdsaOpts.lowS : false,
    format: void 0,
    //'compact' as ECDSASigFormat,
    extraEntropy: false
  };
  const defaultSigOpts_format = "compact";
  function isBiggerThanHalfOrder(number) {
    const HALF = CURVE_ORDER >> _1n8;
    return number > HALF;
  }
  function validateRS(title, num3) {
    if (!Fn.isValidNot0(num3))
      throw new Error(`invalid signature ${title}: out of range 1..Point.Fn.ORDER`);
    return num3;
  }
  function validateSigLength(bytes, format) {
    validateSigFormat2(format);
    const size = lengths.signature;
    const sizer = format === "compact" ? size : format === "recovered" ? size + 1 : void 0;
    return _abytes2(bytes, sizer, `${format} signature`);
  }
  class Signature {
    constructor(r, s, recovery) {
      this.r = validateRS("r", r);
      this.s = validateRS("s", s);
      if (recovery != null)
        this.recovery = recovery;
      Object.freeze(this);
    }
    static fromBytes(bytes, format = defaultSigOpts_format) {
      validateSigLength(bytes, format);
      let recid;
      if (format === "der") {
        const { r: r2, s: s2 } = DER2.toSig(_abytes2(bytes));
        return new Signature(r2, s2);
      }
      if (format === "recovered") {
        recid = bytes[0];
        format = "compact";
        bytes = bytes.subarray(1);
      }
      const L = Fn.BYTES;
      const r = bytes.subarray(0, L);
      const s = bytes.subarray(L, L * 2);
      return new Signature(Fn.fromBytes(r), Fn.fromBytes(s), recid);
    }
    static fromHex(hex, format) {
      return this.fromBytes(hexToBytes3(hex), format);
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    recoverPublicKey(messageHash) {
      const FIELD_ORDER = Fp.ORDER;
      const { r, s, recovery: rec } = this;
      if (rec == null || ![0, 1, 2, 3].includes(rec))
        throw new Error("recovery id invalid");
      const hasCofactor = CURVE_ORDER * _2n5 < FIELD_ORDER;
      if (hasCofactor && rec > 1)
        throw new Error("recovery id is ambiguous for h>1 curve");
      const radj = rec === 2 || rec === 3 ? r + CURVE_ORDER : r;
      if (!Fp.isValid(radj))
        throw new Error("recovery id 2 or 3 invalid");
      const x = Fp.toBytes(radj);
      const R = Point.fromBytes(concatBytes4(pprefix2((rec & 1) === 0), x));
      const ir = Fn.inv(radj);
      const h = bits2int_modN(ensureBytes("msgHash", messageHash));
      const u1 = Fn.create(-h * ir);
      const u2 = Fn.create(s * ir);
      const Q = Point.BASE.multiplyUnsafe(u1).add(R.multiplyUnsafe(u2));
      if (Q.is0())
        throw new Error("point at infinify");
      Q.assertValidity();
      return Q;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    toBytes(format = defaultSigOpts_format) {
      validateSigFormat2(format);
      if (format === "der")
        return hexToBytes3(DER2.hexFromSig(this));
      const r = Fn.toBytes(this.r);
      const s = Fn.toBytes(this.s);
      if (format === "recovered") {
        if (this.recovery == null)
          throw new Error("recovery bit must be present");
        return concatBytes4(Uint8Array.of(this.recovery), r, s);
      }
      return concatBytes4(r, s);
    }
    toHex(format) {
      return bytesToHex4(this.toBytes(format));
    }
    // TODO: remove
    assertValidity() {
    }
    static fromCompact(hex) {
      return Signature.fromBytes(ensureBytes("sig", hex), "compact");
    }
    static fromDER(hex) {
      return Signature.fromBytes(ensureBytes("sig", hex), "der");
    }
    normalizeS() {
      return this.hasHighS() ? new Signature(this.r, Fn.neg(this.s), this.recovery) : this;
    }
    toDERRawBytes() {
      return this.toBytes("der");
    }
    toDERHex() {
      return bytesToHex4(this.toBytes("der"));
    }
    toCompactRawBytes() {
      return this.toBytes("compact");
    }
    toCompactHex() {
      return bytesToHex4(this.toBytes("compact"));
    }
  }
  const bits2int = ecdsaOpts.bits2int || function bits2int_def(bytes) {
    if (bytes.length > 8192)
      throw new Error("input is too large");
    const num3 = bytesToNumberBE2(bytes);
    const delta = bytes.length * 8 - fnBits;
    return delta > 0 ? num3 >> BigInt(delta) : num3;
  };
  const bits2int_modN = ecdsaOpts.bits2int_modN || function bits2int_modN_def(bytes) {
    return Fn.create(bits2int(bytes));
  };
  const ORDER_MASK = bitMask2(fnBits);
  function int2octets(num3) {
    aInRange2("num < 2^" + fnBits, num3, _0n9, ORDER_MASK);
    return Fn.toBytes(num3);
  }
  function validateMsgAndHash(message, prehash) {
    _abytes2(message, void 0, "message");
    return prehash ? _abytes2(hash(message), void 0, "prehashed message") : message;
  }
  function prepSig(message, privateKey, opts) {
    if (["recovered", "canonical"].some((k) => k in opts))
      throw new Error("sign() legacy options not supported");
    const { lowS, prehash, extraEntropy } = validateSigOpts2(opts, defaultSigOpts);
    message = validateMsgAndHash(message, prehash);
    const h1int = bits2int_modN(message);
    const d5 = _normFnElement(Fn, privateKey);
    const seedArgs = [int2octets(d5), int2octets(h1int)];
    if (extraEntropy != null && extraEntropy !== false) {
      const e = extraEntropy === true ? randomBytes5(lengths.secretKey) : extraEntropy;
      seedArgs.push(ensureBytes("extraEntropy", e));
    }
    const seed = concatBytes4(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!Fn.isValidNot0(k))
        return;
      const ik = Fn.inv(k);
      const q = Point.BASE.multiply(k).toAffine();
      const r = Fn.create(q.x);
      if (r === _0n9)
        return;
      const s = Fn.create(ik * Fn.create(m + r * d5));
      if (s === _0n9)
        return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n8);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = Fn.neg(s);
        recovery ^= 1;
      }
      return new Signature(r, normS, recovery);
    }
    return { seed, k2sig };
  }
  function sign(message, secretKey, opts = {}) {
    message = ensureBytes("message", message);
    const { seed, k2sig } = prepSig(message, secretKey, opts);
    const drbg = createHmacDrbg2(hash.outputLen, Fn.BYTES, hmac4);
    const sig = drbg(seed, k2sig);
    return sig;
  }
  function tryParsingSig(sg) {
    let sig = void 0;
    const isHex = typeof sg === "string" || isBytes5(sg);
    const isObj = !isHex && sg !== null && typeof sg === "object" && typeof sg.r === "bigint" && typeof sg.s === "bigint";
    if (!isHex && !isObj)
      throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
    if (isObj) {
      sig = new Signature(sg.r, sg.s);
    } else if (isHex) {
      try {
        sig = Signature.fromBytes(ensureBytes("sig", sg), "der");
      } catch (derError) {
        if (!(derError instanceof DER2.Err))
          throw derError;
      }
      if (!sig) {
        try {
          sig = Signature.fromBytes(ensureBytes("sig", sg), "compact");
        } catch (error) {
          return false;
        }
      }
    }
    if (!sig)
      return false;
    return sig;
  }
  function verify(signature, message, publicKey, opts = {}) {
    const { lowS, prehash, format } = validateSigOpts2(opts, defaultSigOpts);
    publicKey = ensureBytes("publicKey", publicKey);
    message = validateMsgAndHash(ensureBytes("message", message), prehash);
    if ("strict" in opts)
      throw new Error("options.strict was renamed to lowS");
    const sig = format === void 0 ? tryParsingSig(signature) : Signature.fromBytes(ensureBytes("sig", signature), format);
    if (sig === false)
      return false;
    try {
      const P = Point.fromBytes(publicKey);
      if (lowS && sig.hasHighS())
        return false;
      const { r, s } = sig;
      const h = bits2int_modN(message);
      const is = Fn.inv(s);
      const u1 = Fn.create(h * is);
      const u2 = Fn.create(r * is);
      const R = Point.BASE.multiplyUnsafe(u1).add(P.multiplyUnsafe(u2));
      if (R.is0())
        return false;
      const v = Fn.create(R.x);
      return v === r;
    } catch (e) {
      return false;
    }
  }
  function recoverPublicKey(signature, message, opts = {}) {
    const { prehash } = validateSigOpts2(opts, defaultSigOpts);
    message = validateMsgAndHash(message, prehash);
    return Signature.fromBytes(signature, "recovered").recoverPublicKey(message).toBytes();
  }
  return Object.freeze({
    keygen,
    getPublicKey: getPublicKey2,
    getSharedSecret,
    utils,
    lengths,
    Point,
    sign,
    verify,
    recoverPublicKey,
    Signature,
    hash
  });
}
function _weierstrass_legacy_opts_to_new(c) {
  const CURVE = {
    a: c.a,
    b: c.b,
    p: c.Fp.ORDER,
    n: c.n,
    h: c.h,
    Gx: c.Gx,
    Gy: c.Gy
  };
  const Fp = c.Fp;
  let allowedLengths = c.allowedPrivateKeyLengths ? Array.from(new Set(c.allowedPrivateKeyLengths.map((l) => Math.ceil(l / 2)))) : void 0;
  const Fn = Field2(CURVE.n, {
    BITS: c.nBitLength,
    allowedLengths,
    modFromBytes: c.wrapPrivateKey
  });
  const curveOpts = {
    Fp,
    Fn,
    allowInfinityPoint: c.allowInfinityPoint,
    endo: c.endo,
    isTorsionFree: c.isTorsionFree,
    clearCofactor: c.clearCofactor,
    fromBytes: c.fromBytes,
    toBytes: c.toBytes
  };
  return { CURVE, curveOpts };
}
function _ecdsa_legacy_opts_to_new(c) {
  const { CURVE, curveOpts } = _weierstrass_legacy_opts_to_new(c);
  const ecdsaOpts = {
    hmac: c.hmac,
    randomBytes: c.randomBytes,
    lowS: c.lowS,
    bits2int: c.bits2int,
    bits2int_modN: c.bits2int_modN
  };
  return { CURVE, curveOpts, hash: c.hash, ecdsaOpts };
}
function _ecdsa_new_output_to_legacy(c, _ecdsa) {
  const Point = _ecdsa.Point;
  return Object.assign({}, _ecdsa, {
    ProjectivePoint: Point,
    CURVE: Object.assign({}, c, nLength2(Point.Fn.ORDER, Point.Fn.BITS))
  });
}
function weierstrass2(c) {
  const { CURVE, curveOpts, hash, ecdsaOpts } = _ecdsa_legacy_opts_to_new(c);
  const Point = weierstrassN(CURVE, curveOpts);
  const signs = ecdsa2(Point, hash, ecdsaOpts);
  return _ecdsa_new_output_to_legacy(c, signs);
}

// node_modules/@nostr-dev-kit/ndk/node_modules/@noble/curves/esm/_shortw_utils.js
function createCurve(curveDef, defHash) {
  const create = (hash) => weierstrass2({ ...curveDef, hash });
  return { ...create(defHash), create };
}

// node_modules/@nostr-dev-kit/ndk/node_modules/@noble/curves/esm/secp256k1.js
var secp256k1_CURVE2 = {
  p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: BigInt(1),
  a: BigInt(0),
  b: BigInt(7),
  Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
  Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
};
var secp256k1_ENDO2 = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  basises: [
    [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
    [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
  ]
};
var _0n10 = /* @__PURE__ */ BigInt(0);
var _1n9 = /* @__PURE__ */ BigInt(1);
var _2n6 = /* @__PURE__ */ BigInt(2);
function sqrtMod2(y) {
  const P = secp256k1_CURVE2.p;
  const _3n5 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y * y * y % P;
  const b3 = b2 * b2 * y % P;
  const b6 = pow22(b3, _3n5, P) * b3 % P;
  const b9 = pow22(b6, _3n5, P) * b3 % P;
  const b11 = pow22(b9, _2n6, P) * b2 % P;
  const b22 = pow22(b11, _11n, P) * b11 % P;
  const b44 = pow22(b22, _22n, P) * b22 % P;
  const b88 = pow22(b44, _44n, P) * b44 % P;
  const b176 = pow22(b88, _88n, P) * b88 % P;
  const b220 = pow22(b176, _44n, P) * b44 % P;
  const b223 = pow22(b220, _3n5, P) * b3 % P;
  const t1 = pow22(b223, _23n, P) * b22 % P;
  const t2 = pow22(t1, _6n, P) * b2 % P;
  const root = pow22(t2, _2n6, P);
  if (!Fpk12.eql(Fpk12.sqr(root), y))
    throw new Error("Cannot find square root");
  return root;
}
var Fpk12 = Field2(secp256k1_CURVE2.p, { sqrt: sqrtMod2 });
var secp256k12 = createCurve({ ...secp256k1_CURVE2, Fp: Fpk12, lowS: true, endo: secp256k1_ENDO2 }, sha2563);
var TAGGED_HASH_PREFIXES2 = {};
function taggedHash2(tag2, ...messages) {
  let tagP = TAGGED_HASH_PREFIXES2[tag2];
  if (tagP === void 0) {
    const tagH = sha2563(utf8ToBytes(tag2));
    tagP = concatBytes4(tagH, tagH);
    TAGGED_HASH_PREFIXES2[tag2] = tagP;
  }
  return sha2563(concatBytes4(tagP, ...messages));
}
var pointToBytes2 = (point) => point.toBytes(true).slice(1);
var Pointk12 = /* @__PURE__ */ (() => secp256k12.Point)();
var hasEven2 = (y) => y % _2n6 === _0n10;
function schnorrGetExtPubKey2(priv) {
  const { Fn, BASE } = Pointk12;
  const d_ = _normFnElement(Fn, priv);
  const p = BASE.multiply(d_);
  const scalar = hasEven2(p.y) ? d_ : Fn.neg(d_);
  return { scalar, bytes: pointToBytes2(p) };
}
function lift_x2(x) {
  const Fp = Fpk12;
  if (!Fp.isValidNot0(x))
    throw new Error("invalid x: Fail if x \u2265 p");
  const xx = Fp.create(x * x);
  const c = Fp.create(xx * x + BigInt(7));
  let y = Fp.sqrt(c);
  if (!hasEven2(y))
    y = Fp.neg(y);
  const p = Pointk12.fromAffine({ x, y });
  p.assertValidity();
  return p;
}
var num2 = bytesToNumberBE2;
function challenge2(...args) {
  return Pointk12.Fn.create(num2(taggedHash2("BIP0340/challenge", ...args)));
}
function schnorrGetPublicKey2(secretKey) {
  return schnorrGetExtPubKey2(secretKey).bytes;
}
function schnorrSign2(message, secretKey, auxRand = randomBytes4(32)) {
  const { Fn } = Pointk12;
  const m = ensureBytes("message", message);
  const { bytes: px, scalar: d5 } = schnorrGetExtPubKey2(secretKey);
  const a = ensureBytes("auxRand", auxRand, 32);
  const t = Fn.toBytes(d5 ^ num2(taggedHash2("BIP0340/aux", a)));
  const rand = taggedHash2("BIP0340/nonce", t, px, m);
  const { bytes: rx, scalar: k } = schnorrGetExtPubKey2(rand);
  const e = challenge2(rx, px, m);
  const sig = new Uint8Array(64);
  sig.set(rx, 0);
  sig.set(Fn.toBytes(Fn.create(k + e * d5)), 32);
  if (!schnorrVerify2(sig, m, px))
    throw new Error("sign: Invalid signature produced");
  return sig;
}
function schnorrVerify2(signature, message, publicKey) {
  const { Fn, BASE } = Pointk12;
  const sig = ensureBytes("signature", signature, 64);
  const m = ensureBytes("message", message);
  const pub = ensureBytes("publicKey", publicKey, 32);
  try {
    const P = lift_x2(num2(pub));
    const r = num2(sig.subarray(0, 32));
    if (!inRange2(r, _1n9, secp256k1_CURVE2.p))
      return false;
    const s = num2(sig.subarray(32, 64));
    if (!inRange2(s, _1n9, secp256k1_CURVE2.n))
      return false;
    const e = challenge2(Fn.toBytes(r), pointToBytes2(P), m);
    const R = BASE.multiplyUnsafe(s).add(P.multiplyUnsafe(Fn.neg(e)));
    const { x, y } = R.toAffine();
    if (R.is0() || !hasEven2(y) || x !== r)
      return false;
    return true;
  } catch (error) {
    return false;
  }
}
var schnorr2 = /* @__PURE__ */ (() => {
  const size = 32;
  const seedLength = 48;
  const randomSecretKey = (seed = randomBytes4(seedLength)) => {
    return mapHashToField2(seed, secp256k1_CURVE2.n);
  };
  secp256k12.utils.randomSecretKey;
  function keygen(seed) {
    const secretKey = randomSecretKey(seed);
    return { secretKey, publicKey: schnorrGetPublicKey2(secretKey) };
  }
  return {
    keygen,
    getPublicKey: schnorrGetPublicKey2,
    sign: schnorrSign2,
    verify: schnorrVerify2,
    Point: Pointk12,
    utils: {
      randomSecretKey,
      randomPrivateKey: randomSecretKey,
      taggedHash: taggedHash2,
      // TODO: remove
      lift_x: lift_x2,
      pointToBytes: pointToBytes2,
      numberToBytesBE: numberToBytesBE3,
      bytesToNumberBE: bytesToNumberBE2,
      mod: mod2
    },
    lengths: {
      secretKey: size,
      publicKey: size,
      publicKeyHasPrefix: false,
      signature: size * 2,
      seed: seedLength
    }
  };
})();

// node_modules/@noble/hashes/esm/sha256.js
var sha2564 = sha2563;

// node_modules/@nostr-dev-kit/ndk/dist/index.mjs
var import_typescript_lru_cache = __toESM(require_dist(), 1);
var import_tseep3 = __toESM(require_lib(), 1);
var import_tseep4 = __toESM(require_lib(), 1);
var import_debug4 = __toESM(require_src(), 1);
var import_debug5 = __toESM(require_src(), 1);
var import_debug6 = __toESM(require_src(), 1);
var import_debug7 = __toESM(require_src(), 1);
var import_debug8 = __toESM(require_src(), 1);
var import_tseep5 = __toESM(require_lib(), 1);
var import_tseep6 = __toESM(require_lib(), 1);
var import_debug9 = __toESM(require_src(), 1);
var import_tseep7 = __toESM(require_lib(), 1);
var import_tseep8 = __toESM(require_lib(), 1);
var import_typescript_lru_cache2 = __toESM(require_dist(), 1);
var import_debug10 = __toESM(require_src(), 1);
var import_light_bolt11_decoder = __toESM(require_bolt11(), 1);
var import_debug11 = __toESM(require_src(), 1);
var import_tseep9 = __toESM(require_lib(), 1);
var import_debug12 = __toESM(require_src(), 1);

// node_modules/nostr-tools/lib/esm/nip19.js
var nip19_exports2 = {};
__export(nip19_exports2, {
  BECH32_REGEX: () => BECH32_REGEX2,
  Bech32MaxSize: () => Bech32MaxSize2,
  NostrTypeGuard: () => NostrTypeGuard2,
  decode: () => decode2,
  decodeNostrURI: () => decodeNostrURI2,
  encodeBytes: () => encodeBytes2,
  naddrEncode: () => naddrEncode2,
  neventEncode: () => neventEncode2,
  noteEncode: () => noteEncode2,
  nprofileEncode: () => nprofileEncode2,
  npubEncode: () => npubEncode2,
  nsecEncode: () => nsecEncode2
});
var utf8Decoder2 = new TextDecoder("utf-8");
var utf8Encoder2 = new TextEncoder();
var NostrTypeGuard2 = {
  isNProfile: (value) => /^nprofile1[a-z\d]+$/.test(value || ""),
  isNEvent: (value) => /^nevent1[a-z\d]+$/.test(value || ""),
  isNAddr: (value) => /^naddr1[a-z\d]+$/.test(value || ""),
  isNSec: (value) => /^nsec1[a-z\d]{58}$/.test(value || ""),
  isNPub: (value) => /^npub1[a-z\d]{58}$/.test(value || ""),
  isNote: (value) => /^note1[a-z\d]+$/.test(value || ""),
  isNcryptsec: (value) => /^ncryptsec1[a-z\d]+$/.test(value || "")
};
var Bech32MaxSize2 = 5e3;
var BECH32_REGEX2 = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function integerToUint8Array2(number) {
  const uint8Array = new Uint8Array(4);
  uint8Array[0] = number >> 24 & 255;
  uint8Array[1] = number >> 16 & 255;
  uint8Array[2] = number >> 8 & 255;
  uint8Array[3] = number & 255;
  return uint8Array;
}
function decodeNostrURI2(nip19code) {
  try {
    if (nip19code.startsWith("nostr:"))
      nip19code = nip19code.substring(6);
    return decode2(nip19code);
  } catch (_err) {
    return { type: "invalid", data: null };
  }
}
function decode2(code) {
  let { prefix, words } = bech32.decode(code, Bech32MaxSize2);
  let data = new Uint8Array(bech32.fromWords(words));
  switch (prefix) {
    case "nprofile": {
      let tlv = parseTLV2(data);
      if (!tlv[0]?.[0])
        throw new Error("missing TLV 0 for nprofile");
      if (tlv[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      return {
        type: "nprofile",
        data: {
          pubkey: bytesToHex2(tlv[0][0]),
          relays: tlv[1] ? tlv[1].map((d5) => utf8Decoder2.decode(d5)) : []
        }
      };
    }
    case "nevent": {
      let tlv = parseTLV2(data);
      if (!tlv[0]?.[0])
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
          relays: tlv[1] ? tlv[1].map((d5) => utf8Decoder2.decode(d5)) : [],
          author: tlv[2]?.[0] ? bytesToHex2(tlv[2][0]) : void 0,
          kind: tlv[3]?.[0] ? parseInt(bytesToHex2(tlv[3][0]), 16) : void 0
        }
      };
    }
    case "naddr": {
      let tlv = parseTLV2(data);
      if (!tlv[0]?.[0])
        throw new Error("missing TLV 0 for naddr");
      if (!tlv[2]?.[0])
        throw new Error("missing TLV 2 for naddr");
      if (tlv[2][0].length !== 32)
        throw new Error("TLV 2 should be 32 bytes");
      if (!tlv[3]?.[0])
        throw new Error("missing TLV 3 for naddr");
      if (tlv[3][0].length !== 4)
        throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "naddr",
        data: {
          identifier: utf8Decoder2.decode(tlv[0][0]),
          pubkey: bytesToHex2(tlv[2][0]),
          kind: parseInt(bytesToHex2(tlv[3][0]), 16),
          relays: tlv[1] ? tlv[1].map((d5) => utf8Decoder2.decode(d5)) : []
        }
      };
    }
    case "nsec":
      return { type: prefix, data };
    case "npub":
    case "note":
      return { type: prefix, data: bytesToHex2(data) };
    default:
      throw new Error(`unknown prefix ${prefix}`);
  }
}
function parseTLV2(data) {
  let result = {};
  let rest = data;
  while (rest.length > 0) {
    if (rest.length < 2)
      throw new Error("not enough data to read TLV");
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
function npubEncode2(hex) {
  return encodeBytes2("npub", hexToBytes2(hex));
}
function noteEncode2(hex) {
  return encodeBytes2("note", hexToBytes2(hex));
}
function encodeBech322(prefix, data) {
  let words = bech32.toWords(data);
  return bech32.encode(prefix, words, Bech32MaxSize2);
}
function encodeBytes2(prefix, bytes) {
  return encodeBech322(prefix, bytes);
}
function nprofileEncode2(profile) {
  let data = encodeTLV2({
    0: [hexToBytes2(profile.pubkey)],
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
    0: [hexToBytes2(event.id)],
    1: (event.relays || []).map((url) => utf8Encoder2.encode(url)),
    2: event.author ? [hexToBytes2(event.author)] : [],
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
    2: [hexToBytes2(addr.pubkey)],
    3: [new Uint8Array(kind)]
  });
  return encodeBech322("naddr", data);
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
  return concatBytes2(...entries);
}

// node_modules/@nostr-dev-kit/ndk/dist/index.mjs
var __defProp3 = Object.defineProperty;
var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames2 = Object.getOwnPropertyNames;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __copyProps2 = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames2(from))
      if (!__hasOwnProp2.call(to, key) && key !== except)
        __defProp3(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod3, secondTarget) => (__copyProps2(target, mod3, "default"), secondTarget && __copyProps2(secondTarget, mod3, "default"));
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
  NDKKind2[NDKKind2["Thread"] = 11] = "Thread";
  NDKKind2[NDKKind2["GroupReply"] = 12] = "GroupReply";
  NDKKind2[NDKKind2["GiftWrapSeal"] = 13] = "GiftWrapSeal";
  NDKKind2[NDKKind2["PrivateDirectMessage"] = 14] = "PrivateDirectMessage";
  NDKKind2[NDKKind2["Image"] = 20] = "Image";
  NDKKind2[NDKKind2["Video"] = 21] = "Video";
  NDKKind2[NDKKind2["ShortVideo"] = 22] = "ShortVideo";
  NDKKind2[NDKKind2["Story"] = 23] = "Story";
  NDKKind2[NDKKind2["Vanish"] = 62] = "Vanish";
  NDKKind2[NDKKind2["CashuWalletBackup"] = 375] = "CashuWalletBackup";
  NDKKind2[NDKKind2["GiftWrap"] = 1059] = "GiftWrap";
  NDKKind2[NDKKind2["GenericRepost"] = 16] = "GenericRepost";
  NDKKind2[NDKKind2["ChannelCreation"] = 40] = "ChannelCreation";
  NDKKind2[NDKKind2["ChannelMetadata"] = 41] = "ChannelMetadata";
  NDKKind2[NDKKind2["ChannelMessage"] = 42] = "ChannelMessage";
  NDKKind2[NDKKind2["ChannelHideMessage"] = 43] = "ChannelHideMessage";
  NDKKind2[NDKKind2["ChannelMuteUser"] = 44] = "ChannelMuteUser";
  NDKKind2[NDKKind2["WikiMergeRequest"] = 818] = "WikiMergeRequest";
  NDKKind2[NDKKind2["GenericReply"] = 1111] = "GenericReply";
  NDKKind2[NDKKind2["Media"] = 1063] = "Media";
  NDKKind2[NDKKind2["DraftCheckpoint"] = 1234] = "DraftCheckpoint";
  NDKKind2[NDKKind2["Task"] = 1934] = "Task";
  NDKKind2[NDKKind2["Report"] = 1984] = "Report";
  NDKKind2[NDKKind2["Label"] = 1985] = "Label";
  NDKKind2[NDKKind2["DVMReqTextExtraction"] = 5e3] = "DVMReqTextExtraction";
  NDKKind2[NDKKind2["DVMReqTextSummarization"] = 5001] = "DVMReqTextSummarization";
  NDKKind2[NDKKind2["DVMReqTextTranslation"] = 5002] = "DVMReqTextTranslation";
  NDKKind2[NDKKind2["DVMReqTextGeneration"] = 5050] = "DVMReqTextGeneration";
  NDKKind2[NDKKind2["DVMReqImageGeneration"] = 5100] = "DVMReqImageGeneration";
  NDKKind2[NDKKind2["DVMReqTextToSpeech"] = 5250] = "DVMReqTextToSpeech";
  NDKKind2[NDKKind2["DVMReqDiscoveryNostrContent"] = 5300] = "DVMReqDiscoveryNostrContent";
  NDKKind2[NDKKind2["DVMReqDiscoveryNostrPeople"] = 5301] = "DVMReqDiscoveryNostrPeople";
  NDKKind2[NDKKind2["DVMReqTimestamping"] = 5900] = "DVMReqTimestamping";
  NDKKind2[NDKKind2["DVMEventSchedule"] = 5905] = "DVMEventSchedule";
  NDKKind2[NDKKind2["DVMJobFeedback"] = 7e3] = "DVMJobFeedback";
  NDKKind2[NDKKind2["Subscribe"] = 7001] = "Subscribe";
  NDKKind2[NDKKind2["Unsubscribe"] = 7002] = "Unsubscribe";
  NDKKind2[NDKKind2["SubscriptionReceipt"] = 7003] = "SubscriptionReceipt";
  NDKKind2[NDKKind2["CashuReserve"] = 7373] = "CashuReserve";
  NDKKind2[NDKKind2["CashuQuote"] = 7374] = "CashuQuote";
  NDKKind2[NDKKind2["CashuToken"] = 7375] = "CashuToken";
  NDKKind2[NDKKind2["CashuWalletTx"] = 7376] = "CashuWalletTx";
  NDKKind2[NDKKind2["GroupAdminAddUser"] = 9e3] = "GroupAdminAddUser";
  NDKKind2[NDKKind2["GroupAdminRemoveUser"] = 9001] = "GroupAdminRemoveUser";
  NDKKind2[NDKKind2["GroupAdminEditMetadata"] = 9002] = "GroupAdminEditMetadata";
  NDKKind2[NDKKind2["GroupAdminEditStatus"] = 9006] = "GroupAdminEditStatus";
  NDKKind2[NDKKind2["GroupAdminCreateGroup"] = 9007] = "GroupAdminCreateGroup";
  NDKKind2[NDKKind2["GroupAdminRequestJoin"] = 9021] = "GroupAdminRequestJoin";
  NDKKind2[NDKKind2["MuteList"] = 1e4] = "MuteList";
  NDKKind2[NDKKind2["PinList"] = 10001] = "PinList";
  NDKKind2[NDKKind2["RelayList"] = 10002] = "RelayList";
  NDKKind2[NDKKind2["BookmarkList"] = 10003] = "BookmarkList";
  NDKKind2[NDKKind2["CommunityList"] = 10004] = "CommunityList";
  NDKKind2[NDKKind2["PublicChatList"] = 10005] = "PublicChatList";
  NDKKind2[NDKKind2["BlockRelayList"] = 10006] = "BlockRelayList";
  NDKKind2[NDKKind2["SearchRelayList"] = 10007] = "SearchRelayList";
  NDKKind2[NDKKind2["SimpleGroupList"] = 10009] = "SimpleGroupList";
  NDKKind2[NDKKind2["InterestList"] = 10015] = "InterestList";
  NDKKind2[NDKKind2["CashuMintList"] = 10019] = "CashuMintList";
  NDKKind2[NDKKind2["EmojiList"] = 10030] = "EmojiList";
  NDKKind2[NDKKind2["DirectMessageReceiveRelayList"] = 10050] = "DirectMessageReceiveRelayList";
  NDKKind2[NDKKind2["BlossomList"] = 10063] = "BlossomList";
  NDKKind2[NDKKind2["NostrWaletConnectInfo"] = 13194] = "NostrWaletConnectInfo";
  NDKKind2[NDKKind2["TierList"] = 17e3] = "TierList";
  NDKKind2[NDKKind2["CashuWallet"] = 17375] = "CashuWallet";
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
  NDKKind2[NDKKind2["ArticleCurationSet"] = 30004] = "ArticleCurationSet";
  NDKKind2[NDKKind2["VideoCurationSet"] = 30005] = "VideoCurationSet";
  NDKKind2[NDKKind2["ImageCurationSet"] = 30006] = "ImageCurationSet";
  NDKKind2[NDKKind2["InterestSet"] = 30015] = "InterestSet";
  NDKKind2[
    NDKKind2["InterestsList"] = 30015
    /* InterestSet */
  ] = "InterestsList";
  NDKKind2[NDKKind2["ProjectTemplate"] = 30717] = "ProjectTemplate";
  NDKKind2[NDKKind2["EmojiSet"] = 30030] = "EmojiSet";
  NDKKind2[NDKKind2["ModularArticle"] = 30040] = "ModularArticle";
  NDKKind2[NDKKind2["ModularArticleItem"] = 30041] = "ModularArticleItem";
  NDKKind2[NDKKind2["Wiki"] = 30818] = "Wiki";
  NDKKind2[NDKKind2["Draft"] = 31234] = "Draft";
  NDKKind2[NDKKind2["Project"] = 31933] = "Project";
  NDKKind2[NDKKind2["SubscriptionTier"] = 37001] = "SubscriptionTier";
  NDKKind2[NDKKind2["EcashMintRecommendation"] = 38e3] = "EcashMintRecommendation";
  NDKKind2[NDKKind2["CashuMintAnnouncement"] = 38172] = "CashuMintAnnouncement";
  NDKKind2[NDKKind2["FedimintMintAnnouncement"] = 38173] = "FedimintMintAnnouncement";
  NDKKind2[NDKKind2["HighlightSet"] = 39802] = "HighlightSet";
  NDKKind2[
    NDKKind2["CategorizedHighlightList"] = 39802
    /* HighlightSet */
  ] = "CategorizedHighlightList";
  NDKKind2[NDKKind2["Nutzap"] = 9321] = "Nutzap";
  NDKKind2[NDKKind2["ZapRequest"] = 9734] = "ZapRequest";
  NDKKind2[NDKKind2["Zap"] = 9735] = "Zap";
  NDKKind2[NDKKind2["Highlight"] = 9802] = "Highlight";
  NDKKind2[NDKKind2["ClientAuth"] = 22242] = "ClientAuth";
  NDKKind2[NDKKind2["NostrWalletConnectReq"] = 23194] = "NostrWalletConnectReq";
  NDKKind2[NDKKind2["NostrWalletConnectRes"] = 23195] = "NostrWalletConnectRes";
  NDKKind2[NDKKind2["NostrConnect"] = 24133] = "NostrConnect";
  NDKKind2[NDKKind2["BlossomUpload"] = 24242] = "BlossomUpload";
  NDKKind2[NDKKind2["HttpAuth"] = 27235] = "HttpAuth";
  NDKKind2[NDKKind2["ProfileBadge"] = 30008] = "ProfileBadge";
  NDKKind2[NDKKind2["BadgeDefinition"] = 30009] = "BadgeDefinition";
  NDKKind2[NDKKind2["MarketStall"] = 30017] = "MarketStall";
  NDKKind2[NDKKind2["MarketProduct"] = 30018] = "MarketProduct";
  NDKKind2[NDKKind2["Article"] = 30023] = "Article";
  NDKKind2[NDKKind2["AppSpecificData"] = 30078] = "AppSpecificData";
  NDKKind2[NDKKind2["Classified"] = 30402] = "Classified";
  NDKKind2[NDKKind2["HorizontalVideo"] = 34235] = "HorizontalVideo";
  NDKKind2[NDKKind2["VerticalVideo"] = 34236] = "VerticalVideo";
  NDKKind2[NDKKind2["GroupMetadata"] = 39e3] = "GroupMetadata";
  NDKKind2[NDKKind2["GroupAdmins"] = 39001] = "GroupAdmins";
  NDKKind2[NDKKind2["GroupMembers"] = 39002] = "GroupMembers";
  NDKKind2[NDKKind2["FollowPack"] = 39089] = "FollowPack";
  NDKKind2[NDKKind2["MediaFollowPack"] = 39092] = "MediaFollowPack";
  NDKKind2[NDKKind2["AppRecommendation"] = 31989] = "AppRecommendation";
  NDKKind2[NDKKind2["AppHandler"] = 31990] = "AppHandler";
  return NDKKind2;
})(NDKKind || {});
function getRelaysForSync(ndk2, author, type = "write") {
  if (!ndk2.outboxTracker) return void 0;
  const item = ndk2.outboxTracker.data.get(author);
  if (!item) return void 0;
  if (type === "write") {
    return item.writeRelays;
  }
  return item.readRelays;
}
async function getWriteRelaysFor(ndk2, author, type = "write") {
  if (!ndk2.outboxTracker) return void 0;
  if (!ndk2.outboxTracker.data.has(author)) {
    await ndk2.outboxTracker.trackUsers([author]);
  }
  return getRelaysForSync(ndk2, author, type);
}
function getTopRelaysForAuthors(ndk2, authors) {
  const relaysWithCount = /* @__PURE__ */ new Map();
  authors.forEach((author) => {
    const writeRelays = getRelaysForSync(ndk2, author);
    if (writeRelays) {
      writeRelays.forEach((relay) => {
        const count = relaysWithCount.get(relay) || 0;
        relaysWithCount.set(relay, count + 1);
      });
    }
  });
  const sortedRelays = Array.from(relaysWithCount.entries()).sort((a, b) => b[1] - a[1]);
  return sortedRelays.map((entry) => entry[0]);
}
function getAllRelaysForAllPubkeys(ndk2, pubkeys, type = "read") {
  const pubkeysToRelays = /* @__PURE__ */ new Map();
  const authorsMissingRelays = /* @__PURE__ */ new Set();
  pubkeys.forEach((pubkey) => {
    const relays = getRelaysForSync(ndk2, pubkey, type);
    if (relays && relays.size > 0) {
      relays.forEach((relay) => {
        const pubkeysInRelay = pubkeysToRelays.get(relay) || /* @__PURE__ */ new Set();
        pubkeysInRelay.add(pubkey);
      });
      pubkeysToRelays.set(pubkey, relays);
    } else {
      authorsMissingRelays.add(pubkey);
    }
  });
  return { pubkeysToRelays, authorsMissingRelays };
}
function chooseRelayCombinationForPubkeys(ndk2, pubkeys, type, { count, preferredRelays } = {}) {
  count ??= 2;
  preferredRelays ??= /* @__PURE__ */ new Set();
  const pool = ndk2.pool;
  const connectedRelays = pool.connectedRelays();
  connectedRelays.forEach((relay) => {
    preferredRelays?.add(relay.url);
  });
  const relayToAuthorsMap = /* @__PURE__ */ new Map();
  const { pubkeysToRelays, authorsMissingRelays } = getAllRelaysForAllPubkeys(ndk2, pubkeys, type);
  const sortedRelays = getTopRelaysForAuthors(ndk2, pubkeys);
  const addAuthorToRelay = (author, relay) => {
    const authorsInRelay = relayToAuthorsMap.get(relay) || [];
    authorsInRelay.push(author);
    relayToAuthorsMap.set(relay, authorsInRelay);
  };
  for (const [author, authorRelays] of pubkeysToRelays.entries()) {
    let missingRelayCount = count;
    const addedRelaysForAuthor = /* @__PURE__ */ new Set();
    for (const relay of connectedRelays) {
      if (authorRelays.has(relay.url)) {
        addAuthorToRelay(author, relay.url);
        addedRelaysForAuthor.add(relay.url);
        missingRelayCount--;
      }
    }
    for (const authorRelay of authorRelays) {
      if (addedRelaysForAuthor.has(authorRelay)) continue;
      if (relayToAuthorsMap.has(authorRelay)) {
        addAuthorToRelay(author, authorRelay);
        addedRelaysForAuthor.add(authorRelay);
        missingRelayCount--;
      }
    }
    if (missingRelayCount <= 0) continue;
    for (const relay of sortedRelays) {
      if (missingRelayCount <= 0) break;
      if (addedRelaysForAuthor.has(relay)) continue;
      if (authorRelays.has(relay)) {
        addAuthorToRelay(author, relay);
        addedRelaysForAuthor.add(relay);
        missingRelayCount--;
      }
    }
  }
  for (const author of authorsMissingRelays) {
    pool.permanentAndConnectedRelays().forEach((relay) => {
      const authorsInRelay = relayToAuthorsMap.get(relay.url) || [];
      authorsInRelay.push(author);
      relayToAuthorsMap.set(relay.url, authorsInRelay);
    });
  }
  return relayToAuthorsMap;
}
function getRelaysForFilterWithAuthors(ndk2, authors, relayGoalPerAuthor = 2) {
  return chooseRelayCombinationForPubkeys(ndk2, authors, "write", { count: relayGoalPerAuthor });
}
function tryNormalizeRelayUrl(url) {
  try {
    return normalizeRelayUrl(url);
  } catch {
    return void 0;
  }
}
function normalizeRelayUrl(url) {
  let r = normalizeUrl(url, {
    stripAuthentication: false,
    stripWWW: false,
    stripHash: true
  });
  if (!r.endsWith("/")) {
    r += "/";
  }
  return r;
}
function normalize(urls) {
  const normalized = /* @__PURE__ */ new Set();
  for (const url of urls) {
    try {
      normalized.add(normalizeRelayUrl(url));
    } catch {
    }
  }
  return Array.from(normalized);
}
var DATA_URL_DEFAULT_MIME_TYPE = "text/plain";
var DATA_URL_DEFAULT_CHARSET = "us-ascii";
var testParameter = (name, filters) => filters.some((filter) => filter instanceof RegExp ? filter.test(name) : filter === name);
var supportedProtocols = /* @__PURE__ */ new Set(["https:", "http:", "file:"]);
var hasCustomProtocol = (urlString) => {
  try {
    const { protocol } = new URL(urlString);
    return protocol.endsWith(":") && !protocol.includes(".") && !supportedProtocols.has(protocol);
  } catch {
    return false;
  }
};
var normalizeDataURL = (urlString, { stripHash }) => {
  const match = /^data:(?<type>[^,]*?),(?<data>[^#]*?)(?:#(?<hash>.*))?$/.exec(urlString);
  if (!match) {
    throw new Error(`Invalid URL: ${urlString}`);
  }
  const type = match.groups?.type ?? "";
  const data = match.groups?.data ?? "";
  let hash = match.groups?.hash ?? "";
  const mediaType = type.split(";");
  hash = stripHash ? "" : hash;
  let isBase64 = false;
  if (mediaType[mediaType.length - 1] === "base64") {
    mediaType.pop();
    isBase64 = true;
  }
  const mimeType = mediaType.shift()?.toLowerCase() ?? "";
  const attributes = mediaType.map((attribute) => {
    let [key, value = ""] = attribute.split("=").map((string) => string.trim());
    if (key === "charset") {
      value = value.toLowerCase();
      if (value === DATA_URL_DEFAULT_CHARSET) {
        return "";
      }
    }
    return `${key}${value ? `=${value}` : ""}`;
  }).filter(Boolean);
  const normalizedMediaType = [...attributes];
  if (isBase64) {
    normalizedMediaType.push("base64");
  }
  if (normalizedMediaType.length > 0 || mimeType && mimeType !== DATA_URL_DEFAULT_MIME_TYPE) {
    normalizedMediaType.unshift(mimeType);
  }
  return `data:${normalizedMediaType.join(";")},${isBase64 ? data.trim() : data}${hash ? `#${hash}` : ""}`;
};
function normalizeUrl(urlString, options = {}) {
  options = {
    defaultProtocol: "http",
    normalizeProtocol: true,
    forceHttp: false,
    forceHttps: false,
    stripAuthentication: true,
    stripHash: false,
    stripTextFragment: true,
    stripWWW: true,
    removeQueryParameters: [/^utm_\w+/i],
    removeTrailingSlash: true,
    removeSingleSlash: true,
    removeDirectoryIndex: false,
    removeExplicitPort: false,
    sortQueryParameters: true,
    ...options
  };
  if (typeof options.defaultProtocol === "string" && !options.defaultProtocol.endsWith(":")) {
    options.defaultProtocol = `${options.defaultProtocol}:`;
  }
  urlString = urlString.trim();
  if (/^data:/i.test(urlString)) {
    return normalizeDataURL(urlString, options);
  }
  if (hasCustomProtocol(urlString)) {
    return urlString;
  }
  const hasRelativeProtocol = urlString.startsWith("//");
  const isRelativeUrl = !hasRelativeProtocol && /^\.*\//.test(urlString);
  if (!isRelativeUrl) {
    urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, options.defaultProtocol);
  }
  const urlObject = new URL(urlString);
  urlObject.hostname = urlObject.hostname.toLowerCase();
  if (options.forceHttp && options.forceHttps) {
    throw new Error("The `forceHttp` and `forceHttps` options cannot be used together");
  }
  if (options.forceHttp && urlObject.protocol === "https:") {
    urlObject.protocol = "http:";
  }
  if (options.forceHttps && urlObject.protocol === "http:") {
    urlObject.protocol = "https:";
  }
  if (options.stripAuthentication) {
    urlObject.username = "";
    urlObject.password = "";
  }
  if (options.stripHash) {
    urlObject.hash = "";
  } else if (options.stripTextFragment) {
    urlObject.hash = urlObject.hash.replace(/#?:~:text.*?$/i, "");
  }
  if (urlObject.pathname) {
    const protocolRegex = /\b[a-z][a-z\d+\-.]{1,50}:\/\//g;
    let lastIndex = 0;
    let result = "";
    for (; ; ) {
      const match = protocolRegex.exec(urlObject.pathname);
      if (!match) {
        break;
      }
      const protocol = match[0];
      const protocolAtIndex = match.index;
      const intermediate = urlObject.pathname.slice(lastIndex, protocolAtIndex);
      result += intermediate.replace(/\/{2,}/g, "/");
      result += protocol;
      lastIndex = protocolAtIndex + protocol.length;
    }
    const remnant = urlObject.pathname.slice(lastIndex, urlObject.pathname.length);
    result += remnant.replace(/\/{2,}/g, "/");
    urlObject.pathname = result;
  }
  if (urlObject.pathname) {
    try {
      urlObject.pathname = decodeURI(urlObject.pathname);
    } catch {
    }
  }
  if (options.removeDirectoryIndex === true) {
    options.removeDirectoryIndex = [/^index\.[a-z]+$/];
  }
  if (Array.isArray(options.removeDirectoryIndex) && options.removeDirectoryIndex.length > 0) {
    let pathComponents = urlObject.pathname.split("/");
    const lastComponent = pathComponents[pathComponents.length - 1];
    if (testParameter(lastComponent, options.removeDirectoryIndex)) {
      pathComponents = pathComponents.slice(0, -1);
      urlObject.pathname = `${pathComponents.slice(1).join("/")}/`;
    }
  }
  if (urlObject.hostname) {
    urlObject.hostname = urlObject.hostname.replace(/\.$/, "");
    if (options.stripWWW && /^www\.(?!www\.)[a-z\-\d]{1,63}\.[a-z.\-\d]{2,63}$/.test(urlObject.hostname)) {
      urlObject.hostname = urlObject.hostname.replace(/^www\./, "");
    }
  }
  if (Array.isArray(options.removeQueryParameters)) {
    for (const key of [...urlObject.searchParams.keys()]) {
      if (testParameter(key, options.removeQueryParameters)) {
        urlObject.searchParams.delete(key);
      }
    }
  }
  if (!Array.isArray(options.keepQueryParameters) && options.removeQueryParameters === true) {
    urlObject.search = "";
  }
  if (Array.isArray(options.keepQueryParameters) && options.keepQueryParameters.length > 0) {
    for (const key of [...urlObject.searchParams.keys()]) {
      if (!testParameter(key, options.keepQueryParameters)) {
        urlObject.searchParams.delete(key);
      }
    }
  }
  if (options.sortQueryParameters) {
    urlObject.searchParams.sort();
    try {
      urlObject.search = decodeURIComponent(urlObject.search);
    } catch {
    }
  }
  if (options.removeTrailingSlash) {
    urlObject.pathname = urlObject.pathname.replace(/\/$/, "");
  }
  if (options.removeExplicitPort && urlObject.port) {
    urlObject.port = "";
  }
  const oldUrlString = urlString;
  urlString = urlObject.toString();
  if (!options.removeSingleSlash && urlObject.pathname === "/" && !oldUrlString.endsWith("/") && urlObject.hash === "") {
    urlString = urlString.replace(/\/$/, "");
  }
  if ((options.removeTrailingSlash || urlObject.pathname === "/") && urlObject.hash === "" && options.removeSingleSlash) {
    urlString = urlString.replace(/\/$/, "");
  }
  if (hasRelativeProtocol && !options.normalizeProtocol) {
    urlString = urlString.replace(/^http:\/\//, "//");
  }
  if (options.stripProtocol) {
    urlString = urlString.replace(/^(?:https?:)?\/\//, "");
  }
  return urlString;
}
var NDKRelayKeepalive = class {
  /**
   * @param timeout - Time in milliseconds to wait before considering connection stale (default 30s)
   * @param onSilenceDetected - Callback when silence is detected
   */
  constructor(timeout = 3e4, onSilenceDetected) {
    this.onSilenceDetected = onSilenceDetected;
    this.timeout = timeout;
  }
  lastActivity = Date.now();
  timer;
  timeout;
  isRunning = false;
  /**
   * Records activity from the relay, resetting the silence timer
   */
  recordActivity() {
    this.lastActivity = Date.now();
    if (this.isRunning) {
      this.resetTimer();
    }
  }
  /**
   * Starts monitoring for relay silence
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastActivity = Date.now();
    this.resetTimer();
  }
  /**
   * Stops monitoring for relay silence
   */
  stop() {
    this.isRunning = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = void 0;
    }
  }
  resetTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      const silenceTime = Date.now() - this.lastActivity;
      if (silenceTime >= this.timeout) {
        this.onSilenceDetected();
      } else {
        const remainingTime = this.timeout - silenceTime;
        this.timer = setTimeout(() => {
          this.onSilenceDetected();
        }, remainingTime);
      }
    }, this.timeout);
  }
};
async function probeRelayConnection(relay) {
  const probeId = `probe-${Math.random().toString(36).substring(7)}`;
  return new Promise((resolve) => {
    let responded = false;
    const timeout = setTimeout(() => {
      if (!responded) {
        responded = true;
        relay.send(["CLOSE", probeId]);
        resolve(false);
      }
    }, 5e3);
    const handler = () => {
      if (!responded) {
        responded = true;
        clearTimeout(timeout);
        relay.send(["CLOSE", probeId]);
        resolve(true);
      }
    };
    relay.once("message", handler);
    relay.send([
      "REQ",
      probeId,
      {
        kinds: [99999],
        limit: 0
      }
    ]);
  });
}
var MAX_RECONNECT_ATTEMPTS = 5;
var FLAPPING_THRESHOLD_MS = 1e3;
var NDKRelayConnectivity = class {
  ndkRelay;
  ws;
  _status;
  timeoutMs;
  connectedAt;
  _connectionStats = {
    attempts: 0,
    success: 0,
    durations: []
  };
  debug;
  netDebug;
  connectTimeout;
  reconnectTimeout;
  ndk;
  openSubs = /* @__PURE__ */ new Map();
  openCountRequests = /* @__PURE__ */ new Map();
  openEventPublishes = /* @__PURE__ */ new Map();
  serial = 0;
  baseEoseTimeout = 4400;
  // Keepalive and monitoring
  keepalive;
  wsStateMonitor;
  sleepDetector;
  lastSleepCheck = Date.now();
  lastMessageSent = Date.now();
  wasIdle = false;
  constructor(ndkRelay, ndk2) {
    this.ndkRelay = ndkRelay;
    this._status = 1;
    const rand = Math.floor(Math.random() * 1e3);
    this.debug = this.ndkRelay.debug.extend(`connectivity${rand}`);
    this.ndk = ndk2;
    this.setupMonitoring();
  }
  /**
   * Sets up keepalive, WebSocket state monitoring, and sleep detection
   */
  setupMonitoring() {
    this.keepalive = new NDKRelayKeepalive(3e4, async () => {
      this.debug("Relay silence detected, probing connection");
      const isAlive = await probeRelayConnection({
        send: (msg) => this.send(JSON.stringify(msg)),
        once: (event, handler) => {
          const messageHandler = (e) => {
            try {
              const data = JSON.parse(e.data);
              if (data[0] === "EOSE" || data[0] === "EVENT" || data[0] === "NOTICE") {
                handler();
                this.ws?.removeEventListener("message", messageHandler);
              }
            } catch {
            }
          };
          this.ws?.addEventListener("message", messageHandler);
        }
      });
      if (!isAlive) {
        this.debug("Probe failed, connection is stale");
        this.handleStaleConnection();
      }
    });
    this.wsStateMonitor = setInterval(() => {
      if (this._status === 5) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
          this.debug("WebSocket died silently, reconnecting");
          this.handleStaleConnection();
        }
      }
    }, 5e3);
    this.sleepDetector = setInterval(() => {
      const now2 = Date.now();
      const elapsed = now2 - this.lastSleepCheck;
      if (elapsed > 15e3) {
        this.debug(`Detected possible sleep/wake (${elapsed}ms gap)`);
        this.handlePossibleWake();
      }
      this.lastSleepCheck = now2;
    }, 1e4);
  }
  /**
   * Handles detection of a stale connection
   */
  handleStaleConnection() {
    this._status = 1;
    this.wasIdle = true;
    this.onDisconnect();
  }
  /**
   * Handles possible system wake event
   */
  handlePossibleWake() {
    this.debug("System wake detected, checking all connections");
    this.wasIdle = true;
    if (this._status >= 5) {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        this.handleStaleConnection();
      } else {
        probeRelayConnection({
          send: (msg) => this.send(JSON.stringify(msg)),
          once: (event, handler) => {
            const messageHandler = (e) => {
              try {
                const data = JSON.parse(e.data);
                if (data[0] === "EOSE" || data[0] === "EVENT" || data[0] === "NOTICE") {
                  handler();
                  this.ws?.removeEventListener("message", messageHandler);
                }
              } catch {
              }
            };
            this.ws?.addEventListener("message", messageHandler);
          }
        }).then((isAlive) => {
          if (!isAlive) {
            this.handleStaleConnection();
          }
        });
      }
    }
  }
  /**
   * Resets the reconnection state for system-wide events
   * Used by NDKPool when detecting system sleep/wake
   */
  resetReconnectionState() {
    this.wasIdle = true;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = void 0;
    }
  }
  /**
   * Connects to the NDK relay and handles the connection lifecycle.
   *
   * This method attempts to establish a WebSocket connection to the NDK relay specified in the `ndkRelay` object.
   * If the connection is successful, it updates the connection statistics, sets the connection status to `CONNECTED`,
   * and emits `connect` and `ready` events on the `ndkRelay` object.
   *
   * If the connection attempt fails, it handles the error by either initiating a reconnection attempt or emitting a
   * `delayed-connect` event on the `ndkRelay` object, depending on the `reconnect` parameter.
   *
   * @param timeoutMs - The timeout in milliseconds for the connection attempt. If not provided, the default timeout from the `ndkRelay` object is used.
   * @param reconnect - Indicates whether a reconnection should be attempted if the connection fails. Defaults to `true`.
   * @returns A Promise that resolves when the connection is established, or rejects if the connection fails.
   */
  async connect(timeoutMs, reconnect = true) {
    if (this.ws && this.ws.readyState !== WebSocket.OPEN && this.ws.readyState !== WebSocket.CONNECTING) {
      this.debug("Cleaning up stale WebSocket connection");
      try {
        this.ws.close();
      } catch (e) {
      }
      this.ws = void 0;
      this._status = 1;
    }
    if (this._status !== 2 && this._status !== 1 || this.reconnectTimeout) {
      this.debug(
        "Relay requested to be connected but was in state %s or it had a reconnect timeout",
        this._status
      );
      return;
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = void 0;
    }
    if (this.connectTimeout) {
      clearTimeout(this.connectTimeout);
      this.connectTimeout = void 0;
    }
    timeoutMs ??= this.timeoutMs;
    if (!this.timeoutMs && timeoutMs) this.timeoutMs = timeoutMs;
    if (this.timeoutMs) this.connectTimeout = setTimeout(() => this.onConnectionError(reconnect), this.timeoutMs);
    try {
      this.updateConnectionStats.attempt();
      if (this._status === 1) this._status = 4;
      else this._status = 2;
      this.ws = new WebSocket(this.ndkRelay.url);
      this.ws.onopen = this.onConnect.bind(this);
      this.ws.onclose = this.onDisconnect.bind(this);
      this.ws.onmessage = this.onMessage.bind(this);
      this.ws.onerror = this.onError.bind(this);
    } catch (e) {
      this.debug(`Failed to connect to ${this.ndkRelay.url}`, e);
      this._status = 1;
      if (reconnect) this.handleReconnection();
      else this.ndkRelay.emit("delayed-connect", 2 * 24 * 60 * 60 * 1e3);
      throw e;
    }
  }
  /**
   * Disconnects the WebSocket connection to the NDK relay.
   * This method sets the connection status to `NDKRelayStatus.DISCONNECTING`,
   * attempts to close the WebSocket connection, and sets the status to
   * `NDKRelayStatus.DISCONNECTED` if the disconnect operation fails.
   */
  disconnect() {
    this._status = 0;
    this.keepalive?.stop();
    if (this.wsStateMonitor) {
      clearInterval(this.wsStateMonitor);
      this.wsStateMonitor = void 0;
    }
    if (this.sleepDetector) {
      clearInterval(this.sleepDetector);
      this.sleepDetector = void 0;
    }
    try {
      this.ws?.close();
    } catch (e) {
      this.debug("Failed to disconnect", e);
      this._status = 1;
    }
  }
  /**
   * Handles the error that occurred when attempting to connect to the NDK relay.
   * If `reconnect` is `true`, this method will initiate a reconnection attempt.
   * Otherwise, it will emit a `delayed-connect` event on the `ndkRelay` object,
   * indicating that a reconnection should be attempted after a delay.
   *
   * @param reconnect - Indicates whether a reconnection should be attempted.
   */
  onConnectionError(reconnect) {
    this.debug(`Error connecting to ${this.ndkRelay.url}`, this.timeoutMs);
    if (reconnect && !this.reconnectTimeout) {
      this.handleReconnection();
    }
  }
  /**
   * Handles the connection event when the WebSocket connection is established.
   * This method is called when the WebSocket connection is successfully opened.
   * It clears any existing connection and reconnection timeouts, updates the connection statistics,
   * sets the connection status to `CONNECTED`, and emits `connect` and `ready` events on the `ndkRelay` object.
   */
  onConnect() {
    this.netDebug?.("connected", this.ndkRelay);
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = void 0;
    }
    if (this.connectTimeout) {
      clearTimeout(this.connectTimeout);
      this.connectTimeout = void 0;
    }
    this.updateConnectionStats.connected();
    this._status = 5;
    this.keepalive?.start();
    this.wasIdle = false;
    this.ndkRelay.emit("connect");
    this.ndkRelay.emit("ready");
  }
  /**
   * Handles the disconnection event when the WebSocket connection is closed.
   * This method is called when the WebSocket connection is successfully closed.
   * It updates the connection statistics, sets the connection status to `DISCONNECTED`,
   * initiates a reconnection attempt if we didn't disconnect ourselves,
   * and emits a `disconnect` event on the `ndkRelay` object.
   */
  onDisconnect() {
    this.netDebug?.("disconnected", this.ndkRelay);
    this.updateConnectionStats.disconnected();
    this.keepalive?.stop();
    if (this._status === 5) {
      this.handleReconnection();
    }
    this._status = 1;
    this.ndkRelay.emit("disconnect");
  }
  /**
   * Handles incoming messages from the NDK relay WebSocket connection.
   * This method is called whenever a message is received from the relay.
   * It parses the message data and dispatches the appropriate handling logic based on the message type.
   *
   * @param event - The MessageEvent containing the received message data.
   */
  onMessage(event) {
    this.netDebug?.(event.data, this.ndkRelay, "recv");
    this.keepalive?.recordActivity();
    try {
      const data = JSON.parse(event.data);
      const [cmd, id, ..._rest] = data;
      switch (cmd) {
        case "EVENT": {
          const so = this.openSubs.get(id);
          const event2 = data[2];
          if (!so) {
            this.debug(`Received event for unknown subscription ${id}`);
            return;
          }
          so.onevent(event2);
          return;
        }
        case "COUNT": {
          const payload = data[2];
          const cr = this.openCountRequests.get(id);
          if (cr) {
            cr.resolve(payload.count);
            this.openCountRequests.delete(id);
          }
          return;
        }
        case "EOSE": {
          const so = this.openSubs.get(id);
          if (!so) return;
          so.oneose(id);
          return;
        }
        case "OK": {
          const ok = data[2];
          const reason = data[3];
          const ep = this.openEventPublishes.get(id);
          const firstEp = ep?.pop();
          if (!ep || !firstEp) {
            this.debug("Received OK for unknown event publish", id);
            return;
          }
          if (ok) firstEp.resolve(reason);
          else firstEp.reject(new Error(reason));
          if (ep.length === 0) {
            this.openEventPublishes.delete(id);
          } else {
            this.openEventPublishes.set(id, ep);
          }
          return;
        }
        case "CLOSED": {
          const so = this.openSubs.get(id);
          if (!so) return;
          so.onclosed(data[2]);
          return;
        }
        case "NOTICE":
          this.onNotice(data[1]);
          return;
        case "AUTH": {
          this.onAuthRequested(data[1]);
          return;
        }
      }
    } catch (error) {
      this.debug(`Error parsing message from ${this.ndkRelay.url}: ${error.message}`, error?.stack);
      return;
    }
  }
  /**
   * Handles an authentication request from the NDK relay.
   *
   * If an authentication policy is configured, it will be used to authenticate the connection.
   * Otherwise, the `auth` event will be emitted to allow the application to handle the authentication.
   *
   * @param challenge - The authentication challenge provided by the NDK relay.
   */
  async onAuthRequested(challenge3) {
    const authPolicy = this.ndkRelay.authPolicy ?? this.ndk?.relayAuthDefaultPolicy;
    this.debug("Relay requested authentication", {
      havePolicy: !!authPolicy
    });
    if (this._status === 7) {
      this.debug("Already authenticating, ignoring");
      return;
    }
    this._status = 6;
    if (authPolicy) {
      if (this._status >= 5) {
        this._status = 7;
        let res;
        try {
          res = await authPolicy(this.ndkRelay, challenge3);
        } catch (e) {
          this.debug("Authentication policy threw an error", e);
          res = false;
        }
        this.debug("Authentication policy returned", !!res);
        if (res instanceof NDKEvent || res === true) {
          if (res instanceof NDKEvent) {
            await this.auth(res);
          }
          const authenticate = async () => {
            if (this._status >= 5 && this._status < 8) {
              const event = new NDKEvent(this.ndk);
              event.kind = 22242;
              event.tags = [
                ["relay", this.ndkRelay.url],
                ["challenge", challenge3]
              ];
              await event.sign();
              this.auth(event).then(() => {
                this._status = 8;
                this.ndkRelay.emit("authed");
                this.debug("Authentication successful");
              }).catch((e) => {
                this._status = 6;
                this.ndkRelay.emit("auth:failed", e);
                this.debug("Authentication failed", e);
              });
            } else {
              this.debug("Authentication failed, it changed status, status is %d", this._status);
            }
          };
          if (res === true) {
            if (!this.ndk?.signer) {
              this.debug("No signer available for authentication localhost");
              this.ndk?.once("signer:ready", authenticate);
            } else {
              authenticate().catch((e) => {
                console.error("Error authenticating", e);
              });
            }
          }
          this._status = 5;
          this.ndkRelay.emit("authed");
        }
      }
    } else {
      this.ndkRelay.emit("auth", challenge3);
    }
  }
  /**
   * Handles errors that occur on the WebSocket connection to the relay.
   * @param error - The error or event that occurred.
   */
  onError(error) {
    this.debug(`WebSocket error on ${this.ndkRelay.url}:`, error);
  }
  /**
   * Gets the current status of the NDK relay connection.
   * @returns {NDKRelayStatus} The current status of the NDK relay connection.
   */
  get status() {
    return this._status;
  }
  /**
   * Checks if the NDK relay connection is currently available.
   * @returns {boolean} `true` if the relay connection is in the `CONNECTED` status, `false` otherwise.
   */
  isAvailable() {
    return this._status === 5;
  }
  /**
   * Checks if the NDK relay connection is flapping, which means the connection is rapidly
   * disconnecting and reconnecting. This is determined by analyzing the durations of the
   * last three connection attempts. If the standard deviation of the durations is less
   * than 1000 milliseconds, the connection is considered to be flapping.
   *
   * @returns {boolean} `true` if the connection is flapping, `false` otherwise.
   */
  isFlapping() {
    const durations = this._connectionStats.durations;
    if (durations.length % 3 !== 0) return false;
    const sum = durations.reduce((a, b) => a + b, 0);
    const avg = sum / durations.length;
    const variance = durations.map((x) => (x - avg) ** 2).reduce((a, b) => a + b, 0) / durations.length;
    const stdDev = Math.sqrt(variance);
    const isFlapping = stdDev < FLAPPING_THRESHOLD_MS;
    return isFlapping;
  }
  /**
   * Handles a notice received from the NDK relay.
   * If the notice indicates the relay is complaining (e.g. "too many" or "maximum"),
   * the method disconnects from the relay and attempts to reconnect after a 2-second delay.
   * A debug message is logged with the relay URL and the notice text.
   * The "notice" event is emitted on the ndkRelay instance with the notice text.
   *
   * @param notice - The notice text received from the NDK relay.
   */
  async onNotice(notice) {
    this.ndkRelay.emit("notice", notice);
  }
  /**
   * Attempts to reconnect to the NDK relay after a connection is lost.
   * This function is called recursively to handle multiple reconnection attempts.
   * It checks if the relay is flapping and emits a "flapping" event if so.
   * It then calculates a delay before the next reconnection attempt based on the number of previous attempts.
   * The function sets a timeout to execute the next reconnection attempt after the calculated delay.
   * If the maximum number of reconnection attempts is reached, a debug message is logged.
   *
   * @param attempt - The current attempt number (default is 0).
   */
  handleReconnection(attempt = 0) {
    if (this.reconnectTimeout) return;
    if (this.isFlapping()) {
      this.ndkRelay.emit("flapping", this._connectionStats);
      this._status = 3;
      return;
    }
    let reconnectDelay;
    if (this.wasIdle) {
      const aggressiveDelays = [0, 1e3, 2e3, 5e3, 1e4, 3e4];
      reconnectDelay = aggressiveDelays[Math.min(attempt, aggressiveDelays.length - 1)];
      this.debug(`Using aggressive reconnect after idle, attempt ${attempt}, delay ${reconnectDelay}ms`);
    } else if (this.connectedAt) {
      reconnectDelay = Math.max(0, 6e4 - (Date.now() - this.connectedAt));
    } else {
      reconnectDelay = Math.min(1e3 * Math.pow(2, attempt), 3e4);
      this.debug(`Using standard backoff, attempt ${attempt}, delay ${reconnectDelay}ms`);
    }
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = void 0;
      this._status = 2;
      this.connect().catch((_err) => {
        if (attempt < MAX_RECONNECT_ATTEMPTS) {
          this.handleReconnection(attempt + 1);
        } else {
          this.debug("Max reconnect attempts reached");
          this.wasIdle = false;
        }
      });
    }, reconnectDelay);
    this.ndkRelay.emit("delayed-connect", reconnectDelay);
    this.debug("Reconnecting in", reconnectDelay);
    this._connectionStats.nextReconnectAt = Date.now() + reconnectDelay;
  }
  /**
   * Sends a message to the NDK relay if the connection is in the CONNECTED state and the WebSocket is open.
   * If the connection is not in the CONNECTED state or the WebSocket is not open, logs a debug message and throws an error.
   *
   * @param message - The message to send to the NDK relay.
   * @throws {Error} If attempting to send on a closed relay connection.
   */
  async send(message) {
    const idleTime = Date.now() - this.lastMessageSent;
    if (idleTime > 12e4) {
      this.wasIdle = true;
    }
    if (this._status >= 5 && this.ws?.readyState === WebSocket.OPEN) {
      this.ws?.send(message);
      this.netDebug?.(message, this.ndkRelay, "send");
      this.lastMessageSent = Date.now();
    } else {
      this.debug(`Not connected to ${this.ndkRelay.url} (%d), not sending message ${message}`, this._status);
      if (this._status >= 5 && this.ws?.readyState !== WebSocket.OPEN) {
        this.debug(`Stale connection detected, WebSocket state: ${this.ws?.readyState}`);
        this.handleStaleConnection();
      }
    }
  }
  /**
   * Authenticates the NDK event by sending it to the NDK relay and returning a promise that resolves with the result.
   *
   * @param event - The NDK event to authenticate.
   * @returns A promise that resolves with the authentication result.
   */
  async auth(event) {
    const ret = new Promise((resolve, reject) => {
      const val = this.openEventPublishes.get(event.id) ?? [];
      val.push({ resolve, reject });
      this.openEventPublishes.set(event.id, val);
    });
    this.send(`["AUTH",${JSON.stringify(event.rawEvent())}]`);
    return ret;
  }
  /**
   * Publishes an NDK event to the relay and returns a promise that resolves with the result.
   *
   * @param event - The NDK event to publish.
   * @returns A promise that resolves with the result of the event publication.
   * @throws {Error} If attempting to publish on a closed relay connection.
   */
  async publish(event) {
    const ret = new Promise((resolve, reject) => {
      const val = this.openEventPublishes.get(event.id) ?? [];
      if (val.length > 0) {
        console.warn(`Duplicate event publishing detected, you are publishing event ${event.id} twice`);
      }
      val.push({ resolve, reject });
      this.openEventPublishes.set(event.id, val);
    });
    this.send(`["EVENT",${JSON.stringify(event)}]`);
    return ret;
  }
  /**
   * Counts the number of events that match the provided filters.
   *
   * @param filters - The filters to apply to the count request.
   * @param params - An optional object containing a custom id for the count request.
   * @returns A promise that resolves with the number of matching events.
   * @throws {Error} If attempting to send the count request on a closed relay connection.
   */
  async count(filters, params) {
    this.serial++;
    const id = params?.id || `count:${this.serial}`;
    const ret = new Promise((resolve, reject) => {
      this.openCountRequests.set(id, { resolve, reject });
    });
    this.send(`["COUNT","${id}",${JSON.stringify(filters).substring(1)}`);
    return ret;
  }
  close(subId, reason) {
    this.send(`["CLOSE","${subId}"]`);
    const sub = this.openSubs.get(subId);
    this.openSubs.delete(subId);
    if (sub) sub.onclose(reason);
  }
  /**
   * Subscribes to the NDK relay with the provided filters and parameters.
   *
   * @param filters - The filters to apply to the subscription.
   * @param params - The subscription parameters, including an optional custom id.
   * @returns A new NDKRelaySubscription instance.
   */
  req(relaySub) {
    `${this.send(`["REQ","${relaySub.subId}",${JSON.stringify(relaySub.executeFilters).substring(1)}`)}]`;
    this.openSubs.set(relaySub.subId, relaySub);
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
        this._connectionStats.durations.push(Date.now() - this._connectionStats.connectedAt);
        if (this._connectionStats.durations.length > 100) {
          this._connectionStats.durations.shift();
        }
      }
      this._connectionStats.connectedAt = void 0;
    },
    attempt: () => {
      this._connectionStats.attempts++;
      this._connectionStats.connectedAt = Date.now();
    }
  };
  /** Returns the connection stats. */
  get connectionStats() {
    return this._connectionStats;
  }
  /** Returns the relay URL */
  get url() {
    return this.ndkRelay.url;
  }
  get connected() {
    return this._status >= 5 && this.ws?.readyState === WebSocket.OPEN;
  }
};
var NDKRelayPublisher = class {
  ndkRelay;
  debug;
  constructor(ndkRelay) {
    this.ndkRelay = ndkRelay;
    this.debug = ndkRelay.debug.extend("publisher");
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
    let timeout;
    const publishConnected = () => {
      return new Promise((resolve, reject) => {
        try {
          this.publishEvent(event).then((_result) => {
            this.ndkRelay.emit("published", event);
            event.emit("relay:published", this.ndkRelay);
            resolve(true);
          }).catch(reject);
        } catch (err) {
          reject(err);
        }
      });
    };
    const timeoutPromise = new Promise((_, reject) => {
      timeout = setTimeout(() => {
        timeout = void 0;
        reject(new Error(`Timeout: ${timeoutMs}ms`));
      }, timeoutMs);
    });
    const onConnectHandler = () => {
      publishConnected().then((result) => connectResolve(result)).catch((err) => connectReject(err));
    };
    let connectResolve;
    let connectReject;
    const onError = (err) => {
      this.ndkRelay.debug("Publish failed", err, event.id);
      this.ndkRelay.emit("publish:failed", event, err);
      event.emit("relay:publish:failed", this.ndkRelay, err);
      throw err;
    };
    const onFinally = () => {
      if (timeout) clearTimeout(timeout);
      this.ndkRelay.removeListener("connect", onConnectHandler);
    };
    if (this.ndkRelay.status >= 5) {
      return Promise.race([publishConnected(), timeoutPromise]).catch(onError).finally(onFinally);
    }
    if (this.ndkRelay.status <= 1) {
      console.warn("Relay is disconnected, trying to connect to publish an event", this.ndkRelay.url);
      this.ndkRelay.connect();
    } else {
      console.warn("Relay not connected, waiting for connection to publish an event", this.ndkRelay.url);
    }
    return Promise.race([
      new Promise((resolve, reject) => {
        connectResolve = resolve;
        connectReject = reject;
        this.ndkRelay.on("connect", onConnectHandler);
      }),
      timeoutPromise
    ]).catch(onError).finally(onFinally);
  }
  async publishEvent(event) {
    return this.ndkRelay.connectivity.publish(event.rawEvent());
  }
};
function filterFingerprint(filters, closeOnEose) {
  const elements = [];
  for (const filter of filters) {
    const keys = Object.entries(filter || {}).map(([key, values]) => {
      if (["since", "until"].includes(key)) {
        return `${key}:${values}`;
      }
      return key;
    }).sort().join("-");
    elements.push(keys);
  }
  let id = closeOnEose ? "+" : "";
  id += elements.join("|");
  return id;
}
function mergeFilters(filters) {
  const result = [];
  const lastResult = {};
  filters.filter((f) => !!f.limit).forEach((filterWithLimit) => result.push(filterWithLimit));
  filters = filters.filter((f) => !f.limit);
  if (filters.length === 0) return result;
  filters.forEach((filter) => {
    Object.entries(filter).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (lastResult[key] === void 0) {
          lastResult[key] = [...value];
        } else {
          lastResult[key] = Array.from(/* @__PURE__ */ new Set([...lastResult[key], ...value]));
        }
      } else {
        lastResult[key] = value;
      }
    });
  });
  return [...result, lastResult];
}
var NDKRelaySubscription = class {
  fingerprint;
  items = /* @__PURE__ */ new Map();
  topSubManager;
  debug;
  /**
   * Tracks the status of this REQ.
   */
  status = 0;
  onClose;
  relay;
  /**
   * Whether this subscription has reached EOSE.
   */
  eosed = false;
  /**
   * Timeout at which this subscription will
   * start executing.
   */
  executionTimer;
  /**
   * Track the time at which this subscription will fire.
   */
  fireTime;
  /**
   * The delay type that the current fireTime was calculated with.
   */
  delayType;
  /**
   * The filters that have been executed.
   */
  executeFilters;
  id = Math.random().toString(36).substring(7);
  /**
   *
   * @param fingerprint The fingerprint of this subscription.
   */
  constructor(relay, fingerprint, topSubManager) {
    this.relay = relay;
    this.topSubManager = topSubManager;
    this.debug = relay.debug.extend(`sub[${this.id}]`);
    this.fingerprint = fingerprint || Math.random().toString(36).substring(7);
  }
  _subId;
  get subId() {
    if (this._subId) return this._subId;
    this._subId = this.fingerprint.slice(0, 15);
    return this._subId;
  }
  subIdParts = /* @__PURE__ */ new Set();
  addSubIdPart(part) {
    this.subIdParts.add(part);
  }
  addItem(subscription, filters) {
    this.debug("Adding item", {
      filters,
      internalId: subscription.internalId,
      status: this.status,
      fingerprint: this.fingerprint,
      id: this.subId,
      items: this.items,
      itemsSize: this.items.size
    });
    if (this.items.has(subscription.internalId)) return;
    subscription.on("close", this.removeItem.bind(this, subscription));
    this.items.set(subscription.internalId, { subscription, filters });
    if (this.status !== 3) {
      if (subscription.subId && (!this._subId || this._subId.length < 48)) {
        if (this.status === 0 || this.status === 1) {
          this.addSubIdPart(subscription.subId);
        }
      }
    }
    switch (this.status) {
      case 0:
        this.evaluateExecutionPlan(subscription);
        break;
      case 3:
        break;
      case 1:
        this.evaluateExecutionPlan(subscription);
        break;
      case 4:
        this.debug("Subscription is closed, cannot add new items %o (%o)", subscription, filters);
        throw new Error("Cannot add new items to a closed subscription");
    }
  }
  /**
   * A subscription has been closed, remove it from the list of items.
   * @param subscription
   */
  removeItem(subscription) {
    this.items.delete(subscription.internalId);
    if (this.items.size === 0) {
      if (!this.eosed) return;
      this.close();
      this.cleanup();
    }
  }
  close() {
    if (this.status === 4) return;
    const prevStatus = this.status;
    this.status = 4;
    if (prevStatus === 3) {
      try {
        this.relay.close(this.subId);
      } catch (e) {
        this.debug("Error closing subscription", e, this);
      }
    } else {
      this.debug("Subscription wanted to close but it wasn't running, this is probably ok", {
        subId: this.subId,
        prevStatus,
        sub: this
      });
    }
    this.cleanup();
  }
  cleanup() {
    if (this.executionTimer) clearTimeout(this.executionTimer);
    this.relay.off("ready", this.executeOnRelayReady);
    this.relay.off("authed", this.reExecuteAfterAuth);
    if (this.onClose) this.onClose(this);
  }
  evaluateExecutionPlan(subscription) {
    if (!subscription.isGroupable()) {
      this.status = 1;
      this.execute();
      return;
    }
    if (subscription.filters.find((filter) => !!filter.limit)) {
      this.executeFilters = this.compileFilters();
      if (this.executeFilters.length >= 10) {
        this.status = 1;
        this.execute();
        return;
      }
    }
    const delay = subscription.groupableDelay;
    const delayType = subscription.groupableDelayType;
    if (!delay) throw new Error("Cannot group a subscription without a delay");
    if (this.status === 0) {
      this.schedule(delay, delayType);
    } else {
      const existingDelayType = this.delayType;
      const timeUntilFire = this.fireTime - Date.now();
      if (existingDelayType === "at-least" && delayType === "at-least") {
        if (timeUntilFire < delay) {
          if (this.executionTimer) clearTimeout(this.executionTimer);
          this.schedule(delay, delayType);
        }
      } else if (existingDelayType === "at-least" && delayType === "at-most") {
        if (timeUntilFire > delay) {
          if (this.executionTimer) clearTimeout(this.executionTimer);
          this.schedule(delay, delayType);
        }
      } else if (existingDelayType === "at-most" && delayType === "at-most") {
        if (timeUntilFire > delay) {
          if (this.executionTimer) clearTimeout(this.executionTimer);
          this.schedule(delay, delayType);
        }
      } else if (existingDelayType === "at-most" && delayType === "at-least") {
        if (timeUntilFire > delay) {
          if (this.executionTimer) clearTimeout(this.executionTimer);
          this.schedule(delay, delayType);
        }
      } else {
        throw new Error(`Unknown delay type combination ${existingDelayType} ${delayType}`);
      }
    }
  }
  schedule(delay, delayType) {
    this.status = 1;
    const currentTime = Date.now();
    this.fireTime = currentTime + delay;
    this.delayType = delayType;
    const timer = setTimeout(this.execute.bind(this), delay);
    if (delayType === "at-least") {
      this.executionTimer = timer;
    }
  }
  executeOnRelayReady = () => {
    if (this.status !== 2) return;
    if (this.items.size === 0) {
      this.debug("No items to execute; this relay was probably too slow to respond and the caller gave up", {
        status: this.status,
        fingerprint: this.fingerprint,
        items: this.items,
        itemsSize: this.items.size,
        id: this.id,
        subId: this.subId
      });
      this.cleanup();
      return;
    }
    this.debug("Executing on relay ready", {
      status: this.status,
      fingerprint: this.fingerprint,
      items: this.items,
      itemsSize: this.items.size
    });
    this.status = 1;
    this.execute();
  };
  finalizeSubId() {
    if (this.subIdParts.size > 0) {
      this._subId = Array.from(this.subIdParts).join("-");
    } else {
      this._subId = this.fingerprint.slice(0, 15);
    }
    this._subId += `-${Math.random().toString(36).substring(2, 7)}`;
  }
  // we do it this way so that we can remove the listener
  reExecuteAfterAuth = (() => {
    const oldSubId = this.subId;
    this.debug("Re-executing after auth", this.items.size);
    if (this.eosed) {
      this.relay.close(this.subId);
    } else {
      this.debug("We are abandoning an opened subscription, once it EOSE's, the handler will close it", {
        oldSubId
      });
    }
    this._subId = void 0;
    this.status = 1;
    this.execute();
    this.debug("Re-executed after auth %s \u{1F449} %s", oldSubId, this.subId);
  }).bind(this);
  execute() {
    if (this.status !== 1) {
      return;
    }
    if (!this.relay.connected) {
      this.status = 2;
      this.debug("Waiting for relay to be ready", {
        status: this.status,
        id: this.subId,
        fingerprint: this.fingerprint,
        items: this.items,
        itemsSize: this.items.size
      });
      this.relay.once("ready", this.executeOnRelayReady);
      return;
    }
    if (this.relay.status < 8) {
      this.relay.once("authed", this.reExecuteAfterAuth);
    }
    this.status = 3;
    this.finalizeSubId();
    this.executeFilters = this.compileFilters();
    this.relay.req(this);
  }
  onstart() {
  }
  onevent(event) {
    this.topSubManager.dispatchEvent(event, this.relay);
  }
  oneose(subId) {
    this.eosed = true;
    if (subId !== this.subId) {
      this.debug("Received EOSE for an abandoned subscription", subId, this.subId);
      this.relay.close(subId);
      return;
    }
    if (this.items.size === 0) {
      this.close();
    }
    for (const { subscription } of this.items.values()) {
      subscription.eoseReceived(this.relay);
      if (subscription.closeOnEose) {
        this.debug("Removing item because of EOSE", {
          filters: subscription.filters,
          internalId: subscription.internalId,
          status: this.status,
          fingerprint: this.fingerprint,
          items: this.items,
          itemsSize: this.items.size
        });
        this.removeItem(subscription);
      }
    }
  }
  onclose(_reason) {
    this.status = 4;
  }
  onclosed(reason) {
    if (!reason) return;
    for (const { subscription } of this.items.values()) {
      subscription.closedReceived(this.relay, reason);
    }
  }
  /**
   * Grabs the filters from all the subscriptions
   * and merges them into a single filter.
   */
  compileFilters() {
    const mergedFilters = [];
    const filters = Array.from(this.items.values()).map((item) => item.filters);
    if (!filters[0]) {
      this.debug("\u{1F440} No filters to merge", this.items);
      console.error("BUG: No filters to merge!", this.items);
      return [];
    }
    const filterCount = filters[0].length;
    for (let i2 = 0; i2 < filterCount; i2++) {
      const allFiltersAtIndex = filters.map((filter) => filter[i2]);
      mergedFilters.push(...mergeFilters(allFiltersAtIndex));
    }
    return mergedFilters;
  }
};
var NDKRelaySubscriptionManager = class {
  relay;
  subscriptions;
  generalSubManager;
  /**
   * @param relay - The relay instance.
   * @param generalSubManager - The subscription manager instance.
   */
  constructor(relay, generalSubManager) {
    this.relay = relay;
    this.subscriptions = /* @__PURE__ */ new Map();
    this.generalSubManager = generalSubManager;
  }
  /**
   * Adds a subscription to the manager.
   */
  addSubscription(sub, filters) {
    let relaySub;
    if (!sub.isGroupable()) {
      relaySub = this.createSubscription(sub, filters);
    } else {
      const filterFp = filterFingerprint(filters, sub.closeOnEose);
      if (filterFp) {
        const existingSubs = this.subscriptions.get(filterFp);
        relaySub = (existingSubs || []).find(
          (sub2) => sub2.status < 3
          /* RUNNING */
        );
      }
      relaySub ??= this.createSubscription(sub, filters, filterFp);
    }
    relaySub.addItem(sub, filters);
  }
  createSubscription(_sub, _filters, fingerprint) {
    const relaySub = new NDKRelaySubscription(this.relay, fingerprint || null, this.generalSubManager);
    relaySub.onClose = this.onRelaySubscriptionClose.bind(this);
    const currentVal = this.subscriptions.get(relaySub.fingerprint) ?? [];
    this.subscriptions.set(relaySub.fingerprint, [...currentVal, relaySub]);
    return relaySub;
  }
  onRelaySubscriptionClose(sub) {
    let currentVal = this.subscriptions.get(sub.fingerprint) ?? [];
    if (!currentVal) {
      console.warn("Unexpectedly did not find a subscription with fingerprint", sub.fingerprint);
    } else if (currentVal.length === 1) {
      this.subscriptions.delete(sub.fingerprint);
    } else {
      currentVal = currentVal.filter((s) => s.id !== sub.id);
      this.subscriptions.set(sub.fingerprint, currentVal);
    }
  }
};
var NDKRelay = class _NDKRelay extends import_tseep2.EventEmitter {
  url;
  scores;
  connectivity;
  subs;
  publisher;
  authPolicy;
  /**
   * The lowest validation ratio this relay can reach.
   */
  lowestValidationRatio;
  /**
   * Current validation ratio this relay is targeting.
   */
  targetValidationRatio;
  validationRatioFn;
  /**
   * This tracks events that have been seen by this relay
   * with a valid signature.
   */
  validatedEventCount = 0;
  /**
   * This tracks events that have been seen by this relay
   * but have not been validated.
   */
  nonValidatedEventCount = 0;
  /**
   * Whether this relay is trusted.
   *
   * Trusted relay's events do not get their signature verified.
   */
  trusted = false;
  complaining = false;
  debug;
  static defaultValidationRatioUpdateFn = (relay, validatedCount, _nonValidatedCount) => {
    if (relay.lowestValidationRatio === void 0 || relay.targetValidationRatio === void 0) return 1;
    let newRatio = relay.validationRatio;
    if (relay.validationRatio > relay.targetValidationRatio) {
      const factor = validatedCount / 100;
      newRatio = Math.max(relay.lowestValidationRatio, relay.validationRatio - factor);
    }
    if (newRatio < relay.validationRatio) {
      return newRatio;
    }
    return relay.validationRatio;
  };
  constructor(url, authPolicy, ndk2) {
    super();
    this.url = normalizeRelayUrl(url);
    this.scores = /* @__PURE__ */ new Map();
    this.debug = (0, import_debug2.default)(`ndk:relay:${url}`);
    this.connectivity = new NDKRelayConnectivity(this, ndk2);
    this.connectivity.netDebug = ndk2?.netDebug;
    this.req = this.connectivity.req.bind(this.connectivity);
    this.close = this.connectivity.close.bind(this.connectivity);
    this.subs = new NDKRelaySubscriptionManager(this, ndk2.subManager);
    this.publisher = new NDKRelayPublisher(this);
    this.authPolicy = authPolicy;
    this.targetValidationRatio = ndk2?.initialValidationRatio;
    this.lowestValidationRatio = ndk2?.lowestValidationRatio;
    this.validationRatioFn = (ndk2?.validationRatioFn ?? _NDKRelay.defaultValidationRatioUpdateFn).bind(this);
    this.updateValidationRatio();
    if (!ndk2) {
      console.trace("relay created without ndk");
    }
  }
  updateValidationRatio() {
    if (this.validationRatioFn && this.validatedEventCount > 0) {
      const newRatio = this.validationRatioFn(this, this.validatedEventCount, this.nonValidatedEventCount);
      this.targetValidationRatio = newRatio;
    }
    setTimeout(() => {
      this.updateValidationRatio();
    }, 3e4);
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
  async connect(timeoutMs, reconnect = true) {
    return this.connectivity.connect(timeoutMs, reconnect);
  }
  /**
   * Disconnects from the relay.
   */
  disconnect() {
    if (this.status === 1) {
      return;
    }
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
    this.subs.addSubscription(subscription, filters);
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
  referenceTags() {
    return [["r", this.url]];
  }
  addValidatedEvent() {
    this.validatedEventCount++;
  }
  addNonValidatedEvent() {
    this.nonValidatedEventCount++;
  }
  /**
   * The current validation ratio this relay has achieved.
   */
  get validationRatio() {
    if (this.nonValidatedEventCount === 0) {
      return 1;
    }
    return this.validatedEventCount / (this.validatedEventCount + this.nonValidatedEventCount);
  }
  shouldValidateEvent() {
    if (this.trusted) {
      return false;
    }
    if (this.targetValidationRatio === void 0) {
      return true;
    }
    if (this.targetValidationRatio >= 1) return true;
    return Math.random() < this.targetValidationRatio;
  }
  get connected() {
    return this.connectivity.connected;
  }
  req;
  close;
};
var NDKPublishError = class extends Error {
  errors;
  publishedToRelays;
  /**
   * Intended relay set where the publishing was intended to happen.
   */
  intendedRelaySet;
  constructor(message, errors, publishedToRelays, intendedRelaySet) {
    super(message);
    this.errors = errors;
    this.publishedToRelays = publishedToRelays;
    this.intendedRelaySet = intendedRelaySet;
  }
  get relayErrors() {
    const errors = [];
    for (const [relay, err] of this.errors) {
      errors.push(`${relay.url}: ${err}`);
    }
    return errors.join("\n");
  }
};
var NDKRelaySet = class _NDKRelaySet {
  relays;
  debug;
  ndk;
  pool;
  constructor(relays, ndk2, pool) {
    this.relays = relays;
    this.ndk = ndk2;
    this.pool = pool ?? ndk2.pool;
    this.debug = ndk2.debug.extend("relayset");
  }
  /**
   * Adds a relay to this set.
   */
  addRelay(relay) {
    this.relays.add(relay);
  }
  get relayUrls() {
    return Array.from(this.relays).map((r) => r.url);
  }
  /**
   * Creates a relay set from a list of relay URLs.
   *
   * If no connection to the relay is found in the pool it will temporarily
   * connect to it.
   *
   * @param relayUrls - list of relay URLs to include in this set
   * @param ndk
   * @param connect - whether to connect to the relay immediately if it was already in the pool but not connected
   * @returns NDKRelaySet
   */
  static fromRelayUrls(relayUrls, ndk2, connect = true, pool) {
    pool = pool ?? ndk2.pool;
    if (!pool) throw new Error("No pool provided");
    const relays = /* @__PURE__ */ new Set();
    for (const url of relayUrls) {
      const relay = pool.relays.get(normalizeRelayUrl(url));
      if (relay) {
        if (relay.status < 5 && connect) {
          relay.connect();
        }
        relays.add(relay);
      } else {
        const temporaryRelay = new NDKRelay(normalizeRelayUrl(url), ndk2?.relayAuthDefaultPolicy, ndk2);
        pool.useTemporaryRelay(temporaryRelay, void 0, `requested from fromRelayUrls ${relayUrls}`);
        relays.add(temporaryRelay);
      }
    }
    return new _NDKRelaySet(new Set(relays), ndk2, pool);
  }
  /**
   * Publish an event to all relays in this relay set.
   *
   * This method implements a robust mechanism for publishing events to multiple relays with
   * built-in handling for race conditions, timeouts, and partial failures. The implementation
   * uses a dual-tracking mechanism to ensure accurate reporting of which relays successfully
   * received an event.
   *
   * Key aspects of this implementation:
   *
   * 1. DUAL-TRACKING MECHANISM:
   *    - Promise-based tracking: Records successes/failures from the promises returned by relay.publish()
   *    - Event-based tracking: Listens for 'relay:published' events that indicate successful publishing
   *    This approach ensures we don't miss successful publishes even if there are subsequent errors in
   *    the promise chain.
   *
   * 2. RACE CONDITION HANDLING:
   *    - If a relay emits a success event but later fails in the promise chain, we still count it as a success
   *    - If a relay times out after successfully publishing, we still count it as a success
   *    - All relay operations happen in parallel, with proper tracking regardless of completion order
   *
   * 3. TIMEOUT MANAGEMENT:
   *    - Individual timeouts for each relay operation
   *    - Proper cleanup of timeouts to prevent memory leaks
   *    - Clear timeout error reporting
   *
   * 4. ERROR HANDLING:
   *    - Detailed tracking of specific errors for each failed relay
   *    - Special handling for ephemeral events (which don't expect acknowledgement)
   *    - RequiredRelayCount parameter to control the minimum success threshold
   *
   * @param event Event to publish
   * @param timeoutMs Timeout in milliseconds for each relay publish operation
   * @param requiredRelayCount The minimum number of relays we expect the event to be published to
   * @returns A set of relays the event was published to
   * @throws {NDKPublishError} If the event could not be published to at least `requiredRelayCount` relays
   * @example
   * ```typescript
   * const relaySet = new NDKRelaySet(new Set([relay1, relay2]), ndk);
   * const publishedToRelays = await relaySet.publish(event);
   * // publishedToRelays can contain relay1, relay2, both, or none
   * // depending on which relays the event was successfully published to
   * if (publishedToRelays.size > 0) {
   *   console.log("Event published to at least one relay");
   * }
   * ```
   */
  async publish(event, timeoutMs, requiredRelayCount = 1) {
    const publishedToRelays = /* @__PURE__ */ new Set();
    const errors = /* @__PURE__ */ new Map();
    const isEphemeral2 = event.isEphemeral();
    event.publishStatus = "pending";
    const relayPublishedHandler = (relay) => {
      publishedToRelays.add(relay);
    };
    event.on("relay:published", relayPublishedHandler);
    try {
      const promises = Array.from(this.relays).map((relay) => {
        return new Promise((resolve) => {
          const timeoutId = timeoutMs ? setTimeout(() => {
            if (!publishedToRelays.has(relay)) {
              errors.set(relay, new Error(`Publish timeout after ${timeoutMs}ms`));
              resolve(false);
            }
          }, timeoutMs) : null;
          relay.publish(event, timeoutMs).then((success) => {
            if (timeoutId) clearTimeout(timeoutId);
            if (success) {
              publishedToRelays.add(relay);
              resolve(true);
            } else {
              resolve(false);
            }
          }).catch((err) => {
            if (timeoutId) clearTimeout(timeoutId);
            if (!isEphemeral2) {
              errors.set(relay, err);
            }
            resolve(false);
          });
        });
      });
      await Promise.all(promises);
      if (publishedToRelays.size < requiredRelayCount) {
        if (!isEphemeral2) {
          const error = new NDKPublishError(
            "Not enough relays received the event (" + publishedToRelays.size + " published, " + requiredRelayCount + " required)",
            errors,
            publishedToRelays,
            this
          );
          event.publishStatus = "error";
          event.publishError = error;
          this.ndk?.emit("event:publish-failed", event, error, this.relayUrls);
          throw error;
        }
      } else {
        event.publishStatus = "success";
        event.emit("published", { relaySet: this, publishedToRelays });
      }
      return publishedToRelays;
    } finally {
      event.off("relay:published", relayPublishedHandler);
    }
  }
  get size() {
    return this.relays.size;
  }
};
var d = (0, import_debug.default)("ndk:outbox:calculate");
async function calculateRelaySetFromEvent(ndk2, event, requiredRelayCount) {
  const relays = /* @__PURE__ */ new Set();
  const authorWriteRelays = await getWriteRelaysFor(ndk2, event.pubkey);
  if (authorWriteRelays) {
    authorWriteRelays.forEach((relayUrl) => {
      const relay = ndk2.pool?.getRelay(relayUrl);
      if (relay) relays.add(relay);
    });
  }
  let relayHints = event.tags.filter((tag2) => ["a", "e"].includes(tag2[0])).map((tag2) => tag2[2]).filter((url) => url?.startsWith("wss://")).filter((url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }).map((url) => normalizeRelayUrl(url));
  relayHints = Array.from(new Set(relayHints)).slice(0, 5);
  relayHints.forEach((relayUrl) => {
    const relay = ndk2.pool?.getRelay(relayUrl, true, true);
    if (relay) {
      d("Adding relay hint %s", relayUrl);
      relays.add(relay);
    }
  });
  const pTags = event.getMatchingTags("p").map((tag2) => tag2[1]);
  if (pTags.length < 5) {
    const pTaggedRelays = Array.from(
      chooseRelayCombinationForPubkeys(ndk2, pTags, "read", {
        preferredRelays: new Set(authorWriteRelays)
      }).keys()
    );
    pTaggedRelays.forEach((relayUrl) => {
      const relay = ndk2.pool?.getRelay(relayUrl, false, true);
      if (relay) {
        d("Adding p-tagged relay %s", relayUrl);
        relays.add(relay);
      }
    });
  } else {
    d("Too many p-tags to consider %d", pTags.length);
  }
  ndk2.pool?.permanentAndConnectedRelays().forEach((relay) => relays.add(relay));
  if (requiredRelayCount && relays.size < requiredRelayCount) {
    const explicitRelays = ndk2.explicitRelayUrls?.filter((url) => !Array.from(relays).some((r) => r.url === url)).slice(0, requiredRelayCount - relays.size);
    explicitRelays?.forEach((url) => {
      const relay = ndk2.pool?.getRelay(url, false, true);
      if (relay) {
        d("Adding explicit relay %s", url);
        relays.add(relay);
      }
    });
  }
  return new NDKRelaySet(relays, ndk2);
}
function calculateRelaySetsFromFilter(ndk2, filters, pool) {
  const result = /* @__PURE__ */ new Map();
  const authors = /* @__PURE__ */ new Set();
  filters.forEach((filter) => {
    if (filter.authors) {
      filter.authors.forEach((author) => authors.add(author));
    }
  });
  if (authors.size > 0) {
    const authorToRelaysMap = getRelaysForFilterWithAuthors(ndk2, Array.from(authors));
    for (const relayUrl of authorToRelaysMap.keys()) {
      result.set(relayUrl, []);
    }
    for (const filter of filters) {
      if (filter.authors) {
        for (const [relayUrl, authors2] of authorToRelaysMap.entries()) {
          const authorFilterAndRelayPubkeyIntersection = filter.authors.filter(
            (author) => authors2.includes(author)
          );
          result.set(relayUrl, [
            ...result.get(relayUrl),
            {
              ...filter,
              // Overwrite authors sent to this relay with the authors that were
              // present in the filter and are also present in the relay
              authors: authorFilterAndRelayPubkeyIntersection
            }
          ]);
        }
      } else {
        for (const relayUrl of authorToRelaysMap.keys()) {
          result.set(relayUrl, [...result.get(relayUrl), filter]);
        }
      }
    }
  } else {
    if (ndk2.explicitRelayUrls) {
      ndk2.explicitRelayUrls.forEach((relayUrl) => {
        result.set(relayUrl, filters);
      });
    }
  }
  if (result.size === 0) {
    pool.permanentAndConnectedRelays().slice(0, 5).forEach((relay) => {
      result.set(relay.url, filters);
    });
  }
  return result;
}
function calculateRelaySetsFromFilters(ndk2, filters, pool) {
  const a = calculateRelaySetsFromFilter(ndk2, filters, pool);
  return a;
}
function mergeTags(tags1, tags2) {
  const tagMap = /* @__PURE__ */ new Map();
  const generateKey = (tag2) => tag2.join(",");
  const isContained = (smaller, larger) => {
    return smaller.every((value, index) => value === larger[index]);
  };
  const processTag = (tag2) => {
    for (const [key, existingTag] of tagMap) {
      if (isContained(existingTag, tag2) || isContained(tag2, existingTag)) {
        if (tag2.length >= existingTag.length) {
          tagMap.set(key, tag2);
        }
        return;
      }
    }
    tagMap.set(generateKey(tag2), tag2);
  };
  tags1.concat(tags2).forEach(processTag);
  return Array.from(tagMap.values());
}
var hashtagRegex = /(?<=\s|^)(#[^\s!@#$%^&*()=+./,[{\]};:'"?><]+)/g;
function generateHashtags(content) {
  const hashtags = content.match(hashtagRegex);
  const tagIds = /* @__PURE__ */ new Set();
  const tag2 = /* @__PURE__ */ new Set();
  if (hashtags) {
    for (const hashtag of hashtags) {
      if (tagIds.has(hashtag.slice(1))) continue;
      tag2.add(hashtag.slice(1));
      tagIds.add(hashtag.slice(1));
    }
  }
  return Array.from(tag2);
}
async function generateContentTags(content, tags = [], opts, ctx) {
  if (opts?.skipContentTagging) {
    return { content, tags };
  }
  const tagRegex = /(@|nostr:)(npub|nprofile|note|nevent|naddr)[a-zA-Z0-9]+/g;
  const promises = [];
  const addTagIfNew = (t) => {
    if (!tags.find((t2) => ["q", t[0]].includes(t2[0]) && t2[1] === t[1])) {
      tags.push(t);
    }
  };
  content = content.replace(tagRegex, (tag2) => {
    try {
      const entity = tag2.split(/(@|nostr:)/)[2];
      const { type, data } = nip19_exports.decode(entity);
      let t;
      if (opts?.filters) {
        const shouldInclude = !opts.filters.includeTypes || opts.filters.includeTypes.includes(type);
        const shouldExclude = opts.filters.excludeTypes?.includes(type);
        if (!shouldInclude || shouldExclude) {
          return tag2;
        }
      }
      switch (type) {
        case "npub":
          if (opts?.pTags !== false) {
            t = ["p", data];
          }
          break;
        case "nprofile":
          if (opts?.pTags !== false) {
            t = ["p", data.pubkey];
          }
          break;
        case "note":
          promises.push(
            new Promise(async (resolve) => {
              const relay = await maybeGetEventRelayUrl(entity);
              addTagIfNew(["q", data, relay]);
              resolve();
            })
          );
          break;
        case "nevent":
          promises.push(
            new Promise(async (resolve) => {
              const { id, author } = data;
              let { relays } = data;
              if (!relays || relays.length === 0) {
                relays = [await maybeGetEventRelayUrl(entity)];
              }
              addTagIfNew(["q", id, relays[0]]);
              if (author && opts?.pTags !== false && opts?.pTagOnQTags !== false)
                addTagIfNew(["p", author]);
              resolve();
            })
          );
          break;
        case "naddr":
          promises.push(
            new Promise(async (resolve) => {
              const id = [data.kind, data.pubkey, data.identifier].join(":");
              let relays = data.relays ?? [];
              if (relays.length === 0) {
                relays = [await maybeGetEventRelayUrl(entity)];
              }
              addTagIfNew(["q", id, relays[0]]);
              if (opts?.pTags !== false && opts?.pTagOnQTags !== false && opts?.pTagOnATags !== false)
                addTagIfNew(["p", data.pubkey]);
              resolve();
            })
          );
          break;
        default:
          return tag2;
      }
      if (t) addTagIfNew(t);
      return `nostr:${entity}`;
    } catch (_error) {
      return tag2;
    }
  });
  await Promise.all(promises);
  if (!opts?.filters?.excludeTypes?.includes("hashtag")) {
    const newTags = generateHashtags(content).map((hashtag) => ["t", hashtag]);
    tags = mergeTags(tags, newTags);
  }
  if (opts?.pTags !== false && opts?.copyPTagsFromTarget && ctx) {
    const pTags = ctx.getMatchingTags("p");
    for (const pTag of pTags) {
      if (!tags.find((t) => t[0] === "p" && t[1] === pTag[1])) {
        tags.push(pTag);
      }
    }
  }
  return { content, tags };
}
async function maybeGetEventRelayUrl(_nip19Id) {
  return "";
}
async function encrypt3(recipient, signer, scheme = "nip44") {
  let encrypted;
  if (!this.ndk) throw new Error("No NDK instance found!");
  let currentSigner = signer;
  if (!currentSigner) {
    this.ndk.assertSigner();
    currentSigner = this.ndk.signer;
  }
  if (!currentSigner) throw new Error("no NDK signer");
  const currentRecipient = recipient || (() => {
    const pTags = this.getMatchingTags("p");
    if (pTags.length !== 1) {
      throw new Error("No recipient could be determined and no explicit recipient was provided");
    }
    return this.ndk.getUser({ pubkey: pTags[0][1] });
  })();
  if (scheme === "nip44" && await isEncryptionEnabled(currentSigner, "nip44")) {
    encrypted = await currentSigner.encrypt(currentRecipient, this.content, "nip44");
  }
  if ((!encrypted || scheme === "nip04") && await isEncryptionEnabled(currentSigner, "nip04")) {
    encrypted = await currentSigner.encrypt(currentRecipient, this.content, "nip04");
  }
  if (!encrypted) throw new Error("Failed to encrypt event.");
  this.content = encrypted;
}
async function decrypt3(sender, signer, scheme) {
  if (this.ndk?.cacheAdapter?.getDecryptedEvent) {
    let cachedEvent = null;
    if (typeof this.ndk.cacheAdapter.getDecryptedEvent === "function") {
      cachedEvent = this.ndk.cacheAdapter.getDecryptedEvent(this.id);
    }
    if (cachedEvent) {
      this.content = cachedEvent.content;
      return;
    }
  }
  let decrypted;
  if (!this.ndk) throw new Error("No NDK instance found!");
  let currentSigner = signer;
  if (!currentSigner) {
    this.ndk.assertSigner();
    currentSigner = this.ndk.signer;
  }
  if (!currentSigner) throw new Error("no NDK signer");
  const currentSender = sender || this.author;
  if (!currentSender) throw new Error("No sender provided and no author available");
  const currentScheme = scheme || (this.content.match(/\\?iv=/) ? "nip04" : "nip44");
  if ((currentScheme === "nip04" || this.kind === 4) && await isEncryptionEnabled(currentSigner, "nip04") && this.content.search("\\?iv=")) {
    decrypted = await currentSigner.decrypt(currentSender, this.content, "nip04");
  }
  if (!decrypted && currentScheme === "nip44" && await isEncryptionEnabled(currentSigner, "nip44")) {
    decrypted = await currentSigner.decrypt(currentSender, this.content, "nip44");
  }
  if (!decrypted) throw new Error("Failed to decrypt event.");
  this.content = decrypted;
  if (this.ndk?.cacheAdapter?.addDecryptedEvent) {
    this.ndk.cacheAdapter.addDecryptedEvent(this);
  }
}
async function isEncryptionEnabled(signer, scheme) {
  if (!signer.encryptionEnabled) return false;
  if (!scheme) return true;
  return Boolean(await signer.encryptionEnabled(scheme));
}
function eventHasETagMarkers(event) {
  for (const tag2 of event.tags) {
    if (tag2[0] === "e" && (tag2[3] ?? "").length > 0) return true;
  }
  return false;
}
function getRootTag(event, searchTag) {
  searchTag ??= event.tagType();
  const rootEventTag = event.tags.find(isTagRootTag);
  if (!rootEventTag) {
    if (eventHasETagMarkers(event)) return;
    const matchingTags = event.getMatchingTags(searchTag);
    if (matchingTags.length < 3) return matchingTags[0];
  }
  return rootEventTag;
}
var nip22RootTags = /* @__PURE__ */ new Set(["A", "E", "I"]);
var nip22ReplyTags = /* @__PURE__ */ new Set(["a", "e", "i"]);
function getReplyTag(event, searchTag) {
  if (event.kind === 1111) {
    let replyTag2;
    for (const tag2 of event.tags) {
      if (nip22RootTags.has(tag2[0])) replyTag2 = tag2;
      else if (nip22ReplyTags.has(tag2[0])) {
        replyTag2 = tag2;
        break;
      }
    }
    return replyTag2;
  }
  searchTag ??= event.tagType();
  let hasMarkers2 = false;
  let replyTag;
  for (const tag2 of event.tags) {
    if (tag2[0] !== searchTag) continue;
    if ((tag2[3] ?? "").length > 0) hasMarkers2 = true;
    if (hasMarkers2 && tag2[3] === "reply") return tag2;
    if (hasMarkers2 && tag2[3] === "root") replyTag = tag2;
    if (!hasMarkers2) replyTag = tag2;
  }
  return replyTag;
}
function isTagRootTag(tag2) {
  return tag2[0] === "E" || tag2[3] === "root";
}
async function fetchTaggedEvent(tag2, marker) {
  if (!this.ndk) throw new Error("NDK instance not found");
  const t = this.getMatchingTags(tag2, marker);
  if (t.length === 0) return void 0;
  const [_, id, hint] = t[0];
  let relay = hint !== "" ? this.ndk.pool.getRelay(hint) : void 0;
  const event = await this.ndk.fetchEvent(id, {}, relay);
  return event;
}
async function fetchRootEvent(subOpts) {
  if (!this.ndk) throw new Error("NDK instance not found");
  const rootTag = getRootTag(this);
  if (!rootTag) return void 0;
  return this.ndk.fetchEventFromTag(rootTag, this, subOpts);
}
async function fetchReplyEvent(subOpts) {
  if (!this.ndk) throw new Error("NDK instance not found");
  const replyTag = getReplyTag(this);
  if (!replyTag) return void 0;
  return this.ndk.fetchEventFromTag(replyTag, this, subOpts);
}
function isReplaceable() {
  if (this.kind === void 0) throw new Error("Kind not set");
  return [0, 3].includes(this.kind) || this.kind >= 1e4 && this.kind < 2e4 || this.kind >= 3e4 && this.kind < 4e4;
}
function isEphemeral() {
  if (this.kind === void 0) throw new Error("Kind not set");
  return this.kind >= 2e4 && this.kind < 3e4;
}
function isParamReplaceable() {
  if (this.kind === void 0) throw new Error("Kind not set");
  return this.kind >= 3e4 && this.kind < 4e4;
}
var DEFAULT_RELAY_COUNT = 2;
function encode(maxRelayCount = DEFAULT_RELAY_COUNT) {
  let relays = [];
  if (this.onRelays.length > 0) {
    relays = this.onRelays.map((relay) => relay.url);
  } else if (this.relay) {
    relays = [this.relay.url];
  }
  if (relays.length > maxRelayCount) {
    relays = relays.slice(0, maxRelayCount);
  }
  if (this.isParamReplaceable()) {
    return nip19_exports.naddrEncode({
      kind: this.kind,
      pubkey: this.pubkey,
      identifier: this.replaceableDTag(),
      relays
    });
  }
  if (relays.length > 0) {
    return nip19_exports.neventEncode({
      id: this.tagId(),
      relays,
      author: this.pubkey
    });
  }
  return nip19_exports.noteEncode(this.tagId());
}
async function repost(publish = true, signer) {
  if (!signer && publish) {
    if (!this.ndk) throw new Error("No NDK instance found");
    this.ndk.assertSigner();
    signer = this.ndk.signer;
  }
  const e = new NDKEvent(this.ndk, {
    kind: getKind(this)
  });
  if (!this.isProtected) e.content = JSON.stringify(this.rawEvent());
  e.tag(this);
  if (this.kind !== 1) {
    e.tags.push(["k", `${this.kind}`]);
  }
  if (signer) await e.sign(signer);
  if (publish) await e.publish();
  return e;
}
function getKind(event) {
  if (event.kind === 1) {
    return 6;
  }
  return 16;
}
function serialize(includeSig = false, includeId = false) {
  const payload = [0, this.pubkey, this.created_at, this.kind, this.tags, this.content];
  if (includeSig) payload.push(this.sig);
  if (includeId) payload.push(this.id);
  return JSON.stringify(payload);
}
function deserialize(serializedEvent) {
  const eventArray = JSON.parse(serializedEvent);
  const ret = {
    pubkey: eventArray[1],
    created_at: eventArray[2],
    kind: eventArray[3],
    tags: eventArray[4],
    content: eventArray[5]
  };
  if (eventArray.length >= 7) {
    const first = eventArray[6];
    const second = eventArray[7];
    if (first && first.length === 128) {
      ret.sig = first;
      if (second && second.length === 64) {
        ret.id = second;
      }
    } else if (first && first.length === 64) {
      ret.id = first;
      if (second && second.length === 128) {
        ret.sig = second;
      }
    }
  }
  return ret;
}
var worker;
var processingQueue = {};
function signatureVerificationInit(w) {
  worker = w;
  worker.onmessage = (msg) => {
    const [eventId, result] = msg.data;
    const record = processingQueue[eventId];
    if (!record) {
      console.error("No record found for event", eventId);
      return;
    }
    delete processingQueue[eventId];
    for (const resolve of record.resolves) {
      resolve(result);
    }
  };
}
async function verifySignatureAsync(event, _persist, relay) {
  const ndkInstance = event.ndk;
  const start = Date.now();
  let result;
  if (ndkInstance.signatureVerificationFunction) {
    console.log("[NDK-CORE] Using custom signature verification function async");
    result = await ndkInstance.signatureVerificationFunction(event);
    console.log("Custom signature verification result", event.id, { result });
  } else {
    console.log("Using worker-based signature verification async");
    result = await new Promise((resolve) => {
      const serialized = event.serialize();
      let enqueue = false;
      if (!processingQueue[event.id]) {
        processingQueue[event.id] = { event, resolves: [], relay };
        enqueue = true;
      }
      processingQueue[event.id].resolves.push(resolve);
      if (!enqueue) return;
      worker?.postMessage({
        serialized,
        id: event.id,
        sig: event.sig,
        pubkey: event.pubkey
      });
    });
  }
  ndkInstance.signatureVerificationTimeMs += Date.now() - start;
  return result;
}
var PUBKEY_REGEX = /^[a-f0-9]{64}$/;
function validate() {
  if (typeof this.kind !== "number") return false;
  if (typeof this.content !== "string") return false;
  if (typeof this.created_at !== "number") return false;
  if (typeof this.pubkey !== "string") return false;
  if (!this.pubkey.match(PUBKEY_REGEX)) return false;
  if (!Array.isArray(this.tags)) return false;
  for (let i2 = 0; i2 < this.tags.length; i2++) {
    const tag2 = this.tags[i2];
    if (!Array.isArray(tag2)) return false;
    for (let j = 0; j < tag2.length; j++) {
      if (typeof tag2[j] === "object") return false;
    }
  }
  return true;
}
var verifiedSignatures = new import_typescript_lru_cache.LRUCache({
  maxSize: 1e3,
  entryExpirationTimeInMS: 6e4
});
function verifySignature(persist) {
  if (typeof this.signatureVerified === "boolean") return this.signatureVerified;
  const prevVerification = verifiedSignatures.get(this.id);
  if (prevVerification !== null) {
    this.signatureVerified = !!prevVerification;
    return this.signatureVerified;
  }
  try {
    if (this.ndk?.asyncSigVerification) {
      verifySignatureAsync(this, persist, this.relay).then((result) => {
        if (persist) {
          this.signatureVerified = result;
          if (result) verifiedSignatures.set(this.id, this.sig);
        }
        if (!result) {
          if (this.relay) {
            this.ndk?.reportInvalidSignature(this, this.relay);
          } else {
            this.ndk?.reportInvalidSignature(this);
          }
          verifiedSignatures.set(this.id, false);
        }
      }).catch((err) => {
        console.error("signature verification error", this.id, err);
      });
    } else {
      const hash = sha2564(new TextEncoder().encode(this.serialize()));
      const res = schnorr2.verify(this.sig, hash, this.pubkey);
      if (res) verifiedSignatures.set(this.id, this.sig);
      else verifiedSignatures.set(this.id, false);
      this.signatureVerified = res;
      return res;
    }
  } catch (_err) {
    this.signatureVerified = false;
    return false;
  }
}
function getEventHash2() {
  return getEventHashFromSerializedEvent(this.serialize());
}
function getEventHashFromSerializedEvent(serializedEvent) {
  const eventHash = sha2564(new TextEncoder().encode(serializedEvent));
  return bytesToHex4(eventHash);
}
var skipClientTagOnKinds = /* @__PURE__ */ new Set([
  0,
  4,
  1059,
  13,
  3,
  9734,
  5
  /* EventDeletion */
]);
var NDKEvent = class _NDKEvent extends import_tseep.EventEmitter {
  ndk;
  created_at;
  content = "";
  tags = [];
  kind;
  id = "";
  sig;
  pubkey = "";
  signatureVerified;
  _author = void 0;
  /**
   * The relay that this event was first received from.
   */
  relay;
  /**
   * The relays that this event was received from and/or successfully published to.
   */
  get onRelays() {
    let res = [];
    if (!this.ndk) {
      if (this.relay) res.push(this.relay);
    } else {
      res = this.ndk.subManager.seenEvents.get(this.id) || [];
    }
    return res;
  }
  /**
   * The status of the publish operation.
   */
  publishStatus = "success";
  publishError;
  constructor(ndk2, event) {
    super();
    this.ndk = ndk2;
    this.created_at = event?.created_at;
    this.content = event?.content || "";
    this.tags = event?.tags || [];
    this.id = event?.id || "";
    this.sig = event?.sig;
    this.pubkey = event?.pubkey || "";
    this.kind = event?.kind;
    if (event instanceof _NDKEvent) {
      if (this.relay) {
        this.relay = event.relay;
        this.ndk?.subManager.seenEvent(event.id, this.relay);
      }
      this.publishStatus = event.publishStatus;
      this.publishError = event.publishError;
    }
  }
  /**
   * Deserialize an NDKEvent from a serialized payload.
   * @param ndk
   * @param event
   * @returns
   */
  static deserialize(ndk2, event) {
    return new _NDKEvent(ndk2, deserialize(event));
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
    this.pubkey = user.pubkey;
    this._author = user;
    this._author.ndk ??= this.ndk;
  }
  /**
   * Returns an NDKUser for the author of the event.
   */
  get author() {
    if (this._author) return this._author;
    if (!this.ndk) throw new Error("No NDK instance found");
    const user = this.ndk.getUser({ pubkey: this.pubkey });
    this._author = user;
    return user;
  }
  /**
   * NIP-73 tagging of external entities
   * @param entity to be tagged
   * @param type of the entity
   * @param markerUrl to be used as the marker URL
   *
   * @example
   * ```typescript
   * event.tagExternal("https://example.com/article/123#nostr", "url");
   * event.tags => [["i", "https://example.com/123"], ["k", "https://example.com"]]
   * ```
   *
   * @example tag a podcast:item:guid
   * ```typescript
   * event.tagExternal("e32b4890-b9ea-4aef-a0bf-54b787833dc5", "podcast:item:guid");
   * event.tags => [["i", "podcast:item:guid:e32b4890-b9ea-4aef-a0bf-54b787833dc5"], ["k", "podcast:item:guid"]]
   * ```
   *
   * @see https://github.com/nostr-protocol/nips/blob/master/73.md
   */
  tagExternal(entity, type, markerUrl) {
    const iTag = ["i"];
    const kTag = ["k"];
    switch (type) {
      case "url": {
        const url = new URL(entity);
        url.hash = "";
        iTag.push(url.toString());
        kTag.push(`${url.protocol}//${url.host}`);
        break;
      }
      case "hashtag":
        iTag.push(`#${entity.toLowerCase()}`);
        kTag.push("#");
        break;
      case "geohash":
        iTag.push(`geo:${entity.toLowerCase()}`);
        kTag.push("geo");
        break;
      case "isbn":
        iTag.push(`isbn:${entity.replace(/-/g, "")}`);
        kTag.push("isbn");
        break;
      case "podcast:guid":
        iTag.push(`podcast:guid:${entity}`);
        kTag.push("podcast:guid");
        break;
      case "podcast:item:guid":
        iTag.push(`podcast:item:guid:${entity}`);
        kTag.push("podcast:item:guid");
        break;
      case "podcast:publisher:guid":
        iTag.push(`podcast:publisher:guid:${entity}`);
        kTag.push("podcast:publisher:guid");
        break;
      case "isan":
        iTag.push(`isan:${entity.split("-").slice(0, 4).join("-")}`);
        kTag.push("isan");
        break;
      case "doi":
        iTag.push(`doi:${entity.toLowerCase()}`);
        kTag.push("doi");
        break;
      default:
        throw new Error(`Unsupported NIP-73 entity type: ${type}`);
    }
    if (markerUrl) {
      iTag.push(markerUrl);
    }
    this.tags.push(iTag);
    this.tags.push(kTag);
  }
  /**
   * Tag a user with an optional marker.
   * @param target What is to be tagged. Can be an NDKUser, NDKEvent, or an NDKTag.
   * @param marker The marker to use in the tag.
   * @param skipAuthorTag Whether to explicitly skip adding the author tag of the event.
   * @param forceTag Force a specific tag to be used instead of the default "e" or "a" tag.
   * @param opts Optional content tagging options to control p tag behavior.
   * @example
   * ```typescript
   * reply.tag(opEvent, "reply");
   * // reply.tags => [["e", <id>, <relay>, "reply"]]
   * ```
   */
  tag(target, marker, skipAuthorTag, forceTag, opts) {
    let tags = [];
    const isNDKUser = target.fetchProfile !== void 0;
    if (isNDKUser) {
      forceTag ??= "p";
      if (forceTag === "p" && opts?.pTags === false) {
        return;
      }
      const tag2 = [forceTag, target.pubkey];
      if (marker) tag2.push(...["", marker]);
      tags.push(tag2);
    } else if (target instanceof _NDKEvent) {
      const event = target;
      skipAuthorTag ??= event?.pubkey === this.pubkey;
      tags = event.referenceTags(marker, skipAuthorTag, forceTag, opts);
      if (opts?.pTags !== false) {
        for (const pTag of event.getMatchingTags("p")) {
          if (pTag[1] === this.pubkey) continue;
          if (this.tags.find((t) => t[0] === "p" && t[1] === pTag[1])) continue;
          this.tags.push(["p", pTag[1]]);
        }
      }
    } else if (Array.isArray(target)) {
      tags = [target];
    } else {
      throw new Error("Invalid argument", target);
    }
    this.tags = mergeTags(this.tags, tags);
  }
  /**
   * Return a NostrEvent object, trying to fill in missing fields
   * when possible, adding tags when necessary.
   * @param pubkey {string} The pubkey of the user who the event belongs to.
   * @param opts {ContentTaggingOptions} Options for content tagging.
   * @returns {Promise<NostrEvent>} A promise that resolves to a NostrEvent.
   */
  async toNostrEvent(pubkey, opts) {
    if (!pubkey && this.pubkey === "") {
      const user = await this.ndk?.signer?.user();
      this.pubkey = user?.pubkey || "";
    }
    if (!this.created_at) {
      this.created_at = Math.floor(Date.now() / 1e3);
    }
    const { content, tags } = await this.generateTags(opts);
    this.content = content || "";
    this.tags = tags;
    try {
      this.id = this.getEventHash();
    } catch (_e) {
    }
    return this.rawEvent();
  }
  serialize = serialize.bind(this);
  getEventHash = getEventHash2.bind(this);
  validate = validate.bind(this);
  verifySignature = verifySignature.bind(this);
  /**
   * Is this event replaceable (whether parameterized or not)?
   *
   * This will return true for kind 0, 3, 10k-20k and 30k-40k
   */
  isReplaceable = isReplaceable.bind(this);
  isEphemeral = isEphemeral.bind(this);
  isDvm = () => this.kind && this.kind >= 5e3 && this.kind <= 7e3;
  /**
   * Is this event parameterized replaceable?
   *
   * This will return true for kind 30k-40k
   */
  isParamReplaceable = isParamReplaceable.bind(this);
  /**
   * Encodes a bech32 id.
   *
   * @param relays {string[]} The relays to encode in the id
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
  getMatchingTags(tagName, marker) {
    const t = this.tags.filter((tag2) => tag2[0] === tagName);
    if (marker === void 0) return t;
    return t.filter((tag2) => tag2[3] === marker);
  }
  /**
   * Check if the event has a tag with the given name
   * @param tagName
   * @param marker
   * @returns
   */
  hasTag(tagName, marker) {
    return this.tags.some((tag2) => tag2[0] === tagName && (!marker || tag2[3] === marker));
  }
  /**
   * Get the first tag with the given name
   * @param tagName Tag name to search for
   * @returns The value of the first tag with the given name, or undefined if no such tag exists
   */
  tagValue(tagName, marker) {
    const tags = this.getMatchingTags(tagName, marker);
    if (tags.length === 0) return void 0;
    return tags[0][1];
  }
  /**
   * Gets the NIP-31 "alt" tag of the event.
   */
  get alt() {
    return this.tagValue("alt");
  }
  /**
   * Sets the NIP-31 "alt" tag of the event. Use this to set an alt tag so
   * clients that don't handle a particular event kind can display something
   * useful for users.
   */
  set alt(alt) {
    this.removeTag("alt");
    if (alt) this.tags.push(["alt", alt]);
  }
  /**
   * Gets the NIP-33 "d" tag of the event.
   */
  get dTag() {
    return this.tagValue("d");
  }
  /**
   * Sets the NIP-33 "d" tag of the event.
   */
  set dTag(value) {
    this.removeTag("d");
    if (value) this.tags.push(["d", value]);
  }
  /**
   * Remove all tags with the given name (e.g. "d", "a", "p")
   * @param tagName Tag name(s) to search for and remove
   * @param marker Optional marker to check for too
   *
   * @example
   * Remove a tags with a "defer" marker
   * ```typescript
   * event.tags = [
   *   ["a", "....", "defer"],
   *   ["a", "....", "no-defer"],
   * ]
   *
   * event.removeTag("a", "defer");
   *
   * // event.tags => [["a", "....", "no-defer"]]
   *
   * @returns {void}
   */
  removeTag(tagName, marker) {
    const tagNames = Array.isArray(tagName) ? tagName : [tagName];
    this.tags = this.tags.filter((tag2) => {
      const include = tagNames.includes(tag2[0]);
      const hasMarker = marker ? tag2[3] === marker : true;
      return !(include && hasMarker);
    });
  }
  /**
   * Replace a tag with a new value. If not found, it will be added.
   * @param tag The tag to replace.
   * @param value The new value for the tag.
   */
  replaceTag(tag2) {
    this.removeTag(tag2[0]);
    this.tags.push(tag2);
  }
  /**
   * Sign the event if a signer is present.
   *
   * It will generate tags.
   * Repleacable events will have their created_at field set to the current time.
   * @param signer {NDKSigner} The NDKSigner to use to sign the event
   * @param opts {ContentTaggingOptions} Options for content tagging.
   * @returns {Promise<string>} A Promise that resolves to the signature of the signed event.
   */
  async sign(signer, opts) {
    if (!signer) {
      this.ndk?.assertSigner();
      signer = this.ndk?.signer;
    } else {
      this.author = await signer.user();
    }
    const nostrEvent = await this.toNostrEvent(void 0, opts);
    this.sig = await signer.sign(nostrEvent);
    return this.sig;
  }
  /**
   *
   * @param relaySet
   * @param timeoutMs
   * @param requiredRelayCount
   * @returns
   */
  async publishReplaceable(relaySet, timeoutMs, requiredRelayCount) {
    this.id = "";
    this.created_at = Math.floor(Date.now() / 1e3);
    this.sig = "";
    return this.publish(relaySet, timeoutMs, requiredRelayCount);
  }
  /**
   * Attempt to sign and then publish an NDKEvent to a given relaySet.
   * If no relaySet is provided, the relaySet will be calculated by NDK.
   * @param relaySet {NDKRelaySet} The relaySet to publish the even to.
   * @param timeoutM {number} The timeout for the publish operation in milliseconds.
   * @param requiredRelayCount The number of relays that must receive the event for the publish to be considered successful.
   * @param opts {ContentTaggingOptions} Options for content tagging.
   * @returns A promise that resolves to the relays the event was published to.
   */
  async publish(relaySet, timeoutMs, requiredRelayCount, opts) {
    if (!requiredRelayCount) requiredRelayCount = 1;
    if (!this.sig) await this.sign(void 0, opts);
    if (!this.ndk) throw new Error("NDKEvent must be associated with an NDK instance to publish");
    if (!relaySet || relaySet.size === 0) {
      relaySet = this.ndk.devWriteRelaySet || await calculateRelaySetFromEvent(this.ndk, this, requiredRelayCount);
    }
    if (this.kind === 5 && this.ndk.cacheAdapter?.deleteEventIds) {
      const eTags = this.getMatchingTags("e").map((tag2) => tag2[1]);
      this.ndk.cacheAdapter.deleteEventIds(eTags);
    }
    const rawEvent = this.rawEvent();
    if (this.ndk.cacheAdapter?.addUnpublishedEvent && shouldTrackUnpublishedEvent(this)) {
      try {
        this.ndk.cacheAdapter.addUnpublishedEvent(this, relaySet.relayUrls);
      } catch (e) {
        console.error("Error adding unpublished event to cache", e);
      }
    }
    if (this.kind === 5 && this.ndk.cacheAdapter?.deleteEventIds) {
      this.ndk.cacheAdapter.deleteEventIds(this.getMatchingTags("e").map((tag2) => tag2[1]));
    }
    this.ndk.subManager.dispatchEvent(rawEvent, void 0, true);
    const relays = await relaySet.publish(this, timeoutMs, requiredRelayCount);
    relays.forEach((relay) => this.ndk?.subManager.seenEvent(this.id, relay));
    return relays;
  }
  /**
   * Generates tags for users, notes, and other events tagged in content.
   * Will also generate random "d" tag for parameterized replaceable events where needed.
   * @param opts {ContentTaggingOptions} Options for content tagging.
   * @returns {ContentTag} The tags and content of the event.
   */
  async generateTags(opts) {
    let tags = [];
    const g = await generateContentTags(this.content, this.tags, opts, this);
    const content = g.content;
    tags = g.tags;
    if (this.kind && this.isParamReplaceable()) {
      const dTag = this.getMatchingTags("d")[0];
      if (!dTag) {
        const title = this.tagValue("title");
        const randLength = title ? 6 : 16;
        let str = [...Array(randLength)].map(() => Math.random().toString(36)[2]).join("");
        if (title && title.length > 0) {
          str = `${title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}-${str}`;
        }
        tags.push(["d", str]);
      }
    }
    if (this.shouldAddClientTag) {
      const clientTag = ["client", this.ndk?.clientName ?? ""];
      if (this.ndk?.clientNip89) clientTag.push(this.ndk?.clientNip89);
      tags.push(clientTag);
    } else if (this.shouldStripClientTag) {
      tags = tags.filter((tag2) => tag2[0] !== "client");
    }
    return { content: content || "", tags };
  }
  get shouldAddClientTag() {
    if (!this.ndk?.clientName && !this.ndk?.clientNip89) return false;
    if (skipClientTagOnKinds.has(this.kind)) return false;
    if (this.isEphemeral()) return false;
    if (this.isReplaceable() && !this.isParamReplaceable()) return false;
    if (this.isDvm()) return false;
    if (this.hasTag("client")) return false;
    return true;
  }
  get shouldStripClientTag() {
    return skipClientTagOnKinds.has(this.kind);
  }
  muted() {
    const authorMutedEntry = this.ndk?.mutedIds.get(this.pubkey);
    if (authorMutedEntry && authorMutedEntry === "p") return "author";
    const eventTagReference = this.tagReference();
    const eventMutedEntry = this.ndk?.mutedIds.get(eventTagReference[1]);
    if (eventMutedEntry && eventMutedEntry === eventTagReference[0]) return "event";
    return null;
  }
  /**
   * Returns the "d" tag of a parameterized replaceable event or throws an error if the event isn't
   * a parameterized replaceable event.
   * @returns {string} the "d" tag of the event.
   *
   * @deprecated Use `dTag` instead.
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
    }
    return this.tagId();
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
   * Returns a stable reference value for a replaceable event.
   *
   * Param replaceable events are returned in the expected format of `<kind>:<pubkey>:<d-tag>`.
   * Kind-replaceable events are returned in the format of `<kind>:<pubkey>:`.
   *
   * @returns {string} A stable reference value for replaceable events
   */
  tagAddress() {
    if (this.isParamReplaceable()) {
      const dTagId = this.dTag ?? "";
      return `${this.kind}:${this.pubkey}:${dTagId}`;
    }
    if (this.isReplaceable()) {
      return `${this.kind}:${this.pubkey}:`;
    }
    throw new Error("Event is not a replaceable event");
  }
  /**
   * Determines the type of tag that can be used to reference this event from another event.
   * @returns {string} The tag type
   * @example
   * event = new NDKEvent(ndk, { kind: 30000, pubkey: 'pubkey', tags: [ ["d", "d-code"] ] });
   * event.tagType(); // "a"
   */
  tagType() {
    return this.isParamReplaceable() ? "a" : "e";
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
    let tag2;
    if (this.isParamReplaceable()) {
      tag2 = ["a", this.tagAddress()];
    } else {
      tag2 = ["e", this.tagId()];
    }
    if (this.relay) {
      tag2.push(this.relay.url);
    } else {
      tag2.push("");
    }
    tag2.push(marker ?? "");
    if (!this.isParamReplaceable()) {
      tag2.push(this.pubkey);
    }
    return tag2;
  }
  /**
   * Get the tags that can be used to reference this event from another event
   * @param marker The marker to use in the tag
   * @param skipAuthorTag Whether to explicitly skip adding the author tag of the event
   * @param forceTag Force a specific tag to be used instead of the default "e" or "a" tag
   * @example
   *     event = new NDKEvent(ndk, { kind: 30000, pubkey: 'pubkey', tags: [ ["d", "d-code"] ] });
   *     event.referenceTags(); // [["a", "30000:pubkey:d-code"], ["e", "parent-id"]]
   *
   *     event = new NDKEvent(ndk, { kind: 1, pubkey: 'pubkey', id: "eventid" });
   *     event.referenceTags(); // [["e", "parent-id"]]
   * @returns {NDKTag} The NDKTag object referencing this event
   */
  referenceTags(marker, skipAuthorTag, forceTag, opts) {
    let tags = [];
    if (this.isParamReplaceable()) {
      tags = [
        [forceTag ?? "a", this.tagAddress()],
        [forceTag ?? "e", this.id]
      ];
    } else {
      tags = [[forceTag ?? "e", this.id]];
    }
    tags = tags.map((tag2) => {
      if (tag2[0] === "e" || marker) {
        tag2.push(this.relay?.url ?? "");
      } else if (this.relay?.url) {
        tag2.push(this.relay?.url);
      }
      return tag2;
    });
    tags.forEach((tag2) => {
      if (tag2[0] === "e") {
        tag2.push(marker ?? "");
        tag2.push(this.pubkey);
      } else if (marker) {
        tag2.push(marker);
      }
    });
    tags = [...tags, ...this.getMatchingTags("h")];
    if (!skipAuthorTag && opts?.pTags !== false) tags.push(...this.author.referenceTags());
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
    }
    return { "#e": [this.tagId()] };
  }
  nip22Filter() {
    if (this.isParamReplaceable()) {
      return { "#A": [this.tagId()] };
    }
    return { "#E": [this.tagId()] };
  }
  /**
   * Generates a deletion event of the current event
   *
   * @param reason The reason for the deletion
   * @param publish Whether to publish the deletion event automatically
   * @returns The deletion event
   */
  async delete(reason, publish = true) {
    if (!this.ndk) throw new Error("No NDK instance found");
    this.ndk.assertSigner();
    const e = new _NDKEvent(this.ndk, {
      kind: 5,
      content: reason || ""
    });
    e.tag(this, void 0, true);
    e.tags.push(["k", this.kind?.toString()]);
    if (publish) {
      this.emit("deleted");
      await e.publish();
    }
    return e;
  }
  /**
   * Establishes whether this is a NIP-70-protectede event.
   * @@satisfies NIP-70
   */
  set isProtected(val) {
    this.removeTag("-");
    if (val) this.tags.push(["-"]);
  }
  /**
   * Whether this is a NIP-70-protected event.
   * @@satisfies NIP-70
   */
  get isProtected() {
    return this.hasTag("-");
  }
  /**
   * Fetch an event tagged with the given tag following relay hints if provided.
   * @param tag The tag to search for
   * @param marker The marker to use in the tag (e.g. "root")
   * @returns The fetched event or null if no event was found, undefined if no matching tag was found in the event
   * * @example
   * const replyEvent = await ndk.fetchEvent("nevent1qqs8x8vnycyha73grv380gmvlury4wtmx0nr9a5ds2dngqwgu87wn6gpzemhxue69uhhyetvv9ujuurjd9kkzmpwdejhgq3ql2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqz4cwjd")
   * const originalEvent = await replyEvent.fetchTaggedEvent("e", "reply");
   * console.log(replyEvent.encode() + " is a reply to event " + originalEvent?.encode());
   */
  fetchTaggedEvent = fetchTaggedEvent.bind(this);
  /**
   * Fetch the root event of the current event.
   * @returns The fetched root event or null if no event was found
   * @example
   * const replyEvent = await ndk.fetchEvent("nevent1qqs8x8vnycyha73grv380gmvlury4wtmx0nr9a5ds2dngqwgu87wn6gpzemhxue69uhhyetvv9ujuurjd9kkzmpwdejhgq3ql2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqz4cwjd")
   * const rootEvent = await replyEvent.fetchRootEvent();
   * console.log(replyEvent.encode() + " is a reply in the thread " + rootEvent?.encode());
   */
  fetchRootEvent = fetchRootEvent.bind(this);
  /**
   * Fetch the event the current event is replying to.
   * @returns The fetched reply event or null if no event was found
   */
  fetchReplyEvent = fetchReplyEvent.bind(this);
  /**
   * NIP-18 reposting event.
   *
   * @param publish Whether to publish the reposted event automatically @default true
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
  async react(content, publish = true) {
    if (!this.ndk) throw new Error("No NDK instance found");
    this.ndk.assertSigner();
    const e = new _NDKEvent(this.ndk, {
      kind: 7,
      content
    });
    e.tag(this);
    if (this.kind !== 1) {
      e.tags.push(["k", `${this.kind}`]);
    }
    if (publish) await e.publish();
    return e;
  }
  /**
   * Checks whether the event is valid per underlying NIPs.
   *
   * This method is meant to be overridden by subclasses that implement specific NIPs
   * to allow the enforcement of NIP-specific validation rules.
   *
   * Otherwise, it will only check for basic event properties.
   *
   */
  get isValid() {
    return this.validate();
  }
  get inspect() {
    return JSON.stringify(this.rawEvent(), null, 4);
  }
  /**
   * Dump the event to console for debugging purposes.
   * Prints a JSON stringified version of rawEvent() with indentation
   * and also lists all relay URLs for onRelays.
   */
  dump() {
    console.debug(JSON.stringify(this.rawEvent(), null, 4));
    console.debug("Event on relays:", this.onRelays.map((relay) => relay.url).join(", "));
  }
  /**
   * Creates a reply event for the current event.
   *
   * This function will use NIP-22 when appropriate (i.e. replies to non-kind:1 events).
   * This function does not have side-effects; it will just return an event with the appropriate tags
   * to generate the reply event; the caller is responsible for publishing the event.
   *
   * @param forceNip22 - Optional flag to force NIP-22 style replies (kind 1111) regardless of the original event's kind
   * @param opts - Optional content tagging options
   */
  reply(forceNip22, opts) {
    const reply = new _NDKEvent(this.ndk);
    if (this.kind === 1 && !forceNip22) {
      reply.kind = 1;
      const opHasETag = this.hasTag("e");
      if (opHasETag) {
        reply.tags = [
          ...reply.tags,
          ...this.getMatchingTags("e"),
          ...this.getMatchingTags("p"),
          ...this.getMatchingTags("a"),
          ...this.referenceTags("reply", false, void 0, opts)
        ];
      } else {
        reply.tag(this, "root", false, void 0, opts);
      }
    } else {
      reply.kind = 1111;
      const carryOverTags = ["A", "E", "I", "P"];
      const rootTags = this.tags.filter((tag2) => carryOverTags.includes(tag2[0]));
      if (rootTags.length > 0) {
        const rootKind = this.tagValue("K");
        reply.tags.push(...rootTags);
        if (rootKind) reply.tags.push(["K", rootKind]);
        let tag2;
        if (this.isParamReplaceable()) {
          tag2 = ["a", this.tagAddress()];
          const relayHint = this.relay?.url ?? "";
          if (relayHint) tag2.push(relayHint);
        } else {
          tag2 = ["e", this.tagId()];
          const relayHint = this.relay?.url ?? "";
          tag2.push(relayHint);
          tag2.push(this.pubkey);
        }
        reply.tags.push(tag2);
      } else {
        let lowerTag;
        let upperTag;
        const relayHint = this.relay?.url ?? "";
        if (this.isParamReplaceable()) {
          lowerTag = ["a", this.tagAddress(), relayHint];
          upperTag = ["A", this.tagAddress(), relayHint];
        } else {
          lowerTag = ["e", this.tagId(), relayHint, this.pubkey];
          upperTag = ["E", this.tagId(), relayHint, this.pubkey];
        }
        reply.tags.push(lowerTag);
        reply.tags.push(upperTag);
        reply.tags.push(["K", this.kind?.toString()]);
        if (opts?.pTags !== false && opts?.pTagOnATags !== false) {
          reply.tags.push(["P", this.pubkey]);
        }
      }
      reply.tags.push(["k", this.kind?.toString()]);
      if (opts?.pTags !== false) {
        reply.tags.push(...this.getMatchingTags("p"));
        reply.tags.push(["p", this.pubkey]);
      }
    }
    return reply;
  }
};
var untrackedUnpublishedEvents = /* @__PURE__ */ new Set([
  24133,
  13194,
  23194,
  23195
  /* NostrWalletConnectRes */
]);
function shouldTrackUnpublishedEvent(event) {
  return !untrackedUnpublishedEvents.has(event.kind);
}
var NDKPool = class extends import_tseep3.EventEmitter {
  // TODO: This should probably be an LRU cache
  _relays = /* @__PURE__ */ new Map();
  status = "idle";
  autoConnectRelays = /* @__PURE__ */ new Set();
  poolBlacklistRelayUrls = /* @__PURE__ */ new Set();
  debug;
  temporaryRelayTimers = /* @__PURE__ */ new Map();
  flappingRelays = /* @__PURE__ */ new Set();
  // A map to store timeouts for each flapping relay.
  backoffTimes = /* @__PURE__ */ new Map();
  ndk;
  // System-wide disconnection detection
  disconnectionTimes = /* @__PURE__ */ new Map();
  systemEventDetector;
  get blacklistRelayUrls() {
    const val = new Set(this.ndk.blacklistRelayUrls);
    this.poolBlacklistRelayUrls.forEach((url) => val.add(url));
    return val;
  }
  /**
   * @param relayUrls - The URLs of the relays to connect to.
   * @param blacklistedRelayUrls - URLs to blacklist for this pool IN ADDITION to those blacklisted at the ndk-level
   * @param ndk - The NDK instance.
   * @param opts - Options for the pool.
   */
  constructor(relayUrls, blacklistedRelayUrls, ndk2, {
    debug: debug9,
    name
  } = {}) {
    super();
    this.debug = debug9 ?? ndk2.debug.extend("pool");
    if (name) this._name = name;
    this.ndk = ndk2;
    this.relayUrls = relayUrls;
    this.poolBlacklistRelayUrls = new Set(blacklistedRelayUrls);
    this.ndk.pools.push(this);
  }
  get relays() {
    return this._relays;
  }
  set relayUrls(urls) {
    this._relays.clear();
    for (const relayUrl of urls) {
      const relay = new NDKRelay(relayUrl, void 0, this.ndk);
      relay.connectivity.netDebug = this.ndk.netDebug;
      this.addRelay(relay);
    }
  }
  _name = "unnamed";
  get name() {
    return this._name;
  }
  set name(name) {
    this._name = name;
    this.debug = this.debug.extend(name);
  }
  /**
   * Adds a relay to the pool, and sets a timer to remove it if it is not used within the specified time.
   * @param relay - The relay to add to the pool.
   * @param removeIfUnusedAfter - The time in milliseconds to wait before removing the relay from the pool after it is no longer used.
   */
  useTemporaryRelay(relay, removeIfUnusedAfter = 3e4, filters) {
    const relayAlreadyInPool = this.relays.has(relay.url);
    if (!relayAlreadyInPool) {
      this.addRelay(relay);
      this.debug("Adding temporary relay %s for filters %o", relay.url, filters);
    }
    const existingTimer = this.temporaryRelayTimers.get(relay.url);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    if (!relayAlreadyInPool || existingTimer) {
      const timer = setTimeout(() => {
        if (this.ndk.explicitRelayUrls?.includes(relay.url)) return;
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
    const isAlreadyInPool = this.relays.has(relay.url);
    const isBlacklisted = this.blacklistRelayUrls?.has(relay.url);
    const isCustomRelayUrl = relay.url.includes("/npub1");
    let reconnect = true;
    const relayUrl = relay.url;
    if (isAlreadyInPool) return;
    if (isBlacklisted) {
      this.debug(`Refusing to add relay ${relayUrl}: blacklisted`);
      return;
    }
    if (isCustomRelayUrl) {
      this.debug(`Refusing to add relay ${relayUrl}: is a filter relay`);
      return;
    }
    if (this.ndk.cacheAdapter?.getRelayStatus) {
      const info = this.ndk.cacheAdapter.getRelayStatus(relayUrl);
      if (info?.dontConnectBefore) {
        if (info.dontConnectBefore > Date.now()) {
          const delay = info.dontConnectBefore - Date.now();
          this.debug(`Refusing to add relay ${relayUrl}: delayed connect for ${delay}ms`);
          setTimeout(() => {
            this.addRelay(relay, connect);
          }, delay);
          return;
        }
        reconnect = false;
      }
    }
    const noticeHandler = (notice) => this.emit("notice", relay, notice);
    const connectHandler = () => this.handleRelayConnect(relayUrl);
    const readyHandler = () => this.handleRelayReady(relay);
    const disconnectHandler = () => {
      this.recordDisconnection(relay);
      this.emit("relay:disconnect", relay);
    };
    const flappingHandler = () => this.handleFlapping(relay);
    const authHandler = (challenge3) => this.emit("relay:auth", relay, challenge3);
    const authedHandler = () => this.emit("relay:authed", relay);
    relay.off("notice", noticeHandler);
    relay.off("connect", connectHandler);
    relay.off("ready", readyHandler);
    relay.off("disconnect", disconnectHandler);
    relay.off("flapping", flappingHandler);
    relay.off("auth", authHandler);
    relay.off("authed", authedHandler);
    relay.on("notice", noticeHandler);
    relay.on("connect", connectHandler);
    relay.on("ready", readyHandler);
    relay.on("disconnect", disconnectHandler);
    relay.on("flapping", flappingHandler);
    relay.on("auth", authHandler);
    relay.on("authed", authedHandler);
    relay.on("delayed-connect", (delay) => {
      if (this.ndk.cacheAdapter?.updateRelayStatus) {
        this.ndk.cacheAdapter.updateRelayStatus(relay.url, {
          dontConnectBefore: Date.now() + delay
        });
      }
    });
    this._relays.set(relayUrl, relay);
    if (connect) this.autoConnectRelays.add(relayUrl);
    if (connect && this.status === "active") {
      this.emit("relay:connecting", relay);
      relay.connect(void 0, reconnect).catch((e) => {
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
      this.autoConnectRelays.delete(relayUrl);
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
   * Checks whether a relay is already connected in the pool.
   */
  isRelayConnected(url) {
    const normalizedUrl = normalizeRelayUrl(url);
    const relay = this.relays.get(normalizedUrl);
    if (!relay) return false;
    return relay.status === 5;
  }
  /**
   * Fetches a relay from the pool, or creates a new one if it does not exist.
   *
   * New relays will be attempted to be connected.
   */
  getRelay(url, connect = true, temporary = false, filters) {
    let relay = this.relays.get(normalizeRelayUrl(url));
    if (!relay) {
      relay = new NDKRelay(url, void 0, this.ndk);
      relay.connectivity.netDebug = this.ndk.netDebug;
      if (temporary) {
        this.useTemporaryRelay(relay, 3e4, filters);
      } else {
        this.addRelay(relay, connect);
      }
    }
    return relay;
  }
  handleRelayConnect(relayUrl) {
    const relay = this.relays.get(relayUrl);
    if (!relay) {
      console.error("NDK BUG: relay not found in pool", { relayUrl });
      return;
    }
    this.emit("relay:connect", relay);
    if (this.stats().connected === this.relays.size) {
      this.emit("connect");
    }
  }
  handleRelayReady(relay) {
    this.emit("relay:ready", relay);
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
    this.status = "active";
    this.debug(`Connecting to ${this.relays.size} relays${timeoutMs ? `, timeout ${timeoutMs}ms` : ""}...`);
    const relaysToConnect = Array.from(this.autoConnectRelays.keys()).map((url) => this.relays.get(url)).filter((relay) => !!relay);
    for (const relay of relaysToConnect) {
      if (relay.status !== 5 && relay.status !== 4) {
        this.emit("relay:connecting", relay);
        relay.connect().catch((e) => {
          this.debug(`Failed to connect to relay ${relay.url}: ${e ?? "No reason specified"}`);
        });
      }
    }
    const allConnected = () => relaysToConnect.every(
      (r) => r.status === 5
      /* CONNECTED */
    );
    const allConnectedPromise = new Promise((resolve) => {
      if (allConnected()) {
        resolve();
        return;
      }
      const listeners = [];
      for (const relay of relaysToConnect) {
        const handler = () => {
          if (allConnected()) {
            for (let i2 = 0; i2 < relaysToConnect.length; i2++) {
              relaysToConnect[i2].off("connect", listeners[i2]);
            }
            resolve();
          }
        };
        listeners.push(handler);
        relay.on("connect", handler);
      }
    });
    const timeoutPromise = typeof timeoutMs === "number" ? new Promise((resolve) => setTimeout(resolve, timeoutMs)) : new Promise(() => {
    });
    await Promise.race([allConnectedPromise, timeoutPromise]);
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
  /**
   * Records when a relay disconnects to detect system-wide events
   */
  recordDisconnection(relay) {
    const now2 = Date.now();
    this.disconnectionTimes.set(relay.url, now2);
    for (const [url, time] of this.disconnectionTimes.entries()) {
      if (now2 - time > 1e4) {
        this.disconnectionTimes.delete(url);
      }
    }
    this.checkForSystemWideDisconnection();
  }
  /**
   * Checks if multiple relays disconnected simultaneously, indicating a system event
   */
  checkForSystemWideDisconnection() {
    const now2 = Date.now();
    const recentDisconnections = [];
    for (const time of this.disconnectionTimes.values()) {
      if (now2 - time < 5e3) {
        recentDisconnections.push(time);
      }
    }
    if (recentDisconnections.length > this.relays.size / 2 && this.relays.size > 1) {
      this.debug(
        `System-wide disconnection detected: ${recentDisconnections.length}/${this.relays.size} relays disconnected`
      );
      this.handleSystemWideReconnection();
    }
  }
  /**
   * Handles system-wide reconnection (e.g., after sleep/wake or network change)
   */
  handleSystemWideReconnection() {
    this.debug("Initiating system-wide reconnection with reset backoff");
    if (this.systemEventDetector) {
      clearTimeout(this.systemEventDetector);
    }
    this.systemEventDetector = setTimeout(() => {
      this.systemEventDetector = void 0;
    }, 1e4);
    for (const relay of this.relays.values()) {
      if (relay.connectivity) {
        relay.connectivity.resetReconnectionState();
        if (relay.status !== 5 && relay.status !== 4) {
          relay.connect().catch((e) => {
            this.debug(`Failed to reconnect relay ${relay.url} after system event: ${e}`);
          });
        }
      }
    }
    this.disconnectionTimes.clear();
  }
  handleFlapping(relay) {
    this.debug(`Relay ${relay.url} is flapping`);
    let currentBackoff = this.backoffTimes.get(relay.url) || 5e3;
    currentBackoff = currentBackoff * 2;
    this.backoffTimes.set(relay.url, currentBackoff);
    this.debug(`Backoff time for ${relay.url} is ${currentBackoff}ms`);
    setTimeout(() => {
      this.debug(`Attempting to reconnect to ${relay.url}`);
      this.emit("relay:connecting", relay);
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
      if (relay.status === 5) {
        stats.connected++;
      } else if (relay.status === 1) {
        stats.disconnected++;
      } else if (relay.status === 4) {
        stats.connecting++;
      }
    }
    return stats;
  }
  connectedRelays() {
    return Array.from(this.relays.values()).filter(
      (relay) => relay.status >= 5
      /* CONNECTED */
    );
  }
  permanentAndConnectedRelays() {
    return Array.from(this.relays.values()).filter(
      (relay) => relay.status >= 5 && !this.temporaryRelayTimers.has(relay.url)
    );
  }
  /**
   * Get a list of all relay urls in the pool.
   */
  urls() {
    return Array.from(this.relays.keys());
  }
};
var NDKCashuMintList = class _NDKCashuMintList extends NDKEvent {
  static kind = 10019;
  static kinds = [
    10019
    /* CashuMintList */
  ];
  _p2pk;
  constructor(ndk2, event) {
    super(ndk2, event);
    this.kind ??= 10019;
  }
  static from(event) {
    return new _NDKCashuMintList(event.ndk, event);
  }
  set relays(urls) {
    this.tags = this.tags.filter((t) => t[0] !== "relay");
    for (const url of urls) {
      this.tags.push(["relay", url]);
    }
  }
  get relays() {
    const r = [];
    for (const tag2 of this.tags) {
      if (tag2[0] === "relay") {
        r.push(tag2[1]);
      }
    }
    return r;
  }
  set mints(urls) {
    this.tags = this.tags.filter((t) => t[0] !== "mint");
    for (const url of urls) {
      this.tags.push(["mint", url]);
    }
  }
  get mints() {
    const r = [];
    for (const tag2 of this.tags) {
      if (tag2[0] === "mint") {
        r.push(tag2[1]);
      }
    }
    return Array.from(new Set(r));
  }
  get p2pk() {
    if (this._p2pk) {
      return this._p2pk;
    }
    this._p2pk = this.tagValue("pubkey") ?? this.pubkey;
    return this._p2pk;
  }
  set p2pk(pubkey) {
    this._p2pk = pubkey;
    this.removeTag("pubkey");
    if (pubkey) {
      this.tags.push(["pubkey", pubkey]);
    }
  }
  get relaySet() {
    return NDKRelaySet.fromRelayUrls(this.relays, this.ndk);
  }
};
var NDKArticle = class _NDKArticle extends NDKEvent {
  static kind = 30023;
  static kinds = [
    30023
    /* Article */
  ];
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind ??= 30023;
  }
  /**
   * Creates a NDKArticle from an existing NDKEvent.
   *
   * @param event NDKEvent to create the NDKArticle from.
   * @returns NDKArticle
   */
  static from(event) {
    return new _NDKArticle(event.ndk, event);
  }
  /**
   * Getter for the article title.
   *
   * @returns {string | undefined} - The article title if available, otherwise undefined.
   */
  get title() {
    return this.tagValue("title");
  }
  /**
   * Setter for the article title.
   *
   * @param {string | undefined} title - The title to set for the article.
   */
  set title(title) {
    this.removeTag("title");
    if (title) this.tags.push(["title", title]);
  }
  /**
   * Getter for the article image.
   *
   * @returns {string | undefined} - The article image if available, otherwise undefined.
   */
  get image() {
    return this.tagValue("image");
  }
  /**
   * Setter for the article image.
   *
   * @param {string | undefined} image - The image to set for the article.
   */
  set image(image) {
    this.removeTag("image");
    if (image) this.tags.push(["image", image]);
  }
  get summary() {
    return this.tagValue("summary");
  }
  set summary(summary) {
    this.removeTag("summary");
    if (summary) this.tags.push(["summary", summary]);
  }
  /**
   * Getter for the article's publication timestamp.
   *
   * @returns {number | undefined} - The Unix timestamp of when the article was published or undefined.
   */
  get published_at() {
    const tag2 = this.tagValue("published_at");
    if (tag2) {
      let val = Number.parseInt(tag2);
      if (val > 1e12) {
        val = Math.floor(val / 1e3);
      }
      return val;
    }
    return void 0;
  }
  /**
   * Setter for the article's publication timestamp.
   *
   * @param {number | undefined} timestamp - The Unix timestamp to set for the article's publication date.
   */
  set published_at(timestamp) {
    this.removeTag("published_at");
    if (timestamp !== void 0) {
      this.tags.push(["published_at", timestamp.toString()]);
    }
  }
  /**
   * Generates content tags for the article.
   *
   * This method first checks and sets the publication date if not available,
   * and then generates content tags based on the base NDKEvent class.
   *
   * @returns {ContentTag} - The generated content tags.
   */
  async generateTags() {
    super.generateTags();
    if (!this.published_at) {
      this.published_at = this.created_at;
    }
    return super.generateTags();
  }
  /**
   * Getter for the article's URL.
   *
   * @returns {string | undefined} - The article's URL if available, otherwise undefined.
   */
  get url() {
    return this.tagValue("url");
  }
  /**
   * Setter for the article's URL.
   *
   * @param {string | undefined} url - The URL to set for the article.
   */
  set url(url) {
    if (url) {
      this.tags.push(["url", url]);
    } else {
      this.removeTag("url");
    }
  }
};
var NDKHighlight = class _NDKHighlight extends NDKEvent {
  _article;
  static kind = 9802;
  static kinds = [
    9802
    /* Highlight */
  ];
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind ??= 9802;
  }
  static from(event) {
    return new _NDKHighlight(event.ndk, event);
  }
  get url() {
    return this.tagValue("r");
  }
  /**
   * Context tag.
   */
  set context(context) {
    if (context === void 0) {
      this.tags = this.tags.filter(([tag2, _value]) => tag2 !== "context");
    } else {
      this.tags = this.tags.filter(([tag2, _value]) => tag2 !== "context");
      this.tags.push(["context", context]);
    }
  }
  get context() {
    return this.tags.find(([tag2, _value]) => tag2 === "context")?.[1] ?? void 0;
  }
  /**
   * Will return the article URL or NDKEvent if they have already been
   * set (it won't attempt to load remote events)
   */
  get article() {
    return this._article;
  }
  /**
   * Article the highlight is coming from.
   *
   * @param article Article URL or NDKEvent.
   */
  set article(article) {
    this._article = article;
    if (typeof article === "string") {
      this.tags.push(["r", article]);
    } else {
      this.tag(article);
    }
  }
  getArticleTag() {
    return this.getMatchingTags("a")[0] || this.getMatchingTags("e")[0] || this.getMatchingTags("r")[0];
  }
  async getArticle() {
    if (this._article !== void 0) return this._article;
    let taggedBech32;
    const articleTag = this.getArticleTag();
    if (!articleTag) return void 0;
    switch (articleTag[0]) {
      case "a": {
        const [kind, pubkey, identifier] = articleTag[1].split(":");
        taggedBech32 = nip19_exports.naddrEncode({
          kind: Number.parseInt(kind),
          pubkey,
          identifier
        });
        break;
      }
      case "e":
        taggedBech32 = nip19_exports.noteEncode(articleTag[1]);
        break;
      case "r":
        this._article = articleTag[1];
        break;
    }
    if (taggedBech32) {
      let a = await this.ndk?.fetchEvent(taggedBech32);
      if (a) {
        if (a.kind === 30023) {
          a = NDKArticle.from(a);
        }
        this._article = a;
      }
    }
    return this._article;
  }
};
function mapImetaTag(tag2) {
  const data = {};
  if (tag2.length === 2) {
    const parts = tag2[1].split(" ");
    for (let i2 = 0; i2 < parts.length; i2 += 2) {
      const key = parts[i2];
      const value = parts[i2 + 1];
      if (key === "fallback") {
        if (!data.fallback) data.fallback = [];
        data.fallback.push(value);
      } else {
        data[key] = value;
      }
    }
    return data;
  }
  const tags = tag2.slice(1);
  for (const val of tags) {
    const parts = val.split(" ");
    const key = parts[0];
    const value = parts.slice(1).join(" ");
    if (key === "fallback") {
      if (!data.fallback) data.fallback = [];
      data.fallback.push(value);
    } else {
      data[key] = value;
    }
  }
  return data;
}
function imetaTagToTag(imeta) {
  const tag2 = ["imeta"];
  for (const [key, value] of Object.entries(imeta)) {
    if (Array.isArray(value)) {
      for (const v of value) {
        tag2.push(`${key} ${v}`);
      }
    } else if (value) {
      tag2.push(`${key} ${value}`);
    }
  }
  return tag2;
}
var NDKImage = class _NDKImage extends NDKEvent {
  static kind = 20;
  static kinds = [
    20
    /* Image */
  ];
  _imetas;
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind ??= 20;
  }
  /**
   * Creates a NDKImage from an existing NDKEvent.
   *
   * @param event NDKEvent to create the NDKImage from.
   * @returns NDKImage
   */
  static from(event) {
    return new _NDKImage(event.ndk, event.rawEvent());
  }
  get isValid() {
    return this.imetas.length > 0;
  }
  get imetas() {
    if (this._imetas) return this._imetas;
    this._imetas = this.tags.filter((tag2) => tag2[0] === "imeta").map(mapImetaTag).filter((imeta) => !!imeta.url);
    return this._imetas;
  }
  set imetas(tags) {
    this._imetas = tags;
    this.tags = this.tags.filter((tag2) => tag2[0] !== "imeta");
    this.tags.push(...tags.map(imetaTagToTag));
  }
};
var NDKList = class _NDKList extends NDKEvent {
  _encryptedTags;
  static kinds = [
    30001,
    10004,
    10050,
    10030,
    10015,
    10001,
    10002,
    10007,
    10006,
    10003
    /* BookmarkList */
  ];
  /**
   * Stores the number of bytes the content was before decryption
   * to expire the cache when the content changes.
   */
  encryptedTagsLength;
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind ??= 30001;
  }
  /**
   * Wrap a NDKEvent into a NDKList
   */
  static from(ndkEvent) {
    return new _NDKList(ndkEvent.ndk, ndkEvent);
  }
  /**
   * Returns the title of the list. Falls back on fetching the name tag value.
   */
  get title() {
    const titleTag = this.tagValue("title") || this.tagValue("name");
    if (titleTag) return titleTag;
    if (this.kind === 3) {
      return "Contacts";
    }
    if (this.kind === 1e4) {
      return "Mute";
    }
    if (this.kind === 10001) {
      return "Pinned Notes";
    }
    if (this.kind === 10002) {
      return "Relay Metadata";
    }
    if (this.kind === 10003) {
      return "Bookmarks";
    }
    if (this.kind === 10004) {
      return "Communities";
    }
    if (this.kind === 10005) {
      return "Public Chats";
    }
    if (this.kind === 10006) {
      return "Blocked Relays";
    }
    if (this.kind === 10007) {
      return "Search Relays";
    }
    if (this.kind === 10050) {
      return "Direct Message Receive Relays";
    }
    if (this.kind === 10015) {
      return "Interests";
    }
    if (this.kind === 10030) {
      return "Emojis";
    }
    return this.tagValue("d");
  }
  /**
   * Sets the title of the list.
   */
  set title(title) {
    this.removeTag(["title", "name"]);
    if (title) this.tags.push(["title", title]);
  }
  /**
   * Returns the name of the list.
   * @deprecated Please use "title" instead.
   */
  get name() {
    return this.title;
  }
  /**
   * Sets the name of the list.
   * @deprecated Please use "title" instead. This method will use the `title` tag instead.
   */
  set name(name) {
    this.title = name;
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
    this.removeTag("description");
    if (name) this.tags.push(["description", name]);
  }
  /**
   * Returns the image of the list.
   */
  get image() {
    return this.tagValue("image");
  }
  /**
   * Sets the image of the list.
   */
  set image(name) {
    this.removeTag("image");
    if (name) this.tags.push(["image", name]);
  }
  isEncryptedTagsCacheValid() {
    return !!(this._encryptedTags && this.encryptedTagsLength === this.content.length);
  }
  /**
   * Returns the decrypted content of the list.
   */
  async encryptedTags(useCache = true) {
    if (useCache && this.isEncryptedTagsCacheValid()) return this._encryptedTags;
    if (!this.ndk) throw new Error("NDK instance not set");
    if (!this.ndk.signer) throw new Error("NDK signer not set");
    const user = await this.ndk.signer.user();
    try {
      if (this.content.length > 0) {
        try {
          const decryptedContent = await this.ndk.signer.decrypt(user, this.content);
          const a = JSON.parse(decryptedContent);
          if (a?.[0]) {
            this.encryptedTagsLength = this.content.length;
            return this._encryptedTags = a;
          }
          this.encryptedTagsLength = this.content.length;
          return this._encryptedTags = [];
        } catch (_e) {
        }
      }
    } catch (_e) {
    }
    return [];
  }
  /**
   * This method can be overriden to validate that a tag is valid for this list.
   *
   * (i.e. the NDKPersonList can validate that items are NDKUser instances)
   */
  validateTag(_tagValue) {
    return true;
  }
  getItems(type) {
    return this.tags.filter((tag2) => tag2[0] === type);
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
        "published_at",
        "summary",
        "image",
        "thumb",
        "alt",
        "expiration",
        "subject",
        "client"
      ].includes(t[0]);
    });
  }
  /**
   * Adds a new item to the list.
   * @param relay Relay to add
   * @param mark Optional mark to add to the item
   * @param encrypted Whether to encrypt the item
   * @param position Where to add the item in the list (top or bottom)
   */
  async addItem(item, mark = void 0, encrypted = false, position = "bottom") {
    if (!this.ndk) throw new Error("NDK instance not set");
    if (!this.ndk.signer) throw new Error("NDK signer not set");
    let tags;
    if (item instanceof NDKEvent) {
      tags = [item.tagReference(mark)];
    } else if (item instanceof NDKUser) {
      tags = item.referenceTags();
    } else if (item instanceof NDKRelay) {
      tags = item.referenceTags();
    } else if (Array.isArray(item)) {
      tags = [item];
    } else {
      throw new Error("Invalid object type");
    }
    if (mark) tags[0].push(mark);
    if (encrypted) {
      const user = await this.ndk.signer.user();
      const currentList = await this.encryptedTags();
      if (position === "top") currentList.unshift(...tags);
      else currentList.push(...tags);
      this._encryptedTags = currentList;
      this.encryptedTagsLength = this.content.length;
      this.content = JSON.stringify(currentList);
      await this.encrypt(user);
    } else {
      if (position === "top") this.tags.unshift(...tags);
      else this.tags.push(...tags);
    }
    this.created_at = Math.floor(Date.now() / 1e3);
    this.emit("change");
  }
  /**
   * Removes an item from the list from both the encrypted and unencrypted lists.
   * @param value value of item to remove from the list
   * @param publish whether to publish the change
   * @returns
   */
  async removeItemByValue(value, publish = true) {
    if (!this.ndk) throw new Error("NDK instance not set");
    if (!this.ndk.signer) throw new Error("NDK signer not set");
    const index = this.tags.findIndex((tag2) => tag2[1] === value);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    const user = await this.ndk.signer.user();
    const encryptedTags = await this.encryptedTags();
    const encryptedIndex = encryptedTags.findIndex((tag2) => tag2[1] === value);
    if (encryptedIndex >= 0) {
      encryptedTags.splice(encryptedIndex, 1);
      this._encryptedTags = encryptedTags;
      this.encryptedTagsLength = this.content.length;
      this.content = JSON.stringify(encryptedTags);
      await this.encrypt(user);
    }
    if (publish) {
      return this.publishReplaceable();
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
    if (!this.ndk) throw new Error("NDK instance not set");
    if (!this.ndk.signer) throw new Error("NDK signer not set");
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
  has(item) {
    return this.items.some((tag2) => tag2[1] === item);
  }
  /**
   * Creates a filter that will result in fetching
   * the items of this list
   * @example
   * const list = new NDKList(...);
   * const filters = list.filterForItems();
   * const events = await ndk.fetchEvents(filters);
   */
  filterForItems() {
    const ids = /* @__PURE__ */ new Set();
    const nip33Queries = /* @__PURE__ */ new Map();
    const filters = [];
    for (const tag2 of this.items) {
      if (tag2[0] === "e" && tag2[1]) {
        ids.add(tag2[1]);
      } else if (tag2[0] === "a" && tag2[1]) {
        const [kind, pubkey, dTag] = tag2[1].split(":");
        if (!kind || !pubkey) continue;
        const key = `${kind}:${pubkey}`;
        const item = nip33Queries.get(key) || [];
        item.push(dTag || "");
        nip33Queries.set(key, item);
      }
    }
    if (ids.size > 0) {
      filters.push({ ids: Array.from(ids) });
    }
    if (nip33Queries.size > 0) {
      for (const [key, values] of nip33Queries.entries()) {
        const [kind, pubkey] = key.split(":");
        filters.push({
          kinds: [Number.parseInt(kind)],
          authors: [pubkey],
          "#d": values
        });
      }
    }
    return filters;
  }
};
var lists_default = NDKList;
var NDKNutzap = class _NDKNutzap extends NDKEvent {
  debug;
  _proofs = [];
  static kind = 9321;
  static kinds = [_NDKNutzap.kind];
  constructor(ndk2, event) {
    super(ndk2, event);
    this.kind ??= 9321;
    this.debug = ndk2?.debug.extend("nutzap") ?? (0, import_debug4.default)("ndk:nutzap");
    if (!this.alt) this.alt = "This is a nutzap";
    try {
      const proofTags = this.getMatchingTags("proof");
      if (proofTags.length) {
        this._proofs = proofTags.map((tag2) => JSON.parse(tag2[1]));
      } else {
        this._proofs = JSON.parse(this.content);
      }
    } catch {
      return;
    }
  }
  static from(event) {
    const e = new _NDKNutzap(event.ndk, event);
    if (!e._proofs || !e._proofs.length) return;
    return e;
  }
  set comment(comment) {
    this.content = comment ?? "";
  }
  get comment() {
    const c = this.tagValue("comment");
    if (c) return c;
    return this.content;
  }
  set proofs(proofs) {
    this._proofs = proofs;
    this.tags = this.tags.filter((tag2) => tag2[0] !== "proof");
    for (const proof of proofs) {
      this.tags.push(["proof", JSON.stringify(proof)]);
    }
  }
  get proofs() {
    return this._proofs;
  }
  get rawP2pk() {
    const firstProof = this.proofs[0];
    try {
      const secret = JSON.parse(firstProof.secret);
      let payload;
      if (typeof secret === "string") {
        payload = JSON.parse(secret);
        this.debug("stringified payload", firstProof.secret);
      } else if (typeof secret === "object") {
        payload = secret;
      }
      if (Array.isArray(payload) && payload[0] === "P2PK" && payload.length > 1 && typeof payload[1] === "object" && payload[1] !== null) {
        return payload[1].data;
      }
      if (typeof payload === "object" && payload !== null && typeof payload[1]?.data === "string") {
        return payload[1].data;
      }
    } catch (e) {
      this.debug("error parsing p2pk pubkey", e, this.proofs[0]);
    }
    return void 0;
  }
  /**
   * Gets the p2pk pubkey that is embedded in the first proof.
   *
   * Note that this returns a nostr pubkey, not a cashu pubkey (no "02" prefix)
   */
  get p2pk() {
    const rawP2pk = this.rawP2pk;
    if (!rawP2pk) return;
    return rawP2pk.startsWith("02") ? rawP2pk.slice(2) : rawP2pk;
  }
  /**
   * Get the mint where this nutzap proofs exist
   */
  get mint() {
    return this.tagValue("u");
  }
  set mint(value) {
    this.replaceTag(["u", value]);
  }
  get unit() {
    let _unit = this.tagValue("unit") ?? "sat";
    if (_unit?.startsWith("msat")) _unit = "sat";
    return _unit;
  }
  set unit(value) {
    this.removeTag("unit");
    if (value?.startsWith("msat")) throw new Error("msat is not allowed, use sat denomination instead");
    if (value) this.tag(["unit", value]);
  }
  get amount() {
    const amount = this.proofs.reduce((total, proof) => total + proof.amount, 0);
    return amount;
  }
  sender = this.author;
  /**
   * Set the target of the nutzap
   * @param target The target of the nutzap (a user or an event)
   */
  set target(target) {
    this.tags = this.tags.filter((t) => t[0] !== "p");
    if (target instanceof NDKEvent) {
      this.tags.push(target.tagReference());
    }
  }
  set recipientPubkey(pubkey) {
    this.removeTag("p");
    this.tag(["p", pubkey]);
  }
  get recipientPubkey() {
    return this.tagValue("p");
  }
  get recipient() {
    const pubkey = this.recipientPubkey;
    if (this.ndk) return this.ndk.getUser({ pubkey });
    return new NDKUser({ pubkey });
  }
  async toNostrEvent() {
    if (this.unit === "msat") {
      this.unit = "sat";
    }
    this.removeTag("amount");
    this.tags.push(["amount", this.amount.toString()]);
    const event = await super.toNostrEvent();
    event.content = this.comment;
    return event;
  }
  /**
   * Validates that the nutzap conforms to NIP-61
   */
  get isValid() {
    let eTagCount = 0;
    let pTagCount = 0;
    let mintTagCount = 0;
    for (const tag2 of this.tags) {
      if (tag2[0] === "e") eTagCount++;
      if (tag2[0] === "p") pTagCount++;
      if (tag2[0] === "u") mintTagCount++;
    }
    return (
      // exactly one recipient and mint
      pTagCount === 1 && mintTagCount === 1 && // must have at most one e tag
      eTagCount <= 1 && // must have at least one proof
      this.proofs.length > 0
    );
  }
};
var NDKSimpleGroupMemberList = class _NDKSimpleGroupMemberList extends NDKEvent {
  relaySet;
  memberSet = /* @__PURE__ */ new Set();
  static kind = 39002;
  static kinds = [
    39002
    /* GroupMembers */
  ];
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind ??= 39002;
    this.memberSet = new Set(this.members);
  }
  static from(event) {
    return new _NDKSimpleGroupMemberList(event.ndk, event);
  }
  get members() {
    return this.getMatchingTags("p").map((tag2) => tag2[1]);
  }
  hasMember(member) {
    return this.memberSet.has(member);
  }
  async publish(relaySet, timeoutMs, requiredRelayCount) {
    relaySet ??= this.relaySet;
    return super.publishReplaceable(relaySet, timeoutMs, requiredRelayCount);
  }
};
var NDKSimpleGroupMetadata = class _NDKSimpleGroupMetadata extends NDKEvent {
  static kind = 39e3;
  static kinds = [
    39e3
    /* GroupMetadata */
  ];
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind ??= 39e3;
  }
  static from(event) {
    return new _NDKSimpleGroupMetadata(event.ndk, event);
  }
  get name() {
    return this.tagValue("name");
  }
  get picture() {
    return this.tagValue("picture");
  }
  get about() {
    return this.tagValue("about");
  }
  get scope() {
    if (this.getMatchingTags("public").length > 0) return "public";
    if (this.getMatchingTags("public").length > 0) return "private";
    return void 0;
  }
  set scope(scope) {
    this.removeTag("public");
    this.removeTag("private");
    if (scope === "public") {
      this.tags.push(["public", ""]);
    } else if (scope === "private") {
      this.tags.push(["private", ""]);
    }
  }
  get access() {
    if (this.getMatchingTags("open").length > 0) return "open";
    if (this.getMatchingTags("closed").length > 0) return "closed";
    return void 0;
  }
  set access(access) {
    this.removeTag("open");
    this.removeTag("closed");
    if (access === "open") {
      this.tags.push(["open", ""]);
    } else if (access === "closed") {
      this.tags.push(["closed", ""]);
    }
  }
};
function strToPosition(positionStr) {
  const [x, y] = positionStr.split(",").map(Number);
  return { x, y };
}
function strToDimension(dimensionStr) {
  const [width, height] = dimensionStr.split("x").map(Number);
  return { width, height };
}
var NDKStorySticker = class _NDKStorySticker {
  static Text = "text";
  static Pubkey = "pubkey";
  static Event = "event";
  static Prompt = "prompt";
  static Countdown = "countdown";
  type;
  value;
  position;
  dimension;
  properties;
  constructor(arg) {
    if (Array.isArray(arg)) {
      const tag2 = arg;
      if (tag2[0] !== "sticker" || tag2.length < 5) {
        throw new Error("Invalid sticker tag");
      }
      this.type = tag2[1];
      this.value = tag2[2];
      this.position = strToPosition(tag2[3]);
      this.dimension = strToDimension(tag2[4]);
      const props = {};
      for (let i2 = 5; i2 < tag2.length; i2++) {
        const [key, ...rest] = tag2[i2].split(" ");
        props[key] = rest.join(" ");
      }
      if (Object.keys(props).length > 0) {
        this.properties = props;
      }
    } else {
      this.type = arg;
      this.value = void 0;
      this.position = { x: 0, y: 0 };
      this.dimension = { width: 0, height: 0 };
    }
  }
  static fromTag(tag2) {
    try {
      return new _NDKStorySticker(tag2);
    } catch {
      return null;
    }
  }
  get style() {
    return this.properties?.style;
  }
  set style(style) {
    if (style) this.properties = { ...this.properties, style };
    else delete this.properties?.style;
  }
  get rotation() {
    return this.properties?.rot ? Number.parseFloat(this.properties.rot) : void 0;
  }
  set rotation(rotation) {
    if (rotation !== void 0) {
      this.properties = { ...this.properties, rot: rotation.toString() };
    } else {
      delete this.properties?.rot;
    }
  }
  /**
   * Checks if the sticker is valid.
   *
   * @returns {boolean} - True if the sticker is valid, false otherwise.
   */
  get isValid() {
    return this.hasValidDimensions() && this.hasValidPosition();
  }
  hasValidDimensions = () => {
    return typeof this.dimension.width === "number" && typeof this.dimension.height === "number" && !Number.isNaN(this.dimension.width) && !Number.isNaN(this.dimension.height);
  };
  hasValidPosition = () => {
    return typeof this.position.x === "number" && typeof this.position.y === "number" && !Number.isNaN(this.position.x) && !Number.isNaN(this.position.y);
  };
  toTag() {
    if (!this.isValid) {
      const errors = [
        !this.hasValidDimensions() ? "dimensions is invalid" : void 0,
        !this.hasValidPosition() ? "position is invalid" : void 0
      ].filter(Boolean);
      throw new Error(`Invalid sticker: ${errors.join(", ")}`);
    }
    let value;
    switch (this.type) {
      case "event":
        value = this.value.tagId();
        break;
      case "pubkey":
        value = this.value.pubkey;
        break;
      default:
        value = this.value;
    }
    const tag2 = ["sticker", this.type, value, coordinates(this.position), dimension(this.dimension)];
    if (this.properties) {
      for (const [key, propValue] of Object.entries(this.properties)) {
        tag2.push(`${key} ${propValue}`);
      }
    }
    return tag2;
  }
};
var NDKStory = class _NDKStory extends NDKEvent {
  static kind = 23;
  static kinds = [
    23
    /* Story */
  ];
  _imeta;
  _dimensions;
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind ??= 23;
    if (rawEvent) {
      for (const tag2 of rawEvent.tags) {
        switch (tag2[0]) {
          case "imeta":
            this._imeta = mapImetaTag(tag2);
            break;
          case "dim":
            this.dimensions = strToDimension(tag2[1]);
            break;
        }
      }
    }
  }
  /**
   * Creates a NDKStory from an existing NDKEvent.
   *
   * @param event NDKEvent to create the NDKStory from.
   * @returns NDKStory
   */
  static from(event) {
    return new _NDKStory(event.ndk, event);
  }
  /**
   * Checks if the story is valid (has exactly one imeta tag).
   */
  get isValid() {
    return !!this.imeta;
  }
  /**
   * Gets the first imeta tag (there should only be one).
   */
  get imeta() {
    return this._imeta;
  }
  /**
   * Sets a single imeta tag, replacing any existing ones.
   */
  set imeta(tag2) {
    this._imeta = tag2;
    this.tags = this.tags.filter((t) => t[0] !== "imeta");
    if (tag2) {
      this.tags.push(imetaTagToTag(tag2));
    }
  }
  /**
   * Getter for the story dimensions.
   *
   * @returns {NDKStoryDimension | undefined} - The story dimensions if available, otherwise undefined.
   */
  get dimensions() {
    const dimTag = this.tagValue("dim");
    if (!dimTag) return void 0;
    return strToDimension(dimTag);
  }
  /**
   * Setter for the story dimensions.
   *
   * @param {NDKStoryDimension | undefined} dimensions - The dimensions to set for the story.
   */
  set dimensions(dimensions) {
    this.removeTag("dim");
    if (dimensions) {
      this.tags.push(["dim", `${dimensions.width}x${dimensions.height}`]);
    }
  }
  /**
   * Getter for the story duration.
   *
   * @returns {number | undefined} - The story duration in seconds if available, otherwise undefined.
   */
  get duration() {
    const durTag = this.tagValue("dur");
    if (!durTag) return void 0;
    return Number.parseInt(durTag);
  }
  /**
   * Setter for the story duration.
   *
   * @param {number | undefined} duration - The duration in seconds to set for the story.
   */
  set duration(duration) {
    this.removeTag("dur");
    if (duration !== void 0) {
      this.tags.push(["dur", duration.toString()]);
    }
  }
  /**
   * Gets all stickers from the story.
   *
   * @returns {NDKStorySticker[]} - Array of stickers in the story.
   */
  get stickers() {
    const stickers = [];
    for (const tag2 of this.tags) {
      if (tag2[0] !== "sticker" || tag2.length < 5) continue;
      const sticker = NDKStorySticker.fromTag(tag2);
      if (sticker) stickers.push(sticker);
    }
    return stickers;
  }
  /**
   * Adds a sticker to the story.
   *
   * @param {NDKStorySticker|StorySticker} sticker - The sticker to add.
   */
  addSticker(sticker) {
    let stickerToAdd;
    if (sticker instanceof NDKStorySticker) {
      stickerToAdd = sticker;
    } else {
      const tag2 = [
        "sticker",
        sticker.type,
        typeof sticker.value === "string" ? sticker.value : "",
        coordinates(sticker.position),
        dimension(sticker.dimension)
      ];
      if (sticker.properties) {
        for (const [key, value] of Object.entries(sticker.properties)) {
          tag2.push(`${key} ${value}`);
        }
      }
      stickerToAdd = new NDKStorySticker(tag2);
      stickerToAdd.value = sticker.value;
    }
    if (stickerToAdd.type === "pubkey") {
      this.tag(stickerToAdd.value);
    } else if (stickerToAdd.type === "event") {
      this.tag(stickerToAdd.value);
    }
    this.tags.push(stickerToAdd.toTag());
  }
  /**
   * Removes a sticker from the story.
   *
   * @param {number} index - The index of the sticker to remove.
   */
  removeSticker(index) {
    const stickers = this.stickers;
    if (index < 0 || index >= stickers.length) return;
    let stickerCount = 0;
    for (let i2 = 0; i2 < this.tags.length; i2++) {
      if (this.tags[i2][0] === "sticker") {
        if (stickerCount === index) {
          this.tags.splice(i2, 1);
          break;
        }
        stickerCount++;
      }
    }
  }
};
var coordinates = (position) => `${position.x},${position.y}`;
var dimension = (dimension2) => `${dimension2.width}x${dimension2.height}`;
var possibleIntervalFrequencies = [
  "daily",
  "weekly",
  "monthly",
  "quarterly",
  "yearly"
];
function newAmount(amount, currency, term) {
  return ["amount", amount.toString(), currency, term];
}
function parseTagToSubscriptionAmount(tag2) {
  const amount = Number.parseInt(tag2[1]);
  if (Number.isNaN(amount) || amount === void 0 || amount === null || amount <= 0) return void 0;
  const currency = tag2[2];
  if (currency === void 0 || currency === "") return void 0;
  const term = tag2[3];
  if (term === void 0) return void 0;
  if (!possibleIntervalFrequencies.includes(term)) return void 0;
  return {
    amount,
    currency,
    term
  };
}
var NDKSubscriptionTier = class _NDKSubscriptionTier extends NDKArticle {
  static kind = 37001;
  static kinds = [
    37001
    /* SubscriptionTier */
  ];
  constructor(ndk2, rawEvent) {
    const k = rawEvent?.kind ?? 37001;
    super(ndk2, rawEvent);
    this.kind = k;
  }
  /**
   * Creates a new NDKSubscriptionTier from an event
   * @param event
   * @returns NDKSubscriptionTier
   */
  static from(event) {
    return new _NDKSubscriptionTier(event.ndk, event);
  }
  /**
   * Returns perks for this tier
   */
  get perks() {
    return this.getMatchingTags("perk").map((tag2) => tag2[1]).filter((perk) => perk !== void 0);
  }
  /**
   * Adds a perk to this tier
   */
  addPerk(perk) {
    this.tags.push(["perk", perk]);
  }
  /**
   * Returns the amount for this tier
   */
  get amounts() {
    return this.getMatchingTags("amount").map((tag2) => parseTagToSubscriptionAmount(tag2)).filter((a) => a !== void 0);
  }
  /**
   * Adds an amount to this tier
   * @param amount Amount in the smallest unit of the currency (e.g. cents, msats)
   * @param currency Currency code. Use msat for millisatoshis
   * @param term One of daily, weekly, monthly, quarterly, yearly
   */
  addAmount(amount, currency, term) {
    this.tags.push(newAmount(amount, currency, term));
  }
  /**
   * Sets a relay where content related to this tier can be found
   * @param relayUrl URL of the relay
   */
  set relayUrl(relayUrl) {
    this.tags.push(["r", relayUrl]);
  }
  /**
   * Returns the relay URLs for this tier
   */
  get relayUrls() {
    return this.getMatchingTags("r").map((tag2) => tag2[1]).filter((relay) => relay !== void 0);
  }
  /**
   * Gets the verifier pubkey for this tier. This is the pubkey that will generate
   * subscription payment receipts
   */
  get verifierPubkey() {
    return this.tagValue("p");
  }
  /**
   * Sets the verifier pubkey for this tier.
   */
  set verifierPubkey(pubkey) {
    this.removeTag("p");
    if (pubkey) this.tags.push(["p", pubkey]);
  }
  /**
   * Checks if this tier is valid
   */
  get isValid() {
    return this.title !== void 0 && // Must have a title
    this.amounts.length > 0;
  }
};
var NDKVideo = class _NDKVideo extends NDKEvent {
  static kind = 21;
  static kinds = [
    34235,
    34236,
    22,
    21
    /* Video */
  ];
  _imetas;
  /**
   * Creates a NDKArticle from an existing NDKEvent.
   *
   * @param event NDKEvent to create the NDKArticle from.
   * @returns NDKArticle
   */
  static from(event) {
    return new _NDKVideo(event.ndk, event.rawEvent());
  }
  /**
   * Getter for the article title.
   *
   * @returns {string | undefined} - The article title if available, otherwise undefined.
   */
  get title() {
    return this.tagValue("title");
  }
  /**
   * Setter for the article title.
   *
   * @param {string | undefined} title - The title to set for the article.
   */
  set title(title) {
    this.removeTag("title");
    if (title) this.tags.push(["title", title]);
  }
  /**
   * Getter for the article thumbnail.
   *
   * @returns {string | undefined} - The article thumbnail if available, otherwise undefined.
   */
  get thumbnail() {
    let thumbnail;
    if (this.imetas && this.imetas.length > 0) {
      thumbnail = this.imetas[0].image?.[0];
    }
    return thumbnail ?? this.tagValue("thumb");
  }
  get imetas() {
    if (this._imetas) return this._imetas;
    this._imetas = this.tags.filter((tag2) => tag2[0] === "imeta").map(mapImetaTag);
    return this._imetas;
  }
  set imetas(tags) {
    this._imetas = tags;
    this.tags = this.tags.filter((tag2) => tag2[0] !== "imeta");
    this.tags.push(...tags.map(imetaTagToTag));
  }
  get url() {
    if (this.imetas && this.imetas.length > 0) {
      return this.imetas[0].url;
    }
    return this.tagValue("url");
  }
  /**
   * Getter for the article's publication timestamp.
   *
   * @returns {number | undefined} - The Unix timestamp of when the article was published or undefined.
   */
  get published_at() {
    const tag2 = this.tagValue("published_at");
    if (tag2) {
      return Number.parseInt(tag2);
    }
    return void 0;
  }
  /**
   * Generates content tags for the article.
   *
   * This method first checks and sets the publication date if not available,
   * and then generates content tags based on the base NDKEvent class.
   *
   * @returns {ContentTag} - The generated content tags.
   */
  async generateTags() {
    super.generateTags();
    if (!this.kind) {
      if (this.imetas?.[0]?.dim) {
        const [width, height] = this.imetas[0].dim.split("x");
        const isPortrait = width && height && Number.parseInt(width) < Number.parseInt(height);
        const isShort = this.duration && this.duration < 120;
        if (isShort && isPortrait) this.kind = 22;
        else this.kind = 21;
      }
    }
    return super.generateTags();
  }
  get duration() {
    const tag2 = this.tagValue("duration");
    if (tag2) {
      return Number.parseInt(tag2);
    }
    return void 0;
  }
  /**
   * Setter for the video's duration
   *
   * @param {number | undefined} duration - The duration to set for the video (in seconds)
   */
  set duration(dur) {
    this.removeTag("duration");
    if (dur !== void 0) {
      this.tags.push(["duration", Math.floor(dur).toString()]);
    }
  }
};
var NDKWiki = class _NDKWiki extends NDKArticle {
  static kind = 30818;
  static kinds = [
    30818
    /* Wiki */
  ];
  static from(event) {
    return new _NDKWiki(event.ndk, event.rawEvent());
  }
  get isDefered() {
    return this.hasTag("a", "defer");
  }
  get deferedId() {
    return this.tagValue("a", "defer");
  }
  /**
   * Defers the author's wiki event to another wiki event.
   *
   * Wiki-events can tag other wiki-events with a `defer` marker to indicate that it considers someone else's entry as a "better" version of itself. If using a `defer` marker both `a` and `e` tags SHOULD be used.
   *
   * @example
   * myWiki.defer = betterWikiEntryOnTheSameTopic;
   * myWiki.publishReplaceable()
   */
  set defer(deferedTo) {
    this.removeTag("a", "defer");
    this.tag(deferedTo, "defer");
  }
};
var NDKWikiMergeRequest = class _NDKWikiMergeRequest extends NDKEvent {
  static kinds = [
    818
    /* WikiMergeRequest */
  ];
  static from(event) {
    return new _NDKWikiMergeRequest(event.ndk, event.rawEvent());
  }
  /**
   * The target ID (<kind:pubkey:d-tag>) of the wiki event to merge into.
   */
  get targetId() {
    return this.tagValue("a");
  }
  /**
   * Sets the target ID (<kind:pubkey:d-tag>) of the wiki event to merge into.
   */
  set target(targetEvent) {
    this.tags = this.tags.filter((tag2) => {
      if (tag2[0] === "a") return true;
      if (tag2[0] === "e" && tag2[3] !== "source") return true;
    });
    this.tag(targetEvent);
  }
  /**
   * The source ID of the wiki event to merge from.
   */
  get sourceId() {
    return this.tagValue("e", "source");
  }
  /**
   * Sets the event we are asking to get merged into the target.
   */
  set source(sourceEvent) {
    this.removeTag("e", "source");
    this.tag(sourceEvent, "source", false, "e");
  }
};
var NDKBlossomList = class _NDKBlossomList extends NDKEvent {
  static kinds = [
    10063
    /* BlossomList */
  ];
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind ??= 10063;
  }
  static from(ndkEvent) {
    return new _NDKBlossomList(ndkEvent.ndk, ndkEvent.rawEvent());
  }
  /**
   * Returns all Blossom servers in the list
   */
  get servers() {
    return this.tags.filter((tag2) => tag2[0] === "server").map((tag2) => tag2[1]);
  }
  /**
   * Sets the list of Blossom servers
   */
  set servers(servers) {
    this.tags = this.tags.filter((tag2) => tag2[0] !== "server");
    for (const server of servers) {
      this.tags.push(["server", server]);
    }
  }
  /**
   * Returns the default Blossom server (first in the list)
   */
  get default() {
    const servers = this.servers;
    return servers.length > 0 ? servers[0] : void 0;
  }
  /**
   * Sets the default Blossom server by moving it to the beginning of the list
   */
  set default(server) {
    if (!server) return;
    const currentServers = this.servers;
    const filteredServers = currentServers.filter((s) => s !== server);
    this.servers = [server, ...filteredServers];
  }
  /**
   * Adds a server to the list if it doesn't already exist
   */
  addServer(server) {
    if (!server) return;
    const currentServers = this.servers;
    if (!currentServers.includes(server)) {
      this.servers = [...currentServers, server];
    }
  }
  /**
   * Removes a server from the list
   */
  removeServer(server) {
    if (!server) return;
    const currentServers = this.servers;
    this.servers = currentServers.filter((s) => s !== server);
  }
};
var NDKFollowPack = class _NDKFollowPack extends NDKEvent {
  static kind = 39089;
  static kinds = [
    39089,
    39092
    /* MediaFollowPack */
  ];
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind ??= 39089;
  }
  /**
   * Converts a generic NDKEvent to an NDKFollowPack.
   */
  static from(ndkEvent) {
    return new _NDKFollowPack(ndkEvent.ndk, ndkEvent);
  }
  /**
   * Gets the title from the tags.
   */
  get title() {
    return this.tagValue("title");
  }
  /**
   * Sets the title tag.
   */
  set title(value) {
    this.removeTag("title");
    if (value) this.tags.push(["title", value]);
  }
  /**
   * Gets the image URL from the tags.
   */
  /**
   * Gets the image URL from the tags.
   * Looks for an imeta tag first (returns its url), then falls back to the image tag.
   */
  get image() {
    const imetaTag = this.tags.find((tag2) => tag2[0] === "imeta");
    if (imetaTag) {
      const imeta = mapImetaTag(imetaTag);
      if (imeta.url) return imeta.url;
    }
    return this.tagValue("image");
  }
  /**
   * Sets the image URL tag.
   */
  /**
   * Sets the image tag.
   * Accepts a string (URL) or an NDKImetaTag.
   * If given an NDKImetaTag, sets both the imeta tag and the image tag (using the url).
   * If undefined, removes both tags.
   */
  set image(value) {
    this.tags = this.tags.filter((tag2) => tag2[0] !== "imeta" && tag2[0] !== "image");
    if (typeof value === "string") {
      if (value !== void 0) {
        this.tags.push(["image", value]);
      }
    } else if (value && typeof value === "object") {
      this.tags.push(imetaTagToTag(value));
      if (value.url) {
        this.tags.push(["image", value.url]);
      }
    }
  }
  /**
   * Gets all pubkeys from p tags.
   */
  get pubkeys() {
    return Array.from(new Set(this.tags.filter((tag2) => tag2[0] === "p").map((tag2) => tag2[1])));
  }
  /**
   * Sets the pubkeys (replaces all p tags).
   */
  set pubkeys(pubkeys) {
    this.tags = this.tags.filter((tag2) => tag2[0] !== "p");
    for (const pubkey of pubkeys) {
      this.tags.push(["p", pubkey]);
    }
  }
  /**
   * Gets the description from the tags.
   */
  get description() {
    return this.tagValue("description");
  }
  /**
   * Sets the description tag.
   */
  set description(value) {
    this.removeTag("description");
    if (value) this.tags.push(["description", value]);
  }
};
var signerRegistry = /* @__PURE__ */ new Map();
function registerSigner(type, signerClass) {
  signerRegistry.set(type, signerClass);
}
var NDKPrivateKeySigner = class _NDKPrivateKeySigner {
  _user;
  _privateKey;
  _pubkey;
  /**
   * Create a new signer from a private key.
   * @param privateKey - The private key to use in hex form or nsec.
   * @param ndk - The NDK instance to use.
   */
  constructor(privateKeyOrNsec, ndk2) {
    if (typeof privateKeyOrNsec === "string") {
      if (privateKeyOrNsec.startsWith("nsec1")) {
        const { type, data } = nip19_exports.decode(privateKeyOrNsec);
        if (type === "nsec") this._privateKey = data;
        else throw new Error("Invalid private key provided.");
      } else if (privateKeyOrNsec.length === 64) {
        this._privateKey = hexToBytes3(privateKeyOrNsec);
      } else {
        throw new Error("Invalid private key provided.");
      }
    } else {
      this._privateKey = privateKeyOrNsec;
    }
    this._pubkey = getPublicKey(this._privateKey);
    if (ndk2) this._user = ndk2.getUser({ pubkey: this._pubkey });
    this._user ??= new NDKUser({ pubkey: this._pubkey });
  }
  /**
   * Get the private key in hex form.
   */
  get privateKey() {
    if (!this._privateKey) throw new Error("Not ready");
    return bytesToHex4(this._privateKey);
  }
  /**
   * Get the public key in hex form.
   */
  get pubkey() {
    if (!this._pubkey) throw new Error("Not ready");
    return this._pubkey;
  }
  /**
   * Get the private key in nsec form.
   */
  get nsec() {
    if (!this._privateKey) throw new Error("Not ready");
    return nip19_exports.nsecEncode(this._privateKey);
  }
  /**
   * Get the public key in npub form.
   */
  get npub() {
    if (!this._pubkey) throw new Error("Not ready");
    return nip19_exports.npubEncode(this._pubkey);
  }
  /**
   * Generate a new private key.
   */
  static generate() {
    const privateKey = generateSecretKey();
    return new _NDKPrivateKeySigner(privateKey);
  }
  /**
   * Noop in NDKPrivateKeySigner.
   */
  async blockUntilReady() {
    return this._user;
  }
  /**
   * Get the user.
   */
  async user() {
    return this._user;
  }
  /**
   * Get the user.
   */
  get userSync() {
    return this._user;
  }
  async sign(event) {
    if (!this._privateKey) {
      throw Error("Attempted to sign without a private key");
    }
    return finalizeEvent(event, this._privateKey).sig;
  }
  async encryptionEnabled(scheme) {
    const enabled = [];
    if (!scheme || scheme === "nip04") enabled.push("nip04");
    if (!scheme || scheme === "nip44") enabled.push("nip44");
    return enabled;
  }
  async encrypt(recipient, value, scheme) {
    if (!this._privateKey || !this.privateKey) {
      throw Error("Attempted to encrypt without a private key");
    }
    const recipientHexPubKey = recipient.pubkey;
    if (scheme === "nip44") {
      const conversationKey = nip44_exports.v2.utils.getConversationKey(this._privateKey, recipientHexPubKey);
      return await nip44_exports.v2.encrypt(value, conversationKey);
    }
    return await nip04_exports.encrypt(this._privateKey, recipientHexPubKey, value);
  }
  async decrypt(sender, value, scheme) {
    if (!this._privateKey || !this.privateKey) {
      throw Error("Attempted to decrypt without a private key");
    }
    const senderHexPubKey = sender.pubkey;
    if (scheme === "nip44") {
      const conversationKey = nip44_exports.v2.utils.getConversationKey(this._privateKey, senderHexPubKey);
      return await nip44_exports.v2.decrypt(value, conversationKey);
    }
    return await nip04_exports.decrypt(this._privateKey, senderHexPubKey, value);
  }
  /**
   * Serializes the signer's private key into a storable format.
   * @returns A JSON string containing the type and the hex private key.
   */
  toPayload() {
    if (!this._privateKey) throw new Error("Private key not available");
    const payload = {
      type: "private-key",
      payload: this.privateKey
      // Use the hex private key
    };
    return JSON.stringify(payload);
  }
  /**
   * Deserializes the signer from a payload string.
   * @param payloadString The JSON string obtained from toPayload().
   * @param ndk Optional NDK instance.
   * @returns An instance of NDKPrivateKeySigner.
   */
  static async fromPayload(payloadString, ndk2) {
    const payload = JSON.parse(payloadString);
    if (payload.type !== "private-key") {
      throw new Error(`Invalid payload type: expected 'private-key', got ${payload.type}`);
    }
    if (!payload.payload || typeof payload.payload !== "string") {
      throw new Error("Invalid payload content for private-key signer");
    }
    return new _NDKPrivateKeySigner(payload.payload, ndk2);
  }
};
registerSigner("private-key", NDKPrivateKeySigner);
var NDKProject = class _NDKProject extends NDKEvent {
  static kind = 31933;
  static kinds = [
    31933
    /* Project */
  ];
  _signer;
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind = 31933;
  }
  static from(event) {
    return new _NDKProject(event.ndk, event.rawEvent());
  }
  set repo(value) {
    this.removeTag("repo");
    if (value) this.tags.push(["repo", value]);
  }
  set hashtags(values) {
    this.removeTag("hashtags");
    if (values.filter((t) => t.length > 0).length) this.tags.push(["hashtags", ...values]);
  }
  get hashtags() {
    const tag2 = this.tags.find((tag22) => tag22[0] === "hashtags");
    return tag2 ? tag2.slice(1) : [];
  }
  get repo() {
    return this.tagValue("repo");
  }
  get title() {
    return this.tagValue("title");
  }
  set title(value) {
    this.removeTag("title");
    if (value) this.tags.push(["title", value]);
  }
  get picture() {
    return this.tagValue("picture");
  }
  set picture(value) {
    this.removeTag("picture");
    if (value) this.tags.push(["picture", value]);
  }
  set description(value) {
    this.content = value;
  }
  get description() {
    return this.content;
  }
  /**
   * The project slug, derived from the 'd' tag.
   */
  get slug() {
    return this.dTag ?? "empty-dtag";
  }
  async getSigner() {
    if (this._signer) return this._signer;
    const encryptedKey = this.tagValue("key");
    if (!encryptedKey) {
      this._signer = NDKPrivateKeySigner.generate();
      await this.encryptAndSaveNsec();
    } else {
      const decryptedKey = await this.ndk?.signer?.decrypt(this.ndk.activeUser, encryptedKey);
      if (!decryptedKey) {
        throw new Error("Failed to decrypt project key or missing signer context.");
      }
      this._signer = new NDKPrivateKeySigner(decryptedKey);
    }
    return this._signer;
  }
  async getNsec() {
    const signer = await this.getSigner();
    return signer.privateKey;
  }
  async setNsec(value) {
    this._signer = new NDKPrivateKeySigner(value);
    await this.encryptAndSaveNsec();
  }
  async encryptAndSaveNsec() {
    if (!this._signer) throw new Error("Signer is not set.");
    const key = this._signer.privateKey;
    const encryptedKey = await this.ndk?.signer?.encrypt(this.ndk.activeUser, key);
    if (encryptedKey) {
      this.removeTag("key");
      this.tags.push(["key", encryptedKey]);
    }
  }
};
var NDKThread = class _NDKThread extends NDKEvent {
  static kind = 11;
  static kinds = [
    11
    /* Thread */
  ];
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind ??= 11;
  }
  /**
   * Creates an NDKThread from an existing NDKEvent.
   *
   * @param event NDKEvent to create the NDKThread from.
   * @returns NDKThread
   */
  static from(event) {
    return new _NDKThread(event.ndk, event);
  }
  /**
   * Gets the title of the thread.
   */
  get title() {
    return this.tagValue("title");
  }
  /**
   * Sets the title of the thread.
   */
  set title(title) {
    this.removeTag("title");
    if (title) {
      this.tags.push(["title", title]);
    }
  }
};
var NDKDraft = class _NDKDraft extends NDKEvent {
  _event;
  static kind = 31234;
  static kinds = [
    31234,
    1234
    /* DraftCheckpoint */
  ];
  /**
   * Can be used to include a different pubkey as part of the draft.
   * This is useful when we want to make the draft a proposal for a different user to publish.
   */
  counterparty;
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind ??= 31234;
  }
  static from(event) {
    return new _NDKDraft(event.ndk, event);
  }
  /**
   * Sets an identifier (i.e. d-tag)
   */
  set identifier(id) {
    this.removeTag("d");
    this.tags.push(["d", id]);
  }
  get identifier() {
    return this.dTag;
  }
  /**
   * Event that is to be saved.
   */
  set event(e) {
    if (!(e instanceof NDKEvent)) this._event = new NDKEvent(void 0, e);
    else this._event = e;
    this.prepareEvent();
  }
  /**
   * Marks the event as a checkpoint for another draft event.
   */
  set checkpoint(parent) {
    if (parent) {
      this.tags.push(parent.tagReference());
      this.kind = 1234;
    } else {
      this.removeTag("a");
      this.kind = 31234;
    }
  }
  get isCheckpoint() {
    return this.kind === 1234;
  }
  get isProposal() {
    const pTag = this.tagValue("p");
    return !!pTag && pTag !== this.pubkey;
  }
  /**
   * Gets the event.
   * @param param0
   * @returns NDKEvent of the draft event or null if the draft event has been deleted (emptied).
   */
  async getEvent(signer) {
    if (this._event) return this._event;
    signer ??= this.ndk?.signer;
    if (!signer) throw new Error("No signer available");
    if (this.content && this.content.length > 0) {
      try {
        const ownPubkey = signer.pubkey;
        const pubkeys = [this.tagValue("p"), this.pubkey].filter(Boolean);
        const counterpartyPubkey = pubkeys.find((pubkey) => pubkey !== ownPubkey);
        let user;
        user = new NDKUser({ pubkey: counterpartyPubkey ?? ownPubkey });
        await this.decrypt(user, signer);
        const payload = JSON.parse(this.content);
        this._event = await wrapEvent3(new NDKEvent(this.ndk, payload));
        return this._event;
      } catch (e) {
        console.error(e);
        return void 0;
      }
    } else {
      return null;
    }
  }
  prepareEvent() {
    if (!this._event) throw new Error("No event has been provided");
    this.removeTag("k");
    if (this._event.kind) this.tags.push(["k", this._event.kind.toString()]);
    this.content = JSON.stringify(this._event.rawEvent());
  }
  /**
   * Generates draft event.
   *
   * @param signer: Optional signer to encrypt with
   * @param publish: Whether to publish, optionally specifying relaySet to publish to
   */
  async save({ signer, publish, relaySet }) {
    signer ??= this.ndk?.signer;
    if (!signer) throw new Error("No signer available");
    const user = this.counterparty || await signer.user();
    await this.encrypt(user, signer);
    if (this.counterparty) {
      const pubkey = this.counterparty.pubkey;
      this.removeTag("p");
      this.tags.push(["p", pubkey]);
    }
    if (publish === false) return;
    return this.publishReplaceable(relaySet);
  }
};
var NDKTask = class _NDKTask extends NDKEvent {
  static kind = 1934;
  static kinds = [
    1934
    /* Task */
  ];
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind = 1934;
  }
  static from(event) {
    return new _NDKTask(event.ndk, event.rawEvent());
  }
  set title(value) {
    this.removeTag("title");
    if (value) this.tags.push(["title", value]);
  }
  get title() {
    return this.tagValue("title");
  }
  set project(project) {
    this.removeTag("a");
    this.tags.push(project.tagReference());
  }
  get projectSlug() {
    const tag2 = this.getMatchingTags("a")[0];
    return tag2 ? tag2[1].split(/:/)?.[2] : void 0;
  }
};
var NDKProjectTemplate = class _NDKProjectTemplate extends NDKEvent {
  static kind = 30717;
  static kinds = [
    30717
    /* ProjectTemplate */
  ];
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind = 30717;
  }
  static from(event) {
    return new _NDKProjectTemplate(event.ndk, event.rawEvent());
  }
  /**
   * Template identifier from 'd' tag
   */
  get templateId() {
    return this.dTag ?? "";
  }
  set templateId(value) {
    this.dTag = value;
  }
  /**
   * Template name from 'title' tag
   */
  get name() {
    return this.tagValue("title") ?? "";
  }
  set name(value) {
    this.removeTag("title");
    if (value) this.tags.push(["title", value]);
  }
  /**
   * Template description from 'description' tag
   */
  get description() {
    return this.tagValue("description") ?? "";
  }
  set description(value) {
    this.removeTag("description");
    if (value) this.tags.push(["description", value]);
  }
  /**
   * Git repository URL from 'uri' tag
   */
  get repoUrl() {
    return this.tagValue("uri") ?? "";
  }
  set repoUrl(value) {
    this.removeTag("uri");
    if (value) this.tags.push(["uri", value]);
  }
  /**
   * Template preview image URL from 'image' tag
   */
  get image() {
    return this.tagValue("image");
  }
  set image(value) {
    this.removeTag("image");
    if (value) this.tags.push(["image", value]);
  }
  /**
   * Command to run from 'command' tag
   */
  get command() {
    return this.tagValue("command");
  }
  set command(value) {
    this.removeTag("command");
    if (value) this.tags.push(["command", value]);
  }
  /**
   * Agent configuration from 'agent' tag
   */
  get agentConfig() {
    const agentTag = this.tagValue("agent");
    if (!agentTag) return void 0;
    try {
      return JSON.parse(agentTag);
    } catch {
      return void 0;
    }
  }
  set agentConfig(value) {
    this.removeTag("agent");
    if (value) {
      this.tags.push(["agent", JSON.stringify(value)]);
    }
  }
  /**
   * Template tags from 't' tags
   */
  get templateTags() {
    return this.getMatchingTags("t").map((tag2) => tag2[1]).filter(Boolean);
  }
  set templateTags(values) {
    this.tags = this.tags.filter((tag2) => tag2[0] !== "t");
    values.forEach((value) => {
      if (value) this.tags.push(["t", value]);
    });
  }
};
var READ_MARKER = "read";
var WRITE_MARKER = "write";
var NDKRelayList = class _NDKRelayList extends NDKEvent {
  static kinds = [
    10002
    /* RelayList */
  ];
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind ??= 10002;
  }
  static from(ndkEvent) {
    return new _NDKRelayList(ndkEvent.ndk, ndkEvent.rawEvent());
  }
  get readRelayUrls() {
    return this.tags.filter((tag2) => tag2[0] === "r" || tag2[0] === "relay").filter((tag2) => !tag2[2] || tag2[2] && tag2[2] === READ_MARKER).map((tag2) => tryNormalizeRelayUrl(tag2[1])).filter((url) => !!url);
  }
  set readRelayUrls(relays) {
    for (const relay of relays) {
      this.tags.push(["r", relay, READ_MARKER]);
    }
  }
  get writeRelayUrls() {
    return this.tags.filter((tag2) => tag2[0] === "r" || tag2[0] === "relay").filter((tag2) => !tag2[2] || tag2[2] && tag2[2] === WRITE_MARKER).map((tag2) => tryNormalizeRelayUrl(tag2[1])).filter((url) => !!url);
  }
  set writeRelayUrls(relays) {
    for (const relay of relays) {
      this.tags.push(["r", relay, WRITE_MARKER]);
    }
  }
  get bothRelayUrls() {
    return this.tags.filter((tag2) => tag2[0] === "r" || tag2[0] === "relay").filter((tag2) => !tag2[2]).map((tag2) => tag2[1]);
  }
  set bothRelayUrls(relays) {
    for (const relay of relays) {
      this.tags.push(["r", relay]);
    }
  }
  get relays() {
    return this.tags.filter((tag2) => tag2[0] === "r" || tag2[0] === "relay").map((tag2) => tag2[1]);
  }
  /**
   * Provides a relaySet for the relays in this list.
   */
  get relaySet() {
    if (!this.ndk) throw new Error("NDKRelayList has no NDK instance");
    return new NDKRelaySet(
      new Set(this.relays.map((u) => this.ndk?.pool.getRelay(u)).filter((r) => !!r)),
      this.ndk
    );
  }
};
function relayListFromKind3(ndk2, contactList) {
  try {
    const content = JSON.parse(contactList.content);
    const relayList = new NDKRelayList(ndk2);
    const readRelays = /* @__PURE__ */ new Set();
    const writeRelays = /* @__PURE__ */ new Set();
    for (let [key, config] of Object.entries(content)) {
      try {
        key = normalizeRelayUrl(key);
      } catch {
        continue;
      }
      if (!config) {
        readRelays.add(key);
        writeRelays.add(key);
      } else {
        const relayConfig = config;
        if (relayConfig.write) writeRelays.add(key);
        if (relayConfig.read) readRelays.add(key);
      }
    }
    relayList.readRelayUrls = Array.from(readRelays);
    relayList.writeRelayUrls = Array.from(writeRelays);
    return relayList;
  } catch {
  }
  return void 0;
}
var NDKRepost = class _NDKRepost extends NDKEvent {
  _repostedEvents;
  static kinds = [6, 16];
  // Repost, GenericRepost
  static from(event) {
    return new _NDKRepost(event.ndk, event.rawEvent());
  }
  /**
   * Returns all reposted events by the current event.
   *
   * @param klass Optional class to convert the events to.
   * @returns
   */
  async repostedEvents(klass, opts) {
    const items = [];
    if (!this.ndk) throw new Error("NDK instance not set");
    if (this._repostedEvents !== void 0) return this._repostedEvents;
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
      kinds: [Number.parseInt(kind)],
      authors: [pubkey],
      "#d": [identifier]
    };
  }
  return { ids: [id] };
}
var NDKClassified = class _NDKClassified extends NDKEvent {
  static kinds = [
    30402
    /* Classified */
  ];
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind ??= 30402;
  }
  /**
   * Creates a NDKClassified from an existing NDKEvent.
   *
   * @param event NDKEvent to create the NDKClassified from.
   * @returns NDKClassified
   */
  static from(event) {
    return new _NDKClassified(event.ndk, event);
  }
  /**
   * Getter for the classified title.
   *
   * @returns {string | undefined} - The classified title if available, otherwise undefined.
   */
  get title() {
    return this.tagValue("title");
  }
  /**
   * Setter for the classified title.
   *
   * @param {string | undefined} title - The title to set for the classified.
   */
  set title(title) {
    this.removeTag("title");
    if (title) this.tags.push(["title", title]);
  }
  /**
   * Getter for the classified summary.
   *
   * @returns {string | undefined} - The classified summary if available, otherwise undefined.
   */
  get summary() {
    return this.tagValue("summary");
  }
  /**
   * Setter for the classified summary.
   *
   * @param {string | undefined} summary - The summary to set for the classified.
   */
  set summary(summary) {
    this.removeTag("summary");
    if (summary) this.tags.push(["summary", summary]);
  }
  /**
   * Getter for the classified's publication timestamp.
   *
   * @returns {number | undefined} - The Unix timestamp of when the classified was published or undefined.
   */
  get published_at() {
    const tag2 = this.tagValue("published_at");
    if (tag2) {
      return Number.parseInt(tag2);
    }
    return void 0;
  }
  /**
   * Setter for the classified's publication timestamp.
   *
   * @param {number | undefined} timestamp - The Unix timestamp to set for the classified's publication date.
   */
  set published_at(timestamp) {
    this.removeTag("published_at");
    if (timestamp !== void 0) {
      this.tags.push(["published_at", timestamp.toString()]);
    }
  }
  /**
   * Getter for the classified location.
   *
   * @returns {string | undefined} - The classified location if available, otherwise undefined.
   */
  get location() {
    return this.tagValue("location");
  }
  /**
   * Setter for the classified location.
   *
   * @param {string | undefined} location - The location to set for the classified.
   */
  set location(location2) {
    this.removeTag("location");
    if (location2) this.tags.push(["location", location2]);
  }
  /**
   * Getter for the classified price.
   *
   * @returns {NDKClassifiedPriceTag | undefined} - The classified price if available, otherwise undefined.
   */
  get price() {
    const priceTag = this.tags.find((tag2) => tag2[0] === "price");
    if (priceTag) {
      return {
        amount: Number.parseFloat(priceTag[1]),
        currency: priceTag[2],
        frequency: priceTag[3]
      };
    }
    return void 0;
  }
  /**
   * Setter for the classified price.
   *
   * @param price - The price to set for the classified.
   */
  set price(priceTag) {
    if (typeof priceTag === "string") {
      priceTag = {
        amount: Number.parseFloat(priceTag)
      };
    }
    if (priceTag?.amount) {
      const tag2 = ["price", priceTag.amount.toString()];
      if (priceTag.currency) tag2.push(priceTag.currency);
      if (priceTag.frequency) tag2.push(priceTag.frequency);
      this.tags.push(tag2);
    } else {
      this.removeTag("price");
    }
  }
  /**
   * Generates content tags for the classified.
   *
   * This method first checks and sets the publication date if not available,
   * and then generates content tags based on the base NDKEvent class.
   *
   * @returns {ContentTag} - The generated content tags.
   */
  async generateTags() {
    super.generateTags();
    if (!this.published_at) {
      this.published_at = this.created_at;
    }
    return super.generateTags();
  }
};
var NDKAppHandlerEvent = class _NDKAppHandlerEvent extends NDKEvent {
  profile;
  static kinds = [
    31990
    /* AppHandler */
  ];
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind ??= 31990;
  }
  static from(ndkEvent) {
    const event = new _NDKAppHandlerEvent(ndkEvent.ndk, ndkEvent.rawEvent());
    if (event.isValid) {
      return event;
    }
    return null;
  }
  get isValid() {
    const combinations = /* @__PURE__ */ new Map();
    const combinationFromTag = (tag2) => [tag2[0], tag2[2]].join(":").toLowerCase();
    const tagsToInspect = ["web", "android", "ios"];
    for (const tag2 of this.tags) {
      if (tagsToInspect.includes(tag2[0])) {
        const combination = combinationFromTag(tag2);
        if (combinations.has(combination)) {
          if (combinations.get(combination) !== tag2[1].toLowerCase()) {
            return false;
          }
        }
        combinations.set(combination, tag2[1].toLowerCase());
      }
    }
    return true;
  }
  /**
   * Fetches app handler information
   * If no app information is available on the kind:31990,
   * we fetch the event's author's profile and return that instead.
   */
  async fetchProfile() {
    if (this.profile === void 0 && this.content.length > 0) {
      try {
        const profile = JSON.parse(this.content);
        if (profile?.name) {
          return profile;
        }
        this.profile = null;
      } catch (_e) {
        this.profile = null;
      }
    }
    return new Promise((resolve, reject) => {
      const author = this.author;
      author.fetchProfile().then(() => {
        resolve(author.profile);
      }).catch(reject);
    });
  }
};
var NDKDVMJobFeedback = class _NDKDVMJobFeedback extends NDKEvent {
  static kinds = [
    7e3
    /* DVMJobFeedback */
  ];
  constructor(ndk2, event) {
    super(ndk2, event);
    this.kind ??= 7e3;
  }
  static async from(event) {
    const e = new _NDKDVMJobFeedback(event.ndk, event.rawEvent());
    if (e.encrypted) await e.dvmDecrypt();
    return e;
  }
  get status() {
    return this.tagValue("status");
  }
  set status(status) {
    this.removeTag("status");
    if (status !== void 0) {
      this.tags.push(["status", status]);
    }
  }
  get encrypted() {
    return !!this.getMatchingTags("encrypted")[0];
  }
  async dvmDecrypt() {
    await this.decrypt();
    const decryptedContent = JSON.parse(this.content);
    this.tags.push(...decryptedContent);
  }
};
var NDKSubscriptionStart = class _NDKSubscriptionStart extends NDKEvent {
  debug;
  static kinds = [
    7001
    /* Subscribe */
  ];
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind ??= 7001;
    this.debug = ndk2?.debug.extend("subscription-start") ?? (0, import_debug5.default)("ndk:subscription-start");
  }
  static from(event) {
    return new _NDKSubscriptionStart(event.ndk, event.rawEvent());
  }
  /**
   * Recipient of the subscription. I.e. The author of this event subscribes to this user.
   */
  get recipient() {
    const pTag = this.getMatchingTags("p")?.[0];
    if (!pTag) return void 0;
    const user = new NDKUser({ pubkey: pTag[1] });
    return user;
  }
  set recipient(user) {
    this.removeTag("p");
    if (!user) return;
    this.tags.push(["p", user.pubkey]);
  }
  /**
   * The amount of the subscription.
   */
  get amount() {
    const amountTag = this.getMatchingTags("amount")?.[0];
    if (!amountTag) return void 0;
    return parseTagToSubscriptionAmount(amountTag);
  }
  set amount(amount) {
    this.removeTag("amount");
    if (!amount) return;
    this.tags.push(newAmount(amount.amount, amount.currency, amount.term));
  }
  /**
   * The event id or NIP-33 tag id of the tier that the user is subscribing to.
   */
  get tierId() {
    const eTag = this.getMatchingTags("e")?.[0];
    const aTag = this.getMatchingTags("a")?.[0];
    if (!eTag || !aTag) return void 0;
    return eTag[1] ?? aTag[1];
  }
  set tier(tier) {
    this.removeTag("e");
    this.removeTag("a");
    this.removeTag("event");
    if (!tier) return;
    this.tag(tier);
    this.removeTag("p");
    this.tags.push(["p", tier.pubkey]);
    this.tags.push(["event", JSON.stringify(tier.rawEvent())]);
  }
  /**
   * Fetches the tier that the user is subscribing to.
   */
  async fetchTier() {
    const eventTag = this.tagValue("event");
    if (eventTag) {
      try {
        const parsedEvent = JSON.parse(eventTag);
        return new NDKSubscriptionTier(this.ndk, parsedEvent);
      } catch {
        this.debug("Failed to parse event tag");
      }
    }
    const tierId = this.tierId;
    if (!tierId) return void 0;
    const e = await this.ndk?.fetchEvent(tierId);
    if (!e) return void 0;
    return NDKSubscriptionTier.from(e);
  }
  get isValid() {
    if (this.getMatchingTags("amount").length !== 1) {
      this.debug("Invalid # of amount tag");
      return false;
    }
    if (!this.amount) {
      this.debug("Invalid amount tag");
      return false;
    }
    if (this.getMatchingTags("p").length !== 1) {
      this.debug("Invalid # of p tag");
      return false;
    }
    if (!this.recipient) {
      this.debug("Invalid p tag");
      return false;
    }
    return true;
  }
};
var NDKSubscriptionReceipt = class _NDKSubscriptionReceipt extends NDKEvent {
  debug;
  static kinds = [
    7003
    /* SubscriptionReceipt */
  ];
  constructor(ndk2, rawEvent) {
    super(ndk2, rawEvent);
    this.kind ??= 7003;
    this.debug = ndk2?.debug.extend("subscription-start") ?? (0, import_debug6.default)("ndk:subscription-start");
  }
  static from(event) {
    return new _NDKSubscriptionReceipt(event.ndk, event.rawEvent());
  }
  /**
   * This is the person being subscribed to
   */
  get recipient() {
    const pTag = this.getMatchingTags("p")?.[0];
    if (!pTag) return void 0;
    const user = new NDKUser({ pubkey: pTag[1] });
    return user;
  }
  set recipient(user) {
    this.removeTag("p");
    if (!user) return;
    this.tags.push(["p", user.pubkey]);
  }
  /**
   * This is the person subscribing
   */
  get subscriber() {
    const PTag = this.getMatchingTags("P")?.[0];
    if (!PTag) return void 0;
    const user = new NDKUser({ pubkey: PTag[1] });
    return user;
  }
  set subscriber(user) {
    this.removeTag("P");
    if (!user) return;
    this.tags.push(["P", user.pubkey]);
  }
  set subscriptionStart(event) {
    this.debug(`before setting subscription start: ${this.rawEvent}`);
    this.removeTag("e");
    this.tag(event, "subscription", true);
    this.debug(`after setting subscription start: ${this.rawEvent}`);
  }
  get tierName() {
    const tag2 = this.getMatchingTags("tier")?.[0];
    return tag2?.[1];
  }
  get isValid() {
    const period = this.validPeriod;
    if (!period) {
      return false;
    }
    if (period.start > period.end) {
      return false;
    }
    const pTags = this.getMatchingTags("p");
    const PTags = this.getMatchingTags("P");
    if (pTags.length !== 1 || PTags.length !== 1) {
      return false;
    }
    return true;
  }
  get validPeriod() {
    const tag2 = this.getMatchingTags("valid")?.[0];
    if (!tag2) return void 0;
    try {
      return {
        start: new Date(Number.parseInt(tag2[1]) * 1e3),
        end: new Date(Number.parseInt(tag2[2]) * 1e3)
      };
    } catch {
      return void 0;
    }
  }
  set validPeriod(period) {
    this.removeTag("valid");
    if (!period) return;
    this.tags.push([
      "valid",
      Math.floor(period.start.getTime() / 1e3).toString(),
      Math.floor(period.end.getTime() / 1e3).toString()
    ]);
  }
  get startPeriod() {
    return this.validPeriod?.start;
  }
  get endPeriod() {
    return this.validPeriod?.end;
  }
  /**
   * Whether the subscription is currently active
   */
  isActive(time) {
    time ??= /* @__PURE__ */ new Date();
    const period = this.validPeriod;
    if (!period) return false;
    if (time < period.start) return false;
    if (time > period.end) return false;
    return true;
  }
};
var NDKCashuMint = class _NDKCashuMint extends NDKEvent {
  static kind = 38172;
  static kinds = [
    38172
    /* CashuMintAnnouncement */
  ];
  constructor(ndk2, event) {
    super(ndk2, event);
    this.kind ??= 38172;
  }
  static async from(event) {
    const mint = new _NDKCashuMint(event.ndk, event);
    return mint;
  }
  /**
   * The mint's identifier (pubkey)
   */
  get identifier() {
    return this.tagValue("d");
  }
  set identifier(value) {
    this.removeTag("d");
    if (value) this.tags.push(["d", value]);
  }
  /**
   * The mint URL
   */
  get url() {
    return this.tagValue("u");
  }
  set url(value) {
    this.removeTag("u");
    if (value) this.tags.push(["u", value]);
  }
  /**
   * Supported NUT protocols
   */
  get nuts() {
    return this.getMatchingTags("nuts").map((t) => t[1]);
  }
  set nuts(values) {
    this.removeTag("nuts");
    for (const value of values) {
      this.tags.push(["nuts", value]);
    }
  }
  /**
   * Network (mainnet/testnet/signet/regtest)
   */
  get network() {
    return this.tagValue("n");
  }
  set network(value) {
    this.removeTag("n");
    if (value) this.tags.push(["n", value]);
  }
  /**
   * Optional metadata
   */
  get metadata() {
    if (!this.content) return void 0;
    try {
      return JSON.parse(this.content);
    } catch {
      return void 0;
    }
  }
  set metadata(value) {
    if (value) {
      this.content = JSON.stringify(value);
    } else {
      this.content = "";
    }
  }
};
var NDKFedimintMint = class _NDKFedimintMint extends NDKEvent {
  static kind = 38173;
  static kinds = [
    38173
    /* FedimintMintAnnouncement */
  ];
  constructor(ndk2, event) {
    super(ndk2, event);
    this.kind ??= 38173;
  }
  static async from(event) {
    const mint = new _NDKFedimintMint(event.ndk, event);
    return mint;
  }
  /**
   * The federation ID
   */
  get identifier() {
    return this.tagValue("d");
  }
  set identifier(value) {
    this.removeTag("d");
    if (value) this.tags.push(["d", value]);
  }
  /**
   * Invite codes (multiple allowed)
   */
  get inviteCodes() {
    return this.getMatchingTags("u").map((t) => t[1]);
  }
  set inviteCodes(values) {
    this.removeTag("u");
    for (const value of values) {
      this.tags.push(["u", value]);
    }
  }
  /**
   * Supported modules
   */
  get modules() {
    return this.getMatchingTags("modules").map((t) => t[1]);
  }
  set modules(values) {
    this.removeTag("modules");
    for (const value of values) {
      this.tags.push(["modules", value]);
    }
  }
  /**
   * Network (mainnet/testnet/signet/regtest)
   */
  get network() {
    return this.tagValue("n");
  }
  set network(value) {
    this.removeTag("n");
    if (value) this.tags.push(["n", value]);
  }
  /**
   * Optional metadata
   */
  get metadata() {
    if (!this.content) return void 0;
    try {
      return JSON.parse(this.content);
    } catch {
      return void 0;
    }
  }
  set metadata(value) {
    if (value) {
      this.content = JSON.stringify(value);
    } else {
      this.content = "";
    }
  }
};
var NDKMintRecommendation = class _NDKMintRecommendation extends NDKEvent {
  static kind = 38e3;
  static kinds = [
    38e3
    /* EcashMintRecommendation */
  ];
  constructor(ndk2, event) {
    super(ndk2, event);
    this.kind ??= 38e3;
  }
  static async from(event) {
    const recommendation = new _NDKMintRecommendation(event.ndk, event);
    return recommendation;
  }
  /**
   * Event kind being recommended (38173 for Fedimint or 38172 for Cashu)
   */
  get recommendedKind() {
    const value = this.tagValue("k");
    return value ? Number(value) : void 0;
  }
  set recommendedKind(value) {
    this.removeTag("k");
    if (value) this.tags.push(["k", value.toString()]);
  }
  /**
   * Identifier for the recommended mint event
   */
  get identifier() {
    return this.tagValue("d");
  }
  set identifier(value) {
    this.removeTag("d");
    if (value) this.tags.push(["d", value]);
  }
  /**
   * Mint connection URLs/invite codes (multiple allowed)
   */
  get urls() {
    return this.getMatchingTags("u").map((t) => t[1]);
  }
  set urls(values) {
    this.removeTag("u");
    for (const value of values) {
      this.tags.push(["u", value]);
    }
  }
  /**
   * Pointers to specific mint events
   * Returns array of {kind, identifier, relay} objects
   */
  get mintEventPointers() {
    return this.getMatchingTags("a").map((t) => ({
      kind: Number(t[1].split(":")[0]),
      identifier: t[1].split(":")[2],
      relay: t[2]
    }));
  }
  /**
   * Add a pointer to a specific mint event
   */
  addMintEventPointer(kind, pubkey, identifier, relay) {
    const aTag = [`a`, `${kind}:${pubkey}:${identifier}`];
    if (relay) aTag.push(relay);
    this.tags.push(aTag);
  }
  /**
   * Review/recommendation text
   */
  get review() {
    return this.content;
  }
  set review(value) {
    this.content = value;
  }
};
var registeredEventClasses = /* @__PURE__ */ new Set();
function wrapEvent3(event) {
  const eventWrappingMap = /* @__PURE__ */ new Map();
  const builtInClasses = [
    NDKImage,
    NDKVideo,
    NDKCashuMintList,
    NDKArticle,
    NDKHighlight,
    NDKDraft,
    NDKWiki,
    NDKWikiMergeRequest,
    NDKNutzap,
    NDKProject,
    NDKTask,
    NDKProjectTemplate,
    NDKSimpleGroupMemberList,
    NDKSimpleGroupMetadata,
    NDKSubscriptionTier,
    NDKSubscriptionStart,
    NDKSubscriptionReceipt,
    NDKList,
    NDKRelayList,
    NDKStory,
    NDKBlossomList,
    NDKFollowPack,
    NDKThread,
    NDKRepost,
    NDKClassified,
    NDKAppHandlerEvent,
    NDKDVMJobFeedback,
    NDKCashuMint,
    NDKFedimintMint,
    NDKMintRecommendation
  ];
  const allClasses = [...builtInClasses, ...registeredEventClasses];
  for (const klass2 of allClasses) {
    for (const kind of klass2.kinds) {
      eventWrappingMap.set(kind, klass2);
    }
  }
  const klass = eventWrappingMap.get(event.kind);
  if (klass) return klass.from(event);
  return event;
}
function queryFullyFilled(subscription) {
  if (filterIncludesIds(subscription.filter)) {
    if (resultHasAllRequestedIds(subscription)) {
      return true;
    }
  }
  return false;
}
function filterIncludesIds(filter) {
  return !!filter.ids;
}
function resultHasAllRequestedIds(subscription) {
  const ids = subscription.filter.ids;
  return !!ids && ids.length === subscription.eventFirstSeen.size;
}
function filterFromId(id) {
  let decoded;
  if (id.match(NIP33_A_REGEX)) {
    const [kind, pubkey, identifier] = id.split(":");
    const filter = {
      authors: [pubkey],
      kinds: [Number.parseInt(kind)]
    };
    if (identifier) {
      filter["#d"] = [identifier];
    }
    return filter;
  }
  if (id.match(BECH32_REGEX3)) {
    try {
      decoded = nip19_exports.decode(id);
      switch (decoded.type) {
        case "nevent": {
          const filter = { ids: [decoded.data.id] };
          if (decoded.data.author) filter.authors = [decoded.data.author];
          if (decoded.data.kind) filter.kinds = [decoded.data.kind];
          return filter;
        }
        case "note":
          return { ids: [decoded.data] };
        case "naddr": {
          const filter = {
            authors: [decoded.data.pubkey],
            kinds: [decoded.data.kind]
          };
          if (decoded.data.identifier) filter["#d"] = [decoded.data.identifier];
          return filter;
        }
      }
    } catch (e) {
      console.error("Error decoding", id, e);
    }
  }
  return { ids: [id] };
}
function isNip33AValue(value) {
  return value.match(NIP33_A_REGEX) !== null;
}
var NIP33_A_REGEX = /^(\d+):([0-9A-Fa-f]+)(?::(.*))?$/;
var BECH32_REGEX3 = /^n(event|ote|profile|pub|addr)1[\d\w]+$/;
function relaysFromBech32(bech322, ndk2) {
  try {
    const decoded = nip19_exports.decode(bech322);
    if (["naddr", "nevent"].includes(decoded?.type)) {
      const data = decoded.data;
      if (data?.relays) {
        return data.relays.map((r) => new NDKRelay(r, ndk2.relayAuthDefaultPolicy, ndk2));
      }
    }
  } catch (_e) {
  }
  return [];
}
function processFilters(filters, mode = "validate", debug9) {
  if (mode === "ignore") {
    return filters;
  }
  const issues = [];
  const processedFilters = filters.map((filter, index) => {
    const result = processFilter(filter, mode, index, issues, debug9);
    return result;
  });
  if (mode === "validate" && issues.length > 0) {
    throw new Error(`Invalid filter(s) detected:
${issues.join("\n")}`);
  }
  return processedFilters;
}
function processFilter(filter, mode, filterIndex, issues, debug9) {
  const isValidating = mode === "validate";
  const cleanedFilter = isValidating ? filter : { ...filter };
  if (filter.ids) {
    const validIds = [];
    filter.ids.forEach((id, idx) => {
      if (id === void 0) {
        if (isValidating) {
          issues.push(`Filter[${filterIndex}].ids[${idx}] is undefined`);
        } else {
          debug9?.(`Fixed: Removed undefined value at ids[${idx}]`);
        }
      } else if (typeof id !== "string") {
        if (isValidating) {
          issues.push(`Filter[${filterIndex}].ids[${idx}] is not a string (got ${typeof id})`);
        } else {
          debug9?.(`Fixed: Removed non-string value at ids[${idx}] (was ${typeof id})`);
        }
      } else if (!/^[0-9a-f]{64}$/i.test(id)) {
        if (isValidating) {
          issues.push(`Filter[${filterIndex}].ids[${idx}] is not a valid 64-char hex string: "${id}"`);
        } else {
          debug9?.(`Fixed: Removed invalid hex string at ids[${idx}]`);
        }
      } else {
        validIds.push(id);
      }
    });
    if (!isValidating) {
      cleanedFilter.ids = validIds.length > 0 ? validIds : void 0;
    }
  }
  if (filter.authors) {
    const validAuthors = [];
    filter.authors.forEach((author, idx) => {
      if (author === void 0) {
        if (isValidating) {
          issues.push(`Filter[${filterIndex}].authors[${idx}] is undefined`);
        } else {
          debug9?.(`Fixed: Removed undefined value at authors[${idx}]`);
        }
      } else if (typeof author !== "string") {
        if (isValidating) {
          issues.push(`Filter[${filterIndex}].authors[${idx}] is not a string (got ${typeof author})`);
        } else {
          debug9?.(`Fixed: Removed non-string value at authors[${idx}] (was ${typeof author})`);
        }
      } else if (!/^[0-9a-f]{64}$/i.test(author)) {
        if (isValidating) {
          issues.push(
            `Filter[${filterIndex}].authors[${idx}] is not a valid 64-char hex pubkey: "${author}"`
          );
        } else {
          debug9?.(`Fixed: Removed invalid hex pubkey at authors[${idx}]`);
        }
      } else {
        validAuthors.push(author);
      }
    });
    if (!isValidating) {
      cleanedFilter.authors = validAuthors.length > 0 ? validAuthors : void 0;
    }
  }
  if (filter.kinds) {
    const validKinds = [];
    filter.kinds.forEach((kind, idx) => {
      if (kind === void 0) {
        if (isValidating) {
          issues.push(`Filter[${filterIndex}].kinds[${idx}] is undefined`);
        } else {
          debug9?.(`Fixed: Removed undefined value at kinds[${idx}]`);
        }
      } else if (typeof kind !== "number") {
        if (isValidating) {
          issues.push(`Filter[${filterIndex}].kinds[${idx}] is not a number (got ${typeof kind})`);
        } else {
          debug9?.(`Fixed: Removed non-number value at kinds[${idx}] (was ${typeof kind})`);
        }
      } else if (!Number.isInteger(kind)) {
        if (isValidating) {
          issues.push(`Filter[${filterIndex}].kinds[${idx}] is not an integer: ${kind}`);
        } else {
          debug9?.(`Fixed: Removed non-integer value at kinds[${idx}]: ${kind}`);
        }
      } else if (kind < 0 || kind > 65535) {
        if (isValidating) {
          issues.push(`Filter[${filterIndex}].kinds[${idx}] is out of valid range (0-65535): ${kind}`);
        } else {
          debug9?.(`Fixed: Removed out-of-range kind at kinds[${idx}]: ${kind}`);
        }
      } else {
        validKinds.push(kind);
      }
    });
    if (!isValidating) {
      cleanedFilter.kinds = validKinds.length > 0 ? validKinds : void 0;
    }
  }
  for (const key in filter) {
    if (key.startsWith("#") && key.length === 2) {
      const tagValues = filter[key];
      if (Array.isArray(tagValues)) {
        const validValues = [];
        tagValues.forEach((value, idx) => {
          if (value === void 0) {
            if (isValidating) {
              issues.push(`Filter[${filterIndex}].${key}[${idx}] is undefined`);
            } else {
              debug9?.(`Fixed: Removed undefined value at ${key}[${idx}]`);
            }
          } else if (typeof value !== "string") {
            if (isValidating) {
              issues.push(`Filter[${filterIndex}].${key}[${idx}] is not a string (got ${typeof value})`);
            } else {
              debug9?.(`Fixed: Removed non-string value at ${key}[${idx}] (was ${typeof value})`);
            }
          } else {
            if ((key === "#e" || key === "#p") && !/^[0-9a-f]{64}$/i.test(value)) {
              if (isValidating) {
                issues.push(
                  `Filter[${filterIndex}].${key}[${idx}] is not a valid 64-char hex string: "${value}"`
                );
              } else {
                debug9?.(`Fixed: Removed invalid hex string at ${key}[${idx}]`);
              }
            } else {
              validValues.push(value);
            }
          }
        });
        if (!isValidating) {
          cleanedFilter[key] = validValues.length > 0 ? validValues : void 0;
        }
      }
    }
  }
  if (!isValidating) {
    Object.keys(cleanedFilter).forEach((key) => {
      if (cleanedFilter[key] === void 0) {
        delete cleanedFilter[key];
      }
    });
  }
  return cleanedFilter;
}
var defaultOpts = {
  closeOnEose: false,
  cacheUsage: "CACHE_FIRST",
  dontSaveToCache: false,
  groupable: true,
  groupableDelay: 100,
  groupableDelayType: "at-most",
  cacheUnconstrainFilter: ["limit", "since", "until"],
  includeMuted: false
};
var NDKSubscription = class extends import_tseep4.EventEmitter {
  subId;
  filters;
  opts;
  pool;
  skipVerification = false;
  skipValidation = false;
  /**
   * Tracks the filters as they are executed on each relay
   */
  relayFilters;
  relaySet;
  ndk;
  debug;
  /**
   * Events that have been seen by the subscription, with the time they were first seen.
   */
  eventFirstSeen = /* @__PURE__ */ new Map();
  /**
   * Relays that have sent an EOSE.
   */
  eosesSeen = /* @__PURE__ */ new Set();
  /**
   * The time the last event was received by the subscription.
   * This is used to calculate when EOSE should be emitted.
   */
  lastEventReceivedAt;
  /**
   * The most recent event timestamp from cache results.
   * This is used for addSinceFromCache functionality.
   */
  mostRecentCacheEventTimestamp;
  internalId;
  /**
   * Whether the subscription should close when all relays have reached the end of the event stream.
   */
  closeOnEose;
  /**
   * Pool monitor callback
   */
  poolMonitor;
  skipOptimisticPublishEvent = false;
  /**
   * Filters to remove when querying the cache.
   */
  cacheUnconstrainFilter;
  constructor(ndk2, filters, opts, subId) {
    super();
    this.ndk = ndk2;
    this.opts = { ...defaultOpts, ...opts || {} };
    this.pool = this.opts.pool || ndk2.pool;
    const rawFilters = Array.isArray(filters) ? filters : [filters];
    const validationMode = ndk2.filterValidationMode === "validate" ? "validate" : ndk2.filterValidationMode === "fix" ? "fix" : "ignore";
    this.filters = processFilters(rawFilters, validationMode, ndk2.debug);
    if (this.filters.length === 0) {
      throw new Error("Subscription must have at least one filter");
    }
    this.subId = subId || this.opts.subId;
    this.internalId = Math.random().toString(36).substring(7);
    this.debug = ndk2.debug.extend(`subscription[${this.opts.subId ?? this.internalId}]`);
    if (this.opts.relaySet) {
      this.relaySet = this.opts.relaySet;
    } else if (this.opts.relayUrls) {
      this.relaySet = NDKRelaySet.fromRelayUrls(this.opts.relayUrls, this.ndk);
    }
    this.skipVerification = this.opts.skipVerification || false;
    this.skipValidation = this.opts.skipValidation || false;
    this.closeOnEose = this.opts.closeOnEose || false;
    this.skipOptimisticPublishEvent = this.opts.skipOptimisticPublishEvent || false;
    this.cacheUnconstrainFilter = this.opts.cacheUnconstrainFilter;
  }
  /**
   * Returns the relays that have not yet sent an EOSE.
   */
  relaysMissingEose() {
    if (!this.relayFilters) return [];
    const relaysMissingEose = Array.from(this.relayFilters?.keys()).filter(
      (url) => !this.eosesSeen.has(this.pool.getRelay(url, false, false))
    );
    return relaysMissingEose;
  }
  /**
   * Provides access to the first filter of the subscription for
   * backwards compatibility.
   */
  get filter() {
    return this.filters[0];
  }
  get groupableDelay() {
    if (!this.isGroupable()) return void 0;
    return this.opts?.groupableDelay;
  }
  get groupableDelayType() {
    return this.opts?.groupableDelayType || "at-most";
  }
  isGroupable() {
    return this.opts?.groupable || false;
  }
  shouldQueryCache() {
    if (this.opts.addSinceFromCache) return true;
    if (this.opts?.cacheUsage === "ONLY_RELAY") return false;
    const hasNonEphemeralKind = this.filters.some((f) => f.kinds?.some((k) => kindIsEphemeral(k)));
    if (hasNonEphemeralKind) return true;
    return true;
  }
  shouldQueryRelays() {
    return this.opts?.cacheUsage !== "ONLY_CACHE";
  }
  shouldWaitForCache() {
    if (this.opts.addSinceFromCache) return true;
    return (
      // Must want to close on EOSE; subscriptions
      // that want to receive further updates must
      // always hit the relay
      !!this.opts.closeOnEose && // Cache adapter must claim to be fast
      !!this.ndk.cacheAdapter?.locking && // If explicitly told to run in parallel, then
      // we should not wait for the cache
      this.opts.cacheUsage !== "PARALLEL"
    );
  }
  /**
   * Start the subscription. This is the main method that should be called
   * after creating a subscription.
   *
   * @param emitCachedEvents - Whether to emit events coming from a synchronous cache
   *
   * When using a synchronous cache, the events will be returned immediately
   * by this function. If you will use those returned events, you should
   * set emitCachedEvents to false to prevent seeing them as duplicate events.
   */
  start(emitCachedEvents = true) {
    let cacheResult;
    const updateStateFromCacheResults = (events) => {
      if (emitCachedEvents) {
        for (const event of events) {
          if (event.created_at && (!this.mostRecentCacheEventTimestamp || event.created_at > this.mostRecentCacheEventTimestamp)) {
            this.mostRecentCacheEventTimestamp = event.created_at;
          }
          this.eventReceived(event, void 0, true, false);
        }
      } else {
        cacheResult = [];
        for (const event of events) {
          if (event.created_at && (!this.mostRecentCacheEventTimestamp || event.created_at > this.mostRecentCacheEventTimestamp)) {
            this.mostRecentCacheEventTimestamp = event.created_at;
          }
          event.ndk = this.ndk;
          const e = this.opts.wrap ? wrapEvent3(event) : event;
          if (!e) break;
          if (e instanceof Promise) {
            e.then((wrappedEvent) => {
              this.emitEvent(false, wrappedEvent, void 0, true, false);
            });
            break;
          }
          this.eventFirstSeen.set(e.id, Date.now());
          cacheResult.push(e);
        }
      }
    };
    const loadFromRelays = () => {
      if (this.shouldQueryRelays()) {
        this.startWithRelays();
        this.startPoolMonitor();
      } else {
        this.emit("eose", this);
      }
    };
    if (this.shouldQueryCache()) {
      cacheResult = this.startWithCache();
      if (cacheResult instanceof Promise) {
        if (this.shouldWaitForCache()) {
          cacheResult.then((events) => {
            updateStateFromCacheResults(events);
            if (queryFullyFilled(this)) {
              this.emit("eose", this);
              return;
            }
            loadFromRelays();
          });
          return null;
        }
        cacheResult.then((events) => {
          updateStateFromCacheResults(events);
        });
        loadFromRelays();
        return null;
      }
      updateStateFromCacheResults(cacheResult);
      if (queryFullyFilled(this)) {
        this.emit("eose", this);
      } else {
        loadFromRelays();
      }
      return cacheResult;
    }
    loadFromRelays();
    return null;
  }
  /**
   * We want to monitor for new relays that are coming online, in case
   * they should be part of this subscription.
   */
  startPoolMonitor() {
    const _d = this.debug.extend("pool-monitor");
    this.poolMonitor = (relay) => {
      if (this.relayFilters?.has(relay.url)) return;
      const calc = calculateRelaySetsFromFilters(this.ndk, this.filters, this.pool);
      if (calc.get(relay.url)) {
        this.relayFilters?.set(relay.url, this.filters);
        relay.subscribe(this, this.filters);
      }
    };
    this.pool.on("relay:connect", this.poolMonitor);
  }
  onStopped;
  stop() {
    this.emit("close", this);
    this.poolMonitor && this.pool.off("relay:connect", this.poolMonitor);
    this.onStopped?.();
  }
  /**
   * @returns Whether the subscription has an authors filter.
   */
  hasAuthorsFilter() {
    return this.filters.some((f) => f.authors?.length);
  }
  startWithCache() {
    if (this.ndk.cacheAdapter?.query) {
      return this.ndk.cacheAdapter.query(this);
    }
    return [];
  }
  /**
   * Find available relays that should be part of this subscription and execute in them.
   *
   * Note that this is executed in addition to using the pool monitor, so even if the relay set
   * that is computed (i.e. we don't have any relays available), when relays come online, we will
   * check if we need to execute in them.
   */
  startWithRelays() {
    let filters = this.filters;
    if (this.opts.addSinceFromCache && this.mostRecentCacheEventTimestamp) {
      const sinceTimestamp = this.mostRecentCacheEventTimestamp + 1;
      filters = filters.map((filter) => ({
        ...filter,
        since: Math.max(filter.since || 0, sinceTimestamp)
      }));
    }
    if (!this.relaySet || this.relaySet.relays.size === 0) {
      this.relayFilters = calculateRelaySetsFromFilters(this.ndk, filters, this.pool);
    } else {
      this.relayFilters = /* @__PURE__ */ new Map();
      for (const relay of this.relaySet.relays) {
        this.relayFilters.set(relay.url, filters);
      }
    }
    for (const [relayUrl, filters2] of this.relayFilters) {
      const relay = this.pool.getRelay(relayUrl, true, true, filters2);
      relay.subscribe(this, filters2);
    }
  }
  /**
   * Refresh relay connections when outbox data becomes available.
   * This recalculates which relays should receive this subscription and
   * connects to any newly discovered relays.
   */
  refreshRelayConnections() {
    if (this.relaySet && this.relaySet.relays.size > 0) {
      return;
    }
    const updatedRelaySets = calculateRelaySetsFromFilters(this.ndk, this.filters, this.pool);
    for (const [relayUrl, filters] of updatedRelaySets) {
      if (!this.relayFilters?.has(relayUrl)) {
        this.relayFilters?.set(relayUrl, filters);
        const relay = this.pool.getRelay(relayUrl, true, true, filters);
        relay.subscribe(this, filters);
      }
    }
  }
  // EVENT handling
  /**
   * Called when an event is received from a relay or the cache
   * @param event
   * @param relay
   * @param fromCache Whether the event was received from the cache
   * @param optimisticPublish Whether this event is coming from an optimistic publish
   */
  eventReceived(event, relay, fromCache = false, optimisticPublish = false) {
    const eventId = event.id;
    const eventAlreadySeen = this.eventFirstSeen.has(eventId);
    let ndkEvent;
    if (event instanceof NDKEvent) ndkEvent = event;
    if (!eventAlreadySeen) {
      ndkEvent ??= new NDKEvent(this.ndk, event);
      ndkEvent.ndk = this.ndk;
      ndkEvent.relay = relay;
      if (!fromCache && !optimisticPublish) {
        if (!this.skipValidation) {
          if (!ndkEvent.isValid) {
            this.debug("Event failed validation %s from relay %s", eventId, relay?.url);
            return;
          }
        }
        if (relay) {
          const shouldVerify = relay.shouldValidateEvent();
          if (shouldVerify && !this.skipVerification) {
            ndkEvent.relay = relay;
            if (!this.ndk.asyncSigVerification) {
              if (!ndkEvent.verifySignature(true)) {
                this.debug("Event failed signature validation", event);
                this.ndk.reportInvalidSignature(ndkEvent, relay);
                return;
              }
              relay.addValidatedEvent();
            }
          } else {
            relay.addNonValidatedEvent();
          }
        }
        if (this.ndk.cacheAdapter && !this.opts.dontSaveToCache) {
          this.ndk.cacheAdapter.setEvent(ndkEvent, this.filters, relay);
        }
      }
      if (!this.opts.includeMuted && this.ndk.muteFilter(ndkEvent)) {
        this.debug("Event muted, skipping");
        return;
      }
      if (!optimisticPublish || this.skipOptimisticPublishEvent !== true) {
        this.emitEvent(this.opts?.wrap ?? false, ndkEvent, relay, fromCache, optimisticPublish);
        this.eventFirstSeen.set(eventId, Date.now());
      }
    } else {
      const timeSinceFirstSeen = Date.now() - (this.eventFirstSeen.get(eventId) || 0);
      this.emit("event:dup", event, relay, timeSinceFirstSeen, this, fromCache, optimisticPublish);
      if (relay) {
        const signature = verifiedSignatures.get(eventId);
        if (signature && typeof signature === "string") {
          if (event.sig === signature) {
            relay.addValidatedEvent();
          } else {
            const eventToReport = event instanceof NDKEvent ? event : new NDKEvent(this.ndk, event);
            this.ndk.reportInvalidSignature(eventToReport, relay);
          }
        }
      }
    }
    this.lastEventReceivedAt = Date.now();
  }
  /**
   * Optionally wraps, sync or async, and emits the event (if one comes back from the wrapper)
   */
  emitEvent(wrap, evt, relay, fromCache, optimisticPublish) {
    const wrapped = wrap ? wrapEvent3(evt) : evt;
    if (wrapped instanceof Promise) {
      wrapped.then((e) => this.emitEvent(false, e, relay, fromCache, optimisticPublish));
    } else if (wrapped) {
      this.emit("event", wrapped, relay, this, fromCache, optimisticPublish);
    }
  }
  closedReceived(relay, reason) {
    this.emit("closed", relay, reason);
  }
  // EOSE handling
  eoseTimeout;
  eosed = false;
  eoseReceived(relay) {
    this.debug("EOSE received from %s", relay.url);
    this.eosesSeen.add(relay);
    let lastEventSeen = this.lastEventReceivedAt ? Date.now() - this.lastEventReceivedAt : void 0;
    const hasSeenAllEoses = this.eosesSeen.size === this.relayFilters?.size;
    const queryFilled = queryFullyFilled(this);
    const performEose = (reason) => {
      this.debug("Performing EOSE: %s %d", reason, this.eosed);
      if (this.eosed) return;
      if (this.eoseTimeout) clearTimeout(this.eoseTimeout);
      this.emit("eose", this);
      this.eosed = true;
      if (this.opts?.closeOnEose) this.stop();
    };
    if (queryFilled || hasSeenAllEoses) {
      performEose("query filled or seen all");
    } else if (this.relayFilters) {
      let timeToWaitForNextEose = 1e3;
      const connectedRelays = new Set(this.pool.connectedRelays().map((r) => r.url));
      const connectedRelaysWithFilters = Array.from(this.relayFilters.keys()).filter(
        (url) => connectedRelays.has(url)
      );
      if (connectedRelaysWithFilters.length === 0) {
        this.debug(
          "No connected relays, waiting for all relays to connect",
          Array.from(this.relayFilters.keys()).join(", ")
        );
        return;
      }
      const percentageOfRelaysThatHaveSentEose = this.eosesSeen.size / connectedRelaysWithFilters.length;
      this.debug("Percentage of relays that have sent EOSE", {
        subId: this.subId,
        percentageOfRelaysThatHaveSentEose,
        seen: this.eosesSeen.size,
        total: connectedRelaysWithFilters.length
      });
      if (this.eosesSeen.size >= 2 && percentageOfRelaysThatHaveSentEose >= 0.5) {
        timeToWaitForNextEose = timeToWaitForNextEose * (1 - percentageOfRelaysThatHaveSentEose);
        if (timeToWaitForNextEose === 0) {
          performEose("time to wait was 0");
          return;
        }
        if (this.eoseTimeout) clearTimeout(this.eoseTimeout);
        const sendEoseTimeout = () => {
          lastEventSeen = this.lastEventReceivedAt ? Date.now() - this.lastEventReceivedAt : void 0;
          if (lastEventSeen !== void 0 && lastEventSeen < 20) {
            this.eoseTimeout = setTimeout(sendEoseTimeout, timeToWaitForNextEose);
          } else {
            performEose(`send eose timeout: ${timeToWaitForNextEose}`);
          }
        };
        this.eoseTimeout = setTimeout(sendEoseTimeout, timeToWaitForNextEose);
      }
    }
  }
};
var kindIsEphemeral = (kind) => kind >= 2e4 && kind < 3e4;
async function follows(opts, outbox, kind = 3) {
  if (!this.ndk) throw new Error("NDK not set");
  const contactListEvent = await this.ndk.fetchEvent(
    { kinds: [kind], authors: [this.pubkey] },
    opts || { groupable: false }
  );
  if (contactListEvent) {
    const pubkeys = /* @__PURE__ */ new Set();
    contactListEvent.tags.forEach((tag2) => {
      if (tag2[0] === "p") pubkeys.add(tag2[1]);
    });
    if (outbox) {
      this.ndk?.outboxTracker?.trackUsers(Array.from(pubkeys));
    }
    return [...pubkeys].reduce((acc, pubkey) => {
      const user = new NDKUser({ pubkey });
      user.ndk = this.ndk;
      acc.add(user);
      return acc;
    }, /* @__PURE__ */ new Set());
  }
  return /* @__PURE__ */ new Set();
}
var NIP05_REGEX2 = /^(?:([\w.+-]+)@)?([\w.-]+)$/;
async function getNip05For(ndk2, fullname, _fetch5 = fetch, fetchOpts = {}) {
  return await ndk2.queuesNip05.add({
    id: fullname,
    func: async () => {
      if (ndk2.cacheAdapter?.loadNip05) {
        const profile = await ndk2.cacheAdapter.loadNip05(fullname);
        if (profile !== "missing") {
          if (profile) {
            const user = new NDKUser({
              pubkey: profile.pubkey,
              relayUrls: profile.relays,
              nip46Urls: profile.nip46
            });
            user.ndk = ndk2;
            return user;
          }
          if (fetchOpts.cache !== "no-cache") {
            return null;
          }
        }
      }
      const match = fullname.match(NIP05_REGEX2);
      if (!match) return null;
      const [_, name = "_", domain] = match;
      try {
        const res = await _fetch5(`https://${domain}/.well-known/nostr.json?name=${name}`, fetchOpts);
        const { names, relays, nip46 } = parseNIP05Result(await res.json());
        const pubkey = names[name.toLowerCase()];
        let profile = null;
        if (pubkey) {
          profile = { pubkey, relays: relays?.[pubkey], nip46: nip46?.[pubkey] };
        }
        if (ndk2?.cacheAdapter?.saveNip05) {
          ndk2.cacheAdapter.saveNip05(fullname, profile);
        }
        return profile;
      } catch (_e) {
        if (ndk2?.cacheAdapter?.saveNip05) {
          ndk2?.cacheAdapter.saveNip05(fullname, null);
        }
        console.error("Failed to fetch NIP05 for", fullname, _e);
        return null;
      }
    }
  });
}
function parseNIP05Result(json) {
  const result = {
    names: {}
  };
  for (const [name, pubkey] of Object.entries(json.names)) {
    if (typeof name === "string" && typeof pubkey === "string") {
      result.names[name.toLowerCase()] = pubkey;
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
  if (json.nip46) {
    result.nip46 = {};
    for (const [pubkey, nip46] of Object.entries(json.nip46)) {
      if (typeof pubkey === "string" && Array.isArray(nip46)) {
        result.nip46[pubkey] = nip46.filter((relay) => typeof relay === "string");
      }
    }
  }
  return result;
}
function profileFromEvent(event) {
  const profile = {};
  let payload;
  try {
    payload = JSON.parse(event.content);
  } catch (error) {
    throw new Error(`Failed to parse profile event: ${error}`);
  }
  profile.profileEvent = JSON.stringify(event.rawEvent());
  for (const key of Object.keys(payload)) {
    switch (key) {
      case "name":
        profile.name = payload.name;
        break;
      case "display_name":
        profile.displayName = payload.display_name;
        break;
      case "image":
      case "picture":
        profile.picture = payload.picture || payload.image;
        profile.image = profile.picture;
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
      case "website":
        profile.website = payload.website;
        break;
      default:
        profile[key] = payload[key];
        break;
    }
  }
  profile.created_at = event.created_at;
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
var NDKUser = class _NDKUser {
  ndk;
  profile;
  profileEvent;
  _npub;
  _pubkey;
  relayUrls = [];
  nip46Urls = [];
  constructor(opts) {
    if (opts.npub) this._npub = opts.npub;
    if (opts.hexpubkey) this._pubkey = opts.hexpubkey;
    if (opts.pubkey) this._pubkey = opts.pubkey;
    if (opts.relayUrls) this.relayUrls = opts.relayUrls;
    if (opts.nip46Urls) this.nip46Urls = opts.nip46Urls;
    if (opts.nprofile) {
      try {
        const decoded = nip19_exports.decode(opts.nprofile);
        if (decoded.type === "nprofile") {
          this._pubkey = decoded.data.pubkey;
          if (decoded.data.relays && decoded.data.relays.length > 0) {
            this.relayUrls.push(...decoded.data.relays);
          }
        }
      } catch (e) {
        console.error("Failed to decode nprofile", e);
      }
    }
  }
  get npub() {
    if (!this._npub) {
      if (!this._pubkey) throw new Error("pubkey not set");
      this._npub = nip19_exports.npubEncode(this.pubkey);
    }
    return this._npub;
  }
  get nprofile() {
    const relays = this.profileEvent?.onRelays?.map((r) => r.url);
    return nip19_exports.nprofileEncode({
      pubkey: this.pubkey,
      relays
    });
  }
  set npub(npub2) {
    this._npub = npub2;
  }
  /**
   * Get the user's pubkey
   * @returns {string} The user's pubkey
   */
  get pubkey() {
    if (!this._pubkey) {
      if (!this._npub) throw new Error("npub not set");
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
   * Equivalent to NDKEvent.filters().
   * @returns {NDKFilter}
   */
  filter() {
    return { "#p": [this.pubkey] };
  }
  /**
   * Gets NIP-57 and NIP-61 information that this user has signaled
   *
   * @param getAll {boolean} Whether to get all zap info or just the first one
   */
  async getZapInfo(timeoutMs) {
    if (!this.ndk) throw new Error("No NDK instance found");
    const promiseWithTimeout = async (promise) => {
      if (!timeoutMs) return promise;
      let timeoutId;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error("Timeout")), timeoutMs);
      });
      try {
        const result = await Promise.race([promise, timeoutPromise]);
        if (timeoutId) clearTimeout(timeoutId);
        return result;
      } catch (e) {
        if (e instanceof Error && e.message === "Timeout") {
          try {
            const result = await promise;
            return result;
          } catch (_originalError) {
            return void 0;
          }
        }
        return void 0;
      }
    };
    const [userProfile, mintListEvent] = await Promise.all([
      promiseWithTimeout(this.fetchProfile()),
      promiseWithTimeout(this.ndk.fetchEvent({ kinds: [
        10019
        /* CashuMintList */
      ], authors: [this.pubkey] }))
    ]);
    const res = /* @__PURE__ */ new Map();
    if (mintListEvent) {
      const mintList = NDKCashuMintList.from(mintListEvent);
      if (mintList.mints.length > 0) {
        res.set("nip61", {
          mints: mintList.mints,
          relays: mintList.relays,
          p2pk: mintList.p2pk
        });
      }
    }
    if (userProfile) {
      const { lud06, lud16 } = userProfile;
      res.set("nip57", { lud06, lud16 });
    }
    return res;
  }
  /**
   * Instantiate an NDKUser from a NIP-05 string
   * @param nip05Id {string} The user's NIP-05
   * @param ndk {NDK} An NDK instance
   * @param skipCache {boolean} Whether to skip the cache or not
   * @returns {NDKUser | undefined} An NDKUser if one is found for the given NIP-05, undefined otherwise.
   */
  static async fromNip05(nip05Id, ndk2, skipCache = false) {
    if (!ndk2) throw new Error("No NDK instance found");
    const opts = {};
    if (skipCache) opts.cache = "no-cache";
    const profile = await getNip05For(ndk2, nip05Id, ndk2?.httpFetch, opts);
    if (profile) {
      const user = new _NDKUser({
        pubkey: profile.pubkey,
        relayUrls: profile.relays,
        nip46Urls: profile.nip46
      });
      user.ndk = ndk2;
      return user;
    }
  }
  /**
   * Fetch a user's profile
   * @param opts {NDKSubscriptionOptions} A set of NDKSubscriptionOptions
   * @param storeProfileEvent {boolean} Whether to store the profile event or not
   * @returns User Profile
   */
  async fetchProfile(opts, storeProfileEvent = false) {
    if (!this.ndk) throw new Error("NDK not set");
    let setMetadataEvent = null;
    if (this.ndk.cacheAdapter && (this.ndk.cacheAdapter.fetchProfile || this.ndk.cacheAdapter.fetchProfileSync) && opts?.cacheUsage !== "ONLY_RELAY") {
      let profile = null;
      if (this.ndk.cacheAdapter.fetchProfileSync) {
        profile = this.ndk.cacheAdapter.fetchProfileSync(this.pubkey);
      } else if (this.ndk.cacheAdapter.fetchProfile) {
        profile = await this.ndk.cacheAdapter.fetchProfile(this.pubkey);
      }
      if (profile) {
        this.profile = profile;
        return profile;
      }
    }
    opts ??= {};
    opts.cacheUsage ??= "ONLY_RELAY";
    opts.closeOnEose ??= true;
    opts.groupable ??= true;
    opts.groupableDelay ??= 250;
    if (!setMetadataEvent) {
      setMetadataEvent = await this.ndk.fetchEvent({ kinds: [0], authors: [this.pubkey] }, opts);
    }
    if (!setMetadataEvent) return null;
    this.profile = profileFromEvent(setMetadataEvent);
    if (storeProfileEvent && this.profile && this.ndk.cacheAdapter && this.ndk.cacheAdapter.saveProfile) {
      this.ndk.cacheAdapter.saveProfile(this.pubkey, this.profile);
    }
    return this.profile;
  }
  /**
   * Returns a set of users that this user follows.
   *
   * @deprecated Use followSet instead
   */
  follows = follows.bind(this);
  /**
   * Returns a set of pubkeys that this user follows.
   *
   * @param opts - NDKSubscriptionOptions
   * @param outbox - boolean
   * @param kind - number
   */
  async followSet(opts, outbox, kind = 3) {
    const follows2 = await this.follows(opts, outbox, kind);
    return new Set(Array.from(follows2).map((f) => f.pubkey));
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
    const tag2 = [["p", this.pubkey]];
    if (!marker) return tag2;
    tag2[0].push("", marker);
    return tag2;
  }
  /**
   * Publishes the current profile.
   */
  async publish() {
    if (!this.ndk) throw new Error("No NDK instance found");
    if (!this.profile) throw new Error("No profile available");
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
    if (!this.ndk) throw new Error("No NDK instance found");
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
   * Remove a follow from this user's contact list
   *
   * @param user {NDKUser} The user to unfollow
   * @param currentFollowList {Set<NDKUser>} The current follow list
   * @param kind {NDKKind} The kind to use for this contact list (defaults to `3`)
   * @returns The relays were the follow list was published or false if the user wasn't found
   */
  async unfollow(user, currentFollowList, kind = 3) {
    if (!this.ndk) throw new Error("No NDK instance found");
    this.ndk.assertSigner();
    if (!currentFollowList) {
      currentFollowList = await this.follows(void 0, void 0, kind);
    }
    const newUserFollowList = /* @__PURE__ */ new Set();
    let foundUser = false;
    for (const follow of currentFollowList) {
      if (follow.pubkey !== user.pubkey) {
        newUserFollowList.add(follow);
      } else {
        foundUser = true;
      }
    }
    if (!foundUser) return false;
    const event = new NDKEvent(this.ndk, { kind });
    for (const follow of newUserFollowList) {
      event.tag(follow);
    }
    return await event.publish();
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
    if (!this.ndk) throw new Error("No NDK instance found");
    const profilePointer = await getNip05For(this.ndk, nip05Id);
    if (profilePointer === null) return null;
    return profilePointer.pubkey === this.pubkey;
  }
};
function disconnect(pool, debug9) {
  debug9 ??= (0, import_debug7.default)("ndk:relay:auth-policies:disconnect");
  return async (relay) => {
    debug9?.(`Relay ${relay.url} requested authentication, disconnecting`);
    pool.removeRelay(relay.url);
  };
}
async function signAndAuth(event, relay, signer, debug9, resolve, reject) {
  try {
    await event.sign(signer);
    resolve(event);
  } catch (e) {
    debug9?.(`Failed to publish auth event to relay ${relay.url}`, e);
    reject(event);
  }
}
function signIn({ ndk: ndk2, signer, debug: debug9 } = {}) {
  debug9 ??= (0, import_debug7.default)("ndk:auth-policies:signIn");
  return async (relay, challenge3) => {
    debug9?.(`Relay ${relay.url} requested authentication, signing in`);
    const event = new NDKEvent(ndk2);
    event.kind = 22242;
    event.tags = [
      ["relay", relay.url],
      ["challenge", challenge3]
    ];
    signer ??= ndk2?.signer;
    return new Promise(async (resolve, reject) => {
      if (signer) {
        await signAndAuth(event, relay, signer, debug9, resolve, reject);
      } else {
        ndk2?.once("signer:ready", async (signer2) => {
          await signAndAuth(event, relay, signer2, debug9, resolve, reject);
        });
      }
    });
  };
}
var NDKRelayAuthPolicies = {
  disconnect,
  signIn
};
var NDKNip07Signer = class _NDKNip07Signer {
  _userPromise;
  encryptionQueue = [];
  encryptionProcessing = false;
  debug;
  waitTimeout;
  _pubkey;
  ndk;
  _user;
  /**
   * @param waitTimeout - The timeout in milliseconds to wait for the NIP-07 to become available
   */
  constructor(waitTimeout = 1e3, ndk2) {
    this.debug = (0, import_debug8.default)("ndk:nip07");
    this.waitTimeout = waitTimeout;
    this.ndk = ndk2;
  }
  get pubkey() {
    if (!this._pubkey) throw new Error("Not ready");
    return this._pubkey;
  }
  async blockUntilReady() {
    await this.waitForExtension();
    const pubkey = await window.nostr?.getPublicKey();
    if (!pubkey) {
      throw new Error("User rejected access");
    }
    this._pubkey = pubkey;
    let user;
    if (this.ndk) user = this.ndk.getUser({ pubkey });
    else user = new NDKUser({ pubkey });
    this._user = user;
    return user;
  }
  /**
   * Getter for the user property.
   * @returns The NDKUser instance.
   */
  async user() {
    if (!this._userPromise) {
      this._userPromise = this.blockUntilReady();
    }
    return this._userPromise;
  }
  get userSync() {
    if (!this._user) throw new Error("User not ready");
    return this._user;
  }
  /**
   * Signs the given Nostr event.
   * @param event - The Nostr event to be signed.
   * @returns The signature of the signed event.
   * @throws Error if the NIP-07 is not available on the window object.
   */
  async sign(event) {
    await this.waitForExtension();
    const signedEvent = await window.nostr?.signEvent(event);
    if (!signedEvent) throw new Error("Failed to sign event");
    return signedEvent.sig;
  }
  async relays(ndk2) {
    await this.waitForExtension();
    const relays = await window.nostr?.getRelays?.() || {};
    const activeRelays = [];
    for (const url of Object.keys(relays)) {
      if (relays[url].read && relays[url].write) {
        activeRelays.push(url);
      }
    }
    return activeRelays.map((url) => new NDKRelay(url, ndk2?.relayAuthDefaultPolicy, ndk2));
  }
  async encryptionEnabled(nip) {
    const enabled = [];
    if ((!nip || nip === "nip04") && Boolean(window.nostr?.nip04)) enabled.push("nip04");
    if ((!nip || nip === "nip44") && Boolean(window.nostr?.nip44)) enabled.push("nip44");
    return enabled;
  }
  async encrypt(recipient, value, nip = "nip04") {
    if (!await this.encryptionEnabled(nip))
      throw new Error(`${nip}encryption is not available from your browser extension`);
    await this.waitForExtension();
    const recipientHexPubKey = recipient.pubkey;
    return this.queueEncryption(nip, "encrypt", recipientHexPubKey, value);
  }
  async decrypt(sender, value, nip = "nip04") {
    if (!await this.encryptionEnabled(nip))
      throw new Error(`${nip}encryption is not available from your browser extension`);
    await this.waitForExtension();
    const senderHexPubKey = sender.pubkey;
    return this.queueEncryption(nip, "decrypt", senderHexPubKey, value);
  }
  async queueEncryption(scheme, method, counterpartyHexpubkey, value) {
    return new Promise((resolve, reject) => {
      this.encryptionQueue.push({
        scheme,
        method,
        counterpartyHexpubkey,
        value,
        resolve,
        reject
      });
      if (!this.encryptionProcessing) {
        this.processEncryptionQueue();
      }
    });
  }
  async processEncryptionQueue(item, retries = 0) {
    if (!item && this.encryptionQueue.length === 0) {
      this.encryptionProcessing = false;
      return;
    }
    this.encryptionProcessing = true;
    const currentItem = item || this.encryptionQueue.shift();
    if (!currentItem) {
      this.encryptionProcessing = false;
      return;
    }
    const { scheme, method, counterpartyHexpubkey, value, resolve, reject } = currentItem;
    this.debug("Processing encryption queue item", {
      method,
      counterpartyHexpubkey,
      value
    });
    try {
      const result = await window.nostr?.[scheme]?.[method](counterpartyHexpubkey, value);
      if (!result) throw new Error("Failed to encrypt/decrypt");
      resolve(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("call already executing") && retries < 5) {
        this.debug("Retrying encryption queue item", {
          method,
          counterpartyHexpubkey,
          value,
          retries
        });
        setTimeout(() => {
          this.processEncryptionQueue(currentItem, retries + 1);
        }, 50 * retries);
        return;
      }
      reject(error instanceof Error ? error : new Error(errorMessage));
    }
    this.processEncryptionQueue();
  }
  waitForExtension() {
    return new Promise((resolve, reject) => {
      if (window.nostr) {
        resolve();
        return;
      }
      let timerId;
      const intervalId = setInterval(() => {
        if (window.nostr) {
          clearTimeout(timerId);
          clearInterval(intervalId);
          resolve();
        }
      }, 100);
      timerId = setTimeout(() => {
        clearInterval(intervalId);
        reject(new Error("NIP-07 extension not available"));
      }, this.waitTimeout);
    });
  }
  /**
   * Serializes the signer type into a storable format.
   * NIP-07 signers don't have persistent state to serialize beyond their type.
   * @returns A JSON string containing the type.
   */
  toPayload() {
    const payload = {
      type: "nip07",
      payload: ""
      // No specific payload needed for NIP-07
    };
    return JSON.stringify(payload);
  }
  /**
   * Deserializes the signer from a payload string.
   * Creates a new NDKNip07Signer instance.
   * @param payloadString The JSON string obtained from toPayload().
   * @param ndk Optional NDK instance.
   * @returns An instance of NDKNip07Signer.
   */
  static async fromPayload(payloadString, ndk2) {
    const payload = JSON.parse(payloadString);
    if (payload.type !== "nip07") {
      throw new Error(`Invalid payload type: expected 'nip07', got ${payload.type}`);
    }
    return new _NDKNip07Signer(void 0, ndk2);
  }
};
registerSigner("nip07", NDKNip07Signer);
var NDKNostrRpc = class extends import_tseep5.EventEmitter {
  ndk;
  signer;
  relaySet;
  debug;
  encryptionType = "nip04";
  pool;
  constructor(ndk2, signer, debug9, relayUrls) {
    super();
    this.ndk = ndk2;
    this.signer = signer;
    if (relayUrls) {
      this.pool = new NDKPool(relayUrls, [], ndk2, {
        debug: debug9.extend("rpc-pool"),
        name: "Nostr RPC"
      });
      this.relaySet = new NDKRelaySet(/* @__PURE__ */ new Set(), ndk2, this.pool);
      for (const url of relayUrls) {
        const relay = this.pool.getRelay(url, false, false);
        relay.authPolicy = NDKRelayAuthPolicies.signIn({ ndk: ndk2, signer, debug: debug9 });
        this.relaySet.addRelay(relay);
        relay.connect();
      }
    }
    this.debug = debug9.extend("rpc");
  }
  /**
   * Subscribe to a filter. This function will resolve once the subscription is ready.
   */
  subscribe(filter) {
    const sub = this.ndk.subscribe(
      filter,
      {
        closeOnEose: false,
        groupable: false,
        cacheUsage: "ONLY_RELAY",
        pool: this.pool,
        relaySet: this.relaySet
      },
      false
    );
    sub.on("event", async (event) => {
      try {
        const parsedEvent = await this.parseEvent(event);
        if (parsedEvent.method) {
          this.emit("request", parsedEvent);
        } else {
          this.emit(`response-${parsedEvent.id}`, parsedEvent);
          this.emit("response", parsedEvent);
        }
      } catch (e) {
        this.debug("error parsing event", e, event.rawEvent());
      }
    });
    return new Promise((resolve) => {
      sub.on("eose", () => {
        this.debug("eosed");
        resolve(sub);
      });
      sub.start();
    });
  }
  async parseEvent(event) {
    if (this.encryptionType === "nip44" && event.content.includes("?iv=")) {
      this.encryptionType = "nip04";
    } else if (this.encryptionType === "nip04" && !event.content.includes("?iv=")) {
      this.encryptionType = "nip44";
    }
    const remoteUser = this.ndk.getUser({ pubkey: event.pubkey });
    remoteUser.ndk = this.ndk;
    let decryptedContent;
    try {
      decryptedContent = await this.signer.decrypt(remoteUser, event.content, this.encryptionType);
    } catch (_e) {
      const otherEncryptionType = this.encryptionType === "nip04" ? "nip44" : "nip04";
      decryptedContent = await this.signer.decrypt(remoteUser, event.content, otherEncryptionType);
      this.encryptionType = otherEncryptionType;
    }
    const parsedContent = JSON.parse(decryptedContent);
    const { id, method, params, result, error } = parsedContent;
    if (method) {
      return { id, pubkey: event.pubkey, method, params, event };
    }
    return { id, result, error, event };
  }
  async sendResponse(id, remotePubkey, result, kind = 24133, error) {
    const res = { id, result };
    if (error) {
      res.error = error;
    }
    const localUser = await this.signer.user();
    const remoteUser = this.ndk.getUser({ pubkey: remotePubkey });
    const event = new NDKEvent(this.ndk, {
      kind,
      content: JSON.stringify(res),
      tags: [["p", remotePubkey]],
      pubkey: localUser.pubkey
    });
    event.content = await this.signer.encrypt(remoteUser, event.content, this.encryptionType);
    await event.sign(this.signer);
    await event.publish(this.relaySet);
  }
  /**
   * Sends a request.
   * @param remotePubkey
   * @param method
   * @param params
   * @param kind
   * @param id
   */
  async sendRequest(remotePubkey, method, params = [], kind = 24133, cb) {
    const id = Math.random().toString(36).substring(7);
    const localUser = await this.signer.user();
    const remoteUser = this.ndk.getUser({ pubkey: remotePubkey });
    const request = { id, method, params };
    const promise = new Promise(() => {
      const responseHandler = (response) => {
        if (response.result === "auth_url") {
          this.once(`response-${id}`, responseHandler);
          this.emit("authUrl", response.error);
        } else if (cb) {
          cb(response);
        }
      };
      this.once(`response-${id}`, responseHandler);
    });
    const event = new NDKEvent(this.ndk, {
      kind,
      content: JSON.stringify(request),
      tags: [["p", remotePubkey]],
      pubkey: localUser.pubkey
    });
    event.content = await this.signer.encrypt(remoteUser, event.content, this.encryptionType);
    await event.sign(this.signer);
    await event.publish(this.relaySet);
    return promise;
  }
};
async function ndkSignerFromPayload(payloadString, ndk2) {
  let parsed;
  try {
    parsed = JSON.parse(payloadString);
  } catch (e) {
    console.error("Failed to parse signer payload string", payloadString, e);
    return void 0;
  }
  if (!parsed || typeof parsed.type !== "string") {
    console.error("Failed to parse signer payload string", payloadString, new Error("Missing type field"));
    return void 0;
  }
  const SignerClass = signerRegistry.get(parsed.type);
  if (!SignerClass) {
    throw new Error(`Unknown signer type: ${parsed.type}`);
  }
  try {
    return await SignerClass.fromPayload(payloadString, ndk2);
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    throw new Error(`Failed to deserialize signer type ${parsed.type}: ${errorMsg}`);
  }
}
function nostrConnectGenerateSecret() {
  return Math.random().toString(36).substring(2, 15);
}
function generateNostrConnectUri(pubkey, secret, relay, options) {
  const meta = {
    name: options?.name ? encodeURIComponent(options.name) : "",
    url: options?.url ? encodeURIComponent(options.url) : "",
    image: options?.image ? encodeURIComponent(options.image) : "",
    perms: options?.perms ? encodeURIComponent(options.perms) : ""
  };
  let uri = `nostrconnect://${pubkey}?image=${meta.image}&url=${meta.url}&name=${meta.name}&perms=${meta.perms}&secret=${encodeURIComponent(secret)}`;
  if (relay) {
    uri += `&relay=${encodeURIComponent(relay)}`;
  }
  return uri;
}
var NDKNip46Signer = class _NDKNip46Signer extends import_tseep6.EventEmitter {
  ndk;
  _user;
  /**
   * The pubkey of the bunker that will be providing signatures
   */
  bunkerPubkey;
  /**
   * The pubkey of the user that events will be published as
   */
  userPubkey;
  get pubkey() {
    if (!this.userPubkey) throw new Error("Not ready");
    return this.userPubkey;
  }
  /**
   * An optional secret value provided to connect to the bunker
   */
  secret;
  localSigner;
  nip05;
  rpc;
  debug;
  relayUrls;
  subscription;
  /**
   * If using nostrconnect://, stores the nostrConnectURI
   */
  nostrConnectUri;
  /**
   * The random secret used for nostrconnect:// flows.
   */
  nostrConnectSecret;
  /**
   *
   * Don't instantiate this directly. Use the static methods instead.
   *
   * @example:
   * // for bunker:// flow
   * const signer = NDKNip46Signer.bunker(ndk, "bunker://<connection-token>")
   * const signer = NDKNip46Signer.bunker(ndk, "<your-nip05>"); // with nip05 flow
   * // for nostrconnect:// flow
   * const signer = NDKNip46Signer.nostrconnect(ndk, "wss://relay.example.com")
   *
   * @param ndk - The NDK instance to use
   * @param userOrConnectionToken - The public key, or a connection token, of the npub that wants to be published as
   * @param localSigner - The signer that will be used to request events to be signed
   */
  constructor(ndk2, userOrConnectionToken, localSigner, relayUrls, nostrConnectOptions) {
    super();
    this.ndk = ndk2;
    this.debug = ndk2.debug.extend("nip46:signer");
    this.relayUrls = relayUrls;
    if (!localSigner) {
      this.localSigner = NDKPrivateKeySigner.generate();
    } else {
      if (typeof localSigner === "string") {
        this.localSigner = new NDKPrivateKeySigner(localSigner);
      } else {
        this.localSigner = localSigner;
      }
    }
    if (userOrConnectionToken === false) {
    } else if (!userOrConnectionToken) {
      this.nostrconnectFlowInit(nostrConnectOptions);
    } else if (userOrConnectionToken.startsWith("bunker://")) {
      this.bunkerFlowInit(userOrConnectionToken);
    } else {
      this.nip05Init(userOrConnectionToken);
    }
    this.rpc = new NDKNostrRpc(this.ndk, this.localSigner, this.debug, this.relayUrls);
  }
  /**
   * Connnect with a bunker:// flow
   * @param ndk
   * @param userOrConnectionToken bunker:// connection string
   * @param localSigner If you have previously authenticated with this signer, you can restore the session by providing the previously authenticated key
   */
  static bunker(ndk2, userOrConnectionToken, localSigner) {
    return new _NDKNip46Signer(ndk2, userOrConnectionToken, localSigner);
  }
  /**
   * Connect with a nostrconnect:// flow
   * @param ndk
   * @param relay - Relay used to connect with the signer
   * @param localSigner If you have previously authenticated with this signer, you can restore the session by providing the previously authenticated key
   */
  static nostrconnect(ndk2, relay, localSigner, nostrConnectOptions) {
    return new _NDKNip46Signer(ndk2, void 0, localSigner, [relay], nostrConnectOptions);
  }
  nostrconnectFlowInit(nostrConnectOptions) {
    this.nostrConnectSecret = nostrConnectGenerateSecret();
    const pubkey = this.localSigner.pubkey;
    this.nostrConnectUri = generateNostrConnectUri(
      pubkey,
      this.nostrConnectSecret,
      this.relayUrls?.[0],
      nostrConnectOptions
    );
  }
  bunkerFlowInit(connectionToken) {
    const bunkerUrl = new URL(connectionToken);
    const bunkerPubkey = bunkerUrl.hostname || bunkerUrl.pathname.replace(/^\/\//, "");
    const userPubkey = bunkerUrl.searchParams.get("pubkey");
    const relayUrls = bunkerUrl.searchParams.getAll("relay");
    const secret = bunkerUrl.searchParams.get("secret");
    this.bunkerPubkey = bunkerPubkey;
    this.userPubkey = userPubkey;
    this.relayUrls = relayUrls;
    this.secret = secret;
  }
  nip05Init(nip05) {
    this.nip05 = nip05;
  }
  /**
   * We start listening for events from the bunker
   */
  async startListening() {
    if (this.subscription) return;
    const localUser = await this.localSigner.user();
    if (!localUser) throw new Error("Local signer not ready");
    this.subscription = await this.rpc.subscribe({
      kinds: [
        24133
        /* NostrConnect */
      ],
      "#p": [localUser.pubkey]
    });
  }
  /**
   * Get the user that is being published as
   */
  async user() {
    if (this._user) return this._user;
    return this.blockUntilReady();
  }
  get userSync() {
    if (!this._user) throw new Error("Remote user not ready synchronously");
    return this._user;
  }
  async blockUntilReadyNostrConnect() {
    return new Promise((resolve, reject) => {
      const connect = (response) => {
        if (response.result === this.nostrConnectSecret) {
          this._user = response.event.author;
          this.userPubkey = response.event.pubkey;
          this.bunkerPubkey = response.event.pubkey;
          this.rpc.off("response", connect);
          resolve(this._user);
        }
      };
      this.startListening();
      this.rpc.on("response", connect);
    });
  }
  async blockUntilReady() {
    if (!this.bunkerPubkey && !this.nostrConnectSecret && !this.nip05) {
      throw new Error("Bunker pubkey not set");
    }
    if (this.nostrConnectSecret) return this.blockUntilReadyNostrConnect();
    if (this.nip05 && !this.userPubkey) {
      const user = await NDKUser.fromNip05(this.nip05, this.ndk);
      if (user) {
        this._user = user;
        this.userPubkey = user.pubkey;
        this.relayUrls = user.nip46Urls;
        this.rpc = new NDKNostrRpc(this.ndk, this.localSigner, this.debug, this.relayUrls);
      }
    }
    if (!this.bunkerPubkey && this.userPubkey) {
      this.bunkerPubkey = this.userPubkey;
    } else if (!this.bunkerPubkey) {
      throw new Error("Bunker pubkey not set");
    }
    await this.startListening();
    this.rpc.on("authUrl", (...props) => {
      this.emit("authUrl", ...props);
    });
    return new Promise((resolve, reject) => {
      const connectParams = [this.userPubkey ?? ""];
      if (this.secret) connectParams.push(this.secret);
      if (!this.bunkerPubkey) throw new Error("Bunker pubkey not set");
      this.rpc.sendRequest(this.bunkerPubkey, "connect", connectParams, 24133, (response) => {
        if (response.result === "ack") {
          this.getPublicKey().then((pubkey) => {
            this.userPubkey = pubkey;
            this._user = this.ndk.getUser({ pubkey });
            resolve(this._user);
          });
        } else {
          reject(response.error);
        }
      });
    });
  }
  stop() {
    this.subscription?.stop();
    this.subscription = void 0;
  }
  async getPublicKey() {
    if (this.userPubkey) return this.userPubkey;
    return new Promise((resolve, _reject) => {
      if (!this.bunkerPubkey) throw new Error("Bunker pubkey not set");
      this.rpc.sendRequest(this.bunkerPubkey, "get_public_key", [], 24133, (response) => {
        resolve(response.result);
      });
    });
  }
  async encryptionEnabled(scheme) {
    if (scheme) return [scheme];
    return Promise.resolve(["nip04", "nip44"]);
  }
  async encrypt(recipient, value, scheme = "nip04") {
    return this.encryption(recipient, value, scheme, "encrypt");
  }
  async decrypt(sender, value, scheme = "nip04") {
    return this.encryption(sender, value, scheme, "decrypt");
  }
  async encryption(peer, value, scheme, method) {
    const promise = new Promise((resolve, reject) => {
      if (!this.bunkerPubkey) throw new Error("Bunker pubkey not set");
      this.rpc.sendRequest(
        this.bunkerPubkey,
        `${scheme}_${method}`,
        [peer.pubkey, value],
        24133,
        (response) => {
          if (!response.error) {
            resolve(response.result);
          } else {
            reject(response.error);
          }
        }
      );
    });
    return promise;
  }
  async sign(event) {
    const promise = new Promise((resolve, reject) => {
      if (!this.bunkerPubkey) throw new Error("Bunker pubkey not set");
      this.rpc.sendRequest(
        this.bunkerPubkey,
        "sign_event",
        [JSON.stringify(event)],
        24133,
        (response) => {
          if (!response.error) {
            const json = JSON.parse(response.result);
            resolve(json.sig);
          } else {
            reject(response.error);
          }
        }
      );
    });
    return promise;
  }
  /**
   * Allows creating a new account on the remote server.
   * @param username Desired username for the NIP-05
   * @param domain Desired domain for the NIP-05
   * @param email Email address to associate with this account -- Remote servers may use this for recovery
   * @returns The public key of the newly created account
   */
  async createAccount(username, domain, email) {
    await this.startListening();
    const req = [];
    if (username) req.push(username);
    if (domain) req.push(domain);
    if (email) req.push(email);
    return new Promise((resolve, reject) => {
      if (!this.bunkerPubkey) throw new Error("Bunker pubkey not set");
      this.rpc.sendRequest(
        this.bunkerPubkey,
        "create_account",
        req,
        24133,
        (response) => {
          if (!response.error) {
            const pubkey = response.result;
            resolve(pubkey);
          } else {
            reject(response.error);
          }
        }
      );
    });
  }
  /**
   * Serializes the signer's connection details and local signer state.
   * @returns A JSON string containing the type, connection info, and local signer payload.
   */
  toPayload() {
    if (!this.bunkerPubkey || !this.userPubkey) {
      throw new Error("NIP-46 signer is not fully initialized for serialization");
    }
    const payload = {
      type: "nip46",
      payload: {
        bunkerPubkey: this.bunkerPubkey,
        userPubkey: this.userPubkey,
        relayUrls: this.relayUrls,
        secret: this.secret,
        localSignerPayload: this.localSigner.toPayload(),
        // Store nip05 if it was used for initialization, otherwise null
        nip05: this.nip05 || null
      }
    };
    return JSON.stringify(payload);
  }
  /**
   * Deserializes the signer from a payload string.
   * @param payloadString The JSON string obtained from toPayload().
   * @param ndk The NDK instance, required for NIP-46.
   * @returns An instance of NDKNip46Signer.
   */
  static async fromPayload(payloadString, ndk2) {
    if (!ndk2) {
      throw new Error("NDK instance is required to deserialize NIP-46 signer");
    }
    const parsed = JSON.parse(payloadString);
    if (parsed.type !== "nip46") {
      throw new Error(`Invalid payload type: expected 'nip46', got ${parsed.type}`);
    }
    const payload = parsed.payload;
    if (!payload || typeof payload !== "object" || !payload.localSignerPayload) {
      throw new Error("Invalid payload content for nip46 signer");
    }
    const localSigner = await ndkSignerFromPayload(payload.localSignerPayload, ndk2);
    if (!localSigner) {
      throw new Error("Failed to deserialize local signer for NIP-46");
    }
    if (!(localSigner instanceof NDKPrivateKeySigner)) {
      throw new Error("Local signer must be an instance of NDKPrivateKeySigner");
    }
    let signer;
    signer = new _NDKNip46Signer(ndk2, false, localSigner, payload.relayUrls);
    signer.userPubkey = payload.userPubkey;
    signer.bunkerPubkey = payload.bunkerPubkey;
    signer.relayUrls = payload.relayUrls;
    signer.secret = payload.secret;
    if (payload.userPubkey) {
      signer._user = new NDKUser({ pubkey: payload.userPubkey });
      if (signer._user) signer._user.ndk = ndk2;
    }
    return signer;
  }
};
registerSigner("nip46", NDKNip46Signer);
function dedup(event1, event2) {
  if (event1.created_at > event2.created_at) {
    return event1;
  }
  return event2;
}
async function getRelayListForUser(pubkey, ndk2) {
  const list = await getRelayListForUsers([pubkey], ndk2);
  return list.get(pubkey);
}
async function getRelayListForUsers(pubkeys, ndk2, skipCache = false, timeout = 1e3, relayHints) {
  const pool = ndk2.outboxPool || ndk2.pool;
  const set2 = /* @__PURE__ */ new Set();
  for (const relay of pool.relays.values()) set2.add(relay);
  if (relayHints) {
    for (const hints of relayHints.values()) {
      for (const url of hints) {
        const relay = pool.getRelay(url, true, true);
        if (relay) set2.add(relay);
      }
    }
  }
  const relayLists = /* @__PURE__ */ new Map();
  const fromContactList = /* @__PURE__ */ new Map();
  const relaySet = new NDKRelaySet(set2, ndk2);
  if (ndk2.cacheAdapter?.locking && !skipCache) {
    const cachedList = await ndk2.fetchEvents(
      { kinds: [3, 10002], authors: Array.from(new Set(pubkeys)) },
      { cacheUsage: "ONLY_CACHE", subId: "ndk-relay-list-fetch" }
    );
    for (const relayList of cachedList) {
      if (relayList.kind === 10002) relayLists.set(relayList.pubkey, NDKRelayList.from(relayList));
    }
    for (const relayList of cachedList) {
      if (relayList.kind === 3) {
        if (relayLists.has(relayList.pubkey)) continue;
        const list = relayListFromKind3(ndk2, relayList);
        if (list) fromContactList.set(relayList.pubkey, list);
      }
    }
    pubkeys = pubkeys.filter((pubkey) => !relayLists.has(pubkey) && !fromContactList.has(pubkey));
  }
  if (pubkeys.length === 0) return relayLists;
  const relayListEvents = /* @__PURE__ */ new Map();
  const contactListEvents = /* @__PURE__ */ new Map();
  return new Promise((resolve) => {
    const handleSubscription = async () => {
      const subscribeOpts = {
        closeOnEose: true,
        pool,
        groupable: true,
        subId: "ndk-relay-list-fetch",
        addSinceFromCache: true,
        relaySet
      };
      if (relaySet) subscribeOpts.relaySet = relaySet;
      const sub = ndk2.subscribe({ kinds: [3, 10002], authors: pubkeys }, subscribeOpts, {
        onEvent: (event) => {
          if (event.kind === 10002) {
            const existingEvent = relayListEvents.get(event.pubkey);
            if (existingEvent && existingEvent.created_at > event.created_at) return;
            relayListEvents.set(event.pubkey, event);
          } else if (event.kind === 3) {
            const existingEvent = contactListEvents.get(event.pubkey);
            if (existingEvent && existingEvent.created_at > event.created_at) return;
            contactListEvents.set(event.pubkey, event);
          }
        },
        onEose: () => {
          for (const event of relayListEvents.values()) {
            relayLists.set(event.pubkey, NDKRelayList.from(event));
          }
          for (const pubkey of pubkeys) {
            if (relayLists.has(pubkey)) continue;
            const contactList = contactListEvents.get(pubkey);
            if (!contactList) continue;
            const list = relayListFromKind3(ndk2, contactList);
            if (list) relayLists.set(pubkey, list);
          }
          resolve(relayLists);
        }
      });
      setTimeout(() => {
        resolve(relayLists);
      }, timeout);
    };
    handleSubscription();
  });
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
  constructor(type) {
    this.type = type;
    this.relayUrlScores = /* @__PURE__ */ new Map();
    this.readRelays = /* @__PURE__ */ new Set();
    this.writeRelays = /* @__PURE__ */ new Set();
  }
};
var OutboxTracker = class extends import_tseep8.EventEmitter {
  data;
  ndk;
  debug;
  constructor(ndk2) {
    super();
    this.ndk = ndk2;
    this.debug = ndk2.debug.extend("outbox-tracker");
    this.data = new import_typescript_lru_cache2.LRUCache({
      maxSize: 1e5,
      entryExpirationTimeInMS: 2 * 60 * 1e3
    });
  }
  /**
   * Adds a list of users to the tracker.
   * @param items
   * @param skipCache
   */
  async trackUsers(items, skipCache = false) {
    const promises = [];
    for (let i2 = 0; i2 < items.length; i2 += 400) {
      const slice = items.slice(i2, i2 + 400);
      const pubkeys = slice.map((item) => getKeyFromItem(item)).filter((pubkey) => !this.data.has(pubkey));
      if (pubkeys.length === 0) continue;
      for (const pubkey of pubkeys) {
        this.data.set(pubkey, new OutboxItem("user"));
      }
      const relayHints = /* @__PURE__ */ new Map();
      for (const item of slice) {
        if (item instanceof NDKUser && item.relayUrls.length > 0) {
          relayHints.set(item.pubkey, item.relayUrls);
        }
      }
      promises.push(
        new Promise((resolve) => {
          getRelayListForUsers(pubkeys, this.ndk, skipCache, 1e3, relayHints).then((relayLists) => {
            for (const [pubkey, relayList] of relayLists) {
              let outboxItem = this.data.get(pubkey);
              outboxItem ??= new OutboxItem("user");
              if (relayList) {
                outboxItem.readRelays = new Set(normalize(relayList.readRelayUrls));
                outboxItem.writeRelays = new Set(normalize(relayList.writeRelayUrls));
                for (const relayUrl of outboxItem.readRelays) {
                  if (this.ndk.pool.blacklistRelayUrls.has(relayUrl)) {
                    outboxItem.readRelays.delete(relayUrl);
                  }
                }
                for (const relayUrl of outboxItem.writeRelays) {
                  if (this.ndk.pool.blacklistRelayUrls.has(relayUrl)) {
                    outboxItem.writeRelays.delete(relayUrl);
                  }
                }
                this.data.set(pubkey, outboxItem);
                this.emit("user:relay-list-updated", pubkey, outboxItem);
                this.debug(
                  `Adding ${outboxItem.readRelays.size} read relays and ${outboxItem.writeRelays.size} write relays for ${pubkey}`,
                  relayList?.rawEvent()
                );
              }
            }
          }).finally(resolve);
        })
      );
    }
    return Promise.all(promises);
  }
  /**
   *
   * @param key
   * @param score
   */
  track(item, type, _skipCache = true) {
    const key = getKeyFromItem(item);
    type ??= getTypeFromItem(item);
    let outboxItem = this.data.get(key);
    if (!outboxItem) {
      outboxItem = new OutboxItem(type);
      if (item instanceof NDKUser) {
        this.trackUsers([item]);
      }
    }
    return outboxItem;
  }
};
function getKeyFromItem(item) {
  if (item instanceof NDKUser) {
    return item.pubkey;
  }
  return item;
}
function getTypeFromItem(item) {
  if (item instanceof NDKUser) {
    return "user";
  }
  return "kind";
}
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
var NDKSubscriptionManager = class {
  subscriptions;
  seenEvents = /* @__PURE__ */ new Map();
  constructor() {
    this.subscriptions = /* @__PURE__ */ new Map();
  }
  add(sub) {
    this.subscriptions.set(sub.internalId, sub);
    if (sub.onStopped) {
    }
    sub.onStopped = () => {
      this.subscriptions.delete(sub.internalId);
    };
    sub.on("close", () => {
      this.subscriptions.delete(sub.internalId);
    });
  }
  seenEvent(eventId, relay) {
    const current = this.seenEvents.get(eventId) || [];
    current.push(relay);
    this.seenEvents.set(eventId, current);
  }
  /**
   * Whenever an event comes in, this function is called.
   * This function matches the received event against all the
   * known (i.e. active) NDKSubscriptions, and if it matches,
   * it sends the event to the subscription.
   *
   * This is the single place in the codebase that matches
   * incoming events with parties interested in the event.
   *
   * This is also what allows for reactivity in NDK apps, such that
   * whenever an active subscription receives an event that some
   * other active subscription would want to receive, both receive it.
   *
   * TODO This also allows for subscriptions that overlap in meaning
   * to be collapsed into one.
   *
   * I.e. if a subscription with filter: kinds: [1], authors: [alice]
   * is created and EOSEs, and then a subsequent subscription with
   * kinds: [1], authors: [alice] is created, once the second subscription
   * EOSEs we can safely close it, increment its refCount and close it,
   * and when the first subscription receives a new event from Alice this
   * code will make the second subscription receive the event even though
   * it has no active subscription on a relay.
   * @param event Raw event received from a relay
   * @param relay Relay that sent the event
   * @param optimisticPublish Whether the event is coming from an optimistic publish
   */
  dispatchEvent(event, relay, optimisticPublish = false) {
    if (relay) this.seenEvent(event.id, relay);
    const subscriptions = this.subscriptions.values();
    const matchingSubs = [];
    for (const sub of subscriptions) {
      if (matchFilters(sub.filters, event)) {
        matchingSubs.push(sub);
      }
    }
    for (const sub of matchingSubs) {
      sub.eventReceived(event, relay, false, optimisticPublish);
    }
  }
};
var debug7 = (0, import_debug10.default)("ndk:active-user");
async function getUserRelayList(user) {
  if (!this.autoConnectUserRelays) return;
  const userRelays = await getRelayListForUser(user.pubkey, this);
  if (!userRelays) return;
  for (const url of userRelays.relays) {
    let relay = this.pool.relays.get(url);
    if (!relay) {
      relay = new NDKRelay(url, this.relayAuthDefaultPolicy, this);
      this.pool.addRelay(relay);
    }
  }
  return userRelays;
}
async function setActiveUser(user) {
  const pool = this.outboxPool || this.pool;
  if (pool.connectedRelays.length > 0) {
    setActiveUserConnected.call(this, user);
  } else {
    pool.once("connect", () => {
      setActiveUserConnected.call(this, user);
    });
  }
}
async function setActiveUserConnected(user) {
  const userRelays = await getUserRelayList.call(this, user);
  const filters = [
    {
      kinds: [
        10006
        /* BlockRelayList */
      ],
      authors: [user.pubkey]
    }
  ];
  if (this.autoFetchUserMutelist) {
    filters[0].kinds?.push(
      1e4
      /* MuteList */
    );
  }
  const events = /* @__PURE__ */ new Map();
  const relaySet = userRelays ? userRelays.relaySet : void 0;
  this.subscribe(
    filters,
    { subId: "active-user-settings", closeOnEose: true, relaySet },
    {
      onEvent: (event) => {
        const prevEvent = events.get(event.kind);
        if (prevEvent && prevEvent.created_at >= event.created_at) return;
        events.set(event.kind, event);
      },
      onEose: () => {
        for (const event of events.values()) {
          processEvent.call(this, event);
        }
      }
    }
  );
}
async function processEvent(event) {
  if (event.kind === 10006) {
    processBlockRelayList.call(this, event);
  } else if (event.kind === 1e4) {
    processMuteList.call(this, event);
  }
}
function processBlockRelayList(event) {
  const list = lists_default.from(event);
  for (const item of list.items) {
    this.pool.blacklistRelayUrls.add(item[0]);
  }
  debug7("Added %d relays to relay blacklist", list.items.length);
}
function processMuteList(muteList) {
  const list = lists_default.from(muteList);
  for (const item of list.items) {
    this.mutedIds.set(item[1], item[0]);
  }
  debug7("Added %d users to mute list", list.items.length);
}
function getEntity(entity) {
  try {
    const decoded = nip19_exports.decode(entity);
    if (decoded.type === "npub") return npub(this, decoded.data);
    if (decoded.type === "nprofile") return nprofile(this, decoded.data);
    return decoded;
  } catch (_e) {
    return null;
  }
}
function npub(ndk2, pubkey) {
  return ndk2.getUser({ pubkey });
}
function nprofile(ndk2, profile) {
  const user = ndk2.getUser({ pubkey: profile.pubkey });
  if (profile.relays) user.relayUrls = profile.relays;
  return user;
}
function isValidHint(hint) {
  if (!hint || hint === "") return false;
  try {
    new URL(hint);
    return true;
  } catch (_e) {
    return false;
  }
}
async function fetchEventFromTag(tag2, originalEvent, subOpts, fallback = {
  type: "timeout"
}) {
  const d42 = this.debug.extend("fetch-event-from-tag");
  const [_, id, hint] = tag2;
  subOpts = {};
  d42("fetching event from tag", tag2, subOpts, fallback);
  const authorRelays = getRelaysForSync(this, originalEvent.pubkey);
  if (authorRelays && authorRelays.size > 0) {
    d42("fetching event from author relays %o", Array.from(authorRelays));
    const relaySet2 = NDKRelaySet.fromRelayUrls(Array.from(authorRelays), this);
    const event2 = await this.fetchEvent(id, subOpts, relaySet2);
    if (event2) return event2;
  } else {
    d42("no author relays found for %s", originalEvent.pubkey, originalEvent);
  }
  const relaySet = calculateRelaySetsFromFilters(this, [{ ids: [id] }], this.pool);
  d42("fetching event without relay hint", relaySet);
  const event = await this.fetchEvent(id, subOpts);
  if (event) return event;
  if (hint && hint !== "") {
    const event2 = await this.fetchEvent(id, subOpts, this.pool.getRelay(hint, true, true, [{ ids: [id] }]));
    if (event2) return event2;
  }
  let result = void 0;
  const relay = isValidHint(hint) ? this.pool.getRelay(hint, false, true, [{ ids: [id] }]) : void 0;
  const fetchMaybeWithRelayHint = new Promise((resolve) => {
    this.fetchEvent(id, subOpts, relay).then(resolve);
  });
  if (!isValidHint(hint) || fallback.type === "none") {
    return fetchMaybeWithRelayHint;
  }
  const fallbackFetchPromise = new Promise(async (resolve) => {
    const fallbackRelaySet = fallback.relaySet;
    const timeout = fallback.timeout ?? 1500;
    const timeoutPromise = new Promise((resolve2) => setTimeout(resolve2, timeout));
    if (fallback.type === "timeout") await timeoutPromise;
    if (result) {
      resolve(result);
    } else {
      d42("fallback fetch triggered");
      const fallbackEvent = await this.fetchEvent(id, subOpts, fallbackRelaySet);
      resolve(fallbackEvent);
    }
  });
  switch (fallback.type) {
    case "timeout":
      return Promise.race([fetchMaybeWithRelayHint, fallbackFetchPromise]);
    case "eose":
      result = await fetchMaybeWithRelayHint;
      if (result) return result;
      return fallbackFetchPromise;
  }
}
var Queue = class {
  queue = [];
  maxConcurrency;
  processing = /* @__PURE__ */ new Set();
  promises = /* @__PURE__ */ new Map();
  constructor(_name, maxConcurrency) {
    this.maxConcurrency = maxConcurrency;
  }
  add(item) {
    if (this.promises.has(item.id)) {
      return this.promises.get(item.id);
    }
    const promise = new Promise((resolve, reject) => {
      this.queue.push({
        ...item,
        func: () => item.func().then(
          (result) => {
            resolve(result);
            return result;
          },
          (error) => {
            reject(error);
            throw error;
          }
        )
      });
      this.process();
    });
    this.promises.set(item.id, promise);
    promise.finally(() => {
      this.promises.delete(item.id);
      this.processing.delete(item.id);
      this.process();
    });
    return promise;
  }
  process() {
    if (this.processing.size >= this.maxConcurrency || this.queue.length === 0) {
      return;
    }
    const item = this.queue.shift();
    if (!item || this.processing.has(item.id)) {
      return;
    }
    this.processing.add(item.id);
    item.func();
  }
  clear() {
    this.queue = [];
  }
  clearProcessing() {
    this.processing.clear();
  }
  clearAll() {
    this.clear();
    this.clearProcessing();
  }
  length() {
    return this.queue.length;
  }
};
var DEFAULT_OUTBOX_RELAYS = ["wss://purplepag.es/", "wss://nos.lol/"];
var DEFAULT_BLACKLISTED_RELAYS = [
  "wss://brb.io/",
  // BRB
  "wss://nostr.mutinywallet.com/"
  // Don't try to read from this relay since it's a write-only relay
  // "wss://purplepag.es/", // This is a hack, since this is a mostly read-only relay, but not fully. Once we have relay routing this can be removed so it only receives the supported kinds
];
var NDK = class extends import_tseep7.EventEmitter {
  _explicitRelayUrls;
  blacklistRelayUrls;
  pool;
  outboxPool;
  _signer;
  _activeUser;
  cacheAdapter;
  debug;
  devWriteRelaySet;
  outboxTracker;
  mutedIds;
  muteFilter;
  clientName;
  clientNip89;
  queuesZapConfig;
  queuesNip05;
  asyncSigVerification = false;
  initialValidationRatio = 1;
  lowestValidationRatio = 0.1;
  validationRatioFn;
  autoBlacklistInvalidRelays = false;
  filterValidationMode = "validate";
  subManager;
  /**
   * Private storage for the signature verification function
   */
  _signatureVerificationFunction;
  /**
   * Private storage for the signature verification worker
   */
  _signatureVerificationWorker;
  /**
   * Rolling total of time spent (in ms) performing signature verifications.
   * Users can read this to monitor or display aggregate verification cost.
   */
  signatureVerificationTimeMs = 0;
  publishingFailureHandled = false;
  pools = [];
  /**
   * Default relay-auth policy that will be used when a relay requests authentication,
   * if no other policy is specified for that relay.
   *
   * @example Disconnect from relays that request authentication:
   * ```typescript
   * ndk.relayAuthDefaultPolicy = NDKAuthPolicies.disconnect(ndk.pool);
   * ```
   *
   * @example Sign in to relays that request authentication:
   * ```typescript
   * ndk.relayAuthDefaultPolicy = NDKAuthPolicies.signIn({ndk})
   * ```
   *
   * @example Sign in to relays that request authentication, asking the user for confirmation:
   * ```typescript
   * ndk.relayAuthDefaultPolicy = (relay: NDKRelay) => {
   *     const signIn = NDKAuthPolicies.signIn({ndk});
   *     if (confirm(`Relay ${relay.url} is requesting authentication, do you want to sign in?`)) {
   *        signIn(relay);
   *     }
   * }
   * ```
   */
  relayAuthDefaultPolicy;
  /**
   * Fetch function to use for HTTP requests.
   *
   * @example
   * ```typescript
   * import fetch from "node-fetch";
   *
   * ndk.httpFetch = fetch;
   * ```
   */
  httpFetch;
  /**
   * Provide a caller function to receive all networking traffic from relays
   */
  netDebug;
  autoConnectUserRelays = true;
  autoFetchUserMutelist = true;
  walletConfig;
  constructor(opts = {}) {
    super();
    this.debug = opts.debug || (0, import_debug9.default)("ndk");
    this.netDebug = opts.netDebug;
    this._explicitRelayUrls = opts.explicitRelayUrls || [];
    this.blacklistRelayUrls = opts.blacklistRelayUrls || DEFAULT_BLACKLISTED_RELAYS;
    this.subManager = new NDKSubscriptionManager();
    this.pool = new NDKPool(opts.explicitRelayUrls || [], [], this);
    this.pool.name = "Main";
    this.pool.on("relay:auth", async (relay, challenge3) => {
      if (this.relayAuthDefaultPolicy) {
        await this.relayAuthDefaultPolicy(relay, challenge3);
      }
    });
    this.autoConnectUserRelays = opts.autoConnectUserRelays ?? true;
    this.autoFetchUserMutelist = opts.autoFetchUserMutelist ?? true;
    this.clientName = opts.clientName;
    this.clientNip89 = opts.clientNip89;
    this.relayAuthDefaultPolicy = opts.relayAuthDefaultPolicy;
    if (opts.enableOutboxModel) {
      this.outboxPool = new NDKPool(opts.outboxRelayUrls || DEFAULT_OUTBOX_RELAYS, [], this, {
        debug: this.debug.extend("outbox-pool"),
        name: "Outbox Pool"
      });
      this.outboxTracker = new OutboxTracker(this);
      this.outboxTracker.on("user:relay-list-updated", (pubkey, outboxItem) => {
        this.debug(`Outbox relay list updated for ${pubkey}`);
        for (const subscription of this.subManager.subscriptions.values()) {
          const isRelevant = subscription.filters.some(
            (filter) => filter.authors && filter.authors.includes(pubkey)
          );
          if (isRelevant && typeof subscription.refreshRelayConnections === "function") {
            this.debug(`Refreshing relay connections for subscription ${subscription.internalId}`);
            subscription.refreshRelayConnections();
          }
        }
      });
    }
    this.signer = opts.signer;
    this.cacheAdapter = opts.cacheAdapter;
    this.mutedIds = opts.mutedIds || /* @__PURE__ */ new Map();
    this.muteFilter = opts.muteFilter || ((event) => {
      if (this.mutedIds.has(event.pubkey)) return true;
      if (event.id && this.mutedIds.has(event.id)) return true;
      return false;
    });
    if (opts.devWriteRelayUrls) {
      this.devWriteRelaySet = NDKRelaySet.fromRelayUrls(opts.devWriteRelayUrls, this);
    }
    this.queuesZapConfig = new Queue("zaps", 3);
    this.queuesNip05 = new Queue("nip05", 10);
    if (opts.signatureVerificationWorker) {
      this.signatureVerificationWorker = opts.signatureVerificationWorker;
    }
    if (opts.signatureVerificationFunction) {
      this.signatureVerificationFunction = opts.signatureVerificationFunction;
    }
    this.initialValidationRatio = opts.initialValidationRatio || 1;
    this.lowestValidationRatio = opts.lowestValidationRatio || 0.1;
    this.autoBlacklistInvalidRelays = opts.autoBlacklistInvalidRelays || false;
    this.validationRatioFn = opts.validationRatioFn || this.defaultValidationRatioFn;
    this.filterValidationMode = opts.filterValidationMode || "validate";
    try {
      this.httpFetch = fetch;
    } catch {
    }
  }
  set explicitRelayUrls(urls) {
    this._explicitRelayUrls = urls.map(normalizeRelayUrl);
    this.pool.relayUrls = urls;
  }
  get explicitRelayUrls() {
    return this._explicitRelayUrls || [];
  }
  /**
   * Set a Web Worker for signature verification.
   *
   * This method initializes the worker and sets the asyncSigVerification flag.
   * The actual verification is handled by the verifySignatureAsync function in signature.ts,
   * which will use the worker if available.
   */
  set signatureVerificationWorker(worker2) {
    this._signatureVerificationWorker = worker2;
    if (worker2) {
      signatureVerificationInit(worker2);
      this.asyncSigVerification = true;
    } else {
      this.asyncSigVerification = false;
    }
  }
  /**
   * Set a custom signature verification function.
   *
   * This method is particularly useful for platforms that don't support Web Workers,
   * such as React Native.
   *
   * When a function is provided, it will be used for signature verification
   * instead of the default worker-based verification. This enables signature
   * verification on platforms where Web Workers are not available.
   *
   * @example
   * ```typescript
   * import { verifySignatureAsync } from "@nostr-dev-kit/ndk-mobile";
   *
   * ndk.signatureVerificationFunction = verifySignatureAsync;
   * ```
   */
  set signatureVerificationFunction(fn) {
    this._signatureVerificationFunction = fn;
    this.asyncSigVerification = !!fn;
  }
  /**
   * Get the custom signature verification function
   */
  get signatureVerificationFunction() {
    return this._signatureVerificationFunction;
  }
  /**
   * Adds an explicit relay to the pool.
   * @param url
   * @param relayAuthPolicy Authentication policy to use if different from the default
   * @param connect Whether to connect to the relay automatically
   * @returns
   */
  addExplicitRelay(urlOrRelay, relayAuthPolicy, connect = true) {
    let relay;
    if (typeof urlOrRelay === "string") {
      relay = new NDKRelay(urlOrRelay, relayAuthPolicy, this);
    } else {
      relay = urlOrRelay;
    }
    this.pool.addRelay(relay, connect);
    this.explicitRelayUrls?.push(relay.url);
    return relay;
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
    const differentUser = this._activeUser?.pubkey !== user?.pubkey;
    this._activeUser = user;
    if (user && differentUser) {
      setActiveUser.call(this, user);
    } else if (!user) {
      this.mutedIds = /* @__PURE__ */ new Map();
    }
  }
  get signer() {
    return this._signer;
  }
  set signer(newSigner) {
    this._signer = newSigner;
    if (newSigner) this.emit("signer:ready", newSigner);
    newSigner?.user().then((user) => {
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
      this.debug(
        "Attempting to connect to user relays specified by signer %o",
        await this._signer.relays?.(this)
      );
      if (this._signer.relays) {
        const relays = await this._signer.relays(this);
        relays.forEach((relay) => this.pool.addRelay(relay));
      }
    }
    const connections = [this.pool.connect(timeoutMs)];
    if (this.outboxPool) {
      connections.push(this.outboxPool.connect(timeoutMs));
    }
    return Promise.allSettled(connections).then(() => {
    });
  }
  /**
   * Centralized method to report an invalid signature, identifying the relay that provided it.
   * A single invalid signature means the relay is considered malicious.
   * All invalid signature detections (synchronous or asynchronous) should delegate to this method.
   *
   * @param event The event with an invalid signature
   * @param relay The relay that provided the invalid signature
   */
  reportInvalidSignature(event, relay) {
    this.debug(`Invalid signature detected for event ${event.id}${relay ? ` from relay ${relay.url}` : ""}`);
    this.emit("event:invalid-sig", event, relay);
    if (this.autoBlacklistInvalidRelays && relay) {
      this.blacklistRelay(relay.url);
    }
  }
  /**
   * Add a relay URL to the blacklist as it has been identified as malicious
   */
  blacklistRelay(url) {
    if (!this.blacklistRelayUrls) {
      this.blacklistRelayUrls = [];
    }
    if (!this.blacklistRelayUrls.includes(url)) {
      this.blacklistRelayUrls.push(url);
      this.debug(`Added relay to blacklist: ${url}`);
      const relay = this.pool.getRelay(url, false, false);
      if (relay) {
        relay.disconnect();
        this.debug(`Disconnected from blacklisted relay: ${url}`);
      }
    }
  }
  /**
   * Default function to calculate validation ratio based on historical validation results.
   * The more events validated successfully, the lower the ratio goes (down to the minimum).
   */
  defaultValidationRatioFn(relay, validatedCount, nonValidatedCount) {
    if (validatedCount < 10) return this.initialValidationRatio;
    const trustFactor = Math.min(validatedCount / 100, 1);
    const calculatedRatio = this.initialValidationRatio * (1 - trustFactor) + this.lowestValidationRatio * trustFactor;
    return Math.max(calculatedRatio, this.lowestValidationRatio);
  }
  /**
   * Get a NDKUser object
   *
   * @param opts - User parameters object or a string (npub, nprofile, or hex pubkey)
   * @returns NDKUser instance
   *
   * @example
   * ```typescript
   * // Using parameters object
   * const user1 = ndk.getUser({ pubkey: "hex..." });
   *
   * // Using npub string
   * const user2 = ndk.getUser("npub1...");
   *
   * // Using nprofile string (includes relay hints)
   * const user3 = ndk.getUser("nprofile1...");
   *
   * // Using hex pubkey directly
   * const user4 = ndk.getUser("deadbeef...");
   * ```
   */
  getUser(opts) {
    if (typeof opts === "string") {
      if (opts.startsWith("npub1")) {
        const { type, data } = nip19_exports.decode(opts);
        if (type !== "npub") throw new Error(`Invalid npub: ${opts}`);
        return this.getUser({ pubkey: data });
      } else if (opts.startsWith("nprofile1")) {
        const { type, data } = nip19_exports.decode(opts);
        if (type !== "nprofile") throw new Error(`Invalid nprofile: ${opts}`);
        return this.getUser({
          pubkey: data.pubkey,
          relayUrls: data.relays
        });
      } else {
        return this.getUser({ pubkey: opts });
      }
    }
    const user = new NDKUser(opts);
    user.ndk = this;
    return user;
  }
  /**
   * Get a NDKUser from a NIP05
   * @param nip05 NIP-05 ID
   * @param skipCache Skip cache
   * @returns
   */
  async getUserFromNip05(nip05, skipCache = false) {
    return NDKUser.fromNip05(nip05, this, skipCache);
  }
  /**
   * Creates and starts a new subscription.
   *
   * Subscriptions automatically start unless `autoStart` is set to `false`.
   * You can control automatic closing on EOSE via `opts.closeOnEose`.
   *
   * @param filters - A single NDKFilter object or an array of filters.
   * @param opts - Optional NDKSubscriptionOptions to customize behavior (e.g., caching, grouping).
   * @param handlers - Optional handlers for subscription events. Passing handlers is the preferred method of using ndk.subscribe.
   *   - `onEvent`: Called for each event received.
   *  - `onEvents`: Called once with an array of events when the subscription starts (from the cache).
   *  - `onEose`: Called when the subscription receives EOSE.
   *  For backwards compatibility, this third parameter also accepts a relaySet, the relaySet should be passed via `opts.relaySet`.
   *
   * @param _autoStart - For backwards compatibility, this can be a boolean indicating whether to start the subscription immediately.
   *  This parameter is deprecated and will be removed in a future version.
   *   - `false`: Creates the subscription but does not start it (call `subscription.start()` manually).
   * @returns The created NDKSubscription instance.
   *
   * @example Basic subscription
   * ```typescript
   * const sub = ndk.subscribe({ kinds: [1], authors: [pubkey] });
   * sub.on("event", (event) => console.log("Kind 1 event:", event.content));
   * ```
   *
   * @example Subscription with options and direct handlers
   * ```typescript
   * const sub = ndk.subscribe(
   *   { kinds: [0], authors: [pubkey] },
   *   { closeOnEose: true, cacheUsage: NDKSubscriptionCacheUsage.PARALLEL },
   *   undefined, // Use default relay set calculation
   *   {
   *     onEvents: (events) => { // Renamed parameter
   *       if (events.length > 0) {
   *         console.log(`Got ${events.length} profile events from cache:`, events[0].content);
   *       }
   *     },
   *     onEvent: (event) => { // Renamed parameter
   *       console.log("Got profile update from relay:", event.content); // Clarified source
   *     },
   *     onEose: () => console.log("Profile subscription finished.")
   *   }
   * );
   * ```
   *
   * @since 2.13.0 `relaySet` parameter removed; pass `relaySet` or `relayUrls` via `opts`.
   */
  subscribe(filters, opts, autoStartOrRelaySet = true, _autoStart = true) {
    let _relaySet = opts?.relaySet;
    let autoStart = _autoStart;
    if (autoStartOrRelaySet instanceof NDKRelaySet) {
      console.warn("relaySet is deprecated, use opts.relaySet instead. This will be removed in version v2.14.0");
      _relaySet = autoStartOrRelaySet;
      autoStart = _autoStart;
    } else if (typeof autoStartOrRelaySet === "boolean" || typeof autoStartOrRelaySet === "object") {
      autoStart = autoStartOrRelaySet;
    }
    const subscription = new NDKSubscription(this, filters, { relaySet: _relaySet, ...opts });
    this.subManager.add(subscription);
    const pool = subscription.pool;
    if (subscription.relaySet) {
      for (const relay of subscription.relaySet.relays) {
        pool.useTemporaryRelay(relay, void 0, subscription.filters);
      }
    }
    if (this.outboxPool && subscription.hasAuthorsFilter()) {
      const authors = subscription.filters.filter((filter) => filter.authors && filter.authors?.length > 0).flatMap((filter) => filter.authors);
      this.outboxTracker?.trackUsers(authors);
    }
    if (autoStart) {
      let eventsHandler;
      if (typeof autoStart === "object") {
        if (autoStart.onEvent) subscription.on("event", autoStart.onEvent);
        if (autoStart.onEose) subscription.on("eose", autoStart.onEose);
        if (autoStart.onEvents) eventsHandler = autoStart.onEvents;
      }
      setTimeout(() => {
        const cachedEvents = subscription.start(!eventsHandler);
        if (cachedEvents && cachedEvents.length > 0 && !!eventsHandler) eventsHandler(cachedEvents);
      }, 0);
    }
    return subscription;
  }
  /**
   * Attempts to fetch an event from a tag, following relay hints and
   * other best practices.
   * @param tag Tag to fetch the event from
   * @param originalEvent Event where the tag came from
   * @param subOpts Subscription options to use when fetching the event
   * @param fallback Fallback options to use when the hint relay doesn't respond
   * @returns
   */
  fetchEventFromTag = fetchEventFromTag.bind(this);
  /**
   * Fetch an event from the cache synchronously.
   * @param idOrFilter event id in bech32 format or filter
   * @returns events from the cache or null if the cache is empty
   */
  fetchEventSync(idOrFilter) {
    if (!this.cacheAdapter) throw new Error("Cache adapter not set");
    let filters;
    if (typeof idOrFilter === "string") filters = [filterFromId(idOrFilter)];
    else filters = idOrFilter;
    const sub = new NDKSubscription(this, filters);
    const events = this.cacheAdapter.query(sub);
    if (events instanceof Promise) throw new Error("Cache adapter is async");
    return events.map((e) => {
      e.ndk = this;
      return e;
    });
  }
  /**
   * Fetch a single event.
   *
   * @param idOrFilter event id in bech32 format or filter
   * @param opts subscription options
   * @param relaySetOrRelay explicit relay set to use
   */
  async fetchEvent(idOrFilter, opts, relaySetOrRelay) {
    let filters;
    let relaySet;
    if (relaySetOrRelay instanceof NDKRelay) {
      relaySet = new NDKRelaySet(/* @__PURE__ */ new Set([relaySetOrRelay]), this);
    } else if (relaySetOrRelay instanceof NDKRelaySet) {
      relaySet = relaySetOrRelay;
    }
    if (!relaySetOrRelay && typeof idOrFilter === "string") {
      if (!isNip33AValue(idOrFilter)) {
        const relays = relaysFromBech32(idOrFilter, this);
        if (relays.length > 0) {
          relaySet = new NDKRelaySet(new Set(relays), this);
          relaySet = correctRelaySet(relaySet, this.pool);
        }
      }
    }
    if (typeof idOrFilter === "string") {
      filters = [filterFromId(idOrFilter)];
    } else if (Array.isArray(idOrFilter)) {
      filters = idOrFilter;
    } else {
      filters = [idOrFilter];
    }
    if (filters.length === 0) {
      throw new Error(`Invalid filter: ${JSON.stringify(idOrFilter)}`);
    }
    return new Promise((resolve) => {
      let fetchedEvent = null;
      const subscribeOpts = {
        ...opts || {},
        closeOnEose: true
      };
      if (relaySet) subscribeOpts.relaySet = relaySet;
      const s = this.subscribe(
        filters,
        subscribeOpts,
        // relaySet, // Removed: Passed via opts
        false
        // autoStart = false
      );
      const t2 = setTimeout(() => {
        s.stop();
        resolve(fetchedEvent);
      }, 1e4);
      s.on("event", (event) => {
        event.ndk = this;
        if (!event.isReplaceable()) {
          clearTimeout(t2);
          resolve(event);
        } else if (!fetchedEvent || fetchedEvent.created_at < event.created_at) {
          fetchedEvent = event;
        }
      });
      s.on("eose", () => {
        clearTimeout(t2);
        resolve(fetchedEvent);
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
      const subscribeOpts = {
        ...opts || {},
        closeOnEose: true
      };
      if (relaySet) subscribeOpts.relaySet = relaySet;
      const relaySetSubscription = this.subscribe(
        filters,
        subscribeOpts,
        // relaySet, // Removed: Passed via opts
        false
        // autoStart = false
      );
      const onEvent = (event) => {
        let _event;
        if (!(event instanceof NDKEvent)) _event = new NDKEvent(void 0, event);
        else _event = event;
        const dedupKey = _event.deduplicationKey();
        const existingEvent = events.get(dedupKey);
        if (existingEvent) {
          _event = dedup(existingEvent, _event);
        }
        _event.ndk = this;
        events.set(dedupKey, _event);
      };
      relaySetSubscription.on("event", onEvent);
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
      this.emit("signer:required");
      throw new Error("Signer required");
    }
  }
  getEntity = getEntity.bind(this);
  set wallet(wallet) {
    if (!wallet) {
      this.walletConfig = void 0;
      return;
    }
    this.walletConfig ??= {};
    this.walletConfig.lnPay = wallet?.lnPay?.bind(wallet);
    this.walletConfig.cashuPay = wallet?.cashuPay?.bind(wallet);
  }
};
var d2 = (0, import_debug12.default)("ndk:zapper:ln");
var d3 = (0, import_debug11.default)("ndk:zapper");
var nip19_exports3 = {};
__reExport(nip19_exports3, nip19_exports2);

// node_modules/svelte/src/internal/shared/utils.js
var index_of = Array.prototype.indexOf;
var includes = Array.prototype.includes;
var object_prototype = Object.prototype;
var array_prototype = Array.prototype;
var noop = () => {
};

// node_modules/svelte/src/internal/client/reactivity/equality.js
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}

// node_modules/svelte/node_modules/esm-env/dev-fallback.js
var node_env = globalThis.process?.env?.NODE_ENV;
var dev_fallback_default = node_env && !node_env.toLowerCase().startsWith("prod");

// node_modules/svelte/src/internal/client/constants.js
var DERIVED = 1 << 1;
var EFFECT = 1 << 2;
var RENDER_EFFECT = 1 << 3;
var MANAGED_EFFECT = 1 << 24;
var BLOCK_EFFECT = 1 << 4;
var BRANCH_EFFECT = 1 << 5;
var ROOT_EFFECT = 1 << 6;
var BOUNDARY_EFFECT = 1 << 7;
var CONNECTED = 1 << 9;
var CLEAN = 1 << 10;
var DIRTY = 1 << 11;
var MAYBE_DIRTY = 1 << 12;
var INERT = 1 << 13;
var DESTROYED = 1 << 14;
var REACTION_RAN = 1 << 15;
var DESTROYING = 1 << 25;
var EFFECT_TRANSPARENT = 1 << 16;
var EAGER_EFFECT = 1 << 17;
var HEAD_EFFECT = 1 << 18;
var EFFECT_PRESERVED = 1 << 19;
var USER_EFFECT = 1 << 20;
var EFFECT_OFFSCREEN = 1 << 25;
var WAS_MARKED = 1 << 16;
var REACTION_IS_UPDATING = 1 << 21;
var ASYNC = 1 << 22;
var ERROR_VALUE = 1 << 23;
var STALE_REACTION = new class StaleReactionError extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
var IS_XHTML = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
);

// node_modules/svelte/src/constants.js
var EACH_INDEX_REACTIVE = 1 << 1;
var EACH_IS_CONTROLLED = 1 << 2;
var EACH_IS_ANIMATED = 1 << 3;
var EACH_ITEM_IMMUTABLE = 1 << 4;
var PROPS_IS_RUNES = 1 << 1;
var PROPS_IS_UPDATED = 1 << 2;
var PROPS_IS_BINDABLE = 1 << 3;
var PROPS_IS_LAZY_INITIAL = 1 << 4;
var TRANSITION_OUT = 1 << 1;
var TRANSITION_GLOBAL = 1 << 2;
var TEMPLATE_USE_IMPORT_NODE = 1 << 1;
var TEMPLATE_USE_SVG = 1 << 2;
var TEMPLATE_USE_MATHML = 1 << 3;
var ELEMENT_PRESERVE_ATTRIBUTE_CASE = 1 << 1;
var ELEMENT_IS_INPUT = 1 << 2;

// node_modules/svelte/src/internal/client/reactivity/status.js
var STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);

// node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED;

// node_modules/svelte/src/store/shared/index.js
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop = null;
  const subscribers = /* @__PURE__ */ new Set();
  function set2(new_value) {
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
  function update2(fn) {
    set2(fn(
      /** @type {T} */
      value
    ));
  }
  function subscribe(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set2, update2) || noop;
    }
    run(
      /** @type {T} */
      value
    );
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set: set2, update: update2, subscribe };
}

// node_modules/@nostr-dev-kit/ndk-svelte/dist/index.mjs
var NDKSvelte = class extends NDK {
  createEventStore(filters) {
    const store = writable([]);
    return {
      id: Math.random().toString(36).substring(7),
      refCount: 0,
      filters,
      skipDeleted: true,
      subscription: void 0,
      eosed: false,
      set: store.set,
      update: store.update,
      subscribe: store.subscribe,
      unsubscribe: () => {
      },
      onEose: (_cb) => {
      },
      onEvent: (_cb) => {
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
      changeFilters: (_filters) => {
        throw new Error("not implemented");
      }
    };
  }
  eventIsRepost(event) {
    return [NDKKind.Repost, NDKKind.GenericRepost].includes(event.kind);
  }
  storeSubscribe(filters, opts, klass) {
    let events = /* @__PURE__ */ new Map();
    const store = this.createEventStore(Array.isArray(filters) ? filters : [filters]);
    const autoStart = opts?.autoStart ?? true;
    const relaySet = opts?.relaySet;
    const skipDeleted = opts?.skipDeleted ?? true;
    const deletedPRETimestamps = /* @__PURE__ */ new Map();
    const getEventArrayFromMap = () => {
      return Array.from(events.values());
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
        store.set(getEventArrayFromMap());
      };
      for (const repostedEventId of _repostEvent.repostedEventIds()) {
        const repostedEvent = events.get(repostedEventId);
        if (repostedEvent) {
          addRepostToExistingEvent(repostedEvent);
        } else {
          _repostEvent.repostedEvents(klass, {
            subId: "reposted-event-fetch",
            groupable: true,
            groupableDelay: 1500,
            groupableDelayType: "at-least"
          }).then((fetchedEvents) => {
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
      if (opts?.repostsFilters && this.eventIsRepost(event)) {
        handleEventReposts(event);
        return;
      }
      let e = event;
      if (klass) {
        const ev = klass.from(event);
        if (!ev) return;
        e = ev;
        e.relay = event.relay;
      }
      e.ndk = this;
      const dedupKey = event.deduplicationKey();
      if (events.has(dedupKey)) {
        const prevEvent = events.get(dedupKey);
        if (prevEvent.created_at > event.created_at) return;
        if (prevEvent.created_at === event.created_at) {
          if (prevEvent.id === event.id) return;
          console.warn("Received event with same created_at but different id", {
            prevId: prevEvent.id,
            newId: event.id,
            prev: prevEvent.rawEvent(),
            new: event.rawEvent()
          });
        }
      }
      if (skipDeleted && event.isParamReplaceable()) {
        const currentDeletedTimestamp = deletedPRETimestamps.get(dedupKey);
        if (currentDeletedTimestamp && currentDeletedTimestamp > event.created_at) return;
        const isDeleted = event.hasTag("deleted");
        if (isDeleted) {
          deletedPRETimestamps.set(dedupKey, event.created_at);
          return;
        }
        deletedPRETimestamps.delete(dedupKey);
      }
      events.set(dedupKey, e);
      store.set(getEventArrayFromMap());
    };
    store.ref = () => {
      store.refCount++;
      if (store.refCount === 1) {
        store.startSubscription();
      }
      return store.refCount;
    };
    store.unref = () => {
      if (--store.refCount > 0) return store.refCount;
      if (opts?.unrefUnsubscribeTimeout) {
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
      events = /* @__PURE__ */ new Map();
      store.unsubscribe();
    };
    store.changeFilters = (filters2) => {
      store.filters = filters2;
      store.empty();
      if (store.refCount > 0) store.startSubscription();
    };
    store.startSubscription = () => {
      if (!store.filters) {
        throw new Error("no filters");
      }
      const filters2 = store.filters;
      if (opts?.repostsFilters) {
        filters2.push(...opts.repostsFilters);
      }
      store.subscription = this.subscribe(filters2, { ...opts, relaySet }, false);
      store.subscription.on("event", (event, relay) => {
        handleEvent(event);
        if (opts?.onEvent) opts.onEvent(event, relay);
      });
      store.subscription.start();
      store.unsubscribe = () => {
        store.subscription?.stop();
        store.subscription = void 0;
      };
      store.onEose = (cb) => {
        store.subscription?.on("eose", () => {
          store.eosed = true;
          cb();
        });
      };
      if (opts?.onEose) {
        store.onEose(opts.onEose);
      }
    };
    if (autoStart) {
      store.startSubscription();
    }
    return store;
  }
};
var index_default = NDKSvelte;

// node_modules/@nostr-dev-kit/ndk-cache-dexie/dist/index.mjs
var import_debug14 = __toESM(require_src(), 1);

// node_modules/dexie/import-wrapper.mjs
var import_dexie = __toESM(require_dexie(), 1);
var DexieSymbol = /* @__PURE__ */ Symbol.for("Dexie");
var Dexie = globalThis[DexieSymbol] || (globalThis[DexieSymbol] = import_dexie.default);
if (import_dexie.default.semVer !== Dexie.semVer) {
  throw new Error(`Two different versions of Dexie loaded in the same app: ${import_dexie.default.semVer} and ${Dexie.semVer}`);
}
var {
  liveQuery,
  mergeRanges,
  rangesOverlap,
  RangeSet,
  cmp,
  Entity,
  PropModification,
  replacePrefix,
  add,
  remove,
  DexieYProvider
} = Dexie;
var import_wrapper_default = Dexie;

// node_modules/@nostr-dev-kit/ndk-cache-dexie/dist/index.mjs
var import_debug15 = __toESM(require_src(), 1);
var import_typescript_lru_cache3 = __toESM(require_dist(), 1);
async function eventTagsWarmUp(cacheHandler, eventTags) {
  const array = await eventTags.limit(cacheHandler.maxSize).toArray();
  for (const event of array) {
    cacheHandler.add(event.tagValue, event.eventId, false);
  }
}
var eventTagsDump = (eventTags, debug9) => {
  return async (dirtyKeys, cache) => {
    const entries = [];
    for (const tagValue of dirtyKeys) {
      const eventIds = cache.get(tagValue);
      if (eventIds) {
        for (const eventId of eventIds) entries.push({ tagValue, eventId });
      }
    }
    if (entries.length > 0) {
      debug9(`Saving ${entries.length} events cache entries to database`);
      await eventTags.bulkPut(entries);
    }
    dirtyKeys.clear();
  };
};
async function eventsWarmUp(cacheHandler, events) {
  const array = await events.limit(cacheHandler.maxSize).toArray();
  for (const event of array) {
    cacheHandler.set(event.id, event, false);
  }
}
var eventsDump = (events, debug9) => {
  return async (dirtyKeys, cache) => {
    const entries = [];
    for (const event of dirtyKeys) {
      const entry = cache.get(event);
      if (entry) entries.push(entry);
    }
    if (entries.length > 0) {
      debug9(`Saving ${entries.length} events cache entries to database`);
      await events.bulkPut(entries);
    }
    dirtyKeys.clear();
  };
};
async function nip05WarmUp(cacheHandler, nip05s) {
  const array = await nip05s.limit(cacheHandler.maxSize).toArray();
  for (const nip05 of array) {
    cacheHandler.set(nip05.nip05, nip05, false);
  }
}
var nip05Dump = (nip05s, debug9) => {
  return async (dirtyKeys, cache) => {
    const entries = [];
    for (const nip05 of dirtyKeys) {
      const entry = cache.get(nip05);
      if (entry) {
        entries.push({
          nip05,
          ...entry
        });
      }
    }
    if (entries.length) {
      debug9(`Saving ${entries.length} NIP-05 cache entries to database`);
      await nip05s.bulkPut(entries);
    }
    dirtyKeys.clear();
  };
};
var Database = class extends import_wrapper_default {
  profiles;
  events;
  eventTags;
  nip05;
  lnurl;
  relayStatus;
  unpublishedEvents;
  constructor(name) {
    super(name);
    this.version(15).stores({
      profiles: "&pubkey",
      events: "&id, kind",
      eventTags: "&tagValue",
      nip05: "&nip05",
      lnurl: "&pubkey",
      relayStatus: "&url",
      unpublishedEvents: "&id"
    });
  }
};
var db;
function createDatabase(name) {
  db = new Database(name);
}
var d4 = (0, import_debug15.default)("ndk:dexie-adapter:profiles");
async function profilesWarmUp(cacheHandler, profiles) {
  const array = await profiles.limit(cacheHandler.maxSize).toArray();
  for (const user of array) {
    const obj = user;
    cacheHandler.set(user.pubkey, obj, false);
  }
  d4("Loaded %d profiles from database", cacheHandler.size());
}
var profilesDump = (profiles, debug9) => {
  return async (dirtyKeys, cache) => {
    const entries = [];
    for (const pubkey of dirtyKeys) {
      const entry = cache.get(pubkey);
      if (entry) {
        entries.push(entry);
      }
    }
    if (entries.length) {
      debug9(`Saving ${entries.length} users to database`);
      await profiles.bulkPut(entries);
    }
    dirtyKeys.clear();
  };
};
async function relayInfoWarmUp(cacheHandler, relayStatus) {
  const array = await relayStatus.limit(cacheHandler.maxSize).toArray();
  for (const entry of array) {
    cacheHandler.set(
      entry.url,
      {
        url: entry.url,
        updatedAt: entry.updatedAt,
        lastConnectedAt: entry.lastConnectedAt,
        dontConnectBefore: entry.dontConnectBefore
      },
      false
    );
  }
}
var relayInfoDump = (relayStatus, debug9) => {
  return async (dirtyKeys, cache) => {
    const entries = [];
    for (const url of dirtyKeys) {
      const info = cache.get(url);
      if (info) {
        entries.push({
          url,
          updatedAt: info.updatedAt,
          lastConnectedAt: info.lastConnectedAt,
          dontConnectBefore: info.dontConnectBefore
        });
      }
    }
    if (entries.length > 0) {
      debug9(`Saving ${entries.length} relay status cache entries to database`);
      await relayStatus.bulkPut(entries);
    }
    dirtyKeys.clear();
  };
};
var WRITE_STATUS_THRESHOLD = 3;
async function unpublishedEventsWarmUp(cacheHandler, unpublishedEvents) {
  await unpublishedEvents.each((unpublishedEvent) => {
    cacheHandler.set(unpublishedEvent.event.id, unpublishedEvent, false);
  });
}
function unpublishedEventsDump(unpublishedEvents, debug9) {
  return async (dirtyKeys, cache) => {
    const entries = [];
    for (const eventId of dirtyKeys) {
      const entry = cache.get(eventId);
      if (entry) {
        entries.push(entry);
      }
    }
    if (entries.length > 0) {
      debug9(`Saving ${entries.length} unpublished events cache entries to database`);
      await unpublishedEvents.bulkPut(entries);
    }
    dirtyKeys.clear();
  };
}
async function discardUnpublishedEvent(unpublishedEvents, eventId) {
  await unpublishedEvents.delete(eventId);
}
async function getUnpublishedEvents(unpublishedEvents) {
  const events = [];
  await unpublishedEvents.each((unpublishedEvent) => {
    events.push({
      event: new NDKEvent(void 0, unpublishedEvent.event),
      relays: Object.keys(unpublishedEvent.relays),
      lastTryAt: unpublishedEvent.lastTryAt
    });
  });
  return events;
}
function addUnpublishedEvent(event, relays) {
  const r = {};
  relays.forEach((url) => r[url] = false);
  this.unpublishedEvents.set(event.id, { id: event.id, event: event.rawEvent(), relays: r });
  const onPublished = (relay) => {
    const url = relay.url;
    const existingEntry = this.unpublishedEvents.get(event.id);
    if (!existingEntry) {
      event.off("publushed", onPublished);
      return;
    }
    existingEntry.relays[url] = true;
    this.unpublishedEvents.set(event.id, existingEntry);
    const successWrites = Object.values(existingEntry.relays).filter((v) => v).length;
    const unsuccessWrites = Object.values(existingEntry.relays).length - successWrites;
    if (successWrites >= WRITE_STATUS_THRESHOLD || unsuccessWrites === 0) {
      this.unpublishedEvents.delete(event.id);
      event.off("published", onPublished);
    }
  };
  event.on("published", onPublished);
}
async function zapperWarmUp(cacheHandler, lnurls) {
  const array = await lnurls.limit(cacheHandler.maxSize).toArray();
  for (const lnurl of array) {
    cacheHandler.set(lnurl.pubkey, { document: lnurl.document, fetchedAt: lnurl.fetchedAt }, false);
  }
}
var zapperDump = (lnurls, debug9) => {
  return async (dirtyKeys, cache) => {
    const entries = [];
    for (const pubkey of dirtyKeys) {
      const entry = cache.get(pubkey);
      if (entry) {
        entries.push({
          pubkey,
          ...entry
        });
      }
    }
    if (entries.length) {
      debug9(`Saving ${entries.length} zapper cache entries to database`);
      await lnurls.bulkPut(entries);
    }
    dirtyKeys.clear();
  };
};
var CacheHandler = class {
  cache;
  dirtyKeys = /* @__PURE__ */ new Set();
  options;
  debug;
  indexes;
  isSet = false;
  maxSize = 0;
  constructor(options) {
    this.debug = options.debug;
    this.options = options;
    this.maxSize = options.maxSize;
    if (options.maxSize > 0) {
      this.cache = new import_typescript_lru_cache3.LRUCache({ maxSize: options.maxSize });
      setInterval(() => this.dump().catch(console.error), 1e3 * 10);
    }
    this.indexes = /* @__PURE__ */ new Map();
  }
  getSet(key) {
    return this.cache?.get(key);
  }
  /**
   * Get all entries that match the filter.
   */
  getAllWithFilter(filter) {
    const ret = /* @__PURE__ */ new Map();
    this.cache?.forEach((val, key) => {
      if (filter(key, val)) {
        ret.set(key, val);
      }
    });
    return ret;
  }
  get(key) {
    return this.cache?.get(key);
  }
  async getWithFallback(key, table) {
    let entry = this.get(key);
    if (!entry) {
      entry = await table.get(key);
      if (entry) {
        this.set(key, entry);
      }
    }
    return entry;
  }
  async getManyWithFallback(keys, table) {
    const entries = [];
    const missingKeys = [];
    for (const key of keys) {
      const entry = this.get(key);
      if (entry) entries.push(entry);
      else missingKeys.push(key);
    }
    if (entries.length > 0) {
      this.debug(`Cache hit for keys ${entries.length} and miss for ${missingKeys.length} keys`);
    }
    if (missingKeys.length > 0) {
      const startTime = Date.now();
      const missingEntries = await table.bulkGet(missingKeys);
      const endTime = Date.now();
      let foundKeys = 0;
      for (const entry of missingEntries) {
        if (entry) {
          this.set(entry.id, entry);
          entries.push(entry);
          foundKeys++;
        }
      }
      this.debug(
        `Time spent querying database: ${endTime - startTime}ms for ${missingKeys.length} keys, which added ${foundKeys} entries to the cache`
      );
    }
    return entries;
  }
  add(key, value, dirty = true) {
    const existing = this.get(key) ?? /* @__PURE__ */ new Set();
    existing.add(value);
    this.cache?.set(key, existing);
    if (dirty) this.dirtyKeys.add(key);
  }
  set(key, value, dirty = true) {
    this.cache?.set(key, value);
    if (dirty) this.dirtyKeys.add(key);
    for (const [attribute, index] of this.indexes.entries()) {
      const indexKey = value[attribute];
      if (indexKey) {
        const indexValue = index.get(indexKey) || /* @__PURE__ */ new Set();
        indexValue.add(key);
        index.set(indexKey, indexValue);
      }
    }
  }
  size() {
    return this.cache?.size || 0;
  }
  delete(key) {
    this.cache?.delete(key);
    this.dirtyKeys.add(key);
  }
  async dump() {
    if (this.dirtyKeys.size > 0 && this.cache) {
      await this.options.dump(this.dirtyKeys, this.cache);
      this.dirtyKeys.clear();
    }
  }
  addIndex(attribute) {
    this.indexes.set(attribute, new import_typescript_lru_cache3.LRUCache({ maxSize: this.options.maxSize }));
  }
  getFromIndex(index, key) {
    const ret = /* @__PURE__ */ new Set();
    const indexValues = this.indexes.get(index);
    if (indexValues) {
      const values = indexValues.get(key);
      if (values) {
        for (const key2 of values.values()) {
          const entry = this.get(key2);
          if (entry) ret.add(entry);
        }
      }
    }
    return ret;
  }
};
var INDEXABLE_TAGS_LIMIT = 10;
var NDKCacheAdapterDexie = class {
  debug;
  locking = false;
  ready = false;
  profiles;
  zappers;
  nip05s;
  events;
  eventTags;
  relayInfo;
  unpublishedEvents;
  warmedUp = false;
  warmUpPromise;
  devMode = false;
  saveSig;
  _onReady;
  constructor(opts = {}) {
    createDatabase(opts.dbName || "ndk");
    this.debug = opts.debug || (0, import_debug14.default)("ndk:dexie-adapter");
    this.saveSig = opts.saveSig || false;
    this.profiles = new CacheHandler({
      maxSize: opts.profileCacheSize || 1e5,
      dump: profilesDump(db.profiles, this.debug),
      debug: this.debug
    });
    this.zappers = new CacheHandler({
      maxSize: opts.zapperCacheSize || 200,
      dump: zapperDump(db.lnurl, this.debug),
      debug: this.debug
    });
    this.nip05s = new CacheHandler({
      maxSize: opts.nip05CacheSize || 1e3,
      dump: nip05Dump(db.nip05, this.debug),
      debug: this.debug
    });
    this.events = new CacheHandler({
      maxSize: opts.eventCacheSize || 5e4,
      dump: eventsDump(db.events, this.debug),
      debug: this.debug
    });
    this.events.addIndex("pubkey");
    this.events.addIndex("kind");
    this.eventTags = new CacheHandler({
      maxSize: opts.eventTagsCacheSize || 1e5,
      dump: eventTagsDump(db.eventTags, this.debug),
      debug: this.debug
    });
    this.relayInfo = new CacheHandler({
      maxSize: 500,
      debug: this.debug,
      dump: relayInfoDump(db.relayStatus, this.debug)
    });
    this.unpublishedEvents = new CacheHandler({
      maxSize: 5e3,
      debug: this.debug,
      dump: unpublishedEventsDump(db.unpublishedEvents, this.debug)
    });
    const profile = (label, fn) => {
      const start = Date.now();
      return fn().then(() => {
        const end = Date.now();
        this.debug(label, "took", end - start, "ms");
      });
    };
    const startTime = Date.now();
    this.warmUpPromise = Promise.allSettled([
      profile("profilesWarmUp", () => profilesWarmUp(this.profiles, db.profiles)),
      profile("zapperWarmUp", () => zapperWarmUp(this.zappers, db.lnurl)),
      profile("nip05WarmUp", () => nip05WarmUp(this.nip05s, db.nip05)),
      profile("relayInfoWarmUp", () => relayInfoWarmUp(this.relayInfo, db.relayStatus)),
      profile(
        "unpublishedEventsWarmUp",
        () => unpublishedEventsWarmUp(this.unpublishedEvents, db.unpublishedEvents)
      ),
      profile("eventsWarmUp", () => eventsWarmUp(this.events, db.events)),
      profile("eventTagsWarmUp", () => eventTagsWarmUp(this.eventTags, db.eventTags))
    ]);
    this.warmUpPromise.then(() => {
      const endTime = Date.now();
      this.warmedUp = true;
      this.ready = true;
      this.locking = true;
      this.debug("Warm up completed, time", endTime - startTime, "ms");
      if (this._onReady) this._onReady();
    });
  }
  onReady(callback) {
    this._onReady = callback;
  }
  async query(subscription) {
    if (!this.warmedUp) {
      const startTime2 = Date.now();
      await this.warmUpPromise;
      this.debug("froze query for", Date.now() - startTime2, "ms", subscription.filters);
    }
    const startTime = Date.now();
    subscription.filters.map((filter) => this.processFilter(filter, subscription));
    const dur = Date.now() - startTime;
    if (dur > 100) this.debug("query took", dur, "ms", subscription.filter);
    return [];
  }
  async fetchProfile(pubkey) {
    if (!this.profiles) return null;
    const user = await this.profiles.getWithFallback(pubkey, db.profiles);
    return user;
  }
  fetchProfileSync(pubkey) {
    if (!this.profiles) return null;
    const user = this.profiles.get(pubkey);
    return user;
  }
  async getProfiles(fn) {
    if (!this.profiles) return;
    return this.profiles.getAllWithFilter(fn);
  }
  saveProfile(pubkey, profile) {
    const existingValue = this.profiles.get(pubkey);
    if (existingValue?.created_at && profile.created_at && existingValue.created_at >= profile.created_at) {
      return;
    }
    const cachedAt = Math.floor(Date.now() / 1e3);
    this.profiles.set(pubkey, { pubkey, ...profile, cachedAt });
    this.debug("Saved profile for pubkey", pubkey, profile);
  }
  async loadNip05(nip05, maxAgeForMissing = 3600) {
    const cache = this.nip05s?.get(nip05);
    if (cache) {
      if (cache.profile === null) {
        if (cache.fetchedAt + maxAgeForMissing * 1e3 < Date.now()) return "missing";
        return null;
      }
      try {
        return JSON.parse(cache.profile);
      } catch (_e) {
        return "missing";
      }
    }
    const nip = await db.nip05.get({ nip05 });
    if (!nip) return "missing";
    const now2 = Date.now();
    if (nip.profile === null) {
      if (nip.fetchedAt + maxAgeForMissing * 1e3 < now2) return "missing";
      return null;
    }
    try {
      return JSON.parse(nip.profile);
    } catch (_e) {
      return "missing";
    }
  }
  async saveNip05(nip05, profile) {
    try {
      const document2 = profile ? JSON.stringify(profile) : null;
      this.nip05s.set(nip05, { profile: document2, fetchedAt: Date.now() });
    } catch (error) {
      console.error("Failed to save NIP-05 profile for nip05:", nip05, error);
    }
  }
  async loadUsersLNURLDoc(pubkey, maxAgeInSecs = 86400, maxAgeForMissing = 3600) {
    const cache = this.zappers?.get(pubkey);
    if (cache) {
      if (cache.document === null) {
        if (cache.fetchedAt + maxAgeForMissing * 1e3 < Date.now()) return "missing";
        return null;
      }
      try {
        return JSON.parse(cache.document);
      } catch (_e) {
        return "missing";
      }
    }
    const lnurl = await db.lnurl.get({ pubkey });
    if (!lnurl) return "missing";
    const now2 = Date.now();
    if (lnurl.fetchedAt + maxAgeInSecs * 1e3 < now2) return "missing";
    if (lnurl.document === null) {
      if (lnurl.fetchedAt + maxAgeForMissing * 1e3 < now2) return "missing";
      return null;
    }
    try {
      return JSON.parse(lnurl.document);
    } catch (_e) {
      return "missing";
    }
  }
  async saveUsersLNURLDoc(pubkey, doc) {
    try {
      const document2 = doc ? JSON.stringify(doc) : null;
      this.zappers?.set(pubkey, { document: document2, fetchedAt: Date.now() });
    } catch (error) {
      console.error("Failed to save LNURL document for pubkey:", pubkey, error);
    }
  }
  processFilter(filter, subscription) {
    const _filter = { ...filter };
    _filter.limit = void 0;
    const filterKeys = new Set(Object.keys(_filter || {}));
    filterKeys.delete("since");
    filterKeys.delete("limit");
    filterKeys.delete("until");
    try {
      if (this.byNip33Query(filterKeys, filter, subscription)) return;
      if (this.byAuthors(filter, subscription)) return;
      if (this.byIdsQuery(filter, subscription)) return;
      if (this.byTags(filter, subscription)) return;
      if (this.byKinds(filterKeys, filter, subscription)) return;
    } catch (error) {
      console.error(error);
    }
  }
  async deleteEventIds(eventIds) {
    eventIds.forEach((id) => this.events.delete(id));
    await db.events.where({ id: eventIds }).delete();
  }
  addUnpublishedEvent = addUnpublishedEvent.bind(this);
  getUnpublishedEvents = () => getUnpublishedEvents(db.unpublishedEvents);
  discardUnpublishedEvent = (id) => discardUnpublishedEvent(db.unpublishedEvents, id);
  async setEvent(event, _filters, relay) {
    if (event.kind === 0) {
      if (!this.profiles) return;
      try {
        const profile = profileFromEvent(event);
        this.saveProfile(event.pubkey, profile);
      } catch {
        this.debug(`Failed to save profile for pubkey: ${event.pubkey}`);
      }
    }
    let addEvent = true;
    if (event.isParamReplaceable()) {
      const existingEvent = this.events.get(event.tagId());
      if (existingEvent && event.created_at && existingEvent.createdAt > event.created_at) {
        addEvent = false;
      }
    }
    if (addEvent) {
      const eventData = {
        id: event.tagId(),
        pubkey: event.pubkey,
        kind: event.kind,
        createdAt: event.created_at ?? Date.now(),
        relay: relay?.url,
        event: event.serialize(this.saveSig, true)
      };
      if (this.saveSig && event.sig) {
        eventData.sig = event.sig;
      }
      this.events.set(event.tagId(), eventData);
      const indexableTags = getIndexableTags(event);
      for (const tag2 of indexableTags) {
        this.eventTags.add(tag2[0] + tag2[1], event.tagId());
      }
    }
  }
  updateRelayStatus(url, info) {
    const val = { url, updatedAt: Date.now(), ...info };
    this.relayInfo.set(url, val);
  }
  getRelayStatus(url) {
    const a = this.relayInfo.get(url);
    if (a) {
      return {
        lastConnectedAt: a.lastConnectedAt,
        dontConnectBefore: a.dontConnectBefore
      };
    }
  }
  /**
   * Searches by authors
   */
  byAuthors(filter, subscription) {
    if (!filter.authors) return false;
    let _total = 0;
    for (const pubkey of filter.authors) {
      let events = Array.from(this.events.getFromIndex("pubkey", pubkey));
      if (filter.kinds) events = events.filter((e) => filter.kinds?.includes(e.kind));
      foundEvents(subscription, events, filter);
      _total += events.length;
    }
    return true;
  }
  /**
   * Searches by ids
   */
  byIdsQuery(filter, subscription) {
    if (filter.ids) {
      for (const id of filter.ids) {
        const event = this.events.get(id);
        if (event) foundEvent(subscription, event, event.relay, filter);
      }
      return true;
    }
    return false;
  }
  /**
   * Searches by NIP-33
   */
  byNip33Query(filterKeys, filter, subscription) {
    const f = ["#d", "authors", "kinds"];
    const hasAllKeys = filterKeys.size === f.length && f.every((k) => filterKeys.has(k));
    if (hasAllKeys && filter.kinds && filter.authors) {
      for (const kind of filter.kinds) {
        const replaceableKind = kind >= 3e4 && kind < 4e4;
        if (!replaceableKind) continue;
        for (const author of filter.authors) {
          for (const dTag of filter["#d"]) {
            const replaceableId = `${kind}:${author}:${dTag}`;
            const event = this.events.get(replaceableId);
            if (event) foundEvent(subscription, event, event.relay, filter);
          }
        }
      }
      return true;
    }
    return false;
  }
  /**
   * Searches by tags and optionally filters by tags
   */
  byTags(filter, subscription) {
    const tagFilters = Object.entries(filter).filter(([filter2]) => filter2.startsWith("#") && filter2.length === 2).map(([filter2, values]) => [filter2[1], values]);
    if (tagFilters.length === 0) return false;
    for (const [tag2, values] of tagFilters) {
      for (const value of values) {
        const tagValue = tag2 + value;
        const eventIds = this.eventTags.getSet(tagValue);
        if (!eventIds) continue;
        eventIds.forEach((id) => {
          const event = this.events.get(id);
          if (!event) return;
          if (!filter.kinds || filter.kinds.includes(event.kind)) {
            foundEvent(subscription, event, event.relay, filter);
          }
        });
      }
    }
    return true;
  }
  byKinds(filterKeys, filter, subscription) {
    if (!filter.kinds || filterKeys.size !== 1 || !filterKeys.has("kinds")) return false;
    const limit = filter.limit || 500;
    let totalEvents = 0;
    const processedEventIds = /* @__PURE__ */ new Set();
    const sortedKinds = [...filter.kinds].sort(
      (a, b) => (this.events.indexes.get("kind")?.get(a)?.size || 0) - (this.events.indexes.get("kind")?.get(b)?.size || 0)
    );
    for (const kind of sortedKinds) {
      const events = this.events.getFromIndex("kind", kind);
      for (const event of events) {
        if (processedEventIds.has(event.id)) continue;
        processedEventIds.add(event.id);
        foundEvent(subscription, event, event.relay, filter);
        totalEvents++;
        if (totalEvents >= limit) break;
      }
      if (totalEvents >= limit) break;
    }
    return true;
  }
};
function foundEvents(subscription, events, filter) {
  if (filter?.limit && events.length > filter.limit) {
    events = events.sort((a, b) => b.createdAt - a.createdAt).slice(0, filter.limit);
  }
  for (const event of events) {
    foundEvent(subscription, event, event.relay, filter);
  }
}
function foundEvent(subscription, event, relayUrl, filter) {
  try {
    const deserializedEvent = deserialize(event.event);
    if (filter && !matchFilter(filter, deserializedEvent)) return;
    const ndkEvent = new NDKEvent(void 0, deserializedEvent);
    const relay = relayUrl ? subscription.pool.getRelay(relayUrl, false) : void 0;
    ndkEvent.relay = relay;
    subscription.eventReceived(ndkEvent, relay, true);
  } catch (e) {
    console.error("failed to deserialize event", e);
  }
}
function getIndexableTags(event) {
  const indexableTags = [];
  if (event.kind === 3) return [];
  for (const tag2 of event.tags) {
    if (tag2[0].length !== 1) continue;
    indexableTags.push(tag2);
    if (indexableTags.length >= INDEXABLE_TAGS_LIMIT) return [];
  }
  return indexableTags;
}

// src/stores/provider.ts
var cacheAdapter;
var defaulRelaysUrls = [
  "wss://relay.nostr.info/",
  "wss://relay.ditto.pub/",
  "wss://purplepag.es",
  "wss://nos.lol",
  "wss://offchain.pub/",
  "wss://nostr-pub.wellorder.net"
];
var CACHE_DB_NAME = "nostr-opinion-ndk-v15";
var OLD_CACHE_DB_NAMES = ["walletScrutiny", "nostr-opinion-cache"];
function initCacheAdapter() {
  if (typeof window === "undefined") return void 0;
  for (const name of OLD_CACHE_DB_NAMES) {
    try {
      indexedDB.deleteDatabase(name);
    } catch (_) {
    }
  }
  return new NDKCacheAdapterDexie({ dbName: CACHE_DB_NAME });
}
if (typeof window !== "undefined") {
  cacheAdapter = initCacheAdapter();
}
var ndk = new index_default({
  explicitRelayUrls: defaulRelaysUrls,
  cacheAdapter
});
var ndkStore = writable(ndk);
var _bunkerNDK = new NDK({
  explicitRelayUrls: [
    "wss://relay.nsecbunker.com",
    "wss://nostr.vulpem.com",
    "wss://relay.nsec.app"
  ]
});
var bunkerNDKStore = writable(_bunkerNDK);

// src/utils/constants.ts
var kindOpinion = 30023;
var opinionHeaderSeparator = "\n<!--HEADER END-->\n";
var opinionFooterSeparator = "\n<!--FOOTER START-->\n\n\n\n";
var opinionHeaderRegex = new RegExp(`^[\\s\\S]*${opinionHeaderSeparator}`);
var opinionFooterRegex = new RegExp(`${opinionFooterSeparator}[\\s\\S]*$`);

// src/summariser.ts
var Summariser = class {
  opinions;
  ndk;
  trustedAuthors = [];
  constructor({ relay, trustedAuthors }) {
    this.opinions = {};
    this.ndk = new NDK({ explicitRelayUrls: [relay] });
    this.trustedAuthors = trustedAuthors.map((author) => {
      const decoded = decode2(author);
      if (decoded.type == "npub") {
        return decoded.data;
      }
      if (decoded.type == "nprofile") {
        return decoded.data.pubkey;
      }
    }).filter((hexKey) => hexKey != void 0);
    if (!globalThis.WebSocket) {
      throw new Error("nostr-opinion-summariser requires Node.js >= 22 (native WebSocket)");
    }
  }
  onReady = () => {
    return new Promise((resolve, reject) => {
      this.ndk.connect().then(async () => {
        const ndkFilter = { kinds: [kindOpinion], authors: this.trustedAuthors };
        return this.ndk.fetchEvents(ndkFilter, { closeOnEose: true });
      }).then((fetchEvents) => {
        fetchEvents.forEach((event) => {
          const tag2 = event.tags.find((t) => t[0] === "d");
          const d5 = tag2?.[1];
          if (d5) {
            this.opinions[d5] = [...this.opinions?.[d5] || [], event];
          }
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
        const current = curr.tags.find((tag2) => tag2[0] === "sentiment")?.[1];
        if (!current) {
          return acc;
        }
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
/*! Bundled license information:

@scure/base/lib/index.js:
@scure/base/index.js:
  (*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/hashes/utils.js:
@noble/hashes/utils.js:
@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/utils.js:
@noble/curves/abstract/modular.js:
@noble/curves/abstract/curve.js:
@noble/curves/abstract/weierstrass.js:
@noble/curves/secp256k1.js:
@noble/curves/esm/utils.js:
@noble/curves/esm/abstract/modular.js:
@noble/curves/esm/abstract/curve.js:
@noble/curves/esm/abstract/weierstrass.js:
@noble/curves/esm/_shortw_utils.js:
@noble/curves/esm/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/ciphers/utils.js:
  (*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) *)
*/
