<template>
  <div>
    <el-row :gutter="0">
      <el-col :span="5" class="topItem">
        <p>小包总</p>
      </el-col>
      <el-col :span="8">
        <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="2">文章</el-menu-item>
          <el-menu-item index="3">DEMO</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="7" class="topItem">
        <el-input placeholder="搜索" icon="search" v-model="search" :on-icon-click="handleIconClick"></el-input>
      </el-col>
    </el-row>
  </div>
</template>
<script type="text/javascript">
  export default {
    data() {
      return {
        activeIndex: '1',
        search: ''
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      handleIconClick(){

      }
    }
  };
</script>
<style>
   .topItem {
      height: 60px;
      line-height: 60px;
   }
</style>
