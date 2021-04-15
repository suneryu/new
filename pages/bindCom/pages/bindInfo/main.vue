<template>
	<view class="b2b-register">
		<view class="input-container">
			<!-- 企业名称 -->
			<view class="company-or-personal">
				<view class="inputLabel">企业名称：</view>
				<input class="company-personal-input" type="text" v-model="userinfoCompname" disabled placeholder="请输入企业名称" />
			</view>

			<!-- 营业执照号 -->
			<!-- <view class="company-or-personal">
				<view class="inputLabel">营业执照号：</view>
				<input class="company-personal-input" type="text" v-model="userinfoCertNo" placeholder="请输入营业执照号" />
			</view> -->
			<!-- 统一信用代码 -->
			<view class="company-or-personal">
				<view class="inputLabel">统一信用代码：</view>
				<input class="company-personal-input" type="text" v-model="userinfoCert2No" disabled placeholder="请输入统一信用代码(税号)" />
			</view>

			<view class="address-choose">
				<view class="inputLabel">城市：</view>
				<view class="container" @click="chooseCity">
					<input type="text" :disabled="true" v-model="city" placeholder="请选择城市" />
					<view class="iconfont icon-jiantou12"></view>
				</view>
			</view>
			<view class="company-or-personal">
				<view class="inputLabel">详细地址：</view>
				<input class="company-personal-input" type="text" v-model="companyAddress" placeholder="请输入详细地址" />
			</view>

			<view class="Business">
				<div class="left">
					<h3>上传营业执照:</h3>
					<!-- <h6>支持png、jpg格式的图片</h6> -->
					<div style="width: 122px;color: red;">注意：上传图片需为营业执照复印件并加盖公章</div>
				</div>
				<div class="right"><img :src="imgBusiness" @click="Business" /></div>
			</view>

			<view class="company-or-personal">
				<view class="inputLabel">真实姓名：</view>
				<input class="company-personal-input" type="text" v-model="userinfoCorp" placeholder="请输入真实姓名" />
			</view>
			<view class="company-or-personal">
				<view class="inputLabel">联系人姓名：</view>
				<input class="company-personal-input" type="text" v-model="userinfoCon" placeholder="请输入联系人姓名" />
			</view>
			<view class="account">
				<view class="inputLabel">联系人电话：</view>
				<input class="account-input" type="number" maxlength="11" v-model="userinfoTel" placeholder="请输入联系人电话" />
			</view>

		</view>

		<button type="default" class="register-btn" v-bind:style="{ backgroundColor: baseColor }" @click="register">提交</button>
		<u-picker mode="region" v-model="cityPicker" :area-code="['11', '1101', '110101']" @confirm="cityPickerConfirm"></u-picker>
	</view>
</template>

