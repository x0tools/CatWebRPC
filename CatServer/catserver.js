const http = require('http')
const express = require('express')
const FoxRouter = require('fox-wamp')
const autobahn = require('autobahn');
const bodyParser = require('body-parser')

let app = express()
// Content-Type: application/json
app.use(bodyParser.json())

const PORT = 5000


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

            let r = await session.call(`${req.query.topic}`, ['EB2A38568661887FA180BDDB5CABD5F21C7BFD59C090CB2D245A87AC253062882729293E5506350508E7F9AA3BB77F4333231490F915F6D63C55FE2F08A49B353F444AD3993CACC02DB784ABBB8E42A9B1BBFFFB38BE18D78E87A0E41B9B8F73A928EE0CCEE1F6739884B9777E4FE9E88A1BBE495927AC4A799B3181D6442443', 1695972480, 'D5RD10', "123"]);
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