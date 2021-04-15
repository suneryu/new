<template>
	<view class="user-center">
		<header-b v-if="componentsList['headerLeftB']" :userName="userName" :headerImg="headerImg" :baseColor="baseColor" :userLevel="userLevel"></header-b>
		<profit-card v-if="componentsList['profitCard']" :baseColor="baseColor"></profit-card>
		<grid-list-four v-if="componentsList['gridList4']" :gridListCon="componentsList['gridList4']" :baseColor="baseColor"></grid-list-four>
	</view>
</template>

<script>
import headerB from '@/components/personal/headerB.vue';
import profitCard from '@/components/personal/profitCard.vue';
import gridListFour from '@/components/personal/gridListFour.vue';
import { getPersonal } from '@/api/interface.js';
import http from '@/api/http.js';
export default {
	components: {
		headerB,
		profitCard,
		gridListFour
	},
	data() {
		return {
			menuList: [],
			templateName: '',
			userName: '用户名',
			headerImg: require('@/static/img/mine/default_header.png'),
			baseColor: '',
			gridList: [],
			componentsList: {},
			gridMenuDefaultClass: '',
			gridMenu: '',
			userLevel: ''
		};
	},
	onLoad() {
		this.baseColor = `#${this.$state.baseColor}`;
		this.$setTitle(this.$storage.get('proappEnvName'));
		wx.setNavigationBarColor({
			frontColor: '#FFFFFF',
			backgroundColor: this.baseColor
		});
	},
	onShow() {
		http.get(getPersonal, {
			userId: this.$storage.get('userId')
		}).then(res => {
			let userLevelArr = res.umUserinfoQuaDomainList.filter(item => item.userinfoQuaKey == 'levelListCode_dis');
			this.userLevel = userLevelArr[0].userinfoQuaVaule1;
		});

		this.userName = this.$storage.get('userInfo').nickName;
		// 支付宝小程序中获取下来的用户头像字段是 avatar
		this.headerImg = this.$storage.get('userInfo').avatarUrl || this.$storage.get('userInfo').avatar;
		this.menuList = this.$state.currentRouter.children;
		this.rendering();
	},
	mounted() {},
	methods: {
		// 将页面中的需要展示的东西 数据进行处理
		rendering() {
			this.menuList.forEach(element => {
				this.componentsList[element.menuDefaultClass + ''] = element;
				if (element.menuDefaultClass.indexOf('gridList') > -1) {
					this.gridMenuDefaultClass = element.menuDefaultClass;
				}
			});
			if (this.gridMenuDefaultClass) {
				this.gridMenu = this.componentsList[this.gridMenuDefaultClass];
			}
		}
	}
};
</script>

<style lang="less">
.user-center {
	height: 100%;
	background: #f5f5f5;
}
</style>
