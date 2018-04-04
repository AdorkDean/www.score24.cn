define(function(require,exports,moudle){
	var $ = require("jquery");
	var inter = require("interface");
	var cache = require("cache");
	var gd = require("getData");
	//点击筛选页面联赛获取数据
	function select_click(){
		$('.screen-right').on('click','a',function(){
			console.log(666)
			//判断筛选之后返回那个页面状态
			judge_status();
			var flag = localStorage.setItem('flag',true); 
			var status = localStorage.getItem('status');
			var gameId  = $(this).attr('data-gameId')?$(this).attr('data-gameId'):'';
			localStorage.setItem('gameId',gameId); 
				inter.coming_game({status : status,leagues : gameId,page:'1',pageSize:'10'},function(data){
					console.log(data)
					gd.lea_game_select(data,status);
				});
		})
	}
	//判断筛选之后返回那个页面状态
	function judge_status(){
		$('.select_box').hide();
		$('.all-box').show();
	}
	//主页筛选显示
	function select_product(){
		$('.cs-header-r').click(function(){
			$('.all-box').hide();
			$('.select_box').show();
		})
	}
	//点击筛选页面全部按钮
	function select_click_all(){
		$('#select_data li:eq(0)').click(function(){
			window.location.href="index.html";
		})
	}
	//下拉刷新，上拉加载
	function pull_down(page){
		var myScroll,//实例化对象保存的变量
			pullDownEl, 
			pullDownOffset,
			generatedCount = 0;//计数
		
		function pullDownAction (page) {//下拉刷新的时候，插入数据的函数
			//console.log(page);
			
			setTimeout(function () {// <-- Simulate network congestion, remove setTimeout from production!模拟网络请求
				//var el, a, i;
				//el = document.getElementById('coming');//存放li的ul
					var status = pull_status();
					var leaguesId_arr = cache.get('leaguesId_arr');
					inter.coming_game({leagues:leaguesId_arr,status:status,page:page,pageSize:10},function(data){
						var data = data.result;
						console.log(data)
						if(data.length == 0 && status == 2){
							
						}else{
							
							gd.index_data(data,status);
						}
						
					});
				
				myScroll.refresh();// Remember to refresh when contents are loaded (ie: on ajax completion)
			},500);	// <-- Simulate network congestion, remove setTimeout from production!
		}
		function loaded() {
			
			
			pullDownEl = document.getElementById('pullDown');//上面要扯出来的东西
			pullDownOffset = pullDownEl.offsetHeight;//上面藏着的东西的高度
			setTimeout(function(){
				myScroll = new iScroll('wrapper', {//实例化
					useTransition: true,
					topOffset: pullDownOffset,//为了把上面的东西塞进去
					checkDOMChanges: true, 
					onBeforeScrollStart: null,
					onRefresh: function () {//加载完数据后恢复状态			
						if (pullDownEl.className.match('loading')) {
							pullDownEl.className = '';
							pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
						}else{} 
					},
					//onBeforeScrollStart:null,
					onScrollMove: function () {
						//this.y》5代表着上面的东西被扯出来了     没有flip类名（代表箭头向上，提醒：放开刷新）	
						if (this.y > 5 && !pullDownEl.className.match('flip')) {//加上flip类名
							pullDownEl.className = 'flip';
							pullDownEl.querySelector('.pullDownLabel').innerHTML = '松开更新';
							//pullDownEl.querySelector('.pullDownIcon').innerHTML = "<img src='img/dzjj/dj_p2.png'/>";
							this.minScrollY = 0;
						} else if (this.y < 5 && pullDownEl.className.match('flip')) {//塞回去的时候，恢复默认显示
							pullDownEl.className = '';
							pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
							//pullDownEl.querySelector('.pullDownIcon').innerHTML = "<img src='img/dzjj/dj_p14.png'/>";
							this.minScrollY = -pullDownOffset;//保证能把上面的东西塞回去，最小滑动的距离，如果不够，自动会到达那个位置
						} 
					},
					onScrollEnd: function () {
						
						if (pullDownEl.className.match('flip')) {//如果放手时候上面的东西已经出来
							pullDownEl.className = 'loading';//改成加载的状态
							pullDownEl.querySelector('.pullDownLabel').innerHTML = '数据刷新中';	
							//var page = Number(localStorage.getItem('page'));
							var pag = Number(localStorage.getItem('page'));
							if(pag){
									pag+=1
									localStorage.setItem('page',pag); 
									pullDownAction(pag);
								
							}else{
								//console.log(999)
								if(page == '0'){
									pullDownAction(page);
								}else{
									page+=1
									pullDownAction(page);
								}// Execute custom function (ajax call?)
							}
							
						} else{}
					}
				});
			},200)
			
			//障眼法...去一个小角落里解决问题去了...
			setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
		} 
		//判断下拉刷新时，切换的状态
		function pull_status(){
			var idx = $('.cs-nav li');
			for(var i = 0;i < idx.length;i++){
				if($(idx[i]).attr('class') == 'cs-hover'){
					var status = $(idx[i]).attr('data-status');
					return status;		
				}
			}		
		}
		document.addEventListener('touchmove', function (e) { }, false);
		window.addEventListener("load",loaded,false);
		//document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);
	}
	return {
		pull_down : pull_down,
		select_product : select_product,
		select_click_all : select_click_all,
		select_click : select_click
	}
})
