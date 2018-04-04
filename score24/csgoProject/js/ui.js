define(function (require, exports, module) {
    var $ = require("jquery");
    //var os = require("osType");
    //操作名字
    function setName(val){
    	var b = '';
    	var obj = {
    		b: val.substr(0,5)
    	}
    	return obj
    }
	//判断及时数据
	function slice_string(val,per){
		var per = per || 1
		var e = '';
		var a = val.split(',')
		var c='';
		if(a[a.length-2]-a[a.length-1]<0){
			c=true
		}else if(a[a.length-2]-a[a.length-1]==0){
			c=false
		}else if(a[a.length-2]-a[a.length-1]<0){
			c=true
		}
		var b= a[a.length-1] || 0;
		if(b == 'true'){
			b=1
		}else if(b == 'false'){
			b=0
		}else{
			b=b
		}
		var f = String(b/per*100).substr(0,4);
		
		
		//console.log(f)
		
		var obj = {
			c: c,
			b: b,
			e: f
		}
		return obj
	}
	//判断赛况数据
	function slice_string_team(val,bool){
		
		var a = val.split(',')
		//console.log(a)
		var c='';
		if(a[a.length-2]-a[a.length-1]<0){
			c=true
		}else if(a[a.length-2]-a[a.length-1]==0){
			c=false
		}
		var b= a[a.length-1] || 0;
		if(b == 'true'){
			b=1
		}else if(b == 'false'){
			b=0
		}else{
			b=b
		}
		
		
		
		var obj = {
			c: c,
			b: b
			
		}
		return obj
	}
    function tip(a,b){
        var b = b || ""
        return '<div class="no-data"><div class="h1">'+a+'</div><div class="h2">'+b+'</div></div>';
    }

    function warning(a,b){
        var b = b || ""
        $("body").after('<div class="warning"><div class="h1">'+a+'</div><div class="h2">'+b+'</div></div>');
    }
	
	function warning1(a,b){
        var b = b || ""
        $(".sele-box").html('');
        $(".sele-box").append('<div class="warning"><div class="h1">'+a+'</div><div class="h2">'+b+'</div></div>');
    }
    function loader (val){
        $("#loader").remove();
        if (!val||val=="hide") return false;
        h ='<div class="loader" id="loader">加载中</div>';
        $("body").prepend(h);
        return false;
    }

    //把A标签绑定tap
    function bindTap(){
        //return
        setTimeout(function(){
        $('a').on('click', function() {
                return false;
            }).tap(function(){
                //$(this).attr("url",$(this).attr("href"))
                //$(this).attr("href","javascript:")
                location.href =$(this).attr("href");
            })
        },3000)
    }

    //foot

    function ready(fn){
        document.addEventListener("deviceready", fn, false);
    }
    //按下安卓下的返回按钮
    function backbutton(fn) {
        document.addEventListener("deviceready", function () {
            document.addEventListener("backbutton", fn, false);
        }, false);
    }



    //退出
    function backExit() {
        navigator.notification.confirm(
            '确认退出开奖大全？',
            function (val) {
                val == 2 && navigator.app.exitApp();
            },
            '退出提示',
            ['不退出', '退出']
        );
    }
    //返回到指定页面
    function toHref(href) {
        var href = href || "index.html#1";
        location.href = href;
    }

    //检查版本
    function checkVersion(data){


        if (os.isIphone()){
            var msg = data.msgIos;
            var version = data.versionIos;
            var path = data.pathIos;
        }else{
            var msg = data.msg;
            var version = data.version;
            var path = data.path;
        }



        if (version <= VERSION){
            alert(
                "恭喜您使用的是最新版本。",
                function(){},
                "版本检查",
                "知道了"
            );
        }else{
            navigator.notification.confirm(
                msg.join("\r\n"),
                function (val) {
                    val == 1 && window.open(path);
                },
                "V"+version+"升级提示",
                ['马上升级', '残忍拒绝']
            );

        }
    }
    function timeUi(val){
    	var newDate = new Date();
		newDate.setTime(val * 1000);
		var pos = newDate.toLocaleString().indexOf(':');
		return newDate.toLocaleString().substring(pos+1,newDate.toLocaleString().length);
    }
    function alert(a,b,c,d){
        if (navigator.notification && navigator.notification.alert){
            var b = b || function(){};
            var c = c || "信息提示"
            var d= d || "知道了";
            return navigator.notification.alert(a,b,c,d);
        }
        window.alert(a);
    }
    
    //url/对象互转
	function href() {
		var url = location.search;
		// console.log(url);
		json = {};
		if(url.indexOf("?") === -1) return {};
		var arr = url.substr(1).split("&");
		for(var i = 0, len = arr.length; i < len; i++) {
			json[arr[i].split("=")[0]] =arr[i].split("=")[1];
		}
		//console.log(json);
		return json;
	}
    return {
    	href: href,
        backExit: backExit,
        tip:tip,
        loader:loader,
        bindTap:bindTap,
        warning:warning,
        warning1:warning1,
        alert:alert,
        checkVersion:checkVersion,
        toHref:toHref,
        ready:ready,
        backbutton: backbutton,
        slice_string : slice_string,
        timeUi : timeUi,
        slice_string_team : slice_string_team,
        setName: setName
    };
})

