<template>
	<div class="myInvite">
		<commonHeader :title="title[NoInviteVal]" :leftIcon="leftIcon" :rightIcon="rightIcon"></commonHeader>

		<div v-bind:style="{ backgroundImage: 'url(' + shsettlObj.shsettlUrl + ')' }" class="content-join" v-if="ajax && NoInviteVal == 0">
			<button @click="joinHandler" v-bind:style="{ backgroundColor: baseColor }" type="button">{{ applyTitle[applyStatus] }}</button>
		</div>
		<div class="content-invite" v-if="ajax && NoInviteVal == 1">
			<div class="show-container">
				<p class="title" v-bind:style="{ color: baseColor }">我的邀请码</p>
				<p class="code" v-bind:style="{ color: baseColor }">{{ myInviteVal }}</p>
				<image class="qr-code" v-if="miniQRCode" :src="miniQRCode"></image>
				<p class="tips">邀请好友注册填写邀请码好友下单立享返佣</p>
			</div>
		</div>

		<!-- #ifdef MP-WEIXIN -->
		<popup-layer class="apply-info-popup" v-model="popupVisible" :direction="'bottom'">
			<p class="apply-name required">
				<span>姓名</span>
				<input type="text" v-model="applyName" placeholder="请输入您的姓名" />
			</p>
			<p class="apply-phone required">
				<span>手机号</span>
				<input type="number" v-model="applyPhone" placeholder="请输入您的手机号" />
			</p>
			<p class="apply-reason">
				<span>申请原因</span>
				<input type="text" v-model="applyReason" placeholder="请输入申请原因" />
			</p>
			<button @click="joinHandlerInPopup" v-bind:style="{ backgroundColor: baseColor }" type="button">立即申请</button>
		</popup-layer>
		<!-- #endif -->

		<!-- #ifdef MP-ALIPAY || MP-TOUTIAO -->
		<u-popup v-model="popupVisible" mode="bottom" border-radius="14" length="50%">
			<view class="apply-info-popup-ali-tt">
				<view class="apply-frame apply-name required">
					<view class="title">姓名</view>
					<input type="text" v-model="applyName" placeholder="请输入您的姓名" />
				</view>
				<view class="apply-frame apply-phone required">
					<view class="title">手机号</view>
					<input type="number" v-model="applyPhone" placeholder="请输入您的手机号" />
				</view>
				<view class="apply-frame apply-reason">
					<view class="title">申请原因</view>
					<input type="text" v-model="applyReason" placeholder="请输入申请原因" />
				</view>
				<button class="btn" @click="joinHandlerInPopup" v-bind:style="{ backgroundColor: baseColor }">立即申请</button>
			</view>
		</u-popup>
		<!-- #endif -->

		<!-- <template v-if="myInviteVal && ajax && code">
			<share :shsettlCode="code" :myInviteVal="myInviteVal" class="alert1"></share>
		</template> -->
	</div>
</template>

<script>
import http from '@/api/http.js';
import commonHeader from '@/components/communal/commonHeader.vue';
import popupLayer from '@/components/popup-layer/popup-layer.vue';
import { phoneValidation } from '@/utils/formatPhone.js';
import { getUserinfoInvite, getShsettlByUser, saveUserinfoApplyDis, getWxMiniQRCode } from '@/api/interface.js';
export default {
	components: {
		commonHeader,
		popupLayer
	},
	data() {
		return {
			baseColor: '',
			title: ['申请成为分销员', '我的邀请码'],
			leftIcon: true,
			rightIcon: false,
			applyTitle: ['立即申请', '等待审核'],
			applyStatus: 0,
			shsettlSort: 0,
			myInviteVal: '',
			ajax: false,
			NoInviteVal: 0,
			shsettlObj: {},
			code: '',
			popupVisible: false,
			applyName: '',
			applyPhone: '',
			applyReason: '',
			shareUrl: '',
			// 小程序码
			miniQRCode: ''
		};
	},
	onLoad() {
		this.baseColor = `#${this.$state.baseColor}`;
		this.$setTitle(this.$storage.get('proappEnvName'));
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: this.baseColor
		});
	},
	onShow() {
		this.getShsettlByUser();
	},
	onShareAppMessage(res) {
		console.log(res);
		return {
			title: '邀请注册',
			path: this.shareUrl,
			imageUrl: 'https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/yaoqingzhuce.jpg'
		};
	},
	mounted() {},
	methods: {
		getWxMiniQRCode(query) {
			let params = {
				scene: query,
				page: 'pages/user_modules/invitation/main'
			};
			http.get(getWxMiniQRCode, params).then(res => {
				console.log(res);
				if (res.success) {
					this.miniQRCode = 'data:image/png;base64,' + res.dataObj.dataObj.toString('base64');
				}
			});
		},
		/**
		 * shsettlSort 0 表示未开启审核，1表示开启审核
		 * shsettlCode
		 * shsettlUrl 申请加入分销员页面背景
		 * shsettlUrl1 邀请注册页面背景
		 */
		getShsettlByUser() {
			http.get(getShsettlByUser).then(res => {
				if (res.shsettlCode) {
					this.shsettlObj = res;
					this.code = res.shsettlCode;
					this.shsettlSort = res.shsettlSort;
					this.getUserinfoInvite();
				}
			});
		},

		getUserinfoInvite() {
			this.ajax = false;
			this.NoInviteVal = 0;
			this.$message.loading();
			http.get(getUserinfoInvite).then(res => {
				this.$message.hide();
				console.log(res.dataObj, 11);
				// errorCode == -1  没有邀请码
				// errorCode == 1 待审核状态
				if (res.dataObj == null && res.errorCode == -1) {
					this.NoInviteVal = 0;
					this.myInviteVal = '';
					this.applyStatus = 0;
				}
				if (res.dataObj == null && res.errorCode == 1) {
					this.NoInviteVal = 0;
					this.myInviteVal = '';
					this.applyStatus = 1;
				}
				if (res.success && res.errorCode == null) {
					//此时用户有了邀请码
					this.NoInviteVal = 1;
					this.myInviteVal = res.dataObj;
					this.applyStatus = 0;
					this.shareUrl = '/pages/user_modules/invitation/main' + '?code=' + this.myInviteVal;
					this.getWxMiniQRCode(`code=${this.myInviteVal}`);
					console.log(this.shareUrl);
				}
				this.ajax = true;
			});
		},

		joinHandler() {
			if (this.applyStatus === 1) {
				this.$message.alert('您的申请正在审核中，请耐心等候');
				return;
			}
			// 立即申请
			if (this.shsettlSort == 1) {
				this.popupVisible = true;
			} else {
				let params = {
					shsettlCode: this.code
				};
				this.joinHttp(params);
			}
		},

		joinHandlerInPopup() {
			if (!this.applyName) {
				this.$message.alert('姓名不能为空');
				return;
			}
			if (!phoneValidation(this.applyPhone)) {
				return;
			}
			let params = {
				userinfojson: {
					userinfoCompname: this.applyName,
					userinfoPhone: this.applyPhone,
					userinfoapplyRemark: this.applyReason
				},
				shsettlCode: this.code
			};
			console.log(params);
			this.joinHttp(params);
		},

		joinHttp(params) {
			this.$message.loading();
			http.get(saveUserinfoApplyDis, params).then(res => {
				console.log(res);
				this.$message.hide();
				if (res.success) {
					this.getUserinfoInvite();
					this.popupVisible = false;
				} else {
					this.$message.alert(res.msg);
				}
			});
		}
	}
};
</script>

