var mysqlModel = require('mysql-model');
var MyAppModel = mysqlModel.createConnection({
  host     : '10.1.1.77',
  user     : 'root',
  agent	   :false,
  password : 'ruixinihoin',
  database : '2.4_husbandry',
  port:'3306'
});
var Client = MyAppModel.extend({
    tableName: "tag_animal",
});
module.exports = Client;