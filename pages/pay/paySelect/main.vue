<template>
	<qj-mini-pay-select :propPayParams="payParams"></qj-mini-pay-select>
</template>

<script>
export default {
	data() {
		return {
			payParams: ''
		};
	},
	onLoad(options) {
		// 未支付订单位置点击付款会携带参数
		if (options && options.contractBillcode) {
			this.payParams = options;
		}
	},
	mounted() {},
	methods: {}
};
</script>

<style lang="less"></style>
