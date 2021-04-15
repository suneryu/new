<template>
	<!-- 企业信息的詳情頁 -->
	<div>{{detail}}</div>
</template>
<script>
import getUserInfo from '@/components/communal/getUserInfo';
import { $storage, $router } from '@/utils/prototype/vue.js';
import http from '@/api/http.js';
import { getUserservice,loginOut, getProappinfo, loginIn, getTopPerMenuList, getTopPerMenuListFPc, thirdLogin, loginMicroMessenger, loginMiniProgram, getPersonal } from '@/api/interfaceHDB.js';
import { clearTimeout, setTimeout } from 'timers';
export default {
	data() {
		return {
			detail: '企业信息',  //企业信息
		};
	},
	onLoad() {
		this.baseColor = `#${$storage.get('baseColor')}`;
		wx.setNavigationBarTitle({
			title: "企业信息"
		});
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: this.baseColor
		});
	},

	onShow() {
		console.log('个人中心onShow',$storage.get('userId'));
		if ($storage.get('userInfo')) this.message = $storage.get('userInfo');
		if ($storage.get('miniUserName') && $storage.get('userId')) {
			http.get(getPersonal, {
				userId: $storage.get('userId')
			}).then(res => {
				this.userLevel = res.userinfoLevel;
			});
		}
	},
	created() {
		// console.log('这里是个人中心')
		// this.aaa();
	},
	mounted() {
		
	},
	methods: {
		

		
	}
};
</script>
<style lang="less">


</style>
