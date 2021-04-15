<template>
	<view class="b2b-register">
		<div class="registerSuccess">
			<div class="iconBox">
				<div class="successIcon" v-bind:style="{ backgroundColor: baseColor }">
					<icon type="success_no_circle" size="36" />
				</div>
			</div>

			<div class="successTitle">注册成功</div>
			<div class="successTip">感谢您的支持</div>
			<div class="successBtn">
				<div class="goToShop" @click="goToShopIndex">前去登录</div>
				<div class="goToRegister" v-bind:style="{ backgroundColor: baseColor }" @click="goToRegister">企业认证</div>
			</div>

		</div>

	</view>
</template>

<script>
	export default {
		props: {
			propUserPhone: {
				type: String,
				default: ''
			},
			propUserInfoCode: {
				type: String,
				default: ''
			}
		},

		data() {
			return {
				baseColor: '',
				userPhone:'',
				inputUserPhone:''

			};
		},
		onLoad(options) {
			this.userPhone = options.userPhone;
			this.pageState = options.pageState ? options.pageState : 0;
		},
		onShow() {},
		mounted() {
			this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
		},
		watch: {
			propUserPhone(newValue, oldValue) {
				this.userPhone = newValue;
			},

			propUserInfoCode(newValue, oldValue) {
				this.userinfoCode = newValue
			}
		},
		methods: {
			navigateBack() {
				this.$qj.router.back();
			},

			navigateTo(options) {
				this.$qj.router.push(options.url, options.query ? options.query : '');
			},

			redirectTo(options) {
				this.$qj.router.replace(options.url, options.query ? options.query : '');
			},
			goToShopIndex() {
				let options = {
					url: 'login/loginPassword',
					query: {
						// agreementType: 'yinsi'
					}
				};
				this.redirectTo(options);

			},
			goToRegister() {
				let options = {
					url: 'register/b2bRegisterCom',
					query: {
						userPhone: this.userPhone || this.inputUserPhone,
					}
				};
				this.redirectTo(options);
			}

		}
	};
</script>

<style lang="less" scoped>
	@import '@/common/css/common.less';

//todo button bg color
	.b2b-register {
		width: 100%;
		height: 100%;
		background: @white-color;
		display: flex;
		justify-content: center;

		.iconBox {
			display: flex;
			justify-content: center;
		}

		.registerSuccess {
			width: 100%;
			margin-top: 60px;
			text-align: center;

		}

		.successIcon {
			// width: 40px;
			padding: 14px;
			border-radius: 33px;
		}

		.successTitle {
			font-size: 16px;
			margin-top: 15px;
		}

		.successTip {
			margin-top: 20px;
			color: #7d7b7b;
		}

		.successBtn {
			display: flex;
			justify-content: center;
			margin-top: 20px;

			.goToShop {
				padding: 5px 10px;
				border: 1px solid #333;
				border-radius: 4px;
				margin-right: 5px;
			}

			.goToRegister {
				padding: 5px 15px;
				border: 1px solid #333;
				border-radius: 4px;
				margin-left: 5px;
				color: #fff;
				background:#374e80
			}
		}


	}
</style>
