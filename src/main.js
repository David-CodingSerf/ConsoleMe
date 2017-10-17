;(function (window, document, undefined) {
    /**
     * ConsoleMe (MobileConsole)，
     * 可直接在页面中查看console[log/warn/error]打印的信息
     * 可直接在输入框中输入要执行的语句
     */
    var ConsoleMe = (function(){

        var ConsoleMe = function(){
                this.init();
                this.visible = false;
            };

        ConsoleMe.prototype = {
            constructor: ConsoleMe,
            LAUNCH_EVENT_COUNT: 10,
            LAUNCH_EVENT_DURATION: 2000,
            MAX_CYCLE_CACHE: 50,
            SHORTCUT: {
                'UA': 'navigator.userAgent'
            },
            methods: {
                warn: '#ff9',
                error: '#f33',
                log: '#fff',
                info: '#0af',
                debug: '#6f6'
            },
            init: function(){
                this.initDom();
                this.initEvent();
                this.core();
            },
            initDom: function(){
                var self = this;

                //控制台样式
                var style = '<style>'+
                '#_mc-debug{'+
                    'display: none;'+
                    'position: fixed;'+
                    'left: 0;'+
                    'bottom: 0;'+
                    'z-index: 9999;'+
                    'width: 100%;'+
                    'height: 40%;'+
                    'padding-top: 14px;'+
                    'padding-bottom: 34px;'+
                    'word-break: break-all;'+
                    'background: rgba(0,0,0,0.8);'+
                '}'+
                '#_mc-close,'+
                '#_mc-drag{'+
                    'position: absolute;'+
                    'top: -20px;'+
                    'left: 50%;'+
                    'z-index: 10;'+
                    'width: 32px;'+
                    'height: 32px;'+
                    'line-height: 32px;'+
                    'text-align: center;'+
                    'border: 1px solid #000;'+
                    'border-radius: 50%;'+
                    'background: no-repeat center;' +
                    'background-size: 20px 20px;' +
                '}'+
                '#_mc-close{'+
                    'margin-left: -74px;'+
                    'background-color: #FC605C;'+
                    'background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwAgMAAAAqbBEUAAAADFBMVEUAAAArKysrKyssLCzKHEOYAAAAA3RSTlMAYKBJXQyRAAAAdElEQVQoz82QsRGAMAhF0UILh3AVN9MRHM0RHCJtLsq7I79ggVAQ4HgEvg1ht7vFsLm43y+Srbo/X5K1HWZTe0h4qdBRfqQSElAIKBAgkIBAAnKkQ450yJEOCVGitjxAo/VpXkeL5hN0nM5OgkiqJGLIO4J9IchDbWTugp8AAAAASUVORK5CYII=");' +
                '}'+
                '#_mc-drag{'+
                    'margin-left: 42px;'+
                    'background-color: #34C749;' +
                    'background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAGFBMVEUAAAAsLCwsLCwsLCwrKysqKiorKyssLCxJ/2QsAAAAB3RSTlMAQMB/MJBgmO229wAAADBJREFUOMtjGAUDAtTLsYIiMiQcBbECEWo6N9kYKzAjw7lBSliBKlZ7R3iwjwJ0AAB/5GKNts9ApwAAAABJRU5ErkJggg==");' +
                '}'+
                '#_mc-console{'+
                    'height: 100%;'+
                    'width: 100%;'+
                    'overflow: auto;'+
                    'line-height: 1.4;'+
                    '-webkit-overflow-scrolling : touch;'+
                    '-webkit-user-select: text;'+
                    'user-select: text;'+
                '}'+
                '#_mc-console pre{'+
                    'padding: 2px;'+
                    'overflow-x: auto;'+
                    'font-size: 12px;'+
                    'margin: 0;'+
                '}'+
                '#_mc-console hr{'+
                    'border-bottom-width: 0;'+
                '}'+
                '#_mc-commandline{'+
                    'position: absolute;'+
                    'bottom: 0;'+
                    'left: 0;'+
                    'width: 100%;'+
                    'height: 30px;'+
                    'padding: 2px 0;'+
                '}'+
                '#_mc-command{'+
                    'display: block;'+
                    '-webkit-box-sizing: border-box;'+
                    'box-sizing: border-box;'+
                    'width: 100%;'+
                    'height: 30px;'+
                    'padding: 0 5px;'+
                    'font-size: 14px;'+
                    'background: #fff url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAALVBMVEUAAADNzc3Pz8/Pz8/Nzc3Nzc3Pz8/Nzc3MzMzNzc3Pz8/Nzc3Nzc3MzMzNzc2au198AAAADnRSTlMAgD8Q8KAw0LBgIODAb4TwyJIAAABZSURBVCjPY6AUcAkqoAowvRMYXAIL0ARYBVAFmPvQBMzfoQqw+aEJqLx7F6QEAbogAc53SAAkkIfMh6k4KAgDCmAz0BzMtg/dB+bIAgiXIgDCLwhgwEBVAADCpDmBNAS2jgAAAABJRU5ErkJggg==") no-repeat center right 5px;' +
                    'background-size: 16px 16px;' + 
                '}'+
                '#_mc-console ._mc-time{'+
                    'text-align: right;'+
                    'font-size: 12px;'+
                    'color: #999;'+
                    'margin: 2px 5px;'+
                '}'+
                '</style>';

                self.container = document.createElement('div');
                self.container.id = '_mc-debug';

                var ConsoleMeHtml = [];
                ConsoleMeHtml.push('<div id="_mc-close"></div>');
                ConsoleMeHtml.push('<div id="_mc-drag"></div>');
                ConsoleMeHtml.push('<div id="_mc-console"></div>');
                ConsoleMeHtml.push('<div id="_mc-commandline"><input id="_mc-command" placeholder="ConsoleMe" type="text"/></div>');
                ConsoleMeHtml.push(style);

                self.container.innerHTML = ConsoleMeHtml.join('');

                self.closeBtn = self.container.querySelector('#_mc-close');
                self.dragBtn = self.container.querySelector('#_mc-drag');
                self.consoleWrap = self.container.querySelector('#_mc-console');
                self.commandInput = self.container.querySelector('#_mc-command');

                //如果body无法取到，直接写在html标签里
                document[document.body ? 'body' : 'documentElement'].appendChild(self.container);

            },
            initEvent: function(){
                var self = this;
                self.launchEvent();
                self.closeEvent();
                self.dragEvent();
                self.commandEvent();
                self.errorEvent();
            },
            launchEvent: function(){
                var self = this;

                var triggerCount = 0,
                    triggerStart;

                //for Alipay
                document.addEventListener('titleClick',_launchHandler, false);
                //for common
                document.addEventListener('touchstart',function(e){
                    if ( e.touches.length == 2 ) {
                        _launchHandler();
                    }
                },false);

                function _launchHandler() {
                    if (!self.visible){

                        triggerCount ++;
                        if (triggerCount === 1){
                            triggerStart = Date.now();
                        }
                        if (triggerCount === self.LAUNCH_EVENT_COUNT){
                            if (Date.now() - triggerStart < self.LAUNCH_EVENT_DURATION) {
                                self.open();
                                self.gotoConsoleBottom();
                            }
                            triggerCount = 0;
                        }
                    }
                }
            },
            closeEvent: function(){
                var self = this;

                self.closeBtn.addEventListener('click',function(e){
                    self.close();
                });
            },
            open: function() {
                var self = this;
                self.container.style.display = 'block';
                self.visible = true;
            },
            close: function() {
                var self = this;
                self.container.style.display = 'none';
                self.visible = false;
            },
            dragEvent: function(){
                var self = this;

                self.dragOffset = 50;

                self.dragable = false;

                self.dragBtn.addEventListener('touchstart',function(e){
                    e.preventDefault();
                    self.dragable = true;
                });
                self.dragBtn.addEventListener('touchend',function(e){
                    self.dragable = false;
                });
                self.dragBtn.addEventListener('touchcancel',function(e){
                    self.dragable = false;
                });

                document.addEventListener('touchmove',function(e){
                    if(self.dragable){
                        var winH = window.innerHeight;
                        var consoleH = winH - e.targetTouches[0].clientY - self.dragOffset;
                        if(consoleH >= winH - self.dragOffset - 30){
                            consoleH = winH - self.dragOffset - 30;
                        }
                        self.container.style.height = consoleH + 'px';
                    }
                }, false);
            },
            commandEvent: function(){
                var self = this;
                self.commandInput.addEventListener('keydown', function(e){
                    if(e.keyCode === 13){
                        var command = self.commandInput.value;
                        command = self.SHORTCUT[command] || command;
                        var result;
                        if(!command) return;
                        try{
                            result = (new Function('return '+command))();
                            if(typeof result === 'function' && result.name){
                                window[result.name] = result;
                            }
                            console.log(result);
                        } catch(exc){
                            if(/Unexpected.*var/ig.test(exc.message)){
                                exc.message += '. You can wrap it in (function(){...})()';
                            }
                            console.error(exc.message);
                        }
                        self.commandInput.value = '';
                    }
                });
                self.commandInput.addEventListener('touchstart',function(e){
                    e.stopPropagation();
                });
                /*self.commandInput.addEventListener('focus',function(e){
                    self.container.style.position = 'relative';
                    document.body.scrollTop = 9999;
                    document.addEventListener('touchstart',_blurHandler);
                });

                self.commandInput.addEventListener('blur',function(){
                    self.container.style.position = 'fixed';
                    document.removeEventListener('touchstart',_blurHandler);
                });

                function _blurHandler(){
                    self.commandInput.blur();
                }*/
            },
            errorEvent: function(){
                window.onerror = function(errMsg, errFile, errLine){
                    console.error(errMsg, 'File: ' + errFile, 'Line: ' + errLine);
                };
            },
            core: function(){
                var self = this;

                for (var key in self.methods) {

                    if (self.methods.hasOwnProperty(key)) {

                        console[key] = (function(oldConsole){

                            var color = self.methods[key];

                            return function(){
                                oldConsole.apply(console,arguments);

                                var args = [].slice.call(arguments);

                                var logWrap = document.createElement('div'),
                                    logHtml = [],
                                    arg = null,
                                    logContent = '';

                                for (var i = 0; i <= args.length - 1; i++) {
                                    arg = args[i];

                                    logHtml.push('<pre style="color:'+color+'">');

                                    if(arg instanceof Node && arg !== document){
                                        logContent = arg.outerHTML;
                                    } else if(arg instanceof NodeList){
                                        for(var j=0;j<arg.length;j++){
                                            logContent += arg[j].outerHTML
                                        }
                                    } else if(typeof arg === 'function'){
                                        logContent = arg.toString();
                                    } else if(arg === undefined){
                                        logContent = 'undefined';
                                    } else {
                                        try{
                                            logContent = JSON.stringify( arg, null, 2 );
                                        } catch(e){

                                            logContent = self.stringifyCycleJSON( arg );
                                        }
                                    }
                                    logHtml.push( self.htmlEncode( logContent ));
                                    logHtml.push('</pre>');
                                }
                                logHtml.push('<div class="_mc-time">'+self.getTime()+'</div>');
                                logHtml.push('<hr/>');

                                logWrap.innerHTML = logHtml.join('');

                                self.consoleWrap.appendChild(logWrap);
                                self.gotoConsoleBottom();
                            };

                        })(console[key]);
                    }
                }
            },
            getTime: function(){
                var date = new Date();
                var timeStr;

                timeStr = [date.getFullYear(),date.getMonth()+1,date.getDate()].join('-');
                timeStr += ' '+ [date.getHours(),date.getMinutes(),date.getSeconds(),date.getMilliseconds()].join(':');

                return timeStr;
            },
            gotoConsoleBottom: function(){
                var self = this;
                self.consoleWrap.scrollTop = 9999999;
            },
            stringifyCycleJSON: function(obj){
                var cache = [];
                var str = JSON.stringify(obj, function(key, value) {
                    if(cache.length == self.MAX_CYCLE_CACHE) return;
                    try{
                        if (value === window){
                            return '*** sorry, window is too big ***'
                        }
                        if (typeof value === 'object' && value !== null) {
                            if (cache.indexOf(value) !== -1) {
                                return '*** DECYCLE ***';
                            }
                            cache.push(value);
                        }
                        if(value instanceof Node && value !== document){
                            return value.outerHTML;
                        } else if(value instanceof NodeList){
                            var content = '';
                            for(var j=0;j<value.length;j++){
                                content += value[j].outerHTML
                            }
                            return content;
                        }
                        if (typeof value === 'function'){
                            return value.toString();
                        }
                    }catch(e){}
                    return value;
                }, 2);
                cache = null;
                return str;
            },
            htmlEncode: function(myStr){
                var myStr = myStr || '';

                myStr = myStr.replace(/&/g, "&amp;");
                myStr = myStr.replace(/'/g, "&#39;");
                myStr = myStr.replace(/"/g, "&quot;");
                myStr = myStr.replace(/</g, "&lt;");
                myStr = myStr.replace(/>/g, "&gt;");

                return myStr;
            }
        }

        return ConsoleMe;
    })();

    window.ConsoleMe = function(){
        window.ConsoleMe = new ConsoleMe();
    };

    //如果是script标签引入，并且标签上有开关，就直接开启ConsoleMe，忽略所有启动条件
    if(document.querySelectorAll('script[consoleme-run]').length){
        window.ConsoleMe();
        return;
    }

})(window, document, undefined)