var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
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
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));
var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);

// node_modules/tstl/utility/node.js
var require_node = __commonJS({
  "node_modules/tstl/utility/node.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.is_node = void 0;
    var is_node_ = null;
    function is_node() {
      if (is_node_ === null)
        is_node_ = typeof global === "object" && typeof global.process === "object" && typeof global.process.versions === "object" && typeof global.process.versions.node !== "undefined";
      return is_node_;
    }
    exports.is_node = is_node;
  }
});

// node_modules/websocket/node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/websocket/node_modules/ms/index.js"(exports, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isNaN(val) === false) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
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
      if (ms >= d) {
        return Math.round(ms / d) + "d";
      }
      if (ms >= h) {
        return Math.round(ms / h) + "h";
      }
      if (ms >= m) {
        return Math.round(ms / m) + "m";
      }
      if (ms >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      return plural(ms, d, "day") || plural(ms, h, "hour") || plural(ms, m, "minute") || plural(ms, s, "second") || ms + " ms";
    }
    function plural(ms, n, name) {
      if (ms < n) {
        return;
      }
      if (ms < n * 1.5) {
        return Math.floor(ms / n) + " " + name;
      }
      return Math.ceil(ms / n) + " " + name + "s";
    }
  }
});

// node_modules/websocket/node_modules/debug/src/debug.js
var require_debug = __commonJS({
  "node_modules/websocket/node_modules/debug/src/debug.js"(exports, module2) {
    exports = module2.exports = createDebug.debug = createDebug["default"] = createDebug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = require_ms();
    exports.names = [];
    exports.skips = [];
    exports.formatters = {};
    var prevTime;
    function selectColor(namespace) {
      var hash = 0, i;
      for (i in namespace) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return exports.colors[Math.abs(hash) % exports.colors.length];
    }
    function createDebug(namespace) {
      function debug() {
        if (!debug.enabled)
          return;
        var self2 = debug;
        var curr = +new Date();
        var ms = curr - (prevTime || curr);
        self2.diff = ms;
        self2.prev = prevTime;
        self2.curr = curr;
        prevTime = curr;
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        args[0] = exports.coerce(args[0]);
        if ("string" !== typeof args[0]) {
          args.unshift("%O");
        }
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          if (match === "%%")
            return match;
          index++;
          var formatter = exports.formatters[format];
          if ("function" === typeof formatter) {
            var val = args[index];
            match = formatter.call(self2, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        exports.formatArgs.call(self2, args);
        var logFn = debug.log || exports.log || console.log.bind(console);
        logFn.apply(self2, args);
      }
      debug.namespace = namespace;
      debug.enabled = exports.enabled(namespace);
      debug.useColors = exports.useColors();
      debug.color = selectColor(namespace);
      if ("function" === typeof exports.init) {
        exports.init(debug);
      }
      return debug;
    }
    function enable(namespaces) {
      exports.save(namespaces);
      exports.names = [];
      exports.skips = [];
      var split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
      var len = split.length;
      for (var i = 0; i < len; i++) {
        if (!split[i])
          continue;
        namespaces = split[i].replace(/\*/g, ".*?");
        if (namespaces[0] === "-") {
          exports.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
        } else {
          exports.names.push(new RegExp("^" + namespaces + "$"));
        }
      }
    }
    function disable() {
      exports.enable("");
    }
    function enabled(name) {
      var i, len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }
    function coerce(val) {
      if (val instanceof Error)
        return val.stack || val.message;
      return val;
    }
  }
});

// node_modules/websocket/node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/websocket/node_modules/debug/src/browser.js"(exports, module2) {
    exports = module2.exports = require_debug();
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : localstorage();
    exports.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && window.process.type === "renderer") {
        return true;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    exports.formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (err) {
        return "[UnexpectedJSONParseError]: " + err.message;
      }
    };
    function formatArgs(args) {
      var useColors2 = this.useColors;
      args[0] = (useColors2 ? "%c" : "") + this.namespace + (useColors2 ? " %c" : " ") + args[0] + (useColors2 ? "%c " : " ") + "+" + exports.humanize(this.diff);
      if (!useColors2)
        return;
      var c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if ("%%" === match)
          return;
        index++;
        if ("%c" === match) {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    function log() {
      return "object" === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports.storage.removeItem("debug");
        } else {
          exports.storage.debug = namespaces;
        }
      } catch (e) {
      }
    }
    function load() {
      var r;
      try {
        r = exports.storage.debug;
      } catch (e) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    exports.enable(load());
    function localstorage() {
      try {
        return window.localStorage;
      } catch (e) {
      }
    }
  }
});

// node_modules/websocket/node_modules/debug/src/node.js
var require_node2 = __commonJS({
  "node_modules/websocket/node_modules/debug/src/node.js"(exports, module2) {
    var tty = require("tty");
    var util = require("util");
    exports = module2.exports = require_debug();
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.colors = [6, 2, 3, 4, 5, 1];
    exports.inspectOpts = Object.keys(process.env).filter(function(key) {
      return /^debug_/i.test(key);
    }).reduce(function(obj, key) {
      var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function(_, k) {
        return k.toUpperCase();
      });
      var val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val))
        val = true;
      else if (/^(no|off|false|disabled)$/i.test(val))
        val = false;
      else if (val === "null")
        val = null;
      else
        val = Number(val);
      obj[prop] = val;
      return obj;
    }, {});
    var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
    if (1 !== fd && 2 !== fd) {
      util.deprecate(function() {
      }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    }
    var stream = 1 === fd ? process.stdout : 2 === fd ? process.stderr : createWritableStdioStream(fd);
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(fd);
    }
    exports.formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map(function(str) {
        return str.trim();
      }).join(" ");
    };
    exports.formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
    function formatArgs(args) {
      var name = this.namespace;
      var useColors2 = this.useColors;
      if (useColors2) {
        var c = this.color;
        var prefix = "  \x1B[3" + c + ";1m" + name + " \x1B[0m";
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push("\x1B[3" + c + "m+" + exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = new Date().toUTCString() + " " + name + " " + args[0];
      }
    }
    function log() {
      return stream.write(util.format.apply(util, arguments) + "\n");
    }
    function save(namespaces) {
      if (null == namespaces) {
        delete process.env.DEBUG;
      } else {
        process.env.DEBUG = namespaces;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function createWritableStdioStream(fd2) {
      var stream2;
      var tty_wrap = process.binding("tty_wrap");
      switch (tty_wrap.guessHandleType(fd2)) {
        case "TTY":
          stream2 = new tty.WriteStream(fd2);
          stream2._type = "tty";
          if (stream2._handle && stream2._handle.unref) {
            stream2._handle.unref();
          }
          break;
        case "FILE":
          var fs = require("fs");
          stream2 = new fs.SyncWriteStream(fd2, { autoClose: false });
          stream2._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var net = require("net");
          stream2 = new net.Socket({
            fd: fd2,
            readable: false,
            writable: true
          });
          stream2.readable = false;
          stream2.read = null;
          stream2._type = "pipe";
          if (stream2._handle && stream2._handle.unref) {
            stream2._handle.unref();
          }
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      stream2.fd = fd2;
      stream2._isStdio = true;
      return stream2;
    }
    function init(debug) {
      debug.inspectOpts = {};
      var keys = Object.keys(exports.inspectOpts);
      for (var i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    exports.enable(load());
  }
});

// node_modules/websocket/node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/websocket/node_modules/debug/src/index.js"(exports, module2) {
    if (typeof process !== "undefined" && process.type === "renderer") {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node2();
    }
  }
});

// node_modules/websocket/lib/utils.js
var require_utils = __commonJS({
  "node_modules/websocket/lib/utils.js"(exports) {
    var noop = exports.noop = function() {
    };
    exports.extend = function extend(dest, source) {
      for (var prop in source) {
        dest[prop] = source[prop];
      }
    };
    exports.eventEmitterListenerCount = require("events").EventEmitter.listenerCount || function(emitter, type) {
      return emitter.listeners(type).length;
    };
    exports.bufferAllocUnsafe = Buffer.allocUnsafe ? Buffer.allocUnsafe : function oldBufferAllocUnsafe(size) {
      return new Buffer(size);
    };
    exports.bufferFromString = Buffer.from ? Buffer.from : function oldBufferFromString(string, encoding) {
      return new Buffer(string, encoding);
    };
    exports.BufferingLogger = function createBufferingLogger(identifier, uniqueID) {
      var logFunction = require_src()(identifier);
      if (logFunction.enabled) {
        var logger = new BufferingLogger(identifier, uniqueID, logFunction);
        var debug = logger.log.bind(logger);
        debug.printOutput = logger.printOutput.bind(logger);
        debug.enabled = logFunction.enabled;
        return debug;
      }
      logFunction.printOutput = noop;
      return logFunction;
    };
    function BufferingLogger(identifier, uniqueID, logFunction) {
      this.logFunction = logFunction;
      this.identifier = identifier;
      this.uniqueID = uniqueID;
      this.buffer = [];
    }
    BufferingLogger.prototype.log = function() {
      this.buffer.push([new Date(), Array.prototype.slice.call(arguments)]);
      return this;
    };
    BufferingLogger.prototype.clear = function() {
      this.buffer = [];
      return this;
    };
    BufferingLogger.prototype.printOutput = function(logFunction) {
      if (!logFunction) {
        logFunction = this.logFunction;
      }
      var uniqueID = this.uniqueID;
      this.buffer.forEach(function(entry) {
        var date = entry[0].toLocaleString();
        var args = entry[1].slice();
        var formatString = args[0];
        if (formatString !== void 0 && formatString !== null) {
          formatString = "%s - %s - " + formatString.toString();
          args.splice(0, 1, formatString, date, uniqueID);
          logFunction.apply(global, args);
        }
      });
    };
  }
});

// node_modules/node-gyp-build/index.js
var require_node_gyp_build = __commonJS({
  "node_modules/node-gyp-build/index.js"(exports, module2) {
    var fs = require("fs");
    var path = require("path");
    var os = require("os");
    var runtimeRequire = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
    var vars = process.config && process.config.variables || {};
    var prebuildsOnly = !!process.env.PREBUILDS_ONLY;
    var abi = process.versions.modules;
    var runtime = isElectron() ? "electron" : isNwjs() ? "node-webkit" : "node";
    var arch = process.env.npm_config_arch || os.arch();
    var platform = process.env.npm_config_platform || os.platform();
    var libc = process.env.LIBC || (isAlpine(platform) ? "musl" : "glibc");
    var armv = process.env.ARM_VERSION || (arch === "arm64" ? "8" : vars.arm_version) || "";
    var uv = (process.versions.uv || "").split(".")[0];
    module2.exports = load;
    function load(dir) {
      return runtimeRequire(load.path(dir));
    }
    load.path = function(dir) {
      dir = path.resolve(dir || ".");
      try {
        var name = runtimeRequire(path.join(dir, "package.json")).name.toUpperCase().replace(/-/g, "_");
        if (process.env[name + "_PREBUILD"])
          dir = process.env[name + "_PREBUILD"];
      } catch (err) {
      }
      if (!prebuildsOnly) {
        var release = getFirst(path.join(dir, "build/Release"), matchBuild);
        if (release)
          return release;
        var debug = getFirst(path.join(dir, "build/Debug"), matchBuild);
        if (debug)
          return debug;
      }
      var prebuild = resolve(dir);
      if (prebuild)
        return prebuild;
      var nearby = resolve(path.dirname(process.execPath));
      if (nearby)
        return nearby;
      var target = [
        "platform=" + platform,
        "arch=" + arch,
        "runtime=" + runtime,
        "abi=" + abi,
        "uv=" + uv,
        armv ? "armv=" + armv : "",
        "libc=" + libc,
        "node=" + process.versions.node,
        process.versions.electron ? "electron=" + process.versions.electron : "",
        typeof __webpack_require__ === "function" ? "webpack=true" : ""
      ].filter(Boolean).join(" ");
      throw new Error("No native build was found for " + target + "\n    loaded from: " + dir + "\n");
      function resolve(dir2) {
        var tuples = readdirSync(path.join(dir2, "prebuilds")).map(parseTuple);
        var tuple = tuples.filter(matchTuple(platform, arch)).sort(compareTuples)[0];
        if (!tuple)
          return;
        var prebuilds = path.join(dir2, "prebuilds", tuple.name);
        var parsed = readdirSync(prebuilds).map(parseTags);
        var candidates = parsed.filter(matchTags(runtime, abi));
        var winner = candidates.sort(compareTags(runtime))[0];
        if (winner)
          return path.join(prebuilds, winner.file);
      }
    };
    function readdirSync(dir) {
      try {
        return fs.readdirSync(dir);
      } catch (err) {
        return [];
      }
    }
    function getFirst(dir, filter) {
      var files = readdirSync(dir).filter(filter);
      return files[0] && path.join(dir, files[0]);
    }
    function matchBuild(name) {
      return /\.node$/.test(name);
    }
    function parseTuple(name) {
      var arr = name.split("-");
      if (arr.length !== 2)
        return;
      var platform2 = arr[0];
      var architectures = arr[1].split("+");
      if (!platform2)
        return;
      if (!architectures.length)
        return;
      if (!architectures.every(Boolean))
        return;
      return { name, platform: platform2, architectures };
    }
    function matchTuple(platform2, arch2) {
      return function(tuple) {
        if (tuple == null)
          return false;
        if (tuple.platform !== platform2)
          return false;
        return tuple.architectures.includes(arch2);
      };
    }
    function compareTuples(a, b) {
      return a.architectures.length - b.architectures.length;
    }
    function parseTags(file) {
      var arr = file.split(".");
      var extension = arr.pop();
      var tags = { file, specificity: 0 };
      if (extension !== "node")
        return;
      for (var i = 0; i < arr.length; i++) {
        var tag = arr[i];
        if (tag === "node" || tag === "electron" || tag === "node-webkit") {
          tags.runtime = tag;
        } else if (tag === "napi") {
          tags.napi = true;
        } else if (tag.slice(0, 3) === "abi") {
          tags.abi = tag.slice(3);
        } else if (tag.slice(0, 2) === "uv") {
          tags.uv = tag.slice(2);
        } else if (tag.slice(0, 4) === "armv") {
          tags.armv = tag.slice(4);
        } else if (tag === "glibc" || tag === "musl") {
          tags.libc = tag;
        } else {
          continue;
        }
        tags.specificity++;
      }
      return tags;
    }
    function matchTags(runtime2, abi2) {
      return function(tags) {
        if (tags == null)
          return false;
        if (tags.runtime !== runtime2 && !runtimeAgnostic(tags))
          return false;
        if (tags.abi !== abi2 && !tags.napi)
          return false;
        if (tags.uv && tags.uv !== uv)
          return false;
        if (tags.armv && tags.armv !== armv)
          return false;
        if (tags.libc && tags.libc !== libc)
          return false;
        return true;
      };
    }
    function runtimeAgnostic(tags) {
      return tags.runtime === "node" && tags.napi;
    }
    function compareTags(runtime2) {
      return function(a, b) {
        if (a.runtime !== b.runtime) {
          return a.runtime === runtime2 ? -1 : 1;
        } else if (a.abi !== b.abi) {
          return a.abi ? -1 : 1;
        } else if (a.specificity !== b.specificity) {
          return a.specificity > b.specificity ? -1 : 1;
        } else {
          return 0;
        }
      };
    }
    function isNwjs() {
      return !!(process.versions && process.versions.nw);
    }
    function isElectron() {
      if (process.versions && process.versions.electron)
        return true;
      if (process.env.ELECTRON_RUN_AS_NODE)
        return true;
      return typeof window !== "undefined" && window.process && window.process.type === "renderer";
    }
    function isAlpine(platform2) {
      return platform2 === "linux" && fs.existsSync("/etc/alpine-release");
    }
    load.parseTags = parseTags;
    load.matchTags = matchTags;
    load.compareTags = compareTags;
    load.parseTuple = parseTuple;
    load.matchTuple = matchTuple;
    load.compareTuples = compareTuples;
  }
});

// node_modules/bufferutil/fallback.js
var require_fallback = __commonJS({
  "node_modules/bufferutil/fallback.js"(exports, module2) {
    "use strict";
    var mask = (source, mask2, output, offset, length) => {
      for (var i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask2[i & 3];
      }
    };
    var unmask = (buffer, mask2) => {
      const length = buffer.length;
      for (var i = 0; i < length; i++) {
        buffer[i] ^= mask2[i & 3];
      }
    };
    module2.exports = { mask, unmask };
  }
});

// node_modules/bufferutil/index.js
var require_bufferutil = __commonJS({
  "node_modules/bufferutil/index.js"(exports, module2) {
    "use strict";
    try {
      module2.exports = require_node_gyp_build()(__dirname);
    } catch (e) {
      module2.exports = require_fallback();
    }
  }
});

// node_modules/websocket/lib/WebSocketFrame.js
var require_WebSocketFrame = __commonJS({
  "node_modules/websocket/lib/WebSocketFrame.js"(exports, module2) {
    var bufferUtil = require_bufferutil();
    var bufferAllocUnsafe = require_utils().bufferAllocUnsafe;
    var DECODE_HEADER = 1;
    var WAITING_FOR_16_BIT_LENGTH = 2;
    var WAITING_FOR_64_BIT_LENGTH = 3;
    var WAITING_FOR_MASK_KEY = 4;
    var WAITING_FOR_PAYLOAD = 5;
    var COMPLETE = 6;
    function WebSocketFrame(maskBytes, frameHeader, config) {
      this.maskBytes = maskBytes;
      this.frameHeader = frameHeader;
      this.config = config;
      this.maxReceivedFrameSize = config.maxReceivedFrameSize;
      this.protocolError = false;
      this.frameTooLarge = false;
      this.invalidCloseFrameLength = false;
      this.parseState = DECODE_HEADER;
      this.closeStatus = -1;
    }
    WebSocketFrame.prototype.addData = function(bufferList) {
      if (this.parseState === DECODE_HEADER) {
        if (bufferList.length >= 2) {
          bufferList.joinInto(this.frameHeader, 0, 0, 2);
          bufferList.advance(2);
          var firstByte = this.frameHeader[0];
          var secondByte = this.frameHeader[1];
          this.fin = Boolean(firstByte & 128);
          this.rsv1 = Boolean(firstByte & 64);
          this.rsv2 = Boolean(firstByte & 32);
          this.rsv3 = Boolean(firstByte & 16);
          this.mask = Boolean(secondByte & 128);
          this.opcode = firstByte & 15;
          this.length = secondByte & 127;
          if (this.opcode >= 8) {
            if (this.length > 125) {
              this.protocolError = true;
              this.dropReason = "Illegal control frame longer than 125 bytes.";
              return true;
            }
            if (!this.fin) {
              this.protocolError = true;
              this.dropReason = "Control frames must not be fragmented.";
              return true;
            }
          }
          if (this.length === 126) {
            this.parseState = WAITING_FOR_16_BIT_LENGTH;
          } else if (this.length === 127) {
            this.parseState = WAITING_FOR_64_BIT_LENGTH;
          } else {
            this.parseState = WAITING_FOR_MASK_KEY;
          }
        }
      }
      if (this.parseState === WAITING_FOR_16_BIT_LENGTH) {
        if (bufferList.length >= 2) {
          bufferList.joinInto(this.frameHeader, 2, 0, 2);
          bufferList.advance(2);
          this.length = this.frameHeader.readUInt16BE(2);
          this.parseState = WAITING_FOR_MASK_KEY;
        }
      } else if (this.parseState === WAITING_FOR_64_BIT_LENGTH) {
        if (bufferList.length >= 8) {
          bufferList.joinInto(this.frameHeader, 2, 0, 8);
          bufferList.advance(8);
          var lengthPair = [
            this.frameHeader.readUInt32BE(2),
            this.frameHeader.readUInt32BE(2 + 4)
          ];
          if (lengthPair[0] !== 0) {
            this.protocolError = true;
            this.dropReason = "Unsupported 64-bit length frame received";
            return true;
          }
          this.length = lengthPair[1];
          this.parseState = WAITING_FOR_MASK_KEY;
        }
      }
      if (this.parseState === WAITING_FOR_MASK_KEY) {
        if (this.mask) {
          if (bufferList.length >= 4) {
            bufferList.joinInto(this.maskBytes, 0, 0, 4);
            bufferList.advance(4);
            this.parseState = WAITING_FOR_PAYLOAD;
          }
        } else {
          this.parseState = WAITING_FOR_PAYLOAD;
        }
      }
      if (this.parseState === WAITING_FOR_PAYLOAD) {
        if (this.length > this.maxReceivedFrameSize) {
          this.frameTooLarge = true;
          this.dropReason = "Frame size of " + this.length.toString(10) + " bytes exceeds maximum accepted frame size";
          return true;
        }
        if (this.length === 0) {
          this.binaryPayload = bufferAllocUnsafe(0);
          this.parseState = COMPLETE;
          return true;
        }
        if (bufferList.length >= this.length) {
          this.binaryPayload = bufferList.take(this.length);
          bufferList.advance(this.length);
          if (this.mask) {
            bufferUtil.unmask(this.binaryPayload, this.maskBytes);
          }
          if (this.opcode === 8) {
            if (this.length === 1) {
              this.binaryPayload = bufferAllocUnsafe(0);
              this.invalidCloseFrameLength = true;
            }
            if (this.length >= 2) {
              this.closeStatus = this.binaryPayload.readUInt16BE(0);
              this.binaryPayload = this.binaryPayload.slice(2);
            }
          }
          this.parseState = COMPLETE;
          return true;
        }
      }
      return false;
    };
    WebSocketFrame.prototype.throwAwayPayload = function(bufferList) {
      if (bufferList.length >= this.length) {
        bufferList.advance(this.length);
        this.parseState = COMPLETE;
        return true;
      }
      return false;
    };
    WebSocketFrame.prototype.toBuffer = function(nullMask) {
      var maskKey;
      var headerLength = 2;
      var data;
      var outputPos;
      var firstByte = 0;
      var secondByte = 0;
      if (this.fin) {
        firstByte |= 128;
      }
      if (this.rsv1) {
        firstByte |= 64;
      }
      if (this.rsv2) {
        firstByte |= 32;
      }
      if (this.rsv3) {
        firstByte |= 16;
      }
      if (this.mask) {
        secondByte |= 128;
      }
      firstByte |= this.opcode & 15;
      if (this.opcode === 8) {
        this.length = 2;
        if (this.binaryPayload) {
          this.length += this.binaryPayload.length;
        }
        data = bufferAllocUnsafe(this.length);
        data.writeUInt16BE(this.closeStatus, 0);
        if (this.length > 2) {
          this.binaryPayload.copy(data, 2);
        }
      } else if (this.binaryPayload) {
        data = this.binaryPayload;
        this.length = data.length;
      } else {
        this.length = 0;
      }
      if (this.length <= 125) {
        secondByte |= this.length & 127;
      } else if (this.length > 125 && this.length <= 65535) {
        secondByte |= 126;
        headerLength += 2;
      } else if (this.length > 65535) {
        secondByte |= 127;
        headerLength += 8;
      }
      var output = bufferAllocUnsafe(this.length + headerLength + (this.mask ? 4 : 0));
      output[0] = firstByte;
      output[1] = secondByte;
      outputPos = 2;
      if (this.length > 125 && this.length <= 65535) {
        output.writeUInt16BE(this.length, outputPos);
        outputPos += 2;
      } else if (this.length > 65535) {
        output.writeUInt32BE(0, outputPos);
        output.writeUInt32BE(this.length, outputPos + 4);
        outputPos += 8;
      }
      if (this.mask) {
        maskKey = nullMask ? 0 : Math.random() * 4294967295 >>> 0;
        this.maskBytes.writeUInt32BE(maskKey, 0);
        this.maskBytes.copy(output, outputPos);
        outputPos += 4;
        if (data) {
          bufferUtil.mask(data, this.maskBytes, output, outputPos, this.length);
        }
      } else if (data) {
        data.copy(output, outputPos);
      }
      return output;
    };
    WebSocketFrame.prototype.toString = function() {
      return "Opcode: " + this.opcode + ", fin: " + this.fin + ", length: " + this.length + ", hasPayload: " + Boolean(this.binaryPayload) + ", masked: " + this.mask;
    };
    module2.exports = WebSocketFrame;
  }
});

// node_modules/websocket/vendor/FastBufferList.js
var require_FastBufferList = __commonJS({
  "node_modules/websocket/vendor/FastBufferList.js"(exports, module2) {
    var Buffer3 = require("buffer").Buffer;
    var EventEmitter = require("events").EventEmitter;
    var bufferAllocUnsafe = require_utils().bufferAllocUnsafe;
    module2.exports = BufferList;
    module2.exports.BufferList = BufferList;
    function BufferList(opts) {
      if (!(this instanceof BufferList))
        return new BufferList(opts);
      EventEmitter.call(this);
      var self2 = this;
      if (typeof opts == "undefined")
        opts = {};
      self2.encoding = opts.encoding;
      var head = { next: null, buffer: null };
      var last = { next: null, buffer: null };
      var length = 0;
      self2.__defineGetter__("length", function() {
        return length;
      });
      var offset = 0;
      self2.write = function(buf) {
        if (!head.buffer) {
          head.buffer = buf;
          last = head;
        } else {
          last.next = { next: null, buffer: buf };
          last = last.next;
        }
        length += buf.length;
        self2.emit("write", buf);
        return true;
      };
      self2.end = function(buf) {
        if (Buffer3.isBuffer(buf))
          self2.write(buf);
      };
      self2.push = function() {
        var args = [].concat.apply([], arguments);
        args.forEach(self2.write);
        return self2;
      };
      self2.forEach = function(fn) {
        if (!head.buffer)
          return bufferAllocUnsafe(0);
        if (head.buffer.length - offset <= 0)
          return self2;
        var firstBuf = head.buffer.slice(offset);
        var b = { buffer: firstBuf, next: head.next };
        while (b && b.buffer) {
          var r = fn(b.buffer);
          if (r)
            break;
          b = b.next;
        }
        return self2;
      };
      self2.join = function(start, end) {
        if (!head.buffer)
          return bufferAllocUnsafe(0);
        if (start == void 0)
          start = 0;
        if (end == void 0)
          end = self2.length;
        var big = bufferAllocUnsafe(end - start);
        var ix = 0;
        self2.forEach(function(buffer) {
          if (start < ix + buffer.length && ix < end) {
            buffer.copy(
              big,
              Math.max(0, ix - start),
              Math.max(0, start - ix),
              Math.min(buffer.length, end - ix)
            );
          }
          ix += buffer.length;
          if (ix > end)
            return true;
        });
        return big;
      };
      self2.joinInto = function(targetBuffer, targetStart, sourceStart, sourceEnd) {
        if (!head.buffer)
          return new bufferAllocUnsafe(0);
        if (sourceStart == void 0)
          sourceStart = 0;
        if (sourceEnd == void 0)
          sourceEnd = self2.length;
        var big = targetBuffer;
        if (big.length - targetStart < sourceEnd - sourceStart) {
          throw new Error("Insufficient space available in target Buffer.");
        }
        var ix = 0;
        self2.forEach(function(buffer) {
          if (sourceStart < ix + buffer.length && ix < sourceEnd) {
            buffer.copy(
              big,
              Math.max(targetStart, targetStart + ix - sourceStart),
              Math.max(0, sourceStart - ix),
              Math.min(buffer.length, sourceEnd - ix)
            );
          }
          ix += buffer.length;
          if (ix > sourceEnd)
            return true;
        });
        return big;
      };
      self2.advance = function(n) {
        offset += n;
        length -= n;
        while (head.buffer && offset >= head.buffer.length) {
          offset -= head.buffer.length;
          head = head.next ? head.next : { buffer: null, next: null };
        }
        if (head.buffer === null)
          last = { next: null, buffer: null };
        self2.emit("advance", n);
        return self2;
      };
      self2.take = function(n, encoding) {
        if (n == void 0)
          n = self2.length;
        else if (typeof n !== "number") {
          encoding = n;
          n = self2.length;
        }
        var b = head;
        if (!encoding)
          encoding = self2.encoding;
        if (encoding) {
          var acc = "";
          self2.forEach(function(buffer) {
            if (n <= 0)
              return true;
            acc += buffer.toString(
              encoding,
              0,
              Math.min(n, buffer.length)
            );
            n -= buffer.length;
          });
          return acc;
        } else {
          return self2.join(0, n);
        }
      };
      self2.toString = function() {
        return self2.take("binary");
      };
    }
    require("util").inherits(BufferList, EventEmitter);
  }
});

