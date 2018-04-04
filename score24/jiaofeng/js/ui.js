define(function (require, exports, module) {
    var $ = require("jquery");
    var os = require("osType");
   // console.log(os);


    function tip(a,b){
        var b = b || ""
        return '<div class="no-data"><div class="h1">'+a+'</div><div class="h2">'+b+'</div></div>';
    }

    function warning(a,b){
        var b = b || ""
        $("header").after('<div class="warning"><div class="h1">'+a+'</div><div class="h2">'+b+'</div></div>');
    }

    function loader (val,dom){
        $("#loader").remove();
        if (!val||val=="hide") return false;
        var h ='<div class="loader" id="loader">加载中</div>';
        var dom = dom || $("body");
        dom.append(h);
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
        var href = href || "index.html";
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
    function alert(a,b,c,d){
        if (navigator.notification && navigator.notification.alert){
            var b = b || function(){};
            var c = c || "信息提示"
            var d= d || "知道了";
            return navigator.notification.alert(a,b,c,d);
        }
        window.alert(a);
    }








    return {
        backExit: backExit,
        tip:tip,
        loader:loader,
        bindTap:bindTap,
        warning:warning,
        alert:alert,
        checkVersion:checkVersion,
        toHref:toHref,
        ready:ready,
        backbutton: backbutton
    };
})

