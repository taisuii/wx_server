const WT_JS = require('./WT_JS');
const request = require("request");
const Mysql = require("./Mysql");
const {log} = require("./soft");
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


function senKEY(res, data) {
    let sql = `select get_time,status from users where openid = '${data.toUser}'`;
    Mysql.sqlConnect(sql, [], callBack);

    function callBack(err, body) {
        if (err) throw err;
        else {
            let time = Math.round(new Date().getTime() / 1000).toString();

            if (body[0].status === 1 && (time - body[0].get_time) > 2592000) {

                Mysql.sqlConnect(`select * from k where bool = 0`, [], function (err, data_2) {

                    if (data_2.length === 0 || data_2[0].k === '') {
                        send(res, '卡密库存不足', data.toUser, data.fromUser);
                    } else {
                        send(res, data_2[0].k, data.toUser, data.fromUser);
                        Mysql.sqlConnect(`update k set bool=1 where k='${data_2[0].k}'`);
                        Mysql.sqlConnect(`update users set k='${data_2[0].k}' where openid='${data.toUser}'`);
                        Mysql.sqlConnect(`update users set get_time='${time}' where openid='${data.toUser}'`);
                    }

                });

            } else {
                Mysql.sqlConnect(`select k from users where openid = '${data.toUser}'`, [], function (err, data_1) {
                    send(res, '无法获取卡密，未到获取时间，您上次获取的卡密是:' + data_1[0].k, data.toUser, data.fromUser);
                });
            }
        }
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

function subscribe(openid) {
    let sql = `select status from users where openid = '${openid}'`;
    Mysql.sqlConnect(sql, [], callBack);

    function callBack(err, data) {
        if (err) throw err;
        else {
            if (data.length === 0) {
                let time = Math.round(new Date().getTime() / 1000).toString();
                let sql = `insert into users(openid,join_time,status) values('${openid}','${time}','1')`;
                console.log(sql);
                Mysql.sqlConnect(sql);
            } else if (data[0].status === 0) {
                Mysql.sqlConnect(`update users set status=1 where openid='${openid}'`);
            }
        }
    }

}

function cancel_subscribe(openid) {
    let sql = `select status from users where openid = '${openid}'`;
    Mysql.sqlConnect(sql, [], callBack);

    function callBack(err, data) {
        if (err) throw err;
        else {
            if (data.length === 0) {
                let time = Math.round(new Date().getTime() / 1000).toString();
                let sql = `insert into users(openid,join_time,status) values('${openid}','${time}','0')`;
                console.log(sql);
                Mysql.sqlConnect(sql);
            } else if (data[0].status === 1) {
                Mysql.sqlConnect(`update users set status=0 where openid='${openid}'`);
            }
        }
    }

}

function wx_get(req, res) {
    let data = req.query;
    let token = "taisuii";
    let array = new Array(token, data.timestamp, data.nonce);
    array.sort();
    if (data.signature == WT_JS.SHA1(array[0] + array[1] + array[2])) {
        res.send(data.echostr);
    } else {
        res.send("太岁又沐风 QQ 27788854");
    }
}

function wx_post(req, res) {
    let body = '';
    req.on('data', data => {
        body += data.toString();
    });
    req.on('end', function () {
        if (body != '') {
            parseString(body, function (err, result) {
                if (err) throw err;
                let data = {
                    toUser: result.xml.FromUserName,
                    fromUser: result.xml.ToUserName,
                    content: result.xml.Content,
                    MsgType: result.xml.MsgType,
                    Event: result.xml.Event

                };
                switch (data.MsgType[0]) {
                    case 'event': {
                        if (data.Event[0] == 'subscribe') {
                            console.log("用户关注事件");
                            subscribe(data.toUser)
                            send(res, '欢迎关注', data.toUser, data.fromUser);
                        } else if (data.Event[0] == 'unsubscribe') {
                            console.log("用户取关事件");
                            cancel_subscribe(data.toUser)
                            send(res, '焯！', data.toUser, data.fromUser);
                        }
                        break;
                    }
                    case 'text': {
                        if (data.content[0] === '获取卡密') {
                            console.log("触发获取卡密事件");
                            senKEY(res, data);
                        } else {
                            console.log("触发聊天机器人事件");
                            robot(res, data);
                        }
                    }
                    default:
                        break;
                }
            });
        } else {
            res.send('1');
        }
        ;

    });
};

module.exports = {
    wx_get,
    wx_post,
    send
}