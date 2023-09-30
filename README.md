# CatWebRPC

适用于Web爬虫领域的RPC解决方案

## 服务器

catserver  Wamp路由 基于 express fox-wamp autobahn

```apl
npm i express
npm i body-parser
npm i fox-wamp
npm i autobahn
```

## 网页服务

CatWebService.js 基于Wampy.js 对部分代码进行了修改



## 使用方法

1.首先运行服务器

```
node catserver.js  设置ip和端口
```

2.网页插入CatWebService.js运行

3.在需要的位置调用

```
//window.catwampy.register(topic,func,opt)
//topic: 同java包名类似  域.名.方法名
//func: js的function  需要调用的方法
//opt: 同Wampy.js opt参数一致 另外增加了一个concurrency 并发设置 一般不需要设置 或者根据需求填写

//如下 注册了一个zhiyuan方法 给定并发（同时的请求）设置为10
window.catwampy.register('cat.rpc.zhiyuan', zhiyuan, { concurrency: 10 });

```

4. 任意语言远程调用

```
POST请求
POST http://IP:PROT/call?topic=接口的topic HTTP/1.1
Content-Type: application/json

["参数1","参数2",1,true,1.1，{}]  //类似json 支持不同类型  类似js apply(this,参数数组) 中的参数数组

```





