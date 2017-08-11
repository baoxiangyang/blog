const Koa = require('koa'),
  app = new Koa(),
  router = require('koa-router')(),
  views = require('koa-views'),
  convert = require('koa-convert'),
  /*json = require('koa-json'),
  bodyparser = require('koa-bodyparser'),*/
  body = require('koa-json-body'),
  favicon = require('koa-favicon'),
  mongo = require('./dbs/index.js'),
  process = require('process'),
  path = require('path'),
  fs = require('fs');
import session from 'koa-session2';
import redisStore from './common/store.js';

if(process.env.NODE_ENV != 'production'){
  /*热更新开始*/
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const { koaDevMiddleware, koaHotMiddleware } = require('koa-webpack-middleware-zm');
  const devConfig = require('./webpack/webpack.dev.js');
  const devCompiler = webpack(devConfig);
  const expressDevMiddleware = webpackDevMiddleware(devCompiler, {
      publicPath: devConfig.output.publicPath,
      stats: {
        colors: true
      }
  });
  app.use(koaDevMiddleware(expressDevMiddleware));
  const expressHotMiddleware = webpackHotMiddleware(devCompiler);
  app.use(koaHotMiddleware(expressHotMiddleware));
  /*热更新结束*/
}

const index = require('./routes/index'),
  article = require('./routes/article'),
  user = require('./routes/user.js'),
  messageWall = require('./routes/messageWall.js');
// middlewares
/*app.use(bodyparser());
app.use(convert(json()));*/

app.use(body({limit: '10kb', fallback: true}));
app.use(favicon(__dirname + '/public/images/logo.jpg'));
app.use(require('koa-static')(__dirname + '/public'));
app.use(views(__dirname + '/views', {map: {html: 'ejs' }}));

//session
app.use(session({
  key: "xiaobaozongID",
  store: redisStore,
  httpOnly: true
}));

//加载第三方图片
if(process.env.NODE_ENV != 'production'){
  app.use(async (ctx, next) => {
    if(ctx.url.indexOf('/img') === 0){
      ctx.url = ctx.url.replace('?', '_').replace("&", '&amp;');
    }
    await next();
  });
}else{
  app.use(async (ctx, next) => {
    if(ctx.url.indexOf('/img') === 0){
      ctx.url = ctx.url.replace("&", '&amp;');
    }
    await next();
  });
}
app.use(require('koa-static')(__dirname + '/article'));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
//处理记住登录状态
app.use(async (ctx, next)=> {
  let loginStatus = ctx.cookies.get('loginStatus');
  if(loginStatus && !ctx.session.userInfo){
    ctx.session.userInfo = (await mongo.findUserInfo({loginStatus: loginStatus}))[0];
  }
  await next();
  if(ctx.method == "POST" && ((ctx.session.userInfo && ctx.session.userInfo.auth) || (loginStatus && ctx.request.body.userInfo && ctx.session.userInfo.loginStatus === loginStatus))){
    ctx.session.userInfo.auth = false;
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
// response

app.on('error', function(err, ctx){
  console.error(err);
});

module.exports = app;