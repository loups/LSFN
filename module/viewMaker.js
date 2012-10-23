var fs = require('fs');
var readline = require('readline');
var colors = require('colors');
var stdio = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var self = this;

colors.setTheme({
  normal: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

makeViewData = function(){
	var data = "var setting = require('" + self.dirname + "/setting.js')\n";
	data += "var viewHelper = require('/home/loup/nodejs/LSAN/module/viewHelper.js');\n\n"
	data += "module.exports.viewIndex = function(url,req,res){\n";
	data += "\tres.writeHead(200, {'Content-Type': 'text/html'});\n";
	data += "\tres.end(viewHelper.getData(req.method,req.body));\n";
	data += "};";
	return data;
}

makeModelData = function(){
	var data = "var setting = require('" + self.dirname + "/setting.js')\n";
	data += "var Sequelize = require('sequelize');\n"	 
	data += "var db = setting.db;\n"
	data += "var sequelize = new Sequelize(db.db, db.user, db.pass, {\n\thost: db.host, port: db.port\n});";
	return data;
}

makeViewJSON = function(path,name){
	var urls = [path];
	if(path.charAt(path.length-1) != "/"){
		urls.push(path + "/");
	}else{
		urls.push(path.substr(0,path.length-1));
	}
	
    var rootPath = self.dirname;
    var data = 
        {
            page : {
                name : name,
                path : rootPath + '/public' + path,
                urls : urls
            }   
        };
    return data;
};

mkdir = function (path,root){
    var dirs = path.split('/'), dir = dirs.shift(), root = (root||'')+dir+'/';
    try { 
    	fs.mkdirSync(root); 
    }catch (e) {
       	//dir wasn't made, something went wrong
        if(!fs.statSync(root).isDirectory()) 
        	throw new Error(e);
    }
	
	return !dirs.length||mkdir(dirs.join('/'), root);
        
};

rmdir = function(path) {
	var files, file, fileStats, i, filesLength;
	if (path[path.length - 1] !== '/') {
		path = path + '/';
	}

	files = fs.readdirSync(path);
	filesLength = files.length;

	if (filesLength) {
		for (i = 0; i < filesLength; i += 1) {
			file = files[i];

			fileStats = fs.statSync(path + file);
			if (fileStats.isFile()) {
				fs.unlinkSync(path + file);
			}
			if (fileStats.isDirectory()) {
				rmdir(path + file);
			}
		}
	}
	fs.rmdirSync(path);
};

module.exports.setDirname = function(name){
	self.dirname = name;
	return module.exports;
}

module.exports.isFindView = function(json,name){
	var result = "isNotExist";
	for(i = 0; i < json.view.length; i++){
		if(json.view[i].page.name == name){
			result = i;
			break;
		}
	}
	return result;
};


module.exports.isCheckView = function(json,path,name){
	var result = "isNotExist";
	for(i = 0; i < json.view.length; i++){
		if(json.view[i].page.name == name){
			result = "isViewNameExist"; 
		}
	}
	if(result == false && fs.existsSync(self.dirname + '/public' + path)){
		result = "isPathExist";
	}
	return result;
};


module.exports.readViewInfo = function(cb){
	fs.readFile(self.dirname + '/view.json',function(err,data){
		cb(data);
	});
};

module.exports.makeViewProc = function(path,viewdata){
	mkdir(path,self.dirname + '/public/');
	fs.writeFile(self.dirname + '/view.json',JSON.stringify(viewdata, null, 4),function(err,writeData){
        if(err){
        	console.log(err.message);
        	return ;
        }
		fs.writeFile(self.dirname + '/public' + path + '/view.js',makeViewData(),function(){});
    	fs.writeFile(self.dirname + '/public' + path + '/model.js',makeModelData(),function(){});
	});
}; 

module.exports.makeView = function(){
    console.log("LOUP Message : Not Input ' or \" ".normal);    
    console.log("LOUP Message : View Path Ex(/main/context or /user)".normal);    
    stdio.question("View Path : ",function(path){
        stdio.question("View Name : ",function(name){
        	self.readViewInfo(function(data){
        		var json  = JSON.parse(data);
        		var isCheckView = self.isCheckView(json,path,name);
              	if(isCheckView != "isNotExist"){
              		console.log("Make View Fail Reason : ".error + isCheckView.error);
              		stdio.close();
              	}else{
              		json.view.push(makeViewJSON(path,name));
              		self.makeViewProc(path,json);	
              		console.log(name.normal + " view path is ".normal + self.dirname.normal + "/public".normal + path.normal);
                   	console.log(name.normal + ' make view success :D'.normal);
                	stdio.close();
              	}
        	});	
        });
    });
};

module.exports.removeView = function(){
	stdio.question("View Name : ",function(name){
		fs.readFile(self.dirname + '/view.json',function(err,data){
			var json  = JSON.parse(data);
			var isFindView = module.exports.isFindView(json,name);
			if(isFindView != "isNotExist"){
				stdio.question("Remove All Data " + json.view[isFindView].page.path + " (Y or N) ? ",function(flag){
					if(flag == 'Y'){
						rmdir(json.view[isFindView].page.path);
					}
					json.view.splice(isFindView,isFindView+1);
					fs.writeFile(self.dirname + '/view.json',JSON.stringify(json, null, 4),function(err,writeData){
                		if(err){
                   			console.log(err.message);
                   	 	}
                   	 	console.log(name.normal + ' remove view success :D'.normal);
                    	stdio.close();
                	});
				});	
			}else{
				console.log("Remove View Fail Reason : ".error + name.error + " view is not exist!".error);
				stdio.close();	 
			}
		});
	});
};
