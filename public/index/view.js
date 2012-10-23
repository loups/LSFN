var setting = require('../../setting.js')
var viewHelper = require('../../module/viewHelper.js');

module.exports.viewIndex = function(url,req,res){
	viewHelper.url = url;
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end(viewHelper.getData(req.method,req.body));
};
