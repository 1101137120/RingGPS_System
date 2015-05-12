var mysqlModel = require('mysql-model');
var MyAppModel = mysqlModel.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'isup155231',
  database : 'key_service',
});

var KeyServiceKeys = MyAppModel.extend({
    tableName: "key_record",
});
module.exports = KeyServiceKeys; 