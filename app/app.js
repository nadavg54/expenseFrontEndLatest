var routerApp = angular.module('routerApp', ['ui.router','ui.grid','ui.bootstrap']);


routerApp.controller('expensesListCtrl',["$http", "gridService", function ($http,gridService) {
  var vm = this;
  vm.recievedData = false;
  vm.searchInput;
  vm.gridOptions = gridService.getOption();
  //vm.gridOptions.columnDefs = [{field:"name"},{field:"amount"},{field:"type"},{field:"time",type:'date'}];

  $http.get("http://35.204.68.245:8080/expenses").then(function(response){

    gridService.setData(response.data.expenses);
    gridService.setUnfilteredData(response.data.expenses);
    vm.recievedData = true;
  }).catch(function (error) {
    console.log(error);
  });
}]);

routerApp.factory('gridService',[function () {


  var gridServiceInstance = {};
  gridServiceInstance.gridOptions = {};
  gridServiceInstance.gridOptions.columnDefs = [{field:"user"},{field:"name"},{field:"amount"},{field:"type"},{field:"time",cellFilter: 'date:\'yyyy-MM-dd\''}];
  gridServiceInstance.unfilteredData;

  gridServiceInstance.getData = function () {
    return gridServiceInstance.gridOptions.data;
  }

  gridServiceInstance.setData = function (data) {
    gridServiceInstance.gridOptions.data = data;
  }

  gridServiceInstance.getOption = function(){
    return gridServiceInstance.gridOptions;
  }

  gridServiceInstance.setUnfilteredData = function (data) {
    gridServiceInstance.unfilteredData = data;
  }

  gridServiceInstance.getUnfilteredData = function(){
    return gridServiceInstance.unfilteredData;
  }

  return gridServiceInstance;

}])

routerApp.controller('mainPageNavCtrl',["$scope", "$uibModal", "$http", "gridService", function ($scope,$uibModal,$http,gridService) {

  var vm = this;
  $scope.check = "check str";


  $scope.addPath = function(){
    console.log("add path");
    $uibModal.open({
      templateUrl: 'addPathModal.html',
      controller: ["$scope", "$uibModalInstance", function ($scope, $uibModalInstance) {

        $scope.addExpenseForm = {};

        $scope.ok = function () {
          $http.post("http://35.204.68.245:8080/expenses",$scope.addExpenseForm).then(function(response){
            console.log(response);
          })
          $uibModalInstance.close();
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }]
    })
  }
  $scope.searchText = function () {
    console.log("inside search text");

    if($scope.searchInputText == null || $scope.searchInputText.length == 0)
    {
      gridService.setData(gridService.getUnfilteredData());
      return;
    }

    var filteredData = gridService.getUnfilteredData().filter(function (element) {
      if ( (element.name.indexOf($scope.searchInputText) != -1) || element.type.indexOf($scope.searchInputText) != -1) {
        return true;
      }
      return false;
    });
    gridService.setData(filteredData);
  }

}])


routerApp.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/home');
  $stateProvider

  // HOME STATES AND NESTED VIEWS ========================================
    .state('home', {
      url: '/home',
      templateUrl: 'expensesList.html',
      controller: 'expensesListCtrl as vm'
    })

    // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
    .state('about', {
      // we'll get to this in a bit
    });

}]);
