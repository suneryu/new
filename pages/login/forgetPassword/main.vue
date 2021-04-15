<template>
	<view class="forget-password">
		<view class="logo">
			<!-- <image :src="logoImg" mode="aspectFit"></image> -->
			<image :src="logoImg" mode="aspectFit"></image>
		</view>
		<view class="input-container">
			<view class="account">
				<view class="iconfont icon-shouji"></view>
				<input class="account-input" type="number" maxlength="11" v-model="userPhone" placeholder="请输入手机号" />
			</view>
			<view class="phone-code">
				<view class="iconfont icon-yanzhengma"></view>
				<view class="container">
					<input placeholder="请输入验证码" v-model="phoneCode" type="number" maxlength="6" />
					<view class="code" v-bind:style="{ color: baseColor }" v-if="code == '获取验证码'" @click="getPhoneCode">{{ code }}</view>
					<view class="code" v-bind:style="{ color: baseColor }" v-else>{{ code }}</view>
				</view>
			</view>
			<view class="password">
				<view class="iconfont icon-mima"></view>
				<view class="container">
					<input class="password-input" type="text" :password="passwordSwitch" v-model="userPassword" placeholder="请输入新密码" />
					<view :class="{ iconfont: true, 'icon-bukejian': passwordSwitch, 'icon-1': !passwordSwitch }" @click="pwdSwitch"></view>
				</view>
			</view>
		</view>
		<button type="default" class="confirm-btn" v-bind:style="{ backgroundColor: baseColor }" @click="confirm">确认</button>
	</view>
</template>

<script>
import { warrantyLoginIn, changePhone, updatePassword } from '@/api/interface.js';
export default {
	props: {
		propIsShowLogo: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			logoImg: this.$imgDomain + '/paas/shop/2020063000000001/2021-03-29/5a4dd4f98cf7478ca522cf443e60e1ab.png',
			baseColor: '',
			passwordSwitch: true,
			code: '获取验证码',
			pass: true,
			userPhone: '',
			phoneCode: '',
			userPassword: ''
		};
	},
	mounted() {
		this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
	},
	methods: {
		navigateBack(){
			this.$qj.router.back();
		},
	
		pwdSwitch() {
			this.passwordSwitch = !this.passwordSwitch;
		},
		
		confirm() {
			if (!this.$qj.phoneValidation(this.userPhone)) {
				return;
			}
			if (!this.phoneCode.trim()) {
				this.$qj.message.alert('请输入验证码');
				return;
			}
			if (!this.userPassword.trim()) {
				this.$qj.message.alert('请输入新密码');
				return;
			}
			this.$qj.message.loading();
			this.$qj
				.http(this.$qj.domain)
				.get(updatePassword, {
					userPhone: this.userPhone,
					code: this.phoneCode,
					userPwsswd: this.userPassword
				})
				.then(res => {
					if(res.success){
						this.navigateBack();
					} else {
						this.$qj.message.alert(res.msg);
					}
				});
		},

		getPhoneCode() {
			if (!this.$qj.phoneValidation(this.userPhone)) {
				return;
			}
			this.$qj
				.http(this.$qj.domain)
				.post(changePhone.sendPhone, {
					userPhone: this.userPhone
				})
				.then(res => {
					if (res && res.success) {
						this.$qj.message.alert('验证码发送成功');
						let time = 60;
						const set = setInterval(() => {
							this.code = time-- + 's重新获取';
							this.pass = false;
							if (time < 0) {
								clearInterval(set);
								this.pass = true;
								this.code = '获取验证码';
							}
						}, 1000);
					}
				});
		}
	}
};
</script>

<style lang="less" scoped>
@import '@/common/css/common.less';

.forget-password {
	width: 100%;
	height: 100%;
	background-color: @white-color;
	.logo {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 36rpx;
		image {
			width: 201rpx;
			height: 166rpx;
		}
	}
	.input-container {
		margin: 0 auto;
		width: 591rpx;
		margin-top: 100rpx;
		font-size: 26rpx;
		.iconfont {
			color: #cccccc;
			padding-right: 20rpx;
		}
		.account {
			display: flex;
			align-items: center;
			width: 100%;
			height: 90rpx;
			input {
				width: 100%;
				height: 100%;
				background: none;
				border-bottom: 1rpx solid #e5e5e5;
				color: @color-333;
			}
		}
		.phone-code {
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			width: 100%;
			height: 90rpx;
			.container {
				display: flex;
				align-items: center;
				width: 100%;
				height: 100%;
				border-bottom: 1rpx solid #e5e5e5;
				input {
					flex: 1;
					width: 100%;
					height: 100%;
					background: none;
					color: @color-333;
				}
			}
		}
		.password {
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			width: 100%;
			height: 90rpx;
			.container {
				display: flex;
				align-items: center;
				width: 100%;
				height: 100%;
				border-bottom: 1rpx solid #e5e5e5;
				input {
					width: 100%;
					height: 100%;
					background: none;
					color: @color-333;
				}
				.iconfont {
					padding: 20rpx;
				}
			}
		}
	}
	.confirm-btn {
		color: @white-color;
		font-size: 30rpx;
		margin: 0 auto;
		margin-top: 77rpx;
		width: 591rpx;
		height: 84rpx;
		line-height: 84rpx;
		text-align: center;
		background: #374e80;
		border-radius: 42rpx;
		border: none;
	}
}
</style>
