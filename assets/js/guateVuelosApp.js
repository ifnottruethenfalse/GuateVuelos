var gvApp = angular.module("gvApp", ["ngRoute", "ngMaterial"]) // array is require

gvApp.config(function($routeProvider){
  
  $routeProvider.when("/", {
    templateUrl: "partials/index.html",
    controller: "indexCtrl"
  }).
  otherwise({
    redirectTo: "/"
  });

});

gvApp.controller("gvAppCtrl",['$scope', function ($scope){

}]);

gvApp.controller("indexCtrl",['$scope', function ($scope){

}]);