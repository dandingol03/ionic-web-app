/**
 * Created by danding on 16/9/6.
 * 山大默认经纬度为117.144816,36.672171
 * 1.$scope.maintain.maintenance,保存选中的维修厂
 */
angular.module('starter')

  .controller('locateParkCarNearbyController',function($scope,$state,$http,$timeout,$rootScope,
                                                       BaiduMapService,$cordovaGeolocation,$ionicModal,
                                                       Proxy,$stateParams,$ionicLoading) {
    $scope.airTransfer = {
      airTransfers: {}
    };

    if ($stateParams.locateType !== undefined && $stateParams.locateType !== null) {
      $scope.locateType = $stateParams.locateType;
    }

    $scope.filterType={
      destiny:false,
      maintenance:true
    }

    $scope.Mutex=function(item,cluster){
      if(cluster[item]!=true)
      {
        cluster[item]=true;
        for(var field in cluster)
        {
          if(field!=item)
            cluster[field]=false;
        }
        //选择目的地
        if(item=='destiny')
        {
          $scope.map.clearOverlays();
          $scope.map.addEventListener('click', $scope.clickFunc);
          $scope.appendSelfLocation($scope.BMap,$scope.map);

        }else//选择维修厂
        {
          $scope.appendAirportLocation($scope.BMap, $scope.map);
          $scope.fetchMaintennacesInArea($scope.BMap);
          $scope.map.removeEventListener('click', $scope.clickFunc);
          $scope.map.setZoom(9);
        }
      }
      else
        cluster[item]=false;
    }

    $scope.appendSelfLocation=function(BMap,map) {
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      // Setup the loader
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      $cordovaGeolocation
      .getCurrentPosition(posOptions)
        .then(function (position) {
          var lat = position.coords.latitude;
          var lng = position.coords.longitude;
          console.log(lng + ',' + lat);
          var ggPoint = new BMap.Point(lng, lat);
          var convertor = new BMap.Convertor();
          var pointArr = [];
          pointArr.push(ggPoint);

          var translateCallback = function (data) {
            if (data.status === 0) {
              var marker = new BMap.Marker(data.points[0]);
              map.addOverlay(marker);
              var label = new BMap.Label("转换后的您的位置", {offset: new BMap.Size(20, -10)});
              marker.setLabel(label); //添加百度label
              map.centerAndZoom(data.points[0],14);
              $ionicLoading.hide();
            }
          }
          convertor.translate(pointArr, 1, 5, translateCallback)
        }, function (err) {
          // error
          console.error('error=\r\n' + err.toString());
        });

    }

    $scope.appendAirportLocation=function(BMap,map){
      //设置本地位置
      var point = new BMap.Point(117.219, 36.852);
      var mk = new BMap.Marker(point);  // 创建标注
      map.addOverlay(mk);               // 将标注添加到地图中
      mk.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画// 。
      map.addControl(new BMap.NavigationControl());
      map.addControl(new BMap.ScaleControl());
      map.enableScrollWheelZoom(true);
      var label = new BMap.Label("遥墙机场", {offset: new BMap.Size(20, -10)});
      label.setStyle({
        color: '#222',
        fontSize: "12px",
        height: "20px",
        lineHeight: "20px",
        fontFamily: "微软雅黑",
        border: '0px'
      });
      mk.setLabel(label);
    }

    $scope.clickFunc=function(e){
      console.log('click point='+e.point.lng + "," + e.point.lat);
      $scope.destiny={lng: e.point.lng,lat: e.point.lat};
      var BMap=$scope.BMap;
      var mk = new BMap.Marker(e.point);  // 创建标注
      var map=$scope.map;
      map.addOverlay(mk);               // 将标注添加到地图中
      var label = new BMap.Label("目的地", {offset: new BMap.Size(20, -10)});
      label.setStyle({
        color: '#222',
        fontSize: "12px",
        height: "20px",
        lineHeight: "20px",
        fontFamily: "微软雅黑",
        border: '0px'
      });
      mk.setLabel(label);
      if($scope.mk!=null&&$scope.mk!=undefined){
        map.removeOverlay($scope.mk);

      }
      $scope.mk=mk;
      map.panTo(e.point);
    }

    //地图初始化
    $scope.init_map=function(BMap){
      var map = new BMap.Map("locate_parkCar_nearby");          // 创建地图实例
      //遥墙机场经纬度
      var point = new BMap.Point(117.219, 36.852);
      if(point!==undefined&&point!==null)
        $scope.point=point;
      map.centerAndZoom(point, 9);  //初始化地图,设置城市和地图级别

      $scope.map=map;

      //地图添加点击事件
      //map.addEventListener('click', $scope.clickFunc);


      //添加自身位置
      $scope.appendAirportLocation(BMap,map);
    }


    //选择维修厂
    $scope.marker_select = function (unit, label) {
      if ($scope.unit !== undefined && $scope.unit !== null) {
        $scope.unit = null;
        label.setStyle({color: '#222', 'font-size': '0.8em'});
      }
      else {
        label.setStyle({
          color: '#00f'
        });
        $scope.unit = unit;

        $scope.labels.map(function (item, i) {
          if (item.getContent().trim() != label.getContent().trim())
            item.setStyle({color: '#222', 'font-size': '0.8em'});
        })
      }
    }

    //刷新附近维修厂
    //获取该地区的所有维修厂,并进行距离过滤
    $scope.fetchMaintennacesInArea=function(BMap){
      $http({
        method: "POST",
        url: Proxy.local() + "/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token,
        },
        data: {
          request: 'fetchMaintenanceInArea',
          info: {
            provinceName: '山东省',
            cityName: '济南市',
            townName: ['历城区','历下区','槐荫区','天桥区','市中区']
          }
        }
      }).then(function (res) {
        var json = res.data;
        if (json.re == 1) {
          $scope.units = [];
          json.data.map(function (unit, i) {
            if (unit.longitude !== undefined && unit.longitude !== null &&
              unit.latitude !== undefined && unit.latitude !== null) {
              //var center = $scope.airportTransfer.center;
              var distance = $scope.map.getDistance($scope.point, new BMap.Point(unit.longitude, unit.latitude)).toFixed(2);
              if (distance <= 50000)
                $scope.units.push(unit);
            }
          });


          //render new markers
          $scope.labels = [];
          $scope.units.map(function (unit, i) {
            var nmk = new BMap.Marker(new BMap.Point(unit.longitude, unit.latitude));
            var npoint =new BMap.Point(unit.longitude, unit.latitude);
            var polyline = new BMap.Polyline([$scope.point,npoint], {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5});  //定义折线

            $scope.map.addOverlay(nmk);
            $scope.map.addOverlay(polyline);     //添加折线到地图上
            var label = new BMap.Label(unit.unitName, {offset: new BMap.Size(20, -10)});
            label.setStyle({
              color: '#222',
              fontSize: "12px",
              height: "20px",
              lineHeight: "20px",
              fontFamily: "微软雅黑",
              border: '0px'
            });

            nmk.addEventListener("click", $scope.marker_select.bind(this, unit, label));
            nmk.setLabel(label);
            $scope.labels.push(label);
          });
        }
        //圈渲染
        //var circle = new BMap.Circle($scope.point, 50000, {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5}); //创建圆
        //$scope.map.addOverlay(circle);

      }).catch(function (err) {
        var str = '';
        for (var field in err)
          str += err[field];
        console.error('error=\r\n' + str);
      });
    }

    //维修厂确定
    $scope.maintenance_confirm = function () {
      if($rootScope.carManage==undefined||$rootScope.carManage==null)
        $rootScope.carManage={};
      if($scope.unit!==undefined&&$scope.unit!==null)//选定维修厂
      {
        var parkCar={
          destiny:$scope.destiny,
          unit:$scope.unit,
          servicePlace:$scope.unit.unitName
        };
        $http({
          method: "POST",
          url: Proxy.local()+"/svr/request",
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token,
          },
          data:
          {
            request:'getServicePersonByUnitId',
            info:{
              unitId:$scope.unit.unitId
            }
          }
        }).then(function(res) {
          var json=res.data;
          parkCar.servicePerson =json.data;
          $rootScope.carManage.parkCar=parkCar;
          $rootScope.dashboard.tabIndex=3;
          $rootScope.dashboard.service='取送车';
          $state.go('tabs.dashboard');
        });
      }else//未选定维修厂
      {
        var parkCar={
          units:$scope.units,
          destiny:$scope.destiny
        };
        $rootScope.carManage.parkCar=parkCar;
        $rootScope.dashboard.tabIndex=3;
        $rootScope.dashboard.service='取送车';
        $state.go('tabs.dashboard');
      }
    }




    BaiduMapService.getBMap().then(function (res) {

      $scope.bMap = res;
      var BMap = $scope.bMap;
      $scope.BMap=BMap;
      //地图初始化
      $scope.init_map(BMap);

      $scope.fetchMaintennacesInArea(BMap);
    });

    $scope.go_back = function () {
      $rootScope.dashboard.tabIndex=3;
      $rootScope.dashboard.service='取送车';
      window.history.back();
    }
  })



