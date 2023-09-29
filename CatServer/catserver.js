const http = require('http')
const express = require('express')
const FoxRouter = require('fox-wamp')
const autobahn = require('autobahn');
const bodyParser = require('body-parser')

let app = express()
// Content-Type: application/json
app.use(bodyParser.json())

const PORT = 5000
console.error = function(){}

var connection = new autobahn.Connection({ url: 'ws://127.0.0.1:5000/rpc', realm: 'catrpc' });

let session = null;
function GetReturnMsg(code, msg) {
    return {
        code: parseInt(code) == NaN ? -1 : code,
        msg: msg + ""
    }
}

app.post('/call', async (req, res) => {
    try {
        if (req.query.topic == undefined && req.query.topic == "") {
            res.send(GetReturnMsg(-1, "url query topic 不存在")); return;
        }
        if (session != null) {
            let r = await session.call(`${req.query.topic}`, req.body);
            res.send(GetReturnMsg(0, `${r}`)); return;
        } else {
            res.send(GetReturnMsg(-1, "500 服务器未初始化成功")); return;
        }
    } catch (e) {
        res.send(GetReturnMsg(-1, `${e.error} in query: ${req.query.topic}`)); return;
    }

})


let httpServer = http.createServer(app)
httpServer.listen(PORT, "127.0.0.1", async () => {
    session = await (new Promise((s, e) => {
        connection.onopen = function (session) {
            s(session);
        }
        connection.open();
    }))
    console.log('RPC 服务开启完成 \r\n接口已创建 http://127.0.0.1:5000/call');
})
router = new FoxRouter()
router.listenWAMP({ server: httpServer, path: "/rpc" })