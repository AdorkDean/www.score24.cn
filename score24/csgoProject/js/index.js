define(function(require,exports,moudle){
	var $ = require("jquery");
	var hb = require("handlebars").default;
	var ui = require("ui");
	var tab = require("tab");
	var cache = require("cache");
	var eve = require("event");
	var inter = require("interface");
	var gd = require("getData");
	
	//主页进行中数据
	 
	var	page = 1,
		status = 2,
		leaguesId_arr = [];	
		cache.set('page',page);	
	function init(){
		//
		//获取所有联赛id
		inter.get_leagues({},function(data){
			var oData = data.result;
			//筛选页面数据获取
			//gd.select_data();
			//筛选获取csgo数据
			gd.judge_leagues(data);
			//点击筛选页面联赛，筛选数据
			eve.select_click();
			$(oData).each(function(index,value){
				leaguesId_arr.push(value.id);	
			})
			cache.set('leaguesId_arr',leaguesId_arr);
			//获取进行中联赛
			ui.loader("show");
			
			inter.coming_game({status:status,leagues:leaguesId_arr,page:page,pageSize:10},function(data){
				
				
				if(data.code == 200&&data.result.length!=0){
					var data = data.result;
					ui.loader("hide");
					cache.set('status',2);
					//加载进行中数据
					gd.index_data(data,2)
					$(".cs-nav .oLi:eq(1)").addClass('cs-hover').siblings().removeClass('cs-hover');
					
				}else{
					//console.log(777)
					inter.coming_game({status:1,leagues:leaguesId_arr,page:page,pageSize:10},function(data){
						var data = data.result;
						ui.loader("hide");
						cache.set('status',1);	
						gd.index_data(data,1);
						$(".esports-box").eq(0).show().siblings().hide();
						$(".cs-nav .oLi:eq(0)").addClass('cs-hover').siblings().removeClass('cs-hover');
					})
		          
				}
				
			})
			
		})
		//主页选项卡切换
		tab.idx_header_tab();
		//下拉刷新，上拉加载
		eve.pull_down(page);
		//主页点击事件
		cache.click_detail();
		//主页筛选显示
		eve.select_product();
		//点击筛选中全部，回到主页
		eve.select_click_all();
		
		
	}
	return {
		init: init
	}
})
