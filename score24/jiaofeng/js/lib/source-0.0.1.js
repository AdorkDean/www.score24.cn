define(function (require, exports, module) {
    var $ = require("jquery");
    var lib = require("tool");
    var cache = require("cache");

    //初始化
    function init(){
        var  _source = lib.href().source;
        if (_source) {
            cache.set("source",_source);
            return _source;
        }
        return cache.get("source",1000*1800) || null;
    }
    return init();
})