<style lang="less">
@import '../../../../common/css/common.less';
.myInvite {
	width: 100%;
	height: 100%;
	background-color: #ffffff;
	.content-join {
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		height: 100%;
		overflow: hidden;
		button {
			width: 100%;
			height: 84rpx;
			font-size: 30rpx;
			border: none;
			position: absolute;
			bottom: 0;
			color: #ffffff;
		}
	}
	.content-invite {
		background-image: url('@{base-img-domain}/wxminiImg/distribution_invite_bg.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		height: 100%;
		width: 100%;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		.show-container {
			background-image: url('@{base-img-domain}/wxminiImg/invite_code_bg.png');
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			width: 561rpx;
			height: 596rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.title {
				margin-top: 76rpx;
				font-size: 28rpx;
				font-weight: 500;
			}
			.code {
				margin-top: 34rpx;
				font-size: 47rpx;
				font-weight: 800;
			}
			.qr-code {
				margin-top: 42rpx;
				height: 170rpx;
				width: 170rpx;
			}
			.tips {
				text-align: center;
				margin-top: 26rpx;
				width: 305rpx;
				height: 67rpx;
				font-size: 28rpx;
				font-weight: 500;
				line-height: 40rpx;
				color: #7b7b7b;
			}
		}
	}

	.apply-info-popup {
		width: 100%;
		height: 860rpx;
		border-radius: 20rpx 20rpx 0rpx 0rpx;

		p {
			width: 590rpx;
			margin: 0 auto;
			height: 70rpx;
			margin-top: 42rpx;
			display: flex;
			align-items: center;
			border-bottom: 1rpx solid #e5e5e5;
			color: #737373;
			span {
				width: 120rpx;
				font-size: 28rpx;
			}
			input {
				height: 70rpx;
				padding-left: 32rpx;
				flex: 1;
				background: none;
				border: none;
				font-size: 28rpx;
				color: #737373;
			}
			&.required {
				span {
					&:before {
						content: '*';
						color: red;
					}
				}
			}
			::-webkit-input-placeholder {
				font-size: 26rpx;
				color: #cccccc;
			}
		}
		button {
			width: 100%;
			height: 84rpx;
			border: none;
			font-size: 30rpx;
			position: absolute;
			bottom: 0;
			color: #ffffff;
		}
	}
	.apply-info-popup-ali-tt {
		width: 100%;
		height: 100%;
		.apply-frame {
			width: 590rpx;
			margin: 0 auto;
			height: 70rpx;
			margin-top: 42rpx;
			display: flex;
			align-items: center;
			border-bottom: 1rpx solid #e5e5e5;
			color: #737373;
			.title {
				width: 120rpx;
				font-size: 28rpx;
			}
			input {
				height: 70rpx;
				padding-left: 32rpx;
				flex: 1;
				background: none;
				border: none;
				font-size: 28rpx;
				color: #737373;
			}
			&.required {
				.title {
					&:before {
						content: '*';
						color: red;
					}
				}
			}
			::-webkit-input-placeholder {
				font-size: 26rpx;
				color: #cccccc;
			}
		}
		.btn {
			width: 100%;
			height: 84rpx;
			border: none;
			font-size: 30rpx;
			position: fixed;
			line-height: 84rpx;
			text-align: center;
			bottom: 0;
			color: #ffffff;
		}
	}
}
</style>
