let fs = require('fs');
module.exports = function (file, type) {
	return new Promise((resolve, reject) => {
		fs[type](file, 'utf8', function(err, data){
			resolve({
				error: err,
				data: data
			});
		});
	});
};