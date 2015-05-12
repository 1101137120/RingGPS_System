var mysqlModel = require('mysql-model');
var MyAppModel = mysqlModel.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'isup155231',
  database : 'api',
});

var Developer = MyAppModel.extend({
    tableName: "developer",
});
module.exports = Developer;
