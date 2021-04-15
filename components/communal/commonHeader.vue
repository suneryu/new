<template>
    <div class="commonHeader" :style="{marginTop:navBarHeight+'px'}">
        <div class="commonHeader-leftIcon" v-show="leftIcon" @click="()=>{$router.back(1,{stay: 500})}"><i class="iconfont">&#xe62d;</i></div>
        <div class="commonHeader-title">{{title}}</div>
        <div class="commonHeader-rightIcon" v-show="rightIcon"></div>
    </div>
</template>

<script>
export default {
    props:{
        title:{
            type:String,
            default:''
        },
        leftIcon:{
            type:Boolean,
            default:false
        },
        rightIcon:{
            type:Boolean,
            default:false
        },
        navBarHeight:{
            type:String,
            default:''
        }
    }
}
</script>

<style lang="less" scoped>
    .commonHeader{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content:center;
        height: 90rpx;
        border-bottom:1rpx solid #eaeaea;
        width: calc(100% - 60rpx);
        padding:0 30rpx;
        font-size: 30rpx;
        background:#fff;
		width: 100%;
        &-leftIcon{
            position: absolute;
            height: 90rpx;
            line-height: 90rpx;
            text-align: left;
            top:0;
            left: 30rpx;
            width:60rpx;
        }
        &-msg{
            font-size: 26rpx;
        }
    }
</style>