// node_modules/utf-8-validate/fallback.js
var require_fallback2 = __commonJS({
  "node_modules/utf-8-validate/fallback.js"(exports, module2) {
    "use strict";
    function isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    module2.exports = isValidUTF8;
  }
});

// node_modules/utf-8-validate/index.js
var require_utf_8_validate = __commonJS({
  "node_modules/utf-8-validate/index.js"(exports, module2) {
    "use strict";
    try {
      module2.exports = require_node_gyp_build()(__dirname);
    } catch (e) {
      module2.exports = require_fallback2();
    }
  }
});

// node_modules/websocket/lib/WebSocketConnection.js
var require_WebSocketConnection = __commonJS({
  "node_modules/websocket/lib/WebSocketConnection.js"(exports, module2) {
    var util = require("util");
    var utils2 = require_utils();
    var EventEmitter = require("events").EventEmitter;
    var WebSocketFrame = require_WebSocketFrame();
    var BufferList = require_FastBufferList();
    var isValidUTF8 = require_utf_8_validate();
    var bufferAllocUnsafe = utils2.bufferAllocUnsafe;
    var bufferFromString = utils2.bufferFromString;
    var STATE_OPEN = "open";
    var STATE_PEER_REQUESTED_CLOSE = "peer_requested_close";
    var STATE_ENDING = "ending";
    var STATE_CLOSED = "closed";
    var setImmediateImpl = "setImmediate" in global ? global.setImmediate.bind(global) : process.nextTick.bind(process);
    var idCounter = 0;
    function WebSocketConnection(socket, extensions, protocol, maskOutgoingPackets, config) {
      this._debug = utils2.BufferingLogger("websocket:connection", ++idCounter);
      this._debug("constructor");
      if (this._debug.enabled) {
        instrumentSocketForDebugging(this, socket);
      }
      EventEmitter.call(this);
      this._pingListenerCount = 0;
      this.on("newListener", function(ev) {
        if (ev === "ping") {
          this._pingListenerCount++;
        }
      }).on("removeListener", function(ev) {
        if (ev === "ping") {
          this._pingListenerCount--;
        }
      });
      this.config = config;
      this.socket = socket;
      this.protocol = protocol;
      this.extensions = extensions;
      this.remoteAddress = socket.remoteAddress;
      this.closeReasonCode = -1;
      this.closeDescription = null;
      this.closeEventEmitted = false;
      this.maskOutgoingPackets = maskOutgoingPackets;
      this.maskBytes = bufferAllocUnsafe(4);
      this.frameHeader = bufferAllocUnsafe(10);
      this.bufferList = new BufferList();
      this.currentFrame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
      this.fragmentationSize = 0;
      this.frameQueue = [];
      this.connected = true;
      this.state = STATE_OPEN;
      this.waitingForCloseResponse = false;
      this.receivedEnd = false;
      this.closeTimeout = this.config.closeTimeout;
      this.assembleFragments = this.config.assembleFragments;
      this.maxReceivedMessageSize = this.config.maxReceivedMessageSize;
      this.outputBufferFull = false;
      this.inputPaused = false;
      this.receivedDataHandler = this.processReceivedData.bind(this);
      this._closeTimerHandler = this.handleCloseTimer.bind(this);
      this.socket.setNoDelay(this.config.disableNagleAlgorithm);
      this.socket.setTimeout(0);
      if (this.config.keepalive && !this.config.useNativeKeepalive) {
        if (typeof this.config.keepaliveInterval !== "number") {
          throw new Error("keepaliveInterval must be specified and numeric if keepalive is true.");
        }
        this._keepaliveTimerHandler = this.handleKeepaliveTimer.bind(this);
        this.setKeepaliveTimer();
        if (this.config.dropConnectionOnKeepaliveTimeout) {
          if (typeof this.config.keepaliveGracePeriod !== "number") {
            throw new Error("keepaliveGracePeriod  must be specified and numeric if dropConnectionOnKeepaliveTimeout is true.");
          }
          this._gracePeriodTimerHandler = this.handleGracePeriodTimer.bind(this);
        }
      } else if (this.config.keepalive && this.config.useNativeKeepalive) {
        if (!("setKeepAlive" in this.socket)) {
          throw new Error("Unable to use native keepalive: unsupported by this version of Node.");
        }
        this.socket.setKeepAlive(true, this.config.keepaliveInterval);
      }
      this.socket.removeAllListeners("error");
    }
    WebSocketConnection.CLOSE_REASON_NORMAL = 1e3;
    WebSocketConnection.CLOSE_REASON_GOING_AWAY = 1001;
    WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR = 1002;
    WebSocketConnection.CLOSE_REASON_UNPROCESSABLE_INPUT = 1003;
    WebSocketConnection.CLOSE_REASON_RESERVED = 1004;
    WebSocketConnection.CLOSE_REASON_NOT_PROVIDED = 1005;
    WebSocketConnection.CLOSE_REASON_ABNORMAL = 1006;
    WebSocketConnection.CLOSE_REASON_INVALID_DATA = 1007;
    WebSocketConnection.CLOSE_REASON_POLICY_VIOLATION = 1008;
    WebSocketConnection.CLOSE_REASON_MESSAGE_TOO_BIG = 1009;
    WebSocketConnection.CLOSE_REASON_EXTENSION_REQUIRED = 1010;
    WebSocketConnection.CLOSE_REASON_INTERNAL_SERVER_ERROR = 1011;
    WebSocketConnection.CLOSE_REASON_TLS_HANDSHAKE_FAILED = 1015;
    WebSocketConnection.CLOSE_DESCRIPTIONS = {
      1e3: "Normal connection closure",
      1001: "Remote peer is going away",
      1002: "Protocol error",
      1003: "Unprocessable input",
      1004: "Reserved",
      1005: "Reason not provided",
      1006: "Abnormal closure, no further detail available",
      1007: "Invalid data received",
      1008: "Policy violation",
      1009: "Message too big",
      1010: "Extension requested by client is required",
      1011: "Internal Server Error",
      1015: "TLS Handshake Failed"
    };
    function validateCloseReason(code) {
      if (code < 1e3) {
        return false;
      }
      if (code >= 1e3 && code <= 2999) {
        return [1e3, 1001, 1002, 1003, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015].indexOf(code) !== -1;
      }
      if (code >= 3e3 && code <= 3999) {
        return true;
      }
      if (code >= 4e3 && code <= 4999) {
        return true;
      }
      if (code >= 5e3) {
        return false;
      }
    }
    util.inherits(WebSocketConnection, EventEmitter);
    WebSocketConnection.prototype._addSocketEventListeners = function() {
      this.socket.on("error", this.handleSocketError.bind(this));
      this.socket.on("end", this.handleSocketEnd.bind(this));
      this.socket.on("close", this.handleSocketClose.bind(this));
      this.socket.on("drain", this.handleSocketDrain.bind(this));
      this.socket.on("pause", this.handleSocketPause.bind(this));
      this.socket.on("resume", this.handleSocketResume.bind(this));
      this.socket.on("data", this.handleSocketData.bind(this));
    };
    WebSocketConnection.prototype.setKeepaliveTimer = function() {
      this._debug("setKeepaliveTimer");
      if (!this.config.keepalive || this.config.useNativeKeepalive) {
        return;
      }
      this.clearKeepaliveTimer();
      this.clearGracePeriodTimer();
      this._keepaliveTimeoutID = setTimeout(this._keepaliveTimerHandler, this.config.keepaliveInterval);
    };
    WebSocketConnection.prototype.clearKeepaliveTimer = function() {
      if (this._keepaliveTimeoutID) {
        clearTimeout(this._keepaliveTimeoutID);
      }
    };
    WebSocketConnection.prototype.handleKeepaliveTimer = function() {
      this._debug("handleKeepaliveTimer");
      this._keepaliveTimeoutID = null;
      this.ping();
      if (this.config.dropConnectionOnKeepaliveTimeout) {
        this.setGracePeriodTimer();
      } else {
        this.setKeepaliveTimer();
      }
    };
    WebSocketConnection.prototype.setGracePeriodTimer = function() {
      this._debug("setGracePeriodTimer");
      this.clearGracePeriodTimer();
      this._gracePeriodTimeoutID = setTimeout(this._gracePeriodTimerHandler, this.config.keepaliveGracePeriod);
    };
    WebSocketConnection.prototype.clearGracePeriodTimer = function() {
      if (this._gracePeriodTimeoutID) {
        clearTimeout(this._gracePeriodTimeoutID);
      }
    };
    WebSocketConnection.prototype.handleGracePeriodTimer = function() {
      this._debug("handleGracePeriodTimer");
      this._gracePeriodTimeoutID = null;
      this.drop(WebSocketConnection.CLOSE_REASON_ABNORMAL, "Peer not responding.", true);
    };
    WebSocketConnection.prototype.handleSocketData = function(data) {
      this._debug("handleSocketData");
      this.setKeepaliveTimer();
      this.bufferList.write(data);
      this.processReceivedData();
    };
    WebSocketConnection.prototype.processReceivedData = function() {
      this._debug("processReceivedData");
      if (!this.connected) {
        return;
      }
      if (this.inputPaused) {
        return;
      }
      var frame = this.currentFrame;
      if (!frame.addData(this.bufferList)) {
        this._debug("-- insufficient data for frame");
        return;
      }
      var self2 = this;
      if (frame.protocolError) {
        this._debug("-- protocol error");
        process.nextTick(function() {
          self2.drop(WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR, frame.dropReason);
        });
        return;
      } else if (frame.frameTooLarge) {
        this._debug("-- frame too large");
        process.nextTick(function() {
          self2.drop(WebSocketConnection.CLOSE_REASON_MESSAGE_TOO_BIG, frame.dropReason);
        });
        return;
      }
      if (frame.rsv1 || frame.rsv2 || frame.rsv3) {
        this._debug("-- illegal rsv flag");
        process.nextTick(function() {
          self2.drop(
            WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR,
            "Unsupported usage of rsv bits without negotiated extension."
          );
        });
        return;
      }
      if (!this.assembleFragments) {
        this._debug("-- emitting frame");
        process.nextTick(function() {
          self2.emit("frame", frame);
        });
      }
      process.nextTick(function() {
        self2.processFrame(frame);
      });
      this.currentFrame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
      if (this.bufferList.length > 0) {
        setImmediateImpl(this.receivedDataHandler);
      }
    };
    WebSocketConnection.prototype.handleSocketError = function(error) {
      this._debug("handleSocketError: %j", error);
      if (this.state === STATE_CLOSED) {
        this._debug("  --- Socket 'error' after 'close'");
        return;
      }
      this.closeReasonCode = WebSocketConnection.CLOSE_REASON_ABNORMAL;
      this.closeDescription = "Socket Error: " + error.syscall + " " + error.code;
      this.connected = false;
      this.state = STATE_CLOSED;
      this.fragmentationSize = 0;
      if (utils2.eventEmitterListenerCount(this, "error") > 0) {
        this.emit("error", error);
      }
      this.socket.destroy();
      this._debug.printOutput();
    };
    WebSocketConnection.prototype.handleSocketEnd = function() {
      this._debug("handleSocketEnd: received socket end.  state = %s", this.state);
      this.receivedEnd = true;
      if (this.state === STATE_CLOSED) {
        this._debug("  --- Socket 'end' after 'close'");
        return;
      }
      if (this.state !== STATE_PEER_REQUESTED_CLOSE && this.state !== STATE_ENDING) {
        this._debug("  --- UNEXPECTED socket end.");
        this.socket.end();
      }
    };
    WebSocketConnection.prototype.handleSocketClose = function(hadError) {
      this._debug("handleSocketClose: received socket close");
      this.socketHadError = hadError;
      this.connected = false;
      this.state = STATE_CLOSED;
      if (this.closeReasonCode === -1) {
        this.closeReasonCode = WebSocketConnection.CLOSE_REASON_ABNORMAL;
        this.closeDescription = "Connection dropped by remote peer.";
      }
      this.clearCloseTimer();
      this.clearKeepaliveTimer();
      this.clearGracePeriodTimer();
      if (!this.closeEventEmitted) {
        this.closeEventEmitted = true;
        this._debug("-- Emitting WebSocketConnection close event");
        this.emit("close", this.closeReasonCode, this.closeDescription);
      }
    };
    WebSocketConnection.prototype.handleSocketDrain = function() {
      this._debug("handleSocketDrain: socket drain event");
      this.outputBufferFull = false;
      this.emit("drain");
    };
    WebSocketConnection.prototype.handleSocketPause = function() {
      this._debug("handleSocketPause: socket pause event");
      this.inputPaused = true;
      this.emit("pause");
    };
    WebSocketConnection.prototype.handleSocketResume = function() {
      this._debug("handleSocketResume: socket resume event");
      this.inputPaused = false;
      this.emit("resume");
      this.processReceivedData();
    };
    WebSocketConnection.prototype.pause = function() {
      this._debug("pause: pause requested");
      this.socket.pause();
    };
    WebSocketConnection.prototype.resume = function() {
      this._debug("resume: resume requested");
      this.socket.resume();
    };
    WebSocketConnection.prototype.close = function(reasonCode, description) {
      if (this.connected) {
        this._debug("close: Initating clean WebSocket close sequence.");
        if ("number" !== typeof reasonCode) {
          reasonCode = WebSocketConnection.CLOSE_REASON_NORMAL;
        }
        if (!validateCloseReason(reasonCode)) {
          throw new Error("Close code " + reasonCode + " is not valid.");
        }
        if ("string" !== typeof description) {
          description = WebSocketConnection.CLOSE_DESCRIPTIONS[reasonCode];
        }
        this.closeReasonCode = reasonCode;
        this.closeDescription = description;
        this.setCloseTimer();
        this.sendCloseFrame(this.closeReasonCode, this.closeDescription);
        this.state = STATE_ENDING;
        this.connected = false;
      }
    };
    WebSocketConnection.prototype.drop = function(reasonCode, description, skipCloseFrame) {
      this._debug("drop");
      if (typeof reasonCode !== "number") {
        reasonCode = WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR;
      }
      if (typeof description !== "string") {
        description = WebSocketConnection.CLOSE_DESCRIPTIONS[reasonCode];
      }
      this._debug(
        "Forcefully dropping connection. skipCloseFrame: %s, code: %d, description: %s",
        skipCloseFrame,
        reasonCode,
        description
      );
      this.closeReasonCode = reasonCode;
      this.closeDescription = description;
      this.frameQueue = [];
      this.fragmentationSize = 0;
      if (!skipCloseFrame) {
        this.sendCloseFrame(reasonCode, description);
      }
      this.connected = false;
      this.state = STATE_CLOSED;
      this.clearCloseTimer();
      this.clearKeepaliveTimer();
      this.clearGracePeriodTimer();
      if (!this.closeEventEmitted) {
        this.closeEventEmitted = true;
        this._debug("Emitting WebSocketConnection close event");
        this.emit("close", this.closeReasonCode, this.closeDescription);
      }
      this._debug("Drop: destroying socket");
      this.socket.destroy();
    };
    WebSocketConnection.prototype.setCloseTimer = function() {
      this._debug("setCloseTimer");
      this.clearCloseTimer();
      this._debug("Setting close timer");
      this.waitingForCloseResponse = true;
      this.closeTimer = setTimeout(this._closeTimerHandler, this.closeTimeout);
    };
    WebSocketConnection.prototype.clearCloseTimer = function() {
      this._debug("clearCloseTimer");
      if (this.closeTimer) {
        this._debug("Clearing close timer");
        clearTimeout(this.closeTimer);
        this.waitingForCloseResponse = false;
        this.closeTimer = null;
      }
    };
    WebSocketConnection.prototype.handleCloseTimer = function() {
      this._debug("handleCloseTimer");
      this.closeTimer = null;
      if (this.waitingForCloseResponse) {
        this._debug("Close response not received from client.  Forcing socket end.");
        this.waitingForCloseResponse = false;
        this.state = STATE_CLOSED;
        this.socket.end();
      }
    };
    WebSocketConnection.prototype.processFrame = function(frame) {
      this._debug("processFrame");
      this._debug(" -- frame: %s", frame);
      if (this.frameQueue.length !== 0 && (frame.opcode > 0 && frame.opcode < 8)) {
        this.drop(
          WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR,
          "Illegal frame opcode 0x" + frame.opcode.toString(16) + " received in middle of fragmented message."
        );
        return;
      }
      switch (frame.opcode) {
        case 2:
          this._debug("-- Binary Frame");
          if (this.assembleFragments) {
            if (frame.fin) {
              this._debug("---- Emitting 'message' event");
              this.emit("message", {
                type: "binary",
                binaryData: frame.binaryPayload
              });
            } else {
              this.frameQueue.push(frame);
              this.fragmentationSize = frame.length;
            }
          }
          break;
        case 1:
          this._debug("-- Text Frame");
          if (this.assembleFragments) {
            if (frame.fin) {
              if (!isValidUTF8(frame.binaryPayload)) {
                this.drop(
                  WebSocketConnection.CLOSE_REASON_INVALID_DATA,
                  "Invalid UTF-8 Data Received"
                );
                return;
              }
              this._debug("---- Emitting 'message' event");
              this.emit("message", {
                type: "utf8",
                utf8Data: frame.binaryPayload.toString("utf8")
              });
            } else {
              this.frameQueue.push(frame);
              this.fragmentationSize = frame.length;
            }
          }
          break;
        case 0:
          this._debug("-- Continuation Frame");
          if (this.assembleFragments) {
            if (this.frameQueue.length === 0) {
              this.drop(
                WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR,
                "Unexpected Continuation Frame"
              );
              return;
            }
            this.fragmentationSize += frame.length;
            if (this.fragmentationSize > this.maxReceivedMessageSize) {
              this.drop(
                WebSocketConnection.CLOSE_REASON_MESSAGE_TOO_BIG,
                "Maximum message size exceeded."
              );
              return;
            }
            this.frameQueue.push(frame);
            if (frame.fin) {
              var bytesCopied = 0;
              var binaryPayload = bufferAllocUnsafe(this.fragmentationSize);
              var opcode = this.frameQueue[0].opcode;
              this.frameQueue.forEach(function(currentFrame) {
                currentFrame.binaryPayload.copy(binaryPayload, bytesCopied);
                bytesCopied += currentFrame.binaryPayload.length;
              });
              this.frameQueue = [];
              this.fragmentationSize = 0;
              switch (opcode) {
                case 2:
                  this.emit("message", {
                    type: "binary",
                    binaryData: binaryPayload
                  });
                  break;
                case 1:
                  if (!isValidUTF8(binaryPayload)) {
                    this.drop(
                      WebSocketConnection.CLOSE_REASON_INVALID_DATA,
                      "Invalid UTF-8 Data Received"
                    );
                    return;
                  }
                  this.emit("message", {
                    type: "utf8",
                    utf8Data: binaryPayload.toString("utf8")
                  });
                  break;
                default:
                  this.drop(
                    WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR,
                    "Unexpected first opcode in fragmentation sequence: 0x" + opcode.toString(16)
                  );
                  return;
              }
            }
          }
          break;
        case 9:
          this._debug("-- Ping Frame");
          if (this._pingListenerCount > 0) {
            var cancelled = false;
            var cancel = function() {
              cancelled = true;
            };
            this.emit("ping", cancel, frame.binaryPayload);
            if (!cancelled) {
              this.pong(frame.binaryPayload);
            }
          } else {
            this.pong(frame.binaryPayload);
          }
          break;
        case 10:
          this._debug("-- Pong Frame");
          this.emit("pong", frame.binaryPayload);
          break;
        case 8:
          this._debug("-- Close Frame");
          if (this.waitingForCloseResponse) {
            this._debug("---- Got close response from peer.  Completing closing handshake.");
            this.clearCloseTimer();
            this.waitingForCloseResponse = false;
            this.state = STATE_CLOSED;
            this.socket.end();
            return;
          }
          this._debug("---- Closing handshake initiated by peer.");
          this.state = STATE_PEER_REQUESTED_CLOSE;
          var respondCloseReasonCode;
          if (frame.invalidCloseFrameLength) {
            this.closeReasonCode = 1005;
            respondCloseReasonCode = WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR;
          } else if (frame.closeStatus === -1 || validateCloseReason(frame.closeStatus)) {
            this.closeReasonCode = frame.closeStatus;
            respondCloseReasonCode = WebSocketConnection.CLOSE_REASON_NORMAL;
          } else {
            this.closeReasonCode = frame.closeStatus;
            respondCloseReasonCode = WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR;
          }
          if (frame.binaryPayload.length > 1) {
            if (!isValidUTF8(frame.binaryPayload)) {
              this.drop(
                WebSocketConnection.CLOSE_REASON_INVALID_DATA,
                "Invalid UTF-8 Data Received"
              );
              return;
            }
            this.closeDescription = frame.binaryPayload.toString("utf8");
          } else {
            this.closeDescription = WebSocketConnection.CLOSE_DESCRIPTIONS[this.closeReasonCode];
          }
          this._debug(
            "------ Remote peer %s - code: %d - %s - close frame payload length: %d",
            this.remoteAddress,
            this.closeReasonCode,
            this.closeDescription,
            frame.length
          );
          this._debug("------ responding to remote peer's close request.");
          this.sendCloseFrame(respondCloseReasonCode, null);
          this.connected = false;
          break;
        default:
          this._debug("-- Unrecognized Opcode %d", frame.opcode);
          this.drop(
            WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR,
            "Unrecognized Opcode: 0x" + frame.opcode.toString(16)
          );
          break;
      }
    };
    WebSocketConnection.prototype.send = function(data, cb) {
      this._debug("send");
      if (Buffer.isBuffer(data)) {
        this.sendBytes(data, cb);
      } else if (typeof data["toString"] === "function") {
        this.sendUTF(data, cb);
      } else {
        throw new Error("Data provided must either be a Node Buffer or implement toString()");
      }
    };
    WebSocketConnection.prototype.sendUTF = function(data, cb) {
      data = bufferFromString(data.toString(), "utf8");
      this._debug("sendUTF: %d bytes", data.length);
      var frame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
      frame.opcode = 1;
      frame.binaryPayload = data;
      this.fragmentAndSend(frame, cb);
    };
    WebSocketConnection.prototype.sendBytes = function(data, cb) {
      this._debug("sendBytes");
      if (!Buffer.isBuffer(data)) {
        throw new Error("You must pass a Node Buffer object to WebSocketConnection.prototype.sendBytes()");
      }
      var frame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
      frame.opcode = 2;
      frame.binaryPayload = data;
      this.fragmentAndSend(frame, cb);
    };
    WebSocketConnection.prototype.ping = function(data) {
      this._debug("ping");
      var frame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
      frame.opcode = 9;
      frame.fin = true;
      if (data) {
        if (!Buffer.isBuffer(data)) {
          data = bufferFromString(data.toString(), "utf8");
        }
        if (data.length > 125) {
          this._debug("WebSocket: Data for ping is longer than 125 bytes.  Truncating.");
          data = data.slice(0, 124);
        }
        frame.binaryPayload = data;
      }
      this.sendFrame(frame);
    };
    WebSocketConnection.prototype.pong = function(binaryPayload) {
      this._debug("pong");
      var frame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
      frame.opcode = 10;
      if (Buffer.isBuffer(binaryPayload) && binaryPayload.length > 125) {
        this._debug("WebSocket: Data for pong is longer than 125 bytes.  Truncating.");
        binaryPayload = binaryPayload.slice(0, 124);
      }
      frame.binaryPayload = binaryPayload;
      frame.fin = true;
      this.sendFrame(frame);
    };
    WebSocketConnection.prototype.fragmentAndSend = function(frame, cb) {
      this._debug("fragmentAndSend");
      if (frame.opcode > 7) {
        throw new Error("You cannot fragment control frames.");
      }
      var threshold = this.config.fragmentationThreshold;
      var length = frame.binaryPayload.length;
      if (!this.config.fragmentOutgoingMessages || frame.binaryPayload && length <= threshold) {
        frame.fin = true;
        this.sendFrame(frame, cb);
        return;
      }
      var numFragments = Math.ceil(length / threshold);
      var sentFragments = 0;
      var sentCallback = function fragmentSentCallback(err) {
        if (err) {
          if (typeof cb === "function") {
            cb(err);
            cb = null;
          }
          return;
        }
        ++sentFragments;
        if (sentFragments === numFragments && typeof cb === "function") {
          cb();
        }
      };
      for (var i = 1; i <= numFragments; i++) {
        var currentFrame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
        currentFrame.opcode = i === 1 ? frame.opcode : 0;
        currentFrame.fin = i === numFragments;
        var currentLength = i === numFragments ? length - threshold * (i - 1) : threshold;
        var sliceStart = threshold * (i - 1);
        currentFrame.binaryPayload = frame.binaryPayload.slice(sliceStart, sliceStart + currentLength);
        this.sendFrame(currentFrame, sentCallback);
      }
    };
    WebSocketConnection.prototype.sendCloseFrame = function(reasonCode, description, cb) {
      if (typeof reasonCode !== "number") {
        reasonCode = WebSocketConnection.CLOSE_REASON_NORMAL;
      }
      this._debug("sendCloseFrame state: %s, reasonCode: %d, description: %s", this.state, reasonCode, description);
      if (this.state !== STATE_OPEN && this.state !== STATE_PEER_REQUESTED_CLOSE) {
        return;
      }
      var frame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
      frame.fin = true;
      frame.opcode = 8;
      frame.closeStatus = reasonCode;
      if (typeof description === "string") {
        frame.binaryPayload = bufferFromString(description, "utf8");
      }
      this.sendFrame(frame, cb);
      this.socket.end();
    };
    WebSocketConnection.prototype.sendFrame = function(frame, cb) {
      this._debug("sendFrame");
      frame.mask = this.maskOutgoingPackets;
      var flushed = this.socket.write(frame.toBuffer(), cb);
      this.outputBufferFull = !flushed;
      return flushed;
    };
    module2.exports = WebSocketConnection;
    function instrumentSocketForDebugging(connection, socket) {
      if (!connection._debug.enabled) {
        return;
      }
      var originalSocketEmit = socket.emit;
      socket.emit = function(event) {
        connection._debug("||| Socket Event  '%s'", event);
        originalSocketEmit.apply(this, arguments);
      };
      for (var key in socket) {
        if ("function" !== typeof socket[key]) {
          continue;
        }
        if (["emit"].indexOf(key) !== -1) {
          continue;
        }
        (function(key2) {
          var original = socket[key2];
          if (key2 === "on") {
            socket[key2] = function proxyMethod__EventEmitter__On() {
              connection._debug("||| Socket method called:  %s (%s)", key2, arguments[0]);
              return original.apply(this, arguments);
            };
            return;
          }
          socket[key2] = function proxyMethod() {
            connection._debug("||| Socket method called:  %s", key2);
            return original.apply(this, arguments);
          };
        })(key);
      }
    }
  }
});

