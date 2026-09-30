function createDebug(namespace = '') {
  const noop = () => {};
  noop.namespace = namespace;
  noop.enabled = false;
  noop.log = noop;
  noop.destroy = () => {};
  noop.extend = function extend(subNamespace, delimiter) {
    const sep = delimiter === undefined ? ':' : delimiter;
    return createDebug(`${namespace}${sep}${subNamespace}`);
  };
  return noop;
}

createDebug.debug = createDebug;
createDebug.default = createDebug;
createDebug.enable = () => createDebug;
createDebug.disable = () => createDebug;
createDebug.enabled = () => false;
createDebug.coerce = (value) => value;
createDebug.names = [];
createDebug.skips = [];
createDebug.namespaces = '';

module.exports = createDebug;
