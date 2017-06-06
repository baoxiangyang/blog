let fs = require('fs');
function fsPromise(type) {
    let arg = Array.prototype.slice.call(arguments, 1);
	return new Promise((resolve, reject) => {
        arg.push(function(err, data){
            if(err){
                reject({err: err});
            }else{
                resolve({data: data });
            }
        });
        fs[type].apply(fs, arg);
	});
}
/*
	产生随机字符串
	number 是否含有数字
	lowerLetter 是否含有小写字母
	capitalLetter 是否含有大写字母
	specialSymbol 是否含有特殊符号
*/
function getRandomStr({number = true, lowerLetter = false, capitalLetter = false, specialSymbol = false, len = 6} = {}){
    const numberStr = '0123456789',
        capitalLetterStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowerLetterStr = capitalLetterStr.toLowerCase(),
        specialSymbolStr = '~!@#$%^&*(){}[]?\.\/\-';
    let checkStr = '', str = '', i = 0;
        if(number){
            checkStr += numberStr;
            str +=  numberStr[Math.floor(Math.random() * numberStr.length)];
        }
        if(lowerLetter){
            checkStr += lowerLetterStr;
            str +=  lowerLetterStr[Math.floor(Math.random() * lowerLetterStr.length)];
        }
        if(capitalLetter){
            checkStr += capitalLetterStr;
            str +=  capitalLetterStr[Math.floor(Math.random() * capitalLetterStr.length)];
        }
        if(specialSymbol){
            checkStr += specialSymbolStr;
            str +=  specialSymbolStr[Math.floor(Math.random() * specialSymbolStr.length)];
        }
        let whileLen = (len - number - lowerLetter - capitalLetter - specialSymbol),
            checkStrLen = checkStr.length;
            if(whileLen == len || whileLen < 0){
                throw Error('请设置正确的格式');
            }
        while (i < whileLen) {
            str +=  checkStr[Math.floor(Math.random() * checkStrLen)];
            i++;
        }
    return str;

}
module.exports = {
	fsPromise,
	getRandomStr
};