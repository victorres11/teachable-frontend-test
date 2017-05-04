import angular from 'angular';
import rubyApi from '../../utils/ruby-gems-proxy-middleware';

const MODULE_NAME = 'app';

// TODO: Split this out into it's own controller file
(function(angular) {
    'use strict';
    angular.module('query', [])
        .controller('QueryController', ['$scope', function QueryController($scope) {
            this.query = '';
            this.result = {};
            this.favoriteGems = {};

            this.executeQuery = () => {
                const rubyApiPromise = new Promise( (resolve, reject) => {
                    return rubyApi({
                            originalUrl : '/api/v1/gems/' + this.query + '.json'},
                            resolve,
                            reject
                    );

                });

                // Let's use a promise since the API call is async.
                rubyApiPromise.then( result => {
                    this.result = result;
                    // View wasn't updating, so forcing it to reset with $apply().
                    $scope.$apply();
                }, function(err) {
                    console.log('err ' + err);
                });
            };

            this.loadExistingGems = () => {
                let existingGems = window.localStorage.getItem('gems');
                existingGems = JSON.parse(existingGems);
                return existingGems
            };

            this.handleFavoritesClick = (queryResult) => {
                let existingGems = this.loadExistingGems();

                if (existingGems && existingGems[queryResult.name]) {
                    this.removeFromFavorites(existingGems, queryResult.name)
                } else {
                    this.saveToFavorites(queryResult.name, queryResult.dependencies, queryResult.info)
                }
            };

            this.saveToFavorites = (name, dependencies, info) => {
                console.log("saveToFavorites invoked!");
                let gemDetails = {
                    [name]: {
                        gemDependencies: dependencies,
                        gemInfo: info
                    }
                };

                let existingGems = this.loadExistingGems();

                let mergedGemObject = Object.assign({}, existingGems, gemDetails);
                window.localStorage.setItem('gems', JSON.stringify(mergedGemObject));
            };

            this.removeFromFavorites = (existingGems, name) => {
                console.log("removeFromFavorites invoked!");
                // remove this gem from existing gems
                let newGemObject = Object.assign({}, existingGems);
                delete newGemObject[name];

                if (newGemObject) {
                    window.localStorage.clear();
                    window.localStorage.setItem('gems', JSON.stringify(newGemObject));
                }

            };

            this.loadFavoritesToModel = () => {
                let existingGems = this.loadExistingGems();
                this.favoriteGems = existingGems;
            }

        }]);
})(window.angular);



export const AppModule = angular.module(MODULE_NAME, ['query']).name;
