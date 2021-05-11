<template>
	<view class="b2b-register">
		<view class="input-container">
			<!-- 企业名称 -->
			<view class="company-or-personal">
				<view class="iconfont icon-city"></view>
				<input class="company-personal-input" type="text" v-model="userinfoCompname" placeholder="请输入企业名称" />
			</view>

			<!-- 营业执照号 -->
         <!-- <view class="company-or-personal">
				<view class="iconfont icon-city"></view>
				<input class="company-personal-input" type="text" v-model="userinfoCertNo" placeholder="请输入营业执照号" />
			</view> -->
			<!-- 统一信用代码 -->
			<view class="company-or-personal">
				<view class="iconfont icon-city"></view>
				<input class="company-personal-input" type="text" @blur="animateWidth(userinfoCert2No)"  v-model="userinfoCert2No" placeholder="请输入统一信用代码(税号)" />
			</view>

			<view class="address-choose">
				<view class="iconfont icon-shouhuodizhi"></view>
				<view class="container" @click="chooseCity">
					<input type="text" :disabled="true" v-model="city" placeholder="请选择城市" />
					<view class="iconfont icon-jiantou12"></view>
				</view>
			</view>
			<view class="company-or-personal">
				<view class="iconfont icon-name-10"></view>
				<input class="company-personal-input" type="text" v-model="companyAddress" placeholder="请输入详细地址" />
			</view>

			<view class="Business">
				<div class="left">
					<h3>上传营业执照（正本）</h3>
					<h6>支持png、jpg格式的图片</h6>
				</div>
				<div class="right"><img :src="imgBusiness" @click="Business" /></div>
				<!-- <div class="right" @click="Business"> +</div> -->
			</view>


			<view class="company-or-personal">
				<view class="iconfont icon-name-10"></view>
				<input class="company-personal-input" type="text" v-model="userinfoCorp" placeholder="请输入真实姓名" />
			</view>
			<view class="company-or-personal">
				<view class="iconfont icon-name-10"></view>
				<input class="company-personal-input" type="text" v-model="userinfoCon" placeholder="请输入联系人姓名" />
			</view>
			<view class="account">
				<view class="iconfont icon-shouji"></view>
				<input class="account-input" type="number" maxlength="11" v-model="userinfoTel" placeholder="请输入联系人电话" />
			</view>

		</view>

		<button type="default" class="register-btn" v-if="isDisabled" v-bind:style="{ backgroundColor: baseColor }" @click="register">提交</button>
		<button type="default" disabled class="register-btn" v-else v-bind:style="{ backgroundColor: baseColor }" @click="register">提交</button>


		<!-- <u-picker mode="selector" v-model="distributorPicker" :default-selector="[0]" :range="distributorArray" range-key="qtypeQtypeName"
		 @confirm="distributorPickerConfirm"></u-picker>

		<u-picker mode="selector" v-model="channelPicker" :default-selector="[0]" :range="channelArray" range-key="channelName"
		 @confirm="channelPickerConfirm"></u-picker> -->
		<u-picker mode="region" v-model="cityPicker" :area-code="['11', '1101', '110101']" @confirm="cityPickerConfirm"></u-picker>
	</view>
</template>

