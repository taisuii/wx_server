const express = require('express');
const soft = require('./soft');
const wx = require('./WX_SERVER');
const app = express();
app.use(express.urlencoded({extended:false}))

app.listen(81);
console.log("The server start of http://localhost:81")
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