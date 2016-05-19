angular.module('flatpcApp')
.controller('GraduationCtrl', ['$scope','AppConfig','$rootScope', 'FlatService','GraduationService','$filter','CollegeService','RoomService',"StudentService",
function($scope,AppConfig,$rootScope,FlatService,GraduationService,$filter,CollegeService,RoomService,StudentService) {
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
        collegeid:'',
        classid:'',
        search:0,
        orderfield:'',
        ordertype:'',
        status:-1,
        multi:false,
        getSum:function (lst) {
            var sum = 0;
            lst.forEach(function (item) {
                try{
                    sum += (parseFloat(item.cost)||0);
                }catch(e){
                    
                }
            })
            return sum || 0;
        }
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
    $scope.show = function(type,item,campus,liveArea){
        $scope.media.campusid = item.campusId || "";
        $scope.media.liveareaid = item.liveAreaId || "";
        $scope.media.flatid = item.flatId || "";
        $scope.media.collegeid=item.collegeId || "";
        $scope.media.classid=item.classId || "";
        
        switch(type){
            case 0:
                $scope.selecter.campusId = "";
                $scope.selecter.liveAreaId = "";
                $scope.selecter.flatId = "";
                
                $scope.selecter.collegeId = "";
                $scope.selecter.classId = "";
                break;
            case 1:
                $scope.selecter.campusId = item.campusId || "";
                $scope.selecter.liveAreaId = "";
                $scope.selecter.flatId = "";
                
                $scope.selecter.collegeId = item.collegeId || "";
                $scope.selecter.classId = "";
                break;
            case 2:
                $scope.selecter.campusId = campus.campusId || "";
                $scope.selecter.liveAreaId = item.liveAreaId || "";
                $scope.selecter.flatId = "";
                
                $scope.selecter.collegeId = campus.collegeId || "";
                $scope.selecter.classId = item.classId || "";
                break;
            case 3:
                $scope.selecter.campusId = campus.campusId || "";
                $scope.selecter.liveAreaId = liveArea.liveAreaId || "";
                $scope.selecter.flatId = item.flatId || "";
                
                $scope.selecter.collegeId = "";
                $scope.selecter.classId = "";
                break;
        }
        
        refresh();
    };
    //调整查询规则，计划中、已审批、已取消、已驳回
    $scope.setStatus = function(status){
        $scope.media.status = status;
        refresh();
    }
    //检索功能
    $scope.search = function(search){
        $scope.media.name = $scope.media.search?'':search;
        $scope.media.studentnumber = $scope.media.search?search:'';
        refresh();
    };
    
    //初始化树+列表
    CollegeService.getListByGrade(AppConfig.schoolCode).success(function(data){
        if(data.code == 0){
            $scope.college = data.list;
            if(!$rootScope.treeFlat){
                FlatService.getList(AppConfig.schoolCode).success(function(data){
                    if(data.code == 0){
                        $rootScope.treeFlat = data.data;
                        getCollege();
                    }else if(data.code == 4037){
                            swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
                            location.href="#login";$rootScope.loading = false;
                        }
                    else
                        swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
                    
                    $rootScope.loading = false;
                    
                });
            }
            else {
                getCollege();
            }
        }else if(data.code == 4037){
                swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
                location.href="#login";$rootScope.loading = false;
            }
        else
            swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
    });
    
    function getCollege() {
        if(!$rootScope.treeCollege){
            CollegeService.getList(AppConfig.schoolCode).success(function(data){
                if(data.code == 0){
                    $rootScope.treeCollege = data.data;
                    refresh();
                }else if(data.code == 4037){
                        swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
                        location.href="#login";$rootScope.loading = false;
                    }
                else
                    swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
            });
        }else refresh();
    }
    //渲染list
    function refresh(n){
        if(!n)$scope.media.epage = 1;
        $rootScope.loading = true;
        GraduationService.getList($scope.media).success(function(data){
            if(data.code == 0){
                $scope.list = data.data.dataList;
                $scope.media.recordCount = data.data.recordCount;
                $scope.media.pageCount = data.data.pageCount;
            }else if(data.code == 4037){
                    swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
                    location.href="#login";$rootScope.loading = false;
                }
            else
                swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
            
            
            //console.log(data.data);
            $rootScope.loading = false;
        })
    }
    
    //查看详情
    $scope.work = {};
    $scope.detail = function(work){
        $scope.work = work;
        return null;
    }
    $scope.multiCheck = function () {
        $scope.list.forEach(function (item) {
            if(item.status==2)
                item.checked = $scope.media.multi;
        })
    }
    $scope.multiChecked = function (status) {
        for(var i=0;i <$scope.list.length;i++){
            if($scope.list[i].status==2 && $scope.list[i].checked != status)
                return;
        }
        $scope.media.multi = status;
    }
    $scope.multiPass = function () {
        var ids = "",n = 0;
        $scope.list.forEach(function (item) {
            if(!item.status && item.checked){
                ids+= (item.exitId) +","; 
                n++;
            }
        });
        if(n>0){
            return ids.substring(0,ids.length - 1);
        }else
            return null;
    }
    $scope.warning = function () {
        swal("提示","本功能正在开发中，敬请期待", "error");
    }
    //审批
    $scope.passWork = function(fun){
        if(fun && typeof fun == 'string')$scope.work.exitId=fun;
        swal({   
            title: "确认",   
            text: "确定要审批这些申请吗？",   
            type: "warning",   
            showCancelButton: true,   
            confirmButtonColor: "#2772ee",   
            confirmButtonText: "确定",   
            cancelButtonText: "取消",   
            closeOnConfirm: false 
        }, 
        function(){   
            $rootScope.loading = true;
            GraduationService.check({
                exitids:$scope.work.exitId || '',
                adminid:AppConfig.adminId
            }).success(function(data){
                if(data.code == 0){
                    swal("提示", "审批成功！", "success"); 
                    refresh();
                    if(fun && typeof fun == 'function')fun();
                }else if(data.code == 4037){
                    swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
                    location.href="#login";$rootScope.loading = false;
                }
                else
                    swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
                
                $rootScope.loading = false;
            });
        });
        
    }
    
    //二级连选的select
    $scope.selecter = {
        collegeId:"",
        classList:[],
        classId:'',
        grade:'',
        collegeList:[],
        listClass:[],
        collegeSelecter : function(n){
            //用collegeId获取classList
            if(n){
                this.classId = '';
                var college = $filter('filter')(this.collegeList,{collegId:this.collegeId});
                this.listClass = (college.length>0 && college[0].listClass)?college[0].listClass : [];
                this.collegeName = (college.length>0 && college[0].collegeName)?college[0].collegeName : "";
            }
            else if(this.collegeId){
                this.classId = '';
                var college = this.collegeId?$filter('filter')($rootScope.treeCollege[0].collegeList,{collegeId:this.collegeId}):[];
                this.classList = (college.length>0 && college[0].classList)?college[0].classList : [];
            }
        },
        classSelecter : function(){
            //用classId反向获取collegeId和classList
            var college = $rootScope.treeCollege[0].collegeList;
            for(var i=0;i<college.length;i++){
                var list = this.classId?$filter('filter')(college[i].classList,{classId:this.classId}):[];
                if(list.length > 0){
                    this.collegeId = college[i].collegeId;
                    this.classList = college[i].classList;
                    break;
                }
            }
        },
        gradeSelecter:function () {
            //用grade获取collegeList
            if(this.grade){
                this.classId = '';
                this.collegeId = '';
                this.listClass = [];
                var colleges = $filter('filter')($scope.college,{grade:this.grade});
                this.collegeList = (colleges.length>0 && colleges[0].listColleg)?colleges[0].listColleg : [];
            }
        },
        
        init : function(){
            //将select置空
            this.collegeId = "";
            this.classId = "";
            this.classList = [];
            this.listClass = [];
            this.collegeList = [];
            this.grade = "";
        }
    }
    $scope.dataInit = function(){
        $scope.selecter.init();
        $scope.form.classList = [];
        $scope.form.student = null;
        $scope.form.studentName = '';
        $scope.form.studentList = null;
    }
    $scope.form = {
        classList:[],
        addClass:function (cla) {
            if(cla.check){
                cla.collegeName = $scope.selecter.collegeName;
                cla.grade = $scope.selecter.grade;
                this.classList.push(cla);
            }else{
                this.delClass(cla);
            }
            
        },
        delClass:function (cla) {
            for(var i=0;i <this.classList.length;i++){
                if(this.classList[i].classId == cla.classId){
                    cla.check = false;
                    this.classList.splice(i,1);
                }
            }
        },
        student:null,
        studentName:'',
        studentList:null,
        studentSearch:function () {
            if($scope.selecter.classId.length < 0 ||$scope.selecter.collegeId.length < 0 || this.studentName.length < 0)return;
            var that = this;
            $rootScope.loading = true;
            StudentService.getListWithBed({
                keyword:this.studentName,
                collegeid:$scope.selecter.collegeId,
                classid:$scope.selecter.classId
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
            console.log(student);
        },
        sub:function (fun) {
            $rootScope.loading = true;
            GraduationService.add({
                studentkey:this.student.studentKey,
                adminid:AppConfig.adminId,
                bedid:this.student.bedId
            }).success(function (data) {
                $rootScope.loading = false;
                if(data.code == 0){
                    swal("提示", "提交成功！", "success"); 
                    refresh();
                    if(fun && typeof fun == 'function')fun();
                }else if(data.code == 4037){
                    swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
                    location.href="#login";$rootScope.loading = false;
                }
                else
                    swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
                console.log(data);
                
            })
        },
        multiSub:function (fun) {
            if(this.classList.length < 1)return;
            var ids = "";
            this.classList.forEach(function (cla) {
                ids += cla.classId + ',';
            })
            ids = ids.substring(0,ids.length-1);
            $rootScope.loading = true;
            GraduationService.add({
                type:1,
                adminid:AppConfig.adminId,
                classids:ids
            }).success(function (data) {
                $rootScope.loading = false;
                if(data.code == 0){
                    swal("提示", "提交成功！", "success"); 
                    refresh();
                    if(fun && typeof fun == 'function')fun();
                }else if(data.code == 4037){
                    swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
                    location.href="#login";$rootScope.loading = false;
                }
                else
                    swal("提示","错误代码："+ data.code + '，' + data.msg, "error"); 
                console.log(data);
                
            })
        }
    }
}]);