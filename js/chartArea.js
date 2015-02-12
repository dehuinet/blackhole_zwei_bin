jQuery(function($) {

  ChartArea = {

    datetimePicker: function(datetimeElems,interval){
      var options = {
        format: "yyyy-mm-dd",
        minView: 2,
        language:  'zh-CN',
        autoclose: 1,
        todayHighlight: 1,
        minuteStep: 1
      };
      datetimeElems.datetimepicker(options);

      interval.off('change').on('change',function(e){
        datetimeElems.val('');
        var selected = interval.find('option:selected').val();
       
        datetimeElems.datetimepicker('remove');
        if(selected=='by_minutes'){
          options['format'] = "yyyy-mm-dd hh:ii";
          options['minView'] = 0;
          options['startView'] = 2;
        }else if (selected=='by_hours'){
          options['format'] = "yyyy-mm-dd hh:00";
          options['minView'] = 1;
          options['startView'] = 2;
        }else if (selected=='by_days' || selected=='by_weeks'){
          options['format'] = "yyyy-mm-dd";
          options['minView'] = 2;
          options['startView'] = 2;
        }else{
          options['format'] = "yyyy-mm";
          options['minView'] = 3;
          options['startView'] = 3;
        }
        datetimeElems.datetimepicker(options);
      });
    },

    chartArea: function(url,title,t_type){
      

    $("#search").off('click').on('click',function(ce){
      se = vaild();
      if(se == null){
        return;
      }
      s = se[0];
      e = se[1];
      var interval = $("#interval").val();
      Ajax.get(url,{'interval':interval,'start_time':s,'end_time':e},function(e1){
        var json = JSON.parse(e1);
        if(json.status == 'ok'){
          ts = convert_time_format(json.start_at);
          if(t_type=='area'){
            Chart.area ($('#chart-container'),json.data,ts[0],json.interval*1000,title,'',ts[1]);
          }else{
            Chart.lines ($('#chart-container'),json.data,ts[0],json.interval*1000,title,'',ts[1]);
          }
        }else{
          $('#chart-container').html("<font color=red><b>"+json.errors.message+"</b><font>");
        }
      });
    });
   // $("#search").click();
    },

    chartColumns: function(url,title,sub_title){
      Ajax.get(url,null,function(e1){
        var json = JSON.parse(e1);
        
        //var json = [{"Name":"ios","Count":"5","Data":{"Name":"ios","Categories":["7.1.1","8.0","8.1","8.1.3"],"Datas":["1","2","1","1"]}},{"Name":"android","Count":"20","Data":{"Name":"android","Categories":["4.0.3","4.1.2","4.2.1","4.2.2","4.3","4.4.4"],"Datas":["1","4","3","9","2","1"]}}];
        if (json.status=='ok'){
        var colors = Highcharts.getOptions().colors;
        datas = new Array();
        for(i=0;i<json.length;i++){
          name = json[i].Name;
          y = parseInt(json[i].Count);
          color = colors[i];
          dd = json[i].Data;
          drilldown = new Array();
          drilldown.name = name+' version';
          drilldown.categories = dd.Categories;
          var d = new Array();
          for(j = 0;j<dd.Datas.length;j++){
            d.push(parseInt(dd.Datas[j]));
          }
          drilldown.data = d;
          drilldown.color = color;
          data = new Object();
          data.y = y;
          data.name = name;
          data.color = color;
          data.drilldown = drilldown;
          datas.push(data);
        }

        Chart.columns(datas,title,sub_title);
      }else{
        $('#chart-container').html("<font color=red><b>"+json.errors.message+"</b><font>");
      }
      });
    },

    chartLines: function(url,title,sub_title){
      $("#search").off('click').on('click',function(ce){
      se = vaild();
      if(se == null){
        return;
      }
      s = se[0];
      e = se[1];
      var interval = $("#interval").val();
      Ajax.get(url,{'interval':interval,'start_time':s,'end_time':e},function(e1){
        var json = JSON.parse(e1);
        
        msg_data = json.msg_data;
        cmsg_data = json.cmsg_data;
        var data = new Array();
        
        msg = {
          'type': 'line',
          'name': '工作圈',
          'data': msg_data
        };
        cmsg = {
          'type': 'line',
          'name': '即时通讯',
          'data': cmsg_data
        }

        data.push(msg);
        data.push(cmsg);
        if(json.status == 'ok'){
          ts = convert_time_format(json.start_at);
          categories = null;
          if(json.interval == 86400){
            //tian
            msg.pointInterval = json.interval*1000;
            msg.pointStart = convert_time_format(json.start_at)[0];
            cmsg.pointInterval = json.interval*1000;
            cmsg.pointStart = convert_time_format(json.start_at)[0];
          }else if (json.interval == 86400*7){
            //zhou
            var weeks = new Array();
            for(i=0;i<msg_data.length;i++){
              weeks.push('第'+(i+json.first_week)+'周');
            }
            categories = weeks;
          }else{
            //yue
            var months = new Array();
            for(i=0;i<msg_data.length;i++){
              months.push(offsetYM(json.start_at,i));
            }
            categories = months;
          }
          Chart.lines ($('#chart-container'),data,categories,title,sub_title,ts[1]);
          
        }else{
          $('#chart-container').html("<font color=red><b>"+json.errors.message+"</b><font>");
        }
      });
    });
    },

    full_screen: function(){
      $("#full_screen").off('click').on('click',function(e){
    
            if($("#main-content").parent()[0].id=='main-article'){
              $("#fullscreen").modal('show');
              $("#fullscreen").append($("#main-content"));
              $("#full_screen").text('退出全屏');
            }else{
              $("#fullscreen").modal('hide');
              $("#main-article").append($("#main-content"));
              $("#full_screen").text('全屏');
            }
            //Chart.columns($("#chart-container"),data);
            if(($("#start_date")==undefined || $("#start_date").val()!='')&&($("#end_date")==undefined || $("#end_date").val()!='')){
              $("#search").click();
            }
            
            e.preventDefault();
        });
    }

  }

  

    
});
//计算形如 1501 样式的年月组合 返回一个数组 记录从ym开始 偏移offset的年月 样式仍然是形如1501
function offsetYM(ym,offset){
  y = ym.substr(0,2);
  m = ym.substr(2,2);
  m = parseInt(m)+offset;
  y = parseInt(parseInt(y) + m/12);
  m%=12;
  return y+''+(m<10? 0+''+m:m);
}

