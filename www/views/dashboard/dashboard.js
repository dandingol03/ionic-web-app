angular.module('starter')

  .controller('dashboardController',function($scope,$state,$http, $location,
                                             $rootScope,$ionicModal,$timeout,
                                             $cordovaCamera,ionicDatePicker,
                                             $ionicActionSheet,BaiduMapService){


    $scope.goto=function(url){
      $location.path(url);
    };



    //use factory to improve
    $scope.datepick = function(){
      var ipObj1 = {
        callback: function (val) {  //Mandatory
          var t1 = document.getElementById('date');//根据id获取input节点
          var date=new Date(val);
          var month=parseInt(date.getMonth())+1;
          t1.value=date.getFullYear()+'-'+month+'-'+date.getDate();
        },
        disabledDates: [            //Optional
          new Date(2016, 2, 16),
          new Date(2015, 3, 16),
          new Date(2015, 4, 16),
          new Date(2015, 5, 16),
          new Date('Wednesday, August 12, 2015'),
          new Date("08-16-2016"),
          new Date(1439676000000)
        ],
        from: new Date(1949, 10, 1), //Optional
        to: new Date(2040, 10, 30), //Optional
        inputDate: new Date(),      //Optional
        mondayFirst: false,          //Optional
        disableWeekdays: [0],       //Optional
        closeOnSelect: false,       //Optional
        templateType: 'popup'     //Optional
      };
      ionicDatePicker.openDatePicker(ipObj1);
    };


    $scope.car={};

    /*** bind car modal ***/
    $ionicModal.fromTemplateUrl('views/modal/bind_car.html',{
      scope:  $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.bind_car_modal = modal;
    });

    $scope.openCarModal= function(){
      $scope.bind_car_modal.show();

    };

    $scope.closeCarModal= function() {
      $scope.bind_car_modal.hide();
    };
    /*** bind car modal ***/

    /*** bind coverage_tab_modal ***/
    $ionicModal.fromTemplateUrl('views/modal/coverage_tab_modal.html',{
      scope:  $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.coverage_tab_modal = modal;
    });

    //待定
    $scope.open_lifeModal= function(){
        $scope.coverage_tab_modal.show();
    };


    $scope.close_lifeModal= function() {
      $scope.coverage_tab_modal.hide();
    };
    /*** bind coverage_tab_modal ***/




    $scope.check_carInfo=function(){
      if($rootScope.car!==undefined&&$rootScope.car!==null)
      {

      }else{
        $timeout(function(){
          $scope.openModal();
        },300);
      }
    };

    $scope.select_type=function(){
      $state.go('car_insurance');
    }

    $scope.addPicture = function(type) {

      $ionicActionSheet.show({
        buttons: [
          { text: '拍照' },
          { text: '从相册选择' }
        ],
        titleText: '选择照片',
        cancelText: '取消',
        cancel: function() {
          return true;
        },
        buttonClicked: function(index) {
          if(index == 0){
            $scope.takePhoto=function(){
              var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: 1,
                saveToPhotoAlbum: true
              };

            }
          }else if(index == 1){
            var options = {
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: 0
            };
          }

          $cordovaCamera.getPicture(options).then(function(imageURI) {
            $scope.car[type].imageSrc= imageURI;

          }, function(err) {
            // error
          });
          return true;
        }
      });
    }

    $scope.life_insurance=
    {
      applicant:{},
      insuredPerson:{}
    };

    $scope.car={};

    $scope.apply=function () {
      $scope.life_insurance.state = 'pricing';//订单状态是报价中
      $rootScope.life_insurance = $scope.life_insurance;
      $scope.close_lifeModal();
    }


    //车险险种选择
    $scope.specials_apply=function(){
      var specials=[];
      $scope.motor_specials.map(function (special, i) {
        if(special.checked==true)
          specials.push(special);
      });
      if(specials.length==0)
        alert("请选择一项险种");
      else{
        //TODO:inject into $rootScope
        $rootScope.specials=specials;
        for(var i=0;i<specials.length;i++){
        delete $rootScope.specials[i].$$hashKey;
        }
      }
    }




    //返回寿险产品列表
    $http({
      method: "POST",
      url: "/proxy/node_server/svr/request",
      headers: {
        'Authorization': "Bearer " + $rootScope.access_token,
      },
      data:
      {
        request:'getLifeInsuranceProducts',
        info:$scope.carInfo
      }
    }).then(function(res) {
      var data=res.data;
      var life_insurance_products=[];
      if(data.re==1)
      {
        data.data.map(function(record,i) {
          if(record!==undefined&&record!==null)
            life_insurance_products.push(record);
        });
      }else{
      }
      $scope.life_insurances=life_insurance_products;
      return  $http.get("http://202.194.14.106:9030/insurance/project_provide");
    }).then(function (res) {
      if(res.data!==undefined&&res.data!==null)
      {
        var data=res.data;
        var projects=data.projects;
        if(Object.prototype.toString.call(projects)!='[object Array]')
          projects=JSON.parse(projects);
        $scope.motor_specials=projects;
        return true;
      }
      else
        return false;

    }).then(function(re) {
      if(re==true)
      {
        $scope.tabs=[
          {type:'车险',insurances:$scope.motor_specials},
          {type:'寿险',insurances:$scope.life_insurances},
          {type:'维修'},
          {type:'车驾管服务',
            services:[
              {name:'代办车辆年审',href:''},
              {name:'代办驾驶证年审',href:''},
              {name:'取送车',href:''},
              {name:'接送机',href:''},
              {name:'违章查询',href:''}
            ]
          }
        ];
      }
    }).catch(function (err) {
      console.log('server fetch error');
    });

    //寿险详情展示
    $scope.setDetail=function(item){
      if(item.show_detail!=true)
        item.show_detail=true;
      else
        item.show_detail=false;
    }

    //寿险产品勾选
    $scope.toggle_lifeinsurance_product=function(item){
      if($scope.life_insurance.product!==undefined&&$scope.life_insurance.product!==null)
      {
        if($scope.life_insurance.product.productId==item.productId)
            $scope.life_insurance.product=null;
        else
          $scope.life_insurance.product=item;
      }else{
        $scope.life_insurance.product=item;
      }
    }





    $scope.tabIndex=0;

    $scope.tab_change=function(i){
      $scope.tabIndex=i;
    };

    $scope.life_insuranse={};
    $scope.detail_ref=function(insurance){
      switch($scope.tabIndex)
      {
        case 0:
              break;
        case 1:
          $state.go('life_insurance_detail',{insurance:JSON.stringify(insurance)});
              break;
        default:
              break;
      }
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

    //绑定车主信息
    $scope.bind_car=function(){
      $rootScope.carInfo=$scope.carInfo;
      $state.go('car_insurance');
    }




    $scope.service='代办车辆年审';
    $scope.services=[
      '代办车辆年审',
      '代办驾驶证年审',
      '取送车',
      '接送机',
      '违章查询'
    ];

    //维修救援

    $scope.subTabIndex=0;
    $scope.subTab_change=function(i) {
      $scope.subTabIndex=i;
    };
    $scope.dailys=[{name:'机油,机滤'},{name:'机油,三滤'},{name:'更换刹车片'},{name:'雨刷片更换'},{name:'轮胎更换'}]
    $scope.daily={};
    $scope.selected_daily=[];

    $scope.commit_daily=function(){
      dailys.map(function(daily,i) {
        if(daily.checked)
           selected_daily.push(daily);
      });
      $rootScope.selected_daily= $scope.selected_daily;

    }
















      //维修救援
      $scope.maintain={
        tabs:['日常保养','故障维修','事故维修'],
        tab:'日常保养',
        items:{}
      };

      $scope.accident={

      };


    //车驾管服务

    //选择车驾管服务项目
    $scope.services=["代办车辆年审","代办行驶证年审","接送机","取送车","违章查询"];
    $scope.service="代办车辆年审";

    $scope.service_select=function(services) {
      if (services !== undefined && services !== null &&services.length > 0)
      {
        var buttons=[];
        services.map(function(service,i) {
          buttons.push({text: service});
        });
        $ionicActionSheet.show({
          buttons:buttons,
          titleText: '选择你的保额',
          cancelText: 'Cancel',
          buttonClicked: function(index) {
            $scope.service = services[index];
            return true;
          },
          cssClass:'motor_insurance_actionsheet'
        });
      }
      else
      {}
    }

    $scope.actionSheet_show = function() {

      // Show the acti2e1on sheet
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


    $scope.addresses=['tow1','tow2','tow3'];
    $scope.address=$scope.addresses[0];
    $scope.addresses_select=function(addresses) {
      if (addresses !== undefined && addresses !== null &&addresses.length > 0)
      {
        var buttons=[];
        addresses.map(function(address,i) {
          buttons.push({text: address});
        });
        var address=$scope.address;
        $ionicActionSheet.show({
          buttons:buttons,
          titleText: '选择你的保额',
          cancelText: 'Cancel',
          buttonClicked: function(index) {
            $scope.address = $scope.addresses[index];
            return true;
          },
          cssClass:'motor_insurance_actionsheet'
        });
      }
      else
      {}
    }



    $scope.service_persons=['person1','person2','person3'];
    $scope.service_person=$scope.service_persons[0];
    $scope.service_person_select=function(persones) {
      if (persones !== undefined && persones !== null &&persones.length > 0)
      {
        var buttons=[];
        persones.map(function(person,i) {
          buttons.push({text: person});
        });

        $ionicActionSheet.show({
          buttons:buttons,
          titleText: '选择你的服务人员',
          cancelText: 'Cancel',
          buttonClicked: function(index) {
            $scope.service_person = $scope.service_persons[index];
            return true;
          },
          cssClass:'motor_insurance_actionsheet'
        });
      }
      else
      {}
    }

    $scope.makePhone=function () {

    }

    //寿险的投保意向
    $scope.life_insurance={
      tabs:['insurancer','insuranced']
    };
    $scope.life_insurance.tab='insurancer';

    $scope.gurantees=['重疾','健康','理财'];
    $scope.guarantee=$scope.gurantees[0];
    $scope.gurantees_select=function()
    {

        var buttons=[];
        $scope.gurantees.map(function(person,i) {
          buttons.push({text: person});
        });

        $ionicActionSheet.show({
          buttons:buttons,
          titleText: '选择你需要的保障',
          cancelText: 'Cancel',
          buttonClicked: function(index) {
            $scope.gurantee = $scope.gurantees[index];
            return true;
          },
          cssClass:'motor_insurance_actionsheet'
        });
    }

    $scope.relations=['自己','老人','子女','配偶'];
    $scope.relation=$scope.relations[0];
    $scope.relation_select=function(){
      var buttons=[];
      $scope.relations.map(function(relation,i) {
        buttons.push({text: relation});
      });

      $ionicActionSheet.show({
        buttons:buttons,
        titleText: '选择被投保人关系',
        cancelText: 'Cancel',
        buttonClicked: function(index) {
          $scope.relation = $scope.relations[index];
          return true;
        },
        cssClass:'motor_insurance_actionsheet'
      });
    }

      //intial BMap service
      BaiduMapService.getBMap(function(BMap){

        /**
         * 自身定位
         */
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
          if(this.getStatus() == BMAP_STATUS_SUCCESS){
            //var mk = new BMap.Marker(r.point);
            //map.addOverlay(mk);
            //map.panTo(r.point);
            //alert('您的位置：'+r.point.lng+','+r.point.lat);
          }
          else {
            //alert('failed'+this.getStatus());
          }
        },{enableHighAccuracy: true});

      });

  });
