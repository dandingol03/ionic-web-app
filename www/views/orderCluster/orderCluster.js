angular.module('starter')
  .controller('orderClusterController',function($scope,$state,$http, $location,$rootScope,$ionicModal,ionicDatePicker){

    //TODO:add selecte item css highlight

    $scope.tabs=[
      {name:'待支付订单',activated:false,orders:
        [
        {
          type:'车险',schemes:[
          {name:'brazil',coverage:300,fee:500,spectum:2},
          {name:'honda',coverage:300,fee:500,spectum:1},
          {name:'R1',coverage:300,fee:500,spectum:1},]
        },
        {
          // {name:'新华保险',coverage:1205,fee:3000,'缴费期间':'3年','保额期间':'3年','首年保费':400000},
          type:'寿险',main:{name:'新华保险',coverage:1205,fee:3000,'缴费期间':'3年','保额期间':'3年','首年保费':400000},additions:[
          {name:'addition1',fee:300},
          {name:'addition2',fee:800}]
        },
        {
          type:'寿险',main:{name:'india洋',coverage:300,fee:200},additions:[
          {name:'addition1',fee:300},
          {name:'addition2',fee:800}]
        }
      ]},
      {name:'已完成订单',activated:false,orders:[]},
      {name:'估价中订单',activated:false,orders:[]}
    ];

    $scope.tabIndex=0;

    /**
     * 不同状态订单切换的回换
     */
    $scope.tab_change=function(i){
      $scope.tabIndex=i;
    }


    $scope.detail_ref=function(type,order,i){
      switch(type)
      {
        case '车险':
          $scope.openModal();
          $scope.confirm=function(){
            switch($scope.motor.step)
            {
              case 'specials':
                $scope.modalClose();
                $rootScope.orders[$scope.tabIndex].orders.splice(i,1);
                $state.go('motor_insurance');
                break;
              case 'schemes':
                $scope.modalClose();
                $state.go('motor_plan',{order:order});
                break;
            }

          }
              break;
        case '寿险':

              break;
        default:
              break;
      }
    }

    /*** init motor_insurance_select modal ***/
    $scope.motor_steps=['specials','schemes'];
    $scope.motor={};
    $scope.motor.step=$scope.motor_steps[0];
    $ionicModal.fromTemplateUrl('views/modal/edit_motor_insurance.html',{
      scope:  $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal= function(){
      $scope.modal.show();
    };

    $scope.modalClose= function() {
      $scope.modal.hide();
    };

    /*** init motor_insurance_select modal ***/


    $scope.go_back=function(){
      window.history.back();
    };





    $scope.buy=function(){
      //最终购买,即支付时,要区分寿险和车险,并更改订单状态为已完成:finished
      };



  });
