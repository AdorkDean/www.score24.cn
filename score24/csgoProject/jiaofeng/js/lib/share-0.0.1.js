define(function (require, exports, module) {
    var $ = require("jquery");
    var ui = require("ui");
    var os = require("osType");

    var obj = {
        title:'',
        description:"实时查看全国120多个彩种的开奖号码，1000多种专业图表，助您中奖。",
        thumb:BASE+"img/icon.png",
        url:"",
    };
    //初始化
    function init(o){
        set (o);
        //如果不在app中，无法使用分享功能
        if (!os.isApp()){
           // if (os.isWeixin()){
                $("body").prepend('<div class="dn"><img src="http://www.wozhongla.com/app/LotteryResult/img/icon.png"/></div>');
           // }
            return false;
        }
        $("#socialBtn").show();
        var h="";
        h += '<div id="shareBg" class="share-bg dn">';
        h += '</div>';
        h += '<section id="shareBox" class="share-box dn">';
        h += '<div class="share-title">分享到</div>';
        h += '<div id="shareBtnHy" class="share-btn share-btn-hy">发送给朋友</div>';
        h += '<div id="shareBtnPyq" class="share-btn share-btn-pyq">分享到朋友圈</div>';
        h += '<div class="share-cancel" id="shareCancel">取 消</div>';
        h += '</div>';
        h += '</section>';
        $("body").append(h);
        $("#shareBtnHy").click(shareBtnHy);
        $("#shareBtnPyq").click(shareBtnPyq);
        $("#socialBtn").click(function(){
            $("#shareBox:visible").length ? hide() : show();
        });
        $("#shareBg").click(hide);
        $("#shareCancel").click(hide);



    }


    function shareBtnHy(){
        console.log(obj)

        var share = {
            message: {
                title: obj.title,
                    description: obj.description,
                    thumb:obj.thumb,
                    media: {
                    type: Wechat.Type.LINK,
                        webpageUrl: obj.url
                }
            },
            scene:Wechat.Scene.SESSION
        }


        Wechat.share(share, hide, function (reason) {})

        console.log(share)
        //hide()
    }

    function shareBtnPyq(){
        var share = {
            message: {
                title: obj.title,
                description: obj.description,
                thumb:obj.thumb,
                media: {
                    type: Wechat.Type.LINK,
                    webpageUrl: obj.url
                }
            },
            scene:Wechat.Scene.TIMELINE
        }


        Wechat.share(share, hide, function (reason) {})

        //hide()
    }

    function show(){
        $("#shareBox").slideDown(200);
        $("#shareBg").show()
    }
    function hide(){
        $("#shareBox").slideUp(200)
        $("#shareBg").hide()
    }
    function set(o){
        $.each(o,function(key,val){
            obj[key] = val
        })
        $("title").html(obj.title);
    }
    return {
        init: init,
        shareBtnHy:shareBtnHy,
        shareBtnPyq:shareBtnPyq,
        show:show,
        set:set,
        close:close
    }
})

