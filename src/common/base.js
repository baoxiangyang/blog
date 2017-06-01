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
        scrollTop -= 100;
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
export function Promise(){
	if(Promise === undefined){
		(function(window, undefined){
		// resolve 和 reject 最终都会调用该函数
		var final = function(status, value){
		    var fn, st, promise = this;
		    if(promise._status !== 'PENDING') return;
		    // 所以的执行都是异步调用，保证then是先执行的
		    setTimeout(function(){
		        promise._status = status;
		        st = promise._status === 'FULFILLED';
		        let queue = promise[st ? '_resolves' : '_rejects'];
		        while(fn = queue.shift()) {
		            value = fn.call(promise, value) || value;
		        }
		        promise[st ? '_value' : '_reason'] = value;
		        promise['_resolves'] = promise['_rejects'] = undefined;
		    });
		};
		//参数是一个函数，内部提供两个函数作为该函数的参数,分别是resolve 和 reject
		var Promise = function(resolver){
		    if (!(typeof resolver === 'function' ))
		        throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
		    //如果不是promise实例，就new一个
		    if(!(this instanceof Promise)) return new Promise(resolver);
		    var promise = this;
		    promise._value;
		    promise._reason;
		    promise._status = 'PENDING';
		    //存储状态
		    promise._resolves = [];
		    promise._rejects = [];
		    var resolve = function(value) {
		        //由於apply參數是數組
		        final.apply(promise,['FULFILLED'].concat([value]));
		    }
		    var reject = function(reason){
		        final.apply(promise,['REJECTED'].concat([reason]));
		    }
		    resolver(resolve,reject);
		}
		Promise.prototype.then = function(onFulfilled,onRejected){
		    var promise = this;
		    // 每次返回一个promise，保证是可thenable的
		    return new Promise(function(resolve,reject){
		        
		        function handle(value) {
		            // 這一步很關鍵，只有這樣才可以將值傳遞給下一個resolve
		            var ret = typeof onFulfilled === 'function' && onFulfilled(value) || value;

		            //判断是不是promise 对象
		            if (ret && typeof ret ['then'] == 'function') {
		                ret.then(function(value) {
		                    resolve(value);
		                }, function(reason) {
		                    reject(reason);
		                });
		            } else {
		                resolve(ret);
		            }
		        }
		        function errback(reason){
		            reason = typeof onRejected === 'function' && onRejected(reason) || reason;
		            reject(reason);
		        }
		        if(promise._status === 'PENDING'){
		            promise._resolves.push(handle);
		            promise._rejects.push(errback);
		        }else if(promise._status === FULFILLED){ // 状态改变后的then操作，立刻执行
		            callback(promise._value);
		        }else if(promise._status === REJECTED){
		            errback(promise._reason);
		        }
		    });
		}
		Promise.prototype.catch = function(onRejected){
		    return this.then(undefined, onRejected)
		}
		Promise.prototype.delay = function(ms,value){
		    return this.then(function(ori){
		        return Promise.delay(ms,value || ori);
		    })
		}
		Promise.delay = function(ms,value){
		    return new Promise(function(resolve,reject){
		        setTimeout(function(){
		            resolve(value);
		            console.log('1');
		        },ms);
		    })
		}
		Promise.resolve = function(arg){
		    return new Promise(function(resolve,reject){
		        resolve(arg)
		    })
		}

		Promise.reject = function(arg){
		    return Promise(function(resolve,reject){
		        reject(arg)
		    })
		}
		Promise.all = function(promises){
		    if (!Array.isArray(promises)) {
		        throw new TypeError('You must pass an array to all.');
		    }
		    return Promise(function(resolve,reject){
		        var i = 0,
		            result = [],
		            len = promises.length,
		            count = len
		            
		        //这里与race中的函数相比，多了一层嵌套，要传入index
		        function resolver(index) {
		          return function(value) {
		            resolveAll(index, value);
		          };
		        }

		        function rejecter(reason){
		            reject(reason);
		        }

		        function resolveAll(index,value){
		            result[index] = value;
		            if( --count == 0){
		                resolve(result)
		            }
		        }

		        for (; i < len; i++) {
		            promises[i].then(resolver(i),rejecter);
		        }
		    });
		}
		Promise.race = function(promises){
		    if (!Array.isArray(promises)) {
		        throw new TypeError('You must pass an array to race.');
		    }
		    return Promise(function(resolve,reject){
		        var i = 0,
		            len = promises.length;

		        function resolver(value) {
		            resolve(value);
		        }

		        function rejecter(reason){
		            reject(reason);
		        }

		        for (; i < len; i++) {
		            promises[i].then(resolver,rejecter);
		        }
		    });
		}
		window.Promise = Promise;
		})(window);
	}
}
