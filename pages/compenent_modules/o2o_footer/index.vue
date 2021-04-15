<template>
	<div :class="$storage.get('iosModel')?'footer-box isIOS':'footer-box'">
		<div class="footer t-box">
			<div class="left-cont t-box-flex3">
				<div class="t-box mar-t6">
					<!-- <div class="t-box-flex1 text-center font-12" @click="goStore()">
						<i class="iconfont icon-dianpu"></i>
						<p>店铺</p>
					</div> -->
					
					<div class="t-box-flex1 text-center font-12" @click="Service">
						<i class="iconfont">&#xe6b3;</i>
						<p>客服</p>
					</div>
					<!-- <div class="t-box-flex1 text-center font-12 " @click="collectGoods()">
						<i class="iconfont" v-if="index1=='0'" :style="{'color':( index1=='0'?baseColor:'')}">&#xe7f8;</i>
						<i class="iconfont" v-else>&#xe7f9;</i>
						<p style="color: #666666;">收藏</p>
					</div> -->
				</div>
			</div>
			<!-- <div class="addcar t-box-flex3">
				<div class="addCart" @click="addCart">加入购物车</div>
			</div> -->
			<div class="addcar t-box-flex3">
				<div class="toBuy" @click="goBuy">立即购买</div>
			</div>
		</div>
		<!--过渡层-->
		<div class="ceng" v-show="showhiden"></div>
		<!-- 客服 -->
		<div class="customer-service" :style="{bottom:botser}">
			<ul v-for="(item,index) in sevTelList" :key="index">
				<li class="tel">
					<p>
						{{item.ocsOcserviceReDomain.ocserviceName}}:
						<span>{{item.ocsOcserviceReDomain.ocserviceRemark}}</span>
					</p>
				</li>
				<li @click="close">取消</li>
			</ul>
		</div>
	</div>
</template>
<script>
	import http from "@/api/http.js";
	import {
		$storage,
		$router,
		$message
	} from "@/utils/prototype/vue.js";
	import {
		addShoppingGoods,
		addShoppingGoodsBySpec,
		queryOcsconfigList,
		deleteCollectByCode,
		saveCollect,
		checkCollectExit
	} from "@/api/interface.js";
	export default {
		props: [
			"specList",
			"skuList",
			"baseColor",
			"getspecs",
			"indexs",
			"goodsCode"
		],
		data() {
			return {
				userImgurl: require("../../../static/img/helpCenter/header.png"),
				index1: '1',
				// baseColor: "",
				showhiden: false,
				botser: "-70px",
				goodsnum: 1,
				sevTelList: [],
				spec: [],
				specShowed: true,
				noAddcat: true,
				goodsPrice: "",
				skuId: "",
				collectCode: "",
				load: true
			};
		},
		onLoad() {
			let that = this;
			Object.assign(this.$data, this.$options.data()); //初始化数据
			let pages = getCurrentPages();
			let prevpage = pages[0];
			$storage.set("prevpage", prevpage.route);
			wx.setNavigationBarColor({
				frontColor: "#ffffff", // 必写项
				backgroundColor: "#" + that.baseColor
			});
			// that.baseColor = "#" + $storage.get("baseColor");
		},
		computed: {
			unitPrice() {
				// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
				return this.$state.unitPrice || $storage.get("unitPrice");
			}
		},
		watch: {
			goodsCode(newVal, old) {
				if (this.load && newVal) {
					this.load = false;
					console.log(123)
					if ($storage.get("userInfo") && $storage.get("loginInfor")) {
						this.checkCollectDoods(0, this.skuList.skuCode);
					}
				}
			}
		},
		mounted() {
			if ($storage.get("userInfo") && $storage.get("loginInfor")) {
				this.checkCollectDoods(0, this.skuList.skuCode);
			}
		},
		methods: {
			//跳转店铺
			goStore() {
				this.$emit("goStore");
			},
			goBuy() {
				this.$emit("goBuy");
			},
			//校验是否收藏
			checkCollectDoods(type, code) {
				let _date = {
					collectType: type, //(0商品  1 商铺)
					collectOpcode: code
				};
				http.get(checkCollectExit, _date).then(res => {
					if (res.success) {
						if (res.dataObj == null) {
							this.index1 = '1';
						} else {
							this.index1 = '0';
							this.collectCode = res.dataObj;
						}
					} else {
						$message.alert(res.msg);
					}
				});
			},
			//客服
			Service() {
				http.get(queryOcsconfigList).then(res => {
					if (res.length > 0) {
						this.showhiden = true;
						this.botser = "50px";
						this.sevTelList = res;
					}
				});
			},
			//关闭客服
			close() {
				this.showhiden = false;
				this.botser = "-100px";
			},
			addCart() {
				this.$emit("showSpec");
			},
			// 跳转购物车
			goCart() {
				$storage.get("getTopPerMenuList").map(v => {
					if (v.menuAction == "car") {
						$router.reOpen(v.menuJspath);
					}
				});
			},

			//添加收藏
			collectGoods() {
				//   this.$emit("addcollectGoods");
				if (this.collectCode == "") {
					let _date = {
						collectType: 0, //(0商品  1 商铺)
						//   collectOpcode: this.getJson,
						collectOpcode: this.skuList.skuCode,
						collectOppic: this.skuList.dataPic, //图片
						collectOpcont: this.skuList.goodsName, //内容
						collectOpmark: "", //说明这里是skuname
						collectOpnum: this.skuList.pricesetNprice, //这里是价格
						collectOpnum1: "", //对应的量，这里是积分
						goodsOrigin: this.skuList.goodsOrigin, //数据来源
						collectOpurl: this.collectUrl //收藏url
					};
					http.post(saveCollect, _date).then(res => {
						if (res.success) {
							this.collectCode = res.dataObj;
							this.index1 = "0";
							$message.alert("收藏成功");
						} else {
							$message.alert("添加收藏失败");
						}
					});
				} else {
					let _date = {
						collectCode: this.collectCode,
						collectType: 0
					};
					http.post(deleteCollectByCode, _date).then(res => {
						if (res.success) {
							this.index1 = "1";
							this.collectCode = "";
							$message.alert("取消收藏成功");
						} else {
							$message.alert("取消收藏失败");
						}
					});
				}
			},
			handleContact(e) {
				console.log(e)
			}
		}
	};
