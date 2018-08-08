var routerApp = angular.module('routerApp', ['ui.router','ui.grid','ui.bootstrap']);


routerApp.controller('expensesListCtrl',function ($http) {
    var vm = this;
    vm.recievedData = false;
    vm.gridOptions = {};
    vm.gridOptions.columnDefs = [{field:"name"},{field:"amount"},{field:"type"},{field:"time",type:'date'}];


    $http.get("http://localhost:8080/expenses").then(function(response){
        vm.gridOptions.data = response.data.expenses;
        vm.recievedData = true;
    }).catch(function (error) {
        console.log(error);
    });
});

routerApp.controller('mainPageNavCtrl',function ($scope,$uibModal,$http) {

    $scope.check = "check str";
    $scope.addPath = function(){
        console.log("add path");
        $uibModal.open({
            templateUrl: 'addPathModal.html',
            controller: function ($scope, $uibModalInstance) {

                $scope.addExpenseForm = {};




                $scope.ok = function () {
                    $http.post("http://localhost:8080/expenses",$scope.addExpenseForm).then(function(response){
                        console.log(response);
                    })
                    $uibModalInstance.close();
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }
        })
    }

})

/*
*  $scope.openModal = function () {
    $uibModal.open({
      templateUrl: 'modal.html',
      controller: function ($scope, $uibModalInstance) {
        $scope.ok = function () {
          $uibModalInstance.close();
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }
    })
  };
});
* */

routerApp.config(function($stateProvider, $urlRouterProvider) {

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

});