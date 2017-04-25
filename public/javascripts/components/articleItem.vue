<template>
	<section class="articleItem">
      <h3>前端图像处理指南 <small >作者：<span>baozi</span> 时间：<time datetime="2011-01-12">2017-02-23</time></small ></h3>
      <div>更靠谱的横竖屏检测方法", "author" : "singsong", "description" : "前不久，个H5项目，需要在横竖屏变化时，做一些处理。毫无疑问，需要使用orientationcha监听横竖屏的变化。 方案一： {代码...} 代码添加上后，就各种兼容性问题。这里</div>
      <p>
        <el-tag type="success">js</el-tag>
        <el-tag type="success">html</el-tag>
         <el-tag type="success">node</el-tag>
      </p>
    </section>
</template>
<script type="text/javascript">
	export default {
		data() {
			return {

			};
		},
		methods: {

		}
	};
</script>
<style lang="less">
.articleItem {
	padding: 12px 0;
	border-bottom: 1px solid #eee;
	&:last-child {
		border-bottom: none;
	}
     h3 {
        margin-bottom: 5px;
        small {
          	font-weight: 500;
	        span {
	           color: #009a61;
	           margin-right: 10px;
	        }
        }
    }
    div {
       color: #777;
       font-size: 14px;
    }
    p {
       margin-top: 5px;
    }

}
</style>