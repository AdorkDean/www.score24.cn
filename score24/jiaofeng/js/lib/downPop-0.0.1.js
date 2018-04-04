define(function (require, exports, module) {
    var $ = require("jquery");
    var lib = require("tool");
    var os = require("osType");


    function isShow(){
        if(!os.isAndroid())return false; //只有安卓用户显示下载
        //if(!lib.href().source)return false; //填写来源网页显示
        if (window.cordova) return false;//应用中
        return true;
    }

    //初始化
    function init(){
        if (!isShow()) return false;

        var h="";
        h += '<section id="downBox" class="down-box dn">';
        h += '<div class="down-box-box">';
        h += '<div id="downClose" class="down-close"></div>';
        h += '<div  class="down-title">下载客户端<br />更快更专业的开奖体验</div>';
        h += '<a href="http://www.wozhongla.com/app/LotteryResultDown/" class="down-btn"></a>';
        h += '</div>';
        h += '</section>';
        $("body").append(h);
        show();
        $("#downClose").click(hide);
    }
    function show(){
        $("#downBox").slideDown(200);
    }
   function hide(){
        $("#downBox").slideUp(200);
    }
    return init();
})

