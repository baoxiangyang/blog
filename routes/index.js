var router = require('koa-router')();

router.get('/', async function (ctx, next) {
  ctx.state = {
    title: '小包总'
  };
  await ctx.render('index', {
  });
});
module.exports = router;
