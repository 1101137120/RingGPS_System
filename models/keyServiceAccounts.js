var mysqlModel = require('mysql-model');
var MyAppModel = mysqlModel.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'isup155231',
  database : 'key_service',
});

var KeyServiceAccounts = MyAppModel.extend({
    tableName: "account",
});
module.exports = KeyServiceAccounts;