// node_modules/websocket/lib/WebSocketRequest.js
var require_WebSocketRequest = __commonJS({
  "node_modules/websocket/lib/WebSocketRequest.js"(exports, module2) {
    var crypto2 = require("crypto");
    var util = require("util");
    var url = require("url");
    var EventEmitter = require("events").EventEmitter;
    var WebSocketConnection = require_WebSocketConnection();
    var headerValueSplitRegExp = /,\s*/;
    var headerParamSplitRegExp = /;\s*/;
    var headerSanitizeRegExp = /[\r\n]/g;
    var xForwardedForSeparatorRegExp = /,\s*/;
    var separators = [
      "(",
      ")",
      "<",
      ">",
      "@",
      ",",
      ";",
      ":",
      "\\",
      '"',
      "/",
      "[",
      "]",
      "?",
      "=",
      "{",
      "}",
      " ",
      String.fromCharCode(9)
    ];
    var controlChars = [String.fromCharCode(127)];
    for (i = 0; i < 31; i++) {
      controlChars.push(String.fromCharCode(i));
    }
    var i;
    var cookieNameValidateRegEx = /([\x00-\x20\x22\x28\x29\x2c\x2f\x3a-\x3f\x40\x5b-\x5e\x7b\x7d\x7f])/;
    var cookieValueValidateRegEx = /[^\x21\x23-\x2b\x2d-\x3a\x3c-\x5b\x5d-\x7e]/;
    var cookieValueDQuoteValidateRegEx = /^"[^"]*"$/;
    var controlCharsAndSemicolonRegEx = /[\x00-\x20\x3b]/g;
    var cookieSeparatorRegEx = /[;,] */;
    var httpStatusDescriptions = {
      100: "Continue",
      101: "Switching Protocols",
      200: "OK",
      201: "Created",
      203: "Non-Authoritative Information",
      204: "No Content",
      205: "Reset Content",
      206: "Partial Content",
      300: "Multiple Choices",
      301: "Moved Permanently",
      302: "Found",
      303: "See Other",
      304: "Not Modified",
      305: "Use Proxy",
      307: "Temporary Redirect",
      400: "Bad Request",
      401: "Unauthorized",
      402: "Payment Required",
      403: "Forbidden",
      404: "Not Found",
      406: "Not Acceptable",
      407: "Proxy Authorization Required",
      408: "Request Timeout",
      409: "Conflict",
      410: "Gone",
      411: "Length Required",
      412: "Precondition Failed",
      413: "Request Entity Too Long",
      414: "Request-URI Too Long",
      415: "Unsupported Media Type",
      416: "Requested Range Not Satisfiable",
      417: "Expectation Failed",
      426: "Upgrade Required",
      500: "Internal Server Error",
      501: "Not Implemented",
      502: "Bad Gateway",
      503: "Service Unavailable",
      504: "Gateway Timeout",
      505: "HTTP Version Not Supported"
    };
    function WebSocketRequest(socket, httpRequest, serverConfig) {
      EventEmitter.call(this);
      this.socket = socket;
      this.httpRequest = httpRequest;
      this.resource = httpRequest.url;
      this.remoteAddress = socket.remoteAddress;
      this.remoteAddresses = [this.remoteAddress];
      this.serverConfig = serverConfig;
      this._socketIsClosing = false;
      this._socketCloseHandler = this._handleSocketCloseBeforeAccept.bind(this);
      this.socket.on("end", this._socketCloseHandler);
      this.socket.on("close", this._socketCloseHandler);
      this._resolved = false;
    }
    util.inherits(WebSocketRequest, EventEmitter);
    WebSocketRequest.prototype.readHandshake = function() {
      var self2 = this;
      var request = this.httpRequest;
      this.resourceURL = url.parse(this.resource, true);
      this.host = request.headers["host"];
      if (!this.host) {
        throw new Error("Client must provide a Host header.");
      }
      this.key = request.headers["sec-websocket-key"];
      if (!this.key) {
        throw new Error("Client must provide a value for Sec-WebSocket-Key.");
      }
      this.webSocketVersion = parseInt(request.headers["sec-websocket-version"], 10);
      if (!this.webSocketVersion || isNaN(this.webSocketVersion)) {
        throw new Error("Client must provide a value for Sec-WebSocket-Version.");
      }
      switch (this.webSocketVersion) {
        case 8:
        case 13:
          break;
        default:
          var e = new Error("Unsupported websocket client version: " + this.webSocketVersion + "Only versions 8 and 13 are supported.");
          e.httpCode = 426;
          e.headers = {
            "Sec-WebSocket-Version": "13"
          };
          throw e;
      }
      if (this.webSocketVersion === 13) {
        this.origin = request.headers["origin"];
      } else if (this.webSocketVersion === 8) {
        this.origin = request.headers["sec-websocket-origin"];
      }
      var protocolString = request.headers["sec-websocket-protocol"];
      this.protocolFullCaseMap = {};
      this.requestedProtocols = [];
      if (protocolString) {
        var requestedProtocolsFullCase = protocolString.split(headerValueSplitRegExp);
        requestedProtocolsFullCase.forEach(function(protocol) {
          var lcProtocol = protocol.toLocaleLowerCase();
          self2.requestedProtocols.push(lcProtocol);
          self2.protocolFullCaseMap[lcProtocol] = protocol;
        });
      }
      if (!this.serverConfig.ignoreXForwardedFor && request.headers["x-forwarded-for"]) {
        var immediatePeerIP = this.remoteAddress;
        this.remoteAddresses = request.headers["x-forwarded-for"].split(xForwardedForSeparatorRegExp);
        this.remoteAddresses.push(immediatePeerIP);
        this.remoteAddress = this.remoteAddresses[0];
      }
      if (this.serverConfig.parseExtensions) {
        var extensionsString = request.headers["sec-websocket-extensions"];
        this.requestedExtensions = this.parseExtensions(extensionsString);
      } else {
        this.requestedExtensions = [];
      }
      if (this.serverConfig.parseCookies) {
        var cookieString = request.headers["cookie"];
        this.cookies = this.parseCookies(cookieString);
      } else {
        this.cookies = [];
      }
    };
    WebSocketRequest.prototype.parseExtensions = function(extensionsString) {
      if (!extensionsString || extensionsString.length === 0) {
        return [];
      }
      var extensions = extensionsString.toLocaleLowerCase().split(headerValueSplitRegExp);
      extensions.forEach(function(extension, index, array) {
        var params = extension.split(headerParamSplitRegExp);
        var extensionName = params[0];
        var extensionParams = params.slice(1);
        extensionParams.forEach(function(rawParam, index2, array2) {
          var arr = rawParam.split("=");
          var obj2 = {
            name: arr[0],
            value: arr[1]
          };
          array2.splice(index2, 1, obj2);
        });
        var obj = {
          name: extensionName,
          params: extensionParams
        };
        array.splice(index, 1, obj);
      });
      return extensions;
    };
    WebSocketRequest.prototype.parseCookies = function(str) {
      if (!str || typeof str !== "string") {
        return [];
      }
      var cookies = [];
      var pairs = str.split(cookieSeparatorRegEx);
      pairs.forEach(function(pair) {
        var eq_idx = pair.indexOf("=");
        if (eq_idx === -1) {
          cookies.push({
            name: pair,
            value: null
          });
          return;
        }
        var key = pair.substr(0, eq_idx).trim();
        var val = pair.substr(++eq_idx, pair.length).trim();
        if ('"' === val[0]) {
          val = val.slice(1, -1);
        }
        cookies.push({
          name: key,
          value: decodeURIComponent(val)
        });
      });
      return cookies;
    };
    WebSocketRequest.prototype.accept = function(acceptedProtocol, allowedOrigin, cookies) {
      this._verifyResolution();
      var protocolFullCase;
      if (acceptedProtocol) {
        protocolFullCase = this.protocolFullCaseMap[acceptedProtocol.toLocaleLowerCase()];
        if (typeof protocolFullCase === "undefined") {
          protocolFullCase = acceptedProtocol;
        }
      } else {
        protocolFullCase = acceptedProtocol;
      }
      this.protocolFullCaseMap = null;
      var sha1 = crypto2.createHash("sha1");
      sha1.update(this.key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
      var acceptKey = sha1.digest("base64");
      var response = "HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: " + acceptKey + "\r\n";
      if (protocolFullCase) {
        for (var i2 = 0; i2 < protocolFullCase.length; i2++) {
          var charCode = protocolFullCase.charCodeAt(i2);
          var character = protocolFullCase.charAt(i2);
          if (charCode < 33 || charCode > 126 || separators.indexOf(character) !== -1) {
            this.reject(500);
            throw new Error('Illegal character "' + String.fromCharCode(character) + '" in subprotocol.');
          }
        }
        if (this.requestedProtocols.indexOf(acceptedProtocol) === -1) {
          this.reject(500);
          throw new Error("Specified protocol was not requested by the client.");
        }
        protocolFullCase = protocolFullCase.replace(headerSanitizeRegExp, "");
        response += "Sec-WebSocket-Protocol: " + protocolFullCase + "\r\n";
      }
      this.requestedProtocols = null;
      if (allowedOrigin) {
        allowedOrigin = allowedOrigin.replace(headerSanitizeRegExp, "");
        if (this.webSocketVersion === 13) {
          response += "Origin: " + allowedOrigin + "\r\n";
        } else if (this.webSocketVersion === 8) {
          response += "Sec-WebSocket-Origin: " + allowedOrigin + "\r\n";
        }
      }
      if (cookies) {
        if (!Array.isArray(cookies)) {
          this.reject(500);
          throw new Error('Value supplied for "cookies" argument must be an array.');
        }
        var seenCookies = {};
        cookies.forEach(function(cookie) {
          if (!cookie.name || !cookie.value) {
            this.reject(500);
            throw new Error('Each cookie to set must at least provide a "name" and "value"');
          }
          cookie.name = cookie.name.replace(controlCharsAndSemicolonRegEx, "");
          cookie.value = cookie.value.replace(controlCharsAndSemicolonRegEx, "");
          if (seenCookies[cookie.name]) {
            this.reject(500);
            throw new Error("You may not specify the same cookie name twice.");
          }
          seenCookies[cookie.name] = true;
          var invalidChar = cookie.name.match(cookieNameValidateRegEx);
          if (invalidChar) {
            this.reject(500);
            throw new Error("Illegal character " + invalidChar[0] + " in cookie name");
          }
          if (cookie.value.match(cookieValueDQuoteValidateRegEx)) {
            invalidChar = cookie.value.slice(1, -1).match(cookieValueValidateRegEx);
          } else {
            invalidChar = cookie.value.match(cookieValueValidateRegEx);
          }
          if (invalidChar) {
            this.reject(500);
            throw new Error("Illegal character " + invalidChar[0] + " in cookie value");
          }
          var cookieParts = [cookie.name + "=" + cookie.value];
          if (cookie.path) {
            invalidChar = cookie.path.match(controlCharsAndSemicolonRegEx);
            if (invalidChar) {
              this.reject(500);
              throw new Error("Illegal character " + invalidChar[0] + " in cookie path");
            }
            cookieParts.push("Path=" + cookie.path);
          }
          if (cookie.domain) {
            if (typeof cookie.domain !== "string") {
              this.reject(500);
              throw new Error("Domain must be specified and must be a string.");
            }
            invalidChar = cookie.domain.match(controlCharsAndSemicolonRegEx);
            if (invalidChar) {
              this.reject(500);
              throw new Error("Illegal character " + invalidChar[0] + " in cookie domain");
            }
            cookieParts.push("Domain=" + cookie.domain.toLowerCase());
          }
          if (cookie.expires) {
            if (!(cookie.expires instanceof Date)) {
              this.reject(500);
              throw new Error('Value supplied for cookie "expires" must be a vaild date object');
            }
            cookieParts.push("Expires=" + cookie.expires.toGMTString());
          }
          if (cookie.maxage) {
            var maxage = cookie.maxage;
            if (typeof maxage === "string") {
              maxage = parseInt(maxage, 10);
            }
            if (isNaN(maxage) || maxage <= 0) {
              this.reject(500);
              throw new Error('Value supplied for cookie "maxage" must be a non-zero number');
            }
            maxage = Math.round(maxage);
            cookieParts.push("Max-Age=" + maxage.toString(10));
          }
          if (cookie.secure) {
            if (typeof cookie.secure !== "boolean") {
              this.reject(500);
              throw new Error('Value supplied for cookie "secure" must be of type boolean');
            }
            cookieParts.push("Secure");
          }
          if (cookie.httponly) {
            if (typeof cookie.httponly !== "boolean") {
              this.reject(500);
              throw new Error('Value supplied for cookie "httponly" must be of type boolean');
            }
            cookieParts.push("HttpOnly");
          }
          response += "Set-Cookie: " + cookieParts.join(";") + "\r\n";
        }.bind(this));
      }
      this._resolved = true;
      this.emit("requestResolved", this);
      response += "\r\n";
      var connection = new WebSocketConnection(this.socket, [], acceptedProtocol, false, this.serverConfig);
      connection.webSocketVersion = this.webSocketVersion;
      connection.remoteAddress = this.remoteAddress;
      connection.remoteAddresses = this.remoteAddresses;
      var self2 = this;
      if (this._socketIsClosing) {
        cleanupFailedConnection(connection);
      } else {
        this.socket.write(response, "ascii", function(error) {
          if (error) {
            cleanupFailedConnection(connection);
            return;
          }
          self2._removeSocketCloseListeners();
          connection._addSocketEventListeners();
        });
      }
      this.emit("requestAccepted", connection);
      return connection;
    };
    WebSocketRequest.prototype.reject = function(status, reason, extraHeaders) {
      this._verifyResolution();
      this._resolved = true;
      this.emit("requestResolved", this);
      if (typeof status !== "number") {
        status = 403;
      }
      var response = "HTTP/1.1 " + status + " " + httpStatusDescriptions[status] + "\r\nConnection: close\r\n";
      if (reason) {
        reason = reason.replace(headerSanitizeRegExp, "");
        response += "X-WebSocket-Reject-Reason: " + reason + "\r\n";
      }
      if (extraHeaders) {
        for (var key in extraHeaders) {
          var sanitizedValue = extraHeaders[key].toString().replace(headerSanitizeRegExp, "");
          var sanitizedKey = key.replace(headerSanitizeRegExp, "");
          response += sanitizedKey + ": " + sanitizedValue + "\r\n";
        }
      }
      response += "\r\n";
      this.socket.end(response, "ascii");
      this.emit("requestRejected", this);
    };
    WebSocketRequest.prototype._handleSocketCloseBeforeAccept = function() {
      this._socketIsClosing = true;
      this._removeSocketCloseListeners();
    };
    WebSocketRequest.prototype._removeSocketCloseListeners = function() {
      this.socket.removeListener("end", this._socketCloseHandler);
      this.socket.removeListener("close", this._socketCloseHandler);
    };
    WebSocketRequest.prototype._verifyResolution = function() {
      if (this._resolved) {
        throw new Error("WebSocketRequest may only be accepted or rejected one time.");
      }
    };
    function cleanupFailedConnection(connection) {
      process.nextTick(function() {
        connection.drop(1006, "TCP connection lost before handshake completed.", true);
      });
    }
    module2.exports = WebSocketRequest;
  }
});

// node_modules/websocket/lib/WebSocketServer.js
var require_WebSocketServer = __commonJS({
  "node_modules/websocket/lib/WebSocketServer.js"(exports, module2) {
    var extend = require_utils().extend;
    var utils2 = require_utils();
    var util = require("util");
    var debug = require_src()("websocket:server");
    var EventEmitter = require("events").EventEmitter;
    var WebSocketRequest = require_WebSocketRequest();
    var WebSocketServer = function WebSocketServer2(config) {
      EventEmitter.call(this);
      this._handlers = {
        upgrade: this.handleUpgrade.bind(this),
        requestAccepted: this.handleRequestAccepted.bind(this),
        requestResolved: this.handleRequestResolved.bind(this)
      };
      this.connections = [];
      this.pendingRequests = [];
      if (config) {
        this.mount(config);
      }
    };
    util.inherits(WebSocketServer, EventEmitter);
    WebSocketServer.prototype.mount = function(config) {
      this.config = {
        httpServer: null,
        maxReceivedFrameSize: 65536,
        maxReceivedMessageSize: 1048576,
        fragmentOutgoingMessages: true,
        fragmentationThreshold: 16384,
        keepalive: true,
        keepaliveInterval: 2e4,
        dropConnectionOnKeepaliveTimeout: true,
        keepaliveGracePeriod: 1e4,
        useNativeKeepalive: false,
        assembleFragments: true,
        autoAcceptConnections: false,
        ignoreXForwardedFor: false,
        parseCookies: true,
        parseExtensions: true,
        disableNagleAlgorithm: true,
        closeTimeout: 5e3
      };
      extend(this.config, config);
      if (this.config.httpServer) {
        if (!Array.isArray(this.config.httpServer)) {
          this.config.httpServer = [this.config.httpServer];
        }
        var upgradeHandler = this._handlers.upgrade;
        this.config.httpServer.forEach(function(httpServer) {
          httpServer.on("upgrade", upgradeHandler);
        });
      } else {
        throw new Error("You must specify an httpServer on which to mount the WebSocket server.");
      }
    };
    WebSocketServer.prototype.unmount = function() {
      var upgradeHandler = this._handlers.upgrade;
      this.config.httpServer.forEach(function(httpServer) {
        httpServer.removeListener("upgrade", upgradeHandler);
      });
    };
    WebSocketServer.prototype.closeAllConnections = function() {
      this.connections.forEach(function(connection) {
        connection.close();
      });
      this.pendingRequests.forEach(function(request) {
        process.nextTick(function() {
          request.reject(503);
        });
      });
    };
    WebSocketServer.prototype.broadcast = function(data) {
      if (Buffer.isBuffer(data)) {
        this.broadcastBytes(data);
      } else if (typeof data.toString === "function") {
        this.broadcastUTF(data);
      }
    };
    WebSocketServer.prototype.broadcastUTF = function(utfData) {
      this.connections.forEach(function(connection) {
        connection.sendUTF(utfData);
      });
    };
    WebSocketServer.prototype.broadcastBytes = function(binaryData) {
      this.connections.forEach(function(connection) {
        connection.sendBytes(binaryData);
      });
    };
    WebSocketServer.prototype.shutDown = function() {
      this.unmount();
      this.closeAllConnections();
    };
    WebSocketServer.prototype.handleUpgrade = function(request, socket) {
      var self2 = this;
      var wsRequest = new WebSocketRequest(socket, request, this.config);
      try {
        wsRequest.readHandshake();
      } catch (e) {
        wsRequest.reject(
          e.httpCode ? e.httpCode : 400,
          e.message,
          e.headers
        );
        debug("Invalid handshake: %s", e.message);
        this.emit("upgradeError", e);
        return;
      }
      this.pendingRequests.push(wsRequest);
      wsRequest.once("requestAccepted", this._handlers.requestAccepted);
      wsRequest.once("requestResolved", this._handlers.requestResolved);
      socket.once("close", function() {
        self2._handlers.requestResolved(wsRequest);
      });
      if (!this.config.autoAcceptConnections && utils2.eventEmitterListenerCount(this, "request") > 0) {
        this.emit("request", wsRequest);
      } else if (this.config.autoAcceptConnections) {
        wsRequest.accept(wsRequest.requestedProtocols[0], wsRequest.origin);
      } else {
        wsRequest.reject(404, "No handler is configured to accept the connection.");
      }
    };
    WebSocketServer.prototype.handleRequestAccepted = function(connection) {
      var self2 = this;
      connection.once("close", function(closeReason, description) {
        self2.handleConnectionClose(connection, closeReason, description);
      });
      this.connections.push(connection);
      this.emit("connect", connection);
    };
    WebSocketServer.prototype.handleConnectionClose = function(connection, closeReason, description) {
      var index = this.connections.indexOf(connection);
      if (index !== -1) {
        this.connections.splice(index, 1);
      }
      this.emit("close", connection, closeReason, description);
    };
    WebSocketServer.prototype.handleRequestResolved = function(request) {
      var index = this.pendingRequests.indexOf(request);
      if (index !== -1) {
        this.pendingRequests.splice(index, 1);
      }
    };
    module2.exports = WebSocketServer;
  }
});

