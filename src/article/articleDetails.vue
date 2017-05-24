<template>
  <article class="articleDetails fmt" v-loading="detailLoading" element-loading-text="拼命加载中">
    <section v-if="currentItem.id">
      <h2>{{currentItem.title}}</h2>
      <el-tag key="index" :type="typeArr[randomType()]" v-for="(item, index) in currentItem.label">{{item}}</el-tag>
      <template v-if="!!currentItem.author">
        作者：<span>{{currentItem.author}}</span>
      </template>
      <template v-else>
        来源：<span><a :href="currentItem.address">{{currentItem.source}}</a></span>
      </template>
      时间：<time :datetime="currentItem.time">{{currentItem.timeMsg}}</time>
    </section>
    <div v-html="detail"></div>
    <p><strong>转载地址</strong> <a :href="currentItem.address">{{currentItem.address}}</a></p>
  </article>
</template>
<script type="text/javascript">
  import router from '../router.js';
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
  import { backToTop, formatTime } from '../base.js';
  export default {
    data() {
      return {
        detailLoading: false,
        detail: '',
        typeArr: ['primary', 'success', 'warning', 'danger'],
        reg: /(src=\")(\/img\/)/g,
        articleDatail: null
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
      ...mapMutations([
        'set_articleStatus'
      ]),
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
        this.$http.post('/api/articleDatails', postData).then(res => {
          this.detailLoading = false;
          console.log(123);
          if(res.data.errorCode === 0){
            this.detail = res.data.data.fileData.replace(this.reg, '$1https://segmentfault.com$2');
            if(res.data.data.articleDatail){
              let articleDatail = res.data.data.articleDatail;
              articleDatail.timeMsg = formatTime(articleDatail.time, true);
              this.articleDatail = articleDatail;
            }
          }else{
            this.set_articleStatus({errorCode: res.data.errorCode, msg: res.data.msg});
          }
        }).catch(error => {
          this.detailLoading = false;
          this.set_articleStatus({msg: '网络错误请重试！', errorCode: error.status});
        });
      },
      randomType(){
        return parseInt(Math.random() * this.typeArr.length);
      }
    },
    watch: {
      errorCode: function  (val, oldVal) {
        if(val != 0){
          this.$message({
            showClose: true,
            message: this.msg, 
            type: 'error'
          });
          this.set_articleStatus({errorCode: 0});
          router.go(-1);
        }
      }
    },
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
</style>