<template>
  <el-dialog :title="isLogin ? '用户登录' : '找回密码'" :visible.sync="dialogLogin" :lock-scroll="false" size="tiny" class="loginDialog" :before-close="handelBeforeClose">
    <div class="toggleLgoin" ref="toggleLgoin">
      <transition mode="out-in" @enter="enter"
        enter-active-class="animated bounceInRight"
        leave-active-class="animated bounceOutLeft"
      >
        <el-form v-if="isLogin" key="lgoin" class="loginForm" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="top">
          <el-form-item label="用户名 或 邮箱" prop="userName"> 
            <el-input v-model="loginForm.userName" placeholder="请输入用户名或邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-button type="text" class="forgetPassword" @click="isLogin = false">忘记密码</el-button>
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="loginForm.remember">记住登录状态</el-checkbox>
            <el-button type="success" class="submit" @click="loginSubmit('loginForm')">登录</el-button>
          </el-form-item>
        </el-form>
        <el-form v-else key="recover" :model="recoverForm" :rules="recoverRules" ref="loginForm" label-position="top">
          <el-form-item label="邮箱" prop="email"> 
            <el-input v-model="recoverForm.email" placeholder="请输入用邮箱地址"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="verificationCode">
            <el-input v-model.number="recoverForm.verificationCode" type="password" placeholder="请输入验证码">
              <el-button style="width:110px" slot="append" :class="{ getCode: isGetCode }" @click="handeGetCode('recoverForm')" >{{codeText}}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="passwrod">
            <el-input v-model="recoverForm.passwrod" type="password" placeholder="不少于6位"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="checkpasswrod">
            <el-input v-model="recoverForm.checkpasswrod" type="password" placeholder="确认密码"></el-input>
          </el-form-item>
          <el-form-item class="recoverItem">
            <el-button type="danger">重置密码</el-button>
            <el-button type="text" @click="isLogin = true">GO登录</el-button>
          </el-form-item>
        </el-form>
      </transition>
    </div>
    <p class="quickLogin">
      <span>快速登录</span>
      <a href="" title="QQ登录"><i class="myIcon myIcon-qq"></i></a>
      <a href="" title="GITHUB登录"><i class="myIcon myIcon-github"></i></a>
    </p>
  </el-dialog>
</template>
<script>
  import "../style/user.less";
  import { mapState, mapMutations } from 'vuex';
  import { set_dialogLogin, set_userInfo} from '../mutation-types.js';
  export default {
    data() {
      let checkpasswrod = (rule, value, callback) => {
        if (value !== this.registerForm.passwrod) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },
      numberLength = (rule, value, callback) => {
        if (value.toString().length !== 6) {
          callback(new Error('请输入6位数字验证码'));
        }else{
          callback();
        }
      };
      return {
        isLogin: true,
        title: '用户登录',
        codeText: '获取验证码',
        isGetCode: true,
        loginForm: {
          userName: '',
          password: '',
          remember: true
        },
        recoverForm: {
          email: '',
          verificationCode: '',
          password: '',
          checkpasswrod: ''
        },
        loginRules:{
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur'},
            { min: 6, message: '请输入正确的密码', trigger: 'blur'}
          ]
        },
        recoverRules: {
          password:[
            { required: true, message: '请输入密码', trigger: 'blur'},
            { min: 6, message: '密码不能少于6个字符', trigger: 'blur'}
          ],
          checkpasswrod:[
            { required: true, message: '请确认密码', trigger: 'blur'},
            { validator: checkpasswrod, trigger: 'blur' }
          ],
          email:[
            { required: true, message: '请输入邮箱地址', trigger: 'blur'},
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
          ],
          verificationCode:[
            { required: true, type:'number', message: '请输入验证码', trigger: 'blur'},
            { validator: numberLength, trigger: 'blur' },
          ]
        }
      };
    },
    computed: {
      ...mapState(['dialogLogin'])
    },
    methods: {
      loginSubmit(formName){
        //登录
        this.$refs[formName].validate(valid => {
          if(valid){
            this.$myAjax.post(this, '/user/login', this[formName]).then(res => {

            });
          }
        });

      },
      handeGetCode(formName){
        //获取验证码
      },
      handelBeforeClose(done){
        this.set_dialogLogin(false);
        this.isLogin = true;
        done();
      },
      ...mapMutations([set_dialogLogin, set_userInfo]),
      enter(el){
        //登录和找回密码动画bug修复
        let toggleLgoin = this.$refs.toggleLgoin;
        if(el.className.indexOf('loginForm') == -1){
          toggleLgoin.style.height="376px";
        }else{
          toggleLgoin.style.height="216px";
        }
      }
    }
  };
</script>
<style lang="less">
  .loginDialog {
    .el-form-item {
      margin-bottom: 20px;
    }
    .el-dialog {
      min-width: 350px;
      max-width: 400px;
      margin-bottom: 0;
      overflow: hidden;
      .toggleLgoin{
        transition: height .5s ease;
        -webkit-transition: height .5s ease;
        -moz-transition: height .5s ease;
        -ms-transition: height .5s ease;
        -o-transition: height .5s ease;
        height: 216px;
      }
    }
    label {
      font-weight: bold;
    }
    .forgetPassword {
      float: right;
      margin-top: -34px;
    }
    .submit {
      float: right;
    }
    .quickLogin {
      span {
        vertical-align: middle;
        display: inline-block;
      }
      a {
        display: inline-block;
      }
    }
    .recoverItem {
      button {
        width: 60%;
        &:last-child {
          width: 30%;
          float: right;
        }
      }
    }
    .getCode {
      color: #000;
       &:hover {
        color: #20a0ff
      } 
    }
  }
</style>