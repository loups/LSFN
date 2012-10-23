var view = require('./module/viewMaker').setDirname(__dirname);
var menu = process.argv[2];

if(menu == "mkview"){
    view.makeView();
}else if(menu == "rmview"){
	view.removeView();
}