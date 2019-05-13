# 线上地址   <font size="5">[小包总](https://www.xiaobaozong.cn/ "小包总")</font>

## 技术栈
 * 服务器： node、koa2
 * 客户端： vue、vuex、vue-router、Element-UI
 * 数据库： redis、mongodb
 * 打包： webpack

## 网站模块
 1. 爬虫模块：用于爬取一些我看的上的文章，主要采用request，cheerio模块对数据的爬取和处理，
 	同时需要注意处理爬取图片的处理
 2. 文章模块：展示爬取的文章数据，并进行分类处理和展示
 3. 登录注册模块： 支持用户的登录注册，接入第三方登录接口，注册采用nodemailer模块进行邮箱验证
 4. 留言模块： 让用户在本网站留下自己的足记
 5. 统计模块： 统计网站访问量等数据

## 注意
 * 不要以线上环境运行，因为源码中没有包含https相关文件
 * config.js中的github，qq授权登陆需要自己配置
 * mongodb账号密码只有读取权限

## 2017-12-06更新
 * Element-UI升级到2.0.7版本
 * vue优化为按需加载

## 2019-05-13更新
 * 介入vue ssr

## QQ交流群
	133240225、 193572405

