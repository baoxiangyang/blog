<template>
  <div class="maxWidth profile">
    <h2>技术栈</h2>
    <ul>
      <li>服务器： node、koa2</li>
      <li>客户端： vue、vuex、vue-router、Element-UI</li>
      <li>数据库： redis、mongodb</li>
      <li>打包：&emsp; webpack</li>
    </ul>
    <h2>网站模块</h2>
    <ul>
      <li>爬虫模块：用于爬取一些我看的上的文章，主要采用request，cheerio模块对数据的爬取和处理，
        同时需要注意处理爬取图片的处理</li>
      <li>文章模块：展示爬取的文章数据，并进行分类处理和展示</li>
      <li>登录注册模块： 支持用户的登录注册，接入第三方登录接口，注册采用nodemailer模块进行邮箱验证</li>
      <li>留言模块：让用户在本网站留下自己的足记</li>
      <li>统计模块：统计网站访问量等数据</li>
    </ul>
    <h2>其他</h2>
      <ul>
        <li>源码： <a href="https://github.com/baoxiangyang/blog/tree/release-v2.0.0" target="_black">GITHUB地址</a></li>
        <li>BUG反馈： <a href="https://github.com/baoxiangyang/blog/issues" target="_black">有什么BUG冲我来</a></li>
        <li>如若存在文章不存在的请求，<a href="tencent://message/?uin=791736879&Site=&Menu=yes">请联系我</a>，我会尽快处理 </li>
        <li>难点：mongodb关联查询(其实也不算难点)、线上环境加速优化(cdn加载资源，压缩，打包)</li>
        <li><strong>UI丑不要怪我，毕竟没有女UI设计师呀</strong></li>
        <li>QQ交流群：133240225、 193572405</li>
      </ul>
    <h2>2017-12-06更新</h2>
    <ul>
      <li>Element-UI升级到2.0.7版本</li>
      <li>vue优化为按需加载</li>
    </ul>
  </div>
</template>
<script type="text/javascript">
  import { mapMutations } from 'vuex';
  export default {
    data() {
      return {

      };
    },
    methods: {
      ...mapMutations(['set_default_route'])
    },
    beforeRouteEnter(to, from, next){
      next(vm => {
        vm.set_default_route('main-3');
      });
    },
  };
</script>
<style lang="less">
  .profile a {
    color: #009a61
  }
</style>