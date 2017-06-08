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
          <el-form-item label="密码" prop="password" :error="loginText">
            <el-button type="text" class="forgetPassword" @click="isLogin = false">忘记密码</el-button>
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="loginForm.remember">记住登录状态</el-checkbox>
            <el-button type="success" :disabled="loginBtn" class="submit" @click="loginSubmit('loginForm')">登录</el-button>
          </el-form-item>
        </el-form>
        <el-form v-else key="recover" :model="recoverForm" :rules="recoverRules" ref="recoverForm" label-position="top">
          <el-form-item label="邮箱" prop="email" :error="isEmailExist"> 
            <el-input v-model="recoverForm.email" placeholder="请输入用邮箱地址"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="verificationCode">
            <el-input v-model.number="recoverForm.verificationCode" placeholder="请输入验证码">
              <el-button style="width:110px" slot="append" :class="{ getCode: isGetCode }" @click="handleGetCode('recoverForm')" >{{codeText}}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input v-model="recoverForm.password" type="password" placeholder="不少于6位"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="checkpassword">
            <el-input v-model="recoverForm.checkpassword" type="password" placeholder="确认密码"></el-input>
          </el-form-item>
          <el-form-item class="recoverItem">
            <el-button type="danger" :disabled="recoverBtn" @click="handleRecoverPassword('recoverForm')">重置密码</el-button>
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
      let checkpassword = (rule, value, callback) => {
        if (value !== this.recoverForm.password) {
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
        loginText: '',
        isGetCode: true,
        isEmailExist: '',
        errorCode: '',
        msg: '',
        loginBtn: false,
        recoverBtn: false,
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
          checkpassword:[
            { required: true, message: '请确认密码', trigger: 'blur'},
            { validator: checkpassword, trigger: 'blur' }
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
            this.loginBtn = true;
            this.$myAjax.post(this, '/user/login', this[formName]).then(res => {
              if(res.data.errorCode){
                this.errorCode = res.data.errorCode;
                this.msg = res.data.msg;
              }else if(!res.data.errorCode && res.data.data){
                this.set_userInfo(res.data.data);
                this.set_dialogLogin(false);
                if(this.$route.name == 'register'){
                  this.$router.push({name: 'index'});
                }
              }else{
                this.loginText = res.data.msg;
              }
              this.loginBtn = false;
            }).catch(error => {
              this.loginBtn = false;
            });
          }
        });
      },
      handleGetCode(formName){
        //获取验证码
        this.isEmailExist = '';
        this.$refs[formName].validateField('email', (err) => {
          if(!this.isGetCode || err){
            return false;
          }
          let number = 60, interval,
            restStatus = () => {
              clearInterval(interval);
              interval = null;
              this.isGetCode = true;
              this.codeText = '获取验证码';
            };
          clearInterval(interval);
          this.isGetCode = false;
          this.codeText = `${number}s后再获取`;
          interval = setInterval(() => {
            number -= 1;
            this.codeText = `${number}s后再获取`;
            if(number <= 0){
              restStatus();
            }
          }, 1000);
          //获取验证码
          this.$myAjax.post(this, '/user/getEmailCode', {
            email: this.recoverForm.email,
            recover: true
          }).then((res) => {
            this.errorCode = res.data.errorCode;
            if(this.errorCode){
              restStatus();
              this.isEmailExist = res.data.msg;
            }else {
              this.isEmailExist = '';
              this.msg = res.data.msg;
            }
          }).catch((error)=> {
            restStatus();
          });
        });
      },
      handleRecoverPassword(formName){
        this.$refs[formName].validate(valid => {
          if(valid){
            this.recoverBtn = true;
            this.$myAjax.post(this, '/user/recoverPassword', this[formName]).then(res => {
              if(!res.data.errorCode){
                this.isLogin = true;
              }
              this.errorCode = res.data.errorCode;
              this.msg = res.data.msg;
              this.recoverBtn = false;
            }).catch(error => {
              this.recoverBtn = false;
            });
          }
        });
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