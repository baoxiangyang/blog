<template>
  <section :class="['note', (option.type == 'paper' ? 'paper' : 'message')]" :style="commonStyle">
  	<i :style="option.type == 'paper' ? paperObj : messageObj" 
  		:class="{'topLeft': option.type == 'messageTop'}"></i>
  	<article>
	  	<aside class="info">
	  		<img :src="option.commenter.userInfo.avatarImg" alt="">
	  		<span class="name">{{option.commenter.userInfo.userName}}：</span> 
	  	</aside>
	  	<p>&emsp;&emsp;{{option.commenter.content}}</p>
	  	<time>{{option.commenter.time}}</time>
  	</article>
  	<article  v-for="(item, index) in option.commentList" :key="index" class="commentList">
  		<p><span class="name">{{item.name}}: </span>{{item.content}}</p>
  		<time>{{item.time}}</time>
  	</article>
  	<template v-if="!option.noBtn">
		<el-button type="text" class="comment">评 论</el-button>
  	</template>
  </section>
</template>
<script type="text/javascript">
  export default {
    name: 'note',
    props:["option"],
    data() {
      return {
		
      };
    },
    computed: {
		gradientColor() {
			return this.similarColor(this.option.bgColor, 30, true);
		},
		gradientColor49() {
			return this.similarColor(this.option.bgColor, 30, true);
		},
		commonStyle() {
			let rand = Math.random(),
			num = parseInt(rand > 0.5 ? 15 * rand : -15 * rand);
			return {
				backgroundColor: this.option.bgColor,
				color: this.option.color,
				transform: `rotate(${num}deg)`,
				'-webkit-transform': `rotate(${num}deg)`,
				'-moz-transform': `rotate(${num}deg)`,
				'-ms-transform': `rotate(${num}deg)`,
				'-o-transform': `rotate(${num}deg)`
			};
		},
		messageObj(){
			return {
				background: [`linear-gradient(135deg, ${this.gradientColor}  0%,${this.gradientColor49} 49%, #fff 50%, #fff)`,
					`-webkit-linear-gradient(135deg, ${this.gradientColor}  0%,${this.gradientColor49} 49%, #fff 50%, #fff)`,
					`-ms-linear-gradient(135deg, ${this.gradientColor}  0%,${this.gradientColor49} 49%, #fff 50%, #fff)`,
					`-moz-linear-gradient(135deg, ${this.gradientColor}  0%,${this.gradientColor49} 49%, #fff 50%, #fff)`,
					`-o-linear-gradient(135deg, ${this.gradientColor}  0%,${this.gradientColor49} 49%, #fff 50%, #fff)`
				]
			};
		},
		paperObj() {
			return {
				backgroundColor: `${this.similarColor(this.option.bgColor)}`
			};
		}
    },
    methods: {
		similarColor(value, similar = 30, bool = false){
			let tempArr = value.match(/\d+/g).map((item)=> {
				let rand = Math.random();
				let num = parseInt(rand * similar) + (rand > 0.5 ? Number(item) : - Number(item));
				if(num < 0){
					num = Math.abs(num);
				}
				if(num > 255) {
					num = 255;
				}
				return num;
			});
			return bool ? `rgb(${tempArr.join(', ')})` :`rgba(${tempArr.join(', ')}, .5)`;
		}
    }
  };
</script>
<style lang="less">
	.message {
		display: inline-block;
		min-height: 100px;
		width: 200px;
		background-color: #c7b321;
		position: relative;
		padding:15px;
		border-radius: 5px;
		i {
			content: '';
			width: 20px;
			height: 20px;
			position: absolute;
			right: -1px;
			bottom: -1px;
		    background: linear-gradient(135deg, #675e25 24%,#675c12 49%,#fff 50%,#fff);
		    border-top-left-radius: 50% 25%;
		    box-shadow: -3px -4px 2px 0px #908323;
		    border-bottom-right-radius: 10px 5px;
		}
	}
	.topLeft {
		left: -1px;
		top: -1px;
		transform: rotate(180deg);
		box-shadow: 3px 4px 2px 0px #908323;
		border-top-left-radius: 0;
		border-bottom-right-radius: 50% 25%;
	}
	.paper {
		transform: rotate(-6deg);
		position: relative;
		display: inline-block;
		min-height: 150px;
		width: 200px;
		color: #000;
		background-color: #abcdef;
		box-shadow: 5px 5px 7px rgba(33,33,33,0.7);
		padding: 15px;
		i {
			content: '';
			position: absolute;
			top:-20px; 
			left: 50%;
			width: 50%;
			height: 40px;
			transform: translateX(-50%);
			background-color:rgba(255, 255, 204,0.5);			
			border-left: 1px dashed rgba(0, 0, 0, 0.1);
			border-right: 1px dashed rgba(0, 0, 0, 0.1);
			box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.2);
		}
	}
	.note {
		.info {
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
			img {
				width: 30px;
				height: 30px;
				border-radius: 50%;
				vertical-align: middle;
			}
		}
		article {
			&:not(:last-of-type){
				margin-bottom: 5px;
			}
			.name {
				font-weight: bold;
				color: #009a61;
			}
			p {
				word-break:break-all;
				word-wrap:break-word;
			}
			time {
				display: block;
				text-align: right;
				font-size: 14px;
			}

		}
		.commentList {
			font-size: 14px;
		}
		.comment {
			font-weight: bold;
			float: right;
			display: none;
		}
		&:hover .comment{
			display: inline-block;
		} 
	}
</style>