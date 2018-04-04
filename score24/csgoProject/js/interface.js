define(function(require, exports, module) {
	var $ = require("jquery");
	//获取所有联赛id
	function get_leagues(obj, fn){
		var url = 'http://47.95.200.221:8180/betgenius/csgo/interface/getAllLeagues';
		getData(url, fn);
	}
	//初始化进行中比赛数据
	function coming_game(obj, fn){
		var url = 'http://47.95.200.221:8180/betgenius/csgo/interface/matchList/'+obj.status+'?leagues='+obj.leagues+'&page='+obj.page+'&pageSize='+obj.pageSize;
		//console.log(url);
		getData(url, fn);
	}
	//获取比赛地图详情数据
	function get_detail_lea(obj, fn){
		var url = 'http://47.95.200.221:8180/betgenius/csgo/interface/roundsInMap/'+obj.fixtureId;
		//console.log(url);
		getData(url, fn);
	}
	//获取指定比赛,指定轮次，指定地图数据
	function get_detail_all(obj, fn){
		var url = 'http://47.95.200.221:8180/betgenius/csgo/interface/roundsInMap/'+obj.fixtureId+'?mapNumber='+obj.mapNumber+'&roundNumber='+obj.roundNumber;
		//console.log(url);
		getData(url, fn);
	}
	//获取战队数据
	function get_team_data(obj, fn){
		var url = 'http://47.95.200.221:8180/betgenius/csgo/interface/teamState/'+obj.fixtureId
		//console.log(url);
		getData(url, fn);
	}
	//获取队员数据
	function get_player_data(obj, fn){
		var url = 'http://47.95.200.221:8180/betgenius/csgo/interface/playerState/4907406'
		//console.log(url);
		getData(url, fn);
	}
	
	//获取数据
	function getData(url, fn) {
		$.ajax({
			url: url,
			type:'POST',
			dataType: 'jsonp',
			success: function(data) {
				//console.log(data);
				fn(data);
			},
			error: function(re) {
				//console.log(666);
				//window.location.href = '404.html';
			}
		})
	}
	return {
		coming_game : coming_game,
		get_leagues : get_leagues,
		get_detail_lea : get_detail_lea,
		get_detail_all : get_detail_all,
		get_team_data : get_team_data,
		get_player_data : get_player_data
		
	}
})