<script>
	import {
		querySaveDealerChannel,
		queryDealerQualityQtype,
		changePhone,
		saveUserDealerByQuality,
		saveDealerUserinfoapply,
		saveUserDealer,
		uploadGoodsFile,
		uploadGoodsFiles,
		saveDealerUserinfoapplyNew,
		queryCompanyUserinfo
	} from '@/api/interface.js';
	import http from '@/api/http.js';
	export default {
		props: {
			propUserPhone: {
				type: String,
				default: ''
			},
			propPageState: {
				type: Number,
				default: 0
			},

		},

		data() {
			return {
				// 页面状态
				// 从审核失败页面或者授权手机号页面：1
				// 从账号密码登录界面：2
				// 上次注册填写的信息
				registerParams: {},
				// 新add
				// registerParams: this.propRegisterParams,
				logoImg: `${this.$qj.domain}/paas/shop-master/c-static/images/B2B/logo/120×120.png`,
				userType: 2,
				baseColor: '',

				userinfoCompname: '',
				city: '',
				userinfoCert2No: '',
				companyAddress: '',
				userinfoCorp: '',
				userinfoCon: '',
				userinfoTel: '',
				// userinfoCertNo: '',

				cityPicker: false,
				provinceCode: '',
				cityCode: '',
				areaCode: '',
				provinceName: '',
				cityName: '',
				areaName: '',
				userInfoCode: '',
				imgBusiness: `${this.$qj.domain}/paas/shop/2020063000000001/2021-03-29/eff2403e1bfa4cb88135fb8e6b64e676.jpg`,
				imgBusinessHttp: '',
				pageState:0,
				// userinfoType:2,
				inputUserPhone:'',
				userPhone:'',
				userInfoId:'',
				userInfoCode:'',
 				loginInfor:'',
				userinfoapplyType:'',
				isDisabled:true
			};
		},
		watch: {
			propUserPhone(newValue, oldValue) {
				this.userPhone = newValue;
				if (this.userPhone) {
					this.inputUserPhone = this.$qj.asterisk(this.userPhone);
				}
			},
			propPageState(newValue, oldValue) {
				this.pageState = newValue;
			},
		},
		onLoad(options) {
			this.loginInfor = this.$qj.storage.get('loginInfor');
			this.userinfoTel = this.loginInfor.userPhone
			this.userinfoCompname = this.loginInfor.merberCompname
			this.userinfoCorp = this.loginInfor.userName
			this.userPhone = options.userPhone;
			this.pageState = options.pageState ? options.pageState : 0;
			
			if(this.$qj.storage.get('loginInfor').userinfoType == '2'){
				this.userinfoapplyType = '2'
			}else{
				this.userinfoapplyType = '1'
			}
			
			if (options.registerParams) this.registerParams = JSON.parse(options.registerParams);
			if (this.registerParams != {}) {
				this.userType = this.registerParams.userinfoType;
				// this.distributor = this.registerParams.qualityQtypeName;
				// this.distributorCode = this.registerParams.qualityQtypeCode;
				// this.channel = this.registerParams.userinfoDischannelname;
				// this.channelCode = this.registerParams.userinfoDischannelcode;
				this.userinfoCompname = this.registerParams.userinfoCompname || this.loginInfor.merberCompname;
				// this.userinfoCertNo = this.registerParams.userinfoCertNo;
				this.userinfoCert2No = this.registerParams.userinfoCert2No;
				this.companyAddress = this.registerParams.companyAddress;
				this.userinfoCorp = this.registerParams.userinfoCorp || this.loginInfor.userName;
				this.userinfoCon = this.registerParams.userinfoCorp || this.loginInfor.userName;;
				this.userinfoTel = this.registerParams.userinfoTel || this.loginInfor.userPhone;
				

				this.city = this.registerParams.provinceName + this.registerParams.cityName + this.registerParams.areaName;
				this.provinceCode = this.registerParams.provinceCode;
				this.cityCode = this.registerParams.cityCode;
				this.areaCode = this.registerParams.areaCode;
				this.provinceName = this.registerParams.provinceName;
				this.cityName = this.registerParams.cityName;
				this.areaName = this.registerParams.areaName;

				this.userInfoCode = this.registerParams.userinfoCode;
				this.userInfoId = this.registerParams.userInfoId;
				if(this.registerParams.imgBusiness){
					this.imgBusiness = this.$qj.domain + this.registerParams.imgBusiness;
				}
				
				this.imgBusinessHttp = this.registerParams.imgBusiness;
			}
		},
		onShow() {},
		mounted() {
			this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
			this.userInfoCode = this.$qj.storage.get('loginInfor').userInfoCode
			this.userInfoId = this.$qj.storage.get('loginInfor').userInfoId
			// this.$qj.storage.set('userPhone', res.dataObj.userPhone);
			this.userPhone = this.$qj.storage.get('userPhone');
		},
		methods: {
			animateWidth(data){
				console.log('失去焦点',data)
				let params = {
					userinfoCert2No:data
				}
				http
					.get(queryCompanyUserinfo, params)
					.then(res => {
						if(res.total !=0){
							this.companyAddress  = res.rows[0].companyAddress							this.userinfoCompname = res.rows[0].userinfoCompname
						}
							console.log('res---===',res)
							// this.$qj.message.alert('认证信息提交失败');
						
					});
			},
			navigateBack() {
				this.$qj.router.back();
			},

			navigateTo(options) {
				this.$qj.router.push(options.url, options.query ? options.query : '');
			},

			redirectTo(options) {
				this.$qj.router.replace(options.url, options.query ? options.query : '');
			},
			/**
			 * 城市选择
			 */
			chooseCity() {
				this.cityPicker = true;
			},
			/**
			 * 地址选择器回调方法
			 */
			cityPickerConfirm(params) {
				this.city = params.province.label + params.city.label + params.area.label;
				this.provinceCode = params.province.value;
				this.cityCode = params.city.value;
				this.areaCode = params.area.value;
				this.provinceName = params.province.label;
				this.cityName = params.city.label;
				this.areaName = params.area.label;
			},

			/**
			 * 注册按钮
			 */
			register() {
				this.isDisabled = false
				let that = this
				console.log(1111111111111111)
				if (!this.userinfoCompname) {
					this.$qj.message.alert('请输入企业名称');
					this.isDisabled = true
					return;
				}
				// if (!this.$qj.phoneValidation(this.userPhone || this.inputUserPhone)) {
				// 	return;
				// }
				// if (!this.userinfoCertNo) {
				// 	this.$qj.message.alert('请输入营业执照号');
				// 	return;
				// }


				if (!(/[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g.test(this.userinfoCert2No))) {
					this.$qj.message.alert('请输入正确的信用代码');
					this.isDisabled = true
					return;
				}
				
	
				if (!this.city) {
					this.$qj.message.alert('请选择城市');
					this.isDisabled = true
					return;
				}
				if (!this.imgBusinessHttp) {
					this.$qj.message.alert('请上传营业执照');
					this.isDisabled = true
					return;
				}
				if (!this.userinfoCorp) {
					this.$qj.message.alert('请输入真实姓名');
					this.isDisabled = true
					return;
				}
				// if (!this.userinfoCon) {
				// 	this.$qj.message.alert('请输入联系人姓名');
				// 	return;
				// }
					if (this.userinfoTel && !this.$qj.phoneValidation(this.userinfoTel)) {
						this.isDisabled = true
						return;
					}
				//  注册接口
				let params = {

					// 公司名称
					userinfoCompname: this.userinfoCompname,
					// userinfoCertNo: this.userinfoCertNo,
					userinfoCert2No: this.userinfoCert2No,
					companyAddress: this.companyAddress,
					userinfoCorp: this.userinfoCorp,
					userinfoCon: this.userinfoCon,
					userinfoTel: this.userinfoTel,
					// 公司或者个人type
					userinfoType: this.userType,
					provinceCode: (this.provinceCode + '0000').slice(0,6),
					cityCode: (this.cityCode + '00').slice(0,6),
					areaCode: this.areaCode,
					provinceName: this.provinceName,
					cityName: this.cityName,
					areaName: this.areaName,
					userPhone: this.userPhone || this.inputUserPhone,

					userOpenid: this.$qj.storage.get('userOpenid'),
					userinfoCertUrl: this.imgBusinessHttp,
					userInfoId:this.userInfoId,
					userinfoapplyType:this.userinfoapplyType
				};
				if (this.userInfoCode) {
					params.userinfoCode = this.userInfoCode;
				}
				let httpUrl = [saveUserDealerByQuality, saveDealerUserinfoapply, saveUserDealerByQuality];

				let paramsArr = [{
						userinfoJosn: JSON.stringify(params),

					},
					{
						paramStr: JSON.stringify(params),
					},
					{
						userinfoJosn: JSON.stringify(params),
					}
				];

				http
					.get(saveDealerUserinfoapplyNew, paramsArr[1])
					.then(res => {
						if (res.success && res.dataObj) {
							// if (this.pageState == 0 || this.pageState == 2) {
								let options = {
									url: 'register/b2bRegisterCheck',
									query: {
										userPhone: this.userPhone || this.inputUserPhone 
									}
								};
								this.redirectTo(options);
							// } else {
							// 	this.navigateBack();
							// }
						} else if(res.msg){
							this.isDisabled = true
							this.$qj.message.alert(res.msg);
						}else{
							this.isDisabled = true
							this.$qj.message.alert('认证信息提交失败');
						}
					});
			},

			Business() {
				let that = this;
				uni.chooseImage({
					// count:  允许上传的照片数量
					count: 5,
					// sizeType:  original 原图，compressed 压缩图，默认二者都有
					sizeType: ['original', 'compressed'],
					sourceType: ['album'], //从相册选择
					success(res) {
						that.imgBusiness = res.tempFiles[0].path;
						uni.previewImage({
							// 对选中的图片进行预览
							urls: res.tempFilePaths,
							success() {
								uni.uploadFile({
									url: that.$qj.domain + uploadGoodsFiles,
									// url: that.$qj.domain +'/web/rs/goodsFile/uploadGoodsFile.json',
									filePath: res.tempFilePaths[0],
									name: 'file',
									header: {
										'Content-Type': 'multipart/form-data',
										'saas-Agent': getApp().globalData.saasAgent
									},
									success: uploadFileRes => {
										if (JSON.parse(uploadFileRes.data).fileUrl) {
											that.imgBusinessHttp = JSON.parse(uploadFileRes.data).fileUrl;
											that.$qj.message.alert('上传成功');
										}
									}
								});
							}
						});
					}
				});
			},

		}
	};
</script>

<style lang="less" scoped>
	@import '@/common/css/common.less';

	.b2b-register {
		width: 100%;
		height: 100%;
		background: @white-color;


		.distributor {
			width: 591rpx;
			height: 90rpx;
			margin: 0 auto;
			display: flex;
			align-items: center;
			font-size: 26rpx;
			color: @color-333;
			border-bottom: 1rpx solid #e5e5e5;

			input {
				flex: 1;
				width: 100%;
				height: 100%;
				background: none;
			}

			.iconfont {
				color: #cccccc;
			}
		}

		.channel {
			width: 591rpx;
			height: 90rpx;
			margin: 0 auto;
			display: flex;
			align-items: center;
			font-size: 26rpx;
			color: @color-333;
			border-bottom: 1rpx solid #e5e5e5;

			input {
				flex: 1;
				width: 100%;
				height: 100%;
				background: none;
			}

			.iconfont {
				color: #cccccc;
			}
		}

		.user-type {
			padding-left: 76rpx;
			padding-top: 30rpx;
			display: flex;
			align-items: center;

			text {
				padding-left: 10rpx;
				color: @color-333;
				font-size: 26rpx;
			}

			.personal {
				margin-left: 50rpx;
			}
		}

		.input-container {
			margin: 0 auto;
			width: 591rpx;
			margin-top: 30rpx;
			font-size: 26rpx;

			.iconfont {
				color: #cccccc;
				padding-right: 20rpx;
			}

			.company-or-personal {
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

			.address-choose {
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

					.iconfont {
						padding: 20rpx;
					}
				}
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

			.again-password {
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

		.register-btn {
			color: @white-color;
			font-size: 30rpx;
			margin: 0 auto;
			margin-top: 57rpx;
			width: 591rpx;
			height: 84rpx;
			line-height: 84rpx;
			text-align: center;
			// background: rgba(244, 163, 56, 1);
			background: #374e80;
			border-radius: 42rpx;
			border: none;
			
		}

		.user-agreement {
			display: flex;
			padding-left: 76rpx;
			align-items: center;
			padding-top: 30rpx;
		}

		.login {
			display: flex;
			justify-content: flex-end;
			margin-top: 20rpx;
			padding-right: 91rpx;
		}

		.Business {
			display: flex;
			justify-content: space-between;
			margin: 0 30rpx;
			height: 182rpx;
			align-items: center;
			border-bottom: 1rpx solid #e5e5e5;

			.left {
				h3 {
					font-size: 32rpx;
					margin-bottom: 13rpx;
					font-weight: 400;
					color: rgba(0, 0, 0, 1);
				}

				h6 {
					font-size: 24rpx;
					color: #999999;
				}
			}

			.right {
				img {
					width: 132rpx;
					height: 132rpx;
					// width: 100%;
				}
			}
		}
	}
</style>
