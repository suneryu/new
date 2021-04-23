<template>
	<!-- 商品详情列表 -->
	<div class="warp-box">
		<!-- <commonHeader :leftIcon="leftIcon" :rightIcon="rightIcon" :title="title" /> -->
		<!-- <div @click="goBack" class="shopList-left"><i class="iconfont">&#xe62d;</i></div> -->
		
		<!-- 普通 -->
		<!-- <Banner :skuList="skuList" v-if="getgoodtypes == '00'"></Banner> -->
		<Banner :skuList="skuList" :goodsClass="goodsClass"></Banner>
		<div @click="share" class="shopList-right">
			<!-- <button open-type="share"><i class="iconfont">&#xe608;</i></button> -->
			<i class="iconfont">&#xe608;</i>
		</div>
		<!-- 团购 -->
		<!-- <groupBanner :couponOnceNumd="couponOnceNumd" :ginfoCode="ginfoCode" :skuList="skuList" v-if="getgoodtypes == '24'"></groupBanner> -->
		<!-- 拼团 -->
	<!-- 	<assBanner :couponOnceNumd="couponOnceNumd" :couponOnceNums="couponOnceNums" :ginfoCode="ginfoCode" :skuList="skuList"
		 ref="mychild" v-if="getgoodtypes == '25'"></assBanner> -->
		<!-- 秒杀 -->
		<!-- <seckillBanner :ginfoCode="ginfoCode" :skuList="skuList" v-else-if="getgoodtypes == '26'"></seckillBanner> -->
		<!-- 普通 -->
		<!-- <Specs :specsStrList="specsList" @showSpec="showSpec" @goBuy="goBuy" ></Specs> -->
		<!-- <Promotions :skuList="skuList"></Promotions> -->
		<!-- <Coupon :nullImg="nullImg" :skuList="skuList"></Coupon> -->
		<!-- <Delivery></Delivery> -->
		<!-- :listPro="listPro" -->
		<quickGroup :ginfoCode="ginfoCode" :listp="listp" @showSpec="showSpec" v-if="getgoodtypes == '25' && quickShow"></quickGroup>
		<!-- <Evaluate :goodsCode="goodsCode"></Evaluate> -->
		<proInfor :goodsRemark="goodsRemark"></proInfor>
		<!-- 普通 -->
		<Footers :goodsCode="goodsCode" :indexs="indexs" :skuList="skuList" :userImgurl="userImgurl" :baseColor="baseColor"
		 @addcollectGoods="addcollectGoods" @getSpec="getSpec" @showSpec="showSpec"  @goBuy="goBuy"></Footers>
		<!-- 团购 -->
		<!-- <groupFooters :couponOnceNumd="couponOnceNumd" :getgoodtypes="getgoodtypes" :goodsCode="goodsCode" :indexs="indexs"
		 :skuList="skuList" :userImgurl="userImgurl" @addcollectGoods="addcollectGoods" @getSpec="getSpec" @goBuy="goBuy" @showSpec="showSpec"
		 v-if="getgoodtypes == '24'"></groupFooters> -->
		<!-- 拼团 -->
		<!-- <assFooters :couponOnceNumd="couponOnceNumd"  @goBuy="goBuy" :couponOnceNums="couponOnceNums" :getgoodtypes="getgoodtypes" :goodsCode="goodsCode"
		 :indexs="indexs" :skuList="skuList" :userImgurl="userImgurl" @addcollectGoods="addcollectGoods" @getSpec="getSpec"
		 @showSpec="showSpec" v-if="getgoodtypes == '25'"></assFooters> -->
		<!-- 秒杀 -->
		<!-- <seckillFooters :getgoodtypes="getgoodtypes" @goBuy="goBuy" :goodsCode="goodsCode" :indexs="indexs" :skuList="skuList" :userImgurl="userImgurl"
		 @addcollectGoods="addcollectGoods" @getSpec="getSpec" @showSpec="showSpec" v-if="getgoodtypes == '26'"></seckillFooters> -->
		<!--过渡层-->
		<div @click="cengHandler" class="ceng" v-show="showhiden"></div>
		<!-- 分享弹窗 -->
		<div class="share-wrap a-fadeinB" v-if="shareWrap">
			<div class="share-top">
				<h1 class="share-title">—— 分享 ——</h1>
			</div>
			<div class="t-box share-type">
				<div class="t-box-flex1">
					<button open-type="share">
						<img src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/wx-img/wx.png" />
						<p>分享好友</p>
					</button>
				</div>
				<div @click="canvasHander()" class="t-box-flex1">
					<img src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/wx-img/hb.png" />
					<p>生成海报</p>
				</div>
			</div>
			<div :style="{ background: baseColor }" @click="closeShare" class="closeBut">取消</div>
		</div>
		<!--选择规格-->
		<div :style="{ bottom: bot }" class="spec-boxinfor">
			<div class="auto mar-t20 spec-ptn">
				<div class="spec-header t-box">
					<div class="spec-img mar-r20"><img :src="skuList.dataPic" id="goodsImg" /></div>
					<div class="t-box-flex1">
						<!-- {{unitPrice.obpay}}{{goodsPrice}}{{unitPrice.mapay}} -->
						<h3 class="color_b7 f-s30" id="goodsPrice">
							<span v-if="getgoodtypes == '24'">团购价</span>
							<span v-if="getgoodtypes == '25'">拼团价</span>
							<span v-if="getgoodtypes == '26'">秒杀价</span>
							{{ unitPrice.obpay }}{{goodsClass==1?Number(goodsPrice)*Number(userinfoOcode):goodsPrice }}{{ unitPrice.mapay }}
						</h3>
						已选择:
						<span id="goodsSku">{{ specsList }}</span>
					</div>
					<div @click="_close()" class="spec-close"><i class="iconfont icon-guanbi"></i></div>
				</div>
				<div id="specMain">
					<div class="spec-main mar-t20">
						<div :key="index" class="spec-list t-box" v-for="(item, index) in specList">
							<h3>{{ item.specName }}：</h3>
							<ul :key="indexs" class="clearfix attribute-list" v-for="(items, indexs) in item.specOptionList">
								<li :style="{ color: indexs === items.nu ? '#ffffff' : '', background: indexs === items.nu ? baseColor : '' }"
								 @click="changespecList(indexs, index, items.specValueValue)">
									{{ items.specValueValue }}
								</li>
							</ul>
						</div>
					</div>
				</div>
				<!--选择数量-->
				<div class="sel-goods-num t-box">
					<h3>数量：</h3>
					<div style='display: flex;'>
						<div class="sel-goods-num-btn t-box">
							<button @click="goodsReduce" type="button">-</button>
							<p class="t-box-flex1" id="goodsNum">{{ goodsnum }}</p>
							<button @click="goodsAdd" type="button">+</button>
						</div>
						<div styl='color: #bfbaba;margin-left: 15px;'>(起订量{{goodsMinnum}}个)</div>
					</div>
					
				</div>
			</div>
			<div class="t-box spec-btn">
				<div :style="{ background: baseColor }" @click="confirmBtn(goodsnum)" class="t-box-flex1 t-center surebtn"><a>确定</a></div>
			</div>
		</div>
		<canvas canvas-id="poster" style="width:280px; height:440px; position: absolute;top:-20000%"></canvas>
		<div class="poster a-fadein" style="margin: -0px 0 0 -140px;" v-if="poster">
			<img :src="posterImg" alt style="width:280px;height:440px" />
			<button :style="{ background: baseColor }" @click="downloadFileImg" class="poster-btn">保存相册</button>
		</div>
	</div>
