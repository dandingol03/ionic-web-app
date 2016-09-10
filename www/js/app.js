// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova','ngBaiduMap','ionic-datepicker'])

    .config(function(baiduMapApiProvider) {
      baiduMapApiProvider.version('2.0').accessKey('2me89doy9NE2HgG7FmTXa0XZsedThXDD');
    })


    .run(function($ionicPlatform,$rootScope) {

    $rootScope.myGoBack = function() {
      //$rootScope.$ionicGoBack();
      var backView = $ionicHistory.backView();
      backView.go();
    };


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

    });
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

    /**
     * 寿险列表详情
     */
    .state('life_insurance_detail',{
      url:'/life_insurance_detail/:insurance',
      controller:'lifeDetailController',
      templateUrl:'views/life_insurance_detail/life_insurance_detail.html'
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
      url:'/car_orders/:selected',
      controller:'carOrdersController',
      templateUrl:'views/car_orders/car_orders.html'
    });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/car_orders');

})
    .factory('BaiduMapService', function($q, baiduMapApi) {
      return {
        getLocalCity: function() {
          return baiduMapApi.then(function(BMap) {
            var localcity = new BMap.LocalCity();
            return $q(function(resolve, reject) {
              localcity.get(function(r) {
                resolve(r);
              });
            });
          });
        }
        ,
        getBMap:function(callback){
          baiduMapApi.then(function(BMap) {
            callback(BMap);
          });
        }
      };
    })
