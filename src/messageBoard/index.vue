<template>
  <div class="maxWidth messageWall" :style="wallStyle">
    <el-button :plain="true" type="success" class="addMessage" 
      @click="createMessage = true">快来留言吧</el-button>
    <el-dialog
      title="创建留言" class="addDialog"
      :visible.sync="createMessage">
      <el-form :inline="false" :model="createForm">
        <el-form-item label="风格">
          <el-select v-model="createForm.type" placeholder="请选择风格" @change="noteTypeChange">
            <el-option
              v-for="item in noteType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="背景颜色">
          <el-color-picker v-model="createForm.bgColor"></el-color-picker>
          <span class="fontSpan">字体颜色</span>
          <el-color-picker v-model="createForm.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="createForm.commenter.content" placeholder="请输入留言"></el-input>
        </el-form-item>
        <el-form-item label="预览">
          <Note :option="createForm" v-if="createForm.commenter.userInfo.userName"></Note>
        </el-form-item>
      </el-form>
  </el-dialog>
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
        createMessage: true,
        createForm: {
          bgColor: 'rgb(206, 190, 75)',
          color: '#000',
          type: 'paper',
          noBtn: true,
          commenter: {
            userInfo: {},
            content: '',
            time: formatTime(Date.now(), null, true)
          }
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
      })
    },
    methods: {
      noteTypeChange (){}
    },
    watch: {
      userInfo (val){
        this.createForm.commenter.userInfo = val;
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
        }
      }
    }
  }
</style>