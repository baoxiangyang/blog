<template>
  <div class="maxWidth messageWall" :style="wallStyle" ref="messageWall">
    <el-button :plain="true" type="success" class="addMessage" 
      @click="createMessage = true">快来留言吧</el-button>
    <el-dialog
      title="创建留言" class="addDialog"
      :visible.sync="createMessage">
      <el-form :inline="false" :model="createForm" :rules="createRules" ref="createForm">
        <el-form-item label="风格">
          <el-select v-model="createForm.type" placeholder="请选择风格">
            <el-option
              v-for="item in noteType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="背景颜色">
          <el-color-picker color-format="rgb" v-model="createForm.bgColor"></el-color-picker>
          <span class="fontSpan">字体颜色</span>
          <el-color-picker color-format="rgb" v-model="createForm.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="内容" prop="content" :rules="[
            { required: true, message: '留言内容不能为空'},
            {max: 220, message: '留言内容不能超过200个字', trigger: 'blur'}
          ]">
          <el-input type="textarea" @change="contentChange" v-model="createForm.commenter.content" placeholder="请输入留言"></el-input>
        </el-form-item>
        <el-form-item label="预览">
          <Note :option="createForm"
            v-if="createForm.commenter.userInfo.userName"></Note>
        </el-form-item>
        <el-form-item class="createBtns">
          <el-button type="primary" @click="onSubmit('createForm')">创建</el-button>
          <el-button @click="resetForm('createForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <Note v-for="(item, index) in noteList" :key="index" 
      :option="item"  @clickComment="handleComment"
    ></Note>
  </div>
</template>
<script type="text/javascript">
  import {formatTime} from '../common/base.js';
  import Note from './note.vue';
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
  export default {
    name: 'messageBoard',
    data() {
      return {
        createMessage: false,
        createForm: {
          bgColor: 'rgb(206, 190, 75)',
          color: 'rgb(0, 0, 0)',
          type: 'paper',
          id:1234,
          btn: {
            edit: true,
            delete:true,
            comment: true
          },
          content: '',
          commenter: {
            userInfo: {},
            content: '',
            time: formatTime(Date.now(), null, true)
          }
        },
        createRules: {
          
        },
        noteType: [{label: '风格一', value: 'paper'}, 
            {label: '风格二', value: 'message'},
            {label: '风格三', value: 'messageTop'}
          ],
        wallStyle: {
          height: null
        }
      };
    },
    created(){
      let clientHeight = document.documentElement.clientHeight || window.innerHeight;
      if(clientHeight > 560){
        this.wallStyle.height = clientHeight - 60 + 'px';
      }
    },
    computed: {
      ...mapState({
        userInfo: state => state.userInfo
      }),
      ...mapGetters(['noteList'])
    },

    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) =>{
          if(valid){
            this.$myAjax.post(this, '/messageWall/message', this.createForm).then(res => {
              console.log(res);
            });
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.createMessage = false;
      },
      contentChange(val){
        this.createForm.content = val;
      },
      handleComment(val){
        this.$prompt('请输入评论内容', '评论', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.{5,}/,
          inputErrorMessage: '评论内容不能少于5个字'
        }).then(({ value }) => {
          console.log(value);
        });
      },
      ...mapActions(['get_messageList']),
      ...mapMutations(['set_messageState'])
    },
    mounted (){
      let messageWall = window.getComputedStyle(this.$refs['messageWall'], null);
      this.set_messageState({
        heightTop: parseInt(messageWall.height),
        widthLeft: parseInt(messageWall.width)
      });
    },
    beforeRouteEnter(to, from, next){
      next(vm => vm.get_messageList());
    },
    watch: {
      userInfo (val){
        this.createForm.commenter.userInfo = val;
        this.set_messageState({userInfo: val});
      }
    },
    components: {
      Note
    }
  };
</script>
<style lang="less">
  .messageWall {
    position: relative;
    min-height: 500px;
    .addMessage {
      position: absolute;
      top:25px;
      right: 0;
      span{
        writing-mode: tb-rl;
      }
    }
    .addDialog {
      .el-dialog {
        width: 400px;
        form {
          .fontSpan {
            margin-left: 5px;
            margin-right: 10px;
            vertical-align: super;
          }
          .note {
            margin-left: 20px;
            p {
              line-height: 20px;
            }
          }
          textarea {
            height: 80px;
            resize: none;
          }
          .createBtns {
            text-align: right;
          }
        }
      }
    }
  }
</style>
