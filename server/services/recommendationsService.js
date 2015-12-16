import Promise from 'promise';
import path from 'path';
import PouchDB from 'pouchdb';
import utils from '../utils';

const recommendationsDB = new PouchDB(path.join(__dirname, '../../db/recommendations_db'));

// Recommendations Service
function RecommendationsService() {}
RecommendationsService.prototype = {
    
    getGenreList: userId => {
        userId = (userId || 'all').toString();
        
        let getGenreLists = utils.batch(userIds => {
            
            return recommendationsDB.allDocs({
                keys: userIds.map(x => { return x.toString() }),
                include_docs: true
            })
            .then(dbResponse => {
                let genreLists = {};
                dbResponse.rows.forEach(row => {
                    genreLists[row.key] = row;
                });
                return genreLists;
            });            
        });
        
        return getGenreLists([userId])
            .then(genreLists => {
                return genreLists[userId].doc.recommendations;
            });
    },
    
    addTitleToGenreList: (userId, genreIndex, titleId) => {
        userId = userId.toString();        
        return recommendationsDB.get(userId)
            .then(response => {
                if (!response.recommendations[genreIndex]) {
                    return Promise.reject(new Error('genrelist does not exist at index ' + genreIndex));
                } 
                let titlesLength = response.recommendations[genreIndex].titles.push(titleId);
                return recommendationsDB.put({
                    _id: userId,
                    _rev: response._rev,
                    recommendations: response.recommendations                     
                })
                .then(() => {
                    return titlesLength;  
                });
            });
    },
    
    removeTitleFromGenreListByIndex: (userId, genreIndex, titleIndex) => {
        userId = userId.toString();
        return recommendationsDB.get(userId)
            .then(response => {
                if (!response.recommendations[genreIndex]) {
                    return Promise.reject(new Error('genrelist does not exist at index ' + genreIndex));
                }                
                let removedTitleId = response.recommendations[genreIndex].titles.splice(titleIndex, 1)[0];
                return recommendationsDB.put({
                    _id: userId,
                    _rev: response._rev,
                    recommendations: response.recommendations
                })
                .then(() => {
                    return {
                        titleId: removedTitleId, 
                        length: response.recommendations[genreIndex].titles.length
                    }; 
                });
            });
    }    
};

export default RecommendationsService;
