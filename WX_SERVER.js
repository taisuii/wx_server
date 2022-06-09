const WT_JS = require('./WT_JS');
const request = require("request");
const parseString = require('xml2js').parseString;

function send(res, data, toUser, fromUser) {
    let rep = '' +
        '<xml>\n' +
        '  <ToUserName><![CDATA[' + toUser + ']]></ToUserName>\n' +
        '  <FromUserName><![CDATA[' + fromUser + ']]></FromUserName>\n' +
        '  <CreateTime>' + Date.now() + '</CreateTime>\n' +
        '  <MsgType><![CDATA[text]]></MsgType>\n' +
        '  <Content><![CDATA[' + data + ']]></Content>\n' +
        '</xml>';
    res.send(rep);
}
function senKEY(res, data){
    if(data.content == "获取卡密"){


    }else {
        robot(res,data);
    }
}

function robot(res, data) {
    var reqParams = new URLSearchParams({
        app_key: '67557a83-d854-4b0b-8ad9-76605d542863',
        user_id: 0,
        q: data.content
    });
    request({
        url: "http://api.ruyi.ai/v1/message?" + reqParams,
        method: "GET",
        headers: {},
        body: ""
    }, function (error, response, body) {
        let ret = eval("(" + body + ")");
        console.log(ret.result.intents[0].result.text)
        send(res, ret.result.intents[0].result.text, data.toUser, data.fromUser);
    });
}


function wx_get(req, res) {
    let data = req.query;
    let token = "taisuii";
    let array = new Array(token, data.timestamp, data.nonce);
    array.sort();
    if (data.signature == WT_JS.SHA1(array[0] + array[1] + array[2])) {
        res.send(data.echostr);
    } else {
        res.send(false);
    }
}

function wx_post(req, res) {
    let data = '';
    req.on('data', function (body) {
        data += body
    })
    if (data != ""){
        req.on('end', function () {
            parseString(data, function (err, result) {
                let data = {
                    toUser: result.xml.FromUserName,
                    fromUser: result.xml.ToUserName,
                    content: result.xml.Content
                }
                senKEY(res, data);
            })
        })
    }else {
        res.send("1");
    }
}

module.exports = {
    wx_get,
    wx_post,
    send
}