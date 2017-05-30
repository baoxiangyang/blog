<template>
  <div class="maxWidth">
    <el-row :gutter="20" class="registerMain">
      <el-col :md="10" :sm="12">
        <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="100px">
          <el-form-item label="用户名：" prop="name"> 
            <el-input v-model="registerForm.userName" placeholder="请输入内容" :autofocus="true"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="passwrod">
            <el-input v-model="registerForm.passwrod"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="passwrod2">
            <el-input v-model="registerForm.passwrod2"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-radio-group v-model="registerForm.sex">
              <el-radio :label="1">帅哥</el-radio>
              <el-radio :label="0">美女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="registerForm.email">
              <el-button slot="append" class="getCode">获取验证码</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码：" prop="verificationCode"> 
            <el-input v-model="registerForm.verificationCode"></el-input>
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
            <el-button type="primary" @click="submitForm('registerForm')">注册</el-button>
            <el-button @click="resetForm('registerForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :md="14" :sm="12">
        
      </el-col>
    </el-row>
  </div>
</template>
<script type="text/javascript">
  export default {
    data() {
      return {
        registerForm: {
          userName: '',
          passwrod: '',
          passwrod2: '',
          sex: 1,
          email: '',
          userAvatar: ''
        },
        rules: {

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
    padding: 25px 25px 0
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