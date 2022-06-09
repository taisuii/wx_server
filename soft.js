const ret = (res) => {
    let data = {}
    data.ip = '43.142.29.14:6632'//备用服务器地址
    data.infrom='各位在5.27前务必要有提卡记录，否则会被ti'

    data.datas = false//是否弹出公告，全软件
    data.data = '请添加QQ群号735400231'//公告内容

    data.kill = true//是否远程删除
    data.killapp = ['抖音砍价','迎晚部落','title']//需要自删APP列表

    data.dataapps = false//部分软件是否弹出公告
    data.dataapp = ['活动软件 ', '多糖']//需要指定弹出公告软件列表
    data.str = '暂无公告'//需要指定弹出公告软件列表

    data.dll='https://wws.lanzouq.com/i9cvH059224d'
    data.dllv='3'
    res.send(JSON.stringify(data));
}
function log(req){
    console.log(req.method,req.url,req.query,req.body);
}
module.exports = {
    ret,
    log
}