// node_modules/websocket/lib/WebSocketClient.js
var require_WebSocketClient = __commonJS({
  "node_modules/websocket/lib/WebSocketClient.js"(exports, module2) {
    var utils2 = require_utils();
    var extend = utils2.extend;
    var util = require("util");
    var EventEmitter = require("events").EventEmitter;
    var http = require("http");
    var https = require("https");
    var url = require("url");
    var crypto2 = require("crypto");
    var WebSocketConnection = require_WebSocketConnection();
    var bufferAllocUnsafe = utils2.bufferAllocUnsafe;
    var protocolSeparators = [
      "(",
      ")",
      "<",
      ">",
      "@",
      ",",
      ";",
      ":",
      "\\",
      '"',
      "/",
      "[",
      "]",
      "?",
      "=",
      "{",
      "}",
      " ",
      String.fromCharCode(9)
    ];
    var excludedTlsOptions = ["hostname", "port", "method", "path", "headers"];
    function WebSocketClient(config) {
      EventEmitter.call(this);
      this.config = {
        maxReceivedFrameSize: 1048576,
        maxReceivedMessageSize: 8388608,
        fragmentOutgoingMessages: true,
        fragmentationThreshold: 16384,
        webSocketVersion: 13,
        assembleFragments: true,
        disableNagleAlgorithm: true,
        closeTimeout: 5e3,
        tlsOptions: {}
      };
      if (config) {
        var tlsOptions;
        if (config.tlsOptions) {
          tlsOptions = config.tlsOptions;
          delete config.tlsOptions;
        } else {
          tlsOptions = {};
        }
        extend(this.config, config);
        extend(this.config.tlsOptions, tlsOptions);
      }
      this._req = null;
      switch (this.config.webSocketVersion) {
        case 8:
        case 13:
          break;
        default:
          throw new Error("Requested webSocketVersion is not supported. Allowed values are 8 and 13.");
      }
    }
    util.inherits(WebSocketClient, EventEmitter);
    WebSocketClient.prototype.connect = function(requestUrl, protocols, origin, headers, extraRequestOptions) {
      var self2 = this;
      if (typeof protocols === "string") {
        if (protocols.length > 0) {
          protocols = [protocols];
        } else {
          protocols = [];
        }
      }
      if (!(protocols instanceof Array)) {
        protocols = [];
      }
      this.protocols = protocols;
      this.origin = origin;
      if (typeof requestUrl === "string") {
        this.url = url.parse(requestUrl);
      } else {
        this.url = requestUrl;
      }
      if (!this.url.protocol) {
        throw new Error("You must specify a full WebSocket URL, including protocol.");
      }
      if (!this.url.host) {
        throw new Error("You must specify a full WebSocket URL, including hostname. Relative URLs are not supported.");
      }
      this.secure = this.url.protocol === "wss:";
      this.protocols.forEach(function(protocol) {
        for (var i2 = 0; i2 < protocol.length; i2++) {
          var charCode = protocol.charCodeAt(i2);
          var character = protocol.charAt(i2);
          if (charCode < 33 || charCode > 126 || protocolSeparators.indexOf(character) !== -1) {
            throw new Error('Protocol list contains invalid character "' + String.fromCharCode(charCode) + '"');
          }
        }
      });
      var defaultPorts = {
        "ws:": "80",
        "wss:": "443"
      };
      if (!this.url.port) {
        this.url.port = defaultPorts[this.url.protocol];
      }
      var nonce = bufferAllocUnsafe(16);
      for (var i = 0; i < 16; i++) {
        nonce[i] = Math.round(Math.random() * 255);
      }
      this.base64nonce = nonce.toString("base64");
      var hostHeaderValue = this.url.hostname;
      if (this.url.protocol === "ws:" && this.url.port !== "80" || this.url.protocol === "wss:" && this.url.port !== "443") {
        hostHeaderValue += ":" + this.url.port;
      }
      var reqHeaders = {};
      if (this.secure && this.config.tlsOptions.hasOwnProperty("headers")) {
        extend(reqHeaders, this.config.tlsOptions.headers);
      }
      if (headers) {
        extend(reqHeaders, headers);
      }
      extend(reqHeaders, {
        "Upgrade": "websocket",
        "Connection": "Upgrade",
        "Sec-WebSocket-Version": this.config.webSocketVersion.toString(10),
        "Sec-WebSocket-Key": this.base64nonce,
        "Host": reqHeaders.Host || hostHeaderValue
      });
      if (this.protocols.length > 0) {
        reqHeaders["Sec-WebSocket-Protocol"] = this.protocols.join(", ");
      }
      if (this.origin) {
        if (this.config.webSocketVersion === 13) {
          reqHeaders["Origin"] = this.origin;
        } else if (this.config.webSocketVersion === 8) {
          reqHeaders["Sec-WebSocket-Origin"] = this.origin;
        }
      }
      var pathAndQuery;
      if (this.url.pathname) {
        pathAndQuery = this.url.path;
      } else if (this.url.path) {
        pathAndQuery = "/" + this.url.path;
      } else {
        pathAndQuery = "/";
      }
      function handleRequestError(error) {
        self2._req = null;
        self2.emit("connectFailed", error);
      }
      var requestOptions = {
        agent: false
      };
      if (extraRequestOptions) {
        extend(requestOptions, extraRequestOptions);
      }
      extend(requestOptions, {
        hostname: this.url.hostname,
        port: this.url.port,
        method: "GET",
        path: pathAndQuery,
        headers: reqHeaders
      });
      if (this.secure) {
        var tlsOptions = this.config.tlsOptions;
        for (var key in tlsOptions) {
          if (tlsOptions.hasOwnProperty(key) && excludedTlsOptions.indexOf(key) === -1) {
            requestOptions[key] = tlsOptions[key];
          }
        }
      }
      var req = this._req = (this.secure ? https : http).request(requestOptions);
      req.on("upgrade", function handleRequestUpgrade(response, socket, head) {
        self2._req = null;
        req.removeListener("error", handleRequestError);
        self2.socket = socket;
        self2.response = response;
        self2.firstDataChunk = head;
        self2.validateHandshake();
      });
      req.on("error", handleRequestError);
      req.on("response", function(response) {
        self2._req = null;
        if (utils2.eventEmitterListenerCount(self2, "httpResponse") > 0) {
          self2.emit("httpResponse", response, self2);
          if (response.socket) {
            response.socket.end();
          }
        } else {
          var headerDumpParts = [];
          for (var headerName in response.headers) {
            headerDumpParts.push(headerName + ": " + response.headers[headerName]);
          }
          self2.failHandshake(
            "Server responded with a non-101 status: " + response.statusCode + " " + response.statusMessage + "\nResponse Headers Follow:\n" + headerDumpParts.join("\n") + "\n"
          );
        }
      });
      req.end();
    };
    WebSocketClient.prototype.validateHandshake = function() {
      var headers = this.response.headers;
      if (this.protocols.length > 0) {
        this.protocol = headers["sec-websocket-protocol"];
        if (this.protocol) {
          if (this.protocols.indexOf(this.protocol) === -1) {
            this.failHandshake("Server did not respond with a requested protocol.");
            return;
          }
        } else {
          this.failHandshake("Expected a Sec-WebSocket-Protocol header.");
          return;
        }
      }
      if (!(headers["connection"] && headers["connection"].toLocaleLowerCase() === "upgrade")) {
        this.failHandshake("Expected a Connection: Upgrade header from the server");
        return;
      }
      if (!(headers["upgrade"] && headers["upgrade"].toLocaleLowerCase() === "websocket")) {
        this.failHandshake("Expected an Upgrade: websocket header from the server");
        return;
      }
      var sha1 = crypto2.createHash("sha1");
      sha1.update(this.base64nonce + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
      var expectedKey = sha1.digest("base64");
      if (!headers["sec-websocket-accept"]) {
        this.failHandshake("Expected Sec-WebSocket-Accept header from server");
        return;
      }
      if (headers["sec-websocket-accept"] !== expectedKey) {
        this.failHandshake("Sec-WebSocket-Accept header from server didn't match expected value of " + expectedKey);
        return;
      }
      this.succeedHandshake();
    };
    WebSocketClient.prototype.failHandshake = function(errorDescription) {
      if (this.socket && this.socket.writable) {
        this.socket.end();
      }
      this.emit("connectFailed", new Error(errorDescription));
    };
    WebSocketClient.prototype.succeedHandshake = function() {
      var connection = new WebSocketConnection(this.socket, [], this.protocol, true, this.config);
      connection.webSocketVersion = this.config.webSocketVersion;
      connection._addSocketEventListeners();
      this.emit("connect", connection);
      if (this.firstDataChunk.length > 0) {
        connection.handleSocketData(this.firstDataChunk);
      }
      this.firstDataChunk = null;
    };
    WebSocketClient.prototype.abort = function() {
      if (this._req) {
        this._req.abort();
      }
    };
    module2.exports = WebSocketClient;
  }
});

// node_modules/websocket/lib/WebSocketRouterRequest.js
var require_WebSocketRouterRequest = __commonJS({
  "node_modules/websocket/lib/WebSocketRouterRequest.js"(exports, module2) {
    var util = require("util");
    var EventEmitter = require("events").EventEmitter;
    function WebSocketRouterRequest(webSocketRequest, resolvedProtocol) {
      EventEmitter.call(this);
      this.webSocketRequest = webSocketRequest;
      if (resolvedProtocol === "____no_protocol____") {
        this.protocol = null;
      } else {
        this.protocol = resolvedProtocol;
      }
      this.origin = webSocketRequest.origin;
      this.resource = webSocketRequest.resource;
      this.resourceURL = webSocketRequest.resourceURL;
      this.httpRequest = webSocketRequest.httpRequest;
      this.remoteAddress = webSocketRequest.remoteAddress;
      this.webSocketVersion = webSocketRequest.webSocketVersion;
      this.requestedExtensions = webSocketRequest.requestedExtensions;
      this.cookies = webSocketRequest.cookies;
    }
    util.inherits(WebSocketRouterRequest, EventEmitter);
    WebSocketRouterRequest.prototype.accept = function(origin, cookies) {
      var connection = this.webSocketRequest.accept(this.protocol, origin, cookies);
      this.emit("requestAccepted", connection);
      return connection;
    };
    WebSocketRouterRequest.prototype.reject = function(status, reason, extraHeaders) {
      this.webSocketRequest.reject(status, reason, extraHeaders);
      this.emit("requestRejected", this);
    };
    module2.exports = WebSocketRouterRequest;
  }
});

// node_modules/websocket/lib/WebSocketRouter.js
var require_WebSocketRouter = __commonJS({
  "node_modules/websocket/lib/WebSocketRouter.js"(exports, module2) {
    var extend = require_utils().extend;
    var util = require("util");
    var EventEmitter = require("events").EventEmitter;
    var WebSocketRouterRequest = require_WebSocketRouterRequest();
    function WebSocketRouter(config) {
      EventEmitter.call(this);
      this.config = {
        server: null
      };
      if (config) {
        extend(this.config, config);
      }
      this.handlers = [];
      this._requestHandler = this.handleRequest.bind(this);
      if (this.config.server) {
        this.attachServer(this.config.server);
      }
    }
    util.inherits(WebSocketRouter, EventEmitter);
    WebSocketRouter.prototype.attachServer = function(server) {
      if (server) {
        this.server = server;
        this.server.on("request", this._requestHandler);
      } else {
        throw new Error("You must specify a WebSocketServer instance to attach to.");
      }
    };
    WebSocketRouter.prototype.detachServer = function() {
      if (this.server) {
        this.server.removeListener("request", this._requestHandler);
        this.server = null;
      } else {
        throw new Error("Cannot detach from server: not attached.");
      }
    };
    WebSocketRouter.prototype.mount = function(path, protocol, callback) {
      if (!path) {
        throw new Error("You must specify a path for this handler.");
      }
      if (!protocol) {
        protocol = "____no_protocol____";
      }
      if (!callback) {
        throw new Error("You must specify a callback for this handler.");
      }
      path = this.pathToRegExp(path);
      if (!(path instanceof RegExp)) {
        throw new Error("Path must be specified as either a string or a RegExp.");
      }
      var pathString = path.toString();
      protocol = protocol.toLocaleLowerCase();
      if (this.findHandlerIndex(pathString, protocol) !== -1) {
        throw new Error("You may only mount one handler per path/protocol combination.");
      }
      this.handlers.push({
        "path": path,
        "pathString": pathString,
        "protocol": protocol,
        "callback": callback
      });
    };
    WebSocketRouter.prototype.unmount = function(path, protocol) {
      var index = this.findHandlerIndex(this.pathToRegExp(path).toString(), protocol);
      if (index !== -1) {
        this.handlers.splice(index, 1);
      } else {
        throw new Error("Unable to find a route matching the specified path and protocol.");
      }
    };
    WebSocketRouter.prototype.findHandlerIndex = function(pathString, protocol) {
      protocol = protocol.toLocaleLowerCase();
      for (var i = 0, len = this.handlers.length; i < len; i++) {
        var handler = this.handlers[i];
        if (handler.pathString === pathString && handler.protocol === protocol) {
          return i;
        }
      }
      return -1;
    };
    WebSocketRouter.prototype.pathToRegExp = function(path) {
      if (typeof path === "string") {
        if (path === "*") {
          path = /^.*$/;
        } else {
          path = path.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
          path = new RegExp("^" + path + "$");
        }
      }
      return path;
    };
    WebSocketRouter.prototype.handleRequest = function(request) {
      var requestedProtocols = request.requestedProtocols;
      if (requestedProtocols.length === 0) {
        requestedProtocols = ["____no_protocol____"];
      }
      for (var i = 0; i < requestedProtocols.length; i++) {
        var requestedProtocol = requestedProtocols[i].toLocaleLowerCase();
        for (var j = 0, len = this.handlers.length; j < len; j++) {
          var handler = this.handlers[j];
          if (handler.path.test(request.resourceURL.pathname)) {
            if (requestedProtocol === handler.protocol || handler.protocol === "*") {
              var routerRequest = new WebSocketRouterRequest(request, requestedProtocol);
              handler.callback(routerRequest);
              return;
            }
          }
        }
      }
      request.reject(404, "No handler is available for the given request.");
    };
    module2.exports = WebSocketRouter;
  }
});

// node_modules/is-typedarray/index.js
var require_is_typedarray = __commonJS({
  "node_modules/is-typedarray/index.js"(exports, module2) {
    module2.exports = isTypedArray;
    isTypedArray.strict = isStrictTypedArray;
    isTypedArray.loose = isLooseTypedArray;
    var toString = Object.prototype.toString;
    var names = {
      "[object Int8Array]": true,
      "[object Int16Array]": true,
      "[object Int32Array]": true,
      "[object Uint8Array]": true,
      "[object Uint8ClampedArray]": true,
      "[object Uint16Array]": true,
      "[object Uint32Array]": true,
      "[object Float32Array]": true,
      "[object Float64Array]": true
    };
    function isTypedArray(arr) {
      return isStrictTypedArray(arr) || isLooseTypedArray(arr);
    }
    function isStrictTypedArray(arr) {
      return arr instanceof Int8Array || arr instanceof Int16Array || arr instanceof Int32Array || arr instanceof Uint8Array || arr instanceof Uint8ClampedArray || arr instanceof Uint16Array || arr instanceof Uint32Array || arr instanceof Float32Array || arr instanceof Float64Array;
    }
    function isLooseTypedArray(arr) {
      return names[toString.call(arr)];
    }
  }
});

// node_modules/typedarray-to-buffer/index.js
var require_typedarray_to_buffer = __commonJS({
  "node_modules/typedarray-to-buffer/index.js"(exports, module2) {
    var isTypedArray = require_is_typedarray().strict;
    module2.exports = function typedarrayToBuffer(arr) {
      if (isTypedArray(arr)) {
        var buf = Buffer.from(arr.buffer);
        if (arr.byteLength !== arr.buffer.byteLength) {
          buf = buf.slice(arr.byteOffset, arr.byteOffset + arr.byteLength);
        }
        return buf;
      } else {
        return Buffer.from(arr);
      }
    };
  }
});

// node_modules/yaeti/lib/EventTarget.js
var require_EventTarget = __commonJS({
  "node_modules/yaeti/lib/EventTarget.js"(exports, module2) {
    module2.exports = _EventTarget;
    function _EventTarget() {
      if (typeof this.addEventListener === "function") {
        return;
      }
      this._listeners = {};
      this.addEventListener = _addEventListener;
      this.removeEventListener = _removeEventListener;
      this.dispatchEvent = _dispatchEvent;
    }
    Object.defineProperties(_EventTarget.prototype, {
      listeners: {
        get: function() {
          return this._listeners;
        }
      }
    });
    function _addEventListener(type, newListener) {
      var listenersType, i, listener;
      if (!type || !newListener) {
        return;
      }
      listenersType = this._listeners[type];
      if (listenersType === void 0) {
        this._listeners[type] = listenersType = [];
      }
      for (i = 0; !!(listener = listenersType[i]); i++) {
        if (listener === newListener) {
          return;
        }
      }
      listenersType.push(newListener);
    }
    function _removeEventListener(type, oldListener) {
      var listenersType, i, listener;
      if (!type || !oldListener) {
        return;
      }
      listenersType = this._listeners[type];
      if (listenersType === void 0) {
        return;
      }
      for (i = 0; !!(listener = listenersType[i]); i++) {
        if (listener === oldListener) {
          listenersType.splice(i, 1);
          break;
        }
      }
      if (listenersType.length === 0) {
        delete this._listeners[type];
      }
    }
    function _dispatchEvent(event) {
      var type, listenersType, dummyListener, stopImmediatePropagation = false, i, listener;
      if (!event || typeof event.type !== "string") {
        throw new Error("`event` must have a valid `type` property");
      }
      if (event._yaeti) {
        event.target = this;
        event.cancelable = true;
      }
      try {
        event.stopImmediatePropagation = function() {
          stopImmediatePropagation = true;
        };
      } catch (error) {
      }
      type = event.type;
      listenersType = this._listeners[type] || [];
      dummyListener = this["on" + type];
      if (typeof dummyListener === "function") {
        dummyListener.call(this, event);
      }
      for (i = 0; !!(listener = listenersType[i]); i++) {
        if (stopImmediatePropagation) {
          break;
        }
        listener.call(this, event);
      }
      return !event.defaultPrevented;
    }
  }
});

// node_modules/yaeti/lib/Event.js
var require_Event = __commonJS({
  "node_modules/yaeti/lib/Event.js"(exports, module2) {
    module2.exports = _Event;
    function _Event(type) {
      this.type = type;
      this.isTrusted = false;
      this._yaeti = true;
    }
  }
});

// node_modules/yaeti/index.js
var require_yaeti = __commonJS({
  "node_modules/yaeti/index.js"(exports, module2) {
    module2.exports = {
      EventTarget: require_EventTarget(),
      Event: require_Event()
    };
  }
});

// node_modules/websocket/lib/W3CWebSocket.js
var require_W3CWebSocket = __commonJS({
  "node_modules/websocket/lib/W3CWebSocket.js"(exports, module2) {
    var WebSocketClient = require_WebSocketClient();
    var toBuffer = require_typedarray_to_buffer();
    var yaeti = require_yaeti();
    var CONNECTING = 0;
    var OPEN = 1;
    var CLOSING = 2;
    var CLOSED = 3;
    module2.exports = W3CWebSocket;
    function W3CWebSocket(url, protocols, origin, headers, requestOptions, clientConfig) {
      yaeti.EventTarget.call(this);
      clientConfig = clientConfig || {};
      clientConfig.assembleFragments = true;
      var self2 = this;
      this._url = url;
      this._readyState = CONNECTING;
      this._protocol = void 0;
      this._extensions = "";
      this._bufferedAmount = 0;
      this._binaryType = "arraybuffer";
      this._connection = void 0;
      this._client = new WebSocketClient(clientConfig);
      this._client.on("connect", function(connection) {
        onConnect.call(self2, connection);
      });
      this._client.on("connectFailed", function() {
        onConnectFailed.call(self2);
      });
      this._client.connect(url, protocols, origin, headers, requestOptions);
    }
    Object.defineProperties(W3CWebSocket.prototype, {
      url: { get: function() {
        return this._url;
      } },
      readyState: { get: function() {
        return this._readyState;
      } },
      protocol: { get: function() {
        return this._protocol;
      } },
      extensions: { get: function() {
        return this._extensions;
      } },
      bufferedAmount: { get: function() {
        return this._bufferedAmount;
      } }
    });
    Object.defineProperties(W3CWebSocket.prototype, {
      binaryType: {
        get: function() {
          return this._binaryType;
        },
        set: function(type) {
          if (type !== "arraybuffer") {
            throw new SyntaxError('just "arraybuffer" type allowed for "binaryType" attribute');
          }
          this._binaryType = type;
        }
      }
    });
    [["CONNECTING", CONNECTING], ["OPEN", OPEN], ["CLOSING", CLOSING], ["CLOSED", CLOSED]].forEach(function(property) {
      Object.defineProperty(W3CWebSocket.prototype, property[0], {
        get: function() {
          return property[1];
        }
      });
    });
    [["CONNECTING", CONNECTING], ["OPEN", OPEN], ["CLOSING", CLOSING], ["CLOSED", CLOSED]].forEach(function(property) {
      Object.defineProperty(W3CWebSocket, property[0], {
        get: function() {
          return property[1];
        }
      });
    });
    W3CWebSocket.prototype.send = function(data) {
      if (this._readyState !== OPEN) {
        throw new Error("cannot call send() while not connected");
      }
      if (typeof data === "string" || data instanceof String) {
        this._connection.sendUTF(data);
      } else {
        if (data instanceof Buffer) {
          this._connection.sendBytes(data);
        } else if (data.byteLength || data.byteLength === 0) {
          data = toBuffer(data);
          this._connection.sendBytes(data);
        } else {
          throw new Error("unknown binary data:", data);
        }
      }
    };
    W3CWebSocket.prototype.close = function(code, reason) {
      switch (this._readyState) {
        case CONNECTING:
          onConnectFailed.call(this);
          this._client.on("connect", function(connection) {
            if (code) {
              connection.close(code, reason);
            } else {
              connection.close();
            }
          });
          break;
        case OPEN:
          this._readyState = CLOSING;
          if (code) {
            this._connection.close(code, reason);
          } else {
            this._connection.close();
          }
          break;
        case CLOSING:
        case CLOSED:
          break;
      }
    };
    function createCloseEvent(code, reason) {
      var event = new yaeti.Event("close");
      event.code = code;
      event.reason = reason;
      event.wasClean = typeof code === "undefined" || code === 1e3;
      return event;
    }
    function createMessageEvent(data) {
      var event = new yaeti.Event("message");
      event.data = data;
      return event;
    }
    function onConnect(connection) {
      var self2 = this;
      this._readyState = OPEN;
      this._connection = connection;
      this._protocol = connection.protocol;
      this._extensions = connection.extensions;
      this._connection.on("close", function(code, reason) {
        onClose.call(self2, code, reason);
      });
      this._connection.on("message", function(msg) {
        onMessage.call(self2, msg);
      });
      this.dispatchEvent(new yaeti.Event("open"));
    }
    function onConnectFailed() {
      destroy.call(this);
      this._readyState = CLOSED;
      try {
        this.dispatchEvent(new yaeti.Event("error"));
      } finally {
        this.dispatchEvent(createCloseEvent(1006, "connection failed"));
      }
    }
    function onClose(code, reason) {
      destroy.call(this);
      this._readyState = CLOSED;
      this.dispatchEvent(createCloseEvent(code, reason || ""));
    }
    function onMessage(message) {
      if (message.utf8Data) {
        this.dispatchEvent(createMessageEvent(message.utf8Data));
      } else if (message.binaryData) {
        if (this.binaryType === "arraybuffer") {
          var buffer = message.binaryData;
          var arraybuffer = new ArrayBuffer(buffer.length);
          var view = new Uint8Array(arraybuffer);
          for (var i = 0, len = buffer.length; i < len; ++i) {
            view[i] = buffer[i];
          }
          this.dispatchEvent(createMessageEvent(arraybuffer));
        }
      }
    }
    function destroy() {
      this._client.removeAllListeners();
      if (this._connection) {
        this._connection.removeAllListeners();
      }
    }
  }
});

// node_modules/websocket/lib/Deprecation.js
var require_Deprecation = __commonJS({
  "node_modules/websocket/lib/Deprecation.js"(exports, module2) {
    var Deprecation = {
      disableWarnings: false,
      deprecationWarningMap: {},
      warn: function(deprecationName) {
        if (!this.disableWarnings && this.deprecationWarningMap[deprecationName]) {
          console.warn("DEPRECATION WARNING: " + this.deprecationWarningMap[deprecationName]);
          this.deprecationWarningMap[deprecationName] = false;
        }
      }
    };
    module2.exports = Deprecation;
  }
});

// node_modules/websocket/package.json
var require_package = __commonJS({
  "node_modules/websocket/package.json"(exports, module2) {
    module2.exports = {
      name: "websocket",
      description: "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.",
      keywords: [
        "websocket",
        "websockets",
        "socket",
        "networking",
        "comet",
        "push",
        "RFC-6455",
        "realtime",
        "server",
        "client"
      ],
      author: "Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)",
      contributors: [
        "I\xF1aki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"
      ],
      version: "1.0.34",
      repository: {
        type: "git",
        url: "https://github.com/theturtle32/WebSocket-Node.git"
      },
      homepage: "https://github.com/theturtle32/WebSocket-Node",
      engines: {
        node: ">=4.0.0"
      },
      dependencies: {
        bufferutil: "^4.0.1",
        debug: "^2.2.0",
        "es5-ext": "^0.10.50",
        "typedarray-to-buffer": "^3.1.5",
        "utf-8-validate": "^5.0.2",
        yaeti: "^0.0.6"
      },
      devDependencies: {
        "buffer-equal": "^1.0.0",
        gulp: "^4.0.2",
        "gulp-jshint": "^2.0.4",
        "jshint-stylish": "^2.2.1",
        jshint: "^2.0.0",
        tape: "^4.9.1"
      },
      config: {
        verbose: false
      },
      scripts: {
        test: "tape test/unit/*.js",
        gulp: "gulp"
      },
      main: "index",
      directories: {
        lib: "./lib"
      },
      browser: "lib/browser.js",
      license: "Apache-2.0"
    };
  }
});

// node_modules/websocket/lib/version.js
var require_version = __commonJS({
  "node_modules/websocket/lib/version.js"(exports, module2) {
    module2.exports = require_package().version;
  }
});

// node_modules/websocket/lib/websocket.js
var require_websocket = __commonJS({
  "node_modules/websocket/lib/websocket.js"(exports, module2) {
    module2.exports = {
      "server": require_WebSocketServer(),
      "client": require_WebSocketClient(),
      "router": require_WebSocketRouter(),
      "frame": require_WebSocketFrame(),
      "request": require_WebSocketRequest(),
      "connection": require_WebSocketConnection(),
      "w3cwebsocket": require_W3CWebSocket(),
      "deprecation": require_Deprecation(),
      "version": require_version()
    };
  }
});

// node_modules/websocket/index.js
var require_websocket2 = __commonJS({
  "node_modules/websocket/index.js"(exports, module2) {
    module2.exports = require_websocket();
  }
});

// node_modules/tstl/internal/iterator/disposable/ForOfAdaptor.js
var require_ForOfAdaptor = __commonJS({
  "node_modules/tstl/internal/iterator/disposable/ForOfAdaptor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ForOfAdaptor = void 0;
    var ForOfAdaptor = function() {
      function ForOfAdaptor2(first, last) {
        this.it_ = first;
        this.last_ = last;
      }
      ForOfAdaptor2.prototype.next = function() {
        if (this.it_.equals(this.last_))
          return {
            done: true,
            value: void 0
          };
        else {
          var it = this.it_;
          this.it_ = this.it_.next();
          return {
            done: false,
            value: it.value
          };
        }
      };
      ForOfAdaptor2.prototype[Symbol.iterator] = function() {
        return this;
      };
      return ForOfAdaptor2;
    }();
    exports.ForOfAdaptor = ForOfAdaptor;
  }
});

// node_modules/tstl/base/container/Container.js
var require_Container = __commonJS({
  "node_modules/tstl/base/container/Container.js"(exports) {
    "use strict";
    var __values = exports && exports.__values || function(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m)
        return m.call(o);
      if (o && typeof o.length === "number")
        return {
          next: function() {
            if (o && i >= o.length)
              o = void 0;
            return { value: o && o[i++], done: !o };
          }
        };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Container = void 0;
    var ForOfAdaptor_1 = require_ForOfAdaptor();
    var Container = function() {
      function Container2() {
      }
      Container2.prototype.empty = function() {
        return this.size() === 0;
      };
      Container2.prototype.rbegin = function() {
        return this.end().reverse();
      };
      Container2.prototype.rend = function() {
        return this.begin().reverse();
      };
      Container2.prototype[Symbol.iterator] = function() {
        return new ForOfAdaptor_1.ForOfAdaptor(this.begin(), this.end());
      };
      Container2.prototype.toJSON = function() {
        var e_1, _a;
        var ret = [];
        try {
          for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
            var elem = _c.value;
            ret.push(elem);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return))
              _a.call(_b);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
        return ret;
      };
      return Container2;
    }();
    exports.Container = Container;
  }
});

// node_modules/tstl/internal/iterator/disposable/NativeArrayIterator.js
var require_NativeArrayIterator = __commonJS({
  "node_modules/tstl/internal/iterator/disposable/NativeArrayIterator.js"(exports) {
    "use strict";
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NativeArrayIterator = void 0;
    var NativeArrayIterator = function() {
      function NativeArrayIterator2(data, index) {
        this.data_ = data;
        this.index_ = index;
      }
      NativeArrayIterator2.prototype.index = function() {
        return this.index_;
      };
      Object.defineProperty(NativeArrayIterator2.prototype, "value", {
        get: function() {
          return this.data_[this.index_];
        },
        enumerable: false,
        configurable: true
      });
      NativeArrayIterator2.prototype.prev = function() {
        --this.index_;
        return this;
      };
      NativeArrayIterator2.prototype.next = function() {
        ++this.index_;
        return this;
      };
      NativeArrayIterator2.prototype.advance = function(n) {
        this.index_ += n;
        return this;
      };
      NativeArrayIterator2.prototype.equals = function(obj) {
        return this.data_ === obj.data_ && this.index_ === obj.index_;
      };
      NativeArrayIterator2.prototype.swap = function(obj) {
        var _a, _b;
        _a = __read([obj.data_, this.data_], 2), this.data_ = _a[0], obj.data_ = _a[1];
        _b = __read([obj.index_, this.index_], 2), this.index_ = _b[0], obj.index_ = _b[1];
      };
      return NativeArrayIterator2;
    }();
    exports.NativeArrayIterator = NativeArrayIterator;
  }
});

// node_modules/tstl/base/container/SetContainer.js
var require_SetContainer = __commonJS({
  "node_modules/tstl/base/container/SetContainer.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SetContainer = void 0;
    var Container_1 = require_Container();
    var NativeArrayIterator_1 = require_NativeArrayIterator();
    var SetContainer = function(_super) {
      __extends(SetContainer2, _super);
      function SetContainer2(factory) {
        var _this = _super.call(this) || this;
        _this.data_ = factory(_this);
        return _this;
      }
      SetContainer2.prototype.assign = function(first, last) {
        this.clear();
        this.insert(first, last);
      };
      SetContainer2.prototype.clear = function() {
        this.data_.clear();
      };
      SetContainer2.prototype.begin = function() {
        return this.data_.begin();
      };
      SetContainer2.prototype.end = function() {
        return this.data_.end();
      };
      SetContainer2.prototype.has = function(key) {
        return !this.find(key).equals(this.end());
      };
      SetContainer2.prototype.size = function() {
        return this.data_.size();
      };
      SetContainer2.prototype.push = function() {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          items[_i] = arguments[_i];
        }
        if (items.length === 0)
          return this.size();
        var first = new NativeArrayIterator_1.NativeArrayIterator(items, 0);
        var last = new NativeArrayIterator_1.NativeArrayIterator(items, items.length);
        this._Insert_by_range(first, last);
        return this.size();
      };
      SetContainer2.prototype.insert = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (args.length === 1)
          return this._Insert_by_key(args[0]);
        else if (args[0].next instanceof Function && args[1].next instanceof Function)
          return this._Insert_by_range(args[0], args[1]);
        else
          return this._Insert_by_hint(args[0], args[1]);
      };
      SetContainer2.prototype.erase = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (args.length === 1 && !(args[0] instanceof this.end().constructor && args[0].source() === this))
          return this._Erase_by_val(args[0]);
        else if (args.length === 1)
          return this._Erase_by_range(args[0]);
        else
          return this._Erase_by_range(args[0], args[1]);
      };
      SetContainer2.prototype._Erase_by_range = function(first, last) {
        if (last === void 0) {
          last = first.next();
        }
        var it = this.data_.erase(first, last);
        this._Handle_erase(first, last);
        return it;
      };
      return SetContainer2;
    }(Container_1.Container);
    exports.SetContainer = SetContainer;
  }
});

