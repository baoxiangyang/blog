<template>
  <el-dialog :title="isLogin ? '用户登录' : '找回密码'" :visible.sync="dialogLogin" :lock-scroll="false" size="tiny" class="loginDialog" :before-close="handelBeforeClose">
    <transition name="slide-fade" mode="out-in">
      <el-form v-if="isLogin" key="lgoin" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="top">
        <el-form-item label="用户名 或 邮箱" prop="userName"> 
          <el-input v-model="loginForm.userName" placeholder="请输入用户名或邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passwrod">
          <el-button type="text" class="forgetPassword" @click="isLogin = false">忘记密码</el-button>
          <el-input v-model="loginForm.passwrod" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住登录状态</el-checkbox>
          <el-button type="success" class="submit" @click="submitForm('loginForm')">登录</el-button>
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
  import { set_dialogLogin } from '../mutation-types.js';
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
          passwrod: '',
          checkpasswrod: ''
        },
        loginRules:{
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          passwrod:[
            { required: true, message: '请输入密码', trigger: 'blur'},
            { min: 6, message: '密码不能少于6个字符', trigger: 'blur'}
          ]
        },
        recoverRules: {
          passwrod:[
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
      submitForm(formName){

      },
      handeGetCode(formName){

      },
      handelBeforeClose(done){
        this.set_dialogLogin(false);
        done();
      },
      ...mapMutations([set_dialogLogin])
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
      margin-bottom: 0;
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
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-active {
    transform: translateX(10px);
    opacity: 0;
  }
</style>