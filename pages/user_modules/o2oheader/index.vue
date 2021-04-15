<template>
  <div class="headers">
    <div :style="{background:baseColor}" class="headers-box"></div>
    <div class="personal-box">
      <div class="t-box personal-msg">
        <div class="t-box-flex1 personal-img">
          <img :src="userInfo.avatarUrl || userImgurl" @click="toPersonal" />
        </div>
        <div class="t-box-flex2 personal-name">
          <h3 v-if="userInfo.nickName">{{userInfo.nickName}}</h3>
          <!-- <button
            class="nologin"
            v-if="!userInfo.nickName"
            open-type="getUserInfo"
            @getuserinfo="bindGetUserInfo"
          >登录/注册</button>-->
        </div>
        <div @click="member" class="t-box-flex1 personal-hycard">
          <img :src="hyCard" />
        </div>
      </div>
      <order :baseColor="baseColor" :myOrderName="valName" :myOrders="val"></order>
    </div>
  </div>
</template>

<script>
// import getUserInfo from '@/components/communal/getUserInfo'
import { $storage, $router } from '@/utils/prototype/vue.js'
import http from '@/api/http.js'
import {
  getTopPerMenuList,
  loginMiniProgram,
  getTopPerMenuListFPc,
  getPersonal
} from '@/api/interface.js'
import order from '../o2ohyorder/index'

export default {
  props: ['baseColor', 'myorderList', 'myOrderName'],
  components: {
    order
  },
  inject: ['for'],
  data () {
    return {
      userMessage: {},
      userImgurl: require('../../../static/img/mine/default_header.png'), // 头像
      hyCard: require('../../../static/img/mine/hycard.png'),
      userInfo: {}
    }
  },
  // mounted () {

  //   console.log(this.userInfo, 'userInfo')
  // },
  onShow: function (options) {
    console.log(1, '$storage.get(\'userInfo\')')
    this.userInfo = $storage.get('userInfo')
    // 监听小程序显示。小程序启动，或从后台进入前台显示时
  },
  computed: {
    val () {
      return this.myorderList
    },
    valName () {
      return this.myOrderName
    }
  },
  methods: {
    cancelUserInfo () { },
    // 跳转会员码页面
    member () {
      if ($storage.get('userInfo')) {
        $router.push('o2o_member/pages/MemberCode')
      } else {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
      }
    },
    toPersonal () {
      $storage.get('getTopPerMenuList').map(v => {
        if (v.menuAction == 'user') {
          v.children[0].children.map(val => {
            if (val.menuAction == 'personal') {
              $router.push(val.menuJspath)
            }
          })
        }
      })
    },
    navClick (item) {
      $router.push(item.menuJspath)
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../../common/css/common.less';
.t-box {
  display: flex;
}

.t-box-flex1 {
  flex: 1;
}

.t-box-flex2 {
  flex: 2;
}

.headers {
  padding-bottom: 0rpx;
  .headers-box {
    height: 296rpx;
    width: 100%;
    background: #168f3f;
    padding-bottom: 36rpx;
    margin-bottom: 182rpx;
  }
  .personal-box {
    width: 688rpx;
    height: 444rpx;
    border-radius: 10rpx;
    background: #ffffff;
    border-radius: 10rpx;
    margin: 0 auto;
    position: absolute;
    top: 46rpx;
    left: 32rpx;
    margin-bottom: 80rpx;
    overflow: hidden;
    .personal-msg {
      height: 154rpx;
      border: 1rpx solid #f7f7f7;
      padding: 32rpx 46rpx;
      .personal-img {
        position: relative;
        img {
          width: 140rpx;
          height: 140rpx;
          border-radius: 140rpx;
          overflow: hidden;
        }
      }
      .personal-name {
        line-height: 160rpx;
        margin-left: 30rpx;
        .nologin {
          display: inline-block;
          height: 140rpx;
          position: absolute;
          top: 32rpx;
          left: 46rpx;
          padding-left: 170rpx;
          line-height: 160rpx;
          font-size: 30rpx;
          color: #333333;
          outline: none;
          background: transparent;
        }
        button:after {
          border: none;
        }
      }
      .personal-hycard {
        img {
          width: 132rpx;
          height: 78rpx;
          margin-top: 30rpx;
        }
      }
    }
  }
}
</style>