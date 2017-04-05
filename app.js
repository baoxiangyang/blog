const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
//const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
//const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');

/*热更新开始*/
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const { koaDevMiddleware, koaHotMiddleware } = require('koa-webpack-middleware-zm');
const devConfig = require('./webpack.config.js');
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


const index = require('./routes/index');
const users = require('./routes/users');
// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {map: {html: 'ejs' }}));
// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

router.use('/', index.routes(), index.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());

app.use(router.routes(), router.allowedMethods());
// response

app.on('error', function(err, ctx){
  console.log(err);
  logger.error('server error', err, ctx);
});


module.exports = app;