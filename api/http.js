/* eslint-disable no-console */

import {
	$storage,
	$message,
	$router
} from '@/utils/prototype/vue.js'
import qs from 'qs'

const Fly = require('flyio/dist/npm/wx')

class HTTP {
	constructor() {
		this.xhr = new Fly()
		// #ifdef MP-WEIXIN
		let h = require('../config.json')
		// #endif
		// #ifdef MP-ALIPAY
		let h = require('../config-ali.json')
		// #endif
		// #ifdef MP-TOUTIAO
		let h = require('../config-bytedance.json')
		// #endif
		this.xhr.config = {
			// baseURL: wx.getExtConfigSync().attr.domain,
			baseURL: h.domain,
			parseJson: false,
			timeout: 30000,
			withCredentials: true
		}

		// 添加请求拦截器
		this.xhr.interceptors.request.use(
			opts => {
				return opts
			},
			function(error) {
				return Promise.reject(error)
			}
		)

		// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
		this.xhr.interceptors.response.use(
			response => {

				if (response.headers['saas-cookiekey']) {
					$storage.set('miniToken', response.headers['saas-cookiekey'])

				}
				if (response.headers['saas-proappenv']) {
					$storage.set('proappenv', response.headers['saas-proappenv']);
				}
				console.log(response.data.errorCode)
				console.log("response.data.errorCode")
				if (response.data.errorCode == 'nologin') {
					

					// 这里展示一个可操作的提示框，以防造成用户取消登录返回到上一个界面的循环问题
					// zhuxiaoyong 

					if (!getApp().globalData.isShowingLoginModal) {
						getApp().globalData.isShowingLoginModal = true
						
						$storage.set('nologin', 'nologin');
						$router.push('indexHDB');
						// uni.showModal({
						// 	title: '提示',
						// 	content: '请先登录',
						// 	confirmColor: '#' + $storage.get('baseColor'),
						// 	success(res) {
						// 		let pages = getCurrentPages()
						// 		if (res.confirm) {
						// 			let currentPage = pages[pages.length - 1]
						// 			let redirectUrl = currentPage.route.replace('pages/', '').replace('/main', '')
						// 			$router.push('authorization')
						// 		} else if (res.cancel) {
						// 			if (pages.length > 1) {
						// 				$router.back()
						// 			}
						// 		}
						// 		getApp().globalData.isShowingLoginModal = false 
						// 	}
						// })
					}

				}
				return response
			},
			error => {
				return Promise.resolve(error.response)
			}
		)
	}
	request(opts) {
		let saasAgent = getApp().globalData.saasAgent;
		opts.headers = opts.headers || {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			'saas-Agent': saasAgent
		}
		let cookie = wx.getStorageSync('sessionid')
		if (cookie) {
			opts.headers.cookie = wx.getStorageSync('miniToken') + '=' + cookie
		}
		if (wx.getStorageSync('saas-proappcode')) {
			opts.headers['saas-proappcode'] = wx.getStorageSync('pcode')
		}
		if (wx.getStorageSync('saas-tenantcode')) {
			opts.headers['saas-tenantcode'] = wx.getStorageSync('tcode')
		}
		return this.xhr
			.request(opts)
			.then(resp => this.log(resp, opts.url))
			.then(this.checkStatus)
	}
	get(url, data, opts) {
		// $message.loading()
		opts = opts || {}
		opts.method = 'get'
		opts.url = url
		opts.body = data
		return this.request(opts)
	}
	post(url, data, opts) {
		if (!RegExp(/queryShoppingToContract/).test(url) ||
			!RegExp(/calculateFreightFare/).test(url) ||
			!RegExp(/getTotalDiscountPrice/).test(url) ||
			!RegExp(/saveOrderToPay/).test(url) ||
			!RegExp(/paymentCommit/).test(url) ||
			!RegExp(/getUpmupointsPageByPC/).test(url) ||
			!RegExp(/queryUsercouponNember/).test(url) ||
			!RegExp(/checkVATowap/).test(url) ||
			!RegExp(/queryShopdeByMerchant/).test(url)

		) {
			//   $message.loading()
		}
		opts = opts || {}
		opts.method = 'post'
		opts.url = url
		opts.body = qs.stringify(data)
		return this.request(opts)
	}

	// 如果网络请求错误，给返回错误码
	checkStatus(response) {
		if (response && response.status === 200) {
			$message.hide()
			return response.data
		}
		$message.hide()
		return {
			code: response && response.status || '502',
			message: '接口访问错误，状态码: ' + response && response.status || '502'
		}
	}
	// 打印日志
	log(response, url) {
		if (global.isDebugger) {
			console.info('==================================================================================================')
			console.info('请求接口：' + url)
			console.info('请求参数：' + JSON.stringify(response.request.body))
			console.info('接口返回：')
			console.info(response.data)
		}
		return response
	}
}

export default new HTTP()
