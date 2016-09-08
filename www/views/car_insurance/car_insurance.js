/**
 * Created by yiming on 16/9/7.
 */
angular.module('starter')

  .controller('carInsuranceController',function($scope,$state,$http, $location,
                                                $rootScope,$ionicActionSheet,$ionicModal){

    $scope.tabIndex=0;

    $scope.tab_change=function(i) {
      $scope.tabIndex=i;
    };


    $scope.car_ins_plan={};
    $scope.car_ins_plans=[//应该从服务器取
      {companyName:'公司A',sum:2000,fee:1000,types:[{name:'交强险',price:1000,fee:10},{name:'车辆损失险',price:500,fee:20},{name:'第三者责任险',price:500,fee:10}]},
      {companyName:'公司B',sum:2000,fee:1000,types:[{name:'车身划痕损失险',price:1000,fee:10},{name:'车辆损失险',price:500,fee:20},{name:'第三者责任险',price:500,fee:10}]},
      {companyName:'公司C',sum:2000,fee:1000,types:[{name:'不计免赔',price:1000,fee:10},{name:'车辆损失险',price:500,fee:20},{name:'第三者责任险',price:500,fee:10}]}
    ];



    //获得车险险种列表

    $http.get("http://202.194.14.106:9030/insurance/project_provide")
    .then(function(response){
      var data=response.data;
      if(data.projects!=null&&data.projects!=undefined)
      {
        var projects=data.projects;
        if(Object.prototype.toString.call(projects)!='[object Array]')
          projects=JSON.parse(projects);

        $scope.specials=projects;//从测试服务器取到险种列表,付给coverages数组。
        return true;
      }else{
        return false;
      }




    }).then(function(re){
      $scope.tabs=[
        {type:'车险险种',insurances:$scope.specials},
        {type:'车险计划书',insurances:[]}
      ];
    });



    $scope.apply=function () {//选好险种提交时做的动作

      $scope.car_insurance.state='pricing';//状态是估价中订单

      $rootScope. car_insurance=$scope.car_insurance;


      $scope.coverages.map(function (coverages, i) {
        if($scope.coverage.flag==true){
          $scope.selected.push(coverage);
        }
      });

      //TODO:push selected to back-end
      //TODO:receive the shemes from back-end


      $state.go('motor_plan',{plan:[]});//跳到车险方案列表页面,并传递选中的险种和相应保额作为参数。

    }




    $scope.go_back=function(){
      window.history.back();
    }

    //车险保额选择
    $scope.price_select=function(item,prices) {
      if (prices !== undefined && prices !== null &&prices.length > 0)
      {
        var buttons=[];
        prices.map(function(price,i) {
          buttons.push({text: price});
        });
        $ionicActionSheet.show({
          buttons:buttons,
          titleText: '选择你的保额',
          cancelText: 'Cancel',
          buttonClicked: function(index) {
            item.price = prices[index];
            return true;
          },
          cssClass:'motor_insurance_actionsheet'
        });
      }
      else
      {}
    }

    $scope.actionSheet_show = function() {

      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: '<b>Share</b> This' },
          { text: '<b>Share</b> This' },
          { text: '<b>Share</b> This' },
          { text: '<b>Share</b> This' },
          { text: '<b>Share</b> This' },
          { text: '<b>Share</b> This' },
          { text: '<b>Share</b> This' },
          { text: '<b>Share</b> This' },
          { text: '<b>Share</b> This' },
          { text: '<b>Share</b> This' },
          { text: 'Move' }
        ],
        titleText: 'select your favourite project ',
        cancelText: 'Cancel',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          return true;
        },
        cssClass:'center'
      });
    };






    /**************方案详情模态框*************************/
    $ionicModal.fromTemplateUrl('/views/modal/car_detail_modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.car_detail_modal = modal;
    });
    $scope.openModal = function() {
      $scope.car_detail_modal.show();
    };
    $scope.closeModal = function() {
      $scope.car_detail_modal.hide();
    };
  });
/**************方案详情模态框*************************/
