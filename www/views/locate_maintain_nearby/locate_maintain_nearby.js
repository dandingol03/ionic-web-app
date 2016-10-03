/**
 * Created by danding on 16/9/6.
 */
angular.module('starter')

  .controller('locateMaintainNearbyController',function($scope,$state,$http,$timeout,$rootScope,BaiduMapService,$cordovaGeolocation){

    BaiduMapService.getBMap().then(function(res){
      $scope.bMap=res;
      var BMap=$scope.bMap;
      var map = new BMap.Map("container");          // 创建地图实例
      var point = new BMap.Point(117.02496707, 36.68278473);  // 创建点坐标

      map.centerAndZoom(point, 17);
      map.addControl(new BMap.NavigationControl());
      map.addControl(new BMap.ScaleControl());
      map.enableScrollWheelZoom(true);


      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var lat  = position.coords.latitude;
          var lng = position.coords.longitude;
          alert(lng + ',' + lat);
          var ggPoint = new BMap.Point(lng, lat);
          var convertor = new BMap.Convertor();
          var pointArr = [];
          pointArr.push(ggPoint);

          var  translateCallback = function (data){
            if(data.status === 0) {
              var marker = new BMap.Marker(data.points[0]);
              map.addOverlay(marker);
              var label = new BMap.Label("转换后的百度坐标（正确）",{offset:new BMap.Size(20,-10)});
              marker.setLabel(label); //添加百度label
              map.setCenter(data.points[0]);
            }
          }

          convertor.translate(pointArr, 1, 5, translateCallback)




        }, function(err) {
          // error
          alert('error=\r\n' + err.toString());
        });



      //var geolocation = new BMap.Geolocation();
      //geolocation.getCurrentPosition(function(r){
      //  if(this.getStatus() == BMAP_STATUS_SUCCESS){
      //    //var mk = new BMap.Marker(r.point);
      //    //map.addOverlay(mk);
      //    //map.panTo(r.point);
      //
      //    //map.setCenter(new BMap.Point(r.point.lng, r.point.lat));
      //
      //
      //    var pointArr = [];
      //    alert(r.point.lng + ',' + r.point.lat);
      //
      //
      //  }
      //  else {
      //    alert('failed'+this.getStatus());
      //  }
      //},{enableHighAccuracy: true});


    });

  });
