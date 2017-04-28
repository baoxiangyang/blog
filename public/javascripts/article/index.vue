<template>
  <div class="articleList">
    <div class="articleHeader">
      <el-menu :default-active="activeIndex" class="articleNav maxWidth" mode="horizontal" @select="handleSelect">
        <el-menu-item index="all">全部</el-menu-item>
        <el-menu-item index="javascript">javascript</el-menu-item>
        <el-menu-item index="html">html</el-menu-item>
        <el-menu-item index="css">css</el-menu-item>
        <el-menu-item index="webpack">webpack</el-menu-item>
        <el-menu-item index="gulp">gulp</el-menu-item>
        <el-menu-item index="node">node</el-menu-item>
        <el-menu-item index="vue">vue</el-menu-item>
        <el-menu-item index="react">react</el-menu-item>
        <el-menu-item index="other">其他</el-menu-item>
        <el-input class="search" icon="search" v-model="searchData" :on-icon-click="handleSearchClick" placeholder="搜索" size="small"></el-input>
      </el-menu>
    </div>
    <el-row :gutter="20" class="articleLayout maxWidth" v-loading="loading"
    element-loading-text="拼命加载中">
      <el-col :span="20">
        <articleItem  v-for="item in list" key="item.id" :detailsData="item"></articleItem>
        <p v-show="!list.length" class="nodata">暂无数据</p>
      </el-col>
      <el-col :span="4">
        <el-button type="text">发布文章</el-button>
      </el-col>
      <el-col :span="24" class="page maxWidth" v-show="list.length">
        <el-pagination 
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next">
        </el-pagination>
      </el-col>
    </el-row>
    
  </div>
</template>
<script type="text/javascript">
  import articleItem from '../components/articleItem.vue';
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
  import { backToTop } from '../base.js';
  export default {
    data() {
      return {
        activeIndex: 'all',
        searchData: ''
      };
    },
    computed: {
      ...mapState({
        currentPage: state => state.articleModule.currentPage,
        pageSize: state => state.articleModule.pageSize,
        total: state => state.articleModule.total,
        loading: state => state.articleModule.loading,
        error: state => state.articleModule.error,
        errorMsg: state => state.articleModule.errorMsg,
        errorCode: state => state.articleModule.errorCode
      }),
      ...mapGetters({
        list: 'articleList'
      })
    },
    methods: {
      ...mapActions([
        'get_articleList' 
      ]),
      ...mapMutations([
        'set_articleStatus'
      ]),
      //点击分类
      handleSelect(activeIndex){
        this.activeIndex = activeIndex;
        this.searchData = '';
        if(this.currentPage == 1){
          this.handleCurrentChange(1);
        }else{
          this.set_articleStatus({
            currentPage: 1
          });
        }
      },
      //input搜索
      handleSearchClick(){
        this.activeIndex = 'all';
        this.handleCurrentChange(1);
      },
      handleSearchChange(event){
        console.log(arguments)
      },
      //点击分页
      handleCurrentChange(currentPage){
        this.get_articleList({type: this.activeIndex, search: this.searchData, currentPage: currentPage}).then(() => {
          backToTop();
        });
      }
    },
    created: function(){
      this.get_articleList();
    },
    components: {
      articleItem: articleItem
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
    .articleLayout {
      padding: 0 5px;
      min-height: 1233px;
      .nodata {
        padding:12px 0;
        text-align: center;
      }
    }
    .page {
      padding: 10px 25px 30px;
      overflow: hidden;
      .el-pagination {
        float: right;
      }
    }
  }
</style>