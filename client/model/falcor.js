
import { Model } from 'falcor';
import HttpDataSource from 'falcor-http-datasource';

// Create our Virtual Falcor Model
export default new Model({
	source: new HttpDataSource('/luckDragon/api/v1/model.json')
});