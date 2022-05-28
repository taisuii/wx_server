const http = require('http');
const request = require("request");
const soft = require("./soft");

const server = http.createServer();

server.listen(81, function () {
    console.log("strat server...");
})

server.on('request', function (req, res) {

    soft.log(req);
    switch (req.url) {
        case '/taisui': {
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8', "Access-Control-Allow-Origin": "*"});
            res.end(soft.ret());
            break;
        }
        case '/': {
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8', "Access-Control-Allow-Origin": "*"});
            res.end(JSON.stringify({code:0,msg:'Welcome'}));
            break;
        }
        default :
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8', "Access-Control-Allow-Origin": "*"});
            res.end(JSON.stringify({code:1,msg:'未定义'}));
            break;
    }
})

