<template>
	<qj-mini-user-agreement :propAgreementType="agreementType"></qj-mini-user-agreement>
</template>

<script>
export default {
	data() {
		return {
			agreementType: '',
			navBarTitle: {
				xieyi: '用户协议',
				yinsi: '隐私政策'
			}
		};
	},
	onLoad(options) {
		this.agreementType = options.agreementType;
		console.log(this.agreementType);
		this.$qj.setTitle(this.navBarTitle[this.agreementType]);
	},
	onShow() {},
	mounted() {},
	methods: {}
};
</script>

<style></style>
