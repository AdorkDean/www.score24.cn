define(function (require, exports, module) {

    //判断是否为android平台
    function isAndroid(){
        return /android/i.test(navigator.userAgent);
    }
    //判断是否为ipad平台
    function isIpad(){
        return /ipad/i.test(navigator.userAgent);
    }
    //判断是否为iphone平台
    function isIphone(){
        return /iphone/i.test(navigator.userAgent);
    }
    //判断是否为macintosh平台
    function isMac(){
        return /macintosh/i.test(navigator.userAgent);
    }
    //判断是否为windows平台
    function isWindows(){
        return /windows/i.test(navigator.userAgent);
    }
    //判断是否为x11平台
    function isX11(){
        return /x11/i.test(navigator.userAgent);
    }
    //判断是否为微信平台
    function isWeixin(){
        return /MicroMessenger/i.test(navigator.userAgent);
    }

    //判断是否在app
    function isApp(){
        return window.cordova ? true : false;
    }


    //返回操作系统类型
    function osType(){
        if (isWindows()) return "windows";
        if (isAndroid()) return "androin";
        if (isIphone()) return "iphone";
        if (isIpad()) return "ipad";
        if (isMac()) return "mac";
        if (isX11()) return "x11";
        return false;
    }
    return {
        isAndroid:isAndroid,
        isWindows:isWindows,
        isIphone:isIphone,
        isIpad:isIpad,
        isApp:isApp,
        isMac:isMac,
        isX11:isX11,
        isWeixin:isWeixin,
        osType:osType
    }
})




