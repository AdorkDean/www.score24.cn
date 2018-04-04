define(function(require,exports,moudle){
	var $ = require("jquery");
	var inter = require("interface");
	var cache = require("cache");
	var gd = require("getData");
	//主页选项卡切换
	function idx_header_tab(){
		$(".cs-nav .oLi").click(function(){
	   		$(".cs-nav .oLi").removeClass("cs-hover");
	   		$(this).addClass("cs-hover");
	    	$(".cont-box").hide();
	    	var index=$(".cs-nav .oLi").index($(this));
	    	$(".cont-box:eq("+index+")").show();
	    	
	    	var dataStatus = $(this).attr("data-status");
	    	var page = 1;
	    	localStorage.setItem('status',dataStatus);
	    	localStorage.setItem('page',page); 
	    	var league_Id = cache.get('leaguesId_arr');
	    	if(!dataStatus){
	    		window.location.href = 'index.html'
	    	}
	    	else{
	    		inter.coming_game({status:dataStatus,leagues:league_Id,page:page,pageSize:10},function(data){
					var data = data.result;
					$(statusTypea(dataStatus)).empty();
	 				gd.index_data(data,dataStatus);
 				});
	    	}
				//eve.pull_down(page);
			
	    	
		})
	}
	function statusTypea(status){
		if(status == 1){
			return '#coming'
		}
		else if(status == 2){
			return '#starting'
		}
		else if(status == 3){
			return '#ending'
		}
	}
	//detail详情页切换
	function detail_tab(){
		$(".data-nav li").click(function(){
	   		$(".data-nav li").removeClass("data-hover");
	   		$(this).addClass("data-hover");
	    	$(".data-box").hide();
	    	var index=$(".data-nav li").index($(this));
		    $(".data-box:eq("+index+")").show();
		    $(".data-box:eq(1)").find('.clickRounds i').css({"display":"none"});
		    $('.sus-hh').css({"text-align":"center"})
		})
		
		$(".police-bandits div").click(function(){
	   		$(".police-bandits div").removeClass("pol-hover");
	   		$(this).addClass("pol-hover");
			$(this).attr("data-num",1).siblings().removeAttr('data-num')
	    	
		})
		
		$(".player-data div").click(function(){
	   		$(".player-data div").removeClass("play-on");
	   		$(this).addClass("play-on");
	
	    	$(".player-box").hide();
	    	var index=$(".player-data div").index($(this));
	    	$(".player-box:eq("+index+")").show();
	    })

		
	}
	
	
	return {
		idx_header_tab: idx_header_tab,
		detail_tab: detail_tab
	}
})