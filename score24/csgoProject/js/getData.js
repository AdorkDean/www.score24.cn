define(function(require, exports, module) {
	
     

	var $ = require("jquery");
	require("jquery.json")($);
	var inter = require("interface");
	var cache = require("cache");
	var lea_all = require("lea_all");
	var ui = require("ui");
	var hl = require("handlebars").default;
	
	var num = 0;
	//主页三种状态的数据
	function index_data(data,status){
		//判断页面是否为空
		no_data(data,status);
		var oData = data;
		//判断数据状态，进行页面跳转
		judge_html(status);
		var str = '';
		oData.forEach(function(item,index,input){
			//console.log(item)
			//主页时间操作
			var oTime1 = getTime1(item.startTime);
			var oTime2 = getTime2(item.startTime);
			//主客队名字
			var zhu_name = item.homeName?item.homeName.substr(0,12):'';
			var ke_name = item.awayName?item.awayName.substr(0,12):'';
			//判断比赛状态，显示比分
			var Score_z = status==2||status==3?item.homeScore:'';
			var Score_m = status==1?'VS':':';
			var Score_k = status==2||status==3?item.awayScore:'';
			//判断是否能进入详情页
			var detail_url = judge_detail(item,item.hasMathStatus);
			//联赛名称
			var leaName = item.competitionName.substr(6,22);
			//获取当前页数
			str += '<div class="cs-listbox">'
        	str += '<a href="'+detail_url+'">'
        	str += '<div class="cs-titler">'
            str += '<div class="cs-tit-left dl" id="'+statusColor(status)+'">'+statusFont(status)+'</div>'
            str += '<div class="tc cs-tit-txt">'+leaName+'</div>'
            str += '<div class="cs-tit-right dr"><img src="img/cs_p1.png"></div>'
            str += '</div>'
            str += '<div class="cs-vs-txt">'
            str += '<div class="vs-name dl tr">'+zhu_name+'</div>'
            str += '<div class="vs-vs vs-bf tc"><span>'+Score_z+'</span><span class="vs-mgn">'+Score_m+'</span><span>'+Score_k+'</span></div>'
            str += '<div class="vs-name dr">'+ke_name+'</div>'
            str += '</div>'
            str += '<div class="cs-vs-time tc t14" id="'+fontColor(status)+'"><span>'+oTime1+'</span><span>'+oTime2+'</span><span> 3局2胜</span></div>'
        	str += '</a>'
        	str += '</div>'
        	
		})
		//判断状态，插入主页
		$(statusType(status)).prepend(str);
		
	}
	function judge_detail(item,num){
		if(item.hasMathStatus==0){
			return 'javascript:;'
		}else{
			return 'detail.html?'+'matchId='+item.id
		}
	}
	//detail页header
	function get_header_data(data,fixtureId,status){
		
		var str1 = '',str2 = '';
		$(data).each(function(index,item){
			if(item.id == fixtureId){
				//console.log(item)
				//联赛名称
				var leaName = item.competitionName.substr(6,22);
				//header的比赛name
				$("center").html(leaName);
				//主客队名字
				var zhu_name = item.homeName?item.homeName.substr(0,10):'';
				var ke_name = item.awayName?item.awayName.substr(0,10):'';
				//判断比赛状态，显示比分
				var Score_z = status==2||status==3?item.homeScore:'';
				var Score_m = status==1?'VS':':';
				var Score_k = status==2||status==3?item.awayScore:'';
				//console.log(item)
				
				
				str1 += '<div class="cs-tit-left dl cs-over" id="'+statusColor(status)+'">'+statusFont(status)+'</div>'
            	str1 += '<div class="tc cs-tit-txt">'+leaName+'</div>'
           		str1 += '<div class="cs-tit-right dr"><img src="img/cs_p1.png"></div>'
				str2 += '<div class="vs-name dl tr">'+zhu_name+'</div>'
            	str2 += '<div class="vs-vs vs-bf vs-detail"><span>'+Score_z+'</span><span class="vs-mgn">'+Score_m+'</span><span>'+Score_k+'</span></div>'
           		str2 += '<div class="vs-name dr">'+ke_name+'</div>'
				
				
			}
		})
				$('.cs-titler').append(str1);
				$('.cs-vs-txt').append(str2);
	}
	//获取指定比赛详情
	function get_detail_lea(data,fixtureId,status,frameNum){
		var data = data.result;
		//console.log(data)
		var str3 = '',str4 = '',str5 = '',str6='';
		//获取当前局数据
		var currendRounds = data.matchState;	
		$(data.maps).each(function(index,item){
			//console.log(item)
			//判断那一局比赛数据	
			var frame_num = frameNum==0?data.maps.length-1:frameNum-1;
			var oStatus = status==3?'已结束':''
			//判断多少局
			var active_select = index == frame_num?'pop-hover':''
			//局数弹出框
			str6 += '<a judge-round="666" class="'+active_select+'" data-mapNumber="'+item.rounds[0].mapNumber+'">第<span>'+(index+1)+'</span>局</a>'
			  //console.log(item)
			if(index == frame_num){
				//console.log(666)
				var round_num = item.rounds.length;
				//根据比分判断胜负，显示颜色
				var c1 = '',c2 = '', c3 = '';
				if(currendRounds.winner=='TeamOne'){
					c1 = 'oneColor'
				}else if(currendRounds.winner=='TeamTwo'){
					c2 = 'TwoColor'
				}else{
					c3 = ''
				}
				//判断第几局
				var n = index+1;
				//判断获胜方式
				var arrType = item.rounds
				var judjewinner_mothod = judgeType(arrType[arrType.length-1].winMethod);
				str3 += '<div class="dl tr sus-name">'+judjewinner_mothod+'</div>'
                str3 += '<div class="sus-hh clickRounds">第'
                //str3 += '<select name="" id="select-mune">第一局<i></i></select>'
                str3 += '<a id="frame_num">'+n+'</a>局<i></i>'
                str3 += '</div>'
//				str4 += '<div class="dl sus-name tr sus-number" id="'+c1+'">'+item.scoreInRoundsTeamOne+'</div>'
//	            str4 += '<div class="sus-over">第'+round_num+'回合<span>'+oStatus+'</span></div>'
//	            str4 += '<div class="sus-number2 dr" id="'+c2+'">'+item.scoreInRoundsTeamTwo+'</div>'
				str4 += '<div class="dl sus-name tr sus-number" id="'+c1+'">'+currendRounds.currentMapScoreInRoundsTeamOne+'</div>'
	            str4 += '<div class="sus-over">第'+round_num+'回合<span>'+oStatus+'</span></div>'
	            str4 += '<div class="sus-number2 dr" id="'+c2+'">'+currendRounds.currentMapScoreInRoundsTeamTwo+'</div>'
				str5 += '<div class="dl sus-map">地图：'+item.name+'</div>'
                str5 += '<div class="sus-msg-time">拆弹时间：'+item.rounds[0].bombTime.slice(2)+'</div>'
                str5 += '<div class="dr sus-vs-time">比赛时间：'+item.rounds[0].roundTime.slice(3)+'</div>'
			}
			
		})
		$('.sus-frame,.sus-detail,.sus-omap,.frame_num').empty();
		$('.bureau,.win,.round').empty();
		$('.bureau').append('3');//currendRounds.matchFormatBestOfMaps
		$('.win').append('2');//currendRounds.matchFormatBestOfMaps-1
		$('.round').append(currendRounds.matchFormatBestOfRounds);
		$('.sus-frame').append(str3);
		$('.sus-detail').append(str4);
		$('.sus-omap').append(str5);
		$('.frame_num').append(str6);
		//点击筛选局势
		click_frame();
		
	}
	//获取指定比赛回合数，指定轮次的数据
	function get_detail_lea_rounds(data,fixtureId,status,frameNum){
		
		
		var data = data.result;
		var list_first = '',list_last = '';
		//判断那一局比赛数据
		var frame_num = frameNum==0?data.maps.length-1:frameNum-1;
		$(data.maps).each(function(index,item){
			
			if(index == frame_num){
				//console.log(666)
				var oData = item.rounds;
				$(oData).each(function(index,item){
					//console.log(item)
					//当前回合的颜色显示
					var doing_round = index==oData.length-1?'active_color':''
					if(index>oData.length-5){
						list_last += '<li  data-roundNumber="'+(item.number)+'" class="'+doing_round+'">'+(index+1)+'回合</li>'
					}
					list_first += '<a data-roundNumber="'+(item.number)+'">第'+(index+1)+'回合</a>'
				})
			}
		})
		$('.rounds_num').empty();
		$('li[data-roundnumber]').remove();
		$('.rounds_number_all').append(list_last);
		$('.rounds_num').append(list_first);
		//点击筛选回合数
		click_rounds();
		
	}
	//获取指定比赛,指定轮次，指定地图数据
	function get_detail_all(data,idx,frameNum,nameNum){
		
		var oData = data.result;
		var playerName = '';
		//判断警察还是匪徒
		var jf = idx=='1'?'TeamOne':'TeamTwo'
		//判断那一局比赛数据
		var frame_num = frameNum==0?data.length-1:frameNum-1;
		$(oData).each(function(index,item){
			if(item.team==jf){
				
				//判断一血是哪个队员
				var firstKill = item.firstKill=='true'?'<img src="img/yx.png">':''
				//判断谁带包
				var hasBomb = item.hasBomb=='true'?'<img src="img/C4zd.png">':''
				
				//默认第一个队员数据显示
				var firstIdx = index==nameNum-1||index==nameNum+4?'team-hover':''
				//console.log(firstIdx);
				var oIdx = index+1;
				//队员名字
				playerName += '<li class="'+firstIdx+'" data-name="'+oIdx+'">'+item.playerName.substr(0,5)+firstKill+'</li>'
				//每个队员数据
					
				if(oIdx == nameNum||oIdx == nameNum+5){
					//console.log(item)
					cache.set('playerDetail',$.toJSON(item))
				}
			}
		})
		$('.policeName').empty();
		$('.policeName').append(playerName);
		
		
	}
	//筛选页面数据获取
	function select_data(data){
		var oData = data;
		//console.log(oData)
		var str = '';
		var all_str = '';
		var num = 0;
		oData.forEach(function(item,index,input){
			str += '<li data-num="'+num+'">'+item.name.slice(0,12)+'<img src="img/dj_p5.png"></li>'
			num++;
		})
		$('#select_data').append(str);
	
	}
	//获取筛选联赛数据
	function lea_game_select(data,status){
		
		$(".cont-box").eq(status-1).empty();
		index_data(data.result,status);
		
	}
	//获取每个游戏里面联赛数据
	function judge_leagues(data){
		
			var oData = data.result;
			var str = '';
			var all_str = '';
			
			$(oData).each(function(index,item){
				var csgo = item.name.substr(0,6);
				if(csgo == '[CSGO]'){
					all_str+='<a data-gameId="'+item.id+'" href="javascript:;">'+item.name.substr(6)+'</a>'
				}
			})
			$('.screen-right').append(all_str);
	}
	//点击获取赛程里面战队数据
	function get_player_data(data){
		var str = '',
		    playerNameP = [],
		    playerNameG = [],
			killsArr = [],
			assistsArr = [],
			deathsArr = [],
			bombsDefusedArr = [],
			bombsPlantedArr = [],
			headshotsArr = [],
			firstKillsArr = [],
			firstDeathsArr = [],
			roundsSurvivedArr = [],
			damageGivenArr = [],
			damageReceivedArr = [],
			killsArr1 = [],
			assistsArr1 = [],
			deathsArr1 = [],
			bombsDefusedArr1 = [],
			bombsPlantedArr1 = [],
			headshotsArr1 = [],
			firstKillsArr1 = [],
			firstDeathsArr1 = [],
			roundsSurvivedArr1 = [],
			damageGivenArr1 = [],
			damageReceivedArr1 = [];
			
		$(data).each(function(index,item){
			//console.log(item)
			item.team == 'TeamOne'?getPolice(index,item,playerNameP,killsArr,assistsArr,deathsArr,bombsDefusedArr,bombsPlantedArr,headshotsArr,firstKillsArr,firstDeathsArr,roundsSurvivedArr,damageGivenArr,damageReceivedArr):getGangster(index,item,playerNameG,killsArr1,assistsArr1,deathsArr1,bombsDefusedArr1,bombsPlantedArr1,headshotsArr1,firstKillsArr1,firstDeathsArr1,roundsSurvivedArr1,damageGivenArr1,damageReceivedArr1);	
		    
		})
		
		//操作警察数据
		var dom = {
			playerNameP: playerNameP,
			playerNameG: playerNameG,
			killsArr: killsArr,
			killsArr1: killsArr1,
			assistsArr: assistsArr,
			assistsArr1: assistsArr1,
			deathsArr: deathsArr,
			deathsArr1: deathsArr1,
			bombsDefusedArr: bombsDefusedArr,
			bombsDefusedArr1: bombsDefusedArr1,
			bombsPlantedArr: bombsPlantedArr,
			bombsPlantedArr1: bombsPlantedArr1,
			headshotsArr: headshotsArr,
			headshotsArr1: headshotsArr1,
			firstKillsArr: firstKillsArr,
			firstKillsArr1: firstKillsArr1,
			firstDeathsArr: firstDeathsArr,
			firstDeathsArr1: firstDeathsArr1,
			roundsSurvivedArr: roundsSurvivedArr,
			roundsSurvivedArr1: roundsSurvivedArr,
			damageGivenArr: damageGivenArr,
			damageGivenArr1: damageGivenArr1,
			damageReceivedArr: damageReceivedArr,
			damageReceivedArr1: damageReceivedArr
		};
		//console.log(dom)
		var lt = hl.compile($("#playerData").html());
        $("#playerDataBox").html(lt(dom));
		
	}
	//获取赛况选手数据中主队警察数据
	function getPolice(index,item,playerNameP,killsArr,assistsArr,deathsArr,bombsDefusedArr,bombsPlantedArr,headshotsArr,firstKillsArr,firstDeathsArr,roundsSurvivedArr,damageGivenArr,damageReceivedArr){
		
		//获取队员名字
			//var playerNameP=[];
           // playerNameP += '<td>'+item.playerName.substr(0,5)+'</td>' 
         	//playerNameP.push(item.playerName)
			//console.log(item.kills)
			
			return playerNameP.push(ui.setName(item.playerName)),
				   killsArr.push(ui.slice_string(item.kills)),
				   assistsArr.push(ui.slice_string(item.assists)),
				   deathsArr.push(ui.slice_string(item.deaths)),
				   bombsDefusedArr.push(ui.slice_string(item.bombsDefused)),
				   bombsPlantedArr.push(ui.slice_string(item.bombsPlanted)),
				   headshotsArr.push(ui.slice_string(item.headshots)),
				   firstKillsArr.push(ui.slice_string(item.firstKills)),
				   firstDeathsArr.push(ui.slice_string(item.firstDeaths)),
				   roundsSurvivedArr.push(ui.slice_string(item.roundsSurvived)),
				   damageGivenArr.push(ui.slice_string(item.damageGiven)),
				   damageReceivedArr.push(ui.slice_string(item.damageReceived))

	}
	//获取赛况选手数据中客队匪徒数据
	function getGangster(index,item,playerNameG,killsArr1,assistsArr1,deathsArr1,bombsDefusedArr1,bombsPlantedArr1,headshotsArr1,firstKillsArr1,firstDeathsArr1,roundsSurvivedArr1,damageGivenArr1,damageReceivedArr1){
		
		  // playerNameG.push(item.playerName)
            
			return playerNameG.push(ui.setName(item.playerName)),
				   killsArr1.push(ui.slice_string(item.kills)),
				   assistsArr1.push(ui.slice_string(item.assists)),
				   deathsArr1.push(ui.slice_string(item.deaths)),
				   bombsDefusedArr1.push(ui.slice_string(item.bombsDefused)),
				   bombsPlantedArr1.push(ui.slice_string(item.bombsPlanted)),
				   headshotsArr1.push(ui.slice_string(item.headshots)),
				   firstKillsArr1.push(ui.slice_string(item.firstKills)),
				   firstDeathsArr1.push(ui.slice_string(item.firstDeaths)),
				   roundsSurvivedArr1.push(ui.slice_string(item.roundsSurvived)),
				   damageGivenArr1.push(ui.slice_string(item.damageGiven)),
				   damageReceivedArr1.push(ui.slice_string(item.damageReceived))      
	}
	//点击筛选回合数
	function click_rounds(){
		//详情页回合切换
		$(".rounds_number_all li").click(function(){
	   		$(".rounds_number_all li").removeClass("active_color");
	   		$(this).addClass("active_color");
	   		var idx = $(this).attr('data-roundNumber');
	   		
	    })
		//点击弹出框里面回合数
		$(".rounds_num a").click(function(){
	   		$(".rounds_num a").removeClass("pop-hover");
	   		$(".rounds_num a").removeAttr("judge-round");
	   		$(this).addClass("pop-hover"); 
	   		$(this).attr("judge-round",'666'); 
	   		$('#rounds').hide();
			$('body,html').css({"overflow":"visible"})
	    })
		//点击展开弹出框局数
		$('.nav-before').click(function(){
			$('#rounds').show();
			$('body,html').css({"overflow":"hidden"})
		})
		//点击关闭弹出框局数
		$('.closebtn').click(function(){
			$('#rounds').hide();
			$('body,html').css({"overflow":"visible"})
		})
		
	}
	//点击筛选局数
	function click_frame(){
		$('.jishi .clickRounds').click(function(){
			$('.popbox').show();	
			$('body,html').css({"overflow":"hidden"})
			
		})
		//点击关闭局数
		$('.closebn').click(function(){
			$('.popbox').hide();
			$('body,html').css({"overflow":"visible"})
		})
		
	}
	

	function judgeType(item){
		if(item == 'BombDefused'){
			return 'BombDefused'
		}else if(item == 'Elimination'){
			return 'Elimination'
		}else if(item == 'TargetBombed'){
			return 'TargetBombed'
		}else if(item == 'TargetSaved'){
			return 'TargetSaved'
		}else{
			
			return ''
		}
	}
	//根据比分判断胜负，显示颜色
	function judegColor(item){
		if(item.winner=='TeamOne'){
			return 'oneColor'
		}else if(item.winner=='TeamTwo'){
			return 'TwoColor'
		}else{
			return ''
		}
	};
	//根据状态，判断字体颜色
	function fontColor(status){
		if(status == 1){
			return 'color-coming-font'
		}
		else if(status == 2){
			return 'color-starting-font'
		}
		else if(status == 3){
			return 'color-ending-font'
		}
	}
	//根据状态，判断颜色
	function statusColor(status){
		if(status == 1){
			return 'color-coming'
		}
		else if(status == 2){
			return 'color-starting'
		}
		else if(status == 3){
			return 'color-ending'
		}
		else if(status == 'PreGame'){
			
			return 'color-coming'
		}
		else if(status == 'Scheduled'){
			return 'color-starting'
		}
		else if(status == 'PostGame'){
			return 'color-ending'
		}
	}
	//插入不同页面
	function statusType(status){
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
	
	//页面为空时
	function no_data(data,status){	
			if(data.length == 0&&status == 1){
				$(".cont-box").eq(0).html('<img style="height: 11.1rem;margin-top: 50%;" src="img/dj_p4.png">')
			}else if(data.length == 0 && status == 2){
				$(".cont-box").eq(1).html('<img style="height: 11.1rem;margin-top: 50%;" src="img/dj_p4.png">')
			}else if(data.length == 0 && status == 3){
				$(".cont-box").eq(2).html('<img style="height: 11.1rem;margin-top: 50%;" src="img/dj_p4.png">')
			}
			
	}
	//判断状态页面跳转
	function judge_html(status){
		if(status == '1'){
			$(".cont-box").hide();
			$(".cont-box:eq(0)").show();
		}
		else if(status == '2'){
			$(".cont-box").hide();
			$(".cont-box:eq(1)").show();
		}
		else if(status == '3'){
			//console.log(666)
			$(".cont-box").hide();
			$(".cont-box:eq(2)").show();
		}
		
	}
	//时间操作
	function getTime1(time){
		var time = time.slice(5,7)+'月'+time.slice(8,10)+'日';
		return time;
	}
	function getTime2(time){
		//console.log(time);
		var time = time.slice(11,16);
		return time;
	}
	//判断比赛状态
	function statusFont(status){
		if(status == 1){
			return '未开始'
		}
		else if(status == 2){
			return '进行中'
		}
		else if(status == 3){
			return '已完赛'
		}
		else if(status == 'PreGame'){
			return '未开始'
		}
		else if(status == 'Scheduled'){
			return '进行中'
		}
		else if(status == 'PostGame'){
			return '已完赛'
		}
	}
	return {
		index_data : index_data,
		get_header_data : get_header_data,
		get_detail_lea : get_detail_lea,
		get_detail_lea_rounds : get_detail_lea_rounds,
		get_detail_all : get_detail_all,
		get_player_data : get_player_data,
		select_data : select_data,
		judge_leagues : judge_leagues,
		lea_game_select : lea_game_select
	}
	
})
	