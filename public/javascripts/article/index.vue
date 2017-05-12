<template>
  <div class="articleList">
    <link rel="stylesheet" href="https://static.segmentfault.com/v-58fb6746/global/css/global.css">
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
    <div class="maxWidth barParent">
      <router-view></router-view>  
      <div class="bar">
        <div class="childBar"></div>
      </div>
    </div>
    
  </div>
</template>
<script type="text/javascript">
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
  export default {
    data() {
      return {
        oldSearch: ''
      };
    },
    computed:{
      ...mapState({
        activeIndex: state => state.articleModule.activeIndex,
        currentPage: state => state.articleModule.currentPage,
        search: state => state.articleModule.search,
        type: state => state.articleModule.type,
      }),
    },
    methods: {
      ...mapActions([
        'get_articleList' 
      ]),
      ...mapMutations([
        'set_articleStatus'
      ]),
      //input搜索
      handleSearchClick(){
        if(this.oldSearch == this.search){
          if(this.currentPage != 1){
            this.set_articleStatus({currentPage: 1});
          }else{
            this.get_articleList({currentPage:1, type: this.type, search: this.search});
          }
        }else{
          this.$router.push({ path: '/article', query: {type: 'all', search: this.search}});
        }
        this.oldSearch = this.search;
      },
      handleInputChange(value){
        this.set_articleStatus({search: value});
      },
      handleSelect(index){
        this.set_articleStatus({search: ''});
        if(this.activeIndex == index){
          if(this.currentPage == 1){
            this.get_articleList({currentPage:1, type: this.type});
          }else{
            this.set_articleStatus({currentPage: 1});
          }
        }
      }
    }
  };
</script>
<style lang="less">
  .articleList {
    .articleHeader {
      background-color: #eef1f6;
    }
    .barParent {
      position: relative;
      .bar {
        background-color: #F2F2F2;
        height: 100%;
        width: 7px;
        position: absolute;
        top:0; right: 4px;
        .childBar {
          width: 100%;
          height: 100px;
          background-color: #398FE6;
          position: absolute;
        }
      }
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