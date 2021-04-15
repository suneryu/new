import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import qjMini from "qj-mini-pages";
import {
	$router,
	$storage,
	$message,
	setTitle
} from './utils/prototype/vue'
import $store from './store'
import '@/assets/font/iconfont.css';
import '@/assets/iconfont/iconfont.css';

Vue.use(uView);
Vue.use(qjMini);
Vue.config._mpTrace = true
$store.state.get = key => {
	return $store.getters[key]
}
$store.state.set = (key, value, isSave) => {
	$store.commit('set', {
		key,
		value,
		isSave
	})
}

// #ifdef MP-WEIXIN
const {
	domain,
	imgDomain,
	businessDomain
} = require('./config.json')
// #endif

// #ifdef MP-ALIPAY
const {
	domain,
	imgDomain,
	businessDomain
} = require('./config-ali.json')
// #endif

// #ifdef MP-TOUTIAO
const {
	domain,
	imgDomain,
	businessDomain
} = require('./config-bytedance.json')
// #endif

$store.state.set('$domain', domain)
$store.state.set('$imgDomain', imgDomain)
$store.state.set('$businessDomain', businessDomain)
Vue.prototype.$store = $store
Object.defineProperties(Vue.prototype, {
	$domain: {
		value: domain
	},
	$imgDomain: {
		value: imgDomain
	},
	$businessDomain: {
		value: businessDomain
	},
	$router: {
		value: $router
	},
	$storage: {
		value: $storage
	},
	$message: {
		value: $message
	},
	$setTitle: {
		value: setTitle
	},
	$state: {
		value: $store.state
	}
})

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
