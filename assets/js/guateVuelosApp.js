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

gvApp.controller("gvAppCtrl", function ($scope, $location, $modal, $materialDialog, $materialSidenav, $timeout){

});

gvApp.controller("indexCtrl", function ($scope, $location, $modal, $materialDialog, $materialSidenav, $timeout){

});