<template>
	<div class="warp-box">
		<commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
		<div class="shopList-left" @click="goBack"><i class="iconfont">&#xe62d;</i></div>
		<Banner :skuList="skuList" :promotionEndtime="promotionEndtime"></Banner>
		<Specs :specsStrList="specsStrList" @showSpec="showSpec"></Specs>
		<Coupon :couponList="couponList" :noCoupon="noCoupon" :nullImg="nullImg" @getCouponList="getCouponList"></Coupon>
		<Evaluate :goodsCode="goodsCode" :evaluateList="evaluateList" :totals="totals"></Evaluate>
		<proInfor :goodsRemark="goodsRemark"></proInfor>
		<Footers :skuList="skuList" @getSpec="getSpec" @addcollectGoods="addcollectGoods" :indexs="indexs" :userImgurl="userImgurl" @showSpec="showSpec"></Footers>
		<div class="ceng" v-show="showhiden"></div>
		<div class="spec-boxinfor" :style="{ bottom: bot }">
			<div class="auto mar-t20 spec-ptn">
				<div class="spec-header t-box">
					<div class="spec-img mar-r20"><img :src="skuList.dataPic" id="goodsImg" /></div>
					<div class="t-box-flex1">
						<h3 class="color_b7 f-s30" id="goodsPrice">团购价{{ unitPrice.obpay }}{{ goodsPrice }}{{ unitPrice.mapay }}</h3>
						已选择:
						<span id="goodsSku">{{ specsStrList }}</span>
					</div>
					<div class="spec-close" @click="_close()"><i class="iconfont icon-guanbi"></i></div>
				</div>
				<div id="specMain">
					<div class="spec-main mar-t20">
						<div class="spec-list t-box" v-for="(item, index) in specList" :key="index">
							<h3>{{ item.specName }}：</h3>
							<ul class="clearfix attribute-list" v-for="(items, indexs) in item.specOptionList" :key="indexs">
								<li
									:style="{ color: indexs === items.nu ? '#ffffff' : '', background: indexs === items.nu ? baseColor : '' }"
									@click="changespecList(indexs, index, items.specValueValue)"
								>
									{{ items.specValueValue }}
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="sel-goods-num t-box">
					<h3>数量：</h3>
					<div class="sel-goods-num-btn t-box">
						<button type="button" @click="goodsReduce">-</button>
						<p class="t-box-flex1" id="goodsNum">{{ goodsnum }}</p>
						<button type="button" @click="goodsAdd">+</button>
					</div>
				</div>
			</div>
			<div class="t-box spec-btn">
				<div class="t-box-flex1 t-center surebtn" @click="confirmBtn(1)"><a>确定</a></div>
			</div>
		</div>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { formatTimes, formatPhone, formatDate } from '@/utils/prototype/date.js';
