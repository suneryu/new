<template>
	<qj-mini-b2b-bind-phone :propRedirectUrl="redirectUrl" @redirectTo="redirectTo" @navigateBack="navigateBack"></qj-mini-b2b-bind-phone>
</template>

<script>
	
	export default {
		data() {
			return {
			}
		},
		onLoad(options) {
			this.redirectUrl = options.redirectUrl;
		},
		onShow() {
			
		},
		mounted() {
			
		},
		methods:{
			redirectTo(options){
				this.$qj.router.replace(options.url, options.query ? options.query : '')
			},
			navigateBack(){
				this.$qj.router.back();
			}
		}
	}
</script>

<style></style>