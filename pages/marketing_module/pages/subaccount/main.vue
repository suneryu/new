<template>
	<div class="userMan" :style="{ background: baseColor }">
		<headerCenter :baseColor="baseColor" :message="message" :isShow="isShow" :nav="nav" :webmail="webmail" :userLevel="userLevel" />
		<div class='userMan-account'>
			<span style='color: #fff;font-size: 15px;'>子账号管理</span>
			<div style="margin-top: 10rpx;">
			<t-table border="0" border-color="#b2b2b2" background='#fff' >
				<t-tr font-size="14" color="#797979" align="center">
				   <t-th align="center">姓名</t-th>
				   <t-th align="center">账号</t-th>
				   <t-th align="center">操作</t-th>
				</t-tr>
				<div style='height: 400rpx;overflow-y: auto;'>
				<t-tr font-size="12" color="#797979" align="center" v-for="(item,index) in tableList" :key="index">
				    <t-td align="center">{{ item.userinfoCorp }}</t-td>
				    <t-td align="center">{{ item.userinfoPhone }}</t-td>
				    <t-td align="center"><a style='color: #7fb3d7;' @click='deleteSubAccount(item)'>删除</a></t-td>
				</t-tr>
				</div>
			</t-table>
			</div>
		</div>
		<div class='userMan-add'>
			<button type="default" @click='toCompany(1)'>添加子账号</button>
			<a @click='toCompany(2)'>查看完整企业信息</a>
		</div>
	</div>
</template>
<script>
import tTable from '@/components/t-table/t-table.vue';
import tTh from '@/components/t-table/t-th.vue';
import tTr from '@/components/t-table/t-tr.vue';
import tTd from '@/components/t-table/t-td.vue';
import headerCenter from './subaccount';
import { $storage, $router } from '@/utils/prototype/vue.js';
import http from '@/api/http.js';
import { getPersonal,queryUserinfoservicePageByJFTZ,deleteSubAccount } from '@/api/interfaceHDB.js';
import { clearTimeout, setTimeout } from 'timers';
export default {
	data() {
		return {
			show: false,
			selectNavIndex: 3,
			appid: '',
			secret: '',
			state: 'wx',
			grant_type: '',
			domains: this.$domain,
			fapiap1: '',  //发票
			yhxy1:"",    // 用户协议
			qyinfo1:"",   //企业信息
			jfsc1:"",  //积分商城
			hyscCar1:"",  //合约商城购物车
			baseColor: '',
			message: '',
			isShow: false,
			application: {}, //应用
			myOrder: [],
			userImgurl: require('../../../../static/img/mine/default_header.png'), //头像
			webmail: '',
			nav: [],
			// 多样式展示应用列表idnex 对应路由接口中的proappMenuOrder
			columnApplicationIndex: [],
			// 用户等级
			userLevel: '',
			userinfoType:"" , //用户类型
			tableList:[],
			isShow:true,
			loading:true,
			userinfoCompname:''
		};
	},
	onLoad() {
		this.baseColor = `#${$storage.get('baseColor')}`;
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: this.baseColor
		});
	},

	onShow() {
		console.log('用户类型',$storage.get('loginInfor').userinfoType)
		this.userinfoType = $storage.get('loginInfor').userinfoType;
		console.log('个人中心onShow',$storage.get('userId'));
		if ($storage.get('userInfo')) this.message = $storage.get('userInfo');
		if ($storage.get('miniUserName') && $storage.get('userId')) {
			http.get(getPersonal, {
				userId: $storage.get('userId')
			}).then(res => {
				this.userLevel = res.userinfoLevel;
				this.userinfoCompname = res.userinfoCompname
				this.getSubAccount(res.userinfoCompname)
			});	
		}
	},
	created() {
		this.yhxy1 = this.$domain + '/paas/shop/2020063000000001/2021-03-23/5f8e628099264f9b838b8588c6d15c87.png';
		this.jfsc1 = this.$domain + '/paas/shop/2020063000000001/2021-03-25/728f2dd8ba6c4d6e8a9df37ca7a51de0.png';
		this.fapiap1 = this.$domain + '/paas/shop/2020063000000001/2021-03-25/27251fe8602b4926b15f39e52f91f11a.png';
		this.hyscCar1 = this.$domain + '/paas/shop/2020063000000001/2021-03-25/277c0621c99a4e5a8fb96bbf360a5f01.png';
		this.qyinfo1 = this.$domain + '/paas/shop/2020063000000001/2021-03-25/b430fdd00a2947ed8ea99e4f11b9c9d1.png';
		 // =this.$domain + '/paas/shop/2020063000000001/2021-03-25/27251fe8602b4926b15f39e52f91f11a.png'
		// console.log('这里是个人中心')
		// this.aaa();
	},
	mounted() {
	},
	components: { headerCenter,tTable,tTh,tTr,tTd 
	},
	methods: {
		toCompany(index){
			if(index == 1){
				$router.push("marketing_module/pages/subaccount/subaccountAdd");
			}else{
				$router.push("register/companyInfo");
			}
		},
		//获取子账号
		getSubAccount(option){
			this.$qj.message.loading();
			http.get(queryUserinfoservicePageByJFTZ,{
				userinfoQuality:'dealer',
				userinfoDischannelcode:'2',
				userinfoType:1,
				userinfoOpcode2: $storage.get('loginInfor').userInfoCode,
				userinfoCompname:option
			}).then(res=>{
				if(res.list != null){
					this.tableList = res.list
				}else{
					this.tableList = []
				}
				
			})
		},
		//删除子账号
		deleteSubAccount(item){
			let that = this
			http.get(deleteSubAccount, {
				userinfoId: item.userinfoId,
				userId: item.umUserDomainBean.userId,
			}).then(res => {
				if(res.success){
					wx.showToast({
						title: "删除子账号成功！",
						duration: 2000,
						icon: "success",
						success(data) {
						}
					});
					this.getSubAccount(that.userinfoCompname)
				}else{
					uni.showModal({
						title: '提示',
						content: '删除子账号失败！',
						confirmColor: '#' + $storage.get('baseColor'),
						showCancel: false,
						success(res) {
						}
					})
				}
				
			})
		}
	}
		
}
</script>
<style lang="less">
@import '../../../../common/css/common.less';
.userMan {
	height: 100%;
	&-account{
		padding:10rpx 50rpx 50rpx 50rpx;
	}
	&-add{
		width: 100%;
		text-align: center;
		bottom: 80rpx;
		position: fixed;
		display: flex;
		flex-direction: column;
		button{
			background: #fff;
			font-size: 13px;
			font-weight: 550;
			color:#33546f;
			width: 250rpx;
			margin: auto;
		}
		a{
			color: #169bd5;
			text-decoration: underline;
			margin-top: 10rpx;
			font-size: 12px;
		}
	}
	.t-th,.t-td {
		background-color: #fff;
		height: 30rpx;
	}
	
}
</style>