import { $storage, $router, $message } from '@/utils/prototype/vue.js';
import {
	getResourceGoodsInfoBySkuCode,
	fetchSpeOptByPntCodeNomRel,
	checkCollectExit,
	saveCollect,
	deleteCollectByCode,
	evaluate,
	saveFootprint,
	queryCouponListBySkuCode,
	queryPromotionListByGoodsCode,
	addShoppingGoods,
	addShoppingGoodsBySpec,
	getPmPromotionInfo
} from '@/api/interface.js';
import commonHeader from '@/components/communal/commonHeader';
import Banner from '../../../../compenent_modules/group_banner/index';
import Specs from '../../../../compenent_modules/o2o_specs/index';
import Promotions from '../../../../compenent_modules/o2o_Promotion/index';
import Coupon from '../../../../compenent_modules/o2o_coupon/index';
import Delivery from '../../../../compenent_modules/o2o_delivery/index';
import Evaluate from '../../../../compenent_modules/o2o_evaluate/index';
import proInfor from '../../../../compenent_modules/o2o_proInfor/index';
import Footers from '../../../../compenent_modules/group_footer/index';
export default {
	data() {
		return {
			title: '商品详情',
			leftIcon: false,
			rightIcon: false,
			goodsInforbox: '',

			showhiden: false,
			//   bot: "0px",
			goodsnum: 1,
			goodsPrice: '',
			specsStrList: [], //处理后的规格
			skuId: '',
			specList: [], //规格数组
			index1: '',

			bot: '-450px',
			specsStr: [],
			spec: [],
			specShowed: true,
			noAddcat: true,
			baseColor: '',
			rsSpecValueDomainList: [], //规格数组
			getspecs: '',
			goodsRemark: '', //产品介绍
			indexs: '1', //收藏 0是收藏，1是未收藏
			collectCode: '', //已经收藏的商品code
			collectUrl: '', //收藏URL
			userImgurl: '',
			getJson: '', //接受参数
			skuList: '',
			couponList: [], //优惠券列表
			noCoupon: '',
			Promlist: [], //促销列表
			noProm: '',
			totals: '',
			evaluateList: [],
			nullImg: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/no_coupon.png',
			nullPromImg: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noGoods.png',
			getUrl: '',
			goodsCode: '',
			pntreeCode: '',
			ginfoCode: '',
			promotionEndtime: ''
		};
	},
	components: {
		commonHeader,
		Banner,
		Specs,
		Promotions,
		Coupon,
		Delivery,
		Evaluate,
		proInfor,
		Footers
	},
	onLoad(options) {
		wx.showShareMenu({
			withShareTicket: true
		});
		Object.assign(this.$data, this.$options.data()); //初始化数据
		let pages = getCurrentPages();
		let prevpage = pages[0];
		$storage.set('prevpage', prevpage.route);
		wx.setNavigationBarColor({
			frontColor: '#ffffff', // 必写项
			backgroundColor: '#' + $storage.get('baseColor')
		});
		// this.baseColor = "#" + $storage.get("baseColor");
		this.baseColor = '#' + this.$state.baseColor;
		//调用单独的商品信息
		// this.getSkuInfo("2019111900000143");
		if (options && options.json) {
			let skuCode = JSON.parse(options.json).skuCode;
			this.getJson = skuCode;
			this.getUrl = JSON.parse(options.json).path;
			this.getSkuInfo(JSON.parse(options.json).skuCode);
		} else {
			this.getJson = options.skuCode;
			this.getSkuInfo(options.skuCode);
		}
		wx.showShareMenu({
			withShareTicket: true
		});
	},
	computed: {
		unitPrice() {
			// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
			return this.$state.unitPrice || $storage.get('unitPrice');
		}
	},
	mounted() {
		let pages = getCurrentPages(); //获取加载的页面
		let currentPage = pages[pages.length - 1]; //获取当前页面的对象
		let collectUrl = currentPage.route; //当前页面url
		this.collectUrl = collectUrl;
		this.baseColor = '#' + this.$state.baseColor;
	},

	methods: {
		shareBtn() {
			wx.showShareMenu({
				withShareTicket: true
			});
		},
		showSpec() {
			this.showhiden = true;
			this.bot = '0px';
		},
		//返回
		goBack() {
			let goUrl = $storage.get('getTopPerMenuList');
			let urlList = [];
			goUrl.map(el => {
				if (el.menuCode == '00000042') {
					urlList = el.children;
				}
			});
			if (this.getUrl == 'home') {
				this.$router.replace('web', {
					defaultUrl: $storage.get('pagesUrl')
				});
			} else if (this.getUrl == 'channel') {
				urlList.map(el => {
					if (el.proappMenuCode == 'mp000014001') {
						this.$router.replace('web', {
							defaultUrl: this.$businessDomain + '/paas/shop/' + el.menuAction
						});
					}
				});
			} else if (this.getUrl == 'childchannel') {
				urlList.map(el => {
					if (el.proappMenuCode == 'mp000014002') {
						this.$router.replace('web', {
							defaultUrl: this.$businessDomain + '/paas/shop/' + el.menuAction
						});
					}
				});
			} else {
				this.$router.back();
			}
		},
		getSpec(str) {
			this.getspecs = str;
		},
		getSkuInfo(codes) {
			http.get(getResourceGoodsInfoBySkuCode, { skuCode: codes }).then(res => {
				console.log(res, '数据');
				this.goodsCode = res.goodsCode;
				this.ginfoCode = res.ginfoCode && res.ginfoCode;

				if (res.rsSkuDomainList.length > 0) {
					res.rsSkuDomainList.map((el, index) => {
						if (el.skuCode == this.getJson) {
							// if (el.skuCode == "2019111900000143") {
							this.skuList = res.rsSkuDomainList[index];
						}
						if (!RegExp(/http/).test(el.dataPic)) {
							el.dataPic = this.$domain + el.dataPic;
						}
						el.rsGoodsFileDomainList.map(str => {
							if (!RegExp(/http/).test(str.goodsFileUrl)) {
								str.goodsFileUrl = this.$domain + str.goodsFileUrl;
							}
						});
					});
					console.log(this.skuList.goodsSalesvolume, 'this.skuList.goodsSalesvolume');
					if (this.skuList.goodsSalesvolume == null) {
						this.skuList.goodsSalesvolume = '0';
						console.log(this.skuList.goodsSalesvolume, '999999999');
					}
					console.log(this.skuList.goodsSalesvolume, 'this.skuList.goodsSalesvolume');
					this.getspecs = this.skuList.skuName && this.skuList.skuName.replace(new RegExp('/', 'g'), ',');
				}

				console.log(this.skuList, 'this.skuList');
				this.specsStrList = this.skuList.skuName && this.skuList.skuName.split('/');
				this.skuId = this.skuList && this.skuList.skuId;
				this.goodsPrice = this.skuList.pricesetNprice && (this.skuList.pricesetNprice * 1).toFixed(2);
				this.goodsInforbox = res;
				this.goodsRemark = res.goodsRemark;
				this.pntreeCode = res.pntreeCode;
				this.goodsCode = res.goodsCode;
				// 处理规格
				var map = {};
				for (var i = 0; i < res.rsSpecValueDomainList.length; i++) {
					var ai = res.rsSpecValueDomainList[i];
					if (!map[ai.specName]) {
						this.specList.push({
							specName: ai.specName,
							specCode: ai.specCode,
							specGroupCode: ai.specGroupCode,
							tenantCode: ai.tenantCode,
							specOptionList: [ai]
						});
						map[ai.specName] = ai;
					} else {
						for (var j = 0; j < this.specList.length; j++) {
							var dj = this.specList[j];
							if (dj.specName == ai.specName) {
								dj.specOptionList.push(ai);
								break;
							}
						}
					}
				}
				http.get(getPmPromotionInfo, { promotionCode: this.ginfoCode }).then(res => {
					if (res.couponOnceNums) {
						this.skuList.couponOnceNums = res.couponOnceNums;
						$storage.set('goodsPbillno', res.couponOnceNums); // 成团人数
						$storage.set('goodsPmbillno', this.ginfoCode); // 团购 平团  描述营销单号
					}
					if (res.promotionEndtime) {
						this.skuList.promotionEndtime = res.promotionEndtime;
						this.promotionEndtime = res.promotionEndtime && res.promotionEndtime;
						this.$emit('countDown', this.skuList.promotionEndtime);
					}
					console.log(res, 'res---获取单个商品团购信息');
					console.log(this.skuList, '团购信息之后');
				});
				let arr = this.skuList.skuName && this.skuList.skuName.split('/');
				console.log(this.skuList.skuName, '规格数据');
				this.specList.map(els => {
					els.specOptionList.map((el, index) => {
						arr.forEach(element => {
							if (element == el.specValueValue) {
								el.nu = index;
							}
						});
					});
				});
				let that = this;
				// 校验商品是否收藏
				if ($storage.get('userInfo') && $storage.get('loginInfor')) {
					that.checkCollectDoods(0, 'this.getJson');
					//   that.checkCollectDoods(0, "2019111900000143");
					that.addHisty(that.skuList); //添加足迹
				}
				setTimeout(function() {
					that.getPromlist(); //促销列表
					that.getCouponList(); //优惠券列表
				}, 1000);
				//获取评价
				this.getFirstevaluate(this.goodsCode);
				this.goodsRemark =
					this.goodsRemark &&
					this.goodsRemark.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
						return '<img style="width:100%"  src="' + (that.$domain + capture) + '"/>';
					});
			});
		},
		//获取促销列表
		getPromlist() {
			let _datas = {
				skuCode: this.skuList.skuCode,
				skuNo: this.skuList.skuNo,
				classtreeCode: this.skuList.classtreeCode,
				brandCode: this.skuList.brandCode,
				pntreeCode: this.skuList.skuNo,
				memberCode: this.skuList.memberCode
			};
			http.get(queryPromotionListByGoodsCode, _datas).then(res => {
				if (res.length > 0) {
					this.Promlist = res;
				} else {
					this.Promlist = res;
					this.noProm = '暂无促销活动';
				}
			});
		},
		//获取优惠券
		getCouponList() {
			let _datas = {
				skuCode: this.skuList.skuCode,
				skuNo: this.skuList.skuNo,
				classtreeCode: this.skuList.classtreeCode,
				brandCode: this.skuList.brandCode,
				pntreeCode: this.skuList.skuNo,
				memberCode: this.skuList.memberCode
			};
			http.get(queryCouponListBySkuCode, _datas).then(res => {
				if (res.length > 0) {
					res.map(el => {
						el.receiveEnd = formatTimes(el.receiveEnd);
						el.receiveStart = formatTimes(el.receiveStart);
						(el.staute = '领取'), (el.styles = '#07913B');
					});
				}

				if (res.length > 0) {
					this.couponList = res;
				} else {
					this.noCoupon = '暂无优惠券';
				}
			});
		},
		//添加足迹
		addHisty(res) {
			let _datas = {
				footprintType: '0', //0商品1店铺2其它
				footprintOpcode: res.skuCode,
				footprintOppic: res.dataPic, //浏览图片
				footprintOpcont: res.goodsName, //浏览内容
				footprintOpnum: res.pricesetNprice, //浏览对应的量（商品价格店铺数量）
				footprintOpurl: this.collectUrl // 收藏URL
			};
			http.post(saveFootprint, _datas).then(res => {
				if (res.success) {
				} else {
				}
			});
		},
		//获取评价
		getFirstevaluate(str) {
			let _date = {
				goodsCode: str
			};
			http.get(evaluate, _date).then(res => {
				if (res.list.length > 0) {
					res.list.map(el => {
						el.memberBname = formatPhone(el.memberBname);
						if (!RegExp(/http/).test(el.dataPic)) {
							el.dataPic = this.$domain + el.dataPic;
						}
					});
					this.totals = res.total;
					this.evaluateList = res.list[0];
				} else {
					this.showEv = false;
					this.totals = '0';
				}
			});
		},
		//获取商品详情的规格
		// getSpeclist(st) {
		//   let _date = {
		//     pntreeCode: st
		//   };
		//   http.post(fetchSpeOptByPntCodeNomRel, _date).then(str => {
		//     if (str.length > 0) {
		//       let arr = this.skuList.skuName.split("/");
		//       str.map(els => {
		//         console.log("sdlfj ");
		//         els.specOptionList.map((el, index) => {
		//           arr.forEach(element => {
		//             if (element == el.specOptionName) {
		//               console.log("zhoa");
		//               el.nu = index;
		//             }
		//           });
		//         });
		//       });
		//       this.specList = str;
		//     }
		//   });
		// },
		// 校验商品是否收藏
		checkCollectDoods(type, code) {
			let _date = {
				collectType: type, //(0商品  1 商铺)
				collectOpcode: code
			};
			http.get(checkCollectExit, _date).then(res => {
				if (res.success) {
					if (res.dataObj == null) {
						this.indexs = 1;
					} else {
						this.indexs = 0;
						this.collectCode = res.dataObj;
					}
				} else {
					$message.alert(res.msg);
				}
			});
		},
		//添加收藏
		addcollectGoods() {
			if (this.collectCode == '') {
				let _date = {
					collectType: 0, //(0商品  1 商铺)
					collectOpcode: this.getJson,
					//   collectOpcode: "2019111900000143",
					collectOppic: this.skuList.dataPic, //图片
					collectOpcont: this.skuList.goodsName, //内容
					collectOpmark: '', //说明这里是skuname
					collectOpnum: this.skuList.pricesetNprice, //这里是价格
					collectOpnum1: '', //对应的量，这里是积分
					goodsOrigin: this.skuList.goodsOrigin, //数据来源
					collectOpurl: this.collectUrl //收藏url
				};
				http.post(saveCollect, _date).then(res => {
					if (res.success) {
						this.collectCode = res.dataObj;
						this.indexs = '0';
						$message.alert('收藏成功');
					} else {
						$message.alert('添加收藏失败');
					}
				});
			} else {
				let _date = {
					collectCode: this.collectCode,
					collectType: 0
				};
				http.post(deleteCollectByCode, _date).then(res => {
					if (res.success) {
						this.indexs = '1';
						this.collectCode = '';
						$message.alert('取消收藏成功');
					} else {
						$message.alert('取消收藏失败');
					}
				});
			}
		},
		// 关闭弹窗
		_close() {
			this.showhiden = false;
			this.bot = '-450px';
		},
		//过滤数组
		filter_array(array) {
			return array.filter(item => item);
		},
		//商品数量--
		goodsReduce() {
			this.goodsnum--;
			if (this.goodsnum < 1) {
				this.goodsnum = 1;
			}
		},
		//商品数量++
		goodsAdd() {
			this.goodsnum++;
		},
		//选择规格(n:第一层，index：第二层)
		changespecList(n, inde, names) {
			this.specsStrList = [];
			let that = this;
			that.specList[inde].specOptionList.map((el, index) => {
				if (index == n) {
					this.specList[inde].specOptionList[n].nu = n;
				} else {
					el.nu = null;
				}
			});
			this.filter_array(that.specList).map(ele => {
				ele.specOptionList.map(els => {
					if (els.nu != null) {
						this.specsStrList.push(els.specValueValue);
					}
				});
			});
		},
		// 校验规格商品是否存在
		checkGoodsBySpec(str) {
			let _data = {
				specStr: JSON.stringify(str),
				goodsCode: this.skuList.goodsCode
			};
			http.post(addShoppingGoodsBySpec, _data).then(res => {
				if (res.success) {
					this.noAddcat = true;
					if (res.dataObj != null) {
						this.skuId = res.dataObj.skuId;
						this.goodsPrice = res.pricesetNprice;
						this.userImgurl = this.$domain + res.dataObj.dataPic;
						this.goBuy();
					}
				} else {
					$message.alert(res.msg);
					this.noAddcat = false;
				}
			});
		},
		//请求接口加入购物车
		goBuy() {
			let atr = {
				skuId: this.skuId,
				goodsNum: this.goodsnum
			};
			this.$router.replace('order/accounts', { json: JSON.stringify(atr) });
			//   http.post(addShoppingGoods, addstr).then(st => {
			//     if (st.success) {
			//       $message.alert("加入购物车成功");
			//       this._close();
			//     } else {
			//       $message.alert(st.msg);
			//     }
			//   });
		},

		//确认加入购物车
		confirmBtn(i) {
			if (this.specsStrList.length == this.specList.length) {
				this.checkGoodsBySpec(this.specsStrList);
			} else {
				$message.alert('请选择商品规格！');
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '../../../../../common/css/common.less';
.shopcart-save {
	position: fixed;
	z-index: 99999;
	height: 90rpx;
	width: 70rpx;
	line-height: 90rpx;
	text-align: right;
	right: 30rpx;
	top: 0;
	font-size: @big-title;
	button {
		border: none;
		font-size: 24rpx;
	}
}
.t-box {
	display: flex;
}
.t-box-flex1 {
	flex: 1;
}
.t-box-flex2 {
	flex: 2;
}
.t-box-flex3 {
	flex: 3;
}
.mar-r20 {
	margin-right: 20rpx;
}
.mar-t6 {
	margin-top: 8rpx;
}
.text-left {
	text-align: left;
}
.text-right {
	text-align: right;
}
.text-center {
	text-align: center;
}
.font-12 {
	font-size: 24rpx;
}
.color-999 {
	color: #999999;
}
.ceng {
	background: rgba(0, 0, 0, 0.6);
	position: fixed;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	z-index: 100001;
}
.spec-boxinfor {
	background: @white-color;
	position: fixed;
	bottom: -784rpx;
	// bottom: 0px;
	left: 0;
	z-index: 100001;
	width: 100%;
	max-height: 784rpx;
	height: auto;
	font-size: 24rpx;
	.spec-ptn {
		padding: 30rpx;
		.spec-header {
			.spec-img {
				width: 160rpx;
				height: 160rpx;
				overflow: hidden;
				img {
					display: inline-block;
					width: 100%;
					height: 100%;
				}
			}
			h3 {
				margin-top: 80rpx;
				margin-bottom: 12rpx;
				color: #e40506;
			}
		}
		.spec-main {
			margin-top: 40rpx;
			.spec-list {
				h3 {
					height: 108rpx;
					line-height: 108rpx;
				}
				ul {
					overflow: hidden;
					li {
						float: left;
						margin: 20rpx 20rpx 0 0;
						height: 54rpx;
						line-height: 54rpx;
						min-width: 70rpx;
						padding: 0 10rpx;
						text-align: center;
						border: 1rpx solid #eeeeee;
						border-radius: 8rpx;
					}
					.active {
						color: #fff;
						background: #07913b;
						border-color: #07913b;
					}
				}
			}
		}
		.sel-goods-num {
			height: 108rpx;
			line-height: 108rpx;
			.sel-goods-num-btn {
				margin-top: 20rpx;
				width: 228rpx;
				height: 56rpx;
				line-height: 56rpx;
				border-radius: 0px;
				color: #9b9b9b;
				font-size: 36rpx;
				button {
					font-size: 48rpx;
					width: 64rpx;
					height: inherit;
					background: #f5f5f5;
					color: #999;
					line-height: 52rpx;
					border-radius: 0rpx;
				}
				p {
					font-size: 32rpx;
					text-align: center;
				}
			}
		}
	}
	.surebtn {
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		color: #fff;
		background: #07913b;
		font-size: 32rpx;
	}
}
.shopList-left {
	position: fixed;
	z-index: 10000;
	height: 90rpx;
	width: 70rpx;
	line-height: 90rpx;
	text-align: left;
	left: 30rpx;
	top: 0;
}

.warp-box {
	padding-bottom: 50px;
}
</style>
