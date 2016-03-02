angular.module('flatpcApp')
.controller('GradeCtrl', ['$scope','AppConfig','$rootScope', 'FlatService','TermService','$filter','GradeService',
function($scope,AppConfig,$rootScope,FlatService,TermService,$filter,GradeService) {
    
    $scope.media = {
        tab:1,
        setTab:function(n) {
            this.tab = n;
            this.epage = 1;
            refresh();
        },
        type:3,
        flatid:'',
        flatid1:'',
        liveareaid:'',
        campusid:'',
        studentnumber:'',
        name:'',
        roomname:'',
        search:2,
        orderfield:'',
        ordertype:'',
        tobed:0,
        setRule:function (n) {
            this.tobed = n;
            refresh();
        },
        epage:1,
        pageCount:1,
        recordCount:0,
        pagesize:10,
        setPage:function(n){
            if(this.epage + n >0 && this.epage + n <= this.pageCount){
                this.epage += n;
                refresh();
            } 
        },
        setPageSize:function(n){
            this.pagesize = n;
            refresh();
        },
        setOrder : function(name){
            if(this.orderfield == name)
            {
                this.ordertype = this.ordertype=="asc"?"desc":"asc";
            }else{
                this.orderfield = name;
                this.ordertype = "asc";
            }
            refresh();
        },
        setSearch : function(search){
            this.name = this.search?'':search;
            this.studentnumber = this.search == 1?search:'';
            this.roomname = this.search == 2?search:'';
            // console.log(this);
            refresh();
        },
        yearIndex:0,
        termIndex:0,
        week:0,
        weekList:[],
        setWeek:function (week) {
            this.week = week;
            refresh();
        },
        setYear:function (n) {
            n = n || 1;
            if(n < 0){
                if(this.termIndex > 0){
                    this.termIndex--;
                }else{
                    if(this.yearIndex < $rootScope.treeTerm.length - 1){
                        this.yearIndex++;
                        this.termIndex = $rootScope.treeTerm[this.yearIndex].semesterList.length-1;
                    }
                }
            }else{
                if(this.yearIndex < $rootScope.treeTerm.length - 1){
                    this.termIndex++;
                }else{
                    if(this.yearIndex > 0){
                        this.yearIndex --;
                        this.termIndex = 0;
                    }
                }
            }
            refresh();
        },
        getYear:function (n) {
            n = n || 0;
            if(!$rootScope.treeTerm) return {};
            if( n < 0){
                if(this.termIndex > 0){
                    return {
                        year:$rootScope.treeTerm[this.yearIndex].year,
                        term:$rootScope.treeTerm[this.yearIndex].semesterList[this.termIndex-1].semesterName
                    }
                }else{
                    if(this.yearIndex < $rootScope.treeTerm.length - 1){
                        return {
                            year:$rootScope.treeTerm[this.yearIndex+1].year,
                            term:$rootScope.treeTerm[this.yearIndex+1].semesterList[$rootScope.treeTerm[this.yearIndex+1].semesterList.length-1].semesterName
                        }
                    }else{
                        return {
                            year:null,
                            term:null
                        }
                    }
                }
            }else{
                if(this.termIndex < $rootScope.treeTerm[this.yearIndex].semesterList.length - 1){
                    return {
                        year:$rootScope.treeTerm[this.yearIndex].year,
                        term:$rootScope.treeTerm[this.yearIndex].semesterList[this.termIndex+1].semesterName
                    }
                }else{
                    if(this.yearIndex > 0){
                        return {
                            year:$rootScope.treeTerm[this.yearIndex-1].year,
                            term:$rootScope.treeTerm[this.yearIndex-1].semesterList[0].semesterName
                        }
                    }else{
                        return {
                            year:null,
                            term:null
                        }
                    }
                }
            }
        },
        title:'',
        show:function (type,item,campus,liveArea) {
            this.type = type;
            this.flatid1 = item.flatId || '';
            this.liveareaid = item.liveAreaId || '';
            this.campusid = item.campusId || '';
            this.title = (campus?(campus.title + ' - ') : '') 
                    + (liveArea?(liveArea.title + ' - '):'') 
                    +  item.title;
                    
            if(this.tab == 1){
                if(type==3){
                    this.flatid = item.flatId;
                    refresh();
                }
            }
            else{
                refresh();
            }
        }
    }
    
    
    $scope.cardMedia = {
        tab:1
    }
    //打分初始化相关
    $scope.dataInit = function (item) {
        console.log(item);
        $scope.cardMedia.tab = 1;
    }
    
    
    
    
    //界面初始化相关
    if(!$rootScope.treeTerm)
        TermService.getList().success(function(data){
            //console.log(data);
            $rootScope.treeTerm = data.data;
            getFlat();
        }); 
    else {
        getFlat();
    }
    
    function getFlat() {
       if(!$rootScope.treeFlat){
            FlatService.getList(AppConfig.schoolCode).success(function(data){
                //console.log(data);
                $rootScope.treeFlat = data.data;
                init();
            });
        }
        else
        {
            init();
        }
    };
    function init() {
        for(var i = 0;i < $rootScope.treeTerm.length;i ++){
            for(var j = 0; j < $rootScope.treeTerm[i].semesterList.length ; j ++ ){
                if($rootScope.treeTerm[i].semesterList[j].isCurrent){
                    $scope.media.yearIndex = i;
                    $scope.media.termIndex = j;
                    $scope.media.week = $rootScope.treeTerm[i].semesterList[j].currentWeek;
                    $scope.media.weekList  = $filter('sliceWeek')($rootScope.treeTerm[i].semesterList[j]);
                    //console.log($scope.media.weekList);
                    break;
                }
            }
        }
        if($rootScope.treeFlat.cmpusList[0].liveAreaList[0].flatList[0].flatId){
            $scope.media.title = $rootScope.treeFlat.cmpusList[0].title + ' - ' +  $rootScope.treeFlat.cmpusList[0].liveAreaList[0].title + ' - ' +  $rootScope.treeFlat.cmpusList[0].liveAreaList[0].flatList[0].title;
            $scope.media.flatid = $rootScope.treeFlat.cmpusList[0].liveAreaList[0].flatList[0].flatId;
            refresh();
        }
    };
    function refresh() {
        $rootScope.loading = true;
        if($scope.media.tab == 1){
            GradeService.getListByFlat({
                flatid:$scope.media.flatid,
                semesterid:$rootScope.treeTerm[$scope.media.yearIndex].semesterList[$scope.media.termIndex].semesterId,
                currentweek:$scope.media.week
            }).success(function (data) {
                $rootScope.loading = false;
                data.list.floorList = data.list.floorList || [];
                data.list.floorList.forEach(function(list){
                    list.roomList = list.roomList || [];
                    list.roomList =  $filter('sliceArray')(list.roomList);
                });
                $scope.flat = data.list;
                //console.log(data);
            })
        }else if($scope.media.tab == 2){
            GradeService.getList({
                epage:$scope.media.epage,
                pagesize:$scope.media.pagesize,
                liveareaid:$scope.media.liveareaid,
                campusid:$scope.media.campusid,
                studentnumber:$scope.media.studentnumber,
                name:$scope.media.name,
                roomname:$scope.media.roomname,
                orderfield:$scope.media.orderfield,
                ordertype:$scope.media.ordertype,
                flatid:$scope.media.flatid1,
                semesterid:$rootScope.treeTerm[$scope.media.yearIndex].semesterList[$scope.media.termIndex].semesterId,
                currentweek:$scope.media.week
            }).success(function (data) {
                $rootScope.loading = false;
                $scope.rooms = data.list;
                $scope.media.recordCount = data.list.recordCount;
                $scope.media.pageCount = data.list.pageCount;
                // console.log(data);
            })
        }else if($scope.media.tab == 3){
            GradeService.getTopList({
                epage:$scope.media.epage,
                pagesize:$scope.media.pagesize,
                liveareaid:$scope.media.liveareaid,
                campusid:$scope.media.campusid,
                studentnumber:$scope.media.studentnumber,
                name:$scope.media.name,
                roomname:$scope.media.roomname,
                orderfield:$scope.media.orderfield,
                ordertype:$scope.media.ordertype,
                flatid:$scope.media.flatid1,
                semesterid:$rootScope.treeTerm[$scope.media.yearIndex].semesterList[$scope.media.termIndex].semesterId,
                currentweek:$scope.media.week,
                tobed:$scope.media.tobed
            }).success(function (data) {
                $rootScope.loading = false;
                $scope.topList = data.list;
                $scope.media.recordCount = data.list.recordCount;
                $scope.media.pageCount = data.list.pageCount;
                // console.log(data);
            })
        }
    };
    
}]);