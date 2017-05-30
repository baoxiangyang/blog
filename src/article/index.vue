<template>
  <div class="articleList">
    <link rel="stylesheet" href="/stylesheets/github.css">
    <div class="articleHeader">
      <el-menu :default-active="activeIndex" :router="true" @select="handleSelect" class="articleNav maxWidth" mode="horizontal">
        <el-menu-item index="/article?type=all">全部</el-menu-item>
        <el-menu-item index="/article?type=javascript">javascript</el-menu-item>
        <el-menu-item index="/article?type=html">html</el-menu-item>
        <el-menu-item index="/article?type=css">css</el-menu-item>
        <el-menu-item index="/article?type=webpack">webpack</el-menu-item>
        <el-menu-item index="/article?type=gulp">gulp</el-menu-item>
        <el-menu-item index="/article?type=node">node</el-menu-item>
        <el-menu-item index="/article?type=vue">vue</el-menu-item>
        <el-menu-item index="/article?type=react">react</el-menu-item>
        <el-menu-item index="/article?type=other">其他</el-menu-item>
        <el-input class="search" icon="search" v-model="search" :on-icon-click="handleSearchClick" placeholder="搜索" size="small" @change="handleInputChange"></el-input>
      </el-menu>
    </div>
    <div class="maxWidth">
      <router-view></router-view>  
    </div>
    <BackTop></BackTop>
  </div>
</template>
<script type="text/javascript">
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
  import backToTop from '../components/backToTop.vue';
  export default {
    data() {
      return {
        oldSearch: undefined
      };
    },
    computed:{
      ...mapState({
        activeIndex: state => state.articleModule.activeIndex,
        search: state => state.articleModule.search,
        type: state => state.articleModule.type,
        msg: state => state.articleModule.msg,
        errorCode: state => state.articleModule.errorCode
      }),
    },
    methods: {
      ...mapMutations([
        'set_articleStatus'
      ]),
      //input搜索
      handleSearchClick(){
        if(this.oldSearch === this.search){
          return false;
        }
        this.oldSearch = this.search;
        this.$router.push({ name: 'article', query: {type: 'all', search: this.search}});
        
      },
      handleInputChange(value){
        this.set_articleStatus({search: value});
      },
      handleSelect(index){
        this.oldSearch = undefined;
        this.set_articleStatus({search: ''});
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        (to.name == 'articleList') && vm.set_articleStatus({
          activeIndex: `/article?type=${to.query.type || 'all'}`, 
          type: to.query.type || 'all', 
          search: to.query.search
        });
      });
    },
    beforeRouteUpdate(to, from, next){
      (to.name == 'articleList') && this.set_articleStatus({
        activeIndex: `/article?type=${to.query.type}`, 
        type: to.query.type, 
        search: to.query.search
      });
      next();
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
        }
      }
    },
    components: {
      BackTop: backToTop
    }
  };
</script>
<style lang="less">
  .articleList {
    .articleHeader {
      background-color: #eef1f6;
    }
    .articleNav{
      li{
        height: 40px;
        line-height: 40px;
      }
      .search {
        max-width: 200px;
        float: right;
        margin-right: 25px;
        margin-top: 5px;
      }
    }
  }
</style>