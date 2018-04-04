define(function (require, exports, module) {
    var lib = require("tool");
    var href = lib.href();
    if (!href.leagueId){
       return location.href = 'data.html?participants=3,4&leagueId=6117&seasonId=2519932#tables';
    }
    var ac = require("action");
    function init(){
        var leagueId = href.leagueId || 6117;
        ac.getSeason({leagueId:leagueId},function(data){
            var seasons = eval("("+data.seasons+")");
            seasons = seasons.seasons;
            var teams = data.teams;
           location.href = 'data.html?participants='+teams[0].teamId+','+teams[1].teamId+
                '&leagueId='+leagueId+'&seasonId='+seasons[0].id+'#tables';
        })
    }
    return {
        init : init
    }

})