var mysqlModel = require('mysql-model');

var MyAppModel = mysqlModel.createConnection({
  host     : 'localhost',
  agent	   :false,
  user     : 'root',
  password : 'ruixinihoin',
  database : 'mapcache',
  port:'3306'
});	

/*setInterval(function(){
					MyAppModel.disconnect();
							}, 1000*10);*/
console.log(MyAppModel);
var Client = MyAppModel.extend({
    tableName: "gmapnetcache",
});
module.exports = Client;