//校验时间选择是不是正确 顺便返回一个数组 只有2个元素 开始时间戳 结束时间戳
function vaild(){
  var stime = $("#start_date").val();
      var etime = $("#end_date").val();
      if(stime=='' || etime == ''){
        alert('时间范围不能为空！');
        return null;
      }
      
      var selected = $("#interval").find('option:selected').val();
      if(selected=='by_months'){
        stime+='-01';
        end = etime.split('-');
        etime = end[0]+'-'+(parseInt(end[1])+1)+"-01";
      }
      var s = datetime_to_unix(stime);
      var e = datetime_to_unix(etime);
      if (s>e){
        alert('开始时间不能大于结束时间！');
        return null;
      }
      
      if(selected=='by_minutes'){
        e+=60;
      }else if (selected=='by_hours'){
        e+=3600;
      }else if(selected =='by_days'){
        e+=86400;
      }else if(selected == 'by_weeks'){
        e+=(86400*7)
      }else{
        //按月

      }
      return new Array(s,e);
}

//把形如 20150205的日志转为时间戳 还有时间格式
function convert_time_format(time){
  var arr = new Array(5);
  var ff = new Array(5);
  ff[0] = '%y';
  ff[1] = '%m';
  ff[2] = '%d';
  ff[3] = ' %H';
  ff[4] = '%M';
  format = '';
  for(i=0;i<5;i++){
    if (i*2 < time.length){
      format+=ff[i];
      arr[i] = time.substr(i*2,2);
      if (i==0){
        arr[i]=20+arr[i];
      }else if (i==1){
        arr[i]--;
      }
    }else{
      arr[i] = 0;
    }
            
  }
  arr1 = new Array();
  arr1.push(Date.UTC(arr[0],arr[1],arr[2],arr[3],arr[4]));
  arr1.push(format);
  return arr1;
};

//该方法把格式： 年-月-日 时:分:秒 的日期转为时间戳 年-月-日 必须有 时:分:秒 可选 年必须4位 月日时分秒 1或2位
function datetime_to_unix(day){  
  // alert(new Date(day).getTime());
  //   re = /(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/.exec(day);  
  //   return new Date(re[1],(re[2]||1)-1,re[3]||1,re[4]||0,re[5]||0,re[6]||0).getTime()/1000;  
  return new Date(day).getTime()/1000;
}