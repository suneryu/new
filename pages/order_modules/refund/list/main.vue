<template>
    <qj-mini-refund-list ref="refundList"></qj-mini-refund-list>
</template>

<script>
export default {
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    this.$refs.refundList.loadMore();
  }
}
</script>

<style></style>




