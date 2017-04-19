<template>
	<div>
		<router-link to="/bar">Go to bar</router-link>
	    <router-link to="/index">Go to index</router-link>
	    <br>
		<p>{{msg}}</p>
		<p>{{ $route.params.id }}</p>
	</div>
</template>
<script type="text/javascript">
	export default {
		data(){
			return {
				msg: 'foo1'
			};
		},
		created: function() {
			console.log(this.$route);
		},
		beforeRouteEnter (to, from, next){
			console.log(123);
			next();
		},
		watch: {
			$route() {
				console.log('1111');
			}
		}
	};
</script>