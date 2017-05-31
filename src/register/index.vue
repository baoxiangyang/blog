<template>
  <div class="registerMain">
    <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="100px">
      <el-form-item label="用户名：" prop="userName"> 
        <el-input v-model="registerForm.userName" placeholder="3~10个字符,包含字母/中文/数字/下划线" :autofocus="true"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="passwrod">
        <el-input v-model="registerForm.passwrod" type="password" placeholder="不少于6位"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="checkpasswrod">
        <el-input v-model="registerForm.checkpasswrod" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="registerForm.email" placeholder="用于找回密码">
          <el-button slot="append" class="getCode" >获取验证码</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="验证码：" prop="verificationCode"> 
        <el-input v-model="registerForm.verificationCode" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item label="上传头像：" prop="userAvatar">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
          <img v-if="registerForm.userAvatar" :src="registerForm.userAvatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('registerForm')" style="width:200px">注 册</el-button>
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
        if (value === '') {
          callback(new Error('确认密码不能为空'));
        } else if (value !== this.registerForm.passwrod) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        registerForm: {
          userName: '',
          passwrod: '',
          checkpasswrod: '',
          email: '',
          verificationCode: '',
          userAvatar: ''
        },
        rules: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur'},
            { type:'string', min: 3, max: 10, pattern: /^[0-9A-Za-z_\u0000-\u00FF]$/, message: '请输入正确格式的用户名', trigger: 'blur'}
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
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>
<style lang="less">
  .registerMain {
    display: table;
    margin: 0 auto;
    padding: 25px 25px 0;
    .el-form {
      width: 60%;
      display: inline-block;
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