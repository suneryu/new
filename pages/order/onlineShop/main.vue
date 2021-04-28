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

		<div class="accounts-info" v-for="(shoppingItem, index) in shoppingItems" :key="index" v-if="shoppingItems && shoppingItems.length > 0">
			<div class="accounts-info-tit">{{ shoppingItem.memberMname }}</div>
			<div v-for="(list, listIndex) in shoppingItem.shoppingpackageList" :key="listIndex">
				<div class="accounts-info-con" v-for="(goods, goodsIndex) in list.shoppingGoodsList" :key="goodsIndex">
					<img :src="goods.dataPic" />
					<div>
						<h2>{{ goods.goodsName }}</h2>
						<h3>{{ goods.skuName }}</h3>
						<h4>
							<h3 v-if="userinfoType=='2' && checkModifyAudit != '3'" :style="{ color: '#333' }">{{ unitPrice.obpay }}{{ goods.pricesetNprice }}{{ unitPrice.mapay }}</h3>
							<div style="text-align: left;" v-if="goodsClass==1 && userinfoType=='2' && checkModifyAudit == '3' ">
								<span class="originalPrice1">{{ unitPrice.obpay }}{{ goods.pricesetNprice }}{{ unitPrice.mapay }} </span>
								<span style='margin-left: 4px;' :style="{ color: '#d66377' }"> 采购价：{{ unitPrice.obpay }}{{ goods.pricesetCGprice.toFixed(2) }}{{ unitPrice.mapay }}</span>
								<!-- <span style='margin-left: 4px;' :style="{ color: '#d66377' }"> 采购价：{{ unitPrice.obpay }}{{ goods.pricesetCGprice.toFixed(2) }}{{ unitPrice.mapay }}</span> -->
							</div>
							<span>×{{ goods.goodsCamount }}</span>
						</h4>
					</div>
				</div>
				<div class="accounts-info-con" v-for="(gift, giftIndex) in list.giftList" :key="giftIndex">
					<img :src="gift.dataPic" />
					<div>
						<h2>
							<span :style="{ color: baseColoAr, borderColor: baseColor }">赠品</span>
							{{ gift.goodsName }}
						</h2>
						<h3>{{ gift.skuName }}</h3>
						<h4>
							{{ unitPrice.obpay }}0{{ unitPrice.mapay }}
							<span>×1</span>
						</h4>
					</div>
				</div>
				<div class="accounts-con">
					<div>
						配送方式
						<div>
							<span>普通快递</span>
							<i class="iconfont">&#xe61d;</i>
						</div>
					</div>
				</div>
				<div class="accounts-textarea">
					<span>备注信息：</span>
					<input placeholder="请填写" v-model="list.packageRemark" />
				</div>
				<div class="accounts-info-money">
					共{{ list.goodsNum }}件，小计：
					<span :style="{ color: baseColor }" v-if="list.goodsMoney">{{ unitPrice.obpay }}{{ list.goodsMoney.toFixed(2) }}{{ unitPrice.mapay }}</span>
				</div>
			</div>
		</div>

		<div class="accounts-con" @click="choosePayMethods" v-if="shoppingItems[0].shoppingType != '06' && shoppingItems[0].shoppingType != '28'">
			<div>
				支付方式
				<div>
					<span>{{ payMethodsList[payMethodsIndex].ptfpmodeName }}</span>
					<i class="iconfont">&#xe61d;</i>
				</div>
			</div>
		</div>
		<!-- <div class="accounts-con" v-else> -->
		<!-- <div class="accounts-con" >
			<div>
				支付方式
				<div>
					<span>在线支付</span>
					<i class="iconfont">&#xe61d;</i>
				</div>
			</div>
		</div> -->
		<!-- <div class="accounts-count">
			<p>
				商品金额
				<span>{{ unitPrice.obpay }}{{ shoppingCountPrice }}{{ unitPrice.mapay }}</span>
			</p>
			<p>
				运费
				<span>{{ unitPrice.obpay }}{{ freight }}{{ unitPrice.mapay }}</span>
			</p>
			<p v-if="shoppingItems[0].shoppingType != '06' && shoppingItems[0].shoppingType != '28'">
				优惠
				<span>-{{ unitPrice.obpay }}{{ comDisMoney }}{{ unitPrice.mapay }}</span>
			</p>
			<p v-else>
				积分抵扣
				<span>-{{ sumPoints }}积分</span>
			</p>
			<p v-if="shoppingItems[0].shoppingType != '06' && shoppingItems[0].shoppingType != '28'">
				会员权益
				<span>{{ unitPrice.obpay }}{{ totalDiscountPrice }}{{ unitPrice.mapay }}</span>
			</p>
		</div> -->
		<div class="accounts-sum">
			<p>
				应付金额:
				<!-- <i>{{ unitPrice.obpay }}{{ accountsSumPrice }}{{ unitPrice.mapay }}</i> -->
				<i>{{ unitPrice.obpay }}{{ allPrice }}{{ unitPrice.mapay }}</i>
			</p>
			<div @click="savePayPrice" :style="{ background: baseColor }">立即支付</div>
		</div>


		<u-popup class="pay-methods-popup" v-model="payMethodsPopup" mode="bottom" height="427rpx">
			<view class="pay-methods-title">
				<text>支付方式</text>
				<view class="iconfont icon-guanbi" @click="closePayMethodsPopup"></view>
			</view>
			<view class="pay-methods-list">
				<view class="pay-methods-item" v-for="(item, index) in payMethodsList" :key="index" @click="clickPayMethodsItem(item,index)">
					<view class="name">{{ item.ptfpmodeName }}</view>
					<view class="iconfont" :class="{ 'icon-xuanzhong-01': payMethodsTempIndex == index, 'icon-checkboxround0': payMethodsTempIndex != index }"
					 v-bind:style="{ color: secondaryColor }"></view>
				</view>
			</view>
			<view style="height: 98rpx;"></view>
			<view class="pay-methods-footer" v-bind:style="{ backgroundColor: baseColor }" @click="confirmPayMethods">确认</view>
		</u-popup>
		<u-popup class="red-packet-popup" v-model="redPacketPopup" mode="bottom" height="733rpx">
			<view class="red-packet-title">
				<text>红包</text>
				<view class="iconfont icon-guanbi" @click="closeRedPacketPopup"></view>
			</view>
			<view class="red-packet-list">
				<view class="red-packet-item" v-for="(item, index) in redPacketList" :key="index">
					<div class="red-packet-left">
						<span>￥</span>
						<span style="font-size:128rpx;font-weight: bold;">{{ item.discAmount }}</span>
					</div>
					<div class="red-packet-right">
						<span>{{ item.promotionName }}</span>
						<span style="font-size: 24rpx;">{{ item.discName }}</span>
						<span style="font-size: 20rpx;">{{ item.couponStart }}-{{ item.couponEnd }}</span>
					</div>
					<div class="pre-right" @click="checkRedPacket(item, index)">
						<i class="iconfont" :style="{ color: index === currentRedPacketIndex ? baseColor : secondaryColor }">&#xe671;</i>
					</div>
				</view>
			</view>
			<view class="red-packet-footer" v-bind:style="{ backgroundColor: baseColor }" @click="confirmRedPacket">确认</view>
		</u-popup>
	</div>
