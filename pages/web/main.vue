<template>
	<web-view :src="defaultUrl"></web-view>
</template>
<script>
import { $storage, $router, $message } from '@/utils/prototype/vue.js';
export default {
	data() {
		return {
			defaultUrl: '',
			tempUrl: '',
			tempPath: '',
			tempMenuJsPath: ''
		};
	},
	onLoad(options) {
		this.tempUrl = options.defaultUrl;
		if(options.path){
			this.tempPath = options.path;
		}
		if(options.menuJspath){
			this.tempMenuJsPath = options.menuJspath;
		}
		
		

		wx.setNavigationBarTitle({
			title: $storage.get('proappEnvName')
		});
		wx.setNavigationBarColor({
			frontColor: '#ffffff', // 必写项
			backgroundColor: '#' + this.$state.baseColor
		});
	},

	onShow() {
		if (this.tempPath) {
			this.defaultUrl =
				this.tempUrl +
				'?miniUserName=' +
				encodeURIComponent(wx.getStorageSync('miniUserName')) +
				'&miniPath=' +
				this.tempPath +
				'&menuJspath=' +
				this.tempMenuJsPath +
				'&miniToken=' +
				wx.getStorageSync('miniToken') +
				'&proappenv=' +
				wx.getStorageSync('proappenv');
		} else {
			this.defaultUrl =
				this.tempUrl +
				'?miniUserName=' +
				encodeURIComponent(wx.getStorageSync('miniUserName')) +
				'&miniToken=' +
				wx.getStorageSync('miniToken') +
				'&proappenv=' +
				wx.getStorageSync('proappenv');
		}
		$storage.set('pagesUrl', this.defaultUrl);
	},
	mounted() {},
	methods: {}
};
</script>
