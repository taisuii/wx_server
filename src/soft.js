const ret = (res) => {
    let data = {}
    res.send(JSON.stringify(data));
}
function log(req){
    console.log(req.method,req.url);
    // console.log(req.headers,req.query);
}
module.exports = {
    ret,
    log
}