<script>
	import {
		saveUserDealerByQuality,
		saveDealerUserinfoapply,
		saveUserDealer,
		uploadGoodsFile,
		uploadGoodsFiles,
		saveDealerUserinfoapplyNew,
		userInfoApplyByPhone,
		userapplyStateAndAuth,
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
				pageState: 0,
				// userinfoType:2,
				inputUserPhone: '',
				userPhone: '',
				userInfoId: '',
				loginInfor: '',
				userinfoapplyType: '3',
				checkRegisterAudit:''
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
		created(){this.getComInfo()},
		onLoad(options) {
			this.userinfoTel = options.userPhone
			this.userPhone = options.userPhone
			

			if (options.registerParams) this.registerParams = JSON.parse(options.registerParams);
			if (this.registerParams != {}) {
				this.userType = this.registerParams.userinfoType;
				
				this.userinfoCompname = this.registerParams.userinfoCompname ;
				// this.userinfoCertNo = this.registerParams.userinfoCertNo;
				this.userinfoCert2No = this.registerParams.userinfoCert2No;
				this.companyAddress = this.registerParams.companyAddress;
				this.userinfoCorp = this.registerParams.userinfoCorp;
				this.userinfoCon = this.registerParams.userinfoCorp;;
				this.userinfoTel = this.registerParams.userinfoTel;


				this.city = this.registerParams.provinceName + this.registerParams.cityName + this.registerParams.areaName;
				this.provinceCode = this.registerParams.provinceCode;
				this.cityCode = this.registerParams.cityCode;
				this.areaCode = this.registerParams.areaCode;
				this.provinceName = this.registerParams.provinceName;
				this.cityName = this.registerParams.cityName;
				this.areaName = this.registerParams.areaName;

				this.userInfoCode = this.registerParams.userinfoCode;
				this.userInfoId = this.registerParams.userInfoId;
				// if (this.registerParams.imgBusiness) {
				// 	this.imgBusiness = this.$qj.domain + this.registerParams.imgBusiness;
				// }

				// this.imgBusinessHttp = this.registerParams.imgBusiness;
			}
		},
		onShow() {},
		mounted() {
			this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
			// this.userInfoCode = this.$qj.storage.get('loginInfor').userInfoCode
			// this.userInfoId = this.$qj.storage.get('loginInfor').userInfoId
			// this.userPhone = this.$qj.storage.get('userPhone');
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
				let that = this

				if (!this.userinfoCompname) {
					this.$qj.message.alert('请输入企业名称');
					return;
				}
			
				if (!(/[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g.test(this.userinfoCert2No))) {
					this.$qj.message.alert('请输入正确的信用代码');
					return;
				}

				if (!this.city) {
					this.$qj.message.alert('请选择城市');
					return;
				}
				if (!this.imgBusinessHttp) {
					this.$qj.message.alert('请上传营业执照');
					return;
				}
				if (!this.userinfoCorp) {
					this.$qj.message.alert('请输入真实姓名');
					return;
				}
				
				if (this.userinfoTel && !this.$qj.phoneValidation(this.userinfoTel)) {
					return;
				}

				//  
				let params = {

					// 公司名称
					userinfoCompname: this.userinfoCompname,
					// userinfoCertNo: this.userinfoCertNo,
					userinfoCert2No: this.userinfoCert2No,
					companyAddress: this.companyAddress,
					userinfoCorp: this.userinfoCorp,
					userinfoCon: this.userinfoCorp,
					userinfoTel: this.userinfoTel,
					// 公司或者个人type
					userinfoType: this.userType,
					provinceCode: this.provinceCode + '0000',
					cityCode: this.cityCode + '00',
					areaCode: this.areaCode,
					provinceName: this.provinceName,
					cityName: this.cityName,
					areaName: this.areaName,
					userPhone: this.userPhone || this.inputUserPhone,

					userOpenid: this.$qj.storage.get('userOpenid'),
					userinfoCertUrl: this.imgBusinessHttp,
					userInfoId: this.userInfoId,
					userinfoapplyType: this.userinfoapplyType
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
								url: 'bindCom/pages/bindCheck',
								query: {
									userPhone: this.userPhone || this.inputUserPhone || $storage.get('bindPhone'),
									userInfoCode:this.userInfoCode
								}
							};
							this.redirectTo(options);
							// } else {
							// 	this.navigateBack();
							// }
						} else if (res.msg) {
							this.$qj.message.alert(res.msg);
						} else {
							this.$qj.message.alert('认证信息提交失败');
						}
					});
			},
			// 获取企业信息
			getComInfo() {
				let that = this
				let params = {}
				params.userPhone = this.userPhone || this.$storage.get('bindPhone');
				http
					.get(userInfoApplyByPhone, params)
					.then(res => {
						if (res) {
							this.userinfoCompname = res.userinfoCompname;
							// this.userinfoCertNo = res.userinfoCertNo;
							this.userinfoCert2No = res.userinfoCert2No;
							this.city = (res.provinceName ? res.provinceName :'') + (res.cityName ? res.cityName:'')+ (res.areaName ? res.areaName:'');
							this.companyAddress = res.companyAddress;
							// this.imgBusiness = this.$qj.domain + res.userinfoCertUrl;
							this.userinfoCorp = res.userinfoCorp;
							this.userinfoCon = res.userinfoCorp;
							this.userinfoTel = res.userinfoTel;
			
							this.provinceCode = res.provinceCode;
							this.provinceName = res.provinceName;
							this.cityCode = res.cityCode;
							this.cityName = res.cityName;
							this.areaCode = res.areaCode;
							this.areaName = res.areaName;
							this.userinfoType = res.userinfoType;
							this.qualityQtypeCode = res.qualityQtypeCode;
							this.qualityQtypeName = res.qualityQtypeName;
							this.userinfoDischannelcode = res.userinfoDischannelcode;
							this.userinfoDischannelname = res.userinfoDischannelname;
							this.userinfoPhone = res.userinfoPhone;
							// this.failReason = res.umUserinfoapplyDomain.memo
							this.userInfoCode = res.userinfoCode;
							this.$storage.set('bindUserCode',res.userinfoCode)
							this.userinfoId = res.userinfoId
							this.memoauthFileurl = this.$qj.domain + res.userinfoCert1Url
			
							this.registerParams = {
								userinfoCompname: res.userinfoCompname,
								// userinfoCertNo: res.userinfoCertNo,
								userinfoCert2No: res.userinfoCert2No,
								city: res.provinceName + res.cityName + res.areaName,
								companyAddress: res.companyAddress,
								// imgBusiness: res.userinfoCertUrl,
								userinfoCorp: res.userinfoCorp,
								userinfoCon: res.userinfoCorp,
								userinfoTel: res.userinfoTel,
			
								provinceCode: res.provinceCode,
								provinceName: res.provinceName,
								cityCode: res.cityCode,
								cityName: res.cityName,
								areaCode: res.areaCode,
								areaName: res.areaName,
								userinfoType: res.userinfoType,
								qualityQtypeCode: res.qualityQtypeCode,
								qualityQtypeName: res.qualityQtypeName,
								userinfoDischannelcode: res.userinfoDischannelcode,
								userinfoDischannelname: res.userinfoDischannelname,
								userinfoPhone: res.userinfoPhone,
								// this.failReason = res.umUserinfoapplyDomain.memo
								userInfoCode: res.userinfoCode,
								userinfoId: res.userinfoId,
								memoauthFileurl: res.userinfoCert1Url
							}
							// this.getAuthState(res.userinfoCode)
						} else {
							this.$qj.message.alert(res.msg);
						}
			
					});
			
			},
			// 获取授权状态
			// getAuthState(userinfoCode) {
			// 	let that = this
			// 	let paramsStatus = {}
			// 	paramsStatus.userCode = userinfoCode
			// 	this.$qj
			// 		.http(this.$qj.domain)
			// 		.get(userapplyStateAndAuth, paramsStatus)
			// 		.then(res => {
			// 			 this.checkRegisterAudit = res.checkRegisterAudit
			
			// 		});
			
			// },

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
									},
									fail(){
										that.$qj.message.alert('上传失败');
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
            .inputLabel{
				width: 110px;
			}
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
			// margin: 0 30rpx;
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
