
// Hooks into babel to transpile all ES6 code to ES5 on require()
require('babel/register');

// Start server
require('./server.js').start();
