<template>
  <el-row>
    <el-col :span="20" :gutter="20">
      <article class="articleDetails fmt" v-loading="detailLoading" element-loading-text="拼命加载中">
        <section v-if="currentItem.id">
          <h2>{{currentItem.title}}</h2>
          <el-tag :key="index" :type="typeArr[randomType()]" v-for="(item, index) in currentItem.label">{{item}}</el-tag>
          <template v-if="!!currentItem.author">
            作者：<span>{{currentItem.author}}</span>
          </template>
          <template v-else>
            来源：<span><a :href="currentItem.address">{{currentItem.source}}</a></span>
          </template>
          时间：<time :datetime="currentItem.time">{{currentItem.timeMsg}}</time>
        </section>
        <div v-html="detail" ref="detail"></div>
        <p><strong>转载地址</strong> <a :href="currentItem.address">{{currentItem.address}}</a></p>
      </article>
    </el-col>
    <el-col :span="4">
      <dl v-if="!! directory.length" class="directory">
        <dt>目录</dt>
        <dd v-for="(item, index) in directory" :key="index">{{item}}</dd>
      </dl>
    </el-col>
  </el-row>
</template>
<script type="text/javascript">
  import router from '../router.js';
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
  import { backToTop, formatTime } from '../common/base.js';
  import { set_articleStatus } from '../mutation-types.js';
  let hljs = require('highlight.js');
  export default {
    data() {
      return {
        detailLoading: false,
        detail: '',
        typeArr: ['primary', 'success', 'warning', 'danger'],
        reg: /(<img.*?\ssrc=\")(\/img\/\S*?)((\.png|\.jpg|\.gif|\.jpeg)?)(\")/g,
        articleDatail: null,
        directory: []
      };
    },
    created() {
      this.getDetail();
    },
    computed: {
      ...mapState({
        msg: state => state.articleModule.msg,
        errorCode: state => state.articleModule.errorCode,
        list: state => state.articleModule.list,
      }),
      currentItem: function() {
        if(!this.articleDatail){
          let id = this.$route.query.id,
            data = {};
          if(this.list && this.list.length){
            data = this.list.filter((item, index) => {
              return item.id == id;
            })[0];
          }
          return data;
        }else{
          return this.articleDatail;
        }
      }
    },
    methods: {
      ...mapMutations([set_articleStatus]),
      getDetail() {
        if(!this.$route.query.id){
          router.push({name: 'article', query:{type: 'all'}});
          return false;
        }
        let postData = this.$route.query;
        this.detailLoading = true;
        if(!this.currentItem.id){
          postData.datails = true;
        }
        //获取文章信息
        this.$myAjax.post(this, '/article/articleDatails', postData).then(res => {
          this.detailLoading = false;
          if(res.data.errorCode === 0){
            window.fileData = res.data.data.fileData;
            this.detail = res.data.data.fileData;
            if(res.data.data.articleDatail){
              let articleDatail = res.data.data.articleDatail;
              articleDatail.timeMsg = formatTime(articleDatail.time, true);
              this.articleDatail = articleDatail;
              setTimeout(function(){
                Array.prototype.forEach.call(document.querySelectorAll('pre code'), function(item){
                  hljs.highlightBlock(item);
                });
              }, 0)
            }
          }else{
            this.set_articleStatus({errorCode: res.data.errorCode, msg: res.data.msg});
          }
          if(res.data.errorCode != 0){
            router.back();
          }
        }).catch(error => {
          this.detailLoading = false;
          this.set_articleStatus({msg: '网络错误请重试！', errorCode: error.status});
          router.back();
        });
      },
      randomType(){
        return parseInt(Math.random() * this.typeArr.length);
      }
    },
    watch: {
      detail: function(val){
        if(val){
          setTimeout(() => {
            let list = this.$refs['detail'].getElementsByTagName('h2');
            if(list.length < 2) list = this.$refs['detail'].getElementsByTagName('h3');
            for(let i = 0, leng = list.length; i < leng; i++){
              this.directory.push(list[i].innerText);
            }
          }, 0);
        }
      }
    }
  };
</script>
<style lang="less">
  .articleDetails {
    min-height: 500px;
    padding: 25px;
    box-sizing: border-box;
    section {
      h2 {
        border: none;
        padding-bottom: 5px
      }
      .el-tag {
        margin-right: 5px;
      }
      .author {
        color: #009a61;
        margin-right: 10px;
      }
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    a{
      color: #009a61;
    }
    p strong {
      color: #009a61;
    }
  }
  .directory {
    margin-top: 30px;
    position: fixed;
    dd, dt {
      margin: 5px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
  .fmt pre code{
    background-color: #232323
  }
</style>
