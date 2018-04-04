define(function(require,exports,moudle){
	var $ = require("jquery");
	var inter = require("interface");
	var hl = require("handlebars").default;
	var cache = require("cache");
	var ui = require("ui");
	var eve = require("event");
	var gd = require("getData");
	var tab = require("tab");
	var href = ui.href();
	
	var idx = 666,
		num=0,
		frameNum = 0,
		nameNum = 1;
	
	function init(){
		//返回上一个页面
		var btn = document.querySelector(".cs-return");
		btn.addEventListener("touchstart",function(e){
			e.preventDefault();
			window.history.go(-1) 
		},false)
           
		//详情页tab切换
		tab.detail_tab();
		//获取即时数据，指定比赛双方详情
		var status = cache.get('status');
		var leagues = cache.get('leaguesId_arr');
		var page = cache.get('page'); 
		
		inter.coming_game({status:status,leagues:leagues,page:page,pageSize:10},function(data){
			if(data.code == 200&&data.result.length!=0){
				var fixtureId = href.matchId;
				var data = data.result
				//console.log(data)
				gd.get_header_data(data,fixtureId,status);
			} 
		})
		
		var fixtureId = href.matchId;
		inter.get_detail_lea({fixtureId:fixtureId},function(data){
			
			if(data.code == 200){
				//console.log(data)
				gd.get_detail_lea(data,fixtureId,status,frameNum);
				gd.get_detail_lea_rounds(data,fixtureId,status,frameNum);
			}else{
				
			}
			//获取指定比赛,指定轮次，指定地图数据
			//判断警察还是匪徒显示数据
			var idx = $("div[data-num]").attr('data-jf');
			get_police_fei(idx,num,frameNum,nameNum)
			//点击回合数获取数据
			$("li[data-roundnumber],a[data-roundnumber]").click(function(){
				//console.log(666)
				var frameN = $("a[judge-round]").find('span').text();
				//console.log(frameN)
				var num = $(this).attr('data-roundNumber');
				num==undefined?'':get_police_fei(idx,num,frameNum,nameNum)
				console.log(num)
				//gd.get_detail_lea_rounds(data,fixtureId,status,frameNum);
				
			})
			//点击局数数据
			$('.frame_num').on('click','a',function(){

		   		var frameNum = $(this).find('span').text();
		   		$('.popbox').hide();
				$('body,html').css({"overflow":"visible"})
				gd.get_detail_lea(data,fixtureId,status,frameNum);
				gd.get_detail_lea_rounds(data,fixtureId,status,frameNum);
				get_police_fei(idx,num,frameNum,nameNum)
			})
		})
		
		function get_police_fei(idx,num,frameNum,nameNum){
			
			var fixtureId = href.matchId;
			//默认地图
			var mapNumber = $(".pop-hover").attr("data-mapNumber");
			
			//默认回合数
			var roundNumber = num!=0?num:$(".rounds_number_all li:last-child").attr("data-roundNumber");
			
			inter.get_detail_all({fixtureId:fixtureId,mapNumber:mapNumber,roundNumber:roundNumber},function(data){
				if(data.code == 200){
					//console.log(data)
					//默认展示警察，第一个队员的数据	
					gd.get_detail_all(data,idx,frameNum,nameNum);
					
					//展示默认队员数据
					var dataList =eval("("+ cache.get('playerDetail')+")");
					//console.log(dataList)
					var o = setList(dataList,data.result);
					var lt = hl.compile($("#detailTemp").html());
        			$("#detail").html(lt(o));
					//展示默认队员数据
					
				}else{}
			})
		}
		
		function setList(dataList,data){
			
			var healthPoints_per = 0,
			    assists_per = 0,
			    bombDefused_per = 0,
			    bombPlanted_per = 0,
			    headshots_per = 0,
			    damageGiven_per = 0,
			    damageReceived_per = 0;  
			$(data).each(function(index,item){
				if(item.team == dataList.team){
					//console.log(item)
					var perArr_healthPoints = item.healthPoints.split(','),
						perArr_assists = item.assists.split(','),
						perArr_bombDefused = item.bombDefused=='true'?1:0,
						perArr_bombPlanted = item.bombPlanted=='true'?1:0,
						perArr_headshots = item.headshots.split(','),
						perArr_damageGiven = item.damageGiven.split(','),
						perArr_damageReceived = item.damageReceived.split(',');
						
					healthPoints_per += Number(perArr_healthPoints[perArr_healthPoints.length-1]);
					assists_per += Number(perArr_assists[perArr_assists.length-1]);
					bombDefused_per += Number(perArr_bombDefused);
					bombPlanted_per += Number(perArr_bombPlanted);
					headshots_per += Number(perArr_headshots[perArr_headshots.length-1]);
					damageGiven_per += Number(perArr_damageGiven[perArr_damageGiven.length-1]);
					damageReceived_per += Number(perArr_damageReceived[perArr_damageReceived.length-1]);
					
				}
				
			})
			
			
			var o = {};
			o.healthPoints = ui.slice_string(dataList.healthPoints,healthPoints_per);
			o.assists = ui.slice_string(dataList.assists,assists_per);
			o.bombDefused = ui.slice_string(dataList.bombDefused,bombDefused_per);
			o.bombPlanted = ui.slice_string(dataList.bombPlanted,bombPlanted_per);
			o.headshots = ui.slice_string(dataList.headshots,headshots_per);
			o.damageGiven = ui.slice_string(dataList.damageGiven,damageGiven_per);
			o.damageReceived = ui.slice_string(dataList.damageReceived,damageReceived_per);
			o.moneyRemaining = ui.slice_string(dataList.moneyRemaining);
			o.moneySpent = ui.slice_string(dataList.moneySpent);
			o.spend = ui.slice_string(dataList.moneySpent).b-ui.slice_string(dataList.moneyRemaining).b;
			o.moneyPercent = (ui.slice_string(dataList.moneyRemaining).b/ui.slice_string(dataList.moneySpent).b)*100;
			o.isAlive = dataList.isAlive=='false'?'死亡':'占比';
			o.isAliveImg = dataList.isAlive=='false'?'<img src="img/ysw.png">':o.healthPoints.e+'%';
			var equipments = dataList.equipments;
			
			equipments.length == '0'?$('#oM').css({"display":"none"}):''
			$(equipments).each(function(index,item){
				
				o.oNumber = '<td>编号</td><td>类型</td><td>武器</td><td>价格</td>'
				
				var orderNo = item.orderNo?item.orderNo:''
				var name = item.name?item.name:''
				var type = item.type?item.type:''
				var value = item.type?item.value:''
				o.equipments = equipments
//			     o.equipments.push({
//			     	orderNo : orderNo,
//			     	name : name ,
//			     	type : type,
//			     	value : value
//			     })
			    
			})
			//console.log(o)
			return o
		}
		//点击获取匪徒数据
		$(".police-bandits div").click(function(){
			var idx = $("div[data-num]").attr('data-jf');
			get_police_fei(idx,num,frameNum,nameNum)
			$(".rounds_number_all li").removeClass("active_color");
			$(".rounds_number_all li:last-child").addClass("active_color");
			
		})
		//点击队员名字切换数据
		$('.policeName').on('click','li',function(){
			$('.policeName li').removeClass('team-hover');
			$(this).addClass('team-hover');
			var nameNum = $(this).attr('data-name');
			var idx = $("div[data-num]").attr('data-jf');
			get_police_fei(idx,num,frameNum,nameNum);
		})
		//获取赛程里面战队数据
		$('.data-nav').on('click','li:eq(1)',function(){
			var fixtureId = href.matchId;
			inter.get_team_data({fixtureId:fixtureId},function(data){
				//console.log(data)
				if(data.code=='200'){
					var oData = $.toJSON(data.result);
					
					var dataArr =eval("("+ oData+")");
					//战队数据建造
					var list = set_team_list(dataArr);
					var lt = hl.compile($("#teamTemp").html());
        			$("#teamDetail").html(lt(list));
					
				}
			})
		})
		//获取赛程里面队员的数据
		$('.player-data').on('click','.player2',function(){
			var fixtureId = href.matchId;
			inter.get_player_data({fixtureId:fixtureId},function(data){
				if(data.code=='200'){
					//var oData = $.toJSON(data.result);
					var oData = data.result;
					gd.get_player_data(oData);
				}
			})
		})
		//建造战队数据
		function set_team_list(dataArr){
			//console.log(dataArr)
			var o = {};
			$(dataArr).each(function(index,item){
				//console.log(item);
				if(index==dataArr.length-2){
					//警察击杀
					o.killsOne = ui.slice_string_team(item.kills,true);
					o.assistsOne = ui.slice_string_team(item.assists,true);
					o.deathsOne = ui.slice_string_team(item.deaths,true);
					o.bombsDefusedOne = ui.slice_string_team(item.bombsDefused,true);	
					o.bombsPlantedOne = ui.slice_string_team(item.bombsPlanted,true);	
					o.headshotsOne = ui.slice_string_team(item.headshots,true);	
					o.firstKillsOne = ui.slice_string_team(item.firstKills,true);	
					o.firstDeathsOne = ui.slice_string_team(item.firstDeaths,true);
					o.damageReceivedOne = ui.slice_string_team(item.damageReceived,true);
					o.damageGivenOne = ui.slice_string_team(item.damageGiven,true);
					o.roundsSurvivedOne = ui.slice_string_team(item.roundsSurvived,true);
					o.updateTime = ui.timeUi(item.updateTime);
				}else{
					//匪徒击杀
					o.killsTwo = ui.slice_string_team(item.kills,false);
					o.assistsTwo = ui.slice_string_team(item.assists,false);
					o.deathsTwo = ui.slice_string_team(item.deaths,false);
					o.bombsDefusedTwo = ui.slice_string_team(item.bombsDefused,false);	
					o.bombsPlantedTwo = ui.slice_string_team(item.bombsPlanted,false);	
					o.headshotsTwo = ui.slice_string_team(item.headshots,false);	
					o.firstKillsTwo = ui.slice_string_team(item.firstKills,false);	
					o.firstDeathsTwo = ui.slice_string_team(item.firstDeaths,false);
					o.damageReceivedTwo = ui.slice_string_team(item.damageReceived,false);
					o.damageGivenTwo = ui.slice_string_team(item.damageGiven,false);
					o.roundsSurvivedTwo = ui.slice_string_team(item.roundsSurvived,true);
				}
				
			})
			o.damageGivenOne_percent = o.damageGivenOne.b*0.006
			o.damageReceivedOne_percent = o.damageReceivedOne.b*0.006
			
			o.damageGivenTwo_percent = o.damageGivenTwo.b*0.006
			o.damageReceivedTwo_percent = o.damageReceivedTwo.b*0.006
			
		//console.log(o)
			return o
		}
		
		
	}
	
	return {
		init: init
	}
})
