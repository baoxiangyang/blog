var router = require('koa-router')(),
	upload = require('../common/upload.js');

router.get('/', async function (ctx, next) {
  ctx.state = {
    title: '小包总'
  };
  await ctx.render('index', {
  });
});
//上传头像
router.post('upAvatar', upload.single('userAvatar'), async function (ctx, next) {
  ctx.session.userAvatar = ctx.req.file;
  ctx.body = ctx.req.file.filename;
});
module.exports = router;
