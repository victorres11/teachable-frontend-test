import angular from 'angular';
import rubyApi from '../../utils/ruby-gems-proxy-middleware';

const MODULE_NAME = 'app';

(function(angular) {
    'use strict';
    angular.module('query', [])
        .controller('QueryController', ['$scope', function QueryController($scope) {
            this.query = '';
            this.result = { queryResponse: 'foobar'};

            this.executeQuery = function executeQuery() {
                console.log(this.query);
                const rubyApiPromise = new Promise( (resolve, reject) => {
                    return rubyApi({
                            originalUrl : '/api/v1/gems/' + this.query + '.json'},
                            resolve,
                            reject
                    );

                });

                // Let's use a promise since the API call is async.
                rubyApiPromise.then( result => {
                    this.result.queryResponse = result;
                    // View wasn't updating, so forcing it to reset with $apply().
                    $scope.$apply();
                }, function(err) {
                    console.log('err ' + err);
                });
            };

            this.saveToFavorites = function saveToFavorites(name, dependencies, info) {
                console.log("saveToFavorites invoked");
                var gemDetails = {
                    name: {
                        gemDependencies: dependencies,
                        gemInfo: info
                    }
                };
                console.log(gemDetails);

                window.localStorage.setItem("saved", JSON.stringify(gemDetails));
            }

        }]);
})(window.angular);



export const AppModule = angular.module(MODULE_NAME, ['query']).name;
