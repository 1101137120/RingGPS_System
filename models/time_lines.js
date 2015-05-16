var mysqlModel = require('mysql-model');
var MyAppModel = mysqlModel.createConnection({
  host     : '10.1.1.77',
  user     : 'root',
  password : 'ruixinihoin',
  database : '2.4_test',
  port:'3306'
});

var Client = MyAppModel.extend({
    tableName: "time_line",
});
module.exports = Client;
