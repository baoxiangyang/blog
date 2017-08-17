<template>
  <el-row :gutter="20" class="articleLayout" v-loading="loading"
    element-loading-text="拼命加载中">
    <el-col :span="20">
      <articleItem  v-for="item in list" key="item.id" :detailsData="item"></articleItem>
      <p v-show="!list.length" class="nodata">暂无数据</p>
    </el-col>
    <el-col :span="4">
      <el-button type="text" @click="tips" style="margin-top:30px">发布文章</el-button>
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
    <footer class="record">
      <a href="http://www.miitbeian.gov.cn">渝ICP备16013153号</a>
    </footer>
  </el-row>
</template>
<script type="text/javascript">
  import articleItem from '../components/articleItem.vue';
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
  import { backToTop } from '../common/base.js';
  import { set_articleStatus } from '../mutation-types.js';
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
        search: state => state.articleModule.search
      }),
      ...mapGetters({
        list: 'articleList'
      })
    },
    methods: {
      ...mapActions([
        'get_articleList' 
      ]),
      ...mapMutations([set_articleStatus]),
      //点击分页
      handleCurrentChange(currentPage){
        backToTop();
        this.get_articleList({type: this.type, search: this.search, currentPage: currentPage});
      },
      tips() {
         this.$message({
          showClose: true,
          message: '努力开发中。。。'
        });
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if(vm.currentPage && vm.currentPage != 1){
          vm.set_articleStatus({currentPage: 1});
        }else{
          vm.get_articleList({type: to.query.type || 'all', search: to.query.search, currentPage: 1 });
        }
      });
    },
    beforeRouteUpdate(to, from, next){
      if(this.currentPage == 1){
        this.handleCurrentChange(1);
      }else{
        this.set_articleStatus({currentPage: 1});
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
  .record {
    text-align: center;
    width: 100%;
    padding-bottom: 10px;
    position: absolute;
    bottom: 0;
    a {
      color: #000;
    }
  }
</style>