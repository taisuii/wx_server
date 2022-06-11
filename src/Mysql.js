const mysql = require('mysql');
module.exports = {
    config : {
        host     : 'localhost',
        user     : 'admin',
        password : '123456',
        database : '123456'
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
