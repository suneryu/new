<template>
	<qj-mini-user-address-manage ref="addressManager" :propGetJson="getJson"></qj-mini-user-address-manage>
</template>

<script>
export default {
	data(){
		return {
			getJson:0
		}
	},
	onLoad(options) {
		console.log(options.json, '接受数据');
		if (options && options.json) {
			this.getJson = options.json;
		}
	},
	onShow() {
		this.$refs.addressManager.commonMounted();
	}
};
</script>

<style></style>