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

    if (!href.participants){
        return gotoHref(href.leagueId);
    }


    var participants = href.participants;
    var teams = participants.split(",");
    var homeId = teams[0];
    var awayId = teams[1];
    var seasonId = href.seasonId;
    var leagueId = href.leagueId;


    var opt = {
        participants:participants,
        seasonId:seasonId,
        leagueId:leagueId
    };

    function getLeague(id){
        var name = '';
        $.each(leagueList,function(i,n){
            if (n.Sid == id){
                name = n.cnName;
            }
        })
        return name;
    }

    $("#leagueName").html(getLeague(leagueId));


    function gotoHref(leagueId){
        ac.getSeason({leagueId:leagueId},function(data){
            var seasons = eval("("+data.seasons+")");
            seasons = seasons.seasons;
            var teams = data.teams;
            location.href = 'data.html?participants='+teams[0].teamId+','+teams[1].teamId+
                '&leagueId='+leagueId+'&seasonId='+seasons[0].id+'#tables';
        })
    }

    var leagueEn2Cn = {
        "Premier League":"英超",
        "Bundesliga":"德甲",
        "Serie A":"意甲",
        "Ligue":"法甲",
        "LaLiga":"西甲"
    }


    var teamList ={};
    var betgeniusTeamList ={};
    var ids = [];
    var arg = {};
    args = {
        "tables": {"typeName": "积分榜", "fn": tables, tab: 0},
        "head2Head": {"typeName": "交锋", "fn": head2Head, tab: 2},
        "fixtures": {"typeName": "赛程", "fn": fixtures, tab: 3},
        "topScorers": {"typeName": "球员榜", "fn": topScorers, tab: 4},
        "statistics": {"typeName": "统计", "fn": statistics, tab: 1},
    }
    $("#tabBox li").click(function(){
        if ($(this).data("href")) return location.href = $(this).data("href");
        var val = $(this).data("val");
        location.href = "#"+val;
        init();
    })

    function init() {
        var hash = window.location.hash || "#";
        hash = hash.slice(1);
        arg = args[hash];
        $("title").html(arg.typeName+"/score24");
        $(".analysis-box").hide();
        $("#" + hash + "Box").show();
        $("#tabBox li").removeClass("nav-on2")
        $("#tabBox li:eq(" + arg.tab + ")").addClass("nav-on2")
        if (ids.length) return arg.fn();
        season(function () {
            arg.fn();
        })
    }

    function season (fn){
        ac.getSeason(opt,function(data){
            var seasons = eval("("+data.seasons+")");
            seasons = seasons.seasons;
            var teams = data.teams;
            $.each(teams,function(i,key){
                teamList[key.teamId] = key;
                betgeniusTeamList[key.betgeniusId] = key;
                ids.push(key.teamId);
            })
            setNav(teamList,seasons);
            fn();
        })
    }

    function setNav(teamList,seasons){
        var h = '';
        $.each(teamList,function(key,value){
            if (value.teamId == homeId){
                h += '<li data-id="'+key+'" class="hover">'+(value.cName||value.eName)+'</li>';
            }else{
                h += '<li data-id="'+key+'">'+(value.cName||value.eName)+'</li>';
            }
        });

        $("#homeNav").html(h);
        var h = '';
        $.each(teamList,function(key,value){
            if (value.teamId == awayId){
                h += '<li data-id="'+key+'" class="hover">'+(value.cName||value.eName)+'</li>';
            }else{
                h += '<li data-id="'+key+'">'+(value.cName||value.eName)+'</li>';
            }
        });
        $("#awayNav").html(h);

        var h = '';
        var seasonsName;
        $.each(seasons,function(key,value){
            if (value.id == seasonId) {
                seasonsName = value.name;
                h += '<li data-id="' + value.id + '" class="hover">' + value.name + '</li>';
            }else {
                h += '<li data-id="' + value.id + '">' + value.name + '</li>';
            }
        });
        $("#seasonsNav").html(h);

        $("#seasonsBtn").html(seasonsName).click(function(){
            $("#seasonsNav").slideToggle(200)
            $("#awayNav").hide();
        })
        $("#homeBtn").html(teamList[homeId].cName||teamList[homeId].eName).click(function(){
            $("#homeNav").slideToggle(200)
            $("#seasonsNav").hide();
            $("#awayNav").hide();
        })
        $("#awayBtn").html(teamList[awayId].cName||teamList[awayId].eName).click(function(){
            $("#awayNav").slideToggle(200)
        })

        $("#navBox li").click(function(){
            $(this).siblings().removeClass("hover");
             $(this).addClass("hover");
            var hash = window.location.hash || "#";
            var seasonId = $("#seasonsNav .hover").data("id");
            var homeId = $("#homeNav .hover").data("id");
            var awayId = $("#awayNav .hover").data("id");
            if (homeId == awayId){
                return alert("主客队不能相同!");
            }

            location.href = "data.html?participants="+homeId+","+awayId+"&leagueId="+leagueId+"&seasonId="+seasonId+hash;
        });
    }

    function goto(){


    }

    function id2cn (val,val2){
        return teamList[val].cName || val2;
    }

    //积分榜

    function tables (){
        ui.loader("show",$("#tablesHtml"));
        ac.getTables(ids.join(","), opt ,function(data){
            var data = eval("("+data+")");
            ui.loader("hide");
            l(data)
            if(!data.tables) return $("#tablesHtml").html(ui.tip("暂无数据!","请稍后重试"));
            var  o = mergeData (data.tables);
            setList(o);
        });
        //混合开奖数据
        function mergeData(val) {
            var list = val[0].tableRows;

            var o = {};
            o.total = [];
            o.away = [];
            o.home = [];
            l(list)
            $.each(list,function(i,k){
                k.total.i = i+1;
                k.away.i  = i+1;
                k.home.i  = i+1;
                k.total.name = id2cn(k.team.id,k.team.name);
                k.away.name  = id2cn(k.team.id,k.team.name);
                k.home.name  = id2cn(k.team.id,k.team.name);
                if (k.team.id == homeId || k.team.id == awayId ){
                    k.total.css = "hover";
                    k.away.css = "hover";
                    k.home.css = "hover";
                }
                o.total.push(k.total)
                o.away.push(k.away)
                o.home.push(k.home)
            })
            return o;
        }

        //写入到页面
        function setList(val) {
            var lt = hl.compile($("#tablesTemp").html());
            $("#tablesHtml").html(lt(val));
            $("#tablesHtml tbody tr:even").addClass("history-bj");
        }

    }


    //统计
    function statistics(dom){
        var dom = dom || $("#statisticsHtml");
        ui.loader("show",dom);
        ac.getStatistics(opt,function(data){
            var data = eval("("+data+")");
            ui.loader("hide");
            if(!data.stats) return $("#statisticsHtml").html(ui.tip("暂无数据!","请稍后重试"));
            var  o = mergeData (data.stats);
            setList(o);
            setChart(o);

        });


        /*
         gp:已赛,
         gf:进球,
         yc:黄牌,
         rc:红牌,
         st:射正,
         sw:射偏,
         co:角球,
         fc:犯规,
         poss控球率,
         of:越位,
         */
        //混合开奖数据
        var dom = dom;
        function mergeData(val) {
            var o = {};
            o.home = val[0];
            o.away = val[1];
            l(val)
            o.home.cName = id2cn(o.home.teamId);
            o.away.cName = id2cn(o.away.teamId);
            return o;
        }
        //写入到页面
        function setList(val) {
            var lt = hl.compile($("#statisticsTemp").html());

            dom.html(lt(val));
        }
        function setChart(o){
            var h = o.home;
            var a = o.away;
            var ctx = document.getElementById("statisticsBar").getContext("2d");
            var data = {
                labels : ["已赛","进球","黄牌","红牌","射正","射偏","角球","犯规","控球","越位"],
                datasets : [
                    {
                        fillColor : "rgba(200,58,18,1)",
                        //strokeColor : "rgba(220,220,220,1)",
                        data : [h.gp,h.gf,h.yc,h.rc,h.st,h.sw,h.co,h.fc,h.poss,h.of]
                    },
                    {
                        fillColor : "rgba(147,202,57,1)",
                        //strokeColor : "rgba(151,187,205,1)",
                        data : [a.gp,a.gf,a.yc,a.rc,a.st,a.sw,a.co,a.fc,a.poss,a.of]
                    }
                ]
            }
            new Chart(ctx).Bar(data,{

                //Boolean - If we show the scale above the chart data
                scaleOverlay : false,

                //Boolean - If we want to override with a hard coded scale
                scaleOverride : false,

                //** Required if scaleOverride is true **
                //Number - The number of steps in a hard coded scale
                scaleSteps : null,
                //Number - The value jump in the hard coded scale
                scaleStepWidth : null,
                //Number - The scale starting value
                scaleStartValue : null,

                //String - Colour of the scale line
                scaleLineColor : "rgba(0,0,0,.1)",

                //Number - Pixel width of the scale line
                scaleLineWidth : 1,

                //Boolean - Whether to show labels on the scale
                scaleShowLabels : true,

                //Interpolated JS string - can access value
                scaleLabel : "<%=value%>",

                //String - Scale label font declaration for the scale label
                scaleFontFamily : "'Arial'",

                //Number - Scale label font size in pixels
                scaleFontSize : 9,

                //String - Scale label font weight style
                scaleFontStyle : "normal",

                //String - Scale label font colour
                scaleFontColor : "#666",

                ///Boolean - Whether grid lines are shown across the chart
                scaleShowGridLines : true,

                //String - Colour of the grid lines
                scaleGridLineColor : "rgba(0,0,0,.05)",

                //Number - Width of the grid lines
                scaleGridLineWidth : 1,

                //Boolean - Whether the line is curved between points
                bezierCurve : true,

                //Boolean - Whether to show a dot for each point
                pointDot : true,

                //Number - Radius of each point dot in pixels
                pointDotRadius : 3,

                //Number - Pixel width of point dot stroke
                pointDotStrokeWidth : 100,

                //Boolean - Whether to show a stroke for datasets
                datasetStroke : true,

                //Number - Pixel width of dataset stroke
                datasetStrokeWidth : 20,

                //Boolean - Whether to fill the dataset with a colour
                datasetFill : true,

                //Boolean - Whether to animate the chart
                animation : true,

                //Number - Number of animation steps
                animationSteps : 60,

                //String - Animation easing effect
                animationEasing : "easeOutQuart",

                //Function - Fires when the animation is complete
                onAnimationComplete : null


            });
        }




    }



    //赛程
    function fixtures(){
        ui.loader("show",$("#fixturesHtml"));
        ac.getFixtures(opt,function(data){
            var data = eval("("+data+")");
            l(data)
            ui.loader("hide");
            if(!data.events) return $("#fixturesHtml").html(ui.tip("暂无数据!","请稍后重试"));
            var  o = mergeData (data.events);
            setList(o)
        });

        $("#fixturesTab li").click(function(){
            var inx = $("#fixturesTab li").index($(this));
            $("#fixturesTab li").removeClass("sche-on");
            $(this).addClass("sche-on");
            if (inx === 0 ){
                $("#fixturesClosed").show();
                $("#fixturesNotStarted").hide();
            }else if(inx === 1){
                $("#fixturesClosed").hide();
                $("#fixturesNotStarted").show();
            }else{
                $("#fixturesClosed").show();
                $("#fixturesNotStarted").show();
            }



        });


        //混合开奖数据
        function mergeData(list) {
            var o = {};
            var list = list.reverse();
            o.closed = [];
            o.notStarted = [];
            $.each(list,function(i,val){
                val.acName = id2cn(val.awayId);
                val.hcName = id2cn(val.homeId);
                val.date =  val.date.replace(/\ /g,"<br />")+":00";
                val.homeScore = val.homeScore == null ? "-" : val.homeScore;
                val.awayScore = val.awayScore == null ? "-" : val.awayScore;

                if (val.status =="CLOSED"){
                    o.closed.push(val);
                }else{

                    o.notStarted.push(val);
                }



            })
            return o;
        }

        //写入到页面
        function setList(val) {
            var lt = hl.compile($("#fixturesTemp").html());
            $("#fixturesHtml").html(lt(val));
            $("#fixturesHtml tbody tr:even").addClass("history-bj");
        }




    }

    //交锋
    function head2Head(){

        ui.loader("show",$("#head2HeadHtml"));
        ac.getHead2Head(opt,function(data){
            var data = eval("("+data+")");
            l(data)
            ui.loader("hide");

            if(!data.events) return $("#getHead2HeadHtml").html(ui.tip("暂无数据!","请稍后重试"));
            var  o = mergeData(data.events);
            setList(o)
            setChart(o);
            $("#statisticsHtml").html("");
            statistics($("#head2HeadStatistics"));

        });
        function mergeData(val) {
            var o = {};
            var h = {};
            var a = {};
            h.w = 0;//主队胜
            h.d = 0;
            h.l = 0;
            a.w = 0;//主队胜
            a.d = 0;
            a.l = 0;
            o.length = val.length
            $.each(val,function(i,n){
                val[i].hcName =  id2cn(n.homeId);
                val[i].acName =  id2cn(n.awayId);
                val[i].date =  n.date.replace(/\ /g,"<br />")+":00";
                val[i].league =leagueEn2Cn[n.league]||n.league;

                var hs = n.homeScore;
                var as = n.awayScore;
                if (val[i].homeId = homeId){
                    if (hs > as){
                        h.w++;
                        a.l++;
                    }else if(hs < as){
                        h.l++;
                        a.w++;
                    }else{
                        h.d++;
                        a.d++;
                    }
                }else{
                    if (hs > as){
                        h.l++;
                        a.w++;
                    }else if(hs < as){
                        h.w++;
                        a.l++;
                    }else{
                        h.d++;
                        a.d++;
                    }
                }
            })
            o.h = h;
            o.a = a;
            o.hcName = id2cn(homeId);
            o.acName = id2cn(awayId);
            o.vs = val;
            return o;
        }
        //写入到页面
        function setList(o) {
            var lt = hl.compile($("#head2HeadTemp").html());
            $("#head2HeadHtml").html(lt(o));
            $("#head2HeadVs  tr:even").addClass("history-bj");

        }

        function setChart(o){
            var ctx = document.getElementById("head2HeadHomePie").getContext("2d");
            var data = [{value: o.h.w, color:"#85C320"},
                {value : o.h.d, color : "#FF9900"},
                {value : o.h.l, color : "#DC3912"}]
            new Chart(ctx).Pie(data,{});

            var ctx = document.getElementById("head2HeadAwayPie").getContext("2d");
            var data = [{value: o.a.w, color:"#85C320"},
                {value : o.a.d, color : "#FF9900"},
                {value : o.a.l, color : "#DC3912"}]
            new Chart(ctx).Pie(data,{});
        }
    }
    //球员榜
    function topScorers(){
        ui.loader("show",$("#topScorersHtml"));

        ac.getTopScorers(opt,function(data){
            var data = eval("("+data+")");
            ui.loader("hide");

            if(!data.stats) return $("#topScorersHtml").html(ui.tip("暂无数据!","请稍后重试"));
            var o = mergeData (data.stats);
            setList(o)

        });
        function mergeData(val) {
            //var o = [];
            $.each(val,function(i,n){
                val[i].cName =  id2cn(n.teamId);
                val[i].playerName =  n.playerFName + " " + n.playerLName;
                if (n.teamId == homeId || n.teamId == awayId ){
                    val[i].css = "hover";
                }
            })
            return val;
        }
        //写入到页面
        function setList(val) {
            var o = {};
            o.val = val;
            l(o.val);
            var lt = hl.compile($("#topScorersTemp").html());
            $("#topScorersHtml").html(lt(o));
            $("#topScorersHtml tbody tr:even").addClass("history-bj");

        }
    }






    return {
        init: init
    }

})