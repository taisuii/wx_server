const mysql = require('mysql');
module.exports = {
    config : {
        host     : '43.142.29.14',
        user     : 'SENDKEY',
        password : 'SENDKEY',
        database : 'sendkey'
    },
    sqlConnect : function(sql,sqlArr,callBack){
        let pool = mysql.createPool(this.config);
        pool.getConnection(function(err,conn){
            if (err)throw err;
            conn.query(sql,sqlArr,callBack)
            conn.release();
        });
    }
}

// connection.connect();
// let sql = "select * from users";
// connection.query(sql, function (error, results, fields) {
//     if (error) throw error;
//     else console.log('The solution is: ', results[0].solution);
// });
// connection.end();