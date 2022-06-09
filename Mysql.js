const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : '',
    user     : '',
    password : '',
    database : ''
});

connection.connect();
let sql = "select * from users";
connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    else console.log('The solution is: ', results[0].solution);
});
connection.end();
