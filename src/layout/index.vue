<template>
  <div class="main">
    <header>
      <el-menu theme="dark"  :default-active="mainDefault" :router="true" class="nav maxWidth" index="main">
        <el-row>
          <el-col :span="5" class="headerItem">
            <h1>
              <router-link :to="{name: 'index'}">小包总</router-link>
            </h1>
          </el-col>
          <el-col :sm="14" class="navlist" >
            <el-menu-item :route="{name: 'articleList'}" index="main-1">文章</el-menu-item>
            <el-menu-item :route="{name: 'messageBoard'}" index="main-2">留言</el-menu-item>
            <el-menu-item :route="{name: 'profile'}" index="main-3">简介</el-menu-item>
          </el-col>
          <el-col :span="5" class="headerItem">
            <template v-if="!userInfo.userName">
              <el-button type="success" class="loginBtn" size="small" @click="set_dialogLogin(true)">登录</el-button>
              <router-link :to="{name: 'register'}">
                <el-button type="info" size="small">注册</el-button>
              </router-link>
            </template>
            <template v-else>
              <el-dropdown class="userAvatar" @command="handleCommand">
                <img :src="userInfo.avatarImg || '/images/userAvatar/defualtUser.png'" :title="userInfo.userName" :alt="userInfo.userName">
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>我的主页</el-dropdown-item>
                  <el-dropdown-item command="logOut">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-col>
        </el-row>
      </el-menu>
    </header>
    <Login></Login>
    <router-view></router-view>
  </div>
</template>
<script type="text/javascript">
  import Login from '../user/login.vue';
  import { mapState, mapMutations } from 'vuex';
  import { set_dialogLogin, set_userInfo} from '../mutation-types.js';
  export default {
    data() {
      return {
        activeIndex: '1',
        errorCode: 0,
        msg: ''
      };
    },
    computed: {
      ...mapState(['userInfo', 'mainDefault'])
    },
    methods: {
      handleCommand(command){
        if(command == 'logOut'){
          this.$myAjax.post(this, '/user/logOut').then(res => {
            this.set_userInfo({});
            this.errorCode = res.data.errorCode;
            this.msg = res.data.msg;
          });
        }
      },
      ...mapMutations([set_dialogLogin, set_userInfo])
    },
    components: {
      Login
    },
    watch: {
      msg: function  (val, oldVal) {
        if(val){
          this.$message({
            showClose: true,
            message: this.msg, 
            duration: 2000,
            type: this.errorCode ? 'error': 'success',
            onClose: ()=> {
              this.msg = '';
            }
          });
        }
      }
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
        .userAvatar img {
          height: 40px;
          width: 40px;
          background-color: #fff;
          border-radius: 50%
        }
        h1 {
          font-size: 18px;
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
  }
  a {
    color: #000;
  }
</style>
