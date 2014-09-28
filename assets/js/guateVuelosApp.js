var gvApp = angular.module("gvApp", ["ngMaterial","ui.date"]); // array is require

gvApp.controller("gvAppCtrl",['$scope','$materialDialog', function ($scope,$materialDialog){
  $scope.selectedIndex = 0;
  $scope.signUp = function (e) {
    $materialDialog({
      templateUrl: 'partials/sign-up.html',
      targetEvent: e,
      controller: ['$scope', '$hideDialog', function($scope, $hideDialog) {
        $scope.close = function() {
          $hideDialog();
        };
      }]
    });
  };
}]);

gvApp.controller("billetCtrl",['$scope','$http', function ($scope,$http){
  $scope.onSearch = false;
  $scope.searchFlight = function() {  
    $scope.onSearch = true;
  };
  
  /*$scope.disabled = undefined;

  $scope.enable = function() {
    $scope.disabled = false;
  };

  $scope.disable = function() {
    $scope.disabled = true;
  };

  $scope.clear = function() {
    $scope.person.selected = undefined;
    $scope.address.selected = undefined;
    $scope.country.selected = undefined;
  };

  $scope.address = {};
  $scope.refreshAddresses = function(address) {
    var params = {address: address, sensor: false};
    return $http.get(
      'http://maps.googleapis.com/maps/api/geocode/json',
      {params: params}
    ).then(function(response) {
      $scope.addresses = response.data.results
    });
  };*/
}]);