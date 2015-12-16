
import jsonGraph from 'falcor-json-graph';
import services from '../services';

const $ref = jsonGraph.ref;
const $error = jsonGraph.error;
const $atom = jsonGraph.atom;
const ratingService = new services.ratingsService();
const titleService = new services.titlesService();
const recommendationService = new services.recommendationsService();

// GetUserRating Route
const getUserRating = {
    route: 'titlesById[{integers:titleIds}]["userRating", "rating"]',
    get: getUserRatingHandler
};

function getUserRatingHandler(pathSet) {
    let userId = this.userId;

    return ratingService.getRatings(pathSet.titleIds, userId)
        .then(ratings => {
            let results = [];

            pathSet.titleIds.forEach(titleId => {
                pathSet[2].forEach(key => {
                    let ratingRecord = ratings[titleId];

                    if (ratingRecord.error) {
                        results.push({
                            path: ['titlesById', titleId, key],
                            value: $error(ratingRecord.error)
                        });
                    } else if (ratingRecord.doc) {
                        results.push({
                            path: ['titlesById', titleId, key],
                            value: ratingRecord.doc[key]
                        });
                    } else {
                        results.push({
                            path: ['titlesById', titleId],
                            value: undefined
                        });
                    }
                });
            });

            return results;
        });
}

// SetUserRating Route
const setUserRating = {
	route: 'titlesById[{integers:titleIds}].userRating',
	set: setUserRatingHandler
};

function setUserRatingHandler(jsonGraphArg) {
	if (this.userId == undefined)
        throw new Error('not authorized');

    let titlesById = jsonGraphArg.titlesById;
    let ids = Object.keys(titlesById);

    return ratingService.setRatings(this.userId, titlesById).
        then(ratings => {
            return ids.map(id => {
                if (ratings[id].error) {
                    return {
                        path: ['titlesById', id],
                        value: $error(ratings[id].error)
                    };
                } else if (ratings[id].doc) {
                    return {
                        path: ['titlesById', id, 'userRating'],
                        value: ratings[id].doc.userRating
                    };
                } else {
                    return {
                        path: ['titlesById', id],
                        value: undefined
                    };
                }
            });
        });
}

// GetTitlesInfo Route
const getTitlesInfo = {
	route: 'titlesById[{integers:titleIds}]["name","year","description","boxshot"]',
	get: getTitlesInfoHandler
};

function getTitlesInfoHandler(pathSet) {
    return titleService.getTitles(pathSet.titleIds)
        .then(titles => {
            let results = [];

            pathSet.titleIds.forEach(titleId => {
                pathSet[2].forEach(key => {
                    let titleRecord = titles[titleId];

                    if (titleRecord.error) {
                        results.push({
                            path: ['titlesById', titleId, key],
                            value: $error(titleRecord.error)
                        });
                    } else if (titleRecord.doc) {
                        results.push({
                            path: ['titlesById', titleId, key],
                            value: titleRecord.doc[key]
                        });
                    } else {
                        results.push({
                            path: ['titlesById', titleId],
                            value: undefined
                        });
                    }
                });
            });

            return results;
        });
}

const getPostcardsById = {
    route: 'postcardsById[{integers:titleIds}]["_id", "name","year","description","boxshot"]',
    get: pathSet => {
        return titleService.getTitles(pathSet.titleIds)
        .then(postcards => {

            let jsonGraph = {},
                postcardsById = jsonGraph.postcardsById = {};

            pathSet.titleIds.forEach(id => {
              let postcard = postcards[id];

              if(!postcard.doc) {
                postcardsById[id] = $atom(postcard);
              } else {
                postcardsById[id] = {};
                pathSet[2].forEach(attr => {
                    postcardsById[id][attr] = postcard.doc[attr]
                });
              }
            });

            return { jsonGraph };
          });
    }
};

const getPostcards = {
    route: 'postcards[{integers:titleIds}]',
    get: pathSet => {
      return titleService.getTitles(pathSet.titleIds)
        .then(records => {
            return pathSet.titleIds.map(index => {
              let record = records[index];

                if (record.error) {
                    return {
                        path: ['postcards', index],
                        value: $error(record.error)
                    }
                } else if (record.doc) {
                    return {
                        path: ['postcards', index],
                        value: $ref(['postcardsById', record.id])
                      }
                } else {
                    return {
                      path: ['postcards', index],
                      value: undefined
                    }
                }
            })
          });
    }
  };

// return routes
export default function getRoutes() {
	return [getUserRating, setUserRating, getTitlesInfo, getPostcardsById, getPostcards];
}
