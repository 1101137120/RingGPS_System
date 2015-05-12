var mysqlModel = require('mysql-model');
var MyAppModel = mysqlModel.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'isup155231',
  database : 'api',
});

var Client = MyAppModel.extend({
    tableName: "client",
});
module.exports = Client;
