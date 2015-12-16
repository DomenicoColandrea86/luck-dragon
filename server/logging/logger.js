
import winston from 'winston';

// instantiate Winston
const logger = new(winston.Logger)({
    transports:[
        new (winston.transports.Console)({
            colorize:true
        })
    ],
    colorize:true
});

export default logger;