<template>
  <el-dialog :title="title" :visible.sync="dialogLogin" :lock-scroll="false" size="tiny" class="loginDialog">
    <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="top">
      <el-form-item label="用户名 或 邮箱" prop="userName"> 
        <el-input v-model="loginForm.userName" placeholder="请输入用户名或邮箱"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="passwrod">
        <el-button type="text" class="forgetPassword">忘记密码</el-button>
        <el-input v-model="loginForm.passwrod" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="remember">记住登录状态</el-checkbox>
        <el-button type="success" class="submit" @click="submitForm('loginForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
  export default {
    data() {
      return {
        dialogLogin: true,
        title: '用户登录',
        remember: true,
        loginForm: {
          userName: '',
          password: ''
        },
        loginRules:{
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          passwrod:[
            { required: true, message: '请输入密码', trigger: 'blur'},
            { min: 6, message: '密码不能少于6个字符', trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      submitForm(formName){

      }
    }
  };
</script>
<style lang="less">
  .loginDialog {
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
  }
</style>