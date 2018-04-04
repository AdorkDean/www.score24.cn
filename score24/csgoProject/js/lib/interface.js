define(function(require, exports, module) {
	var $ = require("jquery");
	//初始化index比赛数据
	function coming_game(obj, fn){
		var url = 'http://api2.310data.com/interface/match/getMatchs?status='+obj.status+'&page='+obj.page+'&pageSize='+obj.pageSize;
		console.log(url);
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
		live_streaming : live_streaming,
		select_league : select_league,
		lea_game_select_url : lea_game_select_url,
		odd_detail_url : odd_detail_url,
		click_zan_data : click_zan_data
	}
})