// node_modules/tstl/exception/Exception.js
var require_Exception = __commonJS({
  "node_modules/tstl/exception/Exception.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Exception = void 0;
    var Exception = function(_super) {
      __extends(Exception2, _super);
      function Exception2(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        var proto = _newTarget.prototype;
        if (Object.setPrototypeOf)
          Object.setPrototypeOf(_this, proto);
        else
          _this.__proto__ = proto;
        return _this;
      }
      Object.defineProperty(Exception2.prototype, "name", {
        get: function() {
          return this.constructor.name;
        },
        enumerable: false,
        configurable: true
      });
      Exception2.prototype.what = function() {
        return this.message;
      };
      Exception2.prototype.toJSON = function() {
        return {
          name: this.name,
          message: this.message,
          stack: this.stack
        };
      };
      return Exception2;
    }(Error);
    exports.Exception = Exception;
  }
});

// node_modules/tstl/exception/LogicError.js
var require_LogicError = __commonJS({
  "node_modules/tstl/exception/LogicError.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LogicError = void 0;
    var Exception_1 = require_Exception();
    var LogicError = function(_super) {
      __extends(LogicError2, _super);
      function LogicError2(message) {
        return _super.call(this, message) || this;
      }
      return LogicError2;
    }(Exception_1.Exception);
    exports.LogicError = LogicError;
  }
});

// node_modules/tstl/exception/InvalidArgument.js
var require_InvalidArgument = __commonJS({
  "node_modules/tstl/exception/InvalidArgument.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvalidArgument = void 0;
    var LogicError_1 = require_LogicError();
    var InvalidArgument = function(_super) {
      __extends(InvalidArgument2, _super);
      function InvalidArgument2(message) {
        return _super.call(this, message) || this;
      }
      return InvalidArgument2;
    }(LogicError_1.LogicError);
    exports.InvalidArgument = InvalidArgument;
  }
});

// node_modules/tstl/exception/OutOfRange.js
var require_OutOfRange = __commonJS({
  "node_modules/tstl/exception/OutOfRange.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OutOfRange = void 0;
    var LogicError_1 = require_LogicError();
    var OutOfRange = function(_super) {
      __extends(OutOfRange2, _super);
      function OutOfRange2(message) {
        return _super.call(this, message) || this;
      }
      return OutOfRange2;
    }(LogicError_1.LogicError);
    exports.OutOfRange = OutOfRange;
  }
});

// node_modules/tstl/internal/exception/ErrorGenerator.js
var require_ErrorGenerator = __commonJS({
  "node_modules/tstl/internal/exception/ErrorGenerator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ErrorGenerator = void 0;
    var InvalidArgument_1 = require_InvalidArgument();
    var OutOfRange_1 = require_OutOfRange();
    var ErrorGenerator;
    (function(ErrorGenerator2) {
      function get_class_name(instance) {
        if (typeof instance === "string")
          return instance;
        var ret = instance.constructor.name;
        if (instance.constructor.__MODULE)
          ret = "".concat(instance.constructor.__MODULE, ".").concat(ret);
        return "std.".concat(ret);
      }
      ErrorGenerator2.get_class_name = get_class_name;
      function empty(instance, method) {
        return new OutOfRange_1.OutOfRange("Error on ".concat(get_class_name(instance), ".").concat(method, "(): it's empty container."));
      }
      ErrorGenerator2.empty = empty;
      function negative_index(instance, method, index) {
        return new OutOfRange_1.OutOfRange("Error on ".concat(get_class_name(instance), ".").concat(method, "(): parametric index is negative -> (index = ").concat(index, ")."));
      }
      ErrorGenerator2.negative_index = negative_index;
      function excessive_index(instance, method, index, size) {
        return new OutOfRange_1.OutOfRange("Error on ".concat(get_class_name(instance), ".").concat(method, "(): parametric index is equal or greater than size -> (index = ").concat(index, ", size: ").concat(size, ")."));
      }
      ErrorGenerator2.excessive_index = excessive_index;
      function not_my_iterator(instance, method) {
        return new InvalidArgument_1.InvalidArgument("Error on ".concat(get_class_name(instance), ".").concat(method, "(): parametric iterator is not this container's own."));
      }
      ErrorGenerator2.not_my_iterator = not_my_iterator;
      function erased_iterator(instance, method) {
        return new InvalidArgument_1.InvalidArgument("Error on ".concat(get_class_name(instance), ".").concat(method, "(): parametric iterator, it already has been erased."));
      }
      ErrorGenerator2.erased_iterator = erased_iterator;
      function negative_iterator(instance, method, index) {
        return new OutOfRange_1.OutOfRange("Error on ".concat(get_class_name(instance), ".").concat(method, "(): parametric iterator is directing negative position -> (index = ").concat(index, ")."));
      }
      ErrorGenerator2.negative_iterator = negative_iterator;
      function iterator_end_value(instance, method) {
        if (method === void 0) {
          method = "end";
        }
        var className = get_class_name(instance);
        return new OutOfRange_1.OutOfRange("Error on ".concat(className, ".Iterator.value: cannot access to the ").concat(className, ".").concat(method, "().value."));
      }
      ErrorGenerator2.iterator_end_value = iterator_end_value;
      function key_nout_found(instance, method, key) {
        throw new OutOfRange_1.OutOfRange("Error on ".concat(get_class_name(instance), ".").concat(method, "(): unable to find the matched key -> ").concat(key));
      }
      ErrorGenerator2.key_nout_found = key_nout_found;
    })(ErrorGenerator = exports.ErrorGenerator || (exports.ErrorGenerator = {}));
  }
});

// node_modules/tstl/base/container/UniqueSet.js
var require_UniqueSet = __commonJS({
  "node_modules/tstl/base/container/UniqueSet.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UniqueSet = void 0;
    var SetContainer_1 = require_SetContainer();
    var ErrorGenerator_1 = require_ErrorGenerator();
    var UniqueSet = function(_super) {
      __extends(UniqueSet2, _super);
      function UniqueSet2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      UniqueSet2.prototype.count = function(key) {
        return this.find(key).equals(this.end()) ? 0 : 1;
      };
      UniqueSet2.prototype.insert = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return _super.prototype.insert.apply(this, __spreadArray([], __read(args), false));
      };
      UniqueSet2.prototype._Insert_by_range = function(first, last) {
        for (; !first.equals(last); first = first.next())
          this._Insert_by_key(first.value);
      };
      UniqueSet2.prototype.extract = function(param) {
        if (param instanceof this.end().constructor)
          return this._Extract_by_iterator(param);
        else
          return this._Extract_by_val(param);
      };
      UniqueSet2.prototype._Extract_by_val = function(key) {
        var it = this.find(key);
        if (it.equals(this.end()) === true)
          throw ErrorGenerator_1.ErrorGenerator.key_nout_found(this, "extract", key);
        this._Erase_by_range(it);
        return key;
      };
      UniqueSet2.prototype._Extract_by_iterator = function(it) {
        if (it.equals(this.end()) === true || this.has(it.value) === false)
          return this.end();
        this._Erase_by_range(it);
        return it;
      };
      UniqueSet2.prototype._Erase_by_val = function(key) {
        var it = this.find(key);
        if (it.equals(this.end()) === true)
          return 0;
        this._Erase_by_range(it);
        return 1;
      };
      UniqueSet2.prototype.merge = function(source) {
        for (var it = source.begin(); !it.equals(source.end()); ) {
          if (this.has(it.value) === false) {
            this.insert(it.value);
            it = source.erase(it);
          } else
            it = it.next();
        }
      };
      return UniqueSet2;
    }(SetContainer_1.SetContainer);
    exports.UniqueSet = UniqueSet;
  }
});

// node_modules/tstl/internal/container/associative/IAssociativeContainer.js
var require_IAssociativeContainer = __commonJS({
  "node_modules/tstl/internal/container/associative/IAssociativeContainer.js"(exports) {
    "use strict";
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IAssociativeContainer = void 0;
    var IAssociativeContainer;
    (function(IAssociativeContainer2) {
      function construct(source) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          args[_i - 1] = arguments[_i];
        }
        var ramda;
        var tail;
        if (args.length >= 1 && args[0] instanceof Array) {
          ramda = function() {
            var items = args[0];
            source.push.apply(source, __spreadArray([], __read(items), false));
          };
          tail = args.slice(1);
        } else if (args.length >= 2 && args[0].next instanceof Function && args[1].next instanceof Function) {
          ramda = function() {
            var first = args[0];
            var last = args[1];
            source.assign(first, last);
          };
          tail = args.slice(2);
        } else {
          ramda = null;
          tail = args;
        }
        return { ramda, tail };
      }
      IAssociativeContainer2.construct = construct;
    })(IAssociativeContainer = exports.IAssociativeContainer || (exports.IAssociativeContainer = {}));
  }
});

// node_modules/tstl/internal/Global.js
var require_Global = __commonJS({
  "node_modules/tstl/internal/Global.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._Get_root = void 0;
    var node_1 = require_node();
    function _Get_root() {
      if (__s_pRoot === null) {
        __s_pRoot = (0, node_1.is_node)() ? global : self;
        if (__s_pRoot.__s_iUID === void 0)
          __s_pRoot.__s_iUID = 0;
      }
      return __s_pRoot;
    }
    exports._Get_root = _Get_root;
    var __s_pRoot = null;
  }
});

// node_modules/tstl/functional/uid.js
var require_uid = __commonJS({
  "node_modules/tstl/functional/uid.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.get_uid = void 0;
    var Global_1 = require_Global();
    function get_uid(obj) {
      if (obj instanceof Object) {
        if (obj.hasOwnProperty("__get_m_iUID") === false) {
          var uid_1 = ++(0, Global_1._Get_root)().__s_iUID;
          Object.defineProperty(obj, "__get_m_iUID", {
            value: function() {
              return uid_1;
            }
          });
        }
        return obj.__get_m_iUID();
      } else if (obj === void 0)
        return -1;
      else
        return 0;
    }
    exports.get_uid = get_uid;
  }
});

// node_modules/tstl/functional/hash.js
var require_hash = __commonJS({
  "node_modules/tstl/functional/hash.js"(exports) {
    "use strict";
    var __values = exports && exports.__values || function(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m)
        return m.call(o);
      if (o && typeof o.length === "number")
        return {
          next: function() {
            if (o && i >= o.length)
              o = void 0;
            return { value: o && o[i++], done: !o };
          }
        };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hash = void 0;
    var uid_1 = require_uid();
    function hash() {
      var e_1, _a;
      var itemList = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        itemList[_i] = arguments[_i];
      }
      var ret = INIT_VALUE;
      try {
        for (var itemList_1 = __values(itemList), itemList_1_1 = itemList_1.next(); !itemList_1_1.done; itemList_1_1 = itemList_1.next()) {
          var item = itemList_1_1.value;
          item = item ? item.valueOf() : item;
          var type = typeof item;
          if (type === "boolean")
            ret = _Hash_boolean(item, ret);
          else if (type === "number" || type === "bigint")
            ret = _Hash_number(item, ret);
          else if (type === "string")
            ret = _Hash_string(item, ret);
          else if (item instanceof Object && item.hashCode instanceof Function) {
            var hashed = item.hashCode();
            if (itemList.length === 1)
              return hashed;
            else {
              ret = ret ^ hashed;
              ret *= MULTIPLIER;
            }
          } else
            ret = _Hash_number((0, uid_1.get_uid)(item), ret);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (itemList_1_1 && !itemList_1_1.done && (_a = itemList_1.return))
            _a.call(itemList_1);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
      return Math.abs(ret);
    }
    exports.hash = hash;
    function _Hash_boolean(val, ret) {
      ret ^= val ? 1 : 0;
      ret *= MULTIPLIER;
      return ret;
    }
    function _Hash_number(val, ret) {
      return _Hash_string(val.toString(), ret);
    }
    function _Hash_string(str, ret) {
      for (var i = 0; i < str.length; ++i) {
        ret ^= str.charCodeAt(i);
        ret *= MULTIPLIER;
      }
      return Math.abs(ret);
    }
    var INIT_VALUE = 2166136261;
    var MULTIPLIER = 16777619;
  }
});

// node_modules/tstl/functional/comparators.js
var require_comparators = __commonJS({
  "node_modules/tstl/functional/comparators.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.greater_equal = exports.greater = exports.less_equal = exports.less = exports.not_equal_to = exports.equal_to = void 0;
    var uid_1 = require_uid();
    function equal_to(x, y) {
      x = x ? x.valueOf() : x;
      y = y ? y.valueOf() : y;
      if (x instanceof Object && x.equals instanceof Function)
        return x.equals(y);
      else
        return x === y;
    }
    exports.equal_to = equal_to;
    function not_equal_to(x, y) {
      return !equal_to(x, y);
    }
    exports.not_equal_to = not_equal_to;
    function less(x, y) {
      x = x.valueOf();
      y = y.valueOf();
      if (x instanceof Object)
        if (x.less instanceof Function)
          return x.less(y);
        else
          return (0, uid_1.get_uid)(x) < (0, uid_1.get_uid)(y);
      else
        return x < y;
    }
    exports.less = less;
    function less_equal(x, y) {
      return less(x, y) || equal_to(x, y);
    }
    exports.less_equal = less_equal;
    function greater(x, y) {
      return !less_equal(x, y);
    }
    exports.greater = greater;
    function greater_equal(x, y) {
      return !less(x, y);
    }
    exports.greater_equal = greater_equal;
  }
});

// node_modules/tstl/internal/container/associative/IHashContainer.js
var require_IHashContainer = __commonJS({
  "node_modules/tstl/internal/container/associative/IHashContainer.js"(exports) {
    "use strict";
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IHashContainer = void 0;
    var IAssociativeContainer_1 = require_IAssociativeContainer();
    var hash_1 = require_hash();
    var comparators_1 = require_comparators();
    var IHashContainer;
    (function(IHashContainer2) {
      function construct(source, Source, bucketFactory) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
          args[_i - 3] = arguments[_i];
        }
        var post_process = null;
        var hash_function = hash_1.hash;
        var key_eq = comparators_1.equal_to;
        if (args.length === 1 && args[0] instanceof Source) {
          var container_1 = args[0];
          hash_function = container_1.hash_function();
          key_eq = container_1.key_eq();
          post_process = function() {
            var first = container_1.begin();
            var last = container_1.end();
            source.assign(first, last);
          };
        } else {
          var tuple = IAssociativeContainer_1.IAssociativeContainer.construct.apply(IAssociativeContainer_1.IAssociativeContainer, __spreadArray([source], __read(args), false));
          post_process = tuple.ramda;
          if (tuple.tail.length >= 1)
            hash_function = tuple.tail[0];
          if (tuple.tail.length >= 2)
            key_eq = tuple.tail[1];
        }
        bucketFactory(hash_function, key_eq);
        if (post_process !== null)
          post_process();
      }
      IHashContainer2.construct = construct;
    })(IHashContainer = exports.IHashContainer || (exports.IHashContainer = {}));
  }
});

// node_modules/tstl/internal/iterator/ListIterator.js
var require_ListIterator = __commonJS({
  "node_modules/tstl/internal/iterator/ListIterator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListIterator = void 0;
    var ErrorGenerator_1 = require_ErrorGenerator();
    var ListIterator = function() {
      function ListIterator2(prev, next, value) {
        this.prev_ = prev;
        this.next_ = next;
        this.value_ = value;
      }
      ListIterator2._Set_prev = function(it, prev) {
        it.prev_ = prev;
      };
      ListIterator2._Set_next = function(it, next) {
        it.next_ = next;
      };
      ListIterator2.prototype.prev = function() {
        return this.prev_;
      };
      ListIterator2.prototype.next = function() {
        return this.next_;
      };
      Object.defineProperty(ListIterator2.prototype, "value", {
        get: function() {
          this._Try_value();
          return this.value_;
        },
        enumerable: false,
        configurable: true
      });
      ListIterator2.prototype._Try_value = function() {
        if (this.value_ === void 0 && this.equals(this.source().end()) === true)
          throw ErrorGenerator_1.ErrorGenerator.iterator_end_value(this.source());
      };
      ListIterator2.prototype.equals = function(obj) {
        return this === obj;
      };
      return ListIterator2;
    }();
    exports.ListIterator = ListIterator;
  }
});

// node_modules/tstl/internal/iterator/disposable/Repeater.js
var require_Repeater = __commonJS({
  "node_modules/tstl/internal/iterator/disposable/Repeater.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Repeater = void 0;
    var Repeater = function() {
      function Repeater2(index, value) {
        this.index_ = index;
        this.value_ = value;
      }
      Repeater2.prototype.index = function() {
        return this.index_;
      };
      Object.defineProperty(Repeater2.prototype, "value", {
        get: function() {
          return this.value_;
        },
        enumerable: false,
        configurable: true
      });
      Repeater2.prototype.next = function() {
        ++this.index_;
        return this;
      };
      Repeater2.prototype.equals = function(obj) {
        return this.index_ === obj.index_;
      };
      return Repeater2;
    }();
    exports.Repeater = Repeater;
  }
});

// node_modules/tstl/iterator/global.js
var require_global = __commonJS({
  "node_modules/tstl/iterator/global.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.next = exports.prev = exports.advance = exports.distance = exports.size = exports.empty = void 0;
    var InvalidArgument_1 = require_InvalidArgument();
    function empty(source) {
      if (source instanceof Array)
        return source.length !== 0;
      else
        return source.empty();
    }
    exports.empty = empty;
    function size(source) {
      if (source instanceof Array)
        return source.length;
      else
        return source.size();
    }
    exports.size = size;
    function distance(first, last) {
      if (first.index instanceof Function)
        return _Distance_via_index(first, last);
      var ret = 0;
      for (; !first.equals(last); first = first.next())
        ++ret;
      return ret;
    }
    exports.distance = distance;
    function _Distance_via_index(first, last) {
      var x = first.index();
      var y = last.index();
      if (first.base instanceof Function)
        return x - y;
      else
        return y - x;
    }
    function advance(it, n) {
      if (n === 0)
        return it;
      else if (it.advance instanceof Function)
        return it.advance(n);
      var stepper;
      if (n < 0) {
        if (!(it.prev instanceof Function))
          throw new InvalidArgument_1.InvalidArgument("Error on std.advance(): parametric iterator is not a bi-directional iterator, thus advancing to negative direction is not possible.");
        stepper = function(it2) {
          return it2.prev();
        };
        n = -n;
      } else
        stepper = function(it2) {
          return it2.next();
        };
      while (n-- > 0)
        it = stepper(it);
      return it;
    }
    exports.advance = advance;
    function prev(it, n) {
      if (n === void 0) {
        n = 1;
      }
      if (n === 1)
        return it.prev();
      else
        return advance(it, -n);
    }
    exports.prev = prev;
    function next(it, n) {
      if (n === void 0) {
        n = 1;
      }
      if (n === 1)
        return it.next();
      else
        return advance(it, n);
    }
    exports.next = next;
  }
});

// node_modules/tstl/internal/container/linear/ListContainer.js
var require_ListContainer = __commonJS({
  "node_modules/tstl/internal/container/linear/ListContainer.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListContainer = void 0;
    var Container_1 = require_Container();
    var ListIterator_1 = require_ListIterator();
    var Repeater_1 = require_Repeater();
    var NativeArrayIterator_1 = require_NativeArrayIterator();
    var global_1 = require_global();
    var ErrorGenerator_1 = require_ErrorGenerator();
    var ListContainer = function(_super) {
      __extends(ListContainer2, _super);
      function ListContainer2() {
        var _this = _super.call(this) || this;
        _this.end_ = _this._Create_iterator(null, null);
        _this.clear();
        return _this;
      }
      ListContainer2.prototype.assign = function(par1, par2) {
        this.clear();
        this.insert(this.end(), par1, par2);
      };
      ListContainer2.prototype.clear = function() {
        ListIterator_1.ListIterator._Set_prev(this.end_, this.end_);
        ListIterator_1.ListIterator._Set_next(this.end_, this.end_);
        this.begin_ = this.end_;
        this.size_ = 0;
      };
      ListContainer2.prototype.resize = function(n) {
        var expansion = n - this.size();
        if (expansion > 0)
          this.insert(this.end(), expansion, void 0);
        else if (expansion < 0)
          this.erase((0, global_1.advance)(this.end(), -expansion), this.end());
      };
      ListContainer2.prototype.begin = function() {
        return this.begin_;
      };
      ListContainer2.prototype.end = function() {
        return this.end_;
      };
      ListContainer2.prototype.size = function() {
        return this.size_;
      };
      ListContainer2.prototype.push_front = function(val) {
        this.insert(this.begin_, val);
      };
      ListContainer2.prototype.push_back = function(val) {
        this.insert(this.end_, val);
      };
      ListContainer2.prototype.pop_front = function() {
        if (this.empty() === true)
          throw ErrorGenerator_1.ErrorGenerator.empty(this.end_.source().constructor.name, "pop_front");
        this.erase(this.begin_);
      };
      ListContainer2.prototype.pop_back = function() {
        if (this.empty() === true)
          throw ErrorGenerator_1.ErrorGenerator.empty(this.end_.source().constructor.name, "pop_back");
        this.erase(this.end_.prev());
      };
      ListContainer2.prototype.push = function() {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          items[_i] = arguments[_i];
        }
        if (items.length === 0)
          return this.size();
        var first = new NativeArrayIterator_1.NativeArrayIterator(items, 0);
        var last = new NativeArrayIterator_1.NativeArrayIterator(items, items.length);
        this._Insert_by_range(this.end(), first, last);
        return this.size();
      };
      ListContainer2.prototype.insert = function(pos) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          args[_i - 1] = arguments[_i];
        }
        if (pos.source() !== this.end_.source())
          throw ErrorGenerator_1.ErrorGenerator.not_my_iterator(this.end_.source(), "insert");
        else if (pos.erased_ === true)
          throw ErrorGenerator_1.ErrorGenerator.erased_iterator(this.end_.source(), "insert");
        if (args.length === 1)
          return this._Insert_by_repeating_val(pos, 1, args[0]);
        else if (args.length === 2 && typeof args[0] === "number")
          return this._Insert_by_repeating_val(pos, args[0], args[1]);
        else
          return this._Insert_by_range(pos, args[0], args[1]);
      };
      ListContainer2.prototype._Insert_by_repeating_val = function(position, n, val) {
        var first = new Repeater_1.Repeater(0, val);
        var last = new Repeater_1.Repeater(n);
        return this._Insert_by_range(position, first, last);
      };
      ListContainer2.prototype._Insert_by_range = function(position, begin, end) {
        var prev = position.prev();
        var first = null;
        var size = 0;
        for (var it = begin; it.equals(end) === false; it = it.next()) {
          var item = this._Create_iterator(prev, null, it.value);
          if (size === 0)
            first = item;
          ListIterator_1.ListIterator._Set_next(prev, item);
          prev = item;
          ++size;
        }
        if (position.equals(this.begin()) === true)
          this.begin_ = first;
        ListIterator_1.ListIterator._Set_next(prev, position);
        ListIterator_1.ListIterator._Set_prev(position, prev);
        this.size_ += size;
        return first;
      };
      ListContainer2.prototype.erase = function(first, last) {
        if (last === void 0) {
          last = first.next();
        }
        return this._Erase_by_range(first, last);
      };
      ListContainer2.prototype._Erase_by_range = function(first, last) {
        if (first.source() !== this.end_.source())
          throw ErrorGenerator_1.ErrorGenerator.not_my_iterator(this.end_.source(), "insert");
        else if (first.erased_ === true)
          throw ErrorGenerator_1.ErrorGenerator.erased_iterator(this.end_.source(), "insert");
        else if (first.equals(this.end_))
          return this.end_;
        var prev = first.prev();
        ListIterator_1.ListIterator._Set_next(prev, last);
        ListIterator_1.ListIterator._Set_prev(last, prev);
        for (var it = first; !it.equals(last); it = it.next()) {
          it.erased_ = true;
          --this.size_;
        }
        if (first.equals(this.begin_))
          this.begin_ = last;
        return last;
      };
      ListContainer2.prototype.swap = function(obj) {
        var _a, _b, _c;
        _a = __read([obj.begin_, this.begin_], 2), this.begin_ = _a[0], obj.begin_ = _a[1];
        _b = __read([obj.end_, this.end_], 2), this.end_ = _b[0], obj.end_ = _b[1];
        _c = __read([obj.size_, this.size_], 2), this.size_ = _c[0], obj.size_ = _c[1];
      };
      return ListContainer2;
    }(Container_1.Container);
    exports.ListContainer = ListContainer;
  }
});

// node_modules/tstl/internal/iterator/ReverseIterator.js
var require_ReverseIterator = __commonJS({
  "node_modules/tstl/internal/iterator/ReverseIterator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReverseIterator = void 0;
    var ReverseIterator = function() {
      function ReverseIterator2(base) {
        this.base_ = base.prev();
      }
      ReverseIterator2.prototype.source = function() {
        return this.base_.source();
      };
      ReverseIterator2.prototype.base = function() {
        return this.base_.next();
      };
      Object.defineProperty(ReverseIterator2.prototype, "value", {
        get: function() {
          return this.base_.value;
        },
        enumerable: false,
        configurable: true
      });
      ReverseIterator2.prototype.prev = function() {
        return this._Create_neighbor(this.base().next());
      };
      ReverseIterator2.prototype.next = function() {
        return this._Create_neighbor(this.base_);
      };
      ReverseIterator2.prototype.equals = function(obj) {
        return this.base_.equals(obj.base_);
      };
      return ReverseIterator2;
    }();
    exports.ReverseIterator = ReverseIterator;
  }
});

// node_modules/tstl/internal/container/associative/SetElementList.js
var require_SetElementList = __commonJS({
  "node_modules/tstl/internal/container/associative/SetElementList.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SetElementList = void 0;
    var ListContainer_1 = require_ListContainer();
    var ListIterator_1 = require_ListIterator();
    var ReverseIterator_1 = require_ReverseIterator();
    var SetElementList = function(_super) {
      __extends(SetElementList2, _super);
      function SetElementList2(associative) {
        var _this = _super.call(this) || this;
        _this.associative_ = associative;
        return _this;
      }
      SetElementList2.prototype._Create_iterator = function(prev, next, val) {
        return SetElementList2.Iterator.create(this, prev, next, val);
      };
      SetElementList2._Swap_associative = function(x, y) {
        var _a;
        _a = __read([y.associative_, x.associative_], 2), x.associative_ = _a[0], y.associative_ = _a[1];
      };
      SetElementList2.prototype.associative = function() {
        return this.associative_;
      };
      return SetElementList2;
    }(ListContainer_1.ListContainer);
    exports.SetElementList = SetElementList;
    (function(SetElementList2) {
      var Iterator = function(_super) {
        __extends(Iterator2, _super);
        function Iterator2(list, prev, next, val) {
          var _this = _super.call(this, prev, next, val) || this;
          _this.source_ = list;
          return _this;
        }
        Iterator2.create = function(list, prev, next, val) {
          return new Iterator2(list, prev, next, val);
        };
        Iterator2.prototype.reverse = function() {
          return new ReverseIterator(this);
        };
        Iterator2.prototype.source = function() {
          return this.source_.associative();
        };
        return Iterator2;
      }(ListIterator_1.ListIterator);
      SetElementList2.Iterator = Iterator;
      var ReverseIterator = function(_super) {
        __extends(ReverseIterator2, _super);
        function ReverseIterator2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        ReverseIterator2.prototype._Create_neighbor = function(base) {
          return new ReverseIterator2(base);
        };
        return ReverseIterator2;
      }(ReverseIterator_1.ReverseIterator);
      SetElementList2.ReverseIterator = ReverseIterator;
    })(SetElementList = exports.SetElementList || (exports.SetElementList = {}));
    exports.SetElementList = SetElementList;
  }
});

