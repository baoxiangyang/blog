<template>
  <div class="maxWidth articleDetails fmt" v-loading="detailLoading" element-loading-text="拼命加载中">
    <link rel="stylesheet" href="https://static.segmentfault.com/v-58fb6746/global/css/global.css">
    <div v-html="detail"></div>
  </div>
</template>
<script type="text/javascript">
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
  import { backToTop } from '../base.js';
  export default {
    data() {
      return {
        detailLoading: false,
        detail: ''
      };
    },
    created() {
      this.getDetail();
    },
    computed: {
      ...mapState({
        error: state => state.articleModule.error,
        errorMsg: state => state.articleModule.errorMsg,
        errorCode: state => state.articleModule.errorCode,
      })
    },
    methods: {
      ...mapMutations([
        'set_articleStatus'
      ]),
      getDetail() {
        this.detailLoading = true;
        //获取文章信息
        this.$http.post('/api/articleDatails', this.$route.params).then(res => {
          this.detailLoading = false;
          if(!res.data.error){
            this.detail = res.data.data;
          }else{
            this.set_articleStatus({error: res.data.error, errorMsg: res.data.msg});
          }
        }).catch(error => {
          this.detailLoading = false;
          this.set_articleStatus({error: true, errorMsg: '网络错误请重试！', errorCode: error.status});
        });
      }
    }

  };
</script>
<style lang="less">
  .articleDetails {
    min-height: 500px;
    padding: 25px;
    box-sizing: border-box;
  }
</style>