var setting = require('/home/loup/nodejs/LSAN/setting.js')
var Sequelize = require('sequelize');
var db = setting.db;
var sequelize = new Sequelize(db.db, db.user, db.pass, {
	host: db.host, port: db.port
});
