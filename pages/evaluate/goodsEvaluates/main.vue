<template>
	<div class="evaluateList">
		<commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
		<!-- <div class="evaluateList-tit">
        <h1>综合评分</h1>
        <p>
          <i class="iconfont" :style="{color:baseColor}">&#xe610;</i>
          <i class="iconfont" :style="{color:baseColor}">&#xe610;</i>
          <i class="iconfont" :style="{color:baseColor}">&#xe610;</i>
          <i class="iconfont" :style="{color:baseColor}">&#xe610;</i>
          <i class="iconfont" :style="{color:baseColor}">&#xe610;</i>
          4.0分
        </p>
        <h5>993人参与评价</h5>
    </div>-->
		<div class="bgcolor" :style="{ height: scroll_height + 'rpx' }">
			<div class="evaluateList-box">
				<ul v-if="evaluateList.length != 0">
					<li v-for="(evaluate, index) in evaluateList" :key="index">
						<div class="box-con">
							<div class="box-tit">
								<div class="box-left">
									<img :src="evaluate.userImgurl" />
									<div>
										<h3>{{ evaluate.memberBname }}</h3>
										<p>{{ evaluate.gmtCreate }}</p>
									</div>
								</div>
								<div class="box-right">
									<i class="iconfont" v-for="(item, iconRedIndex) in evaluate.evaluateScopeReList" :key="iconRedIndex" :style="{ color: baseColor }">&#xe610;</i>
									<i
										class="iconfont"
										v-if="evaluate.evaluateScopeReList.length < 5"
										:style="{ color: baseColor }"
										v-for="(item, iconIndex) in 5 - evaluate.evaluateScopeReList.length"
										:key="iconIndex"
									>
										&#xe60e;
									</i>
								</div>
							</div>
							<div class="box-info">{{ evaluate.evaluateGoodsContent }}</div>
							<div class="reply" v-show="evaluate.shopReply.length > 0">
								<i class="iconfont">&#xe766;</i>
								<p>客服回复：{{ evaluate.shopReply && evaluate.shopReply[0] ? evaluate.shopReply[0].evaluateReplyContent : '' }}</p>
							</div>
							<ol v-show="evaluate.evaluateGoodsImgsList && evaluate.evaluateGoodsImgsList.length > 0">
								<li v-for="(goodsImg, imgIndex) in evaluate.evaluateGoodsImgsList" :key="imgIndex"><img :src="goodsImg" /></li>
							</ol>
						</div>
					</li>
				</ul>
				<h3 class="noel" v-if="evaluateList.length == 0">暂无此商品评价</h3>
			</div>
		</div>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $router } from '@/utils/prototype/vue.js';
import { evaluate } from '@/api/interface.js';
import commonHeader from '@/components/communal/commonHeader';
import { formatDate } from '@/utils/prototype/date.js';
export default {
	data() {
		return {
			title: '全部评价',
			leftIcon: true,
			rightIcon: false,
			baseColor: '',
			evaluateList: [],
			userImgurl: require('../../../static/img/mine/default_header.png'),
			scroll_height: ''
		};
	},
	onLoad(options) {
		wx.setNavigationBarTitle({
			title: $storage.get('proappEnvName')
		});
		wx.setNavigationBarColor({
			frontColor: '#ffffff', // 必写项
			backgroundColor: '#' + this.$state.baseColor
		});
		let attr = JSON.parse(options.json);
		$storage.set('htmlMessage', attr);
		http.post(evaluate, attr).then(res => {
			this.evaluateList = res.rows;
			let list = JSON.parse(JSON.stringify(this.evaluateList));
			list.map(v => {
				v.gmtCreate = formatDate(v.gmtCreate);
				v.memberBname = v.memberBname.substring(0, 1) + '***' + v.memberBname.substring(v.memberBname.length - 1);
				if (v.evaluateGoodsImgsList) {
					v.evaluateGoodsImgsList.map((val, k) => {
						v.evaluateGoodsImgsList[k] = this.$domain + v.evaluateGoodsImgsList[k];
					});
				}
			});
			this.evaluateList = list;
		});
		var that = this;
		wx.getSystemInfo({
			//微信自身api
			success: function(res) {
				that.scroll_height = res.screenHeight * 2;
				// that.listHeight = res.screenHeight * 2 - 640;
			}
		});
	},
	mounted() {
		this.baseColor = '#' + this.$state.baseColor;
	},
	components: {
		commonHeader
	},
	methods: {}
};
</script>

<style lang="less" scoped>
@import '../../../common/css/common.less';
.bgcolor {
	background: @white-color;
}
.noel {
	text-align: center;
	margin-top: 200rpx;
	font-size: 26rpx;
	color: #999999;
}
.evaluateList {
	width: 100%;
	background: @white-color;
	// &-tit{
	//    margin-top: 90rpx;
	//    padding: 40rpx 30rpx;
	//    border-bottom: 20rpx solid #fafafa;
	//    h1{
	//      font-size: 28rpx;
	//      color: #212121;
	//    }
	//    h5{
	//      font-size: @middle-title;
	//      color:@color-999;
	//    }
	//    p{
	//      padding: 20rpx 0;
	//      i{
	//        float: left;
	//        margin-right: 12rpx;
	//        font-size: 38rpx;
	//        &:last-child{
	//          margin-right: 36rpx;
	//        }
	//      }
	//    }
	// }
	.evaluateList-box {
		margin-top: 90rpx;
		ul {
			li {
				padding: 40rpx 0;
				border-bottom: 1rpx solid #f6f6f8;
				.box-con {
					padding: @padding-30;
					.box-tit {
						display: flex;
						align-items: flex-end;
						justify-content: space-between;
						.box-left {
							display: flex;
							align-items: center;
							p {
								font-size: 20rpx;
								color: @color-999;
							}
							img {
								width: 70rpx;
								height: 70rpx;
								border-radius: 50%;
								margin-right: 16rpx;
							}
							h3 {
								color: #252525;
								font-size: @big-title;
							}
						}
						.box-right {
							i {
								float: left;
								margin-right: 10rpx;
								font-size: 28rpx;
							}
						}
					}
					.box-info {
						font-size: @top-title;
						color: @color-333;
						margin: 32rpx 0 14rpx 0;
					}
					ol {
						overflow: hidden;
						zoom: 1;
						li {
							width: 214rpx;
							height: 214rpx;
							margin-right: 24rpx;
							float: left;
							img {
								width: 214rpx;
								height: 214rpx;
							}
							&:nth-child(3n) {
								margin-right: 0;
							}
						}
					}
					.reply {
						background: #f6f6f6;
						border-radius: 2rpx;
						position: relative;
						padding: 20rpx;
						p {
							line-height: 40rpx;
							font-size: @middle-title;
							color: @color-666;
						}
						i {
							color: #f6f6f6;
							position: absolute;
							top: -26rpx;
							left: 42rpx;
						}
					}
				}
			}
		}
	}
}
</style>
