<template>
  <div class="note message" :style="{backgroundColor:color}">
  	<i class="topLeft" :style="messageObj"></i>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: 'note',
    data() {
      return {
        color: 'rgb(206, 190, 75)'
      };
    },
    computed: {
		gradientColor() {
			return this.similarColor(this.color, 30, true);
		},
		gradientColor49() {
			return this.similarColor(this.color, 30, true);
		},
		rotate(){
			let rand = Math.random(),
			num = (rand > 0.5 ? 20 * rand : -20 * rand) ;
			return parseInt(num) + 'deg';
		},
		messageObj(){
			return {
				background: `linear-gradient(135deg, ${this.gradientColor}  0%,${this.gradientColor49} 49%, #fff 50%, #fff)`
			};
		},
		paperObj() {
			return {
				backgroundColor: `${this.similarColor(this.color)}`
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
		margin: 50px;
		i {
			content: '';
			width: 20px;
			height: 20px;
			position: absolute;
			right: -2px;
			bottom: -2px;
		    background: linear-gradient(135deg, #675e25 24%,#675c12 49%,#fff 50%,#fff);
		    border-top-left-radius: 50% 25%;
		    box-shadow: -3px -4px 2px 0px #908323;
		    border-bottom-right-radius: 10px 5px;
		}
	}
	.topLeft {
		left: -2px;
		top: -2px;
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
</style>