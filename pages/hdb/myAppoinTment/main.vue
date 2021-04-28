<template>
	<div class="homepage-content">
		<div v-for="(item,index) in Buyers" :key="index">
			<div class="search-box">
				<div class="box-center" style="display: flex;">
					<div style="width: 65%;">预约编号：
						<span>{{item.scontractId}}</span>
					</div>
					<div style="width: 35%; text-align: right;">{{item.memberGname}}</div>
				</div>
			</div>
			<div>
				<div
					style="height: 100px; margin-bottom: 3px; border-bottom: 10px solid #E0E0E0;margin-top: 5px;padding: 0 10px 0 10px">
					<div style="display: flex;">
						<div style="width: 80%; font-size: 17px;">{{item.scontractName}}</div>
					</div>
					<div style="display: flex; margin: 5px 0;">
						<div style="width: 80%; font-size: 12px;">{{item.contractRemark}}
						</div>
						<div style="width: 20%; font-size: 12px;text-align: right;">
							<span style="color: #007AFF; text-decoration: underline;" @click='preview(item)'>预览合同</span>
						</div>
					</div>
					<div style="display: flex;font-size: 12px;margin: 10px 0;">
						<div style="width: 100%;">合同签订时间：
							<span>{{item.goodsPmbillno}}</span>
							<button class="buttonClass" @click="salesperson(item)" v-if="item.dataState != 0">联系销售员</button>
						</div>
					</div>
					<div style="display: flex; font-size: 12px;border-top: 1px solid #E0E0E0;">
						<div style="width: 40%; color: #007AFF" v-if="item.dataState == 0">待接洽</div>
						<div style="width: 40%; color: #007AFF" v-if="item.dataState == 1">接洽中</div>
						<div style="width: 40%; color: #007AFF" v-if="item.dataState == 2">服务完成</div>
					</div>
				</div>
			</div>
		</div>
		<view class="popup" v-show="htImg">
			<view class="htImage">
				<div style='text-align: right;font-size: 18px; color: azure;font-weight: 800;'><span
						@click='htImg = false'>关闭</span></div>
				<img class="htImg" :src="img + fileUrl" @click='savePhoto(img + fileUrl)' />
				<div style='font-size: 16px;font-weight: 900;color: #fff;'>点击图片进行下载</div>
			</view>
		</view>
	</div>
</template>

<script>
	import vueTabBar from '@/components/communal/vueTabBar';
	import http from '@/api/http.js';
	import {
		$storage,
		$router,
		$message
	} from '@/utils/prototype/vue.js';
	import {
		queryScontractPage,
		queryScontractFilePage
	} from '@/api/interfaceHDB.js';
	export default {
		data() {
			return {
				fileUrl: "", // 图片的url
				htImg: false, //图片点击展示
				img: this.$imgDomain, // 域名
				searchValue: '',
				companyPack: [],
				Buyers: [],
				options: '',
				nullImg: this.$qj.imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noSearchResult.png',
			}
		},
		mounted() {
			this.getdata()
		},
		// onLoad(options){
		// 	this.options = options.userinfoPhone
		// },
		methods: {
			salesperson(item) {
				let showHtml ="姓名:"+item.contractType+'\r\n' + "电话:"+item.contractTypepro
				wx.showModal({
					title: "销售员信息",
					content: showHtml,
					cancelText: '关闭',
					confirmText: '一键拨号',
					success: res => {
						if (res.confirm) {
							this.gocall(item)
						}
					}
				});
			},
			// 一键拨号
			gocall(item) {
				console.log(1111)
				uni.makePhoneCall({

					// 手机号
					phoneNumber: item.goodsPbillno,

					// 成功回调
					success: (res) => {
						console.log('调用成功!')
					},

					// 失败回调
					fail: (res) => {
						console.log('调用失败!')
					}

				});
			},
			getdata() {
				http.get(queryScontractPage, {
					contractInvstate: 2,
					goodsPbillno: $storage.get('loginInfor').userPhone,
				}).then(res => {
					this.Buyers = res.list

				})
			},

			//查询合同附件的接口
			queryScontractFilePage(item) {
				let data = item
				console.log("合同信息code", data.dataStatestr)
				http.get(queryScontractFilePage, {
						scontractCode: data.dataStatestr
					})
					.then(res => {
						console.log("合同附件", res)
						console.log("合同附件", this.userinfoType)
						res.rows.forEach(element => {

							if (element.memo == "1") {
								console.log("scontractFileUrl...", element.scontractFileUrl)
								this.fileUrl = element.scontractFileUrl
							}
							// this.contractData = res.rows;
						});
					})
			},
			//合同预览
			preview(item) {
				this.htImg = true;
				console.log('合同预览，，，', item)
				this.queryScontractFilePage(item);
				if (this.fileUrl == null || this.fileUrl == "") {

					//this.tankuang();
				} else {
					console.log("有信息")
				}
				console.log(this.fileUrl);

			},
			//保存图片
			savePhoto(data) {
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
		},
	}
</script>

<style lang="less" scoped>
	@import '@/node_modules/qj-mini-pages/libs/css/common.less';

	.goodsList-nulls {
		width: 100%;
		margin-top: 200rpx;
		text-align: center;

		img {
			width: 402rpx;
			height: 337rpx;
			margin: 0 auto;
		}
	}

	.search-box {
		background-color: #ffffff;
		z-index: 1000;
		height: 100rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #F4F4F5;
	}

	.box-center {
		margin: 0 30rpx;
		width: 100%;
		height: 100%;
		line-height: 100rpx;
	}

	.buttonClass {
		float: right;
		font-size: 12px;
		height: 30rpx;
		line-height: 30rpx;
		color: #fff;
		background-color: #004178;
		width: 120rpx;
		border-radius: 10px;
	}

	.popup {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 9998;
	}

	.popup-title {
		font-size: 14px;
		font-weight: 700;

	}

	.popup-log {
		font-size: 15px;
		font-weight: 500;
		color: #666666;
		margin: 24rpx;

	}

	.popup-btn {
		display: flex;
		border-top: 1rpx solid #e6e5e5;
		margin-top: 100rpx;
	}

	.popup-btn .btn {
		width: 50%;
		padding: 10px;
	}

	.popup-info {
		position: fixed;
		width: 550upx;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 30upx;
		padding: 40upx 0 10rpx 0;
		border-radius: 20upx;
		background-color: #fff;
		z-index: 9999;
		text-align: center;
	}

	.htImg {

		margin: 0 auto;
	}

	.htImage {
		text-align: center;
		width: 88%;
		height: 570px;
		margin: 0 auto;
		border: 1px solid #fff;
		position: absolute;
		top: 60px;
		left: 22px;
		z-index: 20000;

	}
</style>
