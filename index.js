/**
 * Turns a value into a json compatible object.
 * 
 * @param {*} value 
 * @returns {object}
 */
function parse(value) {
  if (typeof value === 'string') {
    return JSON.parse(value);
  }

  return parse(JSON.stringify(value));
}

/**
 * Projects key value pairs from a collection into an array. Collections are arrays or objects.
 * 
 * @param {(array|object)} collection 
 * @param {function} fn
 * @returns {array}
 */
function map(collection, fn) {
  if (Array.isArray(collection)) {
    return collection.map(fn);
  }

  return Object.keys(collection).map(key => fn(collection[key], key, collection));
}

/**
 * Determines if a value is a collection type. An array or object.
 * 
 * @param {*} value
 * @returns {boolean}
 */
function isCollection(value) {
  if (value == null) {
    return false;
  }

  return Array.isArray(value) || typeof value === 'object';
}

/**
 * Safely concats a source array to a target array.
 * 
 * @param {array} target 
 * @param {array} source 
 */
function append(target, source) {
  source.forEach((element) => {
    target.push(element);
  });
}

/**
 * Iterates over an object returing a path/value tuple of each element.
 * 
 * @param {*} object
 * @returns {{ path: string[], value: * }[]}
 */
function digest(object) {
  var queue = [{ path: [], value: object }];
  var result = [];

  while (queue.length > 0) {
    var node = queue.shift();
    var value = node.value;
    var path = node.path

    if (isCollection(value)) {
      append(queue, map(value, (v, k) => ({ path: path.concat(k), value: v })));
    } else {
      result.push(node);
    }
  }

  return result;
}

/**
 * Projects an array of digested tuples into a flat object.
 * 
 * @param {{ path: string[], value: * }[]} digestArray 
 * @param {function} keySelector 
 * @return {object}
 */
function toObject(digestArray, keySelector) {
  var result = {};

  for (var index = 0; index < digestArray.length; index++) {
    var element = digestArray[index];
    var key = element.path.join('.');
    
    result[key] = element.value;
  }

  return result;
}

/**
 * Converts value into a module source string.
 * 
 * @param {*} value
 * @returns {string}
 */
function toSource(value) {
  return `module.exports = ${JSON.stringify(value)}`;
}

/**
 * Loader entry point.
 * 
 * @param {*} content
 * @returns {string}
 */
function loader(content) {
  if (this.cachable) {
    this.cachable();
  }

  var value = toObject(digest(parse(content)));
  this.value = value;
  
  return toSource(value);
}

module.exports = loader;
