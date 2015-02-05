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
                
            }
        },
        yAxis: {
            title: {
                text: '访问次数'
            }
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

        series: [{
            type: 'area',
            name: '次数',
            pointInterval: pointInterval,
            pointStart: beginTime,
            data: data
        }]
    });
        }
    }
})
