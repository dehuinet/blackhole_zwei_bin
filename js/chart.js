jQuery(function($) {
	Chart = {
        area: function (elem,data,beginTime,pointInterval,title,sec_title,format){
              
                elem.highcharts({

                    credits: {
                      enabled: false
                    },
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: title
                    },
                    subtitle: {
                        text: sec_title
                    },
                    xAxis: {
                        type: 'datetime',
                        //minRange: 360000, // fourteen days
                        labels:{
                            formatter:function(){
                                return Highcharts.dateFormat(format,this.value);
                            }
                            
                        },
                        rotation: 45,
                        align: 'right',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    },
                    yAxis: {
                        title: {
                            text: '访问次数'
                        },
                        min: 0
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            },
                            marker: {
                                radius: 2
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    },

        // tooltip:{
        //     // formatter: function (){
        //     //     return this.x+":"+this.y;
        //     // }
        //     xDateFormat: '%Y-%m-%d %H:%m'
        // },

                    series: [{
                        type: 'area',
                        name: '次数',
                        pointInterval: pointInterval,
                        pointStart: beginTime,
                        data: data
                    }]
                });

            },
        
        //多线图
        lines:function (elem,data,categories,title,sec_title,format){
            x = null;
            if(categories==null){
                x = {
                        type: 'datetime',
                        //minRange: 360000, // fourteen days
                        labels:{
                            formatter:function(){
                                return Highcharts.dateFormat(format,this.value);
                            }
                            
                        }
                    }
            }else{
                x= {
                    categories:categories
                }
            };

                elem.highcharts({
                    credits: {
                      enabled: false
                    },
                    title: {
                        text: title,
                        x: -20 //center
                    },
                    subtitle: {
                        text: sec_title,
                        x: -20
                    },

                    chart: {
                        zoomType: 'x'
                    },
                    xAxis: x,
                    yAxis: {
                        title: {
                            text: '次数'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }],
                        min: 0
                    },
                    tooltip: {
                        valueSuffix: '次'
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
            
                    series: data
                });
        },//lines end

        columns: function(data,title,sub_title){
            var colors = Highcharts.getOptions().colors,
            categories = new Array();//['MSIE', 'Firefox', 'Chrome', 'Safari', 'Opera'],
            for(i=0;i<data.length;i++){
                categories.push(data[i].name);
            }
            name = '设备';
                

                var chart = $("#chart-container").highcharts({
                    credits: {
                      enabled: false
                    },
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: title
                    },
                    subtitle: {
                        text: sub_title
                    },
                    xAxis: {
                        categories: categories
                    },
                    yAxis: {
                        title: {
                            text: '数量'
                        },
                        min: 0
                    },
                    plotOptions: {
                        column: {
                            cursor: 'pointer',
                            point: {
                                events: {
                                    click: function() {
                                        
                                        var drilldown = this.drilldown;
                                        if (drilldown) { // drill down
                                            setChart(chart,drilldown.name, drilldown.categories, drilldown.data, drilldown.color);
                                        } else { // restore
                                            setChart(chart,name, categories, data);
                                        }
                                    }
                                }
                            },
                            dataLabels: {
                                enabled: true,
                                color: colors[0],
                                style: {
                                    fontWeight: 'bold'
                                },
                                formatter: function() {
                                    return this.y;
                                }
                            }
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            var point = this.point,
                                s = this.x +':<b>'+ this.y +'</b><br>';
                            if (point.drilldown) {
                                s += '点击进入 '+ point.category +' 版本统计';
                            } else {
                                s += '点击返回设备统计';
                            }
                            return s;
                        }
                    },
                    series: [{
                        name: name,
                        data: data,
                        color: 'white'
                    }],
                    exporting: {
                        enabled: false
                    }
                }).highcharts(); // return chart
            },//columns end

            pie: function(data,title,sub_title){
                var colors = Highcharts.getOptions().colors;
                var categories = new Array();//['MSIE', 'Firefox', 'Chrome', 'Safari', 'Opera'],
                for(i=0;i<data.length;i++){
                    categories.push(data[i].name);
                }
                
                name = 'Browser brands';
                

                var chart = $('#chart-container').highcharts({
                    credits: {
                      enabled: false
                    },
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: title
                    },
                    subtitle: {
                        text: sub_title
                    },
                    plotOptions: {
                        pie: {
                            cursor: 'pointer',
                            point: {
                                events: {
                                    click: function() {
                                        
                                        var drilldown = this.drilldown;
                                        if (drilldown) { // drill down
                                            pie_data = new Array();
                                            for(i=0;i<drilldown.categories.length;i++){
                                                pie_data.push(new Array(drilldown.categories[i],drilldown.data[i]));
                                            }
                                            setChart(chart,drilldown.name, drilldown.categories, pie_data, drilldown.color);
                                        } else { // restore
                                            setChart(chart,name, categories, data);
                                        }
                                    }
                                }
                            },
                            dataLabels: {
                                enabled: true,
                                color: colors[0],
                                style: {
                                    fontWeight: 'bold'
                                },
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            }
                        }
                    },
                    tooltip: {
                        //pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
                        formatter: function(){
                            debugger;
                            s = '<b>'+this.point.name+":</b>"+this.point.percentage.toFixed(1)+'%<br>';
                            if (this.point.drilldown) {
                                s += '点击进入 '+ this.point.name +' 版本统计';
                            } else {
                                s += '点击返回设备统计';
                            }
                            return s;
                            
                        }
                        
                    },
                    series: [{
                        type:'pie',
                        name: name,
                        data: data,
                        color: 'white'
                    }],
                    exporting: {
                        enabled: false
                    }
                }).highcharts(); // return chart
            }//pie end
        }
});

function setChart(chart,name, categories, data, color) {
    chart.xAxis[0].setCategories(categories, false);
    chart.series[0].remove(false);
    chart.addSeries({
                    name: name,
                    data: data,
                    color: color || 'white'
                    }, false);
    chart.redraw();
};
