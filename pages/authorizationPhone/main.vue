<template>
	<view>
		<qj-mini-b2b-authorization-phone
			:propRedirectUrl="redirectUrl"
			@redirectTo="redirectTo"
			@navigateTo="navigateTo"
			@navigateBack="navigateBack"
		></qj-mini-b2b-authorization-phone>
	</view>
</template>

<script>
export default {
	data() {
		return {
			redirectUrl: ''
		};
	},
	onLoad(options) {
		this.redirectUrl = options.redirectUrl;
	},
	methods: {
		redirectTo(options) {
			this.$qj.router.replace(options.url, options.query ? options.query : '');
		},
		navigateTo(options) {
			this.$qj.router.push(options.url, options.query ? options.query : '');
		},
		navigateBack() {
			this.$qj.router.back();
		}
	}
};
</script>

<style></style>
