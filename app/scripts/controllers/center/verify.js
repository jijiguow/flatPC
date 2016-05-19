'use strict';

/**
 * @ngdoc function
 * @name flatpcApp.controller:verifyCtrl
 * @description
 * # verifyCtrl
 * Controller of the flatpcApp
 */
angular.module('flatpcApp')
.controller('verifyCtrl', ['$scope','$rootScope',function($scope,$rootScope) {
        //存储列表头到frame.html中
    $scope.menus = [
        '数据中心','用户中心','审核列表'
    ];
    //跳转到什么地方去
    $scope.parent = "data";
    $rootScope.loading = false;
    var a = document.createElement('a');
    a.href = "http://baidu.com";
    a.target="page-frame";
    a.click();
}]);