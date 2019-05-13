const  request = require('request');
module.exports = function(data){
	return new Promise((resolve, reject) => {
		request(data, function(err, _req, body){
			if(err){
				reject(err);
				return false;
			}
			resolve(body);
		});
	});
};