</template>

<script>
	import http from '@/api/http.js';
	import {
		formatTimes,
		formatPhone
	} from '@/utils/prototype/date.js';
	// import { base64src } from "@/utils/base64src.js";
	import {
		$storage,
		$router,
		$message
	} from '@/utils/prototype/vue.js';
	import {
		queryNewUserinfoPageByDealerqt
		} from '@/api/interfaceHDB.js';
	import {
		getResourceGoodsInfoBySkuCode,
		fetchSpeOptByPntCodeNomRel,
		checkCollectExit,
		getPmPromotionInfo,
		evaluate,
		saveFootprint,
		addShoppingGoods,
		addShoppingGoodsBySpec,
		queryPromotionPageAssembleForPc,
		getProappinfo,
		queryEvaluateGoodsPagetrue
		
	} from '@/api/interface.js';
	import commonHeader from '@/components/communal/commonHeader';
	import Banner from '../../../../compenent_modules/o2o_banner2/index';   //商品列表下的页面
	import groupBanner from '../../../../compenent_modules/group_banner/index';
	import assBanner from '../../../../compenent_modules/assemble_banner/index';
	import seckillBanner from '../../../../compenent_modules/seckill_banner/index';
	import Specs from '../../../../compenent_modules/o2o_specs/index2';
	import Promotions from '../../../../compenent_modules/o2o_Promotion/index';
	import Coupon from '../../../../compenent_modules/o2o_coupon/index';
	import Delivery from '../../../../compenent_modules/o2o_delivery/index';
	import Evaluate from '../../../../compenent_modules/o2o_evaluate/index2';
	import proInfor from '../../../../compenent_modules/o2o_proInfor/index2';
	import Footers from '../../../../compenent_modules/o2o_footer/index2';
	import groupFooters from '../../../../compenent_modules/group_footer/index';
	import assFooters from '../../../../compenent_modules/assemble_footer/index';
	import seckillFooters from '../../../../compenent_modules/seckill_footer/index';
	import quickGroup from '../../../../compenent_modules/quick_group/index2';
	export default {
		data() {
			return {
				title: '商品详情',
				leftIcon: false,
				rightIcon: false,
				goodsInforbox: '',
				sonRefresh: false,
				showhiden: false,
				//   bot: "0px",
				goodsnum: 1,
				goodsPrice: '',
				specsList: [], //处理后的规格
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
				skuList: {},
				couponList: [], //优惠券列表
				noCoupon: '',
				Promlist: [], //促销列表
				noProm: '',
				totals: '',
				evaluateList: [],
				nullImg: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/no_coupon.png',

				getUrl: '',
				goodsCode: '',
				pntreeCode: '',
				goodtypes: '',
				getgoodtypes: '00',
				listPro: [],
				quickShow: false,
				ginfoCode: '',
				conts: '0',
				listp: [],
				couponOnceNumd: '', //已拼人数
				couponOnceNums: '',
				userInfor: {},
				poster: false,
				shareWrap: false,
				miniErImg: null,
				posterImg: null, //合成海报的img
				pp: '',
				goodsClass:'',  //商品类型
				goodsMinnum:"", //商品最小起订量
				isContract:false, //判断是否为合约商品
				contractProperty:'',
				userInfoCode:'',
				warehouseName:'',
				userinfoOcode:1

			};
		},
		components: {
			commonHeader,
			Banner,
			groupBanner,
			assBanner,
			seckillBanner,
			Specs,
			Promotions,
			Coupon,
			Delivery,
			Evaluate,
			proInfor,
			Footers,
			groupFooters,
			assFooters,
			seckillFooters,
			quickGroup
		},

		onLoad(options) {
			
			$storage.set("goodsClass",options.goodsClass)
			let that = this;
			console.log('this.options...',that.$options)
			console.log('this.goodsClass-------',options.goodsClass)
			that.goodsClass = options.goodsClass
			that.userInfor = $storage.get('loginInfor');
			Object.assign(that.$data, that.$options.data()); //初始化数据
			if(options.isContract != undefined){
				that.isContract = true
				that.contractProperty = options.contractProperty
				that.warehouseName = options.warehouseName
			}
			let pages = getCurrentPages();
			let prevpage = pages[0];
			// 登陆颜色 商城名字信息
			if (!$storage.get('baseColor')) {
				http.get(getProappinfo).then(res => {
					$storage.set('proappEnvName', res.proappEnvName);
					$storage.set('baseColor', res.proappEnvTheme);
					$storage.set('unitPrice', JSON.parse(res.proappEnvOpenconf));
					wx.setNavigationBarTitle({
						title: $storage.get('proappEnvName')
					});
					wx.setNavigationBarColor({
						frontColor: '#ffffff', // 必写项
						backgroundColor: '#' + $storage.get('baseColor')
					});
					that.$state.baseColor = $storage.get('baseColor');
					that.baseColor = '#' + this.$state.baseColor;
				});
			} else {
				that.baseColor = '#' + that.$state.baseColor;
				that.$state.baseColor = $storage.get('baseColor');
				wx.setNavigationBarColor({
					frontColor: '#ffffff', // 必写项
					backgroundColor: '#' + $storage.get('baseColor')
				});
			}
			$storage.set('prevpage', prevpage.route);
			wx.getSetting({
				success: function(res) {
					console.log('获取用户信息11111')
					if (!res.authSetting['scope.userInfo']) {
						console.log('没有获取用户信息11111')
						// $router.push('authorization', {
						// 	redirectUrl: 'o2o/pages/goodsdetails_modules/o2o_goosDetail'
						// });
						// $router.push('o2o/pages/goodsdetails_modules/o2o_goosDetail2', {
						// 	redirectUrl: 'o2o/pages/goodsdetails_modules/o2o_goosDetail2'
						// });
					}
				},
				fail: function(res) {
					console.log(res);
				}
			});
			that.getgoodtypes = '00';

			//调用单独的商品信息
			// if (options && options.json) {
			//   let skuCode = JSON.parse(options.json).skuCode;
			//   this.getJson = skuCode;
			//   this.getUrl = JSON.parse(options.json).path;
			//   this.getSkuInfo(JSON.parse(options.json).skuCode);
			// } else {
			// wx.showToast({
			//   title: JSON.stringify(options),
			//   icon: "success",
			//   duration: 2000
			// });

			// }
			console.log(options, 'options');
			if (options && options.scene) {
				//contractTypepro-userId-skuCode
				let scene = decodeURIComponent(options.scene);
				console.log(scene, 'scene');
				// wx.showModal({
				//   title: 'scene',
				//   content: scene,
				//   success (res) {
				//   }
				// })
				that.getJson = scene.split('-')[2] || $storage.get('skuCode');
				that.getUserInfo(scene.split('-')[1]);
				$storage.set('contractTypepro', scene[0]);
			} else if (options.json) {
				let json = JSON.parse(options.json);
				that.getJson = json.skuCode || $storage.get('skuCode');
			} else {
				that.getJson = options.skuCode || $storage.get('skuCode');
				that.getUrl = options.path;
				if (options.groupName) {
					$storage.set('groupName', options.groupName);
					$storage.set('groupCode', options.groupCode);
					console.log(options.contractTypepro, 'options.contractTypepro');
					$storage.set('contractTypepro', options.contractTypepro);
					console.log($storage.get('contractTypepro'));
				}
			}
			$storage.set('skuCode', that.getJson);

			// 获取商品类型
			that.getSkuInfo($storage.get('skuCode'));
			// wx.showShareMenu({
			//   withShareTicket: true
			// })
			wx.hideShareMenu()
			
				
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
			this.getStore()
		},
		onShareAppMessage: function(res) {
			let that = this;
			if (res.from === 'button') {
				// 通过按钮触发
				let _path = null;
				if ($storage.get('loginInfor').userinfoQuality.indexOf('group') >= 0) {
					_path =
						`/pages/o2o/pages/goodsdetails_modules/o2o_goosDetail/main?groupCode=${$storage.get('loginInfor').userInfoCode}&groupName=${
					$storage.get('loginInfor').merberCompname
				}&skuCode=${that.getJson}&contractTypepro=40`;
				} else {
					_path = `/pages/o2o/pages/goodsdetails_modules/o2o_goosDetail/main?skuCode=${that.getJson}`;
				}
				return {
					path: _path,
					title: that.skuList.goodsName,
					imageUrl: that.skuList.rsGoodsFileDomainList[0].goodsFileUrl,
					success: function(res) {
						// 转发成功
						that.poster = false;
						that.showhiden = false;
						this.shareWrap = false;
					},
					fail: function(res) {
						// 转发失败
						console.log('转发失败');
					}
				};
			}
		},
		methods: {
			//查询权益
			getQY(){
				this.$qj
					.http(this.$qj.domain)
					.get(queryNewUserinfoPageByDealerqt, {
						userinfoPhone: $storage.get('loginInfor').userPhone
					})
					.then(res => {
							console.log("-----",res)
						console.log('权益值',res.rows[0].userinfoOcode)
						this.userinfoOcode = res.rows[0].userinfoOcode
							if(this.userinfoOcode == null || this.userinfoOcode ==''){
								this.userinfoOcode = 1;
							}
					})
			},
			navigateTo(options) {
				this.$qj.router.push(options.url, options.query ? options.query : '');
			},
			toGoodDetail(num){
				console.log(num,'num')
			},
			getStore(){
				http.get(evaluate).then(res =>{
					console.log("不知道是什么方法",res)
					return res
				})
			},
			// toGoodDetail(){
			// 	$router.push('o2o/pages/goodsdetails_modules/o2o_goosDetail')
			// },
			//分享按钮
			share() {
				let that = this;
				wx.getSetting({
					success: function(res) {
						if (res.authSetting['scope.userInfo']) {
							// 已经授权，可以直接调用 getUserInfo 获取头像昵称
							that.showhiden = true;
							that.shareWrap = true;
							console.log('获取到了用户信息22222')
						} else {
							// 已经授权，可以直接调用 getUserInfo 获取头像昵称
							that.showhiden = true;
							that.shareWrap = true;
							// $router.push('authorization', {
							// 	redirectUrl: 'o2o/pages/goodsdetails_modules/o2o_goosDetail'
							// });
							// $router.push('o2o/pages/goodsdetails_modules/o2o_goosDetail2', {
							// 	redirectUrl: 'o2o/pages/goodsdetails_modules/o2o_goosDetail2'
							// });
						}
					},
					fail: function(res) {
						console.log(res);
					}
				});
			},
			getUserInfo(id) {
				let that = this;
				http.get('/web/um/userservice/getUserservice.json', {
					userId: id
				}).then(res => {
					$storage.set('groupName', res.merberCompname);
					$storage.set('groupCode', res.userInfoCode);
				});
			},
			closeShare() {
				this.showhiden = false;
				this.shareWrap = false;
			},
			showSpec(val) {
				this.goodtypes = val;
				console.log("点击添加购物车的传值，",this.goodtypes)
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
			// 通过商品code查询商品类型
			getSkuInfo(codes) {
				console.log("商品信息为空",codes)
				http.get(getResourceGoodsInfoBySkuCode, {
					skuCode: codes
				}).then(res => {
					this.getgoodtypes = res.goodsType;
					console.log(res.goodsType, 'res.goodsType------------');
					console.log(res, 'res------------');
					$storage.set('goodsType', res.goodsType);
					this.goodsMinnum = res.goodsMinnum
					this.goodsnum = res.goodsMinnum
					this.goodsCode = res.goodsCode;
					this.ginfoCode = res.ginfoCode && res.ginfoCode;
					//拼团请求快速成团接口
					if (res.goodsType == '25') {
						$storage.set('contractTypepro', '01');
						http.get(queryPromotionPageAssembleForPc, {
							promotionPcode: res.ginfoCode
						}).then(res => {
							if (res.list && res.list.length > 0) {
								this.listp = res.list;
								this.listp.map(el => {
									el.promotionActname = formatPhone(el.promotionActname);
								});
								this.quickShow = true;
							}
						});
					}
					//拼团和团购请求接口（请求已拼人数）
					// if (res.goodsType == "24" || res.goodsType == "25") {
						console.log('promotionCode---',res.ginfoCode)
					// http.get(getPmPromotionInfo, {
					// 	promotionCode: res.ginfoCode
					// }).then(res => {
					// 	console.log("产品详情，，，",res)
					// 	if (res == null) {} else {
					// 		this.couponOnceNumd = res.couponOnceNumd ? res.couponOnceNumd : 0; //已经开团数量
					// 		this.couponOnceNums = res.couponOnceNums ? res.couponOnceNums : 0; //基础设置开团次数
					// 		$storage.set('payTime', res.promotionPaytime);
					// 	}
					// });
					// }

					if (res.rsSkuDomainList.length > 0) {
						this.skuList = {};
						res.rsSkuDomainList.map((el, index) => {
							if (el.skuCode == this.getJson) {
								this.skuList = res.rsSkuDomainList[index];
							}
							if (res.goodsType == '24' || res.goodsType == '25' || res.goodsType == '26') {
								$storage.set('goodsPmbillno', res.ginfoCode);
								$storage.set('goodsPbillno', res.goodsProperty3);
								this.skuList.goodsThdate = res.goodsThdate && res.goodsThdate;
								this.skuList.goodsOdate = res.goodsOdate && res.goodsOdate;
								this.skuList.goodsProperty3 = res.goodsProperty3 && res.goodsProperty3;
								this.skuList.goodsNum = res.goodsNum && res.goodsNum;
								this.skuList.ginfoCode = res.ginfoCode && res.ginfoCode;
								if (el.goodsNum - el.goodsSalesvolume > 0) {
									this.skuList.shengyunum = el.goodsNum - el.goodsSalesvolume;
								} else {
									this.skuList.shengyunum = '0';
								}
							}
							// console.log(this.skuList,"this.skuList------------------------------")

							if (!RegExp(/http/).test(el.dataPic)) {
								el.dataPic = this.$domain + el.dataPic;
							}
							el.rsGoodsFileDomainList.map(str => {
								if (!RegExp(/http/).test(str.goodsFileUrl)) {
									str.goodsFileUrl = this.$domain + str.goodsFileUrl;
								}
							});
						});
						this.getspecs = this.skuList.skuName && this.skuList.skuName.replace(new RegExp('/', 'g'), ',');
					}
					if (this.skuList.goodsSalesvolume == null) {
						this.skuList.goodsSalesvolume = '0';
					}
					this.specsList = this.skuList.skuName && this.skuList.skuName.split('/');
					this.skuId = this.skuList && this.skuList.skuId;
					this.goodsPrice = this.skuList.pricesetNprice && (this.skuList.pricesetNprice * 1).toFixed(2);
					this.goodsInforbox = res;
					this.goodsRemark = res.goodsRemark;
					this.pntreeCode = res.pntreeCode;
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
					let arr = this.skuList.skuName && this.skuList.skuName.split('/');
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
						that.addHisty(that.skuList); //添加足迹
					}
					this.goodsRemark =
						this.goodsRemark &&
						this.goodsRemark.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
							return '<img style="width:100%"  src="' + (that.$imgDomain + capture) + '"/>';
						});
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
					if (res.success) {} else {}
				});
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
				if(this.goodsnum > this.goodsMinnum){
					this.goodsnum--;
					if (this.goodsnum < 1) {
						this.goodsnum = 1;
					}
				}
				
			},
			//商品数量++
			goodsAdd() {
				this.goodsnum++;
			},
			//选择规格(n:第一层，index：第二层)
			changespecList(n, inde, names) {
				this.specsList = [];
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
							this.specsList.push(els.specValueValue);
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
				this.addCart();
				// $message.alert(res.msg);
				this.noAddcat = false;
			},
			//请求接口加入购物车
			addCart() {
				
				let addstr = {
					skuId: this.skuId,
					goodsNum: this.goodsnum
				};
				let goodsList = [{
					skuId:this.skuId,
					goodsNum:this.goodsnum,
					shoppingType:"6",
					// channelCode:this.userInfor.channelCode,
					warehouseCode: this.contractProperty,
					warehouseName: this.warehouseName
				}]
				let params = {
					memberBcode:$storage.get('loginInfor').userInfoCode,
					goodsBeanStr:JSON.stringify(goodsList)
				}
				if(this.isContract){
					http.get('/web/oc/empshopping/addShoppingGoodsCode.json',params ).then(res => {
						if(res.success){
							$message.alert('商品加入购物车成功！');
							this._close();
						}else{
							$message.alert(res.msg);
						}
					})
				}else{
					http.post(addShoppingGoods, addstr).then(st => {
					if (st.success) {
						$message.alert('加入购物车成功');
						this._close();
					} else {
						$message.alert(st.msg);
					}
					});
				}
				
			},
			//立即购买
			goBuy() {
				this.showSpec(1);
				
			},

			//确认加入购物车
			confirmBtn(i) {
				console.log('当前的类型---type',this.goodtypes)
				let that = this;
				wx.getSetting({
					success: function(res) {
						// console.log('确认加入购物车',res)
						if (res.authSetting['scope.userInfo']) {
							// 已经授权，可以直接调用 getUserInfo 获取头像昵称
							// if (that.specsList.length == that.specList.length) {
								if(that.goodtypes == 1) {
									// console.log('点击添加数量====')
									// let atr = {
									// 	skuId: that.skuId,
									// 	goodsNum: that.goodsnum
									// };
									// that.$router.replace('order/onlineShop', {
									// 	json: JSON.stringify(atr)
									// });
									
									let goodsClass = $storage.get("goodsClass")
									console.log('----详情页----',goodsClass)
									let options = {
										url: 'order/onlineShop',
										query: {
												skuId: that.skuId,
												goodsNum: that.goodsnum,
												goodsClass:goodsClass
										}
									};
									
									that.navigateTo(options)
								}else{
									that.checkGoodsBySpec(that.specsList);
								}
								
							// } else {
							// 	$message.alert('请选择商品规格！');
							// }
							console.log('获取用户信息33333')
						} else {
							if(that.goodtypes == 1) {
								// console.log('点击添加数量====')
								// let atr = {
								// 	skuId: that.skuId,
								// 	goodsNum: that.goodsnum
								// };
								// that.$router.replace('order/onlineShop', {
								// 	json: JSON.stringify(atr)
								// });
								
								let goodsClass = $storage.get("goodsClass")
								console.log('----详情页----',goodsClass)
								let options = {
									url: 'order/onlineShop',
									query: {
											skuId: that.skuId,
											goodsNum: that.goodsnum,
											goodsClass:goodsClass
									}
								};
								
								that.navigateTo(options)
							}else{
								that.checkGoodsBySpec(that.specsList);
							}
							
							
							
							// $router.push('authorization', {
							// 	redirectUrl: 'o2o/pages/goodsdetails_modules/o2o_goosDetail?skuCode=' + that.getJson
							// });
							// $router.push('o2o/pages/goodsdetails_modules/o2o_goosDetail2', {
							// 	redirectUrl: 'o2o/pages/goodsdetails_modules/o2o_goosDetail2?skuCode=' + that.getJson
							// });
						}
					},
					fail: function(res) {
						console.log(res);
					}
				});
			},
			cengHandler() {
				this.shareWrap = false;
				this.poster = false;
				this.showhiden = false;
				this.bot = '-450px';
			},
			canvasHander() {
				let that = this;
				that.closeShare();
				wx.showLoading({
					title: '海报生成中...'
				});
				let goodsObj = {
					src: that.skuList.rsGoodsFileDomainList[0].goodsFileUrl,
					title: that.skuList.goodsName,
					price: `￥${(that.skuList.pricesetNprice * 1).toFixed(2)}`,
					width: 220, //图片的默认宽度是220px
					wxPrompt: '长按图片识别小程序',
					wxPrompt2: '品质好货 优惠购买'
				};
				if (that.posterImg) {
					that.showhiden = true;
					that.poster = true;
					wx.hideLoading();
					return;
				}
				wx.downloadFile({
					url: that.$domain + '/paas/shop-master/c-static/images/mini-bg.png',
					success(bg) {
						wx.downloadFile({
							url: goodsObj.src,
							success(res) {
								http.post('/web/ml/mlogin/loginMiniCode.json', {
									// scene: `groupCode=${
									//   $storage.get("loginInfor").userInfoCode
									// }&groupNmae="${
									//   $storage.get("loginInfor").merberCompname
									// }&skuCode=${that.getJson}&contractTypepro=40"`,
									scene: `40-${$storage.get('loginInfor').userId}-${that.getJson}`, //contractTypepro-userId-skuCode
									page: 'pages/o2o/pages/goodsdetails_modules/o2o_goosDetail/main',
									width: 280,
									auto_color: true
								}).then(el => {
									let captchaImage = 'data:image/png;base64,' + el.dataObj.dataObj.replace(/[\r\n]/g, '');
									// base64src(captchaImage, wxer => {
									//   let dx = (280 - goodsObj.width) / 2;
									//   if (res.statusCode === 200) {
									//     var ctx = wx.createCanvasContext("poster");
									//     ctx.drawImage(bg.tempFilePath, 0, 0, 280, 440);
									//     ctx.drawImage(
									//       res.tempFilePath,
									//       dx,
									//       30,
									//       goodsObj.width,
									//       goodsObj.width
									//     );
									//     ctx.setFontSize(12);
									//     ctx.setFillStyle("#444");
									//     let lineWidth = 0,
									//       canvasWidth = 200, //计算canvas的宽度
									//       initHeight = goodsObj.width + 55, //绘制字体距离canvas顶部初始的高度
									//       lastSubStrIndex = 0, // 每次开始截取的字符串的索引
									//       index = 1; //表示行数
									//     for (let i = 0; i < goodsObj.title.length; i++) {
									//       lineWidth += ctx.measureText(goodsObj.title[i]).width;
									//       if (index < 3) {
									//         // 最多2行
									//         if (lineWidth > canvasWidth) {
									//           ctx.fillText(
									//             goodsObj.title.substring(lastSubStrIndex, i),
									//             30,
									//             initHeight
									//           ); //绘制截取部分
									//           initHeight += 20; //20为字体的高度
									//           lineWidth = 0;
									//           lastSubStrIndex = i;
									//           index++;
									//         }
									//         if (i == goodsObj.title.length - 1) {
									//           //绘制剩余部分
									//           ctx.fillText(
									//             goodsObj.title.substring(lastSubStrIndex, i + 1),
									//             30,
									//             initHeight
									//           );
									//         }
									//       }
									//     }
									//     ctx.setFontSize(13);
									//     ctx.setFillStyle("#f22929");
									//     ctx.fillText(goodsObj.price, 30, initHeight + 22, 200);
									//     ctx.drawImage(wxer, 30, goodsObj.width + 120, 70, 70);
									//     ctx.setFontSize(14);
									//     ctx.setFillStyle("#000");
									//     ctx.fillText(
									//       goodsObj.wxPrompt,
									//       130,
									//       initHeight + 75,
									//       200
									//     );
									//     ctx.setFontSize(12);
									//     ctx.setFillStyle("#333");
									//     ctx.fillText(
									//       goodsObj.wxPrompt2,
									//       143,
									//       initHeight + 92,
									//       200
									//     );
									//     ctx.draw(true, function() {
									//       wx.canvasToTempFilePath({
									//         canvasId: "poster",
									//         success: function(res) {
									//           console.log(res, "合成成功");
									//           that.posterImg = res.tempFilePath;
									//           that.showhiden = true;
									//           that.poster = true;
									//         },
									//         fail: function(err) {
									//           console.log(err, "合成失败");
									//         }
									//       });
									//     });
									//     setTimeout(() => {
									//       wx.hideLoading();
									//     }, 200);
									//   }
									// });
								});
							},
							error(res) {
								setTimeout(() => {
									wx.hideLoading();
									wx.showToast({
										title: '生成失败',
										icon: 'none',
										duration: 2000
									});
								}, 200);
							}
						});
					}
				});
			},
			downloadFileImg() {
				let posterImg = this.posterImg,
					that = this;
				// if(that.posterImg){

				// }
				wx.getSetting({
					success(res) {
						if (!res.authSetting['scope.writePhotosAlbum']) {
							wx.authorize({
								scope: 'scope.writePhotosAlbum',
								success(el) {
									console.log(el, posterImg, 'elelel');
									wx.saveImageToPhotosAlbum({
										filePath: posterImg,
										success(res) {
											wx.showToast({
												title: '保存成功',
												icon: 'none',
												duration: 2000
											});
										},
										fail(error) {
											console.log(error);
											wx.showToast({
												title: '保存失败',
												icon: 'none',
												duration: 2000
											});
										},
										complete() {
											that.poster = false;
											that.showhiden = false;
										}
									});
								}
							});
						} else {
							console.log(posterImg, 'elelel');
							wx.saveImageToPhotosAlbum({
								filePath: posterImg,
								success(res) {
									wx.showToast({
										title: '保存成功',
										icon: 'none',
										duration: 2000
									});
								},
								fail(error) {
									console.log(error);
									wx.showToast({
										title: '保存失败',
										icon: 'none',
										duration: 2000
									});
								},
								complete() {
									that.poster = false;
									that.showhiden = false;
								}
							});
						}
					}
				});
				//
			}
		}
	};
