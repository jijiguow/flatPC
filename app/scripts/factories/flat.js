angular.module('flatpcApp')
.factory('FlatService',['$http', 'AppConfig',function($http, AppConfig){
    var getList = function(schoolcode){
        var url = AppConfig.WEB_ROOT + 'flatdata/school/get_floor_list/?schoolcode='+schoolcode+'&token=123';
        return $http.get(url);
    }
    var getFlat = function(flatid){
        var url = AppConfig.WEB_ROOT + 'apartment/floor/index/?flatid=' + flatid + '&token=123';
        return $http.get(url);
    }
    return {
        getList:getList,
        getFlat:getFlat
    }
}]);