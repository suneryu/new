<template>
	<div class="accounts" ref="accounts">
		<div class="accounts-haveAddress" v-if="isHaveAddress" @click="addClass">
			<div class="accounts-haveAddress-l">
				<h5>
					收货人：{{ addressList.addressMember }}
					<span>{{ addressList.addressPhone }}</span>
				</h5>
				<p>
					<span v-if="addressList.addressDefault == 1" :style="{ background: baseColor }">默认</span>
					{{ addressList.provinceName }} {{ addressList.cityName }} {{ addressList.areaName }} {{ addressList.addressDetail }}
				</p>
			</div>
			<div class="accounts-haveAddress-r"><i class="iconfont">&#xe61d;</i></div>
		</div>
		<div class="accounts-noAddress" @click="addClass" v-else>
			<i class="iconfont">&#xe752;</i>
			添加收货地址
		</div>
		<div class="accounts-info" v-if="contractData && contractData.length > 0">
			<div v-for='(items,index) in contractData' :key="index">
				<div style='border-bottom: 1px solid #E0E0E0;margin-top: 5px;padding: 5px 10px 0 0;'>
					<div style='border-bottom: 1px solid #E0E0E0;font-size: 15px;font-weight: bold;padding-bottom:20rpx ;'><span>{{items.goodsNo}}</span></div>
					<div style="display: flex;height: 40rpx;justify-content: space-between;margin-bottom: 30rpx;">
						<div class="entryName">{{items.goodsName}}</div>
						<!-- <div class="effctivTime">有效期：{{items.scontractNbcode}}</div> -->
					</div>
					<div class='miaoshu'>合同描述: <span>{{items.skuName}}</span></div>
					<div style="display: flex;height: 50rpx;justify-content: space-between;margin-bottom: 30rpx;">
						<div class='money' style='width: 60%;'><span>合同金额：</span><span style='color: #ff557f;'>￥{{items.pricesetNprice}} 元</span></div>
						<div class='lookconstr' style='width: 20%;'><u style='text-decoration:underline'
								@click='preview(items)'>合同预览</u></div>
						
					</div>
				</div>
			</div>
			<div class="accounts-textarea">
				<span>备注信息：</span>
				<input placeholder="请填写" v-model="contractData[0].packageRemark" />
			</div>
			<div class="accounts-info-money">
				共1件，小计：
				<span :style="{ color: '#ff557f' }"
					>{{ unitPrice.obpay }}{{ contractData[0].pricesetNprice }} {{ unitPrice.mapay }}</span>
			</div>
		</div>
		<div class="accounts-con" 
			v-if="shoppingItems[0].shoppingType != '06' && shoppingItems[0].shoppingType != '28'">
			<div>
				支付方式
				<div>
					<span>在线支付</span>
					<i class="iconfont">&#xe61d;</i>
				</div>
			</div>
		</div>
		<div class="accounts-con" v-else>
			<div>
				支付方式
				<div>
					<span>在线支付</span>
					<i class="iconfont">&#xe61d;</i>
				</div>
			</div>
		</div>
		<div class="accounts-sum">
			<p>
				应付金额：
				<i>{{contractData[0].pricesetNprice}} {{ unitPrice.mapay }}</i>
			</p>
			<!-- <div @click="savePayPrice" :style="{ background: baseColor }">立即支付</div> -->
		</div>
		<div class='isSignUp'>
			<button @click="isSignUp(false)">取消签约</button>
			<button @click="isSignUp(true)">确认签约</button>
		</div>
		<u-popup class="pay-methods-popup" v-model="payMethodsPopup" mode="bottom" height="427rpx">
			<view class="pay-methods-title">
				<text>支付方式</text>
				<view class="iconfont icon-guanbi" @click="closePayMethodsPopup"></view>
			</view>
			<view class="pay-methods-list">
				<view class="pay-methods-item" v-for="(item, index) in payMethodsList" :key="index"
					@click="clickPayMethodsItem(index)">
					<view class="name">{{ item.ptfpmodeName }}</view>
					<view class="iconfont"
						:class="{ 'icon-xuanzhong-01': payMethodsTempIndex == index, 'icon-checkboxround0': payMethodsTempIndex != index }"
						v-bind:style="{ color: secondaryColor }"></view>
				</view>
			</view>
			<view class="pay-methods-footer" v-bind:style="{ backgroundColor: baseColor }" @click="confirmPayMethods">确认
			</view>
		</u-popup>
		<view class="popup" v-show="htImg">
		
			<view class="htImage">
				<div style='text-align: right;font-size: 18px; color: azure;font-weight: 800;'>
					<span @click='closeHtImg'>关闭</span>
				</div>
				<img class="htImg" mode='widthFix' :src="img + fileUrl" @click='savePhoto(img + fileUrl)' />
				<div style='font-size: 16px;font-weight: 900;color: #fff;'>点击图片进行下载</div>
			</view>
		</view>
	</div>
</template>

