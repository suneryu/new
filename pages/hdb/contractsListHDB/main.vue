<template>

	<div class="homepage-content">
		<div class="search-box">
			<div class="box-center">
				<u-search placeholder="输入合同名称" :show-action="false" @blur='serchContract' clearabled v-model='searchValue'></u-search>
			</div>
			<div class="box-right" @click="Minemsg()">
				<span class="iconfont icon-tishi"></span>
			</div>
		</div>
		<div style="display: flex;background-color: #FAFAFA;">
			<div class='constractName0' @click='parts("0")' :style="{ color: fontColor1 }">零配件预付款合同</div>
			<div class='constractName1' @click='parts("1")' :style="{ color: fontColor2 }">固定价格合同</div>
			<div class='constractName2' @click='parts("2")' id="constractName3" :style="{ color: fontColor3 }">线下销售合同
			</div>
			<div class='constractName3' @click="select()">
				<i class="iconfont icon-arrfill_l" v-if='iconShow1'></i>
				<i class="iconfont icon-xialakuangjiantou" v-if='iconShow2'></i>
			</div>
		</div>
		<view class="address-choose" v-if='showArea'>
			<view class="iconfont icon-shouhuodizhi"></view>
			<view class="container" @click="chooseCity">
				<input type="text" :disabled="true" v-model="city" placeholder="请选择城市" />
				<view class="iconfont icon-jiantou12"></view>
			</view>
		</view>
		<!-- <view class="section__ctn">
		        <image style="width: 80%; height: 400px;"  src="../../../static/img/icons/hdb/发票.png"></image>
		 </view> -->
		<!-- <div style='border:1px solid #4CD964;z-index: 1;'><image src="../../../static/img/icons/hdb/发票.png"></image></div> -->
		<div>
			<div v-for='(items,index) in contractData' :key="index">
				<div style='height: 150rpx;border-bottom: 1px solid #E0E0E0;margin-top: 5px;padding: 0 10px 0 10px;'>
					<div style="display: flex;height: 40rpx">
						<div class="entryName">{{items.scontractName}}</div>
						<div class='effctivTime'>
							<div v-if='(item.memberGcode == "0" || item.memberGcode == "1")?true:false'>
								有效期：<span>{{items.scontractNbcode}}</span></div>
						</div>
						<div class="contractType">{{items.memberGname}}</div>
					</div>
					<div class='miaoshu'>合同描述: <span>{{items.contractRemark}}</span></div>
					<div class='money'>
						<div v-if='qyBut && userinfoType != "1"'>合同金额:<span>￥{{items.goodsMoney}}</span></div>
						<div v-if='qyBut && userinfoType == "1"'><span>认证为企业可查看金额</span></div>
					</div>
					<div style="display: flex;height: 50rpx">
						<div class='money' style='width: 60%;'><span v-if='qyBut'>合同签订时间:</span><span
								v-else>合同预约时间:</span><span>{{items.date1}}~{{items.date2}}</span></div>
						<div class='lookconstr' style='width: 20%;'><u style='text-decoration:underline'
								@click='preview(items)'>合同预览</u></div>
						<div style='width: 20%;'>
							<button class="buttonClass" v-if='qyBut' @click="talkOrAsk(items.scontractId)">签约</button>
							<button class="buttonClass" v-else @click="talkOrder(items)">预约</button>
						</div>
					</div>
				</div>
			</div>
			<div class='chekboxType' v-if="selectValue" >
				<!-- <checkbox-group bindchange="checkboxChange" class="checkDiv">
			              <label class="weui-cell weui-check__label" wx:for="{{checkData}}" wx:key="{{checkData.value}}">
			                <view class="weui-cell__hd">
			                  <checkbox value="{{checkData.value}}" checked="{{checkData.checked}}"/>
			                </view>
			                <view class="weui-cell__bd">{{checkData.name}}</view>
			              </label>
			     </checkbox-group> -->
				<div class="checkDiv" v-for='(item,index) in checkData' :key="index">
					<checkbox style="transform:scale(0.9)" :checked="item.checked" @click="clickData(item)"></checkbox>
					<span> {{item.lable}} </span>
				</div>

				<button class="cancelBtn" @click="closeCheck()">取消</button>
				<button class="sureBtn" @click="getShow()">确定</button>
			</div>
		</div>

		<!-- <div v-if='!qyBut' style='background-color: #007AFF;width: 100%;height: 42px;position: fixed;top: {{heightA}};'>1223123</div> -->
		<u-picker mode="region" v-model="cityPicker" :area-code="['11', '1101', '110101']" @confirm="cityPickerConfirm">
		</u-picker>

		<!-- <div class="htImage" v-if="htImg">
		
				<div style='text-align: center;' >
					<img class="htImg" src="https://devmpb2b12020063000000001.xytest.qjclouds.com/paas/shop/2020063000000001/2021-03-24/a30ee3b81b3d40399794b72488095c9e.png"/>
				</div>
				
			</div> -->
		<view class="popup" v-show="htImg">

			<view class="htImage">
				<div style='text-align: right;font-size: 18px; color: azure;font-weight: 800;'><span
						@click='htImg = false'>关闭</span></div>
				<img class="htImg" mode='widthFix' :src="img + fileUrl" @click='savePhoto(img + fileUrl)' />
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
		getHomePage,
		queryScontractPageNew,
		queryScontractFilePage
	} from '@/api/interfaceHDB.js';
	export default {
		config: {
			enablePullDownRefresh: true
		},
		data() {
			return {
				img: this.$imgDomain,
				selectValue: false,
				htImg: false,
				imgDefalut: "icon-arrfill_l",
				options: [], //多选选中的值
				orderDisabled: true,
				checkData: [{
						lable: "培训",
						value: "2-1",
						checked: false
					},
					{
						lable: "咨询",
						value: "2-2",
						checked: false
					},{
						lable: "服务/零备件合同",
						value: "2-3",
						checked: false
					},
					{
						lable: "设备升级/改造",
						value: "2-4",
						checked: false
					},
					{
						lable: "服务与零备件套餐",
						value: "2-5",
						checked: false
					}
				],
				contractData: [],
				contractDataBak: [],
				iconShow1: true, //线下合同弹出层
				iconShow2: false,
				qyBut: true, //预约按钮
				heightA: "",
				userinfoType: "",
				city: '', //城市
				cityPicker: false,
				provinceCode: '',
				cityCode: '',
				areaCode: '',
				provinceName: '',
				cityName: '',
				areaName: '',
				showArea: false, //是否显示地区
				page: 1, //第一次展示的十条数据
				subscribeMes: true,
				fileUrl: "", //附件信息的url
				fontColor1: "#004178", //字体颜色
				fontColor2: "#000000", //字体颜色
				fontColor3: "#000000", //字体颜色
				searchValue:''
			}
		},
		onLoad(options) {
			this.userinfoType = $storage.get('loginInfor').userinfoType
			var windowHeight = wx.getSystemInfoSync().windowHeight
			var windowWidth = wx.getSystemInfoSync().windowWidth
			console.log("windowHeight。", windowHeight - 42)
			this.heightA = (windowHeight - 42) + 'px';
			if (options.id != undefined) {
				if(options.contractName == undefined){
					this.parts(options.id)
				}else{
					if (this.userinfoType == "1") {
						//个人用户
						this.showArea = true;
					} else {
						this.showArea = true;
					}
					this.fontColor1 = "#000000"; //字体颜色
					this.fontColor2 = "#000000"; //字体颜色
					this.fontColor3 = "#004178"; //字体颜色
					this.checkData.forEach(item=>{
						if(item.lable == options.contractName){
							item.checked = true
						}
					})
					this.getShow()
					this.iconShow1 = false
					this.iconShow2 = true
					this.selectValue = true
				}
			} else {
					let parmas = {
						memberGcode: "0",
						contractInvstate: 0,
						rows: 10,
						page: 1
					};
					this.getData(parmas);
			
			}

			// $('fixedStyle').set()

		},

		created() {

		},
		onReachBottom() {
			// 到这底部在这里需要做什么事情
			console.log("this.contractData[0]", this.contractData[0].memberGcode)
			this.loadMore(this.contractData[0].memberGcode);
		},
		methods: {
			//合同搜索
			serchContract(value){
				this.searchValue = value
				if(value != ''){
					this.contractData = this.contractDataBak.filter(item=>item.scontractName.indexOf(value) != -1)
				}else{
					this.contractData = this.contractDataBak
				}
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
			// 跳转到企业认证页
			goToRegister() {
				let options = {
					url: 'register/b2bRegisterCom',
					// query: {
					//  userPhone: this.userPhone || this.inputUserPhone
					// }
				};
				this.navigateTo(options);
			},
			navigateTo(options) {
				this.$qj.router.push(options.url, options.query ? options.query : '');
			},
			//点击判断是否是企业用户
			tankuang() {
				uni.showModal({
					title: '提示',
					content: '您还不是企业用户，请先去认证',
					confirmColor: '#' + $storage.get('baseColor'),
					success(res) {
						this.goToRegister()
					}
				})
			},
			// 预览合同判断事件
			yulook() {
				uni.showModal({
					title: '提示',
					content: '当前合同详情可咨询客户！',
					confirmColor: '#' + $storage.get('baseColor'),
					success(res) {
						// $router.back()
						// let pages = getCurrentPages()
						// if (res.confirm) {
						//  // let currentPage = pages[pages.length - 1]
						//  // let redirectUrl = currentPage.route.replace('pages/', '').replace('/main', '')
						//  // $router.push('register/b2bRegisterCom')
						// } else if (res.cancel) {
						//  if (pages.length > 1) {

						//  }
						// }
					}
				})
			},
			clickData(item) {
				item.checked = !item.checked
				console.log("item.checked", item.checked)
			},
			//点击预约
			talkOrder(item) {
				if (this.showArea) {
					if (this.city == '') {
						uni.showModal({
							title: '提示',
							content: '请先选择预约地址！',
							confirmColor: '#' + $storage.get('baseColor'),
							success(res) {}
						})
					} else {
						uni.showModal({
							title: '提示',
							content: '服务预约确认！',
							confirmColor: '#' + $storage.get('baseColor'),
							success(res) {
								if(res.confirm){
									let json = {
										// scontractCode:item.scontractCode,
										scontractCode:'2020030300000016',
										userinfoPhone:$storage.get('loginInfor').userPhone,
										areaCode:this.areaCode
									}
									http.get('/web/sp/scontract/forwardQueryScontractPageNew.json', json)
									.then(res1=>{
										if(res1.success){
											wx.showToast({
												title: '预约成功！',
												duration: 2000,
												icon: "error",
												success(data) {
													this.getShow()
												}
											});
										}else{
											wx.showToast({
												title: res1.msg,
												duration: 2000,
												icon: "error",
												success(data) {
												}
											});
										}
									})
								}
							}
						})
					}
				} else {
					uni.showModal({
						title: '提示',
						content: '服务预约确认！',
						confirmColor: '#' + $storage.get('baseColor'),
						success(res) {
							if(res.confirm){
								let json = {
									// scontractCode:item.scontractCode,
									scontractCode:'2020030300000016',
									userinfoPhone:$storage.get('loginInfor').userPhone
								}
								http.get('/web/sp/scontract/forwardQueryScontractPageNew.json', json)
								.then(res1=>{
									if(res1.success){
										wx.showToast({
											title: '预约成功！',
											duration: 2000,
											icon: "error",
											success(data) {
												this.getShow()
											}
										});
									}else{
										wx.showToast({
											title: res1.msg,
											duration: 2000,
											icon: "error",
											success(data) {
											}
										});
									}
								})
							}
						}
					})
				}
			},
			//点击签约
			talkOrAsk(scontractId) {
				if (this.userinfoType == "1") {
					//个人用户
					this.tankuang();
				} else {
					//获取签约时的信息
					$router.push('hdb/orderHDB', {scontractId});
				}

			},
			//懒加载的事件
			loadMore(code) {
				this.page++;
				console.log("qqqqqqqqqqqqaaaaa", this.page)
				console.log("qqqqqqqqqqqqaaaaa2", code)
				let parmas = {
					memberGcode: code,
					contractInvstate: 0,
					rows: 10,
					page: this.page
				};
				http.get(queryScontractPageNew, parmas)
					.then(res => {
						console.log("resData....", res)

						res.rows.forEach(element => {
							element.date1 = this.format(element.contractValidate)
							element.date2 = this.format(element.contractPaydate)
							this.contractData.push(element)
							// this.contractData = res.rows;
						});
						this.contractDataBak = this.contractData

					});
			},
			format(shijianchuo) {
				//shijianchuo是整数，否则要parseInt转换
				var time = new Date(shijianchuo);
				var y = time.getFullYear();
				var m = time.getMonth() + 1;
				var d = time.getDate();
				// var h = time.getHours();
				// var mm = time.getMinutes();
				// var s = time.getSeconds();
				return y + '-' + this.add0(m) + '-' + this.add0(d);
			},
			add0(m) {
				return m < 10 ? '0' + m : m
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
				console.log(params);
				this.city = params.province.label + params.city.label + params.area.label;
				// this.orderDisabled = false
				this.provinceCode = params.province.value;
				this.cityCode = params.city.value;
				this.areaCode = params.area.value;
				this.provinceName = params.province.label;
				this.cityName = params.city.label;
				this.areaName = params.area.label;
			},
			//查询合同附件的接口
			queryScontractFilePage(item) {
				let data = item

				console.log("合同信息code", data.scontractCode)
				http.get(queryScontractFilePage, {
						scontractCode: data.scontractCode
					})
					.then(res => {
						console.log("合同附件", res)
						console.log("合同附件", this.userinfoType)
						res.rows.forEach(element => {
							if (element.memo == 1) {
								console.log("scontractFileUrl...", element.scontractFileUrl)
								this.fileUrl = element.scontractFileUrl
							}
							// this.contractData = res.rows;
						});

						if (this.fileUrl == null || this.fileUrl == "") {
							this.yulook();
						} else {
							this.htImg = true;
						}
					})
			},
			//合同预览
			preview(items) {
				this.queryScontractFilePage(items);
			},

			checkOptions(items) {
				console.log('选中了这个参', items)
				console.log(this.options)

			},
			// 獲取拿到的線下合同類型
			getShow() {
				let that = this;
				that.options = [];
				this.checkData.forEach(item => {
					if (item.checked) {
						that.options.push(item.value)
					}

				})
				console.log(this.options, 11111111111111)
				let parmas = {
					memberGcode: "2",
					contractInvstate: 0,
					rows: 10,
					page: 1
				}
				http.get(queryScontractPageNew, parmas)
					.then(res => {
						if (res.total > 0) {
							res.rows.forEach(element => {
								element.date1 = this.format(element.contractValidate)
								element.date2 = this.format(element.contractPaydate)
								if (element.memo == this.userinfoType) {
									console.log(",,,", element.scontractFileUrl)
								}
								if (this.options.length > 0) {
									this.contractData = []
									res.rows.forEach(item => {
										if (this.options.includes(item.memberGcode)) {
											this.contractData.push(item)
										}
									})
									// this.contractData = contractDataBak
								} else {
									this.contractData = res.rows
								}

							});
						} else {
							this.contractData = []
						}
						this.contractDataBak = this.contractData
					});

				this.selectValue = false
				this.iconShow1 = true
				this.iconShow2 = false
				// $("input:checkbox:checked").each(function(index,element));

			},
			//點擊線下合同下拉
			select() {
				if (this.selectValue) {
					this.selectValue = false
					this.iconShow1 = true
					this.iconShow2 = false
				} else {
					this.selectValue = true
					this.iconShow1 = false
					this.iconShow2 = true
				}
			},
			//点击取消按钮
			closeCheck() {
				this.selectValue = false
				this.iconShow1 = true
				this.iconShow2 = false
			},
			//根据合同类型查询合同数据
			parts(data) {
				console.log(data, 'data')
				if (data == '0') {
					console.log('零配件预付款合同')
					this.page = 1; //第一次展示的十条数据
					this.fontColor1 = "#004178"; //字体颜色
					this.fontColor2 = "#000000"; //字体颜色
					this.fontColor3 = "#000000"; //字体颜色
					this.showArea = false;
					//合同查询接口  web/sp/scontract/queryScontractPageNew.json? memberGcode=2-1,2-2&contractInvstate=0
					let parmas = {
						memberGcode: "0",
						contractInvstate: 0,
						rows: 10,
						page: 1
					}
					this.getData(parmas);
					this.qyBut = true;



				}
				if (data == '1') {
					this.showArea = false;
					this.fontColor1 = "#000000"; //字体颜色
					this.fontColor2 = "#004178"; //字体颜色
					this.fontColor3 = "#000000"; //字体颜色
					this.page = 1; //第一次展示的十条数据
					console.log('固定价格合同')
					let parmas = {
						memberGcode: "1",
						contractInvstate: 0,
						rows: 10,
						page: 1
					}
					this.getData(parmas);

					this.qyBut = true;

				}
				if (data == '2') {
					if (this.userinfoType == "1") {
						//个人用户
						this.showArea = true;
					} else {
						this.showArea = false;
					}
					this.fontColor1 = "#000000"; //字体颜色
					this.fontColor2 = "#000000"; //字体颜色
					this.fontColor3 = "#004178"; //字体颜色
					this.page = 1; //第一次展示的十条数据
					let parmas = {
						memberGcode: "2",
						contractInvstate: 0,
						rows: 10,
						page: 1
					}
					this.getData(parmas);
					this.qyBut = false;
				}

			},
			getData(data) {
				http.get(queryScontractPageNew, data)
					.then(res => {
						console.log("resData....", res)
						if (res.total > 0) {
							res.rows.forEach(element => {
								element.date1 = this.format(element.contractValidate)
								element.date2 = this.format(element.contractPaydate)
								if (element.memo == this.userinfoType) {
									console.log(",,,", element.scontractFileUrl)
								}
								this.contractData = res.rows;
							});
						} else {
							this.contractData = []
						}

					this.contractDataBak = this.contractData;
					});
			},
			search() {
				uni.navigateTo({
					url: '../../search_modules/index/main'
				})
			},
			Minemsg() {
				this.$qj.router.push("user_modules/user/user-ui/webMail")
			},
			aaa() {
				console.log("aaaaaa")
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '@/node_modules/qj-mini-pages/libs/css/common.less';

	.icon-xialakuangjiantou:before {
		font-size: 12rpx !important;
		margin-left: 8rpx;
		vertical-align: middle;
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

	button {
		font-size: 30rpx;
		width: 90%;
		margin: 10rpx;
		background: #fff;

		&::after {
			border: none;
		}
	}

	.popup-info {
		position: fixed;
		width: 550rpx;
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
		width: 95%;
		margin: 0 auto;
	}

	.htImage {
		text-align: center;
		width: 88%;
		height: auto;
		margin: 0 auto;
		border: 1px solid #fff;
		position: absolute;
		top: 60px;
		left: 22px;
		z-index: 20000;

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

	.section__ctn {
		height: 672px;
		position: absolute;
		width: 100%;
		background: #929292;
		opacity: 0.7;
	}

	.chekboxType {
		width: 45%;
		height:86%;
		box-shadow: 0px 0px 10px gray;
		background-color: #ffffff;
		position: absolute;
		top: 93px;
		right: 0;
		z-index: 1000;
	}

	.checkDiv {
		margin-top: 10px;
		margin-left: 10px;
		font-size: 14px;
	}

	.cancelBtn,
	.sureBtn {

		display: inline-block;
		width: 55px;
		height: 30px;
		font-size: 12px;

	}

	.cancelBtn {
		position: absolute;
		left: 15px;
		bottom: 5px;
	}

	.sureBtn {
		position: absolute;
		right: 20px;
		bottom: 5px;
	}

	.cancelBtn:hover,
	.sureBtn:hover {
		color: white;
		background-color: skyblue;
	}

	.lookconstr {
		font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
		font-weight: 400;
		font-style: normal;
		font-size: 10px;
		color: #169BD5;
	}

	.miaoshu {
		font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
		font-weight: 400;
		font-style: normal;
		font-size: 10px;
		color: #7F7F7F;
	}

	.money {
		height: 20px;
		line-height: 20px;
		font-size: 11px;
		color: rgba(153, 153, 153, 0.619607843137255);
	}

	.buttonClass {
		width: 80%;
		height: 30rpx;
		line-height: 30rpx;
		color: #fff;
		background-color: #004178;
		font-size: 12px;
	}

	.entryName {
		width: 30%;
		font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
		font-weight: 400;
		font-style: normal;
	}

	.effctivTime {
		width: 30%;
		font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
		font-weight: 400;
		font-style: normal;
		font-size: 10px;
		color: #AAAAAA;
		text-align: left;
		line-height: 60rpx;
	}

	.contractType {
		width: 40%;
		font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
		font-weight: 400;
		font-style: normal;
		font-size: 12px;
		text-align: right;
	}

	.constractName0 {
		width: 34%;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		font-family: 'PingFangSC-Medium', 'PingFang SC Medium', 'PingFang SC', sans-serif;
		font-weight: 500;
		font-style: normal;
		font-size: 11px;
		color: #004178;

	}

	.constractName1 {
		width: 34%;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		font-family: 'PingFangSC-Medium', 'PingFang SC Medium', 'PingFang SC', sans-serif;
		font-weight: 500;
		font-style: normal;
		font-size: 11px;

	}

	.constractName2 {
		width: 25%;
		height: 80rpx;
		text-align: right;
		line-height: 80rpx;
		font-family: 'PingFangSC-Medium', 'PingFang SC Medium', 'PingFang SC', sans-serif;
		font-weight: 500;
		font-style: normal;
		font-size: 11px;

	}

	.constractName3 {
		width: 8%;
		height: 80rpx;
		text-align: left;
		line-height: 80rpx;
	}

	.search-box {
		background-color: #ffffff;
		z-index: 1000;
		height: 100rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		border-bottom: 1rpx solid #F4F4F5;

		.box-left {
			height: 80rpx;
			width: 80rpx;
			padding: 10rpx;
			line-height: 80rpx;
			margin-left: 20rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.box-center {
			width: 500rpx;
			height: 100%;
			line-height: 100rpx;
		}

		.box-right {
			height: 80rpx;
			width: 80rpx;
			padding: 10rpx;
			margin-left: 10rpx;
			line-height: 80rpx;
			text-align: center;

			span {
				height: 100%;
				width: 100%;
				font-size: 38rpx;

			}
		}
	}
</style>
