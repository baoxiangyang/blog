<template>
	<div class="backTop" v-show="isShow">
    <a href="javascript:;" class="el-icon-arrow-up" title="回到顶部" @click="BackTop"></a>
    <a href="javascript:;" class="el-icon-arrow-left" title="返回" @click="routerBack"></a>
  </div>
</template>
<script type="text/javascript">
  import { backToTop as BackTop, throttle} from '../base.js';
  import router from '../router.js';
	export default {
    name: 'backToTop',
		data() {
			return {
        isShow: false
			};
		},
		methods: {
      BackTop,
      routerBack: function () {
        router.back();
      }
		},
    mounted: function(){
      window.addEventListener('scroll', ()=> {
        throttle(()=> {
          let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          if(scrollTop > 150){
            this.isShow = true;
          }else{
            this.isShow = false;
          }
        });
      });
    }
	};
</script>
<style lang="less">
  .backTop {
    position: fixed;
    bottom: 100px;
    right: 50px;
    display: block;
    padding: 8px;
    background-color: #50bfff;
    border-radius: 5px;
    a {
      padding: 5px;
      border: 1px solid #fff;
      border-radius: 5px;
      cursor: pointer;
      &:hover {
        text-decoration: none;
        color: #fff
      }
      &:last-child {
        margin-top: 5px;
        display: block;
      }
    }
  }
</style>