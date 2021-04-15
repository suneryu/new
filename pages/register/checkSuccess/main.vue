<template>
	<view class="b2b-register">
		<div class="registerSuccess">
			<div class="iconBox">
				<div class="successIcon" v-bind:style="{ backgroundColor: baseColor }">
					<icon v-if="checkModifyAudit == 6" type="waiting" size="36" />
					<!-- 审核失败 -->
					<icon v-if="checkModifyAudit == 4" type="cancel" size="36" />
					<!-- 审核成功 -->
					<icon v-if="checkModifyAudit == 3" type="success_no_circle" size="36" />
				</div>

			</div>
			<!-- 授权审核中 -->
			<div v-if="checkModifyAudit ==  6">
				<div class="successTitle" >授权审核中</div>
				<div class="successTip">已提交申请,等待处理</div>
				<div class="successTip" >我们将在7个工作日内完成人工审核</div>
				<div class="successTip" >请耐心等待审核结果</div>
			</div>
			<!--  审核未通过 -->
			<div class="successTitle" v-if="checkModifyAudit == 4">授权失败</div>
			<div class="successTip" v-if="checkModifyAudit == 4">对不起,您的申请授权失败了</div>
			<!-- <div class="successTip" v-if="checkState == 2">失败原因:</div> -->
			<!-- 授权成功 -->
			<div class="successTitle" v-if="checkModifyAudit == 3">授权成功</div>
			<div class="successTip" v-if="checkModifyAudit == 3">认证已经完成,感谢您的支持</div>
			<div class="successBtn">
				<div class="goToShop" @click="goToIndex" v-if="checkModifyAudit == 3">前往首页</div>
				<!-- 审核失败 -->
				<div class="goToRegister" v-if="checkModifyAudit == 4" v-bind:style="{ backgroundColor: baseColor }" @click="goToRegister">重新申请</div>
			</div>

		</div>


	</view>
</template>


<script>
	import {
		userInfoApplyByCheck,
		userapplyStateAndAuth
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
				checkState:'',
				checkModifyAudit:""

			};
		},
		onLoad(options) {
			this.userPhone = options.userPhone;
			this.pageState = options.pageState ? options.pageState : 0;
			
			this.checkModifyAudit = options.checkModifyAudit || this.checkModifyAudit

		},
		onShow() {},
		mounted() {
			this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
			this.getCheckState()
		},
		created(){
			this.getAuthState()
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
			// 获取授权状态
			getAuthState() {
				let that = this
				let paramsStatus = {}
				paramsStatus.userCode = this.$qj.storage.get('loginInfor').userInfoCode
				this.$qj
					.http(this.$qj.domain)
					.get(userapplyStateAndAuth, paramsStatus)
					.then(res => {
						 this.checkModifyAudit = res.checkModifyAudit
			
					});
			
			},
			goToIndex() {
				let options = {
					url: 'indexHDB',
					query: {
						// agreementType: 'yinsi'
					}
				};
				this.redirectTo(options);

			},
			goToRegister() {
				let options = {
					url: 'register/check',
					query: {
						userPhone: this.userPhone || this.inputUserPhone
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