</script>

<style lang="less" scoped>
	@import '../../../../../common/css/common.less';

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
							// background: #07913b;
							// border-color: #07913b;
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
			// background: #07913b;
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

	.shopList-right {
		z-index: 10000;
		height: 90rpx;
		width: 100%;
		line-height: 90rpx;
		text-align: right;
		margin-top: -135rpx;
		.iconfont {
			margin-right: 30rpx;
		}
		button {
			background: none;
			outline: none;
			border: none;
		}

		button::after {
			border: none;
		}
	}

	.warp-box {
		padding-bottom: 50px;
	}

	.share-wrap {
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		width: 100%;
		background: #ffffff;
		z-index: 1000001;

		//   height: 260rpx;
		.share-top {
			height: 120rpx;
			line-height: 120rpx;
			text-align: center;
			font-size: 32rpx;
		}

		.share-type {
			text-align: center;
			margin-bottom: 60rpx;

			img {
				display: inline-block;
				width: 100rpx;
				height: 100rpx;
				border-radius: 100rpx;
				margin-bottom: 30rpx;
			}

			p {
				font-size: 24rpx;
			}

			button {
				background: none !important;
			}

			button::after {
				background: none;
				border: none;
			}
		}

		.closeBut {
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			color: #fff;
			// background: #07913b;
			font-size: 32rpx;
		}
	}

	.poster {
		position: fixed;
		top: 10%;
		left: 50%;
		z-index: 100002;

		.poster-btn {
			border: none;
			color: #fff;
			margin: 20rpx auto;
			font-size: 30rpx;
			background: #f37444;
			width: 260rpx;
			border-radius: 80rpx;
		}
	}

	.a-fadeinB,
	.a-fadein {
		-webkit-animation: 0.2s linear backwards;
		-moz-animation: 0.2s linear backwards;
		-ms-animation: 0.2s linear backwards;
		animation: 0.2s linear backwards;
	}

	/* 淡入-从下 */
	.a-fadeinB {
		-webkit-animation-name: fadeinB;
		-moz-animation-name: fadeinB;
		-ms-animation-name: fadeinB;
		animation-name: fadeinB;
	}

	.a-fadein {
		-webkit-animation-name: fadein;
		-moz-animation-name: fadein;
		-ms-animation-name: fadein;
		animation-name: fadein;
	}

	/* 淡入-从下 */
	@-webkit-keyframes fadein {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	@keyframes fadein {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	/* 淡入-从下 */
	@-webkit-keyframes fadeinB {
		0% {
			-webkit-transform: translateY(200px);
		}

		100% {
			-webkit-transform: translateY(0);
		}
	}

	@keyframes fadeinB {
		0% {
			transform: translateY(200px);
		}

		100% {
			transform: translateY(0);
		}
	}
</style>
