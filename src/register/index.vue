<template>
  <div class="registerMain">
    <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="100px">
      <el-form-item label="用户名：" prop="userName" :error="isuserNameExist"> 
        <el-input v-model="registerForm.userName" placeholder="3~10个字符,包含字母/中文/数字/下划线" :autofocus="true"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="passwrod">
        <el-input v-model="registerForm.passwrod" type="password" placeholder="不少于6位"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="checkpasswrod">
        <el-input v-model="registerForm.checkpasswrod" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email" :error="isEmailExist">
        <el-input v-model="registerForm.email" placeholder="用于找回密码">
          <el-button style="width:110px" slot="append" :class="{ getCode: isGetCode }" @click="handeGetCode" >{{codeText}}</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="验证码：" prop="verificationCode"> 
        <el-input v-model="registerForm.verificationCode"  placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item label="上传头像：" prop="userAvatar">
          <el-upload
            class="avatar-uploader"
            action="/register/upAvatar"
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
      <li><el-button><i class="icon-qq"></i> QQ账户</el-button></li>
      <li><el-button type="success"><i class="icon-github"></i> GITHUB账户</el-button></li>
    </ul>
  </div>
</template>
<script type="text/javascript">
  export default {
    data() {
      let checkpasswrod = (rule, value, callback) => {
        if (value !== this.registerForm.passwrod) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },
      userNameExist = (rule, value, callback) => {
        this.$myAjax.post(this, '/register/userNameExist', {
          userName: value
        }).then((res) => {
          if(!res.data.errorCode){
            callback();
          }else{
            callback(new Error('用户名以存在，请重新输入'));
          }
        }).catch(error => {
          callback();
        });
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
        isuserNameExist: '',
        isEmailExist: '',
        registerForm: {
          userName: '',
          passwrod: '',
          checkpasswrod: '',
          email: '',
          verificationCode: ''
        },
        rules: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur'},
            { type:'string', pattern: /^[\u4e00-\u9fa5\w]{3,10}$/, message: '请输入正确格式的用户名', trigger: 'blur'},
            { validator: userNameExist, trigger: 'blur'}
          ],
          passwrod:[
            { required: true, message: '密码不能不为空', trigger: 'blur'},
            { min: 6, message: '密码不能少于6个字符', trigger: 'blur'}
          ],
          checkpasswrod:[
            { required: true, message: '确认密码不能为空', trigger: 'blur'},
            { validator: checkpasswrod, trigger: 'blur' }
          ],
          email:[
            { required: true, message: '邮箱不能为空', trigger: 'blur'},
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
          ],
          verificationCode:[{ required: true, message: '验证码不能为空', trigger: 'blur'}]
        }
      };
    },
    methods: {
      handeGetCode (){
        //获取验证码
        if(!this.isGetCode){
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
        this.$myAjax.post(this, '/register/getEmailCode', {
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
          this.errorCode = -4;
          this.msg = '网络错误，请重试';
          restStatus();
        });
      },
      handleAvatarSuccess(res, file) {
        this.userAvatar = URL.createObjectURL(file.raw);
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
        /*this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });*/
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
    },
  };
</script>
<style lang="less">
  .registerMain {
    display: table;
    margin: 0 auto;
    padding: 25px 25px 0;
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
      button {
        width: 100%;
        margin: 10px 0;
        span {
          display: block;
        }
        i {
          display: inline-block;
          vertical-align: middle;
          width: 28px;
          height: 28px;
          background-repeat: no-repeat;
          background-image: url(/images/login.svg);
        }
        .icon-qq {
          background-position: -84px -28px;
        }
        .icon-github {
          background-position: -28px -28px;
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