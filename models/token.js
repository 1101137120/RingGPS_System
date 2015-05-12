var mysqlModel = require('mysql-model');
var MyAppModel = mysqlModel.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'isup155231',
  database : 'api',
});

var Token = MyAppModel.extend({
    tableName: "token",
});
module.exports = Token;
