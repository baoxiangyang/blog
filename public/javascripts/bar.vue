<template>
	<div>
		<router-link to="/foo">Go to Foo</router-link>
	    <router-link to="/index/foo/233">Go to index</router-link>
	    <br>
		<p @click="increment({n:n})">{{msg}}</p>
		<p>{{count}}</p>
		<p @click="increment">{{count2}}</p>
	</div>
</template>
<script type="text/javascript">
	import { mapMutations, mapGetters,mapState  } from 'vuex';
	export default {
		name: 'bar',
		data(){
			return {
				msg: 'bar',
				n:10
			}
		},
		methods: {
			...mapMutations(['increment']),
		},
		computed: {
			...mapState({
				count: 'count',
				count2: state => state.moduleA.count
			})
		}
	}
</script>