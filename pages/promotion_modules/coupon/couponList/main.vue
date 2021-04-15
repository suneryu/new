<template>
	<qj-mini-coupon-list ref="couponList"></qj-mini-coupon-list>
</template>

<script>
export default {
	onShow() {
		this.$refs.couponList.lifeOnShow();
	},
	onReachBottom() {
		// 到这底部在这里需要做什么事情
		this.$refs.couponList.loadMore();
	}
};
</script>

<style></style>
