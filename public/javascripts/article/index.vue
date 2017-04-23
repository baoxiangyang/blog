<template>
  <div class="articleList">
    <el-menu :default-active="activeIndex" class="articleNav" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">javascript</el-menu-item>
      <el-menu-item index="2">html</el-menu-item>
      <el-menu-item index="3">css</el-menu-item>
      <el-menu-item index="4">webpack</el-menu-item>
      <el-menu-item index="5">gulp</el-menu-item>
      <el-menu-item index="6">node</el-menu-item>
      <el-menu-item index="7">vue</el-menu-item>
      <el-menu-item index="8">react</el-menu-item>
      <el-menu-item index="9">其他</el-menu-item>
    </el-menu>
  </div>
</template>
<script type="text/javascript">
  export default {
    data() {
      return {
      };
    },
    methods: {
      handleSelect(){

      }
    }
  };
</script>
<style lang="less">
  .articleList {
    .articleNav{
      padding: 0 15px;
      li{
        height: 40px;
        line-height: 40px;
      }
    }
    
  }
</style>