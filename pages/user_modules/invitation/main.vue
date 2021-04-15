<template>
	<div class="invitation">
		<commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon"></commonHeader>
		<div class="content" v-if="shsettlObj" :style="{ backgroundImage: 'url(' + imgDomain + shsettlObj.shsettlUrl1 + ')' }">
			<div class="outList">
				<div class="list">
					<div class="one t-box">
						<div class="left">手机号</div>
						<div class="right"><input placeholder="请输入手机号" type="text" v-model="phone" /></div>
					</div>
					<div class="one t-box codeList">
						<div class="left">验证码</div>
						<div class="right"><input placeholder="请输入验证码" type="text" v-model="vCode" /></div>
						<div @click="getAuthCodes" class="code">{{ vCodeTitle }}</div>
					</div>
					<div class="one t-box">
						<div class="left">邀请码</div>
						<div class="right"><input disabled="disabled" placeholder type="text" v-model="invitationCode" /></div>
					</div>
				</div>

				<div class="button"><p @click="reg" v-bind:style="{ backgroundColor: baseColor }">马上注册</p></div>
			</div>
		</div>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { changePhone, invitationRegister, getShsettlByCode, getProappinfo, getShsettlByType } from '@/api/interface.js';
import commonHeader from '@/components/communal/commonHeader.vue';
import { phoneValidation } from '@/utils/formatPhone.js';
export default {
	components: {
		commonHeader
	},
	onLoad(options) {
		// 获取传参
		console.log(options);
		if(!options) return;
		let code = '';
		if(options.scene){
			code = decodeURIComponent(options.scene).split("=")[1];
		}
		if (options.code) {
			code = options.code;
		}
		this.invitationCode = code;
		this.$router.push(
			'authorization',
			{
				code: this.invitationCode,
				isInviteRegister: true
			},
			{ stay: 500 }
		);
	},
	onShow() {
		this.userOpenid = this.$storage.get('userOpenid');
		// 优化，用户点击返回之后，判断如果没有授权过，需要提示用户再次进入授权页面
		if (!this.userOpenid) {
		}
		this.title = '邀请注册';
	},
	data() {
		return {
			isShow: false,
			imgDomain: this.$imgDomain,
			baseColor: '',
			title: '',
			leftIcon: false,
			rightIcon: false,
			shsettlCode: '',
			invitationCode: '',
			phone: '',
			vCode: '',
			vCodeTitle: '获取验证码',
			getCodeNum: 0, //监听是否获取验证码
			authCode: 60,
			firstClick: true,
			shsettlObj: '',
			userOpenid: ''
		};
	},
	mounted() {
		this.getBaseInfo();
		this.getShsettlByType();
	},
	methods: {
		getBaseInfo() {
			http.get(getProappinfo).then(res => {
				this.$storage.set('proappEnvName', res.proappEnvName);
				this.$storage.set('baseColor', res.proappEnvTheme);
				this.$storage.set('unitPrice', JSON.parse(res.proappEnvOpenconf));
				this.$state.set('baseColor', res.proappEnvTheme);
				this.$state.set('unitPrice', JSON.parse(res.proappEnvOpenconf));
				this.baseColor = `#${this.$state.baseColor}`;
				this.$setTitle(this.$storage.get('proappEnvName'));
				wx.setNavigationBarColor({
					frontColor: '#FFFFFF',
					backgroundColor: this.baseColor
				});
			});
		},

		getShsettlByType() {
			http.get(getShsettlByType).then(res => {
				console.log(res);
				this.shsettlObj = res;
			});
		},

		getAuthCodes() {
			//获取验证码
			if (phoneValidation(this.phone) && this.firstClick) {
				this.firstClick = false;
				http.post(changePhone.sendPhone, {
					userPhone: this.phone
				})
					.then(res => {
						if (!res.success) {
							this.$message.alert(res.msg);
							setTimeout(() => {
								this.phone = '';
								this.firstClick = true;
							}, 500);
						} else {
							var auth_timeTimer = setInterval(() => {
								//延迟1秒发送
								this.authCode--;
								this.vCodeTitle = '重新发送' + this.authCode + '秒';
								if (this.authCode <= 0) {
									clearInterval(auth_timeTimer);
									this.vCodeTitle = '获取验证码';
									this.authCode = 60;
									this.firstClick = true;
								}
							}, 1000);
						}
					})
					.catch(err => {
						this.firstClick = true;
						this.$message.alert(err);
					});
			}
		},
		reg() {
			//注册
			if (phoneValidation(this.phone)) {
				let result = false;
				this.vCode === '' ? this.$message.alert('验证码未输入') : (result = true);
				let regs = /^[a-zA-Z0-9]{6,12}$/;
				if (result) {
					//开始请求注册接口
					let data = {
						userPhone: this.phone,
						code: this.vCode,
						userinfoInvite: this.invitationCode,
						userOpenid: this.userOpenid
						// shsettlCode: this.shsettlCode
					};
					this.$message.loading();
					http.get(invitationRegister, data)
						.then(res => {
							
							if (res.success) {
								this.$message.alert('注册成功');
								// let loginInfor = JSON.parse(res.dataObj.userInfo);
								// this.$storage.set('loginInfor', loginInfor);
								let cookie = res.dataObj.ticketTokenid;
								this.$storage.set('userId', res.dataObj.userId);
								this.$storage.set('sessionid', cookie);
								let miniToken = this.$storage.get('miniToken');

								let miniCookie = miniToken + '=' + cookie + '; Domain=' + this.$domain.substring(8) + '; Path=/';
								this.$storage.set('miniUserName', miniCookie);
								this.$message.loading();
								setTimeout(() => {
									this.$message.hide();
								}, 1000);

								this.$router.reOpen('mainindex', {}, { stay: 1000 });
							} else {
								this.$message.alert(res.msg);
							}
						})
						.catch(err => {
							console.log(err);
							this.$message.hide();
						});
				}
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '~@/common/css/common.less';
.invitation {
	width: 100%;
	height: 100%;
	background-color: @white-color;
	position: relative;
	.content {
		position: absolute;
		top: 93rpx;
		left: 0;
		bottom: 0;
		right: 0;
		background-position: 100% 100%;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		.outList {
			/*position: relative;*/
			position: absolute;
			bottom: 50rpx;
			left: 38rpx;
			width: 674rpx;
			margin: 0 auto;
			height: 480rpx;
			/*background-color: pink;*/
			background-color: #ffffff;
			border-radius: 20rpx;
			/*opacity: 0.6;*/
			-moz-box-shadow: 0rpx 0rpx 30rpx #eead0e inset;
			-webkit-box-shadow: 0rpx 0rpx 30rpx #eead0e inset;
			box-shadow: 0rpx 0rpx 30rpx #eead0e inset;
			.list {
				position: absolute;
				padding: 10rpx;
				bottom: 140rpx;
				left: 80rpx;
				right: 80rpx;
				height: 275rpx;
				.one {
					display: flex;
					border-bottom: 1rpx solid #f1f1f1;
					align-items: center;
					height: 86rpx;
					.left {
						padding-left: 20rpx;
						width: 110rpx;
						line-height: 86rpx;
						font-size: 28rpx;
					}
					.right {
						height: 84rpx;
						line-height: 84rpx;
						input {
							height: 84rpx;
							padding-left: 25rpx;
							background-color: #ffffff;
							font-size: 24rpx;
						}
					}
				}
				.codeList {
					position: relative;
					.right {
						input {
							width: 180rpx;
						}
					}
					.code {
						line-height: 40rpx;
						font-size: 24rpx;
						position: absolute;
						width: 165rpx;
						right: 0;
						color: #b6b6b6;
						height: 40rpx;
						border-left: 1rpx solid #f1f1f1;
						text-align: right;
					}
				}
			}

			.button {
				position: absolute;
				bottom: 40rpx;
				left: 78rpx;
				width: 520rpx;
				text-align: center;
				p {
					height: 80rpx;
					border-radius: 40rpx;
					line-height: 80rpx;
					font-size: 28rpx;
					color: #ffffff;
					// background-color: #e1504b;
				}
			}
		}
	}
}
</style>
