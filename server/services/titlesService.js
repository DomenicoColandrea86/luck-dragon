
import path from 'path';
import PouchDB from 'pouchdb';
import utils from '../utils';

const titlesDB = new PouchDB(path.join(__dirname, '../../db/titles_db'));

// Title Service
function TitleService() {}
TitleService.prototype = {

	getTitles: utils.batch(titleIds => {
        
        return titlesDB.allDocs({
            keys: titleIds.map(function(x) { return x.toString(); }),
            include_docs: true
        })
        .then(dbResponse => {
			
			let titles = {};
			
			dbResponse.rows.forEach(row => {
				if (row.error) {
					if (row.error == 'not_found') {
						titles[row.key] = {doc: null};
					} else {
						titles[row.key] = {error: row.error};
					}
				} else if (row.doc) {
					titles[row.key] = row;					
				} else {
					titles[row.key] = {doc: null};
				}
			});
			return titles;
		});
	})
};

export default TitleService;
