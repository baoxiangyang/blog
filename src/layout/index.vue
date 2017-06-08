<template>
  <div class="main">
    <header>
      <el-menu theme="dark" :default-active="activeIndex" class="nav maxWidth" @select="handleSelect">
        <el-row>
          <el-col :span="5" class="headerItem">
            <h1>
              <router-link :to="{name: 'index'}">小包总</router-link>
            </h1>
          </el-col>
          <!-- <el-col :sm="14" class="navlist" >
            <el-menu-item index="1">首页</el-menu-item>
            <el-menu-item index="2">文章</el-menu-item>
            <el-menu-item index="3">DEMO</el-menu-item>
            <el-menu-item index="4">简介</el-menu-item>
          </el-col> -->
          <el-col :span="5" class="headerItem" :push="14">
            <el-button type="success" class="loginBtn" size="small" @click="set_dialogLogin(true)">登录</el-button>
              <router-link :to="{name: 'register'}">
                <el-button type="info" size="small">注册</el-button>
              </router-link>
          </el-col>
        </el-row>
      </el-menu>
    </header>
    <Login></Login>
    <router-view></router-view>
    <footer class="record">
      <a href="http://www.miitbeian.gov.cn">渝ICP备16013153号</a>
    </footer>
  </div>
</template>
<script type="text/javascript">
  import Login from '../user/login.vue';
  import { mapState, mapMutations } from 'vuex';
  import { set_dialogLogin } from '../mutation-types.js';
  export default {
    data() {
      return {
        activeIndex: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      handleIconClick() {

      },
      ...mapMutations([set_dialogLogin]),
      tips() {
         this.$message({
          showClose: true,
          message: '努力开发中。。。'
        });
      }
    },
    components: {
      Login
    }
  };
</script>
<style lang="less">
  html {
    position: relative;
  }
  html, body, .main {
    min-height: 100%;
  }
  .main {
    min-width: 770px;
    header {
      height: 60px;
      background-color: #324157;
      .el-menu-item {
        float: none !important;
        display: inline-block;
        &:hover {
          background: #20a0ff;
          color: #fff;
        }
      }
      .navlist {
        text-align: center;
      }
      .headerItem {
        height: 60px;
        line-height: 60px;
        .loginBtn {
          margin-right: 10px;
        }
        h1 {
          font-size: 18px;
          padding-left: 25px;
          height: 60px;
          line-height: 60px;
          margin: 0;
          color: green;
          background-image: gradient(linear, 0 0, 0 bottom, from(rgb(19, 206, 102)), to(rgb(80, 191, 255)));
          background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(rgb(19, 206, 102)), to(rgb(80, 191, 255)));
          background-clip: text;
          -webkit-background-clip: text;
          text-fill-color: transparent;
          -webkit-text-fill-color: transparent;
          font-size: 30px;
          font-weight: bold;
        }
        &:last-child {
          text-align: right;
          padding-right: 25px;
        }
        img {
          border: 0;
          height: 50px;
          border-radius: 50%;
          vertical-align: middle;
          margin-right: 10px;
        }
      }
    }
    .record {
      text-align: center;
      width: 100%;
      padding-bottom: 10px;
      position: absolute;
      bottom: 0;
    }
    a {
      color: #000;
    }
  }
</style>
