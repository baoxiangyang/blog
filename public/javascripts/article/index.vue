<template>
  <div class="articleList">
    <div class="articleHeader">
      <el-menu :default-active="activeIndex" class="articleNav maxWidth" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">javascript</el-menu-item>
        <el-menu-item index="2">html</el-menu-item>
        <el-menu-item index="3">css</el-menu-item>
        <el-menu-item index="4">webpack</el-menu-item>
        <el-menu-item index="5">gulp</el-menu-item>
        <el-menu-item index="6">node</el-menu-item>
        <el-menu-item index="7">vue</el-menu-item>
        <el-menu-item index="8">react</el-menu-item>
        <el-menu-item index="9">其他</el-menu-item>
        <el-input class="search" icon="search" v-model="searchData" :on-icon-click="handleSearchClick" placeholder="搜索" size="small"></el-input>
      </el-menu>
    </div>
    <el-row :gutter="20" class="articleLayout maxWidth">
      <el-col :span="20">
        <articleItem key="1"></articleItem>
        <articleItem key="2"></articleItem>
        <articleItem key="3"></articleItem>
        <articleItem key="4"></articleItem>
      </el-col>
      <el-col :span="4">
        <el-button type="text">发布文章</el-button>
      </el-col>
    </el-row>
    <div class="page maxWidth">
      <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="100">
    </el-pagination>
    </div>
  </div>
</template>
<script type="text/javascript">
  import articleItem from '../components/articleItem.vue';
  import { mapActions } from 'vuex';
  export default {
    data() {
      return {
        activeIndex: '',
        searchData: '',
        currentPage: 5
      };
    },
    methods: {
      ...mapActions([
        'get_articleList' 
      ]),
      handleSelect(){

      },
      handleSearchClick(){

      },
      handleCurrentChange(){
        console.log(arguments);
      },
    },
    created: function(){
      this.get_articleList({a:1});
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
    }
    .page {
      padding: 10px 25px;
      overflow: hidden;
      .el-pagination {
        float: right;
      }
    }
  }
</style>