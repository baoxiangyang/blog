<template>
  <div>
    <header>
      <el-menu theme="light" :default-active="activeIndex" mode="horizontal" @select="handleSelect">
        <el-row>
          <el-col :sm="5" class="headerItem">
            <h1>
              <img src="/images/logo.jpg" alt="网站logo">
              小包总
            </h1>
          </el-col>
          <el-col :sm="13" class="navlist" >
            <el-menu-item index="1">首页</el-menu-item>
            <el-menu-item index="2">文章</el-menu-item>
            <el-menu-item index="3">DEMO</el-menu-item>
            <el-menu-item index="4">简介</el-menu-item>
          </el-col>
          <el-col :sm="6" class="headerItem">
            <el-input  placeholder="搜索..." icon="search" v-model="headerInput" :on-icon-click="handleIconClick" size="small"></el-input>
          </el-col>
        </el-row>
      </el-menu>
    </header>
  </div>
</template>
<script type="text/javascript">
  export default {
    data() {
      return {
        activeIndex: '1',
        headerInput: ''
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      handleIconClick() {

      }
    }
  };
</script>
<style lang="less">
  header {
    .el-menu-item {
      float: none !important;
      display: inline-block;
    }
    .navlist {
      text-align: center;
    }
    .headerItem {
      height: 60px;
      line-height: 60px;
      h1 {
        font-size: 18px;
        padding-left: 25px;
      }
      .el-input {
        max-width: 200px;
      }
      &:last-child {
        text-align: right;
        padding-right: 25px;
      }
      img {
        border: 0;
        height: 50px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 10px;
      }
    }
  }
</style>
