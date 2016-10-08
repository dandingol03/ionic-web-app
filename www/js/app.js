// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova','ngBaiduMap','ionic-datepicker'])

    .config(function(baiduMapApiProvider) {
      baiduMapApiProvider.version('2.0').accessKey('hxMVpPXqcpdNGMrLTGLxN3mBBKd6YiT6');
    })

    .run(function($ionicPlatform,$rootScope,$interval,$cordovaToast,$ionicHistory,$location) {

    $rootScope.car_orders=[
        [
          {feeDate:"2016-02-01",carNum:"鲁A00003",insuranceFeeTotal:2000},
          {feeDate:"2016-03-17",carNum:"鲁A00003",insuranceFeeTotal:2000},
          {feeDate:"2016-05-20",carNum:"鲁A00003",insuranceFeeTotal:2000}
        ],
      {},
      [
        {companyName:'',products:[]},
        {companyName:'',products:[]}
      ]
    ];

    $rootScope.car_insurance={
      prices:[
        {
          companyName:'永安财产保险',
          products: [
            {
              productId:1,productName:'车辆损失险',insuranceType:null
            },
            {
              productId:null,insuranceType:null,productName:'第三者责任险',
              insuranceTypes:['5万','10万','20万']
            }
          ]
        },
        {
          companyName:'泰山财产保险',
          products:[
            {
              productId:1,productName:'车辆损失险',insuranceType:null
            },
            {
              productId:2,insuranceType:'5万',productName:'第三者责任险'
            }
          ]
        }
      ]

    };

    //定时器刷新获取订单
    var timer=$interval(function(){
      console.log('....timer logging');
    },200,10);
    timer.then(function(){
      console.log('log over');
    },function(){
    });

    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)

      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

     // window.plugins.jPushPlugin.init();
     // window.plugins.jPushPlugin.setDebugMode(true);

      //获取自定义消息的回调
      var onReceiveMessage = function(event) {
        try{
          var message=null;
          if(device.platform == "Android") {
            message = event.message;
          } else {
            message = event.content;
          }
          alert('message=' + message);
        } catch(exception) {
          console.log("JPushPlugin:onReceiveMessage-->" + exception);
        }
      }

      var onTagsWithAlias = function(event) {
        try {
          console.log("onTagsWithAlias");
          var result = "result code:" + event.resultCode + " ";
          result += "tags:" + event.tags + " ";
          result += "alias:" + event.alias + " ";
          alert('result=\r\n' + result);
        } catch(exception) {
          console.log(exception);
        }
      }


      //window.plugins.jPushPlugin.setTags(['game']);
      //document.addEventListener("jpush.setTagsWithAlias", onTagsWithAlias, false);
      //document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);


    });

    //双击退出
    $ionicPlatform.registerBackButtonAction(function (e) {
      //判断处于哪个页面时双击退出
      if ($location.path() == '/login') {
        if ($rootScope.backButtonPressedOnceToExit) {
          ionic.Platform.exitApp();
        } else {
          $rootScope.backButtonPressedOnceToExit = true;
          //TODO:delete record in info-person-online
          //TODO:delete record in


          $cordovaToast.showShortTop('再按一次退出系统');
          setTimeout(function () {
            $rootScope.backButtonPressedOnceToExit = false;
          }, 2000);
        }
      }
      else if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        $rootScope.backButtonPressedOnceToExit = true;
        $cordovaToast.showShortTop('再按一次退出系统');
        setTimeout(function () {
          $rootScope.backButtonPressedOnceToExit = false;
        }, 2000);
      }
      e.preventDefault();
      return false;
    }, 101);


})

  .config(function (ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: [6]
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })



.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js


    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('left');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');


  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tabs',{
      url:'/tabs',
      abstract:true,
      templateUrl:'views/tabs/tabs.html'
    })

    .state('tabs.dashboard',{
      url:'/dashboard',
      views:{
        'dashboard-tab':{
          controller:'dashboardController',
          templateUrl:'views/dashboard/dashboard.html'
        }
      }
    })

    .state('tabs.my',{
      url:'/my',
      views:{
        'my-tab':{
          controller:'myController',
          templateUrl:'views/my/my.html'
        }
      }
    })

    .state('tabs.chatter',{
      url:'/chatter',
      views:{
        'chatter-tab':{
          controller:'chatterController',
          templateUrl:'views/chatter/chatter.html'
        }
      }
    })


    .state('login',{
      url:'/login',
      controller: 'loginController',
      templateUrl:'views/login/login.html'
    })

     .state('car_insurance',{
       url:'/car_insurance',
       controller:'carInsuranceController',
       templateUrl:'views/car_insurance/car_insurance.html'
    })


    .state('orderCluster',{
      url:'/orderCluster',
      controller:'orderClusterController',
      templateUrl:'views/orderCluster/orderCluster.html'
    })


    .state('lifePlanDetail',{
      url:'/life_plan_detail/:plan',
      controller:'lifePlanDetailController',
      templateUrl:'views/life_plan_detail/life_plan_detail.html'
    })

    /**
     * 个人信息=>['修改密码','退出登录']
     */
    .state('myInfo',{
      url:'/myInfo',
      controller:'myInfoController',
      templateUrl:'views/myInfo/myInfo.html'
    })

    .state('passwordModify',{
      url:'/passwordModify',
      controller:'passwordModifyController',
      templateUrl:'views/passwordModify/passwordModify.html'
    })

    .state('car_orders',{
      cache:false,
      url:'/car_orders/:selected',
      controller:'carOrdersController',
      templateUrl:'views/car_orders/car_orders.html'
    })

    .state('service_orders',{
      cache:false,
      url:'/service_orders',
      controller:'serviceOrdersController',
      templateUrl:'views/service_orders/service_orders.html'
    })

    .state('service_order_detail',{
      url:'/service_order_detail/:order',
      controller:'serviceOrderDetailController',
      templateUrl:'views/service_order_detail/service_order_detail.html'
    })

    .state('life_insurance_orders',{
      cache: false,
      url:'/life_insurance_orders/:tabIndex',
      controller:'lifeInsuranceOrdersController',
      templateUrl:'views/life_insurance_orders/life_insurance_orders.html'
    })


    .state('integration', {
      url: '/integration',
      controller: 'integrationController',
      templateUrl: 'views/integration/integration.html'
    })

    .state('uploadPhoto', {
      url: '/uploadPhoto',
      controller: 'uploadPhotoController',
      templateUrl: 'views/uploadPhoto/uploadPhoto.html'
    })

    .state('car_order_detail',{
      url:'/car_order_detail/:order',
      controller:'carOrderDetailController',
      templateUrl:'views/car_order_detail/car_order_detail.html'

    })

    .state('life_insurance_product_list',{
      url:'/life_insurance_product_list',
      controller:'lifeInsuranceProductList',
      templateUrl:'views/life_insurance_product_list/life_insurance_product_list.html'
    })

    .state('locate_maintain_nearby',{
      url:'/locate_maintain_nearby',
      controller:'locateMaintainNearbyController',
      templateUrl:'views/locate_maintain_nearby/locate_maintain_nearby.html'
    })

    .state('transclude',{
      url:'/transclude',
      controller:'transcludeController',
      templateUrl:'views/transclude/transclude.html'
    })

  // if none of the above states are matched, use this as the fallback

    $urlRouterProvider.otherwise('/login');

  })

  .factory('BaiduMapService', function($q, baiduMapApi) {

      return {
        getBMap:function(){
          var deferred=$q.defer();
          baiduMapApi.then(function(BMap) {
            deferred.resolve(BMap);
          });
          return deferred.promise;
        }
      };
    })
