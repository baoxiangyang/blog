<template>
  <div class="maxWidth crawlerMain">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top" >
      <el-form-item label="Cookie：">
        <el-input v-model="form.cookie"></el-input>
      </el-form-item>
      <el-form-item label="Password：">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="文章url：" prop="url">
        <el-input type="textarea" v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
        <el-button @click="getLog">日志</el-button>
      </el-form-item>
      <pre class="log">
        {{logData}}
      </pre>
    </el-form>
  </div>
</template>
<script type="text/javascript">
  export default {
    data() {
      return {
        form: {
          cookie: '',
          url: '',
          password: ''
        },
        logData: '',
        rules: {
          url: [{ required: true, message: '请输入文章地址，用 ”," 分割'}],
          password: [{ required: true, message: '请输入密码'}]
        }
      };
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            let urlArr = null;
            if(this.form.url.indexOf('[{') != -1){
                try{
                  urlArr = JSON.parse(this.form.url);
                }catch(e){
                  this.$message({
                    showClose: true,
                    message: 'url解析失败',
                    type: 'error'
                  });
                  console.log(e);
                  return false;
                }
            }
            this.postAddress(urlArr);
          }
        });
      },
      postAddress(urlArr) {
        this.$myAjax.post(this, '/api/crawlerArticle', {
          cookie: this.form.cookie,
          url: urlArr ? urlArr : this.form.url,
          password: this.form.password
        }).then(res => {
          if(res.data.errorCode == 0){
            this.$message({
              showClose: true,
              message: '指令下发成功',
              type: 'success'
            });
          }else{
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'error'
            });
          }
        }).catch(err => {
          this.$message({
            showClose: true,
            message: '爬取文章失败，请稍后再试',
            type: 'error'
          });
        });
      },
      getLog() {
        this.$myAjax.post(this, '/api/articleLog').then(res => {
          this.logData = res.data.data;
        }).catch(err => {
          this.$message({
            showClose: true,
            message: '获取日志失败，请稍后再试',
            type: 'error'
          });
        });
      }
    }
  };
</script>
<style lang="less">
  .crawlerMain {
    padding: 25px;
    box-sizing: border-box;
    form {
      width: 500px;
      margin: 25px auto;
      textarea {
        height: 100px;
      }
    }
  }
</style>