</script>

<style lang="less" scoped>
	@import "../../../common/css/common.less";

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

	.footer-box {
		position: fixed;
		bottom: 0rpx;
		height: 98rpx;
		left: 0rpx;
		width: 100%;
		z-index: 100001;
		background: @white-color;

		.footer {
			.addcar {
				position: relative;
				// background: #07913b;
				box-sizing: border-box;
				text-align: center;
				color: @white-color;
				font-size: 32rpx;
				line-height: 98rpx;
				padding: 10rpx;
				padding-top: 23rpx;

				.addCart {
					position: absolute;
					top: 55%;
					transform: translateY(-50%);
					box-sizing: border-box;
					width: 220rpx;
					height: 65rpx;
					border: 2rpx solid #374e80;
					background-color: #feeae7;
					border-radius: 6rpx;
					color: #374e80;
					font-size: 24rpx;
					line-height: 65rpx;
					text-align: center;
				}

				.toBuy {
					position: absolute;
					top: 55%;
					transform: translateY(-50%);
					box-sizing: border-box;
					width: 220rpx;
					height: 65rpx;
					background-color: #374e80;
					border-radius: 6rpx;
					color: #fff;
					font-size: 24rpx;
					line-height: 65rpx;
					text-align: center;
				}
			}
		}
	}

	.isIOS {
		height: 148rpx;
		padding-bottom: 50rpx;

		&-kefu {
			top: 47rpx !important;
		}
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

	.customer-service {
		position: fixed;
		left: 7.5%;
		width: 85%;
		z-index: 100001;
		margin: 0 auto;

		ul {
			height: 140rpx;

			li {
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				border-radius: 8rpx;
				margin-bottom: 8rpx;
				background: @white-color;
			}

			li:first-child {}
		}
	}

	.contact {
		position: relative;
		height: 74rpx;
		background-color: #fff;
		text-align: center;
		margin-bottom: 20rpx;

		.i {
			position: absolute;
			top: -20rpx;
			left: 50%;
			transform: translateX(-50%);
		}

		p {
			position: absolute;
			bottom: 1rpx;
			left: 50%;
			transform: translateX(-50%);
			color: #666666;
			font-size: 24rpx;
			width: 100%;
			line-height: 26rpx;
			height: 25rpx;
		}
	}

	.contact::after {
		display: none;
	}

	// .spec-boxinfor {
	//   background: @white-color;
	//   position: fixed;
	//   bottom: -784rpx;
	//   // bottom: 0px;
	//   left: 0;
	//   z-index: 100001;
	//   width: 100%;
	//   max-height: 784rpx;
	//   height: auto;
	//   font-size: 24rpx;
	//   .spec-ptn {
	//     padding: 30rpx;
	//     .spec-header {
	//       .spec-img {
	//         width: 160rpx;
	//         height: 160rpx;
	//         overflow: hidden;
	//         img {
	//           display: inline-block;
	//           width: 100%;
	//           height: 100%;
	//         }
	//       }
	//       h3 {
	//         margin-top: 80rpx;
	//         margin-bottom: 12rpx;
	//         color: #e40506;
	//       }
	//     }
	//     .spec-main {
	//       margin-top: 40rpx;
	//       .spec-list {
	//         h3 {
	//           height: 108rpx;
	//           line-height: 108rpx;
	//         }
	//         ul {
	//           overflow: hidden;
	//           li {
	//             float: left;
	//             margin: 20rpx 20rpx 0 0;
	//             height: 54rpx;
	//             line-height: 54rpx;
	//             min-width: 70rpx;
	//             padding: 0 10rpx;
	//             text-align: center;
	//             border: 1rpx solid #eeeeee;
	//             border-radius: 8rpx;
	//           }
	//           .active {
	//             color: #fff;
	//             background: #07913b;
	//             border-color: #07913b;
	//           }
	//         }
	//       }
	//     }
	//     .sel-goods-num {
	//       height: 108rpx;
	//       line-height: 108rpx;
	//       .sel-goods-num-btn {
	//         margin-top: 20rpx;
	//         width: 228rpx;
	//         height: 56rpx;
	//         line-height: 56rpx;
	//         border-radius: 0px;
	//         color: #9b9b9b;
	//         font-size: 36rpx;
	//         button {
	//           font-size: 48rpx;
	//           width: 64rpx;
	//           height: inherit;
	//           background: #f5f5f5;
	//           color: #999;
	//           line-height: 52rpx;
	//           border-radius: 0rpx;
	//         }
	//         p {
	//           font-size: 32rpx;
	//           text-align: center;
	//         }
	//       }
	//     }
	//   }
	//   .surebtn {
	//     height: 90rpx;
	//     line-height: 90rpx;
	//     text-align: center;
	//     color: #fff;
	//     background: #07913b;
	//     font-size: 32rpx;
	//   }
	// }
</style>
