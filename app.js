/* server.js */
const path = require('path'),
 	Koa = require('koa'),
  bodyparser = require('koa-bodyparser'),
 	favicon = require('koa-favicon'),
 	mongo = require('./dbs/index.js'),
  isProd = require('process').env.NODE_ENV === 'production';

import session from 'koa-session2';
import redisStore from './common/store.js';

const app = new Koa();
const renderer = require('./renderer.js');
const router = require('koa-router')();

const index = require('./routes/index'),
  article = require('./routes/article'),
  user = require('./routes/user.js'),
  messageWall = require('./routes/messageWall.js');
  
app.use(favicon(__dirname + '/public/images/logo.ico'));  
app.use(require('koa-static')(__dirname + '/public'));


//加载第三方图片
app.use(async (ctx, next) => {
  if(ctx.url.indexOf('/img/') === 0){
    ctx.url = ctx.url.replace(/\?|\&/g, '_');
  }
  await next();
});

app.use(require('koa-static')(__dirname + '/article'));


app.use(bodyparser());

//session
app.use(session({
  key: "xiaobaozongID",
  store: redisStore,
  httpOnly: true
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} ${ctx.status} - ${ms}ms`);
});

app.use(renderer({server: app, isProd, templatePath: './view/index.template.html'}));

//访问统计
if(process.env.NODE_ENV == 'production'){
  app.use(async (ctx, next) => {
    await next();
    if(ctx.url.indexOf('/img') !== 0 && ctx.status == 200){
      let data = {
        ip: ctx.ip,
        url: ctx.url,
        method: ctx.method,
        userName: ctx.session.userInfo && ctx.session.userInfo.userName,
      };
      //统计访问量
      mongo.insertStatistic(data).catch(e => {
        console.error(e);
      });
    }
  });
}
//处理记住登录状态
app.use(async (ctx, next)=> {
  let loginStatus = ctx.cookies.get('loginStatus');
  if(loginStatus && !ctx.session.userInfo){
    ctx.session.userInfo = await mongo.findUserOne({loginStatus: loginStatus});
  }
  await next();
  if(ctx.method == "POST" && ctx.session.userInfo && ctx.request.body.userInfo){
    ctx.body.userInfo = {
      userName: ctx.session.userInfo.userName,
      avatarImg: ctx.session.userInfo.avatarImg,
      userId: ctx.session.userInfo._id
    };
  }
});

router.use('/', index.routes(), index.allowedMethods());
router.use('/article', article.routes(), article.allowedMethods());
router.use('/user', user.routes(), user.allowedMethods());
router.use('/messageWall', messageWall.routes(), messageWall.allowedMethods());

app.use(router.routes(), router.allowedMethods());

app.on('error', function(err, ctx){
  console.error('error: ' + ctx.url);
});

module.exports = app;