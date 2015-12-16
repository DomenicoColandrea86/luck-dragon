
'use strict';

/**
 * Module dependencies.
 */
import chalk 	from 'chalk';
import http 	from 'http';
import logger from './server/logging/logger';
const port = 4242;

export const start = () => {

	// Init the express application
	const app = require('./server/index')();

	// Get port from environment and store in Express.
	app.set('port', port);

	// Create HTTP server.
	const server = http.createServer(app);
	server.listen(port);
	server.on('error', onError);
	server.on('listening', logStartMessages);

	// Error Message Handlers
	function onError(error) {
		// log error
		logger.error(new Error(error), error.message);

		// handle specific listen errors with friendly messages
		if (error.errno === 'EADDRINUSE') {
			console.error(
				'(EADDRINUSE) Cannot start ' + "server" + '.',
				'Port ' + port + ' is already in use by another program.'
			);
		} else {
			console.error(
				'(Code: ' + error.errno + ')',
				'There was an error starting your server.',
				'Please use the error code above to search for a solution.'
			);
		}
		process.exit(-1);
	}

	// Startup & Shutdown messages
	function logStartMessages() {
		console.log(
			chalk.green("The server" + ' has been started...'),
			'\nYour application is now available on',
			'http://localhost' + ':' + port,
			chalk.gray('\nCtrl+C to shut down')
		);

		function shutdown() {
			console.log(chalk.red('\n' + "Server" + ' has shut down'));
			console.log(
				'\n' + "Server" + ' was running for',
				Math.round(process.uptime()),
				'seconds'
			);
			process.exit(0);
		}

		// ensure service exits correctly on Ctrl+C and SIGTERM
		process.
			removeAllListeners('SIGINT').on('SIGINT', shutdown).
			removeAllListeners('SIGTERM').on('SIGTERM', shutdown);
	}
};
