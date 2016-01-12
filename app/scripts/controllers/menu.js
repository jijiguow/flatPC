angular.module('flatpcApp')
  .controller('MenuCtrl', ['$scope','$rootScope',function ($scope,$rootScope) {
    $rootScope.loading = false;
    $scope.menuList = [
        {
            name:'公寓住宿查询',
            list:[
                {
                    name:'住宿总览',
                    icon:'icon-menu1',
                    iconSize:20,
                    color:'#38adff',
                    href:'#list'
                },
                {
                    name:'住宿学生查询',
                    icon:'icon-menu1',
                    iconSize:20,
                    color:'#74bef2',
                    href:'#list1'
                },
                {
                    name:'空房查询',
                    icon:'icon-menu1',
                    iconSize:20,
                    color:'#66cccc',
                    href:'#list'
                }
            ]
        },
        {
            name:'公寓住宿查询',
            list:[
                {
                    name:'学生住宿',
                    icon:'icon-menu1',
                    iconSize:20,
                    color:'#ff9c00',
                    href:'#list1'
                },
                {
                    name:'学生调宿',
                    icon:'icon-menu1',
                    size:20,
                    color:'#fc7257',
                    href:'#list'
                },
                {
                    name:'学生退宿',
                    icon:'icon-menu1',
                    iconSize:20,
                    color:'#02cf97',
                    href:'#list1'
                }
            ]
        }
        
    ]
  }]);