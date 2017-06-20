var router = require('koa-router')(),
	base = require('../common/base.js');

//留言解绑
router.post('/message', async function(ctx, next){
	ctx.body = ctx.request.body;
});
module.exports = router;