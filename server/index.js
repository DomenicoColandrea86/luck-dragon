
'use strict';

/**
 * Module dependencies.
 */
import webpack          from 'webpack';
import _                from 'lodash';
import express          from 'express';
import bodyParser       from 'body-parser';
import methodOverride   from 'method-override';
import helmet           from 'helmet';
import FalcorServer     from 'falcor-express';
import routes           from './routes';
import logger           from './logging/logger';
import webpackConfig    from '../webpack.config';

const mainApp = function mainApp() {

    // create express app
    let app = express();

    // CORS
    app.all('/*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
        if (req.method === 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });

    // express middleware
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Use helmet to secure Express headers
    app.use(helmet.xframe());
    app.use(helmet.iexss());
    app.use(helmet.contentTypeOptions());
    app.use(helmet.ienoopen());
    app.disable('x-powered-by');

    // set up Falcor routes
    app.use(routes.apiBaseUri + '/model.json', FalcorServer.dataSourceRoute((req, res) => {
        // Passing in the user ID, this should be retrieved via some auth system
        return routes.falcor('1');
    }));

    // setup webpack
    let compiler = webpack(webpackConfig);
    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    }));

    app.use(require('webpack-hot-middleware')(compiler));

    // setup client directory
    app.use('/', express.static('./client/'));

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        let error = new Error('Not Found');
        error['status'] = 404;
        next(error);
    });

    // error handler
    app.use((error, req, res, next) => {
        res.status(error['status'] || 500);
        res.send({
            message: error.message,
            error: error
        });
        logger.error(error, error.message);
    });

    // Return Express server instance
    return app;

};

export default mainApp;
