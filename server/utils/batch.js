
import Promise from 'promise';

const batch = function batch(fun) {
	let batches = {};
	let result = null;

	return ids => {
		
		if (!Object.keys(batches).length) {	
			result = 
				Promise.
					resolve().
					then(() => {
						let keys = Object.keys(batches);
						batches = {};
						return fun(keys);
					});
		}
		ids.forEach(id => {
			batches[id] = true;
		});
		
		return result.then(results => {
			let prunedResults = {};
			ids.forEach(id => {
				prunedResults[id] = results[id];
			});
			return prunedResults;
		});
	};
};

export default batch;