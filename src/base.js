// 公共基础 函数
/**
 * [时间格式函数]
 * @param  {stying} v  需要格式化的时间字符串
 * @param  {boolean} nowDate 是否根据当前时间进行格式化
 * @param  {boolean} time 是否需要返回 时分秒
 * @return {string}   返回格式化之后的字符串
 */
export function formatTime(v, nowDate, time){
	let date = new Date(v || null);
	if(nowDate){
		let timeStamp = Date.now() - date,
			minuteStamp = 60000,
			hourStamp = 3600000,
			dayStemp = 86400000;
		switch (true){
			case timeStamp < minuteStamp:
				return '刚刚';
			case timeStamp < hourStamp:
				return parseInt(timeStamp / minuteStamp) + '分钟前';
			case timeStamp < dayStemp:
				return parseInt(timeStamp / hourStamp) + '小时前';
			case timeStamp < dayStemp * 5:
				return parseInt(timeStamp / dayStemp) + '天前';
			default:	
		}
	}
	let	year = date.getFullYear(),
		month = date.getMonth() + 1,
		day = date.getDate(),
		hour = date.getHours(),
		minute = date.getMinutes(),
		second = date.getSeconds(),
		str = '',
		_func = function(num){
			return num >= 10 ? num : '0' + num;
		};
		str = year + '-' + _func(month) + '-' + _func(day);
		if(time){
			str += ' ' + _func(hour) + ':' + _func(minute) + ':' + _func(second);
		}
		return str;
}
// 回到顶部
export function backToTop(){
	let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	if(scrollTop > 0){
		let requestAnimFrame = window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame  ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
        scrollTop -= 20;
        scrollTop = scrollTop <= 0 ? 0 : scrollTop;
		document.documentElement.scrollTop = scrollTop;
		document.body.scrollTop = scrollTop;
		requestAnimFrame(backToTop);
	}
}
//节流函数
export const throttle = (fn, text = undefined, delay = 200, mustApplyTime = 500) => {
	window.clearTimeout(fn.timer);
    fn._cur=Date.now(); 
    if(!fn._start){      
        fn._start=fn._cur;
    }
    if(fn._cur-fn._start>mustApplyTime){ 
        fn(text);
        fn._start=fn._cur;
    }else{
        fn.timer=setTimeout(() => {
           fn(text);
        }, delay);
    }
};
export function assign(){
	if (typeof Object.assign != 'function') {
		(function () {
		Object.assign = function (target) {
			'use strict';
			if (target === undefined || target === null) {
				throw new TypeError('Cannot convert undefined or null to object');
			}
			var output = Object(target);
			for (var index = 1; index < arguments.length; index++) {
				var source = arguments[index];
				if (source !== undefined && source !== null) {
					for (var nextKey in source) {
						if (source.hasOwnProperty(nextKey)) {
							output[nextKey] = source[nextKey];
						}
					}
				}
			}
			return output;
			};
		})();
	}
}
