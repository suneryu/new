<template>
	<qj-mini-invoice-my ref="invoiceMy"></qj-mini-invoice-my>
</template>

<script>
export default {
	onLoad(options) {
		this.$state.moreToolList = [...this.$state.moreToolList, ...this.$state.currentRouter.routechildren]
		console.log(this.$state.moreToolList)
	},
	onReachBottom() {
		// 到这底部在这里需要做什么事情
		this.$refs.invoiceMy.loadMore();
	}
};
</script>
<style></style>
