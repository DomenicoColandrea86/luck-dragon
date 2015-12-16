
import Promise from 'bluebird';
import path from 'path';
import PouchDB from 'pouchdb';

const ratingsDB = new PouchDB(path.join(__dirname, '../../db/ratings_db'));

// Rating Service
function RatingService() {}
RatingService.prototype = {

    getRatings: (titleIds, userId) => {
        userId = userId || 'all';
        
        return ratingsDB.allDocs({
            keys: titleIds.map(id => {
                return userId + ',' + id;
            }),
            include_docs: true
        })
        .then(dbResponse => {
            let ratings = {};
            dbResponse.rows.forEach(row => {
                if (row.error) {
                    if (row.error == 'not_found') {
                        ratings[row.key.substr((userId + ',').length)] = {doc: null};
                    } else {
                        ratings[row.key.substr((userId + ',').length)] = {error: row.error};
                    }
                } else if (row.doc) {
                    ratings[row.key.substr((userId + ',').length)] = row;                   
                } else {
                    ratings[row.key.substr((userId + ',').length)] = {doc: null};
                }                
            });
            return ratings;
        });
    },
    
    setRatings: (userId, titlesIdsAndRating) => {
        
        function coerce(rating) {
            if (rating > 5)
                return 5;
            else if (rating < 1)
                return 1;
            else
                return rating;
        }

        let ids = Object.keys(titlesIdsAndRating);

        return ratingsDB.allDocs({
            keys: ids.map(id => {
                return userId + ',' + id;
            }),
            include_docs: true
        })
        .then(getResponse => {
            return ratingsDB.bulkDocs(
                ids.filter((id, index) => {
                    return !(getResponse.rows[index].doc == null || getResponse.rows[index].error == 'not_found');
                })
                .map((id, index) => {
                    return {
                        _id: userId + ',' + id,
                        _rev: (!getResponse.rows[index].error ? getResponse.rows[index].value.rev : undefined),
                        userRating: coerce(titlesIdsAndRating[id].userRating)
                    };
                })
            )
            .then(setResponse => {
                
                let results = {};
                getResponse.rows.forEach((response, index) => {
                    if (!setResponse[index]) {
                        results[response.key.substr((userId + ',').length)] = {doc: null};
                    } else if (setResponse[index].ok) {
                        if (getResponse.rows[index].doc == null || getResponse.rows[index].error) {
                            results[response.key.substr((userId + ',').length)] = {
                              id: setResponse[index].id,
                              key: setResponse[index].id,
                              value: {
                                 rev: setResponse[index].rev
                              },
                              doc: {
                                 userRating: coerce(titlesIdsAndRating[response.key.substr((userId + ',').length)].userRating),
                                 _id: setResponse[index].id,
                                 _rev: setResponse[index].rev
                              }
                           };
                        } else {
                            response.doc.userRating = coerce(titlesIdsAndRating[response.key.substr((userId + ',').length)].userRating);
                            results[response.key.substr((userId + ',').length)] = response;
                        }
                    } else {
                        results[response.key.substr((userId + ',').length)] = {error: setResponse[index].message};
                    }
                });
                return results;
            });
        }); 
    }
};

export default RatingService;
