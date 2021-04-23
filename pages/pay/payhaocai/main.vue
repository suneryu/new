<template>
	<view class="b2b-register">
		<div class="registerSuccess">
			<div class="iconBox">
				<div class="successIcon" v-bind:style="{ backgroundColor: baseColor }">
					<icon  type="waiting" size="36" />
				</div>

			</div>
			<!-- 授权审核中 -->
			<div class="successTitle" >订单审核中</div>
			<div class="successTip" >已提交申请,等待处理</div>
			<div class="successTip" >我们将在7个工作日内完成人工审核</div>
			<div class="successTip" >请耐心等待审核结果</div>
			
			
			<div class="successBtn">
				<div class="goToShop" @click="orderDetails" >订单详情</div>
				<!-- 审核失败 -->
				<div class="goToRegister" v-bind:style="{ backgroundColor: baseColor }" @click="goToIndex">前往首页</div>
			</div>

		</div>



	</view>
</template>


<script>
	import {
		userInfoApplyByCheck
	} from '@/api/interface.js';
	import http from '@/api/http.js';
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
				userPhone: '',
				inputUserPhone: '',
				checkState:''

			};
		},
		onLoad(options) {
			this.userPhone = options.userPhone;
			this.pageState = options.pageState ? options.pageState : 0;
			console.log(this.userPhone)
			console.log(options)

		},
		onShow() {},
		mounted() {
			this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
			this.getCheckState()
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
			goToIndex() {
				console.log('gotoshop')
				let options = {
					url: 'homepage',
					query: {
						// agreementType: 'yinsi'
					}
				};
				// this.navigateTo(options);
				this.$qj.router.replace('homepage')

			},
			orderDetails() {
				let options = {
					url: 'order_modules/order/index',
					// url: 'o2o/pages/goodsdetails_modules/o2o_goosDetail2',
					query: {
						// userPhone: this.userPhone || this.inputUserPhone
					}
				};
				this.redirectTo(options);
			},
			getCheckState() {
				let that = this
				let params = {}
				params.userPhone = this.$qj.storage.get('userPhone');
				http
					.get(userInfoApplyByCheck, params)
					.then(res => {
						console.log(res);
						console.log('res');
						if (res) {
							that.checkState = res.umUserinfoapplyDomain.dataState
						}
					})
			}

		}
	};
</script>

<style lang="less" scoped>
	@import '@/common/css/common.less';

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
				background: #374e80;

			}
		}


	}
</style>
