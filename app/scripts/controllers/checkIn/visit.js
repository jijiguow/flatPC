angular.module('flatpcApp')
.controller('VisitCtrl', ['$scope','AppConfig','$rootScope', 'FlatService','CheckInService','$filter','StudentService',
function($scope,AppConfig,$rootScope,FlatService,CheckInService,$filter,StudentService) {
    //基础的页码、排序等等选项
    $scope.media = {
        epage:1,
        pageCount:1,
        recordCount:0,
        pagesize:10,
        name:'',
        studentnumber:'',
        campusid:'',
        liveareaid:'',
        flatid:'',
        search:0,
        orderfield:'',
        ordertype:''
    }
    //换页
    $scope.setPage = function(n){
        if($scope.media.epage + n >0 && $scope.media.epage + n <= $scope.media.pageCount){
            $scope.media.epage += n;
            refresh(1);
        } 
    };
    //调整每页显示量
    $scope.setPageSize = function(n){
        $scope.media.pagesize = n;
        refresh();
    }
    //排序
    $scope.setOrder = function(name){
        if($scope.media.orderfield == name)
        {
            $scope.media.ordertype = $scope.media.ordertype=="asc"?"desc":"asc";
        }else{
            $scope.media.orderfield = name;
            $scope.media.ordertype = "asc";
        }
        refresh();
    }
    //调整查询规则，按学区、生活区或者楼栋查询
    $scope.show = function(type,item){
        $scope.media.campusid = item.campusId || "";
        $scope.media.liveareaid = item.liveAreaId || "";
        $scope.media.flatid = item.flatId || "";
        
        refresh();
    };
    //检索功能
    $scope.search = function(search){
        $scope.media.name = $scope.media.search?'':search;
        $scope.media.studentnumber = $scope.media.search?search:'';
        refresh();
    };
    //初始化树+列表
    if(!$rootScope.treeFlat){
        FlatService.getList(AppConfig.schoolCode).success(function(data){
            
            $rootScope.loading = false;
            if(data.code == 0){
                $rootScope.treeFlat = data.data;
                refresh();
            }
            else
                swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
        });
    }
    else {
        refresh();
        $rootScope.loading = false;
    }
    //渲染list
    function refresh(n){
        if(!n)$scope.media.epage = 1;
        $rootScope.loading = true;
        console.log($scope.media);
        CheckInService.getVisitList($scope.media).success(function(data){
            if(data.code == 0){
                $scope.list = data.data.list;
                $scope.media.recordCount = data.data.recordCount;
                $scope.media.pageCount = data.data.pageCount;
            }else if(data.code == 4037){
                    swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
                    location.href="#login";$rootScope.loading = false;
                }
            else
                swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
            
            console.log(data.data);
            $rootScope.loading = false;
        })
    }
    
    //查看详情
    $scope.work = {};
    $scope.detail = function(work){
        $scope.work = work;
        $scope.endTime = new Date().Format("yyyy-MM-dd hh:mm");
        return null;
    };
    $scope.editSave = function () {
        $rootScope.loading = true;
        CheckInService.editVisit({
            token:AppConfig.token,
            visitid:$scope.work.visitid,
            starttime:$scope.work.startTime,
            name:$scope.work.name,
            credentialtype:$scope.work.credentialType,
            credential:$scope.work.credential,
            phone:$scope.work.phone,
            memo:$scope.work.memo,
            endtime:$scope.work.endTime,
            adminid:AppConfig.adminId
        }).success(function (data) {
            $rootScope.loading = false;
            console.log(data);
            
            if(data.code == 0){
                swal("提示", "修改成功！", "success"); 
                refresh();
            }else if(data.code == 4037){
                    swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
                    location.href="#login";$rootScope.loading = false;
                }
            else
                swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
        })
    }
    $scope.delete = function(fun){       
        swal({   
            title: "确认删除",   
            text: "真的要删除吗？",   
            type: "warning",   
            showCancelButton: true,   
            confirmButtonColor: "#DD6B55",   
            confirmButtonText: "删除",   
            cancelButtonText: "取消",   
            closeOnConfirm: false 
        }, 
        function(){   
            $rootScope.loading = true;
            return CheckInService.delVisit({
                token:AppConfig.token,
                visitid:$scope.work.visitid
            }).success(function(data){
                $rootScope.loading = false;
                
                if(data.code == 0){
                    swal("提示", "删除成功！", "success"); 
                    if(fun && typeof fun == 'function') fun();
                    refresh();
                }else if(data.code == 4037){
                    swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
                    location.href="#login";$rootScope.loading = false;
                }
                else
                    swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
            });
        });
    }
    $scope.deal = function (time,fun) {
        $rootScope.loading = true;
        return CheckInService.dealVisit({
            token:AppConfig.token,
            visitid:$scope.work.visitid,
            endtime:time,
            adminid:AppConfig.adminId
        }).success(function(data){
            $rootScope.loading = false;
            
            if(data.code == 0){
                swal("提示", "处理成功！", "success"); 
                if(fun && typeof fun == 'function') fun();
                refresh();
            }else if(data.code == 4037){
                    swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
                    location.href="#login";$rootScope.loading = false;
                }
            else
                swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
        });
    }
    //新增登记表单中的二级连选的select
    $scope.selecter = {
        campusId:'',
        liveAreaId:'',
        liveAreaList:[],
        flatId:'',
        flatList:[],
        campusSelecter : function(){
            //用campusId获取liveAreaList
            if(this.campusId){
                //this.liveAreaId = '';
                //this.flatId = '';
                this.flatList = [];
                var campus = this.campusId?$filter('filter')($rootScope.treeFlat.cmpusList,{campusId:this.campusId}):[];
                this.liveAreaList = (campus.length>0 && campus[0].liveAreaList) ? campus[0].liveAreaList : [];
            }
        },
        liveAreaSelecter : function(){
            //用liveAreaId获取flatList
            if(this.liveAreaId){
                //this.flatId = '';
                var liveArea = this.liveAreaId?$filter('filter')(this.liveAreaList,{liveAreaId:this.liveAreaId}):[];
                this.flatList = (liveArea.length>0 && liveArea[0].flatList)?liveArea[0].flatList : [];
            }
        },
        
        init : function(){

            
            this.liveAreaList = [];
            this.flatList=[];
            this.campusSelecter();
            this.liveAreaSelecter();
            
            
        }
    }
    $scope.dataInit = function () {
        $scope.selecter.init();
        $scope.form.student = null;
        $scope.form.studentName = '';
        $scope.form.studentList = null;
        $scope.form.starttime = new Date().Format("yyyy-MM-dd hh:mm");
        $scope.form.name = '';
        $scope.form.credentialtype = 0;
        $scope.form.credential = '';
        $scope.form.phone = '';
        $scope.form.memo = '';
    }
    $scope.form = {
        student:null,
        studentName:'',
        studentList:null,
        starttime:'',
        name:'',
        credentialtype:0,
        credential:'',
        phone:'',
        memo:'',
        studentSearch:function () {
            var that = this;
            $rootScope.loading = true;
            StudentService.getListWithBedByFlat({
                keyword:this.studentName,
                flatid:$scope.selecter.flatId
            }).success(function (data) {
                //console.log(data);
                $rootScope.loading = false;
                
                if(data.code == 0){
                    that.studentList = data.list;
                }else if(data.code == 4037){
                    swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
                    location.href="#login";$rootScope.loading = false;
                }
                else
                    swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
            })
        },
        studentChoose:function (student) {
            this.student = student;
        },
        sub:function (fun) {
            $rootScope.loading = true;
            CheckInService.addVisit({
                token:AppConfig.token,
                schoolcode:AppConfig.schoolCode,
                bedid:this.student.bedId,
                studentkey:this.student.studentKey,
                peoplename:this.student.name,
                starttime:this.starttime,
                name:this.name,
                credentialtype:this.credentialtype,
                credential:this.credential,
                phone:this.phone,
                adminid:AppConfig.adminId,
                memo:this.memo
            }).success(function (data) {
                $rootScope.loading = false;
                console.log(data);
                
                if(data.code == 0){
                    swal("提示", "提交成功！", "success"); 
                    refresh();
                    if(fun && typeof fun == 'function') fun();
                }else if(data.code == 4037){
                    swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
                    location.href="#login";$rootScope.loading = false;
                }
                else
                    swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
            })
        }
    }
}]);