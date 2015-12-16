
import model from '../../model/falcor';

export default class HomeController {
  constructor() {
    this.activate();
  }

  activate() {

    //logging:
    let log = console.log.bind(console);
    let jlog = function(x) { console.log(JSON.stringify(x, null, 3)); };
    let jerror = function(x) { console.error(JSON.stringify(x, null, 3)); };

    //examples:
    
    model.get('titlesById[1,2,3]["name", "year", "description", "boxshot"]').then(jlog, jerror)

    // model.get('titlesById[1,2,3].userRating').then(jlog, jerror)

    // model.get('genrelist[0..5].titles[0..5].name').then(function (data) {
    //     console.log(data);
    // });

    // model.get('genrelist[0].name').then(jlog, jerror)

    // model.get('titlesById[5]["userRating", "name"]').then(jlog, jerror)

    // model.setValue('titlesById[9].userRating', 9).then(jlog, jerror)

    // model.setValue('genrelist[0].titles[2].userRating', 3).then(jlog, jerror)

    // model.get('genrelist[0].titles[0..2]["userRating", "name"]').then(function(x) {
    //     jlog(x)
    //     model.setValue('genrelist[0].titles[1].userRating', 8).then(function(y) {
    //         jlog(y)
    //         model.get('genrelist[0].titles[0..2]["userRating", "name"]').then(jlog, jerror)
    //     }, jerror)
    // }, jerror)

    // model.get('genrelist[10].titles.length').then(jlog, jerror)
    // model.get('genrelist[10].titles[0..10]["name", "year", "boxshot"]').then(jlog, jerror)

    // model.get('genrelist[0].titles[0]').subscribe(jlog, jerror)

    // model.get('genrelist.length').then(jlog, jerror)

    // model.get('genrelist[0].titles.length').then(function(z) {
    //     jlog(z)
    //     model.call('genrelist[0].titles.push', [{$type: "ref", value: ['titlesById', 1]}], ["name", "rating"], ["length"]).then(function(x) {
    //         jlog(x);
    //         var index = x.json.genrelist[0].titles.length - 1
    //         log(index)
    //         model.call('genrelist[0].titles.remove', [index]).then(function(y) {
    //             jlog(y)
    //             model.get('genrelist[0].titles[' + (index + 1) + ']["name", "year"]').then(jlog, jerror)
    //         }, jerror);
    //     }, jerror);
    // }, jerror)

    // model.setValue('titlesById[0].userRating', 4).then(jlog, jerror) // this is expected to fail
    // model.get('titlesById[1]["userRating", "rating"]').then(jlog, jerror)

    // model.get('titlesById[0, 1, 2, 3]["year", "rating", "userRating"]').then(jlog, jerror)

    // model.get('titlesById[1234].userRating').then(jlog, jerror)

    // model.get('genrelist.myList.name').then(jlog, jerror)
    // model.get('genrelist.myList.titles[0..1]["name", "boxshot", "rating", "userRating"').then(jlog, jerror)
    // model.get('genrelist.myList.titles.length').then(jlog, jerror)

  }
}