// node_modules/tstl/internal/hash/HashBuckets.js
var require_HashBuckets = __commonJS({
  "node_modules/tstl/internal/hash/HashBuckets.js"(exports) {
    "use strict";
    var __values = exports && exports.__values || function(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m)
        return m.call(o);
      if (o && typeof o.length === "number")
        return {
          next: function() {
            if (o && i >= o.length)
              o = void 0;
            return { value: o && o[i++], done: !o };
          }
        };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HashBuckets = void 0;
    var HashBuckets = function() {
      function HashBuckets2(fetcher, hasher) {
        this.fetcher_ = fetcher;
        this.hasher_ = hasher;
        this.max_load_factor_ = DEFAULT_MAX_FACTOR;
        this.data_ = [];
        this.size_ = 0;
        this.initialize();
      }
      HashBuckets2.prototype.clear = function() {
        this.data_ = [];
        this.size_ = 0;
        this.initialize();
      };
      HashBuckets2.prototype.rehash = function(length) {
        var e_1, _a, e_2, _b;
        length = Math.max(length, MIN_BUCKET_COUNT);
        var data = [];
        for (var i = 0; i < length; ++i)
          data.push([]);
        try {
          for (var _c = __values(this.data_), _d = _c.next(); !_d.done; _d = _c.next()) {
            var row = _d.value;
            try {
              for (var row_1 = (e_2 = void 0, __values(row)), row_1_1 = row_1.next(); !row_1_1.done; row_1_1 = row_1.next()) {
                var elem = row_1_1.value;
                var index = this.hasher_(this.fetcher_(elem)) % data.length;
                data[index].push(elem);
              }
            } catch (e_2_1) {
              e_2 = { error: e_2_1 };
            } finally {
              try {
                if (row_1_1 && !row_1_1.done && (_b = row_1.return))
                  _b.call(row_1);
              } finally {
                if (e_2)
                  throw e_2.error;
              }
            }
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_d && !_d.done && (_a = _c.return))
              _a.call(_c);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
        this.data_ = data;
      };
      HashBuckets2.prototype.reserve = function(length) {
        if (length > this.capacity()) {
          length = Math.floor(length / this.max_load_factor_);
          this.rehash(length);
        }
      };
      HashBuckets2.prototype.initialize = function() {
        for (var i = 0; i < MIN_BUCKET_COUNT; ++i)
          this.data_.push([]);
      };
      HashBuckets2.prototype.length = function() {
        return this.data_.length;
      };
      HashBuckets2.prototype.capacity = function() {
        return this.data_.length * this.max_load_factor_;
      };
      HashBuckets2.prototype.at = function(index) {
        return this.data_[index];
      };
      HashBuckets2.prototype.load_factor = function() {
        return this.size_ / this.length();
      };
      HashBuckets2.prototype.max_load_factor = function(z) {
        if (z === void 0) {
          z = null;
        }
        if (z === null)
          return this.max_load_factor_;
        else
          this.max_load_factor_ = z;
      };
      HashBuckets2.prototype.hash_function = function() {
        return this.hasher_;
      };
      HashBuckets2.prototype.index = function(elem) {
        return this.hasher_(this.fetcher_(elem)) % this.length();
      };
      HashBuckets2.prototype.insert = function(val) {
        var capacity = this.capacity();
        if (++this.size_ > capacity)
          this.reserve(capacity * 2);
        var index = this.index(val);
        this.data_[index].push(val);
      };
      HashBuckets2.prototype.erase = function(val) {
        var index = this.index(val);
        var bucket = this.data_[index];
        for (var i = 0; i < bucket.length; ++i)
          if (bucket[i] === val) {
            bucket.splice(i, 1);
            --this.size_;
            break;
          }
      };
      return HashBuckets2;
    }();
    exports.HashBuckets = HashBuckets;
    var MIN_BUCKET_COUNT = 10;
    var DEFAULT_MAX_FACTOR = 1;
  }
});

// node_modules/tstl/internal/hash/SetHashBuckets.js
var require_SetHashBuckets = __commonJS({
  "node_modules/tstl/internal/hash/SetHashBuckets.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __values = exports && exports.__values || function(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m)
        return m.call(o);
      if (o && typeof o.length === "number")
        return {
          next: function() {
            if (o && i >= o.length)
              o = void 0;
            return { value: o && o[i++], done: !o };
          }
        };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SetHashBuckets = void 0;
    var HashBuckets_1 = require_HashBuckets();
    var SetHashBuckets = function(_super) {
      __extends(SetHashBuckets2, _super);
      function SetHashBuckets2(source, hasher, pred) {
        var _this = _super.call(this, fetcher, hasher) || this;
        _this.source_ = source;
        _this.key_eq_ = pred;
        return _this;
      }
      SetHashBuckets2._Swap_source = function(x, y) {
        var _a;
        _a = __read([y.source_, x.source_], 2), x.source_ = _a[0], y.source_ = _a[1];
      };
      SetHashBuckets2.prototype.key_eq = function() {
        return this.key_eq_;
      };
      SetHashBuckets2.prototype.find = function(val) {
        var e_1, _a;
        var index = this.hash_function()(val) % this.length();
        var bucket = this.at(index);
        try {
          for (var bucket_1 = __values(bucket), bucket_1_1 = bucket_1.next(); !bucket_1_1.done; bucket_1_1 = bucket_1.next()) {
            var it = bucket_1_1.value;
            if (this.key_eq_(it.value, val))
              return it;
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (bucket_1_1 && !bucket_1_1.done && (_a = bucket_1.return))
              _a.call(bucket_1);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
        return this.source_.end();
      };
      return SetHashBuckets2;
    }(HashBuckets_1.HashBuckets);
    exports.SetHashBuckets = SetHashBuckets;
    function fetcher(elem) {
      return elem.value;
    }
  }
});

// node_modules/tstl/utility/Pair.js
var require_Pair = __commonJS({
  "node_modules/tstl/utility/Pair.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.make_pair = exports.Pair = void 0;
    var hash_1 = require_hash();
    var comparators_1 = require_comparators();
    var Pair = function() {
      function Pair2(first, second) {
        this.first = first;
        this.second = second;
      }
      Pair2.prototype.equals = function(pair) {
        return (0, comparators_1.equal_to)(this.first, pair.first) && (0, comparators_1.equal_to)(this.second, pair.second);
      };
      Pair2.prototype.less = function(pair) {
        if ((0, comparators_1.equal_to)(this.first, pair.first) === false)
          return (0, comparators_1.less)(this.first, pair.first);
        else
          return (0, comparators_1.less)(this.second, pair.second);
      };
      Pair2.prototype.hashCode = function() {
        return (0, hash_1.hash)(this.first, this.second);
      };
      return Pair2;
    }();
    exports.Pair = Pair;
    function make_pair(first, second) {
      return new Pair(first, second);
    }
    exports.make_pair = make_pair;
  }
});

// node_modules/tstl/container/HashSet.js
var require_HashSet = __commonJS({
  "node_modules/tstl/container/HashSet.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HashSet = void 0;
    var UniqueSet_1 = require_UniqueSet();
    var IHashContainer_1 = require_IHashContainer();
    var SetElementList_1 = require_SetElementList();
    var SetHashBuckets_1 = require_SetHashBuckets();
    var Pair_1 = require_Pair();
    var HashSet = function(_super) {
      __extends(HashSet2, _super);
      function HashSet2() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        var _this = _super.call(this, function(thisArg) {
          return new SetElementList_1.SetElementList(thisArg);
        }) || this;
        IHashContainer_1.IHashContainer.construct.apply(IHashContainer_1.IHashContainer, __spreadArray([
          _this,
          HashSet2,
          function(hash, pred) {
            _this.buckets_ = new SetHashBuckets_1.SetHashBuckets(_this, hash, pred);
          }
        ], __read(args), false));
        return _this;
      }
      HashSet2.prototype.clear = function() {
        this.buckets_.clear();
        _super.prototype.clear.call(this);
      };
      HashSet2.prototype.swap = function(obj) {
        var _a, _b;
        _a = __read([obj.data_, this.data_], 2), this.data_ = _a[0], obj.data_ = _a[1];
        SetElementList_1.SetElementList._Swap_associative(this.data_, obj.data_);
        SetHashBuckets_1.SetHashBuckets._Swap_source(this.buckets_, obj.buckets_);
        _b = __read([obj.buckets_, this.buckets_], 2), this.buckets_ = _b[0], obj.buckets_ = _b[1];
      };
      HashSet2.prototype.find = function(key) {
        return this.buckets_.find(key);
      };
      HashSet2.prototype.begin = function(index) {
        if (index === void 0) {
          index = null;
        }
        if (index === null)
          return _super.prototype.begin.call(this);
        else
          return this.buckets_.at(index)[0];
      };
      HashSet2.prototype.end = function(index) {
        if (index === void 0) {
          index = null;
        }
        if (index === null)
          return _super.prototype.end.call(this);
        else {
          var bucket = this.buckets_.at(index);
          return bucket[bucket.length - 1].next();
        }
      };
      HashSet2.prototype.rbegin = function(index) {
        if (index === void 0) {
          index = null;
        }
        return this.end(index).reverse();
      };
      HashSet2.prototype.rend = function(index) {
        if (index === void 0) {
          index = null;
        }
        return this.begin(index).reverse();
      };
      HashSet2.prototype.bucket_count = function() {
        return this.buckets_.length();
      };
      HashSet2.prototype.bucket_size = function(n) {
        return this.buckets_.at(n).length;
      };
      HashSet2.prototype.load_factor = function() {
        return this.buckets_.load_factor();
      };
      HashSet2.prototype.hash_function = function() {
        return this.buckets_.hash_function();
      };
      HashSet2.prototype.key_eq = function() {
        return this.buckets_.key_eq();
      };
      HashSet2.prototype.bucket = function(key) {
        return this.hash_function()(key) % this.buckets_.length();
      };
      HashSet2.prototype.max_load_factor = function(z) {
        if (z === void 0) {
          z = null;
        }
        return this.buckets_.max_load_factor(z);
      };
      HashSet2.prototype.reserve = function(n) {
        this.buckets_.reserve(n);
      };
      HashSet2.prototype.rehash = function(n) {
        this.buckets_.rehash(n);
      };
      HashSet2.prototype._Insert_by_key = function(key) {
        var it = this.find(key);
        if (it.equals(this.end()) === false)
          return new Pair_1.Pair(it, false);
        this.data_.push(key);
        it = it.prev();
        this._Handle_insert(it, it.next());
        return new Pair_1.Pair(it, true);
      };
      HashSet2.prototype._Insert_by_hint = function(hint, key) {
        var it = this.find(key);
        if (it.equals(this.end()) === true) {
          it = this.data_.insert(hint, key);
          this._Handle_insert(it, it.next());
        }
        return it;
      };
      HashSet2.prototype._Handle_insert = function(first, last) {
        for (; !first.equals(last); first = first.next())
          this.buckets_.insert(first);
      };
      HashSet2.prototype._Handle_erase = function(first, last) {
        for (; !first.equals(last); first = first.next())
          this.buckets_.erase(first);
      };
      return HashSet2;
    }(UniqueSet_1.UniqueSet);
    exports.HashSet = HashSet;
    (function(HashSet2) {
      HashSet2.Iterator = SetElementList_1.SetElementList.Iterator;
      HashSet2.ReverseIterator = SetElementList_1.SetElementList.ReverseIterator;
    })(HashSet = exports.HashSet || (exports.HashSet = {}));
    exports.HashSet = HashSet;
  }
});

// node_modules/tstl/base/container/MapContainer.js
var require_MapContainer = __commonJS({
  "node_modules/tstl/base/container/MapContainer.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MapContainer = void 0;
    var Container_1 = require_Container();
    var NativeArrayIterator_1 = require_NativeArrayIterator();
    var MapContainer = function(_super) {
      __extends(MapContainer2, _super);
      function MapContainer2(factory) {
        var _this = _super.call(this) || this;
        _this.data_ = factory(_this);
        return _this;
      }
      MapContainer2.prototype.assign = function(first, last) {
        this.clear();
        this.insert(first, last);
      };
      MapContainer2.prototype.clear = function() {
        this.data_.clear();
      };
      MapContainer2.prototype.begin = function() {
        return this.data_.begin();
      };
      MapContainer2.prototype.end = function() {
        return this.data_.end();
      };
      MapContainer2.prototype.has = function(key) {
        return !this.find(key).equals(this.end());
      };
      MapContainer2.prototype.size = function() {
        return this.data_.size();
      };
      MapContainer2.prototype.push = function() {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          items[_i] = arguments[_i];
        }
        var first = new NativeArrayIterator_1.NativeArrayIterator(items, 0);
        var last = new NativeArrayIterator_1.NativeArrayIterator(items, items.length);
        this.insert(first, last);
        return this.size();
      };
      MapContainer2.prototype.insert = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (args.length === 1)
          return this.emplace(args[0].first, args[0].second);
        else if (args[0].next instanceof Function && args[1].next instanceof Function)
          return this._Insert_by_range(args[0], args[1]);
        else
          return this.emplace_hint(args[0], args[1].first, args[1].second);
      };
      MapContainer2.prototype.erase = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (args.length === 1 && (args[0] instanceof this.end().constructor === false || args[0].source() !== this))
          return this._Erase_by_key(args[0]);
        else if (args.length === 1)
          return this._Erase_by_range(args[0]);
        else
          return this._Erase_by_range(args[0], args[1]);
      };
      MapContainer2.prototype._Erase_by_range = function(first, last) {
        if (last === void 0) {
          last = first.next();
        }
        var it = this.data_.erase(first, last);
        this._Handle_erase(first, last);
        return it;
      };
      return MapContainer2;
    }(Container_1.Container);
    exports.MapContainer = MapContainer;
  }
});

// node_modules/tstl/base/container/UniqueMap.js
var require_UniqueMap = __commonJS({
  "node_modules/tstl/base/container/UniqueMap.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UniqueMap = void 0;
    var MapContainer_1 = require_MapContainer();
    var ErrorGenerator_1 = require_ErrorGenerator();
    var UniqueMap = function(_super) {
      __extends(UniqueMap2, _super);
      function UniqueMap2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      UniqueMap2.prototype.count = function(key) {
        return this.find(key).equals(this.end()) ? 0 : 1;
      };
      UniqueMap2.prototype.get = function(key) {
        var it = this.find(key);
        if (it.equals(this.end()) === true)
          throw ErrorGenerator_1.ErrorGenerator.key_nout_found(this, "get", key);
        return it.second;
      };
      UniqueMap2.prototype.take = function(key, generator) {
        var it = this.find(key);
        return it.equals(this.end()) ? this.emplace(key, generator()).first.second : it.second;
      };
      UniqueMap2.prototype.set = function(key, val) {
        this.insert_or_assign(key, val);
      };
      UniqueMap2.prototype.insert = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return _super.prototype.insert.apply(this, __spreadArray([], __read(args), false));
      };
      UniqueMap2.prototype._Insert_by_range = function(first, last) {
        for (var it = first; !it.equals(last); it = it.next())
          this.emplace(it.value.first, it.value.second);
      };
      UniqueMap2.prototype.insert_or_assign = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (args.length === 2) {
          return this._Insert_or_assign_with_key_value(args[0], args[1]);
        } else if (args.length === 3) {
          return this._Insert_or_assign_with_hint(args[0], args[1], args[2]);
        }
      };
      UniqueMap2.prototype._Insert_or_assign_with_key_value = function(key, value) {
        var ret = this.emplace(key, value);
        if (ret.second === false)
          ret.first.second = value;
        return ret;
      };
      UniqueMap2.prototype._Insert_or_assign_with_hint = function(hint, key, value) {
        var ret = this.emplace_hint(hint, key, value);
        if (ret.second !== value)
          ret.second = value;
        return ret;
      };
      UniqueMap2.prototype.extract = function(param) {
        if (param instanceof this.end().constructor)
          return this._Extract_by_iterator(param);
        else
          return this._Extract_by_key(param);
      };
      UniqueMap2.prototype._Extract_by_key = function(key) {
        var it = this.find(key);
        if (it.equals(this.end()) === true)
          throw ErrorGenerator_1.ErrorGenerator.key_nout_found(this, "extract", key);
        var ret = it.value;
        this._Erase_by_range(it);
        return ret;
      };
      UniqueMap2.prototype._Extract_by_iterator = function(it) {
        if (it.equals(this.end()) === true)
          return this.end();
        this._Erase_by_range(it);
        return it;
      };
      UniqueMap2.prototype._Erase_by_key = function(key) {
        var it = this.find(key);
        if (it.equals(this.end()) === true)
          return 0;
        this._Erase_by_range(it);
        return 1;
      };
      UniqueMap2.prototype.merge = function(source) {
        for (var it = source.begin(); !it.equals(source.end()); )
          if (this.has(it.first) === false) {
            this.insert(it.value);
            it = source.erase(it);
          } else
            it = it.next();
      };
      return UniqueMap2;
    }(MapContainer_1.MapContainer);
    exports.UniqueMap = UniqueMap;
  }
});

// node_modules/tstl/internal/container/associative/MapElementList.js
var require_MapElementList = __commonJS({
  "node_modules/tstl/internal/container/associative/MapElementList.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MapElementList = void 0;
    var ListContainer_1 = require_ListContainer();
    var ListIterator_1 = require_ListIterator();
    var ReverseIterator_1 = require_ReverseIterator();
    var MapElementList = function(_super) {
      __extends(MapElementList2, _super);
      function MapElementList2(associative) {
        var _this = _super.call(this) || this;
        _this.associative_ = associative;
        return _this;
      }
      MapElementList2.prototype._Create_iterator = function(prev, next, val) {
        return MapElementList2.Iterator.create(this, prev, next, val);
      };
      MapElementList2._Swap_associative = function(x, y) {
        var _a;
        _a = __read([y.associative_, x.associative_], 2), x.associative_ = _a[0], y.associative_ = _a[1];
      };
      MapElementList2.prototype.associative = function() {
        return this.associative_;
      };
      return MapElementList2;
    }(ListContainer_1.ListContainer);
    exports.MapElementList = MapElementList;
    (function(MapElementList2) {
      var Iterator = function(_super) {
        __extends(Iterator2, _super);
        function Iterator2(list, prev, next, val) {
          var _this = _super.call(this, prev, next, val) || this;
          _this.list_ = list;
          return _this;
        }
        Iterator2.create = function(list, prev, next, val) {
          return new Iterator2(list, prev, next, val);
        };
        Iterator2.prototype.reverse = function() {
          return new ReverseIterator(this);
        };
        Iterator2.prototype.source = function() {
          return this.list_.associative();
        };
        Object.defineProperty(Iterator2.prototype, "first", {
          get: function() {
            return this.value.first;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Iterator2.prototype, "second", {
          get: function() {
            return this.value.second;
          },
          set: function(val) {
            this.value.second = val;
          },
          enumerable: false,
          configurable: true
        });
        return Iterator2;
      }(ListIterator_1.ListIterator);
      MapElementList2.Iterator = Iterator;
      var ReverseIterator = function(_super) {
        __extends(ReverseIterator2, _super);
        function ReverseIterator2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        ReverseIterator2.prototype._Create_neighbor = function(base) {
          return new ReverseIterator2(base);
        };
        Object.defineProperty(ReverseIterator2.prototype, "first", {
          get: function() {
            return this.base_.first;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(ReverseIterator2.prototype, "second", {
          get: function() {
            return this.base_.second;
          },
          set: function(val) {
            this.base_.second = val;
          },
          enumerable: false,
          configurable: true
        });
        return ReverseIterator2;
      }(ReverseIterator_1.ReverseIterator);
      MapElementList2.ReverseIterator = ReverseIterator;
    })(MapElementList = exports.MapElementList || (exports.MapElementList = {}));
    exports.MapElementList = MapElementList;
  }
});

// node_modules/tstl/internal/hash/MapHashBuckets.js
var require_MapHashBuckets = __commonJS({
  "node_modules/tstl/internal/hash/MapHashBuckets.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __values = exports && exports.__values || function(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m)
        return m.call(o);
      if (o && typeof o.length === "number")
        return {
          next: function() {
            if (o && i >= o.length)
              o = void 0;
            return { value: o && o[i++], done: !o };
          }
        };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MapHashBuckets = void 0;
    var HashBuckets_1 = require_HashBuckets();
    var MapHashBuckets = function(_super) {
      __extends(MapHashBuckets2, _super);
      function MapHashBuckets2(source, hasher, pred) {
        var _this = _super.call(this, fetcher, hasher) || this;
        _this.source_ = source;
        _this.key_eq_ = pred;
        return _this;
      }
      MapHashBuckets2._Swap_source = function(x, y) {
        var _a;
        _a = __read([y.source_, x.source_], 2), x.source_ = _a[0], y.source_ = _a[1];
      };
      MapHashBuckets2.prototype.key_eq = function() {
        return this.key_eq_;
      };
      MapHashBuckets2.prototype.find = function(key) {
        var e_1, _a;
        var index = this.hash_function()(key) % this.length();
        var bucket = this.at(index);
        try {
          for (var bucket_1 = __values(bucket), bucket_1_1 = bucket_1.next(); !bucket_1_1.done; bucket_1_1 = bucket_1.next()) {
            var it = bucket_1_1.value;
            if (this.key_eq_(it.first, key))
              return it;
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (bucket_1_1 && !bucket_1_1.done && (_a = bucket_1.return))
              _a.call(bucket_1);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
        return this.source_.end();
      };
      return MapHashBuckets2;
    }(HashBuckets_1.HashBuckets);
    exports.MapHashBuckets = MapHashBuckets;
    function fetcher(elem) {
      return elem.first;
    }
  }
});

// node_modules/tstl/utility/Entry.js
var require_Entry = __commonJS({
  "node_modules/tstl/utility/Entry.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Entry = void 0;
    var hash_1 = require_hash();
    var comparators_1 = require_comparators();
    var Entry = function() {
      function Entry2(first, second) {
        this.first = first;
        this.second = second;
      }
      Entry2.prototype.equals = function(obj) {
        return (0, comparators_1.equal_to)(this.first, obj.first);
      };
      Entry2.prototype.less = function(obj) {
        return (0, comparators_1.less)(this.first, obj.first);
      };
      Entry2.prototype.hashCode = function() {
        return (0, hash_1.hash)(this.first);
      };
      return Entry2;
    }();
    exports.Entry = Entry;
  }
});

// node_modules/tstl/container/HashMap.js
var require_HashMap = __commonJS({
  "node_modules/tstl/container/HashMap.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HashMap = void 0;
    var UniqueMap_1 = require_UniqueMap();
    var IHashContainer_1 = require_IHashContainer();
    var MapElementList_1 = require_MapElementList();
    var MapHashBuckets_1 = require_MapHashBuckets();
    var Entry_1 = require_Entry();
    var Pair_1 = require_Pair();
    var HashMap = function(_super) {
      __extends(HashMap2, _super);
      function HashMap2() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        var _this = _super.call(this, function(thisArg) {
          return new MapElementList_1.MapElementList(thisArg);
        }) || this;
        IHashContainer_1.IHashContainer.construct.apply(IHashContainer_1.IHashContainer, __spreadArray([
          _this,
          HashMap2,
          function(hash, pred) {
            _this.buckets_ = new MapHashBuckets_1.MapHashBuckets(_this, hash, pred);
          }
        ], __read(args), false));
        return _this;
      }
      HashMap2.prototype.clear = function() {
        this.buckets_.clear();
        _super.prototype.clear.call(this);
      };
      HashMap2.prototype.swap = function(obj) {
        var _a, _b;
        _a = __read([obj.data_, this.data_], 2), this.data_ = _a[0], obj.data_ = _a[1];
        MapElementList_1.MapElementList._Swap_associative(this.data_, obj.data_);
        MapHashBuckets_1.MapHashBuckets._Swap_source(this.buckets_, obj.buckets_);
        _b = __read([obj.buckets_, this.buckets_], 2), this.buckets_ = _b[0], obj.buckets_ = _b[1];
      };
      HashMap2.prototype.find = function(key) {
        return this.buckets_.find(key);
      };
      HashMap2.prototype.begin = function(index) {
        if (index === void 0) {
          index = null;
        }
        if (index === null)
          return _super.prototype.begin.call(this);
        else
          return this.buckets_.at(index)[0];
      };
      HashMap2.prototype.end = function(index) {
        if (index === void 0) {
          index = null;
        }
        if (index === null)
          return _super.prototype.end.call(this);
        else {
          var bucket = this.buckets_.at(index);
          return bucket[bucket.length - 1].next();
        }
      };
      HashMap2.prototype.rbegin = function(index) {
        if (index === void 0) {
          index = null;
        }
        return this.end(index).reverse();
      };
      HashMap2.prototype.rend = function(index) {
        if (index === void 0) {
          index = null;
        }
        return this.begin(index).reverse();
      };
      HashMap2.prototype.bucket_count = function() {
        return this.buckets_.length();
      };
      HashMap2.prototype.bucket_size = function(index) {
        return this.buckets_.at(index).length;
      };
      HashMap2.prototype.load_factor = function() {
        return this.buckets_.load_factor();
      };
      HashMap2.prototype.hash_function = function() {
        return this.buckets_.hash_function();
      };
      HashMap2.prototype.key_eq = function() {
        return this.buckets_.key_eq();
      };
      HashMap2.prototype.bucket = function(key) {
        return this.hash_function()(key) % this.buckets_.length();
      };
      HashMap2.prototype.max_load_factor = function(z) {
        if (z === void 0) {
          z = null;
        }
        return this.buckets_.max_load_factor(z);
      };
      HashMap2.prototype.reserve = function(n) {
        this.buckets_.reserve(n);
      };
      HashMap2.prototype.rehash = function(n) {
        this.buckets_.rehash(n);
      };
      HashMap2.prototype.emplace = function(key, val) {
        var it = this.find(key);
        if (it.equals(this.end()) === false)
          return new Pair_1.Pair(it, false);
        this.data_.push(new Entry_1.Entry(key, val));
        it = it.prev();
        this._Handle_insert(it, it.next());
        return new Pair_1.Pair(it, true);
      };
      HashMap2.prototype.emplace_hint = function(hint, key, val) {
        var it = this.find(key);
        if (it.equals(this.end()) === true) {
          it = this.data_.insert(hint, new Entry_1.Entry(key, val));
          this._Handle_insert(it, it.next());
        }
        return it;
      };
      HashMap2.prototype._Handle_insert = function(first, last) {
        for (; !first.equals(last); first = first.next())
          this.buckets_.insert(first);
      };
      HashMap2.prototype._Handle_erase = function(first, last) {
        for (; !first.equals(last); first = first.next())
          this.buckets_.erase(first);
      };
      return HashMap2;
    }(UniqueMap_1.UniqueMap);
    exports.HashMap = HashMap;
    (function(HashMap2) {
      HashMap2.Iterator = MapElementList_1.MapElementList.Iterator;
      HashMap2.ReverseIterator = MapElementList_1.MapElementList.ReverseIterator;
    })(HashMap = exports.HashMap || (exports.HashMap = {}));
    exports.HashMap = HashMap;
  }
});

// node_modules/websocket-polyfill/lib/events/EventTarget.js
var require_EventTarget2 = __commonJS({
  "node_modules/websocket-polyfill/lib/events/EventTarget.js"(exports) {
    "use strict";
    var __values = exports && exports.__values || function(o) {
      var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
      if (m)
        return m.call(o);
      return {
        next: function() {
          if (o && i >= o.length)
            o = void 0;
          return { value: o && o[i++], done: !o };
        }
      };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var HashSet_1 = require_HashSet();
    var HashMap_1 = require_HashMap();
    var EventTarget = function() {
      function EventTarget2() {
        this.listeners_ = new HashMap_1.HashMap();
        this.created_at_ = new Date();
      }
      EventTarget2.prototype.dispatchEvent = function(event) {
        var e_1, _a;
        var it = this.listeners_.find(event.type);
        if (it.equals(this.listeners_.end()))
          return;
        event.target = this;
        event.timeStamp = new Date().getTime() - this.created_at_.getTime();
        try {
          for (var _b = __values(it.second), _c = _b.next(); !_c.done; _c = _b.next()) {
            var listener = _c.value;
            listener(event);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return))
              _a.call(_b);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
      };
      EventTarget2.prototype.addEventListener = function(type, listener) {
        var it = this.listeners_.find(type);
        if (it.equals(this.listeners_.end()))
          it = this.listeners_.emplace(type, new HashSet_1.HashSet()).first;
        it.second.insert(listener);
      };
      EventTarget2.prototype.removeEventListener = function(type, listener) {
        var it = this.listeners_.find(type);
        if (it.equals(this.listeners_.end()))
          return;
        it.second.erase(listener);
        if (it.second.empty())
          this.listeners_.erase(it);
      };
      return EventTarget2;
    }();
    exports.EventTarget = EventTarget;
  }
});

// node_modules/websocket-polyfill/lib/events/Event.js
var require_Event2 = __commonJS({
  "node_modules/websocket-polyfill/lib/events/Event.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Event = function() {
      function Event2(type, init) {
        this.type = type;
        if (init)
          Object.assign(this, init);
      }
      return Event2;
    }();
    exports.Event = Event;
  }
});

// node_modules/websocket-polyfill/lib/events/CloseEvent.js
var require_CloseEvent = __commonJS({
  "node_modules/websocket-polyfill/lib/events/CloseEvent.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (b2.hasOwnProperty(p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", { value: true });
    var Event_1 = require_Event2();
    var CloseEvent = function(_super) {
      __extends(CloseEvent2, _super);
      function CloseEvent2(type, init) {
        return _super.call(this, type, init) || this;
      }
      return CloseEvent2;
    }(Event_1.Event);
    exports.CloseEvent = CloseEvent;
  }
});

