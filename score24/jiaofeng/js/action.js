define(function (require, exports, module) {
    var $ = require("jquery");
    var ui = require("ui");
    var domain = "http://139.129.99.222:8080";
    var score24 = domain + "/betgenius/score24/api/";
    var betgenius = domain + "/betgenius/inner/api/";

    var callback = "format=jsonp&callback=?";
    var timeout = 30000;

    //处理错误
    function respondError(re) {
        ui.loader("hide");
        // ui.alert(re.statusText+","+re.status);
        if (re.statusText == "timeout") {
           // ui.warning("数据请求超时", "请检查网络连接是否正常");
           // alert("数据请求超时, 请检查网络连接是否正常");
        } else { 
           // alert("请求信息有误, 请稍后访问");
        }
    }

    //首页获取比赛列表

    function getMatchList(opt,fn){
        var page = opt.page || "";
        if (page) page = "page="+page+"&";
        var pageSize = opt.pageSize || 30;
        var url = betgenius + 'betgenius/matchList?'+page+'pageSize='+pageSize+'&' + callback;
        getData (url,fn);

    }

    //获得直播信息
    function getLive(fixtureId,fn){
        var url = betgenius + 'getMatchDetails/'+fixtureId+'?' + callback;
        getData (url,fn);
    }

    //获得技术统计信息
    function getSummary(fixtureId,fn){
        var url = betgenius + 'getMatchSummary/'+fixtureId+'?' + callback;
        getData (url,fn);
    }


    //获取球队、联赛及赛季信息
    function getSeason(opt,fn) {
        var url = score24 + 'getSeasonAndTeams/'+opt.leagueId+'?' + callback;
        getData (url,fn);
    }

    //获取积分榜
    function getTables(ids, opt, fn) {
        var url = score24 + 'leagueTableService/'+opt.leagueId+'?participants='+ids+'&seasonId='+opt.seasonId+ "&"+ callback;
        getData (url,fn);
    }

    //获取统计数据
    function getStatistics(opt, fn) {
        var url = score24 + 'teamsOverviewService/'+opt.leagueId+'?version=1&participants='+opt.participants+'&seasonId='+opt.seasonId+ "&"+ callback;
        getData (url,fn);
    }


    //获取赛程

    function getFixtures(opt, fn) {
        var url = score24 + '/fixtureService/'+opt.leagueId+'?'+opt.participants+'&count=500&'+ callback;

        getData (url,fn);
    }
    //获取交锋数据

    function getHead2Head(opt, fn) {
        var url = score24 + 'head2HeadService?participants='+opt.participants+'&count=10&'+ callback;
        getData (url,fn);
    }
    //获取球员榜

    function getTopScorers(opt, fn) {
        var url = score24 + 'topScorersOverviewService/'+opt.leagueId+'?count=20&version=1&seasonId='+opt.leagueId+'&participants=&'+ callback;
        getData (url,fn);
    }


    //获取联赛列表

    function getLeagueList(fn) {
        var url = score24 + 'getScore24Leagues?'+ callback;
        getData (url,fn);
    }




    //获取数据
    function getData (url,fn){
        $.ajax({
            url: url,
            timeout: timeout,
            dataType: 'jsonp',
            success: function (data) {
                if (!data || data.code !== "200" || !data.result) return fn(false);
                var data = data.result;
                fn(data);
            },
            error: function (re) {
                respondError(re)
            }
        })



    }
    return {
        getTables: getTables,
        getSeason:getSeason,
        getMatchList:getMatchList,
        getLive:getLive,
        getSummary:getSummary,
        getFixtures:getFixtures,
        getHead2Head:getHead2Head,
        getTopScorers:getTopScorers,
        getLeagueList:getLeagueList,
        getStatistics:getStatistics
    }

})