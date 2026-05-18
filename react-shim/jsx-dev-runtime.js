const path = require('path');
module.exports = require(path.join(process.env.INIT_CWD || process.cwd(), 'node_modules', 'react', 'jsx-dev-runtime.js'));
