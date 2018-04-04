define(function (require, exports, module) {
	var $ = require("jquery");
    var ls = window.localStorage;
    //主页点击跳转
	function click_detail(){
		$(".cont-box .cs-listbox").click(function(){
			if($(this).find('a').attr('href') == 'javascript:;'){
				
				$(".fix_box").show();
				$('body,html').css({"overflow":"hidden"})
			}else{
				
			}
		})
		$(".close_btn").click(function(){
			$(".fix_box").hide();
			$('body,html').css({'overflow':'visible'})
		})
	}
    //get缓存
    function get(key, expire){
        var expire = expire || 1000 * 60;
        //console.log(key);
        var data = ls[key];
        //console.log(data);
        if (!data) return null;
        var lsTime = ls[key+'-time'];
        var nowTime = new Date().getTime();
//      if (nowTime - lsTime > expire){
//          remove(key);
//          return null;
//      }
        return data;
    }

    //写入缓存
    function set(key, val){
        ls[key] = val;
        ls[key+'-time'] = new Date().getTime();
    }

    //删除缓存
    function remove(key){
        ls.removeItem(key);
        ls.removeItem(key+'-time');
    }

    //清空缓存
    function clear(){
        ls.clear()
    }

    return {
    	click_detail: click_detail,
        get: get,
        set:set,
	    remove:remove
//      clear:clear
    }
})