</template>

<script>

	import {
		queryNewUserinfoPageByDealerqt
	
	} from '@/api/interfaceHDB.js';
	import {
			userapplyStateAndAuth
	
	} from '@/api/interface.js';
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
		uploadGoodsFile,


	} from '@/node_modules/qj-mini-pages/libs/api/interface.js';
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
	import Vue from 'vue';
	export default {
		data() {
			return {
				// // CONTRACT_EARNEST 返利金额  订单使用卷的时候把  卷的名称 存在 CONTRACT_SETTL_OPEMO
				title: '确认订单',
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
				temp: '',
				goodsClass:'',//商品分类  耗材 零配件 纪念品
				contractTemPmode:'',
				contractPmode:'',
				allPrice:'',
				truesPrice:'',
				userinfoType:"",   //个人类型
				checkModifyAudit:"",  // 是否授权
				userInfoCode:"",
				userinfoOcode: 1, //权益值
				userPhone:"" ,  //手机号
				pricesetCGprice:'', //采购价格
				partnerType:0   //信用额度
			};
		},
		onLoad(options) {
			this.goodsClass = options.goodsClass
			this.temp = options;
			console.log('传来的option是啥，', this.temp)
			console.log('传来的option是啥，', options)
			// this.userInfoCode = this.$qj.storage.get('userdetailsInfo').userInfoCode
		},
		onShow() {
			this.userinfoType = $storage.get('loginInfor').userinfoType;
			this.userInfoCode = $storage.get('loginInfor').userInfoCode;
			this.userPhone = $storage.get('loginInfor').userPhone;
			console.log(this.userPhone,'手机号=---')
			this.getQY();
			this.searchStatus();
			
			// 初始化价格数据
			this.initPriceData();
			// 初始化地址数据
			this.initAddressData();
			
			
		},
		created(){
			
		},
		mounted() {
			console.log("----===========",this.goodsClass)
			this.currentIndex = -1;
			this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
			this.secondaryColor = `#${this.$qj.storage.get('secondaryColor')}` || this.baseColor;
			
			this.query = this.$state.order;
			// this.searchStatus()
			// this.accountsSumPrice()
			// * 优惠金额（ 优惠券 + 红包 + 活动） *
			
			// if(this.userinfoType == '2' && this.checkModifyAudit == '3'){
			// 	this.pricesetCGprice = Number(this.pricesetNprice) * this.userinfoOcode
			// }
			// 	/
		},
		computed: {
			comDisMoney() {
				return Add(Add(this.copyComDisMoney, this.couponDiscount), this.redPacketDiscount);
			},
			unitPrice() {
				// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
				return this.$state.unitPrice || this.$qj.storage.get('unitPrice');
			},
			

			/**
			 * 最后应付金额
			 */
			accountsSumPrice() {
				// let price = (this.shoppingCountPrice + this.totalDiscountPrice - Add(Add(this.copyComDisMoney, this.couponDiscount),
				// 	this.redPacketDiscount) + this.freight).toFixed(2);
				// return price > 0 ? price : 0;
				
			}

		},

		watch: {
			currentCoupon(newValue, oldValue) {
				let coupon = newValue;
				if (Object.keys(coupon).length > 0) {
					this.selectPromotionName = coupon.promotionName;
					// 代金券 0003 满减券 0004 折扣券 0005
					if (coupon.pbCode === '0003' || coupon.pbCode === '0004') {
						this.couponDiscount = coupon.discAmount;
					}
					if (coupon.pbCode === '0005') {
						this.couponDiscount = this.shoppingCountPrice * parseFloat(1 - coupon.discAmount / 100).toFixed(2);
					}
				}
			},

			currentRedPacket(newValue, oldValue) {
				let redPacket = newValue;
				if (Object.keys(redPacket).length > 0) {
					this.selectRedPacketName = redPacket.promotionName;
					this.redPacketDiscount = redPacket.discAmount;
				}
			}
		},
		methods: {
			// 查询 认证授权 状态
			searchStatus() {
				let that = this
				let paramsStatus = {}
				paramsStatus.userCode = that.userInfoCode
				that.$qj
					.http(that.$qj.domain)
					.get(userapplyStateAndAuth, paramsStatus)
					.then(res => {
						console.log("认证授权状态4444444，",res)
						that.channelCode = res.userinfoChannelcode
						that.partnerType = res.partnerType
						console.log(that.partnerType,'that.partnerType')
						if (res.checkModifyAudit == '3') {
							that.checkModifyAudit = "3"
						}
					// 初始化订单数据
						that.initOrderData(that.temp);
						this.initPayMethods();
					});
			},
			//查询权益
			getQY(){
				this.$qj
					.http(this.$qj.domain)
					.get(queryNewUserinfoPageByDealerqt, {
						userinfoPhone: this.userPhone
					})
					.then(res => {
							console.log("用户信息-----",res)
						if(res.rows[0].userinfoOcode == null || res.rows[0].userinfoOcode ==''){
							this.userinfoOcode = 1;
						}else{
							this.userinfoOcode = res.rows[0].userinfoOcode
						}
						console.log('权益值',this.userinfoOcode)
						
					})
			},
			// 从缓存中判断这个人是个人还是企业

			/* 	showUpload(){
					if(contractType != '06'){
						this.isupload=true
					}
				}, */
				
			// 路由跳转
			navigateBack() {
				this.$qj.router.back();
			},
			navigateTo(options) {
				this.$qj.router.push(options.url, options.query ? options.query : '');
			},
			delImg(index) {
				this.upImg.splice(index, 1)
			},
			chooseImage() {
				let i = 0; // 多图上传时使用到的index
				let that = this;
				let max = 5; //最大选择数
				let upLength; //图片数组长度
				let imgFilePaths; //图片的本地临时文件路径列表

				wx.chooseImage({
					count: max, //一次最多可以选择的图片张数
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						imgFilePaths = res.tempFilePaths;
						upLength = imgFilePaths.length;
						/**
						 * 上传完成后把文件上传到服务器
						 */
						wx.showLoading({
							title: '上传中...'
						});
						that.upLoad(imgFilePaths, i, upLength); //上传操作
					},
					fail: function() {
						console.log('fail');
					},
					complete: function() {
						console.log('commplete');
					}
				});
			},
			upLoad(imgPath, i, upLength) {
				console.log(imgPath[i]);
				let that = this;
				//上传文件
				wx.uploadFile({
					url: this.$domain + uploadGoodsFile, //上传图片的接口地址
					filePath: imgPath[i], //本地上传图片地址
					name: 'file',
					formData: {
						imgIndex: i
					},
					header: {
						'Content-Type': 'multipart/form-data',
						cookie: wx.getStorageSync('miniToken') + '=' + wx.getStorageSync('sessionid'),
						'saas-Agent': getApp().globalData.saasAgent
					},
					success: function(res) {
						// fileName
						that.upImg.push({
							name: that.$domain + JSON.parse(res.data).fileName,
							url: that.$domain + JSON.parse(res.data).fileUrl
						})
					},
					fail: function(res) {
						wx.hideLoading();
						wx.showModal({
							//title: '提示',
							content: '上传图片失败',
							showCancel: false,
							success: function(res) {}
						});
					},
					complete: function() {
						i++;
						if (i == upLength) {
							wx.hideLoading();
						} else {
							that.upLoad(imgPath, i, upLength);
						}
					}
				});
			},
			/**
			 * 初始化和钱有关的变量
			 */
			initPriceData() {
				// 初始化涉及到钱的变量，防止页面从后台到前台的时候在原有基础上再次计算
				this.totalDiscountPrice = 0;
				this.shoppingCountPrice = 0;
				this.freight = 0;
				this.copyComDisMoney = 0;
				this.couponDiscount = 0;
				this.redPacketDiscount = 0;
				this.sumPoints = 0;
			},

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

			// initPayMethods() {
			// 	console.log('1111++=')
			// 	this.$qj
			// 		.http(this.$qj.domain)
			// 		.get(getCurrPayMethods)
			// 		.then(res => {
			// 			if (res && res.rows) {
			// 				this.payMethodsList = res.rows;
			// 			}
			// 		});
			// },
			// 初始化 支付方式
			initPayMethods() {
				console.log("当前的类型----",this.goodsClass)
				this.payMethodsList = [{
					ptfpmodeName: '线上',
					contractPmode:'0'
					
				}, {
					ptfpmodeName: '线下',
					contractPmode:'1'
				}]
				if (this.goodsClass == '1') { //零配件
					// 价格  线上 线下 信用额度
					this.payMethodsList = [{
						ptfpmodeName: '线上',
						contractPmode:'0'
						
					}, {
						ptfpmodeName: '线下',
						contractPmode:'1'
					}]
					//判断是否有信用额度
						console.log("有信用额度-----")
						console.log("有信用额度-----",this.partnerType)
					if(this.partnerType == 1){
						let type1={
							ptfpmodeName: '信用额度支付',
							contractPmode:'2'
							}
						
						this.payMethodsList.push(type1)
					}
					
				}
				if (this.goodsClass == '2') { //耗材订单
					// 价格  先去审核  审核通过后 去支付（线上 线下 信用额度）
					this.payMethodsList = [{
						ptfpmodeName: '线上',
						contractPmode:'0'
					}, {
						ptfpmodeName: '线下',
						contractPmode:'1'
					}]
					

				}
				if (this.goodsClass == '3') { //纪念品订单
					// 价格 线上支付
					this.payMethodsList = [{
						ptfpmodeName: '线上',
						contractPmode:'0'
					}]
				}

			},

			/**
			 * 初始化订单数据
			 */
			initOrderData(options) {
				let that = this
				// 购物车下单使用vuex通信
				let shoppingGoodsIdStr = JSON.stringify(this.$state.shoppingGoodsIdStr);
				let rsSkuListStr = JSON.stringify(this.$state.rsSkuListStr);

				// //判断是否是详情页跳转过来的
				// if (options && options.json) {
				// 	this.skuDataByDetail = JSON.parse(options.json);
				// 	console.log(this.skuDataByDetail,'详情页跳进来的')
				// 	this.orderWay = 0;
				// } else {
				// 	this.orderWay = 1;
				// 	console.log(options,'订单列表')
				// }
				this.orderWay = 0;

				// let requestParams = this.orderWay === 0 ? this.skuDataByDetail : {
				// 	shoppingGoodsIdStr: shoppingGoodsIdStr
				// };
				this.$qj
					.http(this.$qj.domain)
					// .post(this.orderWay === 0 ? queryToContract : queryShoppingToContract, requestParams)
					.post(queryToContract, that.temp)
					.then(res => {
						let that = this
						console.log("获取商品信息", res)
						// 如果返回nologin，则return，避免请求并行造成的弹出多个授权框
						if (res.errorCode == 'nologin') {
							return;
						}
						if (res && res instanceof Array) {
							this.shoppingItems = res;
							// console.log(this.shoppingItems,"就是你")
							that.allPrice = 0
							this.shoppingItems.map(v => {
								v.shoppingpackageList.map(vk => {
									this.copyComDisMoney += vk.disMoney;
									this.sumPoints += vk.pricesetRefrice;
									// 商品不减优惠 应付金额
									if(this.goodsClass == '1' && this.userinfoType == '2' && this.checkModifyAudit =='3'){
										that.allPrice =(Number(that.allPrice) + (vk.goodsMoney *this.userinfoOcode)).toFixed(2)
									}else{
										that.allPrice += vk.goodsMoney
									}

									// 商品减去优惠 应付金额
									// that.truesPrice = that.allPrice-v.信用额度
									vk.shoppingGoodsList.map(val => {
										val.dataPic = this.$domain + val.dataPic;
										this.contractGoodsList.push(val);
										this.pmContractGoodsDomainListStr.push(val);
										//采购价格
										console.log('this.userinfoOcode-----',this.userinfoOcode)
										console.log('vk.pricesetNprice',val.pricesetNprice)
										val.pricesetCGprice = val.pricesetNprice * this.userinfoOcode
										console.log('this.pricesetCGprice===',val.pricesetCGprice)
										
									});
									//小计的价格
									if(this.goodsClass == '1' && this.userinfoType == '2' && this.checkModifyAudit =='3'){
										vk.goodsMoney  = vk.goodsMoney * this.userinfoOcode
										}
									
									if (vk.giftList) {
										console.log(vk.giftList, "xxxxxx")
										vk.giftList.map(val => {
											val.dataPic = this.$domain + val.dataPic;
											this.contractGoodsList.push(val);
										});
									}
								});
								
							});

						}
					});
			},


			addClass() {
				this.$qj.router.push('user_modules/address/manage', {
					json: 1
				});
			},

			/**
			 * 格式化优惠券和红包的时间
			 * @param {Object} list
			 */
			formatCouponDate(list) {
				list.map(v => {
					v.couponStart = formatTimes(v.couponStart);
					v.couponEnd = formatTimes(v.couponEnd);
				});
			},

			checkRedPacket(item, index) {
				this.currentRedPacketIndex = index;
				this.currentRedPacket = item;
			},



			confirmRedPacket() {
				if (this.currentRedPacketIndex == -1) {
					this.redPacketPopup = false;
					return;
				}

				if (this.redPacketList[this.currentRedPacketIndex].discStart > this.shoppingCountPrice) {
					this.$qj.message.alert('该红包不满足条件，请使用其他红包');
					return;
				}

				this.currentRedPacke = this.redPacketList[this.currentRedPacketIndex];

				this.redPacketPopup = false;
			},

			choosePayMethods() {
				this.payMethodsPopup = true;
				this.payMethodsTempIndex = this.payMethodsIndex;
			},

			clickPayMethodsItem(item,index) {
				console.log(item,'item----')
				console.log(index,'index----')
				this.contractTemPmode = item.contractPmode
				this.payMethodsTempIndex = index;
			},

			confirmPayMethods() {
				console.log('点击确定按钮')
				this.payMethodsIndex = this.payMethodsTempIndex;
				this.contractPmode = this.contractTemPmode
                // this.accountsSumPrice()
				this.payMethodsPopup = false;
			},

			closePayMethodsPopup() {
				this.payMethodsPopup = false;
			},

			closeRedPacketPopup() {
				this.redPacketPopup = false;
			},

			/**
			 * 获取订单优惠占比
			 */
			// requestGetContractDiscountRatio() {
			// 	return this.$qj.http(this.$qj.domain).get(getContractDiscountRatio);
			// },

			dataHandlerFormDetail() {},

			dataHandlerFormShoppingCart() {},

			async savePayPrice() {
				if (JSON.stringify(this.addressList) === '{}') {
					this.$qj.message.alert('请选择地址');
				} else {
					this.scontractPmode = this.payMethodsList.length > 0 ? this.payMethodsList[this.payMethodsIndex].ptfpmodeType : 0;
					this.contractPmode = this.payMethodsList.length > 0 ? this.payMethodsList[this.payMethodsIndex].contractPmode : 0;
					
					// 计算订单优惠占比
					// let ratio = 0;
					// let getRatioRes = await this.requestGetContractDiscountRatio();
					// if (getRatioRes.success && getRatioRes.dataObj != null) {
					// 	ratio = getRatioRes.dataObj.flagSettingInfo;
					// }
					// if (ratio > 0 && (this.totalDiscountPrice + this.comDisMoney) / this.shoppingCountPrice > ratio / 100) {
					// 	this.$qj.message.alert(`订单优惠占比不能超过${ratio}%`);
					// 	return;
					// }

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
						contractType: this.shoppingItems[0].shoppingType,
						contractPumode: '0', //提货方式
						goodsSupplierName: '', //配送商
						goodsSupplierCode: '', //配送商Code
						packageList: [],
						ocContractSettlList: [],
						packageMode: '', //配送方式
						contractInmoney: (Number(this.shoppingCountPrice) + Number(this.freight.toFixed(2))).toFixed(2), //  销售含税金额 (优惠前)
						contractMoney: this.accountsSumPrice, // 最终销售含税金额 (优惠后)
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
								if(this.goodsClass == '2'){ //耗材订单
									  //  let options = {
											// url: 'pay/payhaocai',
											// query: {
											// 	// userPhone: this.userPhone || this.inputUserPhone 
											// }
									  //  };
									   // this.navigateTo(options);
									   this.$qj.router.replace('pay/payhaocai');
									
								}
								if(this.goodsClass == '1'){ //零配件
								if(this.contractPmode == '0'){ // 线上
									this.$qj.router.replace('pay/paySelect');
								}else{
									this.$qj.router.replace('order_modules/order/index');
								}
									// this.$qj.router.replace('pay/paySelect');
								}
								if(this.goodsClass == '3'){ //纪念品
								   this.$qj.router.replace('pay/paySelect');
								}
								
								
								
								
							}
						});	
				}
					// if(this.goodsClass == '2'){//耗材订单
					
					//    let options = {
					// 	url: 'pay/payhaocai',
					// 	query: {
					// 		// userPhone: this.userPhone || this.inputUserPhone 
					// 	}
					//    };
					//    this.navigateTo(options);
					   
					// }
					// if(this.goodsClass == '1'){// 零配件 线上支付
						
					// },
					// if(this.goodsClass == '3'){// 纪念品 线上待支付
						
					// },
			}
		}
	};
</script>

<style lang="less" scoped>
	@import '@/node_modules/qj-mini-pages/libs/css/common.less';
.originalPrice1{
	text-decoration: line-through;
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
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 10;
			height: 96rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: @white-color;
			text-indent: 20rpx;
			width: 100%;

			p {
				display: flex;
				align-items: center;

				i {
					color: #d66377;
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
