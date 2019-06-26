var mysqlModel = require('mysql-model');
var MyAppModel = mysqlModel.createConnection({
  host     : 'localhost',
  user     : 'mike8675',
  password : '',
  database : '2.4_test',
  port:'3306'
});

var Client = MyAppModel.extend({
    tableName: "time_line_today",
});
module.exports = Client;
