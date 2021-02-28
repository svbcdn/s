const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const url = require("url");
// 使用ctx.body解析中间件
app.use(bodyParser())

app.use( async ( ctx ) => {

  if (  ctx.method === 'GET' ) {
    // 当GET请求时候返回表单页面
    await pipe(ctx);
  } else if ( ctx.url === '/' && ctx.method === 'POST' ) {
    // 当POST请求的时候，中间件koa-bodyparser解析POST表单里的数据，并显示出来
    let postData = ctx.request.body
    ctx.body = postData
  } else {
    // 其他请求显示404
    ctx.body = '<h1>404！！！'
  }
})

app.listen(3000, () => {
  console.log('[demo] request post is starting at port 3000')
});

async function pipe(ctx) {
  let v = url.parse( ctx.url) || {};
  let file = v.pathname || "";
  let fileAfter =
    (file.replace(/[?#].+$/g, "").match(/\.[a-z0-9]+$/) || [""])[0] || "";
    file = file == '' || file == '/' ? 'index.html' : file;

  let rfile = path.join(__dirname, './src', file); //从缓存里找, 找不到就从硬盘直接读取
  return new Promise((resolve, reject)=>{
    fs.stat(rfile, (err, stats) => {
      if (err || stats.isDirectory()){
        ctx.status = 404;
        return;
      }
      let contentType = mime.lookup(fileAfter);
      
      contentType = contentType == false ? 'application/octet-stream' : contentType  + "; charset=utf8";
      ctx.status = 200;
      ctx.set({
        "Content-Type": contentType,
        //"Content-Length": stats.size,
      });
      let stream = fs.createReadStream(rfile, {});
      console.log(">>>>>>>>>>", contentType);
      //stream.pipe(res);
      ctx.body = stream;
      resolve();
    });
  })
  
};
