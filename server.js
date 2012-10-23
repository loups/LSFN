var	connect = require('connect'), 
    fs = require('fs'),
    url = require('url'),
    http = require('http')

var app = connect()
	.use(connect.logger('dev'))
	.use(connect.bodyParser())
	.use(function(req, res){
		var url_parts = url.parse(req.url,true);
   		var data = checkViewUrl(url_parts.pathname,function(rs){
   	 		if(rs.result){
    			require(rs.path + "/view.js").viewIndex(url_parts,req,res);
    		}else{
    			display_404(url_parts.pathname, req, res);
    		}
    		
    	});
		function display_404(url, req, res) {
    		res.writeHead(404, {'Content-Type': 'text/html'});
			res.write("<h1>404 Not Found</h1>");
			res.end("<p>The page you were looking for: "+url+" can not be found");
		}
  })
  
function checkViewUrl(url,cb){
    var rs = {result : false, path : null};
    fs.readFile(__dirname + '/view.json',function(err,data){
    	var json  = JSON.parse(data);
 		for(i = 0; i < json.view.length; i++){
            var urls = json.view[i].page.urls;
        	for(j = 0; j < urls.length; j++){
        		if(urls[j] == url){
        			rs.result = true;
        			rs.path = json.view[i].page.path;
        		    break;
                }
       	 	}
    	}
    	cb(rs);   	
    });
}

http.createServer(app).listen(1234,function(){
 	console.log('Server running at http://127.0.0.1:1234/'); 
});
