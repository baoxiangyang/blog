//vuessr 渲染函数
const { createBundleRenderer } = require('vue-server-renderer');
const devServerSetup = require('./setup-dev-server.js');
const LRU = require('lru-cache');
let renderer = null; //渲染方法

// 返回渲染内容
const baseRender = async function(ctx, next){
	let context = {url: ctx.request.url, title: '小包总'};
	let htmlStr = await new Promise((resolve, reject) => {
		renderer.renderToString(context, (err, html) => {
      if (err) {
        reject(err)
      }
      resolve(html);
    });
	}).catch(e => {
		return e;
	});
	if (htmlStr.code && htmlStr.code === 404) {
		await next();
	} else {
		ctx.body = htmlStr;
	}
	
}

//创建渲染函数
const createRenderer = (bundle, options) => createBundleRenderer(bundle, Object.assign(options, {
  // for component caching
  cache: LRU({
    max: 1000,
    maxAge: 1000 * 60 * 15
  }),
  // recommended for performance
  runInNewContext: false
}));

// 线上渲染函数
const prodRendere = function (templatePath) {
	const template = require('fs').readFileSync(templatePath, 'utf-8');
	const serverBundle = require('./public/dist/vue-ssr-server-bundle.json');
	const clientManifest = require('./public/dist/vue-ssr-client-manifest.json');
	renderer = createBundleRenderer(serverBundle, {
	  runInNewContext: false, 
	  template,
	  clientManifest
	});
	return baseRender;
}

module.exports = function ({server, templatePath, isProd = false}) {
	if (isProd) {
		return prodRendere(templatePath);
	} else {
		//绑定热更新
		const devServerPromise =  devServerSetup(server, templatePath, (bundle, options) => {
		  renderer = createRenderer(bundle, options); //刷新renderer
		});
		return async function(ctx, next){
			await devServerPromise;
			await baseRender(ctx, next);
		}
	}
}