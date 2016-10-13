// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova','ngBaiduMap','ionic-datepicker','LocalStorageModule'])

  .config(function(baiduMapApiProvider) {
    baiduMapApiProvider.version('2.0').accessKey('hxMVpPXqcpdNGMrLTGLxN3mBBKd6YiT6');
  })


    .run(function($ionicPlatform,$rootScope,$interval,
                  $cordovaToast,$ionicHistory,$location,
                  $ionicPopup,Proxy,$http) {



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


      $rootScope.waitConfirm={};

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

      var onReceiveNotification = function(data) {
        try{

          console.log('received notification :' + data);
          alert('notification got');
          var notification = angular.fromJson(data);
          //app 是否处于正在运行状态
          var isActive = notification.notification;

          // here add your code


          //ios
          if (ionic.Platform.isIOS()) {
            window.alert(notification);

          } else {
            //非 ios(android)
          }
        }catch(e)
        {
          alert(e);
        }
      };

      //获取自定义消息的回调
      $rootScope.onReceiveMessage = function(event) {
        try{
          alert('got message');
          var message=null;
          if(device.platform == "Android") {
            message = event.message;
          } else {
            message = event.content;
          }

          if(Object.prototype.toString.call(message)!='[object Object]')
          {
            message = JSON.parse(message);
          }else{}
          alert('unitName=' + message.unitName);
          if(message.type!=undefined&&message.type!=null){
            switch(message.type){
              case 'to-customer':
                var order=message.order;
                var servicePersonId=message.servicePersonId;
                alert('orderId='+order.orderId);

                if($rootScope.waitConfirm[order.orderId]==undefined||
                  $rootScope.waitConfirm[order.orderId]==null)
                  $rootScope.waitConfirm[order.orderId]=[];
                $rootScope.waitConfirm[order.orderId].push(message);

                var tem='';
                for(var i=0;i<$rootScope.waitConfirm[order.orderId].length;i++){
                  var msg=$rootScope.waitConfirm[order.orderId][i];
                  var mobilePhone=null;
                  if(msg.mobilePhone!==undefined&&msg.mobilePhone!==null)
                    mobilePhone=msg.mobilePhone;
                  else
                    mobilePhone='';
                  tem='<div>'+msg.unitName+ mobilePhone+'</div>'
                }


                var confirmPopup = $ionicPopup.confirm({
                  title: '您的订单'+$rootScope.waitConfirm[order.orderId][0].order.orderNum,
                  template: tem
                });


                var confirm_cb=function(){
                  $http({
                    method: "post",
                    url: Proxy.local()+"/svr/request",
                    headers: {
                      'Authorization': "Bearer " + $rootScope.access_token
                    },
                    data: {
                      request:'setServicePersonInOrder',
                      info:{
                        orderId: order.orderId,
                        servicePersonId:servicePersonId,
                        candidateState:3
                      }
                    }
                  }).then(function(res) {
                    var json=res.data;
                    if(json.re==1){
                      return $http({
                        method: "POST",
                        url: Proxy.local() + "/svr/request",
                        headers: {
                          'Authorization': "Bearer " + $rootScope.access_token
                        },
                        data: {
                          request: 'getServicePersonIdsByOrderId',
                          info: {
                            orderId: order.orderId,
                          }
                        }
                      })
                    }

                  }).then(function(res) {
                    var json = res.data;
                    var servicePersonIds=[];
                    if(json.re==1){
                      json.data.map(function(item,i) {
                        if(item!=servicePersonId)
                          servicePersonIds.push(item);
                      })
                      return $http({
                        method: "POST",
                        url: Proxy.local() + "/svr/request",
                        headers: {
                          'Authorization': "Bearer " + $rootScope.access_token
                        },
                        data: {
                          request: 'sendCustomMessage',
                          info: {
                            type: 'confirm-to-service-person',


                          }
                        }
                      })
                    }
                  }).catch(function(err) {
                    var str='';
                    for(var field in err)
                      str+=err[field];
                    alert('error=' + str);
                  })
                }

                confirmPopup.then(function(res) {

                  if(res) {
                    alert('orderId=' + order.orderId);
                    alert('svpersonid=' + servicePersonId);
                    $http({
                      method: "post",
                      url: Proxy.local()+"/svr/request",
                      headers: {
                        'Authorization': "Bearer " + $rootScope.access_token
                      },
                      data: {
                        request:'updateCandidateStateByOrderId',
                        info:{
                          orderId: order.orderId,
                          servicePersonId:servicePersonId,
                          candidateState:3
                        }
                      }
                    }).then(function(res) {
                      var json=res.data;
                      if(json.re==1) {
                        return $http({
                          method: "POST",
                          url: Proxy.local() + "/svr/request",
                          headers: {
                            'Authorization': "Bearer " + $rootScope.access_token
                          },
                          data: {
                            request: 'getServicePersonIdsByOrderId',
                            info: {
                              orderId: order.orderId,
                            }
                          }
                        });

                      }
                    }).then(function(res) {
                      var json=res.data;
                      if(json.re==1) {
                        var servicePersonIds=[];
                        json.data.map(function(item,i) {
                          if(item!=servicePersonId)
                            servicePersonIds.push(item);
                        })
                        return $http({
                          method: "POST",
                          url: Proxy.local() + "/svr/request",
                          headers: {
                            'Authorization': "Bearer " + $rootScope.access_token
                          },
                          data: {
                            request: 'sendCustomMessage',
                            info: {
                              type: 'confirm-to-service-person',
                              servicePersonIds:servicePersonIds,
                              order:order
                            }
                          }
                        });
                      }
                    }).catch(function(err) {
                      var str='';
                      for(var field in err)
                          str+=err[field];
                      alert('error=\r\n' + str);
                    })
                  } else {
                    console.log('You are not sure');
                  }
                });


                break;
            }
          }

          }catch(e){
          alert('exception=\r\n' + e.toString());
        }
      }


      var onGetRegistradionID = function(data) {
        try {
          alert("JPushPlugin:registrationID is " + data);
          if(data!==undefined&&data!==null)
            $rootScope.registrationId=data;
        } catch(exception) {
         alert(exception);
        }
      }

      $rootScope.onGetRegistradionID = function(data) {
        try {
          console.log("JPushPlugin:registrationID is " + data);
        } catch(exception) {
          alert(exception);
        }
      }

      try{
        window.plugins.jPushPlugin.init();
        window.plugins.jPushPlugin.getRegistrationID(onGetRegistradionID);
        document.addEventListener("jpush.receiveMessage",$rootScope.onReceiveMessage, false);
        document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
        window.plugins.jPushPlugin.getUserNotificationSettings(function(result) {
          if(result == 0) {
            // 系统设置中已关闭应用推送。
            alert('system has canceled notification');
          } else if(result > 0) {
            // 系统设置中打开了应用推送。
            alert('system has opened notification');
          }
        });
      }catch(e)
      {
        console.error('error=\r\n'+e);
      }


      //try{
      //  window.plugins.jPushPlugin.init();
      //  document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
      //  window.plugins.jPushPlugin.getRegistrationID($scope.onGetRegistradionID);
      //  document.addEventListener("jpush.receiveMessage", $rootScope.onReceiveMessage, false);
      //  window.plugins.jPushPlugin.setDebugMode(true);
      //}catch(e)
      //{
      //  alert('error=\r\n' + e.toString());
      //}

      // window.plugins.jPushPlugin.setTags(['game']);
      //document.addEventListener("jpush.setTagsWithAlias", onTagsWithAlias, false);

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
        url:'/dashboard/:params',
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

      .state('tabs.chatter', {
        url: '/chatter',
        views: {
          'chatter-tab': {
            controller: 'chatterController',
            templateUrl: 'views/chatter/chatter.html'
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
        url:'/locate_maintain_nearby/:locateType',
        controller:'locateMaintainNearbyController',
        templateUrl:'views/locate_maintain_nearby/locate_maintain_nearby.html'
      })

      .state('locate_airport_nearby',{
        url:'/locate_airport_nearby/:locateType',
        controller:'locateAirportNearbyController',
        templateUrl:'views/locate_airport_nearby/locate_airport_nearby.html'
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

  .factory('Proxy', function() {
    var ob={
      local:function(){
        if(window.cordova!==undefined&&window.cordova!==null)
          return "http://192.168.1.106:3000";
        else
          return "/proxy/node_server";
      },
      remote:function(){
        if(window.cordova!==undefined&&window.cordova!==null)
          return 'http://202.194.14.106:3000';
        else
          return '/proxy/node_remote';
      }
    }
    return ob;
  })

  .factory('$WebSocket',function(){
    var self=this;

      self.cbs=[];

      self.msgId=1;

      self.getMsgId=function()
      {
        return self.msgId++;
      }

      self.connect=function(cb){
        self.ws = new window.WebSocket('ws://202.194.14.106:3010');
        self.ws.onopen=self.onopen;
        self.ws.onmessage=self.onmessage;
      }
      self.onopen=function(message) {
        console.log('websocket connection is established');
        self.cbs.map(function(item,i) {
          item(message);
        });
      }
      self.onerr=function(err) {
        console.log('connect error');
      }
      self.onclose=function(event) {
        console.log('websocket shutdown from server' + event.code);
      }
      self.onmessage=function(event) {
        console.log('got message=\r\n' + event.data);
      }
      self.send=function(msg) {
        var info=msg;
        if(Object.prototype.toString.call(info)!='[object String')
          info=JSON.stringify(info);
        self.ws.send(info);
      }
      self.registeCallback=function(cb) {
        var flag=false;
        self.cbs.map(function(item,i) {
          if(item==cb)
            flag=true;
        })
        if(!flag)
        self.cbs.push(cb);
      };
      self.unregisteCallback=function(cb) {
        self.cbs.map(function(item,i) {
          if(item==cb)
            self.cbs.slice(i, 1);
        })
      };

    return self;
  })



