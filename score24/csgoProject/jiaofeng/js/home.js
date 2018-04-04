define(function (require, exports, module) {
    var $ = require("jquery");
    require("jquery.json")($);
    var hl = require("handlebars").default;
    var lib = require("tool");
    var cache = require("cache");
    var ac = require("action");
    var ui = require("ui");
    var l = lib.log;

    var currentPage = null;
    var topPage = null;
    var bottomPage = null;

    var loading = null;
    var liveId = 0;
    var matchList = [];
    var machColor = {};


    var leagueEn2Cn = {
        "Premier League":"英超",
        "Bundesliga":"德甲",
        "Serie A":"意甲",
        "Ligue":"法甲",
        "LaLiga":"西甲"
    }
    

    function init(){
        getMatchList ();
        $(window).scroll(function () {
            var winScrollTop = $(window).scrollTop();
            //console.log(winScrollTop);
            if (winScrollTop == 0){
                topLoad()
            }
            if (winScrollTop+$(window).height()+10 >= $("body").outerHeight()){
                bottomLoad()
            }
        })
    }

    function topLoad(){
        if (topPage == 1 || loading) return;
        $("#topload").show();
        $(".data-tit").hide();
        getMatchList(--topPage,1,$(document).height());
    }

    function bottomLoad(){
        if (loading) return;
        $("#bottomload").show();
        getMatchList(++bottomPage,2);
    }


    function showLive(type){
        var i = 0
        $(".tuesday-box").unbind().click(function(){
            var id = $(this).attr("id");

            //如果已经显示了
            if ($("#live"+id).length){
                $(".triangle-down").attr("class","triangle-top");
                $("#live"+id).remove()
                return;
            }
            $(".live-windows").remove();
            $(".triangle-down").attr("class","triangle-top");
            var src = 'http://bsdemo.betstream.betgenius.com/betstream-view/footballscorecentre/betgeniusfootballscorecentre/html?eventId='+id+'&culture=zh-CN';

           $(this).append('<div class="live-windows dn" id="live'+id+'"><iframe src="'+src+'" width="100%" height="300"></iframe></div>')
            $(".live-windows").slideDown(300);
            if (i){
                var t = $("#"+id).offset().top;
                $('body,html').animate({'scrollTop':t-122});
            }
            i++;
            $(this).find(".triangle-top").attr("class","triangle-down");
        })

        if (!type) {
            $(".tuesday-box:eq(0)").click();
            //setTimeout(function(){
            //   $("#topPic").slideDown(500);
            $('body,html').animate({'scrollTop': 1}, 0);
            //},500);
        }
    }


    function getMatchList (page,type,domHeight){
        if (loading) return;
        loading = true;
        var page = page || null
        if (!type) ui.loader("show",$("#homeHtml"));
        ac.getMatchList({page:page},function(data){

            var currentPage = data.currentPage;
            var data = data.matchs;
           // if(!data || !data.length) return;

            if (type == 1){
                matchList = data.concat(matchList);
                topPage = currentPage;
                $(".data-tit").show();
            }else if(type == 2){
                matchList = matchList.concat(data);
                bottomPage = currentPage;
            }else{
                matchList = data;
                topPage = currentPage;
                bottomPage = currentPage;
            }
            loading = false;
            if (!matchList.length){
                return getMatchList (currentPage-1);
            }
            ui.loader("hide");
            var  o = mergeData (matchList);
            setList(o,domHeight);
            showLive(type);
            $(".list-loading").hide();
        });

        //混合开奖数据
        function mergeData(list) {
            var o =[];
            var oldDate = "";
            $.each(list,function(i,k){
                list[i].competitionName = leagueEn2Cn[k.competitionName] || k.competitionName;
                list[i].time = k.startTime.slice(11,16);
                date = k.startTime.slice(0,10).replace(/(\-)/g,"/");
                list[i].date = date;
                list[i].dayHtml = '';
                list[i].homeScore = list[i].homeScore == null ? "-" : list[i].homeScore;
                list[i].awayScore = list[i].awayScore == null ? "-" : list[i].awayScore;



                var competitionId = list[i].competitionId;

                if (!machColor[competitionId]){
                    machColor[competitionId] = "g"+ lib.random(113);
                }


                list[i].css = machColor[competitionId];


                var id = liveId++;

                if (oldDate != date){
                    list[i].dayHtml = '</div><div id="box-'+id+'"><h2 class="data-tit" data-id="'+id+'" id="tit-'+id+'">'+date+' '+getWeek(date)+'</h2>';
                }
                oldDate = date;
            })
            return list;
        }
        //写入到页面
        function setList(val,domHeight) {
            var lt = hl.compile($("#homeTemp").html());
            var val = lt({list:val});
            $("#homeHtml").html(val);

            $("#homeHtml").removeClass("body-height");

            if (domHeight){
                $('body,html').animate({'scrollTop':$(document).height()-domHeight},0);
            }
            //标题浮动跟随
            $(".data-tit").each(function(){
                var id = $(this).data("id");
                fixedTitle($("#box-"+id),$("#tit-"+id));

            })
        }

        //标题浮动跟随
        function fixedTitle($boxDom, $fixedDom){
            var itemOffsetTop = $boxDom.offset().top;
            console.log(itemOffsetTop);
            var itemOuterHeight = $boxDom.outerHeight();
            console.log(itemOuterHeight);
            var old = 0;
            //var winHeight = $(window).height();
            $(window).scroll(function () {
                var winScrollTop = $(window).scrollTop();
                if(!(winScrollTop > itemOffsetTop+itemOuterHeight) && !(winScrollTop < itemOffsetTop)) {
                    if (old !== 1){
                        fixedChange($boxDom, $fixedDom, 1);
                        old = 1;
                    }
                } else {
                    if (old !== 0){
                        fixedChange($boxDom, $fixedDom, 0);
                        old = 0;
                    }
                }
            })
            function fixedChange($boxDom, $fixedDom, val){
                if (val){
                    $fixedDom.attr("class","data-tit pf");
                    $boxDom.attr("class","container");
                }else{
                    $fixedDom.attr("class","data-tit");
                    $boxDom.attr("class","");
                }
            }
        }


        function getWeek(date){
            var dt = new Date(date);
            var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
            return weekDay[dt.getDay()];
        }

    }
    return {
        init: init
    }

})