<template>
  <div class="registerMain">
    <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="100px">
      <el-form-item label="用户名：" prop="userName" :error="isUserNameExist"> 
        <el-input v-model="registerForm.userName" placeholder="3~10个字符,包含字母/中文/数字/下划线" :autofocus="true" @change="userNameChange"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="registerForm.password" type="password" placeholder="不少于6位"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="checkpassword">
        <el-input v-model="registerForm.checkpassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email" :error="isEmailExist">
        <el-input v-model="registerForm.email" placeholder="请输入邮箱地址，用于找回密码"></el-input>
      </el-form-item>
      <el-form-item label="验证码：" prop="verificationCode" :error="codeErrorText"> 
        <el-input v-model.number="registerForm.verificationCode"  placeholder="请输入验证码">
          <el-button style="width:110px" slot="append" :class="{ getCode: isGetCode }" @click="handeGetCode('registerForm')" >{{codeText}}</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="上传头像：" prop="userAvatar">
          <el-upload
            class="avatar-uploader"
            action="/user/upAvatar"
            :show-file-list="false"
            accept="image/*"
            :with-credentials="true"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="handleAvatarError"
            name="userAvatar"
          >
          <img v-if="userAvatar" :src="userAvatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" v-loading="userAvatarUpload"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="submitBtn" @click="submitForm('registerForm')" style="width:200px">{{submitText}}</el-button>
        <el-button @click="resetForm('registerForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <ul class="loginList">
      <li>快速登录</li>
      <li><a href="/authLogin.html?type=QQ"><el-button><i class="myIcon myIcon-qq"></i> QQ账户</el-button></a></li>
      <li><a href="/authLogin.html?type=GITHUB"><el-button type="success"><i class="myIcon myIcon-github"></i> GITHUB账户</el-button></a></li>
    </ul>
  </div>
</template>
<script type="text/javascript">
  import '../style/user.less';
  import { set_dialogLogin} from '../mutation-types.js';
  import { mapState, mapMutations } from 'vuex';
  export default {
    data() {
      let checkpassword = (rule, value, callback) => {
        if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },
      userNameExist = (rule, value, callback) => {
        if(this.noUserNameExist){
          callback();
          return false;
        }
        this.$myAjax.post(this, '/user/userNameExist', {
          userName: value
        }).then((res) => {
          if(!res.data.errorCode){
            //校验成功后不在向后台发送校验，除非value发生改变在校验
            this.noUserNameExist = true;
            callback();
          }else{
            callback(new Error('用户名以存在，请重新输入'));
          }
        }).catch(error => {
          callback();
        });
      },
      numberLength = (rule, value, callback) => {
        if (value.toString().length !== 6) {
          callback(new Error('请输入6位数字验证码'));
        }else{
          callback();
        }
      };
      return {
        codeText: '获取验证码',
        userAvatarUpload: false,
        submitBtn: false,
        submitText: '注 册',
        isGetCode: true,
        userAvatar: '',
        msg: '',
        errorCode: '',
        isUserNameExist: '',
        isEmailExist: '',
        codeErrorText: '',
        noUserNameExist: false,
        registerForm: {
          userName: '',
          password: '',
          checkpasswrod: '',
          email: '',
          verificationCode: '',
          userAvatar: ''
        },
        rules: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur'},
            { type:'string', pattern: /^[\u4e00-\u9fa5\w]{3,10}$/, message: '请输入正确格式的用户名', trigger: 'blur'},
            { validator: userNameExist, trigger: 'blur'}
          ],
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
    methods: {
      ...mapMutations([set_dialogLogin]),
      userNameChange(){
        //userName发生改变后，继续校验username在后台是否存在
        this.noUserNameExist = false;
      },
      handeGetCode (formName){
        this.isEmailExist = '';
        //通过校验之后获取验证码
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
            email: this.registerForm.email
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
      handleAvatarSuccess(res, file) {
        let createObjectURL = function(blob){
          return window[window.webkitURL ? 'webkitURL' : 'URL']['createObjectURL'](blob);
        };
        this.userAvatar = createObjectURL(file.raw);
        this.registerForm.userAvatar = res.avatarImg;
        this.userAvatarUpload = false;
        this.submitBtn = false;
        this.submitText = '注 册';
      },
      beforeAvatarUpload(file){
        let isImage = /^image\//.test(file.type),
          isSize = file.size / 1000 < 500;
          if (!isImage) {
            this.$message.error('上传头像只能是图片!');
            return false;
          }
          if (!isSize) {
            this.$message.error('上传头像图片大小不能超过 500K!');
            return false;
          }
          this.userAvatarUpload = true;
          this.submitBtn = true;
          this.submitText = '上传头像请稍后。。。';
        return true;
      },
      handleAvatarError(err, file) {
        this.$message.error('头像上传失败请重试!');
        this.userAvatarUpload = false;
        this.submitBtn = false;
        this.submitText = '注 册';
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitBtn = true;
            this.$myAjax.post(this, '/user/register', this.registerForm).then(res => {
              let result = res.data;
              switch (result.errorCode) {
                case 0:
                  this.errorCode = 0;
                  this.$notify({
                    title: '成功',
                    message: '注册成功请登录',
                    type: 'success',
                    duration: 1500,
                    onClose:() => {
                      this.set_dialogLogin(true);
                    }
                  });
                  break;
                case -1:
                  this.msg = result.msg;
                  this.errorCode = result.errorCode;
                  break;
                case -8:
                  this.codeErrorText = result.msg;
                  break;
                case -9:
                  result.data.forEach((item, index) => {
                    if(item.name =='userName'){
                      this.isUserNameExist = item.msg;
                    }
                    if(item.name =='email'){
                      this.isEmailExist = item.msg;
                    }
                  });
                  break;
                default:
                  console.log(result);
                  break;
              }
              this.submitBtn = false;
            });
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
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
  .registerMain {
    display: table;
    margin: 0 auto;
    padding: 50px 25px 0;
    .el-form {
      width: 60%;
      min-width:400px;
      display: inline-block;
      .getCode {
        color: #000;
         &:hover {
          color: #20a0ff
        } 
      }
    }
    .loginList {
      display: inline-block;
      vertical-align: top;
      margin-left: 100px;
      li:first-child {
        font-weight: bold;
      }
      button {
        width: 100%;
        margin: 10px 0;
        span {
          display: block;
        }
      }
    }

  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .el-upload__input {
      display: none;
    }
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
</style>