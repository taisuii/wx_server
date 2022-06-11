const express = require('express');
const soft = require('./src/soft');
const wx = require('./src/WX_SERVER');

const app = express();
app.use(express.urlencoded({extended:false}))
app.listen(80);
console.log("The server start of http://localhost:80")

app.get("*", function (req, res) {
    soft.log(req);
    switch (req.path) {
        case '/':
            wx.wx_get(req, res);
            break;
        case '/taisui' :
            soft.ret(res);
            break;
        default :
            res.send("1");
            break;
    }
})

app.post("*", function (req, res) {
    soft.log(req);
    switch (req.path) {
        case '/':
            wx.wx_post(req, res);
            break;
        default :
            res.send("1");
            break;
    }
})
