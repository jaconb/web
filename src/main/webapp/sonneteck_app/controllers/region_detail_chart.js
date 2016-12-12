angular.module('starter.regionChart',[]).controller('chartTest',function ($stateParams,$scope,HttpService,$ionicLoading,dialogsManager) {
        var regionName = $stateParams.regionName;
        var regionId = $stateParams.regionId;
        var gatewayId = $stateParams.gatewayId;

        //默认显示时间:24小时时间
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var hour = d.getHours();
        var minute = d.getMinutes();
        var second = d.getSeconds();
        if(month >= 1 && month <= 9){
            month = "0"+month;
        }
        if (hour >= 0 && hour <= 9) {
            hour = "0" + hour;
        }
        if (day >= 0 && day <= 9) {
            day = "0" + day;
        }
        if (minute >= 0 && minute <= 9) {
            minute = "0" + minute;
        }
        if (second >= 0 && second <= 9) {
            second = "0" + second;
        }
        $scope.default_endTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        $scope.default_startTime = year + "-" + month + "-" + day + " " + "00" + ":" + "00" + ":" + "00";

        // 获取统计图(传感器历史数据)
        var data = {
            gateway_id: gatewayId,
            region_guid: regionId,
            start_time : encodeURI($scope.default_startTime),
            end_time : encodeURI($scope.default_endTime),
            type: "history",
            size: '100'
        };
        //默认时间段获取统计图
        var sensorProm = HttpService.myHttp(data,'GET','/sensor').then(function (data) {
            if(data.code == '0' && data.content.time && data.content.data){
                $scope.dataContent = data.content;
                $('#container').highcharts({

                    title: {
                        text: 'Sensor History Data',
                        x: -20 //center
                    },
                    subtitle: {
                        text: 'Region: '+regionName,
                        x: -20
                    },
                    credits: {
                        enabled:false
                    },
                    noData:{ //无数据显示
                        position: {
                        },
                        attr: {
                        },
                        style: {
                        }
                    },
                    // exporting : {
                    //     enabled : false
                    // },       //右上角打印按钮隐藏
                    xAxis: {
                        categories : $scope.dataContent.time,
                        // labels : {
                        //     enabled : false  //X不显示数值
                        // }
                        tickInterval: $scope.dataContent.time.length - 1  //X每隔xx个显示数值
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        valueSuffix: ''
                    },
                    legend: {
                        // layout: 'vertical',
                        align: 'center',
                        verticalAlign: 'bottom',
                        borderWidth: 0
                    },
                    series : $scope.dataContent.data
                });
            }else {
                $scope.dataContent = 'noData';
            }
        });
        //获取某个时间段的传感器数据
        var opt = {
            preset: 'date',
            display: 'modal',
            mode: 'scroller',
            dateFormat: 'yy-mm-dd',
            timeFormat:'HH:ii:ss',
            timeWheels: 'HHii',
            setText: 'Done',
            cancelText: 'Cancel',
            dateOrder: 'yymmdd',
            dayText: 'Day',
            monthText: 'Month',
            yearText: 'Year',
            hourText: 'Hour',
            minuteText: 'Minute'
        }
        $("#start_datetime").mobiscroll().datetime(opt);
        $("#end_datetime").mobiscroll().datetime(opt);
        $scope.getTime = function () {
            // $scope.days = ($scope.default_endTime.getTime()/1000 - $scope.default_startTime.getTime()/1000)/86400;
            var begintime_ms = Date.parse(new Date($scope.default_startTime.replace(/-/g, "/"))); //begintime 为开始时间

            var endtime_ms = Date.parse(new Date($scope.default_endTime.replace(/-/g, "/")));   // endtime 为结束时间
            var days = (endtime_ms - begintime_ms)/(24*3600*1000)
            if(days > 7){
                dialogsManager.showMessage("You can query up to 7 days of sensor data","red");
            }else {
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                var sensorData = {
                    gateway_id: gatewayId,
                    region_guid: regionId,
                    start_time : encodeURI($scope.default_startTime),
                    end_time : encodeURI($scope.default_endTime),
                    type: "history",
                    size: '100'
                };
                var sensorProm = HttpService.myHttp(sensorData,'GET','/sensor').then(function (data) {
                    $ionicLoading.hide();
                    if(data.code == '0' && data.content.time && data.content.data){
                        $scope.dataContent = data.content;
                        $('#container').highcharts({

                            title: {
                                text: 'Sensor History Data',
                                x: -20 //center
                            },
                            subtitle: {
                                text: 'Region: '+regionName,
                                x: -20
                            },
                            credits: {
                                enabled:false
                            },
                            noData:{ //无数据显示
                                position: {
                                },
                                attr: {
                                },
                                style: {
                                }
                            },
                            // exporting : {
                            //     enabled : false
                            // },       //右上角打印按钮隐藏
                            xAxis: {
                                categories : $scope.dataContent.time,
                                // labels : {
                                //     enabled : false  //X不显示数值
                                // }
                                tickInterval: $scope.dataContent.time.length - 1  //X每隔xx个显示数值
                            },
                            yAxis: {
                                title: {
                                    text: ''
                                },
                                plotLines: [{
                                    value: 0,
                                    width: 1,
                                    color: '#808080'
                                }]
                            },
                            tooltip: {
                                valueSuffix: ''
                            },
                            legend: {
                                // layout: 'vertical',
                                align: 'center',
                                verticalAlign: 'bottom',
                                borderWidth: 0
                            },
                            series : $scope.dataContent.data
                        });
                    }else {
                        $scope.dataContent = 'noData';
                    }
                });
            }
        }
});
