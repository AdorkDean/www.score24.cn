define("tool", function (require, exports, module) {
    var $ = require("jquery");
	
    function log(obj) {
      // window.console && console.log && console.log(obj);
    }

    //弹出对象的各个属性
    function z(val, n) {
        if (typeof val !== "object") return alert(val);
        var arr = [];
        for (var key in val) arr.push(key + " = " + val[key]);
        return alert(arr.join(n || "\n\r"));
    }

    function listToObject(list) {

        var o = {}
        for (var i = 0; i < list.length; i++) {
            if (list[i] && list[i].lotteryId) o[list[i].lotteryId] = list[i];
        }
        return o;
    }

    //得到日期及星期，val是否取得星期
    function getWeek(val) {
        var data = val ? new Date(val) : new Date();
        return "日一二三四五六".charAt(data.getDay());
    }

    //url/对象互转
    function href() {
        var url = location.search;
        console.log(url);
        json = {};
        if (url.indexOf("?") === -1) return {};
        var arr = url.substr(1).split("&");
        for (var i = 0, len = arr.length; i < len; i++) {
            json[arr[i].split("=")[0]] = unescape(arr[i].split("=")[1]);
        }
        console.log(json);
       
        return json;
    }

    //获得大小单双
    function getDxds(val) {
        var val = parseInt(val, 10);
        var h = val < 5 ? "小" : "大";
        return h += val % 2 === 1 ? "单" : "双";
    }


    //格式化号码
    function formatBall(a,b){
        if (a.indexOf(" ") > -1){
            a = a.split(" ").join(",")
            if (b) b = b.split(" ").join(",")
        }else if(a.indexOf(",") >-1){
            a = a
        }else {
            a = a.split("").join(",");
            if (b) b = b.split("").join(",")
        }
        return b ? a+"#"+b : a;
    }


    //生成号码
    function makeBall(ball) {
        if (!ball) return "";
        var h = '';
        if (ball.indexOf("#") > -1) {
            var a = ball.split("#");
            var a0 = (a[0].indexOf(",") > -1) ? a[0].split(",") : a[0].split("");
            var a1 = a[1].split(",");
            h += groupBall(a0, "red_balls");
            h += groupBall(a1, "blue_balls");
        } else {
            var a = (ball.indexOf(",") > -1) ? ball.split(",") : ball.split("");
            h += groupBall(a, "red_balls");
        }
        return h;
    }


    //足彩开奖号码
    function makeZc(num) {
        var h = '<ul class="score-zc">';
        var a = num.split(",");
        $.each(a, function (i, n) {
            h += '<li>' + n + '</li>'
        })
        h += '</ul>';
        return h
    }

    //足彩开奖号码
    function makecJcHtml() {
     var h = '';
        h+='<li>';
        h += '<a href="jc.html" class="result-list-item icon-right">';
        h += '<div class="result-item-title">';
        h += '<span class="result-item-name">竞彩足球</span>';
        h += '<span class="result-item-time item-time-kj">昨日</span>';
        h += '<div class="result-item-detail"> </div>';
        h += '<ul class="score-zc">点击查看详情</ul>';
        h += '</div>';
        h += '</a>';
        h += '</li>';
        return h
    }

    function groupBall(a, css) {
        var h = "";
        $.each(a, function (i, n) {
            h += '<span class="' + css + '">' + n + '</span>';
        })
        return h;
    }

    function comma (val, length) {
        var length = length || 3;
        val = String(val).split(".");
        val[0] = val[0].replace(new RegExp('(\\d)(?=(\\d{'+length+'})+$)','ig'),"$1,");
        return val.join(".");
    }


    /**
     * 路由
     * */
    function router(routes) {
        var win = window,
            ac = [],
            def = {
                type: "!"
            };
        if (!routes || typeof routes !== "object") return;
        else parseRouter(routes);

        function parseRouter(routes) {
            for (var i in routes) {
                if (typeof i == 'string' && typeof routes[i] == "function") ac.push({
                    path: i,
                    fn: routes[i]
                })
            }
        }

        function parseHash(url) {
            var ucache = url.replace(/^[^#]*/, ''),
                u;
            if (ucache[1] != def.type) {
                return '';
            }
            u = ucache.slice(2);
            return u;
        }
        $(win).bind('hashchange', function(ev) {
            var originEvent = ev.originalEvent,
                newUrl = originEvent.newURL,
                oldUrl = originEvent.oldURL;
            checkHash(newUrl)
        });

        function checkHash(url) {
            var hash = parseHash(url) || "index";
            $(ac).each(function(i, router) {
                if (router.path == hash) {
                    router.fn()
                }
            })
        }
        checkHash(win.location.hash);
    }
    function toYi(val){
        var val = parseInt(val, 10);
        if (val<10000){
            return val+"元";
        }else if (val<10000000){
            return parseFloat((val/10000).toFixed(1))+"万";
        }else{
            return parseFloat((val/100000000).toFixed(1))+"亿";

        }
    }

    //数字前补零
    function pad  (val,len){
        var len = len || 2;
        return Array(len).join("0").concat(val).slice(-len);
    }

    //get缓存
    function getCache(key, expire){
        var expire = expire || 1000 * 60;
        var ls = window.localStorage;
        var data = ls[key];
        if (!data) return null;
        var lsTime = ls[key+'-time'];
        var nowTime = new Date().getTime();
        if (nowTime - lsTime > expire){
            removeCache(key);
            return null;
        }
        return data;
    }

    //写入缓存
    function setCache(key, val){
        var ls = window.localStorage;
        ls[key] = val;
        ls[key+'-time'] = new Date().getTime();
    }

    //删除缓存
    function removeCache(key){
        var ls = window.localStorage;
        ls.removeItem(key);
        ls.removeItem(key+'-time');
    }

    //清空缓存
    function clearCache(){
        window.localStorage.clear()
    }

    //获取数组中的随机数,产生随机数 最小/最大
    function random ( min, max ){
        if (max == null) {
            max = min;
            min = 0;
        }
        max = max || min || 999;
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    return {
        log: log,
        z: alert,
        random:random,
        pad : pad,
        makecJcHtml:makecJcHtml,
        getWeek: getWeek,
        getCache:getCache,
        setCache:setCache,
        removeCache:removeCache,
        clearCache:clearCache,
        formatBall:formatBall,
        listToObject: listToObject,
        href: href,
        router:router,
        getDxds: getDxds,
        toYi:toYi,
        makeZc: makeZc,
        comma:comma,
        makeBall: makeBall
    }
})

