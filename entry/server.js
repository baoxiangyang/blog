import { createApp } from '../src/main.js';

//核心的目的 有2个 
//摘取每一个当前路由 index/test -> vue router=>compents
//compents异步的数据 组装成一个页面
//把后端请求的这套流程的数据交给 context.state
export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();
    //后台真实的路由 a/b 
    //router是前端的路由 context.url后台给你的环境
    router.push({path: context.url});
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      // 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        } else {
          return Promise.resolve()
        }
      })).then(() => {
        context.state = store.state;
        resolve(app)
      }).catch(reject)
      // Promise 应该 resolve 应用程序实例，以便它可以渲染
    }, reject)
  });
}
