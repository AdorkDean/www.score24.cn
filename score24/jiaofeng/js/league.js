define(function (require, exports, module) {
    var $ = require("jquery");
    require("jquery.json")($);
    var hl = require("handlebars").default;
    var lib = require("tool");
    var cache = require("cache");
   // console.log(cache);
    var ac = require("action");
    var ui = require("ui");
    var l = lib.log;


    var leagueList = null;


    function init(){
        getLeagueList ();
    }
    function getLeagueList () {
        ac.getLeagueList(function (data) {
            leagueList = mergeData(data);
            setList(leagueList,bindNation)
        });
    }

    function bindNation(){
        $("#nationBox li").click(function(){
            var inx = $(this).data("inx");
            var val = leagueList[inx];
            var lt = hl.compile($("#leagueTemp").html());
            var val = lt(val);
            $("#leagueBox").html(val);

            $("#nationBox").slideUp(300,function(){

                $("#leagueBox").slideDown(600);

            });


        })
    }


    //混合开奖数据
    function mergeData(list) {
        var oldCode = null;
        $.each(list,function(i,val){
            var code = val.pinyin.slice(0,1).toUpperCase();
            if (code != oldCode){
                list[i].codeHtml = '<h2 class="country-tit-b">'+code+'</h2>';
                oldCode = code;
            }
            list[i].code = code;
            list[i].inx =i ;
        })
       return list;
    }
    //写入到页面
    function setList(list,fn) {
        var lt = hl.compile($("#nationTemp").html());
        
        var val = lt({list:list});
        console.log(val);
        $("#nationBox").html(val);
        fn();
    }
    return {
        init: init
    }

})