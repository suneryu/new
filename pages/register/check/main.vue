<template>
	<view class="b2b-register">
		<view class="input-container">
			<view class="company-or-personal">
				<!-- <view class="iconfont icon-city"></view> -->
				<view class="inputLabel">企业名称：</view>

				<input class="company-personal-input" type="text" disabled v-model="userinfoCompname" />
			</view>

			<!-- 营业执照号 -->
<!-- 			<view class="company-or-personal">
				<view class="inputLabel">营业执照号：</view>
				<input class="company-personal-input" type="text" disabled v-model="userinfoCertNo" />
			</view> -->

			<view class="company-or-personal">
				<view class="inputLabel">真实姓名：</view>
				<input class="company-personal-input" type="text" v-model="userinfoCorp" disabled />
			</view>

			<view class="imgBusiness">
				<view class="inputLabel">营业执照：</view>
				<img :src="imgBusiness" />
			</view>

            <view class="imgBusiness">
				<h3>上传授权书: </h3>
				<h6>支持png、jpg格式的图片</h6>
				<div>
				   注意：
				   <!-- <span style="color:red" @click="downLodeFile">点击下载授权书模板</span>，填写后加盖公章拍照上传 -->
				   <span style="color:red" @click="savePhoto">点击下载授权书模板</span>，填写后加盖公章拍照上传
				</div>
				<img :src="memoauthFileurl" @click="Business" />
			</view>
			<!-- <view class="Business">
				<div class="left">
					<h3>上传授权书</h3>
					<h6>支持png、jpg格式的图片</h6>
				</div>
				<div class="right"><img :src="memoauthFileurl" @click="Business" /></div>
			</view> -->
		</view>

		<button type="default" class="register-btn" v-bind:style="{ backgroundColor: baseColor }" @click="register" >提交</button>


		<!-- <u-picker mode="selector" v-model="distributorPicker" :default-selector="[0]" :range="distributorArray" range-key="qtypeQtypeName"
		 @confirm="distributorPickerConfirm"></u-picker>

		<u-picker mode="selector" v-model="channelPicker" :default-selector="[0]" :range="channelArray" range-key="channelName"
		 @confirm="channelPickerConfirm"></u-picker> -->
		<!-- <u-picker mode="region" v-model="cityPicker" :area-code="['11', '1101', '110101']" @confirm="cityPickerConfirm"></u-picker> -->
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
		saveDealerapplyNewByQui,
		userapplyStateAndAuth
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
				userType: 2,
				baseColor: '',

				userinfoCompname: '',
				userinfoCorp: '',

				// userinfoCertNo: '',

				imgBusiness: '',
				memoauthFileurl: `${this.$qj.domain}/paas/shop/2020063000000001/2021-03-29/eff2403e1bfa4cb88135fb8e6b64e676.jpg`,
				aaaa: `${this.$qj.domain}/paas/shop/2020063000000001/2021-03-29/eff2403e1bfa4cb88135fb8e6b64e676.jpg`,
				imgBusinessHttp: '',
				pageState: 0,
				// userinfoType:2,
				inputUserPhone: '',
				userPhone: '',
				userInfoId:'',
				userInfoCode:'',
				userinfoCert2No:'',
				userinfoapplyType:'0',
				checkModifyAudit:'',
				provinceCode:'',				provinceName:'',				cityCode:'',				cityName:'',				areaName:'',				areaCode:''
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
			this.userPhone = options.userPhone;
			this.pageState = options.pageState ? options.pageState : 0;
			if (options.registerParams) this.registerParams = JSON.parse(options.registerParams);
			console.log('---------------')
			console.log('---------------',JSON.parse(options.registerParams))
			if (this.registerParams != {}) {
				this.provinceCode= this.registerParams.provinceCode;
				this.provinceName= this.registerParams.provinceName;
				this.cityCode= this.registerParams.cityCode;
				this.cityName= this.registerParams.cityName;
				this.areaName= this.registerParams.areaName;
				this.areaCode= this.registerParams.areaCode;
				this.userType = this.registerParams.userinfoType;
				// this.distributor = this.registerParams.qualityQtypeName;
				// this.distributorCode = this.registerParams.qualityQtypeCode;
				// this.channel = this.registerParams.userinfoDischannelname;
				// this.channelCode = this.registerParams.userinfoDischannelcode;
				this.userinfoCompname = this.registerParams.userinfoCompname;
				// this.userinfoCertNo = this.registerParams.userinfoCertNo;
				this.userinfoCorp = this.registerParams.userinfoCorp;
				this.userInfoCode = this.registerParams.userinfoCode;
				
				this.userInfoId = this.registerParams.userInfoId;
				this.imgBusiness = this.$qj.domain + this.registerParams.imgBusiness;
				this.imgBusinessHttp = this.registerParams.imgBusiness;
				
				console.log('this.registerParams.memoauthFileurl',this.registerParams.memoauthFileurl)
				if(this.registerParams.memoauthFileurl != null && this.registerParams.memoauthFileurl !='1'){
					this.memoauthFileurl = this.$qj.domain + this.registerParams.memoauthFileurl;
				}else{
					this.memoauthFileurl  = this.aaaa
				}
			}
			console.log('this.userPhone111111----',this.userPhone)
			console.log('this.userInfoCode111111111----',this.userInfoCode)
		},
		onShow() {},
		created(){
			
		},
		mounted() {
			this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
			this.userInfoCode = this.$qj.storage.get('loginInfor').userInfoCode
			this.userInfoId = this.$qj.storage.get('loginInfor').userInfoId
			this.userPhone = this.$qj.storage.get('userPhone');
					
				
			this.getAuthState()
		},
		methods: {
			savePhoto() {
				let data = this.$domain + '/sqs.png';
				console.log('data', data)
				const _this = this;
				wx.getImageInfo({
					src: data,
					success: function(res) {
						wx.saveImageToPhotosAlbum({
							filePath: res.path,
							success(result) {
			
								// _this.setData({ show: false });
								wx.showToast({
									title: '保存成功',
									icon: 'success',
									duration: 2000
								})
							},
							fail(err) {
								if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
									wx.openSetting({
										success(settingdata) {
											if (settingdata.authSetting[
													'scope.writePhotosAlbum']) {
												_this.savePhoto()
											} else {
												wx.showToast({
													title: '获取权限失败,无法保存图片',
													icon: 'success',
													duration: 2000
												})
											}
										}
									})
								}
							}
						})
					}
				})
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
			downLodeFile(){
				uni.downloadFile({
				  url: this.$domain + '/paas/shop/2020063000000001/2021-03-25/277c0621c99a4e5a8fb96bbf360a5f01.png', //仅为示例，并非真实的资源
				  success (res) {
					  console.log(res,'-----')
				    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
				    if (res.statusCode === 200) {
				      uni.saveFile({
				      	tempFilePath: res.tempFilePaths,
				      	      success: function (res) {
								  console.log(res,'====')
				      	        var savedFilePath = res.savedFilePath;
				      	      }
				      })
				    }
				  }
				})
			},

			register() {
				if(this.checkModifyAudit == 3){
					this.$qj.message.alert('企业已授权，请不要重复提交');
					return;
				}
				if(this.checkModifyAudit == 6){
					this.$qj.message.alert('授权申请中，请不要重复提交');
					return;
				}
				

				if (!this.imgBusinessHttp || this.memoauthFileurl  == this.aaaa) {
					this.$qj.message.alert('请上传授权书');
					return;
				}
				console.log('this.userPhone----',this.userPhone)
				console.log('this.userInfoCode----',this.userInfoCode)
				let params = {

					provinceCode:this.provinceCode,
						provinceName: this.provinceName,
						cityCode: this.cityCode,
						cityName: this.cityName,
						areaName: this.areaName,
						areaCode: this.areaCode,
					// 公司名称
					userinfoCompname: this.userinfoCompname,
					// userinfoCertNo: this.userinfoCertNo,
					userinfoCorp: this.userinfoCorp,

					// 公司或者个人type
					userinfoType: this.userType,

					userPhone: this.userPhone || this.inputUserPhone,

					userOpenid: this.$qj.storage.get('userOpenid'),
					// userinfoCertUrl: this.imgBusinessHttp,
					userinfoCert1Url: this.imgBusinessHttp,
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

				// http.get(getPersonal, {
				// 	userId: this.$storage.get('userId')
				// }).then(res => {
				// });
				http
					.get(saveDealerapplyNewByQui, paramsArr[1])
					.then(res => {
						if (res.success && res.dataObj) {
							// if (this.pageState == 0 || this.pageState == 2) {
								let options = {
									url: 'register/checkSuccess',
									query: {
										userPhone: this.userPhone || this.inputUserPhone
									}
								};
								this.redirectTo(options);
							// } else {
							// 	this.navigateBack();
							// }
						} else {
							this.$qj.message.alert(res.msg);
						}
					});
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
						console.log('获取授权转台--',res)
		    			 this.checkModifyAudit = res.checkModifyAudit
		    
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
		    			that.memoauthFileurl = res.tempFiles[0].path;
		    			uni.previewImage({
		    				// 对选中的图片进行预览
		    				urls: res.tempFilePaths,
		    				success() {
		    					uni.uploadFile({
		    						url: that.$qj.domain + uploadGoodsFiles,
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
		},

	};
</script>

<style lang="less" scoped>
	@import '@/common/css/common.less';

	.b2b-register {
		width: 100%;
		height: 100%;
		background: @white-color;

		.imgBusiness {

			image {
				width: 40px;
				height: 40px;

			}
		}
		.inputLabel{
			width: 120px;
		}

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