// node_modules/websocket-polyfill/lib/events/MessageEvent.js
var require_MessageEvent = __commonJS({
  "node_modules/websocket-polyfill/lib/events/MessageEvent.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (b2.hasOwnProperty(p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", { value: true });
    var Event_1 = require_Event2();
    var MessageEvent = function(_super) {
      __extends(MessageEvent2, _super);
      function MessageEvent2(type, init) {
        return _super.call(this, type, init) || this;
      }
      return MessageEvent2;
    }(Event_1.Event);
    exports.MessageEvent = MessageEvent;
  }
});

// node_modules/websocket-polyfill/lib/events/ErrorEvent.js
var require_ErrorEvent = __commonJS({
  "node_modules/websocket-polyfill/lib/events/ErrorEvent.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (b2.hasOwnProperty(p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", { value: true });
    var Event_1 = require_Event2();
    var ErrorEvent = function(_super) {
      __extends(ErrorEvent2, _super);
      function ErrorEvent2(type, init) {
        return _super.call(this, type, init) || this;
      }
      return ErrorEvent2;
    }(Event_1.Event);
    exports.ErrorEvent = ErrorEvent;
  }
});

// node_modules/websocket-polyfill/lib/WebSocket.js
var require_WebSocket = __commonJS({
  "node_modules/websocket-polyfill/lib/WebSocket.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (b2.hasOwnProperty(p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var websocket_1 = require_websocket2();
    var EventTarget_1 = require_EventTarget2();
    var Event_1 = require_Event2();
    var CloseEvent_1 = require_CloseEvent();
    var MessageEvent_1 = require_MessageEvent();
    var ErrorEvent_1 = require_ErrorEvent();
    var WebSocket2 = function(_super) {
      __extends(WebSocket3, _super);
      function WebSocket3(url, protocols) {
        var _this = _super.call(this) || this;
        _this.on_ = {};
        _this.state_ = WebSocket3.CONNECTING;
        _this.client_ = new websocket_1.client();
        _this.client_.on("connect", _this._Handle_connect.bind(_this));
        _this.client_.on("connectFailed", _this._Handle_error.bind(_this));
        if (typeof protocols === "string")
          protocols = [protocols];
        _this.client_.connect(url, protocols);
        return _this;
      }
      WebSocket3.prototype.close = function(code, reason) {
        this.state_ = WebSocket3.CLOSING;
        if (code === void 0)
          this.connection_.sendCloseFrame();
        else
          this.connection_.sendCloseFrame(code, reason, true);
      };
      WebSocket3.prototype.send = function(data) {
        if (typeof data.valueOf() === "string")
          this.connection_.sendUTF(data);
        else {
          var buffer = void 0;
          if (data instanceof Buffer)
            buffer = data;
          else if (data instanceof Blob)
            buffer = new Buffer(data, "blob");
          else if (data.buffer)
            buffer = new Buffer(data.buffer);
          else
            buffer = new Buffer(data);
          this.connection_.sendBytes(buffer);
        }
      };
      Object.defineProperty(WebSocket3.prototype, "url", {
        get: function() {
          return this.client_.url.href;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WebSocket3.prototype, "protocol", {
        get: function() {
          return this.client_.protocols ? this.client_.protocols[0] : "";
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WebSocket3.prototype, "extensions", {
        get: function() {
          return this.connection_ && this.connection_.extensions ? this.connection_.extensions[0].name : "";
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WebSocket3.prototype, "readyState", {
        get: function() {
          return this.state_;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WebSocket3.prototype, "bufferedAmount", {
        get: function() {
          return this.connection_.bytesWaitingToFlush;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WebSocket3.prototype, "binaryType", {
        get: function() {
          return "arraybuffer";
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WebSocket3.prototype, "onopen", {
        get: function() {
          return this.on_.open;
        },
        set: function(listener) {
          this._Set_on("open", listener);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WebSocket3.prototype, "onclose", {
        get: function() {
          return this.on_.close;
        },
        set: function(listener) {
          this._Set_on("close", listener);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WebSocket3.prototype, "onmessage", {
        get: function() {
          return this.on_.message;
        },
        set: function(listener) {
          this._Set_on("message", listener);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WebSocket3.prototype, "onerror", {
        get: function() {
          return this.on_.error;
        },
        set: function(listener) {
          this._Set_on("error", listener);
        },
        enumerable: true,
        configurable: true
      });
      WebSocket3.prototype._Set_on = function(type, listener) {
        if (this.on_[type])
          this.removeEventListener(type, this.on_[type]);
        this.addEventListener(type, listener);
        this.on_[type] = listener;
      };
      WebSocket3.prototype._Handle_connect = function(connection) {
        this.connection_ = connection;
        this.state_ = WebSocket3.OPEN;
        this.connection_.on("message", this._Handle_message.bind(this));
        this.connection_.on("error", this._Handle_error.bind(this));
        this.connection_.on("close", this._Handle_close.bind(this));
        var event = new Event_1.Event("open", EVENT_INIT);
        this.dispatchEvent(event);
      };
      WebSocket3.prototype._Handle_close = function(code, reason) {
        var event = new CloseEvent_1.CloseEvent("close", __assign({}, EVENT_INIT, { code, reason }));
        this.state_ = WebSocket3.CLOSED;
        this.dispatchEvent(event);
      };
      WebSocket3.prototype._Handle_message = function(message) {
        var event = new MessageEvent_1.MessageEvent("message", __assign({}, EVENT_INIT, { data: message.binaryData ? message.binaryData : message.utf8Data }));
        this.dispatchEvent(event);
      };
      WebSocket3.prototype._Handle_error = function(error) {
        var event = new ErrorEvent_1.ErrorEvent("error", __assign({}, EVENT_INIT, { error, message: error.message }));
        if (this.state_ === WebSocket3.CONNECTING)
          this.state_ = WebSocket3.CLOSED;
        this.dispatchEvent(event);
      };
      return WebSocket3;
    }(EventTarget_1.EventTarget);
    exports.WebSocket = WebSocket2;
    (function(WebSocket3) {
      WebSocket3.CONNECTING = 0;
      WebSocket3.OPEN = 1;
      WebSocket3.CLOSING = 2;
      WebSocket3.CLOSED = 3;
    })(WebSocket2 = exports.WebSocket || (exports.WebSocket = {}));
    exports.WebSocket = WebSocket2;
    var EVENT_INIT = {
      bubbles: false,
      cancelable: false
    };
  }
});

// node_modules/websocket-polyfill/lib/index.js
var require_lib = __commonJS({
  "node_modules/websocket-polyfill/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var node_1 = require_node();
    if (node_1.is_node())
      global.WebSocket = require_WebSocket().WebSocket;
  }
});

// node_modules/create-hash/index.js
var require_create_hash = __commonJS({
  "node_modules/create-hash/index.js"(exports, module2) {
    module2.exports = require("crypto").createHash;
  }
});

// src/summariser.ts
var summariser_exports = {};
__export(summariser_exports, {
  default: () => Summariser
});
module.exports = __toCommonJS(summariser_exports);

// node_modules/@noble/secp256k1/lib/esm/index.js
var nodeCrypto = __toESM(require("crypto"), 1);
var _0n = BigInt(0);
var _1n = BigInt(1);
var _2n = BigInt(2);
var _3n = BigInt(3);
var _8n = BigInt(8);
var CURVE = Object.freeze({
  a: _0n,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: _1n,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
});
function weistrass(x) {
  const { a, b } = CURVE;
  const x2 = mod(x * x);
  const x3 = mod(x2 * x);
  return mod(x3 + a * x + b);
}
var USE_ENDOMORPHISM = CURVE.a === _0n;
var ShaError = class extends Error {
  constructor(message) {
    super(message);
  }
};
var JacobianPoint = class {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  static fromAffine(p) {
    if (!(p instanceof Point)) {
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    }
    return new JacobianPoint(p.x, p.y, _1n);
  }
  static toAffineBatch(points) {
    const toInv = invertBatch(points.map((p) => p.z));
    return points.map((p, i) => p.toAffine(toInv[i]));
  }
  static normalizeZ(points) {
    return JacobianPoint.toAffineBatch(points).map(JacobianPoint.fromAffine);
  }
  equals(other) {
    if (!(other instanceof JacobianPoint))
      throw new TypeError("JacobianPoint expected");
    const { x: X1, y: Y1, z: Z1 } = this;
    const { x: X2, y: Y2, z: Z2 } = other;
    const Z1Z1 = mod(Z1 * Z1);
    const Z2Z2 = mod(Z2 * Z2);
    const U1 = mod(X1 * Z2Z2);
    const U2 = mod(X2 * Z1Z1);
    const S1 = mod(mod(Y1 * Z2) * Z2Z2);
    const S2 = mod(mod(Y2 * Z1) * Z1Z1);
    return U1 === U2 && S1 === S2;
  }
  negate() {
    return new JacobianPoint(this.x, mod(-this.y), this.z);
  }
  double() {
    const { x: X1, y: Y1, z: Z1 } = this;
    const A = mod(X1 * X1);
    const B = mod(Y1 * Y1);
    const C = mod(B * B);
    const x1b = X1 + B;
    const D = mod(_2n * (mod(x1b * x1b) - A - C));
    const E = mod(_3n * A);
    const F = mod(E * E);
    const X3 = mod(F - _2n * D);
    const Y3 = mod(E * (D - X3) - _8n * C);
    const Z3 = mod(_2n * Y1 * Z1);
    return new JacobianPoint(X3, Y3, Z3);
  }
  add(other) {
    if (!(other instanceof JacobianPoint))
      throw new TypeError("JacobianPoint expected");
    const { x: X1, y: Y1, z: Z1 } = this;
    const { x: X2, y: Y2, z: Z2 } = other;
    if (X2 === _0n || Y2 === _0n)
      return this;
    if (X1 === _0n || Y1 === _0n)
      return other;
    const Z1Z1 = mod(Z1 * Z1);
    const Z2Z2 = mod(Z2 * Z2);
    const U1 = mod(X1 * Z2Z2);
    const U2 = mod(X2 * Z1Z1);
    const S1 = mod(mod(Y1 * Z2) * Z2Z2);
    const S2 = mod(mod(Y2 * Z1) * Z1Z1);
    const H = mod(U2 - U1);
    const r = mod(S2 - S1);
    if (H === _0n) {
      if (r === _0n) {
        return this.double();
      } else {
        return JacobianPoint.ZERO;
      }
    }
    const HH = mod(H * H);
    const HHH = mod(H * HH);
    const V = mod(U1 * HH);
    const X3 = mod(r * r - HHH - _2n * V);
    const Y3 = mod(r * (V - X3) - S1 * HHH);
    const Z3 = mod(Z1 * Z2 * H);
    return new JacobianPoint(X3, Y3, Z3);
  }
  subtract(other) {
    return this.add(other.negate());
  }
  multiplyUnsafe(scalar) {
    const P0 = JacobianPoint.ZERO;
    if (typeof scalar === "bigint" && scalar === _0n)
      return P0;
    let n = normalizeScalar(scalar);
    if (n === _1n)
      return this;
    if (!USE_ENDOMORPHISM) {
      let p = P0;
      let d2 = this;
      while (n > _0n) {
        if (n & _1n)
          p = p.add(d2);
        d2 = d2.double();
        n >>= _1n;
      }
      return p;
    }
    let { k1neg, k1, k2neg, k2 } = splitScalarEndo(n);
    let k1p = P0;
    let k2p = P0;
    let d = this;
    while (k1 > _0n || k2 > _0n) {
      if (k1 & _1n)
        k1p = k1p.add(d);
      if (k2 & _1n)
        k2p = k2p.add(d);
      d = d.double();
      k1 >>= _1n;
      k2 >>= _1n;
    }
    if (k1neg)
      k1p = k1p.negate();
    if (k2neg)
      k2p = k2p.negate();
    k2p = new JacobianPoint(mod(k2p.x * CURVE.beta), k2p.y, k2p.z);
    return k1p.add(k2p);
  }
  precomputeWindow(W) {
    const windows = USE_ENDOMORPHISM ? 128 / W + 1 : 256 / W + 1;
    const points = [];
    let p = this;
    let base = p;
    for (let window2 = 0; window2 < windows; window2++) {
      base = p;
      points.push(base);
      for (let i = 1; i < 2 ** (W - 1); i++) {
        base = base.add(p);
        points.push(base);
      }
      p = base.double();
    }
    return points;
  }
  wNAF(n, affinePoint) {
    if (!affinePoint && this.equals(JacobianPoint.BASE))
      affinePoint = Point.BASE;
    const W = affinePoint && affinePoint._WINDOW_SIZE || 1;
    if (256 % W) {
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    }
    let precomputes = affinePoint && pointPrecomputes.get(affinePoint);
    if (!precomputes) {
      precomputes = this.precomputeWindow(W);
      if (affinePoint && W !== 1) {
        precomputes = JacobianPoint.normalizeZ(precomputes);
        pointPrecomputes.set(affinePoint, precomputes);
      }
    }
    let p = JacobianPoint.ZERO;
    let f = JacobianPoint.ZERO;
    const windows = 1 + (USE_ENDOMORPHISM ? 128 / W : 256 / W);
    const windowSize = 2 ** (W - 1);
    const mask = BigInt(2 ** W - 1);
    const maxNumber = 2 ** W;
    const shiftBy = BigInt(W);
    for (let window2 = 0; window2 < windows; window2++) {
      const offset = window2 * windowSize;
      let wbits = Number(n & mask);
      n >>= shiftBy;
      if (wbits > windowSize) {
        wbits -= maxNumber;
        n += _1n;
      }
      if (wbits === 0) {
        let pr = precomputes[offset];
        if (window2 % 2)
          pr = pr.negate();
        f = f.add(pr);
      } else {
        let cached = precomputes[offset + Math.abs(wbits) - 1];
        if (wbits < 0)
          cached = cached.negate();
        p = p.add(cached);
      }
    }
    return { p, f };
  }
  multiply(scalar, affinePoint) {
    let n = normalizeScalar(scalar);
    let point;
    let fake;
    if (USE_ENDOMORPHISM) {
      const { k1neg, k1, k2neg, k2 } = splitScalarEndo(n);
      let { p: k1p, f: f1p } = this.wNAF(k1, affinePoint);
      let { p: k2p, f: f2p } = this.wNAF(k2, affinePoint);
      if (k1neg)
        k1p = k1p.negate();
      if (k2neg)
        k2p = k2p.negate();
      k2p = new JacobianPoint(mod(k2p.x * CURVE.beta), k2p.y, k2p.z);
      point = k1p.add(k2p);
      fake = f1p.add(f2p);
    } else {
      const { p, f } = this.wNAF(n, affinePoint);
      point = p;
      fake = f;
    }
    return JacobianPoint.normalizeZ([point, fake])[0];
  }
  toAffine(invZ = invert(this.z)) {
    const { x, y, z } = this;
    const iz1 = invZ;
    const iz2 = mod(iz1 * iz1);
    const iz3 = mod(iz2 * iz1);
    const ax = mod(x * iz2);
    const ay = mod(y * iz3);
    const zz = mod(z * iz1);
    if (zz !== _1n)
      throw new Error("invZ was invalid");
    return new Point(ax, ay);
  }
};
JacobianPoint.BASE = new JacobianPoint(CURVE.Gx, CURVE.Gy, _1n);
JacobianPoint.ZERO = new JacobianPoint(_0n, _1n, _0n);
var pointPrecomputes = /* @__PURE__ */ new WeakMap();
var Point = class {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  _setWindowSize(windowSize) {
    this._WINDOW_SIZE = windowSize;
    pointPrecomputes.delete(this);
  }
  hasEvenY() {
    return this.y % _2n === _0n;
  }
  static fromCompressedHex(bytes) {
    const isShort = bytes.length === 32;
    const x = bytesToNumber(isShort ? bytes : bytes.subarray(1));
    if (!isValidFieldElement(x))
      throw new Error("Point is not on curve");
    const y2 = weistrass(x);
    let y = sqrtMod(y2);
    const isYOdd = (y & _1n) === _1n;
    if (isShort) {
      if (isYOdd)
        y = mod(-y);
    } else {
      const isFirstByteOdd = (bytes[0] & 1) === 1;
      if (isFirstByteOdd !== isYOdd)
        y = mod(-y);
    }
    const point = new Point(x, y);
    point.assertValidity();
    return point;
  }
  static fromUncompressedHex(bytes) {
    const x = bytesToNumber(bytes.subarray(1, 33));
    const y = bytesToNumber(bytes.subarray(33, 65));
    const point = new Point(x, y);
    point.assertValidity();
    return point;
  }
  static fromHex(hex) {
    const bytes = ensureBytes(hex);
    const len = bytes.length;
    const header = bytes[0];
    if (len === 32 || len === 33 && (header === 2 || header === 3)) {
      return this.fromCompressedHex(bytes);
    }
    if (len === 65 && header === 4)
      return this.fromUncompressedHex(bytes);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-33 compressed bytes or 65 uncompressed bytes, not ${len}`);
  }
  static fromPrivateKey(privateKey) {
    return Point.BASE.multiply(normalizePrivateKey(privateKey));
  }
  static fromSignature(msgHash, signature, recovery) {
    msgHash = ensureBytes(msgHash);
    const h = truncateHash(msgHash);
    const { r, s } = normalizeSignature(signature);
    if (recovery !== 0 && recovery !== 1) {
      throw new Error("Cannot recover signature: invalid recovery bit");
    }
    const prefix = recovery & 1 ? "03" : "02";
    const R = Point.fromHex(prefix + numTo32bStr(r));
    const { n } = CURVE;
    const rinv = invert(r, n);
    const u1 = mod(-h * rinv, n);
    const u2 = mod(s * rinv, n);
    const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2);
    if (!Q)
      throw new Error("Cannot recover signature: point at infinify");
    Q.assertValidity();
    return Q;
  }
  toRawBytes(isCompressed = false) {
    return hexToBytes(this.toHex(isCompressed));
  }
  toHex(isCompressed = false) {
    const x = numTo32bStr(this.x);
    if (isCompressed) {
      const prefix = this.hasEvenY() ? "02" : "03";
      return `${prefix}${x}`;
    } else {
      return `04${x}${numTo32bStr(this.y)}`;
    }
  }
  toHexX() {
    return this.toHex(true).slice(2);
  }
  toRawX() {
    return this.toRawBytes(true).slice(1);
  }
  assertValidity() {
    const msg = "Point is not on elliptic curve";
    const { x, y } = this;
    if (!isValidFieldElement(x) || !isValidFieldElement(y))
      throw new Error(msg);
    const left = mod(y * y);
    const right = weistrass(x);
    if (mod(left - right) !== _0n)
      throw new Error(msg);
  }
  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
  negate() {
    return new Point(this.x, mod(-this.y));
  }
  double() {
    return JacobianPoint.fromAffine(this).double().toAffine();
  }
  add(other) {
    return JacobianPoint.fromAffine(this).add(JacobianPoint.fromAffine(other)).toAffine();
  }
  subtract(other) {
    return this.add(other.negate());
  }
  multiply(scalar) {
    return JacobianPoint.fromAffine(this).multiply(scalar, this).toAffine();
  }
  multiplyAndAddUnsafe(Q, a, b) {
    const P = JacobianPoint.fromAffine(this);
    const aP = a === _0n || a === _1n || this !== Point.BASE ? P.multiplyUnsafe(a) : P.multiply(a);
    const bQ = JacobianPoint.fromAffine(Q).multiplyUnsafe(b);
    const sum = aP.add(bQ);
    return sum.equals(JacobianPoint.ZERO) ? void 0 : sum.toAffine();
  }
};
Point.BASE = new Point(CURVE.Gx, CURVE.Gy);
Point.ZERO = new Point(_0n, _0n);
function sliceDER(s) {
  return Number.parseInt(s[0], 16) >= 8 ? "00" + s : s;
}
function parseDERInt(data) {
  if (data.length < 2 || data[0] !== 2) {
    throw new Error(`Invalid signature integer tag: ${bytesToHex(data)}`);
  }
  const len = data[1];
  const res = data.subarray(2, len + 2);
  if (!len || res.length !== len) {
    throw new Error(`Invalid signature integer: wrong length`);
  }
  if (res[0] === 0 && res[1] <= 127) {
    throw new Error("Invalid signature integer: trailing length");
  }
  return { data: bytesToNumber(res), left: data.subarray(len + 2) };
}
function parseDERSignature(data) {
  if (data.length < 2 || data[0] != 48) {
    throw new Error(`Invalid signature tag: ${bytesToHex(data)}`);
  }
  if (data[1] !== data.length - 2) {
    throw new Error("Invalid signature: incorrect length");
  }
  const { data: r, left: sBytes } = parseDERInt(data.subarray(2));
  const { data: s, left: rBytesLeft } = parseDERInt(sBytes);
  if (rBytesLeft.length) {
    throw new Error(`Invalid signature: left bytes after parsing: ${bytesToHex(rBytesLeft)}`);
  }
  return { r, s };
}
var Signature = class {
  constructor(r, s) {
    this.r = r;
    this.s = s;
    this.assertValidity();
  }
  static fromCompact(hex) {
    const arr = hex instanceof Uint8Array;
    const name = "Signature.fromCompact";
    if (typeof hex !== "string" && !arr)
      throw new TypeError(`${name}: Expected string or Uint8Array`);
    const str = arr ? bytesToHex(hex) : hex;
    if (str.length !== 128)
      throw new Error(`${name}: Expected 64-byte hex`);
    return new Signature(hexToNumber(str.slice(0, 64)), hexToNumber(str.slice(64, 128)));
  }
  static fromDER(hex) {
    const arr = hex instanceof Uint8Array;
    if (typeof hex !== "string" && !arr)
      throw new TypeError(`Signature.fromDER: Expected string or Uint8Array`);
    const { r, s } = parseDERSignature(arr ? hex : hexToBytes(hex));
    return new Signature(r, s);
  }
  static fromHex(hex) {
    return this.fromDER(hex);
  }
  assertValidity() {
    const { r, s } = this;
    if (!isWithinCurveOrder(r))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!isWithinCurveOrder(s))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const HALF = CURVE.n >> _1n;
    return this.s > HALF;
  }
  normalizeS() {
    return this.hasHighS() ? new Signature(this.r, CURVE.n - this.s) : this;
  }
  toDERRawBytes(isCompressed = false) {
    return hexToBytes(this.toDERHex(isCompressed));
  }
  toDERHex(isCompressed = false) {
    const sHex = sliceDER(numberToHexUnpadded(this.s));
    if (isCompressed)
      return sHex;
    const rHex = sliceDER(numberToHexUnpadded(this.r));
    const rLen = numberToHexUnpadded(rHex.length / 2);
    const sLen = numberToHexUnpadded(sHex.length / 2);
    const length = numberToHexUnpadded(rHex.length / 2 + sHex.length / 2 + 4);
    return `30${length}02${rLen}${rHex}02${sLen}${sHex}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return hexToBytes(this.toCompactHex());
  }
  toCompactHex() {
    return numTo32bStr(this.r) + numTo32bStr(this.s);
  }
};
function concatBytes(...arrays) {
  if (!arrays.every((b) => b instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (arrays.length === 1)
    return arrays[0];
  const length = arrays.reduce((a, arr) => a + arr.length, 0);
  const result = new Uint8Array(length);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const arr = arrays[i];
    result.set(arr, pad);
    pad += arr.length;
  }
  return result;
}
var hexes = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, "0"));
function bytesToHex(uint8a) {
  if (!(uint8a instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let hex = "";
  for (let i = 0; i < uint8a.length; i++) {
    hex += hexes[uint8a[i]];
  }
  return hex;
}
var POW_2_256 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function numTo32bStr(num) {
  if (typeof num !== "bigint")
    throw new Error("Expected bigint");
  if (!(_0n <= num && num < POW_2_256))
    throw new Error("Expected number < 2^256");
  return num.toString(16).padStart(64, "0");
}
function numTo32b(num) {
  const b = hexToBytes(numTo32bStr(num));
  if (b.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return b;
}
function numberToHexUnpadded(num) {
  const hex = num.toString(16);
  return hex.length & 1 ? `0${hex}` : hex;
}
function hexToNumber(hex) {
  if (typeof hex !== "string") {
    throw new TypeError("hexToNumber: expected string, got " + typeof hex);
  }
  return BigInt(`0x${hex}`);
}
function hexToBytes(hex) {
  if (typeof hex !== "string") {
    throw new TypeError("hexToBytes: expected string, got " + typeof hex);
  }
  if (hex.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + hex.length);
  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < array.length; i++) {
    const j = i * 2;
    const hexByte = hex.slice(j, j + 2);
    const byte = Number.parseInt(hexByte, 16);
    if (Number.isNaN(byte) || byte < 0)
      throw new Error("Invalid byte sequence");
    array[i] = byte;
  }
  return array;
}
function bytesToNumber(bytes) {
  return hexToNumber(bytesToHex(bytes));
}
function ensureBytes(hex) {
  return hex instanceof Uint8Array ? Uint8Array.from(hex) : hexToBytes(hex);
}
function normalizeScalar(num) {
  if (typeof num === "number" && Number.isSafeInteger(num) && num > 0)
    return BigInt(num);
  if (typeof num === "bigint" && isWithinCurveOrder(num))
    return num;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function mod(a, b = CURVE.P) {
  const result = a % b;
  return result >= _0n ? result : b + result;
}
function pow2(x, power) {
  const { P } = CURVE;
  let res = x;
  while (power-- > _0n) {
    res *= res;
    res %= P;
  }
  return res;
}
function sqrtMod(x) {
  const { P } = CURVE;
  const _6n = BigInt(6);
  const _11n = BigInt(11);
  const _22n = BigInt(22);
  const _23n = BigInt(23);
  const _44n = BigInt(44);
  const _88n = BigInt(88);
  const b2 = x * x * x % P;
  const b3 = b2 * b2 * x % P;
  const b6 = pow2(b3, _3n) * b3 % P;
  const b9 = pow2(b6, _3n) * b3 % P;
  const b11 = pow2(b9, _2n) * b2 % P;
  const b22 = pow2(b11, _11n) * b11 % P;
  const b44 = pow2(b22, _22n) * b22 % P;
  const b88 = pow2(b44, _44n) * b44 % P;
  const b176 = pow2(b88, _88n) * b88 % P;
  const b220 = pow2(b176, _44n) * b44 % P;
  const b223 = pow2(b220, _3n) * b3 % P;
  const t1 = pow2(b223, _23n) * b22 % P;
  const t2 = pow2(t1, _6n) * b2 % P;
  return pow2(t2, _2n);
}
function invert(number, modulo = CURVE.P) {
  if (number === _0n || modulo <= _0n) {
    throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
  }
  let a = mod(number, modulo);
  let b = modulo;
  let x = _0n, y = _1n, u = _1n, v = _0n;
  while (a !== _0n) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd = b;
  if (gcd !== _1n)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function invertBatch(nums, p = CURVE.P) {
  const scratch = new Array(nums.length);
  const lastMultiplied = nums.reduce((acc, num, i) => {
    if (num === _0n)
      return acc;
    scratch[i] = acc;
    return mod(acc * num, p);
  }, _1n);
  const inverted = invert(lastMultiplied, p);
  nums.reduceRight((acc, num, i) => {
    if (num === _0n)
      return acc;
    scratch[i] = mod(acc * scratch[i], p);
    return mod(acc * num, p);
  }, inverted);
  return scratch;
}
var divNearest = (a, b) => (a + b / _2n) / b;
var ENDO = {
  a1: BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
  b1: -_1n * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"),
  a2: BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),
  b2: BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
  POW_2_128: BigInt("0x100000000000000000000000000000000")
};
function splitScalarEndo(k) {
  const { n } = CURVE;
  const { a1, b1, a2, b2, POW_2_128 } = ENDO;
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
    throw new Error("splitScalarEndo: Endomorphism failed, k=" + k);
  }
  return { k1neg, k1, k2neg, k2 };
}
function truncateHash(hash) {
  const { n } = CURVE;
  const byteLength = hash.length;
  const delta = byteLength * 8 - 256;
  let h = bytesToNumber(hash);
  if (delta > 0)
    h = h >> BigInt(delta);
  if (h >= n)
    h -= n;
  return h;
}
var _sha256Sync;
var _hmacSha256Sync;
function isWithinCurveOrder(num) {
  return _0n < num && num < CURVE.n;
}
function isValidFieldElement(num) {
  return _0n < num && num < CURVE.P;
}
function normalizePrivateKey(key) {
  let num;
  if (typeof key === "bigint") {
    num = key;
  } else if (typeof key === "number" && Number.isSafeInteger(key) && key > 0) {
    num = BigInt(key);
  } else if (typeof key === "string") {
    if (key.length !== 64)
      throw new Error("Expected 32 bytes of private key");
    num = hexToNumber(key);
  } else if (key instanceof Uint8Array) {
    if (key.length !== 32)
      throw new Error("Expected 32 bytes of private key");
    num = bytesToNumber(key);
  } else {
    throw new TypeError("Expected valid private key");
  }
  if (!isWithinCurveOrder(num))
    throw new Error("Expected private key: 0 < key < n");
  return num;
}
function normalizePublicKey(publicKey) {
  if (publicKey instanceof Point) {
    publicKey.assertValidity();
    return publicKey;
  } else {
    return Point.fromHex(publicKey);
  }
}
function normalizeSignature(signature) {
  if (signature instanceof Signature) {
    signature.assertValidity();
    return signature;
  }
  try {
    return Signature.fromDER(signature);
  } catch (error) {
    return Signature.fromCompact(signature);
  }
}
function schnorrChallengeFinalize(ch) {
  return mod(bytesToNumber(ch), CURVE.n);
}
var SchnorrSignature = class {
  constructor(r, s) {
    this.r = r;
    this.s = s;
    this.assertValidity();
  }
  static fromHex(hex) {
    const bytes = ensureBytes(hex);
    if (bytes.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${bytes.length}`);
    const r = bytesToNumber(bytes.subarray(0, 32));
    const s = bytesToNumber(bytes.subarray(32, 64));
    return new SchnorrSignature(r, s);
  }
  assertValidity() {
    const { r, s } = this;
    if (!isValidFieldElement(r) || !isWithinCurveOrder(s))
      throw new Error("Invalid signature");
  }
  toHex() {
    return numTo32bStr(this.r) + numTo32bStr(this.s);
  }
  toRawBytes() {
    return hexToBytes(this.toHex());
  }
};
function schnorrGetPublicKey(privateKey) {
  return Point.fromPrivateKey(privateKey).toRawX();
}
var InternalSchnorrSignature = class {
  constructor(message, privateKey, auxRand = utils.randomBytes()) {
    if (message == null)
      throw new TypeError(`sign: Expected valid message, not "${message}"`);
    this.m = ensureBytes(message);
    const { x, scalar } = this.getScalar(normalizePrivateKey(privateKey));
    this.px = x;
    this.d = scalar;
    this.rand = ensureBytes(auxRand);
    if (this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(priv) {
    const point = Point.fromPrivateKey(priv);
    const scalar = point.hasEvenY() ? priv : CURVE.n - priv;
    return { point, scalar, x: point.toRawX() };
  }
  initNonce(d, t0h) {
    return numTo32b(d ^ bytesToNumber(t0h));
  }
  finalizeNonce(k0h) {
    const k0 = mod(bytesToNumber(k0h), CURVE.n);
    if (k0 === _0n)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: R, x: rx, scalar: k } = this.getScalar(k0);
    return { R, rx, k };
  }
  finalizeSig(R, k, e, d) {
    return new SchnorrSignature(R.x, mod(k + e * d, CURVE.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m, d, px, rand } = this;
    const tag = utils.taggedHash;
    const t = this.initNonce(d, await tag(TAGS.aux, rand));
    const { R, rx, k } = this.finalizeNonce(await tag(TAGS.nonce, t, px, m));
    const e = schnorrChallengeFinalize(await tag(TAGS.challenge, rx, px, m));
    const sig = this.finalizeSig(R, k, e, d);
    if (!await schnorrVerify(sig, m, px))
      this.error();
    return sig;
  }
  calcSync() {
    const { m, d, px, rand } = this;
    const tag = utils.taggedHashSync;
    const t = this.initNonce(d, tag(TAGS.aux, rand));
    const { R, rx, k } = this.finalizeNonce(tag(TAGS.nonce, t, px, m));
    const e = schnorrChallengeFinalize(tag(TAGS.challenge, rx, px, m));
    const sig = this.finalizeSig(R, k, e, d);
    if (!schnorrVerifySync(sig, m, px))
      this.error();
    return sig;
  }
};
async function schnorrSign(msg, privKey, auxRand) {
  return new InternalSchnorrSignature(msg, privKey, auxRand).calc();
}
function schnorrSignSync(msg, privKey, auxRand) {
  return new InternalSchnorrSignature(msg, privKey, auxRand).calcSync();
}
function initSchnorrVerify(signature, message, publicKey) {
  const raw = signature instanceof SchnorrSignature;
  const sig = raw ? signature : SchnorrSignature.fromHex(signature);
  if (raw)
    sig.assertValidity();
  return {
    ...sig,
    m: ensureBytes(message),
    P: normalizePublicKey(publicKey)
  };
}
function finalizeSchnorrVerify(r, P, s, e) {
  const R = Point.BASE.multiplyAndAddUnsafe(P, normalizePrivateKey(s), mod(-e, CURVE.n));
  if (!R || !R.hasEvenY() || R.x !== r)
    return false;
  return true;
}
async function schnorrVerify(signature, message, publicKey) {
  try {
    const { r, s, m, P } = initSchnorrVerify(signature, message, publicKey);
    const e = schnorrChallengeFinalize(await utils.taggedHash(TAGS.challenge, numTo32b(r), P.toRawX(), m));
    return finalizeSchnorrVerify(r, P, s, e);
  } catch (error) {
    return false;
  }
}
function schnorrVerifySync(signature, message, publicKey) {
  try {
    const { r, s, m, P } = initSchnorrVerify(signature, message, publicKey);
    const e = schnorrChallengeFinalize(utils.taggedHashSync(TAGS.challenge, numTo32b(r), P.toRawX(), m));
    return finalizeSchnorrVerify(r, P, s, e);
  } catch (error) {
    if (error instanceof ShaError)
      throw error;
    return false;
  }
}
var schnorr = {
  Signature: SchnorrSignature,
  getPublicKey: schnorrGetPublicKey,
  sign: schnorrSign,
  verify: schnorrVerify,
  signSync: schnorrSignSync,
  verifySync: schnorrVerifySync
};
Point.BASE._setWindowSize(8);
var crypto = {
  node: nodeCrypto,
  web: typeof self === "object" && "crypto" in self ? self.crypto : void 0
};
var TAGS = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
};
var TAGGED_HASH_PREFIXES = {};
var utils = {
  bytesToHex,
  hexToBytes,
  concatBytes,
  mod,
  invert,
  isValidPrivateKey(privateKey) {
    try {
      normalizePrivateKey(privateKey);
      return true;
    } catch (error) {
      return false;
    }
  },
  _bigintTo32Bytes: numTo32b,
  _normalizePrivateKey: normalizePrivateKey,
  hashToPrivateKey: (hash) => {
    hash = ensureBytes(hash);
    if (hash.length < 40 || hash.length > 1024)
      throw new Error("Expected 40-1024 bytes of private key as per FIPS 186");
    const num = mod(bytesToNumber(hash), CURVE.n - _1n) + _1n;
    return numTo32b(num);
  },
  randomBytes: (bytesLength = 32) => {
    if (crypto.web) {
      return crypto.web.getRandomValues(new Uint8Array(bytesLength));
    } else if (crypto.node) {
      const { randomBytes } = crypto.node;
      return Uint8Array.from(randomBytes(bytesLength));
    } else {
      throw new Error("The environment doesn't have randomBytes function");
    }
  },
  randomPrivateKey: () => {
    return utils.hashToPrivateKey(utils.randomBytes(40));
  },
  sha256: async (...messages) => {
    if (crypto.web) {
      const buffer = await crypto.web.subtle.digest("SHA-256", concatBytes(...messages));
      return new Uint8Array(buffer);
    } else if (crypto.node) {
      const { createHash: createHash2 } = crypto.node;
      const hash = createHash2("sha256");
      messages.forEach((m) => hash.update(m));
      return Uint8Array.from(hash.digest());
    } else {
      throw new Error("The environment doesn't have sha256 function");
    }
  },
  hmacSha256: async (key, ...messages) => {
    if (crypto.web) {
      const ckey = await crypto.web.subtle.importKey("raw", key, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
      const message = concatBytes(...messages);
      const buffer = await crypto.web.subtle.sign("HMAC", ckey, message);
      return new Uint8Array(buffer);
    } else if (crypto.node) {
      const { createHmac } = crypto.node;
      const hash = createHmac("sha256", key);
      messages.forEach((m) => hash.update(m));
      return Uint8Array.from(hash.digest());
    } else {
      throw new Error("The environment doesn't have hmac-sha256 function");
    }
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (tag, ...messages) => {
    let tagP = TAGGED_HASH_PREFIXES[tag];
    if (tagP === void 0) {
      const tagH = await utils.sha256(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
      tagP = concatBytes(tagH, tagH);
      TAGGED_HASH_PREFIXES[tag] = tagP;
    }
    return utils.sha256(tagP, ...messages);
  },
  taggedHashSync: (tag, ...messages) => {
    if (typeof _sha256Sync !== "function")
      throw new ShaError("sha256Sync is undefined, you need to set it");
    let tagP = TAGGED_HASH_PREFIXES[tag];
    if (tagP === void 0) {
      const tagH = _sha256Sync(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
      tagP = concatBytes(tagH, tagH);
      TAGGED_HASH_PREFIXES[tag] = tagP;
    }
    return _sha256Sync(tagP, ...messages);
  },
  precompute(windowSize = 8, point = Point.BASE) {
    const cached = point === Point.BASE ? point : new Point(point.x, point.y);
    cached._setWindowSize(windowSize);
    cached.multiply(_3n);
    return cached;
  }
};
Object.defineProperties(utils, {
  sha256Sync: {
    configurable: false,
    get() {
      return _sha256Sync;
    },
    set(val) {
      if (!_sha256Sync)
        _sha256Sync = val;
    }
  },
  hmacSha256Sync: {
    configurable: false,
    get() {
      return _hmacSha256Sync;
    },
    set(val) {
      if (!_hmacSha256Sync)
        _hmacSha256Sync = val;
    }
  }
});

// node_modules/nostr-tools/relay.js
var import_websocket_polyfill = __toESM(require_lib(), 1);

// node_modules/nostr-tools/event.js
var import_buffer = require("buffer");
var import_create_hash = __toESM(require_create_hash(), 1);
function serializeEvent(evt) {
  return JSON.stringify([
    0,
    evt.pubkey,
    evt.created_at,
    evt.kind,
    evt.tags,
    evt.content
  ]);
}
function getEventHash(event) {
  let eventHash = (0, import_create_hash.default)("sha256").update(import_buffer.Buffer.from(serializeEvent(event))).digest();
  return import_buffer.Buffer.from(eventHash).toString("hex");
}
function validateEvent(event) {
  if (event.id !== getEventHash(event))
    return false;
  if (typeof event.content !== "string")
    return false;
  if (typeof event.created_at !== "number")
    return false;
  if (!Array.isArray(event.tags))
    return false;
  for (let i = 0; i < event.tags.length; i++) {
    let tag = event.tags[i];
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
  return schnorr.verify(event.sig, event.id, event.pubkey);
}
async function signEvent(event, key) {
  return import_buffer.Buffer.from(
    await schnorr.sign(getEventHash(event), key)
  ).toString("hex");
}

// node_modules/nostr-tools/filter.js
function matchFilter(filter, event) {
  if (filter.ids && filter.ids.indexOf(event.id) === -1)
    return false;
  if (filter.kinds && filter.kinds.indexOf(event.kind) === -1)
    return false;
  if (filter.authors && filter.authors.indexOf(event.pubkey) === -1)
    return false;
  for (let f in filter) {
    if (f[0] === "#") {
      if (filter[f] && !event.tags.find(
        ([t, v]) => t === f.slice(1) && filter[f].indexOf(v) !== -1
      ))
        return false;
    }
  }
  if (filter.since && event.created_at < filter.since)
    return false;
  if (filter.until && event.created_at >= filter.until)
    return false;
  return true;
}
function matchFilters(filters, event) {
  for (let i = 0; i < filters.length; i++) {
    if (matchFilter(filters[i], event))
      return true;
  }
  return false;
}

// node_modules/nostr-tools/relay.js
function normalizeRelayURL(url) {
  let [host, ...qs] = url.trim().split("?");
  if (host.slice(0, 4) === "http")
    host = "ws" + host.slice(4);
  if (host.slice(0, 2) !== "ws")
    host = "wss://" + host;
  if (host.length && host[host.length - 1] === "/")
    host = host.slice(0, -1);
  return [host, ...qs].join("?");
}
function relayConnect(url, onNotice = () => {
}, onError = () => {
}) {
  url = normalizeRelayURL(url);
  var ws, resolveOpen, untilOpen, wasClosed;
  var openSubs = {};
  var isSetToSkipVerification = {};
  let attemptNumber = 1;
  let nextAttemptSeconds = 1;
  function resetOpenState() {
    untilOpen = new Promise((resolve) => {
      resolveOpen = resolve;
    });
  }
  var eventListeners = {};
  var eoseListeners = {};
  function connect() {
    ws = new WebSocket(url);
    ws.onopen = () => {
      console.log("connected to", url);
      resolveOpen();
      if (wasClosed) {
        wasClosed = false;
        for (let channel in openSubs) {
          let filters = openSubs[channel];
          let eventCb = eventListeners[channel];
          let eoseCb = eoseListeners[channel];
          sub({ eventCb, filter: filters }, channel, eoseCb);
        }
      }
    };
    ws.onerror = (err) => {
      console.log("error connecting to relay", url);
      onError(err);
    };
    ws.onclose = () => {
      resetOpenState();
      attemptNumber++;
      nextAttemptSeconds += attemptNumber ** 3;
      if (nextAttemptSeconds > 14400) {
        nextAttemptSeconds = 14400;
      }
      console.log(
        `relay ${url} connection closed. reconnecting in ${nextAttemptSeconds} seconds.`
      );
      setTimeout(async () => {
        try {
          connect();
        } catch (err) {
        }
      }, nextAttemptSeconds * 1e3);
      wasClosed = true;
    };
    ws.onmessage = async (e) => {
      var data;
      try {
        data = JSON.parse(e.data);
      } catch (err) {
        data = e.data;
      }
      if (data.length >= 1) {
        switch (data[0]) {
          case "NOTICE":
            if (data.length != 2) {
              return;
            }
            console.log(`message from relay ${url}: ${data[1]}`);
            onNotice(data[1]);
            return;
          case "EOSE":
            if (data.length != 2) {
              return;
            }
            console.log(`Channel ${data[1]}: End-of-stored-events`);
            if (eoseListeners[data[1]]) {
              eoseListeners[data[1]]();
            }
            return;
          case "EVENT":
            if (data.length != 3) {
              return;
            }
            let channel = data[1];
            let event = data[2];
            if (validateEvent(event) && (isSetToSkipVerification[channel] || verifySignature(event)) && eventListeners[channel] && matchFilters(openSubs[channel], event)) {
              eventListeners[channel](event);
            }
            return;
        }
      }
    };
  }
  resetOpenState();
  try {
    connect();
  } catch (err) {
  }
  async function trySend(params) {
    let msg = JSON.stringify(params);
    await untilOpen;
    ws.send(msg);
  }
  const sub = ({ cb, filter, beforeSend, skipVerification }, channel = Math.random().toString().slice(2), eoseCb) => {
    var filters = [];
    if (Array.isArray(filter)) {
      filters = filter;
    } else {
      filters.push(filter);
    }
    if (beforeSend) {
      const beforeSendResult = beforeSend({ filter, relay: url, channel });
      filters = beforeSendResult.filter;
    }
    trySend(["REQ", channel, ...filters]);
    eventListeners[channel] = cb;
    eoseListeners[channel] = eoseCb;
    openSubs[channel] = filters;
    isSetToSkipVerification[channel] = skipVerification;
    const activeCallback = cb;
    const activeFilters = filters;
    const activeBeforeSend = beforeSend;
    return {
      sub: ({
        cb: cb2 = activeCallback,
        filter: filter2 = activeFilters,
        beforeSend: beforeSend2 = activeBeforeSend
      }) => sub({ cb: cb2, filter: filter2, beforeSend: beforeSend2, skipVerification }, channel),
      unsub: () => {
        delete openSubs[channel];
        delete eventListeners[channel];
        delete eoseListeners[channel];
        delete isSetToSkipVerification[channel];
        trySend(["CLOSE", channel]);
      }
    };
  };
  return {
    url,
    sub,
    async publish(event, statusCallback) {
      try {
        await trySend(["EVENT", event]);
        if (statusCallback) {
          statusCallback(0);
          let { unsub } = sub(
            {
              cb: () => {
                statusCallback(1);
                unsub();
                clearTimeout(willUnsub);
              },
              filter: { ids: [event.id] }
            },
            `monitor-${event.id.slice(0, 5)}`
          );
          let willUnsub = setTimeout(unsub, 5e3);
        }
      } catch (err) {
        if (statusCallback)
          statusCallback(-1);
      }
    },
    close() {
      ws.close();
    },
    get status() {
      return ws.readyState;
    }
  };
}

// node_modules/nostr-tools/pool.js
function relayPool() {
  var globalPrivateKey;
  var globalSigningFunction;
  const poolPolicy = {
    randomChoice: null,
    wait: false
  };
  const relays = {};
  const noticeCallbacks = [];
  function propagateNotice(notice, relayURL) {
    for (let i = 0; i < noticeCallbacks.length; i++) {
      let { relay } = relays[relayURL];
      noticeCallbacks[i](notice, relay);
    }
  }
  const activeSubscriptions = {};
  const sub = ({ cb, filter, beforeSend }, id, cbEose) => {
    if (!id)
      id = Math.random().toString().slice(2);
    const subControllers = Object.fromEntries(
      Object.values(relays).filter(({ policy }) => policy.read).map(({ relay }) => [
        relay.url,
        relay.sub(
          { cb: (event) => cb(event, relay.url), filter, beforeSend },
          id,
          cbEose
        )
      ])
    );
    const activeCallback = cb;
    const activeFilters = filter;
    const activeBeforeSend = beforeSend;
    const unsub = () => {
      Object.values(subControllers).forEach((sub3) => sub3.unsub());
      delete activeSubscriptions[id];
    };
    const sub2 = ({
      cb: cb2 = activeCallback,
      filter: filter2 = activeFilters,
      beforeSend: beforeSend2 = activeBeforeSend
    }) => {
      Object.entries(subControllers).map(([relayURL, sub3]) => [
        relayURL,
        sub3.sub({ cb: (event) => cb2(event, relayURL), filter: filter2, beforeSend: beforeSend2 }, id)
      ]);
      return activeSubscriptions[id];
    };
    const addRelay = (relay) => {
      subControllers[relay.url] = relay.sub(
        { cb: (event) => cb(event, relay.url), filter, beforeSend },
        id,
        () => cbEose(relay.url)
      );
      return activeSubscriptions[id];
    };
    const removeRelay = (relayURL) => {
      if (relayURL in subControllers) {
        subControllers[relayURL].unsub();
        if (Object.keys(subControllers).length === 0)
          unsub();
      }
      return activeSubscriptions[id];
    };
    activeSubscriptions[id] = {
      sub: sub2,
      unsub,
      addRelay,
      removeRelay
    };
    return activeSubscriptions[id];
  };
  return {
    sub,
    relays,
    setPrivateKey(privateKey) {
      globalPrivateKey = privateKey;
    },
    registerSigningFunction(fn) {
      globalSigningFunction = fn;
    },
    setPolicy(key, value) {
      poolPolicy[key] = value;
    },
    addRelay(url, policy = { read: true, write: true }) {
      let relayURL = normalizeRelayURL(url);
      if (relayURL in relays)
        return;
      let relay = relayConnect(url, (notice) => {
        propagateNotice(notice, relayURL);
      });
      relays[relayURL] = { relay, policy };
      if (policy.read) {
        Object.values(activeSubscriptions).forEach(
          (subscription) => subscription.addRelay(relay)
        );
      }
      return relay;
    },
    removeRelay(url) {
      let relayURL = normalizeRelayURL(url);
      let data = relays[relayURL];
      if (!data)
        return;
      let { relay } = data;
      Object.values(activeSubscriptions).forEach(
        (subscription) => subscription.removeRelay(relay)
      );
      relay.close();
      delete relays[relayURL];
    },
    onNotice(cb) {
      noticeCallbacks.push(cb);
    },
    offNotice(cb) {
      let index = noticeCallbacks.indexOf(cb);
      if (index !== -1)
        noticeCallbacks.splice(index, 1);
    },
    async publish(event, statusCallback) {
      event.id = getEventHash(event);
      if (!event.sig) {
        event.tags = event.tags || [];
        if (globalPrivateKey) {
          event.sig = await signEvent(event, globalPrivateKey);
        } else if (globalSigningFunction) {
          event.sig = await globalSigningFunction(event);
          if (!event.sig) {
            return;
          } else {
            if (!await verifySignature(event))
              throw new Error(
                "signature provided by custom signing function is invalid."
              );
          }
        } else {
          throw new Error(
            "can't publish unsigned event. either sign this event beforehand, provide a signing function or pass a private key while initializing this relay pool so it can be signed automatically."
          );
        }
      }
      let writeable = Object.values(relays).filter(({ policy }) => policy.write).sort(() => Math.random() - 0.5);
      let maxTargets = poolPolicy.randomChoice ? poolPolicy.randomChoice : writeable.length;
      let successes = 0;
      if (poolPolicy.wait) {
        for (let i = 0; i < writeable.length; i++) {
          let { relay } = writeable[i];
          try {
            await new Promise(async (resolve, reject) => {
              try {
                await relay.publish(event, (status) => {
                  if (statusCallback)
                    statusCallback(status, relay.url);
                  resolve();
                });
              } catch (err) {
                if (statusCallback)
                  statusCallback(-1, relay.url);
              }
            });
            successes++;
            if (successes >= maxTargets) {
              break;
            }
          } catch (err) {
          }
        }
      } else {
        writeable.forEach(async ({ relay }) => {
          let callback = statusCallback ? (status) => statusCallback(status, relay.url) : null;
          relay.publish(event, callback);
        });
      }
      return event;
    }
  };
}

// src/summariser.ts
var Summariser = class {
  opinions;
  pool;
  trustedAuthors;
  constructor({
    relay,
    trustedAuthors
  }) {
    this.opinions = {};
    this.pool = relayPool();
    this.pool.addRelay(relay, { read: true, write: false });
    this.trustedAuthors = trustedAuthors;
  }
  onReady = () => new Promise((resolve) => {
    const sub = this.pool.sub(
      {
        cb: (event, relay) => {
          var _a;
          const d = event.tags.find((tag) => tag[0] === "d")[1];
          this.opinions[d] = [...((_a = this.opinions) == null ? void 0 : _a[d]) || [], event];
        },
        filter: {
          kinds: [30234],
          authors: this.trustedAuthors
        }
      },
      null,
      () => {
        sub.unsub();
        resolve();
      }
    );
  });
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
