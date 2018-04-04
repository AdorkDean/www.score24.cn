define(function (require, exports, module) {
    var $ = require("jquery");
    require("jquery.json")($);
    var hl = require("handlebars").default;
    var lib = require("tool");
    var cache = require("cache");
    var ac = require("action");
    var ui = require("ui");
    var leagueList =  require("league");
    var l = lib.log;

    var href = lib.href();

    if (href.competitionId){
        var B = {
            homeId : href.homeId,
            awayId : href.awayId,
            fixtureId : href.fixtureId,
            leagueId : href.competitionId
        };
        var S = {
            leagueId : B2SLeague(B.leagueId)
        }
    }

    var leagueName = $("#leagueId-"+S.leagueId).html();
    $("#leagueName").html(leagueName);





    $("#live-iframe").attr("src","http://sunloto.geniussportsmedia.com/betstream-view/"+
        "footballscorecentre/sunlotofootballscorecentre/html?eventId="+href.fixtureId+"&culture=zh-CN")


    function B2SLeague (val){
        var id = null;
        $.each(leagueList,function(i,n){
            if (n.Bid == val) id = n.Sid;
        })
        return id;
    }


    function S2BLeague (val){
        var id = null;
        $.each(leagueList,function(i,n){
            if (n.id == val) id = n.id;
        })
        return id;
    }



    S.list ={};
    B.list ={};
    $("#tabBox li").click(function(){
        //if ($(this).data("href")) return location.href = $(this).data("href");
        var val = $(this).data("val");
        location.href = "#"+val;
        init();
    })

    $("#tabBtn li").click(function(){
        var inx = $("#tabBtn li").index($(this));
        $("#tabBtn li").removeClass("live-on");
        $(this).addClass("live-on");

        if (inx) {
            $("#dataBox").show();
            $("#liveBox").hide();
        }else{
            $("#liveBox").show();
            $("#dataBox").hide();
        }
    })



    function init() {
        season(function () {

            getLive();
            getSummary();
            setInterval(getLive,10000);
            setInterval(getSummary,30000);
            //getSummary();
        })
    }

    function season (fn){
        ac.getSeason({leagueId:S.leagueId},function(data){
            var seasons = eval("("+data.seasons+")");
            seasons = seasons.seasons;
            var teams = data.teams;
            $.each(teams,function(i,key){
                if (key.betgeniusId == B.homeId){
                    S.homeId = key.teamId;
                    S.homeName = key.cName;
                    B.homeName = key.cName;
                }else if (key.betgeniusId == B.awayId){
                    S.awayId = key.teamId;
                    S.awayName = key.cName;
                    B.awayName = key.cName;
                }
                S.list[key.teamId] = key;
                B.list[key.betgeniusId] = key;
            })
            S.seasons = seasons[0].id;
            $("#seasonsBtn").html(seasons[0].name);
            $("#homeBtn").html(id2cn (B.homeId));
            $("#awayBtn").html(id2cn (B.awayId));



            fn();
        })
    }

    function id2cn (val){
        return B.list[val].cName || val;
    }



    //直播
    function getLive(){
        ui.loader("show",$("#liveHtml"));
        ac.getLive(B.fixtureId,function(data){

            ui.loader("hide");
            if(!data) return $("#liveHtml").html(ui.tip("暂无数据!","请稍后重试"));
            var  o = mergeData (data);
            setList(o);
        })

        //混合数据

        var half = {
            "FirstHalf"             :   "上半场",
            "SecondHalf"            :   "下半场",
            "HalfTime"              :   "中场",
            "ExtraTimeFirstHalf"    :   "加时赛上半场",
            "ExtraTimeSecondHalf"   :   "加时赛下半场",
            "Penalties"             :   "点球",
            "PostMatch"             :   "完赛",
            "FullTimeExtraTime"     :   ""
        }

        function mergeData(obj) {

            var o = {}
            $.each(obj,function(key,value){
                var list = [];
                $.each(value,function(i,k){
                    k.time = k.timeInPhase.replace(/PT|S/g," ").replace(/M/g,"'");
                    if (B.homeId == k.teamId){
                        k.homeValue = getHomeHtml();
                        k.css = '';
                    }else if (B.awayId == k.teamId){
                        k.awayValue = getAwayHtml();
                        k.css = 2;
                    }
                    list[i] = k;
                })
                o[half[key]] = list;
            })
            return o;
        }

        function getHomeHtml(){
            var h = '';
            h += '<span class="dl"><img src="img/home2.png"></span>';
            h += '<span class="live-width dl">'+B.homeName+'</span>';
            return h;
        }

        function getAwayHtml(){
            var h = '';
            h += '<span class="dr"><img src="img/away2.png"></span>';
            h += '<span class="live-width2 dr">'+B.awayName+'</span>';
            return h;
        }


        //写入到页面
        function setList(o) {
            var lt = hl.compile($("#liveTemp").html());
            var h = '';

            $.each(o,function (key,val){
                h += '<div class="live-stage">'+key+'</div>'
                h += lt({list:val})
            })


            $("#liveHtml").html(h);
        }
    }
    function getSummary(){
        ac.getSummary(B.fixtureId,function(data){
            if(!data || !data.scores|| !data.scores.length) return $("#dataHtml").html(ui.tip("暂无数据!","请稍后重试"));
            var  o = mergeData (data.scores);
            l(o);
            setList(o);
        })

        function mergeData(list){
            var o = {}
            $.each(list, function(i,val){
                o[val.stype] = count(val.home,val.away);
            })
            return o;
        }
        function count(a,b){
            var a = parseInt(a);
            var b = parseInt(b);

            if (!a && !b) return [a,b,0,0];
            if (!a) return [a,b,0,80];
            if (!b) return [a,b,80,0];
            var m = (a > b) ? a : b;
            if (m == a){
                return [a,b,80,parseInt((b/a).toFixed(2)*70,10) ]
            }else{
                return [a,b,parseInt((a/b).toFixed(2)*70,10),80]
            }

        }
        //写入到页面


        var styes = {
            "进球":"goal",
            "射正":"shotsOnTarget",
            "射偏":"shotsOffTarget",
            "射中门框":"shotsOffWoodwork",
            "射门被挡":"blockedShot",
            "角球":"corner",
            "换人":"substitution",
            "犯规":"foul",
            "越位":"offside",
            "黄牌":"yellowCard",
            "两黄一红":"straightRedCard",
            "红牌":"straightRedCard",
            "点球":"savedPenaltie",
            "点球未进":"missedPenaltie",
            "球门球":"goalKick",
            "界外球":"throwIn"
        }
        function setList(o) {
            var lt = hl.compile($("#dataTemp").html());
            var h = '';
            $.each(styes,function(key,val){
                var v = o[val];
                h += lt({a:v[0],b:v[1],a1:v[2],b1:v[3],stype:key});
            })

            $("#dataHtml").html(h);
        }

    }
    return {
        init: init
    }

})