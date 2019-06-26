const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ruixinihoin',
    database: 'mapcache'
});

connection.connect();
function get(reqArry, response, request) {
    var type = reqArry[2];
    var zoom = reqArry[3];
    var x = reqArry[4];
    var y = reqArry[5];
	
    connection.query("select Tile from gmapnetcache where Type='"+type+"' and Zoom='"+zoom+"' and X='"+x+"' and Y='"+y+"'", function (error, results, fields) {
        if (error || !results || !results[0]) {
            response.statusCode = 500;
            response.setHeader("Content-Type", "text/plain");
            response.write(error + "\n");
            response.end();
            return;
        };
        response.statusCode = 200;
        response.setHeader('Content-Type', 'image/png');
        response.write(results[0].Tile, "binary");
        response.end();
    });
}

exports.get = get;