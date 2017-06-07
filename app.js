const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const favicon = require('koa-favicon');
import session from 'koa-session2';
import redisStore from './common/store.js';
const process = require('process');

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
  user = require('./routes/user.js');
// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));

app.use(favicon(__dirname + '/public/images/logo.jpg'));
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {map: {html: 'ejs' }}));
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
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

router.use('/', index.routes(), index.allowedMethods());
router.use('/article', article.routes(), article.allowedMethods());
router.use('/user', user.routes(), user.allowedMethods());

app.use(router.routes(), router.allowedMethods());
// response

app.on('error', function(err, ctx){
  console.log(err);
});

module.exports = app;