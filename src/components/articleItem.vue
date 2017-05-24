<template>
	<section class="articleItem">
      <h3>
        <router-link :to="{name: 'articleDetails', query: { id: detailsData.id }}">{{detailsData.title}}</router-link> 
        <small>
            <template v-if="!!detailsData.author">
              作者：<span>{{detailsData.author}}</span>
            </template>
            <template v-else>
              来源：<span>{{detailsData.source}}</span>
            </template>
            时间：<time :datetime="detailsData.time">{{detailsData.timeMsg}}</time>
        </small >
      </h3>
      <div>{{detailsData.description}}</div>
      <p>
        <el-tag key="index" :type="typeArr[randomType()]" v-for="(item, index) in detailsData.label">{{item}}</el-tag>
      </p>
    </section>
</template>
<script type="text/javascript">
	export default {
    props:['detailsData'],
		data() {
			return {
        typeArr: ['primary', 'success', 'warning', 'danger']
			};
		},
		methods: {
      randomType(){
        return parseInt(Math.random() * this.typeArr.length);
      }
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
          font-size: small;
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
      .el-tag {
        margin-right: 5px;
      }
    }

}
</style>