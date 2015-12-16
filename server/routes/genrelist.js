
import jsonGraph from 'falcor-json-graph';
import services  from '../services';

const $ref = jsonGraph.ref;
const $error = jsonGraph.error;
const $atom = jsonGraph.atom;
const recommendationService = new services.recommendationsService();

// GetGenreListName Route
const getGenreListName = {
    route: 'genrelist[{integers:indices}].name',
    get: getGenreListNameHandler
};

function getGenreListNameHandler(pathSet) {
	return recommendationService
        .getGenreList(this.userId)
        .then(genrelist => {
            return pathSet.indices.map(index => {
                let listItem = genrelist[index];

                if (listItem == null) {
                    return {
                        path: ['genrelist', index],
                        value: $error(listItem.error)
                    }
                } else {
                    return {
                        path: ['genrelist', index],
                        value: genrelist[index].name
                    }
                }
            });
        });
}

// GetMyList Route
const getMyList = {
    route: 'genrelist.myList',
    get: getMyListHandler
};

function getMyListHandler(pathSet) {
	if (this.userId == undefined)
        throw new Error('not authorized');
            
    return recommendationService
        .getGenreList(this.userId)
        .then(function(genrelist) {
            for (var i = 0, genreListLength = genrelist.length; i < genreListLength; i++) {
                if (genrelist[i].myList) {
                    return [{
                        path: ['genrelist', 'myList'],
                        value: $ref(['genrelist', i])
                    }];
                }
            }
            throw new Error('myList missing from genrelist');
    });
}

// GetGenreListTitles Route
const getGenreListTitles = {
    route: 'genrelist[{integers:indices}].titles[{integers:titleIndices}]',
    get: getGenreListTitlesHandler
};

function getGenreListTitlesHandler(pathSet) {
	return recommendationService
        .getGenreList(this.userId)
        .then(function(genrelist) {
            var pathValues = [];
            pathSet.indices.forEach(function (index) {
                var genre = genrelist[index];
                
                if (genre == null) {
                    pathValues.push({
                        path: ['genrelist', index],
                        value: genre
                    });
                } else {
                    pathSet.titleIndices.forEach(function(titleIndex) {
                        var titleID = genrelist[index].titles[titleIndex];

                        if (titleID == null) {
                            pathValues.push({ path: ['genrelist', index, 'titles', titleIndex], value: titleID });
                        }
                        else {
                            pathValues.push({
                                path: ['genrelist', index, 'titles', titleIndex],
                                value: $ref(['postcardsById', titleID])
                            });
                        }
                    });
                }
            });
            return pathValues;
        });
}

// GetGenreListLength Route
const getGenreListLength = {
    route: 'genrelist.length',
    get: getGenreListLengthHandler
};

function getGenreListLengthHandler(pathSet) {
	return recommendationService.getGenreList(this.userId)
        .then(function(genrelist) {             
            return {
                path: ['genrelist', 'length'],
                value: genrelist.length
            };
        });	
}

// GetGenreListTitlesLength Route
const getGenreListTitlesLength = {
    route: 'genrelist[{integers:indices}].titles.length',
    get: getGenreListTitlesLengthHandler
};

function getGenreListTitlesLengthHandler(pathSet) {
	return recommendationService
        .getGenreList(this.userId)
        .then(function(genrelist) {             
            return pathSet.indices.map(function(index) {
                var list = genrelist[index];
             
                if (list == null) {
                    return { path: ['genrelist', index], value: list };
                }
                
                return {
                    path: ['genrelist', index, 'titles', 'length'],
                    value: list.titles.length
                };
            });
        });
}

// RemoveGenreListTitles Route
const removeGenreListTitles = {
    route: 'genrelist[{integers:indices}].titles.remove',
    call: removeGenreListTitlesHandler
};

function removeGenreListTitlesHandler(callPath, args) {
	if (this.userId == undefined)
        throw new Error('not authorized');

    var genreIndex = callPath.indices[0], titleIndex = args[0];

    return recommendationService
        .removeTitleFromGenreListByIndex(this.userId, genreIndex, titleIndex)
        .then(function(titleIdAndLength) {
            return [
                {
                    path: ['genrelist', genreIndex, 'titles', {from: titleIndex, to: titleIdAndLength.length }],
                    invalidated: true
                },
                {
                    path: ['genrelist', genreIndex, 'titles', 'length'],
                    value: titleIdAndLength.length
                }
            ];
        });
}

// AddGenreListTitles Route
const addGenreListTitles = {
    route: 'genrelist[{integers:indices}].titles.push',
    call: addGenreListTitlesHandler
};

function addGenreListTitlesHandler(callPath, args) {
	if (this.userId == undefined)
        throw new Error('not authorized');

    var titleRef = args[0], titleId, genreIndex = callPath.indices[0];
    if (titleRef == null || titleRef.$type !== 'ref' || titleRef.value[0] != 'titlesById' || titleRef.value.length !== 2) {
        throw new Error('invalid input');
    }

    titleId = titleRef.value[1];
    if (parseInt(titleId, 10).toString() !== titleId.toString())
        throw new Error('invalid input');

    return recommendationService
        .addTitleToGenreList(this.userId, genreIndex, titleId)
        .then(function(length) {
            return [
                {
                    path: ['genrelist', genreIndex, 'titles', length - 1],
                    value: titleRef
                },
                {
                    path: ['genrelist', genreIndex, 'titles', 'length'],
                    value: length
                }
            ];
        });
}

// return routes
export default function getRoutes() {
	return [getGenreListName, getMyList, getGenreListTitles, getGenreListLength, getGenreListTitlesLength, removeGenreListTitles, addGenreListTitles];
}
