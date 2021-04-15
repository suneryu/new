<template>
	<view>
		<qj-mini-b2b-authorization
			@redirectTo="redirectTo"
			@navigateBack="navigateBack"
			@reLaunch="reLaunch"
			:propRedirectUrl="redirectUrl"
			:propInviteCode="inviteCode"
			:propIsInviteRegister="isInviteRegister"
			:propHtmlJson="htmlJson"
		></qj-mini-b2b-authorization>
	</view>
</template>

<script>
export default {
	data() {
		return {
			redirectUrl: '',
			inviteCode: '',
			isInviteRegister: false,
			htmlJson: ''
		};
	},
	onLoad(options) {
		this.redirectUrl = options.redirectUrl;
		this.isInviteRegister = options.isInviteRegister;
		this.inviteCode = options.code;
		this.htmlJson = options.json;
		console.log(this.htmlJson)
	},
	onShow() {},
	methods: {
		redirectTo(options) {
			this.$qj.router.replace(options.url, options.query ? options.query : '');
		},
		navigateBack() {
			this.$qj.router.back();
		},
		reLaunch(options) {
			this.$qj.router.reOpen(options.url, options.query ? options.query : '', { stay: 500 });
		}
	},
	mounted() {}
};
</script>

<style></style>
