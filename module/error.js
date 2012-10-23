module.exports.UnsupportedRequestMethodError = function(method){
	status =  {
 		code : "UnsupportedRequestMethodError" ,
		reason : "The method " + method + " is not valid method for this request."
	}
	return status
}

module.exports.NotExistParameterError = function(parameter){
	status = {
		code : "NotExistParameterError", 
		reason : parameter + " don't to exist parameter" 
	}
	return status;
}

module.exports.NotExistUrlError = function() {
	status = {
		code : "NotExistUrlError", 
		reason : "This URL is error." 
	}
	return status;	
};

