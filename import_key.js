const fs = require('fs');
const Mysql = require('./src/Mysql');
fs.readFile('./key_list/taisuii.txt', callback)

function callback(err, data) {
    data = data.toString()
    let array = new Array();
    array = data.split('\r\n');
    for (let i =0; i < array.length; i++) {
        Mysql.sqlConnect(`insert into k values('${array[i]}',0)`);
    }
    console.log('run end.');
}