<script>
	import {
		addressList,
		queryToContract,
		calculateFreightFare,
		getTotalDiscountPrice,
		queryShoppingToContract,
		saveContract,
		syncContractState,
		addContractSub,
		saveOrderSubToPay,
		paymentCommit,
		coupon,
		getContractDiscountRatio,
		getCurrPayMethods,
		queryUseTemplate,
		refund,

	} from '@/api/shopHdb.js';
	import {
		formatTimes
	} from '@/node_modules/qj-mini-pages/libs/util/prototype/date.js';
	import {
		Add
	} from '@/node_modules/qj-mini-pages/libs/util/prototype/number.js';
	import {
		$storage,
		$router,
		$message
	} from '@/utils/prototype/vue.js';
	import http from '@/api/http.js';
	import {
		// getHomePage,
		// queryScontractPageNew,
		queryScontractFilePage
	} from '@/api/interfaceHDB.js';
	import Vue from 'vue';
	export default {
		config: {
			enablePullDownRefresh: true
		},
		data() {
			return {
				// // CONTRACT_EARNEST 返利金额  订单使用卷的时候把  卷的名称 存在 CONTRACT_SETTL_OPEMO
				img: this.$imgDomain,
				title: '确认订单',
				htImg: false,
				isHaveAddress: false, //判断是否存在地址
				addressList: {},
				shoppingItems: [],
				totalDiscountPrice: 0, //权益差价
				shoppingCountPrice: 0, //商品总金额
				freight: 0, //运费
				copyComDisMoney: 0, // 复制一份优惠值
				contractGoodsList: [], //结算时候需要将所有的商品信息传过去
				scontractBlance: '', // 结算方式 0 全款 1 订金 2 分次 3 分期    多个用,分割
				scontractPmode: '', // 付款方式 0 线上、 1 线下  2 不付款  多个用,分割
				orderDomainStr: [],
				contractBillcode: '',
				contractSubCode: '',
				ptradeSeqno: '', //支付流水号
				query: {},
				upImg: [],
				evaluateGoodsImgs: [], //提交图片的数组
				// 主色调
				baseColor: '',
				// 辅色调
				secondaryColor: '',
				isShow: false, //优惠劵弹窗
				couponList: [], //优惠劵列表
				currentIndex: -1,
				templateTitle: '',
				currentRedPacketIndex: -1,
				currentCoupon: '',
				currentRedPacket: '',
				pmContractGoodsDomainListStr: [], // 获取优惠劵列表需要传所有商品的参数
				selectPromotionName: '', // 选中的优惠劵名字
				selectRedPacketName: '', // 选中的红包的名字
				// 支付方式列表
				payMethodsList: [],
				payMethodsIndex: 0,
				payMethodsTempIndex: 0,
				payMethodsPopup: false,
				redPacketPopup: false,
				// 红包列表
				redPacketList: [],
				// 会员权益code
				contractSettlOpno: '',
				// 下单方式（购物车下单：1 详情页立即下单：0）
				orderWay: 0,
				// 详情页下单通过页面传参通信
				skuDataByDetail: '',
				// 积分
				sumPoints: 0,
				// 当前优惠券的面值金额
				couponDiscount: 0,
				// 当前红包的面值金额
				redPacketDiscount: 0,
				isupload: false,
				contractData: [],
				fileUrl:'',
			};
		},
		mounted() {
			this.currentIndex = -1;
			this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
			this.secondaryColor = `#${this.$qj.storage.get('secondaryColor')}` || this.baseColor;
			this.initPayMethods();
			this.initAddressData() 
			this.initOrderData(this.$root.$mp.query.scontractId)
			

		},
		computed: {
			unitPrice() {
				// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
				return this.$state.unitPrice || this.$qj.storage.get('unitPrice');
			},
		},
		onLoad(options) {
			this.contractData.push(options.scontractId)
		},
		methods: {
			/**
			 * 初始化地址数据
			 */
			initAddressData() {
				// 初始化地址信息
				this.addressList = {};
			
				if (this.$qj.storage.get('changeaddress') && this.$qj.storage.get('changeaddress') != '') {
					this.addressList = this.$qj.storage.get('changeaddress');
					this.isHaveAddress = true;
				} else {
					this.$qj
						.http(this.$qj.domain)
						.get(addressList)
						.then(res => {
							if (res && res.length > 0 && res[0].addressDefault == '1') {
								this.isHaveAddress = true;
								this.addressList = res[0];
							} else {
								this.isHaveAddress = false;
							}
						});
				}
			},
			//添加地址
			addClass() {
				this.$qj.router.push('user_modules/address/manage', {
					json: 1
				});
			},
			//xiadan
			toGenerateOrders(){
				if (JSON.stringify(this.addressList) === '{}') {
					this.$qj.message.alert('请选择地址');
				} else {
					this.scontractPmode = 0
					this.contractPmode = this.payMethodsList.length > 0 ? this.payMethodsList[this.payMethodsIndex].contractPmode : 0;
					let pares = this.$qj.storage.get('contractTypepro');
					let code;
					let typepro;
					if (pares && pares == '01') {
						code = this.$qj.storage.get('goodsPmbillno');
						typepro = '01';
					} else {
						code = this.$qj.storage.get('promotionCode');
						typepro = '0';
					}
					let dateTimes = new Date();
					let minTimes = dateTimes.getMinutes();
					dateTimes.setMinutes(minTimes + this.$qj.storage.get('payTime'));
				
					// 购物车下单商品ID
					let shoppingGoodsIdStr = this.$state.shoppingGoodsIdStr;
					this.orderDomainStr = [];
					let sklist = [];
					if(this.skuDataByDetail != ''){
						sklist.push(this.skuDataByDetail)
					}
					//商品详情直接下单
					let detailDomainStr = [{
						goodsClass:this.goodsClass, //商品类型
						partnerType:this.partnerType, //信用额度状态 0关闭  1开启
						contractPaytime: new Date().getTime(),
						goodsPbillno: this.$qj.storage.get('goodsPbillno'), // 成团人数
						goodsPmbillno: code, // 团购 平团  描述营销单号
						contractProperty: '0', //订单性质
						contractTypepro: typepro, //订单类型属性(引合同、发货/中转)
						contractBlance: this.scontractBlance || 0, //结算方式:全款、订金、融资
						contractPmode: this.contractPmode || 0, //付款方式：场内、场外，即线上、线下
						contractType: this.contractData[0].shoppingType,
						contractPumode: '0', //提货方式
						goodsSupplierName: '', //配送商
						goodsSupplierCode: '', //配送商Code
						packageList: [],
						ocContractSettlList: [],
						packageMode: '', //配送方式
						contractInmoney: this.contractData[0].pricesetNprice, //  销售含税金额 (优惠前)
						contractMoney: this.contractData[0].pricesetNprice, // 最终销售含税金额 (优惠后)
						goodsReceiptMem: this.addressList.addressMember, //收货人
						goodsReceiptPhone: this.addressList.addressPhone, //收货联系方式
						goodsReceiptArrdess: this.addressList.provinceName + this.addressList.cityName + this.addressList.areaName +
							this.addressList.addressDetail,
						areaCode: this.addressList.areaCode, //从地址上面带过来`
						contractNbillcode: this.shoppingItems[0].contractNbillcode,
						skuIdList: sklist,
						giftSkuIdList: []
					}];
				
					this.shoppingItems.map((v, index) => {
						this.orderDomainStr.push({
							goodsClass:this.goodsClass, //商品类型
							partnerType:this.partnerType,  //信用额度
							contractPaytime: new Date().getTime(),
							goodsPbillno: this.$qj.storage.get('goodsPbillno'), // 成团人数
							goodsPmbillno: code, // 团购 平团  描述营销单号
							contractProperty: '0', //订单性质
							contractTypepro: typepro, //订单类型属性(引合同、发货/中转)
							contractBlance: this.scontractBlance || 0, //结算方式:全款、订金、融资
							contractPmode: this.contractPmode || 0, //付款方式：场内、场外，即线上、线下
							contractPumode: '0', //提货方式
							goodsSupplierName: '', //配送商
							goodsSupplierCode: '', //配送商Code
							packageMode: '', //配送方式
							contractType: v.shoppingType,
							packageList: [],
							ocContractSettlList: [],
							contractInmoney: (Number(this.shoppingCountPrice) + Number(this.freight.toFixed(2))).toFixed(2), //  销售含税金额 (优惠前)
							contractMoney: this.accountsSumPrice, // 最终销售含税金额 (优惠后)
							goodsReceiptMem: this.addressList.addressMember, //收货人
							goodsReceiptArrdess: this.addressList.provinceName + this.addressList.cityName + this.addressList.areaName +
								this.addressList.addressDetail, //收货地址
							goodsReceiptPhone: this.addressList.addressPhone, //收货联系方式
							areaCode: this.addressList.areaCode //从地址上面带过来`
						});
				
						let arr = []
						for (let i = 0; i < this.upImg.length; i++) {
							let obj = {
								contractproKey: '图片',
								contractproName: '',
								contractproValue1: this.upImg[i].url,
								contractproValue: '',
				
							}
							// obj.contractproValue1 = this.upImg[i]
							arr.push(obj)
						}
				
						this.orderDomainStr[index].ocContractproDomainList = arr
						if (Object.keys(this.currentCoupon).length > 0) {
							this.orderDomainStr[index].ocContractSettlList.push({
								contractSettlBlance: 'COP',
								contractPmode: '0',
								contractSettlGmoney: this.couponDiscount,
								contractSettlPmoney: Number(this.currentCoupon.couponAmount),
								contractSettlOpno: this.currentCoupon.usercouponCode || '',
								contractSettlOpemo: this.currentCoupon.promotionCode || ''
							});
						}
						if (Object.keys(this.currentRedPacket).length > 0) {
							this.orderDomainStr[index].ocContractSettlList.push({
								contractSettlBlance: 'COP',
								contractPmode: '0',
								contractSettlGmoney: this.redPacketDiscount,
								contractSettlPmoney: Number(this.currentRedPacket.couponAmount || 0),
								contractSettlOpno: this.currentRedPacket.usercouponCode || '',
								contractSettlOpemo: this.currentRedPacket.promotionCode || ''
							});
						}
				
				
						v.shoppingpackageList.map(val => {
							let list = [];
							if (val.giftList) {
								list = [...val.giftList, ...val.shoppingGoodsList];
								console.log(list, "gdffhhhhhhhhhhhh")
							} else {
								list = val.shoppingGoodsList;
							}
							let shoppingGoodsIdList = [];
							val.shoppingGoodsList.map(vk => {
								shoppingGoodsIdList.push(vk.shoppingGoodsId);
							});
							if (val.disMoney && val.disMoney > 0) {
								if (val.pmCalcBeanList && val.pmCalcBeanList.length > 0) {
									val.pmCalcBeanList.map(els => {
										this.orderDomainStr[index].ocContractSettlList.push({
											contractSettlBlance: els.promotionInType == 0 ? 'PM' : 'COP',
											contractPmode: '0',
											contractSettlGmoney: Number(els.disMoney.toFixed(2)),
											contractSettlPmoney: Number(els.disMoney.toFixed(2)),
											contractSettlOpno: els.promotionCode,
											contractSettlOpemo: els.promotionName
										});
										detailDomainStr[0].ocContractSettlList.push({
											contractSettlBlance: els.promotionInType == 0 ? 'PM' : 'COP',
											contractPmode: '0',
											contractSettlGmoney: Number(els.disMoney.toFixed(2)),
											contractSettlPmoney: Number(els.disMoney.toFixed(2)),
											contractSettlOpno: els.promotionCode,
											contractSettlOpemo: els.promotionName
										});
									});
								}
							}
							this.orderDomainStr[index].packageList.push({
								contractGoodsList: list,
								shoppingGoodsIdList: shoppingGoodsIdList,
								promotionCode: val.promotionCode,
								packageRemark: val.packageRemark
							});
							detailDomainStr[0].packageList.push({
								contractGoodsList: list,
								shoppingGoodsIdList: [],
								promotionCode: val.promotionCode,
								packageRemark: val.packageRemark
							});
						});
					});
					let arr = []
					for (let i = 0; i < this.upImg.length; i++) {
						let obj = {
							contractproKey: '图片',
							contractproName: '',
							contractproValue1: this.upImg[i].url,
							contractproValue: '',
						}
						// obj.contractproValue1 = this.upImg[i]
						arr.push(obj)
					}
					console.log(arr, '222222222222')
					detailDomainStr[0].ocContractproDomainList = arr
					// let orderDomainStr = this.orderWay === 0 ? JSON.stringify(detailDomainStr) : JSON.stringify(this.orderDomainStr);
					let orderDomainStr = JSON.stringify(detailDomainStr);
					let params = {
						orderDomainStr: orderDomainStr			
					};
					this.$qj.message.loading();
					this.$qj
						.http(this.$qj.domain)
						.post(saveContract, params)
						.then(res => {
							console.log(res, 'fygryefgre7gtrt')
							if (res.errorCode == 'nologin') {
								return;
							}
							$storage.set('contractGoodsPrice','')
							if (res.dataObj.contractBillcode) {
								this.contractBillcode = res.dataObj.contractBillcode;
								this.$state.set('contractBillcode', this.contractBillcode);
								this.$qj.router.replace('pay/paySelect');
								}
							});	
				}
			},
			//是否签约
			isSignUp(isSignUp){
				if(!isSignUp){
					uni.navigateBack()
				}else{
					let that = this
					wx.requestSubscribeMessage({
						tmplIds: ["c1kKxRSrGSb_qx0KDOeCBceWS0qPKh0vhWHl8PlEJwQ"], //需要订阅的消息模板的id的集合，一次调用最多可订阅3条消息
						// 消息模板id在[微信公众平台(mp.weixin.qq.com)-功能-订阅消息]中配置
						success(res) { // 接口调用成功的回调函数
							if (
								res["c1kKxRSrGSb_qx0KDOeCBceWS0qPKh0vhWHl8PlEJwQ"] == "accept"
							) {
								that.toGenerateOrders()
								
							} else{
								wx.showModal({
									title: "温馨提示",
									content: "您已拒绝授权，将无法在微信中收到回复通知！",
									showCancel: false,
									success: res => {
									}
								});
							}
						},
						fail(res) { // 接口调用失败的回调函数
							if (res.errCode === 20004) {
								wx.showModal({
									title: "温馨提示",
									content: "您已拒绝授权，将无法在微信中收到回复通知！",
									showCancel: false,
									success: res => {
									}
								});
							}
						}
					});
				} 

			},
			//关闭图片
			closeHtImg(){
				this.htImg = false
			},
			//判断是否有图片
			yulook() {
				uni.showModal({
					title: '提示',
					content: '当前合同详情可咨询客户！',
					confirmColor: '#' + $storage.get('baseColor'),
					success(res) {
					}
				})
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
			//合同预览
			preview(items) {
				this.queryScontractFilePage(items);
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
			delImg(index) {
				this.upImg.splice(index, 1)
			},

			initPayMethods() {
				this.$qj
					.http(this.$qj.domain)
					.get(getCurrPayMethods)
					.then(res => {
						if (res && res.rows) {
							this.payMethodsList = res.rows;
						}
					});
			},

			/**
			 * 初始化订单数据
			 */
			initOrderData(scontractId) {
				this.$qj.message.loading()
				// this.$qj.http(this.$qj.domain)
				// 	.get('/web/sp/scontract/getScontract.json', {
				// 		scontractId
				// 	})
				// 	.then(res => {
				// 		if (res) {
				// 			this.contractData.push(res)
				// 		}
				// 	})
				this.$qj.http(this.$qj.domain)
					.get('/web/oc/shopping/queryToContract.json', {
						skuId:scontractId,
						goodsNum:1
					})
					.then(res => {
						if (res) {
							this.contractData=res[0].shoppingpackageList[0].shoppingGoodsList || []
							this.shoppingItems = res
						}
				})
			},

			choosePayMethods() {
				this.payMethodsPopup = true;
				this.payMethodsTempIndex = this.payMethodsIndex;
			},

			clickPayMethodsItem(index) {
				this.payMethodsTempIndex = index;
			},

			confirmPayMethods() {
				this.payMethodsIndex = this.payMethodsTempIndex;

				this.payMethodsPopup = false;
			},

			closePayMethodsPopup() {
				this.payMethodsPopup = false;
			},

			async savePayPrice() {
				// if (JSON.stringify(this.addressList) === '{}') {
				// 	this.$qj.message.alert('请选择地址');
				// } else {
				this.scontractPmode =  0;
				// 计算订单优惠占比
				let ratio = 0;
				let getRatioRes = await this.requestGetContractDiscountRatio();
				if (getRatioRes.success && getRatioRes.dataObj != null) {
					ratio = getRatioRes.dataObj.flagSettingInfo;
				}
				if (ratio > 0 && (this.totalDiscountPrice + this.comDisMoney) / this.shoppingCountPrice > ratio /
					100) {
					this.$qj.message.alert(`订单优惠占比不能超过${ratio}%`);
					return;
				}

				let pares = this.$qj.storage.get('contractTypepro');
				let code;
				let typepro;
				if (pares && pares == '01') {
					code = this.$qj.storage.get('goodsPmbillno');
					typepro = '01';
				} else {
					code = this.$qj.storage.get('promotionCode');
					typepro = '0';
				}
				let dateTimes = new Date();
				let minTimes = dateTimes.getMinutes();
				dateTimes.setMinutes(minTimes + this.$qj.storage.get('payTime'));

				// 购物车下单商品ID
				let shoppingGoodsIdStr = this.$state.shoppingGoodsIdStr;
				this.orderDomainStr = [];
				//商品详情直接下单
				let detailDomainStr = [{
					contractPaytime: new Date().getTime(),
					goodsPbillno: this.$qj.storage.get('goodsPbillno'), // 成团人数
					goodsPmbillno: code, // 团购 平团  描述营销单号
					contractProperty: '0', //订单性质
					contractTypepro: typepro, //订单类型属性(引合同、发货/中转)
					contractBlance: this.scontractBlance || 0, //结算方式:全款、订金、融资
					contractPmode: this.scontractPmode || 0, //付款方式：场内、场外，即线上、线下
					// contractType: this.shoppingItems[0].shoppingType,
					contractPumode: '0', //提货方式
					goodsSupplierName: '', //配送商
					goodsSupplierCode: '', //配送商Code
					packageList: [],
					ocContractSettlList: [],
					packageMode: '', //配送方式
					contractInmoney: (Number(this.shoppingCountPrice) + Number(this.freight.toFixed(2)))
						.toFixed(2), //  销售含税金额 (优惠前)
					contractMoney: this.accountsSumPrice, // 最终销售含税金额 (优惠后)
					goodsReceiptMem: this.addressList.addressMember, //收货人
					goodsReceiptPhone: this.addressList.addressPhone, //收货联系方式
					goodsReceiptArrdess: this.addressList.provinceName + this.addressList.cityName + this
						.addressList.areaName +
						this.addressList.addressDetail,
					areaCode: this.addressList.areaCode, //从地址上面带过来`
					contractNbillcode: this.shoppingItems[0].contractNbillcode,
					skuIdList: [this.skuDataByDetail],
					giftSkuIdList: []
				}];

				// 优惠券
				// if (Object.keys(this.currentCoupon).length > 0) {
				// 	detailDomainStr[0].ocContractSettlList.push({
				// 		contractSettlBlance: 'COP',
				// 		contractPmode: '0',
				// 		contractSettlGmoney: this.couponDiscount,
				// 		contractSettlPmoney: Number(this.currentCoupon.couponAmount),
				// 		contractSettlOpno: this.currentCoupon.usercouponCode || '',
				// 		contractSettlOpemo: this.currentCoupon.promotionCode || ''
				// 	});
				// }

				// 红包
				// if (Object.keys(this.currentRedPacket).length > 0) {
				// 	detailDomainStr[0].ocContractSettlList.push({
				// 		contractSettlBlance: 'COP',
				// 		contractPmode: '0',
				// 		contractSettlGmoney: this.redPacketDiscount,
				// 		contractSettlPmoney: Number(this.currentRedPacket.couponAmount || 0),
				// 		contractSettlOpno: this.currentRedPacket.usercouponCode || '',
				// 		contractSettlOpemo: this.currentRedPacket.promotionCode || ''
				// 	});
				// }

				// 会员权益差价
				if (this.contractSettlOpno && this.totalDiscountPrice != 0) {
					detailDomainStr[0].ocContractSettlList.push({
						contractSettlBlance: 'UR',
						contractPmode: '0',
						contractSettlPmoney: this.totalDiscountPrice,
						contractSettlOpno: this.contractSettlOpno
					});
				}

				// 积分订单结算信息 不能包含优惠券，不能包含权益差价
				if (this.shoppingItems[0].shoppingType == '06' || this.shoppingItems[0].shoppingType == '28') {
					detailDomainStr[0].ocContractSettlList = [{
						contractSettlBlance: 'INT',
						contractSettlPmoney: this.sumPoints
					}];
				}

				this.shoppingItems.map((v, index) => {
					this.orderDomainStr.push({
						contractPaytime: new Date().getTime(),
						goodsPbillno: this.$qj.storage.get('goodsPbillno'), // 成团人数
						goodsPmbillno: code, // 团购 平团  描述营销单号
						contractProperty: '0', //订单性质
						contractTypepro: typepro, //订单类型属性(引合同、发货/中转)
						contractBlance: this.scontractBlance || 0, //结算方式:全款、订金、融资
						contractPmode: this.scontractPmode || 0, //付款方式：场内、场外，即线上、线下
						contractPumode: '0', //提货方式
						goodsSupplierName: '', //配送商
						goodsSupplierCode: '', //配送商Code
						packageMode: '', //配送方式
						contractType: v.shoppingType,
						packageList: [],
						ocContractSettlList: [],
						contractInmoney: (Number(this.shoppingCountPrice) + Number(this.freight
							.toFixed(2))).toFixed(2), //  销售含税金额 (优惠前)
						contractMoney: this.accountsSumPrice, // 最终销售含税金额 (优惠后)
						goodsReceiptMem: this.addressList.addressMember, //收货人
						goodsReceiptArrdess: this.addressList.provinceName + this.addressList
							.cityName + this.addressList.areaName +
							this.addressList.addressDetail, //收货地址
						goodsReceiptPhone: this.addressList.addressPhone, //收货联系方式
						areaCode: this.addressList.areaCode //从地址上面带过来`
					});

					let arr = []
					for (let i = 0; i < this.upImg.length; i++) {
						let obj = {
							contractproKey: '图片',
							contractproName: '',
							contractproValue1: this.upImg[i].url,
							contractproValue: '',

						}
						// obj.contractproValue1 = this.upImg[i]
						arr.push(obj)
					}

					this.orderDomainStr[index].ocContractproDomainList = arr
					if (Object.keys(this.currentCoupon).length > 0) {
						this.orderDomainStr[index].ocContractSettlList.push({
							contractSettlBlance: 'COP',
							contractPmode: '0',
							contractSettlGmoney: this.couponDiscount,
							contractSettlPmoney: Number(this.currentCoupon.couponAmount),
							contractSettlOpno: this.currentCoupon.usercouponCode || '',
							contractSettlOpemo: this.currentCoupon.promotionCode || ''
						});
					}
					if (Object.keys(this.currentRedPacket).length > 0) {
						this.orderDomainStr[index].ocContractSettlList.push({
							contractSettlBlance: 'COP',
							contractPmode: '0',
							contractSettlGmoney: this.redPacketDiscount,
							contractSettlPmoney: Number(this.currentRedPacket.couponAmount || 0),
							contractSettlOpno: this.currentRedPacket.usercouponCode || '',
							contractSettlOpemo: this.currentRedPacket.promotionCode || ''
						});
					}

					// 会员权益差价
					if (this.contractSettlOpno && this.totalDiscountPrice != 0) {
						this.orderDomainStr[index].ocContractSettlList.push({
							contractSettlBlance: 'UR',
							contractPmode: '0',
							contractSettlPmoney: this.totalDiscountPrice,
							contractSettlOpno: this.contractSettlOpno
						});
					}

					v.shoppingpackageList.map(val => {
						let list = [];
						if (val.giftList) {
							list = [...val.giftList, ...val.shoppingGoodsList];
							console.log(list, "gdffhhhhhhhhhhhh")
						} else {
							list = val.shoppingGoodsList;
						}
						let shoppingGoodsIdList = [];
						val.shoppingGoodsList.map(vk => {
							shoppingGoodsIdList.push(vk.shoppingGoodsId);
						});
						if (val.disMoney && val.disMoney > 0) {
							if (val.pmCalcBeanList && val.pmCalcBeanList.length > 0) {
								val.pmCalcBeanList.map(els => {
									this.orderDomainStr[index].ocContractSettlList.push({
										contractSettlBlance: els.promotionInType == 0 ?
											'PM' : 'COP',
										contractPmode: '0',
										contractSettlGmoney: Number(els.disMoney
											.toFixed(2)),
										contractSettlPmoney: Number(els.disMoney
											.toFixed(2)),
										contractSettlOpno: els.promotionCode,
										contractSettlOpemo: els.promotionName
									});
									detailDomainStr[0].ocContractSettlList.push({
										contractSettlBlance: els.promotionInType == 0 ?
											'PM' : 'COP',
										contractPmode: '0',
										contractSettlGmoney: Number(els.disMoney
											.toFixed(2)),
										contractSettlPmoney: Number(els.disMoney
											.toFixed(2)),
										contractSettlOpno: els.promotionCode,
										contractSettlOpemo: els.promotionName
									});
								});
							}
						}
						this.orderDomainStr[index].packageList.push({
							contractGoodsList: list,
							shoppingGoodsIdList: shoppingGoodsIdList,
							promotionCode: val.promotionCode,
							packageRemark: val.packageRemark
						});
						detailDomainStr[0].packageList.push({
							contractGoodsList: list,
							shoppingGoodsIdList: [],
							promotionCode: val.promotionCode,
							packageRemark: val.packageRemark
						});
					});
				});
				let arr = []
				for (let i = 0; i < this.upImg.length; i++) {
					let obj = {
						contractproKey: '图片',
						contractproName: '',
						contractproValue1: this.upImg[i].url,
						contractproValue: '',
					}
					// obj.contractproValue1 = this.upImg[i]
					arr.push(obj)
				}
				console.log(arr, '222222222222')
				detailDomainStr[0].ocContractproDomainList = arr
				let orderDomainStr = this.orderWay === 0 ? JSON.stringify(detailDomainStr) : JSON.stringify(this
					.orderDomainStr);
				let params = {
					orderDomainStr: orderDomainStr
				};
				this.$qj.message.loading();
				this.$qj
					.http(this.$qj.domain)
					.post(saveContract, params)
					.then(res => {
						console.log(res, 'fygryefgre7gtrt')
						if (res.errorCode == 'nologin') {
							return;
						}
						if (res.dataObj.contractBillcode) {
							this.contractBillcode = res.dataObj.contractBillcode;
							this.$state.set('contractBillcode', this.contractBillcode);
							this.$qj.router.replace('pay/paySelect');
						}
					});
				// }
			}
		}
	};
</script>

<style lang="less" scoped>
	@import '@/node_modules/qj-mini-pages/libs/css/common.less';
	.isSignUp{
		width: 100%;
		height: 130rpx;
		display: flex;
		justify-content: space-around;
		position: fixed;
		bottom: 0;
		button{
			width: 35%;
			height: 70rpx;
			font-size: 14px;
			line-height: 70rpx;
			color: #094279;
			border: 1px solid #094279;
		}
		button:last-child{
			background: #094279;
			color: #fff;
		}
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
	.lookconstr {
		font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
		font-weight: 400;
		font-style: normal;
		font-size: 10px;
		color: #169BD5;
		text-align: right;
	}

	.miaoshu {
		font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
		font-weight: 400;
		font-style: normal;
		font-size: 10px;
		color: #7F7F7F;
		margin-bottom: 30rpx;
	}

	.money {
		height: 20px;
		line-height: 20px;
		font-size: 12px;
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
		line-height: 60rpx;
	}

	.effctivTime {
		width: 30%;
		font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
		font-weight: 400;
		font-style: normal;
		font-size: 12px;
		color: #AAAAAA;
		text-align: right;
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

	.accounts {
		&-back {
			div {
				width: 70rpx;
				height: 90rpx;
				position: fixed;
				z-index: 99999;
				left: 30rpx;
				top: 0;
				display: inline-block;
				display: flex;
				justify-content: flex-start;
				align-items: center;
			}
		}

		&-noAddress {
			height: 178rpx;
			// margin-top: 90rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-bottom: 20rpx solid #fafafa;
			background: @white-color;

			i {
				margin-right: @margin-right;
				font-size: 50rpx;
			}
		}

		.accounts-update {
			// pointer-events: none;
			width: 100%;
			border-bottom: 20rpx solid #fafafa;

			.txt {
				height: 108rpx;
				line-height: 108rpx;
				padding: 0;


				span:nth-child(1) {
					margin-left: 25rpx;
					font-size: 28rpx;
				}

				span:nth-child(2) {
					float: right;
					margin-right: 40rpx;
					font-size: 28rpx;
				}

				span:nth-child(3) {
					text-align: center;
					font-size: 18rpx;
					margin-left: 50rpx;
				}
			}

			.upload {
				hieght: 300rpx;
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;

				.icons {
					padding: 8rpx;
					height: 150rpx;
					width: 30.3%;
					text-align: center;

					i {
						height: 25rpx;
						width: 25rpx;
						position: relative;
						top: 10rpx;
					}

					img {
						height: 130rpx;
						width: 100%;
					}
				}
			}
		}

		&-haveAddress {
			height: 180rpx;
			background: @white-color;
			padding: @padding-30;
			border-bottom: 20rpx solid #fafafa;
			display: flex;
			align-items: center;
			justify-content: space-between;

			&-l {
				font-size: @top-title;
				width: 618rpx;

				h5 {
					margin-bottom: 12rpx;

					span {
						margin-left: 112rpx;
					}
				}

				p {
					overflow: hidden;
					-webkit-line-clamp: 3;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					width: 618rpx;
					color: @color-666;
					font-size: @middle-title;

					span {
						display: inline-block;
						font-size: 18rpx;
						padding: 3rpx 15rpx;
						border-radius: 15rpx;
						// background: #b79f77;
						margin-right: 12rpx;
						color: @white-color;
					}
				}
			}

			&-r {}
		}

		&-info {
			padding: 10rpx 30rpx 0rpx 30rpx;
			border-bottom: 20rpx solid #fafafa;
			background: @white-color;
			border-bottom: 20rpx solid #fafafa;

			&-tit {
				height: 68rpx;
				line-height: 68rpx;
				border-bottom: 1rpx solid #f6f6f8;
				margin-bottom: 30rpx;
			}

			&-con {
				display: flex;
				align-items: center;
				margin-bottom: 40rpx;

				&:last-child {
					margin-bottom: 0;
				}

				img {
					width: 160rpx;
					height: 160rpx;
					margin-right: 30rpx;
				}

				div {
					width: 500rpx;

					h2 {
						width: 500rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						font-size: 28rpx;

						span {
							// border: 1rpx solid #b79f77;
							border-radius: 6rpx;
							padding: 0 5rpx;
							margin-right: 5rpx;
							font-size: @middle-title;
							// color: #b79f77;
						}
					}

					h3 {
						color: @color-999;
						font-size: @middle-title;
						margin: 10rpx 0;
					}

					h4 {
						color: #d66377;
						display: flex;
						align-items: center;
						justify-content: space-between;

						span {
							font-size: @middle-title;
							color: @color-666;
						}
					}
				}
			}

			.accounts-con,
			.accounts-textarea {
				height: 108rpx;
				padding: 0;
				border-bottom: 1rpx solid #fafafa;
			}

			&-money {
				padding: 0;
				height: 102rpx;
				line-height: 102rpx;
				text-align: right;
				font-size: @middle-title;
			}
		}

		&-con {
			padding: @padding-30;
			background: @white-color;
			border-bottom: 20rpx solid #fafafa;

			div {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28rpx;
				height: 110rpx;
				border-bottom: 1rpx solid #f6f6f8;

				div {
					display: flex;
					align-items: center;

					i {
						font-size: 28rpx;
						color: #999;
					}

					span {
						color: @color-999;
						margin-right: 10rpx;
					}
				}

				&:last-child {
					border-bottom: 0;
				}
			}
		}

		&-textarea {
			display: flex;
			align-items: center;
			height: 88rpx;
			border-bottom: 20rpx solid #fafafa;
			background: @white-color;
			padding: @padding-30;
			font-size: 28rpx;

			span {
				display: inline-block;
				width: 172rpx;
			}

			input {}
		}

		&-count {
			padding: 30rpx;
			background: @white-color;
			margin-bottom: 116rpx;

			p {
				display: flex;
				align-items: center;
				justify-content: space-between;
				line-height: 55rpx;
				font-size: @middle-title;

				span {
					color: @color-666;
				}
			}
		}

		&-sum {
			height: 96rpx;
			background: @white-color;
			padding: 28rpx;
			width: 100%;
			p {
				display: flex;
				align-items: center;
				font-size: 15px;
				font-weight: 550;

				i {
					color: #ff557f;
					font-weight: 500;
				}
			}

			div {
				display: inline-block;
				height: 96rpx;
				width: 245rpx;
				line-height: 96rpx;
				color: @white-color;
				font-size: 32rpx;
				text-align: center;
				// background: #b79f77;
			}
		}

		&-preferential {
			width: 100%;
			height: 100%;
			position: fixed;
			left: 0;
			top: 0;
			z-index: 999999;
			background: rgba(0, 0, 0, 0.6);

			&-con {
				background-color: #fff;
				height: 880rpx;
				position: absolute;
				width: 100%;
				bottom: 0;

				div {
					height: 92rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					// border-bottom: 1rpx solid #f5f5f5;
					padding: @padding-lr;
				}

				ul {
					height: 675rpx;
					overflow: scroll;

					li {
						background-color: #fff;
						-webkit-box-shadow: 0rpx 0rpx 30rpx #eee;
						box-shadow: 0rpx 0rpx 30rpx #eee;
						border-radius: 8rpx;
						margin: 20rpx 30rpx 0;
						display: -moz-box;
						display: -webkit-box;
						display: box;
						padding: 20rpx 0;

						.pre-left {
							// width: 186rpx;
							text-align: center;
							display: flex;
							flex-direction: column;

							h1 {
								display: inline-block;
								color: #d66377;
								font-size: 40rpx;

								i {
									font-size: @middle-title;
									display: inline-block;
									vertical-align: top;
									// color: #b79f77;
								}
							}

							h2 {
								font-size: 22rpx;
								color: @color-999;
							}
						}

						.pre-center {
							-webkit-box-flex: 1;
							box-flex: 1;
							width: 0;
							display: flex;
							align-items: center;
							flex-direction: column;
							justify-content: center;

							h3 {
								font-size: @top-title;
								color: @color-333;
								margin-bottom: 10rpx;
								text-align: left;
							}

							h4 {
								font-size: 20rpx;
								color: @color-999;
							}
						}

						.pre-right {
							width: 86rpx;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
				}

				.pre-btn {
					display: flex;
					justify-content: center;
					height: 96rpx;
					position: absolute;
					bottom: 0;
					width: 100%;
					text-align: center;
					line-height: 96rpx;
					color: @white-color;
					font-size: @top-title;
					// background: #b79f77;
				}
			}
		}

		.pay-methods-popup {
			background: #ffffff;

			.pay-methods-title {
				width: 681rpx;
				height: 115rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 0 auto;
				border-bottom: 1rpx solid #f6f6f8;

				text {
					font-size: 34rpx;
					font-weight: 400;
					color: #333333;
				}

				.iconfont {
					color: #333333;
					font-size: 34rpx;
				}
			}

			.pay-methods-list {
				.pay-methods-item {
					display: flex;
					align-items: center;
					width: 681rpx;
					height: 106rpx;
					margin: 0 auto;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin: 0 auto;
					border-bottom: 1rpx solid #f6f6f8;

					.name {
						font-size: 26rpx;
						font-weight: 400;
						color: #333333;
					}

					.iconfont {
						font-size: 36rpx;
					}
				}
			}

			.pay-methods-footer {
				position: fixed;
				bottom: 0;
				width: 100%;
				height: 98rpx;
				color: #ffffff;
				text-align: center;
				line-height: 98rpx;
				z-index: 99;
			}
		}

		.red-packet-popup {
			background: #ffffff;

			.red-packet-title {
				width: 681rpx;
				height: 115rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 0 auto;
				border-bottom: 1rpx solid #f6f6f8;

				text {
					font-size: 34rpx;
					font-weight: 400;
					color: #333333;
				}

				.iconfont {
					color: #333333;
					font-size: 34rpx;
				}
			}

			.red-packet-list {
				padding-bottom: 98rpx;

				.red-packet-item {
					display: flex;
					align-items: center;
					margin: 20rpx 0;
					height: 200rpx;
					width: 100%;
					background-image: url('https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/redPacket.png');
					background-repeat: no-repeat;
					background-size: 90% 100%;
					background-position: center;
					position: relative;
					top: 20rpx;

					.red-packet-left {
						height: 100%;
						float: left;
						width: 35%;

						span {
							font-size: 28rpx;
							color: #ffffff;
							position: relative;
							left: 60rpx;
							top: 20rpx;
							letter-spacing: 2rpx;
						}
					}

					.red-packet-right {
						height: 100%;
						float: left;
						width: 55%;

						span {
							display: block;
							height: 40rpx;
							color: #ffffff;
							padding-left: 20rpx;
							font-size: 34rpx;
							line-height: 40rpx;
							position: relative;
							top: 35rpx;
							letter-spacing: 2rpx;
						}
					}
				}
			}

			.red-packet-footer {
				position: fixed;
				bottom: 0;
				width: 100%;
				height: 98rpx;
				color: #ffffff;
				text-align: center;
				line-height: 98rpx;
				z-index: 99;
			}
		}
	}
</style>
