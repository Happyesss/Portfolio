const path = require('path');
const React = require(path.join(process.env.INIT_CWD || process.cwd(), 'node_modules', 'react'));

if (typeof React.cache !== 'function') {
  React.cache = function cache(fn) {
    const root = new Map();

    return function cached(...args) {
      let node = root;
      for (const arg of args) {
        let next = node.get(arg);
        if (!next) {
          next = new Map();
          node.set(arg, next);
        }
        node = next;
      }

      if (node.has('__result')) {
        return node.get('__result');
      }

      const result = fn.apply(this, args);
      node.set('__result', result);
      return result;
    };
  };
}

module.exports = React;
