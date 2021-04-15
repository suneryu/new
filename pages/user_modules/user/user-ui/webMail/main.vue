<template>
	<qj-mini-web-mail ref="webMail" @navigateTo="navigateTo"></qj-mini-web-mail>
</template>

<script>
	export default {
		onLoad(options) {
			if (options && options.json) {
				this.$qj.storage.set('webmail', options.json);
				//$router.replace('web',{defaultUrl:this.$domain+'/paas/shop/00000001/wemini/index/index/index.html'})
			}
		},
		onReachBottom() {
			// 到这底部在这里需要做什么事情
			this.$refs.webMail.loadMore();
		},
		onShow() {
			this.$refs.webMail.commonMounted();
		},
		methods: {
			navigateTo(options) {
				this.$qj.router.push(options.url, options.query ? options.query : '');
			}
		}
	};
</script>
<style></style>
