var url = require('url'); 
var errorProc = require('./error');
var self = this;

module.exports.url = {};
module.exports.method = {
	GET:{
		flag : true,
		parameters : []
	},
	POST:{
		flag : false,
		parameters : []
	}
};

module.exports.data = {
    status : {   
        code : "",
        reason : ""
    }
};

module.exports.GET = function(name){
	self.method.GET.flag = true;
	if(self.method.GET.parameters.indexOf(name) == -1){
		self.method.GET.parameters.push(name);	
	}
};

module.exports.POST = function(name){
	self.method.POST.flag = true;
	if(self.method.POST.parameters.indexOf(name) == -1){
		self.method.POST.parameters.push(name);	
	}
};

module.exports.getData = function(method,body){
    if(self.url == null || self.url.pathname == ""){
		data = errorProc.NotExistUrlError;
    }else{
    	if(method == 'GET' && self.method.GET.flag){
    		var result = isExistParameter(method,self.url.query);
			if(!result.flag){ 
              	self.data.status = errorProc.NotExistParameterError(result.parameters[0]);
            }else{
                setStatusOK();
            }
    	}else if(method == 'POST' && self.method.POST.flag){
    		var result = isExistParameter(method,body);
			if(!result.flag){ 
    	 		self.data.status = errorProc.NotExistParameterError(result.parameters[0]);
        	}else{
            	setStatusOK();
          	}
    	}else{
    		self.data.status = errorProc.UnsupportedRequestMethodError(method);
    	}
    }
    return JSON.stringify(self.data, null, 4);
};

function isExistParameter(method,_parameters){
    var parameters = [];
    var result = 
    { 
        flag : true, 
        parameters: []
    };
    if(method == 'GET'){
    	parameters = self.method.GET.parameters;
    }else if(method == 'POST'){
    	parameters = self.method.POST.parameters;
    }    
    for(i=0; i< parameters.length; i++){
        if(!_parameters.hasOwnProperty(parameters[i])){
            result.flag = false;
            result.parameters.push(parameters[i]);
        }
    }
    return result;
}

function setStatusOK(){
	self.data.status.code = 'OK';
    self.data.status.reason = 'OK';
}


