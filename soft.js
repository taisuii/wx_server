function ret(){
    var data = {}
    //远程获取服务器地址
    data.ip = '43.142.29.14:6632'
    data.infrom='各位在5.27前务必要有提卡记录，否则会被ti'

    //全局公告
    data.datas = false
    data.data = '请添加QQ群号735400231'

    //远程删除软件列表
    data.kill = false
    data.killapp = ['抖音砍价']

    //弹出公告软件列表
    data.dataapps = false
    data.dataapp = ['活动软件 ', '多糖']
    data.str = '暂无公告'

    //dll版本
    data.dll='https://wws.lanzouq.com/i9cvH059224d'
    data.dllv='3'

    return JSON.stringify(data);
}

function log(req){
    console.log(req.method);
}

module.exports = {
    ret,
    log
}