
import Promise from 'promise';

const cache = function cache(fun) {
	let cached = {};

	return ids => {

		let assemble = results => {
			//put new results in cache:
			Object.keys(results).forEach(id => {
				cached[id] = results[id];
			});
			//grab cached results:
			ids.forEach(id => {
				results[id] = cached[id];
			});

			return results;
		};

		let culledIds = ids.filter(id => {
			return !cached[id];
		});
		
		if (culledIds.length) {			
			return fun(culledIds).then(assemble);
		} else {
			return Promise.resolve(assemble({}));
		}
	};
};

export default cache;
