<template>
  <el-row :gutter="20" class="articleLayout" v-loading="loading"
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
</template>
<script type="text/javascript">
  import articleItem from '../components/articleItem.vue';
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
  import { backToTop } from '../base.js';
  export default {
    data() {
      return {
        
      };
    },
    computed: {
      ...mapState({
        currentPage: state => state.articleModule.currentPage,
        pageSize: state => state.articleModule.pageSize,
        total: state => state.articleModule.total,
        loading: state => state.articleModule.loading,
        type: state => state.articleModule.type,
        search: state => state.articleModule.search,
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
      //点击分页
      handleCurrentChange(currentPage){
        backToTop();
        this.get_articleList({type: this.type, search: this.search, currentPage: currentPage});
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.set_articleStatus({type: (to.query.type || 'all')});
        if(!(vm.list && vm.list.length)) vm.handleCurrentChange(1);
        if(vm.type != 'all'){
          vm.set_articleStatus({activeIndex: to.fullPath});
        }
      });
    },
    beforeRouteUpdate(to, from, next){
      this.set_articleStatus({type: (to.query.type || 'all')});
      if(!this.search && this.type != 'all'){
        this.set_articleStatus({activeIndex: to.fullPath});
      }else{
        this.set_articleStatus({activeIndex: '/article?type=all'});
      }
      if(this.currentPage != 1){
        this.set_articleStatus({currentPage: 1});
      }else{
        this.handleCurrentChange(1);
      }
      next();
    },
    components: {
      articleItem: articleItem
    }
  };
</script>
<style lang="less">
  .articleLayout {
    padding: 0 5px;
    margin: 0 !important;
    .nodata {
      padding:12px 0;
      text-align: center;
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