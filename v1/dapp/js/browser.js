/**
 * AppLink:H5唤起APP的所有方法
 */
var AppLink = (function () {
    var dappUrl = "cmtwallet://dapp?url=" + window.location.href;
    var agent = navigator.userAgent;
    var config = {
        wallet: 'http://www.cybermiles.io/cmt-wallet/',
        appStore: 'http://www.cybermiles.io/cmt-wallet/',
        localApp: dappUrl
    };

    var AppLink = function () {
    };

    AppLink.openBrowser = function () {
        _open();
    };


    /**
     * 跳转函数
     * @param url 链接
     */
    var _go = function (url) {
        window.location.href = url;
    }
    /**
     * 检查是否唤起
     * @param cb 回调函数
     */
    var _checkOpen = function () {
        // 如果LOAD_WAITING时间后,还是无法唤醒app，则直接打开下载页
        var start = Date.now();
        var loadTimer = setTimeout(function () {
            if (document.hidden || document.webkitHidden) {
                return;
            }
            // 如果app启动，浏览器最小化进入后台，则计时器存在推迟或者变慢的问题
            // 那么代码执行到此处时，时间间隔必然大于设置的定时时间
            if (Date.now() - start > 3000) {
                // come back from app
                console.log("app 已经open！");
                // 如果浏览器未因为app启动进入后台，则定时器会准时执行，故应该跳转到下载页
            } else {
                window.location.href = config.wallet;
            }

        }, 3000);
        var visibilityChange = function () {
            var tag = document.hidden || document.webkitHidden;
            tag && clearTimeout(loadTimer);
        };
        document.addEventListener('visibilitychange', visibilityChange, false);
        document.addEventListener('webkitvisibilitychange', visibilityChange, false);
        // pagehide 必须绑定到window
        window.addEventListener('pagehide', function () {
            clearTimeout(loadTimer);
        }, false);
    }




    /**
     * 外部调用的入口函数
     */
    var _open = function () {
        var browser = _getBrowser();
        // var dappUrl = "cmtwallet://dapp?url=" + window.location.href;
        var shareLinkMsg = "Please Copy the Share Link and open in the Browser ！";
        // agent is mobile
        try {
            // alert("get web3.cmt");
            web3.cmt
        } catch (e) {
            if (agent.indexOf('iPad') != -1 || agent.indexOf('iPhone') != -1 || agent.indexOf('Android') != -1) {
                // 微信、QQ 直接跳 钱包下载页面
                if (browser.isWx) {
                    // tip.error(shareLinkMsg, 120 * 1000);
                    if(window.lgb == "zh"){
                        var ajax = new XMLHttpRequest();
                        ajax.open("GET", "android_wechat_zh.html", false);
                        ajax.send();
                        document.getElementsByTagName('body')[0].innerHTML = ajax.responseText;

                    }else{
                        var ajax = new XMLHttpRequest();
                        ajax.open("GET", "android_wechat_en.html", false);
                        ajax.send();
                        document.getElementsByTagName('body')[0].innerHTML = ajax.responseText;
                    }
                    
                    
                    
//                    document.getElementsByTagName('body')[0].innerHTML = '<div class="main-contain"><h1>1. 点击右上角</h1><br/><br/><h1>2. 选择在浏览器里打开</h1></div>'; 
                } else if (browser.isQQ) {
                    // tip.error(shareLinkMsg, 120 * 1000);
                    var ajax = new XMLHttpRequest();
                    ajax.open("GET", "android_wechat.html", false);
                    ajax.send();
                    document.getElementsByTagName('body')[0].innerHTML = ajax.responseText;
                    //document.getElementsByTagName('body')[0].innerHTML = '<div class="main-contain"><h1>1. 点击右上角</h1><br/><br/><h1>2. 选择在浏览器里打开</h1></div>'; 
                } else if (browser.isIOS) {
                    // 没有下载
                    _go(config.localApp);
                    _checkOpen();
                } else if (browser.isAndroid) {
                    console.log('isAndroid');
                    // 使用scheme唤起
                    _tryCallApp(config.localApp)
                    // 唤起失败 跳到钱包下载页面
                    _checkOpen(function (isSuccess) {
                        if (!isSuccess) {
                            _go(config.wallet)
                        }
                    })
                } else if (browser.isWb) {
                    console.log("isWb");
                    // 使用scheme唤起
                    _tryCallApp(config.localApp)
                    // tip.right("It is web");
                    // 微博：唤起失败，也不跳转，会有引导功能
                } else if (browser.isSafari) {
                    console.log("isSafari");
                    var version = _getIOSVersion()
                    // iOS10以下不支持直接跳转到AppStore，跳到钱包下载页面
                    if (version < 10) {
                        _go(config.wallet)
                    } else {
                        _go(config.appStore)
                    }
                } else {
                    console.log("else");
                    // 其他情况，直接跳钱包下载页面
                    _go(config.wallet)
                }
            } else {
                // tip.error("You should download MetaMask for CMT first！");
                setTimeout(function () {
                    window.location.href = 'https://www.cybermiles.io/metamask/';
                }, 3000);
            }
        }
    }

    /**
     * 下载按钮的url地址
     */
    var _getDownloadUrl = function () {
        var browser = _getBrowser()
        var config = config
        var url = ''
        if (browser.isQQ) {
            if (browser.isIOS) {
                url = config.appStore
            } else {
                url = config.wallet
            }
        } else if (browser.isSafari) {
            var version = _getIOSVersion()
            if (version < 10) {
                url = config.wallet
            } else {
                url = config.appStore
            }
        } else if (browser.isWb) {
            url = ''
        } else {
            url = config.wallet
        }
        return url
    }
    /**
     * 尝试唤起APP
     * @param scheme 唤起的scheme
     */
    var _tryCallApp = function (scheme) {
        var aLink = document.createElement('a'),
            body = document.body
        aLink.href = scheme
        body.appendChild(aLink)
        aLink.click()
    }
    /**
     * 判断iOS版本
     */
    var _getIOSVersion = function () {
        var ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
        var version = parseInt(ver[1], 10)
        return version
    }

    /**
     * 获取浏览器数据
     */
    var _getBrowser = function () {
        var UA = navigator.userAgent || ''
        var isAndroid = (function () {
            return UA.match(/Android/i) ? true : false
        })()
        var isQQ = (function () {
            return /(iPad|iPhone|iPod).*? (IPad)?QQ\/([\d\.]+)/.test(UA) || /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/.test(UA)
        })()
        var isIOS = (function () {
            return UA.match(/iPhone|iPad|iPod/i) ? true : false
        })()
        var isSafari = (function () {
            return /iPhone|iPad|iPod\/([\w.]+).*(safari).*/i.test(UA)
        })()
        var isWx = (function () {
            return UA.match(/micromessenger/i) ? true : false
        })()
        var isWb = (function () {
            return UA.match(/weibo/i) ? true : false
        })()
        var isAndroidChrome = (function () {
            return (UA.match(/Chrome\/([\d.]+)/) || UA.match(/CriOS\/([\d.]+)/)) && isAndroid && !isQQ
        })()
        var isQZ = (function () {
            return UA.indexOf('Qzone/') !== -1
        })()
        var browser = {
            isAndroid: isAndroid,
            isIOS: isIOS,
            isSafari: isSafari,
            isQQ: isQQ,
            isWb: isWb,
            isWx: isWx,
            isQZ: isQZ,
            isAndroidChrome: isAndroidChrome
        }
        return browser
    }

    return AppLink
});
