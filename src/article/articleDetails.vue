<template>
  <article class="articleDetails fmt" v-loading="detailLoading" element-loading-text="拼命加载中">
    <section>
      <h2>{{currentItem.title}}</h2>
      <el-tag key="index" :type="typeArr[randomType()]" v-for="(item, index) in currentItem.label">{{item}}</el-tag>
      作者：<strong class="author">{{currentItem.author}}</strong>
      时间：<time :datetime="currentItem.time">{{currentItem.timeMsg}}</time>
    </section>
    <div v-html="detail"></div>
    <p><strong>转载地址</strong> <a :href="currentItem.address">{{currentItem.address}}</a></p>
  </article>
</template>
<script type="text/javascript">
  import router from '../router.js';
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
  import { backToTop } from '../base.js';
  export default {
    data() {
      return {
        detailLoading: false,
        detail: '',
        typeArr: ['primary', 'success', 'warning', 'danger'],
        reg: /(src=\")(\/img\/)/g
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
        let id = this.$route.params.id;
        return this.list.filter((item, index) => {
          return item.id == id;
        })[0];
      }
    },
    methods: {
      ...mapMutations([
        'set_articleStatus'
      ]),
      getDetail() {
        if(!this.$route.params.id){
          router.push({name: 'article', query:{type: 'all'}});
          return false;
        }
        this.detailLoading = true;
        //获取文章信息
        this.$http.post('/api/articleDatails', this.$route.params).then(res => {
          this.detailLoading = false;
          if(!res.data.error){
            this.detail = res.data.data.replace(this.reg, '$1https://segmentfault.com$2');
          }else{
            this.set_articleStatus({error: res.data.error, errorMsg: res.data.msg});
          }
        }).catch(error => {
          this.detailLoading = false;
          this.set_articleStatus({error: true, errorMsg: '网络错误请重试！', errorCode: error.status});
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