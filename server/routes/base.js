
import _ from 'lodash';
import Router from 'falcor-router';
import titlesByIds from './titlesByIds';
import genrelist from './genrelist';

const routesArray = [];

// Create Falcor Router Class
const LuckDragonRouterBase = Router.createClass(_getRoutes());

const LuckDragonRouter = function(userId) {
    LuckDragonRouterBase.call(this);
    this.userId = userId;
};

LuckDragonRouter.prototype = Object.create(LuckDragonRouterBase.prototype);

function _getRoutes() {
    _addToRoutesArray(titlesByIds());
    _addToRoutesArray(genrelist());
    return routesArray;
}

function _addToRoutesArray(arr){
    _.forEach(arr, function(item) {
        routesArray.push(item);
    });
}

export default (userId) => {
    return new LuckDragonRouter(userId);
};